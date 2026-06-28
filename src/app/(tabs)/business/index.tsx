import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Platform,
  TouchableOpacity,
  KeyboardAvoidingView,
} from "react-native";
import { StorageService } from "@/services/storage.service";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSafeRouter } from "@/hooks/useSafeRouter";
import { GradientBackground } from "@/components/ui/GradientBackground";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { SelectInput } from "@/components/ui/SelectInput";
import { PhoneInput } from "@/components/ui/PhoneInput";
import { Button } from "@/components/ui/Button";
import {
  BackArrowIcon,
  BuildingIcon,
  PhoneIcon,
  ShieldCheckIcon,
} from "@/components/ui/Icons";
import { InfoAlert } from "@/components/ui/InfoAlert";
import { useLocalSearchParams } from "expo-router";
import { useAndroidBack } from "@/hooks/useAndroidBack";
import { SelectOptionsModal } from "@/components/common/SelectOptionsModal";
import { RoleAccessGuard } from "@/components/common/RoleAccessGuard";

const BUSINESS_TYPES = [
  { label: "Sole Proprietorship", value: "Sole Proprietorship" },
  { label: "Partnership", value: "Partnership" },
  {
    label: "Limited Liability Company (LLC)",
    value: "Limited Liability Company (LLC)",
  },
  { label: "Corporation", value: "Corporation" },
];

function SectionHeader({
  icon,
  title,
}: {
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <View style={styles.sectionHeader}>
      <View style={styles.sectionIconWrapper}>{icon}</View>
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );
}

