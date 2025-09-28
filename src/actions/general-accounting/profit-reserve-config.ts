'use server'

import api from '@utils/api'
import { revalidatePath } from 'next/cache'

export const createProfitEntry = async (formData: any, path?: string) => {
  try {
    const apiObj = await api()
    const { data } = await apiObj.post('/general-accounting/profit-reserve/store', {
      ...formData
    })

    revalidatePath('/general-accounting/profit-reserve')
    return data
  } catch (error) {
    return {
      status: StatusMsg.BAD_REQUEST,
      message: error instanceof AxiosError ? error.response?.data.message : 'An unknown error occurred'
    }
  }
}
