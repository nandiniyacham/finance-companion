import { Platform } from 'react-native';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system/legacy';

export async function exportToCSV(transactions = [], reminders = []) {
  try {
    const header = 'Category,Amount,Type\n';
    const transactionRows = transactions
      .map(t => `${t.category},${t.amount},${t.type}`)
      .join('\n');

    const reminderRows = reminders
      .map(r => `Reminder: ${r.title},${r.time},-`)
      .join('\n');

    const csv = header + transactionRows + '\n' + reminderRows;

    if (Platform.OS === 'web') {
      // ✅ Web fallback: trigger browser download
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'finance_export.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
    }

    // ✅ Native (Android/iOS)
    const fileUri = FileSystem.cacheDirectory + 'finance_export.csv';
    await FileSystem.writeAsStringAsync(fileUri, csv);

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(fileUri);
    } else {
      alert('Sharing not available on this device. File saved at: ' + fileUri);
    }
  } catch (err) {
    console.error('Export failed:', err);
    alert('❌ Export failed. Check console for details.');
  }
}