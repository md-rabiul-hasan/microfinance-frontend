'use server'

import api from '@utils/api'

export const getLocationList = async () => {
  try {
    const apiObj = await api()
    const { data } = await apiObj.get('/common/location?division=Barisal')

    return data.data
  } catch (error) {
    return []
  }
}