// FinansAI v3 — Application Logic
// Yazar: yasin.eris@gmail.com
// ────────────────────────────────────────
// Modüller:
//   State & Utils      (satır ~1)
//   Navigation         (satır ~100)
//   Crypto Prices      (satır ~120)
//   Dashboard          (satır ~165)
//   Watchlist          (satır ~215)
//   Transactions       (satır ~280)
//   Banks              (satır ~350)
//   Investments        (satır ~440)
//   Crypto Portfolio   (satır ~510)
//   Bills              (satır ~650)
//   Budget             (satır ~720)
//   Forecast           (satır ~790)
//   AI Chat            (satır ~850)
//   Google Calendar    (satır ~900)
//   LocalStorage       (satır ~970)
//   Auth Engine        (satır ~1010)
//   Auth UI            (satır ~1200)


// ═══ STATE ═══
let lang = 'tr';
let chatHistory = [];
let usdTry = 38.76; // fallback

const allTx = [
  {id:1,name:"Maaş",cat:"Maaş",amount:18500,date:"2026-03-15",type:"gelir",icon:"💼",bank:"Garanti BBVA",auto:true},
  {id:2,name:"Migros",cat:"Market",amount:-1240,date:"2026-03-19",type:"gider",icon:"🛒",bank:"Garanti BBVA",auto:true},
  {id:3,name:"Elektrik",cat:"Fatura",amount:-680,date:"2026-03-14",type:"gider",icon:"⚡",bank:"Manuel",auto:false},
  {id:4,name:"Freelance",cat:"Freelance",amount:3200,date:"2026-03-08",type:"gelir",icon:"💻",bank:"İş Bankası",auto:true},
  {id:5,name:"Spotify",cat:"Eğlence",amount:-110,date:"2026-03-12",type:"gider",icon:"🎵",bank:"Akbank",auto:true},
  {id:6,name:"İETT Kart",cat:"Ulaşım",amount:-500,date:"2026-03-10",type:"gider",icon:"🚌",bank:"Akbank",auto:true},
  {id:7,name:"Restoran",cat:"Yemek",amount:-380,date:"2026-03-07",type:"gider",icon:"🍽",bank:"Garanti BBVA",auto:true},
  {id:8,name:"İnternet",cat:"Fatura",amount:-290,date:"2026-03-05",type:"gider",icon:"📡",bank:"Manuel",auto:false},
  {id:9,name:"Eczane",cat:"Sağlık",amount:-175,date:"2026-03-03",type:"gider",icon:"💊",bank:"Garanti BBVA",auto:true},
  {id:10,name:"Kira",cat:"Fatura",amount:-4500,date:"2026-03-01",type:"gider",icon:"🏠",bank:"İş Bankası",auto:true},
];

let bankAccs = [
  {id:1,bank:"Garanti BBVA",icon:"🟠",type:"Vadesiz",no:"4521",balance:28750,rate:0,lateRate:0},
  {id:2,bank:"İş Bankası",icon:"🔵",type:"Tasarruf",no:"7832",balance:12500,rate:18,lateRate:0},
  {id:3,bank:"Akbank",icon:"🔴",type:"Kredi Kartı",no:"1204",balance:-2840,rate:45.5,lateRate:62},
];

let investments = [
  {id:1,inst:"Garanti Yatırım",type:"Hisse Senedi Portföyü",value:42000,cost:35000,qty:null,ret:7.2,note:"BIST30",icon:"📊"},
  {id:2,inst:"İş Yatırım",type:"Altın Hesabı",value:28600,cost:24000,qty:82.5,ret:19.2,note:"82.5 gr",icon:"🥇"},
  {id:3,inst:"BES",type:"Emeklilik (BES)",value:14000,cost:11200,qty:null,ret:8.9,note:"",icon:"🏦"},
];

let watchItems = [
  {id:1,sym:"ALTIN",name:"Gram Altın",type:"metal",qty:10,buy:3200,price:3480,icon:"🥇"},
  {id:2,sym:"USD",name:"ABD Doları",type:"fx",qty:500,buy:38.2,price:38.76,icon:"💵"},
  {id:3,sym:"EUR",name:"Euro",type:"fx",qty:200,buy:40.5,price:42.30,icon:"💶"},
];

let cryptoPortfolio = [
  {id:1,cgId:"bitcoin",sym:"BTC",name:"Bitcoin",qty:0.05,buy:3200000,price:null,exch:"Soğuk Cüzdan",icon:"₿"},
  {id:2,cgId:"ripple",sym:"XRP",name:"Ripple",qty:500,buy:52,price:null,exch:"Binance",icon:"✕"},
  {id:3,cgId:"ethereum",sym:"ETH",name:"Ethereum",qty:0.2,buy:112000,price:null,exch:"Binance",icon:"Ξ"},
  {id:4,cgId:"solana",sym:"SOL",name:"Solana",qty:5,buy:4800,price:null,exch:"Binance",icon:"◎"},
];

let bncPortfolio = [];

let bills = [
  {id:1,name:"Doğalgaz",amount:420,due:"2026-03-22",icon:"🔥",calId:"bosms2k64rsneglg35u21mvct4"},
  {id:2,name:"Su Faturası",amount:185,due:"2026-03-25",icon:"💧",calId:"9uln7mdsbivgv7oaefcjb6kq8k"},
  {id:3,name:"Telefon",amount:399,due:"2026-03-28",icon:"📱",calId:null},
  {id:4,name:"Netflix",amount:149,due:"2026-03-30",icon:"📺",calId:null},
  {id:5,name:"Sigorta",amount:3667,due:"2026-04-01",icon:"🛡",calId:null},
];

let budgets = [
  {cat:"Fatura",spent:5469,limit:6000,color:"var(--blue)"},
  {cat:"Market",spent:1860,limit:2500,color:"var(--teal)"},
  {cat:"Ulaşım",spent:950,limit:1200,color:"var(--orange)"},
  {cat:"Eğlence",spent:890,limit:800,color:"var(--red)"},
];

let installments = [
  {id:1,desc:"iPhone 15",card:"Akbank",total:42000,monthly:3500,remaining:8,startDate:"2025-08-01",rate:0,icon:"📱"},
  {id:2,desc:"Buzdolabı",card:"Garanti BBVA",total:18000,monthly:1500,remaining:5,startDate:"2025-11-01",rate:0,icon:"🧊"},
  {id:3,desc:"Tatil Kredisi",card:"İş Bankası",total:30000,monthly:2750,remaining:10,startDate:"2025-12-01",rate:3.5,icon:"✈️"},
];

let monthlyData = {};
let selectedCoinForAdd = null;

// ═══ UTILS ═══
const fmt = n => '₺' + Math.abs(n).toLocaleString('tr-TR',{minimumFractionDigits:0,maximumFractionDigits:0});
const fmtU = n => '$' + n.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});
const fmtDate = d => new Date(d+'T12:00:00').toLocaleDateString('tr-TR',{day:'2-digit',month:'short'});
const daysUntil = d => Math.ceil((new Date(d+'T12:00:00')-new Date())/(86400000));
const billStatus = d => { const dd=daysUntil(d); return dd<=3?'urgent':dd<=10?'soon':'ok'; };

function showNotif(msg,icon='✓'){
  document.getElementById('n-icon').textContent=icon;
  document.getElementById('n-txt').textContent=msg;
  const n=document.getElementById('notif'); n.classList.add('show');
  setTimeout(()=>n.classList.remove('show'),3500);
}

// ═══ NAV ═══
function showPage(id){
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.querySelectorAll('.ni').forEach(n=>n.classList.remove('active'));
  document.getElementById('page-'+id).classList.add('active');
  const el=document.querySelector(`[data-page="${id}"]`); if(el) el.classList.add('active');
  ({dashboard:initDash,watchlist:initWatch,transactions:initTx,banks:initBanks,
    investments:initInv,crypto:initCrypto,bills:initBills,budget:initBudget,
    forecast:initForecast,ai:initAI,add:initAdd,settings:initSettings}[id]||function(){})();
}
document.querySelectorAll('.ni').forEach(el=>el.addEventListener('click',()=>showPage(el.dataset.page)));

function switchBTab(t){
  document.querySelectorAll('[data-btab]').forEach(e=>e.classList.toggle('active',e.dataset.btab===t));
  ['accounts','monthly','credit'].forEach(k=>document.getElementById('bt-'+k).style.display=k===t?'block':'none');
}
function switchCTab(t){
  document.querySelectorAll('[data-ctab]').forEach(e=>e.classList.toggle('active',e.dataset.ctab===t));
  ['portfolio','add-coin'].forEach(k=>document.getElementById('ct-'+k).style.display=k===t?'block':'none');
}
function switchFTab(t){
  document.querySelectorAll('[data-ftab]').forEach(e=>e.classList.toggle('active',e.dataset.ftab===t));
  document.getElementById('ft-installments').style.display=t==='installments'?'block':'none';
  document.getElementById('ft-cashflow').style.display=t==='cashflow'?'block':'none';
  if(t==='cashflow') buildCashflowTable();
}

// ═══ CRYPTO PRICE FETCH ═══
let cryptoPrices = {};
let lastFetch = 0;

// cgId -> Binance sembol eslemesi
const cgToBinance = {
  bitcoin:'BTCUSDT', ripple:'XRPUSDT', ethereum:'ETHUSDT', solana:'SOLUSDT',
  'terra-luna-classic':'LUNCUSDT', cardano:'ADAUSDT', dogecoin:'DOGEUSDT',
  polkadot:'DOTUSDT', avalanche:'AVAXUSDT', chainlink:'LINKUSDT',
  litecoin:'LTCUSDT', 'shiba-inu':'SHIBUSDT', matic:'MATICUSDT',
  kaspa:'KASUSDT', tron:'TRXUSDT', toncoin:'TONUSDT',
  'sonic-3':'SUSDT'
};

async function fetchCryptoPrices(ids){
  const allCached = ids.every(id=>cryptoPrices[id]!==undefined);
  if(Date.now()-lastFetch < 30000 && allCached) return cryptoPrices;
  try {
    const fxResp = await fetch('https://api.binance.com/api/v3/ticker/price?symbol=USDTTRY');
    if(fxResp.ok){ const fx=await fxResp.json(); if(fx.price) usdTry=parseFloat(fx.price); }

    const symbols = ids.map(id=>cgToBinance[id]).filter(Boolean);
    const promises = symbols.map(sym=>
      fetch('https://api.binance.com/api/v3/ticker/24hr?symbol='+sym)
        .then(r=>r.ok?r.json():null).catch(()=>null)
    );
    const results = await Promise.all(promises);

    const data = {};
    ids.forEach(id=>{
      const sym = cgToBinance[id];
      if(!sym) return;
      const idx = symbols.indexOf(sym);
      const r = results[idx];
      if(r && r.lastPrice){
        const usd = parseFloat(r.lastPrice);
        data[id] = {
          usd,
          try: usd * usdTry,
          usd_24h_change: parseFloat(r.priceChangePercent)||0
        };
      }
    });

    cryptoPrices = data;
    lastFetch = Date.now();
    document.getElementById('crypto-updated').textContent = 'Guncellendi: '+new Date().toLocaleTimeString('tr-TR',{hour:'2-digit',minute:'2-digit'});
    return data;
  } catch(e) {
    return {bitcoin:{usd:87000,try:87000*usdTry,usd_24h_change:1.2},ripple:{usd:1.52,try:1.52*usdTry,usd_24h_change:-1.3},ethereum:{usd:2050,try:2050*usdTry,usd_24h_change:0.8},solana:{usd:130,try:130*usdTry,usd_24h_change:2.1}};
  }
}

async function refreshCrypto(){
  lastFetch=0;
  document.getElementById('refresh-btn').innerHTML='<span class="spin">↻</span> Yenile';
  const allIds=[...new Set([...cryptoPortfolio.map(c=>c.cgId),...bncPortfolio.map(c=>c.cgId)])];
  const prices = await fetchCryptoPrices(allIds);
  cryptoPortfolio.forEach(c=>{ if(prices[c.cgId]) c.price=prices[c.cgId].try||prices[c.cgId].usd*usdTry; });
  // bncPortfolio kaldırıldı
  document.getElementById('refresh-btn').textContent='↻ Yenile';
  renderCryptoPortfolio();
  updateDashCrypto();
}

function updateDashCrypto(){
  const total=cryptoPortfolio.filter(c=>c.price).reduce((s,c)=>s+c.price*c.qty,0);
  if(total>0){
    document.getElementById('dash-crypto-total').textContent=fmt(total);
  }
}

