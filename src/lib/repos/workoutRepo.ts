import { db } from '../db/db';
import type { Exercise, SetLog, WorkoutSession, WorkoutSessionItem } from '../types';
import { formatDuration, getTodayDate, secondsBetween } from '../utils/date';
import { makeId } from '../utils/ids';
import { metaRepo } from './metaRepo';

export const workoutRepo = {
  async getActiveSession(): Promise<WorkoutSession | undefined> {
    const activeId = await metaRepo.getActiveSessionId();
    if (activeId) {
      const byId = await db.workoutSessions.get(activeId);
      if (byId?.status === 'active') return byId;
    }
    return db.workoutSessions.where('status').equals('active').first();
  },

  async startQuickSession(title = 'Today’s workout'): Promise<WorkoutSession> {
    const now = new Date().toISOString();
    const session: WorkoutSession = {
      id: makeId(),
      date: getTodayDate(),
      startTime: now,
      status: 'active',
      title,
      createdAt: now,
      updatedAt: now,
    };
    await db.workoutSessions.put(session);
    await metaRepo.setActiveSessionId(session.id);
    return session;
  },

  async addSessionItem(sessionId: string, exercise: Exercise): Promise<WorkoutSessionItem> {
    const existing = await db.workoutSessionItems.where('sessionId').equals(sessionId).toArray();
    const now = new Date().toISOString();
    const item: WorkoutSessionItem = {
      id: makeId(),
      sessionId,
      exerciseId: exercise.id,
      orderIndex: existing.length,
      exerciseNameSnapshot: exercise.name,
      isSkipped: false,
      createdAt: now,
      updatedAt: now,
    };
    await db.workoutSessionItems.put(item);
    return item;
  },

  async getSessionItems(sessionId: string): Promise<WorkoutSessionItem[]> {
    return db.workoutSessionItems.where('sessionId').equals(sessionId).sortBy('orderIndex');
  },

  async getSetLogs(sessionId: string): Promise<SetLog[]> {
    return db.setLogs.where('sessionId').equals(sessionId).sortBy('orderIndex');
  },

  async addSetLog(sessionId: string, sessionItemId: string, exerciseId: string): Promise<SetLog> {
    const currentSets = await db.setLogs.where('sessionItemId').equals(sessionItemId).toArray();
    const now = new Date().toISOString();
    const log: SetLog = {
      id: makeId(),
      sessionId,
      sessionItemId,
      exerciseId,
      setNumber: currentSets.length + 1,
      orderIndex: currentSets.length,
      type: 'working',
      weight: undefined,
      reps: undefined,
      completed: false,
      createdAt: now,
      updatedAt: now,
    };
    await db.setLogs.put(log);
    return log;
  },

  async updateSetLog(id: string, patch: Partial<SetLog>): Promise<void> {
    const current = await db.setLogs.get(id);
    if (!current) return;
    await db.setLogs.put({
      ...current,
      ...patch,
      updatedAt: new Date().toISOString(),
    });
  },

  async updateSession(id: string, patch: Partial<WorkoutSession>): Promise<void> {
    const current = await db.workoutSessions.get(id);
    if (!current) return;
    await db.workoutSessions.put({ ...current, ...patch, updatedAt: new Date().toISOString() });
  },

  async finishSession(sessionId: string): Promise<void> {
    const current = await db.workoutSessions.get(sessionId);
    if (!current) return;
    const endTime = new Date().toISOString();
    await db.workoutSessions.put({
      ...current,
      endTime,
      status: 'completed',
      durationSeconds: secondsBetween(current.startTime, endTime),
      updatedAt: endTime,
    });
    await metaRepo.clearActiveSessionId();
  },

  async abandonSession(sessionId: string): Promise<void> {
    const current = await db.workoutSessions.get(sessionId);
    if (!current) return;
    await db.workoutSessions.put({
      ...current,
      status: 'abandoned',
      endTime: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    await metaRepo.clearActiveSessionId();
  },

  async getSessionSummary(sessionId: string): Promise<{
    session?: WorkoutSession;
    items: WorkoutSessionItem[];
    setLogs: SetLog[];
  }> {
    const session = await db.workoutSessions.get(sessionId);
    const items = await this.getSessionItems(sessionId);
    const setLogs = await this.getSetLogs(sessionId);
    return { session, items, setLogs };
  },

  async listRecentSessions(limit = 8): Promise<WorkoutSession[]> {
    return db.workoutSessions.orderBy('date').reverse().limit(limit).toArray();
  },

  describeSession(session: WorkoutSession): string {
    if (session.durationSeconds) return formatDuration(session.durationSeconds);
    return 'In progress';
  },
};
