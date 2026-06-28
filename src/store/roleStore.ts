import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PartnerRole } from '../types';

interface RoleState {
  activeRole: PartnerRole;
  setActiveRole: (role: PartnerRole) => void;
  initialize: () => Promise<void>;
  _persist: (state: RoleState) => Promise<void>;
}

export const useRoleStore = create<RoleState>((set, get) => ({
  activeRole: null,
  setActiveRole: (role: PartnerRole) => {
    set({ activeRole: role });
    get()._persist(get());
  },
  initialize: async () => {
    try {
      const json = await AsyncStorage.getItem('roleState');
      if (json) {
        const persisted = JSON.parse(json);
        set({ activeRole: persisted.activeRole ?? null });
      }
    } catch (e) {
      console.warn('Failed to load role state', e);
    }
  },
  _persist: async (state) => {
    try {
      await AsyncStorage.setItem(
        'roleState',
        JSON.stringify({ activeRole: state.activeRole })
      );
    } catch (e) {
      console.warn('Failed to persist role state', e);
    }
  },
}));
