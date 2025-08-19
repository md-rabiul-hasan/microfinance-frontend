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
