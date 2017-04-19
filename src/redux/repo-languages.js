/**
 * Created by axetroy on 2017/4/19.
 */

import { createAction, handleActions } from 'redux-actions';

export const PUSH = 'STORE_REPO_LANG';
export const INITIAL_STATE = {};

export const push = createAction(PUSH, any => any);

const reducer = handleActions(
  {
    [PUSH]: function(state, { payload }) {
      let { repo, languages } = payload;
      if (!repo || !languages) return state;
      if (state[repo]) {
        const _languages = state[repo];
        languages = { ...languages, ..._languages };
      }
      return { ...INITIAL_STATE, ...state, ...{ [repo]: languages } };
    }
  },
  INITIAL_STATE
);

export default reducer;
