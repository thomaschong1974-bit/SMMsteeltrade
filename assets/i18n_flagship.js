/* ============================================================
   Global Steel Trade Pulse · bilingual engine (ZH ⇄ EN)
   Terminology follows international metals-trade conventions
   (Platts / Metal Bulletin style): mt, HRC/CRC, AD/CVD, Section 232,
   CBAM, safeguard, melt-and-pour, Mtpa.
   Unit note: 万吨 = 10 kt (10,000 mt); shown as “Mt”.
   ============================================================ */
(function(){
'use strict';

/* ---------------- country / region names ---------------- */
var NAMES = {
"不丹":"Bhutan",
"中南美洲其他国家（地区）":"Other Central & South America",
"中非":"Central African Rep.",
"亚洲其他国家（地区）":"Other Asia",
"伯利兹":"Belize",
"佛得角":"Cabo Verde",
"免税区，自由贸易区":"Free-trade zone",
"公海":"High seas",
"关岛":"Guam",
"冈比亚":"Gambia",
"几内亚比绍":"Guinea-Bissau",
"列支敦士登":"Liechtenstein",
"刚果共和国":"Congo",
"刚果民主共和国":"DR Congo",
"北美洲其他国家（地区）":"Other North America",
"北马里亚纳群岛":"Northern Mariana Is.",
"南乔治亚岛和南桑德韦奇岛":"South Georgia & Sandwich Is.",
"南斯拉夫":"Yugoslavia",
"南极洲":"Antarctica",
"南苏丹":"South Sudan",
"博纳尔，圣俄斯塔休斯和萨巴":"Bonaire, St Eustatius & Saba",
"博茨瓦纳":"Botswana",
"卢旺达":"Rwanda",
"厄立特里亚":"Eritrea",
"国际水域":"International waters",
"图瓦卢":"Tuvalu",
"圣卢西亚":"Saint Lucia",
"圣基茨和尼维斯":"St Kitts & Nevis",
"圣多美和普林西比":"Sao Tome & Principe",
"圣巴泰勒米":"Saint Barthelemy",
"圣文森特和格林纳丁斯":"St Vincent & Grenadines",
"圣皮埃尔和密克隆":"St Pierre & Miquelon",
"圣诞岛":"Christmas Island",
"圣赫勒拿":"Saint Helena",
"圣马力诺":"San Marino",
"基里巴斯":"Kiribati",
"塞卜泰(休达)":"Ceuta",
"塞尔维亚和黑山":"Serbia & Montenegro",
"塞拉利昂":"Sierra Leone",
"塞舌尔":"Seychelles",
"多米尼克":"Dominica",
"大洋洲其他国家（地区）":"Other Oceania",
"安圭拉":"Anguilla",
"安提瓜和巴布达":"Antigua & Barbuda",
"安道尔":"Andorra",
"密克罗尼西亚联邦":"Micronesia",
"巴哈马":"Bahamas",
"巴巴多斯":"Barbados",
"布维岛":"Bouvet Island",
"布隆迪":"Burundi",
"帕劳":"Palau",
"库克群岛":"Cook Islands",
"库拉索":"Curacao",
"开曼群岛":"Cayman Islands",
"所罗门群岛":"Solomon Islands",
"托克劳":"Tokelau",
"斯威士兰":"Eswatini",
"新喀里多尼亚":"New Caledonia",
"格林纳达":"Grenada",
"格陵兰":"Greenland",
"梅利利亚":"Melilla",
"梵蒂冈":"Vatican City",
"欧洲其他国家（地区）":"Other Europe",
"民主德国":"East Germany",
"汤加":"Tonga",
"法属南方领地":"French Southern Terr.",
"法属波利尼西亚":"French Polynesia",
"法罗群岛":"Faroe Islands",
"特克斯和凯科斯群岛":"Turks & Caicos Is.",
"瑙鲁":"Nauru",
"瓦利斯和富图纳":"Wallis & Futuna",
"百慕大":"Bermuda",
"皮特凯恩":"Pitcairn",
"直布罗陀":"Gibraltar",
"福克兰群岛（马尔维纳斯）":"Falkland Islands",
"科摩罗":"Comoros",
"科科斯（基林）群岛":"Cocos (Keeling) Is.",
"索马里":"Somalia",
"纳米比亚":"Namibia",
"纽埃":"Niue",
"美国本土外小岛屿":"US Minor Outlying Is.",
"美属维尔京群岛":"US Virgin Islands",
"美属萨摩亚":"American Samoa",
"美洲大洋洲":"Americas & Oceania",
"苏里南":"Suriname",
"英属印度洋领地":"British Indian Ocean Terr.",
"英属维尔京群岛":"British Virgin Islands",
"荷属圣马丁":"Sint Maarten",
"荷属安地列斯群岛":"Netherlands Antilles",
"莱索托":"Lesotho",
"萨摩亚":"Samoa",
"蒙特塞拉特":"Montserrat",
"西撒哈拉":"Western Sahara",
"诺福克岛":"Norfolk Island",
"赤道几内亚":"Equatorial Guinea",
"赫德岛和麦克唐纳岛":"Heard & McDonald Is.",
"阿鲁巴":"Aruba",
"非洲其他国家":"Other Africa",
"马尔代夫":"Maldives",
"马拉维":"Malawi",
"马约特":"Mayotte",
"中国":"China","日本":"Japan","韩国":"South Korea","印度":"India","印度尼西亚":"Indonesia",
"德国":"Germany","意大利":"Italy","比利时":"Belgium","荷兰":"Netherlands","法国":"France",
"土耳其":"Türkiye","俄罗斯":"Russia","巴西":"Brazil","美国":"United States","加拿大":"Canada",
"墨西哥":"Mexico","越南":"Vietnam","泰国":"Thailand","马来西亚":"Malaysia","中国台湾":"Taiwan, China",
"西班牙":"Spain","波兰":"Poland","奥地利":"Austria","捷克":"Czechia","英国":"United Kingdom",
"阿联酋":"UAE","沙特阿拉伯":"Saudi Arabia","埃及":"Egypt","伊朗":"Iran","哈萨克斯坦":"Kazakhstan",
"南非":"South Africa","澳大利亚":"Australia","新加坡":"Singapore","菲律宾":"Philippines",
"巴基斯坦":"Pakistan","孟加拉国":"Bangladesh","阿尔及利亚":"Algeria","瑞典":"Sweden","芬兰":"Finland",
"葡萄牙":"Portugal","希腊":"Greece","罗马尼亚":"Romania","保加利亚":"Bulgaria","匈牙利":"Hungary",
"瑞士":"Switzerland","挪威":"Norway","卢森堡":"Luxembourg","斯洛文尼亚":"Slovenia","斯洛伐克":"Slovakia",
"克罗地亚":"Croatia","塞尔维亚":"Serbia","丹麦":"Denmark","中国香港":"Hong Kong, China","中国澳门":"Macao, China",
"乌克兰":"Ukraine","白俄罗斯":"Belarus","摩尔多瓦":"Moldova","格鲁吉亚":"Georgia","亚美尼亚":"Armenia",
"阿塞拜疆":"Azerbaijan","乌兹别克斯坦":"Uzbekistan","土库曼斯坦":"Turkmenistan","吉尔吉斯斯坦":"Kyrgyzstan",
"塔吉克斯坦":"Tajikistan","蒙古":"Mongolia","朝鲜":"North Korea","缅甸":"Myanmar","柬埔寨":"Cambodia",
"老挝":"Laos","文莱":"Brunei","东帝汶":"Timor-Leste","斯里兰卡":"Sri Lanka","尼泊尔":"Nepal",
"阿富汗":"Afghanistan","伊拉克":"Iraq","叙利亚":"Syria","黎巴嫩":"Lebanon","约旦":"Jordan",
"以色列":"Israel","巴勒斯坦":"Palestine","科威特":"Kuwait","卡塔尔":"Qatar","巴林":"Bahrain",
"阿曼":"Oman","也门":"Yemen","摩洛哥":"Morocco","突尼斯":"Tunisia","利比亚":"Libya",
"苏丹":"Sudan","埃塞俄比亚":"Ethiopia","肯尼亚":"Kenya","坦桑尼亚":"Tanzania","乌干达":"Uganda",
"尼日利亚":"Nigeria","加纳":"Ghana","科特迪瓦":"Côte d'Ivoire","塞内加尔":"Senegal","喀麦隆":"Cameroon",
"贝宁":"Benin","多哥":"Togo","几内亚":"Guinea","利比里亚":"Liberia","马里":"Mali","尼日尔":"Niger",
"乍得":"Chad","毛里塔尼亚":"Mauritania","吉布提":"Djibouti","莫桑比克":"Mozambique","赞比亚":"Zambia",
"津巴布韦":"Zimbabwe","安哥拉":"Angola","马达加斯加":"Madagascar","毛里求斯":"Mauritius",
"阿根廷":"Argentina","智利":"Chile","秘鲁":"Peru","哥伦比亚":"Colombia","委内瑞拉":"Venezuela",
"厄瓜多尔":"Ecuador","玻利维亚":"Bolivia","巴拉圭":"Paraguay","乌拉圭":"Uruguay","圭亚那":"Guyana",
"巴拿马":"Panama","哥斯达黎加":"Costa Rica","洪都拉斯":"Honduras","萨尔瓦多":"El Salvador",
"危地马拉":"Guatemala","尼加拉瓜":"Nicaragua","古巴":"Cuba","牙买加":"Jamaica","海地":"Haiti",
"多米尼加":"Dominican Republic","多米尼加共和国":"Dominican Republic","特立尼达和多巴哥":"Trinidad & Tobago",
"波多黎各":"Puerto Rico","新西兰":"New Zealand","巴布亚新几内亚":"Papua New Guinea","斐济":"Fiji",
"瓦努阿图":"Vanuatu","马绍尔群岛":"Marshall Islands","冰岛":"Iceland","爱尔兰":"Ireland",
"爱沙尼亚":"Estonia","拉脱维亚":"Latvia","立陶宛":"Lithuania","北马其顿":"North Macedonia",
"阿尔巴尼亚":"Albania","黑山":"Montenegro","波黑":"Bosnia & Herzegovina","波斯尼亚和黑塞哥维那":"Bosnia & Herzegovina",
"科索沃":"Kosovo","塞浦路斯":"Cyprus","马耳他":"Malta","印尼":"Indonesia","刚果（金）":"DR Congo","刚果（布）":"Congo",
"加蓬":"Gabon","布基纳法索":"Burkina Faso"
};

/* ---------------- product groups (industry-standard EN) ---------------- */
var PRODS = {
"热轧 (Hot Rolled)":{zh:"热轧",en:"Hot-rolled (HRC)"},
"冷轧 (Cold Rolled)":{zh:"冷轧",en:"Cold-rolled (CRC)"},
"涂镀 (Coated Steel)":{zh:"涂镀",en:"Coated steel"},
"钢坯 (Billet)":{zh:"钢坯",en:"Billet & semis"},
"棒材 (Steel Bar)":{zh:"棒材",en:"Bar"},
"线盘 (Wire Rod)":{zh:"线盘",en:"Wire rod"},
"钢丝 (Steel Wire)":{zh:"钢丝",en:"Steel wire"},
"型钢 (Section Steel)":{zh:"型钢",en:"Sections"},
"中厚板 (Medium & Heavy Plate)":{zh:"中厚板",en:"Medium & heavy plate"},
"钢管 (Steel Pipe)":{zh:"钢管",en:"Pipe & tube"},
"硅钢 (Electrical Steel)":{zh:"硅钢",en:"Electrical steel"},
"不锈钢 (Stainless Steel)":{zh:"不锈钢",en:"Stainless steel"},
"钢轨 (Steel Rail)":{zh:"钢轨",en:"Rail"},
"钢管附件 (Steel Pipe Fittings)":{zh:"钢管附件",en:"Pipe fittings"},
"异型材 (Special Profiles)":{zh:"异型材",en:"Special profiles"},
"带钢 (Steel Strip)":{zh:"带钢",en:"Strip"},
"其他 (Others)":{zh:"其他",en:"Others"}
};

/* old-taxonomy product aliases */
PRODS["热轧 (Hot Rolling)"]={zh:"热轧",en:"Hot-rolled (HRC)"};
PRODS["冷轧 (Cold Rolling)"]={zh:"冷轧",en:"Cold-rolled (CRC)"};
PRODS["涂镀 (Coating & Plating)"]={zh:"涂镀",en:"Coated steel"};
PRODS["钢坯 (Steel Billet)"]={zh:"钢坯",en:"Billet & semis"};
PRODS["螺纹钢 (Rebar)"]={zh:"螺纹钢",en:"Rebar"};
PRODS["线盘 (Wire Rod)"]={zh:"线盘",en:"Wire rod"};
PRODS["钢丝 (Steel Wire)"]={zh:"钢丝",en:"Steel wire"};
PRODS["型钢 (Section Steel)"]={zh:"型钢",en:"Sections"};
PRODS["中厚板 (Medium-Thickness Plate)"]={zh:"中厚板",en:"Medium & heavy plate"};
PRODS["钢管 (Steel Pipe)"]={zh:"钢管",en:"Pipe & tube"};
PRODS["硅钢 (Silicon Steel)"]={zh:"硅钢",en:"Electrical steel"};
PRODS["不锈钢 (Stainless Steel)"]={zh:"不锈钢",en:"Stainless steel"};
PRODS["钢轨 (Steel Rail)"]={zh:"钢轨",en:"Rail"};
PRODS["钢管附件 (Steel Pipe Fittings)"]={zh:"钢管附件",en:"Pipe fittings"};
PRODS["异型材 (Special-Shaped Profiles)"]={zh:"异型材",en:"Special profiles"};
PRODS["带钢 (Strip Steel)"]={zh:"带钢",en:"Strip"};
var PROD_SHORT = {};   // "热轧" -> "Hot-rolled (HRC)"
Object.keys(PRODS).forEach(function(k){ PROD_SHORT[PRODS[k].zh] = PRODS[k].en; });

/* ---------------- UI strings (exact text-node match) ---------------- */
var UI = {
"主口径":"primary basis",
"。时间覆盖":". Coverage",
"（年/季/月）。\n        观点层综合":" (annual / quarterly / monthly). The view layer is cross-checked against",
"SMM 全球钢材贸易情报 · 组内分析工具 · Global Steel Trade Intelligence (internal) · 数据覆盖 2010–2026 · 本页离线自包含":"SMM Global Steel Trade Intelligence · internal analyst tool · data coverage 2010–2026 · self-contained offline",
"组内分析工具（非对外发布）：":"Internal analyst tool (not for public release): ",
"本平台面向 SMM 分析师日常调用进出口数据，":"This platform is built for SMM analysts' day-to-day import/export data work; ",
"暂不作为对外商品发布":"it is not published as a commercial product for now",
"。\n        数据来源：":". Data source: ",
"数据来源：":"Data source: ",
"各国海关进出口镜像数据库（中国海关总署 GACC、印尼 BPS/DJBC、欧盟 Eurostat COMEXT、美国 USA Trade Online、UN Comtrade/ITC 等），由 SMM 整理。":"national customs export/import mirror databases (China GACC, Indonesia BPS/DJBC, EU Eurostat COMEXT, US USA Trade Online, UN Comtrade/ITC, etc.), compiled by SMM. ",
"口径：":"Basis: ",
"主口径 ":"primary basis ",
"（出口国申报，71 报告国），单位":"(exporter-declared, 71 reporting countries); unit ",
"，":", ",
"仅含数量、不含金额":"volumes only, no values",
"；EXPORT 与 IMPORT 为镜像口径，":"; EXPORT and IMPORT are mirror bases — ",
"请勿直接相加":"do not add them together",
"。时间覆盖 ":". Coverage ",
"（年/季/月）。":" (annual / quarterly / monthly). ",
"观点层综合 ":"The view layer is cross-checked against ",
"SMM 钢铁产业链研究报告、SMM 钢材出口专题报告（周度）、SMM 反倾销跟踪模型":"SMM Steel Industry Chain Research, the SMM Weekly Steel Export Report and SMM's anti-dumping model",
"与 ":" and ",
"GEM 全球钢铁产能追踪":"GEM's Global Iron & Steel Tracker",
"交叉验证；引用前请以官方公告与 SMM 现货/期货数据库为准。":"; before citing, defer to official notices and SMM's spot/futures database.",
"粒度":"Granularity",
"时段":"Period",
"年度":"Annual",
"季度":"Quarterly",
"月度":"Monthly",
"2010–2026 · 主口径 EXPORT":"2010–2026 · Primary basis: EXPORT",
"全球钢材贸易脉搏 | Global Steel Trade Intelligence":"Global Steel Trade Pulse | 全球钢材贸易脉搏",
"全球钢材贸易":"Global Steel Trade","脉搏":"Pulse",
"Global Steel Trade Intelligence · 请输入访问口令":"Global Steel Trade Intelligence · Enter access code",
"口令不正确，请重试":"Incorrect access code — please retry","进入平台":"Enter platform",
"访问口令":"Access code",
"全球脉搏":"Global Pulse","流向地图":"Trade Map","国家画像":"Country","产品市场":"Product",
"双边流向":"Bilateral","市场信号":"Signals","政策壁垒":"Policy","数据实验室":"Data Lab","高级分析":"Advanced",
"贸易转移 · Trade Shift":"Trade Shift","出口竞争 · Competition":"Export Competition",
"进口市场 · Destination":"Import Markets","风险依赖 · Risk":"Risk & Dependency",
"趋势诊断 · Trend":"Trend Diagnostics","全球榜单 · Rankings":"Global Rankings",
"方法论 · Methodology":"Methodology",
"2010–2025 · 主口径 EXPORT":"2010–2025 · Primary basis: EXPORT",
"聚合查询中…":"Aggregating…",
"全球钢材":"Global Steel","贸易":"Trade ",
"2010–2026 海关贸易数据（年/季/月）· 71 报告国· 主口径":"Customs trade data 2010–2026 (annual / quarterly / monthly) · 71 reporting countries · primary basis",
"· 单位":"· unit","万吨":"Mt",
"实时追踪全球供给重心、流向迁移与品类结构。":"Tracking the global supply center of gravity, trade-flow migration and product mix. Volumes in million tonnes (Mt); tiny flows in tonnes (t).",
"全球出口量 2025":"Global exports, 2025","中国出口份额 · 全球第一":"China's export share · No.1 worldwide",
"条":"","在册贸易流向 · Top50 上图":"corridors on record · Top 50 mapped",
"核心判断":"Key Intelligence",
"中国独大：份额 30.7% 创新高，但拐点信号已现":"China dominance: record 30.7% share, but inflection signals emerging",
"2025 出口":"2025 exports hit","1.31 亿吨":"1.31 bn mt","（+14.1%）、份额":"(+14.1%), for a",
"（2020 年仅 13.0%）；2026 年 1–5 月出口 4,455 万吨、同比":"share (vs 13.0% in 2020). Jan–May 2026 exports of 44.55 Mt fell",
"，反倾销集中落地后动能降温。":"YoY as anti-dumping rulings land in force.",
"本期速览":"At a Glance","中国画像":"China Profile",
"壁垒从\"点\"到\"面\"：影响量约百万吨/月":"Barriers spread from cases to a wall: ~1 Mt/month at stake",
"2025Q4 以来韩国热轧":"Since Q4 2025, final AD rulings have stacked up — Korea HRC at",
"、印度硅钢、巴西涂镀、越南冷轧等案件密集终裁，SMM 模型口径合计影响约":", India electrical steel, Brazil coated, Vietnam CRC. SMM's exposure model puts the combined impact at",
"130–150 万吨/月":"1.3–1.5 Mt/month",
"，相当于中国月出口量的一成以上。":"— more than one-tenth of China's monthly exports.",
"贸易转移":"Trade Shift",
"流向大迁移：传统市场退、新兴市场进":"The great re-routing: legacy markets shrink, new markets absorb",
"对印度":"To India","、台湾":", Taiwan","、越南":", Vietnam",
"；对吉布提":"; to Djibouti","、新加坡":", Singapore","、尼日利亚":", Nigeria",
"——2026 年海关数据中吉布提已居增量第一，趋势延续。":"— 2026 customs data already show Djibouti as the top incremental destination. The shift is holding.",
"重点变化":"What Moved","进口市场":"Import Markets",
"北美收缩 · 中东重排：两大区域变局":"North America contracts, Middle East reshuffles",
"232 扩围下加↔美走廊":"Under the expanded Section 232, the Canada–US corridor fell",
"；美伊停战后伊朗（出口":"; after the US–Iran truce, Iran (exports",
"）恢复方坯报价，SMM 估算中东重建可回补":") resumed billet offers. SMM estimates Middle East reconstruction can backfill a",
"170–210 万吨":"1.7–2.1 Mt","级缺口。":"gap.",
"供给东移下半场：印度 272Mtpa 在建拟建":"Supply shifts east, act two: India's 272 Mtpa pipeline",
"GEM 口径印度在建+拟建产能":"GEM data show India's under-construction plus announced capacity at",
"（全球第一）、伊朗 50、越南 31、印尼 22——SMM 判断":"(world's largest), Iran 50, Vietnam 31, Indonesia 22 Mtpa. SMM's call:",
"2028 年前后":"around 2028",
"海外投产与壁垒累积共振，中国出口窗口面临质变。":"new overseas capacity and accumulated barriers resonate — a step-change for China's export window.",
"全球榜单":"Rankings","风险依赖":"Risk & Dependency",
"向下滚动 · 解读发生了什么":"Scroll down · what moved and why",
"年份":"Year","品种":"Product","全部钢材":"All steel","流向":"Flow","全部":"All",
"飞线数量":"Arcs","流动动画":"Flow animation","贸易热区":"Heatmap",
"增长流向":"Expanding","收缩流向":"Contracting","平稳流向":"Stable",
"本期速览 · At a Glance":"At a Glance",
"一屏读懂全球钢材贸易格局":"The global steel trade map on one screen",
"基于 2025 完整年度海关数据（EXPORT 口径，单位万吨），刻画总量、集中度、结构与最显著的流向变化。":"Built on full-year 2025 customs data (EXPORT basis, Mt): totals, concentration, product mix and the sharpest flow shifts.",
"全球格局 · Landscape":"Landscape",
"谁在出口，谁在进口":"Who exports, who imports",
"出口高度集中于中国;进口需求分散，美国、意大利、德国、土耳其领跑。":"Exports concentrate heavily in China; import demand is dispersed, led by the US, Italy, Germany and Türkiye.",
"出口国 TOP 10":"Top 10 Exporters","进口国 TOP 10":"Top 10 Importers",
"2025 全年 · 万吨 / 全球份额":"Full-year 2025 · Mt / global share",
"双边流向 · Bilateral":"Bilateral",
"最大的 20 条贸易走廊":"The 20 largest trade corridors",
"结构透视 · Structure":"Structure",
"出口排名与品类结构":"Export rankings & product mix",
"左：2025 全年出口国 Top 10（万吨）;右：全球出口品类结构占比。":"Left: top 10 exporters, full-year 2025 (Mt). Right: global export product mix.",
"单位 万吨 · 出口国申报口径":"Unit Mt · exporter-declared basis",
"出口品类结构":"Export Product Mix","2025 · 占比":"2025 · share",
"热轧 / 涂镀 / 钢坯 / 螺纹钢 …":"HRC / coated / billet / rebar …",
"本期重点变化 · What Moved":"What Moved",
"六张卡片看懂结构性变化":"Six cards on the structural shifts",
"基于 2025 年度海关数据与上年同期对比自动测算。":"Auto-computed from 2025 customs data against the prior year.",
"收缩 · CONTRACTION":"CONTRACTION","扩张 · EXPANSION":"EXPANSION","放量 · SURGE":"SURGE",
"品类 · PRODUCT":"PRODUCT","信号 · SIGNAL":"SIGNAL","区域 · REGION":"REGION",
"加拿大→美国大幅回落":"Canada→US falls hard","409.6 万吨":"4.10 Mt",
"232 关税与贸易摩擦压制北美双向走廊，美国→加拿大同步 −28%。":"Section 232 tariffs and trade friction compress both directions of the North American corridor; US→Canada fell −28% in parallel.",
"查看贸易走廊":"View corridors","查看重点变化":"View what moved","查看品种雷达":"View product radar",
"中国→印度持续退坡":"China→India keeps sliding","213.9 万吨":"2.14 Mt",
"印度贸易救济与国产替代加速，中国对台湾流向亦收缩 −32%。":"India's trade remedies and import substitution accelerate; China→Taiwan also contracted −32%.",
"印尼→越南放量":"Indonesia→Vietnam surges","164.3 万吨":"1.64 Mt",
"东盟内互供提速，越南→柬埔寨 +36%，区域一体化特征强化。":"Intra-ASEAN supply is accelerating — Vietnam→Cambodia +36% — a deepening regional integration.",
"中国转向非洲与拉美":"China pivots to Africa & LatAm",
"对尼日利亚 +66%、坦桑尼亚 +60%、秘鲁 +34%、新加坡 +73%，新兴市场承接中国增量。":"Nigeria +66%, Tanzania +60%, Peru +34%, Singapore +73% — emerging markets absorb China's incremental tonnes.",
"热轧+涂镀占近四成":"HRC + coated: nearly 40%",
"热轧 8,590.7 万吨、涂镀 7,777.6 万吨，扁平材主导全球钢材贸易结构。":"Hot-rolled 85.9 Mt and coated 77.8 Mt — flat products dominate global steel trade.",
"第一大走廊连续收缩":"Top corridor keeps contracting","1,009.0 万吨":"10.09 Mt",
"中国→越南仍为全球最大钢材走廊，但越南自产替代叠加贸易防御，量级持续回落。":"China→Vietnam remains the world's largest steel corridor, but Vietnamese self-supply plus trade defenses keep shrinking it.",
"品种雷达 · Product Radar":"Product Radar",
"十七大钢材品种一览":"Seventeen product groups at a glance",
"2025 年全球出口量与份额。点击任意品种，回到顶部地图查看该品种的全球流向。":"Global 2025 export volume and share. Click any product to load its flows on the map above.",
"口径说明:":"Methodology:",
"本平台主口径为":"The platform's primary basis is",
"（出口国申报，71 个报告国），单位为":"(exporter-declared, 71 reporting countries); unit:",
"仅含数量、不含金额":"volumes only, no values",
"。\n        EXPORT 与 IMPORT 为镜像口径，":". EXPORT and IMPORT are mirror bases —",
"请勿直接相加":"do not sum them",
"。\n        底库覆盖 2010–2025 全量年度数据，前端纯内存切片。观点层综合":". The base table covers 2010–2025 in full; all filtering is done client-side in memory. The view layer is cross-checked against",
"SMM 钢铁产业链研究报告、SMM 钢材出口专题报告（周度）、SMM 反倾销跟踪模型":"SMM Steel Industry Chain Research, the SMM Weekly Steel Export Report and SMM's anti-dumping exposure model",
"与":"and","GEM 全球钢铁产能追踪":"GEM's Global Iron & Steel Tracker","交叉验证。":".",
"核心终端":"Core Terminals","出口竞争":"Export Competition","方法论":"Methodology",
"姊妹平台":"Sister Platform","全球不锈钢贸易脉搏":"Global Stainless Steel Trade Pulse",
"全球钢材贸易情报旗舰平台 · Global Steel Trade Intelligence · 数据更新至 2025 年度 · 本页离线自包含":"Global Steel Trade Intelligence flagship · data through full-year 2025 · this page is self-contained offline",
/* dynamic labels */
"全球出口量 · 2025":"Global exports · 2025","中国份额 · 全球第一":"China share · No.1",
"日本份额 · 全球第二":"Japan share · No.2",
"印尼→越南":"IDN→VNM","显著增长走廊 · +85%":"Standout expansion · +85%",
"加→美":"CAN→USA","显著收缩走廊 · −31%":"Standout contraction · −31%",
"热轧占比 · 第一品类":"HRC share · top product","中国+日本 合计份额":"China + Japan combined share",
"出口量":"Exports","进口量":"Imports","出口":"Exports","进口":"Imports",
" 万吨 · 同比 ":" Mt · YoY ","新增/无去年":"new / no prior-year base",
" 万吨 · 份额 ":" Mt · share ",
"万吨 · 份额":"Mt · share"
};

var lang = (function(){ try{ return localStorage.getItem('sp_lang')||'zh'; }catch(e){ return 'zh'; } })();

/* ---------------- public helpers used by page scripts ---------------- */
window.TN  = function(n){ return lang==='en' ? (NAMES[n]||n) : n; };
window.TP  = function(g){ var p=PRODS[g]; return p ? (lang==='en'?p.en:p.zh) : String(g).replace(/\s*\(.*\)$/,''); };
window.LGT = function(zh){ return lang==='en' ? (UI[zh]!==undefined?UI[zh]:zh) : zh; };
window.__tnLabel = function(n){ return lang==='en' ? (NAMES[n]||n) : n; };
window.SP_LANG = function(){ return lang; };
window.fmtVol = function(wan, opt){
  wan = +wan || 0; opt = opt || {};
  if(lang!=='en'){ return wan.toLocaleString('en-US',{minimumFractionDigits:opt.zhDec!=null?opt.zhDec:1,maximumFractionDigits:opt.zhDec!=null?opt.zhDec:1})+(opt.noUnit?'':' 万吨'); }
  var mt = wan/100;
  if(Math.abs(mt) >= 0.1 || mt===0){ return mt.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2})+(opt.noUnit?'':' Mt'); }
  return Math.round(wan*10000).toLocaleString('en-US')+(opt.noUnit?'':' t');
};
window.fmtVolNum = function(wan){ return window.fmtVol(wan,{noUnit:true}); };
window.volUnit = function(){ return lang==='en' ? 'Mt' : '万吨'; };

