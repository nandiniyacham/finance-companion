import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function SummaryCard({ title, value }) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { padding: 16, marginVertical: 8, backgroundColor: '#eee', borderRadius: 8 },
  title: { fontSize: 16, fontWeight: 'bold' },
  value: { fontSize: 20 }
});