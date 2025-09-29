'use server'

import { RegularDepositSetupType } from '@types'
import api from '@utils/api'
import { revalidatePath } from 'next/cache'
import { StatusMsg } from '@config/constants'
import { AxiosError } from 'axios'

export const getDepositGeneralAccounts = async () => {
  try {
    const apiObj = await api()
    const { data } = await apiObj.get('/deposit/regular-deposit/collection-general-accounts')
    return data.data
  } catch (error) {
    return []
  }
}

export const getMemberDepositList = async (memberKeyCode: string) => {
  try {
    const apiObj = await api()
    const { data } = await apiObj.get(`/deposit/regular-deposit/member-deposit-list?memberKeyCode=${memberKeyCode}`)
    return data
  } catch (error) {
    return []
  }
}

export const createDeposit = async (formData: RegularDepositSetupType, path?: string) => {
  try {
    const apiObj = await api()
    const { data } = await apiObj.post('/deposit/store', {
      ...formData
    })

    revalidatePath('/deposit/regular-deposit')

    return data
  } catch (error) {
    return {
      status: StatusMsg.BAD_REQUEST,
      message: error instanceof AxiosError ? error.response?.data.message : 'An unknown error occurred'
    }
  }
}


export const updateDeposit = async (insertKey: any, formData: RegularDepositSetupType, path?: string) => {
  try {
    const apiObj = await api()
    const { data } = await apiObj.post(`/deposit/store?insertKey=${insertKey}`, {
      ...formData
    })

    revalidatePath('/deposit/regular-deposit')

    return data
  } catch (error) {
    return {
      status: StatusMsg.BAD_REQUEST,
      message: error instanceof AxiosError ? error.response?.data.message : 'An unknown error occurred'
    }
  }
}
