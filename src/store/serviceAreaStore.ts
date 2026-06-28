import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface ServiceArea {
  id: string;
  branchName?: string;
  providerName?: string;
  distance: string;
  placeName: string;
  country: string;
  state: string;
  district: string;
  city: string;
  locationType: 'Urban' | 'Rural';
  status: 'Active' | 'Inactive';
  dateAdded: string;
}

interface ServiceAreaState {
  areas: ServiceArea[];
  loadAreas: () => Promise<void>;
  addArea: (area: ServiceArea) => Promise<void>;
  updateArea: (id: string, data: Partial<ServiceArea>) => Promise<void>;
  removeArea: (id: string) => Promise<void>;
}

const STORAGE_KEY = '@hozify_service_areas';

export const useServiceAreaStore = create<ServiceAreaState>((set, get) => ({
  areas: [],

  loadAreas: async () => {
    try {
      const json = await AsyncStorage.getItem(STORAGE_KEY);
      if (json) set({ areas: JSON.parse(json) });
    } catch (e) {
      console.error('Failed to load service areas', e);
    }
  },

  addArea: async (area) => {
    const updated = [...get().areas, area];
    set({ areas: updated });
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  },

  updateArea: async (id, data) => {
    const updated = get().areas.map(a => a.id === id ? { ...a, ...data } : a);
    set({ areas: updated });
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  },

  removeArea: async (id) => {
    const updated = get().areas.filter(a => a.id !== id);
    set({ areas: updated });
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  },
}));
