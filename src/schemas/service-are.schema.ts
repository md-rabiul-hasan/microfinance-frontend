import * as yup from 'yup';

export const serviceAreaValidationSchema = yup.object().shape({
  zoneName: yup.string().trim().required('Service area name is required'),
  locCode: yup.string().required('Please select a location'),
});