import React, { useState, useRef, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, Image, BackHandler, Animated, Dimensions, Switch, Modal, Alert } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { StorageService } from '@/services/storage.service';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import {
  MenuIcon, BellIcon, LocationPinIcon, WalletTabIcon,
  ServiceIcon, BookingsTabIcon, ReceiptIcon, DocumentIcon, InfoCircleIcon as InfoIcon,
  TrendingUpIcon, BranchIcon, EmployeeIcon, UserGroupIcon, BuildingIcon,
  StarIcon, ShieldIcon, RibbonIcon,
} from '@/components/ui/Icons';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { useAndroidBack } from '@/hooks/useAndroidBack';
import { useAuthStore } from '@/store/authStore';

const SCREEN_WIDTH = Dimensions.get('window').width;
const DRAWER_WIDTH = SCREEN_WIDTH * 0.68;

// ── inline SVG icons for drawer ──────────────────────────────────────────────
const ChevronRight = () => (
  <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
    <Path d="M9 18L15 12L9 6" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);
const CardIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
    <Rect x="2" y="5" width="20" height="14" rx="2" stroke="#64748B" strokeWidth="1.5" />
    <Path d="M2 10H22" stroke="#64748B" strokeWidth="1.5" />
  </Svg>
);
const HelpIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke="#64748B" strokeWidth="1.5" />
    <Path d="M9.09 9C9.33 8.33 9.79 7.77 10.4 7.41C11.01 7.05 11.73 6.92 12.43 7.04C13.13 7.16 13.76 7.52 14.22 8.06C14.67 8.61 14.92 9.29 14.92 10C14.92 12 11.92 13 11.92 13" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round" />
    <Path d="M12 17H12.01" stroke="#64748B" strokeWidth="2" strokeLinecap="round" />
  </Svg>
);
const ReferIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
    <Path d="M9 14L4 9L9 4" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M4 9H15C17.76 9 20 11.24 20 14C20 16.76 17.76 19 15 19H14" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);
const SliderIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
    <Path d="M4 21V14M4 10V3M12 21V12M12 8V3M20 21V16M20 12V3M2 14H6M10 8H14M18 16H22" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);
