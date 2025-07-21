'use server'

import { BranchSetupType } from '@types'
import api from '@utils/api'
import { revalidatePath } from 'next/cache'

export const getBranchList = async (params?: { page?: number; per_page?: number; search?: string }) => {
  try {
    const apiObj = await api()

    const { data } = await apiObj.get('/settings/branch-setup', {
      params
    })

    return data
  } catch (error) {
    return error.response?.data
  }
}

export const createBranch = async (formData: BranchSetupType, path?: string) => {
  try {
    const apiObj = await api()
    const { data } = await apiObj.post('/settings/branch-setup', {
      ...formData
    })

    revalidatePath('/settings/branch-setup')

    return data
  } catch (error) {
    return error.response?.data
  }
}

export const updateBranch = async (id: number, formData: BranchSetupType) => {
  try {
    const apiObj = await api()
    const { data } = await apiObj.put(`/settings/branch-setup/${id}`, formData)
    revalidatePath('/settings/branch-setup')
    return data
  } catch (error) {
    return error.response?.data
  }
}

export const deleteBranch = async (id: number) => {
  try {
    const apiObj = await api()
    const { data } = await apiObj.delete(`/settings/branch-setup/${id}`)
    revalidatePath('/settings/branch-setup')
    return data
  } catch (error) {
    return error.response?.data
  }
}
