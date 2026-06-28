import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { BackArrowIcon } from '@/components/ui/Icons';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { useAndroidBack } from '@/hooks/useAndroidBack';
import Svg, { Path, Circle } from 'react-native-svg';

const BulletIcon = ({ color = 'rgba(26, 15, 163, 1.00)' }) => (
  <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" fill={color} />
    <Path d="M8 12L11 15L16 9" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const ShieldIcon = ({ color = '#EF4444' }) => (
  <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
    <Path d="M12 2L3 7V12C3 16.55 7.08 20.74 12 22C16.92 20.74 21 16.55 21 12V7L12 2Z" fill={color} opacity={0.15} />
    <Path d="M12 2L3 7V12C3 16.55 7.08 20.74 12 22C16.92 20.74 21 16.55 21 12V7L12 2Z" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
    <Path d="M9 12L11 14L15 10" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const ChevronIcon = ({ open }: { open: boolean }) => (
  <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
    <Path
      d={open ? 'M18 15L12 9L6 15' : 'M6 9L12 15L18 9'}
      stroke="#64748B"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const APP_INSTRUCTIONS = [
  {
    title: 'Getting Started',
    items: [
      'Complete your profile setup with accurate personal and business details.',
      'Upload all required KYC documents for account verification.',
      'Set up your service areas to define where you can operate.',
      'Add your services and pricing before going on duty.',
    ],
  },
  {
    title: 'Going On Duty',
    items: [
      'Toggle the ON DUTY button from the home screen to start receiving bookings.',
      'Make sure your location is enabled so customers can find you.',
      'Keep your phone active and notifications on while on duty.',
      'Go OFF DUTY when you are unavailable to pause new booking requests.',
    ],
  },
  {
    title: 'Handling Bookings',
    items: [
      'Accept or decline incoming booking requests within the time limit.',
      'Review booking details carefully — service type, location, and schedule.',
      'Mark yourself as Arrived once you reach the customer location.',
      'Complete the job and collect payment before marking the booking as Complete.',
    ],
  },
  {
    title: 'Payment & Earnings',
    items: [
      'Earnings are credited to your wallet after each completed job.',
      'You can request a withdrawal once your wallet balance meets the minimum threshold.',
      'Keep track of daily and monthly earnings from the Wallet screen.',
      'Any disputes on payments should be raised within 24 hours via Help.',
    ],
  },
  {
    title: 'Code of Conduct',
    items: [
      'Always be professional and respectful to customers.',
      'Do not cancel bookings repeatedly — it affects your rating.',
      'Provide the exact services listed in the booking; no unapproved add-ons.',
      'Maintain cleanliness and safety standards at all customer sites.',
    ],
  },
];

const SAFETY_FEATURES = [
  {
    title: 'Personal Safety',
    items: [
      'Always verify the customer identity before entering the premises.',
      'Share your live location with a trusted contact during job visits.',
      'Do not carry large amounts of cash — use digital payment options.',
      'If you feel unsafe at any point, leave the premises and contact support immediately.',
    ],
  },
  {
    title: 'Emergency Contacts',
    items: [
      'Save the platform emergency helpline number in your phone.',
      'Use the Emergency Contacts screen in the app to reach support quickly.',
      'In case of a medical emergency, call local emergency services (112) first.',
      'Report any threat or unsafe situation through the in-app Help section.',
    ],
  },
  {
    title: 'Data & Privacy',
    items: [
      'Never share your OTP, login credentials, or account details with anyone.',
      'The platform will never ask for your password over call or chat.',
      'Report suspicious activity or phishing attempts to support immediately.',
      'Your personal data is protected — review our Privacy Policy for details.',
    ],
  },
  {
    title: 'Equipment Safety',
    items: [
      'Use only certified tools and equipment for the services you provide.',
      'Inspect equipment before each job to ensure it is in safe working condition.',
      'Follow all safety guidelines relevant to your trade or service category.',
      'Do not attempt services outside your listed skills or expertise.',
    ],
  },
];

type Tab = 'instructions' | 'safety';

export default function InstructionsScreen() {
  const router = useSafeRouter();
  const [activeTab, setActiveTab] = useState<Tab>('instructions');
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  useAndroidBack(() => router.back());

  const sections = activeTab === 'instructions' ? APP_INSTRUCTIONS : SAFETY_FEATURES;

  const handleTabSwitch = (tab: Tab) => {
    setActiveTab(tab);
    setOpenIndex(0);
  };

  return (
    <GradientBackground style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity activeOpacity={1} onPress={() => router.back()} style={styles.backButton}>
            <BackArrowIcon size={24} color="#0F172A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Instructions</Text>
        </View>

        {/* Tab Toggle */}
        <View style={styles.tabContainer}>
          <TouchableOpacity activeOpacity={1}
            style={[styles.tab, activeTab === 'instructions' && styles.tabActive]}
            onPress={() => handleTabSwitch('instructions')}
          >
            <Text style={[styles.tabText, activeTab === 'instructions' && styles.tabTextActive]}>
              App Instructions
            </Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={1}
            style={[styles.tab, activeTab === 'safety' && styles.tabActiveSafety]}
            onPress={() => handleTabSwitch('safety')}
          >
            <Text style={[styles.tabText, activeTab === 'safety' && styles.tabTextActiveSafety]}>
              Safety Features
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <Text style={styles.subtitle}>
            {activeTab === 'instructions'
              ? 'Please read these instructions carefully before you start using the platform.'
              : 'Your safety is our priority. Follow these guidelines to stay safe on every job.'}
          </Text>

          {sections.map((section, index) => {
            const isOpen = openIndex === index;
            const isSafety = activeTab === 'safety';
            return (
              <View key={index} style={styles.card}>
                <TouchableOpacity activeOpacity={1}
                  style={styles.cardHeader}
                  onPress={() => setOpenIndex(isOpen ? null : index)}
                >
                  <Text style={styles.cardTitle}>{section.title}</Text>
                  <ChevronIcon open={isOpen} />
                </TouchableOpacity>

                {isOpen && (
                  <View style={styles.cardBody}>
                    {section.items.map((item, i) => (
                      <View key={i} style={styles.itemRow}>
                        {isSafety
                          ? <ShieldIcon color={PRIMARY} />
                          : <BulletIcon color="rgba(26, 15, 163, 1.00)" />
                        }
                        <Text style={styles.itemText}>{item}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            );
          })}

          <View style={[styles.noteBox, activeTab === 'safety' && styles.noteBoxSafety]}>
            <Text style={[styles.noteTitle, activeTab === 'safety' && styles.noteTitleSafety]}>
              {activeTab === 'instructions' ? 'Important Note' : 'Safety Reminder'}
            </Text>
            <Text style={styles.noteText}>
              {activeTab === 'instructions'
                ? 'Failure to follow these instructions may result in account suspension or permanent deactivation. If you have questions, contact our support team.'
                : 'If you ever feel unsafe, your safety comes first — leave the situation and contact emergency services. Then report the incident to our support team.'}
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </GradientBackground>
  );
}

const PRIMARY = 'rgba(26, 15, 163, 1.00)';
const SAFETY_COLOR = '#EF4444';

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12,
  },
  backButton: { marginRight: 12 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#0F172A' },

  tabContainer: {
    flexDirection: 'row', marginHorizontal: 20, marginBottom: 16,
    backgroundColor: '#E2E8F0', borderRadius: 12, padding: 4,
  },
  tab: {
    flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: 'center',
  },
  tabActive: { backgroundColor: 'rgba(26, 15, 163, 1.00)' },
  tabActiveSafety: { backgroundColor: 'rgba(26, 15, 163, 1.00)' },
  tabText: { fontSize: 13, fontWeight: '600', color: '#64748B' },
  tabTextActive: { color: '#FFFFFF' },
  tabTextActiveSafety: { color: '#FFFFFF' },

  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },

  subtitle: { fontSize: 13, color: '#64748B', lineHeight: 20, marginBottom: 16 },

  card: {
    backgroundColor: '#FFFFFF', borderRadius: 16, marginBottom: 12,
    overflow: 'hidden', borderWidth: 1, borderColor: '#F1F5F9',
  },
  cardHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 14,
  },
  cardTitle: { fontSize: 14, fontWeight: '700', color: '#0F172A', flex: 1 },
  cardBody: { paddingHorizontal: 16, paddingBottom: 16, gap: 10 },

  itemRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  itemText: { fontSize: 13, color: '#334155', lineHeight: 20, flex: 1 },

  noteBox: {
    backgroundColor: 'rgba(26, 15, 163, 0.06)', borderRadius: 16,
    padding: 16, marginTop: 8, borderWidth: 1, borderColor: 'rgba(26, 15, 163, 0.15)',
  },
  noteBoxSafety: {
    backgroundColor: 'rgba(26, 15, 163, 0.06)',
    borderColor: 'rgba(26, 15, 163, 0.15)',
  },
  noteTitle: { fontSize: 13, fontWeight: '700', color: PRIMARY, marginBottom: 6 },
  noteTitleSafety: { color: PRIMARY },
  noteText: { fontSize: 12, color: '#334155', lineHeight: 18 },
});
