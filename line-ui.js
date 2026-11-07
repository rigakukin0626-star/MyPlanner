/* My Planner: LINE-inspired lightweight navigation layer, v170.
   UI only: no Supabase schemas, storage keys or message handlers changed.
   Existing buttons and forms retain their original handlers.
*/
(function initLineChatNavigation(){
 "use strict";
 const $=id=>document.getElementById(id);
 const root=$("pageChat");
 const chatPanel=root?.querySelector(".chat-panel");
 const plus=$("chatToggleAdd");
 const listHeader=root?.querySelector(".chat-app-header");
 if(!root||!chatPanel||!plus||!listHeader)return;
 const tr=(zh,ja,en)=>typeof chatText==="function"?chatText(zh,ja,en):zh;
 const icon=(which)=>{
  const paths={
   person:'<circle cx="11" cy="8" r="3.3"/><path d="M4 20c0-3.3 2.8-5.6 7-5.6 2.1 0 3.8.5 5 1.5"/><path d="M19 15v7M15.5 18.5h7"/>',
   users:'<circle cx="8.5" cy="8" r="3"/><path d="M2.5 20c0-3.2 2.4-5.1 6-5.1 2 0 3.5.5 4.5 1.2"/><path d="M15.5 5.5a3.2 3.2 0 0 1 0 6"/><path d="M16 15h7M19.5 11.5v7"/>',
   join:'<path d="M3 12h11m-4-4 4 4-4 4"/><path d="M14 5h6v14h-6"/>',
   invite:'<path d="M15 18h6m-3-3v6"/><circle cx="9" cy="8" r="3"/><path d="M3 20c0-3.5 2.2-5.5 6-5.5 2.2 0 3.8.7 5 2"/>',
   members:'<circle cx="8" cy="8" r="3"/><path d="M2.5 20c0-3.2 2.2-5.1 5.5-5.1s5.5 1.9 5.5 5.1"/><path d="M16 5.3a3.1 3.1 0 0 1 0 5.5M17 14.5c3.1.3 4.5 2.2 4.5 5.5"/>',
   more:'<circle cx="5" cy="12" r="1.7"/><circle cx="12" cy="12" r="1.7"/><circle cx="19" cy="12" r="1.7"/>',
   back:'<path d="m15 18-6-6 6-6"/>',
   chevron:'<path d="m9 18 6-6-6-6"/>',
   edit:'<path d="M4 20h4l11-11-4-4L4 16v4z"/><path d="m13 7 4 4"/>',
   trash:'<path d="M4 7h16M9 7V4h6v3M7 7l1 13h8l1-13M10 11v6M14 11v6"/>',
   copy:'<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"/>'
  };
  return '<svg viewBox="0 0 24 24" width="21" height="21" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+paths[which]+'</svg>';
 };
 const menuEntry=(action,kind)=>{
  const button=document.createElement("button");
  button.type="button";
  button.className="line-menu-entry";
  button.dataset.lineAction=action;
  button.innerHTML='<span class="line-menu-icon">'+icon(kind)+'</span><span class="line-menu-label"></span><span class="line-menu-chevron">'+icon("chevron")+'</span>';
  return button;
 };
 // Unified quick actions: show a small menu, NOT a huge form under the tabs.
 const menu=document.createElement("div");
 menu.id="lineQuickMenu";menu.className="line-popup-menu";menu.hidden=true;
 menu.setAttribute("role","menu");
 menu.append(menuEntry("friend","person"),menuEntry("create","users"),menuEntry("join","join"));
 listHeader.append(menu);
 const screen=document.createElement("div");
 screen.id="lineActionScreen";screen.className="line-action-screen";screen.hidden=true;
 screen.innerHTML='<header class="line-screen-header"><button id="lineActionBack" type="button" class="line-back-button" aria-label="Back">'+icon("back")+'</button><strong id="lineActionTitle"></strong></header><div id="lineActionContent" class="line-action-content"></div>';
 root.append(screen);
 const actionContent=$("lineActionContent");
 const friendPanel=$("chatInviteSection");
 const groupPanel=$("chatGroupTools");
 actionContent.append(friendPanel,groupPanel);
 const friendStatus=document.createElement("p");
 friendStatus.className="line-action-error";friendStatus.setAttribute("role","status");
 friendPanel.append(friendStatus);
 const globalChatStatus=$("chatStatus");
 if(globalChatStatus){
  new MutationObserver(()=>{
   if(selectedAction==="friend"&&!screen.hidden)friendStatus.textContent=globalChatStatus.textContent||"";
  }).observe(globalChatStatus,{childList:true,characterData:true,subtree:true});
 }
 let selectedAction="";
 const closePopup=()=>{menu.hidden=true;plus.setAttribute("aria-expanded","false")};
 function closeScreen(){
  selectedAction="";
  screen.hidden=true;
  document.body.classList.remove("line-action-open");
  friendPanel.hidden=true;
  groupPanel.hidden=true;
 }
 function showScreen(action){
  closePopup();
  if(action==="create"||action==="join"){
   if(typeof groupMode==="function")groupMode("group");
  }else if(action==="friend"&&typeof groupMode==="function"){
   groupMode("private");
  }
  selectedAction=action;screen.dataset.screen=action;screen.hidden=false;
  friendStatus.textContent="";
  document.body.classList.add("line-action-open");
  friendPanel.hidden=action!=="friend";
  groupPanel.hidden=action==="friend";
  $("chatGroupStatus").textContent="";
  document.activeElement?.blur?.();
  refreshLanguage();
  screen.scrollTop=0;
 }
 window.closeChatActionScreen=closeScreen;
 function togglePopup(){
  if(!screen.hidden)return;
  const next=menu.hidden;
  menu.hidden=!next;
  plus.setAttribute("aria-expanded",String(next));
  plus.setAttribute("aria-controls","lineQuickMenu");
 }
 plus.setAttribute("aria-haspopup","menu");
 plus.setAttribute("aria-controls","lineQuickMenu");
 // Original legacy click handler also exists; intercept at capture phase so
 // it cannot open both forms under the chat list.
 plus.addEventListener("click",event=>{
  event.preventDefault();
  event.stopImmediatePropagation();
  togglePopup();
 },true);
 menu.addEventListener("click",event=>{
  const button=event.target.closest("[data-line-action]");
  if(!button)return;
  event.preventDefault();showScreen(button.dataset.lineAction);
 });
 $("lineActionBack").addEventListener("click",closeScreen);
 // Switching tabs closes the popup and the form view.
 for(const id of ["chatPrivateMode","chatGroupMode"]){
  $(id)?.addEventListener("click",closePopup);
 }
 document.querySelectorAll(".bottom-tabs .tab").forEach(tab=>tab.addEventListener("click",()=>{
  closePopup();if(!screen.hidden)closeScreen();
 }));
 document.addEventListener("pointerdown",event=>{
  if(menu.hidden)return;
  if(menu.contains(event.target)||plus.contains(event.target))return;
  closePopup();
 },{passive:true});
 // Additional group actions are tucked under an ellipsis menu.
 const groupHeader=$("chatGroupConversation")?.querySelector(".chat-conversation-header");
 const more=document.createElement("button");
 more.type="button";more.id="lineGroupMore";more.className="line-group-more";
 more.innerHTML=icon("more");more.setAttribute("aria-haspopup","menu");more.setAttribute("aria-expanded","false");
 const groupMenu=document.createElement("div");
 groupMenu.id="lineGroupMenu";groupMenu.className="line-popup-menu line-group-menu";groupMenu.hidden=true;
 groupMenu.setAttribute("role","menu");
 groupMenu.append(menuEntry("invite","invite"),menuEntry("members","members"));
 groupHeader?.append(more,groupMenu);
 const closeGroupMenu=()=>{groupMenu.hidden=true;more.setAttribute("aria-expanded","false")};
 more.addEventListener("click",event=>{
  event.preventDefault();
  const willOpen=groupMenu.hidden;
  groupMenu.hidden=!willOpen;
  if(willOpen){const rect=more.getBoundingClientRect();groupMenu.style.top=Math.min(rect.bottom+8,window.innerHeight-125)+"px";groupMenu.style.right=Math.max(12,window.innerWidth-rect.right)+"px";}
  more.setAttribute("aria-expanded",String(willOpen));
 });
 groupMenu.addEventListener("click",event=>{
  const button=event.target.closest("[data-line-action]");
  if(!button)return;
  closeGroupMenu();
  // Dispatch original handlers; they already implement permissions, caching
  // and Supabase updates. Their panels are now screen-sized.
  if(button.dataset.lineAction==="invite")$("chatGroupInvite")?.click();
  if(button.dataset.lineAction==="members")$("chatGroupManage")?.click();
 });
 document.addEventListener("pointerdown",event=>{
  if(groupMenu.hidden)return;
  if(groupMenu.contains(event.target)||more.contains(event.target))return;
  closeGroupMenu();
 },{passive:true});
 $("chatGroupBack")?.addEventListener("click",closeGroupMenu);
 // Proper back navigation for the separate group invite/member screens.
 const invitePanel=$("chatGroupInvitePanel");
 const inviteHead=document.createElement("header");
 inviteHead.className="line-subscreen-header";
 const inviteBack=document.createElement("button");inviteBack.type="button";
 inviteBack.className="line-back-button";inviteBack.innerHTML=icon("back");
 const inviteTitle=document.createElement("strong");inviteTitle.id="lineInviteTitle";
 inviteHead.append(inviteBack,inviteTitle);invitePanel?.prepend(inviteHead);
 inviteBack.addEventListener("click",()=>$("chatGroupInviteClose")?.click());
 const memberPanel=$("chatGroupMembersPanel");
 const memberHeading=memberPanel?.querySelector(".chat-group-members-heading");
 if(memberHeading){
  const memberBack=document.createElement("button");
  memberBack.type="button";memberBack.className="line-back-button";
  memberBack.innerHTML=icon("back");memberHeading.prepend(memberBack);
  memberBack.addEventListener("click",()=>$("chatGroupMembersClose")?.click());
 }
 // Private conversation actions use the same compact menu as group chat.
 const privateHeader=$("chatConversation")?.querySelector(".chat-conversation-header");
 const privateMore=document.createElement("button");
 privateMore.type="button";privateMore.id="linePrivateMore";privateMore.className="line-group-more line-private-more";
 privateMore.innerHTML=icon("more");privateMore.setAttribute("aria-haspopup","menu");privateMore.setAttribute("aria-expanded","false");
 const privateMenu=document.createElement("div");
 privateMenu.id="linePrivateMenu";privateMenu.className="line-popup-menu line-private-menu";
 privateMenu.hidden=true;privateMenu.setAttribute("role","menu");
 privateMenu.append(menuEntry("remark","edit"),menuEntry("copyid","copy"),menuEntry("removefriend","trash"));
 privateMenu.querySelector('[data-line-action="removefriend"]')?.classList.add("line-destructive");
 privateHeader?.append(privateMore,privateMenu);
 const closePrivateMenu=()=>{privateMenu.hidden=true;privateMore.setAttribute("aria-expanded","false")};
 privateMore.addEventListener("click",event=>{
  event.preventDefault();event.stopPropagation();
  const willOpen=privateMenu.hidden;
  privateMenu.hidden=!willOpen;
  privateMore.setAttribute("aria-expanded",String(willOpen));
 });
 privateMenu.addEventListener("click",async event=>{
  const button=event.target.closest("[data-line-action]");
  if(!button)return;
  const action=button.dataset.lineAction;
  closePrivateMenu();
  const peer=typeof chatPeer!=="undefined"?chatPeer:null;
  if(!peer||!currentUser)return;
  if(action==="remark"){
   chatSetRemarkFor(peer);
   const row=$("chatFriends")?.querySelector('.chat-friend[data-peer-id="'+peer+'"]');
   if(row){
    const name=$("chatPeerName")?.textContent||"";
    const title=row.querySelector(".chat-friend-info strong");
    const avatar=row.querySelector(".chat-list-avatar");
    if(title)title.textContent=name;
    if(avatar)avatar.textContent=name.trim().slice(0,1).toUpperCase()||"?";
    $("chatFriends").dataset.renderSignature="";
   }
   return;
  }
  if(action==="copyid"){
   try{await navigator.clipboard.writeText(peer)}
   catch{window.prompt(tr("复制好友 ID","友達IDをコピー","Copy friend ID"),peer)}
   return;
  }
  if(action!=="removefriend")return;
  const name=$("chatPeerName")?.textContent||tr("这位好友","この友だち","this friend");
  const question=tr(
   "确定删除「"+name+"」吗？将解除好友关系，但不会删除双方已经发送的聊天记录。",
   "「"+name+"」を友だちから削除しますか？過去のメッセージは削除されません。",
   "Remove "+name+" from friends? Existing messages will not be deleted."
  );
  if(!window.confirm(question))return;
  button.disabled=true;
  const userId=currentUser.id;
  try{
   // Limit deletion to the pair containing the current authenticated user.
   // RLS must grant DELETE to participants; otherwise report it rather than
   // falsely hiding the contact only on this device.
   const result=await supabaseClient.from("chat_friends").delete()
    .or("and(user_a.eq."+userId+",user_b.eq."+peer+"),and(user_a.eq."+peer+",user_b.eq."+userId+")")
    .select("user_a,user_b");
   if(result.error)throw result.error;
   if(!result.data?.length)throw Error(tr(
    "服务器未确认删除。可能需要配置好友删除权限。",
    "サーバーでの削除が確認できません。権限の確認が必要です。",
    "The server did not confirm deletion. Check friend-removal permissions."
   ));
   if(currentUser?.id!==userId)return;
   try{
    const cache=JSON.parse(localStorage.getItem("myplanner-friends-v1")||"null");
    if(cache?.userId===userId&&Array.isArray(cache.friends)){
     cache.friends=cache.friends.filter(friend=>friend.id!==peer);
     localStorage.setItem("myplanner-friends-v1",JSON.stringify(cache));
    }
   }catch(err){console.warn("Friend cache cleanup unavailable",err)}
   if(typeof chatPeer!=="undefined"&&chatPeer===peer)chatShowList();
   const list=$("chatFriends");
   list?.replaceChildren();
   if(list)list.dataset.renderSignature="";
   await loadChatFriends();
  }catch(error){
   console.warn("Could not remove friend",error);
   window.alert(tr("删除好友失败：","友だちの削除に失敗：","Could not remove friend: ")+(error?.message||String(error)));
  }finally{button.disabled=false}
 });
 document.addEventListener("pointerdown",event=>{
  if(privateMenu.hidden)return;
  if(privateMenu.contains(event.target)||privateMore.contains(event.target))return;
  closePrivateMenu();
 },{passive:true});
 $("chatBack")?.addEventListener("click",closePrivateMenu);
 document.querySelectorAll(".bottom-tabs .tab").forEach(tab=>tab.addEventListener("click",closePrivateMenu));
 function refreshLanguage(){
  for(const [action,labels] of Object.entries({
   friend:[tr("添加好友","友達を追加","Add friend")],
   create:[tr("创建群聊","グループを作成","Create group")],
   join:[tr("加入群聊","グループに参加","Join group")],
   invite:[tr("邀请成员","メンバーを招待","Invite members")],
   members:[tr("群成员","グループメンバー","Group members")]
  })){
   document.querySelectorAll('.line-menu-entry[data-line-action="'+action+'"] .line-menu-label').forEach(el=>el.textContent=labels[0]);
  }
  const titles={
   friend:tr("添加好友","友達を追加","Add friend"),
   create:tr("创建群聊","グループを作成","Create group"),
   join:tr("加入群聊","グループに参加","Join group")
  };
  $("lineActionTitle").textContent=titles[selectedAction]||"";
  $("lineInviteTitle").textContent=tr("邀请成员","メンバーを招待","Invite members");
  more.setAttribute("aria-label",tr("群聊选项","グループのメニュー","Group options"));
  privateMore.setAttribute("aria-label",tr("好友选项","友だちのメニュー","Friend options"));
  for(const [action,label] of Object.entries({
   remark:tr("修改备注","表示名を変更","Edit nickname"),
   copyid:tr("复制好友 ID","友だちIDをコピー","Copy friend ID"),
   removefriend:tr("删除好友","友だちを削除","Remove friend")
  })){
   const item=privateMenu.querySelector('[data-line-action="'+action+'"] .line-menu-label');
   if(item)item.textContent=label;
  }
  inviteBack.setAttribute("aria-label",tr("返回","戻る","Back"));
  $("lineActionBack").setAttribute("aria-label",tr("返回","戻る","Back"));
  const hint=$("lineActionHint");
  if(hint)hint.textContent=selectedAction==="friend"?tr("通过用户名或邀请码添加好友","ユーザー名または招待コードで追加","Find friends by username or invite code"):selectedAction==="create"?tr("为新群聊取一个名字","新しいグループの名前を入力","Choose a name for your group"):selectedAction==="join"?tr("输入好友分享的群邀请码","友達の招待コードを入力","Enter a shared group invite code"):"";
 }
 const hint=document.createElement("p");hint.id="lineActionHint";hint.className="line-action-hint";
 actionContent.prepend(hint);
 // Use actual swipe gestures on the list, but never hijack vertical scrolling,
 // inputs, menus or a conversation where users may scroll horizontally.
 let start=null;
 root.addEventListener("touchstart",event=>{
  if(event.touches.length!==1||!screen.hidden||!menu.hidden||!groupMenu.hidden||
     document.body.classList.contains("chat-open")||!$("chatConversation").hidden||!$("chatGroupConversation").hidden){
    start=null;return;
  }
  if(event.target.closest("input,textarea,select,.line-popup-menu,.chat-invite-section,.chat-group-tools")){start=null;return}
  const t=event.touches[0];start={x:t.clientX,y:t.clientY,time:Date.now()};
 },{passive:true});
 root.addEventListener("touchend",event=>{
  if(!start||event.changedTouches.length===0)return;
  const t=event.changedTouches[0];
  const dx=t.clientX-start.x,dy=t.clientY-start.y;
  start=null;
  if(Math.abs(dx)<65||Math.abs(dx)<Math.abs(dy)*1.35||Math.abs(dy)>110)return;
  event.preventDefault(); // Prevent the swipe from accidentally opening a chat row.
  if(dx<0&&typeof chatMode!=="undefined"&&chatMode==="private")groupMode("group");
  else if(dx>0&&typeof chatMode!=="undefined"&&chatMode==="group")groupMode("private");
 },{passive:false});
 root.addEventListener("touchcancel",()=>{start=null},{passive:true});
 document.addEventListener("keydown",event=>{
  if(event.key!=="Escape")return;
  if(!screen.hidden){closeScreen();return}
  if(!privateMenu.hidden){closePrivateMenu();return}
  if(!groupMenu.hidden){closeGroupMenu();return}
  if(!menu.hidden){closePopup();return}
  if(invitePanel&&!invitePanel.hidden){$("chatGroupInviteClose")?.click();return}
  if(memberPanel&&!memberPanel.hidden){$("chatGroupMembersClose")?.click();}
 });
 // DOM for changing language is already rebuilt by the original module.
 // Re-localize the additional labels after a picker change, without network IO.
 $("languageSelect")?.addEventListener("change",()=>queueMicrotask(refreshLanguage));
 window.refreshLineChatNavigation=refreshLanguage;
 refreshLanguage();
})();
