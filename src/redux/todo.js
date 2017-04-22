/**
 * 存储单个帖子
 */

import { createAction, handleActions } from 'redux-actions';
export const SET = 'SET_TODO';
export const INITIAL_STATE = {};
export const set = createAction(SET, any => any);
const reducer = handleActions(
  {
    [SET]: function(state, { payload }) {
      return {
        ...INITIAL_STATE,
        ...state,
        ...payload
      };
    }
  },
  INITIAL_STATE
);
export default reducer;
