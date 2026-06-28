import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { BackArrowIcon, EnvelopeIcon } from '@/components/ui/Icons';
import { useAndroidBack } from '@/hooks/useAndroidBack';

export default function NotificationsScreen() {
  useAndroidBack();
  const router = useSafeRouter();

  // Mock list of notifications matching the screenshot pattern
  const NOTIFICATIONS = [
    {
      id: '1',
      title: 'Cheat Code. 🎮',
      body: 'Up, Down, Left, Right... or just book a Bike-Taxi to skip traffic levels.',
      time: '1 days ago',
    },
    {
      id: '2',
      title: 'Cheat Code. 🎮',
      body: 'Up, Down, Left, Right... or just book a Bike-Taxi to skip traffic levels.',
      time: '1 days ago',
    },
    {
      id: '3',
      title: 'Cheat Code. 🎮',
      body: 'Up, Down, Left, Right... or just book a Bike-Taxi to skip traffic levels.',
      time: '1 days ago',
    },
    {
      id: '4',
      title: 'Cheat Code. 🎮',
      body: 'Up, Down, Left, Right... or just book a Bike-Taxi to skip traffic levels.',
      time: '1 days ago',
    },
    {
      id: '5',
      title: 'Cheat Code. 🎮',
      body: 'Up, Down, Left, Right... or just book a Bike-Taxi to skip traffic levels.',
      time: '1 days ago',
    },
    {
      id: '6',
      title: 'Cheat Code. 🎮',
      body: 'Up, Down, Left, Right... or just book a Bike-Taxi to skip traffic levels.',
      time: '1 days ago',
    },
  ];

  return (
    <GradientBackground style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity activeOpacity={1} onPress={() => router.back()} style={styles.backButton}>
            <BackArrowIcon size={24} color="#0F172A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Notifications</Text>
        </View>

        {/* Notifications Card Container */}
        <View style={styles.cardContainer}>
          <ScrollView 
            showsVerticalScrollIndicator={false} 
            contentContainerStyle={styles.scrollContent}
          >
            {NOTIFICATIONS.map((item, index) => {
              const isLast = index === NOTIFICATIONS.length - 1;
              return (
                <View 
                  key={item.id} 
                  style={[
                    styles.notificationItem, 
                    !isLast && styles.borderBottom,
                    isLast && styles.lastItemRadius
                  ]}
                >
                  <View style={styles.iconWrapper}>
                    <EnvelopeIcon size={20} color="rgba(26, 15, 163, 1.00)" />
                  </View>
                  <View style={styles.contentWrapper}>
                    <Text style={styles.titleText}>{item.title}</Text>
                    <Text style={styles.bodyText}>{item.body}</Text>
                    <Text style={styles.timeText}>{item.time}</Text>
                  </View>
                </View>
              );
            })}
          </ScrollView>
        </View>

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
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
  },
  backButton: {
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
  },
  cardContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    ...Platform.select({
      ios: {
        boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.05)',
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)',
      },
    }),
  },
  scrollContent: {
    flexGrow: 1,
  },
  notificationItem: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  lastItemRadius: {
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  contentWrapper: {
    flex: 1,
  },
  titleText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  bodyText: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 18,
    marginBottom: 6,
  },
  timeText: {
    fontSize: 11,
    color: '#94A3B8',
  },
});
