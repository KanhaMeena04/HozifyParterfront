import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Platform, KeyboardAvoidingView, ScrollView, Keyboard, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { useAuthStore } from '@/store/authStore';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Loader } from '@/components/ui/Loader';
import { OtpInput } from '@/components/ui/OtpInput';
import { ReferralModal } from '@/components/ui/ReferralModal';
import { RoleSelectionModal } from '@/components/ui/RoleSelectionModal';
import { validateOtp } from '@/utils/validation';
import { BackArrowIcon, RightArrowIcon, MessageIcon, WhatsAppIcon } from '@/components/ui/Icons';
import { COLORS } from '@/constants';
import { useAndroidBack } from '@/hooks/useAndroidBack';
import { StorageService } from '@/services/storage.service';
import { ROLE_STEPS } from '@/utils/onboarding';

export default function OtpScreen() {
  useAndroidBack();
  const router = useSafeRouter();
  const { verifyOtp, isLoading, error, clearError, isAuthenticated, mobileNumber } = useAuthStore();
  const setRole = useAuthStore(state => state.setRole);
  const [otp, setOtp] = useState('');
  const [showReferral, setShowReferral] = useState(false);
  const [showRoleSelection, setShowRoleSelection] = useState(false);

  const handleVerify = async () => {
    clearError();
    if (!validateOtp(otp)) {
      useAuthStore.setState({ error: 'Enter a valid 6‑digit OTP' });
      return;
    }
    const success = await verifyOtp(otp);
    if (success) {
      const existingSession = await StorageService.getUserSession();
      const flowState = await StorageService.getMandatoryFlow();
      
      let isAllStepsCompleted = false;
      const userRole = existingSession?.role;
      if (userRole) {
        const steps = ROLE_STEPS[userRole as keyof typeof ROLE_STEPS] || [];
        isAllStepsCompleted = steps.length > 0 && steps.every((step: string) => {
          const status = flowState[step as keyof typeof flowState];
          return status === 'completed' || status === 'verified' || status === 'reviewing';
        });
      }

      if (existingSession?.isApproved || isAllStepsCompleted) {
        // If approved or all steps are completed, go directly to Dashboard
        await StorageService.updateUserSession({
          phone: mobileNumber,
          isLoggedIn: true,
          isApproved: true,
        });
        router.replace('/(dashboard)');
      } else if (existingSession && existingSession.role) {
        // Existing user but flow incomplete
        await StorageService.updateUserSession({
          phone: mobileNumber,
          isLoggedIn: true,
          isApproved: false,
        });
        router.replace('/(tabs)');
      } else {
        // New user
        await StorageService.updateUserSession({
          phone: mobileNumber,
          isLoggedIn: true,
          isApproved: false,
        });
        setShowReferral(true);
      }
    }
  };

  const handleBack = () => {
    // Always return to the login screen to avoid showing the application status page
    // before the user has selected a role and completed the profile.
    router.replace('/(auth)/login');
  };

  return (
    <Pressable onPress={Keyboard.dismiss} accessible={false} style={{ flex: 1 }}>
    <GradientBackground style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <SafeAreaView style={styles.safeArea}>
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            bounces={false}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
              <View style={styles.topSection}>
                <View style={styles.headerRow}>
                  <View style={styles.headerLeft}>
                    <TouchableOpacity activeOpacity={1} onPress={handleBack} style={styles.backButton}>
                      <BackArrowIcon size={24} color="#0F172A" />
                    </TouchableOpacity>
                    <View>
                      <Text style={styles.headerTitle}>Verify OTP</Text>
                      <Text style={styles.headerSubtitle}>Complete this to login</Text>
                    </View>
                  </View>
                  <Button title="Help" onPress={() => router.push('/(dashboard)/coming-soon')} variant="gradient" size="sm" style={styles.helpButton} />
                </View>
              </View>

              <Card style={styles.card} variant="default">
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle}>
                    Enter Verification code<Text style={styles.asterisk}>*</Text>
                  </Text>
                  <Text style={styles.cardSubtitle}>Sent to {mobileNumber || '9573447204'}</Text>
                </View>

                <OtpInput value={otp} onChange={setOtp} length={6} />
                {error ? <Text style={styles.errorText}>{error}</Text> : null}

                <View style={styles.actionRow}>
                  <TouchableOpacity activeOpacity={1} style={styles.actionLink}>
                    <MessageIcon size={18} color="#64748B" />
                    <Text style={styles.actionText}>Resend code in 29s</Text>
                  </TouchableOpacity>

                  <TouchableOpacity activeOpacity={1} style={styles.actionLink}>
                    <WhatsAppIcon size={18} />
                    <Text style={[styles.actionText, { color: '#25D366' }]}>Send via WhatsApp</Text>
                  </TouchableOpacity>
                </View>

                <Button 
                  title="Next" 
                  onPress={handleVerify} 
                  isLoading={isLoading} 
                  variant="primary" 
                  icon={<RightArrowIcon size={20} />}
                  style={styles.nextButton}
                />

                <Text style={styles.termsText}>
                  By tapping on "Send via WhatsApp", you agree to receive important communications such as OTP and payment details, over Whatsapp
                </Text>
              </Card>
          </ScrollView>
        </SafeAreaView>
      </KeyboardAvoidingView>
      <Loader visible={isLoading} message="Please wait few seconds" subMessage="We are verifying your number" />

      <ReferralModal
          visible={showReferral}
          onApply={(code) => {
            setShowReferral(false);
            setShowRoleSelection(true);
          }}
          onSkip={() => {
            setShowReferral(false);
            setShowRoleSelection(true);
          }}
        />

      <RoleSelectionModal
        visible={showRoleSelection}
        onSelect={async (roleId) => {
          setShowRoleSelection(false);
          setRole(roleId as any);
          await StorageService.updateUserSession({ role: roleId as any });
          router.replace('/(auth)/create-profile');
        }}
        onClose={() => setShowRoleSelection(false)}
      />
    </GradientBackground>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  safeArea: {
    flex: 1,
    
  },
  topSection: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 24,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  backButton: {
    marginRight: 12,
    marginTop: 2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#64748B',
  },
  helpButton: {
    paddingHorizontal: 20,
  },
  card: {
    width: '90%',
    alignSelf: 'center',
    marginTop: 20,
    padding: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.1)',
    elevation: 5,
    marginBottom: 20,
  },
  cardHeader: {
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  asterisk: {
    color: '#EF4444',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#64748B',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 24,
  },
  actionLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionText: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
  },
  nextButton: {
    marginBottom: 24,
  },
  termsText: {
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 18,
  },
  errorText: {
    fontSize: 12,
    color: '#EF4444',
    marginTop: -8,
    marginBottom: 8,
  },
});
