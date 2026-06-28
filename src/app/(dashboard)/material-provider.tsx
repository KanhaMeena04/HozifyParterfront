import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { useLocalSearchParams } from 'expo-router';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { BackArrowIcon } from '@/components/ui/Icons';
import Svg, { Path, Circle } from 'react-native-svg';
import { useAndroidBack } from '@/hooks/useAndroidBack';

const CheckedRadioCircle = ({ color = 'rgba(26, 15, 163, 1.00)' }) => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" />
    <Circle cx="12" cy="12" r="5" fill={color} />
  </Svg>
);

const UncheckedRadioCircle = ({ color = '#CBD5E1' }) => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" />
  </Svg>
);

const VerifiedBadgeIcon = ({ color = 'rgba(26, 15, 163, 1.00)', size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" fill="#EEF2FF" />
    <Path d="M9 12l2 2 4-4" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const UserOutlineIcon = ({ color = '#64748B', size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <Circle cx="12" cy="7" r="4" stroke={color} strokeWidth="1.5" />
  </Svg>
);

const InfoIcon = ({ color = '#3B82F6', size = 18 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" fill="#EFF6FF" stroke={color} strokeWidth="2" />
    <Path d="M12 16v-4M12 8h.01" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

const ArrowRightIcon = ({ color = '#FFFFFF', size = 16 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M5 12h14M12 5l7 7-7 7" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export default function MaterialProviderScreen() {
  useAndroidBack();
  const router = useSafeRouter();
  const { bookingId } = useLocalSearchParams<{ bookingId: string }>();
  const [provider, setProvider] = useState<'customer' | 'hozify'>('hozify');

  const handleContinue = () => {
    if (provider === 'customer') {
      alert('Selected: Customer will arrange and provide materials.');
      router.back();
    } else {
      router.push({
        pathname: '/(dashboard)/raise-material-request',
        params: { bookingId }
      });
    }
  };

  return (
    <GradientBackground style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        
        {/* Navigation Header */}
        <View style={styles.header}>
          <TouchableOpacity activeOpacity={1} onPress={() => router.back()} style={styles.backButton}>
            <BackArrowIcon size={24} color="#0F172A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Material Provider</Text>
          <Image source={{ uri: 'https://i.pravatar.cc/150?img=11' }} style={styles.avatar} />
        </View>

        {/* Progress Bar Indicator */}
        <View style={styles.progressSection}>
          <View style={styles.progressLabelRow}>
            <Text style={styles.progressStepText}>STEP 2 OF 4</Text>
            <Text style={styles.progressStatusText}>Selection</Text>
          </View>
          <View style={styles.progressBarBase}>
            <View style={styles.progressBarActive} />
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.mainHeading}>Who provides materials?</Text>
          <Text style={styles.mainSub}>
            Choose how the necessary materials will be sourced for this service request.
          </Text>

          {/* Option 1: Customer */}
          <TouchableOpacity activeOpacity={1} 
            style={[styles.optionCard, provider === 'customer' && styles.optionCardSelected]} 
            onPress={() => setProvider('customer')}
          >
            <View style={styles.radioWrapper}>
              {provider === 'customer' ? <CheckedRadioCircle /> : <UncheckedRadioCircle />}
            </View>
            <View style={styles.optionTextCol}>
              <Text style={styles.optionTitle}>Customer will Provide</Text>
              <Text style={styles.optionDesc}>Customer will arrange and provide the material</Text>
            </View>
            <UserOutlineIcon />
          </TouchableOpacity>

          {/* Option 2: Hozify */}
          <TouchableOpacity activeOpacity={1} 
            style={[styles.optionCard, provider === 'hozify' && styles.optionCardSelected]} 
            onPress={() => setProvider('hozify')}
          >
            <View style={styles.radioWrapper}>
              {provider === 'hozify' ? <CheckedRadioCircle /> : <UncheckedRadioCircle />}
            </View>
            <View style={styles.optionTextCol}>
              <Text style={styles.optionTitle}>Hozify will Provide</Text>
              <Text style={styles.optionDesc}>
                Hozify partners will source and bring all necessary materials. Costs will be added to the final invoice.
              </Text>
            </View>
            <VerifiedBadgeIcon />
          </TouchableOpacity>

          {/* Info Banner */}
          <View style={styles.infoBanner}>
            <InfoIcon />
            <Text style={styles.infoBannerText}>
              Selecting 'Hozify will Provide' ensures all materials meet our quality standards and includes a 30-day warranty on the supplies used.
            </Text>
          </View>

        </ScrollView>

        {/* Action Button */}
        <View style={styles.footer}>
          <TouchableOpacity activeOpacity={1} style={styles.continueBtn} onPress={handleContinue}>
            <Text style={styles.continueBtnText}>Continue</Text>
            <ArrowRightIcon />
          </TouchableOpacity>
        </View>

      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: 20, 
    paddingTop: 16, 
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  backButton: { marginRight: 12 },
  headerTitle: { fontSize: 16, fontWeight: '700', color: '#0F172A', flex: 1 },
  avatar: { width: 32, height: 32, borderRadius: 16 },

  progressSection: { backgroundColor: '#FFFFFF', paddingHorizontal: 20, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  progressLabelRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  progressStepText: { fontSize: 10, fontWeight: '700', color: 'rgba(26, 15, 163, 1.00)', letterSpacing: 0.5 },
  progressStatusText: { fontSize: 10, fontWeight: '600', color: '#64748B' },
  progressBarBase: { height: 4, backgroundColor: '#EFF6FF', borderRadius: 2, overflow: 'hidden' },
  progressBarActive: { width: '50%', height: '100%', backgroundColor: 'rgba(26, 15, 163, 1.00)' },

  content: { padding: 24, gap: 16 },
  mainHeading: { fontSize: 20, fontWeight: '800', color: '#1E1B4B' },
  mainSub: { fontSize: 12, color: '#64748B', lineHeight: 18, marginBottom: 16 },

  optionCard: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#FFFFFF', 
    borderWidth: 1, 
    borderColor: '#E2E8F0', 
    borderRadius: 16, 
    padding: 16, 
    minHeight: 80
  },
  optionCardSelected: { 
    borderColor: 'rgba(26, 15, 163, 1.00)', 
    backgroundColor: '#FFFFFF',
  },
  radioWrapper: { marginRight: 12 },
  optionTextCol: { flex: 1, marginRight: 8 },
  optionTitle: { fontSize: 14, fontWeight: '700', color: '#0F172A', marginBottom: 4 },
  optionDesc: { fontSize: 11, color: '#64748B', lineHeight: 16 },

  infoBanner: { 
    flexDirection: 'row', 
    backgroundColor: '#EFF6FF', 
    borderRadius: 16, 
    padding: 16, 
    gap: 10, 
    alignItems: 'flex-start',
    marginTop: 12
  },
  infoBannerText: { flex: 1, fontSize: 11, color: '#1E40AF', lineHeight: 16, fontWeight: '500' },

  footer: { 
    position: 'absolute', 
    bottom: 0, 
    left: 0, 
    right: 0, 
    backgroundColor: '#FFFFFF', 
    borderTopWidth: 1, 
    borderTopColor: '#E2E8F0',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 24 : 12
  },
  continueBtn: { 
    backgroundColor: 'rgba(26, 15, 163, 1.00)',
    height: 48, 
    borderRadius: 12, 
    flexDirection: 'row',
    justifyContent: 'center', 
    alignItems: 'center',
    gap: 8
  },
  continueBtnText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' }
});
