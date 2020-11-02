import Head from 'next/head'
import { Fragment, useEffect } from 'react'

export default function DocumentTitle(props) {
  const { title, children } = props

  useEffect(() => {
    document.title = (title || []).concat(["Axetroy's NeverLand"]).join(' | ')
  }, [title])

  const titleStr = (title || []).concat(["Axetroy's NeverLand"]).join(' | ')

  return (
    <Fragment>
      <Head>
        <title>{titleStr}</title>
      </Head>
      {children}
    </Fragment>
  )
}
