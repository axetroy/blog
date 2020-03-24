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
          <meta http-equiv="Cache-Control" content="no-transform" />
          <meta http-equiv="Cache-Control" content="no-siteapp" />
          <meta
            name="viewport"
            content="initial-scale=1.0, width=device-width"
          />
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
