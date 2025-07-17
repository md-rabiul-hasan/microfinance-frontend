import * as yup from 'yup'

export const bankAccountValidationSchema = yup.object().shape({
  bank_name: yup.string().trim().required('Bank name is required'),
  acc_name: yup.string().trim().required('Account holder name is required'),
  acc_number: yup.string().trim().required('Account number is required'),
  acc_flag: yup.number().required('Account type is required') // 0=General, 1=Provident, 2=Gratuity
})
