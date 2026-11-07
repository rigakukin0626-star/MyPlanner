function detectBrowserLanguage(){
 const languages=navigator.languages?.length?navigator.languages:[navigator.language||"en"];
 for(const language of languages){const code=language.toLowerCase().split("-")[0];if(["zh","ja","en"].includes(code))return code;}
 return "en";
}
const UI_LANG_KEY="myPlannerLanguage";
let languagePreference=localStorage.getItem(UI_LANG_KEY)||"auto";
if(!["auto","zh","ja","en"].includes(languagePreference))languagePreference="auto";
let uiLanguage=languagePreference==="auto"?detectBrowserLanguage():languagePreference;
const uiEnglish={
"やりたいことを、一つずつ。":"Plan one thing at a time.",
"今日に戻る":"Today","クラウド同期":"Cloud Sync","ログインすると、PCとiPhoneでタスクを同期できます。":"Sign in to sync tasks across devices.",
"ログイン・同期":"Sign in & Sync","新規登録":"Sign Up","ログアウト":"Sign Out",
"通知を有効にする":"Enable Notifications","通知を再登録":"Reset Notifications",
"今日":"Today","予定":"Plans","今日のタスク":"Today's Tasks","完了":"Completed","今日の進捗":"Today's Progress",
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
 const picker=$("languageSelect");if(picker)picker.value=languagePreference;
 updateCloudSyncSummary();
 const auth=$("authStatus");if(auth&&currentUser&&(auth.dataset.statusKey==="synced"||/^(同期済み|已同步|Synced)\s*[·・]/.test(auth.textContent||""))){auth.dataset.statusKey="synced";auth.textContent=tr("同期済み","已同步","Synced")+" · "+currentUser.email;}
 document.querySelectorAll(".bilingual").forEach(el=>{
  if(!el.dataset.ja)return;
  el.textContent=tr(el.dataset.ja,el.dataset.zh);
 });
 const fieldLabels={
  ".task-field-reminder .task-field-label":["通知時刻","提醒时间","Reminder Time"],
  ".task-field-repeat .task-field-label":["繰り返し","重复频率","Repeat"],
  ".task-field-priority .task-field-label":["優先度","优先级","Priority"]
 };
 for(const [selector,values] of Object.entries(fieldLabels)){
  const el=document.querySelector(selector);if(el)el.textContent=values[uiLanguage==="ja"?0:uiLanguage==="zh"?1:2];
 }
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
const DELETED_TASKS_KEY="myPlannerDeletedTaskIds";
function deletedTaskIds(){try{return new Set(JSON.parse(localStorage.getItem(DELETED_TASKS_KEY)||"[]").map(String))}catch{return new Set()}}
function markTaskDeleted(id){const ids=deletedTaskIds();ids.add(String(id));localStorage.setItem(DELETED_TASKS_KEY,JSON.stringify([...ids]));}
function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  if (currentUser && cloudReady) queueCloudUpsert();
}
function queueCloudUpsert() {
  const deleted=deletedTaskIds();
  const snapshot = tasks.filter(t=>!deleted.has(String(t.id))).map(t=>({id:String(t.id),user_id:currentUser.id,text:t.text,date:t.date||null,completed:Boolean(t.completed),priority:["high","medium","low"].includes(t.priority)?t.priority:"medium",reminder_at:t.reminderAt||null,repeat_rule:t.repeat||"none"}));
  syncQueue = syncQueue.then(async()=>{
    if (!currentUser) return;
    setAuthStatus(bilingual("タスクを同期中…","正在同步任务…"));
    const {error}=await supabaseClient.from("tasks").upsert(snapshot,{onConflict:"id"});
    if(error) throw error;
    setAuthStatus(tr("同期済み","已同步","Synced")+" · "+currentUser.email,"synced");
  }).catch(error=>{console.error(error);setAuthStatus(tr("同期失敗：","同步失败：","Sync failed: ")+error.message);});
}
function queuePendingTaskDeletes(){
 const ids=[...deletedTaskIds()];
 if(!ids.length||!currentUser)return syncQueue;
 const owner=currentUser.id;
 syncQueue=syncQueue.catch(()=>{}).then(async()=>{
  const {error}=await supabaseClient.from("tasks").delete().eq("user_id",owner).in("id",ids);
  if(error)throw error;
  // Keep tombstones locally to prevent stale cloud records from being reimported.
 }).catch(error=>{console.error("Task deletion sync failed",error);setAuthStatus(tr("削除の同期に失敗：","删除同步失败：","Deletion sync failed: ")+error.message)});
 return syncQueue;
}
async function loadCloudTasks() {
  setAuthStatus(bilingual("クラウドから読み込み中…","正在读取云端任务…"));
  const {data,error}=await supabaseClient.from("tasks").select("id,text,date,completed,priority,reminder_at,repeat_rule").order("created_at",{ascending:true});
  if(error) throw error;
  const deleted=deletedTaskIds(),local=loadTasks(), merged=new Map();
  // 云端同 ID 记录优先；本设备尚未上传的新任务也会合并上去。
  for(const t of data||[]) if(!deleted.has(String(t.id))) merged.set(String(t.id),{id:String(t.id),text:t.text,date:t.date||null,completed:Boolean(t.completed),priority:["high","medium","low"].includes(t.priority)?t.priority:"medium",reminderAt:t.reminder_at||null,repeat:t.repeat_rule||"none"});
  // After first successful cloud sync, cloud is authoritative for missing records.
  const syncedBefore=localStorage.getItem("myPlannerCloudInitialized")==="true";
  if(!syncedBefore)for(const t of local)if(!deleted.has(String(t.id))&&!merged.has(String(t.id)))merged.set(String(t.id),t);
  tasks=Array.from(merged.values()); localStorage.setItem(STORAGE_KEY,JSON.stringify(tasks)); cloudReady=true;localStorage.setItem("myPlannerCloudInitialized","true");render();
  // Retry pending deletions before allowing further cloud upserts.
  if(deleted.size)await queuePendingTaskDeletes();
  if(!syncedBefore)queueCloudUpsert();
  else setAuthStatus(tr("同期済み","已同步","Synced"),"synced");
}
function bilingual(ja,zh){return tr(ja,zh);}
function setAuthStatus(message,statusKey=""){
 const el=$("authStatus");if(!el)return;
 el.dataset.statusKey=statusKey;
 el.textContent=statusKey==="synced"&&currentUser?tr("同期済み","已同步","Synced")+" · "+currentUser.email:message;
 updateCloudSyncSummary();
}
function updateCloudSyncSummary(){
 const heading=$("cloudSyncHeading"),summary=$("cloudSyncSummary"),details=$("cloudSyncDetails"),status=$("authStatus");
 if(!heading||!summary||!details||!status)return;
 heading.textContent=tr("クラウド同期","云端同步","Cloud sync");
 const message=status.textContent||"";
 const failed=/失敗|失败|failed|error/i.test(message);
 details.classList.toggle("sync-error",failed);
 summary.textContent=failed?tr("同期エラー","同步异常","Sync error"):!currentUser?tr("未ログイン","未登录","Not signed in"):status.dataset.statusKey==="synced"?tr("同期済み","已同步","Synced"):tr("自動同期","自动同步","Auto sync");
}
async function refreshAuthUI(){
  const {data:{session}}=await supabaseClient.auth.getSession(); currentUser=session?.user||null;
  $("authEmail").hidden=!!currentUser; $("authPassword").hidden=!!currentUser;
  $("signInBtn").hidden=!!currentUser; $("signUpBtn").hidden=!!currentUser; $("signOutBtn").hidden=!currentUser;
  $("authForm").classList.toggle("signed-in",!!currentUser);
  $("authPanel").classList.toggle("is-signed-in",!!currentUser);
  $("accountUsernameSection").hidden=!currentUser;
  if(currentUser&&document.body.dataset.activePage==="settings")chatLoadMyUsername();
  $("enableNotificationsBtn").hidden = !currentUser;
  $("resetNotificationsBtn").hidden = !currentUser;
  showWelcomeAuth();
  updateCloudSyncSummary();
  if(currentUser){if(document.body.dataset.activePage==="chat")chatShowList();try{await loadCloudTasks();}catch(e){console.error(e);setAuthStatus(tr("読み込み失敗：","云端读取失败：","Cloud load failed: ")+e.message);}}
  else{cloudReady=false;setAuthStatus(tr("未ログインです。タスクはこの端末に保存されます。","尚未登录。当前任务保存在本设备；登录后可同步。","Not signed in. Tasks are saved on this device; sign in to sync."))}
}
const welcomeTranslations={
 zh:{subtitle:"登录后开始聊天和管理日程",login:"登录",register:"注册",username:"用户名",usernameHint:"3–20位英文字母、数字或下划线",email:"邮箱",emailHint:"邮箱地址",password:"密码",passwordHint:"至少6位密码",submitRegister:"注册账号",footnote:"注册后可能需要先通过邮箱验证账号",invalid:"用户名需要3–20位小写字母、数字或下划线",registering:"正在注册…",signingIn:"正在登录…",nameFailed:"账号已创建，但用户名保存失败，请在聊天页面设置：",checkEmail:"注册申请已提交，请检查邮箱中的验证邮件，然后返回登录。",registerFailed:"注册失败：",loginFailed:"登录失败："},
 ja:{subtitle:"ログインしてチャットと予定を管理",login:"ログイン",register:"新規登録",username:"ユーザー名",usernameHint:"英小文字・数字・_（3〜20文字）",email:"メールアドレス",emailHint:"メールアドレス",password:"パスワード",passwordHint:"6文字以上",submitRegister:"アカウント登録",footnote:"登録後、メール認証が必要な場合があります",invalid:"ユーザー名は英小文字・数字・_ の3〜20文字にしてください",registering:"登録中…",signingIn:"ログイン中…",nameFailed:"アカウントは作成されましたが、ユーザー名を保存できませんでした：",checkEmail:"登録を受け付けました。確認メールを開いてからログインしてください。",registerFailed:"登録失敗：",loginFailed:"ログイン失敗："},
 en:{subtitle:"Sign in to chat and manage your plans",login:"Sign in",register:"Sign up",username:"Username",usernameHint:"3–20 lowercase letters, numbers or underscores",email:"Email",emailHint:"Email address",password:"Password",passwordHint:"At least 6 characters",submitRegister:"Create account",footnote:"You may need to verify your email after signing up",invalid:"Use 3–20 lowercase letters, numbers or underscores",registering:"Creating account…",signingIn:"Signing in…",nameFailed:"Account created, but username could not be saved: ",checkEmail:"Registration submitted. Check your email to verify your account, then sign in.",registerFailed:"Sign-up failed: ",loginFailed:"Sign-in failed: "}
};
function welcomeBrowserLanguage(){const primary=(navigator.language||"").toLowerCase().split("-")[0];if(["zh","ja","en"].includes(primary))return primary;return detectBrowserLanguage()}
function welcomeText(key){return (welcomeTranslations[welcomeBrowserLanguage()]||welcomeTranslations.en)[key]}
function updateWelcomeLanguage(){
 const t=welcomeText;
 document.querySelector(".welcome-subtitle").textContent=t("subtitle");
 $("welcomeLoginMode").textContent=t("login");$("welcomeRegisterMode").textContent=t("register");
 $("welcomeUsernameWrap").firstChild.textContent=t("username");
 $("welcomeUsername").placeholder=t("usernameHint");
 $("welcomeAuthForm").querySelector('label:has(#welcomeEmail)').firstChild.textContent=t("email");
 $("welcomeEmail").placeholder=t("emailHint");
 $("welcomeAuthForm").querySelector('label:has(#welcomePassword)').firstChild.textContent=t("password");
 $("welcomePassword").placeholder=t("passwordHint");
 document.querySelector(".welcome-footnote").textContent=t("footnote");
 $("welcomeSubmit").textContent=welcomeMode==="register"?t("submitRegister"):t("login");
}
let welcomeMode="login";
function showWelcomeAuth(){
 const visible=!currentUser;
 $("welcomeAuth").hidden=!visible;
 if(visible)updateWelcomeLanguage();
 document.body.classList.toggle("auth-required",visible);
}
function setWelcomeMode(mode){
 welcomeMode=mode;
 const register=mode==="register";
 $("welcomeUsernameWrap").hidden=!register;
 $("welcomeUsername").required=register;
 $("welcomePassword").autocomplete=register?"new-password":"current-password";
 $("welcomeLoginMode").classList.toggle("active",!register);
 $("welcomeRegisterMode").classList.toggle("active",register);
 $("welcomeSubmit").textContent=register?welcomeText("submitRegister"):welcomeText("login");
 $("welcomeStatus").textContent="";
}
$("welcomeLoginMode").addEventListener("click",()=>setWelcomeMode("login"));
$("welcomeRegisterMode").addEventListener("click",()=>setWelcomeMode("register"));
$("welcomeAuthForm").addEventListener("submit",async e=>{
 e.preventDefault();
 const email=$("welcomeEmail").value.trim(),password=$("welcomePassword").value;
 const username=$("welcomeUsername").value.trim().toLowerCase();
 if(welcomeMode==="register"&&!/^[a-z0-9_]{3,20}$/.test(username)){$("welcomeStatus").textContent="用户名需要3–20位小写字母、数字或下划线";return}
 const btn=$("welcomeSubmit");btn.disabled=true;
 $("welcomeStatus").textContent=welcomeMode==="register"?welcomeText("registering"):welcomeText("signingIn");
 try{
  if(welcomeMode==="register"){
   const {data,error}=await supabaseClient.auth.signUp({email,password,options:{emailRedirectTo:location.origin+location.pathname,data:{username}}});
   if(error)throw error;
   if(data.session){
    currentUser=data.session.user;
    const {error:nameError}=await supabaseClient.rpc("chat_set_username",{new_username:username});
    if(nameError)$("welcomeStatus").textContent=welcomeText("nameFailed")+nameError.message;
    await refreshAuthUI();
   }else $("welcomeStatus").textContent="注册申请已提交，请检查邮箱中的验证邮件，然后返回登录。";
  }else{
   const {error}=await supabaseClient.auth.signInWithPassword({email,password});
   if(error)throw error;
   await refreshAuthUI();
  }
 }catch(error){$("welcomeStatus").textContent=(welcomeMode==="register"?welcomeText("registerFailed"):welcomeText("loginFailed"))+error.message}
 finally{btn.disabled=false}
});
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
supabaseClient.auth.onAuthStateChange((_event,session)=>{currentUser=session?.user||null;showWelcomeAuth();if(!currentUser){cloudReady=false;setAuthStatus(tr("未ログインです。タスクはこの端末に保存されます。","尚未登录。当前任务保存在本设备；登录后可同步。","Not signed in. Tasks are saved on this device; sign in to sync."))}});


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
function render(){renderOverview();renderCalendar();renderTasks();renderLongTermCountdowns()}
function renderOverview(){const todays=tasks.filter(t=>t.date===todayKey),done=todays.filter(t=>t.completed).length,percent=todays.length?Math.round(done/todays.length*100):0;$ ("todayDate").textContent=new Intl.DateTimeFormat(uiLanguage==="en"?"en-US":uiLanguage==="zh"?"zh-CN":"ja-JP",{year:"numeric",month:"long",day:"numeric",weekday:"long"}).format(today);$("totalCount").textContent=todays.length;$("doneCount").textContent=done;$("progressText").textContent=percent+"%";$("progressBar").style.width=percent+"%"}
function renderCalendar(){const y=viewMonth.getFullYear(),m=viewMonth.getMonth();monthLabel.textContent=uiLanguage==="en"?new Intl.DateTimeFormat("en-US",{month:"long",year:"numeric"}).format(new Date(y,m,1)):`${y}年${m+1}月`;calendarGrid.innerHTML="";const first=new Date(y,m,1),start=new Date(y,m,1-first.getDay());const weeks=Math.ceil((first.getDay()+new Date(y,m+1,0).getDate())/7);for(let i=0;i<weeks*7;i++){const d=new Date(start);d.setDate(start.getDate()+i);const key=dateKey(d),btn=document.createElement("button");btn.type="button";btn.className="calendar-day";if(d.getMonth()!==m)btn.classList.add("muted-day");if(key===todayKey)btn.classList.add("today");if(key===selectedDate&&!showLongTerm)btn.classList.add("selected");if(tasks.some(t=>t.date===key))btn.classList.add("has-tasks");btn.textContent=d.getDate();btn.setAttribute("aria-label",key);btn.addEventListener("click",()=>{selectedDate=key;showLongTerm=false;render();switchPlannerPage("tasks")});calendarGrid.appendChild(btn)}}
function longTermCountdown(reminderAt,completed){
 const target=new Date(reminderAt);if(Number.isNaN(target.getTime()))return "";
 const now=new Date();const startToday=new Date(now.getFullYear(),now.getMonth(),now.getDate());
 const targetDay=new Date(target.getFullYear(),target.getMonth(),target.getDate());
 const days=Math.round((Date.UTC(targetDay.getFullYear(),targetDay.getMonth(),targetDay.getDate())-Date.UTC(startToday.getFullYear(),startToday.getMonth(),startToday.getDate()))/86400000);
 if(completed)return tr("完了","已完成","Completed");
 if(days>0)return tr(`予定まであと${days}日`,`距离预定还有 ${days} 天`,`${days} day${days===1?"":"s"} until plan`);
 if(days===0)return tr("予定は今日","预定就在今天","Plan is today");
 return tr(`予定日から${-days}日経過`,`已超过预定 ${-days} 天`,`${-days} day${days===-1?"":"s"} past planned date`);
}
function longTermMidnight(value){if(!value)return null;const day=value.slice(0,10);return new Date(day+"T00:00:00").toISOString()}
function updateLongTermFormMode(){
 const isLong=showLongTerm;
 const panel=document.querySelector(".tasks-panel");if(panel)panel.classList.toggle("longterm-mode",isLong);
 const input=$("reminderInput");if(input){input.type=isLong?"date":"datetime-local";input.setAttribute("aria-label",isLong?tr("予定日","预定日期","Plan date"):tr("通知時刻","提醒时间","Reminder time"));}
 const repeat=$("repeatInput");if(repeat&&isLong)repeat.value="none";
 const field=document.querySelector(".task-field-reminder .task-field-label");if(field)field.textContent=isLong?tr("予定日（当日0時に通知）","预定日期（当天0点提醒）","Plan date (notify at midnight)"):tr("通知時刻","提醒时间","Reminder time");
 const name=taskInput;if(name)name.placeholder=isLong?tr("長期予定を入力…","添加长期预定…","Add a long-term plan..."):tr("タスクを入力…","添加一件要做的事…","Add a task...");
 if(typeof refreshReminderDisplay==="function")refreshReminderDisplay();
}
function renderLongTermCountdowns(){
 const root=$("countdownRows");if(!root)return;
 const all=tasks.filter(t=>t.date===null&&!t.completed).sort((a,b)=>(a.reminderAt?new Date(a.reminderAt).getTime():Infinity)-(b.reminderAt?new Date(b.reminderAt).getTime():Infinity));
 const displayed=all.slice(0,5);root.replaceChildren();
 $("countdownCapacity").textContent=`${Math.min(all.length,5)} / 5`;
 for(let i=0;i<5;i++){
  const task=displayed[i],row=document.createElement("div");row.className="countdown-row"+(task?"":" countdown-empty");
  const number=document.createElement("span");number.className="countdown-index";number.textContent=String(i+1).padStart(2,"0");row.append(number);
  if(task){const details=document.createElement("div");details.className="countdown-details";const name=document.createElement("strong");name.textContent=task.text;details.append(name);const sub=document.createElement("small");sub.textContent=task.reminderAt?new Intl.DateTimeFormat(uiLanguage==="en"?"en-US":uiLanguage==="ja"?"ja-JP":"zh-CN",{year:"numeric",month:"short",day:"numeric"}).format(new Date(task.reminderAt)):tr("日時未設定","未设置日期","No date set");details.append(sub);row.append(details);const remaining=document.createElement("span");remaining.className="countdown-remaining";remaining.textContent=task.reminderAt?longTermCountdown(task.reminderAt,false):tr("未設定","未设日期","No date");row.append(remaining);row.addEventListener("click",()=>openEdit(task.id));row.setAttribute("role","button");row.tabIndex=0;row.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();openEdit(task.id)}});}
  else{const empty=document.createElement("span");empty.className="countdown-placeholder";empty.textContent=tr("予定を追加","添加长期预定","Add a long-term plan");row.append(empty);const plus=document.createElement("span");plus.className="countdown-plus";plus.textContent="+";row.append(plus);row.setAttribute("role","button");row.tabIndex=0;const go=()=>{document.querySelector("#pageLongTerm .tasks-panel")?.scrollIntoView({behavior:"smooth",block:"start"});setTimeout(()=>taskInput.focus({preventScroll:true}),350)};row.addEventListener("click",go);row.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();go()}});}
  root.append(row);
 }
 const hint=$("longTermHint");if(hint)hint.textContent=all.length>5?tr(`近い予定を5件表示中（全${all.length}件）`,`按时间显示最近5项（共${all.length}项）`,`Showing the nearest 5 of ${all.length} plans`):tr("予定をタップして編集できます。","点击倒计时项目即可编辑。","Tap a countdown to edit its plan.");
}
function renderTasks(){const source=tasks.filter(t=>showLongTerm?t.date===null:t.date===selectedDate),visible=source.filter(t=>filter==="all"||(filter==="active"?!t.completed:t.completed));selectedDateTitle.textContent=showLongTerm?tr("長期予定","长期预定","Long-term Plans"):tr("予定","预定","Plans");$("taskCountLabel").textContent=tr(`${visible.length} 件`,`${visible.length} 项`,`${visible.length} tasks`);taskList.innerHTML="";emptyState.hidden=visible.length>0;if(!visible.length){emptyState.querySelector("strong").textContent=filter==="all"?tr("タスクはまだありません","这里还很空","No tasks yet"):tr("該当するタスクはありません","没有符合条件的任务","No matching tasks");emptyState.querySelector("p").textContent=filter==="all"?tr("タスクを追加してみましょう","添加一项任务，开始安排吧。","Add a task to get started"):tr("フィルターを変更してください","试试切换筛选条件。","Try another filter")}const rank={high:0,medium:1,low:2};visible.sort((a,b)=>Number(a.completed)-Number(b.completed)||rank[a.priority]-rank[b.priority]);visible.forEach(task=>{const li=document.createElement("li");li.className="task-item"+(task.completed?" completed":"");const check=document.createElement("input");check.type="checkbox";check.className="task-check";check.checked=task.completed;check.setAttribute("aria-label","标记完成");check.addEventListener("change",()=>{task.completed=check.checked;saveTasks();render()});const text=document.createElement("span");text.className="task-text";text.textContent=task.text;const badge=document.createElement("span");badge.className=`priority priority-${task.priority}`;badge.textContent=priorityName(task.priority);const reminder=document.createElement("span");reminder.className="task-reminder";reminder.textContent=task.reminderAt?"⏰ "+new Intl.DateTimeFormat(uiLanguage==="en"?"en-US":uiLanguage==="ja"?"ja-JP":"zh-CN",{month:"numeric",day:"numeric",hour:"2-digit",minute:"2-digit"}).format(new Date(task.reminderAt))+(task.repeat&&task.repeat!=="none"?" · "+repeatName(task.repeat):""):"";const actions=document.createElement("div");actions.className="task-actions";const edit=document.createElement("button");edit.type="button";edit.className="task-action";edit.textContent=tr("編集","编辑","Edit");edit.addEventListener("click",()=>openEdit(task.id));const del=document.createElement("button");del.type="button";del.className="task-action";del.textContent=tr("削除","删除","Delete");del.addEventListener("click",()=>deleteTask(task.id));actions.append(edit,del);li.append(check,text,badge);if(showLongTerm&&task.reminderAt){const countdown=document.createElement("span");countdown.className="task-countdown";countdown.textContent=longTermCountdown(task.reminderAt,task.completed);li.append(countdown)}if(task.reminderAt)li.append(reminder);li.append(actions);taskList.appendChild(li)})}
taskForm.addEventListener("submit",e=>{e.preventDefault();const text=taskInput.value.trim();if(!text)return;if(showLongTerm&&!$("reminderInput").value){alert(tr("予定日を選択してください。","请选择预定日期。","Choose a plan date."));return;}if($("repeatInput").value!=="none"&&!$("reminderInput").value){alert(tr("繰り返し通知には日時が必要です。","重复提醒必须设置提醒时间","Choose a reminder time for recurring tasks."));return;}tasks.push({id:crypto.randomUUID?crypto.randomUUID():String(Date.now()+Math.random()),text,date:showLongTerm?null:selectedDate,completed:false,priority:priorityInput.value,reminderAt:$("reminderInput").value?(showLongTerm?longTermMidnight($("reminderInput").value):new Date($("reminderInput").value).toISOString()):null,repeat:$("repeatInput").value});saveTasks();taskInput.value="";priorityInput.value="medium";$("reminderInput").value="";$("repeatInput").value="none";taskInput.focus();render();updateLongTermFormMode()});
function confirmDeleteDialog(){
 return new Promise(resolve=>{
  const dialog=$("deleteDialog");
  $("deleteDialogTitle").textContent=tr("このタスクを削除しますか？","确定删除这项任务吗？","Delete this task?");
  $("cancelDelete").textContent=tr("キャンセル","取消","Cancel");
  $("confirmDelete").textContent=tr("削除","删除","Delete");
  const finish=answer=>{dialog.close();resolve(answer)};
  $("cancelDelete").onclick=()=>finish(false);
  $("confirmDelete").onclick=()=>finish(true);
  dialog.oncancel=e=>{e.preventDefault();finish(false)};
  dialog.showModal();
 });
}
async function deleteTask(id){if(!await confirmDeleteDialog())return;markTaskDeleted(id);tasks=tasks.filter(t=>String(t.id)!==String(id));localStorage.setItem(STORAGE_KEY,JSON.stringify(tasks));render();if(currentUser&&cloudReady)await queuePendingTaskDeletes()}
function refreshEditDateDisplays(){
  const date=$("editDate").value;
  const reminder=$("editReminder").value;
  $("editDateDisplay").textContent=date?date.replace(/-/g,"/"):"—";
  $("editReminderDisplay").textContent=reminder?reminder.slice(0,16).replace(/-/g,"/").replace("T"," "):"—";
}
$("editDate").addEventListener("input",refreshEditDateDisplays);
$("editDate").addEventListener("change",refreshEditDateDisplays);
$("editReminder").addEventListener("input",refreshEditDateDisplays);
$("editReminder").addEventListener("change",refreshEditDateDisplays);
function openEdit(id){const task=tasks.find(t=>t.id===id);if(!task)return;editingId=id;const isLong=task.date===null;editDialog.classList.toggle("longterm-edit",isLong);$("editReminder").type=isLong?"date":"datetime-local";$("editText").value=task.text;$("editDate").value=task.date||"";$("editPriority").value=task.priority;$("editReminder").value=task.reminderAt?(isLong?toLocalDateTimeInput(task.reminderAt).slice(0,10):toLocalDateTimeInput(task.reminderAt)):"";$("editRepeat").value=task.repeat||"none";refreshEditDateDisplays();const lbl=document.querySelector('label:has(#editReminder) > span:first-child');if(lbl)lbl.textContent=isLong?tr("予定日（当日0時に通知）","预定日期（当天0点提醒）","Plan date (midnight notification)"):tr("通知日時","提醒时间","Reminder date & time");editDialog.showModal()}
$("editForm").addEventListener("submit",e=>{e.preventDefault();const task=tasks.find(t=>t.id===editingId);if(!task)return;if($("editRepeat").value!=="none"&&!$("editReminder").value){alert(tr("繰り返し通知には日時が必要です。","重复提醒必须设置提醒时间","Choose a reminder time for recurring tasks."));return;}task.text=$("editText").value.trim();task.date=$("editDate").value||null;task.priority=$("editPriority").value;task.reminderAt=$("editReminder").value?(task.date===null?longTermMidnight($("editReminder").value):new Date($("editReminder").value).toISOString()):null;task.repeat=$("editRepeat").value;saveTasks();editDialog.close();showLongTerm=task.date===null;if(task.date)selectedDate=task.date;render();updateLongTermFormMode()});
function closeEdit(){editDialog.close();editingId=null}$("closeDialog").addEventListener("click",closeEdit);$("cancelEdit").addEventListener("click",closeEdit);
$("prevMonth").addEventListener("click",()=>{viewMonth.setMonth(viewMonth.getMonth()-1);renderCalendar()});$("nextMonth").addEventListener("click",()=>{viewMonth.setMonth(viewMonth.getMonth()+1);renderCalendar()});$("taskTabs").addEventListener("click",e=>{const btn=e.target.closest("[data-filter]");if(!btn)return;filter=btn.dataset.filter;updateTabs();renderTasks()});function updateTabs(){document.querySelectorAll(".tab").forEach(b=>b.classList.toggle("active",b.dataset.filter===filter))}
if("serviceWorker"in navigator&&location.protocol!=="file:")window.addEventListener("load",()=>navigator.serviceWorker.register("./service-worker.js").catch(console.error));

