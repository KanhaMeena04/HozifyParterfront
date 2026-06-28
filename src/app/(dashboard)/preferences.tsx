import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { BackArrowIcon } from '@/components/ui/Icons';
import Svg, { Path, Rect } from 'react-native-svg';
import { useAndroidBack } from '@/hooks/useAndroidBack';

const CheckboxIcon = ({ checked = false, color = 'rgba(26, 15, 163, 1.00)' }) => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <Rect x="3" y="3" width="18" height="18" rx="4" fill={checked ? color : 'transparent'} stroke={checked ? color : '#CBD5E1'} strokeWidth="2" />
    {checked && <Path d="M8 12L11 15L16 9" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />}
  </Svg>
);

export default function PreferencesScreen() {
  useAndroidBack();
  const router = useSafeRouter();
  
  // State for all preferences
  const [prefs, setPrefs] = useState({
    emailPromotions: true,
    emailInvoice: true,
    smsInvoice: true,
    smsPromotions: true,
    whatsappUpdates: true,
    pushNotifications: true,
    pip: true,
  });

  const togglePref = (key: keyof typeof prefs) => {
    setPrefs(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <GradientBackground style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        
        <View style={styles.header}>
          <TouchableOpacity activeOpacity={1} onPress={() => router.back()} style={styles.backButton}>
            <BackArrowIcon size={24} color="#0F172A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Preferences</Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          <View style={styles.card}>
            
            <Text style={styles.sectionTitle}>Email</Text>
            
            <TouchableOpacity activeOpacity={1} style={styles.prefRow} onPress={() => togglePref('emailPromotions')}>
              <Text style={styles.prefText}>Allow emails for promotions and offers</Text>
              <CheckboxIcon checked={prefs.emailPromotions} />
            </TouchableOpacity>
            
            <TouchableOpacity activeOpacity={1} style={styles.prefRow} onPress={() => togglePref('emailInvoice')}>
              <Text style={styles.prefText}>Allow emails for invoice</Text>
              <CheckboxIcon checked={prefs.emailInvoice} />
            </TouchableOpacity>

            <View style={styles.divider} />
            
            <Text style={styles.sectionTitle}>SMS & Whatsapp</Text>
            
            <TouchableOpacity activeOpacity={1} style={styles.prefRow} onPress={() => togglePref('smsInvoice')}>
              <Text style={styles.prefText}>Allow SMS for invoice</Text>
              <CheckboxIcon checked={prefs.smsInvoice} />
            </TouchableOpacity>
            
            <TouchableOpacity activeOpacity={1} style={styles.prefRow} onPress={() => togglePref('smsPromotions')}>
              <Text style={styles.prefText}>Allow promotional SMS offers</Text>
              <CheckboxIcon checked={prefs.smsPromotions} />
            </TouchableOpacity>
            
            <TouchableOpacity activeOpacity={1} style={styles.prefRow} onPress={() => togglePref('whatsappUpdates')}>
              <Text style={styles.prefText}>Allow updates to be sent on whatsapp</Text>
              <CheckboxIcon checked={prefs.whatsappUpdates} />
            </TouchableOpacity>

            <View style={styles.divider} />
            
            <Text style={styles.sectionTitle}>Push Notifications</Text>
            
            <TouchableOpacity activeOpacity={1} style={styles.prefRow} onPress={() => togglePref('pushNotifications')}>
              <Text style={styles.prefText}>Allow mobile push notifications</Text>
              <CheckboxIcon checked={prefs.pushNotifications} />
            </TouchableOpacity>

            <View style={styles.divider} />
            
            <Text style={styles.sectionTitle}>Picture in picture (PIP)</Text>
            
            <TouchableOpacity activeOpacity={1} style={styles.prefRow} onPress={() => togglePref('pip')}>
              <Text style={styles.prefText}>Allow picture in picture access</Text>
              <CheckboxIcon checked={prefs.pip} />
            </TouchableOpacity>

          </View>

        </ScrollView>
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1,  },
  
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 16 },
  backButton: { marginRight: 12 },
  headerTitle: { fontSize: 16, fontWeight: '700', color: '#0F172A', flex: 1 },

  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },

  card: { backgroundColor: '#FFFFFF', borderRadius: 24, padding: 20 },
  
  sectionTitle: { fontSize: 12, fontWeight: '700', color: '#0F172A', marginTop: 16, marginBottom: 12 },
  
  prefRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12 },
  prefText: { flex: 1, fontSize: 12, color: '#0F172A', fontWeight: '500', marginRight: 16 },

  divider: { height: 1, backgroundColor: '#F1F5F9', marginVertical: 12 },
});
