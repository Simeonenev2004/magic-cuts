import { Text, TouchableOpacity, View } from 'react-native';
import { common } from '../../theme/common';

export default function ServicesListScreen({ navigation }) {
  return (
    <View style={common.screen}>
      <Text style={common.title}>Нашите услуги</Text>

      <TouchableOpacity
        style={common.button}
        onPress={() => navigation.navigate('ServiceDetails', { serviceId: 'test', name: 'Фейд' })}
      >
        <Text style={common.buttonText}>Детайли за услуга</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={common.button}
        onPress={() => navigation.navigate('BookAppointment', { serviceId: 'test' })}
      >
        <Text style={common.buttonText}>Запази час</Text>
      </TouchableOpacity>
    </View>
  );
}
