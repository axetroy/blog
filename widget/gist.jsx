import { Button } from 'antd'
// import Octicon from 'react-octicon'
import Link from 'next/link'
import { memo, useEffect, useState } from 'react'
import CONFIG from '../config.json'
import github from '../lib/github'
import styles from './gist.module.css'


function GistWidget() {
  const [meta, setMeta] = useState({ page: 1, per_page: 10, total: 0 })
  const [gistList, setGistList] = useState([])
  const [hashNextpage, setHashNextpage] = useState(false)
  const [loading, setLoading] = useState(false)

  // const controller = new AbortController()

  useEffect(() => {
    const { page, per_page } = meta
    getGistList(page, per_page)
      .then((list) => {
        setGistList(list)
        setHashNextpage(list.length > 0 && list.length >= per_page)
      })
      .catch(() => {})

    return function () {
      // controller.abort()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function getGistList(page, per_page) {
    setLoading(true)
    const { data: gists } = await github.gists.listPublicForUser({
      username: CONFIG.owner,
      page,
      per_page,
      request: {
        // signal: controller.signal
      },
    })
    setLoading(false)
    setHashNextpage(gists.length > 0 && gists.length >= per_page)
    return gists
  }

  async function getNextGistList() {
    const { page, per_page } = meta
    const nextPage = page + 1
    const nextGistList = await getGistList(nextPage, per_page)
    if (nextGistList.length) {
      const hash = {}
      const newGistList = gistList.concat(nextGistList).filter((v) => {
        if (!hash[v.id]) {
          hash[v.id] = true
          return true
        } else {
          return false
        }
      })

      setGistList(newGistList)
      setMeta({
        ...meta,
        page: nextPage,
      })
    }
  }

  return (
    <div className="widget widget-gist">
      <div className="widget-header">
        <h3>
          <Link href="/gist">
            {/* <Octicon name="gist" mega /> */}
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <a>
              <span className="middle">Gist</span>
            </a>
          </Link>
        </h3>
      </div>
      <ul>
        {gistList.map((gist) => {
          return (
            <li key={gist.id} className={styles.gistItem}>
              <Link
                prefetch={false}
                href={`/gist/${gist.id}`}
                // style={{
                //   whiteSpace: 'nowrap',
                //   wordBreak: 'break-all',
                //   textOverflow: 'ellipsis',
                //   overflow: 'hidden'
                // }}
              >
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <a>{gist.description}</a>
              </Link>
            </li>
          )
        })}
        {hashNextpage ? (
          <li className="more">
            <Button
              type="default"
              loading={loading}
              onClick={() => getNextGistList()}
            >
              {loading ? 'Loading' : 'More'}
            </Button>
          </li>
        ) : (
          ''
        )}
      </ul>
      <style></style>
    </div>
  )
}

const Gist = memo(GistWidget)

export { Gist }
