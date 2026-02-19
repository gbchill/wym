import Papa from 'papaparse';
import type { TransactionSource } from '../../src/types/index.js';
import { categorize } from './categorizer.js';

export interface ParsedTransaction {
  date: string; // YYYY-MM-DD
  merchant: string;
  amount: number;
  category: string;
  source: TransactionSource;
  raw_description: string;
}

function convertDate(mmddyyyy: string): string {
  const [month, day, year] = mmddyyyy.trim().split('/');
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
}

function cleanAmount(raw: string): number {
  // Strip quotes, commas, spaces
  return parseFloat(String(raw).replace(/[",\s]/g, ''));
}

function cleanMerchant(raw: string): string {
  return raw
    .trim()
    .replace(/\s{2,}/g, ' ')
    .replace(/[*#]/g, '')
    .trim();
}

export function parseCSV(
  text: string,
  source: TransactionSource
): ParsedTransaction[] {
  if (source === 'bofa-checking') {
    return parseBofaChecking(text);
  } else if (source === 'bofa-credit') {
    return parseBofaCredit(text);
  } else if (source === 'capitalone') {
    return parseCapitalOne(text);
  }
  throw new Error(`Unknown source: ${source}`);
}

function parseBofaChecking(text: string): ParsedTransaction[] {
  // File has metadata rows before the header row.
  // Scan lines to find the row starting with "Date" then parse from there.
  const lines = text.split('\n');
  let headerIndex = -1;

  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();
    if (trimmed.startsWith('"Date"') || trimmed.startsWith('Date,')) {
      headerIndex = i;
      break;
    }
  }

  if (headerIndex === -1) {
    throw new Error('BofA Checking: could not find header row starting with "Date"');
  }

  const csvSlice = lines.slice(headerIndex).join('\n');

  const result = Papa.parse<Record<string, string>>(csvSlice, {
    header: true,
    skipEmptyLines: true,
  });

  const transactions: ParsedTransaction[] = [];

  for (const row of result.data) {
    const rawDate = row['Date'];
    const description = row['Description'];
    const rawAmount = row['Amount'];

    if (!rawDate || !description || rawAmount === undefined || rawAmount === '') {
      continue;
    }

    const amount = cleanAmount(rawAmount);

    // Skip positive amounts (income, Zelle payments in)
    if (amount >= 0) continue;

    const merchant = cleanMerchant(description);
    const date = convertDate(rawDate);

    transactions.push({
      date,
      merchant,
      amount: Math.abs(amount),
      category: categorize(description),
      source: 'bofa-checking',
      raw_description: description.trim(),
    });
  }

  return transactions;
}

function parseBofaCredit(text: string): ParsedTransaction[] {
  const result = Papa.parse<Record<string, string>>(text, {
    header: true,
    skipEmptyLines: true,
  });

  const transactions: ParsedTransaction[] = [];

  for (const row of result.data) {
    const rawDate = row['Posted Date'];
    const payee = row['Payee'];
    const rawAmount = row['Amount'];

    if (!rawDate || !payee || rawAmount === undefined || rawAmount === '') {
      continue;
    }

    const amount = parseFloat(rawAmount);
    if (isNaN(amount)) continue;

    // Skip positive amounts (payments/refunds)
    if (amount >= 0) continue;

    const merchant = cleanMerchant(payee);
    const date = convertDate(rawDate);

    transactions.push({
      date,
      merchant,
      amount: Math.abs(amount),
      category: categorize(payee),
      source: 'bofa-credit',
      raw_description: payee.trim(),
    });
  }

  return transactions;
}

function parseCapitalOne(text: string): ParsedTransaction[] {
  const result = Papa.parse<Record<string, string>>(text, {
    header: true,
    skipEmptyLines: true,
  });

  const transactions: ParsedTransaction[] = [];

  for (const row of result.data) {
    const rawDate = row['Transaction Date'];
    const description = row['Description'];
    const debit = row['Debit'];
    const capCategory = row['Category'];

    if (!rawDate || !description) continue;

    // Skip payments/credits
    if (!debit || debit.trim() === '') continue;
    if (capCategory && capCategory.trim() === 'Payment/Credit') continue;

    const amount = parseFloat(debit);
    if (isNaN(amount) || amount <= 0) continue;

    // Capital One dates are already YYYY-MM-DD
    const date = rawDate.trim();
    const merchant = cleanMerchant(description);

    transactions.push({
      date,
      merchant,
      amount,
      category: categorize(description),
      source: 'capitalone',
      raw_description: description.trim(),
    });
  }

  return transactions;
}
