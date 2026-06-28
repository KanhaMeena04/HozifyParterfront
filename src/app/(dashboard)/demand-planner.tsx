import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { BackArrowIcon } from '@/components/ui/Icons';
import Svg, { Path, Circle } from 'react-native-svg';
import { useAndroidBack } from '@/hooks/useAndroidBack';

const InfoCircleIcon = ({ color = '#0F172A' }) => (
  <Svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="1.5" />
    <Path d="M12 16V12M12 8H12.01" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

const HelpIcon = ({ color = 'rgba(26, 15, 163, 1.00)' }) => (
  <Svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="1.5" />
    <Path d="M9.09 9C9.3251 8.33167 9.78915 7.76811 10.4 7.40913C11.0108 7.05016 11.7289 6.91894 12.4272 7.03871C13.1255 7.15849 13.7588 7.52152 14.2151 8.06353C14.6713 8.60553 14.9211 9.29152 14.92 10C14.92 12 11.92 13 11.92 13" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M12 17H12.01" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const HexagonIcon = ({ color = '#F97316' }) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path d="M21 16V8C21 7.24 20.6 6.54 19.93 6.16L13.06 2.16C12.4 1.78 11.6 1.78 10.94 2.16L4.07 6.16C3.4 6.54 3 7.24 3 8V16C3 16.76 3.4 17.46 4.07 17.84L10.94 21.84C11.6 22.22 12.4 22.22 13.06 21.84L19.93 17.84C20.6 17.46 21 16.76 21 16Z" fill="#FFEDD5" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M13 8L10 12H13L11 16" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const CityMapIcon = ({ color = 'rgba(26, 15, 163, 1.00)' }) => (
  <Svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <Path d="M9 20L3 17V4L9 7M9 20L15 17M9 20V7M15 17L21 20V7L15 4M15 17V4M9 7L15 4" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const ChevronLeft = ({ color = 'rgba(26, 15, 163, 1.00)' }) => (
  <Svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <Path d="M15 18L9 12L15 6" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const ChevronRight = ({ color = 'rgba(26, 15, 163, 1.00)' }) => (
  <Svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <Path d="M9 18L15 12L9 6" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export default function DemandPlannerScreen() {
  useAndroidBack(() => router.back());
  const router = useSafeRouter();

  return (
    <GradientBackground style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        
        <View style={styles.header}>
          <TouchableOpacity activeOpacity={1} onPress={() => router.back()} style={styles.backButton}>
            <BackArrowIcon size={24} color="#0F172A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Demand Planner</Text>
          <TouchableOpacity activeOpacity={1} style={styles.helpBtn}>
            <Text style={styles.helpBtnText}>Help</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoBanner}>
          <View style={styles.infoIconBox}>
            <InfoCircleIcon color="#0F172A" />
          </View>
          <Text style={styles.infoText}>Use demand planner to plan today's ride based on high demand areas from the last 4 Fridays</Text>
        </View>

        {/* Map Placeholder Area */}
        <View style={styles.mapArea}>
          {/* We use a colored background placeholder for the map */}
          <View style={styles.mapPlaceholder}>
            <View style={styles.hexGrid}>
              <HexagonIcon />
              <HexagonIcon />
              <HexagonIcon />
              <HexagonIcon />
              <HexagonIcon />
            </View>
          </View>
          
          {/* Floating Map Button */}
          <TouchableOpacity activeOpacity={1} style={styles.cityMapBtn}>
            <CityMapIcon />
            <Text style={styles.cityMapText}>City Map</Text>
          </TouchableOpacity>
        </View>

        {/* Bottom Sheet Area */}
        <View style={styles.bottomSheet}>
          <View style={styles.sheetHandle} />
          
          <View style={styles.timeScrollRow}>
            <TouchableOpacity activeOpacity={1} style={styles.arrowBtn}><ChevronLeft /></TouchableOpacity>
            
            <View style={styles.timePillActive}>
              <Text style={styles.timeTextActive}>9 AM</Text>
            </View>
            <View style={styles.timePill}>
              <Text style={styles.timeText}>10 AM</Text>
            </View>
            <View style={styles.timePill}>
              <Text style={styles.timeText}>11 AM</Text>
            </View>
            <View style={styles.timePill}>
              <Text style={styles.timeText}>12 PM</Text>
            </View>
            
            <TouchableOpacity activeOpacity={1} style={styles.arrowBtn}><ChevronRight /></TouchableOpacity>
          </View>

          <View style={styles.demandRow}>
            <View style={styles.demandIconCircle}>
              <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <Path d="M13 10V3L4 14H11V21L20 10H13Z" stroke="#F97316" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </Svg>
            </View>
            <Text style={styles.demandText}>High Demand Areas - In Last 4 Fridays</Text>
          </View>

          <TouchableOpacity activeOpacity={1} style={styles.howItWorksBtn}>
            <HelpIcon />
            <Text style={styles.howItWorksText}>How it works?</Text>
          </TouchableOpacity>

        </View>

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
  helpBtn: { backgroundColor: '#F97316', paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20 },
  helpBtnText: { color: '#FFFFFF', fontSize: 12, fontWeight: '600' },

  infoBanner: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.5)', padding: 16 },
  infoIconBox: { marginTop: 2, marginRight: 8 },
  infoText: { flex: 1, fontSize: 11, color: '#0F172A', lineHeight: 16 },

  mapArea: { flex: 1, backgroundColor: '#E2E8F0', position: 'relative' },
  mapPlaceholder: { flex: 1, backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center' },
  hexGrid: { flexDirection: 'row', flexWrap: 'wrap', width: 200, justifyContent: 'center', gap: 10, opacity: 0.5 },
  
  cityMapBtn: { position: 'absolute', bottom: 20, right: 20, backgroundColor: '#FFFFFF', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)', elevation: 4 },
  cityMapText: { fontSize: 12, fontWeight: '700', color: '#0F172A', marginLeft: 8 },

  bottomSheet: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, paddingBottom: 40 },
  sheetHandle: { width: 40, height: 4, backgroundColor: '#E2E8F0', borderRadius: 2, alignSelf: 'center', marginBottom: 20 },
  
  timeScrollRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 },
  arrowBtn: { padding: 4 },
  timePillActive: { backgroundColor: '#DBEAFE', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  timeTextActive: { color: 'rgba(26, 15, 163, 1.00)', fontSize: 12, fontWeight: '700' },
  timePill: { paddingHorizontal: 16, paddingVertical: 8 },
  timeText: { color: '#64748B', fontSize: 12, fontWeight: '600' },

  demandRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  demandIconCircle: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#FFEDD5', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  demandText: { flex: 1, fontSize: 12, fontWeight: '700', color: '#0F172A' },

  howItWorksBtn: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start' },
  howItWorksText: { fontSize: 12, fontWeight: '700', color: 'rgba(26, 15, 163, 1.00)', marginLeft: 6 },
});
