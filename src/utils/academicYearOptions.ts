// Shared academic year dropdown options: Gregorian | Hijri (Arabic numerals)

// Arabic-Indic numerals (٠١٢٣٤٥٦٧٨٩) for Hijri display
export const toArabicNumeral = (str: string) =>
  String(str).replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[parseInt(d, 10)]);

// Gregorian year → Hijri year (Umm al-Qura calendar, mid-year for stability)
export const getHijriYear = (gregorianYear: number): number => {
  const date = new Date(gregorianYear, 5, 1);
  const hijriStr = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura', {
    year: 'numeric',
  }).format(date);
  return parseInt(hijriStr, 10);
};

// Start = current year - 1, then 5 years; label: Gregorian (EN) | Hijri (AR)
export const ACADEMIC_YEAR_OPTIONS = (() => {
  const startYear = new Date().getFullYear() - 1;
  return Array.from({ length: 5 }, (_, i) => {
    const year = startYear + i;
    const hijriYear = getHijriYear(year);
    return {
      value: year,
      label: `${year}  |  ${toArabicNumeral(String(hijriYear))}`,
    };
  });
})();

