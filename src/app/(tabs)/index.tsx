import { useSafeRouter } from '@/hooks/useSafeRouter';
import React, { useMemo, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Platform, TouchableOpacity, BackHandler } from 'react-native';
import {  useFocusEffect } from 'expo-router';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { Card } from '@/components/ui/Card';
import { TimelineTracker } from '@/components/ui/TimelineTracker';
import { FlowListItem } from '@/components/ui/FlowListItem';
import { InfoAlert } from '@/components/ui/InfoAlert';
import { Button } from '@/components/ui/Button';
import { 
  BackArrowIcon, CongratsBadgeIcon,
  VerifiedIcon, ReviewingIcon, PendingYellowIcon, RejectedIcon 
} from '@/components/ui/Icons';
import { useAuthStore } from '@/store/authStore';
import { useAndroidBack } from '@/hooks/useAndroidBack';
import { StorageService } from '@/services/storage.service';
import { MandatoryFlow, UserSession, FlowStatus } from '@/types/storage.types';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

const getIconForStatus = (status: FlowStatus) => {
  switch (status) {
    case 'verified':
    case 'completed':
      return <VerifiedIcon size={24} color="#22C55E" />;
    case 'rejected':
      return <RejectedIcon size={24} color="#EF4444" />;
    case 'reviewing':
      return <PendingYellowIcon size={24} color="#EAB308" />;
    default:
      return <ReviewingIcon size={24} color="#3B82F6" />;
  }
};

import { STEP_ROUTES } from '@/utils/onboarding';

const ALL_FLOW_STEPS = [
  { key: 'partnerProfile', title: 'Partner Profile', subtitle: 'Verified on Oct 24' },
  { key: 'businessProfile', title: 'Business Profile', subtitle: 'In review' },
  { key: 'kycUpload', title: 'KYC Document Upload', subtitle: 'In review' },
  { key: 'businessDocumentUpload', title: 'Business Document Upload', subtitle: 'Processing (2-3 days)' },
  { key: 'branchCreation', title: 'Branch Creation', subtitle: 'Processing (2-3 days)' },
  { key: 'partnerServiceSelection', title: 'Partner Service Selection', subtitle: 'Processing (2-3 days)' },
  { key: 'serviceBranchMapping', title: 'Service Branch Mapping', subtitle: 'Processing (2-3 days)' },
  { key: 'branchEmployeeMapping', title: 'Branch Employee Mapping', subtitle: 'Processing (2-3 days)' },
  { key: 'addingEmployee', title: 'Adding Employee', subtitle: 'Processing (2-3 days)' },
  { key: 'partnerServiceAreaCreation', title: 'Partner service area creation', subtitle: 'Processing (2-3 days)' },
  { key: 'termsAndConditions', title: 'Terms and Conditions', subtitle: 'Processing (2-3 days)' },
  { key: 'policies', title: 'Policies', subtitle: 'Processing (2-3 days)' },
] as const;

