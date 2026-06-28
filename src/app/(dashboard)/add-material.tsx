import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, KeyboardAvoidingView, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { BackArrowIcon } from '@/components/ui/Icons';
import Svg, { Path } from 'react-native-svg';
import { useAndroidBack } from '@/hooks/useAndroidBack';
import { StorageService } from '@/services/storage.service';

const TrashIcon = ({ color = '#EF4444' }) => (
  <Svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <Path d="M4 7H20M10 11V17M14 11V17M5 7L6 19C6 20.1046 6.89543 21 8 21H16C17.1046 21 18 20.1046 18 19L19 7M9 7V4C9 3.44772 9.44772 3 10 3H14C14.5523 3 15 3.44772 15 4V7" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export default function AddMaterialScreen() {
  useAndroidBack();
  const router = useSafeRouter();

  const [materials, setMaterials] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemQty, setNewItemQty] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [newItemBrand, setNewItemBrand] = useState('Generic');

  useEffect(() => {
    const loadItems = async () => {
      const stored = await StorageService.getItem<any[]>('TEMP_MATERIAL_ITEMS');
      if (stored && stored.length > 0) {
        // Normalize loaded elements to match correct formats
        setMaterials(stored.map((item, idx) => ({
          id: item.id || idx.toString(),
          name: item.name,
          qty: item.qty,
          price: item.price,
          brand: item.brand || 'Generic'
        })));
      } else {
        setMaterials([
          { id: '1', name: 'Copper Pipe (1/2 inch)', qty: 6, price: 650, brand: 'Astral CPVC Pro' },
          { id: '2', name: 'Insulation Tape', qty: 2, price: 20, brand: 'Premier 1700' },
        ]);
      }
    };
    loadItems();
  }, []);

  const calculateTotal = () => {
    return materials.reduce((acc, curr) => acc + (Number(curr.price) * Number(curr.qty)), 0);
  };

  const removeMaterial = (id: string) => {
    setMaterials(materials.filter(m => m.id !== id));
  };

  const handleAddNewItem = () => {
    if (!newItemName.trim() || !newItemQty || !newItemPrice) {
      Alert.alert('Validation Error', 'Please fill in Name, Quantity, and Price fields.');
      return;
    }
    
    const qty = parseInt(newItemQty) || 1;
    const price = parseFloat(newItemPrice) || 0;
    
    const newItem = {
      id: 'custom_' + Date.now(),
      name: newItemName.trim(),
      qty: qty,
      price: price,
      brand: newItemBrand.trim() || 'Generic'
    };

    setMaterials(prev => [...prev, newItem]);
    
    // Reset Form
    setNewItemName('');
    setNewItemQty('');
    setNewItemPrice('');
    setNewItemBrand('Generic');
    setShowForm(false);
  };

  const handleSaveItems = async () => {
    await StorageService.setItem('TEMP_MATERIAL_ITEMS', materials);
    router.back();
  };

  return (
    <GradientBackground style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flexArea}>
          
          <View style={styles.header}>
            <TouchableOpacity activeOpacity={1} onPress={() => router.back()} style={styles.backButton}>
              <BackArrowIcon size={24} color="#0F172A" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Add Material</Text>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            
            <View style={styles.mainCard}>
              
              <View style={styles.listContainer}>
                {materials.map(material => (
                  <View key={material.id} style={styles.itemCard}>
                    
                    <View style={styles.itemHeader}>
                      <View style={{ flex: 1, marginRight: 8 }}>
                        <Text style={styles.itemLabel}>ITEM NAME</Text>
                        <Text style={styles.itemName}>{material.name}</Text>
                        {material.brand && <Text style={styles.itemBrandText}>{material.brand}</Text>}
                      </View>
                      <TouchableOpacity activeOpacity={1} style={styles.trashBtn} onPress={() => removeMaterial(material.id)}>
                        <TrashIcon color="#EF4444" />
                      </TouchableOpacity>
                    </View>

                    <View style={styles.itemBody}>
                      <View style={styles.col}>
                        <Text style={styles.itemLabel}>QTY</Text>
                        <View style={styles.qtyBox}>
                          <Text style={styles.qtyText}>{material.qty}</Text>
                        </View>
                      </View>
                      
                      <View style={styles.col}>
                        <Text style={styles.itemLabel}>PRICE</Text>
                        <Text style={styles.priceText}>₹{material.price}</Text>
                      </View>
                    </View>

                  </View>
                ))}
              </View>

              {showForm ? (
                <View style={styles.formCard}>
                  <Text style={styles.formTitle}>Add New Material Item</Text>
                  
                  <Text style={styles.inputLabel}>ITEM NAME</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Enter item name"
                    placeholderTextColor="#94A3B8"
                    value={newItemName}
                    onChangeText={setNewItemName}
                  />

                  <Text style={styles.inputLabel}>BRAND (OPTIONAL)</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Enter brand name"
                    placeholderTextColor="#94A3B8"
                    value={newItemBrand}
                    onChangeText={setNewItemBrand}
                  />

                  <View style={styles.formRow}>
                    <View style={styles.formCol}>
                      <Text style={styles.inputLabel}>QTY</Text>
                      <TextInput
                        style={styles.textInput}
                        placeholder="1"
                        placeholderTextColor="#94A3B8"
                        keyboardType="numeric"
                        value={newItemQty}
                        onChangeText={setNewItemQty}
                      />
                    </View>
                    <View style={styles.formCol}>
                      <Text style={styles.inputLabel}>PRICE PER UNIT (₹)</Text>
                      <TextInput
                        style={styles.textInput}
                        placeholder="150"
                        placeholderTextColor="#94A3B8"
                        keyboardType="numeric"
                        value={newItemPrice}
                        onChangeText={setNewItemPrice}
                      />
                    </View>
                  </View>

                  <View style={styles.formActionRow}>
                    <TouchableOpacity activeOpacity={1} style={styles.formCancelBtn} onPress={() => setShowForm(false)}>
                      <Text style={styles.formCancelText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={1} style={styles.formConfirmBtn} onPress={handleAddNewItem}>
                      <Text style={styles.formConfirmText}>Add Item</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <TouchableOpacity activeOpacity={1} style={styles.addMoreBtn} onPress={() => setShowForm(true)}>
                  <Text style={styles.addMoreText}>+ Add More Items</Text>
                </TouchableOpacity>
              )}

            </View>

          </ScrollView>

          {/* Sticky Bottom Bar */}
          <View style={styles.bottomBar}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total Amount</Text>
              <Text style={styles.totalValue}>₹{calculateTotal()}</Text>
            </View>
            <TouchableOpacity activeOpacity={1} style={styles.addBtn} onPress={handleSaveItems}>
              <Text style={styles.addBtnText}>Save Items</Text>
            </TouchableOpacity>
          </View>

        </KeyboardAvoidingView>
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  flexArea: { flex: 1 },
  
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 16, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  backButton: { marginRight: 12 },
  headerTitle: { fontSize: 16, fontWeight: '700', color: '#0F172A', flex: 1 },

  scrollContent: { paddingHorizontal: 16, paddingBottom: 24, paddingTop: 16 },

  mainCard: { backgroundColor: '#FFFFFF', borderRadius: 24, padding: 20 },

  listContainer: { marginBottom: 16 },
  
  itemCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#F8FAFC' },
  
  itemHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  itemLabel: { fontSize: 9, fontWeight: '700', color: '#94A3B8', letterSpacing: 0.5, marginBottom: 4 },
  itemName: { fontSize: 13, fontWeight: '700', color: '#0F172A' },
  itemBrandText: { fontSize: 11, color: '#64748B', marginTop: 2 },
  
  trashBtn: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#FAF5FF', justifyContent: 'center', alignItems: 'center' },

  itemBody: { flexDirection: 'row', gap: 32 },
  col: {},
  qtyBox: { backgroundColor: '#E2E8F0', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, alignSelf: 'flex-start' },
  qtyText: { fontSize: 12, fontWeight: '700', color: '#0F172A' },
  priceText: { fontSize: 14, fontWeight: '800', color: '#0F172A' },

  addMoreBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, borderRadius: 16, borderWidth: 1, borderColor: 'rgba(26, 15, 163, 1.00)', borderStyle: 'dashed', backgroundColor: '#F8FAFC', marginTop: 12 },
  addMoreText: { fontSize: 13, fontWeight: '700', color: 'rgba(26, 15, 163, 1.00)' },

  formCard: { backgroundColor: '#F8FAFC', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#E2E8F0', marginTop: 12 },
  formTitle: { fontSize: 13, fontWeight: '700', color: '#0F172A', marginBottom: 12 },
  inputLabel: { fontSize: 9, fontWeight: '700', color: '#94A3B8', letterSpacing: 0.5, marginBottom: 4, marginTop: 8 },
  textInput: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, fontSize: 13, color: '#0F172A' },
  formRow: { flexDirection: 'row', gap: 16, marginTop: 8 },
  formCol: { flex: 1 },
  formActionRow: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12, marginTop: 16 },
  formCancelBtn: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: 12, borderWidth: 1, borderColor: '#CBD5E1' },
  formCancelText: { fontSize: 12, fontWeight: '600', color: '#64748B' },
  formConfirmBtn: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: 12, backgroundColor: 'rgba(26, 15, 163, 1.00)' },
  formConfirmText: { fontSize: 12, fontWeight: '600', color: '#FFFFFF' },

  bottomBar: { backgroundColor: '#FFFFFF', paddingHorizontal: 16, paddingBottom: 24, paddingTop: 16, borderTopLeftRadius: 24, borderTopRightRadius: 24, borderTopWidth: 1, borderTopColor: '#F1F5F9' },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, paddingHorizontal: 4 },
  totalLabel: { fontSize: 12, color: '#64748B' },
  totalValue: { fontSize: 20, fontWeight: '800', color: '#0F172A' },

  addBtn: { backgroundColor: 'rgba(26, 15, 163, 1.00)', paddingVertical: 16, borderRadius: 16, alignItems: 'center' },
  addBtnText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
});
