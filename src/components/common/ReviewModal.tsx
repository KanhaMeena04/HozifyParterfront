import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, Image } from 'react-native';
import Svg, { Path } from 'react-native-svg';

interface ReviewModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (rating: number, review: string) => void;
}

const StarIcon = ({ filled = false, size = 32 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? "#FCD34D" : "none"}>
    <Path 
      d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" 
      stroke={filled ? "#FCD34D" : "#CBD5E1"} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    />
  </Svg>
);

export const ReviewModal: React.FC<ReviewModalProps> = ({ visible, onClose, onSubmit }) => {
  const [rating, setRating] = useState(4);
  const [review, setReview] = useState('');

  const handleSubmit = () => {
    onSubmit(rating, review);
    setRating(4); // reset
    setReview('');
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <TouchableOpacity activeOpacity={1} style={styles.backdrop} onPress={onClose} />
        
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.keyboardView}>
          <View style={styles.sheetContainer}>
            
            <View style={styles.dragHandle} />

            <View style={styles.illustrationBox}>
              <Image 
                source={{ uri: 'https://cdn3d.iconscout.com/3d/premium/thumb/review-5152206-4309033.png' }} 
                style={styles.illustration}
                resizeMode="contain"
              />
            </View>

            <Text style={styles.title}>How was your experience with the customer?</Text>
            <Text style={styles.desc}>
              Your feedback helps improve future trips. Rate and review the customer based on your experience.
            </Text>

            <View style={styles.starsRow}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity activeOpacity={1} key={star} onPress={() => setRating(star)}>
                  <StarIcon filled={star <= rating} size={36} />
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.inputLabel}>Review</Text>
            <TextInput 
              style={styles.textInput}
              placeholder="Write your feedback here..."
              placeholderTextColor="#94A3B8"
              multiline
              textAlignVertical="top"
              value={review}
              onChangeText={setReview}
            />

            <TouchableOpacity activeOpacity={1} style={styles.submitBtn} onPress={handleSubmit}>
              <Text style={styles.submitBtnText}>Submit Review</Text>
            </TouchableOpacity>

          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.4)', justifyContent: 'flex-end' },
  backdrop: { ...StyleSheet.absoluteFillObject },
  
  keyboardView: { width: '100%' },

  sheetContainer: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 32, borderTopRightRadius: 32, paddingHorizontal: 24, paddingBottom: 32, paddingTop: 16 },
  
  dragHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: '#E2E8F0', alignSelf: 'center', marginBottom: 24 },

  illustrationBox: { alignItems: 'center', marginBottom: 24 },
  illustration: { width: 120, height: 120 },

  title: { fontSize: 20, fontWeight: '800', color: '#0F172A', textAlign: 'center', marginBottom: 12 },
  desc: { fontSize: 13, color: '#64748B', textAlign: 'center', lineHeight: 20, marginBottom: 24, paddingHorizontal: 16 },

  starsRow: { flexDirection: 'row', justifyContent: 'center', gap: 12, marginBottom: 32 },

  inputLabel: { fontSize: 12, fontWeight: '700', color: '#0F172A', marginBottom: 8 },
  textInput: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 16, minHeight: 120, padding: 16, fontSize: 13, color: '#0F172A', marginBottom: 24 },

  submitBtn: { backgroundColor: 'rgba(26, 15, 163, 1.00)', paddingVertical: 18, borderRadius: 24, alignItems: 'center' },
  submitBtnText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
});
