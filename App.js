import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View } from 'react-native';

import HomeScreen from './src/screens/HomeScreen';
import WorkoutScreen from './src/screens/WorkoutScreen';
import FinishedScreen from './src/screens/FinishedScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import WeekScreen from './src/screens/WeekScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function TabIcon({ focused, color, label }) {
  return (
    <View style={{ alignItems: 'center' }}>
      <Text style={{ fontSize: 20 }}>{label}</Text>
    </View>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#111',
          borderTopColor: '#222',
          borderTopWidth: 1,
          height: 70,
          paddingBottom: 12,
        },
        tabBarActiveTintColor: '#fff',
        tabBarInactiveTintColor: '#555',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen
        name="Hoje"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: 22 }}>{focused ? '🏠' : '🏠'}</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Semana"
        component={WeekScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: 22 }}>{focused ? '📅' : '📅'}</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Histórico"
        component={HistoryScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: 22 }}>{focused ? '📋' : '📋'}</Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#0f0f0f' },
        }}
      >
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen
          name="Workout"
          component={WorkoutScreen}
          options={{
            headerShown: true,
            headerTitle: 'Treino',
            headerStyle: { backgroundColor: '#0f0f0f' },
            headerTintColor: '#fff',
            headerBackTitle: 'Voltar',
          }}
        />
        <Stack.Screen
          name="Finished"
          component={FinishedScreen}
          options={{ gestureEnabled: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
