import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { BackArrowIcon, RejectedIcon } from '@/components/ui/Icons';

export default function RejectedReasonsScreen() {
  const router = useSafeRouter();

  return (
    <GradientBackground style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <View style={styles.header}>
          <TouchableOpacity activeOpacity={1} onPress={() => router.back()} style={styles.backButton}>
            <BackArrowIcon size={24} color="#0F172A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Rejection Details</Text>
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.iconWrapper}>
            <RejectedIcon size={64} color="#EF4444" />
          </View>
          <Text style={styles.title}>Application Rejected</Text>
          <Text style={styles.desc}>
            Your recent submission was reviewed and rejected by our verification team. 
            Please fix the issues highlighted below and re-submit.
          </Text>

          <Card style={styles.card}>
            <Text style={styles.cardTitle}>Reasons for Rejection</Text>
            
            <View style={styles.reasonBox}>
              <Text style={styles.reasonTitle}>1. KYC Document Blurry</Text>
              <Text style={styles.reasonDesc}>The uploaded Aadhar card image is too blurry. The text and photo are not clearly visible.</Text>
            </View>
            
            <View style={styles.reasonBox}>
              <Text style={styles.reasonTitle}>2. Name Mismatch</Text>
              <Text style={styles.reasonDesc}>The name on your profile does not match the name on the uploaded PAN card.</Text>
            </View>

            <Button 
              title="Update Application" 
              onPress={() => router.replace('/(tabs)')} 
              variant="primary" 
              style={styles.btn} 
            />
          </Card>
        </ScrollView>
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16 },
  backButton: { marginRight: 12 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#0F172A' },
  content: { padding: 20, alignItems: 'center' },
  iconWrapper: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#FEE2E2', justifyContent: 'center', alignItems: 'center', marginBottom: 24, marginTop: 20 },
  title: { fontSize: 22, fontWeight: '800', color: '#0F172A', marginBottom: 12, textAlign: 'center' },
  desc: { fontSize: 14, color: '#64748B', textAlign: 'center', lineHeight: 22, marginBottom: 32 },
  card: { padding: 20, backgroundColor: '#FFFFFF', borderRadius: 24, width: '100%', borderWidth: 1, borderColor: '#FEE2E2' },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#0F172A', marginBottom: 16 },
  reasonBox: { backgroundColor: '#FEF2F2', padding: 16, borderRadius: 12, marginBottom: 12 },
  reasonTitle: { fontSize: 14, fontWeight: '700', color: '#991B1B', marginBottom: 6 },
  reasonDesc: { fontSize: 13, color: '#7F1D1D', lineHeight: 20 },
  btn: { marginTop: 12 }
});
