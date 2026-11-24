import { useState } from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { formatDateText } from '../utils/dates';

export default function DateField({ label, value, onChange, error, minimumDate, maximumDate }) {
  const [showPicker, setShowPicker] = useState(false);

  const handleChange = (event, selectedDate) => {
    setShowPicker(false);
    if (event.type === 'set' && selectedDate) {
      onChange(selectedDate);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <TouchableOpacity
        style={[styles.field, error ? styles.fieldError : null]}
        onPress={() => setShowPicker(true)}
      >
        <Text style={value ? styles.value : styles.placeholder}>
          {value ? formatDateText(value) : 'Избери дата'}
        </Text>
        <Ionicons name="calendar-outline" size={20} color={colors.muted} />
      </TouchableOpacity>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {showPicker ? (
        <DateTimePicker
          value={value || minimumDate || new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'inline' : 'default'}
          minimumDate={minimumDate}
          maximumDate={maximumDate}
          onChange={handleChange}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 14,
  },
  label: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 6,
  },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 14,
  },
  fieldError: {
    borderColor: colors.error,
  },
  value: {
    fontSize: 16,
    color: colors.text,
  },
  placeholder: {
    fontSize: 16,
    color: colors.muted,
  },
  error: {
    fontSize: 13,
    color: colors.error,
    marginTop: 4,
  },
});
