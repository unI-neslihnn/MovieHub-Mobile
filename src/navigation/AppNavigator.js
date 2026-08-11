import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Ekranlar
import WelcomeScreen from '../screens/WelcomeScreen';
import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import WatchlistScreen from '../screens/WatchlistScreen';
import DetailScreen from '../screens/DetailScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#E50914',
        tabBarInactiveTintColor: '#888888',
        tabBarStyle: {
          backgroundColor: '#121212',
          borderTopWidth: 0,
          height: 60,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarIcon: ({ focused, color }) => {
          let iconName;

          if (route.name === 'HomeScreen') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'SearchScreen') {
            iconName = focused ? 'search' : 'search-outline';
          } else if (route.name === 'FavoritesScreen') {
            iconName = focused ? 'heart' : 'heart-outline';
          } else if (route.name === 'WatchlistScreen') {
            iconName = focused ? 'bookmark' : 'bookmark-outline';
          }

          return <Ionicons name={iconName} size={22} color={color} />;
        },
        tabBarLabelStyle: {
          fontSize: 10,
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
      <Tab.Screen
        name="WatchlistScreen"
        component={WatchlistScreen}
        options={{ tabBarLabel: 'İzlenecekler' }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Welcome"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Home" component={MainTabNavigator} />
      <Stack.Screen name="Detail" component={DetailScreen} />
    </Stack.Navigator>
  );
}