'use server'

import api from '@utils/api';

export const getKarzEHasanLoanAccountList = async () => {
  try {
    const apiObj = await api()

    const { data } = await apiObj.get('/loan-processing/karz-e-hasanah/get-loan-accounts');
    return data.data
  } catch (error) {
    return error.response?.data
  }
}

export const getKarzEHasanLoanApprovarComitteeList = async () => {
  try {
    const apiObj = await api()

    const { data } = await apiObj.get('/loan-processing/karz-e-hasanah/get-loan-approval-committees');
    return data.data
  } catch (error) {
    return error.response?.data
  }
}