[![Build Status](https://travis-ci.org/axetroy/blog.svg?branch=master)](https://travis-ci.org/axetroy/blog)
![License](https://img.shields.io/badge/license-MIT-green.svg)
[![Prettier](https://img.shields.io/badge/Code%20Style-Prettier-green.svg)](https://github.com/prettier/prettier)
![Node](https://img.shields.io/badge/node-%3E=6.0-blue.svg?style=flat-square)
![Size](https://github-size-badge.herokuapp.com/axetroy/blog.svg)

欢迎来到我的个人主页

本站托管于 Github，所有数据来源于 Github，通过动态加载数据渲染页面

将**Server Less**进行到底

### 特性

* [x] 博客
* [x] 代码片段 Gist
* [x] 仓库集合
* [x] 计划任务 TODO
* [x] 响应式
* [x] Progressive Web Apps
* [x] 数据持久化
* [x] 按需加载
* [x] 静态类型检查
* [ ] i18n
* [x] 分析 Github 相关数据
* [x] 集成[FireBase](https://firebase.google.com/)
* [x] 支持[Github GraphQL API v4](https://developer.github.com/v4/)

### 技术栈

* React 全家桶
* Ant-Design
* Github Api
* Flow

### 为什么不使用 Hexo 之类的静态站点

Hexo 的流程:

* 新建一个 xxx.md(无论是手动或命令行)
* 编辑相应的信息, 如发布日期, 分类, 标签, 内容.
* 本地预览
* 将 markdown 构建成 html 静态文件
* 部署到服务器
* push 源代码

它并不适合我:

* 疲与上面的步骤
* 依赖于开发环境，首先你要有 NodeJS 以及 Hexo
* 修改麻烦，有时就想要改一个字，还得打开编辑器，修改，build，部署.

> 我的目标是：部署之后，不用再 care 源码，也不依赖于生产环境，登陆 Github 就操作。

### 开源许可

The [MIT License](https://github.com/axetroy/blog/blob/master/LICENSE)
