import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, TextInput } from 'react-native';
import { Button } from '@/components/ui/Button';
import { Checkbox } from '@/components/ui/Checkbox';
import { Switch } from '@/components/ui/Switch';
import { CloseIcon, ChevronDownIcon } from '@/components/ui/Icons';
import Svg, { Path } from 'react-native-svg';

const BRANCH_OPTIONS = ['Main Branch', 'South Branch', 'East Branch', 'North Branch', 'West Branch'];

interface ServiceOption {
  id: string;
  name: string;
  selected: boolean;
  experience?: string;
}

interface ServiceCategory {
  id: string;
  name: string;
  isExpanded: boolean;
  options: ServiceOption[];
}

interface MapServicesModalProps {
  visible: boolean;
  onClose: () => void;
  mode: 'create' | 'update';
  initialData?: any;
  onSubmit: (data: any) => void;
}

const INITIAL_SERVICES: ServiceCategory[] = [
  {
    id: '1',
    name: 'Plumbing',
    isExpanded: true,
    options: [
      { id: '1-1', name: 'Pipe Leak Repair', selected: false },
      { id: '1-2', name: 'Drain Cleaning', selected: false },
      { id: '1-3', name: 'Water Heater Installation', selected: false },
    ]
  },
  {
    id: '2',
    name: 'Cleaning',
    isExpanded: false,
    options: [
      { id: '2-1', name: 'House Cleaning', selected: false },
      { id: '2-2', name: 'Office Cleaning', selected: false },
    ]
  },
  {
    id: '3',
    name: 'Electrical',
    isExpanded: false,
    options: [
      { id: '3-1', name: 'Wiring', selected: false },
      { id: '3-2', name: 'Appliance Repair', selected: false },
    ]
  }
];

