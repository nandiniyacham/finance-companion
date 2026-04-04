import React, { useContext, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { TransactionContext } from '../context/TransactionContext';
import { SettingsContext } from '../context/SettingsContext';
import { lightTheme, darkTheme } from '../constants/theme';

export default function GoalScreen() {
  const { goal, saved, setGoal, loading, error } = useContext(TransactionContext);
  const { darkMode } = useContext(SettingsContext);
  const theme = darkMode ? darkTheme : lightTheme;

  const [newGoal, setNewGoal] = useState(String(goal));

  if (loading) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.button} />
        <Text style={[styles.loading, { color: theme.subText }]}>Loading goal...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.background }]}>
        <Text style={[styles.error, { color: theme.text }]}>⚠️ Couldn't load goal data. Please try again.</Text>
      </View>
    );
  }

  const progress = goal > 0 ? saved / goal : 0;

  const handleSaveGoal = () => {
    const numericGoal = parseFloat(newGoal);
    if (!isNaN(numericGoal) && numericGoal > 0) {
      setGoal(numericGoal);
    }
  };

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: theme.background }}>
      <Text style={[styles.title, { color: theme.text }]}>Monthly Savings Goal</Text>

      {goal === 0 ? (
        <Text style={[styles.emptyText, { color: theme.subText }]}>No goal set yet. Enter a goal below.</Text>
      ) : (
        <View style={[styles.card, { backgroundColor: theme.card }]}>
          <Text style={[styles.metric, { color: theme.text }]}>Goal: ₹{goal}</Text>
          <Text style={[styles.metric, { color: theme.text }]}>Saved: ₹{saved}</Text>
          <Text style={[styles.metric, { color: theme.text }]}>Progress: {Math.round(progress * 100)}%</Text>
          <View style={[styles.progressBar, { backgroundColor: theme.border }]}>
            <View style={[styles.progressFill, { flex: progress, backgroundColor: theme.button }]} />
            <View style={{ flex: 1 - progress }} />
          </View>
        </View>
      )}

      <TextInput
        style={[styles.input, { backgroundColor: theme.card, color: theme.text, borderColor: theme.border }]}
        placeholder="Enter new goal amount"
        placeholderTextColor={theme.subText}
        keyboardType="numeric"
        value={newGoal}
        onChangeText={setNewGoal}
      />

      <TouchableOpacity style={[styles.saveBtn, { backgroundColor: theme.button }]} onPress={handleSaveGoal}>
        <Text style={styles.saveBtnText}>Save Goal</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
  emptyText: { fontSize: 16, marginBottom: 12 },
  card: {
    padding: 14,
    borderRadius: 10,
    marginBottom: 16,
    elevation: 2,
  },
  metric: { fontSize: 16, marginVertical: 4 },
  progressBar: {
    flexDirection: 'row',
    height: 12,
    borderRadius: 6,
    marginTop: 8,
    overflow: 'hidden',
  },
  progressFill: {},
  input: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  saveBtn: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  loading: { marginTop: 10, fontSize: 16 },
  error: { fontSize: 16, textAlign: 'center' },
});