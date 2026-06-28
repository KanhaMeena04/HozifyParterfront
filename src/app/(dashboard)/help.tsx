import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, TextInput, Image, KeyboardAvoidingView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { BackArrowIcon, SearchIcon, RightArrowIcon } from '@/components/ui/Icons';
import Svg, { Path } from 'react-native-svg';
import { useAndroidBack } from '@/hooks/useAndroidBack';

const HelpRightArrowIcon = ({ size = 20, color = '#0F172A' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M9 18L15 12L9 6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export default function HelpSupportScreen() {
  useAndroidBack();
  const router = useSafeRouter();

  return (
    <GradientBackground style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity activeOpacity={1} onPress={() => router.back()} style={styles.backButton}>
            <BackArrowIcon size={24} color="#0F172A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Help & Support</Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <SearchIcon size={20} color="#64748B" />
            <TextInput 
              style={styles.searchInput}
              placeholder="Search your issue"
              placeholderTextColor="#94A3B8"
            />
          </View>

          {/* Recent Orders Section */}
          <Text style={styles.sectionTitle}>Recent Orders</Text>
          
          <View style={styles.orderCard}>
            <View style={styles.orderTopRow}>
              <Text style={styles.orderTitle}>Bike Taxi</Text>
              <Text style={styles.orderAmount}>₹0</Text>
            </View>
            <Text style={styles.orderDate}>17 April 2026, 08:31 AM</Text>

            {/* Timeline */}
            <View style={styles.timelineContainer}>
              <View style={styles.timelineRow}>
                <View style={styles.timelineIconCol}>
                  <View style={styles.dotBlue} />
                  <View style={styles.dashedLine} />
                </View>
                <View style={styles.timelineTextCol}>
                  <Text style={styles.locationDesc}>
                    11/67, YOGIMALLAVARAM,{'\n'}Yogimallavaram, Tiruchanur,{'\n'}Akkarampalle, Tiruchanur, Andhra{'\n'}Pradesh{'\n'}517503, India
                  </Text>
                </View>
              </View>
              
              <View style={[styles.timelineRow, { marginTop: -4 }]}>
                <View style={styles.timelineIconCol}>
                  <View style={styles.dotRed} />
                </View>
                <View style={styles.timelineTextCol}>
                  <Text style={styles.locationDesc}>
                    Fortune Grand Ridge Hotel Road,{'\n'}Korramenugunta, Tirupati, Andhra{'\n'}Pradesh, India
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* View all orders link */}
          <TouchableOpacity activeOpacity={1} style={styles.viewAllCard}>
            <Text style={styles.viewAllText}>View all orders</Text>
            <HelpRightArrowIcon size={20} color="rgba(26, 15, 163, 1.00)" />
          </TouchableOpacity>

          {/* Need Help Card */}
          <View style={styles.helpCard}>
            <View style={styles.helpCardLeft}>
              <Text style={styles.helpCardTitle}>Need Help?</Text>
              <Text style={styles.helpCardSubtitle}>Find answers to{'\n'}primary{'\n'}issues!</Text>
              <TouchableOpacity activeOpacity={1} style={styles.getHelpBtn}>
                <Text style={styles.getHelpBtnText}>Get Help</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.helpCardImageWrapper}>
               {/* Using the generated image we copied */}
              <Image 
                source={require('../../../assets/images/UI/help_guy.png')} 
                style={styles.helpGuyImage}
                resizeMode="cover"
              />
            </View>
          </View>

          {/* Bottom Pills */}
          <View style={styles.bottomPillsRow}>
            <TouchableOpacity activeOpacity={1} style={styles.bottomPill}>
              <Text style={styles.bottomPillText}>Explore All Issues</Text>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={1} style={styles.bottomPill}>
              <Text style={styles.bottomPillText}>Training Videos</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1,  },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16 },
  backButton: { marginRight: 16 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#0F172A' },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },

  searchContainer: { 
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', 
    borderRadius: 24, paddingHorizontal: 16, height: 48, marginBottom: 24 
  },
  searchInput: { flex: 1, marginLeft: 12, fontSize: 14, color: '#0F172A' },

  sectionTitle: { fontSize: 14, fontWeight: '700', color: '#0F172A', marginBottom: 16 },

  orderCard: { 
    backgroundColor: '#FFFFFF', borderRadius: 24, padding: 20, marginBottom: 16 
  },
  orderTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  orderTitle: { fontSize: 14, fontWeight: '500', color: '#0F172A' },
  orderAmount: { fontSize: 14, fontWeight: '700', color: '#0F172A' },
  orderDate: { fontSize: 12, color: '#64748B', marginBottom: 16 },

  timelineContainer: { marginTop: 8 },
  timelineRow: { flexDirection: 'row', minHeight: 60 },
  timelineIconCol: { width: 24, alignItems: 'center' },
  dotBlue: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#3B82F6', zIndex: 1, marginTop: 4 },
  dashedLine: { width: 1, flex: 1, borderStyle: 'dashed', borderWidth: 1, borderColor: '#64748B', marginTop: 4, marginBottom: 4 },
  dotRed: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#EF4444', zIndex: 1, marginTop: 4 },
  timelineTextCol: { flex: 1, paddingLeft: 12, paddingBottom: 24 },
  locationDesc: { fontSize: 11, color: '#334155', lineHeight: 18 },

  viewAllCard: { 
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#FFFFFF', borderRadius: 16, paddingHorizontal: 20, paddingVertical: 16, 
    marginBottom: 24 
  },
  viewAllText: { fontSize: 13, fontWeight: '700', color: 'rgba(26, 15, 163, 1.00)' },

  helpCard: { 
    backgroundColor: '#FFFFFF', borderRadius: 24, flexDirection: 'row', 
    overflow: 'hidden', marginBottom: 24 
  },
  helpCardLeft: { flex: 1, padding: 24, paddingRight: 0 },
  helpCardTitle: { fontSize: 16, fontWeight: '700', color: '#0F172A', marginBottom: 8 },
  helpCardSubtitle: { fontSize: 12, color: '#64748B', lineHeight: 18, marginBottom: 24 },
  getHelpBtn: { backgroundColor: 'rgba(26, 15, 163, 1.00)', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20, alignSelf: 'flex-start' },
  getHelpBtnText: { color: '#FFFFFF', fontSize: 12, fontWeight: '600' },
  
  helpCardImageWrapper: { width: 140, justifyContent: 'flex-end', alignItems: 'center' },
  helpGuyImage: { width: 140, height: 160 }, // Will scale depending on real asset dimensions

  bottomPillsRow: { flexDirection: 'row', gap: 12 },
  bottomPill: { 
    flex: 1, backgroundColor: '#DBEAFE', paddingVertical: 14, 
    borderRadius: 24, alignItems: 'center', justifyContent: 'center' 
  },
  bottomPillText: { fontSize: 12, fontWeight: '700', color: 'rgba(26, 15, 163, 1.00)' }
});
