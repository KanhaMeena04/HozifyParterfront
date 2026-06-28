import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { BackArrowIcon } from '@/components/ui/Icons';
import Svg, { Path } from 'react-native-svg';
import { useAndroidBack } from '@/hooks/useAndroidBack';

const ChevronRightIcon = () => (
  <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
    <Path d="M9 18L15 12L9 6" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export default function AboutScreen() {
  const router = useSafeRouter();
  useAndroidBack(() => router.back());

  const handleLinkPress = (title: string) => {
    Alert.alert(title, `Opening ${title} details...`);
  };

  return (
    <GradientBackground style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        
        <View style={styles.header}>
          <TouchableOpacity activeOpacity={1} onPress={() => router.back()} style={styles.backButton}>
            <BackArrowIcon size={24} color="#0F172A" />
          </TouchableOpacity>
          <View style={styles.headerTitleBox}>
            <Text style={styles.headerTitle}>About</Text>
            <Text style={styles.headerSubtitle}>App information & legal details</Text>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <View style={styles.appCard}>
            <Image 
              source={require('../../../assets/images/logo.png')} 
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.appName}>Hozify Partner</Text>
            <Text style={styles.appVersion}>Version 8.1.1 (Build 202)</Text>
            
            <Text style={styles.description}>
              Hozify Partner app empowers local home service professionals to manage bookings, track daily earnings, submit quotations, and grow their service business efficiently.
            </Text>
          </View>

          <View style={styles.linkCard}>
            <TouchableOpacity activeOpacity={0.8} style={styles.linkRow} onPress={() => handleLinkPress('Terms & Conditions')}>
              <Text style={styles.linkText}>Terms & Conditions</Text>
              <ChevronRightIcon />
            </TouchableOpacity>
            
            <View style={styles.divider} />

            <TouchableOpacity activeOpacity={0.8} style={styles.linkRow} onPress={() => handleLinkPress('Privacy Policy')}>
              <Text style={styles.linkText}>Privacy Policy</Text>
              <ChevronRightIcon />
            </TouchableOpacity>
            
            <View style={styles.divider} />

            <TouchableOpacity activeOpacity={0.8} style={styles.linkRow} onPress={() => handleLinkPress('Open Source Licenses')}>
              <Text style={styles.linkText}>Open Source Licenses</Text>
              <ChevronRightIcon />
            </TouchableOpacity>
          </View>

          <Text style={styles.copyright}>© 2026 Hozify Technologies Private Limited. All rights reserved.</Text>
        </ScrollView>
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1, backgroundColor: 'transparent' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  backButton: { marginRight: 12 },
  headerTitleBox: { flex: 1 },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#0F172A' },
  headerSubtitle: { fontSize: 13, color: '#64748B', marginTop: 2 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 40 },
  appCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.05)',
    elevation: 3,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 16,
  },
  appName: { fontSize: 18, fontWeight: '700', color: '#0F172A', marginBottom: 4 },
  appVersion: { fontSize: 13, color: '#64748B', marginBottom: 16 },
  description: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 12,
  },
  linkCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 4,
    marginBottom: 24,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.05)',
    elevation: 3,
  },
  linkRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  linkText: { fontSize: 15, fontWeight: '600', color: '#0F172A' },
  divider: { height: 1, backgroundColor: '#E2E8F0' },
  copyright: {
    fontSize: 11,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 16,
  },
});
