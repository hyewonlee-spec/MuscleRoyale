import { db } from '../db/db';
import type { DailyCheckin } from '../types';
import { makeId } from '../utils/ids';
import { readinessService } from '../services/readinessService';

export const checkinRepo = {
  async getCheckinByDate(date: string): Promise<DailyCheckin | undefined> {
    return db.dailyCheckins.where('date').equals(date).first();
  },

  async upsertCheckinByDate(date: string, patch: Partial<DailyCheckin>): Promise<DailyCheckin> {
    const now = new Date().toISOString();
    const existing = await this.getCheckinByDate(date);
    const merged: DailyCheckin = {
      id: existing?.id ?? makeId(),
      date,
      energy: existing?.energy,
      sleepQuality: existing?.sleepQuality,
      stress: existing?.stress,
      soreness: existing?.soreness,
      motivation: existing?.motivation,
      painPresent: existing?.painPresent ?? false,
      painAreas: existing?.painAreas ?? [],
      painNotes: existing?.painNotes,
      notes: existing?.notes,
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
      ...existing,
      ...patch,
    };

    const summary = readinessService.calculateReadiness(merged);
    merged.readinessScore = summary.score;
    merged.readinessLabel = summary.label;

    await db.dailyCheckins.put(merged);
    return merged;
  },

  async listRecentCheckins(limit = 7): Promise<DailyCheckin[]> {
    return db.dailyCheckins.orderBy('date').reverse().limit(limit).toArray();
  },
};
