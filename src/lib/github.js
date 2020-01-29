import Octokit from '@octokit/rest'
import CONFIG from '../config.json'
export const github = new Octokit({
  withCredentials: false,
  responseType: 'json',
  auth: {
    clientId: CONFIG.github_client_id,
    clientSecret: CONFIG.github_client_secret
  }
})

export default github
