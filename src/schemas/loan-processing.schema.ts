import * as yup from 'yup'

export const karzEHasanhValidationSchema = yup.object().shape({
  member_key_code: yup.string().required('Member key code is required'),
  account_code: yup.string().required('Account code is required'),
  remarks: yup.string().required('Remarks are required'),
  loan_id: yup.string().required('Loan ID is required'),
  loan_amount: yup.string().required('Loan amount is required'),
  profit_amount: yup.string().required('Profit amount is required'),
  payment_frequency: yup
    .string()
    .oneOf(['W', 'M'], 'Payment frequency must be Weekly (W) or Monthly (M)')
    .required('Payment frequency is required'),
  loan_tenure: yup.string().required('Loan tenure is required'),
  payment_completion_date: yup.string().required('Payment completion date is required'),
  installment_amount: yup.string().required('Installment amount is required'),
  approved_by: yup.string().required('Approver is required')
})
