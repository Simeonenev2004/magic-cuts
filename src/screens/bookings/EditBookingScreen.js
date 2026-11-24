import { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import BookingForm from '../../components/BookingForm';
import ErrorView from '../../components/ErrorView';
import LoadingView from '../../components/LoadingView';
import { getBookingById, updateBooking } from '../../api/bookingsApi';
import { getBarbers } from '../../api/servicesApi';
import { colors } from '../../theme/colors';
import { common } from '../../theme/common';

export default function EditBookingScreen({ navigation, route }) {
  const { bookingId } = route.params;

  const [booking, setBooking] = useState(null);
  const [barbers, setBarbers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [bookingData, barbersData] = await Promise.all([
        getBookingById(bookingId),
        getBarbers(),
      ]);
      setBooking(bookingData);
      setBarbers(barbersData);
      setError(false);
    } catch (err) {
      setError(true);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [bookingId]);

  const handleSubmit = async (values) => {
    await updateBooking(booking, {
      barberId: values.barber.id,
      barberName: values.barber.name,
      date: values.date,
      time: values.time,
      userPhone: values.phone,
      note: values.note,
      firstVisit: values.firstVisit,
      photo: values.photo,
    });

    Alert.alert('Часът е променен.', '', [{ text: 'OK', onPress: () => navigation.goBack() }], {
      cancelable: false,
    });
  };

  if (loading) {
    return <LoadingView />;
  }

  if (error) {
    return <ErrorView message="Неуспешно зареждане на часа." onRetry={loadData} />;
  }

  return (
    <BookingForm
      barbers={barbers}
      duration={booking.serviceDuration}
      booking={booking}
      submitTitle="Запази промените"
      onSubmit={handleSubmit}
    >
      <View style={[common.card, styles.serviceCard]}>
        <Text style={styles.serviceName}>{booking.serviceName}</Text>
        <Text style={styles.serviceInfo}>
          {booking.serviceDuration} мин · <Text style={styles.price}>{booking.servicePrice} €</Text>
        </Text>
      </View>
    </BookingForm>
  );
}

const styles = StyleSheet.create({
  serviceCard: {
    marginBottom: 20,
  },
  serviceName: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.text,
  },
  serviceInfo: {
    fontSize: 15,
    color: colors.muted,
    marginTop: 4,
  },
  price: {
    color: colors.accent,
    fontWeight: '700',
  },
});
