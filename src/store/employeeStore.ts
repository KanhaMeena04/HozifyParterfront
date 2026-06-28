import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Employee } from '../types';

interface EmployeeState {
  employees: Employee[];
  isLoading: boolean;
  initialize: () => Promise<void>;
  addEmployee: (employee: Omit<Employee, 'id'>) => Promise<void>;
  updateEmployee: (id: string, employee: Partial<Employee>) => Promise<void>;
  deleteEmployee: (id: string) => Promise<void>;
}

export const useEmployeeStore = create<EmployeeState>((set, get) => ({
  employees: [],
  isLoading: false,

  initialize: async () => {
    try {
      const json = await AsyncStorage.getItem('employees');
      if (json) {
        let parsed: Employee[] = JSON.parse(json);
        let updated = false;

        const earningsMap: Record<string, { total: string; remaining: string }> = {
          EMP1: { total: '₹18,500.00', remaining: '₹4,250.00' },
          EMP2: { total: '₹15,200.00', remaining: '₹3,100.00' },
          EMP3: { total: '₹12,400.00', remaining: '₹2,800.00' },
        };

        parsed = parsed.map(emp => {
          let empUpdated = false;
          let newEmp = { ...emp };

          if (!newEmp.totalEarning) {
            newEmp.totalEarning = earningsMap[newEmp.id]?.total || '₹6,400.00';
            empUpdated = true;
          }
          if (!newEmp.remainingEarning) {
            newEmp.remainingEarning = earningsMap[newEmp.id]?.remaining || '₹1,200.00';
            empUpdated = true;
          }
          if (empUpdated) {
            updated = true;
          }
          return newEmp;
        });

        if (updated) {
          await AsyncStorage.setItem('employees', JSON.stringify(parsed));
        }

        set({ employees: parsed });
      } else {
        const defaultEmployees: Employee[] = [
          { 
            id: 'EMP1', 
            name: 'Rahul Kumar', 
            branchName: 'Noida Sector 62 Branch', 
            role: 'Professional', 
            mainService: 'AC Repair', 
            subService: 'Split AC Servicing', 
            experience: '5 years', 
            mobileNumber: '9876543215', 
            isActive: true,
            createdAt: '08 May 2024',
            totalEarning: '₹18,500.00',
            remainingEarning: '₹4,250.00'
          },
          { 
            id: 'EMP2', 
            name: 'Pankaj Singh', 
            branchName: 'Noida Sector 62 Branch', 
            role: 'Professional', 
            mainService: 'Water Purifier Repair', 
            subService: 'RO Installation', 
            experience: '4 years', 
            mobileNumber: '9876543216', 
            isActive: true,
            createdAt: '08 May 2024',
            totalEarning: '₹15,200.00',
            remainingEarning: '₹3,100.00'
          },
          { 
            id: 'EMP3', 
            name: 'Aman Verma', 
            branchName: 'Noida Sector 62 Branch', 
            role: 'Professional', 
            mainService: 'Washing Machine Repair', 
            subService: 'Fully Automatic Top Load Repair', 
            experience: '3 years', 
            mobileNumber: '9876543217', 
            isActive: true,
            createdAt: '08 May 2024',
            totalEarning: '₹12,400.00',
            remainingEarning: '₹2,800.00'
          }
        ];
        set({ employees: defaultEmployees });
        await AsyncStorage.setItem('employees', JSON.stringify(defaultEmployees));
      }
    } catch (e) {
      console.warn('Failed to load employees', e);
    }
  },

  addEmployee: async (employeeData) => {
    const newEmployee: Employee = {
      ...employeeData,
      id: Date.now().toString(),
      createdAt: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      totalEarning: '₹0.00',
      remainingEarning: '₹0.00',
    };
    const updatedEmployees = [...get().employees, newEmployee];
    set({ employees: updatedEmployees });
    await AsyncStorage.setItem('employees', JSON.stringify(updatedEmployees));
  },

  updateEmployee: async (id, updatedData) => {
    const updatedEmployees = get().employees.map((e) =>
      e.id === id ? { ...e, ...updatedData } : e
    );
    set({ employees: updatedEmployees });
    await AsyncStorage.setItem('employees', JSON.stringify(updatedEmployees));
  },

  deleteEmployee: async (id) => {
    const updatedEmployees = get().employees.filter((e) => e.id !== id);
    set({ employees: updatedEmployees });
    await AsyncStorage.setItem('employees', JSON.stringify(updatedEmployees));
  },
}));
