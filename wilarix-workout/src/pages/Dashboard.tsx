import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Flame, Trophy, Scale, PlusCircle, Trash2, FileText, Play, ChevronRight, Calendar, Dumbbell } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useWorkout } from '../context/WorkoutContext';
import { getSessions } from '../utils/storage';

export default function Dashboard() {
  const { user } = useAuth();
  const { progress, loadProgress, addWeightEntry, addSessionNote, deleteWeightEntry } = useWorkout();
  const [weightInput, setWeightInput] = useState('');
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lbs'>('kg');
  const [noteInput, setNoteInput] = useState('');
  const [noteSession, setNoteSession] = useState('');
  const sessions = getSessions();

  useEffect(() => { loadProgress(); }, [loadProgress]);

  function handleAddWeight(e: React.FormEvent) {
    e.preventDefault();
    const val = parseFloat(weightInput);
    if (!val || val <= 0) return;
    addWeightEntry(val, weightUnit);
    setWeightInput('');
  }

  function handleAddNote(e: React.FormEvent) {
    e.preventDefault();
    if (!noteInput.trim() || !noteSession) return;
    const session = sessions.find(s => s.id === noteSession);
    addSessionNote(noteSession, session?.name ?? noteSession, noteInput.trim());
    setNoteInput('');
  }

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  const totalSessions = progress?.completedWorkouts.length ?? 0;
  const streak = progress?.streak ?? 0;

  const mainSessions = sessions.filter(s => s.id !== 'warmup');

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Welcome */}
      <div className="mb-6">
        <p className="text-gray-500 text-sm">{today}</p>
        <h1 className="text-2xl sm:text-3xl font-black text-white mt-0.5">
          Hey, {user?.name.split(' ')[0]}! 👋
        </h1>
        <p className="text-gray-400 mt-1">Ready to crush today's workout?</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 text-center">
          <div className="flex items-center justify-center w-9 h-9 bg-orange-500/15 rounded-xl mx-auto mb-2">
            <Flame className="w-5 h-5 text-orange-400" />
          </div>
          <div className="text-2xl font-black text-orange-400">{streak}</div>
          <div className="text-gray-500 text-xs mt-0.5">Day Streak</div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 text-center">
          <div className="flex items-center justify-center w-9 h-9 bg-green-500/15 rounded-xl mx-auto mb-2">
            <Trophy className="w-5 h-5 text-green-400" />
          </div>
          <div className="text-2xl font-black text-green-400">{totalSessions}</div>
          <div className="text-gray-500 text-xs mt-0.5">Sessions Done</div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 text-center">
          <div className="flex items-center justify-center w-9 h-9 bg-blue-500/15 rounded-xl mx-auto mb-2">
            <Calendar className="w-5 h-5 text-blue-400" />
          </div>
          <div className="text-2xl font-black text-blue-400">
            {progress?.completedWorkouts.filter(w => {
              const d = new Date(w.completedAt);
              const now = new Date();
              return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
            }).length ?? 0}
          </div>
          <div className="text-gray-500 text-xs mt-0.5">This Month</div>
        </div>
      </div>

      {/* Today's Workout */}
      <div className="bg-gradient-to-r from-orange-900/30 to-gray-900 border border-orange-500/20 rounded-2xl p-5 mb-6">
        <p className="text-orange-400 text-xs font-semibold uppercase tracking-widest mb-1">Today's Recommended</p>
        <h2 className="text-white font-black text-xl mb-1">
          {totalSessions === 0 ? 'Warm-Up + Session 1' : totalSessions < 3 ? `Session ${(totalSessions % 3) + 1}` : 'Keep the streak going!'}
        </h2>
        <p className="text-gray-400 text-sm mb-4">Start with a warm-up, then jump into your session.</p>
        <div className="flex flex-wrap gap-2">
          <Link to="/session/warmup" className="flex items-center gap-1.5 bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/30 text-orange-300 px-4 py-2 rounded-xl text-sm font-medium transition-colors">
            <Play className="w-3.5 h-3.5" /> Warm-Up
          </Link>
          {mainSessions.map(s => (
            <Link key={s.id} to={`/session/${s.id}`} className="flex items-center gap-1.5 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 px-4 py-2 rounded-xl text-sm font-medium transition-colors">
              <Dumbbell className="w-3.5 h-3.5" /> {s.name.split('—')[0].trim()}
            </Link>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Weight Tracker */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Scale className="w-5 h-5 text-blue-400" />
            <h3 className="text-white font-bold">Weight Tracker</h3>
          </div>
          <form onSubmit={handleAddWeight} className="flex gap-2 mb-4">
            <input
              type="number"
              value={weightInput}
              onChange={e => setWeightInput(e.target.value)}
              placeholder="Enter weight"
              step="0.1"
              min="1"
              className="flex-1 bg-gray-800 border border-gray-700 text-white placeholder-gray-500 rounded-xl px-3 py-2 text-sm outline-none focus:border-blue-500"
            />
            <select
              value={weightUnit}
              onChange={e => setWeightUnit(e.target.value as 'kg' | 'lbs')}
              className="bg-gray-800 border border-gray-700 text-gray-300 rounded-xl px-2 py-2 text-sm outline-none focus:border-blue-500"
            >
              <option value="kg">kg</option>
              <option value="lbs">lbs</option>
            </select>
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-3 py-2">
              <PlusCircle className="w-4 h-4" />
            </button>
          </form>
          <div className="flex flex-col gap-2 max-h-48 overflow-y-auto">
            {(progress?.weightEntries ?? []).length === 0 && (
              <p className="text-gray-600 text-sm text-center py-3">No entries yet. Log your weight above!</p>
            )}
            {(progress?.weightEntries ?? []).slice(0, 10).map(entry => (
              <div key={entry.id} className="flex items-center justify-between bg-gray-800 rounded-xl px-3 py-2">
                <span className="text-white text-sm font-medium">{entry.weight} {entry.unit}</span>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 text-xs">{new Date(entry.date).toLocaleDateString()}</span>
                  <button onClick={() => deleteWeightEntry(entry.id)} className="text-gray-600 hover:text-red-400">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Session Notes */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-5 h-5 text-purple-400" />
            <h3 className="text-white font-bold">Session Notes</h3>
          </div>
          <form onSubmit={handleAddNote} className="flex flex-col gap-2 mb-4">
            <select
              value={noteSession}
              onChange={e => setNoteSession(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 text-gray-300 rounded-xl px-3 py-2 text-sm outline-none focus:border-purple-500"
            >
              <option value="">Select session…</option>
              {sessions.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
            <textarea
              value={noteInput}
              onChange={e => setNoteInput(e.target.value)}
              placeholder="How did the session go? Any wins today?"
              rows={2}
              className="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-500 rounded-xl px-3 py-2 text-sm outline-none focus:border-purple-500 resize-none"
            />
            <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl px-4 py-2 text-sm font-medium flex items-center gap-1.5 justify-center">
              <PlusCircle className="w-4 h-4" /> Save Note
            </button>
          </form>
          <div className="flex flex-col gap-2 max-h-40 overflow-y-auto">
            {(progress?.sessionNotes ?? []).length === 0 && (
              <p className="text-gray-600 text-sm text-center py-2">No notes yet. Write your first one!</p>
            )}
            {(progress?.sessionNotes ?? []).slice(0, 5).map(note => (
              <div key={note.id} className="bg-gray-800 rounded-xl px-3 py-2">
                <div className="flex justify-between items-center mb-0.5">
                  <span className="text-purple-400 text-xs font-medium">{note.sessionName}</span>
                  <span className="text-gray-600 text-xs">{new Date(note.date).toLocaleDateString()}</span>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">{note.note}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent workouts */}
      {(progress?.completedWorkouts ?? []).length > 0 && (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-bold flex items-center gap-2"><Trophy className="w-4 h-4 text-yellow-400" /> Recent Workouts</h3>
          </div>
          <div className="flex flex-col gap-2">
            {(progress?.completedWorkouts ?? []).slice(0, 5).map(w => (
              <div key={w.id} className="flex items-center justify-between bg-gray-800 rounded-xl px-4 py-3">
                <div>
                  <p className="text-white text-sm font-medium">{w.sessionName}</p>
                  <p className="text-gray-500 text-xs">{w.durationMinutes} min</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-400 text-xs">{new Date(w.completedAt).toLocaleDateString()}</p>
                  <p className="text-gray-600 text-xs">{new Date(w.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
              </div>
            ))}
          </div>
          {(progress?.completedWorkouts ?? []).length > 5 && (
            <Link to="/profile" className="flex items-center gap-1 text-orange-400 hover:text-orange-300 text-sm mt-3 justify-center">
              View all history <ChevronRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
