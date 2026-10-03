/* Loads Bootstrap, Bootstrap Icons, Chart.js and AOS.
   Tries local assets/vendor first, then jsdelivr, cdnjs and unpkg, so one blocked CDN won't break the UI. */
(function(){
 const V=document.currentScript.src.replace(/js\/loader\.js.*/,'')+'vendor/', J='https://cdn.jsdelivr.net/npm/', C='https://cdnjs.cloudflare.com/ajax/libs/', U='https://unpkg.com/';
 const S={
  bcss:[V+'bootstrap.min.css',J+'bootstrap@5.3.3/dist/css/bootstrap.min.css',C+'bootstrap/5.3.3/css/bootstrap.min.css',U+'bootstrap@5.3.3/dist/css/bootstrap.min.css'],
  icons:[V+'bootstrap-icons/bootstrap-icons.min.css',J+'bootstrap-icons@1.11.3/font/bootstrap-icons.min.css',C+'bootstrap-icons/1.11.3/font/bootstrap-icons.min.css',U+'bootstrap-icons@1.11.3/font/bootstrap-icons.min.css'],
  aoscss:[V+'aos.css',J+'aos@2.3.4/dist/aos.css',C+'aos/2.3.4/aos.css',U+'aos@2.3.4/dist/aos.css'],
  bjs:[V+'bootstrap.bundle.min.js',J+'bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js',C+'bootstrap/5.3.3/js/bootstrap.bundle.min.js',U+'bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js'],
  chart:[V+'chart.umd.min.js',J+'chart.js@4.4.3/dist/chart.umd.min.js',C+'Chart.js/4.4.3/chart.umd.min.js',U+'chart.js@4.4.3/dist/chart.umd.js'],
  aosjs:[V+'aos.js',J+'aos@2.3.4/dist/aos.js',C+'aos/2.3.4/aos.js',U+'aos@2.3.4/dist/aos.js']};
 const anchor=document.querySelector('link[href*="style.css"]');
 const load=(list,make)=>new Promise(ok=>{let i=0;(function next(){if(i>=list.length)return ok(false);const el=make(list[i++]);el.onload=()=>ok(true);el.onerror=()=>{el.remove();next()}})()});
 const css=l=>load(l,u=>{const e=document.createElement('link');e.rel='stylesheet';e.href=u;anchor.before(e);return e});
 const js=l=>load(l,u=>{const e=document.createElement('script');e.src=u;document.head.append(e);return e});
 document.documentElement.style.visibility='hidden'; // avoid unstyled flash
 const all=Promise.all([css(S.bcss),css(S.icons),css(S.aoscss),js(S.bjs),js(S.chart),js(S.aosjs)]);
 window.libsReady=Promise.race([all,new Promise(r=>setTimeout(()=>r([false,false,false,false]),10000))]).then(r=>{
  document.documentElement.style.visibility='';
  if(!r[0]||!r[3])document.body.insertAdjacentHTML('afterbegin','<div style="background:#dc2626;color:#fff;padding:.6rem 1rem;font:14px sans-serif">Bootstrap could not be loaded. Check your internet connection, or for offline use run <b>npm install</b> then <b>node setup-vendor.js</b> in this folder.</div>');
 });
})();
