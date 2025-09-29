import { login, refreshAccessToken } from '@actions/auth'
import { SessionUser } from '@types'
import { NextAuthOptions } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'

export const authOptions: NextAuthOptions = {
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'string' },
        password: { label: 'Password', type: 'password' }
      },
      authorize: async (credentials): Promise<any> => {
        try {
          if (!credentials?.username || !credentials?.password) throw new Error('Username and password are required')

          const response = await login(credentials.username, credentials.password)

          const { success, data } = response.data

          if (!success) throw new Error('Invalid credentials')

          return {
            user_key: data.user.user_key,
            fullname: data.user.fullname,
            user_id: data.user.user_id,
            user_type: data.user.user_type,
            assignedBr: data.user.assignedBr,
            branch_name: data.user.branch_name,
            accessToken: data.access_token.token,
            refreshToken: data.refresh_token.token,
            accessTokenExpires: Date.now() + data.access_token.expires_in * 1000 // Expiry in ms
          }
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || error.message || 'Unknown error occurred'
          throw new Error(errorMessage)
        }
      }
    })
  ],

  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        // First-time login: Store tokens in JWT
        return {
          ...token,
          user_key: (user as any).user_key,
          fullname: (user as any).fullname,
          user_id: (user as any).user_id,
          user_type: (user as any).user_type,
          assignedBr: (user as any).assignedBr,
          branch_name: (user as any).branch_name,
          accessToken: (user as any).accessToken,
          refreshToken: (user as any).refreshToken,
          accessTokenExpires: (user as any).accessTokenExpires
        }
      }

      // Check if the token is expired
      const now = Date.now()
      if (now < (token as any).accessTokenExpires) {
        return token // Token is still valid
      }

      // Access token expired, attempt to refresh
      return await refreshToken(token)
    },

    session: async ({ session, token }) => {
      if (token) {
        session.user = {
          ...session.user,
          ...(token as any)
        } as any
      }
      return session
    }
  },

  session: {
    strategy: 'jwt',
    maxAge: 60 * 60, // 1 hour (changed from 4 hours)
    updateAge: 15 * 60 // Refresh session every 15 minutes (optional: you can adjust this too)
  },

  jwt: {
    maxAge: 60 * 60 // 1 hour (changed from 4 hours)
  },

  pages: {
    signIn: '/sign-in'
  }
}

/**
 * Refresh access token using the refresh token
 */
async function refreshToken(token: any) {
  try {
    const response = await refreshAccessToken(token.refreshToken)
    const { success, data } = response.data

    if (!success) throw new Error('Failed to refresh token')

    return {
      ...token,
      user_key: data.user.user_key,
      fullname: data.user.fullname,
      user_id: data.user.user_id,
      user_type: data.user.user_type,
      assignedBr: data.user.assignedBr,
      branch_name: data.user.branch_name,
      accessToken: data.access_token.token,
      accessTokenExpires: Date.now() + data.access_token.expires_in * 1000, // New expiry time
      refreshToken: data.refresh_token.token || token.refreshToken // Use new refresh token if provided
    }
  } catch (error) {
    return {
      ...token,
      error: 'RefreshTokenError' // Mark session as invalid
    }
  }
}
