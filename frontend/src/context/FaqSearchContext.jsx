import React, { createContext, useContext, useState } from 'react';

const FaqSearchContext = createContext();

export function FaqSearchProvider({ children }) {
  const [faqSearch, setFaqSearch] = useState('');
  return (
    <FaqSearchContext.Provider value={{ faqSearch, setFaqSearch }}>
      {children}
    </FaqSearchContext.Provider>
  );
}

export function useFaqSearch() {
  const context = useContext(FaqSearchContext);
  if (!context) throw new Error('useFaqSearch debe usarse dentro de FaqSearchProvider');
  return context;
} 