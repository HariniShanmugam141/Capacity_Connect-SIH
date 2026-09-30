import React, { useState } from 'react';
import { usePlatform } from './PlatformContext';
import {
  Bell, User, UserCheck, Shield, ChevronDown,
  Megaphone, LogOut, CheckCircle, ExternalLink, Bookmark,
  Layers, FolderGit2, FileText, Video, Award, Compass, X,
  Building, ShieldCheck
} from 'lucide-react';

export const Navbar: React.FC<{ onLogout?: () => void }> = ({ onLogout }) => {
  const {
    currentRole,
    setCurrentRole,
    activeNavTab,
    setActiveNavTab,
    announcements,
    traineeProfile,
    trainerProfile
  } = usePlatform();

  const [showNotifications, setShowNotifications] = useState(false);
  const [bannerDismissed, setBannerDismissed] = useState(false);

  // Active announcement for top ticker banner
  const activeBanner = announcements.find(a => a.active && a.urgency !== 'Normal');

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
      {/* Subtle Top Alert (only if critical and not dismissed) */}
      {activeBanner && !bannerDismissed && (
        <div className="px-4 py-1.5 text-xs font-medium flex items-center justify-between bg-slate-900 text-slate-200 border-b border-slate-800">
          <div className="flex items-center gap-2 max-w-5xl mx-auto truncate">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
            <span className="font-semibold text-white">{activeBanner.title}:</span>
            <span className="truncate text-slate-300">{activeBanner.content}</span>
          </div>
          <button
            onClick={() => setBannerDismissed(true)}
            className="text-slate-400 hover:text-white ml-2 text-sm font-bold cursor-pointer"
          >
            ×
          </button>
        </div>
      )}

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Brand Identity */}
          <div className="flex items-center gap-2.5">
            <img
              src="/logo.png"
              alt="CapacityConnect Logo"
              className="h-12 sm:h-14 w-auto object-contain max-w-[210px]"
            />
            <span className="hidden sm:inline-block px-2 py-0.5 bg-blue-50 text-blue-700 text-xs font-bold rounded-md border border-blue-200/80">
              Enterprise
            </span>
          </div>

          {/* Locked-In Current Role Badge (Role cannot be switched while logged in) */}
          <div className="flex items-center gap-2">
            {currentRole === 'TRAINEE' && (
              <span className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-bold border border-blue-200/80 shadow-2xs">
                <User size={15} />
                <span>Student / Trainee</span>
              </span>
            )}
            {currentRole === 'TRAINER' && (
              <span className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-sm font-bold border border-emerald-200/80 shadow-2xs">
                <UserCheck size={15} />
                <span>Staff / Trainer</span>
              </span>
            )}
            {currentRole === 'ADMIN' && (
              <span className="flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-sm font-bold border border-indigo-200/80 shadow-2xs">
                <Shield size={15} />
                <span>Platform Admin</span>
              </span>
            )}
          </div>

          {/* Right Controls: Notifications & User Profile */}
          <div className="flex items-center gap-3">
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition relative cursor-pointer"
                title="Notifications"
              >
                <Bell size={17} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-600" />
              </button>

              {/* Notification Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 z-50 animate-fade-in">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <span className="text-xs font-bold text-slate-900 uppercase tracking-wide">Announcements</span>
                    <button
                      onClick={() => setShowNotifications(false)}
                      className="text-slate-400 hover:text-slate-600 text-xs font-bold cursor-pointer"
                    >
                      <X size={14} />
                    </button>
                  </div>

                  <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto pt-2">
                    {announcements.map(a => (
                      <div key={a.id} className="py-2.5 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded uppercase">
                            {a.category}
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium">{a.publishedDate}</span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-900">{a.title}</h4>
                        <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">{a.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Current Persona Badge & Avatar */}
            <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
              {(() => {
                const currentName = currentRole === 'TRAINEE'
                  ? traineeProfile.fullName
                  : currentRole === 'TRAINER'
                  ? trainerProfile.fullName
                  : 'Administrator';
                const currentAvatar = currentRole === 'TRAINEE'
                  ? traineeProfile.avatar
                  : currentRole === 'TRAINER'
                  ? trainerProfile.avatar
                  : '';
                const initials = currentName ? currentName.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase() : 'U';

                return currentAvatar ? (
                  <img
                    src={currentAvatar}
                    alt="Active Profile"
                    className="w-8 h-8 rounded-lg object-cover ring-1 ring-slate-200"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                    {initials}
                  </div>
                );
              })()}
              <div className="hidden sm:block text-left">
                <span className="text-xs font-bold text-slate-900 block leading-tight">
                  {currentRole === 'TRAINEE'
                    ? traineeProfile.fullName
                    : currentRole === 'TRAINER'
                    ? trainerProfile.fullName
                    : 'Administrator'}
                </span>
                <span className="text-[10px] text-slate-500 block">
                  {currentRole === 'TRAINEE' ? 'Candidate' : currentRole === 'TRAINER' ? 'Faculty' : 'Operations'}
                </span>
              </div>

              {onLogout && (
                <button
                  onClick={onLogout}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition border border-slate-200 cursor-pointer ml-1"
                  title="Sign out of your account"
                >
                  <LogOut size={13} />
                  <span className="hidden md:inline">Sign Out</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Dynamic Sub-Navigation Tabs based on Logged-in Role */}
        <div className="flex items-center space-x-1.5 sm:space-x-2 border-t border-slate-200/80 py-3 overflow-x-auto text-sm font-bold custom-scrollbar">
          {currentRole === 'TRAINEE' && (
            <>
              <button
                onClick={() => setActiveNavTab('profile')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl whitespace-nowrap transition cursor-pointer ${
                  activeNavTab === 'profile'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-blue-700 hover:bg-blue-50/60'
                }`}
              >
                <User size={15} /> Profile
              </button>
              <button
                onClick={() => setActiveNavTab('portfolio')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl whitespace-nowrap transition cursor-pointer ${
                  activeNavTab === 'portfolio'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-blue-700 hover:bg-blue-50/60'
                }`}
              >
                <FolderGit2 size={15} /> Portfolio & Wishlist
              </button>
              <button
                onClick={() => setActiveNavTab('assessments')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl whitespace-nowrap transition cursor-pointer ${
                  activeNavTab === 'assessments'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-blue-700 hover:bg-blue-50/60'
                }`}
              >
                <Award size={15} /> Assessments
              </button>
              <button
                onClick={() => setActiveNavTab('library')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl whitespace-nowrap transition cursor-pointer ${
                  activeNavTab === 'library'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-blue-700 hover:bg-blue-50/60'
                }`}
              >
                <Video size={15} /> Courses & Faculty
              </button>
            </>
          )}

          {currentRole === 'ADMIN' && (
            <>
              <button
                onClick={() => setActiveNavTab('admin_dashboard')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl whitespace-nowrap transition cursor-pointer ${
                  activeNavTab === 'admin_dashboard'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-blue-700 hover:bg-blue-50/60'
                }`}
              >
                <Layers size={15} /> Overview
              </button>
              <button
                onClick={() => setActiveNavTab('admin_user_approval')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl whitespace-nowrap transition cursor-pointer ${
                  activeNavTab === 'admin_user_approval'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-blue-700 hover:bg-blue-50/60'
                }`}
              >
                <UserCheck size={15} /> User Approvals
              </button>
              <button
                onClick={() => setActiveNavTab('admin_role_management')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl whitespace-nowrap transition cursor-pointer ${
                  activeNavTab === 'admin_role_management'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-blue-700 hover:bg-blue-50/60'
                }`}
              >
                <Shield size={15} /> Roles Directory
              </button>
              <button
                onClick={() => setActiveNavTab('admin_competency_mapping')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl whitespace-nowrap transition cursor-pointer ${
                  activeNavTab === 'admin_competency_mapping'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-blue-700 hover:bg-blue-50/60'
                }`}
              >
                <Compass size={15} /> Competency Mapping
              </button>
              <button
                onClick={() => setActiveNavTab('admin_homepage_publisher')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl whitespace-nowrap transition cursor-pointer ${
                  activeNavTab === 'admin_homepage_publisher'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-blue-700 hover:bg-blue-50/60'
                }`}
              >
                <Megaphone size={15} /> Announcements
              </button>
            </>
          )}

          {currentRole === 'TRAINER' && (
            <>
              <button
                onClick={() => setActiveNavTab('trainer_profile')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl whitespace-nowrap transition cursor-pointer ${
                  activeNavTab === 'trainer_profile'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-blue-700 hover:bg-blue-50/60'
                }`}
              >
                <UserCheck size={15} /> Profile
              </button>
              <button
                onClick={() => setActiveNavTab('trainer_questionnaires')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl whitespace-nowrap transition cursor-pointer ${
                  activeNavTab === 'trainer_questionnaires'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-blue-700 hover:bg-blue-50/60'
                }`}
              >
                <FileText size={15} /> Questionnaires
              </button>
              <button
                onClick={() => setActiveNavTab('trainer_monitor')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl whitespace-nowrap transition cursor-pointer ${
                  activeNavTab === 'trainer_monitor'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-blue-700 hover:bg-blue-50/60'
                }`}
              >
                <Award size={15} /> My Students & Courses
              </button>
              <button
                onClick={() => setActiveNavTab('trainer_library_manage')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl whitespace-nowrap transition cursor-pointer ${
                  activeNavTab === 'trainer_library_manage'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-blue-700 hover:bg-blue-50/60'
                }`}
              >
                <Video size={15} /> Course Materials
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
