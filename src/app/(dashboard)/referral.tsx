import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, Clipboard, Share, Linking, ToastAndroid, Alert } from 'react-native';
import Svg, { Path } from 'react-native-svg';

const ArrowRightIcon = ({ size = 18, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M5 12H19M19 12L12 5M19 12L12 19" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { BackArrowIcon, RibbonIcon, CopyIcon, InstagramIcon, YouTubeIcon, TwitterIcon, WhatsAppIcon, QRCodeIcon, ShareIcon, VideoIcon, UserGroupIcon, FacebookIcon, LinkIcon } from '@/components/ui/Icons';
import { Button } from '@/components/ui/Button';
import { RewardSelectionModal } from '@/components/common/RewardSelectionModal';
import { AddPlatformModal } from '@/components/common/AddPlatformModal';
import { PlatformDetailsModal } from '@/components/common/PlatformDetailsModal';
import { ReferralStatusModal } from '@/components/common/ReferralStatusModal';
import { useAndroidBack } from '@/hooks/useAndroidBack';

const DUMMY_PLATFORMS = [
  { id: '1', type: 'Youtube', name: 'Youtube', handle: '@rameshvlogs', subscribers: '750k', followers: '750k', link: 'youtube.com/rameshvlogs', status: 'Approved' },
  { id: '2', type: 'Instagram', name: 'Instagram', handle: '@rameshvlogs', subscribers: '750k', followers: '750k', link: 'instagram.com/rameshvlogs', status: 'Pending' },
  { id: '3', type: 'Facebook', name: 'Facebook', handle: '@rameshvlogs', subscribers: '750k', followers: '750k', link: 'facebook.com/rameshvlogs', status: 'Pending' },
];

export default function ReferralScreen() {
  useAndroidBack(() => router.back());
  const router = useSafeRouter();
  const [role, setRole] = useState<'User' | 'Influencer'>('User');
  
  // Modals state
  const [rewardModalVisible, setRewardModalVisible] = useState(false);
  const [addPlatformModalVisible, setAddPlatformModalVisible] = useState(false);
  const [platformDetailsModalVisible, setPlatformDetailsModalVisible] = useState(false);
  const [referralStatusModalVisible, setReferralStatusModalVisible] = useState(false);
  
  const [selectedReward, setSelectedReward] = useState<any>(null);
  const [platforms, setPlatforms] = useState<any[]>(DUMMY_PLATFORMS); // Toggle to [] to see empty state
  const [selectedPlatform, setSelectedPlatform] = useState<any>(null);

  const isInfluencer = role === 'Influencer';
  const [codeCopied, setCodeCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  const REFERRAL_CODE = 'USER4582';
  const TRACKING_LINK = 'book.app/ref/alex_creator';

  const showCopiedToast = (msg: string) => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(msg, ToastAndroid.SHORT);
    }
  };

  const handleCopyCode = async () => {
    Clipboard.setString(REFERRAL_CODE);
    setCodeCopied(true);
    showCopiedToast('Referral code copied!');
    setTimeout(() => setCodeCopied(false), 2000);
  };

  const handleCopyLink = async () => {
    Clipboard.setString(`https://${TRACKING_LINK}`);
    setLinkCopied(true);
    showCopiedToast('Link copied!');
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const handleShareCode = async () => {
    try {
      await Share.share({
        message: `Use my referral code ${REFERRAL_CODE} to get rewards on Hozify! Book your first service: https://${TRACKING_LINK}`,
        url: `https://${TRACKING_LINK}`,
        title: 'Join Hozify with my referral code',
      });
    } catch {}
  };

  const handleSocialShare = (platform: string) => {
    const text = encodeURIComponent(`Use my referral code ${REFERRAL_CODE} to get rewards on Hozify!`);
    const url = encodeURIComponent(`https://${TRACKING_LINK}`);
    const urls: Record<string, string> = {
      Instagram: 'https://www.instagram.com/',
      YouTube: 'https://www.youtube.com/',
      Twitter: `https://twitter.com/intent/tweet?text=${text}%20${url}`,
      WhatsApp: `whatsapp://send?text=${text}%20${url}`,
      QRCode: '',
    };
    const target = urls[platform];
    if (!target) return;
    Linking.openURL(target).catch(() => {});
  };

  const handleGenerate = () => {
    // Generate code logic
  };

  const openPlatformDetails = (platform: any) => {
    setSelectedPlatform(platform);
    setPlatformDetailsModalVisible(true);
  };

  const renderIcon = (type: string) => {
    switch(type) {
      case 'Youtube': return <YouTubeIcon size={40} color="#FF0000" />;
      case 'Instagram': return <InstagramIcon size={40} color="#EC4899" />;
      case 'Facebook': return <FacebookIcon size={40} color="#1877F2" />;
      default: return <YouTubeIcon size={40} color="#FF0000" />;
    }
  };

  return (
    <GradientBackground style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        
        <View style={styles.header}>
          <TouchableOpacity activeOpacity={1} onPress={() => router.back()} style={styles.backButton}>
            <BackArrowIcon size={24} color="#0F172A" />
          </TouchableOpacity>
          <View style={styles.headerTitleBox}>
            <Text style={styles.headerTitle}>{isInfluencer ? 'Become an Influencer' : 'Referral Code'}</Text>
            <Text style={styles.headerSubtitle}>{isInfluencer ? 'Submit your details for verification' : 'Earn rewards by inviting friends'}</Text>
          </View>
          <TouchableOpacity activeOpacity={1} style={styles.helpButton}>
            <Text style={styles.helpText}>Help</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.segmentedControl}>
          <TouchableOpacity activeOpacity={1}
            style={[styles.segment, !isInfluencer && styles.segmentActive]}
            onPress={() => setRole('User')}
          >
            <Text style={[styles.segmentText, !isInfluencer && styles.segmentTextActive]}>Partner</Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={1}
            style={[styles.segment, isInfluencer && styles.segmentActive]}
            onPress={() => setRole('Influencer')}
          >
            <Text style={[styles.segmentText, isInfluencer && styles.segmentTextActive]}>Influencer</Text>
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          {!isInfluencer ? (
            // USER TAB
            <>
              {selectedReward ? (
                // FILLED STATE (Image 1)
                <View style={styles.contentWrapper}>
                  
                  {/* User Rewards Card */}
                  <View style={styles.card}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                      <View style={styles.userRewardsTag}>
                        <Text style={styles.userRewardsTagText}>User Rewards</Text>
                      </View>
                      <TouchableOpacity activeOpacity={1} onPress={() => setReferralStatusModalVisible(true)} style={{ marginRight: 16 }}>
                        <Text style={styles.chooseText}>View Earnings &gt;</Text>
                      </TouchableOpacity>
                    </View>
                    
                    <View style={styles.rewardPromoRow}>
                      <View style={{ flex: 1, paddingRight: 16 }}>
                        <Text style={styles.promoTitle}>{selectedReward.title}</Text>
                        <Text style={styles.promoSubtitle}>{selectedReward.subtitle}</Text>
                      </View>
                      <View style={styles.promoIconBox}>
                        <RibbonIcon size={48} color="rgba(26, 15, 163, 1.00)" />
                      </View>
                    </View>

                    <View style={styles.codeContainer}>
                      <View>
                        <Text style={styles.codeLabel}>Your Referral Code</Text>
                        <Text style={styles.codeText}>USER4582</Text>
                      </View>
                      <TouchableOpacity activeOpacity={1} style={[styles.copyBtn, codeCopied && styles.copyBtnCopied]} onPress={handleCopyCode}>
                        <CopyIcon size={16} color={codeCopied ? '#16A34A' : '#64748B'} />
                        <Text style={[styles.copyBtnText, codeCopied && styles.copyBtnTextCopied]}>{codeCopied ? 'Copied!' : 'Copy Code'}</Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  <TouchableOpacity activeOpacity={1} style={styles.inviteCard}>
                    <View style={styles.inviteIconBox}>
                      <RibbonIcon size={20} color="rgba(26, 15, 163, 1.00)" />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.inviteTitle}>Invite Friends to Hozify</Text>
                      <Text style={styles.inviteSubtitle}>Share your code and earn rewards</Text>
                    </View>
                    <Text style={styles.inviteAction}>INVITE &gt;</Text>
                  </TouchableOpacity>

                  <Text style={styles.sectionHeading}>Your Reward Type</Text>
                  <View style={styles.rewardTypeCard}>
                    <View style={styles.rewardTypeIcon}>
                      <RibbonIcon size={20} color="rgba(26, 15, 163, 1.00)" />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.rewardTypeTitle}>{selectedReward.title}</Text>
                      <Text style={styles.rewardTypeSubtitle}>On friend&apos;s first successful booking</Text>
                    </View>
                    <View style={styles.selectedBadge}>
                      <Text style={styles.selectedBadgeText}>Selected ✓</Text>
                    </View>
                  </View>

                  <Text style={styles.sectionHeading}>Share & Promote</Text>
                  <View style={styles.shareCard}>
                    <View style={styles.linkRow}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.linkLabel}>Your tracking link</Text>
                        <Text style={styles.linkUrlText}>book.app/ref/alex_creator</Text>
                      </View>
                      <TouchableOpacity activeOpacity={1} style={[styles.linkCopyBtn, linkCopied && styles.linkCopyBtnCopied]} onPress={handleCopyLink}>
                        <CopyIcon size={18} color="#FFFFFF" />
                      </TouchableOpacity>
                    </View>

                    <View style={styles.socialIconsRow}>
                      {[
                        { key: 'Instagram', icon: <InstagramIcon size={20} color="#EC4899" />, bg: '#FCE7F3', label: 'Instagram' },
                        { key: 'YouTube', icon: <YouTubeIcon size={20} color="#EF4444" />, bg: '#FEE2E2', label: 'YouTube' },
                        { key: 'Twitter', icon: <TwitterIcon size={20} color="#0F172A" />, bg: '#F1F5F9', label: 'X (Twitter)' },
                        { key: 'WhatsApp', icon: <WhatsAppIcon size={20} color="#22C55E" />, bg: '#DCFCE7', label: 'WhatsApp' },
                        { key: 'QRCode', icon: <QRCodeIcon size={20} color="#0F172A" />, bg: '#F1F5F9', label: 'QR Code' },
                      ].map(item => (
                        <TouchableOpacity activeOpacity={1} key={item.key} style={styles.socialItem} onPress={() => handleSocialShare(item.key)}>
                          <View style={[styles.socialIconCircle, { backgroundColor: item.bg }]}>
                            {item.icon}
                          </View>
                          <Text style={styles.socialText}>{item.label}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>

                  <View style={styles.actionButtonsRow}>
                    <TouchableOpacity activeOpacity={1} style={styles.shareActionBtn} onPress={handleShareCode}>
                      <ShareIcon size={18} color="rgba(26, 15, 163, 1.00)" />
                      <Text style={styles.shareActionText}>Share Your Code</Text>
                    </TouchableOpacity>
                    <Button
                      title="Refer Now"
                      onPress={() => router.push('/(dashboard)/coming-soon')}
                      variant="primary"
                      style={{ backgroundColor: 'rgba(26, 15, 163, 1.00)', flex: 1, marginTop: 12 }}
                      icon={<ArrowRightIcon />}
                    />
                  </View>
                  
                </View>
              ) : (
                // EMPTY STATE
                <View style={[styles.card, { padding: 24 }]}>
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
                    <Text style={styles.emptyTitle}>No reward selected yet</Text>
                    <Text style={styles.emptySubtitle}>Select a reward and generate your referral{'\n'}code to start earning.</Text>
                  </View>

                  <Button 
                    title="Generate Referral Code ->" 
                    onPress={handleGenerate} 
                    variant="secondary"
                    disabled
                    style={[styles.generateBtn, styles.generateBtnDisabled]}
                    textStyle={styles.generateBtnDisabledText}
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
              )}
            </>
          ) : (
            // INFLUENCER TAB
            <>
              {platforms.length === 0 ? (
                // EMPTY STATE (Image 2)
                <View style={styles.influencerEmpty}>
                  <View style={styles.videoIconCircle}>
                    <VideoIcon size={32} color="rgba(26, 15, 163, 1.00)" />
                  </View>
                  <Text style={styles.emptyTitle}>No platform added yet</Text>
                  <Text style={styles.emptySubtitle}>Add your social media platform to get started</Text>
                  <Button 
                    title="Add Platforms ->" 
                    onPress={() => setAddPlatformModalVisible(true)} 
                    variant="primary" 
                    style={{ backgroundColor: 'rgba(26, 15, 163, 1.00)', marginTop: 24, width: '100%' }}
                  />
                </View>
              ) : (
                // FILLED STATE (Image 4)
                <View style={styles.platformsContainer}>
                  <View style={styles.platformsHeaderRow}>
                    <Text style={styles.sectionHeading}>Your Platforms</Text>
                    <TouchableOpacity activeOpacity={1} onPress={() => router.push('/(tabs)')}>
                      <Text style={styles.chooseText}>View verification status &gt;</Text>
                    </TouchableOpacity>
                  </View>

                  {platforms.map(p => (
                    <View key={p.id} style={styles.platformCard}>
                      <View style={styles.platformCardHeader}>
                        {renderIcon(p.type)}
                        <View style={{ flex: 1, marginLeft: 12 }}>
                          <Text style={styles.platformName}>{p.name}</Text>
                          <Text style={styles.platformHandle}>{p.handle}</Text>
                        </View>
                        <View style={{ alignItems: 'flex-end' }}>
                          <TouchableOpacity activeOpacity={1} onPress={() => openPlatformDetails(p)}>
                            <Text style={styles.chooseText}>View &gt;</Text>
                          </TouchableOpacity>
                          <View style={[styles.statusBadge, p.status === 'Approved' ? styles.statusBadgeApproved : styles.statusBadgePending]}>
                            <Text style={[styles.statusBadgeText, p.status === 'Approved' ? styles.statusTextApproved : styles.statusTextPending]}>
                              {p.status}
                            </Text>
                          </View>
                        </View>
                      </View>

                      <View style={styles.platformMetrics}>
                        <View style={styles.pMetric}>
                          <UserGroupIcon size={16} color="rgba(26, 15, 163, 1.00)" />
                          <View style={styles.pMetricTexts}>
                            <Text style={styles.pMetricValue}>{p.subscribers}</Text>
                            <Text style={styles.pMetricLabel}>Subscribers</Text>
                          </View>
                        </View>
                        <View style={styles.pMetric}>
                          <UserGroupIcon size={16} color="rgba(26, 15, 163, 1.00)" />
                          <View style={styles.pMetricTexts}>
                            <Text style={styles.pMetricValue}>{p.followers}</Text>
                            <Text style={styles.pMetricLabel}>Followers</Text>
                          </View>
                        </View>
                      </View>

                      <View style={styles.platformLinkBox}>
                        <LinkIcon size={14} color="rgba(26, 15, 163, 1.00)" />
                        <Text style={styles.platformLinkText} numberOfLines={1}>{p.link}</Text>
                      </View>
                    </View>
                  ))}

                  <Button
                    title="Add Another Platforms"
                    onPress={() => setAddPlatformModalVisible(true)}
                    variant="primary"
                    style={{ backgroundColor: 'rgba(26, 15, 163, 1.00)', marginTop: 16 }}
                    icon={<ArrowRightIcon />}
                  />
                </View>
              )}
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

      <AddPlatformModal 
        visible={addPlatformModalVisible}
        onClose={() => setAddPlatformModalVisible(false)}
        onSubmit={(data) => {
          const newPlatform = {
            id: String(Date.now()),
            type: data.platform || 'Youtube',
            name: data.platform || 'Youtube',
            handle: data.channelName,
            subscribers: data.subscribers || '0',
            followers: data.followers || '0',
            link: data.channelLink,
            status: 'Pending'
          };
          setPlatforms([...platforms, newPlatform]);
        }}
      />

      <PlatformDetailsModal 
        visible={platformDetailsModalVisible}
        onClose={() => setPlatformDetailsModalVisible(false)}
        platform={selectedPlatform}
      />

      <ReferralStatusModal 
        visible={referralStatusModalVisible}
        onClose={() => setReferralStatusModalVisible(false)}
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

  segmentedControl: { flexDirection: 'row', backgroundColor: '#FFFFFF', borderRadius: 24, marginHorizontal: 20, marginBottom: 20, padding: 4 },
  segment: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 20 },
  segmentActive: { backgroundColor: 'rgba(26, 15, 163, 1.00)' },
  segmentText: { fontSize: 13, color: '#64748B', fontWeight: '500' },
  segmentTextActive: { color: '#FFFFFF', fontWeight: '600' },

  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },
  contentWrapper: { gap: 16 },
  
  card: { backgroundColor: '#FFFFFF', borderRadius: 16 },
  userRewardsTag: { alignSelf: 'flex-start', backgroundColor: '#EEF2FF', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12, margin: 16, marginBottom: 8 },
  userRewardsTagText: { color: 'rgba(26, 15, 163, 1.00)', fontSize: 10, fontWeight: '700' },
  rewardPromoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, marginBottom: 16 },
  promoTitle: { fontSize: 14, fontWeight: '700', color: '#0F172A', marginBottom: 4 },
  promoSubtitle: { fontSize: 11, color: '#64748B', lineHeight: 16 },
  promoIconBox: { width: 80, height: 80, borderRadius: 12, backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center' },
  
  codeContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', margin: 16, padding: 12, borderWidth: 1, borderColor: '#F1F5F9', borderRadius: 12 },
  codeLabel: { fontSize: 11, color: '#64748B', marginBottom: 4 },
  codeText: { fontSize: 18, fontWeight: '700', color: 'rgba(26, 15, 163, 1.00)' },
  copyBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, borderWidth: 1, borderColor: '#F1F5F9', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6 },
  copyBtnCopied: { borderColor: '#16A34A', backgroundColor: '#F0FDF4' },
  copyBtnText: { fontSize: 11, color: '#64748B', fontWeight: '500' },
  copyBtnTextCopied: { color: '#16A34A' },

  inviteCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16 },
  inviteIconBox: { width: 32, height: 32, borderRadius: 8, backgroundColor: '#EEF2FF', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  inviteTitle: { fontSize: 12, fontWeight: '700', color: '#0F172A', marginBottom: 2 },
  inviteSubtitle: { fontSize: 11, color: '#64748B' },
  inviteAction: { fontSize: 12, fontWeight: '700', color: 'rgba(26, 15, 163, 1.00)' },

  sectionHeading: { fontSize: 12, fontWeight: '700', color: '#0F172A', marginTop: 4, marginBottom: -8 },
  
  rewardTypeCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, marginTop: 16 },
  rewardTypeIcon: { width: 32, height: 32, borderRadius: 8, backgroundColor: '#F3E8FF', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  rewardTypeTitle: { fontSize: 12, fontWeight: '700', color: '#0F172A', marginBottom: 2 },
  rewardTypeSubtitle: { fontSize: 11, color: '#64748B' },
  selectedBadge: { backgroundColor: '#DCFCE7', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  selectedBadgeText: { fontSize: 10, color: '#16A34A', fontWeight: '600' },

  shareCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, marginTop: 16 },
  linkRow: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#F1F5F9', borderRadius: 24, paddingLeft: 16, paddingRight: 4, paddingVertical: 4, marginBottom: 20 },
  linkLabel: { fontSize: 10, color: '#64748B', marginBottom: 2 },
  linkUrlText: { fontSize: 12, color: '#3B82F6' },
  linkCopyBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#3B82F6', justifyContent: 'center', alignItems: 'center' },
  linkCopyBtnCopied: { backgroundColor: '#16A34A' },
  
  socialIconsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  socialItem: { alignItems: 'center', width: 50 },
  socialIconCircle: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  socialText: { fontSize: 9, color: '#64748B', textAlign: 'center' },

  actionButtonsRow: { },
  shareActionBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderWidth: 1, borderColor: 'rgba(26, 15, 163, 1.00)', borderRadius: 12, height: 48, marginTop: 16 },
  shareActionText: { fontSize: 14, fontWeight: '600', color: 'rgba(26, 15, 163, 1.00)' },

  // Empty states
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

  // Influencer Styles
  influencerEmpty: { alignItems: 'center', justifyContent: 'center', marginTop: 80, paddingHorizontal: 20 },
  videoIconCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#EEF2FF', justifyContent: 'center', alignItems: 'center', marginBottom: 24 },
  
  platformsContainer: { },
  platformsHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  platformCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, marginBottom: 12 },
  platformCardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  platformName: { fontSize: 14, fontWeight: '700', color: '#0F172A', marginBottom: 2 },
  platformHandle: { fontSize: 12, color: '#64748B' },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, marginTop: 4 },
  statusBadgeApproved: { backgroundColor: '#DCFCE7' },
  statusBadgePending: { backgroundColor: '#FFF7ED' },
  statusBadgeText: { fontSize: 10, fontWeight: '600' },
  statusTextApproved: { color: '#16A34A' },
  statusTextPending: { color: '#EA580C' },

  platformMetrics: { flexDirection: 'row', justifyContent: 'center', gap: 24, marginBottom: 16 },
  pMetric: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  pMetricTexts: {},
  pMetricValue: { fontSize: 12, fontWeight: '700', color: '#0F172A' },
  pMetricLabel: { fontSize: 10, color: '#64748B' },

  platformLinkBox: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F8FAFC', borderRadius: 24, paddingVertical: 10, paddingHorizontal: 16 },
  platformLinkText: { fontSize: 12, color: 'rgba(26, 15, 163, 1.00)', marginLeft: 8, fontWeight: '500' },

});
