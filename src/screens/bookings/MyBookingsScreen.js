import { useCallback, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import BookingCard from '../../components/BookingCard';
import ErrorView from '../../components/ErrorView';
import LoadingView from '../../components/LoadingView';
import PrimaryButton from '../../components/PrimaryButton';
import { getMyBookings } from '../../api/bookingsApi';
import { useAuth } from '../../context/AuthContext';
import { colors } from '../../theme/colors';
import { isPastBooking } from '../../utils/dates';

export default function MyBookingsScreen({ navigation }) {
  const { user } = useAuth();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(false);

  const loadBookings = async () => {
    try {
      const data = await getMyBookings(user.uid);

      // upcoming first (the nearest on top), then the past ones (the latest on top)
      const upcoming = data.filter((item) => !isPastBooking(item));
      const past = data.filter((item) => isPastBooking(item)).reverse();

      setBookings([...upcoming, ...past]);
      setError(false);
    } catch (err) {
      setError(true);
    }
    setLoading(false);
    setRefreshing(false);
  };

  // reload every time the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadBookings();
    }, [user.uid])
  );

  const handleRetry = () => {
    setLoading(true);
    loadBookings();
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadBookings();
  };

  if (loading) {
    return <LoadingView />;
  }

  if (error) {
    return <ErrorView message="Неуспешно зареждане на часовете." onRetry={handleRetry} />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={bookings}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <BookingCard
            booking={item}
            isPast={isPastBooking(item)}
            onPress={() => navigation.navigate('BookingDetails', { bookingId: item.id })}
          />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>Нямаш запазени часове.</Text>
            <PrimaryButton
              title="Виж услугите"
              onPress={() => navigation.navigate('ServicesTab')}
            />
          </View>
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  list: {
    flexGrow: 1,
    padding: 20,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: colors.muted,
    marginBottom: 16,
  },
});
