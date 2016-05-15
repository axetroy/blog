title: 观察者模式，实现简单的promise
date: 2016-05-09 01:39:50
tags: javascript
categories: Javascript
---

前面有片文章，粗略的写了个观察者的demo

现在，我们通过那个demo代码，模拟一个简单的promise

核心思想就是：A通知B，B通知C，C通知A...各种发布订阅

```javascript
class Observer {
  constructor() {

  }

  subscribe(eventName, func) {
    if (!this[eventName]) this[eventName] = [];
    this[eventName].push(func);
    return this;
  }

  publish(eventName, data) {
    if (!this[eventName]) this[eventName] = [];
    this[eventName].forEach(func=> {
      func.call(this, data);
    });
    return this;
  }

  remove(eventName) {
    this[eventName] = [];
    return this;
  }

}

var noop = function () {
};

var isPromiseLike = function (object) {
  return typeof object === 'object' && !!object.then && typeof object.then === 'function';
};

var $Promise = function (func) {

  let $promise = this;
  $promise.ob = new Observer();
  $promise.resolve = noop;
  $promise.reject = noop;
  $promise.thenReturnVal = undefined;

  class $$promise {
    constructor(func) {
      this.status = -1;
      this.value = undefined;

      func(data=> {
        setTimeout(()=> this.resolve(data), 0);
      }, data=> {
        setTimeout(()=>this.reject(data), 0);
      });
    }

    resolve(value) {
      this.status = 1;
      this.value = value;
      $promise.ob.subscribe('resolve', data=> {
        $promise.thenReturnVal = $promise.resolve(data);
      });
      $promise.ob.publish('finally', this.status);
      return this;
    }

    reject(value) {
      this.status = 0;
      this.value = value;
      $promise.ob.subscribe('reject', data=> {
        $promise.thenReturnVal = $promise.reject(data);
      });
      $promise.ob.publish('finally', this.status);
      return this;
    }

    then(resolve = noop, reject = noop) {
      $promise.resolve = resolve;
      $promise.reject = reject;

      switch (this.status) {
        case 0:
          $promise.ob.publish('reject', this.value);
          break;
        case 1:
          $promise.ob.publish('resolve', this.value);
          break;
        default:
          $promise.ob.subscribe('finally', (status)=> {
            status === 1 ? $promise.ob.publish('resolve', this.value) : $promise.ob.publish('reject', this.value);
          });
      }

      let newPromise = new $Promise((resolve, reject) => {
        $promise.ob.subscribe('finally', (status)=> {
          if (isPromiseLike($promise.thenReturnVal)) {
            $promise.thenReturnVal.then(data=> {
              resolve(data);
            }, data=> {
              reject(data);
            });
          } else {
            switch (status) {
              case 0:
                setTimeout(()=>reject($promise.thenReturnVal));
                break;
              case 1:
                setTimeout(()=>resolve($promise.thenReturnVal));
            }
          }
        });
      });

      return newPromise;

    }

    ['catch'](func) {
      $promise.ob.subscribe('finally', ()=> {
        func.call(this, this.value);
      });
      return this;
    }

    ['finally'](func) {
      $promise.ob.subscribe('finally', ()=> {
        func.call(this, this.value);
      });
    }

  }

  return new $$promise(func);
};


// 使用实例
var random1 = new $Promise(function (resolve, reject) {
  var random = Math.random();
  setTimeout(function () {
    random > 0.5 ? resolve(random) : reject(random);
  }, 1000);
});

var random2 = new $Promise(function (resolve, reject) {
  var random = Math.random();
  setTimeout(function () {
    random > 0.5 ? resolve(random) : reject(random);
  }, 2000);
});

random1
  .then(function (data1) {
    console.log('data1:' + data1);
    return random2;
  }, function (data1) {
    console.error('data1:' + data1);
    return random2;
  })
  .then(function (data) {
    console.info(data);
  }, function (data) {
    console.error(data);
  })
  .catch(function () {
    console.log('error');
  })
  .finally(function () {
    alert(123);
  });
```
