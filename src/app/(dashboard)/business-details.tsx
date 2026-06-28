import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSafeRouter } from "@/hooks/useSafeRouter";
import { GradientBackground } from "@/components/ui/GradientBackground";
import { BackArrowIcon } from "@/components/ui/Icons";
import {
  BuildingIcon,
  PhoneIcon,
  ShieldCheckIcon,
} from "@/components/ui/Icons";

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

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value || "-"}</Text>
    </View>
  );
}

export default function BusinessDetailsScreen() {
  const router = useSafeRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <GradientBackground style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity activeOpacity={1} onPress={handleBack} style={styles.backButton}>
            <BackArrowIcon size={24} color="#0F172A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Business Details</Text>
        </View>

        <View style={styles.whitePopupWrapper}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            <View style={styles.contentPadding}>
              {/* Basic Information */}
              <SectionHeader
                icon={<BuildingIcon size={18} color="rgba(26, 15, 163, 1.00)" />}
                title="Basic Information"
              />
              <DetailRow label="Business Name" value="RIT Cloud Solutions pvt. ltd" />
              <DetailRow label="Business Type" value="Private Limited Company" />
              <View style={styles.row}>
                <View style={styles.flex1}><DetailRow label="Established Year" value="2018" /></View>
                <View style={styles.flex1}><DetailRow label="No. of Employees" value="50 - 100" /></View>
              </View>

              {/* Contact & Location */}
              <SectionHeader
                icon={<PhoneIcon size={18} color="rgba(26, 15, 163, 1.00)" />}
                title="Contact & Location"
              />
              <DetailRow label="Business Email" value="contact@ritcloud.com" />
              <DetailRow label="Business Phone" value="+91 9876543210" />
              <DetailRow label="Website URL" value="https://www.ritcloud.com" />
              <View style={styles.row}>
                <View style={styles.flex1}><DetailRow label="Location Type" value="Urban" /></View>
                <View style={styles.flex1}><DetailRow label="City" value="New Delhi" /></View>
              </View>
              <DetailRow label="Complete Address" value="123 Tech Park, Sector 4, Connaught Place, New Delhi, 110001" />

              {/* Legal & Verification */}
              <SectionHeader
                icon={<ShieldCheckIcon size={18} color="rgba(26, 15, 163, 1.00)" />}
                title="Legal & Verification"
              />
              <DetailRow label="GST Number" value="07AAAAA0000A1Z5" />
              <DetailRow label="PAN Number" value="ABCDE1234F" />
              <DetailRow label="Business Aadhar Number" value="1234 5678 9012" />
              <DetailRow label="Registration No. / CIN" value="U72900DL2018PTC123456" />

            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    </GradientBackground>
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
    paddingBottom: 40,
    paddingTop: 16,
  },
  whitePopupWrapper: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    marginTop: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    overflow: 'hidden',
  },
  contentPadding: {
    paddingHorizontal: 24,
  },
  detailRow: {
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  detailLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#64748B",
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  detailValue: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0F172A",
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
});
