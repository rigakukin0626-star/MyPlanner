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
 const staticLabels={
  appearanceTitle:["外観 / テーマ","外观 / 主题","Appearance"],
  appearanceDescription:["表示モードを選択してください。設定はこの端末に保存されます。","选择显示模式，设置将保存在本设备。","Choose a display mode. Your preference is saved on this device."],
  notificationSettingsLabel:["通知設定","通知设置","Notification settings"],
  chatSearchUsername:["ユーザー名で友達を検索","搜索好友用户名","Search friends by username"],
  chatGroupName:["グループ名","群名称","Group name"],
  chatGroupJoinCode:["グループ招待コード","群邀请码","Group invite code"]
 };
 const idx=uiLanguage==="ja"?0:uiLanguage==="zh"?1:2;
 for(const [id,values] of Object.entries(staticLabels)){
  const el=$(id);if(!el)continue;
  if(["chatSearchUsername","chatGroupName","chatGroupJoinCode"].includes(id))el.placeholder=values[idx];
  else if(id==="notificationSettingsLabel"){const label=el.querySelector(".bilingual");if(label)label.textContent=values[idx];}
  else el.textContent=values[idx];
 }
 document.querySelectorAll("[data-appearance]").forEach(btn=>{
  const labels={auto:["システムに合わせる","跟随系统","System"],light:["ライト","浅色","Light"],dark:["ダーク","深色","Dark"]};
  const key=btn.dataset.appearance;if(labels[key])btn.textContent=labels[key][idx];
 });
 const novaCopy={
  novaHeaderCaption:["MY DAILY SPACE","我的私人空间","YOUR PERSONAL SPACE"],
  novaHeroCaption:["今日のダッシュボード","今天的计划","YOUR DAY, YOUR WAY"],
  novaChatCaption:["メッセージ · つながる","消息 · 随时联系","MESSAGES · CONNECT"],
  novaSettingsCaption:["自分らしくカスタマイズ","打造你的专属空间","MAKE IT YOURS"]
 };
 for(const [id,values] of Object.entries(novaCopy)){
  const el=$(id);if(el)el.textContent=values[idx];
 }
 updateWelcomeLanguage();
 // applyLanguage also runs during startup before the chat module initializes.
 if(window.myPlannerChatReady)updateChatLanguage();
 window.chatRefreshLocalizedViews?.();
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
const VAPID_PUBLIC_KEY = "BBCa_k5YKCe72B2hn3oioo90yiDHQi1L6dcfH11Vxwuffyk7l7VwAVtX73UnvCZklb9fNfoMkQ3pTp6xYUZzh60";
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
let authUiRefreshSequence=0;
async function refreshAuthUI(){
  const sequence=++authUiRefreshSequence;
  const {data:{session}}=await supabaseClient.auth.getSession();
  if(sequence!==authUiRefreshSequence)return;
  const previousUserId=currentUser?.id;
  currentUser=session?.user||null;
  if(previousUserId!==currentUser?.id){
   chatConfirmedCache=[];chatPending.clear();chatLastSignature="";
   chatImageUrlCache.clear();chatImageUrlRequests.clear();
   groupListSignature="";groupListLastLoaded=0;groupLastSignature="";
   if(chatActiveGroup)groupClose();
   if(chatPeer)chatShowList();
  }
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
  if(currentUser){if(document.body.dataset.activePage==="chat"){if(chatMode==="group"){groupShowCachedList();groupLoadList(true).catch(console.error)}else{chatShowCachedFriends();loadChatFriends().catch(console.error)}}try{await loadCloudTasks();}catch(e){console.error(e);setAuthStatus(tr("読み込み失敗：","云端读取失败：","Cloud load failed: ")+e.message);}const warmUser=currentUser?.id;if(warmUser)setTimeout(()=>{if(currentUser?.id===warmUser)groupWarmListCache().catch(console.warn)},500)}
  else{cloudReady=false;setAuthStatus(tr("未ログインです。タスクはこの端末に保存されます。","尚未登录。当前任务保存在本设备；登录后可同步。","Not signed in. Tasks are saved on this device; sign in to sync."))}
}
const welcomeTranslations={
 zh:{subtitle:"登录后开始聊天和管理日程",login:"登录",register:"注册",username:"用户名",usernameHint:"3–20位英文字母、数字或下划线",email:"邮箱",emailHint:"邮箱地址",password:"密码",passwordHint:"至少6位密码",submitRegister:"注册账号",footnote:"注册后可能需要先通过邮箱验证账号",invalid:"用户名需要3–20位小写字母、数字或下划线",registering:"正在注册…",signingIn:"正在登录…",nameFailed:"账号已创建，但用户名保存失败，请在聊天页面设置：",checkEmail:"注册申请已提交，请检查邮箱中的验证邮件，然后返回登录。",registerFailed:"注册失败：",loginFailed:"登录失败："},
 ja:{subtitle:"ログインしてチャットと予定を管理",login:"ログイン",register:"新規登録",username:"ユーザー名",usernameHint:"英小文字・数字・_（3〜20文字）",email:"メールアドレス",emailHint:"メールアドレス",password:"パスワード",passwordHint:"6文字以上",submitRegister:"アカウント登録",footnote:"登録後、メール認証が必要な場合があります",invalid:"ユーザー名は英小文字・数字・_ の3〜20文字にしてください",registering:"登録中…",signingIn:"ログイン中…",nameFailed:"アカウントは作成されましたが、ユーザー名を保存できませんでした：",checkEmail:"登録を受け付けました。確認メールを開いてからログインしてください。",registerFailed:"登録失敗：",loginFailed:"ログイン失敗："},
 en:{subtitle:"Sign in to chat and manage your plans",login:"Sign in",register:"Sign up",username:"Username",usernameHint:"3–20 lowercase letters, numbers or underscores",email:"Email",emailHint:"Email address",password:"Password",passwordHint:"At least 6 characters",submitRegister:"Create account",footnote:"You may need to verify your email after signing up",invalid:"Use 3–20 lowercase letters, numbers or underscores",registering:"Creating account…",signingIn:"Signing in…",nameFailed:"Account created, but username could not be saved: ",checkEmail:"Registration submitted. Check your email to verify your account, then sign in.",registerFailed:"Sign-up failed: ",loginFailed:"Sign-in failed: "}
};
function welcomeBrowserLanguage(){return uiLanguage;}
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
 if(welcomeMode==="register"&&!/^[a-z0-9_]{3,20}$/.test(username)){$("welcomeStatus").textContent=welcomeText("invalid");return}
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
   }else $("welcomeStatus").textContent=welcomeText("checkEmail");
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
let pushRegistrationBusy=false;
async function registerDeviceNotifications(forceReset = false){
  const status=$("notificationStatus");
  if(pushRegistrationBusy)return;
  if(!currentUser){status.textContent=tr("先にログインしてください。","请先登录账号。","Please sign in first.");return}
  if(!("Notification" in window)||!("serviceWorker" in navigator)||!("PushManager" in window)){updatePushSupportHint();return}
  pushRegistrationBusy=true;
  const buttons=[$("enableNotificationsBtn"),$("resetNotificationsBtn")];
  buttons.forEach(button=>button.disabled=true);
  try{
    status.textContent=tr("通知の許可を確認しています…","正在检查通知权限…","Checking notification permission…");
    const permission=await Notification.requestPermission();
    if(permission!=="granted"){status.textContent=tr("通知が許可されていません。端末の設定をご確認ください。","通知未获授权，请检查设备通知设置。","Notifications are not allowed. Check device settings.");return}
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
    status.textContent=forceReset?tr("通知を再登録しました。","通知已重新订阅。","Notifications re-registered."):tr("この端末の通知を有効にしました。","本设备通知已启用。","Notifications enabled on this device.");
  }catch(error){console.error(error);status.textContent=tr("通知の設定に失敗：","通知设置失败：","Notification setup failed: ")+error.message}
  finally{pushRegistrationBusy=false;buttons.forEach(button=>button.disabled=false)}
}
$("enableNotificationsBtn").addEventListener("click",()=>registerDeviceNotifications(false));
$("resetNotificationsBtn").addEventListener("click",()=>registerDeviceNotifications(true));
function updatePushSupportHint(){
 const status=$("notificationStatus");if(!status)return;
 if(!("Notification" in window)||!("PushManager" in window)||!("serviceWorker" in navigator)){
  status.textContent=chatText("此浏览器不支持后台推送。iPhone 请使用 Safari 添加到主屏幕后打开。","バックグラウンド通知にはホーム画面に追加したアプリが必要です。","Background push requires a supported browser; on iPhone, add the app to Home Screen.");
 }else if(Notification.permission==="denied"){
  status.textContent=chatText("通知已被系统拒绝，请在设备设置中允许通知。","通知が拒否されています。端末の設定で許可してください。","Notifications are blocked. Enable them in device settings.");
 }else if(Notification.permission==="granted"){
  status.textContent=tr("通知は許可されています。端末の登録状況を確認できます。","通知权限已开启，可检查设备订阅状态。","Notification permission granted. You can check this device subscription.");
  navigator.serviceWorker.ready.then(reg=>reg.pushManager.getSubscription()).then(sub=>{if(sub&&Notification.permission==="granted"&&status.textContent.includes(tr("通知は許可されています。","通知权限已开启","Notification permission granted").slice(0,6)))status.textContent=tr("この端末はプッシュ通知を登録済みです。","本设备已订阅推送通知。","Push notifications subscribed on this device.");}).catch(()=>{});
 }
}
navigator.serviceWorker?.addEventListener("message",event=>{
 if(event.data?.type!=="MYPLANNER_PUSH_RECEIVED")return;
 if(document.body.dataset.activePage!=="chat"||!currentUser)return;
 if(chatActiveGroup)groupScheduleRefresh();
 else if(chatPeer)loadChatMessages();
 else if(chatMode==="group")groupLoadList(true);
 else loadChatFriends();
});
window.addEventListener("pageshow",()=>{
 if(location.hash==="#chat"){
  switchPlannerPage("chat");
  if(currentUser)chatRefreshAfterReconnect();
 }
 updatePushSupportHint();
});


function toLocalDateTimeInput(value){const d=new Date(value);if(Number.isNaN(d.getTime()))return "";const local=new Date(d.getTime()-d.getTimezoneOffset()*60000);return local.toISOString().slice(0,16)}
function repeatName(rule){return ({daily:tr("毎日","每天","Daily"),weekly:tr("毎週","每周","Weekly"),monthly:tr("毎月","每月","Monthly")})[rule]||""}
function priorityName(p){return ({high:tr("高","高","High"),medium:tr("中","中","Medium"),low:tr("低","低","Low")})[p]||"Medium"}
function render(){renderOverview();renderCalendar();renderTasks();renderLongTermCountdowns()}
function renderOverview(){const todays=tasks.filter(t=>t.date===todayKey),done=todays.filter(t=>t.completed).length,percent=todays.length?Math.round(done/todays.length*100):0;$ ("todayDate").textContent=new Intl.DateTimeFormat(uiLanguage==="en"?"en-US":uiLanguage==="zh"?"zh-CN":"ja-JP",{year:"numeric",month:"long",day:"numeric",weekday:"long"}).format(today);$("totalCount").textContent=todays.length;$("doneCount").textContent=done;$("progressText").textContent=percent+"%";$("progressBar").style.width=percent+"%"}
function renderCalendar(){const y=viewMonth.getFullYear(),m=viewMonth.getMonth();monthLabel.textContent=uiLanguage==="en"?new Intl.DateTimeFormat("en-US",{month:"long",year:"numeric"}).format(new Date(y,m,1)):`${y}年${m+1}月`;const markedDates=new Set(tasks.filter(t=>t.date).map(t=>t.date));const fragment=document.createDocumentFragment();const first=new Date(y,m,1),start=new Date(y,m,1-first.getDay());const weeks=Math.ceil((first.getDay()+new Date(y,m+1,0).getDate())/7);for(let i=0;i<weeks*7;i++){const d=new Date(start);d.setDate(start.getDate()+i);const key=dateKey(d),btn=document.createElement("button");btn.type="button";btn.className="calendar-day";if(d.getMonth()!==m)btn.classList.add("muted-day");if(key===todayKey)btn.classList.add("today");if(key===selectedDate&&!showLongTerm)btn.classList.add("selected");if(markedDates.has(key))btn.classList.add("has-tasks");btn.textContent=d.getDate();btn.setAttribute("aria-label",key);btn.addEventListener("click",()=>{selectedDate=key;showLongTerm=false;render();switchPlannerPage("tasks")});fragment.appendChild(btn)}calendarGrid.replaceChildren(fragment)}
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
function renderTasks(){const source=tasks.filter(t=>showLongTerm?t.date===null:t.date===selectedDate),visible=source.filter(t=>filter==="all"||(filter==="active"?!t.completed:t.completed));selectedDateTitle.textContent=showLongTerm?tr("長期予定","长期预定","Long-term Plans"):tr("予定","预定","Plans");$("taskCountLabel").textContent=tr(`${visible.length} 件`,`${visible.length} 项`,`${visible.length} tasks`);const taskFragment=document.createDocumentFragment();emptyState.hidden=visible.length>0;if(!visible.length){emptyState.querySelector("strong").textContent=filter==="all"?tr("タスクはまだありません","这里还很空","No tasks yet"):tr("該当するタスクはありません","没有符合条件的任务","No matching tasks");emptyState.querySelector("p").textContent=filter==="all"?tr("タスクを追加してみましょう","添加一项任务，开始安排吧。","Add a task to get started"):tr("フィルターを変更してください","试试切换筛选条件。","Try another filter")}const rank={high:0,medium:1,low:2};visible.sort((a,b)=>Number(a.completed)-Number(b.completed)||rank[a.priority]-rank[b.priority]);visible.forEach(task=>{const li=document.createElement("li");li.className="task-item"+(task.completed?" completed":"");const check=document.createElement("input");check.type="checkbox";check.className="task-check";check.checked=task.completed;check.setAttribute("aria-label","标记完成");check.addEventListener("change",()=>{task.completed=check.checked;saveTasks();render()});const text=document.createElement("span");text.className="task-text";text.textContent=task.text;const badge=document.createElement("span");badge.className=`priority priority-${task.priority}`;badge.textContent=priorityName(task.priority);const reminder=document.createElement("span");reminder.className="task-reminder";reminder.textContent=task.reminderAt?"⏰ "+new Intl.DateTimeFormat(uiLanguage==="en"?"en-US":uiLanguage==="ja"?"ja-JP":"zh-CN",{month:"numeric",day:"numeric",hour:"2-digit",minute:"2-digit"}).format(new Date(task.reminderAt))+(task.repeat&&task.repeat!=="none"?" · "+repeatName(task.repeat):""):"";const actions=document.createElement("div");actions.className="task-actions";const edit=document.createElement("button");edit.type="button";edit.className="task-action";edit.textContent=tr("編集","编辑","Edit");edit.addEventListener("click",()=>openEdit(task.id));const del=document.createElement("button");del.type="button";del.className="task-action";del.textContent=tr("削除","删除","Delete");del.addEventListener("click",()=>deleteTask(task.id));actions.append(edit,del);li.append(check,text,badge);if(showLongTerm&&task.reminderAt){const countdown=document.createElement("span");countdown.className="task-countdown";countdown.textContent=longTermCountdown(task.reminderAt,task.completed);li.append(countdown)}if(task.reminderAt)li.append(reminder);li.append(actions);taskFragment.appendChild(li)});taskList.replaceChildren(taskFragment)}
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
 if(document.body.dataset.activePage===page)return;
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
 if(page==="chat"){if(!chatPeer&&!chatActiveGroup){if(chatMode==="group")groupShowCachedList();else chatShowCachedFriends()}if(chatActiveGroup){if(Date.now()-groupMessageLastFetched>2500)groupLoadMessages()}else if(chatPeer){loadChatMessages();chatMarkRead()}else if(chatMode==="group")groupLoadList(true);else loadChatFriends();}
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
 switchPlannerPage("chat");
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
const PRIVATE_CHAT_CACHE_TTL=24*60*60*1000;
function chatRestoreSnapshot(peer){
 try{
  const key=chatSessionKey(peer);
  let saved=JSON.parse(sessionStorage.getItem(key)||"null");
  if(!Array.isArray(saved)){
   const disk=JSON.parse(localStorage.getItem(key)||"null");
   saved=Array.isArray(disk?.items)&&Date.now()-Number(disk.savedAt||0)<PRIVATE_CHAT_CACHE_TTL?disk.items:[];
  }
  return saved.filter(m=>m&&typeof m.id!=="undefined"&&typeof m.body==="string").slice(-80);
 }catch{return []}
}
function chatSaveSnapshot(peer,items){
 if(!currentUser||!peer)return;
 const key=chatSessionKey(peer);
 const safe=items.slice(-80).filter(m=>m&&typeof m.id!=="undefined"&&typeof m.body==="string").map(m=>{
  const {photoUrl,...record}=m;
  return record;
 });
 try{sessionStorage.setItem(key,JSON.stringify(safe))}catch{}
 try{localStorage.setItem(key,JSON.stringify({savedAt:Date.now(),items:safe.slice(-50)}))}catch{}
}

