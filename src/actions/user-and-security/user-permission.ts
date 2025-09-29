'use server'

import api from '@utils/api'
import { revalidatePath } from 'next/cache'
import { StatusMsg } from '@config/constants'
import { AxiosError } from 'axios'

export const getPermissionUserList = async () => {
  try {
    const apiObj = await api()

    const { data } = await apiObj.get('/user-and-security/user-permission-setup/get-user-list')
    return data.data
  } catch (error) {
    return {
      status: StatusMsg.BAD_REQUEST,
      message: error instanceof AxiosError ? error.response?.data.message : 'An unknown error occurred'
    }
  }
}

export const getUserMenuList = async (user_key_code: any) => {
  try {
    const apiObj = await api()

    const { data } = await apiObj.get(
      `/user-and-security/user-permission-setup/get-user-menus?user_key=${user_key_code}`
    )
    return data
  } catch (error) {
    return {
      status: StatusMsg.BAD_REQUEST,
      message: error instanceof AxiosError ? error.response?.data.message : 'An unknown error occurred'
    }
  }
}

export const userMenuPermissionUpdate = async (formData: any, path?: string) => {
  try {
    const apiObj = await api()
    const { data } = await apiObj.post('/user-and-security/user-permission-setup/update-user-menu-permission', {
      ...formData
    })

    revalidatePath('/user-and-security/user-permission')

    return data
  } catch (error) {
    return {
      status: StatusMsg.BAD_REQUEST,
      message: error instanceof AxiosError ? error.response?.data.message : 'An unknown error occurred'
    }
  }
}
