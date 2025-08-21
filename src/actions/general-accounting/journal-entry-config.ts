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
