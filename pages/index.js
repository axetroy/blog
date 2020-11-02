import { ClockCircleOutlined, MessageOutlined } from '@ant-design/icons'
import { Card, Col, Pagination, Row, Tag } from 'antd'
import { format } from 'date-fns'
import Link from 'next/link'
import Router from 'next/router'
import DocumentTitle from '../component/document-title'
import CONFIG from '../config.json'
import github from '../lib/github'

async function getPosts(page, per_page) {
  const { data: posts, headers } = await github.issues.listForRepo({
    owner: CONFIG.owner,
    repo: CONFIG.repo,
    creator: CONFIG.owner,
    state: 'open',
    per_page,
    page,
    request: {
      // signal: controller.signal
    },
  })

  const link = headers.link
  let meta = { page, per_page, total: 0 }

  /**
   * Pagination
   * # see detail https://developer.github.com/guides/traversing-with-pagination/
   */
  if (link) {
    const last = link.match(/<([^>]+)>(?=;\s+rel="last")/)
    const lastPage = last ? last[1].match(/\bpage=(\d+)/)[1] : page
    meta = { page, per_page, total: lastPage * per_page }
  }

  posts.forEach((post) => {
    // 获取第一张图片作为缩略图
    let match = /!\[[^\]]+\]\(([^)]+)\)/im.exec(post.body)
    if (match && match[1]) {
      post.thumbnails = match[1]
    }
  })

  return [posts, meta]
}

export default function Posts(props) {
  const { POSTS, meta } = props

  function changePage(page, per_page) {
    Router.push(`/?page=${page}`)
  }

  return (
    <DocumentTitle title={['博客文章']}>
      <div style={{ backgroundColor: '#eaebec' }}>
        <Row gutter={24} className="post-row">
          {POSTS.map((post, i) => {
            return (
              <Col key={post.number + '/' + i} xs={24}>
                <section>
                  <Card
                    style={{
                      overflow: 'hidden',
                    }}
                    className="post-list"
                  >
                    <div>
                      <Link prefetch={false} href={`/post/${post.number}`}>
                        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                        <a>
                          <h3
                            className="post-title"
                            style={{
                              wordBreak: 'break-word',
                              whiteSpace: 'nowrap',
                              textOverflow: 'ellipsis',
                              overflow: 'hidden',
                              display: 'inline-block',
                              maxWidth: '100%',
                            }}
                          >
                            {post.title}
                          </h3>
                        </a>
                      </Link>
                    </div>
                    <div>
                      <span>
                        <ClockCircleOutlined />{' '}
                        {format(new Date(post.created_at), 'yyyy-MM-dd')}
                        &nbsp;
                      </span>
                      <span>
                        <MessageOutlined /> {post.comments}{' '}
                      </span>

                      <span className="label-list">
                        {(post.labels || []).map((label) => {
                          return (
                            <a
                              key={label.id}
                              href={
                                'https://github.com/axetroy/blog/labels/' +
                                label.name
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Tag color={'#' + label.color}>{label.name}</Tag>
                            </a>
                          )
                        })}
                      </span>
                    </div>
                  </Card>
                </section>
              </Col>
            )
          })}
        </Row>

        {meta.total > 0 ? (
          <Row className="text-center" style={{ paddingBottom: '2rem' }}>
            <Col span={24} style={{ transition: 'all 1s' }}>
              <Pagination
                onChange={(page) => changePage(page, meta.per_page)}
                defaultCurrent={meta.page}
                defaultPageSize={meta.per_page}
                total={meta.total}
              />
            </Col>
          </Row>
        ) : (
          ''
        )}

        <style global jsx>{`
          .post-row {
            margin-bottom: 20px;
          }

          .post-row .ant-card-body {
            padding: 12px;
          }

          .post-row .ant-card-bordered {
            border-top: 0;
            border-left: 0;
            border-right: 0;
            border-bottom: 1px solid #e8e8e8;
          }

          .post-row .ant-tag {
            cursor: pointer;
          }

          .post-list:hover {
            background-color: #fafafa;
          }
        `}</style>
      </div>
    </DocumentTitle>
  )
}

Posts.getInitialProps = async (ctx) => {
  const [posts, meta] = await getPosts(
    ctx.query.page || 0,
    ctx.query.per_page || 25
  )

  return {
    POSTS: posts,
    meta: meta,
  }
}
