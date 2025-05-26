import axios, { AxiosError } from 'axios'

const baseURL = import.meta.env.VITE_API_URL
const apiKey = import.meta.env.VITE_API_KEY

export const api = axios.create({
  baseURL: baseURL,
  headers: {
    'Authorization': `Bearer ${apiKey}`,
  }
})

api.interceptors.response.use(
  function (response) {
    return response
  },
  function (error: AxiosError) {
    if (error instanceof AxiosError) {
      if (error.request.status === 500) {
        console.log(error)
      }
      if (error.response?.status === 401 || error.response?.status === 403) {
        console.log(error)
      }
    }

    return Promise.reject(error)
  }
)
