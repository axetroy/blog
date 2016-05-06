title: javascript模拟堆栈
date: 2016-05-06 21:51:13
tags:
---

栈是一种遵循先进先出(LIFO)原则的有序集合。新添加的或待删除的元素都保存在栈的末尾，未栈顶，另一端为栈底。

在栈里，新元素都会靠近栈顶，旧元素都接近栈底。

```javascript
class Stack {
  constructor() {
    this.items = [];
  }

  push(item) {
    this.items.push(item);
  }

  pop() {
    return this.items.pop();
  }

  peek() {
    return this.items[this.items.length - 1];
  }

  isEmpty() {
    return this.items.length === 0;
  }

  clear() {
    this.items = [];
  }

  size() {
    return this.items.length;
  }

  print() {
    console.log(this.items.toString());
  }
}


// 实际应用，转化任意禁止转化
function baseConverter(decNumber, base) {
  let remStack = new Stack();
  let rem;
  let binaryString = '';
  let digits = '0123456789ABCDEF';
  while (decNumber > 0) {
    rem = Math.floor(decNumber % base);
    remStack.push(rem);
    decNumber = Math.floor(decNumber / base);
  }

  while (!remStack.isEmpty()) {
    binaryString += digits[remStack.pop()];
  }
  return binaryString;
}

console.info(baseConverter(100345, 2));
console.info(baseConverter(100345, 8));
console.info(baseConverter(100345, 16));
```
