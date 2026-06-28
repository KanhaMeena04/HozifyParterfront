import React from 'react';
import { View, ViewStyle, StyleSheet, Platform } from 'react-native';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  variant?: 'default' | 'bottomSheet'; // bottomSheet variant has only top corners rounded
}

export function Card({ children, style, variant = 'default' }: CardProps) {
  const cardStyle = variant === 'bottomSheet' ? styles.bottomSheetCard : styles.defaultCard;

  return (
    <View style={[styles.baseCard, cardStyle, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  baseCard: {
    backgroundColor: '#FFFFFF',
    width: '100%',
  },
  defaultCard: {
    borderRadius: 24,
    padding: 24,
    ...Platform.select({
      ios: {
        boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.08)',
      },
      android: {
        elevation: 6,
      },
      web: {
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
      },
    }),
  },
  bottomSheetCard: {
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    paddingHorizontal: 24,
    paddingTop: 36,
    paddingBottom: 40,
    flexGrow: 1,
    ...Platform.select({
      ios: {
        boxShadow: '0px -6px 12px rgba(0, 0, 0, 0.06)',
      },
      android: {
        elevation: 8,
      },
      web: {
        boxShadow: '0 -6px 20px rgba(0, 0, 0, 0.03)',
      },
    }),
  },
});

export default Card;
