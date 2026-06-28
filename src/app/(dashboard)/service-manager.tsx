import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { BackArrowIcon } from '@/components/ui/Icons';
import Svg, { Path, Circle, Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import { useAndroidBack } from '@/hooks/useAndroidBack';

const CheckCircleIcon = ({ color = '#FFFFFF' }) => (
  <Svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="1.5" />
    <Path d="M8 12L11 15L16 9" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const InfoIcon = ({ color = '#64748B' }) => (
  <Svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <Path d="M12 11V16M12 8H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const PlayCircleIcon = ({ color = 'rgba(26, 15, 163, 1.00)' }) => (
  <Svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="1.5" />
    <Path d="M10 8L16 12L10 16V8Z" fill={color} stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
  </Svg>
);

const BannerIcon = () => (
  <Svg width="40" height="40" viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="12" fill="#FFFFFF" />
    <Circle cx="10" cy="10" r="4" stroke="rgba(26, 15, 163, 1.00)" strokeWidth="1.5" />
    <Circle cx="14" cy="14" r="4" stroke="rgba(26, 15, 163, 1.00)" strokeWidth="1.5" />
  </Svg>
);

export default function ServiceManagerScreen() {
  useAndroidBack(() => router.back());
  const router = useSafeRouter();

  return (
    <GradientBackground style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        
        <View style={styles.header}>
          <TouchableOpacity activeOpacity={1} onPress={() => router.back()} style={styles.backButton}>
            <BackArrowIcon size={24} color="#0F172A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Service manager</Text>
          
          {/* Help Button Gradient */}
          <TouchableOpacity activeOpacity={1} style={styles.helpBtn}>
            <View style={StyleSheet.absoluteFill}>
              <Svg height="100%" width="100%" style={{ borderRadius: 8 }}>
                <Defs>
                  <LinearGradient id="grad" x1="0" y1="0" x2="1" y2="0">
                    <Stop offset="0" stopColor="#F97316" stopOpacity="1" />
                    <Stop offset="1" stopColor="#FBBF24" stopOpacity="1" />
                  </LinearGradient>
                </Defs>
                <Rect width="100%" height="100%" fill="url(#grad)" rx="8" />
              </Svg>
            </View>
            <Text style={styles.helpBtnText}>Help</Text>
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          {/* Active Services */}
          <View style={styles.card}>
            <View style={styles.cardMain}>
              <Image source={{ uri: 'https://i.pravatar.cc/150' }} style={styles.avatarImage} />
              <Text style={styles.serviceName}>Bike Boost</Text>
              <View style={styles.badgeActive}>
                <CheckCircleIcon />
                <Text style={styles.badgeActiveText}>Active</Text>
              </View>
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.cardMain}>
              <Image source={{ uri: 'https://i.pravatar.cc/150' }} style={styles.avatarImage} />
              <Text style={styles.serviceName}>Bike Boost</Text>
              <View style={styles.badgeActive}>
                <CheckCircleIcon />
                <Text style={styles.badgeActiveText}>Active</Text>
              </View>
            </View>
          </View>

          {/* In Review Services */}
          <View style={styles.cardMulti}>
            <View style={styles.cardMain}>
              <Image source={{ uri: 'https://i.pravatar.cc/150' }} style={styles.avatarImage} />
              <Text style={styles.serviceName}>Parcel Delivery</Text>
              <View style={styles.badgeReview}>
                <Text style={styles.badgeReviewText}>In Review</Text>
              </View>
            </View>
            <View style={styles.dashedDivider} />
            <View style={styles.infoRow}>
              <InfoIcon />
              <Text style={styles.infoText}>Hozify team is checking on your request.{'\n'}We'll contact you within 24 hours.</Text>
            </View>
          </View>

          <View style={styles.cardMulti}>
            <View style={styles.cardMain}>
              <Image source={{ uri: 'https://i.pravatar.cc/150' }} style={styles.avatarImage} />
              <Text style={styles.serviceName}>Grocery Delivery</Text>
              <View style={styles.badgeReview}>
                <Text style={styles.badgeReviewText}>In Review</Text>
              </View>
            </View>
            <View style={styles.dashedDivider} />
            <View style={styles.infoRow}>
              <InfoIcon />
              <Text style={styles.infoText}>Hozify team is checking on your request.{'\n'}We'll contact you within 24 hours.</Text>
            </View>
          </View>

          {/* Promotional Banner */}
          <View style={styles.promoBanner}>
            <Text style={styles.promoText}>Hozify Delivery{'\n'}partners earn 40%{'\n'}extra daily !!</Text>
            <View style={styles.promoIconWrapper}>
              <BannerIcon />
            </View>
          </View>

          {/* Start Services */}
          <View style={styles.cardStart}>
            <View style={styles.cardMain}>
              <Image source={{ uri: 'https://i.pravatar.cc/150' }} style={styles.avatarImage} />
              <View style={styles.serviceTextCol}>
                <Text style={styles.serviceName}>Food Delivery</Text>
                <TouchableOpacity activeOpacity={1} style={styles.watchVideoRow}>
                  <Text style={styles.watchVideoText}>Watch Video</Text>
                  <PlayCircleIcon />
                </TouchableOpacity>
              </View>
              <TouchableOpacity activeOpacity={1} style={styles.startBtn}>
                <Text style={styles.startBtnText}>Start</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.cardMain}>
              <Image source={{ uri: 'https://i.pravatar.cc/150' }} style={styles.avatarImage} />
              <Text style={styles.serviceName}>Bike-Intercity</Text>
              <TouchableOpacity activeOpacity={1} style={styles.startBtn}>
                <Text style={styles.startBtnText}>Start</Text>
              </TouchableOpacity>
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
  headerTitle: { fontSize: 16, fontWeight: '800', color: '#0F172A', flex: 1 },
  
  helpBtn: { paddingHorizontal: 16, paddingVertical: 6, borderRadius: 8, overflow: 'hidden', justifyContent: 'center', alignItems: 'center' },
  helpBtnText: { color: '#FFFFFF', fontSize: 11, fontWeight: '700' },

  scrollContent: { paddingHorizontal: 16, paddingBottom: 40 },

  card: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 0, marginBottom: 12 },
  cardMulti: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, marginBottom: 12 },
  cardStart: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 0, marginBottom: 12 },
  
  cardMain: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  avatarImage: { width: 48, height: 48, borderRadius: 24, marginRight: 16 },
  serviceName: { fontSize: 14, fontWeight: '700', color: '#0F172A', flex: 1 },
  serviceTextCol: { flex: 1 },
  
  badgeActive: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(26, 15, 163, 1.00)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, gap: 4 },
  badgeActiveText: { color: '#FFFFFF', fontSize: 11, fontWeight: '700' },

  badgeReview: { backgroundColor: '#F1F5F9', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
  badgeReviewText: { color: '#64748B', fontSize: 11, fontWeight: '700' },

  dashedDivider: { height: 1, backgroundColor: '#E2E8F0', borderStyle: 'dashed', marginVertical: 16 },
  
  infoRow: { flexDirection: 'row', alignItems: 'flex-start' },
  infoText: { fontSize: 11, color: '#64748B', lineHeight: 16, marginLeft: 8 },

  promoBanner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 4, paddingVertical: 12, marginBottom: 12, marginTop: 8 },
  promoText: { fontSize: 16, fontWeight: '800', color: '#0F172A', lineHeight: 22 },
  promoIconWrapper: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', elevation: 4 },

  watchVideoRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4, gap: 4 },
  watchVideoText: { fontSize: 11, fontWeight: '700', color: 'rgba(26, 15, 163, 1.00)' },

  startBtn: { borderWidth: 1, borderColor: 'rgba(26, 15, 163, 1.00)', borderRadius: 8, paddingHorizontal: 20, paddingVertical: 8 },
  startBtnText: { color: 'rgba(26, 15, 163, 1.00)', fontSize: 13, fontWeight: '700' },
});
