import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '@/constants';
import { SolidCheckCircleIcon } from './Icons';

export type TimelineState = 'completed' | 'active' | 'pending';

export interface TimelineStep {
  id: string;
  label: string;
  subLabel?: string;
  state: TimelineState;
}

interface TimelineTrackerProps {
  steps: TimelineStep[];
  theme?: 'dark' | 'light'; // dark for the blue card, light for the document center
}

export function TimelineTracker({ steps, theme = 'dark' }: TimelineTrackerProps) {
  const isDark = theme === 'dark';
  
  return (
    <View style={styles.container}>
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1;
        
        return (
          <View key={step.id} style={styles.stepContainer}>
            <View style={styles.nodeWrapper}>
              {/* Node */}
              <View style={[styles.node, isDark ? styles.nodeDark : styles.nodeLight]}>
                {step.state === 'completed' && (
                  isDark ? (
                    <View style={styles.darkCompletedNode}>
                      <Text style={styles.darkCheckText}>✓</Text>
                    </View>
                  ) : (
                    <SolidCheckCircleIcon size={32} color="#22C55E" />
                  )
                )}
                {step.state === 'active' && (
                  isDark ? (
                    <View style={styles.darkActiveNode}>
                      <View style={styles.darkActiveInner} />
                    </View>
                  ) : (
                    <SolidCheckCircleIcon size={32} color="#22C55E" /> // based on screenshot 3
                  )
                )}
                {step.state === 'pending' && (
                  isDark ? (
                    <View style={styles.darkPendingNode}>
                      <View style={styles.darkPendingInner} />
                    </View>
                  ) : (
                    <View style={styles.lightPendingNode}>
                      <Text style={styles.lightPendingText}>✓</Text>
                    </View>
                  )
                )}
              </View>

              {/* Line to next node */}
              {!isLast && (
                <View style={[
                  styles.line, 
                  isDark ? styles.lineDark : styles.lineLight,
                  step.state === 'completed' && isDark && { backgroundColor: '#22C55E' }
                ]} />
              )}
            </View>

            {/* Labels */}
            <View style={styles.labelContainer}>
              <Text style={[
                styles.label, 
                isDark ? styles.labelDark : styles.labelLight,
                step.state === 'active' && { fontWeight: '700' }
              ]}>
                {step.label}
              </Text>
              {step.subLabel && (
                <Text style={[
                  styles.subLabel,
                  isDark ? styles.subLabelDark : styles.subLabelLight,
                  step.state === 'active' && { color: isDark ? '#FCD34D' : '#3B82F6' } // yellow or blue for active sublabel
                ]}>
                  {step.subLabel}
                </Text>
              )}
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    width: '100%',
    paddingHorizontal: 16,
  },
  stepContainer: {
    flex: 1,
    alignItems: 'center',
  },
  nodeWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    position: 'relative',
    height: 32, // Aligns with maximum node height
  },
  node: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  nodeDark: {
    width: 24,
    height: 24,
  },
  nodeLight: {
    width: 32,
    height: 32,
  },
  line: {
    position: 'absolute',
    left: '50%',
    width: '100%',
    height: 2,
    zIndex: 1,
  },
  lineDark: {
    backgroundColor: '#312E81', // dark indigo
  },
  lineLight: {
    backgroundColor: '#E2E8F0', // slate 200
  },
  
  // Dark theme nodes
  darkCompletedNode: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#22C55E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  darkCheckText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  darkActiveNode: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(253, 224, 71, 0.2)', // yellow glowing outer
    justifyContent: 'center',
    alignItems: 'center',
  },
  darkActiveInner: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#FDE047', // solid yellow
  },
  darkPendingNode: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  darkPendingInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#64748B', // slate
  },

  // Light theme nodes
  lightPendingNode: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(26, 15, 163, 1.00)', // indigo
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  lightPendingText: {
    color: 'rgba(26, 15, 163, 1.00)',
    fontSize: 16,
  },

  // Labels
  labelContainer: {
    alignItems: 'center',
    marginTop: 8,
  },
  label: {
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  labelDark: {
    color: '#94A3B8', // slate 400
  },
  labelLight: {
    color: '#0F172A',
    fontSize: 11,
  },
  subLabel: {
    fontSize: 10,
    marginTop: 2,
    textAlign: 'center',
  },
  subLabelDark: {
    color: '#64748B',
  },
  subLabelLight: {
    color: '#64748B',
  },
});
