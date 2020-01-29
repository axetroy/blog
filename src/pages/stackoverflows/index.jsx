import { Card, Col, Icon, Pagination, Row, Tag } from 'antd'
import { format } from 'date-fns'
import queryString from 'query-string'
import React, { useState, useEffect } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { connect } from 'redux-zero/react'
import DocumentTitle from '../../component/document-title'
import CONFIG from '../../config.json'
import github from '../../lib/github'
import actions from '../../redux/actions'
import './index.css'

function Stackoverflow(props) {
  const { STACKOVERFLOWS, updateStackoverflows } = props
  const history = useHistory()
  const location = useLocation()
  const [meta, setMeta] = useState({ page: 1, per_page: 25, total: 0 })

  const query = queryString.parse(location.search)
  meta.page = +query.page || meta.page
  meta.per_page = +query.per_page || meta.per_page

  const controller = new AbortController()

  function changePage(page, per_page) {
    const oldQuery = queryString.parse(location.search)
    history.push({
      search: queryString.stringify(Object.assign(oldQuery, { page, per_page }))
    })
    getPosts(page, per_page)
  }

  async function getPosts(page, per_page) {
    const { data: posts, headers } = await github.issues.listForRepo({
      owner: CONFIG.owner,
      repo: 'stackoverflow',
      creator: CONFIG.owner,
      state: 'open',
      per_page,
      page,
      request: {
        signal: controller.signal
      }
    })

    const link = headers.link

    /**
     * Pagination
     * # see detail https://developer.github.com/guides/traversing-with-pagination/
     */
    if (link) {
      const last = link.match(/<([^>]+)>(?=;\s+rel="last")/)
      const lastPage = last ? last[1].match(/\bpage=(\d+)/)[1] : page
      setMeta({
        ...meta,
        ...{ page, per_page, total: lastPage * per_page }
      })
    }

    posts.forEach(post => {
      // 获取第一张图片作为缩略图
      let match = /!\[[^\]]+\]\(([^)]+)\)/im.exec(post.body)
      if (match && match[1]) {
        post.thumbnails = match[1]
      }
    })

    updateStackoverflows(posts)
  }

  useEffect(() => {
    getPosts(meta.page, meta.per_page).catch(() => {})
    return function() {
      controller.abort()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <DocumentTitle title={['踩过的坑']}>
      <div>
        <Row gutter={24} className="stackoverflow-list">
          {STACKOVERFLOWS.map((post, i) => {
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
                <Card
                  style={{
                    marginBottom: '2rem',
                    minHeight: '200px',
                    height: '300px',
                    overflow: 'hidden',
                    cursor: 'pointer'
                  }}
                  onClick={() => {
                    history.push({
                      pathname: `/stackoverflow/${post.number}`
                    })
                  }}
                >
                  <div>
                    <h3
                      className="post-title"
                      style={{
                        wordBreak: 'break-word',
                        whiteSpace: 'nowrap',
                        textOverflow: 'ellipsis',
                        overflow: 'hidden'
                      }}
                      title={post.title}
                    >
                      {post.title}
                    </h3>
                  </div>
                  <div>
                    <span>
                      <Icon type="clock-circle-o" />{' '}
                      {format(new Date(post.created_at), 'yyyy-MM-dd')}&nbsp;
                    </span>
                    <span>
                      <Icon type="message" /> {post.comments}{' '}
                    </span>

                    <span className="label-list">
                      {(post.labels || []).map(label => {
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
                      height: '150px'
                    }}
                  >
                    {post.body.slice(0, 150)}...
                  </div>
                </Card>
              </Col>
            )
          })}
        </Row>

        {meta.total > 0 ? (
          <Row className="text-center" style={{ marginBottom: '2rem' }}>
            <Col span={24} style={{ transition: 'all 1s' }}>
              <Pagination
                onChange={page => changePage(page, meta.per_page)}
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
    </DocumentTitle>
  )
}

export default connect(
  state => ({
    STACKOVERFLOWS: state.STACKOVERFLOWS
  }),
  actions
)(Stackoverflow)
