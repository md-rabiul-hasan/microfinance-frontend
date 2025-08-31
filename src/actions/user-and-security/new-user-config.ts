'use server'

import { CreateNewUserType } from '@types'
import api from '@utils/api'
import { revalidatePath } from 'next/cache'

export const getUserList = async (params?: { page?: number; per_page?: number; search?: string }) => {
  try {
    const apiObj = await api()

    const { data } = await apiObj.get('/user-and-security/user-setup/get-user-list', {
      params
    })

    return data
  } catch (error) {
    return error.response?.data
  }
}

export const getUserEmployeeList = async () => {
  try {
    const apiObj = await api()
    const { data } = await apiObj.get('/user-and-security/user-setup/get-employee-list')
    return data.data
  } catch (error) {
    return []
  }
}

export const getUserBranchList = async () => {
  try {
    const apiObj = await api()
    const { data } = await apiObj.get('/user-and-security/user-setup/get-branch-list')
    return data.data
  } catch (error) {
    return []
  }
}

export const getUserRoleList = async () => {
  try {
    const apiObj = await api()
    const { data } = await apiObj.get('/user-and-security/user-setup/get-role-list')
    return data.data
  } catch (error) {
    return []
  }
}

export const createNewUser = async (formData: CreateNewUserType, path?: string) => {
  try {
    const apiObj = await api()
    const { data } = await apiObj.post('/user-and-security/user-setup/store', {
      ...formData
    })

    revalidatePath('/user-and-security/new-user')

    return data
  } catch (error) {
    return error.response?.data
  }
}
