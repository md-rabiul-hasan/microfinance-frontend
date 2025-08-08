'use server'

import { FixedDepositSetupType } from '@types'
import api from '@utils/api'
import { revalidatePath } from 'next/cache'

export const getMemberFdrList = async (memberKeyCode: string) => {
  try {
    const apiObj = await api()
    const { data } = await apiObj.get(`/deposit/fixed-deposit/member-fdr-list?memberKeyCode=${memberKeyCode}`)
    return data
  } catch (error) {
    return []
  }
}

export const createFdrDeposit = async (formData: FixedDepositSetupType, path?: string) => {
  try {
    const apiObj = await api()
    const { data } = await apiObj.post('/deposit/fixed-deposit/store', {
      ...formData
    })

    revalidatePath('/deposit/fixed-deposit')

    return data
  } catch (error) {
    return error.response?.data
  }
}


export const updateFdrDeposit = async (insertKey: any, formData: FixedDepositSetupType, path?: string) => {
  try {
    const apiObj = await api()
    const { data } = await apiObj.post(`/deposit/fixed-deposit/store?insertKey=${insertKey}`, {
      ...formData
    })

    revalidatePath('/deposit/fixed-deposit')

    return data
  } catch (error) {
    return error.response?.data
  }
}
