'use server'

import api from '@utils/api'
import { revalidatePath } from 'next/cache'

export const getMemberLoanListForDelete = async (memberKeyCode: any) => {
  try {
    const apiObj = await api()

    const { data } = await apiObj.get(`/loan-processing/delete-loan/member-loan-list?memberKeyCode=${memberKeyCode}`)
    return data
  } catch (error) {
    return error.response?.data
  }
}

export const deleteLoanRequest = async (loan_id: any) => {
  try {
    const apiObj = await api()
    const { data } = await apiObj.post('/loan-processing/delete-loan/store', {
      loan_id: loan_id
    })

    revalidatePath('/loan-processing/delete-loan')
    return data
  } catch (error) {
    return error.response?.data
  }
}

export const getLoanDeletePendingList = async (params?: { page?: number; per_page?: number; search?: string }) => {
  try {
    const apiObj = await api()

    const { data } = await apiObj.get('/loan-processing/delete-loan-auth/pending-list', {
      params
    })

    return data
  } catch (error) {
    return error.response?.data
  }
}

export const authorizeDeleteLoanRequest = async (keyCode: any, loan_id: any) => {
  try {
    const apiObj = await api()
    const { data } = await apiObj.post('/loan-processing/delete-loan-auth/authorize', {
      loan_delete_process_id: keyCode,
      loan_id: loan_id
    })

    revalidatePath('/loan-processing/delete-loan-auth')
    return data
  } catch (error) {
    return error.response?.data
  }
}

export const rejectDeleteLoanRequest = async (keyCode: any, loan_id: any) => {
  try {
    const apiObj = await api()
    const { data } = await apiObj.post('/loan-processing/delete-loan-auth/reject', {
      loan_delete_process_id: keyCode,
      loan_id: loan_id
    })

    revalidatePath('/loan-processing/delete-loan-auth')
    return data
  } catch (error) {
    return error.response?.data
  }
}
