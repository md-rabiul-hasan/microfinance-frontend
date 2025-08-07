'use server'

import { CreateServiceAreaType, RegularDepositSetupType } from '@types'
import api from '@utils/api'
import { revalidatePath } from 'next/cache'

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

export const createRegularDeposit = async (formData: RegularDepositSetupType, path?: string) => {
  try {
    const apiObj = await api()
    const { data } = await apiObj.post('/deposit/regular-deposit/store', {
      ...formData
    })

    revalidatePath('/deposit/regular-deposit')

    return data
  } catch (error) {
    return error.response?.data
  }
}
