import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import ErrorView from '../../components/ErrorView';
import LoadingView from '../../components/LoadingView';
import PrimaryButton from '../../components/PrimaryButton';
import { getBarbers, getServiceById } from '../../api/servicesApi';
import { colors } from '../../theme/colors';
import { common, titleFont } from '../../theme/common';

export default function ServiceDetailsScreen({ navigation, route }) {
  const { serviceId, name } = route.params;

  const [service, setService] = useState(null);
  const [barbers, setBarbers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    navigation.setOptions({ title: name });
  }, [navigation, name]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [serviceData, barbersData] = await Promise.all([
        getServiceById(serviceId),
        getBarbers(),
      ]);
      setService(serviceData);
      setBarbers(barbersData);
      setError(false);
    } catch (err) {
      setError(true);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [serviceId]);

  if (loading) {
    return <LoadingView />;
  }

  if (error) {
    return <ErrorView message="Неуспешно зареждане на услугата." onRetry={loadData} />;
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.iconCircle}>
        <MaterialCommunityIcons name={service.icon} size={56} color={colors.primary} />
      </View>

      <Text style={[common.title, styles.name]}>{service.name}</Text>
      <Text style={styles.description}>{service.description}</Text>

      <View style={[common.card, styles.infoRow]}>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Продължителност</Text>
          <Text style={styles.infoValue}>{service.duration} мин</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Цена</Text>
          <Text style={[styles.infoValue, styles.price]}>{service.price} €</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Нашите фризьори</Text>
      {barbers.map((barber) => (
        <View key={barber.id} style={common.card}>
          <Text style={styles.barberName}>{barber.name}</Text>
          <Text style={styles.barberSpecialty}>{barber.specialty}</Text>
        </View>
      ))}

      <View style={styles.button}>
        <PrimaryButton
          title="Запази час"
          onPress={() => navigation.navigate('BookAppointment', { serviceId })}
        />
      </View>
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
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 16,
  },
  name: {
    textAlign: 'center',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    lineHeight: 22,
    color: colors.text,
    textAlign: 'center',
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
  },
  infoItem: {
    flex: 1,
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 13,
    color: colors.muted,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  price: {
    color: colors.accent,
  },
  sectionTitle: {
    fontFamily: titleFont,
    fontSize: 18,
    color: colors.heading,
    marginTop: 12,
    marginBottom: 12,
  },
  barberName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  barberSpecialty: {
    fontSize: 14,
    color: colors.muted,
    marginTop: 2,
  },
  button: {
    marginTop: 12,
  },
});
