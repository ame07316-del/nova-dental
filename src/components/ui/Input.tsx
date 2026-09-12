'use client';

import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes, type SelectHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: boolean;
  success?: boolean;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, success, helperText, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="mb-1.5 block text-sm font-semibold text-nova-text">
            {label}
            {props.required && <span className="ml-1 text-nova-error">*</span>}
          </label>
        )}
        <input
          id={inputId}
          className={cn(
            'w-full rounded-input border bg-nova-surface px-4 py-2.5 text-sm text-nova-text transition-all duration-200 placeholder:text-nova-text-muted focus:outline-none',
            !error && !success && 'border-nova-border focus:border-nova-primary focus:ring-2 focus:ring-nova-primary/20',
            error && 'border-nova-error focus:border-nova-error focus:ring-2 focus:ring-red-200',
            success && 'border-nova-success focus:border-nova-success focus:ring-2 focus:ring-green-200'
          )}
          ref={ref}
          {...props}
        />
        {helperText && (
          <p className={cn('mt-1 text-xs', error ? 'text-nova-error' : 'text-nova-text-muted')}>
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

// Textarea
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string; error?: boolean; success?: boolean; helperText?: string }>(
  ({ className, label, error, success, helperText, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="mb-1.5 block text-sm font-semibold text-nova-text">
            {label}
            {props.required && <span className="ml-1 text-nova-error">*</span>}
          </label>
        )}
        <textarea
          id={inputId}
          className={cn(
            'w-full min-h-[120px] rounded-input border bg-nova-surface px-4 py-2.5 text-sm text-nova-text transition-all duration-200 placeholder:text-nova-text-muted focus:outline-none',
            !error && !success && 'border-nova-border focus:border-nova-primary focus:ring-2 focus:ring-nova-primary/20',
            error && 'border-nova-error focus:border-nova-error focus:ring-2 focus:ring-red-200',
            success && 'border-nova-success focus:border-nova-success focus:ring-2 focus:ring-green-200'
          )}
          ref={ref}
          {...props}
        />
        {helperText && (
          <p className={cn('mt-1 text-xs', error ? 'text-nova-error' : 'text-nova-text-muted')}>
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

// Select
interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options?: Array<{ value: string; label: string }>;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, options = [], id, children, ...props }, ref) => {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={selectId} className="mb-1.5 block text-sm font-semibold text-nova-text">
            {label}
          </label>
        )}
        <select
          id={selectId}
          className={cn(
            'w-full rounded-input border border-nova-border bg-nova-surface px-4 py-2.5 text-sm text-nova-text transition-all duration-200 focus:outline-none focus:border-nova-primary focus:ring-2 focus:ring-nova-primary/20',
            className
          )}
          ref={ref}
          {...props}
        >
          {options.length > 0
            ? options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))
            : children}
        </select>
      </div>
    );
  }
);

Select.displayName = 'Select';
