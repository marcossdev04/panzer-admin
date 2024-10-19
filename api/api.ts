import axios from 'axios'
import { Cookies } from 'react-cookie'

const cookies = new Cookies()
const token = cookies.get('token:panzer-admin')

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    Authorization: `Bearer ${token}`,
  },
})
