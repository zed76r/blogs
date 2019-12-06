---
title: 通过Bash脚本git-pull所有workspace下的本地仓库
date: 2019-12-06 20:07:58
tags:
    - Git
    - Bash
categories:
    - 开发日常
---

本篇依旧是短小直接干的简短操作说明。

# Requirement

+ Bash
+ Git

# 脚本下载

GitHub Gist - [git-update.sh](https://gist.github.com/ZeddG93/abed9eb4f73056b57c8d076efbd69cca)
  
# 使用

```bash
chmod +x git-update.sh

./git-update <remote> <branch>
```

# 作用

更新当前目录下所有为Git仓库的子目录（目前不会递归遍历）。

# 脚本逻辑

1. 遍历当前所有文件夹
2. 过滤包含.git文件夹的部分
3. git fetch获取远端仓库信息
4. 比较`<branch>`和`<remote>/<branch>`的commit hash
5. 如果hash不匹配则更新
6. 检测本地是否有未提交的修改
7. 如果本地有未提交的修改：通过stash储藏修改内容
8. `git pull --rebase <remote>/<branch> <branch>`
9. 如果本地有未提交的修改：从stash里pop出修改内容
10. 完成！