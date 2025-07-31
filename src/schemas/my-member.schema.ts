import * as yup from 'yup'

export const myMemberSetupValidationSchema = yup.object().shape({
  member_id: yup.string().required('Member ID is required'),
  name: yup.string().trim().required('Name is required'),
  father: yup.string().trim().required("Father's name is required"),
  mother: yup.string().trim().required("Mother's name is required"),
  address_det: yup.string().trim().required('Address details are required'),
  profession: yup.number().required('Profession is required'),
  address_zoneCode: yup.number().required('Zone code is required'),
  contact: yup.string().required('Contact number is required'),
  email: yup.string().email('Invalid email format').required('Email is required'),
  gender: yup.string().oneOf(['M', 'F'], 'Gender must be M or F').required('Gender is required'),
  spouse: yup.string().trim().optional(),
  dob: yup.string().required('Date of birth is required'),
  blood: yup.number().required('Blood type is required'),
  national_id: yup.string().required('National ID is required'),
  religion: yup.number().required('Religion is required'),
  nom_name: yup.string().trim().required('Nominee name is required'),
  nom_relation: yup.string().trim().required('Nominee relation is required'),
  nom_nid_bc: yup.string().required('Nominee NID/BC is required'),
  nomContact: yup.string().required('Nominee contact is required'),
  int_type: yup
    .string()
    .oneOf(['M', 'O'], 'Introduction type must be M or O')
    .required('Introduction type is required'),
  int_id: yup.string().trim().nullable(),
  int_details: yup.string().trim().nullable(),
  mem_date: yup.string().required('Member date is required')
})
