import { useEffect, useMemo, useState } from 'react';
import type { AppSettings, CycleEntry, DailyCheckin, Profile, WorkoutSession } from '../lib/types';
import { checkinRepo } from '../lib/repos/checkinRepo';
import { cycleRepo } from '../lib/repos/cycleRepo';
import { workoutRepo } from '../lib/repos/workoutRepo';
import { profileRepo } from '../lib/repos/profileRepo';
import { settingsRepo } from '../lib/repos/settingsRepo';
import { getTodayDate } from '../lib/utils/date';
import { readinessService } from '../lib/services/readinessService';

export function useTodayData() {
  const [checkin, setCheckin] = useState<DailyCheckin | undefined>();
  const [cycleEntry, setCycleEntry] = useState<CycleEntry | undefined>();
  const [activeSession, setActiveSession] = useState<WorkoutSession | undefined>();
  const [profile, setProfile] = useState<Profile | undefined>();
  const [settings, setSettings] = useState<AppSettings | undefined>();
  const [loading, setLoading] = useState(true);

  async function reload() {
    setLoading(true);
    const date = getTodayDate();
    const [nextCheckin, nextCycle, nextSession, nextProfile, nextSettings] = await Promise.all([
      checkinRepo.getCheckinByDate(date),
      cycleRepo.getCycleEntryByDate(date),
      workoutRepo.getActiveSession(),
      profileRepo.getProfile(),
      settingsRepo.getSettings(),
    ]);
    setCheckin(nextCheckin);
    setCycleEntry(nextCycle);
    setActiveSession(nextSession);
    setProfile(nextProfile);
    setSettings(nextSettings);
    setLoading(false);
  }

  useEffect(() => {
    reload();
  }, []);

  const readiness = useMemo(() => readinessService.calculateReadiness(checkin ?? {}), [checkin]);

  async function updateCheckin(patch: Partial<DailyCheckin>) {
    const updated = await checkinRepo.upsertCheckinByDate(getTodayDate(), patch);
    setCheckin(updated);
  }

  return {
    loading,
    checkin,
    cycleEntry,
    activeSession,
    profile,
    settings,
    readiness,
    updateCheckin,
    reload,
  };
}
