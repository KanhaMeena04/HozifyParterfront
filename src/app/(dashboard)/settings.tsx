import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, Modal, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { Checkbox } from '@/components/ui/Checkbox';
import { Input } from '@/components/ui/Input';
import { BackArrowIcon } from '@/components/ui/Icons';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import { LanguageSelectModal } from '@/components/common/LanguageSelectModal';
import { useAndroidBack } from '@/hooks/useAndroidBack';
import { useAuthStore } from '@/store/authStore';
import { StorageService } from '@/services/storage.service';

// Inline Icons
const ChevronRightIcon = ({ size = 16, color = '#94A3B8' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M9 18L15 12L9 6" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const EditUserIcon = ({ color = '#64748B' }) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path d="M16 21V19C16 17.8954 15.1046 17 14 17H10C8.89543 17 8 17.8954 8 19V21" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    <Circle cx="12" cy="9" r="4" stroke={color} strokeWidth="1.5" />
    <Path d="M19 14L21 16L16 21H14V19L19 14Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const HeartAddIcon = ({ color = '#64748B' }) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path d="M4.31802 6.31802C2.56066 8.07538 2.56066 10.9246 4.31802 12.682L12 20.364L15 17.364" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M19.682 6.31802C17.9246 4.56066 15.0754 4.56066 13.318 6.31802L12 7.63604L10.682 6.31802C8.92462 4.56066 6.07538 4.56066 4.31802 6.31802" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M19 14V22M15 18H23" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const SettingsSlidersIcon = ({ color = '#64748B' }) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path d="M4 21V14M4 10V3M12 21V12M12 8V3M20 21V16M20 12V3M2 14H6M10 8H14M18 16H22" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const EditBoxIcon = ({ color = '#64748B' }) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Rect x="4" y="4" width="16" height="16" rx="2" stroke={color} strokeWidth="1.5" />
    <Path d="M9 15H15L16 11L10 11L9 15Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M16 11L17 9C17 9 15 7 14 8L10 11" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const InfoIcon = ({ color = '#64748B' }) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="1.5" />
    <Path d="M12 16V12M12 8H12.01" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const RocketIcon = ({ color = '#64748B' }) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path d="M11 13L15 9" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M17.5 4.5C17.5 4.5 21 8 21 10.5C21 11 18 12.5 18 12.5L11.5 19C11.5 19 10 22 9.5 22C7 22 3.5 18.5 3.5 18.5L2 13L7 8L9.5 7L13.5 3C13.5 3 16.5 4 17.5 4.5Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M3.5 18.5L2 22L5.5 20.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const LogoutIcon = ({ color = '#64748B' }) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path d="M17 16L21 12M21 12L17 8M21 12H9M13 16V17C13 18.6569 11.6569 20 10 20H6C4.34315 20 3 18.6569 3 17V7C3 5.34315 4.34315 4 6 4H10C11.6569 4 13 5.34315 13 7V8" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const TrashIcon = ({ color = '#EF4444' }) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path d="M4 7H20M10 11V17M14 11V17M5 7L6 19C6 20.1046 6.89543 21 8 21H16C17.1046 21 18 20.1046 18 19L19 7M9 7V4C9 3.44772 9.44772 3 10 3H14C14.5523 3 15 3.44772 15 4V7" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export default function SettingsScreen() {
  useAndroidBack(() => router.back());
  const router = useSafeRouter();
  const { logout } = useAuthStore();
  const [langModalVisible, setLangModalVisible] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deleteAccountStep, setDeleteAccountStep] = useState<'reason' | 'confirm'>('reason');
  const [selectedAccountReasons, setSelectedAccountReasons] = useState<Record<string, boolean>>({});
  const [otherAccountReasonText, setOtherAccountReasonText] = useState('');

  const handleLogout = async () => {
    setLogoutModalVisible(false);
    await logout();
    router.replace('/(auth)/login');
  };

  const handleDeleteAccount = async () => {
    setDeleteModalVisible(false);
    await StorageService.clearSession();
    await logout();
    router.replace('/(auth)/login');
  };

  const GeneralMenuItems = [
    { id: 'profile', title: 'Profile', sub: '+91 9573447204', icon: <EditUserIcon />, onPress: () => router.push('/(dashboard)/profile-details') },
    { id: 'favs', title: 'Favourites', sub: 'Manage favourites', icon: <HeartAddIcon />, onPress: () => router.push('/(dashboard)/favourites') },
    { id: 'prefs', title: 'Preferences', sub: 'Manage preferences', icon: <SettingsSlidersIcon />, onPress: () => router.push('/(dashboard)/preferences') },
    { id: 'shortcuts', title: 'App shortcuts', sub: 'Create shortcuts on home launcher', icon: <EditBoxIcon />, onPress: () => router.push('/(dashboard)/app-shortcuts') },
    { id: 'language', title: 'Language', sub: 'Change the app language', icon: <EditBoxIcon />, onPress: () => setLangModalVisible(true) },
    { id: 'notif_lang', title: 'Notification Language', sub: 'Change notification language', icon: <EditBoxIcon />, onPress: () => setLangModalVisible(true) },
  ];

  const OthersMenuItems = [
    { id: 'about', title: 'About', sub: '8.1.1', icon: <InfoIcon />, onPress: () => router.push('/(dashboard)/about') },
    { id: 'logout', title: 'Logout', icon: <LogoutIcon />, onPress: () => setLogoutModalVisible(true) },
    {
      id: 'delete',
      title: 'Delete Account',
      icon: <TrashIcon />,
      onPress: () => {
        setDeleteAccountStep('reason');
        setSelectedAccountReasons({});
        setOtherAccountReasonText('');
        setDeleteModalVisible(true);
      }
    },
  ];

  return (
    <GradientBackground style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        
        <View style={styles.header}>
          <TouchableOpacity activeOpacity={1} onPress={() => router.back()} style={styles.backButton}>
            <BackArrowIcon size={24} color="#0F172A" />
          </TouchableOpacity>
          <View style={styles.headerTitleBox}>
            <Text style={styles.headerTitle}>Settings</Text>
            <Text style={styles.headerSubtitle}>Edit the options</Text>
          </View>
          <TouchableOpacity activeOpacity={1} style={styles.helpButton} onPress={() => router.push('/(dashboard)/help-advanced')}>
            <Text style={styles.helpText}>Help</Text>
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          <Text style={styles.sectionTitle}>General</Text>
          <View style={styles.card}>
            {GeneralMenuItems.map((item, index) => (
              <View key={item.id}>
                <TouchableOpacity activeOpacity={1} style={styles.menuItem} onPress={item.onPress}>
                  <View style={styles.iconBox}>{item.icon}</View>
                  <View style={styles.menuTextBox}>
                    <Text style={styles.menuTitle}>{item.title}</Text>
                    {item.sub ? <Text style={styles.menuSub}>{item.sub}</Text> : null}
                  </View>
                  <ChevronRightIcon />
                </TouchableOpacity>
                {index < GeneralMenuItems.length - 1 && <View style={styles.divider} />}
              </View>
            ))}
          </View>

          <Text style={styles.sectionTitle}>Others</Text>
          <View style={styles.card}>
            {OthersMenuItems.map((item, index) => (
              <View key={item.id}>
                <TouchableOpacity activeOpacity={1} style={styles.menuItem} onPress={item.onPress}>
                  <View style={styles.iconBox}>{item.icon}</View>
                  <View style={styles.menuTextBox}>
                    <Text style={styles.menuTitle}>{item.title}</Text>
                    {item.sub ? <Text style={styles.menuSub}>{item.sub}</Text> : null}
                  </View>
                  <ChevronRightIcon />
                </TouchableOpacity>
                {index < OthersMenuItems.length - 1 && <View style={styles.divider} />}
              </View>
            ))}
          </View>

        </ScrollView>
      </SafeAreaView>

      <LanguageSelectModal 
        visible={langModalVisible}
        onClose={() => setLangModalVisible(false)}
        selectedLanguage={selectedLanguage}
        onSelectLanguage={setSelectedLanguage}
      />

      {/* Logout Confirmation Modal */}
      <Modal
        visible={logoutModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setLogoutModalVisible(false)}
      >
        <View style={styles.modalOverlayCenter}>
          <TouchableOpacity activeOpacity={1} 
            style={styles.modalBackdrop} 
            onPress={() => setLogoutModalVisible(false)} 
          />
          <View style={styles.logoutContent}>
            <Text style={styles.modalTitle}>Confirm Logout</Text>
            <Text style={styles.modalDesc}>Are you sure you want to log out of your account?</Text>
            <View style={styles.modalButtonsRow}>
              <TouchableOpacity activeOpacity={1} 
                style={[styles.modalButton, styles.cancelBtn]} 
                onPress={() => setLogoutModalVisible(false)}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={1} 
                style={[styles.modalButton, styles.confirmBtn]} 
                onPress={handleLogout}
              >
                <Text style={styles.confirmBtnText}>Yes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Delete Account Confirmation Modal */}
      <Modal
        visible={deleteModalVisible}
        transparent
        animationType={Platform.OS === 'web' ? 'fade' : 'slide'}
        onRequestClose={() => setDeleteModalVisible(false)}
      >
        <View style={styles.modalOverlayBottom}>
          <TouchableOpacity activeOpacity={1} 
            style={styles.modalBackdrop} 
            onPress={() => setDeleteModalVisible(false)} 
          />
          <View style={styles.deleteContent}>
            {Platform.OS !== 'web' && <View style={styles.dragHandle} />}
            <Text style={styles.modalTitle}>Delete Account</Text>

            {deleteAccountStep === 'reason' ? (
              <View>
                <Text style={styles.deleteSubTitle}>Please tell us why you are deleting your account:</Text>
                <View style={styles.reasonsContainer}>
                  {[
                    'No longer need the service',
                    'Found a better alternative',
                    'High pricing',
                    'App is too complex to use',
                    'Other reason'
                  ].map((reason) => (
                    <Checkbox
                      key={reason}
                      label={reason}
                      checked={!!selectedAccountReasons[reason]}
                      onChange={(checked) => {
                        setSelectedAccountReasons((prev) => ({ ...prev, [reason]: checked }));
                      }}
                    />
                  ))}
                </View>

                {selectedAccountReasons['Other reason'] && (
                  <Input
                    placeholder="Specify other reason..."
                    value={otherAccountReasonText}
                    onChangeText={setOtherAccountReasonText}
                    style={styles.reasonInput}
                  />
                )}

                <View style={styles.modalButtonsRow}>
                  <TouchableOpacity activeOpacity={1} 
                    style={[styles.modalButton, styles.cancelBtn]} 
                    onPress={() => setDeleteModalVisible(false)}
                  >
                    <Text style={styles.cancelBtnText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity activeOpacity={1} 
                    style={[styles.modalButton, styles.confirmBtn]} 
                    onPress={() => {
                      const hasSelected = Object.keys(selectedAccountReasons).some((k) => selectedAccountReasons[k]);
                      if (!hasSelected) {
                        Alert.alert('Validation Error', 'Please select at least one reason.');
                        return;
                      }
                      if (selectedAccountReasons['Other reason'] && !otherAccountReasonText.trim()) {
                        Alert.alert('Validation Error', 'Please specify the other reason.');
                        return;
                      }
                      setDeleteAccountStep('confirm');
                    }}
                  >
                    <Text style={styles.confirmBtnText}>Continue</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View>
                <Text style={[styles.modalDesc, { marginBottom: 20 }]}>
                  Warning: This action is permanent and will delete all your account data, branches, services, and employee records.
                </Text>
                <View style={styles.modalButtonsRow}>
                  <TouchableOpacity activeOpacity={1} 
                    style={[styles.modalButton, styles.cancelBtn]} 
                    onPress={() => setDeleteAccountStep('reason')}
                  >
                    <Text style={styles.cancelBtnText}>Back</Text>
                  </TouchableOpacity>
                  <TouchableOpacity activeOpacity={1} 
                    style={[styles.modalButton, styles.deleteConfirmBtn]} 
                    onPress={handleDeleteAccount}
                  >
                    <Text style={styles.confirmBtnText}>Yes, Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </View>
      </Modal>
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

  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#0F172A', marginBottom: 12, marginTop: 12 },

  card: { backgroundColor: '#FFFFFF', borderRadius: 24, overflow: 'hidden' },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  iconBox: { width: 32, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  menuTextBox: { flex: 1 },
  menuTitle: { fontSize: 13, fontWeight: '700', color: '#1E293B', marginBottom: 2 },
  menuSub: { fontSize: 11, color: '#94A3B8' },
  
  divider: { height: 1, backgroundColor: '#F1F5F9', marginLeft: 60, marginRight: 16 },
  modalOverlayCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  modalOverlayBottom: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    ...Platform.select({
      web: {
        justifyContent: 'center',
        alignItems: 'center',
      },
      default: {
        justifyContent: 'flex-end',
        alignItems: 'center',
      },
    }),
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  logoutContent: {
    width: '85%',
    maxWidth: 400,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    boxShadow: '0px 8px 32px rgba(15, 23, 42, 0.15)',
    elevation: 8,
  },
  deleteContent: {
    backgroundColor: '#FFFFFF',
    ...Platform.select({
      web: {
        width: '85%',
        maxWidth: 450,
        borderRadius: 24,
        padding: 24,
        boxShadow: '0px 8px 32px rgba(15, 23, 42, 0.15)',
        elevation: 8,
      },
      default: {
        width: '100%',
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        padding: 24,
        paddingBottom: Platform.OS === 'ios' ? 34 : 24,
      },
    }),
  },
  dragHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#CBD5E1',
    alignSelf: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalDesc: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
    marginBottom: 24,
    textAlign: 'center',
  },
  deleteSubTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 12,
    textAlign: 'left',
  },
  reasonsContainer: {
    marginBottom: 16,
  },
  reasonInput: {
    marginBottom: 16,
  },
  modalButtonsRow: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'center',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtn: {
    backgroundColor: '#F1F5F9',
  },
  cancelBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
  },
  confirmBtn: {
    backgroundColor: 'rgba(26, 15, 163, 1.00)',
  },
  deleteConfirmBtn: {
    backgroundColor: 'rgba(26, 15, 163, 1.00)',
  },
  confirmBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
