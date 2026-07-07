import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { PlusCircle, Trash2, Save, ChevronDown, ChevronUp, Film } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getSessions, saveSessions } from '../utils/storage';
import type { WorkoutSession, Exercise } from '../types';

export default function Admin() {
  const { user } = useAuth();
  if (!user?.isAdmin) return <Navigate to="/dashboard" replace />;

  const [sessions, setSessions] = useState<WorkoutSession[]>(getSessions());
  const [expandedSession, setExpandedSession] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  function handleSave() {
    saveSessions(sessions);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function updateSession(sessionId: string, updates: Partial<WorkoutSession>) {
    setSessions(prev => prev.map(s => s.id === sessionId ? { ...s, ...updates } : s));
  }

  function updateExercise(sessionId: string, exerciseId: string, updates: Partial<Exercise>) {
    setSessions(prev => prev.map(s =>
      s.id !== sessionId ? s : {
        ...s,
        exercises: s.exercises.map(e => e.id === exerciseId ? { ...e, ...updates } : e),
      }
    ));
  }

  function addExercise(sessionId: string) {
    const newEx: Exercise = {
      id: crypto.randomUUID(),
      name: 'New Exercise',
      reps: '10 reps × 3 sets',
      restSeconds: 45,
      instructions: 'Enter exercise instructions here.',
    };
    setSessions(prev => prev.map(s => s.id !== sessionId ? s : { ...s, exercises: [...s.exercises, newEx] }));
  }

  function removeExercise(sessionId: string, exerciseId: string) {
    if (!confirm('Remove this exercise?')) return;
    setSessions(prev => prev.map(s => s.id !== sessionId ? s : { ...s, exercises: s.exercises.filter(e => e.id !== exerciseId) }));
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-white">Admin Panel</h1>
          <p className="text-gray-400 text-sm mt-0.5">Manage workout sessions, exercises, and content.</p>
        </div>
        <button
          onClick={handleSave}
          className={`flex items-center gap-2 font-bold px-5 py-2.5 rounded-xl transition-colors ${saved ? 'bg-green-500 text-white' : 'bg-orange-500 hover:bg-orange-600 text-white'}`}
        >
          <Save className="w-4 h-4" />
          {saved ? 'Saved!' : 'Save All Changes'}
        </button>
      </div>

      <div className="bg-blue-900/20 border border-blue-700/30 rounded-xl p-3 mb-6 text-sm text-blue-300 flex gap-2">
        <span>💡</span>
        <span>To add/replace workout videos, open each exercise card in the actual session pages. Videos are uploaded directly there.</span>
      </div>

      <div className="flex flex-col gap-4">
        {sessions.map(session => (
          <div key={session.id} className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
            {/* Session header */}
            <button
              className="w-full flex items-center justify-between p-4 hover:bg-gray-800/50 transition-colors"
              onClick={() => setExpandedSession(expandedSession === session.id ? null : session.id)}
            >
              <div className="text-left">
                <h3 className="text-white font-bold">{session.name}</h3>
                <p className="text-gray-500 text-xs">{session.exercises.length} exercises · {session.durationMinutes} min</p>
              </div>
              {expandedSession === session.id ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
            </button>

            {expandedSession === session.id && (
              <div className="border-t border-gray-800 p-4 flex flex-col gap-4">
                {/* Session fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Session Name</label>
                    <input
                      value={session.name}
                      onChange={e => updateSession(session.id, { name: e.target.value })}
                      className="w-full bg-gray-800 border border-gray-700 focus:border-orange-500 text-white rounded-lg px-3 py-2 text-sm outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Duration (minutes)</label>
                    <input
                      type="number"
                      value={session.durationMinutes}
                      onChange={e => updateSession(session.id, { durationMinutes: parseInt(e.target.value) || 0 })}
                      className="w-full bg-gray-800 border border-gray-700 focus:border-orange-500 text-white rounded-lg px-3 py-2 text-sm outline-none"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs text-gray-400 mb-1">Description</label>
                    <input
                      value={session.description}
                      onChange={e => updateSession(session.id, { description: e.target.value })}
                      className="w-full bg-gray-800 border border-gray-700 focus:border-orange-500 text-white rounded-lg px-3 py-2 text-sm outline-none"
                    />
                  </div>
                  {session.jumpRopeDurationSeconds !== undefined && (
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Jump Rope Duration (seconds)</label>
                      <input
                        type="number"
                        value={session.jumpRopeDurationSeconds}
                        onChange={e => updateSession(session.id, { jumpRopeDurationSeconds: parseInt(e.target.value) || 0 })}
                        className="w-full bg-gray-800 border border-gray-700 focus:border-orange-500 text-white rounded-lg px-3 py-2 text-sm outline-none"
                      />
                    </div>
                  )}
                </div>

                {/* Exercises */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-gray-300 font-semibold text-sm">Exercises</h4>
                    <button
                      onClick={() => addExercise(session.id)}
                      className="flex items-center gap-1 text-orange-400 hover:text-orange-300 text-xs font-medium"
                    >
                      <PlusCircle className="w-4 h-4" /> Add Exercise
                    </button>
                  </div>
                  <div className="flex flex-col gap-3">
                    {session.exercises.map((ex, i) => (
                      <div key={ex.id} className="bg-gray-800 border border-gray-700 rounded-xl p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-orange-400 text-xs font-bold">#{i + 1}</span>
                          <button onClick={() => removeExercise(session.id, ex.id)} className="text-gray-500 hover:text-red-400">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                          <div>
                            <label className="block text-xs text-gray-500 mb-0.5">Exercise Name</label>
                            <input
                              value={ex.name}
                              onChange={e => updateExercise(session.id, ex.id, { name: e.target.value })}
                              className="w-full bg-gray-700 border border-gray-600 focus:border-orange-500 text-white rounded-lg px-2.5 py-1.5 text-sm outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-0.5">Rest Time (seconds)</label>
                            <input
                              type="number"
                              value={ex.restSeconds}
                              onChange={e => updateExercise(session.id, ex.id, { restSeconds: parseInt(e.target.value) || 30 })}
                              className="w-full bg-gray-700 border border-gray-600 focus:border-orange-500 text-white rounded-lg px-2.5 py-1.5 text-sm outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-0.5">Reps (optional)</label>
                            <input
                              value={ex.reps ?? ''}
                              onChange={e => updateExercise(session.id, ex.id, { reps: e.target.value || undefined })}
                              placeholder="e.g. 12 reps × 3 sets"
                              className="w-full bg-gray-700 border border-gray-600 focus:border-orange-500 text-white placeholder-gray-600 rounded-lg px-2.5 py-1.5 text-sm outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-0.5">Duration (optional)</label>
                            <input
                              value={ex.duration ?? ''}
                              onChange={e => updateExercise(session.id, ex.id, { duration: e.target.value || undefined })}
                              placeholder="e.g. 30 seconds"
                              className="w-full bg-gray-700 border border-gray-600 focus:border-orange-500 text-white placeholder-gray-600 rounded-lg px-2.5 py-1.5 text-sm outline-none"
                            />
                          </div>
                          <div className="sm:col-span-2">
                            <label className="block text-xs text-gray-500 mb-0.5">Instructions</label>
                            <textarea
                              value={ex.instructions}
                              onChange={e => updateExercise(session.id, ex.id, { instructions: e.target.value })}
                              rows={2}
                              className="w-full bg-gray-700 border border-gray-600 focus:border-orange-500 text-white rounded-lg px-2.5 py-1.5 text-sm outline-none resize-none"
                            />
                          </div>
                        </div>
                        <div className="mt-2 flex items-center gap-1.5 text-gray-500 text-xs">
                          <Film className="w-3 h-3" />
                          <span>To manage video: open this exercise in the session page and use the upload button there.</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 text-center">
        <button
          onClick={handleSave}
          className={`font-bold px-8 py-3 rounded-xl transition-colors ${saved ? 'bg-green-500 text-white' : 'bg-orange-500 hover:bg-orange-600 text-white'}`}
        >
          {saved ? '✓ Saved!' : 'Save All Changes'}
        </button>
      </div>
    </div>
  );
}
