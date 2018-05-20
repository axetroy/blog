/**
 * Created by axetroy on 2017/4/7.
 */

import CONFIG from "../config.json";
const octokit = require("@octokit/rest");
const github = octokit({
  timeout: 1000 * 30,
  params: {
    client_id: CONFIG.github_client_id,
    hello: "world",
    client_secret: CONFIG.github_client_secret
  },
  withCredentials: false,
  responseType: "json"
});

export default github;
