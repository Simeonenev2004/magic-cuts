import { Text, View } from 'react-native';
import { common } from '../../theme/common';

export default function EditBookingScreen({ route }) {
  const { bookingId } = route.params;

  return (
    <View style={common.screen}>
      <View style={common.card}>
        <Text style={common.text}>Пренасрочване на час: {bookingId}</Text>
      </View>
    </View>
  );
}
