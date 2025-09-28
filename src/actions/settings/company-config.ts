'use server'

import api from '@utils/api'
import { revalidatePath } from 'next/cache'

export const getCompanyInfo = async () => {
  try {
    const apiObj = await api()

    const { data } = await apiObj.get('/settings/company-info')

    return data
  } catch (error) {
    return {
      status: StatusMsg.BAD_REQUEST,
      message: error instanceof AxiosError ? error.response?.data.message : 'An unknown error occurred'
    }
  }
}

export const setupCompanyInfo = async (init: any) => {
  try {
    const formData = new FormData()
    formData.append('name', init.name)
    formData.append('sName', init.sName)
    formData.append('addr', init.addr)
    formData.append('logo_file', init.logo_file) // this should be a File object
    const apiObj = await api()
    const { data } = await apiObj.post(`settings/company-setup`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    revalidatePath('/settings/company-setup')
    return data
  } catch (error) {
    return {
      status: StatusMsg.BAD_REQUEST,
      message: error instanceof AxiosError ? error.response?.data.message : 'An unknown error occurred'
    }
  }
}
