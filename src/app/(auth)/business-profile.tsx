import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Modal, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { TimelineTracker } from '@/components/ui/TimelineTracker';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { BackArrowIcon, BadgeCheckIcon, DocumentIcon, EyeIcon, UploadIcon, SaveIcon, PrintIcon, CloseIcon } from '@/components/ui/Icons';
import { useDocStore } from '@/store/docStore';
import { useAndroidBack } from '@/hooks/useAndroidBack';
import { StorageService } from '@/services/storage.service';
import { Button } from '@/components/ui/Button';

interface DocumentCardProps {
  title: string;
  status: string;
  uploadedUri: string | null;
  onViewPress: () => void;
  onUploadPress: () => void;
}

function DocumentCard({ title, status, uploadedUri, onViewPress, onUploadPress }: DocumentCardProps) {
  const statusUpper = status.toUpperCase();
  const isRejected = statusUpper === 'REJECTED';
  const isNotUploaded = statusUpper === 'NOT UPLOADED';
  const isApproved = statusUpper === 'APPROVED';
  const hasUploaded = !!uploadedUri;

  const iconBg = isApproved ? '#DCFCE7' : isRejected ? '#FEE2E2' : '#EEF2FF';
  const iconColor = isApproved ? '#22C55E' : isRejected ? '#EF4444' : 'rgba(26, 15, 163, 1.00)';

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
            <StatusBadge status={status} variant="pill" style={{ alignSelf: 'flex-start', marginTop: 4 }} />
          </View>
        </View>
        
        {showUploadBtn && (
          <>
            <View style={styles.docCardDivider} />
            <View style={styles.uploadBtnContainer}>
              <TouchableOpacity activeOpacity={1} style={styles.actionBtn} onPress={onUploadPress}>
                <UploadIcon size={16} color="#FFFFFF" />
                <Text style={styles.actionBtnText}>
                  {isRejected ? 'Re-upload' : 'Upload'}
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        {showViewBtn && (
          <>
            <View style={styles.docCardDivider} />
            <TouchableOpacity activeOpacity={1} style={styles.viewDocBtn} onPress={onViewPress}>
              <EyeIcon size={15} color="#3B82F6" />
              <Text style={styles.viewDocText}>View Documents</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}

export default function BusinessProfileScreen() {
  const router = useSafeRouter();
  const store = useDocStore();
  
  const handleBack = async () => {
    const s = await StorageService.getUserSession();
    const role = s?.role || 'ISP';
    const { getPreviousStepRoute } = require('@/utils/onboarding');
    const prevRoute = await getPreviousStepRoute('businessDocumentUpload', role as any);
    router.replace(prevRoute as any);
  };

  useAndroidBack(() => {
    handleBack();
    return true;
  });
  
  const { 
    businessVerificationStatus, 
    otherDocsStatus, 
    businessVerificationUri, 
    otherDocsUri,
    businessPanStatus,
    businessPanUri,
    businessPanBackUri,
    businessPanNumber
  } = store;

  const [modalVisible, setModalVisible] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<{
    title: string;
    frontUri: string | null;
    backUri: string | null;
    number: string | null;
  } | null>(null);

  const handleViewDoc = (title: string) => {
    if (title === "GST Certificate") {
      setSelectedDoc({
        title: "GST Certificate",
        frontUri: store.businessVerificationUri || null,
        backUri: store.businessVerificationBackUri || null,
        number: store.businessVerificationNumber || null,
      });
    } else if (title === "Business PAN Card") {
      setSelectedDoc({
        title: "Business PAN Card",
        frontUri: businessPanUri || null,
        backUri: businessPanBackUri || null,
        number: businessPanNumber || null,
      });
    } else {
      setSelectedDoc({
        title: "Other Documents",
        frontUri: store.otherDocsUri || null,
        backUri: store.otherDocsBackUri || null,
        number: store.otherDocsNumber || null,
      });
    }
    setModalVisible(true);
  };

  const handleNext = async () => {
    if (!businessVerificationStatus || businessVerificationStatus.toUpperCase() === 'NOT UPLOADED') {
      Alert.alert('Required', 'Please upload your GST Certificate to proceed.');
      return;
    }
    if (!businessPanStatus || businessPanStatus.toUpperCase() === 'NOT UPLOADED') {
      Alert.alert('Required', 'Please upload your Business PAN Card to proceed.');
      return;
    }

    setShowSuccessModal(true);
    setTimeout(async () => {
      setShowSuccessModal(false);
      const { completeStepAndNavigate } = require('@/utils/onboarding');
      await completeStepAndNavigate('businessDocumentUpload', router, 'reviewing');
    }, 2000);
  };

  const requiredStatuses = [businessVerificationStatus, businessPanStatus]; // Maybe otherDocs is optional or required?
  const allApproved = requiredStatuses.every(s => s?.toUpperCase() === 'APPROVED');
  const anySubmitted = requiredStatuses.some(s => s?.toUpperCase() !== 'NOT UPLOADED');
  const anyPending = requiredStatuses.some(s => s?.toUpperCase() === 'PENDING');

  const step2State = anyPending ? 'active' : anySubmitted ? 'completed' : 'pending';
  const step3State = allApproved ? 'completed' : 'pending';

  return (
    <GradientBackground style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity activeOpacity={1} onPress={handleBack} style={styles.backButton}>
            <BackArrowIcon size={24} color="#0F172A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Document center</Text>
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
                const docsUploadedCount = [businessVerificationStatus, businessPanStatus, otherDocsStatus]
                  .filter(s => s && s.toUpperCase() !== 'NOT UPLOADED').length;

                if (allApproved) {
                  return (
                    <>
                      <Text style={styles.congratsSubtitle}>Your Business Profile is approved!</Text>
                      <Text style={styles.congratsDesc}>
                        You can now get rewards by sharing your referral code with your friends.
                      </Text>
                    </>
                  );
                } else if (docsUploadedCount > 0) {
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

            <DocumentCard
              title="GST Certificate"
              status={businessVerificationStatus}
              uploadedUri={businessVerificationUri || null}
              onViewPress={() => handleViewDoc("GST Certificate")}
              onUploadPress={() => router.push('/(tabs)/business/upload?docType=GST Registration Certificate' as any)}
            />

            <DocumentCard
              title="Business PAN Card"
              status={businessPanStatus}
              uploadedUri={businessPanUri || null}
              onViewPress={() => handleViewDoc("Business PAN Card")}
              onUploadPress={() => router.push('/(tabs)/business/upload?docType=PAN Card' as any)}
            />

            <DocumentCard
              title="Other Documents"
              status={otherDocsStatus}
              uploadedUri={otherDocsUri || null}
              onViewPress={() => handleViewDoc("Other Documents")}
              onUploadPress={() => router.push('/(tabs)/business/upload?docType=Other Documents' as any)}
            />

            <TouchableOpacity activeOpacity={1}
              style={styles.nextBtn}
              onPress={handleNext}
            >
              <Text style={styles.nextBtnText}>Submit</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>

        <Modal
          visible={modalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              {/* Modal Header */}
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{selectedDoc?.title}</Text>
                <View style={styles.modalHeaderActions}>
                  <TouchableOpacity activeOpacity={1} 
                    style={styles.iconButton} 
                    onPress={() => Alert.alert('Saved', 'Document saved to gallery.')}
                  >
                    <SaveIcon size={22} color="#1A0FA3" />
                  </TouchableOpacity>
                  <TouchableOpacity activeOpacity={1} 
                    style={styles.iconButton} 
                    onPress={() => Alert.alert('Printing', 'Sending to printer...')}
                  >
                    <PrintIcon size={22} color="#1A0FA3" />
                  </TouchableOpacity>
                  <TouchableOpacity activeOpacity={1} 
                    style={styles.iconButton} 
                    onPress={() => setModalVisible(false)}
                  >
                    <CloseIcon size={22} color="#64748B" />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Modal Body */}
              <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.modalScroll}>
                {selectedDoc?.number && (
                  <View style={styles.docNumberBox}>
                    <View style={styles.docNumberAccent} />
                    <Text style={styles.docNumberText} numberOfLines={1}>{selectedDoc.number}</Text>
                  </View>
                )}

                {/* Front Image */}
                <View style={styles.imageSection}>
                  <View style={styles.imageSectionHeader}>
                    <Text style={styles.imgLabel}>Front {selectedDoc?.title} Image</Text>
                  </View>
                  <View style={styles.imgBox}>
                    {selectedDoc?.frontUri ? (
                      <Image source={{ uri: selectedDoc.frontUri }} style={styles.docImage} resizeMode="cover" />
                    ) : (
                      <View style={styles.placeholder}>
                        <Text style={styles.placeholderText}>FRONT</Text>
                      </View>
                    )}
                  </View>
                </View>

                {/* Back Image */}
                <View style={styles.imageSection}>
                  <View style={styles.imageSectionHeader}>
                    <Text style={styles.imgLabel}>Back {selectedDoc?.title} Image</Text>
                  </View>
                  <View style={styles.imgBox}>
                    {selectedDoc?.backUri ? (
                      <Image source={{ uri: selectedDoc.backUri }} style={styles.docImage} resizeMode="cover" />
                    ) : (
                      <View style={styles.placeholder}>
                        <Text style={styles.placeholderText}>BACK</Text>
                      </View>
                    )}
                  </View>
                </View>

                <Button
                  title="Re-Upload"
                  onPress={() => {
                    setModalVisible(false);
                    const docType = selectedDoc?.title === 'GST Certificate' ? 'GST Registration Certificate' : 
                                    selectedDoc?.title === 'Business PAN Card' ? 'PAN Card' : 'Other Documents';
                    router.push(`/(tabs)/business/upload?docType=${docType}` as any);
                  }}
                  variant="primary"
                  style={{ marginTop: 24, marginBottom: 8 }}
                />
              </ScrollView>
            </View>
          </View>
        </Modal>

        <Modal visible={showSuccessModal} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContentSuccess}>
              <BadgeCheckIcon size={64} color="#22C55E" />
              <Text style={styles.modalTitleSuccess}>Submitted Successfully!</Text>
              <Text style={styles.modalDescSuccess}>Your business documents have been submitted and are under review.</Text>
            </View>
          </View>
        </Modal>

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
    gap: 8,
  },
  uploadBtnContainer: {
    paddingHorizontal: 14,
    paddingVertical: 12,
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
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    width: '100%',
    maxHeight: '85%',
    padding: 24,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingBottom: 16,
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
  },
  modalHeaderActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: 6,
    marginLeft: 10,
  },
  modalScroll: {
    paddingBottom: 20,
  },
  docNumberBox: {
    flexDirection: 'row',
    width: '100%',
    height: 44,
    borderWidth: 2,
    borderColor: '#0F172A',
    borderRadius: 8,
    overflow: 'hidden',
    alignItems: 'center',
    marginBottom: 20,
  },
  docNumberAccent: {
    width: 12,
    height: '100%',
    backgroundColor: '#1A0FA3',
  },
  docNumberText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: 2,
  },
  imageSection: {
    marginBottom: 20,
  },
  imageSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  imgLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#334155',
  },
  imgBox: {
    width: '100%',
    height: 200,
    borderWidth: 3,
    borderColor: '#1A0FA3',
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: '#F8FAFC',
  },
  docImage: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#94A3B8',
    fontWeight: '700',
    fontSize: 13,
    letterSpacing: 1.5,
  },
  modalContentSuccess: {
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
  modalTitleSuccess: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  modalDescSuccess: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
  },
});
