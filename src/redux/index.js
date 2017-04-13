import { combineReducers } from 'redux';
import configureStore from './createStore';

// reducers
import homeReadMeReducer from './homeReadMe';
import aboutMeReducer from './aboutMe';
import postsReducer from './posts';
import ownerReducer from './owner';
import rollListReducer from './rollList';
import orgsReducer from './orgs';
import orgsReposReducer from './orgs-repos';
import repoStatReducer from './repo-stat';

function createStore() {
  const rootReducer = combineReducers({
    homeReadMe: homeReadMeReducer,
    aboutMe: aboutMeReducer,
    posts: postsReducer,
    owner: ownerReducer,
    rollList: rollListReducer,
    orgs: orgsReducer,
    orgsRepos: orgsReposReducer,
    repoStat: repoStatReducer
  });

  return configureStore(rootReducer);
}

// 返回一个store，供全局使用
export default createStore();
