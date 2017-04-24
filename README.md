这是我的个人主页

托管于Github，所有的数据均来源于Github的api

通过动态加载数据渲染页面

用来当作博客，工具集合，开源项目展示用

### 为什么不使用Hexo之类的静态博客

Hexo的流程: 

- 新建一个xxx.md(无论是手动或命令行)
- 编辑相应的信息, 如发布日期, 分类, 标签, 内容. 
- 本地预览
- 将markdown构建成html静态文件
- 部署到服务器
- push源代码

它可能不适合我: 
- 疲与上面的步骤
- 依赖于开发环境(首先你要有nodejs, 有hexo)

我要的是一次部署之后，不用再care源码. 也不依赖环境, 登陆Github就能发文章，治好了我多年偷懒的毛病(:逃...

再者，Github发布issues之后不能删除，对文章的质量要求更高。

### 特性

- [x] 动态加载issues作为博客
- [x] 动态加载issues评论作为博客评论
- [x] 动态加载仓库
- [x] 动态加载issues作为todo计划
- [ ] 数据可视化
- [ ] 常用工具集合
- [x] 动态分析仓库总结
- [x] 动态分析所在组织
- [x] 响应式
- [ ] PWA
- [x] 数据持久化(Redux+Persist)
- [x] 部署教程

### 使用

```bash
git clone https://github.com/axetroy/blog.git
yarn
yarn start
```

### 部署

1. 修改成你自己的相关信息

**package.json**

```yarm
- config
    - owner: axetroy                                                        # 你的名字
    - repo: blog                                                            # 博客的仓库名字
    - github_client_id: b8257841dd7ca5eef2aa                                # github的client_id
    - github_client_secret: 4da33dd6fcb0a01d395945ad18613ecf9c12079e        # github的client_secret
    
- scripts
    - deploy: gh-pages --repo https://github.com/axetroy/axetroy.github.io.git --branch master -d build     # 修改成你要部署的仓库
```

2. 运行命令部署

```bash
yarn
yarn run build
yarn run deploy
```

## 贡献代码

```bash
git clone https://github.com/axetroy/blog.git
cd ./blog
yarn
npm start
```

You can flow [Contribute Guide](https://github.com/axetroy/blog/blob/master/contributing.md)

## 贡献者

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
| [<img src="https://avatars1.githubusercontent.com/u/9758711?v=3" width="100px;"/><br /><sub>Axetroy</sub>](http://axetroy.github.io)<br />[💻](https://github.com/axetroyanti-redirect/anti-redirect/commits?author=axetroy) [🐛](https://github.com/axetroyanti-redirect/anti-redirect/issues?q=author%3Aaxetroy) 🎨 |
| :---: |
<!-- ALL-CONTRIBUTORS-LIST:END -->

## 开源许可

The [MIT License](https://github.com/axetroy/blog/blob/master/LICENSE)