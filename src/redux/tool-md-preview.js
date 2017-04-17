import { createAction, handleActions } from 'redux-actions';

export const STORE_MARKDOWN = 'STORE_MARKDOWN';
export const STORE_HTML = 'STORE_HTML';
export const INITIAL_STATE = { markdown: '', html: '' };

export const setMarkdown = createAction(STORE_MARKDOWN, any => any);
export const setHTML = createAction(STORE_HTML, any => any);

const reducer = handleActions(
  {
    [STORE_MARKDOWN]: function(state, { payload }) {
      return { ...INITIAL_STATE, ...state, ...{ markdown: payload } };
    },
    [STORE_HTML]: function(state, { payload }) {
      return { ...INITIAL_STATE, ...state, ...{ html: payload } };
    }
  },
  INITIAL_STATE
);

export default reducer;
