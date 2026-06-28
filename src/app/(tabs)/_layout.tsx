import { Stack } from 'expo-router';

export default function TabsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="kyc/upload" />
      <Stack.Screen name="kyc/verify" />
    </Stack>
  );
}
