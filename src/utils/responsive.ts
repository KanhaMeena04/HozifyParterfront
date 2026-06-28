import { Dimensions, PixelRatio, Platform } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Baseline dimensions based on standard screen sizes (e.g. iPhone 14/15)
const BASE_WIDTH = 375;
const BASE_HEIGHT = 812;

/**
 * Scale element size based on screen width.
 */
export const scale = (size: number) => (SCREEN_WIDTH / BASE_WIDTH) * size;

/**
 * Scale element size based on screen height.
 */
export const verticalScale = (size: number) => (SCREEN_HEIGHT / BASE_HEIGHT) * size;

/**
 * Moderate scaling of sizes with custom factor.
 */
export const moderateScale = (size: number, factor = 0.5) => 
  size + (scale(size) - size) * factor;

/**
 * Moderate vertical scaling with custom factor.
 */
export const moderateVerticalScale = (size: number, factor = 0.5) => 
  size + (verticalScale(size) - size) * factor;

/**
 * Device helper checks
 */
export const isTablet = SCREEN_WIDTH >= 768;
export const isSmallDevice = SCREEN_WIDTH < 360;

/**
 * Calculate responsive percentage of width.
 */
export const widthPercent = (percentage: number) => (SCREEN_WIDTH * percentage) / 100;

/**
 * Calculate responsive percentage of height.
 */
export const heightPercent = (percentage: number) => (SCREEN_HEIGHT * percentage) / 100;

/**
 * Reusable layout presets for spacing.
 */
export const spacing = {
  xs: moderateScale(4),
  sm: moderateScale(8),
  md: moderateScale(12),
  lg: moderateScale(16),
  xl: moderateScale(20),
  xxl: moderateScale(24),
  xxxl: moderateScale(32),
  huge: moderateScale(48),
};

/**
 * Common responsive containers settings.
 */
export const layout = {
  screenWidth: SCREEN_WIDTH,
  screenHeight: SCREEN_HEIGHT,
  isTablet,
  isSmallDevice,
  maxContainerWidth: isTablet ? 480 : '100%',
};
