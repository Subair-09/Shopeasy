export const formatNaira = (amount: number): string => {
  if (typeof amount !== 'number' || isNaN(amount)) {
    return '₦0';
  }
  return `₦${amount.toLocaleString('en-NG')}`;
};

export const parseNaira = (value: string): number => {
  const numericString = value.replace(/[^0-9.-]+/g, '');
  const parsed = parseFloat(numericString);
  return isNaN(parsed) ? 0 : parsed;
};
