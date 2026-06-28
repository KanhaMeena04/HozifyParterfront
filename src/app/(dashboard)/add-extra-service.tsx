import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, TextInput, KeyboardAvoidingView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { BackArrowIcon } from '@/components/ui/Icons';
import Svg, { Path, Rect } from 'react-native-svg';
import { useAndroidBack } from '@/hooks/useAndroidBack';

const CheckboxIcon = ({ checked = false, color = 'rgba(26, 15, 163, 1.00)' }) => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <Rect x="3" y="3" width="18" height="18" rx="4" fill={checked ? color : '#F8FAFC'} stroke={checked ? color : '#F1F5F9'} strokeWidth="2" />
    {checked && <Path d="M8 12L11 15L16 9" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />}
  </Svg>
);

export default function AddExtraServiceScreen() {
  useAndroidBack();
  const router = useSafeRouter();

  const [services, setServices] = useState([
    { id: '1', title: 'Gas Filling', price: 500, selected: true },
    { id: '2', title: 'AC Deep Cleaning', price: 400, selected: true },
    { id: '3', title: 'Thermostat Replacement', price: 650, selected: false },
    { id: '4', title: 'Capacitor Replacement', price: 350, selected: false },
    { id: '5', title: 'Fan Motor Replacement', price: 750, selected: false },
  ]);

  const [customAmount, setCustomAmount] = useState('');

  const toggleSelect = (id: string) => {
    setServices(services.map(s => s.id === id ? { ...s, selected: !s.selected } : s));
  };

  const calculateTotal = () => {
    let total = services.filter(s => s.selected).reduce((acc, curr) => acc + curr.price, 0);
    if (customAmount) {
      total += parseInt(customAmount) || 0;
    }
    return total;
  };

  return (
    <GradientBackground style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flexArea}>
          
          <View style={styles.header}>
            <TouchableOpacity activeOpacity={1} onPress={() => router.back()} style={styles.backButton}>
              <BackArrowIcon size={24} color="#0F172A" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Add Extra Service</Text>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            
            <View style={styles.mainCard}>
              
              <Text style={styles.sectionTitle}>SELECT EXTRA SERVICE</Text>
              
              <View style={styles.listContainer}>
                {services.map(service => (
                  <TouchableOpacity activeOpacity={1} 
                    key={service.id} 
                    style={[styles.serviceRow, service.selected && styles.serviceRowSelected]}
                    onPress={() => toggleSelect(service.id)}
                  >
                    <View style={styles.serviceRowLeft}>
                      <CheckboxIcon checked={service.selected} />
                      <Text style={[styles.serviceTitle, service.selected && styles.serviceTitleSelected]}>{service.title}</Text>
                    </View>
                    <Text style={[styles.servicePrice, service.selected && styles.servicePriceSelected]}>₹{service.price}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={[styles.sectionTitle, { marginTop: 8 }]}>CUSTOM AMOUNT</Text>
              <View style={styles.inputBox}>
                <TextInput 
                  style={styles.textInput}
                  placeholder="Enter amount"
                  placeholderTextColor="#94A3B8"
                  keyboardType="numeric"
                  value={customAmount}
                  onChangeText={setCustomAmount}
                />
                <Text style={styles.currencySymbol}>₹</Text>
              </View>

            </View>

          </ScrollView>

          {/* Sticky Bottom Bar */}
          <View style={styles.bottomBar}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total Amount</Text>
              <Text style={styles.totalValue}>₹{calculateTotal()}</Text>
            </View>
            <TouchableOpacity activeOpacity={1} style={styles.addBtn} onPress={() => router.back()}>
              <Text style={styles.addBtnText}>Add Service</Text>
            </TouchableOpacity>
          </View>

        </KeyboardAvoidingView>
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1,  },
  flexArea: { flex: 1 },
  
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 16 },
  backButton: { marginRight: 12 },
  headerTitle: { fontSize: 16, fontWeight: '700', color: '#0F172A', flex: 1 },

  scrollContent: { paddingHorizontal: 16, paddingBottom: 24 },

  mainCard: { backgroundColor: '#FFFFFF', borderRadius: 24, padding: 20 },

  sectionTitle: { fontSize: 11, fontWeight: '700', color: '#475569', letterSpacing: 0.5, marginBottom: 16 },

  listContainer: { marginBottom: 24 },
  
  serviceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 16, borderRadius: 12, borderWidth: 1, borderColor: '#F8FAFC', marginBottom: 12 },
  serviceRowSelected: { backgroundColor: '#EEF2FF', borderColor: '#DBEAFE' },
  
  serviceRowLeft: { flexDirection: 'row', alignItems: 'center' },
  serviceTitle: { fontSize: 12, color: '#475569', marginLeft: 12 },
  serviceTitleSelected: { color: '#0F172A', fontWeight: '500' },
  
  servicePrice: { fontSize: 13, fontWeight: '700', color: '#475569' },
  servicePriceSelected: { color: '#0F172A' },

  inputBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 12, borderWidth: 1, borderColor: '#F1F5F9', paddingHorizontal: 16 },
  textInput: { flex: 1, height: 50, fontSize: 13, color: '#0F172A' },
  currencySymbol: { fontSize: 13, color: '#94A3B8' },

  bottomBar: { paddingHorizontal: 16, paddingBottom: 24, paddingTop: 8 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FAFAF9', paddingHorizontal: 20, paddingVertical: 16, borderRadius: 16, marginBottom: 16 },
  totalLabel: { fontSize: 12, color: '#475569' },
  totalValue: { fontSize: 18, fontWeight: '800', color: 'rgba(26, 15, 163, 1.00)' },

  addBtn: { backgroundColor: 'rgba(26, 15, 163, 1.00)', paddingVertical: 16, borderRadius: 16, alignItems: 'center' },
  addBtnText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
});
