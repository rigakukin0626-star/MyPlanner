const UI_LANG_KEY="myPlannerLanguage";
let uiLanguage=localStorage.getItem(UI_LANG_KEY)||"ja";
if(!["zh","ja","en"].includes(uiLanguage))uiLanguage="ja";
const uiEnglish={
"やりたいことを、一つずつ。":"Plan one thing at a time.",
"今日に戻る":"Today","クラウド同期":"Cloud Sync","ログインすると、PCとiPhoneでタスクを同期できます。":"Sign in to sync tasks across devices.",
"ログイン・同期":"Sign in & Sync","新規登録":"Sign Up","ログアウト":"Sign Out",
"通知を有効にする":"Enable Notifications","通知を再登録":"Reset Notifications",
"今日":"Today","今日のタスク":"Today's Tasks","完了":"Completed","今日の進捗":"Today's Progress",
"カレンダー":"Calendar","長期タスク":"Long-term Tasks","＋ 追加":"+ Add",
"すべて":"All","未完了":"Active","タスクはまだありません":"No tasks yet",
"タスクを追加して、今日の予定を立てましょう。":"Add a task to plan your day.",
"タスクを編集":"Edit Task","日付":"Date","通知日時":"Reminder Time",
"繰り返し通知":"Repeat Reminder","優先度":"Priority","キャンセル":"Cancel","変更を保存":"Save Changes",
"編集":"Edit","削除":"Delete","毎日":"Daily","毎週":"Weekly","毎月":"Monthly",
"タスクを追加してみましょう":"Add a task to get started",
"該当するタスクはありません":"No matching tasks","フィルターを変更してください":"Try another filter",
"同期済み":"Synced","タスクを同期中…":"Syncing tasks…","クラウドから読み込み中…":"Loading cloud tasks…",
"通知を再登録しました。":"Notifications re-registered.","通知が有効になりました。":"Notifications enabled.",
"長期タスク":"Long-term Tasks"
};
function tr(ja,zh,en){return uiLanguage==="zh"?zh:uiLanguage==="en"?(en||uiEnglish[ja]||ja):ja;}
function applyLanguage(){
 document.documentElement.lang=uiLanguage==="zh"?"zh-CN":uiLanguage;
 const picker=$("languageSelect");if(picker)picker.value=uiLanguage;
 document.querySelectorAll(".bilingual").forEach(el=>{
  if(!el.dataset.ja)return;
  el.textContent=tr(el.dataset.ja,el.dataset.zh);
 });
 const placeholders={
 authEmail:["メールアドレス","邮箱地址","Email address"],
 authPassword:["パスワード（6文字以上）","密码（至少6位）","Password (6+ characters)"],
 taskInput:["タスクを入力…","添加一件要做的事…","Add a task…"]
 };
 for(const [id,values] of Object.entries(placeholders))$(id).placeholder=values[uiLanguage==="ja"?0:uiLanguage==="zh"?1:2];
 const repeat={none:["繰り返さない","不重复","Never"],daily:["毎日","每天","Daily"],weekly:["毎週","每周","Weekly"],monthly:["毎月","每月","Monthly"]};
 for(const id of ["repeatInput","editRepeat"])for(const option of $(id).options)option.textContent=repeat[option.value][uiLanguage==="ja"?0:uiLanguage==="zh"?1:2];
 const priorities={high:["優先度：高","高优先级","High priority"],medium:["優先度：中","中优先级","Medium priority"],low:["優先度：低","低优先级","Low priority"]};
 for(const option of $("priorityInput").options)option.textContent=priorities[option.value][uiLanguage==="ja"?0:uiLanguage==="zh"?1:2];
 for(const option of $("editPriority").options)option.textContent=({high:["高","高","High"],medium:["中","中","Medium"],low:["低","低","Low"]})[option.value][uiLanguage==="ja"?0:uiLanguage==="zh"?1:2];
 $("calendarWeekdaysFix")?.remove();
 const days=uiLanguage==="zh"?["日","一","二","三","四","五","六"]:uiLanguage==="en"?["Sun","Mon","Tue","Wed","Thu","Fri","Sat"]:["日","月","火","水","木","金","土"];
 document.querySelectorAll(".calendar-weekdays span").forEach((el,i)=>el.textContent=days[i]);
 const hint=document.querySelector(".calendar-hint");if(hint)hint.lastChild.textContent=" "+tr("タスクがある日","有任务的日期","Days with tasks");
 const note=document.querySelector(".storage-note");if(note)note.textContent=tr("データはこの端末にも保存されます。端末を変更する前に同期を確認してください。","数据也保存在本设备。更换设备前请确认已同步。","Data is also stored on this device. Check sync before switching devices.");
 if(!currentUser)setAuthStatus(tr("未ログインです。タスクはこの端末に保存されます。","尚未登录。当前任务保存在本设备；登录后可同步。","Not signed in. Tasks are saved on this device; sign in to sync."));
 render();
}
const STORAGE_KEY = "myPlannerTasks";
const $ = (id) => document.getElementById(id);
const taskForm = $("taskForm"), taskInput = $("taskInput"), priorityInput = $("priorityInput");
const taskList = $("taskList"), emptyState = $("emptyState"), calendarGrid = $("calendarGrid");
const monthLabel = $("monthLabel"), selectedDateTitle = $("selectedDateTitle"), editDialog = $("editDialog");
const today = new Date();
const dateKey = (date) => `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,"0")}-${String(date.getDate()).padStart(2,"0")}`;
const todayKey = dateKey(today);
let selectedDate = todayKey, viewMonth = new Date(today.getFullYear(), today.getMonth(), 1);
let filter = "all", showLongTerm = false, editingId = null, tasks = loadTasks();

