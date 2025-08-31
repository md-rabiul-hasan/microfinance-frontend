'use server'

import { CreateNewUserType } from '@types'
import api from '@utils/api'
import { revalidatePath } from 'next/cache'

export const getPermissionUserList = async () => {
  try {
    const apiObj = await api()

    const { data } = await apiObj.get('/user-and-security/user-permission-setup/get-user-list')
    return data.data
  } catch (error) {
    return error.response?.data
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
    return error.response?.data
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
    return error.response?.data
  }
}
