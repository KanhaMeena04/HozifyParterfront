import { useSafeRouter } from '@/hooks/useSafeRouter';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Platform, TouchableOpacity, KeyboardAvoidingView, Alert, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { Input } from '@/components/ui/Input';
import { SelectInput } from '@/components/ui/SelectInput';
import { Button } from '@/components/ui/Button';
import { ImageUploadCard } from '@/components/ui/ImageUploadCard';
import { ShieldCheckIcon, ClockCircleIcon, BuildingIcon, BackArrowIcon } from '@/components/ui/Icons';
import { InfoAlert } from '@/components/ui/InfoAlert';
import { useDocStore } from '@/store/docStore';
import { useAndroidBack } from '@/hooks/useAndroidBack';
import { StorageService } from '@/services/storage.service';
import { SelectOptionsModal } from '@/components/common/SelectOptionsModal';
import * as ImagePicker from 'expo-image-picker';
import Svg, { Path, Circle } from 'react-native-svg';

const CameraIcon = ({ size = 32, color = 'rgba(26, 15, 163, 1.00)' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Circle cx="12" cy="13" r="4" stroke={color} strokeWidth="2" />
  </Svg>
);

const VideoIcon = ({ size = 32, color = 'rgba(26, 15, 163, 1.00)' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M15 10l4.553-2.277A1 1 0 0 1 21 8.624v6.752a1 1 0 0 1-1.447.9L15 14v-4z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M3 8a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const CheckCircleIcon = ({ size = 20, color = '#22C55E' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" />
    <Path d="M8 12l3 3 5-5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const DOCUMENT_TYPES = [
  { label: 'Aadhaar Card', value: 'Aadhaar Card' },
  { label: 'PAN Card', value: 'PAN Card' },
  { label: 'Voter ID', value: 'Voter ID' },
  { label: 'Passport', value: 'Passport' },
  { label: 'Driving License', value: 'Driving License' }
];

const BIZ_DOCUMENT_TYPES = [
  { label: 'Business License', value: 'Business License' },
  { label: 'GST Registration Certificate', value: 'GST Registration Certificate' },
  { label: 'Certificate of Incorporation', value: 'Certificate of Incorporation' },
  { label: 'Partnership Deed', value: 'Partnership Deed' }
];

export default function DocumentUploadScreen() {
  const router = useSafeRouter();
  const { flow, readonly, error, doc, type } = useLocalSearchParams<{
    flow: string;
    readonly?: string;
    error?: string;
    doc?: string;
    type?: 'selfie' | 'video';
  }>();
  const isReadonly = readonly === 'true';
  const { updateDocStatus, updateDocUri, updateDocBackUri, updateDocNumber, selfieStatus, videoKycStatus } = useDocStore();
  const [isApproved, setIsApproved] = useState(false);
  const [cameraLoading, setCameraLoading] = useState(false);

  const isSelfie = type === 'selfie';
  const isVideo = type === 'video';
  const isBiometric = isSelfie || isVideo;
  const isBusiness = flow === 'business';

  const currentBiometricStatus = isSelfie ? selfieStatus : videoKycStatus;
  const isAlreadyCaptured = isBiometric && currentBiometricStatus.toUpperCase() !== 'NOT UPLOADED';

  useEffect(() => {
    const checkApproval = async () => {
      const session = await StorageService.getUserSession();
      if (session?.isApproved) setIsApproved(true);
    };
    checkApproval();
  }, []);

  useAndroidBack(() => { router.back(); });

  const [docType, setDocType] = useState(doc || (isBusiness ? 'Business License' : 'National ID Card'));
  const [docNumber, setDocNumber] = useState('');
  const [bizName, setBizName] = useState('');
  const [docModalVisible, setDocModalVisible] = useState(false);
  const [sourceModalVisible, setSourceModalVisible] = useState(false);
  const [activeSide, setActiveSide] = useState<'front' | 'back' | null>(null);
  const [uploadedFront, setUploadedFront] = useState<string | null>(null);
  const [uploadedBack, setUploadedBack] = useState<string | null>(null);

  const [errors, setErrors] = useState<{
    docNumber?: string;
    uploadedFront?: string;
    uploadedBack?: string;
    bizName?: string;
  }>({});

  useEffect(() => {
    if (uploadedFront && errors.uploadedFront) {
      setErrors(prev => ({ ...prev, uploadedFront: undefined }));
    }
  }, [uploadedFront]);

  useEffect(() => {
    if (uploadedBack && errors.uploadedBack) {
      setErrors(prev => ({ ...prev, uploadedBack: undefined }));
    }
  }, [uploadedBack]);

  const requestCameraPermission = async () => {
    const { status, canAskAgain } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      if (!canAskAgain) {
        Alert.alert(
          'Camera Access Required',
          'Please enable camera access in your device Settings.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => Linking.openSettings() },
          ]
        );
      } else {
        Alert.alert('Permission Required', 'Please allow camera access.');
      }
      return false;
    }
    return true;
  };

  const handleCameraCapture = async () => {
    const granted = await requestCameraPermission();
    if (!granted) return;
    setCameraLoading(true);
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: isVideo ? ['videos'] : ['images'],
        allowsEditing: true,
        quality: 0.8,
        cameraType: isSelfie ? ImagePicker.CameraType.front : ImagePicker.CameraType.back,
      });
      if (!result.canceled && result.assets[0]) {
        const uri = result.assets[0].uri;
        const key = isSelfie ? 'selfie' : 'videoKyc';
        updateDocUri(key, uri);
        updateDocStatus(key, 'Pending');
        router.back();
      }
    } finally {
      setCameraLoading(false);
    }
  };

  const handleImagePick = (side: 'front' | 'back') => {
    Alert.alert(
      'Upload Document',
      'Choose an option',
      [
        {
          text: 'Take Photo',
          onPress: async () => {
            try {
              const { status, canAskAgain } = await ImagePicker.requestCameraPermissionsAsync();
              if (status !== 'granted') {
                if (!canAskAgain) {
                  Alert.alert(
                    'Camera Access Required',
                    'Please enable camera access in your device Settings.',
                    [
                      { text: 'Cancel', style: 'cancel' },
                      { text: 'Open Settings', onPress: () => Linking.openSettings() },
                    ]
                  );
                } else {
                  Alert.alert('Permission Required', 'Please allow camera access.');
                }
                return;
              }
              const result = await ImagePicker.launchCameraAsync({
                allowsEditing: true,
                quality: 0.8,
              });
              if (!result.canceled) {
                if (side === 'front') setUploadedFront(result.assets[0].uri);
                else setUploadedBack(result.assets[0].uri);
              }
            } catch (error: any) {
              Alert.alert('Camera Error', 'Camera is not available on this device or simulator.');
            }
          }
        },
        {
          text: 'Choose from Gallery',
          onPress: async () => {
            const { status, canAskAgain } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
              if (!canAskAgain) {
                Alert.alert(
                  'Gallery Access Required',
                  'Please enable gallery access in your device Settings to upload documents.',
                  [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Open Settings', onPress: () => Linking.openSettings() },
                  ]
                );
              } else {
                Alert.alert('Permission Required', 'Please allow gallery access to upload document.');
              }
              return;
            }
            const result = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ['images'],
              allowsEditing: true,
              quality: 0.8,
            });
            if (!result.canceled) {
              if (side === 'front') setUploadedFront(result.assets[0].uri);
              else setUploadedBack(result.assets[0].uri);
            }
          }
        },
        {
          text: 'Cancel',
          style: 'cancel'
        }
      ]
    );
  };

  const validateForm = () => {
    const isOptional = docType === 'Police Clearance' || docType === 'Other Documents';
    if (isOptional) return true;

    const newErrors: typeof errors = {};
    let isValid = true;

    if (isBusiness && !bizName.trim()) {
      newErrors.bizName = 'Business name is required';
      isValid = false;
    }

    if (!docNumber.trim()) {
      newErrors.docNumber = 'Document number is required';
      isValid = false;
    }

    if (!uploadedFront) {
      newErrors.uploadedFront = 'Front side image is required';
      isValid = false;
    }

    if (!uploadedBack) {
      newErrors.uploadedBack = 'Back side image is required';
      isValid = false;
    }

    setErrors(newErrors);

    if (!isValid) {
      Alert.alert('Required Fields', 'Please enter document number and upload both front and back images.');
    }

    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    let key = 'otherDocs';
    if (isBusiness) {
      key = 'businessVerification';
    } else {
      if (docType === 'National ID Card' || docType === 'Aadhaar Card') key = 'aadhaar';
      else if (docType === 'PAN Card') key = 'pan';
      else if (docType === 'Driving License') key = 'drivingLicense';
      else if (docType === 'Police Clearance') key = 'policeClearance';
    }
    updateDocStatus(key, 'Pending');
    if (uploadedFront) updateDocUri(key, uploadedFront);
    if (uploadedBack) updateDocBackUri(key, uploadedBack);
    if (docNumber) updateDocNumber(key, docNumber);

    if (flow === 'kyc') {
      await StorageService.updateMandatoryFlowStep('kycUpload', 'reviewing');
      router.replace('/(tabs)/kyc' as any);
    } else if (isApproved) {
      router.back();
    } else {
      const { completeStepAndNavigate } = require('@/utils/onboarding');
      if (isBusiness) {
        await completeStepAndNavigate('businessDocumentUpload', router, 'reviewing');
      } else {
        await completeStepAndNavigate('kycUpload', router, 'reviewing');
      }
    }
  };

  // ── Biometric (Selfie / Video KYC) UI ──────────────────────────────────────
  if (isBiometric) {
    return (
      <GradientBackground style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.header}>
            <TouchableOpacity activeOpacity={1} onPress={() => router.back()} style={styles.backButton}>
              <BackArrowIcon size={24} color="#0F172A" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>
              {isSelfie ? 'Selfie Verification' : 'Video KYC'}
            </Text>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            <View style={styles.card}>
              {/* Top section */}
              <View style={styles.topSection}>
                <View style={styles.iconWrapper}>
                  {isSelfie
                    ? <CameraIcon size={28} color="rgba(26, 15, 163, 1.00)" />
                    : <VideoIcon size={28} color="rgba(26, 15, 163, 1.00)" />}
                </View>
                <Text style={styles.verifyTitle}>
                  {isSelfie ? 'Take a Selfie' : 'Record Video KYC'}
                </Text>
                <Text style={styles.verifyDesc}>
                  {isSelfie
                    ? 'Please take a clear selfie in good lighting. Make sure your face is clearly visible.'
                    : 'Record a short video saying your name and date of birth for identity verification.'}
                </Text>
                <View style={styles.pendingPill}>
                  <ClockCircleIcon size={14} color="rgba(26, 15, 163, 1.00)" />
                  <Text style={styles.pendingPillText}>Pending Verification</Text>
                </View>
              </View>

              {/* Tips */}
              <Text style={styles.sectionTitle}>
                {isSelfie ? 'SELFIE TIPS' : 'VIDEO TIPS'}
              </Text>
              <View style={styles.tipsBox}>
                {isSelfie ? (
                  <>
                    <Text style={styles.tip}>• Face the camera directly</Text>
                    <Text style={styles.tip}>• Ensure good lighting</Text>
                    <Text style={styles.tip}>• Remove glasses or hat</Text>
                    <Text style={styles.tip}>• Plain background preferred</Text>
                  </>
                ) : (
                  <>
                    <Text style={styles.tip}>• Speak clearly and slowly</Text>
                    <Text style={styles.tip}>• Say your full name and date of birth</Text>
                    <Text style={styles.tip}>• Keep video under 30 seconds</Text>
                    <Text style={styles.tip}>• Ensure good lighting</Text>
                  </>
                )}
              </View>

              {isAlreadyCaptured && (
                <View style={styles.capturedRow}>
                  <CheckCircleIcon size={20} color="#22C55E" />
                  <Text style={styles.capturedText}>
                    {isSelfie ? 'Selfie captured' : 'Video recorded'} — Pending verification
                  </Text>
                </View>
              )}

              <Button
                title={
                  cameraLoading
                    ? 'Opening Camera...'
                    : isAlreadyCaptured
                      ? (isSelfie ? 'Retake Selfie' : 'Re-record Video')
                      : (isSelfie ? 'Open Camera' : 'Start Recording')
                }
                onPress={handleCameraCapture}
                variant="primary"
                style={styles.submitBtn}
              />
            </View>
          </ScrollView>
        </SafeAreaView>
      </GradientBackground>
    );
  }

  // ── Standard Document Upload UI ────────────────────────────────────────────
  return (
    <GradientBackground style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <View style={styles.header}>
            <TouchableOpacity activeOpacity={1} onPress={() => router.back()} style={styles.backButton}>
              <BackArrowIcon size={24} color="#0F172A" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>
              {isBusiness ? "Upload Business Document" : "Upload KYC Document"}
            </Text>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            <View style={styles.card}>
              <View style={styles.topSection}>
                <View style={styles.iconWrapper}>
                  {isBusiness
                    ? <BuildingIcon size={24} color="rgba(26, 15, 163, 1.00)" />
                    : <ShieldCheckIcon size={24} color="rgba(26, 15, 163, 1.00)" />}
                </View>
                <Text style={styles.verifyTitle}>
                  {isBusiness ? "Business Verification" : "Verify Your Identity"}
                </Text>
                <Text style={styles.verifyDesc}>
                  {isBusiness
                    ? "Upload official business documents to verify your business profile and unlock all features."
                    : "Please provide your official identification document to complete your partner profile."}
                </Text>
                <View style={styles.pendingPill}>
                  <ClockCircleIcon size={14} color="rgba(26, 15, 163, 1.00)" />
                  <Text style={styles.pendingPillText}>Pending Verification</Text>
                </View>
              </View>

              {error === "true" && (
                <View style={{ marginBottom: 16 }}>
                  <InfoAlert message="Your uploaded document was rejected. Please upload a clearer copy." />
                </View>
              )}

              <Text style={styles.sectionTitle}>
                {isBusiness ? "BUSINESS DETAILS" : "DOCUMENT INFO"}
              </Text>

              {isBusiness && (
                <Input
                  label="Business Name *"
                  placeholder="Enter Business Name"
                  value={bizName}
                  onChangeText={(val) => {
                    setBizName(val);
                    if (errors.bizName) setErrors(prev => ({ ...prev, bizName: undefined }));
                  }}
                  error={errors.bizName}
                  editable={!isReadonly}
                />
              )}

              <SelectInput
                label="Document Type *"
                placeholder="Select"
                value={docType}
                onPress={() => setDocModalVisible(true)}
                disabled={isReadonly}
              />

              <Input
                label="Document Number *"
                placeholder="Enter Document Number"
                value={docNumber}
                onChangeText={(val) => {
                  let cleaned = val;
                  if (docType === 'PAN Card') {
                    cleaned = val.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 10);
                  } else if (docType === 'GST Registration Certificate') {
                    cleaned = val.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 15);
                  } else if (docType === 'Aadhaar Card') {
                    cleaned = val.replace(/[^0-9]/g, '').slice(0, 12);
                  }
                  setDocNumber(cleaned);
                  if (errors.docNumber) setErrors(prev => ({ ...prev, docNumber: undefined }));
                }}
                autoCapitalize={docType === 'PAN Card' || docType === 'GST Registration Certificate' ? 'characters' : undefined}
                keyboardType={docType === 'Aadhaar Card' ? 'number-pad' : 'default'}
                maxLength={docType === 'PAN Card' ? 10 : docType === 'GST Registration Certificate' ? 15 : docType === 'Aadhaar Card' ? 12 : undefined}
                error={errors.docNumber}
                editable={!isReadonly}
              />

              <Text style={[styles.sectionTitle, { marginTop: 8 }]}>DOCUMENT IMAGES</Text>
              <Text style={styles.sectionDesc}>
                {isBusiness
                  ? "Please provide clear images of your official business documents."
                  : "Ensure all text is clearly visible and there is no glare."}
              </Text>

              <Text style={styles.uploadLabel}>{isBusiness ? "Front Image" : "Front Side"}</Text>
              <ImageUploadCard
                label="Tap to upload"
                subLabel="PNG, JPG up to 5MB"
                uploaded={isReadonly || !!uploadedFront}
                uploadedUri={uploadedFront ?? undefined}
                onPress={() => { if (!isReadonly) handleImagePick('front'); }}
                onRemove={() => setUploadedFront(null)}
                style={[styles.uploadCard, errors.uploadedFront && styles.uploadCardError]}
              />
              {errors.uploadedFront && <Text style={styles.errorText}>{errors.uploadedFront}</Text>}

              <Text style={styles.uploadLabel}>{isBusiness ? "Back Image" : "Back Side"}</Text>
              <ImageUploadCard
                label="Tap to upload"
                subLabel="PNG, JPG up to 5MB"
                uploaded={isReadonly || !!uploadedBack}
                uploadedUri={uploadedBack ?? undefined}
                onPress={() => { if (!isReadonly) handleImagePick('back'); }}
                onRemove={() => setUploadedBack(null)}
                style={[styles.uploadCard, errors.uploadedBack && styles.uploadCardError]}
              />
              {errors.uploadedBack && <Text style={styles.errorText}>{errors.uploadedBack}</Text>}

              {!isReadonly && (
                <Button
                  title={isApproved ? "Save Changes" : isBusiness ? "Submit Documents" : "Submit for Verification"}
                  onPress={handleSubmit}
                  variant="primary"
                  style={styles.submitBtn}
                />
              )}
            </View>
          </ScrollView>

          <SelectOptionsModal
            visible={docModalVisible}
            onClose={() => setDocModalVisible(false)}
            title="Select Document Type"
            options={isBusiness ? BIZ_DOCUMENT_TYPES : DOCUMENT_TYPES}
            onSelect={(value) => setDocType(value)}
          />
        </KeyboardAvoidingView>
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1, backgroundColor: 'transparent' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  backButton: { marginRight: 12 },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    marginTop: 12,
  },
  topSection: {
    alignItems: 'center',
    marginBottom: 32,
    position: 'relative',
    width: '100%',
  },
  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  verifyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 8,
  },
  verifyDesc: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  pendingPill: {
    position: 'absolute',
    top: -4,
    right: -4,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  pendingPillText: {
    fontSize: 10,
    fontWeight: '600',
    color: 'rgba(26, 15, 163, 1.00)',
    marginLeft: 4,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  sectionDesc: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 16,
    marginTop: -8,
  },
  uploadLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 8,
  },
  uploadCard: { marginBottom: 20 },
  submitBtn: { marginTop: 12 },
  errorText: {
    color: '#EF4444',
    fontSize: 11,
    marginTop: -12,
    marginBottom: 16,
    marginLeft: 4,
    fontWeight: '500',
  },
  uploadCardError: {
    borderColor: '#EF4444',
    borderWidth: 1.5,
  },
  tipsBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    width: '100%',
  },
  tip: {
    fontSize: 13,
    color: '#475569',
    marginBottom: 6,
    lineHeight: 18,
  },
  capturedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    width: '100%',
  },
  capturedText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#16A34A',
    flex: 1,
  },
});
