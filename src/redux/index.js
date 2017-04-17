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
import postReducer from './post';
import tollMdPreviewReducer from './tool-md-preview';

function createStore() {
  const rootReducer = combineReducers({
    READ_ME: homeReadMeReducer,
    ABOUT_ME: aboutMeReducer,
    POSTS: postsReducer,
    POST: postReducer,
    OWNER: ownerReducer,
    ORGS: orgsReducer,
    REPOS_STAT: repoStatReducer,
    FOLLOWING: followingReducer,
    FOLLOWER: followerReducer,
    ALL_REPOS: allReposReducer,
    ALL_ORG_REPOS: allOrgRepoReducer,
    ROLL_LIST: rollListReducer,
    REPOS: reposReducer,
    TOOL_MD_PREVIEW: tollMdPreviewReducer
  });

  return configureStore(rootReducer);
}

// 返回一个store，供全局使用
export default createStore();
