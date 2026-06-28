import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { BackArrowIcon, CheckCircleIcon, OutlineHourglassIcon, SolidHourglassIcon, BadgeCheckIcon, IdCardIcon, UserGroupIcon, VideoIcon, SecurityIcon, BellIcon, RibbonIcon } from '@/components/ui/Icons';
import { Button } from '@/components/ui/Button';
import Svg, { Path } from 'react-native-svg';
import { RewardSelectionModal } from '@/components/common/RewardSelectionModal';
import { useAndroidBack } from '@/hooks/useAndroidBack';

const CheckMarkIcon = ({ size = 16, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M5 13l4 4L19 7" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export default function VerificationStatusScreen() {
  useAndroidBack();
  const router = useSafeRouter();
  const [step, setStep] = useState(1); // 1 = Details Submitted, 2 = Under Review, 3 = Approved
  const [rewardModalVisible, setRewardModalVisible] = useState(false);
  const [selectedReward, setSelectedReward] = useState<any>(null);

  useEffect(() => {
    let timer1: any;
    let timer2: any;

    if (step === 1) {
      timer1 = setTimeout(() => {
        setStep(2);
      }, 2000);
    } else if (step === 2) {
      timer2 = setTimeout(() => {
        setStep(3);
      }, 2000);
    }

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [step]);

  const handleGenerate = () => {
    router.push('/(tabs)');
  };

  return (
    <GradientBackground style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        
        <View style={styles.header}>
          <TouchableOpacity activeOpacity={1} onPress={() => router.back()} style={styles.backButton}>
            <BackArrowIcon size={24} color="#0F172A" />
          </TouchableOpacity>
          <View style={styles.headerTitleBox}>
            <Text style={styles.headerTitle}>Verification Status</Text>
            <Text style={styles.headerSubtitle}>We're reviewing your profile</Text>
          </View>
          <TouchableOpacity activeOpacity={1} style={styles.helpButton} onPress={() => router.push('/(dashboard)/help')}>
            <Text style={styles.helpText}>Help</Text>
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          <View style={styles.stepperContainer}>
            <View style={styles.stepperLinesContainer}>
              <View style={[styles.stepperLine, step >= 2 ? styles.stepperLineActive : null]} />
              <View style={[styles.stepperLine, step >= 3 ? styles.stepperLineActive : null]} />
            </View>

            <View style={styles.stepBox}>
              <View style={styles.stepperCircleCompleted}>
                <CheckMarkIcon size={16} />
              </View>
              <Text style={styles.stepperText}>SUBMITTED</Text>
            </View>
            
            <View style={styles.stepBox}>
              {step > 2 ? (
                <View style={styles.stepperCircleCompleted}>
                  <CheckMarkIcon size={16} />
                </View>
              ) : step === 2 ? (
                <View style={styles.stepperCircleActiveOuter}>
                  <View style={styles.stepperCircleActiveInner} />
                </View>
              ) : (
                <View style={styles.stepperCirclePendingOuter}>
                  <View style={styles.stepperCirclePendingInner} />
                </View>
              )}
              <Text style={styles.stepperText}>REVIEWING</Text>
            </View>

            <View style={styles.stepBox}>
              {step > 3 ? (
                <View style={styles.stepperCircleCompleted}>
                  <CheckMarkIcon size={16} />
                </View>
              ) : step === 3 ? (
                <View style={styles.stepperCircleActiveOuter}>
                  <View style={styles.stepperCircleActiveInner} />
                </View>
              ) : (
                <View style={styles.stepperCirclePendingOuter}>
                  <View style={styles.stepperCirclePendingInner} />
                </View>
              )}
              <Text style={styles.stepperText}>APPROVED</Text>
            </View>
          </View>

          {step < 3 ? (
            // IN PROGRESS VIEW
            <>
              <View style={styles.mainCard}>
                <View style={styles.statusRow}>
                  <SolidHourglassIcon size={64} />
                  <View style={styles.statusTextBox}>
                    <Text style={styles.statusTitle}>Your Profile is under review</Text>
                    <Text style={styles.statusDesc}>Our team is verifying your details and platform information.</Text>
                  </View>
                </View>

                <View style={styles.infoBanner}>
                  <OutlineHourglassIcon size={20} color="rgba(26, 15, 163, 1.00)" />
                  <View style={{ marginLeft: 12, flex: 1 }}>
                    <Text style={styles.infoBannerTitle}>This usually takes 24-48 hours</Text>
                    <Text style={styles.infoBannerSub}>We'll notify you once your profile is approved.</Text>
                  </View>
                </View>
              </View>

              <View style={styles.mainCard}>
                <Text style={styles.checkingTitle}>What we're checking</Text>
                
                <View style={styles.checkItem}>
                  <View style={styles.checkIconBox}>
                    <IdCardIcon size={16} color="rgba(26, 15, 163, 1.00)" />
                  </View>
                  <View style={styles.checkTexts}>
                    <Text style={styles.checkLabel}>Platform Authenticity</Text>
                    <Text style={styles.checkDesc}>Verifying your social media channels and profile links.</Text>
                  </View>
                </View>

                <View style={styles.checkItem}>
                  <View style={styles.checkIconBox}>
                    <UserGroupIcon size={16} color="rgba(26, 15, 163, 1.00)" />
                  </View>
                  <View style={styles.checkTexts}>
                    <Text style={styles.checkLabel}>Audience Metrics</Text>
                    <Text style={styles.checkDesc}>Checking your followers, engagement and audience quality.</Text>
                  </View>
                </View>

                <View style={styles.checkItem}>
                  <View style={styles.checkIconBox}>
                    <VideoIcon size={16} color="rgba(26, 15, 163, 1.00)" />
                  </View>
                  <View style={styles.checkTexts}>
                    <Text style={styles.checkLabel}>Content Quality</Text>
                    <Text style={styles.checkDesc}>Reviewing your content and niche relevance.</Text>
                  </View>
                </View>

                <View style={styles.checkItem}>
                  <View style={styles.checkIconBox}>
                    <SecurityIcon size={16} color="rgba(26, 15, 163, 1.00)" />
                  </View>
                  <View style={styles.checkTexts}>
                    <Text style={styles.checkLabel}>Account Status</Text>
                    <Text style={styles.checkDesc}>If your verification is not approved, your account will continue in User mode.</Text>
                  </View>
                </View>
              </View>

              <View style={styles.notificationBanner}>
                <View style={styles.notifIconBox}>
                  <BellIcon size={20} color="rgba(26, 15, 163, 1.00)" />
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.notifTitle}>You'll get notified via app and WhatsApp</Text>
                  <Text style={styles.notifSub}>Once your profile status is updated.</Text>
                </View>
              </View>

              <Button 
                title="Go To Home ->" 
                onPress={() => router.push('/(tabs)')} 
                variant="primary" 
                style={{ backgroundColor: 'rgba(26, 15, 163, 1.00)', marginTop: 12 }}
              />
              <Button 
                title="View Rejection Details" 
                onPress={() => router.push('/(dashboard)/rejected-reasons')} 
                variant="outline" 
                style={{ borderColor: '#EF4444', marginTop: 12 }}
                textStyle={{ color: '#EF4444' }}
              />
            </>
          ) : (
            // APPROVED VIEW
            <>
              <View style={[styles.mainCard, { paddingVertical: 32 }]}>
                <View style={styles.statusRowCenter}>
                  <BadgeCheckIcon size={80} color="rgba(26, 15, 163, 1.00)" />
                  <View style={[styles.statusTextBox, { marginLeft: 16 }]}>
                    <Text style={[styles.statusTitle, { fontSize: 20 }]}>Congratulations</Text>
                    <Text style={[styles.statusDesc, { color: 'rgba(26, 15, 163, 1.00)', fontWeight: '700', marginVertical: 4 }]}>Your profile is approved</Text>
                    <Text style={styles.statusDesc}>You can now get rewards by sharing your referral code with your friends.</Text>
                  </View>
                </View>
              </View>

              <View style={styles.rewardCard}>
                <View style={styles.rewardHeader}>
                  <View>
                    <Text style={styles.rewardTitle}>Your Reward</Text>
                    <Text style={styles.rewardSubtitle}>Choose a reward to unlock</Text>
                  </View>
                  <TouchableOpacity activeOpacity={1} onPress={() => setRewardModalVisible(true)}>
                    <Text style={styles.chooseText}>Choose reward &gt;</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.rewardCenterBox}>
                  <View style={styles.giftIconCircle}>
                    <RibbonIcon size={32} color="rgba(26, 15, 163, 1.00)" />
                  </View>
                  
                  {selectedReward ? (
                    <>
                      <Text style={styles.emptyTitle}>Reward Selected</Text>
                      <Text style={styles.emptySubtitle}>{selectedReward.title}</Text>
                    </>
                  ) : (
                    <>
                      <Text style={styles.emptyTitle}>No reward selected yet</Text>
                      <Text style={styles.emptySubtitle}>Select a reward and generate your referral{'\n'}code to start earning.</Text>
                    </>
                  )}
                </View>

                <Button 
                  title="Generate Referral Code ->" 
                  onPress={handleGenerate} 
                  variant="secondary"
                  disabled={!selectedReward}
                  style={[
                    styles.generateBtn,
                    !selectedReward && styles.generateBtnDisabled
                  ]}
                  textStyle={!selectedReward ? styles.generateBtnDisabledText : undefined}
                />

                <View style={styles.divider} />

                <View style={styles.howItWorks}>
                  <View style={styles.hiwHeader}>
                    <Text style={styles.hiwEmoji}>🎉</Text>
                    <Text style={styles.hiwTitle}>How it works</Text>
                  </View>

                  <View style={styles.stepList}>
                    <View style={styles.stepItem}>
                      <Text style={styles.stepIcon}>🔗</Text>
                      <Text style={styles.stepText}>Invite your friends using your referral code</Text>
                    </View>
                    <View style={styles.stepItem}>
                      <Text style={styles.stepIcon}>✓</Text>
                      <Text style={styles.stepText}>Your friend completes their first booking</Text>
                    </View>
                    <View style={styles.stepItem}>
                      <Text style={styles.stepIcon}>🎁</Text>
                      <Text style={styles.stepText}>You both earn the reward you selected!</Text>
                    </View>
                  </View>
                </View>
              </View>
            </>
          )}

        </ScrollView>

      </SafeAreaView>

      <RewardSelectionModal 
        visible={rewardModalVisible}
        onClose={() => setRewardModalVisible(false)}
        selectedRewardId={selectedReward?.id}
        onSelect={(reward) => {
          setSelectedReward(reward);
          setRewardModalVisible(false);
        }}
      />
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1,  },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 16 },
  backButton: { marginRight: 12 },
  headerTitleBox: { flex: 1 },
  headerTitle: { fontSize: 16, fontWeight: '700', color: '#0F172A', marginBottom: 2 },
  headerSubtitle: { fontSize: 12, color: '#64748B' },
  helpButton: { backgroundColor: '#F97316', paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20 },
  helpText: { color: '#FFFFFF', fontSize: 12, fontWeight: '600' },

  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },

  stepperContainer: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', paddingHorizontal: 16, marginBottom: 32, position: 'relative' },
  stepperLinesContainer: { position: 'absolute', top: 11, left: 51, right: 51, flexDirection: 'row', height: 2, zIndex: 0 },
  stepperLine: { flex: 1, backgroundColor: '#334155' },
  stepperLineActive: { backgroundColor: '#22C55E' },

  stepBox: { alignItems: 'center', width: 70 },
  stepperCircleCompleted: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#22C55E', justifyContent: 'center', alignItems: 'center', marginBottom: 12, zIndex: 1 },
  
  stepperCircleActiveOuter: { width: 24, height: 24, borderRadius: 12, backgroundColor: 'rgba(250, 204, 21, 0.3)', justifyContent: 'center', alignItems: 'center', marginBottom: 12, zIndex: 1 },
  stepperCircleActiveInner: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#FACC15' },
  
  stepperCirclePendingOuter: { width: 24, height: 24, borderRadius: 12, backgroundColor: 'rgba(100, 116, 139, 0.3)', justifyContent: 'center', alignItems: 'center', marginBottom: 12, zIndex: 1 },
  stepperCirclePendingInner: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#64748B' },
  
  stepperText: { fontSize: 10, fontWeight: '700', color: '#94A3B8', letterSpacing: 0.5 },

  mainCard: { backgroundColor: '#F8FAFC', borderRadius: 16, padding: 20, marginBottom: 16 },
  statusRow: { flexDirection: 'row', alignItems: 'center' },
  statusRowCenter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  statusTextBox: { flex: 1, marginLeft: 16 },
  statusTitle: { fontSize: 14, fontWeight: '700', color: '#0F172A', marginBottom: 4 },
  statusDesc: { fontSize: 12, color: '#64748B', lineHeight: 18 },
  
  infoBanner: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', padding: 12, borderRadius: 12, marginTop: 20 },
  infoBannerTitle: { fontSize: 11, fontWeight: '700', color: 'rgba(26, 15, 163, 1.00)', marginBottom: 2 },
  infoBannerSub: { fontSize: 10, color: '#64748B' },

  checkingTitle: { fontSize: 13, fontWeight: '700', color: '#0F172A', marginBottom: 16 },
  checkItem: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 16 },
  checkIconBox: { width: 24, height: 24, borderRadius: 6, backgroundColor: '#EEF2FF', justifyContent: 'center', alignItems: 'center', marginRight: 12, marginTop: 2 },
  checkTexts: { flex: 1 },
  checkLabel: { fontSize: 12, fontWeight: '700', color: '#0F172A', marginBottom: 4 },
  checkDesc: { fontSize: 11, color: '#64748B', lineHeight: 16 },

  notificationBanner: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E8F0', borderStyle: 'dashed', borderRadius: 12, padding: 16, marginBottom: 16 },
  notifIconBox: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#EEF2FF', justifyContent: 'center', alignItems: 'center' },
  notifTitle: { fontSize: 12, fontWeight: '700', color: '#0F172A', marginBottom: 2 },
  notifSub: { fontSize: 11, color: '#64748B' },

  rewardCard: { backgroundColor: '#FFFFFF', borderRadius: 24, padding: 24 },
  rewardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 },
  rewardTitle: { fontSize: 13, fontWeight: '700', color: '#0F172A', marginBottom: 2 },
  rewardSubtitle: { fontSize: 11, color: '#64748B' },
  chooseText: { fontSize: 11, fontWeight: '600', color: 'rgba(26, 15, 163, 1.00)' },

  rewardCenterBox: { alignItems: 'center', marginBottom: 24 },
  giftIconCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#EEF2FF', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  emptyTitle: { fontSize: 13, fontWeight: '700', color: '#0F172A', marginBottom: 6 },
  emptySubtitle: { fontSize: 11, color: '#64748B', textAlign: 'center', lineHeight: 16 },

  generateBtn: { borderRadius: 12, height: 48, borderColor: 'rgba(26, 15, 163, 1.00)' },
  generateBtnDisabled: { backgroundColor: '#E2E8F0', borderColor: '#E2E8F0' },
  generateBtnDisabledText: { color: '#94A3B8' },

  divider: { height: 1, backgroundColor: '#F1F5F9', marginVertical: 24 },

  howItWorks: {},
  hiwHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  hiwEmoji: { fontSize: 16, marginRight: 8 },
  hiwTitle: { fontSize: 14, fontWeight: '700', color: '#0F172A' },
  
  stepList: { gap: 16 },
  stepItem: { flexDirection: 'row', alignItems: 'center' },
  stepIcon: { fontSize: 14, marginRight: 12, width: 20, textAlign: 'center' },
  stepText: { fontSize: 12, color: '#64748B', flex: 1 },

});
