import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Platform,
  KeyboardAvoidingView,
  Modal,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { BackArrowIcon } from '@/components/ui/Icons';
import Svg, { Path, Rect, Defs, LinearGradient, Stop } from 'react-native-svg';
import { useAndroidBack } from '@/hooks/useAndroidBack';
import { Checkbox } from '@/components/ui/Checkbox';

const TrashIcon = ({ color = '#EF4444' }) => (
  <Svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <Path d="M4 7H20M10 11V17M14 11V17M5 7L6 19C6 20.1046 6.89543 21 8 21H16C17.1046 21 18 20.1046 18 19L19 7M9 7V4C9 3.44772 9.44772 3 10 3H14C14.5523 3 15 3.44772 15 4V7" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const EditIcon = ({ color = '#EAB308' }) => (
  <Svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <Path d="M11 4H4C2.89543 4 2 4.89543 2 6V20C2 21.1046 2.89543 22 4 22H18C19.1046 22 20 21.1046 20 20V13M18.5 2.5C19.8807 1.11929 22.1193 3.35786 20.7386 4.73858L11.5 14L8 15L9 11.5L18.5 2.5Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

type BankAccount = {
  id: string;
  bankName: string;
  fullName: string;
  accountNumber: string;
  ifsc: string;
  branch?: string;
  isPrimary: boolean;
};

export default function PaymentMethodScreen() {
  const router = useSafeRouter();
  useAndroidBack(() => router.back());

  const [banks, setBanks] = useState<BankAccount[]>([
    {
      id: '1',
      bankName: 'HDFC Bank',
      fullName: 'P ESWAR',
      accountNumber: '9992505024591601',
      ifsc: 'HDFC0001234',
      isPrimary: true,
    }
  ]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingBankId, setEditingBankId] = useState<string | null>(null);

  // Form State
  const [bankName, setBankName] = useState('');
  const [accountHolderName, setAccountHolderName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [confirmAccountNumber, setConfirmAccountNumber] = useState('');
  const [ifsc, setIfsc] = useState('');
  const [branch, setBranch] = useState('');
  const [isPrimarySelected, setIsPrimarySelected] = useState(false);

  // Form Errors State
  const [errors, setErrors] = useState<{
    bankName?: string;
    accountHolderName?: string;
    accountNumber?: string;
    confirmAccountNumber?: string;
    ifsc?: string;
  }>({});

  const handleInputChange = (field: string, value: string, setter: (val: string) => void) => {
    setter(value);
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = () => {
    let valid = true;
    const newErrors: typeof errors = {};

    if (!bankName.trim()) {
      newErrors.bankName = 'Bank name is required';
      valid = false;
    }

    if (!accountHolderName.trim()) {
      newErrors.accountHolderName = 'Account holder name is required';
      valid = false;
    }

    if (!accountNumber.trim()) {
      newErrors.accountNumber = 'Account number is required';
      valid = false;
    } else if (!/^\d+$/.test(accountNumber)) {
      newErrors.accountNumber = 'Account number must contain only numbers';
      valid = false;
    } else if (accountNumber.length < 9 || accountNumber.length > 18) {
      newErrors.accountNumber = 'Account number must be 9 to 18 digits';
      valid = false;
    }

    if (!confirmAccountNumber.trim()) {
      newErrors.confirmAccountNumber = 'Confirm account number is required';
      valid = false;
    } else if (confirmAccountNumber !== accountNumber) {
      newErrors.confirmAccountNumber = 'Account numbers do not match';
      valid = false;
    }

    if (!ifsc.trim()) {
      newErrors.ifsc = 'IFSC code is required';
      valid = false;
    } else {
      const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
      if (!ifscRegex.test(ifsc.toUpperCase())) {
        newErrors.ifsc = 'Invalid IFSC format (e.g. HDFC0001234)';
        valid = false;
      }
    }

    setErrors(newErrors);
    return valid;
  };

  const openAddModal = () => {
    if (banks.length >= 3) {
      Alert.alert('Limit Reached', 'You can only add a maximum of 3 bank accounts.');
      return;
    }
    setEditingBankId(null);
    setBankName('');
    setAccountHolderName('');
    setAccountNumber('');
    setConfirmAccountNumber('');
    setIfsc('');
    setBranch('');
    setIsPrimarySelected(banks.length === 0);
    setErrors({});
    setIsModalVisible(true);
  };

  const openEditModal = (bank: BankAccount) => {
    setEditingBankId(bank.id);
    setBankName(bank.bankName);
    setAccountHolderName(bank.fullName);
    setAccountNumber(bank.accountNumber);
    setConfirmAccountNumber(bank.accountNumber);
    setIfsc(bank.ifsc);
    setBranch(bank.branch || '');
    setIsPrimarySelected(bank.isPrimary);
    setErrors({});
    setIsModalVisible(true);
  };

  const saveBank = () => {
    if (!validateForm()) return;

    if (editingBankId) {
      setBanks(banks.map(b => {
        if (b.id === editingBankId) {
          return {
            ...b,
            bankName,
            fullName: accountHolderName,
            accountNumber,
            ifsc: ifsc.toUpperCase(),
            branch,
            isPrimary: isPrimarySelected ? true : b.isPrimary
          };
        }
        return isPrimarySelected ? { ...b, isPrimary: false } : b;
      }));
    } else {
      const isPrimary = banks.length === 0 || isPrimarySelected;
      const newBank: BankAccount = {
        id: Date.now().toString(),
        bankName,
        fullName: accountHolderName,
        accountNumber,
        ifsc: ifsc.toUpperCase(),
        branch,
        isPrimary,
      };

      let updatedBanks = [...banks];
      if (isPrimary) {
        updatedBanks = updatedBanks.map(b => ({ ...b, isPrimary: false }));
      }
      setBanks([...updatedBanks, newBank]);
    }
    setIsModalVisible(false);
  };

  const deleteBank = (id: string) => {
    Alert.alert('Delete Account', 'Are you sure you want to delete this account?', [
      { text: 'Cancel', style: 'cancel' },
      { 
        text: 'Delete', 
        style: 'destructive', 
        onPress: () => {
          const bankToDelete = banks.find(b => b.id === id);
          const newBanks = banks.filter(b => b.id !== id);
          if (bankToDelete?.isPrimary && newBanks.length > 0) {
            newBanks[0].isPrimary = true;
          }
          setBanks(newBanks);
        }
      }
    ]);
  };

  const setPrimaryBank = (id: string) => {
    setBanks(banks.map(b => ({
      ...b,
      isPrimary: b.id === id
    })));
  };

  const maskAccountNumber = (num: string) => {
    const lastFour = num.slice(-4);
    return `XXXX XXXX XXXX ${lastFour}`;
  };

  return (
    <GradientBackground style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <View style={styles.header}>
          <TouchableOpacity activeOpacity={1} onPress={() => router.back()} style={styles.backButton}>
            <BackArrowIcon size={24} color="#0F172A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Bank Accounts</Text>
          
          <TouchableOpacity activeOpacity={1} style={styles.helpBtn} onPress={() => router.push('/(dashboard)/help-advanced')}>
            <View style={StyleSheet.absoluteFill}>
              <Svg height="100%" width="100%" style={{ borderRadius: 8 }}>
                <Defs>
                  <LinearGradient id="gradHeader" x1="0" y1="0" x2="1" y2="0">
                    <Stop offset="0" stopColor="#F97316" stopOpacity="1" />
                    <Stop offset="1" stopColor="#FBBF24" stopOpacity="1" />
                  </LinearGradient>
                </Defs>
                <Rect width="100%" height="100%" fill="url(#gradHeader)" rx="8" />
              </Svg>
            </View>
            <Text style={styles.helpBtnText}>Help</Text>
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {banks.map((bank) => (
            <View key={bank.id} style={[styles.bankCard, bank.isPrimary && styles.primaryBankCard]}>
              <View style={styles.bankHeader}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => setPrimaryBank(bank.id)}
                  style={styles.bankHeaderLeft}
                >
                  <Checkbox
                    checked={bank.isPrimary}
                    onChange={() => setPrimaryBank(bank.id)}
                  />
                  <Text style={styles.bankName}>{bank.bankName}</Text>
                </TouchableOpacity>
                
                <View style={styles.bankActions}>
                  {bank.isPrimary && (
                    <View style={styles.primaryBadge}>
                      <Text style={styles.primaryBadgeText}>Primary</Text>
                    </View>
                  )}
                  <TouchableOpacity activeOpacity={1} onPress={() => openEditModal(bank)} style={styles.actionBtn}>
                    <EditIcon />
                  </TouchableOpacity>
                  <TouchableOpacity activeOpacity={1} onPress={() => deleteBank(bank.id)} style={styles.actionBtn}>
                    <TrashIcon />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.cardNumberContainer}>
                <Text style={styles.cardNumberText}>{maskAccountNumber(bank.accountNumber)}</Text>
              </View>
              <View style={styles.ifscContainer}>
                <Text style={styles.ifscText}>IFSC: {bank.ifsc}</Text>
              </View>
            </View>
          ))}

          {banks.length < 3 && (
            <TouchableOpacity activeOpacity={0.9} style={styles.addBtn} onPress={openAddModal}>
              <Text style={styles.addBtnText}>+ Add New Bank Account</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </SafeAreaView>

      <Modal visible={isModalVisible} animationType="fade" transparent>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{"Enter Your Bank\nAccount Details"}</Text>
              <TouchableOpacity activeOpacity={1} onPress={() => setIsModalVisible(false)} style={styles.closeModalBtn}>
                <Text style={styles.closeModalText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={styles.modalForm}>
              <View style={styles.fieldGroup}>
                <TextInput
                  style={[styles.input, errors.bankName && styles.inputError]}
                  value={bankName}
                  onChangeText={(val) => handleInputChange('bankName', val, setBankName)}
                  placeholder="Bank Name"
                  placeholderTextColor="#94A3B8"
                />
                {errors.bankName && <Text style={styles.errorText}>{errors.bankName}</Text>}
              </View>

              <View style={styles.fieldGroup}>
                <TextInput
                  style={[styles.input, errors.accountHolderName && styles.inputError]}
                  value={accountHolderName}
                  onChangeText={(val) => handleInputChange('accountHolderName', val, setAccountHolderName)}
                  placeholder="Account Holder Name"
                  placeholderTextColor="#94A3B8"
                />
                {errors.accountHolderName && <Text style={styles.errorText}>{errors.accountHolderName}</Text>}
              </View>

              <View style={styles.fieldGroup}>
                <TextInput
                  style={[styles.input, errors.accountNumber && styles.inputError]}
                  value={accountNumber}
                  onChangeText={(val) => handleInputChange('accountNumber', val, setAccountNumber)}
                  placeholder="Account Number"
                  placeholderTextColor="#94A3B8"
                  keyboardType="number-pad"
                />
                {errors.accountNumber && <Text style={styles.errorText}>{errors.accountNumber}</Text>}
              </View>

              <View style={styles.fieldGroup}>
                <TextInput
                  style={[styles.input, errors.confirmAccountNumber && styles.inputError]}
                  value={confirmAccountNumber}
                  onChangeText={(val) => handleInputChange('confirmAccountNumber', val, setConfirmAccountNumber)}
                  placeholder="Confirm Account Number"
                  placeholderTextColor="#94A3B8"
                  keyboardType="number-pad"
                />
                {errors.confirmAccountNumber && <Text style={styles.errorText}>{errors.confirmAccountNumber}</Text>}
              </View>

              <View style={styles.fieldGroup}>
                <TextInput
                  style={[styles.input, errors.ifsc && styles.inputError]}
                  value={ifsc}
                  onChangeText={(val) => handleInputChange('ifsc', val, setIfsc)}
                  placeholder="IFSC Code"
                  placeholderTextColor="#94A3B8"
                  autoCapitalize="characters"
                />
                {errors.ifsc && <Text style={styles.errorText}>{errors.ifsc}</Text>}
              </View>

              <View style={styles.fieldGroup}>
                <TextInput
                  style={styles.input}
                  value={branch}
                  onChangeText={setBranch}
                  placeholder="Branch (Optional)"
                  placeholderTextColor="#94A3B8"
                />
              </View>

              <View style={styles.primaryCheckboxRow}>
                <Checkbox
                  checked={isPrimarySelected}
                  onChange={setIsPrimarySelected}
                  label="Set as primary bank account"
                />
              </View>

              <TouchableOpacity activeOpacity={0.9} style={styles.confirmBtn} onPress={saveBank}>
                <Text style={styles.confirmBtnText}>Submit</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 16 },
  backButton: { marginRight: 12 },
  headerTitle: { fontSize: 20, fontWeight: '800', color: '#0F172A', flex: 1 },
  helpBtn: { paddingHorizontal: 16, paddingVertical: 6, borderRadius: 8, overflow: 'hidden', justifyContent: 'center', alignItems: 'center' },
  helpBtnText: { color: '#FFFFFF', fontSize: 11, fontWeight: '700' },
  scrollContent: { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 40 },

  bankCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  primaryBankCard: {
    borderColor: '#22C55E',
    borderWidth: 1.5,
  },
  
  bankHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  bankHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 8,
  },
  bankName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginLeft: 8,
  },
  
  primaryBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 4,
  },
  primaryBadgeText: {
    color: '#166534',
    fontSize: 11,
    fontWeight: '700',
  },

  bankActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  actionBtn: {
    padding: 4,
  },

  cardNumberContainer: {
    marginBottom: 6,
  },
  cardNumberText: {
    fontSize: 15,
    color: '#475569',
    letterSpacing: 1.5,
    fontWeight: '500',
  },
  ifscContainer: {},
  ifscText: {
    fontSize: 12,
    color: '#94A3B8',
  },

  addBtn: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  addBtnText: {
    color: '#0F172A',
    fontSize: 15,
    fontWeight: '700',
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    width: '90%',
    maxHeight: '85%',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    lineHeight: 28,
  },
  closeModalBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeModalText: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '800',
  },

  modalForm: {
    width: '100%',
  },
  fieldGroup: {
    marginBottom: 14,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 14,
    color: '#0F172A',
    backgroundColor: '#FFFFFF',
  },
  inputError: {
    borderColor: '#EF4444',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 11,
    marginTop: 4,
    marginLeft: 4,
    fontWeight: '500',
  },
  primaryCheckboxRow: {
    marginBottom: 20,
    marginTop: 6,
  },
  confirmBtn: {
    backgroundColor: '#1E0E9C',
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
    width: '65%',
    alignSelf: 'center',
    elevation: 3,
    shadowColor: '#1E0E9C',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  confirmBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
