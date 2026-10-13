/* Methodology · Data quality section (rendered from window.H1.dq, regenerated on every data refresh). */
(function(){
  'use strict';
  var H = window.H1, U = window.HU; if(!H || !U) return;
  var host = document.getElementById('dqSection'); if(!host) return;
  var RS = {'not in partner record':['未获伙伴记录印证','not in partner record'],'implausible spike':['异常尖峰（无可用镜像）','implausible spike (no usable mirror)']};
  function render(){
    var D = H.dq, E = U.en();
    var lx = Object.keys(D.lowx), lm = Object.keys(D.lowm);
    var rows = D.anom.slice().sort(function(a,b){ return b.value_t-a.value_t; }).map(function(a){
      var fl = a.flow==='EXPORT'?U.T('出口','Export'):U.T('进口','Import');
      return '<tr><td>'+a.period+'</td><td>'+fl+'</td><td>'+U.nm(a.reporter)+(a.flow==='EXPORT'?' → ':' ← ')+U.nm(a.partner)+'</td><td>'+U.pz(a.product)+'</td>'+
        '<td style="text-align:right">'+U.v(a.value_t/1e4)+'</td><td style="text-align:right">'+U.v(a.normal_t/1e4,2)+'</td><td style="text-align:right">'+(a.mirror_t==null?'—':U.v(a.mirror_t/1e4,2))+'</td><td>'+U.T(RS[a.reason][0],RS[a.reason][1])+'</td></tr>'; }).join('');
    var low = function(obj, flow){ return Object.keys(obj).map(function(c){ var x=obj[c];
      return '<tr><td>'+U.nm(c)+'</td><td>'+flow+'</td><td style="text-align:right">'+U.pct(x.own_yoy)+'</td><td style="text-align:right">'+U.pct(x.partner_yoy)+'</td><td style="text-align:right">'+U.v(x.own_h1)+'</td><td style="text-align:right">'+U.v(x.partner_h1)+'</td></tr>'; }).join(''); };
    var th = function(a){ return '<thead><tr>'+a.map(function(x){ return '<th>'+x+'</th>'; }).join('')+'</tr></thead>'; };
    host.innerHTML =
      '<h2><span class="sec-n">09</span>'+U.T('数据质量 · 交叉验证','Data quality · cross-validation')+'</h2>'+
      '<p>'+U.T('每次数据更新都会自动执行以下检查，所有分析页面（全球脉搏、出口竞争、进口市场、风险依赖、贸易转移、全球榜单、市场信号）都基于检查后的数据。',
        'Every data refresh runs the checks below automatically; all analysis pages use the checked data.')+'</p>'+
      '<ul>'+
      '<li><b>'+U.T('外部对账','External reconciliation')+'</b>'+U.T('：2026 年上半年中国出口 6,447 万吨（+0.7%）与海关总署成材+半成品合计 6,447 万吨（+0.7%）一致；日本 −6.8%（JISF −6.9%）、土耳其 +2.7%（TÇÜD +2.5%）、美国进口 −20.8%（AISI −23%）、印度出口 +29%（BigMint +27–30%）方向与幅度吻合。',
          ': in H1 2026 China\'s exports of 64.47 Mt (+0.7%) match GACC finished + semi-finished steel (64.47 Mt, +0.7%); Japan −6.8% (JISF −6.9%), Türkiye +2.7% (TÇÜD +2.5%), US imports −20.8% (AISI −23%) and India exports +29% (BigMint +27–30%) agree in direction and size.')+'</li>'+
      '<li><b>'+U.T('月份完整性','Month completeness')+'</b>'+U.T('：只用 ≥ 半数报告国已发布的月份；某国最新月份明显偏低（未发布完整）则暂不使用：',': only months published by at least half of the reporters are used; a reporter\'s latest month is held back if clearly incomplete: ')+
        D.trim.map(function(t){ return U.nm(t.reporter)+' '+H.per.cy+'-'+(t.month<10?'0':'')+t.month; }).join(U.T('、',', '))+'。</li>'+
      '<li><b>'+U.T('异常值剔除','Outlier removal')+'</b>'+U.T('：单个「报告国 × 伙伴 × 品种」数据跳升至正常水平 8 倍以上且 ≥ 3 万吨（季度 ≥ 5 万吨）时，与伙伴国镜像记录比对；伙伴未见对应量即判定为申报错误并剔除。本次共剔除 '+D.excluded+' 个数据点，合计约 '+(D.excluded_kt/10).toFixed(0)+' 万吨（见下表）。',
          ': when a reporter × partner × product value jumps to 8x its normal level and ≥ 30 kt (≥ 50 kt per quarter), it is checked against the partner\'s mirror record; if the partner shows no matching volume it is treated as a reporting error. '+D.excluded+' data points, about '+(D.excluded_kt/1000).toFixed(1)+' Mt, were removed (table below).')+'</li>'+
      '<li><b>'+U.T('可信度标记','Reliability flags')+'</b>'+U.T('：将各国自报同比与其贸易伙伴记录计算的同比比较，差异 > 15 个百分点即标记「数据存疑」——这些数据仅展示，不参与排名与结论。进出口两端记录矛盾的走廊（本次 '+D.npairs+' 条）同样不进入增减榜单。',
          ': each country\'s own y/y is compared with the y/y implied by its partners\' records; a gap above 15 pp flags the figure as "check data" — shown but not ranked or used in conclusions. Corridors whose two customs records disagree ('+D.npairs+' this time) are likewise kept out of the movers lists.')+'</li></ul>'+
      '<h3 style="font-size:14px;margin:16px 0 8px">'+U.T('数据存疑（不参与排名与结论）','Flagged "check data" (not ranked)')+'</h3>'+
      '<div style="overflow-x:auto"><table class="hs-table">'+th([U.T('国家','Country'),U.T('流向','Flow'),U.T('自报同比','Own y/y'),U.T('伙伴记录同比','Partner y/y'),U.T('自报量（万吨）','Own (Mt)'),U.T('伙伴记录量（万吨）','Partner (Mt)')])+'<tbody>'+low(D.lowx,U.T('出口','Export'))+low(D.lowm,U.T('进口','Import'))+'</tbody></table></div>'+
      '<h3 style="font-size:14px;margin:16px 0 8px">'+U.T('已剔除的异常数据点','Removed outliers')+'</h3>'+
      '<div style="overflow-x:auto"><table class="hs-table">'+th([U.T('期间','Period'),U.T('流向','Flow'),U.T('报告国 / 伙伴','Reporter / partner'),U.T('品种','Product'),U.T('申报量（万吨）','Reported (Mt)'),U.T('正常水平（万吨）','Normal (Mt)'),U.T('伙伴记录（万吨）','Partner record (Mt)'),U.T('判定','Reason')])+'<tbody>'+rows+'</tbody></table></div>'+
      '<p style="font-size:12px;color:#8a919c;margin-top:8px">'+U.T('原始数据完整保留于 work/raw/，剔除清单写入 work/dq_report.json，可随时复核。','Raw files are kept unchanged in work/raw/; the exclusion log is written to work/dq_report.json for review.')+'</p>';
  }

  function sections(){
    var put=function(id, html){ var el=document.getElementById(id); if(el) el.innerHTML=html; };
    var li=function(arr){ return '<ul>'+arr.map(function(x){ return '<li><b>'+U.T(x[0],x[1])+'</b>'+U.T(x[2],x[3])+'</li>'; }).join('')+'</ul>'; };
    put('m04','<h2><span class="sec-n">04</span>'+U.T('同比与份额算法','y/y and share calculation')+'</h2>'+li([
      ['同比增速','y/y growth','：（本期量 − 上年同期量）/ 上年同期量 × 100%；本期为 '+U.cur()+'，上年同期为 '+U.prev()+'（季度数据 Q1+Q2 加总）。',': (current − same period a year earlier) / same period a year earlier × 100%; current = '+U.cur()+', base = '+U.prev()+' (quarterly Q1+Q2).'],
      ['份额','Share','：某国（或品种）出口量 / '+H.reps.length+' 个报告国出口合计 × 100%；年度画像页沿用全部报告国口径。',': a country\'s (or product\'s) exports / total exports of the '+H.reps.length+' reporters × 100%; the annual profile pages keep the all-reporter basis.'],
      ['全年对比','Full-year comparisons','：只使用完整年度；年内对比只在季度末进行（一季度、上半年、前三季度）。',': complete years only; year-to-date comparisons are made at quarter ends (Q1, H1, Q1–Q3).'],
      ['双边流向','Corridors','：出口方 → 进口方的同期量对比；上年同期 < 0.5 万吨的视为「新增」，不计算百分比。',': exporter → importer volumes in matching periods; a base below 5 kt is shown as "new" without a percentage.']]));
    put('m05','<h2><span class="sec-n">05</span>'+U.T('低基数与数据缺口','Low bases and data gaps')+'</h2>'+
      '<div class="warn-box"><div class="wt">'+U.T('注意：低基数效应','Note: low-base effects')+'</div><p>'+U.T('小基数走廊的同比百分比会被显著放大，各页面的增速榜单均设有最低量门槛（通常上年同期 ≥ 10–30 万吨），请结合绝对量判断。','Percentages on small corridors are inflated; growth rankings use minimum volumes (typically ≥ 0.1–0.3 Mt a year earlier). Read them together with absolute volumes.')+'</p></div>'+li([
      ['发布时滞','Release lags','：各国海关发布节奏不同，最近 1–2 个月只含部分报告国；首页「数据覆盖」列出每国最新月份。',': customs offices publish on different schedules, so the latest one or two months cover only some reporters; the Global Pulse coverage table lists each reporter\'s latest month.'],
      ['转口枢纽','Transshipment hubs','：阿联酋、新加坡、中国香港等枢纽的数据含转口量，进口量可能高于最终消费。',': data for hubs such as the UAE, Singapore and Hong Kong, China include re-exports, so imports can exceed final consumption.'],
      ['镜像差异','Mirror differences','：同一流向的出口方与进口方记录常因运输时滞、FOB/CIF、品种归类不同而存在差异；两端方向一致的信号更可靠。',': exporter and importer records of the same flow differ because of shipping lags, FOB/CIF and product coding; signals seen on both sides are more reliable.'],
      ['非月度报告国','Non-monthly reporters','：俄罗斯等国 2025 年 3 月后无本国数据，年内分析不覆盖，其贸易可通过伙伴记录观察（「双边流向」页）。',': Russia and some others have no own data after March 2025 and are not covered by the year-to-date analysis; their trade can be seen through partners\' records on the Bilateral page.']]));
    put('m07','<h2><span class="sec-n">07</span>'+U.T('市场信号检测','Signal detection')+'</h2>'+li([
      ['暴增','Surges','：本期 ≥ 20 万吨、上年同期 ≥ 10 万吨的走廊中同比最高者。',': the highest y/y among corridors with ≥ 0.2 Mt now and ≥ 0.1 Mt a year earlier.'],
      ['暴跌','Slumps','：上年同期 ≥ 30 万吨的走廊中同比最低者。',': the lowest y/y among corridors with ≥ 0.3 Mt a year earlier.'],
      ['出口国增减','Exporter changes','：上年同期出口 ≥ 20 万吨的国家按增减量排序。',': countries with ≥ 0.2 Mt exports a year earlier, ranked by volume change.'],
      ['来源替代','Source substitution','：进口国自报数据中份额上升最多与下降最多的来源；替代强度 = min（新来源增量，原来源减量）。',': in importer-declared data, the source gaining the most share against the one losing the most; substitution score = min(gain, loss).'],
      ['排除规则','Exclusions','：数据存疑的国家、两端记录矛盾的走廊不进入榜单与结论。',': flagged countries and corridors with conflicting records are not ranked or used in conclusions.']]));
    put('m08','<h2><span class="sec-n">08</span>'+U.T('平台模块说明','Platform modules')+'</h2>'+li([
      ['全球脉搏','Global Pulse','：流向地图、核心判断、年内最新动态（'+U.cur()+'）与 '+H.per.py+' 年度基准。',': flow map, key intelligence, the latest year-to-date read ('+U.cur()+') and the '+H.per.py+' annual baseline.'],
      ['国家画像 / 产品市场 / 双边流向','Country / Product / Bilateral','：顶部为'+U.cur()+'速览，下方为 2010–'+H.per.py+' 年度画像。',': a '+U.cur()+' snapshot on top, the 2010–'+H.per.py+' annual profile below.'],
      ['出口竞争 / 进口市场 / 风险依赖 / 贸易转移 / 全球榜单 / 市场信号','Competition / Import Markets / Risk / Trade Shift / Rankings / Signals','：全部基于'+U.cur()+'对比'+U.prev()+'。',': all based on '+U.cur()+' vs '+U.prev()+'.'],
      ['流向地图 / 数据实验室','Trade Map / Data Lab','：按年、季、月自由查询，月度为最新已发布数据。',': free queries by year, quarter or month; monthly data are the latest published.'],
      ['政策壁垒','Policy','：232、CBAM 等重大事件与贸易救济案件，每周一更新。',': major events (Section 232, CBAM) and trade-remedy cases, updated every Monday.']]));
  }
  function both(){ render(); sections(); }
  var prev=window.__relang; window.__relang=function(){ if(prev) try{ prev(); }catch(e){} try{ both(); }catch(e){} };
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', both); else both();
})();
