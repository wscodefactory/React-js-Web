/**
 * Stores responsive sidebar visibility state.
 * Mobile surfaces consume this context to open and close the slide-over menu.
 */
import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { WithChildren } from '../types/common';

export type SidebarContextType = {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  closeSidebar: () => void;
};

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: WithChildren) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen((prev) => !prev);
  }, []);

  const closeSidebar = useCallback(() => {
    setIsSidebarOpen(false);
  }, []);

  const value = useMemo(
    () => ({ isSidebarOpen, toggleSidebar, closeSidebar }),
    [closeSidebar, isSidebarOpen, toggleSidebar],
  );

  return (
    <SidebarContext.Provider value={value}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
}
