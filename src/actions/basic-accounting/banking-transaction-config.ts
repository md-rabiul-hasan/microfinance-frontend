'use server'

import api from '@utils/api'
import { revalidatePath } from 'next/cache'

export const getBankingTransactionAccountList = async (account_category: string | number) => {
  try {
    const apiObj = await api()
    const { data } = await apiObj.get(`/basic-accounting/banking-transaction/get-transaction-accounts?account_category=${account_category}`)
    return data
  } catch (error) {
    return []
  }
}

export const getBankingAccountCategoryTransactionList = async (account_category: string | number) => {
  try {
    const apiObj = await api()
    const { data } = await apiObj.get(`/basic-accounting/banking-transaction/get-account-category-transactions?account_category=${account_category}`)
    return data
  } catch (error) {
    return []
  }
}


export const addBasicBankingTransaction = async (formData: any, path?: string) => {
  try {
    const apiObj = await api()
    const { data } = await apiObj.post('/basic-accounting/banking-transaction/store', {
      ...formData
    })

    revalidatePath('/basic-accounting/banking-transaction')
    return data
  } catch (error) {
    return {
      status: StatusMsg.BAD_REQUEST,
      message: error instanceof AxiosError ? error.response?.data.message : 'An unknown error occurred'
    }
  }
}


export const deleteBankingTransaction = async (insert_key: string) => {
  try {
    const apiObj = await api()
    const { data } = await apiObj.post('/basic-accounting/banking-transaction/delete-transaction', {
      'insert_key': insert_key
    })
    revalidatePath('/basic-accounting/banking-transaction')
    return data
  } catch (error) {
    return {
      status: StatusMsg.BAD_REQUEST,
      message: error instanceof AxiosError ? error.response?.data.message : 'An unknown error occurred'
    }
  }
}
