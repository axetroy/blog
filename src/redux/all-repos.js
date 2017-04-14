/**
 * 存储"我所有仓库"
 */
import { createAction, handleActions } from 'redux-actions';

export const STORE = 'STORE_ALL_REPOS';
export const INITIAL_STATE = [];

export const set = createAction(STORE, any => any);

const reducer = handleActions(
  {
    [STORE]: function(state, { payload }) {
      return INITIAL_STATE.concat(payload);
    }
  },
  INITIAL_STATE
);

export default reducer;
