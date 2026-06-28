import { useSafeRouter } from '@/hooks/useSafeRouter';
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView, Platform, Switch, KeyboardAvoidingView, Alert, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import {  useLocalSearchParams } from 'expo-router';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { BackArrowIcon, UploadIcon, PlusIcon, ChevronDownIcon } from '@/components/ui/Icons';

const COUNTRIES = ['India', 'United States', 'United Kingdom', 'Canada', 'Australia', 'Germany', 'France', 'UAE', 'Singapore', 'Nepal', 'Bangladesh', 'Sri Lanka'];
const ALL_STATES = ['Andhra Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Delhi', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'];
const ALL_DISTRICTS = ['Agra', 'Aligarh', 'Allahabad', 'Ambedkar Nagar', 'Amethi', 'Amroha', 'Aurangabad', 'Azamgarh', 'Baghpat', 'Bahraich', 'Ballia', 'Balrampur', 'Banda', 'Barabanki', 'Bareilly', 'Basti', 'Bijnor', 'Budaun', 'Bulandshahr', 'Chandauli', 'Chitrakoot', 'Deoria', 'Etah', 'Etawah', 'Faizabad', 'Farrukhabad', 'Fatehpur', 'Firozabad', 'Gautam Buddha Nagar', 'Ghaziabad', 'Ghazipur', 'Gonda', 'Gorakhpur', 'Hamirpur', 'Hapur', 'Hardoi', 'Hathras', 'Jalaun', 'Jaunpur', 'Jhansi', 'Kannauj', 'Kanpur Dehat', 'Kanpur Nagar', 'Kasganj', 'Kaushambi', 'Kushinagar', 'Lakhimpur Kheri', 'Lalitpur', 'Lucknow', 'Maharajganj', 'Mahoba', 'Mainpuri', 'Mathura', 'Mau', 'Meerut', 'Mirzapur', 'Moradabad', 'Muzaffarnagar', 'Pilibhit', 'Pratapgarh', 'Raebareli', 'Rampur', 'Saharanpur', 'Sambhal', 'Sant Kabir Nagar', 'Shahjahanpur', 'Shamli', 'Shravasti', 'Siddharthnagar', 'Sitapur', 'Sonbhadra', 'Sultanpur', 'Unnao', 'Varanasi', 'Ahmednagar', 'Akola', 'Amravati', 'Beed', 'Bhandara', 'Buldhana', 'Chandrapur', 'Dhule', 'Gadchiroli', 'Gondia', 'Hingoli', 'Jalgaon', 'Jalna', 'Kolhapur', 'Latur', 'Mumbai City', 'Mumbai Suburban', 'Nagpur', 'Nanded', 'Nandurbar', 'Nashik', 'Osmanabad', 'Palghar', 'Parbhani', 'Pune', 'Raigad', 'Ratnagiri', 'Sangli', 'Satara', 'Sindhudurg', 'Solapur', 'Thane', 'Wardha', 'Washim', 'Yavatmal', 'Ahmedabad', 'Amreli', 'Anand', 'Aravalli', 'Banaskantha', 'Bharuch', 'Bhavnagar', 'Botad', 'Chhota Udaipur', 'Dahod', 'Dang', 'Gandhinagar', 'Gir Somnath', 'Jamnagar', 'Junagadh', 'Kutch', 'Kheda', 'Mahisagar', 'Mehsana', 'Morbi', 'Narmada', 'Navsari', 'Panchmahal', 'Patan', 'Porbandar', 'Rajkot', 'Sabarkantha', 'Surat', 'Surendranagar', 'Tapi', 'Vadodara', 'Valsad', 'Ajmer', 'Alwar', 'Banswara', 'Baran', 'Barmer', 'Bharatpur', 'Bhilwara', 'Bikaner', 'Bundi', 'Chittorgarh', 'Churu', 'Dausa', 'Dholpur', 'Dungarpur', 'Hanumangarh', 'Jaipur', 'Jaisalmer', 'Jalore', 'Jhalawar', 'Jhunjhunu', 'Jodhpur', 'Karauli', 'Kota', 'Nagaur', 'Pali', 'Rajsamand', 'Sawai Madhopur', 'Sikar', 'Sirohi', 'Sri Ganganagar', 'Tonk', 'Udaipur', 'Bagalkot', 'Ballari', 'Belagavi', 'Bengaluru Rural', 'Bengaluru Urban', 'Bidar', 'Chamarajanagar', 'Chikballapur', 'Chikkamagaluru', 'Chitradurga', 'Dakshina Kannada', 'Davangere', 'Dharwad', 'Gadag', 'Hassan', 'Haveri', 'Kalaburagi', 'Kodagu', 'Kolar', 'Koppal', 'Mandya', 'Mysuru', 'Raichur', 'Ramanagara', 'Shivamogga', 'Tumakuru', 'Udupi', 'Uttara Kannada', 'Vijayapura', 'Yadgir', 'Ariyalur', 'Chengalpattu', 'Chennai', 'Coimbatore', 'Cuddalore', 'Dharmapuri', 'Dindigul', 'Erode', 'Kallakurichi', 'Kanchipuram', 'Kanyakumari', 'Karur', 'Krishnagiri', 'Madurai', 'Mayiladuthurai', 'Nagapattinam', 'Namakkal', 'Nilgiris', 'Perambalur', 'Pudukkottai', 'Ramanathapuram', 'Ranipet', 'Salem', 'Sivaganga', 'Tenkasi', 'Thanjavur', 'Theni', 'Thoothukudi', 'Tiruchirappalli', 'Tirunelveli', 'Tirupathur', 'Tiruppur', 'Tiruvallur', 'Tiruvannamalai', 'Tiruvarur', 'Vellore', 'Viluppuram', 'Virudhunagar', 'Central Delhi', 'East Delhi', 'New Delhi', 'North Delhi', 'North East Delhi', 'North West Delhi', 'Shahdara', 'South Delhi', 'South East Delhi', 'South West Delhi', 'West Delhi'];
const ALL_CITIES = ['Lucknow', 'Agra', 'Varanasi', 'Kanpur', 'Allahabad', 'Meerut', 'Bareilly', 'Gorakhpur', 'Ghaziabad', 'Mathura', 'Noida', 'Firozabad', 'Moradabad', 'Saharanpur', 'Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Aurangabad', 'Solapur', 'Kolhapur', 'Thane', 'Navi Mumbai', 'Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar', 'Jamnagar', 'Gandhinagar', 'Jaipur', 'Jodhpur', 'Kota', 'Bikaner', 'Ajmer', 'Udaipur', 'Bengaluru', 'Mysuru', 'Hubli', 'Dharwad', 'Mangaluru', 'Belagavi', 'Davangere', 'Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Tirunelveli', 'Erode', 'Vellore', 'Delhi', 'New Delhi', 'Dwarka', 'Rohini', 'Pitampura', 'Lajpat Nagar', 'Saket', 'Connaught Place', 'Hyderabad', 'Secunderabad', 'Warangal', 'Nizamabad', 'Karimnagar', 'Khammam', 'Kolkata', 'Howrah', 'Durgapur', 'Asansol', 'Siliguri', 'Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur', 'Bhopal', 'Indore', 'Gwalior', 'Jabalpur', 'Ujjain', 'Raipur', 'Bilaspur', 'Durg', 'Bhilai', 'Chandigarh', 'Mohali', 'Panchkula', 'Amritsar', 'Ludhiana', 'Jalandhar', 'Faridabad', 'Gurugram', 'Ambala', 'Rohtak', 'Panipat', 'Dehradun', 'Haridwar', 'Rishikesh', 'Haldwani', 'Roorkee', 'Ranchi', 'Jamshedpur', 'Dhanbad', 'Bokaro', 'Bhubaneswar', 'Cuttack', 'Rourkela', 'Berhampur', 'Guwahati', 'Dibrugarh', 'Silchar', 'Thiruvananthapuram', 'Kochi', 'Kozhikode', 'Thrissur', 'Kollam', 'Visakhapatnam', 'Vijayawada', 'Guntur', 'Nellore', 'Kurnool'];
import { COLORS } from '@/constants';
import { useAndroidBack } from '@/hooks/useAndroidBack';
import { StorageService } from '@/services/storage.service';
import { SelectOptionsModal } from '@/components/common/SelectOptionsModal';
import { DatePickerModal } from '@/components/ui/DatePickerModal';
import { SearchableDropdown } from '@/components/common/SearchableDropdown';
import { SafeAreaView } from 'react-native-safe-area-context';
import { completeStepAndNavigate } from '@/utils/onboarding';

export default function CreateProfileScreen() {
  useAndroidBack();
  const router = useSafeRouter();
  const { mode } = useLocalSearchParams<{ mode?: string }>();
  const isReadOnly = mode === 'view';

  const maxDobDate = (() => {
    const d = new Date();
    d.setFullYear(d.getFullYear() - 18);
    return d;
  })();
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [modalType, setModalType] = useState<string | null>(null);
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [dateValue, setDateValue] = useState(maxDobDate);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isApproved, setIsApproved] = useState(false);

  const getOptions = () => {
    switch (modalType) {
      case 'gender': return [{ label: 'Male', value: 'Male' }, { label: 'Female', value: 'Female' }, { label: 'Other', value: 'Other' }];
      default: return [];
    }
  };

  const getModalTitle = () => {
    switch (modalType) {
      case 'gender': return 'Select Gender';
      default: return '';
    }
  };

  const handleSelect = (val: string) => {
    if (modalType) {
      updateForm(modalType as any, val);
    }
    setModalType(null);
  };

  const handleDateChange = (event: any, date?: Date) => {
    if (date) {
      setDateValue(date);
      const formatted = `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
      updateForm('dob', formatted);
      if (errors.dob) setErrors(prev => ({ ...prev, dob: '' }));
    }
  };

  const [errors, setErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    useWhatsApp: true,
    dob: '',
    gender: '',
    businessName: '',
    address: '',
    country: '',
    state: '',
    district: '',
    city: '',
    pincode: '',
  });

  const updateForm = (key: keyof typeof form, value: string | boolean) => {
    if (isReadOnly) return;
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    const loadProfile = async () => {
      const session = await StorageService.getUserSession();
      setUserRole(session?.role || null);
      if (session?.isApproved) {
        setIsApproved(true);
      }

      const profile = await StorageService.getPartnerProfile();
      if (profile) {
        setForm((prev) => ({ ...prev, ...profile }));
        if (profile.profilePhoto) {
          setProfilePhoto(profile.profilePhoto);
        }
        if (profile.dob) {
          const parts = profile.dob.split('/');
          if (parts.length === 3) {
            const d = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
            if (!isNaN(d.getTime())) {
              setDateValue(d);
            }
          }
        }
      }
    };
    loadProfile();
  }, []);

  const handlePickPhoto = async () => {
    if (isReadOnly) return;
    Alert.alert(
      'Upload Profile Picture',
      'Choose an option to upload your photo',
      [
        {
          text: 'Camera',
          onPress: handleTakePhoto,
        },
        {
          text: 'Gallery',
          onPress: handlePickPhotoFromLibrary,
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    );
  };

  const handleTakePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please allow camera access to take a photo.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled) {
      setProfilePhoto(result.assets[0].uri);
    }
  };

  const handlePickPhotoFromLibrary = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please allow gallery access to upload a profile photo.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled) {
      setProfilePhoto(result.assets[0].uri);
    }
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(auth)/role-selection');
    }
  };

  const handleSave = async () => {
    if (isReadOnly) {
      if (isApproved && !!mode) router.back();
      else await completeStepAndNavigate('partnerProfile', router, 'completed');
      return;
    }

    if (!profilePhoto) {
      Alert.alert("Validation Error", "Profile photo is required");
      return;
    }

    const newErrors: Record<string, string> = {};
    const nameRegex = /^[A-Za-z\s]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!form.firstName.trim()) newErrors.firstName = "First name is required";
    else if (!nameRegex.test(form.firstName)) newErrors.firstName = "Only alphabets allowed";

    if (!form.lastName.trim()) newErrors.lastName = "Last name is required";
    else if (!nameRegex.test(form.lastName)) newErrors.lastName = "Only alphabets allowed";

    if (!form.email.trim()) newErrors.email = "Email is required";
    else if (!emailRegex.test(form.email)) newErrors.email = "Invalid email format";

    if (!form.dob) {
      newErrors.dob = "Date of birth is required";
    } else {
      const parts = form.dob.split('/');
      if (parts.length === 3) {
        const birthDate = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
        if (age < 18) {
          newErrors.dob = "Must be at least 18 years old";
        }
      } else {
        newErrors.dob = "Invalid date format";
      }
    }
    if (!form.gender) newErrors.gender = "Gender is required";

    if (form.businessName && !nameRegex.test(form.businessName)) {
      newErrors.businessName = "Only alphabets allowed";
    }

    if (!form.address.trim()) newErrors.address = "Address is required";
    if (!form.country) newErrors.country = "Country is required";
    if (!form.state) newErrors.state = "State is required";
    if (!form.district) newErrors.district = "District is required";
    if (!form.city) newErrors.city = "City is required";

    if (!form.pincode.trim()) newErrors.pincode = "Pincode is required";
    else if (!/^\d{6}$/.test(form.pincode.trim())) newErrors.pincode = "Must be 6 digits";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return; // Stop if there are validation errors
    }

    await StorageService.setPartnerProfile({
      ...form,
      profilePhoto: profilePhoto || undefined,
    });
    if (isApproved && !!mode) {
      router.back();
    } else {
      await completeStepAndNavigate('partnerProfile', router, 'completed');
    }
  };

  return (
    <GradientBackground style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.topSection}>
          <TouchableOpacity activeOpacity={1} onPress={handleBack} style={styles.backButton}>
            <BackArrowIcon size={24} color="#0F172A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {isApproved ? "Edit Profile" : "Create Profile"}
          </Text>
        </View>

        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
        >
          <Card style={styles.card} variant="default">
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}
              keyboardShouldPersistTaps="handled"
              nestedScrollEnabled
            >
              {/* Upload Photo Section */}
              <View style={styles.uploadSection}>
                <TouchableOpacity activeOpacity={1}
                  onPress={handlePickPhoto}
                  style={styles.uploadCircle}
                >
                  {profilePhoto ? (
                    <Image
                      source={{ uri: profilePhoto }}
                      style={styles.profileImage}
                    />
                  ) : (
                    <>
                      <UploadIcon size={24} color="#94A3B8" />
                      <Text style={styles.uploadText}>UPLOAD</Text>
                    </>
                  )}
                  <View style={styles.plusBadge}>
                    <PlusIcon size={12} color="#FFFFFF" />
                  </View>
                </TouchableOpacity>
                <Text style={styles.uploadSubtitle}>
                  Add a professional photo for your ID
                </Text>
              </View>

              {/* Personal Details */}
              <Text style={styles.sectionTitle}>Personal Details</Text>
              <View style={styles.divider} />

              <View style={styles.row}>
                <View style={styles.flex1}>
                  <Input
                    label="First Name"
                    placeholder="First Name"
                    value={form.firstName}
                    editable={!isReadOnly}
                    pointerEvents={isReadOnly ? "none" : "auto"}
                    onChangeText={(t) => {
                      const sanitized = t.replace(/[^A-Za-z\s]/g, '');
                      updateForm("firstName", sanitized);
                      if (errors.firstName) setErrors(prev => ({ ...prev, firstName: '' }));
                    }}
                    error={errors.firstName}
                  />
                </View>
                <View style={styles.flex1}>
                  <Input
                    label="Last Name"
                    placeholder="Last Name"
                    value={form.lastName}
                    editable={!isReadOnly}
                    pointerEvents={isReadOnly ? "none" : "auto"}
                    onChangeText={(t) => {
                      const sanitized = t.replace(/[^A-Za-z\s]/g, '');
                      updateForm("lastName", sanitized);
                      if (errors.lastName) setErrors(prev => ({ ...prev, lastName: '' }));
                    }}
                    error={errors.lastName}
                  />
                </View>
              </View>

              <Input
                label="Email Address"
                placeholder="Enter your email"
                keyboardType="email-address"
                value={form.email}
                editable={!isReadOnly}
                pointerEvents={isReadOnly ? "none" : "auto"}
                onChangeText={(t) => { updateForm("email", t); if (errors.email) setErrors(prev => ({ ...prev, email: '' })); }}
                error={errors.email}
              />

              <View style={styles.toggleContainer}>
                <View style={styles.toggleTextContainer}>
                  <Text style={styles.toggleTitle}>Use as WhatsApp Number</Text>
                  <Text style={styles.toggleSubtitle}>
                    Get important alerts via WhatsApp
                  </Text>
                </View>
                <Switch
                  value={form.useWhatsApp}
                  onValueChange={(v) => updateForm("useWhatsApp", v)}
                  trackColor={{ false: "#E2E8F0", true: COLORS.primary }}
                  thumbColor="#FFFFFF"
                  disabled={isReadOnly}
                />
              </View>

              <View style={styles.row}>
                <View style={styles.flex1}>
                  <TouchableOpacity activeOpacity={1}
                    onPress={() => !isReadOnly && setDatePickerVisible(true)}
                  >
                    <Input
                      label="Date of Birth"
                      placeholder="DD/MM/YYYY"
                      value={form.dob}
                      editable={false}
                      pointerEvents="none"
                      error={errors.dob}
                    />
                  </TouchableOpacity>
                </View>
                <View style={styles.flex1}>
                  <TouchableOpacity activeOpacity={1}
                    onPress={() => !isReadOnly && setModalType("gender")}
                    disabled={isReadOnly}
                  >
                    <Input
                      label="Gender"
                      value={form.gender}
                      placeholder="Select"
                      editable={false}
                      pointerEvents="none"
                      style={{ marginBottom: 12 }}
                      rightIcon={<ChevronDownIcon size={20} color="#64748B" />}
                      error={errors.gender}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Business & Location */}
              <Text style={[styles.sectionTitle, { marginTop: 8 }]}>
                Business & Location
              </Text>
              <View style={styles.divider} />

              <Input
                label="Business Name"
                placeholder="Business Name"
                value={form.businessName}
                editable={!isReadOnly}
                pointerEvents={isReadOnly ? "none" : "auto"}
                onChangeText={(t) => {
                  const sanitized = t.replace(/[^A-Za-z\s]/g, '');
                  updateForm("businessName", sanitized);
                  if (errors.businessName) setErrors(prev => ({ ...prev, businessName: '' }));
                }}
                error={errors.businessName}
              />

              <Input
                label="Full Address"
                placeholder="Street address, apartment, suite"
                value={form.address}
                editable={!isReadOnly}
                pointerEvents={isReadOnly ? "none" : "auto"}
                onChangeText={(t) => { updateForm("address", t); if (errors.address) setErrors(prev => ({ ...prev, address: '' })); }}
                error={errors.address}
              />

              <View style={[styles.row, { zIndex: 20 }]}>
                <SearchableDropdown
                  label="Country"
                  placeholder="Type"
                  value={form.country}
                  options={COUNTRIES}
                  onChange={(t) => { updateForm("country", t); updateForm("state", ""); updateForm("district", ""); updateForm("city", ""); if (errors.country) setErrors(prev => ({ ...prev, country: '' })); }}
                  disabled={isReadOnly}
                  error={errors.country}
                />
                <SearchableDropdown
                  label="State"
                  placeholder="Type"
                  value={form.state}
                  options={ALL_STATES}
                  onChange={(t) => { updateForm("state", t); updateForm("district", ""); updateForm("city", ""); if (errors.state) setErrors(prev => ({ ...prev, state: '' })); }}
                  disabled={isReadOnly}
                  error={errors.state}
                />
              </View>

              <View style={[styles.row, { zIndex: 10 }]}>
                <SearchableDropdown
                  label="District"
                  placeholder="Type"
                  value={form.district}
                  options={ALL_DISTRICTS}
                  onChange={(t) => { updateForm("district", t); updateForm("city", ""); if (errors.district) setErrors(prev => ({ ...prev, district: '' })); }}
                  disabled={isReadOnly}
                  error={errors.district}
                />
                <SearchableDropdown
                  label="City"
                  placeholder="Type"
                  value={form.city}
                  options={ALL_CITIES}
                  onChange={(t) => { updateForm("city", t); if (errors.city) setErrors(prev => ({ ...prev, city: '' })); }}
                  disabled={isReadOnly}
                  error={errors.city}
                />
              </View>

              <Input
                label="Pincode / ZIP"
                placeholder="123456"
                keyboardType="number-pad"
                value={form.pincode}
                editable={!isReadOnly}
                pointerEvents={isReadOnly ? "none" : "auto"}
                onChangeText={(t) => {
                  const sanitized = t.replace(/[^0-9]/g, '');
                  updateForm("pincode", sanitized);
                  if (errors.pincode) setErrors(prev => ({ ...prev, pincode: '' }));
                }}
                error={errors.pincode}
              />

              {!isReadOnly && (
                <Button
                  title={isApproved ? "Save Changes" : "Save and Continue"}
                  onPress={handleSave}
                  variant="primary"
                  style={styles.saveBtn}
                />
              )}
            </ScrollView>
          </Card>
        </KeyboardAvoidingView>
      </SafeAreaView>

      <DatePickerModal
        visible={datePickerVisible}
        value={dateValue}
        onChange={handleDateChange}
        onClose={() => setDatePickerVisible(false)}
        maximumDate={maxDobDate}
      />

      <SelectOptionsModal
        visible={!!modalType}
        onClose={() => setModalType(null)}
        title={getModalTitle()}
        options={getOptions()}
        onSelect={handleSelect}
      />
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    ...Platform.select({
      web: {
        width: '100%',
        maxWidth: 600,
        alignSelf: 'center',
        paddingHorizontal: 20,
      },
    }),
  },
  topSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
  },
  card: {
    flex: 1,
    width: '92%',
    alignSelf: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    marginBottom: 16,
    padding: 0,
    boxShadow: '0px -2px 8px rgba(0, 0, 0, 0.08)',
    elevation: 2,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 32,
  },
  uploadSection: {
    alignItems: 'center',
    marginBottom: 16,
  },
  uploadCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    position: 'relative',
    backgroundColor: '#F8FAFC',
  },
  uploadText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#94A3B8',
    marginTop: 4,
  },
  profileImage: {
    width: 78,
    height: 78,
    borderRadius: 39,
  },
  plusBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  uploadSubtitle: {
    fontSize: 14,
    color: '#64748B',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginTop: 8,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  flex1: {
    flex: 1,
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    backgroundColor: '#FAFAFA',
  },
  toggleTextContainer: {
    flex: 1,
    paddingRight: 16,
  },
  toggleTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 4,
  },
  toggleSubtitle: {
    fontSize: 12,
    color: '#94A3B8',
  },
  saveBtn: {
    marginTop: 12,
    marginBottom: 12,
  },
});
