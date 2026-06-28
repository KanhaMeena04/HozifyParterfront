import { useSafeRouter } from '@/hooks/useSafeRouter';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {  useLocalSearchParams } from 'expo-router';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/authStore';
import { Spacing } from '@/constants/theme';
import { InfoAlert } from '@/components/ui/InfoAlert';
import { useAndroidBack } from '@/hooks/useAndroidBack';

export default function ProfileScreen() {
  useAndroidBack();
  const router = useSafeRouter();
  const { mobileNumber } = useAuthStore();
  const { readonly, error } = useLocalSearchParams<{ readonly?: string, error?: string }>();

  return (
    <GradientBackground>
      <SafeAreaView style={styles.container}>
        {error === 'true' && (
          <View style={{ width: '90%', maxWidth: 400, marginBottom: 16 }}>
            <InfoAlert message="Your application was rejected. Please correct the errors and resubmit." />
          </View>
        )}
        <Card style={styles.card}>
          <Text style={styles.title}>Profile</Text>
          <Text style={styles.label}>Mobile Number</Text>
          <Text style={styles.value}>{mobileNumber || '—'}</Text>
          <Button
            title="Go Back"
            onPress={() => router.back()}
            variant="secondary"
            size="sm"
            style={{ marginTop: Spacing.four }}
          />
        </Card>
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.four,
  },
  card: {
    width: '90%',
    maxWidth: 400,
    padding: Spacing.four,
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: Spacing.four,
  },
  label: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  value: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0F172A',
  },
});
