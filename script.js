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
    return Array.isArray(saved) ? saved.map(t => ({id:String(t.id ?? Date.now()+Math.random()),text:String(t.text ?? ""),date:t.date || null,completed:Boolean(t.completed),priority:["high","medium","low"].includes(t.priority)?t.priority:"medium",reminderAt:t.reminderAt||null})).filter(t=>t.text.trim()) : [];
  } catch { return []; }
}
function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  if (currentUser && cloudReady) queueCloudUpsert();
}
function queueCloudUpsert() {
  const snapshot = tasks.map(t=>({id:String(t.id),user_id:currentUser.id,text:t.text,date:t.date||null,completed:Boolean(t.completed),priority:["high","medium","low"].includes(t.priority)?t.priority:"medium",reminder_at:t.reminderAt||null}));
  syncQueue = syncQueue.then(async()=>{
    if (!currentUser) return;
    setAuthStatus("正在同步任务…");
    const {error}=await supabaseClient.from("tasks").upsert(snapshot,{onConflict:"id"});
    if(error) throw error;
    setAuthStatus("已同步 · "+currentUser.email);
  }).catch(error=>{console.error(error);setAuthStatus("同步失败："+error.message);});
}
async function loadCloudTasks() {
  setAuthStatus("正在读取云端任务…");
  const {data,error}=await supabaseClient.from("tasks").select("id,text,date,completed,priority,reminder_at").order("created_at",{ascending:true});
  if(error) throw error;
  const local=loadTasks(), merged=new Map();
  // 云端同 ID 记录优先；本设备尚未上传的新任务也会合并上去。
  for(const t of data||[]) merged.set(String(t.id),{id:String(t.id),text:t.text,date:t.date||null,completed:Boolean(t.completed),priority:["high","medium","low"].includes(t.priority)?t.priority:"medium",reminderAt:t.reminder_at||null});
  for(const t of local) if(!merged.has(String(t.id))) merged.set(String(t.id),t);
  tasks=Array.from(merged.values()); localStorage.setItem(STORAGE_KEY,JSON.stringify(tasks)); cloudReady=true; render();
  await queueCloudUpsert();
}
function setAuthStatus(message){const el=$("authStatus");if(el)el.textContent=message;}
async function refreshAuthUI(){
  const {data:{session}}=await supabaseClient.auth.getSession(); currentUser=session?.user||null;
  $("authEmail").hidden=!!currentUser; $("authPassword").hidden=!!currentUser;
  $("signInBtn").hidden=!!currentUser; $("signUpBtn").hidden=!!currentUser; $("signOutBtn").hidden=!currentUser;
  $("authForm").classList.toggle("signed-in",!!currentUser);
  $("enableNotificationsBtn").hidden = !currentUser;
  if(currentUser){try{await loadCloudTasks();}catch(e){console.error(e);setAuthStatus("云端读取失败："+e.message);}}
  else{cloudReady=false;setAuthStatus("尚未登录。当前任务保存在本设备；登录后可同步。")}
}
$("authForm").addEventListener("submit",async e=>{
  e.preventDefault(); const email=$("authEmail").value.trim(),password=$("authPassword").value;
  $("signInBtn").disabled=true;setAuthStatus("正在登录…");
  try{const {error}=await supabaseClient.auth.signInWithPassword({email,password});if(error)throw error;await refreshAuthUI();}
  catch(err){setAuthStatus("登录失败："+err.message)}finally{$("signInBtn").disabled=false}
});
$("signUpBtn").addEventListener("click",async()=>{
  const email=$("authEmail").value.trim(),password=$("authPassword").value;
  if(!email||password.length<6){setAuthStatus("请填写邮箱，并设置至少 6 位密码。");return}
  $("signUpBtn").disabled=true;setAuthStatus("正在创建账号…");
  try{const {data,error}=await supabaseClient.auth.signUp({email,password,options:{emailRedirectTo:location.origin+location.pathname}});if(error)throw error;if(data.session)await refreshAuthUI();else setAuthStatus("注册成功！请到邮箱点击确认链接，再回来登录。");}
  catch(err){setAuthStatus("注册失败："+err.message)}finally{$("signUpBtn").disabled=false}
});
$("signOutBtn").addEventListener("click",async()=>{const {error}=await supabaseClient.auth.signOut();if(error)setAuthStatus("退出失败："+error.message);else{currentUser=null;cloudReady=false;await refreshAuthUI()}});
supabaseClient.auth.onAuthStateChange((_event,session)=>{currentUser=session?.user||null;if(!currentUser){cloudReady=false;setAuthStatus("尚未登录。当前任务保存在本设备；登录后可同步。")}});


