import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '@/constants/storageKeys';
import { UserSession, MandatoryFlow, PartnerProfile, KycStatus, BusinessProfile, FlowStatus, Booking, Wallet, WalletTransaction } from '@/types/storage.types';

const INITIAL_MANDATORY_FLOW: MandatoryFlow = {
  partnerProfile: 'yet_to_start',
  businessProfile: 'yet_to_start',
  kycUpload: 'yet_to_start',
  businessDocumentUpload: 'yet_to_start',
  branchCreation: 'yet_to_start',
  partnerServiceSelection: 'yet_to_start',
  serviceBranchMapping: 'yet_to_start',
  branchEmployeeMapping: 'yet_to_start',
  addingEmployee: 'yet_to_start',
  partnerServiceAreaCreation: 'yet_to_start',
  termsAndConditions: 'yet_to_start',
  policies: 'yet_to_start',
};

export const StorageService = {
  // Generic methods
  async getItem<T>(key: string): Promise<T | null> {
    try {
      const data = await AsyncStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error(`Error getting item ${key}:`, error);
      return null;
    }
  },

  async setItem<T>(key: string, value: T): Promise<boolean> {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Error setting item ${key}:`, error);
      return false;
    }
  },

  async removeItem(key: string): Promise<boolean> {
    try {
      await AsyncStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing item ${key}:`, error);
      return false;
    }
  },

  // Specific Typed Methods
  async getUserSession(): Promise<UserSession | null> {
    return this.getItem<UserSession>(STORAGE_KEYS.USER_SESSION);
  },

  async setUserSession(session: UserSession): Promise<boolean> {
    return this.setItem<UserSession>(STORAGE_KEYS.USER_SESSION, session);
  },

  async updateUserSession(updates: Partial<UserSession>): Promise<boolean> {
    const current = await this.getUserSession();
    if (current) {
      return this.setUserSession({ ...current, ...updates });
    }
    // If not exists, create with defaults for missing fields if possible
    // Though usually we'd only update an existing session.
    const newSession: UserSession = {
      phone: updates.phone || '',
      role: updates.role || null,
      isLoggedIn: updates.isLoggedIn || false,
      isApproved: updates.isApproved || false,
      ...updates,
    };
    return this.setUserSession(newSession);
  },

  async getMandatoryFlow(): Promise<MandatoryFlow> {
    const data = await this.getItem<MandatoryFlow>(STORAGE_KEYS.MANDATORY_FLOW);
    return data || INITIAL_MANDATORY_FLOW;
  },

  async setMandatoryFlow(flow: MandatoryFlow): Promise<boolean> {
    return this.setItem<MandatoryFlow>(STORAGE_KEYS.MANDATORY_FLOW, flow);
  },

  async updateMandatoryFlowStep(step: keyof MandatoryFlow, status: FlowStatus): Promise<boolean> {
    const current = await this.getMandatoryFlow();
    current[step] = status;
    return this.setMandatoryFlow(current);
  },

  async getPartnerProfile(): Promise<PartnerProfile | null> {
    return this.getItem<PartnerProfile>(STORAGE_KEYS.PARTNER_PROFILE);
  },

  async setPartnerProfile(profile: PartnerProfile): Promise<boolean> {
    return this.setItem<PartnerProfile>(STORAGE_KEYS.PARTNER_PROFILE, profile);
  },

  async getKycStatus(): Promise<KycStatus | null> {
    return this.getItem<KycStatus>(STORAGE_KEYS.KYC_STATUS);
  },

  async setKycStatus(status: KycStatus): Promise<boolean> {
    return this.setItem<KycStatus>(STORAGE_KEYS.KYC_STATUS, status);
  },

  async getBookings(): Promise<Booking[]> {
    const data = await this.getItem<Booking[]>(STORAGE_KEYS.BOOKINGS);
    return data || [];
  },

  async saveBooking(booking: Booking): Promise<boolean> {
    const bookings = await this.getBookings();
    const existingIndex = bookings.findIndex(b => b.bookingId === booking.bookingId);
    if (existingIndex > -1) {
      bookings[existingIndex] = booking;
    } else {
      bookings.push(booking);
    }
    return this.setItem<Booking[]>(STORAGE_KEYS.BOOKINGS, bookings);
  },

  async getWallet(): Promise<Wallet> {
    const data = await this.getItem<Wallet>(STORAGE_KEYS.WALLET);
    return data || { balance: 0, transactions: [] };
  },

  async addWalletTransaction(amount: number, description: string): Promise<boolean> {
    const wallet = await this.getWallet();
    const transaction: WalletTransaction = {
      id: Math.random().toString(36).substr(2, 9),
      amount,
      type: 'credit',
      date: new Date().toISOString(),
      description
    };
    wallet.balance += amount;
    wallet.transactions.unshift(transaction);
    return this.setItem<Wallet>(STORAGE_KEYS.WALLET, wallet);
  },

  async getMaterialRequests(): Promise<any[]> {
    const data = await this.getItem<any[]>('MATERIAL_REQUESTS');
    return data || [];
  },

  async saveMaterialRequest(request: any): Promise<boolean> {
    const requests = await this.getMaterialRequests();
    const existingIndex = requests.findIndex(r => r.requestId === request.requestId);
    if (existingIndex > -1) {
      requests[existingIndex] = request;
    } else {
      requests.push(request);
    }
    return this.setItem<any[]>('MATERIAL_REQUESTS', requests);
  },

  async clearSession(): Promise<void> {
    try {
      const keys = Object.values(STORAGE_KEYS);
      await AsyncStorage.multiRemove(keys);
      await AsyncStorage.multiRemove(['authState', 'docState', 'flowState', 'MATERIAL_REQUESTS']);
    } catch (error) {
      console.error('Error clearing session storage:', error);
    }
  }
};
