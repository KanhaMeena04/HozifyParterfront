import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from '@/components/ui/Button';
import { Platform } from 'react-native';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { StorageService } from '@/services/storage.service';
import { COLORS } from '@/constants';

interface RoleAccessGuardProps {
  allowedRoles: ('BSP' | 'BS' | 'ISP')[];
  children: React.ReactNode;
}

export function RoleAccessGuard({ allowedRoles, children }: RoleAccessGuardProps) {
  const router = useSafeRouter();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkRole = async () => {
      const session = await StorageService.getUserSession();
      setUserRole(session?.role || null);
      setLoading(false);
    };
    checkRole();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  const isAllowed = userRole && allowedRoles.includes(userRole as any);

  if (!isAllowed) {
    return (
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.icon}>⚠️</Text>
          <Text style={styles.title}>Access Restricted</Text>
          <Text style={styles.description}>
            This screen is only available for {allowedRoles.join(' and ')} roles. Your current role is {`"${userRole || 'not selected'}"`}.
          </Text>
          <Button
            title="Back to Checklist"
            onPress={() => router.replace('/(tabs)')}
            variant="primary"
            style={styles.btn}
          />
        </View>
      </View>
    );
  }

  return <>{children}</>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    fontSize: 14,
    color: '#64748B',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    width: '100%',
    maxWidth: 400,
    ...Platform.select({
      web: { boxShadow: '0px 8px 16px rgba(0,0,0,0.05)' },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.05,
        shadowRadius: 16,
        elevation: 4,
      },
    }),
  },
  icon: {
    fontSize: 48,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  btn: {
    width: '100%',
    backgroundColor: COLORS.primary,
  },
});
