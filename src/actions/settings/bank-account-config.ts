'use server'

import { BankAccountSetupType } from '@types'
import api from '@utils/api'
import { revalidatePath } from 'next/cache'
import { StatusMsg } from '@config/constants'
import { AxiosError } from 'axios'

export const getBankAccountList = async (params?: { page?: number; per_page?: number; search?: string }) => {
  try {
    const apiObj = await api()

    const { data } = await apiObj.get('/settings/bank-account-setup', {
      params
    })

    return data
  } catch (error) {
    return {
      status: StatusMsg.BAD_REQUEST,
      message: error instanceof AxiosError ? error.response?.data.message : 'An unknown error occurred'
    }
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
    return {
      status: StatusMsg.BAD_REQUEST,
      message: error instanceof AxiosError ? error.response?.data.message : 'An unknown error occurred'
    }
  }
}

export const updateBankAccount = async (id: number, formData: BankAccountSetupType) => {
  try {
    const apiObj = await api()
    const { data } = await apiObj.put(`/settings/bank-account-setup/${id}`, formData)
    revalidatePath('/settings/bank-account-setup')
    return data
  } catch (error) {
    return {
      status: StatusMsg.BAD_REQUEST,
      message: error instanceof AxiosError ? error.response?.data.message : 'An unknown error occurred'
    }
  }
}

export const deleteBankAccount = async (id: string) => {
  try {
    const apiObj = await api()
    const { data } = await apiObj.delete(`/settings/bank-account-setup/${id}`)
    revalidatePath('/settings/bank-account-setup')
    return data
  } catch (error) {
    return {
      status: StatusMsg.BAD_REQUEST,
      message: error instanceof AxiosError ? error.response?.data.message : 'An unknown error occurred'
    }
  }
}
