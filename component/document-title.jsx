import Head from 'next/head'
import { useEffect } from 'react'

export default function DocumentTitle(props) {
  const { title, children } = props

  useEffect(() => {
    document.title = (title || []).concat(["Axetroy's NeverLand"]).join(' | ')
  }, [title])

  const titleStr = (title || []).concat(["Axetroy's NeverLand"]).join(' | ')

  return (
    <>
      <Head>
        <title>{titleStr}</title>
      </Head>
      {children}
    </>
  )
}
