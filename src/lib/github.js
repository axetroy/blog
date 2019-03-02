/**
 * Created by axetroy on 2017/4/7.
 */

import CONFIG from "../config.json";
import Octokit from  "@octokit/rest"
export const github = new Octokit({
  params: {
    client_id: CONFIG.github_client_id,
    client_secret: CONFIG.github_client_secret
  },
  withCredentials: false,
  responseType: "json"
});

export default github;
