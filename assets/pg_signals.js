/* Market Signals page — automatic volume-anomaly scan on the year-to-date period (window.H1). */
(function(){
  'use strict';
  var H = window.H1, U = window.HU; if(!H || !U) return;
  var $ = function(id){ return document.getElementById(id); };
  var C = H.C, R = H.reps, ch1=null, ch2=null;
  var ok = function(r){ return !r[4] && !(C[r[0]]&&C[r[0]].lx) && !(C[r[1]]&&C[r[1]].lm); };
  var kw = function(v){ return '<span class="kw '+(v>=0?'up':'down')+'">'+U.pct(v,0)+'</span>'; };
  var kd = function(v){ return '<span class="kw '+(v>=0?'up':'down')+'">'+U.dv(v)+'</span>'; };

  function data(){
    var cor = H.cor.filter(ok);
    var surge = cor.filter(function(r){ return r[2]>=20 && r[3]>=10; }).map(function(r){ return [r, U.yoy(r[2],r[3])]; }).sort(function(a,b){ return b[1]-a[1]; }).slice(0,10);
    var slump = cor.filter(function(r){ return r[3]>=30; }).map(function(r){ return [r, U.yoy(r[2],r[3])]; }).sort(function(a,b){ return a[1]-b[1]; }).slice(0,10);
    var big = cor.filter(function(r){ return Math.max(r[2],r[3])>=30; }).map(function(r){ return [r, r[2]-r[3]]; }).sort(function(a,b){ return Math.abs(b[1])-Math.abs(a[1]); }).slice(0,12);
    var ex = R.filter(function(c){ return !C[c].lx && C[c].x[1]>=20; }).map(function(c){ return [c, C[c].x[0]-C[c].x[1], C[c].xy]; });
    var exUp = ex.slice().sort(function(a,b){ return b[1]-a[1]; }).slice(0,8), exDn = ex.slice().sort(function(a,b){ return a[1]-b[1]; }).slice(0,8);
    var shr = R.slice().sort(function(a,b){ return C[b].xs[0]-C[a].xs[0]; }).slice(0,10);
    var mk = R.filter(function(c){ return !C[c].lm && C[c].m[1]>=100; }).sort(function(a,b){ return C[b].m[0]-C[a].m[0]; }).slice(0,8);
    var subs = mk.map(function(m){ var s=C[m].src.map(function(x){ return [x[0], x[1]-x[2]]; }); return {m:m, up:s.filter(function(x){ return x[1]>0; }).sort(function(a,b){ return b[1]-a[1]; }).slice(0,2), dn:s.filter(function(x){ return x[1]<0; }).sort(function(a,b){ return a[1]-b[1]; }).slice(0,2)}; });
    return {surge:surge, slump:slump, big:big, exUp:exUp, exDn:exDn, shr:shr, subs:subs};
  }
  function tbl(rows, head){ return '<table class="dtable"><thead><tr>'+head.map(function(h){ return '<th>'+h+'</th>'; }).join('')+'</tr></thead><tbody>'+rows.join('')+'</tbody></table>'; }

  function render(){
    var E=U.en(), D=data(), cur=U.curS(), prv=U.prevS();
    /* sidebar + hero */
    var nav=[['s1','01',['信号总览','Overview']],['s2','02',['流向异变','Flow anomalies']],['s3','03',['出口国动态','Exporter dynamics']],['s4','04',['来源替代','Source substitution']],['s-explorer','05',['自定义异动查询','Custom explorer']],['s5','06',['方法与提醒','Method & caveats']]];
    $('sbRep').textContent=U.T('钢材市场信号报告 · ','Steel market signals · ')+U.cur();
    $('sbNav').innerHTML=nav.map(function(n,i){ return '<div class="sb-group'+(i===0?' open':'')+'"><a class="sb-sec'+(i===0?' active':'')+'" href="#'+n[0]+'"><span class="sn">'+n[1]+'</span><span class="sb-name">'+U.T(n[2][0],n[2][1])+'</span></a></div>'; }).join('');
    $('tGrp').textContent=U.T('市场信号','Signals'); $('tName').innerHTML=U.T('铁','Iron')+'<span class="t-en">'+U.T('信号','Signals')+'</span>';
    $('tFoot').innerHTML='<span>'+cur+' vs '+prv+'</span><span>EXPORT</span>';
    $('hTag').textContent='STEEL MARKET SIGNALS';
    $('hTitle').textContent=U.T('钢材市场信号报告 · '+U.cur(),'Steel market signals · '+U.cur());
    $('hEn').textContent=U.T('量级异变自动扫描（'+U.cur()+'对比'+U.prev()+'）','Volume-based anomaly scan ('+U.cur()+' vs '+U.prev()+')');
    var g=D.big.filter(function(x){ return x[1]>0; })[0], l=D.big.filter(function(x){ return x[1]<0; })[0], cn=C['中国'];
    var fr=function(r){ return U.nm(r[0])+'→'+U.nm(r[1]); };
    $('hLead').innerHTML=U.T('自动扫描 '+U.cur()+'对比'+U.prev()+'的量级异变。'+H.reps.length+' 个报告国出口合计 <b>'+U.vu(H.tot.x[0],0)+'</b>（'+U.pct(U.yoy(H.tot.x[0],H.tot.x[1]))+'）；中国份额 <b>'+cn.xs[0].toFixed(1)+'%</b>（'+U.ppS(cn.xs[0]-cn.xs[1])+'）。增量最大的走廊为 <b>'+fr(g[0])+'</b>（'+U.dv(g[1])+' 万吨），减量最大的为 <b>'+fr(l[0])+'</b>（'+U.dv(l[1])+' 万吨）。',
      'An automatic scan of volume shifts, '+U.cur()+' vs '+U.prev()+'. Exports of the '+H.reps.length+' reporters total <b>'+U.vu(H.tot.x[0])+'</b> ('+U.pct(U.yoy(H.tot.x[0],H.tot.x[1]))+'); China\'s share is <b>'+cn.xs[0].toFixed(1)+'%</b> ('+U.ppS(cn.xs[0]-cn.xs[1])+'). The largest corridor gain is <b>'+fr(g[0])+'</b> ('+U.dv(g[1])+' Mt) and the largest loss <b>'+fr(l[0])+'</b> ('+U.dv(l[1])+' Mt).');
    $('hDir').innerHTML='<span class="hd-label">'+U.T('本期信号','Signals')+'</span>'+D.surge.slice(0,1).map(function(x){ return '<span class="sig-pill up"><i></i>'+fr(x[0])+' '+U.pct(x[1],0)+'</span>'; }).join('')+D.slump.slice(0,2).map(function(x){ return '<span class="sig-pill down"><i></i>'+fr(x[0])+' '+U.pct(x[1],0)+'</span>'; }).join('');
    $('hMeta').innerHTML='<span>'+U.T('口径 · 出口国申报实物量','Basis · exporter-declared volumes')+'</span><span>'+U.T('对比 ','Comparison ')+'<b>'+U.cur()+' vs '+U.prev()+'</b></span><span>'+U.T('阈值见第 06 节','Thresholds in section 06')+'</span>';
    /* executive read */
    var top3=D.exUp.slice(0,3), bot3=D.exDn.slice(0,3);
    $('narr').innerHTML='<div class="nh"><span class="nhn">'+U.T('执行摘要','Executive read')+'</span></div>'+
      '<div class="point">'+U.T('出口增量居前：'+top3.map(function(x){ return U.nm(x[0])+'（'+U.dv(x[1],0)+' 万吨，'+U.pct(x[2],0)+'）'; }).join('、')+'；减量居前：'+bot3.map(function(x){ return U.nm(x[0])+'（'+U.dv(x[1],0)+' 万吨，'+U.pct(x[2],0)+'）'; }).join('、')+'。',
        'Largest export gains: '+U.list(top3.map(function(x){ return U.nm(x[0])+' ('+U.dv(x[1])+' Mt, '+U.pct(x[2],0)+')'; }))+'; largest declines: '+U.list(bot3.map(function(x){ return U.nm(x[0])+' ('+U.dv(x[1])+' Mt, '+U.pct(x[2],0)+')'; }))+'.')+'</div>'+
      '<div class="point">'+U.T('流向增速最快：'+D.surge.slice(0,3).map(function(x){ return fr(x[0])+' '+U.pct(x[1],0); }).join('、')+'；收缩最快：'+D.slump.slice(0,3).map(function(x){ return fr(x[0])+' '+U.pct(x[1],0); }).join('、')+'。',
        'Fastest-growing corridors: '+U.list(D.surge.slice(0,3).map(function(x){ return fr(x[0])+' '+U.pct(x[1],0); }))+'; fastest-shrinking: '+U.list(D.slump.slice(0,3).map(function(x){ return fr(x[0])+' '+U.pct(x[1],0); }))+'.')+'</div>'+
      '<div class="point" style="color:#8a6d1d">'+U.T('以上结论已剔除未获贸易伙伴记录印证的异常值与进出口两端记录矛盾的走廊；归因需结合政策与企业信息验证。','Outliers not corroborated by partner records and corridors whose two customs records disagree are excluded; attributions need checking against policy and company information.')+'</div>';
    /* s1 overview */
    $('h1s').textContent=U.T('信号总览','Overview'); $('t1').textContent=U.T('本期关键信号','Key signals this period');
    $('m1').innerHTML=D.shr.slice(0,5).map(function(c){ var d=C[c].xs[0]-C[c].xs[1]; return '<span class="chip '+(d>=0?'up':'down')+'">'+U.nm(c)+' '+U.T('份额 ','share ')+C[c].xs[0].toFixed(1)+'% · '+U.ppS(d)+'</span>'; }).join('');
    $('p1t').innerHTML='<div class="subhead">'+U.T('怎么读这份报告','How to read this report')+'</div>'+
      '<div class="point"><span class="pc">'+U.T('流向异变','Flow anomalies')+'</span>'+U.T('：哪条双边贸易突然放量或萎缩（出口国口径）。',': which bilateral flows surged or slumped (exporter-declared).')+'</div>'+
      '<div class="point"><span class="pc">'+U.T('出口国动态','Exporter dynamics')+'</span>'+U.T('：谁在抢份额、谁在丢量。',': who is gaining share and who is losing volume.')+'</div>'+
      '<div class="point"><span class="pc">'+U.T('来源替代','Source substitution')+'</span>'+U.T('：进口国把订单从谁转给了谁（进口国口径）。',': which suppliers importers switched between (importer-declared).')+'</div>';
    /* s2 flows */
    $('h2s').textContent=U.T('流向异变','Flow anomalies'); $('t2').textContent=U.T('量级变化最大的贸易走廊','Corridors with the largest volume change');
    $('c2t').innerHTML=U.T('走廊增减量 Top 12','Top 12 corridor changes')+'<span class="cc-unit">'+U.unit()+' · '+cur+' vs '+prv+'</span>';
    if(ch1){ ch1.destroy(); ch1=null; }
    ch1=new Chart($('c_big').getContext('2d'),{type:'bar',data:{labels:D.big.map(function(x){ return fr(x[0]); }),datasets:[{data:D.big.map(function(x){ return E?Math.round(x[1])/100:Math.round(x[1]*10)/10; }),backgroundColor:D.big.map(function(x){ return x[1]>=0?'#e8a13a':'#C00000'; }),borderRadius:3}]},
      options:{indexAxis:'y',responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false},tooltip:{callbacks:{label:function(t){ return (t.parsed.x>=0?'+':'')+t.parsed.x+' '+U.unit(); }}}},scales:{x:{grid:{color:'#f0f1f3'}},y:{grid:{display:false},ticks:{font:{size:11}}}}}});
    var hd=[U.T('流向','Corridor'),cur,prv,U.T('同比','y/y')];
    $('tSurge').innerHTML='<div class="tbl-h"><span class="dot up"></span>'+U.T('同比暴增 TOP（'+U.unit()+'）','Top surges ('+U.unit()+')')+'</div>'+tbl(D.surge.map(function(x){ return '<tr><td>'+fr(x[0])+'</td><td>'+U.v(x[0][2])+'</td><td>'+U.v(x[0][3])+'</td><td>'+kw(x[1])+'</td></tr>'; }),hd);
    $('tSlump').innerHTML='<div class="tbl-h"><span class="dot down"></span>'+U.T('同比暴跌 TOP（'+U.unit()+'）','Top slumps ('+U.unit()+')')+'</div>'+tbl(D.slump.map(function(x){ return '<tr><td>'+fr(x[0])+'</td><td>'+U.v(x[0][2])+'</td><td>'+U.v(x[0][3])+'</td><td>'+kw(x[1])+'</td></tr>'; }),hd);
    /* s3 exporters */
    $('h3s').textContent=U.T('出口国动态','Exporter dynamics'); $('t3').textContent=U.T('增量与份额','Gains, losses and share');
    var he=[U.T('出口国','Exporter'),cur,U.T('增减','Change'),U.T('同比','y/y')];
    $('tExUp').innerHTML='<div class="tbl-h"><span class="dot up"></span>'+U.T('出口增量 TOP（'+U.unit()+'）','Largest gains ('+U.unit()+')')+'</div>'+tbl(D.exUp.map(function(x){ return '<tr><td>'+U.nm(x[0])+'</td><td>'+U.v(C[x[0]].x[0])+'</td><td>'+kd(x[1])+'</td><td>'+U.pct(x[2],0)+'</td></tr>'; }),he);
    $('tExDn').innerHTML='<div class="tbl-h"><span class="dot down"></span>'+U.T('出口减量 TOP（'+U.unit()+'）','Largest declines ('+U.unit()+')')+'</div>'+tbl(D.exDn.map(function(x){ return '<tr><td>'+U.nm(x[0])+'</td><td>'+U.v(C[x[0]].x[0])+'</td><td>'+kd(x[1])+'</td><td>'+U.pct(x[2],0)+'</td></tr>'; }),he);
    $('tShare').innerHTML='<div class="subhead" style="margin-top:20px">'+U.T('出口份额 TOP 10（'+H.reps.length+' 国合计 = 100%）','Export share, top 10 ('+H.reps.length+' reporters = 100%)')+'</div>'+
      tbl(D.shr.map(function(c){ var d=C[c].xs[0]-C[c].xs[1]; return '<tr><td>'+U.nm(c)+(C[c].lx?U.warn():'')+'</td><td>'+C[c].xs[0].toFixed(1)+'%</td><td>'+C[c].xs[1].toFixed(1)+'%</td><td><span class="kw '+(d>=0?'up':'down')+'">'+U.ppS(d)+'</span></td></tr>'; }),[U.T('出口国','Exporter'),U.T('份额 ','Share ')+cur,U.T('份额 ','Share ')+prv,U.T('变化','Change')]);
    /* s4 substitution */
    $('h4s').textContent=U.T('来源替代','Source substitution'); $('t4').textContent=U.T('进口来源切换：谁抢了谁的量','Who took whose volume');
    var cn10=C['中国'].dest.slice(0,10);
    $('c4t').innerHTML=U.T('中国对主要市场出口 '+prv+' vs '+cur,'China\'s exports to main markets, '+prv+' vs '+cur)+'<span class="cc-unit">'+U.unit()+'</span>';
    if(ch2){ ch2.destroy(); ch2=null; }
    var cv=function(v){ return E?Math.round(v)/100:v; };
    ch2=new Chart($('c_cn').getContext('2d'),{type:'bar',data:{labels:cn10.map(function(x){ return U.nm(x[0]); }),datasets:[{label:prv,data:cn10.map(function(x){ return cv(x[2]); }),backgroundColor:'#cbd2dc',borderRadius:3},{label:cur,data:cn10.map(function(x){ return cv(x[1]); }),backgroundColor:'#C00000',borderRadius:3}]},
      options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{position:'top',labels:{boxWidth:12,font:{size:11}}}},scales:{x:{grid:{display:false},ticks:{font:{size:11}}},y:{grid:{color:'#f0f1f3'}}}}});
    $('subGrid').innerHTML=D.subs.map(function(s){
      var ln=function(x,k){ return '<div class="sub-line '+k+'"><span class="sl-src">'+U.nm(x[0])+'</span><span class="sl-chg">'+U.dv(x[1])+'</span></div>'; };
      return '<div class="sub-card"><div class="sub-imp">'+U.nm(s.m)+' <span>'+U.T('进口来源变化（'+U.unit()+'）','source changes ('+U.unit()+')')+'</span></div><div class="sub-cols"><div class="sub-col"><div class="sub-h up">'+U.T('来源增加','Gaining')+'</div>'+s.up.map(function(x){ return ln(x,'up'); }).join('')+'</div>'+
        '<div class="sub-col"><div class="sub-h down">'+U.T('来源减少','Losing')+'</div>'+s.dn.map(function(x){ return ln(x,'down'); }).join('')+'</div></div></div>'; }).join('');
    $('l4').innerHTML='<span class="lb" style="color:#b07d11">'+U.T('口径提醒','Basis note')+'</span>'+U.T('来源替代按进口国自报口径；与出口国口径存在镜像差异，两侧互证的信号更可靠。进口数据存疑的市场未列入。','Substitution uses importer-declared data and can differ from exporter records; signals seen on both sides are more reliable. Markets with questionable import records are not shown.');
    /* explorer */
    explorer();
    /* method */
    $('h5s').textContent=U.T('方法与提醒','Method & caveats'); $('t5').textContent=U.T('阈值、口径与数据质量','Thresholds, basis and data quality');
    $('p5').innerHTML=U.T(
      '<div class="subhead">扫描规则</div><div class="point"><span class="pc">对比期</span>：'+U.cur()+' vs '+U.prev()+'（同口径同月份）。</div>'+
      '<div class="point"><span class="pc">材料性阈值</span>：暴增需本期 ≥ 20 万吨且上年同期 ≥ 10 万吨；暴跌需上年同期 ≥ 30 万吨；出口国增减需上年同期 ≥ 20 万吨。</div>'+
      '<div class="subhead">口径</div><div class="point">流向与出口国用出口国自报口径；来源替代用进口国自报口径，两侧不可相加。</div>'+
      '<div class="subhead">数据质量</div><div class="point">已剔除 '+H.dq.excluded+' 个未获伙伴记录印证的异常值；进出口两端记录矛盾的走廊、以及数据与伙伴记录差异较大的国家不进入排名与结论。</div>'+
      '<div class="point"><span class="pc">解释为推测</span>：近岸、转口、贸易救济等归因为分析判断，需结合政策与企业信息验证。</div>',
      '<div class="subhead">Scan rules</div><div class="point"><span class="pc">Period</span>: '+U.cur()+' vs '+U.prev()+' (same months).</div>'+
      '<div class="point"><span class="pc">Materiality</span>: a surge needs ≥ 0.2 Mt now and ≥ 0.1 Mt a year earlier; a slump needs ≥ 0.3 Mt a year earlier; exporter changes need ≥ 0.2 Mt a year earlier.</div>'+
      '<div class="subhead">Basis</div><div class="point">Corridors and exporters use exporter-declared data; substitution uses importer-declared data. The two cannot be added.</div>'+
      '<div class="subhead">Data quality</div><div class="point">'+H.dq.excluded+' outliers not corroborated by partner records were removed; corridors whose two customs records disagree, and countries whose records differ materially from partner data, are not ranked or used in conclusions.</div>'+
      '<div class="point"><span class="pc">Attributions are judgements</span>: near-shoring, transshipment and trade-remedy explanations need checking against policy and company information.</div>');
    $('foot').innerHTML='<b>'+U.T('钢材市场信号报告','Steel market signals')+'</b> · '+U.cur()+' vs '+U.prev()+' · '+U.T('数据来源：GTT、各国海关；SMM 整理 · 仅供内部分析参考','Source: GTT, national customs; compiled by SMM · internal use only');
    $('pgNote').innerHTML=U.dqNote();
  }
  function explorer(){
    var E=U.en(), F=H.flows;
    $('hx').textContent=U.T('自定义异动查询','Custom explorer'); $('tx').textContent=U.T('按国家 / 品种筛选异动流向','Filter flows by country / product');
    $('lx').innerHTML='<span class="lb">'+U.T('自助','Self-serve')+'</span>'+U.T('选择国家与品种，实时计算 '+U.cur()+' vs '+U.prev()+' 的暴增 / 暴跌流向（出口国口径，上年同期 ≥ 2 万吨）。','Pick a country and product to compute surges and slumps, '+U.cur()+' vs '+U.prev()+' (exporter-declared, ≥ 0.02 Mt a year earlier).');
    var cSel=$('exCountry'), sSel=$('exSide'), pSel=$('exProd');
    var cv=cSel.value, sv=sSel.value, pv=pSel.value;
    var cs={}, ps={}; F.forEach(function(f){ cs[f[0]]=1; cs[f[1]]=1; ps[f[2]]=1; });
    cSel.innerHTML='<option value="__all">'+U.T('全部国家','All countries')+'</option>'+Object.keys(cs).sort(function(a,b){ return U.nm(a).localeCompare(U.nm(b)); }).map(function(c){ return '<option value="'+c+'">'+U.nm(c)+'</option>'; }).join('');
    pSel.innerHTML='<option value="__all">'+U.T('全部品种','All products')+'</option>'+Object.keys(ps).sort().map(function(p){ return '<option value="'+p+'">'+U.pz(p)+'</option>'; }).join('');
    sSel.innerHTML='<option value="any">'+U.T('作为出口或进口国','As exporter or importer')+'</option><option value="exp">'+U.T('作为出口国','As exporter')+'</option><option value="imp">'+U.T('作为进口国','As importer')+'</option>';
    if(cv) cSel.value=cv; if(sv) sSel.value=sv; if(pv) pSel.value=pv;
    $('exCountryLbl').textContent=U.T('国家','Country'); $('exSideLbl').textContent=U.T('角色','Role'); $('exProdLbl').textContent=U.T('品种','Product');
    $('exUpH').textContent=U.T('同比暴增 TOP','Top surges'); $('exDnH').textContent=U.T('同比暴跌 TOP','Top slumps');
    function compute(){
      var c=cSel.value, side=sSel.value, p=pSel.value;
      var rows=F.filter(function(f){ if(p!=='__all'&&f[2]!==p) return false; if(c!=='__all'){ if(side==='exp') return f[0]===c; if(side==='imp') return f[1]===c; return f[0]===c||f[1]===c; } return true; })
        .filter(function(f){ return f[4]>=2 && !f[5] && !(C[f[0]]&&C[f[0]].lx); }).map(function(f){ return {f:f, y:(f[3]/f[4]-1)*100}; });
      var t=function(id, arr){ var h='<thead><tr><th>'+U.T('流向','Corridor')+'</th><th>'+U.T('品种','Product')+'</th><th>'+U.curS()+'</th><th>'+U.prevS()+'</th><th>'+U.T('同比','y/y')+'</th></tr></thead><tbody>';
        if(!arr.length) h+='<tr><td colspan=5 style="color:#9aa1ae">'+U.T('无匹配流向','No matching flows')+'</td></tr>';
        arr.forEach(function(r){ h+='<tr><td>'+U.nm(r.f[0])+'→'+U.nm(r.f[1])+'</td><td>'+U.pz(r.f[2])+'</td><td>'+U.vu(r.f[3])+'</td><td>'+U.vu(r.f[4])+'</td><td>'+kw(r.y)+'</td></tr>'; });
        $(id).innerHTML=h+'</tbody>'; };
      t('exUp', rows.slice().sort(function(a,b){ return b.y-a.y; }).slice(0,12));
      t('exDn', rows.slice().sort(function(a,b){ return a.y-b.y; }).slice(0,12));
      $('exCount').textContent=U.T('匹配 '+rows.length+' 条流向','Matched '+rows.length+' flows');
    }
    cSel.onchange=compute; sSel.onchange=compute; pSel.onchange=compute; compute();
  }
  window.__relang=function(){ try{ render(); }catch(e){ console.error(e); } };
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', render); else render();
})();
