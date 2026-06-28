import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { GradientBackground } from '@/components/ui/GradientBackground';
import Svg, { Path, Circle } from 'react-native-svg';
import { useAndroidBack } from '@/hooks/useAndroidBack';
import { StorageService } from '@/services/storage.service';

const HamburgerMenuIcon = ({ color = '#0F172A', size = 24 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M3 12h18M3 6h18M3 18h18" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

const NotificationBellIcon = ({ color = '#0F172A', size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const ServiceIconWrapper = ({ title }: { title: string }) => {
  const isAc = title.toLowerCase().includes('ac');
  const isPlumb = title.toLowerCase().includes('plumb');
  let bg = '#EEF2FF';
  let emoji = '⚡';
  
  if (isAc) {
    bg = '#E0F2FE';
    emoji = '❄️';
  } else if (isPlumb) {
    bg = '#ECFDF5';
    emoji = '🚰';
  }

  return (
    <View style={[styles.iconBox, { backgroundColor: bg }]}>
      <Text style={{ fontSize: 18 }}>{emoji}</Text>
    </View>
  );
};

export default function OrdersListScreen() {
  useAndroidBack();
  const router = useSafeRouter();
  const [activeTab, setActiveTab] = useState<'New' | 'Accepted' | 'In Progress' | 'Ready'>('New');
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    const loadRequestsAndOrders = async () => {
      const stored = await StorageService.getMaterialRequests();
      
      // Map stored requests as orders if they are approved
      const formatted = stored.map((r: any) => ({
        id: r.requestId.replace('RQ', 'ORD'),
        title: r.items.map((i: any) => i.name).includes('Copper Pipe') ? 'AC Repair' : 'Material Order',
        status: r.status === 'approved' ? 'New' : (r.status === 'completed' ? 'Ready' : 'Accepted'),
        price: r.grandTotal ? `₹${r.grandTotal.toFixed(2)}` : '₹1,894.44',
        customer: r.customerName || 'Rajesh Kumar',
        address: r.location || 'Vasant Kunj, New Delhi',
        requestId: r.requestId,
        bookingId: r.bookingId,
        items: r.items.map((item: any) => ({
          name: item.name,
          qty: parseInt(item.qty.replace(/[^0-9]/g, '')) || 1,
          price: item.quotedPrice || item.price || 500
        }))
      }));

      const fallbacks = [
        {
          id: 'ORD789456',
          title: 'AC Repair',
          status: 'New',
          price: '₹1,894.44',
          customer: 'Rajesh Kumar',
          address: 'Vasant Kunj, New Delhi',
          requestId: 'RQ123456',
          bookingId: 'BK123456',
          items: [
            { name: 'Split AC Deep Cleaning', qty: 1, price: 1299.00 },
            { name: 'Gas Refilling (R32)', qty: 1, price: 595.44 }
          ]
        },
        {
          id: 'ORD442190',
          title: 'Plumbing Checkup',
          status: 'Accepted',
          price: '₹499.00',
          customer: 'Anjali Sharma',
          address: 'Gachibowli, Hyderabad',
          requestId: 'RQ882312',
          bookingId: 'BK-5512',
          items: [
            { name: 'Tap Leakage Repair', qty: 2, price: 499.00 }
          ]
        },
        {
          id: 'ORD112340',
          title: 'Electrical Install',
          status: 'In Progress',
          price: '₹3,250.00',
          customer: 'Vikram Singh',
          address: 'Andheri West, Mumbai',
          requestId: 'RQ773211',
          bookingId: 'BK-1029',
          items: [
            { name: 'Whole House Wiring', qty: 1, price: 3250.00 }
          ]
        },
        {
          id: 'ORD334521',
          title: 'AC Servicing',
          status: 'Ready',
          price: '₹750.00',
          customer: 'Priya Mehta',
          address: 'Banjara Hills, Hyderabad',
          requestId: 'RQ991234',
          bookingId: 'BK-2210',
          items: [
            { name: 'AC Filter Cleaning', qty: 1, price: 750.00 }
          ]
        }
      ];

      // Combine and filter duplicates
      const combined = [...formatted];
      fallbacks.forEach(f => {
        if (!combined.some(c => c.requestId === f.requestId)) {
          combined.push(f);
        }
      });

      setOrders(combined);
    };
    loadRequestsAndOrders();
  }, []);

  const handleAccept = (order: any) => {
    // Navigate straight to acceptance dispatch flow
    router.push({
      pathname: '/(dashboard)/seller/material-dispatch',
      params: { requestId: order.requestId, bookingId: order.bookingId }
    });
  };

  const getFilteredOrders = () => {
    return orders.filter(order => {
      if (activeTab === 'New') {
        return order.status === 'New' || order.status === 'pending';
      } else if (activeTab === 'Accepted') {
        return order.status === 'Accepted';
      } else if (activeTab === 'In Progress') {
        return order.status === 'In Progress' || order.status === 'quoted';
      } else {
        return order.status === 'Ready' || order.status === 'completed';
      }
    });
  };

  const filtered = getFilteredOrders();

  return (
    <GradientBackground style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity activeOpacity={1} onPress={() => router.back()} style={styles.menuButton}>
            <HamburgerMenuIcon size={24} color="#0F172A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Order List</Text>
          <TouchableOpacity activeOpacity={1} style={styles.bellBtn}>
            <NotificationBellIcon />
          </TouchableOpacity>
        </View>

        {/* Tab Selection */}
        <View style={styles.tabBar}>
          {(['New', 'Accepted', 'In Progress', 'Ready'] as const).map((tab) => (
            <TouchableOpacity activeOpacity={1}
              key={tab}
              style={[styles.tabItem, activeTab === tab && styles.activeTabItem]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Order Scroll list */}
        <ScrollView contentContainerStyle={styles.content}>
          {filtered.map((order) => (
            <View key={order.id} style={styles.card}>
              
              {/* Top Title Section */}
              <View style={styles.cardHeader}>
                <ServiceIconWrapper title={order.title} />
                <View style={styles.headerInfo}>
                  <Text style={styles.orderTitleText}>{order.title}</Text>
                  <Text style={styles.orderIdText}>{order.id}</Text>
                </View>
                <View style={styles.priceCol}>
                  <Text style={styles.priceText}>{order.price}</Text>
                  <View style={styles.newOrderBadge}>
                    <View style={styles.greenDot} />
                    <Text style={styles.newOrderText}>New Order</Text>
                  </View>
                </View>
              </View>

              <View style={styles.divider} />

              {/* Metadata Details */}
              <View style={styles.metaSection}>
                <View style={styles.metaRow}>
                  <Text style={styles.metaLabel}>👤 Customer</Text>
                  <Text style={styles.metaValue}>{order.customer}</Text>
                </View>
                <View style={styles.metaRow}>
                  <Text style={styles.metaLabel}>📍 Address</Text>
                  <Text style={styles.metaValue} numberOfLines={1}>{order.address}</Text>
                </View>
              </View>

              {/* Order Items Card Breakdown */}
              <View style={styles.orderItemsBox}>
                <Text style={styles.boxHeading}>Order Items</Text>
                {order.items.map((item: any, idx: number) => (
                  <View key={idx} style={styles.itemRow}>
                    <Text style={styles.itemNameText}>
                      {item.name} <Text style={{ color: '#64748B', fontWeight: '500' }}>x {item.qty}</Text>
                    </Text>
                    <Text style={styles.itemPriceText}>₹{item.price.toFixed(2)}</Text>
                  </View>
                ))}
              </View>

              {/* Buttons */}
              <View style={styles.actionBtnRow}>
                <TouchableOpacity activeOpacity={1} style={styles.rejectBtn} onPress={() => alert('Order Rejected')}>
                  <Text style={styles.rejectBtnText}>Reject</Text>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={1} style={styles.acceptBtn} onPress={() => handleAccept(order)}>
                  <Text style={styles.acceptBtnText}>Accept Order</Text>
                </TouchableOpacity>
              </View>

            </View>
          ))}

          {filtered.length === 0 && (
            <Text style={styles.emptyText}>No orders in this tab.</Text>
          )}
        </ScrollView>

      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: 20, 
    paddingTop: 16, 
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9'
  },
  menuButton: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#0F172A' },
  bellBtn: { padding: 4 },

  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTabItem: {
    borderBottomColor: 'rgba(26, 15, 163, 1.00)',
    backgroundColor: '#F8FAFC'
  },
  tabText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  activeTabText: {
    color: 'rgba(26, 15, 163, 1.00)',
  },

  content: { padding: 20, gap: 16 },

  card: { 
    backgroundColor: '#FFFFFF', 
    borderRadius: 20, 
    borderWidth: 1, 
    borderColor: '#E2E8F0',
    padding: 16,
    ...Platform.select({
      web: { boxShadow: '0px 2px 8px rgba(0,0,0,0.05)' },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.02,
        shadowRadius: 8,
        elevation: 2,
      },
    }),
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center' },
  iconBox: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  headerInfo: { flex: 1 },
  orderTitleText: { fontSize: 15, fontWeight: '700', color: '#0F172A' },
  orderIdText: { fontSize: 11, color: '#64748B', marginTop: 2 },
  priceCol: { alignItems: 'flex-end' },
  priceText: { fontSize: 15, fontWeight: '800', color: '#0F172A', marginBottom: 2 },
  newOrderBadge: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  greenDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#22C55E' },
  newOrderText: { fontSize: 9, fontWeight: '700', color: '#22C55E' },

  divider: { height: 1, backgroundColor: '#F1F5F9', marginVertical: 12 },

  metaSection: { gap: 8, marginBottom: 12 },
  metaRow: { flexDirection: 'row', alignItems: 'center' },
  metaLabel: { fontSize: 11, color: '#64748B', width: 90 },
  metaValue: { fontSize: 12, fontWeight: '600', color: '#334155', flex: 1 },

  orderItemsBox: { backgroundColor: '#F8FAFC', padding: 12, borderRadius: 12, borderWidth: 1, borderColor: '#F1F5F9', gap: 8, marginBottom: 16 },
  boxHeading: { fontSize: 10, fontWeight: '800', color: '#94A3B8', letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 2 },
  itemRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  itemNameText: { fontSize: 12, fontWeight: '700', color: '#334155' },
  itemPriceText: { fontSize: 12, fontWeight: '700', color: '#475569' },

  actionBtnRow: { flexDirection: 'row', gap: 12 },
  rejectBtn: { flex: 1, height: 44, borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  rejectBtnText: { color: '#64748B', fontSize: 13, fontWeight: '700' },
  acceptBtn: { flex: 1.5, height: 44, backgroundColor: 'rgba(26, 15, 163, 1.00)', borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  acceptBtnText: { color: '#FFFFFF', fontSize: 13, fontWeight: '700' },

  emptyText: { textAlign: 'center', color: '#64748B', marginTop: 40, fontSize: 13 }
});
