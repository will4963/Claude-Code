import { useState, useRef, useCallback, useEffect } from 'react';

export type TimerState = 'idle' | 'running' | 'paused' | 'done';

export function useTimer(initialSeconds: number) {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [state, setState] = useState<TimerState>('idle');
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clear = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const start = useCallback(() => {
    if (state === 'running') return;
    setState('running');
    intervalRef.current = setInterval(() => {
      setSeconds(s => {
        if (s <= 1) {
          clearInterval(intervalRef.current!);
          intervalRef.current = null;
          setState('done');
          return 0;
        }
        return s - 1;
      });
    }, 1000);
  }, [state]);

  const pause = useCallback(() => {
    if (state !== 'running') return;
    clear();
    setState('paused');
  }, [state, clear]);

  const resume = useCallback(() => {
    if (state !== 'paused') return;
    start();
  }, [state, start]);

  const reset = useCallback((newSeconds?: number) => {
    clear();
    setSeconds(newSeconds ?? initialSeconds);
    setState('idle');
  }, [clear, initialSeconds]);

  useEffect(() => () => clear(), [clear]);

  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const display = `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  const progress = initialSeconds > 0 ? ((initialSeconds - seconds) / initialSeconds) * 100 : 0;

  return { seconds, minutes, secs, display, state, progress, start, pause, resume, reset };
}
