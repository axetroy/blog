/* eslint-disable */
const withCss = require('@zeit/next-css')
const { execSync } = require('child_process')

const LATEST_BUILD_DATE = 'REACT_APP_LATEST_BUILD_DATE'
const LAST_COMMIT_HASH = 'REACT_APP_LAST_COMMIT_HASH'
const LAST_COMMIT_TREE_HASH = 'REACT_APP_LAST_COMMIT_TREE_HASH'
const LAST_COMMIT_AUTHOR = 'REACT_APP_LAST_COMMIT_AUTHOR'
const LAST_COMMIT_MESSAGE = 'REACT_APP_LAST_COMMIT_MESSAGE'
const LAST_COMMIT_DATE = 'REACT_APP_LAST_COMMIT_DATE'

const { hash, treeHash, author, message, date } = getCommitInfo()

function getCommitInfo() {
  const buff = execSync('git log -n 1 --pretty=format:"%H%n%h%n%s%n%an%n%cD"')
  const output = buff.toString()

  const arr = output.split('\n')

  const hash = arr[0]
  const treeHash = arr[1]
  const message = arr[2]
  const author = arr[3]
  const date = arr[4]

  return {
    hash,
    treeHash,
    author,
    date,
    message,
  }
}

module.exports = withCss({
  env: {
    [LATEST_BUILD_DATE]: new Date().toString(),
    [LAST_COMMIT_HASH]: hash,
    [LAST_COMMIT_TREE_HASH]: treeHash,
    [LAST_COMMIT_AUTHOR]: author,
    [LAST_COMMIT_MESSAGE]: message,
    [LAST_COMMIT_DATE]: date,
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      {
        const antStyles = /antd\/.*?\/style\/css.*?/
        const origExternals = [...config.externals]
        config.externals = [
          (context, request, callback) => {
            if (request.match(antStyles)) return callback()
            if (typeof origExternals[0] === 'function') {
              origExternals[0](context, request, callback)
            } else {
              callback()
            }
          },
          ...(typeof origExternals[0] === 'function' ? [] : origExternals),
        ]

        config.module.rules.unshift({
          test: antStyles,
          use: 'null-loader',
        })
      }
    }
    return config
  },
})
