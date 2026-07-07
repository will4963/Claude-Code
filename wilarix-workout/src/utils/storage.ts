import type { User, UserProgress, WorkoutSession } from '../types';

const KEYS = {
  USERS: 'wbw_users',
  CURRENT_USER: 'wbw_current_user',
  PROGRESS: 'wbw_progress',
  SESSIONS: 'wbw_sessions',
  VIDEOS: 'wbw_videos',
};

function get<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function set<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

// ── Auth ──────────────────────────────────────────────
export function getUsers(): User[] {
  return get<User[]>(KEYS.USERS) ?? [];
}

export function saveUser(user: User): void {
  const users = getUsers().filter(u => u.id !== user.id);
  set(KEYS.USERS, [...users, user]);
}

export function getCurrentUser(): User | null {
  return get<User>(KEYS.CURRENT_USER);
}

export function setCurrentUser(user: User | null): void {
  if (user) set(KEYS.CURRENT_USER, user);
  else localStorage.removeItem(KEYS.CURRENT_USER);
}

export function findUserByEmail(email: string): User | undefined {
  return getUsers().find(u => u.email.toLowerCase() === email.toLowerCase());
}

// Passwords stored as a simple map (for demo; real apps use bcrypt/server)
const PW_KEY = 'wbw_passwords';
export function getPasswords(): Record<string, string> {
  return get<Record<string, string>>(PW_KEY) ?? {};
}
export function savePassword(userId: string, password: string): void {
  const pws = getPasswords();
  pws[userId] = password;
  set(PW_KEY, pws);
}
export function verifyPassword(userId: string, password: string): boolean {
  return getPasswords()[userId] === password;
}

// ── Progress ──────────────────────────────────────────
export function getProgress(userId: string): UserProgress {
  const all = get<Record<string, UserProgress>>(KEYS.PROGRESS) ?? {};
  return all[userId] ?? {
    userId,
    completedWorkouts: [],
    weightEntries: [],
    sessionNotes: [],
    streak: 0,
    lastWorkoutDate: null,
  };
}

export function saveProgress(progress: UserProgress): void {
  const all = get<Record<string, UserProgress>>(KEYS.PROGRESS) ?? {};
  all[progress.userId] = progress;
  set(KEYS.PROGRESS, all);
}

