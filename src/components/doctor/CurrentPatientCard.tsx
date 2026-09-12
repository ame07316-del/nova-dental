'use client';

import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/dental/AvatarsAndMore';
import { SessionTimer } from './SessionTimer';
import { useLiveData } from '@/hooks/useLiveData';
import { startLiveSession, endLiveSession } from '@/app/actions';
import { notify } from '@/components/ui/Notification';
import { useCallback } from 'react';

export function CurrentPatientCard() {
  const { patients, appointments, sessions, services, loading, refetch } = useLiveData('mine');

  const activeSessions = sessions.filter((s) => s.status === 'active');
  const currentSession = activeSessions[0];

  const currentAppointment = currentSession
    ? appointments.find((a) => a.id === currentSession.appointmentId)
    : null;

  const currentPatient = currentAppointment
    ? patients.find((p) => p.id === currentAppointment.patientId)
    : null;

  const today = new Date().toISOString().split('T')[0];
  const todaysAppointments = appointments.filter(
    (a) => a.date === today && (a.status === 'confirmed' || a.status === 'pending')
  );

  const serviceDuration = currentAppointment
    ? services.find((s) => s.id === currentAppointment.serviceId)?.durationMinutes ?? 30
    : 30;

  const handleStartSession = useCallback(async () => {
    const target = currentAppointment ?? todaysAppointments[0];
    if (!target) {
      notify('info', 'No appointment', 'No appointment is ready to start right now.');
      return;
    }
    const res = await startLiveSession(target.id);
    if (res.ok) {
      notify('success', 'Session Started', `Session with ${target.patientName} has started.`);
      void refetch();
    } else {
      notify('error', 'Start failed', res.error);
    }
  }, [currentAppointment, todaysAppointments, refetch]);

  const handleEndSession = useCallback(async () => {
    if (!currentSession) return;
    const res = await endLiveSession(currentSession.id);
    if (res.ok) {
      notify('success', 'Session Ended', 'Session completed and saved.');
      void refetch();
    } else {
      notify('error', 'End failed', res.error);
    }
  }, [currentSession, refetch]);

  return (
    <Card variant="dental" className="p-4">
      <CardHeader>
        <CardTitle className="text-sm">Current Patient</CardTitle>
      </CardHeader>
      <CardBody className="space-y-4">
        {loading ? (
          <div className="flex items-center justify-center gap-2 py-4 text-sm text-nova-text-muted">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-nova-border border-t-nova-primary" />
            Loading…
          </div>
        ) : currentPatient && currentAppointment && currentSession ? (
          <>
            <div className="flex items-center gap-3">
              <Avatar name={`${currentPatient.firstName} ${currentPatient.lastName}`} size="lg" />
              <div>
                <h3 className="text-base font-bold text-nova-text">
                  {currentPatient.firstName} {currentPatient.lastName}
                </h3>
                <p className="text-xs text-nova-text-muted">{currentPatient.email}</p>
                <div className="mt-1 flex items-center gap-2">
                  <Badge variant="success" dot>Active</Badge>
                  <span className="text-xs text-nova-text-secondary">
                    {currentAppointment.serviceName}
                  </span>
                </div>
              </div>
            </div>

            <SessionTimer
              sessionId={currentSession.id}
              appointmentId={currentSession.appointmentId}
              dentistId={currentSession.dentistId}
              patientName={`${currentPatient.firstName} ${currentPatient.lastName}`}
              serviceName={currentAppointment.serviceName}
              plannedDuration={serviceDuration}
              startTime={currentAppointment.startTime}
              endTime={currentAppointment.endTime}
              status={currentSession.status as any}
              onStartSession={handleStartSession}
              onEndSession={handleEndSession}
            />

            <div className="rounded-lg bg-nova-muted/30 p-3">
              <h4 className="text-xs font-semibold text-nova-text-secondary mb-2">Patient Summary</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <p className="text-nova-text-muted">Age</p>
                  <p className="font-semibold text-nova-text">
                    {currentPatient.dateOfBirth
                      ? new Date().getFullYear() - new Date(currentPatient.dateOfBirth).getFullYear()
                      : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-nova-text-muted">Gender</p>
                  <p className="font-semibold text-nova-text capitalize">{currentPatient.gender ?? 'N/A'}</p>
                </div>
                <div>
                  <p className="text-nova-text-muted">Insurance</p>
                  <p className="font-semibold text-nova-text">{currentPatient.insuranceProvider ?? 'N/A'}</p>
                </div>
                <div>
                  <p className="text-nova-text-muted">Allergies</p>
                  <p className="font-semibold text-nova-text">{currentPatient.allergies ?? 'N/A'}</p>
                </div>
              </div>
            </div>
          </>
        ) : todaysAppointments.length > 0 ? (
          <div className="space-y-4 text-center">
            <p className="text-sm text-nova-text-muted">No active session. Start a session for the next appointment:</p>
            <div className="space-y-2">
              {todaysAppointments.slice(0, 2).map((apt) => (
                <div key={apt.id} className="flex items-center justify-between rounded-lg border border-nova-border bg-nova-surface p-3">
                  <div className="text-left">
                    <p className="text-sm font-semibold text-nova-text">{apt.patientName}</p>
                    <p className="text-xs text-nova-text-muted">{apt.serviceName} • {apt.startTime}</p>
                  </div>
                  <Button size="sm" onClick={() => void startLiveSession(apt.id).then((r) => { if (r.ok) { notify('success', 'Session Started', `Started session for ${apt.patientName}.`); void refetch(); } else notify('error', 'Failed', r.error); })}>
                    Start
                  </Button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="py-6 text-center">
            <p className="text-sm text-nova-text-muted">No active session</p>
          </div>
        )}
      </CardBody>
    </Card>
  );
}
