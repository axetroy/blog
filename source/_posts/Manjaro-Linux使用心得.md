title: Manjaro Linux使用心得
date: 2016-04-06 21:52:30
tags: [linux,manjaro]
categories: Linux
---

### 什么是Manjaro

Manjaro Linux是面向桌面的、用户友好的、基于Arch Linux的发行。它的一些显著特性包括：一份直观的安装程序、自动硬件检测、用于管理图形卡的特别Bash脚本、一组额外的桌面配置选项。 Manjaro Linux带有三份样式，分别采用Xfce、GNOME 3（使用Cinnamon Shell）、KDE桌面。

官方地址:[https://manjaro.github.io/](https://manjaro.github.io/)

<!-- more -->

### 开箱即用的linux

不必再操劳各种环境，各种必备的软件，各种编译。

内置了一些常用的软件，省却的各种繁琐，真正的开箱即用。

只需要再软件库中搜索，然后安装即可。

还有一个优势就是：居然有QQ，debian系的安装deb包，老是会有各种bug。

但是这个至少能正常使用，免去了很多繁琐，虽然我不知道这个软件用的是谁的源码，这都不重要...

总之就是

想要chrome?搜索安装即可

想要webstorm？搜索安装即可

想要搜狗输入法？搜索安装即可

软件库还是很丰富的

### 桌面环境

基于arch linux的衍生版，就是自由定制。

官方也提供了几个版本

* XFCE
* KDE
* Net-Edition(网络版，无桌面)

以及其他，不是arch系的衍生版，比如天朝的深度

### 与Linux mint相比如何？

Linux mint是基于ubuntu的，ubuntu基于debian。

debian还好，但是ubuntu实在不能忍，BUG奇多，连公司用的LTS版在更新之后，都会出现一些奇奇怪怪的bug

比如：更新之后网卡挂了，更新之后setting挂了，这两个我都遇到过，公司同事也遇到过。

基于ubuntu，就是治标不治本，也就相当与给你内置了几个软件罢了。

我已经受够了ubuntu开机就报错...已经各种bug

### 安装之后，我必须要做的

#### 更换更新源

相信这个无论是在哪个linux发行版，都是必须要做的。

立刻百度了一下

* 打开/etc/pacman.d/mirrors文件夹里默认了一些源 扫一眼有没有“China” 没有就照着其他源的格式自己添进去

```bash
#nano /etc/pacman.d/mirrors/China
[China]
Server = http://mirrors.ustc.edu.cn/manjaro/$branch/$repo/$arch
Server = http://mirror.bjtu.edu.cn/manjaro/$branch/$repo/$arch
  ```

官方中国源本来还支持一个港大的 亲测不好使 唉

* 打开 /etc/pacman.conf 文件 把yaourt的源添上：

```bash
#nano /etc/pacman.conf
[archlinuxcn]
SigLevel = Optional TrustAll
Server   = http://repo.archlinuxcn.org/$arch
```

* 打开 /etc/pacman-mirrors.conf 文件 找到## Specify to use only mirrors from a specific country （指定一个国家的镜像） 修改# OnlyCountry=Germany 为：

```bash
#nano /etc/pacman-mirrors.conf
OnlyCountry=China
```

* 最后更新 /etc/pacman.d/mirrorlist :

```bash
pacman-mirrors -g
```

### 安装nodejs

我不是很喜欢通过编译安装nodejs，各种麻烦，直接通过[nvm](https://github.com/creationix/nvm)安装。

简单方便，想删就删，随时可以更新版本。

安装nvm

```bash
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.31.0/install.sh | bash
# or
wget -qO- https://raw.githubusercontent.com/creationix/nvm/v0.31.0/install.sh | bash
```

安装nodejs
```bash
nvm install 5.10.1
```

将node设置为默认，这样可以在系统任意地方使用``node``命令

```bash
nvm alias default 5.10.1
```

如果需要删除nvm，一般值需要删除home目录下的``~/.nvm``文件夹

to remove, delete, or uninstall nvm - just remove the `$NVM_DIR` folder (usually `~/.nvm`)

#### 安装ruby

安装ruby是属于开发需要，项目需要编译sass，所以需要通过gem安装``compass``

安装gem

```bash
npm install gem -g
```

安装compass

```bash
gem install compass
```

OK！

### 只是为了重装

记录下来，只是为了方便重装23333

不过manjaro真的是好用，除了chrome中，有一点小bug之外

目前已经作为我的日常使用的系统了
