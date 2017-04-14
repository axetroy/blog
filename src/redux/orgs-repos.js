/**
 * 存储组织下对于的仓库列表
 */
import { createAction, handleActions } from 'redux-actions';

export const SET = 'SET_ORG_REPOS';
export const INITIAL_STATE = {};

export const set = createAction(SET, any => any);

const reducer = handleActions(
  {
    [SET]: function(state, { payload }) {
      const { name, repos } = payload;
      return {
        ...INITIAL_STATE,
        ...state,
        ...{
          [name]: repos
        }
      };
    }
  },
  INITIAL_STATE
);

export default reducer;
