/* Trade Shift page — who replaced whom, importer-declared, year-to-date (window.H1). */
(function(){
  'use strict';
  var H = window.H1, U = window.HU; if(!H || !U) return;
  var $ = function(id){ return document.getElementById(id); };
  var MK = H.reps.slice().sort(function(a,b){ return H.C[b].m[0]-H.C[a].m[0]; }).slice(0, 24);
  var cur = '美国', cq=null, cs=null;

  function srcs(c){
    var d=H.C[c], tc=d.m[0]||0, tp=d.m[1]||0;
    return d.src.map(function(s){ var sc=tc?s[1]/tc*100:0, sp=tp?s[2]/tp*100:0; return {p:s[0], c:s[1], pv:s[2], sc:sc, sp:sp, dsh:sc-sp, dq:s[1]-s[2]}; });
  }
  function subst(c){
    var s=srcs(c).filter(function(x){ return x.c+x.pv>0.1; });
    var g=s.slice().sort(function(a,b){ return b.dsh-a.dsh; })[0], l=s.slice().sort(function(a,b){ return a.dsh-b.dsh; })[0];
    if(!g||!l||g.p===l.p||g.dsh<=0||l.dsh>=0) return null;
    var score=Math.min(Math.abs(g.dq), Math.abs(l.dq));
    var conf=score>=20?'s':score>=5?'m':'w';
    return {m:c, g:g, l:l, score:score, conf:conf, tot:H.C[c].my};
  }
  var conf=function(c){ return '<span class="conf-badge '+(c==='s'?'conf-strong':c==='m'?'conf-mid':'conf-weak')+'">'+U.T(c==='s'?'强':c==='m'?'中':'弱', c==='s'?'Strong':c==='m'?'Medium':'Weak')+'</span>'; };

  function heroIns(){
    var E=U.en(), ok=MK.filter(function(c){ return !H.C[c].lm; });
    /* China's share in major import markets */
    var cn=ok.map(function(c){ var s=srcs(c).filter(function(x){ return x.p==='中国'; })[0]; return s?[c,s]:null; }).filter(Boolean).filter(function(x){ return x[1].pv>=10||x[1].c>=10; }).sort(function(a,b){ return a[1].dsh-b[1].dsh; });
    var sub=ok.map(subst).filter(Boolean).sort(function(a,b){ return b.score-a.score; });
    /* suppliers gaining / losing share across markets */
    var tally={};
    ok.forEach(function(c){ srcs(c).forEach(function(s){ if(s.p===c) return; var t=tally[s.p]=tally[s.p]||{up:0,dn:0,dq:0}; if(s.dsh>1) t.up++; if(s.dsh<-1) t.dn++; t.dq+=s.dq; }); });
    var tk=Object.keys(tally), upS=tk.sort(function(a,b){ return tally[b].up-tally[a].up||tally[b].dq-tally[a].dq; })[0], dnS=tk.slice().sort(function(a,b){ return tally[b].dn-tally[a].dn||tally[a].dq-tally[b].dq; })[0];
    var c0=cn[0], c1=cn[cn.length-1], s0=sub[0];
    var cards=[
      [U.dv(c0[1].dq,E?2:1)+' '+U.unit(), U.T(U.nm(c0[0])+'自中国进口变化，中国份额降幅最大<br>由 '+c0[1].sp.toFixed(1)+'% 降至 '+c0[1].sc.toFixed(1)+'%（'+U.ppS(c0[1].dsh)+'）',
        'Change in '+U.nmp(c0[0])+'\'s imports from China — the steepest loss of China\'s share<br>'+c0[1].sp.toFixed(1)+'% → '+c0[1].sc.toFixed(1)+'% ('+U.ppS(c0[1].dsh)+')')],
      [U.dv(c1[1].dq,E?2:1)+' '+U.unit(), U.T(U.nm(c1[0])+'自中国进口变化，中国份额增幅最大<br>由 '+c1[1].sp.toFixed(1)+'% 升至 '+c1[1].sc.toFixed(1)+'%（'+U.ppS(c1[1].dsh)+'）',
        'Change in '+U.nmp(c1[0])+'\'s imports from China — the largest gain in China\'s share<br>'+c1[1].sp.toFixed(1)+'% → '+c1[1].sc.toFixed(1)+'% ('+U.ppS(c1[1].dsh)+')')],
      [s0?U.nm(s0.l.p)+' → '+U.nm(s0.g.p):'—', s0?U.T('最强替代信号：'+U.nm(s0.m)+'市场<br>转移量约 '+U.vu(s0.score),'Strongest substitution: '+U.nmp(s0.m)+'<br>about '+U.vu(s0.score)+' switched'):'—'],
      [U.nm(upS)+' ↑ / '+U.nm(dnS)+' ↓', U.T(U.nm(upS)+'在 '+tally[upS].up+' 个市场份额提升 >1pp；<br>'+U.nm(dnS)+'在 '+tally[dnS].dn+' 个市场份额下降 >1pp',
        U.nm(upS)+' gained >1pp share in '+tally[upS].up+' markets;<br>'+U.nm(dnS)+' lost >1pp in '+tally[dnS].dn+' markets')]
    ];
    $('heroIns').innerHTML=cards.map(function(c){ return '<div class="insight-card"><div class="ic-num">'+c[0]+'</div><div class="ic-label">'+c[1]+'</div></div>'; }).join('');
  }
  function market(){
    var c=cur, d=H.C[c], E=U.en(), s=srcs(c);
    $('marketStats').innerHTML=
      '<div class="stat-box"><div class="sv">'+U.vu(d.m[1])+'</div><div class="sl">'+U.T(U.prev()+'进口量','Imports, '+U.prev())+'</div></div>'+
      '<div class="stat-box"><div class="sv">'+U.vu(d.m[0])+'</div><div class="sl">'+U.T(U.cur()+'进口量','Imports, '+U.cur())+'</div><div class="sc '+(d.my>=0?'pos':'neg')+'">'+U.pct(d.my)+'</div></div>'+
      '<div class="stat-box"><div class="sv">'+d.ns[0]+'</div><div class="sl">'+U.T('来源国（≥ 0.1 万吨）','Sources (≥ 1 kt)')+'</div></div>';
    var x=subst(c), h='<h3>'+U.T('替代信号与判断','Substitution signal')+'</h3>';
    if(x){
      h+='<div class="signal-row"><div class="signal-badge">'+U.T('替代强度 ','Substitution ')+U.vu(x.score)+'</div>'+conf(x.conf)+
        (d.my>-5?'<span style="color:var(--down);font-size:12px;font-weight:600">'+U.T('市场稳定/增长 ✓','Market stable/growing ✓')+'</span>':'<span style="color:var(--muted);font-size:12px">'+U.T('市场收缩','Market contracting')+'</span>')+'</div>'+
        '<div class="signal-desc">'+U.T('<b>'+U.nm(c)+'</b>：自 <b>'+U.nm(x.l.p)+'</b> 进口 '+U.dv(x.l.dq)+' 万吨（份额 '+U.ppS(x.l.dsh)+'），转向 <b style="color:var(--red)">'+U.nm(x.g.p)+'</b> '+U.dv(x.g.dq)+' 万吨（份额 '+U.ppS(x.g.dsh)+'）。替代强度 = min(|新来源增量|, |原来源减量|) = <b>'+U.vu(x.score)+'</b>。',
          '<b>'+U.nm(c)+'</b>: imports from <b>'+U.nm(x.l.p)+'</b> '+U.dv(x.l.dq)+' Mt (share '+U.ppS(x.l.dsh)+'), shifting to <b style="color:var(--red)">'+U.nm(x.g.p)+'</b> '+U.dv(x.g.dq)+' Mt (share '+U.ppS(x.g.dsh)+'). Substitution score = min(|gain|, |loss|) = <b>'+U.vu(x.score)+'</b>.')+
        (d.lm?'<br><span style="color:#b45309">'+U.T('⚠ 该国进口数据与贸易伙伴记录差异较大，仅供参考。','⚠ This market\'s import records differ materially from partner data; treat with caution.')+'</span>':'')+'</div>';
    } else h+='<div class="signal-desc">'+U.T('该市场未检测到明显替代信号。','No clear substitution signal in this market.')+'</div>';
    $('signalBox').innerHTML=h;
    var top8=s.slice(0,8), cv=function(v){ return E?Math.round(v)/100:v; };
    $('cq').textContent=U.T(U.cur()+'与'+U.prev()+'各来源进口量（'+U.unit()+'）','Imports by source, '+U.cur()+' vs '+U.prev()+' ('+U.unit()+')');
    $('cs').textContent=U.T('份额变化（百分点）','Share change (pp)');
    if(cq){ cq.destroy(); cq=null; }
    cq=new Chart($('chartQty').getContext('2d'),{type:'bar',data:{labels:top8.map(function(x){ return U.nm(x.p); }),datasets:[
      {label:U.prevS(),data:top8.map(function(x){ return cv(x.pv); }),backgroundColor:'#e9ebee',borderRadius:3,barPercentage:0.7},
      {label:U.curS(),data:top8.map(function(x){ return cv(x.c); }),backgroundColor:'#C00000',borderRadius:3,barPercentage:0.7}]},
      options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{position:'top',labels:{font:{size:11},boxWidth:12}},tooltip:{callbacks:{label:function(t){ return t.dataset.label+': '+t.parsed.y.toLocaleString('en-US',{maximumFractionDigits:E?2:1})+' '+U.unit(); }}}},
        scales:{x:{grid:{display:false},ticks:{font:{size:11}}},y:{grid:{color:'#eef0f2'},ticks:{font:{size:11}}}}}});
    var sh=s.filter(function(x){ return Math.abs(x.dsh)>0.3; }).sort(function(a,b){ return b.dsh-a.dsh; }).slice(0,10);
    if(cs){ cs.destroy(); cs=null; }
    cs=new Chart($('chartShift').getContext('2d'),{type:'bar',data:{labels:sh.map(function(x){ return U.nm(x.p); }),datasets:[{label:U.T('份额变化（pp）','Share change (pp)'),data:sh.map(function(x){ return +x.dsh.toFixed(1); }),backgroundColor:sh.map(function(x){ return x.dsh>0?'#C00000':'#1f9d6b'; }),borderRadius:3,barPercentage:0.65}]},
      options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false},tooltip:{callbacks:{label:function(t){ return U.ppS(t.parsed.y); }}}},scales:{x:{grid:{display:false},ticks:{font:{size:11}}},y:{grid:{color:'#eef0f2'},ticks:{font:{size:11},callback:function(v){ return v+'pp'; }}}}}});
    $('ct').textContent=U.T('来源国明细','Source detail');
    var mx=Math.max.apply(null, s.map(function(x){ return x.sc; }).concat([1]));
    $('srcHead').innerHTML='<tr><th>'+U.T('来源国','Source')+'</th><th>'+U.prevS()+' ('+U.unit()+')</th><th>'+U.curS()+' ('+U.unit()+')</th><th>'+U.T('量变化','Change')+'</th><th>'+U.T('份额 ','Share ')+U.prevS()+'</th><th>'+U.T('份额 ','Share ')+U.curS()+'</th><th>'+U.T('份额变化（pp）','Share change (pp)')+'</th><th>'+U.T('份额','Share bar')+'</th></tr>';
    $('sourceTbody').innerHTML=s.map(function(x){ var k=x.dsh>0.5?'sh-up':x.dsh<-0.5?'sh-down':'sh-flat';
      return '<tr><td><b>'+U.nm(x.p)+'</b></td><td>'+U.v(x.pv)+'</td><td>'+U.v(x.c)+'</td><td class="'+(x.dq>=0?'sh-up':'sh-down')+'">'+U.dv(x.dq)+'</td><td>'+x.sp.toFixed(1)+'%</td><td>'+x.sc.toFixed(1)+'%</td><td class="'+k+'">'+U.ppS(x.dsh)+'</td>'+
        '<td><div style="height:7px;background:#f3f4f6;border-radius:4px;width:120px"><div style="height:7px;border-radius:4px;background:#C00000;width:'+(x.sc/mx*100).toFixed(0)+'%"></div></div></td></tr>'; }).join('');
  }
  function global(){
    var rows=H.reps.filter(function(c){ return !H.C[c].lm && H.C[c].m[1]>=20; }).map(subst).filter(Boolean).sort(function(a,b){ return b.score-a.score; }).slice(0,15);
    $('g2t').textContent=U.T('全局替代机会表 TOP 15','Global substitution table — top 15');
    $('g2s').textContent=U.T('跨主要进口市场，份额上升最多的新供应方替代份额下降最多的原供应方；按替代强度降序；进口数据存疑的市场不参与。','Across the main import markets: the supplier gaining the most share against the one losing the most, ranked by substitution score; markets with questionable import records are excluded.');
    $('oppHead').innerHTML='<tr><th>#</th><th>'+U.T('进口市场','Market')+'</th><th>'+U.T('原供应国（降）','Losing supplier')+'</th><th>'+U.T('新供应国（升）','Gaining supplier')+'</th><th>'+U.T('原降幅（pp）','Loss (pp)')+'</th><th>'+U.T('新增幅（pp）','Gain (pp)')+'</th><th>'+U.T('量转移（'+U.unit()+'）','Switched ('+U.unit()+')')+'</th><th>'+U.T('市场总量变化','Market y/y')+'</th><th>'+U.T('置信','Confidence')+'</th></tr>';
    $('globalOppTbody').innerHTML=rows.map(function(x,i){ return '<tr><td>'+(i+1)+'</td><td><b>'+U.nm(x.m)+'</b></td><td>'+U.nm(x.l.p)+'</td><td style="color:var(--red);font-weight:700">'+U.nm(x.g.p)+'</td><td class="sh-down">'+U.ppS(x.l.dsh)+'</td><td class="sh-up">'+U.ppS(x.g.dsh)+'</td><td>'+U.v(x.score)+'</td><td class="'+(x.tot>=0?'sh-up':'sh-down')+'">'+U.pct(x.tot)+'</td><td>'+conf(x.conf)+'</td></tr>'; }).join('');
  }
  function render(){
    var E=U.en();
    $('hTag').textContent=U.T('全球钢材贸易情报 · 贸易转移','GLOBAL STEEL TRADE INTELLIGENCE · TRADE SHIFT');
    $('hTitle').innerHTML=U.T('贸易转移分析','Trade Shift')+'<span class="h1-per">'+U.cur()+' vs '+U.prev()+'</span>';
    $('hSub').textContent=U.T('谁替代了谁 · 进口国自报口径（IMPORT）· '+U.cur()+'对比'+U.prev(),'Who replaced whom · importer-declared (IMPORT) · '+U.cur()+' vs '+U.prev());
    $('s1t').textContent=U.T('进口市场深度分析','Import market deep dive'); $('lblMk').textContent=U.T('选择进口市场：','Import market:');
    var sel=$('marketSelect'); sel.innerHTML=''; MK.forEach(function(c){ sel.add(new Option(U.nm(c)+(H.C[c].lm?' ⚠':''),c)); }); sel.value=cur;
    heroIns(); market(); global();
    $('pgNote').innerHTML=U.dqNote();
  }
  window.updateMarket=function(){ cur=$('marketSelect').value; market(); };
  window.__relang=function(){ try{ render(); }catch(e){ console.error(e); } };
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', render); else render();
})();
