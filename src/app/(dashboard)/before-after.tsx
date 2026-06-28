import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, Image, TextInput, KeyboardAvoidingView, Alert, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { BackArrowIcon } from '@/components/ui/Icons';
import Svg, { Path, Circle } from 'react-native-svg';
import { useAndroidBack } from '@/hooks/useAndroidBack';
import * as ImagePicker from 'expo-image-picker';

import { useLocalSearchParams } from 'expo-router';
import { StorageService } from '@/services/storage.service';
import { Booking } from '@/types/storage.types';

const CameraIcon = ({ color = '#3B82F6' }) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
    <Path d="M23 19C23 20.1046 22.1046 21 21 21H3C1.89543 21 1 20.1046 1 19V8C1 6.89543 1.89543 6 3 6H7L9 3H15L17 6H21C22.1046 6 23 6.89543 23 8V19Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Circle cx="12" cy="13" r="4" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const TrashIcon = ({ color = '#EF4444' }) => (
  <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
    <Path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export default function BeforeAfterScreen() {
  useAndroidBack();
  const router = useSafeRouter();
  const { bookingId } = useLocalSearchParams<{ bookingId: string }>();
  const [booking, setBooking] = React.useState<Booking | null>(null);
  const [notes, setNotes] = useState('');

  // Dynamic before and after photo lists initialized with 1 item each to match the screenshot
  const [beforePhotos, setBeforePhotos] = useState<string[]>([
    'https://images.unsplash.com/photo-1596700057077-bd1c9c0587d5?q=80&w=300&auto=format&fit=crop'
  ]);
  const [afterPhotos, setAfterPhotos] = useState<string[]>([
    'https://images.unsplash.com/photo-1596700057393-db1c5e9b4661?q=80&w=300&auto=format&fit=crop'
  ]);

  React.useEffect(() => {
    const loadData = async () => {
      if (bookingId) {
        const bks = await StorageService.getBookings();
        const bk = bks.find(b => b.bookingId === bookingId || b.bookingId.replace('#', '') === bookingId);
        if (bk) setBooking(bk);
      }
    };
    loadData();
  }, [bookingId]);

  const takePhoto = async () => {
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
      return null;
    }

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        return result.assets[0].uri;
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to launch camera.');
    }
    return null;
  };

  const handleAddBeforePhoto = async () => {
    const uri = await takePhoto();
    if (uri) {
      setBeforePhotos([...beforePhotos, uri]);
    }
  };

  const handleAddAfterPhoto = async () => {
    const uri = await takePhoto();
    if (uri) {
      setAfterPhotos([...afterPhotos, uri]);
    }
  };

  const handleSubmit = async () => {
    if (booking) {
      // Mark as completed
      const updated = { ...booking, status: 'completed' as const };
      await StorageService.saveBooking(updated);
    }
    router.push({
      pathname: '/(dashboard)/job-completed',
      params: { bookingId }
    });
  };

  return (
    <GradientBackground style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flexArea}>
          
          <View style={styles.header}>
            <TouchableOpacity activeOpacity={1} onPress={() => router.back()} style={styles.backButton}>
              <BackArrowIcon size={24} color="#0F172A" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Before & After</Text>
          </View>

          <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            
            <View style={styles.mainCard}>
              
              {/* BEFORE SECTION */}
              <Text style={styles.sectionTitle}>Before</Text>
              <View style={styles.photoGrid}>
                {beforePhotos.map((uri, idx) => (
                  <View key={idx} style={styles.photoContainer}>
                    <Image source={{ uri }} style={styles.photoBox} />
                    <TouchableOpacity activeOpacity={1} style={styles.removeBtn} onPress={() => setBeforePhotos(beforePhotos.filter((_, i) => i !== idx))}>
                      <TrashIcon />
                    </TouchableOpacity>
                  </View>
                ))}
                {beforePhotos.length < 4 && (
                  <TouchableOpacity activeOpacity={1} style={styles.addPhotoBtn} onPress={handleAddBeforePhoto}>
                    <CameraIcon />
                    <Text style={styles.addPhotoText}>Add Photo</Text>
                  </TouchableOpacity>
                )}
              </View>

              <View style={styles.divider} />

              {/* AFTER SECTION */}
              <Text style={styles.sectionTitle}>After</Text>
              <View style={styles.photoGrid}>
                {afterPhotos.map((uri, idx) => (
                  <View key={idx} style={styles.photoContainer}>
                    <Image source={{ uri }} style={styles.photoBox} />
                    <TouchableOpacity activeOpacity={1} style={styles.removeBtn} onPress={() => setAfterPhotos(afterPhotos.filter((_, i) => i !== idx))}>
                      <TrashIcon />
                    </TouchableOpacity>
                  </View>
                ))}
                {afterPhotos.length < 4 && (
                  <TouchableOpacity activeOpacity={1} style={styles.addPhotoBtn} onPress={handleAddAfterPhoto}>
                    <CameraIcon />
                    <Text style={styles.addPhotoText}>Add Photo</Text>
                  </TouchableOpacity>
                )}
              </View>

              <View style={styles.divider} />

              <Text style={styles.notesLabel}>Notes (Optional)</Text>
              <TextInput 
                style={styles.notesInput}
                placeholder="Write notes here..."
                placeholderTextColor="#94A3B8"
                value={notes}
                onChangeText={setNotes}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />

              <TouchableOpacity activeOpacity={1} style={styles.submitBtn} onPress={handleSubmit}>
                <Text style={styles.submitBtnText}>Submit & Complete</Text>
              </TouchableOpacity>

            </View>

            <View style={styles.bottomSpacing} />

          </ScrollView>

        </KeyboardAvoidingView>
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  flexArea: { flex: 1 },
  
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 16 },
  backButton: { marginRight: 12 },
  headerTitle: { fontSize: 16, fontWeight: '700', color: '#0F172A' },

  scrollArea: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, paddingBottom: 20 },

  mainCard: { backgroundColor: '#FFFFFF', borderRadius: 24, padding: 20 },

  sectionTitle: { fontSize: 16, fontWeight: '800', color: '#0F172A', marginBottom: 12 },

  photoGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  photoContainer: { width: '47%', aspectRatio: 1, position: 'relative' },
  photoBox: { width: '100%', height: '100%', borderRadius: 16, backgroundColor: '#F1F5F9' },
  
  removeBtn: { 
    position: 'absolute', 
    top: 8, 
    right: 8, 
    backgroundColor: '#FFFFFF', 
    width: 28, 
    height: 28, 
    borderRadius: 14, 
    justifyContent: 'center', 
    alignItems: 'center', 
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
      android: { elevation: 2 },
    }) 
  },

  addPhotoBtn: { width: '47%', aspectRatio: 1, borderRadius: 16, backgroundColor: '#F8FAFC', borderWidth: 1, borderStyle: 'dashed', borderColor: '#CBD5E1', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' },
  addPhotoText: { color: '#3B82F6', fontSize: 11, fontWeight: '700', marginTop: 8, textAlign: 'center' },

  divider: { height: 1, backgroundColor: '#F8FAFC', marginVertical: 14 },

  notesLabel: { fontSize: 11, color: '#94A3B8', marginBottom: 8 },
  notesInput: { backgroundColor: '#F8FAFC', borderRadius: 16, padding: 16, minHeight: 80, fontSize: 13, color: '#0F172A', marginBottom: 16 },
  submitBtn: { backgroundColor: 'rgba(26, 15, 163, 1.00)', paddingVertical: 16, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginTop: 12 },
  submitBtnText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
  bottomSpacing: { height: 20 },
});
