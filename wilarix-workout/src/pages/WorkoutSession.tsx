import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AlertTriangle, ChevronRight, CheckCircle2, Timer, Dumbbell, RotateCcw, Zap } from 'lucide-react';
import { getSession } from '../utils/storage';
import { useWorkout } from '../context/WorkoutContext';
import CountdownTimer from '../components/Workout/CountdownTimer';
import ExerciseCard from '../components/Workout/ExerciseCard';

export default function WorkoutSession() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const { markSessionComplete } = useWorkout();
  const session = getSession(sessionId ?? '');
  const [step, setStep] = useState<'safety' | 'jumprope' | 'exercises' | 'done'>('safety');
  const [completedCount, setCompletedCount] = useState(0);
  const [startTime] = useState(Date.now());

  useEffect(() => { window.scrollTo(0, 0); }, [step]);

  if (!session) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-400 text-lg">Session not found.</p>
      </div>
    );
  }

  function handleComplete() {
    const durationMinutes = Math.round((Date.now() - startTime) / 60000);
    markSessionComplete(session!.id, session!.name, Math.max(durationMinutes, 1));
    setStep('done');
  }

  // Safety page
  if (step === 'safety') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-yellow-900/20 border border-yellow-700/40 rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-yellow-500/20 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-yellow-400" />
            </div>
            <h2 className="text-yellow-300 font-bold text-lg">Before You Start</h2>
          </div>
          <ul className="flex flex-col gap-2 text-gray-300 text-sm">
            {[
              'Drink a glass of water before starting.',
              'Make sure you have enough space to move safely.',
              'Wear comfortable, supportive shoes.',
              'If you feel pain (not just burn!), stop immediately.',
              'Rest between exercises — recovery is part of training.',
              'Consult a doctor before starting if you have any health concerns.',
            ].map(tip => (
              <li key={tip} className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                {tip}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 text-center">
          <div className="w-14 h-14 bg-orange-500/15 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <Dumbbell className="w-7 h-7 text-orange-400" />
          </div>
          <h1 className="text-2xl font-black text-white mb-1">{session.name}</h1>
          <p className="text-gray-400 text-sm mb-1">{session.description}</p>
          <p className="text-gray-500 text-xs mb-5">
            <Timer className="w-3.5 h-3.5 inline mr-1" />
            About {session.durationMinutes} minutes · {session.exercises.length} exercises
          </p>
          <button
            onClick={() => setStep(session.jumpRopeDurationSeconds ? 'jumprope' : 'exercises')}
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-4 rounded-2xl transition-all hover:scale-105 flex items-center gap-2 mx-auto"
          >
            <Zap className="w-5 h-5" /> I'm Ready — Let's Go!
          </button>
        </div>
      </div>
    );
  }

  // Jump rope
  if (step === 'jumprope' && session.jumpRopeDurationSeconds) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <div className="text-center mb-4">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-green-500/15 rounded-xl mb-3">
              <span className="text-2xl">🪢</span>
            </div>
            <h2 className="text-white font-black text-xl">Jump Rope Warm-Up</h2>
            <p className="text-gray-400 text-sm mt-1">
              Grab your jump rope (or do high-knees if no rope!) for {Math.round(session.jumpRopeDurationSeconds / 60)} minutes.
            </p>
          </div>

          <div className="bg-blue-900/20 border border-blue-700/30 rounded-xl p-3 mb-5 text-sm text-blue-300 flex gap-2">
            <span className="flex-shrink-0">💡</span>
            <span>No jump rope? Do high-knees in place at the same pace — works just as well for beginners!</span>
          </div>

          <CountdownTimer
            totalSeconds={session.jumpRopeDurationSeconds}
            label="Jump Rope"
            accentColor="green"
            onComplete={() => setStep('exercises')}
          />

          <div className="text-center mt-4">
            <button onClick={() => setStep('exercises')} className="text-gray-500 hover:text-gray-300 text-sm flex items-center gap-1 mx-auto">
              Skip jump rope <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Exercises
  if (step === 'exercises') {
    const allDone = completedCount >= session.exercises.length;

    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Progress bar */}
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-white font-black text-lg">{session.name}</h2>
          <span className="text-gray-400 text-sm">{completedCount}/{session.exercises.length} done</span>
        </div>
        <div className="w-full bg-gray-800 rounded-full h-2 mb-6">
          <div
            className="bg-orange-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${(completedCount / session.exercises.length) * 100}%` }}
          />
        </div>

        <div className="flex flex-col gap-3 mb-6">
          {session.exercises.map((exercise, i) => (
            <ExerciseCard
              key={exercise.id}
              exercise={exercise}
              index={i}
              onComplete={() => setCompletedCount(c => c + 1)}
            />
          ))}
        </div>

        {allDone && (
          <div className="bg-green-900/20 border border-green-500/30 rounded-2xl p-5 text-center">
            <CheckCircle2 className="w-10 h-10 text-green-400 mx-auto mb-2" />
            <h3 className="text-green-300 font-black text-xl mb-1">All exercises complete! 🎉</h3>
            <p className="text-gray-400 text-sm mb-4">Amazing work. Tap below to log this session.</p>
            <button
              onClick={handleComplete}
              className="bg-green-500 hover:bg-green-600 text-white font-bold px-8 py-3 rounded-xl transition-colors"
            >
              Mark Session Complete
            </button>
          </div>
        )}

        {!allDone && (
          <div className="text-center">
            <p className="text-gray-500 text-sm">{session.exercises.length - completedCount} exercise{session.exercises.length - completedCount !== 1 ? 's' : ''} remaining — you've got this!</p>
          </div>
        )}
      </div>
    );
  }

  // Done
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="bg-gray-900 border border-green-500/30 rounded-2xl p-8 text-center">
        <div className="text-5xl mb-4">🏆</div>
        <h2 className="text-2xl font-black text-white mb-2">Session Complete!</h2>
        <p className="text-green-400 font-semibold mb-1">{session.name}</p>
        <p className="text-gray-400 text-sm mb-6">
          You finished in {Math.max(Math.round((Date.now() - startTime) / 60000), 1)} minutes. Every session brings you closer to your goal!
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button onClick={() => { setStep('safety'); setCompletedCount(0); }} className="flex items-center gap-1.5 border border-gray-600 hover:border-gray-400 text-gray-300 px-5 py-3 rounded-xl text-sm transition-colors">
            <RotateCcw className="w-4 h-4" /> Do It Again
          </button>
          <button onClick={() => navigate('/dashboard')} className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-5 py-3 rounded-xl transition-colors flex items-center gap-1.5">
            <ChevronRight className="w-4 h-4" /> Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
