'use server'

import api from '@utils/api'
import { revalidatePath } from 'next/cache'
import { StatusMsg } from '@config/constants'
import { AxiosError } from 'axios'
import { MyMemberSetupType } from '@types'

export const getMyMemberList = async (params?: { page?: number; per_page?: number; search?: string }) => {
  try {
    const apiObj = await api()

    const { data } = await apiObj.get('/membership/my-member-setup', {
      params
    })

    return data
  } catch (error) {
    return {
      status: StatusMsg.BAD_REQUEST,
      message: error instanceof AxiosError ? error.response?.data.message : 'An unknown error occurred'
    }
  }
}

export const createMember = async (formData: MyMemberSetupType, path?: string) => {
  try {
    const apiObj = await api()
    const { data } = await apiObj.post('/membership/my-member-setup', {
      ...formData
    })

    revalidatePath('/membership/my-member-setup')

    return data
  } catch (error) {
    return {
      status: StatusMsg.BAD_REQUEST,
      message: error instanceof AxiosError ? error.response?.data.message : 'An unknown error occurred'
    }
  }
}

export const updateMember = async (id: number, formData: MyMemberSetupType) => {
  try {
    const apiObj = await api()
    const { data } = await apiObj.put(`/membership/my-member-setup/${id}`, formData)
    revalidatePath('/membership/my-member-setup')
    return data
  } catch (error) {
    return {
      status: StatusMsg.BAD_REQUEST,
      message: error instanceof AxiosError ? error.response?.data.message : 'An unknown error occurred'
    }
  }
}

export const deleteMember = async (id: number) => {
  try {
    const apiObj = await api()
    const { data } = await apiObj.delete(`/membership/my-member-setup/${id}`)
    revalidatePath('/membership/my-member-setup')
    return data
  } catch (error) {
    return {
      status: StatusMsg.BAD_REQUEST,
      message: error instanceof AxiosError ? error.response?.data.message : 'An unknown error occurred'
    }
  }
}

export const detailsMemberInfo = async (id: string | number) => {
  try {
    const apiObj = await api()
    const { data } = await apiObj.get(`/membership/my-member-setup/${id}`)
    return data
  } catch (error) {
    return {
      status: StatusMsg.BAD_REQUEST,
      message: error instanceof AxiosError ? error.response?.data.message : 'An unknown error occurred'
    }
  }
}

export const uploadMemberImage = async (params: any) => {
  try {
    const formData = new FormData()

    const apiObj = await api()
    const { data } = await apiObj.post('/membership/my-member-setup/image-upload', params, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    revalidatePath('/membership/my-member-setup')
    return data
  } catch (error: any) {
    return {
      status: StatusMsg.BAD_REQUEST,
      message: error instanceof AxiosError ? error.response?.data.message : 'An unknown error occurred'
    }
  }
}
