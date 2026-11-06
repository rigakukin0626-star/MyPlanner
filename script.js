const STORAGE_KEY = "myPlannerTasks";
const $ = (id) => document.getElementById(id);
const taskForm = $("taskForm");
const taskInput = $("taskInput");
const priorityInput = $("priorityInput");
const taskList = $("taskList");
const emptyState = $("emptyState");
const calendarGrid = $("calendarGrid");
const monthLabel = $("monthLabel");
const selectedDateTitle = $("selectedDateTitle");
const editDialog = $("editDialog");

const today = new Date();
const dateKey = (date) => `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,"0")}-${String(date.getDate()).padStart(2,"0")}`;
const todayKey = dateKey(today);
let selectedDate = todayKey;
let viewMonth = new Date(today.getFullYear(), today.getMonth(), 1);
let filter = "all";
let showLongTerm = false;
let editingId = null;
let tasks = loadTasks();

function loadTasks() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(saved) ? saved.map(t => ({
      id: String(t.id ?? Date.now() + Math.random()),
      text: String(t.text ?? ""),
      date: t.date || null,
      completed: Boolean(t.completed),
      priority: ["high","medium","low"].includes(t.priority) ? t.priority : "medium"
    })).filter(t => t.text.trim()) : [];
  } catch { return []; }
}
function saveTasks() { localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks)); }
function escapeText(value) {
  return String(value).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
}
function priorityName(p) { return ({high:"高",medium:"中",low:"低"})[p] || "中"; }

