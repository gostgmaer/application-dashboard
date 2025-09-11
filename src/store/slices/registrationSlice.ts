import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { UserRegistrationData, RegistrationStep } from '@/types';

const INITIAL_USER_DATA: UserRegistrationData = {
  basicInfo: {
    firstName: '',
    middleName: '',
    lastName: '',
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    profilePicture: '',
  },
  addressInfo: {
    streetAddress: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
  },
  securityInfo: {
    securityQuestion1: '',
    securityAnswer1: '',
    securityQuestion2: '',
    securityAnswer2: '',
    twoFactorEnabled: false,
    backupEmail: '',
    backupPhone: '',
  },
  contactPreferences: {
    preferredContactMethod: 'email',
    newsletterSubscription: false,
    marketingPreferences: {
      productUpdates: false,
      promotions: false,
      events: false,
    },
  },
  demographicInfo: {
    nationality: '',
    ethnicity: '',
    maritalStatus: '',
    employmentStatus: '',
    educationLevel: '',
    incomeRange: '',
  },
  professionalInfo: {
    jobTitle: '',
    companyName: '',
    industry: '',
    workEmail: '',
    linkedInProfile: '',
  },
  accountSettings: {
    languagePreference: 'en',
    timeZone: 'UTC-05:00',
    theme: 'system',
    notificationPreferences: {
      email: true,
      push: false,
      sms: false,
    },
  },
  legalInfo: {
    termsAgreed: false,
    privacyPolicyAgreed: false,
    ageConfirmation: false,
    dataProcessingConsent: false,
  },
  customInfo: {
    interests: [],
    referralCode: '',
    hearAboutUs: '',
    userRole: 'User',
  },
};

interface RegistrationState {
  userData: UserRegistrationData;
  currentStep: RegistrationStep;
  isLoading: boolean;
  error: string | null;
  isCompleted: boolean;
}

const initialState: RegistrationState = {
  userData: INITIAL_USER_DATA,
  currentStep: 'basicInfo',
  isLoading: false,
  error: null,
  isCompleted: false,
};

export const registrationSlice = createSlice({
  name: 'registration',
  initialState,
  reducers: {
    updateBasicInfo: (state, action: PayloadAction<Partial<UserRegistrationData['basicInfo']>>) => {
      state.userData.basicInfo = { ...state.userData.basicInfo, ...action.payload };
    },
    updateAddressInfo: (state, action: PayloadAction<Partial<UserRegistrationData['addressInfo']>>) => {
      state.userData.addressInfo = { ...state.userData.addressInfo, ...action.payload };
    },
    updateSecurityInfo: (state, action: PayloadAction<Partial<UserRegistrationData['securityInfo']>>) => {
      state.userData.securityInfo = { ...state.userData.securityInfo, ...action.payload };
    },
    updateContactPreferences: (state, action: PayloadAction<Partial<UserRegistrationData['contactPreferences']>>) => {
      state.userData.contactPreferences = { ...state.userData.contactPreferences, ...action.payload };
    },
    updateDemographicInfo: (state, action: PayloadAction<Partial<UserRegistrationData['demographicInfo']>>) => {
      state.userData.demographicInfo = { ...state.userData.demographicInfo, ...action.payload };
    },
    updateProfessionalInfo: (state, action: PayloadAction<Partial<UserRegistrationData['professionalInfo']>>) => {
      state.userData.professionalInfo = { ...state.userData.professionalInfo, ...action.payload };
    },
    updateAccountSettings: (state, action: PayloadAction<Partial<UserRegistrationData['accountSettings']>>) => {
      state.userData.accountSettings = { ...state.userData.accountSettings, ...action.payload };
    },
    updateLegalInfo: (state, action: PayloadAction<Partial<UserRegistrationData['legalInfo']>>) => {
      state.userData.legalInfo = { ...state.userData.legalInfo, ...action.payload };
    },
    updateCustomInfo: (state, action: PayloadAction<Partial<UserRegistrationData['customInfo']>>) => {
      state.userData.customInfo = { ...state.userData.customInfo, ...action.payload };
    },
    setCurrentStep: (state, action: PayloadAction<RegistrationStep>) => {
      state.currentStep = action.payload;
    },
    nextStep: (state) => {
      const steps: RegistrationStep[] = [
        'basicInfo',
        'addressInfo',
        'securityInfo',
        'contactPreferences',
        'demographicInfo',
        'professionalInfo',
        'accountSettings',
        'legalInfo',
        'customInfo',
        'review',
      ];
      const currentIndex = steps.indexOf(state.currentStep);
      if (currentIndex < steps.length - 1) {
        state.currentStep = steps[currentIndex + 1];
      }
    },
    prevStep: (state) => {
      const steps: RegistrationStep[] = [
        'basicInfo',
        'addressInfo',
        'securityInfo',
        'contactPreferences',
        'demographicInfo',
        'professionalInfo',
        'accountSettings',
        'legalInfo',
        'customInfo',
        'review',
      ];
      const currentIndex = steps.indexOf(state.currentStep);
      if (currentIndex > 0) {
        state.currentStep = steps[currentIndex - 1];
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    completeRegistration: (state) => {
      state.isCompleted = true;
    },
    resetRegistration: (state) => {
      return initialState;
    },
  },
});

export const {
  updateBasicInfo,
  updateAddressInfo,
  updateSecurityInfo,
  updateContactPreferences,
  updateDemographicInfo,
  updateProfessionalInfo,
  updateAccountSettings,
  updateLegalInfo,
  updateCustomInfo,
  setCurrentStep,
  nextStep,
  prevStep,
  setLoading,
  setError,
  completeRegistration,
  resetRegistration,
} = registrationSlice.actions;

export default registrationSlice.reducer;