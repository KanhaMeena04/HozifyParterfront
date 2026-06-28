export const APP_CONSTANTS = {
  APP_NAME: 'Hozify Partner',
  SUPPORT_PHONE: '+91 99999 88888',
  SUPPORT_EMAIL: 'support@hozify.in',
  TERMS_URL: 'https://hozify.in/terms',
  PRIVACY_URL: 'https://hozify.in/privacy',
  MOCK_OTP: '123456', // Mock OTP for testing
};

export const REGEX = {
  // Checks if the phone number starts with 6-9 and has exactly 10 digits
  PHONE_INDIAN: /^[6-9]\d{9}$/,
  OTP: /^\d{6}$/,
};

export const COLORS = {
  primary: 'rgba(26, 15, 163, 1.00)', // Royal deep blue for Next button
  accent: '#FF763B', // Orange color from Hozify logo
  accentGradient: {
    start: '#FF5E3A', // Help button start orange
    end: '#FFAE33', // Help button end yellow
  },
  gradientBackgroundStops: {
    blue: '#A5C9FF',
    yellowGreen: '#E2F4C5',
    green: '#A8E6CF',
    orange: '#FF763B',
  },
  text: {
    primary: '#0F172A', // Slate 900
    secondary: '#475569', // Slate 600
    placeholder: '#94A3B8', // Slate 400
    error: '#EF4444', // Red 500
  },
  border: '#E2E8F0', // Slate 200
  white: '#FFFFFF',
};
