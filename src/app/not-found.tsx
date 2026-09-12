import { notFound } from 'next/navigation';

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-nova-bg">
      <div className="flex flex-col items-center gap-6 text-center">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-nova-muted">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#0EA5E9" strokeWidth="1.5">
            <circle cx="12" cy="12" r="10" />
            <path d="M16 16s-1.5-2-4-2-4 2-4 2" />
            <line x1="9" y1="9" x2="9.01" y2="9" />
            <line x1="15" y1="9" x2="15.01" y2="9" />
          </svg>
        </div>
        <div>
          <h1 className="text-6xl font-bold text-nova-text">404</h1>
          <h2 className="mt-2 text-2xl font-bold text-nova-text">Page Not Found</h2>
          <p className="mt-2 text-sm text-nova-text-secondary">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
        </div>
        <div className="flex gap-3">
          <a href="/dashboard" className="btn btn-primary">
            Go to Dashboard
          </a>
          <a href="/" className="btn btn-outline">
            Home
          </a>
        </div>
      </div>
    </div>
  );
}