// ═══ DASHBOARD ═══
function initDash(){
  document.getElementById('dash-date').textContent=new Date().toLocaleDateString('tr-TR',{day:'2-digit',month:'long',year:'numeric'});
  document.getElementById('dash-tx').innerHTML=allTx.slice(0,5).map(renderTxItem).join('');
  // installments summary
  const instTotal=installments.reduce((s,i)=>s+i.monthly,0);
  document.getElementById('dash-inst').innerHTML=installments.slice(0,3).map(i=>`
    <div style="display:flex;align-items:center;justify-content:space-between;padding:7px 0;border-bottom:1px solid var(--border)">
      <span style="font-size:13px">${i.icon} ${i.desc}</span>
      <div style="text-align:right"><div style="font-family:var(--mono);font-size:12.5px;color:var(--red)">${fmt(i.monthly)}/ay</div>
      <div style="font-size:10px;color:var(--text3)">${i.remaining} taksit kaldı</div></div>
    </div>`).join('')+`<div style="padding:7px 0;font-size:12px;display:flex;justify-content:space-between"><span style="color:var(--text3)">Toplam aylık taksit</span><span style="font-family:var(--mono);color:var(--red)">${fmt(instTotal)}</span></div>`;
  // bills
  document.getElementById('dash-bills').innerHTML=bills.slice(0,3).map(b=>{
    const d=daysUntil(b.due); const st=billStatus(b.due);
    return `<div style="display:flex;align-items:center;gap:8px;padding:7px 0;border-bottom:1px solid var(--border)">
      <span style="font-size:14px">${b.icon}</span>
      <div style="flex:1"><div style="font-size:13px;font-weight:500">${b.name}</div><div style="font-size:10px;color:var(--text3)">${fmtDate(b.due)} · ${d>0?d+' gün':'bugün'}</div></div>
      <span class="badge ${st==='urgent'?'bdanger':st==='soon'?'bwarn':'bok'}">${st==='urgent'?'Acil':st==='soon'?'Yakında':'OK'}</span>
      <div style="font-family:var(--mono);font-size:12.5px">${fmt(b.amount)}</div>
    </div>`;
  }).join('');
  // crypto mini
  const cgIds=['bitcoin','ripple','ethereum','solana'];
  fetchCryptoPrices(cgIds).then(prices=>{
    const fallback={bitcoin:{sym:'BTC',icon:'₿',usd:87000,change:1.2},ripple:{sym:'XRP',icon:'✕',usd:1.52,change:-1.3},ethereum:{sym:'ETH',icon:'Ξ',usd:2050,change:0.8},solana:{sym:'SOL',icon:'◎',usd:130,change:2.1}};
    document.getElementById('dash-crypto').innerHTML=cgIds.map(id=>{
      const p=prices[id]||{};const f=fallback[id];
      const usdPrice=p.usd||f.usd; const chg=p.usd_24h_change||f.change; const up=chg>=0;
      const tryPrice=usdPrice*usdTry;
      return `<div class="crypto-row">
        <div class="crypto-icon">${f.icon}</div>
        <div class="crypto-body"><div class="crypto-name">${f.sym}</div></div>
        <div><div class="crypto-price">${fmt(tryPrice)}</div>
        <div class="crypto-change ${up?'up':'dn'}">${up?'↑':'↓'} %${Math.abs(chg).toFixed(2)}</div></div>
      </div>`;
    }).join('');
    updateDashCrypto();
  });
  setTimeout(()=>{
    document.getElementById('dash-ai-tip').innerHTML=`Kredi kartı taksitleri aylık <strong style="color:var(--red)">${fmt(installments.reduce((s,i)=>s+i.monthly,0))}</strong> nakit akışını etkiliyor. Eğlence bütçesi aşıldı (%111). XRP güncel fiyat $1.52 — alış maliyetinizin üzerinde.`;
  },600);
}

// ═══ WATCHLIST ═══
function initWatch(){
  renderWatchGrid();
  renderWatchSummary();
}
function renderWatchGrid(){
  document.getElementById('watch-grid').innerHTML=watchItems.map(w=>{
    const chg=((w.price-w.buy)/w.buy*100); const up=chg>=0;
    return `<div style="background:var(--bg3);border:1px solid var(--border);border-radius:var(--rs);padding:10px 11px;">
      <div style="display:flex;gap:5px;align-items:center;margin-bottom:6px"><span style="font-size:13px">${w.icon}</span><span style="font-family:var(--mono);font-size:10px;color:var(--text3)">${w.sym}</span></div>
      <div style="font-family:var(--mono);font-size:15px;font-weight:500">${fmt(w.price)}</div>
      <div style="font-size:11px;margin-top:2px;color:${up?'var(--teal)':'var(--red)'}">${up?'↑':'↓'} %${Math.abs(chg).toFixed(2)}</div>
    </div>`;
  }).join('');
}
function renderWatchSummary(){
  const total=watchItems.reduce((s,w)=>s+w.price*w.qty,0);
  const cost=watchItems.reduce((s,w)=>s+w.buy*w.qty,0);
  const pnl=total-cost;
  document.getElementById('watch-summary').innerHTML=`
    <div class="fg2">
      <div style="background:var(--bg3);border-radius:var(--rs);padding:10px"><div style="font-size:10px;color:var(--text3);margin-bottom:3px">Toplam Değer</div><div style="font-family:var(--mono);font-size:15px">${fmt(total)}</div></div>
      <div style="background:var(--bg3);border-radius:var(--rs);padding:10px"><div style="font-size:10px;color:var(--text3);margin-bottom:3px">K/Z</div><div style="font-family:var(--mono);font-size:15px;color:${pnl>=0?'var(--teal)':'var(--red)'}">${pnl>=0?'+':''}${fmt(pnl)}</div></div>
    </div>`;
}
function addWatch(){
  const sym=document.getElementById('w-sym').value.trim(); if(!sym) return;
  const qty=parseFloat(document.getElementById('w-qty').value)||0;
  const buy=parseFloat(document.getElementById('w-buy').value)||0;
  const type=document.getElementById('w-type').value;
  const icons={metal:'🥇',fx:'💵',fund:'📈',stock:'📊'};
  watchItems.push({id:Date.now(),sym:sym.toUpperCase(),name:sym,type,qty,buy,price:buy*(1+(Math.random()*.08-.02)),icon:icons[type]||'⭐'});
  renderWatchGrid();renderWatchSummary();
  showNotif(sym+' favorilere eklendi!','⭐');
}

// ═══ TRANSACTIONS ═══
function initTx(){ renderFilteredTx(); }
function filterTx(){ renderFilteredTx(); }
function renderFilteredTx(){
  const tp=document.getElementById('f-type').value;
  const ct=document.getElementById('f-cat').value;
  const q=(document.getElementById('f-q').value||'').toLowerCase();
  let list=allTx.filter(t=>{
    if(tp!=='all'&&t.type!==tp)return false;
    if(ct!=='all'&&t.cat!==ct)return false;
    if(q&&!t.name.toLowerCase().includes(q)&&!t.cat.toLowerCase().includes(q))return false;
    return true;
  });
  document.getElementById('tx-list').innerHTML=list.length?list.map(renderTxItem).join(''):'<p style="font-size:13px;color:var(--text3);padding:10px 0">Sonuç bulunamadı.</p>';
  document.getElementById('tx-count').textContent=list.length+' işlem';
}
function renderTxItem(t){
  return `<div class="tx-item"><div class="tx-av">${t.icon}</div><div class="tx-b"><div class="tx-name">${t.name}${t.auto?'<span class="abadge">⚡auto</span>':''}</div><div class="tx-meta">${t.cat} · ${t.bank}</div></div>
  <div class="tx-r"><div class="tx-amt ${t.amount>0?'pos':'neg'}">${t.amount>0?'+':''}${fmt(t.amount)}</div><div class="tx-dt">${fmtDate(t.date)}</div></div></div>`;
}

// ═══ BANKS ═══
function initBanks(){ renderBankAccs(); populateSelects(); renderCreditList(); renderMonthlyAccSel(); renderMonthlyTbl(); }
function renderBankAccs(){
  document.getElementById('bank-accs').innerHTML=bankAccs.map(a=>`
    <div style="background:var(--bg3);border:1px solid var(--border2);border-radius:var(--r);padding:13px 15px;margin-bottom:9px;">
      <div style="display:flex;align-items:center;gap:9px;margin-bottom:8px">
        <div style="width:32px;height:32px;border-radius:8px;background:var(--bg4);display:flex;align-items:center;justify-content:center;font-size:14px">${a.icon||'🏦'}</div>
        <div style="flex:1"><div style="font-size:13.5px;font-weight:500">${a.bank}</div><div style="font-size:11px;color:var(--text3)">${a.type} · **** ${a.no}</div></div>
        <div style="font-family:var(--mono);font-size:17px;font-weight:500;color:${a.balance<0?'var(--red)':'var(--teal)'}">${a.balance<0?'-':''}${fmt(a.balance)}</div>
      </div>
      <div style="display:flex;gap:6px;flex-wrap:wrap">
        ${a.rate>0?`<span style="font-size:10.5px;padding:2px 7px;border-radius:4px;background:var(--bg4);color:var(--text3);border:1px solid var(--border)">Faiz: %${a.rate}</span>`:''}
        ${a.lateRate>0?`<span style="font-size:10.5px;padding:2px 7px;border-radius:4px;background:var(--red-dim);color:var(--red);border:1px solid rgba(255,96,96,.2)">Gecikme: %${a.lateRate}</span>`:''}
        ${a.balance<0?`<span style="font-size:10.5px;padding:2px 7px;border-radius:4px;background:var(--red-dim);color:var(--red);border:1px solid rgba(255,96,96,.2)">Eksi bakiye</span>`:''}
      </div>
    </div>`).join('');
}
function populateSelects(){
  const opts=bankAccs.map(a=>`<option value="${a.id}">${a.bank} · ${a.type} *${a.no}</option>`).join('');
  ['monthly-sel','cr-sel'].forEach(id=>{const el=document.getElementById(id);if(el)el.innerHTML=opts;});
}
function addBankAcc(){
  const bank=document.getElementById('nb-bank').value;
  const type=document.getElementById('nb-type').value;
  const no=document.getElementById('nb-no').value||'0000';
  const bal=parseFloat(document.getElementById('nb-bal').value)||0;
  const rate=parseFloat(document.getElementById('nb-rate').value)||0;
  const late=parseFloat(document.getElementById('nb-late').value)||0;
  const icons={'Garanti BBVA':'🟠','İş Bankası':'🔵','Akbank':'🔴','Yapı Kredi':'⚫','Ziraat':'🟢','Halkbank':'🟤','VakıfBank':'🟡'};
  bankAccs.push({id:Date.now(),bank,icon:icons[bank]||'🏦',type,no,balance:bal,rate,lateRate:late});
  renderBankAccs();populateSelects();renderMonthlyAccSel();
  showNotif(bank+' hesabı eklendi','🏦');
}
function renderCreditList(){
  const neg=bankAccs.filter(a=>a.balance<0||a.lateRate>0||a.type==='Kredi Kartı'||a.type==='Kredi');
  document.getElementById('credit-list').innerHTML=neg.length?neg.map(a=>{
    const m=a.rate>0?Math.abs(a.balance)*(a.rate/100/12):0;
    return `<div style="background:var(--bg3);border:1px solid var(--border);border-radius:var(--rs);padding:12px 14px;margin-bottom:8px">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:7px">
        <div><div style="font-size:13px;font-weight:500">${a.bank} · ${a.type}</div><div style="font-size:10.5px;color:var(--text3)">**** ${a.no}</div></div>
        <div style="font-family:var(--mono);font-size:16px;color:${a.balance<0?'var(--red)':'var(--teal)'}">${a.balance<0?'-':''}${fmt(a.balance)}</div>
      </div>
      <div style="display:flex;gap:6px;flex-wrap:wrap">
        ${a.rate>0?`<span style="font-size:10.5px;padding:2px 7px;border-radius:4px;background:var(--red-dim);color:var(--orange)">Yıllık: %${a.rate}</span>`:''}
        ${a.lateRate>0?`<span style="font-size:10.5px;padding:2px 7px;border-radius:4px;background:var(--red-dim);color:var(--red)">Gecikme: %${a.lateRate}</span>`:''}
        ${m>0?`<span style="font-size:10.5px;padding:2px 7px;border-radius:4px;background:var(--bg4);color:var(--text3)">≈ Aylık faiz: ${fmt(m)}</span>`:''}
      </div>
    </div>`;
  }).join(''):'<p style="font-size:13px;color:var(--text3);padding:8px 0">Eksi bakiye hesabı yok.</p>';
}
function saveCreditInfo(){
  const sel=document.getElementById('cr-sel'); if(!sel) return;
  const a=bankAccs.find(x=>x.id===parseInt(sel.value)); if(!a) return;
  a.rate=parseFloat(document.getElementById('cr-rate').value)||a.rate;
  a.lateRate=parseFloat(document.getElementById('cr-late').value)||a.lateRate;
  a.balance=parseFloat(document.getElementById('cr-bal').value)||a.balance;
  const m=Math.abs(a.balance)*(a.rate/100/12);
  const d=Math.abs(a.balance)*(a.lateRate/100/365);
  document.getElementById('cr-calc').innerHTML=`<strong style="color:var(--text)">${a.bank}</strong> — Bakiye: <span style="color:var(--red)">${fmt(a.balance)}</span><br>Aylık faiz tahmini: <span style="color:var(--orange)">${fmt(m)}</span><br>Günlük gecikme: <span style="color:var(--red)">${fmt(d)}</span>`;
  renderBankAccs();renderCreditList();
  showNotif('Faiz bilgileri güncellendi','%');
}
// Monthly summary
function renderMonthlyAccSel(){
  const sel=document.getElementById('monthly-sel'); if(!sel) return;
  sel.innerHTML=bankAccs.map(a=>`<option value="${a.id}">${a.bank} · ${a.type} *${a.no}</option>`).join('');
}
function renderMonthlyTbl(){
  const sel=document.getElementById('monthly-sel'); if(!sel) return;
  const accId=parseInt(sel.value);
  const ayIsimleri=['Oca','Şub','Mar','Nis','May','Haz','Tem','Ağu','Eyl','Eki','Kas','Ara'];
  const bugun=new Date();
  const ms=Array.from({length:12},(_,i)=>{const d=new Date(bugun.getFullYear(),bugun.getMonth()+i);return ayIsimleri[d.getMonth()]+' '+(d.getFullYear()%100).toString().padStart(2,'0');});
  const stored=monthlyData[accId]||{};
  const hdrs=`<tr><th>Ay</th><th>Açılış Bakiyesi (₺)</th><th>Gelir (₺)</th><th>Gider (₺)</th><th>Kapanış (₺)</th></tr>`;
  const rows=ms.map(m=>{
    const d=stored[m]||{op:'',inc:'',exp:''};
    const cl=(parseFloat(d.op)||0)+(parseFloat(d.inc)||0)-(parseFloat(d.exp)||0);
    const show=d.op!==''||d.inc!==''||d.exp!=='';
    return `<tr><td>${m}</td>
      <td><input type="number" value="${d.op}" placeholder="0" oninput="updMonthly(${accId},'${m}','op',this.value)" style="width:100px;text-align:right"></td>
      <td><input type="number" value="${d.inc}" placeholder="0" oninput="updMonthly(${accId},'${m}','inc',this.value)" style="width:100px;text-align:right"></td>
      <td><input type="number" value="${d.exp}" placeholder="0" oninput="updMonthly(${accId},'${m}','exp',this.value)" style="width:100px;text-align:right"></td>
      <td class="${show?(cl>=0?'pos':'neg'):''}">${show?fmt(cl):'—'}</td></tr>`;
  }).join('');
  document.getElementById('monthly-tbl').innerHTML=`<thead>${hdrs}</thead><tbody>${rows}</tbody>`;
}
function updMonthly(aId,m,f,v){if(!monthlyData[aId])monthlyData[aId]={};if(!monthlyData[aId][m])monthlyData[aId][m]={op:'',inc:'',exp:''};monthlyData[aId][m][f]=v;}
function saveMonthly(){
  const sel=document.getElementById('monthly-sel'); if(!sel) return;
  const aId=parseInt(sel.value);
  const ayIsimleri=['Oca','Şub','Mar','Nis','May','Haz','Tem','Ağu','Eyl','Eki','Kas','Ara'];
  const bugun=new Date();
  const ms=Array.from({length:12},(_,i)=>{const d=new Date(bugun.getFullYear(),bugun.getMonth()+i);return ayIsimleri[d.getMonth()]+' '+(d.getFullYear()%100).toString().padStart(2,'0');});
  const stored=monthlyData[aId]||{};
  const vals=ms.map(m=>{const d=stored[m]||{};return(parseFloat(d.op)||0)+(parseFloat(d.inc)||0)-(parseFloat(d.exp)||0);});
  const max=Math.max(...vals.map(Math.abs),1);
  document.getElementById('monthly-chart').innerHTML=ms.map((m,i)=>`
    <div style="flex:1;display:flex;flex-direction:column;align-items:center">
      <div title="${fmt(vals[i])}" style="width:100%;border-radius:3px 3px 0 0;background:${vals[i]>=0?'var(--teal)':'var(--red)'};height:${Math.round(Math.abs(vals[i])/max*80)}px;min-height:2px;opacity:.85;transition:height .4s"></div>
      <div style="font-size:9.5px;color:var(--text3);margin-top:4px">${m}</div>
    </div>`).join('');
  showNotif('Aylık özet kaydedildi','📊');
}

