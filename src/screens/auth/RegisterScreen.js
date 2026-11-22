import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FormInput from '../../components/FormInput';
import PrimaryButton from '../../components/PrimaryButton';
import { useAuth } from '../../context/AuthContext';
import { colors } from '../../theme/colors';
import { common } from '../../theme/common';
import {
  validateConfirmPassword,
  validateEmail,
  validateName,
  validatePassword,
  validatePhone,
} from '../../utils/validation';
import { getAuthErrorMessage } from '../../utils/authErrors';

export default function RegisterScreen({ navigation }) {
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [authError, setAuthError] = useState('');
  const [loading, setLoading] = useState(false);

  // after the first attempt the error follows what the user types
  const updateError = (field, message) => {
    if (submitted) {
      setErrors((prev) => ({ ...prev, [field]: message }));
    }
  };

  const handleNameChange = (value) => {
    setName(value);
    updateError('name', validateName(value));
  };

  const handlePhoneChange = (value) => {
    setPhone(value);
    updateError('phone', validatePhone(value));
  };

  const handleEmailChange = (value) => {
    setEmail(value);
    updateError('email', validateEmail(value));
  };

  const handlePasswordChange = (value) => {
    setPassword(value);
    updateError('password', validatePassword(value));
    updateError('confirmPassword', validateConfirmPassword(value, confirmPassword));
  };

  const handleConfirmPasswordChange = (value) => {
    setConfirmPassword(value);
    updateError('confirmPassword', validateConfirmPassword(password, value));
  };

  const handleRegister = async () => {
    const newErrors = {
      name: validateName(name),
      phone: validatePhone(phone),
      email: validateEmail(email),
      password: validatePassword(password),
      confirmPassword: validateConfirmPassword(password, confirmPassword),
    };
    setErrors(newErrors);
    setSubmitted(true);
    setAuthError('');

    const hasErrors = Object.values(newErrors).some((message) => message !== '');
    if (hasErrors) {
      return;
    }

    setLoading(true);
    try {
      await register(name.trim(), phone.replace(/\s/g, ''), email.trim(), password);
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
          <Text style={[common.title, styles.title]}>Регистрация</Text>

          <FormInput
            label="Име"
            value={name}
            onChangeText={handleNameChange}
            error={errors.name}
            autoCapitalize="words"
          />
          <FormInput
            label="Телефон"
            value={phone}
            onChangeText={handlePhoneChange}
            error={errors.phone}
            keyboardType="phone-pad"
            placeholder="0888123456"
          />
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
            secureTextEntry
            autoCapitalize="none"
          />
          <FormInput
            label="Повтори парола"
            value={confirmPassword}
            onChangeText={handleConfirmPasswordChange}
            error={errors.confirmPassword}
            secureTextEntry
            autoCapitalize="none"
          />

          {authError ? <Text style={styles.authError}>{authError}</Text> : null}

          <PrimaryButton title="Регистрация" onPress={handleRegister} loading={loading} />

          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={common.link}>Вече имаш акаунт? Влез</Text>
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
  title: {
    textAlign: 'center',
    marginBottom: 24,
  },
  authError: {
    color: colors.error,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 12,
  },
});
