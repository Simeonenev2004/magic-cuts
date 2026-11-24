import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { common } from '../theme/common';

export default function ServiceCard({ service, onPress }) {
  return (
    <TouchableOpacity style={[common.card, styles.card]} onPress={onPress}>
      <MaterialCommunityIcons name={service.icon} size={32} color={colors.primary} />
      <View style={styles.info}>
        <Text style={styles.name}>{service.name}</Text>
        <Text style={styles.duration}>{service.duration} мин</Text>
      </View>
      <Text style={styles.price}>{service.price} €</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  info: {
    flex: 1,
    marginLeft: 14,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  duration: {
    fontSize: 14,
    color: colors.muted,
    marginTop: 2,
  },
  price: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.accent,
  },
});
