/**
 * 存储roll相关数据
 */
import { createAction, handleActions } from 'redux-actions';

export const ADD = 'ADD';
export const SET = 'SET';
export const REMOVE = 'REMOVE';
export const CLEAN = 'CLEAN';
export const INITIAL_STATE = [];

export const add = createAction(ADD, any => any);
export const set = createAction(SET, any => any);
export const remove = createAction(REMOVE, any => any);
export const clean = createAction(CLEAN, any => any);

const reducer = handleActions(
  {
    [SET]: function(state, { payload }) {
      return INITIAL_STATE.concat(payload);
    },
    [ADD]: function(state, { payload }) {
      return INITIAL_STATE.concat(state).concat([payload]);
    },
    [REMOVE]: function(state, { payload }) {
      const result = [].concat(state);
      const index = result.findIndex(v => v.name === payload);
      if (index >= 0) {
        result.splice(result.findIndex(v => v.name === payload), 1);
      }
      return result;
    },
    [CLEAN]: function(state, { payload }) {
      return INITIAL_STATE;
    },
  },
  INITIAL_STATE
);

export default reducer;
