import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Keyboard, Pressable, KeyboardAvoidingView, ScrollView, Platform, BackHandler } from 'react-native';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { Image } from 'expo-image';
import { useAuthStore } from '@/store/authStore';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { Card } from '@/components/ui/Card';
import { PhoneInput } from '@/components/ui/PhoneInput';
import { Button } from '@/components/ui/Button';
import { HelpModal } from '@/components/ui/HelpModal';
import { Loader } from '@/components/ui/Loader';
import { validatePhone, parsePhoneNumber } from '@/utils/validation';
import { useAndroidBack } from '@/hooks/useAndroidBack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RightArrowIcon } from '@/components/ui/Icons';

export default function LoginScreen() {
  useAndroidBack(() => {
    BackHandler.exitApp();
  });
  const router = useSafeRouter();
  const { sendOtp, isLoading, error, clearError, otpSent } = useAuthStore();

  const [phone, setPhone] = useState('');
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    if (otpSent) {
      router.replace('/(auth)/otp');
    }
  }, [otpSent]);

  const handleSend = async () => {
    clearError();
    const { localNumber } = parsePhoneNumber(phone);
    if (!localNumber || localNumber.trim().length === 0) {
      useAuthStore.setState({ error: 'Mobile number is required' });
      return;
    }
    if (localNumber.length !== 10 || !validatePhone(phone)) {
      useAuthStore.setState({ error: 'Please enter a valid 10‑digit mobile number' });
      return;
    }
    await sendOtp(phone);
  };

  return (
    <Pressable onPress={Keyboard.dismiss} accessible={false} style={{ flex: 1 }}>
      <GradientBackground style={styles.container}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
          <SafeAreaView style={styles.safeArea}>
            <ScrollView
              contentContainerStyle={styles.scrollContainer}
              bounces={false}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              {/* Top section — logo + help button */}
              <View style={styles.topSection}>
                <View style={styles.headerRow}>
                  <View style={{ flex: 1 }} />
                  <Button title="Help" onPress={() => setShowHelp(true)} variant="gradient" size="sm" style={styles.helpButton} />
                </View>
                <View style={styles.logoWrapper}>
                  <Image
                    source={require('../../../assets/images/logo.png')}
                    style={styles.icon}
                    contentFit="contain"
                  />
                </View>
              </View>

              {/* Bottom card — matches OTP screen card style */}
              <Card style={styles.card} variant="default">
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle}>
                    What's your mobile number
                  </Text>
                  <Text style={styles.cardSubtitle}>We'll send you a verification code</Text>
                </View>

                <PhoneInput
                  value={phone}
                  onChangeText={(text) => {
                    clearError();
                    setPhone(text);
                  }}
                  placeholder="00000 00000"
                  error={error}
                />

                <Button
                  title="Next"
                  onPress={handleSend}
                  isLoading={isLoading}
                  variant="primary"
                  icon={<RightArrowIcon size={20} />}
                  style={styles.nextButton}
                />

                <Text style={styles.termsText}>
                  By continuing, you confirm that you are 18 years of age and agree to the Terms & Conditions and Privacy Policy
                </Text>
              </Card>
            </ScrollView>
          </SafeAreaView>
        </KeyboardAvoidingView>

        <HelpModal visible={showHelp} onClose={() => setShowHelp(false)} />
        <Loader visible={isLoading} message="Sending OTP…" />
      </GradientBackground>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  topSection: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 24,
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    marginBottom: 40,
  },
  helpButton: {
    paddingHorizontal: 20,
  },
  logoWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  icon: {
    width: 160,
    height: 160,
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
  nextButton: {
    marginTop: 8,
    marginBottom: 8,
  },
  termsText: {
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 18,
  },
});
