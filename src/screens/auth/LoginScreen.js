import { Image, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { colors } from '../../theme/colors';
import { common } from '../../theme/common';

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();

  return (
    <SafeAreaView style={[common.screen, styles.container]}>
      <Image
        source={require('../../../assets/logo.jpg')}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.slogan}>In Style, Every Cut Matters</Text>

      <TouchableOpacity style={[common.button, styles.button]} onPress={login}>
        <Text style={common.buttonText}>Вход</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={common.link}>Нямаш акаунт? Регистрирай се</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 220,
    height: 220,
  },
  slogan: {
    fontSize: 16,
    color: colors.accent,
    marginTop: 8,
    marginBottom: 32,
  },
  button: {
    alignSelf: 'stretch',
  },
});