function chatScrollToLatest(){const root=$("chatMessages");if(!root)return;root.scrollTop=root.scrollHeight;requestAnimationFrame(()=>{if(root.isConnected)root.scrollTop=root.scrollHeight})}
let chatLastFetchAt=0;
const chatPending=new Map();
function chatText(zh,ja,en){return tr(ja,zh,en)}
function updateChatLanguage(){
 // Translate controls already rendered inside an open group panel without reloading its data.
 const translateExisting=(rootId,pairs)=>{
  const root=$(rootId);if(!root)return;
  root.querySelectorAll("button,small,label").forEach(el=>{
   if(el.children.length)return;
   const value=(el.textContent||"").trim();
   const pair=pairs.find(p=>p.includes(value));
   if(pair)el.textContent=pair[uiLanguage==="zh"?0:uiLanguage==="ja"?1:2];
  });
 };
 translateExisting("chatGroupMembersPanel",[
  ["修改群名称","グループ名を変更","Rename group"],
  ["备注","メモ","Remark"],["移除","削除","Remove"],
  ["关闭","閉じる","Close"],["退出群聊","グループを退出","Leave group"],
  ["解散群聊","グループを解散","Disband group"]
 ]);
 translateExisting("chatGroupInvitePanel",[
  ["复制","コピー","Copy"],["分享邀请码","招待コードを共有","Share invite code"],
  ["关闭","閉じる","Close"],["已在群里","参加済み","Already joined"],
  ["添加","追加","Add"],["正在加载好友…","友達を読み込み中…","Loading friends..."]
 ]);

 const status=$("chatStatus");
 if(status?.dataset?.friendsSyncedCount!==undefined&&status.dataset.friendsSyncedCount!==""){
  const n=status.dataset.friendsSyncedCount;
  status.textContent=chatText("好友列表已同步（"+n+"）","友達一覧を同期しました（"+n+"）","Friends synced ("+n+")");
 }
 if(chatMode==="group"){
  const list=$("chatGroups");
  if(list?.children.length){
   list.querySelectorAll(".chat-friend").forEach(btn=>{
    const hint=btn.querySelector(".chat-friend-info small");
    if(hint&&["暂无消息","メッセージなし","No messages yet","点击进入群聊","タップしてグループを開く","Open group chat"].includes(hint.textContent.trim()))hint.textContent=chatText("暂无消息","メッセージなし","No messages yet");
    const avatar=btn.querySelector(".chat-list-avatar");
    if(avatar)avatar.textContent=chatText("群","グ","G");
   });
   const empty=list.querySelector(".chat-group-empty");
   if(empty)empty.textContent=chatText("还没有群聊，创建或加入一个吧","グループはまだありません。作成または参加してください","No groups yet. Create or join one.");
  }
 }
 const labels={chatTitle:["チャット","好友私聊","Private Chat"],chatAddFriend:["友達を追加","添加好友","Add Friend"]};
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
 $("chatToggleAdd").setAttribute("aria-label",chatMode==="group"?chatText("创建或加入群聊","グループを作成・参加","Create or join a group"):chatText("添加好友","友達を追加","Add friend"));
 $("chatGroupBack").setAttribute("aria-label",chatText("返回","戻る","Back"));
 $("chatBack").setAttribute("aria-label",chatText("返回","戻る","Back"));
 const groupToolsTitle=$("chatGroupToolsTitle");
 if(groupToolsTitle)groupToolsTitle.textContent=chatText("新建或加入群聊","グループの作成・参加","Create or join a group");

 const listSearch=$("chatListSearchInput");
 if(listSearch){listSearch.placeholder=chatText("搜索好友或群聊","友達やグループを検索","Search friends or groups");listSearch.setAttribute("aria-label",listSearch.placeholder)}
 const listClear=$("chatListSearchClear");
 if(listClear)listClear.setAttribute("aria-label",chatText("清除搜索","検索をクリア","Clear search"));
 const listEmpty=$("chatListSearchEmpty");
 if(listEmpty)listEmpty.textContent=chatText("没有匹配的聊天","一致するチャットはありません","No matching chats");
 $("chatPrivateMode").textContent=chatText("私聊","個人チャット","Private");
 $("chatGroupMode").textContent=chatText("群聊","グループ","Groups");
 $("chatGroupName").placeholder=chatText("群名称","グループ名","Group name");
 $("chatCreateGroup").textContent=chatText("创建群聊","グループを作成","Create group");
 $("chatGroupJoinCode").placeholder=chatText("群邀请码","グループ招待コード","Group invite code");
 $("chatJoinGroup").textContent=chatText("加入群聊","グループに参加","Join group");
 $("chatGroupInvite").textContent=chatText("邀请","招待","Invite");
 $("chatGroupInviteHeading").textContent=chatText("邀请成员","メンバーを招待","Invite members");
 $("chatGroupInviteHint").textContent=chatText("复制邀请码发送给好友，好友可用邀请码加入群聊。","招待コードを共有してください","Share the code so friends can join.");
 $("chatGroupCopyInvite").textContent=chatText("复制","コピー","Copy");
 $("chatGroupShareInvite").textContent=chatText("分享邀请码","招待コードを共有","Share invite code");
 $("chatGroupInviteClose").textContent=chatText("关闭","閉じる","Close");
 $("chatGroupFriendInviteTitle").textContent=chatText("从我的好友中添加","友達から追加","Add from my friends");
 $("chatGroupManage").textContent=chatText("成员","メンバー","Members");
 $("chatGroupMembersTitle").textContent=chatText("群成员","グループメンバー","Group members");
 $("chatGroupAddUsername").placeholder=chatText("输入用户名","ユーザー名を入力","Enter username");
 $("chatGroupAddByUsername").textContent=chatText("添加成员","メンバーを追加","Add member");
 $("chatGroupLeave").textContent=chatText("退出群聊","グループを退出","Leave group");
 $("chatGroupDisband").textContent=chatText("解散群聊","グループを解散","Disband group");
 $("chatGroupMessageInput").placeholder=chatText("输入群消息…","グループメッセージ…","Group message...");
 $("chatGroupSendForm").querySelector("button").textContent=chatText("发送","送信","Send");
 $("chatTitle").textContent=chatMode==="group"?chatText("群聊","グループチャット","Group Chats"):chatText("好友私聊","チャット","Private Chat");
 $("chatMessageInput").placeholder=chatText("输入消息…","メッセージを入力…","Type a message...");
 $("chatSendForm").querySelector("button").textContent=chatText("发送","送信","Send");
}
function chatStatus(message){$("chatStatus").textContent=message;if(!/^(好友列表已同步|友達一覧を同期しました|Friends synced)/.test(message))delete $("chatStatus").dataset.friendsSyncedCount}
function chatError(error){chatStatus(error?.message||String(error))}
function chatShowList(){chatReplyTarget=null;chatUpdateReplyPreview();if(chatActiveGroup)groupClose();document.body.classList.remove("chat-open");chatConfirmedCache=[];chatCachePeer=null;chatReadLastId=null;chatLastSignature="";chatPeer=null;$("chatConversation").hidden=true;$("chatFriends").hidden=false;chatStopRealtime()}
let chatRecallChannel=null;
function chatRecallTopic(a,b){return "chat-recall-"+[a,b].sort().join("-")}
function chatStopRealtime(){
 if(chatSubscription){supabaseClient.removeChannel(chatSubscription);chatSubscription=null}
 if(chatRecallChannel){supabaseClient.removeChannel(chatRecallChannel);chatRecallChannel=null}
}
async function chatBroadcastRecall(peer,id){
 if(!currentUser)return;
 const topic=chatRecallTopic(currentUser.id,peer);
 const channel=chatRecallChannel?.topic===topic?chatRecallChannel:supabaseClient.channel(topic);
 try{
  if(channel!==chatRecallChannel)await new Promise(resolve=>{channel.subscribe(status=>{if(status==="SUBSCRIBED"||status==="CHANNEL_ERROR"||status==="TIMED_OUT")resolve()})});
  await channel.send({type:"broadcast",event:"message-recalled",payload:{id:String(id),sender:currentUser.id,recipient:peer}});
 }catch(error){console.warn("Recall broadcast unavailable; fallback sync remains active",error)}
 finally{if(channel!==chatRecallChannel)supabaseClient.removeChannel(channel)}
}
let chatFriendsRequestId=0;
let chatFriendsLoading=false;
let chatFriendsLastLoaded=0;
const CHAT_FRIEND_CACHE_KEY="myplanner-friends-v1";
const CHAT_PIN_KEY="myplanner-chat-pins-v1";
function chatPinnedPeers(){
 try{const saved=JSON.parse(localStorage.getItem(CHAT_PIN_KEY)||"{}");return Array.isArray(saved[currentUser?.id])?saved[currentUser.id]:[]}catch{return []}
}
function chatTogglePin(id){
 if(!currentUser)return;
 let saved={};try{saved=JSON.parse(localStorage.getItem(CHAT_PIN_KEY)||"{}")||{}}catch{}
 const pinned=new Set(chatPinnedPeers());
 if(pinned.has(id))pinned.delete(id);else pinned.add(id);
 saved[currentUser.id]=[...pinned];
 try{localStorage.setItem(CHAT_PIN_KEY,JSON.stringify(saved))}catch(error){console.warn("Chat pin preference could not be saved",error)}
 const root=$("chatFriends");
 if(root&&!chatPeer){
  const rows=[...root.querySelectorAll(".chat-friend[data-peer-id]")];
  rows.sort((a,b)=>Number(pinned.has(b.dataset.peerId))-Number(pinned.has(a.dataset.peerId))||Number(a.dataset.originalOrder)-Number(b.dataset.originalOrder));
  rows.forEach(row=>{root.append(row);const pin=row.querySelector(".chat-pin-button");if(pin){const isPinned=pinned.has(row.dataset.peerId);pin.textContent=isPinned?"★":"☆";pin.setAttribute("aria-pressed",String(isPinned));pin.title=isPinned?chatText("取消置顶","ピン留めを解除","Unpin chat"):chatText("置顶聊天","チャットをピン留め","Pin chat");}});
 }
}
function chatAddPinControl(row,id,order){
 row.dataset.peerId=id;row.dataset.originalOrder=String(order);
 const pinned=chatPinnedPeers().includes(id);
 const pin=document.createElement("span");pin.className="chat-pin-button";pin.textContent=pinned?"★":"☆";
 pin.setAttribute("role","button");pin.setAttribute("tabindex","0");pin.setAttribute("aria-pressed",String(pinned));
 pin.title=pinned?chatText("取消置顶","ピン留めを解除","Unpin chat"):chatText("置顶聊天","チャットをピン留め","Pin chat");
 pin.setAttribute("aria-label",pin.title);
 const toggle=e=>{e.preventDefault();e.stopPropagation();chatTogglePin(id)};
 pin.addEventListener("click",toggle);
 pin.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){toggle(e)}});
 row.append(pin);
}

