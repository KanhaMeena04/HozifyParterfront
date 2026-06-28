import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Branch } from '../types';

interface BranchState {
  branches: Branch[];
  isLoading: boolean;
  initialize: () => Promise<void>;
  addBranch: (branch: Omit<Branch, 'id'>) => Promise<void>;
  updateBranch: (id: string, branch: Partial<Branch>) => Promise<void>;
  deleteBranch: (id: string) => Promise<void>;
}

export const useBranchStore = create<BranchState>((set, get) => ({
  branches: [],
  isLoading: false,

  initialize: async () => {
    try {
      const json = await AsyncStorage.getItem('branches');
      if (json) {
        set({ branches: JSON.parse(json) });
      }
    } catch (e) {
      console.warn('Failed to load branches', e);
    }
  },

  addBranch: async (branchData) => {
    const newBranch: Branch = {
      ...branchData,
      id: Date.now().toString(),
      createdAt: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    };
    const updatedBranches = [...get().branches, newBranch];
    set({ branches: updatedBranches });
    await AsyncStorage.setItem('branches', JSON.stringify(updatedBranches));
  },

  updateBranch: async (id, updatedData) => {
    const updatedBranches = get().branches.map((b) =>
      b.id === id ? { ...b, ...updatedData } : b
    );
    set({ branches: updatedBranches });
    await AsyncStorage.setItem('branches', JSON.stringify(updatedBranches));
  },

  deleteBranch: async (id) => {
    const updatedBranches = get().branches.filter((b) => b.id !== id);
    set({ branches: updatedBranches });
    await AsyncStorage.setItem('branches', JSON.stringify(updatedBranches));
  },
}));