/* ---------------- DOM walker ---------------- */
function walk(root){
  var it=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{
    acceptNode:function(n){
      var p=n.parentNode && n.parentNode.nodeName;
      if(p==='SCRIPT'||p==='STYLE') return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    }});
  var n;
  while((n=it.nextNode())){
    if(n.__zh===undefined) n.__zh=n.nodeValue;
    if(lang==='zh'){ if(n.nodeValue!==n.__zh) n.nodeValue=n.__zh; continue; }
    var raw=n.__zh, t=raw.trim();
    if(!t){ continue; }
    var out=null, rep=null;
    if(UI[t]!==undefined) rep=UI[t];
    else if(NAMES[t])     rep=NAMES[t];
    else if(PROD_SHORT[t])rep=PROD_SHORT[t];
    if(rep!==null){
      if(!window.__MT_OK && typeof rep==='string' && /(^|[\s(（·])Mt(\b|[)）])/.test(rep)) rep=null;
    }
    if(rep!==null) out=raw.replace(t, rep);
    if(out!==null) n.nodeValue=out;
  }
}

/* ---------------- toggle ---------------- */
function apply(){
  document.documentElement.lang = lang==='en' ? 'en' : 'zh-CN';
  document.body.classList.toggle('en', lang==='en');
  document.title = lang==='en' ? 'Global Steel Trade Pulse | 全球钢材贸易脉搏'
                               : '全球钢材贸易脉搏 | Global Steel Trade Intelligence';
  walk(document.body);
  var pi=document.getElementById('pwInput'); if(pi) pi.placeholder = lang==='en'?'Access code':'访问口令';
  var b=document.getElementById('langBtn');
  if(b) b.textContent = lang==='en' ? '中文' : 'EN';
  /* convert volume numbers carrying a data-wan attribute (万吨 value) */
  try{ document.querySelectorAll('[data-wan]').forEach(function(el){ el.textContent = window.fmtVolNum(el.getAttribute('data-wan')); }); }catch(e){}
  if(window.__relangCharts) try{ window.__relangCharts(); }catch(e){}
  if(window.__relangMap)    try{ window.__relangMap(); }catch(e){}
  walk(document.body);
}
window.__setLang=function(l){
  lang = (l==='en'?'en':'zh');
  try{ localStorage.setItem('sp_lang',lang); }catch(e){}
  apply();
};
window.__toggleLang=function(){ window.__setLang(lang==='en'?'zh':'en'); };

