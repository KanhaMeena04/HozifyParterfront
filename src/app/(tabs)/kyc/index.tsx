import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { TimelineTracker } from '@/components/ui/TimelineTracker';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { BackArrowIcon, BadgeCheckIcon, DocumentIcon, EyeIcon, UploadIcon } from '@/components/ui/Icons';
import { useDocStore } from '@/store/docStore';
import { useAndroidBack } from '@/hooks/useAndroidBack';
import { StorageService } from '@/services/storage.service';
import { completeStepAndNavigate } from '@/utils/onboarding';

type DocKey = 'aadhaar' | 'pan' | 'policeClearance' | 'drivingLicense' | 'otherDocs';

interface DocConfig {
  title: string;
  subtitle: string;
  key: DocKey;
  statusKey: keyof ReturnType<typeof useDocStore.getState>;
  uriKey: keyof ReturnType<typeof useDocStore.getState>;
}

const DOCS: DocConfig[] = [
  { title: 'Aadhaar Card', subtitle: 'Provide your Aadhaar card for identity proof', key: 'aadhaar', statusKey: 'aadhaarStatus', uriKey: 'aadhaarUri' },
  { title: 'PAN Card', subtitle: 'Provide your PAN card for tax purposes', key: 'pan', statusKey: 'panStatus', uriKey: 'panUri' },
  { title: 'Police Clearance', subtitle: 'Upload a valid police clearance certificate (Optional)', key: 'policeClearance', statusKey: 'policeClearanceStatus', uriKey: 'policeClearanceUri' },
  { title: 'Other Documents', subtitle: 'Upload any other supporting documents (Optional)', key: 'otherDocs', statusKey: 'otherDocsStatus', uriKey: 'otherDocsUri' },
];

interface DocumentCardProps {
  title: string;
  subtitle: string;
  status: string;
  uploadedUri: string | null;
  onViewPress: () => void;
  onUploadPress: () => void;
}

