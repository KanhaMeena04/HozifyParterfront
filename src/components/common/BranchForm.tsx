import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Input } from '@/components/ui/Input';
import { PhoneInput } from '@/components/ui/PhoneInput';
import { SelectInput } from '@/components/ui/SelectInput';
import { Switch } from '@/components/ui/Switch';
import { Button } from '@/components/ui/Button';
import { BuildingIcon, UserGroupIcon, LocationPinIcon } from '@/components/ui/Icons';
import { Branch } from '@/types';
import { parsePhoneNumber, validatePhone } from '@/utils/validation';
import { SelectOptionsModal } from './SelectOptionsModal';

const MANAGERS = [
  { label: 'Jane Doe', value: 'Jane Doe' },
  { label: 'John Smith', value: 'John Smith' },
  { label: 'Alice Johnson', value: 'Alice Johnson' },
  { label: 'Robert Brown', value: 'Robert Brown' }
];

interface BranchFormProps {
  initialData?: Branch;
  onSubmit: (data: Omit<Branch, 'id'>) => void;
  mode: 'create' | 'update';
  visible?: boolean;
}

export function BranchForm({ initialData, onSubmit, mode, visible }: BranchFormProps) {
  const [name, setName] = useState(initialData?.name || '');
  const [managerName, setManagerName] = useState(initialData?.managerName || '');
  const [email, setEmail] = useState(initialData?.email || '');
  const [mobile, setMobile] = useState(initialData?.mobile || '');
  const [address, setAddress] = useState(initialData?.address || '');
  const [isActive, setIsActive] = useState(initialData?.isActive ?? true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [managerModalVisible, setManagerModalVisible] = useState(false);

  useEffect(() => {
    setName(initialData?.name || '');
    setManagerName(initialData?.managerName || '');
    setEmail(initialData?.email || '');
    setMobile(initialData?.mobile || '');
    setAddress(initialData?.address || '');
    setIsActive(initialData?.isActive ?? true);
    setErrors({});
  }, [visible, initialData]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = 'Branch Name is required';
    if (!managerName.trim()) newErrors.managerName = 'Manager Name is required';
    
    if (!email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = 'Invalid email format';

    if (!mobile.trim()) {
      newErrors.mobile = 'Required';
    } else {
      const { localNumber } = parsePhoneNumber(mobile);
      if (localNumber.length !== 10) {
        newErrors.mobile = 'Must be 10 digits';
      } else if (!validatePhone(mobile)) {
        newErrors.mobile = 'Invalid mobile number';
      }
    }
    if (!address.trim()) newErrors.address = 'Address is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      onSubmit({
        name,
        managerName,
        email,
        mobile,
        address,
        isActive,
      });
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      {/* Branch Details Card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.iconBox}><BuildingIcon size={20} color="#1E293B" /></View>
          <Text style={styles.cardTitle}>Branch Details</Text>
        </View>
        <Input
          label="Branch Name *"
          value={name}
          onChangeText={(t) => { setName(t); if(errors.name) setErrors(prev => ({...prev, name: ''})) }}
          placeholder="Enter branch name"
          error={errors.name}
          style={{ marginBottom: 0 }}
        />
      </View>

      {/* Manager Details Card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.iconBox}><UserGroupIcon size={20} color="#1E293B" /></View>
          <Text style={styles.cardTitle}>Manager Details</Text>
        </View>
        <SelectInput
          label="Manager Name *"
          value={managerName}
          placeholder="Select"
          onPress={() => setManagerModalVisible(true)}
          style={{ marginBottom: 16 }}
        />
        <Input
          label="Branch Email ID *"
          value={email}
          onChangeText={(t) => { setEmail(t); if(errors.email) setErrors(prev => ({...prev, email: ''})) }}
          placeholder="email id"
          keyboardType="email-address"
          error={errors.email}
          style={{ marginBottom: 16 }}
        />
        <PhoneInput
          label="Branch Phone *"
          value={mobile}
          onChangeText={(text) => {
            setMobile(text);
            setErrors({ ...errors, mobile: '' });
          }}
          placeholder="Mobile number"
          error={errors.mobile}
          style={{ marginBottom: 0 }}
        />
      </View>

      {/* Location Card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.iconBox}><LocationPinIcon size={20} color="#1E293B" /></View>
          <Text style={styles.cardTitle}>Location</Text>
        </View>
        <Input
          label="Street Address *"
          value={address}
          onChangeText={(t) => { setAddress(t); if(errors.address) setErrors(prev => ({...prev, address: ''})) }}
          placeholder="123 Business Rd, Suite 100"
          error={errors.address}
          inputStyle={{ minHeight: 80, textAlignVertical: 'top' }}
          multiline
          style={{ marginBottom: 0 }}
        />
      </View>

      {/* Branch Status Card (Only in Update) */}
      {mode === 'update' && (
        <View style={styles.card}>
          <View style={styles.statusRow}>
            <View>
              <Text style={styles.statusTitle}>Branch Status</Text>
              <Text style={styles.statusSubtitle}>Toggle to active / inactive</Text>
            </View>
            <Switch value={isActive} onValueChange={setIsActive} />
          </View>
        </View>
      )}

      <Button
        title={mode === 'create' ? "Create Branch" : "Update Branch"}
        onPress={handleSubmit}
        variant="primary"
        style={styles.submitButton}
      />
      <SelectOptionsModal
        visible={managerModalVisible}
        onClose={() => setManagerModalVisible(false)}
        title="Select Manager"
        options={MANAGERS}
        onSelect={(value) => {
          setManagerName(value);
          setErrors({ ...errors, managerName: '' });
        }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  content: { padding: 16, gap: 16, paddingBottom: 40 },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    boxShadow: '0px 4px 16px rgba(15, 23, 42, 0.05)',
    elevation: 2,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, gap: 12 },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 6,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#1E293B' },
  statusRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  statusTitle: { fontSize: 14, fontWeight: '600', color: '#1E293B', marginBottom: 4 },
  statusSubtitle: { fontSize: 12, color: '#94A3B8' },
  submitButton: { marginTop: 8 },
});
