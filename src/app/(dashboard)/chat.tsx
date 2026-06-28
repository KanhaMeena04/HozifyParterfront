import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, Image, TextInput, KeyboardAvoidingView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { BackArrowIcon } from '@/components/ui/Icons';
import Svg, { Path, Circle } from 'react-native-svg';
import { useAndroidBack } from '@/hooks/useAndroidBack';

const PhoneIcon = ({ color = 'rgba(26, 15, 163, 1.00)' }) => (
  <Svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <Path d="M3 5.5C3 14.0604 9.93959 21 18.5 21C18.8862 21 19.2691 20.9859 19.6483 20.9581C20.0834 20.9262 20.3009 20.9103 20.493 20.7963C20.763 20.6361 20.9759 20.3606 21.0598 20.0607C21.1192 19.8487 21.0456 19.6277 20.8983 19.1856L19.5103 15.021C19.3879 14.6539 19.3267 14.4703 19.2135 14.3312C19.1136 14.2084 18.9806 14.1166 18.8285 14.0655C18.656 14.0076 18.4624 14.027 18.0751 14.0657L15.3582 14.3374C14.8697 14.3862 14.3822 14.1205 14.1122 13.6828L10.3172 7.53323C10.0472 7.09553 10.1118 6.54144 10.48 6.13643L12.5186 3.89412C12.7844 3.6017 12.8361 3.41162 12.8306 3.23896C12.8257 3.08643 12.7766 2.94052 12.6896 2.81765C12.5912 2.67858 12.4343 2.58444 12.1206 2.39616L8.43501 0.184852C8.03362 -0.0560156 7.83292 -0.17645 7.61803 -0.160161C7.31557 -0.137233 7.03185 0.0469446 6.84542 0.300185C6.71286 0.479261 6.6433 0.68792 6.50417 1.10524L5.61909 3.76044C5.16335 5.12769 5.09919 5.48512 5.03157 5.8694C4.94584 6.35677 4.90807 6.85244 4.9189 7.34861C4.93339 8.01248 5.03352 8.70034 5.23377 10.076Z" fill={color} />
  </Svg>
);

const ClipIcon = ({ color = '#94A3B8' }) => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <Path d="M15.1716 7.41421L8.10051 14.4853C7.31946 15.2663 7.31946 16.5327 8.1005 17.3137C8.88155 18.0948 10.1479 18.0948 10.9289 17.3137L17.9997 10.243C19.5619 8.68087 19.5619 6.1477 17.9997 4.58549C16.4375 3.02327 13.9044 3.02327 12.3422 4.58549L5.27107 11.6566C2.92793 14.0001 2.92793 17.799 5.27107 20.1421C7.61421 22.4853 11.4132 22.4853 13.7563 20.1421L20.1205 13.778" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const EmojiIcon = ({ color = '#94A3B8' }) => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="1.5" />
    <Path d="M8 14C8 14 9.5 16 12 16C14.5 16 16 14 16 14" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    <Circle cx="9" cy="9" r="1" fill={color} />
    <Circle cx="15" cy="9" r="1" fill={color} />
  </Svg>
);