function DocumentCard({ title, subtitle, status, uploadedUri, onViewPress, onUploadPress }: DocumentCardProps) {
  const statusUpper = status.toUpperCase();
  const isRejected = statusUpper === 'REJECTED';
  const isNotUploaded = statusUpper === 'NOT UPLOADED';
  const isApproved = statusUpper === 'APPROVED';
  const isPending = statusUpper === 'PENDING';
  const hasUploaded = !!uploadedUri;

  const iconBg = isApproved ? '#DCFCE7' : isRejected ? '#FEE2E2' : isPending ? '#FEF9C3' : '#EEF2FF';
  const iconColor = isApproved ? '#22C55E' : isRejected ? '#EF4444' : isPending ? '#CA8A04' : 'rgba(26, 15, 163, 1.00)';

  const showUploadBtn = isNotUploaded || isRejected;
  const showViewBtn = hasUploaded || isApproved;

  return (
    <View style={styles.docGroup}>
      <View style={styles.docCard}>
        <View style={styles.docCardTop}>
          <View style={[styles.docIconWrapper, { backgroundColor: iconBg }]}>
            <DocumentIcon size={20} color={iconColor} />
          </View>
          <View style={styles.docInfo}>
            <Text style={styles.docTitle}>{title}</Text>
            <Text style={styles.docSubtitle}>{subtitle}</Text>
          </View>
          {!isNotUploaded && (
            <StatusBadge status={status} variant="pill" style={{ position: 'absolute', top: 12, right: 12 }} />
          )}
        </View>
        {showViewBtn && (
          <>
            <View style={styles.docCardDivider} />
            <TouchableOpacity activeOpacity={1} style={styles.viewDocBtn} onPress={onViewPress}>
              <EyeIcon size={15} color="#3B82F6" />
              <Text style={styles.viewDocText}>View Document</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
      {showUploadBtn && (
        <TouchableOpacity activeOpacity={1} style={styles.actionBtn} onPress={onUploadPress}>
          <UploadIcon size={16} color="#FFFFFF" />
          <Text style={styles.actionBtnText}>
            {isRejected ? 'Re-upload' : 'Upload'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

interface BiometricCardProps {
  title: string;
  subtitle: string;
  status: string;
  onUploadPress: () => void;
}

function BiometricCard({ title, subtitle, status, onUploadPress }: BiometricCardProps) {
  const statusUpper = status.toUpperCase();
  const isNotUploaded = statusUpper === 'NOT UPLOADED';
  const isPending = statusUpper === 'PENDING';
  const isApproved = statusUpper === 'APPROVED';

  const iconBg = isApproved ? '#DCFCE7' : isPending ? '#FEF9C3' : '#EEF2FF';
  const iconColor = isApproved ? '#22C55E' : isPending ? '#CA8A04' : 'rgba(26, 15, 163, 1.00)';

  return (
    <View style={styles.docGroup}>
      <View style={styles.docCard}>
        <View style={styles.docCardTop}>
          <View style={[styles.docIconWrapper, { backgroundColor: iconBg }]}>
            <DocumentIcon size={20} color={iconColor} />
          </View>
          <View style={styles.docInfo}>
            <Text style={styles.docTitle}>{title}</Text>
            <Text style={styles.docSubtitle}>{subtitle}</Text>
          </View>
          {!isNotUploaded && (
            <StatusBadge status={status} variant="pill" style={{ position: 'absolute', top: 12, right: 12 }} />
          )}
        </View>
      </View>
      {isNotUploaded && (
        <TouchableOpacity activeOpacity={1} style={styles.actionBtn} onPress={onUploadPress}>
          <UploadIcon size={16} color="#FFFFFF" />
          <Text style={styles.actionBtnText}>Upload</Text>
        </TouchableOpacity>
      )}
      {isPending && (
        <TouchableOpacity activeOpacity={1} style={styles.actionBtn} onPress={onUploadPress}>
          <UploadIcon size={16} color="#FFFFFF" />
          <Text style={styles.actionBtnText}>Re-capture</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

export default function KycDocumentCenter() {
  const router = useSafeRouter();
  const store = useDocStore();
  
  const handleBack = async () => {
    try {
      const s = await StorageService.getUserSession();
      const role = s?.role || 'ISP';
      const { getPreviousStepRoute } = require('@/utils/onboarding');
      const prevRoute = await getPreviousStepRoute('kycUpload', role as any);
      router.push(prevRoute as any);
    } catch (e) {
      console.error('Error in handleBack:', e);
      router.push('/(auth)/create-profile');
    }
  };

  useAndroidBack(() => {
    handleBack();
    return true;
  });
  const { aadhaarStatus, panStatus, policeClearanceStatus, drivingLicenseStatus, selfieStatus, videoKycStatus } = store;
  const [showSuccessModal, setShowSuccessModal] = React.useState(false);

  const handleNext = async () => {
    if (
      aadhaarStatus === 'Not uploaded' ||
      panStatus === 'Not uploaded' ||
      selfieStatus === 'Not uploaded' ||
      videoKycStatus === 'Not uploaded'
    ) {
      Alert.alert('Required', 'Please complete Aadhaar, PAN, Selfie, and Video KYC verification to proceed.');
      return;
    }

    setShowSuccessModal(true);
    setTimeout(async () => {
      setShowSuccessModal(false);
      await completeStepAndNavigate('kycUpload', router, 'reviewing');
    }, 2000);
  };

  const getStatus = (cfg: DocConfig): string => store[cfg.statusKey] as string;
  const getUri = (cfg: DocConfig): string | null => store[cfg.uriKey] as string | null;

  const requiredStatuses = [aadhaarStatus, panStatus, selfieStatus, videoKycStatus];
  const allApproved = requiredStatuses.every(s => s.toUpperCase() === 'APPROVED');
  const anySubmitted = requiredStatuses.some(s => s.toUpperCase() !== 'NOT UPLOADED');
  const allSubmitted = requiredStatuses.every(s => s.toUpperCase() !== 'NOT UPLOADED');
  const anyPending = requiredStatuses.some(s => s.toUpperCase() === 'PENDING');
  const canProceed = allSubmitted;

  const step2State = anyPending ? 'active' : anySubmitted ? 'completed' : 'pending';
  const step3State = allApproved ? 'completed' : 'pending';

  return (
    <GradientBackground style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity activeOpacity={1} onPress={() => handleBack()} style={styles.backButton}>
            <BackArrowIcon size={24} color="#0F172A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>KYC Documents</Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

          <View style={styles.timelineWrapper}>
            <TimelineTracker
              theme="light"
              steps={[
                { id: '1', label: 'Details Submitted', subLabel: 'Completed', state: 'completed' },
                { id: '2', label: 'Under Review', subLabel: anyPending ? 'In Progress' : anySubmitted ? 'Completed' : 'Pending', state: step2State },
                { id: '3', label: 'Approved', subLabel: allApproved ? 'Completed' : 'Pending', state: step3State },
              ]}
            />
          </View>

          <View style={styles.congratsCard}>
            <View style={styles.congratsIconWrapper}>
              <BadgeCheckIcon size={44} color="#1A0FA3" />
            </View>
            <View style={styles.congratsTextWrapper}>
              <Text style={styles.congratsTitle}>Congratulations</Text>
              {(() => {
                const docsUploadedCount = [aadhaarStatus, panStatus, policeClearanceStatus, drivingLicenseStatus]
                  .filter(s => s && s.toUpperCase() !== 'NOT UPLOADED').length;
                const isBiometricDone = selfieStatus && selfieStatus.toUpperCase() !== 'NOT UPLOADED' &&
                  videoKycStatus && videoKycStatus.toUpperCase() !== 'NOT UPLOADED';

                if (allApproved) {
                  return (
                    <>
                      <Text style={styles.congratsSubtitle}>Your KYC is approved!</Text>
                      <Text style={styles.congratsDesc}>
                        You can now get rewards by sharing your referral code with your friends.
                      </Text>
                    </>
                  );
                } else if (docsUploadedCount >= 2 || isBiometricDone) {
                  return (
                    <>
                      <Text style={styles.congratsSubtitle}>Your application is under review</Text>
                      <Text style={styles.congratsDesc}>
                        We are currently reviewing your documents. This usually takes a short while.
                      </Text>
                    </>
                  );
                } else {
                  return (
                    <>
                      <Text style={styles.congratsSubtitle}>Your profile created Successfully</Text>
                      <Text style={styles.congratsDesc}>
                        Please upload required documents and complete verification to proceed.
                      </Text>
                    </>
                  );
                }
              })()}
            </View>
          </View>

          <View style={styles.documentsPanel}>
            <Text style={styles.infoText}>
              Manage your uploaded documents below. Ensure all required documents are approved to start receiving bookings.
            </Text>

            {DOCS.map(cfg => (
              <DocumentCard
                key={cfg.key}
                title={cfg.title}
                subtitle={cfg.subtitle}
                status={getStatus(cfg)}
                uploadedUri={getUri(cfg)}
                onViewPress={() => router.push(`/(tabs)/kyc/doc-view?title=${encodeURIComponent(cfg.title)}` as any)}
                onUploadPress={() => router.push(`/(tabs)/upload?flow=kyc&doc=${encodeURIComponent(cfg.title)}` as any)}
              />
            ))}

            <BiometricCard
              title="Selfie Verification"
              subtitle="Take a live selfie to verify your identity"
              status={selfieStatus}
              onUploadPress={() => router.push('/(tabs)/kyc/verify?type=selfie' as any)}
            />
            <BiometricCard
              title="Video KYC"
              subtitle="Record a short video for identity verification"
              status={videoKycStatus}
              onUploadPress={() => router.push('/(tabs)/kyc/verify?type=video' as any)}
            />

            <TouchableOpacity activeOpacity={1}
            style={[styles.nextBtn, !canProceed && { backgroundColor: '#94A3B8' }]}
            onPress={handleNext}
            disabled={!canProceed}
          >
            <Text style={styles.nextBtnText}>Next</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      </SafeAreaView>

      <Modal visible={showSuccessModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <BadgeCheckIcon size={64} color="#22C55E" />
            <Text style={styles.modalTitle}>Submitted Successfully!</Text>
            <Text style={styles.modalDesc}>Your KYC documents have been submitted and are under review.</Text>
          </View>
        </View>
      </Modal>
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
    paddingVertical: 14,
  },
  backButton: { marginRight: 12 },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
  },

  scrollContent: { paddingBottom: 40 },

  timelineWrapper: {
    paddingVertical: 12,
    marginBottom: 12,
  },

  congratsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  congratsIconWrapper: { marginRight: 14 },
  congratsTextWrapper: { flex: 1 },
  congratsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 2,
  },
  congratsSubtitle: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(26, 15, 163, 1.00)',
    marginBottom: 4,
  },
  congratsDesc: {
    fontSize: 11,
    color: '#64748B',
    lineHeight: 16,
  },

  documentsPanel: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 20,
  },
  infoText: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 19,
    marginBottom: 20,
  },

  docGroup: { marginBottom: 14 },
  docCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  docCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    position: 'relative',
  },
  docIconWrapper: {
    width: 38,
    height: 38,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  docInfo: { flex: 1 },
  docTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  docSubtitle: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  docCardDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
  },
  viewDocBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 11,
    gap: 6,
  },
  viewDocText: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(26, 15, 163, 1.00)',
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1A0FA3',
    borderRadius: 12,
    paddingVertical: 14,
    marginTop: 8,
    gap: 8,
  },
  actionBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },


  nextBtn: {
    backgroundColor: '#1A0FA3',
    marginTop: 12,
    marginBottom: 0,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  nextBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    width: '100%',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  modalDesc: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
  },
});