// Supabase Project URL + Publishable key（可安全放在前端；不要使用 Secret key）
const SUPABASE_URL = "https://nushjnpeftksloyzojgd.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_bDN-tQp_ZUu77LxcAVpjgQ_fM9f3-c9";
const VAPID_PUBLIC_KEY = "BKHHrBNwurKrucCP0CsLKtLZnaqQXS0QeKtg8h08OwTjcgLmEG4azIVCd3yyrwK6J5udn7wM24mI606qKOJtwKw";
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
let currentUser = null, cloudReady = false, syncQueue = Promise.resolve();

function loadTasks() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(saved) ? saved.map(t => ({id:String(t.id ?? Date.now()+Math.random()),text:String(t.text ?? ""),date:t.date || null,completed:Boolean(t.completed),priority:["high","medium","low"].includes(t.priority)?t.priority:"medium",reminderAt:t.reminderAt||null,repeat:t.repeat||"none"})).filter(t=>t.text.trim()) : [];
  } catch { return []; }
}
function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  if (currentUser && cloudReady) queueCloudUpsert();
}
function queueCloudUpsert() {
  const snapshot = tasks.map(t=>({id:String(t.id),user_id:currentUser.id,text:t.text,date:t.date||null,completed:Boolean(t.completed),priority:["high","medium","low"].includes(t.priority)?t.priority:"medium",reminder_at:t.reminderAt||null,repeat_rule:t.repeat||"none"}));
  syncQueue = syncQueue.then(async()=>{
    if (!currentUser) return;
    setAuthStatus(bilingual("タスクを同期中…","正在同步任务…"));
    const {error}=await supabaseClient.from("tasks").upsert(snapshot,{onConflict:"id"});
    if(error) throw error;
    setAuthStatus(bilingual("同期済み","已同步")+" · "+currentUser.email);
  }).catch(error=>{console.error(error);setAuthStatus(tr("同期失敗：","同步失败：","Sync failed: ")+error.message);});
}
async function loadCloudTasks() {
  setAuthStatus(bilingual("クラウドから読み込み中…","正在读取云端任务…"));
  const {data,error}=await supabaseClient.from("tasks").select("id,text,date,completed,priority,reminder_at,repeat_rule").order("created_at",{ascending:true});
  if(error) throw error;
  const local=loadTasks(), merged=new Map();
  // 云端同 ID 记录优先；本设备尚未上传的新任务也会合并上去。
  for(const t of data||[]) merged.set(String(t.id),{id:String(t.id),text:t.text,date:t.date||null,completed:Boolean(t.completed),priority:["high","medium","low"].includes(t.priority)?t.priority:"medium",reminderAt:t.reminder_at||null,repeat:t.repeat_rule||"none"});
  for(const t of local) if(!merged.has(String(t.id))) merged.set(String(t.id),t);
  tasks=Array.from(merged.values()); localStorage.setItem(STORAGE_KEY,JSON.stringify(tasks)); cloudReady=true; render();
  await queueCloudUpsert();
}
function bilingual(ja,zh){return tr(ja,zh);}
function setAuthStatus(message){const el=$("authStatus");if(el)el.textContent=message;}
async function refreshAuthUI(){
  const {data:{session}}=await supabaseClient.auth.getSession(); currentUser=session?.user||null;
  $("authEmail").hidden=!!currentUser; $("authPassword").hidden=!!currentUser;
  $("signInBtn").hidden=!!currentUser; $("signUpBtn").hidden=!!currentUser; $("signOutBtn").hidden=!currentUser;
  $("authForm").classList.toggle("signed-in",!!currentUser);
  $("enableNotificationsBtn").hidden = !currentUser;
  $("resetNotificationsBtn").hidden = !currentUser;
  if(currentUser){try{await loadCloudTasks();}catch(e){console.error(e);setAuthStatus(tr("読み込み失敗：","云端读取失败：","Cloud load failed: ")+e.message);}}
  else{cloudReady=false;setAuthStatus(tr("未ログインです。タスクはこの端末に保存されます。","尚未登录。当前任务保存在本设备；登录后可同步。","Not signed in. Tasks are saved on this device; sign in to sync."))}
}
$("authForm").addEventListener("submit",async e=>{
  e.preventDefault(); const email=$("authEmail").value.trim(),password=$("authPassword").value;
  $("signInBtn").disabled=true;setAuthStatus(tr("ログイン中…","正在登录…","Signing in…"));
  try{const {error}=await supabaseClient.auth.signInWithPassword({email,password});if(error)throw error;await refreshAuthUI();}
  catch(err){setAuthStatus(tr("ログイン失敗：","登录失败：","Sign in failed: ")+err.message)}finally{$("signInBtn").disabled=false}
});
$("signUpBtn").addEventListener("click",async()=>{
  const email=$("authEmail").value.trim(),password=$("authPassword").value;
  if(!email||password.length<6){setAuthStatus(tr("メールアドレスと6文字以上のパスワードを入力してください。","请填写邮箱，并设置至少 6 位密码。","Enter an email and password of at least 6 characters."));return}
  $("signUpBtn").disabled=true;setAuthStatus(tr("アカウント作成中…","正在创建账号…","Creating account…"));
  try{const {data,error}=await supabaseClient.auth.signUp({email,password,options:{emailRedirectTo:location.origin+location.pathname}});if(error)throw error;if(data.session)await refreshAuthUI();else setAuthStatus(tr("登録しました。メールの確認リンクを開いてください。","注册成功！请到邮箱点击确认链接，再回来登录。","Account created. Check your email to confirm."));}
  catch(err){setAuthStatus(tr("登録失敗：","注册失败：","Sign up failed: ")+err.message)}finally{$("signUpBtn").disabled=false}
});
$("signOutBtn").addEventListener("click",async()=>{const {error}=await supabaseClient.auth.signOut();if(error)setAuthStatus(tr("ログアウト失敗：","退出失败：","Sign out failed: ")+error.message);else{currentUser=null;cloudReady=false;await refreshAuthUI()}});
supabaseClient.auth.onAuthStateChange((_event,session)=>{currentUser=session?.user||null;if(!currentUser){cloudReady=false;setAuthStatus("尚未登录。当前任务保存在本设备；登录后可同步。")}});


