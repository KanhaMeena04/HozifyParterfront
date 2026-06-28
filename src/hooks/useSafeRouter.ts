import { useRouter } from 'expo-router';
import { useCallback, useRef } from 'react';

export function useSafeRouter() {
  const router = useRouter();
  const lastNavTime = useRef<number>(0);
  const THROTTLE_MS = 500;

  const canNavigate = useCallback(() => {
    const now = Date.now();
    if (now - lastNavTime.current > THROTTLE_MS) {
      lastNavTime.current = now;
      return true;
    }
    return false;
  }, []);

  const push = useCallback(
    (href: any) => {
      if (canNavigate()) {
        try {
          router.push(href);
        } catch (error) {
          console.error('[SafeRouter] Push error:', error);
        }
      }
    },
    [router, canNavigate]
  );

  const replace = useCallback(
    (href: any) => {
      if (canNavigate()) {
        try {
          router.replace(href);
        } catch (error) {
          console.error('[SafeRouter] Replace error:', error);
        }
      }
    },
    [router, canNavigate]
  );

  const back = useCallback(() => {
    if (canNavigate() && router.canGoBack()) {
      try {
        router.back();
      } catch (error) {
        console.error('[SafeRouter] Back error:', error);
      }
    }
  }, [router, canNavigate]);

  return { ...router, push, replace, back };
}
