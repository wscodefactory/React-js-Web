import { RouterProvider } from 'react-router';
import { AuthProvider } from './context/AuthContext';
import { DarkModeProvider } from './context/DarkModeContext';
import { LanguageProvider } from './context/LanguageContext';
import { SidebarProvider } from './context/SidebarContext';
import { SiteSettingsProvider } from './context/SiteSettingsContext';
import { WorkspaceSyncProvider } from './context/WorkspaceSyncContext';
import { NotificationProvider } from './context/NotificationContext';
import { router } from './routes';

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <NotificationProvider>
          <WorkspaceSyncProvider>
            <SiteSettingsProvider>
              <DarkModeProvider>
                <SidebarProvider>
                  <RouterProvider router={router} />
                </SidebarProvider>
              </DarkModeProvider>
            </SiteSettingsProvider>
          </WorkspaceSyncProvider>
        </NotificationProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}