function chatShowCachedFriends(){
 if(!currentUser||chatPeer)return;
 try{
  const raw=localStorage.getItem(CHAT_FRIEND_CACHE_KEY);
  if(!raw)return;
  const saved=JSON.parse(raw);
  if(saved.userId!==currentUser.id||!Array.isArray(saved.friends))return;
  const root=$("chatFriends");
  if(root.children.length)return;
  const fragment=document.createDocumentFragment();
  const pinnedFriends=new Set(chatPinnedPeers());
  const orderedFriends=[...saved.friends].sort((a,b)=>Number(pinnedFriends.has(b.id))-Number(pinnedFriends.has(a.id)));
  for(const [order,friend] of orderedFriends.entries()){
   if(typeof friend.id!=="string"||typeof friend.name!=="string")continue;
   const btn=document.createElement("button");btn.type="button";btn.className="chat-friend";
   const avatar=document.createElement("span");avatar.className="chat-list-avatar";avatar.textContent=((chatRemarkFor(friend.id)||friend.name).trim()[0]||"?").toUpperCase();
   const content=document.createElement("span");content.className="chat-friend-info";
   const title=document.createElement("strong");title.textContent=chatRemarkFor(friend.id)||friend.name;
   const subtitle=document.createElement("small");subtitle.textContent=friend.preview||chatText("开始聊天","チャットを始める","Start chatting");
   content.append(title,subtitle);
   const meta=document.createElement("span");meta.className="chat-friend-meta";
   if(friend.time){const when=document.createElement("small");when.textContent=friend.time;meta.append(when)}
   btn.append(avatar,content,meta);chatAddPinControl(btn,friend.id,order);btn.addEventListener("click",()=>openChat(friend.id,friend.name));fragment.append(btn);
  }
  if(!chatPeer)root.replaceChildren(fragment);
 }catch(error){console.warn("Cached friends unavailable",error)}
}
async function loadChatFriends(){
 if(chatPeer||chatMode==="group"||chatActiveGroup||chatFriendsLoading||!currentUser)return;
 chatFriendsLoading=true;
 const requestId=++chatFriendsRequestId;
 try{
 // Reuse the authenticated session already loaded by the app; avoid an extra network request on every chat visit.
 const verifiedUser=currentUser;
 updateChatLanguage();
 if(verifiedUser)chatShowCachedFriends();
 if(!currentUser){$("chatIdentity").textContent=chatText("请先到设置登录账号。","設定からログインしてください。","Sign in from Settings first.");$("chatFriends").replaceChildren();$("chatAddFriend").disabled=true;return}
 $("chatAddFriend").disabled=false;
 $("chatIdentity").textContent=chatText("我的邀请码：","自分の招待コード：","My invite code: ")+currentUser.id;
 const {data,error}=await supabaseClient.from("chat_friends").select("user_a,user_b,created_at").or("user_a.eq."+currentUser.id+",user_b.eq."+currentUser.id).order("created_at",{ascending:false});
 if(error){chatError(chatText("好友列表读取失败：","友達一覧の読み込みに失敗：","Failed to load friends: ")+error.message);return}
 const ids=[...new Set((data||[]).map(f=>f.user_a===currentUser.id?f.user_b:f.user_a))];
 $("chatStatus").dataset.friendsSyncedCount=String(ids.length);
 chatStatus(chatText("好友列表已同步（"+ids.length+"）","友達一覧を同期しました（"+ids.length+"）","Friends synced ("+ids.length+")"));
 const root=$("chatFriends");const fragment=document.createDocumentFragment();
 if(!ids.length){const empty=document.createElement("p");empty.className="chat-hint";empty.textContent=chatText("暂无好友。把邀请码发给朋友，或输入朋友的邀请码。","友達はまだいません。招待コードで追加できます。","No friends yet. Share or enter an invite code.");fragment.append(empty);if(requestId===chatFriendsRequestId&&!chatPeer)root.replaceChildren(fragment);try{localStorage.setItem(CHAT_FRIEND_CACHE_KEY,JSON.stringify({userId:currentUser.id,friends:[]}))}catch(error){}return}
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
 const cachedFriends=[];
 const pinnedIds=new Set(chatPinnedPeers());
 sorted.sort((a,b)=>Number(pinnedIds.has(b))-Number(pinnedIds.has(a)));
 for(const [order,id] of sorted.entries()){
  const btn=document.createElement("button");btn.type="button";btn.className="chat-friend";
  const name=names.get(id)||id.slice(0,8);
  const avatar=document.createElement("span");avatar.className="chat-list-avatar";avatar.textContent=((chatRemarkFor(id)||name).trim()[0]||"?").toUpperCase();
  const content=document.createElement("span");content.className="chat-friend-info";
  const title=document.createElement("strong");title.textContent=chatRemarkFor(id)||name;
  const subtitle=document.createElement("small");const m=last.get(id);
  subtitle.textContent=m?(m.sender_id===currentUser.id?chatText("我：","私：","Me: "):"")+(m.body.startsWith(CHAT_IMAGE_PREFIX)?chatText("📷 照片","📷 写真","📷 Photo"):chatPlainBody(m.body)):chatText("开始聊天","チャットを始める","Start chatting");
  content.append(title,subtitle);
  const meta=document.createElement("span");meta.className="chat-friend-meta";
  if(m){const when=document.createElement("small");when.textContent=new Date(m.created_at).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"});meta.append(when)}
  if(unread.get(id)){const count=document.createElement("b");count.className="chat-unread";count.textContent=unread.get(id)>99?"99+":String(unread.get(id));meta.append(count)}
  btn.append(avatar,content,meta);chatAddPinControl(btn,id,order);btn.addEventListener("click",()=>openChat(id,name));fragment.append(btn);
  cachedFriends.push({id,name,preview:subtitle.textContent,time:m?new Date(m.created_at).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}):""});
 }
 if(requestId===chatFriendsRequestId&&!chatPeer)root.replaceChildren(fragment);
 try{localStorage.setItem(CHAT_FRIEND_CACHE_KEY,JSON.stringify({userId:currentUser.id,friends:cachedFriends}))}catch(error){console.warn("Friend cache write failed",error)}
 }finally{chatFriendsLoading=false;chatFriendsLastLoaded=Date.now()}
}
function chatAppendRealtime(item){
 if(!currentUser||!chatPeer||!item||!(item.sender_id===chatPeer&&item.recipient_id===currentUser.id||item.sender_id===currentUser.id&&item.recipient_id===chatPeer))return;
 const root=$("chatMessages");
 if(root.querySelector('[data-message-id="'+item.id+'"]'))return;
 const bubble=document.createElement("div");bubble.className="chat-bubble"+(item.sender_id===currentUser.id?" mine":"");
 bubble.dataset.messageId=String(item.id);
 const body=document.createElement("span");chatDisplayBody(body,item.body);
 const time=document.createElement("small");time.textContent=new Date(item.created_at).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})+(item.sender_id===currentUser.id&&item.read_at?" · "+chatText("已读","既読","Read"):"");
 bubble.append(body,time);root.append(bubble);root.scrollTop=root.scrollHeight;
 chatLastSignature="";
}
function chatUpdatePeerHeader(id,name){
 const title=$("chatPeerName"),subtitle=$("chatPeerSub");
 const original=String(name||title?.dataset.originalName||"").trim();
 const remark=chatRemarkFor(id);
 const display=remark||original||id.slice(0,8);
 title.dataset.originalName=original;
 title.textContent=display;
 if(subtitle){subtitle.textContent=remark&&original&&remark!==original?original:"";subtitle.hidden=!subtitle.textContent;}
 const avatar=$("chatConversation")?.querySelector(".chat-peer-avatar");
 if(avatar)avatar.textContent=display.trim().slice(0,1)||"?";
}
async function openChat(id,name){
 chatStopRealtime();
 chatReplyTarget=null;chatUpdateReplyPreview();chatShowBuildVersion();chatLastSignature="";chatConfirmedCache=chatRestoreSnapshot(id);chatCachePeer=id;chatReadLastId=null;chatPeer=id;chatAutoScrollUntil=Date.now()+8000;document.body.classList.add("chat-open");
 $("chatInviteSection").hidden=true;$("chatToggleAdd").setAttribute("aria-expanded","false");
 chatUpdatePeerHeader(id,name);$("chatFriends").hidden=true;$("chatConversation").hidden=false;
 chatRenderMessages();chatScrollToLatest();
 const userId=currentUser.id;
 chatRecallChannel=supabaseClient.channel(chatRecallTopic(userId,id))
 .on("broadcast",{event:"message-recalled"},({payload})=>{
  if(chatPeer!==id||currentUser?.id!==userId||!payload)return;
  if(!((payload.sender===id&&payload.recipient===userId)||(payload.sender===userId&&payload.recipient===id)))return;
  const recalledId=String(payload.id||"");
  if(!recalledId)return;
  chatConfirmedCache=chatConfirmedCache.filter(m=>String(m.id)!==recalledId);
  chatSaveSnapshot(id,chatConfirmedCache);
  chatLastSignature="";chatRenderMessages();loadChatMessages();
 }).subscribe();
 chatSubscription=supabaseClient.channel("private-chat-"+userId+"-"+id)
 .on("postgres_changes",{event:"INSERT",schema:"public",table:"chat_messages",filter:"recipient_id=eq."+userId},payload=>{if(chatPeer===payload.new.sender_id){chatAppendRealtime(payload.new);loadChatMessages()}})
 .on("postgres_changes",{event:"INSERT",schema:"public",table:"chat_messages",filter:"sender_id=eq."+userId},payload=>{if(chatPeer===payload.new.recipient_id){chatAppendRealtime(payload.new);loadChatMessages()}})
 .on("postgres_changes",{event:"UPDATE",schema:"public",table:"chat_messages",filter:"sender_id=eq."+userId},payload=>{if(chatPeer===payload.new.recipient_id)loadChatMessages()})
 .on("postgres_changes",{event:"DELETE",schema:"public",table:"chat_messages"},()=>{if(chatPeer===id&&currentUser?.id===userId){chatLastSignature="";loadChatMessages()}})
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
const chatImageUrlRequests=new Map();
async function chatGetSignedImageUrl(path){
 const cached=chatImageUrlCache.get(path);
 if(cached&&cached.expires>Date.now())return cached.url;
 if(chatImageUrlRequests.has(path))return chatImageUrlRequests.get(path);
 const request=(async()=>{
  const {data,error}=await supabaseClient.storage.from("chat-photos").createSignedUrl(path,3600);
  if(error||!data?.signedUrl)throw error||new Error("Photo URL unavailable");
  chatImageUrlCache.set(path,{url:data.signedUrl,expires:Date.now()+3300000});
  if(chatImageUrlCache.size>250){
   for(const [key,value] of chatImageUrlCache){if(value.expires<=Date.now()||chatImageUrlCache.size>200)chatImageUrlCache.delete(key)}
  }
  return data.signedUrl;
 })();
 chatImageUrlRequests.set(path,request);
 try{return await request}finally{chatImageUrlRequests.delete(path)}
}
/* Private photos remain private; show an actionable retry when Storage denies a signed URL. */
function chatAttachStoredPhoto(node,path,isGroup=false){
 const wrap=document.createElement("span");wrap.className="chat-media-frame";
 const img=document.createElement("img");img.className="chat-photo";img.loading="lazy";img.decoding="async";
 img.alt=chatText("照片加载中…","写真を読み込み中…","Loading photo...");
 const retry=document.createElement("button");retry.type="button";retry.className="chat-photo-retry";retry.hidden=true;
 retry.textContent=chatText("照片加载失败 · 点击重试","写真を読み込めません · 再試行","Photo unavailable · Retry");
 retry.addEventListener("pointerdown",event=>event.stopPropagation());
 const failed=(error)=>{
  img.hidden=true;retry.hidden=false;
  if(error)console.warn("Chat photo access unavailable",error?.message||error);
 };
 const load=(force=false)=>{
  retry.hidden=true;img.hidden=false;
  if(force)chatImageUrlCache.delete(path);
  chatGetSignedImageUrl(path).then(url=>{
   if(!wrap.isConnected)return;
   img.onerror=()=>failed(new Error("Image download or decoding failed"));
   img.onload=()=>{img.alt=chatText("聊天照片","チャット写真","Chat photo");if(!isGroup&&Date.now()<chatAutoScrollUntil)chatScrollToLatest()};
   img.src=url;
  }).catch(failed);
 };
 retry.addEventListener("click",event=>{event.stopPropagation();load(true)});
 img.addEventListener("click",event=>{event.stopPropagation();if(img.src)chatOpenPhotoPreview(img.src)});
 wrap.append(img,retry);node.append(wrap);
 // The render transaction attaches the node before this microtask.
 queueMicrotask(load);
}
async function chatPrepareUploadFile(file){
 if(["image/jpeg","image/png","image/webp","image/gif"].includes(file.type))return file;
 if(!file.type.startsWith("image/"))throw Error(chatText("请选择图片文件","画像を選択してください","Select an image"));
 // iPhone HEIC/HEIF photos need real JPEG encoding, not only a .jpg suffix.
 const objectUrl=URL.createObjectURL(file);
 try{
  const photo=await new Promise((resolve,reject)=>{
   const image=new Image();image.onload=()=>resolve(image);
   image.onerror=()=>reject(Error(chatText("此照片格式暂不支持，请转换成 JPEG 后重试","JPEG に変換して再試行してください","Convert this photo to JPEG and retry")));
   image.src=objectUrl;
  });
  const scale=Math.min(1,2048/Math.max(photo.naturalWidth,photo.naturalHeight));
  const canvas=document.createElement("canvas");
  canvas.width=Math.max(1,Math.round(photo.naturalWidth*scale));
  canvas.height=Math.max(1,Math.round(photo.naturalHeight*scale));
  const ctx=canvas.getContext("2d");if(!ctx)throw Error("Image conversion unavailable");
  ctx.drawImage(photo,0,0,canvas.width,canvas.height);
  const blob=await new Promise(resolve=>canvas.toBlob(resolve,"image/jpeg",.88));
  if(!blob)throw Error("JPEG conversion unavailable");
  return new File([blob],(file.name||"photo").replace(/\.[^.]+$/,"")+".jpg",{type:"image/jpeg"});
 }finally{URL.revokeObjectURL(objectUrl)}
}
function chatOpenPhotoPreview(url){
 if(!url)return;
 let overlay=document.getElementById("chatPhotoPreview");
 if(!overlay){
  overlay=document.createElement("div");overlay.id="chatPhotoPreview";overlay.className="chat-photo-preview";overlay.hidden=true;
  overlay.innerHTML='<button type="button" class="chat-photo-preview-close" aria-label="Close photo">×</button><img class="chat-photo-preview-image" alt="Chat photo">';
  document.body.append(overlay);
  overlay.addEventListener("click",event=>{if(event.target!==overlay&&event.target.closest(".chat-photo-preview-close")===null)return;overlay.hidden=true;overlay.querySelector("img").removeAttribute("src")});
  document.addEventListener("keydown",event=>{if(event.key==="Escape"&&!overlay.hidden){overlay.hidden=true;overlay.querySelector("img").removeAttribute("src")}});
 }
 overlay.querySelector("img").src=url;overlay.hidden=false;
}

const CHAT_REPLY_PREFIX="[myplanner-reply]:";
let chatReplyTarget=null;
function chatShowBuildVersion(){
 // Internal build tags should not appear in a customer-facing chat header.
 document.getElementById("chatBuildVersion")?.remove();
}
function chatParseReply(body){
 if(typeof body!=="string")return null;
 if(body.startsWith(CHAT_REPLY_PREFIX)){
  try{const value=JSON.parse(body.slice(CHAT_REPLY_PREFIX.length));if(value&&typeof value.text==="string"&&typeof value.quote==="string")return value}catch{}
  return null;
 }
 const match=/^↪「([^\n]{0,120})」\n([\s\S]+)$/.exec(body);
 return match?{quote:match[1],text:match[2]}:null;
}
function chatPlainBody(body){const reply=chatParseReply(body);return reply?reply.text:body}
function chatQuoteText(body){
 const value=String(chatPlainBody(body)||"");
 return value.startsWith(CHAT_IMAGE_PREFIX)?chatText("图片","画像","Photo"):value.replace(/^↪\s*/,"").replace(/\s+/g," ").slice(0,100);
}
function chatUpdateReplyPreview(){
 let preview=document.getElementById("chatReplyPreview");
 if(!preview){
  preview=document.createElement("div");preview.id="chatReplyPreview";preview.className="chat-reply-preview";
  const form=$("chatSendForm");form.parentNode.insertBefore(preview,form);
 }
 preview.replaceChildren();
 preview.hidden=!chatReplyTarget;
 if(!chatReplyTarget)return;
 const info=document.createElement("span");info.className="chat-reply-preview-info";
 const title=document.createElement("strong");title.textContent=chatText("正在回复","返信中","Replying to");
 const quote=document.createElement("span");quote.textContent=chatQuoteText(chatReplyTarget.body);
 info.append(title,quote);
 const close=document.createElement("button");close.type="button";close.className="chat-reply-close";close.textContent="×";close.setAttribute("aria-label",chatText("取消回复","返信をキャンセル","Cancel reply"));close.addEventListener("click",()=>{chatReplyTarget=null;chatUpdateReplyPreview()});
 preview.append(info,close);
}
function chatSetReply(item){
 chatReplyTarget={id:String(item.id),body:item.body,peer:chatPeer};
 chatUpdateReplyPreview();
 $("chatMessageInput").focus();
}
function chatDisplayBody(node,body){
 const reply=chatParseReply(body);
 if(reply){
  const quoted=document.createElement("div");quoted.className="chat-quoted-message";
  const label=document.createElement("strong");label.textContent=chatText("回复消息","返信","Reply");
  const content=document.createElement("span");content.textContent=reply.quote;
  quoted.append(label,content);node.append(quoted);
  const message=document.createElement("div");message.className="chat-reply-text";message.textContent=reply.text;node.append(message);
 }else chatMessageContent(node,body);
}
function chatMessageContent(node,body){
 if(typeof body==="string"&&body.startsWith(CHAT_IMAGE_PREFIX)){
  const path=body.slice(CHAT_IMAGE_PREFIX.length);
  if(!/^([0-9a-f-]{36})\/([0-9a-f-]{36})\/([0-9a-f-]{36})\.(jpg|png|webp|gif)$/i.test(path)){node.textContent=chatText("图片格式无效","画像形式が無効です","Invalid photo format");return}
  chatAttachStoredPhoto(node,path,false);

 }else node.textContent=body;
}
const CHAT_HIDDEN_KEY="myplanner-hidden-messages-v1";
function chatHiddenIds(){
 if(!currentUser)return new Set();
 try{const all=JSON.parse(localStorage.getItem(CHAT_HIDDEN_KEY)||"{}");return new Set(Array.isArray(all[currentUser.id])?all[currentUser.id]:[])}catch{return new Set()}
}
function chatHideForMe(id){
 if(!currentUser)return;
 let all={};try{all=JSON.parse(localStorage.getItem(CHAT_HIDDEN_KEY)||"{}")||{}}catch{}
 const ids=new Set(Array.isArray(all[currentUser.id])?all[currentUser.id]:[]);
 ids.add(String(id));all[currentUser.id]=[...ids].slice(-3000);
 try{localStorage.setItem(CHAT_HIDDEN_KEY,JSON.stringify(all))}catch(error){console.warn("Could not save hidden messages",error)}
 chatLastSignature="";chatRenderMessages();
}
const chatRemovingMessages=new Set();
async function chatRemoveMessage(item,recall){
 if(!currentUser||!chatPeer||!item?.id)return;
 if(recall&&item.sender_id!==currentUser.id)return;
 const id=String(item.id);
 if(chatRemovingMessages.has(id))return;
 const question=recall?chatText("撤回这条消息？对方的聊天记录也将删除。","このメッセージを取り消しますか？相手側からも削除されます。","Recall this message for everyone?"):chatText("仅在此设备隐藏这条消息？","この端末でのみ非表示にしますか？","Hide this message on this device only?");
 if(!window.confirm(question))return;
 if(!recall){chatHideForMe(id);return}
 const peer=chatPeer,userId=currentUser.id;
 chatRemovingMessages.add(id);
 document.querySelectorAll(".chat-bubble[data-message-id]").forEach(node=>{
  if(node.dataset.messageId===id)node.querySelectorAll(".chat-message-action").forEach(btn=>btn.disabled=true);
 });
 chatStatus(chatText("正在撤回消息…","メッセージを取り消しています…","Recalling message…"));
 try{
  const {data,error}=await supabaseClient.from("chat_messages").delete().eq("id",item.id).eq("sender_id",userId).eq("recipient_id",peer).select("id");
  if(error)throw error;
  if(!data?.length)throw new Error(chatText("服务器未授权删除。请在 Supabase 中配置 chat_messages 的 DELETE 权限。","サーバーに削除権限がありません。Supabase の DELETE ポリシーを確認してください。","Server did not authorize deletion. Check the chat_messages DELETE policy in Supabase."));
  if(currentUser?.id!==userId||chatPeer!==peer)return;
  chatConfirmedCache=chatConfirmedCache.filter(m=>String(m.id)!==id);
  chatSaveSnapshot(peer,chatConfirmedCache);
  chatLastSignature="";chatRenderMessages();
  chatBroadcastRecall(peer,id).catch(console.warn);
  chatStatus(chatText("消息已撤回","メッセージを取り消しました","Message recalled"));
  await loadChatMessages();
 }catch(error){
  const message=chatText("撤回失败：","取り消しに失敗：","Recall failed: ")+(error.message||String(error));
  chatError(message);
  window.alert(message);
 }finally{
  chatRemovingMessages.delete(id);
  document.querySelectorAll(".chat-bubble[data-message-id]").forEach(node=>{
   if(node.dataset.messageId===id)node.querySelectorAll(".chat-message-action").forEach(btn=>btn.disabled=false);
  });
 }
}
let chatMenuNode=null;
function chatCloseMessageMenu(){
 if(chatMenuNode){chatMenuNode.remove();chatMenuNode=null}
}
function chatOpenMessageMenu(item,bubble){
 chatCloseMessageMenu();
 const menu=document.createElement("div");menu.className="chat-context-menu";menu.setAttribute("role","menu");
 const add=(label,action,extra="")=>{
  const btn=document.createElement("button");btn.type="button";btn.className="chat-context-option "+extra;btn.textContent=label;
  btn.addEventListener("click",e=>{e.stopPropagation();chatCloseMessageMenu();action()});menu.append(btn);
 };
 if(!String(chatPlainBody(item.body)||"").startsWith(CHAT_IMAGE_PREFIX)){
  add(chatText("复制","コピー","Copy"),async()=>{
   try{await navigator.clipboard.writeText(chatPlainBody(item.body));chatStatus(chatText("已复制","コピーしました","Copied"))}
   catch{window.prompt(chatText("复制消息","メッセージをコピー","Copy message"),chatPlainBody(item.body))}
  });
 }
 add(chatText("回复","返信","Reply"),()=>{
  chatSetReply(item);
 });
 if(item.sender_id===currentUser.id)add(chatText("撤回","送信取消","Recall"),()=>chatRemoveMessage(item,true),"danger");
 add(chatText("仅为我删除","自分のみ削除","Delete for me"),()=>chatRemoveMessage(item,false),"danger");
 document.body.append(menu);chatMenuNode=menu;
 const rect=bubble.getBoundingClientRect();const width=menu.offsetWidth,height=menu.offsetHeight;
 menu.style.left=Math.max(8,Math.min(window.innerWidth-width-8,rect.left))+"px";
 menu.style.top=Math.max(8,Math.min(window.innerHeight-height-8,rect.top-height-8))+"px";
 setTimeout(()=>document.addEventListener("pointerdown",chatDismissMessageMenu,{once:true}),0);
}
function chatDismissMessageMenu(e){if(chatMenuNode&&!chatMenuNode.contains(e.target))chatCloseMessageMenu()}
function chatMessageActions(bubble,item){
 let timer=null,startX=0,startY=0,longPressed=false;
 const cancel=()=>{if(timer!==null){clearTimeout(timer);timer=null}};
 bubble.addEventListener("pointerdown",e=>{
  if(e.button!==0||e.target.closest("button,a"))return;
  startX=e.clientX;startY=e.clientY;longPressed=false;cancel();
  timer=setTimeout(()=>{timer=null;longPressed=true;chatOpenMessageMenu(item,bubble);navigator.vibrate?.(12)},480);
 });
 bubble.addEventListener("pointermove",e=>{if(Math.abs(e.clientX-startX)>12||Math.abs(e.clientY-startY)>12)cancel()});
 bubble.addEventListener("pointerup",cancel);bubble.addEventListener("pointercancel",cancel);bubble.addEventListener("pointerleave",cancel);
 bubble.addEventListener("selectstart",e=>e.preventDefault());
 bubble.addEventListener("contextmenu",e=>{e.preventDefault();cancel();if(!longPressed)chatOpenMessageMenu(item,bubble)});
}
const CHAT_REMARKS_KEY="myplanner-chat-remarks-v1";
function chatRemarkFor(userId){
 if(!currentUser||!userId)return "";
 try{return String(JSON.parse(localStorage.getItem(CHAT_REMARKS_KEY)||"{}")[currentUser.id]?.[userId]||"")}catch{return ""}
}
function chatSetRemarkFor(userId){
 if(!currentUser||!userId||userId===currentUser.id)return;
 const old=chatRemarkFor(userId);
 const value=prompt(chatText("设置备注（留空则恢复原名称）","表示名を設定（空欄で元に戻す）","Set a nickname (blank to reset)"),old);
 if(value===null)return;
 const remark=value.trim().slice(0,40);
 try{
  const all=JSON.parse(localStorage.getItem(CHAT_REMARKS_KEY)||"{}");
  const own=all[currentUser.id]||{};
  if(remark)own[userId]=remark;else delete own[userId];
  all[currentUser.id]=own;localStorage.setItem(CHAT_REMARKS_KEY,JSON.stringify(all));
 }catch(error){alert(chatText("备注保存失败","保存できませんでした","Could not save nickname"));return}
 chatLastSignature="";groupLastSignature="";
 if(chatPeer===userId&&$("chatPeerName"))chatUpdatePeerHeader(userId,$("chatPeerName").dataset.originalName);
 if(chatPeer)chatRenderMessages();
 if(chatActiveGroup){groupLastSignature="";try{const cache=JSON.parse(sessionStorage.getItem("myplanner-group-msg-"+currentUser.id+"-"+chatActiveGroup.id)||"null");if(Array.isArray(cache?.items))groupRenderMessages(cache.items)}catch{}}
}
function chatBubbleAvatar(bubble, senderId, isGroup=false){
 const mine=senderId===currentUser?.id;
 const remark=chatRemarkFor(senderId);
 let label=mine?chatText("我","私","Me"):remark?remark.slice(0,1):isGroup?String(senderId||"?").slice(0,1).toUpperCase():String($("chatPeerName")?.textContent||$("chatTitle")?.textContent||"?").trim().slice(0,1).toUpperCase();
 if(!label)label="?";
 bubble.dataset.avatar=label;
 bubble.classList.add("chat-with-avatar");
 if(!mine){
  const avatar=document.createElement("button");
  avatar.type="button";avatar.className="chat-avatar-action";
  avatar.textContent=label;
  avatar.setAttribute("aria-label",chatText("设置用户备注","相手の表示名を設定","Set contact nickname"));
  avatar.addEventListener("pointerdown",event=>event.stopPropagation());
  avatar.addEventListener("click",event=>{event.preventDefault();event.stopPropagation();chatCloseMessageMenu();chatSetRemarkFor(senderId)});
  bubble.append(avatar);
 }
}
function chatRenderMessages(){
 if(!currentUser||!chatPeer)return;
 const root=$("chatMessages");
 const hidden=chatHiddenIds();
 const confirmed=(chatCachePeer===chatPeer?chatConfirmedCache:[]).filter(m=>!hidden.has(String(m.id)));
 for(const [key,item] of chatPending){
  if(item.peer===chatPeer&&((item.serverId&&confirmed.some(m=>String(m.id)===String(item.serverId)))||(item.status==="uncertain"&&confirmed.some(m=>m.sender_id===currentUser.id&&m.recipient_id===item.peer&&m.body===item.body&&Math.abs(new Date(m.created_at).getTime()-item.createdAt)<120000))))chatPending.delete(key);
 }
 const pending=[...chatPending.entries()].filter(([,item])=>item.peer===chatPeer);
 const signature=uiLanguage+"|"+confirmed.map(m=>m.id+":"+(m.read_at||"")).join(",")+"|"+pending.map(([key,item])=>key+":"+item.status).join(",");
 if(signature===chatLastSignature)return;
 chatLastSignature=signature;
 const fragment=document.createDocumentFragment();
 for(const item of confirmed){
  const div=document.createElement("div");div.className="chat-bubble"+(item.sender_id===currentUser.id?" mine":"");div.dataset.messageId=String(item.id);chatBubbleAvatar(div,item.sender_id);
  const body=document.createElement("span");if(item.photoUrl){const img=document.createElement("img");img.className="chat-photo";img.src=item.photoUrl;img.alt=chatText("聊天照片","チャット写真","Chat photo");body.append(img)}else chatDisplayBody(body,item.body);
  const time=document.createElement("small");time.textContent=new Date(item.created_at).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})+(item.sender_id===currentUser.id&&item.read_at?" · "+chatText("已读","既読","Read"):"");
  div.append(body,time);chatMessageActions(div,item);fragment.append(div);
 }
 for(const [key,item] of pending){
  const div=document.createElement("div");div.className="chat-bubble mine";div.dataset.pendingKey=key;chatBubbleAvatar(div,currentUser.id);
  const body=document.createElement("span");if(item.photoUrl){const img=document.createElement("img");img.className="chat-photo";img.src=item.photoUrl;img.alt=chatText("聊天照片","チャット写真","Chat photo");body.append(img)}else chatMessageContent(body,item.body);
  const time=document.createElement("small");
  const sentAt=new Date(item.createdAt).toLocaleString();
  const state=item.status==="failed"?chatText("发送失败","送信失敗","Failed"):item.status==="uncertain"?chatText("发送超时·待确认","送信確認中","Delivery unconfirmed"):item.status==="sent"?"":chatText("发送中…","送信中…","Sending...");
  time.textContent=sentAt+(state?" · "+state:"");
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
 if(chatRefreshBusy){chatReloadQueued=true;return}
 chatRefreshBusy=true;
 const requestedPeer=chatPeer,requestedUser=currentUser.id;
 try{
 const {data,error}=await supabaseClient.from("chat_messages").select("id,sender_id,recipient_id,body,created_at,read_at").or("and(sender_id.eq."+currentUser.id+",recipient_id.eq."+requestedPeer+"),and(sender_id.eq."+requestedPeer+",recipient_id.eq."+currentUser.id+")").order("created_at",{ascending:false}).limit(200);
 if(error)throw error;
 if(chatPeer!==requestedPeer||currentUser?.id!==requestedUser)return;
 chatConfirmedCache=(data||[]).reverse();
 chatSaveSnapshot(requestedPeer,chatConfirmedCache);
 chatLastFetchAt=Date.now();
 chatCachePeer=requestedPeer;
 chatRenderMessages();
 chatMarkRead();
 }catch(error){if(chatPeer===requestedPeer&&currentUser?.id===requestedUser)chatError(error?.message||String(error))}
 finally{chatRefreshBusy=false;if(chatReloadQueued){chatReloadQueued=false;if(chatPeer&&currentUser?.id===requestedUser)queueMicrotask(()=>loadChatMessages())}}


}
let chatUsernameLoadedFor=null;
async function chatLoadMyUsername(){
 if(!currentUser||chatUsernameLoadedFor===currentUser.id)return;
 const userId=currentUser.id,cacheKey="myplanner-own-username-"+userId;
 try{const cached=localStorage.getItem(cacheKey);if(cached!==null&&document.activeElement!==$("accountMyUsername"))$("accountMyUsername").value=cached}catch{}
 const {data,error}=await supabaseClient.rpc("chat_get_my_username");
 if(!error&&currentUser?.id===userId){
  if(document.activeElement!==$("accountMyUsername"))$("accountMyUsername").value=data||"";
  try{localStorage.setItem(cacheKey,data||"")}catch{}
  chatUsernameLoadedFor=userId;
 }
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
  try{localStorage.setItem("myplanner-own-username-"+currentUser.id,username)}catch{}
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
  const preparedFile=await chatPrepareUploadFile(file);
  const type=preparedFile.type==="image/png"?"png":preparedFile.type==="image/webp"?"webp":preparedFile.type==="image/gif"?"gif":"jpg";
  const path=currentUser.id+"/"+peer+"/"+crypto.randomUUID()+"."+type;
  const {error:uploadError}=await supabaseClient.storage.from("chat-photos").upload(path,preparedFile,{contentType:preparedFile.type,upsert:false});
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
 const input=$("chatMessageInput"),textBody=input.value.trim();if(!textBody)return;
 const peer=chatPeer;
 const reply=chatReplyTarget?.peer===peer?chatReplyTarget:null;
 const body=reply?CHAT_REPLY_PREFIX+JSON.stringify({id:reply.id,quote:chatQuoteText(reply.body),text:textBody}):textBody;
 const key="pending-"+Date.now()+"-"+Math.random().toString(36).slice(2);
 chatPending.set(key,{peer,body,status:"sending",serverId:null,createdAt:Date.now()});
 input.value="";chatReplyTarget=null;chatUpdateReplyPreview();
 // Always render from the local pending queue first; network work starts afterward.
 chatRenderMessages();
 try{
  const controller=new AbortController();
  const timeout=setTimeout(()=>controller.abort(),12000);
  let data,error;
  try{({data,error}=await supabaseClient.from("chat_messages").insert({sender_id:currentUser.id,recipient_id:peer,body}).select("id").single().abortSignal(controller.signal))}finally{clearTimeout(timeout)}
  if(error)throw error;
  const pending=chatPending.get(key);if(pending){pending.serverId=data.id;pending.status="sent"}
  if(chatPeer===peer){chatRenderMessages();scheduleChatReconcile()}
 }catch(error){
  const pending=chatPending.get(key);if(pending)pending.status=error?.name==="AbortError"?"uncertain":"failed";
  if(chatPeer===peer){chatRenderMessages();chatError(error?.name==="AbortError"?chatText("网络超时，正在核实消息是否送达，请勿重复发送。","通信がタイムアウトしました。送信状況を確認中です。","Network timeout. Checking delivery; do not resend yet."):error);scheduleChatReconcile()}
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
 if(chatActiveGroup){if(Date.now()-groupMessageLastFetched>12000)groupLoadMessages();return}
 if(chatPeer){if(!document.hidden&&document.body.dataset.activePage==="chat"&&Date.now()-chatLastFetchAt>3000)loadChatMessages()}else if(chatMode==="private"&&Date.now()-chatFriendsLastLoaded>20000)loadChatFriends();
},3000);
function chatRefreshAfterReconnect(){
 if(document.hidden||document.body.dataset.activePage!=="chat"||!currentUser)return;
 if(chatActiveGroup)groupScheduleRefresh();
 else if(chatPeer)loadChatMessages();
 else if(chatMode==="group")groupLoadList(true);
 else loadChatFriends();
}
document.addEventListener("visibilitychange",chatRefreshAfterReconnect);
window.addEventListener("online",chatRefreshAfterReconnect);


