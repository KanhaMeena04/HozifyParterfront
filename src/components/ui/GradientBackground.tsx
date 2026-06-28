import React from 'react';
import { StyleSheet, View, ViewStyle, Platform } from 'react-native';
import Svg, { Defs, LinearGradient as SvgLinearGradient, Rect, Stop } from 'react-native-svg';
import { usePathname } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface GradientBackgroundProps {
  children?: React.ReactNode;
  style?: ViewStyle;
  isHeader?: boolean;
}

const isTabScreen = (path: string) => {
  if (!path) return false;
  const cleanPath = path.trim().replace(/\/$/, '');
  const tabPaths = [
    '',
    '/',
    '/index',
    '/(dashboard)',
    '/bookings',
    '/(dashboard)/bookings',
    '/wallet',
    '/(dashboard)/wallet',
    '/profile',
    '/(dashboard)/profile'
  ];
  return tabPaths.includes(cleanPath) || cleanPath.endsWith('/bookings') || cleanPath.endsWith('/wallet') || cleanPath.endsWith('/profile');
};

export function GradientBackground({ children, style, isHeader = false }: GradientBackgroundProps) {
  const reactId = React.useId();
  const gradId = reactId ? reactId.replace(/:/g, '') : `bg-grad-${Math.random().toString(36).substring(2, 9)}`;
  
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  
  const isTab = isTabScreen(pathname);
  const tabBarHeight = Platform.OS === 'ios' ? 64 + insets.bottom : 60 + insets.bottom;
  const paddingBottomVal = 0;

  if (Platform.OS === 'web') {
    return (
      <View 
        style={[
          styles.container, 
          style,
          { 
            backgroundImage: 'linear-gradient(90deg, #8EC5FC 20%, #DEEB98 80%)',
            minHeight: '100vh',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            paddingBottom: paddingBottomVal,
          } as any,
        ]}
      >
        {/* Rectangle 5 glassmorphism overlay */}
        <View style={[StyleSheet.absoluteFill, styles.glassCard, { pointerEvents: 'none' }]} />
        {children}
      </View>
    );
  }

  return (
    <View style={[styles.container, style, { paddingBottom: paddingBottomVal }]}>
      <Svg style={StyleSheet.absoluteFill}>
        <Defs>
          <SvgLinearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="20%" stopColor="#8EC5FC" stopOpacity="1" />
            <Stop offset="80%" stopColor="#DEEB98" stopOpacity="1" />
          </SvgLinearGradient>
        </Defs>
        <Rect width="100%" height="100%" fill={`url(#${gradId})`} />
      </Svg>
      
      {/* Rectangle 5 glassmorphism overlay */}
      <View style={[StyleSheet.absoluteFill, styles.glassCard, { pointerEvents: 'none' }]} />

      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
  },
  glassCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
  },
});
export default GradientBackground;
