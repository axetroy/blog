这是我的个人主页

托管于Github，所有的数据均来源于Github的api

通过动态加载数据渲染页面

用来当作博客，工具集合，开源项目展示用

### 为什么不使用Hexo之类的静态博客

因为我讨厌每次都要去新建一个.md, 然后再build, 再部署

要做的就是一次部署之后，不用再care源码.

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

### 部署

```bash
yarn
yarn run build
yarn run deploy
```