const InfoCircleIcon = ({ size = 16, color = '#3B82F6' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.5" />
    <Path d="M12 11V16M12 8H12.01" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </Svg>
);
const MappingIcon = ({ size = 24, color = '#3B82F6' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M3 7L9 4L15 7L21 4V17L15 20L9 17L3 20V7Z" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
    <Path d="M9 4V17M15 7V20" stroke={color} strokeWidth="1.5" />
  </Svg>
);
const HistoryIcon = ({ size = 24, color = '#3B82F6' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 8V12L14 14" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    <Path d="M3.05 11A9 9 0 1 0 4 7.4" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    <Path d="M3 4V8H7" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

// ── image assets for dashboard ───────────────────────────────────────────────
const performanceImg = require('@/assets/images/dashboard/performance.png');
const servicesImg = require('@/assets/images/dashboard/services.png');
const serviceAreaImg = require('@/assets/images/dashboard/service_area.png');
const liveBookingsImg = require('@/assets/images/dashboard/live_bookings.png');
const instructionsImg = require('@/assets/images/dashboard/instructions.png');
const bookingEarningsImg = require('@/assets/images/dashboard/booking_earnings.png');
const bookingHistoryImg = require('@/assets/images/dashboard/booking_history.png');
const businessImg = require('@/assets/images/dashboard/business.png');
const branchImg = require('@/assets/images/dashboard/branch.png');
const employeesImg = require('@/assets/images/dashboard/employees.png');
const employeeAssignImg = require('@/assets/images/dashboard/employee_assign.png');
const mappingImg = require('@/assets/images/dashboard/mapping.png');

const walletBalImg = require('@/assets/images/dashboard/wallet_bal.png');
const todaysEarnImg = require('@/assets/images/dashboard/todays_earn.png');
const totalEarnImg = require('@/assets/images/dashboard/total_earn.png');

// ── feature grids ─────────────────────────────────────────────────────────────
const ISP_FEATURES = [
  { label: 'Performance',      image: performanceImg, route: '/(dashboard)/performance' },
  { label: 'Services',         image: servicesImg,     route: '/(tabs)/services' },
  { label: 'Service Area',     image: serviceAreaImg, route: '/(tabs)/service-area' },
  { label: 'Live Bookings',    image: liveBookingsImg, route: '/(dashboard)/live-bookings' },
  { label: 'Instructions',     image: instructionsImg,        route: '/(dashboard)/instructions' },
  { label: 'Booking Earnings', image: bookingEarningsImg,     route: '/(dashboard)/earnings' },
];
const BS_FEATURES = [
  { label: 'Performance',               image: performanceImg,  route: '/(dashboard)/performance' },
  { label: 'Business',                  image: businessImg,    route: '/(dashboard)/business-details' },
  { label: 'Branch',                    image: branchImg,      route: '/(tabs)/branch' },
  { label: 'Employees',                 image: employeesImg,    route: '/(tabs)/employee' },
  { label: 'Services',                  image: servicesImg,     route: '/(tabs)/services' },
  { label: 'Service Area',              image: serviceAreaImg, route: '/(tabs)/service-area' },
  { label: 'Live Quotations',           image: liveBookingsImg,      route: '/(dashboard)/seller/quotation-requests' },
  { label: 'Live Orders',               image: liveBookingsImg, route: '/(dashboard)/live-bookings' },
  { label: 'Instructions',              image: instructionsImg,        route: '/(dashboard)/instructions' },
  { label: 'Branch & Service\nMapping', image: mappingImg,     route: '/(tabs)/mapping' },
  { label: 'Order Earnings',            image: bookingEarningsImg,     route: '/(dashboard)/booking-earnings' },
  { label: 'Order History',             image: bookingHistoryImg,     route: '/(dashboard)/order-history' },
  { label: 'Quotation\nHistory',        image: bookingHistoryImg,    route: '/(dashboard)/quotation-history' },
];
const BSP_FEATURES = [
  { label: 'Performance',       image: performanceImg,  route: '/(dashboard)/performance' },
  { label: 'Business',          image: businessImg,    route: '/(dashboard)/business-details' },
  { label: 'Branch',            image: branchImg,      route: '/(tabs)/branch' },
  { label: 'Employees',         image: employeesImg,    route: '/(tabs)/employee' },
  { label: 'Services',          image: servicesImg,     route: '/(tabs)/services' },
  { label: 'Service Area',      image: serviceAreaImg, route: '/(tabs)/service-area' },
  { label: 'Live Bookings',     image: liveBookingsImg, route: '/(dashboard)/live-bookings' },
  { label: 'Instructions',      image: instructionsImg,        route: '/(dashboard)/instructions' },
  { label: 'Employee Assign',   image: employeeAssignImg,   route: '/(tabs)/add-employee' },
  { label: 'Branch & Service\nMapping', image: mappingImg, route: '/(tabs)/mapping' },
  { label: 'Booking Earnings',  image: bookingEarningsImg,     route: '/(dashboard)/booking-earnings' },
  { label: 'Booking History',   image: bookingHistoryImg,     route: '/(dashboard)/booking-history' },
];

const SafetyShieldIcon = ({ size = 32, color = 'rgba(26, 15, 163, 1.00)' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3z" stroke={color} strokeWidth="2" strokeLinejoin="round" />
    <Path d="M9 12l2 2 4-4" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const ArrowRightSmallIcon = ({ size = 16, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M5 12h14M12 5l7 7-7 7" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export default function HomeScreen() {
  useAndroidBack(() => { BackHandler.exitApp(); });

  const router = useSafeRouter();
  const navigation = useNavigation();
  const { role, isOnDuty, setIsOnDuty, setLiveBookingMode } = useAuthStore();

  const [greetingName, setGreetingName] = useState('Eswar P');
  const [profileName, setProfileName] = useState('Ujjwal Kumar');
  const [profilePhone, setProfilePhone] = useState('9573447204');
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  
  const DEFAULT_AVATAR = 'https://i.pravatar.cc/150?u=partner';

  const loadProfileData = async () => {
    const profile = await StorageService.getPartnerProfile();
    const session = await StorageService.getUserSession();
    if (profile) {
      if (profile.firstName) {
        const full = `${profile.firstName} ${profile.lastName || ''}`.trim();
        setGreetingName(full);
        setProfileName(full);
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

  const insets = useSafeAreaInsets();
  const [isOnline, setIsOnline] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const translateX = useRef(new Animated.Value(-DRAWER_WIDTH)).current;

  // Reset drawer when screen loses focus (navigating away), so it's closed on return
  useFocusEffect(
    useCallback(() => {
      setLiveBookingMode(false);
      return () => {
        translateX.setValue(-DRAWER_WIDTH);
        setDrawerOpen(false);
      };
    }, [translateX])
  );

  const openDrawer = () => {
    setDrawerOpen(true);
    translateX.setValue(0);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    translateX.setValue(-DRAWER_WIDTH);
  };

  const navigateFrom = (route: string) => {
    closeDrawer();
    setTimeout(() => router.push(route as any), 220);
  };

  const getMenuItems = () => {
    const items: { id: string; title: string; icon: React.ReactNode; route: string }[] = [
      { id: 'status',        title: 'Partner Approval Status', icon: <CardIcon />,                              route: '/(dashboard)/application-status' },
      { id: 'help',          title: 'Help',                    icon: <HelpIcon />,                              route: '/(dashboard)/help-advanced' },
      { id: 'payment',       title: 'Payment',                 icon: <CardIcon />,                              route: '/(dashboard)/payment-method' },
      { id: 'bookings',      title: 'My Bookings',             icon: <BookingsTabIcon size={20} color="#64748B" />, route: '/(dashboard)/bookings' },
      { id: 'safety',        title: 'Safety',                  icon: <ShieldIcon size={20} color="#64748B" />,  route: '/(dashboard)/safety' },
      { id: 'refer',         title: 'Refer and Earn',          icon: <ReferIcon />,                             route: '/(dashboard)/referral' },
      { id: 'notifications', title: 'Notifications',           icon: <BellIcon size={20} color="#64748B" />,    route: '/(dashboard)/notifications' },
      { id: 'settings',      title: 'Settings',                icon: <SliderIcon />,                            route: '/(dashboard)/settings' },
      { id: 'earning',       title: 'My Earning',              icon: <ReceiptIcon size={20} color="#64748B" />, route: '/(dashboard)/earnings' },
      { id: 'rating',        title: 'My Rating',               icon: <StarIcon size={20} color="#64748B" />,    route: '/(dashboard)/my-rating' },
      { id: 'kyc',           title: 'KYC Documents',           icon: <CardIcon />,                              route: '/(tabs)/kyc' },
    ];
    if (role === 'ISP' || role === 'BSP') {
      items.push({ id: 'services',    title: 'Partner Service',      icon: <ServiceIcon size={20} color="#64748B" />,     route: '/(tabs)/services' });
      items.push({ id: 'servicearea', title: 'Service Area',         icon: <LocationPinIcon size={20} color="#64748B" />, route: '/(tabs)/service-area' });
    }
    if (role === 'BS') {
      items.push({ id: 'sellersvcs',  title: 'Seller Services',      icon: <ServiceIcon size={20} color="#64748B" />,     route: '/(tabs)/services' });
      items.push({ id: 'servicearea', title: 'Service Area',         icon: <LocationPinIcon size={20} color="#64748B" />, route: '/(tabs)/service-area' });
    }
    if (role === 'BSP' || role === 'BS') {
      items.push({ id: 'bizprof',  title: 'Business Profile',   icon: <CardIcon />, route: '/(auth)/business-profile' });
      items.push({ id: 'bizdocs',  title: 'Business Documents', icon: <CardIcon />, route: '/(dashboard)/business-details' });
      items.push({ id: 'bizbranch',title: 'Business Branch',    icon: <CardIcon />, route: '/(tabs)/branch' });
    }
    if (role === 'BSP') {
      items.push({ id: 'branchmap', title: 'Branch Mapping',       icon: <CardIcon />, route: '/(tabs)/mapping' });
      items.push({ id: 'employee',  title: 'Employee Management',   icon: <CardIcon />, route: '/(tabs)/employee' });
    }
    return items;
  };

  const FEATURES = role === 'BSP' ? BSP_FEATURES : role === 'BS' ? BS_FEATURES : ISP_FEATURES;

  return (
    <GradientBackground style={styles.container}>

      {/* Screen content — rendered first (below drawer in z-order) */}
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity activeOpacity={1} style={styles.menuButton} hitSlop={{ top: 16, bottom: 16, left: 16, right: 16 }} onPress={() => { console.log('hamburger pressed'); openDrawer(); }}>
            <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
              <Path d="M3 6H21M3 12H21M3 18H21" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" />
            </Svg>
          </TouchableOpacity>

          <View style={styles.profileSection}>
            <TouchableOpacity activeOpacity={0.8} onPress={handleSelectPhoto}>
              <Image source={{ uri: profilePhoto || DEFAULT_AVATAR }} style={styles.avatarImage} />
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={1} onPress={() => router.push('/(dashboard)/profile')}>
              <Text style={styles.greetingText}>Hi {greetingName}</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity activeOpacity={1}
            style={[styles.dutyToggle, isOnDuty && styles.dutyToggleOn]}
            onPress={() => { setIsOnDuty(!isOnDuty); if (!isOnDuty) router.push('/(dashboard)/account-status'); }}
          >
            {!isOnDuty && <View style={styles.dutyDot} />}
            <Text style={[styles.dutyText, isOnDuty && styles.dutyTextOn]}>{!isOnDuty ? 'OFF DUTY' : 'ON DUTY'}</Text>
            {isOnDuty && <View style={styles.dutyDotOn} />}
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={1} style={styles.iconButton} onPress={() => router.push('/(dashboard)/notifications')}>
            <BellIcon size={24} color="#0F172A" />
            <View style={styles.badge}><Text style={styles.badgeText}>3</Text></View>
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <View style={styles.mainContent}>
            {/* Features Container Card */}
            <View style={styles.quickActionsWrapper}>
              <View style={styles.quickActionsGrid}>
                {FEATURES.map((feature) => (
                  <TouchableOpacity activeOpacity={1}
                    key={feature.label}
                    style={styles.actionCard}
                    onPress={() => router.push(feature.route as any)}
                  >
                    <Image source={feature.image} style={styles.actionCardImage} />
                    <Text style={styles.actionCardText}>{feature.label}</Text>
                  </TouchableOpacity>
                ))}
                {/* Spacer views to left-align the last row when using space-between */}
                {Array.from({ length: (4 - (FEATURES.length % 4)) % 4 }).map((_, i) => (
                  <View key={`spacer-${i}`} style={[styles.actionCard, { backgroundColor: 'transparent', borderColor: 'transparent', elevation: 0 }]} />
                ))}
              </View>
            </View>

            {/* Bottom Wallet/Earnings Cards */}
            <View style={styles.cardsContainer}>
              <TouchableOpacity activeOpacity={1}
                style={styles.card}
                onPress={() => router.push('/(dashboard)/wallet')}
              >
                <Image source={walletBalImg} style={styles.cardImage} />
                <View style={styles.cardInfo}>
                  <Text style={styles.cardTitle} numberOfLines={1}>Wallet Bal</Text>
                  <Text style={styles.cardAmount} numberOfLines={1}>₹0</Text>
                </View>
                <ChevronRight />
              </TouchableOpacity>

              <TouchableOpacity activeOpacity={1}
                style={styles.card}
                onPress={() => router.push('/(dashboard)/earnings?filterType=today' as any)}
              >
                <Image source={todaysEarnImg} style={styles.cardImage} />
                <View style={styles.cardInfo}>
                  <Text style={styles.cardTitle} numberOfLines={1}>Today's Earn</Text>
                  <Text style={styles.cardAmount} numberOfLines={1}>₹0</Text>
                </View>
                <ChevronRight />
              </TouchableOpacity>

              <TouchableOpacity activeOpacity={1}
                style={styles.card}
                onPress={() => router.push('/(dashboard)/earnings?filterType=total' as any)}
              >
                <Image source={totalEarnImg} style={styles.cardImage} />
                <View style={styles.cardInfo}>
                  <Text style={styles.cardTitle} numberOfLines={1}>Total Earn</Text>
                  <Text style={styles.cardAmount} numberOfLines={1}>₹0</Text>
                </View>
                <ChevronRight />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.bottomSection}>
            <View style={styles.safetyRateCardContainer}>
              <View style={styles.safetyRateCardLeft}>
                <SafetyShieldIcon size={24} color="rgba(26, 15, 163, 1.00)" />
                <View style={styles.safetyRateCardTextCol}>
                  <Text style={styles.safetyRateCardTitle}>Your safety matters</Text>
                  <Text style={styles.safetyRateCardSub}>View your rate card and stay informed</Text>
                </View>
              </View>
              <TouchableOpacity activeOpacity={1} 
                style={styles.safetyRateCardBtn}
                onPress={() => router.push('/(dashboard)/rate-card')}
              >
                <Text style={styles.safetyRateCardBtnText}>View Rate Card</Text>
                <ArrowRightSmallIcon size={14} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
            <View style={styles.footerContainer}>
              <Text style={styles.footerText}>Powered by </Text>
              <Text style={styles.footerTextBold}>RIT Cloud Solutions pvt. ltd</Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* ── Drawer via Modal (guaranteed above everything) ── */}
      <Modal visible={drawerOpen} transparent animationType="none" onRequestClose={closeDrawer} statusBarTranslucent>
        <View style={StyleSheet.absoluteFill}>
          {/* Full backdrop */}
          <TouchableOpacity activeOpacity={1} style={StyleSheet.absoluteFill} onPress={closeDrawer}>
            <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.45)' }} />
          </TouchableOpacity>

          {/* Drawer panel — slides in from left */}
          <Animated.View style={[styles.drawer, { transform: [{ translateX }], paddingTop: insets.top }]}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
              {/* Profile row */}
              <View style={styles.drawerProfile}>
                <TouchableOpacity activeOpacity={0.8} onPress={handleSelectPhoto}>
                  <Image source={{ uri: profilePhoto || DEFAULT_AVATAR }} style={styles.drawerAvatar} />
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={1} style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }} onPress={() => navigateFrom('/(dashboard)/profile-details')}>
                  <View style={{ flex: 1, marginLeft: 8 }}>
                    <Text style={styles.drawerName}>{profileName}</Text>
                    <Text style={styles.drawerPhone}>{profilePhone}</Text>
                  </View>
                  <View style={styles.drawerRating}>
                    <Text style={styles.drawerRatingText}>5.0</Text>
                    <StarIcon size={12} color="#F97316" />
                  </View>
                  <ChevronRight />
                </TouchableOpacity>
              </View>

              {/* Online toggle */}
              <View style={styles.drawerToggle}>
                <Text style={styles.drawerToggleLabel}>Vendor is Online</Text>
                <Switch value={isOnline} onValueChange={setIsOnline} trackColor={{ false: '#CBD5E1', true: '#1A0FA3' }} thumbColor="#FFFFFF" />
              </View>

              {/* Menu */}
              <View style={styles.drawerMenu}>
                {getMenuItems().map((item, index, arr) => (
                  <View key={item.id}>
                    <TouchableOpacity activeOpacity={1} style={styles.drawerMenuItem} onPress={() => navigateFrom(item.route)}>
                      <View style={styles.drawerMenuIcon}>{item.icon}</View>
                      <Text style={styles.drawerMenuText}>{item.title}</Text>
                      <ChevronRight />
                    </TouchableOpacity>
                    {index < arr.length - 1 && <View style={styles.drawerDivider} />}
                  </View>
                ))}
              </View>
            </ScrollView>
          </Animated.View>
        </View>
      </Modal>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1, paddingHorizontal: 0 },

  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 16, zIndex: 1 },
  menuButton: { marginRight: 8, padding: 6, zIndex: 2 },
  profileSection: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  avatarImage: { width: 32, height: 32, borderRadius: 16, marginRight: 8 },
  greetingText: { fontSize: 11, fontWeight: '700', color: '#0F172A' },

  dutyToggle: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', borderRadius: 16, paddingHorizontal: 8, paddingVertical: 4, borderWidth: 1, borderColor: '#E2E8F0', marginRight: 8 },
  dutyToggleOn: { borderColor: '#22C55E' },
  dutyDot: { width: 14, height: 14, borderRadius: 7, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#CBD5E1', marginRight: 6 },
  dutyDotOn: { width: 14, height: 14, borderRadius: 7, backgroundColor: '#22C55E', marginLeft: 6 },
  dutyText: { fontSize: 9, fontWeight: '700', color: '#64748B' },
  dutyTextOn: { color: '#22C55E' },

  iconButton: { padding: 4, marginLeft: 2, position: 'relative' },
  badge: { position: 'absolute', top: 2, right: 2, backgroundColor: '#EF4444', width: 14, height: 14, borderRadius: 7, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#FFFFFF' },
  badgeText: { color: '#FFFFFF', fontSize: 8, fontWeight: '700' },

  scrollContent: { flexGrow: 1, paddingBottom: 16 },
  mainContent: { width: '100%' },
  bottomSection: { alignItems: 'center', paddingBottom: 0 },

  quickActionsWrapper: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingHorizontal: 12,
    paddingTop: 16,
    paddingBottom: 24,
    marginHorizontal: 8, // Wider container size
    marginTop: 16,
    marginBottom: 20,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: '23%',
    aspectRatio: 0.78,
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#1A0FA3', // Brand blue color
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 2,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  actionCardImage: {
    width: '96%',
    height: '62%',
    resizeMode: 'contain',
    marginTop: 2,
  },
  actionCardText: {
    fontSize: 9,
    color: '#0F172A',
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 11,
    marginBottom: 2,
  },

  cardsContainer: {
    paddingHorizontal: 16,
    flexDirection: 'row',
    gap: 6,
    marginBottom: 20,
  },
  card: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  cardImage: {
    width: 28,
    height: 28,
    marginRight: 4,
    resizeMode: 'contain',
  },
  cardInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 8,
    color: '#64748B',
    fontWeight: '600',
  },
  cardAmount: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 1,
  },

  safetyRateCardContainer: { 
    width: '92%',
    alignSelf: 'center',
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    backgroundColor: '#F4F8FF', 
    borderRadius: 12, 
    paddingVertical: 10,
    paddingHorizontal: 12, 
    marginTop: 6, 
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#EBF1FF'
  },
  safetyRateCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  safetyRateCardTextCol: {
    marginLeft: 10,
    flex: 1,
  },
  safetyRateCardTitle: {
    fontSize: 13,
    color: 'rgba(26, 15, 163, 1.00)',
    fontWeight: '700',
    marginBottom: 2,
  },
  safetyRateCardSub: {
    fontSize: 10,
    color: '#475569',
  },
  safetyRateCardBtn: {
    backgroundColor: 'rgba(26, 15, 163, 1.00)',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    gap: 4,
  },
  safetyRateCardBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
  },
  footerContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 20 },
  footerText: { fontSize: 10, color: '#94A3B8' },
  footerTextBold: { fontSize: 10, color: '#0F172A', fontWeight: '700' },

  // ── Drawer ──
  drawer: {
    position: 'absolute', top: 0, left: 0, bottom: 0,
    width: DRAWER_WIDTH, backgroundColor: '#F8FAFC',
    elevation: 24,
    shadowColor: '#000', shadowOffset: { width: 4, height: 0 }, shadowOpacity: 0.15, shadowRadius: 12,
  },
  drawerProfile: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 24, paddingBottom: 20, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  drawerAvatar: { width: 52, height: 52, borderRadius: 26, marginRight: 12, borderWidth: 2, borderColor: '#E2E8F0' },
  drawerName: { fontSize: 14, fontWeight: '700', color: '#0F172A' },
  drawerPhone: { fontSize: 12, color: '#64748B', marginTop: 2 },
  drawerRating: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF7ED', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, marginRight: 10 },
  drawerRatingText: { fontSize: 12, fontWeight: '700', color: '#0F172A', marginRight: 4 },
  drawerToggle: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFFFFF', marginHorizontal: 16, marginTop: 14, padding: 14, borderRadius: 14, borderWidth: 1, borderColor: '#E2E8F0' },
  drawerToggleLabel: { fontSize: 13, fontWeight: '700', color: '#0F172A' },
  drawerMenu: { backgroundColor: '#FFFFFF', borderRadius: 16, marginHorizontal: 16, marginTop: 14, paddingVertical: 4 },
  drawerMenuItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14 },
  drawerMenuIcon: { width: 24, alignItems: 'center', marginRight: 14 },
  drawerMenuText: { flex: 1, fontSize: 13, color: '#334155', fontWeight: '500' },
  drawerDivider: { height: 1, backgroundColor: '#F1F5F9', marginLeft: 54, marginRight: 16 },
});
