/* Import Markets (destination) page — year-to-date (H1) analysis from window.H1 (importer-declared). */
(function(){
  'use strict';
  var H = window.H1, U = window.HU; if(!H || !U) return;
  var $ = function(id){ return document.getElementById(id); };
  var MK = H.reps.slice().sort(function(a,b){ return H.C[b].m[0]-H.C[a].m[0]; });
  var RANK = {}; MK.forEach(function(c,i){ RANK[c]=i+1; });
  var cur = '美国';
  var PALETTE=['#C00000','#2563eb','#059669','#d97706','#7c3aed','#0891b2','#be185d','#65a30d','#ea580c','#6366f1','#94a3b8'];
  var ch1=null, ch2=null, ch3=null;

  function market(c){
    var d=H.C[c], tc=d.m[0]||0, tp=d.m[1]||0;
    var src=d.src.map(function(s){ var sc=tc?s[1]/tc*100:0, sp=tp?s[2]/tp*100:0; return {p:s[0], c:s[1], pv:s[2], sc:sc, sp:sp, dl:sc-sp}; });
    var t3=src.slice(0,3).reduce(function(s,x){ return s+x.sc; },0);
    var rise=src.filter(function(s){ return s.dl>2; }).sort(function(a,b){ return b.dl-a.dl; });
    var fall=src.filter(function(s){ return s.dl<-2; }).sort(function(a,b){ return a.dl-b.dl; });
    return {d:d, src:src, t3:t3, rise:rise, fall:fall, hhi:d.hm[0]==null?null:Math.round(d.hm[0]*10000)};
  }
  function insights(){
    var ok=MK.filter(function(c){ return !H.C[c].lm && H.C[c].m[1]>=100; });
    var gy=ok.map(function(c){ return [c,H.C[c].my]; }).filter(function(x){ return x[1]!=null; }).sort(function(a,b){ return b[1]-a[1]; });
    var f=function(x){ return U.nm(x[0])+'（'+U.pct(x[1])+'）'; }, fe=function(x){ return U.nm(x[0])+' ('+U.pct(x[1])+')'; };
    var sw=ok.map(function(c){ var m=market(c); return (m.rise.length&&m.fall.length)?[c,m.fall[0],m.rise[0],Math.min(Math.abs(m.fall[0].dl),m.rise[0].dl)]:null; }).filter(Boolean).sort(function(a,b){ return b[3]-a[3]; }).slice(0,4);
    var conc=ok.map(function(c){ return [c, market(c).t3]; }).sort(function(a,b){ return b[1]-a[1]; }).slice(0,4);
    var A = U.en() ? [
      'Fastest-growing import markets: '+gy.slice(0,3).map(fe).join(', '),
      'Sharpest import contraction: '+gy.slice(-3).reverse().map(fe).join(', '),
      'Supplier-switching signals: '+sw.map(function(x){ return U.nm(x[0])+' (less '+U.nm(x[1].p)+', more '+U.nm(x[2].p)+')'; }).join(' | '),
      'Most concentrated sources (top-3 share): '+conc.map(function(x){ return U.nm(x[0])+' ('+x[1].toFixed(0)+'%)'; }).join(', ')
    ] : [
      '进口增长最快：'+gy.slice(0,3).map(f).join('、'),
      '进口收缩最明显：'+gy.slice(-3).reverse().map(f).join('、'),
      '供应商切换信号：'+sw.map(function(x){ return U.nm(x[0])+'（减少'+U.nm(x[1].p)+'、增加'+U.nm(x[2].p)+'）'; }).join(' | '),
      '来源最集中（前三来源份额）：'+conc.map(function(x){ return U.nm(x[0])+'（'+x[1].toFixed(0)+'%）'; }).join('、')
    ];
    $('insightItems').innerHTML = A.map(function(t){ return '<div class="insight-item"><div class="insight-dot"></div><span>'+t+'</span></div>'; }).join('');
  }
  function cards(c, m){
    var d=m.d, y=d.my, t1=m.src[0];
    var hc=m.hhi==null?'':(m.hhi>2500?'red':m.hhi>1500?'amber':'green');
    var hl=m.hhi==null?'—':U.T(m.hhi>2500?'高度集中':m.hhi>1500?'中度集中':'分散', m.hhi>2500?'Highly concentrated':m.hhi>1500?'Moderately concentrated':'Dispersed');
    $('cardsRow').innerHTML =
      '<div class="card"><div class="card-label">'+U.T(U.cur()+'进口量','Imports, '+U.cur())+'</div><div class="card-value">'+U.v(d.m[0])+'</div><div class="card-sub">'+U.unit()+' | '+U.prev()+': '+U.v(d.m[1])+'</div></div>'+
      '<div class="card"><div class="card-label">'+U.T('同比','y/y')+(d.lm?U.warn():'')+'</div><div class="card-value '+(y==null?'':(y>=0?'green':'red'))+'">'+U.pct(y)+'</div><div class="card-sub">'+U.cur()+' vs '+U.prev()+'</div></div>'+
      '<div class="card"><div class="card-label">'+U.T('最大来源','Largest source')+'</div><div class="card-value" style="font-size:16px">'+(t1?U.nm(t1.p):'—')+'</div><div class="card-sub">'+U.T('占比 ','Share ')+(t1?t1.sc.toFixed(1):0)+'%</div></div>'+
      '<div class="card"><div class="card-label">'+U.T('前三来源份额','Top-3 share')+'</div><div class="card-value">'+m.t3.toFixed(1)+'%</div><div class="card-sub">'+U.T('集中度','Concentration')+'</div></div>'+
      '<div class="card"><div class="card-label">HHI</div><div class="card-value '+hc+'">'+(m.hhi==null?'—':m.hhi)+'</div><div class="card-sub">'+hl+'</div></div>'+
      '<div class="card"><div class="card-label">'+U.T('进口排名','Import rank')+'</div><div class="card-value">#'+RANK[c]+'</div><div class="card-sub">'+U.T('按'+U.cur()+'进口量，'+MK.length+' 国','By '+U.cur()+' imports, of '+MK.length)+'</div></div>';
  }
  function srcBar(m){
    var s=m.src.slice(0,10);
    if(ch1){ ch1.destroy(); ch1=null; }
    ch1=new Chart($('sourceBarChart').getContext('2d'),{type:'bar',data:{labels:s.map(function(x){ return U.nm(x.p); }),datasets:[
      {label:U.T(U.cur()+'份额%','Share % '+U.cur()),data:s.map(function(x){ return +x.sc.toFixed(1); }),backgroundColor:'#C00000',borderRadius:3},
      {label:U.T(U.prev()+'份额%','Share % '+U.prev()),data:s.map(function(x){ return +x.sp.toFixed(1); }),backgroundColor:'#94a3b8',borderRadius:3}]},
      options:{indexAxis:'y',responsive:true,maintainAspectRatio:false,plugins:{legend:{position:'top',labels:{font:{size:11},boxWidth:12}},
        tooltip:{callbacks:{label:function(c){ return c.dataset.label+': '+c.parsed.x.toFixed(1)+'%'; }}}},
        scales:{x:{beginAtZero:true,ticks:{font:{size:10},callback:function(v){ return v+'%'; }},grid:{color:'#f3f4f6'}},y:{ticks:{font:{size:11}},grid:{display:false}}}}});
  }
  function signals(c, m){
    var mr=m.rise[0], mf=m.fall[0], has=!!(mr&&mf);
    $('switchTag').textContent = has?U.T('供应商切换','Source substitution'):U.T('来源稳定','Sources stable');
    $('switchTag').className='panel-tag '+(has?'tag-red':'tag-green');
    var item=function(l,v,s){ return '<div class="signal-item"><div class="signal-label">'+l+'</div><div class="signal-value"'+(v.length>8?' style="font-size:12px"':'')+'>'+v+'</div><div class="signal-sub">'+s+'</div></div>'; };
    $('signalGrid').innerHTML =
      item(U.T('份额上升最多','Largest share gain'), mr?U.nm(mr.p):'—', mr?U.ppS(mr.dl):'—')+
      item(U.T('份额下降最多','Largest share loss'), mf?U.nm(mf.p):'—', mf?U.ppS(mf.dl):'—')+
      item(U.T('份额上升来源','Rising sources'), m.rise.length?U.list(m.rise.slice(0,2).map(function(x){ return U.nm(x.p); })):'—', '&gt; +2pp')+
      item(U.T('份额下降来源','Falling sources'), m.fall.length?U.list(m.fall.slice(0,2).map(function(x){ return U.nm(x.p); })):'—', '&lt; −2pp');
    var v;
    if(has) v=U.T('<b>供应商切换信号：</b>'+U.nm(c)+'减少对<b>'+U.nm(mf.p)+'</b>的依赖（'+U.ppS(mf.dl)+'），同期增加自<b>'+U.nm(mr.p)+'</b>的采购（'+U.ppS(mr.dl)+'）。',
      '<b>Source-substitution signal:</b> '+U.nmp(c)+' is reducing reliance on <b>'+U.nm(mf.p)+'</b> ('+U.ppS(mf.dl)+') while buying more from <b>'+U.nm(mr.p)+'</b> ('+U.ppS(mr.dl)+').');
    else if(mr) v=U.T('来源格局相对稳定，<b>'+U.nm(mr.p)+'</b>份额提升（'+U.ppS(mr.dl)+'），未见明显切换。','The source mix is relatively stable; <b>'+U.nm(mr.p)+'</b> gained share ('+U.ppS(mr.dl)+') without a clear switch.');
    else v=U.T('来源结构保持稳定，各主要来源份额无显著变化。','Sources remain stable, with no significant shift among the main suppliers.');
    if(H.C[c].lm) v+='<br><span style="color:#b45309">'+U.T('⚠ 该国进口数据与贸易伙伴记录差异较大，结论仅供参考。','⚠ This market\'s import records differ materially from partner data; treat with caution.')+'</span>';
    $('switchVerdict').innerHTML=v;
  }
  function srcTable(m){
    var mx=Math.max.apply(null,m.src.map(function(s){ return s.sc; }).concat([1]));
    $('srcHead').innerHTML='<tr><th>#</th><th>'+U.T('来源国','Source')+'</th><th>'+U.curS()+'('+U.unit()+')</th><th>'+U.prevS()+'('+U.unit()+')</th><th>'+U.T('同比','y/y')+'</th><th>'+U.T('份额 ','Share ')+U.curS()+'</th><th>'+U.T('份额 ','Share ')+U.prevS()+'</th><th>'+U.T('份额变化','Share change')+'</th></tr>';
    $('sourceTableBody').innerHTML=m.src.map(function(s,i){
      var rc=i===0?'rank-1':i===1?'rank-2':i===2?'rank-3':'', dc=s.dl>1?'delta-up':s.dl<-1?'delta-down':'delta-flat', y=U.yoy(s.c,s.pv);
      return '<tr><td><span class="rank-num '+rc+'">'+(i+1)+'</span></td><td><b>'+U.nm(s.p)+'</b></td><td>'+U.v(s.c)+'</td><td>'+U.v(s.pv)+'</td><td class="'+U.cls(y)+'">'+(s.pv<0.5?U.T('新增','new'):U.pct(y,0))+'</td><td>'+s.sc.toFixed(1)+'%</td><td>'+s.sp.toFixed(1)+'%</td><td class="'+dc+'">'+U.ppS(s.dl)+'</td></tr>'; }).join('');
  }
  function hs(c){
    var d=H.C[c], tc=d.m[0]||1, tp=d.m[1]||1;
    var g=Object.keys(d.gm).map(function(k){ return {g:k, c:d.gm[k][0], p:d.gm[k][1]}; }).sort(function(a,b){ return b.c-a.c; });
    var top=g.slice(0,10);
    if(ch2){ ch2.destroy(); ch2=null; }
    ch2=new Chart($('hsDoughnut').getContext('2d'),{type:'doughnut',data:{labels:top.map(function(x){ return U.pz(x.g); }),datasets:[{data:top.map(function(x){ return U.en()?x.c/100:x.c; }),backgroundColor:PALETTE,borderWidth:1,borderColor:'#fff'}]},
      options:{responsive:true,maintainAspectRatio:false,cutout:'55%',plugins:{legend:{position:'right',labels:{font:{size:10},boxWidth:10}},
        tooltip:{callbacks:{label:function(x){ return x.label+': '+x.parsed.toLocaleString('en-US',{maximumFractionDigits:U.en()?2:1})+' '+U.unit(); }}}}}});
    $('hsHead').innerHTML='<tr><th>'+U.T('品类','Product')+'</th><th>'+U.curS()+'('+U.unit()+')</th><th>'+U.T('同比','y/y')+'</th><th>'+U.T('份额 ','Share ')+U.curS()+'</th><th>'+U.T('份额 ','Share ')+U.prevS()+'</th><th>'+U.T('变化','Change')+'</th></tr>';
    $('hsTableBody').innerHTML=g.map(function(x){ var sc=x.c/tc*100, sp=x.p/tp*100, dl=sc-sp, y=U.yoy(x.c,x.p);
      return '<tr><td>'+U.pz(x.g)+'</td><td>'+U.v(x.c)+'</td><td class="'+U.cls(y)+'">'+(x.p<0.5?U.T('新增','new'):U.pct(y,0))+'</td><td>'+sc.toFixed(1)+'%</td><td>'+sp.toFixed(1)+'%</td><td class="'+(dl>1?'delta-up':dl<-1?'delta-down':'delta-flat')+'">'+U.ppS(dl)+'</td></tr>'; }).join('');
  }
  function trend(c){
    var d=H.C[c], E=U.en(), yrs=H.years.map(String), vals=d.ym.slice();
    var labels=yrs.concat([E?H.per.cur.en:H.per.cur.tag]), data=vals.concat([d.m[0]]);
    if(ch3){ ch3.destroy(); ch3=null; }
    ch3=new Chart($('yearTrendChart').getContext('2d'),{type:'bar',data:{labels:labels,datasets:[{label:U.nm(c),data:data.map(function(v){ return E?Math.round(v)/100:v; }),
      backgroundColor:labels.map(function(y,i){ return i===labels.length-1?'rgba(192,0,0,0.45)':(y===String(H.per.py)?'#C00000':'#cbd5e1'); }),borderRadius:4}]},
      options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false},tooltip:{callbacks:{label:function(x){ return x.parsed.y.toLocaleString('en-US',{maximumFractionDigits:E?2:1})+' '+U.unit(); }}}},
        scales:{x:{ticks:{font:{size:11}},grid:{display:false}},y:{beginAtZero:true,ticks:{font:{size:10}},grid:{color:'#f3f4f6'}}}}});
  }
  function render(){
    $('hdrIns').textContent=U.T('核心发现 · '+U.cur()+' vs '+U.prev(),'Key findings · '+U.cur()+' vs '+U.prev());
    $('lblMk').textContent=U.T('选择进口市场','Import market');
    var sel=$('marketSelect'), v=sel.value||cur; sel.innerHTML='';
    MK.forEach(function(c){ sel.add(new Option(U.nm(c)+(H.C[c].lm?' ⚠':''), c)); }); sel.value=v; cur=v;
    $('rankBadge').textContent=U.T('进口排名 #','Import rank #')+RANK[cur];
    $('hSrc').textContent=U.T('来源国结构（'+U.curS()+' vs '+U.prevS()+'）','Source mix ('+U.curS()+' vs '+U.prevS()+')');
    $('hSig').textContent=U.T('来源替代信号','Source-substitution signal');
    $('hTbl').textContent=U.T('来源国明细表','Source detail'); $('tTbl').textContent=U.prevS()+' → '+U.curS();
    $('hHs').textContent=U.T('进口产品结构','Import product mix'); $('tHs').textContent=U.curS();
    $('hTr').textContent=U.T('年度进口趋势（2010–'+H.per.py+'）与 '+U.cur(),'Annual imports (2010–'+H.per.py+') and '+U.cur()); $('tTr').textContent=U.unit();
    insights();
    var m=market(cur); cards(cur,m); srcBar(m); signals(cur,m); srcTable(m); hs(cur); trend(cur);
    $('pgNote').innerHTML=U.dqNote();
  }
  window.switchMarket=function(c){ cur=c; render(); };
  window.__relang=function(){ try{ render(); }catch(e){ console.error(e); } };
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', render); else render();
})();
