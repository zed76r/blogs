---
title: 解决IntelliJ下调试时不生成war exploded文件夹的问题
date: 2019-11-28 20:09:40
tags:
    - Java
    - IntelliJ IDEA
categories:
    - 开发日常
---

# 开发环境

+ 使用较新的IntelliJ IDEA版本（2019.2）
+ 使用Gradle作为项目构建工具
+ 调试tomcat应用，并使用war(exploded)作为部署项以便热更新

# 故障现象

在即使是指定运行Build Artifacts选中带(exploded)条目后也不生成exploded文件夹


```text
❯ tree -L 2
.
├── classes
│   └── java
├── generated
│   └── sources
├── libs
│   └── server-4.1.22.war
├── resources
│   └── main
└── tmp
    ├── compileJava
    └── war
```


# 解决方法

+ 2019.2之后的版本：
    1. 打开项目
    1. 打开IDE设置 `Ctrl+Alt+S`
    1. 依次展开 `Build, ...` `Build Tools`菜单
    1. 点击`Gradle`子项
    1. 把`Build and run using`改成`IntelliJ IDEA`
    1. 保存

+ 之前的版本：
    相同位置取消勾选`Delegate IDE build/run actions to gradle`


重新构建之后结果

```text
❯ tree -L 2
.
├── classes
│   └── java
├── generated
│   └── sources
├── libs
|   ├── exploded
│   └── server-4.1.22.war
├── resources
│   └── main
└── tmp
    ├── compileJava
    └── war
```


# Reference

+ [StackOverFlow](https://stackoverflow.com/questions/47078199/intellij-fails-deploying-exploded-war-to-tomcat)

+ [官方Issue](https://youtrack.jetbrains.com/issue/IDEA-176700)