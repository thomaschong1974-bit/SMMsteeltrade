#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
一键发布到 GitHub Pages（与「全球钢铁产业分布地图」同款做法）。
One-command publish to GitHub Pages.

用法 / Usage:
    python3 publish.py            # 直接发布当前内容
    python3 publish.py --rebuild  # 先跑数据重建(work/rebuild.py)再发布

前提 / Prereqs（只需一次性配置）:
    1. 本文件夹是一个 git 仓库，且已关联到你的 GitHub 远程仓库(origin)。
    2. 该仓库已在 GitHub 上开启 Pages（Settings → Pages → 部署分支）。
    3. 本机已用 git 登录/授权（能 push）。
"""
import subprocess, sys, os, datetime, glob

HERE = os.path.dirname(os.path.abspath(__file__))

def sh(cmd):
    print('  $ ' + ' '.join(cmd))
    r = subprocess.run(cmd, cwd=HERE, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True)
    print(r.stdout.strip())
    return r.returncode, r.stdout

def main():
    # optional rebuild first (regenerates data + stamps version.js)
    if '--rebuild' in sys.argv:
        rebuild = os.path.join(HERE, 'work', 'rebuild.py')
        if not os.path.exists(rebuild):
            rebuild = os.path.join(os.path.dirname(HERE), 'work', 'rebuild.py')
        print('=== rebuild ===')
        subprocess.run([sys.executable, rebuild])

    # sanity: is this a git repo with a remote?
    code, _ = sh(['git', 'rev-parse', '--is-inside-work-tree'])
    if code != 0:
        print('\n!! 这里还不是 git 仓库。请先一次性配置（见文件顶部 Prereqs），或让我帮你写好配置步骤。')
        sys.exit(1)
    code, out = sh(['git', 'remote', '-v'])
    if 'origin' not in out:
        print('\n!! 没有关联 GitHub 远程仓库(origin)。请先 `git remote add origin <你的仓库URL>`。')
        sys.exit(1)

    stamp = datetime.datetime.now().strftime('%Y-%m-%d %H:%M')
    sh(['git', 'add', '-A'])
    # commit may report "nothing to commit" — that's fine; we still push in case
    # there are earlier commits not yet on GitHub.
    sh(['git', 'commit', '-m', 'data update ' + stamp])

    # always push; only truly done when GitHub is up to date
    code, out = sh(['git', 'push'])
    if code != 0:
        print('\n!! push 失败，请检查网络或 GitHub 登录状态。')
        sys.exit(1)
    if 'Everything up-to-date' in out:
        print('\n（GitHub 已是最新，无需发布）')
    else:
        print('\n✅ 已推送到 GitHub（GitHub Pages 约 1 分钟后自动更新，链接不变）')

if __name__ == '__main__':
    main()
