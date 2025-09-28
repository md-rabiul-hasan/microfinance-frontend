'use server'

import { WithdrawalAmountSetupType } from '@types'
import api from '@utils/api'
import { revalidatePath } from 'next/cache'

export const getWithdrawalGeneralAccounts = async () => {
  try {
    const apiObj = await api()
    const { data } = await apiObj.get('/withdrawal/collection-general-accounts')
    return data.data
  } catch (error) {
    return []
  }
}

export const getMemberWithdrawList = async (memberKeyCode: string) => {
  try {
    const apiObj = await api()
    const { data } = await apiObj.get(`/withdrawal/member-withdraw-list?memberKeyCode=${memberKeyCode}`)
    return data
  } catch (error) {
    return []
  }
}

export const getAccountBalance = async (memberKeyCode: string, accountCode: string) => {
  try {
    const apiObj = await api()
    const { data } = await apiObj.get(
      `/withdrawal/member-account-balance?memberKeyCode=${memberKeyCode}&accountCode=${accountCode}`
    )
    return data
  } catch (error) {
    return []
  }
}

export const createWithdrawal = async (formData: WithdrawalAmountSetupType, path?: string) => {
  try {
    const apiObj = await api()
    const { data } = await apiObj.post('/withdrawal/store', {
      ...formData
    })

    revalidatePath('/withdrawal/withdrawal-amount')
    return data
  } catch (error) {
    return {
      status: StatusMsg.BAD_REQUEST,
      message: error instanceof AxiosError ? error.response?.data.message : 'An unknown error occurred'
    }
  }
}

export const updateWithdrawal = async (insertKey: any, formData: WithdrawalAmountSetupType, path?: string) => {
  try {
    const apiObj = await api()
    const { data } = await apiObj.post(`/withdrawal/store?insertKey=${insertKey}`, {
      ...formData
    })

    revalidatePath('/withdrawal/withdrawal-amount')
    return data
  } catch (error) {
    return {
      status: StatusMsg.BAD_REQUEST,
      message: error instanceof AxiosError ? error.response?.data.message : 'An unknown error occurred'
    }
  }
}
