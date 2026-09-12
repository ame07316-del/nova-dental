'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { ButtonHTMLAttributes, forwardRef } from 'react';

// Button variants using CVA
const buttonVariants = cva(
  'inline-flex items-center justify-center font-semibold rounded-btn transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nova-primary focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
  {
    variants: {
      variant: {
        primary: 'bg-nova-primary text-white hover:bg-nova-primary-dark shadow-soft hover:shadow-elevated',
        'primary-dark': 'bg-nova-primary-dark text-white hover:bg-nova-text shadow-soft',
        secondary: 'bg-nova-surface text-nova-primary border border-nova-primary hover:bg-nova-muted',
        'secondary-dark': 'bg-dark-surface text-dark-text border border-dark-border hover:bg-dark-surface-alt',
        outline: 'bg-transparent text-nova-primary border border-nova-primary hover:bg-nova-primary-light',
        ghost: 'bg-transparent text-nova-text-secondary hover:bg-nova-muted hover:text-nova-text',
        gold: 'bg-nova-accent text-nova-text-dark hover:bg-nova-accent-dark shadow-soft',
        'gold-dark': 'bg-nova-accent-dark text-white hover:opacity-90',
        danger: 'bg-nova-error text-white hover:bg-red-700 shadow-soft',
        success: 'bg-nova-success text-white hover:bg-green-700 shadow-soft',
        small: 'px-3 py-1.5 text-xs',
        'icon-only': 'p-2',
      },
      size: {
        large: 'h-[52px] px-6 text-base',
        lg: 'h-[52px] px-6 text-base',
        medium: 'h-[44px] px-5 text-sm',
        small: 'h-[36px] px-3 text-xs',
        sm: 'h-[36px] px-3 text-xs',
        'icon-only': 'h-[44px] w-[44px]',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'medium',
    },
  }
);

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, isLoading, leftIcon, rightIcon, disabled, children, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        disabled={disabled || isLoading}
        ref={ref}
        {...props}
      >
        {isLoading && (
          <svg className="mr-2 h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {!isLoading && leftIcon && <span className="mr-2">{leftIcon}</span>}
        {children}
        {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
