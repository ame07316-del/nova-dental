'use client';

import { useState } from 'react';
import { useAppointments } from './AppointmentProvider';
import { AppointmentStatus } from './types';
import { STATUS_LABELS } from './types';

export function AppointmentFilters() {
  const { filters, setFilters, dentists, services } = useAppointments();
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-nova-text-muted" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="search"
            placeholder="Search patients, dentists, treatments..."
            value={filters.search}
            onChange={(e) => setFilters({ search: e.target.value })}
            className="w-full rounded-lg border border-nova-border bg-nova-surface py-2 pl-10 pr-4 text-sm text-nova-text placeholder:text-nova-text-muted transition-colors focus:border-nova-primary focus:bg-nova-surface focus:outline-none focus:ring-2 focus:ring-nova-primary/20"
          />
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="inline-flex items-center gap-2 rounded-lg border border-nova-border bg-nova-surface px-3 py-2 text-sm font-medium text-nova-text-secondary transition-colors hover:bg-nova-muted"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
          </svg>
          Filters
          <svg className={`transition-transform ${expanded ? 'rotate-180' : ''}`} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>
      </div>

      {expanded && (
        <div className="grid grid-cols-2 gap-3 rounded-lg border border-nova-border bg-nova-surface p-3 sm:grid-cols-4">
          <div>
            <label className="mb-1 block text-[10px] font-semibold uppercase text-nova-text-muted">Dentist</label>
            <select
              value={filters.dentistId}
              onChange={(e) => setFilters({ dentistId: e.target.value })}
              className="w-full rounded-md border border-nova-border bg-nova-surface px-2 py-1.5 text-xs text-nova-text focus:outline-none focus:ring-1 focus:ring-nova-primary"
            >
              <option value="">All Dentists</option>
              {dentists.map((d) => (
                <option key={d.id} value={d.id}>Dr. {d.firstName} {d.lastName}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-[10px] font-semibold uppercase text-nova-text-muted">Service</label>
            <select
              value={filters.serviceId}
              onChange={(e) => setFilters({ serviceId: e.target.value })}
              className="w-full rounded-md border border-nova-border bg-nova-surface px-2 py-1.5 text-xs text-nova-text focus:outline-none focus:ring-1 focus:ring-nova-primary"
            >
              <option value="">All Services</option>
              {services.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-[10px] font-semibold uppercase text-nova-text-muted">Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ status: e.target.value as AppointmentStatus | 'all' })}
              className="w-full rounded-md border border-nova-border bg-nova-surface px-2 py-1.5 text-xs text-nova-text focus:outline-none focus:ring-1 focus:ring-nova-primary"
            >
              <option value="all">All Statuses</option>
              {(Object.keys(STATUS_LABELS) as AppointmentStatus[]).map((s) => (
                <option key={s} value={s}>{STATUS_LABELS[s]}</option>
              ))}
            </select>
          </div>
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <label className="mb-1 block text-[10px] font-semibold uppercase text-nova-text-muted">From</label>
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => setFilters({ dateFrom: e.target.value })}
                className="w-full rounded-md border border-nova-border bg-nova-surface px-2 py-1.5 text-xs text-nova-text focus:outline-none focus:ring-1 focus:ring-nova-primary"
              />
            </div>
            <div className="flex-1">
              <label className="mb-1 block text-[10px] font-semibold uppercase text-nova-text-muted">To</label>
              <input
                type="date"
                value={filters.dateTo}
                onChange={(e) => setFilters({ dateTo: e.target.value })}
                className="w-full rounded-md border border-nova-border bg-nova-surface px-2 py-1.5 text-xs text-nova-text focus:outline-none focus:ring-1 focus:ring-nova-primary"
              />
            </div>
          </div>
        </div>
      )}

      {(filters.dentistId || filters.serviceId || filters.status !== 'all' || filters.dateFrom || filters.dateTo) && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-semibold uppercase text-nova-text-muted">Active filters:</span>
          {filters.dentistId && (
            <button
              onClick={() => setFilters({ dentistId: '' })}
              className="inline-flex items-center gap-1 rounded-full bg-nova-primary/10 px-2 py-0.5 text-[10px] font-medium text-nova-primary"
            >
              {dentists.find((d) => d.id === filters.dentistId)?.firstName} {dentists.find((d) => d.id === filters.dentistId)?.lastName}
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
            </button>
          )}
          {filters.serviceId && (
            <button
              onClick={() => setFilters({ serviceId: '' })}
              className="inline-flex items-center gap-1 rounded-full bg-nova-accent/10 px-2 py-0.5 text-[10px] font-medium text-nova-accent-dark"
            >
              {services.find((s) => s.id === filters.serviceId)?.name}
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
            </button>
          )}
          {filters.status !== 'all' && (
            <button
              onClick={() => setFilters({ status: 'all' })}
              className="inline-flex items-center gap-1 rounded-full bg-nova-muted px-2 py-0.5 text-[10px] font-medium text-nova-text-secondary"
            >
              {STATUS_LABELS[filters.status as AppointmentStatus]}
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
            </button>
          )}
          <button
            onClick={() => setFilters({ search: '', dentistId: '', serviceId: '', status: 'all', dateFrom: '', dateTo: '' })}
            className="text-[10px] font-semibold text-nova-error hover:underline"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
}
