import * as yup from 'yup'

export const RegularDepositSetupValidationSchema = yup.object().shape({
  member_key_code: yup.string().required('Member ID is required'),

  account_code: yup.string().required('Deposit account is required'),

  amount: yup
    .number()
    .typeError('Amount must be a number')
    .required('Deposit amount is required')
    .positive('Amount must be positive')
    .moreThan(0, 'Amount must be greater than 0'),

  deposit_date: yup.string().required('Deposit date is required'),

  remarks: yup
    .string()
    .required('Remarks are required')
    .max(200, 'Remarks cannot exceed 200 characters')
})


export const FixedDepositSetupValidationSchema = yup.object().shape({
  member_key_code: yup.string().required('Member ID is required'),

  fdr_length: yup.string().required('FDR length is required'),

  amount: yup
    .number()
    .typeError('Amount must be a number')
    .required('Deposit amount is required')
    .positive('Amount must be positive')
    .moreThan(0, 'Amount must be greater than 0'),

  opening_date: yup.string().required('FDR opening date is required'),

  remarks: yup
    .string()
    .required('Remarks are required')
    .max(200, 'Remarks cannot exceed 200 characters')
})