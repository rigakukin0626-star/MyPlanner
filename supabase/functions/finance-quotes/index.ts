// MY SUITE v250 — authenticated quote/history gateway for Japan-listed securities.
// Uses an UNOFFICIAL Yahoo Finance endpoint: may be delayed/blocked/changed,
// and may not be licensed for commercial redistribution. No trading decisions.
const ORIGIN="https://rigakukin0626-star.github.io";
const headers={
  "Access-Control-Allow-Origin":ORIGIN,
  "Access-Control-Allow-Headers":"authorization,x-client-info,apikey,content-type",
  "Access-Control-Allow-Methods":"POST,OPTIONS",
  "Cache-Control":"no-store",
  "Content-Type":"application/json; charset=utf-8",
};
type Quote={symbol:string;price:number;currency:"JPY";asOf:string;source:string};
type Bar={t:number;o:number;h:number;l:number;c:number;v:number|null};
type History={symbol:string;period:string;currency:"JPY";bars:Bar[];asOf:string;source:string};
const valid=(s:string)=>/^([0-9]{4}|[0-9]{3}[A-Z])$/.test(s);
const periods:Record<string,{range:string;interval:string}>={
 "1d":{range:"1d",interval:"5m"},
 "5d":{range:"5d",interval:"30m"},
 "1mo":{range:"1mo",interval:"1d"},
 "3mo":{range:"3mo",interval:"1d"},
 "1y":{range:"1y",interval:"1wk"},
};
const quoteCache=new Map<string,{until:number,value:Quote}>();
const chartCache=new Map<string,{until:number,value:History}>();
async function getChart(symbol:string,range:string,interval:string){
 const url="https://query1.finance.yahoo.com/v8/finance/chart/"+encodeURIComponent(symbol+".T")+
   "?range="+encodeURIComponent(range)+"&interval="+encodeURIComponent(interval);
 const response=await fetch(url,{
  headers:{"Accept":"application/json","User-Agent":"MyPlannerPersonalFinance/1.0"},
  signal:AbortSignal.timeout(8500),
 });
 if(!response.ok)throw Error("Upstream quote unavailable");
 const result=(await response.json())?.chart?.result?.[0];
 if(!result||result.meta?.currency!=="JPY")throw Error("Market data unavailable");
 return result;
}
async function getQuote(symbol:string):Promise<Quote|null>{
 const cached=quoteCache.get(symbol);
 if(cached&&cached.until>Date.now())return cached.value;
 try{
  const raw=await getChart(symbol,"5d","1d"),meta=raw.meta||{};
  const price=Number(meta.regularMarketPrice),time=Number(meta.regularMarketTime);
  if(!Number.isFinite(price)||price<=0||price>=1e7||
     !Number.isFinite(time)||time<1577836800||time*1000>Date.now()+3600000)return null;
  const value:Quote={symbol,price,currency:"JPY",asOf:new Date(time*1000).toISOString(),source:"Yahoo Finance (unofficial)"};
  quoteCache.set(symbol,{until:Date.now()+120000,value});
  return value;
 }catch{return null}
}
async function getHistory(symbol:string,period:string):Promise<History|null>{
 const p=periods[period];if(!p)return null;
 const key=symbol+":"+period,cached=chartCache.get(key);
 if(cached&&cached.until>Date.now())return cached.value;
 try{
  const raw=await getChart(symbol,p.range,p.interval);
  const times=raw.timestamp||[],quotes=raw.indicators?.quote?.[0]||{};
  const bars:Bar[]=[];
  for(let i=0;i<times.length;i++){
   const t=Number(times[i]),o=Number(quotes.open?.[i]),h=Number(quotes.high?.[i]),
         l=Number(quotes.low?.[i]),c=Number(quotes.close?.[i]),v=Number(quotes.volume?.[i]);
   if(!Number.isFinite(t)||t<1577836800||t*1000>Date.now()+3600000||
      !Number.isFinite(c)||c<=0||!Number.isFinite(o)||o<=0||!Number.isFinite(h)||h<=0||!Number.isFinite(l)||l<=0)continue;
   bars.push({t,o,h:Math.max(o,h,c),l:Math.min(o,l,c),c,v:Number.isFinite(v)&&v>=0?v:null});
  }
  if(!bars.length)return null;
  const value:History={symbol,period,currency:"JPY",bars:bars.slice(-180),
   asOf:new Date(bars[bars.length-1].t*1000).toISOString(),source:"Yahoo Finance (unofficial)"};
  chartCache.set(key,{until:Date.now()+(period==="1d"?90000:300000),value});
  return value;
 }catch{return null}
}
// Defense in depth: do not trust CORS or a publishable key as proof of login.
// Check the caller's user JWT with Supabase Auth even if gateway verify_jwt was disabled.
async function validUserToken(req:Request):Promise<boolean>{
 const bearer=req.headers.get("authorization")||"";
 if(!/^Bearer\\s+\\S+$/i.test(bearer))return false;
 const base=Deno.env.get("SUPABASE_URL");
 const anon=Deno.env.get("SUPABASE_ANON_KEY");
 if(!base||!anon)return false; // fail closed if the environment is incomplete
 try{
  const response=await fetch(base.replace(/\\/+$/,"")+"/auth/v1/user",{
   headers:{Authorization:bearer,apikey:anon},
   signal:AbortSignal.timeout(5000),
  });
  return response.ok;
 }catch{return false}
}
Deno.serve(async(req)=>{
 if(req.method==="OPTIONS")return new Response(null,{headers});
 if(req.method!=="POST")return new Response(JSON.stringify({error:"Method not allowed"}),{status:405,headers});
 if(!(await validUserToken(req)))return new Response(JSON.stringify({error:"Authentication required"}),{status:401,headers});
 try{
  const payload=await req.json(),raw=payload?.symbols;
  if(!Array.isArray(raw)||raw.length>12||raw.length<1)return new Response(JSON.stringify({error:"Invalid request"}),{status:400,headers});
  const symbols=[...new Set(raw.map((s:unknown)=>String(s).trim().toUpperCase().replace(/\.T$/,"")))];
  if(!symbols.length||symbols.some(s=>!valid(s)))return new Response(JSON.stringify({error:"Invalid TSE ticker"}),{status:400,headers});
  const period=typeof payload.period==="string"?payload.period:null;
  if(period!==null&&(!periods[period]||symbols.length!==1))
   return new Response(JSON.stringify({error:"Invalid chart period"}),{status:400,headers});
  const [quotes,history]=await Promise.all([
   Promise.all(symbols.map(s=>getQuote(s))),
   period?getHistory(symbols[0],period):Promise.resolve(null),
  ]);
  return new Response(JSON.stringify({
   quotes:quotes.filter((q):q is Quote=>q!==null),
   unavailable:symbols.filter((_s,i)=>quotes[i]===null),
   ...(period?{history}:{}),
   disclaimer:"Unofficial delayed reference quotes. No uptime/latency guarantee.",
  }),{headers});
 }catch{
  return new Response(JSON.stringify({error:"Reference quote service unavailable"}),{status:503,headers});
 }
});
