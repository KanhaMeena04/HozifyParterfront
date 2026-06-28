import { Tabs } from 'expo-router';
import { HomeTabIcon, BookingsTabIcon, WalletTabIcon, ProfileTabIcon } from '@/components/ui/Icons';
import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function DashboardLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      backBehavior="history"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E2E8F0',
          height: 80 + insets.bottom,
          paddingTop: 10,
          paddingBottom: insets.bottom > 0 ? insets.bottom + 12 : 20,
          display: ['index', 'bookings', 'wallet', 'profile'].includes(route.name) ? 'flex' : 'none',
        },
        tabBarActiveTintColor: 'rgba(26, 15, 163, 1.00)',
        tabBarInactiveTintColor: '#94A3B8',
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 2,
        },
      })}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <HomeTabIcon size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="bookings"
        options={{
          title: 'Bookings',
          tabBarIcon: ({ color }) => <BookingsTabIcon size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="wallet"
        options={{
          title: 'Wallet',
          tabBarIcon: ({ color }) => <WalletTabIcon size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <ProfileTabIcon size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="help"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="passbook"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="referral"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="referral-passbook"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="profile-details"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="rate-card"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="help-advanced"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="faq"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="support-chat"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="preferences"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="safety"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="my-rating"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="demand-planner"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="orders-list"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="performance"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="service-manager"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="emergency-contacts"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="before-after"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="work-in-progress"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="add-extra-service"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="add-material"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="invoice-summary"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="collect-payment"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="customer-signature"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="payment-success"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="job-completed"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="payment-method"
        options={{
          href: null,
        }}
      />

      <Tabs.Screen
        name="incentives"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="hozify-rewards"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="rewards-plan"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="earnings"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="account-status"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="filters"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="application-status"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="location"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="instructions"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="booking-earnings"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="booking-history"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="coming-soon"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="developer-tools"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="rejected-reasons"
        options={{ href: null }}
      />
      <Tabs.Screen name="work-progress-photos" options={{ href: null }} />
      <Tabs.Screen name="live-bookings" options={{ href: null }} />
      <Tabs.Screen name="seller/material-dispatch" options={{ href: null }} />
      <Tabs.Screen name="seller/quotation-details" options={{ href: null }} />
      <Tabs.Screen name="seller/quotation-requests" options={{ href: null }} />
      <Tabs.Screen name="seller/submit-quotation" options={{ href: null }} />
      <Tabs.Screen name="services/add-partner-services" options={{ href: null }} />
      <Tabs.Screen name="wallet/bank-accounts" options={{ href: null }} />
      <Tabs.Screen name="wallet/fraud-alert" options={{ href: null }} />
      <Tabs.Screen name="wallet/withdrawal" options={{ href: null }} />
      <Tabs.Screen name="material-provider" options={{ href: null }} />
      <Tabs.Screen name="raise-material-request" options={{ href: null }} />
      <Tabs.Screen name="quotation-submitted" options={{ href: null }} />
      <Tabs.Screen name="quotation-summary" options={{ href: null }} />
      <Tabs.Screen name="approved-quotation" options={{ href: null }} />
      <Tabs.Screen name="order-history" options={{ href: null }} />
      <Tabs.Screen name="quotation-history" options={{ href: null }} />
      <Tabs.Screen name="business-details" options={{ href: null }} />
      <Tabs.Screen name="app-shortcuts" options={{ href: null }} />
      <Tabs.Screen name="favourites" options={{ href: null }} />
      <Tabs.Screen name="about" options={{ href: null }} />
    </Tabs>
  );
}
