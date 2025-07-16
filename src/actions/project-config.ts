'use server'

import { ProjectSetupType } from '@types/project'
import api from '@utils/api'
import { revalidatePath } from 'next/cache'

export const getProjectList = async (params?: { page?: number; per_page?: number; search?: string }) => {
  try {
    const apiObj = await api()

    const { data } = await apiObj.get('/settings/project-investment-setup', {
      params
    })

    return data
  } catch (error) {
    return error.response?.data
  }
}

export const createProject = async (formData: ProjectSetupType, path?: string) => {
  try {
    const apiObj = await api()
    const { data } = await apiObj.post('/settings/project-investment-setup', {
      ...formData
    })

    revalidatePath('/settings/project-setup')

    return data
  } catch (error) {
    return error.response?.data
  }
}

export const updateProject = async (id: number, formData: ProjectSetupType) => {
  try {
    const apiObj = await api()
    const { data } = await apiObj.put(`/settings/project-investment-setup/${id}`, formData)
    revalidatePath('/settings/project-setup')
    return data
  } catch (error) {
    return error.response?.data
  }
}

export const deleteProject = async (id: number) => {
  try {
    const apiObj = await api()
    const { data } = await apiObj.delete(`/settings/project-investment-setup/${id}`)
    revalidatePath('/settings/project-setup')
    return data
  } catch (error) {
    return error.response?.data
  }
}
