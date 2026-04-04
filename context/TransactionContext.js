import React, { createContext, useState, useEffect } from 'react';

export const TransactionContext = createContext();

export const TransactionProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);
  const [goal, setGoal] = useState(0); 
  const [saved, setSaved] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

 
  const API_URL = 'https://mocki.io/v1/2a14856f-9a56-4c45-b9c6-205f7d1813df';


  const recalcSaved = (txs) => {
    const totalSaved = txs
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    setSaved(totalSaved);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(API_URL);
        const json = await response.json();

        const txs = json.transactions || [];
        setTransactions(txs);
        recalcSaved(txs);

        
        setGoal(json.goal || 500);
      } catch (err) {
        console.error('Error fetching transactions:', err);
        setError(true);

        
        const sample = [
          { amount: 5000, type: 'income', category: 'Salary', date: '2026-03-28', notes: 'March salary' },
          { amount: 1200, type: 'expense', category: 'Groceries', date: '2026-03-29', notes: 'Weekly shopping' },
          { amount: 800, type: 'expense', category: 'Transport', date: '2026-03-30', notes: 'Cab rides' },
        ];
        setTransactions(sample);
        recalcSaved(sample);
        setGoal(8000); 
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const addTransaction = (transaction) => {
    const updated = [...transactions, transaction];
    setTransactions(updated);
    recalcSaved(updated);
  };

  const deleteTransaction = (index) => {
    const updated = transactions.filter((_, i) => i !== index);
    setTransactions(updated);
    recalcSaved(updated);
  };

  const editTransaction = (index, updatedTransaction) => {
    const updated = transactions.map((t, i) =>
      i === index ? updatedTransaction : t
    );
    setTransactions(updated);
    recalcSaved(updated);
  };

  const filterTransactions = (query) => {
    return transactions.filter(t =>
      t.category.toLowerCase().includes(query.toLowerCase()) ||
      t.notes?.toLowerCase().includes(query.toLowerCase())
    );
  };

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        addTransaction,
        deleteTransaction,
        editTransaction,
        filterTransactions,
        goal,
        saved,
        setGoal,
        loading,
        error,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};