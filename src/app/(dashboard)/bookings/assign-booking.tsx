import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { useLocalSearchParams } from 'expo-router';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { Button } from '@/components/ui/Button';
import { BackArrowIcon, LocationPinIcon } from '@/components/ui/Icons';
import { useEmployeeStore } from '@/store/employeeStore';
import { StorageService } from '@/services/storage.service';

export default function AssignBookingScreen() {
  const router = useSafeRouter();
  const { bookingId } = useLocalSearchParams<{ bookingId: string }>();
  const { employees } = useEmployeeStore();
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);
  const [isAssigning, setIsAssigning] = useState(false);

  const handleAssign = async () => {
    if (!selectedEmployeeId) return;
    setIsAssigning(true);
    
    if (bookingId) {
      const bks = await StorageService.getBookings();
      const bk = bks.find(b => b.bookingId === bookingId || b.bookingId.replace('#', '') === bookingId);
      if (bk) {
        const updated = { ...bk, employeeId: selectedEmployeeId, status: 'accepted' as const };
        await StorageService.saveBooking(updated);
      }
    }

    setTimeout(() => {
      setIsAssigning(false);
      router.back();
    }, 1500);
  };

  return (
    <GradientBackground style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <View style={styles.header}>
          <TouchableOpacity activeOpacity={1} onPress={() => router.back()} style={styles.backButton}>
            <BackArrowIcon size={24} color="#0F172A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Assign Employee</Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>Select an employee for this booking</Text>

          <FlatList
            data={employees.filter(e => e.isActive)}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.list}
            renderItem={({ item }) => (
              <TouchableOpacity activeOpacity={1} 
                style={[
                  styles.card,
                  selectedEmployeeId === item.id && styles.cardSelected
                ]}
                onPress={() => setSelectedEmployeeId(item.id)}
              >
                <View style={styles.cardHeaderFlex}>
                  <Text style={styles.empName}>{item.name}</Text>
                  <View style={[styles.radio, selectedEmployeeId === item.id && styles.radioSelected]}>
                    {selectedEmployeeId === item.id && <View style={styles.radioInner} />}
                  </View>
                </View>
                <View style={styles.row}>
                  <LocationPinIcon size={14} color="#64748B" />
                  <Text style={styles.locationText}>{item.branchName}</Text>
                </View>
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <View style={styles.emptyBox}>
                <Text style={styles.emptyText}>No active employees available</Text>
              </View>
            }
          />

          <Button 
            title="Confirm Assignment" 
            onPress={handleAssign} 
            isLoading={isAssigning}
            disabled={!selectedEmployeeId}
            variant="primary" 
            style={styles.assignBtn} 
          />
        </View>
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
  content: { flex: 1, padding: 20 },
  title: { fontSize: 14, color: '#64748B', marginBottom: 16 },
  list: { gap: 12, paddingBottom: 20 },
  card: { padding: 16, backgroundColor: '#FFFFFF', borderRadius: 16, borderWidth: 1, borderColor: '#E2E8F0' },
  cardSelected: { borderColor: 'rgba(26, 15, 163, 1)', backgroundColor: '#F5F3FF' },
  cardHeaderFlex: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  empName: { fontSize: 16, fontWeight: '600', color: '#0F172A' },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 1, borderColor: '#CBD5E1', justifyContent: 'center', alignItems: 'center' },
  radioSelected: { borderColor: 'rgba(26, 15, 163, 1)' },
  radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: 'rgba(26, 15, 163, 1)' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  locationText: { fontSize: 12, color: '#64748B' },
  emptyBox: { padding: 32, alignItems: 'center', justifyContent: 'center' },
  emptyText: { color: '#94A3B8' },
  assignBtn: { marginTop: 'auto', marginBottom: 20 }
});
