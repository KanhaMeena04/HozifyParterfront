import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { BackArrowIcon } from '@/components/ui/Icons';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import { useAndroidBack } from '@/hooks/useAndroidBack';

const CheckboxIcon = ({ checked = false, color = 'rgba(26, 15, 163, 1.00)' }) => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" fill={checked ? color : 'transparent'} stroke={checked ? color : '#E2E8F0'} strokeWidth="2" />
    {checked && <Path d="M8 12L11 15L16 9" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />}
  </Svg>
);

const PaidIcon = ({ color = '#22C55E' }) => (
  <Svg width="12" height="12" viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" />
    <Path d="M8 12L11 15L16 9" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const DocumentIcon = ({ color = '#38BDF8' }) => (
  <Svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <Path d="M7 3H14L20 9V20C20 20.5523 19.5523 21 19 21H7C6.44772 21 6 20.5523 6 20V4C6 3.44772 6.44772 3 7 3Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M14 3V9H20" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const ClockOutlineIcon = ({ color = '#94A3B8' }) => (
  <Svg width="12" height="12" viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" />
    <Path d="M12 6V12L16 14" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const PlusCircleIcon = ({ color = 'rgba(26, 15, 163, 1.00)' }) => (
  <Svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" />
    <Path d="M12 8V16M8 12H16" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export default function WorkInProgressScreen() {
  useAndroidBack();
  const router = useSafeRouter();

  // State to toggle between In Progress (Image 1) and Completed (Image 4) views for demonstration
  const [isCompleted, setIsCompleted] = useState(false);

  const [checklist, setChecklist] = useState([
    { id: '1', title: 'Inspect the AC', checked: true },
    { id: '2', title: 'Cleaning', checked: true },
    { id: '3', title: 'Gas Filling', checked: false },
    { id: '4', title: 'Performance Test', checked: false },
  ]);

  const toggleCheck = (id: string) => {
    setChecklist(checklist.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
  };

  const handleWorkCompleted = () => {
    // In a real app, this might just route to invoice. 
    // Here we'll route directly to invoice summary as per the flow plan.
    router.push('/(dashboard)/invoice-summary');
  };

  return (
    <GradientBackground style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        
        <View style={styles.header}>
          <TouchableOpacity activeOpacity={1} onPress={() => router.back()} style={styles.backButton}>
            <BackArrowIcon size={24} color="#0F172A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Work in progress</Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          <View style={styles.mainCard}>
            
            {/* Top Banner Row */}
            <View style={styles.idRow}>
              <View>
                <Text style={styles.idLabel}>BOOKING ID</Text>
                <Text style={styles.idText}>#BK123456</Text>
              </View>
              <View style={styles.statusCol}>
                <View style={[styles.statusBadge, isCompleted ? styles.statusBadgeCompleted : styles.statusBadgeProgress]}>
                  <Text style={[styles.statusBadgeText, isCompleted ? styles.statusBadgeTextCompleted : styles.statusBadgeTextProgress]}>
                    {isCompleted ? 'COMPLETED' : 'IN PROGRESS'}
                  </Text>
                </View>
                {isCompleted ? (
                  <View style={styles.paidRow}>
                    <ClockOutlineIcon color="rgba(26, 15, 163, 1.00)" />
                    <Text style={styles.payLaterText}> PAY LATER</Text>
                  </View>
                ) : (
                  <View style={styles.paidRow}>
                    <PaidIcon />
                    <Text style={styles.paidText}> PAID</Text>
                  </View>
                )}
              </View>
            </View>

            {/* Time Trackers */}
            <View style={styles.timeTrackerRow}>
              <View style={styles.timeBox}>
                <View style={styles.timeLabelRow}>
                  <ClockOutlineIcon />
                  <Text style={styles.timeLabel}> {isCompleted ? 'END TIME' : 'START TIME'}</Text>
                </View>
                <Text style={styles.timeValue}>10:15 AM</Text>
              </View>
              
              <View style={styles.timeBoxDivider} />
              
              <View style={styles.timeBox}>
                <View style={styles.timeLabelRow}>
                  <ClockOutlineIcon />
                  <Text style={styles.timeLabel}> DURATION</Text>
                </View>
                <Text style={styles.timeValueBlue}>00:25:40</Text>
              </View>
            </View>

            {/* Job Checklist */}
            <Text style={styles.sectionTitle}>Job Checklist</Text>
            <View style={styles.checklistContainer}>
              {checklist.map((item, index) => (
                <TouchableOpacity activeOpacity={1} 
                  key={item.id} 
                  style={[styles.checklistItem, index === checklist.length - 1 && styles.checklistItemLast]}
                  onPress={() => toggleCheck(item.id)}
                >
                  <CheckboxIcon checked={item.checked} />
                  <Text style={styles.checklistItemText}>{item.title}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Job Notes */}
            <View style={styles.notesBox}>
              <View style={styles.notesHeader}>
                <DocumentIcon />
                <Text style={styles.notesTitle}> Job Notes</Text>
              </View>
              <Text style={styles.notesText}>Indoor unit filter was dirty. Gas level was low. Needs regular maintenance next time.</Text>
            </View>

            {/* Quick Actions for Active Job */}
            <View style={styles.quickActionsRow}>
              <TouchableOpacity activeOpacity={1} style={styles.quickActionBtn} onPress={() => router.push('/(dashboard)/add-extra-service')}>
                <PlusCircleIcon />
                <Text style={styles.quickActionText}>Add Service</Text>
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={1} style={styles.quickActionBtn} onPress={() => router.push('/(dashboard)/add-material')}>
                <PlusCircleIcon />
                <Text style={styles.quickActionText}>Add Material</Text>
              </TouchableOpacity>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionBtnsRow}>
              <TouchableOpacity activeOpacity={1} style={styles.pauseBtn} onPress={() => setIsCompleted(!isCompleted)}>
                <Text style={styles.pauseBtnText}>Pause Work</Text>
              </TouchableOpacity>
              
              <TouchableOpacity activeOpacity={1} style={styles.completeBtn} onPress={handleWorkCompleted}>
                <Text style={styles.completeBtnText}>Work Completed</Text>
              </TouchableOpacity>
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
  headerTitle: { fontSize: 16, fontWeight: '700', color: '#0F172A', flex: 1 },

  scrollContent: { paddingHorizontal: 16, paddingBottom: 40 },

  mainCard: { backgroundColor: '#FFFFFF', borderRadius: 24, padding: 20 },
  
  idRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 },
  idLabel: { fontSize: 10, color: '#94A3B8', fontWeight: '700', marginBottom: 4, letterSpacing: 0.5 },
  idText: { fontSize: 18, fontWeight: '800', color: '#0F172A' },
  statusCol: { alignItems: 'flex-end' },
  
  statusBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, marginBottom: 6 },
  statusBadgeProgress: { backgroundColor: '#A7F3D0' },
  statusBadgeCompleted: { backgroundColor: '#A7F3D0' }, // Both are light green in design
  statusBadgeText: { fontSize: 10, fontWeight: '800' },
  statusBadgeTextProgress: { color: '#047857' },
  statusBadgeTextCompleted: { color: '#047857' },

  paidRow: { flexDirection: 'row', alignItems: 'center' },
  paidText: { fontSize: 10, fontWeight: '800', color: '#22C55E' },
  payLaterText: { fontSize: 10, fontWeight: '800', color: 'rgba(26, 15, 163, 1.00)' },

  timeTrackerRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 16, paddingVertical: 16, paddingHorizontal: 12, borderWidth: 1, borderColor: '#F8FAFC', marginBottom: 32, boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.02)', elevation: 1 },
  timeBox: { flex: 1, alignItems: 'center' },
  timeBoxDivider: { width: 1, height: 40, backgroundColor: '#F1F5F9' },
  timeLabelRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  timeLabel: { fontSize: 10, color: '#94A3B8', fontWeight: '700', letterSpacing: 0.5 },
  timeValue: { fontSize: 15, fontWeight: '800', color: '#0F172A' },
  timeValueBlue: { fontSize: 15, fontWeight: '800', color: 'rgba(26, 15, 163, 1.00)' },

  sectionTitle: { fontSize: 14, fontWeight: '800', color: '#0F172A', marginBottom: 16 },

  checklistContainer: { marginBottom: 32 },
  checklistItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F8FAFC' },
  checklistItemLast: { borderBottomWidth: 0 },
  checklistItemText: { fontSize: 13, color: '#475569', marginLeft: 12 },

  notesBox: { backgroundColor: '#F0FDF4', borderRadius: 16, padding: 16, marginBottom: 24 },
  notesHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  notesTitle: { fontSize: 12, fontWeight: '800', color: '#0F172A' },
  notesText: { fontSize: 11, color: '#475569', lineHeight: 18 },

  quickActionsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 32, gap: 12 },
  quickActionBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F8FAFC', paddingVertical: 12, borderRadius: 12, borderWidth: 1, borderColor: '#F1F5F9' },
  quickActionText: { fontSize: 12, fontWeight: '700', color: 'rgba(26, 15, 163, 1.00)', marginLeft: 8 },

  actionBtnsRow: { flexDirection: 'row', gap: 12 },
  pauseBtn: { flex: 1, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: 'rgba(26, 15, 163, 1.00)', paddingVertical: 16, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  pauseBtnText: { color: 'rgba(26, 15, 163, 1.00)', fontSize: 13, fontWeight: '800' },
  
  completeBtn: { flex: 1, backgroundColor: 'rgba(26, 15, 163, 1.00)', paddingVertical: 16, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  completeBtnText: { color: '#FFFFFF', fontSize: 13, fontWeight: '800' },
});
