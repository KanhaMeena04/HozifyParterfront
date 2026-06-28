import React from 'react';
import Svg, { Path, Circle, Rect, G } from 'react-native-svg';

export const BackArrowIcon = ({ size = 24, color = '#0F172A' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M20 12H4M4 12L10 6M4 12L10 18" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const RightArrowIcon = ({ size = 20, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M4 12H20M20 12L14 6M20 12L14 18" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const MessageIcon = ({ size = 20, color = '#64748B' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M21 11.5C21 16.1944 16.9706 20 12 20C10.669 20 9.40632 19.7431 8.27092 19.2811C8.01633 19.1775 7.72899 19.1678 7.46654 19.2555L4.41421 20.2731C3.52331 20.5701 2.70997 19.7567 3.00693 18.8658L4.0245 15.8135C4.11219 15.551 4.10255 15.2637 3.99895 15.0091C3.53691 13.8737 3 12.611 3 11.2804C3 6.58597 7.02944 2.78036 12 2.78036C16.9706 2.78036 21 6.58597 21 11.5Z" stroke={color} strokeWidth="1.5" strokeLinejoin="round"/>
    <Path d="M8 10H16" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    <Path d="M8 14H13" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
  </Svg>
);

export const WhatsAppIcon = ({ size = 20, color = '#25D366' }: { size?: number, color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12.0001 2.01977C6.48398 2.01977 2.01183 6.49191 2.01183 12.008C2.01183 13.7686 2.4704 15.4239 3.26786 16.8504L2 22L7.26909 20.7571C8.68114 21.5037 10.2872 21.9329 11.9922 21.9329L12.0001 21.9333C17.5146 21.9333 21.9884 17.4611 21.9884 11.945C21.9884 9.27218 20.9482 6.77663 19.0569 4.88602C17.1672 2.99619 14.6543 1.95461 12.0001 1.95461L12.0001 2.01977ZM17.4328 15.3403C17.1895 16.0264 16.2307 16.6346 15.4859 16.7865C14.9754 16.8906 14.2882 16.9782 11.7584 15.93C8.52187 14.5888 6.40696 11.3121 6.24248 11.0921C6.078 10.8735 4.90802 9.31952 4.90802 7.71261C4.90802 6.1057 5.72754 5.32172 6.05059 4.98971C6.31174 4.72124 6.74547 4.59374 7.15112 4.59374C7.28318 4.59374 7.40013 4.59976 7.50293 4.60505C7.83401 4.61937 8.00007 4.64047 8.21855 5.16639C8.49065 5.82397 9.15546 7.44754 9.23381 7.6133C9.31063 7.7783 9.42758 8.01078 9.29474 8.27525C9.16267 8.54049 9.06323 8.6558 8.86586 8.88788C8.66772 9.11997 8.45524 9.30154 8.2713 9.53363C8.07238 9.78234 7.85764 10.0483 8.08779 10.4446C8.31872 10.8402 8.97746 11.9161 9.9419 12.7758C11.189 13.8864 12.193 14.2384 12.6247 14.4215C12.955 14.5617 13.3524 14.5277 13.5853 14.2797C13.8821 13.9655 14.246 13.4357 14.6273 12.9066C14.8918 12.5427 15.2076 12.4922 15.5394 12.6083C15.8712 12.7237 17.6394 13.5992 17.9868 13.7824C18.3343 13.9648 18.5661 14.0543 18.6483 14.187C18.7305 14.3182 18.7305 14.8989 18.4872 15.585L17.4328 15.3403Z" fill={color}/>
  </Svg>
);

export const PlusIcon = ({ size = 20, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 5V19M5 12H19" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

export const DeliveryIcon = ({ size = 24, color = '#3B82F6' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M21 8L12 13L3 8M21 8L12 3L3 8M21 8V16L12 21M3 8V16L12 21M12 13V21" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

export const ServiceIcon = ({ size = 24, color = '#3B82F6' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 3V2" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="m15.4 17.4 3.2-2.8a2 2 0 1 1 2.8 2.9l-3.6 3.3c-.7.8-1.7 1.2-2.8 1.2h-4c-1.1 0-2.1-.4-2.8-1.2l-1.302-1.464A1 1 0 0 0 6.151 19H5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M2 14h12a2 2 0 0 1 0 4h-2" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M4 10h16" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M5 10a7 7 0 0 1 14 0" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M5 14v6a1 1 0 0 1-1 1H2" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

export const BranchIcon = ({ size = 24, color = '#3B82F6' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M8 21V10C8 8.89543 8.89543 8 10 8H14C15.1046 8 16 8.89543 16 10V21M3 21H21M12 13H12.01M12 17H12.01M10 5V3H14V5M7 5H17" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

export const EmployeeIcon = ({ size = 24, color = '#3B82F6' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="8" r="4" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M6 21V19C6 16.7909 7.79086 15 10 15H14C16.2091 15 18 16.7909 18 19V21" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

// export const UserGroupIcon = ({ size = 24, color = '#3B82F6' }) => (
//   <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
//     <Path d="M17 20C17 18.3431 14.7614 17 12 17C9.23858 17 7 18.3431 7 20M12 13C9.79086 13 8 11.2091 8 9C8 6.79086 9.79086 5 12 5C14.2091 5 16 6.79086 16 9C16 11.2091 14.2091 13 12 13ZM19 19C19 17.6193 17.6569 16.5 16 16.5M16 12C17.6569 12 19 10.6569 19 9C19 7.34315 17.6569 6 16 6" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
//   </Svg>
// );

export const ChevronDownIcon = ({ size = 20, color = '#94A3B8' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M6 9L12 15L18 9" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

// export const UploadIcon = ({ size = 24, color = '#94A3B8' }) => (
//   <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
//     <Path d="M3 16.5V18.5C3 19.6046 3.89543 20.5 5 20.5H19C20.1046 20.5 21 19.6046 21 18.5V16.5M7 8L12 3M12 3L17 8M12 3V16" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
//   </Svg>
// );

// New icons for Application, KYC, and Business Setup screens
export const VerifiedIcon = ({ size = 20, color = '#22C55E' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="1.5" />
    <Path d="M8 12L11 15L16 9" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const SolidCheckCircleIcon = ({ size = 24, color = '#22C55E' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="12" fill={color} />
    <Path d="M8 12L11 15L16 9" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const ReviewingIcon = ({ size = 20, color = '#3B82F6' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="1.5" />
    <Path d="M12 7V12L15 15" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const PendingYellowIcon = ({ size = 20, color = '#EAB308' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="1.5" />
    <Path d="M8 12H16" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const RejectedIcon = ({ size = 20, color = '#EF4444' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="1.5" />
    <Path d="M9 9L15 15M15 9L9 15" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const CongratsBadgeIcon = ({ size = 64 }) => (
  <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    {/* Confetti */}
    <Rect x="8" y="15" width="4" height="6" fill="#3B82F6" transform="rotate(-30 10 18)" />
    <Rect x="52" y="20" width="4" height="6" fill="#F97316" transform="rotate(25 54 23)" />
    <Rect x="12" y="45" width="5" height="5" fill="#F97316" transform="rotate(15 14 47)" />
    <Rect x="48" y="48" width="4" height="6" fill="#EAB308" transform="rotate(-40 50 51)" />
    <Circle cx="15" cy="30" r="2" fill="#EAB308" />
    <Circle cx="50" cy="38" r="2.5" fill="#3B82F6" />
    {/* Badge */}
    <Path d="M32 6L37.5 12L45 11L47 18.5L54 22L50 28.5L52.5 36L45 38.5L41.5 45L34 42L28 47.5L23.5 41L16 41L15 33.5L8.5 28.5L13.5 22.5L10.5 15L18.5 14.5L22 8L29 10.5L32 6Z" fill="rgba(26, 15, 163, 1.00)" />
    {/* Checkmark */}
    <Path d="M22 28L28 34L42 20" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const InfoCircleIcon = ({ size = 20, color = '#3B82F6' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="1.5" />
    <Path d="M12 16V12M12 8H12.01" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const EyeIcon = ({ size = 20, color = '#3B82F6' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M2.458 12C3.732 7.943 7.522 5 12 5C16.478 5 20.268 7.943 21.542 12C20.268 16.057 16.478 19 12 19C7.522 19 3.732 16.057 2.458 12Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <Circle cx="12" cy="12" r="3" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const DocumentIcon = ({ size = 24, color = '#3B82F6' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M9 12H15M9 16H15M17 21H7C5.89543 21 5 20.1046 5 19V5C5 3.89543 5.89543 3 7 3H12.5858C12.851 3 13.1054 3.10536 13.2929 3.29289L18.7071 8.70711C18.8946 8.89464 19 9.149 19 9.41421V19C19 20.1046 18.1046 21 17 21Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const ShieldCheckIcon = ({ size = 20, color = 'rgba(26, 15, 163, 1.00)' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12V5.132C3 4.67389 3.31354 4.27533 3.75485 4.17036L11.7548 2.26558C11.9168 2.22704 12.0832 2.22704 12.2452 2.26558L20.2452 4.17036C20.6865 4.27533 21 4.67389 21 5.132V12Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const BuildingIcon = ({ size = 20, color = 'rgba(26, 15, 163, 1.00)' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M3 21H21M5 21V5C5 4.44772 5.44772 4 6 4H18C18.5523 4 19 4.44772 19 5V21M9 8H11M13 8H15M9 12H11M13 12H15M9 16H11M13 16H15" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const PhoneIcon = ({ size = 20, color = 'rgba(26, 15, 163, 1.00)' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M3 5A2 2 0 015 3H8.27924C8.70967 3 9.09181 3.27543 9.22792 3.68377L10.7257 8.17721C10.8831 8.64932 10.6696 9.16531 10.2243 9.38787L7.96701 10.5165C9.06925 12.9612 11.0388 14.9308 13.4835 16.033L14.6121 13.7757C14.8347 13.3304 15.3507 13.1169 15.8228 13.2743L20.3162 14.7721C20.7246 14.9082 21 15.2903 21 15.7208V19A2 2 0 0119 21H18C9.71573 21 3 14.2843 3 6V5Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const IdCardIcon = ({ size = 20, color = '#94A3B8' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="3" y="6" width="18" height="12" rx="2" stroke={color} strokeWidth="1.5" />
    <Circle cx="8" cy="12" r="2" stroke={color} strokeWidth="1.5" />
    <Path d="M13 11H17M13 13H15" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
  </Svg>
);

export const LocationPinIcon = ({ size = 24, color = '#3B82F6' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 21C16 16.8 19 12.8 19 9C19 5.13401 15.866 2 12 2C8.13401 2 5 5.13401 5 9C5 12.8 8 16.8 12 21Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Circle cx="12" cy="9" r="3" stroke={color} strokeWidth="2" />
  </Svg>
);

export const StarIcon = ({ size = 16, color = '#3B82F6' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const ClockCircleIcon = ({ size = 20, color = 'rgba(26, 15, 163, 1.00)' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="1.5" />
    <Path d="M12 7V12L15 15" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const ChevronUpIcon = ({ size = 24, color = '#64748B' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M18 15L12 9L6 15" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const DownloadExcelIcon = ({ size = 16, color = '#3B82F6' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M4 17V19C4 19.5304 4.21071 20.0391 4.58579 20.4142C4.96086 20.7893 5.46957 21 6 21H18C18.5304 21 19.0391 20.7893 19.4142 20.4142C19.7893 20.0391 20 19.5304 20 19V17" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M7 11L12 16L17 11" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M12 4V16" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const OutlineStarIcon = ({ size = 24, color = '#3B82F6' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const CloseIcon = ({ size = 24, color = '#0F172A' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M18 6L6 18M6 6L18 18" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const HomeTabIcon = ({ size = 24, color = '#64748B' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M9 22V12H15V22" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const BookingsTabIcon = ({ size = 24, color = '#64748B' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="4" y="4" width="16" height="16" rx="2" ry="2" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M4 10H20" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M10 14H14" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const WalletTabIcon = ({ size = 24, color = '#64748B' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="3" y="6" width="18" height="12" rx="2" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M17 12H21" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Circle cx="15" cy="12" r="1" fill={color} />
  </Svg>
);

export const ProfileTabIcon = ({ size = 24, color = '#64748B' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Circle cx="12" cy="7" r="4" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const ChartIcon = ({ size = 20, color = '#64748B' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M3 3V21H21" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M7 14L12 9L16 13L21 5" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const GiftIcon = ({ size = 20, color = '#64748B' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="3" y="8" width="18" height="4" rx="1" stroke={color} strokeWidth="1.5" />
    <Path d="M12 8V21M5 12V21H19V12" stroke={color} strokeWidth="1.5" />
    <Path d="M12 8H7.5C5.5 8 5.5 5 7.5 5C9.5 5 12 8 12 8ZM12 8H16.5C18.5 8 18.5 5 16.5 5C14.5 5 12 8 12 8Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const TruckIcon = ({ size = 20, color = '#64748B' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M5 17H4C2.89543 17 2 16.1046 2 15V8C2 6.89543 2.89543 6 4 6H15C16.1046 6 17 6.89543 17 8V17H16" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    <Path d="M17 8L21 11V17H19" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <Circle cx="7.5" cy="17.5" r="2.5" stroke={color} strokeWidth="1.5" />
    <Circle cx="17.5" cy="17.5" r="2.5" stroke={color} strokeWidth="1.5" />
  </Svg>
);

export const BankIcon = ({ size = 20, color = '#64748B' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M3 21H21" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    <Path d="M12 3L3 7H21L12 3Z" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
    <Path d="M6 11V17" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    <Path d="M10 11V17" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    <Path d="M14 11V17" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    <Path d="M18 11V17" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
  </Svg>
);

export const CartIcon = ({ size = 20, color = '#0F172A' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.70711 15.2929C4.07714 15.9229 4.52331 17 5.41421 17H17M17 17C15.8954 17 15 17.8954 15 19C15 20.1046 15.8954 21 17 21C18.1046 21 19 20.1046 19 19C19 17.8954 18.1046 17 17 17ZM9 19C9 20.1046 8.10457 21 7 21C5.89543 21 5 20.1046 5 19C5 17.8954 5.89543 17 7 17C8.10457 17 9 17.8954 9 19Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const HeadphoneIcon = ({ size = 20, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M3 15C3 17.8284 3 19.2426 3.87868 20.1213C4.75736 21 6.17157 21 9 21H15C17.8284 21 19.2426 21 20.1213 20.1213C21 19.2426 21 17.8284 21 15C21 10.0294 16.9706 6 12 6C7.02944 6 3 10.0294 3 15Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    <Path d="M3 15V13C3 8.02944 7.02944 4 12 4C16.9706 4 21 8.02944 21 13V15" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    <Path d="M8 15V17C8 18.1046 7.10457 19 6 19H5C3.89543 19 3 18.1046 3 17V15H8Z" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
    <Path d="M16 15V17C16 18.1046 16.8954 19 18 19H19C20.1046 19 21 18.1046 21 17V15H16Z" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
  </Svg>
);

export const ReceiptIcon = ({ size = 20, color = '#0F172A' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M4 4V20.5C4 21.3284 4.89543 22 6 22H18C19.1046 22 20 21.3284 20 20.5V4C20 3.44772 19.5523 3 19 3H5C4.44772 3 4 3.44772 4 4Z" stroke={color} strokeWidth="1.5" />
    <Path d="M8 8H16" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    <Path d="M8 12H16" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    <Path d="M8 16H12" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
  </Svg>
);

export const EnvelopeIcon = ({ size = 20, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M3 8L10.8906 13.2604C11.5624 13.7083 12.4376 13.7083 13.1094 13.2604L21 8M5 19H19C20.1046 19 21 18.1046 21 17V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const MenuIcon = ({ size = 24, color = '#0F172A' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M4 6H20M4 12H20M4 18H20" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

// export const BellIcon = ({ size = 24, color = '#0F172A' }) => (
//   <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
//     <Path d="M15 17H20L18.5951 15.5951C18.2141 15.2141 18 14.6973 18 14.1585V11C18 8.38757 16.3304 6.16509 14 5.34142V5C14 3.89543 13.1046 3 12 3C10.8954 3 10 3.89543 10 5V5.34142C7.66962 6.16509 6 8.38757 6 11V14.1585C6 14.6973 5.78595 15.2141 5.40493 15.5951L4 17H9M15 17V18C15 19.6569 13.6569 21 12 21C10.3431 21 9 19.6569 9 18V17M15 17H9" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
//   </Svg>
// );

export const RibbonIcon = ({ size = 24, color = '#3B82F6' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="8" r="5" stroke={color} strokeWidth="1.5" />
    <Path d="M9.17157 12.2426L7 21L12 18L17 21L14.8284 12.2426" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const TrendingUpIcon = ({ size = 24, color = '#3B82F6' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M16 7h6v6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="m22 7-8.5 8.5-5-5L2 17" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

export const FilterSettingsIcon = ({ size = 24, color = '#EC4899' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke={color} strokeWidth="1.5" />
    <Path d="M8 12H16M10 8H14M12 16H12.01" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);


export const ListIcon = ({ size = 24, color = '#F97316' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M8 6H20M8 12H20M8 18H20M4 6H4.01M4 12H4.01M4 18H4.01" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const CalendarIcon = ({ size = 24, color = '#0F172A' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="4" y="5" width="16" height="16" rx="2" stroke={color} strokeWidth="1.5" />
    <Path d="M16 3V7M8 3V7M4 11H20" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
  </Svg>
);

export const SearchIcon = ({ size = 20, color = '#0F172A' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="11" cy="11" r="7" stroke={color} strokeWidth="1.5" />
    <Path d="M20 20L16 16" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
  </Svg>
);

export const SecurityIcon = ({ size = 20, color = 'rgba(26, 15, 163, 1.00)' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 22S4 18 4 12V5l8-3 8 3v7c0 6-8 10-8 10z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M12 8v4" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    <Path d="M12 16h.01" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

export const CopyIcon = ({ size = 20, color = '#64748B' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M8 8H6C4.89543 8 4 8.89543 4 10V20C4 21.1046 4.89543 22 6 22H16C17.1046 22 18 21.1046 18 20V18M10 4C10 2.89543 10.8954 2 12 2H18C19.1046 2 20 2.89543 20 4V14C20 15.1046 19.1046 16 18 16H12C10.8954 16 10 15.1046 10 14V4Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const ShareIcon = ({ size = 20, color = 'rgba(26, 15, 163, 1.00)' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="18" cy="5" r="3" stroke={color} strokeWidth="1.5" />
    <Circle cx="6" cy="12" r="3" stroke={color} strokeWidth="1.5" />
    <Circle cx="18" cy="19" r="3" stroke={color} strokeWidth="1.5" />
    <Path d="M8.59 13.51L15.42 17.49M15.41 6.51L8.59 10.49" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const InstagramIcon = ({ size = 24, color = '#EC4899' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="2" y="2" width="20" height="20" rx="5" stroke={color} strokeWidth="1.5" />
    <Circle cx="12" cy="12" r="4" stroke={color} strokeWidth="1.5" />
    <Circle cx="17.5" cy="6.5" r="1.5" fill={color} />
  </Svg>
);

export const YouTubeIcon = ({ size = 24, color = '#EF4444' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="2" y="5" width="20" height="14" rx="3" stroke={color} strokeWidth="1.5" />
    <Path d="M10 9L15 12L10 15V9Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const TwitterIcon = ({ size = 24, color = '#0F172A' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M4 4L9 11L4 20H6L10 14L14 20H20L15 13L20 4H18L14 10L10 4H4Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);


export const QRCodeIcon = ({ size = 24, color = '#0F172A' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="3" y="3" width="7" height="7" rx="1" stroke={color} strokeWidth="1.5" />
    <Rect x="14" y="3" width="7" height="7" rx="1" stroke={color} strokeWidth="1.5" />
    <Rect x="3" y="14" width="7" height="7" rx="1" stroke={color} strokeWidth="1.5" />
    <Rect x="14" y="14" width="3" height="3" rx="0.5" stroke={color} strokeWidth="1.5" />
    <Rect x="18" y="18" width="3" height="3" rx="0.5" stroke={color} strokeWidth="1.5" />
    <Rect x="14" y="18" width="3" height="3" rx="0.5" stroke={color} strokeWidth="1.5" />
    <Rect x="18" y="14" width="3" height="3" rx="0.5" stroke={color} strokeWidth="1.5" />
  </Svg>
);

export const VideoIcon = ({ size = 48, color = 'rgba(26, 15, 163, 1.00)' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="1.5" />
    <Path d="M10 8L15 12L10 16V8Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M16 16H20M18 14V18" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
  </Svg>
);

export const UploadIcon = ({ size = 24, color = 'rgba(26, 15, 163, 1.00)' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 16V4M12 4L8 8M12 4L16 8M4 16V17C4 18.6569 5.34315 20 7 20H17C18.6569 20 20 18.6569 20 17V16" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const UserGroupIcon = ({ size = 20, color = '#64748B' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M16 21V19C16 17.8954 15.1046 17 14 17H10C8.89543 17 8 17.8954 8 19V21" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    <Circle cx="12" cy="9" r="4" stroke={color} strokeWidth="1.5" />
    <Path d="M20 21V19C20 17.8954 19.1046 17 18 17H17" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    <Path d="M16 9C16 11.2091 15.1046 13 14 13" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
  </Svg>
);

export const FacebookIcon = ({ size = 24, color = '#1877F2' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M18 2H15C13.6739 2 12.4021 2.52678 11.4645 3.46447C10.5268 4.40215 10 5.67392 10 7V10H7V14H10V22H14V14H17L18 10H14V7C14 6.73478 14.1054 6.48043 14.2929 6.29289C14.4804 6.10536 14.7348 6 15 6H18V2Z" fill={color} />
  </Svg>
);

export const LinkIcon = ({ size = 16, color = 'rgba(26, 15, 163, 1.00)' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M10 13C10.4295 13.5741 10.9774 14.0491 11.6066 14.3929C12.2357 14.7367 12.9315 14.9411 13.6455 14.9923C14.3596 15.0435 15.0765 14.9403 15.7449 14.6897C16.4133 14.4392 17.0176 14.047 17.52 13.54L20.52 10.54C21.4234 9.60496 21.9238 8.34995 21.9119 7.04499C21.8999 5.74003 21.3763 4.49399 20.4563 3.57578C19.5363 2.65757 18.2898 2.1357 16.9849 2.12378C15.6799 2.11186 14.4234 2.6124 13.49 3.51999L11.75 5.24999" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M14 11C13.5705 10.4259 13.0226 9.95085 12.3934 9.60706C11.7642 9.26328 11.0685 9.05886 10.3545 9.00765C9.64048 8.95644 8.92357 9.0597 8.25515 9.31025C7.58673 9.5608 6.98237 9.95297 6.48 10.46L3.48 13.46C2.57659 14.395 2.07618 15.65 2.08811 16.955C2.10003 18.26 2.6236 19.506 3.54181 20.4242C4.46002 21.3424 5.70647 21.8643 7.01143 21.8762C8.31639 21.8881 9.57285 21.3876 10.51 20.48L12.24 18.75" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

export const CheckCircleIcon = ({ size = 24, color = '#22C55E' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" fill={color} />
    <Path d="M8 12L11 15L16 9" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const OutlineHourglassIcon = ({ size = 24, color = 'rgba(26, 15, 163, 1.00)' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 12C12 12 16 16.5 16 20H8C8 20 12 16.5 12 12C12 12 8 7.5 8 4H16C16 4 12 7.5 12 12Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M10 20H14" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
  </Svg>
);

export const SolidHourglassIcon = ({ size = 80, color = 'rgba(26, 15, 163, 1.00)', fillColor = '#FEF08A' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 12L16 19C16.5 19.5 16 21 15 21H9C8 21 7.5 19.5 8 19L12 12Z" fill={fillColor} />
    <Path d="M12 12C12 12 16 16.5 16 20H8C8 20 12 16.5 12 12C12 12 8 7.5 8 4H16C16 4 12 7.5 12 12Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const BadgeCheckIcon = ({ size = 80, color = 'rgba(26, 15, 163, 1.00)' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 2L14.8 4.2L18.2 3.8L19.4 7.1L22.4 8.7L21 12L22.4 15.3L19.4 16.9L18.2 20.2L14.8 19.8L12 22L9.2 19.8L5.8 20.2L4.6 16.9L1.6 15.3L3 12L1.6 8.7L4.6 7.1L5.8 3.8L9.2 4.2L12 2Z" fill={color} />
    <Path d="M8 12L11 15L16 9" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const PencilIcon = ({ size = 20, color = '#64748B' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

export const BellIcon = ({ size = 20, color = '#64748B' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M18 15V10C18 6.68629 15.3137 4 12 4C8.68629 4 6 6.68629 6 10V15L4 18H20L18 15Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const ShieldIcon = ({ size = 20, color = '#64748B' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 22S4 18 4 12V5l8-3 8 3v7c0 6-8 10-8 10z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const SaveIcon = ({ size = 20, color = '#64748B' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M19 21H5C3.89543 21 3 20.1046 3 19V5C3 3.89543 3.89543 3 5 3H16L21 8V19C21 20.1046 20.1046 21 19 21Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M17 21V13H7V21" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M7 3V8H15" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const PrintIcon = ({ size = 20, color = '#64748B' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M6 9V2H18V9" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M6 18H4C2.89543 18 2 17.1046 2 16V11C2 9.89543 2.89543 9 4 9H20C21.1046 9 22 9.89543 22 11V16C22 17.1046 21.1046 18 20 18H18" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <Rect x="6" y="14" width="12" height="8" rx="1" stroke={color} strokeWidth="1.5" />
  </Svg>
);

export const TrashIcon = ({ size = 20, color = '#EF4444' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M3 6H21M19 6V20C19 21.1046 18.1046 22 17 22H7C5.89543 22 5 21.1046 5 20V6M8 6V4C8 2.89543 8.89543 2 10 2H14C15.1046 2 16 2.89543 16 4V6" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M10 11V17" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M14 11V17" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);
