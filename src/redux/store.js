import createStore from "redux-zero";
import { applyMiddleware } from "redux-zero/middleware";
import logger from "redux-zero-logger";
import persist from "redux-zero-persist";

import localForage from "localforage";

const initialState = {
  OWNER: {}, // 用户信息
  FOLLOWINGS: [], // 我关注的人
  FOLLOWERS: [], // 关注我的人
  READ_ME: "",
  ABOUTME: "", // 关于我
  SHOW_CASES: [], // 项目展示
  TODO: {}, // Todo详情
  TODOS: [], // Todo列表
  TODO_LABELS: [], // Todo的标签列表
  REPO: {}, // 仓库详情
  REPOS: [], // 仓库列表
  ALL_REPOS: [], // 所有的仓库列表
  POST: {}, // 文章详情
  POSTS: [], // 文章列表
  GIST: {}, // Gist的详情
  GISTS: [], // Gist列表
  ORGS: [], // 用户所属的组织
  ORG_REPOS: {}, // 所属组织下，拥有的仓库
  REPO_STAT: {}, // 仓库的统计信息
  ALL_REPO_LANGUAGES: [] // 所有仓库，所属的
};

const middlewares = applyMiddleware(
  logger(),
  persist({ key: "[rz]", storage: localForage }, function(err, state) {
    if (err) {
      console.error(err);
    } else {
      store.setState(state);
    }
  })
);

const store = createStore(initialState, middlewares);

export default store;
