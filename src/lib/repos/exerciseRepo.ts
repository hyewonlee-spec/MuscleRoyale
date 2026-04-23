import { db } from '../db/db';
import type { Exercise } from '../types';
import { makeId } from '../utils/ids';

export const exerciseRepo = {
  async listExercises(includeArchived = true): Promise<Exercise[]> {
    const items = await db.exercises.toArray();
    return items
      .filter((item) => includeArchived || !item.isArchived)
      .sort((a, b) => a.name.localeCompare(b.name));
  },

  async getExercise(id: string): Promise<Exercise | undefined> {
    return db.exercises.get(id);
  },

  async createExercise(input: Pick<Exercise, 'name' | 'category' | 'movementPattern' | 'equipment'>): Promise<string> {
    const now = new Date().toISOString();
    const id = makeId();
    await db.exercises.put({
      id,
      ...input,
      primaryMuscles: [],
      secondaryMuscles: [],
      unilateral: false,
      tracksWeight: true,
      tracksReps: true,
      tracksDuration: false,
      isArchived: false,
      createdAt: now,
      updatedAt: now,
    });
    return id;
  },

  async updateExercise(id: string, patch: Partial<Exercise>): Promise<void> {
    const current = await db.exercises.get(id);
    if (!current) return;
    await db.exercises.put({ ...current, ...patch, updatedAt: new Date().toISOString() });
  },

  async archiveExercise(id: string): Promise<void> {
    await this.updateExercise(id, { isArchived: true });
  },
};
