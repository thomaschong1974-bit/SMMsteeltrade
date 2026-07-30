/* ============================================================
   Shared bilingual engine (ZH ⇄ EN) for all sub-pages.
   Depends on assets/i18n_dict.js (window.__I18N).
   Terminology: mt, HRC/CRC, AD/CVD, Section 232, CBAM, safeguard, Mtpa.
   Unit note: 万吨 = 10 kt (10,000 mt); shown as “×10kt”.
   ============================================================ */
(function(){
'use strict';
var D = window.__I18N || {NAMES:{},PRODS:{},PROD_SHORT:{},UI:{}};
var NAMES=D.NAMES, PRODS=D.PRODS, PROD_SHORT=D.PROD_SHORT, UI=D.UI;

var lang=(function(){ try{ return localStorage.getItem('sp_lang')||'zh'; }catch(e){ return 'zh'; } })();

/* helpers exposed to page renderers */
window.TN  = function(n){ return lang==='en' ? (NAMES[n]||n) : n; };
window.TP  = function(g){ var p=PRODS[g]; return p ? (lang==='en'?p.en:p.zh) : (PROD_SHORT[g]|| String(g).replace(/\s*\(.*\)$/,'')); };
window.LGT = function(zh){ return lang==='en' ? (UI[zh]!==undefined?UI[zh]:zh) : zh; };
window.__tnLabel = window.TN;
window.SP_LANG = function(){ return lang; };
/* unified volume formatter: input in 万吨 (10kt). ZH -> "X 万吨"; EN -> Mt (or tonnes for small). */
window.fmtVol = function(wan, opt){
  wan = +wan || 0; opt = opt || {};
  if(lang!=='en'){
    return wan.toLocaleString('en-US',{minimumFractionDigits:opt.zhDec!=null?opt.zhDec:1,maximumFractionDigits:opt.zhDec!=null?opt.zhDec:1})+(opt.noUnit?'':' 万吨');
  }
  var mt = wan/100;                    /* 100 万吨 = 1 Mt */
  if(Math.abs(mt) >= 0.1 || mt===0){
    return mt.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2})+(opt.noUnit?'':' Mt');
  }
  return Math.round(wan*10000).toLocaleString('en-US')+(opt.noUnit?'':' t');   /* tonnes for small flows */
};
/* number only (no unit), converted: ZH keeps 万吨 number; EN returns Mt number (or tonnes) + which unit via fmtVolUnit */
window.fmtVolNum = function(wan){ return window.fmtVol(wan,{noUnit:true}); };
window.volUnit = function(){ return lang==='en' ? 'Mt' : '万吨'; };

function tName(t){
  if(NAMES[t]!==undefined) return NAMES[t];
  if(PROD_SHORT[t]!==undefined) return PROD_SHORT[t];
  if(PRODS[t]!==undefined) return (lang==='en'?PRODS[t].en:PRODS[t].zh);
  if(t==='台湾') return 'Taiwan';
  return null;
}
function translateFragment(raw){
  var t=raw.trim(); if(!t) return null;
  var val=null;
  if(UI[t]!==undefined) val=UI[t];
  else if((val=tName(t))!==null){}
  else if(/[→↔]/.test(t)){
    /* route like A→B or A↔B — translate each side */
    var sep=/↔/.test(t)?'↔':'→';
    var parts=t.split(sep).map(function(x){ var e=tName(x.trim()); return e!==null?e:x.trim(); });
    val=parts.join(sep);
  }
  else if(/^[\u{1F1E6}-\u{1F1FF}]{2}\s*/u.test(t)){
    /* flag emoji + country name */
    var m=t.match(/^([\u{1F1E6}-\u{1F1FF}]{2})\s*(.+)$/u);
    if(m){ var en=tName(m[2].trim()); if(en!==null) val=m[1]+' '+en; }
  }
  else if(t.indexOf('/')>0 && t.length<40){
    /* slash-joined country list like A/B/C — translate only if every part is a known name */
    var ps=t.split('/'), allN=true, tr=ps.map(function(x){ var e=tName(x.trim()); if(e===null){allN=false;return x.trim();} return e; });
    if(allN) val=tr.join('/');
  }
  if(val===null||val===undefined) return null;
  return raw.replace(t, val);
}
function walk(root){
  var it=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{
    acceptNode:function(n){
      var p=n.parentNode&&n.parentNode.nodeName;
      if(p==='SCRIPT'||p==='STYLE'||p==='TEXTAREA') return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    }});
  var n;
  while((n=it.nextNode())){
    if(n.__zh===undefined) n.__zh=n.nodeValue;
    if(lang==='zh'){ if(n.nodeValue!==n.__zh) n.nodeValue=n.__zh; continue; }
    var out=translateFragment(n.__zh);
    if(out!==null) n.nodeValue=out;
  }
  /* attributes: placeholder / title on inputs & elements */
  var els=root.querySelectorAll?root.querySelectorAll('[placeholder],[title]'):[];
  Array.prototype.forEach.call(els,function(el){
    ['placeholder','title'].forEach(function(a){
      if(!el.hasAttribute(a)) return;
      var key='__zh_'+a;
      if(el[key]===undefined) el[key]=el.getAttribute(a);
      if(lang==='zh'){ el.setAttribute(a, el[key]); return; }
      var v=el[key], t=v&&v.trim();
      if(t&&UI[t]!==undefined) el.setAttribute(a, v.replace(t,UI[t]));
    });
  });
}

