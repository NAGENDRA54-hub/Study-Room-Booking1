import axios from 'axios'
import { AUTH_STORAGE_KEY } from '../utils/storage.js'

const client = axios.create({
  baseURL: '/api',
})

client.interceptors.request.use((config) => {
  const persisted = window.localStorage.getItem(AUTH_STORAGE_KEY)
  if (persisted) {
    const auth = JSON.parse(persisted)
    if (auth?.token) {
      config.headers.Authorization = `Bearer ${auth.token}`
    }
  }

  return config
})

export default client
