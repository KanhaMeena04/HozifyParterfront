import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CheckCircleIcon, ClockCircleIcon } from './Icons'; // Assuming we map some icons

// We will use standard SVG icons based on what we defined in Icons.tsx, 
// but since the pill variant uses tiny icons inside it, we can just use simple views or the icons we have.

type StatusType = 
  | 'VERIFIED' | 'COMPLETED' | 'APPROVED'
  | 'REVIEWING' | 'IN PROGRESS' | 'YET TO START'
  | 'PROCESSING' | 'NOT UPLOADED'
  | 'PENDING' | 'UNDER REVIEW'
  | 'REJECTED';

interface StatusBadgeProps {
  status: StatusType | string;
  variant?: 'text' | 'pill';
  style?: any;
}

const getColors = (status: string) => {
  const upper = status.toUpperCase();
  if (['VERIFIED', 'COMPLETED', 'APPROVED'].includes(upper)) {
    return { text: '#22C55E', bg: '#DCFCE7' }; // Green
  }
  if (['REVIEWING', 'IN PROGRESS', 'YET TO START'].includes(upper)) {
    return { text: '#3B82F6', bg: '#DBEAFE' }; // Blue
  }
  if (['PENDING', 'UNDER REVIEW'].includes(upper)) {
    return { text: '#EAB308', bg: '#FEF9C3' }; // Yellow
  }
  if (['REJECTED'].includes(upper)) {
    return { text: '#EF4444', bg: '#FEE2E2' }; // Red
  }
  // Default for PROCESSING, NOT UPLOADED, etc.
  return { text: '#94A3B8', bg: '#F1F5F9' }; // Slate
};

export function StatusBadge({ status, variant = 'text', style }: StatusBadgeProps) {
  const colors = getColors(status);
  
  if (variant === 'pill') {
    return (
      <View style={[styles.pill, { backgroundColor: colors.bg }, style]}>
        <Text style={[styles.pillText, { color: colors.text }]}>{status}</Text>
      </View>
    );
  }

  return (
    <Text style={[styles.text, { color: colors.text }, style]}>
      {status.toUpperCase()}
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  pill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
