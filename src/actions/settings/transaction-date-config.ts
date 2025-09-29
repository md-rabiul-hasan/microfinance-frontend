'use server'

import { TransactionDateSetupType } from '@types'
import api from '@utils/api'
import { revalidatePath } from 'next/cache'
import { StatusMsg } from '@config/constants'
import { AxiosError } from 'axios'

export const getTransactionDate = async () => {
  try {
    const apiObj = await api()

    const { data } = await apiObj.get('/settings/transaction-date')

    return data
  } catch (error) {
    return {
      status: StatusMsg.BAD_REQUEST,
      message: error instanceof AxiosError ? error.response?.data.message : 'An unknown error occurred'
    }
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
    return {
      status: StatusMsg.BAD_REQUEST,
      message: error instanceof AxiosError ? error.response?.data.message : 'An unknown error occurred'
    }
  }
}
