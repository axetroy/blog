/**
 * 存储帖子列表
 */
import { createAction, handleActions } from 'redux-actions';

export const SET = 'SET_GISTS';
export const INITIAL_STATE = [];

export const set = createAction(SET, any => any);

const reducer = handleActions(
  {
    [SET]: function(state, { payload }) {
      return INITIAL_STATE.concat(payload);
    }
  },
  INITIAL_STATE
);

export default reducer;
