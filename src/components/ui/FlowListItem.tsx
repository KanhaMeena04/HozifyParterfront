import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { StatusBadge } from './StatusBadge';

interface FlowListItemProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  status?: string;
  statusVariant?: 'text' | 'pill';
  onPress?: () => void;
  isLast?: boolean;
}

export function FlowListItem({
  icon,
  title,
  subtitle,
  status,
  statusVariant = 'text',
  onPress,
  isLast = false,
}: FlowListItemProps) {
  const Component = onPress ? TouchableOpacity : View;

  return (
    <Component 
      style={[
        styles.container, 
        !isLast && styles.borderBottom,
        isLast && { borderBottomLeftRadius: 12, borderBottomRightRadius: 12 }
      ]} 
      onPress={onPress}
    >
      <View style={styles.iconContainer}>
        {icon}
      </View>
      
      <View style={styles.contentContainer}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>

      {status && (
        <View style={styles.statusContainer}>
          <StatusBadge status={status} variant={statusVariant} />
        </View>
      )}
    </Component>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9', // slate 100
  },
  iconContainer: {
    width: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A', // slate 900
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: '#94A3B8', // slate 400
  },
  statusContainer: {
    marginLeft: 12,
  },
});
