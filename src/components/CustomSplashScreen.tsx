import React from 'react';
import { View, StyleSheet, Image, Platform } from 'react-native';
import BackgroundSVG from './BackgroundSVG';

export default function CustomSplashScreen() {
  const containerStyle = Platform.OS === 'web'
    ? [styles.container, { minHeight: '100vh', height: '100%' } as any]
    : styles.container;

  return (
    <View style={containerStyle}>
      <BackgroundSVG variant="splash" />
      <Image 
        source={require('../../assets/images/logo.png')} 
        style={styles.icon}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // glassCard removed – splash shows gradient directly
  icon: {
    width: 280,
    height: 280,
  },
  logo: {
    width: 240,
    height: 100,
  }
});
