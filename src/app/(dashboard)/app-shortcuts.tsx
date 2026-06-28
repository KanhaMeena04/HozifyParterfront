import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { BackArrowIcon } from '@/components/ui/Icons';
import Svg, { Path } from 'react-native-svg';
import { useAndroidBack } from '@/hooks/useAndroidBack';

const AppShortcutIcon = ({ size = 28, color = 'rgba(26, 15, 163, 1.00)' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

export default function AppShortcutsScreen() {
  const router = useSafeRouter();
  useAndroidBack(() => router.back());

  const [shortcuts, setShortcuts] = useState({
    dutyToggle: true,
    viewBookings: true,
    walletEarnings: false,
    quickSupport: false,
  });

  const toggleShortcut = (key: keyof typeof shortcuts) => {
    setShortcuts(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleAddShortcuts = () => {
    Alert.alert(
      'Shortcuts Added',
      'Selected shortcuts have been created on your device home launcher.',
      [{ text: 'OK', onPress: () => router.back() }]
    );
  };

  return (
    <GradientBackground style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        
        <View style={styles.header}>
          <TouchableOpacity activeOpacity={1} onPress={() => router.back()} style={styles.backButton}>
            <BackArrowIcon size={24} color="#0F172A" />
          </TouchableOpacity>
          <View style={styles.headerTitleBox}>
            <Text style={styles.headerTitle}>App Shortcuts</Text>
            <Text style={styles.headerSubtitle}>Manage quick launcher actions</Text>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <View style={styles.card}>
            <View style={styles.topInfo}>
              <View style={styles.iconWrapper}>
                <AppShortcutIcon />
              </View>
              <Text style={styles.cardTitle}>Home Screen Shortcuts</Text>
              <Text style={styles.cardDesc}>
                Enable quick shortcuts on your mobile home screen launcher to access key sections of the Hozify Partner app instantly.
              </Text>
            </View>

            <View style={styles.divider} />

            {/* Shortcut Row 1 */}
            <View style={styles.row}>
              <View style={styles.textContainer}>
                <Text style={styles.label}>Duty Toggle Shortcut</Text>
                <Text style={styles.description}>Quickly switch between ON DUTY and OFF DUTY from home screen.</Text>
              </View>
              <Switch
                value={shortcuts.dutyToggle}
                onValueChange={() => toggleShortcut('dutyToggle')}
                trackColor={{ false: '#CBD5E1', true: '#86EFAC' }}
                thumbColor={shortcuts.dutyToggle ? '#22C55E' : '#94A3B8'}
              />
            </View>

            <View style={styles.divider} />

            {/* Shortcut Row 2 */}
            <View style={styles.row}>
              <View style={styles.textContainer}>
                <Text style={styles.label}>My Bookings Shortcut</Text>
                <Text style={styles.description}>Direct link to view active and upcoming service bookings.</Text>
              </View>
              <Switch
                value={shortcuts.viewBookings}
                onValueChange={() => toggleShortcut('viewBookings')}
                trackColor={{ false: '#CBD5E1', true: '#86EFAC' }}
                thumbColor={shortcuts.viewBookings ? '#22C55E' : '#94A3B8'}
              />
            </View>

            <View style={styles.divider} />

            {/* Shortcut Row 3 */}
            <View style={styles.row}>
              <View style={styles.textContainer}>
                <Text style={styles.label}>Wallet & Earnings Shortcut</Text>
                <Text style={styles.description}>Direct launcher link to check current balance and payout requests.</Text>
              </View>
              <Switch
                value={shortcuts.walletEarnings}
                onValueChange={() => toggleShortcut('walletEarnings')}
                trackColor={{ false: '#CBD5E1', true: '#86EFAC' }}
                thumbColor={shortcuts.walletEarnings ? '#22C55E' : '#94A3B8'}
              />
            </View>

            <View style={styles.divider} />

            {/* Shortcut Row 4 */}
            <View style={styles.row}>
              <View style={styles.textContainer}>
                <Text style={styles.label}>Quick Support Chat</Text>
                <Text style={styles.description}>Instant shortcut to open support chat window.</Text>
              </View>
              <Switch
                value={shortcuts.quickSupport}
                onValueChange={() => toggleShortcut('quickSupport')}
                trackColor={{ false: '#CBD5E1', true: '#86EFAC' }}
                thumbColor={shortcuts.quickSupport ? '#22C55E' : '#94A3B8'}
              />
            </View>
          </View>

          <TouchableOpacity activeOpacity={0.9} style={styles.actionButton} onPress={handleAddShortcuts}>
            <Text style={styles.actionBtnText}>Add Shortcuts to Home Screen</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1, backgroundColor: 'transparent' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  backButton: { marginRight: 12 },
  headerTitleBox: { flex: 1 },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#0F172A' },
  headerSubtitle: { fontSize: 13, color: '#64748B', marginTop: 2 },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    marginTop: 16,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.05)',
    elevation: 3,
  },
  topInfo: { alignItems: 'center', marginBottom: 20, marginTop: 10 },
  iconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: { fontSize: 18, fontWeight: '700', color: '#0F172A', marginBottom: 8 },
  cardDesc: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 10,
  },
  divider: { height: 1, backgroundColor: '#E2E8F0', marginVertical: 16 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 16,
  },
  textContainer: { flex: 1 },
  label: { fontSize: 15, fontWeight: '600', color: '#0F172A', marginBottom: 4 },
  description: { fontSize: 12, color: '#64748B', lineHeight: 16 },
  actionButton: {
    backgroundColor: 'rgba(26, 15, 163, 1.00)',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
  },
  actionBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
});
