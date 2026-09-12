'use client';

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import { useAuth } from './AuthProvider';

// App context for global state
interface AppContextType {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  notifications: Array<{ id: string; type: string; message: string; time: string }>;
  addNotification: (type: string, message: string) => void;
  removeNotification: (id: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState<Array<{ id: string; type: string; message: string; time: string }>>([]);

  // On desktop, start with the sidebar open.
  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth >= 768) {
      setSidebarOpen(true);
    }
  }, []);

  const toggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => !prev);
  }, []);

  const addNotification = useCallback((type: string, message: string) => {
    const id = Date.now().toString();
    setNotifications((prev) => [...prev, { id, type, message, time: new Date().toLocaleTimeString() }]);

    // Auto-remove after 5 seconds
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 5000);
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  return (
    <AppContext.Provider
      value={{
        sidebarOpen,
        toggleSidebar,
        notifications,
        addNotification,
        removeNotification,
      }}
    >
      <div className="min-h-screen bg-nova-bg">
        {children}
      </div>
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
