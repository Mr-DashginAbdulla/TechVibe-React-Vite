import React, { createContext, useContext, useState, useEffect } from 'react';

const CurrencyContext = createContext();

export const useCurrency = () => useContext(CurrencyContext);

const EXCHANGE_RATES = {
  AZN: 1,
  USD: 1 / 1.7,   // 1 AZN = 0.588 USD
  EUR: 1 / 1.85   // 1 AZN = 0.540 EUR
};

const SYMBOLS = {
  AZN: '₼',
  USD: '$',
  EUR: '€'
};

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState('AZN');

  useEffect(() => {
    const savedCurrency = localStorage.getItem('techvibe_currency');
    if (savedCurrency && EXCHANGE_RATES[savedCurrency]) {
      setCurrency(savedCurrency);
    }
  }, []);

  const changeCurrency = (newCurrency) => {
    if (EXCHANGE_RATES[newCurrency]) {
      setCurrency(newCurrency);
      localStorage.setItem('techvibe_currency', newCurrency);
    }
  };

  const convertPrice = (priceInAzn) => {
    if (!priceInAzn) return 0;
    const rate = EXCHANGE_RATES[currency] || 1;
    return (priceInAzn * rate).toFixed(2);
  };

  const formatPrice = (priceInAzn) => {
    const converted = convertPrice(priceInAzn);
    return `${converted} ${SYMBOLS[currency]}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, changeCurrency, convertPrice, formatPrice, symbols: SYMBOLS }}>
      {children}
    </CurrencyContext.Provider>
  );
};
