import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { BackArrowIcon } from '@/components/ui/Icons';
import { Button } from '@/components/ui/Button';
import { useDocStore } from '@/store/docStore';
import { useAndroidBack } from '@/hooks/useAndroidBack';
import Svg, { Path, Circle } from 'react-native-svg';

const CheckBadgeIcon = () => (
  <Svg width={48} height={48} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke="#22C55E" strokeWidth="2" fill="#E2FAD4" fillOpacity="0.3" />
    <Path d="M8 12L11 15L16 9" stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const SaveIcon = ({ size = 24, color = '#0F172A' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M19 21H5C4.44772 21 4 20.5523 4 20V4C4 3.44772 4.44772 3 5 3H16L20 7V20C20 20.5523 19.5523 21 19 21Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M17 21V13H7V21M7 3V8H15" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const PrintIcon = ({ size = 24, color = '#0F172A' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M6 9V2H18V9" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M6 18H4C2.89543 18 2 17.1046 2 16V11C2 9.89543 2.89543 9 4 9H20C21.1046 9 22 9.89543 22 11V16C22 17.1046 21.1046 18 20 18H18" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M6 14H18V22H6V14Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const URI_KEY_MAP: Record<string, keyof ReturnType<typeof useDocStore.getState>> = {
  'Aadhaar Card': 'aadhaarUri',
  'PAN Card': 'panUri',
  'Police Clearance': 'policeClearanceUri',
  'Driving License (DL)': 'drivingLicenseUri',
  'Other Documents': 'otherDocsUri',
  'GST Certificate': 'businessVerificationUri',
};

const BACK_URI_KEY_MAP: Record<string, keyof ReturnType<typeof useDocStore.getState>> = {
  'Aadhaar Card': 'aadhaarBackUri',
  'PAN Card': 'panBackUri',
  'Police Clearance': 'policeClearanceBackUri',
  'Driving License (DL)': 'drivingLicenseBackUri',
  'Other Documents': 'otherDocsBackUri',
  'GST Certificate': 'businessVerificationBackUri',
};

const NUMBER_KEY_MAP: Record<string, keyof ReturnType<typeof useDocStore.getState>> = {
  'Aadhaar Card': 'aadhaarNumber',
  'PAN Card': 'panNumber',
  'Police Clearance': 'policeClearanceNumber',
  'Driving License (DL)': 'drivingLicenseNumber',
  'Other Documents': 'otherDocsNumber',
  'GST Certificate': 'businessVerificationNumber',
};

export default function DocViewScreen() {
  useAndroidBack();
  const router = useSafeRouter();
  const { title } = useLocalSearchParams<{ title: string }>();
  const store = useDocStore();

  const uriKey = title ? URI_KEY_MAP[title] : null;
  const backUriKey = title ? BACK_URI_KEY_MAP[title] : null;
  const numKey = title ? NUMBER_KEY_MAP[title] : null;
  
  const uploadedUri = uriKey ? (store[uriKey] as string | null) : null;
  const uploadedBackUri = backUriKey ? (store[backUriKey] as string | null) : null;
  const docNumber = numKey ? (store[numKey] as string | null) || '—' : '—';

  return (
    <GradientBackground style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity activeOpacity={1} onPress={() => router.back()} style={styles.backButton}>
            <BackArrowIcon size={24} color="#0F172A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{title}</Text>
          <View style={{ flex: 1 }} />
          <TouchableOpacity activeOpacity={1} onPress={() => Alert.alert('Help', 'Contacting Support...')}>
            <View style={styles.helpBtn}>
              <Text style={styles.helpBtnText}>Help</Text>
            </View>
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <View style={styles.mainWhiteContainer}>
            
            {/* Verified Info */}
            <View style={styles.verifiedSection}>
              <View style={styles.verifiedIconCircle}>
                <CheckBadgeIcon />
              </View>
              <Text style={styles.verifiedCardTitle}>Your {title} is verified</Text>
              
              <View style={styles.docNumberBox}>
                <View style={styles.docNumberAccent} />
                <Text style={styles.docNumberText} numberOfLines={1}>{docNumber}</Text>
              </View>
              
              <Text style={styles.verifiedOnText}>Verified on</Text>
            </View>

            {/* Front Image */}
            <View style={styles.imageSection}>
              <View style={styles.imageSectionHeader}>
                <Text style={styles.imgLabel}>Front {title} Image</Text>
                <View style={styles.actionIconsGroup}>
                   <TouchableOpacity activeOpacity={1} onPress={() => Alert.alert('Saved', 'Document saved to gallery.')} style={styles.actionIconBtn}>
                     <SaveIcon size={18} color="#64748B" />
                   </TouchableOpacity>
                   <View style={styles.actionDivider} />
                   <TouchableOpacity activeOpacity={1} onPress={() => Alert.alert('Printing', 'Sending to printer...')} style={styles.actionIconBtn}>
                     <PrintIcon size={18} color="#64748B" />
                   </TouchableOpacity>
                </View>
              </View>
              
              <View style={styles.imgBox}>
                {uploadedUri ? (
                  <Image source={{ uri: uploadedUri }} style={styles.docImage} resizeMode="cover" />
                ) : (
                  <View style={styles.placeholder}>
                    <Text style={styles.placeholderText}>FRONT</Text>
                  </View>
                )}
              </View>
            </View>

            {/* Back Image */}
            <View style={styles.imageSection}>
              <View style={styles.imageSectionHeader}>
                <Text style={styles.imgLabel}>Back {title} Image</Text>
              </View>
              
              <View style={styles.imgBox}>
                {uploadedBackUri ? (
                  <Image source={{ uri: uploadedBackUri }} style={styles.docImage} resizeMode="cover" />
                ) : (
                  <View style={styles.placeholder}>
                    <Text style={styles.placeholderText}>BACK</Text>
                  </View>
                )}
              </View>
            </View>

            <Button
              title="Re-Upload"
              onPress={() => router.push(`/(tabs)/upload?flow=kyc&doc=${encodeURIComponent(title || '')}` as any)}
              variant="primary"
              style={{ marginTop: 8, marginBottom: 8 }}
            />

          </View>
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
    paddingVertical: 14,
  },
  backButton: { marginRight: 12 },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
  },
  helpBtn: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#F97316',
  },
  helpBtnText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 13,
  },

  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },

  mainWhiteContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },

  verifiedSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  verifiedIconCircle: {
    marginBottom: 12,
  },
  verifiedCardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: 16,
  },
  docNumberBox: {
    flexDirection: 'row',
    width: '100%',
    height: 44,
    borderWidth: 2,
    borderColor: '#0F172A',
    borderRadius: 8,
    overflow: 'hidden',
    alignItems: 'center',
    marginBottom: 8,
  },
  docNumberAccent: {
    width: 12,
    height: '100%',
    backgroundColor: '#1A0FA3',
  },
  docNumberText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: 2,
  },
  verifiedOnText: {
    fontSize: 13,
    color: '#22C55E',
    fontWeight: '600',
  },

  imageSection: {
    marginBottom: 20,
  },
  imageSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  imgLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#334155',
  },
  actionIconsGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  actionIconBtn: {
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  actionDivider: {
    width: 1,
    height: 14,
    backgroundColor: '#CBD5E1',
    marginHorizontal: 4,
  },
  imgBox: {
    width: '100%',
    height: 200,
    borderWidth: 3,
    borderColor: '#1A0FA3',
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: '#F8FAFC',
  },
  docImage: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#94A3B8',
    fontWeight: '700',
    fontSize: 13,
    letterSpacing: 1.5,
  },
});
