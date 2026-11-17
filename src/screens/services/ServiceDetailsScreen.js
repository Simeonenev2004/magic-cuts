import { useEffect } from 'react';
import { Text, View } from 'react-native';
import { common } from '../../theme/common';

export default function ServiceDetailsScreen({ navigation, route }) {
  const { serviceId, name } = route.params;

  useEffect(() => {
    navigation.setOptions({ title: name });
  }, [navigation, name]);

  return (
    <View style={common.screen}>
      <View style={common.card}>
        <Text style={common.text}>Услуга: {name}</Text>
        <Text style={common.text}>Номер: {serviceId}</Text>
      </View>
    </View>
  );
}
