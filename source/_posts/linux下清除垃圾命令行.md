title: linux下清除垃圾命令行
date: 2016-01-04 01:40:06
tags: linux
categories: Linux
---
linux下本来就不是像window会产生很多垃圾，导致越用越慢。
但是我等强迫症呢，就是看不了有点残留的东西存在。
特别是在卸载了软件之后，还有一些配置文件留在那里，就很讨厌。
所以把这些命令记录下来，毕竟linux命令太多，有些时候也记不住。
<!--more-->
### 删除缓存 ###
```bash
$ sudo apt-get autoclean        // 清除旧版本的软件缓存
$ sudo apt-get clean                // 清除所有软件缓存
$ sudo apt-get autoremove    // 删除系统不再使用的孤立软件
```
### 清理opera firefox的缓存文件 ###
```bash
$ ls ~/.opera/cache4
$ ls ~/.mozilla/firefox/*.default/Cache
```
### 清理Linux下孤立的包 ###
```bash
$ sudo apt-get install deborphan -y
```
### 卸载：tracker ###
这个东西一般我只要安装ubuntu就会第一删掉tracker 他不仅会产生大量的cache文件而且还会影响开机速度。所以在新得利里面删掉就行。

附录：
包管理的临时文件目录:
包在
/var/cache/apt/archives
没有下载完的在
/var/cache/apt/archives/partial
### 删除软件 ###
```bash
$ sudo apt-get remove --purge 软件名
$ sudo apt-get autoremove
// 清除残余的配置文件
$ dpkg -l |grep ^rc|awk '{print $2}' |sudo xargs dpkg -P
```
