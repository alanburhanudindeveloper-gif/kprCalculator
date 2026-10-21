import Dexie, { Table } from 'dexie';
import { KprParameters, PaymentInterval, SimulationMode } from '../types/kpr';
import { UserFinancialProfile } from '../types/financialHealth';

export type ThemePreference = 'dark' | 'light';

export interface CalculatorSnapshot {
  params: KprParameters;
  extraAnnual: number;
  interval: PaymentInterval;
  mode: SimulationMode;
  updatedAt: number;
}

export interface SimulationHistoryEntry {
  id?: number;
  params: KprParameters;
  extraAnnual: number;
  interval: PaymentInterval;
  mode: SimulationMode;
  savedAt: number;
}

export type AppSettingKey = 'calculatorSnapshot' | 'financialProfile' | 'themePreference';

interface StoredSetting {
  key: AppSettingKey;
  value: string;
  updatedAt: number;
}

class KprDatabase extends Dexie {
  settings!: Table<StoredSetting, string>;
  history!: Table<SimulationHistoryEntry, number>;

  constructor() {
    super('kprCalculatorDB');
    this.version(2).stores({
      settings: '&key, updatedAt',
      history: '++id, savedAt',
    });
  }
}

export const db = new KprDatabase();

function parseStoredValue<T>(value: string | undefined, fallback: T): T | null {
  if (!value) return fallback;

  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export async function saveCalculatorSnapshot(snapshot: CalculatorSnapshot): Promise<void> {
  if (typeof window === 'undefined') return;

  try {
    await db.settings.put({
      key: 'calculatorSnapshot',
      value: JSON.stringify(snapshot),
      updatedAt: Date.now(),
    });
  } catch (error) {
    console.warn('Failed to save calculator snapshot to IndexedDB:', error);
  }
}

export async function loadCalculatorSnapshot(): Promise<CalculatorSnapshot | null> {
  if (typeof window === 'undefined') return null;

  try {
    const row = await db.settings.get('calculatorSnapshot');
    if (!row) return null;
    return parseStoredValue<CalculatorSnapshot | null>(row.value, null);
  } catch (error) {
    console.warn('Failed to load calculator snapshot from IndexedDB:', error);
    return null;
  }
}

export async function clearCalculatorSnapshot(): Promise<void> {
  if (typeof window === 'undefined') return;

  try {
    await db.settings.delete('calculatorSnapshot');
  } catch (error) {
    console.warn('Failed to clear calculator snapshot from IndexedDB:', error);
  }
}

export async function saveSimulationHistoryEntry(entry: Omit<SimulationHistoryEntry, 'id'>): Promise<void> {
  if (typeof window === 'undefined') return;

  try {
    const items = await db.history.orderBy('savedAt').reverse().limit(9).toArray();
    const newestIds = items.map((item) => item.id).filter((id): id is number => typeof id === 'number');

    if (newestIds.length >= 9) {
      await db.history.bulkDelete(newestIds.slice(8));
    }

    await db.history.add({
      ...entry,
      savedAt: entry.savedAt ?? Date.now(),
    });
  } catch (error) {
    console.warn('Failed to save simulation history entry to IndexedDB:', error);
  }
}

export async function loadSimulationHistory(): Promise<SimulationHistoryEntry[]> {
  if (typeof window === 'undefined') return [];

  try {
    return await db.history.orderBy('savedAt').reverse().limit(10).toArray();
  } catch (error) {
    console.warn('Failed to load simulation history from IndexedDB:', error);
    return [];
  }
}

export async function clearAllSavedData(): Promise<void> {
  if (typeof window === 'undefined') return;

  try {
    await Promise.all([
      db.settings.clear(),
      db.history.clear(),
    ]);
  } catch (error) {
    console.warn('Failed to clear all saved local database data:', error);
  }
}

export async function saveFinancialProfile(profile: UserFinancialProfile): Promise<void> {
  if (typeof window === 'undefined') return;

  try {
    await db.settings.put({
      key: 'financialProfile',
      value: JSON.stringify(profile),
      updatedAt: Date.now(),
    });
  } catch (error) {
    console.warn('Failed to save financial profile to IndexedDB:', error);
  }
}

export async function loadFinancialProfile(): Promise<UserFinancialProfile | null> {
  if (typeof window === 'undefined') return null;

  try {
    const row = await db.settings.get('financialProfile');
    if (!row) return null;
    return parseStoredValue<UserFinancialProfile | null>(row.value, null);
  } catch (error) {
    console.warn('Failed to load financial profile from IndexedDB:', error);
    return null;
  }
}

export async function clearFinancialProfile(): Promise<void> {
  if (typeof window === 'undefined') return;

  try {
    await db.settings.delete('financialProfile');
  } catch (error) {
    console.warn('Failed to clear financial profile from IndexedDB:', error);
  }
}

export async function saveThemePreference(theme: ThemePreference): Promise<void> {
  if (typeof window === 'undefined') return;

  try {
    await db.settings.put({
      key: 'themePreference',
      value: JSON.stringify(theme),
      updatedAt: Date.now(),
    });
  } catch (error) {
    console.warn('Failed to save theme preference to IndexedDB:', error);
  }
}

export async function loadThemePreference(): Promise<ThemePreference | null> {
  if (typeof window === 'undefined') return null;

  try {
    const row = await db.settings.get('themePreference');
    if (!row) return null;
    return parseStoredValue<ThemePreference | null>(row.value, null);
  } catch (error) {
    console.warn('Failed to load theme preference from IndexedDB:', error);
    return null;
  }
}
