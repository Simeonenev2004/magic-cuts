import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MyBookingsScreen from '../screens/bookings/MyBookingsScreen';
import BookingDetailsScreen from '../screens/bookings/BookingDetailsScreen';
import EditBookingScreen from '../screens/bookings/EditBookingScreen';
import { headerOptions } from '../theme/common';

const Stack = createNativeStackNavigator();

export default function BookingsStack() {
  return (
    <Stack.Navigator screenOptions={headerOptions}>
      <Stack.Screen
        name="MyBookings"
        component={MyBookingsScreen}
        options={{ title: 'Моите часове' }}
      />
      <Stack.Screen
        name="BookingDetails"
        component={BookingDetailsScreen}
        options={{ title: 'Детайли' }}
      />
      <Stack.Screen
        name="EditBooking"
        component={EditBookingScreen}
        options={{ title: 'Пренасрочване' }}
      />
    </Stack.Navigator>
  );
}
