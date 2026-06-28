import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, Image, Alert, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { useLocalSearchParams } from 'expo-router';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { BackArrowIcon } from '@/components/ui/Icons';
import Svg, { Path, Circle } from 'react-native-svg';
import { useAndroidBack } from '@/hooks/useAndroidBack';
import * as ImagePicker from 'expo-image-picker';

const CameraOutlineIcon = ({ color = 'rgba(26, 15, 163, 1.00)' }) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path d="M23 19C23 20.1046 22.1046 21 21 21H3C1.89543 21 1 20.1046 1 19V8C1 6.89543 1.89543 6 3 6H7L9 3H15L17 6H21C22.1046 6 23 6.89543 23 8V19Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Circle cx="12" cy="13" r="4" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const TrashIcon = ({ color = '#EF4444' }) => (
  <Svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <Path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export default function WorkProgressPhotosScreen() {
  useAndroidBack();
  const router = useSafeRouter();
  const { bookingId } = useLocalSearchParams<{ bookingId: string }>();
  const [photos, setPhotos] = useState<string[]>([]);

  const handleAddPhoto = async () => {
    const { status, canAskAgain } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      if (!canAskAgain) {
        Alert.alert(
          'Camera Access Required',
          'Please enable camera access in your device Settings to take photos.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => Linking.openSettings() },
          ]
        );
      } else {
        Alert.alert('Permission Required', 'Please allow camera access to take photos.');
      }
      return;
    }

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        setPhotos([...photos, result.assets[0].uri]);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to launch camera.');
    }
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const handleContinue = () => {
    router.push({
      pathname: '/(dashboard)/before-after',
      params: { bookingId }
    });
  };

  return (
    <GradientBackground style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        
        <View style={styles.header}>
          <TouchableOpacity activeOpacity={1} onPress={() => router.back()} style={styles.backButton}>
            <BackArrowIcon size={24} color="#0F172A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Work Progress Photos</Text>
        </View>

        <ScrollView 
          showsVerticalScrollIndicator={false} 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.mainCard}>
            <Text style={styles.sectionTitle}>Upload In-Progress Photos</Text>
            <Text style={styles.sectionDesc}>
              Please capture photos showing the current progress of the service. This screen is optional.
            </Text>

            <View style={styles.photoGrid}>
              {photos.map((uri, index) => (
                <View key={index} style={styles.photoContainer}>
                  <Image source={{ uri }} style={styles.photoBox} />
                  <TouchableOpacity activeOpacity={1} style={styles.removeBtn} onPress={() => handleRemovePhoto(index)}>
                    <TrashIcon />
                  </TouchableOpacity>
                </View>
              ))}

              {photos.length < 4 && (
                <TouchableOpacity activeOpacity={1}
                  style={[styles.addPhotoBtn, photos.length === 0 && styles.addPhotoBtnFull]}
                  onPress={handleAddPhoto}
                >
                  <CameraOutlineIcon />
                  <Text style={styles.addPhotoText}>Capture Photo</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          <View style={styles.footerSpacing} />
        </ScrollView>

        {/* Sticky/Fixed Footer Above Tab Bar */}
        <View style={styles.actionFooter}>
          <TouchableOpacity activeOpacity={1} style={styles.skipBtn} onPress={handleContinue}>
            <Text style={styles.skipBtnText}>Skip</Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={1} style={styles.continueBtn} onPress={handleContinue}>
            <Text style={styles.continueBtnText}>Continue</Text>
          </TouchableOpacity>
        </View>

      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 16 },
  backButton: { marginRight: 12 },
  headerTitle: { fontSize: 16, fontWeight: '700', color: '#0F172A', flex: 1 },

  scrollView: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, paddingTop: 8 },

  mainCard: { backgroundColor: '#FFFFFF', borderRadius: 24, padding: 20, borderWidth: 1, borderColor: '#E2E8F0' },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: '#0F172A', marginBottom: 8 },
  sectionDesc: { fontSize: 12, color: '#64748B', lineHeight: 18, marginBottom: 20 },

  photoGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  photoContainer: { width: '47%', aspectRatio: 1, position: 'relative' },
  photoBox: { width: '100%', height: '100%', borderRadius: 16, backgroundColor: '#F1F5F9' },
  removeBtn: { position: 'absolute', top: 8, right: 8, backgroundColor: '#FFFFFF', width: 28, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center', ...Platform.select({
    ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
    android: { elevation: 2 },
    web: { boxShadow: '0px 2px 4px rgba(0,0,0,0.1)' },
  }) },

  addPhotoBtn: { width: '47%', aspectRatio: 1, borderRadius: 16, backgroundColor: '#F8FAFC', borderWidth: 1, borderStyle: 'dashed', borderColor: '#CBD5E1', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' },
  addPhotoBtnFull: { width: '100%', aspectRatio: undefined, paddingVertical: 48 },
  addPhotoText: { color: 'rgba(26, 15, 163, 1.00)', fontSize: 11, fontWeight: '700', marginTop: 8, textAlign: 'center' },

  footerSpacing: { height: 120 }, // Leaves room for the absolute actions footer so content is not cut off

  actionFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: Platform.OS === 'ios' ? 28 : 16,
    flexDirection: 'row',
    gap: 12,
  },
  skipBtn: { flex: 1, height: 48, borderRadius: 12, borderWidth: 1, borderColor: '#CBD5E1', justifyContent: 'center', alignItems: 'center' },
  skipBtnText: { color: '#475569', fontSize: 14, fontWeight: '700' },
  continueBtn: { flex: 2, height: 48, borderRadius: 12, backgroundColor: 'rgba(26, 15, 163, 1.00)', justifyContent: 'center', alignItems: 'center' },
  continueBtnText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' }
});
