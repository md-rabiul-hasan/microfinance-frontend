'use server'

import api from '@utils/api'
import { revalidatePath } from 'next/cache'
import { StatusMsg } from '@config/constants'
import { AxiosError } from 'axios'

export const getCashVoucherAccountHeadList = async () => {
  try {
    const apiObj = await api()
    const { data } = await apiObj.get('/general-accounting/cash-voucher/get-transaction-accounts')
    return data.data
  } catch (error) {
    return []
  }
}

export const createCashVoucherTransaction = async (formData: any, path?: string) => {
  try {
    const apiObj = await api()
    const { data } = await apiObj.post('/general-accounting/cash-voucher/store', {
      ...formData
    })

    revalidatePath('/general-accounting/cash-voucher')
    return data
  } catch (error) {
    return {
      status: StatusMsg.BAD_REQUEST,
      message: error instanceof AxiosError ? error.response?.data.message : 'An unknown error occurred'
    }
  }
}
