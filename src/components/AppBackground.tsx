import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import BackgroundSVG from './BackgroundSVG';

interface AppBackgroundProps {
  children?: React.ReactNode;
}

export default function AppBackground({ children }: AppBackgroundProps) {
  const { width, height } = Dimensions.get('window');

  return (
    <View style={styles.container}>
      <BackgroundSVG variant="minimal" />
      
      <View style={[styles.glassCard, { width: width, height: height }]}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  glassCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderRadius: 24,
    overflow: 'hidden',
    position: 'absolute',
  },
});