const SendIcon = ({ color = '#FFFFFF' }) => (
  <Svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <Path d="M22 2L11 13" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M22 2L15 22L11 13L2 9L22 2Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export default function ChatScreen() {
  useAndroidBack();
  const router = useSafeRouter();
  const [message, setMessage] = useState('');

  return (
    <GradientBackground style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flexArea}>
          
          <View style={styles.header}>
            <TouchableOpacity activeOpacity={1} onPress={() => router.back()} style={styles.backButton}>
              <BackArrowIcon size={24} color="#0F172A" />
            </TouchableOpacity>
            
            <View style={styles.customerCard}>
              <Image source={{ uri: 'https://i.pravatar.cc/150?img=12' }} style={styles.avatar} />
              <View>
                <Text style={styles.customerName}>Rahul Sharma</Text>
                <View style={styles.onlineStatusRow}>
                  <View style={styles.onlineDot} />
                  <Text style={styles.onlineText}>Online</Text>
                </View>
              </View>
            </View>

            <TouchableOpacity activeOpacity={1} style={styles.iconBtn}>
              <PhoneIcon />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.chatArea} contentContainerStyle={styles.chatContent}>
            
            <View style={styles.messageReceived}>
              <Text style={styles.messageTextDark}>Hello, I am facing issue with my AC. It's not cooling properly.</Text>
            </View>
            <Text style={styles.timeTextReceived}>10:20 AM</Text>

            <View style={styles.messageSent}>
              <Text style={styles.messageTextLight}>Hello Rahul, I am on the way and will reach in 10 mins.</Text>
            </View>
            <Text style={styles.timeTextSent}>10:21 AM</Text>

            <View style={styles.messageReceived}>
              <Text style={styles.messageTextDark}>Okay, thank you!</Text>
            </View>
            <Text style={styles.timeTextReceived}>10:21 AM</Text>

            <View style={styles.messageSent}>
              <Text style={styles.messageTextLight}>Please make sure someone is at home.</Text>
            </View>
            <Text style={styles.timeTextSent}>10:22 AM</Text>

            <View style={styles.messageReceived}>
              <Text style={styles.messageTextDark}>Yes, I will be here.</Text>
            </View>
            <Text style={styles.timeTextReceived}>10:22 AM</Text>

          </ScrollView>

          <View style={styles.inputArea}>
            <View style={styles.inputBox}>
              <TextInput 
                style={styles.textInput}
                placeholder="Type a message..."
                placeholderTextColor="#94A3B8"
                value={message}
                onChangeText={setMessage}
              />
              <TouchableOpacity activeOpacity={1} style={styles.actionIcon}><ClipIcon /></TouchableOpacity>
              <TouchableOpacity activeOpacity={1} style={styles.actionIcon}><EmojiIcon /></TouchableOpacity>
              <TouchableOpacity activeOpacity={1} style={styles.sendBtn}>
                <SendIcon />
              </TouchableOpacity>
            </View>
          </View>

        </KeyboardAvoidingView>
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1,  },
  flexArea: { flex: 1 },
  
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 16 },
  backButton: { marginRight: 12 },
  
  customerCard: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 24, marginRight: 12 },
  avatar: { width: 32, height: 32, borderRadius: 16, marginRight: 12 },
  customerName: { fontSize: 13, fontWeight: '700', color: '#0F172A', marginBottom: 2 },
  onlineStatusRow: { flexDirection: 'row', alignItems: 'center' },
  onlineDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(26, 15, 163, 1.00)', marginRight: 4 },
  onlineText: { fontSize: 10, fontWeight: '700', color: 'rgba(26, 15, 163, 1.00)' },
  
  iconBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#EEF2FF', justifyContent: 'center', alignItems: 'center' },

  chatArea: { flex: 1 },
  chatContent: { paddingHorizontal: 20, paddingVertical: 16, paddingBottom: 32 },

  messageReceived: { alignSelf: 'flex-start', backgroundColor: '#EEF2FF', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 20, borderBottomLeftRadius: 4, maxWidth: '80%', marginBottom: 4 },
  messageTextDark: { fontSize: 13, color: '#0F172A', lineHeight: 20 },
  timeTextReceived: { fontSize: 10, color: '#94A3B8', marginBottom: 16, marginLeft: 4 },

  messageSent: { alignSelf: 'flex-end', backgroundColor: 'rgba(26, 15, 163, 1.00)', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 20, borderBottomRightRadius: 4, maxWidth: '80%', marginBottom: 4 },
  messageTextLight: { fontSize: 13, color: '#FFFFFF', lineHeight: 20 },
  timeTextSent: { fontSize: 10, color: '#94A3B8', marginBottom: 16, alignSelf: 'flex-end', marginRight: 4 },

  inputArea: { paddingHorizontal: 20, paddingBottom: 24, paddingTop: 8 },
  inputBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 24, paddingHorizontal: 8, paddingVertical: 8 },
  textInput: { flex: 1, fontSize: 13, color: '#0F172A', paddingHorizontal: 12 },
  actionIcon: { paddingHorizontal: 8 },
  sendBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(26, 15, 163, 1.00)', justifyContent: 'center', alignItems: 'center', marginLeft: 4 },
});
