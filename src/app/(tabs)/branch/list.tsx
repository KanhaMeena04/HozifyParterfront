import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Modal, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { BackArrowIcon, EyeIcon, PencilIcon } from '@/components/ui/Icons';
import { BranchModal } from '@/components/common/BranchModal';
import { useBranchStore } from '@/store/branchStore';
import { Button } from '@/components/ui/Button';
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

const CloseXIcon = ({ size = 22, color = '#0F172A' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M18 6L6 18M6 6L18 18" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export default function BranchListScreen() {
  const router = useSafeRouter();
  const { branches, initialize, updateBranch, addBranch, deleteBranch } = useBranchStore();
  const [filter, setFilter] = useState<'All' | 'Active' | 'Inactive'>('All');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'update'>('create');
  const [selectedBranch, setSelectedBranch] = useState<any>(null);
  const [isApproved, setIsApproved] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [viewBranch, setViewBranch] = useState<any>(null);
  const [deleteTarget, setDeleteTarget] = useState<any>(null);

  const isBSP = userRole === 'BSP';

  useEffect(() => {
    initialize();
    const checkApproval = async () => {
      const session = await StorageService.getUserSession();
      if (session?.isApproved) setIsApproved(true);
      setUserRole(session?.role || null);
    };
    checkApproval();
  }, []);

  const handleBack = async () => {
    if (isApproved) {
      router.back();
    } else {
      try {
        const s = await StorageService.getUserSession();
        const role = s?.role || 'ISP';
        const { getPreviousStepRoute } = require('@/utils/onboarding');
        const prevRoute = await getPreviousStepRoute('branchCreation', role as any);
        router.push(prevRoute as any);
      } catch (e) {
        console.error('Error in handleBack:', e);
        router.push('/(auth)/business-profile');
      }
    }
  };

  useAndroidBack(() => {
    handleBack();
    return true;
  });

  const filteredBranches = branches.filter(b => {
    if (filter === 'Active') return b.isActive;
    if (filter === 'Inactive') return !b.isActive;
    return true;
  });

  const handleDelete = (item: any) => setDeleteTarget(item);

  const confirmDelete = () => {
    if (deleteTarget) {
      deleteBranch?.(deleteTarget.id);
      setDeleteTarget(null);
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={{ flex: 1 }}>
          <Text style={styles.branchName}>{item.name}</Text>
          <Text style={styles.createdDateText}>Created Date : {item.createdAt || '08 May 2024'}</Text>
        </View>
        <Text style={[styles.statusText, !item.isActive && styles.statusInactive]}>
          {item.isActive ? 'Active' : 'Inactive'}
        </Text>
      </View>
      <View style={styles.cardActions}>
        <TouchableOpacity activeOpacity={1} style={styles.iconBtn} onPress={() => setViewBranch(item)}>
          <EyeIcon size={18} color="#3B82F6" />
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={1} style={styles.iconBtn} onPress={() => {
          setModalMode('update');
          setSelectedBranch(item);
          setIsModalVisible(true);
        }}>
          <PencilIcon size={18} color="#0F172A" />
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={1} style={[styles.iconBtn, styles.iconBtnDelete]} onPress={() => handleDelete(item)}>
          <TrashIcon size={18} color="#EF4444" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <RoleAccessGuard allowedRoles={['BSP', 'BS']}>
      <GradientBackground style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.header}>
            <TouchableOpacity activeOpacity={1} onPress={() => handleBack()} style={styles.backButton}>
              <BackArrowIcon size={24} color="#0F172A" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{isBSP ? 'Add Business Branch' : 'List of Branches'}</Text>
            <TouchableOpacity activeOpacity={1} style={styles.helpButton} onPress={() => router.push('/(dashboard)/help')}>
              <Text style={styles.helpText}>Help</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.filterContainer}>
            <View style={styles.tabsRow}>
              {['All', 'Active', 'Inactive'].map((tab) => (
                <TouchableOpacity activeOpacity={1}
                  key={tab}
                  style={[styles.tab, filter === tab && (isBSP ? styles.activeTabBSP : styles.activeTab)]}
                  onPress={() => setFilter(tab as any)}
                >
                  <Text style={[styles.tabText, filter === tab && styles.activeTabText]}>{tab}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <FlatList
            data={filteredBranches}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={<Text style={styles.emptyText}>No branches found.</Text>}
          />

          <View style={styles.footer}>
            <Button
              title="+ Add Branch"
              onPress={() => {
                setModalMode('create');
                setSelectedBranch(null);
                setIsModalVisible(true);
              }}
              variant="primary"
              style={isApproved ? undefined : { marginBottom: 12 }}
            />
            {!isApproved && (
              <Button
                title="Continue"
                onPress={async () => {
                  await completeStepAndNavigate('branchCreation', router, 'completed');
                }}
                variant="outline"
              />
            )}
          </View>
        </SafeAreaView>

        <BranchModal
          visible={isModalVisible}
          onClose={() => {
            setIsModalVisible(false);
            setTimeout(() => setSelectedBranch(null), 300);
          }}
          mode={modalMode}
          initialData={selectedBranch}
          onSubmit={(data) => {
            if (modalMode === 'update') updateBranch(selectedBranch.id, data);
            else addBranch(data);
          }}
        />

        {/* View Branch Modal */}
        <Modal visible={!!viewBranch} transparent animationType="slide" onRequestClose={() => setViewBranch(null)}>
          <View style={styles.modalOverlay}>
            <TouchableOpacity activeOpacity={1} style={StyleSheet.absoluteFillObject} onPress={() => setViewBranch(null)} />
            <View style={styles.modalSheet}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Branch Details</Text>
                <TouchableOpacity activeOpacity={1} onPress={() => setViewBranch(null)} style={styles.closeBtn}>
                  <CloseXIcon size={22} color="#0F172A" />
                </TouchableOpacity>
              </View>
              {viewBranch && (
                <View style={styles.viewRows}>
                  <View style={styles.viewRow}>
                    <Text style={styles.viewLabel}>Branch Name</Text>
                    <Text style={styles.viewValue}>{viewBranch.name}</Text>
                  </View>
                  <View style={styles.viewRow}>
                    <Text style={styles.viewLabel}>Created Date</Text>
                    <Text style={styles.viewValue}>{viewBranch.createdAt || '08 May 2024'}</Text>
                  </View>
                  <View style={styles.viewRow}>
                    <Text style={styles.viewLabel}>Manager</Text>
                    <Text style={styles.viewValue}>{viewBranch.managerName}</Text>
                  </View>
                  <View style={styles.viewRow}>
                    <Text style={styles.viewLabel}>Email</Text>
                    <Text style={styles.viewValue}>{viewBranch.email}</Text>
                  </View>
                  <View style={styles.viewRow}>
                    <Text style={styles.viewLabel}>Mobile</Text>
                    <Text style={styles.viewValue}>{viewBranch.mobile}</Text>
                  </View>
                  <View style={styles.viewRow}>
                    <Text style={styles.viewLabel}>Address</Text>
                    <Text style={styles.viewValue}>{viewBranch.address}</Text>
                  </View>
                  <View style={styles.viewRow}>
                    <Text style={styles.viewLabel}>Status</Text>
                    <Text style={[styles.viewValue, viewBranch.isActive ? styles.activeColor : styles.inactiveColor]}>
                      {viewBranch.isActive ? 'Active' : 'Inactive'}
                    </Text>
                  </View>
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
                <Text style={styles.modalTitle}>Delete Branch</Text>
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
  container: { flex: 1 },
  safeArea: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16 },
  backButton: { marginRight: 12 },
  headerTitle: { flex: 1, fontSize: 16, fontWeight: '700', color: '#0F172A' },
  helpButton: { backgroundColor: '#FF8A00', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  helpText: { color: '#FFF', fontSize: 12, fontWeight: '600' },
  filterContainer: { paddingHorizontal: 20, marginBottom: 12 },
  tabsRow: { flexDirection: 'row', gap: 8 },
  tab: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#FFFFFF', elevation: 2 },
  activeTab: { backgroundColor: '#1A0FA3', elevation: 4 },
  activeTabBSP: { backgroundColor: '#1A0FA3', elevation: 4 },
  tabText: { color: '#64748B', fontSize: 14, fontWeight: '500' },
  activeTabText: { color: '#FFFFFF' },
  listContent: { paddingHorizontal: 20, paddingBottom: 40, gap: 12 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 16 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  branchName: { fontSize: 15, fontWeight: '700', color: '#0F172A', flex: 1 },
  createdDateText: { fontSize: 11, color: '#64748B', marginTop: 4, fontWeight: '500' },
  statusText: { fontSize: 12, fontWeight: '600', color: '#22C55E' },
  statusInactive: { color: '#EF4444' },
  cardActions: { flexDirection: 'row', gap: 8, justifyContent: 'flex-end', borderTopWidth: 1, borderTopColor: '#F1F5F9', paddingTop: 10 },
  iconBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#EEF2FF', justifyContent: 'center', alignItems: 'center' },
  iconBtnDelete: { backgroundColor: '#FEE2E2' },
  emptyText: { textAlign: 'center', color: '#64748B', marginTop: 40 },
  footer: { paddingHorizontal: 20, paddingBottom: 40, paddingTop: 16 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(15,23,42,0.45)', justifyContent: 'flex-end' },
  modalSheet: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 17, fontWeight: '700', color: '#0F172A' },
  closeBtn: { padding: 4 },
  viewRows: { gap: 12, paddingBottom: 8 },
  viewRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  viewLabel: { fontSize: 13, color: '#64748B', fontWeight: '500' },
  viewValue: { fontSize: 13, color: '#0F172A', fontWeight: '600', maxWidth: '60%', textAlign: 'right' },
  activeColor: { color: '#22C55E' },
  inactiveColor: { color: '#EF4444' },
  deleteMsg: { fontSize: 14, color: '#475569', lineHeight: 22, marginBottom: 24 },
  deleteActions: { flexDirection: 'row', gap: 12 },
  cancelBtn: { flex: 1, paddingVertical: 14, borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0', alignItems: 'center' },
  cancelBtnText: { fontSize: 14, fontWeight: '600', color: '#64748B' },
  deleteBtn: { flex: 1, paddingVertical: 14, borderRadius: 12, backgroundColor: 'rgba(26, 15, 163, 1.00)', alignItems: 'center' },
  deleteBtnText: { fontSize: 14, fontWeight: '700', color: '#FFFFFF' },
});
