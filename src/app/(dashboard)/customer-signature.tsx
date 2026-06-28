import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { BackArrowIcon } from '@/components/ui/Icons';
import Svg, { Path } from 'react-native-svg';
import { useAndroidBack } from '@/hooks/useAndroidBack';

export default function CustomerSignatureScreen() {
  useAndroidBack();
  const router = useSafeRouter();
  
  // State to simulate drawing vs cleared pad
  const [hasSignature, setHasSignature] = useState(true);

  return (
    <GradientBackground style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        
        <View style={styles.header}>
          <TouchableOpacity activeOpacity={1} onPress={() => router.back()} style={styles.backButton}>
            <BackArrowIcon size={24} color="#0F172A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Customer Signature</Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <View style={styles.mainCard}>
            
            <Text style={styles.padTitle}>Please provide your signature</Text>
            
            {/* Signature Pad Area */}
            <View style={styles.signaturePad}>
              {hasSignature ? (
                <Svg width="100%" height="100%" viewBox="0 0 300 150" fill="none">
                  <Path d="M40 90 Q 70 20, 100 80 T 160 100 T 220 50 Q 250 30, 280 90" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                </Svg>
              ) : null}
            </View>
            
            <TouchableOpacity activeOpacity={1} style={styles.clearBtn} onPress={() => setHasSignature(!hasSignature)}>
              <Text style={styles.clearBtnText}>{hasSignature ? 'Clear' : 'Sign (Simulate)'}</Text>
            </TouchableOpacity>

            <View style={styles.divider} />

            {/* Details Section */}
            <View style={styles.detailRow}>
              <View>
                <Text style={styles.detailLabel}>Booking ID</Text>
                <Text style={styles.detailValue}>#BK123456</Text>
              </View>
              <View style={styles.statusBadge}>
                <Text style={styles.statusBadgeText}>Completed</Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <View>
                <Text style={styles.detailLabel}>Customer Name</Text>
                <Text style={styles.detailValue}>Rahul Sharma</Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <View>
                <Text style={styles.detailLabel}>Date & Time</Text>
                <Text style={styles.detailValue}>02 May 2024, 10:45 AM</Text>
              </View>
            </View>

            <TouchableOpacity activeOpacity={1} 
              style={styles.doneBtn} 
              onPress={() => router.push('/(dashboard)/payment-success')}
            >
              <Text style={styles.doneBtnText}>Done</Text>
            </TouchableOpacity>

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

  scrollContent: { paddingHorizontal: 16, paddingBottom: 24 },

  mainCard: { backgroundColor: '#FFFFFF', borderRadius: 24, padding: 24 },

  padTitle: { fontSize: 13, color: '#64748B', marginBottom: 16 },
  
  signaturePad: { height: 160, backgroundColor: '#F1F5F9', borderRadius: 16, borderWidth: 1, borderColor: '#E2E8F0', borderStyle: 'dashed', overflow: 'hidden' },
  
  clearBtn: { paddingVertical: 16, alignItems: 'center' },
  clearBtnText: { color: '#3B82F6', fontSize: 13, fontWeight: '700' },

  divider: { height: 1, backgroundColor: '#F8FAFC', marginVertical: 8, marginBottom: 24 },

  detailRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  detailLabel: { fontSize: 10, fontWeight: '700', color: '#94A3B8', letterSpacing: 0.5, marginBottom: 4 },
  detailValue: { fontSize: 14, fontWeight: '700', color: '#0F172A' },
  
  statusBadge: { backgroundColor: '#D1FAE5', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
  statusBadgeText: { color: '#059669', fontSize: 10, fontWeight: '700' },

  doneBtn: { backgroundColor: 'rgba(26, 15, 163, 1.00)', paddingVertical: 18, borderRadius: 24, alignItems: 'center', marginTop: 16 },
  doneBtnText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
});
