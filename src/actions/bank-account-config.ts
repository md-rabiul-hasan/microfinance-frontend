'use server'

import { BankAccountSetupType, CreateServiceAreaType } from '@types'
import { EmployeeSetupType } from '@types/employee'
import api from '@utils/api'
import { revalidatePath } from 'next/cache'

export const getBankAccountList = async (params?: { page?: number; per_page?: number; search?: string }) => {
  try {
    const apiObj = await api()

    const { data } = await apiObj.get('/settings/bank-account-setup', {
      params
    })

    return data
  } catch (error) {
    return error.response?.data
  }
}

export const createBankAccount = async (formData: BankAccountSetupType, path?: string) => {
  try {
    const apiObj = await api()
    const { data } = await apiObj.post('/settings/bank-account-setup', {
      ...formData
    })

    revalidatePath('/settings/bank-account-setup')

    return data
  } catch (error) {
    return error.response?.data
  }
}

export const updateBankAccount = async (id: number, formData: BankAccountSetupType) => {
  try {
    const apiObj = await api()
    const { data } = await apiObj.put(`/settings/bank-account-setup/${id}`, formData)
    revalidatePath('/settings/bank-account-setup')
    return data
  } catch (error) {
    return error.response?.data
  }
}

export const deleteBankAccount = async (id: string) => {
  try {
    const apiObj = await api()
    const { data } = await apiObj.delete(`/settings/bank-account-setup/${id}`)
    revalidatePath('/settings/bank-account-setup')
    return data
  } catch (error) {
    return error.response?.data
  }
}
