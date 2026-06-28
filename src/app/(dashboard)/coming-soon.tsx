import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { Card } from '@/components/ui/Card';
import { BackArrowIcon } from '@/components/ui/Icons';
import { Button } from '@/components/ui/Button';

export default function ComingSoonScreen() {
  const router = useSafeRouter();

  return (
    <GradientBackground style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom', 'left', 'right']}>
        <View style={styles.header}>
          <TouchableOpacity activeOpacity={1} onPress={() => router.back()} style={styles.backButton}>
            <BackArrowIcon size={24} color="#0F172A" />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <Card style={styles.card}>
            <Text style={styles.emoji}>🚧</Text>
            <Text style={styles.title}>Coming Soon</Text>
            <Text style={styles.description}>
              This feature is currently under development and will be available in a future update.
            </Text>
            <Button 
              title="Go Back" 
              onPress={() => router.back()} 
              style={styles.btn}
            />
          </Card>
        </View>
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  header: { paddingHorizontal: 20, paddingVertical: 16 },
  backButton: { width: 40, height: 40, justifyContent: 'center' },
  content: { flex: 1, padding: 20, justifyContent: 'center' },
  card: { padding: 32, backgroundColor: '#FFFFFF', borderRadius: 24, alignItems: 'center' },
  emoji: { fontSize: 64, marginBottom: 16 },
  title: { fontSize: 24, fontWeight: '800', color: '#0F172A', marginBottom: 12 },
  description: { fontSize: 16, color: '#64748B', textAlign: 'center', lineHeight: 24, marginBottom: 32 },
  btn: { width: '100%' }
});
