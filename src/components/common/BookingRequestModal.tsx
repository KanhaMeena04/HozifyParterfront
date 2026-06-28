import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { CloseIcon } from '@/components/ui/Icons';
import { Button } from '@/components/ui/Button';

const SpaIcon = ({ size = 20, color = 'rgba(26, 15, 163, 1.00)' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="1.5" />
    <Path d="M8 12C8 9.79086 9.79086 8 12 8C14.2091 8 16 9.79086 16 12" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    <Circle cx="12" cy="12" r="1" fill={color} />
  </Svg>
);

interface BookingRequestModalProps {
  visible: boolean;
  onClose: () => void;
  onAccept?: () => void;
  onDecline?: () => void;
}

export const BookingRequestModal: React.FC<BookingRequestModalProps> = ({ visible, onClose, onAccept, onDecline }) => {
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          
          <View style={styles.headerBox}>
            <View style={styles.titleRow}>
              <View style={styles.iconCircle}>
                <SpaIcon size={16} color="#0F172A" />
              </View>
              <Text style={styles.titleText}>Spa</Text>
            </View>
            <TouchableOpacity activeOpacity={1} onPress={onClose} style={styles.closeBtn}>
              <CloseIcon size={14} color="#64748B" />
            </TouchableOpacity>
          </View>

          <View style={styles.serviceList}>
            <View style={styles.serviceItem}>
              <View style={styles.dot} />
              <Text style={styles.serviceText}>Hair Spa</Text>
            </View>
            <View style={styles.serviceItem}>
              <View style={styles.dot} />
              <Text style={styles.serviceText}>Menicure</Text>
            </View>
            <View style={styles.serviceItem}>
              <View style={styles.dot} />
              <Text style={styles.serviceText}>Pedicure</Text>
            </View>
            <View style={styles.serviceItem}>
              <View style={styles.dot} />
              <Text style={styles.serviceText}>Hair treatment</Text>
            </View>
          </View>

          <View style={styles.priceBanner}>
            <Text style={styles.priceMain}>₹15</Text>
            <Text style={styles.pricePlus}> + ₹4</Text>
            <Text style={styles.priceTag}> (Online)</Text>
          </View>

          <View style={styles.locationContainer}>
            <View style={styles.locationList}>
              
              <View style={styles.locationRow}>
                <View style={styles.timelineColumn}>
                  <View style={styles.timelineDotGreen} />
                  <View style={styles.timelineLine} />
                </View>
                <View style={styles.locationItem}>
                  <Text style={styles.distanceText}>1.7 Km</Text>
                  <Text style={styles.addressText}>
                    <Text style={styles.addressBold}>Tiruchanur - </Text>
                    11/67, YOGIMALLAVARAM, Yogimallavaram, Tiruchanur, Akkarampalle, Tiruchanur, 517503
                  </Text>
                </View>
              </View>

              <View style={styles.locationRow}>
                <View style={styles.timelineColumn}>
                  <View style={styles.timelineDotRed} />
                </View>
                <View style={styles.locationItem}>
                  <Text style={styles.distanceText}>1.2 Km</Text>
                  <Text style={styles.addressText}>
                    <Text style={styles.addressBold}>Shilparamam - </Text>
                    Fortune Grand Ridge Hotel Road, Korramenugunta, Tirupati
                  </Text>
                </View>
              </View>

            </View>
          </View>

          <View style={styles.actionsRow}>
            <TouchableOpacity activeOpacity={1} style={styles.declineBtn} onPress={onDecline || onClose}>
              <View style={styles.minusLine} />
            </TouchableOpacity>
            <Button 
              title="Accept" 
              onPress={onAccept || onClose}
              variant="primary"
              style={styles.acceptBtn}
              textStyle={styles.acceptBtnText}
            />
          </View>

        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalContent: { backgroundColor: '#FFFFFF', borderRadius: 16, width: '100%', maxWidth: 480, alignSelf: 'center', overflow: 'hidden', borderWidth: 2, borderColor: '#4ADE80' },
  
  headerBox: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, paddingBottom: 12 },
  titleRow: { flexDirection: 'row', alignItems: 'center' },
  iconCircle: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  titleText: { fontSize: 14, fontWeight: '700', color: '#0F172A' },
  closeBtn: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center' },

  serviceList: { paddingHorizontal: 16, paddingBottom: 16 },
  serviceItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  dot: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#0F172A', marginRight: 8 },
  serviceText: { fontSize: 13, fontWeight: '600', color: '#0F172A' },

  priceBanner: { flexDirection: 'row', alignItems: 'flex-end', backgroundColor: '#BBF7D0', padding: 16 },
  priceMain: { fontSize: 24, fontWeight: '800', color: '#0F172A' },
  pricePlus: { fontSize: 16, fontWeight: '700', color: '#16A34A', marginBottom: 2 },
  priceTag: { fontSize: 11, color: '#166534', marginBottom: 4, marginLeft: 4, fontWeight: '500' },

  locationContainer: { padding: 20 },
  locationRow: { flexDirection: 'row', alignItems: 'stretch' },
  timelineColumn: { alignItems: 'center', width: 20, marginRight: 12 },
  timelineDotGreen: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#22C55E', marginTop: 4 },
  timelineLine: { width: 1.5, flex: 1, backgroundColor: '#000000', marginVertical: 4 },
  timelineDotRed: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#EA580C', marginTop: 4 },

  locationList: { flex: 1 },
  locationItem: { flex: 1, paddingBottom: 24 },
  distanceText: { fontSize: 16, fontWeight: '700', color: '#0F172A', marginBottom: 4 },
  addressText: { fontSize: 11, color: '#64748B', lineHeight: 16 },
  addressBold: { fontWeight: '700', color: '#0F172A' },

  actionsRow: { flexDirection: 'row', padding: 16, gap: 16 },
  declineBtn: { width: 56, height: 56, borderRadius: 28, borderWidth: 1, borderColor: '#E2E8F0', justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF' },
  minusLine: { width: 16, height: 2, backgroundColor: '#000000' },
  acceptBtn: { flex: 1, height: 56, borderRadius: 28, backgroundColor: 'rgba(26, 15, 163, 1.00)' },
  acceptBtnText: { fontSize: 16, fontWeight: '700' },
});
