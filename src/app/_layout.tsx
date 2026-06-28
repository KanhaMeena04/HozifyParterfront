import { useSafeRouter } from '@/hooks/useSafeRouter';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useColorScheme, Platform, BackHandler, View, Text, TouchableOpacity } from 'react-native';

// Global fix: prevent TouchableOpacity dim/blur on press across the whole app
(TouchableOpacity as any).defaultProps = {
  ...((TouchableOpacity as any).defaultProps || {}),
  activeOpacity: 0.85,
};
import { Stack,  usePathname, ErrorBoundaryProps } from 'expo-router';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useEffect } from 'react';

// Suppress React 19 / react-native-web third-party attribute and deprecation warnings
if (Platform.OS === 'web') {
  const isTargetWarning = (args: any[]) => {
    return args.some(arg => {
      if (!arg) return false;
      const str = typeof arg === 'string' ? arg : String(arg);
      return (
        str.includes('tintColor is deprecated') ||
        str.includes('resizeMode is deprecated') ||
        str.includes('TouchableWithoutFeedback is deprecated') ||
        str.includes('collapsable') ||
        str.includes('non-boolean attribute')
      );
    });
  };

  const originalError = console.error;
  console.error = (...args: any[]) => {
    if (isTargetWarning(args)) {
      return;
    }
    originalError(...args);
  };

  const originalWarn = console.warn;
  console.warn = (...args: any[]) => {
    if (isTargetWarning(args)) {
      return;
    }
    originalWarn(...args);
  };
}

function AppContent() {
  const router = useSafeRouter();
  const pathname = usePathname();

  useEffect(() => {
    const onBackPress = () => {
      const exitPaths = [
        '/',
        '/index',
        '/(auth)/login',
        '/login',
        '/(auth)/role-selection',
        '/role-selection',
        '/(tabs)',
        '/(dashboard)',
        '/tabs',
        '/dashboard'
      ];

      // Normalize path to check if we should exit
      const normalizedPath = pathname ? pathname.replace(/\/$/, '') : '';
      if (normalizedPath === '' || exitPaths.some(p => normalizedPath === p || normalizedPath.endsWith(p))) {
        BackHandler.exitApp();
        return true;
      }

      if (router.canGoBack()) {
        router.back();
        return true;
      }

      if (pathname) {
        if (pathname.includes('(tabs)') || pathname.includes('/tabs/')) {
          router.replace('/(tabs)');
          return true;
        }
        if (pathname.includes('(dashboard)') || pathname.includes('/dashboard/')) {
          router.replace('/(dashboard)');
          return true;
        }
        if (pathname.includes('(auth)') || pathname.includes('/auth/')) {
          router.replace('/(auth)/login');
          return true;
        }
      }

      return false;
    };

    const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => subscription.remove();
  }, [router, pathname]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <SafeAreaProvider>
      <ThemeProvider value={DefaultTheme}>
        <AppContent />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <Text style={{ fontSize: 64, marginBottom: 16 }}>⚠️</Text>
      <Text style={{ fontSize: 20, fontWeight: '700', color: '#0F172A', marginBottom: 8 }}>Something went wrong</Text>
      <Text style={{ fontSize: 14, color: '#64748B', textAlign: 'center', marginBottom: 24 }}>
        We encountered an unexpected error. Don't worry, you can try again.
      </Text>
      <TouchableOpacity activeOpacity={1} 
        onPress={retry}
        style={{ backgroundColor: 'rgba(26, 15, 163, 1.00)', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 12 }}
      >
        <Text style={{ color: '#FFFFFF', fontWeight: '600', fontSize: 16 }}>Try Again</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
