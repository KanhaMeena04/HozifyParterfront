import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { BackArrowIcon, ShieldIcon } from '@/components/ui/Icons';

export default function FraudAlertScreen() {
  const router = useSafeRouter();

  return (
    <GradientBackground style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <View style={styles.header}>
          <TouchableOpacity activeOpacity={1} onPress={() => router.back()} style={styles.backButton}>
            <BackArrowIcon size={24} color="#0F172A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Account Security</Text>
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.iconWrapper}>
            <ShieldIcon size={64} color="#EF4444" />
          </View>
          <Text style={styles.title}>Suspicious Activity Detected</Text>
          <Text style={styles.desc}>
            We noticed some unusual withdrawal requests from your account. 
            For your security, withdrawals have been temporarily paused.
          </Text>

          <Card style={styles.card}>
            <Text style={styles.cardTitle}>What you need to do:</Text>
            <View style={styles.row}>
              <View style={styles.bullet} />
              <Text style={styles.bulletText}>Verify your identity using Aadhaar/PAN.</Text>
            </View>
            <View style={styles.row}>
              <View style={styles.bullet} />
              <Text style={styles.bulletText}>Change your Hozify Partner password.</Text>
            </View>
            <View style={styles.row}>
              <View style={styles.bullet} />
              <Text style={styles.bulletText}>Contact Partner Support if you did not initiate these requests.</Text>
            </View>

            <Button 
              title="Verify Identity Now" 
              onPress={() => alert('Starting verification flow...')} 
              variant="primary" 
              style={styles.btn} 
            />
            <Button 
              title="Contact Support" 
              onPress={() => router.push('/(dashboard)/support-chat')} 
              variant="outline" 
              style={styles.btnOutline} 
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
  row: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12, paddingRight: 16 },
  bullet: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#EF4444', marginTop: 6, marginRight: 12 },
  bulletText: { fontSize: 13, color: '#475569', lineHeight: 20 },
  btn: { marginTop: 20 },
  btnOutline: { marginTop: 12, borderColor: '#CBD5E1' }
});