function urlBase64ToUint8Array(base64String){
  const padding="=".repeat((4-base64String.length%4)%4);
  const base64=(base64String+padding).replace(/-/g,"+").replace(/_/g,"/");
  const raw=atob(base64),output=new Uint8Array(raw.length);
  for(let i=0;i<raw.length;i++)output[i]=raw.charCodeAt(i);
  return output;
}
$("enableNotificationsBtn").addEventListener("click",async()=>{
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
      if(!matches){
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
    status.textContent="设备通知已开启！";
  }catch(error){console.error(error);status.textContent="开启失败："+error.message}
});

function toLocalDateTimeInput(value){const d=new Date(value);if(Number.isNaN(d.getTime()))return "";const local=new Date(d.getTime()-d.getTimezoneOffset()*60000);return local.toISOString().slice(0,16)}
function priorityName(p){return({high:"高",medium:"中",low:"低"})[p]||"中"}
function render(){renderOverview();renderCalendar();renderTasks()}
function renderOverview(){const todays=tasks.filter(t=>t.date===todayKey),done=todays.filter(t=>t.completed).length,percent=todays.length?Math.round(done/todays.length*100):0;$ ("todayDate").textContent=new Intl.DateTimeFormat("zh-CN",{year:"numeric",month:"long",day:"numeric",weekday:"long"}).format(today);$("totalCount").textContent=todays.length;$("doneCount").textContent=done;$("progressText").textContent=percent+"%";$("progressBar").style.width=percent+"%"}
function renderCalendar(){const y=viewMonth.getFullYear(),m=viewMonth.getMonth();monthLabel.textContent=`${y}年${m+1}月`;calendarGrid.innerHTML="";const first=new Date(y,m,1),start=new Date(y,m,1-first.getDay());for(let i=0;i<42;i++){const d=new Date(start);d.setDate(start.getDate()+i);const key=dateKey(d),btn=document.createElement("button");btn.type="button";btn.className="calendar-day";if(d.getMonth()!==m)btn.classList.add("muted-day");if(key===todayKey)btn.classList.add("today");if(key===selectedDate&&!showLongTerm)btn.classList.add("selected");if(tasks.some(t=>t.date===key))btn.classList.add("has-tasks");btn.textContent=d.getDate();btn.setAttribute("aria-label",key);btn.addEventListener("click",()=>{selectedDate=key;showLongTerm=false;render()});calendarGrid.appendChild(btn)}}
function renderTasks(){const source=tasks.filter(t=>showLongTerm?t.date===null:t.date===selectedDate),visible=source.filter(t=>filter==="all"||(filter==="active"?!t.completed:t.completed));selectedDateTitle.textContent=showLongTerm?"长期任务":(selectedDate===todayKey?"今日任务":`${selectedDate} 任务`);$("taskCountLabel").textContent=`${visible.length} 项`;taskList.innerHTML="";emptyState.hidden=visible.length>0;if(!visible.length){emptyState.querySelector("strong").textContent=filter==="all"?"这里还很空":"没有符合条件的任务";emptyState.querySelector("p").textContent=filter==="all"?"添加一项任务，开始安排吧。":"试试切换筛选条件。"}const rank={high:0,medium:1,low:2};visible.sort((a,b)=>Number(a.completed)-Number(b.completed)||rank[a.priority]-rank[b.priority]);visible.forEach(task=>{const li=document.createElement("li");li.className="task-item"+(task.completed?" completed":"");const check=document.createElement("input");check.type="checkbox";check.className="task-check";check.checked=task.completed;check.setAttribute("aria-label","标记完成");check.addEventListener("change",()=>{task.completed=check.checked;saveTasks();render()});const text=document.createElement("span");text.className="task-text";text.textContent=task.text;const badge=document.createElement("span");badge.className=`priority priority-${task.priority}`;badge.textContent=priorityName(task.priority);const reminder=document.createElement("span");reminder.className="task-reminder";reminder.textContent=task.reminderAt?"⏰ "+new Intl.DateTimeFormat("zh-CN",{month:"numeric",day:"numeric",hour:"2-digit",minute:"2-digit"}).format(new Date(task.reminderAt)):"";const actions=document.createElement("div");actions.className="task-actions";const edit=document.createElement("button");edit.type="button";edit.className="task-action";edit.textContent="编辑";edit.addEventListener("click",()=>openEdit(task.id));const del=document.createElement("button");del.type="button";del.className="task-action";del.textContent="删除";del.addEventListener("click",()=>deleteTask(task.id));actions.append(edit,del);li.append(check,text,badge);if(task.reminderAt)li.append(reminder);li.append(actions);taskList.appendChild(li)})}
taskForm.addEventListener("submit",e=>{e.preventDefault();const text=taskInput.value.trim();if(!text)return;tasks.push({id:crypto.randomUUID?crypto.randomUUID():String(Date.now()+Math.random()),text,date:showLongTerm?null:selectedDate,completed:false,priority:priorityInput.value,reminderAt:$("reminderInput").value?new Date($("reminderInput").value).toISOString():null});saveTasks();taskInput.value="";priorityInput.value="medium";$("reminderInput").value="";taskInput.focus();render()});
async function deleteTask(id){if(!confirm("确定删除这项任务吗？"))return;tasks=tasks.filter(t=>t.id!==id);saveTasks();if(currentUser&&cloudReady){const {error}=await supabaseClient.from("tasks").delete().eq("id",String(id));if(error)setAuthStatus("云端删除失败："+error.message)}render()}
function openEdit(id){const task=tasks.find(t=>t.id===id);if(!task)return;editingId=id;$("editText").value=task.text;$("editDate").value=task.date||"";$("editPriority").value=task.priority;$("editReminder").value=task.reminderAt?toLocalDateTimeInput(task.reminderAt):"";editDialog.showModal()}
$("editForm").addEventListener("submit",e=>{e.preventDefault();const task=tasks.find(t=>t.id===editingId);if(!task)return;task.text=$("editText").value.trim();task.date=$("editDate").value||null;task.priority=$("editPriority").value;task.reminderAt=$("editReminder").value?new Date($("editReminder").value).toISOString():null;saveTasks();editDialog.close();showLongTerm=task.date===null;if(task.date)selectedDate=task.date;render()});
function closeEdit(){editDialog.close();editingId=null}$("closeDialog").addEventListener("click",closeEdit);$("cancelEdit").addEventListener("click",closeEdit);
$("prevMonth").addEventListener("click",()=>{viewMonth.setMonth(viewMonth.getMonth()-1);renderCalendar()});$("nextMonth").addEventListener("click",()=>{viewMonth.setMonth(viewMonth.getMonth()+1);renderCalendar()});$("todayBtn").addEventListener("click",()=>{selectedDate=todayKey;showLongTerm=false;viewMonth=new Date(today.getFullYear(),today.getMonth(),1);render()});$("longTermBtn").addEventListener("click",()=>{showLongTerm=true;filter="all";updateTabs();renderTasks()});$("taskTabs").addEventListener("click",e=>{const btn=e.target.closest("[data-filter]");if(!btn)return;filter=btn.dataset.filter;updateTabs();renderTasks()});function updateTabs(){document.querySelectorAll(".tab").forEach(b=>b.classList.toggle("active",b.dataset.filter===filter))}
if("serviceWorker"in navigator&&location.protocol!=="file:")window.addEventListener("load",()=>navigator.serviceWorker.register("./service-worker.js").catch(console.error));
render();refreshAuthUI();
