import { getHijriYear, toArabicNumeral } from '@/utils/academicYearOptions';

export const SESSION_OPTIONS = (() => {
  const startYear = new Date().getFullYear() - 1;
  return Array.from({ length: 5 }, (_, i) => {
    const y = startYear + i;
    const en = `${y} - ${y + 1}`;
    const hijri = `${getHijriYear(y)} - ${getHijriYear(y + 1)}`;
    return {
      value: en,
      label: `${en}  |  ${toArabicNumeral(hijri)}`,
    };
  });
})();
