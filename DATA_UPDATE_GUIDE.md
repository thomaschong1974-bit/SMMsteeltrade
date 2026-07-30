# 数据更新指南 · Data Update Guide

平台上所有页面的数据都由 6 个海关明细 CSV 自动生成。要把整站更新到最新，只需替换这 6 个文件，然后运行一条命令。

All data on every page is generated from 6 customs-detail CSVs. To refresh the whole
platform, replace those 6 files and run one command.

## 1. 提供最新数据 / Provide the latest data

把最新的海关出口/进口明细放入 `work/`，命名如下（列名保持一致）：

Put the latest export/import breakdowns in `work/`, named exactly:

| 文件 / file   | 内容 / content                     | 粒度 / granularity |
|---------------|------------------------------------|--------------------|
| `exp_y.csv`   | 出口 Exports                        | 年 Annual 2010–2020 |
| `exp_q.csv`   | 出口 Exports                        | 季 Quarterly 2021–2025 |
| `exp_m.csv`   | 出口 Exports                        | 月 Monthly (latest year) |
| `imp_y.csv`   | 进口 Imports                        | 年 Annual 2010–2020 |
| `imp_q2.csv`  | 进口 Imports                        | 季 Quarterly 2021–2025 |
| `imp_m.csv`   | 进口 Imports                        | 月 Monthly (latest year) |

每个文件的列 / columns in each file:
`year, quarter, month, HS group code, reporter name, partner name, quantity, mirror`
（quantity 单位为吨 / in tonnes；使用 mirror=0 的申报口径行）

> 你也可以直接把 Excel 版本发我，我会转成上述 CSV 再运行。
> You can also just send me the Excel exports and I'll convert them to these CSVs and run it.

## 2. 一条命令刷新全站 / One command refreshes everything

```
python3 work/rebuild.py
```

会依次自动完成 / it runs, in order:

1. `gen_mixed.py` → 流向地图 + 全球脉搏数据 (TF + PULSE)
2. `recompute_flagship.py` → 首页 KPI / 榜单 (flagship KPIs)
3. `gen_bilateral20.js` → 双边流向 前20出口×前20进口 (bilateral top-20, auto-injected)
4. `build_dict.py` → 中英翻译字典 (translation dictionary)
5. `audit_names.js` → 检查是否有新国家未翻译 (flag any new untranslated country)
6. `cover_test.js` → 英文模式零中文残留校验 (English-purity check on all pages)

## 3. 新增国家自动提示 / New-country auto-flag

如果新数据里出现字典中没有的国家名，第 5 步会列出来。把它们的英文名加进
`work/extra_names.py` 的 `M={...}` 再重跑一次即可。

If the new data contains a country not yet in the dictionary, step 5 lists it. Add its
English name to `M={...}` in `work/extra_names.py` and rerun.

## 自动 vs. 需人工复核 / Automatic vs. needs review

- **全自动 (Automatic):** 所有数字、图表、排名、双边对、KPI、货量单位 (万吨/Mt)、国家翻译。
- **需快速复核 (Quick review):** 首页"核心判断 / Key Intelligence"等叙述性评论中引用的
  具体措辞（如政策事件、案件名）。数字会自动更新，但一句话点评仍建议每期人工/AI 过一遍——
  发我一句"更新分析结论"即可，我会据最新数字改写这几段。
