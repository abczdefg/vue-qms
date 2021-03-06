import ajax from '@admin/utils/ajax';

export const login = params => {
  return ajax.post(`/session`, params)
  .then(res => Promise.resolve(res.data))
  .catch(res => Promise.reject(res))
}
export const logout = params => {
  return ajax.delete(`/session`, params)
  .then(res => Promise.resolve(res.data))
  .catch(res => Promise.reject(res))
}
export const checkLogin = params => {
  return ajax.get(`/session`, params)
  .then(res => Promise.resolve(res.data))
  .catch(err => Promise.reject(err))
}
export const getQuestionnaires = params => {
  return ajax.get(`/questionnaires`, params)
  .then(res => Promise.resolve(res.data))
  .catch(err => Promise.reject(err))
}
export const getQuestionnaire = params => {
  return ajax.get(`/questionnaires/${params.id}`)
  .then(res => Promise.resolve(res.data))
  .catch(err => Promise.reject(err))
}
export const updateQuestionnaire = params => {
  return ajax.put(`/questionnaires/${params.id}`, params)
  .then(res => Promise.resolve(res.data))
  .catch(err => Promise.reject(err))
}
export const deleteQuestionnaire = params => {
  return ajax.delete(`/questionnaires/${params.id}`)
  .then(res => Promise.resolve(res.data))
  .catch(err => Promise.reject(err))
}
export const publishQuestionnaire = params => {
  return ajax.put(`/questionnaires/${params.id}/publish`, params)
  .then(res => Promise.resolve(res.data))
  .catch(err => Promise.reject(err))
}
export const addQuestionnaire = params => {
  return ajax.post(`/questionnaires`, params)
  .then(res => Promise.resolve(res.data))
  .catch(err => Promise.reject(err))
}
export const getUsers = params => {
  return ajax.get(`/users`, params)
  .then(res => Promise.resolve(res.data))
  .catch(err => Promise.reject(err))
}
export const addUser = params => {
  return ajax.post(`/users`, params)
  .then(res => Promise.resolve(res.data))
  .catch(err => Promise.reject(err))
}
export const deleteUser = params => {
  return ajax.delete(`/users/${params.id}`)
  .then(res => Promise.resolve(res.data))
  .catch(err => Promise.reject(err))
}
export const getRoles = params => {
  return ajax.get(`/roles`, params)
  .then(res => Promise.resolve(res.data))
  .catch(err => Promise.reject(err))
}
export const updateUserPassword = params => {
  return ajax.put(`/users/${params.id}/password`, params)
  .then(res => Promise.resolve(res.data))
  .catch(err => Promise.reject(err))
}
export const getResultsByQuestionnaireId = params => {
  return ajax.get(`/questionnaires/${params.id}/results`)
  .then(res => Promise.resolve(res.data))
  .catch(err => Promise.reject(err))
}
export const getQuestionnairesCount = params => {
  return ajax.get(`/questionnaires/count`)
  .then(res => Promise.resolve(res.data))
  .catch(err => Promise.reject(err))
}
export const getResultsCount = params => {
  return ajax.get(`/results/count`, params)
  .then(res => Promise.resolve(res.data))
  .catch(err => Promise.reject(err))
}
export const getUsersCount = params => {
  return ajax.get(`/users/count`, params)
  .then(res => Promise.resolve(res.data))
  .catch(err => Promise.reject(err))
}
