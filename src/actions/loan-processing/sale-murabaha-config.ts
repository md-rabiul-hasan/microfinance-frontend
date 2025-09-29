'use server'

import api from '@utils/api'
import { revalidatePath } from 'next/cache'
import { StatusMsg } from '@config/constants'
import { AxiosError } from 'axios'

export const getSellableProductList = async () => {
  try {
    const apiObj = await api()

    const { data } = await apiObj.get('/loan-processing/sale-murabaha/sellable-product-list')
    return data
  } catch (error) {
    return {
      status: StatusMsg.BAD_REQUEST,
      message: error instanceof AxiosError ? error.response?.data.message : 'An unknown error occurred'
    }
  }
}


export const createSaleMurabaha = async (formData: any) => {
  try {
    const apiObj = await api()
    const { data } = await apiObj.post('/loan-processing/sale-murabaha/store', {
      ...formData
    })

    revalidatePath('/loan-processing/sale-murabaha')
    return data
  } catch (error) {
    return {
      status: StatusMsg.BAD_REQUEST,
      message: error instanceof AxiosError ? error.response?.data.message : 'An unknown error occurred'
    }
  }
}