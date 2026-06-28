import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { BackArrowIcon } from '@/components/ui/Icons';
import Svg, { Rect, Defs, LinearGradient, Stop, Path, Circle } from 'react-native-svg';
import { useAndroidBack } from '@/hooks/useAndroidBack';

const ExclamationCircleIcon = () => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="12" fill="#F59E0B" />
    <Path d="M12 7v5M12 16v.5" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

const CheckCircleIcon = () => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="12" fill="#10B981" />
    <Path d="M8 12.5l2.5 2.5 6-6" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const EmptyDashedCircleIcon = () => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="11" stroke="#CBD5E1" strokeWidth="2" strokeDasharray="4 4" />
  </Svg>
);

export default function AccountStatusScreen() {
  useAndroidBack();
  const router = useSafeRouter();

  return (
    <GradientBackground style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        
        <View style={styles.header}>
          <TouchableOpacity activeOpacity={1} onPress={() => router.back()} style={styles.backButton}>
            <BackArrowIcon size={24} color="#0F172A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Checking Account Status</Text>
          
          <TouchableOpacity activeOpacity={1} style={styles.helpBtn} onPress={() => router.push('/(dashboard)/help-advanced')}>
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
          
          <View style={styles.card}>
            
            {/* Step 1 */}
            <View style={styles.stepContainer}>
              <View style={styles.stepLeft}>
                <ExclamationCircleIcon />
                <View style={[styles.stepLine, { backgroundColor: '#F59E0B' }]} />
              </View>
              <View style={styles.stepRight}>
                <Text style={styles.stepLabel}>Your internet Connection</Text>
                <Text style={styles.stepTitle}>Ugh! Slow Internet</Text>
                <Text style={styles.stepDesc}>The network is slow right now!{'\n'}Please{'\n'}move to a stronger network zone</Text>
              </View>
            </View>

            {/* Step 2 */}
            <View style={styles.stepContainer}>
              <View style={styles.stepLeft}>
                <CheckCircleIcon />
                <View style={[styles.stepLine, { backgroundColor: '#10B981' }]} />
              </View>
              <View style={styles.stepRight}>
                <Text style={styles.stepLabel}>The last ride you completed</Text>
                <Text style={styles.stepTitle}>No Rides so far</Text>
                <Text style={styles.stepDesc}>You have not completed any rides.{'\n'}Let's{'\n'}see when you received your last{'\n'}order</Text>
              </View>
            </View>

            {/* Step 3 */}
            <View style={styles.stepContainer}>
              <View style={styles.stepLeft}>
                <CheckCircleIcon />
                <View style={[styles.stepLine, { backgroundColor: 'transparent' }]} />
              </View>
              <View style={styles.stepRight}>
                <Text style={styles.stepLabel}>Orders you received today</Text>
                <Text style={styles.stepTitle}>Zero order received</Text>
                <Text style={styles.stepDesc}>It seems you have received 0{'\n'}orders.{'\n'}Let's see if you are in a high{'\n'}demand{'\n'}area.</Text>
              </View>
            </View>

            {/* Step 4 (Empty) */}
            <View style={[styles.stepContainer, { marginBottom: 0 }]}>
              <View style={styles.stepLeft}>
                <EmptyDashedCircleIcon />
              </View>
              <View style={styles.stepRight} />
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

  card: { backgroundColor: '#FFFFFF', borderRadius: 24, padding: 24, paddingTop: 32 },

  stepContainer: { flexDirection: 'row', marginBottom: 2 },
  stepLeft: { width: 32, alignItems: 'center', marginRight: 16 },
  stepLine: { width: 2, flex: 1, marginTop: 4, marginBottom: 4 },
  
  stepRight: { flex: 1, paddingBottom: 32, marginTop: 2 },
  stepLabel: { fontSize: 12, color: '#94A3B8', marginBottom: 8 },
  stepTitle: { fontSize: 15, fontWeight: '800', color: '#0F172A', marginBottom: 8 },
  stepDesc: { fontSize: 12, color: '#334155', lineHeight: 20 },
});
