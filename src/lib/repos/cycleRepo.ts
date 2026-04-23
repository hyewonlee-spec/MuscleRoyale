import { db } from '../db/db';
import type { CycleEntry } from '../types';
import { makeId } from '../utils/ids';

export const cycleRepo = {
  async getCycleEntryByDate(date: string): Promise<CycleEntry | undefined> {
    return db.cycleEntries.where('date').equals(date).first();
  },

  async upsertCycleEntryByDate(date: string, patch: Partial<CycleEntry>): Promise<CycleEntry> {
    const now = new Date().toISOString();
    const existing = await this.getCycleEntryByDate(date);
    const record: CycleEntry = {
      id: existing?.id ?? makeId(),
      date,
      cycleDay: existing?.cycleDay,
      phase: existing?.phase ?? 'unknown',
      bleedingLevel: existing?.bleedingLevel,
      cramps: existing?.cramps,
      mood: existing?.mood,
      bloating: existing?.bloating,
      libido: existing?.libido,
      symptoms: existing?.symptoms ?? [],
      notes: existing?.notes,
      isPrediction: false,
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
      ...existing,
      ...patch,
    };

    await db.cycleEntries.put(record);
    return record;
  },

  async listRecentCycleEntries(limit = 14): Promise<CycleEntry[]> {
    return db.cycleEntries.orderBy('date').reverse().limit(limit).toArray();
  },
};
