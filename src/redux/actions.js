const actions = store => ({
  updateOwner: (state, payload) => () => {
    return { OWNER: payload };
  },
  setReadMe: (state, payload) => () => {
    return { README: payload };
  },
  updateAboutMe: (state, payload) => () => {
    return { ABOUTME: payload };
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
  updateAllRepositories: (state, payload) => () => {
    return { ALL_REPOS: payload };
  },
  updateArticles: (state, payload) => () => {
    return { POSTS: payload };
  },
  updateArticle: (state, postId, payload) => () => {
    return { POST: { ...state.POST, ...{ [postId]: payload } } };
  },
  updateGistList: (state, payload) => () => {
    return { GISTS: payload };
  },
  updateGist: (state, gistId, payload) => () => {
    return { GIST: { ...state.GIST, ...{ [gistId]: payload } } };
  },
  updateOrganizations: (state, payload) => () => {
    return { ORGS: payload };
  },
  updateOrganizationRepo: (state, organizationId, payload) => () => {
    return {
      ORG_REPOS: { ...state.ORG_REPOS, ...{ [organizationId]: payload } },
    };
  },
  updateRepoState: (state, repoName, payload) => () => {
    return { REPO_STAT: { ...state.REPO_STAT, ...{ [repoName]: payload } } };
  },
  updateAllRepoLanguages: (state, payload) => () => {
    return { ALL_REPO_LANGUAGES: payload };
  },
  updateRepoLanguages: (state, repoName, language) => () => {
    const lang = state.ALL_REPO_LANGUAGES[repoName] || { language: 0 };
    return {
      REPO_LANGUAGES: {
        ...state.REPO_LANGUAGES,
        ...{ [repoName]: lang },
      },
    };
  },
  updateFollowings: (state, payload) => () => {
    return { FOLLOWINGS: payload };
  },
  updateFollowers: (state, payload) => () => {
    return { FOLLOWERS: payload };
  },
});

export default actions;
