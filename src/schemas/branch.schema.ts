import * as yup from 'yup'

export const branchValidationSchema = yup.object().shape({
  name: yup.string().trim().required('Employee name is required'),
  contact: yup.string().trim().required('Contact information is required'),
  addr: yup.string().trim().nullable()
})
