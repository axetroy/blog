import { Octokit } from '@octokit/rest'
import { throttling } from '@octokit/plugin-throttling'

const Github = Octokit.plugin([throttling])

const token = [
  '31c146c2f693cc93472b' + '11c934bae72da7f2de4f',
  '5df2fa371a5a5cc4871b' + '5c0449f51fb0f3ee2911'
]
// const token = process.env.NODE_ENV

export const github = new Github({
  withCredentials: false,
  responseType: 'json',
  ...(token
    ? {
        auth: token[Math.round(Math.random() * token.length)]
      }
    : {}),
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
