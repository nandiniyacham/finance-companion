
import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, ActivityIndicator, FlatList } from 'react-native';
import { ProgressChart, LineChart } from 'react-native-chart-kit';
import { SettingsContext } from '../context/SettingsContext';
import { lightTheme, darkTheme } from '../constants/theme';
import AnimatedWrapper from '../components/AnimatedWrapper';


function ResponsiveGrid({ children }) {
const screenWidth = Dimensions.get('window').width;
const isWide = screenWidth > 768; // breakpoint for tablet/desktop


  return (
    <View
      style={{
        flexDirection: isWide ? 'row' : 'column',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
      }}
    >
      {children}
    </View>
  );
}

export default function HomeScreen() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);
  const { darkMode, currency } = useContext(SettingsContext);
  const theme = darkMode ? darkTheme : lightTheme;
  const [transactions, setTransactions] = useState([]);
  const [reminders, setReminders] = useState([]);

  useEffect(() => {
    setData({
      transactions: [
        { id: 1, category: "Food", amount: 250, type: "expense" },
        { id: 2, category: "Salary", amount: 5000, type: "income" }
      ]
    });
    setTransactions([{ id: 1, category: "Food", amount: 250, type: "expense" }]);
    setReminders([{ id: 1, title: "Pay Electricity Bill", time: "2026-04-05T10:00:00Z" }]);
  }, []);

  if (!transactions.length) {
    return <ActivityIndicator size="large" color="blue" />;
  }

  if (error) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.background }]}>
        <Text style={[styles.error, { color: theme.text }]}>
          ⚠️ Couldn't load dashboard. Please try again.
        </Text>
      </View>
    );
  }
  if (!data) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.button} />
        <Text style={[styles.loading, { color: theme.subText }]}>Loading Dashboard...</Text>
      </View>
    );
  }

  // --- Summary Metrics ---
  const totalIncome = data.transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = data.transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const currentBalance = totalIncome - totalExpenses;
  const savingsProgress = totalIncome > 0 ? currentBalance / totalIncome : 0;

  // --- Weekly Trend Data ---
  const weeklyAmounts = [1200, 800, 1500, 900, 2000, 1700, 1300];
  const weeklyLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  // --- Recent Transactions ---
  const recentTransactions = data.transactions.slice(-5).reverse();

  // --- Budget Alert Example ---
  const categories = {};
  data.transactions.forEach(t => {
    if (t.type === 'expense') {
      categories[t.category] = (categories[t.category] || 0) + t.amount;
    }
  });
  const foodExpenses = categories['Food'] || 0;
  const foodBudget = 2000;
  const foodOverBudget = foodExpenses > foodBudget;

  const screenWidth = Dimensions.get('window').width;
