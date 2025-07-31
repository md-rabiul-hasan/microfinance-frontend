'use server'

import { CreateServiceAreaType } from '@types'
import { MyMemberSetupType } from '@types/my-member'
import api from '@utils/api'
import { revalidatePath } from 'next/cache'

export const getMyMemberList = async (params?: { page?: number; per_page?: number; search?: string }) => {
  try {
    const apiObj = await api()

    const { data } = await apiObj.get('/membership/my-member-setup', {
      params
    })

    return data
  } catch (error) {
    return error.response?.data
  }
}

export const createMember = async (formData: MyMemberSetupType, path?: string) => {
  try {
    const apiObj = await api()
    const { data } = await apiObj.post('/membership/my-member-setup', {
      ...formData
    })

    revalidatePath('/membership/my-member-setup')

    return data
  } catch (error) {
    return error.response?.data
  }
}

export const updateServiceArea = async (id: number, formData: CreateServiceAreaType) => {
  try {
    const apiObj = await api()
    const { data } = await apiObj.put(`/settings/service-area/${id}`, formData)
    revalidatePath('/products/list')
    return data
  } catch (error) {
    return error.response?.data
  }
}

export const deleteServiceArea = async (id: number) => {
  try {
    const apiObj = await api()
    const { data } = await apiObj.delete(`/settings/service-area/${id}`)
    revalidatePath('/products/list')
    return data
  } catch (error) {
    return error.response?.data
  }
}
