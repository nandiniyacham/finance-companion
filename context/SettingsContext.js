import React, { createContext, useState } from 'react';

export const SettingsContext = createContext({
  darkMode: false,
  setDarkMode: () => {},
  currency: 'INR',
  setCurrency: () => {},
});

export const SettingsProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [currency, setCurrency] = useState('INR');

  return (
    <SettingsContext.Provider value={{ darkMode, setDarkMode, currency, setCurrency }}>
      {children}
    </SettingsContext.Provider>
  );
};