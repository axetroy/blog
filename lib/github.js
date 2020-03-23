import { Octokit } from '@octokit/rest'
import { throttling } from '@octokit/plugin-throttling'

const Github = Octokit.plugin([throttling])

export const github = new Github({
  withCredentials: false,
  responseType: 'json',
  auth: 'ca5b4a5564bf47aa9f629087f922929e84185dea',
  userAgent:
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/82.0.4083.0 Safari/537.36',
  throttle: {
    onRateLimit: (retryAfter, options) => {
      github.log.warn(
        `Request quota exhausted for request ${options.method} ${options.url}`
      )

      if (options.request.retryCount === 0) {
        // only retries once
        console.log(`Retrying after ${retryAfter} seconds!`)
        return true
      }
    },
    onAbuseLimit: (retryAfter, options) => {
      // does not retry, only logs a warning
      github.log.warn(
        `Abuse detected for request ${options.method} ${options.url}`
      )
    }
  }
})

export default github
