import { ActivityIndicator, Text, TouchableOpacity } from 'react-native';
import { common } from '../theme/common';

export default function PrimaryButton({ title, onPress, loading, disabled }) {
  const inactive = loading || disabled;

  return (
    <TouchableOpacity
      style={[common.button, inactive ? { opacity: 0.6 } : null]}
      onPress={onPress}
      disabled={inactive}
    >
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text style={common.buttonText}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}
