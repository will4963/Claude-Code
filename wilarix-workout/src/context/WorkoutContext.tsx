import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { UserProgress, CompletedWorkout, WeightEntry, SessionNote } from '../types';
import { getProgress, saveProgress } from '../utils/storage';
import { useAuth } from './AuthContext';

interface WorkoutContextType {
  progress: UserProgress | null;
  loadProgress: () => void;
  markSessionComplete: (sessionId: string, sessionName: string, durationMinutes: number) => void;
  addWeightEntry: (weight: number, unit: 'kg' | 'lbs') => void;
  addSessionNote: (sessionId: string, sessionName: string, note: string) => void;
  deleteWeightEntry: (id: string) => void;
}

const WorkoutContext = createContext<WorkoutContextType | null>(null);

export function WorkoutProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [progress, setProgress] = useState<UserProgress | null>(
    () => (user ? getProgress(user.id) : null)
  );

  const loadProgress = useCallback(() => {
    if (user) setProgress(getProgress(user.id));
  }, [user]);

  function markSessionComplete(sessionId: string, sessionName: string, durationMinutes: number) {
    if (!user) return;
    const current = getProgress(user.id);
    const today = new Date().toISOString().split('T')[0];
    const lastDate = current.lastWorkoutDate;
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    let streak = current.streak;
    if (lastDate === today) {
      // already worked out today, streak unchanged
    } else if (lastDate === yesterday) {
      streak += 1;
    } else {
      streak = 1;
    }

    const completed: CompletedWorkout = {
      id: crypto.randomUUID(),
      sessionId,
      sessionName,
      completedAt: new Date().toISOString(),
      durationMinutes,
    };

    const updated: UserProgress = {
      ...current,
      completedWorkouts: [completed, ...current.completedWorkouts],
      streak,
      lastWorkoutDate: today,
    };
    saveProgress(updated);
    setProgress(updated);
  }

  function addWeightEntry(weight: number, unit: 'kg' | 'lbs') {
    if (!user) return;
    const current = getProgress(user.id);
    const entry: WeightEntry = {
      id: crypto.randomUUID(),
      date: new Date().toISOString().split('T')[0],
      weight,
      unit,
    };
    const updated = { ...current, weightEntries: [entry, ...current.weightEntries] };
    saveProgress(updated);
    setProgress(updated);
  }

  function deleteWeightEntry(id: string) {
    if (!user) return;
    const current = getProgress(user.id);
    const updated = { ...current, weightEntries: current.weightEntries.filter(e => e.id !== id) };
    saveProgress(updated);
    setProgress(updated);
  }

  function addSessionNote(sessionId: string, sessionName: string, note: string) {
    if (!user) return;
    const current = getProgress(user.id);
    const entry: SessionNote = {
      id: crypto.randomUUID(),
      sessionId,
      sessionName,
      note,
      date: new Date().toISOString(),
    };
    const updated = { ...current, sessionNotes: [entry, ...current.sessionNotes] };
    saveProgress(updated);
    setProgress(updated);
  }

  return (
    <WorkoutContext.Provider value={{
      progress,
      loadProgress,
      markSessionComplete,
      addWeightEntry,
      addSessionNote,
      deleteWeightEntry,
    }}>
      {children}
    </WorkoutContext.Provider>
  );
}

export function useWorkout() {
  const ctx = useContext(WorkoutContext);
  if (!ctx) throw new Error('useWorkout must be used within WorkoutProvider');
  return ctx;
}
