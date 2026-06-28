import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthState } from '../types';
import { authService } from '../services/authService';
import { cleanPhoneNumber } from '../utils/validation';
import { StorageService } from '../services/storage.service';

export const useAuthStore = create<AuthState>((set, get) => ({
  isAuthenticated: false,
  mobileNumber: '',
  otpSent: false,
  isLoading: false,
  error: null,
  role: null,

  isOnDuty: false,
  liveBookingMode: false,

  // Load persisted state from AsyncStorage
  initialize: async () => {
    try {
      const json = await AsyncStorage.getItem('authState');
      if (json) {
        const persisted = JSON.parse(json);
        set({
          isAuthenticated: persisted.isAuthenticated ?? false,
          mobileNumber: persisted.mobileNumber ?? '',
          otpSent: persisted.otpSent ?? false,
          role: persisted.role ?? null,
          isOnDuty: persisted.isOnDuty ?? false,
        });
      }
    } catch (e) {
      console.warn('Failed to load auth state', e);
    }
  },

  // Persist relevant fields after any change
  _persist: async (state) => {
    try {
      await AsyncStorage.setItem(
        'authState',
        JSON.stringify({
          isAuthenticated: state.isAuthenticated,
          mobileNumber: state.mobileNumber,
          otpSent: state.otpSent,
          role: state.role,
        })
      );
    } catch (e) {
      console.warn('Failed to persist auth state', e);
    }
  },

  sendOtp: async (phone: string) => {
    const cleaned = cleanPhoneNumber(phone);
    set({ isLoading: true, error: null });
    try {
      const response = await authService.sendOtp(cleaned);
      if (response.success) {
        set({ otpSent: true, mobileNumber: cleaned, isLoading: false });
        get()._persist(get());
        return true;
      } else {
        set({ error: response.message || 'Failed to send OTP', isLoading: false });
        get()._persist(get());
        return false;
      }
    } catch (err) {
      set({ error: 'An unexpected error occurred. Please try again.', isLoading: false });
      get()._persist(get());
      return false;
    }
  },

  verifyOtp: async (otp: string) => {
    const phone = get().mobileNumber;
    set({ isLoading: true, error: null });
    try {
      const response = await authService.verifyOtp(phone, otp);
      if (response.success) {
        set({ isAuthenticated: true, isLoading: false });
        get()._persist(get());
        return true;
      } else {
        set({ error: response.message || 'Verification failed', isLoading: false });
        get()._persist(get());
        return false;
      }
    } catch (err) {
      set({ error: 'An unexpected error occurred. Please try again.', isLoading: false });
      get()._persist(get());
      return false;
    }
  },

  logout: async () => {
    set({ isAuthenticated: false, mobileNumber: '', otpSent: false, error: null, role: null });
    await get()._persist(get());
    await StorageService.clearSession();
  },

  setRole: (role) => {
    set({ role });
    get()._persist(get());
  },

  setIsOnDuty: (isOnDuty) => {
    set({ isOnDuty });
    get()._persist(get());
  },

  setLiveBookingMode: (liveBookingMode) => {
    set({ liveBookingMode });
  },

  clearError: () => {
    set({ error: null });
  },
}));
