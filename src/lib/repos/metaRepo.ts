import { db } from '../db/db';

export const metaRepo = {
  async get<T>(key: string): Promise<T | undefined> {
    const record = await db.meta.get(key);
    return record?.value as T | undefined;
  },

  async set(key: string, value: unknown): Promise<void> {
    await db.meta.put({ key, value });
  },

  async remove(key: string): Promise<void> {
    await db.meta.delete(key);
  },

  async getActiveSessionId(): Promise<string | undefined> {
    return this.get<string>('activeSessionId');
  },

  async setActiveSessionId(id: string): Promise<void> {
    await this.set('activeSessionId', id);
  },

  async clearActiveSessionId(): Promise<void> {
    await this.remove('activeSessionId');
  },
};
