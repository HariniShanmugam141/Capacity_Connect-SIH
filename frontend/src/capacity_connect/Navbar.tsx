import React, { useState } from 'react';
import { usePlatform } from './PlatformContext';
import {
  Bell, User, UserCheck, Shield, ChevronDown,
  Megaphone, LogOut, CheckCircle, ExternalLink, Bookmark,
  Layers, FolderGit2, FileText, Video, Award, Compass, X,
  Building, ShieldCheck, Camera, BookOpen
} from 'lucide-react';

export const Navbar: React.FC<{ onLogout?: () => void }> = ({ onLogout }) => {
  const {
    currentRole,
    setCurrentRole,
    activeNavTab,
    setActiveNavTab,
    announcements,
    traineeProfile,
    trainerProfile,
    adminProfile,
    updateTraineeProfile,
    updateTrainerProfile,
    updateAdminProfile
  } = usePlatform();

  const [showNotifications, setShowNotifications] = useState(false);
  const [bannerDismissed, setBannerDismissed] = useState(false);

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          if (currentRole === 'TRAINEE') {
            updateTraineeProfile({ avatar: reader.result });
          } else if (currentRole === 'TRAINER') {
            updateTrainerProfile({ avatar: reader.result });
          } else {
            updateAdminProfile({ avatar: reader.result });
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

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
            <span className="hidden sm:inline-block px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full border border-blue-200 uppercase tracking-wider">
              Enterprise
            </span>
          </div>

          {/* Locked-In Current Role Badge */}
          <div className="flex items-center gap-2 font-sans">
            {currentRole === 'TRAINEE' && (
              <span className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-50 text-blue-700 rounded-full text-xs sm:text-sm font-semibold border border-blue-200 shadow-2xs">
                <User size={15} />
                <span>Trainee</span>
              </span>
            )}
            {currentRole === 'TRAINER' && (
              <span className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-50 text-emerald-800 rounded-full text-xs sm:text-sm font-semibold border border-emerald-200 shadow-2xs">
                <UserCheck size={15} />
                <span>Trainer</span>
              </span>
            )}
            {currentRole === 'ADMIN' && (
              <span className="flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-50 text-[#181E4B] rounded-full text-xs sm:text-sm font-semibold border border-indigo-200 shadow-2xs">
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
                  : adminProfile.fullName;
                const currentAvatar = currentRole === 'TRAINEE'
                  ? traineeProfile.avatar
                  : currentRole === 'TRAINER'
                  ? trainerProfile.avatar
                  : adminProfile.avatar;

                return (
                  <div className="relative group w-8 h-8 rounded-lg overflow-hidden shrink-0 border border-slate-200 shadow-2xs bg-slate-100">
                    <img
                      src={currentAvatar || '/default-avatar.png'}
                      alt={currentName}
                      onError={(e) => { e.currentTarget.src = '/default-avatar.png'; }}
                      className="w-full h-full object-cover"
                    />
                    <label
                      className="absolute inset-0 bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer"
                      title="Upload new profile photo"
                    >
                      <Camera size={12} />
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAvatarUpload}
                      />
                    </label>
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
                  {currentRole === 'TRAINEE' ? 'Trainee' : currentRole === 'TRAINER' ? 'Trainer' : 'Admin'}
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
        <div className="flex items-center space-x-1.5 sm:space-x-2 border-t border-slate-100 py-3 overflow-x-auto text-sm font-sans custom-scrollbar">
          {currentRole === 'TRAINEE' && (
            <>
              <button
                onClick={() => setActiveNavTab('profile')}
                className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition cursor-pointer text-xs sm:text-sm ${
                  activeNavTab === 'profile'
                    ? 'bg-[#181E4B] text-white shadow-md shadow-[#181E4B]/20 font-bold'
                    : 'text-[#5E6282] hover:text-[#181E4B] hover:bg-blue-50/70 font-medium'
                }`}
              >
                <User size={15} /> Profile
              </button>
              <button
                onClick={() => setActiveNavTab('my_courses')}
                className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition cursor-pointer text-xs sm:text-sm ${
                  activeNavTab === 'my_courses'
                    ? 'bg-[#181E4B] text-white shadow-md shadow-[#181E4B]/20 font-bold'
                    : 'text-[#5E6282] hover:text-[#181E4B] hover:bg-blue-50/70 font-medium'
                }`}
              >
                <BookOpen size={15} /> My Courses
              </button>
              <button
                onClick={() => setActiveNavTab('portfolio')}
                className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition cursor-pointer text-xs sm:text-sm ${
                  activeNavTab === 'portfolio'
                    ? 'bg-[#181E4B] text-white shadow-md shadow-[#181E4B]/20 font-bold'
                    : 'text-[#5E6282] hover:text-[#181E4B] hover:bg-blue-50/70 font-medium'
                }`}
              >
                <FolderGit2 size={15} /> Portfolio & Wishlist
              </button>
              <button
                onClick={() => setActiveNavTab('assessments')}
                className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition cursor-pointer text-xs sm:text-sm ${
                  activeNavTab === 'assessments'
                    ? 'bg-[#181E4B] text-white shadow-md shadow-[#181E4B]/20 font-bold'
                    : 'text-[#5E6282] hover:text-[#181E4B] hover:bg-blue-50/70 font-medium'
                }`}
              >
                <Award size={15} /> Assessments
              </button>
              <button
                onClick={() => setActiveNavTab('library')}
                className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition cursor-pointer text-xs sm:text-sm ${
                  activeNavTab === 'library'
                    ? 'bg-[#181E4B] text-white shadow-md shadow-[#181E4B]/20 font-bold'
                    : 'text-[#5E6282] hover:text-[#181E4B] hover:bg-blue-50/70 font-medium'
                }`}
              >
                <Video size={15} /> Courses & Trainers
              </button>
            </>
          )}

          {currentRole === 'ADMIN' && (
            <>
              <button
                onClick={() => setActiveNavTab('admin_dashboard')}
                className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition cursor-pointer text-xs sm:text-sm ${
                  activeNavTab === 'admin_dashboard'
                    ? 'bg-[#181E4B] text-white shadow-md shadow-[#181E4B]/20 font-bold'
                    : 'text-[#5E6282] hover:text-[#181E4B] hover:bg-blue-50/70 font-medium'
                }`}
              >
                <Layers size={15} /> Overview
              </button>
              <button
                onClick={() => setActiveNavTab('admin_user_approval')}
                className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition cursor-pointer text-xs sm:text-sm ${
                  activeNavTab === 'admin_user_approval'
                    ? 'bg-[#181E4B] text-white shadow-md shadow-[#181E4B]/20 font-bold'
                    : 'text-[#5E6282] hover:text-[#181E4B] hover:bg-blue-50/70 font-medium'
                }`}
              >
                <UserCheck size={15} /> User Approvals
              </button>
              <button
                onClick={() => setActiveNavTab('admin_role_management')}
                className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition cursor-pointer text-xs sm:text-sm ${
                  activeNavTab === 'admin_role_management'
                    ? 'bg-[#181E4B] text-white shadow-md shadow-[#181E4B]/20 font-bold'
                    : 'text-[#5E6282] hover:text-[#181E4B] hover:bg-blue-50/70 font-medium'
                }`}
              >
                <Shield size={15} /> Roles Directory
              </button>
              <button
                onClick={() => setActiveNavTab('admin_competency_mapping')}
                className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition cursor-pointer text-xs sm:text-sm ${
                  activeNavTab === 'admin_competency_mapping'
                    ? 'bg-[#181E4B] text-white shadow-md shadow-[#181E4B]/20 font-bold'
                    : 'text-[#5E6282] hover:text-[#181E4B] hover:bg-blue-50/70 font-medium'
                }`}
              >
                <Compass size={15} /> Competency Mapping
              </button>
              <button
                onClick={() => setActiveNavTab('admin_homepage_publisher')}
                className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition cursor-pointer text-xs sm:text-sm ${
                  activeNavTab === 'admin_homepage_publisher'
                    ? 'bg-[#181E4B] text-white shadow-md shadow-[#181E4B]/20 font-bold'
                    : 'text-[#5E6282] hover:text-[#181E4B] hover:bg-blue-50/70 font-medium'
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
                className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition cursor-pointer text-xs sm:text-sm ${
                  activeNavTab === 'trainer_profile'
                    ? 'bg-[#181E4B] text-white shadow-md shadow-[#181E4B]/20 font-bold'
                    : 'text-[#5E6282] hover:text-[#181E4B] hover:bg-blue-50/70 font-medium'
                }`}
              >
                <UserCheck size={15} /> Profile
              </button>
              <button
                onClick={() => setActiveNavTab('trainer_questionnaires')}
                className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition cursor-pointer text-xs sm:text-sm ${
                  activeNavTab === 'trainer_questionnaires'
                    ? 'bg-[#181E4B] text-white shadow-md shadow-[#181E4B]/20 font-bold'
                    : 'text-[#5E6282] hover:text-[#181E4B] hover:bg-blue-50/70 font-medium'
                }`}
              >
                <FileText size={15} /> Questionnaires
              </button>
              <button
                onClick={() => setActiveNavTab('trainer_monitor')}
                className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition cursor-pointer text-xs sm:text-sm ${
                  activeNavTab === 'trainer_monitor'
                    ? 'bg-[#181E4B] text-white shadow-md shadow-[#181E4B]/20 font-bold'
                    : 'text-[#5E6282] hover:text-[#181E4B] hover:bg-blue-50/70 font-medium'
                }`}
              >
                <Award size={15} /> Trainees & Courses
              </button>
              <button
                onClick={() => setActiveNavTab('trainer_library_manage')}
                className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition cursor-pointer text-xs sm:text-sm ${
                  activeNavTab === 'trainer_library_manage'
                    ? 'bg-[#181E4B] text-white shadow-md shadow-[#181E4B]/20 font-bold'
                    : 'text-[#5E6282] hover:text-[#181E4B] hover:bg-blue-50/70 font-medium'
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
