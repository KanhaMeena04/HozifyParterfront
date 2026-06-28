import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { useFocusEffect } from 'expo-router';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { BackArrowIcon } from '@/components/ui/Icons';
import { Button } from '@/components/ui/Button';
import { useServicesStore } from '@/store/servicesStore';
import { useAndroidBack } from '@/hooks/useAndroidBack';
import { RoleAccessGuard } from '@/components/common/RoleAccessGuard';
import { completeStepAndNavigate } from '@/utils/onboarding';
import { StorageService } from '@/services/storage.service';
import Svg, { Path } from 'react-native-svg';

const TrashIcon = ({ size = 18, color = '#EF4444' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M3 6H5H21" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6L18.1 20.1C18.0433 20.8 17.7 21.4 17.2 21.7C16.7 22 16 22 15.5 22H8.5C8 22 7.3 22 6.8 21.7C6.3 21.4 5.95667 20.8 5.9 20.1L5 6H19Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M10 11V17" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M14 11V17" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const EditIcon = ({ size = 18, color = '#EAB308' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const EyeIcon = ({ size = 18, color = '#3B82F6' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const CloseXIcon = ({ size = 22, color = '#0F172A' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M18 6L6 18M6 6L18 18" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export default function ServicesListScreen() {
  const router = useSafeRouter();
  const { services, removeService, loadServices } = useServicesStore();
  const [filter, setFilter] = useState<'All' | 'Active' | 'Inactive'>('All');
  const [isApproved, setIsApproved] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [viewService, setViewService] = useState<any>(null);
  const [deleteTarget, setDeleteTarget] = useState<any>(null);

  const isISP = userRole === 'ISP';

  useFocusEffect(
    useCallback(() => {
      const checkApproval = async () => {
        const session = await StorageService.getUserSession();
        if (session?.isApproved) setIsApproved(true);
        setUserRole(session?.role || null);
      };
      checkApproval();
      loadServices();
    }, [loadServices])
  );

  useEffect(() => {
    if (services.length === 0 && !isApproved) {
      router.replace('/(tabs)/services');
    }
  }, [services, isApproved]);

  useAndroidBack(() => {
    router.back();
  });

  const filteredServices = services.filter(s => {
    if (filter === 'Active') return s.active;
    if (filter === 'Inactive') return !s.active;
    return true;
  });

  const confirmDelete = async () => {
    if (deleteTarget) {
      await removeService?.(deleteTarget.id);
      setDeleteTarget(null);
      const leftServices = services.filter(s => s.id !== deleteTarget.id);
      if (leftServices.length === 0 && !isApproved) {
        await StorageService.updateMandatoryFlowStep('partnerServiceSelection', 'yet_to_start');
      }
    }
  };

  return (
    <RoleAccessGuard allowedRoles={['BSP', 'ISP', 'BS']}>
      <GradientBackground style={{ flex: 1 }}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <TouchableOpacity activeOpacity={1} onPress={() => router.back()} style={styles.backButton}>
                <BackArrowIcon size={24} color="#0F172A" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>List of Services</Text>
            </View>
            <TouchableOpacity activeOpacity={1} style={styles.helpButton} onPress={() => router.push('/(dashboard)/help')}>
              <Text style={styles.helpText}>Help</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.filterRow}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
              {['All', 'Active', 'Inactive'].map(f => {
                const isActive = filter === f;
                return (
                  <TouchableOpacity activeOpacity={1}
                    key={f}
                    style={[styles.filterPill, isActive && (isISP ? styles.filterPillActiveISP : styles.filterPillActive)]}
                    onPress={() => setFilter(f as any)}
                  >
                    <Text style={[styles.filterText, isActive && styles.filterTextActive]}>{f}</Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.listContent}>
            {filteredServices.map(service => (
              <View key={service.id} style={styles.card}>
                <View style={styles.cardTop}>
                  <View style={styles.cardInfo}>
                    <View style={styles.cardTitleRow}>
                      <Text style={styles.cardTitle}>{service.name}</Text>
                      <Text style={[styles.statusBadge, !service.active && styles.statusBadgeInactive]}>
                        {service.active ? 'Active' : 'Inactive'}
                      </Text>
                    </View>
                    {userRole === 'ISP' && service.providerName ? (
                      <Text style={styles.metaText}>Provider: {service.providerName}</Text>
                    ) : null}
                    {userRole === 'BSP' && service.branchName ? (
                      <Text style={styles.metaText}>Branch: {service.branchName}</Text>
                    ) : null}
                    {service.dateAdded ? (
                      <Text style={styles.createdDate}>Created: {service.dateAdded}</Text>
                    ) : null}
                  </View>
                  <View style={styles.iconActions}>
                    <TouchableOpacity activeOpacity={1} style={styles.iconBtn} onPress={() => setViewService(service)}>
                      <EyeIcon size={18} color="#3B82F6" />
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={1} style={styles.iconBtn} onPress={() => router.push(`/(tabs)/services/update?id=${service.id}`)}>
                      <EditIcon size={18} color="#EAB308" />
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={1} style={styles.iconBtn} onPress={() => setDeleteTarget(service)}>
                      <TrashIcon size={18} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
            {filteredServices.length === 0 && (
              <View style={styles.emptyState} />
            )}
          </ScrollView>

          <View style={styles.footer}>
            <Button
              title="+ Add Services"
              onPress={() => router.push('/(tabs)/services/select')}
              variant="primary"
              style={{ marginBottom: 12 }}
            />
            {!isApproved && (
              <Button
                title="Continue"
                onPress={async () => {
                  await completeStepAndNavigate('partnerServiceSelection', router, 'completed');
                }}
                variant="outline"
              />
            )}
          </View>
        </SafeAreaView>

        {/* View Service Modal */}
        <Modal visible={!!viewService} transparent animationType="slide" onRequestClose={() => setViewService(null)}>
          <View style={styles.modalOverlay}>
            <TouchableOpacity activeOpacity={1} style={StyleSheet.absoluteFillObject} onPress={() => setViewService(null)} />
            <View style={styles.modalSheet}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Service Details</Text>
                <TouchableOpacity activeOpacity={1} onPress={() => setViewService(null)} style={styles.closeBtn}>
                  <CloseXIcon size={22} color="#0F172A" />
                </TouchableOpacity>
              </View>
              {viewService && (
                <View style={styles.viewRows}>
                  <View style={styles.viewRow}>
                    <Text style={styles.viewLabel}>Service Name</Text>
                    <Text style={styles.viewValue}>{viewService.name}</Text>
                  </View>
                  <View style={styles.viewRow}>
                    <Text style={styles.viewLabel}>Status</Text>
                    <Text style={[styles.viewValue, viewService.active ? styles.activeColor : styles.inactiveColor]}>
                      {viewService.active ? 'Active' : 'Inactive'}
                    </Text>
                  </View>
                  {viewService.dateAdded && (
                    <View style={styles.viewRow}>
                      <Text style={styles.viewLabel}>Date Added</Text>
                      <Text style={styles.viewValue}>{viewService.dateAdded}</Text>
                    </View>
                  )}
                  {viewService.subServices?.length > 0 && (
                    <View style={styles.viewSubSection}>
                      <Text style={styles.viewSubHeader}>Sub-services</Text>
                      {viewService.subServices.map((sub: any) => (
                        <View key={sub.id} style={styles.viewSubRow}>
                          <Text style={styles.viewSubName}>{sub.name}</Text>
                          <Text style={styles.viewSubExp}>{sub.yearsOfExperience} yrs exp</Text>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              )}
            </View>
          </View>
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal visible={!!deleteTarget} transparent animationType="slide" onRequestClose={() => setDeleteTarget(null)}>
          <View style={styles.modalOverlay}>
            <TouchableOpacity activeOpacity={1} style={StyleSheet.absoluteFillObject} onPress={() => setDeleteTarget(null)} />
            <View style={styles.modalSheet}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Delete Service</Text>
                <TouchableOpacity activeOpacity={1} onPress={() => setDeleteTarget(null)} style={styles.closeBtn}>
                  <CloseXIcon size={22} color="#0F172A" />
                </TouchableOpacity>
              </View>
              <Text style={styles.deleteMsg}>
                Are you sure you want to delete <Text style={{ fontWeight: '700' }}>{deleteTarget?.name}</Text>? This action cannot be undone.
              </Text>
              <View style={styles.deleteActions}>
                <TouchableOpacity activeOpacity={1} style={styles.cancelBtn} onPress={() => setDeleteTarget(null)}>
                  <Text style={styles.cancelBtnText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={1} style={styles.deleteBtn} onPress={confirmDelete}>
                  <Text style={styles.deleteBtnText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </GradientBackground>
    </RoleAccessGuard>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: 'transparent' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16 },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  backButton: { marginRight: 12 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#0F172A' },
  helpButton: { backgroundColor: '#F97316', paddingHorizontal: 16, paddingVertical: 6, borderRadius: 8 },
  helpText: { color: '#FFFFFF', fontWeight: '600', fontSize: 12 },

  filterRow: { marginBottom: 12 },
  filterScroll: { paddingHorizontal: 20, gap: 12 },
  filterPill: { paddingHorizontal: 20, paddingVertical: 8, backgroundColor: '#FFFFFF', borderRadius: 20, elevation: 2 },
  filterPillActive: { backgroundColor: '#1A0FA3', elevation: 4 },
  filterPillActiveISP: { backgroundColor: '#1A0FA3', elevation: 4 },
  filterText: { fontSize: 13, fontWeight: '600', color: '#64748B' },
  filterTextActive: { color: '#FFFFFF' },

  listContent: { paddingHorizontal: 20, paddingBottom: 40, gap: 12 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 16 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardInfo: { flex: 1, marginRight: 8 },
  cardTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  cardTitle: { fontSize: 15, fontWeight: '700', color: '#0F172A' },
  statusBadge: { fontSize: 11, fontWeight: '600', color: '#22C55E' },
  statusBadgeInactive: { color: '#F59E0B' },
  metaText: { fontSize: 11, color: '#64748B', marginTop: 3, fontWeight: '500' },
  createdDate: { fontSize: 11, color: '#94A3B8', marginTop: 2 },
  iconActions: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  iconBtn: { padding: 8, borderRadius: 8, backgroundColor: '#F8FAFC' },

  emptyState: { flex: 1, minHeight: 200 },
  footer: { paddingHorizontal: 20, paddingBottom: 40, paddingTop: 16 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(15,23,42,0.45)', justifyContent: 'flex-end' },
  modalSheet: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 17, fontWeight: '700', color: '#0F172A' },
  closeBtn: { padding: 4 },
  viewRows: { gap: 4, paddingBottom: 8 },
  viewRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  viewLabel: { fontSize: 13, color: '#64748B', fontWeight: '500' },
  viewValue: { fontSize: 13, color: '#0F172A', fontWeight: '600', maxWidth: '60%', textAlign: 'right' },
  activeColor: { color: '#22C55E' },
  inactiveColor: { color: '#F59E0B' },
  viewSubSection: { marginTop: 12 },
  viewSubHeader: { fontSize: 13, fontWeight: '700', color: '#0F172A', marginBottom: 8 },
  viewSubRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: '#F8FAFC' },
  viewSubName: { fontSize: 13, color: '#475569' },
  viewSubExp: { fontSize: 12, color: '#94A3B8' },
  deleteMsg: { fontSize: 14, color: '#475569', lineHeight: 22, marginBottom: 24 },
  deleteActions: { flexDirection: 'row', gap: 12 },
  cancelBtn: { flex: 1, paddingVertical: 14, borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0', alignItems: 'center' },
  cancelBtnText: { fontSize: 14, fontWeight: '600', color: '#64748B' },
  deleteBtn: { flex: 1, paddingVertical: 14, borderRadius: 12, backgroundColor: 'rgba(26, 15, 163, 1.00)', alignItems: 'center' },
  deleteBtnText: { fontSize: 14, fontWeight: '700', color: '#FFFFFF' },
});
