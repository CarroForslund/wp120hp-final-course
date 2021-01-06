export default class Data {
    api(path, method = 'GET', body = null) {
      const url = 'http://localhost:5000/translations' + path;
    
      const options = {
        method,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
      };
  
      if (body !== null) {
        options.body = JSON.stringify(body);
      }
      return fetch(url, options);
    }
  
    async getTranslations() {
      const response = await this.api('/translations', 'GET');
      if (response.status === 200) {
        const translations = await response.json().then(data => data);
        return translations;
      }
      else if (response.status === 400) {
        return response.json().then(data => {
          return data.errors;
        });
      }
      else {
        throw new Error();
      }
    }
  
    async createTranslation(translation) {
      console.log(translation);
      const response = await this.api('/', 'POST', translation);
      console.log('response.status', response.status);
      if (response.status === 201) {
        return null;
      }
      else if (response.status === 400) {
        return response.json().then(data => {
          return data;
        });
      }
      else {
        throw new Error();
      }
    }
  
    async getTranslation(translationId) {
      const response = await this.api('/translations/' + translationId, 'GET');
      if (response.status === 200) {
        const translation = await response.json().then(data => data);
        return translation;
      }
      else if (response.status === 404) {
        return response.json().then(data => {
          return data.message;
        });
      }
      else {
        throw new Error();
      }
    }
  
    async updateTranslation(translationId, translation) {
      const response = await this.api('/' + translationId, 'PUT', translation);
      if (response.status === 204) {
        return null;
      }
      else if (response.status === 400) {
        return response.json().then(data => {
          return data.message;
        });
      }
      else if (response.status === 403) {
        return response.json().then(data => {
          return data.message;
        });
      }
      else {
        throw new Error();
      }
    }
  
    async deleteTranslation(translationId) {
      const response = await this.api('/' + translationId, 'DELETE');
      if (response.status === 204) {
        return [];
      }
      else if (response.status === 404) {
        return response.json().then(data => {
          return data.errors;
        });
      }
      else {
        throw new Error();
      }
    }
  }