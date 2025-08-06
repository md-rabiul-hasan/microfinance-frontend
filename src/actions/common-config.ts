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

export const getReligions = async () => {
  try {
    const apiObj = await api()
    const { data } = await apiObj.get('/common/religions')

    return data.data
  } catch (error) {
    return []
  }
}

export const getBloodGroups = async () => {
  try {
    const apiObj = await api()
    const { data } = await apiObj.get('/common/blood-groups')

    return data.data
  } catch (error) {
    return []
  }
}

export const getProfessions = async () => {
  try {
    const apiObj = await api()
    const { data } = await apiObj.get('/common/professions')

    return data.data
  } catch (error) {
    return []
  }
}

export const getAddressZones = async () => {
  try {
    const apiObj = await api()
    const { data } = await apiObj.get('/common/address-zones')

    return data.data
  } catch (error) {
    return []
  }
}

export const getMembers = async () => {
  try {
    const apiObj = await api()
    const { data } = await apiObj.get('/common/members')

    return data.data
  } catch (error) {
    return []
  }
}
