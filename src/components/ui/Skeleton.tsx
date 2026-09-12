'use client';

import { cn } from '@/lib/utils';

// Skeleton loader
interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'card';
  width?: string | number;
  height?: string | number;
  count?: number;
}

export function Skeleton({ className, variant = 'text', width, height, count = 1 }: SkeletonProps) {
  const baseClass = 'animate-shimmer rounded bg-gradient-to-r from-nova-muted via-nova-surface-alt to-nova-muted bg-[length:200%_100%]';

  const variantClasses = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-card',
    card: 'rounded-card h-48',
  };

  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={cn(
            baseClass,
            variantClasses[variant],
            className
          )}
          style={{ width, height }}
        />
      ))}
    </>
  );
}

// Loading spinner
export function LoadingSpinner({ size = 'md', className }: { size?: 'sm' | 'md' | 'lg'; className?: string }) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  return (
    <div className={cn('flex items-center justify-center', className)}>
      <div className={cn('animate-spin rounded-full border-2 border-nova-border border-t-nova-primary', sizeClasses[size])} />
    </div>
  );
}

// Page loading overlay
export function PageLoader() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-nova-bg">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-nova-border border-t-nova-primary" />
        <p className="text-sm text-nova-text-muted">Loading NOVA...</p>
      </div>
    </div>
  );
}

// Inline loading for cards
export function CardSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-card border border-nova-border p-6">
          <Skeleton variant="text" width="60%" height="20" className="mb-4" />
          <Skeleton variant="text" width="100%" height="16" className="mb-2" />
          <Skeleton variant="text" width="80%" height="16" className="mb-4" />
          <Skeleton variant="rectangular" width="100%" height="120" />
        </div>
      ))}
    </div>
  );
}
