import { useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import FormInput from '../../components/FormInput';
import PrimaryButton from '../../components/PrimaryButton';
import { useAuth } from '../../context/AuthContext';
import { colors } from '../../theme/colors';
import { common } from '../../theme/common';
import { validateEmail, validatePassword } from '../../utils/validation';
import { getAuthErrorMessage } from '../../utils/authErrors';

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [authError, setAuthError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEmailChange = (value) => {
    setEmail(value);
    if (submitted) {
      setErrors((prev) => ({ ...prev, email: validateEmail(value) }));
    }
  };

  const handlePasswordChange = (value) => {
    setPassword(value);
    if (submitted) {
      setErrors((prev) => ({ ...prev, password: validatePassword(value) }));
    }
  };

  const handleLogin = async () => {
    const newErrors = {
      email: validateEmail(email),
      password: validatePassword(password),
    };
    setErrors(newErrors);
    setSubmitted(true);
    setAuthError('');

    if (newErrors.email || newErrors.password) {
      return;
    }

    setLoading(true);
    try {
      await login(email.trim(), password);
    } catch (error) {
      setAuthError(getAuthErrorMessage(error));
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Image
            source={require('../../../assets/logo.jpg')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.slogan}>In Style, Every Cut Matters</Text>

          <FormInput
            label="Имейл"
            value={email}
            onChangeText={handleEmailChange}
            error={errors.email}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
          <FormInput
            label="Парола"
            value={password}
            onChangeText={handlePasswordChange}
            error={errors.password}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            rightIcon={
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={22}
                  color={colors.muted}
                />
              </TouchableOpacity>
            }
          />

          {authError ? <Text style={styles.authError}>{authError}</Text> : null}

          <PrimaryButton title="Вход" onPress={handleLogin} loading={loading} />

          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={common.link}>Нямаш акаунт? Регистрирай се</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  logo: {
    width: 220,
    height: 220,
    alignSelf: 'center',
  },
  slogan: {
    fontSize: 16,
    color: colors.accent,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 28,
  },
  authError: {
    color: colors.error,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 12,
  },
});
