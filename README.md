# WYM — Where's Your Money?

A personal finance analyzer that imports Bank of America and Capital One CSV exports, categorizes transactions, and visualizes spending trends.

## Prerequisites

- Node.js 18+
- npm

## Setup

```bash
npm install
```

## Running the App

```bash
npm run dev
```

This starts both servers concurrently:
- **Frontend** (Vite): http://localhost:5173
- **API** (Express): http://localhost:3001

The SQLite database (`wym.db`) is created automatically on first run.

## Individual servers

```bash
npm run dev:client   # Vite frontend only
npm run dev:server   # Express API only
```




- React 19 + TypeScript + Vite + Tailwind CSS v4
- Node/Express API on port 3001
- SQLite via better-sqlite3 (local file, no setup needed)
- Recharts for visualizations


```bash
npm run build        # Frontend (outputs to dist/)
npm run build:server # Backend (outputs to dist-server/)
```
