import { Text, TouchableOpacity, View } from 'react-native';
import { common } from '../../theme/common';

export default function MyBookingsScreen({ navigation }) {
  return (
    <View style={common.screen}>
      <TouchableOpacity
        style={common.button}
        onPress={() => navigation.navigate('BookingDetails', { bookingId: 'test' })}
      >
        <Text style={common.buttonText}>Детайли за час</Text>
      </TouchableOpacity>
    </View>
  );
}
