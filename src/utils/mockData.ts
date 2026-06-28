import { PartnerRole } from '../types';

export const mockBookings = [
  {
    id: 'BK-10293',
    customerName: 'Rahul Sharma',
    service: 'AC Repair & Service',
    address: 'B-142, Sector 15, Noida',
    schedule: 'Today, 2:00 PM',
    distance: '3.2 km',
    price: '₹ 450',
    status: 'Pending', // Pending, Accepted, In Progress, Completed
  },
  {
    id: 'BK-10294',
    customerName: 'Priya Singh',
    service: 'Plumbing (Tap Fix)',
    address: 'Block C, Vasant Kunj, Delhi',
    schedule: 'Tomorrow, 10:00 AM',
    distance: '5.1 km',
    price: '₹ 200',
    status: 'Accepted',
  },
];

export const mockWalletTransactions = [
  { id: 'TX-001', date: '2023-10-15', amount: '+ ₹ 450', type: 'Earnings', status: 'Success' },
  { id: 'TX-002', date: '2023-10-14', amount: '- ₹ 100', type: 'Withdrawal', status: 'Success' },
  { id: 'TX-003', date: '2023-10-12', amount: '+ ₹ 200', type: 'Earnings', status: 'Success' },
];

export const mockEmployees = [
  { id: 'EMP-01', name: 'Amit Kumar', role: 'Professional', status: 'Active', branch: 'Noida Hub' },
  { id: 'EMP-02', name: 'Suresh Das', role: 'BranchManager', status: 'Active', branch: 'Delhi South' },
];

export const mockServicesCatalog = [
  { id: 'CAT-1', category: 'Appliance Repair', services: ['AC Repair', 'Washing Machine', 'Refrigerator'] },
  { id: 'CAT-2', category: 'Home Cleaning', services: ['Deep Cleaning', 'Bathroom Cleaning', 'Sofa Cleaning'] },
];

export const mockBranches = [
  { id: 'BR-1', name: 'Noida Hub', address: 'Sector 62, Noida' },
  { id: 'BR-2', name: 'Delhi South', address: 'Saket, New Delhi' },
];
