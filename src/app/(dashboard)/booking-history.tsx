import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { BackArrowIcon, ChevronDownIcon } from '@/components/ui/Icons';
import { useAndroidBack } from '@/hooks/useAndroidBack';
import { BookingDetailsModal } from '@/components/common/BookingDetailsModal';

const PRIMARY = 'rgba(26, 15, 163, 1.00)';

const BRANCHES  = ['All Branches',  'Downtown Branch', 'North Zone', 'East Hub'];
const EMPLOYEES = ['All Employees', 'Rahul Sharma',    'Priya Singh', 'Amit Kumar'];
const SERVICES  = ['All Services',  'Plumbing',        'Electrical',  'Cleaning', 'Carpentry'];

type HistoryTab = 'Completed' | 'Pending' | 'Canceled';

const BOOKING_HISTORY = [
  { id: 'B001', service: 'AC Repair',            date: 'Oct 13, 2023', amount: '₹500',   status: 'Completed' },
  { id: 'B002', service: 'AC gas filling',        date: 'Oct 13, 2023', amount: '₹500',   status: 'Completed' },
  { id: 'B003', service: 'AC pump Change',        date: 'Oct 12, 2023', amount: '₹200',   status: 'Completed' },
  { id: 'B004', service: 'AC Air Filter Change',  date: 'Oct 12, 2023', amount: '₹200',   status: 'Completed' },
  { id: 'B005', service: 'AC Repair',             date: 'Oct 11, 2023', amount: '₹350',   status: 'Pending'   },
  { id: 'B006', service: 'Washing Machine',       date: 'Oct 11, 2023', amount: '₹400',   status: 'Pending'   },
  { id: 'B007', service: 'RO Installation',       date: 'Oct 10, 2023', amount: '₹600',   status: 'Canceled'  },
  { id: 'B008', service: 'AC Servicing',          date: 'Oct 10, 2023', amount: '₹300',   status: 'Canceled'  },
];

const STATUS_COLOR: Record<HistoryTab, { bg: string; text: string }> = {
  Completed: { bg: '#DCFCE7', text: '#16A34A' },
  Pending:   { bg: '#FEF9C3', text: '#CA8A04' },
  Canceled:  { bg: '#FEE2E2', text: '#DC2626' },
};

