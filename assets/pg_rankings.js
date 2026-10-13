/* Global Rankings page — year-to-date (H1) rankings from window.H1. */
(function(){
  'use strict';
  var H = window.H1, U = window.HU; if(!H || !U) return;
  var $ = function(id){ return document.getElementById(id); };
  var C = H.C, R = H.reps, active = 'exp-rank', grp = null;
  var PANELS = [
    ['exp','exp-rank','01',['出口国排名','Exporters']], ['exp','exp-growth','05',['出口增速排名','Export growth']], ['exp','share-up','07',['份额提升排名','Share gainers']], ['exp','share-dn','08',['份额下降排名','Share losers']],
    ['imp','imp-rank','02',['进口国排名','Importers']], ['imp','imp-growth','06',['进口增速排名','Import growth']],
    ['net','net-exp','03',['净出口国排名','Net exporters']], ['net','net-imp','04',['净进口国排名','Net importers']],
    ['bil','bilateral-vol','09',['流向量排名','Largest corridors']], ['bil','bilateral-up','10',['流向增长排名','Growing corridors']], ['bil','bilateral-dn','11',['流向下降排名','Shrinking corridors']],
    ['prd','product-rank','12',['品种出口排名','Products']], ['prd','product-country','13',['品种 × 出口国','Product × exporter']]
  ];
  var CATS = {exp:['出口类','Exports'], imp:['进口类','Imports'], net:['净贸易','Net trade'], bil:['双边流向','Corridors'], prd:['品种','Products']};
  var badge = function(v, d){ if(v==null||isNaN(v)) return '—'; var c=v>0?'badge-up':v<0?'badge-dn':'badge-flat'; return '<span class="'+c+'">'+(v>0?'+':v<0?'−':'')+Math.abs(v).toFixed(d==null?1:d)+(d===0?'':'')+'</span>'; };
  var bp = function(v){ return v==null||isNaN(v)?'—':'<span class="'+(v>0?'badge-up':v<0?'badge-dn':'badge-flat')+'">'+U.pct(v)+'</span>'; };
  var rk = function(i){ return '<td class="'+(i===0?'rank rank-1':i===1?'rank rank-2':i===2?'rank rank-3':'rank')+'">'+(i+1)+'</td>'; };
  function table(id, rows, cols){
    $(id).innerHTML='<thead><tr>'+cols.map(function(c){ return '<th class="'+(c.cls||'')+'">'+c.l+'</th>'; }).join('')+'</tr></thead><tbody>'+
      rows.map(function(r,i){ return '<tr>'+cols.map(function(c){ return c.k==='rank'?rk(i):'<td class="'+(c.cls||'')+'">'+c.f(r,i)+'</td>'; }).join('')+'</tr>'; }).join('')+'</tbody>';
  }
  var cn = function(c, flow){ return U.nm(c)+((flow==='x'&&C[c].lx)||(flow==='m'&&C[c].lm)?U.warn():''); };
  var A = function(){ var cur=U.curS(), prv=U.prevS(), un=U.unit();
    return {cur:cur, prv:prv, un:un, rank:{k:'rank', l:'#'}, ctry:{l:U.T('国家','Country')} }; };

  function shell(){
    var E=U.en(), sb='', tb='', pn='';
    Object.keys(CATS).forEach(function(k){
      sb+='<div class="sb-cat">'+U.T(CATS[k][0],CATS[k][1])+'</div>';
      PANELS.filter(function(p){ return p[0]===k; }).forEach(function(p){ sb+='<a class="sb-item'+(p[1]===active?' active':'')+'" data-panel="'+p[1]+'" onclick="__rkShow(\''+p[1]+'\')"><span class="sb-num">'+p[2]+'</span>'+U.T(p[3][0],p[3][1])+'</a>'; });
    });
    PANELS.slice().sort(function(a,b){ return a[2]-b[2]; }).forEach(function(p){ tb+='<button class="tab-btn'+(p[1]===active?' active':'')+'" data-panel="'+p[1]+'" onclick="__rkShow(\''+p[1]+'\')">'+p[2]+' '+U.T(p[3][0],p[3][1])+'</button>'; });
    $('rkSide').innerHTML=sb; $('tabBar').innerHTML=tb;
  }
  var H2 = function(id, zh, en, pz, pe){ $('h-'+id).innerHTML=U.T(zh,en)+'<span class="h1-per">'+U.cur()+'</span>'; $('d-'+id).textContent=U.T(pz,pe); };

  function render(){
    var E=U.en(), a=A(), totX=H.tot.x, totM=H.tot.m;
    shell();
    var X=R.slice().sort(function(p,q){ return C[q].x[0]-C[p].x[0]; }), M=R.slice().sort(function(p,q){ return C[q].m[0]-C[p].m[0]; });
    /* 01 exporters */
    H2('exp-rank','出口国排名','Exporters','按'+U.cur()+'出口量降序，含同比与份额（'+R.length+' 个报告国合计 = 100%）。','Ranked by '+U.cur()+' exports, with y/y and share ('+R.length+' reporters = 100%).');
    table('t-exp-rank', X, [a.rank, {l:a.ctry.l, f:function(c){ return cn(c,'x'); }}, {l:a.cur+' ('+a.un+')', cls:'r', f:function(c){ return U.v(C[c].x[0]); }}, {l:a.prv+' ('+a.un+')', cls:'r', f:function(c){ return U.v(C[c].x[1]); }}, {l:U.T('同比','y/y'), cls:'r', f:function(c){ return bp(C[c].xy); }}, {l:U.T('份额','Share'), cls:'r', f:function(c){ return C[c].xs[0].toFixed(1)+'%'; }}]);
    /* 02 importers */
    H2('imp-rank','进口国排名','Importers','按'+U.cur()+'进口量降序（进口国自报）。','Ranked by '+U.cur()+' imports (importer-declared).');
    table('t-imp-rank', M, [a.rank, {l:a.ctry.l, f:function(c){ return cn(c,'m'); }}, {l:a.cur+' ('+a.un+')', cls:'r', f:function(c){ return U.v(C[c].m[0]); }}, {l:a.prv+' ('+a.un+')', cls:'r', f:function(c){ return U.v(C[c].m[1]); }}, {l:U.T('同比','y/y'), cls:'r', f:function(c){ return bp(C[c].my); }}, {l:U.T('份额','Share'), cls:'r', f:function(c){ return C[c].ms[0].toFixed(1)+'%'; }}]);
    /* 03/04 net */
    var net=function(c,i){ return (C[c].x[i]||0)-(C[c].m[i]||0); };
    H2('net-exp','净出口国排名','Net exporters','出口 − 进口 > 0 的国家，按'+U.cur()+'净出口降序。','Countries with exports above imports, ranked by '+U.cur()+' net exports.');
    table('t-net-exp', R.filter(function(c){ return net(c,0)>0; }).sort(function(p,q){ return net(q,0)-net(p,0); }), [a.rank, {l:a.ctry.l, f:function(c){ return U.nm(c); }}, {l:U.T('净出口 ','Net exports ')+a.cur, cls:'r', f:function(c){ return U.v(net(c,0)); }}, {l:U.T('净出口 ','Net exports ')+a.prv, cls:'r', f:function(c){ return U.v(net(c,1)); }}, {l:U.T('出口','Exports'), cls:'r', f:function(c){ return U.v(C[c].x[0]); }}, {l:U.T('进口','Imports'), cls:'r', f:function(c){ return U.v(C[c].m[0]); }}]);
    H2('net-imp','净进口国排名','Net importers','进口 − 出口 > 0 的国家，按'+U.cur()+'净进口降序。','Countries with imports above exports, ranked by '+U.cur()+' net imports.');
    table('t-net-imp', R.filter(function(c){ return net(c,0)<0; }).sort(function(p,q){ return net(p,0)-net(q,0); }), [a.rank, {l:a.ctry.l, f:function(c){ return U.nm(c); }}, {l:U.T('净进口 ','Net imports ')+a.cur, cls:'r', f:function(c){ return U.v(-net(c,0)); }}, {l:U.T('净进口 ','Net imports ')+a.prv, cls:'r', f:function(c){ return U.v(-net(c,1)); }}, {l:U.T('出口','Exports'), cls:'r', f:function(c){ return U.v(C[c].x[0]); }}, {l:U.T('进口','Imports'), cls:'r', f:function(c){ return U.v(C[c].m[0]); }}]);
    /* 05/06 growth (low-confidence excluded) */
    H2('exp-growth','出口增速排名','Export growth','过滤：'+U.prev()+'出口 ≥ 20 万吨；出口数据存疑的国家不参与。','Filter: '+U.prev()+' exports ≥ 0.2 Mt; countries with questionable export records excluded.');
    table('t-exp-growth', R.filter(function(c){ return C[c].x[1]>=20 && !C[c].lx && C[c].xy!=null; }).sort(function(p,q){ return C[q].xy-C[p].xy; }), [a.rank, {l:a.ctry.l, f:function(c){ return U.nm(c); }}, {l:U.T('同比','y/y'), cls:'r', f:function(c){ return bp(C[c].xy); }}, {l:U.T('变化量','Change')+' ('+a.un+')', cls:'r', f:function(c){ return U.dv(C[c].x[0]-C[c].x[1]); }}, {l:a.cur, cls:'r', f:function(c){ return U.v(C[c].x[0]); }}, {l:a.prv, cls:'r', f:function(c){ return U.v(C[c].x[1]); }}]);
    H2('imp-growth','进口增速排名','Import growth','过滤：'+U.prev()+'进口 ≥ 20 万吨；进口数据存疑的国家不参与。','Filter: '+U.prev()+' imports ≥ 0.2 Mt; countries with questionable import records excluded.');
    table('t-imp-growth', R.filter(function(c){ return C[c].m[1]>=20 && !C[c].lm && C[c].my!=null; }).sort(function(p,q){ return C[q].my-C[p].my; }), [a.rank, {l:a.ctry.l, f:function(c){ return U.nm(c); }}, {l:U.T('同比','y/y'), cls:'r', f:function(c){ return bp(C[c].my); }}, {l:U.T('变化量','Change')+' ('+a.un+')', cls:'r', f:function(c){ return U.dv(C[c].m[0]-C[c].m[1]); }}, {l:a.cur, cls:'r', f:function(c){ return U.v(C[c].m[0]); }}, {l:a.prv, cls:'r', f:function(c){ return U.v(C[c].m[1]); }}]);
    /* 07/08 share change */
    var sd=function(c){ return C[c].xs[0]-C[c].xs[1]; };
    var shCols=[a.rank, {l:a.ctry.l, f:function(c){ return U.nm(c); }}, {l:U.T('份额变化（pp）','Share change (pp)'), cls:'r', f:function(c){ return badge(sd(c),2); }}, {l:U.T('份额 ','Share ')+a.cur, cls:'r', f:function(c){ return C[c].xs[0].toFixed(2)+'%'; }}, {l:U.T('份额 ','Share ')+a.prv, cls:'r', f:function(c){ return C[c].xs[1].toFixed(2)+'%'; }}, {l:a.cur+' ('+a.un+')', cls:'r', f:function(c){ return U.v(C[c].x[0]); }}];
    H2('share-up','出口份额提升排名','Export share gainers',U.cur()+'份额 − '+U.prev()+'份额（百分点）；过滤：期内出口 ≥ 5 万吨，数据存疑国家不参与。','Share in '+U.cur()+' minus share in '+U.prev()+' (pp); filter: exports ≥ 0.05 Mt; questionable records excluded.');
    table('t-share-up', R.filter(function(c){ return C[c].x[0]>=5 && !C[c].lx && sd(c)>0; }).sort(function(p,q){ return sd(q)-sd(p); }), shCols);
    H2('share-dn','出口份额下降排名','Export share losers','份额下降最多的国家（百分点）；过滤：'+U.prev()+'出口 ≥ 5 万吨，数据存疑国家不参与。','Largest share losses (pp); filter: '+U.prev()+' exports ≥ 0.05 Mt; questionable records excluded.');
    table('t-share-dn', R.filter(function(c){ return C[c].x[1]>=5 && !C[c].lx && sd(c)<0; }).sort(function(p,q){ return sd(p)-sd(q); }), shCols);
    /* 09-11 corridors */
    var ok=function(r){ return !r[4] && !(C[r[0]]&&C[r[0]].lx) && !(C[r[1]]&&C[r[1]].lm); };
    var corCols=[a.rank, {l:U.T('出口方 → 进口方','Exporter → importer'), f:function(r){ return U.nm(r[0])+' → '+U.nm(r[1])+(r[4]||(C[r[0]]&&C[r[0]].lx)?U.warn():''); }}, {l:a.cur+' ('+a.un+')', cls:'r', f:function(r){ return U.v(r[2]); }}, {l:a.prv+' ('+a.un+')', cls:'r', f:function(r){ return U.v(r[3]); }}, {l:U.T('变化量','Change'), cls:'r', f:function(r){ return U.dv(r[2]-r[3]); }}, {l:U.T('同比','y/y'), cls:'r', f:function(r){ return r[3]<0.5?U.T('新增','new'):bp(U.yoy(r[2],r[3])); }}];
    H2('bilateral-vol','双边流向量排名','Largest corridors','全球最大贸易对（出口方 → 进口方），按'+U.cur()+'量降序；出口方申报口径。','Largest exporter → importer flows in '+U.cur()+' (exporter-declared).');
    table('t-bilateral-vol', H.cor.slice().sort(function(p,q){ return q[2]-p[2]; }).slice(0,40), corCols);
    H2('bilateral-up','双边流向增长排名','Growing corridors','按增量排序；过滤：任一期 ≥ 5 万吨；进出口两端记录不一致或数据存疑的走廊不参与。','Ranked by volume gain; filter: ≥ 0.05 Mt in either period; corridors whose two customs records disagree are excluded.');
    table('t-bilateral-up', H.cor.filter(function(r){ return ok(r) && Math.max(r[2],r[3])>=5 && r[2]>r[3]; }).sort(function(p,q){ return (q[2]-q[3])-(p[2]-p[3]); }).slice(0,30), corCols);
    H2('bilateral-dn','双边流向下降排名','Shrinking corridors','按减量排序；过滤：'+U.prev()+' ≥ 5 万吨；记录不一致的走廊不参与。','Ranked by volume loss; filter: ≥ 0.05 Mt in '+U.prev()+'; corridors with conflicting records excluded.');
    table('t-bilateral-dn', H.cor.filter(function(r){ return ok(r) && r[3]>=5 && r[2]<r[3]; }).sort(function(p,q){ return (p[2]-p[3])-(q[2]-q[3]); }).slice(0,30), corCols);
    /* 12 products */
    var pt=H.prod.reduce(function(s,p){ return s+p.c; },0)||1;
    H2('product-rank','品种出口排名','Products','SMM 十七大钢材品种出口量（报告国出口合计），按'+U.cur()+'降序。','Exports by SMM\'s 17 steel product groups (sum of reporters), ranked by '+U.cur()+'.');
    table('t-product-rank', H.prod, [a.rank, {l:U.T('品种','Product'), f:function(p){ return U.en()?p.en:p.zh; }}, {l:a.cur+' ('+a.un+')', cls:'r', f:function(p){ return U.v(p.c); }}, {l:a.prv+' ('+a.un+')', cls:'r', f:function(p){ return U.v(p.p); }}, {l:U.T('同比','y/y'), cls:'r', f:function(p){ return bp(U.yoy(p.c,p.p)); }}, {l:U.T('份额','Share'), cls:'r', f:function(p){ return (p.c/pt*100).toFixed(1)+'%'; }}]);
    /* 13 product x exporter */
    H2('product-country','品种 × 出口国','Product × exporter','选择品种，查看该品种下各出口国排名。','Pick a product to rank its exporters.');
    $('lblGrp').textContent=U.T('品种：','Product:');
    var gs=$('groupSelect'); grp=grp||H.prod[0].g; gs.innerHTML=''; H.prod.forEach(function(p){ gs.add(new Option(U.en()?p.en:p.zh, p.g)); }); gs.value=grp;
    renderPC();
    $('pgNote').innerHTML=U.dqNote();
    show(active);
  }
  function renderPC(){
    var g=$('groupSelect').value; grp=g; var a=A();
    var rows=R.filter(function(c){ return C[c].gx[g] && C[c].gx[g][0]>=0.1; }).sort(function(p,q){ return C[q].gx[g][0]-C[p].gx[g][0]; });
    var tot=rows.reduce(function(s,c){ return s+C[c].gx[g][0]; },0)||1;
    table('t-product-country', rows, [a.rank, {l:a.ctry.l, f:function(c){ return cn(c,'x'); }}, {l:a.cur+' ('+a.un+')', cls:'r', f:function(c){ return U.v(C[c].gx[g][0]); }}, {l:a.prv+' ('+a.un+')', cls:'r', f:function(c){ return U.v(C[c].gx[g][1]); }}, {l:U.T('同比','y/y'), cls:'r', f:function(c){ return C[c].gx[g][1]<0.5?U.T('新增','new'):bp(U.yoy(C[c].gx[g][0],C[c].gx[g][1])); }}, {l:U.T('份额','Share'), cls:'r', f:function(c){ return (C[c].gx[g][0]/tot*100).toFixed(1)+'%'; }}]);
  }
  function show(p){
    active=p;
    document.querySelectorAll('.sb-item').forEach(function(e){ e.classList.toggle('active', e.getAttribute('data-panel')===p); });
    document.querySelectorAll('.tab-btn').forEach(function(e){ e.classList.toggle('active', e.getAttribute('data-panel')===p); });
    document.querySelectorAll('.panel').forEach(function(e){ e.classList.toggle('active', e.id==='p-'+p); });
  }
  window.__rkShow=show; window.renderProductCountry=renderPC;
  window.__relang=function(){ try{ render(); }catch(e){ console.error(e); } };
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', render); else render();
})();
