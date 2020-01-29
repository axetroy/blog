import { Icon, message, Spin, Tooltip } from 'antd'
import React, { useEffect } from 'react'
import { useRouteMatch } from 'react-router-dom'
import { connect } from 'redux-zero/react'
import ReactClipboard from '../../component/clipboard'
import Comments from '../../component/comment'
import DocumentTitle from '../../component/document-title'
import Download from '../../component/download'
import github from '../../lib/github'
import prettyBytes from '../../lib/pretty-bytes'
import { enableIframe } from '../../lib/utils'
import actions from '../../redux/actions'

function getValues(obj) {
  let result = []
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      result = result.concat([obj[key]])
    }
  }
  return result
}

function Gist(props) {
  const { updateGist } = props
  const match = useRouteMatch()
  const { id: gist_id } = match.params
  const gist = (props.GIST || {})[gist_id] || {}

  useEffect(() => {
    const controller = new AbortController()
    github.gists
      .get({
        gist_id,
        headers: {
          Accept: 'application/vnd.github.v3.html'
        },
        request: {
          signal: controller.signal
        }
      })
      .then(({ data: gist }) => {
        const renders = Object.keys(gist.files).map(filename => {
          const file = gist.files[filename]
          const language = file.language.toLowerCase()

          const isMarkdown = language === 'markdown'

          const template = `
${isMarkdown ? '' : '```' + language}

${file.content}

${isMarkdown ? '' : '```'}
`

          return github.markdown
            .render({
              text: template,
              mode: 'markdown',
              request: {
                signal: controller.signal
              }
            })
            .then(({ data: html }) => {
              file.html = html
              return gist
            })
        })

        return Promise.all(renders).then(() => Promise.resolve(gist))
      })
      .then(gist => {
        updateGist(gist_id, gist)
      })
      .catch(err => {
        console.error(err)
      })

    return () => {
      controller.abort()
    }
  }, [updateGist, gist_id])

  return (
    <DocumentTitle title={[gist.description, '代码片段']}>
      <Spin spinning={!Object.keys(gist).length}>
        <div className="bg-white" style={{ marginBottom: 20 }}>
          <h2 style={{ textAlign: 'center', padding: '1rem 0' }}>
            {gist.description}
            <Tooltip placement="topLeft" title="编辑此页">
              <a
                href={`https://gist.github.com/${
                  gist.owner ? gist.owner.login : ''
                }/${gist.id}/edit`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Icon type="edit" />
              </a>
            </Tooltip>
          </h2>
          {getValues(gist.files).map(file => {
            return (
              <div key={file.filename}>
                <h3
                  style={{
                    backgroundColor: '#e6e6e6',
                    padding: '0.5rem',
                    marginBottom: 0
                  }}
                >
                  <span>
                    <Icon type="file" />
                    {file.filename}
                  </span>
                  <span
                    style={{
                      margin: '0 0.5rem'
                    }}
                  >
                    <Download
                      file={file.filename}
                      content={file.content}
                      style={{ display: 'inline' }}
                    >
                      {/* eslint-disable-next-line */}
                      <a>
                        <Icon type="download" />
                        下载({prettyBytes(file.size || 0)})
                      </a>
                    </Download>
                  </span>
                  <span>
                    <ReactClipboard
                      style={{ cursor: 'pointer' }}
                      value={file.content}
                      onSuccess={() => message.success('Copy Success!')}
                      onError={() => message.error('Copy Fail!')}
                    >
                      <Icon type="copy" />
                      复制
                    </ReactClipboard>
                  </span>
                </h3>
                <div
                  className="markdown-body"
                  style={{
                    fontSize: '1.6rem',
                    padding: '10px'
                  }}
                  dangerouslySetInnerHTML={{
                    __html: enableIframe(file.html)
                  }}
                />
              </div>
            )
          })}
          <div className="comment-box">
            <Comments type="gist" gistId={gist_id} />
          </div>
        </div>
      </Spin>
    </DocumentTitle>
  )
}

export default connect(
  state => ({
    GIST: state.GIST
  }),
  actions
)(Gist)
