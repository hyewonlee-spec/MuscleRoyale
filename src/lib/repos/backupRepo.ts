import { db, appMeta } from '../db/db';
import type { AppExport, BackupRecord } from '../types';
import { makeId } from '../utils/ids';

export const backupRepo = {
  async listBackupRecords(): Promise<BackupRecord[]> {
    return db.backups.orderBy('createdAt').reverse().toArray();
  },

  async createBackupRecord(
    kind: 'export' | 'import',
    counts: Record<string, number>,
    fileName?: string,
  ): Promise<void> {
    await db.backups.add({
      id: makeId(),
      createdAt: new Date().toISOString(),
      kind,
      format: 'json',
      fileName,
      appVersion: appMeta.appVersion,
      schemaVersion: appMeta.schemaVersion,
      itemCounts: counts,
    });
  },

  async buildFullExport(): Promise<AppExport> {
    return {
      app: 'Muscle Royalty',
      exportedAt: new Date().toISOString(),
      appVersion: appMeta.appVersion,
      schemaVersion: appMeta.schemaVersion,
      data: {
        profile: await db.profile.toArray(),
        appSettings: await db.appSettings.toArray(),
        exercises: await db.exercises.toArray(),
        workoutTemplates: await db.workoutTemplates.toArray(),
        workoutTemplateItems: await db.workoutTemplateItems.toArray(),
        dailyCheckins: await db.dailyCheckins.toArray(),
        cycleEntries: await db.cycleEntries.toArray(),
        workoutSessions: await db.workoutSessions.toArray(),
        workoutSessionItems: await db.workoutSessionItems.toArray(),
        setLogs: await db.setLogs.toArray(),
        bodyMetrics: await db.bodyMetrics.toArray(),
        progressNotes: await db.progressNotes.toArray(),
        backups: await db.backups.toArray(),
        meta: await db.meta.toArray(),
      },
    };
  },

  async importReplace(data: AppExport): Promise<void> {
    await db.transaction(
      'rw',
      [
        db.profile,
        db.appSettings,
        db.exercises,
        db.workoutTemplates,
        db.workoutTemplateItems,
        db.dailyCheckins,
        db.cycleEntries,
        db.workoutSessions,
        db.workoutSessionItems,
        db.setLogs,
        db.bodyMetrics,
        db.progressNotes,
        db.backups,
        db.meta,
      ],
      async () => {
        await Promise.all([
          db.profile.clear(),
          db.appSettings.clear(),
          db.exercises.clear(),
          db.workoutTemplates.clear(),
          db.workoutTemplateItems.clear(),
          db.dailyCheckins.clear(),
          db.cycleEntries.clear(),
          db.workoutSessions.clear(),
          db.workoutSessionItems.clear(),
          db.setLogs.clear(),
          db.bodyMetrics.clear(),
          db.progressNotes.clear(),
          db.backups.clear(),
          db.meta.clear(),
        ]);

        await db.profile.bulkAdd(data.data.profile);
        await db.appSettings.bulkAdd(data.data.appSettings);
        await db.exercises.bulkAdd(data.data.exercises);
        await db.workoutTemplates.bulkAdd(data.data.workoutTemplates);
        await db.workoutTemplateItems.bulkAdd(data.data.workoutTemplateItems);
        await db.dailyCheckins.bulkAdd(data.data.dailyCheckins);
        await db.cycleEntries.bulkAdd(data.data.cycleEntries);
        await db.workoutSessions.bulkAdd(data.data.workoutSessions);
        await db.workoutSessionItems.bulkAdd(data.data.workoutSessionItems);
        await db.setLogs.bulkAdd(data.data.setLogs);
        await db.bodyMetrics.bulkAdd(data.data.bodyMetrics);
        await db.progressNotes.bulkAdd(data.data.progressNotes);
        await db.backups.bulkAdd(data.data.backups);
        await db.meta.bulkAdd(data.data.meta);
      },
    );
  },

  countTables(data: AppExport['data']): Record<string, number> {
    return Object.fromEntries(
      Object.entries(data).map(([key, value]) => [key, value.length]),
    );
  },
};
