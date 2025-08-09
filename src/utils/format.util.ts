/**
 * Formats a number as Bangladeshi Taka (৳) with default settings
 * - Always shows currency symbol
 * - Always uses 2 decimal places
 * - No compact notation
 * @param amount The number to format
 * @returns Formatted currency string (e.g. "৳1,234.56")
 */
export const formatAsTaka = (amount: number): string => {
  return new Intl.NumberFormat('en-BD', {
    style: 'currency',
    currency: 'BDT',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};