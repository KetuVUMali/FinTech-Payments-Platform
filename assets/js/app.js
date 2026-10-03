/* FinTech Payments Platform - shared logic (vanilla JS) */
const $=(s,r=document)=>r.querySelector(s), ROOT=document.body.dataset.root||'';
const fmt=n=>'₹'+Math.round(n).toLocaleString('en-IN');
const THEMES=['light','dark','midnight','contrast'];
// Change theme and persist it
function setTheme(t){document.documentElement.dataset.theme=t;document.documentElement.dataset.bsTheme=t==='light'?'light':'dark';localStorage.setItem('fintech-theme',t);document.dispatchEvent(new Event('themechange'))}
function showToast(msg,type='success'){let c=$('#toasts');if(!c){c=document.createElement('div');c.id='toasts';c.className='toast-container position-fixed bottom-0 end-0 p-3';document.body.append(c)}
 const e=document.createElement('div');e.className=`toast align-items-center text-bg-${type} border-0`;e.setAttribute('role','status');e.innerHTML=`<div class="d-flex"><div class="toast-body">${msg}</div><button class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button></div>`;c.append(e);new bootstrap.Toast(e,{delay:2500}).show();e.addEventListener('hidden.bs.toast',()=>e.remove())}
const copyToClipboard=t=>navigator.clipboard.writeText(t).then(()=>showToast('Copied to clipboard'));
const themeMenu=()=>THEMES.map(t=>`<li><button class="dropdown-item text-capitalize" onclick="setTheme('${t}')">${t==='contrast'?'High Contrast':t}</button></li>`).join('');

/* Public layout: navbar + footer */
function publicLayout(){
 $('#nav').innerHTML=`<div class="bg-primary text-white text-center small py-2">Powering smarter payments for modern businesses · <a class="text-white fw-semibold" href="${ROOT}signup.html">Get started</a></div>
 <nav class="navbar navbar-expand-lg sticky-top bg-body border-bottom"><div class="container">
 <a class="navbar-brand fw-bold" href="${ROOT}index.html"><i class="bi bi-shield-check text-primary"></i> FinTech Payments</a>
 <button class="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#pn" aria-label="Toggle navigation"><span class="navbar-toggler-icon"></span></button>
 <div id="pn" class="collapse navbar-collapse"><ul class="navbar-nav me-auto">
 <li class="nav-item"><a class="nav-link" href="${ROOT}index.html#products">Products</a></li><li class="nav-item"><a class="nav-link" href="${ROOT}index.html#developers">Developers</a></li><li class="nav-item"><a class="nav-link" href="${ROOT}pricing.html">Pricing</a></li></ul>
 <div class="dropdown me-2"><button class="btn btn-sm btn-outline-secondary dropdown-toggle" data-bs-toggle="dropdown"><i class="bi bi-palette"></i> Theme</button><ul class="dropdown-menu dropdown-menu-end">${themeMenu()}</ul></div>
 <a class="btn btn-link text-body" href="${ROOT}login.html">Login</a><a class="btn btn-primary" href="${ROOT}signup.html">Get Started</a></div></div></nav>`;
 $('#foot').innerHTML=`<footer class="border-top py-5 mt-5"><div class="container"><div class="row g-4">
 <div class="col-md-4"><strong>FinTech Payments</strong><p class="text-muted small mt-2">Accept payments, manage transactions, automate payouts, and monitor financial performance from one platform.</p></div>
 <div class="col-6 col-md-2"><h6>Product</h6><a class="d-block small text-muted" href="${ROOT}index.html#products">Payments</a><a class="d-block small text-muted" href="${ROOT}pricing.html">Pricing</a></div>
 <div class="col-6 col-md-2"><h6>Developers</h6><a class="d-block small text-muted" href="${ROOT}index.html#developers">API</a><a class="d-block small text-muted" href="${ROOT}dashboard/webhooks.html">Webhooks</a></div>
 <div class="col-6 col-md-2"><h6>Account</h6><a class="d-block small text-muted" href="${ROOT}login.html">Login</a><a class="d-block small text-muted" href="${ROOT}dashboard/index.html">Dashboard demo</a></div>
 <div class="col-6 col-md-2"><span class="badge text-bg-success">All Systems Operational</span></div></div>
 <p class="small text-muted mt-4 mb-0">© 2026 FinTech Payments Platform</p></div></footer>`;
 if(window.AOS)AOS.init({duration:600,once:true});
 if($('#cRev'))drawHeroChart();
}

