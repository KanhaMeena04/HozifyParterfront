import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { InfoCircleIcon } from './Icons';

interface InfoAlertProps {
  message: string;
}

export function InfoAlert({ message }: InfoAlertProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <InfoCircleIcon size={20} color="#3B82F6" />
      </View>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#EFF6FF', // blue 50
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#DBEAFE', // blue 100
  },
  iconContainer: {
    marginRight: 12,
    marginTop: 2,
  },
  message: {
    flex: 1,
    fontSize: 13,
    lineHeight: 20,
    color: '#0F172A', // slate 900
  },
});
