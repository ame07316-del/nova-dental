'use client';

import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Avatar } from '@/components/dental/AvatarsAndMore';
import { cn } from '@/lib/utils';
import { formatTime } from '@/lib/utils';
import type { Appointment } from '@/lib/supabase/types';

interface DoctorAppointmentCardProps {
  appointment: Appointment;
  variant?: 'upcoming' | 'today' | 'history';
  onStartSession?: () => void;
  onComplete?: () => void;
  onViewDetails?: () => void;
}

export function DoctorAppointmentCard({
  appointment,
  variant = 'today',
  onStartSession,
  onComplete,
  onViewDetails,
}: DoctorAppointmentCardProps) {
  const statusVariant = {
    confirmed: 'success' as const,
    pending: 'warning' as const,
    'in-progress': 'info' as const,
    completed: 'default' as const,
    cancelled: 'error' as const,
    'no-show': 'default' as const,
    rescheduled: 'primary' as const,
    waiting: 'warning' as const,
    delayed: 'warning' as const,
  };

  return (
    <Card
      variant={variant === 'history' ? 'minimal' : 'interactive'}
      className={cn(
        'p-4 transition-all duration-200',
        variant === 'history' && 'opacity-75'
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Avatar
            name={appointment.patientName}
            size="md"
          />
          <div className="flex-1">
            <p className="text-sm font-semibold text-nova-text">{appointment.patientName}</p>
            <p className="text-xs text-nova-text-muted">{appointment.serviceName}</p>
            <div className="mt-1 flex items-center gap-2 text-xs">
              <span className="text-nova-text-secondary">{appointment.startTime}</span>
              <span className="text-nova-text-muted">•</span>
              <span className="text-nova-text-muted">{appointment.treatmentType}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <Badge variant={statusVariant[appointment.status]} dot>
            {appointment.status}
          </Badge>
          {variant !== 'history' && (
            <div className="flex gap-1">
              {appointment.status === 'confirmed' && onStartSession && (
                <Button size="sm" onClick={onStartSession}>
                  Start
                </Button>
              )}
              {appointment.status === 'in-progress' && onComplete && (
                <Button variant="success" size="sm" onClick={onComplete}>
                  Done
                </Button>
              )}
              {onViewDetails && (
                <Button variant="ghost" size="sm" onClick={onViewDetails}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
