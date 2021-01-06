import Head from 'next/head';
import Layout from '../../components/layout';
import Data from './../../Data';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Translation({ translationData }) {
    const data = new Data();
    const router = useRouter();

    function deleteTranslation(){
        data.deleteTranslation(translationData.firstLang.id);
        router.push('/translations');
    }
    // Render data
    const title = translationData.firstLang.word + ' – ' + translationData.secondLang.word;
    return (
        <Layout>
            <Head>
                <title>{title}</title>
            </Head>
            <h1>{title}</h1>
            <p>
                <strong>Swedish description: </strong>
                {translationData.firstLang.description}
            </p>
            <p>
                <strong>English description: </strong>
                {translationData.secondLang.description}
            </p>
            <Link href={'/translations/edit/'+ translationData.firstLang.id.toString()}>Edit</Link>
            <button onClick={deleteTranslation}>Delete</button>
        </Layout>
    )
}

// This function gets called at build time
export async function getStaticPaths() {
    // Call an external API endpoint to get posts
    const url = 'http://localhost:5000/translations';
    const options = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json; charset=utf-8' }
    };
    const response = await fetch(url, options);
    let translationsData;

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
  
    // Get the paths we want to pre-render based on posts
    const paths = translationsData.map((translation) => `/translations/${translation.EQString.id}`)
  
    // We'll pre-render only these paths at build time.
    // { fallback: false } means other routes should 404.
    return { paths, fallback: false }
}

/// This also gets called at build time
export async function getStaticProps({ params }) {
    // params contains the translation `id`.
    // If the route is like /translations/1, then params.id is 1
    // Call an external API endpoint to get translation
    const url = `http://localhost:5000/translations/${params.id}`;
    const options = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json; charset=utf-8' }
    };
    const response = await fetch(url, options);
    let translationData;
    if (response.status === 200) {
        const translation = await response.json().then(data => data);
        translationData = translation;
    }
    else if (response.status === 400) {
        translationData = response.json().then(data => {
            return data.errors;
        });
    }
    else {
        throw new Error();
    }
  
    // Pass post data to the page via props
    return { props: { translationData } }
  }
  