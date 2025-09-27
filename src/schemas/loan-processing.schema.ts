import * as yup from 'yup'

export const karzEHasanhValidationSchema = yup.object().shape({
  account_code: yup.string().required('Account code is required'),
  remarks: yup.string().required('Remarks are required'),
  loan_id: yup.string().required('Loan ID is required'),
  loan_amount: yup.string().required('Loan amount is required'),
  payment_frequency: yup
    .string()
    .oneOf(['W', 'M'], 'Payment frequency must be Weekly (W) or Monthly (M)')
    .required('Payment frequency is required'),
  loan_tenure: yup.string().required('Loan tenure is required'),
  payment_completion_date: yup.string().required('Payment completion date is required'),
  installment_amount: yup.string().required('Installment amount is required'),
  approved_by: yup.string().required('Approver is required')
})

export const purchaseItemValidationSchema = yup.object().shape({
  purchase_id: yup.string().required('Purchase ID is required'),
  purchase_details: yup.string().required('Purchase details are required'),
  purchase_date: yup.string().required('Purchase date is required'),
  purchase_amount: yup.string().required('Purchase amount is required'),
  purchase_from: yup.string().required('Purchase source is required'),
  remarks: yup.string().required('Remarks are required') // Added remarks field
})

export const saleMurabahaValidationSchema = yup.object().shape({
  product_id: yup.string().required('Product select is requireed'),
  account_code: yup.string().required('Account code is required'),
  remarks: yup.string().required('Remarks are required'),
  loan_id: yup.string().required('Loan ID is required'),
  profit_amount: yup.string().required('Profit amount is required'),
  payment_frequency: yup
    .string()
    .oneOf(['W', 'M', 'F'], 'Payment frequency must be Weekly (W), Fortnightly (F) or Monthly (M)')
    .required('Payment frequency is required'),
  loan_tenure: yup.string().required('Loan tenure is required'),
  payment_completion_date: yup.string().required('Payment completion date is required'),
  installment_amount: yup.string().required('Installment amount is required'),
  approved_by: yup.string().required('Approver is required'),
  remarks: yup.string().required('Remarks are required') // Added remarks field
})
