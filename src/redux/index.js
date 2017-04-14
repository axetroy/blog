import { combineReducers } from 'redux';
import configureStore from './createStore';

// reducers
import homeReadMeReducer from './homeReadMe';
import aboutMeReducer from './aboutMe';
import postsReducer from './posts';
import reposReducer from './repos';
import ownerReducer from './owner';
import rollListReducer from './rollList';
import orgsReducer from './orgs';
import orgsReposReducer from './orgs-repos';
import repoStatReducer from './repo-stat';
import followingReducer from './following';
import followerReducer from './follower';
import allReposReducer from './all-repos';

function createStore() {
  const rootReducer = combineReducers({
    homeReadMe: homeReadMeReducer,
    aboutMe: aboutMeReducer,
    posts: postsReducer,
    repos: reposReducer,
    owner: ownerReducer,
    rollList: rollListReducer,
    orgs: orgsReducer,
    orgsRepos: orgsReposReducer,
    repoStat: repoStatReducer,
    following: followingReducer,
    follower: followerReducer,
    allRepos: allReposReducer,
  });

  return configureStore(rootReducer);
}

// 返回一个store，供全局使用
export default createStore();
