// utils/transaction-date.ts
const TRANSACTION_DATE_KEY = 'app-transaction-date';

export const getSessionTransactionDate = (): Date => {
  if (typeof window === 'undefined') return new Date();

  const storedDate = sessionStorage.getItem(TRANSACTION_DATE_KEY);
  return storedDate ? new Date(storedDate) : new Date();
};

export const setSessionTransactionDate = (date: Date): void => {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem(TRANSACTION_DATE_KEY, date.toISOString());
};