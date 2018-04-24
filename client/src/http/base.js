import axios from 'axios'
import { getCookie } from '../utils/cookie'

// axios 配置
axios.defaults.timeout = 10000
axios.defaults.baseURL = '/api'
if (process.env.NODE_ENV === 'production') {
  axios.defaults.headers['x-csrf-token'] = getCookie('csrfToken')
}

axios.interceptors.response.use(
  response => {
    if (response.data.code === 200) {
      console.table(response.data)
      return response
    } else {
      return Promise.reject(response.data)
    }
  },
  err => {
    console.table(err)
    return Promise.reject(new Error(err.response.data.error || err.message))
  }
)

/**
 * @param  {string} url
 * @param  {object} params={}
 */
const fetch = (url, params = {}) => {
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        params
      })
      .then(res => {
        resolve(res.data)
      })
      .catch(err => {
        reject(err)
      })
  })
}
/**
 * @param  {string} url
 * @param  {object} data={}
 */
const post = (url, data = {}) => {
  return new Promise((resolve, reject) => {
    axios
      .post(url, data)
      .then(res => {
        resolve(res.data)
      })
      .catch(err => {
        reject(err)
      })
  })
}

/**
 * @param  {string} url
 * @param  {object} data={}
 */
const put = (url, data = {}) => {
  return new Promise((resolve, reject) => {
    axios
      .put(url, data)
      .then(res => {
        resolve(res.data)
      })
      .catch(err => {
        reject(err)
      })
  })
}
/**
 * @param  {string} url
 * @param  {object} params={}
 */
const del = url => {
  return new Promise((resolve, reject) => {
    axios
      .delete(url, {})
      .then(res => {
        resolve(res.data)
      })
      .catch(err => {
        reject(err)
      })
  })
}

export { axios, fetch, post, put, del }
