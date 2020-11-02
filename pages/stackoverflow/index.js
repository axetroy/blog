import { CalendarOutlined, MessageOutlined } from '@ant-design/icons'
import { Card, Col, Pagination, Row, Tag } from 'antd'
import { format } from 'date-fns'
import Link from 'next/link'
import DocumentTitle from '../../component/document-title'
import CONFIG from '../../config.json'
import github from '../../lib/github'

async function getPosts(page, per_page) {
  let meta = { page, per_page }
  const { data: posts, headers } = await github.issues.listForRepo({
    owner: CONFIG.owner,
    repo: 'stackoverflow',
    creator: CONFIG.owner,
    state: 'open',
    per_page,
    page,
    request: {
      // signal: controller.signal
    },
  })

  const link = headers.link

  /**
   * Pagination
   * # see detail https://developer.github.com/guides/traversing-with-pagination/
   */
  if (link) {
    const last = link.match(/<([^>]+)>(?=;\s+rel="last")/)
    const lastPage = last ? last[1].match(/\bpage=(\d+)/)[1] : page
    meta = {
      ...meta,
      ...{ page, per_page, total: lastPage * per_page },
    }
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

export default function Stackoverflow(props) {
  const { posts, meta } = props

  return (
    <DocumentTitle title={['踩过的坑']}>
      <div>
        <Row gutter={24} className="stackoverflow-list">
          {posts.map((post, i) => {
            return (
              <Col
                key={post.number + '/' + i}
                xs={{ span: 22, offset: 1 }}
                sm={{ span: 12, offset: 0 }}
                md={{ span: 8, offset: 0 }}
                lg={{ span: 8, offset: 0 }}
                xl={{ span: 8, offset: 0 }}
                xxl={{ span: 6, offset: 0 }}
              >
                <Link prefetch={false} href={`/stackoverflow/${post.number}`}>
                  {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                  <a>
                    <Card
                      style={{
                        marginBottom: '2rem',
                        minHeight: '200px',
                        height: '300px',
                        overflow: 'hidden',
                        cursor: 'pointer',
                      }}
                    >
                      <div>
                        <h3
                          className="post-title"
                          style={{
                            wordBreak: 'break-word',
                            whiteSpace: 'nowrap',
                            textOverflow: 'ellipsis',
                            overflow: 'hidden',
                          }}
                          title={post.title}
                        >
                          {post.title}
                        </h3>
                      </div>
                      <div>
                        <span>
                          <CalendarOutlined />{' '}
                          {format(new Date(post.created_at), 'yyyy-MM-dd')}
                          &nbsp;
                        </span>
                        <span>
                          <MessageOutlined /> {post.comments}{' '}
                        </span>

                        <span className="label-list">
                          {(post.labels || []).map((label) => {
                            return (
                              <Tag key={label.id} color={'#' + label.color}>
                                {label.name}
                              </Tag>
                            )
                          })}
                        </span>
                      </div>
                      <div
                        style={{
                          color: '#9E9E9E',
                          wordBreak: 'break-word',
                          textOverflow: 'ellipsis',
                          overflow: 'hidden',
                          clear: 'both',
                          height: '150px',
                        }}
                      >
                        {post.body.slice(0, 150)}...
                      </div>
                    </Card>
                  </a>
                </Link>
              </Col>
            )
          })}
        </Row>

        {meta.total > 0 ? (
          <Row className="text-center" style={{ marginBottom: '2rem' }}>
            <Col span={24} style={{ transition: 'all 1s' }}>
              <Pagination
                // onChange={page => changePage(page, meta.per_page)}
                defaultCurrent={meta.page}
                defaultPageSize={meta.per_page}
                total={meta.total}
              />
            </Col>
          </Row>
        ) : (
          ''
        )}
      </div>
      <style jsx>{`
        .stackoverflow-list .label-list {
          float: right;
          margin-bottom: 10px;
        }

        .stackoverflow-list .label-list::after {
          content: '';
          width: 0;
          height: 0;
          position: absolute;
          clear: both;
        }
      `}</style>
    </DocumentTitle>
  )
}

export async function getServerSideProps(context) {
  const [posts, meta] = await getPosts(1, 20)

  return {
    props: {
      posts,
      meta,
    },
  }
}
