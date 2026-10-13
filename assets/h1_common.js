/* Shared helpers for the year-to-date analysis pages (reads window.H1 from h1_data.js).
   All visible text is produced here in the active language, so pages do not depend on the dictionary. */
(function(){
  'use strict';
  var H = window.H1; if(!H) return;
  var U = window.HU = {};
  U.en = function(){ return window.SP_LANG ? SP_LANG()==='en' : document.body.classList.contains('en'); };
  U.T = function(zh, en){ return U.en() ? en : zh; };
  U.nm = function(c){ if(!c) return '—'; return U.en() ? (H.en[c] || (window.TN?TN(c):c)) : c; };
  var THE={'United States':1,'United Kingdom':1,'Netherlands':1,'Philippines':1,'UAE':1,'Czech Republic':1,'Dominican Republic':1};
  U.nmp = function(c){ var n=U.nm(c); return (U.en() && THE[n]) ? 'the '+n : n; };
  U.pz = function(g){ var p = H.pz[g]; return p ? (U.en()?p[1]:p[0]) : (window.TP?TP(g):String(g).replace(/\s*\(.*\)$/,'')); };
  U.cur = function(){ return U.en()?H.per.cur.en:H.per.cur.zh; };
  U.prev = function(){ return U.en()?H.per.prev.en:H.per.prev.zh; };
  U.curS = function(){ return U.en()?H.per.cur.en:H.per.cur.tag; };
  U.prevS = function(){ return U.en()?H.per.prev.en:H.per.prev.tag; };
  U.unit = function(){ return U.en()?'Mt':'万吨'; };
  /* volume in 万吨 -> display (EN: Mt) */
  U.v = function(w, d){ if(w==null||isNaN(w)) return '—'; var x=U.en()?w/100:w; var k=(d==null?(U.en()?2:1):d);
    return x.toLocaleString('en-US',{minimumFractionDigits:k,maximumFractionDigits:k}); };
  U.vu = function(w, d){ return U.v(w,d)+' '+U.unit(); };
  U.dv = function(w, d){ if(w==null||isNaN(w)) return '—'; return (w>=0?'+':'−')+U.v(Math.abs(w),d); };
  U.pct = function(v, d){ if(v==null||isNaN(v)) return '—'; d=(d==null?1:d); return (v>=0?'+':'−')+Math.abs(v).toFixed(d)+'%'; };
  U.sn = function(v, d){ if(v==null||isNaN(v)) return '—'; return (v>=0?'+':'−')+Math.abs(v).toFixed(d==null?3:d); };
  U.pp = function(v){ if(v==null||isNaN(v)) return '—'; return (v>=0?'+':'−')+Math.abs(v).toFixed(1)+(U.en()?' pp':'个百分点'); };
  U.ppS = function(v){ if(v==null||isNaN(v)) return '—'; return (v>=0?'+':'−')+Math.abs(v).toFixed(1)+'pp'; };
  U.yoy = function(c, p){ return (p && p>0.5) ? (c/p-1)*100 : null; };
  U.cls = function(v){ return v==null?'':(v>=0?'up':'dn'); };
  U.list = function(arr){ arr=arr.filter(Boolean); if(!U.en()) return arr.join('、'); if(arr.length<2) return arr.join(''); return arr.slice(0,-1).join(', ')+' and '+arr[arr.length-1]; };
  /* low-confidence marker */
  U.lowX = function(c){ return !!(H.C[c] && H.C[c].lx); };
  U.lowM = function(c){ return !!(H.C[c] && H.C[c].lm); };
  U.warn = function(kind){ return '<span class="dq-flag" title="'+U.T('该数据与贸易伙伴记录差异较大，仅供参考，不参与排名与结论','Differs materially from partner records; shown for reference only, excluded from rankings and conclusions')+'">⚠ '+U.T('数据存疑','check data')+'</span>'; };
  U.esc = function(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;'); };
  U.flagPair = function(e,p){ for(var i=0;i<H.cor.length;i++){ var r=H.cor[i]; if(r[0]===e&&r[1]===p) return r[4]; } return ''; };
  /* footer note shared by the pages */
  U.dqNote = function(){
    var lx=Object.keys(H.dq.lowx), lm=Object.keys(H.dq.lowm);
    return U.T(
      '数据来源：Global Trade Tracker（GTT）、各国海关，SMM 整理。口径：报告国申报（不含镜像数据），'+H.reps.length+' 个主要报告国；'+U.cur()+'对比'+U.prev()+'。'+
      '数据质控：已剔除 '+H.dq.excluded+' 个未获贸易伙伴记录印证的异常数据点（合计约 '+(H.dq.excluded_kt/10).toFixed(0)+' 万吨）；'+
      (lx.length?'出口数据与伙伴记录差异较大的 '+lx.join('、')+'，':'')+(lm.length?'进口数据存疑的 '+lm.join('、')+'，':'')+
      '仅展示、不参与排名与结论。详见「方法论 · 数据质量」。',
      'Source: Global Trade Tracker (GTT), national customs; compiled by SMM. Basis: reporter-declared (mirror data excluded), '+H.reps.length+' major reporters; '+U.cur()+' vs '+U.prev()+'. '+
      'Data quality: '+H.dq.excluded+' outlier data points not corroborated by partner records were removed (about '+(H.dq.excluded_kt/1000).toFixed(1)+' Mt). '+
      (lx.length?'Export records of '+lx.map(U.nm).join(', ')+' and ':'')+(lm.length?'import records of '+lm.map(U.nm).join(', ')+' ':'')+
      'differ materially from partner data and are shown for reference only, not ranked or used in conclusions. See Methodology · Data quality.');
  };
  /* style for the flag chip (injected once) */
  if(!document.getElementById('h1-style')){
    var st=document.createElement('style'); st.id='h1-style';
    st.textContent='.dq-flag{display:inline-block;font-size:10.5px;font-weight:700;color:#b45309;background:#fff7e6;border:1px solid #f5d38a;border-radius:10px;padding:0 6px;margin-left:6px;white-space:nowrap;vertical-align:middle}'+
      '.h1-note{font-size:11.5px;color:#8a919c;line-height:1.65;margin:22px 0 4px;padding-top:12px;border-top:1px solid #eef0f2}'+
      '.h1-per{display:inline-block;font-size:11px;font-weight:700;color:#C00000;background:#fdf2f2;border:1px solid #f3caca;border-radius:12px;padding:1px 9px;margin-left:8px;vertical-align:middle}'+
      '.up{color:#1f9d6b}.dn{color:#C00000}';
    document.head.appendChild(st);
  }
})();