function urlBase64ToUint8Array(base64String){
  const padding="=".repeat((4-base64String.length%4)%4);
  const base64=(base64String+padding).replace(/-/g,"+").replace(/_/g,"/");
  const raw=atob(base64),output=new Uint8Array(raw.length);
  for(let i=0;i<raw.length;i++)output[i]=raw.charCodeAt(i);
  return output;
}
async function registerDeviceNotifications(forceReset = false){
  const status=$("notificationStatus");
  if(!currentUser){status.textContent="请先登录账号。";return}
  if(!("serviceWorker" in navigator)||!("PushManager" in window)){status.textContent="此浏览器不支持推送通知。";return}
  try{
    status.textContent="正在申请通知权限…";
    const permission=await Notification.requestPermission();
    if(permission!=="granted"){status.textContent="通知权限未开启，请在浏览器设置中允许通知。";return}
    const registration=await navigator.serviceWorker.ready;
    let subscription=await registration.pushManager.getSubscription();
    const targetKey=urlBase64ToUint8Array(VAPID_PUBLIC_KEY);
    if(subscription){
      const currentKey=subscription.options?.applicationServerKey;
      const existing=currentKey?new Uint8Array(currentKey):null;
      const matches=existing&&existing.length===targetKey.length&&existing.every((byte,i)=>byte===targetKey[i]);
      if(forceReset || !matches){
        const oldEndpoint=subscription.endpoint;
        await subscription.unsubscribe();
        subscription=null;
        const {error:deleteError}=await supabaseClient.from("push_subscriptions").delete().eq("endpoint",oldEndpoint).eq("user_id",currentUser.id);
        if(deleteError)console.warn("旧设备订阅记录清理失败",deleteError);
      }
    }
    if(!subscription){
      subscription=await registration.pushManager.subscribe({userVisibleOnly:true,applicationServerKey:urlBase64ToUint8Array(VAPID_PUBLIC_KEY)});
    }
    const data=subscription.toJSON();
    const {error}=await supabaseClient.from("push_subscriptions").upsert({
      user_id:currentUser.id,
      endpoint:data.endpoint,
      p256dh:data.keys.p256dh,
      auth:data.keys.auth
    },{onConflict:"endpoint"});
    if(error)throw error;
    status.textContent=forceReset?bilingual("通知を再登録しました。","已重新订阅设备通知！"):bilingual("通知が有効になりました。","设备通知已开启！");
  }catch(error){console.error(error);status.textContent="开启失败："+error.message}
}
$("enableNotificationsBtn").addEventListener("click",()=>registerDeviceNotifications(false));
$("resetNotificationsBtn").addEventListener("click",()=>registerDeviceNotifications(true));

