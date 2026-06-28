import React from 'react';
import { TouchableOpacity, ViewStyle } from 'react-native';
import { Input } from './Input';
import { ChevronDownIcon } from './Icons';

interface SelectInputProps {
  label?: string;
  value: string;
  placeholder?: string;
  onPress: () => void;
  style?: ViewStyle;
  required?: boolean;
  disabled?: boolean;
  hideArrow?: boolean;
  error?: string | null;
}

export function SelectInput({ label, value, placeholder, onPress, style, required, disabled, hideArrow = false, error }: SelectInputProps) {
  const { marginBottom, ...touchableStyle } = (style as any) || {};
  return (
    <TouchableOpacity activeOpacity={1} onPress={onPress} style={touchableStyle} disabled={disabled}>
      <Input
        label={label}
        value={value}
        placeholder={placeholder}
        editable={false}
        pointerEvents="none"
        rightIcon={hideArrow ? undefined : <ChevronDownIcon size={20} />}
        required={required}
        error={error}
        style={{ marginBottom: marginBottom !== undefined ? marginBottom : 12 }}
      />
    </TouchableOpacity>
  );
}
