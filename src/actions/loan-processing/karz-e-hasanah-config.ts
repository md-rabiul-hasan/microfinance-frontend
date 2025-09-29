'use server'

import api from '@utils/api'
import { revalidatePath } from 'next/cache'
import { StatusMsg } from '@config/constants'
import { AxiosError } from 'axios'

export const getKarzEHasanLoanAccountList = async () => {
  try {
    const apiObj = await api()

    const { data } = await apiObj.get('/loan-processing/karz-e-hasanah/get-loan-accounts')
    return data.data
  } catch (error) {
    return {
      status: StatusMsg.BAD_REQUEST,
      message: error instanceof AxiosError ? error.response?.data.message : 'An unknown error occurred'
    }
  }
}

export const getKarzEHasanLoanApprovarComitteeList = async () => {
  try {
    const apiObj = await api()

    const { data } = await apiObj.get('/loan-processing/karz-e-hasanah/get-loan-approval-committees')
    return data.data
  } catch (error) {
    return {
      status: StatusMsg.BAD_REQUEST,
      message: error instanceof AxiosError ? error.response?.data.message : 'An unknown error occurred'
    }
  }
}

export const createKarzEHasanahLoan = async (formData: any) => {
  try {
    const apiObj = await api()
    const { data } = await apiObj.post('/loan-processing/karz-e-hasanah/store', {
      ...formData
    })

    revalidatePath('/loan-processing/karz-e-hasanah')
    return data
  } catch (error) {
    return {
      status: StatusMsg.BAD_REQUEST,
      message: error instanceof AxiosError ? error.response?.data.message : 'An unknown error occurred'
    }
  }
}

export const getMemberLoanList = async (memberKeyCode: string | number) => {
  try {
    const apiObj = await api()
    const { data } = await apiObj.get(`/loan-processing/karz-e-hasanah/member-loan-list?memberKeyCode=${memberKeyCode}`)
    return data
  } catch (error) {
    return []
  }
}

export const updateKarzEHasanahLoan = async (insertKey: any, formData: any) => {
  try {
    const apiObj = await api()
    const { data } = await apiObj.post(`/loan-processing/karz-e-hasanah/update?insertKey=${insertKey}`, {
      ...formData
    })

    revalidatePath('/loan-processing/karz-e-hasanah')
    return data
  } catch (error) {
    return {
      status: StatusMsg.BAD_REQUEST,
      message: error instanceof AxiosError ? error.response?.data.message : 'An unknown error occurred'
    }
  }
}
