import * as yup from 'yup';
import { parse, isValid } from 'date-fns';
import { z } from "zod"

// Helper to validate dates
const parseDateString = (value: any, originalValue: any) => {
  if (typeof originalValue !== 'string' || !originalValue) return null;
  const parsedDate = parse(originalValue, 'yyyy-MM-dd', new Date());
  if (!isValid(parsedDate)) return new Date('');
  return parsedDate;
};
// Basic Info validation schema
export const basicInfoSchema = yup.object().shape({
  firstName: yup.string().required('First name is required').trim(),
  middleName: yup.string().trim(),
  lastName: yup.string().required('Last name is required').trim(),
  username: yup
    .string()
    .required('Username is required')
    .min(3, 'Username must be at least 3 characters')
    .matches(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers and underscore')
    .trim(),
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'
    ),
  confirmPassword: yup
    .string()
    .required('Please confirm your password')
    .oneOf([yup.ref('password')], 'Passwords must match'),
  email: yup
    .string()
    .required('Email is required')
    .email('Please enter a valid email address')
    .trim(),
  phone: yup
    .string()
    .required('Phone number is required')
    .matches(
      /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/,
      'Please enter a valid phone number'
    )
    .trim(),
  dateOfBirth: yup
    .string()
    .transform(parseDateString)
    // .max(new Date(), 'Date of birth cannot be in the future')
    .required('Date of birth is required'),
  gender: yup.string().required('Gender is required'),
  profilePicture: yup.string(),
});

// Address Info validation schema
export const addressInfoSchema = yup.object().shape({
  streetAddress: yup.string().required('Street address is required').trim(),
  city: yup.string().required('City is required').trim(),
  state: yup.string().required('State is required').trim(),
  zipCode: yup
    .string()
    .required('Zip code is required')
    .matches(/^[0-9]{5}(-[0-9]{4})?$/, 'Please enter a valid zip code')
    .trim(),
  country: yup.string().required('Country is required').trim(),
});

// Security Info validation schema
export const securityInfoSchema = yup.object().shape({
  securityQuestion1: yup.string().required('Security question is required').trim(),
  securityAnswer1: yup.string().required('Security answer is required').trim(),
  securityQuestion2: yup.string().required('Security question is required').trim(),
  securityAnswer2: yup
    .string()
    .required('Security answer is required')
    .notOneOf([yup.ref('securityAnswer1')], 'Security answers must be different')
    .trim(),
  twoFactorEnabled: yup.boolean().required('Two-factor authentication option is required'),
  backupEmail: yup.string().email('Please enter a valid email address').trim(),
  backupPhone: yup
    .string()
    .matches(
      /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/,
      'Please enter a valid phone number'
    )
    .trim(),
});

// Contact Preferences validation schema
export const contactPreferencesSchema = yup.object().shape({
  preferredContactMethod: yup
    .string()
    .oneOf(['email', 'sms', 'phone'], 'Please select a valid contact method')
    .required('Contact method is required'),
  newsletterSubscription: yup.boolean().required('Please select an option'),
  marketingPreferences: yup.object().shape({
    productUpdates: yup.boolean().required('Please select an option'),
    promotions: yup.boolean().required('Please select an option'),
    events: yup.boolean().required('Please select an option'),
  }),
});

// Demographic Info validation schema (optional)
export const demographicInfoSchema = yup.object().shape({
  nationality: yup.string().trim(),
  ethnicity: yup.string().trim(),
  maritalStatus: yup.string().trim(),
  employmentStatus: yup.string().trim(),
  educationLevel: yup.string().trim(),
  incomeRange: yup.string().trim(),
});

// Professional Info validation schema (optional)
export const professionalInfoSchema = yup.object().shape({
  jobTitle: yup.string().trim(),
  companyName: yup.string().trim(),
  industry: yup.string().trim(),
  workEmail: yup.string().email('Please enter a valid email address').trim(),
  linkedInProfile: yup
    .string()
    .matches(
      /^(https?:\/\/)?(www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+\/?$/,
      'Please enter a valid LinkedIn profile URL'
    )
    .trim(),
});

// Account Settings validation schema
export const accountSettingsSchema = yup.object().shape({
  languagePreference: yup.string().required('Language preference is required').trim(),
  timeZone: yup.string().required('Time zone is required').trim(),
  theme: yup
    .string()
    .oneOf(['light', 'dark', 'system'], 'Please select a valid theme')
    .required('Theme preference is required'),
  notificationPreferences: yup.object().shape({
    email: yup.boolean().required('Please select an option'),
    push: yup.boolean().required('Please select an option'),
    sms: yup.boolean().required('Please select an option'),
  }),
});

// Legal Info validation schema
export const legalInfoSchema = yup.object().shape({
  termsAgreed: yup
    .boolean()
    .oneOf([true], 'You must agree to the terms and conditions')
    .required('You must agree to the terms and conditions'),
  privacyPolicyAgreed: yup
    .boolean()
    .oneOf([true], 'You must agree to the privacy policy')
    .required('You must agree to the privacy policy'),
  ageConfirmation: yup
    .boolean()
    .oneOf([true], 'You must confirm that you are over 18')
    .required('You must confirm that you are over 18'),
  dataProcessingConsent: yup
    .boolean()
    .oneOf([true], 'You must provide consent for data processing')
    .required('You must provide consent for data processing'),
});

// Custom Info validation schema (optional)
export const customInfoSchema = yup.object().shape({
  interests: yup.array().of(yup.string()),
  referralCode: yup.string().trim(),
  hearAboutUs: yup.string().trim(),
  userRole: yup.string().trim(),
});

// Login validation schema
export const loginSchema = yup.object().shape({
  email: yup
    .string()
    .required('Email is required')
    .email('Please enter a valid email address')
    .trim(),
  password: yup.string().required('Password is required'),
  rememberMe: yup.boolean()
});

// Forgot Password validation schema
export const forgotPasswordSchema = yup.object().shape({
  email: yup
    .string()
    .required('Email is required')
    .email('Please enter a valid email address')
    .trim(),
});

// Reset Password validation schema
export const resetPasswordSchema = yup.object().shape({
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'
    ),
  confirmPassword: yup
    .string()
    .required('Please confirm your password')
    .oneOf([yup.ref('password')], 'Passwords must match'),
});





export const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50, "Name must be less than 50 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits").optional().or(z.literal("")),
  subject: z.string().min(5, "Subject must be at least 5 characters").max(100, "Subject must be less than 100 characters"),
  message: z.string().min(10, "Message must be at least 10 characters").max(1000, "Message must be less than 1000 characters"),
})

export type ContactFormData = z.infer<typeof contactFormSchema>

export const loginFormSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters").max(100, "Password must be less than 100 characters"),
  rememberMe: z.boolean().default(false),
})

export type LoginFormData = z.infer<typeof loginFormSchema>

export const forgotPasswordFormSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
})

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordFormSchema>