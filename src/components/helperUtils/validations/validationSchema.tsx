import * as Yup from 'yup';

export const registerValidationSchema = Yup.object().shape({
  name: Yup.string()
    .trim()
    .min(3, 'Full Name must be at least 3 characters')
    .required('Full Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  phoneNumber: Yup.string()
    .matches(/^\d+$/, 'Phone Number must contain only numbers')
    .length(10, 'Phone Number must be exactly 10 digits') // Adjust length as needed
    .required('Phone Number is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm Password is required'),
});
