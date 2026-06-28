import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { BackArrowIcon } from '@/components/ui/Icons';
import Svg, { Path } from 'react-native-svg';
import { useAndroidBack } from '@/hooks/useAndroidBack';

const ServiceIcon = ({ color = 'rgba(26, 15, 163, 1.00)' }) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path d="M4 8H20M4 16H20M5 8V16C5 17.1046 5.89543 18 7 18H17C18.1046 18 19 17.1046 19 16V8C19 6.89543 18.1046 6 17 6H7C5.89543 6 5 6.89543 5 8Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M8 18V21M16 18V21" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const StarFilledIcon = ({ color = '#FBBF24' }) => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill={color}>
    <Path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill={color} />
  </Svg>
);

export default function MyRatingScreen() {
  useAndroidBack(() => router.back());
  const router = useSafeRouter();

  // Dummy data to match the design
  const RATINGS = Array(8).fill({
    title: 'AC Repairing Service',
    address: '22, Musakhedi Main Rd',
    rating: '4.2'
  });

  return (
    <GradientBackground style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        
        <View style={styles.header}>
          <TouchableOpacity activeOpacity={1} onPress={() => router.back()} style={styles.backButton}>
            <BackArrowIcon size={24} color="#0F172A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My rating</Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          <View style={styles.listContainer}>
            {RATINGS.map((item, index) => (
              <View key={index} style={styles.ratingCard}>
                <View style={styles.iconBox}>
                  <ServiceIcon />
                </View>
                <View style={styles.infoBox}>
                  <Text style={styles.serviceTitle}>{item.title}</Text>
                  <Text style={styles.serviceAddress}>{item.address}</Text>
                </View>
                <View style={styles.scoreBox}>
                  <StarFilledIcon />
                  <Text style={styles.scoreText}>{item.rating}</Text>
                </View>
              </View>
            ))}
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

  listContainer: { backgroundColor: '#FFFFFF', borderRadius: 24, padding: 16 },
  ratingCard: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#F1F5F9', borderRadius: 16, padding: 16, marginBottom: 12 },
  iconBox: { width: 40, height: 40, borderRadius: 8, backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  infoBox: { flex: 1 },
  serviceTitle: { fontSize: 12, fontWeight: '700', color: '#0F172A', marginBottom: 2 },
  serviceAddress: { fontSize: 10, color: '#64748B' },
  scoreBox: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  scoreText: { fontSize: 14, fontWeight: '800', color: '#0F172A' },
});
