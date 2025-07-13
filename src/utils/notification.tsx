import { ReactNode } from 'react'
import { BiCheckCircle as SuccessIcon } from 'react-icons/bi'
import { MdOutlineErrorOutline as ErrorIcon } from 'react-icons/md'

import { StatusMsg } from '@config/constants'

type Props = {
  status: StatusMsg
  message: string
}

export const getMessage = (obj: Props) => ({
  title: obj.status,
  icon: obj.status === StatusMsg.SUCCESS ? <SuccessIcon /> : <ErrorIcon />,
  message: obj.message,
  color: obj.status === StatusMsg.SUCCESS ? 'green' : 'red'
})

export const getSuccessMessage = (message: string | ReactNode) => ({
  title: 'Success',
  icon: <SuccessIcon />,
  message,
  color: 'green'
})

export const getErrorMessage = (error: any) => {
  if (typeof error === 'string')
    return {
      title: 'Error',
      icon: <ErrorIcon />,
      message: error,
      color: 'red'
    }

  const { response } = error
  const { data } = response || {}
  const { error: title = 'Error', message: errors } = data || {}

  const message = typeof errors === 'string' ? errors : errors?.length > 0 ? errors.join('; ') : error?.message

  return {
    title,
    icon: <ErrorIcon />,
    message,
    color: 'red'
  }
}
