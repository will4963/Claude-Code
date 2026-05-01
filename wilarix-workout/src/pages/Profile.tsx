import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useWorkout } from '../context/WorkoutContext';
import { Trophy, Scale, FileText, Edit2, Check, X } from 'lucide-react';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const { progress } = useWorkout();
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(user?.name ?? '');

  function saveName() {
    if (nameInput.trim()) {
      updateUser({ name: nameInput.trim() });
    }
    setEditingName(false);
  }

  const totalMinutes = progress?.completedWorkouts.reduce((s, w) => s + w.durationMinutes, 0) ?? 0;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-black text-white mb-6">My Profile</h1>

      {/* User card */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-4">
        <div className="flex items-center gap-4 mb-5">
          <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center text-white text-2xl font-black">
            {user?.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            {editingName ? (
              <div className="flex gap-2 items-center">
                <input
                  value={nameInput}
                  onChange={e => setNameInput(e.target.value)}
                  className="bg-gray-800 border border-orange-500 text-white rounded-lg px-3 py-1.5 text-sm outline-none flex-1 min-w-0"
                  onKeyDown={e => { if (e.key === 'Enter') saveName(); if (e.key === 'Escape') setEditingName(false); }}
                  autoFocus
                />
                <button onClick={saveName} className="text-green-400 hover:text-green-300 p-1"><Check className="w-4 h-4" /></button>
                <button onClick={() => { setEditingName(false); setNameInput(user?.name ?? ''); }} className="text-gray-400 hover:text-gray-200 p-1"><X className="w-4 h-4" /></button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <h2 className="text-white font-bold text-lg truncate">{user?.name}</h2>
                <button onClick={() => setEditingName(true)} className="text-gray-500 hover:text-gray-300 flex-shrink-0">
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>
            )}
            <p className="text-gray-500 text-sm">{user?.email}</p>
            {user?.isAdmin && <span className="inline-block bg-orange-500/20 text-orange-400 text-xs px-2 py-0.5 rounded-full mt-1">Admin</span>}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 pt-4 border-t border-gray-800">
          <div className="text-center">
            <div className="text-xl font-black text-orange-400">{progress?.completedWorkouts.length ?? 0}</div>
            <div className="text-gray-500 text-xs">Workouts</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-black text-green-400">{progress?.streak ?? 0}</div>
            <div className="text-gray-500 text-xs">Day Streak</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-black text-blue-400">{totalMinutes}</div>
            <div className="text-gray-500 text-xs">Total Min</div>
          </div>
        </div>
      </div>

      {/* Weight history */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 mb-4">
        <div className="flex items-center gap-2 mb-4">
          <Scale className="w-5 h-5 text-blue-400" />
          <h3 className="text-white font-bold">Weight History</h3>
        </div>
        {(progress?.weightEntries ?? []).length === 0 ? (
          <p className="text-gray-600 text-sm text-center py-3">No weight entries yet. Log from your dashboard.</p>
        ) : (
          <div className="flex flex-col gap-2 max-h-60 overflow-y-auto">
            {(progress?.weightEntries ?? []).map(e => (
              <div key={e.id} className="flex justify-between items-center bg-gray-800 rounded-xl px-4 py-2.5">
                <span className="text-white font-medium">{e.weight} {e.unit}</span>
                <span className="text-gray-500 text-sm">{new Date(e.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Full workout history */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 mb-4">
        <div className="flex items-center gap-2 mb-4">
          <Trophy className="w-5 h-5 text-yellow-400" />
          <h3 className="text-white font-bold">Workout History</h3>
        </div>
        {(progress?.completedWorkouts ?? []).length === 0 ? (
          <p className="text-gray-600 text-sm text-center py-3">No workouts completed yet. Start your first session!</p>
        ) : (
          <div className="flex flex-col gap-2 max-h-80 overflow-y-auto">
            {(progress?.completedWorkouts ?? []).map(w => (
              <div key={w.id} className="flex justify-between items-center bg-gray-800 rounded-xl px-4 py-2.5">
                <div>
                  <p className="text-white text-sm font-medium">{w.sessionName}</p>
                  <p className="text-gray-500 text-xs">{w.durationMinutes} min</p>
                </div>
                <span className="text-gray-500 text-xs">{new Date(w.completedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* All session notes */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-5 h-5 text-purple-400" />
          <h3 className="text-white font-bold">All Notes</h3>
        </div>
        {(progress?.sessionNotes ?? []).length === 0 ? (
          <p className="text-gray-600 text-sm text-center py-3">No notes yet. Write reflections on your sessions!</p>
        ) : (
          <div className="flex flex-col gap-3 max-h-80 overflow-y-auto">
            {(progress?.sessionNotes ?? []).map(n => (
              <div key={n.id} className="bg-gray-800 rounded-xl p-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-purple-400 text-xs font-medium">{n.sessionName}</span>
                  <span className="text-gray-600 text-xs">{new Date(n.date).toLocaleDateString()}</span>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">{n.note}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <p className="text-center text-gray-600 text-xs mt-6">
        Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'recently'}
      </p>
    </div>
  );
}
