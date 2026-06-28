import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ImageSourcePropType } from 'react-native';
import { IdCardIcon, TrashIcon, UploadIcon } from './Icons';
import Svg, { Path, Polyline } from 'react-native-svg';

interface ImageUploadCardProps {
  label: string;
  subLabel?: string;
  onPress: () => void;
  onRemove?: () => void;
  style?: any;
  uploaded?: boolean;
  uploadedUri?: string;
  dummyImage?: ImageSourcePropType;
}

const CheckIcon = () => (
  <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
    <Path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Polyline points="22 4 12 14.01 9 11.01" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

export function ImageUploadCard({ label, subLabel, onPress, onRemove, style, uploaded, uploadedUri, dummyImage }: ImageUploadCardProps) {
  if (uploaded && (uploadedUri || dummyImage)) {
    const imageSource = uploadedUri ? { uri: uploadedUri } : dummyImage!;
    return (
      <View style={[styles.imageContainer, style]}>
        <Image source={imageSource} style={styles.dummyImage} resizeMode="cover" />
        <View style={styles.imageBadge}>
          <CheckIcon />
          <Text style={styles.imageBadgeText}>Uploaded</Text>
        </View>
        <View style={styles.actionOverlay}>
          {onRemove && (
            <TouchableOpacity activeOpacity={1} style={styles.iconBtn} onPress={onRemove}>
              <TrashIcon size={20} color="#EF4444" />
            </TouchableOpacity>
          )}
          <TouchableOpacity activeOpacity={1} style={styles.iconBtn} onPress={onPress}>
            <UploadIcon size={20} color="#3B82F6" />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (uploaded) {
    return (
      <TouchableOpacity activeOpacity={1} onPress={onPress} style={[styles.container, styles.uploadedContainer, style]}>
        <View style={styles.uploadedIconCircle}>
          <CheckIcon />
        </View>
        <Text style={styles.uploadedLabel}>Uploaded</Text>
        <Text style={styles.uploadedSubLabel}>Tap to change</Text>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity activeOpacity={1} onPress={onPress} style={[styles.container, style]}>
      <View style={styles.iconCircle}>
        <IdCardIcon size={20} color="#475569" />
      </View>
      <Text style={styles.label}>{label}</Text>
      {subLabel ? <Text style={styles.subLabel}>{subLabel}</Text> : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  imageContainer: {
    width: '100%',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#16A34A',
    overflow: 'hidden',
    marginBottom: 4,
  },
  dummyImage: {
    width: '100%',
    height: 140,
  },
  imageBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
    gap: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  imageBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#16A34A',
  },
  actionOverlay: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    flexDirection: 'row',
    gap: 12,
  },
  iconBtn: {
    backgroundColor: '#FFFFFF',
    padding: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  container: {
    width: '100%',
    paddingVertical: 24,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
  },
  uploadedContainer: {
    borderColor: '#16A34A',
    borderStyle: 'solid',
    backgroundColor: '#F0FDF4',
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  uploadedIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 4,
  },
  subLabel: {
    fontSize: 12,
    color: '#64748B',
  },
  uploadedLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#16A34A',
    marginBottom: 4,
  },
  uploadedSubLabel: {
    fontSize: 12,
    color: '#4ADE80',
  },
});
