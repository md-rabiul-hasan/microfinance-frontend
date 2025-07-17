import * as yup from 'yup'

export const externalSavingAccountValidationSchema = yup.object().shape({
  org_name: yup.string().trim().required('Organization name is required'),
  acc_name: yup.string().trim().required('Account name is required'),
  acc_number: yup.string().trim().required('Account number is required')
})