const Dropdown = ({ value, options, onSelect }: { value: string; options: string[]; onSelect: (v: string) => void }) => {
  const [open, setOpen] = useState(false);
  return (
    <View style={[dd.wrap, open && { zIndex: 1000 }]}>
      <TouchableOpacity activeOpacity={1} style={dd.btn} onPress={() => setOpen(!open)}>
        <Text style={dd.btnText} numberOfLines={1}>{value}</Text>
        <ChevronDownIcon size={14} color="#64748B" />
      </TouchableOpacity>
      {open && (
        <View style={dd.menu}>
          {options.map((opt) => (
            <TouchableOpacity activeOpacity={1}
              key={opt}
              style={[dd.option, opt === value && dd.optionActive]}
              onPress={() => { onSelect(opt); setOpen(false); }}
            >
              <Text style={[dd.optionText, opt === value && dd.optionTextActive]}>{opt}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

export default function BookingHistoryScreen() {
  const router = useSafeRouter();
  useAndroidBack(() => router.back());

  const [historyTab,     setHistoryTab]     = useState<HistoryTab>('Completed');
  const [branchFilter,   setBranchFilter]   = useState('All Branches');
  const [employeeFilter, setEmployeeFilter] = useState('All Employees');
  const [serviceFilter,  setServiceFilter]  = useState('All Services');

  const [selectedBooking, setSelectedBooking] = useState<{
    id: string;
    service: string;
    date: string;
    amount: string;
    status: string;
  } | null>(null);

  const completedCount = BOOKING_HISTORY.filter(b => b.status === 'Completed').length;
  const pendingCount   = BOOKING_HISTORY.filter(b => b.status === 'Pending').length;
  const filtered       = BOOKING_HISTORY.filter(b => b.status === historyTab);

  return (
    <GradientBackground style={styles.container}>
      <SafeAreaView style={styles.safeArea}>

        <View style={styles.header}>
          <TouchableOpacity activeOpacity={1} onPress={() => router.back()} style={styles.backBtn}>
            <BackArrowIcon size={24} color="#0F172A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Booking History</Text>
        </View>

        <View style={styles.whitePopupWrapper}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

            {/* Branch + Employee + Services filters */}
          <View style={styles.filterCol}>
            <View style={[styles.filterRow, { zIndex: 30 }]}>
              <Dropdown value={branchFilter}   options={BRANCHES}   onSelect={setBranchFilter} />
              <Dropdown value={employeeFilter} options={EMPLOYEES}  onSelect={setEmployeeFilter} />
            </View>
            <View style={[styles.filterRow, { zIndex: 10 }]}>
              <Dropdown value={serviceFilter}  options={SERVICES}   onSelect={setServiceFilter} />
            </View>
          </View>

          {/* Stat boxes */}
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{completedCount}</Text>
              <Text style={styles.statLabel}>Completed Bookings</Text>
            </View>
            <View style={[styles.statBox, styles.statBoxPending]}>
              <Text style={[styles.statValue, { color: '#CA8A04' }]}>{pendingCount}</Text>
              <Text style={styles.statLabel}>Pending Bookings</Text>
            </View>
          </View>

          {/* Booking History section */}
          <Text style={styles.sectionTitle}>Booking History</Text>

          <View style={styles.tabsRow}>
            {(['Completed', 'Pending', 'Canceled'] as HistoryTab[]).map(tab => (
              <TouchableOpacity activeOpacity={1}
                key={tab}
                style={[styles.tab, historyTab === tab && styles.tabActive]}
                onPress={() => setHistoryTab(tab)}
              >
                <Text style={[styles.tabText, historyTab === tab && styles.tabTextActive]}>
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {filtered.length === 0 ? (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyText}>No {historyTab} bookings</Text>
            </View>
          ) : (
            <View style={styles.card}>
              {filtered.map((b, idx) => {
                const col = STATUS_COLOR[b.status as HistoryTab];
                return (
                  <View key={b.id}>
                    {idx > 0 && <View style={styles.itemDivider} />}
                    {/* Top: booking ID + service name + date */}
                    <View style={styles.cardTop}>
                      <Text style={styles.cardId}>{b.id}</Text>
                      <Text style={styles.cardService}>{b.service}</Text>
                      <Text style={styles.cardDate}>{b.date}</Text>
                    </View>

                    <View style={styles.cardDivider} />

                    {/* Bottom: amount + status + view button */}
                    <View style={styles.cardBottom}>
                      <Text style={styles.cardAmount}>{b.amount}</Text>
                      <View style={styles.cardBottomRight}>
                        <View style={[styles.statusBadge, { backgroundColor: col.bg }]}>
                          <Text style={[styles.statusText, { color: col.text }]}>{b.status}</Text>
                        </View>
                        <TouchableOpacity activeOpacity={1}
                          style={styles.viewBtn}
                          onPress={() => setSelectedBooking(b)}
                        >
                          <Text style={styles.viewBtnText}>View</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                );
              })}
            </View>
          )}

          </ScrollView>
        </View>

        <BookingDetailsModal 
          visible={!!selectedBooking} 
          booking={selectedBooking} 
          onClose={() => setSelectedBooking(null)} 
        />
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container:   { flex: 1 },
  safeArea:    { flex: 1 },
  header:      { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12 },
  backBtn:     { marginRight: 12 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#0F172A' },

  whitePopupWrapper: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    marginTop: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    overflow: 'hidden',
  },
  scroll:    { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 40 },
  filterCol: { marginBottom: 16, gap: 10, zIndex: 20, position: 'relative' },
  filterRow: { flexDirection: 'row', gap: 10, position: 'relative' },

  statsRow:       { flexDirection: 'row', gap: 12, marginBottom: 24 },
  statBox:        { flex: 1, backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, alignItems: 'center', borderWidth: 1, borderColor: '#F1F5F9', elevation: 1 },
  statBoxPending: { borderColor: '#FEF9C3', backgroundColor: '#FEFCE8' },
  statValue:      { fontSize: 28, fontWeight: '800', color: PRIMARY, marginBottom: 4 },
  statLabel:      { fontSize: 11, color: '#64748B', fontWeight: '500', textAlign: 'center' },

  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#0F172A', marginBottom: 14 },

  tabsRow: {
    flexDirection: 'row', marginBottom: 16,
    backgroundColor: '#E2E8F0', borderRadius: 12, padding: 4,
  },
  tab:           { flex: 1, paddingVertical: 9, borderRadius: 10, alignItems: 'center' },
  tabActive:     { backgroundColor: PRIMARY },
  tabText:       { fontSize: 12, fontWeight: '600', color: '#64748B', textAlign: 'center' },
  tabTextActive: { color: '#FFFFFF' },

  card: {
    backgroundColor: '#FFFFFF', borderRadius: 20, marginBottom: 12,
    borderWidth: 1, borderColor: '#F1F5F9', elevation: 2, overflow: 'hidden',
  },
  itemDivider: { height: 8, backgroundColor: '#F1F5F9' },
  cardTop:     { padding: 16, paddingBottom: 14 },
  cardId:      { fontSize: 10, fontWeight: '700', color: '#94A3B8', letterSpacing: 0.5, marginBottom: 4 },
  cardService: { fontSize: 14, fontWeight: '700', color: '#0F172A', marginBottom: 4 },
  cardDate:    { fontSize: 11, color: '#94A3B8', fontWeight: '500' },
  cardDivider: { height: 1, backgroundColor: '#F1F5F9' },
  cardBottom:  { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 14 },
  cardAmount:  { fontSize: 16, fontWeight: '800', color: PRIMARY },
  cardBottomRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  statusText:  { fontSize: 10, fontWeight: '700' },

  emptyBox:  { paddingVertical: 40, alignItems: 'center' },
  emptyText: { fontSize: 13, color: '#94A3B8' },

  viewBtn: {
    backgroundColor: PRIMARY,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 7,
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

const dd = StyleSheet.create({
  wrap:             { flex: 1, position: 'relative', zIndex: 10 },
  btn:              { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFFFFF', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, borderWidth: 1, borderColor: '#E2E8F0' },
  btnText:          { fontSize: 12, color: '#0F172A', fontWeight: '500', flex: 1, marginRight: 4 },
  menu:             { position: 'absolute', top: 46, left: 0, right: 0, backgroundColor: '#FFFFFF', borderRadius: 10, borderWidth: 1, borderColor: '#E2E8F0', zIndex: 999, elevation: 8 },
  option:           { paddingHorizontal: 14, paddingVertical: 10 },
  optionActive:     { backgroundColor: 'rgba(26,15,163,0.06)' },
  optionText:       { fontSize: 12, color: '#334155' },
  optionTextActive: { fontWeight: '700', color: PRIMARY },
});
