import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { BackArrowIcon, PencilIcon, BranchIcon, OutlineStarIcon, EyeIcon } from '@/components/ui/Icons';
import { Button } from '@/components/ui/Button';
import { MapServicesModal } from '@/components/common/MapServicesModal';
import { useAndroidBack } from '@/hooks/useAndroidBack';
import { StorageService } from '@/services/storage.service';
import { RoleAccessGuard } from '@/components/common/RoleAccessGuard';
import { completeStepAndNavigate } from '@/utils/onboarding';
import Svg, { Path } from 'react-native-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TrashIcon = ({ size = 18, color = '#EF4444' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M3 6H5H21" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6L18.1 20.1C18.0433 20.8 17.7 21.4 17.2 21.7C16.7 22 16 22 15.5 22H8.5C8 22 7.3 22 6.8 21.7C6.3 21.4 5.95667 20.8 5.9 20.1L5 6H19Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M10 11V17" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M14 11V17" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const CloseXIcon = ({ size = 22, color = '#0F172A' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M18 6L6 18M6 6L18 18" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const DUMMY_MAPPINGS = [
  {
    id: '1',
    branchName: 'Main Branch',
    category: 'Cleaning',
    status: 'Active',
    createdDate: '12 Jan 2024',
    services: [
      { name: 'House cleaning', experience: '1.5 years' },
      { name: 'Office cleaning', experience: '1.5 years' },
      { name: 'Open area cleaning', experience: '1.5 years' },
      { name: 'Open area cleaning', experience: '1.5 years' },
    ]
  },
  {
    id: '2',
    branchName: 'South Branch',
    category: 'Cleaning',
    status: 'Active',
    createdDate: '20 Feb 2024',
    services: [
      { name: 'House cleaning', experience: '1.5 years' },
      { name: 'Office cleaning', experience: '1.5 years' },
      { name: 'Open area cleaning', experience: '1.5 years' },
      { name: 'Open area cleaning', experience: '1.5 years' },
    ]
  },
  {
    id: '3',
    branchName: 'East Branch',
    category: 'Cleaning',
    status: 'Active',
    createdDate: '05 Mar 2024',
    services: [
      { name: 'House cleaning', experience: '1.5 years' },
      { name: 'Office cleaning', experience: '1.5 years' },
      { name: 'Open area cleaning', experience: '1.5 years' },
      { name: 'Open area cleaning', experience: '1.5 years' },
    ]
  },
];

