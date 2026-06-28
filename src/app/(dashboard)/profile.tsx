import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Switch, Platform, Alert } from 'react-native';
import { useNavigation } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { StorageService } from '@/services/storage.service';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { HozifyIDCardModal } from '@/components/common/HozifyIDCardModal';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import { StarIcon, ShieldIcon, RibbonIcon, BellIcon, LocationPinIcon } from '@/components/ui/Icons';
import { BookingRequestModal } from '@/components/common/BookingRequestModal';
import { useAndroidBack } from '@/hooks/useAndroidBack';

const ChevronRightIcon = ({ size = 16, color = '#94A3B8' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M9 18L15 12L9 6" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const HelpOutlineIcon = ({ size = 20, color = '#64748B' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="1.5" />
    <Path d="M9.09 9C9.3251 8.33167 9.78915 7.76811 10.4 7.40913C11.0108 7.05016 11.7289 6.91894 12.4272 7.03871C13.1255 7.15849 13.7588 7.52152 14.2151 8.06353C14.6713 8.60553 14.9211 9.29152 14.92 10C14.92 12 11.92 13 11.92 13" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M12 17H12.01" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const CardIcon = ({ size = 20, color = '#64748B' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="2" y="5" width="20" height="14" rx="2" stroke={color} strokeWidth="1.5" />
    <Path d="M2 10H22" stroke={color} strokeWidth="1.5" />
  </Svg>
);

const ListIcon = ({ size = 20, color = '#64748B' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M8 6H20M8 12H20M8 18H20M3 6H3.01M3 12H3.01M3 18H3.01" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const ArrowRightCurveIcon = ({ size = 20, color = '#64748B' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M9 14L4 9L9 4" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M4 9H15C17.7614 9 20 11.2386 20 14C20 16.7614 17.7614 19 15 19H14" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const PuzzleIcon = ({ size = 20, color = '#64748B' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 2C12 2 15 2 15 5C15 8 12 8 12 8V12H8C8 12 8 15 5 15C2 15 2 12 2 12V6C2 4.89543 2.89543 4 4 4H10C10 4 10 2 12 2Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M22 12C22 12 22 15 19 15C16 15 16 12 16 12H12V16C12 16 15 16 15 19C15 22 12 22 12 22C12 22 10 22 10 20C10 18 12 18 12 18V12H16C16 12 16 10 19 10C22 10 22 12 22 12Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const SettingsSlidersIcon = ({ color = '#64748B' }) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path d="M4 21V14M4 10V3M12 21V12M12 8V3M20 21V16M20 12V3M2 14H6M10 8H14M18 16H22" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

import { useAuthStore } from '@/store/authStore';

export default function ProfileScreen() {
  const router = useSafeRouter();
  const navigation = useNavigation();
  useAndroidBack();
  const role = useAuthStore(state => state.role);
  const [isOnline, setIsOnline] = useState(true);
  const [bookingModalVisible, setBookingModalVisible] = useState(false);
  const [idCardVisible, setIdCardVisible] = useState(false);

  const [profileName, setProfileName] = useState('Ujjwal Kumar');
  const [profilePhone, setProfilePhone] = useState('9573447204');
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);

  const DEFAULT_AVATAR = 'https://i.pravatar.cc/150?u=partner';

  const loadProfileData = async () => {
    const profile = await StorageService.getPartnerProfile();
    const session = await StorageService.getUserSession();
    if (profile) {
      if (profile.firstName || profile.lastName) {
        setProfileName(`${profile.firstName || ''} ${profile.lastName || ''}`.trim());
      }
      if (profile.profilePhoto) {
        setProfilePhoto(profile.profilePhoto);
      }
    }
    if (session?.phone) {
      setProfilePhone(session.phone);
    } else {
      const authPhone = useAuthStore.getState().mobileNumber;
      if (authPhone) setProfilePhone(authPhone);
    }
  };

  useEffect(() => {
    loadProfileData();
    const unsubscribe = navigation.addListener('focus', loadProfileData);
    return unsubscribe;
  }, [navigation]);

  const handleSelectPhoto = async () => {
    Alert.alert(
      'Upload Profile Picture',
      'Choose an option to upload your photo',
      [
        {
          text: 'Camera',
          onPress: handleTakePhoto,
        },
        {
          text: 'Gallery',
          onPress: handlePickPhotoFromLibrary,
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    );
  };

  const handleTakePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please allow camera access to take a photo.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setProfilePhoto(uri);
      await saveProfilePhoto(uri);
    }
  };

  const handlePickPhotoFromLibrary = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please allow gallery access to upload a profile photo.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setProfilePhoto(uri);
      await saveProfilePhoto(uri);
    }
  };

  const saveProfilePhoto = async (uri: string) => {
    const profile = await StorageService.getPartnerProfile() || {};
    await StorageService.setPartnerProfile({
      ...profile,
      profilePhoto: uri
    });
  };

  const getMenuItems = () => {
    let items = [
      { id: 'dev', title: 'Developer Tools (Mock)', icon: <SettingsSlidersIcon color="#EF4444" />, route: '/(dashboard)/developer-tools' },
      { id: 'status', title: 'Partner Approval Status', icon: <CardIcon />, route: '/(dashboard)/application-status' },
      { id: 'help', title: 'Help', icon: <HelpOutlineIcon />, route: '/(dashboard)/help-advanced' },
      { id: 'payment', title: 'Payment', icon: <CardIcon />, route: '/(dashboard)/payment-method' },
      { id: 'bookings', title: 'My Bookings', icon: <ListIcon />, route: '/(dashboard)/bookings' },
      { id: 'safety', title: 'Safety', icon: <ShieldIcon size={20} color="#64748B" />, route: '/(dashboard)/safety' },
      { id: 'refer', title: 'Refer and Earn', icon: <ArrowRightCurveIcon />, route: '/(dashboard)/referral' },
      { id: 'notifications', title: 'Notifications', icon: <BellIcon size={20} color="#64748B" />, route: '/(dashboard)/notifications' },
      { id: 'settings', title: 'Settings', icon: <SettingsSlidersIcon color="#64748B" />, route: '/(dashboard)/settings' },
      { id: 'earning', title: 'My earning', icon: <BellIcon size={20} color="#64748B" />, route: '/(dashboard)/earnings' },
      { id: 'rating', title: 'My Rating', icon: <StarIcon size={20} color="#64748B" />, route: '/(dashboard)/my-rating' },
      { id: 'idcard', title: 'Hozify ID Card', icon: <RibbonIcon size={20} color="#64748B" />, onPress: () => setIdCardVisible(true) },
      { id: 'kyc', title: 'KYC Documents', icon: <ShieldIcon size={20} color="#64748B" />, route: '/(tabs)/kyc' },
    ];

    if (role === 'ISP' || role === 'BSP') {
      items.push({ id: 'services', title: 'Partner Service', icon: <ListIcon />, route: '/(tabs)/services' });
      items.push({ id: 'servicearea', title: 'Partner Service Area', icon: <LocationPinIcon size={20} color="#64748B" />, route: '/(tabs)/service-area' });
    }
    
    if (role === 'BS') {
      items.push({ id: 'sellerservices', title: 'Seller Services', icon: <ListIcon />, route: '/(tabs)/services' });
      items.push({ id: 'servicearea', title: 'Service Area', icon: <LocationPinIcon size={20} color="#64748B" />, route: '/(tabs)/service-area' });
    }

    if (role === 'BSP' || role === 'BS') {
      items.push({ id: 'bizprof', title: 'Business Profile', icon: <CardIcon />, route: '/(auth)/business-profile' });
      items.push({ id: 'bizdocs', title: 'Business Documents', icon: <CardIcon />, route: '/(dashboard)/business-details' });
      items.push({ id: 'bizbranch', title: 'Business Branch', icon: <CardIcon />, route: '/(tabs)/branch' });
    }

    if (role === 'BSP') {
      items.push({ id: 'branchmap', title: 'Branch Mapping', icon: <CardIcon />, route: '/(tabs)/mapping' });
      items.push({ id: 'employee', title: 'Employee Management', icon: <CardIcon />, route: '/(tabs)/employee' });
    }

    return items;
  };

  const MENU_ITEMS = getMenuItems();

  const handleMenuPress = (route?: string, onPress?: () => void) => {
    if (onPress) {
      onPress();
    } else if (route) {
      router.push(route as any);
    }
  };

  return (
    <GradientBackground style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          <View style={styles.profileHeaderCard}>
            <TouchableOpacity activeOpacity={0.8} onPress={handleSelectPhoto} style={styles.profileAvatarContainer}>
              <Image source={{ uri: profilePhoto || DEFAULT_AVATAR }} style={styles.profileAvatar} />
              <View style={styles.plusBadge}>
                <Text style={styles.plusBadgeText}>+</Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity activeOpacity={1} onPress={() => router.push('/(dashboard)/profile-details')} style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>{profileName}</Text>
                <Text style={styles.profilePhone}>{profilePhone}</Text>
              </View>
              <View style={styles.ratingBadge}>
                <Text style={styles.ratingText}>5.0</Text>
                <StarIcon size={12} color="#F97316" />
              </View>
              <ChevronRightIcon size={20} color="#0F172A" />
            </TouchableOpacity>
          </View>

          <View style={styles.onlineToggleCard}>
            <Text style={styles.onlineToggleText}>Vendor is Online</Text>
            <Switch 
              value={isOnline} 
              onValueChange={setIsOnline} 
              trackColor={{ false: '#CBD5E1', true: 'rgba(26, 15, 163, 1.00)' }}
              thumbColor={'#FFFFFF'}
            />
          </View>

          {/* Test Booking Request Trigger */}
          <TouchableOpacity activeOpacity={1} onPress={() => setBookingModalVisible(true)} style={styles.testBtn}>
            <Text style={styles.testBtnText}>Simulate Booking Request (Test)</Text>
          </TouchableOpacity>

          <View style={styles.menuContainer}>
            {MENU_ITEMS.map((item, index) => (
              <View key={item.id}>
                <TouchableOpacity activeOpacity={1} onPress={() => handleMenuPress(item.route, item.onPress)} style={styles.menuItem}>
                  <View style={styles.menuIconBox}>{item.icon}</View>
                  <Text style={styles.menuItemText}>{item.title}</Text>
                  <ChevronRightIcon />
                </TouchableOpacity>
                {index < MENU_ITEMS.length - 1 && <View style={styles.divider} />}
              </View>
            ))}
          </View>

        </ScrollView>
      </SafeAreaView>

      <BookingRequestModal 
        visible={bookingModalVisible}
        onClose={() => setBookingModalVisible(false)}
      />
      <HozifyIDCardModal 
        visible={idCardVisible} 
        onClose={() => setIdCardVisible(false)} 
      />
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1,  },
  header: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 16 },
  headerTitle: { fontSize: 16, fontWeight: '700', color: '#0F172A' },

  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },

  profileHeaderCard: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  profileAvatarContainer: { position: 'relative', marginRight: 16 },
  profileAvatar: { width: 64, height: 64, borderRadius: 32, borderWidth: 2, borderColor: '#FFFFFF' },
  plusBadge: { position: 'absolute', right: 0, bottom: 0, width: 20, height: 20, borderRadius: 10, backgroundColor: '#0F172A', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#FFFFFF' },
  plusBadgeText: { color: '#FFFFFF', fontSize: 12, fontWeight: '700', lineHeight: 14 },
  
  profileInfo: { flex: 1 },
  profileName: { fontSize: 16, fontWeight: '700', color: '#0F172A', marginBottom: 2 },
  profilePhone: { fontSize: 12, color: '#64748B' },
  
  ratingBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, marginRight: 12, boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)', elevation: 2 },
  ratingText: { fontSize: 12, fontWeight: '700', color: '#0F172A', marginRight: 4 },

  onlineToggleCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFFFFF', padding: 16, borderRadius: 16, marginBottom: 24, boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.05)', elevation: 2 },
  onlineToggleText: { fontSize: 14, fontWeight: '700', color: '#0F172A' },

  testBtn: { backgroundColor: '#F3E8FF', padding: 12, borderRadius: 12, alignItems: 'center', marginBottom: 16 },
  testBtnText: { color: 'rgba(26, 15, 163, 1.00)', fontWeight: '600', fontSize: 12 },

  menuContainer: { backgroundColor: '#FFFFFF', borderRadius: 24, padding: 8 },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  menuIconBox: { width: 24, alignItems: 'center', marginRight: 16 },
  menuItemText: { flex: 1, fontSize: 13, color: '#334155' },
  divider: { height: 1, backgroundColor: '#F1F5F9', marginLeft: 56, marginRight: 16 },
});
