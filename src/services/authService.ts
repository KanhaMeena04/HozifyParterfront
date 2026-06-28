import { ApiResponse, User } from '../types';
import { APP_CONSTANTS } from '../constants';
import { validatePhone, validateOtp, cleanPhoneNumber } from '../utils/validation';

export const authService = {
  /**
   * Simulates sending an OTP to the given phone number
   */
  sendOtp: async (phone: string): Promise<ApiResponse<null>> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const cleaned = cleanPhoneNumber(phone);
        if (!validatePhone(cleaned)) {
          resolve({
            success: false,
            message: 'Please enter a valid 10-digit mobile number.',
          });
          return;
        }

        // Simulating success
        resolve({
          success: true,
          message: `OTP sent successfully to +91 ${phone}`,
        });
      }, 1000);
    });
  },

  /**
   * Simulates verifying the OTP for the given phone number
   */
  verifyOtp: async (phone: string, otp: string): Promise<ApiResponse<User>> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const cleanedPhone = cleanPhoneNumber(phone);
        const cleanedOtp = otp.replace(/\D/g, '');

        if (!validatePhone(cleanedPhone)) {
          resolve({
            success: false,
            message: 'Invalid phone number context.',
          });
          return;
        }

        if (!validateOtp(cleanedOtp)) {
          resolve({
            success: false,
            message: 'OTP must be a 6-digit numeric code.',
          });
          return;
        }

        // Verify against mock OTP
        if (cleanedOtp === APP_CONSTANTS.MOCK_OTP) {
          resolve({
            success: true,
            data: {
              mobileNumber: cleanedPhone,
              name: 'John Doe',
              role: 'ISP',
            },
            message: 'Verification successful!',
          });
        } else {
          resolve({
            success: false,
            message: 'The OTP you entered is incorrect. Use 123456 for testing.',
          });
        }
      }, 1200);
    });
  },
};
