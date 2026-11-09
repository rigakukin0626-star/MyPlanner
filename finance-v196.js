/* My Planner Finance v196: local-first; optional Supabase when finance_documents exists. */
(function(){
'use strict';
const BASE='mpfinance-v196-',META='mpfinance-meta-v196-';
const translations={
zh:{title:'资产',overview:'总览',history:'流水',invest:'投资',budgets:'预算',manage:'设置',net:'净资产',assets:'总资产',debt:'总负债',addAccount:'添加账户',addTx:'记一笔',addHolding:'添加持仓',addTrade:'记录买卖',accounts:'账户',transactions:'交易记录',income:'收入',expense:'支出',transfer:'转账',adjust:'余额校准',bank:'银行',cash:'现金',broker:'证券',credit:'信用卡',other:'其他',name:'名称',type:'类型',amount:'金额（日元）',opening:'初始余额 / 欠款',actual:'实际余额',date:'日期',note:'备注',from:'付款账户',to:'收款账户',category:'分类',save:'保存',cancel:'取消',delete:'删除',ticker:'股票代码',qty:'股数',price:'每股价格',cost:'每股成本',fx:'兑日元汇率',fees:'手续费',buy:'买入',sell:'卖出',spending:'分类支出',trend:'净资产趋势',chart:'最近六个月收支',food:'餐饮',transport:'交通',shopping:'购物',housing:'住房',utilities:'水电通信',medical:'医疗',entertainment:'娱乐',salary:'工资',refund:'退款',noData:'暂无数据',noAccounts:'请先添加账户',noHoldings:'暂无持仓',limit:'月度预算',used:'已使用',remaining:'剩余',dueDay:'每月还款日（1–28）',due:'信用卡还款日临近，请核对账单',over:'预算已超额',local:'仅本机保存',synced:'云端已同步',missing:'Supabase 财务表尚未创建',failed:'同步失败，保存在本机',conflict:'云端与本机有冲突',sync:'同步',useCloud:'保留云端数据',useDevice:'上传本机数据',export:'导出 JSON 备份',import:'导入 JSON 备份',csv:'导出 CSV',guest:'导入访客数据',manual:'股票/ETF 价格和汇率需要手动更新，尚无自动行情。',warning:'不要在此输入银行密码。未启用云同步前请定期备份。',confirm:'确定删除？',replace:'确认覆盖另一份财务数据？',invalid:'请输入有效数值',different:'请选择不同账户',reconcile:'对账',noSell:'卖出数量超过持仓',edit:'编辑',perMonth:'本月'},
ja:{title:'資産',overview:'概要',history:'取引',invest:'投資',budgets:'予算',manage:'管理',net:'純資産',assets:'総資産',debt:'負債',addAccount:'口座追加',addTx:'取引記録',addHolding:'銘柄追加',addTrade:'売買記録',accounts:'口座',transactions:'取引履歴',income:'収入',expense:'支出',transfer:'振替',adjust:'残高調整',bank:'銀行',cash:'現金',broker:'証券',credit:'クレジットカード',other:'その他',name:'名前',type:'種類',amount:'金額（円）',opening:'開始残高 / 未払額',actual:'現在の残高',date:'日付',note:'メモ',from:'支払口座',to:'入金口座',category:'カテゴリー',save:'保存',cancel:'キャンセル',delete:'削除',ticker:'銘柄コード',qty:'数量',price:'現在株価',cost:'取得単価',fx:'円換算レート',fees:'手数料',buy:'買付',sell:'売却',spending:'支出内訳',trend:'純資産推移',chart:'過去6か月の収支',food:'食費',transport:'交通',shopping:'買い物',housing:'家賃',utilities:'水道光熱・通信',medical:'医療',entertainment:'娯楽',salary:'給与',refund:'返金',noData:'データなし',noAccounts:'口座を登録してください',noHoldings:'保有銘柄なし',limit:'月間予算',used:'使用済み',remaining:'残り',dueDay:'毎月引落日（1–28）',due:'カードの引落日が近づいています。明細をご確認ください',over:'予算超過',local:'端末のみ保存',synced:'クラウド同期済み',missing:'Supabase の資産テーブルが未設定',failed:'同期失敗。端末に保存',conflict:'クラウドと端末のデータが競合',sync:'同期',useCloud:'クラウド版を使用',useDevice:'端末版をアップロード',export:'JSON バックアップ',import:'JSON 読込',csv:'CSV 出力',guest:'端末データを読込',manual:'株価・為替レートは手入力です。自動相場は未接続。',warning:'銀行パスワードを入力しないでください。同期前はバックアップしてください。',confirm:'削除しますか？',replace:'別のデータを上書きしますか？',invalid:'正しい数値を入力',different:'異なる口座を選択',reconcile:'残高照合',noSell:'売却数量が保有数量を超過',edit:'編集',perMonth:'今月'},
en:{title:'Assets',overview:'Summary',history:'Records',invest:'Investing',budgets:'Budget',manage:'More',net:'Net worth',assets:'Assets',debt:'Liabilities',addAccount:'Add account',addTx:'New entry',addHolding:'Holding',addTrade:'New trade',accounts:'Accounts',transactions:'Transactions',income:'Income',expense:'Expense',transfer:'Transfer',adjust:'Reconcile',bank:'Bank',cash:'Cash',broker:'Brokerage',credit:'Credit card',other:'Other',name:'Name',type:'Type',amount:'Amount (JPY)',opening:'Opening balance / owed',actual:'Actual balance',date:'Date',note:'Note',from:'From account',to:'To account',category:'Category',save:'Save',cancel:'Cancel',delete:'Delete',ticker:'Ticker',qty:'Quantity',price:'Latest share price',cost:'Cost basis',fx:'JPY conversion rate',fees:'Fees',buy:'Buy',sell:'Sell',spending:'Spending by category',trend:'Net worth history',chart:'Six-month cash flow',food:'Food',transport:'Transport',shopping:'Shopping',housing:'Housing',utilities:'Utilities',medical:'Medical',entertainment:'Entertainment',salary:'Salary',refund:'Refund',noData:'No records yet',noAccounts:'Add an account first',noHoldings:'No holdings',limit:'Monthly limit',used:'Spent',remaining:'Remaining',dueDay:'Monthly due day (1–28)',due:'Card due date near. Verify your statement',over:'Budget exceeded',local:'Device only',synced:'Cloud synced',missing:'Supabase finance table not configured',failed:'Sync failed; saved on device',conflict:'Cloud and device data conflict',sync:'Sync',useCloud:'Use cloud data',useDevice:'Upload device data',export:'Export JSON backup',import:'Import JSON backup',csv:'Export CSV',guest:'Import guest records',manual:'Enter prices and FX rates manually.',warning:'Never enter banking passwords here. Export backups before cloud sync is available.',confirm:'Delete?',replace:'Overwrite another finance dataset?',invalid:'Enter a valid number',different:'Choose different accounts',reconcile:'Reconcile',noSell:'Cannot sell more shares than held',edit:'Edit',perMonth:'This month'}
};
const CURRENCIES=['JPY','CNY','USD','EUR','TWD','HKD','KRW','GBP','SGD','AUD'];
const currencySymbol=c=>({JPY:'¥',CNY:'¥',USD:'$',EUR:'€',TWD:'NT$',HKD:'HK$',KRW:'₩',GBP:'£',SGD:'S$',AUD:'A$'})[c]||c;
const currencyOptions=()=>CURRENCIES.map(c=>[c,currencySymbol(c)+'  '+c]);
const selectedRecordCurrency=()=>CURRENCIES.includes(doc.preferences?.record)?doc.preferences.record:'JPY';
const currencyWords={
 zh:{display:'显示币种',account:'账户币种',rate:'手动汇率',edit:'设置汇率',hint:'每 1 单位外币兑换多少日元。不是实时汇率。',missing:'请先设置该币种兑日元的汇率',info:'外币金额按手动汇率换算；实际银行汇率可能不同。'},
 ja:{display:'表示通貨',account:'口座通貨',rate:'手動為替レート',edit:'レートの設定',hint:'外貨1単位＝何円かを入力。リアルタイムレートではありません。',missing:'先に円換算レートを設定してください',info:'換算は手動レートに基づき、実際の銀行レートと異なる場合があります。'},
 en:{display:'Currency',account:'Account currency',rate:'Manual FX rates',edit:'Set exchange rate',hint:'JPY for one unit of currency. This is not a live exchange rate.',missing:'Set this currency’s JPY rate first',info:'Conversions use manual rates, not live bank rates.'}
};
const ct=k=>currencyWords[language]?.[k]||currencyWords.en[k]||k;
const blank=()=>({version:1,accounts:[],transactions:[],holdings:[],trades:[],budgets:[],snapshots:[],preferences:{display:'JPY',rates:{JPY:1}}});
function ensurePrefs(){
 if(!doc.preferences||typeof doc.preferences!=='object')doc.preferences={display:'JPY',rates:{JPY:1}};
 if(!doc.preferences.rates||typeof doc.preferences.rates!=='object')doc.preferences.rates={JPY:1};
 doc.preferences.rates.JPY=1;
 if(!CURRENCIES.includes(doc.preferences.display))doc.preferences.display='JPY';
 if(!CURRENCIES.includes(doc.preferences.record))doc.preferences.record='JPY';
}
function rate(code){
 if(!code||code==='JPY')return 1;
 const v=Number(doc.preferences?.rates?.[code]);
 return Number.isFinite(v)&&v>0&&v<1e7?v:null;
}
const toJPY=(n,code)=>{const amount=Number(n)||0;if(amount===0)return 0;const fx=rate(code);return fx===null?NaN:amount*fx};
const bookedJPY=x=>x.jpy!=null&&Number.isFinite(Number(x.jpy))?Number(x.jpy):(x.fx===null?NaN:(Number(x.amount)||0));
const recordCurrency=x=>account(x.from||x.to)?.currency||'JPY';
const recordMoney=x=>nativeMoney(x.amount,recordCurrency(x));
const recordTargetMoney=x=>x.kind==='transfer'&&x.toAmount!=null?nativeMoney(x.toAmount,account(x.to)?.currency||'JPY'):'';
const nativeMoney=(amount,code)=>{
 const c=CURRENCIES.includes(code)?code:'JPY';
 if(c==='CNY'){const n=Number(amount)||0;return (n<0?'−':'')+'¥'+new Intl.NumberFormat('zh-CN',{minimumFractionDigits:2,maximumFractionDigits:2}).format(Math.abs(n))}
 return new Intl.NumberFormat('ja-JP',{style:'currency',currency:c,maximumFractionDigits:c==='JPY'||c==='KRW'?0:2}).format(Number(amount)||0);
};
const displayCode=()=>doc.preferences?.display||'JPY';
const currencyValue=(amount,code,target=selectedRecordCurrency())=>{
 const n=Number(amount)||0;if(n===0)return 0;
 if(code===target)return n;
 const source=rate(code),dest=rate(target);
 return source===null||dest===null?NaN:n*source/dest;
};
const currencyMoney=value=>Number.isFinite(value)?nativeMoney(value,selectedRecordCurrency()):'—';
const nativeTotals=()=>{
 const b=balances();let assets=0,debt=0;
 for(const a of doc.accounts){const v=currencyValue(b.get(a.id),a.currency);if(credit(a))debt+=v;else assets+=v}
 for(const holding of doc.holdings){
  const value=qty(holding)*effectivePrice(holding),target=selectedRecordCurrency();
  if(!value)continue;
  if(holding.currency===target){assets+=value;continue}
  const sourceFX=holdingFX(holding),targetFX=rate(target);
  assets+=sourceFX===null||targetFX===null?NaN:value*sourceFX/targetFX;
 }
 return {assets,debt,net:assets-debt};
};
const nativeMonthData=(ym=nowDate().slice(0,7))=>doc.transactions.filter(x=>x.date.startsWith(ym)).reduce((sum,x)=>{
 if(x.kind==='income'||x.kind==='expense')sum[x.kind]+=currencyValue(x.amount,account(x.from||x.to)?.currency||'JPY');
 return sum;
},{income:0,expense:0});
const conversionNote=()=>language==='zh'?'其他币种缺少汇率，无法准确合计。':language==='ja'?'他通貨の為替レートがないため合計できません。':'Some currencies lack exchange rates; totals are unavailable.';
const spentFor=(category,currency,month=nowDate().slice(0,7))=>
 doc.transactions.filter(x=>x.kind==='expense'&&x.category===category&&x.date.startsWith(month))
 .reduce((sum,x)=>sum+currencyValue(x.amount,account(x.from)?.currency||'JPY',currency),0);
const budgetCurrency=b=>CURRENCIES.includes(b?.currency)?b.currency:'JPY';

const converted=jpy=>{
 const code=selectedRecordCurrency(),fx=rate(code);
 if(!Number.isFinite(jpy))return '—';
 if(jpy===0)return nativeMoney(0,code);
 return fx===null?'—':nativeMoney(jpy/fx,code);
};
let language='zh',owner='guest',doc=blank(),pane='overview',revision=null,dirty=false,cloud='local',remote=null,api=null,modal=null,busy=false,pushTimer=null;
const liveQuotes=new Map();let liveBusy=false,liveAttempt=0,liveError='';
const liveCode=x=>String(x?.symbol||'').trim().toUpperCase().replace(/\.T$/,'');
function liveQuote(x){
 const q=liveQuotes.get(liveCode(x)),age=q?Date.now()-Date.parse(q.asOf):Infinity;
 return q&&Number.isFinite(q.price)&&q.price>0&&age>=-3600000&&age<345600000?q:null;
}
const effectivePrice=x=>(liveQuote(x)?.price??Number(x.price))||0;
function holdingBasis(x){
 let shares=Number(x.openingQty)||0,book=shares*(Number(x.cost)||0);
 for(const trade of doc.trades.filter(t=>t.holding===x.id).slice().sort((a,b)=>String(a.date||'').localeCompare(String(b.date||'')))){
  const n=Number(trade.qty)||0,p=Number(trade.price)||0;
  if(trade.side==='buy'){shares+=n;book+=n*p}
  else if(trade.side==='sell'&&shares>0){book*=Math.max(0,shares-n)/shares;shares=Math.max(0,shares-n)}
 }
 return shares>0?book/shares:0;
}
const quoteClock=at=>{try{return new Intl.DateTimeFormat(language==='ja'?'ja-JP':language==='en'?'en-US':'zh-CN',{timeZone:'Asia/Tokyo',month:'numeric',day:'numeric',hour:'2-digit',minute:'2-digit'}).format(new Date(at))}catch{return ''}};
async function refreshQuotes(force=false){
 if(!api||owner==='guest'||liveBusy||document.hidden)return;
 const symbols=[...new Set(doc.holdings.filter(x=>x.currency==='JPY').map(liveCode).filter(x=>/^([0-9]{4}|[0-9]{3}[A-Z])$/.test(x)))];
 if(!symbols.length||(!force&&Date.now()-liveAttempt<300000))return;
 liveAttempt=Date.now();liveBusy=true;liveError='';
 try{
  const {data,error}=await api.functions.invoke('finance-quotes',{body:{symbols}});
  if(error||!Array.isArray(data?.quotes))throw error||Error('Invalid quote response');
  for(const q of data.quotes){
   const symbol=String(q.symbol||'').toUpperCase(),price=Number(q.price),asOf=String(q.asOf||'');
   if(symbols.includes(symbol)&&q.currency==='JPY'&&Number.isFinite(price)&&price>0&&Date.parse(asOf)>Date.now()-345600000&&Date.parse(asOf)<Date.now()+3600000)
    liveQuotes.set(symbol,{price,asOf});
  }
  if(!data.quotes.length)liveError=language==='zh'?'暂时无法取得行情报价':language==='ja'?'参考株価なし':'No quotes available';
 }catch(e){liveError=language==='zh'?'行情接口未就绪，使用手动价格':language==='ja'?'株価API未接続、手入力価格を使用':'Quote API unavailable; manual price retained'}
 finally{liveBusy=false;render()}
}
function marketStatus(){
 const count=doc.holdings.filter(x=>liveQuote(x)).length;
 const text=count?(language==='zh'?'已取得 '+count+' 个参考报价（可能延迟）':language==='ja'?'参考株価 '+count+' 件（遅延あり）':count+' reference quotes (may be delayed)'):liveError||t('manual');
 return '<p class="fin-note fin-market-status">'+h(liveBusy?(language==='zh'?'获取行情中…':language==='ja'?'取得中…':'Loading…'):text)+
  ' <button type="button" data-fin-action="refreshQuotes">'+(language==='zh'?'更新行情':language==='ja'?'株価更新':'Refresh quotes')+'</button></p>';
}

const t=k=>translations[language]?.[k]||translations.en[k]||k;
const h=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const yen=converted;
const id=()=>crypto.randomUUID?crypto.randomUUID():'f-'+Date.now()+Math.random().toString(36).slice(2);
const number=(v,allowZero=false)=>Number.isFinite(Number(v))&&Number(v)>=(allowZero?0:0.000001)&&Number(v)<1e12;
const nowDate=()=>{const d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')};
const account=id=>doc.accounts.find(x=>x.id===id),holding=id=>doc.holdings.find(x=>x.id===id),credit=a=>a?.type==='credit';
const catKeys=['food','transport','shopping','housing','utilities','medical','entertainment','other'];
function balances(){
 const sums=new Map(doc.accounts.map(a=>[a.id,Number(a.opening)||0]));
 const change=(a,v)=>{if(a&&sums.has(a.id))sums.set(a.id,sums.get(a.id)+v)};
 for(const x of doc.transactions){
  const a=account(x.from),b=account(x.to),n=Number(x.amount)||0;
  if(x.kind==='income')change(b,credit(b)?-n:n);
  if(x.kind==='expense')change(a,credit(a)?n:-n);
  if(x.kind==='transfer'){const toAmount=x.toAmount==null?n:Number(x.toAmount);change(a,credit(a)?n:-n);change(b,credit(b)?-toAmount:toAmount)}
  if(x.kind==='adjust')change(a,n);
 }
 for(const x of doc.trades){const a=account(x.account);if(!a)continue;const gross=x.qty*x.price*x.fx;const accountFX=Number(x.accountFx)||1;change(a,(x.side==='buy'?-gross-x.fees:gross-x.fees)/accountFX)}
 return sums;
}
const qty=x=>doc.trades.filter(y=>y.holding===x.id).reduce((n,y)=>n+(y.side==='buy'?y.qty:-y.qty),Number(x.openingQty)||0);
const holdingFX=x=>rate(x.currency)??(x.fx!=null&&Number.isFinite(Number(x.fx))&&Number(x.fx)>0?Number(x.fx):null);
const priceValue=x=>{const original=qty(x)*effectivePrice(x);if(!original)return 0;const fx=holdingFX(x);return fx===null?NaN:original*fx};
function totals(){const b=balances();let assets=0,debt=0;for(const a of doc.accounts){if(credit(a))debt+=toJPY(b.get(a.id),a.currency);else assets+=toJPY(b.get(a.id),a.currency)}for(const x of doc.holdings)assets+=priceValue(x);return {assets,debt,net:assets-debt}}
function read(){try{const d=JSON.parse(localStorage.getItem(BASE+owner)||'null');doc=d&&d.version===1&&['accounts','transactions','holdings','trades','budgets','snapshots'].every(k=>Array.isArray(d[k]))?d:blank();ensurePrefs();const m=JSON.parse(localStorage.getItem(META+owner)||'null');revision=m?.revision??null;dirty=Boolean(m?.dirty)}catch(e){doc=blank();revision=null;dirty=false}}
function metadata(){localStorage.setItem(META+owner,JSON.stringify({revision,dirty}))}
function save(){
 const x=totals(),date=nowDate(),prev=doc.snapshots.at(-1);
 if(Number.isFinite(x.net)){if(prev?.date===date)prev.value=x.net;else doc.snapshots.push({date,value:x.net});}
 doc.snapshots=doc.snapshots.slice(-366);dirty=true;
 localStorage.setItem(BASE+owner,JSON.stringify(doc));metadata();
 if(cloud==='synced')schedulePush();render();
}
const hasRecords=()=>doc.accounts.length||doc.transactions.length||doc.holdings.length||doc.trades.length||doc.budgets.length;
function monthData(ym=nowDate().slice(0,7)){return doc.transactions.filter(x=>x.date.startsWith(ym)).reduce((a,x)=>{if(x.kind==='income')a.income+=bookedJPY(x);if(x.kind==='expense')a.expense+=bookedJPY(x);return a},{income:0,expense:0})}
const section=(title,action,content)=>'<section class="fin-card"><div class="fin-section-title"><h2>'+title+'</h2>'+(action||'')+'</div>'+(content||'')+'</section>';
const button=(label,act)=>'<button type="button" class="fin-small" data-fin-action="'+act+'">'+label+'</button>';
const option=(name,choices,selected)=>'<select name="'+name+'" required>'+choices.map(([v,label])=>'<option value="'+h(v)+'" '+(v===selected?'selected':'')+'>'+h(label)+'</option>').join('')+'</select>';
const field=(label,name,type='text',value='',extra='')=>'<label class="fin-field"><span>'+label+'</span><input type="'+type+'" name="'+name+'" value="'+h(value)+'" '+extra+' required></label>';
const pick=(label,name,choices,selected)=>'<label class="fin-field"><span>'+label+'</span>'+option(name,choices,selected)+'</label>';
const accountOpts=()=>doc.accounts.map(a=>[a.id,a.name]);
function accounts(){
 const b=balances();
 return section(t('accounts'),button('＋ '+t('addAccount'),'account'),doc.accounts.map(a=>'<button class="fin-account" data-fin-account="'+h(a.id)+'"><span class="fin-emblem">'+(credit(a)?'▣':a.type==='broker'?'↗':currencySymbol(a.currency||'JPY'))+'</span><span class="fin-account-name"><b>'+h(a.name)+'</b><small>'+t(a.type)+' · '+h(a.currency||'JPY')+(a.dueDay?' · '+a.dueDay:'')+'</small></span><strong class="fin-account-amount"><span>'+nativeMoney(b.get(a.id),a.currency)+'</span>'+''+'</strong></button>').join('')||'<p class="fin-empty">'+t('noAccounts')+'</p>');
}
function entries(limit=80){
 return section(t('transactions'),button('＋ '+t('addTx'),'tx'),doc.transactions.slice().sort((a,b)=>b.date.localeCompare(a.date)||b.created-a.created).slice(0,limit).map(x=>{
  const name=x.kind==='transfer'?(account(x.from)?.name||'?')+' → '+(account(x.to)?.name||'?'):(account(x.from||x.to)?.name||'?');
  return '<div class="fin-entry"><span><b>'+h(x.note||t(x.category||x.kind))+'</b><small>'+h(x.date)+' · '+h(name)+'</small></span><span><strong class="'+(x.kind==='income'?'fin-positive':'')+'">'+(x.kind==='income'?'+':x.kind==='expense'?'−':'↔')+recordMoney(x)+(recordTargetMoney(x)?' → '+recordTargetMoney(x):'')+'</strong><button data-fin-delete="'+h(x.id)+'" aria-label="'+t('delete')+'">×</button></span></div>';
 }).join('')||'<p class="fin-empty">'+t('noData')+'</p>');
}
function cashFlow(){
 const m=nativeMonthData();return section(t('perMonth'),'', '<div class="fin-stats"><div><small>'+t('income')+'</small><b class="fin-positive">+'+currencyMoney(m.income)+'</b></div><div><small>'+t('expense')+'</small><b>−'+currencyMoney(m.expense)+'</b></div></div><div class="fin-actions">'+button('＋ '+t('addTx'),'tx')+button('＋ '+t('addAccount'),'account')+'</div>');
}
function bars(){
 const rows=[];for(let i=5;i>=0;i--){const d=new Date();d.setDate(1);d.setMonth(d.getMonth()-i);const k=d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0');rows.push({k,values:nativeMonthData(k)})}
 if(rows.some(x=>!Number.isFinite(x.values.income)||!Number.isFinite(x.values.expense)))return section(t('chart'),'','<p class="fin-note">—</p>');
 const max=Math.max(1,...rows.flatMap(x=>[x.values.income,x.values.expense]));
 return section(t('chart'),'', '<div class="fin-bars">'+rows.map(x=>'<div><div class="fin-bar"><i style="height:'+Math.max(2,x.values.income/max*100)+'%"></i><b style="height:'+Math.max(2,x.values.expense/max*100)+'%"></b></div><small>'+x.k.slice(-2)+'</small></div>').join('')+'</div><p class="fin-note">'+t('income')+' / '+t('expense')+'</p>');
}
function categoryBreakdown(){
 const totals={},target=selectedRecordCurrency();
 for(const x of doc.transactions){
  if(x.kind!=='expense'||!x.date.startsWith(nowDate().slice(0,7)))continue;
  const category=x.category||'other',v=currencyValue(x.amount,account(x.from)?.currency||'JPY',target);
  totals[category]=(totals[category]||0)+v;
 }
 const rows=Object.entries(totals).sort((a,b)=>b[1]-a[1]);
 if(rows.some(([,v])=>!Number.isFinite(v)))return section(t('spending'),'','<p class="fin-note">'+conversionNote()+'</p>');
 const max=Math.max(1,...rows.map(([,v])=>v));
 return section(t('spending'),'',
  rows.map(([k,v])=>'<div class="fin-category"><div><span>'+t(k)+'</span><strong>'+currencyMoney(v)+'</strong></div><i><b style="width:'+Math.min(100,Math.max(0,v/max*100))+'%"></b></i></div>').join('')
  ||'<p class="fin-empty">'+t('noData')+'</p>');
}
function netChart(){
 const x=doc.snapshots.slice(-45);if(x.length<2)return '';
 const min=Math.min(...x.map(p=>p.value)),max=Math.max(...x.map(p=>p.value)),span=Math.max(1,max-min);
 const path=x.map((p,i)=>(i?'L':'M')+(8+i*624/(x.length-1)).toFixed(2)+','+(112-(p.value-min)*95/span).toFixed(2)).join(' ');
 return section(t('trend'),'', '<svg viewBox="0 0 640 130" class="fin-trend" role="img"><path d="'+path+'" stroke="#397ce6" fill="none" stroke-width="4" stroke-linecap="round"/></svg>');
}
const quoteLink=x=>{
 const code=String(x.symbol||'').trim().toUpperCase().replace(/\.T$/,'');
 // An external Japanese market page is a quote reference, NOT an automatic
 // feed into user holdings and NOT a claim that the data is real-time.
 if(x.currency!=='JPY'||!/^([0-9]{4}|[0-9]{3}[A-Z])$/.test(code))return '';
 const label=language==='zh'?'查看行情':language==='ja'?'株価を見る':'View quote';
 return '<button type="button" class="fin-quote-link" data-fin-quote="'+h(x.id)+'" aria-label="'+label+' · '+code+'">'+label+' <span aria-hidden="true">▤</span></button>';
};
const quoteText=(zh,ja,en)=>language==='zh'?zh:language==='ja'?ja:en;
function openQuote(x){
 const code=String(x?.symbol||'').trim().toUpperCase().replace(/\.T$/,'');
 if(!x||x.currency!=='JPY'||!/^([0-9]{4}|[0-9]{3}[A-Z])$/.test(code))return;
 document.querySelector('.fin-quote-dialog[open]')?.close();
 const box=document.createElement('dialog');
 box.className='fin-quote-dialog';
 const title=quoteText('股票行情','株価チャート','Market quote');
 const delay=quoteText('行情可能延迟','相場は遅延する場合があります','Quotes may be delayed');
 const recorded=liveQuote(x)?quoteText('行情价','参考株価','Reference quote'):quoteText('手动记录价格','手入力の記録価格','Recorded manual price');
 const disclaimer=quoteText(
  '图表由 TradingView 提供，参考报价可能延迟或无法获取。自动估值不修改你的成本价和手动记录价格。',
  'TradingViewの参考株価は遅延・取得失敗する場合があります。取得単価や手入力価格は変更されません。',
  'TradingView quotes may be delayed or unavailable. Valuations use valid reference quotes without changing saved prices or costs.'
 );
 const refresh=quoteText('刷新行情','再読み込み','Refresh chart');
 const close=quoteText('关闭','閉じる','Close');
 const source=quoteText('TradingView 来源','TradingViewで確認','Open TradingView');
 const name=h(String(x.name||code));
 box.innerHTML='<div class="fin-quote-shell">'+
  '<header class="fin-quote-head"><div><small>'+title+' · TSE</small><h2>'+h(code)+' · '+name+'</h2></div><button type="button" data-quote-close aria-label="'+close+'">×</button></header>'+
  '<div class="fin-quote-info"><span>'+delay+'</span><span>'+recorded+'：<strong>'+nativeMoney(effectivePrice(x),x.currency)+'</strong></span></div>'+
  '<div class="fin-quote-frame" role="region" aria-label="'+title+'"></div>'+
  '<p class="fin-quote-explain">'+disclaimer+'</p>'+
  '<footer class="fin-quote-footer"><button type="button" data-quote-refresh>'+refresh+'</button>'+
  '<a href="https://www.tradingview.com/symbols/TSE-'+code+'/" target="_blank" rel="noopener noreferrer">'+source+' ↗</a></footer>'+
  '</div>';
 const mount=()=>{
  const wrap=box.querySelector('.fin-quote-frame');
  wrap.replaceChildren();
  const frame=document.createElement('iframe');
  frame.title=title+' TSE:'+code;
  frame.className='fin-quote-iframe';
  /* Trusted same-origin chart shell: avoid opaque sandbox origin breaking widget. */
  frame.setAttribute('loading','eager');
  frame.setAttribute('referrerpolicy','strict-origin-when-cross-origin');
  frame.src='./market-chart-v216.html?tvwidgetsymbol='+encodeURIComponent('TSE:'+code)+
    '&theme='+(document.documentElement.dataset.theme==='dark'?'dark':'light')+
    '&lang='+(language==='zh'?'zh':language==='ja'?'ja':'en')+
    '&r='+Date.now();
  wrap.append(frame);
 };
 document.body.append(box);
 box.querySelector('[data-quote-close]').onclick=()=>box.close();
 box.querySelector('[data-quote-refresh]').onclick=()=>{mount();void refreshQuotes(true)};
 box.addEventListener('click',e=>{if(e.target===box)box.close()});
 box.addEventListener('close',()=>box.remove(),{once:true});
 box.showModal();
 mount();
}

function portfolio(){
 const items=doc.holdings.map(x=>{
  const n=qty(x),p=effectivePrice(x),base=holdingBasis(x),pl=n*(p-base),pct=base?100*(p-base)/base:0;
  const gain=pl>0.005?'is-profit':pl<-.005?'is-loss':'is-flat',quote=liveQuote(x);
  const source=quote?(language==='zh'?'行情价':language==='ja'?'参考株価':'Quote')+' '+quoteClock(quote.asOf):(language==='zh'?'手动价':language==='ja'?'手入力':'Manual');
  const plText=base?(pl>0?'+':pl<0?'−':'')+nativeMoney(Math.abs(pl),x.currency)+' ('+(pct>0?'+':'')+pct.toFixed(2)+'%)':'—';
  return '<div class="fin-holding-row"><button class="fin-account" data-fin-holding="'+h(x.id)+'"><span class="fin-emblem">↗</span>'+
   '<span class="fin-account-name"><b>'+h(x.symbol)+' · '+h(x.name)+'</b><small>'+n+' × '+nativeMoney(p,x.currency)+' · '+h(source)+'</small>'+
   '<small>'+(language==='zh'?'成本':language==='ja'?'平均取得単価':'Cost')+' '+nativeMoney(base,x.currency)+'</small></span>'+
   '<span class="fin-holding-value"><strong>'+nativeMoney(n*p,x.currency)+'</strong><small class="fin-holding-pnl '+gain+'">'+plText+'</small></span></button>'+quoteLink(x)+'</div>';
 }).join('');
 return section(t('invest'),button('＋ '+t('addHolding'),'holding'),marketStatus()+items+
  '<div class="fin-actions">'+button(t('addTrade'),'trade')+'</div>')+accounts();
}
function budgetView(){
 const month=nowDate().slice(0,7);
 const body=doc.budgets.map(b=>{
  const currency=budgetCurrency(b),used=spentFor(b.category,currency,month);
  const valid=Number.isFinite(used),pct=valid?Math.min(100,Math.max(0,used/Number(b.limit)*100)):0;
  return '<button class="fin-budget" data-fin-budget="'+h(b.category)+'"><div><strong>'+t(b.category)+' · '+h(currency)+'</strong><small>'+(valid?nativeMoney(used,currency):'—')+' / '+nativeMoney(b.limit,currency)+'</small></div>'+
   '<div class="fin-track"><span class="'+(valid&&used>b.limit?'over':'')+'" style="width:'+pct+'%"></span></div></button>';
 }).join('');
 return section(t('budgets'),button('＋ '+t('budgets'),'budget'),
  body||'<p class="fin-empty">'+t('noData')+'</p>')+categoryBreakdown();
}
function alerts(){
 const today=new Date(),now=Date.UTC(today.getFullYear(),today.getMonth(),today.getDate());
 const due=doc.accounts.filter(a=>{
  if(!credit(a)||!a.dueDay||balances().get(a.id)<=0)return false;
  let year=today.getFullYear(),month=today.getMonth();
  if(a.dueDay<today.getDate()){month++;if(month===12){year++;month=0}}
  const days=(Date.UTC(year,month,a.dueDay)-now)/86400000;
  return days>=0&&days<=7;
 });
 const over=doc.budgets.filter(b=>{const used=spentFor(b.category,budgetCurrency(b));return Number.isFinite(used)&&used>b.limit});
 return (due.length?'<p class="fin-alert">'+t('due')+' · '+due.map(a=>h(a.name)).join(', ')+'</p>':'')+
 (over.length?'<p class="fin-alert">'+t('over')+'</p>':'');
}
function manualRates(){
 return section(ct('rate'),'','<p class="fin-note">'+ct('hint')+'</p><div class="fin-rate-list">'+CURRENCIES.filter(c=>c!=='JPY').map(c=>
  '<button type="button" class="fin-rate-row" data-fin-rate="'+c+'"><span>'+c+'</span><strong>'+(rate(c)===null?'—':'1 '+c+' = ¥'+rate(c).toLocaleString('ja-JP',{maximumFractionDigits:6}))+'</strong><span>›</span></button>').join('')+'</div><p class="fin-note">'+ct('info')+'</p>');
}
function editRate(currency,setDisplayAfter=false){
 if(currency==='JPY'){ensurePrefs();doc.preferences.display='JPY';save();return}
 dialog(ct('edit')+' · '+h(currency),'<p class="fin-note">'+ct('hint')+'</p>'+
  field('1 '+currency+' = JPY','newRate','number',rate(currency)||'','min="0.000001" step="any"'),v=>{
   const n=Number(v.newRate);
   if(!Number.isFinite(n)||n<=0||n>=1e7){alert(t('invalid'));return false}
   ensurePrefs();doc.preferences.rates[currency]=n;
   if(setDisplayAfter)doc.preferences.display=currency;
  });
}
function changeDisplay(currency){
 if(!CURRENCIES.includes(currency))return;
 ensurePrefs();
 if(currency!=='JPY'&&rate(currency)===null){editRate(currency,true);render();return}
 doc.preferences.display=currency;save();
}
function settings(){
 const status=cloud==='synced'?t('synced'):cloud==='missing'?t('missing'):cloud==='failed'?t('failed'):cloud==='conflict'?t('conflict'):t('local');
 return section(t('manage'),'','<p class="fin-note">'+t('warning')+'</p><p class="fin-sync">'+status+'</p><div class="fin-actions">'+button(t('sync'),'sync')+button(t('export'),'export')+'</div><div class="fin-actions">'+button(t('import'),'import')+button(t('csv'),'csv')+'</div>'+
 (cloud==='conflict'?'<div class="fin-actions">'+button(t('useCloud'),'useCloud')+button(t('useDevice'),'upload')+'</div>':'')+
 (cloud==='ready'?button(t('useDevice'),'upload'):'')+
 (owner!=='guest'&&localStorage.getItem(BASE+'guest')?button(t('guest'),'guest'):''));
}
function render(){
 const root=document.getElementById('financeRoot');if(!root)return;
 const x=nativeTotals(),summary='<div class="fin-hero"><small>'+t('net')+'</small><strong>'+currencyMoney(x.net)+'</strong><div><span>'+t('assets')+'<b>'+currencyMoney(x.assets)+'</b></span><span>'+t('debt')+'<b>'+currencyMoney(x.debt)+'</b></span></div></div>';
 root.innerHTML='<header class="fin-head"><div><p>MY PLANNER / FINANCE</p><h1>'+t('title')+'</h1></div><label class="fin-record-currency">'+option('recordCurrency',currencyOptions(),selectedRecordCurrency())+'</label></header><div class="fin-tabs">'+['overview','history','invest','budgets','manage'].map(k=>'<button data-fin-pane="'+k+'" class="'+(k===pane?'active':'')+'">'+t(k)+'</button>').join('')+'</div>'+
 (pane==='overview'?summary+alerts()+cashFlow()+accounts()+bars()+netChart()+categoryBreakdown()+entries(7):pane==='history'?entries():pane==='invest'?summary+portfolio():pane==='budgets'?budgetView():settings()+accounts());
 const label=document.getElementById('tabFinanceLabel');if(label)label.textContent=t('title');
  if(document.body.dataset.activePage==='finance'&&(pane==='overview'||pane==='invest'))void refreshQuotes();
}
function dialog(title,body,onSave,after){
 const box=document.createElement('dialog');box.className='fin-dialog';
 box.innerHTML='<form><header><h2>'+title+'</h2><button type="button" data-close aria-label="Close"><svg aria-hidden="true" viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg></button></header><div class="fin-dialog-fields">'+body+'</div><footer><button type="button" data-close>'+t('cancel')+'</button><button type="submit">'+t('save')+'</button></footer></form>';
 document.body.append(box);modal=box;
 box.querySelectorAll('[data-close]').forEach(b=>b.onclick=()=>box.close());
 box.querySelector('form').onsubmit=e=>{e.preventDefault();const v=Object.fromEntries(new FormData(e.currentTarget));try{if(onSave(v)!==false){box.close();save()}}catch(err){alert(err.message||t('invalid'))}};
 box.addEventListener('close',()=>{box.remove();if(modal===box)modal=null},{once:true});box.showModal();after?.(box);
}
function addAccount(existing){
 const options=['bank','cash','broker','credit','other'].map(k=>[k,t(k)]);
 const current=existing?.currency||selectedRecordCurrency();
 dialog(existing?t('edit'):t('addAccount'),
  field(t('name'),'name','text',existing?.name||'','maxlength="70"')+
  pick(t('type'),'type',options,existing?.type||'bank')+
  '<input type="hidden" name="currency" value="'+h(current)+'">'+
  (existing?'':field(t('opening'),'opening','number',0,'step="any" min="0"'))+
  '<label class="fin-field fin-credit-due"'+((existing?.type||'bank')==='credit'?'':' hidden')+'><span>'+t('dueDay')+'</span><input name="dueDay" type="number" min="1" max="28" value="'+(existing?.dueDay||'')+'"></label>',
 v=>{
  if(!v.name.trim()||(!existing&&!number(v.opening,true)))return false;
  const due=(existing?.type||v.type)==='credit'&&v.dueDay?Number(v.dueDay):null;
  if(due!==null&&(!Number.isInteger(due)||due<1||due>28))return false;
  if(existing){existing.name=v.name.trim().slice(0,70);existing.dueDay=due;return true}
  if(!CURRENCIES.includes(v.currency))return false;
  doc.preferences.record=v.currency;
  doc.accounts.push({id:id(),name:v.name.trim().slice(0,70),type:v.type,currency:v.currency,opening:Number(v.opening),dueDay:due});
 },box=>{
  const typeField=box.querySelector('[name="type"]'),dueField=box.querySelector('.fin-credit-due');
  const syncDue=()=>{dueField.hidden=typeField.value!=='credit';if(dueField.hidden)dueField.querySelector('input').value=''};
  typeField.addEventListener('change',syncDue);syncDue();
  if(existing){
   box.querySelector('[name="type"]').disabled=true;
   box.querySelector('[name="currency"]').disabled=true;
   box.querySelector('form').insertAdjacentHTML('beforeend','<button type="button" class="fin-danger">'+t('delete')+'</button>');
   box.querySelector('.fin-danger').onclick=()=>{
    const tx=doc.transactions.filter(x=>x.from===existing.id||x.to===existing.id).length;
    const trades=doc.trades.filter(x=>x.account===existing.id).length;
    const warning=language==='zh'?'确定删除「'+existing.name+'」吗？'+(tx||trades?'\n将同时删除关联的 '+tx+' 条流水和 '+trades+' 条交易记录。':'')+'\n删除后无法恢复。':language==='ja'?'「'+existing.name+'」を削除しますか？関連する履歴 '+tx+' 件、売買 '+trades+' 件も削除されます。':'Delete "'+existing.name+'"? '+tx+' linked records and '+trades+' trades will also be removed.';
    if(confirm(warning)){
     doc.transactions=doc.transactions.filter(x=>x.from!==existing.id&&x.to!==existing.id);
     doc.trades=doc.trades.filter(x=>x.account!==existing.id);
     doc.accounts=doc.accounts.filter(a=>a.id!==existing.id);
     box.close();save();
    }
   };
  }
 });
}
function reconcile(a){
 dialog(t('adjust'),field(t('actual'),'actual','number',balances().get(a.id),'step="any"'),v=>{
  if(!Number.isFinite(Number(v.actual))||Math.abs(Number(v.actual))>=1e12)return false;
  const delta=Number(v.actual)-balances().get(a.id);
  if(delta)doc.transactions.push({id:id(),kind:'adjust',from:a.id,to:null,amount:delta,date:nowDate(),created:Date.now(),category:'other',note:t('adjust')});
 });
}
function addTx(){
 if(!doc.accounts.length)return alert(t('noAccounts'));
 const opts=accountOpts(),initial=(opts.find(([key])=>account(key)?.currency===selectedRecordCurrency())||opts[0])[0];
 dialog(t('addTx'),
  pick(t('type'),'kind',[['expense',t('expense')],['income',t('income')],['transfer',t('transfer')]],'expense')+
  field(t('amount'),'amount','number','','min="0.000001" step="any"')+
  pick(t('from'),'from',opts.map(([id,name])=>[id,name+' ('+(account(id)?.currency||'JPY')+')']),initial)+
  '<div class="fin-destination">'+pick(t('to'),'to',opts.map(([id,name])=>[id,name+' ('+(account(id)?.currency||'JPY')+')']),opts[1]?.[0]||initial)+'<p class="fin-note fin-exchange-preview"></p></div>'+
  pick(t('category'),'category',catKeys.map(k=>[k,t(k)]),'food')+
  field(t('date'),'date','date',nowDate())+
  '<label class="fin-field"><span>'+t('note')+'</span><input name="note" maxlength="140"></label>',
 v=>{
  const from=account(v.from),target=account(v.to),n=Number(v.amount);
  if(!number(n)||!from||!v.date||!['income','expense','transfer'].includes(v.kind))return false;
  const fromRate=rate(from.currency);
  // Foreign currency transactions are valid without FX conversion.
  if(v.kind==='transfer'&&(!target||target.id===from.id)){alert(t('different'));return false}
  const toRate=v.kind==='transfer'?rate(target.currency):null;
  if(v.kind==='transfer'&&from.currency!==target.currency&&(fromRate===null||toRate===null)){alert(ct('missing'));return false}
  const toAmount=v.kind==='transfer'?(from.currency===target.currency?n:Number((n*fromRate/toRate).toFixed(6))):null;
  doc.transactions.push({
   id:id(),kind:v.kind,from:v.kind==='income'?null:from.id,
   to:v.kind==='income'?from.id:v.kind==='transfer'?target.id:null,
   amount:n,toAmount,fx:fromRate,jpy:fromRate===null?null:Number((n*fromRate).toFixed(6)),
   date:v.date,created:Date.now(),category:v.category,note:(v.note||'').trim().slice(0,140)
  });
 },box=>{
  const kind=box.querySelector('[name="kind"]'),cat=box.querySelector('[name="category"]'),
   target=box.querySelector('.fin-destination'),from=box.querySelector('[name="from"]'),
   to=box.querySelector('[name="to"]'),amount=box.querySelector('[name="amount"]'),
   preview=box.querySelector('.fin-exchange-preview'),amountLabel=amount.closest('label').querySelector('span');
  const update=()=>{
   target.hidden=kind.value!=='transfer';cat.closest('label').hidden=kind.value==='transfer';
   cat.innerHTML=(kind.value==='income'?['salary','refund','other']:catKeys).map(k=>'<option value="'+k+'">'+t(k)+'</option>').join('');
   updateFX();
  };
  const updateFX=()=>{
   const source=account(from.value),dest=account(to.value);
   amountLabel.textContent=(language==='zh'?'金额':language==='ja'?'金額':'Amount')+' · '+(source?.currency||selectedRecordCurrency());
   if(kind.value==='transfer'&&source&&dest){
    const fromRate=rate(source.currency),toRate=rate(dest.currency),value=Number(amount.value||0);
    preview.textContent=source.currency===dest.currency?nativeMoney(value,dest.currency):fromRate&&toRate?nativeMoney(value*fromRate/toRate,dest.currency):ct('missing');
   }
  };
  kind.addEventListener('change',update);
  from.addEventListener('change',updateFX);to.addEventListener('change',updateFX);
  amount.addEventListener('input',updateFX);update();
 });
}
function addHolding(x){
 const current=x?.currency||'JPY';
 dialog(x?t('price'):t('addHolding'),
  field(t('ticker'),'symbol','text',x?.symbol||'','maxlength="20"')+
  field(t('name'),'name','text',x?.name||'','maxlength="70"')+
  pick(t('type'),'currency',currencyOptions(),current)+
  (x?'':field(t('qty'),'openingQty','number',0,'min="0" step="0.0001"')+
    field(t('cost'),'cost','number',0,'min="0" step="0.0001"'))+
  field(t('price'),'price','number',x?.price||0,'min="0" step="0.0001"'),
 v=>{
  if(!v.symbol.trim()||!CURRENCIES.includes(v.currency)||!number(v.price,true)||
     (!x&&(!number(v.openingQty,true)||!number(v.cost,true))))return false;
  // The share price is recorded in its selected currency. A JPY rate is not
  // required to save; retain a historical FX rate for unchanged currencies.
  const oldFx=x&&x.currency===v.currency&&x.fx!=null&&Number(x.fx)>0?Number(x.fx):null;
  const fx=rate(v.currency)??oldFx;
  const data={name:v.name.trim().slice(0,70),symbol:v.symbol.trim().slice(0,20),currency:v.currency,price:Number(v.price),fx};
  if(x)Object.assign(x,data);
  else doc.holdings.push({id:id(),...data,openingQty:Number(v.openingQty),cost:Number(v.cost)});
 });
}
function addTrade(){
 if(!doc.holdings.length)return alert(t('noHoldings'));
 const accountList=doc.accounts.filter(a=>!credit(a));
 const unlinkedLabel=language==='zh'?'仅记录股数（不影响资金余额）':language==='ja'?'数量のみ記録（口座残高は変更しない）':'Quantity only (no cash movement)';
 const hint=language==='zh'?'不关联资金账户时，仅更新持仓股数，不记录买卖资金流；账户现金和净资产可能需要另行对账。':language==='ja'?'口座未連携の場合は保有数量のみ更新され、売買代金は口座に反映されません。':'Without a linked cash account, only shares change; proceeds and payments are not tracked.';
 const options=[['__unlinked__',unlinkedLabel],...accountList.map(a=>[a.id,a.name+' ('+a.currency+')'])];
 dialog(t('addTrade'),
  pick(t('ticker'),'holding',doc.holdings.map(x=>[x.id,x.symbol+' '+x.name]))+
  pick(t('type'),'side',[['buy',t('buy')],['sell',t('sell')]])+
  field(t('qty'),'qty','number','','min="0.0001" step="0.0001"')+
  field(t('price'),'price','number','','min="0" step="0.0001"')+
  field(t('fees'),'fees','number',0,'min="0" step="any"')+
  pick(t('accounts'),'account',options,'__unlinked__')+
  '<p class="fin-note">'+hint+'</p>'+
  field(t('date'),'date','date',nowDate()),v=>{
   const x=holding(v.holding),unlinked=v.account==='__unlinked__',a=unlinked?null:account(v.account);
   if(!x||(!unlinked&&(!a||credit(a)))||!number(v.qty)||!number(v.price,true)||!number(v.fees,true))return false;
   if(v.side==='sell'&&Number(v.qty)>qty(x)+1e-8)return alert(t('noSell')),false;
   const sameCurrency=a&&x.currency===a.currency;
   const stockFX=holdingFX(x),accountFX=a?rate(a.currency):null;
   if(a&&!sameCurrency&&(stockFX===null||accountFX===null)){alert(ct('missing'));return false}
   doc.trades.push({id:id(),holding:x.id,side:v.side,qty:Number(v.qty),price:Number(v.price),
    fees:Number(v.fees),fx:unlinked?stockFX:sameCurrency?1:stockFX,
    accountFx:unlinked?null:sameCurrency?1:accountFX,account:a?.id||null,date:v.date});
  });
}
function addBudget(category){
 const old=doc.budgets.find(b=>b.category===category);
 const currency=old?budgetCurrency(old):selectedRecordCurrency();
 dialog(t('budgets')+' · '+h(currency),
  pick(t('category'),'category',catKeys.map(k=>[k,t(k)]),category||'food')+
  field(t('limit'),'limit','number',old?.limit||10000,'min="0.01" step="any"'),v=>{
   if(!number(v.limit))return false;
   const previous=doc.budgets.find(b=>b.category===v.category),code=previous?budgetCurrency(previous):currency;
   doc.budgets=doc.budgets.filter(b=>b.category!==v.category);
   doc.budgets.push({category:v.category,limit:Number(v.limit),currency:code});
  });
}
function download(name,content,type){
 const url=URL.createObjectURL(new Blob([content],{type})),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),5000);
}
function exportJSON(){download('myplanner-finance-'+nowDate()+'.json',JSON.stringify({format:'mpfinance-v196',doc},null,2),'application/json')}
function exportCSV(){
 const q=v=>'"'+String(v??'').replace(/"/g,'""')+'"';
 const rows=[['Date','Type','Original Amount','Currency','JPY Book Value','From','To','Category','Note'],...doc.transactions.map(x=>[x.date,x.kind,x.amount,account(x.from||x.to)?.currency||'JPY',Number.isFinite(bookedJPY(x))?bookedJPY(x):'',account(x.from)?.name,account(x.to)?.name,x.category,x.note])];
 download('myplanner-finance-'+nowDate()+'.csv','\ufeff'+rows.map(r=>r.map(q).join(',')).join('\r\n'),'text/csv;charset=utf-8');
}
function importJSON(){
 const file=document.createElement('input');file.type='file';file.accept='.json,application/json';
 file.onchange=async()=>{try{
  const f=file.files?.[0];if(!f||f.size>2000000)throw Error('Invalid backup');
  const x=JSON.parse(await f.text()),d=x.doc;
  if(x.format!=='mpfinance-v196'||!d||d.version!==1||
   !['accounts','transactions','holdings','trades','budgets','snapshots'].every(k=>Array.isArray(d[k])&&d[k].length<30000))throw Error('Invalid backup');
  const finite=(v,nonnegative=false)=>Number.isFinite(Number(v))&&Math.abs(Number(v))<1e12&&(!nonnegative||Number(v)>=0);
  const currencyOf=a=>a.currency||'JPY';
  const importedRates=d.preferences?.rates||{};
  const rateFor=c=>c==='JPY'?1:Number(importedRates[c]);
  if(d.preferences?.display&&!CURRENCIES.includes(d.preferences.display))throw Error('Invalid display currency');
   if(d.preferences?.record&&!CURRENCIES.includes(d.preferences.record))throw Error('Invalid recorded currency');
  if(d.accounts.some(a=>!a||typeof a.id!=='string'||typeof a.name!=='string'||
    !['bank','cash','broker','credit','other'].includes(a.type)||
    !CURRENCIES.includes(currencyOf(a))||!finite(a.opening,true)||
    (importedRates[currencyOf(a)]!=null&&!(rateFor(currencyOf(a))>0&&rateFor(currencyOf(a))<1e7))))throw Error('Invalid account or FX rate');
  if(d.transactions.some(z=>!z||typeof z.id!=='string'||typeof z.date!=='string'||
    !['income','expense','transfer','adjust'].includes(z.kind)||!finite(z.amount,z.kind!=='adjust')||
    (z.jpy!=null&&!finite(z.jpy,true))||
    (z.toAmount!=null&&!finite(z.toAmount,true))))throw Error('Invalid transaction');
  if(d.holdings.some(z=>!z||typeof z.id!=='string'||!CURRENCIES.includes(z.currency||'JPY')||
    !finite(z.openingQty,true)||!finite(z.price,true)||(z.fx!=null&&(!finite(z.fx,true)||Number(z.fx)<=0))))throw Error('Invalid holding');
  if(d.trades.some(z=>!z||!['buy','sell'].includes(z.side)||!finite(z.qty,true)||
    !finite(z.price,true)||!finite(z.fx,true)||!finite(z.fees,true)||
    (z.accountFx!=null&&!finite(z.accountFx,true))))throw Error('Invalid trade');
  if(d.budgets.some(z=>!z||typeof z.category!=='string'||!finite(z.limit,true)||Number(z.limit)<=0||(z.currency!=null&&!CURRENCIES.includes(z.currency))))throw Error('Invalid budget');
  if(d.snapshots.some(z=>!z||typeof z.date!=='string'||!finite(z.value)))throw Error('Invalid snapshot');
  if(!confirm(t('replace')))return;
  doc=d;ensurePrefs();save();
 }catch(e){alert(e.message||t('invalid'))}};
 file.click();
}
function schedulePush(){clearTimeout(pushTimer);pushTimer=setTimeout(()=>void push(),850)}
async function push(){
 if(busy||cloud!=='synced'||!api||owner==='guest')return;
 busy=true;const snapshot=JSON.stringify(doc),starting=revision;
 try{
  const {data,error}=await api.from('finance_documents').update({payload:JSON.parse(snapshot),revision:starting+1,updated_at:new Date().toISOString()}).eq('user_id',owner).eq('revision',starting).select('revision').maybeSingle();
  if(error)throw error;
  if(!data){cloud='conflict';return}
  revision=data.revision;dirty=JSON.stringify(doc)!==snapshot;localStorage.setItem(META+owner,JSON.stringify({revision,dirty}));cloud='synced';
 }catch(e){cloud='failed'}finally{busy=false;render();if(cloud==='synced'&&dirty)schedulePush()}
}
async function fetchCloud(){
 if(!api||owner==='guest')return;
 try{
  const {data,error}=await api.from('finance_documents').select('payload,revision').eq('user_id',owner).maybeSingle();
  if(error){cloud=['42P01','PGRST205'].includes(error.code)?'missing':'failed';render();return}
  remote=data;
  if(!data){cloud='ready';render();return}
  if(!hasRecords()&&!dirty){doc=data.payload;ensurePrefs();revision=data.revision;dirty=false;localStorage.setItem(BASE+owner,JSON.stringify(doc));localStorage.setItem(META+owner,JSON.stringify({revision,dirty}));cloud='synced';render();return}
  if(JSON.stringify(doc)===JSON.stringify(data.payload)){revision=data.revision;dirty=false;localStorage.setItem(META+owner,JSON.stringify({revision,dirty}));cloud='synced';render();return}
  if(revision===data.revision&&dirty){cloud='synced';schedulePush();render();return}
  if(revision!==null&&data.revision>revision&&!dirty){doc=data.payload;ensurePrefs();revision=data.revision;localStorage.setItem(BASE+owner,JSON.stringify(doc));localStorage.setItem(META+owner,JSON.stringify({revision,dirty}));cloud='synced';render();return}
  cloud='conflict';render();
 }catch(e){cloud='failed';render()}
}
async function login(){
 api=typeof supabaseClient!=='undefined'?supabaseClient:null;if(!api)return;
 try{
  const {data}=await api.auth.getSession();const next=data.session?.user?.id||'guest';
  if(next!==owner){owner=next;read();cloud='local';remote=null;render()}
  if(owner!=='guest')await fetchCloud();
 }catch(e){cloud='failed';render()}
}
async function upload(){
 if(!api||owner==='guest'||!confirm(t('replace')))return;
 const r=remote?.revision??null,request=r?api.from('finance_documents').update({payload:doc,revision:r+1,updated_at:new Date().toISOString()}).eq('user_id',owner).eq('revision',r).select('revision').maybeSingle():
 api.from('finance_documents').insert({user_id:owner,payload:doc,revision:1}).select('revision').maybeSingle();
 const {data,error}=await request;
 if(error||!data){cloud='conflict';render();return}
 revision=data.revision;dirty=false;localStorage.setItem(META+owner,JSON.stringify({revision,dirty}));cloud='synced';render();
}
function useCloud(){
 if(!remote?.payload||!confirm(t('replace')))return;
 const old=localStorage.getItem(BASE+owner);if(old)localStorage.setItem(BASE+owner+'.backup.'+Date.now(),old);
 doc=remote.payload;ensurePrefs();revision=remote.revision;dirty=false;localStorage.setItem(BASE+owner,JSON.stringify(doc));localStorage.setItem(META+owner,JSON.stringify({revision,dirty}));cloud='synced';render();
}
function action(what,value){
 if(what==='account')addAccount();
 else if(what==='tx')addTx();
 else if(what==='holding')addHolding();
 else if(what==='trade')addTrade();
 else if(what==='budget')addBudget();
 else if(what==='refreshQuotes')void refreshQuotes(true);
  else if(what==='sync')void login();
 else if(what==='export')exportJSON();
 else if(what==='import')importJSON();
 else if(what==='csv')exportCSV();
 else if(what==='upload')void upload();
 else if(what==='useCloud')useCloud();
 else if(what==='guest'){const d=localStorage.getItem(BASE+'guest');if(d&&confirm(t('replace'))){doc=JSON.parse(d);ensurePrefs();save()}}
 else if(what==='delete'&&confirm(t('confirm'))){doc.transactions=doc.transactions.filter(x=>x.id!==value);save()}
 else if(what==='accountDetail'){const a=account(value);if(a)dialog(t('accounts'),'<p class="fin-balance">'+nativeMoney(balances().get(a.id),a.currency)+''+'</p><div class="fin-actions">'+button(t('edit'),'editAccount')+button(t('reconcile'),'reconcile')+'</div>',()=>true,b=>{b.querySelector('[data-fin-action="editAccount"]').onclick=()=>{b.close();addAccount(a)};b.querySelector('[data-fin-action="reconcile"]').onclick=()=>{b.close();reconcile(a)}})}
 else if(what==='holdingDetail'){const x=holding(value);if(x)addHolding(x)}
 else if(what==='budgetDetail')addBudget(value);
}
function bind(){
 document.getElementById('financeRoot')?.addEventListener('change',e=>{if(e.target?.name==='recordCurrency'){ensurePrefs();doc.preferences.record=e.target.value;save()}});
 document.getElementById('financeRoot')?.addEventListener('click',e=>{
  const p=e.target.closest('[data-fin-pane]');if(p){pane=p.dataset.finPane;render();return}
  const q=e.target.closest('[data-fin-quote]');if(q){const item=holding(q.dataset.finQuote);if(item)openQuote(item);return}
  const a=e.target.closest('[data-fin-action]');if(a){action(a.dataset.finAction);return}
  const ac=e.target.closest('[data-fin-account]');if(ac){action('accountDetail',ac.dataset.finAccount);return}
  const hd=e.target.closest('[data-fin-holding]');if(hd){action('holdingDetail',hd.dataset.finHolding);return}
  const bd=e.target.closest('[data-fin-budget]');if(bd){action('budgetDetail',bd.dataset.finBudget);return}
  const rateButton=e.target.closest('[data-fin-rate]');if(rateButton){editRate(rateButton.dataset.finRate);return}
  const del=e.target.closest('[data-fin-delete]');if(del)action('delete',del.dataset.finDelete);
 });
}
window.MyPlannerFinance={render,setLanguage(l){language=translations[l]?l:'zh';render()}};
document.addEventListener('DOMContentLoaded',()=>{
 const v=document.getElementById('languageSelect')?.value||'auto';
 language=v!=='auto'?v:(navigator.language||'en').startsWith('ja')?'ja':(navigator.language||'en').startsWith('zh')?'zh':'en';
 bind();read();render();void login();
 if(typeof supabaseClient!=='undefined')supabaseClient.auth.onAuthStateChange(()=>setTimeout(()=>void login(),0));
 document.addEventListener('visibilitychange',()=>{if(!document.hidden&&owner!=='guest'&&!dirty)void fetchCloud()});
},{once:true});
})();