import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Platform,
  TouchableOpacity,
  KeyboardAvoidingView,
  Alert,
  Modal,
} from "react-native";
import Svg, { Path, Circle } from "react-native-svg";

const SuccessIcon = () => (
  <Svg width={56} height={56} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" fill="#DCFCE7" />
    <Path d="M8 12l3 3 5-5" stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);
import * as ImagePicker from "expo-image-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSafeRouter } from "@/hooks/useSafeRouter";
import { useLocalSearchParams } from "expo-router";
import { GradientBackground } from "@/components/ui/GradientBackground";
import { Input } from "@/components/ui/Input";
import { SelectInput } from "@/components/ui/SelectInput";
import { Button } from "@/components/ui/Button";
import { ImageUploadCard } from "@/components/ui/ImageUploadCard";
import {
  BuildingIcon,
  ClockCircleIcon,
  BackArrowIcon,
} from "@/components/ui/Icons";
import { useDocStore } from "@/store/docStore";
import { useAndroidBack } from "@/hooks/useAndroidBack";
import { StorageService } from "@/services/storage.service";
import { SelectOptionsModal } from "@/components/common/SelectOptionsModal";
import { RoleAccessGuard } from "@/components/common/RoleAccessGuard";
import { completeStepAndNavigate } from '@/utils/onboarding';


const BIZ_DOCUMENT_TYPES = [
  { label: "Business License", value: "Business License" },
  {
    label: "GST Registration Certificate",
    value: "GST Registration Certificate",
  },
  {
    label: "Certificate of Incorporation",
    value: "Certificate of Incorporation",
  },
  { label: "Partnership Deed", value: "Partnership Deed" },
  { label: "PAN Card", value: "PAN Card" },
  { label: "Other Documents", value: "Other Documents" },
];