export default function ApplicationApprovalScreen() {
  useAndroidBack(() => {
    BackHandler.exitApp();
  });
  const router = useSafeRouter();
  const { mobileNumber } = useAuthStore();
  
  const [showCongrats, setShowCongrats] = useState(false);
  
  const [session, setSession] = useState<UserSession | null>(null);
  const [flowState, setFlowState] = useState<MandatoryFlow | null>(null);
  const [profile, setProfile] = useState<any>(null);

  useFocusEffect(
    useCallback(() => {
      const loadState = async () => {
        const s = await StorageService.getUserSession();
        if (s?.isApproved) {
          router.replace('/(dashboard)');
          return;
        }
        const f = await StorageService.getMandatoryFlow();
        
        // 1. Sync Partner Service Selection
        try {
          const servicesJson = await AsyncStorage.getItem('@hozify_services_store');
          const servicesList = servicesJson ? JSON.parse(servicesJson) : [];
          const hasServices = Array.isArray(servicesList) && servicesList.length > 0;
          if (!hasServices) {
            if (f.partnerServiceSelection !== 'yet_to_start') {
              f.partnerServiceSelection = 'yet_to_start';
              await StorageService.updateMandatoryFlowStep('partnerServiceSelection', 'yet_to_start');
            }
          } else {
            if (f.partnerServiceSelection === 'yet_to_start' || f.partnerServiceSelection === 'reviewing') {
              f.partnerServiceSelection = 'completed';
              await StorageService.updateMandatoryFlowStep('partnerServiceSelection', 'completed');
            }
          }
        } catch (err) {
          console.error("Error syncing services status on focus:", err);
        }

        // 2. Sync Service Branch Mapping
        try {
          const mappingsJson = await AsyncStorage.getItem('@hozify_branch_mappings');
          const mappingsList = mappingsJson ? JSON.parse(mappingsJson) : [];
          const hasMappings = Array.isArray(mappingsList) && mappingsList.length > 0;
          if (!hasMappings) {
            if (f.serviceBranchMapping !== 'yet_to_start') {
              f.serviceBranchMapping = 'yet_to_start';
              await StorageService.updateMandatoryFlowStep('serviceBranchMapping', 'yet_to_start');
            }
          } else {
            if (f.serviceBranchMapping === 'yet_to_start' || f.serviceBranchMapping === 'reviewing') {
              f.serviceBranchMapping = 'completed';
              await StorageService.updateMandatoryFlowStep('serviceBranchMapping', 'completed');
            }
          }
        } catch (err) {
          console.error("Error syncing mappings status on focus:", err);
        }

        // 3. Sync Partner Service Area Creation
        try {
          const areasJson = await AsyncStorage.getItem('@hozify_service_areas');
          const areasList = areasJson ? JSON.parse(areasJson) : [];
          const hasAreas = Array.isArray(areasList) && areasList.length > 0;
          if (!hasAreas) {
            if (f.partnerServiceAreaCreation !== 'yet_to_start') {
              f.partnerServiceAreaCreation = 'yet_to_start';
              await StorageService.updateMandatoryFlowStep('partnerServiceAreaCreation', 'yet_to_start');
            }
          } else {
            if (f.partnerServiceAreaCreation === 'yet_to_start' || f.partnerServiceAreaCreation === 'reviewing') {
              f.partnerServiceAreaCreation = 'completed';
              await StorageService.updateMandatoryFlowStep('partnerServiceAreaCreation', 'completed');
            }
          }
        } catch (err) {
          console.error("Error syncing service areas status on focus:", err);
        }

        const p = await StorageService.getPartnerProfile();
        setSession(s);
        setFlowState({ ...f });
        setProfile(p);
      };
      loadState();
    }, [])
  );

  const handleBack = () => {
    // optional back action
  };

  const handleApprove = () => {
    if (!isAllSubmitted) {
      import('react-native').then(({ Alert }) => {
        Alert.alert("Validation", "Please complete all mandatory flows before getting approved.");
      });
      return;
    }
    setShowCongrats(true);
  };

  const handleGoToDashboard = async () => {
    if (session) {
      await StorageService.updateUserSession({ isApproved: true });
      router.replace('/(dashboard)');
    }
  };

  const handleRowPress = (route: string, status: FlowStatus) => {
    if (!route) return;
    let params: any = {};
    if (status === 'rejected') {
      params.error = 'true';
    }

    if (Object.keys(params).length > 0) {
      router.push({ pathname: route as any, params });
    } else {
      router.push(route as any);
    }
  };

  const role = session?.role;

  const flowSteps = useMemo(() => {
    if (!role) return [];
    const keys: string[] = [];
    if (role === 'ISP') {
      keys.push('partnerProfile', 'kycUpload', 'partnerServiceSelection', 'partnerServiceAreaCreation', 'termsAndConditions', 'policies');
    } else if (role === 'BSP') {
      keys.push('partnerProfile', 'kycUpload', 'businessProfile', 'businessDocumentUpload', 'branchCreation', 'partnerServiceSelection', 'serviceBranchMapping', 'partnerServiceAreaCreation', 'termsAndConditions', 'policies');
    } else if (role === 'BS') {
      keys.push('partnerProfile', 'kycUpload', 'businessProfile', 'businessDocumentUpload', 'partnerServiceSelection', 'branchCreation', 'serviceBranchMapping', 'partnerServiceAreaCreation', 'termsAndConditions', 'policies');
    }
    return keys.map(k => ALL_FLOW_STEPS.find(s => s.key === k)!).filter(Boolean);
  }, [role]);

  const isAllSubmitted = useMemo(() => {
    if (!flowState || flowSteps.length === 0) return false;
    const statuses = flowSteps.map(step => flowState[step.key as keyof MandatoryFlow]);
    return statuses.every(s => s === 'verified' || s === 'completed' || s === 'reviewing');
  }, [flowState, flowSteps]);

  if (!flowState) {
    return null;
  }

  const partnerName = profile ? `${profile.firstName || ''} ${profile.lastName || ''}`.trim() : '';

  return (
    <GradientBackground style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity activeOpacity={1} onPress={handleBack} style={styles.backButton}>
            <BackArrowIcon size={24} color="#0F172A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Application</Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          {/* Top Blue Status Card */}
          <View style={styles.blueCard}>
            <View style={styles.clockIconWrapper}>
              {showCongrats ? (
                <VerifiedIcon size={24} color="#FFFFFF" />
              ) : (
                <ReviewingIcon size={24} color="#FFFFFF" />
              )}
            </View>
            <Text style={styles.blueCardTitle}>
              {showCongrats ? 'Application Approved' : 'Application Under Review'}
            </Text>
            <Text style={styles.blueCardText}>
              {showCongrats
                ? 'Your application has been fully approved. You can now accept bookings.'
                : 'We have received your details and documents. Our team is currently reviewing your application.'}
            </Text>
            
            <View style={styles.timelineWrapper}>
              <TimelineTracker 
                theme="dark"
                steps={[
                  { id: '1', label: 'SUBMITTED', state: 'completed' },
                  { id: '2', label: 'REVIEWING', state: showCongrats ? 'completed' : 'active' },
                  { id: '3', label: 'APPROVED', state: showCongrats ? 'completed' : 'pending' },
                ]} 
              />
            </View>
          </View>

          {/* Congratulations Card */}
          {showCongrats && (
            <Card style={styles.card} variant="default">
              <View style={styles.congratsRow}>
                <View style={styles.congratsIconWrapper}>
                  <CongratsBadgeIcon size={64} />
                </View>
                <View style={styles.congratsTextWrapper}>
                  <Text style={styles.congratsTitle}>Congratulations</Text>
                  <Text style={styles.congratsSubtitle}>Your profile is approved</Text>
                  <Text style={styles.congratsDesc}>
                    You can now get rewards by sharing your referral code with your friends.
                  </Text>
                </View>
              </View>
              <Button 
                title="Go to Dashboard" 
                onPress={handleGoToDashboard} 
                variant="primary" 
                style={{ marginTop: 16 }} 
              />
            </Card>
          )}

          {/* Info Alert */}
          {!showCongrats && (
            <View style={styles.alertWrapper}>
              <InfoAlert message="You will be notified via email and SMS once your account is approved. You cannot accept bookings until verification is complete." />
            </View>
          )}

          {/* Profile Details */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>PROFILE DETAILS</Text>
            </View>
            <View style={styles.detailsBox}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>{role === 'BS' ? 'Seller' : 'Partner'} Name</Text>
                <Text style={styles.detailValue}>{partnerName || 'Unknown'}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Phone Number</Text>
                <Text style={styles.detailValue}>{mobileNumber || session?.phone || ''}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>{role === 'BS' ? 'Seller' : 'Partner'} role</Text>
                <Text style={styles.detailValue}>{role || 'Unknown'}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>{role === 'BS' ? 'Seller' : 'Partner'} ID</Text>
                <Text style={styles.detailValue}>{role === 'BS' ? 'S' : 'P'}-{Math.floor(10000 + Math.random() * 90000)}</Text>
              </View>
              <View style={styles.detailRowLast}>
                <Text style={styles.detailLabel}>{role === 'BS' ? 'Seller' : 'Partner'} email ID</Text>
                <Text style={styles.detailValue}>{profile?.email || 'N/A'}</Text>
              </View>
            </View>
          </View>

          {/* Mandatory Flow */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>MANDATORY FLOW</Text>
            </View>
            <View style={styles.flowBox}>
              {flowSteps.map((step, index) => {
                const status = flowState[step.key as keyof MandatoryFlow];
                
                // Determine text status
                let displayStatus = status === 'yet_to_start' ? 'YET TO START' : status;
                const displayTitle = role === 'BS' ? step.title.replace(/Partner/g, 'Seller').replace(/partner/g, 'seller') : step.title;

                return (
                  <FlowListItem 
                    key={step.key}
                    icon={getIconForStatus(status)}
                    title={displayTitle}
                    subtitle={status === 'verified' || status === 'completed' ? 'Completed' : step.subtitle}
                    status={displayStatus as any}
                    isLast={index === flowSteps.length - 1}
                    onPress={() => handleRowPress(STEP_ROUTES[step.key as keyof typeof STEP_ROUTES], status)}
                  />
                );
              })}
            </View>
          </View>
          
          {/* Approve Button */}
          {!showCongrats && (
            <>
              <Button 
                title="Approve Account (Demo)" 
                onPress={handleApprove} 
                variant="primary" 
                style={{ marginTop: 8 }} 
              />
              <Button 
                title="Test Bypass Validation (Demo)" 
                onPress={() => setShowCongrats(true)} 
                variant="outline" 
                style={{ marginTop: 12, borderColor: '#EF4444' }} 
                textStyle={{ color: '#EF4444' }}
              />
            </>
          )}
          
        </ScrollView>
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16 },
  backButton: { marginRight: 12 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#0F172A' },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },
  blueCard: { backgroundColor: 'rgba(26, 15, 163, 1.00)', borderRadius: 24, padding: 24, alignItems: 'center', marginBottom: 16 },
  clockIconWrapper: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255, 255, 255, 0.1)', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  blueCardTitle: { fontSize: 20, fontWeight: '700', color: '#FFFFFF', marginBottom: 8 },
  blueCardText: { fontSize: 12, color: '#CBD5E1', textAlign: 'center', lineHeight: 18, marginBottom: 24, paddingHorizontal: 8 },
  timelineWrapper: { width: '100%', paddingHorizontal: 8 },
  card: { padding: 20, marginBottom: 16, borderRadius: 16 },
  congratsRow: { flexDirection: 'row', alignItems: 'center' },
  congratsIconWrapper: { marginRight: 16 },
  congratsTextWrapper: { flex: 1 },
  congratsTitle: { fontSize: 18, fontWeight: '700', color: '#0F172A', marginBottom: 2 },
  congratsSubtitle: { fontSize: 12, fontWeight: '600', color: 'rgba(26, 15, 163, 1.00)', marginBottom: 4 },
  congratsDesc: { fontSize: 11, color: '#64748B', lineHeight: 16 },
  alertWrapper: { marginBottom: 24 },
  sectionContainer: { marginBottom: 24 },
  sectionHeader: { backgroundColor: '#F8FAFC', paddingVertical: 12, paddingHorizontal: 16, borderTopLeftRadius: 12, borderTopRightRadius: 12, borderWidth: 1, borderColor: '#E2E8F0', borderBottomWidth: 0 },
  sectionTitle: { fontSize: 12, fontWeight: '700', color: '#94A3B8', letterSpacing: 1 },
  detailsBox: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E8F0', borderBottomLeftRadius: 12, borderBottomRightRadius: 12, padding: 16, overflow: 'hidden' },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10 },
  detailRowLast: { flexDirection: 'row', justifyContent: 'space-between', paddingTop: 10 },
  detailLabel: { fontSize: 13, color: '#64748B' },
  detailValue: { fontSize: 13, fontWeight: '600', color: '#0F172A' },
  flowBox: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E8F0', borderBottomLeftRadius: 12, borderBottomRightRadius: 12, overflow: 'hidden' },
});
