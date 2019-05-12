const actions = store => ({
  updateOwner: (state, payload) => () => {
    return { OWNER: payload };
  },
  updateShowCases: (state, payload) => () => {
    return { SHOW_CASES: payload };
  },
  updateTodo: (state, todoId, payload) => () => {
    return { TODO: { ...state.TODO, ...{ [todoId]: payload } } };
  },
  updateTodoList: (state, payload) => () => {
    return { TODOS: payload };
  },
  updateTodoLabel: (state, payload) => () => {
    return { TODO_LABELS: payload };
  },
  updateRepositories: (state, payload) => () => {
    return { REPOS: payload };
  },
  updateArticles: (state, payload) => () => {
    return { POSTS: payload };
  },
  updateArticle: (state, postId, payload) => () => {
    return { POST: { ...state.POST, ...{ [postId]: payload } } };
  },
  updateStackoverflows: (state, payload) => () => {
    return { STACKOVERFLOWS: payload };
  },
  updateStackoverflow: (state, postId, payload) => () => {
    return {
      STACKOVERFLOW: { ...state.STACKOVERFLOW, ...{ [postId]: payload } }
    };
  },
  updateGistList: (state, payload) => () => {
    return { GISTS: payload };
  },
  updateGist: (state, gistId, payload) => () => {
    return { GIST: { ...state.GIST, ...{ [gistId]: payload } } };
  },
  updateFollowers: (state, payload) => () => {
    return { FOLLOWERS: payload };
  }
});

export default actions;
