import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { BackArrowIcon } from '@/components/ui/Icons';
import { useAndroidBack } from '@/hooks/useAndroidBack';
import { Checkbox } from '@/components/ui/Checkbox';
import { Button } from '@/components/ui/Button';
import Svg, { Path } from 'react-native-svg';
import { Alert } from 'react-native';

const ChevronDownIcon = ({ size = 24, color = '#111827' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M6 9l6 6 6-6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const ChevronUpIcon = ({ size = 24, color = '#111827' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M18 15l-6-6-6 6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const DocumentIcon = ({ size = 24, color = '#111827' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const ShieldIcon = ({ size = 24, color = '#111827' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const rateSections = [
  {
    id: 'power_unit',
    title: 'Semi Automatic WM - Power Unit',
    items: [
      { name: 'Power 3 Pin Plug Top', price: '₹200' },
      { name: 'Power Cord', price: '₹350' },
      { name: 'Re-wiring (Heavy damage)', price: '₹650' }
    ]
  },
  { id: 'wash_issue', title: 'Semi Automatic WM - Wash Issue', items: [] },
  { id: 'spin_issue', title: 'Semi Automatic WM - Spin Issue', items: [] },
  { id: 'water_leakage', title: 'Semi Automatic WM - Water Leakage', items: [] },
  { id: 'accessories', title: 'Semi Automatic WM - Accessories', items: [] }
];

const POLICIES = [
  "Privacy Policy: We collect personal data strictly for service provisioning. Your data is encrypted and secure.",
  "Refund Policy: Refunds are processed within 5-7 business days after approval from the administration.",
  "Code of Conduct: Partners must maintain professional behavior with all customers. Any reported misconduct may lead to suspension.",
  "GST Compliance: All service fares and charges are subject to Goods and Services Tax (GST) as per the prevailing government regulations. GST registration is mandatory for business partners.",
  "Insurance & Liability: The company provides limited liability coverage for accidental damages during the service, subject to a maximum cap as defined in the partner agreement.",
  "Termination Policy: The company reserves the right to terminate the partnership without prior notice in case of fraud, continued poor ratings, or violation of these policies."
];

export default function RateCardScreen() {
  useAndroidBack(() => router.back());
  const router = useSafeRouter();
  const [activeTab, setActiveTab] = useState<'Rate Card' | 'T&C' | 'Policies'>('Rate Card');
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [checkedPolicies, setCheckedPolicies] = useState<boolean[]>(new Array(POLICIES.length).fill(false));

  const allPoliciesAccepted = checkedPolicies.every(Boolean);

  const togglePolicy = (index: number) => {
    const newChecked = [...checkedPolicies];
    newChecked[index] = !newChecked[index];
    setCheckedPolicies(newChecked);
  };

  const handleSubmit = () => {
    if (!allPoliciesAccepted) {
      Alert.alert('Required', 'Please accept all policies first.');
      return;
    }
    Alert.alert('Success', 'Policies accepted successfully!');
    router.back();
  };

  const renderContent = () => {
    if (activeTab === 'Rate Card') {
      return (
        <View style={{ gap: 12, marginTop: 8 }}>
          {rateSections.map((section) => {
            const isExpanded = expandedSection === section.id;
            return (
              <View key={section.id} style={styles.rateAccordionItem}>
                <TouchableOpacity activeOpacity={1}
                  style={styles.rateAccordionHeader}
                  onPress={() => setExpandedSection(isExpanded ? null : section.id)}
                >
                  <Text style={styles.rateAccordionTitle}>{section.title}</Text>
                  {isExpanded ? <ChevronUpIcon size={18} /> : <ChevronDownIcon size={18} />}
                </TouchableOpacity>

                {isExpanded && section.items.length > 0 && (
                  <View style={styles.rateTableContainer}>
                    <View style={styles.rateTableHeader}>
                      <Text style={styles.rateTableHeaderText}>Description</Text>
                      <Text style={[styles.rateTableHeaderText, { textAlign: 'right' }]}>Service Charge</Text>
                    </View>
                    {section.items.map((item, idx) => (
                      <View key={idx} style={styles.rateTableRow}>
                        <Text style={styles.rateTableCellDesc}>{item.name}</Text>
                        <Text style={styles.rateTableCellPrice}>{item.price}</Text>
                      </View>
                    ))}
                  </View>
                )}
                
                {isExpanded && section.items.length === 0 && (
                  <View style={styles.rateTableContainer}>
                    <Text style={{ padding: 12, fontSize: 13, color: '#6B7280', textAlign: 'center' }}>
                      No items available
                    </Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>
      );
    }
    
    if (activeTab === 'T&C') {
      return (
        <View style={styles.textContainer}>
          <Text style={styles.sectionTitle}>Terms and Conditions</Text>
          <Text style={styles.paragraphText}>
            1. Acceptance of Terms: By accessing and using our services, you accept and agree to be bound by the terms and provision of this agreement.
          </Text>
          <Text style={styles.paragraphText}>
            2. Service Usage: The services are provided "as is". We reserve the right to modify or discontinue the service at any time without notice.
          </Text>
          <Text style={styles.paragraphText}>
            3. Payment Terms: All payments must be processed through the authorized channels. Cash payments are subject to standard company policies.
          </Text>
        </View>
      );
    }

    if (activeTab === 'Policies') {
      return (
        <View style={styles.textContainer}>
          <Text style={styles.sectionTitle}>Company Policies</Text>
          
          <View style={{ gap: 16 }}>
            {POLICIES.map((policyText, index) => (
              <View key={index} style={styles.policyRow}>
                <Checkbox
                  checked={checkedPolicies[index]}
                  onChange={() => togglePolicy(index)}
                  label={`${index + 1}. ${policyText}`}
                />
              </View>
            ))}
          </View>

          <Button
            title="Submit"
            onPress={handleSubmit}
            disabled={!allPoliciesAccepted}
            style={{ marginTop: 24 }}
          />
        </View>
      );
    }
  };

  return (
    <GradientBackground style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        
        <View style={styles.header}>
          <TouchableOpacity activeOpacity={1} onPress={() => router.back()} style={styles.backButton}>
            <BackArrowIcon size={24} color="#0F172A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Rate Card</Text>
        </View>

        <View style={styles.tabContainer}>
          <TouchableOpacity activeOpacity={1}
            style={[styles.tab, activeTab === 'Rate Card' && styles.tabActive]}
            onPress={() => setActiveTab('Rate Card')}
          >
            <Text style={[styles.tabText, activeTab === 'Rate Card' && styles.tabTextActive]} numberOfLines={1}>Rate Card</Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={1}
            style={[styles.tab, activeTab === 'T&C' && styles.tabActive]}
            onPress={() => setActiveTab('T&C')}
          >
            <Text style={[styles.tabText, activeTab === 'T&C' && styles.tabTextActive]} numberOfLines={1}>T&C</Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={1}
            style={[styles.tab, activeTab === 'Policies' && styles.tabActive]}
            onPress={() => setActiveTab('Policies')}
          >
            <Text style={[styles.tabText, activeTab === 'Policies' && styles.tabTextActive]} numberOfLines={1}>Policies</Text>
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {renderContent()}
        </ScrollView>
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 16 },
  backButton: { marginRight: 12 },
  headerTitle: { fontSize: 16, fontWeight: '700', color: '#0F172A', flex: 1 },

  tabContainer: { 
    flexDirection: 'row', 
    marginHorizontal: 20, 
    backgroundColor: '#F1F5F9', 
    borderRadius: 24, 
    padding: 4, 
    marginBottom: 20 
  },
  tab: { 
    flex: 1, 
    paddingVertical: 10, 
    alignItems: 'center', 
    borderRadius: 20, 
    paddingHorizontal: 4 
  },
  tabActive: { 
    backgroundColor: 'rgba(26, 15, 163, 1.00)', 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: { fontSize: 13, fontWeight: '600', color: '#64748B', textAlign: 'center' },
  tabTextActive: { fontWeight: '700', color: '#FFFFFF' },

  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },

  rateAccordionItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
  },
  rateAccordionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F9FAFB',
  },
  rateAccordionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    flex: 1,
    paddingRight: 10,
  },
  rateTableContainer: {
    padding: 16,
    paddingTop: 8,
  },
  rateTableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    marginBottom: 8,
  },
  rateTableHeaderText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6B7280',
    flex: 1,
  },
  rateTableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  rateTableCellDesc: {
    fontSize: 13,
    color: '#374151',
    fontWeight: '500',
    flex: 2,
  },
  rateTableCellPrice: {
    fontSize: 13,
    color: '#111827',
    fontWeight: '700',
    flex: 1,
    textAlign: 'right',
  },
  placeholderContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    marginTop: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  placeholderText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    marginTop: 16,
    marginBottom: 8,
  },
  placeholderSub: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
  },
  textContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  paragraphText: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 22,
    marginBottom: 12,
  },
  checkboxWrapper: {
    marginTop: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  policyRow: {
    paddingRight: 8,
  }
});
