import * as yup from 'yup'

export const employeeValidationSchema = yup.object().shape({
  emp_id: yup.string().trim().required('Employee ID is required'),
  name: yup.string().trim().required('Employee name is required'),
  designation: yup.string().trim().required('Designation is required'),
  contact: yup.string().trim().required('Contact information is required'),
  addr: yup.string().trim().nullable()
})
