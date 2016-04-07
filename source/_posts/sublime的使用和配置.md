title: sublime的使用和配置
date: 2015-12-16 23:59:23
tags: sublime
categories: 折腾
---
sublime是一款轻量级的代码编辑器，它不是IDE，却不比IDE差，关键是运行快，什么机子都能够跑起来。
而且插件够多，能够媲美类似webstorm这样的神器。支持多语言。
这里需要注意一下的是，linux下并不支持中文，在编辑器内不能输入中文，虽然有方法可以，但是有点麻烦。
闲话少说。
<!--more-->
### 1，安装sublime
下载地址：[sublime text3](http://www.sublimetext.com/3)
### 2，安装Package Control
插件管理包，必备
下载地址：[Package Control](http://www.php100.com/html/it/focus/2014/1128/7935.html)
或者使用控制台安装输入命令：
``` bash
import urllib.request,os,hashlib; h = '2915d1851351e5ee549c20394736b442' + '8bc59f460fa1548d1514676163dafc88'; pf = 'Package Control.sublime-package'; ipp = sublime.installed_packages_path(); urllib.request.install_opener( urllib.request.build_opener( urllib.request.ProxyHandler()) ); by = urllib.request.urlopen( 'http://packagecontrol.io/' + pf.replace(' ', '%20')).read(); dh = hashlib.sha256(by).hexdigest(); print('Error validating download (got %s instead of %s), please try manual install' % (dh, h)) if dh != h else open(os.path.join( ipp, pf), 'wb' ).write(by)
```
### 3，安装必备插件
在sublime中打开插件包控控制台或ctrl+p输入pci搜索插件

1. All Autocomplete
    > 自动不全
2. AutoFileName
    > 自动搜索目录下的文件名，在引用文件的时候比较方便
3. Emmet
    > 地球人都知道，对吧
4. Tag
    > 高亮当前标签的标签头和尾
5. jsFormat
    > JS格式化
6. color Highlighter
    > 代码高亮
7. BracketHightlighter
    > 高亮标签/括号/大括号等开始和闭合
8. Colorcoder
    > 高亮颜色代码
9. CTags
    > 左侧栏显示标签样式
10. DocBlockr
    > 更优雅的注释
11. SublimeLinter
    > 用于校验js代码
12. SublimeCodeIntel
    > JS代码提示功能
13. SublimeLinter-jshint
    > 基于SublimeLinter的JS插件
14. angularjs
    > 支持angular的语法提示

### 4，配置文件
sublime是好用，但是就是配置起来，麻烦的很
``` json
{
	"auto_complete": true,
	"auto_complete_delay": 50,
	"auto_complete_size_limit": 4194304,
	"auto_match_enabled": true,
	"caret_style": "smooth",
	"color_scheme": "Packages/Colorcoder/Monokai (Colorcoded) (SL) (Colorcoded).tmTheme",
	"default_encoding": "UTF-8",
	"font_size": 15,
	"highlight_line": true,
	"hot_exit": true,
	"ignored_packages":
	[
		"Vintage"
	],
	"match_brackets": true,
	"match_selection": true,
	"original_color_scheme": "Packages/User/SublimeLinter/Monokai (Colorcoded) (SL).tmTheme",
	"save_on_focus_lost": false,
	"scroll_speed": 1.0,
	"show_tab_close_buttons": true,
	"tab_size": 2,
	"translate_tabs_to_spaces": true,
	"tree_animation_enabled": true,
	"trim_automatic_white_space": true,
	"word_wrap": false
}
```
### 5，配置nodejs路径
window下可以愉快的玩耍，但是linux呢，由于nodejs的路径不对，导致很到依赖于nodejs的插件都不能正常工作。
比如js的语法校验，就是通过nodejs，所以需要配置。