$("languageSelect").addEventListener("change",e=>{
 languagePreference=e.target.value;
 localStorage.setItem(UI_LANG_KEY,languagePreference);
 uiLanguage=languagePreference==="auto"?detectBrowserLanguage():languagePreference;
 applyLanguage();
});
document.querySelectorAll(".bilingual").forEach(el=>{const small=el.querySelector("small");if(small){el.dataset.ja=el.firstChild?.textContent||"";el.dataset.zh=small.textContent;}});
applyLanguage();refreshAuthUI();

/* v21: multi-page shell. Existing task/auth nodes are moved, never recreated. */
function switchPlannerPage(page){
 if(!["tasks","longterm","calendar","chat","settings"].includes(page))page="tasks";
 document.querySelectorAll(".app-page").forEach(el=>el.classList.toggle("active",el.dataset.page===page));
 document.querySelectorAll(".bottom-tabs .tab").forEach(el=>el.classList.toggle("active",el.dataset.target===page));
 document.body.dataset.activePage=page;
 document.body.classList.toggle("chat-open",page==="chat"&&!!chatPeer);
 if(page==="longterm"||page==="tasks"){
  showLongTerm=page==="longterm";
  const panel=document.querySelector(".tasks-panel");
  const destination=$(page==="longterm"?"pageLongTerm":"pageTasks");
  if(panel&&destination){if(page==="longterm"){const countdown=destination.querySelector(".countdown-panel");if(countdown)destination.insertBefore(panel,countdown);else destination.append(panel);}else destination.append(panel);}
  filter="all";updateTabs();renderTasks();renderLongTermCountdowns();
  updateLongTermFormMode();
 }
 if(page==="calendar")renderCalendar();
 if(page==="settings"&&currentUser)chatLoadMyUsername();
 if(page==="chat"){if(chatPeer){loadChatMessages();chatMarkRead()}else loadChatFriends();}
 window.scrollTo({top:0,behavior:"instant"});
}
function updatePlannerTabLanguage(){
 const labels={zh:["预定","长期预定","日历","聊天","设置"],ja:["予定","長期予定","カレンダー","チャット","設定"],en:["Plans","Long-term Plans","Calendar","Chat","Settings"]}[uiLanguage];
 ["tabTasksLabel","tabLongTermLabel","tabCalendarLabel","tabChatLabel","tabSettingsLabel"].forEach((id,i)=>{const el=$(id);if(el)el.textContent=labels[i]});
 const title=$("settingsTitle");if(title)title.textContent=labels[4];
 const titleCountdown=$("countdownTitle");if(titleCountdown)titleCountdown.textContent=tr("長期予定のカウントダウン","长期预定倒计时","Long-term Countdowns");
 renderLongTermCountdowns();
 updateChatLanguage();
}
function initPlannerPages(){
 const main=$("appMain"),overview=main.querySelector(".overview"),grid=main.querySelector(".main-grid");
 const calendar=grid?.querySelector(".calendar-panel"),taskPanel=grid?.querySelector(".tasks-panel");
 if(!overview||!calendar||!taskPanel)return;
 $("pageTasks").append(overview,taskPanel);
 $("pageCalendar").append(calendar);
 $("pageSettings").append($("authPanel"));
 grid.remove();
 document.querySelectorAll(".bottom-tabs .tab").forEach(btn=>btn.addEventListener("click",()=>switchPlannerPage(btn.dataset.target)));
 const picker=$("languageSelect");if(picker)picker.addEventListener("change",()=>queueMicrotask(updatePlannerTabLanguage));
 updatePlannerTabLanguage();
 switchPlannerPage("tasks");
}
// Initialize the page shell after chat state and event handlers have been declared.

