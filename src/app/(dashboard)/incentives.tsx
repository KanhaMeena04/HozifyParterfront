import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { BackArrowIcon } from '@/components/ui/Icons';
import Svg, { Rect, Defs, LinearGradient, Stop, Path, Circle } from 'react-native-svg';
import { useAndroidBack } from '@/hooks/useAndroidBack';

const WalletIcon = () => (
  <Svg width="48" height="48" viewBox="0 0 24 24" fill="none">
    <Rect x="3" y="6" width="18" height="14" rx="2" stroke="#94A3B8" strokeWidth="1.5" />
    <Path d="M16 13C16 14.1046 16.8954 15 18 15V11C16.8954 11 16 11.8954 16 13Z" stroke="#94A3B8" strokeWidth="1.5" />
    <Circle cx="18" cy="6" r="4" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="1.5" />
    <Path d="M16.5 4.5L19.5 7.5M19.5 4.5L16.5 7.5" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />
  </Svg>
);

const TrophyIcon = () => (
  <Svg width="40" height="40" viewBox="0 0 24 24" fill="none">
    <Path d="M7 6H17M8 6V11C8 13.2091 9.79086 15 12 15V15C14.2091 15 16 13.2091 16 11V6M12 15V20M9 20H15M8 9H6C4.89543 9 4 8.10457 4 7V7C4 5.89543 4.89543 5 6 5H8M16 9H18C19.1046 9 20 8.10457 20 7V7C20 5.89543 19.1046 5 18 5H16" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const EmptySearchIcon = () => (
  <Svg width="80" height="80" viewBox="0 0 100 100" fill="none">
    {/* Cloud Base */}
    <Path d="M20 60 C20 40, 40 40, 45 45 C50 30, 80 30, 80 50 C95 50, 95 75, 80 75 L25 75 C10 75, 10 60, 20 60 Z" fill="#F8FAFC" />
    
    {/* Document */}
    <Rect x="40" y="25" width="30" height="40" rx="4" fill="#FFFFFF" stroke="#64748B" strokeWidth="2" />
    <Path d="M48 35 H62 M48 45 H62" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" />
    
    {/* Magnifying Glass */}
    <Circle cx="55" cy="55" r="14" fill="#E0E7FF" stroke="rgba(26, 15, 163, 1.00)" strokeWidth="3" />
    <Circle cx="55" cy="55" r="6" stroke="rgba(26, 15, 163, 1.00)" strokeWidth="2" />
    <Path d="M65 65 L72 72" stroke="#F59E0B" strokeWidth="6" strokeLinecap="round" />
  </Svg>
);

export default function IncentivesScreen() {
  useAndroidBack(() => router.back());
  const router = useSafeRouter();
  const [activeTab, setActiveTab] = useState<'daily' | 'weekly' | 'bonus'>('bonus');

  return (
    <GradientBackground style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        
        <View style={styles.header}>
          <TouchableOpacity activeOpacity={1} onPress={() => router.back()} style={styles.backButton}>
            <BackArrowIcon size={24} color="#0F172A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Incentives and more</Text>
          
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
          
          {/* Dark Header Area */}
          <View style={[styles.darkHeader, activeTab === 'bonus' && { paddingBottom: 0 }]}>
            
            {activeTab !== 'bonus' && (
              <View style={styles.dateSelector}>
                {activeTab === 'daily' ? (
                  <>
                    <View style={styles.dateItem}>
                      <Text style={styles.dateMonth}>Apr</Text>
                      <Text style={styles.dateDay}>15</Text>
                    </View>
                    <View style={styles.dateItem}>
                      <Text style={styles.dateMonth}>Apr</Text>
                      <Text style={styles.dateDay}>16</Text>
                    </View>
                    <View style={styles.dateItemActive}>
                      <Text style={styles.dateMonthActive}>Today</Text>
                      <Text style={styles.dateDayActive}>17</Text>
                    </View>
                    <View style={styles.dateItem}>
                      <Text style={styles.dateMonth}>Apr</Text>
                      <Text style={styles.dateDay}>18</Text>
                    </View>
                  </>
                ) : (
                  <>
                    <View style={styles.dateItemWeekly}>
                      <Text style={styles.dateMonth}>Apr</Text>
                      <Text style={styles.dateDayWeekly}>01-05</Text>
                    </View>
                    <View style={styles.dateItemWeekly}>
                      <Text style={styles.dateMonth}>Apr</Text>
                      <Text style={styles.dateDayWeekly}>06-12</Text>
                    </View>
                    <View style={styles.dateItemWeeklyActive}>
                      <Text style={styles.dateMonthActive}>Apr</Text>
                      <Text style={styles.dateDayWeeklyActive}>13-19</Text>
                    </View>
                    <View style={styles.dateItemWeekly}>
                      <Text style={styles.dateMonth}>Apr</Text>
                      <Text style={styles.dateDayWeekly}>20-26</Text>
                    </View>
                  </>
                )}
              </View>
            )}

            <View style={styles.tabsRow}>
              <TouchableOpacity activeOpacity={1}
                style={[styles.tabBtn, activeTab === 'daily' && styles.activeTabBtn]}
                onPress={() => setActiveTab('daily')}
              >
                <Text style={activeTab === 'daily' ? styles.activeTabText : styles.inactiveTabText}>Daily</Text>
              </TouchableOpacity>
              
              <TouchableOpacity activeOpacity={1}
                style={[styles.tabBtn, activeTab === 'weekly' && styles.activeTabBtn]}
                onPress={() => setActiveTab('weekly')}
              >
                <Text style={activeTab === 'weekly' ? styles.activeTabText : styles.inactiveTabText}>Weekly</Text>
              </TouchableOpacity>
              
              <TouchableOpacity activeOpacity={1}
                style={[styles.tabBtn, activeTab === 'bonus' && styles.activeTabBtn]}
                onPress={() => setActiveTab('bonus')}
              >
                <Text style={activeTab === 'bonus' ? styles.activeTabText : styles.inactiveTabText}>Bonus</Text>
              </TouchableOpacity>
            </View>

          </View>

          {/* Dynamic Content Area */}
          {activeTab === 'daily' && (
            <View style={styles.cardContainer}>
              <View style={styles.timeHeaderRow}>
                <View style={styles.timeLine} />
                <Text style={styles.timeTitle}>12:00 PM to 3:59 PM</Text>
                <View style={styles.timeLine} />
              </View>

              <View style={styles.blueBlock}>
                <Text style={styles.blueBlockTitle}>Earn up to ₹50</Text>
                <Text style={styles.blueBlockSub}>by completing 7 Rides</Text>
                <View style={styles.taxiBadge}>
                  <Text style={styles.taxiBadgeText}>Bike Taxi</Text>
                </View>
              </View>

              <View style={styles.timelineArea}>
                <View style={styles.timelineItem}>
                  <View style={styles.timelineLeft}>
                    <View style={styles.dot} />
                    <View style={styles.verticalLine} />
                  </View>
                  <View style={styles.timelineContent}>
                    <View style={styles.timelineTextRow}>
                      <Text style={styles.timelineMainText}>Complete 5 Rides</Text>
                      <Text style={styles.timelineAmount}>₹30</Text>
                    </View>
                    <Text style={styles.timelineSubText}>5 more rides left</Text>
                  </View>
                </View>

                <View style={styles.timelineItem}>
                  <View style={styles.timelineLeft}>
                    <View style={styles.dot} />
                  </View>
                  <View style={styles.timelineContent}>
                    <View style={styles.timelineTextRow}>
                      <Text style={styles.timelineMainText}>Complete 7 Rides</Text>
                      <Text style={styles.timelineAmount}>₹20</Text>
                    </View>
                    <Text style={styles.timelineSubText}>7 more rides left</Text>
                  </View>
                </View>
              </View>

              <TouchableOpacity activeOpacity={1} style={styles.tcLink}>
                <Text style={styles.tcText}>Terms & Conditions</Text>
              </TouchableOpacity>
            </View>
          )}

          {activeTab === 'weekly' && (
            <View style={styles.emptyStateContainer}>
              <View style={styles.emptyIconWrapper}>
                <EmptySearchIcon />
              </View>
              <Text style={styles.emptyStateText}>Incentives aren't created yet. Come{'\n'}back later</Text>
            </View>
          )}

          {activeTab === 'bonus' && (
            <View style={styles.bonusContainer}>
              
              <View style={styles.oopsCard}>
                <View style={styles.oopsHeader}>
                  <WalletIcon />
                  <View style={styles.oopsTextCol}>
                    <Text style={styles.oopsTitle}>Ooops!</Text>
                    <Text style={styles.oopsDesc}>You didn't earn any joining bonus</Text>
                  </View>
                </View>
                <Text style={styles.oopsVal}>Joining Bonus ₹ 0</Text>
              </View>

              <View style={styles.trophyCard}>
                <Text style={styles.dontWorryText}>Don't worry</Text>
                <View style={styles.trophyCircle}>
                  <TrophyIcon />
                </View>
                <Text style={styles.trophyMainText}>Check out Daily or weekly{'\n'}incentives to earn more</Text>
                <Text style={styles.trophySubText}>What's next, Tap on Daily</Text>
              </View>

              <View style={styles.foodBannerWrapper}>
                <Text style={styles.foodBannerTitle}>Activate food delivery</Text>
                <View style={styles.foodBannerCard}>
                  <View style={StyleSheet.absoluteFill}>
                    <Svg height="100%" width="100%" style={{ borderRadius: 16 }}>
                      <Defs>
                        <LinearGradient id="gradPink" x1="0" y1="0" x2="1" y2="1">
                          <Stop offset="0" stopColor="rgba(26, 15, 163, 1.00)" stopOpacity="1" />
                          <Stop offset="1" stopColor="#F472B6" stopOpacity="1" />
                        </LinearGradient>
                      </Defs>
                      <Rect width="100%" height="100%" fill="url(#gradPink)" />
                    </Svg>
                  </View>
                  
                  <View style={styles.foodBannerContent}>
                    <View style={styles.foodBannerLeft}>
                      <Text style={styles.foodBannerText}>Win cashback upto ₹400 by activating Food Delivery Service!</Text>
                      <TouchableOpacity activeOpacity={1} style={styles.foodBannerBtn}>
                        <Text style={styles.foodBannerBtnText}>Start Now</Text>
                      </TouchableOpacity>
                    </View>
                    <View style={styles.foodBannerImageWrap}>
                      <Image 
                        source={{ uri: 'https://images.unsplash.com/photo-1526367790999-0150786686a2?w=400&q=80' }} 
                        style={styles.foodBannerImage} 
                      />
                    </View>
                  </View>
                </View>
              </View>

            </View>
          )}

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

  scrollContent: { paddingBottom: 40 },

  darkHeader: { backgroundColor: '#27272A', borderTopLeftRadius: 32, borderTopRightRadius: 32, paddingTop: 32, paddingBottom: 48, zIndex: 1 },
  
  dateSelector: { flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', paddingHorizontal: 16, marginBottom: 32 },
  
  dateItem: { alignItems: 'center' },
  dateMonth: { color: '#71717A', fontSize: 12, marginBottom: 4 },
  dateDay: { color: '#A1A1AA', fontSize: 16, fontWeight: '600' },
  
  dateItemActive: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)', elevation: 6 },
  dateMonthActive: { color: '#0F172A', fontSize: 10, fontWeight: '700', marginBottom: 2 },
  dateDayActive: { color: '#0F172A', fontSize: 20, fontWeight: '800' },

  dateItemWeekly: { alignItems: 'center' },
  dateDayWeekly: { color: '#A1A1AA', fontSize: 14, fontWeight: '600' },
  
  dateItemWeeklyActive: { width: 72, height: 72, borderRadius: 36, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: '#FBBF24' },
  dateDayWeeklyActive: { color: '#0F172A', fontSize: 16, fontWeight: '800' },

  tabsRow: { flexDirection: 'row', paddingHorizontal: 24, justifyContent: 'space-between' },
  tabBtn: { flex: 1, alignItems: 'center', paddingBottom: 12 },
  activeTabBtn: { borderBottomWidth: 3, borderBottomColor: '#FBBF24' },
  activeTabText: { color: '#FBBF24', fontSize: 13, fontWeight: '700' },
  inactiveTabText: { color: '#71717A', fontSize: 13, fontWeight: '600' },

  // Daily State
  cardContainer: { backgroundColor: '#FFFFFF', marginHorizontal: 24, borderRadius: 24, marginTop: -32, zIndex: 2, boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.05)', elevation: 10, paddingBottom: 24, overflow: 'hidden' },
  
  timeHeaderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 20 },
  timeLine: { height: 1, width: 24, backgroundColor: '#E2E8F0', marginHorizontal: 12 },
  timeTitle: { fontSize: 12, fontWeight: '800', color: '#0F172A' },

  blueBlock: { backgroundColor: 'rgba(26, 15, 163, 1.00)', paddingVertical: 32, paddingHorizontal: 24, alignItems: 'center', position: 'relative' },
  blueBlockTitle: { fontSize: 22, fontWeight: '800', color: '#FFFFFF', marginBottom: 8 },
  blueBlockSub: { fontSize: 12, color: '#E0E7FF' },
  taxiBadge: { position: 'absolute', bottom: 0, right: 0, backgroundColor: '#3F3F46', paddingHorizontal: 12, paddingVertical: 6, borderTopLeftRadius: 8 },
  taxiBadgeText: { color: '#D4D4D8', fontSize: 10, fontWeight: '600' },

  timelineArea: { paddingHorizontal: 24, paddingTop: 32 },
  timelineItem: { flexDirection: 'row', marginBottom: 24, minHeight: 60 },
  timelineLeft: { width: 24, alignItems: 'center' },
  dot: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#E2E8F0', marginTop: 4 },
  verticalLine: { width: 1, backgroundColor: '#E2E8F0', flex: 1, marginTop: 4 },
  
  timelineContent: { flex: 1, paddingLeft: 16 },
  timelineTextRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  timelineMainText: { fontSize: 13, fontWeight: '600', color: '#0F172A' },
  timelineAmount: { fontSize: 16, fontWeight: '800', color: '#0F172A' },
  timelineSubText: { fontSize: 11, color: '#EF4444' },

  tcLink: { alignItems: 'flex-end', paddingHorizontal: 24, marginTop: 8 },
  tcText: { color: 'rgba(26, 15, 163, 1.00)', fontSize: 11, fontWeight: '600' },

  // Weekly State
  emptyStateContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 80, paddingHorizontal: 40 },
  emptyIconWrapper: { marginBottom: 24 },
  emptyStateText: { fontSize: 14, color: '#1E293B', textAlign: 'center', lineHeight: 22, fontWeight: '500' },

  // Bonus State
  bonusContainer: { flex: 1, paddingHorizontal: 24, paddingTop: 24 },
  
  oopsCard: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 24, marginBottom: -16, zIndex: 3, boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.05)', elevation: 4 },
  oopsHeader: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 24 },
  oopsTextCol: { marginLeft: 16, flex: 1 },
  oopsTitle: { fontSize: 16, fontWeight: '800', color: '#64748B', marginBottom: 4 },
  oopsDesc: { fontSize: 12, color: '#94A3B8', lineHeight: 18 },
  oopsVal: { fontSize: 12, color: '#94A3B8', fontWeight: '500', textAlign: 'center' },

  trophyCard: { backgroundColor: '#FFFFFF', borderBottomLeftRadius: 24, borderBottomRightRadius: 24, paddingTop: 40, paddingBottom: 24, alignItems: 'center', zIndex: 2 },
  dontWorryText: { fontSize: 13, color: '#64748B', marginBottom: 24 },
  trophyCircle: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#10B981', justifyContent: 'center', alignItems: 'center', marginBottom: 24 },
  trophyMainText: { fontSize: 16, fontWeight: '800', color: '#0F172A', textAlign: 'center', marginBottom: 16, lineHeight: 24 },
  trophySubText: { fontSize: 11, color: '#CBD5E1' },

  foodBannerWrapper: { marginTop: 32 },
  foodBannerTitle: { fontSize: 15, fontWeight: '800', color: '#0F172A', marginBottom: 12 },
  foodBannerCard: { height: 140, borderRadius: 16, position: 'relative' },
  foodBannerContent: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, flexDirection: 'row', padding: 20 },
  foodBannerLeft: { flex: 1, justifyContent: 'center' },
  foodBannerText: { color: '#FFFFFF', fontSize: 13, fontWeight: '600', lineHeight: 20, marginBottom: 12 },
  foodBannerBtn: { backgroundColor: 'rgba(0,0,0,0.2)', alignSelf: 'flex-start', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
  foodBannerBtnText: { color: '#FFFFFF', fontSize: 11, fontWeight: '700' },
  foodBannerImageWrap: { width: 80, height: 80, borderRadius: 40, overflow: 'hidden', alignSelf: 'center', borderWidth: 2, borderColor: '#FFFFFF' },
  foodBannerImage: { width: '100%', height: '100%' },
});
