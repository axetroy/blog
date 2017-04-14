/**
 * 存储第一页仓库列表
 */
import { createAction, handleActions } from 'redux-actions';

export const SET = 'SET_REPOS';
export const INITIAL_STATE = [];

export const setRepos = createAction(SET, any => any);

const reducer = handleActions(
  {
    [SET]: function(state, { payload }) {
      return INITIAL_STATE.concat(payload);
    }
  },
  INITIAL_STATE
);

export default reducer;
