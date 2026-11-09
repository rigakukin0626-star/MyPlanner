// My Planner v216: best-effort, delayed reference quotes for Japanese tickers.
// This uses an unofficial Yahoo Finance chart endpoint. It can rate-limit,
// change or stop working. Do NOT use it for order execution or guaranteed prices.
// If your use requires market-data redistribution rights, replace the upstream
// with a licensed data provider before publishing to other users.
const ALLOW_ORIGIN = "https://rigakukin0626-star.github.io";
const headers = {
  "Access-Control-Allow-Origin": ALLOW_ORIGIN,
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Cache-Control": "no-store",
  "Content-Type": "application/json; charset=utf-8",
};
type Quote = {symbol:string;price:number;currency:"JPY";asOf:string;source:string};
const cache = new Map<string,{until:number,quote:Quote}>();
const valid = (s:string) => /^([0-9]{4}|[0-9]{3}[A-Z])$/.test(s);
async function fetchOne(symbol:string):Promise<Quote|null>{
  const now=Date.now(), cached=cache.get(symbol);
  if(cached && cached.until>now)return cached.quote;
  const url="https://query1.finance.yahoo.com/v8/finance/chart/"+encodeURIComponent(symbol+".T")+"?range=5d&interval=1d";
  const response=await fetch(url,{
    headers:{"Accept":"application/json","User-Agent":"MyPlannerPersonalFinance/1.0"},
    signal:AbortSignal.timeout(7500),
  });
  if(!response.ok)return null;
  const result=(await response.json())?.chart?.result?.[0];
  const meta=result?.meta||{}, price=Number(meta.regularMarketPrice), timestamp=Number(meta.regularMarketTime);
  if(meta.currency!=="JPY"||!Number.isFinite(price)||price<=0||price>1e7||
     !Number.isFinite(timestamp)||timestamp<1577836800||timestamp*1000>Date.now()+3600000)return null;
  const quote:Quote={symbol,price,currency:"JPY",asOf:new Date(timestamp*1000).toISOString(),source:"Yahoo Finance (unofficial)"};
  cache.set(symbol,{until:now+5*60*1000,quote});
  return quote;
}
Deno.serve(async req=>{
  if(req.method==="OPTIONS")return new Response(null,{headers});
  if(req.method!=="POST")return new Response(JSON.stringify({error:"Method not allowed"}),{status:405,headers});
  try{
    const body=await req.json();
    const symbols=Array.isArray(body?.symbols)?[...new Set(body.symbols.map((s:unknown)=>String(s).trim().toUpperCase().replace(/\\.T$/,"")))].slice(0,12):[];
    if(!symbols.length||symbols.some(s=>!valid(s)))return new Response(JSON.stringify({error:"Invalid TSE ticker"}),{status:400,headers});
    const entries=await Promise.all(symbols.map(async s=>{try{return await fetchOne(s)}catch{return null}}));
    return new Response(JSON.stringify({quotes:entries.filter(Boolean),unavailable:symbols.filter((s,i)=>!entries[i]),disclaimer:"Reference quotes may be delayed or unavailable; not a licensed real-time feed."}),{headers});
  }catch{return new Response(JSON.stringify({error:"Quote service unavailable"}),{status:503,headers});}
});
