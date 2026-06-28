import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';

interface Contact {
  id: string;
  name: string;
  phone: string;
}

interface SearchContactsModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd?: (contacts: Contact[]) => void;
  existingIds?: string[];
}

const SearchIcon = ({ color = '#0F172A' }) => (
  <Svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <Path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const CloseIcon = ({ color = '#FFFFFF' }) => (
  <Svg width="12" height="12" viewBox="0 0 24 24" fill="none">
    <Path d="M18 6L6 18M6 6L18 18" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const CheckboxIcon = ({ checked = false, color = 'rgba(26, 15, 163, 1.00)' }) => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <Rect x="3" y="3" width="18" height="18" rx="4" fill={checked ? color : 'transparent'} stroke={checked ? color : '#CBD5E1'} strokeWidth="2" />
    {checked && <Path d="M8 12L11 15L16 9" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />}
  </Svg>
);

const CloseModalIcon = ({ color = '#0F172A' }) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path d="M18 6L6 18M6 6L18 18" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

// These IDs are separate from emergency-contacts DEFAULT_CONTACTS ids
const ALL_CONTACTS: Contact[] = [
  { id: 'c1', name: 'Rahul Sharma', phone: '9876543210' },
  { id: 'c2', name: 'Priya Verma', phone: '8765432109' },
  { id: 'c3', name: 'Amit Kumar', phone: '7654321098' },
  { id: 'c4', name: 'Sunita Devi', phone: '9988776655' },
  { id: 'c5', name: 'Vijay Singh', phone: '9012345678' },
  { id: 'c6', name: 'Meena Gupta', phone: '8901234567' },
  { id: 'c7', name: 'Ravi Patel', phone: '7890123456' },
  { id: 'c8', name: 'Kavita Joshi', phone: '6789012345' },
];

const AVATAR_COLORS = ['rgba(26, 15, 163, 1.00)', '#0891B2', '#059669', '#D97706', '#DC2626', 'rgba(26, 15, 163, 1.00)', '#DB2777', '#0284C7'];

const InitialAvatar = ({ name, id }: { name: string; id: string }) => {
  const idx = parseInt(id.replace('c', ''), 10) - 1;
  const bg = AVATAR_COLORS[idx % AVATAR_COLORS.length];
  const initials = name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
  return (
    <View style={[avatarStyle.circle, { backgroundColor: bg }]}>
      <Text style={avatarStyle.text}>{initials}</Text>
    </View>
  );
};

const avatarStyle = StyleSheet.create({
  circle: { width: 40, height: 40, borderRadius: 20, marginRight: 12, justifyContent: 'center', alignItems: 'center' },
  text: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
});

export const SearchContactsModal: React.FC<SearchContactsModalProps> = ({
  visible,
  onClose,
  onAdd,
  existingIds = [],
}) => {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<string[]>([]);

  React.useEffect(() => {
    if (visible) {
      setSelected([]);
      setSearch('');
    }
  }, [visible]);

  const filtered = ALL_CONTACTS.filter(
    c =>
      !existingIds.includes(c.id) &&
      (c.name.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search))
  );

  const toggleSelect = (id: string) => {
    setSelected(prev => {
      if (prev.includes(id)) return prev.filter(x => x !== id);
      if (prev.length + existingIds.length >= 4) return prev;
      return [...prev, id];
    });
  };

  const handleAdd = () => {
    const added = ALL_CONTACTS.filter(c => selected.includes(c.id));
    onAdd?.(added);
    onClose();
  };

  const selectedContacts = ALL_CONTACTS.filter(c => selected.includes(c.id));

  return (
    <Modal visible={visible} animationType="slide" transparent statusBarTranslucent>
      <View style={styles.overlay}>
        <View style={styles.sheetContainer}>

          <TouchableOpacity activeOpacity={1} style={styles.closeBtn} onPress={onClose}>
            <CloseModalIcon />
          </TouchableOpacity>

          <View style={styles.searchContainer}>
            <SearchIcon />
            <TextInput
              placeholder="Search contacts"
              style={styles.searchInput}
              placeholderTextColor="#64748B"
              value={search}
              onChangeText={setSearch}
            />
          </View>

          <Text style={styles.limitText}>You can add upto 4 contacts only</Text>

          {selectedContacts.length > 0 && (
            <View style={styles.pillContainer}>
              {selectedContacts.map(c => (
                <View key={`pill-${c.id}`} style={styles.pill}>
                  <Text style={styles.pillText}>{c.name}</Text>
                  <TouchableOpacity activeOpacity={1} onPress={() => toggleSelect(c.id)} style={styles.pillClose}>
                    <CloseIcon />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}

          <ScrollView showsVerticalScrollIndicator={false} style={styles.listContainer} keyboardShouldPersistTaps="handled">
            {filtered.length === 0 && (
              <Text style={styles.emptyText}>No contacts found</Text>
            )}
            {filtered.map(contact => (
              <TouchableOpacity activeOpacity={1}
                key={contact.id}
                style={[styles.contactRow, selected.includes(contact.id) && styles.contactRowSelected]}
                onPress={() => toggleSelect(contact.id)}
              >
                <InitialAvatar name={contact.name} id={contact.id} />
                <View style={styles.contactInfo}>
                  <Text style={styles.contactName}>{contact.name}</Text>
                  <Text style={styles.contactPhone}>{contact.phone}</Text>
                </View>
                <CheckboxIcon checked={selected.includes(contact.id)} />
              </TouchableOpacity>
            ))}
          </ScrollView>

          <TouchableOpacity activeOpacity={1}
            style={[styles.addBtn, selected.length === 0 && styles.addBtnDisabled]}
            onPress={handleAdd}
            disabled={selected.length === 0}
          >
            <Text style={styles.addBtnText}>
              {selected.length > 0 ? `ADD (${selected.length})` : 'ADD'}
            </Text>
          </TouchableOpacity>

        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  sheetContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    height: '80%',
  },

  closeBtn: { alignSelf: 'flex-end', padding: 8 },

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
  },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 13, color: '#0F172A' },

  limitText: { fontSize: 11, color: '#94A3B8', marginBottom: 12 },

  pillContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(26, 15, 163, 1.00)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  pillText: { color: '#FFFFFF', fontSize: 11, fontWeight: '600' },
  pillClose: { padding: 2 },

  listContainer: { flex: 1 },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    borderRadius: 16,
    marginBottom: 8,
    backgroundColor: '#FFFFFF',
  },
  contactRowSelected: {
    borderColor: 'rgba(26, 15, 163, 0.3)',
    backgroundColor: '#F5F3FF',
  },
  contactInfo: { flex: 1 },
  contactName: { fontSize: 13, fontWeight: '700', color: '#0F172A', marginBottom: 2 },
  contactPhone: { fontSize: 11, color: '#94A3B8' },

  addBtn: {
    backgroundColor: 'rgba(26, 15, 163, 1.00)',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12,
  },
  addBtnDisabled: { backgroundColor: '#CBD5E1' },
  addBtnText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
  emptyText: { textAlign: 'center', color: '#94A3B8', fontSize: 13, marginTop: 24 },
});