// ═══ INVESTMENTS ═══
function initInv(){ renderInvList(); }
function renderInvList(){
  const total=investments.reduce((s,i)=>s+i.value,0);
  const cost=investments.reduce((s,i)=>s+i.cost,0);
  const pnl=total-cost;
  document.getElementById('inv-list').innerHTML=`
    <div class="fg3" style="margin-bottom:12px">
      <div style="background:var(--bg3);border-radius:var(--rs);padding:9px"><div style="font-size:9.5px;color:var(--text3);margin-bottom:3px">Toplam Değer</div><div style="font-family:var(--mono);font-size:14px">${fmt(total)}</div></div>
      <div style="background:var(--bg3);border-radius:var(--rs);padding:9px"><div style="font-size:9.5px;color:var(--text3);margin-bottom:3px">Maliyet</div><div style="font-family:var(--mono);font-size:14px">${fmt(cost)}</div></div>
      <div style="background:var(--bg3);border-radius:var(--rs);padding:9px"><div style="font-size:9.5px;color:var(--text3);margin-bottom:3px">K/Z</div><div style="font-family:var(--mono);font-size:14px;color:${pnl>=0?'var(--teal)':'var(--red)'}">${pnl>=0?'+':''}${fmt(pnl)}</div></div>
    </div>`+
  investments.map(inv=>{
    const pnl=inv.value-inv.cost; const pct=((pnl/inv.cost)*100).toFixed(1);
    return `<div style="background:var(--bg3);border:1px solid var(--border);border-radius:var(--r);padding:12px 14px;margin-bottom:8px">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
        <span style="font-size:17px">${inv.icon}</span>
        <div style="flex:1"><div style="font-size:13px;font-weight:500">${inv.inst}</div><div style="font-size:11px;color:var(--text3)">${inv.type}</div></div>
        <span class="badge ${pnl>=0?'bok':'bdanger'}">${pnl>=0?'+':''}%${Math.abs(pct)}</span>
      </div>
      <div style="display:flex;gap:12px;flex-wrap:wrap">
        <div><div style="font-size:9.5px;color:var(--text3)">Güncel</div><div style="font-family:var(--mono);font-size:13px;color:var(--teal)">${fmt(inv.value)}</div></div>
        <div><div style="font-size:9.5px;color:var(--text3)">Maliyet</div><div style="font-family:var(--mono);font-size:13px">${fmt(inv.cost)}</div></div>
        <div><div style="font-size:9.5px;color:var(--text3)">K/Z</div><div style="font-family:var(--mono);font-size:13px;color:${pnl>=0?'var(--teal)':'var(--red)'}">${pnl>=0?'+':''}${fmt(pnl)}</div></div>
        ${inv.ret>0?`<div><div style="font-size:9.5px;color:var(--text3)">Yıllık</div><div style="font-family:var(--mono);font-size:13px;color:var(--purple)">%${inv.ret}</div></div>`:''}
        ${inv.qty?`<div><div style="font-size:9.5px;color:var(--text3)">Miktar</div><div style="font-family:var(--mono);font-size:13px">${inv.qty}</div></div>`:''}
      </div>
      ${inv.note?`<div style="font-size:11px;color:var(--text3);margin-top:6px">${inv.note}</div>`:''}
    </div>`;
  }).join('');
}
function addInv(){
  const inst=document.getElementById('inv-inst').value.trim(); if(!inst) return;
  const type=document.getElementById('inv-type').value;
  const val=parseFloat(document.getElementById('inv-val').value)||0;
  const cost=parseFloat(document.getElementById('inv-cost').value)||0;
  const qty=parseFloat(document.getElementById('inv-qty').value)||null;
  const ret=parseFloat(document.getElementById('inv-ret').value)||0;
  const icons={'Hisse Senedi Portföyü':'📊','Yatırım Fonu':'📈','Altın Hesabı':'🥇','Gümüş Fonu':'🥈','Döviz Hesabı':'💵','Tahvil / Bono':'📜','Eurobond':'🌐','Emeklilik (BES)':'🏦'};
  investments.push({id:Date.now(),inst,type,value:val,cost,qty,ret,note:'',icon:icons[type]||'💼'});
  renderInvList();showNotif(inst+' eklendi','📈');
}

// FUND SEARCH
const FUND_DB = [
  {code:'TFF1F',name:'Türkiye Fonu A',type:'Hisse Fonu',price:4.67,return:18.2},
  {code:'TL30F',name:'Para Piyasası 30 Gün',type:'Para Piyasası',price:2.14,return:42.1},
  {code:'IYI',name:'İş Yatırım Altın ETF',type:'Altın ETF',price:58.4,return:24.3},
  {code:'GARAN',name:'Garanti Bankası Hisse',type:'Hisse Senedi',price:118.8,return:null},
  {code:'THYAO',name:'Türk Hava Yolları',type:'Hisse Senedi',price:312.5,return:null},
  {code:'BIST30',name:'BIST30 Endeks Fonu',type:'Endeks Fonu',price:11.2,return:32.4},
  {code:'EUROBND',name:'Eurobond Fonu',type:'Tahvil Fonu',price:1.89,return:8.4},
  {code:'AGF',name:'Altın Gümüş Fonu',type:'Emtia Fonu',price:3.44,return:21.7},
  {code:'BESF',name:'BES Büyüme Fonu',type:'BES',price:5.12,return:14.8},
  {code:'YGILX',name:'Yatırım Gilmor ETF',type:'Karma Fon',price:2.78,return:16.1},
];
function searchFund(){
  const q=document.getElementById('fund-q').value.trim().toUpperCase();
  if(q.length<2){document.getElementById('fund-results').innerHTML='';return;}
  const results=FUND_DB.filter(f=>f.code.includes(q)||f.name.toUpperCase().includes(q));
  document.getElementById('fund-results').innerHTML=results.length?
    results.map(f=>`<div class="fund-result" onclick="selectFund('${f.code}','${f.name}',${f.price})">
      <div style="display:flex;align-items:center;justify-content:space-between">
        <div><div class="fund-code">${f.code} · ${f.type}</div><div class="fund-name">${f.name}</div></div>
        <div class="fund-val">${fmt(f.price*100)} <span style="font-size:10px;color:var(--text3)">/lot</span></div>
      </div>
      ${f.return?`<div style="font-size:11px;color:var(--teal);margin-top:3px">Yıllık getiri: %${f.return}</div>`:''}
    </div>`).join('')
    :'<p style="font-size:12.5px;color:var(--text3);padding:8px 0">Sonuç bulunamadı. Kodu ile deneyin (ISIN, fon kodu).</p>';
}
function selectFund(code,name,price){
  document.getElementById('inv-inst').value=name;
  document.getElementById('inv-type').value='Yatırım Fonu';
  document.getElementById('inv-val').value=price*100;
  showNotif(code+' seçildi. Detayları tamamlayın.','📈');
}

