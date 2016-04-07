title: 写了几个AngularJS的小模块
date: 2016-04-07 01:48:59
tags: [js,angular]
categories: Javascript
---

纯粹是练手，学习Angular..

### [at-promise](https://github.com/axetroy/at-promise)

Angular的promise指令

根据promise的结果，渲染不同的视图

<!-- more -->

### [at-storage](https://github.com/axetroy/at-storage)

AngularJS 的storage服务。

用于持久性的网络存储，主要是使用HTML5的localStorage和sessionStorage

如果IE9以下版本，或者不支持，则使用cookie作为fallback

与其他的库相比就是bug多，嘿嘿～～！

能储存js的各种类型的变量，布尔值，数字，字符串，数组，对象等，不能存函数

而且封装好了一个``$watch``事件监听，监听指定的缓存变化时，所触发的函数，基于onstorage事件

### [at-compare](https://github.com/axetroy/at-compare)

Angular的compare指令，用于表单的对比

[demo](http://www.burningall.com/at-compare/)

```html
// 通过表单的name值对比
at-compare = 'a>b';
at-compare = 'a>=b';
at-compare = 'a<b';
at-compare = 'a<=b';
at-compare = 'a==b';
at-compare = 'a===b';
at-compare = 'a!=b';
at-compare = 'a!==b';

// 对比数字
at-compare = 'a>10';
at-compare = 'a>=20';
at-compare = 'a<30';
at-compare = 'a<=40';
at-compare = 'a==50';
at-compare = 'a===60';
at-compare = 'a!=70';
at-compare = 'a!==80';

// 对比字符串
at-compare = 'a>"10"';
at-compare = 'a>="20"';
at-compare = 'a<"30"';
at-compare = 'a<="40"';
at-compare = 'a=="50"';
at-compare = 'a==="60"';
at-compare = 'a!="70"';
at-compare = 'a!=="80"';

// 直接对比$scope下的值,通过 in $scope 或 in scope
$scope.test = 50;

at-compare = 'a > test in $scope';
at-compare = 'a >= test in $scope';
at-compare = 'a < test in $scope';
at-compare = 'a <= test in $scope';
at-compare = 'a == test in $scope';
at-compare = 'a === test in $scope';
at-compare = 'a != test in $scope';
at-compare = 'a !== test in $scope';

// 对比的位置可以对换

at-compare = 'test in $scope > a';
at-compare = 'test in $scope >= a';
at-compare = 'test in $scope < a';
at-compare = 'test in $scope <= a';
at-compare = 'test in $scope == a';
at-compare = 'test in $scope === a';
at-compare = 'test in $scope != a';
at-compare = 'test in $scope !== a';
```

#### 常用的场景

*  确认密码
* 以及各种大小的比较等

