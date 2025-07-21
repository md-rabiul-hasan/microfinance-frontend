'use server'

import { CreateServiceAreaType } from '@types'
import api from '@utils/api'
import { revalidatePath } from 'next/cache'

export const getServiceAreaList = async (params?: { page?: number; per_page?: number; search?: string }) => {
  try {
    const apiObj = await api()

    const { data } = await apiObj.get('/settings/service-area', {
      params
    })

    return data
  } catch (error) {
    return error.response?.data
  }
}

export const createServiceArea = async (formData: CreateServiceAreaType, path?: string) => {
  try {
    const apiObj = await api()
    const { data } = await apiObj.post('/settings/service-area', {
      ...formData
    })

    revalidatePath('/settings/service-area-setup')

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
