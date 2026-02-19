import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!db) throw new Error('Database not initialized. Call initDb() first.');
  return db;
}

export function initDb(): void {
  const dbPath = path.join(__dirname, '..', 'wym.db');
  db = new Database(dbPath);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');

  runMigrations(db);
}

function runMigrations(database: Database.Database): void {
  database.exec(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      version INTEGER PRIMARY KEY,
      applied_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);

  const applied = database
    .prepare('SELECT version FROM schema_migrations')
    .all()
    .map((r: unknown) => (r as { version: number }).version);

  if (!applied.includes(1)) {
    database.exec(`
      CREATE TABLE IF NOT EXISTS categories (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        color TEXT NOT NULL
      );

      INSERT OR IGNORE INTO categories (id, name, color) VALUES
        ('food', 'Food & Dining', '#4CAF50'),
        ('transport', 'Transport', '#2196F3'),
        ('entertainment', 'Entertainment', '#9C27B0'),
        ('shopping', 'Shopping', '#FF9800'),
        ('bills', 'Bills & Utilities', '#F44336'),
        ('other', 'Other', '#9E9E9E');

      CREATE TABLE IF NOT EXISTS transactions (
        id TEXT PRIMARY KEY,
        date TEXT NOT NULL,
        merchant TEXT NOT NULL,
        amount REAL NOT NULL,
        category TEXT NOT NULL REFERENCES categories(id),
        source TEXT NOT NULL CHECK(source IN ('bofa-checking', 'bofa-credit', 'capitalone')),
        raw_description TEXT NOT NULL,
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        UNIQUE(date, raw_description, amount, source)
      );

      CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date);
      CREATE INDEX IF NOT EXISTS idx_transactions_category ON transactions(category);
      CREATE INDEX IF NOT EXISTS idx_transactions_source ON transactions(source);
      CREATE INDEX IF NOT EXISTS idx_transactions_date_category ON transactions(date, category);
    `);

    database
      .prepare('INSERT INTO schema_migrations (version) VALUES (?)')
      .run(1);
  }
}
