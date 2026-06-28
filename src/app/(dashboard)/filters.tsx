import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { BackArrowIcon } from '@/components/ui/Icons';
import Svg, { Rect, Defs, LinearGradient, Stop, Path } from 'react-native-svg';
import { useAndroidBack } from '@/hooks/useAndroidBack';

const CalendarIcon = () => (
  <Svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <Rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="rgba(26, 15, 163, 1.00)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M16 2v4M8 2v4M3 10h18" stroke="rgba(26, 15, 163, 1.00)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const CheckboxChecked = () => (
  <View style={[styles.checkbox, styles.checkboxActive]}>
    <Svg width="12" height="12" viewBox="0 0 24 24" fill="none">
      <Path d="M20 6L9 17l-5-5" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  </View>
);

const CheckboxUnchecked = () => (
  <View style={styles.checkbox} />
);

export default function FiltersScreen() {
  useAndroidBack();
  const router = useSafeRouter();
  const [types, setTypes] = useState({
    order: true,
    transfer: false,
    qr: false,
  });

  const toggleType = (key: keyof typeof types) => {
    setTypes(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <GradientBackground style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        
        <View style={styles.header}>
          <TouchableOpacity activeOpacity={1} onPress={() => router.back()} style={styles.backButton}>
            <BackArrowIcon size={24} color="#0F172A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Filters</Text>
        </View>

        <View style={styles.contentArea}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            
            <Text style={styles.sectionTitle}>Select a date range of 7 days</Text>
            
            <View style={styles.dateRow}>
              <TouchableOpacity activeOpacity={1} style={styles.dateBtn}>
                <CalendarIcon />
                <Text style={styles.dateText}>Start date</Text>
              </TouchableOpacity>
              
              <TouchableOpacity activeOpacity={1} style={styles.dateBtn}>
                <CalendarIcon />
                <Text style={styles.dateText}>End date</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.sectionTitle}>Transaction type</Text>
            
            <TouchableOpacity activeOpacity={1} style={styles.checkboxRow} onPress={() => toggleType('order')}>
              {types.order ? <CheckboxChecked /> : <CheckboxUnchecked />}
              <Text style={styles.checkboxLabel}>Order</Text>
            </TouchableOpacity>

            <TouchableOpacity activeOpacity={1} style={styles.checkboxRow} onPress={() => toggleType('transfer')}>
              {types.transfer ? <CheckboxChecked /> : <CheckboxUnchecked />}
              <Text style={styles.checkboxLabel}>Money Transfer</Text>
            </TouchableOpacity>

            <TouchableOpacity activeOpacity={1} style={styles.checkboxRow} onPress={() => toggleType('qr')}>
              {types.qr ? <CheckboxChecked /> : <CheckboxUnchecked />}
              <Text style={styles.checkboxLabel}>QR Pay</Text>
            </TouchableOpacity>

          </ScrollView>

          <View style={styles.bottomBar}>
            <TouchableOpacity activeOpacity={1} style={styles.resetBtn} onPress={() => setTypes({ order: false, transfer: false, qr: false })}>
              <Text style={styles.resetText}>Reset</Text>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={1} style={styles.applyBtn} onPress={() => router.back()}>
              <Text style={styles.applyText}>Apply</Text>
            </TouchableOpacity>
          </View>
        </View>

      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1,  },
  
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 16 },
  backButton: { marginRight: 12 },
  headerTitle: { fontSize: 16, fontWeight: '800', color: '#0F172A', flex: 1 },
  
  contentArea: { flex: 1, backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, overflow: 'hidden' },
  scrollContent: { padding: 24 },

  sectionTitle: { fontSize: 14, color: '#0F172A', fontWeight: '500', marginBottom: 16, marginTop: 8 },
  
  dateRow: { flexDirection: 'row', gap: 12, marginBottom: 32 },
  dateBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderWidth: 1, borderColor: '#F1F5F9', borderRadius: 8, paddingVertical: 12 },
  dateText: { fontSize: 13, color: '#0F172A', fontWeight: '500' },

  checkboxRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  checkbox: { width: 22, height: 22, borderRadius: 4, borderWidth: 1, borderColor: '#CBD5E1', marginRight: 16, justifyContent: 'center', alignItems: 'center' },
  checkboxActive: { backgroundColor: 'rgba(26, 15, 163, 1.00)', borderColor: 'rgba(26, 15, 163, 1.00)' },
  checkboxLabel: { fontSize: 14, color: '#0F172A' },

  bottomBar: { flexDirection: 'row', gap: 16, padding: 24, paddingBottom: Platform.OS === 'ios' ? 40 : 24, borderTopWidth: 1, borderTopColor: '#F1F5F9' },
  resetBtn: { flex: 1, borderWidth: 1, borderColor: '#0F172A', borderRadius: 24, paddingVertical: 14, alignItems: 'center' },
  resetText: { color: '#0F172A', fontSize: 14, fontWeight: '600' },
  applyBtn: { flex: 1, backgroundColor: 'rgba(26, 15, 163, 1.00)', borderRadius: 24, paddingVertical: 14, alignItems: 'center' },
  applyText: { color: '#FFFFFF', fontSize: 14, fontWeight: '600' },
});
