const units = [
  '',
  'One',
  'Two',
  'Three',
  'Four',
  'Five',
  'Six',
  'Seven',
  'Eight',
  'Nine',
];

const teens = [
  'Ten',
  'Eleven',
  'Twelve',
  'Thirteen',
  'Fourteen',
  'Fifteen',
  'Sixteen',
  'Seventeen',
  'Eighteen',
  'Nineteen',
];

const tens = [
  '',
  '',
  'Twenty',
  'Thirty',
  'Forty',
  'Fifty',
  'Sixty',
  'Seventy',
  'Eighty',
  'Ninety',
];

const scales = ['', 'Thousand', 'Million', 'Billion', 'Trillion', 'Quadrillion'];

/**
 * Converts a number into words using the standard Million/Billion scale.
 * @param {number} rawNumber - The number to convert.
 * @returns {string} - The number in words.
 */
export const numberToWords = (rawNumber: number | string): string => {
  let num = Number(rawNumber);
  
  if (isNaN(num)) return '';
  if (num === 0) return 'Zero';

  const isNegative = num < 0;
  num = Math.abs(num);

  // Split into integer and fractional parts
  const parts = num.toString().split('.');
  let integerPart = Number(parts[0]);
  const fractionalPart = parts.length > 1 ? parts[1] : '';

  if (integerPart === 0) {
    let result = 'Zero';
    if (fractionalPart) {
        result += ` Point ${fractionalPart.split('').map(d => units[Number(d)] || 'Zero').join(' ')}`;
    }
    return isNegative ? `Minus ${result}` : result;
  }

  const chunkWords: string[] = [];
  let scaleIndex = 0;

  while (integerPart > 0) {
    const chunk = integerPart % 1000;
    if (chunk > 0) {
      chunkWords.push(processChunk(chunk) + (scales[scaleIndex] ? ` ${scales[scaleIndex]}` : ''));
    }
    integerPart = Math.floor(integerPart / 1000);
    scaleIndex++;
  }

  let words = chunkWords.reverse().join(' ').trim();

  // Handle fractional part (Cents or Decimals)
  if (fractionalPart) {
    // If it's effectively 2 decimal places for currency, we can read it as a number
    const fractionNumber = Number(fractionalPart.substring(0, 2).padEnd(2, '0'));
    if (fractionNumber > 0) {
      words += ` and ${processChunk(fractionNumber)} Cents`;
    }
  }

  return (isNegative ? `Minus ` : '') + words;
};

function processChunk(num: number): string {
  let str = '';

  const hundreds = Math.floor(num / 100);
  const remainder = num % 100;

  if (hundreds > 0) {
    str += `${units[hundreds]} Hundred `;
  }

  if (remainder > 0) {
    if (remainder < 10) {
      str += units[remainder];
    } else if (remainder < 20) {
      str += teens[remainder - 10];
    } else {
      const tenDigit = Math.floor(remainder / 10);
      const unitDigit = remainder % 10;
      str += tens[tenDigit];
      if (unitDigit > 0) {
        str += ` ${units[unitDigit]}`;
      }
    }
  }

  return str.trim();
}
