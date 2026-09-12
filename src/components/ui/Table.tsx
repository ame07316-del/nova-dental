'use client';

import { cn } from '@/lib/utils';

// Table component
interface TableProps {
  headers: Array<{ key: string; label: string; className?: string }>;
  data: Record<string, any>[];
  renderRow?: (row: Record<string, any>, index: number) => React.ReactNode;
  className?: string;
  loading?: boolean;
  emptyMessage?: string;
}

export function Table({
  headers,
  data,
  renderRow,
  className,
  loading = false,
  emptyMessage = 'No data available',
}: TableProps) {
  return (
    <div className="overflow-x-auto rounded-card border border-nova-border">
      <table className="w-full min-w-[600px]">
        <thead>
          <tr className="border-b border-nova-border bg-nova-muted/50">
            {headers.map((header) => (
              <th
                key={header.key}
                className={cn(
                  'px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-nova-text-secondary',
                  header.className
                )}
              >
                {header.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-nova-border">
          {loading ? (
            <tr>
              <td colSpan={headers.length} className="px-4 py-12 text-center">
                <div className="inline-flex h-8 w-8 animate-spin rounded-full border-2 border-nova-primary border-t-transparent" />
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={headers.length} className="px-4 py-12 text-center text-nova-text-muted">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, index) => (
              <tr
                key={index}
                className="transition-colors hover:bg-nova-muted/30"
              >
                {renderRow ? (
                  renderRow(row, index)
                ) : (
                  headers.map((header) => (
                    <td key={header.key} className="px-4 py-3 text-sm text-nova-text">
                      {row[header.key]}
                    </td>
                  ))
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

// Compact Table variant
export function TableCompact({
  headers,
  data,
  renderCell,
  className,
}: {
  headers: Array<{ key: string; label: string }>;
  data: Record<string, any>[];
  renderCell?: (row: Record<string, any>, header: string) => React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('rounded-card border border-nova-border', className)}>
      <table className="w-full">
        <thead>
          <tr className="border-b border-nova-border">
            {headers.map((h) => (
              <th key={h.key} className="px-3 py-2 text-left text-xs font-semibold uppercase text-nova-text-secondary">
                {h.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-nova-border">
          {data.map((row, i) => (
            <tr key={i} className="hover:bg-nova-muted/30 transition-colors">
              {headers.map((h) => (
                <td key={h.key} className="px-3 py-2 text-sm text-nova-text">
                  {renderCell ? renderCell(row, h.key) : row[h.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Appointment-specific table
export function AppointmentTable({ appointments }: { appointments: any[] }) {
  return (
    <Table
      headers={[
        { key: 'patient', label: 'Patient' },
        { key: 'date', label: 'Date' },
        { key: 'time', label: 'Time' },
        { key: 'dentist', label: 'Dentist' },
        { key: 'treatment', label: 'Treatment' },
        { key: 'status', label: 'Status' },
        { key: 'actions', label: 'Actions', className: 'text-right' },
      ]}
      data={appointments}
      renderRow={(row) => (
        <>
          <td className="px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-nova-primary-light text-nova-primary-dark text-xs font-bold">
                {row.patientName?.charAt(0) || '?'}
              </div>
              <div>
                <p className="text-sm font-medium text-nova-text">{row.patientName}</p>
                <p className="text-xs text-nova-text-muted">{row.patientEmail}</p>
              </div>
            </div>
          </td>
          <td className="px-4 py-3 text-sm text-nova-text">{row.date}</td>
          <td className="px-4 py-3 text-sm text-nova-text">{row.time}</td>
          <td className="px-4 py-3 text-sm text-nova-text">{row.dentistName}</td>
          <td className="px-4 py-3 text-sm text-nova-text">{row.treatmentType}</td>
          <td className="px-4 py-3">
            <span className="status-badge">{row.status}</span>
          </td>
          <td className="px-4 py-3 text-right">
            <div className="flex items-center justify-end gap-2">
              <button className="rounded-md p-1.5 text-nova-text-muted hover:bg-nova-muted hover:text-nova-text transition-colors" title="View">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
                </svg>
              </button>
              <button className="rounded-md p-1.5 text-nova-text-muted hover:bg-nova-muted hover:text-nova-text transition-colors" title="Edit">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
              </button>
            </div>
          </td>
        </>
      )}
    />
  );
}
