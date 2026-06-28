import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Platform } from 'react-native';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { PhoneInput } from '@/components/ui/PhoneInput';
import { Switch } from '@/components/ui/Switch';
import { Employee } from '@/types';
import { parsePhoneNumber, validatePhone } from '@/utils/validation';
import { SearchableDropdown } from '@/components/common/SearchableDropdown';

const DUMMY_BRANCHES = ["Downtown Branch", "North Zone", "East Hub", "South City", "West End"];
const DUMMY_ROLES = ["Manager", "Supervisor", "Technician", "Cleaner", "Electrician", "Plumber"];
const DUMMY_SERVICES = ["AC Repair", "Cleaning", "Plumbing", "Electrical", "Carpentry"];
const DUMMY_SUB_SERVICES = ["Deep Cleaning", "Standard Cleaning", "Installation", "Uninstallation", "Repair", "Maintenance"];

interface EmployeeFormProps {
  mode: 'create' | 'update';
  initialData?: Employee;
  onSubmit: (data: any) => void;
  visible?: boolean;
}

export function EmployeeForm({ mode, initialData, onSubmit, visible }: EmployeeFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    branchName: initialData?.branchName || '',
    role: initialData?.role || '',
    mainService: initialData?.mainService || '',
    subService: initialData?.subService || '',
    experience: initialData?.experience || '',
    mobileNumber: initialData?.mobileNumber || '',
    isActive: initialData?.isActive ?? true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setFormData({
      name: initialData?.name || '',
      branchName: initialData?.branchName || '',
      role: initialData?.role || '',
      mainService: initialData?.mainService || '',
      subService: initialData?.subService || '',
      experience: initialData?.experience || '',
      mobileNumber: initialData?.mobileNumber || '',
      isActive: initialData?.isActive ?? true,
    });
    setErrors({});
  }, [visible, initialData]);

  const handleSubmit = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Required';
    else if (!/^[A-Za-z\s]+$/.test(formData.name)) newErrors.name = 'Only alphabets allowed';
    
    if (!formData.branchName.trim()) newErrors.branchName = 'Required';
    if (!formData.role.trim()) newErrors.role = 'Required';
    if (!formData.mainService.trim()) newErrors.mainService = 'Required';
    
    if (!formData.subService.trim()) newErrors.subService = 'Required';
    
    if (!formData.experience.trim()) {
      newErrors.experience = 'Required';
    } else if (!/^\d{1,2}$/.test(formData.experience.trim())) {
      newErrors.experience = 'Must be a valid 1-2 digit number';
    }

    if (!formData.mobileNumber.trim()) {
      newErrors.mobileNumber = 'Required';
    } else {
      const { localNumber } = parsePhoneNumber(formData.mobileNumber);
      if (localNumber.length !== 10) {
        newErrors.mobileNumber = 'Must be 10 digits';
      } else if (!validatePhone(formData.mobileNumber)) {
        newErrors.mobileNumber = 'Invalid mobile number';
      }
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    onSubmit(formData);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {mode === "create" ? "New Staff Member" : "Update Staff Member"}
      </Text>
      <Text style={styles.subtitle}>
        Enter details to add a new employee to your branch.
      </Text>

      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.scrollContent}
      >
        <Input
          label="Employee Name"
          value={formData.name}
          onChangeText={(text) => {
            const sanitized = text.replace(/[^A-Za-z\s]/g, '');
            setFormData({ ...formData, name: sanitized });
            setErrors({ ...errors, name: "" });
          }}
          placeholder="Enter Name"
          error={errors.name}
        />

        <SearchableDropdown
          label="Branch Name"
          value={formData.branchName}
          options={DUMMY_BRANCHES}
          onChange={(text) => {
            setFormData({ ...formData, branchName: text });
            setErrors({ ...errors, branchName: "" });
          }}
          placeholder="Enter Branch Name"
          required
          error={errors.branchName}
        />

        <SearchableDropdown
          label="Role Designation"
          value={formData.role}
          options={DUMMY_ROLES}
          onChange={(text) => {
            setFormData({ ...formData, role: text });
            setErrors({ ...errors, role: "" });
          }}
          placeholder="Enter Service Provider"
          required
          error={errors.role}
        />

        <SearchableDropdown
          label="Partner Service"
          value={formData.mainService}
          options={DUMMY_SERVICES}
          onChange={(text) => {
            setFormData({ ...formData, mainService: text, subService: "" });
            setErrors({ ...errors, mainService: "" });
          }}
          placeholder="Enter Partner Service"
          required
          error={errors.mainService}
        />

        <SearchableDropdown
          label="Sub Services"
          value={formData.subService}
          options={DUMMY_SUB_SERVICES}
          onChange={(text) => {
            setFormData({ ...formData, subService: text });
            setErrors({ ...errors, subService: "" });
          }}
          placeholder="Enter Sub Services"
          required
          error={errors.subService}
        />

        <Input
          label="Professional Experience"
          value={formData.experience}
          onChangeText={(text) => {
            const sanitized = text.replace(/[^0-9]/g, '').slice(0, 2);
            setFormData({ ...formData, experience: sanitized });
            setErrors({ ...errors, experience: "" });
          }}
          placeholder="Enter Experience in years"
          keyboardType="numeric"
          required
          error={errors.experience}
        />

        <PhoneInput
          label="Mobile Number"
          value={formData.mobileNumber}
          onChangeText={(text) => {
            setFormData({ ...formData, mobileNumber: text });
            setErrors({ ...errors, mobileNumber: "" });
          }}
          placeholder="Mobile number"
          required
          error={errors.mobileNumber}
        />

        {mode === "update" && (
          <View style={styles.statusContainer}>
            <View>
              <Text style={styles.statusLabel}>Employee Status</Text>
              <Text style={styles.statusDesc}>Toggle to active / inactive</Text>
            </View>
            <Switch
              value={formData.isActive}
              onValueChange={(val) =>
                setFormData({ ...formData, isActive: val })
              }
            />
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title={mode === "create" ? "Save New Employee" : "Update Employee"}
          onPress={handleSubmit}
          variant="primary"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    marginBottom: 20,
  },
  statusLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
  },
  statusDesc: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },
  footer: {
    paddingTop: 16,
    paddingBottom: Platform.OS === 'ios' ? 8 : 0,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
});
