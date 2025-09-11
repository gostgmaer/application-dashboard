// User types
export interface UserBasicInfo {
  firstName: string;
  middleName?: string;
  lastName: string;
  username: string;
  password: string;
  confirmPassword: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  profilePicture?: string;
}

export interface UserAddressInfo {
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface UserSecurityInfo {
  securityQuestion1: string;
  securityAnswer1: string;
  securityQuestion2: string;
  securityAnswer2: string;
  twoFactorEnabled: boolean;
  backupEmail?: string;
  backupPhone?: string;
}

export interface UserContactPreferences {
  preferredContactMethod: 'email' | 'sms' | 'phone';
  newsletterSubscription: boolean;
  marketingPreferences: {
    productUpdates: boolean;
    promotions: boolean;
    events: boolean;
  };
}

export interface UserDemographicInfo {
  nationality?: string;
  ethnicity?: string;
  maritalStatus?: string;
  employmentStatus?: string;
  educationLevel?: string;
  incomeRange?: string;
}

export interface UserProfessionalInfo {
  jobTitle?: string;
  companyName?: string;
  industry?: string;
  workEmail?: string;
  linkedInProfile?: string;
}

export interface UserAccountSettings {
  languagePreference: string;
  timeZone: string;
  theme: 'light' | 'dark' | 'system';
  notificationPreferences: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
}

export interface UserLegalInfo {
  termsAgreed: boolean;
  privacyPolicyAgreed: boolean;
  ageConfirmation: boolean;
  dataProcessingConsent: boolean;
}

export interface UserCustomInfo {
  interests?: string[];
  referralCode?: string;
  hearAboutUs?: string;
  userRole?: string;
}

export interface UserRegistrationData {
  basicInfo: UserBasicInfo;
  addressInfo: UserAddressInfo;
  securityInfo: UserSecurityInfo;
  contactPreferences: UserContactPreferences;
  demographicInfo?: UserDemographicInfo;
  professionalInfo?: UserProfessionalInfo;
  accountSettings: UserAccountSettings;
  legalInfo: UserLegalInfo;
  customInfo?: UserCustomInfo;
}

export type RegistrationStep = 
  | 'basicInfo' 
  | 'addressInfo' 
  | 'securityInfo' 
  | 'contactPreferences' 
  | 'demographicInfo'
  | 'professionalInfo'
  | 'accountSettings'
  | 'legalInfo'
  | 'customInfo'
  | 'review';

// Theme types
export type Theme = 'dark' | 'light' | 'system';