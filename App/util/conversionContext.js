import React, { createContext, useState } from "react";

export const ConversionContext = createContext();

export const ConversionContextProvider = ({ children }) => {
  const [baseCurrency, setBaseCurrency] = useState("IDR");
  const [quoteCurrency, setQuoteCurrency] = useState("USD");

  const swapCurrencies = () => {
    setBaseCurrency(quoteCurrency);
    setQuoteCurrency(baseCurrency);
  };

  const contextValue = {
    baseCurrency,
    quoteCurrency,
    setBaseCurrency,
    setQuoteCurrency,
    swapCurrencies,
  };

  return (
    <ConversionContext.Provider value={contextValue}>
      {children}
    </ConversionContext.Provider>
  );
};
