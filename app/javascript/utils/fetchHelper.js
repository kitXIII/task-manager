import axios from 'axios';
import qs from 'qs';
import { serialize as objectToFormData } from 'object-to-formdata';
import { assocPath, path, isEmpty } from 'ramda';

import { camelize, decamelize } from './keysConverter';

const defaultHeaders = {
  'Accept': '*/*',
  'Content-Type': 'application/json',
  'X-Requested-With': 'XMLHttpRequest'
};

function authenticityToken() {
  const token = document.querySelector('meta[name="csrf-token"]');
  return token ? token.content : null;
}

function headers() {
  return {
    ...defaultHeaders,
    'X-CSRF-Token': authenticityToken()
  };
}

axios.defaults.headers.post = headers();
axios.defaults.headers.put = headers();
axios.defaults.headers.delete = headers();
axios.interceptors.response.use(null, (error) => {
  if (error.response.status === 422) {
    const {
      response: { data: errors }
    } = error;
    return Promise.reject(camelize(errors.errors));
  }

  if (error.response.status === 500) {
    return Promise.reject(new Error('Something went wrong, please retry again'));
  }

  return Promise.reject(error);
});

export default {
  get(url, params = {}) {
    return axios
      .get(url, {
        params: decamelize(params),
        paramsSerializer: (parameters) => qs.stringify(parameters, { encode: false }),
        headers: defaultHeaders
      })
      .then(camelize);
  },

  post(url, json) {
    const body = decamelize(json);

    return axios.post(url, body).then(camelize);
  },

  put(url, json) {
    const body = decamelize(json);

    return axios.put(url, body).then(camelize);
  },

  delete(url) {
    return axios.delete(url).then(camelize);
  },

  putFormData(url, json) {
    const body = decamelize(json);

    // humps.decamelizeKeys brakes blob file
    const fixedBody = isEmpty(path(['attachment', 'image'], body))
      ? assocPath(['attachment', 'image'], path(['attachment', 'image'], json), body)
      : body;

    const formData = objectToFormData(fixedBody);

    return axios
      .put(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      .then(camelize);
  }
};
