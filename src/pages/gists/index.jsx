import { Menu } from 'antd'
import React, { useEffect } from 'react'
import Octicon from 'react-octicon'
import { NavLink } from 'react-router-dom'
import { connect } from 'redux-zero/react'
import DocumentTitle from '../../component/document-title'
import CONFIG from '../../config.json'
import github from '../../lib/github'
import actions from '../../redux/actions'

function Gists(props) {
  const { GISTS, updateGistList } = props

  const controller = new AbortController()

  async function getAllGistList(page, per_page, gists = []) {
    try {
      const { data } = await github.gists.listPublicForUser({
        username: CONFIG.owner,
        page,
        per_page,
        request: {
          signal: controller.signal
        }
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
    updateGistList(gists)
  }

  useEffect(() => {
    getAllGistList()

    return () => {
      controller.abort()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
          {GISTS.map(gist => {
            return (
              <Menu.Item
                key={gist.id}
                style={{
                  borderBottom: '1px solid #e6e6e6'
                }}
              >
                <NavLink
                  exact={true}
                  to={`/gist/${gist.id}`}
                  style={{
                    whiteSpace: 'nowrap',
                    wordBreak: 'break-all',
                    textOverflow: 'ellipsis',
                    overflow: 'hidden'
                  }}
                >
                  <Octicon
                    style={{ fontSize: '1.6rem', marginRight: '0.5rem' }}
                    name="gist"
                    mega
                  />
                  {gist.description}
                </NavLink>
              </Menu.Item>
            )
          })}
        </Menu>
      </div>
    </DocumentTitle>
  )
}

export default connect(state => ({ GISTS: state.GISTS }), actions)(Gists)
