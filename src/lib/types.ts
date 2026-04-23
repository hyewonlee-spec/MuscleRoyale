export type Profile = {
  id: 'primary';
  displayName: string;
  createdAt: string;
  updatedAt: string;
  units: 'kg' | 'lb';
  lengthUnit: 'cm' | 'in';
  weekStartsOn: 0 | 1;
  cycleTrackingEnabled: boolean;
  defaultSessionView: 'template-first' | 'resume-first' | 'quick-start';
};

export type AppSettings = {
  id: 'primary';
  theme: 'system' | 'light' | 'dark';
  keepScreenAwakeDuringWorkout: boolean;
  defaultRestSeconds: number;
  autoAdvanceAfterSet: boolean;
  confirmBeforeFinishWorkout: boolean;
  showCycleInsights: boolean;
  showReadinessScore: boolean;
  exportFormatDefault: 'json';
  updatedAt: string;
};

export type Exercise = {
  id: string;
  name: string;
  category: 'strength' | 'mobility' | 'rehab' | 'cardio' | 'other';
  movementPattern:
    | 'squat'
    | 'hinge'
    | 'push'
    | 'pull'
    | 'lunge'
    | 'carry'
    | 'rotation'
    | 'core'
    | 'isolation'
    | 'other';
  equipment:
    | 'barbell'
    | 'dumbbell'
    | 'machine'
    | 'cable'
    | 'bodyweight'
    | 'band'
    | 'kettlebell'
    | 'other';
  primaryMuscles: string[];
  secondaryMuscles: string[];
  unilateral: boolean;
  tracksWeight: boolean;
  tracksReps: boolean;
  tracksDuration: boolean;
  defaultRepMin?: number;
  defaultRepMax?: number;
  defaultRestSeconds?: number;
  notes?: string;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
};

export type WorkoutTemplate = {
  id: string;
  name: string;
  description?: string;
  dayType?: string;
  isFavorite: boolean;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
};

export type WorkoutTemplateItem = {
  id: string;
  templateId: string;
  orderIndex: number;
  exerciseId: string;
  targetSets?: number;
  targetRepMin?: number;
  targetRepMax?: number;
  targetWeight?: number;
  targetRpe?: number;
  restSeconds?: number;
  notes?: string;
};

export type DailyCheckin = {
  id: string;
  date: string;
  energy?: number;
  sleepQuality?: number;
  stress?: number;
  soreness?: number;
  motivation?: number;
  painPresent: boolean;
  painAreas?: string[];
  painNotes?: string;
  readinessScore?: number;
  readinessLabel?: 'low' | 'moderate' | 'good' | 'high';
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

export type CycleEntry = {
  id: string;
  date: string;
  cycleDay?: number;
  phase?: 'menstrual' | 'follicular' | 'ovulatory' | 'luteal' | 'unknown';
  bleedingLevel?: 0 | 1 | 2 | 3;
  cramps?: number;
  mood?: number;
  bloating?: number;
  libido?: number;
  symptoms?: string[];
  notes?: string;
  isPrediction: boolean;
  createdAt: string;
  updatedAt: string;
};

export type WorkoutSession = {
  id: string;
  date: string;
  startTime: string;
  endTime?: string;
  status: 'active' | 'completed' | 'abandoned';
  title?: string;
  templateId?: string;
  linkedCheckinId?: string;
  linkedCycleEntryId?: string;
  perceivedEffort?: number;
  sessionNotes?: string;
  durationSeconds?: number;
  createdAt: string;
  updatedAt: string;
};

export type WorkoutSessionItem = {
  id: string;
  sessionId: string;
  exerciseId: string;
  orderIndex: number;
  sourceTemplateItemId?: string;
  exerciseNameSnapshot: string;
  notes?: string;
  isSkipped: boolean;
  createdAt: string;
  updatedAt: string;
};

export type SetLog = {
  id: string;
  sessionId: string;
  sessionItemId: string;
  exerciseId: string;
  setNumber: number;
  orderIndex: number;
  type: 'warmup' | 'working' | 'drop' | 'failure' | 'rehab';
  weight?: number;
  reps?: number;
  durationSeconds?: number;
  distance?: number;
  rpe?: number;
  rir?: number;
  side?: 'left' | 'right' | 'bilateral';
  completed: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

export type BodyMetric = {
  id: string;
  date: string;
  bodyWeight?: number;
  waist?: number;
  hips?: number;
  thighLeft?: number;
  thighRight?: number;
  armLeft?: number;
  armRight?: number;
  chest?: number;
  restingHeartRate?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

export type ProgressNote = {
  id: string;
  date: string;
  type: 'win' | 'issue' | 'pain' | 'milestone' | 'general';
  title: string;
  body?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
};

export type BackupRecord = {
  id: string;
  createdAt: string;
  kind: 'export' | 'import';
  format: 'json';
  fileName?: string;
  appVersion: string;
  schemaVersion: number;
  itemCounts: Record<string, number>;
  notes?: string;
};

export type MetaRecord = {
  key: string;
  value: unknown;
};

export type AppExport = {
  app: 'Muscle Royalty';
  exportedAt: string;
  appVersion: string;
  schemaVersion: number;
  data: {
    profile: Profile[];
    appSettings: AppSettings[];
    exercises: Exercise[];
    workoutTemplates: WorkoutTemplate[];
    workoutTemplateItems: WorkoutTemplateItem[];
    dailyCheckins: DailyCheckin[];
    cycleEntries: CycleEntry[];
    workoutSessions: WorkoutSession[];
    workoutSessionItems: WorkoutSessionItem[];
    setLogs: SetLog[];
    bodyMetrics: BodyMetric[];
    progressNotes: ProgressNote[];
    backups: BackupRecord[];
    meta: MetaRecord[];
  };
};
