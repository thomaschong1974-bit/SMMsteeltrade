/* Year-to-date (H1) snapshot panel for the Country, Product and Bilateral pages (window.H1).
   The long-run annual profiles below the panel stay as they are; this panel carries the current-year read. */
(function(){
  'use strict';
  var H = window.H1, U = window.HU; if(!H || !U) return;
  var C = H.C, page = /country_report/.test(location.pathname) ? 'country' : /product_report/.test(location.pathname) ? 'product' : /bilateral/.test(location.pathname) ? 'bilateral' : '';
  if(!page){ var t=document.title||''; page = /国家画像|Country/.test(t)?'country':/产品|Product/.test(t)?'product':/双边|Bilateral/.test(t)?'bilateral':''; }
  var css='.snap{background:#fff;border:1px solid #e9ebee;border-left:3px solid #C00000;border-radius:12px;padding:16px 18px;margin:18px 0 22px;font-family:inherit}'+
    '.snap-h{display:flex;align-items:baseline;gap:10px;flex-wrap:wrap;margin-bottom:10px}.snap-t{font-size:15.5px;font-weight:800;color:#16191d}.snap-s{font-size:11.5px;color:#8a919c}'+
    '.snap-k{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px;margin-bottom:10px}.snap-kb{background:#fafbfc;border:1px solid #eef0f2;border-radius:9px;padding:9px 11px}'+
    '.snap-kl{font-size:11px;color:#79808a}.snap-kv{font-size:19px;font-weight:800;color:#16191d;font-variant-numeric:tabular-nums}.snap-kv small{font-size:12px;font-weight:600;margin-left:6px}'+
    '.snap-c{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:12px}.snap-c h5{font-size:12px;font-weight:800;color:#5b636d;margin:2px 0 6px}'+
    '.snap-c table{width:100%;border-collapse:collapse;font-size:12px}.snap-c td{padding:3px 4px;border-bottom:1px dashed #f0f1f3}.snap-c td.r{text-align:right;font-variant-numeric:tabular-nums}'+
    '.snap-n{font-size:11px;color:#9aa1ab;margin-top:8px}';
  var st=document.createElement('style'); st.textContent=css; document.head.appendChild(st);
  var box=document.createElement('section'); box.className='snap'; box.id='h1Snap';
  function mount(){
    if(document.getElementById('h1Snap')) return;
    var host = document.querySelector('main.wrap') || document.querySelector('.main') || document.querySelector('main');
    if(page==='bilateral'){ var hero=document.querySelector('.hero'); if(hero && hero.parentNode){ hero.parentNode.insertBefore(box, hero.nextSibling); return; } }
    if(host) host.insertBefore(box, host.firstChild); else document.body.appendChild(box);
  }
  var kb=function(l,v,y,flag){ return '<div class="snap-kb"><div class="snap-kl">'+l+(flag?U.warn():'')+'</div><div class="snap-kv">'+v+(y==null?'':'<small class="'+U.cls(y)+'">'+U.pct(y)+'</small>')+'</div></div>'; };
  var trow=function(n,c,p){ var y=U.yoy(c,p); return '<tr><td>'+n+'</td><td class="r">'+U.v(c)+'</td><td class="r '+U.cls(y)+'">'+(p<0.5?U.T('新增','new'):U.pct(y,0))+'</td></tr>'; };
  var drow=function(n,d){ return '<tr><td>'+n+'</td><td class="r '+(d>=0?'up':'dn')+'">'+U.dv(d)+'</td></tr>'; };
  var head=function(t){ return '<div class="snap-h"><span class="snap-t">'+t+'</span><span class="h1-per">'+U.cur()+' vs '+U.prev()+'</span><span class="snap-s">'+U.T('单位：','Unit: ')+U.unit()+U.T(' · 下方为 2010–'+H.per.py+' 年度画像',' · annual profile 2010–'+H.per.py+' below')+'</span></div>'; };

  function country(c){
    if(!c) return;
    if(!C[c]){ box.innerHTML=head(U.T(U.nm(c)+' · 年内速览',U.nm(c)+' · year to date'))+'<div class="snap-n">'+U.T('该国不在 '+H.reps.length+' 个月度报告国范围内，年内数据请参考其贸易伙伴的记录（「双边流向」页）。','This country is not one of the '+H.reps.length+' monthly reporters; see its partners\' records on the Bilateral page.')+'</div>'; return; }
    var d=C[c];
    var mv=function(arr){ var x=arr.filter(function(r){ return Math.max(r[1],r[2])>=5; }).map(function(r){ return [r[0], r[1]-r[2]]; }); return {up:x.slice().sort(function(a,b){ return b[1]-a[1]; }).filter(function(r){ return r[1]>0; }).slice(0,3), dn:x.slice().sort(function(a,b){ return a[1]-b[1]; }).filter(function(r){ return r[1]<0; }).slice(0,3)}; };
    var dm=mv(d.dest), sm=mv(d.src);
    var gx=Object.keys(d.gx).map(function(g){ return [g, d.gx[g][0]-d.gx[g][1]]; }).sort(function(a,b){ return Math.abs(b[1])-Math.abs(a[1]); }).slice(0,4);
    box.innerHTML=head(U.T(U.nm(c)+' · 年内速览',U.nm(c)+' · year to date'))+
      '<div class="snap-k">'+kb(U.T('出口','Exports'),U.v(d.x[0]),d.xy,d.lx)+kb(U.T('进口','Imports'),U.v(d.m[0]),d.my,d.lm)+kb(U.T('出口份额','Export share'),d.xs[0].toFixed(1)+'%',null)+kb(U.T('净出口','Net exports'),U.v(d.x[0]-d.m[0]),null)+'</div>'+
      '<div class="snap-c"><div><h5>'+U.T('主要目的地','Top destinations')+'</h5><table>'+d.dest.slice(0,5).map(function(r){ return trow(U.nm(r[0]),r[1],r[2]); }).join('')+'</table></div>'+
      '<div><h5>'+U.T('目的地增减（'+U.unit()+'）','Destination changes ('+U.unit()+')')+'</h5><table>'+dm.up.concat(dm.dn).map(function(r){ return drow(U.nm(r[0]),r[1]); }).join('')+'</table></div>'+
      '<div><h5>'+U.T('进口来源增减','Import source changes')+'</h5><table>'+sm.up.concat(sm.dn).map(function(r){ return drow(U.nm(r[0]),r[1]); }).join('')+'</table></div>'+
      '<div><h5>'+U.T('出口品种增减','Export product changes')+'</h5><table>'+gx.map(function(r){ return drow(U.pz(r[0]),r[1]); }).join('')+'</table></div></div>'+
      ((d.lx||d.lm)?'<div class="snap-n" style="color:#b45309">'+U.T('⚠ 该国部分数据与贸易伙伴记录差异较大，仅供参考。','⚠ Some of this country\'s records differ materially from partner data; treat with caution.')+'</div>':'');
  }
  var OLD = {'热轧':'热轧 (Hot Rolled)','涂镀':'涂镀 (Coated Steel)','钢坯':'钢坯 (Billet)','螺纹钢':'棒材 (Steel Bar)','棒材':'棒材 (Steel Bar)','线盘':'线盘 (Wire Rod)','钢丝':'钢丝 (Steel Wire)','冷轧':'冷轧 (Cold Rolled)','不锈钢':'不锈钢 (Stainless Steel)','型钢':'型钢 (Section Steel)','中厚板':'中厚板 (Medium & Heavy Plate)','钢管':'钢管 (Steel Pipe)','硅钢':'硅钢 (Electrical Steel)','其他':'其他 (Others)','钢轨':'钢轨 (Steel Rail)','钢管附件':'钢管附件 (Steel Pipe Fittings)','异型材':'异型材 (Special Profiles)','带钢':'带钢 (Steel Strip)'};
  function product(g0){
    if(!g0) return; var g=OLD[String(g0).replace(/\s*\(.*\)$/,'')]||g0;
    var P=H.prod.filter(function(p){ return p.g===g; })[0]; if(!P){ box.innerHTML=''; return; }
    var rows=H.reps.filter(function(c){ return C[c].gx[g]; }).map(function(c){ return [c, C[c].gx[g][0], C[c].gx[g][1]]; });
    var top=rows.slice().sort(function(a,b){ return b[1]-a[1]; }).slice(0,6);
    var mv=rows.filter(function(r){ return !C[r[0]].lx && Math.max(r[1],r[2])>=5; }).map(function(r){ return [r[0], r[1]-r[2]]; });
    var up=mv.slice().sort(function(a,b){ return b[1]-a[1]; }).filter(function(r){ return r[1]>0; }).slice(0,4), dn=mv.slice().sort(function(a,b){ return a[1]-b[1]; }).filter(function(r){ return r[1]<0; }).slice(0,4);
    var tot=H.prod.reduce(function(s,p){ return s+p.c; },0)||1;
    var im=H.reps.filter(function(c){ return C[c].gm[g] && !C[c].lm; }).map(function(c){ return [c, C[c].gm[g][0], C[c].gm[g][1]]; }).sort(function(a,b){ return b[1]-a[1]; }).slice(0,6);
    box.innerHTML=head(U.T(U.pz(g)+' · 年内速览',U.pz(g)+' · year to date'))+
      '<div class="snap-k">'+kb(U.T('报告国出口合计','Exports (reporters)'),U.v(P.c),U.yoy(P.c,P.p))+kb(U.T('占钢材出口','Share of steel exports'),(P.c/tot*100).toFixed(1)+'%',null)+kb(U.T('第一出口国','Top exporter'),top[0]?U.nm(top[0][0]):'—',null)+'</div>'+
      '<div class="snap-c"><div><h5>'+U.T('主要出口国','Top exporters')+'</h5><table>'+top.map(function(r){ return trow(U.nm(r[0]),r[1],r[2]); }).join('')+'</table></div>'+
      '<div><h5>'+U.T('出口国增减（'+U.unit()+'）','Exporter changes ('+U.unit()+')')+'</h5><table>'+up.concat(dn).map(function(r){ return drow(U.nm(r[0]),r[1]); }).join('')+'</table></div>'+
      '<div><h5>'+U.T('主要进口国（进口国口径）','Top importers (importer-declared)')+'</h5><table>'+im.map(function(r){ return trow(U.nm(r[0]),r[1],r[2]); }).join('')+'</table></div></div>';
  }
  function bilateral(e, i){
    if(!e||!i) return;
    var ex=H.cor.filter(function(r){ return r[0]===e&&r[1]===i; })[0], im=(H.icor||[]).filter(function(r){ return r[0]===i&&r[1]===e; })[0];
    var flag=ex?ex[4]:'';
    var eTxt = C[e] ? (ex? U.vu(ex[2])+'（'+U.pct(U.yoy(ex[2],ex[3]))+'）' : U.T('低于 0.5 万吨','below 5 kt')) : U.T('出口方非月度报告国','exporter not a monthly reporter');
    var iTxt = C[i] ? (im? U.vu(im[2])+'（'+U.pct(U.yoy(im[2],im[3]))+'）' : U.T('低于 0.5 万吨','below 5 kt')) : U.T('进口方非月度报告国','importer not a monthly reporter');
    if(U.en()){ eTxt=eTxt.replace('（',' (').replace('）',')'); iTxt=iTxt.replace('（',' (').replace('）',')'); }
    var verdict = flag ? U.T('⚠ 两端海关记录差异较大（'+({'exporter baseline gap':'出口方上年基数缺口','importer baseline gap':'进口方上年基数缺口','direction differs':'变化方向相反','growth differs':'增速差异过大','new lane, sides disagree':'新增通道两端不一致'}[flag]||flag)+'），同比仅供参考。',
                                  '⚠ The two customs records differ materially ('+flag+'); treat the y/y with caution.')
                       : (ex&&im ? (function(){ var ya=U.yoy(ex[2],ex[3]), yb=U.yoy(im[2],im[3]);
                            if(ya==null||yb==null) return '';
                            if(ya*yb>=0) return U.T('两端记录方向一致，可信度较高。','Both customs records point the same way.');
                            if(Math.abs(ya)<10&&Math.abs(yb)<10) return U.T('两端记录接近，变化幅度均在 ±10% 以内。','The two records are close; both changes are within ±10%.');
                            return U.T('⚠ 两端记录变化方向不一致，同比仅供参考。','⚠ The two records move in opposite directions; treat the y/y with caution.'); })() : '');
    box.innerHTML=head(U.T(U.nm(e)+' → '+U.nm(i)+' · 年内速览',U.nm(e)+' → '+U.nm(i)+' · year to date'))+
      '<div class="snap-k">'+kb(U.T('出口方申报','Exporter-declared'),ex?U.v(ex[2]):'—',ex?U.yoy(ex[2],ex[3]):null,!!flag)+kb(U.T('进口方申报','Importer-declared'),im?U.v(im[2]):'—',im?U.yoy(im[2],im[3]):null,!!flag)+
        kb(U.prev()+U.T('（出口方）',' (exporter)'),ex?U.v(ex[3]):'—',null)+kb(U.prev()+U.T('（进口方）',' (importer)'),im?U.v(im[3]):'—',null)+'</div>'+
      '<div class="snap-n">'+U.T('出口方：','Exporter: ')+eTxt+' · '+U.T('进口方：','Importer: ')+iTxt+(verdict?'<br>'+verdict:'')+'</div>';
  }
  function heroPills(){
    var pills=document.querySelector('.hero .insights'); if(!pills) return;
    var ok=H.cor.filter(function(r){ return !r[4] && !(C[r[0]]&&C[r[0]].lx); });
    var n=H.cor.filter(function(r){ return r[2]>=1; }).length, big=H.cor[0];
    var up=ok.filter(function(r){ return r[3]>=10; }).sort(function(a,b){ return (b[2]-b[3])-(a[2]-a[3]); })[0], dn=ok.filter(function(r){ return r[3]>=10; }).sort(function(a,b){ return (a[2]-a[3])-(b[2]-b[3]); })[0];
    var p=function(t){ return '<div class="insight-pill"><div class="ip-dot"></div><div>'+t+'</div></div>'; };
    var num=function(t){ return '<span class="ip-num">'+t+'</span>'; };
    pills.innerHTML=p(U.T(U.cur()+'出口方申报 '+num(n)+' 个双边对 ≥ 1 万吨',num(n)+' corridors ≥ 0.01 Mt in '+U.cur()+' (exporter-declared)'))+
      p(U.T('最大流向：'+U.nm(big[0])+' → '+U.nm(big[1])+' '+num(U.vu(big[2])),'Largest: '+U.nm(big[0])+' → '+U.nm(big[1])+' '+num(U.vu(big[2]))))+
      p(U.T('增量最大：'+U.nm(up[0])+' → '+U.nm(up[1])+' '+num(U.dv(up[2]-up[3])+' 万吨'),'Largest gain: '+U.nm(up[0])+' → '+U.nm(up[1])+' '+num(U.dv(up[2]-up[3])+' Mt')))+
      p(U.T('减量最大：'+U.nm(dn[0])+' → '+U.nm(dn[1])+' '+num(U.dv(dn[2]-dn[3])+' 万吨'),'Largest loss: '+U.nm(dn[0])+' → '+U.nm(dn[1])+' '+num(U.dv(dn[2]-dn[3])+' Mt')));
    var en=document.querySelector('.hero .hero-en'); if(en) en.textContent=U.T('双边钢材贸易 · 2010–'+H.per.py+' 年度 + '+U.cur(),'Bilateral steel trade · annual 2010–'+H.per.py+' + '+U.cur());
  }
  var curC=null, curG=null;
  function update(){
    mount();
    if(page==='country'){ var s=document.getElementById('sel'); curC=(s&&s.value)||curC||'中国'; country(curC); }
    else if(page==='product'){ var t=document.getElementById('tile-p'); var g=curG; if(!g&&t){ g=t.textContent; } product(g); }
    else if(page==='bilateral'){ var a=document.getElementById('selExp'), b=document.getElementById('selImp'); heroPills(); bilateral(a&&a.value, b&&b.value); }
  }
  function hook(){
    if((page==='product'||page==='country') && typeof window.render==='function' && !window.render.__snap){
      var r0=window.render; window.render=function(g){ var o=r0.apply(this,arguments); try{ mount(); if(page==='product'){ curG=g; product(g); } else { curC=g; country(g); } }catch(e){} return o; }; window.render.__snap=1;
    }
    document.addEventListener('change', function(e){ if(e.target && /^(sel|selExp|selImp)$/.test(e.target.id)) setTimeout(update, 30); }, true);
    var prev=window.__relang; window.__relang=function(){ if(prev) try{ prev(); }catch(e){} try{ update(); }catch(e){} };
    update();
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', function(){ setTimeout(hook, 0); }); else setTimeout(hook, 0);
})();
