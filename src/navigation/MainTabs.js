import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import ServicesStack from './ServicesStack';
import BookingsStack from './BookingsStack';
import ProfileScreen from '../screens/profile/ProfileScreen';
import { colors } from '../theme/colors';
import { headerOptions } from '../theme/common';

const Tab = createBottomTabNavigator();

const icons = {
  ServicesTab: 'cut-outline',
  BookingsTab: 'calendar-outline',
  ProfileTab: 'person-outline',
};

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        ...headerOptions,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: { backgroundColor: colors.background, borderTopColor: colors.border },
        tabBarIcon: ({ color, size }) => (
          <Ionicons name={icons[route.name]} size={size} color={color} />
        ),
      })}
    >
      <Tab.Screen
        name="ServicesTab"
        component={ServicesStack}
        options={{ title: 'Услуги', headerShown: false }}
      />
      <Tab.Screen
        name="BookingsTab"
        component={BookingsStack}
        options={{ title: 'Моите часове', headerShown: false }}
      />
      <Tab.Screen name="ProfileTab" component={ProfileScreen} options={{ title: 'Профил' }} />
    </Tab.Navigator>
  );
}
