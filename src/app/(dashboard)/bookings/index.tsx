import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Platform, Modal, Switch } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { BackArrowIcon } from '@/components/ui/Icons';
import { useAndroidBack } from '@/hooks/useAndroidBack';
import { StorageService } from '@/services/storage.service';
import { useFocusEffect, useLocalSearchParams, useGlobalSearchParams } from 'expo-router';
import { Booking, UserSession, PartnerProfile } from '@/types/storage.types';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import { useAuthStore } from '@/store/authStore';

const SearchIcon = ({ size = 20, color = '#64748B' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="11" cy="11" r="7" stroke={color} strokeWidth="2" />
    <Path d="M20 20L16 16" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

const FilterIcon = ({ size = 18, color = 'rgba(26, 15, 163, 1.00)' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M4 6H20M7 12H17M10 18H14" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const CarIcon = ({ size = 16, color = '#64748B' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3C13 6.8 11.8 6 10.5 6H5C3.9 6 3 6.9 3 8v8c0 .6.4 1 1 1h2m3 0h6m5-5H3M7.5 20a2.5 2.5 0 100-5 2.5 2.5 0 000 5zm10 0a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const BikeIcon = ({ size = 22, color = '#334155' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M5.5 17a2.5 2.5 0 100-5 2.5 2.5 0 000 5zm13 0a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M8 17l1-4h5l2-4h2M10 9l1 4" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M14 5h3l1.5 3" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <Circle cx="17" cy="5" r="1" fill={color} />
  </Svg>
);

const ClockIcon = ({ size = 16, color = '#64748B' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="1.5" />
    <Path d="M12 6V12L16 14" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const UserIcon = ({ size = 16, color = '#64748B' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <Circle cx="12" cy="7" r="4" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const LocationIcon = ({ size = 16, color = '#64748B' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 21C16 16.8 19 12.8 19 9C19 5.13401 15.866 2 12 2C8.13401 2 5 5.13401 5 9C5 12.8 8 16.8 12 21Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <Circle cx="12" cy="9" r="2.5" stroke={color} strokeWidth="1.5" />
  </Svg>
);

const SnowflakeIcon = ({ size = 20, color = '#1D4ED8' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 2V22M12 12L19 19M12 12L5 5M12 12L5 19M12 12L19 5" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Path d="M9 4L12 7L15 4M15 20L12 17L9 20M20 9L17 12L20 15M4 15L7 12L4 9" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const WashingMachineIcon = ({ size = 20, color = '#059669' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="5" y="3" width="14" height="18" rx="2" stroke={color} strokeWidth="2" />
    <Circle cx="12" cy="13" r="4" stroke={color} strokeWidth="2" />
    <Circle cx="8" cy="6" r="1.5" fill={color} />
    <Circle cx="11" cy="6" r="1.5" fill={color} />
    <Path d="M5 9H19" stroke={color} strokeWidth="2" />
  </Svg>
);

const DropletIcon = ({ size = 20, color = '#C2410C' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 2C12 2 19 9 19 13C19 16.866 15.866 20 12 20C8.13401 20 5 16.866 5 13C5 9 12 2 12 2Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const VolumeOnIcon = ({ size = 20, color = '#64748B' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M11 5L6 9H2v6h4l5 4V5z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const VolumeOffIcon = ({ size = 20, color = '#64748B' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M11 5L6 9H2v6h4l5 4V5zM23 9l-6 6M17 9l6 6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const CheckIcon = ({ size = 16, color = '#64748B' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M20 6L9 17L4 12" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const CrossIcon = ({ size = 16, color = '#64748B' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M18 6L6 18M6 6l12 12" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

interface BookingDetails {
  serviceName: string;
  customerName: string;
  location: string;
  price: string;
  paymentLabel: string;
  paymentColor: string;
  serviceIcon: React.ReactNode;
  iconBg: string;
  dateStr: string;
  timeStr: string;
  subServices: string[];
}

export function BookingsScreenUI({ isLiveView = false }: { isLiveView?: boolean }) {
  const router = useSafeRouter();

  const [isNavigatingBack, setIsNavigatingBack] = useState(false);

  const handleBack = useCallback(() => {
    setIsNavigatingBack(true);
    // Give React a frame to clear the UI before starting the heavy transition
    requestAnimationFrame(() => {
      setTimeout(() => {
        router.back();
      }, 50);
    });
  }, [router]);

  useAndroidBack(handleBack);
  const { live } = useGlobalSearchParams<{ live?: string }>();
  const insets = useSafeAreaInsets();
  const { isOnDuty, setIsOnDuty, liveBookingMode } = useAuthStore();
  const [isSoundEnabled, setIsSoundEnabled] = useState(false);
  const [rejectedIds, setRejectedIds] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [session, setSession] = useState<UserSession | null>(null);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState('All');
  const [selectedPaymentType, setSelectedPaymentType] = useState('All');
  const [showPaymentTypeDropdown, setShowPaymentTypeDropdown] = useState(false);
  const [bookingPopupVisible, setBookingPopupVisible] = useState(false);
  const [popupBooking, setPopupBooking] = useState<Booking | null>(null);
  const [acceptedIds, setAcceptedIds] = useState<string[]>([]);
  const [sidebarView, setSidebarView] = useState<'new' | 'accepted' | 'rejected' | 'history'>('new');
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [selectedDetailsBooking, setSelectedDetailsBooking] = useState<Booking | null>(null);

  const TABS = isLiveView ? [
    { id: 'All', label: 'All', icon: null },
    { id: 'On the way', label: 'On the way', icon: (color: string) => <CarIcon size={16} color={color} /> },
    { id: 'Upcoming', label: 'Upcoming', icon: (color: string) => <ClockIcon size={16} color={color} /> }
  ] : [
    { id: 'All', label: 'All', icon: null },
    { id: 'Completed', label: 'Completed', icon: (color: string) => <CheckIcon size={16} color={color} /> },
    { id: 'Cancelled', label: 'Cancelled', icon: (color: string) => <CrossIcon size={16} color={color} /> }
  ];

  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        const s = await StorageService.getUserSession();
        setSession(s);

          const defaultDummies: Booking[] = [
          {
            bookingId: '#BK123455', userId: 'U1', serviceId: 'S1', branchId: 'BR1', employeeId: undefined, profAccepted: undefined,
            status: 'pending', paymentStatus: 'paid', paymentMethod: 'online', paymentLinkGenerated: false,
            checkInCode: '0000', completionOtp: '000000', scheduledTime: '5 May 2024 (Today)\n10:00 AM', location: 'A-101, Green Residency, Sector 45, Noida, UP - 201301', serviceRadius: 10
          },
          {
            bookingId: '#BK123456', userId: 'U1', serviceId: 'S1', branchId: 'BR1', employeeId: undefined, profAccepted: undefined,
            status: 'accepted', paymentStatus: 'unpaid', paymentMethod: 'online', paymentLinkGenerated: false,
            checkInCode: '1234', completionOtp: '123456', scheduledTime: '5 May 2024 (Today)\n10:00 AM', location: 'A-101, Green Residency, Sector 45, Noida, UP - 201301', serviceRadius: 10
          },
          {
            bookingId: '#BK123457', userId: 'U2', serviceId: 'S2', branchId: 'BR1', employeeId: undefined, profAccepted: undefined,
            status: 'accepted', paymentStatus: 'paid', paymentMethod: 'online', paymentLinkGenerated: false,
            checkInCode: '4321', completionOtp: '654321', scheduledTime: '6 May 2024 (Tomorrow)\n11:30 AM', location: 'B-205, Sunshine Apartments, Sector 50, Noida, UP - 201301', serviceRadius: 15
          },
          {
            bookingId: '#BK123458', userId: 'U3', serviceId: 'S3', branchId: 'BR1', employeeId: undefined, profAccepted: undefined,
            status: 'accepted', paymentStatus: 'paid', paymentMethod: 'online', paymentLinkGenerated: true,
            checkInCode: '1111', completionOtp: '222222', scheduledTime: '7 May 2024\n04:00 PM', location: 'C-205, Galaxy Tower, Sector 76, Noida, UP - 201301', serviceRadius: 20
          },
          {
            bookingId: '#BK123459', userId: 'U4', serviceId: 'S1', branchId: 'BR1', employeeId: undefined, profAccepted: undefined,
            status: 'accepted', paymentStatus: 'paid', paymentMethod: 'online', paymentLinkGenerated: false,
            checkInCode: '5678', completionOtp: '987654', scheduledTime: '8 May 2024\n09:00 AM', location: 'D-312, Stellar Park, Sector 62, Noida, UP - 201301', serviceRadius: 12
          },
          {
            bookingId: 'B001', userId: 'U1', serviceId: 'S3', branchId: 'BR1', employeeId: undefined, profAccepted: undefined,
            status: 'completed', paymentStatus: 'paid', paymentMethod: 'online', paymentLinkGenerated: false,
            checkInCode: '1234', completionOtp: '123456', scheduledTime: '7 May 2024\n04:00 PM', location: 'A-101, Green Residency, Sector 45, Noida, UP - 201301', serviceRadius: 10
          },
          {
            bookingId: 'B002', userId: 'U2', serviceId: 'S1', branchId: 'BR1', employeeId: undefined, profAccepted: undefined,
            status: 'completed', paymentStatus: 'paid', paymentMethod: 'online', paymentLinkGenerated: false,
            checkInCode: '1234', completionOtp: '123456', scheduledTime: '8 May 2024\n09:00 AM', location: 'B-205, Sunshine Apartments, Sector 50, Noida, UP - 201301', serviceRadius: 15
          },
          {
            bookingId: 'B003', userId: 'U3', serviceId: 'S3', branchId: 'BR1', employeeId: undefined, profAccepted: undefined,
            status: 'completed', paymentStatus: 'paid', paymentMethod: 'online', paymentLinkGenerated: false,
            checkInCode: '1234', completionOtp: '123456', scheduledTime: '8 May 2024\n11:30 AM', location: 'C-205, Galaxy Tower, Sector 76, Noida, UP - 201301', serviceRadius: 20
          },
          {
            bookingId: 'B004', userId: 'U4', serviceId: 'S2', branchId: 'BR1', employeeId: undefined, profAccepted: undefined,
            status: 'denied', paymentStatus: 'unpaid', paymentMethod: null, paymentLinkGenerated: false,
            checkInCode: '1234', completionOtp: '123456', scheduledTime: '8 May 2024\n02:00 PM', location: 'D-312, Stellar Park, Sector 62, Noida, UP - 201301', serviceRadius: 12
          },
          {
            bookingId: 'B005', userId: 'U5', serviceId: 'S1', branchId: 'BR1', employeeId: undefined, profAccepted: undefined,
            status: 'denied', paymentStatus: 'unpaid', paymentMethod: null, paymentLinkGenerated: false,
            checkInCode: '1234', completionOtp: '123456', scheduledTime: '8 May 2024\n03:30 PM', location: 'E-401, Green View Apartments, Sector 62, Noida, UP - 201301', serviceRadius: 10
          },
          {
            bookingId: 'B006', userId: 'U2', serviceId: 'S2', branchId: 'BR1', employeeId: undefined, profAccepted: undefined,
            status: 'completed', paymentStatus: 'paid', paymentMethod: 'online', paymentLinkGenerated: false,
            checkInCode: '1234', completionOtp: '123456', scheduledTime: '11 Oct 2023\n11:30 AM', location: 'B-205, Sunshine Apartments, Sector 50, Noida, UP - 201301', serviceRadius: 15
          },
          {
            bookingId: 'B007', userId: 'U3', serviceId: 'S3', branchId: 'BR1', employeeId: undefined, profAccepted: undefined,
            status: 'denied', paymentStatus: 'unpaid', paymentMethod: null, paymentLinkGenerated: false,
            checkInCode: '1234', completionOtp: '123456', scheduledTime: '10 Oct 2023\n04:00 PM', location: 'C-205, Galaxy Tower, Sector 76, Noida, UP - 201301', serviceRadius: 20
          },
          {
            bookingId: 'B008', userId: 'U4', serviceId: 'S1', branchId: 'BR1', employeeId: undefined, profAccepted: undefined,
            status: 'denied', paymentStatus: 'unpaid', paymentMethod: null, paymentLinkGenerated: false,
            checkInCode: '1234', completionOtp: '123456', scheduledTime: '10 Oct 2023\n09:00 AM', location: 'D-312, Stellar Park, Sector 62, Noida, UP - 201301', serviceRadius: 12
          },
          {
            bookingId: 'ORD001', userId: 'U1', serviceId: 'S1', branchId: 'BR1', employeeId: undefined, profAccepted: undefined,
            status: 'completed', paymentStatus: 'paid', paymentMethod: 'online', paymentLinkGenerated: false,
            checkInCode: '1234', completionOtp: '123456', scheduledTime: '7 May 2024\n04:00 PM', location: 'A-101, Green Residency, Sector 45, Noida, UP - 201301', serviceRadius: 10
          },
          {
            bookingId: 'ORD002', userId: 'U2', serviceId: 'S1', branchId: 'BR1', employeeId: undefined, profAccepted: undefined,
            status: 'completed', paymentStatus: 'paid', paymentMethod: 'online', paymentLinkGenerated: false,
            checkInCode: '1234', completionOtp: '123456', scheduledTime: '8 May 2024\n09:00 AM', location: 'B-205, Sunshine Apartments, Sector 50, Noida, UP - 201301', serviceRadius: 15
          },
          {
            bookingId: 'ORD003', userId: 'U3', serviceId: 'S3', branchId: 'BR1', employeeId: undefined, profAccepted: undefined,
            status: 'denied', paymentStatus: 'unpaid', paymentMethod: null, paymentLinkGenerated: false,
            checkInCode: '1234', completionOtp: '123456', scheduledTime: '8 May 2024\n02:00 PM', location: 'C-205, Galaxy Tower, Sector 76, Noida, UP - 201301', serviceRadius: 20
          },
          {
            bookingId: 'ORD004', userId: 'U4', serviceId: 'S2', branchId: 'BR1', employeeId: undefined, profAccepted: undefined,
            status: 'denied', paymentStatus: 'unpaid', paymentMethod: null, paymentLinkGenerated: false,
            checkInCode: '1234', completionOtp: '123456', scheduledTime: '8 May 2024\n03:30 PM', location: 'D-312, Stellar Park, Sector 62, Noida, UP - 201301', serviceRadius: 12
          }
        ];

        const SEED_VERSION = 'v7';
        const seedKey = 'BOOKINGS_SEED_VERSION';
        const currentVersion = await StorageService.getItem(seedKey);

        let existing = await StorageService.getBookings();

        if (currentVersion !== SEED_VERSION) {
          // Seed version changed — wipe old data and start fresh
          existing = [];
          await StorageService.setItem(seedKey, SEED_VERSION);
        }

        const mergedBookings = defaultDummies.map(dummy => {
          const saved = existing.find(b => b.bookingId === dummy.bookingId);
          return saved ?? dummy;
        });
        await StorageService.setItem('BOOKINGS', mergedBookings);
        let bks = mergedBookings;

        if (s?.role === 'ISP') {
          bks = bks.filter(b => b.serviceRadius <= 25);
        } else if (s?.role === 'Professional') {
          bks = bks.filter(b => b.employeeId === 'EMP1');
        }

        setBookings(bks);

        if (isLiveView && isOnDuty) {
          const available = bks.filter(b => !rejectedIds.includes(b.bookingId) && !acceptedIds.includes(b.bookingId) && b.status === 'pending');
          if (available.length > 0) {
            setPopupBooking(available[0]);
            setSidebarView('new');
            setBookingPopupVisible(true);
          }
        }
      };
      loadData();
    }, [isLiveView, isOnDuty, router])
  );

  const getBookingDisplayDetails = (booking: Booking): BookingDetails => {
    let serviceName = booking.serviceId;
    let serviceIcon: React.ReactNode = <DropletIcon size={20} />;
    let iconBg = '#FFF7ED';
    let subServices: string[] = [];

    if (booking.serviceId === 'S1' || booking.serviceId.toLowerCase().includes('ac')) {
      serviceName = 'AC Repair';
      serviceIcon = <SnowflakeIcon size={20} />;
      iconBg = '#EFF6FF';
      subServices = ['Deep Cleaning', 'Gas Refilling', 'Filter Wash'];
    } else if (booking.serviceId === 'S2' || booking.serviceId.toLowerCase().includes('wash')) {
      serviceName = 'Washing Machine';
      serviceIcon = <WashingMachineIcon size={20} />;
      iconBg = '#F0FDF4';
      subServices = ['Motor Repair', 'Drum Cleaning', 'PCB Check'];
    } else if (booking.serviceId === 'S3' || booking.serviceId.toLowerCase().includes('ro')) {
      serviceName = 'RO Installation';
      serviceIcon = <DropletIcon size={20} />;
      iconBg = '#FFF7ED';
      subServices = ['Filter Change', 'Tank Cleaning', 'UV Lamp Check'];
    }

    const customerMap: Record<string, string> = {
      U1: 'Amit Kumar', U2: 'Priya Verma', U3: 'Neha Singh', U4: 'Rajesh Sharma', U5: 'Vikram Aditya',
    };
    const priceMap: Record<string, string> = {
      U1: '₹599', U2: '₹649', U3: '₹799', U4: '₹549', U5: '₹599',
    };

    const customerName = customerMap[booking.userId] ?? `User ${booking.userId}`;
    const price = priceMap[booking.userId] ?? '₹350';
    const paymentLabel = booking.paymentStatus === 'paid' ? 'Paid' : '';
    const paymentColor = booking.paymentStatus === 'paid' ? '#16A34A' : 'transparent';

    const schedParts = booking.scheduledTime.split('\n');
    const dateStr = schedParts[0] || '2 May 2024 (Today)';
    const timeStr = schedParts[1] || '10:00 AM';

    return { serviceName, customerName, location: booking.location, price, paymentLabel, paymentColor, serviceIcon, iconBg, dateStr, timeStr, subServices };
  };

  const handleDutyToggle = (value: boolean) => {
    setIsOnDuty(value);
    if (!value) {
      setIsSoundEnabled(false);
    }
    if (value && bookings.length > 0) {
      const available = bookings.filter(b => !rejectedIds.includes(b.bookingId) && !acceptedIds.includes(b.bookingId) && b.status === 'pending');
      if (available.length > 0) {
        setPopupBooking(available[0]);
        setSidebarView('new');
        setBookingPopupVisible(true);
      }
    }
  };

  const handleAccept = async () => {
    if (popupBooking) {
      const acceptedId = popupBooking.bookingId;
      const updated = { ...popupBooking, status: 'accepted' as const };
      await StorageService.saveBooking(updated);
      setBookings(prev => prev.map(b => b.bookingId === updated.bookingId ? updated : b));
      setAcceptedIds(prev => [...prev, acceptedId]);

      setBookingPopupVisible(false);
      router.push({
        pathname: '/(dashboard)/bookings/accepted-booking',
        params: { bookingId: acceptedId }
      } as any);
    } else {
      setBookingPopupVisible(false);
    }
  };

  const handleReject = () => {
    if (popupBooking) {
      setRejectedIds(prev => [...prev, popupBooking.bookingId]);
      // Move to next available new booking
      const remaining = bookings.filter(b => !rejectedIds.includes(b.bookingId) && !acceptedIds.includes(b.bookingId) && b.bookingId !== popupBooking.bookingId && b.status === 'pending');
      setPopupBooking(remaining[0] ?? null);
    }
  };

  const filteredBookings = isNavigatingBack ? [] : bookings.filter(booking => {
    if (isLiveView && rejectedIds.includes(booking.bookingId)) return false;
    const details = getBookingDisplayDetails(booking);
    const matchesSearch =
      booking.bookingId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      details.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      details.serviceName.toLowerCase().includes(searchQuery.toLowerCase());

    let matchesTab = true;
    if (isLiveView) {
      matchesTab =
        activeTab === 'All' ||
        (activeTab === 'On the way' && (booking.status === 'on_the_way' || booking.status === 'accepted' || booking.status === 'checked_in' || booking.status === 'started')) ||
        (activeTab === 'Upcoming' && booking.status === 'pending');
    } else {
      matchesTab =
        activeTab === 'All' ||
        (activeTab === 'Completed' && booking.status === 'completed') ||
        (activeTab === 'Cancelled' && (booking.status === 'denied' || booking.status === 'closed'));
    }

    const matchesPaymentStatus =
      selectedPaymentStatus === 'All' ||
      (selectedPaymentStatus === 'Paid' && booking.paymentStatus === 'paid') ||
      (selectedPaymentStatus === 'Pending' && booking.paymentStatus === 'unpaid') ||
      (selectedPaymentStatus === 'Partial Paid' && booking.paymentStatus === 'unpaid') ||
      (selectedPaymentStatus === 'Failed' && booking.paymentStatus === 'unpaid');

    const matchesPaymentType =
      selectedPaymentType === 'All' ||
      (selectedPaymentType === 'Online' && booking.paymentMethod === 'online');

    const matchesStatusType = isLiveView
      ? (booking.status !== 'completed' && booking.status !== 'denied' && booking.status !== 'closed')
      : (booking.status === 'completed' || booking.status === 'denied' || booking.status === 'closed');

    return matchesSearch && matchesTab && matchesPaymentStatus && matchesPaymentType && matchesStatusType;
  });

  const popupDetails = popupBooking ? getBookingDisplayDetails(popupBooking) : null;
  const isSidebarViewEmpty =
    (sidebarView === 'accepted' && bookings.filter(b => acceptedIds.includes(b.bookingId)).length === 0) ||
    (sidebarView === 'rejected' && bookings.filter(b => rejectedIds.includes(b.bookingId)).length === 0) ||
    (sidebarView === 'history');

  return (
    <GradientBackground style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity activeOpacity={1} onPress={handleBack} style={styles.backButton}>
            <BackArrowIcon size={24} color="#0F172A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {`${isOnDuty ? filteredBookings.length : 0} Bookings`}
          </Text>
          {isOnDuty && bookings.length > 0 && (
            <TouchableOpacity activeOpacity={1}
              style={styles.simulateBtn}
              onPress={() => {
                const available = bookings.filter(b => !rejectedIds.includes(b.bookingId) && b.status !== 'completed' && b.status !== 'denied');
                if (available.length > 0) { setPopupBooking(available[0]); setBookingPopupVisible(true); }
              }}
            >
              <Text style={styles.simulateBtnText}>Simulate</Text>
            </TouchableOpacity>
          )}
          {isOnDuty && (
            <TouchableOpacity activeOpacity={1}
              style={{ marginRight: 12, padding: 4 }}
              onPress={() => setIsSoundEnabled(!isSoundEnabled)}
            >
              {isSoundEnabled ? <VolumeOnIcon size={24} color="#1A0FA3" /> : <VolumeOffIcon size={24} color="#94A3B8" />}
            </TouchableOpacity>
          )}
          <TouchableOpacity activeOpacity={1}
            style={[styles.dutyBadge, isOnDuty ? styles.dutyBadgeOn : styles.dutyBadgeOff]}
            onPress={() => handleDutyToggle(!isOnDuty)}
          >
            <View style={[styles.dutyDot, { backgroundColor: isOnDuty ? '#FFFFFF' : '#94A3B8' }]} />
            <Text style={[styles.dutyBadgeText, isOnDuty ? styles.dutyBadgeTextOn : styles.dutyBadgeTextOff]}>
              {isOnDuty ? 'ON DUTY' : 'OFF DUTY'}
            </Text>
          </TouchableOpacity>
        </View>

        {!isOnDuty && isLiveView ? (
          /* Off Duty Empty State */
          <View style={styles.offDutyContainer}>
            <Text style={styles.offDutyText}>Go On-Duty to receive bookings.</Text>
            <View style={styles.offDutySwitchRow}>
              <Text style={styles.offDutySwitchLabel}>OFF DUTY</Text>
              <Switch
                value={isOnDuty}
                onValueChange={handleDutyToggle}
                trackColor={{ false: '#E2E8F0', true: '#22C55E' }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>
        ) : bookingPopupVisible ? (
          <View style={{ flex: 1 }} />
        ) : (
          /* On Duty — Orders List */
          <>
            {/* Search and Filter */}
            <View style={styles.searchFilterRow}>
              <View style={styles.searchContainer}>
                <SearchIcon size={20} color="#94A3B8" />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search by ID, customer name or service"
                  placeholderTextColor="#94A3B8"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
              </View>
              <TouchableOpacity activeOpacity={1} style={styles.filterBtn} onPress={() => setFilterModalVisible(true)}>
                <FilterIcon size={18} color="rgba(26, 15, 163, 1.00)" />
                <Text style={styles.filterBtnText}>Filter</Text>
              </TouchableOpacity>
            </View>

            {/* Tabs */}
            <View style={styles.tabsRow}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsScroll}>
                {TABS.map(tab => {
                  const isActive = activeTab === tab.id;
                  const iconColor = isActive ? '#FFFFFF' : '#64748B';
                  return (
                    <TouchableOpacity activeOpacity={1}
                      key={tab.id}
                      style={[styles.tabBtn, isActive ? styles.tabBtnActive : styles.tabBtnInactive]}
                      onPress={() => setActiveTab(tab.id)}
                    >
                      <View style={styles.tabContent}>
                        {tab.icon && <View style={styles.tabIconBox}>{tab.icon(iconColor)}</View>}
                        <Text style={[styles.tabText, isActive ? styles.tabTextActive : styles.tabTextInactive]}>
                          {tab.label}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>

            {/* Booking Cards */}
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
              {filteredBookings.map((booking) => {
                const display = getBookingDisplayDetails(booking);
                return (
                  <TouchableOpacity activeOpacity={1}
                    key={booking.bookingId}
                    style={styles.bookingCard}
                    onPress={() => {
                      if (isLiveView) {
                        router.push(`/(dashboard)/bookings/${booking.bookingId.replace('#', '')}` as any);
                      } else {
                        setSelectedDetailsBooking(booking);
                        setDetailsModalVisible(true);
                      }
                    }}
                  >
                    <View style={styles.cardHeader}>
                      <View style={[styles.serviceIconContainer, { backgroundColor: display.iconBg }]}>
                        {display.serviceIcon}
                      </View>
                      <View style={styles.serviceTextCol}>
                        <Text style={styles.serviceName}>{display.serviceName}</Text>
                        <Text style={styles.idText}>ID: {booking.bookingId}</Text>
                      </View>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.infoRow}>
                      <UserIcon size={16} color="#64748B" />
                      <Text style={styles.infoText}>{display.customerName}</Text>
                    </View>

                    <View style={styles.infoRowAlignTop}>
                      <LocationIcon size={16} color="#64748B" />
                      <Text style={styles.addressText}>{display.location}</Text>
                    </View>

                    <View style={styles.bottomBanner}>
                      <View>
                        <Text style={styles.bannerLabel}>Schedule</Text>
                        <Text style={styles.bannerValueDate}>{display.dateStr}</Text>
                        <Text style={styles.bannerValueTime}>{display.timeStr}</Text>
                      </View>
                      <View style={styles.alignRight}>
                        <Text style={styles.bannerLabel}>Payment</Text>
                        <Text style={styles.bannerValuePrice}>{display.price}</Text>
                        <Text style={[styles.paymentStatusText, { color: display.paymentColor }]}>
                          {display.paymentLabel}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.cardActionsRow}>
                      {isLiveView ? (
                        booking.status === 'pending' ? (
                          <>
                            <TouchableOpacity activeOpacity={1}
                              style={styles.cardRejectBtn}
                              onPress={() => {
                                setRejectedIds(prev => [...prev, booking.bookingId]);
                              }}
                            >
                              <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
                                <Path d="M5 12H19" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" />
                              </Svg>
                            </TouchableOpacity>
                            <TouchableOpacity activeOpacity={1}
                              style={styles.cardAcceptBtn}
                              onPress={async () => {
                                const updated = { ...booking, status: 'accepted' as const };
                                await StorageService.saveBooking(updated);
                                setBookings(prev => prev.map(b => b.bookingId === booking.bookingId ? updated : b));
                                router.push({
                                  pathname: '/(dashboard)/bookings/accepted-booking',
                                  params: { bookingId: booking.bookingId }
                                } as any);
                              }}
                            >
                              <Text style={styles.cardAcceptText}>Accept</Text>
                            </TouchableOpacity>
                          </>
                        ) : (booking.status === 'accepted' && !booking.employeeId) ? (
                          <TouchableOpacity activeOpacity={1}
                            style={styles.cardAcceptBtn}
                            onPress={() => {
                              router.push({
                                pathname: '/(dashboard)/bookings/assign-booking',
                                params: { bookingId: booking.bookingId }
                              } as any);
                            }}
                          >
                            <Text style={styles.cardAcceptText}>Assign Employee</Text>
                          </TouchableOpacity>
                        ) : (
                          <TouchableOpacity activeOpacity={1}
                            style={styles.cardAcceptBtn}
                            onPress={() => {
                              router.push(`/(dashboard)/bookings/${booking.bookingId.replace('#', '')}` as any);
                            }}
                          >
                            <Text style={styles.cardAcceptText}>View Details</Text>
                          </TouchableOpacity>
                        )
                      ) : (
                        <TouchableOpacity activeOpacity={1}
                          style={styles.cardAcceptBtn}
                          onPress={() => {
                            setSelectedDetailsBooking(booking);
                            setDetailsModalVisible(true);
                          }}
                        >
                          <Text style={styles.cardAcceptText}>View Details</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </>
        )}
      </SafeAreaView>

      {/* Live Booking Request Popup */}
      <Modal visible={bookingPopupVisible} animationType="none" transparent={false}>
        <GradientBackground style={{ flex: 1 }}>
          <View style={{ flex: 1, paddingTop: insets.top, paddingLeft: insets.left, paddingRight: insets.right }}>
            {/* Header inside popup modal */}
            <View style={styles.header}>
              <TouchableOpacity activeOpacity={1} onPress={() => {
                setBookingPopupVisible(false);
                router.replace('/(tabs)');
              }} style={styles.backButton}>
                <BackArrowIcon size={24} color="#0F172A" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>{`${bookings.filter(b => !rejectedIds.includes(b.bookingId) && !acceptedIds.includes(b.bookingId)).length} Bookings`}</Text>
              <TouchableOpacity activeOpacity={1} style={styles.simulateBtn} onPress={() => {
                const available = bookings.filter(b => !rejectedIds.includes(b.bookingId) && !acceptedIds.includes(b.bookingId) && b.status === 'pending');
                if (available.length > 0) { setPopupBooking(available[0]); setSidebarView('new'); }
              }}>
                <Text style={styles.simulateBtnText}>Simulate</Text>
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={1}
                style={{ marginRight: 12, padding: 4 }}
                onPress={() => setIsSoundEnabled(!isSoundEnabled)}
              >
                {isSoundEnabled ? <VolumeOnIcon size={24} color="#1A0FA3" /> : <VolumeOffIcon size={24} color="#94A3B8" />}
              </TouchableOpacity>
              <View style={[styles.dutyBadge, styles.dutyBadgeOn]}>
                <View style={[styles.dutyDot, { backgroundColor: '#FFFFFF' }]} />
                <Text style={[styles.dutyBadgeText, styles.dutyBadgeTextOn]}>ON DUTY</Text>
              </View>
            </View>
        <View style={styles.popupWrapper}>
          <View style={styles.popupRow}>
            {/* Left sidebar */}
            <View style={styles.popupSidebar}>
              <ScrollView
                style={{ flex: 1, width: '100%' }}
                contentContainerStyle={[
                  styles.popupSidebarContent,
                  { paddingBottom: insets.bottom + 20 }
                ]}
                showsVerticalScrollIndicator={false}
              >
                {/* NEW + badge — grouped as a single container */}
                <TouchableOpacity activeOpacity={1}
                  style={styles.sidebarTabNewContainer}
                  onPress={() => {
                    setSidebarView('new');
                    const avail = bookings.filter(b => !rejectedIds.includes(b.bookingId) && !acceptedIds.includes(b.bookingId));
                    setPopupBooking(avail[0] ?? null);
                  }}
                >
                  <Text style={[styles.sidebarTabNewText, sidebarView === 'new' && { color: '#1A0FA3' }]}>NEW</Text>
                  <View style={styles.sidebarNewBadge}>
                    <Text style={styles.sidebarNewBadgeText}>
                      {bookings.filter(b => !rejectedIds.includes(b.bookingId) && !acceptedIds.includes(b.bookingId)).length}
                    </Text>
                  </View>
                </TouchableOpacity>

                {/* Price bubbles — always visible */}
                {bookings.filter(b => !rejectedIds.includes(b.bookingId) && !acceptedIds.includes(b.bookingId)).map((b) => {
                  const d = getBookingDisplayDetails(b);
                  const isSelected = b.bookingId === popupBooking?.bookingId;
                  return (
                    <TouchableOpacity activeOpacity={1}
                      key={b.bookingId}
                      style={[styles.sidebarBubble, isSelected && styles.sidebarBubbleActive]}
                      onPress={() => {
                        setPopupBooking(b);
                        setSidebarView('new');
                      }}
                    >
                      <Text style={[styles.sidebarBubbleText, isSelected && styles.sidebarBubbleTextActive]}>
                        {d.price}
                      </Text>
                    </TouchableOpacity>
                  );
                })}

              </ScrollView>
            </View>

            {/* Right card */}
            <View style={[
              styles.popupCard,
              (sidebarView === 'accepted' || sidebarView === 'rejected' || sidebarView === 'history') && { borderColor: '#E2E8F0' },
              isSidebarViewEmpty && { flex: 0, flexGrow: 1, alignSelf: 'flex-start' },
              { marginBottom: insets.bottom + 16 }
            ]}>
              {/* Accepted list view */}
              {sidebarView === 'accepted' && (
                bookings.filter(b => acceptedIds.includes(b.bookingId)).length === 0 ? (
                  <View>
                    <Text style={styles.popupListHeading}>Accepted Bookings</Text>
                    <Text style={styles.popupEmptyText}>No accepted bookings yet</Text>
                  </View>
                ) : (
                  <ScrollView showsVerticalScrollIndicator={false}>
                    <Text style={styles.popupListHeading}>Accepted Bookings</Text>
                    {bookings.filter(b => acceptedIds.includes(b.bookingId)).map(b => {
                      const d = getBookingDisplayDetails(b);
                      return (
                        <TouchableOpacity activeOpacity={1}
                          key={b.bookingId}
                          style={styles.popupListItem}
                          onPress={() => {
                            router.push({
                              pathname: '/(dashboard)/bookings/accepted-booking',
                              params: { bookingId: b.bookingId }
                            } as any);
                            setTimeout(() => {
                              setBookingPopupVisible(false);
                            }, 500);
                          }}
                        >
                          <View style={styles.popupListItemLeft}>
                            <Text style={styles.popupListItemName}>{d.serviceName}</Text>
                            <Text style={styles.popupListItemSub}>{d.customerName}</Text>
                          </View>
                          <Text style={[styles.popupListItemPrice, { fontSize: 13, color: 'rgba(26, 15, 163, 1)' }]}>Assign To</Text>
                        </TouchableOpacity>
                      );
                    })}
                  </ScrollView>
                )
              )}
              {/* Rejected list view */}
              {sidebarView === 'rejected' && (
                bookings.filter(b => rejectedIds.includes(b.bookingId)).length === 0 ? (
                  <View>
                    <Text style={styles.popupListHeading}>Rejected Bookings</Text>
                    <Text style={styles.popupEmptyText}>No rejected bookings</Text>
                  </View>
                ) : (
                  <ScrollView showsVerticalScrollIndicator={false}>
                    <Text style={styles.popupListHeading}>Rejected Bookings</Text>
                    {bookings.filter(b => rejectedIds.includes(b.bookingId)).map(b => {
                      const d = getBookingDisplayDetails(b);
                      return (
                        <View key={b.bookingId} style={styles.popupListItem}>
                          <View style={styles.popupListItemLeft}>
                            <Text style={styles.popupListItemName}>{d.serviceName}</Text>
                            <Text style={styles.popupListItemSub}>{d.customerName}</Text>
                          </View>
                          <Text style={[styles.popupListItemPrice, { color: '#EF4444' }]}>{d.price}</Text>
                        </View>
                      );
                    })}
                  </ScrollView>
                )
              )}
              {/* History view */}
              {sidebarView === 'history' && (
                <View style={{ alignItems: 'center', paddingTop: 20 }}>
                  <Text style={styles.popupListHeading}>History</Text>
                  <Text style={styles.popupEmptyText}>No history available</Text>
                </View>
              )}
              {/* New booking card */}
              {sidebarView === 'new' && (!popupDetails ? null : <>
              {/* Service Header */}
              <View style={styles.cardHeader}>
                <View style={[styles.serviceIconContainer, { backgroundColor: popupDetails.iconBg }]}>
                  {popupDetails.serviceIcon}
                </View>
                <View style={styles.serviceTextCol}>
                  <Text style={styles.serviceName}>{popupDetails.serviceName}</Text>
                  <Text style={styles.idText}>ID: {popupBooking?.bookingId}</Text>
                </View>
                <View style={styles.distanceBadge}>
                  <LocationIcon size={12} color="#3B82F6" />
                  <Text style={styles.distanceText}>Distance: {((popupBooking?.serviceRadius ?? 0)).toFixed(1)}KM</Text>
                </View>
              </View>

              <View style={styles.divider} />

              {/* Customer Info */}
              <View style={styles.infoRow}>
                <UserIcon size={16} color="#64748B" />
                <Text style={styles.infoText}>{popupDetails.customerName}</Text>
              </View>

              {/* Location Address */}
              <View style={styles.infoRowAlignTop}>
                <LocationIcon size={16} color="#64748B" />
                <Text style={styles.addressText}>{popupBooking?.location}</Text>
              </View>

              {/* Schedule and Payment Banner */}
              <View style={styles.bottomBanner}>
                <View>
                  <Text style={styles.bannerLabel}>Schedule</Text>
                  <Text style={styles.bannerValueDate}>{popupDetails.dateStr}</Text>
                  <Text style={styles.bannerValueTime}>{popupDetails.timeStr}</Text>
                </View>
                <View style={styles.alignRight}>
                  <Text style={styles.bannerLabel}>Payment</Text>
                  <Text style={styles.bannerValuePrice}>{popupDetails.price}</Text>
                  <Text style={[styles.paymentStatusText, { color: popupDetails.paymentColor }]}>
                    {popupDetails.paymentLabel}
                  </Text>
                </View>
              </View>

              {/* Actions */}
              <View style={[styles.popupActionsRow, { marginTop: 16 }]}>
                <TouchableOpacity activeOpacity={1} style={styles.popupRejectBtn} onPress={handleReject}>
                  <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
                    <Path d="M5 12H19" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" />
                  </Svg>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={1} style={styles.popupAcceptBtn} onPress={handleAccept}>
                  <Text style={styles.popupAcceptText}>Accept</Text>
                </TouchableOpacity>
              </View>
              </>)}
            </View>
          </View>
        </View>
          </View>
        </GradientBackground>
      </Modal>

      {/* Centered Booking Details Popup Modal */}
      <Modal visible={detailsModalVisible} animationType="fade" transparent>
        <View style={styles.centerModalOverlay}>
          <View style={styles.centerModalContent}>
            {selectedDetailsBooking && (() => {
              const display = getBookingDisplayDetails(selectedDetailsBooking);
              const isCompleted = selectedDetailsBooking.status === 'completed';
              return (
                <>
                  <Text style={styles.centerModalTitle}>Booking Details</Text>
                  
                  <View style={styles.centerModalHeader}>
                    <View style={[styles.serviceIconContainer, { backgroundColor: display.iconBg, width: 48, height: 48 }]}>
                      {display.serviceIcon}
                    </View>
                    <View style={styles.serviceTextCol}>
                      <Text style={[styles.serviceName, { fontSize: 16 }]}>{display.serviceName}</Text>
                      <Text style={styles.idText}>ID: {selectedDetailsBooking.bookingId}</Text>
                    </View>
                    <View style={[styles.statusBadge, isCompleted ? styles.statusCompleted : styles.statusCancelled]}>
                      <Text style={[styles.statusBadgeText, isCompleted ? styles.statusCompletedText : styles.statusCancelledText]}>
                        {isCompleted ? 'COMPLETED' : 'CANCELLED'}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.modalDivider} />

                  <ScrollView showsVerticalScrollIndicator={false} style={styles.centerModalScroll}>
                    <View style={styles.detailItem}>
                      <Text style={styles.detailLabel}>Customer</Text>
                      <Text style={styles.detailValue}>{display.customerName}</Text>
                    </View>

                    <View style={styles.detailItem}>
                      <Text style={styles.detailLabel}>Address</Text>
                      <Text style={styles.detailValue}>{selectedDetailsBooking.location}</Text>
                    </View>

                    <View style={styles.detailItem}>
                      <Text style={styles.detailLabel}>Scheduled Date & Time</Text>
                      <Text style={styles.detailValue}>
                        {display.dateStr} at {display.timeStr}
                      </Text>
                    </View>

                    <View style={styles.detailItem}>
                      <Text style={styles.detailLabel}>Payment Details</Text>
                      <View style={styles.paymentInfoBox}>
                        <View style={styles.paymentRow}>
                          <Text style={styles.paymentLabelText}>Total Amount:</Text>
                          <Text style={styles.paymentValText}>{display.price}</Text>
                        </View>
                        <View style={styles.paymentRow}>
                          <Text style={styles.paymentLabelText}>Payment Status:</Text>
                          <Text style={[styles.paymentValText, { color: display.paymentColor || '#64748B' }]}>
                            {display.paymentLabel || 'Unpaid'}
                          </Text>
                        </View>
                        <View style={styles.paymentRow}>
                          <Text style={styles.paymentLabelText}>Payment Method:</Text>
                          <Text style={[styles.paymentValText, { textTransform: 'capitalize' }]}>
                            {selectedDetailsBooking.paymentMethod || 'N/A'}
                          </Text>
                        </View>
                      </View>
                    </View>

                    {display.subServices && display.subServices.length > 0 && (
                      <View style={styles.detailItem}>
                        <Text style={styles.detailLabel}>Sub-services</Text>
                        <View style={styles.subServicesGrid}>
                          {display.subServices.map((sub, i) => (
                            <View key={i} style={styles.subServiceTag}>
                              <Text style={styles.subServiceTagText}>{sub}</Text>
                            </View>
                          ))}
                        </View>
                      </View>
                    )}
                  </ScrollView>

                  <TouchableOpacity activeOpacity={1} style={styles.centerModalCloseBtn} onPress={() => setDetailsModalVisible(false)}>
                    <Text style={styles.centerModalCloseText}>Close</Text>
                  </TouchableOpacity>
                </>
              );
            })()}
          </View>
        </View>
      </Modal>

      {/* Filter Modal */}
      <Modal visible={filterModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheetContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filter Bookings</Text>
              <TouchableOpacity activeOpacity={1} style={styles.modalCloseBtn} onPress={() => setFilterModalVisible(false)}>
                <Text style={{ fontSize: 24, color: '#64748B', fontWeight: 'bold' }}>×</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSectionLabel}>Payment Status</Text>
            <View style={styles.chipsRow}>
              {['All', 'Paid', 'Pending', 'Partial Paid', 'Failed'].map(status => {
                const isSelected = selectedPaymentStatus === status;
                return (
                  <TouchableOpacity activeOpacity={1}
                    key={status}
                    style={[styles.chip, isSelected ? styles.chipSelected : styles.chipUnselected]}
                    onPress={() => setSelectedPaymentStatus(status)}
                  >
                    <Text style={[styles.chipText, isSelected ? styles.chipTextSelected : styles.chipTextUnselected]}>
                      {status}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text style={styles.modalSectionLabel}>Payment Type</Text>
            <TouchableOpacity activeOpacity={1}
              style={styles.dropdownTrigger}
              onPress={() => setShowPaymentTypeDropdown(!showPaymentTypeDropdown)}
            >
              <Text style={styles.dropdownTriggerText}>
                {selectedPaymentType === 'All' ? 'Select Payment Type' : selectedPaymentType}
              </Text>
              <Text style={styles.dropdownChevron}>▼</Text>
            </TouchableOpacity>

            {showPaymentTypeDropdown && (
              <View style={styles.dropdownMenu}>
                {['All', 'Online'].map(type => (
                  <TouchableOpacity activeOpacity={1}
                    key={type}
                    style={styles.dropdownItem}
                    onPress={() => { setSelectedPaymentType(type); setShowPaymentTypeDropdown(false); }}
                  >
                    <Text style={styles.dropdownItemText}>{type}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            <View style={styles.modalFooter}>
              <TouchableOpacity activeOpacity={1}
                style={styles.modalResetBtn}
                onPress={() => { setSelectedPaymentStatus('All'); setSelectedPaymentType('All'); setFilterModalVisible(false); }}
              >
                <Text style={styles.modalResetBtnText}>Reset</Text>
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={1} style={styles.modalApplyBtn} onPress={() => setFilterModalVisible(false)}>
                <Text style={styles.modalApplyBtnText}>Apply Filter</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },

  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 16, paddingBottom: 12 },
  backButton: { marginRight: 12 },
  headerTitle: { flex: 1, fontSize: 16, fontWeight: '700', color: '#0F172A' },
  simulateBtn: { borderWidth: 1.5, borderColor: 'rgba(26,15,163,1)', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6, marginRight: 8 },
  simulateBtnText: { fontSize: 12, fontWeight: '700', color: 'rgba(26,15,163,1)' },
  dutyBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, gap: 6 },
  dutyBadgeOn: { backgroundColor: '#22C55E' },
  dutyBadgeOff: { backgroundColor: '#F1F5F9', borderWidth: 1, borderColor: '#E2E8F0' },
  dutyDot: { width: 8, height: 8, borderRadius: 4 },
  dutyBadgeText: { fontSize: 11, fontWeight: '700' },
  dutyBadgeTextOn: { color: '#FFFFFF' },
  dutyBadgeTextOff: { color: '#64748B' },

  // Off duty empty state
  offDutyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40 },
  offDutyText: { fontSize: 16, color: '#334155', fontWeight: '500', marginBottom: 32, textAlign: 'center' },
  offDutySwitchRow: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#FFFFFF', paddingHorizontal: 20, paddingVertical: 14, borderRadius: 40, borderWidth: 1, borderColor: '#E2E8F0' },
  offDutySwitchLabel: { fontSize: 12, fontWeight: '700', color: '#64748B' },

  // Search & Filter
  searchFilterRow: { flexDirection: 'row', paddingHorizontal: 16, paddingBottom: 12, gap: 12, alignItems: 'center' },
  searchContainer: {
    flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF',
    borderRadius: 12, borderWidth: 1.5, borderColor: '#E2E8F0', paddingHorizontal: 12, height: 48,
  },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 13, color: '#0F172A', fontWeight: '500' },
  filterBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF',
    borderRadius: 12, borderWidth: 1.5, borderColor: '#E2E8F0', paddingHorizontal: 16, height: 48, gap: 8,
  },
  filterBtnText: { fontSize: 13, color: 'rgba(26, 15, 163, 1.00)', fontWeight: '700' },

  tabsRow: { marginBottom: 16 },
  tabsScroll: { paddingHorizontal: 16, gap: 8 },
  tabBtn: { paddingHorizontal: 18, paddingVertical: 8, borderRadius: 20, borderWidth: 1, minHeight: 38, justifyContent: 'center' },
  tabBtnActive: { backgroundColor: 'rgba(26, 15, 163, 1.00)', borderColor: 'rgba(26, 15, 163, 1.00)' },
  tabBtnInactive: { backgroundColor: '#FFFFFF', borderColor: '#E2E8F0' },
  tabContent: { flexDirection: 'row', alignItems: 'center' },
  tabIconBox: { marginRight: 6 },
  tabText: { fontSize: 12, fontWeight: '600' },
  tabTextActive: { color: '#FFFFFF' },
  tabTextInactive: { color: '#64748B' },

  scrollContent: { paddingHorizontal: 16, paddingBottom: 120 },

  bookingCard: {
    backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, marginBottom: 16,
    ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8 }, android: { elevation: 2 } })
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center' },
  serviceIconContainer: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  serviceTextCol: { flex: 1, marginLeft: 12 },
  serviceName: { fontSize: 14, fontWeight: '700', color: 'rgba(26, 15, 163, 1.00)', marginBottom: 2 },
  idText: { fontSize: 11, color: '#94A3B8', fontWeight: '500' },
  distanceBadge: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  distanceText: { fontSize: 11, fontWeight: '700', color: '#3B82F6' },
  divider: { height: 1, backgroundColor: '#F1F5F9', marginVertical: 12 },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  infoRowAlignTop: { flexDirection: 'row', alignItems: 'flex-start' },
  infoText: { marginLeft: 8, fontSize: 12, color: '#0F172A', fontWeight: '500' },
  addressText: { marginLeft: 8, fontSize: 12, color: '#64748B', flex: 1, lineHeight: 18 },
  bottomBanner: { marginTop: 12, backgroundColor: '#EFF6FF', borderRadius: 12, padding: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  bannerLabel: { fontSize: 10, color: '#64748B', fontWeight: '500', marginBottom: 4 },
  bannerValueDate: { fontSize: 12, fontWeight: '700', color: '#0F172A' },
  bannerValueTime: { fontSize: 11, color: '#64748B', marginTop: 1 },
  alignRight: { alignItems: 'flex-end' },
  bannerValuePrice: { fontSize: 16, fontWeight: '800', color: 'rgba(26, 15, 163, 1.00)', marginBottom: 2 },
  paymentStatusText: { fontSize: 9, fontWeight: '800' },
  cardActionsRow: { flexDirection: 'row', alignItems: 'center', marginTop: 12, gap: 12 },
  cardRejectBtn: { width: 48, height: 48, borderRadius: 24, borderWidth: 2, borderColor: '#EF4444', justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF' },
  cardAcceptBtn: { flex: 1, height: 48, backgroundColor: 'rgba(26, 15, 163, 1.00)', borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  cardAcceptText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },

  popupWrapper: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingTop: 20,
  },
  popupRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },

  // Sidebar
  popupSidebar: {
    width: 88,
    backgroundColor: 'rgba(219, 234, 254, 0.5)',
    alignSelf: 'stretch',
    borderRightWidth: 1,
    borderRightColor: '#E2E8F0',
  },
  popupSidebarContent: {
    alignItems: 'center',
    paddingTop: 14,
    gap: 28,
  },
  sidebarTabNewContainer: {
    alignItems: 'center',
    gap: 4,
  },
  sidebarTabNewText: { fontSize: 11, fontWeight: '800', color: '#475569', letterSpacing: 1 },
  sidebarNewBadge: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: '#EF4444', justifyContent: 'center', alignItems: 'center',
  },
  sidebarNewBadgeText: { color: '#FFFFFF', fontSize: 15, fontWeight: '800' },
  sidebarBubble: {
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center',
    borderWidth: 2, borderColor: '#E2E8F0',
  },
  sidebarBubbleActive: { borderColor: '#22C55E', borderWidth: 2.5 },
  sidebarBubbleText: { fontSize: 12, fontWeight: '700', color: '#334155' },
  sidebarBubbleTextActive: { color: '#1A0FA3' },
  sidebarStatusItem: { alignItems: 'center', gap: 3 },
  sidebarStatusIcon: {
    width: 42, height: 42, borderRadius: 21,
    borderWidth: 2, justifyContent: 'center', alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  sidebarStatusLabel: { fontSize: 10, color: '#475569', fontWeight: '600' },

  // Main card
  popupCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    borderWidth: 2.5,
    borderColor: '#22C55E',
    marginLeft: 12,
    marginRight: 12,
    marginBottom: 20,
  },
  popupGoToRow: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: '#F1F5F9', alignSelf: 'flex-start',
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, marginBottom: 14,
  },
  popupGoToText: { fontSize: 13, fontWeight: '700', color: '#475569' },
  popupServiceRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  popupVehicleIcon: {},
  popupServiceLabel: { flex: 1, fontSize: 16, fontWeight: '700', color: '#0F172A' },
  popupDistanceBadge: { backgroundColor: '#EFF6FF', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
  popupDistanceText: { fontSize: 11, fontWeight: '700', color: '#3B82F6' },
  popupPriceRow: { flexDirection: 'row', alignItems: 'baseline', marginBottom: 14 },
  popupPriceMain: { fontSize: 26, fontWeight: '800', color: '#1A0FA3' },
  popupPricePlus: { fontSize: 20, fontWeight: '700', color: '#1A0FA3' },
  popupPriceExtra: { fontSize: 22, fontWeight: '800', color: '#22C55E' },
  popupCardDivider: { height: 1, backgroundColor: '#F1F5F9', marginVertical: 10 },
  popupRouteRow: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  popupRouteLine: { width: 18, alignItems: 'center', paddingTop: 3 },
  popupDotBlue: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#334155' },
  popupRouteDash: { width: 2, height: 44, backgroundColor: '#CBD5E1', marginVertical: 2 },
  popupDotRed: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#EF4444' },
  popupRouteDetails: { flex: 1 },
  popupRouteStop: {},
  popupRouteKm: { fontSize: 13, fontWeight: '700', color: '#1A0FA3', marginBottom: 2 },
  popupRouteAddr: { fontSize: 12, color: '#475569', lineHeight: 18 },
  popupActionsRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  popupRejectBtn: {
    width: 54, height: 54, borderRadius: 27,
    borderWidth: 2, borderColor: '#EF4444',
    justifyContent: 'center', alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  popupAcceptBtn: {
    flex: 1, height: 54,
    backgroundColor: 'rgba(26, 15, 163, 1.00)',
    borderRadius: 14,
    justifyContent: 'center', alignItems: 'center',
  },
  popupAcceptText: { fontSize: 16, fontWeight: '700', color: '#FFFFFF' },
  popupListHeading: { fontSize: 13, fontWeight: '800', color: '#0F172A', marginBottom: 12 },
  popupEmptyText: { fontSize: 12, color: '#94A3B8', textAlign: 'center', marginTop: 8 },
  popupListItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  popupListItemLeft: { flex: 1 },
  popupListItemName: { fontSize: 13, fontWeight: '700', color: '#0F172A' },
  popupListItemSub: { fontSize: 11, color: '#64748B', marginTop: 2 },
  popupListItemPrice: { fontSize: 14, fontWeight: '800', color: '#1A0FA3' },

  // Filter modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.4)', justifyContent: 'flex-end' },
  modalSheetContainer: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, minHeight: 360, borderTopWidth: 1, borderTopColor: '#F1F5F9' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 18, fontWeight: '800', color: '#0F172A' },
  modalCloseBtn: { padding: 4 },
  modalSectionLabel: { fontSize: 13, fontWeight: '700', color: '#0F172A', marginTop: 16, marginBottom: 12 },
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  chip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1 },
  chipSelected: { backgroundColor: 'rgba(26, 15, 163, 1.00)', borderColor: 'rgba(26, 15, 163, 1.00)' },
  chipUnselected: { backgroundColor: '#FFFFFF', borderColor: '#E2E8F0' },
  chipText: { fontSize: 12, fontWeight: '600' },
  chipTextSelected: { color: '#FFFFFF' },
  chipTextUnselected: { color: '#64748B' },
  dropdownTrigger: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, marginBottom: 16 },
  dropdownTriggerText: { fontSize: 13, color: '#334155', fontWeight: '500' },
  dropdownChevron: { fontSize: 10, color: '#64748B' },
  dropdownMenu: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 12, paddingVertical: 4, marginBottom: 16, marginTop: -8 },
  dropdownItem: { paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F8FAFC' },
  dropdownItemText: { fontSize: 13, color: '#334155' },
  modalFooter: { flexDirection: 'row', gap: 16, marginTop: 24, borderTopWidth: 1, borderTopColor: '#F1F5F9', paddingTop: 16 },
  modalResetBtn: { flex: 1, height: 48, borderRadius: 14, borderWidth: 1, borderColor: '#CBD5E1', justifyContent: 'center', alignItems: 'center' },
  modalResetBtnText: { fontSize: 14, fontWeight: '700', color: '#64748B' },
  modalApplyBtn: { flex: 1, height: 48, borderRadius: 14, backgroundColor: 'rgba(26, 15, 163, 1.00)', justifyContent: 'center', alignItems: 'center' },
  modalApplyBtnText: { fontSize: 14, fontWeight: '700', color: '#FFFFFF' },

  // Center Details Modal
  centerModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  centerModalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    width: '100%',
    maxHeight: '80%',
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  centerModalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 16,
    textAlign: 'center',
  },
  centerModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginLeft: 'auto',
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  statusCompleted: {
    backgroundColor: '#DCFCE7',
  },
  statusCompletedText: {
    color: '#15803D',
  },
  statusCancelled: {
    backgroundColor: '#FEE2E2',
  },
  statusCancelledText: {
    color: '#B91C1C',
  },
  modalDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginBottom: 16,
  },
  centerModalScroll: {
    marginBottom: 20,
  },
  detailItem: {
    marginBottom: 16,
  },
  detailLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    lineHeight: 20,
  },
  paymentInfoBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    marginTop: 4,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  paymentLabelText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  paymentValText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
  },
  subServicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 4,
  },
  subServiceTag: {
    backgroundColor: '#EEF2FF',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  subServiceTagText: {
    color: '#4F46E5',
    fontSize: 11,
    fontWeight: '600',
  },
  centerModalCloseBtn: {
    backgroundColor: 'rgba(26, 15, 163, 1.00)',
    borderRadius: 14,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerModalCloseText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});

export default function BookingsScreen() {
  return <BookingsScreenUI isLiveView={false} />;
}
