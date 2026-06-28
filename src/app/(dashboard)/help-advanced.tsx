import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, TextInput, Image, KeyboardAvoidingView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { BackArrowIcon, SearchIcon } from '@/components/ui/Icons';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import { TicketsModal } from '@/components/common/TicketsModal';
import { useAndroidBack } from '@/hooks/useAndroidBack';

const ChevronRightIcon = ({ size = 16, color = '#94A3B8' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M9 18L15 12L9 6" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const HelpTopicIcon = ({ color = '#64748B' }) => (
  <Svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <Circle cx="16" cy="16" r="14" fill="#F1F5F9" />
    <Circle cx="16" cy="16" r="6" stroke={color} strokeWidth="1.5" />
    <Path d="M16 10V6M16 26V22M10 16H6M26 16H22M11.7574 11.7574L8.92893 8.92893M23.0711 23.0711L20.2426 20.2426M11.7574 20.2426L8.92893 23.0711M23.0711 8.92893L20.2426 11.7574" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
  </Svg>
);

export default function HelpAdvancedScreen() {
  useAndroidBack(() => router.back());
  const router = useSafeRouter();
  const [ticketsVisible, setTicketsVisible] = useState(false);

  const HELP_TOPICS = [
    { id: 'home', title: 'Home Services', sub: 'AC, Plumbing, Electrician & Appliances' },
    { id: 'clean', title: 'Cleaning & Pest Control', sub: 'Home cleaning, Kitchen, Bathroom & Pest...' },
    { id: 'beauty', title: 'Beauty & Wellness', sub: 'Salon, Spa, Makeup & Grooming' },
    { id: 'repair', title: 'Repair & Maintenance', sub: 'Carpentry, Furniture, Painting & Installations' },
    { id: 'booking', title: 'Booking & Service Issues', sub: 'Reschedule, Cancel, Service not completed' },
    { id: 'payment', title: 'Payment & Refund Issues', sub: 'Payment failed, Refund status, Billing' },
    { id: 'professional', title: 'Professional Issues', sub: 'Late arrival, Behaviour, Change professional' },
    { id: 'packages', title: 'Packages & Subscriptions', sub: 'Active plans, Renew, Usage & benefits' },
    { id: 'account', title: 'Account & Settings', sub: 'Profile, Address, Notifications' },
    { id: 'other', title: 'Other Topics', sub: 'Contact support, Raise a ticket' },
  ];

  return (
    <GradientBackground style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>

        <View style={styles.header}>
          <TouchableOpacity activeOpacity={1} onPress={() => router.back()} style={styles.backButton}>
            <BackArrowIcon size={24} color="#0F172A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Help</Text>
          <TouchableOpacity activeOpacity={1} style={styles.ticketButton} onPress={() => setTicketsVisible(true)}>
            <Text style={styles.ticketText}>Ticket</Text>
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          <Text style={styles.sectionTitle}>Active Conversations</Text>
          <View style={styles.activeCard}>
            <View style={styles.activeContent}>
              <View style={styles.activeIconBox} />
              <View style={styles.activeTextBox}>
                <Text style={styles.activeTitle}>Report an Accessibility Issue - 9573447204</Text>
                <Text style={styles.activeSub}>NA •</Text>
              </View>
            </View>
            <View style={styles.activeFooter}>
              <Text style={styles.activeFooterText}>Active Conversations</Text>
              <Text style={styles.activeFooterTime}>4 hours ago</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Your last service</Text>
          <View style={styles.serviceCard}>
            <View style={styles.serviceRow}>
              <View style={styles.serviceAvatarBox}>
                <Image source={{ uri: 'https://i.pravatar.cc/150' }} style={styles.serviceAvatar} />
              </View>
              <View style={styles.serviceInfo}>
                <Text style={styles.serviceTitle}>AC Repair & Service</Text>
                <Text style={styles.serviceDate}>Feb 16, 2026 • 10:00 am</Text>
              </View>
            </View>
            
            <View style={styles.serviceAmountRow}>
              <Text style={styles.serviceAmount}>Rs. 899</Text>
              <View style={styles.completedBadge}>
                <Text style={styles.completedBadgeText}>Completed</Text>
              </View>
            </View>

            <TouchableOpacity activeOpacity={1} style={styles.fullHistoryBtn}>
              <Text style={styles.fullHistoryText}>Full service history</Text>
              <ChevronRightIcon color="#FFFFFF" size={16} />
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionTitle}>Help topics</Text>
          <View style={styles.topicsCard}>
            
            <View style={styles.searchBox}>
              <SearchIcon size={18} color="#94A3B8" />
              <TextInput 
                style={styles.searchInput}
                placeholder="Search for the topic"
                placeholderTextColor="#94A3B8"
              />
            </View>

            {HELP_TOPICS.map((topic, index) => (
              <View key={topic.id}>
                <TouchableOpacity activeOpacity={1} style={styles.topicRow} onPress={() => router.push('/(dashboard)/faq')}>
                  <HelpTopicIcon color={['#EF4444', '#3B82F6', '#10B981', '#F59E0B'][index % 4]} />
                  <View style={styles.topicTextBox}>
                    <Text style={styles.topicTitle}>{topic.title}</Text>
                    <Text style={styles.topicSub}>{topic.sub}</Text>
                  </View>
                  <ChevronRightIcon />
                </TouchableOpacity>
                {index < HELP_TOPICS.length - 1 && <View style={styles.divider} />}
              </View>
            ))}

          </View>

        </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
      <TicketsModal visible={ticketsVisible} onClose={() => setTicketsVisible(false)} />
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1,  },
  
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 16 },
  backButton: { marginRight: 12 },
  headerTitle: { fontSize: 16, fontWeight: '700', color: '#0F172A', flex: 1 },
  ticketButton: { backgroundColor: '#F97316', paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20 },
  ticketText: { color: '#FFFFFF', fontSize: 12, fontWeight: '600' },

  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },

  sectionTitle: { fontSize: 14, fontWeight: '700', color: '#1E293B', marginBottom: 12, marginTop: 8 },

  activeCard: { backgroundColor: '#FFFFFF', borderRadius: 20, overflow: 'hidden', marginBottom: 16 },
  activeContent: { flexDirection: 'row', padding: 16, alignItems: 'center' },
  activeIconBox: { width: 40, height: 40, backgroundColor: '#CBD5E1', borderRadius: 8, marginRight: 12 },
  activeTextBox: { flex: 1 },
  activeTitle: { fontSize: 13, fontWeight: '700', color: '#1E293B', marginBottom: 4 },
  activeSub: { fontSize: 11, color: '#0F172A', fontWeight: '500' },
  activeFooter: { backgroundColor: 'rgba(26, 15, 163, 1.00)', padding: 12, paddingHorizontal: 16, flexDirection: 'row', justifyContent: 'space-between' },
  activeFooterText: { color: '#FFFFFF', fontSize: 11, fontWeight: '600' },
  activeFooterTime: { color: '#E2E8F0', fontSize: 11 },

  serviceCard: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 16, marginBottom: 16 },
  serviceRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  serviceAvatarBox: { marginRight: 12 },
  serviceAvatar: { width: 48, height: 48, borderRadius: 24 },
  serviceInfo: { flex: 1 },
  serviceTitle: { fontSize: 13, fontWeight: '700', color: '#1E293B', marginBottom: 2 },
  serviceDate: { fontSize: 11, color: '#64748B' },
  serviceAmountRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  serviceAmount: { fontSize: 16, fontWeight: '800', color: '#0F172A' },
  completedBadge: { backgroundColor: '#FEF08A', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
  completedBadgeText: { fontSize: 10, fontWeight: '700', color: '#854D0E' },
  fullHistoryBtn: { backgroundColor: 'rgba(26, 15, 163, 1.00)', flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20 },
  fullHistoryText: { color: '#FFFFFF', fontSize: 11, fontWeight: '600', marginRight: 4 },

  topicsCard: { backgroundColor: '#FFFFFF', borderRadius: 24, padding: 16 },
  searchBox: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 12, paddingHorizontal: 12, height: 40, marginBottom: 16 },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 13, color: '#0F172A' },
  
  topicRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
  topicTextBox: { flex: 1, marginLeft: 12, marginRight: 12 },
  topicTitle: { fontSize: 13, fontWeight: '700', color: '#1E293B', marginBottom: 2 },
  topicSub: { fontSize: 10, color: '#64748B' },
  
  divider: { height: 1, backgroundColor: '#F1F5F9', marginLeft: 44, marginRight: 0 },
});