/* v80: group chats are separate from private chats and require the group SQL setup. */
let chatMode="private",chatActiveGroup=null,groupPolling=false,groupLastSignature="",groupChannel=null;
let groupListLoading=false,groupListLastLoaded=0,groupListSignature="",groupMessageRefreshTimer=null,groupMessageLastFetched=0;
const groupListCacheKey="myplanner-groups-v1";
let groupListWarmedFor=null;
async function groupWarmListCache(){
 const userId=currentUser?.id;
 if(!userId||groupListWarmedFor===userId||chatMode==="group")return;
 groupListWarmedFor=userId;
 try{
  const {data:members,error}=await supabaseClient.from("chat_group_members").select("group_id").eq("user_id",userId);
  if(error)throw error;
  const ids=[...new Set((members||[]).map(x=>x.group_id))];
  let groups=[];
  if(ids.length){
   const res=await supabaseClient.from("chat_groups").select("id,name,created_by").in("id",ids);
   if(res.error)throw res.error;
   groups=res.data||[];
  }
  if(currentUser?.id!==userId||chatMode==="group")return;
  let existing=[];
  try{const cache=JSON.parse(localStorage.getItem(groupListCacheKey)||"null");if(cache?.userId===userId&&Array.isArray(cache.groups))existing=cache.groups}catch{}
  const old=new Map(existing.map(g=>[g.id,g]));
  const merged=groups.map(g=>({...old.get(g.id),...g}));
  localStorage.setItem(groupListCacheKey,JSON.stringify({userId,groups:merged}));
 }catch(error){console.warn("Group list warmup unavailable",error);groupListWarmedFor=null}
}

