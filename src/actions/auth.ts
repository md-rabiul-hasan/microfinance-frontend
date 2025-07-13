'use server'

import { apiBaseUrl } from '@utils/api';

export const login = async (username?: string, password?: string) => {
  return await apiBaseUrl.post(`/auth/login`, {
    username,
    password
  });
}

export const refreshAccessToken = async (refreshToken?: string) => {
  return await apiBaseUrl.post(`/auth/refresh-token`, {}, {
    headers: {
      Authorization: `Bearer ${refreshToken}`
    }
  });
};