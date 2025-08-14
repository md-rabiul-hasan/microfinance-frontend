'use server'

import { BranchSetupType, PurchaseItemSetupType } from '@types'
import api from '@utils/api'
import { revalidatePath } from 'next/cache'

export const getPurchaseItemList = async (params?: { page?: number; per_page?: number; search?: string }) => {
  try {
    const apiObj = await api()

    const { data } = await apiObj.get('/loan-processing/purchase-item/list', {
      params
    })

    return data
  } catch (error) {
    return error.response?.data
  }
}

export const createPurchaseItem = async (formData: PurchaseItemSetupType, path?: string) => {
  try {
    const apiObj = await api()
    const { data } = await apiObj.post('/loan-processing/purchase-item/store', {
      ...formData
    })

    revalidatePath('/loan-processing/purchase-item')

    return data
  } catch (error) {
    return error.response?.data
  }
}

export const deletePurchaseItem = async (insertKey: any, productUniqueId: any) => {
  try {
    const apiObj = await api()
    const { data } = await apiObj.delete(
      `/loan-processing/purchase-item/delete?insertKey=${insertKey}&productUniqueId=${productUniqueId}`
    )
    revalidatePath('/loan-processing/purchase-item')
    return data
  } catch (error) {
    return error.response?.data
  }
}