const groupReadKey="myplanner-group-read-v1";
function groupReadTimes(){
 try{const all=JSON.parse(localStorage.getItem(groupReadKey)||"{}");return all[currentUser?.id]||{}}catch{return {}}
}
function groupMarkSeen(groupId,when){
 if(!currentUser||!groupId)return;
 try{
  const all=JSON.parse(localStorage.getItem(groupReadKey)||"{}");
  const times=all[currentUser.id]||{};
  const value=when||new Date().toISOString();
  if(!times[groupId]||times[groupId]<value)times[groupId]=value;
  all[currentUser.id]=times;localStorage.setItem(groupReadKey,JSON.stringify(all));
 }catch{}
}
let groupListRequestId=0;
async function groupFetchPreviews(groups){
 if(!currentUser||!groups.length)return groups;
 const userId=currentUser.id,readTimes=groupReadTimes();
 return Promise.all(groups.map(async group=>{
  try{
   const latest=await supabaseClient.from("chat_group_messages").select("id,body,created_at,sender_id").eq("group_id",group.id).order("created_at",{ascending:false}).limit(1);
   if(latest.error)throw latest.error;
   const message=latest.data?.[0];
   if(!message)return {...group,preview:"",previewTime:"",unread:0};
   let unread=0;
   const since=readTimes[group.id];
   if(since){
    const result=await supabaseClient.from("chat_group_messages").select("id",{count:"exact",head:true}).eq("group_id",group.id).gt("created_at",since).neq("sender_id",userId);
    if(!result.error)unread=result.count||0;
   }else{
    // Existing groups start without a historical unread backlog.
    groupMarkSeen(group.id,message.created_at);
   }
   const body=message.body||"";
   const preview=body.startsWith("[myplanner-group-image]:")?chatText("📷 图片","📷 写真","📷 Photo"):body;
   return {...group,preview,previewTime:message.created_at,unread};
  }catch{return group}
 }));
}
function groupRenderList(groups){
 const signature=uiLanguage+"|"+JSON.stringify(groups.map(g=>[g.id,g.name,g.created_by,g.preview,g.previewTime,g.unread]));
 if(signature===groupListSignature&&$("chatGroups").children.length)return;
 groupListSignature=signature;
 const root=$("chatGroups"),fragment=document.createDocumentFragment();
 if(!groups.length){const empty=document.createElement("p");empty.className="chat-group-empty";empty.textContent=chatText("还没有群聊，创建或加入一个吧","グループはまだありません。作成または参加してください","No groups yet. Create or join one.");fragment.append(empty)}
 for(const group of groups){
  const btn=document.createElement("button");btn.type="button";btn.className="chat-friend";
  const avatar=document.createElement("span");avatar.className="chat-list-avatar";avatar.textContent=chatText("群","グ","G");
  const info=document.createElement("span");info.className="chat-friend-info";
  const name=document.createElement("strong");name.textContent=group.name;
  const hint=document.createElement("small");hint.textContent=group.preview||chatText("暂无消息","メッセージなし","No messages yet");
  hint.style.cssText="display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:58vw";
  info.append(name,hint);btn.append(avatar,info);
  const side=document.createElement("span");side.style.cssText="display:flex;flex-direction:column;align-items:flex-end;gap:6px;margin-left:auto;flex-shrink:0";
  if(group.previewTime){const time=document.createElement("small");time.textContent=new Date(group.previewTime).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"});side.append(time)}
  if(group.unread>0){const badge=document.createElement("span");badge.textContent=group.unread>99?"99+":String(group.unread);badge.setAttribute("aria-label",chatText("未读消息","未読メッセージ","Unread messages"));badge.style.cssText="background:#2563eb;color:white;border-radius:999px;min-width:22px;height:22px;padding:0 6px;display:inline-flex;align-items:center;justify-content:center;font-size:12px;font-weight:700";side.append(badge)}
  btn.append(side);btn.addEventListener("click",()=>groupOpen(group));fragment.append(btn);
 }
 root.replaceChildren(fragment);
}
function groupShowCachedList(){
 if(!currentUser||chatActiveGroup)return;
 try{const cache=JSON.parse(localStorage.getItem(groupListCacheKey)||"null");if(cache?.userId===currentUser.id&&Array.isArray(cache.groups))groupRenderList(cache.groups)}catch{}
}

function groupStatus(message){$("chatGroupStatus").textContent=message}
function groupError(error){groupStatus(error?.message||String(error))}
function refreshChatLocalizedViews(){
  chatLastSignature="";
  groupLastSignature="";
  if(chatPeer)chatRenderMessages();
  if(chatActiveGroup){
   try{const cached=JSON.parse(sessionStorage.getItem("myplanner-group-msg-"+currentUser.id+"-"+chatActiveGroup.id)||"null");if(Array.isArray(cached?.items))groupRenderMessages(cached.items)}catch{}
  }
  if(chatMode==="group"&&!chatActiveGroup){
   groupListSignature="";
   groupShowCachedList();
  }
}
window.chatRefreshLocalizedViews=refreshChatLocalizedViews;
function groupMode(mode){
 if(chatPeer)chatShowList();
 if(chatActiveGroup)groupClose();
 chatMode=mode;
 $("chatPrivateMode").classList.toggle("active",mode==="private");
 $("chatGroupMode").classList.toggle("active",mode==="group");
 $("chatFriends").hidden=mode!=="private";
 $("chatGroups").hidden=mode!=="group";
 $("chatGroupTools").hidden=true;
 $("chatToggleAdd").hidden=false;
 $("chatInviteSection").hidden=true;
 $("chatToggleAdd").setAttribute("aria-expanded","false");
 $("chatToggleAdd").setAttribute("aria-controls",mode==="group"?"chatGroupTools":"chatInviteSection");
 $("chatToggleAdd").setAttribute("aria-label",mode==="group"?chatText("创建或加入群聊","グループを作成・参加","Create or join a group"):chatText("添加好友","友達を追加","Add friend"));
 $("chatStatus").hidden=mode==="group";
 if(mode==="private"&&$("chatStatus").dataset.friendsSyncedCount!==undefined)updateChatLanguage();
 $("chatTitle").textContent=mode==="group"?chatText("群聊","グループチャット","Group Chats"):chatText("好友私聊","チャット","Private Chat");
 if(mode==="group"){groupShowCachedList();groupLoadList()}else loadChatFriends();
}
async function groupLoadList(force=false){
 if(!currentUser||chatMode!=="group"||chatActiveGroup||groupListLoading)return;
 if(!force&&Date.now()-groupListLastLoaded<12000)return;
 groupListLoading=true;const userId=currentUser.id;
 try{
  const {data:membership,error}=await supabaseClient.from("chat_group_members").select("group_id").eq("user_id",userId);
  if(error)throw error;
  const ids=[...new Set((membership||[]).map(m=>m.group_id))];
  let groups=[];
  if(ids.length){const result=await supabaseClient.from("chat_groups").select("id,name,created_by").in("id",ids);if(result.error)throw result.error;groups=result.data||[]}
  if(currentUser?.id!==userId||chatMode!=="group"||chatActiveGroup)return;
  groupListLastLoaded=Date.now();
  const enriched=await groupFetchPreviews(groups);
  if(currentUser?.id!==userId||chatMode!=="group"||chatActiveGroup)return;
  groupRenderList(enriched);
  const validGroups=new Set(groups.map(g=>g.id));
  try{
   for(let i=sessionStorage.length-1;i>=0;i--){
    const key=sessionStorage.key(i);
    const prefix="myplanner-group-msg-"+userId+"-";
    if(key?.startsWith(prefix)&&!validGroups.has(key.slice(prefix.length)))sessionStorage.removeItem(key);
   }
  }catch{}
  try{localStorage.setItem(groupListCacheKey,JSON.stringify({userId,groups:enriched}))}catch{}
 }catch(error){groupError(error)}
 finally{groupListLoading=false}
}
const GROUP_REPLY_PREFIX="[myplanner-group-reply]:";
let groupReplyTarget=null;
const groupRecallBusy=new Set();
const GROUP_HIDDEN_KEY="myplanner-group-hidden-v1";
function groupHiddenIds(groupId){
 if(!currentUser)return new Set();
 try{const all=JSON.parse(localStorage.getItem(GROUP_HIDDEN_KEY)||"{}");return new Set(all[currentUser.id+"|"+groupId]||[])}catch{return new Set()}
}
function groupHideForMe(item){
 if(!currentUser||!chatActiveGroup)return;
 const groupId=chatActiveGroup.id,userId=currentUser.id,key=userId+"|"+groupId;
 if(!confirm(chatText("仅在此设备隐藏这条群消息？其他成员仍然可以看到。","この端末でのみ非表示にしますか？","Hide this group message on this device only?")))return;
 try{
  const all=JSON.parse(localStorage.getItem(GROUP_HIDDEN_KEY)||"{}");
  all[key]=[...new Set([...(all[key]||[]),String(item.id)])].slice(-3000);
  localStorage.setItem(GROUP_HIDDEN_KEY,JSON.stringify(all));
 }catch(error){groupError(error);return}
 groupLastSignature="";
 document.querySelectorAll("#chatGroupMessages [data-group-message-id]").forEach(el=>{if(el.dataset.groupMessageId===String(item.id))el.remove()});
 groupLoadMessages();
}

function groupParseReply(body){
 if(typeof body!=="string"||!body.startsWith(GROUP_REPLY_PREFIX))return null;
 try{const data=JSON.parse(body.slice(GROUP_REPLY_PREFIX.length));return typeof data.text==="string"&&typeof data.quote==="string"?data:null}catch{return null}
}
function groupPlainBody(body){return groupParseReply(body)?.text??body}
function groupQuote(body){
 const text=String(groupPlainBody(body)||"");
 return text.startsWith("[myplanner-group-image]:")?chatText("图片","画像","Photo"):text.replace(/\\s+/g," ").slice(0,100);
}
function groupUpdateReplyPreview(){
 let node=document.getElementById("chatGroupReplyPreview");
 if(!node){
  node=document.createElement("div");node.id="chatGroupReplyPreview";node.className="chat-reply-preview";
  const form=$("chatGroupSendForm");form.parentNode.insertBefore(node,form);
 }
 node.replaceChildren();node.hidden=!groupReplyTarget;
 if(!groupReplyTarget)return;
 const info=document.createElement("span");info.className="chat-reply-preview-info";
 const title=document.createElement("strong");title.textContent=chatText("正在回复","返信中","Replying to");
 const quote=document.createElement("span");quote.textContent=groupQuote(groupReplyTarget.body);
 info.append(title,quote);
 const close=document.createElement("button");close.type="button";close.className="chat-reply-close";close.textContent="×";
 close.setAttribute("aria-label",chatText("取消回复","返信をキャンセル","Cancel reply"));
 close.addEventListener("click",()=>{groupReplyTarget=null;groupUpdateReplyPreview()});
 node.append(info,close);
}
async function groupRecallMessage(item){
 if(!currentUser||!chatActiveGroup||item.sender_id!==currentUser.id)return;
 const id=String(item.id),groupId=chatActiveGroup.id,userId=currentUser.id;
 if(groupRecallBusy.has(id)||!confirm(chatText("撤回这条群消息？所有群成员都将看不到它。","このグループメッセージを取り消しますか？","Recall this message for everyone in the group?")))return;
 groupRecallBusy.add(id);
 try{
  const {data,error}=await supabaseClient.from("chat_group_messages").delete().eq("id",item.id).eq("group_id",groupId).eq("sender_id",userId).select("id");
  if(error)throw error;
  if(!data?.length)throw new Error(chatText("服务器未授权删除，请检查群消息 DELETE 权限。","グループメッセージの削除権限を確認してください。","Group message DELETE permission is missing."));
  if(chatActiveGroup?.id!==groupId)return;
  document.querySelectorAll("#chatGroupMessages [data-group-message-id]").forEach(el=>{if(el.dataset.groupMessageId===id)el.remove()});
  groupLastSignature="";
  try{
   const key="myplanner-group-msg-"+userId+"-"+groupId;
   const cached=JSON.parse(sessionStorage.getItem(key)||"null");
   if(Array.isArray(cached?.items)){cached.items=cached.items.filter(x=>String(x.id)!==id);sessionStorage.setItem(key,JSON.stringify(cached))}
  }catch{}
  if(groupReplyTarget?.id===id){groupReplyTarget=null;groupUpdateReplyPreview()}
  groupStatus(chatText("消息已撤回","メッセージを取り消しました","Message recalled"));
  groupScheduleRefresh();
 }catch(error){groupError(error);alert(chatText("撤回失败：","取り消し失敗：","Recall failed: ")+(error?.message||String(error)))}
 finally{groupRecallBusy.delete(id)}
}
function groupMessageActions(bubble,item){
 let timer=null,x=0,y=0,opened=false;
 const cancel=()=>{if(timer!==null){clearTimeout(timer);timer=null}};
 const open=()=>{
  if(opened)return;opened=true;cancel();chatCloseMessageMenu();
  const menu=document.createElement("div");menu.className="chat-context-menu";menu.setAttribute("role","menu");
  const add=(label,action,extra="")=>{
   const btn=document.createElement("button");btn.type="button";btn.className="chat-context-option "+extra;btn.textContent=label;
   btn.addEventListener("click",e=>{e.stopPropagation();chatCloseMessageMenu();action()});menu.append(btn);
  };
  if(!String(groupPlainBody(item.body)||"").startsWith("[myplanner-group-image]:")){
   add(chatText("复制","コピー","Copy"),async()=>{
    const value=String(groupPlainBody(item.body)||"");
    try{await navigator.clipboard.writeText(value);groupStatus(chatText("已复制","コピーしました","Copied"))}
    catch{window.prompt(chatText("复制消息","メッセージをコピー","Copy message"),value)}
   });
  }
  add(chatText("回复","返信","Reply"),()=>{
   groupReplyTarget={id:String(item.id),body:item.body,groupId:chatActiveGroup?.id};
   groupUpdateReplyPreview();$("chatGroupMessageInput").focus();
  });
  if(item.sender_id===currentUser?.id)add(chatText("撤回","送信取消","Recall"),()=>groupRecallMessage(item),"danger");
  add(chatText("仅为我删除","自分のみ削除","Delete for me"),()=>groupHideForMe(item),"danger");
  document.body.append(menu);chatMenuNode=menu;
  const rect=bubble.getBoundingClientRect(),width=menu.offsetWidth,height=menu.offsetHeight;
  menu.style.left=Math.max(8,Math.min(innerWidth-width-8,rect.left))+"px";
  menu.style.top=Math.max(8,Math.min(innerHeight-height-8,rect.top-height-8))+"px";
  setTimeout(()=>document.addEventListener("pointerdown",chatDismissMessageMenu,{once:true}),0);
 };
 bubble.addEventListener("pointerdown",e=>{if(e.button!==0||e.target.closest("button,a,img"))return;x=e.clientX;y=e.clientY;opened=false;cancel();timer=setTimeout(open,480)});
 bubble.addEventListener("pointermove",e=>{if(Math.abs(e.clientX-x)>12||Math.abs(e.clientY-y)>12)cancel()});
 for(const type of ["pointerup","pointercancel","pointerleave"])bubble.addEventListener(type,cancel);
 bubble.addEventListener("contextmenu",e=>{e.preventDefault();open()});
}
function groupClose(){
 groupReplyTarget=null;groupUpdateReplyPreview();
 if(groupMessageRefreshTimer){clearTimeout(groupMessageRefreshTimer);groupMessageRefreshTimer=null}
 $("chatGroupMembersPanel").hidden=true;$("chatGroupInvitePanel").hidden=true;
 chatActiveGroup=null;groupLastSignature="";
 if(groupChannel){supabaseClient.removeChannel(groupChannel);groupChannel=null}
 $("chatGroupConversation").hidden=true;$("chatModeSwitch").hidden=false;
 $("chatGroups").hidden=chatMode!=="group";$("chatGroupTools").hidden=true;$("chatToggleAdd").setAttribute("aria-expanded","false");
 document.body.classList.remove("chat-open");
 if(chatMode==="group")groupLoadList(true);
}
let groupPanelPrefetch=null;
function groupPreparePanels(group){
 if(!currentUser||!group)return;
 const userId=currentUser.id,groupId=group.id;
 const members=supabaseClient.from("chat_group_members").select("user_id,joined_at").eq("group_id",groupId).order("joined_at").then(x=>x);
 const friends=supabaseClient.from("chat_friends").select("user_a,user_b").or("user_a.eq."+userId+",user_b.eq."+userId).then(x=>x);
 const inviteMembers=supabaseClient.from("chat_group_members").select("user_id").eq("group_id",groupId).then(x=>x);
 groupPanelPrefetch={groupId,userId,members,friends,inviteMembers};
}
let groupPanelWarm=null;
function groupWarmPanels(group){
 if(!currentUser||!group)return;
 const state={groupId:group.id,userId:currentUser.id,membersPending:true,invitePending:true};
 groupPanelWarm=state;
 groupShowMembers(true).catch(error=>console.warn("Member preload failed",error)).finally(()=>{state.membersPending=false});
 if(group.created_by===currentUser.id){
  groupLoadInviteFriends(true).catch(error=>console.warn("Invite preload failed",error)).finally(()=>{state.invitePending=false});
 }else state.invitePending=false;
}
async function groupOpen(group){
 if(groupMessageRefreshTimer){clearTimeout(groupMessageRefreshTimer);groupMessageRefreshTimer=null}
 if(groupChannel){supabaseClient.removeChannel(groupChannel);groupChannel=null}
 groupReplyTarget=null;groupUpdateReplyPreview();
 chatActiveGroup=group;groupLastSignature="";groupMessageLastFetched=0;
 groupMarkSeen(group.id);
 $("chatGroupTitle").textContent=group.name;
 $("chatGroups").hidden=true;$("chatGroupTools").hidden=true;$("chatModeSwitch").hidden=true;
 $("chatGroupConversation").hidden=false;document.body.classList.add("chat-open");
 $("chatGroupMessages").replaceChildren();$("chatGroupMembersPanel").hidden=true;$("chatGroupInvitePanel").hidden=true;
 groupShowCachedMessages(group.id);
 groupChannel=supabaseClient.channel("group-"+group.id)
 .on("postgres_changes",{event:"INSERT",schema:"public",table:"chat_group_messages",filter:"group_id=eq."+group.id},()=>groupScheduleRefresh())
 .on("postgres_changes",{event:"DELETE",schema:"public",table:"chat_group_messages"},()=>groupScheduleRefresh())
 .subscribe();
 const messagesRequest=groupLoadMessages();
 groupPreparePanels(group);
 groupWarmPanels(group);
 await messagesRequest;
}
function groupScheduleRefresh(){
 if(groupMessageRefreshTimer||!chatActiveGroup)return;
 groupMessageRefreshTimer=setTimeout(()=>{groupMessageRefreshTimer=null;if(chatActiveGroup&&!document.hidden)groupLoadMessages()},250);
}
function groupShowCachedMessages(groupId){
 if(!currentUser)return;
 try{const key="myplanner-group-msg-"+currentUser.id+"-"+groupId;const cache=JSON.parse(sessionStorage.getItem(key)||localStorage.getItem(key)||"null");if(Array.isArray(cache?.items)&&chatActiveGroup?.id===groupId){groupRenderMessages(cache.items);groupLastSignature=uiLanguage+"|"+cache.items.map(m=>m.id+":"+chatRemarkFor(m.sender_id)).join(",")}}catch{}
}
function groupRenderMessages(items){
 const root=$("chatGroupMessages"),nearBottom=root.scrollHeight-root.scrollTop-root.clientHeight<140;
 const hidden=groupHiddenIds(chatActiveGroup?.id);
 const fragment=document.createDocumentFragment();
 for(const item of items){
  if(hidden.has(String(item.id)))continue;
  const bubble=document.createElement("div");bubble.dataset.groupMessageId=String(item.id);bubble.className="chat-bubble"+(item.sender_id===currentUser.id?" mine":"");chatBubbleAvatar(bubble,item.sender_id,true);
  const sender=document.createElement("span");sender.className="group-message-sender";sender.textContent=item.sender_id===currentUser.id?chatText("我","自分","Me"):(chatRemarkFor(item.sender_id)||item.sender_id.slice(0,8));
  const body=document.createElement("span");
  if(item.body.startsWith("[myplanner-group-image]:")){
   const path=item.body.slice("[myplanner-group-image]:".length);
   if(/^[0-9a-f-]{36}\/[0-9a-f-]{36}\/[0-9a-f-]{36}\.(jpg|png|webp|gif)$/i.test(path)){
    chatAttachStoredPhoto(body,path,true);

   }else body.textContent=chatText("照片无效","無効な画像","Invalid photo");
  }else{
   const reply=groupParseReply(item.body);
   if(reply){const quote=document.createElement("div");quote.className="chat-quoted-message";const label=document.createElement("strong");label.textContent=chatText("回复消息","返信","Reply");const content=document.createElement("span");content.textContent=reply.quote;quote.append(label,content);body.append(quote);const text=document.createElement("div");text.className="chat-reply-text";text.textContent=reply.text;body.append(text)}
   else body.textContent=item.body;
  }
  const time=document.createElement("small");time.textContent=new Date(item.created_at).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"});
  bubble.append(sender,body,time);groupMessageActions(bubble,item);fragment.append(bubble);
 }
 const oldNodes=[...root.children],newNodes=[...fragment.children];
 let appendOnly=oldNodes.length>0&&newNodes.length>=oldNodes.length;
 if(appendOnly){for(let i=0;i<oldNodes.length;i++){if(!oldNodes[i].dataset.groupMessageId||oldNodes[i].dataset.groupMessageId!==newNodes[i].dataset.groupMessageId){appendOnly=false;break}}}
 if(appendOnly){for(let i=oldNodes.length;i<newNodes.length;i++)root.append(newNodes[i])}else root.replaceChildren(fragment);
 if(nearBottom||!root.dataset.loaded)root.scrollTop=root.scrollHeight;root.dataset.loaded="1";
}
async function groupLoadMessages(){
 if(groupPolling||!chatActiveGroup||!currentUser)return;
 groupPolling=true;const groupId=chatActiveGroup.id,userId=currentUser.id;groupMessageLastFetched=Date.now();
 try{
  const {data,error}=await supabaseClient.from("chat_group_messages").select("id,sender_id,body,created_at").eq("group_id",groupId).order("created_at",{ascending:false}).limit(150);
  if(error)throw error;
  if(!chatActiveGroup||chatActiveGroup.id!==groupId||currentUser?.id!==userId)return;
  const items=(data||[]).reverse(),signature=uiLanguage+"|"+items.map(m=>m.id+":"+chatRemarkFor(m.sender_id)).join(",");
  if(signature===groupLastSignature)return;
  groupLastSignature=signature;
  groupRenderMessages(items);
  groupMarkSeen(groupId,items[items.length-1]?.created_at);
  try{const key="myplanner-group-msg-"+currentUser.id+"-"+groupId;const payload=JSON.stringify({items:items.slice(-60)});sessionStorage.setItem(key,payload);localStorage.setItem(key,payload)}catch{}
 }catch(error){if(chatActiveGroup?.id===groupId&&currentUser?.id===userId)groupError(error);groupMessageLastFetched=0}
 finally{groupPolling=false}
}
$("chatPrivateMode").addEventListener("click",()=>groupMode("private"));
$("chatGroupMode").addEventListener("click",()=>groupMode("group"));
$("chatGroupBack").addEventListener("click",groupClose);
$("chatCreateGroup").addEventListener("click",async()=>{
 if(!currentUser)return;
 const name=$("chatGroupName").value.trim();if(name.length<2||name.length>40){groupStatus(chatText("群名称需要2–40个字符","グループ名は2〜40文字","Group name must be 2–40 characters"));return}
 const btn=$("chatCreateGroup");btn.disabled=true;
 try{
  groupStatus(chatText("正在创建群聊…","グループを作成中…","Creating group..."));
  btn.textContent=chatText("创建中…","作成中…","Creating...");
  const {data:groupId,error}=await supabaseClient.rpc("chat_create_group",{group_name:name});
  if(error)throw error;
  $("chatGroupName").value="";
  groupStatus(chatText("群聊创建成功，正在打开…","作成しました。開いています…","Group created. Opening..."));
  if(typeof groupId==="string"&&/^[0-9a-f-]{36}$/i.test(groupId)){
   await groupOpen({id:groupId,name,created_by:currentUser.id});
  }else{
   await groupLoadList(true);
   groupStatus(chatText("群聊已创建，请在下方列表中打开","グループを作成しました","Group created; open it below"));
  }
 }catch(error){
  groupError(error);
  alert(chatText("创建群聊失败：","グループ作成に失敗：","Could not create group: ")+(error?.message||String(error)));
 }finally{btn.disabled=false;btn.textContent=chatText("创建群聊","グループ作成","Create")}
});
$("chatJoinGroup").addEventListener("click",async()=>{
 if(!currentUser)return;
 const code=$("chatGroupJoinCode").value.trim();
 if(!/^[0-9a-f-]{36}$/i.test(code)){groupStatus(chatText("请输入有效的群邀请码","有効な招待コードを入力","Enter a valid group invite code"));return}
 const btn=$("chatJoinGroup");btn.disabled=true;
 try{const {error}=await supabaseClient.rpc("chat_join_group",{invite_code:code});if(error)throw error;$("chatGroupJoinCode").value="";groupStatus(chatText("已加入群聊","グループに参加しました","Joined group"));await groupLoadList(true)}catch(error){groupError(error)}finally{btn.disabled=false}
});
$("chatGroupInvite").addEventListener("click",()=>{
 if(!chatActiveGroup)return;
 $("chatGroupInviteCode").value=chatActiveGroup.id;
 $("chatGroupInviteFeedback").textContent="";
 $("chatGroupMembersPanel").hidden=true;
 $("chatGroupInvitePanel").hidden=false;
 groupLoadInviteFriends();
});
async function groupLoadInviteFriends(warm=false,force=false){
 if(!chatActiveGroup||!currentUser)return;
 const groupId=chatActiveGroup.id;
 const area=$("chatGroupFriendInvite"),root=$("chatGroupFriendInviteList");
 const isOwner=chatActiveGroup.created_by===currentUser.id;
 area.hidden=!isOwner;
 const cached=root.dataset.groupId===groupId&&root.dataset.userId===currentUser.id&&root.children.length>0;
 if(!cached){root.replaceChildren();root.dataset.groupId=groupId;root.dataset.userId=currentUser.id;root.dataset.renderedAt="0"}
 if(!warm&&!force&&cached&&Date.now()-Number(root.dataset.renderedAt||0)<30000)return;
 if(!warm&&groupPanelWarm?.groupId===groupId&&groupPanelWarm?.userId===currentUser.id&&groupPanelWarm.invitePending)return;
 if(!isOwner){root.replaceChildren();return}
 // Keep the panel stable while fetching; no temporary loading text or layout jump.
 const prepared=groupPanelPrefetch?.groupId===groupId&&groupPanelPrefetch?.userId===currentUser.id?groupPanelPrefetch:null;
 const prefetchedFriends=prepared?.friends,prefetchedInviteMembers=prepared?.inviteMembers;
 if(prepared){prepared.friends=null;prepared.inviteMembers=null}
 const [friendsResult,membersResult]=await Promise.all([
  prefetchedFriends||supabaseClient.from("chat_friends").select("user_a,user_b").or("user_a.eq."+currentUser.id+",user_b.eq."+currentUser.id),
  prefetchedInviteMembers||supabaseClient.from("chat_group_members").select("user_id").eq("group_id",groupId)
 ]);
 if(!chatActiveGroup||chatActiveGroup.id!==groupId||($("chatGroupInvitePanel").hidden&&!warm))return;
 if(friendsResult.error||membersResult.error){if(!cached)root.textContent=(friendsResult.error||membersResult.error).message;return}
 const ids=[...new Set((friendsResult.data||[]).map(f=>f.user_a===currentUser.id?f.user_b:f.user_a))].filter(id=>id!==currentUser.id);
 const members=new Set((membersResult.data||[]).map(m=>m.user_id));
 if(!ids.length){root.textContent=chatText("还没有好友，可以先添加好友","友達がまだいません","No friends yet");return}
 const {data:profiles,error}=await supabaseClient.from("chat_profiles").select("id,display_name").in("id",ids);
 if(!chatActiveGroup||chatActiveGroup.id!==groupId||($("chatGroupInvitePanel").hidden&&!warm))return;
 if(error){if(!cached)root.textContent=error.message;return}
 const fragment=document.createDocumentFragment();
 const names=new Map((profiles||[]).map(p=>[p.id,p.display_name]));
 for(const id of ids){
  const row=document.createElement("div");row.className="chat-group-invite-friend";
  const name=document.createElement("span");name.textContent=chatRemarkFor(id)||names.get(id)||id.slice(0,8);
  const btn=document.createElement("button");btn.type="button";
  const joined=members.has(id);btn.textContent=joined?chatText("已在群里","参加済み","Joined"):chatText("添加","追加","Add");btn.disabled=joined;
  btn.addEventListener("click",async()=>{
   if(!chatActiveGroup||chatActiveGroup.id!==groupId)return;
   btn.disabled=true;btn.textContent=chatText("添加中…","追加中…","Adding...");
   const {error:addError}=await supabaseClient.rpc("chat_add_group_member",{target_group:groupId,target_user:id});
   if(addError){btn.disabled=false;btn.textContent=chatText("重试","再試行","Retry");$("chatGroupInviteFeedback").textContent=addError.message;return}
   $("chatGroupMembersList").dataset.renderedAt="0";
   members.add(id);btn.textContent=chatText("已在群里","参加済み","Joined");
   $("chatGroupInviteFeedback").textContent=chatText("已添加好友到群聊","友達をグループに追加しました","Friend added to group");
  });
  row.append(name,btn);fragment.append(row);
 }
 root.replaceChildren(fragment);root.dataset.renderedAt=String(Date.now());
}
$("chatGroupInviteClose").addEventListener("click",()=>{$("chatGroupInvitePanel").hidden=true});
$("chatGroupCopyInvite").addEventListener("click",async()=>{
 const code=$("chatGroupInviteCode").value;
 try{await navigator.clipboard.writeText(code);$("chatGroupInviteFeedback").textContent=chatText("邀请码已复制","招待コードをコピーしました","Invite code copied")}
 catch{$("chatGroupInviteCode").focus();$("chatGroupInviteCode").select();$("chatGroupInviteFeedback").textContent=chatText("请长按邀请码复制","コードを長押ししてコピー","Long-press the code to copy")}
});
$("chatGroupShareInvite").addEventListener("click",async()=>{
 const code=$("chatGroupInviteCode").value;
 if(navigator.share){try{await navigator.share({title:"My Planner",text:chatText("加入我的 My Planner 群聊：","My Planner のグループに参加：","Join my My Planner group: ")+code});return}catch(e){if(e?.name==="AbortError")return}}
 $("chatGroupInviteCode").focus();$("chatGroupInviteCode").select();
 $("chatGroupInviteFeedback").textContent=chatText("请复制上方邀请码分享给好友","上のコードをコピーして共有","Copy the code above to share");
});
async function groupShowMembers(warm=false,force=false){
 if(!chatActiveGroup)return;
 const panel=$("chatGroupMembersPanel"),root=$("chatGroupMembersList");
 if(!warm){$("chatGroupInvitePanel").hidden=true;panel.hidden=false;}
 const groupId=chatActiveGroup.id;
 const cached=root.dataset.groupId===groupId&&root.dataset.userId===currentUser.id&&root.children.length>0;
 if(!cached){root.replaceChildren();root.dataset.groupId=groupId;root.dataset.userId=currentUser.id;root.dataset.renderedAt="0"}
 if(!warm&&!force&&cached&&Date.now()-Number(root.dataset.renderedAt||0)<30000)return;
 if(!warm&&groupPanelWarm?.groupId===groupId&&groupPanelWarm?.userId===currentUser.id&&groupPanelWarm.membersPending)return;
 const prepared=groupPanelPrefetch?.groupId===groupId&&groupPanelPrefetch?.userId===currentUser.id?groupPanelPrefetch:null;
 const prefetchedMembers=prepared?.members;
 if(prepared)prepared.members=null;
 const {data,error}=await (prefetchedMembers||supabaseClient.from("chat_group_members").select("user_id,joined_at").eq("group_id",groupId).order("joined_at"));
 if(error){groupError(error);return}
 if(!chatActiveGroup||chatActiveGroup.id!==groupId||(panel.hidden&&!warm))return;
 const fragment=document.createDocumentFragment();
 $("chatGroupAddMember").hidden=chatActiveGroup.created_by!==currentUser.id;
 $("chatGroupDisband").hidden=chatActiveGroup.created_by!==currentUser.id;
 if(chatActiveGroup.created_by===currentUser.id){
  const renameRow=document.createElement("div");renameRow.className="group-rename-row";
  const renameButton=document.createElement("button");renameButton.type="button";
  renameButton.textContent=chatText("修改群名称","グループ名を変更","Rename group");
  renameButton.addEventListener("click",async()=>{
   const active=chatActiveGroup;if(!active||active.created_by!==currentUser?.id)return;
   const input=prompt(chatText("输入新的群名称","新しいグループ名","New group name"),active.name);
   if(input===null)return;
   const name=input.trim().slice(0,40);if(name.length<2){alert(chatText("群名称至少需要2个字符","グループ名は2文字以上必要です","Group name must contain at least 2 characters"));return}if(name===active.name)return;
   renameButton.disabled=true;
   const result=await supabaseClient.from("chat_groups").update({name}).eq("id",active.id).eq("created_by",currentUser.id).select("id,name");
   renameButton.disabled=false;
   if(result.error||!result.data?.length){
    alert(chatText("修改失败：请检查群名称修改权限","変更できません。権限を確認してください","Rename failed. Check group permissions.")+(result.error?"\n"+result.error.message:""));
    return;
   }
   if(chatActiveGroup?.id===active.id){chatActiveGroup.name=name;$("chatGroupTitle").textContent=name}
   groupListLastLoaded=0;groupListSignature="";
  });
  renameRow.append(renameButton);fragment.append(renameRow);
 }
 const members=[...new Map((data||[]).map(m=>[m.user_id,m])).values()];
 const ids=members.map(x=>x.user_id);
 let profiles=[];
 if(ids.length){
  const res=await supabaseClient.from("chat_profiles").select("id,display_name,username").in("id",ids);
  if(!res.error)profiles=res.data||[];
  else {
   const fallback=await supabaseClient.from("chat_profiles").select("id,display_name").in("id",ids);
   if(!fallback.error)profiles=fallback.data||[];
  }
 }
 const names=new Map(profiles.map(p=>[p.id,p.username?"@"+p.username:(p.display_name||"")]));
 const nameCounts=new Map();for(const id of ids){const name=names.get(id);if(name)nameCounts.set(name,(nameCounts.get(name)||0)+1)}
 for(const member of members){
  const row=document.createElement("div");row.className="chat-group-member";
  const label=document.createElement("span");label.textContent=(chatRemarkFor(member.user_id)||names.get(member.user_id)||"ID: "+member.user_id.slice(0,8))+(nameCounts.get(names.get(member.user_id))>1?" · "+member.user_id.slice(0,8):"")+(member.user_id===chatActiveGroup.created_by?" ★":"")+(member.user_id===currentUser.id?chatText("（我）","（自分）"," (Me)"):"");
  row.append(label);
  if(member.user_id!==currentUser.id){
   const remarkBtn=document.createElement("button");remarkBtn.type="button";
   remarkBtn.className="group-member-remark-btn";
   remarkBtn.textContent=chatText("备注","メモ","Nickname");
   remarkBtn.addEventListener("click",()=>{
    chatSetRemarkFor(member.user_id);
    label.textContent=(chatRemarkFor(member.user_id)||names.get(member.user_id)||"ID: "+member.user_id.slice(0,8))+(nameCounts.get(names.get(member.user_id))>1?" · "+member.user_id.slice(0,8):"")+(member.user_id===chatActiveGroup.created_by?" ★":"");
   });
   row.append(remarkBtn);
  }
  if(chatActiveGroup.created_by===currentUser.id&&member.user_id!==currentUser.id){
   const kick=document.createElement("button");kick.type="button";kick.textContent=chatText("移除","削除","Remove");
   kick.addEventListener("click",async()=>{
    if(!confirm(chatText("确定移除此成员？","このメンバーを削除しますか？","Remove this member?")))return;
    const {error}=await supabaseClient.rpc("chat_remove_group_member",{target_group:groupId,target_user:member.user_id});
    if(error)groupError(error);else {$("chatGroupFriendInviteList").dataset.renderedAt="0";groupShowMembers(false,true)};
   });row.append(kick);
  }
  fragment.append(row);
 }
 root.replaceChildren(fragment);root.dataset.renderedAt=String(Date.now());
 if(!warm)panel.hidden=false;
}
$("chatGroupAddByUsername").addEventListener("click",async()=>{
 if(!chatActiveGroup||!currentUser||chatActiveGroup.created_by!==currentUser.id)return;
 const username=$("chatGroupAddUsername").value.trim().replace(/^@/,"").toLowerCase();
 const status=$("chatGroupAddStatus"),button=$("chatGroupAddByUsername");
 if(!chatUsernameValid(username)){status.textContent=chatText("请输入3–20位用户名","3〜20文字のユーザー名を入力","Enter a 3–20 character username");return}
 button.disabled=true;status.textContent=chatText("正在查找…","検索中…","Searching...");
 try{
  const {data,error}=await supabaseClient.rpc("chat_find_username",{search_username:username});
  if(error)throw error;
  const person=Array.isArray(data)?data[0]:null;
  if(!person)throw Error(chatText("找不到这个用户名","ユーザーが見つかりません","Username not found"));
  const groupId=chatActiveGroup.id;
  const {error:addError}=await supabaseClient.rpc("chat_add_group_member",{target_group:groupId,target_user:person.id});
  if(addError)throw addError;
  if(chatActiveGroup?.id!==groupId)return;
  $("chatGroupAddUsername").value="";
  status.textContent=chatText("已添加 @","追加しました @","Added @")+person.username;
  $("chatGroupFriendInviteList").dataset.renderedAt="0";
  await groupShowMembers(false,true);
 }catch(error){status.textContent=error?.message||String(error)}
 finally{button.disabled=false}
});
$("chatGroupManage").addEventListener("click",()=>groupShowMembers());
$("chatGroupMembersClose").addEventListener("click",()=>{$("chatGroupMembersPanel").hidden=true});
$("chatGroupDisband").addEventListener("click",async()=>{
 if(!currentUser||!chatActiveGroup||chatActiveGroup.created_by!==currentUser.id)return;
 const groupId=chatActiveGroup.id,groupName=chatActiveGroup.name;
 if(!confirm(chatText("确定解散「"+groupName+"」？所有群成员将被移除，群消息会永久删除。","「"+groupName+"」を解散しますか？メッセージとメンバーが完全に削除されます。","Disband "+groupName+"? All members and messages will be permanently deleted.")))return;
 const typed=prompt(chatText("为确认解散，请输入群名称："+groupName,"確認のためグループ名を入力："+groupName,"Type the group name to confirm: "+groupName));
 if(typed!==groupName){if(typed!==null)alert(chatText("群名称不一致，已取消","グループ名が一致しません","Group name did not match. Cancelled."));return}
 const button=$("chatGroupDisband");button.disabled=true;
 try{
  const {error}=await supabaseClient.rpc("chat_disband_group",{target_group:groupId});
  if(error)throw error;
  if(chatActiveGroup?.id===groupId)groupClose();
  groupStatus(chatText("群聊已解散","グループを解散しました","Group disbanded"));
 }catch(error){groupError(error);alert(chatText("解散失败：","解散に失敗：","Disband failed: ")+(error?.message||String(error)))}
 finally{button.disabled=false}
});
$("chatGroupLeave").addEventListener("click",async()=>{
 if(!chatActiveGroup||!currentUser)return;
 if(!confirm(chatText("确定退出群聊？","グループを退出しますか？","Leave this group?")))return;
 const {error}=await supabaseClient.rpc("chat_leave_group",{target_group:chatActiveGroup.id});
 if(error){groupError(error);return}
 groupClose();
});
$("chatGroupPhotoInput").addEventListener("change",async event=>{
 const file=event.target.files?.[0];event.target.value="";
 if(!file||!currentUser||!chatActiveGroup)return;
 if(!file.type.startsWith("image/")||file.size>8*1024*1024){groupError(chatText("请选择8MB以内的照片","8MB以下の写真を選択","Choose a photo under 8MB"));return}
 const groupId=chatActiveGroup.id,btn=$("chatGroupPhotoInput");
 btn.disabled=true;
 const preview=document.createElement("div");preview.className="chat-bubble mine";
 const img=document.createElement("img");img.className="chat-photo";img.src=URL.createObjectURL(file);
 const status=document.createElement("small");status.textContent=chatText("照片发送中…","写真を送信中…","Sending photo...");
 preview.append(img,status);$("chatGroupMessages").append(preview);$("chatGroupMessages").scrollTop=$("chatGroupMessages").scrollHeight;
 try{
  const preparedFile=await chatPrepareUploadFile(file);
  const type=preparedFile.type==="image/png"?"png":preparedFile.type==="image/webp"?"webp":preparedFile.type==="image/gif"?"gif":"jpg";
  const path=currentUser.id+"/"+groupId+"/"+crypto.randomUUID()+"."+type;
  const {error:uploadError}=await supabaseClient.storage.from("chat-photos").upload(path,preparedFile,{contentType:preparedFile.type,upsert:false});
  if(uploadError)throw uploadError;
  const {error}=await supabaseClient.from("chat_group_messages").insert({group_id:groupId,sender_id:currentUser.id,body:"[myplanner-group-image]:"+path});
  if(error)throw error;
  status.textContent=new Date().toLocaleString();
  groupLastSignature="";await groupLoadMessages();
 }catch(error){status.textContent=chatText("发送失败","送信失敗","Failed");groupError(error)}
 finally{btn.disabled=false;setTimeout(()=>URL.revokeObjectURL(img.src),30000)}
});
$("chatGroupSendForm").addEventListener("submit",async event=>{
 event.preventDefault();if(!currentUser||!chatActiveGroup)return;
 const input=$("chatGroupMessageInput"),textBody=input.value.trim();if(!textBody)return;
 const groupId=chatActiveGroup.id;
 const reply=groupReplyTarget?.groupId===groupId?groupReplyTarget:null;
 const body=reply?GROUP_REPLY_PREFIX+JSON.stringify({id:reply.id,quote:groupQuote(reply.body),text:textBody}):textBody;
 input.value="";groupReplyTarget=null;groupUpdateReplyPreview();
 const root=$("chatGroupMessages"),bubble=document.createElement("div");bubble.className="chat-bubble mine";
 const label=document.createElement("span");label.textContent=body;
 const time=document.createElement("small");time.textContent=new Date().toLocaleString()+" · "+chatText("发送中…","送信中…","Sending...");
 bubble.append(label,time);root.append(bubble);root.scrollTop=root.scrollHeight;
 const {error}=await supabaseClient.from("chat_group_messages").insert({group_id:groupId,sender_id:currentUser.id,body});
 if(error){time.textContent=chatText("发送失败","送信失敗","Failed");groupError(error);return}
 time.textContent=new Date().toLocaleString();groupLastSignature="";groupLoadMessages();
});
setInterval(()=>{if(!document.hidden&&document.body.dataset.activePage==="chat"&&chatActiveGroup)groupLoadMessages()},5000);
/* Chat V43: LINE-style friend management drawer. */
$("chatToggleAdd").addEventListener("click",()=>{
 const isGroup=chatMode==="group";
 const panel=$(isGroup?"chatGroupTools":"chatInviteSection");
 const other=$(isGroup?"chatInviteSection":"chatGroupTools");
 const open=panel.hidden;
 other.hidden=true;panel.hidden=!open;
 $("chatToggleAdd").setAttribute("aria-expanded",String(open));
 $("chatToggleAdd").setAttribute("aria-controls",isGroup?"chatGroupTools":"chatInviteSection");
 if(open&&!isGroup&&currentUser){
  $("chatIdentity").textContent=chatText("我的邀请码：","自分の招待コード：","My invite code: ")+currentUser.id;
 }
});

// v66: initialize navigation only after chatPeer and all chat handlers exist.
window.myPlannerChatReady=true;
updateChatLanguage();
initPlannerPages();
showWelcomeAuth();


// V102: user-selectable appearance, saved only on this device.
(function initAppearance(){
  const key="myPlannerAppearance";
  const allowed=["auto","light","dark"];
  const media=window.matchMedia("(prefers-color-scheme: dark)");
  let selected=localStorage.getItem(key)||"auto";
  if(!allowed.includes(selected))selected="auto";
  const apply=()=>{
    const mode=selected==="auto"?(media.matches?"dark":"light"):selected;
    document.documentElement.dataset.theme=mode;
    document.documentElement.style.colorScheme=mode;
    const meta=document.querySelector('meta[name="theme-color"]');
    if(meta)meta.setAttribute("content",mode==="dark"?"#000000":"#ffffff");
    document.querySelectorAll("[data-appearance]").forEach(button=>{
      const active=button.dataset.appearance===selected;
      button.setAttribute("aria-pressed",String(active));
      button.classList.toggle("active",active);
    });
  };
  document.querySelectorAll("[data-appearance]").forEach(button=>button.addEventListener("click",()=>{
    selected=button.dataset.appearance;
    localStorage.setItem(key,selected);
    apply();
  }));
  if(media.addEventListener)media.addEventListener("change",()=>{if(selected==="auto")apply()});
  else if(media.addListener)media.addListener(()=>{if(selected==="auto")apply()});
  apply();
})();

// V103: fast local conversation search; does not send search terms to the server.
(function initChatListSearch(){
  const input=document.getElementById("chatListSearchInput");
  const clear=document.getElementById("chatListSearchClear");
  const empty=document.getElementById("chatListSearchEmpty");
  const wrap=document.getElementById("chatListSearch");
  const friends=document.getElementById("chatFriends");
  const groups=document.getElementById("chatGroups");
  const sectionTitle=document.getElementById("chatListSectionTitle");
  const sectionCount=document.getElementById("chatListSectionCount");
  if(!input||!clear||!empty||!wrap||!friends||!groups)return;
  const filter=()=>{
    const isGroup=document.getElementById("chatGroupMode")?.classList.contains("active");
    const active=isGroup?groups:friends;
    const term=input.value.trim().toLocaleLowerCase();
    clear.hidden=!term;
    let total=0,visible=0;
    for(const root of [friends,groups]){
      for(const item of root.querySelectorAll(".chat-friend")){
        if(root===active){
          total++;
          const name=item.querySelector(".chat-friend-info strong")?.textContent||"";
          const match=!term||name.toLocaleLowerCase().includes(term);
          item.hidden=!match;
          if(match)visible++;
        }else item.hidden=false;
      }
    }
    empty.hidden=!term||total===0||visible!==0;
    if(sectionTitle)sectionTitle.textContent=isGroup?chatText("我的群聊","グループチャット","My groups"):chatText("最近聊天","最近のチャット","Recent chats");
    if(sectionCount)sectionCount.textContent=uiLanguage==="zh"?total+(isGroup?" 个群聊":" 个会话"):uiLanguage==="ja"?total+" 件":total+(isGroup?" groups":" chats");
    wrap.hidden=Boolean(document.body.classList.contains("chat-open"));
  };
  input.addEventListener("input",filter);
  clear.addEventListener("click",()=>{input.value="";filter();input.focus()});
  for(const root of [friends,groups])new MutationObserver(filter).observe(root,{childList:true});
  new MutationObserver(filter).observe(document.body,{attributes:true,attributeFilter:["class"]});
  for(const id of ["chatPrivateMode","chatGroupMode","chatGroupBack","chatBack"]){
    document.getElementById(id)?.addEventListener("click",()=>queueMicrotask(filter));
  }
  filter();
})();


/* v169: iOS Safari/PWA keyboard-safe composer.
   The visual viewport (not 100dvh) defines the usable screen while typing.
   Never add the keyboard height to composer padding; that double-offsets input.
*/
(function initChatKeyboardAndComposer(){
 const fields=[document.getElementById("chatMessageInput"),document.getElementById("chatGroupMessageInput")].filter(Boolean);
 if(!fields.length)return;
 const root=document.documentElement;
 let raf=0, lastHeight=0, lastTop=-1, wasOpen=false;
 let knownWidth=window.innerWidth, baseline=window.visualViewport?.height||window.innerHeight;
 const activeField=()=>fields.includes(document.activeElement)?document.activeElement:null;
 const scrollMessages=(field)=>{
  const id=field?.id==="chatGroupMessageInput"?"chatGroupMessages":"chatMessages";
  const list=document.getElementById(id);
  if(list)list.scrollTop=list.scrollHeight;
 };
 const applyViewport=()=>{
  raf=0;
  const vv=window.visualViewport;
  const height=Math.max(1,Math.round(vv?.height||window.innerHeight));
  const top=Math.max(0,Math.round(vv?.offsetTop||0));
  const field=activeField();
  const focused=Boolean(field&&document.body.classList.contains("chat-open"));
  if(knownWidth!==window.innerWidth){knownWidth=window.innerWidth;baseline=height}
  if(!focused&&height>baseline)baseline=height;
  const hiddenPixels=Math.max(0,window.innerHeight-height-top,baseline-height-top);
  const keyboardOpen=focused&&hiddenPixels>100;
  if(height!==lastHeight){root.style.setProperty("--chat-visible-height",height+"px");lastHeight=height}
  if(top!==lastTop){root.style.setProperty("--chat-visible-top",top+"px");lastTop=top}
  document.body.classList.toggle("chat-input-focused",focused);
  document.body.classList.toggle("chat-keyboard-open",keyboardOpen);
  if(keyboardOpen&&!wasOpen)requestAnimationFrame(()=>scrollMessages(field));
  wasOpen=keyboardOpen;
 };
 const updateViewport=()=>{
  if(!raf)raf=requestAnimationFrame(applyViewport);
 };
 const grow=input=>{
  input.style.height="0px";
  input.style.height=Math.min(116,Math.max(40,input.scrollHeight))+"px";
 };
 for(const input of fields){
  grow(input);
  input.addEventListener("input",()=>{grow(input);},{passive:true});
  input.addEventListener("focus",()=>{
   updateViewport();
   requestAnimationFrame(()=>scrollMessages(input));
  });
  input.addEventListener("blur",updateViewport);
  input.addEventListener("keydown",event=>{
   if(event.key==="Enter"&&(event.ctrlKey||event.metaKey)&&!event.isComposing){
    event.preventDefault();input.form?.requestSubmit();
   }
  });
  input.form?.addEventListener("submit",()=>requestAnimationFrame(()=>grow(input)));
 }
 window.visualViewport?.addEventListener("resize",updateViewport,{passive:true});
 window.visualViewport?.addEventListener("scroll",updateViewport,{passive:true});
 window.addEventListener("resize",updateViewport,{passive:true});
 window.addEventListener("orientationchange",updateViewport,{passive:true});
 document.addEventListener("visibilitychange",()=>{if(!document.hidden)updateViewport()});
 applyViewport();
})();
