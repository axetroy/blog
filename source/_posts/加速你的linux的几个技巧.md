title: 加速你的linux的几个技巧
date: 2016-01-04 20:36:48
tags: linux
---
### 使用Preload预加载 ###
与Prelink类似，Preload是一个运行于后台的监护程序，探测那些常用的软件，并将其放入缓存，以起到加速的作用。在LinuxMint/Ubuntu下安装Preload很简单：
```bash
$ sudo apt-get install preload
```
Preload默认的配置对于普通用户而言已经不错了，一般不需要修改。如果有进一步掌控其的欲望，可以打开其配置文件进行修改：
```bash
$ sudo gedit /etc/preload.conf
```
<!--more-->
### 清理APT缓存 ###
apt应该算是LinuxMint/Ubuntu系统中使用率最高的命令了，无论安装、卸载软件，还是更新软件源缓存及相关维护，都离不开它。使用逾久，apt缓存也就变得较为臃肿，有必要清理：
```bash
$ sudo apt-get autoclean
```
### 禁用不必要的启动项 ###
在“启动应用程序”中，根据自身实际，取消不必要的启动项，如欢迎程序、检测新硬件、蓝牙（如果本机没有蓝牙）、桌面共享等。
### 修改grub2等待时间 ###
无论你的电脑是否有2个或更多的操作系统，只要安装了LinuxMint/Ubuntu，就必然会安装grub2作为引导管理器。grub2启动时，会在默认的启动项上停留数秒（默认10秒），等待用户选择。我们可以把这个时间改的更短。如果是LinuxMint/Ubuntu单系统，可以直接改为0，即直接进入，无需等待。
以管理员身份编辑grub配置文件，修改GRUB_TIMEOUT项后的数字。
```bash
$ sudo gedit /etc/default/grub
```
### 使用ZRAM提高内存性能 ###
如果你的电脑内存不太充裕（1G以下），可以使用ZRAM软件来提高内存性能。ZRAM能在系统中创建一个压缩的块设备，用于模拟一个交换分区，减少因内存不足而多硬盘的蹂躏频次。可以使用如下PPA安装ZRAM：
```bash
$ sudo add-apt-repository ppa:shnatsel/zram
$ sudo apt-get update
$ sudo apt-get install zramswap-enabler
```
<!--more-->
### 多核启动 ###
默认情况下，即便你的电脑是双核甚至多核的CPU，LinuxMint/Ubuntu启动时仍旧是以单核在执行系统启动任务。可以通过如下修改，使其充分利用多核CPU进行系统启动，从而加快速度。
以管理员身份编辑：
```bash
$ sudo gedit /etc/init.d/rc
```
找到CONCURRENCY=none行，并修改为CONCURRENCY=makefile
### 禁用视觉特效 ###
如果你的电脑硬件配置较低，可以通过禁用视觉特效达到优化性能的目的。华丽的特效，必然会消耗更多的性能。对于Ubuntu和LinuxMint MATE用户，安装Compiz后，即可把不要的特效都禁用：
```bash
$ sudo apt-get install compizconfig-settings-manager
```
对于LinuxMint Cinnamon用户，还可以在Cinnamon设置：效果 中禁用相关效果。
### 使用TMPFS减少磁盘读写 ###
TMPFS，顾名思义，乃是临时文件系统。一般情况下，Linux的/tmp文件夹接收着大量关于磁盘读写的操作。而通过优先使用物理内存，可以提高/tmp处理磁盘读写操作的速度。
以管理员身份修改：
```bash
$ sudo gedit /etc/fstab
```
在该文件的末尾，加入如下内容：
```bash
# Move /tmp to RAM
tmpfs /tmp tmpfs defaults,noexec,nosuid 0 0
```
