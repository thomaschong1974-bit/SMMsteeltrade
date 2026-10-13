/* Risk & Dependency page — HHI concentration on the year-to-date period (window.H1). */
(function(){
  'use strict';
  var H = window.H1, U = window.HU; if(!H || !U) return;
  var $ = function(id){ return document.getElementById(id); };
  var MIN = 5;   /* 万吨 in the period */
  function rows(){
    return H.reps.map(function(c){
      var d=H.C[c], tx=d.x[0]||0, tm=d.m[0]||0;
      var dest=d.dest, src=d.src;
      var gx=Object.keys(d.gx).map(function(g){ return [g,d.gx[g][0]]; }).sort(function(a,b){ return b[1]-a[1]; });
      var gt=gx.reduce(function(s,x){ return s+x[1]; },0)||1;
      return { c:c, d:d, tx:tx, tm:tm,
        ex:d.hx[0], exp:d.hx[1], im:d.hm[0], imp:d.hm[1], pr:d.hp[0], prp:d.hp[1],
        t1:dest[0]?dest[0][0]:null, t1s:dest[0]&&tx?dest[0][1]/tx:null, t3s:tx?dest.slice(0,3).reduce(function(s,x){ return s+x[1]; },0)/tx:null, t3:dest.slice(0,3).map(function(x){ return x[0]; }),
        i1:src[0]?src[0][0]:null, i1s:src[0]&&tm?src[0][1]/tm:null, i3s:tm?src.slice(0,3).reduce(function(s,x){ return s+x[1]; },0)/tm:null, i3:src.slice(0,3).map(function(x){ return x[0]; }),
        p1:gx[0]?gx[0][0]:null, p1s:gx[0]?gx[0][1]/gt:null };
    });
  }
  var cls=function(h){ return h==null?'low':h>=0.5?'high':h>=0.25?'med':'low'; };
  var txt=function(h){ return h==null?U.T('无数据','no data'):U.T(h>=0.5?'高度集中':h>=0.25?'较集中':'相对分散', h>=0.5?'Highly concentrated':h>=0.25?'Moderately concentrated':'Relatively dispersed'); };
  var badge=function(h){ return '<span class="risk-'+cls(h)+'">'+txt(h)+'</span>'; };
  var bar=function(h){ if(h==null) return '—'; return '<div class="hhi-bar-wrap"><div class="hhi-bar" style="width:'+Math.round(h*120)+'px"></div><span class="hhi-val">'+h.toFixed(3)+'</span></div>'; };
  var dh=function(a,b){ if(a==null||b==null) return '—'; var d=a-b; return '<span class="'+(d>0.005?'dn':d<-0.005?'up':'')+'">'+(d>=0?'+':'−')+Math.abs(d).toFixed(3)+'</span>'; };
  var pc=function(v){ return v==null?'—':(v*100).toFixed(1)+'%'; };
  var nl=function(a){ return a.map(U.nm).join(U.en()?', ':'、'); };

  function table(id, list, key, keyp, tot, head1, extra){
    var E=U.en();
    $(id).innerHTML='<thead><tr><th>'+U.T('国家','Country')+'</th><th>'+head1+'</th><th>'+U.T('较'+U.prevS(),'vs '+U.prevS())+'</th><th>'+U.T('风险等级','Risk')+'</th><th>'+U.T('量（'+U.unit()+'）','Volume ('+U.unit()+')')+'</th>'+extra.h+'</tr></thead><tbody>'+
      list.map(function(r,i){ return '<tr><td>'+(i+1)+'. '+U.nm(r.c)+(extra.low(r)?U.warn():'')+'</td><td>'+bar(r[key])+'</td><td>'+dh(r[key],r[keyp])+'</td><td>'+badge(r[key])+'</td><td>'+U.v(r[tot])+'</td>'+extra.row(r)+'</tr>'; }).join('')+'</tbody>';
  }
  function render(){
    var E=U.en(), R=rows();
    $('hTag').textContent='RISK & DEPENDENCY · '+U.cur();
    $('hTitle').textContent=U.T('全球钢材贸易结构风险分析','Steel trade concentration & dependency risk');
    $('hEn').textContent=E?'HHI-based framework · '+U.cur()+' vs '+U.prev():'基于 HHI 的集中度框架 · '+U.cur()+'对比'+U.prev();
    $('hLead').innerHTML=U.T('基于'+U.cur()+'进出口数据（'+H.reps.length+' 个主要报告国），计算<b>出口目的地集中度（HHI）</b>、<b>进口来源集中度（HHI）</b>和<b>出口产品结构集中度（HHI）</b>，并与'+U.prev()+'对比，识别贸易链脆弱环节。HHI 越接近 1，越依赖单一市场、来源或产品。',
      'Using '+U.cur()+' trade data for '+H.reps.length+' major reporters, we compute <b>export-destination</b>, <b>import-source</b> and <b>export-product</b> concentration (HHI) and compare with '+U.prev()+' to locate fragile links. The closer HHI is to 1, the heavier the reliance on a single market, source or product.');
    $('hMeta').innerHTML='<span><b>'+U.T('数据口径','Period')+'</b> '+U.cur()+'</span><span><b>'+U.T('样本门槛','Threshold')+'</b> '+U.T('期内进口或出口 ≥ 5 万吨','≥ 0.05 Mt exports or imports in the period')+'</span><span><b>'+U.T('国家数量','Countries')+'</b> '+H.reps.length+'</span><span><b>'+U.T('指标','Metrics')+'</b> '+U.T('出口HHI · 进口HHI · 产品HHI · Top1/Top3依赖度','Export HHI · Import HHI · Product HHI · Top-1/Top-3 reliance')+'</span>';
    var ex=R.filter(function(r){ return r.tx>=MIN && r.ex!=null; }).sort(function(a,b){ return b.ex-a.ex; });
    var im=R.filter(function(r){ return r.tm>=MIN && r.im!=null; }).sort(function(a,b){ return b.im-a.im; });
    var pr=R.filter(function(r){ return r.tx>=MIN && r.pr!=null; }).sort(function(a,b){ return b.pr-a.pr; });
    /* insights (low-confidence flows are not headlined) */
    var exk=ex.filter(function(r){ return !r.d.lx; }), imk=im.filter(function(r){ return !r.d.lm; }), prk=pr.filter(function(r){ return !r.d.lx; });
    var e0=exk[0], e1=exk[1], p0=prk[0], p1=prk[1];
    var hiImp=imk.filter(function(r){ return r.im>=0.5; });
    var mv=R.filter(function(r){ return r.tm>=20 && r.imp!=null && !r.d.lm; }).map(function(r){ return [r, r.im-r.imp]; }).sort(function(a,b){ return b[1]-a[1]; });
    var ins=[
      [U.T('出口集中度警示','Export concentration'), U.T('<b>'+U.nm(e0.c)+'</b>（HHI '+e0.ex.toFixed(3)+'）、<b>'+U.nm(e1.c)+'</b>（HHI '+e1.ex.toFixed(3)+'）出口最集中；前者 '+pc(e0.t1s)+' 出口流向'+U.nm(e0.t1)+'。',
        '<b>'+U.nm(e0.c)+'</b> (HHI '+e0.ex.toFixed(3)+') and <b>'+U.nm(e1.c)+'</b> (HHI '+e1.ex.toFixed(3)+') have the most concentrated exports; the former sends '+pc(e0.t1s)+' to '+U.nmp(e0.t1)+'.')],
      [U.T('进口来源单一化','Single-source imports'), hiImp.length? (function(){ var nm4=hiImp.slice(0,4), srcs=nm4.map(function(r){ return r.i1; }), same=srcs.every(function(s){ return s===srcs[0]; });
        return U.T('<b>'+nl(nm4.map(function(r){ return r.c; }))+'</b>'+(hiImp.length>4?'等 '+hiImp.length+' 国':'')+'进口 HHI ≥ 0.5，最大来源'+(same?'均为'+U.nm(srcs[0]):'分别为'+nl(srcs))+'。',
          '<b>'+U.list(nm4.map(function(r){ return U.nmp(r.c); }))+'</b>'+(hiImp.length>4?' and '+(hiImp.length-4)+' others':'')+' have import HHI ≥ 0.5; '+(same?'the largest source for '+(nm4.length>2?'all of them':nm4.length===2?'both':'it')+' is '+U.nm(srcs[0]):'their largest sources are '+U.list(srcs.map(U.nm)))+'.'); })() : U.T('没有国家进口 HHI ≥ 0.5。','No country has import HHI ≥ 0.5.')],
      [U.T('产品结构单一','Narrow product mix'), U.T('<b>'+U.nm(p0.c)+'</b>（产品HHI '+p0.pr.toFixed(3)+'，'+U.pz(p0.p1)+'占 '+pc(p0.p1s)+'）与<b>'+U.nm(p1.c)+'</b>（'+p1.pr.toFixed(3)+'，'+U.pz(p1.p1)+'占 '+pc(p1.p1s)+'）出口品种最单一。',
        '<b>'+U.nm(p0.c)+'</b> (product HHI '+p0.pr.toFixed(3)+'; '+U.pz(p0.p1)+' '+pc(p0.p1s)+') and <b>'+U.nm(p1.c)+'</b> ('+p1.pr.toFixed(3)+'; '+U.pz(p1.p1)+' '+pc(p1.p1s)+') have the narrowest export mix.')],
      [U.T('依赖度变化','Shift in dependence'), mv.length? U.T('来源集中度上升最多：<b>'+U.nm(mv[0][0].c)+'</b>（HHI '+U.sn(mv[0][1])+'，最大来源 '+U.nm(mv[0][0].i1)+' '+pc(mv[0][0].i1s)+'）；下降最多：<b>'+U.nm(mv[mv.length-1][0].c)+'</b>（'+U.sn(mv[mv.length-1][1])+'）。',
        'Largest rise in source concentration: <b>'+U.nm(mv[0][0].c)+'</b> (HHI '+U.sn(mv[0][1])+'; top source '+U.nm(mv[0][0].i1)+' '+pc(mv[0][0].i1s)+'); largest fall: <b>'+U.nm(mv[mv.length-1][0].c)+'</b> ('+U.sn(mv[mv.length-1][1])+').') : '—']
    ];
    $('insights-grid').innerHTML=ins.map(function(x){ return '<div class="insight-card"><span class="ic-label">'+x[0]+'</span><div class="ic-text">'+x[1]+'</div></div>'; }).join('');
    $('h01').textContent=U.T('出口目的地集中度 TOP 榜','Export-destination concentration'); $('s01').textContent=U.T('过滤：期内出口 ≥ 5 万吨；HHI 0–1，越高越集中','Filter: exports ≥ 0.05 Mt in the period; HHI 0–1, higher = more concentrated');
    $('h02').textContent=U.T('进口来源集中度 TOP 榜','Import-source concentration'); $('s02').textContent=U.T('过滤：期内进口 ≥ 5 万吨；依赖单一来源的风险','Filter: imports ≥ 0.05 Mt in the period; single-source dependency risk');
    $('h03').textContent=U.T('出口产品结构集中度 TOP 榜','Export-product concentration'); $('s03').textContent=U.T('过滤：期内出口 ≥ 5 万吨；品种过度单一 = 抗周期能力弱','Filter: exports ≥ 0.05 Mt in the period; a narrow mix = weaker cycle resilience');
    table('tbl-exp', ex, 'ex','exp','tx', U.T('出口HHI','Export HHI'), {h:'<th>'+U.T('Top1目的地','Top-1 market')+'</th><th>'+U.T('Top1份额','Top-1 share')+'</th><th>'+U.T('Top3份额','Top-3 share')+'</th><th>'+U.T('Top3目的地','Top-3 markets')+'</th>',
      row:function(r){ return '<td><b>'+U.nm(r.t1)+'</b></td><td>'+pc(r.t1s)+'</td><td>'+pc(r.t3s)+'</td><td style="max-width:200px;white-space:normal;font-size:12px;color:var(--muted)">'+nl(r.t3)+'</td>'; }, low:function(r){ return r.d.lx; }});
    table('tbl-imp', im, 'im','imp','tm', U.T('进口HHI','Import HHI'), {h:'<th>'+U.T('Top1来源','Top-1 source')+'</th><th>'+U.T('Top1份额','Top-1 share')+'</th><th>'+U.T('Top3份额','Top-3 share')+'</th><th>'+U.T('Top3来源','Top-3 sources')+'</th>',
      row:function(r){ return '<td><b>'+U.nm(r.i1)+'</b></td><td>'+pc(r.i1s)+'</td><td>'+pc(r.i3s)+'</td><td style="max-width:200px;white-space:normal;font-size:12px;color:var(--muted)">'+nl(r.i3)+'</td>'; }, low:function(r){ return r.d.lm; }});
    table('tbl-prod', pr, 'pr','prp','tx', U.T('产品HHI','Product HHI'), {h:'<th>'+U.T('主导品种','Leading product')+'</th><th>'+U.T('主导品种占比','Leading share')+'</th>',
      row:function(r){ return '<td><b>'+U.pz(r.p1)+'</b></td><td>'+pc(r.p1s)+'</td>'; }, low:function(r){ return r.d.lx; }});
    /* profile */
    $('h04').textContent=U.T('国家风险画像','Country risk profile'); $('s04').textContent=U.T('选择国家，查看三维风险评分与集中细节','Pick a country to see its three-way concentration profile');
    var sel=$('country-select'), v=sel.value; sel.innerHTML='<option value="">'+U.T('— 选择国家 —','— select a country —')+'</option>';
    H.reps.slice().sort(function(a,b){ return H.C[b].x[0]+H.C[b].m[0]-H.C[a].x[0]-H.C[a].m[0]; }).forEach(function(c){ sel.add(new Option(U.nm(c),c)); });
    sel.value=v||'中国'; profile(sel.value, R);
    $('h05').textContent=U.T('指标方法说明','Methodology');
    $('method').innerHTML=U.T(
      '<p><b>赫芬达尔-赫希曼指数（HHI）</b>：HHI = Σ（各分项份额²），份额以小数计，范围 0–1；1 表示完全集中于单一对象。</p>'+
      '<p style="margin-top:8px"><b>出口目的地 HHI</b>：每个报告国'+U.cur()+'对各目的地的出口量占其总出口的份额平方和；Top1/Top3 依赖度为最大一个/前三个目的地份额之和。</p>'+
      '<p style="margin-top:8px"><b>进口来源 HHI</b>：同理，基于该国自报的进口数据。</p>'+
      '<p style="margin-top:8px"><b>出口产品 HHI</b>：基于 SMM 十七大钢材品种（钢坯、热轧、冷轧、涂镀、中厚板、带钢、线盘、棒材、型钢、钢轨、钢管、钢管附件、钢丝、异型材、不锈钢、硅钢、其他）。</p>'+
      '<p style="margin-top:8px"><b>风险分级</b>：HHI ≥ 0.5 高度集中（红）；0.25–0.5 较集中（黄）；&lt; 0.25 相对分散（绿）。「较'+U.prevS()+'」为 HHI 变化，正值（红）表示更集中。</p>'+
      '<p style="margin-top:8px"><b>数据质控</b>：已剔除未获伙伴记录印证的异常值；标注「数据存疑」的国家仅展示，不进入核心发现。</p>',
      '<p><b>Herfindahl-Hirschman Index (HHI)</b>: HHI = Σ(share²), shares as decimals, range 0–1; 1 means complete reliance on a single counterpart.</p>'+
      '<p style="margin-top:8px"><b>Export-destination HHI</b>: for each reporter, the squared shares of each destination in its '+U.cur()+' exports. Top-1/Top-3 reliance = share of the largest / three largest destinations.</p>'+
      '<p style="margin-top:8px"><b>Import-source HHI</b>: the same, based on the country\'s own import records.</p>'+
      '<p style="margin-top:8px"><b>Export-product HHI</b>: across SMM\'s 17 steel product groups (billet, HRC, CRC, coated, plate, strip, wire rod, bar, sections, rail, pipe, pipe fittings, wire, special profiles, stainless, electrical steel, others).</p>'+
      '<p style="margin-top:8px"><b>Risk bands</b>: HHI ≥ 0.5 highly concentrated (red); 0.25–0.5 moderately concentrated (amber); &lt; 0.25 dispersed (green). "vs '+U.prevS()+'" is the HHI change; positive (red) = more concentrated.</p>'+
      '<p style="margin-top:8px"><b>Data quality</b>: outliers not corroborated by partner records are removed; countries marked "check data" are shown but not headlined.</p>');
    $('pgNote').innerHTML=U.dqNote();
  }
  function profile(name, R){
    if(!name){ $('profile-content').style.display='none'; $('profile-empty').style.display='block'; $('profile-empty').textContent=U.T('请从下拉菜单中选择一个国家以查看其风险画像。','Select a country from the menu to see its risk profile.'); $('profile-name').textContent=U.T('选择国家','Select a country'); return; }
    R=R||rows(); var r=R.filter(function(x){ return x.c===name; })[0]; if(!r) return;
    $('profile-name').textContent=U.nm(name); $('profile-content').style.display='block'; $('profile-empty').style.display='none';
    var over=Math.max(r.ex||0,r.im||0), c=cls(over);
    $('profile-risk-label').innerHTML='<span class="risk-label-big '+c+'">'+U.T({high:'高风险综合画像',med:'中等风险综合画像',low:'低风险综合画像'}[c],{high:'High-risk profile',med:'Medium-risk profile',low:'Low-risk profile'}[c])+'</span>';
    var parts=[];
    if(r.ex!=null && r.tx>=MIN) parts.push(U.T('出口目的地'+txt(r.ex)+'（HHI='+r.ex.toFixed(3)+'），最大市场<b>'+U.nm(r.t1)+'</b>占 '+pc(r.t1s)+'，前三合计 '+pc(r.t3s),'Export destinations '+txt(r.ex).toLowerCase()+' (HHI='+r.ex.toFixed(3)+'); largest market <b>'+U.nm(r.t1)+'</b> '+pc(r.t1s)+', top three '+pc(r.t3s)));
    if(r.im!=null && r.tm>=MIN) parts.push(U.T('进口来源'+txt(r.im)+'（HHI='+r.im.toFixed(3)+'），最大来源<b>'+U.nm(r.i1)+'</b>占 '+pc(r.i1s)+'，前三合计 '+pc(r.i3s),'Import sources '+txt(r.im).toLowerCase()+' (HHI='+r.im.toFixed(3)+'); largest source <b>'+U.nm(r.i1)+'</b> '+pc(r.i1s)+', top three '+pc(r.i3s)));
    if(r.pr!=null && r.tx>=MIN) parts.push(U.T('出口品种'+txt(r.pr)+'（HHI='+r.pr.toFixed(3)+'），主导品种<b>'+U.pz(r.p1)+'</b>占 '+pc(r.p1s),'Export product mix '+txt(r.pr).toLowerCase()+' (HHI='+r.pr.toFixed(3)+'); leading product <b>'+U.pz(r.p1)+'</b> '+pc(r.p1s)));
    $('profile-risk-summary').innerHTML=parts.join(U.en()?'.<br>':'；<br>')+(parts.length?U.T('。','.'):'')+((r.d.lx||r.d.lm)?'<br><span style="color:#b45309">'+U.T('⚠ 该国部分数据与贸易伙伴记录差异较大，仅供参考。','⚠ Some of this country\'s records differ materially from partner data; treat with caution.')+'</span>':'');
    var k=function(l,v,s,c2){ return '<div class="kpi '+(c2||'')+'"><span class="kpi-label">'+l+'</span><div class="kpi-val">'+v+'</div><div class="kpi-sub">'+s+'</div></div>'; };
    var kc=function(h){ return cls(h)=='high'?'danger':cls(h)=='med'?'warn':''; };
    $('profile-kpis').innerHTML=[
      k(U.T('出口HHI','Export HHI'), r.ex==null?'—':r.ex.toFixed(3), U.T('出口 ','Exports ')+U.vu(r.tx), kc(r.ex)),
      k(U.T('进口HHI','Import HHI'), r.im==null?'—':r.im.toFixed(3), U.T('进口 ','Imports ')+U.vu(r.tm), kc(r.im)),
      k(U.T('产品HHI','Product HHI'), r.pr==null?'—':r.pr.toFixed(3), r.p1?U.T('主导：','Leading: ')+U.pz(r.p1):'—', kc(r.pr)),
      k(U.T('Top1出口市场','Top-1 export market'), U.nm(r.t1), U.T('占出口 ','of exports ')+pc(r.t1s)),
      k(U.T('Top3出口市场','Top-3 export markets'), pc(r.t3s), nl(r.t3)),
      k(U.T('Top1进口来源','Top-1 import source'), U.nm(r.i1), U.T('占进口 ','of imports ')+pc(r.i1s))].join('');
    $('profile-exp-detail').innerHTML=''; $('profile-imp-detail').innerHTML='';
  }
  window.showProfile=function(v){ profile(v); };
  window.__relang=function(){ try{ render(); }catch(e){ console.error(e); } };
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', render); else render();
})();
