[![Build Status](https://travis-ci.org/axetroy/blog.svg?branch=master)](https://travis-ci.org/axetroy/blog)
![License](https://img.shields.io/badge/license-MIT-green.svg)
[![Prettier](https://img.shields.io/badge/Code%20Style-Prettier-green.svg)](https://github.com/prettier/prettier)
![Node](https://img.shields.io/badge/node-%3E=6.0-blue.svg?style=flat-square)
![Size](https://github-size-badge.herokuapp.com/axetroy/blog.svg)

欢迎来到我的个人主页

本站托管于Github，所有数据来源于Github，通过动态加载数据渲染页面

将serverless进行到底

### 特性

- [x] 博客
- [x] 代码片段Gist
- [x] 仓库集合
- [x] 计划任务TODO
- [x] 响应式
- [x] Progressive Web Apps
- [x] 数据持久化
- [x] 按需加载
- [x] 静态类型检查
- [ ] i18n
- [x] 分析Github相关数据
- [x] 集成[firebase](https://firebase.google.com/)
- [x] 支持[Github GraphQL API v4](https://developer.github.com/v4/)

### 技术栈

- React全家桶
- ant-design
- Github Api
- Flow

### 为什么不使用Hexo之类的静态站点

Hexo的流程: 

- 新建一个xxx.md(无论是手动或命令行)
- 编辑相应的信息, 如发布日期, 分类, 标签, 内容. 
- 本地预览
- 将markdown构建成html静态文件
- 部署到服务器
- push源代码

它可能不适合我: 

- 疲与上面的步骤
- 依赖于开发环境(首先你要有nodejs, 有hexo，有时就想要改一个字，还得打开编辑器，修改，build，部署.)

> 我的目标是：
> 部署之后，不用再care源码，也不依赖于生产环境，登陆Github就操作。

### 源码目录

```bash
./src
├── App.css
├── App.js
├── App.test.js
├── component
│   ├── click-material
│   ├── comments
│   ├── document-title
│   ├── footer
│   ├── github-followers
│   ├── github-following
│   ├── github-lang
│   ├── github-lang-ingredient
│   ├── github-orgs
│   ├── github-repo
│   ├── github-user-info
│   ├── header
│   ├── repo-events
│   ├── repo-readme
│   ├── tool-md-preview
│   └── tool-roll
├── config.json
├── index.css
├── index.js
├── lib
│   ├── github-colors.json
│   ├── github.js
│   ├── github-markdown-parser.js
│   ├── pretty-bytes.js
│   └── utils.js
├── logo.svg
├── pages
│   ├── about
│   ├── gist
│   ├── gists
│   ├── github
│   ├── home
│   ├── oauth
│   ├── post
│   ├── posts
│   ├── repo
│   ├── repos
│   ├── search
│   ├── todo
│   ├── todos
│   └── tool
├── redux
│   ├── about.js
│   ├── all-orgs-repos.js
│   ├── all-repo-languages.js
│   ├── all-repos.js
│   ├── createStore.js
│   ├── follower.js
│   ├── following.js
│   ├── gist.js
│   ├── gists.js
│   ├── index.js
│   ├── oauth.js
│   ├── orgs.js
│   ├── owner.js
│   ├── post.js
│   ├── posts.js
│   ├── readme.js
│   ├── repo-languages.js
│   ├── repos.js
│   ├── repo-stat.js
│   ├── rollList.js
│   ├── todo.js
│   ├── todo-laberls.js
│   ├── todos.js
│   └── tool-md-preview.js
└── registerServiceWorker.js
```

### 贡献代码

```bash
git clone https://github.com/axetroy/blog.git
cd ./blog
yarn            # 安装依赖
yarn start      # 监听10086端口
```

You can flow [Contribute Guide](https://github.com/axetroy/blog/blob/master/contributing.md)

**Welcome PR :)**

### 贡献者

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
| [<img src="https://avatars1.githubusercontent.com/u/9758711?v=3" width="100px;"/><br /><sub>Axetroy</sub>](http://axetroy.github.io)<br />[💻](https://github.com/axetroyanti-redirect/anti-redirect/commits?author=axetroy) [🐛](https://github.com/axetroyanti-redirect/anti-redirect/issues?q=author%3Aaxetroy) 🎨 |
| :---: |
<!-- ALL-CONTRIBUTORS-LIST:END -->

### 开源许可

The [MIT License](https://github.com/axetroy/blog/blob/master/LICENSE)
