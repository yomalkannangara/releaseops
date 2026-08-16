import axios from 'axios'

export const TOKEN_STORAGE_KEY = 'releaseops_token'

export const apiClient = axios.create({
  baseURL: '/api',
  timeout: 10_000,
})

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY)

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response?.status === 401 &&
      window.location.pathname !== '/login'
    ) {
      localStorage.removeItem(TOKEN_STORAGE_KEY)
      window.location.assign('/login')
    }

    return Promise.reject(error)
  },
)