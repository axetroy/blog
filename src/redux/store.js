import localForage from "localforage";
import createStore from "redux-zero";
import logger from "redux-zero-logger";
import persist from "redux-zero-persist";
import { applyMiddleware } from "redux-zero/middleware";

const initialState = {
  OWNER: {}, // 用户信息
  FOLLOWERS: [], // 关注我的人
  SHOW_CASES: [], // 项目展示
  TODO: {}, // Todo详情
  TODOS: [], // Todo列表
  TODO_LABELS: [], // Todo的标签列表
  REPO: {}, // 仓库详情
  REPOS: [], // 仓库列表
  POST: {}, // 文章详情
  POSTS: [], // 文章列表
  STACKOVERFLOW: {}, // 踩坑详情
  STACKOVERFLOWS: [], // 踩坑列表
  GIST: {}, // Gist的详情
  GISTS: [] // Gist列表
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
