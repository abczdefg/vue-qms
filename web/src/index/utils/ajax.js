import axios from 'axios'

const instance = axios.create({
  baseURL: `${BASE_URL}/api`
});

// 响应拦截
instance.interceptors.response.use(
  response => response,
  error => Promise.reject(error.response.data)
);

export default instance;
