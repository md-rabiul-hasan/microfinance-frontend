'use server'

import api from '@utils/api'

export const getIrregularDepositGeneralAccounts = async () => {
  try {
    const apiObj = await api()
    const { data } = await apiObj.get('/deposit/irregular-deposit/collection-general-accounts')
    return data.data
  } catch (error) {
    return []
  }
}

export const getMemberIrregularDepositList = async (memberKeyCode: string) => {
  try {
    const apiObj = await api()
    const { data } = await apiObj.get(`/deposit/irregular-deposit/member-deposit-list?memberKeyCode=${memberKeyCode}`)
    return data
  } catch (error) {
    return []
  }
}

