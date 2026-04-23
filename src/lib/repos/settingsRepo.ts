import { db } from '../db/db';
import type { AppSettings } from '../types';

export const settingsRepo = {
  async getSettings(): Promise<AppSettings | undefined> {
    return db.appSettings.get('primary');
  },

  async updateSettings(patch: Partial<AppSettings>): Promise<void> {
    const current = await db.appSettings.get('primary');
    if (!current) return;
    await db.appSettings.put({
      ...current,
      ...patch,
      updatedAt: new Date().toISOString(),
    });
  },
};
