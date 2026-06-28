import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, TextInput, PanResponder, Alert, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';
import { Button } from '@/components/ui/Button';
import { Switch } from '@/components/ui/Switch';
import { CloseIcon, SearchIcon, LocationPinIcon } from '@/components/ui/Icons';
import { SearchableDropdown } from '@/components/common/SearchableDropdown';
import { useAuthStore } from '@/store/authStore';
import { useBranchStore } from '@/store/branchStore';

const MIN_KM = 1;
const MAX_KM = 50;

function clampKm(v: number) { return Math.min(Math.max(Math.round(v), MIN_KM), MAX_KM); }
function getRangeLabel(r: number) {
  const low = Math.floor(r / 5) * 5;
  const high = low + 5;
  if (r <= MIN_KM) return `${MIN_KM}–${MIN_KM + 5} km`;
  if (r >= MAX_KM) return `${MAX_KM - 5}–${MAX_KM} km`;
  return `${low}–${high} km`;
}

const COUNTRIES = ['India', 'United States', 'United Kingdom', 'Canada', 'Australia', 'Germany', 'France', 'UAE', 'Singapore', 'Nepal', 'Bangladesh', 'Sri Lanka'];
const ALL_STATES = ['Andhra Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Delhi', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'];
const ALL_DISTRICTS = ['Agra', 'Aligarh', 'Allahabad', 'Ambedkar Nagar', 'Amethi', 'Amroha', 'Aurangabad', 'Azamgarh', 'Baghpat', 'Bahraich', 'Ballia', 'Balrampur', 'Banda', 'Barabanki', 'Bareilly', 'Basti', 'Bijnor', 'Budaun', 'Bulandshahr', 'Chandauli', 'Chitrakoot', 'Deoria', 'Etah', 'Etawah', 'Faizabad', 'Farrukhabad', 'Fatehpur', 'Firozabad', 'Gautam Buddha Nagar', 'Ghaziabad', 'Ghazipur', 'Gonda', 'Gorakhpur', 'Hamirpur', 'Hapur', 'Hardoi', 'Hathras', 'Jalaun', 'Jaunpur', 'Jhansi', 'Kannauj', 'Kanpur Dehat', 'Kanpur Nagar', 'Kasganj', 'Kaushambi', 'Kushinagar', 'Lakhimpur Kheri', 'Lalitpur', 'Lucknow', 'Maharajganj', 'Mahoba', 'Mainpuri', 'Mathura', 'Mau', 'Meerut', 'Mirzapur', 'Moradabad', 'Muzaffarnagar', 'Pilibhit', 'Pratapgarh', 'Raebareli', 'Rampur', 'Saharanpur', 'Sambhal', 'Sant Kabir Nagar', 'Shahjahanpur', 'Shamli', 'Shravasti', 'Siddharthnagar', 'Sitapur', 'Sonbhadra', 'Sultanpur', 'Unnao', 'Varanasi', 'Ahmednagar', 'Akola', 'Amravati', 'Beed', 'Bhandara', 'Buldhana', 'Chandrapur', 'Dhule', 'Gadchiroli', 'Gondia', 'Hingoli', 'Jalgaon', 'Jalna', 'Kolhapur', 'Latur', 'Mumbai City', 'Mumbai Suburban', 'Nagpur', 'Nanded', 'Nandurbar', 'Nashik', 'Osmanabad', 'Palghar', 'Parbhani', 'Pune', 'Raigad', 'Ratnagiri', 'Sangli', 'Satara', 'Sindhudurg', 'Solapur', 'Thane', 'Wardha', 'Washim', 'Yavatmal', 'Ahmedabad', 'Amreli', 'Anand', 'Aravalli', 'Banaskantha', 'Bharuch', 'Bhavnagar', 'Botad', 'Chhota Udaipur', 'Dahod', 'Dang', 'Gandhinagar', 'Gir Somnath', 'Jamnagar', 'Junagadh', 'Kutch', 'Kheda', 'Mahisagar', 'Mehsana', 'Morbi', 'Narmada', 'Navsari', 'Panchmahal', 'Patan', 'Porbandar', 'Rajkot', 'Sabarkantha', 'Surat', 'Surendranagar', 'Tapi', 'Vadodara', 'Valsad', 'Ajmer', 'Alwar', 'Banswara', 'Baran', 'Barmer', 'Bharatpur', 'Bhilwara', 'Bikaner', 'Bundi', 'Chittorgarh', 'Churu', 'Dausa', 'Dholpur', 'Dungarpur', 'Hanumangarh', 'Jaipur', 'Jaisalmer', 'Jalore', 'Jhalawar', 'Jhunjhunu', 'Jodhpur', 'Karauli', 'Kota', 'Nagaur', 'Pali', 'Rajsamand', 'Sawai Madhopur', 'Sikar', 'Sirohi', 'Sri Ganganagar', 'Tonk', 'Udaipur', 'Bagalkot', 'Ballari', 'Belagavi', 'Bengaluru Rural', 'Bengaluru Urban', 'Bidar', 'Chamarajanagar', 'Chikballapur', 'Chikkamagaluru', 'Chitradurga', 'Dakshina Kannada', 'Davangere', 'Dharwad', 'Gadag', 'Hassan', 'Haveri', 'Kalaburagi', 'Kodagu', 'Kolar', 'Koppal', 'Mandya', 'Mysuru', 'Raichur', 'Ramanagara', 'Shivamogga', 'Tumakuru', 'Udupi', 'Uttara Kannada', 'Vijayapura', 'Yadgir', 'Ariyalur', 'Chengalpattu', 'Chennai', 'Coimbatore', 'Cuddalore', 'Dharmapuri', 'Dindigul', 'Erode', 'Kallakurichi', 'Kanchipuram', 'Kanyakumari', 'Karur', 'Krishnagiri', 'Madurai', 'Mayiladuthurai', 'Nagapattinam', 'Namakkal', 'Nilgiris', 'Perambalur', 'Pudukkottai', 'Ramanathapuram', 'Ranipet', 'Salem', 'Sivaganga', 'Tenkasi', 'Thanjavur', 'Theni', 'Thoothukudi', 'Tiruchirappalli', 'Tirunelveli', 'Tirupathur', 'Tiruppur', 'Tiruvallur', 'Tiruvannamalai', 'Tiruvarur', 'Vellore', 'Viluppuram', 'Virudhunagar', 'Central Delhi', 'East Delhi', 'New Delhi', 'North Delhi', 'North East Delhi', 'North West Delhi', 'Shahdara', 'South Delhi', 'South East Delhi', 'South West Delhi', 'West Delhi'];
const ALL_CITIES = ['Lucknow', 'Agra', 'Varanasi', 'Kanpur', 'Allahabad', 'Meerut', 'Bareilly', 'Gorakhpur', 'Ghaziabad', 'Mathura', 'Noida', 'Firozabad', 'Moradabad', 'Saharanpur', 'Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Aurangabad', 'Solapur', 'Kolhapur', 'Thane', 'Navi Mumbai', 'Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar', 'Jamnagar', 'Gandhinagar', 'Jaipur', 'Jodhpur', 'Kota', 'Bikaner', 'Ajmer', 'Udaipur', 'Bengaluru', 'Mysuru', 'Hubli', 'Dharwad', 'Mangaluru', 'Belagavi', 'Davangere', 'Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Tirunelveli', 'Erode', 'Vellore', 'Delhi', 'New Delhi', 'Dwarka', 'Rohini', 'Pitampura', 'Lajpat Nagar', 'Saket', 'Connaught Place', 'Hyderabad', 'Secunderabad', 'Warangal', 'Nizamabad', 'Karimnagar', 'Khammam', 'Kolkata', 'Howrah', 'Durgapur', 'Asansol', 'Siliguri', 'Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur', 'Bhopal', 'Indore', 'Gwalior', 'Jabalpur', 'Ujjain', 'Raipur', 'Bilaspur', 'Durg', 'Bhilai', 'Chandigarh', 'Mohali', 'Panchkula', 'Amritsar', 'Ludhiana', 'Jalandhar', 'Faridabad', 'Gurugram', 'Ambala', 'Rohtak', 'Panipat', 'Dehradun', 'Haridwar', 'Rishikesh', 'Haldwani', 'Roorkee', 'Ranchi', 'Jamshedpur', 'Dhanbad', 'Bokaro', 'Bhubaneswar', 'Cuttack', 'Rourkela', 'Berhampur', 'Guwahati', 'Dibrugarh', 'Silchar', 'Thiruvananthapuram', 'Kochi', 'Kozhikode', 'Thrissur', 'Kollam', 'Visakhapatnam', 'Vijayawada', 'Guntur', 'Nellore', 'Kurnool'];

interface DefineOperationalAreaModalProps {
  visible: boolean;
  onClose: () => void;
  mode: 'create' | 'update';
  initialData?: any;
  onSubmit: (data: any) => void;
  hideBranch?: boolean;
}

export const DefineOperationalAreaModal: React.FC<DefineOperationalAreaModalProps> = ({ visible, onClose, mode, initialData, onSubmit, hideBranch = false }) => {
  const [branch, setBranch] = useState(initialData?.branchName || initialData?.branch || '');
  const [radius, setRadius] = useState(initialData?.radius || 15);
  const [country, setCountry] = useState(initialData?.country || '');
  const [state, setState] = useState(initialData?.state || '');
  const [city, setCity] = useState(initialData?.city || '');
  const [district, setDistrict] = useState(initialData?.district || '');
  const [placeName, setPlaceName] = useState(initialData?.placeName || '');
  const [locationType, setLocationType] = useState<'Urban' | 'Rural'>(initialData?.locationType || 'Urban');
  const [isActive, setIsActive] = useState<boolean>(initialData ? initialData.status === 'Active' : true);
  const [locating, setLocating] = useState(false);

  const role = useAuthStore(state => state.role);
  const providerLabel = role === 'BSP' || role === 'BS' ? 'Branch Name' : 'Service Provider Name';
  const branches = useBranchStore(state => state.branches);
  const branchOptions = branches.map(b => b.name);

  const trackWidth = useRef(0);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (e) => {
        const val = clampKm((e.nativeEvent.locationX / (trackWidth.current || 1)) * (MAX_KM - MIN_KM) + MIN_KM);
        setRadius(val);
      },
      onPanResponderMove: (e) => {
        const val = clampKm((e.nativeEvent.locationX / (trackWidth.current || 1)) * (MAX_KM - MIN_KM) + MIN_KM);
        setRadius(val);
      },
    })
  ).current;

  useEffect(() => {
    if (visible) {
      setBranch(initialData?.branchName || initialData?.branch || '');
      setRadius(initialData?.radius || 15);
      setCountry(initialData?.country || '');
      setState(initialData?.state || '');
      setCity(initialData?.city || '');
      setDistrict(initialData?.district || '');
      setPlaceName(initialData?.placeName || '');
      setLocationType(initialData?.locationType || 'Urban');
      setIsActive(initialData ? initialData.status === 'Active' : true);
    }
  }, [visible, initialData]);

  const handleUseCurrentLocation = async () => {
    try {
      setLocating(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required to use current location.');
        setLocating(false);
        return;
      }
      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      const [result] = await Location.reverseGeocodeAsync({ latitude: loc.coords.latitude, longitude: loc.coords.longitude });
      if (result) {
        setCountry(result.country || '');
        setState(result.region || '');
        setDistrict(result.subregion || '');
        setCity(result.city || result.district || '');
        setPlaceName(result.name || result.street || '');
      }
    } catch {
      Alert.alert('Error', 'Could not fetch your location. Please try again.');
    } finally {
      setLocating(false);
    }
  };

  const handleSubmit = () => {
    if (!hideBranch && !branch.trim()) {
      import('react-native').then(({ Alert }) => { Alert.alert('Validation Error', 'Please select or enter a branch name.'); });
      return;
    }
    if (!country.trim() || !state.trim()) {
      import('react-native').then(({ Alert }) => { Alert.alert('Validation Error', 'Country and State are required.'); });
      return;
    }
    if (locationType === 'Urban' && !city.trim()) {
      import('react-native').then(({ Alert }) => { Alert.alert('Validation Error', 'City is required for Urban areas.'); });
      return;
    }
    if (locationType === 'Rural' && !district.trim()) {
      import('react-native').then(({ Alert }) => { Alert.alert('Validation Error', 'District is required for Rural areas.'); });
      return;
    }

    onSubmit({ branch, radius, country, state, city, district, placeName, locationType, isActive });
    onClose();
  };

  const fillPct = `${((radius - MIN_KM) / (MAX_KM - MIN_KM)) * 100}%`;

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled" nestedScrollEnabled>

            <View style={styles.header}>
              <View style={styles.headerTopRow}>
                <Text style={styles.title}>Define Service Area</Text>
                <TouchableOpacity activeOpacity={1} onPress={onClose} style={styles.closeBtn}>
                  <CloseIcon size={16} color="#64748B" />
                </TouchableOpacity>
              </View>
              <Text style={styles.subtitle}>Set the locations and radius where you provide services.</Text>
            </View>

            {!hideBranch && (
              <View style={[styles.section, { zIndex: 40 }]}>
                {(role === 'BSP' || role === 'BS') ? (
                  <SearchableDropdown
                    label={providerLabel}
                    placeholder={`Select or type ${providerLabel.toLowerCase()}`}
                    value={branch}
                    options={branchOptions}
                    onChange={setBranch}
                  />
                ) : (
                  <>
                    <Text style={styles.label}>{providerLabel}</Text>
                    <TextInput style={styles.inputBox} value={branch} onChangeText={setBranch} placeholder={`Enter ${providerLabel.toLowerCase()}`} placeholderTextColor="#94A3B8" />
                  </>
                )}
              </View>
            )}

            {/* Radius slider */}
            <View style={styles.section}>
              <View style={styles.radiusHeader}>
                <Text style={styles.label}>Service Distance</Text>
                <View style={styles.radiusBadge}>
                  <Text style={styles.radiusValue}>{getRangeLabel(radius)}</Text>
                </View>
              </View>
              <View
                style={styles.sliderTrack}
                onLayout={e => { trackWidth.current = e.nativeEvent.layout.width; }}
                {...panResponder.panHandlers}
              >
                <View style={[styles.sliderFill, { width: fillPct as any }]} />
                <View style={[styles.sliderThumb, { left: fillPct as any }]} />
              </View>
              <View style={styles.sliderLabels}>
                <Text style={styles.sliderLabelText}>{MIN_KM} km</Text>
                <Text style={styles.sliderLabelText}>{MAX_KM} km</Text>
              </View>
            </View>

            {/* Country & State */}
            <View style={[styles.rowSection, { zIndex: 30 }]}>
              <SearchableDropdown
                label="Country"
                placeholder="Type"
                value={country}
                options={COUNTRIES}
                onChange={(v) => { setCountry(v); setState(''); setDistrict(''); setCity(''); }}
              />
              <SearchableDropdown
                label="State"
                placeholder="Type"
                value={state}
                options={ALL_STATES}
                onChange={(v) => { setState(v); setDistrict(''); setCity(''); }}
              />
            </View>

            {/* Location Type */}
            <View style={styles.section}>
              <Text style={styles.label}>Location Type</Text>
              <View style={styles.segmentedControl}>
                <TouchableOpacity activeOpacity={1} style={[styles.segment, locationType === 'Urban' && styles.segmentActive]} onPress={() => setLocationType('Urban')}>
                  <Text style={[styles.segmentText, locationType === 'Urban' && styles.segmentTextActive]}>Urban</Text>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={1} style={[styles.segment, locationType === 'Rural' && styles.segmentActive]} onPress={() => setLocationType('Rural')}>
                  <Text style={[styles.segmentText, locationType === 'Rural' && styles.segmentTextActive]}>Rural</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* City & District */}
            <View style={[styles.rowSection, { zIndex: 20 }]}>
              <SearchableDropdown
                label="City"
                placeholder="Type"
                value={city}
                options={ALL_CITIES}
                onChange={setCity}
                disabled={locationType === 'Rural'}
              />
              <SearchableDropdown
                label="District"
                placeholder="Type"
                value={district}
                options={ALL_DISTRICTS}
                onChange={setDistrict}
                disabled={locationType === 'Urban'}
              />
            </View>

            {/* Search & Use location */}
            <View style={[styles.section, { zIndex: 10 }]}>
              <View style={styles.searchBox}>
                <SearchIcon size={20} color="#64748B" />
                <TextInput
                  style={styles.searchInput}
                  value={placeName}
                  onChangeText={setPlaceName}
                  placeholder="Search for your location/society/ap..."
                  placeholderTextColor="#94A3B8"
                />
              </View>
              <TouchableOpacity activeOpacity={1} style={styles.currentLocationBtn} onPress={handleUseCurrentLocation} disabled={locating}>
                {locating ? (
                  <ActivityIndicator size={16} color="rgba(26, 15, 163, 1.00)" />
                ) : (
                  <LocationPinIcon size={18} color="rgba(26, 15, 163, 1.00)" />
                )}
                <Text style={styles.currentLocationText}>{locating ? 'Fetching location...' : 'Use current location'}</Text>
              </TouchableOpacity>
            </View>

            {mode === 'update' && (
              <View style={styles.statusSection}>
                <View style={styles.statusTextContainer}>
                  <Text style={styles.statusTitle}>Area Status</Text>
                  <Text style={styles.statusSubtitle}>Toggle to active / inactive</Text>
                </View>
                <Switch value={isActive} onValueChange={setIsActive} />
              </View>
            )}

          </ScrollView>

          <View style={styles.footer}>
            <Button
              title={mode === 'update' ? 'Update Service Area' : 'Save Service Area'}
              onPress={handleSubmit}
              variant="primary"
              style={{ backgroundColor: 'rgba(26, 15, 163, 1.00)' }}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end', alignItems: 'center' },
  modalContent: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: '95%', width: '100%', maxWidth: 480, alignSelf: 'center' },
  scrollContent: { padding: 24, paddingBottom: 40 },
  header: { marginBottom: 24 },
  headerTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  title: { fontSize: 18, fontWeight: '700', color: '#0F172A' },
  closeBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center' },
  subtitle: { fontSize: 13, color: '#64748B', lineHeight: 20 },

  section: { marginBottom: 20 },
  rowSection: { flexDirection: 'row', gap: 12, marginBottom: 4 },

  label: { fontSize: 12, fontWeight: '600', color: '#0F172A', marginBottom: 8 },
  inputBox: { borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8, paddingHorizontal: 12, height: 44, backgroundColor: '#FFFFFF', fontSize: 13, color: '#0F172A' },

  radiusHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  radiusBadge: { backgroundColor: '#EEF2FF', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 8 },
  radiusValue: { fontSize: 12, fontWeight: '700', color: 'rgba(26, 15, 163, 1.00)' },

  sliderTrack: { height: 6, backgroundColor: '#E2E8F0', borderRadius: 3, marginBottom: 16, marginTop: 8, overflow: 'visible' },
  sliderFill: { height: '100%', backgroundColor: 'rgba(26, 15, 163, 1.00)', borderRadius: 3 },
  sliderThumb: { position: 'absolute', top: -7, width: 20, height: 20, borderRadius: 10, backgroundColor: 'rgba(26, 15, 163, 1.00)', marginLeft: -10, elevation: 3, borderWidth: 2, borderColor: '#FFFFFF' },
  sliderLabels: { flexDirection: 'row', justifyContent: 'space-between' },
  sliderLabelText: { fontSize: 10, color: '#94A3B8' },

  segmentedControl: { flexDirection: 'row', borderRadius: 10, gap: 8 },
  segment: { flex: 1, paddingVertical: 11, alignItems: 'center', borderRadius: 8, backgroundColor: '#FFFFFF', borderWidth: 1.5, borderColor: '#CBD5E1' },
  segmentActive: { backgroundColor: 'rgba(26, 15, 163, 1.00)', borderColor: 'rgba(26, 15, 163, 1.00)', elevation: 2 },
  segmentText: { fontSize: 13, color: '#475569', fontWeight: '600' },
  segmentTextActive: { color: '#FFFFFF', fontWeight: '700' },

  searchBox: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8, paddingHorizontal: 12, height: 44, backgroundColor: '#FFFFFF', marginBottom: 16 },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 13, color: '#0F172A' },

  currentLocationBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  currentLocationText: { fontSize: 13, fontWeight: '600', color: 'rgba(26, 15, 163, 1.00)' },

  statusSection: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderWidth: 1, borderColor: '#F1F5F9', borderRadius: 12, marginBottom: 24, marginTop: 8 },
  statusTextContainer: { flex: 1 },
  statusTitle: { fontSize: 14, fontWeight: '600', color: '#0F172A', marginBottom: 2 },
  statusSubtitle: { fontSize: 12, color: '#94A3B8' },

  footer: { padding: 24, paddingTop: 16, borderTopWidth: 1, borderTopColor: '#F1F5F9', backgroundColor: '#FFFFFF' },
});
