import { Router } from 'express';
import multer from 'multer';
import crypto from 'crypto';
import { getDb } from '../db.js';
import { parseCSV } from '../utils/csvParser.js';
import type { TransactionSource } from '../../src/types/index.js';
import type { UploadResult } from '../../src/types/index.js';

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!file.originalname.endsWith('.csv') && file.mimetype !== 'text/csv') {
      cb(new Error('Only CSV files are allowed'));
      return;
    }
    cb(null, true);
  },
});

router.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    res.status(400).json({ error: 'No file uploaded' });
    return;
  }

  const source = req.body.source as TransactionSource;
  const validSources: TransactionSource[] = ['bofa-checking', 'bofa-credit', 'capitalone'];
  if (!validSources.includes(source)) {
    res.status(400).json({ error: `Invalid source. Must be one of: ${validSources.join(', ')}` });
    return;
  }

  const text = req.file.buffer.toString('utf-8');
  const result: UploadResult = { imported: 0, skipped: 0, errors: [], total: 0 };

  let parsed;
  try {
    parsed = parseCSV(text, source);
  } catch (err) {
    res.status(400).json({ error: `CSV parse error: ${(err as Error).message}` });
    return;
  }

  result.total = parsed.length;

  const db = getDb();
  const stmt = db.prepare(`
    INSERT OR IGNORE INTO transactions (id, date, merchant, amount, category, source, raw_description, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))
  `);

  const insertMany = db.transaction(() => {
    for (const t of parsed) {
      try {
        const info = stmt.run(
          crypto.randomUUID(),
          t.date,
          t.merchant,
          t.amount,
          t.category,
          t.source,
          t.raw_description
        );
        if (info.changes === 0) {
          result.skipped++;
        } else {
          result.imported++;
        }
      } catch (err) {
        result.errors.push(`Row error: ${(err as Error).message}`);
      }
    }
  });

  insertMany();

  res.json(result);
});

export default router;