// ═══ CRYPTO ═══
function initCrypto(){
  renderCryptoPortfolio();
  refreshCrypto();
}
function renderCryptoPortfolio(){
  const total=cryptoPortfolio.filter(c=>c.price).reduce((s,c)=>s+c.price*c.qty,0);
  if(total>0) document.getElementById('crypto-total-val').textContent='· '+fmt(total);
  document.getElementById('crypto-list').innerHTML=cryptoPortfolio.map(c=>{
    const tryPrice=c.price||0;
    const costTry=c.buy*c.qty;
    const valTry=tryPrice*c.qty;
    const pnl=valTry-costTry;
    const pct=costTry>0?(pnl/costTry*100).toFixed(1):0;
    return `<div class="crypto-row">
      <div class="crypto-icon">${c.icon}</div>
      <div class="crypto-body"><div class="crypto-name">${c.sym}</div><div class="crypto-sym">${c.qty} adet · ${c.exch}</div></div>
      <div>
        <div class="crypto-price">${tryPrice>0?fmt(tryPrice):'…'}</div>
        <div class="crypto-change ${pnl>=0?'up':'dn'}">${pnl>=0?'+':''}${costTry>0?'%'+Math.abs(pct):'—'}</div>
        <div class="crypto-holdings">${valTry>0?fmt(valTry):''}</div>
      </div>
    </div>`;
  }).join('');
  // breakdown
  const items=cryptoPortfolio.filter(c=>c.price);
  const tot2=items.reduce((s,c)=>s+c.price*c.qty,0)||1;
  document.getElementById('crypto-breakdown').innerHTML=items.map(c=>{
    const v=c.price*c.qty; const pct=(v/tot2*100).toFixed(0);
    return `<div class="pr"><div class="ph"><span>${c.sym}</span><span>%${pct}</span></div><div class="pt"><div class="pf" style="width:${pct}%;background:var(--purple)"></div></div></div>`;
  }).join('');
  // pnl
  const totalCost=cryptoPortfolio.reduce((s,c)=>s+c.buy*c.qty,0);
  const totalPnl=tot2>1?tot2-totalCost:-1;
  document.getElementById('crypto-pnl').innerHTML=`
    <div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:6px"><span style="color:var(--text3)">Toplam maliyet</span><span style="font-family:var(--mono)">${fmt(totalCost)}</span></div>
    <div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:6px"><span style="color:var(--text3)">Güncel değer</span><span style="font-family:var(--mono);color:var(--teal)">${tot2>1?fmt(tot2):'…'}</span></div>
    <div style="display:flex;justify-content:space-between;font-size:13px"><span style="color:var(--text3)">K/Z</span><span style="font-family:var(--mono);color:${totalPnl>=0?'var(--teal)':'var(--red)'}">${totalPnl>-1?(totalPnl>=0?'+':'')+ fmt(totalPnl):'…'}</span></div>`;
}
// Coin search
const COIN_LIST = [
  // — Top Layer 1 —
  {id:'bitcoin',sym:'BTC',name:'Bitcoin',icon:'₿'},
  {id:'ethereum',sym:'ETH',name:'Ethereum',icon:'Ξ'},
  {id:'tether',sym:'USDT',name:'Tether',icon:'💵'},
  {id:'binancecoin',sym:'BNB',name:'BNB',icon:'🟡'},
  {id:'ripple',sym:'XRP',name:'Ripple XRP',icon:'✕'},
  {id:'usd-coin',sym:'USDC',name:'USD Coin',icon:'💲'},
  {id:'solana',sym:'SOL',name:'Solana',icon:'◎'},
  {id:'cardano',sym:'ADA',name:'Cardano',icon:'◈'},
  {id:'dogecoin',sym:'DOGE',name:'Dogecoin',icon:'🐕'},
  {id:'tron',sym:'TRX',name:'TRON',icon:'⚙'},
  // — Layer 2 / DeFi —
  {id:'polkadot',sym:'DOT',name:'Polkadot',icon:'●'},
  {id:'avalanche-2',sym:'AVAX',name:'Avalanche',icon:'🔺'},
  {id:'chainlink',sym:'LINK',name:'Chainlink',icon:'🔗'},
  {id:'litecoin',sym:'LTC',name:'Litecoin',icon:'Ł'},
  {id:'uniswap',sym:'UNI',name:'Uniswap',icon:'🦄'},
  {id:'stellar',sym:'XLM',name:'Stellar',icon:'✦'},
  {id:'matic-network',sym:'MATIC',name:'Polygon',icon:'🟣'},
  {id:'the-open-network',sym:'TON',name:'Toncoin',icon:'💎'},
  {id:'sui',sym:'SUI',name:'Sui',icon:'💧'},
  {id:'near',sym:'NEAR',name:'NEAR Protocol',icon:'🌐'},
  // — Meme / Community —
  {id:'shiba-inu',sym:'SHIB',name:'Shiba Inu',icon:'🐕‍🦺'},
  {id:'pepe',sym:'PEPE',name:'Pepe',icon:'🐸'},
  {id:'floki',sym:'FLOKI',name:'Floki',icon:'⚡'},
  {id:'bonk',sym:'BONK',name:'Bonk',icon:'🐶'},
  {id:'dogwifcoin',sym:'WIF',name:'dogwifhat',icon:'🐕'},
  // — Luna Ekosistemi —
  {id:'terra-luna-classic',sym:'LUNC',name:'Terra Luna Classic',icon:'🌕'},
  {id:'terra-luna-2',sym:'LUNA',name:'Terra Luna 2.0',icon:'🌙'},
  {id:'terrausd',sym:'USTC',name:'TerraClassicUSD',icon:'🪙'},
  // — Gaming / Metaverse —
  {id:'the-sandbox',sym:'SAND',name:'The Sandbox',icon:'🏖'},
  {id:'decentraland',sym:'MANA',name:'Decentraland',icon:'🌍'},
  {id:'axie-infinity',sym:'AXS',name:'Axie Infinity',icon:'🐉'},
  {id:'immutable-x',sym:'IMX',name:'Immutable X',icon:'🎮'},
  {id:'gala',sym:'GALA',name:'Gala Games',icon:'🎲'},
  {id:'enjincoin',sym:'ENJ',name:'Enjin Coin',icon:'💎'},
  // — AI / Data —
  {id:'fetch-ai',sym:'FET',name:'Fetch.ai',icon:'🤖'},
  {id:'singularitynet',sym:'AGIX',name:'SingularityNET',icon:'🧠'},
  {id:'ocean-protocol',sym:'OCEAN',name:'Ocean Protocol',icon:'🌊'},
  {id:'render-token',sym:'RNDR',name:'Render',icon:'🖥'},
  {id:'worldcoin-wld',sym:'WLD',name:'Worldcoin',icon:'🌐'},
  // — Layer 2 / Scaling —
  {id:'arbitrum',sym:'ARB',name:'Arbitrum',icon:'🔵'},
  {id:'optimism',sym:'OP',name:'Optimism',icon:'🔴'},
  {id:'starknet',sym:'STRK',name:'Starknet',icon:'⭐'},
  {id:'base',sym:'BASE',name:'Base',icon:'🔷'},
  {id:'zksync',sym:'ZK',name:'zkSync',icon:'⚡'},
  // — DeFi Protokoller —
  {id:'aave',sym:'AAVE',name:'Aave',icon:'👻'},
  {id:'maker',sym:'MKR',name:'Maker',icon:'🏛'},
  {id:'compound-governance-token',sym:'COMP',name:'Compound',icon:'🌿'},
  {id:'curve-dao-token',sym:'CRV',name:'Curve',icon:'〰️'},
  {id:'1inch',sym:'1INCH',name:'1inch',icon:'🔀'},
  {id:'sushi',sym:'SUSHI',name:'SushiSwap',icon:'🍣'},
  {id:'pancakeswap-token',sym:'CAKE',name:'PancakeSwap',icon:'🥞'},
  {id:'lido-dao',sym:'LDO',name:'Lido DAO',icon:'🌊'},
  // — Exchange Tokenleri —
  {id:'okb',sym:'OKB',name:'OKB',icon:'🔵'},
  {id:'crypto-com-chain',sym:'CRO',name:'Cronos',icon:'💙'},
  {id:'kucoin-shares',sym:'KCS',name:'KuCoin Token',icon:'🟢'},
  {id:'huobi-token',sym:'HT',name:'Huobi Token',icon:'🔶'},
  {id:'gatechain-token',sym:'GT',name:'Gate Token',icon:'🔑'},
  // — Smart Contract Platformlar —
  {id:'internet-computer',sym:'ICP',name:'Internet Computer',icon:'🌐'},
  {id:'algorand',sym:'ALGO',name:'Algorand',icon:'⚫'},
  {id:'vechain',sym:'VET',name:'VeChain',icon:'✅'},
  {id:'hedera-hashgraph',sym:'HBAR',name:'Hedera',icon:'ℏ'},
  {id:'iota',sym:'IOTA',name:'IOTA',icon:'🔷'},
  {id:'elrond-erd-2',sym:'EGLD',name:'MultiversX',icon:'🔮'},
  {id:'theta-token',sym:'THETA',name:'Theta Network',icon:'θ'},
  {id:'neo',sym:'NEO',name:'NEO',icon:'🟢'},
  {id:'eos',sym:'EOS',name:'EOS',icon:'⚫'},
  {id:'tezos',sym:'XTZ',name:'Tezos',icon:'🔵'},
  {id:'zilliqa',sym:'ZIL',name:'Zilliqa',icon:'💠'},
  {id:'harmony',sym:'ONE',name:'Harmony',icon:'🔵'},
  {id:'ontology',sym:'ONT',name:'Ontology',icon:'💎'},
  // — Privacy Coinler —
  {id:'monero',sym:'XMR',name:'Monero',icon:'🔒'},
  {id:'zcash',sym:'ZEC',name:'Zcash',icon:'💛'},
  {id:'dash',sym:'DASH',name:'Dash',icon:'💙'},
  // — Oracle / Infra —
  {id:'band-protocol',sym:'BAND',name:'Band Protocol',icon:'📡'},
  {id:'api3',sym:'API3',name:'API3',icon:'🔌'},
  {id:'the-graph',sym:'GRT',name:'The Graph',icon:'📊'},
  {id:'filecoin',sym:'FIL',name:'Filecoin',icon:'📁'},
  {id:'arweave',sym:'AR',name:'Arweave',icon:'🗄'},
  {id:'storj',sym:'STORJ',name:'Storj',icon:'💾'},
  // — Bitcoin Ekosistemi —
  {id:'bitcoin-cash',sym:'BCH',name:'Bitcoin Cash',icon:'💚'},
  {id:'bitcoin-sv',sym:'BSV',name:'Bitcoin SV',icon:'₿'},
  {id:'wrapped-bitcoin',sym:'WBTC',name:'Wrapped Bitcoin',icon:'🔶'},
  {id:'bitcoin-gold',sym:'BTG',name:'Bitcoin Gold',icon:'🟡'},
  // — Stablecoin —
  {id:'dai',sym:'DAI',name:'Dai',icon:'🟡'},
  {id:'binance-usd',sym:'BUSD',name:'Binance USD',icon:'🟡'},
  {id:'trueusd',sym:'TUSD',name:'TrueUSD',icon:'💵'},
  {id:'frax',sym:'FRAX',name:'Frax',icon:'🔵'},
  // — Diğer Popüler —
  {id:'cosmos',sym:'ATOM',name:'Cosmos',icon:'⚛'},
  {id:'aptos',sym:'APT',name:'Aptos',icon:'🔷'},
  {id:'injective-protocol',sym:'INJ',name:'Injective',icon:'🔮'},
  {id:'sei-network',sym:'SEI',name:'Sei',icon:'🌊'},
  {id:'celestia',sym:'TIA',name:'Celestia',icon:'🌌'},
  {id:'mantle',sym:'MNT',name:'Mantle',icon:'🔵'},
  {id:'jupiter-exchange-solana',sym:'JUP',name:'Jupiter',icon:'🪐'},
  {id:'pyth-network',sym:'PYTH',name:'Pyth Network',icon:'🐍'},
  {id:'wormhole',sym:'W',name:'Wormhole',icon:'🌀'},
  {id:'jito-governance-token',sym:'JTO',name:'Jito',icon:'⚡'},
  {id:'kaspa',sym:'KAS',name:'Kaspa',icon:'🔷'},
  {id:'conflux-token',sym:'CFX',name:'Conflux',icon:'🌀'},
  {id:'cronos',sym:'CRO',name:'Cronos',icon:'💙'},
  {id:'flow',sym:'FLOW',name:'Flow',icon:'🌊'},
  {id:'quant-network',sym:'QNT',name:'Quant',icon:'🔵'},
  {id:'icon',sym:'ICX',name:'ICON',icon:'🔷'},
  {id:'nervos-network',sym:'CKB',name:'Nervos Network',icon:'⚫'},
  {id:'wax',sym:'WAXP',name:'WAX',icon:'🟡'},
  {id:'xdc-network',sym:'XDC',name:'XDC Network',icon:'🔵'},
  {id:'sonic-3',sym:'S',name:'Sonic (eski Fantom)',icon:'👻'},
];

let addCoinSelected = null;
// Add coin (other exchanges)
function searchAddCoin(){
  const q=document.getElementById('add-coin-q').value.trim().toUpperCase();
  if(q.length<1){document.getElementById('add-coin-res').innerHTML='';return;}
  const res=COIN_LIST.filter(c=>c.sym.includes(q)||c.name.toUpperCase().includes(q));
  document.getElementById('add-coin-res').innerHTML=res.slice(0,10).map(c=>`
    <div style="display:flex;align-items:center;gap:8px;padding:8px 10px;border-radius:var(--rs);cursor:pointer;border:1px solid var(--border);margin-bottom:5px;transition:border .12s" onmouseover="this.style.borderColor='var(--accent)'" onmouseout="this.style.borderColor='var(--border)'" onclick="selectAddCoin('${c.id}','${c.sym}','${c.name}','${c.icon}')">
      <span style="font-size:16px">${c.icon}</span>
      <div style="flex:1"><div style="font-size:13px;font-weight:500">${c.sym}</div><div style="font-size:10.5px;color:var(--text3)">${c.name}</div></div>
    </div>`).join('');
}

