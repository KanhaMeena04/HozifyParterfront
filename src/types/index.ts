export type PartnerRole = 'ISP' | 'BSP' | 'BS' | 'BranchManager' | 'Professional' | null;

export interface User {
  mobileNumber: string;
  name?: string;
  role?: PartnerRole;
}

export interface AuthState {
  isAuthenticated: boolean;
  mobileNumber: string;
  otpSent: boolean;
  isLoading: boolean;
  error: string | null;
  role: PartnerRole;
  isOnDuty: boolean;
  liveBookingMode: boolean;
  initialize: () => Promise<void>;
  sendOtp: (phone: string) => Promise<boolean>;
  verifyOtp: (otp: string) => Promise<boolean>;
  setRole: (role: PartnerRole) => void;
  setIsOnDuty: (isOnDuty: boolean) => void;
  setLiveBookingMode: (mode: boolean) => void;
  logout: () => void;
  clearError: () => void;
  _persist: (state: AuthState) => Promise<void>;
}


export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

export * from './branch';
export * from './employee';
