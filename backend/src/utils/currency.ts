export const koboToNaira = (kobo: number): number => {
  return Math.round(kobo / 100);
};

export const nairaToKobo = (naira: number): number => {
  return Math.round(naira * 100);
};

export const formatNaira = (koboOrNaira: number, isKobo: boolean = false): string => {
  const amount = isKobo ? Math.round(koboOrNaira / 100) : koboOrNaira;
  return `₦${amount.toLocaleString('en-NG')}`;
};
