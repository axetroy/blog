import { createAction, handleActions } from 'redux-actions';

export const STORE = 'STORE_FOLLOWERS_ME';
export const INITIAL_STATE = [];

export const storeFollower = createAction(STORE, any => any);

const reducer = handleActions(
  {
    [STORE]: function(state, { payload }) {
      return INITIAL_STATE.concat(payload);
    }
  },
  INITIAL_STATE
);

export default reducer;
