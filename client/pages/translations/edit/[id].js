import Head from 'next/head';
import { useState } from 'react';
import Data from './../../../Data';
import Layout from './../../../components/layout';
import Button from '../../../components/button';
import { useRouter } from 'next/router';

export default function EditTranslation({ translationData }) {
  const router = useRouter();

  const [ firstLangWord, setFirstLangWord ] = useState(translationData.firstLang.word);
  const [ firstLangDesc, setFirstLangDesc ] = useState(translationData.firstLang.description);
  const [ secondLangWord, setSecondLangWord ] = useState(translationData.secondLang.word);
  const [ secondLangDesc, setSecondLangDesc ] = useState(translationData.secondLang.description);

  const data = new Data();

  function updateTranslation(e){

    switch (e.target.name) {
      case 'firstLangWord':
        setFirstLangWord(e.target.value);
        break;
      case 'secondLangWord':
        setSecondLangWord(e.target.value);
        break;
      case 'firstLangDesc':
        setFirstLangDesc(e.target.value);
        break;
      case 'secondLangDesc':
        setSecondLangDesc(e.target.value);
        break;
      default:
        break;
    }
  }

  function saveTranslation(e){
    e.preventDefault();
    const translation = {
      firstLangId: translationData.firstLang.id,
      firstLangCode: 'sv-SE',
      firstLangWord: firstLangWord,
      secondLangId: translationData.secondLang.id,
      secondLangWord: secondLangWord,
      secondLangCode: 'en-GB',
      firstLangDescription: firstLangDesc,
      secondLangDescription: secondLangDesc
    };
    data.updateTranslation(translationData.firstLang.id, translation);
    router.push('/translations/' + translationData.firstLang.id);
  }

  // Render data
  const title = 'Edit ' + translationData.firstLang.word + ' – ' + translationData.secondLang.word;
  return (
      <Layout>
          <Head>
              <title>{title}</title>
          </Head>
          <h1>Edit translation {title}</h1>
          <form onSubmit={saveTranslation}>
          <label htmlFor="firstLangWord">
            Swedish word
            <input
              type="text"
              name="firstLangWord"
              language="sv-SE"
              placeholder="Häst"
              value={firstLangWord}
              onChange={updateTranslation}
              required
            />
          </label>
          <label htmlFor="secondLangWord">
            English word
            <input
              type="text"
              name="secondLangWord"
              language="en-GB"
              placeholder="Horse"
              value={secondLangWord}
              onChange={updateTranslation}
              required
            />
          </label>
          <label htmlFor="firstLangDesc">
            Swedish description
            <textarea
              name="firstLangDesc"
              language="sv-SE"
              placeholder="Ett djur"
              value={firstLangDesc}
              onChange={updateTranslation}
            />
          </label>
          <label htmlFor="secondLangDesc">
            English description
            <textarea
              name="secondLangDesc"
              language="en-GB"
              placeholder="An animal"
              value={secondLangDesc}
              onChange={updateTranslation}
            />
          </label>
          <Button type="submit">Update</Button>
        </form>
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
    const paths = translationsData.map((translation) => `/translations/edit/${translation.EQString.id}`)
  
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
  