import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { Card } from '@/components/ui/Card';
import { BackArrowIcon, CalendarIcon, OutlineStarIcon } from '@/components/ui/Icons';

export default function EmployeeScheduleScreen() {
  const router = useSafeRouter();

  const MOCK_SCHEDULE = [
    { day: 'Monday', time: '09:00 AM - 06:00 PM', status: 'Working' },
    { day: 'Tuesday', time: '09:00 AM - 06:00 PM', status: 'Working' },
    { day: 'Wednesday', time: '09:00 AM - 06:00 PM', status: 'Working' },
    { day: 'Thursday', time: '09:00 AM - 06:00 PM', status: 'Working' },
    { day: 'Friday', time: '09:00 AM - 06:00 PM', status: 'Working' },
    { day: 'Saturday', time: '09:00 AM - 02:00 PM', status: 'Half Day' },
    { day: 'Sunday', time: 'Off', status: 'Leave' },
  ];

  return (
    <GradientBackground style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity activeOpacity={1} onPress={() => router.back()} style={styles.backButton}>
            <BackArrowIcon size={24} color="#0F172A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Employee Schedule</Text>
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          <Card style={styles.card}>
            <View style={styles.titleRow}>
              <CalendarIcon size={20} color="#0F172A" />
              <Text style={styles.cardTitle}>Weekly Roster</Text>
            </View>

            {MOCK_SCHEDULE.map((item, idx) => (
              <View key={idx} style={styles.row}>
                <Text style={styles.dayText}>{item.day}</Text>
                <View style={styles.rightCol}>
                  <Text style={styles.timeText}>{item.time}</Text>
                  <View style={[
                    styles.badge,
                    item.status === 'Leave' && { backgroundColor: '#FEE2E2' },
                    item.status === 'Half Day' && { backgroundColor: '#FEF9C3' }
                  ]}>
                    <Text style={[
                      styles.badgeText,
                      item.status === 'Leave' && { color: '#991B1B' },
                      item.status === 'Half Day' && { color: '#854D0E' }
                    ]}>{item.status}</Text>
                  </View>
                </View>
              </View>
            ))}
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
  content: { padding: 20 },
  card: { padding: 20, backgroundColor: '#FFFFFF', borderRadius: 24 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 20 },
  cardTitle: { fontSize: 18, fontWeight: '700', color: '#0F172A' },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  dayText: { fontSize: 14, fontWeight: '600', color: '#334155', width: 80 },
  rightCol: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1, justifyContent: 'flex-end' },
  timeText: { fontSize: 13, color: '#64748B' },
  badge: { backgroundColor: '#DCFCE7', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, width: 60, alignItems: 'center' },
  badgeText: { fontSize: 10, fontWeight: '700', color: '#166534' }
});
