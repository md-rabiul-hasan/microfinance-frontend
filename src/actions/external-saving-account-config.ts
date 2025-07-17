'use server'

import { CreateServiceAreaType, ExternalSavingAccountSetupType } from '@types'
import { EmployeeSetupType } from '@types/employee'
import api from '@utils/api'
import { revalidatePath } from 'next/cache'

export const getExternalSavingAccount = async (params?: { page?: number; per_page?: number; search?: string }) => {
  try {
    const apiObj = await api()

    const { data } = await apiObj.get('/settings/external-saving-account-setup', {
      params
    })

    return data
  } catch (error) {
    return error.response?.data
  }
}

export const createExternalSavingAccount = async (formData: ExternalSavingAccountSetupType, path?: string) => {
  try {
    const apiObj = await api()
    const { data } = await apiObj.post('/settings/external-saving-account-setup', {
      ...formData
    })

    revalidatePath('/settings/external-saving-account-setup')

    return data
  } catch (error) {
    return error.response?.data
  }
}

export const updateExternalSavingAccount = async (id: number, formData: ExternalSavingAccountSetupType) => {
  try {
    const apiObj = await api()
    const { data } = await apiObj.put(`/settings/external-saving-account-setup/${id}`, formData)
    revalidatePath('/settings/external-saving-account-setup')
    return data
  } catch (error) {
    return error.response?.data
  }
}

export const deleteExternalSavingAccount = async (id: number) => {
  try {
    const apiObj = await api()
    const { data } = await apiObj.delete(`/settings/external-saving-account-setup/${id}`)
    revalidatePath('/settings/external-saving-account-setup')
    return data
  } catch (error) {
    return error.response?.data
  }
}
