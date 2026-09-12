'use client';

import { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// Badge variants
const badgeVariants = cva(
  'inline-flex items-center justify-center rounded-badge font-semibold',
  {
    variants: {
      variant: {
        default: 'bg-nova-muted text-nova-text-secondary',
        primary: 'bg-nova-primary-light text-nova-primary-dark',
        success: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
        warning: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
        error: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
        info: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
        confirmed: 'bg-green-100 text-green-700 dark:bg-green-900/30',
        pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30',
        completed: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30',
        cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/30',
        'in-progress': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30',
        urgent: 'bg-red-100 text-red-700 dark:bg-red-900/30 border border-red-300',
        vip: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30',
        gold: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
        outline: 'border border-nova-border text-nova-text-secondary',
      },
      size: {
        sm: 'px-2 py-0.5 text-[10px]',
        md: 'px-2.5 py-1 text-xs',
        lg: 'px-3 py-1.5 text-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {
  dot?: boolean;
  icon?: React.ReactNode;
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, size, dot, icon, children, ...props }, ref) => {
    return (
      <span
        className={cn(badgeVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {dot && (
          <span className="mr-1.5 flex h-1.5 w-1.5 rounded-full bg-current" />
        )}
        {icon && <span className="mr-1">{icon}</span>}
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

// Status badge with config mapping
export function StatusBadge({ status }: { status: string }) {
  const statusMap: Record<string, string> = {
    confirmed: 'confirmed',
    pending: 'pending',
    'in-progress': 'in-progress',
    completed: 'completed',
    cancelled: 'cancelled',
    'no-show': 'no-show',
    rescheduled: 'rescheduled',
    urgent: 'urgent',
    vip: 'vip',
  };

  const mappedStatus = statusMap[status] || 'default';

  return (
    <Badge variant={mappedStatus as any} dot>
      {status.replace('-', ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
    </Badge>
  );
}