/* Demo data */
const NAMES=['Aarav Mehta','Neha Sharma','Rahul Verma','Priya Patel','Arjun Shah','Kavya Nair','Rohan Desai','Ananya Iyer','Vikram Singh','Meera Joshi'];
const METHODS=['UPI','Credit Card','Debit Card','Net Banking','Wallet','Bank Transfer'];
const PAGES={ // key:[title, id prefix, headers, statuses]
 transactions:['Transactions','TXN-20261003-',['Transaction ID','Customer','Amount','Method','Status','Date'],['Successful','Pending','Failed','Refunded','Disputed']],
 customers:['Customers','CUS-',['Customer ID','Name','Total Spent','Last Method','Status','Last Payment'],['Active','Active','Disabled']],
 'payment-links':['Payment Links','PL-',['Link','Customer','Amount','Type','Status','Expiry'],['Active','Expired','Active']],
 invoices:['Invoices','INV-2026-',['Invoice','Customer','Amount','Method','Status','Due Date'],['Paid','Pending','Overdue']],
 subscriptions:['Subscriptions','SUB-',['Subscription','Customer','Amount','Cycle','Status','Next Billing'],['Active','Trial','Cancelled','Active']],
 payouts:['Payouts','PO-',['Payout ID','Recipient','Amount','Method','Status','Date'],['Completed','Pending','Failed','Completed']],
 settlements:['Settlements','SET-',['Settlement ID','Bank Account','Amount','Method','Status','Initiated'],['Completed','Pending','Completed']],
 refunds:['Refunds','RF-',['Refund ID','Customer','Amount','Reason','Status','Date'],['Refunded','Pending','Refunded']],
 disputes:['Disputes','DSP-',['Dispute ID','Customer','Amount','Reason','Status','Deadline'],['Open','Under Review','Won','Lost']],
 'api-keys':['API Keys','key_',['Key ID','Name','Created By','Environment','Status','Created'],['Active','Revoked','Active']],
 webhooks:['Webhooks','wh_',['Endpoint ID','URL','Success Rate','Events','Status','Last Delivery'],['Active','Failing','Active']],
 team:['Team','USR-',['User ID','Name','Role','Email domain','Status','Last Active'],['Active','Invited','Active']],
 'audit-logs':['Audit Logs','LOG-',['Log ID','User','Action','Resource','Result','Timestamp'],['Success','Success','Failed']]};
const REASONS=['Duplicate charge','Product not received','Customer request','Fraud claim'],ROLES=['Owner','Admin','Finance','Developer','Analyst','Support'];
const ACTIONS=['Changed payout settings','Created API key','Exported report','Invited member'];
const dstr=i=>new Date(2026,9,3-i%28).toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'});
function makeRows(key,n=64){const p=PAGES[key][1],st=PAGES[key][3];return Array.from({length:n},(_,i)=>{const nm=NAMES[(i*7)%10],amt=(((i*7919)%98)+2)*250,s=st[i%st.length];
 const c={customers:[nm,amt*6,METHODS[i%6]],'api-keys':['Server '+(i%5+1),nm,i%2?'Test':'Live'],webhooks:['https://api.shop'+(i%9)+'.in/hooks',(95+i%5)+'%',(i%4+3)+' events'],team:[nm,ROLES[i%6],'company.in'],'audit-logs':[nm,ACTIONS[i%4],'Settings'],refunds:[nm,amt,REASONS[i%4]],disputes:[nm,amt,REASONS[i%4]],settlements:['HDFC ••'+(1000+i),amt*10,'NEFT']}[key]||[nm,amt,METHODS[i%6]];
 return [p+(1000+i),...c,s,dstr(i)]})}
