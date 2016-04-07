title: typescript强类型语言的一些猜想
date: 2016-04-07 21:46:42
tags: typescript
categories: Javascript
---

Typescript是javascript的超集，并且是可以实现强类型的语言。

而且书写方式类似与后台语言，要写接口interface来限定类型。

然后编译成javascript。

javascript是动态类型语言，是弱类型，意味着变量不需要声明类型，不用限制变量的类型，它可以是数字，可以是字符串，可以是对象等等。

好处就是，书写javascript很轻松，坑的地方就是，变量的类型可以改变，可能会引发一些未知的bug。

而在2015年发布了ECMA5，并且以后每年都会发布新版本，这是好事，说明前端的健康发展。

逐渐的模块话，类，以及ECMA7的装饰，正在实现一些javascript预编译的功能，而coffeeScript还没会，就已经被抛弃了。

我不禁想，每年一个版本，而且nodejs让javascript可以编写后台，那么以后javascript会不会出现强类型？多线程之类的？

就关于强类型，我处于好奇，写了一段小代码。意在实现javascript的强类型。

写起来可能有些繁琐，但这也是思路。故分享出来。

代码如下

<!-- more -->

```js
;(function ($ts) {
  'use strict';
  var g = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : this;
  var module = g.module;
  var define = g.define;
  var angular = g.angular;

  if (typeof module !== "undefined" && typeof module === "object" && typeof module.exports === "object") {
    module.exports = factory(angular);
  }
  if (typeof define !== "undefined" && typeof define === 'function' && typeof define.amd === 'object' && define.amd) {
    define(function () {
      return $ts;
    });
  }
  if (g) {
    g.$ts = $ts;
  }
})(function () {
  return function (attr, typeLimit) {
    var origin = obj[attr];
    var type = Object.prototype.toString.call(typeLimit);
    Object.defineProperty(obj, attr, {
      set: function (newVal) {
        var newValType = Object.prototype.toString.call(newVal);
        if (type !== newValType) {
          console.log("TypeError:The attr [%s] is only %s, not a %s", attr, type, newValType);
        } else {
          origin = newVal;
          return newVal;
        }
      },
      get: function () {
        return origin;
      }
    })
  }
});

```

使用方式：

```js
var obj = {a: 123, b: 'hello world', c: []};

var t = $ts(obj);

// 限制为数字
t('a', 1);
obj.a = 321;
console.log(obj.a);     // 321

obj.a = 'hello world';  // error
console.log(obj.a)      // 321

// 限制为字符串
t('b', 'a');

// 限制为数组
t('c',[]);

```

看起来有些繁琐
