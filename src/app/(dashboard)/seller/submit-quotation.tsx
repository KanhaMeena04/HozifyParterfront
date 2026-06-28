import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, KeyboardAvoidingView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { useLocalSearchParams } from 'expo-router';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { BackArrowIcon } from '@/components/ui/Icons';
import { StorageService } from '@/services/storage.service';

export default function SubmitQuotationScreen() {
  const router = useSafeRouter();
  const { requestId } = useLocalSearchParams<{ requestId: string }>();
  const [request, setRequest] = useState<any>(null);
  const [prices, setPrices] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadRequest = async () => {
      if (requestId) {
        const stored = await StorageService.getMaterialRequests();
        const match = stored.find(r => r.requestId === requestId);
        if (match) {
          setRequest(match);
          const initialPrices: { [key: string]: string } = {};
          match.items.forEach((item: any) => {
            initialPrices[item.id] = item.quotedPrice ? String(item.quotedPrice) : String(item.price || '');
          });
          setPrices(initialPrices);
        } else {
          // Fallback mock request
          const mockReq = {
            requestId: requestId || 'RQ123456',
            items: [
              { id: '1', name: 'Split AC 1.5 Ton (Voltas)', qty: '5 Units', price: 35000 },
              { id: '2', name: 'Copper Piping (meters)', qty: '20 Units', price: 250 }
            ]
          };
          setRequest(mockReq);
          const initialPrices: { [key: string]: string } = {};
          mockReq.items.forEach((item: any) => {
            initialPrices[item.id] = String(item.price);
          });
          setPrices(initialPrices);
        }
      }
    };
    loadRequest();
  }, [requestId]);

  const handlePriceChange = (itemId: string, text: string) => {
    setPrices(prev => ({
      ...prev,
      [itemId]: text
    }));
  };

  const handleSubmit = async () => {
    if (!request) return;
    setIsLoading(true);

    const updatedItems = request.items.map((item: any) => ({
      ...item,
      quotedPrice: parseFloat(prices[item.id]) || item.price || 0
    }));

    let subtotal = 0;
    updatedItems.forEach((item: any) => {
      const qtyNum = parseInt(item.qty.replace(/[^0-9]/g, '')) || 1;
      subtotal += (item.quotedPrice || item.price || 0) * qtyNum;
    });
    const gstTotal = Math.round(subtotal * 0.18);
    const grandTotal = subtotal + gstTotal;

    const updatedRequest = {
      ...request,
      status: 'quoted',
      items: updatedItems,
      grandTotal: grandTotal,
      subtotal: subtotal,
      gstTotal: gstTotal,
      quotedAt: new Date().toLocaleDateString('en-IN') + ' ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    };

    await StorageService.saveMaterialRequest(updatedRequest);

    setIsLoading(false);
    router.replace('/(dashboard)/seller/quotation-requests');
  };

  if (!request) {
    return (
      <GradientBackground style={styles.container}>
        <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
          <Text style={{ textAlign: 'center', marginTop: 40, color: '#0F172A', fontWeight: '700' }}>Loading Request...</Text>
        </SafeAreaView>
      </GradientBackground>
    );
  }

  return (
    <GradientBackground style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity activeOpacity={1} onPress={() => router.back()} style={styles.backButton}>
            <BackArrowIcon size={24} color="#0F172A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Provide Quotation</Text>
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          <Card style={styles.card}>
            <Text style={styles.sectionTitle}>Material Pricing for {request.requestId}</Text>
            
            {request.items.map((item: any) => (
              <View key={item.id} style={styles.itemBox}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemQty}>Qty: {item.qty} ({item.brand})</Text>
                </View>
                <Input
                  label="Price per unit (₹)"
                  placeholder="0.00"
                  keyboardType="numeric"
                  value={prices[item.id] || ''}
                  onChangeText={(text) => handlePriceChange(item.id, text)}
                />
              </View>
            ))}

            <Button 
              title="Send Quotation" 
              onPress={handleSubmit} 
              isLoading={isLoading}
              variant="primary" 
              style={styles.submitBtn} 
            />
          </Card>
        </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16 },
  backButton: { marginRight: 12 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#0F172A' },
  content: { padding: 20 },
  card: { padding: 20, backgroundColor: '#FFFFFF', borderRadius: 24 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#0F172A', marginBottom: 16 },
  itemBox: { marginBottom: 16, padding: 12, backgroundColor: '#F8FAFC', borderRadius: 12, borderWidth: 1, borderColor: '#F1F5F9' },
  itemHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  itemName: { fontSize: 13, fontWeight: '600', color: '#334155', flex: 1, marginRight: 8 },
  itemQty: { fontSize: 12, color: '#64748B' },
  submitBtn: { marginTop: 16 }
});
