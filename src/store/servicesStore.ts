import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface SubService {
  id: string;
  name: string;
  yearsOfExperience: string;
  selected: boolean;
}

export interface ServiceCategory {
  id: string;
  name: string;
  active: boolean;
  dateAdded: string;
  subServices: SubService[];
  providerName?: string;
  branchName?: string;
}

interface ServicesState {
  services: ServiceCategory[];
  addService: (service: ServiceCategory) => Promise<void>;
  updateService: (id: string, updatedService: Partial<ServiceCategory>) => void;
  removeService: (id: string) => void;
  loadServices: () => Promise<void>;
  clearServices: () => void;
}

const STORAGE_KEY = '@hozify_services_store';

export const useServicesStore = create<ServicesState>((set, get) => ({
  services: [],

  addService: async (service) => {
    const updatedServices = [...get().services, service];
    set({ services: updatedServices });
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedServices));
  },

  updateService: async (id, updatedService) => {
    const updatedServices = get().services.map(s => s.id === id ? { ...s, ...updatedService } : s);
    set({ services: updatedServices });
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedServices));
  },

  removeService: async (id) => {
    const updatedServices = get().services.filter(s => s.id !== id);
    set({ services: updatedServices });
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedServices));
  },

  loadServices: async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        set({ services: JSON.parse(stored) });
      }
    } catch (e) {
      console.error('Failed to load services', e);
    }
  },

  clearServices: async () => {
    set({ services: [] });
    await AsyncStorage.removeItem(STORAGE_KEY);
  }
}));
