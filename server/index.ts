import express from 'express';
import cors from 'cors';
import { initDb } from './db.js';
import uploadRouter from './routes/upload.js';
import transactionsRouter from './routes/transactions.js';
import summaryRouter from './routes/summary.js';

const app = express();
const PORT = 3001;

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

// Initialize database
initDb();

// Mount routes
app.use('/api', uploadRouter);
app.use('/api', transactionsRouter);
app.use('/api', summaryRouter);

// Global error handler
app.use(
  (
    err: Error,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.error(err.stack);
    res.status(500).json({ error: err.message });
  }
);

app.listen(PORT, () => {
  console.log(`WYM API server running on http://localhost:${PORT}`);
});
