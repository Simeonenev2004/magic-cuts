import { Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { common } from '../../theme/common';

export default function ProfileScreen() {
  const { logout } = useAuth();

  return (
    <View style={common.screen}>
      <Text style={common.title}>Профил</Text>

      <TouchableOpacity style={common.button} onPress={logout}>
        <Text style={common.buttonText}>Изход</Text>
      </TouchableOpacity>
    </View>
  );
}
