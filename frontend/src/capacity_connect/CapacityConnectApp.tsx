import React from 'react';
import { PlatformProvider, usePlatform } from './PlatformContext';
import { Navbar } from './Navbar';
import { TraineeProfile } from './trainee/TraineeProfile';
import { IdeationPortfolio } from './trainee/IdeationPortfolio';
import { TraineeLibrary } from './trainee/TraineeLibrary';
import { TraineeAssessments } from './trainee/TraineeAssessments';
import { TrainerProfile } from './trainer/TrainerProfile';
import { TrainerQuestionnaires } from './trainer/TrainerQuestionnaires';
import { TrainerMonitor } from './trainer/TrainerMonitor';
import { TrainerLibraryManager } from './trainer/TrainerLibraryManager';
import { AdminUserApproval } from './admin/AdminUserApproval';
import { AdminRoleManagement } from './admin/AdminRoleManagement';
import { AdminExecutiveDashboard } from './admin/AdminExecutiveDashboard';
import { AdminHomepagePublisher } from './admin/AdminHomepagePublisher';
import { AdminCompetencyMapping } from './admin/AdminCompetencyMapping';
import {
  Sparkles, Trophy, BookOpen, Bell, ArrowRight, ShieldCheck,
  CheckCircle2, Compass, Users
} from 'lucide-react';

const MainContent: React.FC<{
  onLogout?: () => void;
  initialRole?: 'TRAINEE' | 'ADMIN' | 'TRAINER';
  initialName?: string;
  initialStudentData?: any;
}> = ({
  onLogout,
  initialRole,
  initialName,
  initialStudentData
}) => {
  const {
    currentRole,
    setCurrentRole,
    activeNavTab,
    announcements,
    initializeUserProfile
  } = usePlatform();

  React.useEffect(() => {
    if (initialName) {
      initializeUserProfile({
        fullName: initialName,
        email: initialStudentData?.email || `${initialName.toLowerCase().replace(/\s+/g, '.')}@gmail.com`,
        role: initialRole || 'TRAINEE',
        studentData: initialStudentData
      });
    }
  }, [initialName, initialRole]);

  // Homepage Highlights (Achievements & Newly Added Learning Content)
  const achievements = announcements.filter(a => a.category === 'Achievement' && a.active);
  const newContent = announcements.filter(a => a.category === 'New Learning Content' && a.active);

  const renderActiveView = () => {
    // Trainee views
    if (activeNavTab === 'profile') return <TraineeProfile />;
    if (activeNavTab === 'portfolio') return <IdeationPortfolio />;
    if (activeNavTab === 'assessments') return <TraineeAssessments />;
    if (activeNavTab === 'library') return <TraineeLibrary />;

    // Trainer views
    if (activeNavTab === 'trainer_profile') return <TrainerProfile />;
    if (activeNavTab === 'trainer_questionnaires') return <TrainerQuestionnaires />;
    if (activeNavTab === 'trainer_monitor') return <TrainerMonitor />;
    if (activeNavTab === 'trainer_library_manage') return <TrainerLibraryManager />;

    // Admin views
    if (activeNavTab === 'admin_dashboard') return <AdminExecutiveDashboard />;
    if (activeNavTab === 'admin_user_approval') return <AdminUserApproval />;
    if (activeNavTab === 'admin_role_management') return <AdminRoleManagement />;
    if (activeNavTab === 'admin_homepage_publisher') return <AdminHomepagePublisher />;
    if (activeNavTab === 'admin_competency_mapping') return <AdminCompetencyMapping />;

    // Default fallback
    if (currentRole === 'TRAINEE') return <TraineeProfile />;
    if (currentRole === 'TRAINER') return <TrainerProfile />;
    return <AdminExecutiveDashboard />;
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans text-slate-900 selection:bg-slate-900 selection:text-white">
      <Navbar onLogout={onLogout} />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Dynamic Persona View */}
        {renderActiveView()}
      </main>

      {/* Accessible Footer */}
      <footer className="bg-white border-t border-gray-100 py-6 text-xs text-gray-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-semibold text-gray-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Capacity Connect Platform</span>
            <span>•</span>
            <span className="text-gray-400">Scalable, Secure & Accessible Across All Devices</span>
          </div>

          <div className="flex items-center gap-4 text-gray-400">
            <span>Competency Mapping Active</span>
            <span>•</span>
            <span>Role-Based Access Control</span>
            <span>•</span>
            <span>v2.4 Production Ready</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function CapacityConnectApp({
  onLogout,
  initialRole,
  initialName,
  initialStudentData
}: {
  onLogout?: () => void;
  initialRole?: 'TRAINEE' | 'ADMIN' | 'TRAINER';
  initialName?: string;
  initialStudentData?: any;
} = {}) {
  return (
    <PlatformProvider>
      <MainContent
        onLogout={onLogout}
        initialRole={initialRole}
        initialName={initialName}
        initialStudentData={initialStudentData}
      />
    </PlatformProvider>
  );
}