/* v23: keep native iOS date picker functional, render centered text ourselves */
function refreshReminderDisplay(){
 const input=$("reminderInput"),label=$("reminderDisplay");if(!input||!label)return;
 if(!input.value){label.textContent=showLongTerm?tr("予定日を選択","选择预定日期","Select plan date"):tr("日時を選択","选择提醒时间","Select date & time");return}
 const d=new Date(input.type==="date"?input.value+"T00:00:00":input.value);
 if(Number.isNaN(d.getTime())){label.textContent=input.value;return}
 const locale=uiLanguage==="ja"?"ja-JP":uiLanguage==="zh"?"zh-CN":"en-US";
 label.textContent=new Intl.DateTimeFormat(locale,showLongTerm?{year:"numeric",month:"numeric",day:"numeric"}:{year:"numeric",month:"numeric",day:"numeric",hour:"2-digit",minute:"2-digit",hour12:false}).format(d);
}
$("reminderInput")?.addEventListener("input",refreshReminderDisplay);
$("reminderInput")?.addEventListener("change",refreshReminderDisplay);
$("languageSelect")?.addEventListener("change",()=>queueMicrotask(refreshReminderDisplay));
document.querySelector("#taskForm")?.addEventListener("submit",()=>queueMicrotask(refreshReminderDisplay));
refreshReminderDisplay();

