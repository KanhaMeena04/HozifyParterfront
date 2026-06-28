import React, { useRef, useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text, Platform } from 'react-native';
import { COLORS } from '../../constants';

interface OtpInputProps {
  value: string;
  onChange: (value: string) => void;
  length?: number;
  autoFocus?: boolean;
  focusDelay?: number;
  triggerFocus?: boolean;
}

export function OtpInput({ value, onChange, length = 6, autoFocus = true, focusDelay = 0 }: OtpInputProps) {
  const inputRef = useRef<TextInput>(null);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    const delay = Math.max(focusDelay, 300);
    const timer = setTimeout(() => {
      if (autoFocus) inputRef.current?.focus();
    }, delay);
    return () => clearTimeout(timer);
  }, [autoFocus, focusDelay]);

  const focus = () => inputRef.current?.focus();

  return (
    <TouchableOpacity activeOpacity={1} onPress={focus} style={styles.container}>
      {/* Visible cells */}
      <View style={styles.cellsRow} pointerEvents="none">
        {Array.from({ length }).map((_, i) => {
          const char = value[i] || '';
          const isActive = isFocused && (value.length === i || (i === length - 1 && value.length === length));
          const isFilled = char !== '';
          return (
            <View
              key={i}
              style={[
                styles.cell,
                (isActive || isFilled) ? styles.cellBox : styles.cellLine,
                isActive && styles.cellActive,
              ]}
            >
              <Text style={styles.cellText}>{char}</Text>
            </View>
          );
        })}
      </View>

      {/* Invisible input stretched over cells — always in the render tree */}
      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={(text) => {
          onChange(text.replace(/[^0-9]/g, '').slice(0, length));
        }}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        autoComplete="one-time-code"
        maxLength={length}
        caretHidden
        selectionColor="transparent"
        showSoftInputOnFocus
        style={styles.ghostInput}
        importantForAccessibility="no"
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
    width: '100%',
  },
  cellsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  cell: {
    width: 45,
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cellBox: {
    borderWidth: 1,
    borderColor: '#0F172A',
    borderRadius: 8,
  },
  cellLine: {
    borderBottomWidth: 1.5,
    borderColor: '#94A3B8',
  },
  cellActive: {
    borderColor: COLORS.primary,
    borderWidth: 2,
    borderRadius: 8,
  },
  cellText: {
    fontSize: 22,
    fontWeight: '600',
    color: '#0F172A',
  },
  ghostInput: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0,
  },
});
