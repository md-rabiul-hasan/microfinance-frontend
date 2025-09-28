'use server'

import api from '@utils/api'
import { revalidatePath } from 'next/cache'

export const getChartOfAccountList = async (formData: any, path?: string) => {
  try {
    const apiObj = await api()
    const { data } = await apiObj.get('/general-accounting/account-setup/get-account-list')
    return data.data
  } catch (error) {
    return {
      status: StatusMsg.BAD_REQUEST,
      message: error instanceof AxiosError ? error.response?.data.message : 'An unknown error occurred'
    }
  }
}

export const addAccountInChartOfAccount = async (formData: any, path?: string) => {
  try {
    const apiObj = await api()
    const { data } = await apiObj.post('/general-accounting/account-setup/store', {
      ...formData
    })

    revalidatePath('/general-accounting/account-setup')
    return data
  } catch (error) {
    return {
      status: StatusMsg.BAD_REQUEST,
      message: error instanceof AxiosError ? error.response?.data.message : 'An unknown error occurred'
    }
  }
}
