import { db } from '../db/db';
import type { Profile } from '../types';

export const profileRepo = {
  async getProfile(): Promise<Profile | undefined> {
    return db.profile.get('primary');
  },

  async updateProfile(patch: Partial<Profile>): Promise<void> {
    const current = await db.profile.get('primary');
    if (!current) return;
    await db.profile.put({
      ...current,
      ...patch,
      updatedAt: new Date().toISOString(),
    });
  },
};
