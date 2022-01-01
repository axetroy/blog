import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    return (
      <Html>
        <Head>
          <meta name="keywords" content="axetroy,blog" />
          <meta name="description" content="Axetroy's 的博客" />
          <meta name="renderer" content="webkit" />
          <meta httpEquiv="Cache-Control" content="no-transform" />
          <meta httpEquiv="Cache-Control" content="no-siteapp" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
