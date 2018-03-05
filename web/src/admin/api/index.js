import axios from 'axios';
import router from '../router';
import { Message } from 'element-ui'
axios.defaults.baseURL = 'http://localhost:8084/admin';
axios.defaults.withCredentials = true;
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      switch (error.response.status) {
        case 400:
        case 401:
          Message.error('登录过时，请重新登录');
          router.replace({name: 'login'});
          return;
        default:
          return Promise.reject(error.response.data);
      }
    }
    return Promise.reject(error);
  }
);
export const startLogin = params => {
  return axios.post(`/login`, params)
  .then(res => Promise.resolve(res.data))
  .catch(res => Promise.reject(res))
}
export const getQuestionnaires = params => {
  return axios.get(`/questionnaires`, params)
  .then(res => Promise.resolve(res.data))
  .catch(err => Promise.reject(err))
}
export const getQuestionnaire = params => {
  return axios.get(`/questionnaires/${params.id}`)
  .then(res => Promise.resolve(res.data))
  .catch(err => Promise.reject(err))
}
export const updateQuestionnaire = params => {
  return axios.put(`/questionnaires/${params.id}`, params)
  .then(res => Promise.resolve(res.data))
  .catch(err => Promise.reject(err))
}
export const deleteQuestionnaire = params => {
  return axios.delete(`/questionnaires/${params.id}`)
  .then(res => Promise.resolve(res.data))
  .catch(err => Promise.reject(err))
}
export const addQuestionnaire = params => {
  return axios.post(`/questionnaires`, params)
  .then(res => Promise.resolve(res.data))
  .catch(err => Promise.reject(err))
}
export const getUsers = params => {
  return axios.get(`/users`, params)
  .then(res => Promise.resolve(res.data))
  .catch(err => Promise.reject(err))
}
export const addUser = params => {
  return axios.post(`/users`, params)
  .then(res => Promise.resolve(res.data))
  .catch(err => Promise.reject(err))
}
export const getRoles = params => {
  return axios.get(`/roles`, params)
  .then(res => Promise.resolve(res.data))
  .catch(err => Promise.reject(err))
}
