'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { HTMLAttributes, forwardRef } from 'react';

// Card variants
const cardVariants = cva(
  'bg-nova-surface rounded-card border border-nova-border transition-all duration-200',
  {
    variants: {
      variant: {
        default: 'shadow-flat',
        elevated: 'shadow-elevated hover:shadow-prominent cursor-pointer',
        outline: 'border-2 border-nova-primary shadow-soft',
        minimal: 'border-none shadow-none bg-transparent',
        interactive: 'shadow-soft hover:shadow-elevated hover:border-nova-primary/30 cursor-pointer',
        stat: 'shadow-soft',
        dental: 'bg-gradient-to-br from-nova-primary-light to-nova-surface border border-nova-border',
      },
      padding: {
        none: 'p-0',
        sm: 'p-3',
        md: 'p-4',
        lg: 'p-6',
        xl: 'p-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      padding: 'md',
    },
  }
);

interface CardProps extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof cardVariants> {
  hoverable?: boolean;
  clickable?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, padding, hoverable, clickable, children, ...props }, ref) => {
    return (
      <div
        className={cn(
          cardVariants({ variant, padding, className }),
          hoverable && 'hover:shadow-elevated',
          clickable && 'cursor-pointer'
        )}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

// Card sub-components
export function CardHeader({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('border-b border-nova-border px-6 py-4', className)} {...props}>
      {children}
    </div>
  );
}

export function CardBody({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('px-6 py-4', className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('border-t border-nova-border px-6 py-4 bg-nova-muted/30', className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ className, children, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn('text-lg font-bold text-nova-text', className)} {...props}>
      {children}
    </h3>
  );
}

export function CardDescription({ className, children, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn('text-sm text-nova-text-secondary', className)} {...props}>
      {children}
    </p>
  );
}
