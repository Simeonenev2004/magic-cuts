import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateField from './DateField';
import FormInput from './FormInput';
import PrimaryButton from './PrimaryButton';
import { getTakenSlots } from '../api/bookingsApi';
import { colors } from '../theme/colors';
import { formatDate, parseDate } from '../utils/dates';
import { generateSlots, getAvailableTimes } from '../utils/slots';
import {
  validateBarber,
  validateBookingDate,
  validateNote,
  validatePhone,
  validateTime,
} from '../utils/validation';

const NOTE_LIMIT = 200;
const DAYS_AHEAD = 30;

// booking is passed only when an existing booking is edited
export default function BookingForm({
  barbers,
  duration,
  booking,
  defaultPhone,
  submitTitle,
  onSubmit,
  children,
}) {
  const [barberId, setBarberId] = useState(booking ? booking.barberId : '');
  const [date, setDate] = useState(booking ? parseDate(booking.date) : null);
  const [time, setTime] = useState(booking ? booking.time : '');
  const [phone, setPhone] = useState(booking ? booking.userPhone : defaultPhone || '');
  const [note, setNote] = useState(booking ? booking.note : '');
  const [firstVisit, setFirstVisit] = useState(booking ? booking.firstVisit : false);

  const [takenSlots, setTakenSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [slotsError, setSlotsError] = useState(false);

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [loading, setLoading] = useState(false);

  const today = new Date();
  const maxDate = new Date();
  maxDate.setDate(today.getDate() + DAYS_AHEAD);

  const barber = barbers.find((item) => item.id === barberId);
  const dateString = date ? formatDate(date) : '';
  const isDayOff = barber && date ? barber.daysOff.includes(date.getDay()) : false;

  // when editing, the slots of this booking count as free
  const takenTimes = takenSlots
    .filter((slot) => !booking || slot.bookingId !== booking.id)
    .map((slot) => slot.time);

  const allTimes = barber && date && !isDayOff ? generateSlots(barber.workStart, barber.workEnd) : [];
  const availableTimes =
    barber && date && !isDayOff
      ? getAvailableTimes({
          workStart: barber.workStart,
          workEnd: barber.workEnd,
          duration,
          takenTimes,
          date: dateString,
        })
      : [];

  const loadTakenSlots = async () => {
    setSlotsLoading(true);
    setSlotsError(false);
    try {
      const slots = await getTakenSlots(barberId, dateString);
      setTakenSlots(slots);
    } catch (error) {
      setSlotsError(true);
    }
    setSlotsLoading(false);
  };

  useEffect(() => {
    if (barberId && dateString) {
      loadTakenSlots();
    }
  }, [barberId, dateString]);

  // after the first attempt the error follows what the user changes
  const updateError = (field, message) => {
    if (submitted) {
      setErrors((prev) => ({ ...prev, [field]: message }));
    }
  };

  const handleBarberChange = (value) => {
    setBarberId(value);
    setTime('');
    updateError('barber', validateBarber(value));
    updateError('date', validateBookingDate(date, barbers.find((item) => item.id === value)));
  };

  const handleDateChange = (value) => {
    setDate(value);
    setTime('');
    updateError('date', validateBookingDate(value, barber));
  };

  const handleTimeChange = (value) => {
    setTime(value);
    updateError('time', '');
  };

  const handlePhoneChange = (value) => {
    setPhone(value);
    updateError('phone', validatePhone(value));
  };

  const handleNoteChange = (value) => {
    setNote(value);
    updateError('note', validateNote(value));
  };

  const handleSubmit = async () => {
    const newErrors = {
      barber: validateBarber(barberId),
      date: validateBookingDate(date, barber),
      time: validateTime(time),
      phone: validatePhone(phone),
      note: validateNote(note),
    };
    setErrors(newErrors);
    setSubmitted(true);
    setSubmitError('');

    const hasErrors = Object.values(newErrors).some((message) => message !== '');
    if (hasErrors) {
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        barber,
        date: dateString,
        time,
        phone: phone.replace(/\s/g, ''),
        note: note.trim(),
        firstVisit,
      });
    } catch (error) {
      if (error.code === 'slot-taken') {
        setSubmitError('Този час току-що беше зает. Избери друг.');
        setTime('');
        loadTakenSlots();
      } else {
        setSubmitError('Възникна грешка. Опитай отново.');
      }
    }
    setLoading(false);
  };

  const renderTimes = () => {
    if (!barber || !date) {
      return <Text style={styles.hint}>Избери фризьор и дата, за да видиш свободните часове.</Text>;
    }
    if (slotsLoading) {
      return <ActivityIndicator style={styles.slotsLoading} color={colors.primary} />;
    }
    if (slotsError) {
      return (
        <TouchableOpacity onPress={loadTakenSlots}>
          <Text style={styles.hint}>Неуспешно зареждане на часовете. Натисни, за да опиташ отново.</Text>
        </TouchableOpacity>
      );
    }
    if (availableTimes.length === 0) {
      return <Text style={styles.hint}>Няма свободни часове за този ден.</Text>;
    }

    return (
      <View style={styles.timeGrid}>
        {allTimes.map((item) => {
          const isFree = availableTimes.includes(item);
          const isSelected = item === time;
          return (
            <TouchableOpacity
              key={item}
              style={[
                styles.timeButton,
                isSelected ? styles.timeButtonSelected : null,
                !isFree ? styles.timeButtonTaken : null,
              ]}
              onPress={() => handleTimeChange(item)}
              disabled={!isFree}
            >
              <Text
                style={[
                  styles.timeText,
                  isSelected ? styles.timeTextSelected : null,
                  !isFree ? styles.timeTextTaken : null,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90}
    >
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {children}

        <Text style={styles.label}>Фризьор</Text>
        <View style={[styles.pickerBox, errors.barber ? styles.boxError : null]}>
          <Picker selectedValue={barberId} onValueChange={handleBarberChange}>
            <Picker.Item label="Избери фризьор" value="" color={colors.muted} />
            {barbers.map((item) => (
              <Picker.Item key={item.id} label={item.name} value={item.id} color={colors.text} />
            ))}
          </Picker>
        </View>
        {errors.barber ? <Text style={styles.error}>{errors.barber}</Text> : null}
        <View style={styles.space} />

        <DateField
          label="Дата"
          value={date}
          onChange={handleDateChange}
          error={errors.date}
          minimumDate={today}
          maximumDate={maxDate}
        />

        <Text style={styles.label}>Час</Text>
        {renderTimes()}
        {errors.time ? <Text style={styles.error}>{errors.time}</Text> : null}
        <View style={styles.space} />

        <FormInput
          label="Телефон"
          value={phone}
          onChangeText={handlePhoneChange}
          error={errors.phone}
          keyboardType="phone-pad"
        />

        <FormInput
          label="Бележка (по желание)"
          value={note}
          onChangeText={handleNoteChange}
          error={errors.note}
          multiline
          style={styles.noteInput}
        />
        <Text style={[styles.counter, note.length > NOTE_LIMIT ? styles.counterError : null]}>
          {note.length}/{NOTE_LIMIT}
        </Text>

        <View style={styles.switchRow}>
          <Text style={styles.switchText}>Първо посещение в салона</Text>
          <Switch
            value={firstVisit}
            onValueChange={setFirstVisit}
            trackColor={{ false: colors.border, true: colors.accent }}
            thumbColor={colors.surface}
          />
        </View>

        {submitError ? <Text style={styles.submitError}>{submitError}</Text> : null}

        <PrimaryButton title={submitTitle} onPress={handleSubmit} loading={loading} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 20,
  },
  label: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 6,
  },
  pickerBox: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
  },
  boxError: {
    borderColor: colors.error,
  },
  error: {
    fontSize: 13,
    color: colors.error,
    marginTop: 4,
  },
  space: {
    height: 14,
  },
  hint: {
    fontSize: 14,
    color: colors.muted,
  },
  slotsLoading: {
    alignSelf: 'flex-start',
    marginVertical: 6,
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  timeButton: {
    width: '22%',
    marginRight: '3%',
    marginBottom: 8,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
  },
  timeButtonSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  timeButtonTaken: {
    backgroundColor: colors.border,
  },
  timeText: {
    fontSize: 15,
    color: colors.text,
  },
  timeTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
  timeTextTaken: {
    color: colors.muted,
  },
  noteInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  counter: {
    fontSize: 12,
    color: colors.muted,
    textAlign: 'right',
    marginTop: -8,
    marginBottom: 14,
  },
  counterError: {
    color: colors.error,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  switchText: {
    fontSize: 16,
    color: colors.text,
  },
  submitError: {
    color: colors.error,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 12,
  },
});
