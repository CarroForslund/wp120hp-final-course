import Head from 'next/head';
import Layout from '../../components/layout';
import { useState } from 'react';
import Data from './../../Data';
import Button from '../../components/Button';

export default function AddTranslation() {
  const [ firstLangWord, setFirstLangWord ] = useState('');
  const [ firstLangDesc, setFirstLangDesc ] = useState('');
  const [ secondLangWord, setSecondLangWord ] = useState('');
  const [ secondLangDesc, setSecondLangDesc ] = useState('');
  const [ translations, setTranslations ] = useState([]);
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
      firstLangCode: 'sv-SE',
      firstLangWord: firstLangWord,
      secondLangWord: secondLangWord,
      secondLangCode: 'en-GB',
      firstLangDesc: firstLangDesc,
      secondLangDesc: secondLangDesc
    };
    setTranslations(translations.concat(translation));
    setFirstLangWord('');
    setSecondLangWord('');
    setFirstLangDesc('');
    setSecondLangDesc('');
    data.createTranslation(translation);
  }

  return (
    <Layout>
      <Head>
        <title>Add Translation</title>
      </Head>
      <h1>Add Translation</h1>
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
        <Button type="submit">Add</Button>
      </form>
    </Layout>
  )
}