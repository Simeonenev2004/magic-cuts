import { useEffect, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import ErrorView from '../../components/ErrorView';
import LoadingView from '../../components/LoadingView';
import ServiceCard from '../../components/ServiceCard';
import { getServices } from '../../api/servicesApi';
import { useAuth } from '../../context/AuthContext';
import { colors } from '../../theme/colors';
import { common } from '../../theme/common';

export default function ServicesListScreen({ navigation }) {
  const { user, profile } = useAuth();

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(false);

  const name = profile?.name || user?.displayName || '';

  const loadServices = async () => {
    try {
      const data = await getServices();
      setServices(data);
      setError(false);
    } catch (err) {
      setError(true);
    }
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => {
    loadServices();
  }, []);

  const handleRetry = () => {
    setLoading(true);
    loadServices();
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadServices();
  };

  if (loading) {
    return <LoadingView />;
  }

  if (error) {
    return <ErrorView message="Неуспешно зареждане на услугите." onRetry={handleRetry} />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={services}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <ServiceCard
            service={item}
            onPress={() =>
              navigation.navigate('ServiceDetails', { serviceId: item.id, name: item.name })
            }
          />
        )}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={common.title}>Здравей, {name}</Text>
            <Text style={styles.subtitle}>Избери услуга</Text>
          </View>
        }
        ListEmptyComponent={<Text style={styles.empty}>Все още няма добавени услуги.</Text>}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  list: {
    padding: 20,
  },
  header: {
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.muted,
    marginTop: -8,
    marginBottom: 8,
  },
  empty: {
    fontSize: 16,
    color: colors.muted,
    textAlign: 'center',
    marginTop: 40,
  },
});
