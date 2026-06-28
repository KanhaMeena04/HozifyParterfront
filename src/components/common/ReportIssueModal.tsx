import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, ScrollView, KeyboardAvoidingView, Platform, Switch, Image, Alert } from 'react-native';
import Svg, { Path, Circle, Rect } from 'react-native-svg';

interface ReportIssueModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (data: { category: string; details: string; photos: string[]; isCritical: boolean }) => void;
}

const AlertCircleIcon = ({ color = '#EF4444', size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" fill="#FEE2E2" />
    <Path d="M12 8v4M12 16h.01" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
  </Svg>
);

const CloseModalIcon = ({ color = '#64748B' }) => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <Path d="M18 6L6 18M6 6L18 18" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const WrenchIcon = ({ color = 'rgba(26, 15, 163, 1.00)' }) => (
  <Svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <Path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.77 3.77z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const UserIcon = ({ color = '#64748B' }) => (
  <Svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <Path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Circle cx="12" cy="7" r="4" stroke={color} strokeWidth="2" />
  </Svg>
);

const ClockIcon = ({ color = '#64748B' }) => (
  <Svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" />
    <Path d="M12 6v6l4 2" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const MenuIcon = ({ color = '#64748B' }) => (
  <Svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <Path d="M4 6h16M4 12h16M4 18h16" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

const ImageIconPlaceholder = ({ color = '#CBD5E1' }) => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <Rect x="3" y="3" width="18" height="18" rx="2" stroke={color} strokeWidth="2" />
    <Circle cx="8.5" cy="8.5" r="1.5" fill={color} />
    <Path d="M21 15l-5-5L5 21" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const CameraAddIcon = ({ color = 'rgba(26, 15, 163, 1.00)' }) => (
  <Svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <Path d="M23 19C23 20.1046 22.1046 21 21 21H3C1.89543 21 1 20.1046 1 19V8C1 6.89543 1.89543 6 3 6H7L9 3H15L17 6H21C22.1046 6 23 6.89543 23 8V19Z" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <Circle cx="12" cy="13" r="3.5" stroke={color} strokeWidth="1.8" />
  </Svg>
);

const CheckIcon = ({ color = '#FFFFFF' }) => (
  <Svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <Path d="M20 6L9 17L4 12" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const ReportIssueModal: React.FC<ReportIssueModalProps> = ({ visible, onClose, onSave }) => {
  const [selectedCategory, setSelectedCategory] = useState('Equipment');
  const [details, setDetails] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [isCritical, setIsCritical] = useState(false);

  const CATEGORIES = [
    { id: 'Equipment', label: 'Equipment', icon: (color: string) => <WrenchIcon color={color} /> },
    { id: 'Service Site', label: 'Service Site', icon: (color: string) => <UserIcon color={color} /> },
    { id: 'Logistics', label: 'Logistics', icon: (color: string) => <ClockIcon color={color} /> },
    { id: 'Other', label: 'Other', icon: (color: string) => <MenuIcon color={color} /> }
  ];

  const handleAddPhoto = () => {
    if (photos.length >= 4) {
      Alert.alert('Limit Reached', 'You can upload a maximum of 4 photos.');
      return;
    }
    // Simulate photo selection
    const mockPhotos = [
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=200',
      'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=200',
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=200',
      'https://images.unsplash.com/photo-1605647540924-852290f6b0d5?w=200'
    ];
    const newPhoto = mockPhotos[photos.length];
    setPhotos(prev => [...prev, newPhoto]);
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleSave = () => {
    if (!details.trim()) {
      Alert.alert('Validation Error', 'Please describe the issue details.');
      return;
    }
    onSave({
      category: selectedCategory,
      details: details.trim(),
      photos: photos,
      isCritical: isCritical
    });
    // Reset inputs
    setDetails('');
    setPhotos([]);
    setIsCritical(false);
    setSelectedCategory('Equipment');
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.overlay}>
        <View style={styles.sheetContainer}>
          
          {/* Header Row */}
          <View style={styles.header}>
            <View style={styles.headerTitleRow}>
              <AlertCircleIcon />
              <Text style={styles.headerTitle}>Report Issue</Text>
            </View>
            <TouchableOpacity activeOpacity={1} style={styles.closeBtn} onPress={onClose}>
              <CloseModalIcon />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            
            {/* Category Selector */}
            <Text style={styles.sectionHeading}>ISSUE CATEGORY</Text>
            <View style={styles.categoriesGrid}>
              {CATEGORIES.map(cat => {
                const isSelected = selectedCategory === cat.id;
                const iconColor = isSelected ? 'rgba(26, 15, 163, 1.00)' : '#64748B';
                return (
                  <TouchableOpacity activeOpacity={1}
                    key={cat.id}
                    style={[styles.categoryCard, isSelected && styles.categoryCardSelected]}
                    onPress={() => setSelectedCategory(cat.id)}
                  >
                    {cat.icon(iconColor)}
                    <Text style={[styles.categoryLabel, isSelected && styles.categoryLabelSelected]}>
                      {cat.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Description Textarea */}
            <Text style={styles.sectionHeading}>ISSUE DETAILS</Text>
            <TextInput
              style={styles.textArea}
              placeholder="Please describe the issue in detail to help our support team..."
              placeholderTextColor="#94A3B8"
              multiline
              numberOfLines={4}
              value={details}
              onChangeText={setDetails}
              textAlignVertical="top"
            />

            {/* Evidence Photos */}
            <View style={styles.photosHeadingRow}>
              <Text style={styles.sectionHeading}>EVIDENCE PHOTOS</Text>
              <Text style={styles.photosLimitText}>Max 4 Photos</Text>
            </View>
            
            <View style={styles.photoSlotsRow}>
              {/* Add Button Slot */}
              <TouchableOpacity activeOpacity={1} style={styles.addPhotoBtn} onPress={handleAddPhoto}>
                <CameraAddIcon />
                <Text style={styles.addPhotoText}>ADD</Text>
              </TouchableOpacity>

              {/* Dynamic Photo Slots */}
              {[0, 1, 2].map(idx => {
                const photoUri = photos[idx];
                if (photoUri) {
                  return (
                    <View key={idx} style={styles.photoSlot}>
                      <Image source={{ uri: photoUri }} style={styles.slotImage} />
                      <TouchableOpacity activeOpacity={1} style={styles.removePhotoBadge} onPress={() => handleRemovePhoto(idx)}>
                        <Text style={styles.removePhotoText}>×</Text>
                      </TouchableOpacity>
                    </View>
                  );
                } else {
                  return (
                    <View key={idx} style={styles.photoSlotEmpty}>
                      <ImageIconPlaceholder />
                    </View>
                  );
                }
              })}
            </View>

            {/* Critical Priority Switch */}
            <View style={styles.criticalCard}>
              <View style={styles.criticalMeta}>
                <Text style={styles.criticalTitle}>Critical Priority</Text>
                <Text style={styles.criticalSub}>Requires immediate attention</Text>
              </View>
              <Switch
                value={isCritical}
                onValueChange={setIsCritical}
                trackColor={{ false: '#E2E8F0', true: '#C7D2FE' }}
                thumbColor={isCritical ? 'rgba(26, 15, 163, 1.00)' : '#94A3B8'}
                ios_backgroundColor="#E2E8F0"
              />
            </View>

          </ScrollView>

          {/* Action Row */}
          <View style={styles.actionRow}>
            <TouchableOpacity activeOpacity={1} style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={1} style={styles.saveBtn} onPress={handleSave}>
              <CheckIcon />
              <Text style={styles.saveBtnText}>Save</Text>
            </TouchableOpacity>
          </View>

        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.4)', justifyContent: 'flex-end' },
  sheetContainer: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, maxHeight: '90%', borderTopWidth: 1, borderTopColor: '#F1F5F9' },
  
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#F1F5F9', marginBottom: 20 },
  headerTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  headerTitle: { fontSize: 16, fontWeight: '800', color: '#0F172A' },
  closeBtn: { padding: 4 },

  scrollContent: { paddingBottom: 24 },

  sectionHeading: { fontSize: 10, fontWeight: '800', color: '#64748B', letterSpacing: 0.5, marginBottom: 12 },
  
  categoriesGrid: { flexDirection: 'row', gap: 10, flexWrap: 'wrap', marginBottom: 20 },
  categoryCard: { flex: 1, minWidth: '45%', minHeight: 48, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 12, paddingHorizontal: 12 },
  categoryCardSelected: { borderColor: 'rgba(26, 15, 163, 1.00)', backgroundColor: '#EEF2FF' },
  categoryLabel: { fontSize: 12, fontWeight: '700', color: '#64748B' },
  categoryLabelSelected: { color: 'rgba(26, 15, 163, 1.00)' },

  textArea: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 16, padding: 16, minHeight: 100, fontSize: 13, color: '#0F172A', marginBottom: 20 },

  photosHeadingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  photosLimitText: { fontSize: 10, color: '#94A3B8', fontWeight: '500' },
  
  photoSlotsRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  addPhotoBtn: { width: 68, height: 68, borderRadius: 16, borderStyle: 'dashed', borderWidth: 1, borderColor: '#CBD5E1', backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center', gap: 4 },
  addPhotoText: { fontSize: 9, fontWeight: '800', color: '#64748B' },

  photoSlot: { width: 68, height: 68, borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: '#E2E8F0' },
  slotImage: { width: '100%', height: '100%' },
  removePhotoBadge: { position: 'absolute', top: 4, right: 4, width: 18, height: 18, borderRadius: 9, backgroundColor: 'rgba(15, 23, 42, 0.6)', justifyContent: 'center', alignItems: 'center' },
  removePhotoText: { color: '#FFFFFF', fontSize: 12, fontWeight: '700', marginTop: -2 },

  photoSlotEmpty: { width: 68, height: 68, borderRadius: 16, borderWidth: 1, borderColor: '#E2E8F0', backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center' },

  criticalCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FFF5F5', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#FEE2E2', marginBottom: 20 },
  criticalMeta: { flex: 1, marginRight: 12 },
  criticalTitle: { fontSize: 13, fontWeight: '800', color: '#991B1B' },
  criticalSub: { fontSize: 11, color: '#EF4444', fontWeight: '500', marginTop: 2 },

  actionRow: { flexDirection: 'row', gap: 12, borderTopWidth: 1, borderTopColor: '#F1F5F9', paddingTop: 16 },
  cancelBtn: { flex: 1, height: 48, borderRadius: 14, borderWidth: 1, borderColor: '#CBD5E1', justifyContent: 'center', alignItems: 'center' },
  cancelBtnText: { fontSize: 14, fontWeight: '700', color: '#64748B' },
  saveBtn: { flex: 1, height: 48, borderRadius: 14, backgroundColor: 'rgba(26, 15, 163, 1.00)', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8 },
  saveBtnText: { fontSize: 14, fontWeight: '700', color: '#FFFFFF' }
});
