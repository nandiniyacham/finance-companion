import React, { useState, useContext } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { TransactionContext } from '../context/TransactionContext';
import { SettingsContext } from '../context/SettingsContext';
import { lightTheme, darkTheme } from '../constants/theme';

export default function TransactionForm({ route, navigation }) {
  const { addTransaction, editTransaction } = useContext(TransactionContext);
  const { darkMode } = useContext(SettingsContext); 
  const theme = darkMode ? darkTheme : lightTheme;  

  const { transaction, index } = route.params || {};
  const [amount, setAmount] = useState(transaction ? String(transaction.amount) : '');
  const [type, setType] = useState(transaction ? transaction.type : 'income');
  const [category, setCategory] = useState(transaction ? transaction.category : '');
  const [date, setDate] = useState(transaction ? transaction.date : new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState(transaction ? transaction.notes : '');

  const handleSave = () => {
    if (!amount || !category) return; 

    const newTransaction = {
      amount: parseFloat(amount),
      type,
      category,
      date,
      notes,
    };

    if (transaction) {
      editTransaction(index, newTransaction);
    } else {
      addTransaction(newTransaction);
    }

    navigation.goBack();
  };

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: theme.background }}>
      <Text style={[styles.title, { color: theme.text }]}>
        {transaction ? 'Edit Transaction' : 'Add Transaction'}
      </Text>

      <TextInput
        style={[styles.input, { backgroundColor: theme.card, color: theme.text, borderColor: theme.border }]}
        placeholder="Amount"
        placeholderTextColor={theme.subText}
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />

      <TextInput
        style={[styles.input, { backgroundColor: theme.card, color: theme.text, borderColor: theme.border }]}
        placeholder="Type (income/expense)"
        placeholderTextColor={theme.subText}
        value={type}
        onChangeText={setType}
      />

      <TextInput
        style={[styles.input, { backgroundColor: theme.card, color: theme.text, borderColor: theme.border }]}
        placeholder="Category"
        placeholderTextColor={theme.subText}
        value={category}
        onChangeText={setCategory}
      />

      <TextInput
        style={[styles.input, { backgroundColor: theme.card, color: theme.text, borderColor: theme.border }]}
        placeholder="Date (YYYY-MM-DD)"
        placeholderTextColor={theme.subText}
        value={date}
        onChangeText={setDate}
      />

      <TextInput
        style={[styles.input, { backgroundColor: theme.card, color: theme.text, borderColor: theme.border }]}
        placeholder="Notes"
        placeholderTextColor={theme.subText}
        value={notes}
        onChangeText={setNotes}
      />

      <TouchableOpacity style={[styles.saveBtn, { backgroundColor: theme.button }]} onPress={handleSave}>
        <Text style={styles.saveBtnText}>Save Transaction</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 12,
    borderRadius: 8,
  },
  saveBtn: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  saveBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});