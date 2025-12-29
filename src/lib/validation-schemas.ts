import { parse, isValid } from "date-fns";
import { z } from "zod";

// Helper to validate dates
const parseDateString = (value: any, originalValue: any) => {
  if (typeof originalValue !== "string" || !originalValue) return null;
  const parsedDate = parse(originalValue, "yyyy-MM-dd", new Date());
  if (!isValid(parsedDate)) return new Date("");
  return parsedDate;
};

/* -------------------------------------------------
   Helpers
--------------------------------------------------*/
const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

/* -------------------------------------------------
   Basic Info
--------------------------------------------------*/
export const basicInfoSchema = z
  .object({
    firstName: z.string().trim().min(1, "First name is required"),
    middleName: z.string().trim().optional(),
    lastName: z.string().trim().min(1, "Last name is required"),

    username: z
      .string()
      .trim()
      .min(3, "Username must be at least 3 characters")
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "Username can only contain letters, numbers and underscore"
      ),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        passwordRegex,
        "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character"
      ),

    confirmPassword: z.string(),

    email: z.string().trim().email("Please enter a valid email address"),

    phone: z
      .string()
      .trim()
      .regex(phoneRegex, "Please enter a valid phone number"),

    dateOfBirth: z.string().min(1, "Date of birth is required"),

    gender: z.string().min(1, "Gender is required"),

    profilePicture: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

/* -------------------------------------------------
   Address Info
--------------------------------------------------*/
export const addressInfoSchema = z.object({
  streetAddress: z.string().trim().min(1, "Street address is required"),
  city: z.string().trim().min(1, "City is required"),
  state: z.string().trim().min(1, "State is required"),
  zipCode: z
    .string()
    .trim()
    .regex(/^[0-9]{5}(-[0-9]{4})?$/, "Please enter a valid zip code"),
  country: z.string().trim().min(1, "Country is required"),
});

/* -------------------------------------------------
   Security Info
--------------------------------------------------*/
export const securityInfoSchema = z
  .object({
    securityQuestion1: z
      .string()
      .trim()
      .min(1, "Security question is required"),
    securityAnswer1: z.string().trim().min(1, "Security answer is required"),

    securityQuestion2: z
      .string()
      .trim()
      .min(1, "Security question is required"),
    securityAnswer2: z.string().trim().min(1, "Security answer is required"),

    twoFactorEnabled: z.boolean({
      required_error: "Two-factor authentication option is required",
    }),

    backupEmail: z
      .string()
      .trim()
      .email("Please enter a valid email address")
      .optional(),

    backupPhone: z
      .string()
      .trim()
      .regex(phoneRegex, "Please enter a valid phone number")
      .optional(),
  })
  .refine((data) => data.securityAnswer1 !== data.securityAnswer2, {
    message: "Security answers must be different",
    path: ["securityAnswer2"],
  });

/* -------------------------------------------------
   Contact Preferences
--------------------------------------------------*/
export const contactPreferencesSchema = z.object({
  preferredContactMethod: z.enum(["email", "sms", "phone"], {
    required_error: "Contact method is required",
  }),

  newsletterSubscription: z.boolean({
    required_error: "Please select an option",
  }),

  marketingPreferences: z.object({
    productUpdates: z.boolean({
      required_error: "Please select an option",
    }),
    promotions: z.boolean({
      required_error: "Please select an option",
    }),
    events: z.boolean({
      required_error: "Please select an option",
    }),
  }),
});

/* -------------------------------------------------
   Demographic Info (Optional)
--------------------------------------------------*/
export const demographicInfoSchema = z.object({
  nationality: z.string().trim().optional(),
  ethnicity: z.string().trim().optional(),
  maritalStatus: z.string().trim().optional(),
  employmentStatus: z.string().trim().optional(),
  educationLevel: z.string().trim().optional(),
  incomeRange: z.string().trim().optional(),
});

/* -------------------------------------------------
   Professional Info (Optional)
--------------------------------------------------*/
export const professionalInfoSchema = z.object({
  jobTitle: z.string().trim().optional(),
  companyName: z.string().trim().optional(),
  industry: z.string().trim().optional(),
  workEmail: z
    .string()
    .email("Please enter a valid email address")
    .trim()
    .optional(),

  linkedInProfile: z
    .string()
    .trim()
    .regex(
      /^(https?:\/\/)?(www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+\/?$/,
      "Please enter a valid LinkedIn profile URL"
    )
    .optional(),
});

/* -------------------------------------------------
   Account Settings
--------------------------------------------------*/
export const accountSettingsSchema = z.object({
  languagePreference: z
    .string()
    .trim()
    .min(1, "Language preference is required"),
  timeZone: z.string().trim().min(1, "Time zone is required"),

  theme: z.enum(["light", "dark", "system"], {
    required_error: "Theme preference is required",
  }),

  notificationPreferences: z.object({
    email: z.boolean({ required_error: "Please select an option" }),
    push: z.boolean({ required_error: "Please select an option" }),
    sms: z.boolean({ required_error: "Please select an option" }),
  }),
});

/* -------------------------------------------------
   Legal Info
--------------------------------------------------*/
export const legalInfoSchema = z.object({
  termsAgreed: z.literal(true, {
    errorMap: () => ({
      message: "You must agree to the terms and conditions",
    }),
  }),

  privacyPolicyAgreed: z.literal(true, {
    errorMap: () => ({
      message: "You must agree to the privacy policy",
    }),
  }),

  ageConfirmation: z.literal(true, {
    errorMap: () => ({
      message: "You must confirm that you are over 18",
    }),
  }),

  dataProcessingConsent: z.literal(true, {
    errorMap: () => ({
      message: "You must provide consent for data processing",
    }),
  }),
});

/* -------------------------------------------------
   Custom Info (Optional)
--------------------------------------------------*/
export const customInfoSchema = z.object({
  interests: z.array(z.string()).optional(),
  referralCode: z.string().trim().optional(),
  hearAboutUs: z.string().trim().optional(),
  userRole: z.string().trim().optional(),
});

/* -------------------------------------------------
   Login
--------------------------------------------------*/
export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional(),
});

/* -------------------------------------------------
   Forgot Password
--------------------------------------------------*/
export const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

/* -------------------------------------------------
   Reset Password
--------------------------------------------------*/
export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        passwordRegex,
        "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character"
      ),

    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

export const resetPasswordFormSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
      ),
    confirmPassword: z.string().min(8, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type ResetPasswordFormData = z.infer<typeof resetPasswordFormSchema>;

export const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .optional()
    .or(z.literal("")),
  subject: z
    .string()
    .min(5, "Subject must be at least 5 characters")
    .max(100, "Subject must be less than 100 characters"),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(1000, "Message must be less than 1000 characters"),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

export const loginFormSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password must be less than 100 characters"),
  rememberMe: z.boolean().default(false),
});

export type LoginFormData = z.infer<typeof loginFormSchema>;

export const forgotPasswordFormSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordFormSchema>;
