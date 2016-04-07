title: ionic下的配置问题
date: 2015-12-27 19:01:08
tags: [ionic,angular]
categories: Javascript
---
### 下载 ###
```bash
// 安装ionic
$ npm install -g cordova ionic
// 生成一个ionic项目
$ ionic start myApp tabs
// 进入到项目目录
$ cd myApp
// 添加android平台
$ ionic platform add android
// 编译apk文件
$ ionic build android
```
<!--more-->

##### 环境变量错误或者未设置 #####
我把android SDK放在了java目录下...
```bash
/usr/lib/jvm/android-sdk-linux
```
$ sudo gedit ./.bashrc
在最后加入
```bash
export PATH=${PATH}:/usr/lib/jvm/你的安卓SDK文件夹名/tools
export PATH=${PATH}:/usr/lib/jvm/你的安卓SDK文件夹名/platform-tools
export ANDROID_HOME=${PATH}:/usr/lib/jvm/你的安卓SDK文件夹名/
```
然后刷新环境变量
```bash
$sudo source ./.profile
```
可以查看环境变量是否生效
```bash
$ env
```
OK，安卓sdk的环境变量配置好了，这样ionic就可以跑起来了。

### api版本号错误 ###
ionic 会要求要22的api包，但是下载下来的确实23api
怎么办呢？
修改如下文件
/platforms/android/androidMainfest/xml
找到
```bash
<uses-sdk android:minSdkVersion="16" android:targetSdkVersion="22" />
```
还有
/platforms/android/build/project.properties
找到
```bash
target=android-22
```
把22修改成23

### 环境变量配置

```bash
# JDK
export JAVA_HOME=/usr/lib/jvm/java-7-openjdk
export JRE_HOME=${JAVA_HOME}/jre
export PATH=$JAVA_HOME/bin:$PATH 
export CLASSPATH=.:$JAVA_HOME/lib/dt.jar:$JAVA_HOME/lib/tools.jar 

# android SDK
export ANDROID_HOME=/home/axetroy/android-sdk-linux
export PATH=$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools:$PATH
export PATH=/home/axetroy/android-sdk-linux/tools:$PATH 

# NDK
export ANDROID_NDK=/home/axetroy/android-ndk-r11 
export PATH=/home/axetroy/android-ndk-r11:$PATH 

# Ant
export PATH=$PATH:~/home/axetroy/apache-ant-1.9.6/bin
export CLASSPATH=/home/axetroy/apache-ant-1.9.6/lib 
```

