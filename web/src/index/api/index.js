import axios from 'axios';
axios.defaults.baseURL = BASE_URL;

export const getQuestionnaires = params => {
  return axios.get(`/questionnaires`)
  .then(res => Promise.resolve(res.data))
  .catch(err => Promise.reject(err))
}
export const getQuestionnaire = params => {
  return axios.get(`/questionnaires/${params.id}`)
  .then(res => Promise.resolve(res.data))
  .catch(err => Promise.reject(err))
}

export const submitQuestionnaire = params => {
  return axios.post(`/questionnaires`, params)
  .then(res => Promise.resolve(res.data))
  .catch(err => Promise.reject(err))
}