export const MapServicesModal: React.FC<MapServicesModalProps> = ({ visible, onClose, mode, initialData, onSubmit }) => {
  const [branch, setBranch] = useState(initialData?.branchName || initialData?.branch || '');
  const [branchDropdownOpen, setBranchDropdownOpen] = useState(false);
  const [isActive, setIsActive] = useState<boolean>(initialData ? initialData.status === 'Active' : true);

  const buildServices = (data: any) => {
    if (!data?.services) return INITIAL_SERVICES;
    return INITIAL_SERVICES.map(cat => ({
      ...cat,
      options: cat.options.map(opt => {
        const existing = data.services.find((s: any) => s.name?.toLowerCase() === opt.name.toLowerCase());
        return existing ? { ...opt, selected: true, experience: existing.experience || '' } : opt;
      }),
    }));
  };

  const [services, setServices] = useState<ServiceCategory[]>(buildServices(initialData));

  useEffect(() => {
    if (visible) {
      setBranch(initialData?.branchName || initialData?.branch || '');
      setIsActive(initialData ? initialData.status === 'Active' : true);
      setServices(buildServices(initialData));
    }
  }, [visible, initialData]);

  const toggleCategory = (categoryId: string) => {
    setServices(prev => prev.map(c => c.id === categoryId ? { ...c, isExpanded: !c.isExpanded } : c));
  };

  const toggleOption = (categoryId: string, optionId: string) => {
    setServices(prev => prev.map(c => {
      if (c.id === categoryId) {
        return {
          ...c,
          options: c.options.map(o => o.id === optionId ? { ...o, selected: !o.selected } : o)
        };
      }
      return c;
    }));
  };

  const updateExperience = (categoryId: string, optionId: string, value: string) => {
    const sanitized = value.replace(/[^0-9]/g, '').slice(0, 2);
    setServices(prev => prev.map(c => {
      if (c.id === categoryId) {
        return {
          ...c,
          options: c.options.map(o => o.id === optionId ? { ...o, experience: sanitized } : o)
        };
      }
      return c;
    }));
  };

  const handleSubmit = () => {
    if (!branch.trim()) {
      import('react-native').then(({ Alert }) => {
        Alert.alert('Validation Error', 'Please select a branch.');
      });
      return;
    }
    
    let hasSelected = false;
    let hasExpError = false;
    services.forEach(cat => {
      cat.options.forEach(opt => {
        if (opt.selected) {
          hasSelected = true;
          if (mode === 'update') {
            if (!opt.experience?.trim() || !/^\d{1,2}$/.test(opt.experience.trim())) {
              hasExpError = true;
            }
          }
        }
      });
    });

    if (!hasSelected) {
      import('react-native').then(({ Alert }) => {
        Alert.alert('Validation Error', 'Please assign at least one service.');
      });
      return;
    }
    if (hasExpError) {
      import('react-native').then(({ Alert }) => {
        Alert.alert('Validation Error', 'Please enter a valid numeric experience for selected services.');
      });
      return;
    }

    onSubmit({ branch, services, isActive });
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            
            <View style={styles.header}>
              <View style={styles.headerTopRow}>
                <Text style={styles.title}>Map Services to Branch</Text>
                <TouchableOpacity activeOpacity={1} onPress={onClose} style={styles.closeBtn}>
                  <CloseIcon size={16} color="#64748B" />
                </TouchableOpacity>
              </View>
              <Text style={styles.subtitle}>Select a branch and assign the services they will handle.</Text>
            </View>

            <View style={[styles.section, { zIndex: 100 }]}>
              <Text style={styles.sectionTitle}>Select Branch *</Text>
              <TouchableOpacity activeOpacity={1}
                style={styles.dropdownTrigger}
                onPress={() => setBranchDropdownOpen(o => !o)}
              >
                <Text style={[styles.dropdownTriggerText, !branch && styles.dropdownPlaceholder]}>
                  {branch || 'Select branch'}
                </Text>
              </TouchableOpacity>
              {branchDropdownOpen && (
                <View style={styles.dropdownMenu}>
                  {BRANCH_OPTIONS.map((opt) => (
                    <TouchableOpacity activeOpacity={1}
                      key={opt}
                      style={[styles.dropdownOption, branch === opt && styles.dropdownOptionActive]}
                      onPress={() => { setBranch(opt); setBranchDropdownOpen(false); }}
                    >
                      <Text style={[styles.dropdownOptionText, branch === opt && styles.dropdownOptionTextActive]}>
                        {opt}
                      </Text>
                      {branch === opt && (
                        <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
                          <Path d="M5 13L9 17L19 7" stroke="rgba(26,15,163,1)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                        </Svg>
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Assign Services *</Text>
              <Text style={styles.subtitle}>Choose which services and sub-services this branch offers.</Text>
              
              <View style={styles.accordionContainer}>
                {services.map((cat, index) => (
                  <View key={cat.id} style={[styles.accordionCard, index > 0 && styles.accordionCardBorder]}>
                    <TouchableOpacity activeOpacity={1} style={styles.accordionHeader} onPress={() => toggleCategory(cat.id)}>
                      <Text style={styles.accordionTitle}>{cat.name}</Text>
                      <View style={{ transform: [{ rotate: cat.isExpanded ? '180deg' : '0deg' }] }}>
                        <ChevronDownIcon size={20} color="#64748B" />
                      </View>
                    </TouchableOpacity>
                    
                    {cat.isExpanded && (
                      <View style={styles.accordionBody}>
                        {cat.options.map(opt => (
                          <View key={opt.id} style={styles.optionRow}>
                            <View style={styles.checkboxContainer}>
                              <Checkbox 
                                label={opt.name} 
                                checked={opt.selected} 
                                onChange={() => toggleOption(cat.id, opt.id)} 
                              />
                            </View>
                            
                            {mode === 'update' && opt.selected && (
                              <View style={styles.experienceContainer}>
                                <Text style={styles.expLabel}>Total Years of Experience</Text>
                                <View style={styles.expInputBox}>
                                  <TextInput 
                                    style={styles.expInput} 
                                    placeholder="Enter years"
                                    keyboardType="numeric"
                                    value={opt.experience || ''}
                                    onChangeText={(val) => updateExperience(cat.id, opt.id, val)}
                                  />
                                  <Text style={styles.expSuffix}>Years</Text>
                                </View>
                              </View>
                            )}
                          </View>
                        ))}
                      </View>
                    )}
                  </View>
                ))}
              </View>
            </View>

            {mode === 'update' && (
              <View style={styles.statusSection}>
                <View style={styles.statusTextContainer}>
                  <Text style={styles.statusTitle}>Mapping Status</Text>
                  <Text style={styles.statusSubtitle}>Toggle to active / inactive</Text>
                </View>
                <Switch value={isActive} onValueChange={setIsActive} />
              </View>
            )}

          </ScrollView>

          <View style={styles.footer}>
            <Button 
              title={mode === 'update' ? "Update Service Mapping" : "Save Mapping"} 
              onPress={handleSubmit} 
              variant="primary" 
              style={{ backgroundColor: 'rgba(26, 15, 163, 1.00)' }}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: '90%', flex: 1 },
  scrollContent: { padding: 24, paddingBottom: 40 },
  header: { marginBottom: 24 },
  headerTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  title: { fontSize: 18, fontWeight: '700', color: '#0F172A' },
  closeBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center' },
  subtitle: { fontSize: 13, color: '#64748B', lineHeight: 20 },
  
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: '#0F172A', marginBottom: 12 },
  
  inputBox: { borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 12, paddingHorizontal: 16, height: 48, backgroundColor: '#FFFFFF', fontSize: 14, color: '#0F172A' },
  dropdownTrigger: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 12, paddingHorizontal: 16, height: 48, backgroundColor: '#FFFFFF' },
  dropdownTriggerText: { fontSize: 14, color: '#0F172A', fontWeight: '500', flex: 1 },
  dropdownPlaceholder: { color: '#94A3B8', fontWeight: '400' },
  dropdownMenu: { position: 'absolute', top: 90, left: 0, right: 0, backgroundColor: '#FFFFFF', borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0', elevation: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8, zIndex: 200 },
  dropdownOption: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#F8FAFC' },
  dropdownOptionActive: { backgroundColor: 'rgba(26,15,163,0.05)' },
  dropdownOptionText: { fontSize: 14, color: '#334155' },
  dropdownOptionTextActive: { fontWeight: '700', color: 'rgba(26,15,163,1)' },
  dropdownBox: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 12, paddingHorizontal: 16, height: 48, backgroundColor: '#FFFFFF' },
  dropdownText: { fontSize: 14, color: '#0F172A', fontWeight: '500' },
  
  accordionContainer: { borderWidth: 1, borderColor: '#F1F5F9', borderRadius: 12, marginTop: 16, backgroundColor: '#FFFFFF', overflow: 'hidden' },
  accordionCard: { backgroundColor: '#FFFFFF' },
  accordionCardBorder: { borderTopWidth: 1, borderTopColor: '#F1F5F9' },
  accordionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 },
  accordionTitle: { fontSize: 14, fontWeight: '600', color: '#334155' },
  accordionBody: { paddingHorizontal: 16, paddingBottom: 16, borderTopWidth: 1, borderTopColor: '#F8FAFC' },
  
  optionRow: { marginTop: 16 },
  checkboxContainer: { flexDirection: 'row', alignItems: 'center' },
  
  experienceContainer: { marginTop: 12 },
  expLabel: { fontSize: 12, color: '#0F172A', fontWeight: '500', marginBottom: 6 },
  expInputBox: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8, paddingHorizontal: 12, height: 40, backgroundColor: '#FFFFFF' },
  expInput: { flex: 1, fontSize: 13, color: '#0F172A' },
  expSuffix: { fontSize: 13, color: '#64748B', marginLeft: 8 },

  statusSection: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderWidth: 1, borderColor: '#F1F5F9', borderRadius: 12, marginBottom: 24 },
  statusTextContainer: { flex: 1 },
  statusTitle: { fontSize: 14, fontWeight: '600', color: '#0F172A', marginBottom: 2 },
  statusSubtitle: { fontSize: 12, color: '#94A3B8' },

  footer: { padding: 24, paddingTop: 16, borderTopWidth: 1, borderTopColor: '#F1F5F9', backgroundColor: '#FFFFFF' }
});
