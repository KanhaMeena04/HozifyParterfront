import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Linking, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { BackArrowIcon } from '@/components/ui/Icons';
import { useDocStore } from '@/store/docStore';
import { useAndroidBack } from '@/hooks/useAndroidBack';
import * as ImagePicker from 'expo-image-picker';
import Svg, { Path, Circle } from 'react-native-svg';

const CameraIcon = ({ size = 32, color = 'rgba(26, 15, 163, 1.00)' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Circle cx="12" cy="13" r="4" stroke={color} strokeWidth="2" />
  </Svg>
);

const VideoIcon = ({ size = 32, color = 'rgba(26, 15, 163, 1.00)' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M15 10l4.553-2.277A1 1 0 0 1 21 8.624v6.752a1 1 0 0 1-1.447.9L15 14v-4z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M3 8a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const CheckCircleIcon = ({ size = 56, color = '#22C55E' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" />
    <Path d="M8 12l3 3 5-5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export default function VerifyScreen() {
  useAndroidBack();
  const router = useSafeRouter();
  const { type } = useLocalSearchParams<{ type: 'selfie' | 'video' }>();
  const { updateDocStatus, updateDocUri, selfieStatus, videoKycStatus } = useDocStore();

  const isSelfie = type === 'selfie';
  const currentStatus = isSelfie ? selfieStatus : videoKycStatus;
  const isUploaded = currentStatus.toUpperCase() !== 'NOT UPLOADED';

  const [loading, setLoading] = useState(false);

  const requestCameraPermission = async () => {
    const { status, canAskAgain } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      if (!canAskAgain) {
        Alert.alert(
          'Camera Access Required',
          'Please enable camera access in your device Settings.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => Linking.openSettings() },
          ]
        );
      } else {
        Alert.alert('Permission Required', 'Please allow camera access.');
      }
      return false;
    }
    return true;
  };

  const handleCapture = async () => {
    const granted = await requestCameraPermission();
    if (!granted) return;

    setLoading(true);
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: isSelfie ? ['images'] : ['videos'],
        allowsEditing: true,
        quality: 0.8,
        cameraType: isSelfie ? ImagePicker.CameraType.front : ImagePicker.CameraType.back,
      });

      if (!result.canceled && result.assets[0]) {
        const uri = result.assets[0].uri;
        const key = isSelfie ? 'selfie' : 'videoKyc';
        updateDocUri(key, uri);
        updateDocStatus(key, 'Pending');
        router.back();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <GradientBackground style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity activeOpacity={1} onPress={() => router.back()} style={styles.backButton}>
            <BackArrowIcon size={24} color="#0F172A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{isSelfie ? 'Selfie Verification' : 'Video KYC'}</Text>
        </View>

        <View style={styles.content}>
          <View style={styles.card}>
            {/* Icon */}
            <View style={styles.iconCircle}>
              {isSelfie ? <CameraIcon size={36} color="rgba(26, 15, 163, 1.00)" /> : <VideoIcon size={36} color="rgba(26, 15, 163, 1.00)" />}
            </View>

            <Text style={styles.title}>
              {isSelfie ? 'Take a Selfie' : 'Record Video KYC'}
            </Text>
            <Text style={styles.desc}>
              {isSelfie
                ? 'Please take a clear selfie in good lighting. Make sure your face is clearly visible.'
                : 'Record a short video saying your name and date of birth for identity verification.'}
            </Text>

            {/* Instructions */}
            <View style={styles.tipsBox}>
              <Text style={styles.tipsTitle}>TIPS</Text>
              {isSelfie ? (
                <>
                  <Text style={styles.tip}>• Face the camera directly</Text>
                  <Text style={styles.tip}>• Ensure good lighting</Text>
                  <Text style={styles.tip}>• Remove glasses or hat</Text>
                  <Text style={styles.tip}>• Plain background preferred</Text>
                </>
              ) : (
                <>
                  <Text style={styles.tip}>• Speak clearly and slowly</Text>
                  <Text style={styles.tip}>• Say your full name and DOB</Text>
                  <Text style={styles.tip}>• Keep video under 30 seconds</Text>
                  <Text style={styles.tip}>• Ensure good lighting</Text>
                </>
              )}
            </View>

            {isUploaded && (
              <View style={styles.successRow}>
                <CheckCircleIcon size={22} color="#22C55E" />
                <Text style={styles.successText}>
                  {isSelfie ? 'Selfie captured' : 'Video recorded'} — Pending verification
                </Text>
              </View>
            )}

            <TouchableOpacity activeOpacity={1}
              style={styles.captureBtn}
              onPress={handleCapture}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  {isSelfie
                    ? <CameraIcon size={20} color="#FFFFFF" />
                    : <VideoIcon size={20} color="#FFFFFF" />}
                  <Text style={styles.captureBtnText}>
                    {isUploaded
                      ? (isSelfie ? 'Retake Selfie' : 'Re-record Video')
                      : (isSelfie ? 'Open Camera' : 'Start Recording')}
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1, backgroundColor: 'transparent' },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  backButton: { marginRight: 12 },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
  },

  content: {
    flex: 1,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },

  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },

  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 10,
    textAlign: 'center',
  },

  desc: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
    paddingHorizontal: 8,
  },

  tipsBox: {
    width: '100%',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  tipsTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 1,
    marginBottom: 8,
  },
  tip: {
    fontSize: 13,
    color: '#475569',
    marginBottom: 4,
    lineHeight: 18,
  },

  successRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    width: '100%',
  },
  successText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#16A34A',
    flex: 1,
  },

  captureBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1A0FA3',
    borderRadius: 14,
    paddingVertical: 16,
    width: '100%',
    gap: 10,
  },
  captureBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
