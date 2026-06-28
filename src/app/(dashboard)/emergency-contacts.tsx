import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, Image, KeyboardAvoidingView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { BackArrowIcon } from '@/components/ui/Icons';
import Svg, { Path, Rect } from 'react-native-svg';
import { SearchContactsModal } from '@/components/common/SearchContactsModal';
import { useAndroidBack } from '@/hooks/useAndroidBack';

const SearchIcon = ({ color = '#0F172A' }) => (
  <Svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <Path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const TrashIcon = ({ color = '#EF4444' }) => (
  <Svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <Path d="M4 7H20M10 11V17M14 11V17M5 7L6 19C6 20.1046 6.89543 21 8 21H16C17.1046 21 18 20.1046 18 19L19 7M9 7V4C9 3.44772 9.44772 3 10 3H14C14.5523 3 15 3.44772 15 4V7" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const PlusIcon = ({ color = 'rgba(26, 15, 163, 1.00)' }) => (
  <Svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <Path d="M12 5V19M5 12H19" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const ChevronRight = ({ color = 'rgba(26, 15, 163, 1.00)' }) => (
  <Svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <Path d="M9 18L15 12L9 6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

type Contact = { id: string; name: string; phone: string; avatar: string };

const DEFAULT_CONTACTS: Contact[] = [
  { id: '1', name: 'A D Packaging Oil', phone: '9099022114', avatar: 'https://i.pravatar.cc/150?u=a1' },
  { id: '2', name: 'AJio Delivery', phone: '9110792602', avatar: 'https://i.pravatar.cc/150?u=a2' },
  { id: '3', name: '8003281009', phone: '8003281009', avatar: 'https://i.pravatar.cc/150?u=a3' },
];

export default function EmergencyContactsScreen() {
  const router = useSafeRouter();
  useAndroidBack(() => router.back());
  const [modalVisible, setModalVisible] = useState(false);
  const [contacts, setContacts] = useState<Contact[]>(DEFAULT_CONTACTS);

  const deleteContact = (id: string) => {
    setContacts(prev => prev.filter(c => c.id !== id));
  };

  const addContacts = (newContacts: { id: string; name: string; phone: string }[]) => {
    setContacts(prev => [
      ...prev,
      ...newContacts.map(c => ({ ...c, avatar: `https://i.pravatar.cc/150?u=${c.id}` })),
    ]);
  };

  return (
    <GradientBackground style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>

        <View style={styles.header}>
          <TouchableOpacity activeOpacity={1} onPress={() => router.back()} style={styles.backButton}>
            <BackArrowIcon size={24} color="#0F172A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Emergency Contacts</Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

          <View style={styles.card}>

            <TouchableOpacity activeOpacity={1} style={styles.searchFakeInput} onPress={() => setModalVisible(true)}>
              <SearchIcon color="#0F172A" />
              <Text style={styles.searchText}>Search contacts</Text>
            </TouchableOpacity>

            <Text style={styles.limitText}>You can add upto 4 contacts only</Text>

            {contacts.map(contact => (
              <View key={contact.id} style={styles.contactRow}>
                <Image source={{ uri: contact.avatar }} style={styles.avatarImage} />
                <View style={styles.contactInfo}>
                  <Text style={styles.contactName}>{contact.name}</Text>
                  <Text style={styles.contactPhone}>{contact.phone}</Text>
                </View>
                <TouchableOpacity activeOpacity={1} style={styles.deleteBtn} onPress={() => deleteContact(contact.id)}>
                  <TrashIcon />
                </TouchableOpacity>
              </View>
            ))}

            {contacts.length < 4 && (
              <TouchableOpacity activeOpacity={1} style={styles.addMoreBtn} onPress={() => setModalVisible(true)}>
                <PlusIcon />
                <Text style={styles.addMoreText}>Add More</Text>
                <ChevronRight />
              </TouchableOpacity>
            )}

          </View>

        </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>

      <SearchContactsModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onAdd={addContacts}
        existingIds={contacts.map(c => c.id)}
      />
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1,  },
  
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 16 },
  backButton: { marginRight: 12 },
  headerTitle: { fontSize: 16, fontWeight: '700', color: '#0F172A', flex: 1 },

  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },

  card: { backgroundColor: '#FFFFFF', borderRadius: 24, padding: 20 },

  searchFakeInput: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 12, marginBottom: 24 },
  searchText: { marginLeft: 8, fontSize: 13, color: '#0F172A' },

  limitText: { fontSize: 11, color: '#94A3B8', marginBottom: 16 },

  contactRow: { flexDirection: 'row', alignItems: 'center', padding: 12, borderWidth: 1, borderColor: '#F8FAFC', borderRadius: 16, marginBottom: 8 },
  avatarImage: { width: 40, height: 40, borderRadius: 20, marginRight: 12 },
  contactInfo: { flex: 1 },
  contactName: { fontSize: 13, fontWeight: '700', color: '#0F172A', marginBottom: 2 },
  contactPhone: { fontSize: 11, color: '#94A3B8' },
  deleteBtn: { width: 32, height: 32, borderRadius: 16, borderWidth: 1, borderColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center' },

  addMoreBtn: { flexDirection: 'row', alignItems: 'center', marginTop: 16 },
  addMoreText: { fontSize: 13, fontWeight: '700', color: 'rgba(26, 15, 163, 1.00)', marginLeft: 8, marginRight: 4 },
});
