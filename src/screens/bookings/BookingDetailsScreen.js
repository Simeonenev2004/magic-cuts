import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import ErrorView from '../../components/ErrorView';
import LoadingView from '../../components/LoadingView';
import PrimaryButton from '../../components/PrimaryButton';
import { deleteBooking, getBookingById } from '../../api/bookingsApi';
import { colors } from '../../theme/colors';
import { common } from '../../theme/common';
import { formatDateText, isPastBooking, parseDate } from '../../utils/dates';

function InfoRow({ label, value }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

export default function BookingDetailsScreen({ navigation, route }) {
  const { bookingId } = route.params;

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const loadBooking = async () => {
    try {
      const data = await getBookingById(bookingId);
      setBooking(data);
      setError(false);
    } catch (err) {
      setError(true);
    }
    setLoading(false);
  };

  // reload on focus, so the changes after rescheduling are visible
  useFocusEffect(
    useCallback(() => {
      loadBooking();
    }, [bookingId])
  );

  const handleRetry = () => {
    setLoading(true);
    loadBooking();
  };

  const cancelBooking = async () => {
    setDeleting(true);
    try {
      await deleteBooking(booking);
      navigation.popToTop();
    } catch (err) {
      setDeleting(false);
      Alert.alert('Грешка', 'Часът не беше отказан. Опитай отново.');
    }
  };

  const handleCancel = () => {
    Alert.alert('Отказ на час', 'Сигурен ли си, че искаш да откажеш този час?', [
      { text: 'Не', style: 'cancel' },
      { text: 'Да, откажи', style: 'destructive', onPress: cancelBooking },
    ]);
  };

  if (loading) {
    return <LoadingView />;
  }

  if (error) {
    return <ErrorView message="Неуспешно зареждане на часа." onRetry={handleRetry} />;
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={common.title}>{booking.serviceName}</Text>

      <View style={common.card}>
        <InfoRow label="Цена" value={`${booking.servicePrice} €`} />
        <InfoRow label="Продължителност" value={`${booking.serviceDuration} мин`} />
        <InfoRow label="Дата" value={formatDateText(parseDate(booking.date))} />
        <InfoRow label="Час" value={booking.time} />
        <InfoRow label="Фризьор" value={booking.barberName} />
        <InfoRow label="Телефон" value={booking.userPhone} />
        {booking.note ? <InfoRow label="Бележка" value={booking.note} /> : null}
        <InfoRow label="Първо посещение" value={booking.firstVisit ? 'да' : 'не'} />
      </View>

      {booking.photo ? (
        <View>
          <Text style={styles.photoLabel}>Желана прическа</Text>
          <Image source={{ uri: booking.photo }} style={styles.photo} resizeMode="cover" />
        </View>
      ) : null}

      {!isPastBooking(booking) ? (
        <View>
          <PrimaryButton
            title="Пренасрочи"
            onPress={() => navigation.navigate('EditBooking', { bookingId })}
            disabled={deleting}
          />
          <TouchableOpacity style={styles.cancelButton} onPress={handleCancel} disabled={deleting}>
            {deleting ? (
              <ActivityIndicator color={colors.error} />
            ) : (
              <Text style={styles.cancelText}>Откажи часа</Text>
            )}
          </TouchableOpacity>
        </View>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  rowLabel: {
    fontSize: 15,
    color: colors.muted,
    marginRight: 12,
  },
  rowValue: {
    flex: 1,
    fontSize: 15,
    color: colors.text,
    textAlign: 'right',
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: colors.error,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  cancelText: {
    color: colors.error,
    fontSize: 16,
    fontWeight: '600',
  },
  photoLabel: {
    fontSize: 14,
    color: colors.text,
    marginTop: 4,
    marginBottom: 6,
  },
  photo: {
    width: '100%',
    height: 260,
    borderRadius: 12,
    marginBottom: 16,
  },
});
