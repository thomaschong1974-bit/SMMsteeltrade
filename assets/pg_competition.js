/* Export Competition page — year-to-date (H1) analysis from window.H1. */
(function(){
  'use strict';
  var H = window.H1, U = window.HU; if(!H || !U) return;
  var $ = function(id){ return document.getElementById(id); };
  var REPS = H.reps.slice().sort(function(a,b){ return H.C[b].x[0]-H.C[a].x[0]; });
  var SEL = REPS.slice(0, 22);
  var bubble=null, ts=null;
  var stateA='中国', stateB=null;

  /* destinations of an exporter (current & prior period) from corridor list */
  var DEST = {};
  H.cor.forEach(function(r){ (DEST[r[0]] = DEST[r[0]] || {})[r[1]] = [r[2], r[3], r[4]]; });
  function common(a, b){
    var da = DEST[a]||{}, db = DEST[b]||{}, rows=[], ta=0, tb=0, ca=0, cb=0;
    Object.keys(da).forEach(function(p){ ta += da[p][0]; });
    Object.keys(db).forEach(function(p){ tb += db[p][0]; });
    Object.keys(da).forEach(function(p){
      if(p===a || p===b || !db[p]) return;
      if(da[p][0] < 0.1 || db[p][0] < 0.1) return;
      ca += da[p][0]; cb += db[p][0];
      rows.push({p:p, a:da[p][0], ap:da[p][1], b:db[p][0], bp:db[p][1], fa:da[p][2], fb:db[p][2]});
    });
    rows.sort(function(x,y){ return (y.a+y.b)-(x.a+x.b); });
    var ova = ta? ca/ta*100 : 0, ovb = tb? cb/tb*100 : 0;
    return {rows:rows, n:rows.length, ova:ova, ovb:ovb, inten:(ova+ovb)/2};
  }
  function defaultB(){
    /* strongest head-to-head rival of China among the top exporters */
    var best=null, bi=-1;
    SEL.slice(0,12).forEach(function(c){ if(c==='中国') return; var k=common('中国',c); if(k.inten>bi){bi=k.inten; best=c;} });
    return best || SEL[1];
  }

  function insights(){
    var E = U.en(), C = H.C;
    var top3 = REPS.slice(0,3), sh3 = top3.reduce(function(s,c){ return s+C[c].xs[0]; },0);
    var cn = C['中国'], cnpp = cn ? cn.xs[0]-cn.xs[1] : 0;
    var ok = REPS.filter(function(c){ return !C[c].lx && C[c].x[1] >= 50; });
    var byD = ok.map(function(c){ return [c, C[c].x[0]-C[c].x[1], C[c].xy]; }).sort(function(a,b){ return b[1]-a[1]; });
    var up = byD.slice(0,3), dn = byD.slice(-3).reverse();
    /* most intense pair among top 10 */
    var bp=null, bv=-1, T=REPS.slice(0,10);
    for(var i=0;i<T.length;i++) for(var j=i+1;j<T.length;j++){ var k=common(T[i],T[j]); if(k.n>=10 && k.inten>bv){ bv=k.inten; bp=[T[i],T[j],k]; } }
    var f = function(x){ return '<span class="hi">'+U.nm(x[0])+' '+U.dv(x[1],E?2:0)+' '+U.unit()+'（'+U.pct(x[2],0)+'）</span>'; };
    var fe = function(x){ return '<span class="hi">'+U.nm(x[0])+' '+U.dv(x[1],2)+' Mt ('+U.pct(x[2],0)+')</span>'; };
    var cards = [
      [U.T('格局','Structure'), U.T(
        top3.map(U.nm).join('、')+'合计占 '+H.reps.length+' 国出口的 <span class="hi">'+sh3.toFixed(1)+'%</span>；中国份额 <span class="hi">'+cn.xs[0].toFixed(1)+'%</span>（'+U.pp(cnpp)+'）。',
        U.list(top3.map(U.nm))+' together ship <span class="hi">'+sh3.toFixed(1)+'%</span> of the '+H.reps.length+' reporters\' exports; China\'s share is <span class="hi">'+cn.xs[0].toFixed(1)+'%</span> ('+U.ppS(cnpp)+').')],
      [U.T('增量','Gainers'), U.T('增量居前：'+up.map(f).join('、')+'。', 'Largest gains: '+up.map(fe).join(', ')+'.')],
      [U.T('收缩','Decliners'), U.T('减量居前：'+dn.map(f).join('、')+'。', 'Largest declines: '+dn.map(fe).join(', ')+'.')],
      [U.T('正面竞争','Head-to-head'), bp ? U.T(
        '<span class="hi">'+U.nm(bp[0])+' vs '+U.nm(bp[1])+'</span> 竞争最激烈：共同目的地 '+bp[2].n+' 个，市场重合度分别为 '+bp[2].ova.toFixed(0)+'% 与 '+bp[2].ovb.toFixed(0)+'%。',
        '<span class="hi">'+U.nm(bp[0])+' vs '+U.nm(bp[1])+'</span> is the most intense rivalry: '+bp[2].n+' common destinations, overlap '+bp[2].ova.toFixed(0)+'% and '+bp[2].ovb.toFixed(0)+'%.') : '—']
    ];
    $('insBar').innerHTML = cards.map(function(c){ return '<div class="insight-card"><div class="insight-label">'+c[0]+'</div><div class="insight-text">'+c[1]+'</div></div>'; }).join('');
  }

  function drawBubble(){
    var E = U.en(), C = H.C, list = REPS.slice(0,16);
    $('s1t').textContent = U.T('出口竞争格局 — '+list.length+' 国气泡图', 'Export competition — '+list.length+'-country bubble chart');
    $('s1s').innerHTML = U.T('气泡大小 = 出口份额 | X 轴 = 出口量（万吨，对数轴）| Y 轴 = 同比（%）| '+U.cur()+' vs '+U.prev(),
      'Bubble size = export share | X = export volume (Mt, log scale) | Y = y/y growth (%) | '+U.cur()+' vs '+U.prev());
    var hot = function(c){ return c===stateA || c===stateB; };
    var ds = list.map(function(c){
      var d = C[c], low = d.lx;
      return { label: U.nm(c), low: low,
        data: [{ x: E ? Math.max(0.05, d.x[0]/100) : Math.max(5, d.x[0]), y: d.xy==null?0:d.xy, r: Math.max(5, Math.min(38, Math.sqrt(d.xs[0])*7)), q: d.x[0], sh: d.xs[0] }],
        backgroundColor: low ? 'rgba(148,163,184,0.18)' : (hot(c) ? 'rgba(192,0,0,0.72)' : 'rgba(100,149,237,0.5)'),
        borderColor: low ? '#94a3b8' : (hot(c) ? '#C00000' : '#6495ED'), borderWidth: low?1.5:1.5, borderDash: low?[4,3]:[] };
    });
    if(bubble){ bubble.destroy(); bubble=null; }
    bubble = new Chart($('bubbleChart').getContext('2d'), {
      type:'bubble', data:{datasets:ds},
      options:{ responsive:true, maintainAspectRatio:false, layout:{padding:{top:18,right:26,left:6}},
        plugins:{ legend:{display:false}, tooltip:{ callbacks:{ label:function(c){
          var d=c.dataset.data[0];
          return c.dataset.label+(c.dataset.low?(E?' (check data)':'（数据存疑）'):'')+(E?': ':'：')+U.vu(d.q)+' · '+(E?'y/y ':'同比 ')+U.pct(d.y)+' · '+(E?'share ':'份额 ')+d.sh.toFixed(1)+'%'; } } } },
        scales:{
          x:{ type:'logarithmic', title:{display:true, text:E?'Export volume, '+U.cur()+' (Mt · log scale)':U.cur()+'出口量（万吨 · 对数轴）', font:{size:11}, color:'#79808a'},
              grid:{color:'#f3f4f6'}, ticks:{font:{size:10}, color:'#79808a', callback:function(v){ return (E?[0.1,0.2,0.5,1,2,5,10,20,50,100]:[10,20,50,100,200,500,1000,2000,5000]).indexOf(v)>=0?v.toLocaleString('en-US'):''; }} },
          y:{ title:{display:true, text:E?'y/y growth (%)':'同比增速（%）', font:{size:11}, color:'#79808a'}, grid:{color:'#f3f4f6'},
              ticks:{font:{size:11}, color:'#79808a', callback:function(v){ return v+'%'; }} } },
        animation:{duration:500} },
      plugins:[{ id:'lbl', afterDatasetsDraw:function(chart){
        var c2=chart.ctx; c2.save(); c2.font='600 10px Inter,MiSans,PingFang SC,sans-serif'; c2.textAlign='center';
        var items=chart.data.datasets.map(function(d,i){ var el=chart.getDatasetMeta(i).data[0]; if(!el) return null; var p=el.getProps(['x','y'],true); return {l:d.label+(d.low?' ⚠':''), x:p.x, y:p.y, r:el.options.radius}; }).filter(Boolean).sort(function(a,b){ return b.r-a.r; });
        var placed=[], LH=12;
        items.forEach(function(it){ var w=c2.measureText(it.l).width, half=w/2+2, ty=it.y-it.r-4, g=0;
          var ov=function(t){ return placed.some(function(q){ return Math.abs(it.x-q.x)<(half+q.half) && Math.abs(t-q.ty)<LH; }); };
          while(ov(ty) && g<14){ ty-=LH; g++; } if(g>=14) ty=it.y+it.r+11;
          placed.push({x:it.x, ty:ty, half:half});
          c2.lineWidth=3; c2.strokeStyle='rgba(255,255,255,0.92)'; c2.strokeText(it.l,it.x,ty); c2.fillStyle='#16191d'; c2.fillText(it.l,it.x,ty); });
        c2.restore(); } }]
    });
  }

  function badge(v){ if(v==null) return '<span style="color:#79808a">—</span>'; return v>=0?'<span class="badge-up">&#9650; '+U.pct(v)+'</span>':'<span class="badge-dn">&#9660; '+U.pct(v)+'</span>'; }

  function col(el, c, isA){
    var d = H.C[c], E = U.en();
    var gx = Object.keys(d.gx).map(function(g){ return [g, d.gx[g][0]]; }).sort(function(a,b){ return b[1]-a[1]; });
    var tot = gx.reduce(function(s,x){ return s+x[1]; },0) || 1;
    var colors=['#C00000','#f59e0b','#3b82f6','#10b981','#6366f1','#ec4899'];
    var bars = gx.slice(0,6).map(function(x,i){ var p=(x[1]/tot*100);
      return '<div style="margin-bottom:6px"><div style="display:flex;justify-content:space-between;font-size:11px;color:#79808a;margin-bottom:2px"><span>'+U.pz(x[0])+'</span><span class="num">'+p.toFixed(1)+'%</span></div>'+
        '<div style="height:6px;background:#f3f4f6;border-radius:3px;overflow:hidden"><div style="height:100%;width:'+p.toFixed(1)+'%;background:'+colors[i]+';border-radius:3px"></div></div></div>'; }).join('');
    var rows = d.dest.slice(0,8).map(function(x){ var y=U.yoy(x[1],x[2]);
      return '<tr><td>'+U.nm(x[0])+'</td><td class="num" style="text-align:right">'+U.v(x[1])+'</td><td class="num '+U.cls(y)+'" style="text-align:right">'+(x[2]<0.5?U.T('新增','new'):U.pct(y,0))+'</td></tr>'; }).join('');
    el.innerHTML =
      '<div class="stat-card"><div class="stat-card-title">'+U.T(U.cur()+'出口量', 'Exports, '+U.cur())+(d.lx?U.warn():'')+'</div>'+
      '<div class="'+(isA?'stat-card-value red':'stat-card-value')+' num">'+U.v(d.x[0])+' <span style="font-size:16px;font-weight:500">'+U.unit()+'</span></div>'+
      '<div class="stat-card-sub">'+badge(d.xy)+' &nbsp;&middot;&nbsp; '+U.T('份额','share')+' <b>'+d.xs[0].toFixed(1)+'%</b> ('+U.ppS(d.xs[0]-d.xs[1])+')</div></div>'+
      '<div class="chart-box"><div class="chart-box-title">'+U.T('产品结构（'+U.cur()+'，%）','Product mix ('+U.cur()+', %)')+'</div>'+(bars||'—')+'</div>'+
      '<div class="chart-box"><div class="chart-box-title">'+U.T('主要目的地 Top 8（'+U.unit()+'，同比）','Top 8 destinations ('+U.unit()+', y/y)')+'</div>'+
      '<table style="width:100%;border-collapse:collapse;font-size:12px"><thead><tr style="border-bottom:1px solid #e5e7eb">'+
      '<th style="text-align:left;padding:4px 6px;color:#79808a;font-size:11px">'+U.T('目的地','Destination')+'</th>'+
      '<th style="text-align:right;padding:4px 6px;color:#79808a;font-size:11px">'+U.unit()+'</th>'+
      '<th style="text-align:right;padding:4px 6px;color:#79808a;font-size:11px">'+U.T('同比','y/y')+'</th></tr></thead><tbody>'+rows+'</tbody></table></div>';
  }

  function commonTable(a, b){
    var k = common(a, b), E = U.en(), aN=U.nm(a), bN=U.nm(b);
    var rows = k.rows.slice(0,15).map(function(r){
      var ya=U.yoy(r.a,r.ap), yb=U.yoy(r.b,r.bp), fast='';
      if(ya!=null && yb!=null){ fast = yb>ya ? '<span class="faster-badge faster-c2">'+U.T('B 更快','B faster')+'</span>' : '<span class="faster-badge faster-c1">'+U.T('A 更快','A faster')+'</span>'; }
      var ys=function(y,p){ return p<0.5?U.T('新增','new'):U.pct(y,0); };
      return '<tr><td>'+U.nm(r.p)+'</td><td>'+U.v(r.a)+'</td><td class="'+U.cls(ya)+'">'+ys(ya,r.ap)+'</td><td>'+U.v(r.b)+'</td><td class="'+U.cls(yb)+'">'+ys(yb,r.bp)+'</td><td>'+fast+'</td></tr>'; }).join('');
    $('commonSection').innerHTML = '<div class="common-section"><div class="common-header">'+
      '<div class="common-stat"><div class="common-stat-val">'+k.n+'</div><div class="common-stat-lbl">'+U.T('共同目的地','Common destinations')+'</div></div>'+
      '<div class="common-stat"><div class="common-stat-val">'+k.ova.toFixed(1)+'%</div><div class="common-stat-lbl">'+aN+U.T(' 重合度',' overlap')+'</div></div>'+
      '<div class="common-stat"><div class="common-stat-val">'+k.ovb.toFixed(1)+'%</div><div class="common-stat-lbl">'+bN+U.T(' 重合度',' overlap')+'</div></div>'+
      '<div class="common-stat"><div class="common-stat-val">'+k.inten.toFixed(1)+'%</div><div class="common-stat-lbl">'+U.T('综合竞争烈度','Competition intensity')+'</div></div></div>'+
      '<div style="padding:0 0 12px 0;overflow-x:auto"><table class="common-table"><thead><tr><th style="text-align:left">'+U.T('共同目的地（前 15）','Common destination (top 15)')+'</th>'+
      '<th>'+aN+' '+U.unit()+'</th><th>'+aN+U.T(' 同比',' y/y')+'</th><th>'+bN+' '+U.unit()+'</th><th>'+bN+U.T(' 同比',' y/y')+'</th><th>'+U.T('增速','Pace')+'</th></tr></thead><tbody>'+rows+'</tbody></table></div></div>';
    return k;
  }

  function tsChart(a, b){
    var E=U.en(), yrs=H.years.map(String).concat([H.per.cur.tag]);
    var da=H.C[a].yx.concat([null]), db=H.C[b].yx.concat([null]);
    var ha=[], hb=[]; yrs.forEach(function(){ ha.push(null); hb.push(null); });
    ha[ha.length-1]=H.C[a].x[0]; hb[hb.length-1]=H.C[b].x[0];
    var cv=function(arr){ return arr.map(function(v){ return v==null?null:(E?Math.round(v)/100:v); }); };
    $('tsTitle').textContent = U.T('年度出口量 2010–'+H.per.py+' 与 '+U.cur()+'（'+U.unit()+'）', 'Annual exports 2010–'+H.per.py+' and '+U.cur()+' ('+U.unit()+')');
    if(ts){ ts.destroy(); ts=null; }
    ts = new Chart($('tsChart').getContext('2d'), { type:'bar',
      data:{ labels: yrs.map(function(y){ return y===H.per.cur.tag ? (E?H.per.cur.en:y) : y; }), datasets:[
        {label:U.nm(a), data:cv(da), backgroundColor:'rgba(192,0,0,0.75)', borderRadius:2},
        {label:U.nm(b), data:cv(db), backgroundColor:'rgba(100,149,237,0.7)', borderRadius:2},
        {label:U.nm(a)+' · '+U.cur(), data:cv(ha), backgroundColor:'rgba(192,0,0,0.35)', borderColor:'#C00000', borderWidth:1.5, borderDash:[4,3], borderRadius:2},
        {label:U.nm(b)+' · '+U.cur(), data:cv(hb), backgroundColor:'rgba(100,149,237,0.3)', borderColor:'#6495ED', borderWidth:1.5, borderRadius:2} ]},
      options:{ responsive:true, maintainAspectRatio:false, plugins:{ legend:{position:'top', labels:{font:{size:11}, boxWidth:12}},
          tooltip:{ callbacks:{ label:function(c){ return c.dataset.label+': '+(c.parsed.y==null?'—':c.parsed.y.toLocaleString('en-US',{maximumFractionDigits:E?2:1}))+' '+U.unit(); } } } },
        scales:{ x:{grid:{display:false}, ticks:{font:{size:10}}}, y:{grid:{color:'#f3f4f6'}, ticks:{font:{size:10}}} } } });
  }

  function pressure(a, b, k){
    var E=U.en(), aN=U.nm(a), bN=U.nm(b);
    var bWins = k.rows.filter(function(r){ var ya=U.yoy(r.a,r.ap), yb=U.yoy(r.b,r.bp); return r.b>=1 && (r.bp<0.5 ? r.b>=2 : (yb!=null && ya!=null && yb-ya>=10)); }).sort(function(x,y){ return y.b-x.b; }).slice(0,6);
    var aWins = k.rows.filter(function(r){ var ya=U.yoy(r.a,r.ap), yb=U.yoy(r.b,r.bp); return r.a>=1 && (r.ap<0.5 ? r.a>=2 : (yb!=null && ya!=null && ya-yb>=10)); }).sort(function(x,y){ return y.a-x.a; }).slice(0,6);
    var row = function(r, who){ var ya=U.yoy(r.a,r.ap), yb=U.yoy(r.b,r.bp); var s=function(y,p){ return p<0.5?U.T('新增','new'):U.pct(y,0); };
      return '<tr><td><b>'+U.nm(r.p)+'</b>（'+(who==='b'?bN:aN)+' '+U.v(who==='b'?r.b:r.a)+'）</td><td>'+bN+' '+s(yb,r.bp)+' vs '+aN+' '+s(ya,r.ap)+'</td></tr>'; };
    $('pressGrid').innerHTML =
      '<div class="pressure-card"><div class="pressure-card-title"><div class="pressure-icon icon-red">!</div>'+aN+' vs '+bN+U.T(' 正面竞争',' head-to-head')+'</div>'+
      '<div class="pressure-text">'+U.T('两国共同出口 <b>'+k.n+' 个市场</b>；'+aN+'有 <b>'+k.ova.toFixed(1)+'%</b>、'+bN+'有 <b>'+k.ovb.toFixed(1)+'%</b> 的出口落在共同市场。',
        'The two share <b>'+k.n+' markets</b>; <b>'+k.ova.toFixed(1)+'%</b> of '+aN+'\'s and <b>'+k.ovb.toFixed(1)+'%</b> of '+bN+'\'s exports go to common markets.')+'</div>'+
      '<table class="mini-table"><tr><td>'+U.T('共同目的地数','Common destinations')+'</td><td><b>'+k.n+'</b></td></tr><tr><td>'+aN+U.T(' 重合度',' overlap')+'</td><td><b>'+k.ova.toFixed(1)+'%</b></td></tr>'+
      '<tr><td>'+bN+U.T(' 重合度',' overlap')+'</td><td><b>'+k.ovb.toFixed(1)+'%</b></td></tr><tr><td>'+U.T('综合竞争烈度','Competition intensity')+'</td><td><b>'+k.inten.toFixed(1)+'%</b></td></tr></table></div>'+
      '<div class="pressure-card"><div class="pressure-card-title"><div class="pressure-icon icon-amber">&#8593;</div>'+U.T(bN+' 跑赢 '+aN+' 的市场', 'Markets where '+bN+' outpaces '+aN)+'</div>'+
      '<div class="pressure-text">'+U.T('增速领先 10 个百分点以上或新开拓（量 ≥ 1 万吨）：','Growing 10+ pp faster or newly opened (≥ 0.01 Mt):')+'</div>'+
      '<table class="mini-table">'+(bWins.length?bWins.map(function(r){ return row(r,'b'); }).join(''):'<tr><td>—</td></tr>')+'</table></div>'+
      '<div class="pressure-card"><div class="pressure-card-title"><div class="pressure-icon icon-blue">&#8595;</div>'+U.T(aN+' 跑赢 '+bN+' 的市场', 'Markets where '+aN+' outpaces '+bN)+'</div>'+
      '<div class="pressure-text">'+U.T('增速领先 10 个百分点以上或新开拓（量 ≥ 1 万吨）：','Growing 10+ pp faster or newly opened (≥ 0.01 Mt):')+'</div>'+
      '<table class="mini-table">'+(aWins.length?aWins.map(function(r){ return row(r,'a'); }).join(''):'<tr><td>—</td></tr>')+'</table></div>';
  }

  function render(){
    var E=U.en();
    $('pgTitle').innerHTML = U.T('出口竞争','Export Competition')+'<span class="h1-per">'+U.cur()+' vs '+U.prev()+'</span>';
    $('s2t').textContent = U.T('出口国对比分析','Exporter comparison');
    $('s2s').textContent = U.T('选择两个出口国，自动计算共同目的地与竞争烈度（'+U.cur()+'）','Pick two exporters to compute common destinations and competition intensity ('+U.cur()+')');
    $('lblA').textContent = U.T('出口国 A','Exporter A'); $('lblB').textContent = U.T('出口国 B','Exporter B');
    $('s3t').textContent = U.T('出口压力判断','Competitive pressure');
    $('s3s').textContent = U.T('基于所选两国共同目的地数据的结构性结论','Structural read-out for the selected pair, based on common destinations');
    [$('selA'),$('selB')].forEach(function(s){ var v=s.value; s.innerHTML=''; SEL.forEach(function(c){ s.add(new Option(U.nm(c)+(H.C[c].lx?' ⚠':''), c)); }); if(v) s.value=v; });
    if(!stateB) stateB = defaultB();
    $('selA').value = stateA; $('selB').value = stateB;
    insights(); drawBubble();
    col($('colA'), stateA, true); col($('colB'), stateB, false);
    tsChart(stateA, stateB);
    var k = commonTable(stateA, stateB); pressure(stateA, stateB, k);
    $('pgNote').innerHTML = U.dqNote();
  }
  window.__compSel = function(){ stateA=$('selA').value; stateB=$('selB').value; render(); };
  window.__relang = function(){ try{ render(); }catch(e){ console.error(e); } };
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', render); else render();
})();
