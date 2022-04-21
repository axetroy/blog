import { Col, Row } from 'antd'
// import { formatDistanceToNow } from 'date-fns'
// import chinese from 'date-fns/locale/zh-CN'
import { diffTime } from '../lib/utils'
import Now from './now'

export default function Footer() {
  const created = new Date('2016-11-09 14:22:33')

  // const LATEST_BUILD_DATE = process.env.REACT_APP_LATEST_BUILD_DATE || new Date()
  // const LAST_COMMIT_HASH = process.env.REACT_APP_LAST_COMMIT_HASH
  // const LAST_COMMIT_TREE_HASH = process.env.REACT_APP_LAST_COMMIT_TREE_HASH
  // const LAST_COMMIT_DATE = process.env.REACT_APP_LAST_COMMIT_DATE || new Date()
  // const LAST_COMMIT_AUTHOR = process.env.REACT_APP_LAST_COMMIT_AUTHOR
  // const LAST_COMMIT_MESSAGE = process.env.REACT_APP_LAST_COMMIT_MESSAGE

  return (
    <footer id="footer">
      <Row>
        <Col
          xs={{ span: 11, offset: 1 }}
          sm={{ span: 5, offset: 1 }}
          md={{ span: 4, offset: 4 }}
          lg={{ span: 4, offset: 4 }}
          xl={{ span: 4, offset: 4 }}
          xxl={{ span: 4, offset: 4 }}
        >
          <p className="footer-item-name">相关链接</p>
          <ul>
            <li>
              <a
                href="https://github.com/axetroy"
                target="_blank"
                rel="noopener noreferrer nofollow"
              >
                Github
              </a>
            </li>
            <li>
              <a
                href="https://github.com/axetroy/blog"
                target="_blank"
                rel="noopener noreferrer nofollow"
              >
                网站源码
              </a>
            </li>
            <li>
              <a
                href="https://github.com/axetroy?utf8=%E2%9C%93&tab=repositories&q=vscode&type=source&language="
                target="_blank"
                rel="noopener noreferrer nofollow"
              >
                我的 vscode 扩展
              </a>
            </li>
          </ul>
        </Col>
        <Col
          xs={{ span: 11 }}
          sm={{ span: 5 }}
          md={{ span: 4 }}
          lg={{ span: 4 }}
          xl={{ span: 4 }}
          xxl={{ span: 4 }}
        >
          <p className="footer-item-name">免费的API服务</p>
          <ul>
            <li>
              <a
                href="https://github.com/axetroy/ip"
                target="_blank"
                rel="noopener noreferrer nofollow"
              >
                获取当前IP
              </a>
            </li>
            <li>
              <a
                href="https://github.com/axetroy/locate"
                target="_blank"
                rel="noopener noreferrer nofollow"
              >
                根据IP获取定位信息
              </a>
            </li>
            <li>
              <a
                href="https://github.com/axetroy/proxy"
                target="_blank"
                rel="noopener noreferrer nofollow"
              >
                HTTP请求代理
              </a>
            </li>
            <li>
              <a
                href="https://github.com/axetroy/email"
                target="_blank"
                rel="noopener noreferrer nofollow"
              >
                发送邮件
              </a>
            </li>
          </ul>
        </Col>
        <Col
          xs={{ span: 11, offset: 1 }}
          sm={{ span: 5 }}
          md={{ span: 4 }}
          lg={{ span: 4 }}
          xl={{ span: 4 }}
          xxl={{ span: 4 }}
        >
          <p className="footer-item-name">友情链接</p>
          <ul>
            <li>
              {/* eslint-disable-next-line */}
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                target="_blank"
                rel="noopener noreferrer nofollow"
              >
                留言加个友链可好?
              </a>
            </li>
          </ul>
        </Col>
        <Col
          xs={{ span: 11 }}
          sm={{ span: 5 }}
          md={{ span: 4 }}
          lg={{ span: 4 }}
          xl={{ span: 4 }}
          xxl={{ span: 4 }}
        >
          <p className="footer-item-name">关于本站</p>
          <ul>
            <li>Copyright © {new Date().getFullYear()}</li>
            <li>
              <Now>
                {(now) => {
                  const diff = diffTime(created)(now)
                  return (
                    <div>
                      <p>{`已运行${diff.days}天`}</p>
                    </div>
                  )
                }}
              </Now>
            </li>
            <li>
              Created by{' '}
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://github.com/axetroy"
              >
                Axetroy
              </a>
            </li>
            <li>
              <a
                href="https://analytics.google.com/analytics/web/?hl=zh-CN&pli=1#report/defaultid/a98287100w144548599p149233935/"
                target="_blank"
                rel="noopener noreferrer"
              >
                站长统计
              </a>
            </li>
          </ul>
        </Col>
      </Row>

      {/* <div className="text-center">
        最近由 {LAST_COMMIT_AUTHOR} 于{' '}
        {formatDistanceToNow(new Date(LAST_COMMIT_DATE), {
          locale: chinese
        })}{' '}
        前更改代码(
        <a href={'https://github.com/axetroy/blog/commit/' + LAST_COMMIT_HASH}>
          {LAST_COMMIT_MESSAGE}
        </a>
        ). 于{' '}
        {formatDistanceToNow(new Date(LATEST_BUILD_DATE), {
          locale: chinese
        })}{' '}
        前更新网站. 当前网站源码{' '}
        <a
          href={'https://github.com/axetroy/blog/tree/' + LAST_COMMIT_TREE_HASH}
        >
          {LAST_COMMIT_TREE_HASH}
        </a>
      </div> */}
      <style jsx>
        {`
          #footer {
            padding: 1rem;
            background-color: #fff;
          }

          #footer p {
            margin-bottom: 0;
          }

          #footer .footer-item-name {
            font-size: 1.5rem;
            font-weight: 800;
          }

          #footer ul {
            line-height: 26px;
          }
        `}
      </style>
    </footer>
  )
}
