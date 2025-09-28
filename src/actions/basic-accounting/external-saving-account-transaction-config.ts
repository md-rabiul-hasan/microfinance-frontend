'use server'

import api from '@utils/api'
import { revalidatePath } from 'next/cache'

export const getExternalSavingAccountList = async () => {
  try {
    const apiObj = await api()
    const { data } = await apiObj.get(`/basic-accounting/external-saving-account-transaction/get-transaction-accounts`)
    return data.data
  } catch (error) {
    return []
  }
}

export const getExternalSavingAccountTransactions = async () => {
  try {
    const apiObj = await api()
    const { data } = await apiObj.get(`/basic-accounting/external-saving-account-transaction/get-account-transactions`)
    return data
  } catch (error) {
    return []
  }
}


export const addExternalSavingAccountTransaction = async (formData: any, path?: string) => {
  try {
    const apiObj = await api()
    const { data } = await apiObj.post('/basic-accounting/external-saving-account-transaction/store', {
      ...formData
    })

    revalidatePath('/basic-accounting/external-saving-account-transaction')
    return data
  } catch (error) {
    return {
      status: StatusMsg.BAD_REQUEST,
      message: error instanceof AxiosError ? error.response?.data.message : 'An unknown error occurred'
    }
  }
}


export const deleteExternalSavingAccountTransaction = async (insert_key: string) => {
  try {
    const apiObj = await api()
    const { data } = await apiObj.post('/basic-accounting/external-saving-account-transaction/delete-transaction', {
      'insert_key': insert_key
    })
    revalidatePath('/basic-accounting/external-saving-account-transaction')
    return data
  } catch (error) {
    return {
      status: StatusMsg.BAD_REQUEST,
      message: error instanceof AxiosError ? error.response?.data.message : 'An unknown error occurred'
    }
  }
}
