import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { BackArrowIcon, ChevronDownIcon } from '@/components/ui/Icons';
import { useAndroidBack } from '@/hooks/useAndroidBack';

const PRIMARY = 'rgba(26, 15, 163, 1.00)';

const BRANCHES = ['All Branches', 'Downtown Branch', 'North Zone', 'East Hub'];
const SERVICES = ['All Services', 'Plumbing', 'Electrical', 'Cleaning', 'Carpentry'];

type HistoryTab = 'Completed' | 'Pending' | 'Rejected' | 'Canceled';

const ORDER_HISTORY = [
  { id: 'B001', service: 'AC Repair',            date: 'Oct 13, 2023', amount: '₹500', status: 'Completed' },
  { id: 'B002', service: 'AC gas filling',       date: 'Oct 13, 2023', amount: '₹500', status: 'Completed' },
  { id: 'B003', service: 'AC pump Change',       date: 'Oct 12, 2023', amount: '₹200', status: 'Completed' },
  { id: 'B004', service: 'AC Air Filter Change', date: 'Oct 12, 2023', amount: '₹200', status: 'Completed' },
  { id: 'B005', service: 'AC Repair',            date: 'Oct 11, 2023', amount: '₹350', status: 'Pending'   },
  { id: 'B006', service: 'Washing Machine',      date: 'Oct 11, 2023', amount: '₹400', status: 'Pending'   },
  { id: 'B007', service: 'RO Installation',      date: 'Oct 10, 2023', amount: '₹600', status: 'Rejected'  },
  { id: 'B008', service: 'AC Servicing',         date: 'Oct 10, 2023', amount: '₹300', status: 'Canceled'  },
];

const STATUS_COLOR: Record<HistoryTab, { bg: string; text: string }> = {
  Completed: { bg: '#DCFCE7', text: '#16A34A' },
  Pending:   { bg: '#FEF9C3', text: '#CA8A04' },
  Rejected:  { bg: '#FEE2E2', text: '#991B1B' },
  Canceled:  { bg: '#FEE2E2', text: '#DC2626' },
};

