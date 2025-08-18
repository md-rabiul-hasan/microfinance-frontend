'use server'

import api from '@utils/api'
import { revalidatePath } from 'next/cache'

export const getSellableProductList = async () => {
  try {
    const apiObj = await api()

    const { data } = await apiObj.get('/loan-processing/sale-murabaha/sellable-product-list')
    return data
  } catch (error) {
    return error.response?.data
  }
}
