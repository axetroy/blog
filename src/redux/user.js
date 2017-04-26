import { createAction, handleActions } from 'redux-actions';
export const LOGIN = 'USER_LOGIN';
export const LOGOUT = 'USER_LOGOUT';
export const INITIAL_STATE = {};
export const login = createAction(LOGIN, any => any);
export const logout = createAction(LOGOUT, any => any);
const reducer = handleActions(
  {
    [LOGIN]: function(state, { payload }) {
      return {
        ...INITIAL_STATE,
        ...payload
      };
    },
    [LOGOUT]: function(state, { payload }) {
      return INITIAL_STATE;
    }
  },
  INITIAL_STATE
);
export default reducer;
