'use server'

import api from '@utils/api'
import { revalidatePath } from 'next/cache'

export const getDifferentProjectAccountList = async () => {
  try {
    const apiObj = await api()
    const { data } = await apiObj.get(`/basic-accounting/different-project-transaction/get-project-investment-accounts`)
    return data.data
  } catch (error) {
    return []
  }
}

export const getDifferentProjectTransactions = async (account_key_code: any) => {
  try {
    const apiObj = await api()
    const { data } = await apiObj.get(`/basic-accounting/different-project-transaction/get-project-investment-transactions?account_key_code=${account_key_code}`)
    return data
  } catch (error) {
    return []
  }
}


export const addDifferentProjectTransactionsTransaction = async (formData: any, path?: string) => {
  try {
    const apiObj = await api()
    const { data } = await apiObj.post('/basic-accounting/different-project-transaction/store', {
      ...formData
    })

    revalidatePath('/basic-accounting/different-project-transaction')
    return data
  } catch (error) {
    return error.response?.data
  }
}


export const deleteDifferentProjectTransactionsTransaction = async (insert_key: string) => {
  try {
    const apiObj = await api()
    const { data } = await apiObj.post('/basic-accounting/different-project-transaction/delete-transaction', {
      'insert_key': insert_key
    })
    revalidatePath('/basic-accounting/different-project-transaction')
    return data
  } catch (error) {
    return error.response?.data
  }
}