export default function BusinessSetupScreen() {
  const router = useSafeRouter();
  const { readonly, error } = useLocalSearchParams<{
    readonly?: string;
    error?: string;
  }>();
  const isReadonly = readonly === "true";

  const handleBack = async () => {
    try {
      const s = await StorageService.getUserSession();
      const role = s?.role || 'ISP';
      const { getPreviousStepRoute } = require('@/utils/onboarding');
      const prevRoute = await getPreviousStepRoute('businessProfile', role as any);
      
      // Temporary debug alert
      // Alert.alert('Routing to', prevRoute);
      
      router.push(prevRoute as any);
    } catch (e) {
      console.error('Error in handleBack:', e);
      router.push('/(tabs)/kyc');
    }
  };

  useAndroidBack(() => {
    handleBack();
    return true;
  });

  const [form, setForm] = useState({
    businessName: "",
    businessType: "",
    establishedYear: "",
    employees: "",
    email: "",
    phone: "",
    website: "",
    gst: "",
    pan: "",
    registration: "",
  });

  const [typeModalVisible, setTypeModalVisible] = useState(false);

  const updateForm = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };


  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!form.businessName.trim()) newErrors.businessName = "Required";
    else if (!/^[A-Za-z\s]+$/.test(form.businessName)) newErrors.businessName = "Only alphabets allowed";
    
    if (!form.businessType.trim()) newErrors.businessType = "Required";
    
    if (!form.establishedYear.trim()) {
      newErrors.establishedYear = "Required";
    } else {
      const yearVal = parseInt(form.establishedYear.trim(), 10);
      if (!/^\d{4}$/.test(form.establishedYear.trim()) || yearVal > 2026) {
        newErrors.establishedYear = "Must be a valid year up to 2026";
      }
    }
    
    if (!form.employees.trim()) newErrors.employees = "Required";
    else if (!/^\d+$/.test(form.employees.trim())) newErrors.employees = "Numeric only";
    
    if (!form.email.trim()) newErrors.email = "Required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = "Invalid format";
    
    if (!form.phone.trim()) newErrors.phone = "Required";
    // Phone length validation happens inside PhoneInput, but we can ensure it's not empty

    if (form.website.trim() && !/^https?:\/\/.*/.test(form.website)) {
      newErrors.website = "Invalid URL (must start with http:// or https://)";
    }
    
    const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    if (!form.gst.trim()) newErrors.gst = "Required";
    else if (!gstRegex.test(form.gst)) newErrors.gst = "Invalid GST format";
    
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    if (!form.pan.trim()) newErrors.pan = "Required";
    else if (!panRegex.test(form.pan)) newErrors.pan = "Invalid PAN format";
    
    if (!form.registration.trim()) newErrors.registration = "Required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (isReadonly) {
      router.back();
      return;
    }
    if (!validateForm()) return;
    const { completeStepAndNavigate } = require('@/utils/onboarding');
    await completeStepAndNavigate('businessProfile', router, 'completed');
  };

  return (
    <RoleAccessGuard allowedRoles={["BSP", "BS"]}>
      <GradientBackground style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.header}>
            <TouchableOpacity activeOpacity={1} onPress={() => handleBack()} style={styles.backButton}>
              <BackArrowIcon size={24} color="#0F172A" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Business Profile</Text>
          </View>

          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
          >
            <ScrollView
               showsVerticalScrollIndicator={false}
               contentContainerStyle={[styles.scrollContent, { paddingBottom: 350 }]}
               keyboardShouldPersistTaps="handled"
            >
              <Card style={styles.card} variant="default">
                <Text style={styles.pageTitle}>Business Details</Text>
                <Text style={styles.pageDesc}>
                  Enter your company details for verification. This information
                  will be linked to your branches and services.
                </Text>

                {error === "true" && (
                  <View style={{ marginBottom: 16 }}>
                    <InfoAlert message="Your business details were rejected. Please review and update them." />
                  </View>
                )}

                {/* Basic Information */}
                <SectionHeader
                  icon={<BuildingIcon size={18} color="rgba(26, 15, 163, 1.00)" />}
                  title="Basic Information"
                />

                <Input
                  label="Business Name *"
                  placeholder="e.g. Acme Services"
                  value={form.businessName}
                  onChangeText={(t) => {
                    const sanitized = t.replace(/[^A-Za-z\s]/g, '');
                    updateForm("businessName", sanitized);
                    if(errors.businessName) setErrors(prev => ({...prev, businessName: ''}));
                  }}
                  editable={!isReadonly}
                  error={errors.businessName}
                />

                <SelectInput
                  label="Business Type *"
                  placeholder="Select"
                  value={form.businessType}
                  onPress={() => setTypeModalVisible(true)}
                  disabled={isReadonly}
                  error={errors.businessType}
                />

                <View style={styles.row}>
                  <View style={styles.flex1}>
                    <Input
                      label="Established Year *"
                      placeholder="YYYY"
                      keyboardType="numeric"
                      value={form.establishedYear}
                      onChangeText={(t) => {
                        const sanitized = t.replace(/[^0-9]/g, '').slice(0, 4);
                        updateForm("establishedYear", sanitized);
                        if(errors.establishedYear) setErrors(prev => ({...prev, establishedYear: ''}));
                      }}
                      editable={!isReadonly}
                      error={errors.establishedYear}
                    />
                  </View>
                  <View style={styles.flex1}>
                    <Input
                      label="No. of Employees *"
                      placeholder="Enter"
                      keyboardType="numeric"
                      value={form.employees}
                      onChangeText={(t) => {
                        const sanitized = t.replace(/[^0-9]/g, '');
                        updateForm("employees", sanitized);
                        if(errors.employees) setErrors(prev => ({...prev, employees: ''}));
                      }}
                      editable={!isReadonly}
                      error={errors.employees}
                    />
                  </View>
                </View>

                {/* Contact Information */}
                <SectionHeader
                  icon={<PhoneIcon size={18} color="rgba(26, 15, 163, 1.00)" />}
                  title="Contact Information"
                />

                <Input
                  label="Business Email *"
                  placeholder="contact@company.com"
                  keyboardType="email-address"
                  value={form.email}
                  onChangeText={(t) => { updateForm("email", t); if(errors.email) setErrors(prev => ({...prev, email: ''})) }}
                  editable={!isReadonly}
                  error={errors.email}
                />

                <PhoneInput
                  label="Business Phone *"
                  placeholder="98765 43210"
                  value={form.phone}
                  onChangeText={(t) => { updateForm("phone", t); if(errors.phone) setErrors(prev => ({...prev, phone: ''})) }}
                  error={errors.phone}
                />

                <Input
                  label="Website URL (Optional)"
                  placeholder="https://www.company.com"
                  keyboardType="url"
                  value={form.website}
                  onChangeText={(t) => { updateForm("website", t); if(errors.website) setErrors(prev => ({...prev, website: ''})) }}
                  editable={!isReadonly}
                  error={errors.website}
                />

                {/* Legal & Verification */}
                <SectionHeader
                  icon={<ShieldCheckIcon size={18} color="rgba(26, 15, 163, 1.00)" />}
                  title="Legal & Verification"
                />
                <Text style={styles.legalDesc}>
                  These details will be securely stored for the approval process.
                </Text>

                <Input
                  label="GST Number *"
                  placeholder="Enter GSTIN"
                  value={form.gst}
                  onChangeText={(t) => {
                    const cleaned = t.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 15);
                    updateForm("gst", cleaned);
                    if(errors.gst) setErrors(prev => ({...prev, gst: ''}));
                  }}
                  autoCapitalize="characters"
                  maxLength={15}
                  editable={!isReadonly}
                  error={errors.gst}
                />

                <Input
                  label="PAN Number *"
                  placeholder="Enter PAN"
                  value={form.pan}
                  onChangeText={(t) => {
                    const cleaned = t.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 10);
                    updateForm("pan", cleaned);
                    if(errors.pan) setErrors(prev => ({...prev, pan: ''}));
                  }}
                  autoCapitalize="characters"
                  maxLength={10}
                  editable={!isReadonly}
                  error={errors.pan}
                />

                <Input
                  label="Registration Number *"
                  placeholder="Enter CIN / Registration No."
                  value={form.registration}
                  onChangeText={(t) => { updateForm("registration", t); if(errors.registration) setErrors(prev => ({...prev, registration: ''})) }}
                  editable={!isReadonly}
                  error={errors.registration}
                />

                {!isReadonly && (
                  <Button
                    title="Create Business Profile"
                    onPress={handleSubmit}
                    variant="primary"
                    style={styles.submitBtn}
                  />
                )}
              </Card>
            </ScrollView>
          </KeyboardAvoidingView>
          <SelectOptionsModal
            visible={typeModalVisible}
            onClose={() => setTypeModalVisible(false)}
            title="Select Business Type"
            options={BUSINESS_TYPES}
            onSelect={(value) => updateForm("businessType", value)}
          />
        </SafeAreaView>
      </GradientBackground>
    </RoleAccessGuard>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    backgroundColor: "transparent",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  card: {
    padding: 24,
    borderRadius: 24,
    backgroundColor: "#FFFFFF",
    marginTop: 8,
  },
  pageTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 8,
  },
  pageDesc: {
    fontSize: 13,
    color: "#64748B",
    lineHeight: 18,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    marginTop: 8,
  },
  sectionIconWrapper: {
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0F172A",
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  flex1: {
    flex: 1,
  },
  legalDesc: {
    fontSize: 12,
    color: "#94A3B8",
    marginBottom: 16,
    marginTop: -8,
  },
  submitBtn: {
    marginTop: 16,
  },
});
