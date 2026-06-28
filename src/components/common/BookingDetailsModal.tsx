import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, TouchableWithoutFeedback } from 'react-native';
import Svg, { Path, Circle, Rect, Line } from 'react-native-svg';

const PRIMARY = 'rgba(26, 15, 163, 1.00)';

// Icons
const HeadphoneIcon = ({ size = 20, color = '#FFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M3 18v-6a9 9 0 0118 0v6M21 19a2 2 0 01-2 2h-1v-4h3v2zM3 19a2 2 0 002 2h1v-4H3v2z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const InvoiceIcon = ({ size = 20, color = '#0F172A' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M9 12h6M9 16h6M9 8h2" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Path d="M5 4C5 2.895 5.895 2 7 2h10c1.105 0 2 .895 2 2v18l-3-2-3 2-3-2-3 2-3-2V4z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const EmailIcon = ({ size = 20, color = '#FFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const ChevronUpIcon = ({ size = 16, color = '#64748B' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M5 15l7-7 7 7" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const ServiceAcIcon = ({ size = 32, color = '#0F172A' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="2" y="6" width="20" height="12" rx="2" stroke={color} strokeWidth="2" />
    <Line x1="6" y1="10" x2="18" y2="10" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Line x1="6" y1="14" x2="18" y2="14" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Line x1="7" y1="22" x2="7" y2="18" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Line x1="12" y1="22" x2="12" y2="18" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Line x1="17" y1="22" x2="17" y2="18" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

interface BookingDetailsModalProps {
  visible: boolean;
  onClose: () => void;
  booking: {
    id: string;
    service: string;
    date: string;
    amount: string;
    status: string;
  } | null;
}

export const BookingDetailsModal: React.FC<BookingDetailsModalProps> = ({ visible, onClose, booking }) => {
  if (!booking) return null;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.backdrop} />
        </TouchableWithoutFeedback>

          <View style={styles.bottomSheet}>
            <View style={styles.dragHandle} />
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
              
              {/* Single Combined Content Area */}
              <View style={styles.cardInner}>
                <View style={styles.headerRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.titleText}>{booking.service}</Text>
                    <Text style={styles.dateText}>{booking.date} • 10:00 AM</Text>
                    <Text style={styles.priceText}>{booking.amount}</Text>
                  </View>
                  <ServiceAcIcon />
                </View>

                <View style={styles.statusRow}>
                  <View style={[styles.statusBadge, booking.status === 'Completed' ? styles.statusBadgeCompleted : styles.statusBadgePending]}>
                    <Text style={styles.statusBadgeText}>{booking.status}</Text>
                  </View>
                </View>

                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Address Details</Text>
                  <ChevronUpIcon />
                </View>

                <Text style={styles.serviceIdText}>Service ID #{booking.id}</Text>

                {/* Timeline */}
                <View style={styles.timeline}>
                  <View style={styles.timelinePoint}>
                    <View style={styles.timelineIconContainer}>
                      <Circle cx="8" cy="8" r="6" stroke="#22C55E" strokeWidth="4" fill="#FFF" />
                    </View>
                    <View style={styles.timelineContent}>
                      <Text style={styles.timelineTitle}>Partner Location</Text>
                      <Text style={styles.timelineDesc}>Indore, Madhya Pradesh</Text>
                    </View>
                  </View>

                  <View style={styles.dottedLine} />

                  <View style={styles.timelinePoint}>
                    <View style={styles.timelineIconContainer}>
                      <Circle cx="8" cy="8" r="6" stroke="#EF4444" strokeWidth="4" fill="#FFF" />
                    </View>
                    <View style={styles.timelineContent}>
                      <Text style={styles.timelineTitle}>Customer Address</Text>
                      <Text style={styles.timelineDesc}>Vijay Nagar, Indore, Madhya Pradesh, 452010</Text>
                    </View>
                  </View>

                  <Text style={styles.distanceText}>15.2 mins • 4.5 kms</Text>
                </View>
              </View>

              {/* Blue Banner 1 */}
              <TouchableOpacity activeOpacity={1} style={styles.blueBanner}>
                <HeadphoneIcon size={20} />
                <View style={styles.bannerTextCol}>
                  <Text style={styles.bannerTitle}>Need help?</Text>
                  <Text style={styles.bannerSub}>We're a tap away</Text>
                </View>
              </TouchableOpacity>

              {/* Invoice Section directly following */}
              <View style={[styles.cardInner, { paddingTop: 24 }]}>
                <View style={styles.invoiceHeader}>
                  <InvoiceIcon size={24} />
                  <Text style={styles.invoiceTitle}>Invoice</Text>
                </View>

                <View style={styles.invoiceRow}>
                  <Text style={styles.invoiceTotalText}>Total Fare</Text>
                  <Text style={styles.invoiceTotalValue}>{booking.amount}</Text>
                </View>

                <View style={styles.dashLine} />

                <View style={styles.invoiceRow}>
                  <Text style={styles.invoiceLabel}>Service Charge</Text>
                  <Text style={styles.invoiceValue}>{booking.amount}</Text>
                </View>
                <View style={styles.invoiceRow}>
                  <Text style={styles.invoiceLabel}>Convenience Fees</Text>
                  <Text style={styles.invoiceValue}>₹0.00</Text>
                </View>
                <View style={styles.invoiceRow}>
                  <Text style={styles.invoiceLabel}>Discount</Text>
                  <Text style={styles.invoiceValue}>₹0.00</Text>
                </View>
              </View>

              <TouchableOpacity activeOpacity={1} style={[styles.blueBanner, { justifyContent: 'center' }]}>
                <EmailIcon size={20} />
                <Text style={[styles.bannerTitle, { marginLeft: 10 }]}>Send invoice via Email</Text>
              </TouchableOpacity>

            </ScrollView>
          </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  bottomSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    overflow: 'hidden',
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#CBD5E1',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 4,
  },
  cardInner: {
    padding: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  titleText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  dateText: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 4,
  },
  priceText: {
    fontSize: 13,
    color: '#64748B',
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 20,
  },
  statusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  statusBadgeCompleted: {
    backgroundColor: PRIMARY,
  },
  statusBadgePending: {
    backgroundColor: '#CA8A04',
  },
  statusBadgeText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
  },
  serviceIdText: {
    fontSize: 13,
    color: '#334155',
    marginBottom: 20,
  },
  timeline: {
    position: 'relative',
    paddingLeft: 4,
  },
  timelinePoint: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  timelineIconContainer: {
    width: 16,
    alignItems: 'center',
    marginRight: 12,
    zIndex: 2,
  },
  dottedLine: {
    position: 'absolute',
    left: 11.5,
    top: 16,
    bottom: 44,
    width: 1,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#94A3B8',
    zIndex: 1,
  },
  timelineContent: {
    flex: 1,
    paddingTop: -2,
  },
  timelineTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 2,
  },
  timelineDesc: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 16,
  },
  distanceText: {
    fontSize: 12,
    color: '#64748B',
    marginLeft: 28,
  },
  blueBanner: {
    backgroundColor: PRIMARY,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  bannerTextCol: {
    marginLeft: 12,
  },
  bannerTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  bannerSub: {
    fontSize: 11,
    color: '#E2E8F0',
    marginTop: 2,
  },
  invoiceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  invoiceTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginLeft: 10,
  },
  invoiceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  invoiceTotalText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  invoiceTotalValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  dashLine: {
    height: 1,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
    marginVertical: 16,
  },
  invoiceLabel: {
    fontSize: 13,
    color: '#0F172A',
    flex: 1,
  },
  invoiceValue: {
    fontSize: 13,
    color: '#0F172A',
  },
});
