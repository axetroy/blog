import React, { useState, useEffect } from 'react'
import { formatDistanceToNow } from 'date-fns'
import chinese from 'date-fns/locale/zh-CN'
import github from '../lib/github'
import './comment.css'

async function getIssuesComments(owner, repo, number) {
  const { data: comments } = await github.issues.listComments({
    owner,
    repo,
    issue_number: number,
    headers: {
      Accept: 'application/vnd.github.v3.html'
    }
  })

  return comments
}

async function getGistComments(gist_id) {
  const { data: comments } = await github.gists.listComments({
    gist_id,
    headers: {
      Accept: 'application/vnd.github.v3.html'
    }
  })
  return comments
}

export default function Comments(props) {
  const { type, owner, repo, number, gistId } = props
  const [comments, setComments] = useState([])

  useEffect(() => {
    switch (type) {
      case 'issues':
        if (typeof number === 'number') {
          getIssuesComments(owner, repo, number).then(data => {
            setComments(data)
          })
        }
        break
      case 'gist':
        if (typeof gistId === 'string') {
          getGistComments(gistId).then(data => {
            setComments(data)
          })
        }
        break
      default:
    }
  }, [number, owner, repo, type, gistId])

  return (
    <div>
      <h3>
        大牛们的评论:
        {/* eslint-disable-next-line */}
        <a
          rel="noopener noreferrer"
          target="_blank"
          href={
            type === 'issues'
              ? `https://github.com/${owner}/${repo}/issues/${number}#new_comment_field`
              : type === 'gist'
              ? `https://gist.github.com/${gistId}#new_comment_field`
              : // eslint-disable-next-line
                'javascript:void 0'
          }
          style={{
            float: 'right'
          }}
        >
          朕有话说
        </a>
      </h3>

      {comments.length ? (
        comments.map(comment => {
          return (
            <div
              key={comment.id}
              style={{
                border: '0.1rem solid #e2e2e2',
                borderRadius: '0.5rem',
                margin: '1rem 0'
              }}
            >
              <div
                className="comment-header"
                style={{
                  overflow: 'hidden'
                }}
              >
                <img
                  style={{
                    width: '3.2rem',
                    verticalAlign: 'middle',
                    borderRadius: '50%'
                  }}
                  src={comment.user.avatar_url}
                  alt=""
                />
                &nbsp;&nbsp;
                <strong
                  style={{
                    color: '#586069'
                  }}
                >
                  {/* eslint-disable-next-line */}
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={`https://github.com/${comment.user.login}`}
                  >
                    {comment.user.login}
                  </a>
                </strong>
                &nbsp;&nbsp;
                <span>
                  {' '}
                  {`评论于 ${formatDistanceToNow(new Date(comment.created_at), {
                    locale: chinese
                  })}前`}
                  {comment.created_at !== comment.updated_at
                    ? `&nbsp;&nbsp;更新于 ${formatDistanceToNow(
                        new Date(comment.updated_at),
                        {
                          locale: chinese
                        }
                      )}前`
                    : ''}
                </span>
              </div>
              <div
                className="comment-body"
                style={{
                  padding: '1.2rem'
                }}
              >
                <div
                  className="markdown-body"
                  dangerouslySetInnerHTML={{
                    __html: comment.body_html
                  }}
                />
              </div>
            </div>
          )
        })
      ) : (
        <div>
          <p>还没有人评论哦，赶紧抢沙发!</p>
        </div>
      )}
    </div>
  )
}
