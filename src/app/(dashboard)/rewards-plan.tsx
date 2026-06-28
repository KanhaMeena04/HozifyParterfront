import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { BackArrowIcon } from '@/components/ui/Icons';
import Svg, { Rect, Defs, LinearGradient, Stop, Path, Circle } from 'react-native-svg';
import { useAndroidBack } from '@/hooks/useAndroidBack';

const CheckCircleSolidIcon = ({ color = 'rgba(26, 15, 163, 1.00)' }) => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="12" fill={color} />
    <Path d="M7 12.5L10 15.5L17 8.5" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export default function RewardsPlanScreen() {
  useAndroidBack(() => router.back());
  const router = useSafeRouter();

  return (
    <GradientBackground style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        
        <View style={styles.header}>
          <TouchableOpacity activeOpacity={1} onPress={() => router.back()} style={styles.backButton}>
            <BackArrowIcon size={24} color="#0F172A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Hozify Rewards</Text>
          
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
          
          {/* Main Hero Banner */}
          <View style={styles.heroBanner}>
            <View style={StyleSheet.absoluteFill}>
              <Svg height="100%" width="100%" style={{ borderTopLeftRadius: 24, borderTopRightRadius: 24 }}>
                <Defs>
                  <LinearGradient id="gradHero" x1="0" y1="0" x2="1" y2="1">
                    <Stop offset="0" stopColor="#6D28D9" stopOpacity="1" />
                    <Stop offset="1" stopColor="rgba(26, 15, 163, 1.00)" stopOpacity="1" />
                  </LinearGradient>
                </Defs>
                <Rect width="100%" height="100%" fill="url(#gradHero)" />
              </Svg>
            </View>
            
            <View style={styles.heroContent}>
              <View style={styles.heroPriceRow}>
                <Text style={styles.heroCurrency}>₹</Text>
                <Text style={styles.heroPrice}>0</Text>
              </View>
              <View style={styles.heroTextCol}>
                <Text style={styles.heroTextBold}>ZERO</Text>
                <Text style={styles.heroTextLight}>COMMISSION</Text>
                <Text style={styles.heroTextLight}>RIDES</Text>
              </View>
            </View>
          </View>

          {/* White Content Area */}
          <View style={styles.whiteArea}>
            
            <Text style={styles.sectionTitle}>Select Your Next Plan</Text>
            <View style={styles.subtitleRow}>
              <Text style={styles.subtitleText}>All these plans are valid for</Text>
              <View style={styles.bikeBadge}>
                <Text style={styles.bikeBadgeText}>Bike</Text>
              </View>
            </View>

            {/* Plan Card */}
            <View style={styles.planCard}>
              <View style={styles.recommendedBadge}>
                <Text style={styles.recommendedText}>RECOMMENDED</Text>
              </View>
              
              <View style={styles.planHeader}>
                <CheckCircleSolidIcon />
                <Text style={styles.planTitle}>Chinna Recharge</Text>
              </View>
              
              <View style={styles.planDetailsRow}>
                <View style={styles.planCol}>
                  <Text style={styles.planVal}>Unlimited</Text>
                  <Text style={styles.planLabel}>Earnings</Text>
                </View>
                
                <View style={styles.planDivider} />
                
                <View style={styles.planCol}>
                  <Text style={styles.planVal}>1</Text>
                  <Text style={styles.planLabel}>Day</Text>
                </View>
                
                <View style={styles.planDivider} />
                
                <View style={styles.planCol}>
                  <Text style={styles.planVal}>₹1</Text>
                  <Text style={styles.planLabelStrike}>₹99</Text>
                </View>
              </View>
            </View>

            {/* Terms and Conditions */}
            <View style={styles.tcSection}>
              <Text style={styles.tcTitle}>Terms and conditions</Text>
              
              <View style={styles.tcItem}>
                <View style={styles.bullet} />
                <Text style={styles.tcText}>Plan is active for Bike only</Text>
              </View>
              <View style={styles.tcItem}>
                <View style={styles.bullet} />
                <Text style={styles.tcText}>No refunds will be given once plan is purchased</Text>
              </View>
              <View style={styles.tcItem}>
                <View style={styles.bullet} />
                <Text style={styles.tcText}>Subscription will be effective immediately as soon as it is purchased</Text>
              </View>
              <View style={styles.tcItem}>
                <View style={styles.bullet} />
                <Text style={styles.tcText}>Once a subscription plan is purchased, Daily and weekly incentives may not be applicable</Text>
              </View>
              <View style={styles.tcItem}>
                <View style={styles.bullet} />
                <Text style={styles.tcText}>Expiry date is applicable for all plans</Text>
              </View>
              <View style={styles.tcItem}>
                <View style={styles.bullet} />
                <Text style={styles.tcText}>Enjoy ₹0 commission orders but GST will be charged on the orders</Text>
              </View>
              <View style={styles.tcItem}>
                <View style={styles.bullet} />
                <Text style={styles.tcText}>GST is included in the plan price</Text>
              </View>

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

  scrollContent: { paddingHorizontal: 12, paddingBottom: 40 },

  heroBanner: { height: 160, position: 'relative', justifyContent: 'center', alignItems: 'center' },
  heroContent: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  heroPriceRow: { flexDirection: 'row', alignItems: 'flex-start' },
  heroCurrency: { color: '#FFFFFF', fontSize: 20, fontWeight: '700', marginTop: 12, marginRight: 4 },
  heroPrice: { color: '#FFFFFF', fontSize: 72, fontWeight: '800', lineHeight: 80 },
  heroTextCol: { marginTop: 8 },
  heroTextBold: { color: '#FFFFFF', fontSize: 20, fontWeight: '800', lineHeight: 24 },
  heroTextLight: { color: '#FFFFFF', fontSize: 14, fontWeight: '400', lineHeight: 18 },

  whiteArea: { backgroundColor: '#FFFFFF', borderBottomLeftRadius: 24, borderBottomRightRadius: 24, padding: 24, boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.05)', elevation: 2 },
  
  sectionTitle: { fontSize: 16, fontWeight: '800', color: '#0F172A', marginBottom: 8 },
  subtitleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  subtitleText: { fontSize: 13, color: '#64748B', marginRight: 8 },
  bikeBadge: { borderColor: '#22C55E', borderWidth: 1, borderRadius: 12, paddingHorizontal: 8, paddingVertical: 2 },
  bikeBadgeText: { color: '#22C55E', fontSize: 10, fontWeight: '600' },

  planCard: { borderWidth: 1.5, borderColor: 'rgba(26, 15, 163, 1.00)', borderRadius: 20, padding: 20, position: 'relative', marginBottom: 32 },
  recommendedBadge: { position: 'absolute', top: -1, right: -1, backgroundColor: 'rgba(26, 15, 163, 1.00)', borderBottomLeftRadius: 12, borderTopRightRadius: 20, paddingHorizontal: 12, paddingVertical: 6 },
  recommendedText: { color: '#FFFFFF', fontSize: 9, fontWeight: '800', letterSpacing: 0.5 },
  
  planHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 24, marginTop: 4 },
  planTitle: { fontSize: 16, fontWeight: '800', color: '#0F172A' },
  
  planDetailsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  planCol: { flex: 1, alignItems: 'center' },
  planDivider: { width: 1, height: 24, backgroundColor: '#E2E8F0' },
  
  planVal: { fontSize: 14, fontWeight: '800', color: '#0F172A', marginBottom: 4 },
  planLabel: { fontSize: 11, color: '#64748B' },
  planLabelStrike: { fontSize: 11, color: '#94A3B8', textDecorationLine: 'line-through' },

  tcSection: { marginTop: 8 },
  tcTitle: { fontSize: 13, fontWeight: '800', color: '#0F172A', marginBottom: 16 },
  tcItem: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 },
  bullet: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#334155', marginTop: 6, marginRight: 12 },
  tcText: { flex: 1, fontSize: 12, color: '#475569', lineHeight: 18 },
});
