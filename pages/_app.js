import Layout from '../src/layout/Layout'
import '../src/index.css'

export default function App({ Component, pageProps }) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  )
}