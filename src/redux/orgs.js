/**
 * 我的组织列表
 */
import { createAction, handleActions } from 'redux-actions';

export const STORE = 'STORE_ORGS';
export const INITIAL_STATE = [];

export const store = createAction(STORE, any => any);

const reducer = handleActions(
  {
    [STORE]: function(state, { payload }) {
      return INITIAL_STATE.concat(payload);
    }
  },
  INITIAL_STATE
);

export default reducer;
