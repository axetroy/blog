欢迎来到我的个人主页

本站托管于Github，所有数据来源于Github，通过动态加载数据渲染页面

将serverless进行到底

### 特性

- [x] 博客
- [x] 代码片段Gist
- [x] 仓库集合
- [x] 工具集合
- [x] TODO计划任务
- [x] 响应式
- [ ] Progressive Web Apps
- [x] 数据持久化
- [x] 按需加载
- [ ] i18n
- [x] 部署教程
- [x] 分析Github相关数据

### 技术栈

- React全家桶
- ant-design
- Github Api

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

### 使用

```bash
git clone https://github.com/axetroy/blog.git
yarn
yarn start
```

### 部署

部署教程稍微有点麻烦

真要部署的可以在Github的issues问我

#### 1.修改成你自己的相关信息

**package.json**

```yarm
- config
    - owner: axetroy                                                        # 你的名字
    - repo: blog                                                            # 博客的仓库名字
    - todo_repo: todo                                                       # TODO计划的仓库名字
    - github_client_id: b8257841dd7ca5eef2aa                                # github的client_id
    - github_client_secret: 4da33dd6fcb0a01d395945ad18613ecf9c12079e        # github的client_secret
    
- scripts
    - deploy: gh-pages --repo https://github.com/axetroy/axetroy.github.io.git --branch master -d build     # 修改成你要部署的仓库
```

#### 2.运行命令部署

```bash
yarn
yarn run build
yarn run deploy
```

### 贡献代码

```bash
git clone https://github.com/axetroy/blog.git
cd ./blog
yarn            # 安装依赖
yarn start      # 监听10086端口
```

You can flow [Contribute Guide](https://github.com/axetroy/blog/blob/master/contributing.md)

### 贡献者

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
| [<img src="https://avatars1.githubusercontent.com/u/9758711?v=3" width="100px;"/><br /><sub>Axetroy</sub>](http://axetroy.github.io)<br />[💻](https://github.com/axetroyanti-redirect/anti-redirect/commits?author=axetroy) [🐛](https://github.com/axetroyanti-redirect/anti-redirect/issues?q=author%3Aaxetroy) 🎨 |
| :---: |
<!-- ALL-CONTRIBUTORS-LIST:END -->

### 开源许可

The [MIT License](https://github.com/axetroy/blog/blob/master/LICENSE)
