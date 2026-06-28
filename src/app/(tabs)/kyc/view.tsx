import React, { useState } from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { Card } from '@/components/ui/Card';
import { BackArrowIcon, BadgeCheckIcon } from '@/components/ui/Icons';
import { useAndroidBack } from '@/hooks/useAndroidBack';

export default function KycDocumentView() {
  useAndroidBack();
  const router = useSafeRouter();
  const [showImages, setShowImages] = useState(false);

  const handleBack = () => {
    router.back();
  };

  return (
    <GradientBackground style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity activeOpacity={1} onPress={handleBack} style={styles.backButton}>
              <BackArrowIcon size={24} color="#0F172A" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Aadhar card</Text>
          </View>
          <TouchableOpacity activeOpacity={1} style={styles.helpButton} onPress={() => router.push('/(dashboard)/help')}>
            <Text style={styles.helpText}>Help</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Card style={styles.card} variant="default">
            <View style={styles.cardContent}>
              
              <View style={styles.badgeWrapper}>
                <BadgeCheckIcon size={48} color="#22C55E" />
              </View>

              <Text style={styles.verifiedTitle}>Your Aadhar Card is verified</Text>

              <View style={styles.numberBox}>
                <View style={styles.numberBoxAccent} />
                <Text style={styles.numberText}>86293424XXXX</Text>
              </View>

              <Text style={styles.verifiedDate}>Verified on</Text>

              <TouchableOpacity activeOpacity={1} 
                style={styles.viewDocButton} 
                onPress={() => setShowImages(!showImages)}
              >
                <Text style={styles.viewDocText}>
                  {showImages ? 'Hide Aadhar Card' : 'View Aadhar Card'}
                </Text>
              </TouchableOpacity>

              {showImages && (
                <View style={styles.imagesContainer}>
                  <Text style={styles.imageLabel}>Front Aadhar Card Image</Text>
                  <View style={styles.imageBox}>
                    {/* Placeholder for actual image */}
                    <View style={styles.placeholderImg}>
                      <Text style={styles.placeholderText}>FRONT IMAGE</Text>
                    </View>
                  </View>

                  <Text style={styles.imageLabel}>Back Aadhar Card Image</Text>
                  <View style={styles.imageBox}>
                    {/* Placeholder for actual image */}
                    <View style={styles.placeholderImg}>
                      <Text style={styles.placeholderText}>BACK IMAGE</Text>
                    </View>
                  </View>
                </View>
              )}

            </View>
          </Card>
        </ScrollView>
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
    
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
  },
  helpButton: {
    backgroundColor: '#F97316', // orange 500
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 8,
  },
  helpText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 12,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  card: {
    borderRadius: 24,
    padding: 24,
  },
  cardContent: {
    alignItems: 'center',
  },
  badgeWrapper: {
    marginBottom: 16,
  },
  verifiedTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 24,
  },
  numberBox: {
    flexDirection: 'row',
    width: '100%',
    height: 48,
    borderWidth: 1.5,
    borderColor: '#0F172A',
    borderRadius: 8,
    overflow: 'hidden',
    alignItems: 'center',
    marginBottom: 16,
  },
  numberBoxAccent: {
    width: 12,
    height: '100%',
    backgroundColor: 'rgba(26, 15, 163, 1.00)', // dark blue
  },
  numberText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: 2,
    marginRight: 12, // balance the left accent
  },
  verifiedDate: {
    fontSize: 13,
    color: '#22C55E', // green
    fontWeight: '600',
    marginBottom: 24,
  },
  viewDocButton: {
    width: '100%',
    backgroundColor: '#EFF6FF', // blue 50
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  viewDocText: {
    color: '#2563EB', // blue 600
    fontSize: 14,
    fontWeight: '600',
  },
  imagesContainer: {
    width: '100%',
    marginTop: 24,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 24,
  },
  imageLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 12,
  },
  imageBox: {
    width: '100%',
    height: 200,
    borderWidth: 4,
    borderColor: 'rgba(26, 15, 163, 1.00)',
    borderRadius: 12,
    marginBottom: 24,
    overflow: 'hidden',
  },
  placeholderImg: {
    flex: 1,
    backgroundColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#94A3B8',
    fontWeight: '700',
    letterSpacing: 1,
  },
});
