import React from 'react';
import { TouchableOpacity, View, StyleSheet, Animated } from 'react-native';

export function Switch({ value, onValueChange }: { value: boolean; onValueChange: (v: boolean) => void }) {
  const [animValue] = React.useState(new Animated.Value(value ? 1 : 0));

  React.useEffect(() => {
    Animated.timing(animValue, {
      toValue: value ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [value]);

  const translateX = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [2, 22] // thumb moves from left to right
  });

  const backgroundColor = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['#E2E8F0', 'rgba(26, 15, 163, 1.00)'] // gray to dark blue
  });

  return (
    <TouchableOpacity activeOpacity={1} onPress={() => onValueChange(!value)}>
      <Animated.View style={[styles.track, { backgroundColor }]}>
        <Animated.View style={[styles.thumb, { transform: [{ translateX }] }]} />
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  track: {
    width: 44, height: 24, borderRadius: 12, justifyContent: 'center'
  },
  thumb: {
    width: 20, height: 20, borderRadius: 10, backgroundColor: '#FFFFFF',
    boxShadow: '0px 2px 2px rgba(0, 0, 0, 0.2)', elevation: 2
  }
});
