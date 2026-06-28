import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Text, Modal, Animated, Easing } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';
import { COLORS } from '../../constants';

interface LoaderProps {
  visible: boolean;
  message?: string;
  subMessage?: string;
}

const AnimatedG = Animated.createAnimatedComponent(G);

export function Loader({ visible, message = 'Please wait few seconds', subMessage = 'We are verifying your number' }: LoaderProps) {
  const rotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.loop(
        Animated.timing(rotation, {
          toValue: 1,
          duration: 1500,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();
    } else {
      rotation.stopAnimation();
    }
  }, [visible, rotation]);

  const spin = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  // Dots configuration (colors inspired by screenshot)
  const dots = [
    { cx: 20, cy: 4, r: 4, fill: '#60A5FA' }, // Blue
    { cx: 31, cy: 8.5, r: 3.5, fill: 'rgba(26, 15, 163, 1.00)' }, // Indigo
    { cx: 36, cy: 20, r: 3, fill: '#A78BFA' }, // Purple
    { cx: 31, cy: 31.5, r: 3.5, fill: '#F472B6' }, // Pink
    { cx: 20, cy: 36, r: 4, fill: '#A3E635' }, // Lime
    { cx: 8.5, cy: 31.5, r: 3.5, fill: '#34D399' }, // Emerald
    { cx: 4, cy: 20, r: 3, fill: '#38BDF8' }, // Sky
    { cx: 8.5, cy: 8.5, r: 3.5, fill: '#60A5FA' }, // Blue (repeat)
  ];

  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
    >
      <View style={styles.container}>
        <View style={styles.card}>
          <View style={styles.spinnerContainer}>
            <Animated.View style={{ transform: [{ rotate: spin }] }}>
              <Svg width="40" height="40" viewBox="0 0 40 40">
                <G>
                  {dots.map((dot, i) => (
                    <Circle key={i} cx={dot.cx} cy={dot.cy} r={dot.r} fill={dot.fill} />
                  ))}
                </G>
              </Svg>
            </Animated.View>
          </View>
          {message ? <Text style={styles.message}>{message}</Text> : null}
          {subMessage ? <Text style={styles.subMessage}>{subMessage}</Text> : null}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.4)', // subtle dimming
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  card: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingHorizontal: 24,
    paddingVertical: 32,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
    elevation: 4,
  },
  spinnerContainer: {
    marginBottom: 24,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ scale: 1.5 }],
  },
  message: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 8,
    textAlign: 'center',
  },
  subMessage: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
  },
});

export default Loader;
