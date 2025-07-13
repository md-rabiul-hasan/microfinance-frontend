import axios from 'axios'
import https from 'https'

import { getServerSession } from 'next-auth'
import { authOptions } from './auth-options'

const httpsAgent = new https.Agent({ rejectUnauthorized: false })

export const apiBaseUrl = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_API_URL,
  httpsAgent
})

const api = async () => {
  const session = await getServerSession(authOptions)

  const headers: Record<string, string> = {}

  if (session) headers['Authorization'] = `Bearer ${session.user.accessToken}`

  return axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_API_URL,
    headers
  })
}

export default api