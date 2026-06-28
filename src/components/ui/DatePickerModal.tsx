import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Modal, TouchableOpacity, Text, Platform, ScrollView } from 'react-native';
import Svg, { Path } from 'react-native-svg';

interface DatePickerModalProps {
  visible: boolean;
  value: Date;
  onChange: (event: any, date?: Date) => void;
  onClose: () => void;
  maximumDate?: Date;
  minimumDate?: Date;
}

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];
const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

const ChevronLeftIcon = () => (
  <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
    <Path d="M15 18L9 12L15 6" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const ChevronRightIcon = () => (
  <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
    <Path d="M9 18L15 12L9 6" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const PencilIcon = ({ color = '#0F172A' }) => (
  <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
    <Path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

const ACCENT = 'rgba(26, 15, 163, 1.00)';
const YEAR_ITEM_HEIGHT = 44;

export function DatePickerModal({
  visible,
  value,
  onChange,
  onClose,
  maximumDate,
  minimumDate,
}: DatePickerModalProps) {
  const [currentYear, setCurrentYear] = useState(value.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(value.getMonth());
  const [selectedDate, setSelectedDate] = useState(value);
  // 'calendar' | 'year-month'
  const [editMode, setEditMode] = useState<'calendar' | 'year-month'>('calendar');
  const yearScrollRef = useRef<ScrollView>(null);

  const minYear = minimumDate ? minimumDate.getFullYear() : 1940;
  const maxYear = maximumDate ? maximumDate.getFullYear() : new Date().getFullYear();
  const years = Array.from({ length: maxYear - minYear + 1 }, (_, i) => maxYear - i); // descending

  useEffect(() => {
    if (visible) {
      setCurrentYear(value.getFullYear());
      setCurrentMonth(value.getMonth());
      setSelectedDate(value);
      setEditMode('calendar');
    }
  }, [visible]);

  useEffect(() => {
    if (editMode === 'year-month' && yearScrollRef.current) {
      const idx = years.indexOf(currentYear);
      if (idx >= 0) {
        setTimeout(() => {
          yearScrollRef.current?.scrollTo({ y: idx * YEAR_ITEM_HEIGHT, animated: false });
        }, 50);
      }
    }
  }, [editMode]);

  if (!visible) return null;

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

  const handlePrevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1); }
    else setCurrentMonth(m => m - 1);
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1); }
    else setCurrentMonth(m => m + 1);
  };

  const handleSelectDay = (day: number) => {
    const date = new Date(currentYear, currentMonth, day);
    if (maximumDate && date > maximumDate) return;
    if (minimumDate && date < minimumDate) return;
    setSelectedDate(date);
  };

  const handleOk = () => {
    onChange({ type: 'set' } as any, selectedDate);
    onClose();
  };

  const isSelected = (day: number) =>
    selectedDate.getDate() === day &&
    selectedDate.getMonth() === currentMonth &&
    selectedDate.getFullYear() === currentYear;

  const isDisabled = (day: number) => {
    const date = new Date(currentYear, currentMonth, day);
    if (maximumDate && date > maximumDate) return true;
    if (minimumDate && date < minimumDate) return true;
    return false;
  };

  const formattedHeader = `${MONTHS[selectedDate.getMonth()]} ${selectedDate.getDate()}, ${selectedDate.getFullYear()}`;

  // Calendar grid cells
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  // ── Year+Month picker view ──────────────────────────────────────
  const yearMonthView = (
    <View style={styles.ymContainer}>
      {/* Month grid */}
      <Text style={styles.ymSectionLabel}>Month</Text>
      <View style={styles.monthGrid}>
        {MONTHS_SHORT.map((m, i) => {
          const isActive = i === currentMonth;
          return (
            <TouchableOpacity activeOpacity={1}
              key={i}
              style={[styles.monthCell, isActive && styles.monthCellActive]}
              onPress={() => setCurrentMonth(i)}
            >
              <Text style={[styles.monthCellText, isActive && styles.monthCellTextActive]}>{m}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Year scroll list */}
      <Text style={[styles.ymSectionLabel, { marginTop: 12 }]}>Year</Text>
      <ScrollView
        ref={yearScrollRef}
        style={styles.yearScroll}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled
      >
        {years.map((yr) => {
          const isActive = yr === currentYear;
          return (
            <TouchableOpacity activeOpacity={1}
              key={yr}
              style={[styles.yearItem, isActive && styles.yearItemActive]}
              onPress={() => setCurrentYear(yr)}
            >
              <Text style={[styles.yearItemText, isActive && styles.yearItemTextActive]}>{yr}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Done button */}
      <TouchableOpacity activeOpacity={1}
        style={styles.ymDoneBtn}
        onPress={() => setEditMode('calendar')}
      >
        <Text style={styles.ymDoneBtnText}>Done</Text>
      </TouchableOpacity>
    </View>
  );

  // ── Calendar view ───────────────────────────────────────────────
  const calendarView = (
    <>
      {/* Month Navigation */}
      <View style={styles.monthNavRow}>
        <TouchableOpacity activeOpacity={1} onPress={handlePrevMonth} style={styles.chevronBtn}>
          <ChevronLeftIcon />
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={1} style={styles.monthYearBtn}>
          <Text style={styles.monthYearText}>{MONTHS[currentMonth]} {currentYear}</Text>
          <Text style={styles.monthChevron}>▾</Text>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={1} onPress={handleNextMonth} style={styles.chevronBtn}>
          <ChevronRightIcon />
        </TouchableOpacity>
      </View>

      {/* Day Labels */}
      <View style={styles.dayLabelsRow}>
        {DAYS.map((d, i) => (
          <Text key={i} style={styles.dayLabel}>{d}</Text>
        ))}
      </View>

      {/* Calendar Grid */}
      <View style={styles.gridContainer}>
        {Array.from({ length: Math.ceil(cells.length / 7) }).map((_, rowIdx) => (
          <View key={rowIdx} style={styles.gridRow}>
            {cells.slice(rowIdx * 7, rowIdx * 7 + 7).map((day, colIdx) => {
              if (!day) return <View key={colIdx} style={styles.dayCell} />;
              const sel = isSelected(day);
              const dis = isDisabled(day);
              return (
                <TouchableOpacity activeOpacity={1}
                  key={colIdx}
                  style={[styles.dayCell, sel && styles.dayCellSelected]}
                  onPress={() => handleSelectDay(day)}
                  disabled={dis}
                >
                  <Text style={[styles.dayText, sel && styles.dayTextSelected, dis && styles.dayTextDisabled]}>
                    {day}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </View>
    </>
  );

  const pickerContent = (
    <View style={styles.card}>
      {/* Header */}
      <Text style={styles.selectDateLabel}>SELECT DATE</Text>
      <View style={styles.headerRow}>
        <Text style={styles.selectedDateText}>{formattedHeader}</Text>
        <TouchableOpacity activeOpacity={1}
          style={[styles.pencilBtn, editMode === 'year-month' && styles.pencilBtnActive]}
          onPress={() => setEditMode(editMode === 'calendar' ? 'year-month' : 'calendar')}
        >
          <PencilIcon color={editMode === 'year-month' ? '#FFFFFF' : '#0F172A'} />
        </TouchableOpacity>
      </View>
      <View style={styles.divider} />

      {editMode === 'year-month' ? yearMonthView : calendarView}

      {/* Footer — only show in calendar mode */}
      {editMode === 'calendar' && (
        <View style={styles.footerRow}>
          <TouchableOpacity activeOpacity={1} onPress={onClose} style={styles.cancelBtn}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={1} onPress={handleOk} style={styles.okBtn}>
            <Text style={styles.okText}>OK</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  if (Platform.OS === 'web') {
    return (
      <Modal visible={visible} transparent animationType="fade">
        <View style={styles.overlay}>{pickerContent}</View>
      </Modal>
    );
  }

  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
      <TouchableOpacity activeOpacity={1} style={styles.overlay} onPress={() => editMode === 'calendar' && onClose()}>
        <TouchableOpacity activeOpacity={1}>
          {pickerContent}
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    width: 340,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.15, shadowRadius: 16 },
      android: { elevation: 12 },
    }),
  },
  selectDateLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
    letterSpacing: 1,
    marginBottom: 8,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  selectedDateText: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0F172A',
    flex: 1,
  },
  pencilBtn: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
  },
  pencilBtnActive: {
    backgroundColor: ACCENT,
  },
  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginBottom: 16,
  },

  // Month nav
  monthNavRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  chevronBtn: { padding: 4 },
  monthYearBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  monthYearText: { fontSize: 14, fontWeight: '700', color: '#0F172A' },
  monthChevron: { fontSize: 12, color: '#64748B' },

  // Day labels & grid
  dayLabelsRow: { flexDirection: 'row', marginBottom: 4 },
  dayLabel: { flex: 1, textAlign: 'center', fontSize: 12, fontWeight: '600', color: '#64748B', paddingVertical: 4 },
  gridContainer: { marginBottom: 8 },
  gridRow: { flexDirection: 'row' },
  dayCell: { flex: 1, aspectRatio: 1, justifyContent: 'center', alignItems: 'center', borderRadius: 100, margin: 1 },
  dayCellSelected: { backgroundColor: ACCENT },
  dayText: { fontSize: 14, color: '#0F172A', fontWeight: '500' },
  dayTextSelected: { color: '#FFFFFF', fontWeight: '700' },
  dayTextDisabled: { color: '#CBD5E1' },

  // Footer
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 12,
  },
  cancelBtn: { paddingHorizontal: 20, paddingVertical: 10 },
  cancelText: { fontSize: 14, fontWeight: '700', color: ACCENT },
  okBtn: { paddingHorizontal: 20, paddingVertical: 10 },
  okText: { fontSize: 14, fontWeight: '700', color: ACCENT },

  // Year-Month picker
  ymContainer: { minHeight: 300 },
  ymSectionLabel: { fontSize: 11, fontWeight: '700', color: '#94A3B8', letterSpacing: 0.8, marginBottom: 8 },
  monthGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  monthCell: {
    width: '22%',
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  monthCellActive: { backgroundColor: ACCENT, borderColor: ACCENT },
  monthCellText: { fontSize: 12, fontWeight: '600', color: '#334155' },
  monthCellTextActive: { color: '#FFFFFF' },
  yearScroll: { height: 160, marginTop: 4 },
  yearItem: {
    height: YEAR_ITEM_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  yearItemActive: { backgroundColor: ACCENT },
  yearItemText: { fontSize: 16, fontWeight: '500', color: '#334155' },
  yearItemTextActive: { color: '#FFFFFF', fontWeight: '700' },
  ymDoneBtn: {
    marginTop: 16,
    backgroundColor: ACCENT,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
  },
  ymDoneBtnText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
});
