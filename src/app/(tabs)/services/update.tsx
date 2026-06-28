import { useSafeRouter } from '@/hooks/useSafeRouter';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {  useLocalSearchParams } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Checkbox } from '@/components/ui/Checkbox';
import { Switch } from '@/components/ui/Switch';
import { ChevronUpIcon, CloseIcon } from '@/components/ui/Icons';
import { useServicesStore } from '@/store/servicesStore';
import { useAndroidBack } from '@/hooks/useAndroidBack';

export default function UpdateServicesModal() {
  useAndroidBack();
  const router = useSafeRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { services, updateService } = useServicesStore();
  
  const [service, setService] = useState(services.find(s => s.id === id));
  const [active, setActive] = useState(service?.active ?? true);
  
  // Create local state for subservices to handle individual experience inputs
  const [localSubs, setLocalSubs] = useState(service?.subServices.map(s => ({...s})) || []);

  useEffect(() => {
    if (!service) {
      router.back();
    }
  }, [service]);

  if (!service) return null;

  const toggleSub = (subId: string) => {
    setLocalSubs(prev => prev.map(s => s.id === subId ? { ...s, selected: !s.selected } : s));
  };

  const updateExperience = (subId: string, exp: string) => {
    const sanitized = exp.replace(/[^0-9]/g, '').slice(0, 2);
    setLocalSubs(prev => prev.map(s => s.id === subId ? { ...s, yearsOfExperience: sanitized } : s));
  };

  const handleUpdate = () => {
    let hasValidationErrors = false;
    localSubs.forEach(sub => {
      if (sub.selected) {
        if (!sub.yearsOfExperience?.trim()) {
          hasValidationErrors = true;
        } else if (!/^\d{1,2}$/.test(sub.yearsOfExperience.trim())) {
          hasValidationErrors = true;
        }
      }
    });

    if (hasValidationErrors) {
      import('react-native').then(({ Alert }) => {
        Alert.alert('Validation Error', 'Please enter a valid numeric experience (1-2 digits) for selected services.');
      });
      return;
    }

    updateService(service.id, {
      active,
      subServices: localSubs
    });
    router.back();
  };

  return (
    <View style={styles.modalOverlay}>
      <TouchableOpacity activeOpacity={1} style={styles.modalBackdrop} onPress={() => router.back()} />
      
      <View style={styles.modalContent}>
        <View style={styles.modalWhiteBg}>
          {Platform.OS !== 'web' && <View style={styles.dragHandle} />}
          <TouchableOpacity activeOpacity={1} style={styles.closeButton} onPress={() => router.back()}>
            <CloseIcon size={24} color="#64748B" />
          </TouchableOpacity>
          <View style={styles.header}>
            <Text style={styles.title}>Update Services</Text>
            <Text style={styles.subtitle}>Choose the service categories and sub-services you will provide.</Text>
          </View>

          <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
            <View style={styles.accordionContainer}>
              <View style={styles.accordionHeader}>
                <Text style={styles.accordionTitle}>{service.name}</Text>
                <ChevronUpIcon size={20} />
              </View>
              
              <View style={styles.accordionBody}>
                {localSubs.map(sub => (
                  <View key={sub.id} style={styles.subItem}>
                    <Checkbox 
                      checked={sub.selected} 
                      onChange={() => toggleSub(sub.id)} 
                      label={sub.name} 
                    />
                    <View style={styles.experienceWrapper}>
                      <Text style={styles.expLabel}>Total Years of Experience</Text>
                      <Input 
                        placeholder="Enter years"
                        value={sub.yearsOfExperience} 
                        onChangeText={(t) => updateExperience(sub.id, t)} 
                        keyboardType="numeric" 
                        rightIcon={<Text style={styles.unitText}>Years</Text>}
                      />
                    </View>
                  </View>
                ))}

                <View style={styles.statusToggleContainer}>
                  <View>
                    <Text style={styles.statusLabel}>Partner Service Status</Text>
                    <Text style={styles.statusSubLabel}>Toggle to active / inactive</Text>
                  </View>
                  <Switch value={active} onValueChange={setActive} />
                </View>

              </View>
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <Button title="Update service" onPress={handleUpdate} variant="primary" />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    ...Platform.select({
      web: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
      },
      default: {
        justifyContent: 'flex-end',
      },
    }),
  },
  modalBackdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: {
    overflow: 'hidden',
    ...Platform.select({
      web: {
        borderRadius: 24,
        width: '90%',
        maxWidth: 600,
        maxHeight: '85%',
        boxShadow: '0px 8px 32px rgba(15, 23, 42, 0.15)',
        elevation: 8,
      },
      default: {
        height: '85%',
        width: '100%',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
      },
    }),
  },
  dragHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#CBD5E1',
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 4,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
    padding: 8,
  },
  modalWhiteBg: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { padding: 24, paddingBottom: 16 },
  title: { fontSize: 20, fontWeight: '700', color: '#0F172A', marginBottom: 8 },
  subtitle: { fontSize: 13, color: '#64748B', lineHeight: 20 },
  scroll: { flex: 1, paddingHorizontal: 24 },
  
  accordionContainer: { borderWidth: 1, borderColor: '#F1F5F9', borderRadius: 12, marginBottom: 24, overflow: 'hidden' },
  accordionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: '#F8FAFC' },
  accordionTitle: { fontSize: 14, fontWeight: '600', color: '#0F172A' },
  accordionBody: { padding: 16, backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: '#F1F5F9' },
  
  subItem: { marginBottom: 20 },
  experienceWrapper: { marginTop: 12 },
  expLabel: { fontSize: 13, fontWeight: '600', color: '#0F172A', marginBottom: 8 },
  unitText: { fontSize: 14, color: '#94A3B8' },

  statusToggleContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8, paddingTop: 20, borderTopWidth: 1, borderTopColor: '#F1F5F9' },
  statusLabel: { fontSize: 14, fontWeight: '600', color: '#0F172A', marginBottom: 2 },
  statusSubLabel: { fontSize: 12, color: '#94A3B8' },

  footer: { padding: 24, borderTopWidth: 1, borderTopColor: '#F1F5F9' }
});
