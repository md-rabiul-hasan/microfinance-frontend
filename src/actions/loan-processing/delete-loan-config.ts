'use server'

import api from '@utils/api'

export const getMemberLoanListForDelete = async (memberKeyCode: any) => {
  try {
    const apiObj = await api()

    const { data } = await apiObj.get(`/loan-processing/delete-loan/member-loan-list?memberKeyCode=${memberKeyCode}`)
    return data
  } catch (error) {
    return error.response?.data
  }
}

