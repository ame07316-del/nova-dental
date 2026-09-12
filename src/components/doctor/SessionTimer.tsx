'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { formatTime } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

interface SessionTimerProps {
  sessionId: string;
  appointmentId: string;
  dentistId: string;
  patientName: string;
  serviceName: string;
  plannedDuration: number; // in minutes
  startTime: string;
  endTime: string;
  status: 'active' | 'completed' | 'pending' | 'scheduled' | 'cancelled';
  onEndSession: () => void;
  onStartSession: () => void;
}

interface TimerState {
  elapsed: number; // in seconds
  isRunning: boolean;
  status: 'early' | 'on-time' | 'delayed';
  progress: number; // 0-100
  plannedDuration: number; // in minutes
}

export function SessionTimer({
  sessionId,
  appointmentId,
  dentistId,
  patientName,
  serviceName,
  plannedDuration,
  startTime,
  endTime,
  status: initialStatus,
  onEndSession,
  onStartSession,
}: SessionTimerProps) {
  const [timerState, setTimerState] = useState<TimerState>({
    elapsed: 0,
    isRunning: false,
    status: 'on-time',
    progress: 0,
    plannedDuration,
  });
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(Date.now());

  // Calculate elapsed time
  const tick = useCallback(() => {
    const now = Date.now();
    const elapsedMs = now - startTimeRef.current;
    const elapsedSec = Math.floor(elapsedMs / 1000);
    const elapsedMin = elapsedSec / 60;
    const progress = Math.min((elapsedMin / plannedDuration) * 100, 100);

    let timerStatus: 'early' | 'on-time' | 'delayed' = 'on-time';
    if (progress < 30) timerStatus = 'early';
    else if (progress > 100) timerStatus = 'delayed';

    setTimerState({
      elapsed: elapsedSec,
      isRunning: true,
      status: timerStatus,
      progress,
      plannedDuration,
    });
  }, [plannedDuration]);

  // Start timer
  const startTimer = useCallback(() => {
    startTimeRef.current = Date.now();
    setTimerState((prev) => ({ ...prev, isRunning: true, status: 'on-time' }));
    tick();
    intervalRef.current = setInterval(tick, 1000);
  }, [tick]);

  // Stop timer
  const stopTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setTimerState((prev) => ({ ...prev, isRunning: false }));
  }, []);

  // Handle start session
  const handleStart = () => {
    startTimer();
    onStartSession();
  };

  // Handle end session
  const handleEnd = () => {
    stopTimer();
    onEndSession();
  };

  // Format elapsed time
  const formatElapsed = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Status label
  const statusLabel = {
    early: 'Early',
    'on-time': 'On Time',
    delayed: 'Delayed',
  };

  const statusColor = {
    early: 'success' as const,
    'on-time': 'info' as const,
    delayed: 'warning' as const,
  };

  // Progress ring color
  const progressColor = timerState.status === 'delayed' ? '#D97706' : timerState.status === 'early' ? '#16A34A' : '#0EA5E9';

  return (
    <div className="rounded-card border border-nova-border bg-nova-surface p-4 shadow-soft">
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-bold text-nova-text">Live Session</h3>
        <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
          timerState.status === 'delayed' ? 'bg-amber-100 text-amber-700' :
          timerState.status === 'early' ? 'bg-green-100 text-green-700' :
          'bg-blue-100 text-blue-700'
        }`}>
          {statusLabel[timerState.status]}
        </span>
      </div>

      {/* Patient & Service info */}
      <div className="mb-3">
        <p className="text-sm font-semibold text-nova-text">{patientName}</p>
        <p className="text-xs text-nova-text-muted">{serviceName}</p>
      </div>

      {/* Timer display */}
      <div className="mb-4 flex items-center justify-center">
        <div className="relative h-28 w-28">
          {/* Progress circle */}
          <svg className="h-28 w-28 -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50" cy="50" r="45"
              fill="none" stroke="#E8F2F8" strokeWidth="6"
            />
            <circle
              cx="50" cy="50" r="45"
              fill="none"
              stroke={progressColor}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 45}`}
              strokeDashoffset={`${2 * Math.PI * 45 * (1 - timerState.progress / 100)}`}
              className="transition-all duration-1000"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-bold text-nova-text font-mono">
              {formatElapsed(timerState.elapsed)}
            </span>
            <span className="text-[10px] text-nova-text-muted">
              {formatTime(startTime)} - {formatTime(endTime)}
            </span>
          </div>
        </div>
      </div>

      {/* Duration comparison */}
      <div className="mb-4 flex items-center justify-between rounded-lg bg-nova-muted/30 px-3 py-2">
        <div>
          <p className="text-[10px] text-nova-text-muted">Planned</p>
          <p className="text-sm font-bold text-nova-text">{plannedDuration} min</p>
        </div>
        <div className="text-center">
          <p className="text-[10px] text-nova-text-muted">Actual</p>
          <p className="text-sm font-bold text-nova-primary">{formatElapsed(timerState.elapsed)}</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-nova-text-muted">Remaining</p>
          <p className={`text-sm font-bold ${timerState.progress >= 100 ? 'text-nova-error' : 'text-nova-text'}`}>
            {Math.max(0, plannedDuration * 60 - timerState.elapsed)}s
          </p>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-2">
        {!timerState.isRunning ? (
          <Button onClick={handleStart} className="flex-1">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="mr-2">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
            Start Session
          </Button>
        ) : (
          <Button variant="danger" onClick={handleEnd} className="flex-1">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="mr-2">
              <rect x="6" y="6" width="12" height="12" />
            </svg>
            End Session
          </Button>
        )}
      </div>
    </div>
  );
}
