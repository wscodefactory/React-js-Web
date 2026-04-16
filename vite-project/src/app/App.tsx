/**
 * Root application component that wires global providers and the router.
 * Keep cross-cutting providers here so route modules stay focused on UI concerns.
 */
import { RouterProvider } from 'react-router';
import { DarkModeProvider } from './context/DarkModeContext';
import { SidebarProvider } from './context/SidebarContext';
import { router } from './routes';

export default function App() {
  return (
    <DarkModeProvider>
      <SidebarProvider>
        <RouterProvider router={router} />
      </SidebarProvider>
    </DarkModeProvider>
  );
}