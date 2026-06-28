import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, TextInput, Keyboard, Pressable } from 'react-native';
import { Button } from '@/components/ui/Button';
import { CloseIcon, UploadIcon, YouTubeIcon, InstagramIcon, FacebookIcon, TwitterIcon } from '@/components/ui/Icons';
import Svg, { Path } from 'react-native-svg';

interface AddPlatformModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

const PLATFORMS = [
  { key: 'Youtube', label: 'YouTube', icon: <YouTubeIcon size={20} color="#FF0000" /> },
  { key: 'Instagram', label: 'Instagram', icon: <InstagramIcon size={20} color="#EC4899" /> },
  { key: 'Facebook', label: 'Facebook', icon: <FacebookIcon size={20} color="#1877F2" /> },
  { key: 'Twitter', label: 'X (Twitter)', icon: <TwitterIcon size={20} color="#0F172A" /> },
];

const ChevronDownIcon = ({ color = '#94A3B8' }) => (
  <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
    <Path d="M6 9L12 15L18 9" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const AtIcon = ({ color = '#94A3B8' }) => (
  <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
    <Path d="M20 12C20 16.4183 16.4183 20 12 20C7.58172 20 4 16.4183 4 12C4 7.58172 7.58172 4 12 4C16.4183 4 20 7.58172 20 12ZM20 12V13.5C20 14.8807 18.8807 16 17.5 16C16.1193 16 15 14.8807 15 13.5V12M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const LinkIcon2 = ({ color = '#94A3B8' }) => (
  <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
    <Path d="M10 13C10.4295 13.5741 10.9774 14.0491 11.6066 14.3929C12.2357 14.7367 12.9315 14.9411 13.6455 14.9923C14.3596 15.0435 15.0765 14.9403 15.7449 14.6897C16.4133 14.4392 17.0176 14.047 17.52 13.54L20.52 10.54C21.4234 9.60496 21.9238 8.34995 21.9119 7.04499C21.8999 5.74003 21.3763 4.49399 20.4563 3.57578C19.5363 2.65757 18.2898 2.1357 16.9849 2.12378C15.6799 2.11186 14.4234 2.6124 13.49 3.51999L11.75 5.24999" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M14 11C13.5705 10.4259 13.0226 9.95085 12.3934 9.60706C11.7642 9.26328 11.0685 9.05886 10.3545 9.00765C9.64048 8.95644 8.92357 9.0597 8.25515 9.31025C7.58673 9.5608 6.98237 9.95297 6.48 10.46L3.48 13.46C2.57659 14.395 2.07618 15.65 2.08811 16.955C2.10003 18.26 2.6236 19.506 3.54181 20.4242C4.46002 21.3424 5.70647 21.8643 7.01143 21.8762C8.31639 21.8881 9.57285 21.3876 10.51 20.48L12.24 18.75" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const AddPlatformModal: React.FC<AddPlatformModalProps> = ({ visible, onClose, onSubmit }) => {
  const [platform, setPlatform] = useState('');
  const [showPlatformDropdown, setShowPlatformDropdown] = useState(false);
  const [channelName, setChannelName] = useState('');
  const [channelLink, setChannelLink] = useState('');
  const [followers, setFollowers] = useState('');
  const [subscribers, setSubscribers] = useState('');
  const [about, setAbout] = useState('');
  const selectedPlatform = PLATFORMS.find(p => p.key === platform);

  const handleSubmit = () => {
    onSubmit({ platform, channelName, channelLink, followers, subscribers, about });
    setPlatform(''); setChannelName(''); setChannelLink('');
    setFollowers(''); setSubscribers(''); setAbout('');
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent statusBarTranslucent>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalOverlay}>
        <Pressable onPress={Keyboard.dismiss} style={StyleSheet.absoluteFill} />
        <View style={styles.modalContent}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">

            <View style={styles.headerTopRow}>
              <Text style={styles.title}>Add Platform</Text>
              <TouchableOpacity activeOpacity={1} onPress={onClose} style={styles.closeBtn}>
                <CloseIcon size={14} color="#64748B" />
              </TouchableOpacity>
            </View>

            {/* Platform Details Section */}
            <Text style={styles.sectionTitle}>Platform Details</Text>

            {/* Select Platform dropdown */}
            <TouchableOpacity activeOpacity={1}
              style={styles.inputRow}
              onPress={() => setShowPlatformDropdown(v => !v)}
            >
              <View style={styles.inputIconBox}>
                {selectedPlatform ? selectedPlatform.icon : <AtIcon />}
              </View>
              <Text style={[styles.inputText, !selectedPlatform && styles.placeholderText]}>
                {selectedPlatform ? selectedPlatform.label : 'Select Platform'}
              </Text>
              <ChevronDownIcon />
            </TouchableOpacity>

            {showPlatformDropdown && (
              <View style={styles.dropdown}>
                {PLATFORMS.map(p => (
                  <TouchableOpacity activeOpacity={1}
                    key={p.key}
                    style={[styles.dropdownItem, platform === p.key && styles.dropdownItemActive]}
                    onPress={() => { setPlatform(p.key); setShowPlatformDropdown(false); }}
                  >
                    {p.icon}
                    <Text style={[styles.dropdownItemText, platform === p.key && styles.dropdownItemTextActive]}>
                      {p.label}
                    </Text>
                    {platform === p.key && (
                      <View style={styles.checkDot} />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Channel / Username */}
            <View style={styles.inputRow}>
              <View style={styles.inputIconBox}><AtIcon /></View>
              <TextInput
                style={styles.inputText}
                placeholder="Channel / Username"
                placeholderTextColor="#94A3B8"
                value={channelName}
                onChangeText={setChannelName}
              />
            </View>

            {/* Channel Link */}
            <View style={styles.inputRow}>
              <View style={styles.inputIconBox}><LinkIcon2 /></View>
              <TextInput
                style={styles.inputText}
                placeholder="Channel Link / Profile URL"
                placeholderTextColor="#94A3B8"
                value={channelLink}
                onChangeText={setChannelLink}
                autoCapitalize="none"
                keyboardType="url"
              />
            </View>

            {/* Audience Metrics */}
            <Text style={[styles.sectionTitle, { marginTop: 8 }]}>Audience Metrics</Text>
            <View style={styles.rowInputs}>
              <TextInput
                style={[styles.boxInput, { flex: 1 }]}
                placeholder="Enter Followers"
                placeholderTextColor="#94A3B8"
                keyboardType="numeric"
                value={followers}
                onChangeText={setFollowers}
              />
              <TextInput
                style={[styles.boxInput, { flex: 1 }]}
                placeholder="Enter Subscribers"
                placeholderTextColor="#94A3B8"
                keyboardType="numeric"
                value={subscribers}
                onChangeText={setSubscribers}
              />
            </View>

            {/* Upload Proof */}
            <Text style={[styles.sectionTitle, { marginTop: 8 }]}>Upload Proof</Text>
            <View style={styles.rowInputs}>
              <TouchableOpacity activeOpacity={1} style={styles.uploadBox}>
                <UploadIcon size={24} color="rgba(26, 15, 163, 1.00)" />
                <Text style={styles.uploadTitle}>Upload Profile Image</Text>
                <Text style={styles.uploadSub}>JPG, PNG up to 5MB</Text>
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={1} style={styles.uploadBox}>
                <UploadIcon size={24} color="rgba(26, 15, 163, 1.00)" />
                <Text style={styles.uploadTitle}>Upload Channel Image</Text>
                <Text style={styles.uploadSub}>JPG, PNG up to 5MB</Text>
              </TouchableOpacity>
            </View>

            {/* About Your Channel */}
            <Text style={[styles.sectionTitle, { marginTop: 8 }]}>About Your Channel</Text>
            <TextInput
              style={styles.textArea}
              placeholder="Tell us about your content, audience and platform."
              placeholderTextColor="#94A3B8"
              multiline
              numberOfLines={4}
              value={about}
              onChangeText={setAbout}
              textAlignVertical="top"
            />

          </ScrollView>

          <View style={styles.footer}>
            <Button
              title="Submit for Review ->"
              onPress={handleSubmit}
              variant="primary"
              style={{ backgroundColor: 'rgba(26, 15, 163, 1.00)' }}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const ACCENT = 'rgba(26, 15, 163, 1.00)';

const styles = StyleSheet.create({
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: '95%' },
  scrollContent: { padding: 24, paddingBottom: 16 },

  headerTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  title: { fontSize: 18, fontWeight: '700', color: '#0F172A' },
  closeBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center' },

  sectionTitle: { fontSize: 13, fontWeight: '700', color: '#0F172A', marginBottom: 12 },

  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    height: 50,
    paddingHorizontal: 14,
    marginBottom: 12,
    backgroundColor: '#FFFFFF',
  },
  inputIconBox: { marginRight: 10 },
  inputText: { flex: 1, fontSize: 13, color: '#0F172A' },
  placeholderText: { color: '#94A3B8' },

  dropdown: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    marginTop: -8,
    marginBottom: 12,
    overflow: 'hidden',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 8 },
      android: { elevation: 4 },
    }),
  },
  dropdownItem: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  dropdownItemActive: { backgroundColor: '#EEF2FF' },
  dropdownItemText: { flex: 1, fontSize: 13, color: '#0F172A', fontWeight: '500' },
  dropdownItemTextActive: { color: ACCENT, fontWeight: '700' },
  checkDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: ACCENT },

  rowInputs: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  boxInput: { borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 10, height: 50, paddingHorizontal: 14, fontSize: 13, color: '#0F172A', backgroundColor: '#FFFFFF' },

  uploadBox: { flex: 1, borderWidth: 1.5, borderColor: '#C7D2FE', borderStyle: 'dashed', borderRadius: 12, paddingVertical: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F8FAFC', marginBottom: 12 },
  uploadTitle: { fontSize: 11, fontWeight: '600', color: '#0F172A', marginTop: 10, textAlign: 'center' },
  uploadSub: { fontSize: 10, color: '#94A3B8', marginTop: 4, textAlign: 'center' },

  textArea: { borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 12, padding: 14, fontSize: 13, color: '#0F172A', minHeight: 100, backgroundColor: '#FFFFFF', marginBottom: 12 },

  footer: { padding: 20, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#F1F5F9', backgroundColor: '#FFFFFF' },
});