function ensureBtn(){
  if(document.getElementById('langBtnFloat')) return;
  var b=document.createElement('button');
  b.id='langBtnFloat';
  b.textContent = lang==='en'?'中文':'EN';
  b.setAttribute('aria-label','Switch language / 切换语言');
  b.style.cssText='position:fixed;top:12px;right:14px;z-index:99999;'+
    'border:1px solid rgba(140,160,200,.35);background:rgba(15,20,34,.82);color:#e8edf6;'+
    'font:700 12px/1 Inter,system-ui,sans-serif;letter-spacing:.06em;padding:8px 13px;'+
    'border-radius:9px;cursor:pointer;backdrop-filter:blur(8px);box-shadow:0 6px 20px rgba(0,0,0,.35)';
  b.onmouseenter=function(){ b.style.background='#C00000'; b.style.borderColor='#C00000'; b.style.color='#fff'; };
  b.onmouseleave=function(){ b.style.background='rgba(15,20,34,.82)'; b.style.borderColor='rgba(140,160,200,.35)'; b.style.color='#e8edf6'; };
  b.onclick=window.__toggleLang;
  document.body.appendChild(b);
}

/* ---- generic chart label translator (ECharts + Chart.js) ---- */
function tStr(s){
  if(typeof s!=='string') return s;
  var t=s.trim(); if(!t) return s;
  if(UI[t]!==undefined && UI[t]!=='') return s.replace(t,UI[t]);
  var n=tName(t); if(n!==null) return s.replace(t,n);
  if(/[→↔]/.test(t)){
    var sep=/↔/.test(t)?'↔':'→', any=false;
    var parts=t.split(sep).map(function(x){ var e=tName(x.trim()); if(e!==null){any=true;return e;} return x.trim(); });
    if(any) return s.replace(t, parts.join(sep));
  }
  return s;
}
function translateEchartsOption(op){
  if(!op) return;
  function axis(a){ if(!a) return; (Array.isArray(a)?a:[a]).forEach(function(ax){
    if(ax&&Array.isArray(ax.data)) ax.data=ax.data.map(function(d){
      if(typeof d==='string') return tStr(d);
      if(d&&typeof d==='object'&&typeof d.value==='string'){ d.value=tStr(d.value); }
      return d;
    });
  }); }
  axis(op.xAxis); axis(op.yAxis);
  if(op.legend){ (Array.isArray(op.legend)?op.legend:[op.legend]).forEach(function(lg){
    if(lg&&Array.isArray(lg.data)) lg.data=lg.data.map(function(d){ return typeof d==='string'?tStr(d):(d&&d.name?(d.name=tStr(d.name),d):d); });
  }); }
  if(Array.isArray(op.series)) op.series.forEach(function(se){
    if(!se) return;
    if(typeof se.name==='string') se.name=tStr(se.name);
    if(Array.isArray(se.data)) se.data=se.data.map(function(d){
      if(d&&typeof d==='object'&&typeof d.name==='string') d.name=tStr(d.name);
      return d;
    });
  });
  if(op.title){ (Array.isArray(op.title)?op.title:[op.title]).forEach(function(ti){
    if(ti&&typeof ti.text==='string') ti.text=tStr(ti.text);
    if(ti&&typeof ti.subtext==='string') ti.subtext=tStr(ti.subtext);
  }); }
}
function relangCharts(){
  if(lang!=='en') return;   /* zh: pages already hold Chinese; a page reload restores it */
  /* ECharts */
  if(window.echarts){
    document.querySelectorAll('div,section,canvas').forEach(function(el){
      try{
        var inst=echarts.getInstanceByDom(el);
        if(!inst||inst.__i18n) return;
        var op=inst.getOption();
        translateEchartsOption(op);
        inst.setOption(op,{notMerge:false,lazyUpdate:false});
        inst.__i18n=true;
      }catch(e){}
    });
  }
  /* Chart.js */
  if(window.Chart&&Chart.instances){
    Object.keys(Chart.instances).forEach(function(k){
      try{
        var c=Chart.instances[k]; if(!c||c.__i18n) return;
        var d=c.config.data;
        if(d&&Array.isArray(d.labels)) d.labels=d.labels.map(tStr);
        if(d&&Array.isArray(d.datasets)) d.datasets.forEach(function(ds){ if(typeof ds.label==='string') ds.label=tStr(ds.label); });
        var o=c.config.options;
        if(o&&o.plugins&&o.plugins.title&&typeof o.plugins.title.text==='string') o.plugins.title.text=tStr(o.plugins.title.text);
        c.update(); c.__i18n=true;
      }catch(e){}
    });
  }
}
/* clear the "translated" flag so a re-render after user interaction gets re-translated */
function resetChartFlags(){
  if(window.echarts) document.querySelectorAll('div,section,canvas').forEach(function(el){ try{var i=echarts.getInstanceByDom(el); if(i) i.__i18n=false;}catch(e){} });
  if(window.Chart&&Chart.instances) Object.keys(Chart.instances).forEach(function(k){ try{Chart.instances[k].__i18n=false;}catch(e){} });
}

