---
title: 【更新】如何在使用SSH协议的git操作的时候使用代理服务器
date: 2022-01-01
tags:
    - ssh
    - proxy
categories:
    - 开发日常
---

日常开发过程中经常使用Github，并且因为大家都懂的原因，~~不管是解析使用光棍（1.1.1.1）DNS解析到美国，或者使用国内DNS解析到新加坡，~~国内直连Github的速度都不尽如人意。

当 `git clone` 一些大的库的时候非常慢，尤其是使用zsh的时候，每次`cd`到git repo的目录时git prompt会非常卡导致体验相当差。

网上有很多教程都是针对https协议代理，由于个人比较倾向于使用ssh协议，稍作了解以后得到了本文将要描述的解决方案。

## 1. NetCat

本文将使用netcat来给ssh提供代理，通过netcat可以让ssh通过socks4/5和http代理进行连接。

很多发行版都预装了netcat（即`nc`）。在终端里输入`nc`，如果提示未找到命令请自行安装。

Windows非WSL用户可尝试ncat替代。


## 2. 修改ssh config文件

使用你最爱的编辑器打开ssh config文件，默认位于`$HOME/.ssh/config`。

如果没有请先创建这个文件/文件夹。

```bash
> mkdir ~/.ssh
> touch ~/.ssh/config
> vim ~/.ssh/config
```

如果代理使用socks5：

```txt
Host github.com
     ProxyCommand nc -x 127.0.0.1:1080 %h %p
```

如果使用socks4，则ProxyCommand部分替换为：

```txt
ProxyCommand nc -X 4 -x 127.0.0.1:1080 %h %p
```

如果使用http proxy，则ProxyCommand部分替换为：

```txt
ProxyCommand nc -X connect -x 127.0.0.1:1080 %h %p
```

配置文件中的几个内容简单的介绍一下：
+ `Host`一个自定义的主机名
+ `ProxyCommand`ssh的代理设置
    + `nc -x 127.0.0.1:1080 %h %p` 使用netcat通过127.0.0.1:1080的socks5代理连接到%h %p，%h是填充ssh连接的host，%p是填充ssh链接的port。在本例中代表`github.com:22`。
      + `-x 127.0.0.1:1080`是指定一个代理服务器IP和端口
      + 默认不指定代表使用socks5，通过`-X 4/connect`指定使用socks4/http代理


## 3. 测试

可以在ssh config的代理配置`nc`命令后面增加`-v`选项打印verbose日志以确定是否通过代理建立ssh连接。

最后clone一下B神做的`更纱黑体`的库来测试一下速度。

```log
~
> time git clone git@github.com:be5invis/Sarasa-Gothic.git   

Cloning into 'Sarasa-Gothic'...
remote: Counting objects: 350, done.
remote: Total 350 (delta 0), reused 0 (delta 0), pack-reused 350
Receiving objects: 100% (350/350), 30.94 MiB | 2.54 MiB/s, done.
Resolving deltas: 100% (185/185), done.
git clone git@github.com:be5invis/Sarasa-Gothic.git  2.05s user 2.34s system 21% cpu 19.999 total

```
