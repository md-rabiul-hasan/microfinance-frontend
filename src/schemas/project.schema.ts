import * as yup from 'yup'

export const projectValidationSchema = yup.object().shape({
  project_name: yup.string().trim().required('Employee name is required'),
  project_location: yup.string().trim().required('Contact information is required'),
  project_details: yup.string().trim().nullable()
})
