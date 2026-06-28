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

export default function TermsScreen() {
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
      await completeStepAndNavigate('termsAndConditions', router, 'completed');
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
          <Text style={styles.headerTitle}>Terms and Conditions</Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <View style={styles.contentBox}>
            <Text style={styles.heading}>1. Introduction</Text>
            <Text style={styles.paragraph}>
              Welcome to our platform. By accessing or using our services, you agree to be bound by these terms and conditions. Please read them carefully.
            </Text>

            <Text style={styles.heading}>2. User Responsibilities</Text>
            <Text style={styles.paragraph}>
              As a partner, you are responsible for maintaining the confidentiality of your account information. You agree to accept responsibility for all activities that occur under your account.
            </Text>

            <Text style={styles.heading}>3. Service Standards</Text>
            <Text style={styles.paragraph}>
              Partners must adhere to the quality standards set by the platform. Any violation of these standards may result in temporary or permanent suspension of your account.
            </Text>

            <Text style={styles.heading}>4. Payments and Fees</Text>
            <Text style={styles.paragraph}>
              All payments will be processed according to the payment schedule agreed upon. The platform reserves the right to modify fees with prior notice.
            </Text>

            <Text style={styles.heading}>5. Termination</Text>
            <Text style={styles.paragraph}>
              We reserve the right to terminate or suspend access to our service immediately, without prior notice or liability, for any reason whatsoever.
            </Text>

            {/* Dummy data for scrolling */}
            <Text style={styles.heading}>6. Privacy</Text>
            <Text style={styles.paragraph}>
              Your privacy is important to us. Please refer to our Privacy Policy to understand how we collect, use, and share your personal information.
            </Text>
            <Text style={styles.heading}>7. Limitation of Liability</Text>
            <Text style={styles.paragraph}>
              In no event shall the platform, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages.
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
                I have read and agree to the Terms and Conditions
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
