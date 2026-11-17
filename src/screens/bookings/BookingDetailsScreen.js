import { Text, TouchableOpacity, View } from 'react-native';
import { common } from '../../theme/common';

export default function BookingDetailsScreen({ navigation, route }) {
  const { bookingId } = route.params;

  return (
    <View style={common.screen}>
      <View style={common.card}>
        <Text style={common.text}>Час: {bookingId}</Text>
      </View>

      <TouchableOpacity
        style={common.button}
        onPress={() => navigation.navigate('EditBooking', { bookingId })}
      >
        <Text style={common.buttonText}>Пренасрочи</Text>
      </TouchableOpacity>
    </View>
  );
}
