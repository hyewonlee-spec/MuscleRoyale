import { useEffect, useMemo, useState } from 'react';
import type { Exercise, SetLog, WorkoutSession, WorkoutSessionItem } from '../lib/types';
import { exerciseRepo } from '../lib/repos/exerciseRepo';
import { workoutRepo } from '../lib/repos/workoutRepo';
import { formatDuration, secondsBetween } from '../lib/utils/date';

export function useActiveWorkout() {
  const [session, setSession] = useState<WorkoutSession | undefined>();
  const [items, setItems] = useState<WorkoutSessionItem[]>([]);
  const [setLogs, setSetLogs] = useState<SetLog[]>([]);
  const [availableExercises, setAvailableExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);

  async function reload() {
    setLoading(true);
    const [active, exercises] = await Promise.all([
      workoutRepo.getActiveSession(),
      exerciseRepo.listExercises(false),
    ]);
    setSession(active);
    setAvailableExercises(exercises);
    if (active) {
      const summary = await workoutRepo.getSessionSummary(active.id);
      setItems(summary.items);
      setSetLogs(summary.setLogs);
    } else {
      setItems([]);
      setSetLogs([]);
    }
    setLoading(false);
  }

  useEffect(() => {
    reload();
  }, []);

  async function startQuickSession() {
    const next = await workoutRepo.startQuickSession();
    setSession(next);
    setItems([]);
    setSetLogs([]);
  }

  async function addExercise(exercise: Exercise) {
    if (!session) return;
    const item = await workoutRepo.addSessionItem(session.id, exercise);
    setItems((current) => [...current, item]);
  }

  async function addSet(item: WorkoutSessionItem) {
    if (!session) return;
    const next = await workoutRepo.addSetLog(session.id, item.id, item.exerciseId);
    setSetLogs((current) => [...current, next]);
  }

  async function updateSet(setId: string, patch: Partial<SetLog>) {
    await workoutRepo.updateSetLog(setId, patch);
    setSetLogs((current) =>
      current.map((set) => (set.id === setId ? { ...set, ...patch } : set)),
    );
  }

  async function finishSession() {
    if (!session) return;
    await workoutRepo.finishSession(session.id);
    await reload();
  }

  async function abandonSession() {
    if (!session) return;
    await workoutRepo.abandonSession(session.id);
    await reload();
  }

  const elapsedLabel = useMemo(() => {
    if (!session) return '';
    return formatDuration(secondsBetween(session.startTime, new Date().toISOString()));
  }, [session, items, setLogs]);

  return {
    loading,
    session,
    items,
    setLogs,
    availableExercises,
    elapsedLabel,
    startQuickSession,
    addExercise,
    addSet,
    updateSet,
    finishSession,
    abandonSession,
    reload,
  };
}