function toLocalDateTimeInput(value){const d=new Date(value);if(Number.isNaN(d.getTime()))return "";const local=new Date(d.getTime()-d.getTimezoneOffset()*60000);return local.toISOString().slice(0,16)}
function repeatName(rule){return ({daily:tr("毎日","每天","Daily"),weekly:tr("毎週","每周","Weekly"),monthly:tr("毎月","每月","Monthly")})[rule]||""}
function priorityName(p){return ({high:tr("高","高","High"),medium:tr("中","中","Medium"),low:tr("低","低","Low")})[p]||"Medium"}
function render(){renderOverview();renderCalendar();renderTasks()}
function renderOverview(){const todays=tasks.filter(t=>t.date===todayKey),done=todays.filter(t=>t.completed).length,percent=todays.length?Math.round(done/todays.length*100):0;$ ("todayDate").textContent=new Intl.DateTimeFormat(uiLanguage==="en"?"en-US":uiLanguage==="zh"?"zh-CN":"ja-JP",{year:"numeric",month:"long",day:"numeric",weekday:"long"}).format(today);$("totalCount").textContent=todays.length;$("doneCount").textContent=done;$("progressText").textContent=percent+"%";$("progressBar").style.width=percent+"%"}
function renderCalendar(){const y=viewMonth.getFullYear(),m=viewMonth.getMonth();monthLabel.textContent=uiLanguage==="en"?new Intl.DateTimeFormat("en-US",{month:"long",year:"numeric"}).format(new Date(y,m,1)):`${y}年${m+1}月`;calendarGrid.innerHTML="";const first=new Date(y,m,1),start=new Date(y,m,1-first.getDay());for(let i=0;i<42;i++){const d=new Date(start);d.setDate(start.getDate()+i);const key=dateKey(d),btn=document.createElement("button");btn.type="button";btn.className="calendar-day";if(d.getMonth()!==m)btn.classList.add("muted-day");if(key===todayKey)btn.classList.add("today");if(key===selectedDate&&!showLongTerm)btn.classList.add("selected");if(tasks.some(t=>t.date===key))btn.classList.add("has-tasks");btn.textContent=d.getDate();btn.setAttribute("aria-label",key);btn.addEventListener("click",()=>{selectedDate=key;showLongTerm=false;render()});calendarGrid.appendChild(btn)}}
function renderTasks(){const source=tasks.filter(t=>showLongTerm?t.date===null:t.date===selectedDate),visible=source.filter(t=>filter==="all"||(filter==="active"?!t.completed:t.completed));selectedDateTitle.textContent=showLongTerm?tr("長期タスク","长期任务","Long-term Tasks"):(selectedDate===todayKey?tr("今日のタスク","今日任务","Today\'s Tasks"):tr(`${selectedDate} のタスク`,`${selectedDate} 任务`,`${selectedDate} Tasks`));$("taskCountLabel").textContent=tr(`${visible.length} 件`,`${visible.length} 项`,`${visible.length} tasks`);taskList.innerHTML="";emptyState.hidden=visible.length>0;if(!visible.length){emptyState.querySelector("strong").textContent=filter==="all"?tr("タスクはまだありません","这里还很空","No tasks yet"):tr("該当するタスクはありません","没有符合条件的任务","No matching tasks");emptyState.querySelector("p").textContent=filter==="all"?tr("タスクを追加してみましょう","添加一项任务，开始安排吧。","Add a task to get started"):tr("フィルターを変更してください","试试切换筛选条件。","Try another filter")}const rank={high:0,medium:1,low:2};visible.sort((a,b)=>Number(a.completed)-Number(b.completed)||rank[a.priority]-rank[b.priority]);visible.forEach(task=>{const li=document.createElement("li");li.className="task-item"+(task.completed?" completed":"");const check=document.createElement("input");check.type="checkbox";check.className="task-check";check.checked=task.completed;check.setAttribute("aria-label","标记完成");check.addEventListener("change",()=>{task.completed=check.checked;saveTasks();render()});const text=document.createElement("span");text.className="task-text";text.textContent=task.text;const badge=document.createElement("span");badge.className=`priority priority-${task.priority}`;badge.textContent=priorityName(task.priority);const reminder=document.createElement("span");reminder.className="task-reminder";reminder.textContent=task.reminderAt?"⏰ "+new Intl.DateTimeFormat(uiLanguage==="en"?"en-US":uiLanguage==="ja"?"ja-JP":"zh-CN",{month:"numeric",day:"numeric",hour:"2-digit",minute:"2-digit"}).format(new Date(task.reminderAt))+(task.repeat&&task.repeat!=="none"?" · "+repeatName(task.repeat):""):"";const actions=document.createElement("div");actions.className="task-actions";const edit=document.createElement("button");edit.type="button";edit.className="task-action";edit.textContent=tr("編集","编辑","Edit");edit.addEventListener("click",()=>openEdit(task.id));const del=document.createElement("button");del.type="button";del.className="task-action";del.textContent=tr("削除","删除","Delete");del.addEventListener("click",()=>deleteTask(task.id));actions.append(edit,del);li.append(check,text,badge);if(task.reminderAt)li.append(reminder);li.append(actions);taskList.appendChild(li)})}
taskForm.addEventListener("submit",e=>{e.preventDefault();const text=taskInput.value.trim();if(!text)return;if($("repeatInput").value!=="none"&&!$("reminderInput").value){alert(tr("繰り返し通知には日時が必要です。","重复提醒必须设置提醒时间","Choose a reminder time for recurring tasks."));return;}tasks.push({id:crypto.randomUUID?crypto.randomUUID():String(Date.now()+Math.random()),text,date:showLongTerm?null:selectedDate,completed:false,priority:priorityInput.value,reminderAt:$("reminderInput").value?new Date($("reminderInput").value).toISOString():null,repeat:$("repeatInput").value});saveTasks();taskInput.value="";priorityInput.value="medium";$("reminderInput").value="";$("repeatInput").value="none";taskInput.focus();render()});
async function deleteTask(id){if(!confirm(tr("このタスクを削除しますか？","确定删除这项任务吗？","Delete this task?")))return;tasks=tasks.filter(t=>t.id!==id);saveTasks();if(currentUser&&cloudReady){const {error}=await supabaseClient.from("tasks").delete().eq("id",String(id));if(error)setAuthStatus("云端删除失败："+error.message)}render()}
function openEdit(id){const task=tasks.find(t=>t.id===id);if(!task)return;editingId=id;$("editText").value=task.text;$("editDate").value=task.date||"";$("editPriority").value=task.priority;$("editReminder").value=task.reminderAt?toLocalDateTimeInput(task.reminderAt):"";$("editRepeat").value=task.repeat||"none";editDialog.showModal()}
$("editForm").addEventListener("submit",e=>{e.preventDefault();const task=tasks.find(t=>t.id===editingId);if(!task)return;if($("editRepeat").value!=="none"&&!$("editReminder").value){alert(tr("繰り返し通知には日時が必要です。","重复提醒必须设置提醒时间","Choose a reminder time for recurring tasks."));return;}task.text=$("editText").value.trim();task.date=$("editDate").value||null;task.priority=$("editPriority").value;task.reminderAt=$("editReminder").value?new Date($("editReminder").value).toISOString():null;task.repeat=$("editRepeat").value;saveTasks();editDialog.close();showLongTerm=task.date===null;if(task.date)selectedDate=task.date;render()});
function closeEdit(){editDialog.close();editingId=null}$("closeDialog").addEventListener("click",closeEdit);$("cancelEdit").addEventListener("click",closeEdit);
$("prevMonth").addEventListener("click",()=>{viewMonth.setMonth(viewMonth.getMonth()-1);renderCalendar()});$("nextMonth").addEventListener("click",()=>{viewMonth.setMonth(viewMonth.getMonth()+1);renderCalendar()});$("todayBtn").addEventListener("click",()=>{selectedDate=todayKey;showLongTerm=false;viewMonth=new Date(today.getFullYear(),today.getMonth(),1);render()});$("longTermBtn").addEventListener("click",()=>{showLongTerm=true;filter="all";updateTabs();renderTasks()});$("taskTabs").addEventListener("click",e=>{const btn=e.target.closest("[data-filter]");if(!btn)return;filter=btn.dataset.filter;updateTabs();renderTasks()});function updateTabs(){document.querySelectorAll(".tab").forEach(b=>b.classList.toggle("active",b.dataset.filter===filter))}
if("serviceWorker"in navigator&&location.protocol!=="file:")window.addEventListener("load",()=>navigator.serviceWorker.register("./service-worker.js").catch(console.error));
$("languageSelect").addEventListener("change",e=>{uiLanguage=e.target.value;localStorage.setItem(UI_LANG_KEY,uiLanguage);applyLanguage();});
document.querySelectorAll(".bilingual").forEach(el=>{const small=el.querySelector("small");if(small){el.dataset.ja=el.firstChild?.textContent||"";el.dataset.zh=small.textContent;}});
applyLanguage();refreshAuthUI();
