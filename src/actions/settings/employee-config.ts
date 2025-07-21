'use server'

import { CreateServiceAreaType, EmployeeSetupType } from '@types'
import api from '@utils/api'
import { revalidatePath } from 'next/cache'

export const getEmployeeList = async (params?: { page?: number; per_page?: number; search?: string }) => {
  try {
    const apiObj = await api()

    const { data } = await apiObj.get('/settings/employee-setup', {
      params
    })

    return data
  } catch (error) {
    return error.response?.data
  }
}

export const createEmployee = async (formData: EmployeeSetupType, path?: string) => {
  try {
    const apiObj = await api()
    const { data } = await apiObj.post('/settings/employee-setup', {
      ...formData
    })

    revalidatePath('/settings/employee-list')

    return data
  } catch (error) {
    return error.response?.data
  }
}

export const updateEmployee = async (id: number, formData: CreateServiceAreaType) => {
  try {
    const apiObj = await api()
    const { data } = await apiObj.put(`/settings/employee-setup/${id}`, formData)
    revalidatePath('/settings/employee-list')
    return data
  } catch (error) {
    return error.response?.data
  }
}

export const deleteEmployee = async (id: number) => {
  try {
    const apiObj = await api()
    const { data } = await apiObj.delete(`/settings/employee-setup/${id}`)
    revalidatePath('/settings/employee-list')
    return data
  } catch (error) {
    return error.response?.data
  }
}