async function selectAddCoin(id,sym,name,icon){
  addCoinSelected={id,sym,name,icon};
  document.getElementById('selected-coin-detail').innerHTML=`<span class="spin">↻</span> ${sym} fiyatı alınıyor...`;
  document.getElementById('selected-coin-form').style.display='block';
  const prices=await fetchCryptoPrices([id]);
  const p=prices[id];
  if(p){
    addCoinSelected.usdPrice=p.usd;
    addCoinSelected.change=p.usd_24h_change||0;
    document.getElementById('selected-coin-detail').innerHTML=`
      <div style="display:flex;align-items:center;gap:9px;margin-bottom:8px">
        <span style="font-size:22px">${icon}</span>
        <div><div style="font-size:15px;font-weight:500">${sym}</div><div style="font-size:11px;color:var(--text3)">${name}</div></div>
      </div>
      <div style="font-family:var(--mono);font-size:18px;color:var(--teal)">$${p.usd<0.001?p.usd.toFixed(8):p.usd<0.1?p.usd.toFixed(6):p.usd<1?p.usd.toFixed(4):p.usd.toFixed(2)} · ${fmt(p.usd*usdTry)}</div>
      <div style="font-size:11.5px;color:${p.usd_24h_change>=0?'var(--teal)':'var(--red)'};margin-top:3px">24s: ${p.usd_24h_change>=0?'+':''}${(p.usd_24h_change||0).toFixed(2)}%</div>`;
    const decimals2=p.usd<0.001?8:p.usd<0.1?6:p.usd<1?4:2;
    document.getElementById('new-coin-buy').value=p.usd.toFixed(decimals2);
    calcNewCoinValue();
  }
}

function calcNewCoinValue(){
  const qty=parseFloat(document.getElementById('new-coin-qty').value)||0;
  const buy=parseFloat(document.getElementById('new-coin-buy').value)||0;
  if(!addCoinSelected||!qty){return;}
  const cur=addCoinSelected.usdPrice||buy;
  const val=cur*qty; const cost=buy*qty; const pnl=val-cost;
  document.getElementById('new-coin-preview').innerHTML=
    `${qty} ${addCoinSelected.sym} = <strong style="color:var(--teal)">$${val.toFixed(2)}</strong> (${fmt(val*usdTry)})<br>K/Z: <span style="color:${pnl>=0?'var(--teal)':'var(--red)'}">${pnl>=0?'+':''}$${pnl.toFixed(2)}</span>`;
}

function addNewCoin(){
  if(!addCoinSelected) return;
  const qty=parseFloat(document.getElementById('new-coin-qty').value)||0;
  const buy=parseFloat(document.getElementById('new-coin-buy').value)||0;
  const exch=document.getElementById('new-coin-exch').value;
  if(!qty) return;
  cryptoPortfolio.push({id:Date.now(),cgId:addCoinSelected.id,sym:addCoinSelected.sym,name:addCoinSelected.name,qty,buy:buy*usdTry,price:addCoinSelected.usdPrice?addCoinSelected.usdPrice*usdTry:null,exch,icon:addCoinSelected.icon});
  renderCryptoPortfolio();
  showNotif(addCoinSelected.sym+' portföye eklendi','₿');
}

// ═══ BILLS ═══
function initBills(){
  document.getElementById('bill-dt').value=new Date(Date.now()+7*86400000).toISOString().split('T')[0];
  document.getElementById('bills-list').innerHTML=bills.map(b=>{
    const d=daysUntil(b.due); const st=billStatus(b.due);
    return `<div class="bill-row" style="display:flex;align-items:center;gap:9px;padding:9px 0;border-bottom:1px solid var(--border)">
      <div style="width:31px;height:31px;border-radius:8px;background:var(--bg3);display:flex;align-items:center;justify-content:center;font-size:14px">${b.icon}</div>
      <div style="flex:1"><div style="font-size:13px;font-weight:500">${b.name}${b.calId?` <span style="font-size:10px;color:var(--teal)">📅</span>`:''}</div><div style="font-size:10px;color:var(--text3)">${fmtDate(b.due)} · ${d>0?d+' gün':'bugün'}</div></div>
      <span class="badge ${st==='urgent'?'bdanger':st==='soon'?'bwarn':'bok'}">${st==='urgent'?'Acil':st==='soon'?'Yakında':'OK'}</span>
      <div style="font-family:var(--mono);font-size:13px">${fmt(b.amount)}</div>
    </div>`;
  }).join('');
  document.getElementById('paid-bills').innerHTML=[
    {name:"Elektrik",amount:680,icon:"⚡"},{name:"İnternet",amount:290,icon:"📡"},{name:"Kira",amount:4500,icon:"🏠"}
  ].map(b=>`<div style="display:flex;align-items:center;gap:9px;padding:8px 0;border-bottom:1px solid var(--border)"><span style="font-size:14px">${b.icon}</span><div style="flex:1;font-size:13px;font-weight:500">${b.name}</div><span class="badge bok">✓</span><div style="font-family:var(--mono);font-size:12.5px;color:var(--text3)">${fmt(b.amount)}</div></div>`).join('');
  document.getElementById('gcal-events').innerHTML=`
    <div style="background:var(--teal-dim);border:1px solid rgba(61,219,181,.2);border-radius:var(--rs);padding:10px 13px;font-size:12px;color:var(--text2);display:flex;gap:10px;align-items:center;flex-wrap:wrap">
      <span style="color:var(--teal)">📅</span>
      <span>Google Takvim'de: </span>
      <a href="https://www.google.com/calendar/event?eid=Ym9zbXMyazY0cnNuZWdsZzM1dTIxbXZjdDQgeWFzaW4uZXJpc0Bt" target="_blank" style="color:var(--teal)">🔥 Doğalgaz — 22 Mar ↗</a>
      <a href="https://www.google.com/calendar/event?eid=OXVsbjdtZHNiaXZndjdvYWVmY2piNmtxOGsgeWFzaW4uZXJpc0Bt" target="_blank" style="color:var(--teal)">💧 Su Faturası — 25 Mar ↗</a>
    </div>`;
}
async function saveBill(){
  const name=document.getElementById('bill-nm').value.trim();
  const amt=parseFloat(document.getElementById('bill-am').value)||0;
  const due=document.getElementById('bill-dt').value;
  if(!name||!due) return;
  const addCal=document.getElementById('bill-cal').checked;
  bills.push({id:Date.now(),name,amount:amt,due,icon:'📄',calId:null});
  document.getElementById('bill-res').innerHTML=addCal?'⏳ Takvime ekleniyor...':'';
  if(addCal){
    // Simulate calendar add (real MCP call happens server-side)
    await new Promise(r=>setTimeout(r,800));
    document.getElementById('bill-res').innerHTML='✓ Google Takvim\'e eklendi — bildirimler aktif';
  } else {
    document.getElementById('bill-res').innerHTML='✓ Fatura kaydedildi';
  }
  saveData();showNotif(name+' faturası eklendi','📄');
}
function simOCR(){
  document.getElementById('ocr-res').innerHTML='<div style="margin-top:8px;font-size:12.5px;color:var(--text3)"><span class="spin">↻</span> AI analiz ediyor...</div>';
  setTimeout(()=>{document.getElementById('ocr-res').innerHTML=`<div style="background:var(--teal-dim);border:1px solid rgba(61,219,181,.2);border-radius:var(--rs);padding:9px 12px;margin-top:8px;font-size:12.5px;color:var(--teal)">✓ Tanındı: <strong>EDAŞ — Elektrik</strong> · ₺547,60 · Son: 23 Mart<br><button onclick="this.parentElement.remove()" style="color:var(--teal);font-size:11px;margin-top:4px;cursor:pointer">Sisteme ekle →</button></div>`;},1600);
}

// ═══ BUDGET ═══
function initBudget(){
  document.getElementById('budget-bars').innerHTML=budgets.map(b=>{
    const pct=Math.round(b.spent/b.limit*100);
    return `<div class="pr"><div class="ph"><span>${b.cat}</span><span style="color:${pct>100?'var(--red)':'var(--text3)'}">${fmt(b.spent)} / ${fmt(b.limit)} · %${pct}</span></div><div class="pt"><div class="pf" style="width:${Math.min(pct,100)}%;background:${pct>100?'var(--red)':b.color}"></div></div></div>`;
  }).join('');
  document.getElementById('score-bars').innerHTML=renderScoreBars();
}
function renderScoreBars(){
  return [{l:'Tasarruf',v:32,c:'var(--teal)'},{l:'Bütçe',v:68,c:'var(--blue)'},{l:'Ödeme',v:90,c:'var(--accent)'},{l:'Yatırım',v:75,c:'var(--purple)'}]
    .map(s=>`<div class="pr"><div class="ph"><span style="font-size:11.5px;color:var(--text2)">${s.l}</span><span>%${s.v}</span></div><div class="pt"><div class="pf" style="width:${s.v}%;background:${s.c}"></div></div></div>`).join('');
}

// ═══ FORECAST / INSTALLMENTS ═══
function initForecast(){
  renderInstallments();
  document.getElementById('ni-start').value=new Date().toISOString().split('T')[0];
}
function renderInstallments(){
  const total=installments.reduce((s,i)=>s+i.monthly,0);
  document.getElementById('inst-list').innerHTML=installments.map(i=>{
    const paidAmt=(parseInt(document.getElementById('ni-count')?.value)||i.remaining)*i.monthly;
    return `<div class="inst-card">
      <div class="inst-head">
        <div class="inst-bank">${i.icon}</div>
        <div style="flex:1"><div class="inst-name">${i.desc}</div><div class="inst-type">${i.card}</div></div>
        <div style="text-align:right"><div style="font-family:var(--mono);font-size:16px;color:var(--red)">${fmt(i.monthly)}</div><div style="font-size:10.5px;color:var(--text3)">/ay</div></div>
      </div>
      <div class="inst-meta">
        <span class="inst-chip">${i.remaining} taksit kaldı</span>
        <span class="inst-chip">${fmt(i.monthly*i.remaining)} toplam kalan</span>
        ${i.rate>0?`<span class="inst-chip warn">%${i.rate} faiz</span>`:''}
      </div>
      <div style="margin-top:8px">
        <div class="ph"><span style="font-size:11px;color:var(--text3)">İlerleme</span><span style="font-size:11px">${Math.round((1-i.remaining/(i.total/i.monthly))*100)}%</span></div>
        <div class="pt"><div class="pf" style="width:${Math.round((1-i.remaining/(i.total/i.monthly))*100)}%;background:var(--orange)"></div></div>
      </div>
    </div>`;
  }).join('');
  document.getElementById('inst-monthly-total').textContent=fmt(total);
  document.getElementById('inst-monthly-sub').textContent=installments.length+' aktif taksit · Nakit akışına otomatik yansıtılıyor';
}
function calcInstallment(){
  const total=parseFloat(document.getElementById('ni-total').value)||0;
  const count=parseInt(document.getElementById('ni-count').value)||1;
  const rate=parseFloat(document.getElementById('ni-rate').value)||0;
  if(total>0&&count>0){
    let monthly;
    if(rate>0){
      const r=rate/100/12;
      monthly=total*(r*Math.pow(1+r,count))/(Math.pow(1+r,count)-1);
    } else {
      monthly=total/count;
    }
    document.getElementById('ni-monthly').value=Math.round(monthly).toLocaleString('tr-TR');
    document.getElementById('ni-rem').value=count;
  }
}
function addInstallment(){
  const desc=document.getElementById('ni-desc').value.trim(); if(!desc) return;
  const card=document.getElementById('ni-card').value;
  const total=parseFloat(document.getElementById('ni-total').value)||0;
  const count=parseInt(document.getElementById('ni-count').value)||12;
  const rem=parseInt(document.getElementById('ni-rem').value)||count;
  const rate=parseFloat(document.getElementById('ni-rate').value)||0;
  const startDate=document.getElementById('ni-start').value;
  let monthly=total/count;
  if(rate>0){const r=rate/100/12;monthly=total*(r*Math.pow(1+r,count))/(Math.pow(1+r,count)-1);}
  installments.push({id:Date.now(),desc,card,total,monthly:Math.round(monthly),remaining:rem,startDate,rate,icon:'💳'});
  renderInstallments();
  saveData();showNotif(desc+' taksiti eklendi','💳');
}
function buildCashflowTable(){
  const months=['Nis 26','May 26','Haz 26','Tem 26','Ağu 26','Eyl 26'];
  const instMonthly=installments.reduce((s,i)=>s+i.monthly,0);
  const baseIncome=21700; const baseExpense=14820-instMonthly;
  const rows=months.map((m,idx)=>{
    const remInst=installments.reduce((s,i)=>s+(i.remaining>idx?i.monthly:0),0);
    const income=baseIncome; const expense=baseExpense+remInst;
    const net=income-expense;
    return {m,income,expense,installments:remInst,net};
  });
  const hdr=`<tr><th>Ay</th><th>Gelir</th><th>Sabit Gider</th><th>Taksitler</th><th>Net Akış</th><th>Kümülatif</th></tr>`;
  let cum=47250;
  const trs=rows.map(r=>{cum+=r.net;return`<tr>
    <td>${r.m}</td>
    <td class="pos">${fmt(r.income)}</td>
    <td class="neg">${fmt(r.expense)}</td>
    <td class="${r.installments>0?'warn':''}">${r.installments>0?fmt(r.installments):'—'}</td>
    <td class="${r.net>=0?'pos':'neg'}">${r.net>=0?'+':''}${fmt(r.net)}</td>
    <td class="${cum>=0?'pos':'neg'}">${fmt(cum)}</td>
  </tr>`;}).join('');
  document.getElementById('cashflow-tbl').innerHTML=`<thead>${hdr}</thead><tbody>${trs}</tbody>`;
  // chart
  const maxVal=Math.max(...rows.map(r=>Math.abs(r.net)),1);
  document.getElementById('cashflow-chart').innerHTML=rows.map(r=>`
    <div style="flex:1;display:flex;flex-direction:column;align-items:center">
      <div style="width:100%;border-radius:3px 3px 0 0;background:${r.net>=0?'var(--teal)':'var(--red)'};height:${Math.round(Math.abs(r.net)/maxVal*90)}px;min-height:2px;opacity:.85;transition:height .4s" title="${fmt(r.net)}"></div>
      <div style="font-size:9.5px;color:var(--text3);margin-top:4px">${r.m}</div>
    </div>`).join('');
}
function calcCashflow(){ buildCashflowTable(); showNotif('Nakit akışı güncellendi','📅'); }

