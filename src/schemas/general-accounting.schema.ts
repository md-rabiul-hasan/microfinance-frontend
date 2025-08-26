import * as yup from 'yup'

export const profitReserveValidationSchema = yup.object().shape({
  transaction_date: yup
    .string()
    .required('Transaction date is required')
    .typeError('Transaction date must be a valid date'),

  account_code: yup.string().trim().required('Account code is required'),

  amount: yup
    .number()
    .required('Amount is required')
    .positive('Amount must be positive')
    .typeError('Amount must be a valid number'),

  transaction_type: yup.string().required('Transaction type is required'),
  narration: yup.string().trim().nullable().notRequired().max(500, 'Narration cannot exceed 500 characters')
})