export default function BusinessVerificationUpload() {
  const router = useSafeRouter();
  const params = useLocalSearchParams<{ docType?: string }>();
  const { updateDocStatus, updateDocUri, updateDocBackUri, updateDocNumber } = useDocStore();
  const [isApproved, setIsApproved] = useState(false);

  useEffect(() => {
    const checkApproval = async () => {
      const session = await StorageService.getUserSession();
      if (session?.isApproved) {
        setIsApproved(true);
      }
    };
    checkApproval();
  }, []);

  useAndroidBack(() => {
    if (isApproved) {
      router.back();
    } else {
      router.replace("/(tabs)");
    }
  });


  const [docType, setDocType] = useState(params.docType || "Business License");
  const [docNumber, setDocNumber] = useState("");
  const [docModalVisible, setDocModalVisible] = useState(false);
  const [uploadedFront, setUploadedFront] = useState<string | null>(null);
  const [uploadedBack, setUploadedBack] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleDocumentImagePick = async (side: "front" | "back") => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "Please allow gallery access to upload document.",
      );
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.8,
    });
    if (!result.canceled) {
      if (side === "front") setUploadedFront(result.assets[0].uri);
      else setUploadedBack(result.assets[0].uri);
    }
  };

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async () => {
    const newErrors: Record<string, string> = {};
    
    if (docType === "GST Registration Certificate") {
      const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
      if (!docNumber.trim()) {
        newErrors.docNumber = "GST Number is required";
      } else if (!gstRegex.test(docNumber.trim())) {
        newErrors.docNumber = "Invalid GST format";
      }
    } else if (docType === "PAN Card") {
      const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
      if (!docNumber.trim()) {
        newErrors.docNumber = "PAN Number is required";
      } else if (!panRegex.test(docNumber.trim())) {
        newErrors.docNumber = "Invalid PAN format";
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (!uploadedFront) {
      Alert.alert("Error", "Front image is required");
      return;
    }

    const isOther = docType === "Other Documents";
    const docKey = isOther 
                   ? "otherDocs" 
                   : (docType === "PAN Card" ? "businessPan" : "businessVerification");
    
    updateDocStatus(docKey, "Pending");
    if (uploadedFront) updateDocUri(docKey, uploadedFront);
    if (uploadedBack) updateDocBackUri(docKey, uploadedBack);
    if (docNumber) updateDocNumber(docKey, docNumber);
    
    setShowSuccess(true);
  };

  const handleSuccessDone = async () => {
    setShowSuccess(false);
    router.replace("/(auth)/business-profile" as any);
  };

  return (
    <RoleAccessGuard allowedRoles={["BSP", "BS"]}>
      <GradientBackground style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
          >
            <View style={styles.header}>
              <TouchableOpacity activeOpacity={1}
                onPress={() => {
                  if (isApproved) {
                    router.back();
                  } else {
                    router.replace("/(tabs)");
                  }
                }}
                style={styles.backButton}
              >
                <BackArrowIcon size={24} color="#0F172A" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Business Documents</Text>
            </View>

            <View style={styles.card}>
              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
              >
                {/* Top Info Section */}
                <View style={styles.topSection}>
                  <View style={styles.iconWrapper}>
                    <BuildingIcon size={24} color="#0F172A" />
                  </View>
                  <Text style={styles.verifyTitle}>Business Verification</Text>
                  <Text style={styles.verifyDesc}>
                    Upload official business documents to verify your business
                    profile and unlock all features.
                  </Text>
                  <View style={styles.pendingPill}>
                    <ClockCircleIcon size={14} color="rgba(26, 15, 163, 1.00)" />
                    <Text style={styles.pendingPillText}>
                      Pending Verification
                    </Text>
                  </View>
                </View>

                {/* Business Details */}
                <Text style={styles.sectionTitle}>BUSINESS DETAILS</Text>

                <SelectInput
                  label="Document Type *"
                  placeholder="Select"
                  value={docType}
                  onPress={() => setDocModalVisible(true)}
                />

                <Input
                  label={`Document Number${docType === 'PAN Card' || docType === 'GST Registration Certificate' ? ' *' : ' (Optional)'}`}
                  placeholder="Enter Document Number"
                  value={docNumber}
                  onChangeText={(t) => {
                    let cleaned = t;
                    if (docType === 'PAN Card') {
                      cleaned = t.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 10);
                    } else if (docType === 'GST Registration Certificate') {
                      cleaned = t.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 15);
                    }
                    setDocNumber(cleaned);
                    if(errors.docNumber) setErrors(prev => ({...prev, docNumber: ''}))
                  }}
                  autoCapitalize={docType === 'PAN Card' || docType === 'GST Registration Certificate' ? 'characters' : undefined}
                  maxLength={docType === 'PAN Card' ? 10 : docType === 'GST Registration Certificate' ? 15 : undefined}
                  error={errors.docNumber}
                />

                {/* Document Images */}
                <Text style={[styles.sectionTitle, { marginTop: 8 }]}>
                  DOCUMENT IMAGES
                </Text>
                <Text style={styles.sectionDesc}>
                  Please provide clear images of your official business
                  documents.
                </Text>

                <Text style={styles.uploadLabel}>Front Image</Text>
                <ImageUploadCard
                  label="Tap to upload"
                  subLabel="PNG, JPG up to 5MB"
                  uploaded={!!uploadedFront}
                  uploadedUri={uploadedFront ?? undefined}
                  onPress={() => handleDocumentImagePick("front")}
                  style={styles.uploadCard}
                />

                <Text style={styles.uploadLabel}>Back Image</Text>
                <ImageUploadCard
                  label="Tap to upload"
                  subLabel="PNG, JPG up to 5MB"
                  uploaded={!!uploadedBack}
                  uploadedUri={uploadedBack ?? undefined}
                  onPress={() => handleDocumentImagePick("back")}
                  style={styles.uploadCard}
                />

                <Button
                  title={isApproved ? "Save Changes" : "Submit Documents"}
                  onPress={handleSubmit}
                  variant="primary"
                  style={styles.submitBtn}
                />
              </ScrollView>
            </View>
            <SelectOptionsModal
              visible={docModalVisible}
              onClose={() => setDocModalVisible(false)}
              title="Select Document Type"
              options={BIZ_DOCUMENT_TYPES}
              onSelect={(value) => setDocType(value)}
            />

            {/* Success Modal */}
            <Modal visible={showSuccess} transparent animationType="fade">
              <View style={styles.modalOverlay}>
                <View style={styles.modalCard}>
                  <SuccessIcon />
                  <Text style={styles.modalTitle}>Documents Submitted!</Text>
                  <Text style={styles.modalDesc}>
                    Your business documents have been submitted successfully. Our team will verify them shortly.
                  </Text>
                  <TouchableOpacity activeOpacity={1} style={styles.modalBtn} onPress={handleSuccessDone}>
                    <Text style={styles.modalBtnText}>Done</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>

          </KeyboardAvoidingView>
        </SafeAreaView>
      </GradientBackground>
    </RoleAccessGuard>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  backButton: { marginRight: 16 },
  headerTitle: { fontSize: 20, fontWeight: "700", color: "#0F172A" },
  card: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    marginHorizontal: 16,
    marginBottom: 16,
    overflow: "hidden",
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },
  topSection: {
    alignItems: "center",
    marginBottom: 32,
  },
  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#F1F5F9", // light slate
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  verifyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 8,
  },
  verifyDesc: {
    fontSize: 13,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 18,
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  pendingPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EEF2FF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  pendingPillText: {
    fontSize: 12,
    fontWeight: "600",
    color: "rgba(26, 15, 163, 1.00)",
    marginLeft: 6,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  sectionDesc: {
    fontSize: 12,
    color: "#64748B",
    marginBottom: 16,
    marginTop: -8,
  },
  uploadLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0F172A",
    marginBottom: 8,
  },
  uploadCard: {
    marginBottom: 20,
  },
  submitBtn: {
    marginTop: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 28,
    alignItems: 'center',
    width: '100%',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 16,
    marginBottom: 8,
  },
  modalDesc: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 24,
  },
  modalBtn: {
    backgroundColor: '#1A0FA3',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 48,
    alignItems: 'center',
  },
  modalBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
