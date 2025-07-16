'use server'

import api from '@utils/api';

export const getCompanyInfo = async () => {
  try {
    const apiObj = await api()

    const { data } = await apiObj.get('/settings/company-info');

    return data
  } catch (error) {
    return error.response?.data
  }
}
