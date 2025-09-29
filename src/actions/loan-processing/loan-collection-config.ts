'use server'

import api from '@utils/api'
import { revalidatePath } from 'next/cache'
import { StatusMsg } from '@config/constants'
import { AxiosError } from 'axios'

export const getLoanCollectionAccounts = async () => {
  try {
    const apiObj = await api()
    const { data } = await apiObj.get('/loan-processing/loan-collection/get-accounts')
    return data.data
  } catch (error) {
    return []
  }
}
