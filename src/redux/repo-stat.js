/**
 * 存储一个仓库的统计结果
 */
import { createAction, handleActions } from 'redux-actions';

export const SET = 'SET_REPO_STAT';
export const INITIAL_STATE = {};

export const setStat = createAction(SET, any => any);

const reducer = handleActions(
  {
    [SET]: function(state, { payload }) {
      const { name, stat } = payload;
      return {
        ...INITIAL_STATE,
        ...state,
        ...{
          [name]: stat,
        },
      };
    },
  },
  INITIAL_STATE
);

export default reducer;
