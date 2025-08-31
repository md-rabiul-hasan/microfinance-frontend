import * as yup from 'yup'

export const newUserValidationSchema = yup.object().shape({
  employee_key_code: yup.string().trim().required('Employee selection is required'),
  permission_type: yup.string().trim().required('Permission type is required'),
  branch_key_code: yup.string().trim().required('Branch selection is required'),
  user_id: yup.string().trim().required('User ID is required'),
  password: yup.string().trim().required('Password is required'),
  role_key_code: yup.string().trim().required('Role selection is required')
})
