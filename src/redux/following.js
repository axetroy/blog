/**
 * 存储第一页的following
 */
import { createAction, handleActions } from 'redux-actions';

export const STORE = 'STORE_FOLLOWINGS_ME';
export const INITIAL_STATE = [];

export const storeFollowings = createAction(STORE, any => any);

const reducer = handleActions(
  {
    [STORE]: function(state, { payload }) {
      return INITIAL_STATE.concat(payload);
    }
  },
  INITIAL_STATE
);

export default reducer;
