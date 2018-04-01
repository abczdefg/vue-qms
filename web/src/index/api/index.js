import ajax from '@index/utils/ajax';

export const getQuestionnaires = params => {
  return ajax.get(`/questionnaires`)
  .then(res => Promise.resolve(res.data))
  .catch(err => Promise.reject(err))
}
export const getQuestionnaire = params => {
  return ajax.get(`/questionnaires/${params.id}`)
  .then(res => Promise.resolve(res.data))
  // .catch(err => Promise.reject(err))
  .catch(err => {console.dir(err);return Promise.reject(err)})
}

export const addResult = params => {
  return ajax.post(`/results`, params)
  .then(res => Promise.resolve(res.data))
  .catch(err => Promise.reject(err))
}
