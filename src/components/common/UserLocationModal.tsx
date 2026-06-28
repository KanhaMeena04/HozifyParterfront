import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Image } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';

interface UserLocationModalProps {
  visible: boolean;
  onClose: () => void;
  onStart: () => void;
  onCancel: () => void;
  bookingStatus?: string;
}

const CloseModalIcon = ({ color = '#64748B' }) => (
  <Svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <Path d="M18 6L6 18M6 6L18 18" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const MessageIcon = ({ color = '#475569' }) => (
  <Svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <Path d="M21 11.5C21.0034 12.8199 20.6951 14.1219 20.1 15.3C19.3944 16.7118 18.3098 17.8992 16.9674 18.7293C15.6251 19.5594 14.0782 19.9994 12.5 20C11.1801 20.0035 9.87812 19.6951 8.7 19.1L3 21L4.9 15.3C4.30493 14.1219 3.99656 12.8199 4 11.5C4.00061 9.92179 4.44061 8.37488 5.27072 7.03258C6.10083 5.69028 7.28825 4.6056 8.7 3.90003C9.87812 3.30496 11.1801 2.99659 12.5 3.00003H13C15.0843 3.11502 17.053 3.99479 18.5291 5.47089C20.0052 6.94699 20.885 8.91568 21 11V11.5Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill={color} />
  </Svg>
);

const PhoneIcon = ({ color = '#475569' }) => (
  <Svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <Path d="M3 5.5C3 14.0604 9.93959 21 18.5 21C18.8862 21 19.2691 20.9859 19.6483 20.9581C20.0834 20.9262 20.3009 20.9103 20.493 20.7963C20.763 20.6361 20.9759 20.3606 21.0598 20.0607C21.1192 19.8487 21.0456 19.6277 20.8983 19.1856L19.5103 15.021C19.3879 14.6539 19.3267 14.4703 19.2135 14.3312C19.1136 14.2084 18.9806 14.1166 18.8285 14.0655C18.656 14.0076 18.4624 14.027 18.0751 14.0657L15.3582 14.3374C14.8697 14.3862 14.3822 14.1205 14.1122 13.6828L10.3172 7.53323C10.0472 7.09553 10.1118 6.54144 10.48 6.13643L12.5186 3.89412C12.7844 3.6017 12.8361 3.41162 12.8306 3.23896C12.8257 3.08643 12.7766 2.94052 12.6896 2.81765C12.5912 2.67858 12.4343 2.58444 12.1206 2.39616L8.43501 0.184852C8.03362 -0.0560156 7.83292 -0.17645 7.61803 -0.160161C7.31557 -0.137233 7.03185 0.0469446 6.84542 0.300185C6.71286 0.479261 6.6433 0.68792 6.50417 1.10524L5.61909 3.76044C5.16335 5.12769 5.09919 5.48512 5.03157 5.8694C4.94584 6.35677 4.90807 6.85244 4.9189 7.34861C4.93339 8.01248 5.03352 8.70034 5.23377 10.076Z" fill={color} />
  </Svg>
);

const LocationPinIcon = ({ color, dotColor = '#FFFFFF' }: { color: string, dotColor?: string }) => (
  <Svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <Path d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Circle cx="12" cy="10" r="3" fill={dotColor} stroke={color} strokeWidth="2" />
  </Svg>
);

export const UserLocationModal: React.FC<UserLocationModalProps> = ({ visible, onClose, onStart, onCancel, bookingStatus }) => {
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        
        {/* Fake Map Background */}
        <View style={styles.fakeMapContainer}>
          {/* Simple vector lines mimicking roads for effect */}
          <Svg width="100%" height="100%" viewBox="0 0 400 400" fill="none">
            <Path d="M50 0V200H200V400" stroke="#CBD5E1" strokeWidth="8" />
            <Path d="M0 100H400" stroke="#CBD5E1" strokeWidth="8" />
            <Path d="M200 200H400" stroke="#CBD5E1" strokeWidth="8" />
            
            {/* Route path */}
            <Path d="M150 250H220V120H300" stroke="#94A3B8" strokeWidth="2" strokeDasharray="5,5" />
            <Circle cx="150" cy="250" r="6" fill="#EF4444" />
            <Circle cx="300" cy="120" r="6" fill="#84CC16" />
          </Svg>
        </View>

        {/* Bottom Sheet */}
        <View style={styles.sheetContainer}>
          
          <View style={styles.headerRow}>
            <Text style={styles.title}>User Location</Text>
            <TouchableOpacity activeOpacity={1} onPress={onClose} style={styles.closeBtn}>
              <CloseModalIcon />
            </TouchableOpacity>
          </View>

          <View style={styles.timeRow}>
            <Text style={styles.timeText}>10 min </Text>
            <Text style={styles.distanceText}>(2.4 km)</Text>
          </View>
          <Text style={styles.subText}>To reach destination</Text>

          <View style={styles.userCard}>
            <Image source={{ uri: 'https://i.pravatar.cc/150?img=5' }} style={styles.avatar} />
            <View style={styles.userInfo}>
              <Text style={styles.userName}>Arlene Mccoy (user)</Text>
              <Text style={styles.userPhone}>+91 1234567890</Text>
            </View>
            <View style={styles.actionBtns}>
              <TouchableOpacity activeOpacity={1} style={styles.iconBtn}><MessageIcon /></TouchableOpacity>
              <TouchableOpacity activeOpacity={1} style={styles.iconBtn}><PhoneIcon /></TouchableOpacity>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.locationBlock}>
            <View style={styles.locIndicator}>
              <LocationPinIcon color="#84CC16" dotColor="#FFFFFF" />
              <View style={styles.verticalLine} />
              <LocationPinIcon color="#EF4444" dotColor="#FFFFFF" />
            </View>
            <View style={styles.locDetails}>
              <View style={styles.locRow}>
                <Text style={styles.locLabel}>Pickup Location - </Text>
                <Text style={styles.locId}>7000000057</Text>
              </View>
              <Text style={styles.locAddress}>Vijay Nagar Square, AB Road, Indore, Madhya...</Text>
              
              <View style={[styles.locRow, { marginTop: 16 }]}>
                <Text style={styles.locLabel}>Drop-Off Location - </Text>
                <Text style={styles.locId}>7000000057</Text>
              </View>
              <Text style={styles.locAddress}>Rajwada Palace, MG Road, Indore, Madhya Pradesh</Text>
            </View>
          </View>

          <View style={styles.divider} />

          {bookingStatus === 'checked_in' || bookingStatus === 'completed' || bookingStatus === 'closed' ? (
            <View style={styles.inProgressBadge}>
              <Text style={styles.inProgressText}>Work In Progress</Text>
            </View>
          ) : (
            <>
              <TouchableOpacity activeOpacity={1} style={styles.startBtn} onPress={onStart}>
                <Text style={styles.startBtnText}>Start</Text>
              </TouchableOpacity>
              
              <TouchableOpacity activeOpacity={1} style={styles.cancelBtn} onPress={onCancel}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
            </>
          )}

        </View>

      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: '#F1F5F9', justifyContent: 'flex-end' },
  
  fakeMapContainer: { position: 'absolute', top: 0, left: 0, right: 0, bottom: '50%', backgroundColor: '#F8FAFC', overflow: 'hidden' },

  sheetContainer: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, boxShadow: '0px -4px 10px rgba(0, 0, 0, 0.1)', elevation: 10 },
  
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  title: { fontSize: 16, fontWeight: '800', color: '#0F172A' },
  closeBtn: { padding: 4 },

  timeRow: { flexDirection: 'row', alignItems: 'baseline', marginBottom: 4 },
  timeText: { fontSize: 24, fontWeight: '800', color: '#0F172A' },
  distanceText: { fontSize: 13, color: '#94A3B8' },
  subText: { fontSize: 11, color: '#94A3B8', marginBottom: 24 },

  userCard: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  avatar: { width: 48, height: 48, borderRadius: 24, marginRight: 12 },
  userInfo: { flex: 1 },
  userName: { fontSize: 14, fontWeight: '700', color: '#0F172A', marginBottom: 4 },
  userPhone: { fontSize: 11, color: '#64748B' },
  actionBtns: { flexDirection: 'row', gap: 12 },
  iconBtn: { width: 40, height: 40, borderRadius: 20, borderWidth: 1, borderColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center' },

  divider: { height: 1, backgroundColor: '#F8FAFC', marginVertical: 16 },

  locationBlock: { flexDirection: 'row', marginBottom: 8 },
  locIndicator: { width: 24, alignItems: 'center', marginTop: 4 },
  verticalLine: { width: 1, height: 40, backgroundColor: '#CBD5E1', marginVertical: 4, borderStyle: 'dashed' },
  locDetails: { flex: 1, marginLeft: 8 },
  locRow: { flexDirection: 'row', alignItems: 'baseline', marginBottom: 4 },
  locLabel: { fontSize: 11, fontWeight: '700', color: '#0F172A' },
  locId: { fontSize: 11, color: '#94A3B8' },
  locAddress: { fontSize: 11, color: '#64748B', lineHeight: 16 },

  startBtn: { backgroundColor: 'rgba(26, 15, 163, 1.00)', paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginBottom: 12, marginTop: 8 },
  startBtnText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
  
  cancelBtn: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#EF4444', paddingVertical: 16, borderRadius: 12, alignItems: 'center' },
  cancelBtnText: { color: '#EF4444', fontSize: 14, fontWeight: '700' },
  inProgressBadge: { backgroundColor: '#10B981', paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginBottom: 12, marginTop: 8 },
  inProgressText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
});
