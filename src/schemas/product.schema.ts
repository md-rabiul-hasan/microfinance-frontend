import * as yup from 'yup';

export const productCreateSchema = yup.object().shape({
  name: yup.string().trim().required('Please enter product name'),
  description: yup.string().trim().required('Please enter product description'),
  price: yup
    .number()
    .typeError('Price must be a number') // Ensures input is a number
    .required('Please enter product price')
    .positive('Price should be a positive number'), // Must be greater than 0
});
