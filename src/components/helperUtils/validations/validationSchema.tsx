import * as Yup from 'yup';

export const registerValidationSchema = Yup.object().shape({
  name: Yup.string()
    .trim()
    .min(3, 'Company Name must be at least 3 characters')
    .required('Company Name is required'),

  ownerName: Yup.string()
    .trim()
    .min(3, 'Company Name must be at least 3 characters')
    .required('Company Name is required'),

  registrationNumber: Yup.string()
    .trim()
    .min(3, 'Company Registration Number must be at least 3 characters')
    .required('Company Registration Number is required'),

  stateRegistration: Yup.string()
    .trim()
    .required('State Registration is required'),

  tin: Yup.string()
    .trim()
    .matches(/^\d+$/, 'TIN must contain only digits')
    .min(9, 'TIN must be at least 9 digits')
    .max(15, 'TIN must be at most 15 digits')
    .required('Tax Identification Number is required'),

  businessStructure: Yup.string()
    .trim()
    .required('Legal Structure of Business is required'),

  yearEstablished: Yup.string()
    .matches(/^\d{4}$/, 'Enter a valid year (e.g., 2000)')
    .required('Year Established is required'),

  address: Yup.string()
    .trim()
    .min(5, 'Company Address must be at least 5 characters')
    .required('Company Address is required'),

  phoneNumber: Yup.string()
    .matches(/^\d+$/, 'Phone Number must contain only digits')
    .min(10, 'Phone Number must be at least 10 digits')
    .max(12, 'Phone Number must be at most 12 digits')
    .required('Company Phone Number is required'),

  ownerPhoneNumber: Yup.string()
    .matches(/^\d+$/, 'Phone Number must contain only digits')
    .min(10, 'Phone Number must be at least 10 digits')
    .max(12, 'Phone Number must be at most 12 digits')
    .required('Company Phone Number is required'),

  email: Yup.string()
    .email('Invalid email format')
    .required('Company Email is required'),

  ownerEmail: Yup.string()
    .email('Invalid email format')
    .required('Company Email is required'),

  website: Yup.string().trim().url('Invalid URL format').notRequired(), // Website is optional

  linkedIn: Yup.string().trim().url('Invalid URL format').notRequired(), // Website is optional

  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),

  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm Password is required'),

  serviceOffered: Yup.string().trim().required('Service Offered is required'),

  productionCapacity: Yup.string()
    .trim()
    .required('Production Capacity is required'),

  turnaroundTime: Yup.string().trim().required('Turnaround Time is required'),

  specialization: Yup.string().trim().notRequired(),

  targetMarket: Yup.string().trim().required('Target Market is required'),

  facebookLink: Yup.string().trim().url('Invalid URL format').notRequired(),
  instagramLink: Yup.string().trim().url('Invalid URL format').notRequired(),
  logoUpload: Yup.string().trim().required('Logo upload is required'),
  portfolio: Yup.string().trim().url('Invalid URL format').notRequired(),
  businessProof: Yup.string()
    .trim()
    .required('Business registration proof is required'),
  documentVerification: Yup.string().trim().notRequired(),
  onboardingAvailability: Yup.string()
    .trim()
    .required('Onboarding availability is required'),
});

export const registerCustomerValidationSchema = Yup.object().shape({
  name: Yup.string()
    .trim()
    .min(3, 'Company Name must be at least 3 characters')
    .required('Company Name is required'),

  phoneNumber: Yup.string()
    .matches(/^\d+$/, 'Phone Number must contain only digits')
    .min(10, 'Phone Number must be at least 10 digits')
    .max(12, 'Phone Number must be at most 12 digits')
    .required('Company Phone Number is required'),

  email: Yup.string()
    .email('Invalid email format')
    .required('Company Email is required'),

  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),

  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm Password is required'),
});
