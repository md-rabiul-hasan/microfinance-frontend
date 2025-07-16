'use server'

import { FiscalYearSetupType } from '@types';
import api from '@utils/api';

export const getFirscalYear = async () => {
  try {
    const apiObj = await api()

    const { data } = await apiObj.get('/settings/fiscal-year-setup');

    return data
  } catch (error) {
    return error.response?.data
  }
}


export const setupFiscalYear = async (formData: FiscalYearSetupType) => {
  try {
    const apiObj = await api()
    const { data } = await apiObj.post('/settings/fiscal-year-setup', {
      ...formData
    })

    revalidatePath('/settings/fiscal-year-setup')

    return data
  } catch (error) {
    return error.response?.data
  }
}