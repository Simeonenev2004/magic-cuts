import { Text, View } from 'react-native';
import { common } from '../../theme/common';

export default function BookAppointmentScreen({ route }) {
  const { serviceId } = route.params;

  return (
    <View style={common.screen}>
      <View style={common.card}>
        <Text style={common.text}>Записване за услуга: {serviceId}</Text>
      </View>
    </View>
  );
}
