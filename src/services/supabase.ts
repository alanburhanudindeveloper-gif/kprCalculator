import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { SimulationHistoryEntry } from './localDb';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const hasSupabaseConfig = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase: SupabaseClient | null = hasSupabaseConfig
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : null;

export async function syncSimulationToSupabase(entry: Omit<SimulationHistoryEntry, 'id'>): Promise<boolean> {
  if (!supabase) return false;

  try {
    const { error } = await supabase.from('kpr_simulations').insert([
      {
        ...entry,
        params: JSON.stringify(entry.params),
        saved_at: new Date(entry.savedAt).toISOString(),
      },
    ]);

    if (error) {
      console.warn('Supabase sync failed:', error.message);
      return false;
    }

    return true;
  } catch (error) {
    console.warn('Supabase connection error:', error);
    return false;
  }
}

export async function fetchSupabaseHistory(): Promise<SimulationHistoryEntry[]> {
  if (!supabase) return [];

  try {
    const { data, error } = await supabase
      .from('kpr_simulations')
      .select('*')
      .order('saved_at', { ascending: false })
      .limit(10);

    if (error) {
      console.warn('Supabase fetch failed:', error.message);
      return [];
    }

    return (data ?? []).map((row) => ({
      id: Number(row.id),
      params: typeof row.params === 'string' ? JSON.parse(row.params) : row.params,
      extraAnnual: Number(row.extra_annual ?? row.extraAnnual ?? 0),
      interval: Number(row.interval ?? 12),
      mode: row.mode ?? 'A',
      savedAt: new Date(row.saved_at ?? Date.now()).getTime(),
    }));
  } catch (error) {
    console.warn('Supabase read error:', error);
    return [];
  }
}