function render() {
  renderOverview();
  renderCalendar();
  renderTasks();
}
function renderOverview() {
  const todays = tasks.filter(t => t.date === todayKey);
  const done = todays.filter(t => t.completed).length;
  const percent = todays.length ? Math.round(done / todays.length * 100) : 0;
  $("todayDate").textContent = new Intl.DateTimeFormat("zh-CN",{year:"numeric",month:"long",day:"numeric",weekday:"long"}).format(today);
  $("totalCount").textContent = todays.length;
  $("doneCount").textContent = done;
  $("progressText").textContent = percent + "%";
  $("progressBar").style.width = percent + "%";
}
function renderCalendar() {
  const y = viewMonth.getFullYear(), m = viewMonth.getMonth();
  monthLabel.textContent = `${y}年${m+1}月`;
  calendarGrid.innerHTML = "";
  const first = new Date(y,m,1);
  const start = new Date(y,m,1-first.getDay());
  for (let i=0;i<42;i++) {
    const d = new Date(start); d.setDate(start.getDate()+i);
    const key = dateKey(d);
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "calendar-day";
    if (d.getMonth() !== m) btn.classList.add("muted-day");
    if (key === todayKey) btn.classList.add("today");
    if (key === selectedDate && !showLongTerm) btn.classList.add("selected");
    if (tasks.some(t => t.date === key)) btn.classList.add("has-tasks");
    btn.textContent = d.getDate();
    btn.setAttribute("aria-label", key);
    btn.addEventListener("click", () => { selectedDate = key; showLongTerm = false; render(); });
    calendarGrid.appendChild(btn);
  }
}
function renderTasks() {
  const source = tasks.filter(t => showLongTerm ? t.date === null : t.date === selectedDate);
  const visible = source.filter(t => filter === "all" || (filter === "active" ? !t.completed : t.completed));
  selectedDateTitle.textContent = showLongTerm ? "长期任务" : (selectedDate === todayKey ? "今日任务" : `${selectedDate} 任务`);
  $("taskCountLabel").textContent = `${visible.length} 项`;
  taskList.innerHTML = "";
  emptyState.hidden = visible.length > 0;
  if (!visible.length) {
    emptyState.querySelector("strong").textContent = filter === "all" ? "这里还很空" : "没有符合条件的任务";
    emptyState.querySelector("p").textContent = filter === "all" ? "添加一项任务，开始安排吧。" : "试试切换筛选条件。";
  }
  const rank = {high:0,medium:1,low:2};
  visible.sort((a,b) => Number(a.completed)-Number(b.completed) || rank[a.priority]-rank[b.priority]);
  visible.forEach(task => {
    const li = document.createElement("li");
    li.className = "task-item" + (task.completed ? " completed" : "");
    const check = document.createElement("input");
    check.type = "checkbox"; check.className = "task-check"; check.checked = task.completed;
    check.setAttribute("aria-label","标记完成");
    check.addEventListener("change", () => { task.completed = check.checked; saveTasks(); render(); });
    const text = document.createElement("span"); text.className = "task-text"; text.textContent = task.text;
    const badge = document.createElement("span"); badge.className = `priority priority-${task.priority}`; badge.textContent = priorityName(task.priority);
    const actions = document.createElement("div"); actions.className = "task-actions";
    const edit = document.createElement("button"); edit.type = "button"; edit.className = "task-action"; edit.textContent = "编辑"; edit.addEventListener("click",()=>openEdit(task.id));
    const del = document.createElement("button"); del.type = "button"; del.className = "task-action"; del.textContent = "删除"; del.addEventListener("click",()=>deleteTask(task.id));
    actions.append(edit,del); li.append(check,text,badge,actions); taskList.appendChild(li);
  });
}
taskForm.addEventListener("submit", e => {
  e.preventDefault();
  const text = taskInput.value.trim();
  if (!text) return;
  tasks.push({id: (crypto.randomUUID ? crypto.randomUUID() : String(Date.now()+Math.random())), text, date: showLongTerm ? null : selectedDate, completed:false, priority:priorityInput.value});
  saveTasks(); taskInput.value = ""; priorityInput.value = "medium"; taskInput.focus(); render();
});
function deleteTask(id) {
  if (!confirm("确定删除这项任务吗？")) return;
  tasks = tasks.filter(t=>t.id!==id); saveTasks(); render();
}
function openEdit(id) {
  const task = tasks.find(t=>t.id===id); if (!task) return;
  editingId = id; $("editText").value = task.text; $("editDate").value = task.date || ""; $("editPriority").value = task.priority;
  editDialog.showModal();
}
$("editForm").addEventListener("submit", e => {
  e.preventDefault();
  const task = tasks.find(t=>t.id===editingId); if (!task) return;
  task.text = $("editText").value.trim();
  task.date = $("editDate").value || null;
  task.priority = $("editPriority").value;
  saveTasks(); editDialog.close(); showLongTerm = task.date === null; if (task.date) selectedDate = task.date; render();
});
function closeEdit(){editDialog.close();editingId=null;}
$("closeDialog").addEventListener("click",closeEdit);
$("cancelEdit").addEventListener("click",closeEdit);
$("prevMonth").addEventListener("click",()=>{viewMonth.setMonth(viewMonth.getMonth()-1);renderCalendar();});
$("nextMonth").addEventListener("click",()=>{viewMonth.setMonth(viewMonth.getMonth()+1);renderCalendar();});
$("todayBtn").addEventListener("click",()=>{selectedDate=todayKey;showLongTerm=false;viewMonth=new Date(today.getFullYear(),today.getMonth(),1);render();});
$("longTermBtn").addEventListener("click",()=>{showLongTerm=true;filter="all";updateTabs();renderTasks();});
$("taskTabs").addEventListener("click",e=>{
  const btn=e.target.closest("[data-filter]"); if(!btn)return;
  filter=btn.dataset.filter; updateTabs(); renderTasks();
});
function updateTabs(){document.querySelectorAll(".tab").forEach(b=>b.classList.toggle("active",b.dataset.filter===filter));}
if ("serviceWorker" in navigator && location.protocol !== "file:") {
  window.addEventListener("load",()=>navigator.serviceWorker.register("./service-worker.js").catch(console.error));
}
render();