import * as yup from 'yup'

export const bankAccountValidationSchema = yup.object().shape({
  bank_name: yup.string().trim().required('Bank name is required'),
  acc_name: yup.string().trim().required('Account holder name is required'),
  acc_number: yup.string().trim().required('Account number is required'),
  acc_flag: yup.number().required('Account type is required') // 0=General, 1=Provident, 2=Gratuity
})

export const branchValidationSchema = yup.object().shape({
  name: yup.string().trim().required('Employee name is required'),
  contact: yup.string().trim().required('Contact information is required'),
  addr: yup.string().trim().nullable()
})

export const employeeValidationSchema = yup.object().shape({
  emp_id: yup.string().trim().required('Employee ID is required'),
  name: yup.string().trim().required('Employee name is required'),
  designation: yup.string().trim().required('Designation is required'),
  contact: yup.string().trim().required('Contact information is required'),
  addr: yup.string().trim().nullable()
})

export const externalSavingAccountValidationSchema = yup.object().shape({
  org_name: yup.string().trim().required('Organization name is required'),
  acc_name: yup.string().trim().required('Account name is required'),
  acc_number: yup.string().trim().required('Account number is required')
})

export const projectValidationSchema = yup.object().shape({
  project_name: yup.string().trim().required('Employee name is required'),
  project_location: yup.string().trim().required('Contact information is required'),
  project_details: yup.string().trim().nullable()
})

export const serviceAreaValidationSchema = yup.object().shape({
  zoneName: yup.string().trim().required('Service area name is required'),
  locCode: yup.string().required('Please select a location')
})
