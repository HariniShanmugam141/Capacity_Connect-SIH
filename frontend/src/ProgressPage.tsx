import React from 'react';
import {
  Rocket, Home, Map, Code, BarChart, Trophy, Users, Gift, Bell, User, Settings,
  Search, ChevronDown, ChevronRight, LogOut, Briefcase, Flame, Star, 
  CheckCircle2, Circle, ArrowRight, Lock, PlayCircle, BookOpen, Check
} from 'lucide-react';

export default function ProgressPage({ 
  onLogout, 
  onNavigate,
  userName = 'Bhavya Shree D'
}: { 
  onLogout?: () => void,
  onNavigate?: (view: string) => void,
  userName?: string
}) {
  return (
    <div className="min-h-screen bg-[#F8F9FB] flex font-sans text-gray-900 overflow-hidden">
      
      {/* --- LEFT SIDEBAR --- */}
      <aside className="w-72 bg-white border-r border-gray-100 hidden lg:flex flex-col h-screen sticky top-0 shrink-0 shadow-sm z-20">
        <div className="p-6 flex items-center gap-2">
          <div className="bg-[#6225E6] p-1.5 rounded-lg text-white">
            <Rocket size={24} />
          </div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">Career<span className="text-[#6225E6]">Forge</span></h1>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto pb-6 custom-scrollbar">
          {[
            { name: 'Dashboard', icon: Home, view: 'dashboard' },
            { name: 'Roadmap', icon: Map, view: 'roadmap' },
            { name: 'Practice', icon: Code, view: 'practice' },
            { name: 'Progress', icon: BarChart, active: true, view: 'progress' },
            { name: 'Achievements', icon: Trophy, view: 'achievements' },
            { name: 'Leaderboard', icon: Users, view: 'leaderboard' },
            { name: 'Rewards', icon: Gift, view: 'rewards' },
            { name: 'Reminders', icon: Bell, view: 'reminders' },
            { name: 'Profile', icon: User, view: 'profile' },
            { name: 'Settings', icon: Settings, view: 'settings' },
          ].map(item => (
            <a 
              key={item.name} 
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (onNavigate && item.view) onNavigate(item.view);
              }}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors
                ${item.active 
                  ? 'border border-[#6225E6] bg-[#f4effd] text-[#6225E6] shadow-sm' 
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}
            >
              <item.icon size={20} className={item.active ? 'text-[#6225E6]' : 'text-gray-400'} />
              {item.name}
            </a>
          ))}
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-red-500 hover:bg-red-50 transition-colors mt-2"
          >
            <LogOut size={20} />
            Logout
          </button>
        </nav>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 h-screen overflow-y-auto custom-scrollbar flex flex-col">
        
        {/* TOP HEADER */}
        <header className="flex justify-between items-center px-8 py-5 sticky top-0 bg-[#F8F9FB]/95 backdrop-blur-sm z-40 border-b border-transparent">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Trainee Progress</h2>
            <p className="text-sm text-gray-500 font-medium">Track your learning progress and stay consistent on your career journey.</p>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="relative hidden md:block w-72">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={16} className="text-gray-400" />
              </div>
              <input 
                type="text" 
                placeholder="Search anything" 
                className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-full text-sm outline-none focus:border-[#6225E6] transition-colors shadow-sm"
              />
            </div>

            <button className="relative text-gray-600 hover:text-gray-900 transition-colors p-1">
              <Bell size={20} />
              <span className="absolute top-0 right-1 w-4 h-4 bg-[#6225E6] text-white text-[9px] font-bold flex items-center justify-center rounded-full border-2 border-[#F8F9FB]">3</span>
            </button>
            
            <div className="flex items-center gap-3 cursor-pointer group">
              <div className="w-9 h-9 rounded-full bg-[#f4effd] text-[#6225E6] flex items-center justify-center font-bold text-sm shrink-0 group-hover:bg-[#e7defa] transition-colors">
                {userName.substring(0, 2).toUpperCase()}
              </div>
              <div className="text-left hidden sm:block">
                <div className="font-bold text-sm text-gray-900 leading-tight group-hover:text-[#6225E6] transition-colors">{userName}</div>
                <div className="text-xs text-gray-500">Level 12 Learner</div>
              </div>
              <ChevronDown size={14} className="text-gray-400 hidden sm:block" />
            </div>
          </div>
        </header>

        <div className="px-8 max-w-[1600px] mx-auto w-full flex-1 pb-12 flex flex-col gap-6 mt-4">
          
          {/* TOP BANNER */}
          <div className="bg-[#fcfaff] rounded-[20px] border border-[#f4effd] p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-8 w-full xl:w-2/3">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-white text-[#6225E6] flex items-center justify-center shadow-sm border border-gray-100 shrink-0">
                <Briefcase size={24} />
              </div>
              <div>
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Your Career</div>
                <h3 className="text-xl font-bold text-[#6225E6] mb-1">AI/ML Engineer</h3>
                <p className="text-xs text-gray-500">Keep going! You're doing great.</p>
              </div>
            </div>

            <div className="flex items-center gap-8 md:gap-12 flex-wrap">
              {/* Progress Circle */}
              <div className="flex flex-col items-center gap-2">
                <div className="text-xs font-semibold text-gray-500">Progress</div>
                <div className="relative w-14 h-14 flex items-center justify-center">
                  <svg className="w-14 h-14 transform -rotate-90">
                    <circle cx="28" cy="28" r="24" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-gray-100" />
                    <circle cx="28" cy="28" r="24" stroke="currentColor" strokeWidth="6" fill="transparent" strokeDasharray={24 * 2 * Math.PI} strokeDashoffset={24 * 2 * Math.PI * (1 - 0.68)} className="text-[#6225E6]" strokeLinecap="round" />
                  </svg>
                  <span className="absolute text-sm font-bold text-gray-900">68%</span>
                </div>
              </div>

              {/* Streak */}
              <div className="flex flex-col items-center gap-2">
                <div className="text-xs font-semibold text-gray-500">Streak</div>
                <div className="flex items-center gap-2">
                  <Flame size={24} className="text-orange-500 fill-orange-500" />
                  <div>
                    <div className="text-lg font-bold text-gray-900 leading-tight">12</div>
                    <div className="text-[10px] text-gray-500 font-medium">Days</div>
                  </div>
                </div>
              </div>

              {/* Points */}
              <div className="flex flex-col items-center gap-2">
                <div className="text-xs font-semibold text-gray-500">Points</div>
                <div className="flex items-center gap-2">
                  <Star size={24} className="text-yellow-400 fill-yellow-400" />
                  <div>
                    <div className="text-lg font-bold text-gray-900 leading-tight">840</div>
                    <div className="text-[10px] text-gray-500 font-medium">Points</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col xl:flex-row gap-6 mt-2">
            
            {/* LEFT COLUMN (WIDER) */}
            <div className="flex-1 flex flex-col gap-6">
              
              {/* Learning Progress */}
              <div className="bg-white rounded-[20px] border border-gray-200 p-6 shadow-sm relative">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-gray-900">Learning Progress</h3>
                  <button className="text-xs font-bold text-[#6225E6] hover:underline flex items-center gap-1 bg-[#f4effd] px-3 py-1.5 rounded-lg">
                    View Roadmap <ArrowRight size={14} />
                  </button>
                </div>
                
                <div className="flex flex-col sm:flex-row items-center gap-8">
                  {/* Big Circle */}
                  <div className="relative w-40 h-40 flex items-center justify-center shrink-0">
                    <svg className="w-40 h-40 transform -rotate-90">
                      <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="16" fill="transparent" className="text-gray-100" />
                      <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="16" fill="transparent" strokeDasharray={70 * 2 * Math.PI} strokeDashoffset={70 * 2 * Math.PI * (1 - 0.68)} className="text-[#6225E6]" strokeLinecap="round" />
                    </svg>
                    <div className="absolute flex flex-col items-center text-center">
                      <span className="text-3xl font-bold text-gray-900 mb-1">68%</span>
                      <span className="text-xs text-gray-500 font-semibold max-w-[80px]">Overall Progress</span>
                    </div>
                  </div>

                  {/* Bars */}
                  <div className="flex-1 w-full space-y-4">
                    {[
                      { label: 'Python Programming', progress: 80, icon: '🐍', color: 'bg-[#6225E6]' },
                      { label: 'Machine Learning', progress: 65, icon: '🧠', color: 'bg-[#6225E6]' },
                      { label: 'Data Structures & Algorithms', progress: 60, icon: '</>', color: 'bg-[#6225E6]' },
                      { label: 'Statistics & Math', progress: 45, icon: '∑', color: 'bg-[#6225E6]' },
                      { label: 'Deep Learning', progress: 30, icon: '⚙️', color: 'bg-[#6225E6]' },
                    ].map((item, i) => (
                      <div key={i}>
                        <div className="flex justify-between items-center mb-1.5">
                          <div className="flex items-center gap-2">
                            <span className="text-sm">{item.icon}</span>
                            <span className="text-xs font-semibold text-gray-900">{item.label}</span>
                          </div>
                          <span className="text-xs font-bold text-gray-600">{item.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-1.5">
                          <div className={`h-1.5 rounded-full ${item.color}`} style={{ width: `${item.progress}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Roadmap Progress */}
              <div className="bg-white rounded-[20px] border border-gray-200 p-6 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-6">Roadmap Progress</h3>
                
                <div className="flex flex-col md:flex-row gap-8">
                  {/* Timeline */}
                  <div className="flex-1 relative pl-3">
                    <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-gray-100 z-0"></div>
                    <div className="absolute left-[19px] top-4 h-1/2 w-0.5 bg-[#6225E6] z-0"></div>
                    
                    <div className="space-y-6 relative z-10">
                      
                      <div className="flex items-start gap-4">
                        <div className="w-4 h-4 rounded-full bg-[#6225E6] text-white flex items-center justify-center shrink-0 mt-0.5 ring-4 ring-white">
                          <Check size={10} strokeWidth={3} />
                        </div>
                        <div className="flex-1 flex justify-between items-start">
                          <div>
                            <div className="text-sm font-bold text-gray-900 mb-0.5">Foundation</div>
                            <div className="text-xs text-gray-500">Python, Basics, Data Structures</div>
                          </div>
                          <div className="text-[10px] font-bold text-green-600 bg-green-50 px-2.5 py-1 rounded-md">Completed</div>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="w-4 h-4 rounded-full bg-[#6225E6] text-white flex items-center justify-center shrink-0 mt-0.5 ring-4 ring-white">
                          <Check size={10} strokeWidth={3} />
                        </div>
                        <div className="flex-1 flex justify-between items-start">
                          <div>
                            <div className="text-sm font-bold text-gray-900 mb-0.5">Core Concepts</div>
                            <div className="text-xs text-gray-500">OOPs, NumPy, Pandas</div>
                          </div>
                          <div className="text-[10px] font-bold text-green-600 bg-green-50 px-2.5 py-1 rounded-md">Completed</div>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="w-4 h-4 rounded-full bg-white border-4 border-[#6225E6] flex items-center justify-center shrink-0 mt-0.5 ring-4 ring-white"></div>
                        <div className="flex-1 flex justify-between items-start">
                          <div>
                            <div className="text-sm font-bold text-gray-900 mb-0.5">Machine Learning</div>
                            <div className="text-xs text-gray-500">ML Basics, Algorithms, Model Training</div>
                          </div>
                          <div className="text-[10px] font-bold text-[#6225E6] bg-[#f4effd] px-2.5 py-1 rounded-md">In Progress</div>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="w-4 h-4 rounded-full bg-gray-200 border border-white flex items-center justify-center shrink-0 mt-0.5 ring-4 ring-white text-gray-400">
                          <Lock size={8} />
                        </div>
                        <div className="flex-1 flex justify-between items-start opacity-50">
                          <div>
                            <div className="text-sm font-bold text-gray-900 mb-0.5">Advanced Topics</div>
                            <div className="text-xs text-gray-500">Deep Learning, NLP, MLOps</div>
                          </div>
                          <div className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-md">Locked</div>
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Current Topic Card */}
                  <div className="w-full md:w-[320px] shrink-0 bg-white border border-gray-100 rounded-2xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
                    <div className="flex items-start gap-4 mb-6">
                      <div className="w-12 h-12 rounded-xl bg-green-50 text-green-500 flex items-center justify-center shrink-0">
                        <span className="text-2xl">🧠</span>
                      </div>
                      <div>
                        <div className="text-[10px] font-bold text-gray-900 uppercase tracking-wider mb-1">Current Topic</div>
                        <div className="font-bold text-sm text-gray-900 mb-1">Supervised Learning</div>
                        <p className="text-xs text-gray-500 leading-relaxed">Learn about regression, classification and model evaluation.</p>
                      </div>
                    </div>

                    <div className="mb-6">
                      <div className="flex justify-end text-xs font-bold text-gray-900 mb-1.5">65%</div>
                      <div className="w-full bg-gray-100 rounded-full h-1.5">
                        <div className="bg-[#6225E6] h-1.5 rounded-full" style={{ width: '65%' }}></div>
                      </div>
                    </div>

                    <button className="w-full py-2.5 border border-[#6225E6] text-[#6225E6] rounded-xl text-sm font-bold hover:bg-[#f4effd] transition-colors flex items-center justify-center gap-2">
                      Continue Learning <ArrowRight size={16} />
                    </button>
                  </div>
                </div>

              </div>

            </div>

            {/* RIGHT COLUMN (NARROWER) */}
            <div className="w-full xl:w-[380px] shrink-0 flex flex-col gap-6">
              
              {/* Today's Tasks */}
              <div className="bg-white rounded-[20px] border border-gray-200 p-6 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-5">Today's Tasks</h3>
                
                <div className="space-y-4 mb-6">
                  <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 size={20} className="text-green-500 fill-green-100" />
                      <span className="text-sm font-semibold text-gray-900">Python Revision</span>
                    </div>
                    <span className="text-xs font-semibold text-green-500">Completed</span>
                  </div>

                  <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 size={20} className="text-green-500 fill-green-100" />
                      <span className="text-sm font-semibold text-gray-900">NumPy Practice</span>
                    </div>
                    <span className="text-xs font-semibold text-green-500">Completed</span>
                  </div>

                  <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <Circle size={20} className="text-gray-300" />
                      <span className="text-sm font-semibold text-gray-600">Machine Learning Video</span>
                    </div>
                    <span className="text-xs font-semibold text-orange-500">Pending</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Circle size={20} className="text-gray-300" />
                      <span className="text-sm font-semibold text-gray-600">Solve 3 Problems</span>
                    </div>
                    <span className="text-xs font-semibold text-orange-500">Pending</span>
                  </div>
                </div>

                <button className="w-full py-3 bg-[#6225E6] text-white rounded-xl text-sm font-bold hover:bg-[#501ac4] transition-colors flex items-center justify-center gap-2 shadow-sm">
                  Resume Learning <ArrowRight size={16} />
                </button>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-[20px] border border-gray-200 p-6 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-5">Recent Activity</h3>
                
                <div className="space-y-6 mb-6">
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-green-50 text-green-500 flex items-center justify-center shrink-0 mt-0.5">
                      <Check size={16} strokeWidth={3} />
                    </div>
                    <div className="flex-1 flex justify-between items-start gap-2">
                      <span className="text-sm font-semibold text-gray-700">Solved 2 problems on Arrays</span>
                      <span className="text-[10px] font-medium text-gray-400 shrink-0 mt-1">2 hours ago</span>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-[#f4effd] text-[#6225E6] flex items-center justify-center shrink-0 mt-0.5">
                      <PlayCircle size={16} />
                    </div>
                    <div className="flex-1 flex justify-between items-start gap-2">
                      <span className="text-sm font-semibold text-gray-700">Watched: NumPy Full Course</span>
                      <span className="text-[10px] font-medium text-gray-400 shrink-0 mt-1">Yesterday</span>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-green-50 text-green-500 flex items-center justify-center shrink-0 mt-0.5">
                      <Check size={16} strokeWidth={3} />
                    </div>
                    <div className="flex-1 flex justify-between items-start gap-2">
                      <span className="text-sm font-semibold text-gray-700">Completed: Python Basics Quiz</span>
                      <span className="text-[10px] font-medium text-gray-400 shrink-0 mt-1">Yesterday</span>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center shrink-0 mt-0.5">
                      <BookOpen size={16} />
                    </div>
                    <div className="flex-1 flex justify-between items-start gap-2">
                      <span className="text-sm font-semibold text-gray-700">Started: Machine Learning Basics</span>
                      <span className="text-[10px] font-medium text-gray-400 shrink-0 mt-1">2 days ago</span>
                    </div>
                  </div>
                </div>

                <button className="text-sm font-bold text-[#6225E6] hover:underline flex items-center gap-1">
                  View all activity <ArrowRight size={14} />
                </button>
              </div>

            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