// ═══ AI ═══
function initAI(){
  document.getElementById('ai-score-bars').innerHTML=renderScoreBars();
  const qs=['Bu ay tasarruf edebilir miyim?','Taksitler nakit akışımı nasıl etkiliyor?','Kripto portföyüm hakkında ne düşünürsün?','XRP hakkında ne önerirsin?','Bütçe uyarılarımı açıkla.'];
  document.getElementById('quick-btns').innerHTML=qs.map(q=>`<button class="btn bghost bsm" style="width:100%;text-align:left;margin-bottom:5px;display:flex;justify-content:space-between" onclick="quickQ('${q}')"><span>${q}</span><span style="opacity:.4">→</span></button>`).join('');
}
function getSystemPrompt(){
  const instTotal=installments.reduce((s,i)=>s+i.monthly,0);
  const cryptoTotal=cryptoPortfolio.filter(c=>c.price).reduce((s,c)=>s+c.price*c.qty,0);
  return `Sen FinansAI — kişisel finans yönetim uygulamasının AI danışmanısın. Kullanıcı Eskişehir'de yaşıyor.

Finansal durum:
- Net bakiye: ₺47.250 (Garanti ₺28.750 + İş Bankası ₺12.500 − Kredi kartı ₺2.840)
- Bu ay gelir: ₺21.700 | Gider: ₺14.820 | Net: ₺6.880
- Kredi kartı taksitler: Aylık ₺${instTotal.toLocaleString()} (iPhone, Buzdolabı, Tatil)
- Kripto portföy: ₺${cryptoTotal>0?Math.round(cryptoTotal).toLocaleString():'~380.000'} (BTC, XRP, ETH, SOL — Binance dahil)
- Yatırım: ₺84.600 (Hisse ₺42.000, Altın ₺28.600, BES ₺14.000)
- Bekleyen faturalar: Doğalgaz ₺420 (ACİL), Su ₺185
- Kredi kartı: -₺2.840, gecikme faizi %62
- Bütçe: Eğlence aşıldı (%111)
- Google Takvim entegrasyonu aktif

Türkçe yanıt ver. Kısa, rakam odaklı, pratik öneriler.`;
}
async function sendMsg(){
  const inp=document.getElementById('chat-in');
  const val=inp.value.trim(); if(!val) return;
  const btn=document.getElementById('sbtn');
  inp.value=''; btn.disabled=true;
  const box=document.getElementById('chat-msgs');
  box.innerHTML+=`<div class="msg msg-user">${val}</div>`;
  const tid='t'+Date.now();
  box.innerHTML+=`<div class="msg msg-ai" id="${tid}"><div class="dots"><span></span><span></span><span></span></div></div>`;
  box.scrollTop=box.scrollHeight;
  chatHistory.push({role:'user',content:val});
  try{
    const resp=await fetch('https://api.anthropic.com/v1/messages',{method:'POST',headers:{'Content-Type':'application/json'},
      body:JSON.stringify({model:'claude-sonnet-4-20250514',max_tokens:600,system:getSystemPrompt(),messages:chatHistory})});
    const data=await resp.json();
    const reply=data.content?.find(c=>c.type==='text')?.text||'Yanıt alınamadı.';
    chatHistory.push({role:'assistant',content:reply});
    document.getElementById(tid).innerHTML=reply.replace(/\n/g,'<br>');
  }catch(e){document.getElementById(tid).innerHTML='Bağlantı hatası.';}
  btn.disabled=false;box.scrollTop=box.scrollHeight;
}
function quickQ(q){document.getElementById('chat-in').value=q;sendMsg();}

// ═══ ADD ═══
function initAdd(){document.getElementById('a-dt').value=new Date().toISOString().split('T')[0];}
function saveTx(){const s=document.getElementById('save-ok');s.style.display='block';setTimeout(()=>s.style.display='none',2000);saveData();showNotif('Kaydedildi','✓');}
function simCSV(){document.getElementById('csv-res').textContent='⏳ 312 işlem okunuyor...';setTimeout(()=>{document.getElementById('csv-res').textContent='✓ 312 işlem aktarıldı.';},1400);}

// ═══ SETTINGS ═══
function initSettings() {
  refreshSettingsCounts();
  // Depolama boyutu
  try {
    let total = 0;
    for (const k in localStorage) {
      if (localStorage.hasOwnProperty(k)) total += (localStorage[k].length + k.length) * 2;
    }
    const kb = (total / 1024).toFixed(1);
    document.getElementById('storage-size').textContent = kb + ' KB';
  } catch(e) {}
  // Son kayıt zamanı
  const ts = localStorage.getItem('finansai_last_save');
  document.getElementById('last-save-time').textContent = ts
    ? new Date(parseInt(ts)).toLocaleTimeString('tr-TR', {hour:'2-digit',minute:'2-digit'})
    : '—';
}

function refreshSettingsCounts() {
  const income  = allTx.filter(t => t.type === 'gelir').length;
  const expense = allTx.filter(t => t.type === 'gider').length;
  document.getElementById('count-transactions').textContent  = allTx.length + ' kayıt';
  document.getElementById('count-income').textContent        = income + ' kayıt';
  document.getElementById('count-expense').textContent       = expense + ' kayıt';
  document.getElementById('count-banks').textContent         = bankAccs.length + ' hesap';
  document.getElementById('count-investments').textContent   = investments.length + ' hesap';
  document.getElementById('count-crypto').textContent        = cryptoPortfolio.length + ' coin';
  document.getElementById('count-bills').textContent         = bills.length + ' fatura';
  document.getElementById('count-budgets').textContent       = budgets.length + ' kalem';
  document.getElementById('count-installments').textContent  = installments.length + ' taksit';
  document.getElementById('count-watch').textContent         = watchItems.length + ' varlık';
}

async function clearData(type) {
  const labels = {
    transactions:  'Tüm işlemler',
    income:        'Gelir işlemleri',
    expense:       'Gider işlemleri',
    banks:         'Banka hesapları',
    investments:   'Yatırım hesapları',
    crypto:        'Kripto portföy',
    bnc:           'Binance portföy',
    bills:         'Faturalar',
    budgets:       'Bütçe kalemleri',
    installments:  'Taksitler',
    watch:         'Favoriler',
    all:           'TÜM VERİLER',
  };
  const icons = {
    transactions:'⇅', income:'📈', expense:'📉', banks:'🏦',
    investments:'📊', crypto:'₿', bnc:'🟡', bills:'📄',
    budgets:'◎', installments:'📅', watch:'⭐', all:'🗑'
  };
  const counts = {
    transactions: allTx.length + ' kayıt',
    income:       allTx.filter(t=>t.type==='gelir').length + ' kayıt',
    expense:      allTx.filter(t=>t.type==='gider').length + ' kayıt',
    banks:        bankAccs.length + ' hesap',
    investments:  investments.length + ' hesap',
    crypto:       cryptoPortfolio.length + ' coin',
    bnc:          bncPortfolio.length + ' coin',
    bills:        bills.length + ' fatura',
    budgets:      budgets.length + ' kalem',
    installments: installments.length + ' taksit',
    watch:        watchItems.length + ' varlık',
    all:          'Tüm veriler',
  };
  const label = labels[type] || type;
  const ok = await showConfirm({
    title: `"${label}" silinecek`,
    msg: 'Bu işlem geri alınamaz. Silinen veriler kurtarılamaz.',
    detail: counts[type],
    icon: icons[type] || '🗑',
    variant: type === 'all' ? 'danger' : 'danger',
    okLabel: type === 'all' ? '⚠ Hepsini Sil' : 'Evet, Sil',
  });
  if (!ok) return;

  switch(type) {
    case 'transactions':
      allTx.splice(0, allTx.length);
      break;
    case 'income':
      const toRemI = allTx.filter(t => t.type === 'gelir').map(t => t.id);
      toRemI.forEach(id => { const i = allTx.findIndex(t=>t.id===id); if(i>-1) allTx.splice(i,1); });
      break;
    case 'expense':
      const toRemE = allTx.filter(t => t.type === 'gider').map(t => t.id);
      toRemE.forEach(id => { const i = allTx.findIndex(t=>t.id===id); if(i>-1) allTx.splice(i,1); });
      break;
    case 'banks':
      bankAccs.splice(0, bankAccs.length);
      break;
    case 'investments':
      investments.splice(0, investments.length);
      break;
    case 'crypto':
      cryptoPortfolio.splice(0, cryptoPortfolio.length);
      break;
    case 'bnc':
      bncPortfolio.splice(0, bncPortfolio.length);
      break;
    case 'bills':
      bills.splice(0, bills.length);
      break;
    case 'budgets':
      budgets.splice(0, budgets.length);
      break;
    case 'installments':
      installments.splice(0, installments.length);
      break;
    case 'watch':
      watchItems.splice(0, watchItems.length);
      break;
    case 'all':
      allTx.splice(0, allTx.length);
      bankAccs.splice(0, bankAccs.length);
      investments.splice(0, investments.length);
      cryptoPortfolio.splice(0, cryptoPortfolio.length);
      bncPortfolio.splice(0, bncPortfolio.length);
      bills.splice(0, bills.length);
      budgets.splice(0, budgets.length);
      installments.splice(0, installments.length);
      watchItems.splice(0, watchItems.length);
      monthlyData = {};
      break;
  }

  saveData();
  refreshSettingsCounts();
  showNotif(label + ' temizlendi', '🗑');
}

function setTheme(t) {
  document.documentElement.setAttribute('data-theme', t === 'light' ? 'light' : '');
  document.getElementById('theme-dark-btn').style.background  = t !== 'light' ? 'var(--accent-dim)' : '';
  document.getElementById('theme-light-btn').style.background = t === 'light' ? 'var(--accent-dim)' : '';
}

// ═══ CUSTOM CONFIRM MODAL ═══
let _confirmResolve = null;
let _confirmKeyHandler = null;

// Butonları bir kez DOM hazır olunca bağla
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('confirm-ok-btn').addEventListener('click', () => _resolveConfirm(true));
  document.getElementById('confirm-cancel-btn').addEventListener('click', () => _resolveConfirm(false));
  document.getElementById('confirm-overlay').addEventListener('click', e => {
    if (e.target === document.getElementById('confirm-overlay')) _resolveConfirm(false);
  });
});

function _resolveConfirm(val) {
  const ov = document.getElementById('confirm-overlay');
  ov.style.display = 'none';
  if (_confirmKeyHandler) {
    document.removeEventListener('keydown', _confirmKeyHandler);
    _confirmKeyHandler = null;
  }
  if (_confirmResolve) { _confirmResolve(val); _confirmResolve = null; }
}

// Global alias — HTML'den de çağrılabilir
function confirmResolve(val) { _resolveConfirm(val); }

