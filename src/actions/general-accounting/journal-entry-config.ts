'use server'

import api from '@utils/api'
import { revalidatePath } from 'next/cache'

export const getJournalAccountHeadList = async () => {
  try {
    const apiObj = await api()
    const { data } = await apiObj.get('/general-accounting/journal-entry/get-transaction-accounts')
    return data.data
  } catch (error) {
    return []
  }
}

export const getSubAccountHead = async (accountCode: string) => {
  try {
    const apiObj = await api()
    const { data } = await apiObj.get(`/general-accounting/journal-entry/sub-account-head/${accountCode}`)
    return data
  } catch (error) {
    return []
  }
}

export const createJournalEntry = async (formData: any, path?: string) => {
  try {
    const apiObj = await api()
    const { data } = await apiObj.post('/general-accounting/journal-entry/store', {
      ...formData
    })

    revalidatePath('/general-accounting/journal-entry')
    return data
  } catch (error) {
    return {
      status: StatusMsg.BAD_REQUEST,
      message: error instanceof AxiosError ? error.response?.data.message : 'An unknown error occurred'
    }
  }
}
