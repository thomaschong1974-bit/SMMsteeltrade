/* Flagship: year-to-date versions of the Landscape, What Moved and Product Radar sections (window.H1).
   The "At a glance" strip stays on full-year data as the annual baseline. */
(function(){
  'use strict';
  var H = window.H1, U = window.HU; if(!H || !U) return;
  var $ = function(id){ return document.getElementById(id); };
  var C = H.C, R = H.reps;
  var ok = function(r){ return !r[4] && !(C[r[0]]&&C[r[0]].lx) && !(C[r[1]]&&C[r[1]].lm); };
  function fm(v,d){ return v.toLocaleString('en-US',{minimumFractionDigits:d,maximumFractionDigits:d}); }

  /* echarts data (lazy-initialised by the page) */
  function patchEC(){
    var EC = window.EC_DATA; if(!EC) return;
    EC.expTop10 = R.slice().sort(function(a,b){ return C[b].x[0]-C[a].x[0]; }).slice(0,10).map(function(c){ return [c, C[c].x[0]]; });
    EC.prodStruct = H.prod.slice(0,8).map(function(p){ return [p.g, p.c]; });
  }
  function rankHtml(list, key){
    var max=C[list[0]][key][0];
    return list.map(function(c,i){ var d=C[c][key], y=key==='x'?C[c].xy:C[c].my, sh=key==='x'?C[c].xs[0]:C[c].ms[0];
      var low = key==='x'?C[c].lx:C[c].lm;
      return '<div class="rrow"><div class="ri num">'+(i+1)+'</div><div class="rn">'+U.nm(c)+(low?' <span title="'+U.T('数据存疑','check data')+'">⚠</span>':'')+'<span class="ren">'+(y==null?'':'<span class="'+(y>=0?'up':'dn')+'">'+U.pct(y)+'</span>')+'</span></div>'+
        '<div class="rbar"><i style="width:'+(d[0]/max*100)+'%"></i></div><div class="rv num"><span>'+U.v(d[0])+'</span><span class="rs">'+sh.toFixed(1)+'%</span></div></div>'; }).join('');
  }
  function landscape(){
    var E=U.en();
    var X=R.slice().sort(function(a,b){ return C[b].x[0]-C[a].x[0]; }).slice(0,10), M=R.slice().sort(function(a,b){ return C[b].m[0]-C[a].m[0]; }).slice(0,10);
    var cn=C['中国'], top4m=M.slice(0,4).map(U.nm);
    $('lsEy').textContent=U.T('全球格局 · '+U.cur(),'Landscape · '+U.cur());
    $('lsH').textContent=U.T('谁在出口，谁在进口','Who exports, who imports');
    $('lsP').textContent=U.T('中国出口占 '+R.length+' 国合计的 '+cn.xs[0].toFixed(1)+'%（'+U.ppS(cn.xs[0]-cn.xs[1])+'）；进口需求分散，'+top4m.join('、')+'领跑。',
      'China ships '+cn.xs[0].toFixed(1)+'% of the '+R.length+' reporters\' exports ('+U.ppS(cn.xs[0]-cn.xs[1])+'); import demand is dispersed, led by '+U.list(top4m)+'.');
    $('lsXh').innerHTML=U.T('出口国 TOP 10','Top 10 exporters')+' <span class="tag">EXPORT</span>'; $('lsMh').innerHTML=U.T('进口国 TOP 10','Top 10 importers')+' <span class="tag b">IMPORT</span>';
    var sub=U.T(U.cur()+' · 万吨（同比）/ 份额',U.cur()+' · Mt (y/y) / share');
    $('lsXs').textContent=sub; $('lsMs').textContent=sub;
    $('expRank').innerHTML=rankHtml(X,'x'); $('impRank').innerHTML=rankHtml(M,'m');
    /* top 20 corridors */
    $('bilEy').textContent=U.T('双边流向 · Bilateral','Bilateral corridors'); $('bilH').textContent=U.T('最大的 20 条贸易走廊（'+U.cur()+'）','The 20 largest trade corridors ('+U.cur()+')');
    var top=H.cor.slice().sort(function(a,b){ return b[2]-a[2]; }).slice(0,20), bmax=top[0][2];
    $('bilList').innerHTML=top.map(function(r,i){ var y=U.yoy(r[2],r[3]), fl=!ok(r);
      return '<div class="bil-row"><div class="bi num">'+(i+1)+'</div><div class="bil-route">'+U.nm(r[0])+' <span class="ar">&rarr;</span> '+U.nm(r[1])+(fl?' <span title="'+U.T('两端记录不一致','records disagree')+'">⚠</span>':'')+'</div>'+
        '<div class="bil-bar"><i style="width:'+(r[2]/bmax*100)+'%"></i></div><div class="bv num">'+U.v(r[2])+'</div><div class="bil-yoy '+(y==null?'':(y>=0?'up':'dn'))+'">'+(y==null?'—':U.pct(y,0))+'</div></div>'; }).join('');
    $('stEy').textContent=U.T('结构透视 · Structure','Structure'); $('stH').textContent=U.T('出口排名与品种结构','Export ranking and product mix');
    $('stP').textContent=U.T('左：'+U.cur()+'出口国 Top 10（万吨）；右：出口品种结构占比。','Left: top 10 exporters, '+U.cur()+' (Mt); right: export product mix.');
    $('ecT1').textContent=U.T('出口国 TOP 10','Top 10 exporters'); $('ecG1').textContent=U.curS()+' · EXPORT'; $('ecS1').textContent=U.T('单位 万吨 · 出口国申报口径','Unit: Mt · exporter-declared');
    $('ecT2').textContent=U.T('出口品种结构','Export product mix'); $('ecG2').textContent=U.curS(); $('ecS2').textContent=U.T('报告国出口合计，前 8 大品种','Sum of reporters, top 8 products');
  }
  function moved(){
    var E=U.en(), cor=H.cor.filter(ok);
    var dn=cor.filter(function(r){ return r[3]>=50; }).sort(function(a,b){ return (a[2]-a[3])-(b[2]-b[3]); });
    var up=cor.filter(function(r){ return r[3]>=10; }).sort(function(a,b){ return (b[2]-b[3])-(a[2]-a[3]); });
    var us=C['美国'];
    var cnd=C['中国'].dest.filter(function(d){ return d[2]>=10; }).map(function(d){ return [d[0], U.yoy(d[1],d[2])]; }).sort(function(a,b){ return b[1]-a[1]; }).slice(0,3);
    var pr=H.prod.filter(function(p){ return p.p>=100; }).map(function(p){ return [p, U.yoy(p.c,p.p)]; }).sort(function(a,b){ return b[1]-a[1]; });
    var ex=R.filter(function(c){ return !C[c].lx && C[c].x[1]>=50; }).sort(function(a,b){ return (C[b].x[0]-C[b].x[1])-(C[a].x[0]-C[a].x[1]); });
    var fr=function(r){ return U.nm(r[0])+'→'+U.nm(r[1]); };
    var stat=function(v,y){ return U.vu(v)+' <span class="'+(y>=0?'up':'dn')+'">'+U.pct(y,0)+'</span>'; };
    var cards=[
      ['dn',U.T('收缩 · CONTRACTION','Contraction'), U.T(fr(dn[0])+'大幅回落', fr(dn[0])+' drops sharply'), stat(dn[0][2],U.yoy(dn[0][2],dn[0][3])), U.T('减量 '+U.dv(dn[0][2]-dn[0][3])+' 万吨，为同期减量最大的贸易走廊；'+fr(dn[1])+' 同步 '+U.pct(U.yoy(dn[1][2],dn[1][3]),0)+'。','The largest corridor loss ('+U.dv(dn[0][2]-dn[0][3])+' Mt); '+fr(dn[1])+' also '+U.pct(U.yoy(dn[1][2],dn[1][3]),0)+'.'), './bilateral.html', U.T('查看双边流向','Open Bilateral')],
      ['dn',U.T('收缩 · CONTRACTION','Contraction'), U.T('美国进口 '+U.pct(us.my,1),'US imports '+U.pct(us.my,1)), stat(us.m[0],us.my), (function(){ var s=us.src.map(function(x){ return [x[0], x[1]-x[2]]; }); var lo=s.slice().sort(function(a,b){ return a[1]-b[1]; }).filter(function(x){ return x[1]<0; }).slice(0,3), hi=s.slice().sort(function(a,b){ return b[1]-a[1]; }).filter(function(x){ return x[1]>0; }).slice(0,2);
        return U.T(lo.map(function(x){ return U.nm(x[0]); }).join('、')+'对美供应减少（合计 '+U.dv(lo.reduce(function(t,x){ return t+x[1]; },0))+' 万吨），'+hi.map(function(x){ return U.nm(x[0]); }).join('、')+'增加。',
          'Supply from '+U.list(lo.map(function(x){ return U.nm(x[0]); }))+' fell (together '+U.dv(lo.reduce(function(t,x){ return t+x[1]; },0))+' Mt) while '+U.list(hi.map(function(x){ return U.nm(x[0]); }))+' rose.'); })(), './destination.html', U.T('查看进口市场','Open Import Markets')],
      ['g',U.T('扩张 · EXPANSION','Expansion'), U.T(fr(up[0])+'放量', fr(up[0])+' expands'), stat(up[0][2],U.yoy(up[0][2],up[0][3])), U.T('增量 '+U.dv(up[0][2]-up[0][3])+' 万吨，为同期增量最大的贸易走廊；其次 '+fr(up[1])+'（'+U.dv(up[1][2]-up[1][3])+' 万吨）。','The largest corridor gain ('+U.dv(up[0][2]-up[0][3])+' Mt), followed by '+fr(up[1])+' ('+U.dv(up[1][2]-up[1][3])+' Mt).'), './bilateral.html', U.T('查看双边流向','Open Bilateral')],
      ['g',U.T('放量 · SURGE','Surge'), U.T('中国增量转向新兴市场','China\'s growth shifts to new markets'), '<span class="up">'+cnd.map(function(x){ return U.pct(x[1],0); }).join(' / ')+'</span>', U.T('对'+cnd.map(function(x){ return U.nm(x[0])+' '+U.pct(x[1],0); }).join('、')+'，新兴市场承接中国增量。','Shipments to '+U.list(cnd.map(function(x){ return U.nm(x[0])+' '+U.pct(x[1],0); }))+' — emerging markets absorb China\'s volume.'), './country_report.html', U.T('查看中国画像','Open China profile')],
      ['',U.T('品种 · PRODUCT','Product'), U.T(U.pz(pr[0][0].g)+'放量，'+U.pz(pr[pr.length-1][0].g)+'回落', U.pz(pr[0][0].g)+' up, '+U.pz(pr[pr.length-1][0].g)+' down'), '<span class="up">'+U.pct(pr[0][1])+'</span> / <span class="dn">'+U.pct(pr[pr.length-1][1])+'</span>', U.T(U.pz(pr[0][0].g)+' '+U.vu(pr[0][0].c)+'、'+U.pz(pr[pr.length-1][0].g)+' '+U.vu(pr[pr.length-1][0].c)+'，品种结构分化。',U.pz(pr[0][0].g)+' '+U.vu(pr[0][0].c)+' and '+U.pz(pr[pr.length-1][0].g)+' '+U.vu(pr[pr.length-1][0].c)+' — product mix is diverging.'), '#products', U.T('查看品种雷达','Open Product Radar')],
      ['g',U.T('信号 · SIGNAL','Signal'), U.T(U.nm(ex[0])+'出口增量居首',U.nm(ex[0])+' leads export growth'), stat(C[ex[0]].x[0],C[ex[0]].xy), U.T('增量 '+U.dv(C[ex[0]].x[0]-C[ex[0]].x[1])+' 万吨；其次 '+U.nm(ex[1])+'（'+U.dv(C[ex[1]].x[0]-C[ex[1]].x[1])+'）、'+U.nm(ex[2])+'（'+U.dv(C[ex[2]].x[0]-C[ex[2]].x[1])+'）。','Up '+U.dv(C[ex[0]].x[0]-C[ex[0]].x[1])+' Mt, ahead of '+U.nm(ex[1])+' ('+U.dv(C[ex[1]].x[0]-C[ex[1]].x[1])+') and '+U.nm(ex[2])+' ('+U.dv(C[ex[2]].x[0]-C[ex[2]].x[1])+').'), './competition.html', U.T('查看出口竞争','Open Competition')]
    ];
    $('mvEy').textContent=U.T('本期重点变化 · What Moved','What moved · '+U.cur()); $('mvH').textContent=U.T('六张卡片看懂结构性变化','Six cards on the structural shifts');
    $('mvP').textContent=U.T('基于'+U.cur()+'与'+U.prev()+'同口径对比自动测算；已剔除数据存疑的记录。','Computed automatically, '+U.cur()+' vs '+U.prev()+' on a like-for-like basis; questionable records excluded.');
    $('cardWall').innerHTML=cards.map(function(c){ return '<a class="icw" href="'+c[5]+'"><div class="ctag '+c[0]+'">'+c[1]+'</div><h4>'+c[2]+'</h4><div class="cstat num">'+c[3]+'</div><p>'+c[4]+'</p><div class="go">'+c[6]+' <span class="a">&rarr;</span></div></a>'; }).join('');
  }
  function products(){
    var tot=H.prod.reduce(function(s,p){ return s+p.c; },0)||1;
    $('prEy').textContent=U.T('品种雷达 · Product Radar','Product radar'); $('prH').textContent=U.T('十七大钢材品种一览','The 17 steel product groups');
    $('prP').textContent=U.T(U.cur()+'出口量、同比与份额。点击任意品种，回到顶部地图查看该品种的流向。','Exports, y/y and share in '+U.cur()+'. Click a product to show its flows on the map above.');
    $('prodGrid').innerHTML=H.prod.map(function(p){ var y=U.yoy(p.c,p.p);
      return '<a class="entry" href="javascript:void(0)" onclick="selectGroup(\''+p.g.replace(/'/g,"\\'")+'\')"><h4>'+(U.en()?p.en:p.zh)+'</h4>'+
        '<p class="num">'+U.v(p.c,U.en()?2:0)+' <span>'+U.unit()+'</span> · <span class="'+(y>=0?'up':'dn')+'">'+U.pct(y)+'</span> · '+(p.c/tot*100).toFixed(1)+'%</p></a>'; }).join('');
  }
  function glance(){
    $('glEy').textContent=U.T('全年基准 · Annual Baseline','Annual baseline · '+H.per.py);
    $('glH').textContent=U.T(H.per.py+' 全年格局：年度基准','Full-year '+H.per.py+': the annual baseline');
    $('glP').textContent=U.T('以 '+H.per.py+' 完整年度海关数据（出口口径，万吨）刻画总量、集中度与结构，作为上方年内变化的参照。','Full-year '+H.per.py+' customs data (export basis) on totals, concentration and structure — the reference for the year-to-date read above.');
  }
  function all(){ try{ glance(); landscape(); moved(); products(); patchEC(); }catch(e){ console.error(e); } }
  function hook(){
    var prev=window.__relangCharts;
    window.__relangCharts=function(){ patchEC(); if(prev) try{ prev(); }catch(e){} all(); };
    all();
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', hook); else hook();
})();
