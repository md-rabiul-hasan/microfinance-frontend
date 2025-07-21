'use server'

import { TransactionDateSetupType } from '@types'
import api from '@utils/api'
import { revalidatePath } from 'next/cache'

export const getTransactionDate = async () => {
  try {
    const apiObj = await api()

    const { data } = await apiObj.get('/settings/transaction-date')

    return data
  } catch (error) {
    return error.response?.data
  }
}

export const setupTransactionDate = async (formData: TransactionDateSetupType) => {
  try {
    const apiObj = await api()
    const { data } = await apiObj.post('/settings/transaction-date', {
      ...formData
    })

    revalidatePath('/settings/transaction-date-setup')
    return data
  } catch (error) {
    return error.response?.data
  }
}
