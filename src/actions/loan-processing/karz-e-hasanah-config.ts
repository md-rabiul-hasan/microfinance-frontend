'use server'

import api from '@utils/api'
import { revalidatePath } from 'next/cache'

export const getKarzEHasanLoanAccountList = async () => {
  try {
    const apiObj = await api()

    const { data } = await apiObj.get('/loan-processing/karz-e-hasanah/get-loan-accounts')
    return data.data
  } catch (error) {
    return error.response?.data
  }
}

export const getKarzEHasanLoanApprovarComitteeList = async () => {
  try {
    const apiObj = await api()

    const { data } = await apiObj.get('/loan-processing/karz-e-hasanah/get-loan-approval-committees')
    return data.data
  } catch (error) {
    return error.response?.data
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
    return error.response?.data
  }
}

export const getMemberLoanList = async (memberKeyCode: string) => {
  try {
    const apiObj = await api()
    const { data } = await apiObj.get(`/loan-processing/karz-e-hasanah/member-loan-list?memberKeyCode=${memberKeyCode}`)
    return data
  } catch (error) {
    return []
  }
}
