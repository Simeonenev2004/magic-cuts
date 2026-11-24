import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import PrimaryButton from '../../components/PrimaryButton';
import { getMyBookings } from '../../api/bookingsApi';
import { useAuth } from '../../context/AuthContext';
import { colors } from '../../theme/colors';
import { common, titleFont } from '../../theme/common';
import { isPastBooking } from '../../utils/dates';

const INSTAGRAM_URL = 'https://www.instagram.com/magic_cuts__/';

// "Иван Петров" -> "ИП"
function getInitials(name) {
  return name
    .split(' ')
    .filter((part) => part !== '')
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');
}

export default function ProfileScreen() {
  const { user, profile, logout } = useAuth();

  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  const name = profile?.name || user?.displayName || '';
  const email = profile?.email || user?.email || '';
  const phone = profile?.phone || '';

  const loadStats = async () => {
    setStatsLoading(true);
    try {
      const bookings = await getMyBookings(user.uid);
      const past = bookings.filter((item) => isPastBooking(item)).length;
      setStats({ upcoming: bookings.length - past, past });
    } catch (error) {
      setStats(null);
    }
    setStatsLoading(false);
  };

  // reload the numbers every time the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadStats();
    }, [user.uid])
  );

  const handleLogout = () => {
    Alert.alert('Изход', 'Сигурен ли си, че искаш да излезеш?', [
      { text: 'Отказ', style: 'cancel' },
      { text: 'Изход', style: 'destructive', onPress: logout },
    ]);
  };

  const openInstagram = () => {
    Linking.openURL(INSTAGRAM_URL).catch(() => {
      Alert.alert('Грешка', 'Връзката не може да се отвори.');
    });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.avatar}>
        <Text style={styles.initials}>{getInitials(name)}</Text>
      </View>
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.contact}>{email}</Text>
      <Text style={styles.contact}>{phone}</Text>

      <View style={[common.card, styles.card]}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Моите часове</Text>
          {statsLoading ? <ActivityIndicator size="small" color={colors.primary} /> : null}
        </View>
        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>{stats ? stats.upcoming : '–'}</Text>
            <Text style={styles.statLabel}>Предстоящи</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>{stats ? stats.past : '–'}</Text>
            <Text style={styles.statLabel}>Минали</Text>
          </View>
        </View>
      </View>

      <View style={[common.card, styles.card]}>
        <Text style={styles.cardTitle}>За салона</Text>
        <Text style={styles.infoText}>Работно време: понеделник – събота, 08:00 – 19:00</Text>
        <Text style={styles.infoText}>Неделя: почивен ден</Text>
        <TouchableOpacity onPress={openInstagram}>
          <Text style={styles.infoText}>
            Instagram: <Text style={styles.link}>@magic_cuts__</Text>
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.logout}>
        <PrimaryButton title="Изход" onPress={handleLogout} />
      </View>

      <Text style={styles.version}>Magic Cuts v1.0.0</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 20,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 12,
  },
  initials: {
    fontSize: 32,
    fontWeight: '700',
    color: '#fff',
  },
  name: {
    fontFamily: titleFont,
    fontSize: 22,
    color: colors.heading,
    textAlign: 'center',
    marginBottom: 6,
  },
  contact: {
    fontSize: 15,
    color: colors.muted,
    textAlign: 'center',
    marginBottom: 2,
  },
  card: {
    marginTop: 16,
    marginBottom: 0,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.heading,
    marginBottom: 10,
  },
  statsRow: {
    flexDirection: 'row',
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.accent,
  },
  statLabel: {
    fontSize: 14,
    color: colors.muted,
    marginTop: 2,
  },
  infoText: {
    fontSize: 15,
    color: colors.text,
    marginBottom: 6,
  },
  link: {
    color: colors.accent,
    fontWeight: '600',
  },
  logout: {
    marginTop: 24,
  },
  version: {
    fontSize: 12,
    color: colors.muted,
    textAlign: 'center',
    marginTop: 4,
  },
});