const isWide = screenWidth > 768;
const chartWidth = isWide ? (screenWidth / 2) - 40 : screenWidth - 32;

  return (
    <ScrollView style={{ flex: 1, paddingHorizontal: 16, backgroundColor: theme.background }}>
      
     {/* Summary Metrics Row */}
<View style={styles.metricsRow}>
  <View style={[styles.metricCard, { backgroundColor: theme.card }]}>
    <Text style={[styles.metricTitle, { color: theme.text }]}>💰 Balance</Text>
    <Text style={[styles.metricValue, { color: theme.text }]}>
      {currency === 'USD' ? '$' : currency === 'INR' ? '₹' : ''}{currentBalance}
    </Text>
  </View>

  <View style={[styles.metricCard, { backgroundColor: theme.card }]}>
    <Text style={[styles.metricTitle, { color: theme.text }]}>📈 Income</Text>
    <Text style={[styles.metricValue, { color: '#4CAF50' }]}>
      {currency === 'USD' ? '$' : currency === 'INR' ? '₹' : ''}{totalIncome}
    </Text>
  </View>

  <View style={[styles.metricCard, { backgroundColor: theme.card }]}>
    <Text style={[styles.metricTitle, { color: theme.text }]}>📉 Expenses</Text>
    <Text style={[styles.metricValue, { color: '#F44336' }]}>
      {currency === 'USD' ? '$' : currency === 'INR' ? '₹' : ''}{totalExpenses}
    </Text>
  </View>
</View>

      {/* Charts Row */}
      <ResponsiveGrid>
        <View style={[styles.sectionCard, { backgroundColor: theme.card, flex: 1 }]}>
          <Text style={[styles.title, { color: theme.text }]}>🎯 Savings Progress</Text>
          <ProgressChart
            data={{ labels: ['Savings'], data: [savingsProgress] }}
            width={chartWidth}
            height={180}
            strokeWidth={12}
            radius={50}
            chartConfig={{
              backgroundColor: theme.card,
              backgroundGradientFrom: theme.card,
              backgroundGradientTo: theme.card,
              color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
              labelColor: () => theme.text,
            }}
            hideLegend={false}
            style={{ marginTop: 12 }}
          />
        </View>

        <View style={[styles.sectionCard, { backgroundColor: theme.card, flex: 1 }]}>
          <Text style={[styles.title, { color: theme.text }]}>📊 Weekly Spending Trend</Text>
          <LineChart
            data={{ labels: weeklyLabels, datasets: [{ data: weeklyAmounts }] }}
            width={chartWidth}
            height={180}
            chartConfig={{
              backgroundColor: theme.card,
              backgroundGradientFrom: theme.card,
              backgroundGradientTo: theme.card,
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(54, 162, 235, ${opacity})`,
              labelColor: () => theme.text,
            }}
            bezier
            style={{ marginTop: 12, borderRadius: 12 }}
          />
        </View>
      </ResponsiveGrid>

      {/* Budget Alert + Reminders Row */}
      <ResponsiveGrid>
        <View style={[styles.sectionCard, { backgroundColor: theme.card, flex: 1 }]}>
          <Text style={[styles.title, { color: theme.text }]}>⚠️ Budget Alert</Text>
          {foodOverBudget ? (
            <Text style={[styles.alertText, { color: '#F44336' }]}>
              You’ve exceeded your Food budget by {currency === 'USD' ? '$' : '₹'}{foodExpenses - foodBudget}.
            </Text>
          ) : (
            <Text style={[styles.alertText, { color: '#4CAF50' }]}>
              You’re within your Food budget. Remaining: {currency === 'USD' ? '$' : '₹'}{foodBudget - foodExpenses}.
            </Text>
          )}
        </View>

        <AnimatedWrapper style={{ flex: 1 }}>
          <View style={[styles.sectionCard, { backgroundColor: theme.card }]}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>🔔 Reminders</Text>
            {reminders.map(r => (
              <Text key={r.id} style={[styles.reminderItem, { color: theme.text }]}>
                {r.title} at {r.time}
              </Text>
            ))}
          </View>
        </AnimatedWrapper>
      </ResponsiveGrid>

            {/* Recent Transactions + Transactions Row */}
      <ResponsiveGrid>
        {/* Recent Transactions */}
        <View style={[styles.sectionCard, { backgroundColor: theme.card, flex: 1 }]}>
          <Text style={[styles.title, { color: theme.text }]}>📝 Recent Transactions</Text>
          <FlatList
            data={recentTransactions}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={styles.transactionRow}>
                <Text style={[styles.transactionText, { color: theme.text }]}>
                  {item.category} - {item.notes || 'No notes'}
                </Text>
                <Text
                  style={[
                    styles.transactionAmount,
                    { color: item.type === 'income' ? '#4CAF50' : '#F44336' },
                  ]}
                >
                  {item.type === 'income' ? '+' : '-'} {currency === 'USD' ? '$' : currency === 'INR' ? '₹' : ''}{item.amount}
                </Text>
              </View>
            )}
          />
        </View>

        {/* Transactions List */}
        <AnimatedWrapper style={{ flex: 1 }}>
          <View style={[styles.sectionCard, { backgroundColor: theme.card }]}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>💰 Transactions</Text>
            {transactions.map((t, i) => (
              <Text key={i} style={[styles.transactionItem, { color: theme.text }]}>
                {t.category} - {currency}{t.amount}
              </Text>
            ))}
          </View>
        </AnimatedWrapper>
      </ResponsiveGrid>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  centered: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  loading: { 
    marginTop: 10, 
    fontSize: 16 
  },
  error: { 
    fontSize: 16, 
    textAlign: 'center' 
  },
  metricsRow: {
  flexDirection: 'row',       
  justifyContent: 'space-between',
  marginBottom: 20,
},

  metricCard: {
    flex: 1,
    margin: 6,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  metricTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: "700",
  },
  sectionCard: {
    flex: 1,
    margin: 6,
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  alertText: { 
    fontSize: 14, 
    fontWeight: '600', 
    marginTop: 8 
  },
  transactionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  transactionText: { 
    fontSize: 14 
  },
  transactionAmount: { 
    fontSize: 14, 
    fontWeight: '600' 
  },
  transactionItem: {
    fontSize: 14,
    marginVertical: 4,
  },
  reminderItem: {
    fontSize: 14,
    marginVertical: 4,
    fontStyle: 'italic',
  },
});
            