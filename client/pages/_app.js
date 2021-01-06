import '../styles/globals.css' // This is the only place in the app where I can import global CSS

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />
}