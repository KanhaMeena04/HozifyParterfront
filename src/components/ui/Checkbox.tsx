import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Svg, Path } from 'react-native-svg';

export function Checkbox({ checked, onChange, label }: { checked: boolean; onChange: (c: boolean) => void; label?: string }) {
  return (
    <TouchableOpacity activeOpacity={1} style={styles.container} onPress={() => onChange(!checked)}>
      <View style={[styles.box, checked && styles.checkedBox]}>
        {checked && (
          <Svg width="12" height="12" viewBox="0 0 24 24" fill="none">
            <Path d="M5 13L9 17L19 7" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
        )}
      </View>
      {label && <Text style={styles.label}>{label}</Text>}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
  box: {
    width: 20, height: 20, borderRadius: 4, borderWidth: 1.5, borderColor: '#CBD5E1',
    justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF',
  },
  checkedBox: {
    backgroundColor: 'rgba(26, 15, 163, 1.00)', borderColor: 'rgba(26, 15, 163, 1.00)',
  },
  label: { marginLeft: 12, fontSize: 13, color: '#0F172A', fontWeight: '500' }
});
