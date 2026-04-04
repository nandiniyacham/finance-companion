import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, Button } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as LocalAuthentication from 'expo-local-authentication';
import { SettingsContext } from '../context/SettingsContext';
import { lightTheme, darkTheme } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';

export default function SettingsScreen({ navigation }) {
  const { darkMode, setDarkMode, currency, setCurrency } = useContext(SettingsContext);
  const theme = darkMode ? darkTheme : lightTheme;

  const [offlineMode, setOfflineMode] = useState(false);

  const handleBiometricLock = async () => {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const enrolled = await LocalAuthentication.isEnrolledAsync();

    if (hasHardware && enrolled) {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Unlock Finance App',
        fallbackLabel: 'Enter Passcode',
      });

      if (result.success) {
        alert('✅ Biometric authentication successful!');
      } else {
        alert('❌ Authentication failed.');
      }
    } else {
      alert('Biometric authentication not available on this device.');
    }
  };

  const handleExport = () => {
    
    const transactions = [
      { id: 1, category: 'Food', amount: 250, type: 'expense' },
      { id: 2, category: 'Salary', amount: 5000, type: 'income' },
    ];
    const reminders = [
      { id: 1, title: 'Pay Electricity Bill', time: '2026-04-05 10:00 AM' },
    ];

    const csv = [
      'Category,Amount,Type',
      ...transactions.map(t => `${t.category},${t.amount},${t.type}`)
    ].join('\n');

    console.log('Exported CSV:\n', csv);
    alert('✅ Data exported to console. Connect expo-sharing to save/share.');
  };

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: theme.background }}>
      {/* Dark Mode Toggle */}
      <View style={[styles.cardRow, { backgroundColor: theme.card }]}>
        <Text style={[styles.label, { color: theme.text }]}>Dark Mode</Text>
        <Switch
          value={darkMode}
          onValueChange={setDarkMode}
          thumbColor={darkMode ? theme.button : '#ccc'}
        />
      </View>

      {/* Currency Picker */}
      <View style={[styles.cardRow, { backgroundColor: theme.card }]}>
        <Text style={[styles.label, { color: theme.text }]}>Currency</Text>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Picker
            selectedValue={currency}
            style={{ color: theme.text }}
            dropdownIconColor={theme.text}
            onValueChange={(val) => setCurrency(val)}
          >
            <Picker.Item label="INR (₹)" value="INR" />
            <Picker.Item label="USD ($)" value="USD" />
            <Picker.Item label="EUR (€)" value="EUR" />
          </Picker>
        </View>
      </View>

      {/* Biometric Lock */}
      <View style={[styles.cardRow, { backgroundColor: theme.card, justifyContent: 'space-between' }]}>
        <Text style={[styles.label, { color: theme.text }]}>Biometric Lock</Text>
        <TouchableOpacity style={[styles.smallBtn, { backgroundColor: theme.button }]} onPress={handleBiometricLock}>
          <Ionicons name="finger-print" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Offline Mode */}
      <View style={[styles.cardRow, { backgroundColor: theme.card }]}>
        <Text style={[styles.label, { color: theme.text }]}>Offline Mode</Text>
        <Switch
          value={offlineMode}
          onValueChange={setOfflineMode}
          thumbColor={offlineMode ? theme.button : '#ccc'}
        />
      </View>

      {/* Data Export */}
      <View style={[styles.cardRow, { backgroundColor: theme.card }]}>
        <Text style={[styles.label, { color: theme.text }]}>Export Data</Text>
        <TouchableOpacity style={[styles.smallBtn, { backgroundColor: theme.button }]} onPress={handleExport}>
          <Ionicons name="download-outline" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Profile Settings */}
      <View style={[styles.cardRow, { backgroundColor: theme.card }]}>
        <Text style={[styles.label, { color: theme.text }]}>Profile Settings</Text>
        <TouchableOpacity style={[styles.smallBtn, { backgroundColor: theme.button }]} onPress={() => navigation.navigate('Profile')}>
          <Ionicons name="person-circle-outline" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  label: { fontSize: 16 },
  smallBtn: {
    padding: 8,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
});