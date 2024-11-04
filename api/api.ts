import axios from 'axios'
import { Cookies } from 'react-cookie'

const cookies = new Cookies()

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
})

const getToken = () => cookies.get('token_panzer_admin')

api.interceptors.request.use(
  (config) => {
    const token = getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = cookies.get('refresh_panzer_admin')
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/token/refresh/`,
          {
            refresh: refreshToken,
          },
        )

        const newToken = response.data.access
        cookies.set('token_panzer_admin', newToken)
        originalRequest.headers.Authorization = `Bearer ${newToken}`
        return api(originalRequest)
      } catch (refreshError) {
        cookies.remove('token_panzer_admin')
        cookies.remove('refresh_panzer_admin')
        window.location.href = '/admin'
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  },
)
