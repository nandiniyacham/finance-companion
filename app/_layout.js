import React, { useContext } from 'react';
import { useWindowDimensions, TouchableOpacity, View, Text, Image } from 'react-native';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

import { TransactionProvider } from '../context/TransactionContext';
import { SettingsProvider, SettingsContext } from '../context/SettingsContext';
import { lightTheme, darkTheme } from '../constants/theme';

import HomeScreen from '../screens/HomeScreen';
import TransactionsScreen from '../screens/TransactionsScreen';
import GoalsScreen from '../screens/GoalsScreen';
import InsightsScreen from '../screens/InsightsScreen';
import TransactionForm from '../screens/TransactionForm';
import SettingsScreen from '../screens/SettingsScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Drawer = createDrawerNavigator();
const RootStack = createStackNavigator();

// Custom Drawer with Footer
function CustomDrawerContent(props) {
  const { darkMode } = useContext(SettingsContext);
  const theme = darkMode ? darkTheme : lightTheme;

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1 }}>
      <DrawerItemList {...props} />
      {/* Footer */}
      <View style={{ marginTop: 'auto', padding: 16 }}>
        <Text
          style={{
            color: theme.subText,
            fontSize: 12,
            textAlign: 'center',
            fontFamily: 'sans-serif-light',
          }}
        >
          © 2026 All rights reserved
        </Text>
        <Text
          style={{
            color: theme.text,
            fontSize: 12,
            textAlign: 'center',
            marginTop: 4,
            fontFamily: 'sans-serif-medium',
          }}
        >
          Developed by Nandini
        </Text>
        <Text
          style={{
            color: theme.subText,
            fontSize: 11,
            textAlign: 'center',
            marginTop: 2,
            fontFamily: 'sans-serif-light',
          }}
        >
          v1.0.0
        </Text>
      </View>
    </DrawerContentScrollView>
  );
}

function DrawerNavigator() {
  const dimensions = useWindowDimensions();
  const isLargeScreen = dimensions.width >= 768;
  const { darkMode } = useContext(SettingsContext);
  const theme = darkMode ? darkTheme : lightTheme;

  return (
    <Drawer.Navigator
      initialRouteName="Home"
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={({ navigation }) => ({
        headerStyle: { backgroundColor: theme.background },
        headerTintColor: theme.text,
        drawerStyle: { backgroundColor: theme.card, width: 240 },
        drawerActiveTintColor: theme.button,
        drawerInactiveTintColor: theme.subText,
        drawerActiveBackgroundColor: darkMode ? '#333' : '#e6f0ff',
        drawerItemStyle: {
          borderRadius: 8,
          marginVertical: 4,
        },
        drawerType: isLargeScreen ? 'permanent' : 'slide',
        headerLeft: isLargeScreen ? () => null : undefined,
        headerRight: () => (
          <TouchableOpacity
            style={{ marginRight: 16 }}
            onPress={() => navigation.navigate('Profile')}
          >
            <Image
              source={{ uri: 'https://i.pravatar.cc/100?img=5' }} // replace with your own profile pic URL or local asset
              style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                borderWidth: 1,
                borderColor: theme.button,
              }}
            />
          </TouchableOpacity>
        ),
      })}
    >
      <Drawer.Screen
        name="Home"
        component={HomeScreen}
        options={{
          drawerIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} />,
        }}
      />
      <Drawer.Screen
        name="Transactions"
        component={TransactionsScreen}
        options={{
          drawerIcon: ({ color, size }) => <Ionicons name="list" size={size} color={color} />,
        }}
      />
      <Drawer.Screen
        name="Goals"
        component={GoalsScreen}
        options={{
          drawerIcon: ({ color, size }) => <Ionicons name="flag" size={size} color={color} />,
        }}
      />
      <Drawer.Screen
        name="Insights"
        component={InsightsScreen}
        options={{
          drawerIcon: ({ color, size }) => <Ionicons name="bar-chart" size={size} color={color} />,
        }}
      />
      <Drawer.Screen
        name="TransactionForm"
        component={TransactionForm}
        options={{
          drawerIcon: ({ color, size }) => <Ionicons name="add-circle" size={size} color={color} />,
        }}
      />
      <Drawer.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          drawerIcon: ({ color, size }) => <Ionicons name="settings" size={size} color={color} />,
        }}
      />
    </Drawer.Navigator>
  );
}

export default function Layout() {
  return (
    <TransactionProvider>
      <SettingsProvider>
        <RootStack.Navigator>
          <RootStack.Screen
            name="MainDrawer"
            component={DrawerNavigator}
            options={{ headerShown: false }}
          />
          <RootStack.Screen
            name="Profile"
            component={ProfileScreen}
            options={{ title: 'Profile Settings' }}
          />
        </RootStack.Navigator>
      </SettingsProvider>
    </TransactionProvider>
  );
}