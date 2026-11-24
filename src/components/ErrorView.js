import { StyleSheet, Text, View } from 'react-native';
import PrimaryButton from './PrimaryButton';
import { colors } from '../theme/colors';

export default function ErrorView({ message, onRetry }) {
  return (
    <View style={styles.container}>
      <Text style={styles.message}>{message}</Text>
      <PrimaryButton title="Опитай отново" onPress={onRetry} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: 20,
  },
  message: {
    fontSize: 16,
    color: colors.text,
    textAlign: 'center',
    marginBottom: 16,
  },
});
