/**
 * Created by axetroy on 2017/4/7.
 */

import Octokit from "@octokit/rest";
import CONFIG from "../config.json";
export const github = new Octokit({
  withCredentials: false,
  responseType: "json"
});

github.authenticate({
  type: "oauth",
  key: CONFIG.github_client_id,
  secret: CONFIG.github_client_secret
});

export default github;
