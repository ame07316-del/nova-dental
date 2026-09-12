'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';
import { cn } from '@/lib/utils';

// Avatar component
interface AvatarProps {
  src?: string;
  alt?: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const avatarColors = ['bg-nova-primary', 'bg-emerald-600', 'bg-violet-600', 'bg-amber-600', 'bg-rose-600', 'bg-cyan-700'];

export function Avatar({ src, alt, name, size = 'md', className }: AvatarProps) {
  const sizeClasses = { sm: 'h-8 w-8 text-xs', md: 'h-10 w-10 text-sm', lg: 'h-14 w-14 text-base' };
  const initial = name ? name.charAt(0).toUpperCase() : '?';
  const colorIndex = name ? name.charCodeAt(0) % avatarColors.length : 0;

  if (src) {
    return (
      <Image
        src={src}
        alt={alt || name || 'Avatar'}
        width={64}
        height={64}
        className={cn(`rounded-full object-cover ${sizeClasses[size]}`, className)}
      />
    );
  }

  return (
    <div
      className={cn(
        `inline-flex items-center justify-center rounded-full font-semibold text-white ${sizeClasses[size]}`,
        avatarColors[colorIndex],
        className
      )}
    >
      {initial}
    </div>
  );
}

// Badge component
interface ChipProps {
  label: string;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info';
  className?: string;
  onRemove?: () => void;
}

export function Chip({ label, variant = 'default', className, onRemove }: ChipProps) {
  const variants = {
    default: 'bg-nova-muted text-nova-text-secondary',
    primary: 'bg-nova-primary-light text-nova-primary-dark',
    success: 'bg-green-100 text-green-700',
    warning: 'bg-amber-100 text-amber-700',
    error: 'bg-red-100 text-red-700',
    info: 'bg-blue-100 text-blue-700',
  };

  return (
    <span className={cn(`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${variants[variant]}`, className)}>
      {label}
      {onRemove && (
        <button onClick={onRemove} className="ml-1 rounded-full hover:bg-black/20" aria-label={`Remove ${label}`}>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      )}
    </span>
  );
}

// Divider component
interface DividerProps {
  className?: string;
  orientation?: 'horizontal' | 'vertical';
}

export function Divider({ className, orientation = 'horizontal' }: DividerProps) {
  return (
    <hr className={cn(
      'border-nova-border',
      orientation === 'horizontal' ? 'my-4 w-full' : 'mx-4 h-full',
      className
    )} />
  );
}

// Spinner component
interface SpinnerProps {
  size?: number;
  className?: string;
}

export function Spinner({ size = 24, className }: SpinnerProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={cn('animate-spin', className)}
    >
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" opacity="0.25" />
      <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

// Toggle component
interface ToggleProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  size?: 'sm' | 'md';
  className?: string;
}

export function Toggle({ enabled, onToggle, size = 'md', className }: ToggleProps) {
  const trackSize = size === 'sm' ? 'h-6 w-10' : 'h-8 w-14';
  const thumbSize = size === 'sm' ? 'h-4 w-4' : 'h-6 w-6';

  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      onClick={() => onToggle(!enabled)}
      className={cn(
        `relative inline-flex ${trackSize} flex-shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nova-primary focus-visible:ring-offset-2`,
        enabled ? 'bg-nova-primary' : 'bg-nova-border',
        className
      )}
    >
      <span className={cn(
        `pointer-events-none inline-block rounded-full bg-white shadow-ring ring-0 transition duration-200 ease-in-out`,
        size === 'sm' ? 'translate-x-1' : 'translate-x-1'
      )}
        style={{ transform: enabled ? `translateX(${size === 'sm' ? 16 : 24}px)` : 'translateX(0)' }}
      />
    </button>
  );
}

// Gallery grid component
export function GalleryGrid() {
  const [images] = useState([
    { id: 1, title: 'Smile Transformation', category: 'cosmetic', status: 'featured' },
    { id: 2, title: 'Dental Implant', category: 'restorative', status: 'completed' },
    { id: 3, title: 'Teeth Whitening', category: 'cosmetic', status: 'in-progress' },
    { id: 4, title: 'Root Canal', category: 'restorative', status: 'completed' },
    { id: 5, title: 'Invisalign', category: 'orthodontics', status: 'in-progress' },
    { id: 6, title: 'Gum Treatment', category: 'preventive', status: 'pending' },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-nova-text">Gallery</h1>
          <p className="text-sm text-nova-text-secondary">Before & after smile transformations</p>
        </div>
        <Input placeholder="Search gallery..." className="max-w-sm" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((image) => (
          <Card key={image.id} variant="interactive" className="overflow-hidden p-0">
            <div className="h-48 bg-gradient-to-br from-nova-primary-light to-nova-muted" />
            <CardBody>
              <CardTitle>{image.title}</CardTitle>
              <div className="mt-2 flex items-center justify-between">
                <Badge variant={
                  image.status === 'featured' ? 'gold' :
                  image.status === 'completed' ? 'success' :
                  image.status === 'in-progress' ? 'warning' : 'pending'
                } dot>
                  {image.status}
                </Badge>
                <Badge variant="outline">{image.category}</Badge>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}

// Patient list component
export function PatientList() {
  const [patients] = useState([
    { id: 1, firstName: 'Ahmed', lastName: 'Hassan', email: 'ahmed@example.com', status: 'active' },
    { id: 2, firstName: 'Sarah', lastName: 'Johnson', email: 'sarah@example.com', status: 'active' },
    { id: 3, firstName: 'Mohamed', lastName: 'Ali', email: 'mohamed@example.com', status: 'inactive' },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-nova-text">Patients</h1>
          <p className="text-sm text-nova-text-secondary">Manage patient records</p>
        </div>
        <Button>Add Patient</Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {patients.map((patient) => (
          <Card key={patient.id} variant="interactive">
            <CardBody>
              <div className="flex items-center gap-3">
                <Avatar name={`${patient.firstName} ${patient.lastName}`} size="md" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-nova-text">{patient.firstName} {patient.lastName}</p>
                  <p className="text-xs text-nova-text-muted">{patient.email}</p>
                </div>
                <Badge variant={patient.status === 'active' ? 'success' : 'default'} dot>
                  {patient.status}
                </Badge>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}