const Dropdown = ({ value, options, onSelect }: { value: string; options: string[]; onSelect: (v: string) => void }) => {
  const [open, setOpen] = useState(false);
  return (
    <View style={dd.wrap}>
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

export default function OrderHistoryScreen() {
  const router = useSafeRouter();
  useAndroidBack(() => router.back());

  const [activeTab,      setActiveTab]      = useState<HistoryTab>('Completed');
  const [branchFilter,   setBranchFilter]   = useState('All Branches');
  const [serviceFilter,  setServiceFilter]  = useState('All Services');

  const completedCount = ORDER_HISTORY.filter(b => b.status === 'Completed').length;
  const pendingCount   = ORDER_HISTORY.filter(b => b.status === 'Pending').length;

  const filtered = ORDER_HISTORY.filter(b => b.status === activeTab);

  return (
    <GradientBackground style={styles.container}>
      <SafeAreaView style={styles.safeArea}>

        <View style={styles.header}>
          <TouchableOpacity activeOpacity={1} onPress={() => router.back()} style={styles.backBtn}>
            <BackArrowIcon size={24} color="#0F172A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Order History</Text>
        </View>

        <View style={styles.whitePopupWrapper}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

          {/* Branch + Services filters */}
          <View style={styles.filterRow}>
            <Dropdown value={branchFilter}  options={BRANCHES} onSelect={setBranchFilter} />
            <Dropdown value={serviceFilter} options={SERVICES} onSelect={setServiceFilter} />
          </View>

          {/* Stat boxes */}
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{completedCount}</Text>
              <Text style={styles.statLabel}>Completed Orders</Text>
            </View>
            <View style={[styles.statBox, styles.statBoxPending]}>
              <Text style={[styles.statValue, { color: '#CA8A04' }]}>{pendingCount}</Text>
              <Text style={styles.statLabel}>Pending Orders</Text>
            </View>
          </View>

          {/* Order History section */}
          <Text style={styles.sectionTitle}>Order History</Text>

          {/* Tabs */}
          <View style={styles.tabsRow}>
            {(['Completed', 'Pending', 'Rejected', 'Canceled'] as HistoryTab[]).map(tab => (
              <TouchableOpacity activeOpacity={1}
                key={tab}
                style={[styles.tab, activeTab === tab && styles.tabActive]}
                onPress={() => setActiveTab(tab)}
              >
                <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Order list */}
          {filtered.length === 0 ? (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyText}>No {activeTab} orders</Text>
            </View>
          ) : (
            <View style={styles.card}>
              {filtered.map((b, idx) => {
                const col = STATUS_COLOR[b.status as HistoryTab];
                return (
                  <View key={b.id}>
                    {idx > 0 && <View style={styles.cardDivider} />}
                    <View style={styles.cardRow}>
                      <View style={styles.cardLeft}>
                        <Text style={styles.cardId}>{b.id}</Text>
                        <Text style={styles.cardService}>{b.service}</Text>
                        <Text style={styles.cardDate}>{b.date}</Text>
                      </View>
                      <View style={styles.cardRight}>
                        <Text style={styles.cardAmount}>{b.amount}</Text>
                        <View style={[styles.statusBadge, { backgroundColor: col.bg }]}>
                          <Text style={[styles.statusText, { color: col.text }]}>{b.status}</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                );
              })}
            </View>
          )}

          </ScrollView>
        </View>

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

  scroll: { paddingHorizontal: 20, paddingBottom: 40, paddingTop: 24 },

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

  filterRow: { flexDirection: 'row', gap: 10, marginBottom: 16, zIndex: 20 },

  statsRow:       { flexDirection: 'row', gap: 12, marginBottom: 24 },
  statBox:        { flex: 1, backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, alignItems: 'center', borderWidth: 1, borderColor: '#F1F5F9' },
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
  tabText:       { fontSize: 10, fontWeight: '600', color: '#64748B', textAlign: 'center' },
  tabTextActive: { color: '#FFFFFF' },

  card: {
    marginBottom: 10,
  },
  cardRow:     { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 16 },
  cardDivider: { height: 1, backgroundColor: '#F1F5F9' },
  cardLeft:    { flex: 1 },
  cardId:      { fontSize: 10, fontWeight: '700', color: '#94A3B8', letterSpacing: 0.5, marginBottom: 3 },
  cardService: { fontSize: 13, fontWeight: '600', color: '#0F172A', marginBottom: 4 },
  cardDate:    { fontSize: 11, color: '#94A3B8' },
  cardRight:   { alignItems: 'flex-end', gap: 6 },
  cardAmount:  { fontSize: 14, fontWeight: '700', color: PRIMARY },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 20 },
  statusText:  { fontSize: 10, fontWeight: '700' },

  emptyBox:  { paddingVertical: 40, alignItems: 'center' },
  emptyText: { fontSize: 13, color: '#94A3B8' },
});

const dd = StyleSheet.create({
  wrap:    { flex: 1, position: 'relative', zIndex: 10 },
  btn:     { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFFFFF', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, borderWidth: 1, borderColor: '#E2E8F0' },
  btnText: { fontSize: 12, color: '#0F172A', fontWeight: '500', flex: 1, marginRight: 4 },
  menu:    { position: 'absolute', top: 46, left: 0, right: 0, backgroundColor: '#FFFFFF', borderRadius: 10, borderWidth: 1, borderColor: '#E2E8F0', zIndex: 999, elevation: 8 },
  option:          { paddingHorizontal: 14, paddingVertical: 10 },
  optionActive:    { backgroundColor: 'rgba(26,15,163,0.06)' },
  optionText:      { fontSize: 12, color: '#334155' },
  optionTextActive:{ fontWeight: '700', color: PRIMARY },
});
