import { useState, useEffect } from 'react';
import CapacityConnectApp from './capacity_connect/CapacityConnectApp';
import Auth from './Auth';
import { auth, signOut } from './firebase';

const SESSION_KEY = 'capacity_connect_active_session';

export default function App() {
  const [view, setView] = useState<'capacity_connect' | 'auth'>('auth');
  const [userName, setUserName] = useState('');
  const [role, setRole] = useState<'TRAINEE' | 'ADMIN' | 'TRAINER'>('TRAINEE');
  const [studentData, setStudentData] = useState<any>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  // Check saved session on mount
  useEffect(() => {
    try {
      const savedSession = localStorage.getItem(SESSION_KEY);
      if (savedSession) {
        const parsed = JSON.parse(savedSession);
        if (parsed && parsed.userName && parsed.role) {
          setUserName(parsed.userName);
          const upper = (parsed.role || 'TRAINEE').toUpperCase();
          if (upper === 'ADMIN') setRole('ADMIN');
          else if (upper === 'TRAINER') setRole('TRAINER');
          else setRole('TRAINEE');

          if (parsed.studentData) {
            setStudentData(parsed.studentData);
          }
          setView('capacity_connect');
        } else {
          setView('auth');
        }
      } else {
        setView('auth');
      }
    } catch {
      setView('auth');
    } finally {
      setIsInitializing(false);
    }
  }, []);

  const handleLogin = (isNew: boolean, name: string, userRole: string, customStudentData?: any) => {
    const upper = userRole.toUpperCase();
    const finalRole: 'TRAINEE' | 'ADMIN' | 'TRAINER' = 
      upper === 'ADMIN' ? 'ADMIN' : upper === 'TRAINER' ? 'TRAINER' : 'TRAINEE';

    setUserName(name);
    setRole(finalRole);
    if (customStudentData) {
      setStudentData(customStudentData);
    }

    // Persist session to localStorage so page refresh or re-opening stays logged in
    try {
      const sessionPayload = {
        userName: name,
        role: finalRole,
        studentData: customStudentData || null,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem(SESSION_KEY, JSON.stringify(sessionPayload));
    } catch (e) {
      console.warn('Failed to persist session to localStorage', e);
    }

    setView('capacity_connect');
  };

  const handleLogout = async () => {
    // ONLY sign out when user explicitly clicks Sign Out
    try {
      localStorage.removeItem(SESSION_KEY);
      await signOut(auth);
    } catch (e) {
      console.warn('Sign out notice:', e);
    }
    setUserName('');
    setRole('TRAINEE');
    setStudentData(null);
    setView('auth');
  };

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (view === 'auth') {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <CapacityConnectApp
      onLogout={handleLogout}
      initialRole={role}
      initialName={userName}
      initialStudentData={studentData}
    />
  );
}

