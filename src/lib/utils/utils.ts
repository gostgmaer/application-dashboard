import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();
}

export const countries = [
  'United States',
  'Canada',
  'United Kingdom',
  'Australia',
  'Germany',
  'France',
  'Japan',
  'China',
  'India',
  'Brazil',
];

export const languages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ar', name: 'Arabic' },
  { code: 'hi', name: 'Hindi' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ru', name: 'Russian' },
];

export const timezones = [
  { value: 'UTC-12:00', label: '(UTC-12:00) International Date Line West' },
  { value: 'UTC-11:00', label: '(UTC-11:00) Samoa, Midway Island' },
  { value: 'UTC-10:00', label: '(UTC-10:00) Hawaii' },
  { value: 'UTC-09:00', label: '(UTC-09:00) Alaska' },
  { value: 'UTC-08:00', label: '(UTC-08:00) Pacific Time (US & Canada)' },
  { value: 'UTC-07:00', label: '(UTC-07:00) Mountain Time (US & Canada)' },
  { value: 'UTC-06:00', label: '(UTC-06:00) Central Time (US & Canada)' },
  { value: 'UTC-05:00', label: '(UTC-05:00) Eastern Time (US & Canada)' },
  { value: 'UTC-04:00', label: '(UTC-04:00) Atlantic Time (Canada)' },
  { value: 'UTC-03:00', label: '(UTC-03:00) Brasilia, Buenos Aires' },
  { value: 'UTC-02:00', label: '(UTC-02:00) Mid-Atlantic' },
  { value: 'UTC-01:00', label: '(UTC-01:00) Azores, Cape Verde Islands' },
  { value: 'UTC+00:00', label: '(UTC+00:00) London, Dublin, Lisbon' },
  { value: 'UTC+01:00', label: '(UTC+01:00) Berlin, Paris, Rome, Madrid' },
  { value: 'UTC+02:00', label: '(UTC+02:00) Athens, Istanbul, Cairo' },
  { value: 'UTC+03:00', label: '(UTC+03:00) Moscow, Baghdad' },
  { value: 'UTC+04:00', label: '(UTC+04:00) Dubai, Abu Dhabi' },
  { value: 'UTC+05:00', label: '(UTC+05:00) Islamabad, Karachi' },
  { value: 'UTC+05:30', label: '(UTC+05:30) New Delhi, Mumbai' },
  { value: 'UTC+06:00', label: '(UTC+06:00) Dhaka, Almaty' },
  { value: 'UTC+07:00', label: '(UTC+07:00) Bangkok, Jakarta' },
  { value: 'UTC+08:00', label: '(UTC+08:00) Beijing, Hong Kong, Singapore' },
  { value: 'UTC+09:00', label: '(UTC+09:00) Tokyo, Seoul' },
  { value: 'UTC+10:00', label: '(UTC+10:00) Sydney, Melbourne' },
  { value: 'UTC+11:00', label: '(UTC+11:00) Noumea, Solomon Islands' },
  { value: 'UTC+12:00', label: '(UTC+12:00) Auckland, Wellington' },
];

export const securityQuestions = [
  "What was your first pet's name?",
  'What was the name of your first school?',
  "What was your mother's maiden name?",
  'What city were you born in?',
  'What is your favorite book?',
  'What is the name of your favorite teacher?',
  'What was your first car?',
  'What is your favorite movie?',
  'What was your childhood nickname?',
];

export const industries = [
  'Technology',
  'Healthcare',
  'Finance',
  'Education',
  'Retail',
  'Manufacturing',
  'Media & Entertainment',
  'Government',
  'Non-profit',
  'Construction',
  'Transportation',
  'Agriculture',
  'Energy',
  'Hospitality & Tourism',
  'Real Estate',
];

export const educationLevels = [
  'High School',
  'Associate Degree',
  "Bachelor's Degree",
  "Master's Degree",
  'Doctorate',
  'Professional Degree',
  'Trade School',
  'Some College',
  'Other',
];

export const employmentStatuses = [
  'Full-time',
  'Part-time',
  'Self-employed',
  'Freelance',
  'Unemployed',
  'Student',
  'Retired',
  'Homemaker',
];

export const maritalStatuses = [
  'Single',
  'Married',
  'Divorced',
  'Widowed',
  'Separated',
  'Domestic Partnership',
];

export const incomeRanges = [
  'Under $25,000',
  '$25,000 - $49,999',
  '$50,000 - $74,999',
  '$75,000 - $99,999',
  '$100,000 - $149,999',
  '$150,000 - $199,999',
  '$200,000+',
  'Prefer not to say',
];

export const interestCategories = [
  'Technology',
  'Travel',
  'Food',
  'Sports',
  'Music',
  'Arts',
  'Movies',
  'Books',
  'Fashion',
  'Health & Fitness',
  'Photography',
  'Gaming',
  'Science',
  'Nature',
  'Politics',
  'History',
];

export const referralSources = [
  'Search Engine',
  'Social Media',
  'Friend or Family',
  'Advertisement',
  'Blog or Article',
  'Conference or Event',
  'Email Campaign',
  'Other',
];

export const userRoles = ['User', 'Admin', 'Moderator', 'Editor', 'Analyst', 'Guest'];