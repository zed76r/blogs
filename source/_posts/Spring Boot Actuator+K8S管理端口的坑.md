---
title: 'Spring Boot Actuator+K8S管理端口的坑'
date: 2023-03-20 16:29:12
tags: 
    - devops
categories:
    - 日常
---


今天在使用Spring Boot Actuator的时候，遇到了一个让人头疼的问题。本来应该是可以正常启动的项目，一直在重启，查看日志发现了这样一个异常：

```
Caused by: java.lang.NumberFormatException: For input string: "tcp://10.43.20.83:80"
```

仔细看了一下堆栈信息，发现是在
`org.springframework.boot.actuate.autoconfigure.web.server.ManagementPortType.getPortProperty(ManagementPortType.java:64)`这个方法里抛出的。

根据方法名，可以猜测这个异常和Actuator的管理端口有关。但是我很确定我的配置文件里没有问题，管理端口设置为8081：

```
management.erver.port=8081
```

为了找出问题所在，我又在k8s上跑了一个bash的pod，输出了一下环境变量，结果就发现了罪魁祸首：

```
SERVER_PORT=tcp://10.43.20.83:80
```

原来Spring Boot会用这个环境变量覆盖`management.port`的值²。而这个环境变量是k8s根据我的服务名字自动生成的。因为我有一个项目叫server，它有一个svc负责暴露负载均衡，svc也跟随项目叫server，k8s就会根据这个生成这个以svc名字+PORT命名的环境变量。

暂时删除svc server以后，项目就能正常启动了。

临时的过渡方案会修改这个svc的名字。正式修改的话会连同整个项目去调整为别的名字。

## 总结

通过这次经历，我学到了几点：

- Spring Boot Actuator是一个非常强大和方便的工具，可以让我们监控和管理我们的应用¹。
- 但是也要注意它可能会带来一些潜在的问题或冲突，比如管理端口和环境变量之间的覆盖关系²。
- 在使用k8s部署应用时，要注意它会自动生成一些环境变量³，可能会影响我们应用中已有的配置。
- 在命名服务或组件时，要避免使用过于通用或简单的名字⁴（比如server），以免造成混淆或冲突。

希望我的分享对你有所帮助。谢谢！😊

---

源: 与必应的对话， 2023/3/20

引用：

(1) Spring Boot Actuator: Production-ready Features. 
https://docs.spring.io/spring-boot/docs/2.5.6/reference/html/actuator.html 
(2) Spring Boot Actuator | Baeldung. https://www.baeldung.com/spring-boot-actuators 
(3) spring-boot-actuator - management.server.port 和 management.port 属性有什么区别 .... https://www.coder.work/article/7532796 
(4) Production-ready Features - Spring. https://docs.spring.io/spring-boot/docs/current/reference/html/actuator.html 