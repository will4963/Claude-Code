import { Play, Pause, RotateCcw, CheckCircle2 } from 'lucide-react';
import { useTimer } from '../../hooks/useTimer';

interface Props {
  totalSeconds: number;
  label?: string;
  onComplete?: () => void;
  accentColor?: string;
}

export default function CountdownTimer({ totalSeconds, label, onComplete, accentColor = 'orange' }: Props) {
  const timer = useTimer(totalSeconds);

  function handleStart() {
    timer.start();
  }

  function handleDone() {
    if (timer.state === 'done' && onComplete) onComplete();
  }

  const colorMap: Record<string, string> = {
    orange: 'stroke-orange-500',
    green: 'stroke-green-500',
    blue: 'stroke-blue-500',
    red: 'stroke-red-500',
  };
  const strokeColor = colorMap[accentColor] ?? 'stroke-orange-500';

  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const dash = circumference - (timer.progress / 100) * circumference;

  if (timer.state === 'done') {
    return (
      <div className="flex flex-col items-center gap-4 py-4">
        <CheckCircle2 className="w-16 h-16 text-green-400" />
        <p className="text-green-400 font-bold text-xl">{label ? `${label} Complete!` : 'Done!'}</p>
        {onComplete && (
          <button
            onClick={handleDone}
            className="bg-green-500 hover:bg-green-600 text-white font-bold px-6 py-3 rounded-xl transition-colors"
          >
            Continue →
          </button>
        )}
        <button onClick={() => timer.reset()} className="text-gray-400 hover:text-white text-sm flex items-center gap-1">
          <RotateCcw className="w-4 h-4" /> Reset
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 py-2">
      {label && <p className="text-gray-300 font-medium text-sm uppercase tracking-widest">{label}</p>}

      <div className="relative w-36 h-36">
        <svg className="w-36 h-36 -rotate-90" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r={radius} fill="none" stroke="#374151" strokeWidth="8" />
          <circle
            cx="60" cy="60" r={radius} fill="none"
            className={strokeColor}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dash}
            style={{ transition: 'stroke-dashoffset 1s linear' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-3xl font-mono font-bold text-white">{timer.display}</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {timer.state === 'idle' && (
          <button
            onClick={handleStart}
            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-3 rounded-xl transition-colors"
          >
            <Play className="w-4 h-4" /> Start
          </button>
        )}
        {timer.state === 'running' && (
          <button
            onClick={timer.pause}
            className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white font-bold px-6 py-3 rounded-xl transition-colors"
          >
            <Pause className="w-4 h-4" /> Pause
          </button>
        )}
        {timer.state === 'paused' && (
          <button
            onClick={timer.resume}
            className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold px-6 py-3 rounded-xl transition-colors"
          >
            <Play className="w-4 h-4" /> Resume
          </button>
        )}
        <button
          onClick={() => timer.reset()}
          className="flex items-center gap-1.5 text-gray-400 hover:text-white border border-gray-600 hover:border-gray-400 px-4 py-3 rounded-xl transition-colors text-sm"
        >
          <RotateCcw className="w-4 h-4" /> Reset
        </button>
      </div>
    </div>
  );
}
