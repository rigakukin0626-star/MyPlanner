/* SOVEREIGN Journal v256: private dated entries, drafts, backups and optional RLS cloud sync. */
(function () {
  "use strict";
  const page = document.getElementById("pageCalendar");
  const calendar = page?.querySelector(".calendar-panel");
  if (!page || !calendar) return;
  const el = id => document.getElementById(id);
  const KEY = "sovereign-journal-v256:";
  const MOODS = ["calm", "happy", "normal", "tired", "sad"];
  const labels = {
    zh: {open:"日记",back:"日历",title:"日记",subtitle:"为每一天留下自己的记录。",new:"写日记",search:"搜索日记内容",date:"日期",heading:"标题（可选）",headingPlaceholder:"给这一天起个名字",body:"今天发生了什么？",bodyPlaceholder:"写下今天的故事、想法或心情…",mood:"心情",save:"保存日记",cancel:"取消",edit:"编辑",remove:"删除",empty:"还没有日记，从今天开始写第一篇吧。",noResults:"没有匹配的日记。",export:"导出备份",import:"导入备份",saved:"已保存在本机",synced:"云端已同步",syncing:"正在同步日记…",guest:"日记仅保存在本机；登录后可使用云端同步。",missing:"日记仅保存在本机；请先在 Supabase 运行日记建表 SQL 以开启云端同步。",offline:"已保存到本机；网络恢复后会重试云端同步。",confirm:"确定删除这篇日记吗？",deleted:"已删除",imported:"已导入备份",badFile:"导入失败：文件格式不正确。",storageError:"本机保存失败，请导出备份并检查存储空间。",draft:"已恢复未保存的草稿",moods:["平静","开心","一般","疲惫","难过"]},
    ja: {open:"日記",back:"カレンダー",title:"日記",subtitle:"毎日の記憶を、自分の言葉で。",new:"日記を書く",search:"日記を検索",date:"日付",heading:"タイトル（任意）",headingPlaceholder:"今日のタイトル",body:"今日はどんな一日でしたか？",bodyPlaceholder:"出来事や考え、気持ちを書き留めましょう…",mood:"気分",save:"日記を保存",cancel:"キャンセル",edit:"編集",remove:"削除",empty:"まだ日記がありません。今日から始めましょう。",noResults:"一致する日記はありません。",export:"バックアップ",import:"バックアップ読込",saved:"端末に保存済み",synced:"クラウド同期済み",syncing:"日記を同期中…",guest:"日記は端末内に保存されます。ログイン後に同期できます。",missing:"端末に保存済み。クラウド同期には Supabase で日記用SQLの実行が必要です。",offline:"端末に保存済み。通信回復後にクラウド同期を再試行します。",confirm:"この日記を削除しますか？",deleted:"削除しました",imported:"バックアップを読み込みました",badFile:"読み込み失敗：ファイル形式が正しくありません。",storageError:"端末への保存に失敗しました。空き容量をご確認ください。",draft:"未保存の下書きを復元しました",moods:["穏やか","嬉しい","普通","疲れた","悲しい"]},
    en: {open:"Journal",back:"Calendar",title:"Journal",subtitle:"Make space for the moments that matter.",new:"New entry",search:"Search entries",date:"Date",heading:"Title (optional)",headingPlaceholder:"Name this day",body:"What happened today?",bodyPlaceholder:"Write your thoughts, memories or feelings…",mood:"Mood",save:"Save entry",cancel:"Cancel",edit:"Edit",remove:"Delete",empty:"No entries yet. Write your first one today.",noResults:"No matching entries.",export:"Export backup",import:"Import backup",saved:"Saved on this device",synced:"Cloud synced",syncing:"Syncing journal…",guest:"Entries are stored on this device. Sign in for cloud sync.",missing:"Saved locally. Run the journal setup SQL in Supabase to enable cloud sync.",offline:"Saved locally. Cloud sync will retry when online.",confirm:"Delete this entry?",deleted:"Entry deleted",imported:"Backup imported",badFile:"Import failed: invalid file.",storageError:"Unable to save on this device. Check available storage.",draft:"Recovered unsaved draft",moods:["Calm","Happy","Okay","Tired","Sad"]}
  };
  function language() {
    const chosen = el("languageSelect")?.value || "auto";
    const raw = chosen === "auto" ? (navigator.languages?.[0] || navigator.language || "en") : chosen;
    const code = raw.toLowerCase().split("-")[0];
    return labels[code] ? code : "en";
  }
  let lang = language(), dict = labels[lang], owner = null, entries = new Map(), shown = false, editing = null;
  let timer = null, syncing = false, rerun = false, cloudAvailable = true, hasSynced = false;
  const stamp = () => new Date().toISOString();
  const day = () => {const d = new Date(); return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");};
  const storeKey = () => KEY+(owner || "guest");
  const draftKey = () => storeKey()+":draft";
  function validRecord(v) {
    if (!v || typeof v !== "object" || typeof v.id !== "string" || !/^[0-9a-f-]{36}$/i.test(v.id) || !/^\d{4}-\d{2}-\d{2}$/.test(v.date)) return null;
    return {id:v.id,date:v.date,title:String(v.title||"").slice(0,120),body:String(v.body||"").slice(0,30000),
      mood:MOODS.includes(v.mood)?v.mood:"normal",createdAt:String(v.createdAt||v.updatedAt||stamp()),
      updatedAt:String(v.updatedAt||v.createdAt||stamp()),deletedAt:v.deletedAt?String(v.deletedAt):null};
  }
  function readLocal() {
    try {const arr=JSON.parse(localStorage.getItem(storeKey())||"[]"); return new Map((Array.isArray(arr)?arr:[]).map(validRecord).filter(Boolean).map(x=>[x.id,x]));}
    catch(e) {console.warn("Journal cache unavailable",e);return new Map();}
  }
  function persist() {
    try {localStorage.setItem(storeKey(),JSON.stringify([...entries.values()]));return true;}
    catch(e) {console.error("Journal local save failed",e);status(dict.storageError);return false;}
  }
  function status(s) {el("journalStatus").textContent=s;}
  const open = document.createElement("button");
  open.type="button";open.className="journal-open-button";open.id="journalOpen";
  open.innerHTML='<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M6.5 3H20v18H6.5A2.5 2.5 0 0 1 4 18.5v-13A2.5 2.5 0 0 1 6.5 3Z"/><path d="M9 8h6M9 12h7"/></svg><span></span><span class="journal-open-arrow">›</span>';
  calendar.querySelector(".section-heading")?.after(open);
  const view = document.createElement("section");
  view.id = "journalView";view.className = "journal-view";view.hidden = true;
  view.innerHTML = '<div class="journal-header"><button type="button" id="journalBack" class="journal-back" aria-label="Back">‹ <span></span></button><h2 id="journalTitle"></h2><button type="button" id="journalNew" class="journal-new"></button></div>'+
    '<p class="journal-subtitle" id="journalSubtitle"></p>'+
    '<div class="journal-toolbar"><input id="journalSearch" type="search" maxlength="120" autocomplete="off" aria-label="Search"><button type="button" id="journalExport"></button><label class="journal-import"><span id="journalImportLabel"></span><input type="file" id="journalImport" accept=".json,application/json" hidden></label></div>'+
    '<form id="journalForm" class="journal-form" hidden><div class="journal-form-top"><label><span id="journalDateLabel"></span><input type="date" id="journalDate" required></label><label><span id="journalMoodLabel"></span><select id="journalMood"></select></label></div>'+
    '<label class="journal-field"><span id="journalHeadingLabel"></span><input id="journalHeading" maxlength="120" autocomplete="off"></label>'+
    '<label class="journal-field"><span id="journalBodyLabel"></span><textarea id="journalBody" maxlength="30000" rows="10" required></textarea></label>'+
    '<div class="journal-form-actions"><button type="button" id="journalCancel"></button><button type="submit" id="journalSave"></button></div></form>'+
    '<p class="journal-empty" id="journalEmpty"></p><div class="journal-list" id="journalList"></div><p class="journal-status" id="journalStatus" role="status" aria-live="polite"></p>';
  page.prepend(view);
  function localize() {
    lang=language();dict=labels[lang];
    const text = {journalTitle:"title",journalSubtitle:"subtitle",journalNew:"new",journalExport:"export",journalImportLabel:"import",
      journalDateLabel:"date",journalMoodLabel:"mood",journalHeadingLabel:"heading",journalBodyLabel:"body",journalCancel:"cancel",journalSave:"save"};
    for(const [id,k] of Object.entries(text)) el(id).textContent=dict[k];
    open.querySelector("span").textContent=dict.open;
    el("journalBack").querySelector("span").textContent=dict.back;
    el("journalSearch").placeholder=dict.search;
    el("journalHeading").placeholder=dict.headingPlaceholder;
    el("journalBody").placeholder=dict.bodyPlaceholder;
    el("journalMood").replaceChildren(...MOODS.map((value,i)=>{const o=document.createElement("option");o.value=value;o.textContent=dict.moods[i];return o;}));
    renderList();
  }
  function showJournal(value) {
    shown=value;
    view.hidden=!shown;
    page.classList.toggle("journal-active",shown);
    if(shown) {localize();renderList();} else {el("journalForm").hidden=true;editing=null;}
    window.scrollTo(0,0);
  }
  open.addEventListener("click",()=>showJournal(true));
  el("journalBack").addEventListener("click",()=>showJournal(false));
  function draft() {
    try {const raw=JSON.parse(localStorage.getItem(draftKey())||"null");return raw&&typeof raw==="object"?raw:null;}catch{return null;}
  }
  function writeDraft() {
    if(el("journalForm").hidden)return;
    try {localStorage.setItem(draftKey(),JSON.stringify({id:editing,date:el("journalDate").value,title:el("journalHeading").value,
      body:el("journalBody").value,mood:el("journalMood").value}));}catch{}
  }
  function editRecord(id) {
    const record=id?entries.get(id):null;
    if(id&&(!record||record.deletedAt))return;
    editing=record?.id||null;
    const saved=!id?draft():null;
    el("journalDate").value=record?.date||saved?.date||day();
    el("journalHeading").value=record?.title||saved?.title||"";
    el("journalBody").value=record?.body||saved?.body||"";
    el("journalMood").value=record?.mood||saved?.mood||"normal";
    el("journalForm").hidden=false;
    if(saved&&!id)status(dict.draft);
    el("journalForm").scrollIntoView({block:"start",behavior:"smooth"});
  }
  el("journalNew").addEventListener("click",()=>editRecord(null));
  el("journalCancel").addEventListener("click",()=>{el("journalForm").hidden=true;editing=null;try{localStorage.removeItem(draftKey());}catch{}});
  for(const id of ["journalDate","journalHeading","journalBody","journalMood"])el(id).addEventListener("input",writeDraft);
  el("journalForm").addEventListener("submit",event=>{
    event.preventDefault();
    const date=el("journalDate").value,body=el("journalBody").value.trim();
    if(!/^\d{4}-\d{2}-\d{2}$/.test(date)||!body)return;
    const previous=editing?entries.get(editing):null;
    const now=stamp(),id=previous?.id||(crypto.randomUUID?.()||"");
    if(!id)return;
    entries.set(id,{id,date,title:el("journalHeading").value.trim(),body,mood:el("journalMood").value,
      createdAt:previous?.createdAt||now,updatedAt:now,deletedAt:null});
    if(!persist())return;
    try{localStorage.removeItem(draftKey());}catch{}
    editing=null;el("journalForm").hidden=true;renderList();status(dict.saved);scheduleSync();
  });
  function renderList() {
    if(!el("journalList"))return;
    const query=el("journalSearch").value.trim().toLocaleLowerCase();
    const all=[...entries.values()].filter(v=>!v.deletedAt).sort((a,b)=>b.date.localeCompare(a.date)||b.updatedAt.localeCompare(a.updatedAt));
    const visible=all.filter(v=>!query||(v.title+" "+v.body+" "+v.date+" "+dict.moods[MOODS.indexOf(v.mood)]).toLocaleLowerCase().includes(query));
    el("journalEmpty").hidden=visible.length>0;
    el("journalEmpty").textContent=all.length?dict.noResults:dict.empty;
    const frag=document.createDocumentFragment();
    for(const item of visible){
      const card=document.createElement("article");card.className="journal-entry";
      const head=document.createElement("div");head.className="journal-entry-meta";
      const when=document.createElement("time");when.dateTime=item.date;when.textContent=new Intl.DateTimeFormat(lang==="ja"?"ja-JP":lang==="zh"?"zh-CN":"en-US",{year:"numeric",month:"long",day:"numeric"}).format(new Date(item.date+"T12:00:00"));
      const mood=document.createElement("span");mood.className="journal-entry-mood";mood.textContent=dict.moods[MOODS.indexOf(item.mood)];
      head.append(when,mood);
      const heading=document.createElement("h3");heading.textContent=item.title||item.body.split("\n").find(Boolean)?.slice(0,42)||item.date;
      const preview=document.createElement("p");preview.textContent=item.body.length>150?item.body.slice(0,150)+"…":item.body;
      const actions=document.createElement("div");actions.className="journal-entry-actions";
      for(const [action,label] of [["edit",dict.edit],["delete",dict.remove]]){
        const btn=document.createElement("button");btn.type="button";btn.dataset.action=action;btn.dataset.id=item.id;btn.textContent=label;actions.append(btn);
      }
      card.append(head,heading,preview,actions);frag.append(card);
    }
    el("journalList").replaceChildren(frag);
  }
  el("journalSearch").addEventListener("input",renderList);
  el("journalList").addEventListener("click",e=>{
    const btn=e.target.closest("button[data-action]");if(!btn)return;
    const id=btn.dataset.id;
    if(btn.dataset.action==="edit")editRecord(id);
    else if(confirm(dict.confirm)){
      const original=entries.get(id);if(!original)return;
      const now=stamp();entries.set(id,{...original,deletedAt:now,updatedAt:now});
      if(persist()){renderList();status(dict.deleted);scheduleSync();}
    }
  });
  el("journalExport").addEventListener("click",()=>{
    const payload=JSON.stringify({type:"sovereign-journal",version:1,exportedAt:stamp(),entries:[...entries.values()]},null,2);
    const url=URL.createObjectURL(new Blob([payload],{type:"application/json"}));
    const a=document.createElement("a");a.href=url;a.download="sovereign-journal-"+day()+".json";a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  });
  el("journalImport").addEventListener("change",async e=>{
    const file=e.target.files?.[0];if(!file)return;
    try {
      if(file.size>8_000_000)throw Error("too large");
      const data=JSON.parse(await file.text());
      if(data.type!=="sovereign-journal"||!Array.isArray(data.entries))throw Error("invalid format");
      const next=new Map(entries);
      for(const raw of data.entries.slice(0,5000)){const v=validRecord(raw);if(!v)continue;const old=next.get(v.id);if(!old||v.updatedAt>old.updatedAt)next.set(v.id,v);}
      entries=next;if(!persist())return;renderList();status(dict.imported);scheduleSync();
    }catch(err){console.warn("Journal import failed",err);status(dict.badFile);}
    finally{e.target.value="";}
  });
  function scheduleSync() {
    hasSynced=false;
    if(!owner){status(dict.guest);return;}
    if(!cloudAvailable){status(dict.missing);return;}
    if(timer)clearTimeout(timer);
    timer=setTimeout(()=>{timer=null;void sync();},900);
    if(syncing)rerun=true;
  }
  function fromCloud(v) {return validRecord({id:v.id,date:v.entry_date,title:v.title,body:v.body,mood:v.mood,
    createdAt:v.created_at,updatedAt:v.updated_at,deletedAt:v.deleted_at});}
  function toCloud(v,uid) {return {id:v.id,user_id:uid,entry_date:v.date,title:v.title,body:v.body,mood:v.mood,
    created_at:v.createdAt,updated_at:v.updatedAt,deleted_at:v.deletedAt};}
  async function sync() {
    if(!owner||!navigator.onLine){status(dict.offline);return;}
    if(syncing){rerun=true;return;}
    syncing=true;const uid=owner;status(dict.syncing);
    try{
      const remote=new Map();let offset=0;
      while(true){
        const {data,error}=await supabaseClient.from("journal_entries")
          .select("id,entry_date,title,body,mood,created_at,updated_at,deleted_at").eq("user_id",uid)
          .order("id",{ascending:true}).range(offset,offset+499);
        if(error)throw error;
        if(owner!==uid)return;
        for(const row of data||[]){const v=fromCloud(row);if(v)remote.set(v.id,v);}
        if(!data||data.length<500)break;
        offset+=500;
      }
      const merged=new Map(remote),pending=[];
      for(const local of entries.values()){
        const other=merged.get(local.id);
        if(!other||local.updatedAt>other.updatedAt){merged.set(local.id,local);pending.push(local);}
      }
      if(owner!==uid)return;
      entries=merged;if(!persist())throw Error("Unable to persist journal merge");
      for(let i=0;i<pending.length;i+=50){
        if(owner!==uid)return;
        const {error}=await supabaseClient.from("journal_entries").upsert(pending.slice(i,i+50).map(v=>toCloud(v,uid)),{onConflict:"id"});
        if(error)throw error;
      }
      if(owner!==uid)return;
      // An edit made during network sync is retained and uploaded by the next pass.
      const latest=readLocal();
      for(const [id,v] of latest){const old=entries.get(id);if(!old||v.updatedAt>old.updatedAt)entries.set(id,v);}
      persist();renderList();cloudAvailable=true;hasSynced=true;status(dict.synced);
    }catch(err){
      if(owner!==uid)return;
      console.warn("Journal sync unavailable",err);
      const message=String(err.code||"")+" "+String(err.message||"");
      cloudAvailable=!/PGRST205|42P01|Could not find the table|relation .*journal_entries.* does not exist/i.test(message);
      status(cloudAvailable?dict.offline:dict.missing);
    }finally{
      syncing=false;
      if(rerun&&owner===uid){rerun=false;scheduleSync();}
    }
  }
  function setOwner(id) {
    if(owner===id)return;
    if(timer)clearTimeout(timer);timer=null;
    owner=id;entries=readLocal();cloudAvailable=true;hasSynced=false;
    el("journalForm").hidden=true;editing=null;renderList();
    status(id?dict.syncing:dict.guest);
    if(id)scheduleSync();
  }
  el("languageSelect")?.addEventListener("change",()=>queueMicrotask(()=>{localize();status(owner?(hasSynced?dict.synced:cloudAvailable?dict.offline:dict.missing):dict.guest);}));
  window.addEventListener("online",()=>{if(owner){cloudAvailable=true;scheduleSync();}});
  document.addEventListener("visibilitychange",()=>{if(!document.hidden&&owner&&cloudAvailable&&!hasSynced)scheduleSync();});
  supabaseClient.auth.onAuthStateChange((_event,session)=>{setTimeout(()=>setOwner(session?.user?.id||null),0);});
  supabaseClient.auth.getSession().then(({data})=>setOwner(data.session?.user?.id||null)).catch(()=>setOwner(null));
  entries=readLocal();localize();status(dict.guest);
  window.SovereignJournal={open:()=>showJournal(true),sync:()=>{cloudAvailable=true;return sync();}};
})();
