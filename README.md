# KPR Calculator

A lightweight React + Vite app for KPR simulation with local browser persistence and optional Supabase cloud sync.

## Local database

The app uses IndexedDB via Dexie for local storage. This is the default and works without any backend.

## Optional cloud sync

Add these environment variables in a `.env.local` file:

```bash
VITE_SUPABASE_URL="https://your-project.supabase.co"
VITE_SUPABASE_ANON_KEY="your-anon-key"
```

Then run the SQL in `supabase/schema.sql` in your Supabase SQL editor.

## Development

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
```
