import { combineReducers } from 'redux';
import configureStore from './createStore';

// reducers
import homeReadMeReducer from './readme';
import aboutMeReducer from './about';
import postsReducer from './posts';
import reposReducer from './repos';
import ownerReducer from './owner';
import rollListReducer from './rollList';
import orgsReducer from './orgs';
import repoStatReducer from './repo-stat';
import followingReducer from './following';
import followerReducer from './follower';
import allReposReducer from './all-repos';
import allOrgRepoReducer from './all-orgs-repos';

function createStore() {
  const rootReducer = combineReducers({
    homeReadMe: homeReadMeReducer,
    aboutMe: aboutMeReducer,
    posts: postsReducer,
    repos: reposReducer,
    owner: ownerReducer,
    rollList: rollListReducer,
    ORGS: orgsReducer,
    REPOS_STAT: repoStatReducer,
    following: followingReducer,
    follower: followerReducer,
    allRepos: allReposReducer,
    ALL_ORG_REPOS: allOrgRepoReducer,
  });

  return configureStore(rootReducer);
}

// 返回一个store，供全局使用
export default createStore();
