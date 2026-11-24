import { StyleSheet } from 'react-native';
import { colors } from './colors';

export const titleFont = 'Comfortaa_700Bold';

export const common = StyleSheet.create({
  title: {
    fontFamily: titleFont,
    fontSize: 24,
    color: colors.heading,
    marginBottom: 16,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    marginBottom: 12,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  link: {
    fontSize: 15,
    color: colors.accent,
    textAlign: 'center',
    marginTop: 8,
  },
});

// shared header look for all navigators
export const headerOptions = {
  headerStyle: { backgroundColor: colors.background },
  headerTintColor: colors.heading,
  headerTitleStyle: { fontFamily: titleFont, color: colors.heading },
  headerShadowVisible: false,
};
