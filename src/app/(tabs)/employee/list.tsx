import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, FlatList, Modal, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Checkbox } from '@/components/ui/Checkbox';
import { Input } from '@/components/ui/Input';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { BackArrowIcon, EmployeeIcon, OutlineStarIcon } from '@/components/ui/Icons';
import { Button } from '@/components/ui/Button';
import { useEmployeeStore } from '@/store/employeeStore';
import { EmployeeModal } from '@/components/common/EmployeeModal';
import { EmployeeDetailsModal } from '@/components/common/EmployeeDetailsModal';
import Svg, { Path, Circle, Rect } from 'react-native-svg';

const ViewIcon = () => (
  <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
    <Path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <Circle cx="12" cy="12" r="3" stroke="#3B82F6" strokeWidth="1.5"/>
  </Svg>
);

const EditIcon = () => (
  <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
    <Path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="#EAB308" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M18.5 2.50023C18.8978 2.1024 19.4374 1.87891 20 1.87891C20.5626 1.87891 21.1022 2.1024 21.5 2.50023C21.8978 2.89805 22.1213 3.43762 22.1213 4.00023C22.1213 4.56284 21.8978 5.1024 21.5 5.50023L12 15.0002L8 16.0002L9 12.0002L18.5 2.50023Z" stroke="#EAB308" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);



const PayoutIcon = () => (
  <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
    <Path d="M12 1V23M17 5H9.5C8.57174 5 7.6815 5.36875 7.02513 6.02513C6.36875 6.6815 6 7.57174 6 8.5C6 9.42826 6.36875 10.3185 7.02513 10.9749C7.6815 11.6313 8.57174 12 9.5 12H14.5C15.4283 12 16.3185 12.3687 16.9749 13.0251C17.6313 13.6815 18 14.5717 18 15.5C18 16.4283 17.6313 17.3185 16.9749 17.9749C16.3185 18.6313 15.4283 19 14.5 19H6" stroke="#16A34A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

const DeleteIcon = () => (
  <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
    <Path d="M3 6H5H21" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6L18.1 20.1C18.0428 20.6234 17.7877 21.1062 17.3872 21.4497C16.9867 21.7931 16.4709 21.9726 15.944 21.9516L8.056 21.9516C7.52907 21.9726 7.01331 21.7931 6.6128 21.4497C6.21229 21.1062 5.95718 20.6234 5.9 20.1L5 6H19Z" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M10 11V17M14 11V17" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);
import { Employee } from '@/types';
import { useAndroidBack } from '@/hooks/useAndroidBack';
import { RoleAccessGuard } from '@/components/common/RoleAccessGuard';
import { completeStepAndNavigate } from '@/utils/onboarding';
import { StorageService } from '@/services/storage.service';

export default function EmployeeListScreen() {
  const router = useSafeRouter();
  const { employees, initialize, updateEmployee, addEmployee, deleteEmployee } = useEmployeeStore();
  const [filter, setFilter] = useState<'All' | 'Active' | 'Inactive'>('All');
  
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'update'>('create');
  
  const [isDetailsVisible, setIsDetailsVisible] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Employee | null>(null);
  const [deleteStep, setDeleteStep] = useState<'reason' | 'confirm'>('reason');
  const [selectedReasons, setSelectedReasons] = useState<Record<string, boolean>>({});
  const [otherReasonText, setOtherReasonText] = useState('');
  const [isApproved, setIsApproved] = useState(false);

  const handleBack = () => {
    if (isApproved) {
      router.back();
    } else {
      router.replace('/(tabs)');
    }
  };

  useAndroidBack(handleBack);

  useEffect(() => {
    initialize();
    const checkApproval = async () => {
      const session = await StorageService.getUserSession();
      if (session?.isApproved) {
        setIsApproved(true);
      }
    };
    checkApproval();
  }, []);

  const filteredEmployees = employees.filter(e => {
    if (filter === 'Active') return e.isActive;
    if (filter === 'Inactive') return !e.isActive;
    return true;
  });

  const handleEdit = (item: Employee) => {
    setModalMode('update');
    setSelectedEmployee(item);
    setIsModalVisible(true);
  };

  const handleView = (item: Employee) => {
    setSelectedEmployee(item);
    setIsDetailsVisible(true);
  };



  const renderItem = ({ item }: { item: Employee }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={{ flex: 1 }}>
          <Text style={styles.employeeName}>Employee Name : {item.name}</Text>
          <Text style={styles.createdDateText}>Created Date : {item.createdAt || '08 May 2024'}</Text>
        </View>
        <Text style={[styles.statusText, !item.isActive && styles.statusInactive]}>
          {item.isActive ? 'Active' : 'Inactive'}
        </Text>
      </View>

      <View style={styles.actionsRow}>
        <TouchableOpacity activeOpacity={1} style={styles.actionButton} onPress={() => handleView(item)}>
          <ViewIcon />
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={1} style={styles.actionButton} onPress={() => handleEdit(item)}>
          <EditIcon />
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={1} 
          style={styles.actionButton} 
          onPress={() => router.push({
            pathname: '/(tabs)/employee/payouts',
            params: { employeeId: item.id }
          })}
        >
          <PayoutIcon />
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={1} 
          style={styles.actionButton} 
          onPress={() => {
            setDeleteTarget(item);
            setDeleteStep('reason');
            setSelectedReasons({});
            setOtherReasonText('');
          }}
        >
          <DeleteIcon />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <>
    <RoleAccessGuard allowedRoles={['BSP', 'BS']}>
      <GradientBackground style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity activeOpacity={1} onPress={handleBack} style={styles.backButton}>
            <BackArrowIcon size={24} color="#0F172A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>List of Employee</Text>
          <TouchableOpacity activeOpacity={1} style={styles.helpButton} onPress={() => router.push('/(dashboard)/help')}>
            <Text style={styles.helpText}>Help</Text>
          </TouchableOpacity>
        </View>

        {/* Filters */}
        <View style={styles.filterContainer}>
          <View style={styles.tabsRow}>
            {['All', 'Active', 'Inactive'].map((tab) => (
              <TouchableOpacity activeOpacity={1}
                key={tab}
                style={[styles.tab, filter === tab && styles.activeTab]}
                onPress={() => setFilter(tab as any)}
              >
                <Text style={[styles.tabText, filter === tab && styles.activeTabText]}>
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* List */}
        <FlatList
          data={filteredEmployees}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={[styles.listContent, filteredEmployees.length === 0 && { flexGrow: 1 }]}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconWrapper}>
                <View style={styles.emptyIconCircle}>
                  <EmployeeIcon size={40} color="#3B82F6" />
                </View>
                <View style={styles.emptyStarBadge}>
                  <OutlineStarIcon size={16} color="#3B82F6" />
                </View>
              </View>
              <Text style={styles.emptyTitle}>No Employee Added Yet</Text>
              <Text style={styles.emptySubtitle}>Add your team members to manage{'\n'}bookings and assignments</Text>
            </View>
          }
        />
        
        <View style={styles.footer}>
          <Button 
            title="+ Add Employee" 
            onPress={() => {
              setModalMode('create');
              setSelectedEmployee(null);
              setIsModalVisible(true);
            }} 
            variant="primary"
            style={isApproved ? undefined : { marginBottom: 12 }}
          />
          {!isApproved && (
            <Button
              title="Skip / Continue"
              onPress={async () => {
                await completeStepAndNavigate('branchEmployeeMapping', router, 'completed');
              }}
              variant="outline"
            />
          )}
        </View>
      </SafeAreaView>

      <EmployeeModal 
        visible={isModalVisible} 
        onClose={() => {
          setIsModalVisible(false);
          setTimeout(() => setSelectedEmployee(null), 300);
        }} 
        mode={modalMode} 
        initialData={selectedEmployee || undefined}
        onSubmit={(data) => {
          if (modalMode === 'update' && selectedEmployee) {
            updateEmployee(selectedEmployee.id, data);
          } else {
            addEmployee(data);
          }
        }}
      />

      <EmployeeDetailsModal
        visible={isDetailsVisible}
        onClose={() => setIsDetailsVisible(false)}
        employee={selectedEmployee}
      />



    </GradientBackground>
    </RoleAccessGuard>

    <Modal visible={!!deleteTarget} transparent animationType="slide" onRequestClose={() => setDeleteTarget(null)}>
      <View style={styles.modalOverlay}>
        <TouchableOpacity activeOpacity={1} style={StyleSheet.absoluteFillObject} onPress={() => setDeleteTarget(null)} />
        <View style={styles.modalSheet}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Delete Employee</Text>
            <TouchableOpacity activeOpacity={1} onPress={() => setDeleteTarget(null)} style={styles.closeBtn}>
              <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
                <Path d="M18 6L6 18M6 6L18 18" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </Svg>
            </TouchableOpacity>
          </View>

          {deleteStep === 'reason' ? (
            <View>
              <Text style={styles.deleteSubTitle}>Select reason(s) for deletion:</Text>
              <View style={styles.reasonsContainer}>
                {['Poor performance', 'Behavior issues', 'Left job voluntarily', 'Insubordination', 'Other reason'].map((reason) => (
                  <Checkbox
                    key={reason}
                    label={reason}
                    checked={!!selectedReasons[reason]}
                    onChange={(checked) => {
                      setSelectedReasons((prev) => ({ ...prev, [reason]: checked }));
                    }}
                  />
                ))}
              </View>

              {selectedReasons['Other reason'] && (
                <Input
                  placeholder="Specify other reason..."
                  value={otherReasonText}
                  onChangeText={setOtherReasonText}
                  style={styles.reasonInput}
                />
              )}

              <View style={styles.deleteActions}>
                <TouchableOpacity activeOpacity={1} style={styles.cancelBtn} onPress={() => setDeleteTarget(null)}>
                  <Text style={styles.cancelBtnText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={1}
                  style={styles.deleteBtn}
                  onPress={() => {
                    const hasSelected = Object.keys(selectedReasons).some((k) => selectedReasons[k]);
                    if (!hasSelected) {
                      Alert.alert('Validation Error', 'Please select at least one reason.');
                      return;
                    }
                    if (selectedReasons['Other reason'] && !otherReasonText.trim()) {
                      Alert.alert('Validation Error', 'Please specify the other reason.');
                      return;
                    }
                    setDeleteStep('confirm');
                  }}
                >
                  <Text style={styles.deleteBtnText}>Continue</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View>
              <Text style={styles.deleteMsg}>
                Are you sure you want to delete <Text style={{ fontWeight: '700' }}>{deleteTarget?.name}</Text>? This action cannot be undone.
              </Text>
              <View style={styles.deleteActions}>
                <TouchableOpacity activeOpacity={1} style={styles.cancelBtn} onPress={() => setDeleteStep('reason')}>
                  <Text style={styles.cancelBtnText}>Back</Text>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={1}
                  style={styles.deleteBtn}
                  onPress={() => {
                    if (deleteTarget) {
                      deleteEmployee(deleteTarget.id);
                      setDeleteTarget(null);
                    }
                  }}
                >
                  <Text style={styles.deleteBtnText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </View>
    </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1,  },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16 },
  backButton: { marginRight: 12 },
  headerTitle: { flex: 1, fontSize: 16, fontWeight: '700', color: '#0F172A' },
  helpButton: { backgroundColor: '#FF8A00', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  helpText: { color: '#FFF', fontSize: 12, fontWeight: '600' },
  filterContainer: { paddingHorizontal: 20, marginBottom: 12 },
  tabsRow: { flexDirection: 'row', gap: 8 },
  tab: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#FFFFFF', elevation: 2 },
  activeTab: { backgroundColor: '#1A0FA3', elevation: 4 },
  tabText: { color: '#64748B', fontSize: 14, fontWeight: '500' },
  activeTabText: { color: '#FFFFFF' },
  listContent: { paddingHorizontal: 20, paddingBottom: 40, gap: 12 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 24, padding: 20 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, gap: 8 },
  employeeName: { fontSize: 14, fontWeight: '600', color: '#334155' },
  createdDateText: { fontSize: 11, color: '#64748B', marginTop: 4, fontWeight: '500' },
  statusText: { fontSize: 11, fontWeight: '700', color: '#22C55E' },
  statusInactive: { color: '#EF4444' },
  actionsRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
  actionButton: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  actionButtonText: { fontSize: 10, color: '#0F172A', fontWeight: '500' },
  
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 80 },
  emptyIconWrapper: { position: 'relative', marginBottom: 24 },
  emptyIconCircle: { width: 120, height: 120, borderRadius: 60, backgroundColor: '#E0E7FF', justifyContent: 'center', alignItems: 'center' },
  emptyStarBadge: { position: 'absolute', bottom: 0, right: 0, width: 32, height: 32, borderRadius: 16, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center', boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)', elevation: 2 },
  emptyTitle: { fontSize: 20, fontWeight: '700', color: '#0F172A', textAlign: 'center', marginBottom: 12 },
  emptySubtitle: { fontSize: 13, color: '#94A3B8', textAlign: 'center', lineHeight: 20 },

  footer: { paddingHorizontal: 20, paddingBottom: 40, paddingTop: 16 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(15,23,42,0.45)', justifyContent: 'flex-end' },
  modalSheet: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 17, fontWeight: '700', color: '#0F172A' },
  closeBtn: { padding: 4 },
  deleteMsg: { fontSize: 14, color: '#475569', lineHeight: 22, marginBottom: 24 },
  deleteSubTitle: { fontSize: 14, fontWeight: '600', color: '#475569', marginBottom: 12 },
  reasonsContainer: { marginBottom: 16 },
  reasonInput: { marginBottom: 16 },
  deleteActions: { flexDirection: 'row', gap: 12 },
  cancelBtn: { flex: 1, paddingVertical: 14, borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0', alignItems: 'center' },
  cancelBtnText: { fontSize: 14, fontWeight: '600', color: '#64748B' },
  deleteBtn: { flex: 1, paddingVertical: 14, borderRadius: 12, backgroundColor: 'rgba(26, 15, 163, 1.00)', alignItems: 'center' },
  deleteBtnText: { fontSize: 14, fontWeight: '700', color: '#FFFFFF' },
});
