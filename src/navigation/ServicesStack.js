import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ServicesListScreen from '../screens/services/ServicesListScreen';
import ServiceDetailsScreen from '../screens/services/ServiceDetailsScreen';
import BookAppointmentScreen from '../screens/services/BookAppointmentScreen';
import { headerOptions } from '../theme/common';

const Stack = createNativeStackNavigator();

export default function ServicesStack() {
  return (
    <Stack.Navigator screenOptions={headerOptions}>
      <Stack.Screen
        name="ServicesList"
        component={ServicesListScreen}
        options={{ title: 'Услуги' }}
      />
      <Stack.Screen
        name="ServiceDetails"
        component={ServiceDetailsScreen}
        options={{ title: '' }}
      />
      <Stack.Screen
        name="BookAppointment"
        component={BookAppointmentScreen}
        options={{ title: 'Запази час' }}
      />
    </Stack.Navigator>
  );
}
