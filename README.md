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

我要的是一次部署之后，不用再care源码. 也不依赖环境, 登陆Github就能发文章

### Feature

- [x] 动态加载issues作为博客
- [ ] 动态加载issues评论作为博客评论
- [x] 动态加载仓库
- [ ] 数据可视化
- [ ] 常用工具集合
- [ ] 动态分析仓库总结
- [ ] 动态分析所在组织
- [x] 数据持久化(Redux+Persist)
- [ ] 部署教程

### 使用

```bash
git clone https://github.com/axetroy/blog.git
yarn
yarn start
```

### 部署

1. 修改成你自己的相关信息

    **package.json**

```
  "...": "...",
  "config": {
    "owner": "axetroy",     # 你的名字
    "repo": "blog"          # 你博客的仓库名称
                            # 最终结果: https://github.com/axetroy/blog
  },
  "...": "...",
  "scripts": {
    "start": "node scripts/start.js",
    "build": "node scripts/build.js",
    "test": "node scripts/test.js --env=jsdom",
    "deploy": "gh-pages --repo https://github.com/axetroy/axetroy.github.io.git --branch master -d build"   # 修改成你要部署的仓库
  },
  
```

2. 运行命令部署

```bash
yarn
yarn run build
yarn run deploy
```
