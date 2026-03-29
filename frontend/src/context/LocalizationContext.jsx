import React, { createContext, useContext, useState, useEffect } from 'react';
import en from '../locales/en.json';
import vi from '../locales/vi.json';

const LocalizationContext = createContext();

export const LocalizationProvider = ({ children }) => {
  // Init language from localStorage or browser settings
  const [lang, setLang] = useState(localStorage.getItem('lang') || 'en');
  // Init currency from localStorage
  const [currency, setCurrency] = useState(localStorage.getItem('currency') || 'USD');
  const [exchangeRate, setExchangeRate] = useState(25400); // Default VND rate

  const translations = lang === 'en' ? en : vi;

  useEffect(() => {
    localStorage.setItem('lang', lang);
  }, [lang]);

  useEffect(() => {
    localStorage.setItem('currency', currency);
  }, [currency]);

  // Translation helper
  const t = (path) => {
    return path.split('.').reduce((obj, key) => obj?.[key], translations) || path;
  };

  // Currency helper
  const formatPrice = (usdAmount) => {
    if (currency === 'VND') {
      const amount = usdAmount * exchangeRate;
      return new Intl.NumberFormat('vi-VN', { 
        style: 'currency', 
        currency: 'VND',
        maximumFractionDigits: 0 
      }).format(amount);
    }
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD' 
    }).format(usdAmount);
  };

  return (
    <LocalizationContext.Provider value={{ 
      lang, 
      setLang, 
      currency, 
      setCurrency, 
      t, 
      formatPrice 
    }}>
      {children}
    </LocalizationContext.Provider>
  );
};

export const useLocalization = () => useContext(LocalizationContext);
