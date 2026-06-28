import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { BackArrowIcon } from '@/components/ui/Icons';
import Svg, { Path, Circle } from 'react-native-svg';
import { TicketsModal } from '@/components/common/TicketsModal';
import { useAndroidBack } from '@/hooks/useAndroidBack';

const ChevronRightIcon = ({ size = 16, color = '#94A3B8' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M9 18L15 12L9 6" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const HelpCircleOutline = ({ size = 18, color = '#0F172A' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="1.5" />
    <Path d="M9.09 9C9.3251 8.33167 9.78915 7.76811 10.4 7.40913C11.0108 7.05016 11.7289 6.91894 12.4272 7.03871C13.1255 7.15849 13.7588 7.52152 14.2151 8.06353C14.6713 8.60553 14.9211 9.29152 14.92 10C14.92 12 11.92 13 11.92 13" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M12 17H12.01" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const ThumbUpIcon = ({ color = '#0F172A' }) => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <Path d="M14 9V5C14 4.20435 13.6839 3.44129 13.1213 2.87868C12.5587 2.31607 11.7956 2 11 2L7 11V22H18.28C18.7623 22.0055 19.2304 21.8364 19.5979 21.524C19.9654 21.2116 20.2077 20.7769 20.28 20.3L21.66 11.3C21.7035 11.0134 21.6842 10.7207 21.6033 10.4423C21.5225 10.1638 21.3821 9.90629 21.1919 9.68751C21.0016 9.46873 20.7661 9.29393 20.5016 9.17522C20.2371 9.0565 19.95 8.99672 19.66 9H14Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M7 22H4C3.46957 22 2.96086 21.7893 2.58579 21.4142C2.21071 21.0391 2 20.5304 2 20V13C2 12.4696 2.21071 11.9609 2.58579 11.5858C2.96086 11.2107 3.46957 11 4 11H7" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const ThumbDownIcon = ({ color = '#0F172A' }) => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <Path d="M10 15V19C10 19.7956 10.3161 20.5587 10.8787 21.1213C11.4413 21.6839 12.2044 22 13 22L17 13V2H5.72C5.23773 1.99451 4.76957 2.16361 4.40206 2.47601C4.03456 2.78842 3.79234 3.22306 3.72 3.7L2.34 12.7C2.29653 12.9866 2.31575 13.2793 2.39665 13.5577C2.47754 13.8362 2.61794 14.0937 2.80815 14.3125C2.99836 14.5313 3.23388 14.7061 3.49838 14.8248C3.76288 14.9435 4.05 15.0033 4.34 15H10Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M17 2H20C20.5304 2 21.0391 2.21071 21.4142 2.58579C21.7893 2.96086 22 3.46957 22 4V11C22 11.5304 21.7893 12.0391 21.4142 12.4142C21.0391 12.7893 20.5304 13 20 13H17" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const SupportIcon = ({ color = '#0F172A' }) => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <Path d="M12 21a9 9 0 1 0-9-9c0 1.488.36 2.891 1 4.127L3 21l4.873-1c1.236.64 2.64 1 4.127 1z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M9 10h.01M15 10h.01M12 14h.01" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export default function FAQScreen() {
  useAndroidBack();
  const router = useSafeRouter();
  const [selectedFaq, setSelectedFaq] = useState<string | null>(null);
  const [ticketsVisible, setTicketsVisible] = useState(false);

  const FAQS = [
    { id: '1', title: 'I have been charged higher than the estimated fare' },
    { id: '2', title: 'I have been charged cancellation fees' },
    { id: '3', title: 'I didn\'t took the service but I was charged for the same' },
    { id: '4', title: 'I didn\'t receive cashback in my wallet' },
    { id: '5', title: 'Billing related Issues' },
    { id: '6', title: 'How can I check my hozify wallet balance?', content: 'To check your wallet balance, navigate to menu > Payment' },
  ];

  return (
    <GradientBackground style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        
        <View style={styles.header}>
          <TouchableOpacity activeOpacity={1} onPress={() => router.back()} style={styles.backButton}>
            <BackArrowIcon size={24} color="#0F172A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>FAQ</Text>
          <TouchableOpacity activeOpacity={1} style={styles.ticketButton} onPress={() => setTicketsVisible(true)}>
            <Text style={styles.ticketText}>Tickets</Text>
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          {selectedFaq ? (
            <View style={styles.detailCard}>
              <View style={styles.detailHeader}>
                <View style={styles.detailIconBox}>
                  <HelpCircleOutline />
                </View>
                <Text style={styles.detailTitle}>
                  {FAQS.find(f => f.id === selectedFaq)?.title}
                </Text>
              </View>
              
              <Text style={styles.detailContent}>
                {FAQS.find(f => f.id === selectedFaq)?.content || 'This is the detailed answer to the selected FAQ question. It provides all necessary information clearly.'}
              </Text>
              
              <View style={styles.detailDivider} />
              
              <View style={styles.feedbackRow}>
                <Text style={styles.feedbackText}>Was this article helpful?</Text>
                <View style={styles.feedbackIcons}>
                  <TouchableOpacity activeOpacity={1} style={styles.iconBtn}><ThumbUpIcon /></TouchableOpacity>
                  <TouchableOpacity activeOpacity={1} style={styles.iconBtn}><ThumbDownIcon /></TouchableOpacity>
                </View>
              </View>

              <View style={styles.detailDivider} />

              <View style={styles.detailHeader}>
                <View style={styles.detailIconBox}>
                  <HelpCircleOutline />
                </View>
                <Text style={styles.detailTitle}>Still facing issues?</Text>
              </View>
              <Text style={styles.detailContent}>Our customer support is here to help you</Text>
              
              <TouchableOpacity activeOpacity={1} 
                style={styles.customerSupportBtn} 
                onPress={() => router.push('/(dashboard)/support-chat')}
              >
                <SupportIcon />
                <Text style={styles.customerSupportBtnText}>Customer Support</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <Text style={styles.sectionTitle}>Service fare related issues</Text>
              <View style={styles.listCard}>
                {FAQS.map((faq, index) => (
                  <View key={faq.id}>
                    <TouchableOpacity activeOpacity={1} style={styles.faqRow} onPress={() => setSelectedFaq(faq.id)}>
                      <Text style={styles.faqTitle}>{faq.title}</Text>
                      <ChevronRightIcon />
                    </TouchableOpacity>
                    {index < FAQS.length - 1 && <View style={styles.divider} />}
                  </View>
                ))}
              </View>
            </>
          )}

        </ScrollView>
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

  sectionTitle: { fontSize: 12, fontWeight: '700', color: '#0F172A', marginBottom: 16 },

  listCard: { backgroundColor: '#FFFFFF', borderRadius: 16, overflow: 'hidden' },
  faqRow: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  faqTitle: { flex: 1, fontSize: 12, fontWeight: '600', color: '#0F172A', marginRight: 12 },
  divider: { height: 1, backgroundColor: '#F1F5F9' },

  detailCard: { backgroundColor: '#FFFFFF', borderRadius: 24, padding: 20, marginTop: 8 },
  detailHeader: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 16 },
  detailIconBox: { marginTop: 2, marginRight: 12 },
  detailTitle: { flex: 1, fontSize: 14, fontWeight: '700', color: '#0F172A' },
  detailContent: { fontSize: 12, color: '#334155', lineHeight: 18, marginBottom: 24 },
  detailDivider: { height: 1, backgroundColor: '#F1F5F9', marginBottom: 16 },
  
  feedbackRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  feedbackText: { fontSize: 11, color: '#0F172A', fontWeight: '500' },
  feedbackIcons: { flexDirection: 'row', gap: 16 },
  iconBtn: { padding: 4 },

  customerSupportBtn: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', borderWidth: 1, borderColor: '#0F172A', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 10 },
  customerSupportBtnText: { fontSize: 12, fontWeight: '600', color: '#0F172A', marginLeft: 8 },
});
