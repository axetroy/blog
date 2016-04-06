title: 'ES6的使用,Traceur编译器'
date: 2016-01-09 15:56:41
tags: js,es6
---
最近也在学习ES6的新语法，感觉就像是一门新的语言。
变化太大，会不会重蹈ES4的老路呢？
相信刚刚看ES6的人，都会觉得：“卧槽，这还是JS吗？”

不得不说，ES6的扩展行很强，更规范。但同时也同难以学习，ES5和ES6的语法混用，导致代码阅读性很低。

这是阮一峰老师的书，可以带你很好的入门ES6。
[http://es6.ruanyifeng.com/](http://es6.ruanyifeng.com/)
<!--more-->
### 使用Traceur ###
其实之前我就在想，ES6的语法，在浏览器会报错的。
那是不是都是要用nodeJS先把ES6转换成ES5的文件，才能在浏览器上用呢？
babel已经不提供了直接运行的环境，只提供node转换。
Traceur根据官方[github](https://github.com/google/traceur-compiler/wiki/Getting-Started)上的demo。依旧是可以直接在浏览器上运行的。
类似与facebook的JSX，在浏览器上编译。
下面是demo
```html
<!DOCTYPE html>
<html>
  <head>
    <title>Hello, World!</title>
    <script src="../bin/traceur.js"></script>
    <script src="../src/bootstrap.js"></script>
  </head>
  <body>
    <script type="module">

      class Greeter {
        constructor(message) {
          this.message = message;
        }

        greet() {
          let element = document.querySelector('#message');
          element.textContent = this.message;
        }
      }

      let greeter = new Greeter('Hello World!');
      greeter.greet();

    </script>
    <h1 id="message"></h1>
  </body>
</html>

```
可以看到，我们可以直接在js文件里面写ES6，而不用通过nodejs转化，在学习ES6的过程中，要写一些demo还是挺方便的。

需要注意的是，需要转换的ES6代码，script标签需要使用
```html
<script type="module">...</script>
```
Traceur编译器只是模拟了ES6，并不是真正的实现。不然chrome已经支持了。毕竟Traceur就是google的嘛。

比如新语法let，是不会变量前置的(ES6的规范里面，更严格了，let必须先声明，才能调用，否则报错)
```js
// ES6
alert(a);		// 报错
let a = 123;

// Traceur
alert(a);		// undefinded
let a = 123;

// ES5
alert(a);		// undefined
var a = 123;
```
这个涉及到JS解析器的预解析功能，会替换读取var function arguments存储起来，然后再逐行解析代码。

好了，通过Traceur编译器，我们就可以自己写一些demo练习ES6了。
当然还有更快捷的方式。
有个chrome扩展Scratch JS，可以运行ES6。
