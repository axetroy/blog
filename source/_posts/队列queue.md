title: 队列queue
date: 2016-05-06 22:30:23
tags: javascript
categories: Javascript
---

队列与栈类似，但是使用了不同的原则。

队列是遵循**FIFO**(First In First Out,现进先出，也称先来先服务)原则的一组有序的项。

队列在尾部添加新元素，并从顶部移除元素。最新添加的元素必须排在队列的末尾。

现实中，最常见的队列例子就是排队，谁先来，就到谁。

### 基本队列

```javascript
class Queue {
  constructor() {
    this.items = [];
  }

  // 入列,向队列尾部添加一个(多个)项
  enqueue(item) {
    this.items.push(item);
  }

  // 出列,移除队列的第一个,并且返回被删除的元素
  dequeue() {
    return this.items.shift();
  }

  // 返回队列的第一个
  front() {
    return this.items[0];
  }

  isEmpty() {
    return this.items.length === 0;
  }

  size() {
    return this.items.length;
  }

  print() {
    console.log(this.items.toString());
  }

}

var queue = new Queue();

queue.enqueue('hello');
queue.enqueue('world');

```

<!-- more -->

### 优先级队列

优先级队列就是设置项的优先级

在上面基本队列的基础上进行继承


```javascript
class PriorityQueue extends Queue {
  constructor() {
    super();
  }

  // 重写enqueue
  enqueue(item, priority = 0) {
    let queueItem = {item, priority};

    if (this.isEmpty()) {
      this.items.push(queueItem);
    }
    else {
      let added = false;
      for (let i = 0; i < this.items.length; i++) {
        // 如果目标的权重，比当前循环的小
        if (queueItem.priority < this.items[i].priority) {
          // 把目标放到当前index的前面
          this.items.splice(i, 0, queueItem);
          added = true;
          break;
        }
      }
      // 如果遍历之后，所以的元素权重，都比目标小，则直接放在尾部
      if (!added) {
        items.push(queueItem);
      }

    }
  }
}

var q = new PriorityQueue();

q.enqueue('priority 2', 2);
q.enqueue('priority 1', 1);
q.enqueue('priority 0', 0);
```

### 循环队列-击鼓传花

循环队列，是队列的一个修改版。

循环队列的一个例子就是击鼓传花游戏。在这个游戏中，孩子们围着一个圆圈，把花尽快的传给旁边的人。

某一时刻传花停止，在这时候花在谁手里，谁就退出圆圈被淘汰。重复这个过程，知道最后剩下一人。

```javascript
function hotPotato(nameList, num) {
  var queue = new Queue();

  for (let i = 0; i < nameList.length; i++) {
    queue.enqueue(nameList[i]);
  }

  let eliminated = '';
  while (queue.size() > 1) {
    for (let i = 0; i < num; i++) {
      queue.enqueue(queue.dequeue());
    }
    eliminated = queue.dequeue();
    console.log(`${eliminated}被淘汰`);
  }

  return queue.dequeue();

}

var names = ['a', 'b', 'c', 'd', 'e'];
var winner = hotPotato(names, 7);
console.log(`winner is ${winner}`);   // a

var winner = hotPotato(names, 10);
console.log(`winner is ${winner}`);   // e
```

实现一个模拟的击鼓传花游戏。

使用队列生成一个名单，给定一个数字(模拟某时刻)，然后迭代.

从队列开头移除一项，然后添加到队列末尾。

一旦传递的次数达到给定的次数，拿着花的那个人就被淘汰。

最后剩下一人就是胜利者。
