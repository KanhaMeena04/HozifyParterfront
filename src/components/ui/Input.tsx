import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ViewStyle,
  TextStyle,
  KeyboardTypeOptions,
  NativeSyntheticEvent,
  TextInputFocusEventData,
  Platform,
  Pressable,
} from 'react-native';
import { COLORS } from '../../constants';

interface InputProps {
  value?: string;
  onChangeText?: (text: string) => void;
  label?: string;
  required?: boolean;
  placeholder?: string;
  keyboardType?: KeyboardTypeOptions;
  maxLength?: number;
  error?: string | null;
  prefix?: string | React.ReactNode; // e.g. "+91" or a custom component
  style?: any;
  inputStyle?: TextStyle;
  labelStyle?: TextStyle;
  onFocus?: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void;
  onBlur?: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void;
  rightIcon?: React.ReactNode;
  editable?: boolean;
  pointerEvents?: 'box-none' | 'none' | 'box-only' | 'auto';
  multiline?: boolean;
  numberOfLines?: number;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
}

export function Input({
  value,
  onChangeText,
  label,
  required = false,
  placeholder,
  keyboardType = 'default',
  maxLength,
  error,
  prefix,
  style,
  inputStyle,
  labelStyle,
  onFocus,
  onBlur,
  rightIcon,
  editable = true,
  pointerEvents,
  multiline = false,
  numberOfLines,
  autoCapitalize,
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);

  const handleFocus = (e: any) => {
    setIsFocused(true);
    if (onFocus) onFocus(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    if (onBlur) onBlur(e);
  };

  return (
    <View style={[styles.container, style, pointerEvents ? { pointerEvents } : {}] as any}>
      {label && (
        <Text style={[styles.label, labelStyle]}>
          {label}
          {required && <Text style={styles.requiredAsterisk}>*</Text>}
        </Text>
      )}

      <Pressable
        onPress={() => {
          if (editable) {
            inputRef.current?.focus();
          }
        }}
        style={[
          styles.inputContainer,
          !editable && styles.inputContainerDisabled,
          isFocused && styles.inputContainerFocused,
          error ? styles.inputContainerError : null,
        ]}
      >
        {prefix ? (
          typeof prefix === 'string' ? (
            <Text style={styles.prefixText}>{prefix}</Text>
          ) : (
            prefix
          )
        ) : null}
        <TextInput
          ref={inputRef}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={COLORS.text.placeholder}
          keyboardType={keyboardType}
          maxLength={maxLength}
          onFocus={handleFocus}
          onBlur={handleBlur}
          style={[styles.textInput, inputStyle]}
          autoFocus={false}
          editable={editable}
          multiline={multiline}
          numberOfLines={numberOfLines}
          autoCapitalize={autoCapitalize}
        />
        {rightIcon ? <View style={styles.rightIconContainer}>{rightIcon}</View> : null}
      </Pressable>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A', // slate 900
    marginBottom: 4,
  },
  requiredAsterisk: {
    color: COLORS.primary,
    marginLeft: 2,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0', // slate 200
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    gap: 8,
  },
  inputContainerDisabled: {
    backgroundColor: '#F8FAFC',
  },
  inputContainerFocused: {
    borderColor: COLORS.primary,
    borderWidth: 1.5,
  },
  inputContainerError: {
    borderColor: '#EF4444',
  },
  prefixText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0F172A', // slate 900
    paddingRight: 4,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: '400',
    color: '#0F172A', // slate 900
    padding: 0, // Remove native padding to align properly
    minHeight: 24,
    ...Platform.select({
      web: {
        outlineStyle: 'none',
        borderWidth: 0,
      } as any,
    }),
  },
  rightIconContainer: {
    marginLeft: 8,
  },
  errorText: {
    fontSize: 12,
    color: '#EF4444',
    marginTop: 6,
  },
});

export default Input;
