import { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import BookingForm from '../../components/BookingForm';
import ErrorView from '../../components/ErrorView';
import LoadingView from '../../components/LoadingView';
import { createBooking } from '../../api/bookingsApi';
import { getBarbers, getServiceById } from '../../api/servicesApi';
import { useAuth } from '../../context/AuthContext';
import { colors } from '../../theme/colors';
import { common } from '../../theme/common';

export default function BookAppointmentScreen({ navigation, route }) {
  const { serviceId } = route.params;
  const { user, profile } = useAuth();

  const [service, setService] = useState(null);
  const [barbers, setBarbers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [serviceData, barbersData] = await Promise.all([
        getServiceById(serviceId),
        getBarbers(),
      ]);
      setService(serviceData);
      setBarbers(barbersData);
      setError(false);
    } catch (err) {
      setError(true);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [serviceId]);

  const handleSubmit = async (values) => {
    await createBooking({
      userId: user.uid,
      userName: profile?.name || user.displayName || '',
      userPhone: values.phone,
      serviceId: service.id,
      serviceName: service.name,
      servicePrice: service.price,
      serviceDuration: service.duration,
      barberId: values.barber.id,
      barberName: values.barber.name,
      date: values.date,
      time: values.time,
      note: values.note,
      firstVisit: values.firstVisit,
      photo: values.photo,
    });

    Alert.alert(
      'Часът е запазен!',
      '',
      [
        {
          text: 'OK',
          onPress: () => {
            navigation.popToTop();
            navigation.navigate('BookingsTab', { screen: 'MyBookings' });
          },
        },
      ],
      { cancelable: false }
    );
  };

  if (loading) {
    return <LoadingView />;
  }

  if (error) {
    return <ErrorView message="Неуспешно зареждане на данните." onRetry={loadData} />;
  }

  return (
    <BookingForm
      barbers={barbers}
      duration={service.duration}
      defaultPhone={profile?.phone}
      submitTitle="Запази час"
      onSubmit={handleSubmit}
    >
      <View style={[common.card, styles.serviceCard]}>
        <Text style={styles.serviceName}>{service.name}</Text>
        <Text style={styles.serviceInfo}>
          {service.duration} мин · <Text style={styles.price}>{service.price} €</Text>
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