function apply(){
  document.documentElement.lang = lang==='en'?'en':'zh-CN';
  document.body.classList.toggle('en', lang==='en');
  walk(document.body);
  var fb=document.getElementById('langBtnFloat'); if(fb) fb.textContent = lang==='en'?'中文':'EN';
  /* let pages re-render charts/tables in the new language */
  if(window.__relang) try{ window.__relang(); }catch(e){}
  try{ document.querySelectorAll('[data-wan]').forEach(function(el){ el.textContent = window.fmtVolNum(el.getAttribute('data-wan')); }); }catch(e){}
  walk(document.body);   /* re-walk to translate labels in freshly re-rendered content */
  resetChartFlags();
  setTimeout(relangCharts, 60);
  setTimeout(relangCharts, 400);
  document.dispatchEvent(new CustomEvent('sp-lang',{detail:{lang:lang}}));
}
window.__tf=translateFragment;
window.__setLang=function(l){ lang=(l==='en'?'en':'zh'); try{ localStorage.setItem('sp_lang',lang); }catch(e){} apply(); };
window.__toggleLang=function(){ window.__setLang(lang==='en'?'zh':'en'); };

/* re-translate dynamically injected nodes */
var mo=new MutationObserver(function(muts){
  if(lang!=='en') return;
  for(var i=0;i<muts.length;i++){
    var m=muts[i];
    for(var j=0;j<m.addedNodes.length;j++){
      var nd=m.addedNodes[j];
      if(nd.nodeType===1) walk(nd);
      else if(nd.nodeType===3){
        nd.__zh=nd.nodeValue;
        var out=translateFragment(nd.nodeValue);
        if(out!==null) nd.nodeValue=out;
      }
    }
  }
});

var reT=null;
function scheduleChartRelang(){
  if(lang!=='en') return;
  clearTimeout(reT);
  reT=setTimeout(function(){ resetChartFlags(); relangCharts(); }, 260);
}
function ensureFont(){
  if(document.getElementById('sp-misans')) return;
  var st=document.createElement('style'); st.id='sp-misans';
  st.textContent="@font-face{font-family:'MiSans';src:local('MiSans'),local('MiSans VF'),local('MiSans-Regular');font-weight:100 900;font-display:swap}"+
    "body,button,input,select,textarea,table,th,td,h1,h2,h3,h4,h5,div,span,p,a{font-family:'MiSans','MiSans VF','PingFang SC','Microsoft YaHei',system-ui,-apple-system,'Segoe UI',sans-serif !important}";
  document.head.appendChild(st);
}
function boot(){
  ensureFont();
  ensureBtn();
  mo.observe(document.body,{childList:true,subtree:true});
  /* re-translate canvas charts after user interactions rebuild them */
  document.addEventListener('change', scheduleChartRelang, true);
  document.addEventListener('click', scheduleChartRelang, true);
  setTimeout(apply,0);
  setTimeout(function(){ if(lang==='en'){ walk(document.body); relangCharts(); } }, 700);
  setTimeout(function(){ if(lang==='en') relangCharts(); }, 1400);
}
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot);
else boot();
})();
