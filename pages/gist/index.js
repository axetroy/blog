import { Menu } from 'antd'
// import Octicon from 'react-octicon'
import Link from 'next/link'
import DocumentTitle from '../../component/document-title'
import CONFIG from '../../config.json'
import github from '../../lib/github'


async function getAllGistList(page, per_page, gists = []) {
  try {
    const { data } = await github.gists.listForUser({
      username: CONFIG.owner,
      page,
      per_page,
      request: {
        // signal: controller.signal
      },
    })

    if (!data) {
      return []
    }

    gists = gists.concat(data)
    // 如果往后还有下一页，则继续请求，直到完为止
    if (data.length > 0 && data.length >= per_page) {
      gists = await getAllGistList(page + 1, per_page, gists)
    }
  } catch (err) {
    console.error(err)
  }
  return gists
}

export default function Gists(props) {
  const { gists } = props

  return (
    <DocumentTitle title={['代码片段']}>
      <div className="bg-white">
        <div style={{ padding: '2.4rem' }}>
          <h2 style={{ textAlign: 'center' }}>代码片段</h2>
        </div>
        <Menu
          mode="inline"
          style={{ overflowY: 'auto', overflowX: 'hidden', borderRight: 0 }}
        >
          {gists.map((gist) => {
            return (
              <Menu.Item
                key={gist.id}
                style={{
                  borderBottom: '1px solid #e6e6e6',
                }}
              >
                <Link prefetch={false} href={`/gist/${gist.id}`}>
                  {/* <Octicon
                    style={{ fontSize: '1.6rem', marginRight: '0.5rem' }}
                    name="gist"
                    mega
                  /> */}
                  {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                  <a
                    style={{
                      whiteSpace: 'nowrap',
                      wordBreak: 'break-all',
                      textOverflow: 'ellipsis',
                      overflow: 'hidden',
                    }}
                  >
                    {gist.description}
                  </a>
                </Link>
              </Menu.Item>
            )
          })}
        </Menu>
      </div>
    </DocumentTitle>
  )
}

export async function getServerSideProps(context) {
  const gists = await getAllGistList(1, 20)

  return {
    props: {
      gists,
    },
  }
}
