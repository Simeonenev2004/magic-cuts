import { Alert, Text, View } from 'react-native';
import PrimaryButton from '../../components/PrimaryButton';
import { useAuth } from '../../context/AuthContext';
import { common } from '../../theme/common';

export default function ProfileScreen() {
  const { user, profile, logout } = useAuth();

  const name = profile?.name || user?.displayName || '';
  const email = profile?.email || user?.email || '';
  const phone = profile?.phone || '';

  const handleLogout = () => {
    Alert.alert('Изход', 'Сигурен ли си, че искаш да излезеш?', [
      { text: 'Отказ', style: 'cancel' },
      { text: 'Изход', style: 'destructive', onPress: logout },
    ]);
  };

  return (
    <View style={common.screen}>
      <Text style={common.title}>Профил</Text>

      <View style={common.card}>
        <Text style={common.text}>Име: {name}</Text>
        <Text style={common.text}>Имейл: {email}</Text>
        <Text style={common.text}>Телефон: {phone}</Text>
      </View>

      <PrimaryButton title="Изход" onPress={handleLogout} />
    </View>
  );
}
