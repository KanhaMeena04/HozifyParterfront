import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Platform, KeyboardAvoidingView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import Svg, { Path, Circle } from 'react-native-svg';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { BackArrowIcon, LocationPinIcon, ClockCircleIcon } from '@/components/ui/Icons';
import { useAndroidBack } from '@/hooks/useAndroidBack';

// GPS Compass/Target Icon
const GpsIcon = ({ size = 20, color = 'rgba(26, 15, 163, 1.00)' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="7" stroke={color} strokeWidth="2" />
    <Path d="M12 2V5M12 19V22M2 12H5M19 12H22" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Circle cx="12" cy="12" r="2" fill={color} />
  </Svg>
);

// Home Outline Icon
const HomeOutlineIcon = ({ size = 22, color = '#1E293B' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M3 10L12 3L21 10V20C21 20.55 20.55 21 20 21H15V14H9V21H4C3.45 21 3 20.55 3 20V10Z" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export default function LocationScreen() {
  useAndroidBack();
  const router = useSafeRouter();
  const [activeSegment, setActiveSegment] = useState<'Urban' | 'Rural'>('Urban');
  const [searchQuery, setSearchQuery] = useState('');
  const [addressQuery, setAddressQuery] = useState('');

  return (
    <GradientBackground style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>

        {/* Transparent Header with Back Action */}
        <View style={styles.header}>
          <TouchableOpacity activeOpacity={1} onPress={() => router.back()} style={styles.backButton}>
            <BackArrowIcon size={24} color="#0F172A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Location Setup</Text>
        </View>

        {/* White Card Overlay containing the forms */}
        <View style={styles.cardContainer}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            
            {/* Segment Switch: Urban / Rural */}
            <View style={styles.segmentContainer}>
              <TouchableOpacity activeOpacity={1} 
                style={[styles.segmentBtn, activeSegment === 'Urban' && styles.segmentBtnActive]}
                onPress={() => setActiveSegment('Urban')}
              >
                <Text style={[styles.segmentText, activeSegment === 'Urban' && styles.segmentTextActive]}>
                  Urban
                </Text>
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={1} 
                style={[styles.segmentBtn, activeSegment === 'Rural' && styles.segmentBtnActive]}
                onPress={() => setActiveSegment('Rural')}
              >
                <Text style={[styles.segmentText, activeSegment === 'Rural' && styles.segmentTextActive]}>
                  Rural
                </Text>
              </TouchableOpacity>
            </View>

            {/* Input 1: Search City / District */}
            <View style={styles.inputWrapper}>
              <View style={styles.iconBox}>
                <LocationPinIcon size={20} color="#94A3B8" />
              </View>
              <TextInput
                style={styles.textInput}
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder={activeSegment === 'Urban' ? 'Search City...' : 'Search District...'}
                placeholderTextColor="#94A3B8"
              />
            </View>

            {/* Input 2: Search location/society */}
            <View style={styles.inputWrapper}>
              <TouchableOpacity activeOpacity={1} onPress={() => router.back()} style={styles.iconBox}>
                <BackArrowIcon size={20} color="#94A3B8" />
              </TouchableOpacity>
              <TextInput
                style={styles.textInput}
                value={addressQuery}
                onChangeText={setAddressQuery}
                placeholder="Search for your location/society/ap"
                placeholderTextColor="#94A3B8"
              />
            </View>

            {/* Use Current Location Row */}
            <TouchableOpacity activeOpacity={1} style={styles.gpsRow}>
              <GpsIcon size={20} color="rgba(26, 15, 163, 1.00)" />
              <Text style={styles.gpsText}>Use current location</Text>
            </TouchableOpacity>

            <View style={styles.divider} />

            {/* Favorites Section */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Favorites</Text>
            </View>
            
            <TouchableOpacity activeOpacity={1} style={styles.favoriteCard}>
              <View style={styles.favoriteIconWrapper}>
                <HomeOutlineIcon size={20} color="rgba(26, 15, 163, 1.00)" />
              </View>
              <View style={styles.favoriteDetails}>
                <Text style={styles.favoriteTitle}>Home</Text>
                <Text style={styles.favoriteAddress}>
                  510, JP Nagar 7th Phase, Bengaluru, Karnataka, India
                </Text>
              </View>
            </TouchableOpacity>

            {/* Recents Section */}
            <View style={[styles.sectionHeader, { marginTop: 16 }]}>
              <Text style={styles.sectionTitle}>Recents</Text>
            </View>

            <View style={styles.recentsList}>
              <TouchableOpacity activeOpacity={1} style={styles.recentItem}>
                <View style={styles.recentIconWrapper}>
                  <ClockCircleIcon size={18} color="#94A3B8" />
                </View>
                <View style={styles.recentDetails}>
                  <Text style={styles.recentTitle}>Tirupati</Text>
                  <Text style={styles.recentSub}>Andhra Pradesh, India</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity activeOpacity={1} style={styles.recentItem}>
                <View style={styles.recentIconWrapper}>
                  <ClockCircleIcon size={18} color="#94A3B8" />
                </View>
                <View style={styles.recentDetails}>
                  <Text style={styles.recentTitle}>Guntur</Text>
                  <Text style={styles.recentSub}>Andhra Pradesh, India</Text>
                </View>
              </TouchableOpacity>
            </View>

            {/* Footer: Powered by Google */}
            <View style={styles.footer}>
              <Text style={styles.poweredText}>
                powered by{' '}
                <Text style={{ fontWeight: '700', color: '#4285F4' }}>G</Text>
                <Text style={{ fontWeight: '700', color: '#EA4335' }}>o</Text>
                <Text style={{ fontWeight: '700', color: '#FBBC05' }}>o</Text>
                <Text style={{ fontWeight: '700', color: '#4285F4' }}>g</Text>
                <Text style={{ fontWeight: '700', color: '#34A853' }}>l</Text>
                <Text style={{ fontWeight: '700', color: '#EA4335' }}>e</Text>
              </Text>
            </View>

          </ScrollView>
        </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
  },
  backButton: {
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
  },
  cardContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    ...Platform.select({
      ios: {
        boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.05)',
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)',
      },
    }),
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 32,
  },
  segmentContainer: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 14,
    padding: 4,
    marginBottom: 20,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  segmentBtnActive: {
    backgroundColor: 'rgba(26, 15, 163, 1.00)',
  },
  segmentText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
  },
  segmentTextActive: {
    color: '#FFFFFF',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    marginBottom: 16,
    paddingHorizontal: 12,
    height: 52,
  },
  iconBox: {
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    fontSize: 13,
    color: '#0F172A',
    fontWeight: '500',
    ...Platform.select({
      web: {
        outlineStyle: 'none' as any,
      },
    }),
  },
  gpsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
    marginBottom: 20,
    paddingVertical: 4,
  },
  gpsText: {
    fontSize: 13,
    fontWeight: '700',
    color: 'rgba(26, 15, 163, 1.00)',
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginBottom: 16,
  },
  sectionHeader: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  favoriteCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    marginBottom: 16,
  },
  favoriteIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  favoriteDetails: {
    flex: 1,
  },
  favoriteTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 2,
  },
  favoriteAddress: {
    fontSize: 11,
    color: '#64748B',
    lineHeight: 16,
  },
  recentsList: {
    gap: 16,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recentIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  recentDetails: {
    flex: 1,
  },
  recentTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 2,
  },
  recentSub: {
    fontSize: 11,
    color: '#94A3B8',
  },
  footer: {
    alignItems: 'center',
    marginTop: 36,
  },
  poweredText: {
    fontSize: 11,
    color: '#94A3B8',
  },
});
