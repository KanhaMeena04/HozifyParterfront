import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { BackArrowIcon } from '@/components/ui/Icons';
import { Button } from '@/components/ui/Button';
import Svg, { Path } from 'react-native-svg';
import { useAndroidBack } from '@/hooks/useAndroidBack';
import { StorageService } from '@/services/storage.service';
import { completeStepAndNavigate } from '@/utils/onboarding';

const CheckboxIcon = ({ checked, size = 24, color = 'rgba(26, 15, 163, 1.00)' }: { checked: boolean, size?: number, color?: string }) => (
  <View style={[
    { width: size, height: size, borderRadius: 6, borderWidth: 2, borderColor: checked ? color : '#CBD5E1', backgroundColor: checked ? color : '#FFFFFF', justifyContent: 'center', alignItems: 'center' }
  ]}>
    {checked && (
      <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
        <Path d="M5 12L10 17L20 7" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </Svg>
    )}
  </View>
);

export default function PoliciesScreen() {
  const router = useSafeRouter();
  const [accepted, setAccepted] = useState(false);
  const [isApproved, setIsApproved] = useState(false);

  React.useEffect(() => {
    const checkStatus = async () => {
      const session = await StorageService.getUserSession();
      if (session?.isApproved) {
        setIsApproved(true);
      }
    };
    checkStatus();
  }, []);

  useAndroidBack(() => {
    router.back();
  });

  const handleBack = () => {
    router.back();
  };

  const handleAccept = async () => {
    if (accepted) {
      await completeStepAndNavigate('policies', router, 'completed');
    }
  };

  return (
    <GradientBackground style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity activeOpacity={1} 
            onPress={() => {
              router.back();
            }} 
            style={styles.backButton}
          >
            <BackArrowIcon size={24} color="#0F172A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Privacy Policies</Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <View style={styles.contentBox}>
            <Text style={styles.heading}>1. Information Collection</Text>
            <Text style={styles.paragraph}>
              We collect information to provide better services to all our users. This includes basic information like your name and contact details, as well as more complex information such as location data.
            </Text>

            <Text style={styles.heading}>2. Use of Information</Text>
            <Text style={styles.paragraph}>
              The information we collect is used to maintain, protect, and improve our services. We also use this information to offer you tailored content.
            </Text>

            <Text style={styles.heading}>3. Data Security</Text>
            <Text style={styles.paragraph}>
              We work hard to protect our users from unauthorized access to or unauthorized alteration, disclosure, or destruction of information we hold.
            </Text>

            <Text style={styles.heading}>4. Sharing Information</Text>
            <Text style={styles.paragraph}>
              We do not share personal information with companies, organizations, and individuals outside of our company unless you have provided your explicit consent.
            </Text>

            <Text style={styles.heading}>5. User Rights</Text>
            <Text style={styles.paragraph}>
              You have the right to access, update, or delete your personal information. If you need assistance, please contact our support team.
            </Text>
          </View>
        </ScrollView>

        {!isApproved && (
          <View style={styles.footer}>
            <TouchableOpacity activeOpacity={1} 
              style={styles.checkboxContainer} 
              onPress={() => setAccepted(!accepted)}
            >
              <CheckboxIcon checked={accepted} />
              <Text style={styles.checkboxText}>
                I have read and agree to the Privacy Policies
              </Text>
            </TouchableOpacity>
            
            <Button 
              title="Accept & Continue" 
              onPress={handleAccept} 
              variant="primary" 
              disabled={!accepted}
            />
          </View>
        )}
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1,  },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16 },
  backButton: { marginRight: 12 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#0F172A' },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 20 },
  
  contentBox: { backgroundColor: '#FFFFFF', borderRadius: 24, padding: 24 },
  heading: { fontSize: 14, fontWeight: '700', color: '#0F172A', marginBottom: 8, marginTop: 16 },
  paragraph: { fontSize: 13, color: '#64748B', lineHeight: 22 },
  
  footer: { paddingHorizontal: 20, paddingBottom: 40, paddingTop: 16, backgroundColor: 'rgba(255,255,255,0.8)' },
  checkboxContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, paddingRight: 20 },
  checkboxText: { marginLeft: 12, fontSize: 13, color: '#334155', flex: 1, lineHeight: 20 },
});
