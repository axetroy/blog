title: javascript常用的操作与算法
date: 2016-05-06 01:42:16
tags: javascript
categories: Javascript
---

## 字符串操作

### 英文首字母大写

### 链式写法与驼峰式写法的转换

### 字符串反转

```javascript
//字符串反转(比如：ABC -> CBA)
function inverse(s) {
  var arr = s.split('');
  var i = 0, j = arr.length - 1;
  while (i < j) {
    var t = arr[i];
    arr[i] = arr[j];
    arr[j] = t;
    i++;
    j--;
  }
  return arr.join('');
}

var str = 'abc';
inverse(str);   // 'cba';
```

## 数组操作

### min到max的n个不重复的随机数

```javascript
// 生成n个不重复的随机数
function random_no_repeat(min, max, n) {
  var result = [];
  let temp = [];
  for (let i = min; i <= max; i++) {
    temp.push(i);
  }
  for (; n--;) {
    let index = parseInt(Math.random() * temp.length, 10);
    result.push(temp[index]);
    temp.splice(index, 1);
  }
  return result;
}

random_no_repeat(15, 20, 5);		// [15, 17, 20, 19, 18]
random_no_repeat(1, 100, 10)		// [95, 13, 96, 61, 67, 83, 35, 73, 74, 75]
```

<!--more-->

### 数组去重复

```javascript
function unique(arr) {
  let result = [];
  let hash = {};
  arr.forEach((v)=> {
    if (!hash[v]) {
      result.push(v);
      hash[v] = true;
    }
  });
  return result;
}
var arr = [1, 2, 3, 4, 2, 3, 5, 6, 1, 3, 5];
unique(arr)		// [1, 2, 3, 4, 5, 6]
```

### 找出字符串中，重复次数最多的字符，以及重复的次数

```javascript
// 找出字符串中，重复次数最多的字符
function match_str(str) {
  var result = {
    character: '',
    times: 0
  };
  var hash = {};
  str.split('').forEach((character)=> {
    if (!hash[character]) {
      hash[character] = 1;
    } else {
      hash[character]++;
    }
  });
  for (let character in hash) {
    let times = hash[character];
    if (times > result.times) {
      result.character = character;
      result.times = times;
    }
  }
  return result;
}

var s = "asddasdddddd";
match_str(s);		// Object {character: "d", times: 8}
```

## 排序

### 按照数字大小，排序一维数组

```javascript
// 从小到达排序
[1, 2, 3, 4, 11, 55, 12, 32, 55].sort(function (a, b) {
  return a > b;
});
// 结果：[1, 2, 3, 4, 11, 12, 32, 55, 55]

// 从大到小
[1, 2, 3, 4, 11, 55, 12, 32, 55].sort(function (a, b) {
  return a < b;
});
// 结果：[55, 55, 32, 12, 11, 4, 3, 2, 1]
```

### 排序由对象组成的数组

```javascript
var arr = [
  {name: 'yr', age: 12},
  {name: 'ad', age: 18},
  {name: 'hg', age: 13},
  {name: 'cz', age: 16}
];

// 按照年龄排序，又小到大
arr.sort(function (item1, item2) {
  return item1.age > item2.age
});

// 按照姓名排序
arr.sort(function (item1, item2) {
  return item1.name > item2.name
});
```

### 快速排序法

关于快速排序法，更多详细原理，可以看阮一峰老师的博客，[快速排序（Quicksort）的Javascript实现](http://www.ruanyifeng.com/blog/2011/04/quicksort_in_javascript.html)

```javascript
var quickSort = function (arr) {
  if (arr.length <= 1) {
    return arr;
  }
  var pivotIndex = Math.floor(arr.length / 2);
  // 快速排序的基准点
  var pivot = arr.splice(pivotIndex, 1)[0];
  var left = [];
  var right = [];
  for (var i = 0; i < arr.length; i++) {
    if (arr[i] < pivot) {
      left.push(arr[i]);
    } else {
      right.push(arr[i]);
    }
  }
  // 最后递归，不断重复这个过程
  return quickSort(left).concat([pivot], quickSort(right));
};

var arr = [31, 41, 23, 53, 12, 3, 4, 66];
quickSort(arr);   // [3, 4, 12, 23, 31, 41, 53, 66]
```

### 冒泡排序法

```javascript
function emitSort(arr) {
  var result = arr.slice();
  for (var i = 0; i < result.length - 1; i++) {//比较的次数是length-1
    for (var j = 0; j < result.length - 1 - i; j++) {
      if (result[j] > result[j + 1]) {
        var tmp = result[j];
        result[j] = result[j + 1];
        result[j + 1] = tmp;
      }
    }
  }
  return result;
}

var arr = [31, 22, 51, 1, 6, 23, 55];
emitSort(arr);    // [1, 6, 22, 23, 31, 51, 55]
```
### 选择排序法(未完善)

```javascript
function selectSort(arr) {
  var min, tmp, result = arr.slice();
  for (var out = 0; out < result.length - 1; out++) {
    min = out;
    for (var inner = out + 1; inner < result.length; inner++) {
      if (result[inner] < result[min]) {
        min = inner;
      }
      //将最小的项移动到左侧
      tmp = result[out];
      result[out] = result[min];
      result[min] = tmp;
    }
  }
  return result;
}

var arr = [31, 22, 51, 1, 6, 23, 55];
selectSort(arr);    // [1, 6, 22, 23, 31, 51, 55]
```

### 插入排序法

```javascript
function insertSort(arr) {
  var result = arr.slice();
  for (var out = 1; out < result.length; out++) {
    var tmp = result[out];
    var inner = out;
    while (result[inner - 1] > tmp) {
      result[inner] = result[inner - 1];
      --inner;
    }
    result[inner] = tmp;
  }
  return result;
}

var arr = [31, 22, 51, 1, 6, 23, 55];
insertSort(arr);    // [1, 6, 22, 23, 31, 51, 55]
```

### 希尔排序

```javascript
// TODO
```

## 查找

### 线下查找

虽然说ECMA5的Array由indexOf方法，但是不妨我们可以学习

```javascript
function linearSearch(arr, value) {
  for (var i = 0; i < arr.length; i++) {
    if (arr[i] === value) {
      return i;
    }
  }
  return -1;
}

var arr = ['axe', 'troy'];
linearSearch(arr, 'troy');   // 1
```

### 二分查找

```javascript
function binarySearch(arr, value) {
  var low = 0, high = arr.length - 1;
  while (low <= high) {
    var mid = Math.floor((low + high) / 2);
    if (value == arr[mid]) {
      return mid;
    }
    if (value < arr[mid]) {
      high = mid - 1;
    }
    else {
      low = mid + 1;
    }
  }
  return -1;
}

var arr = ['axe','troy','hello','world'];
binarySearch(arr,'troy');   // 1
```
