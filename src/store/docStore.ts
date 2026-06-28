import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface DocState {
  aadhaarStatus: string;
  panStatus: string;
  policeClearanceStatus: string;
  drivingLicenseStatus: string;
  otherDocsStatus: string;
  gstStatus: string;
  businessPanStatus: string;
  businessVerificationStatus: string;
  selfieStatus: string;
  videoKycStatus: string;
  aadhaarUri: string | null;
  aadhaarBackUri: string | null;
  aadhaarNumber: string | null;
  panUri: string | null;
  panBackUri: string | null;
  panNumber: string | null;
  policeClearanceUri: string | null;
  policeClearanceBackUri: string | null;
  policeClearanceNumber: string | null;
  drivingLicenseUri: string | null;
  drivingLicenseBackUri: string | null;
  drivingLicenseNumber: string | null;
  otherDocsUri: string | null;
  otherDocsBackUri: string | null;
  otherDocsNumber: string | null;
  gstUri: string | null;
  gstBackUri: string | null;
  gstNumber: string | null;
  businessPanUri: string | null;
  businessPanBackUri: string | null;
  businessPanNumber: string | null;
  businessVerificationUri?: string | null;
  businessVerificationBackUri?: string | null;
  businessVerificationNumber?: string | null;
  selfieUri: string | null;
  videoKycUri: string | null;
  updateDocStatus: (docName: string, status: string) => void;
  updateDocUri: (docName: string, uri: string) => void;
  updateDocBackUri: (docName: string, uri: string) => void;
  updateDocNumber: (docName: string, num: string) => void;
  _persist: (state: DocState) => Promise<void>;
  initialize: () => Promise<void>;
}

export const useDocStore = create<DocState>((set, get) => ({
  aadhaarStatus: 'Not uploaded',
  panStatus: 'Not uploaded',
  policeClearanceStatus: 'Not uploaded',
  drivingLicenseStatus: 'Not uploaded',
  otherDocsStatus: 'Not uploaded',
  gstStatus: 'Not uploaded',
  businessPanStatus: 'Not uploaded',
  businessVerificationStatus: 'Not uploaded',
  selfieStatus: 'Not uploaded',
  videoKycStatus: 'Not uploaded',
  aadhaarUri: null,
  aadhaarBackUri: null,
  aadhaarNumber: null,
  panUri: null,
  panBackUri: null,
  panNumber: null,
  policeClearanceUri: null,
  policeClearanceBackUri: null,
  policeClearanceNumber: null,
  drivingLicenseUri: null,
  drivingLicenseBackUri: null,
  drivingLicenseNumber: null,
  otherDocsUri: null,
  otherDocsBackUri: null,
  otherDocsNumber: null,
  gstUri: null,
  gstBackUri: null,
  gstNumber: null,
  businessPanUri: null,
  businessPanBackUri: null,
  businessPanNumber: null,
  businessVerificationUri: null,
  businessVerificationBackUri: null,
  businessVerificationNumber: null,
  selfieUri: null,
  videoKycUri: null,

  updateDocStatus: (docName: string, status: string) => {
    set({ [`${docName}Status`]: status } as any);
    get()._persist(get());
  },

  updateDocUri: (docName: string, uri: string) => {
    set({ [`${docName}Uri`]: uri } as any);
    get()._persist(get());
  },

  updateDocBackUri: (docName: string, uri: string) => {
    set({ [`${docName}BackUri`]: uri } as any);
    get()._persist(get());
  },

  updateDocNumber: (docName: string, num: string) => {
    set({ [`${docName}Number`]: num } as any);
    get()._persist(get());
  },

  initialize: async () => {
    try {
      const json = await AsyncStorage.getItem('docState');
      if (json) {
        const persisted = JSON.parse(json);
        set({ ...persisted });
      }
    } catch (e) {
      console.error('Failed to load docState', e);
    }
  },

  _persist: async (state: DocState) => {
    try {
      await AsyncStorage.setItem(
        'docState',
        JSON.stringify({
          aadhaarStatus: state.aadhaarStatus,
          panStatus: state.panStatus,
          policeClearanceStatus: state.policeClearanceStatus,
          drivingLicenseStatus: state.drivingLicenseStatus,
          otherDocsStatus: state.otherDocsStatus,
          gstStatus: state.gstStatus,
          businessPanStatus: state.businessPanStatus,
          businessVerificationStatus: state.businessVerificationStatus,
          selfieStatus: state.selfieStatus,
          videoKycStatus: state.videoKycStatus,
          aadhaarUri: state.aadhaarUri,
          aadhaarBackUri: state.aadhaarBackUri,
          aadhaarNumber: state.aadhaarNumber,
          panUri: state.panUri,
          panBackUri: state.panBackUri,
          panNumber: state.panNumber,
          policeClearanceUri: state.policeClearanceUri,
          policeClearanceBackUri: state.policeClearanceBackUri,
          policeClearanceNumber: state.policeClearanceNumber,
          drivingLicenseUri: state.drivingLicenseUri,
          drivingLicenseBackUri: state.drivingLicenseBackUri,
          drivingLicenseNumber: state.drivingLicenseNumber,
          otherDocsUri: state.otherDocsUri,
          otherDocsBackUri: state.otherDocsBackUri,
          otherDocsNumber: state.otherDocsNumber,
          gstUri: state.gstUri,
          gstBackUri: state.gstBackUri,
          gstNumber: state.gstNumber,
          businessPanUri: state.businessPanUri,
          businessPanBackUri: state.businessPanBackUri,
          businessPanNumber: state.businessPanNumber,
          businessVerificationUri: state.businessVerificationUri,
          businessVerificationBackUri: state.businessVerificationBackUri,
          businessVerificationNumber: state.businessVerificationNumber,
          selfieUri: state.selfieUri,
          videoKycUri: state.videoKycUri,
        })
      );
    } catch (e) {
      console.error('Failed to persist docState', e);
    }
  },
}));
