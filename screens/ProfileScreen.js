import React, { useState, useContext } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, Switch } from 'react-native';
import * as ImagePicker from 'expo-image-picker'; // Expo image picker
import { SettingsContext } from '../context/SettingsContext';
import { lightTheme, darkTheme } from '../constants/theme';
import { exportToCSV } from '../services/exportService';

export default function ProfileScreen() {
  const { darkMode, setDarkMode, currency, setCurrency } = useContext(SettingsContext);
  const theme = darkMode ? darkTheme : lightTheme;

  const [profile, setProfile] = useState({
    name: 'Nandini',
    email: 'nandini@example.com',
    notificationsEnabled: true,
    currency: currency,
    darkMode: darkMode,
    photo: 'https://i.pravatar.cc/150?img=5', // default photo
  });

  const [loggedIn, setLoggedIn] = useState(true);

  const handleSave = () => {
    setCurrency(profile.currency);
    setDarkMode(profile.darkMode);
    alert('✅ Profile saved locally!');
  };

  const handleExport = () => {
    exportToCSV();
  };

  const handleAuthToggle = () => {
    if (loggedIn) {
      setLoggedIn(false);
      alert('🔒 Logged out successfully');
    } else {
      setLoggedIn(true);
      alert('🔓 Logged in successfully');
    }
  };

  const handleChangePhoto = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert('Permission to access gallery is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfile({ ...profile, photo: result.assets[0].uri });
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Profile Photo */}
      <View style={styles.photoContainer}>
        <Image
          source={{ uri: profile.photo }}
          style={[styles.photo, { borderColor: theme.button }]}
        />
        <TouchableOpacity
          style={[styles.changePhotoButton, { backgroundColor: theme.button }]}
          onPress={handleChangePhoto}
        >
          <Text style={styles.buttonText}>Change Photo</Text>
        </TouchableOpacity>
      </View>

    

      {/* Centered form fields */}
      <View style={styles.formContainer}>
        <Text style={[styles.label, { color: theme.subText }]}>Name</Text>
        <TextInput
          style={[
            styles.input,
            { backgroundColor: theme.card, color: theme.text, borderColor: theme.subText },
          ]}
          value={profile.name}
          onChangeText={(val) => setProfile({ ...profile, name: val })}
          placeholderTextColor={theme.subText}
        />

        <Text style={[styles.label, { color: theme.subText }]}>Email</Text>
        <TextInput
          style={[
            styles.input,
            { backgroundColor: theme.card, color: theme.text, borderColor: theme.subText },
          ]}
          value={profile.email}
          onChangeText={(val) => setProfile({ ...profile, email: val })}
          placeholderTextColor={theme.subText}
        />

        {/* Notifications Toggle */}
        <View style={styles.toggleRow}>
          <Text style={[styles.label, { color: theme.subText }]}>Notifications</Text>
          <Switch
            value={profile.notificationsEnabled}
            onValueChange={(val) => setProfile({ ...profile, notificationsEnabled: val })}
            trackColor={{ false: '#767577', true: theme.button }}
            thumbColor={profile.notificationsEnabled ? '#fff' : '#f4f3f4'}
          />
        </View>
      </View>

      {/* Centered Buttons */}
      <View style={styles.buttonRow}>
        <TouchableOpacity style={[styles.buttonPrimary, { backgroundColor: theme.button }]} onPress={handleSave}>
          <Text style={styles.buttonText}>Save Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.buttonSecondary, { backgroundColor: '#34C759' }]} onPress={handleExport}>
          <Text style={styles.buttonText}>Export Transactions</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={loggedIn ? styles.buttonLogout : styles.buttonLogin}
          onPress={handleAuthToggle}
        >
          <Text style={styles.buttonText}>{loggedIn ? 'Logout' : 'Login'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  photoContainer: { alignItems: 'center', marginBottom: 16 },
  photo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
  },
  changePhotoButton: {
    marginTop: 10,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  formContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  label: { fontSize: 16, marginTop: 12, textAlign: 'center' },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginTop: 6,
    width: 250,
    textAlign: 'center',
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    gap: 12,
  },
  buttonRow: {
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 20,
    gap: 12,
  },
  buttonPrimary: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    width: 200,
  },
  buttonSecondary: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    width: 200,
  },
  buttonLogin: {
    backgroundColor: '#34C759',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    width: 200,
  },
  buttonLogout: {
    backgroundColor: '#FF3B30',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    width: 200,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
    textAlign: 'center',
  },
});