// ── Sessions ──────────────────────────────────────────
const DEFAULT_SESSIONS: WorkoutSession[] = [
  {
    id: 'warmup',
    name: 'Warm-Up',
    description: 'Light movement to prepare your body for exercise.',
    durationMinutes: 5,
    exercises: [
      {
        id: 'wu1',
        name: 'March in Place',
        duration: '1 minute',
        restSeconds: 15,
        instructions: 'Lift your knees high while marching in place. Swing your arms gently. Keep a steady pace — no rush!',
      },
      {
        id: 'wu2',
        name: 'Arm Circles',
        duration: '30 seconds each direction',
        restSeconds: 15,
        instructions: 'Extend arms out to the sides. Make small circles forward for 30 seconds, then backward for 30 seconds.',
      },
      {
        id: 'wu3',
        name: 'Hip Rotations',
        duration: '30 seconds',
        restSeconds: 15,
        instructions: 'Stand with feet shoulder-width apart. Place hands on hips and make slow circles. Loosen up those hips!',
      },
      {
        id: 'wu4',
        name: 'Gentle Jumping Jacks',
        duration: '1 minute',
        restSeconds: 20,
        instructions: 'Slow, easy jumping jacks. If jumping is too much, step side to side instead. Whatever feels right for you!',
      },
    ],
  },
  {
    id: 'session1',
    name: 'Session 1 — Full Body Basics',
    description: 'Jump rope + 3 full-body exercises with zero equipment.',
    durationMinutes: 20,
    jumpRopeDurationSeconds: 120,
    exercises: [
      {
        id: 's1e1',
        name: 'Bodyweight Squats',
        reps: '15 reps × 3 sets',
        restSeconds: 45,
        instructions: 'Stand with feet shoulder-width apart. Lower your body as if sitting into a chair. Keep your chest up and knees behind your toes. Push through your heels to stand back up.',
      },
      {
        id: 's1e2',
        name: 'Push-Ups (or Knee Push-Ups)',
        reps: '10 reps × 3 sets',
        restSeconds: 45,
        instructions: 'Start in plank position (or on knees for beginners). Lower chest to the floor, then push back up. Keep your core tight. Beginner? Do them on your knees — no shame, all gain!',
      },
      {
        id: 's1e3',
        name: 'Glute Bridges',
        reps: '15 reps × 3 sets',
        restSeconds: 45,
        instructions: 'Lie on your back with knees bent and feet flat on the floor. Push your hips up until your body forms a straight line from knees to shoulders. Squeeze your glutes at the top. Lower slowly.',
      },
    ],
  },
  {
    id: 'session2',
    name: 'Session 2 — Dumbbell Strength',
    description: 'Jump rope + 5 dumbbell exercises for strength building.',
    durationMinutes: 30,
    jumpRopeDurationSeconds: 180,
    exercises: [
      {
        id: 's2e1',
        name: 'Dumbbell Bicep Curls',
        reps: '12 reps × 3 sets',
        restSeconds: 45,
        instructions: 'Hold a dumbbell in each hand at your sides. Keep elbows close to your body. Curl the weights up to your shoulders. Lower slowly. Use a weight that challenges you but allows good form.',
      },
      {
        id: 's2e2',
        name: 'Dumbbell Overhead Press',
        reps: '10 reps × 3 sets',
        restSeconds: 45,
        instructions: 'Hold dumbbells at shoulder height, palms facing forward. Press them straight up overhead. Lower back to shoulders slowly. Keep your core tight and avoid arching your back.',
      },
      {
        id: 's2e3',
        name: 'Dumbbell Romanian Deadlift',
        reps: '12 reps × 3 sets',
        restSeconds: 60,
        instructions: 'Hold dumbbells in front of your thighs. Hinge at the hips, lowering the weights along your legs while keeping your back straight. Feel the stretch in your hamstrings, then stand back up.',
      },
      {
        id: 's2e4',
        name: 'Dumbbell Lateral Raises',
        reps: '12 reps × 3 sets',
        restSeconds: 45,
        instructions: 'Hold dumbbells at your sides. Raise arms out to the sides until they reach shoulder height. Lower slowly. Keep a slight bend in your elbows. Great for building shoulder width!',
      },
      {
        id: 's2e5',
        name: 'Dumbbell Lunges',
        reps: '10 reps each leg × 3 sets',
        restSeconds: 60,
        instructions: 'Hold a dumbbell in each hand. Step forward with one leg, lowering your back knee toward the floor. Front knee stays above your ankle. Push back to start. Alternate legs.',
      },
    ],
  },
  {
    id: 'session3',
    name: 'Session 3 — Abs & Core',
    description: 'Jump rope + 4 core-strengthening exercises.',
    durationMinutes: 25,
    jumpRopeDurationSeconds: 150,
    exercises: [
      {
        id: 's3e1',
        name: 'Crunches',
        reps: '20 reps × 3 sets',
        restSeconds: 30,
        instructions: 'Lie on your back with knees bent. Place hands behind your head lightly. Curl your upper body up toward your knees — focus on squeezing your abs. Lower slowly. No neck pulling!',
      },
      {
        id: 's3e2',
        name: 'Plank Hold',
        duration: '30 seconds × 3 sets',
        restSeconds: 30,
        instructions: 'Get into a push-up position, resting on forearms. Keep your body in a straight line from head to heels. Squeeze everything — abs, glutes, legs. Breathe steadily. Hold the position!',
      },
      {
        id: 's3e3',
        name: 'Bicycle Crunches',
        reps: '15 reps each side × 3 sets',
        restSeconds: 30,
        instructions: 'Lie on your back. Bring one knee toward your chest while rotating your opposite elbow toward it. Alternate sides in a pedaling motion. Keep it controlled — quality over speed!',
      },
      {
        id: 's3e4',
        name: 'Leg Raises',
        reps: '12 reps × 3 sets',
        restSeconds: 45,
        instructions: 'Lie flat on your back. Keep legs straight and lift them to 90 degrees. Lower them slowly without letting them touch the floor. Feel the burn in your lower abs. You got this!',
      },
    ],
  },
];

export function getSessions(): WorkoutSession[] {
  return get<WorkoutSession[]>(KEYS.SESSIONS) ?? DEFAULT_SESSIONS;
}

export function saveSessions(sessions: WorkoutSession[]): void {
  set(KEYS.SESSIONS, sessions);
}

export function getSession(id: string): WorkoutSession | undefined {
  return getSessions().find(s => s.id === id);
}

// ── Video blobs stored as base64 in localStorage ──────
export interface VideoEntry {
  exerciseId: string;
  fileName: string;
  dataUrl: string;
}

export function getVideos(): VideoEntry[] {
  return get<VideoEntry[]>(KEYS.VIDEOS) ?? [];
}

export function saveVideo(entry: VideoEntry): void {
  const videos = getVideos().filter(v => v.exerciseId !== entry.exerciseId);
  set(KEYS.VIDEOS, [...videos, entry]);
}

export function getVideoForExercise(exerciseId: string): VideoEntry | undefined {
  return getVideos().find(v => v.exerciseId === exerciseId);
}

export function deleteVideo(exerciseId: string): void {
  set(KEYS.VIDEOS, getVideos().filter(v => v.exerciseId !== exerciseId));
}
