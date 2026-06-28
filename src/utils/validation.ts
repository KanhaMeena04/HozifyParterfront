import { REGEX } from '../constants';

// Map of common calling codes to check
export const CALLING_CODE_MAP: Record<string, string> = {
  '91': 'IN',
  '1': 'US',
  '44': 'GB',
  '971': 'AE',
  '65': 'SG',
  '61': 'AU',
  '966': 'SA',
  '974': 'QA',
  '968': 'OM',
  '965': 'KW',
  '973': 'BH',
  '880': 'BD',
  '977': 'NP',
  '94': 'LK',
};

export function parsePhoneNumber(fullNumber: string): { callingCode: string; localNumber: string } {
  if (!fullNumber || !fullNumber.startsWith('+')) {
    const cleanNum = (fullNumber || '').replace(/[^0-9]/g, '');
    return { callingCode: '91', localNumber: cleanNum };
  }

  const digits = fullNumber.slice(1).replace(/[^0-9]/g, '');

  for (let len = 3; len >= 1; len--) {
    const code = digits.slice(0, len);
    if (CALLING_CODE_MAP[code]) {
      return {
        callingCode: code,
        localNumber: digits.slice(len),
      };
    }
  }

  if (digits.startsWith('1')) {
    return { callingCode: '1', localNumber: digits.slice(1) };
  }

  return { callingCode: '91', localNumber: digits };
}

/**
 * Removes all non-digit characters from a string and keeps/formats country prefix
 */
export const cleanPhoneNumber = (phone: string): string => {
  const { callingCode, localNumber } = parsePhoneNumber(phone);
  const cleanedLocal = localNumber.slice(0, 10);
  return `+${callingCode}${cleanedLocal}`;
};

/**
 * Formats phone number into 'XXXXX XXXXX' format
 */
export const formatPhoneNumber = (phone: string): string => {
  const { localNumber } = parsePhoneNumber(phone);
  const digits = localNumber.slice(0, 10);
  if (digits.length <= 5) {
    return digits;
  }
  return `${digits.slice(0, 5)} ${digits.slice(5)}`;
};

/**
 * Validates whether the phone number is a valid 10-digit mobile number
 */
export const validatePhone = (phone: string): boolean => {
  const { localNumber } = parsePhoneNumber(phone);
  return /^[5-9]\d{9}$/.test(localNumber);
};

/**
 * Validates a 6-digit OTP code
 */
export const validateOtp = (otp: string): boolean => {
  const cleaned = otp.replace(/\D/g, '').slice(0, 6);
  return REGEX.OTP.test(cleaned);
};
