import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, Platform } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { Button } from '@/components/ui/Button';

interface LanguageSelectModalProps {
  visible: boolean;
  onClose: () => void;
  selectedLanguage: string;
  onSelectLanguage: (lang: string) => void;
}

const LANGUAGES = [
  { id: 'en', title: 'English' },
  { id: 'hi', title: 'हिंदी (Hindi)' },
  { id: 'kn', title: 'ಕನ್ನಡ (Kannada)' },
  { id: 'te', title: 'తెలుగు (Telugu)' },
  { id: 'ta', title: 'தமிழ் (Tamil)' },
  { id: 'bn', title: 'বাংলা (Bengali)' },
  { id: 'mr', title: 'मराठी (Marathi)' },
  { id: 'ml', title: 'മലയാളം (Malayalam)' },
];

const RadioUnchecked = () => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="9" stroke="#94A3B8" strokeWidth="2" />
  </Svg>
);

const RadioChecked = () => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="9" stroke="#FBBF24" strokeWidth="2" />
    <Circle cx="12" cy="12" r="4.5" fill="#FBBF24" />
  </Svg>
);

export const LanguageSelectModal: React.FC<LanguageSelectModalProps> = ({ 
  visible, onClose, selectedLanguage, onSelectLanguage 
}) => {
  
  const [tempLang, setTempLang] = useState(selectedLanguage);

  const handleSave = () => {
    onSelectLanguage(tempLang);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <TouchableOpacity activeOpacity={1} style={styles.modalBackdrop} onPress={onClose} />
        
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Select Language</Text>
          
          <ScrollView showsVerticalScrollIndicator={false} style={styles.list}>
            {LANGUAGES.map((lang, index) => (
              <View key={lang.id}>
                <TouchableOpacity activeOpacity={1} 
                  style={styles.languageRow} 
                  onPress={() => setTempLang(lang.id)}
                >
                  <Text style={styles.languageText}>{lang.title}</Text>
                  {tempLang === lang.id ? <RadioChecked /> : <RadioUnchecked />}
                </TouchableOpacity>
                {index < LANGUAGES.length - 1 && <View style={styles.divider} />}
              </View>
            ))}
          </ScrollView>

          <View style={styles.footer}>
            <Button 
              title="SAVE LANGUAGE" 
              onPress={handleSave}
              variant="primary"
              style={styles.saveBtn}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.4)' },
  modalBackdrop: { ...StyleSheet.absoluteFillObject },
  
  modalContent: { 
    backgroundColor: '#FFFFFF', 
    borderTopLeftRadius: 24, borderTopRightRadius: 24, 
    maxHeight: '80%', paddingHorizontal: 20, paddingTop: 24, paddingBottom: Platform.OS === 'ios' ? 40 : 24
  },
  modalTitle: { fontSize: 13, color: '#94A3B8', marginBottom: 16 },
  
  list: { marginBottom: 16 },
  languageRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16 },
  languageText: { fontSize: 13, fontWeight: '500', color: '#1E293B' },
  
  divider: { height: 1, backgroundColor: '#F1F5F9' },
  
  footer: { paddingTop: 16 },
  saveBtn: { backgroundColor: 'rgba(26, 15, 163, 1.00)', height: 48, borderRadius: 8 }
});
