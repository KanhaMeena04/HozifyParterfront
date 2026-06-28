import React from "react";
import { StyleSheet, View, Platform } from "react-native";
import Svg, {
  Circle,
  Defs,
  Ellipse,
  LinearGradient,
  RadialGradient,
  Rect,
  Stop,
} from "react-native-svg";

interface BackgroundSVGProps {
  variant?: "vibrant" | "minimal" | "splash";
}

// Each variant uses unique gradient IDs (sp_*, mn_*, vb_*) to prevent
// Android APK crashes caused by duplicate SVG gradient IDs across screens
// when using react-native-svg with New Architecture (newArchEnabled: true).

const BackgroundSVG: React.FC<BackgroundSVGProps> = ({
  variant = "minimal",
}) => {
  if (Platform.OS === "web") {
    let gradient = "";
    if (variant === "minimal") {
      gradient = "linear-gradient(90deg, #8EC5FC 0%, #8EC5FC 45%, #DEEB98 75%, #DEEB98 100%)";
    } else if (variant === "splash") {
      gradient = `
        radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.3) 21%, transparent 30%),
        radial-gradient(circle at 100% 100%, rgba(247, 96, 36, 0.8) 0%, rgba(247, 96, 36, 0.48) 35%, transparent 50%),
        radial-gradient(circle at 50% 80%, rgba(255, 220, 110, 0.8) 0%, rgba(255, 220, 110, 0.48) 49%, transparent 70%),
        radial-gradient(circle at 0% 100%, rgba(109, 196, 113, 0.8) 0%, rgba(109, 196, 113, 0.48) 63%, transparent 90%),
        radial-gradient(circle at 100% 0%, rgba(222, 235, 152, 0.9) 0%, rgba(222, 235, 152, 0.54) 42%, transparent 60%),
        radial-gradient(circle at 0% 0%, rgba(142, 197, 252, 0.9) 0%, rgba(142, 197, 252, 0.54) 42%, transparent 60%),
        linear-gradient(to bottom, #F5F7FA, #F5F7FA)
      `.replace(/\s+/g, ' ');
    } else {
      gradient = `
        radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.3) 21%, transparent 30%),
        radial-gradient(circle at 100% 100%, rgba(226, 238, 165, 0.8) 0%, rgba(226, 238, 165, 0.48) 35%, transparent 50%),
        radial-gradient(circle at 50% 80%, rgba(234, 245, 175, 0.8) 0%, rgba(234, 245, 175, 0.48) 49%, transparent 70%),
        radial-gradient(circle at 0% 100%, rgba(161, 223, 157, 0.8) 0%, rgba(161, 223, 157, 0.48) 63%, transparent 90%),
        radial-gradient(circle at 100% 0%, rgba(222, 235, 152, 0.9) 0%, rgba(222, 235, 152, 0.54) 42%, transparent 60%),
        radial-gradient(circle at 0% 0%, rgba(142, 197, 252, 0.9) 0%, rgba(142, 197, 252, 0.54) 42%, transparent 60%),
        linear-gradient(to bottom, #F3F7FA, #F3F7FA)
      `.replace(/\s+/g, ' ');
    }
    return (
      <View style={[styles.container, { backgroundImage: gradient, pointerEvents: 'none' } as any]} />
    );
  }

  if (variant === "splash") {
    return (
      <View style={[styles.container, { pointerEvents: 'none' }]} >
        <Svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
          <Defs>
            <RadialGradient id="sp_blue" cx="0.5" cy="0.5" r="0.5">
              <Stop offset="0" stopColor="#8EC5FC" stopOpacity="1" />
              <Stop offset="0.7" stopColor="#8EC5FC" stopOpacity="0.6" />
              <Stop offset="1" stopColor="#8EC5FC" stopOpacity="0" />
            </RadialGradient>
            <RadialGradient id="sp_green" cx="0.5" cy="0.5" r="0.5">
              <Stop offset="0" stopColor="#6DC471" stopOpacity="1" />
              <Stop offset="0.7" stopColor="#6DC471" stopOpacity="0.6" />
              <Stop offset="1" stopColor="#6DC471" stopOpacity="0" />
            </RadialGradient>
            <RadialGradient id="sp_yellow" cx="0.5" cy="0.5" r="0.5">
              <Stop offset="0" stopColor="#FFDC6E" stopOpacity="1" />
              <Stop offset="0.7" stopColor="#FFDC6E" stopOpacity="0.6" />
              <Stop offset="1" stopColor="#FFDC6E" stopOpacity="0" />
            </RadialGradient>
            <RadialGradient id="sp_lgreen" cx="0.5" cy="0.5" r="0.5">
              <Stop offset="0" stopColor="#DEEB98" stopOpacity="1" />
              <Stop offset="0.7" stopColor="#DEEB98" stopOpacity="0.6" />
              <Stop offset="1" stopColor="#DEEB98" stopOpacity="0" />
            </RadialGradient>
            <RadialGradient id="sp_orange" cx="0.5" cy="0.5" r="0.5">
              <Stop offset="0" stopColor="#F76024" stopOpacity="1" />
              <Stop offset="0.7" stopColor="#F76024" stopOpacity="0.6" />
              <Stop offset="1" stopColor="#F76024" stopOpacity="0" />
            </RadialGradient>
            <RadialGradient id="sp_white" cx="0.5" cy="0.5" r="0.5">
              <Stop offset="0" stopColor="#FFFFFF" stopOpacity="0.8" />
              <Stop offset="0.7" stopColor="#FFFFFF" stopOpacity="0.6" />
              <Stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
            </RadialGradient>
          </Defs>
          <Rect width="100%" height="100%" fill="#F5F7FA" />
          <Circle cx="0%" cy="0%" r="60%" fill="url(#sp_blue)" opacity="0.9" />
          <Circle cx="100%" cy="0%" r="60%" fill="url(#sp_lgreen)" opacity="0.9" />
          <Circle cx="0%" cy="100%" r="90%" fill="url(#sp_green)" opacity="0.8" />
          <Circle cx="50%" cy="80%" r="70%" fill="url(#sp_yellow)" opacity="0.8" />
          <Circle cx="100%" cy="100%" r="50%" fill="url(#sp_orange)" opacity="0.8" />
          <Circle cx="50%" cy="50%" r="30%" fill="url(#sp_white)" opacity="0.5" />
        </Svg>
      </View>
    );
  }

  if (variant === "minimal") {
    return (
      <View style={[styles.container, { pointerEvents: 'none' }]} >
        <Svg width="100%" height="100%">
          <Defs>
            <LinearGradient id="mn_base" x1="0" y1="0" x2="1" y2="0">
              <Stop offset="0" stopColor="#8EC5FC" stopOpacity="1" />
              <Stop offset="0.45" stopColor="#8EC5FC" stopOpacity="1" />
              <Stop offset="0.75" stopColor="#DEEB98" stopOpacity="1" />
              <Stop offset="1" stopColor="#DEEB98" stopOpacity="1" />
            </LinearGradient>
            <RadialGradient
              id="mn_green"
              cx="0.5"
              cy="0.5"
              r="0.5"
              fx="0.65"
              fy="0.5"
            >
              <Stop offset="0" stopColor="#DEEB98" stopOpacity="1" />
              <Stop offset="0.8" stopColor="#DEEB98" stopOpacity="0.6" />
              <Stop offset="1" stopColor="#DEEB98" stopOpacity="0" />
            </RadialGradient>
          </Defs>
          <Rect width="100%" height="100%" fill="url(#mn_base)" />
          <Ellipse cx="85%" cy="56%" rx="64%" ry="80%" fill="url(#mn_green)" />
        </Svg>
      </View>
    );
  }

  // vibrant variant
  return (
    <View style={[styles.container, { pointerEvents: 'none' }]} >
      <Svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
        <Defs>
          <RadialGradient id="vb_blue" cx="0.5" cy="0.5" r="0.5">
            <Stop offset="0" stopColor="#8EC5FC" stopOpacity="1" />
            <Stop offset="0.7" stopColor="#8EC5FC" stopOpacity="0.6" />
            <Stop offset="1" stopColor="#8EC5FC" stopOpacity="0" />
          </RadialGradient>
          <RadialGradient id="vb_green" cx="0.5" cy="0.5" r="0.5">
            <Stop offset="0" stopColor="#A1DF9D" stopOpacity="1" />
            <Stop offset="0.7" stopColor="#A1DF9D" stopOpacity="0.6" />
            <Stop offset="1" stopColor="#A1DF9D" stopOpacity="0" />
          </RadialGradient>
          <RadialGradient id="vb_yellow" cx="0.5" cy="0.5" r="0.5">
            <Stop offset="0" stopColor="#EAF5AF" stopOpacity="1" />
            <Stop offset="0.7" stopColor="#EAF5AF" stopOpacity="0.6" />
            <Stop offset="1" stopColor="#EAF5AF" stopOpacity="0" />
          </RadialGradient>
          <RadialGradient id="vb_lgreen" cx="0.5" cy="0.5" r="0.5">
            <Stop offset="0" stopColor="#DEEB98" stopOpacity="1" />
            <Stop offset="0.7" stopColor="#DEEB98" stopOpacity="0.6" />
            <Stop offset="1" stopColor="#DEEB98" stopOpacity="0" />
          </RadialGradient>
          <RadialGradient id="vb_orange" cx="0.5" cy="0.5" r="0.5">
            <Stop offset="0" stopColor="#E2EEA5" stopOpacity="1" />
            <Stop offset="0.7" stopColor="#E2EEA5" stopOpacity="0.6" />
            <Stop offset="1" stopColor="#E2EEA5" stopOpacity="0" />
          </RadialGradient>
          <RadialGradient id="vb_white" cx="0.5" cy="0.5" r="0.5">
            <Stop offset="0" stopColor="#FFFFFF" stopOpacity="0.8" />
            <Stop offset="0.7" stopColor="#FFFFFF" stopOpacity="0.6" />
            <Stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
          </RadialGradient>
        </Defs>
        <Rect width="100%" height="100%" fill="#F3F7FA" />
        <Circle cx="0%" cy="0%" r="60%" fill="url(#vb_blue)" opacity="0.9" />
        <Circle cx="100%" cy="0%" r="60%" fill="url(#vb_lgreen)" opacity="0.9" />
        <Circle cx="0%" cy="100%" r="90%" fill="url(#vb_green)" opacity="0.8" />
        <Circle cx="50%" cy="80%" r="70%" fill="url(#vb_yellow)" opacity="0.8" />
        <Circle cx="100%" cy="100%" r="50%" fill="url(#vb_orange)" opacity="0.8" />
        <Circle cx="50%" cy="50%" r="30%" fill="url(#vb_white)" opacity="0.5" />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default BackgroundSVG;
