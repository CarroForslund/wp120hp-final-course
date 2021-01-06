import Link from 'next/link';
import Head from 'next/head';
import Layout from '../../components/layout';
import TranslationsContainer from '../../components/translations-container.js';
import Row from '../../components/row';
import Span from '../../components/span';
import styles from '../../styles/Translations.module.css';

export default function Translations({ translationsData }) {

  return (
    <Layout>

      <Head>
        <title>All Translations</title>
      </Head>

      <h1>All Translations</h1>

      <TranslationsContainer >

        <Row className={styles.row}>
          <Span className={styles.col}><strong>Swedish Word</strong></Span>
          <Span className={styles.col}><strong>Description</strong></Span>
          <Span className={styles.col}><strong>Action</strong></Span>
        </Row>

        {translationsData.map((translation) => (

          <Row key={translation.EQString.id} className={styles.row}>
            <Span className={styles.col}>{translation.EQString.word}</Span>
            <Span className={styles.col}>{translation.EQString.description}</Span>
            <Span className={styles.col}><Link href={'/translations/'+translation.EQString.id.toString()}><a>View Translation</a></Link></Span>
          </Row>

        ))}

      </TranslationsContainer>

    </Layout>
  )
}

export async function getStaticProps() {
  // Get external data from the file system, API, DB, etc.
  let translationsData;
  const url = 'http://localhost:5000/translations';
  const options = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json; charset=utf-8' }
  };
  const response = await fetch(url, options);

  if (response.status === 200) {
      const translations = await response.json().then(data => data);
      translationsData = translations.translations;
  }
  else if (response.status === 400) {
      translationsData = response.json().then(data => {
          return data.errors;
      });
  }
  else {
      throw new Error();
  }
  // The value of the `props` key will be passed to the `Translations` component
  return {
    props: {translationsData}
  }
}