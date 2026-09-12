'use client';

import { useEffect, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  side?: 'left' | 'right';
}

export function Drawer({ open, onClose, title, description, children, size = 'md', side = 'right' }: DrawerProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (open) document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [open, onClose]);

  if (!open) return null;

  const sizeClasses = {
    sm: 'w-full max-w-sm',
    md: 'w-full max-w-lg',
    lg: 'w-full max-w-2xl',
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div
        className={cn(
          'relative z-10 flex h-full flex-col bg-nova-surface shadow-prominent animate-slide-in-right',
          sizeClasses[size],
          side === 'left' && 'mr-auto animate-slide-in-left'
        )}
      >
        <div className="flex items-center justify-between border-b border-nova-border px-6 py-4">
          <div>
            <h2 className="text-lg font-bold text-nova-text">{title}</h2>
            {description && <p className="text-sm text-nova-text-secondary">{description}</p>}
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-nova-text-muted transition-colors hover:bg-nova-muted hover:text-nova-text"
          >
            <X size={18} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-4">{children}</div>
      </div>
    </div>,
    document.body
  );
}
