import Head from 'next/head';
import styles from '../styles/Home.module.css';
import Layout from '../components/layout';
import Description from '../components/description';
import Grid from '../components/grid';
import Card from '../components/card';

export default function Home() {
  return (
    <Layout home>

      <Head>
        <title>Equi Translation App</title>
      </Head>

      <h2 className={styles.title}>
        Welcome to Equi Translation App
      </h2>

      <Description className={styles.description}>
        Here can you look for existing Swedish/English translations of horse related words and phrases, and add missing ones to the library. Note that this app is still under development.
      </Description>

      <Grid className={styles.grid}>
        <Card 
          href="/translations" 
          className={styles.card} 
          title="View translations &rarr;"
          text="See a list of all the words added to the library."
        />

        <Card 
          href="/translations/add"
          className={styles.card}
          title="Add new &rarr;"
          text="Here you can add a new translation to the library."
        />
      </Grid>

    </Layout>
  )
}
