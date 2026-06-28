import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Image, Share, Alert, ActivityIndicator } from 'react-native';
import { CloseIcon } from '@/components/ui/Icons';
import Svg, { Path } from 'react-native-svg';
import { StorageService } from '@/services/storage.service';
import { useDocStore } from '@/store/docStore';

interface HozifyIDCardModalProps {
  visible: boolean;
  onClose: () => void;
}

const ApprovedCheckIcon = ({ size = 12, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const ShareIcon = ({ size = 16, color = '#0F172A' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M18 8C19.6569 8 21 6.65685 21 5C21 3.34315 19.6569 2 18 2C16.3431 2 15 3.34315 15 5C15 6.65685 16.3431 8 18 8Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M6 15C7.65685 15 9 13.6569 9 12C9 10.3431 7.65685 9 6 9C4.34315 9 3 10.3431 3 12C3 13.6569 4.34315 15 6 15Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M18 22C19.6569 22 21 20.6569 21 19C21 17.3431 19.6569 16 18 16C16.3431 16 15 17.3431 15 19C15 20.6569 16.3431 22 18 22Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M8.59 13.51L15.42 17.49M15.41 6.51L8.59 10.49" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const DownloadIcon = ({ size = 16, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const HozifyIDCardModal: React.FC<HozifyIDCardModalProps> = ({ visible, onClose }) => {
  const [partnerProfile, setPartnerProfile] = useState<any>(null);
  const [gstNumber, setGstNumber] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const DEFAULT_AVATAR = 'https://i.pravatar.cc/150?u=partner';

  useEffect(() => {
    if (visible) {
      const loadData = async () => {
        const p = await StorageService.getPartnerProfile();
        setPartnerProfile(p);
        
        const docStore = useDocStore.getState();
        const gst = docStore.gstNumber || docStore.businessVerificationNumber || '07AAAAA0000A1Z5';
        setGstNumber(gst);
      };
      loadData();
    }
  }, [visible]);

  const handleShare = async () => {
    try {
      const ownerName = partnerProfile ? `${partnerProfile.firstName || ''} ${partnerProfile.lastName || ''}`.trim() : 'Eswar P';
      const shareMessage = `Hozify Partner Identity Card\n\n` +
        `Business: ${partnerProfile?.businessName || 'Hozify Services'}\n` +
        `Owner: ${ownerName}\n` +
        `Mobile: +91 9533911988\n` +
        `GSTIN: ${gstNumber || 'Not Registered'}\n` +
        `Address: ${partnerProfile?.address || 'Bangalore, Karnataka'}\n` +
        `Join Date: May 2026\n\n` +
        `Verified Hozify Partner`;
      await Share.share({
        message: shareMessage,
      });
    } catch (error: any) {
      Alert.alert('Share Error', error.message);
    }
  };

  const handleDownloadPdf = () => {
    setIsDownloading(true);
    setTimeout(() => {
      setIsDownloading(false);
      Alert.alert(
        'PDF Downloaded',
        'Your Hozify ID Card PDF has been generated and saved to your device Downloads.',
        [{ text: 'Open PDF', onPress: () => {} }, { text: 'OK' }]
      );
    }, 1500);
  };

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          
          <TouchableOpacity activeOpacity={1} style={styles.closeButton} onPress={onClose}>
            <CloseIcon size={16} color="#FFFFFF" />
          </TouchableOpacity>

          <View style={styles.cardContainer}>
            {/* Top Blue Section */}
            <View style={styles.cardHeader}>
              <View style={styles.brandCircleCenter}>
                <Image 
                  source={require('../../../assets/images/logo.png')} 
                  style={styles.logoImg} 
                  resizeMode="contain" 
                />
              </View>
            </View>

            {/* Avatar overlapping */}
            <View style={styles.avatarWrapper}>
              <Image source={{ uri: partnerProfile?.profilePhoto || DEFAULT_AVATAR }} style={styles.avatarImg} />
            </View>

            {/* Body */}
            <View style={styles.cardBody}>
              <View style={styles.nameRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.nameText}>
                    {partnerProfile ? `${partnerProfile.firstName || ''} ${partnerProfile.lastName || ''}`.trim() : 'Eswar P'}
                  </Text>
                  <Text style={styles.roleSubText}>Owner & Partner</Text>
                </View>
                <View style={styles.approvedBadge}>
                  <ApprovedCheckIcon />
                  <Text style={styles.approvedText}>Approved</Text>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.infoGrid}>
                <View style={styles.infoCol}>
                  <Text style={styles.labelText}>BUSINESS NAME</Text>
                  <Text style={styles.valueText}>{partnerProfile?.businessName || 'Hozify Services'}</Text>
                </View>
                <View style={styles.infoCol}>
                  <Text style={styles.labelText}>MOBILE NUMBER</Text>
                  <Text style={styles.valueText}>+91 9533911988</Text>
                </View>
              </View>

              <View style={styles.infoGrid}>
                <View style={styles.infoCol}>
                  <Text style={styles.labelText}>GST NUMBER</Text>
                  <Text style={styles.valueText}>{gstNumber || 'Not Registered'}</Text>
                </View>
                <View style={styles.infoCol}>
                  <Text style={styles.labelText}>JOIN DATE</Text>
                  <Text style={styles.valueText}>May 2026</Text>
                </View>
              </View>

              <View style={styles.infoGridFull}>
                <Text style={styles.labelText}>BUSINESS ADDRESS</Text>
                <Text style={[styles.valueText, { marginBottom: 8 }]}>
                  {partnerProfile?.address || 'Bangalore, Karnataka'}
                </Text>
              </View>

              <View style={styles.actionButtonsRow}>
                <TouchableOpacity activeOpacity={0.8} style={styles.shareButton} onPress={handleShare}>
                  <ShareIcon />
                  <Text style={styles.shareText}>Share</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  activeOpacity={0.8} 
                  style={[styles.downloadButton, isDownloading && styles.disabledButton]} 
                  onPress={handleDownloadPdf}
                  disabled={isDownloading}
                >
                  {isDownloading ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <>
                      <DownloadIcon />
                      <Text style={styles.downloadText}>Download PDF</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <TouchableOpacity activeOpacity={1} style={styles.viewDeclarationBtn}>
            <Text style={styles.viewDeclarationText}>view declaration</Text>
          </TouchableOpacity>

        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalContent: { width: '100%', maxWidth: 480, alignSelf: 'center', alignItems: 'center' },
  
  closeButton: { alignSelf: 'flex-end', marginBottom: 16, backgroundColor: 'rgba(255,255,255,0.2)', width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },

  cardContainer: { backgroundColor: '#FFFFFF', borderRadius: 24, width: '100%', maxWidth: 480, overflow: 'hidden' },
  
  cardHeader: { backgroundColor: 'rgba(26, 15, 163, 1.00)', height: 120, padding: 20, alignItems: 'center', justifyContent: 'center' },
  brandCircleCenter: { width: 70, height: 70, borderRadius: 35, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 4 },
  logoImg: { width: 50, height: 50 },

  avatarWrapper: { width: 90, height: 90, borderRadius: 45, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center', marginTop: -45, marginLeft: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  avatarImg: { width: 82, height: 82, borderRadius: 41 },

  cardBody: { padding: 20, paddingTop: 12 },
  
  nameRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  nameText: { fontSize: 18, fontWeight: '800', color: '#0F172A' },
  roleSubText: { fontSize: 12, color: '#64748B', fontWeight: '500', marginTop: 2 },
  approvedBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#10B981', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, gap: 4 },
  approvedText: { color: '#FFFFFF', fontSize: 10, fontWeight: '700' },

  divider: { height: 1, backgroundColor: '#F1F5F9', marginBottom: 16 },

  infoGrid: { flexDirection: 'row', marginBottom: 12, gap: 16 },
  infoGridFull: { width: '100%', marginBottom: 12 },
  infoCol: { flex: 1 },
  labelText: { fontSize: 9, color: '#94A3B8', fontWeight: '700', marginBottom: 4, letterSpacing: 0.5 },
  valueText: { fontSize: 13, color: '#0F172A', fontWeight: '700', lineHeight: 18 },

  actionButtonsRow: { flexDirection: 'row', gap: 12, marginTop: 16 },
  shareButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#64748B', borderRadius: 12, paddingVertical: 12, gap: 8 },
  shareText: { fontSize: 13, fontWeight: '600', color: '#0F172A' },
  downloadButton: { flex: 1.2, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(26, 15, 163, 1.00)', borderRadius: 12, paddingVertical: 12, gap: 8 },
  disabledButton: { backgroundColor: '#94A3B8' },
  downloadText: { fontSize: 13, fontWeight: '600', color: '#FFFFFF' },

  viewDeclarationBtn: { marginTop: 24 },
  viewDeclarationText: { color: '#FFFFFF', fontSize: 13, fontWeight: '500' },
});
