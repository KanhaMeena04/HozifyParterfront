import { useSafeRouter } from '@/hooks/useSafeRouter';
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, Image, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useFocusEffect } from 'expo-router';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { BackArrowIcon } from '@/components/ui/Icons';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import { CancellationReasonModal } from '@/components/common/CancellationReasonModal';
import { ReportIssueModal } from '@/components/common/ReportIssueModal';
import { OTPModal } from '@/components/common/OTPModal';
import { UserLocationModal } from '@/components/common/UserLocationModal';
import { useAndroidBack } from '@/hooks/useAndroidBack';
import { StorageService } from '@/services/storage.service';
import { Booking, UserSession } from '@/types/storage.types';
import { useEmployeeStore } from '@/store/employeeStore';
import { useAuthStore } from '@/store/authStore';

// Custom high-fidelity inline SVG icons
const PhoneIcon = ({ color = 'rgba(26, 15, 163, 1.00)', size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1C10.61 21 3 13.39 3 4c0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.24 1.02l-2.21 2.2z" fill={color} />
  </Svg>
);

const MessageIcon = ({ color = 'rgba(26, 15, 163, 1.00)', size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M20 2H4C2.9 2 2 2.9 2 4v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" fill={color} />
  </Svg>
);

const MapPinIcon = ({ color = 'rgba(26, 15, 163, 1.00)', size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Circle cx="12" cy="10" r="3" stroke={color} strokeWidth="2" />
  </Svg>
);

const VerifiedBadgeIcon = ({ size = 16 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="rgba(26, 15, 163, 1.00)" />
  </Svg>
);

const MotorbikeIcon = ({ size = 20, color = '#2563EB' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="5" cy="18" r="3" stroke={color} strokeWidth="2" />
    <Circle cx="19" cy="18" r="3" stroke={color} strokeWidth="2" />
    <Path d="M12 18H5m14 0h-7m4-11l-3 4-2-1H5M12 7l1-2h2m-6 6v3" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const NavigateArrowIcon = ({ size = 12, color = '#0F172A' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 2L2 22l10-6 10 6L12 2z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const InfoCircleIcon = ({ size = 14, color = '#94A3B8' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="1.5" />
    <Path d="M12 16v-4m0-4h.01" stroke={color} strokeWidth="2" strokeLinecap="round" />
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

const LinkExternalIcon = ({ size = 12, color = 'rgba(26, 15, 163, 1.00)' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6m0 0v6m0-6L10 14" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export default function BookingDetailsScreen() {
  useAndroidBack();
  const router = useSafeRouter();
  const { id } = useLocalSearchParams();

  const [booking, setBooking] = useState<Booking | null>(null);
  const [session, setSession] = useState<UserSession | null>(null);
  
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [reportIssueModalVisible, setReportIssueModalVisible] = useState(false);
  const [mapModalVisible, setMapModalVisible] = useState(false);
  
  // Quotation and Order modals
  const [quoteModalVisible, setQuoteModalVisible] = useState(false);
  const [orderModalVisible, setOrderModalVisible] = useState(false);
  
  // OTP states
  const [otpModalVisible, setOtpModalVisible] = useState(false);
  const [otpLength, setOtpLength] = useState<4 | 6>(4);
  const [otpType, setOtpType] = useState<'check_in' | 'complete'>('check_in');

  const [profAccepted, setProfAccepted] = useState(false);
  const [materialRequest, setMaterialRequest] = useState<any>(null);
  const { employees } = useEmployeeStore();
  const storeRole = useAuthStore(state => state.role);
  const assignedEmployeeName = employees.find(e => e.id === booking?.employeeId)?.name || booking?.employeeId || 'Professional';
  const role = session?.role || storeRole;

  useFocusEffect(
    useCallback(() => {
      loadBooking();
    }, [id])
  );

  const loadBooking = async () => {
    const s = await StorageService.getUserSession();
    setSession(s);
    const bks = await StorageService.getBookings();
    const bk = bks.find(b => b.bookingId.replace('#', '') === id || b.bookingId === id);
    if (bk) {
      setBooking(bk);
      setProfAccepted(!!bk.profAccepted);
      const reqs = await StorageService.getMaterialRequests();
      const activeReq = reqs.find(r => r.bookingId === bk.bookingId);
      setMaterialRequest(activeReq || null);
    }
  };

  const handleAccept = async () => {
    if (!booking) return;
    const updated = { ...booking, status: 'accepted' as const };
    await StorageService.saveBooking(updated);
    setBooking({ ...updated });
  };

  const handleDeny = async () => {
    if (!booking) return;
    const updated = { ...booking, status: 'denied' as const };
    await StorageService.saveBooking(updated);
    router.back();
  };

  const handleCancelConfirm = async (reason: string) => {
    if (!booking) return;
    const updated = { ...booking, status: 'denied' as const }; // Keeping it within expected BookingStatus types
    await StorageService.saveBooking(updated);
    setBooking(updated);
    alert(`Booking cancelled successfully: ${reason}`);
    router.back();
  };

  const handleReportIssueSave = async (data: { category: string; details: string; photos: string[]; isCritical: boolean }) => {
    if (!booking) return;
    alert(`Issue reported successfully!\nCategory: ${data.category}\nDetails: ${data.details}\nCritical: ${data.isCritical ? 'Yes' : 'No'}\nPhotos: ${data.photos.length}`);
    setReportIssueModalVisible(false);
  };

  const handleCheckIn = () => {
    setOtpType('check_in');
    setOtpLength(4);
    setOtpModalVisible(true);
  };

  const handleStartFromMap = () => {
    setMapModalVisible(false);
    handleCheckIn();
  };

  const handleAssignPress = () => {
    if (!booking) return;
    router.push({
      pathname: '/(dashboard)/bookings/assign-booking',
      params: { bookingId: booking.bookingId }
    });
  };

  const handleAcceptAssignment = async () => {
    if (!booking) return;
    const updated = { ...booking, profAccepted: true };
    await StorageService.saveBooking(updated);
    setBooking(updated);
    setProfAccepted(true);
  };

  const handleDeclineAssignment = async () => {
    if (!booking) return;
    const updated = { ...booking, employeeId: undefined, profAccepted: false };
    await StorageService.saveBooking(updated);
    setBooking(updated);
    setProfAccepted(false);
    router.back();
  };

  const handleComplete = () => {
    if (!booking) return;
    if (booking.paymentStatus === 'paid') {
      setOtpType('complete');
      setOtpLength(4);
      setOtpModalVisible(true);
    } else {
      processOnlinePayment();
    }
  };

  const processOnlinePayment = async () => {
    if (!booking) return;
    alert('Simulating online payment link generation...');
    setTimeout(async () => {
      alert('Payment collected successfully online!');
      const updated = { ...booking, paymentMethod: 'online' as const, paymentStatus: 'paid' as const };
      await StorageService.saveBooking(updated);
      setBooking(updated);
      setOtpType('complete');
      setOtpLength(4);
      setOtpModalVisible(true);
    }, 2000);
  };

  const onOtpVerified = async () => {
    if (!booking) return;
    setOtpModalVisible(false);
    if (otpType === 'check_in') {
      const updated = { ...booking, status: 'checked_in' as const };
      await StorageService.saveBooking(updated);
      setBooking(updated);
      router.push({
        pathname: '/(dashboard)/invoice-summary',
        params: { bookingId: booking.bookingId }
      });
    } else {
      const updated = { ...booking, status: 'closed' as const };
      await StorageService.saveBooking(updated);
      await StorageService.addWalletTransaction(484.22, `Booking ${booking.bookingId} completion`);
      setBooking(updated);
      router.push({
        pathname: '/(dashboard)/job-completed',
        params: { bookingId: booking.bookingId }
      });
    }
  };

  if (!booking) {
    return (
      <GradientBackground style={styles.container}>
        <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
          <Text style={{ textAlign: 'center', marginTop: 40, color: '#0F172A', fontWeight: '700' }}>Loading...</Text>
        </SafeAreaView>
      </GradientBackground>
    );
  }

  // Dynamic details generator for Figma fields representation
  const getDetailedBookingData = (booking: Booking) => {
    let customerName = 'Amit Kumar';
    let customerId = 'CU87654321';
    let phone = '9876543210';
    let rating = '4.9';
    let category = 'Home Appliances';
    let serviceName = 'AC Repair';
    let cost = '₹599';
    let serviceCharge = '₹549';
    let convenienceFee = '₹30';
    let gst = '₹20';
    let earnings = '₹484.22';
    let serviceIcon = <SnowflakeIcon size={20} color="#1D4ED8" />;
    let iconBg = '#EFF6FF'; // light blue

    if (booking.serviceId === 'S2' || booking.serviceId.toLowerCase().includes('wash') || booking.serviceId.toLowerCase().includes('machine')) {
      serviceName = 'Washing Machine Repair';
      serviceIcon = <WashingMachineIcon size={20} color="#059669" />;
      iconBg = '#F0FDF4'; // light green
    } else if (booking.serviceId === 'S3' || booking.serviceId.toLowerCase().includes('ro') || booking.serviceId.toLowerCase().includes('install')) {
      serviceName = 'RO Installation';
      serviceIcon = <DropletIcon size={20} color="#C2410C" />;
      iconBg = '#FFF7ED'; // light orange
    }

    if (booking.bookingId.includes('123457')) {
      customerName = 'Priya Verma';
      customerId = 'CU87654322';
      phone = '9876543211';
      rating = '4.8';
      cost = '₹649';
      serviceCharge = '₹599';
      convenienceFee = '₹30';
      gst = '₹20';
      earnings = '₹526.22';
    } else if (booking.bookingId.includes('123458')) {
      customerName = 'Neha Singh';
      customerId = 'CU87654323';
      phone = '9876543212';
      rating = '4.7';
      cost = '₹799';
      serviceCharge = '₹749';
      convenienceFee = '₹30';
      gst = '₹20';
      earnings = '₹652.22';
    } else if (booking.bookingId.includes('123459')) {
      customerName = 'Rajesh Sharma';
      customerId = 'CU87654324';
      phone = '9876543213';
      rating = '4.6';
      cost = '₹549';
      serviceCharge = '₹499';
      convenienceFee = '₹30';
      gst = '₹20';
      earnings = '₹442.22';
    } else if (booking.bookingId.includes('123460')) {
      customerName = 'Vikram Aditya';
      customerId = 'CU87654325';
      phone = '9876543214';
      rating = '4.9';
      cost = '₹599';
      serviceCharge = '₹549';
      convenienceFee = '₹30';
      gst = '₹20';
      earnings = '₹484.22';
    }

    return {
      customerName,
      customerId,
      phone,
      rating,
      category,
      serviceName,
      cost,
      serviceCharge,
      convenienceFee,
      gst,
      earnings,
      serviceIcon,
      iconBg
    };
  };

  const extra = getDetailedBookingData(booking);
  const splitSched = booking.scheduledTime.split('\n');
  const dateStr = splitSched[0] || '2 May 2024 (Today)';
  const timeStr = splitSched[1] || '10:00 AM';

  // Determine timeline progress indicators
  const stepAccepted = booking.status !== 'pending';
  const stepOnWay = booking.status === 'on_the_way' || booking.status === 'accepted' || booking.status === 'checked_in' || booking.status === 'started' || booking.status === 'closed' || booking.status === 'completed';
  const stepArrived = booking.status === 'checked_in' || booking.status === 'started' || booking.status === 'closed' || booking.status === 'completed';
  const stepStartWork = booking.status === 'started' || booking.status === 'closed' || booking.status === 'completed';
  const stepCompleted = booking.status === 'closed' || booking.status === 'completed';

  return (
    <GradientBackground style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        
        {/* Navigation Header */}
        <View style={styles.header}>
          <TouchableOpacity activeOpacity={1} onPress={() => router.back()} style={styles.backButton}>
            <BackArrowIcon size={24} color="#0F172A" />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>Booking Details</Text>
            <Text style={styles.headerSubtitle}>AS SERVICE PARTNER</Text>
          </View>
        </View>

        <View style={styles.whitePopupWrapper}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <View style={styles.responsiveContent}>
            
            {/* Booking ID & Status Pill Banner */}
            <View style={styles.idStatusRow}>
              <View style={styles.idBadgeContainer}>
                <View style={styles.idLabelBadge}>
                  <Text style={styles.idLabelBadgeText}>Booking ID</Text>
                </View>
                <Text style={styles.idValueText}>{booking.bookingId}</Text>
              </View>
              
              <View style={[styles.statusBadge, { borderColor: '#3B82F6', backgroundColor: '#EFF6FF' }]}>
                <Text style={[styles.statusBadgeText, { color: '#3B82F6' }]}>
                  Distance: {(booking.serviceRadius ?? 0).toFixed(1)}KM
                </Text>
              </View>
            </View>

            <Text style={styles.bookedOnText}>Booked on 2 May 2024, 09:20 AM</Text>

            {/* Service Summary Card */}
            <View style={styles.card}>
              <View style={styles.serviceRow}>
                <View style={[styles.serviceIconWrap, { backgroundColor: extra.iconBg }]}>
                  {extra.serviceIcon}
                </View>
                <View style={styles.serviceCol}>
                  <Text style={styles.cardTitle}>{extra.serviceName}</Text>
                  <Text style={styles.categoryText}>
                    Category: <Text style={styles.categoryValue}>{extra.category}</Text>
                  </Text>
                </View>
                <View style={styles.priceCol}>
                  <Text style={styles.priceMainText}>{extra.cost}</Text>
                  {booking.paymentStatus === 'paid' && (
                    <Text style={[styles.priceLabelSub, { color: '#16A34A', fontWeight: '700' }]}>
                      PAID
                    </Text>
                  )}
                </View>
              </View>

            </View>

            {/* Customer Details Card */}
            <View style={styles.card}>
              <View style={styles.customerHeader}>
                <Image source={{ uri: 'https://i.pravatar.cc/150?img=11' }} style={styles.customerAvatar} />
                <View style={styles.customerMeta}>
                  <View style={styles.nameVerifiedRow}>
                    <Text style={styles.customerNameText}>{extra.customerName}</Text>
                    <VerifiedBadgeIcon size={16} />
                  </View>
                  <Text style={styles.customerIdText}>Customer ID: {extra.customerId}</Text>
                  <Text style={styles.customerPhoneText}>📞 {extra.phone}</Text>
                </View>
                
                <View style={styles.customerActionIcons}>
                  <TouchableOpacity activeOpacity={1} style={styles.actionCircleBtn} onPress={() => alert(`Calling ${extra.customerName}...`)}>
                    <PhoneIcon size={16} />
                  </TouchableOpacity>
                  <TouchableOpacity activeOpacity={1} style={styles.actionCircleBtn} onPress={() => router.push(`/(dashboard)/chat`)}>
                    <MessageIcon size={16} />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.cardDivider} />

              {/* Date & Time block */}
              <View style={styles.dateTimeRow}>
                <View style={styles.dateTimeCol}>
                  <Text style={styles.dateTimeLabel}>DATE</Text>
                  <Text style={styles.dateTimeValue}>{dateStr}</Text>
                  <Text style={styles.dateTimeSub}>(Today)</Text>
                </View>
                <View style={styles.dateTimeCol}>
                  <Text style={styles.dateTimeLabel}>TIME</Text>
                  <Text style={styles.dateTimeValue}>{timeStr}</Text>
                </View>
              </View>

              <View style={styles.cardDivider} />

              {/* Service Address */}
              <View style={styles.addressSection}>
                <View style={styles.addressHeaderRow}>
                  <Text style={styles.addressLabel}>SERVICE ADDRESS</Text>
                </View>
                <Text style={styles.addressDetailsText}>{booking.location}</Text>
              </View>

              {/* ETA Warning alert box */}
              {(booking.status === 'accepted' || booking.status === 'on_the_way') && (
                <View style={styles.etaAlertBox}>
                  <MotorbikeIcon size={22} color="#2563EB" />
                  <View style={styles.etaAlertTextCol}>
                    <Text style={styles.etaAlertTitle}>Estimated arrival: 09:55 AM</Text>
                    <Text style={styles.etaAlertSub}>You are on the way to customer location</Text>
                  </View>
                  <TouchableOpacity activeOpacity={1} style={styles.navigateMiniBtn} onPress={() => setMapModalVisible(true)}>
                    <NavigateArrowIcon size={10} color="#0F172A" />
                    <Text style={styles.navigateMiniText}>NAVIGATE</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/* Current Status Checklist Timeline — BSP and ISP */}
            {(role === 'BSP' || role === 'ISP') && <View style={styles.card}>
              <Text style={styles.sectionHeading}>CURRENT STATUS</Text>
              
              {/* Custom Timeline visual — matches image */}
              {(() => {
                const steps = [stepAccepted, stepOnWay, stepArrived, stepStartWork, stepCompleted];
                const labels = ['Accepted', 'On the way', 'Arrived', 'Start Work', 'Completed'];
                // current = last active step index
                const currentIdx = steps.lastIndexOf(true);
                return (
                  <View style={styles.timelineVisualContainer}>
                    {/* Timeline: dots row with connecting lines between each pair */}
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                      {steps.map((active, idx) => {
                        const isDone = active && idx < currentIdx;
                        const isCurrent = idx === currentIdx && active;
                        const lineActive = idx < currentIdx && steps[idx] && steps[idx + 1];
                        return (
                          <React.Fragment key={idx}>
                            <View style={[
                              styles.tlDot,
                              isDone && { backgroundColor: '#22C55E', borderColor: '#22C55E' },
                              isCurrent && { backgroundColor: '#22C55E', borderColor: '#22C55E' },
                            ]}>
                              {isDone && (
                                <Svg width={12} height={12} viewBox="0 0 24 24" fill="none">
                                  <Path d="M20 6L9 17l-5-5" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                                </Svg>
                              )}
                              {isCurrent && <MotorbikeIcon size={12} color="#FFFFFF" />}
                            </View>
                            {idx < steps.length - 1 && (
                              <View style={{ flex: 1, height: 2, backgroundColor: lineActive ? '#22C55E' : '#CBD5E1' }} />
                            )}
                          </React.Fragment>
                        );
                      })}
                    </View>
                    <View style={styles.tlLabelsRow}>
                      {labels.map((lbl, idx) => (
                        <Text key={idx} style={[
                          styles.tlLabel,
                          idx === currentIdx && { color: '#0F172A', fontWeight: '700' }
                        ]}>{lbl}</Text>
                      ))}
                    </View>
                  </View>
                );
              })()}

              {/* Context Action Area inside Status card */}
              <View style={styles.timelineContentArea}>
                <View style={styles.statusInfoBox}>
                  <MotorbikeIcon size={22} color="rgba(26, 15, 163, 1.00)" />
                  <View style={styles.etaAlertTextCol}>
                    <Text style={styles.statusDescriptionTitle}>
                      {booking.status === 'pending' ? 'Pending Acceptance' : (booking.status === 'accepted' || booking.status === 'on_the_way') ? 'You are on the way' : booking.status === 'checked_in' ? 'Arrived at location' : 'Job Completed'}
                    </Text>
                    <Text style={styles.statusDescriptionText}>
                      {booking.status === 'pending' ? 'Please review quotation and accept.' : (booking.status === 'accepted' || booking.status === 'on_the_way') ? 'Please reach customer location and mark as arrived.' : booking.status === 'checked_in' ? 'Perform service check and begin work.' : 'The booking has been completed.'}
                    </Text>
                  </View>
                </View>
                
                {(booking.status === 'pending' || booking.status === 'accepted' || booking.status === 'on_the_way') && (
                  <>
                    <Text style={styles.nextStepTextLabel}>NEXT STEP</Text>
                    <Text style={styles.nextStepActionTitle}>
                      {booking.status === 'pending' ? 'Accept Booking' : 'Mark as Arrived'}
                    </Text>
                  </>
                )}

                {booking.status === 'pending' && role === 'ISP' && (
                  <View style={styles.actionBtnGroupInline}>
                    <TouchableOpacity activeOpacity={1} style={styles.primaryActionButton} onPress={handleAccept}>
                      <Text style={styles.primaryActionButtonText}>Accept Booking</Text>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={1} style={styles.secondaryActionButton} onPress={handleDeny}>
                      <Text style={styles.secondaryActionButtonText}>Decline</Text>
                    </TouchableOpacity>
                  </View>
                )}

                {(booking.status === 'accepted' || booking.status === 'on_the_way') && role === 'ISP' && (
                  <TouchableOpacity activeOpacity={1} style={[styles.primaryActionButton, { flex: 0, width: '100%' }]} onPress={handleCheckIn}>
                    <MapPinIcon color="#FFFFFF" size={16} />
                    <Text style={styles.primaryActionButtonText}>Mark Arrived</Text>
                  </TouchableOpacity>
                )}

                {booking.status === 'pending' && role !== 'ISP' && (
                  <View style={styles.actionBtnGroupInline}>
                    <TouchableOpacity activeOpacity={1} style={styles.primaryActionButton} onPress={handleAccept}>
                      <Text style={styles.primaryActionButtonText}>Accept Booking</Text>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={1} style={styles.secondaryActionButton} onPress={handleDeny}>
                      <Text style={styles.secondaryActionButtonText}>Decline</Text>
                    </TouchableOpacity>
                  </View>
                )}

                {(booking.status === 'accepted' || booking.status === 'on_the_way') && role !== 'ISP' && (
                  <>
                    {role === 'BSP' ? (
                      !booking.employeeId ? (
                        <TouchableOpacity activeOpacity={1} style={[styles.primaryActionButton, { flex: 0, width: '100%' }]} onPress={handleAssignPress}>
                          <Text style={styles.primaryActionButtonText}>Assign Professional</Text>
                        </TouchableOpacity>
                      ) : (
                        <>
                          <View style={styles.etaAlertBox}>
                            <Text style={styles.statusDescriptionText}>
                              Assigned to: <Text style={{ fontWeight: '700' }}>{assignedEmployeeName}</Text>
                            </Text>
                          </View>
                          <TouchableOpacity activeOpacity={1} style={[styles.primaryActionButton, { flex: 0, width: '100%', marginTop: 8 }]} onPress={handleCheckIn}>
                            <MapPinIcon color="#FFFFFF" size={16} />
                            <Text style={styles.primaryActionButtonText}>Mark Arrived</Text>
                          </TouchableOpacity>
                        </>
                      )
                    ) : role === 'Professional' ? (
                      !profAccepted ? (
                        <View style={styles.actionBtnGroupInline}>
                          <TouchableOpacity activeOpacity={1} style={styles.primaryActionButton} onPress={handleAcceptAssignment}>
                            <Text style={styles.primaryActionButtonText}>Accept Assignment</Text>
                          </TouchableOpacity>
                          <TouchableOpacity activeOpacity={1} style={styles.secondaryActionButton} onPress={handleDeclineAssignment}>
                            <Text style={styles.secondaryActionButtonText}>Decline</Text>
                          </TouchableOpacity>
                        </View>
                      ) : (
                        <TouchableOpacity activeOpacity={1} style={[styles.primaryActionButton, { flex: 0, width: '100%' }]} onPress={handleCheckIn}>
                          <MapPinIcon color="#FFFFFF" size={16} />
                          <Text style={styles.primaryActionButtonText}>Mark Arrived</Text>
                        </TouchableOpacity>
                      )
                    ) : (
                      <TouchableOpacity activeOpacity={1} style={[styles.primaryActionButton, { flex: 0, width: '100%' }]} onPress={handleCheckIn}>
                        <MapPinIcon color="#FFFFFF" size={16} />
                        <Text style={styles.primaryActionButtonText}>Mark Arrived</Text>
                      </TouchableOpacity>
                    )}
                  </>
                )}

                {booking.status === 'checked_in' && role !== 'ISP' && (
                  <View style={{ gap: 10, width: '100%', marginTop: 8 }}>
                    {materialRequest ? (
                      <View style={[styles.etaAlertBox, { flexDirection: 'column', alignItems: 'stretch', gap: 12, backgroundColor: '#FFFBEB', borderColor: '#F59E0B', borderWidth: 1, padding: 12, borderRadius: 12 }]}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                          <Text style={{ fontSize: 18 }}>📦</Text>
                          <View style={{ flex: 1 }}>
                            <Text style={{ fontSize: 12, fontWeight: '700', color: '#B45309' }}>
                              Material Request active ({materialRequest.requestId})
                            </Text>
                            <Text style={{ fontSize: 11, color: '#D97706', marginTop: 2 }}>
                              Status: {materialRequest.status === 'pending_quote' ? 'Pending Seller Quote' : materialRequest.status === 'quoted' ? 'Quoted - Awaiting Approval' : materialRequest.status === 'approved' ? 'Approved - Awaiting Dispatch' : materialRequest.status.toUpperCase()}
                            </Text>
                          </View>
                        </View>

                        {materialRequest.status === 'pending_quote' && (
                          <TouchableOpacity activeOpacity={1} 
                            style={[styles.primaryActionButton, { flex: 0, height: 36, backgroundColor: '#D97706', width: '100%' }]} 
                            onPress={() => router.push({
                              pathname: '/(dashboard)/seller/quotation-requests',
                              params: { requestId: materialRequest.requestId }
                            })}
                          >
                            <Text style={[styles.primaryActionButtonText, { fontSize: 12 }]}>View Quotation Requests (Seller View)</Text>
                          </TouchableOpacity>
                        )}

                        {materialRequest.status === 'quoted' && (
                          <TouchableOpacity activeOpacity={1} 
                            style={[styles.primaryActionButton, { flex: 0, height: 36, backgroundColor: '#D97706', width: '100%' }]} 
                            onPress={() => router.push({
                              pathname: '/(dashboard)/quotation-summary',
                              params: { requestId: materialRequest.requestId, bookingId: booking.bookingId }
                            })}
                          >
                            <Text style={[styles.primaryActionButtonText, { fontSize: 12 }]}>Review & Approve Quote</Text>
                          </TouchableOpacity>
                        )}

                        {materialRequest.status === 'approved' && (
                          <TouchableOpacity activeOpacity={1} 
                            style={[styles.primaryActionButton, { flex: 0, height: 36, backgroundColor: '#D97706', width: '100%' }]} 
                            onPress={() => router.push({
                              pathname: '/(dashboard)/approved-quotation',
                              params: { requestId: materialRequest.requestId, bookingId: booking.bookingId }
                            })}
                          >
                            <Text style={[styles.primaryActionButtonText, { fontSize: 12 }]}>Quotation Details & Dispatch</Text>
                          </TouchableOpacity>
                        )}

                        {materialRequest.status === 'completed' && (
                          <View style={{ backgroundColor: '#D1FAE5', padding: 8, borderRadius: 8 }}>
                            <Text style={{ fontSize: 11, color: '#065F46', fontWeight: '700', textAlign: 'center' }}>
                              ✓ Materials Handover Completed Successfully!
                            </Text>
                          </View>
                        )}

                      </View>
                    ) : null}

                    {(!materialRequest || materialRequest.status === 'completed') && (
                      <TouchableOpacity activeOpacity={1} style={[styles.primaryActionButton, { flex: 0, width: '100%' }]} onPress={handleComplete}>
                        <Text style={styles.primaryActionButtonText}>Complete Service</Text>
                      </TouchableOpacity>
                    )}

                    {!materialRequest && (
                      <TouchableOpacity activeOpacity={1} 
                        style={[styles.outlinedCardButton, { marginTop: 0, width: '100%', borderColor: 'rgba(26, 15, 163, 1.00)' }]} 
                        onPress={() => router.push({
                          pathname: '/(dashboard)/material-provider',
                          params: { bookingId: booking.bookingId }
                        })}
                      >
                        <Text style={[styles.outlinedCardButtonText, { color: 'rgba(26, 15, 163, 1.00)', fontSize: 13 }]}>Raise Material Request</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                )}
              </View>
            </View>}

            {/* Quotation Details (QR101) Card */}
            <View style={styles.card}>
              <View style={styles.cardHeaderWithBadge}>
                <Text style={styles.cardHeaderTitle}>Quotation Details (QR101)</Text>
                <View style={[styles.pillBadge, { backgroundColor: '#D1FAE5' }]}>
                  <Text style={[styles.pillBadgeText, { color: '#065F46' }]}>APPROVED</Text>
                </View>
              </View>
              <View style={styles.cardDivider} />
              
              <View style={styles.keyValueRow}>
                <Text style={styles.keyLabel}>Items:</Text>
                <Text style={styles.valueTextBold}>2 items</Text>
              </View>
              <View style={styles.keyValueRow}>
                <Text style={styles.keyLabel}>Requested On:</Text>
                <Text style={styles.valueText}>02 May 2025 - 10:15 AM</Text>
              </View>
              <View style={styles.keyValueRow}>
                <Text style={styles.keyLabel}>Estimated Cost:</Text>
                <Text style={[styles.valueTextBold, { color: 'rgba(26, 15, 163, 1.00)' }]}>₹1,250.00</Text>
              </View>
              <View style={styles.keyValueRow}>
                <Text style={styles.keyLabel}>Created By:</Text>
                <Text style={styles.valueText}>Admin</Text>
              </View>
              <View style={styles.keyValueRow}>
                <Text style={styles.keyLabel}>Approved By:</Text>
                <Text style={styles.valueText}>Customer</Text>
              </View>

              <TouchableOpacity activeOpacity={1} style={styles.outlinedCardButton} onPress={() => setQuoteModalVisible(true)}>
                <Text style={styles.outlinedCardButtonText}>View Detailed Quotation</Text>
              </TouchableOpacity>
            </View>

            {/* Order Details (Ord1001) Card */}
            <View style={styles.card}>
              <View style={styles.cardHeaderWithBadge}>
                <Text style={styles.cardHeaderTitle}>Order Details (Ord1001)</Text>
                <View style={[styles.pillBadge, { backgroundColor: '#E0E7FF' }]}>
                  <Text style={[styles.pillBadgeText, { color: 'rgba(26, 15, 163, 1.00)' }]}>ACCEPTED</Text>
                </View>
              </View>
              <View style={styles.cardDivider} />
              
              <View style={styles.keyValueRow}>
                <Text style={styles.keyLabel}>Vendor:</Text>
                <Text style={styles.valueTextBold}>SriRam Electric Agency</Text>
              </View>
              <View style={styles.keyValueRow}>
                <Text style={styles.keyLabel}>Status:</Text>
                <Text style={[styles.valueTextBold, { color: '#22C55E' }]}>● Preparing</Text>
              </View>
              <View style={styles.keyValueRow}>
                <Text style={styles.keyLabel}>Order Date:</Text>
                <Text style={styles.valueText}>02 May 2025 - 10:15 AM</Text>
              </View>
              <View style={styles.keyValueRow}>
                <Text style={styles.keyLabel}>Estimated Cost:</Text>
                <Text style={styles.valueTextBold}>₹950.00</Text>
              </View>
              <View style={styles.keyValueRow}>
                <Text style={styles.keyLabel}>Delivery Address:</Text>
                <Text style={styles.valueText} numberOfLines={1}>Sector 45, Noida...</Text>
              </View>

              <TouchableOpacity activeOpacity={1} style={styles.outlinedCardButton} onPress={() => setOrderModalVisible(true)}>
                <Text style={styles.outlinedCardButtonText}>View Detailed Order Details</Text>
              </TouchableOpacity>
            </View>

            {/* Service Details Card */}
            <View style={styles.card}>
              <Text style={styles.sectionHeading}>SERVICE DETAILS</Text>
              <View style={styles.issueDescriptionBox}>
                <View style={styles.infoAlertHeader}>
                  <InfoCircleIcon size={16} />
                  <Text style={styles.issueDescriptionHeading}>ISSUE DESCRIPTION</Text>
                </View>
                <Text style={styles.issueDescriptionText}>
                  AC not cooling properly and making loud clicking noise. Filters were cleaned last month.
                </Text>
              </View>

              <View style={styles.serviceDetailsColumnsRow}>
                <View style={styles.serviceDetailCol}>
                  <Text style={styles.keyLabelSmall}>SERVICE TYPE</Text>
                  <Text style={styles.valueTextBoldSmall}>Repair</Text>
                </View>
                <View style={styles.serviceDetailCol}>
                  <Text style={styles.keyLabelSmall}>BRAND / MODEL</Text>
                  <Text style={styles.valueTextBoldSmall}>Voltas / 1.5 Ton</Text>
                </View>
              </View>
              
              <View style={styles.serialNoContainer}>
                <Text style={styles.keyLabelSmall}>SERIAL NO.</Text>
                <View style={styles.serialBadge}>
                  <Text style={styles.serialBadgeText}>VLTS15X231245</Text>
                </View>
              </View>
            </View>

            {/* Payment & Earnings Summary Card */}
            <View style={styles.card}>
              <Text style={styles.sectionHeading}>PAYMENT & EARNINGS SUMMARY</Text>
              
              <View style={styles.keyValueRow}>
                <Text style={styles.keyLabel}>Service Charge</Text>
                <Text style={styles.valueTextBold}>{extra.serviceCharge}</Text>
              </View>
              <View style={styles.keyValueRow}>
                <Text style={styles.keyLabel}>Convenience Fee</Text>
                <Text style={styles.valueTextBold}>{extra.convenienceFee}</Text>
              </View>
              <View style={styles.keyValueRow}>
                <Text style={styles.keyLabel}>GST (18%)</Text>
                <Text style={styles.valueTextBold}>{extra.gst}</Text>
              </View>
              
              <View style={styles.cardDivider} />

              <View style={styles.keyValueRow}>
                <Text style={styles.totalLabel}>Total Amount (Customer Paid)</Text>
                <Text style={styles.totalValue}>{extra.cost}</Text>
              </View>

              {/* Green Earnings highlight card */}
              <TouchableOpacity activeOpacity={1} style={styles.earningsHighlightBox} onPress={() => router.push('/(dashboard)/wallet')}>
                <View style={styles.earningsHeaderRow}>
                  <Text style={styles.earningsTitle}>Your Earnings</Text>
                  <InfoCircleIcon size={14} color="#059669" />
                </View>
                <Text style={styles.earningsValueText}>{extra.earnings}</Text>
              </TouchableOpacity>

              {/* Status Badges Row */}
              <View style={styles.badgesWrapperRow}>
                {booking.paymentStatus === 'paid' && (
                  <View style={styles.badgeLabelGroup}>
                    <Text style={styles.badgeMetaLabel}>PAYMENT STATUS</Text>
                    <View style={[styles.borderBadge, { borderColor: '#22C55E' }]}>
                      <Text style={[styles.borderBadgeText, { color: '#15803D' }]}>✓ Paid</Text>
                    </View>
                  </View>
                )}
              </View>

              <View style={styles.settlementContainer}>
                <Text style={styles.badgeMetaLabel}>SETTLEMENT STATUS</Text>
                <View style={styles.settlementPendingBadge}>
                  <Text style={styles.settlementPendingText}>SETTLEMENT PENDING</Text>
                </View>
              </View>
            </View>

            {/* Detailed Activity Log */}
            <View style={styles.card}>
              <Text style={styles.sectionHeading}>DETAILED ACTIVITY LOG</Text>
              
              <View style={styles.activityLogTimeline}>
                <View style={styles.activityItem}>
                  <View style={styles.activityTimelineCol}>
                    <View style={styles.activityDotActive} />
                    <View style={styles.activityTimelineLine} />
                  </View>
                  <View style={styles.activityMetaCol}>
                    <Text style={styles.activityTitleText}>Booking Confirmed</Text>
                    <Text style={styles.activityTimeText}>2 May, 09:20 AM</Text>
                  </View>
                </View>

                <View style={styles.activityItem}>
                  <View style={styles.activityTimelineCol}>
                    <View style={styles.activityDotActive} />
                    <View style={styles.activityTimelineLine} />
                  </View>
                  <View style={styles.activityMetaCol}>
                    <Text style={styles.activityTitleText}>Assigned to You</Text>
                    <Text style={styles.activityTimeText}>2 May, 09:21 AM</Text>
                  </View>
                </View>

                <View style={styles.activityItem}>
                  <View style={styles.activityTimelineCol}>
                    <View style={styles.activityDotActive} />
                    <View style={styles.activityTimelineLine} />
                  </View>
                  <View style={styles.activityMetaCol}>
                    <Text style={styles.activityTitleText}>Booking Accepted</Text>
                    <Text style={styles.activityTimeText}>2 May, 09:22 AM</Text>
                  </View>
                </View>

                <View style={styles.activityItem}>
                  <View style={styles.activityTimelineCol}>
                    <View style={styles.activityDotActiveBlue} />
                  </View>
                  <View style={styles.activityMetaCol}>
                    <Text style={[styles.activityTitleText, { color: '#2563EB', fontWeight: '700' }]}>On the way</Text>
                    <Text style={styles.activityTimeText}>2 May, 09:25 AM</Text>
                  </View>
                </View>
              </View>

              {/* Material pickup banner */}
              <TouchableOpacity activeOpacity={1} style={styles.materialPickupBanner} onPress={() => setMapModalVisible(true)}>
                <View style={styles.materialIconCircle}>
                  <Text style={{ fontSize: 14 }}>🏪</Text>
                </View>
                <Text style={styles.materialPickupText}>Navigate to Seller Address (Material Pickup)</Text>
                <Text style={styles.materialPickupArrow}>→</Text>
              </TouchableOpacity>

              <View style={styles.actionButtonsRow}>
                <TouchableOpacity activeOpacity={1} style={styles.cancelBookingBtn} onPress={() => setCancelModalVisible(true)}>
                  <Text style={styles.cancelBookingText}>ⓧ CANCEL BOOKING</Text>
                </TouchableOpacity>

                <TouchableOpacity activeOpacity={1} style={styles.reportIssueBtn} onPress={() => setReportIssueModalVisible(true)}>
                  <Text style={styles.reportIssueText}>⚠ REPORT ISSUE</Text>
                </TouchableOpacity>
              </View>
            </View>

          </View>
          </ScrollView>
        </View>

        {/* Sticky Action Footer */}
        <View style={styles.stickyFooter}>
          <View style={styles.footerRow}>
            <TouchableOpacity activeOpacity={1} style={styles.footerOutlinedBtn} onPress={() => alert(`Calling ${extra.customerName}...`)}>
              <PhoneIcon size={16} color="rgba(26, 15, 163, 1.00)" />
              <Text style={styles.footerOutlinedBtnText}>CALL</Text>
            </TouchableOpacity>

            <TouchableOpacity activeOpacity={1} style={styles.footerOutlinedBtn} onPress={() => router.push(`/(dashboard)/chat`)}>
              <MessageIcon size={16} color="rgba(26, 15, 163, 1.00)" />
              <Text style={styles.footerOutlinedBtnText}>CHAT</Text>
            </TouchableOpacity>

            {role === 'BSP' && (
              <TouchableOpacity activeOpacity={1} style={styles.footerOutlinedBtn} onPress={() => alert('Update ETA')}>
                <Text style={styles.footerOutlinedBtnText}>UPDATE ETA</Text>
              </TouchableOpacity>
            )}
          </View>



          {booking.status === 'checked_in' && role !== 'ISP' && role !== 'BSP' && (
            <TouchableOpacity activeOpacity={1} style={styles.footerPrimaryBtn} onPress={handleComplete}>
              <Text style={styles.footerPrimaryBtnText}>Complete Service</Text>
            </TouchableOpacity>
          )}

          {booking.status === 'pending' && role !== 'ISP' && role !== 'BSP' && (
            <TouchableOpacity activeOpacity={1} style={styles.footerPrimaryBtn} onPress={handleAccept}>
              <Text style={styles.footerPrimaryBtnText}>Accept Booking</Text>
            </TouchableOpacity>
          )}
        </View>

      </SafeAreaView>

      <CancellationReasonModal 
        visible={cancelModalVisible}
        onClose={() => setCancelModalVisible(false)}
        bookingId={booking?.bookingId}
        serviceName="AC Repair"
        onConfirm={handleCancelConfirm}
      />

      <ReportIssueModal
        visible={reportIssueModalVisible}
        onClose={() => setReportIssueModalVisible(false)}
        onSave={handleReportIssueSave}
      />

      <UserLocationModal 
        visible={mapModalVisible}
        onClose={() => setMapModalVisible(false)}
        onStart={handleStartFromMap}
        onCancel={() => setMapModalVisible(false)}
        bookingStatus={booking.status}
      />

      <OTPModal 
        visible={otpModalVisible}
        onClose={() => setOtpModalVisible(false)}
        onVerified={onOtpVerified}
        expectedOtp={otpType === 'check_in' ? booking.checkInCode : booking.completionOtp}
        length={otpLength}
      />

      {/* Quotation Details Modal */}
      <Modal
        visible={quoteModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setQuoteModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.detailsModalCard}>
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalTitle}>Quotation Details (QR101)</Text>
              <View style={[styles.pillBadge, { backgroundColor: '#D1FAE5', alignSelf: 'center' }]}>
                <Text style={[styles.pillBadgeText, { color: '#065F46' }]}>APPROVED</Text>
              </View>
            </View>
            <View style={styles.modalDivider} />
            
            <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
              <Text style={styles.modalSectionTitle}>LINE ITEMS</Text>
              
              <View style={styles.modalLineItem}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.modalItemName}>AC Filter Cleaning</Text>
                  <Text style={styles.modalItemQty}>Qty: 1</Text>
                </View>
                <Text style={styles.modalItemPrice}>₹599.00</Text>
              </View>

              <View style={styles.modalLineItem}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.modalItemName}>AC Gas Charging / Refilling</Text>
                  <Text style={styles.modalItemQty}>Qty: 1</Text>
                </View>
                <Text style={styles.modalItemPrice}>₹651.00</Text>
              </View>

              <View style={styles.modalDivider} />

              <View style={styles.modalTotalRow}>
                <Text style={styles.modalTotalLabel}>Estimated Cost</Text>
                <Text style={styles.modalTotalValue}>₹1,250.00</Text>
              </View>

              <View style={styles.modalDivider} />

              <Text style={styles.modalSectionTitle}>ADDITIONAL INFO</Text>
              <View style={styles.modalInfoRow}>
                <Text style={styles.modalInfoLabel}>Requested On</Text>
                <Text style={styles.modalInfoValue}>02 May 2025 - 10:15 AM</Text>
              </View>
              <View style={styles.modalInfoRow}>
                <Text style={styles.modalInfoLabel}>Created By</Text>
                <Text style={styles.modalInfoValue}>Admin</Text>
              </View>
              <View style={styles.modalInfoRow}>
                <Text style={styles.modalInfoLabel}>Approved By</Text>
                <Text style={styles.modalInfoValue}>Customer (Amit Kumar)</Text>
              </View>
            </ScrollView>

            <TouchableOpacity activeOpacity={1} style={styles.modalCloseBtnFull} onPress={() => setQuoteModalVisible(false)}>
              <Text style={styles.modalCloseBtnText}>Close Details</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Order Details Modal */}
      <Modal
        visible={orderModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setOrderModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.detailsModalCard}>
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalTitle}>Order Details (Ord1001)</Text>
              <View style={[styles.pillBadge, { backgroundColor: '#E0E7FF', alignSelf: 'center' }]}>
                <Text style={[styles.pillBadgeText, { color: 'rgba(26, 15, 163, 1.00)' }]}>ACCEPTED</Text>
              </View>
            </View>
            <View style={styles.modalDivider} />
            
            <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
              <Text style={styles.modalSectionTitle}>VENDOR INFO</Text>
              <Text style={styles.modalVendorName}>SriRam Electric Agency</Text>
              <Text style={styles.modalVendorAddress}>Sector 45, Noida, UP</Text>

              <View style={styles.modalDivider} />

              <Text style={styles.modalSectionTitle}>SPARE PARTS / MATERIALS</Text>
              
              <View style={styles.modalLineItem}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.modalItemName}>AC Capacitor (1.5 Ton Voltas)</Text>
                  <Text style={styles.modalItemQty}>Qty: 1</Text>
                </View>
                <Text style={styles.modalItemPrice}>₹750.00</Text>
              </View>

              <View style={styles.modalLineItem}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.modalItemName}>Copper Pipe Wrap (2 meters)</Text>
                  <Text style={styles.modalItemQty}>Qty: 1</Text>
                </View>
                <Text style={styles.modalItemPrice}>₹200.00</Text>
              </View>

              <View style={styles.modalDivider} />

              <View style={styles.modalTotalRow}>
                <Text style={styles.modalTotalLabel}>Order Cost</Text>
                <Text style={styles.modalTotalValue}>₹950.00</Text>
              </View>

              <View style={styles.modalDivider} />

              <Text style={styles.modalSectionTitle}>LOGISTICS</Text>
              <View style={styles.modalInfoRow}>
                <Text style={styles.modalInfoLabel}>Order Date</Text>
                <Text style={styles.modalInfoValue}>02 May 2025 - 10:15 AM</Text>
              </View>
              <View style={styles.modalInfoRow}>
                <Text style={styles.modalInfoLabel}>Status</Text>
                <Text style={[styles.modalInfoValue, { color: '#22C55E', fontWeight: '700' }]}>● Preparing</Text>
              </View>
              <View style={styles.modalInfoRow}>
                <Text style={styles.modalInfoLabel}>Delivery Address</Text>
                <Text style={styles.modalInfoValue}>Sector 45, Noida (Hozify Hub)</Text>
              </View>
            </ScrollView>

            <TouchableOpacity activeOpacity={1} style={styles.modalCloseBtnFull} onPress={() => setOrderModalVisible(false)}>
              <Text style={styles.modalCloseBtnText}>Close Details</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  
  whitePopupWrapper: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    marginTop: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    overflow: 'hidden',
  },

  // Custom navigation header
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 16, 
    paddingTop: 16, 
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  backButton: { marginRight: 12 },
  headerTitleContainer: { flex: 1 },
  headerTitle: { fontSize: 15, fontWeight: '700', color: '#0F172A' },
  headerSubtitle: { fontSize: 10, color: '#64748B', fontWeight: '500', marginTop: 1 },
  headerLogoBox: { alignItems: 'flex-end' },
  logoTextHozify: { fontSize: 16, fontWeight: '800', color: 'rgba(26, 15, 163, 1.00)' },
  logoTextPartner: { fontSize: 10, color: '#3B82F6', fontWeight: '700', marginTop: -2 },

  scrollContent: { paddingHorizontal: 16, paddingBottom: 120, paddingTop: 16 },
  responsiveContent: { width: '100%', maxWidth: 480, alignSelf: 'center' },

  // Booking ID banner
  idStatusRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  idBadgeContainer: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  idLabelBadge: { backgroundColor: '#1D4ED8', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  idLabelBadgeText: { color: '#FFFFFF', fontSize: 10, fontWeight: '700' },
  idValueText: { fontSize: 14, fontWeight: '700', color: '#0F172A' },
  statusBadge: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  statusDot: { width: 6, height: 6, borderRadius: 3, marginRight: 6 },
  statusBadgeText: { fontSize: 11, fontWeight: '700' },
  goToBikeRow: { flexDirection: 'row', alignItems: 'center', marginTop: 12, gap: 12 },
  goToPill: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: '#F1F5F9', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  goToPillText: { fontSize: 13, fontWeight: '700', color: '#475569' },
  bikeRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  bikeLabel: { fontSize: 15, fontWeight: '700', color: '#0F172A' },
  bookedOnText: { fontSize: 11, color: '#94A3B8', marginTop: 8, marginBottom: 16, fontWeight: '500' },

  // Generic card styling
  card: { paddingHorizontal: 0, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  cardDivider: { height: 1, backgroundColor: '#E2E8F0', marginVertical: 16 },
  cardHeaderTitle: { fontSize: 13, fontWeight: '700', color: '#0F172A' },
  cardHeaderWithBadge: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  pillBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  pillBadgeText: { fontSize: 9, fontWeight: '700' },

  // Service summary card content
  serviceRow: { flexDirection: 'row', alignItems: 'center' },
  serviceIconWrap: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  serviceCol: { flex: 1 },
  cardTitle: { fontSize: 14, fontWeight: '700', color: '#0F172A', marginBottom: 4 },
  categoryText: { fontSize: 11, color: '#64748B' },
  categoryValue: { color: 'rgba(26, 15, 163, 1.00)', fontWeight: '600' },
  priceCol: { alignItems: 'flex-end' },
  priceMainText: { fontSize: 18, fontWeight: '800', color: '#0F172A' },
  priceLabelSub: { fontSize: 8, color: '#94A3B8', fontWeight: '700', marginTop: 2 },

  // Customer Card
  customerHeader: { flexDirection: 'row', alignItems: 'center' },
  customerAvatar: { width: 48, height: 48, borderRadius: 24, marginRight: 12 },
  customerMeta: { flex: 1 },
  nameVerifiedRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  customerNameText: { fontSize: 14, fontWeight: '700', color: '#0F172A' },
  customerIdText: { fontSize: 11, color: '#64748B', marginTop: 2 },
  customerPhoneText: { fontSize: 12, color: '#2563EB', fontWeight: '600', marginTop: 4 },
  customerActionIcons: { flexDirection: 'row', gap: 8 },
  actionCircleBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#EFF6FF', justifyContent: 'center', alignItems: 'center' },

  dateTimeRow: { flexDirection: 'row', justifyContent: 'space-between' },
  dateTimeCol: { flex: 1 },
  dateTimeLabel: { fontSize: 9, color: '#94A3B8', fontWeight: '700', marginBottom: 6 },
  dateTimeValue: { fontSize: 13, fontWeight: '700', color: '#0F172A' },
  dateTimeSub: { fontSize: 10, color: '#64748B', marginTop: 2 },

  addressSection: { width: '100%' },
  addressHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  addressLabel: { fontSize: 9, color: '#94A3B8', fontWeight: '700' },
  mapLinkRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  mapLinkText: { fontSize: 9, color: 'rgba(26, 15, 163, 1.00)', fontWeight: '700' },
  addressDetailsText: { fontSize: 12, color: '#475569', lineHeight: 18 },

  etaAlertBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#EFF6FF', borderRadius: 12, padding: 12, marginTop: 8, gap: 12 },
  etaAlertTextCol: { flex: 1 },
  etaAlertTitle: { fontSize: 12, fontWeight: '700', color: '#1E40AF' },
  etaAlertSub: { fontSize: 10, color: '#3B82F6', marginTop: 2 },
  navigateMiniBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E8F0', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, gap: 4 },
  navigateMiniText: { fontSize: 9, fontWeight: '700', color: '#0F172A' },

  // Current Status Checklist Timeline
  sectionHeading: { fontSize: 10, color: '#94A3B8', fontWeight: '700', marginBottom: 16, letterSpacing: 0.5 },
  timelineVisualContainer: { paddingVertical: 4, paddingHorizontal: 4 },

  /* Timeline row: line behind, dots on top */
  tlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'relative',
    marginBottom: 10,
  },
  tlBaseLine: {
    position: 'absolute',
    left: 13, right: 13,
    height: 2,
    backgroundColor: '#CBD5E1',
    top: 12,
  },
  tlDot: {
    width: 26, height: 26, borderRadius: 13,
    borderWidth: 1.5, borderColor: '#CBD5E1',
    backgroundColor: '#FFFFFF',
    zIndex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tlDotActive: { borderColor: 'rgba(26, 15, 163, 1.00)', backgroundColor: 'rgba(26, 15, 163, 1.00)' },
  tlLabelsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  tlLabel: { fontSize: 9, color: '#64748B', fontWeight: '400', textAlign: 'center', flex: 1 },

  timelineContentArea: { marginTop: 16 },
  statusInfoBox: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: '#EEF2FF', borderRadius: 14, padding: 14, marginBottom: 2,
    borderWidth: 1, borderColor: '#C7D2FE',
  },
  statusDescriptionTitle: { fontSize: 13, fontWeight: '700', color: '#1E3A8A' },
  statusDescriptionText: { fontSize: 11, color: 'rgba(26, 15, 163, 1.00)', marginTop: 2 },
  nextStepTextLabel: { fontSize: 9, color: '#94A3B8', fontWeight: '700', marginTop: 16 },
  nextStepActionTitle: { fontSize: 14, fontWeight: '800', color: '#0F172A', marginTop: 4, marginBottom: 12 },

  actionBtnGroupInline: { flexDirection: 'row', gap: 12, marginTop: 8 },
  primaryActionButton: { flex: 1, height: 48, borderRadius: 16, backgroundColor: 'rgba(26, 15, 163, 1.00)', justifyContent: 'center', alignItems: 'center', flexDirection: 'row', gap: 8 },
  primaryActionButtonText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
  secondaryActionButton: { width: 100, height: 48, borderRadius: 16, borderWidth: 1.5, borderColor: '#EF4444', backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center' },
  secondaryActionButtonText: { color: '#EF4444', fontSize: 15, fontWeight: '700' },

  outlinedCardButton: { height: 44, borderRadius: 16, borderWidth: 1.5, borderColor: 'rgba(26, 15, 163, 1.00)', justifyContent: 'center', alignItems: 'center', marginTop: 16 },
  outlinedCardButtonText: { color: 'rgba(26, 15, 163, 1.00)', fontSize: 13, fontWeight: '700' },

  // Key Value Info layouts
  keyValueRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 6 },
  keyLabel: { fontSize: 12, color: '#64748B', fontWeight: '500' },
  valueText: { fontSize: 12, color: '#0F172A', fontWeight: '600' },
  valueTextBold: { fontSize: 12, color: '#0F172A', fontWeight: '700' },
  totalLabel: { fontSize: 13, fontWeight: '700', color: '#0F172A' },
  totalValue: { fontSize: 16, fontWeight: '800', color: 'rgba(26, 15, 163, 1.00)' },

  // Service details card columns
  issueDescriptionBox: { backgroundColor: '#F8FAFC', borderLeftWidth: 3, borderLeftColor: '#94A3B8', padding: 12, borderRadius: 8, marginBottom: 16 },
  infoAlertHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 },
  issueDescriptionHeading: { fontSize: 10, color: '#64748B', fontWeight: '700' },
  issueDescriptionText: { fontSize: 11, color: '#0F172A', lineHeight: 16, fontWeight: '500' },
  serviceDetailsColumnsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  serviceDetailCol: { flex: 1 },
  keyLabelSmall: { fontSize: 9, color: '#94A3B8', fontWeight: '700', marginBottom: 4 },
  valueTextBoldSmall: { fontSize: 12, fontWeight: '700', color: '#0F172A' },
  serialNoContainer: { width: '100%' },
  serialBadge: { backgroundColor: '#F1F5F9', alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6, marginTop: 4 },
  serialBadgeText: { fontSize: 10, fontWeight: '700', color: '#475569' },

  // Earnings Highlight
  earningsHighlightBox: { backgroundColor: '#ECFDF5', borderRadius: 12, padding: 12, marginVertical: 16 },
  earningsHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  earningsTitle: { fontSize: 11, color: '#047857', fontWeight: '700' },
  earningsValueText: { fontSize: 24, fontWeight: '800', color: '#059669' },

  badgesWrapperRow: { flexDirection: 'row', gap: 24, marginTop: 12 },
  badgeLabelGroup: { flex: 1 },
  badgeMetaLabel: { fontSize: 9, color: '#94A3B8', fontWeight: '700', marginBottom: 6 },
  borderBadge: { alignSelf: 'flex-start', borderWidth: 1, borderColor: '#E2E8F0', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  borderBadgeText: { fontSize: 11, fontWeight: '700', color: '#475569' },
  settlementContainer: { marginTop: 16 },
  settlementPendingBadge: { backgroundColor: '#FFEDD5', alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  settlementPendingText: { fontSize: 10, fontWeight: '700', color: '#D97706' },

  // Detailed Activity Log
  activityLogTimeline: { paddingLeft: 8, marginVertical: 16 },
  activityItem: { flexDirection: 'row', marginBottom: 16, alignItems: 'flex-start' },
  activityTimelineCol: { alignItems: 'center', width: 24, marginRight: 12, position: 'relative' },
  activityDotActive: { width: 14, height: 14, borderRadius: 7, backgroundColor: '#22C55E', zIndex: 2 },
  activityDotActiveBlue: { width: 14, height: 14, borderRadius: 7, backgroundColor: '#2563EB', zIndex: 2 },
  activityTimelineLine: { position: 'absolute', top: 14, bottom: -22, width: 2, backgroundColor: '#E2E8F0', zIndex: 1 },
  activityMetaCol: { flex: 1 },
  activityTitleText: { fontSize: 12, fontWeight: '600', color: '#0F172A' },
  activityTimeText: { fontSize: 10, color: '#94A3B8', marginTop: 2 },
  
  materialPickupBanner: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#EFF6FF', borderRadius: 12, padding: 12, gap: 10 },
  materialIconCircle: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#DBEAFE', justifyContent: 'center', alignItems: 'center' },
  materialPickupText: { flex: 1, fontSize: 11, fontWeight: '700', color: '#1E40AF' },
  materialPickupArrow: { fontSize: 16, color: '#1E40AF', fontWeight: '700' },
  
  cancelBookingBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  cancelBookingText: { fontSize: 11, fontWeight: '700', color: '#EF4444' },
  actionButtonsRow: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', marginTop: 24, gap: 12 },
  reportIssueBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  reportIssueText: { fontSize: 11, fontWeight: '700', color: '#D97706' },

  // Action Footer (formerly Sticky)
  stickyFooter: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 24 : 12,
  },
  footerRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  footerOutlinedBtn: { flex: 1, height: 40, borderRadius: 8, borderWidth: 1, borderColor: '#CBD5E1', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  footerOutlinedBtnText: { fontSize: 10, fontWeight: '700', color: 'rgba(26, 15, 163, 1.00)' },
  footerPrimaryBtn: { height: 48, borderRadius: 16, backgroundColor: 'rgba(26, 15, 163, 1.00)', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  footerPrimaryBtnText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },

  // Detail Popups Modals styles
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  detailsModalCard: { backgroundColor: '#FFFFFF', borderRadius: 24, padding: 24, width: '100%', maxWidth: 400, maxHeight: '80%' },
  modalHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  modalTitle: { fontSize: 16, fontWeight: '800', color: '#0F172A' },
  modalDivider: { height: 1, backgroundColor: '#E2E8F0', marginVertical: 12 },
  modalScroll: { flexGrow: 0 },
  modalSectionTitle: { fontSize: 10, color: '#94A3B8', fontWeight: '700', marginBottom: 12, letterSpacing: 0.5 },
  modalLineItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 6 },
  modalItemName: { fontSize: 13, fontWeight: '700', color: '#0F172A' },
  modalItemQty: { fontSize: 11, color: '#64748B', marginTop: 2 },
  modalItemPrice: { fontSize: 13, fontWeight: '700', color: '#0F172A' },
  modalTotalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 4 },
  modalTotalLabel: { fontSize: 14, fontWeight: '800', color: '#0F172A' },
  modalTotalValue: { fontSize: 16, fontWeight: '800', color: 'rgba(26, 15, 163, 1.00)' },
  modalInfoRow: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 6 },
  modalInfoLabel: { fontSize: 12, color: '#64748B' },
  modalInfoValue: { fontSize: 12, color: '#0F172A', fontWeight: '600' },
  modalVendorName: { fontSize: 14, fontWeight: '700', color: '#0F172A' },
  modalVendorAddress: { fontSize: 12, color: '#64748B', marginTop: 2 },
  modalCloseBtnFull: { backgroundColor: 'rgba(26, 15, 163, 1.00)', width: '100%', paddingVertical: 14, borderRadius: 16, alignItems: 'center', marginTop: 16 },
  modalCloseBtnText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' }
});
