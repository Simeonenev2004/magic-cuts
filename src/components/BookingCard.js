import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../theme/colors';
import { common } from '../theme/common';
import { formatDateText, parseDate } from '../utils/dates';

export default function BookingCard({ booking, isPast, onPress }) {
  return (
    <TouchableOpacity
      style={[common.card, isPast ? styles.pastCard : null]}
      onPress={onPress}
    >
      <View style={styles.row}>
        <Text style={styles.service}>{booking.serviceName}</Text>
        {isPast ? <Text style={styles.pastLabel}>Минал</Text> : null}
      </View>
      <Text style={styles.date}>
        {formatDateText(parseDate(booking.date))} · {booking.time}
      </Text>
      <Text style={styles.barber}>Фризьор: {booking.barberName}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  pastCard: {
    opacity: 0.55,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  service: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  pastLabel: {
    fontSize: 12,
    color: colors.muted,
    borderWidth: 1,
    borderColor: colors.muted,
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 8,
  },
  date: {
    fontSize: 15,
    color: colors.accent,
    marginTop: 6,
  },
  barber: {
    fontSize: 14,
    color: colors.muted,
    marginTop: 2,
  },
});
