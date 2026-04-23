import Dexie, { Table } from 'dexie';
import type {
  AppSettings,
  BackupRecord,
  BodyMetric,
  CycleEntry,
  DailyCheckin,
  Exercise,
  MetaRecord,
  Profile,
  ProgressNote,
  SetLog,
  WorkoutSession,
  WorkoutSessionItem,
  WorkoutTemplate,
  WorkoutTemplateItem,
} from '../types';
import { makeId } from '../utils/ids';

const APP_VERSION = '0.1.0';
const SCHEMA_VERSION = 1;

export class MuscleRoyaltyDB extends Dexie {
  profile!: Table<Profile, string>;
  appSettings!: Table<AppSettings, string>;
  exercises!: Table<Exercise, string>;
  workoutTemplates!: Table<WorkoutTemplate, string>;
  workoutTemplateItems!: Table<WorkoutTemplateItem, string>;
  dailyCheckins!: Table<DailyCheckin, string>;
  cycleEntries!: Table<CycleEntry, string>;
  workoutSessions!: Table<WorkoutSession, string>;
  workoutSessionItems!: Table<WorkoutSessionItem, string>;
  setLogs!: Table<SetLog, string>;
  bodyMetrics!: Table<BodyMetric, string>;
  progressNotes!: Table<ProgressNote, string>;
  backups!: Table<BackupRecord, string>;
  meta!: Table<MetaRecord, string>;

  constructor() {
    super('muscle-royalty-db');
    this.version(1).stores({
      profile: 'id',
      appSettings: 'id',
      exercises: 'id, name, category, movementPattern, isArchived, updatedAt',
      workoutTemplates: 'id, name, isFavorite, isArchived, updatedAt',
      workoutTemplateItems: 'id, templateId, orderIndex, exerciseId',
      dailyCheckins: 'id, date, updatedAt',
      cycleEntries: 'id, date, phase, isPrediction, updatedAt',
      workoutSessions: 'id, date, status, templateId, startTime, updatedAt',
      workoutSessionItems: 'id, sessionId, orderIndex, exerciseId',
      setLogs: 'id, sessionId, sessionItemId, exerciseId, setNumber, orderIndex, updatedAt',
      bodyMetrics: 'id, date, updatedAt',
      progressNotes: 'id, date, type, updatedAt',
      backups: 'id, createdAt, kind',
      meta: 'key',
    });
  }
}

export const db = new MuscleRoyaltyDB();

const defaultExercises = [
  { name: 'Leg Press', movementPattern: 'squat', equipment: 'machine', category: 'strength' },
  { name: 'Romanian Deadlift', movementPattern: 'hinge', equipment: 'barbell', category: 'strength' },
  { name: 'Seated Row', movementPattern: 'pull', equipment: 'cable', category: 'strength' },
  { name: 'Chest Press', movementPattern: 'push', equipment: 'machine', category: 'strength' },
  { name: 'Shoulder Press', movementPattern: 'push', equipment: 'dumbbell', category: 'strength' },
].map((item) => ({
  id: makeId(),
  ...item,
  primaryMuscles: [],
  secondaryMuscles: [],
  unilateral: false,
  tracksWeight: true,
  tracksReps: true,
  tracksDuration: false,
  isArchived: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
})) as Exercise[];

export async function initialiseApp(): Promise<void> {
  await db.open();

  const firstRun = await db.meta.get('firstRunCompleted');
  if (firstRun) {
    await db.meta.put({ key: 'lastOpenedAt', value: new Date().toISOString() });
    return;
  }

  const now = new Date().toISOString();

  await db.transaction(
    'rw',
    db.profile,
    db.appSettings,
    db.exercises,
    db.meta,
    async () => {
      await db.profile.put({
        id: 'primary',
        displayName: 'Hyewon',
        createdAt: now,
        updatedAt: now,
        units: 'kg',
        lengthUnit: 'cm',
        weekStartsOn: 1,
        cycleTrackingEnabled: true,
        defaultSessionView: 'resume-first',
      });

      await db.appSettings.put({
        id: 'primary',
        theme: 'system',
        keepScreenAwakeDuringWorkout: true,
        defaultRestSeconds: 90,
        autoAdvanceAfterSet: false,
        confirmBeforeFinishWorkout: true,
        showCycleInsights: true,
        showReadinessScore: true,
        exportFormatDefault: 'json',
        updatedAt: now,
      });

      await db.exercises.bulkPut(defaultExercises);

      await db.meta.bulkPut([
        { key: 'schemaVersion', value: SCHEMA_VERSION },
        { key: 'appVersion', value: APP_VERSION },
        { key: 'firstRunCompleted', value: true },
        { key: 'lastOpenedAt', value: now },
      ]);
    },
  );
}

export const appMeta = {
  appVersion: APP_VERSION,
  schemaVersion: SCHEMA_VERSION,
};
