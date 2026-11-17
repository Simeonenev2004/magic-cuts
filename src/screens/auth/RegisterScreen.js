import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { common } from '../../theme/common';

export default function RegisterScreen({ navigation }) {
  const { register } = useAuth();

  return (
    <SafeAreaView style={[common.screen, styles.container]}>
      <Text style={[common.title, styles.title]}>Регистрация</Text>

      <TouchableOpacity style={common.button} onPress={register}>
        <Text style={common.buttonText}>Регистрация</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={common.link}>Вече имаш акаунт? Влез</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
    marginBottom: 32,
  },
});
