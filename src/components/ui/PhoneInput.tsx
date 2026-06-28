import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import CountryPicker, { CountryCode, Country } from 'react-native-country-picker-modal';
import { Input } from './Input';
import { ChevronDownIcon } from './Icons';
import { parsePhoneNumber, CALLING_CODE_MAP } from '@/utils/validation';

interface PhoneInputProps {
  value: string;
  onChangeText: (text: string) => void;
  label?: string;
  error?: string | null;
  required?: boolean;
  placeholder?: string;
  style?: any;
}

export function PhoneInput({
  value,
  onChangeText,
  label,
  error,
  required,
  placeholder = "00000 00000",
  style
}: PhoneInputProps) {
  const { callingCode: parsedCallingCode, localNumber } = parsePhoneNumber(value);
  
  // Find matching CountryCode from CALLING_CODE_MAP
  const initialCountryCode = (CALLING_CODE_MAP[parsedCallingCode] || 'IN') as CountryCode;

  const [countryCode, setCountryCode] = useState<CountryCode>(initialCountryCode);
  const [callingCode, setCallingCode] = useState<string>(parsedCallingCode);
  const [pickerVisible, setPickerVisible] = useState(false);

  // Sync state if value changes externally
  useEffect(() => {
    if (value && value.startsWith('+')) {
      const { callingCode: newCallingCode } = parsePhoneNumber(value);
      const newCountryCode = (CALLING_CODE_MAP[newCallingCode] || 'IN') as CountryCode;
      setCountryCode(newCountryCode);
      setCallingCode(newCallingCode);
    }
  }, [value]);

  const handleSelect = (country: Country) => {
    const newCallingCode = country.callingCode[0] || '91';
    setCountryCode(country.cca2);
    setCallingCode(newCallingCode);
    onChangeText(`+${newCallingCode}${localNumber}`);
  };

  const PrefixComponent = (
    <TouchableOpacity activeOpacity={1} 
      style={styles.prefixContainer}
      onPress={() => setPickerVisible(true)}
    >
      <CountryPicker
        withFilter
        withFlag
        withCallingCode
        withCallingCodeButton
        withAlphaFilter
        withEmoji
        countryCode={countryCode}
        onSelect={handleSelect}
        visible={pickerVisible}
        onOpen={() => setPickerVisible(true)}
        onClose={() => setPickerVisible(false)}
        containerButtonStyle={styles.pickerButton}
        theme={{
          fontSize: 14,
          fontFamily: Platform.OS === 'web' ? 'sans-serif' : undefined,
          onBackgroundTextColor: '#0F172A',
        }}
        modalProps={{
          ariaHideApp: false,
          transparent: true,
          animationType: 'slide',
        } as any}
      />
      <ChevronDownIcon size={12} color="#64748B" />
    </TouchableOpacity>
  );

  return (
    <Input
      label={label}
      value={localNumber}
      onChangeText={(text) => {
        const numericValue = text.replace(/[^0-9]/g, '');
        onChangeText(`+${callingCode}${numericValue}`);
      }}
      placeholder={placeholder}
      keyboardType="number-pad"
      maxLength={10}
      error={error}
      required={required}
      prefix={PrefixComponent}
      style={style}
    />
  );
}

const styles = StyleSheet.create({
  prefixContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#E2E8F0',
    paddingRight: 6,
    marginRight: 0, // Avoid double spacing with inputContainer gap
    height: '100%',
    alignSelf: 'center',
  },
  pickerButton: {
    marginRight: 2,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 0,
  },
});
