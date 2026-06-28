export interface Employee {
  id: string;
  name: string;
  branchName: string;
  role: string;
  mainService: string;
  subService: string;
  experience: string;
  mobileNumber: string;
  email?: string;
  address?: string;
  isActive: boolean;
  createdAt?: string;
  totalEarning?: string;
  remainingEarning?: string;
}
