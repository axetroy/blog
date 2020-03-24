import React, { Fragment, useEffect } from 'react'
import Head from 'next/head'

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
