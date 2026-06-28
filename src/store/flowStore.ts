import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type FlowStatus = 'VERIFIED' | 'REVIEWING' | 'PROCESSING' | 'REJECTED' | 'COMPLETED' | 'YET TO START' | 'UNDER REVIEW';

export interface FlowState {
  partnerProfile: FlowStatus;
  businessProfile: FlowStatus;
  kycDocumentUpload: FlowStatus;
  businessDocumentUpload: FlowStatus;
  branchCreation: FlowStatus;
  partnerServiceSelection: FlowStatus;
  serviceBranchMapping: FlowStatus;
  branchEmployeeMapping: FlowStatus;
  addingEmployee: FlowStatus;
  partnerServiceAreaCreation: FlowStatus;
  termsAndConditions: FlowStatus;
  policies: FlowStatus;
  updateStepStatus: (step: keyof Omit<FlowState, 'updateStepStatus' | '_persist' | 'initialize'>, status: FlowStatus) => void;
  _persist: (state: FlowState) => Promise<void>;
  initialize: () => Promise<void>;
}

export const useFlowStore = create<FlowState>((set, get) => ({
  partnerProfile: 'YET TO START',
  businessProfile: 'YET TO START',
  kycDocumentUpload: 'YET TO START',
  businessDocumentUpload: 'YET TO START',
  branchCreation: 'YET TO START',
  partnerServiceSelection: 'YET TO START',
  serviceBranchMapping: 'YET TO START',
  branchEmployeeMapping: 'YET TO START',
  addingEmployee: 'YET TO START',
  partnerServiceAreaCreation: 'YET TO START',
  termsAndConditions: 'YET TO START',
  policies: 'YET TO START',

  updateStepStatus: (step, status) => {
    set({ [step]: status } as any);
    get()._persist(get());
  },

  initialize: async () => {
    try {
      const json = await AsyncStorage.getItem('flowState');
      if (json) {
        const persisted = JSON.parse(json);
        set({ ...persisted });
      }
    } catch (e) {
      console.error('Failed to load flowState', e);
    }
  },

  _persist: async (state: FlowState) => {
    try {
      const { 
        partnerProfile, businessProfile, kycDocumentUpload, businessDocumentUpload, 
        branchCreation, partnerServiceSelection, serviceBranchMapping, branchEmployeeMapping, 
        addingEmployee, partnerServiceAreaCreation, termsAndConditions, policies 
      } = state;
      
      await AsyncStorage.setItem(
        'flowState',
        JSON.stringify({
          partnerProfile, businessProfile, kycDocumentUpload, businessDocumentUpload, 
          branchCreation, partnerServiceSelection, serviceBranchMapping, branchEmployeeMapping, 
          addingEmployee, partnerServiceAreaCreation, termsAndConditions, policies
        })
      );
    } catch (e) {
      console.error('Failed to persist flowState', e);
    }
  },
}));
