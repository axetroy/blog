title: 解决wine下中文乱码问题
date: 2016-01-04 21:46:29
tags: [linux,wine]
---
### 1，准备字体 ###
下载simfang.ttc 字体字体自行百度
复制到~/.wine/drive_c/windows/Fonts目录。
<!--more-->
### 2，修改 ~/.wine/system.reg ###
装好字体后，还要修改一下 Wine 的注册表设置，指定与字体相关的设置：
```bash
$ gedit ~/.wine/system.reg
```
（一定要使用 gedit 或其他支持 gb2312/utf8 编码的编辑器修改这些文件，否则文件中的中文可能变乱码）
搜索： LogPixels
找到的行应该是：[System\\CurrentControlSet\\Hardware Profiles\\Current\\Software\\Fonts]
修改
```bash
"LogPixels"=dword:00000060
// 改为
"LogPixels"=dword:00000070
```
搜索： FontSubstitutes
找到的行应该是：[Software\\Microsoft\\Windows NT\\CurrentVersion\\FontSubstitutes]
修改
```bash
"MS Shell Dlg"="Tahoma"
"MS Shell Dlg 2″="Tahoma"
// 改为
"MS Shell Dlg"="SimSun"
"MS Shell Dlg 2″="SimSun"
```
### 3，修改 ~/.wine/drive_c/windows/win.ini ###
```bash
$ gedit ~/.wine/drive_c/windows/win.ini
```
在文件末尾加入
```bash
[Desktop]
menufontsize=13
messagefontsize=13
statusfontsize=13
IconTitleSize=13
```
## 4、最关键的一步，把下面的代码保存为zh.reg，然后终端执行regedit zh.reg ###
```bash
REGEDIT4
[HKEY_LOCAL_MACHINE\Software\Microsoft\Windows NT\CurrentVersion\FontSubstitutes]
"Arial"="simsun"
"Arial CE,238"="simsun"
"Arial CYR,204"="simsun"
"Arial Greek,161"="simsun"
"Arial TUR,162"="simsun"
"Courier New"="simsun"
"Courier New CE,238"="simsun"
"Courier New CYR,204"="simsun"
"Courier New Greek,161"="simsun"
"Courier New TUR,162"="simsun"
"FixedSys"="simsun"
"Helv"="simsun"
"Helvetica"="simsun"
"MS Sans Serif"="simsun"
"MS Shell Dlg"="simsun"
"MS Shell Dlg 2"="simsun"
"System"="simsun"
"Tahoma"="simsun"
"Times"="simsun"
"Times New Roman CE,238"="simsun"
"Times New Roman CYR,204"="simsun"
"Times New Roman Greek,161"="simsun"
"Times New Roman TUR,162"="simsun"
"Tms Rmn"="simsun"
```
### OK，到这里你就可以打开wine程序，看看是不是中文了 ###