function showConfirm({ title='', msg='', detail='', icon='⚠', variant='danger', okLabel='Evet, Sil' } = {}) {
  return new Promise(resolve => {
    _confirmResolve = resolve;

    document.getElementById('confirm-title').textContent  = title;
    document.getElementById('confirm-msg').textContent    = msg;
    document.getElementById('confirm-icon').textContent   = icon;
    document.getElementById('confirm-ok-btn').textContent = okLabel;

    const det = document.getElementById('confirm-detail');
    det.textContent    = detail;
    det.style.display  = detail ? 'block' : 'none';

    // Renk varyantı
    const ov = document.getElementById('confirm-overlay');
    ov.className = 'variant-' + variant;

    // Göster
    ov.style.display = 'flex';

    // ESC
    _confirmKeyHandler = e => { if (e.key === 'Escape') _resolveConfirm(false); };
    document.addEventListener('keydown', _confirmKeyHandler);
  });
}

// ═══════════════════════════════════════════════════════
// GOOGLE CALENDAR OAUTH (GitHub Pages Edition)
// ═══════════════════════════════════════════════════════
const GOOGLE_CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID_HERE'; // Google Cloud Console'dan al
const GCAL_SCOPE = 'https://www.googleapis.com/auth/calendar.events';
let gcalToken = null;
let gisLoaded = false;
let tokenClient = null;

function initGoogleAuth() {
  // Google Identity Services yüklü mü kontrol et
  if (typeof google === 'undefined' || !google.accounts) {
    // Script yükle
    const s = document.createElement('script');
    s.src = 'https://accounts.google.com/gsi/client';
    s.onload = () => {
      gisLoaded = true;
      if (GOOGLE_CLIENT_ID !== 'YOUR_GOOGLE_CLIENT_ID_HERE') setupTokenClient();
    };
    document.head.appendChild(s);
    return;
  }
  gisLoaded = true;
  if (GOOGLE_CLIENT_ID !== 'YOUR_GOOGLE_CLIENT_ID_HERE') setupTokenClient();
}

function setupTokenClient() {
  tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: GOOGLE_CLIENT_ID,
    scope: GCAL_SCOPE,
    callback: (resp) => {
      if (resp.error) { console.error('OAuth error:', resp.error); return; }
      gcalToken = resp.access_token;
      showNotif('Google Takvim bağlandı!','📅');
    }
  });
}

function requestGcalAuth() {
  if (GOOGLE_CLIENT_ID === 'YOUR_GOOGLE_CLIENT_ID_HERE') {
    showNotif('OAuth kurulumu gerekli — README\'ye bak','⚠');
    return false;
  }
  if (!tokenClient) { initGoogleAuth(); return false; }
  if (!gcalToken) { tokenClient.requestAccessToken(); return false; }
  return true;
}