/* My Planner Chat V1. Requires the chat database SQL before use. */
let chatPeer=null,chatSubscription=null,chatRefreshBusy=false,chatLastSignature="",chatReloadQueued=false;
let chatConfirmedCache=[],chatCachePeer=null;
let chatReadBusy=false,chatReadLastId=null;
let chatAutoScrollUntil=0;
function chatSessionKey(peer){return "myplanner-chat-cache-"+currentUser.id+"-"+peer}
function chatRestoreSnapshot(peer){
 try{
  const saved=JSON.parse(sessionStorage.getItem(chatSessionKey(peer))||"[]");
  return Array.isArray(saved)?saved.filter(m=>m&&typeof m.id!=="undefined"&&typeof m.body==="string").slice(-80):[];
 }catch{return []}
}
function chatSaveSnapshot(peer,items){
 try{sessionStorage.setItem(chatSessionKey(peer),JSON.stringify(items.slice(-80)))}catch{}
}

function chatScrollToLatest(){const root=$("chatMessages");if(!root)return;root.scrollTop=root.scrollHeight;requestAnimationFrame(()=>{if(root.isConnected)root.scrollTop=root.scrollHeight})}
let chatLastFetchAt=0;
const chatPending=new Map();
function chatText(zh,ja,en){return tr(ja,zh,en)}
function updateChatLanguage(){
 const labels={chatTitle:["チャット","好友私聊","Private Chat"],chatAddFriend:["友達を追加","添加好友","Add Friend"],chatBack:["戻る","返回","Back"]};
 for(const [id,values] of Object.entries(labels)){const el=$(id);if(el)el.textContent=values[uiLanguage==="ja"?0:uiLanguage==="zh"?1:2]}
 $("chatFriendCode").placeholder=chatText("粘贴好友的邀请码","友達のコードを貼り付け","Paste friend code");
 $("accountUsernameHeading").textContent=chatText("账号","アカウント","Account");
 $("accountUsernameHint").textContent=chatText("设置或修改用户名","ユーザー名を設定・変更","Set or change your username");
 $("accountUsernameLabel").textContent=chatText("用户名","ユーザー名","Username");
 $("accountMyUsername").placeholder=chatText("例如 planner123","例: planner123","e.g. planner123");
 $("accountSaveUsername").textContent=chatText("保存","保存","Save");
 $("chatSearchUsername").placeholder=chatText("输入好友用户名","友達のユーザー名","Friend username");
 $("chatSearchUser").textContent=chatText("搜索","検索","Search");
 $("chatCopyCode").textContent=chatText("复制我的邀请码","自分のコードをコピー","Copy my code");
 $("chatShareCode").textContent=chatText("分享","共有","Share");
 $("chatPasteCode").textContent=chatText("粘贴","貼り付け","Paste");
 $("chatInviteSection").querySelector(".chat-invite-heading").textContent=chatText("添加好友","友達を追加","Add friend");
 const invite=$("chatInviteSection");
 const searchLabel=invite.querySelector('label[for="chatSearchUsername"]');
 if(searchLabel)searchLabel.textContent=chatText("搜索好友用户名","友達のユーザー名を検索","Search friend username");
 $("chatAddFriend").textContent=chatText("添加好友","友達を追加","Add friend");
 $("chatToggleAdd").setAttribute("aria-label",chatText("添加好友","友達を追加","Add friend"));
 $("chatBack").setAttribute("aria-label",chatText("返回","戻る","Back"));
 $("chatBack").style.setProperty("--chat-back-label",JSON.stringify(chatText("返回","戻る","Back")));

 $("chatMessageInput").placeholder=chatText("输入消息…","メッセージを入力…","Type a message...");
 $("chatSendForm").querySelector("button").textContent=chatText("发送","送信","Send");
}
function chatStatus(message){$("chatStatus").textContent=message}
function chatError(error){chatStatus(error?.message||String(error))}
function chatShowList(){document.body.classList.remove("chat-open");chatConfirmedCache=[];chatCachePeer=null;chatReadLastId=null;chatLastSignature="";chatPeer=null;$("chatConversation").hidden=true;$("chatFriends").hidden=false;chatStopRealtime()}
function chatStopRealtime(){if(chatSubscription){supabaseClient.removeChannel(chatSubscription);chatSubscription=null}}
let chatFriendsRequestId=0;
let chatFriendsLoading=false;
let chatFriendsLastLoaded=0;
async function loadChatFriends(){
 if(chatPeer||chatFriendsLoading)return;
 chatFriendsLoading=true;
 const requestId=++chatFriendsRequestId;
 try{
 // Reuse the authenticated session already loaded by the app; avoid an extra network request on every chat visit.
 const verifiedUser=currentUser;
 updateChatLanguage();
 if(!currentUser){$("chatIdentity").textContent=chatText("请先到设置登录账号。","設定からログインしてください。","Sign in from Settings first.");$("chatFriends").replaceChildren();$("chatAddFriend").disabled=true;return}
 $("chatAddFriend").disabled=false;
 $("chatIdentity").textContent=chatText("我的邀请码：","自分の招待コード：","My invite code: ")+currentUser.id;
 const {data,error}=await supabaseClient.from("chat_friends").select("user_a,user_b,created_at").or("user_a.eq."+currentUser.id+",user_b.eq."+currentUser.id).order("created_at",{ascending:false});
 if(error){chatError(chatText("好友列表读取失败：","友達一覧の読み込みに失敗：","Failed to load friends: ")+error.message);return}
 const ids=[...new Set((data||[]).map(f=>f.user_a===currentUser.id?f.user_b:f.user_a))];
 chatStatus(chatText("好友列表已同步（"+ids.length+"）","友達一覧を同期しました（"+ids.length+"）","Friends synced ("+ids.length+")"));
 const root=$("chatFriends");const fragment=document.createDocumentFragment();
 if(!ids.length){const empty=document.createElement("p");empty.className="chat-hint";empty.textContent=chatText("暂无好友。把邀请码发给朋友，或输入朋友的邀请码。","友達はまだいません。招待コードで追加できます。","No friends yet. Share or enter an invite code.");fragment.append(empty);if(requestId===chatFriendsRequestId&&!chatPeer)root.replaceChildren(fragment);return}
 const {data:profiles}=await supabaseClient.from("chat_profiles").select("id,display_name").in("id",ids);
 const names=new Map((profiles||[]).map(p=>[p.id,p.display_name]));
 const {data:recent}=await supabaseClient.from("chat_messages").select("sender_id,recipient_id,body,created_at,read_at").or("sender_id.eq."+currentUser.id+",recipient_id.eq."+currentUser.id).order("created_at",{ascending:false}).limit(200);
 const last=new Map(),unread=new Map(),idSet=new Set(ids);
 for(const m of recent||[]){
  const other=m.sender_id===currentUser.id?m.recipient_id:m.sender_id;
  if(!idSet.has(other))continue;
  if(!last.has(other))last.set(other,m);
  if(m.recipient_id===currentUser.id&&!m.read_at)unread.set(other,(unread.get(other)||0)+1);
 }
 const sorted=[...ids].sort((a,b)=>(last.get(b)?.created_at||"").localeCompare(last.get(a)?.created_at||""));
 for(const id of sorted){
  const btn=document.createElement("button");btn.type="button";btn.className="chat-friend";
  const name=names.get(id)||id.slice(0,8);
  const avatar=document.createElement("span");avatar.className="chat-list-avatar";avatar.textContent=(name.trim()[0]||"?").toUpperCase();
  const content=document.createElement("span");content.className="chat-friend-info";
  const title=document.createElement("strong");title.textContent=name;
  const subtitle=document.createElement("small");const m=last.get(id);
  subtitle.textContent=m?(m.sender_id===currentUser.id?chatText("我：","私：","Me: "):"")+(m.body.startsWith(CHAT_IMAGE_PREFIX)?chatText("📷 照片","📷 写真","📷 Photo"):m.body):chatText("开始聊天","チャットを始める","Start chatting");
  content.append(title,subtitle);
  const meta=document.createElement("span");meta.className="chat-friend-meta";
  if(m){const when=document.createElement("small");when.textContent=new Date(m.created_at).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"});meta.append(when)}
  if(unread.get(id)){const count=document.createElement("b");count.className="chat-unread";count.textContent=unread.get(id)>99?"99+":String(unread.get(id));meta.append(count)}
  btn.append(avatar,content,meta);btn.addEventListener("click",()=>openChat(id,name));fragment.append(btn);
 }
 if(requestId===chatFriendsRequestId&&!chatPeer)root.replaceChildren(fragment);
 }finally{chatFriendsLoading=false;chatFriendsLastLoaded=Date.now()}
}
function chatAppendRealtime(item){
 if(!currentUser||!chatPeer||!item||!(item.sender_id===chatPeer&&item.recipient_id===currentUser.id||item.sender_id===currentUser.id&&item.recipient_id===chatPeer))return;
 const root=$("chatMessages");
 if(root.querySelector('[data-message-id="'+item.id+'"]'))return;
 const bubble=document.createElement("div");bubble.className="chat-bubble"+(item.sender_id===currentUser.id?" mine":"");
 bubble.dataset.messageId=String(item.id);
 const body=document.createElement("span");chatMessageContent(body,item.body);
 const time=document.createElement("small");time.textContent=new Date(item.created_at).toLocaleString()+(item.sender_id===currentUser.id&&item.read_at?" · "+chatText("已读","既読","Read"):"");
 bubble.append(body,time);root.append(bubble);root.scrollTop=root.scrollHeight;
 chatLastSignature="";
}
async function openChat(id,name){
 chatStopRealtime();
 chatLastSignature="";chatConfirmedCache=chatRestoreSnapshot(id);chatCachePeer=id;chatReadLastId=null;chatPeer=id;chatAutoScrollUntil=Date.now()+8000;document.body.classList.add("chat-open");
 $("chatInviteSection").hidden=true;$("chatToggleAdd").setAttribute("aria-expanded","false");
 $("chatPeerName").textContent=name;$("chatFriends").hidden=true;$("chatConversation").hidden=false;
 chatRenderMessages();chatScrollToLatest();
 const userId=currentUser.id;
 chatSubscription=supabaseClient.channel("private-chat-"+userId+"-"+id)
 .on("postgres_changes",{event:"INSERT",schema:"public",table:"chat_messages",filter:"recipient_id=eq."+userId},payload=>{if(chatPeer===payload.new.sender_id){chatAppendRealtime(payload.new);loadChatMessages()}})
 .on("postgres_changes",{event:"INSERT",schema:"public",table:"chat_messages",filter:"sender_id=eq."+userId},payload=>{if(chatPeer===payload.new.recipient_id){chatAppendRealtime(payload.new);loadChatMessages()}})
 .on("postgres_changes",{event:"UPDATE",schema:"public",table:"chat_messages",filter:"sender_id=eq."+userId},payload=>{if(chatPeer===payload.new.recipient_id)loadChatMessages()})
 .subscribe(status=>{
  if(chatPeer!==id)return;
  if(status==="CHANNEL_ERROR"||status==="TIMED_OUT")chatStatus(chatText("实时连接中断，正在使用备用同步","リアルタイム接続が中断しました","Realtime unavailable; using backup sync"));
 });
 await loadChatMessages();
 chatScrollToLatest();
 setTimeout(()=>{if(chatPeer===id&&Date.now()<chatAutoScrollUntil)chatScrollToLatest()},600);
}
const CHAT_IMAGE_PREFIX="[myplanner-image]:";
const chatImageUrlCache=new Map();
function chatMessageContent(node,body){
 if(typeof body==="string"&&body.startsWith(CHAT_IMAGE_PREFIX)){
  const path=body.slice(CHAT_IMAGE_PREFIX.length);
  if(!/^([0-9a-f-]{36})\/([0-9a-f-]{36})\/([0-9a-f-]{36})\.(jpg|png|webp|gif)$/.test(path)){node.textContent="图片格式无效";return}
  const img=document.createElement("img");img.className="chat-photo";img.loading="lazy";img.decoding="async";img.alt=chatText("照片加载中…","写真を読み込み中…","Loading photo…");
  node.append(img);
  const cached=chatImageUrlCache.get(path);
  if(cached&&cached.expires>Date.now()){img.src=cached.url;return}
  supabaseClient.storage.from("chat-photos").createSignedUrl(path,3600).then(({data,error})=>{
   if(!error&&data?.signedUrl){img.src=data.signedUrl;chatImageUrlCache.set(path,{url:data.signedUrl,expires:Date.now()+3300000})}
   else if(error)node.append(document.createTextNode(chatText("照片加载失败","写真を読み込めません","Photo unavailable")));
  });
  img.addEventListener("load",()=>{img.alt=chatText("聊天照片","チャット写真","Chat photo");if(Date.now()<chatAutoScrollUntil)chatScrollToLatest()});
  img.addEventListener("error",()=>{img.alt=chatText("照片加载失败","写真を読み込めません","Photo failed to load")});
  img.addEventListener("click",()=>{if(img.src)window.open(img.src,"_blank","noopener")});
 }else node.textContent=body;
}
function chatRenderMessages(){
 if(!currentUser||!chatPeer)return;
 const root=$("chatMessages");
 const confirmed=chatCachePeer===chatPeer?chatConfirmedCache:[];
 for(const [key,item] of chatPending){
  if(item.peer===chatPeer&&((item.serverId&&confirmed.some(m=>String(m.id)===String(item.serverId)))||(item.status==="uncertain"&&confirmed.some(m=>m.sender_id===currentUser.id&&m.recipient_id===item.peer&&m.body===item.body&&Math.abs(new Date(m.created_at).getTime()-item.createdAt)<120000))))chatPending.delete(key);
 }
 const pending=[...chatPending.entries()].filter(([,item])=>item.peer===chatPeer);
 const signature=confirmed.map(m=>m.id+":"+(m.read_at||"")).join(",")+"|"+pending.map(([key,item])=>key+":"+item.status).join(",");
 if(signature===chatLastSignature)return;
 chatLastSignature=signature;
 const fragment=document.createDocumentFragment();
 for(const item of confirmed){
  const div=document.createElement("div");div.className="chat-bubble"+(item.sender_id===currentUser.id?" mine":"");div.dataset.messageId=String(item.id);
  const body=document.createElement("span");if(item.photoUrl){const img=document.createElement("img");img.className="chat-photo";img.src=item.photoUrl;img.alt=chatText("聊天照片","チャット写真","Chat photo");body.append(img)}else chatMessageContent(body,item.body);
  const time=document.createElement("small");time.textContent=new Date(item.created_at).toLocaleString()+(item.sender_id===currentUser.id&&item.read_at?" · "+chatText("已读","既読","Read"):"");
  div.append(body,time);fragment.append(div);
 }
 for(const [key,item] of pending){
  const div=document.createElement("div");div.className="chat-bubble mine";div.dataset.pendingKey=key;
  const body=document.createElement("span");if(item.photoUrl){const img=document.createElement("img");img.className="chat-photo";img.src=item.photoUrl;img.alt=chatText("聊天照片","チャット写真","Chat photo");body.append(img)}else chatMessageContent(body,item.body);
  const time=document.createElement("small");time.textContent=item.status==="failed"?chatText("发送失败","送信失敗","Failed"):item.status==="uncertain"?chatText("发送超时·待确认","送信確認中","Delivery unconfirmed"):item.status==="sent"?chatText("已发送","送信済み","Sent"):chatText("发送中…","送信中…","Sending...");
  div.append(body,time);fragment.append(div);
 }
 const wasNearBottom=root.scrollHeight-root.scrollTop-root.clientHeight<130;
 // Append new messages without recreating existing image nodes or restarting their downloads.
 const oldNodes=[...root.children];
 const newNodes=[...fragment.children];
 let canAppend=oldNodes.length>0&&newNodes.length>=oldNodes.length;
 if(canAppend){
  for(let i=0;i<oldNodes.length;i++){
   if(oldNodes[i].dataset.messageId!==newNodes[i].dataset.messageId||
      oldNodes[i].dataset.pendingKey!==newNodes[i].dataset.pendingKey||
      oldNodes[i].textContent!==newNodes[i].textContent){canAppend=false;break}
  }
 }
 if(canAppend){for(let i=oldNodes.length;i<newNodes.length;i++)root.append(newNodes[i]);}
 else root.replaceChildren(fragment);
 if(wasNearBottom||Date.now()<chatAutoScrollUntil)chatScrollToLatest();
}
async function chatMarkRead(){
 if(chatReadBusy||!currentUser||!chatPeer||document.hidden||document.body.dataset.activePage!=="chat")return;
 const peer=chatPeer;
 const unread=(chatCachePeer===peer?chatConfirmedCache:[]).filter(m=>m.sender_id===peer&&m.recipient_id===currentUser.id&&!m.read_at);
 if(!unread.length)return;
 const latest=unread[unread.length-1].id;
 if(chatReadLastId===latest)return;
 chatReadBusy=true;
 try{
  const {error}=await supabaseClient.from("chat_messages").update({read_at:new Date().toISOString()}).eq("recipient_id",currentUser.id).eq("sender_id",peer).is("read_at",null);
  if(error)throw error;
  chatReadLastId=latest;
  for(const item of unread)item.read_at=new Date().toISOString();
 }catch(error){console.warn("Read receipt update failed",error)}
 finally{chatReadBusy=false}
}
async function loadChatMessages(){
 if(!currentUser||!chatPeer)return;
 if(chatRefreshBusy)return
 chatRefreshBusy=true;
 const requestedPeer=chatPeer;
 const {data,error}=await supabaseClient.from("chat_messages").select("id,sender_id,recipient_id,body,created_at,read_at").or("and(sender_id.eq."+currentUser.id+",recipient_id.eq."+chatPeer+"),and(sender_id.eq."+chatPeer+",recipient_id.eq."+currentUser.id+")").order("created_at",{ascending:false}).limit(200);
 if(error){chatRefreshBusy=false;chatError(error.message);return}
 if(chatPeer!==requestedPeer){chatRefreshBusy=false;return}
 chatConfirmedCache=(data||[]).reverse();
 chatSaveSnapshot(requestedPeer,chatConfirmedCache);
 chatLastFetchAt=Date.now();
 chatCachePeer=requestedPeer;
 chatRenderMessages();
 chatMarkRead();
 chatRefreshBusy=false;

}
let chatUsernameLoadedFor=null;
async function chatLoadMyUsername(){
 if(!currentUser||chatUsernameLoadedFor===currentUser.id)return;
 const {data,error}=await supabaseClient.rpc("chat_get_my_username");
 if(!error&&currentUser){$("accountMyUsername").value=data||"";chatUsernameLoadedFor=currentUser.id}
}
function chatUsernameValid(value){return /^[a-z0-9_]{3,20}$/.test(value)}
$("accountSaveUsername").addEventListener("click",async()=>{
 if(!currentUser)return;
 const username=$("accountMyUsername").value.trim().toLowerCase();
 const status=$("accountUsernameStatus");
 if(!chatUsernameValid(username)){status.textContent=chatText("用户名需要3–20位小写字母、数字或下划线","ユーザー名は英小文字・数字・_ の3〜20文字","Use 3–20 lowercase letters, numbers or underscores");return}
 const button=$("accountSaveUsername");button.disabled=true;
 try{
  const {error}=await supabaseClient.rpc("chat_set_username",{new_username:username});
  if(error)throw error;
  chatUsernameLoadedFor=currentUser.id;
  $("accountMyUsername").value=username;
  status.textContent=chatText("用户名已保存：@","ユーザー名を保存しました：@","Username saved: @")+username;
 }catch(error){status.textContent=error.message||String(error)}
 finally{button.disabled=false}
});
$("chatSearchUser").addEventListener("click",async()=>{
 if(!currentUser)return;
 const username=$("chatSearchUsername").value.trim().replace(/^@/,"").toLowerCase();
 const root=$("chatSearchResult");root.replaceChildren();
 if(!chatUsernameValid(username)){root.textContent=chatText("请输入完整用户名（3–20位）","ユーザー名を入力してください","Enter a full username");return}
 const button=$("chatSearchUser");button.disabled=true;root.textContent=chatText("搜索中…","検索中…","Searching…");
 try{
  const {data,error}=await supabaseClient.rpc("chat_find_username",{search_username:username});
  if(error)throw error;
  root.replaceChildren();
  const person=Array.isArray(data)?data[0]:null;
  if(!person){root.textContent=chatText("没有找到该用户名","ユーザーが見つかりません","No user found");return}
  const name=document.createElement("span");name.textContent="@"+person.username;
  root.append(name);
  if(person.id===currentUser.id){root.append(document.createTextNode(chatText("（这是你）","（自分）"," (You)")));return}
  const add=document.createElement("button");add.type="button";add.className="button button-primary";add.textContent=chatText("添加好友","友達を追加","Add friend");
  add.addEventListener("click",async()=>{
   add.disabled=true;
   try{const {error}=await supabaseClient.rpc("chat_add_friend",{friend_code:person.id});if(error)throw error;chatStatus(chatText("好友添加成功","友達を追加しました","Friend added"));root.replaceChildren();await loadChatFriends()}
   catch(error){chatError(error);add.disabled=false}
  });
  root.append(add);
 }catch(error){root.textContent=error.message||String(error)}
 finally{button.disabled=false}
});
$("chatCopyCode").addEventListener("click",async()=>{
 if(!currentUser)return;
 try{await navigator.clipboard.writeText(currentUser.id);chatStatus(chatText("邀请码已复制","コードをコピーしました","Code copied"))}
 catch{const identity=$("chatIdentity");identity.hidden=false;identity.textContent=currentUser.id;chatStatus(chatText("长按邀请码复制","コードを長押ししてコピー","Long press the code to copy"))}
});
$("chatShareCode").addEventListener("click",async()=>{
 if(!currentUser)return;
 const code=currentUser.id;
 if(navigator.share){try{await navigator.share({title:"My Planner",text:chatText("在 My Planner 添加我为好友：","My Planner で友達に追加：","Add me on My Planner: ")+code});return}catch(error){if(error.name==="AbortError")return}}
 try{await navigator.clipboard.writeText(code);chatStatus(chatText("邀请码已复制，可以发送给好友","コードをコピーしました","Code copied; send it to your friend"))}
 catch{const identity=$("chatIdentity");identity.hidden=false;identity.textContent=code}
});
$("chatPasteCode").addEventListener("click",async()=>{
 try{$("chatFriendCode").value=(await navigator.clipboard.readText()).trim();$("chatFriendCode").focus()}
 catch{$("chatFriendCode").focus();chatStatus(chatText("请长按输入框粘贴","入力欄を長押しして貼り付け","Long press the field to paste"))}
});
$("chatAddFriend").addEventListener("click",async()=>{
 if(!currentUser)return;
 const code=$("chatFriendCode").value.trim().toLowerCase();
 if(!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(code)){chatStatus(chatText("请输入完整的好友邀请码。","正しい招待コードを入力してください。","Enter a complete invite code."));return}
 const {error}=await supabaseClient.rpc("chat_add_friend",{friend_code:code});
 if(error){chatError(error);return}
 $("chatFriendCode").value="";chatStatus(chatText("好友添加成功！","友達を追加しました。","Friend added."));await loadChatFriends();
});
$("chatBack").addEventListener("click",chatShowList);
$("chatPhotoInput").addEventListener("change",async e=>{
 const file=e.target.files?.[0];e.target.value="";
 if(!file||!currentUser||!chatPeer)return;
 if(!file.type.startsWith("image/")){chatStatus(chatText("请选择图片","画像を選択してください","Select an image"));return}
 if(file.size>8*1024*1024){chatStatus(chatText("图片不能超过8MB","画像は8MB以下にしてください","Image must be under 8MB"));return}
 const peer=chatPeer,key="photo-"+crypto.randomUUID();
 const localUrl=URL.createObjectURL(file);
 chatPending.set(key,{peer,body:"",photoUrl:localUrl,status:"sending",serverId:null,createdAt:Date.now()});
 chatRenderMessages();
 try{
  const type=file.type==="image/png"?"png":file.type==="image/webp"?"webp":file.type==="image/gif"?"gif":"jpg";
  const path=currentUser.id+"/"+peer+"/"+crypto.randomUUID()+"."+type;
  const {error:uploadError}=await supabaseClient.storage.from("chat-photos").upload(path,file,{contentType:file.type,upsert:false});
  if(uploadError)throw uploadError;
  const body=CHAT_IMAGE_PREFIX+path;
  const {data,error}=await supabaseClient.from("chat_messages").insert({sender_id:currentUser.id,recipient_id:peer,body}).select("id").single();
  if(error)throw error;
  const pending=chatPending.get(key);if(pending){pending.serverId=data.id;pending.status="sent";pending.body=body}
  if(chatPeer===peer){chatRenderMessages();loadChatMessages()}
 }catch(error){
  const pending=chatPending.get(key);if(pending)pending.status="failed";
  if(chatPeer===peer){chatRenderMessages();chatError(error)}
 }
});
$("chatSendForm").addEventListener("submit",async e=>{
 e.preventDefault();if(!currentUser||!chatPeer)return;
 const input=$("chatMessageInput"),body=input.value.trim();if(!body)return;
 const peer=chatPeer;
 const key="pending-"+Date.now()+"-"+Math.random().toString(36).slice(2);
 chatPending.set(key,{peer,body,status:"sending",serverId:null,createdAt:Date.now()});
 input.value="";
 // Always render from the local pending queue first; network work starts afterward.
 chatRenderMessages();
 try{
  const controller=new AbortController();
  const timeout=setTimeout(()=>controller.abort(),12000);
  let data,error;
  try{({data,error}=await supabaseClient.from("chat_messages").insert({sender_id:currentUser.id,recipient_id:peer,body}).select("id").single().abortSignal(controller.signal))}finally{clearTimeout(timeout)}
  if(error)throw error;
  const pending=chatPending.get(key);if(pending){pending.serverId=data.id;pending.status="sent"}
  if(chatPeer===peer){chatRenderMessages();await loadChatMessages()}
 }catch(error){
  const pending=chatPending.get(key);if(pending)pending.status=error?.name==="AbortError"?"uncertain":"failed";
  if(chatPeer===peer){chatRenderMessages();chatError(error?.name==="AbortError"?chatText("网络超时，正在核实消息是否送达，请勿重复发送。","通信がタイムアウトしました。送信状況を確認中です。","Network timeout. Checking delivery; do not resend yet."):error);loadChatMessages()}
 }

});

/* v74: batch bursts of realtime events into one reconciliation request. */
let chatReconcileTimer=null;
function scheduleChatReconcile(){
 if(chatReconcileTimer!==null)return;
 chatReconcileTimer=setTimeout(()=>{
  chatReconcileTimer=null;
  if(!document.hidden&&document.body.dataset.activePage==="chat"&&chatPeer)loadChatMessages();
 },900);
}
/* v39: mobile Safari may suspend Realtime sockets; periodically reconcile from DB while chat is visible. */
setInterval(()=>{
 if(document.hidden||document.body.dataset.activePage!=="chat"||!currentUser)return;
 if(chatPeer){if(Date.now()-chatLastFetchAt>6500)loadChatMessages()}else if(Date.now()-chatFriendsLastLoaded>20000)loadChatFriends();
},3000);
document.addEventListener("visibilitychange",()=>{
 if(!document.hidden&&document.body.dataset.activePage==="chat"&&currentUser){if(chatPeer)loadChatMessages();else loadChatFriends()}
});

/* Chat V43: LINE-style friend management drawer. */
$("chatToggleAdd").addEventListener("click",()=>{
 const panel=$("chatInviteSection"),open=panel.hidden;
 panel.hidden=!open;$("chatToggleAdd").setAttribute("aria-expanded",String(open));
 if(open&&currentUser){$("chatIdentity").textContent=chatText("我的邀请码：","自分の招待コード：","My invite code: ")+currentUser.id;}
});

// v66: initialize navigation only after chatPeer and all chat handlers exist.
initPlannerPages();
showWelcomeAuth();
