import { RouterProvider } from 'react-router';
import { AuthProvider } from './context/AuthContext';
import { DarkModeProvider } from './context/DarkModeContext';
import { LanguageProvider } from './context/LanguageContext';
import { SidebarProvider } from './context/SidebarContext';
import { router } from './routes';

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <DarkModeProvider>
          <SidebarProvider>
            <RouterProvider router={router} />
          </SidebarProvider>
        </DarkModeProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}
