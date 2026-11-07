import { createClient } from "npm:@supabase/supabase-js@2";
import webpush from "npm:web-push@3.6.7";

// Called only by a trusted scheduler. Never expose the cron secret in the PWA.
const required = (name: string) => {
  const value = Deno.env.get(name);
  if (!value) throw new Error("Missing secret: " + name);
  return value;
};

Deno.serve(async (req) => {
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });
  const secret = Deno.env.get("TASK_REMINDER_CRON_SECRET");
  if (!secret || req.headers.get("x-task-cron-secret") !== secret) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const db = createClient(required("SUPABASE_URL"), required("SUPABASE_SERVICE_ROLE_KEY"));
    webpush.setVapidDetails(
      required("VAPID_SUBJECT"),
      required("VAPID_PUBLIC_KEY"),
      required("VAPID_PRIVATE_KEY")
    );
    const now = new Date();
    // One-time reminders only; do not unexpectedly notify for old overdue tasks.
    const since = new Date(now.getTime() - 3 * 60_000);
    const { data: tasks, error } = await db.from("tasks")
      .select("id,user_id,text,reminder_at,completed,repeat_rule")
      .eq("completed", false)
      .eq("repeat_rule", "none")
      .gte("reminder_at", since.toISOString())
      .lte("reminder_at", now.toISOString())
      .order("reminder_at", { ascending: true })
      .limit(100);
    if (error) throw error;

    let sent = 0, failed = 0, claimed = 0;
    for (const task of tasks || []) {
      // Primary key on (task_id, reminder_at) prevents duplicate sends across runs.
      const { error: claimError } = await db.from("task_push_deliveries")
        .insert({ task_id: String(task.id), reminder_at: task.reminder_at, user_id: task.user_id });
      if (claimError) {
        if (claimError.code === "23505") continue;
        console.error("Could not claim reminder", task.id, claimError.message);
        failed++;
        continue;
      }
      claimed++;
      const { data: subscriptions, error: subscriptionError } = await db
        .from("push_subscriptions").select("endpoint,p256dh,auth")
        .eq("user_id", task.user_id);
      if (subscriptionError) {
        console.error("Subscription lookup failed", subscriptionError.message);
        failed++;
        await db.from("task_push_deliveries").delete()
          .eq("task_id", String(task.id)).eq("reminder_at", task.reminder_at);
        continue;
      }
      let success = 0;
      for (const sub of subscriptions || []) {
        try {
          await webpush.sendNotification({
            endpoint: sub.endpoint,
            keys: { p256dh: sub.p256dh, auth: sub.auth }
          }, JSON.stringify({
            type: "task",
            title: "My Planner · 任务提醒",
            body: String(task.text || "你有一项待办任务").slice(0, 160),
            url: "./",
            tag: "task-" + task.id + "-" + task.reminder_at,
            silent_when_active: false
          }));
          sent++;
          success++;
        } catch (e) {
          failed++;
          const status = (e as {statusCode?:number}).statusCode;
          if (status === 404 || status === 410) {
            await db.from("push_subscriptions").delete().eq("endpoint", sub.endpoint);
          } else {
            console.error("Push delivery failed", status, (e as Error).message);
          }
        }
      }
      if (success) {
        await db.from("task_push_deliveries").update({ sent_at: new Date().toISOString() })
          .eq("task_id", String(task.id)).eq("reminder_at", task.reminder_at);
      } else {
        // Retry on next scheduler run if no device was successfully notified.
        await db.from("task_push_deliveries").delete()
          .eq("task_id", String(task.id)).eq("reminder_at", task.reminder_at);
      }
    }
    return Response.json({ checked: (tasks || []).length, claimed, sent, failed });
  } catch (error) {
    console.error("Reminder scheduler failed", error);
    return Response.json({ error: "Reminder scheduler failed" }, { status: 500 });
  }
});
