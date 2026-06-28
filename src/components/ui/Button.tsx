import React from 'react';
import {
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  View,
  ViewStyle,
  TextStyle,
  Platform,
} from 'react-native';
import Svg, { Defs, LinearGradient as SvgLinearGradient, Rect, Stop } from 'react-native-svg';
import { COLORS } from '../../constants';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'gradient' | 'secondary' | 'text' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  disabled?: boolean;
  style?: any;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  style,
  textStyle,
  icon,
}: ButtonProps) {
  const isButtonDisabled = disabled || isLoading;
  const lastPress = React.useRef<number>(0);

  const handlePress = React.useCallback(async () => {
    if (isButtonDisabled) return;
    const now = Date.now();
    if (now - lastPress.current > 600) {
      lastPress.current = now;
      try {
        await onPress();
      } catch (error) {
        console.error('[Button] Error in onPress:', error);
      }
    }
  }, [onPress, isButtonDisabled]);

  // Sizes styling
  const sizeStyles = {
    sm: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20 },
    md: { paddingVertical: 14, paddingHorizontal: 28, borderRadius: 14 },
    lg: { paddingVertical: 16, paddingHorizontal: 32, borderRadius: 16 },
  }[size];

  // Base text sizes
  const textSizeStyles = {
    sm: { fontSize: 13, fontWeight: '600' as const },
    md: { fontSize: 16, fontWeight: '700' as const },
    lg: { fontSize: 18, fontWeight: '700' as const },
  }[size];

  // Text color mapping
  const textColorMap = {
    primary: '#FFFFFF',
    gradient: '#FFFFFF',
    secondary: COLORS.text.primary,
    text: COLORS.primary,
    outline: COLORS.text.primary,
  };

  const activeOpacity = Platform.OS === 'ios' ? 0.8 : 0.85;

  return (
    <TouchableOpacity activeOpacity={1}
      activeOpacity={activeOpacity}
      onPress={handlePress}
      disabled={isButtonDisabled}
      style={[
        styles.base,
        sizeStyles,
        variant === 'primary' && styles.primary,
        variant === 'secondary' && styles.secondary,
        variant === 'outline' && styles.outline,
        variant === 'text' && styles.text,
        isButtonDisabled && styles.disabled,
        style,
      ]}
    >
      {/* SVG Gradient Background for Help / Gradient button */}
      {variant === 'gradient' && !isButtonDisabled && (
        <View style={[StyleSheet.absoluteFill, { borderRadius: sizeStyles.borderRadius, overflow: 'hidden' }]}>
          <Svg width="100%" height="100%">
            <Defs>
              <SvgLinearGradient id="btn-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <Stop offset="0%" stopColor={COLORS.accentGradient.start} />
                <Stop offset="100%" stopColor={COLORS.accentGradient.end} />
              </SvgLinearGradient>
            </Defs>
            <Rect width="100%" height="100%" fill="url(#btn-grad)" />
          </Svg>
        </View>
      )}

      {isLoading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'secondary' ? COLORS.primary : '#FFFFFF'}
        />
      ) : (
        <View style={styles.contentContainer}>
          <Text
            style={[
              styles.textBase,
              textSizeStyles,
              { color: textColorMap[variant] },
              disabled && styles.disabledText,
              textStyle,
            ]}
          >
            {title}
          </Text>
          {icon && <View style={styles.iconContainer}>{icon}</View>}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  primary: {
    backgroundColor: COLORS.primary,
  },
  secondary: {
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  outline: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  text: {
    backgroundColor: 'transparent',
  },
  disabled: {
    backgroundColor: '#CBD5E1',
    boxShadow: 'none',
    elevation: 0,
    borderColor: '#CBD5E1',
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textBase: {
    textAlign: 'center',
    includeFontPadding: false,
  },
  iconContainer: {
    marginLeft: 8,
  },
  disabledText: {
    color: '#94A3B8',
  },
});

export default Button;
