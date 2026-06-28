import { PartnerRole } from './index';

export interface UserSession {
  phone: string;
  role: PartnerRole | 'APP_ADMIN';
  isLoggedIn: boolean;
  isApproved: boolean;
}

export type FlowStatus = 'yet_to_start' | 'reviewing' | 'completed' | 'verified' | 'rejected';

export interface MandatoryFlow {
  partnerProfile: FlowStatus;
  businessProfile: FlowStatus;
  kycUpload: FlowStatus;
  businessDocumentUpload: FlowStatus;
  branchCreation: FlowStatus;
  partnerServiceSelection: FlowStatus;
  serviceBranchMapping: FlowStatus;
  branchEmployeeMapping: FlowStatus;
  addingEmployee: FlowStatus;
  partnerServiceAreaCreation: FlowStatus;
  termsAndConditions: FlowStatus;
  policies: FlowStatus;
}

export interface PartnerProfile {
  firstName?: string;
  lastName?: string;
  email?: string;
  useWhatsApp?: boolean;
  dob?: string;
  gender?: string;
  businessName?: string;
  address?: string;
  country?: string;
  state?: string;
  district?: string;
  city?: string;
  pincode?: string;
  profilePhoto?: string;
}

export interface KycStatus {
  status: string;
  documents: any[];
}

export interface BusinessProfile {
  status: string;
  details?: any;
}

export interface Booking {
  bookingId: string;
  userId: string;
  serviceId: string;
  branchId?: string;
  employeeId?: string;
  profAccepted?: boolean;
  status: "pending" | "accepted" | "on_the_way" | "denied" | "checked_in" | "started" | "completed" | "closed";
  paymentStatus: "paid" | "unpaid";
  paymentMethod: "online" | "cash" | null;
  paymentLinkGenerated: boolean;
  checkInCode: string;
  completionOtp: string;
  scheduledTime: string;
  location: string;
  serviceRadius: number;
}

export interface WalletTransaction {
  id: string;
  amount: number;
  type: "credit" | "debit";
  date: string;
  description: string;
}

export interface Wallet {
  balance: number;
  transactions: WalletTransaction[];
}
