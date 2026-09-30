import { useState } from 'react';
import CapacityConnectApp from './capacity_connect/CapacityConnectApp';
import Auth from './Auth';

export default function App() {
  const [view, setView] = useState<'capacity_connect' | 'auth'>('capacity_connect');
  const [userName, setUserName] = useState('Bhavya Shree D');
  const [role, setRole] = useState<'TRAINEE' | 'ADMIN' | 'TRAINER'>('TRAINEE');
  const [studentData, setStudentData] = useState<any>(null);

  const handleLogin = (isNew: boolean, name: string, userRole: string, customStudentData?: any) => {
    setUserName(name);
    const upper = userRole.toUpperCase();
    if (upper === 'ADMIN') setRole('ADMIN');
    else if (upper === 'TRAINER') setRole('TRAINER');
    else setRole('TRAINEE');

    if (customStudentData) {
      setStudentData(customStudentData);
    }
    setView('capacity_connect');
  };

  const handleLogout = () => {
    setView('auth');
  };

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
