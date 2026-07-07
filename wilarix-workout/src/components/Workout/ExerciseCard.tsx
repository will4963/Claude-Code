import { useState } from 'react';
import { ChevronDown, ChevronUp, Timer, Repeat, Info, CheckCircle2 } from 'lucide-react';
import type { Exercise } from '../../types';
import CountdownTimer from './CountdownTimer';
import VideoPlayer from './VideoPlayer';

interface Props {
  exercise: Exercise;
  index: number;
  onComplete?: () => void;
}

export default function ExerciseCard({ exercise, index, onComplete }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [showRestTimer, setShowRestTimer] = useState(false);
  const [done, setDone] = useState(false);

  function handleExerciseDone() {
    setShowRestTimer(true);
  }

  function handleRestDone() {
    setShowRestTimer(false);
    setDone(true);
    onComplete?.();
  }

  return (
    <div className={`bg-gray-800 rounded-2xl overflow-hidden border transition-colors ${done ? 'border-green-500/40' : 'border-gray-700'}`}>
      {/* Header */}
      <button
        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-750 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${done ? 'bg-green-500 text-white' : 'bg-orange-500/20 text-orange-400'}`}>
            {done ? <CheckCircle2 className="w-4 h-4" /> : index + 1}
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm sm:text-base">{exercise.name}</h3>
            <div className="flex items-center gap-3 mt-0.5">
              {exercise.reps && (
                <span className="flex items-center gap-1 text-orange-400 text-xs">
                  <Repeat className="w-3 h-3" /> {exercise.reps}
                </span>
              )}
              {exercise.duration && (
                <span className="flex items-center gap-1 text-blue-400 text-xs">
                  <Timer className="w-3 h-3" /> {exercise.duration}
                </span>
              )}
              <span className="text-gray-500 text-xs">Rest: {exercise.restSeconds}s</span>
            </div>
          </div>
        </div>
        {expanded ? <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" /> : <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />}
      </button>

      {expanded && (
        <div className="border-t border-gray-700 p-4 flex flex-col gap-4">
          {/* Instructions */}
          <div className="flex gap-2 bg-gray-900/60 rounded-xl p-3">
            <Info className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
            <p className="text-gray-300 text-sm leading-relaxed">{exercise.instructions}</p>
          </div>

          {/* Video */}
          <VideoPlayer exerciseId={exercise.id} exerciseName={exercise.name} />

          {/* Timer / Rest flow */}
          {!done && !showRestTimer && (
            <div className="flex flex-col items-center gap-3">
              {exercise.duration ? (
                <>
                  <p className="text-gray-400 text-sm">Use the timer below for this exercise:</p>
                  <CountdownTimer
                    totalSeconds={parseDurationToSeconds(exercise.duration)}
                    label="Exercise"
                    onComplete={handleExerciseDone}
                  />
                </>
              ) : (
                <button
                  onClick={handleExerciseDone}
                  className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-3 rounded-xl transition-colors w-full sm:w-auto"
                >
                  Done with reps — Start Rest Timer
                </button>
              )}
            </div>
          )}

          {showRestTimer && (
            <div className="bg-gray-900/60 rounded-xl p-4 flex flex-col items-center gap-2">
              <p className="text-yellow-400 font-semibold text-sm">Rest time! Breathe and recover.</p>
              <CountdownTimer
                totalSeconds={exercise.restSeconds}
                label="Rest"
                accentColor="blue"
                onComplete={handleRestDone}
              />
            </div>
          )}

          {done && (
            <div className="flex items-center justify-center gap-2 py-2">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
              <span className="text-green-400 font-semibold">Exercise complete! Great work!</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function parseDurationToSeconds(duration: string): number {
  const lower = duration.toLowerCase();
  const minMatch = lower.match(/(\d+)\s*min/);
  const secMatch = lower.match(/(\d+)\s*sec/);
  let total = 0;
  if (minMatch) total += parseInt(minMatch[1]) * 60;
  if (secMatch) total += parseInt(secMatch[1]);
  return total || 30;
}
