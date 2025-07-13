import * as yup from 'yup';

export const signInSchema = yup.object().shape({
  username: yup.string().required('Please enter your username'),
  password: yup.string().required('Please enter password')
});
