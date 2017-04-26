import { createAction, handleActions } from 'redux-actions';

export const STORE_CODE = 'STORE_GITHUB_OAUTH_CODE';
export const STORE_ACCESS_TOKEN = 'STORE_GITHUB_OAUTH_CODE';
export const CLEAN_OAUTH_INFO = 'CLEAN_OAUTH_INFO';
export const INITIAL_STATE = {};

export const setCode = createAction(STORE_CODE, any => any);
export const setAccessToken = createAction(STORE_ACCESS_TOKEN, any => any);
export const clean = createAction(CLEAN_OAUTH_INFO, any => any);

const reducer = handleActions(
  {
    [STORE_CODE]: function(state, { payload }) {
      return { ...INITIAL_STATE, ...{ code: payload } };
    },
    [STORE_ACCESS_TOKEN]: function(state, { payload }) {
      return { ...INITIAL_STATE, ...state, ...{ access_token: payload } };
    },
    [CLEAN_OAUTH_INFO]: function(state, { payload }) {
      return INITIAL_STATE;
    }
  },
  INITIAL_STATE
);

export default reducer;
