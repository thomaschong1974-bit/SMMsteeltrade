/* In-app step-by-step user guide. Floating button (bottom-right) opens a
   bilingual modal. Content is built on demand (kept out of the initial DOM so
   English-mode pages stay English-only). Follows the site language toggle. */
(function(){
  function lang(){ return (window.SP_LANG && SP_LANG()==='en') ? 'en' : 'zh'; }

  function guideHTML(en){
    var pages = [
      ['全球脉搏','Global Pulse','世界流向地图 + 核心判断 + 「2026 最新动态」（上半年同比、走廊增减、各国最新月份）+ 全球榜单。','World flow map + key intelligence + “Latest 2026” (H1 y/y, corridor movers, latest month by reporter) + rankings.'],
      ['流向地图','Trade Map','交互式流向地图：按年/季/月、品种、流向、Top N 筛选。','Interactive flow map: filter by year/quarter/month, product, direction, Top-N.'],
      ['国家画像','Country','单一国家的出口/进口结构、伙伴、品种与趋势。','A country’s export/import structure, partners, products and trends.'],
      ['产品市场','Product','单一钢材品种的全球格局与主要流向。','Global picture and main flows for one steel product.'],
      ['双边流向','Bilateral','任意「出口国 × 进口国」的规模、走势、产品结构、依赖度与替代来源。','Any exporter × importer: scale, trend, product mix, dependence, substitution.'],
      ['市场信号','Signals','量级异动扫描；底部「自定义异动查询」可按国家+品种实时筛选。','Anomaly scan; the "Custom anomaly explorer" filters by country + product live.'],
      ['政策壁垒','Policy','232 / CBAM 等重大事件 + 贸易救济案件明细，可按地区/品类筛选，每周一更新。','Major events (232 / CBAM) + trade-remedy cases, filterable by region/product, weekly.'],
      ['数据实验室','Data Lab','选报告国·流向·时段，按国别→品种下钻，一键导出 Excel / CSV。','Pick reporter/flow/period, drill country → product, export Excel / CSV.'],
      ['高级分析','Advanced','贸易转移、出口竞争、进口市场、风险依赖、全球榜单、方法论。','Trade Shift, Export Competition, Import Markets, Risk, Rankings, Methodology.']
    ];
    var faq = [
      ['需要登录 / 安装吗？','Login or install?','不用，浏览器打开链接 + 口令即可。','No — just the link + code in a browser.'],
      ['多久更新？','How often updated?','数据更新后即时发布；打开或刷新即最新。','Published on refresh; open/refresh for the latest.'],
      ['单位？','Units?','中文「万吨」，英文 Mt（百万吨，1 Mt = 100 万吨）。','万吨 in Chinese, Mt in English (1 Mt = 100 万吨).'],
      ['手机能看吗？','Mobile?','可以。交互工具在电脑上体验最佳。','Yes; interactive tools are best on a computer.']
    ];
    var S = en
      ? {title:'User guide',sub:'For first-time users — no technical background needed.',
         qs:'Quick start (3 steps)',
         q1:'① Enter the access code, then click “Enter”.',
         q2:'② Use the top menu to switch between pages.',
         q3:'③ Toggle 中文 / EN at the top-right; your choice is remembered. Bookmark the link.',
         nav:'Top navigation',navd:'The same menu is on every page. The bottom-left badge shows the data build date; when data updates, an open page shows a “📡 New data available · Refresh” banner.',
         pg:'What each page does',act:'Handy tips',
         a1:'Hover any chart / bubble / flow line for a detail tooltip.',
         a2:'On Bilateral, Import Markets, Policy and Data Lab, use the dropdown filters.',
         a3:'In Data Lab, export the current query to Excel / CSV (top-right).',
         faqh:'FAQ',close:'Close'}
      : {title:'使用教程',sub:'面向第一次使用的同事，照着看即可，无需技术背景。',
         qs:'三步快速上手',
         q1:'① 输入访问口令，点「进入平台」。',
         q2:'② 用顶部菜单在各页面之间切换。',
         q3:'③ 右上角「中文 / EN」一键切换语言（会被记住）。建议把链接加入收藏夹。',
         nav:'顶部导航',navd:'每一页顶部菜单都一样。左下角小标签是数据版本日期；数据更新后，开着的页面会自动弹「📡 数据已更新 · 刷新」。',
         pg:'各页面用途',act:'常用操作',
         a1:'把鼠标放到图表 / 气泡 / 流线上，会显示明细提示。',
         a2:'双边流向、进口市场、政策壁垒、数据实验室都有下拉筛选。',
         a3:'数据实验室右上角可把当前查询导出 Excel / CSV。',
         faqh:'常见问题',close:'关闭'};
    function esc(s){return s.replace(/&/g,'&amp;').replace(/</g,'&lt;');}
    var h='';
    h+='<div class="ug-h"><div><div class="ug-t">'+S.title+'</div><div class="ug-s">'+S.sub+'</div></div>'+
       '<button class="ug-x" id="ugClose" aria-label="'+S.close+'">&times;</button></div>';
    h+='<div class="ug-body">';
    h+='<div class="ug-sec"><h4>'+S.qs+'</h4><p>'+S.q1+'</p><p>'+S.q2+'</p><p>'+S.q3+'</p></div>';
    h+='<div class="ug-sec"><h4>'+S.nav+'</h4><p>'+S.navd+'</p></div>';
    h+='<div class="ug-sec"><h4>'+S.pg+'</h4>';
    pages.forEach(function(p){ h+='<div class="ug-row"><b>'+esc(en?p[1]:p[0])+'</b><span>'+esc(en?p[3]:p[2])+'</span></div>'; });
    h+='</div>';
    h+='<div class="ug-sec"><h4>'+S.act+'</h4><p>'+S.a1+'</p><p>'+S.a2+'</p><p>'+S.a3+'</p></div>';
    h+='<div class="ug-sec"><h4>'+S.faqh+'</h4>';
    faq.forEach(function(f){ h+='<div class="ug-row"><b>'+esc(en?f[1]:f[0])+'</b><span>'+esc(en?f[3]:f[2])+'</span></div>'; });
    h+='</div></div>';
    return h;
  }

  function ensureStyle(){
    if(document.getElementById('ug-style')) return;
    var st=document.createElement('style'); st.id='ug-style';
    st.textContent=
      '#ugBtn{position:fixed;right:14px;bottom:14px;z-index:100000;display:flex;align-items:center;gap:6px;'+
      'font:600 12px/1 system-ui,-apple-system,"MiSans","PingFang SC",sans-serif;color:#fff;background:#C00000;'+
      'border:none;padding:9px 13px;border-radius:22px;cursor:pointer;box-shadow:0 6px 22px rgba(140,0,0,.35)}'+
      '#ugBtn:hover{background:#a30000}'+
      '#ugOv{position:fixed;inset:0;z-index:100001;background:rgba(8,10,16,.55);display:none;align-items:center;justify-content:center;padding:20px}'+
      '#ugOv.on{display:flex}'+
      '#ugCard{width:min(680px,94vw);max-height:88vh;overflow:auto;background:#fff;border-radius:16px;'+
      'box-shadow:0 24px 70px rgba(0,0,0,.4);font-family:"MiSans","PingFang SC",system-ui,sans-serif;color:#16191d}'+
      '.ug-h{display:flex;justify-content:space-between;align-items:flex-start;gap:12px;padding:20px 22px 12px;position:sticky;top:0;background:#fff;border-bottom:1px solid #eef0f3}'+
      '.ug-t{font-size:20px;font-weight:850}.ug-s{font-size:12.5px;color:#79808a;margin-top:4px}'+
      '.ug-x{border:none;background:#f2f3f5;color:#5b636d;width:30px;height:30px;border-radius:50%;font-size:20px;line-height:1;cursor:pointer;flex:0 0 auto}'+
      '.ug-x:hover{background:#e3e5e8}'+
      '.ug-body{padding:8px 22px 22px}.ug-sec{margin-top:16px}'+
      '.ug-sec h4{font-size:13px;font-weight:800;color:#C00000;letter-spacing:.02em;margin:0 0 8px}'+
      '.ug-sec p{font-size:13.5px;line-height:1.6;color:#2c2f36;margin:4px 0}'+
      '.ug-row{display:flex;gap:12px;padding:7px 0;border-bottom:1px dashed #eef0f3}'+
      '.ug-row b{flex:0 0 168px;font-size:13px;font-weight:700;color:#16191d}'+
      '.ug-row span{font-size:12.5px;color:#5b636d;line-height:1.5}'+
      '@media(max-width:560px){.ug-row{flex-direction:column;gap:2px}.ug-row b{flex:none}}';
    document.head.appendChild(st);
  }

  var btn, ov;
  function open(){ ensureStyle();
    if(!ov){ ov=document.createElement('div'); ov.id='ugOv';
      ov.innerHTML='<div id="ugCard"></div>'; document.body.appendChild(ov);
      ov.addEventListener('click',function(e){ if(e.target===ov) close(); });
    }
    document.getElementById('ugCard').innerHTML=guideHTML(lang()==='en');
    document.getElementById('ugClose').onclick=close;
    ov.classList.add('on');
  }
  function close(){ if(ov) ov.classList.remove('on'); }

  function label(){ return lang()==='en' ? '📖 Guide' : '📖 使用教程'; }
  function build(){ ensureStyle();
    if(document.getElementById('ugBtn')) return;
    btn=document.createElement('button'); btn.id='ugBtn'; btn.type='button';
    btn.textContent=label(); btn.onclick=open; document.body.appendChild(btn);
  }
  function relabel(){ if(btn) btn.textContent=label(); if(ov&&ov.classList.contains('on')) document.getElementById('ugCard').innerHTML=guideHTML(lang()==='en'), document.getElementById('ugClose').onclick=close; }
  document.addEventListener('sp-lang', relabel);
  document.addEventListener('keydown', function(e){ if(e.key==='Escape') close(); });

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', build); else build();
})();
