import React, { useContext, useState } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { TransactionContext } from '../context/TransactionContext';
import { SettingsContext } from '../context/SettingsContext';
import { lightTheme, darkTheme } from '../constants/theme'; 
import { Ionicons } from '@expo/vector-icons';

export default function TransactionsScreen({ navigation }) {
 
  const {
    transactions = [],
    deleteTransaction = () => {},
    loading = false,
    error = false,
  } = useContext(TransactionContext) || {};

  const { darkMode = false, currency = 'INR' } = useContext(SettingsContext) || {};
  const [search, setSearch] = useState('');

  const theme = darkMode ? darkTheme : lightTheme;

  const displayedTransactions = search
    ? transactions.filter(t =>
        (t.category || '').toLowerCase().includes(search.toLowerCase()) ||
        (t.notes || '').toLowerCase().includes(search.toLowerCase())
      )
    : transactions;

  if (loading) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.button} />
        <Text style={[styles.loading, { color: theme.subText }]}>Loading transactions...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.background }]}>
        <Text style={[styles.error, { color: theme.text }]}>⚠️ Couldn't load transactions. Please try again.</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.background, padding: 16 }}>
      <TextInput
        style={[styles.search, { backgroundColor: theme.card, color: theme.text, borderColor: theme.border }]}
        placeholder="Search by category or notes"
        placeholderTextColor={theme.subText}
        value={search}
        onChangeText={setSearch}
      />

      {displayedTransactions.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={[styles.emptyText, { color: theme.subText }]}>No transactions yet. Tap + to add one.</Text>
        </View>
      ) : (
        <FlatList
          data={displayedTransactions}
          keyExtractor={(item, index) => `${item?.id || index}`}
          renderItem={({ item, index }) => (
            <View style={[styles.row, { backgroundColor: theme.card }]}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.col, { color: theme.text }]}>
                  {item?.date ? new Date(item.date).toLocaleDateString() : ''}
                </Text>
                <Text style={[styles.col, { color: theme.text }]}>{item?.category || 'Unknown'}</Text>
                <Text style={[styles.col, { color: theme.text }]}>
                  {item?.type === 'income' ? '+' : '-'} {currency === 'USD' ? '$' : currency === 'INR' ? '₹' : ''}{item?.amount || 0}
                </Text>
                <Text style={[styles.col, { color: theme.text }]}>{item?.notes || '-'}</Text>
              </View>

              {/* Compact Icon Buttons */}
              <View style={styles.actions}>
                <TouchableOpacity onPress={() => navigation?.navigate?.('TransactionForm', { transaction: item, index })}>
                  <Ionicons name="create" size={22} color="#4CAF50" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deleteTransaction(index)} style={{ marginLeft: 12 }}>
                  <Ionicons name="trash" size={22} color="#F44336" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}

      {/* Floating Add Button */}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: theme.button }]}
        onPress={() => navigation?.navigate?.('TransactionForm')}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  search: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginBottom: 10,
    borderRadius: 10,
    elevation: 2,
  },
  col: { fontSize: 14, marginBottom: 4 },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 40 },
  emptyText: { fontSize: 16 },
  loading: { marginTop: 10, fontSize: 16 },
  error: { fontSize: 16, textAlign: 'center' },
});