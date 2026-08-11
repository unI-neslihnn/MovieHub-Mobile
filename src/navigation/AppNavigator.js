import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Ekranlarımız
import WelcomeScreen from '../screens/WelcomeScreen';
import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import DetailScreen from '../screens/DetailScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// 1. Alt Menü Yapısı (Bottom Tabs)
function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#E50914', // Aktif sekme rengi (Kırmızı)
        tabBarInactiveTintColor: '#888888', // Pasif sekme rengi
        tabBarStyle: {
          backgroundColor: '#121212', // Koyu tema arka planı
          borderTopWidth: 0,
          height: 60,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'HomeScreen') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'SearchScreen') {
            iconName = focused ? 'search' : 'search-outline';
          } else if (route.name === 'FavoritesScreen') {
            iconName = focused ? 'heart' : 'heart-outline';
          }

          return <Ionicons name={iconName} size={22} color={color} />;
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      })}
    >
      <Tab.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{ tabBarLabel: 'Ana Sayfa' }}
      />
      <Tab.Screen
        name="SearchScreen"
        component={SearchScreen}
        options={{ tabBarLabel: 'Arama' }}
      />
      <Tab.Screen
        name="FavoritesScreen"
        component={FavoritesScreen}
        options={{ tabBarLabel: 'Favoriler' }}
      />
    </Tab.Navigator>
  );
}

// 2. Ana Navigasyon Akışı (Stack Navigator)
export default function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Welcome"
      screenOptions={{ headerShown: false }}
    >
      {/* Karşılama / Giriş Ekranı (Alt bar görünmez) */}
      <Stack.Screen name="Welcome" component={WelcomeScreen} />

      {/* Ana Uygulama Yapısı (Alt bar görünür) */}
      <Stack.Screen name="Home" component={MainTabNavigator} />

      {/* Detay Ekranı */}
      <Stack.Screen name="Detail" component={DetailScreen} />
    </Stack.Navigator>
  );
}