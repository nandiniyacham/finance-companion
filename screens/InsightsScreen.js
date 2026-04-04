import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import { PieChart, BarChart } from 'react-native-chart-kit';
import { SettingsContext } from '../context/SettingsContext';
import { lightTheme, darkTheme } from '../constants/theme';

export default function InsightsScreen() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);
  const { darkMode } = useContext(SettingsContext);
  const theme = darkMode ? darkTheme : lightTheme;

  useEffect(() => {
    fetch('https://mocki.io/v1/2a14856f-9a56-4c45-b9c6-205f7d1813df')
      .then(response => response.json())
      .then(json => setData(json))
      .catch(() => setError(true));
  }, []);

  if (error) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.background }]}>
        <Text style={[styles.error, { color: theme.text }]}>⚠️ Couldn't load insights. Please try again.</Text>
      </View>
    );
  }

  if (!data) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.button} />
        <Text style={[styles.loading, { color: theme.subText }]}>Loading Insights...</Text>
      </View>
    );
  }

  // --- Highest Spending Category ---
  const categoryTotals = {};
  data.transactions.forEach(t => {
    if (t.type === 'expense') {
      categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
    }
  });
  const highestCategory = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0];

  // --- Weekly Comparison ---
  const now = new Date();
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(now.getDate() - 7);
  const twoWeeksAgo = new Date();
  twoWeeksAgo.setDate(now.getDate() - 14);

  let totalThisWeek = 0;
  let totalLastWeek = 0;
  data.transactions.forEach(t => {
    const date = new Date(t.date);
    if (date >= oneWeekAgo) {
      totalThisWeek += t.amount;
    } else if (date >= twoWeeksAgo && date < oneWeekAgo) {
      totalLastWeek += t.amount;
    }
  });

  // --- Frequent Transaction Type ---
  const expenseCount = data.transactions.filter(t => t.type === 'expense').length;
  const incomeCount = data.transactions.filter(t => t.type === 'income').length;
  const frequentType = expenseCount > incomeCount ? 'Expense' : 'Income';

  // --- Pie Chart Data ---
  const pieData = Object.keys(categoryTotals).map((cat, index) => ({
    name: cat,
    amount: categoryTotals[cat],
    color: chartColors[index % chartColors.length],
    legendFontColor: theme.text,
    legendFontSize: 14,
  }));

  // --- Bar Chart Data ---
  const barData = data.monthlyData
    ? {
        labels: data.monthlyData.map(item => item.month),
        datasets: [{ data: data.monthlyData.map(item => item.amount) }],
      }
    : { labels: [], datasets: [{ data: [] }] };

  const screenWidth = Dimensions.get('window').width;
  const chartWidth = screenWidth - 32;

  const chartConfig = {
    backgroundColor: theme.card,
    backgroundGradientFrom: theme.card,
    backgroundGradientTo: theme.card,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`, // solid blue bars
    labelColor: () => theme.text,
    propsForBackgroundLines: {
      strokeWidth: 0, // removes grid lines
    },
  };

  return (
    <ScrollView style={{ flex: 1, paddingHorizontal: 16, backgroundColor: theme.background }}>
      {/* Highest Spending Category */}
      <View style={[styles.card, { backgroundColor: theme.card }]}>
        <Text style={[styles.metric, { color: theme.text }]}>
          💸 Highest Spending Category: {highestCategory ? `${highestCategory[0]} (₹${highestCategory[1]})` : 'None'}
        </Text>
      </View>

      {/* Weekly Comparison */}
      <View style={[styles.card, { backgroundColor: theme.card }]}>
        <Text style={[styles.metric, { color: theme.text }]}>
          📊 This Week: ₹{totalThisWeek} | Last Week: ₹{totalLastWeek}
        </Text>
      </View>

      {/* Frequent Transaction Type */}
      <View style={[styles.card, { backgroundColor: theme.card }]}>
        <Text style={[styles.metric, { color: theme.text }]}>🔄 Frequent Transaction Type: {frequentType}</Text>
      </View>

      {/* Pie Chart */}
      <View style={[styles.card, { backgroundColor: theme.card }]}>
        <Text style={[styles.metric, { color: theme.text }]}>🍕 Spending by Category</Text>
        {pieData.length > 0 ? (
          <View style={{ alignItems: 'center' }}>
            <PieChart
              data={pieData}
              width={chartWidth}
              height={220}
              accessor="amount"
              backgroundColor="transparent"
              paddingLeft="15"
              chartConfig={chartConfig}
              absolute
            />
          </View>
        ) : (
          <Text style={[styles.empty, { color: theme.subText }]}>No expense data yet</Text>
        )}
      </View>

      {/* Bar Chart */}
      <View style={[styles.card, { backgroundColor: theme.card }]}>
        <Text style={[styles.metric, { color: theme.text }]}>📅 Monthly Spending Trend</Text>
        {barData.labels.length > 0 ? (
          <View style={{ alignItems: 'center' }}>
            <BarChart
              data={barData}
              width={chartWidth}
              height={220}
              chartConfig={chartConfig}
              verticalLabelRotation={0} // keep labels horizontal
              style={{ marginVertical: 8, borderRadius: 12 }}
              fromZero
              showValuesOnTopOfBars
              withHorizontalLabels={false} // no horizontal grid lines
              withVerticalLabels={true} // keep X-axis labels
            />
          </View>
        ) : (
          <Text style={[styles.empty, { color: theme.subText }]}>No monthly data yet</Text>
        )}
      </View>
    </ScrollView>
  );
}

const chartColors = ['#FF6384', '#36A2EB', '#FFCE56', '#4CAF50', '#9966FF', '#FF9F40'];

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  metric: { fontSize: 18, marginVertical: 8 },
  empty: { fontSize: 14, marginTop: 10 },
  loading: { marginTop: 10, fontSize: 16 },
  error: { fontSize: 16, textAlign: 'center' },
  card: {
    padding: 18,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
});