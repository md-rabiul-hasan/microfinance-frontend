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
    const { data } = await apiObj.get(`/withdrawal/member-account-balance?memberKeyCode=${memberKeyCode}&accountCode=${accountCode}`)
    return data
  } catch (error) {
    return []
  }
}

export const createWithdrawal = async (formData: WithdrawalAmountSetupType, path?: string) => {
  console.log('createWithdrawal formData', formData);
  try {
    const apiObj = await api()
    const { data } = await apiObj.post('/withdrawal/store', {
      ...formData
    })

    revalidatePath('/withdrawal/withdrawal-amount')
    return data
  } catch (error) {
    return error.response?.data
  }
}
