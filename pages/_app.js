import Head from 'next/head'
import { Layout } from '../layout/default'
import '../styles/global.css'

function MyApp({ Component, pageProps }) {
  return <>
    <Head>
      <meta
        name="viewport"
        content="initial-scale=1.0, width=device-width"
      />
    </Head>
    <Layout>
      <Component {...pageProps} />
    </Layout>
  </>
}

// Only uncomment this method if you have blocking data requirements for
// every single page in your application. This disables the ability to
// perform automatic static optimization, causing every page in your app to
// be server-side rendered.
//
// MyApp.getInitialProps = async (appContext) => {
//   // calls page's `getInitialProps` and fills `appProps.pageProps`
//   const appProps = await App.getInitialProps(appContext);
//
//   return { ...appProps }
// }

export default MyApp
