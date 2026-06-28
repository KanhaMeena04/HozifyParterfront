import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { BackArrowIcon, EyeIcon, PencilIcon } from '@/components/ui/Icons';
import { Button } from '@/components/ui/Button';
import { DefineOperationalAreaModal } from '@/components/common/DefineOperationalAreaModal';
import { useAndroidBack } from '@/hooks/useAndroidBack';
import { StorageService } from '@/services/storage.service';
import { completeStepAndNavigate } from '@/utils/onboarding';
import { useServiceAreaStore, ServiceArea } from '@/store/serviceAreaStore';
import { useBranchStore } from '@/store/branchStore';
import Svg, { Path, Circle } from 'react-native-svg';

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

const EmptyIllustration = () => (
  <View style={emptyStyles.illustrationWrap}>
    <View style={emptyStyles.outerCircle}>
      <View style={emptyStyles.innerCircle}>
        <Svg width={48} height={48} viewBox="0 0 24 24" fill="none">
          <Path
            d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
            stroke="rgba(26,15,163,1)"
            strokeWidth="1.5"
            fill="rgba(26,15,163,0.12)"
          />
          <Circle cx="12" cy="9" r="2.5" stroke="rgba(26,15,163,1)" strokeWidth="1.5" />
        </Svg>
      </View>
    </View>
    <View style={emptyStyles.starBadge}>
      <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
        <Path
          d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
          fill="rgba(26,15,163,0.15)"
          stroke="rgba(26,15,163,1)"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </Svg>
    </View>
  </View>
);

