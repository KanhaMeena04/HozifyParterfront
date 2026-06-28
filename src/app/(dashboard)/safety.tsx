import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { BackArrowIcon } from '@/components/ui/Icons';
import Svg, { Path, Circle, Rect, Text as SvgText } from 'react-native-svg';
import { useAndroidBack } from '@/hooks/useAndroidBack';

const VerifiedBadgeIcon = ({ color = 'rgba(26, 15, 163, 1.00)' }) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" fill={color} />
    <Path d="M8 12L11 15L16 9" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const ChecklistIcon = ({ color = 'rgba(26, 15, 163, 1.00)' }) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Rect x="4" y="4" width="16" height="16" rx="2" fill={color} />
    <Path d="M9 12H15M9 16H15M9 8H15" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const SOSIcon = ({ color = 'rgba(26, 15, 163, 1.00)' }) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" fill={color} />
    <SvgText x="12" y="16" fontSize="10" fontWeight="bold" fill="#FFFFFF" textAnchor="middle">SOS</SvgText>
  </Svg>
);

const LockIcon = ({ color = 'rgba(26, 15, 163, 1.00)' }) => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <Path d="M19 11H5C3.89543 11 3 11.8954 3 13V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V13C21 11.8954 20.1046 11 19 11Z" fill={color} />
    <Path d="M7 11V7C7 5.67392 7.52678 4.40215 8.46447 3.46447C9.40215 2.52678 10.6739 2 12 2C13.3261 2 14.5979 2.52678 15.5355 3.46447C16.4732 4.40215 17 5.67392 17 7V11" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const LocationIcon = ({ color = 'rgba(26, 15, 163, 1.00)' }) => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <Path d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Circle cx="12" cy="10" r="3" fill={color} />
  </Svg>
);

const ShieldIcon = ({ color = 'rgba(26, 15, 163, 1.00)' }) => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <Path d="M12 22S8 18 8 12V6L12 4L16 6V12C16 18 12 22 12 22Z" fill={color} />
  </Svg>
);

const BoltIcon = ({ color = 'rgba(26, 15, 163, 1.00)' }) => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <Path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" fill={color} />
  </Svg>
);

const StarIcon = ({ color = 'rgba(26, 15, 163, 1.00)' }) => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <Path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill={color} />
  </Svg>
);

export default function SafetyScreen() {
  useAndroidBack(() => router.back());
  const router = useSafeRouter();

  const PILLS = [
    { id: 'verified', title: 'Verified Badge', icon: <VerifiedBadgeIcon /> },
    { id: 'checklist', title: 'Checklist', icon: <ChecklistIcon /> },
    { id: 'sos', title: 'Live SOS', icon: <SOSIcon /> },
  ];

  const FEATURES = [
    { id: 'police', title: 'Police-verified background check', sub: 'Thorough criminal and identity screening.', icon: <LockIcon /> },
    { id: 'location', title: 'Live location tracking during service', sub: 'Track your professional in real-time.', icon: <LocationIcon /> },
    { id: 'insurance', title: '₹1Cr+ insurance coverage per visit', sub: 'Your home and safety are fully insured.', icon: <ShieldIcon /> },
    { id: 'sosBtn', title: 'Emergency SOS button in app', sub: 'Instant 24/7 help desk connection.', icon: <BoltIcon /> },
    { id: 'reviews', title: 'Real customer reviews & ratings', sub: 'Unbiased feedback from your community.', icon: <StarIcon /> },
  ];

  return (
    <GradientBackground style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        
        <View style={styles.header}>
          <TouchableOpacity activeOpacity={1} onPress={() => router.back()} style={styles.backButton}>
            <BackArrowIcon size={24} color="#0F172A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Safety</Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          <Text style={styles.heroText}>At hozify, your safety comes first. Here are some measures and provisions to ensure your safety</Text>

          <View style={styles.pillRow}>
            {PILLS.map((pill) => (
              <TouchableOpacity activeOpacity={1} key={pill.id} style={styles.pillCard}>
                <View style={styles.pillIconBox}>{pill.icon}</View>
                <Text style={styles.pillText}>{pill.title}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.featuresCard}>
            {FEATURES.map((feat, index) => (
              <View key={feat.id}>
                <View style={styles.featureRow}>
                  <View style={styles.featureIconBox}>
                    {feat.icon}
                  </View>
                  <View style={styles.featureTextBox}>
                    <Text style={styles.featureTitle}>{feat.title}</Text>
                    <Text style={styles.featureSub}>{feat.sub}</Text>
                  </View>
                </View>
                {index < FEATURES.length - 1 && <View style={styles.divider} />}
              </View>
            ))}
          </View>

          <View style={styles.statsCard}>
            <View style={styles.statsRow}>
              <View style={styles.statBox}>
                <View style={styles.ratingRow}>
                  <Text style={styles.statNumber}>4.9</Text>
                  <StarIcon color="#FBBF24" />
                </View>
                <Text style={styles.statLabel}>Google Review</Text>
              </View>
              
              <View style={styles.statDivider} />
              
              <View style={styles.statBox}>
                <Text style={styles.statNumber}>ISO</Text>
                <Text style={styles.statLabel}>9001 Certified</Text>
              </View>
            </View>
            
            <View style={styles.divider} />
            
            <View style={styles.bottomStatBox}>
              <Text style={styles.statNumber}>10,000+</Text>
              <Text style={styles.statLabel}>Happy Users</Text>
            </View>
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

  heroText: { fontSize: 12, color: '#475569', lineHeight: 18, marginBottom: 20 },

  pillRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24, gap: 12 },
  pillCard: { flex: 1, backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, alignItems: 'center', justifyContent: 'center' },
  pillIconBox: { marginBottom: 8 },
  pillText: { fontSize: 10, fontWeight: '600', color: '#0F172A', textAlign: 'center' },

  featuresCard: { backgroundColor: '#FFFFFF', borderRadius: 24, paddingHorizontal: 20, paddingVertical: 12, marginBottom: 24 },
  featureRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16 },
  featureIconBox: { width: 32, alignItems: 'center', marginRight: 12 },
  featureTextBox: { flex: 1 },
  featureTitle: { fontSize: 12, fontWeight: '700', color: '#0F172A', marginBottom: 4 },
  featureSub: { fontSize: 11, color: '#475569' },
  divider: { height: 1, backgroundColor: '#F1F5F9' },

  statsCard: { paddingHorizontal: 20 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingVertical: 16 },
  statBox: { alignItems: 'center', flex: 1 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 4 },
  statNumber: { fontSize: 14, fontWeight: '800', color: 'rgba(26, 15, 163, 1.00)', marginBottom: 4 },
  statLabel: { fontSize: 12, fontWeight: '600', color: 'rgba(26, 15, 163, 1.00)' },
  statDivider: { width: 1, height: 40, backgroundColor: '#CBD5E1' },
  bottomStatBox: { alignItems: 'center', paddingVertical: 16 },
});
