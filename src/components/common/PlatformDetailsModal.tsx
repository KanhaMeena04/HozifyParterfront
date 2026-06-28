import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, Image } from 'react-native';
import { CloseIcon, LinkIcon, YouTubeIcon, InstagramIcon, FacebookIcon, TwitterIcon, UserGroupIcon } from '@/components/ui/Icons';

interface PlatformDetailsModalProps {
  visible: boolean;
  onClose: () => void;
  platform: any;
}

const DUMMY_PROOFS = [
  'https://picsum.photos/seed/p1/200/200',
  'https://picsum.photos/seed/p2/200/200',
  'https://picsum.photos/seed/p3/200/200',
];

export const PlatformDetailsModal: React.FC<PlatformDetailsModalProps> = ({ visible, onClose, platform }) => {
  if (!platform) return null;

  const renderIcon = () => {
    switch (platform.type) {
      case 'Youtube': return <YouTubeIcon size={44} color="#FF0000" />;
      case 'Instagram': return <InstagramIcon size={44} color="#EC4899" />;
      case 'Facebook': return <FacebookIcon size={44} color="#1877F2" />;
      case 'Twitter': return <TwitterIcon size={44} color="#0F172A" />;
      default: return <YouTubeIcon size={44} color="#FF0000" />;
    }
  };

  const platformLabel = platform.type === 'Youtube' ? 'YouTube' : platform.type;

  return (
    <Modal visible={visible} animationType="slide" transparent statusBarTranslucent>
      <View style={styles.overlay}>
        <View style={styles.sheet}>

          {/* Close button */}
          <TouchableOpacity activeOpacity={1} onPress={onClose} style={styles.closeBtn}>
            <CloseIcon size={14} color="#64748B" />
          </TouchableOpacity>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

            {/* Header: icon + channel name + handle */}
            <View style={styles.header}>
              <View style={styles.iconBox}>{renderIcon()}</View>
              <View style={styles.headerInfo}>
                <Text style={styles.channelName}>{platform.handle?.replace('@', '') || platformLabel}</Text>
                <Text style={styles.channelHandle}>{platform.handle}</Text>
              </View>
            </View>

            {/* Metrics */}
            <View style={styles.metricsRow}>
              <View style={styles.metricItem}>
                <UserGroupIcon size={16} color="rgba(26, 15, 163, 1.00)" />
                <View style={styles.metricTexts}>
                  <Text style={styles.metricValue}>{platform.subscribers}</Text>
                  <Text style={styles.metricLabel}>Subscribers</Text>
                </View>
              </View>
              <View style={styles.metricDivider} />
              <View style={styles.metricItem}>
                <UserGroupIcon size={16} color="rgba(26, 15, 163, 1.00)" />
                <View style={styles.metricTexts}>
                  <Text style={styles.metricValue}>{platform.followers}</Text>
                  <Text style={styles.metricLabel}>Followers</Text>
                </View>
              </View>
            </View>

            {/* Link */}
            <View style={styles.linkRow}>
              <LinkIcon size={14} color="rgba(26, 15, 163, 1.00)" />
              <Text style={styles.linkText} numberOfLines={1}>{platform.link}</Text>
            </View>

            {/* About Channel */}
            <Text style={styles.sectionTitle}>About Channel</Text>
            <Text style={styles.aboutText}>
              Lifestyle vlogs, travel adventures, daily life, and exciting challenges. New video every week!
            </Text>

            <View style={styles.infoList}>
              {[
                { label: `Joined ${platformLabel}`, value: '20 March 2018' },
                { label: 'Channel Type', value: 'Public' },
                { label: 'Categories', value: 'Travel, Lifestyle' },
                { label: 'Location', value: 'India' },
              ].map((item, i, arr) => (
                <View key={item.label}>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>{item.label}</Text>
                    <Text style={styles.infoValue}>{item.value}</Text>
                  </View>
                  {i < arr.length - 1 && <View style={styles.infoDivider} />}
                </View>
              ))}
            </View>

            {/* Media Proofs */}
            <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Media Proofs</Text>
            <Text style={styles.aboutText}>
              Lifestyle vlogs, travel adventures, daily life, and exciting challenges. New video every week!
            </Text>

            <View style={styles.proofsGrid}>
              {DUMMY_PROOFS.map((uri, i) => (
                <Image key={i} source={{ uri }} style={styles.proofImage} />
              ))}
            </View>

          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: '92%', flex: 1, padding: 20 },
  closeBtn: { alignSelf: 'flex-end', width: 32, height: 32, borderRadius: 16, backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  scrollContent: { paddingBottom: 40 },

  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  iconBox: { marginRight: 14 },
  headerInfo: { flex: 1 },
  channelName: { fontSize: 15, fontWeight: '700', color: '#0F172A', marginBottom: 3 },
  channelHandle: { fontSize: 12, color: '#64748B' },

  metricsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F8FAFC', borderRadius: 16, padding: 16, marginBottom: 14, gap: 0 },
  metricItem: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
  metricDivider: { width: 1, height: 32, backgroundColor: '#E2E8F0' },
  metricTexts: {},
  metricValue: { fontSize: 13, fontWeight: '700', color: '#0F172A' },
  metricLabel: { fontSize: 11, color: '#64748B' },

  linkRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F8FAFC', borderRadius: 24, paddingVertical: 10, paddingHorizontal: 16, marginBottom: 24 },
  linkText: { fontSize: 12, color: 'rgba(26, 15, 163, 1.00)', marginLeft: 8, fontWeight: '500', flex: 1 },

  sectionTitle: { fontSize: 14, fontWeight: '700', color: '#0F172A', marginBottom: 8 },
  aboutText: { fontSize: 12, color: '#64748B', lineHeight: 18, marginBottom: 16 },

  infoList: { borderWidth: 1, borderColor: '#F1F5F9', borderRadius: 14, overflow: 'hidden' },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 },
  infoLabel: { fontSize: 12, color: '#64748B' },
  infoValue: { fontSize: 12, fontWeight: '600', color: '#0F172A' },
  infoDivider: { height: 1, backgroundColor: '#F1F5F9' },

  proofsGrid: { flexDirection: 'row', gap: 8 },
  proofImage: { flex: 1, aspectRatio: 1, borderRadius: 10, backgroundColor: '#F1F5F9' },
});
