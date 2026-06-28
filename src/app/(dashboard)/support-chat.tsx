import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { BackArrowIcon } from '@/components/ui/Icons';
import Svg, { Path } from 'react-native-svg';
import { useAndroidBack } from '@/hooks/useAndroidBack';

const SupportAvatarIcon = ({ size = 32, color = 'rgba(26, 15, 163, 1.00)' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM17.93 16C17.7 16.52 17.15 16.89 16.5 16.97C16.48 16.97 16.45 16.98 16.43 16.98C16.03 16.99 15.6 16.8 15.34 16.48L13.78 14.61C13.56 14.35 13.59 13.97 13.84 13.75C14.1 13.53 14.48 13.56 14.7 13.82L16 15.39C16.14 15.55 16.36 15.59 16.56 15.49C16.74 15.39 16.85 15.2 16.85 15V11C16.85 8.33 14.68 6.16 12 6.16C9.32 6.16 7.15 8.33 7.15 11V15C7.15 15.33 7.37 15.65 7.69 15.78C7.99 15.89 8.35 15.79 8.56 15.54L10 13.82C10.22 13.56 10.61 13.53 10.86 13.75C11.12 13.97 11.15 14.35 10.93 14.61L9.36 16.48C8.94 16.98 8.21 17.18 7.57 16.92C6.9 16.65 6.45 15.98 6.45 15.25V11C6.45 7.94 8.94 5.45 12 5.45C15.06 5.45 17.55 7.94 17.55 11V15C17.55 15.37 17.75 15.7 17.93 16Z" fill="#FFFFFF" />
  </Svg>
);

export default function SupportChatScreen() {
  useAndroidBack();
  const router = useSafeRouter();

  const QUICK_REPLIES = [
    'My fare increased during the service',
    'Driver asked for extra cash',
    'I was charged a wait time fee',
    'I paid twice to caption',
    'My issue is not listed'
  ];

  return (
    <GradientBackground style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        
        <View style={styles.header}>
          <TouchableOpacity activeOpacity={1} onPress={() => router.back()} style={styles.backButton}>
            <BackArrowIcon size={24} color="#0F172A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Support Chat</Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          <Text style={styles.dateLabel}>Today</Text>

          {/* Bot Messages */}
          <View style={styles.messageRow}>
            <View style={styles.avatarBox}>
              <SupportAvatarIcon />
            </View>
            <View style={styles.messageBubble}>
              <Text style={styles.messageText}>Hi ramu, Welcome to hozify support</Text>
              <Text style={styles.messageTime}>9:29</Text>
            </View>
          </View>

          <View style={styles.messageRow}>
            <View style={styles.avatarBox}>
              <SupportAvatarIcon />
            </View>
            <View style={styles.messageBubble}>
              <Text style={styles.messageText}>Can you please specify the issue you are facing regarding your fare</Text>
              <Text style={styles.messageTime}>9:29</Text>
            </View>
          </View>

          {/* Quick Replies */}
          <View style={styles.quickRepliesContainer}>
            {QUICK_REPLIES.map((reply, index) => (
              <TouchableOpacity activeOpacity={1} key={index} style={styles.chipBtn}>
                <Text style={styles.chipText}>{reply}</Text>
              </TouchableOpacity>
            ))}
          </View>

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
  headerTitle: { fontSize: 16, fontWeight: '700', color: '#0F172A', flex: 1 },

  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },

  dateLabel: { textAlign: 'center', fontSize: 11, color: '#0F172A', fontWeight: '500', marginVertical: 24 },

  messageRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 16 },
  avatarBox: { width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(26, 15, 163, 1.00)', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  messageBubble: { backgroundColor: '#FFFFFF', borderRadius: 16, borderTopLeftRadius: 4, padding: 16, maxWidth: '80%' },
  messageText: { fontSize: 12, color: '#0F172A', lineHeight: 18, marginBottom: 4 },
  messageTime: { fontSize: 10, color: '#94A3B8', textAlign: 'right' },

  quickRepliesContainer: { marginTop: 8 },
  chipBtn: { backgroundColor: '#FFFFFF', alignSelf: 'flex-start', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, marginBottom: 12 },
  chipText: { fontSize: 12, color: '#0F172A', fontWeight: '500' },
});