export default function ServiceAreaScreen() {
  const router = useSafeRouter();
  const { areas, loadAreas, addArea, updateArea, removeArea } = useServiceAreaStore();
  const { branches } = useBranchStore();

  const [filter, setFilter] = useState<'All' | 'Active' | 'Inactive'>('All');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'update'>('create');
  const [selectedArea, setSelectedArea] = useState<ServiceArea | null>(null);
  const [isApproved, setIsApproved] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const [providerName, setProviderName] = useState<string | undefined>(undefined);
  const [viewArea, setViewArea] = useState<ServiceArea | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ServiceArea | null>(null);

  useEffect(() => {
    const init = async () => {
      const session = await StorageService.getUserSession();
      if (session?.isApproved) setIsApproved(true);
      if (session?.role) setRole(session.role);
      if (session?.role === 'ISP') {
        const profile = await StorageService.getPartnerProfile();
        const name = ((profile?.firstName || '') + ' ' + (profile?.lastName || '')).trim();
        if (name) setProviderName(name);
      }
    };
    init();
    loadAreas();
  }, []);

  const handleBack = async () => {
    if (isApproved) {
      router.back();
    } else {
      const s = await StorageService.getUserSession();
      const currentRole = s?.role || 'ISP';
      const { getPreviousStepRoute } = require('@/utils/onboarding');
      const prevRoute = await getPreviousStepRoute('partnerServiceAreaCreation', currentRole as any);
      router.replace(prevRoute as any);
    }
  };

  useAndroidBack(() => {
    handleBack();
    return true;
  });

  const handleEdit = (area: ServiceArea) => {
    setSelectedArea(area);
    setModalMode('update');
    setModalVisible(true);
  };

  const handleAdd = () => {
    setSelectedArea(null);
    setModalMode('create');
    setModalVisible(true);
  };

  const confirmDelete = async () => {
    if (deleteTarget) {
      await removeArea(deleteTarget.id);
      setDeleteTarget(null);
      const updatedAreas = useServiceAreaStore.getState().areas;
      const status = updatedAreas.length > 0 ? 'completed' : 'yet_to_start';
      await StorageService.updateMandatoryFlowStep('partnerServiceAreaCreation', status);
    }
  };

  const filteredAreas = areas.filter(a => {
    if (filter === 'Active') return a.status === 'Active';
    if (filter === 'Inactive') return a.status === 'Inactive';
    return true;
  });

  const isEmpty = areas.length === 0;
  const isISP = role === 'ISP';
  const isBSP = role === 'BSP';

  return (
    <GradientBackground style={styles.container}>
      <SafeAreaView style={styles.safeArea}>

        <View style={styles.header}>
          <TouchableOpacity activeOpacity={1} onPress={handleBack} style={styles.backButton}>
            <BackArrowIcon size={24} color="#0F172A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {isEmpty ? 'Partner Service Area' : 'List of Service Area'}
          </Text>
          {!isEmpty && (
            <TouchableOpacity activeOpacity={1} style={styles.helpButton} onPress={() => router.push('/(dashboard)/help')}>
              <Text style={styles.helpText}>Help</Text>
            </TouchableOpacity>
          )}
        </View>

        {isEmpty ? (
          <View style={emptyStyles.body}>
            <EmptyIllustration />
            <Text style={emptyStyles.title}>No Service Area Added Yet</Text>
            <Text style={emptyStyles.subtitle}>
              Add locations that you frequently{'\n'}visit for quick access
            </Text>
          </View>
        ) : (
          <>
            <View style={styles.filterContainer}>
              <View style={styles.tabsRow}>
                {(['All', 'Active', 'Inactive'] as const).map((tab) => (
                  <TouchableOpacity activeOpacity={1}
                    key={tab}
                    style={[styles.tab, filter === tab && styles.activeTab]}
                    onPress={() => setFilter(tab)}
                  >
                    <Text style={[styles.tabText, filter === tab && styles.activeTabText]}>{tab}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.listContainer}>
              {filteredAreas.map((area) => (
                <View key={area.id} style={styles.card}>
                  <View style={styles.cardHeaderRow}>
                    <Text style={styles.cardTitle} numberOfLines={1}>{area.placeName || area.city || 'Service Area'}</Text>
                    <View style={[styles.statusBadge, area.status === 'Active' ? styles.statusBadgeActive : styles.statusBadgeInactive]}>
                      <Text style={[styles.statusText, area.status === 'Active' ? styles.statusActive : styles.statusInactive]}>
                        {area.status}
                      </Text>
                    </View>
                  </View>

                  {isISP && area.providerName ? (
                    <Text style={styles.metaText}>Provider: {area.providerName}</Text>
                  ) : null}
                  {isBSP && area.branchName ? (
                    <Text style={styles.metaText}>Branch: {area.branchName}</Text>
                  ) : null}
                  {area.dateAdded ? (
                    <Text style={styles.createdDate}>Created: {area.dateAdded}</Text>
                  ) : null}

                  <View style={styles.cardActions}>
                    <TouchableOpacity activeOpacity={1} style={styles.iconBtn} onPress={() => setViewArea(area)}>
                      <EyeIcon size={18} color="#3B82F6" />
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={1} style={styles.iconBtn} onPress={() => handleEdit(area)}>
                      <PencilIcon size={18} color="#0F172A" />
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={1} style={[styles.iconBtn, styles.iconBtnDelete]} onPress={() => setDeleteTarget(area)}>
                      <TrashIcon size={18} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </ScrollView>
          </>
        )}

        <View style={styles.footer}>
          <Button
            title="+ Add Service Area"
            onPress={handleAdd}
            variant="primary"
            style={{ backgroundColor: 'rgba(26, 15, 163, 1.00)', marginBottom: isApproved ? 0 : 12 }}
          />
          {!isApproved && (
            <Button
              title="Skip / Continue"
              onPress={async () => {
                await completeStepAndNavigate('partnerServiceAreaCreation', router, 'yet_to_start');
              }}
              variant="outline"
            />
          )}
        </View>
      </SafeAreaView>

      <DefineOperationalAreaModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        mode={modalMode}
        initialData={selectedArea}
        hideBranch={isISP}
        onSubmit={(data) => {
          const today = new Date();
          const dateAdded = today.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

          const branchName = isBSP ? (data.branch || branches[0]?.name || undefined) : undefined;

          const mapped: ServiceArea = {
            id: selectedArea?.id || Date.now().toString(),
            branchName,
            providerName: isISP ? providerName : undefined,
            distance: data.radius ? `${data.radius} km` : '',
            placeName: data.placeName || '',
            country: data.country || '',
            state: data.state || '',
            district: data.district || '',
            city: data.city || '',
            locationType: data.locationType || 'Urban',
            status: data.isActive ? 'Active' : 'Inactive',
            dateAdded: selectedArea?.dateAdded || dateAdded,
          };

          if (modalMode === 'create') {
            addArea(mapped).then(async () => {
              const updatedAreas = useServiceAreaStore.getState().areas;
              const status = updatedAreas.length > 0 ? 'completed' : 'yet_to_start';
              await StorageService.updateMandatoryFlowStep('partnerServiceAreaCreation', status);
            });
          } else if (selectedArea) {
            updateArea(selectedArea.id, mapped).then(async () => {
              const updatedAreas = useServiceAreaStore.getState().areas;
              const status = updatedAreas.length > 0 ? 'completed' : 'yet_to_start';
              await StorageService.updateMandatoryFlowStep('partnerServiceAreaCreation', status);
            });
          }
          setModalVisible(false);
        }}
      />

      {/* View Area Modal */}
      <Modal visible={!!viewArea} transparent animationType="slide" onRequestClose={() => setViewArea(null)}>
        <View style={styles.modalOverlay}>
          <TouchableOpacity activeOpacity={1} style={StyleSheet.absoluteFillObject} onPress={() => setViewArea(null)} />
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Service Area Details</Text>
              <TouchableOpacity activeOpacity={1} onPress={() => setViewArea(null)} style={styles.closeBtn}>
                <CloseXIcon size={22} color="#0F172A" />
              </TouchableOpacity>
            </View>
            {viewArea && (
              <View style={styles.viewRows}>
                {isISP && viewArea.providerName ? (
                  <View style={styles.viewRow}>
                    <Text style={styles.viewLabel}>Provider Name</Text>
                    <Text style={styles.viewValue}>{viewArea.providerName}</Text>
                  </View>
                ) : null}
                {isBSP && viewArea.branchName ? (
                  <View style={styles.viewRow}>
                    <Text style={styles.viewLabel}>Branch Name</Text>
                    <Text style={styles.viewValue}>{viewArea.branchName}</Text>
                  </View>
                ) : null}
                {([
                  ['Service Distance', viewArea.distance],
                  ['Place Name', viewArea.placeName],
                  ['Location Type', viewArea.locationType],
                  ['City', viewArea.city],
                  ['District', viewArea.district],
                  ['State', viewArea.state],
                  ['Country', viewArea.country],
                  ['Created', viewArea.dateAdded],
                ] as [string, string][]).map(([label, value]) => (
                  <View key={label} style={styles.viewRow}>
                    <Text style={styles.viewLabel}>{label}</Text>
                    <Text style={styles.viewValue}>{value}</Text>
                  </View>
                ))}
                <View style={styles.viewRow}>
                  <Text style={styles.viewLabel}>Status</Text>
                  <Text style={[styles.viewValue, viewArea.status === 'Active' ? styles.activeColor : styles.inactiveColor]}>
                    {viewArea.status}
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
              <Text style={styles.modalTitle}>Delete Service Area</Text>
              <TouchableOpacity activeOpacity={1} onPress={() => setDeleteTarget(null)} style={styles.closeBtn}>
                <CloseXIcon size={22} color="#0F172A" />
              </TouchableOpacity>
            </View>
            <Text style={styles.deleteMsg}>
              Are you sure you want to delete <Text style={{ fontWeight: '700' }}>{deleteTarget?.placeName || deleteTarget?.branchName}</Text>? This action cannot be undone.
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
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 16 },
  backButton: { marginRight: 12 },
  headerTitle: { flex: 1, fontSize: 16, fontWeight: '700', color: '#0F172A' },
  helpButton: { backgroundColor: '#F97316', paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20 },
  helpText: { color: '#FFFFFF', fontSize: 12, fontWeight: '600' },

  filterContainer: { paddingHorizontal: 20, marginBottom: 12 },
  tabsRow: { flexDirection: 'row', gap: 8 },
  tab: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#FFFFFF', elevation: 2 },
  activeTab: { backgroundColor: '#1A0FA3', elevation: 4 },
  tabText: { color: '#64748B', fontSize: 13, fontWeight: '500' },
  activeTabText: { color: '#FFFFFF' },

  listContainer: { paddingHorizontal: 20, paddingBottom: 20, gap: 12 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 16 },
  cardHeaderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 },
  cardTitle: { fontSize: 14, fontWeight: '700', color: '#0F172A', flex: 1, marginRight: 8 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 20 },
  statusBadgeActive: { backgroundColor: '#DCFCE7' },
  statusBadgeInactive: { backgroundColor: '#FEE2E2' },
  statusText: { fontSize: 11, fontWeight: '700' },
  statusActive: { color: '#16A34A' },
  statusInactive: { color: '#EF4444' },
  metaText: { fontSize: 11, color: '#64748B', marginTop: 2, fontWeight: '500' },
  createdDate: { fontSize: 11, color: '#94A3B8', marginTop: 2, marginBottom: 8 },
  cardBody: { gap: 4, marginBottom: 12, marginTop: 4 },
  detailRow: { flexDirection: 'row', alignItems: 'center' },
  bullet: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#94A3B8', marginRight: 8 },
  detailText: { fontSize: 12, color: '#475569' },
  cardActions: { flexDirection: 'row', gap: 8, justifyContent: 'flex-end', borderTopWidth: 1, borderTopColor: '#F1F5F9', paddingTop: 10 },
  iconBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#EEF2FF', justifyContent: 'center', alignItems: 'center' },
  iconBtnDelete: { backgroundColor: '#FEE2E2' },

  footer: { paddingHorizontal: 20, paddingBottom: 40, paddingTop: 16 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(15,23,42,0.45)', justifyContent: 'flex-end' },
  modalSheet: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 17, fontWeight: '700', color: '#0F172A' },
  closeBtn: { padding: 4 },
  viewRows: { gap: 4, paddingBottom: 8 },
  viewRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 9, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  viewLabel: { fontSize: 13, color: '#64748B', fontWeight: '500' },
  viewValue: { fontSize: 13, color: '#0F172A', fontWeight: '600', maxWidth: '55%', textAlign: 'right' },
  activeColor: { color: '#16A34A' },
  inactiveColor: { color: '#EF4444' },
  deleteMsg: { fontSize: 14, color: '#475569', lineHeight: 22, marginBottom: 24 },
  deleteActions: { flexDirection: 'row', gap: 12 },
  cancelBtn: { flex: 1, paddingVertical: 14, borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0', alignItems: 'center' },
  cancelBtnText: { fontSize: 14, fontWeight: '600', color: '#64748B' },
  deleteBtn: { flex: 1, paddingVertical: 14, borderRadius: 12, backgroundColor: 'rgba(26, 15, 163, 1.00)', alignItems: 'center' },
  deleteBtnText: { fontSize: 14, fontWeight: '700', color: '#FFFFFF' },
});

const emptyStyles = StyleSheet.create({
  body: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40 },
  illustrationWrap: { position: 'relative', width: 120, height: 120, marginBottom: 28 },
  outerCircle: { width: 120, height: 120, borderRadius: 60, backgroundColor: 'rgba(26,15,163,0.06)', justifyContent: 'center', alignItems: 'center' },
  innerCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(26,15,163,0.1)', justifyContent: 'center', alignItems: 'center' },
  starBadge: { position: 'absolute', bottom: 4, right: 4, width: 28, height: 28, borderRadius: 14, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center', elevation: 2 },
  title: { fontSize: 16, fontWeight: '700', color: '#0F172A', marginBottom: 8, textAlign: 'center' },
  subtitle: { fontSize: 13, color: '#94A3B8', textAlign: 'center', lineHeight: 20 },
});
