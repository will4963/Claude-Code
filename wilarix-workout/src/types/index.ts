export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  isAdmin?: boolean;
}

export interface WeightEntry {
  id: string;
  date: string;
  weight: number;
  unit: 'kg' | 'lbs';
}

export interface SessionNote {
  id: string;
  sessionId: string;
  sessionName: string;
  note: string;
  date: string;
}

export interface CompletedWorkout {
  id: string;
  sessionId: string;
  sessionName: string;
  completedAt: string;
  durationMinutes: number;
}

export interface UserProgress {
  userId: string;
  completedWorkouts: CompletedWorkout[];
  weightEntries: WeightEntry[];
  sessionNotes: SessionNote[];
  streak: number;
  lastWorkoutDate: string | null;
}

export interface Exercise {
  id: string;
  name: string;
  duration?: string;
  reps?: string;
  restSeconds: number;
  instructions: string;
  videoUrl?: string;
  videoFileName?: string;
}

export interface WorkoutSession {
  id: string;
  name: string;
  description: string;
  durationMinutes: number;
  exercises: Exercise[];
  jumpRopeDurationSeconds?: number;
}