export default function MappingScreen() {
  const router = useSafeRouter();
  const [filter, setFilter] = useState<'All' | 'Active' | 'Inactive'>('All');
  const [mappings, setMappings] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'update'>('create');
  const [selectedMapping, setSelectedMapping] = useState<any>(null);
  const [isApproved, setIsApproved] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<any>(null);
  const [viewTarget, setViewTarget] = useState<any>(null);

  const isBSP = userRole === 'BSP' || userRole === 'BS';

  useEffect(() => {
    const loadData = async () => {
      const session = await StorageService.getUserSession();
      if (session?.isApproved) setIsApproved(true);
      setUserRole(session?.role || null);
      
      const stored = await AsyncStorage.getItem('@hozify_branch_mappings');
      if (stored) {
        setMappings(JSON.parse(stored));
      } else {
        setMappings(DUMMY_MAPPINGS);
        await AsyncStorage.setItem('@hozify_branch_mappings', JSON.stringify(DUMMY_MAPPINGS));
      }
    };
    loadData();
  }, []);

  const saveMappings = async (newMappings: any[]) => {
    setMappings(newMappings);
    await AsyncStorage.setItem('@hozify_branch_mappings', JSON.stringify(newMappings));
    if (!isApproved) {
      const status = newMappings.length > 0 ? 'completed' : 'yet_to_start';
      await StorageService.updateMandatoryFlowStep('serviceBranchMapping', status);
    }
  };

  const handleBack = async () => {
    if (isApproved) {
      router.back();
    } else {
      const s = await StorageService.getUserSession();
      const role = s?.role || 'ISP';
      const { getPreviousStepRoute } = require('@/utils/onboarding');
      const prevRoute = await getPreviousStepRoute('serviceBranchMapping', role as any);
      router.replace(prevRoute as any);
    }
  };

  useAndroidBack(() => {
    handleBack();
    return true;
  });

  const handleEdit = (mapping: any) => {
    setSelectedMapping(mapping);
    setModalMode('update');
    setModalVisible(true);
  };

  const handleAdd = () => {
    setSelectedMapping(null);
    setModalMode('create');
    setModalVisible(true);
  };

  const confirmDelete = () => {
    if (deleteTarget) {
      const nextMappings = mappings.filter(m => m.id !== deleteTarget.id);
      saveMappings(nextMappings);
      setDeleteTarget(null);
    }
  };

  const filteredMappings = mappings.filter(m => {
    if (filter === 'Active') return m.status === 'Active';
    if (filter === 'Inactive') return m.status === 'Inactive';
    return true;
  });

  return (
    <RoleAccessGuard allowedRoles={['BSP', 'BS']}>
      <GradientBackground style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity activeOpacity={1} onPress={handleBack} style={styles.backButton}>
            <BackArrowIcon size={24} color="#0F172A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>List of Branch and services mapping</Text>
        </View>

        <View style={styles.filterContainer}>
          <View style={styles.tabsRow}>
            {['All', 'Active', 'Inactive'].map((tab) => (
              <TouchableOpacity activeOpacity={1}
                key={tab}
                style={[styles.tab, filter === tab && styles.activeTab]}
                onPress={() => setFilter(tab as any)}
              >
                <Text style={[styles.tabText, filter === tab && styles.activeTabText]}>{tab}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.listContainer}>
          {filteredMappings.length === 0 && (
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconContainer}>
                <View style={styles.emptyLargeCircle}>
                  <BranchIcon size={48} color="#3B82F6" />
                </View>
                <View style={styles.emptySmallCircle}>
                  <OutlineStarIcon size={20} color="#3B82F6" />
                </View>
              </View>
              <Text style={styles.emptyTitle}>No Mapping Added Yet</Text>
              <Text style={styles.emptySubtitle}>
                Add your branch and service mappings{'\n'}to manage them from one place
              </Text>
            </View>
          )}
          {filteredMappings.map((mapping) => (
            <View key={mapping.id} style={styles.card}>
              {/* Card header row: Branch name + Active badge */}
              <View style={styles.cardHeaderRow}>
                <Text style={styles.branchName}>Branch name : {mapping.branchName}</Text>
                <View style={[styles.statusBadge, mapping.status === 'Active' ? styles.statusBadgeActive : styles.statusBadgeInactive]}>
                  <Text style={[styles.statusBadgeText, mapping.status === 'Active' ? styles.statusActive : styles.statusInactive]}>
                    {mapping.status}
                  </Text>
                </View>
              </View>

              {/* Created date */}
              <Text style={styles.createdDateText}>Created: {mapping.createdDate}</Text>

              <View style={styles.cardActions}>
                <TouchableOpacity activeOpacity={1} style={styles.iconActionBtn} onPress={() => setViewTarget(mapping)}>
                  <EyeIcon size={16} color="#3B82F6" />
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={1} style={styles.iconActionBtn} onPress={() => handleEdit(mapping)}>
                  <PencilIcon size={16} color="#0F172A" />
                </TouchableOpacity>
                {isBSP && (
                  <TouchableOpacity activeOpacity={1} style={[styles.iconActionBtn, styles.iconActionBtnDelete]} onPress={() => setDeleteTarget(mapping)}>
                    <TrashIcon size={16} color="#EF4444" />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))}
        </ScrollView>

        <View style={styles.footer}>
          <Button
            title="+ Add service branch mapping"
            onPress={handleAdd}
            variant="primary"
            style={{ marginBottom: isApproved ? 0 : 12 }}
          />
          {!isApproved && (
            <Button
              title="Continue"
              onPress={async () => {
                if (mappings.length === 0) {
                  import('react-native').then(({ Alert }) => {
                    Alert.alert('Required', 'At least 1 branch and 1 service mapping is required to continue.');
                  });
                  return;
                }
                await completeStepAndNavigate('serviceBranchMapping', router, 'completed');
              }}
              variant="outline"
            />
          )}
        </View>
      </SafeAreaView>

      <MapServicesModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        mode={modalMode}
        initialData={selectedMapping}
        onSubmit={async (data) => {
          let nextMappings = [];
          if (modalMode === 'create') {
            const newMapping = {
              id: String(Date.now()),
              branchName: data.branch,
              category: data.services.find((c: any) => c.options.some((o: any) => o.selected))?.name || 'Cleaning',
              status: data.isActive ? 'Active' : 'Inactive',
              createdDate: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
              services: data.services.flatMap((cat: any) =>
                cat.options.filter((opt: any) => opt.selected).map((opt: any) => ({
                  name: opt.name,
                  experience: opt.experience ? `${opt.experience} years` : '0 years'
                }))
              )
            };
            nextMappings = [...mappings, newMapping];
          } else {
            nextMappings = mappings.map(m => m.id === selectedMapping.id ? {
              ...m,
              branchName: data.branch,
              category: data.services.find((c: any) => c.options.some((o: any) => o.selected))?.name || m.category,
              status: data.isActive ? 'Active' : 'Inactive',
              services: data.services.flatMap((cat: any) =>
                cat.options.filter((opt: any) => opt.selected).map((opt: any) => ({
                  name: opt.name,
                  experience: opt.experience ? `${opt.experience} years` : '0 years'
                }))
              )
            } : m);
          }
          await saveMappings(nextMappings);
        }}
      />

      <Modal visible={!!viewTarget} transparent animationType="slide" onRequestClose={() => setViewTarget(null)}>
        <View style={styles.modalOverlay}>
          <TouchableOpacity activeOpacity={1} style={StyleSheet.absoluteFillObject} onPress={() => setViewTarget(null)} />
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Mapping Details</Text>
              <TouchableOpacity activeOpacity={1} onPress={() => setViewTarget(null)} style={styles.closeBtn}>
                <CloseXIcon size={22} color="#0F172A" />
              </TouchableOpacity>
            </View>
            {viewTarget && (
              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.viewRows}>
                  <View style={styles.viewRow}>
                    <Text style={styles.viewLabel}>Branch Name</Text>
                    <Text style={styles.viewValue}>{viewTarget.branchName}</Text>
                  </View>
                  <View style={styles.viewRow}>
                    <Text style={styles.viewLabel}>Category</Text>
                    <Text style={styles.viewValue}>{viewTarget.category}</Text>
                  </View>
                  <View style={styles.viewRow}>
                    <Text style={styles.viewLabel}>Status</Text>
                    <View style={[styles.statusBadge, viewTarget.status === 'Active' ? styles.statusBadgeActive : styles.statusBadgeInactive]}>
                      <Text style={[styles.statusBadgeText, viewTarget.status === 'Active' ? styles.statusActive : styles.statusInactive]}>{viewTarget.status}</Text>
                    </View>
                  </View>
                  <View style={styles.viewRow}>
                    <Text style={styles.viewLabel}>Created Date</Text>
                    <Text style={styles.viewValue}>{viewTarget.createdDate}</Text>
                  </View>
                  <View style={styles.viewRow}>
                    <Text style={styles.viewLabel}>Total Services</Text>
                    <Text style={styles.viewValue}>{viewTarget.services?.length || 0}</Text>
                  </View>
                </View>
                <Text style={styles.viewServicesHeading}>Services</Text>
                {viewTarget.services?.map((svc: any, i: number) => (
                  <View key={i} style={styles.viewServiceItem}>
                    <View style={styles.bullet} />
                    <Text style={styles.viewServiceName}>{svc.name}</Text>
                    <Text style={styles.viewServiceExp}>{svc.experience}</Text>
                  </View>
                ))}
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>

      <Modal visible={!!deleteTarget} transparent animationType="slide" onRequestClose={() => setDeleteTarget(null)}>
        <View style={styles.modalOverlay}>
          <TouchableOpacity activeOpacity={1} style={StyleSheet.absoluteFillObject} onPress={() => setDeleteTarget(null)} />
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Delete Mapping</Text>
              <TouchableOpacity activeOpacity={1} onPress={() => setDeleteTarget(null)} style={styles.closeBtn}>
                <CloseXIcon size={22} color="#0F172A" />
              </TouchableOpacity>
            </View>
            <Text style={styles.deleteMsg}>
              Are you sure you want to delete the mapping for <Text style={{ fontWeight: '700' }}>{deleteTarget?.branchName}</Text>? This action cannot be undone.
            </Text>
            <View style={styles.deleteActions}>
              <TouchableOpacity activeOpacity={1} style={styles.cancelBtn} onPress={() => setDeleteTarget(null)}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={1} style={styles.confirmDeleteBtn} onPress={confirmDelete}>
                <Text style={styles.confirmDeleteBtnText}>Delete</Text>
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
  container: { flex: 1 },
  safeArea: { flex: 1,  },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 16 },
  backButton: { marginRight: 12 },
  headerTitle: { flex: 1, fontSize: 16, fontWeight: '600', color: '#0F172A' },
  
  filterContainer: { paddingHorizontal: 20, marginBottom: 12 },
  tabsRow: { flexDirection: 'row', gap: 8 },
  tab: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#FFFFFF', elevation: 2 },
  activeTab: { backgroundColor: '#1A0FA3', elevation: 4 },
  activeTabBSP: { backgroundColor: '#1A0FA3', elevation: 4 },
  tabText: { color: '#64748B', fontSize: 13, fontWeight: '600' },
  activeTabText: { color: '#FFFFFF', fontWeight: '700' },

  listContainer: { paddingHorizontal: 20, paddingBottom: 40 },
  
  card: { position: 'relative', backgroundColor: '#FFFFFF', borderRadius: 24, padding: 20, marginBottom: 12, boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.05)', elevation: 2 },
  cardHeaderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 },
  cardHeader: { marginBottom: 8 },
  cardHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  cardDivider: { height: 1, backgroundColor: '#F1F5F9', marginVertical: 10 },
  branchName: { fontSize: 13, fontWeight: '700', color: '#0F172A', flex: 1 },
  createdDateText: { fontSize: 11, color: '#94A3B8', fontWeight: '500', marginBottom: 2 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  statusBadgeActive: { backgroundColor: '#F0FDF4' },
  statusBadgeInactive: { backgroundColor: '#FEF2F2' },
  statusBadgeText: { fontSize: 11, fontWeight: '700' },
  statusText: { fontSize: 10, fontWeight: '700' },
  statusActive: { color: '#22C55E' },
  statusInactive: { color: '#EF4444' },
  viewServicesHeading: { fontSize: 12, fontWeight: '700', color: '#94A3B8', marginTop: 16, marginBottom: 8 },
  viewServiceItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  viewServiceName: { flex: 1, fontSize: 13, color: '#0F172A', fontWeight: '500', marginLeft: 8 },
  viewServiceExp: { fontSize: 12, color: '#64748B' },
  
  cardBody: {},
  categoryTitle: { fontSize: 13, fontWeight: '600', color: '#0F172A', marginBottom: 8 },
  servicesList: { gap: 6 },
  serviceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  serviceLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  bullet: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#64748B', marginRight: 6 },
  serviceName: { fontSize: 11, color: '#64748B' },
  serviceExp: { fontSize: 10, color: '#64748B', width: 60, textAlign: 'right' },
  
  cardActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 8, marginTop: 8 },
  iconActionBtn: { width: 34, height: 34, borderRadius: 8, backgroundColor: '#EEF2FF', justifyContent: 'center', alignItems: 'center' },
  iconActionBtnDelete: { backgroundColor: '#FEE2E2' },
  deleteBtn: { width: 32, height: 32, borderRadius: 8, backgroundColor: '#FEE2E2', justifyContent: 'center', alignItems: 'center' },
  viewRows: { gap: 0 },
  viewRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  viewLabel: { fontSize: 13, color: '#64748B', fontWeight: '500' },
  viewValue: { fontSize: 13, color: '#0F172A', fontWeight: '600', maxWidth: '55%', textAlign: 'right' },

  skipBtn: { paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: '#CBD5E1' },
  skipBtnText: { fontSize: 13, fontWeight: '600', color: '#64748B' },
  footer: { paddingHorizontal: 20, paddingBottom: 40, paddingTop: 16 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(15,23,42,0.45)', justifyContent: 'flex-end' },
  modalSheet: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 17, fontWeight: '700', color: '#0F172A' },
  closeBtn: { padding: 4 },
  deleteMsg: { fontSize: 14, color: '#475569', lineHeight: 22, marginBottom: 24 },
  deleteActions: { flexDirection: 'row', gap: 12 },
  cancelBtn: { flex: 1, paddingVertical: 14, borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0', alignItems: 'center' },
  cancelBtnText: { fontSize: 14, fontWeight: '600', color: '#64748B' },
  confirmDeleteBtn: { flex: 1, paddingVertical: 14, borderRadius: 12, backgroundColor: 'rgba(26, 15, 163, 1.00)', alignItems: 'center' },
  confirmDeleteBtnText: { fontSize: 14, fontWeight: '700', color: '#FFFFFF' },

  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40, paddingTop: 60 },
  emptyIconContainer: { position: 'relative', marginBottom: 32 },
  emptyLargeCircle: { width: 120, height: 120, borderRadius: 60, backgroundColor: 'rgba(206, 218, 255, 0.8)', justifyContent: 'center', alignItems: 'center' },
  emptySmallCircle: { position: 'absolute', bottom: 0, right: 0, width: 36, height: 36, borderRadius: 18, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center', elevation: 3 },
  emptyTitle: { fontSize: 22, fontWeight: '700', color: '#000000', marginBottom: 12, textAlign: 'center' },
  emptySubtitle: { fontSize: 14, color: '#94A3B8', textAlign: 'center', lineHeight: 22 },
});