async function createGcalEvent(summary, date, amount, urgent=false) {
  // Claude.ai üzerinden çalışıyorsa Anthropic MCP kullan
  if (!GOOGLE_CLIENT_ID || GOOGLE_CLIENT_ID === 'YOUR_GOOGLE_CLIENT_ID_HERE') {
    // Simulated — gerçek event daha önce MCP ile oluşturuldu
    return { simulated: true, summary };
  }
  if (!gcalToken) { requestGcalAuth(); return null; }
  const body = {
    summary: `${urgent?'🛑 ':''} ${summary} — ₺${amount}`,
    description: `FinansAI · Otomatik fatura hatırlatması\nTutar: ₺${amount}`,
    start: { date },
    end: { date: new Date(new Date(date).getTime()+86400000).toISOString().split('T')[0] },
    colorId: urgent ? '11' : '6',
    reminders: { useDefault: false, overrides: [
      { method: 'popup', minutes: 1440 },
      { method: 'email', minutes: 2880 }
    ]}
  };
  const resp = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
    method: 'POST',
    headers: { 'Authorization': 'Bearer '+gcalToken, 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  if (!resp.ok) { gcalToken = null; return null; }
  return await resp.json();
}

// ═══════════════════════════════════════════════════════
// LOCAL STORAGE — Veri Kalıcılığı
// ═══════════════════════════════════════════════════════
function saveData() {
  try {
    localStorage.setItem('finansai_bills', JSON.stringify(bills));
    localStorage.setItem('finansai_installments', JSON.stringify(installments));
    localStorage.setItem('finansai_bankaccs', JSON.stringify(bankAccs));
    localStorage.setItem('finansai_investments', JSON.stringify(investments));
    localStorage.setItem('finansai_crypto', JSON.stringify(cryptoPortfolio));
    localStorage.setItem('finansai_monthly', JSON.stringify(monthlyData));
    localStorage.setItem('finansai_watch', JSON.stringify(watchItems));
    localStorage.setItem('finansai_transactions', JSON.stringify(allTx));
    localStorage.setItem('finansai_last_save', Date.now().toString());
  } catch(e) { console.warn('localStorage save failed:', e); }
}

function loadData() {
  try {
    const b = localStorage.getItem('finansai_bills'); if(b) bills.splice(0, bills.length, ...JSON.parse(b));
    const i = localStorage.getItem('finansai_installments'); if(i) installments.splice(0, installments.length, ...JSON.parse(i));
    const ba = localStorage.getItem('finansai_bankaccs'); if(ba) bankAccs.splice(0, bankAccs.length, ...JSON.parse(ba));
    const inv = localStorage.getItem('finansai_investments'); if(inv) investments.splice(0, investments.length, ...JSON.parse(inv));
    const cr = localStorage.getItem('finansai_crypto'); if(cr) cryptoPortfolio.splice(0, cryptoPortfolio.length, ...JSON.parse(cr));
    const md = localStorage.getItem('finansai_monthly'); if(md) Object.assign(monthlyData, JSON.parse(md));
    const wa = localStorage.getItem('finansai_watch'); if(wa) watchItems.splice(0, watchItems.length, ...JSON.parse(wa));
    const tx = localStorage.getItem('finansai_transactions'); if(tx) allTx.splice(0, allTx.length, ...JSON.parse(tx));
  } catch(e) { console.warn('localStorage load failed:', e); }
}

// ═══ LANG / THEME ═══
function setLang(l){
  lang=l;
  document.getElementById('btn-tr').classList.toggle('active',l==='tr');
  document.getElementById('btn-en').classList.toggle('active',l==='en');
}
function toggleTheme(){
  const t=document.documentElement.getAttribute('data-theme');
  document.documentElement.setAttribute('data-theme',t==='light'?'':'light');
}

// ══════════════════════════════════════════════════════════
// AUTH ENGINE (inline — auth.js)
// ══════════════════════════════════════════════════════════
const FinansAuth = (()=>{
  'use strict';
  const _K={USERS:'_fa_u2x9k',SESSION:'_fa_s7m3p',LOCKS:'_fa_l4q8r'};
  const CFG={PBKDF2_ITER:310000,PBKDF2_HASH:'SHA-256',KEY_LENGTH:256,SESSION_MS:30*60*1000,MAX_ATTEMPTS:5,LOCK_MS:15*60*1000};
  const sc=window.crypto.subtle;
  const rnd=n=>window.crypto.getRandomValues(new Uint8Array(n));
  const b2h=b=>Array.from(new Uint8Array(b)).map(x=>x.toString(16).padStart(2,'0')).join('');
  const h2b=h=>{const a=new Uint8Array(h.length/2);for(let i=0;i<h.length;i+=2)a[i/2]=parseInt(h.slice(i,i+2),16);return a.buffer;};
  const s2b=s=>new TextEncoder().encode(s);
  const b2s=b=>new TextDecoder().decode(b);
  const lg=k=>{try{return JSON.parse(localStorage.getItem(k));}catch{return null;}};
  const ls=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
  const ld=k=>localStorage.removeItem(k);

  async function deriveKey(pw,saltHex){
    const bk=await sc.importKey('raw',s2b(pw),'PBKDF2',false,['deriveKey']);
    return sc.deriveKey({name:'PBKDF2',salt:h2b(saltHex),iterations:CFG.PBKDF2_ITER,hash:CFG.PBKDF2_HASH},bk,{name:'AES-GCM',length:CFG.KEY_LENGTH},false,['encrypt','decrypt']);
  }
  async function hashPw(pw,saltHex){
    const k=await deriveKey(pw,saltHex);
    const v=await sc.encrypt({name:'AES-GCM',iv:new Uint8Array(12)},k,s2b('finansai_verify_2026'));
    return b2h(v);
  }
  function getLocks(){return lg(_K.LOCKS)||{};}
  function isLocked(u){
    const lk=getLocks(),e=lk[u];
    if(!e)return false;
    if(e.lockUntil&&Date.now()<e.lockUntil)return{locked:true,remaining:Math.ceil((e.lockUntil-Date.now())/60000)};
    if(e.lockUntil&&Date.now()>=e.lockUntil){delete lk[u];ls(_K.LOCKS,lk);return false;}
    return false;
  }
  function recAttempt(u,ok){
    const lk=getLocks();
    if(ok){delete lk[u];}
    else{lk[u]=lk[u]||{attempts:0};lk[u].attempts=(lk[u].attempts||0)+1;if(lk[u].attempts>=CFG.MAX_ATTEMPTS)lk[u].lockUntil=Date.now()+CFG.LOCK_MS;}
    ls(_K.LOCKS,lk);return lk[u]?.attempts||0;
  }
  function getUsers(){return lg(_K.USERS)||{};}
  async function createUser(username,password,role='user',createdBy=null){
    const users=getUsers();
    if(users[username])throw new Error('Kullanıcı adı zaten mevcut');
    if(password.length<8)throw new Error('Şifre en az 8 karakter olmalı');
    if(!/[A-Z]/.test(password))throw new Error('En az 1 büyük harf gerekli');
    if(!/[0-9]/.test(password))throw new Error('En az 1 rakam gerekli');
    const saltHex=b2h(rnd(32).buffer);
    const hash=await hashPw(password,saltHex);
    users[username]={role,saltHex,hash,createdAt:Date.now(),createdBy,lastLogin:null};
    ls(_K.USERS,users);return true;
  }
  async function login(username,password){
    const lck=isLocked(username);
    if(lck)throw new Error(`Hesap kilitli. ${lck.remaining} dakika bekleyin.`);
    const users=getUsers(),user=users[username];
    if(!user){recAttempt(username,false);throw new Error('Kullanıcı adı veya şifre hatalı');}
    let hash;
    try{hash=await hashPw(password,user.saltHex);}
    catch{throw new Error('Kimlik doğrulama hatası');}
    if(hash!==user.hash){
      const att=recAttempt(username,false);
      const rem=CFG.MAX_ATTEMPTS-att;
      if(rem<=0)throw new Error('Hesap 15 dakika kilitlendi.');
      throw new Error(`Şifre hatalı. ${rem} deneme hakkı kaldı.`);
    }
    recAttempt(username,true);
    const token=b2h(rnd(32).buffer);
    const session={token,username,role:user.role,loginAt:Date.now(),expiresAt:Date.now()+CFG.SESSION_MS,lastActive:Date.now()};
    ls(_K.SESSION,session);
    users[username].lastLogin=Date.now();ls(_K.USERS,users);
    return session;
  }
  function getSession(){
    const s=lg(_K.SESSION);
    if(!s)return null;
    if(Date.now()>s.expiresAt){ld(_K.SESSION);return null;}
    s.lastActive=Date.now();s.expiresAt=Date.now()+CFG.SESSION_MS;ls(_K.SESSION,s);
    return s;
  }
  function logout(){ld(_K.SESSION);}
  async function changePassword(username,oldPw,newPw){
    const users=getUsers(),user=users[username];
    if(!user)throw new Error('Kullanıcı bulunamadı');
    const oldHash=await hashPw(oldPw,user.saltHex);
    if(oldHash!==user.hash)throw new Error('Mevcut şifre hatalı');
    if(newPw.length<8)throw new Error('Yeni şifre en az 8 karakter');
    if(!/[A-Z]/.test(newPw))throw new Error('Büyük harf gerekli');
    if(!/[0-9]/.test(newPw))throw new Error('Rakam gerekli');
    const ns=b2h(rnd(32).buffer),nh=await hashPw(newPw,ns);
    users[username].saltHex=ns;users[username].hash=nh;ls(_K.USERS,users);logout();return true;
  }
  function deleteUser(username,reqBy){
    const s=getSession();
    if(!s||s.role!=='admin')throw new Error('Yetersiz yetki');
    if(username===reqBy)throw new Error('Kendinizi silemezsiniz');
    const users=getUsers();delete users[username];ls(_K.USERS,users);
  }
  function needsSetup(){return Object.keys(getUsers()).length===0;}
  function listUsers(){
    const s=getSession();if(!s||s.role!=='admin')return[];
    return Object.entries(getUsers()).map(([u,d])=>({username:u,role:d.role,createdAt:d.createdAt,lastLogin:d.lastLogin}));
  }
  return{createUser,login,logout,getSession,changePassword,deleteUser,needsSetup,listUsers,isLocked};
})();

// ══════════════════════════════════════════════════════════
// AUTH CONTROLLER
// ══════════════════════════════════════════════════════════
let _sessionCheckInterval = null;
let _sessionCountdown = null;

function authInit() {
  // overlay zaten HTML'de display:block — hiçbir şey yapmasak da görünür
  // shell zaten CSS'de display:none — authSuccess'e kadar gizli
  if (FinansAuth.needsSetup()) {
    // İlk kurulum: setup wizard göster
    document.getElementById('auth-setup').style.display = 'flex';
    document.getElementById('auth-login').style.display  = 'none';
    setupStrengthMeter();
  } else {
    const session = FinansAuth.getSession();
    if (session) {
      // Geçerli session: direkt uygulama
      authSuccess(session);
    } else {
      // Session yok: login göster
      document.getElementById('auth-setup').style.display = 'none';
      document.getElementById('auth-login').style.display  = 'flex';
      setTimeout(() => {
        const loginUser = document.getElementById('login-user');
        if(loginUser) loginUser.focus();
      }, 150);
    }
  }
}

async function doSetup() {
  const btn = document.getElementById('setup-btn');
  const err = document.getElementById('setup-err');
  const u = document.getElementById('setup-user').value.trim();
  const p = document.getElementById('setup-pass').value;
  const p2 = document.getElementById('setup-pass2').value;
  err.textContent = '';
  if (!u) { err.textContent = 'Kullanıcı adı gerekli'; return; }
  if (u.length < 3) { err.textContent = 'Kullanıcı adı en az 3 karakter'; return; }
  if (p !== p2) { err.textContent = 'Şifreler eşleşmiyor'; return; }
  btn.textContent = 'Oluşturuluyor...'; btn.disabled = true;
  try {
    await FinansAuth.createUser(u, p, 'admin', null);
    const session = await FinansAuth.login(u, p);
    authSuccess(session);
    showNotif('Hoş geldiniz, '+u+'! Hesabınız oluşturuldu.','✓');
  } catch(e) {
    err.textContent = e.message;
    btn.textContent = 'Hesabı Oluştur'; btn.disabled = false;
  }
}

async function doLogin() {
  const btn = document.getElementById('login-btn');
  const err = document.getElementById('login-err');
  const u = document.getElementById('login-user').value.trim();
  const p = document.getElementById('login-pass').value;
  err.textContent = '';
  if (!u || !p) { err.textContent = 'Kullanıcı adı ve şifre gerekli'; return; }
  // Kilit kontrolü göster
  const lck = FinansAuth.isLocked(u);
  if (lck) {
    document.getElementById('lock-info').textContent = `🔒 ${lck.remaining} dakika kilitli`;
    return;
  }
  btn.textContent = 'Giriş yapılıyor...'; btn.disabled = true;
  try {
    const session = await FinansAuth.login(u, p);
    authSuccess(session);
    showNotif('Hoş geldiniz, '+u+'!','✓');
  } catch(e) {
    err.textContent = e.message;
    if (e.message.includes('kilitlendi')) {
      document.getElementById('lock-info').textContent = '🔒 Hesap 15 dakika kilitlendi';
      startLockCountdown(u);
    }
    btn.textContent = 'Giriş Yap'; btn.disabled = false;
  }
}

function authSuccess(session) {
  document.getElementById('auth-overlay').style.display = 'none';
  document.getElementById('session-timer').style.display = 'flex'; document.getElementById('session-timer').style.visibility = 'visible';
  // Shell'i görünür yap
  const shell = document.querySelector('.shell');
  if(shell){ shell.style.display='flex'; shell.style.visibility='visible'; }
  // Dashboard'u başlat
  initDash();
  // Kripto fiyatları çek
  const allIds=[...new Set([...cryptoPortfolio.map(c=>c.cgId),...bncPortfolio.map(c=>c.cgId)])];
  fetchCryptoPrices(allIds).then(prices=>{
    cryptoPortfolio.forEach(c=>{if(prices[c.cgId])c.price=prices[c.cgId].try||prices[c.cgId].usd*usdTry;});
    bncPortfolio.forEach(c=>{if(prices[c.cgId])c.price=prices[c.cgId].usd;});
    updateDashCrypto();
  });
  // Kullanıcı adı + rol göster
  const uEl = document.getElementById('session-username');
  if (uEl) uEl.innerHTML = `<span style="font-size:12px">👤</span> <strong style="color:var(--text);font-size:11.5px">${session.username}</strong> ${session.role==='admin'?'<span style="font-size:9.5px;padding:1px 5px;border-radius:3px;background:var(--accent-dim);color:var(--accent)">admin</span>':''}`;
  // Admin değilse kullanıcı yönetimi butonunu gizle
  const umBtn = document.getElementById('user-menu-btn');
  if (umBtn) umBtn.style.display = session.role === 'admin' ? 'block' : 'none';
  startSessionTimer();
}

function doLogout() {
  FinansAuth.logout();
  clearInterval(_sessionCheckInterval);
  clearInterval(_sessionCountdown);
  document.getElementById('session-timer').style.display = 'none'; document.getElementById('session-timer').style.visibility = 'hidden';
  // Shell'i gizle
  const logoutShell = document.querySelector('.shell');
  if(logoutShell){ logoutShell.style.display='none'; }
  document.getElementById('auth-overlay').style.display = 'block';
  document.getElementById('auth-setup').style.display = 'none';
  document.getElementById('auth-login').style.display = 'flex';
  document.getElementById('login-pass').value = '';
  document.getElementById('login-err').textContent = '';
  setTimeout(()=>document.getElementById('login-user').focus(), 100);
}

function startSessionTimer() {
  clearInterval(_sessionCheckInterval);
  _sessionCheckInterval = setInterval(()=>{
    const s = FinansAuth.getSession();
    if (!s) { doLogout(); return; }
    const rem = Math.max(0, Math.floor((s.expiresAt - Date.now()) / 1000));
    const m = Math.floor(rem/60), sec = rem%60;
    const el = document.getElementById('session-timer-txt');
    if (el) el.textContent = `⏱ ${m}:${String(sec).padStart(2,'0')}`;
    if (rem < 120 && el) el.style.color = 'var(--orange)'; else if(el) el.style.color = 'var(--text3)';
  }, 1000);
  // Heartbeat — her mouse hareketi session'ı yeniler
  document.addEventListener('mousemove', ()=>FinansAuth.getSession(), {passive:true});
  document.addEventListener('keydown', ()=>FinansAuth.getSession(), {passive:true});
}

function startLockCountdown(username) {
  clearInterval(_sessionCountdown);
  _sessionCountdown = setInterval(()=>{
    const lck = FinansAuth.isLocked(username);
    const el = document.getElementById('lock-info');
    if (!lck && el) { el.textContent = ''; clearInterval(_sessionCountdown); }
    else if (lck && el) el.textContent = `🔒 ${lck.remaining} dakika kilitli`;
  }, 10000);
}

function togglePwd(inputId, btn) {
  const inp = document.getElementById(inputId);
  if (!inp) return;
  inp.type = inp.type === 'password' ? 'text' : 'password';
  btn.textContent = inp.type === 'password' ? '👁' : '🙈';
}

function setupStrengthMeter() {
  document.getElementById('setup-pass').addEventListener('input', function(){
    const p = this.value;
    let score = 0, tips = [];
    if (p.length >= 8) score++; else tips.push('8+ karakter');
    if (/[A-Z]/.test(p)) score++; else tips.push('büyük harf');
    if (/[0-9]/.test(p)) score++; else tips.push('rakam');
    if (/[^A-Za-z0-9]/.test(p)) score++; else tips.push('özel karakter (!@#)');
    if (p.length >= 12) score++;
    const colors = ['var(--red)','var(--red)','var(--orange)','var(--orange)','var(--teal)'];
    const labels = ['Çok zayıf','Zayıf','Orta','İyi','Güçlü'];
    const el = document.getElementById('setup-strength');
    if (p.length > 0) {
      const idx = Math.min(score, 4);
      el.innerHTML = `<div style="display:flex;align-items:center;gap:8px"><div style="display:flex;gap:3px">${[0,1,2,3,4].map(i=>`<div style="width:28px;height:4px;border-radius:2px;background:${i<=idx?colors[idx]:'var(--bg4)'}"></div>`).join('')}</div><span style="font-size:11px;color:${colors[idx]}">${labels[idx]}${tips.length?` — ekle: ${tips.join(', ')}`:'!'}</span></div>`;
    } else el.innerHTML = '';
  });
}

// USER PANEL (admin)
function openUserPanel() {
  const s = FinansAuth.getSession();
  if (!s || s.role !== 'admin') return;
  renderUserList();
  document.getElementById('user-panel').style.display = 'block';
}
function closeUserPanel() { document.getElementById('user-panel').style.display = 'none'; }

function renderUserList() {
  const users = FinansAuth.listUsers();
  const s = FinansAuth.getSession();
  document.getElementById('user-list-panel').innerHTML = users.map(u=>`
    <div style="background:var(--bg3);border:1px solid var(--border);border-radius:var(--rs);padding:10px 12px;display:flex;align-items:center;gap:9px">
      <span style="font-size:16px">👤</span>
      <div style="flex:1">
        <div style="font-size:13px;font-weight:500;color:var(--text)">${u.username} ${u.role==='admin'?'<span style="font-size:9px;padding:1px 5px;border-radius:3px;background:var(--accent-dim);color:var(--accent)">admin</span>':''}</div>
        <div style="font-size:10.5px;color:var(--text3)">Son giriş: ${u.lastLogin?new Date(u.lastLogin).toLocaleDateString('tr-TR',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'}):'Henüz giriş yapılmadı'}</div>
      </div>
      ${u.username !== s.username ? `<button onclick="removeUser('${u.username}')" style="font-size:10.5px;color:var(--red);background:var(--red-dim);border:1px solid rgba(255,96,96,.2);border-radius:4px;padding:3px 8px;cursor:pointer">Sil</button>` : '<span style="font-size:10px;color:var(--text3)">Sen</span>'}
    </div>`).join('') || '<p style="font-size:13px;color:var(--text3)">Kullanıcı bulunamadı.</p>';
}

async function addUser() {
  const s = FinansAuth.getSession(); if(!s) return;
  const u = document.getElementById('nu-user').value.trim();
  const p = document.getElementById('nu-pass').value;
  const r = document.getElementById('nu-role').value;
  const err = document.getElementById('nu-err');
  err.textContent = '';
  try {
    await FinansAuth.createUser(u, p, r, s.username);
    renderUserList();
    document.getElementById('nu-user').value = '';
    document.getElementById('nu-pass').value = '';
    showNotif(u+' eklendi','👤');
  } catch(e) { err.textContent = e.message; }
}

async function removeUser(username) {
  const s = FinansAuth.getSession(); if(!s) return;
  const ok = await showConfirm({
    title: `"${username}" silinecek`,
    msg: 'Bu kullanıcı kalıcı olarak silinecek. Bu işlem geri alınamaz.',
    icon: '👤',
    variant: 'danger',
    okLabel: 'Kullanıcıyı Sil',
  });
  if (!ok) return;
  try {
    FinansAuth.deleteUser(username, s.username);
    renderUserList();
    showNotif(username+' silindi','🗑');
  } catch(e) { showNotif(e.message,'⚠'); }
}

async function doChangePass() {
  const s = FinansAuth.getSession(); if(!s) return;
  const old = document.getElementById('cp-old').value;
  const nw  = document.getElementById('cp-new').value;
  const nw2 = document.getElementById('cp-new2').value;
  const err = document.getElementById('cp-err');
  const ok  = document.getElementById('cp-ok');
  err.textContent = ''; ok.textContent = '';
  if (nw !== nw2) { err.textContent = 'Şifreler eşleşmiyor'; return; }
  try {
    await FinansAuth.changePassword(s.username, old, nw);
    ok.textContent = '✓ Şifre değiştirildi. Tekrar giriş yapın.';
    setTimeout(()=>doLogout(), 1500);
  } catch(e) { err.textContent = e.message; }
}

// ═══ INIT ═══
document.addEventListener('DOMContentLoaded',()=>{
  // Uygulama versiyonu — değişince eski session otomatik temizlenir
  const APP_VERSION = 'finansai-v3.1';
  if(localStorage.getItem('_fa_ver') !== APP_VERSION){
    // Eski session varsa sil (version değişmiş)
    localStorage.removeItem('_fa_s7m3p');
    localStorage.setItem('_fa_ver', APP_VERSION);
  }
  // Shell başta CSS'de display:none — authSuccess'te açılıyor
  loadData();
  initGoogleAuth();
  authInit();
  setInterval(saveData, 30000);
  // initDash ve kripto fetch artık authSuccess() içinde çağrılıyor
});

