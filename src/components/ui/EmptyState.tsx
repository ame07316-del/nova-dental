'use client';

import { cn } from '@/lib/utils';
import { Button } from './Button';

// Empty State component
interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({
  title = 'No data available',
  description = 'There are no records to display.',
  icon,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn(
      'flex flex-col items-center justify-center rounded-card border border-dashed border-nova-border bg-nova-muted/30 p-12 text-center',
      className
    )}>
      <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-nova-muted">
        {icon || (
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-nova-text-muted">
            <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
            <polyline points="13 2 13 9 20 9" />
          </svg>
        )}
      </div>
      <h3 className="text-lg font-semibold text-nova-text">{title}</h3>
      <p className="mt-2 text-sm text-nova-text-secondary">{description}</p>
      {action && (
        <div className="mt-6">
          <Button onClick={action.onClick}>{action.label}</Button>
        </div>
      )}
    </div>
  );
}

// Error State component
interface ErrorStateProps {
  title?: string;
  message?: string;
  errorCode?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = 'Something went wrong',
  message = 'An unexpected error occurred. Please try again.',
  errorCode,
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div className={cn(
      'flex flex-col items-center justify-center rounded-card border border-red-200 bg-red-50/50 p-12 text-center dark:border-red-900/30 dark:bg-red-950/20',
      className
    )}>
      <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="1.5">
          <circle cx="12" cy="12" r="10" />
          <line x1="15" y1="9" x2="9" y2="15" />
          <line x1="9" y1="9" x2="15" y2="15" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-nova-text">{title}</h3>
      <p className="mt-2 text-sm text-nova-text-secondary">{message}</p>
      {errorCode && (
        <p className="mt-1 font-mono text-xs text-nova-text-muted">Error: {errorCode}</p>
      )}
      {onRetry && (
        <div className="mt-6">
          <Button variant="outline" onClick={onRetry}>
            Try Again
          </Button>
        </div>
      )}
    </div>
  );
}

// Success State component
interface SuccessStateProps {
  title?: string;
  message?: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function SuccessState({
  title = 'Success!',
  message = 'Your action has been completed successfully.',
  icon,
  action,
  className,
}: SuccessStateProps) {
  return (
    <div className={cn(
      'flex flex-col items-center justify-center rounded-card border border-green-200 bg-green-50/50 p-12 text-center dark:border-green-900/30 dark:bg-green-950/20',
      className
    )}>
      <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30 animate-fade-in">
        {icon || (
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="1.5">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        )}
      </div>
      <h3 className="text-lg font-semibold text-nova-text">{title}</h3>
      <p className="mt-2 text-sm text-nova-text-secondary">{message}</p>
      {action && (
        <div className="mt-6">
          <Button onClick={action.onClick}>{action.label}</Button>
        </div>
      )}
    </div>
  );
}

// Loading overlay component
interface LoadingOverlayProps {
  message?: string;
  className?: string;
}

export function LoadingOverlay({ message = 'Loading...', className }: LoadingOverlayProps) {
  return (
    <div className={cn(
      'fixed inset-0 z-50 flex items-center justify-center bg-nova-bg/80 backdrop-blur-sm',
      className
    )}>
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-nova-border border-t-nova-primary" />
        <p className="text-sm text-nova-text-muted">{message}</p>
      </div>
    </div>
  );
}
