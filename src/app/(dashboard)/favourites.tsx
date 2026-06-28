import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { BackArrowIcon } from '@/components/ui/Icons';
import Svg, { Path } from 'react-native-svg';
import { useAndroidBack } from '@/hooks/useAndroidBack';

const PhoneCallIcon = ({ size = 16, color = '#3B82F6' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

const MessageIcon = ({ size = 16, color = '#22C55E' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

export default function FavouritesScreen() {
  const router = useSafeRouter();
  useAndroidBack(() => router.back());

  const [activeTab, setActiveTab] = useState<'customers' | 'regions'>('customers');

  const favCustomers = [
    { id: 1, name: 'Ananya Sharma', jobs: 12, rating: '5.0', image: 'https://i.pravatar.cc/150?img=49', address: 'Indiranagar, Bangalore' },
    { id: 2, name: 'Rohan Mehra', jobs: 8, rating: '5.0', image: 'https://i.pravatar.cc/150?img=33', address: 'HSR Layout, Bangalore' },
    { id: 3, name: 'Priya Patel', jobs: 15, rating: '4.9', image: 'https://i.pravatar.cc/150?img=45', address: 'Koramangala, Bangalore' },
    { id: 4, name: 'Vikram Singh', jobs: 6, rating: '5.0', image: 'https://i.pravatar.cc/150?img=11', address: 'Whitefield, Bangalore' },
  ];

  const favRegions = [
    { id: 1, name: 'Indiranagar Sector A & B', status: 'Active', density: 'High Demand' },
    { id: 2, name: 'Koramangala 4th Block', status: 'Active', density: 'Medium Demand' },
    { id: 3, name: 'HSR Layout Sector 1-3', status: 'Active', density: 'High Demand' },
  ];

  const handleContact = (name: string, type: 'call' | 'chat') => {
    Alert.alert(
      type === 'call' ? 'Call Customer' : 'Chat Customer',
      `Connecting you to ${name}...`
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
            <Text style={styles.headerTitle}>Favourites</Text>
            <Text style={styles.headerSubtitle}>View your preferred clients & regions</Text>
          </View>
        </View>

        {/* Tab Buttons */}
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            activeOpacity={0.9} 
            style={[styles.tabButton, activeTab === 'customers' && styles.activeTabButton]}
            onPress={() => setActiveTab('customers')}
          >
            <Text style={[styles.tabText, activeTab === 'customers' && styles.activeTabText]}>Favourite Customers</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            activeOpacity={0.9} 
            style={[styles.tabButton, activeTab === 'regions' && styles.activeTabButton]}
            onPress={() => setActiveTab('regions')}
          >
            <Text style={[styles.tabText, activeTab === 'regions' && styles.activeTabText]}>My Regions</Text>
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {activeTab === 'customers' ? (
            favCustomers.map((cust) => (
              <View key={cust.id} style={styles.customerCard}>
                <Image source={{ uri: cust.image }} style={styles.customerImage} />
                <View style={styles.customerDetails}>
                  <Text style={styles.customerName}>{cust.name}</Text>
                  <Text style={styles.customerAddress}>{cust.address}</Text>
                  <View style={styles.statsRow}>
                    <Text style={styles.statsText}>{cust.jobs} Jobs done</Text>
                    <View style={styles.dot} />
                    <Text style={styles.ratingText}>⭐ {cust.rating}</Text>
                  </View>
                </View>
                <View style={styles.actionColumn}>
                  <TouchableOpacity 
                    activeOpacity={0.8} 
                    style={[styles.actionBtn, styles.callBtn]}
                    onPress={() => handleContact(cust.name, 'call')}
                  >
                    <PhoneCallIcon size={16} color="#3B82F6" />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    activeOpacity={0.8} 
                    style={[styles.actionBtn, styles.chatBtn]}
                    onPress={() => handleContact(cust.name, 'chat')}
                  >
                    <MessageIcon size={16} color="#22C55E" />
                  </TouchableOpacity>
                </View>
              </View>
            ))
          ) : (
            favRegions.map((region) => (
              <View key={region.id} style={styles.regionCard}>
                <View style={styles.regionInfo}>
                  <Text style={styles.regionName}>{region.name}</Text>
                  <View style={styles.regionBadgeRow}>
                    <View style={styles.badgeActive}>
                      <Text style={styles.badgeActiveText}>{region.status}</Text>
                    </View>
                    <Text style={styles.densityText}>{region.density}</Text>
                  </View>
                </View>
                <TouchableOpacity 
                  activeOpacity={0.8}
                  style={styles.manageBtn}
                  onPress={() => Alert.alert('Manage Region', `Do you want to edit coverage for ${region.name}?`)}
                >
                  <Text style={styles.manageBtnText}>Manage</Text>
                </TouchableOpacity>
              </View>
            ))
          )}
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
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#E2E8F0',
    borderRadius: 14,
    padding: 4,
    marginHorizontal: 20,
    marginTop: 16,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 10,
  },
  activeTabButton: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  tabText: { fontSize: 14, fontWeight: '500', color: '#64748B' },
  activeTabText: { color: '#0F172A', fontWeight: '600' },
  scrollContent: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 40 },
  customerCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.04)',
    elevation: 2,
  },
  customerImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 14,
  },
  customerDetails: { flex: 1 },
  customerName: { fontSize: 16, fontWeight: '600', color: '#0F172A', marginBottom: 2 },
  customerAddress: { fontSize: 12, color: '#64748B', marginBottom: 6 },
  statsRow: { flexDirection: 'row', alignItems: 'center' },
  statsText: { fontSize: 12, fontWeight: '500', color: 'rgba(26, 15, 163, 1.00)' },
  dot: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#CBD5E1', marginHorizontal: 8 },
  ratingText: { fontSize: 12, fontWeight: '600', color: '#CA8A04' },
  actionColumn: { gap: 8 },
  actionBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  callBtn: { backgroundColor: '#EFF6FF' },
  chatBtn: { backgroundColor: '#ECFDF5' },
  regionCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'space-between',
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.04)',
    elevation: 2,
  },
  regionInfo: { flex: 1, marginRight: 16 },
  regionName: { fontSize: 15, fontWeight: '600', color: '#0F172A', marginBottom: 6 },
  regionBadgeRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  badgeActive: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  badgeActiveText: { fontSize: 10, color: '#16A34A', fontWeight: '600' },
  densityText: { fontSize: 12, color: '#64748B' },
  manageBtn: {
    borderColor: '#E2E8F0',
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  manageBtnText: { fontSize: 12, fontWeight: '600', color: '#475569' },
});