const BADGE={Successful:'success',Completed:'success',Active:'success',Paid:'success',Won:'success',Success:'success',Pending:'warning','Under Review':'warning',Trial:'info',Invited:'info',Open:'info',Failed:'danger',Overdue:'danger',Lost:'danger',Failing:'danger',Revoked:'secondary',Cancelled:'secondary',Expired:'secondary',Disabled:'secondary',Refunded:'secondary',Disputed:'danger'};

/* Data table: search, filter, sort, paginate, export CSV */
function dataTable(el,key){const title=PAGES[key][0],heads=PAGES[key][2],st=PAGES[key][3];let rows=makeRows(key),q='',f='',sc=-1,asc=true,pg=1,cur=[];const per=8;
 el.innerHTML=`<div class="card"><div class="card-body d-flex flex-wrap gap-2">
 <input id="q" class="form-control w-auto flex-grow-1" style="max-width:320px" type="search" placeholder="Search ${title.toLowerCase()}…" aria-label="Search">
 <select id="f" class="form-select w-auto" aria-label="Status filter"><option value="">All statuses</option>${[...new Set(st)].map(s=>`<option>${s}</option>`).join('')}</select>
 <button id="ex" class="btn btn-outline-secondary ms-auto"><i class="bi bi-download"></i> Export CSV</button>
 <button id="nw" class="btn btn-primary"><i class="bi bi-plus-lg"></i> New</button></div>
 <div class="table-responsive"><table class="table table-hover mb-0"><thead><tr>${heads.map((h,i)=>`<th data-i="${i}">${h} <i class="bi bi-arrow-down-up small"></i></th>`).join('')}<th>Actions</th></tr></thead><tbody></tbody></table></div>
 <div class="card-footer d-flex justify-content-between align-items-center"><small id="info" class="text-muted"></small><ul class="pagination pagination-sm mb-0"></ul></div></div>`;
 const draw=()=>{let r=rows.filter(x=>(!f||x[x.length-2]===f)&&x.join(' ').toLowerCase().includes(q));
  if(sc>=0)r.sort((a,b)=>(a[sc]>b[sc]?1:-1)*(asc?1:-1));const pages=Math.max(1,Math.ceil(r.length/per));pg=Math.min(pg,pages);cur=r;
  $('tbody',el).innerHTML=r.length?r.slice((pg-1)*per,pg*per).map(x=>'<tr>'+x.map((c,i)=>i===x.length-2?`<td><span class="badge-soft text-bg-${BADGE[c]||'secondary'}">${c}</span></td>`:typeof c==='number'?`<td>${fmt(c)}</td>`:i===0?`<td><a href="#" class="cp fw-semibold text-decoration-none" title="Copy ID">${c}</a></td>`:`<td>${c}</td>`).join('')+'<td><button class="btn btn-sm btn-outline-secondary vw" data-r="'+rows.indexOf(x)+'">View</button> <button class="btn btn-sm btn-outline-danger dl" aria-label="Delete" data-r="'+rows.indexOf(x)+'"><i class="bi bi-trash"></i></button></td></tr>').join(''):`<tr><td colspan="9" class="text-center py-5 text-muted"><i class="bi bi-inbox fs-2 d-block"></i>No ${title.toLowerCase()} found</td></tr>`;
  el.querySelectorAll('tbody tr').forEach(tr=>tr.querySelectorAll('td').forEach((td,i)=>td.dataset.label=heads[i]||'Actions'));
  $('#info',el).textContent=`${r.length} results`;$('.pagination',el).innerHTML=Array.from({length:pages},(_,i)=>`<li class="page-item ${i+1===pg?'active':''}"><a class="page-link" href="#" data-p="${i+1}">${i+1}</a></li>`).join('')};
 el.addEventListener('click',e=>{const t=e.target,p=t.closest('[data-p]'),h=t.closest('th[data-i]'),c=t.closest('.cp'),v=t.closest('.vw');
  if(p||c)e.preventDefault();if(p){pg=+p.dataset.p;draw()}if(h){const i=+h.dataset.i;asc=sc===i?!asc:true;sc=i;draw()}
  if(c)copyToClipboard(c.textContent);if(v)detailDrawer(key,rows[+v.dataset.r]);const d=t.closest('.dl');if(d)confirmModal('Delete this record?','This action cannot be undone.',()=>{rows.splice(+d.dataset.r,1);draw();showToast('Record deleted','warning')})});
 $('#q',el).oninput=e=>{q=e.target.value.toLowerCase();pg=1;draw()};$('#f',el).onchange=e=>{f=e.target.value;pg=1;draw()};
 $('#nw',el).onclick=()=>formModal(key,r=>{rows.unshift(r);pg=1;draw();showToast(title.replace(/s$/,'')+' created successfully')});
 $('#ex',el).onclick=()=>{const csv=[heads,...cur].map(r=>r.join(',')).join('\n'),a=document.createElement('a');a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv'}));a.download=key+'.csv';a.click();showToast('CSV exported')};
 draw()}

/* Charts (rebuilt on theme change so labels stay readable) */
const css=v=>getComputedStyle(document.documentElement).getPropertyValue(v).trim();
let charts=[];const seed=(n,b)=>Array.from({length:n},(_,i)=>Math.round(b+b*.35*Math.sin(i/3)+((i*7919)%13)*b*.03));
const RANGES={'7D':7,'30D':30,'90D':45,'1Y':12};let range='30D';
function drawHeroChart(){charts.forEach(c=>c.destroy());const pr=css('--primary'),tx=css('--muted');charts=[new Chart($('#cRev'),{type:'line',data:{labels:seed(14,1).map((_,i)=>'D'+(i+1)),datasets:[{data:seed(14,150000),borderColor:pr,backgroundColor:pr+'22',fill:true,tension:.35}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{x:{ticks:{color:tx},grid:{display:false}},y:{ticks:{color:tx},grid:{color:css('--border')}}}}})]}
function drawCharts(){if(!$('#cStatus'))return drawHeroChart();charts.forEach(c=>c.destroy());charts=[];const tx=css('--muted'),gr=css('--border'),pr=css('--primary');
 const n=RANGES[range],lab=Array.from({length:n},(_,i)=>range==='1Y'?['Nov','Dec','Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct'][i]:'D'+(i+1));
 const sc={x:{ticks:{color:tx},grid:{color:gr}},y:{ticks:{color:tx},grid:{color:gr}}};
 charts.push(new Chart($('#cRev'),{type:'line',data:{labels:lab,datasets:[{label:'Revenue',data:seed(n,150000),borderColor:pr,backgroundColor:pr+'22',fill:true,tension:.35},{label:'Refunds',data:seed(n,9000),borderColor:'#dc2626',tension:.35}]},options:{responsive:true,maintainAspectRatio:false,scales:sc,plugins:{legend:{labels:{color:tx}}}}}));
 charts.push(new Chart($('#cStatus'),{type:'doughnut',data:{labels:['Successful 87%','Failed 5%','Pending 5%','Refunded 3%'],datasets:[{data:[87,5,5,3],backgroundColor:['#16a34a','#dc2626','#f59e0b','#64748b'],borderColor:css('--surface')}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{position:'bottom',labels:{color:tx}}}}}))}
function overview(el){const K=[['Total Revenue','₹48,52,320','+12.8%','wallet2'],['Successful Payments','₹42,31,120','+9.4%','check-circle'],['Failed Payments','₹2,31,450','-1.2%','x-circle'],['Refunds','₹1,21,200','+0.6%','arrow-return-left'],['Available Balance','₹8,42,120','+4.1%','bank'],['Pending Settlement','₹3,42,500','+2.3%','hourglass-split']];
 el.innerHTML=`<div class="row g-3 mb-3">${K.map(k=>`<div class="col-6 col-xl-4"><div class="card stat"><div class="card-body"><div class="d-flex justify-content-between text-muted small">${k[0]}<span class="icon-tile"><i class="bi bi-${k[3]}"></i></span></div><div class="v">${k[1]}</div><small class="${k[2][0]==='+'?'text-success':'text-danger'}"><i class="bi bi-arrow-${k[2][0]==='+'?'up':'down'}-right"></i> ${k[2]} vs last period</small></div></div></div>`).join('')}</div>
 <div class="d-flex flex-wrap gap-2 mb-3">${[['Accept Payment','credit-card'],['Payment Link','link-45deg'],['Invoice','receipt'],['Send Payout','send'],['Issue Refund','arrow-return-left']].map(a=>`<button class="btn btn-outline-secondary btn-sm" onclick="quickModal('${a[0]}')"><i class="bi bi-${a[1]}"></i> ${a[0]}</button>`).join('')}</div>
 <div class="row g-3 mb-3"><div class="col-lg-8"><div class="card"><div class="card-body"><div class="d-flex justify-content-between mb-2"><h2 class="h6">Revenue overview</h2><div class="btn-group btn-group-sm" id="rg">${Object.keys(RANGES).map(r=>`<button class="btn btn-outline-secondary ${r===range?'active':''}">${r}</button>`).join('')}</div></div><div class="chart-box"><canvas id="cRev" aria-label="Revenue chart" role="img"></canvas></div></div></div></div>
 <div class="col-lg-4"><div class="card h-100"><div class="card-body"><h2 class="h6">Payment status</h2><div class="chart-box"><canvas id="cStatus" aria-label="Payment status chart" role="img"></canvas></div></div></div></div></div>
 <h2 class="h6">Recent transactions</h2><div id="rt"></div>`;
 $('#rg').onclick=e=>{if(e.target.tagName==='BUTTON'){range=e.target.textContent;[...$('#rg').children].forEach(b=>b.classList.toggle('active',b===e.target));drawCharts()}};
 dataTable($('#rt'),'transactions');drawCharts()}

/* Dashboard shell: sidebar (offcanvas on mobile), topbar */
const ICONS={transactions:'arrow-left-right',customers:'people','payment-links':'link-45deg',invoices:'receipt',subscriptions:'arrow-repeat',payouts:'send',settlements:'bank',refunds:'arrow-return-left',disputes:'exclamation-triangle','api-keys':'key',webhooks:'braces',team:'person-gear','audit-logs':'journal-text'};
function dashLayout(){const cur=document.body.dataset.page,items=[['index','Overview','speedometer2'],...Object.keys(PAGES).map(k=>[k,PAGES[k][0],ICONS[k]])];
 if(localStorage.getItem('fintech-collapsed')==='1')document.body.classList.add('collapsed');
 document.body.insertAdjacentHTML('afterbegin',`<aside class="sidebar offcanvas-lg offcanvas-start" id="sb" tabindex="-1" aria-label="Main navigation"><div class="p-3 d-flex justify-content-between"><a href="index.html" class="text-white fw-bold text-decoration-none"><i class="bi bi-shield-check text-primary"></i> <span class="lbl">FinTech Payments</span></a><button class="btn-close btn-close-white d-lg-none" data-bs-dismiss="offcanvas" data-bs-target="#sb" aria-label="Close"></button></div>
 <nav class="nav flex-column px-2 gap-1 overflow-auto">${items.map(i=>`<a class="nav-link ${i[0]===cur?'active':''}" href="${i[0]}.html" title="${i[1]}"><i class="bi bi-${i[2]}"></i><span class="lbl">${i[1]}</span></a>`).join('')}<a class="nav-link mt-3" href="../index.html"><i class="bi bi-box-arrow-left"></i><span class="lbl">Logout</span></a></nav></aside>
 <div class="main"><header class="topbar px-3 py-2 d-flex align-items-center gap-2"><button class="btn btn-outline-secondary d-lg-none" data-bs-toggle="offcanvas" data-bs-target="#sb" aria-label="Open menu"><i class="bi bi-list"></i></button><button id="col" class="btn btn-outline-secondary d-none d-lg-block" aria-label="Collapse sidebar"><i class="bi bi-layout-sidebar"></i></button>
 <h1 class="h5 mb-0 ms-1">${cur==='index'?'Overview':PAGES[cur][0]}</h1><div class="ms-auto d-flex gap-2 align-items-center">
 <div class="dropdown"><button class="btn btn-outline-secondary" data-bs-toggle="dropdown" aria-label="Notifications"><i class="bi bi-bell"></i><span class="badge text-bg-danger ms-1">3</span></button><ul class="dropdown-menu dropdown-menu-end p-2" style="min-width:280px"><li class="small p-2"><strong>Payment received</strong><br>₹25,000 from Rahul Verma</li><li class="small p-2"><strong>Settlement completed</strong><br>₹1,25,000 settled</li><li class="small p-2"><strong>Security alert</strong><br>New API key generated</li></ul></div>
 <div class="dropdown"><button class="btn btn-outline-secondary" data-bs-toggle="dropdown" aria-label="Theme"><i class="bi bi-palette"></i></button><ul class="dropdown-menu dropdown-menu-end">${themeMenu()}</ul></div>
 <div class="dropdown"><button class="btn btn-primary" data-bs-toggle="dropdown" aria-label="Profile">KM</button><ul class="dropdown-menu dropdown-menu-end"><li class="dropdown-header">Ketan Mali · Admin</li><li><a class="dropdown-item" href="team.html">Team</a></li><li><a class="dropdown-item" href="../index.html">Logout</a></li></ul></div></div></header>
 <main class="p-3 p-lg-4" id="view"></main></div>`);
 $('#col').onclick=()=>{document.body.classList.toggle('collapsed');localStorage.setItem('fintech-collapsed',document.body.classList.contains('collapsed')?1:0)};
 cur==='index'?overview($('#view')):dataTable($('#view'),cur)}

/* Form validation */
function initForms(){document.querySelectorAll('form.needs-validation').forEach(f=>f.addEventListener('submit',e=>{e.preventDefault();f.classList.add('was-validated');if(f.checkValidity()){showToast('Success - redirecting…');setTimeout(()=>location.href=f.dataset.next,800)}}))}

Promise.all([window.libsReady,new Promise(r=>document.readyState==='loading'?document.addEventListener('DOMContentLoaded',r):r())]).then(()=>{setTheme(localStorage.getItem('fintech-theme')||'light');
 const l=document.body.dataset.layout;l==='public'?publicLayout():l==='dash'&&dashLayout();initForms()});
document.addEventListener('themechange',()=>{if($('#cRev'))drawCharts()});

/* ---------- Popups: modal, confirm, form, quick action, drawer ---------- */
function modal({title,body,footer='',icon='',tone='primary',size=''}){const id='m'+Date.now();
 document.body.insertAdjacentHTML('beforeend',`<div class="modal fade" id="${id}" tabindex="-1" aria-labelledby="${id}t" aria-hidden="true"><div class="modal-dialog modal-dialog-centered modal-dialog-scrollable ${size}"><div class="modal-content"><div class="modal-header border-0 pb-0"><div class="d-flex gap-3 align-items-center">${icon?`<span class="icon-tile text-${tone}"><i class="bi bi-${icon}"></i></span>`:''}<h2 class="modal-title h5 mb-0" id="${id}t">${title}</h2></div><button class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button></div><div class="modal-body">${body}</div><div class="modal-footer border-0">${footer}</div></div></div></div>`);
 const el=$('#'+id),m=new bootstrap.Modal(el);el.addEventListener('hidden.bs.modal',()=>el.remove());m.show();return {el,m}}
function confirmModal(title,msg,ok,label='Confirm Delete'){const {el,m}=modal({title,icon:'exclamation-triangle',tone:'danger',size:'modal-sm',body:`<p class="text-muted mb-0">${msg}</p>`,footer:`<button class="btn btn-outline-secondary" data-bs-dismiss="modal">Cancel</button><button class="btn btn-danger" id="ok">${label}</button>`});
 $('#ok',el).onclick=()=>{m.hide();ok()}}
// Generic create form built from the table's own columns, with validation
function formModal(key,cb){const [t,p,h,st]=PAGES[key],f=h.slice(1,-1),num=l=>/Amount|Spent/.test(l);
 const {el,m}=modal({title:'New '+t.replace(/s$/,''),icon:'plus-circle',body:`<form id="mf" novalidate>${f.map((l,i)=>`<div class="mb-3"><label class="form-label" for="f${i}">${l}</label>${i===f.length-1?`<select id="f${i}" class="form-select">${[...new Set(st)].map(x=>`<option>${x}</option>`).join('')}</select>`:`<input id="f${i}" class="form-control" required ${num(l)?'type="number" min="1" step="any"':''}><div class="invalid-feedback">${num(l)?'Enter a positive amount.':l+' is required.'}</div>`}</div>`).join('')}</form>`,
  footer:'<button class="btn btn-outline-secondary" data-bs-dismiss="modal">Cancel</button><button class="btn btn-primary" id="ok">Create</button>'});
 $('#ok',el).onclick=()=>{const fm=$('#mf',el);fm.classList.add('was-validated');if(!fm.checkValidity())return;
  cb([p+(2000+Math.floor(Math.random()*900)),...f.map((l,i)=>num(l)?+$('#f'+i,el).value:$('#f'+i,el).value),dstr(0)]);m.hide()}}
function quickModal(name){const {el,m}=modal({title:name,icon:'lightning-charge',body:`<form id="mf" novalidate><div class="mb-3"><label class="form-label" for="qc">Customer</label><select id="qc" class="form-select">${NAMES.map(n=>`<option>${n}</option>`).join('')}</select></div><div class="mb-3"><label class="form-label" for="qa">Amount (₹)</label><input id="qa" type="number" min="1" class="form-control" required><div class="invalid-feedback">Enter a positive amount.</div></div><div><label class="form-label" for="qd">Note</label><input id="qd" class="form-control" placeholder="Optional"></div></form>`,
  footer:`<button class="btn btn-outline-secondary" data-bs-dismiss="modal">Cancel</button><button class="btn btn-primary" id="ok">${name}</button>`});
 $('#ok',el).onclick=()=>{const fm=$('#mf',el);fm.classList.add('was-validated');if(!fm.checkValidity())return;m.hide();showToast(name+' completed for '+fmt(+$('#qa',el).value))}}
function detailDrawer(key,r){const t=PAGES[key][0],h=PAGES[key][2],s=r[r.length-2];
 document.body.insertAdjacentHTML('beforeend',`<div class="offcanvas offcanvas-end drawer" tabindex="-1" id="dr" aria-labelledby="drt"><div class="offcanvas-header"><div><small class="text-muted">${t.replace(/s$/,'')} details</small><h2 class="h5 mb-0" id="drt">${r[0]}</h2></div><button class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button></div><div class="offcanvas-body"><span class="badge-soft text-bg-${BADGE[s]||'secondary'}">${s}</span>
 <dl class="row mt-3 small">${h.slice(1).map((l,i)=>`<dt class="col-5 text-muted fw-normal">${l}</dt><dd class="col-7 fw-semibold">${typeof r[i+1]==='number'?fmt(r[i+1]):r[i+1]}</dd>`).join('')}</dl>
 <h3 class="h6 mt-4">Timeline</h3><ul class="timeline list-unstyled">${['Created','Authorized','Captured','Settlement processing'].map((x,i)=>`<li class="${i<3?'done':''}">${x}</li>`).join('')}</ul></div>
 <div class="p-3 border-top d-flex gap-2"><button class="btn btn-outline-secondary flex-fill" data-copy><i class="bi bi-clipboard"></i> Copy ID</button><button class="btn btn-primary flex-fill" data-dl><i class="bi bi-download"></i> Receipt</button></div></div>`);
 const el=$('#dr');$('[data-copy]',el).onclick=()=>copyToClipboard(r[0]);$('[data-dl]',el).onclick=()=>showToast('Receipt downloaded');
 el.addEventListener('hidden.bs.offcanvas',()=>el.remove());new bootstrap.Offcanvas(el).show()}
