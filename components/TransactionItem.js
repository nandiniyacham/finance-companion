import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

export default function TransactionItem({ item, onDelete }) {
  return (
    <View style={styles.item}>
      <Text>{item.type}: ${item.amount} ({item.category})</Text>
      <Button title="Delete" onPress={onDelete} />
    </View>
  );
}

const styles = StyleSheet.create({
  item: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 8 }
});