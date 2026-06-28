import { useSafeRouter } from '@/hooks/useSafeRouter';
import { useCallback, useRef, useEffect } from 'react';
import { BackHandler } from 'react-native';
import {  usePathname, useFocusEffect } from 'expo-router';

export function useAndroidBack(customAction?: () => void) {
  const router = useSafeRouter();
  const pathname = usePathname();
  
  const customActionRef = useRef(customAction);
  
  useEffect(() => {
    customActionRef.current = customAction;
  }, [customAction]);
  
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (customActionRef.current) {
          customActionRef.current();
          return true; // Return true to stop default back navigation
        } else {
          if (router.canGoBack()) {
            router.back();
            return true;
          }
          
          // Fallback logic for nested screens if navigation stack history is empty
          if (pathname) {
            if (pathname.includes('(tabs)') || pathname.includes('/tabs/')) {
              router.replace('/(tabs)');
              return true;
            }
            if (pathname.includes('(dashboard)') || pathname.includes('/dashboard/')) {
              router.replace('/(dashboard)');
              return true;
            }
          }
          return false; // Let default behavior happen if can't go back
        }
      };

      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => subscription.remove();
    }, [router, pathname])
  );
}
