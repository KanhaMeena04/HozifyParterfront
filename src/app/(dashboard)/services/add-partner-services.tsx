import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, KeyboardAvoidingView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { SelectInput } from '@/components/ui/SelectInput';
import { Button } from '@/components/ui/Button';
import { BackArrowIcon } from '@/components/ui/Icons';
import { useAuthStore } from '@/store/authStore';

export default function AddPartnerServicesScreen() {
  const router = useSafeRouter();
  const role = useAuthStore(state => state.role);

  const [form, setForm] = useState({
    category: '',
    subCategory: '',
    service: '',
    pricing: '',
    duration: '',
    materialRequired: 'No',
    description: '',
  });

  const [isLoading, setIsLoading] = useState(false);

  const updateForm = (key: keyof typeof form, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.back();
    }, 1500);
  };

  return (
    <GradientBackground style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity activeOpacity={1} onPress={() => router.back()} style={styles.backButton}>
            <BackArrowIcon size={24} color="#0F172A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {role === 'BS' ? 'Add Seller Service' : 'Add Partner Service'}
          </Text>
        </View>

        <Card style={styles.card}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            
            <Text style={styles.sectionTitle}>Service Details</Text>
            
            <SelectInput 
              label="Category" 
              value={form.category} 
              placeholder="Select category"
              onPress={() => updateForm('category', 'Appliance Repair')} 
            />
            
            <SelectInput 
              label="Sub Category" 
              value={form.subCategory} 
              placeholder="Select sub category"
              onPress={() => updateForm('subCategory', 'AC Repair')} 
            />

            <Input
              label="Service Name"
              required
              placeholder="Enter service name"
              value={form.service}
              onChangeText={(t) => updateForm('service', t)}
            />

            <View style={styles.row}>
              <View style={styles.col}>
                <Input
                  label="Pricing (₹)"
                  required
                  placeholder="0.00"
                  keyboardType="numeric"
                  value={form.pricing}
                  onChangeText={(t) => updateForm('pricing', t)}
                />
              </View>
              <View style={styles.col}>
                <Input
                  label="Duration (mins)"
                  required
                  placeholder="60"
                  keyboardType="numeric"
                  value={form.duration}
                  onChangeText={(t) => updateForm('duration', t)}
                />
              </View>
            </View>

            <SelectInput 
              label="Materials Required?" 
              value={form.materialRequired} 
              placeholder="Yes/No"
              onPress={() => updateForm('materialRequired', form.materialRequired === 'Yes' ? 'No' : 'Yes')} 
            />

            <Input
              label="Service Description"
              placeholder="Enter details about what is included..."
              value={form.description}
              onChangeText={(t) => updateForm('description', t)}
              multiline
              numberOfLines={4}
            />

            <Button
              title="Save Service"
              onPress={handleSave}
              isLoading={isLoading}
              variant="primary"
              style={styles.saveBtn}
            />
          </ScrollView>
        </Card>
        </KeyboardAvoidingView>
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
  card: { flex: 1, backgroundColor: '#FFFFFF', borderRadius: 24, marginHorizontal: 16, marginBottom: 16, overflow: 'hidden' },
  scrollContent: { padding: 20, paddingBottom: 40 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#0F172A', marginBottom: 16 },
  row: { flexDirection: 'row', gap: 12 },
  col: { flex: 1 },
  saveBtn: { marginTop: 16 },
});
