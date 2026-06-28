import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { BackArrowIcon } from '@/components/ui/Icons';
import Svg, { Rect, Defs, LinearGradient as SvgLinearGradient, Stop } from 'react-native-svg';
import { useAndroidBack } from '@/hooks/useAndroidBack';

export default function HozifyRewardsScreen() {
  useAndroidBack(() => router.back());
  const router = useSafeRouter();

  return (
    <GradientBackground style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        
        <View style={styles.header}>
          <TouchableOpacity activeOpacity={1} onPress={() => router.back()} style={styles.backButton}>
            <BackArrowIcon size={24} color="#0F172A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Hozify Rewards</Text>
          
          <TouchableOpacity activeOpacity={1} style={styles.helpBtn}>
            <View style={StyleSheet.absoluteFill}>
              <Svg height="100%" width="100%" style={{ borderRadius: 8 }}>
                <Defs>
                  <SvgLinearGradient id="grad" x1="0" y1="0" x2="1" y2="0">
                    <Stop offset="0" stopColor="#F97316" stopOpacity="1" />
                    <Stop offset="1" stopColor="#FBBF24" stopOpacity="1" />
                  </SvgLinearGradient>
                </Defs>
                <Rect width="100%" height="100%" fill="url(#grad)" rx="8" />
              </Svg>
            </View>
            <Text style={styles.helpBtnText}>Help</Text>
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          {/* Health Insurance Card */}
          <TouchableOpacity activeOpacity={1} style={[styles.rewardCard, { backgroundColor: '#E4F3E8' }]}>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Health{'\n'}Insurance</Text>
              <Text style={styles.cardDesc}>For you and your family</Text>
              <View style={styles.btnWrapper}>
                <View style={styles.knowMoreBtn}>
                  <Text style={styles.knowMoreText}>Know More</Text>
                </View>
              </View>
            </View>
            <View style={styles.imagePlaceholder}>
              <Image 
                source={{ uri: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&q=80' }} 
                style={styles.cardImage} 
                resizeMode="cover"
              />
              <Svg height="100%" width="100%" style={StyleSheet.absoluteFill}>
                <Defs>
                  <SvgLinearGradient id="grad-card1" x1="0" y1="0" x2="1" y2="0">
                    <Stop offset="0" stopColor="#E4F3E8" stopOpacity="1" />
                    <Stop offset="0.3" stopColor="#E4F3E8" stopOpacity="0" />
                  </SvgLinearGradient>
                </Defs>
                <Rect width="100%" height="100%" fill="url(#grad-card1)" />
              </Svg>
            </View>
          </TouchableOpacity>

          {/* Accidental Insurance Card */}
          <TouchableOpacity activeOpacity={1} style={[styles.rewardCard, { backgroundColor: '#FFF0DE' }]}>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Accidental{'\n'}Insurance</Text>
              <Text style={styles.cardDesc}>Stay protected on ride</Text>
              <View style={styles.btnWrapper}>
                <View style={styles.knowMoreBtn}>
                  <Text style={styles.knowMoreText}>Know More</Text>
                </View>
              </View>
            </View>
            <View style={styles.imagePlaceholder}>
              <Image 
                source={{ uri: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=400&q=80' }} 
                style={styles.cardImage} 
                resizeMode="cover"
              />
              <Svg height="100%" width="100%" style={StyleSheet.absoluteFill}>
                <Defs>
                  <SvgLinearGradient id="grad-card2" x1="0" y1="0" x2="1" y2="0">
                    <Stop offset="0" stopColor="#FFF0DE" stopOpacity="1" />
                    <Stop offset="0.3" stopColor="#FFF0DE" stopOpacity="0" />
                  </SvgLinearGradient>
                </Defs>
                <Rect width="100%" height="100%" fill="url(#grad-card2)" />
              </Svg>
            </View>
          </TouchableOpacity>

          {/* Medicine Discount Card */}
          <TouchableOpacity activeOpacity={1} style={[styles.rewardCard, { backgroundColor: '#F3E1F5' }]}>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Medicine{'\n'}Discount</Text>
              <Text style={styles.cardDesc}>Up to 10% discount on medicines at Apollo medicals.</Text>
              <View style={styles.btnWrapper}>
                <View style={styles.knowMoreBtn}>
                  <Text style={styles.knowMoreText}>Know More</Text>
                </View>
              </View>
            </View>
            <View style={styles.imagePlaceholder}>
              <Image 
                source={{ uri: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80' }} 
                style={styles.cardImage} 
                resizeMode="cover"
              />
              <Svg height="100%" width="100%" style={StyleSheet.absoluteFill}>
                <Defs>
                  <SvgLinearGradient id="grad-card3" x1="0" y1="0" x2="1" y2="0">
                    <Stop offset="0" stopColor="#F3E1F5" stopOpacity="1" />
                    <Stop offset="0.3" stopColor="#F3E1F5" stopOpacity="0" />
                  </SvgLinearGradient>
                </Defs>
                <Rect width="100%" height="100%" fill="url(#grad-card3)" />
              </Svg>
            </View>
          </TouchableOpacity>

        </ScrollView>
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1,  },
  
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 16 },
  backButton: { marginRight: 12 },
  headerTitle: { fontSize: 16, fontWeight: '800', color: '#0F172A', flex: 1 },
  
  helpBtn: { paddingHorizontal: 16, paddingVertical: 6, borderRadius: 8, overflow: 'hidden', justifyContent: 'center', alignItems: 'center' },
  helpBtnText: { color: '#FFFFFF', fontSize: 11, fontWeight: '700' },
 
  scrollContent: { paddingHorizontal: 16, paddingBottom: 40 },
 
  rewardCard: { flexDirection: 'row', borderRadius: 20, marginBottom: 16, overflow: 'hidden', height: 180 },
  cardContent: { flex: 1.1, padding: 20, justifyContent: 'center' },
  cardTitle: { fontSize: 16, fontWeight: '800', color: '#000000', marginBottom: 8, lineHeight: 20 },
  cardDesc: { fontSize: 11, color: '#334155', marginBottom: 16, lineHeight: 16 },
  
  btnWrapper: { alignItems: 'flex-start' },
  knowMoreBtn: { backgroundColor: '#FFFFFF', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 16, boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)', elevation: 2 },
  knowMoreText: { fontSize: 11, fontWeight: '700', color: '#0F172A' },
 
  imagePlaceholder: { flex: 0.9, position: 'relative' },
  cardImage: { width: '100%', height: '100%' },
});