/* re-translate late-rendered nodes (prodGrid, tooltips…) */
var mo=new MutationObserver(function(muts){
  if(lang!=='en') return;
  for(var i=0;i<muts.length;i++){
    var m=muts[i];
    for(var j=0;j<m.addedNodes.length;j++){
      var nd=m.addedNodes[j];
      if(nd.nodeType===1) walk(nd);
      else if(nd.nodeType===3){ nd.__zh=nd.nodeValue;
        var t=nd.nodeValue.trim();
        if(UI[t]!==undefined) nd.nodeValue=nd.nodeValue.replace(t,UI[t]);
        else if(NAMES[t]) nd.nodeValue=nd.nodeValue.replace(t,NAMES[t]);
        else if(PROD_SHORT[t]) nd.nodeValue=nd.nodeValue.replace(t,PROD_SHORT[t]);
      }
    }
  }
});

function ensureFont(){
  if(document.getElementById('sp-misans')) return;
  var st=document.createElement('style'); st.id='sp-misans';
  st.textContent="@font-face{font-family:'MiSans';src:local('MiSans'),local('MiSans VF'),local('MiSans-Regular');font-weight:100 900;font-display:swap}"+
    "body,button,input,select,textarea,table,th,td,h1,h2,h3,h4,h5,div,span,p,a{font-family:'MiSans','MiSans VF','PingFang SC','Microsoft YaHei',system-ui,-apple-system,'Segoe UI',sans-serif !important}";
  document.head.appendChild(st);
}
document.addEventListener('DOMContentLoaded', function(){
  ensureFont();
  mo.observe(document.body,{childList:true,subtree:true});
  /* run after page scripts have rendered dynamic blocks */
  setTimeout(apply, 0);
  setTimeout(function(){ if(lang==='en') walk(document.body); }, 600);
});
})();
