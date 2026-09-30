import React, { useState } from 'react';
import {
  Home, PlaySquare, PlusSquare, BarChart2, Star, Users, User, Settings, LogOut,
  Bell, ChevronDown, ChevronRight, ChevronUp, Eye, Clock, Heart, UserPlus,
  Play, Calendar, PieChart, ArrowUp, ThumbsUp, MessageSquare, Share2, Lightbulb, TrendingUp
} from 'lucide-react';

// --- Sidebar ---
function Sidebar({ onLogout, onNavigate, userName }: { onLogout?: () => void, onNavigate: (v: string) => void, userName: string }) {
  const initials = userName.substring(0, 2).toUpperCase();
  const NAV = [
    { name: 'Dashboard', icon: Home, view: 'dashboard' },
    { name: 'My Videos', icon: PlaySquare, view: 'creator_my_videos' },
    { name: 'Add Video', icon: PlusSquare, view: 'creator_add_video' },
    { name: 'Analytics', icon: BarChart2, active: true, view: 'creator_analytics' },
    { name: 'Promotions', icon: Star, view: 'creator_promotions' },
    { name: 'Learner Engagement', icon: Users, view: 'creator_learners' },
    { name: 'My Profile', icon: User, view: 'creator_profile' },
    { name: 'Settings', icon: Settings, view: 'creator_settings' },
  ];

  return (
    <aside className="w-[210px] bg-white border-r border-gray-100 hidden lg:flex flex-col h-screen sticky top-0 shrink-0 shadow-sm z-20">
      <div className="p-5 pb-2">
        <h1 className="text-lg font-bold text-[#10154A] tracking-tight">
          Career<span className="text-[#5B16F5]">Forge</span>
        </h1>
        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-0.5">Creator Dashboard</div>
      </div>

      <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
        {NAV.map(item => (
          <a
            key={item.name}
            href="#"
            onClick={e => { e.preventDefault(); onNavigate(item.view); }}
            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors
              ${item.active ? 'bg-gradient-to-r from-[#5B16F5] to-[#6D28F2] text-white shadow-sm' : 'text-[#10154A] hover:bg-[#F5F3FA]'}`}
          >
            <item.icon size={18} className={item.active ? 'text-white' : 'text-gray-400'} />
            {item.name}
          </a>
        ))}

        <div className="my-3 border-t border-gray-100" />
        <button onClick={onLogout} className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 transition-colors">
          <LogOut size={18} />
          Logout
        </button>
      </nav>

      {/* Profile Card */}
      <div className="p-3 border-t border-gray-100 bg-[#F5F3FA]/50">
        <div className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100 flex flex-col items-center text-center mb-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#5B16F5] to-[#6D28F2] text-white flex items-center justify-center font-bold text-lg mb-2 shadow">{initials}</div>
          <div className="font-bold text-[#10154A] text-sm">{userName}</div>
          <div className="text-[11px] text-gray-500 mb-3">Creator</div>
          <button className="text-[11px] font-semibold text-[#5B16F5] border border-[#5B16F5] bg-white px-3 py-1 rounded-full flex items-center gap-1 hover:bg-[#F5F3FA] transition-colors">
            View Profile <ChevronRight size={12} />
          </button>
        </div>

        <div className="bg-white p-3 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="text-base">🔥</span>
            <span className="text-xs font-bold text-[#10154A]">12 Day Streak</span>
          </div>
          <div className="text-[9px] text-gray-500 mb-2.5 ml-5">Keep it up! 🔥</div>
          <div className="flex justify-between items-center">
            {['M','T','W','T','F','S','S'].map((d, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold ${i < 4 ? 'bg-[#5B16F5] text-white' : 'bg-gray-100 text-gray-400'}`}>
                  {i < 4 ? '✓' : ''}
                </div>
                <span className="text-[8px] text-gray-400 font-medium">{d}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}

// --- Header ---
function Header({ userName }: { userName: string }) {
  const initials = userName.substring(0, 2).toUpperCase();
  return (
    <header className="flex justify-between items-center px-8 py-6 sticky top-0 bg-[#FCFBFF]/95 backdrop-blur-sm z-40 border-b border-transparent">
      <div>
        <h2 className="text-[22px] font-bold text-[#10154A] leading-tight mb-1">Analytics</h2>
        <p className="text-xs font-medium text-gray-500">Track your content performance and understand how learners engage with your videos.</p>
      </div>
      <div className="flex items-center gap-6">
        <div className="bg-white border border-gray-200 rounded-lg px-3 py-1.5 flex items-center gap-2 cursor-pointer shadow-sm">
          <span className="text-xs font-semibold text-[#10154A]">Last 30 Days</span>
          <ChevronDown size={14} className="text-gray-500" />
        </div>
        
        <div className="flex items-center gap-4">
          <button className="relative text-gray-500 hover:text-[#10154A] transition-colors">
            <Bell size={20} />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#5B16F5] text-white text-[8px] font-bold flex items-center justify-center rounded-full border-2 border-[#FCFBFF]">2</span>
          </button>
          
          <div className="w-px h-6 bg-gray-200" />
          
          <div className="flex items-center gap-2.5 cursor-pointer hover:bg-white px-2 py-1 rounded-full transition-colors border border-transparent hover:border-gray-200 hover:shadow-sm">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#5B16F5] to-[#6D28F2] text-white flex items-center justify-center font-bold text-sm">{initials}</div>
            <div className="hidden md:block text-left pr-1">
              <div className="font-bold text-sm text-[#10154A] leading-tight">{userName}</div>
              <div className="text-[11px] text-gray-500">Creator</div>
            </div>
            <ChevronDown size={14} className="text-gray-400 hidden md:block" />
          </div>
        </div>
      </div>
    </header>
  );
}

// --- KPI Card ---
function KPICard({ icon: Icon, title, metric, change, subtitle }: { icon: any, title: string, metric: string, change: string, subtitle: string }) {
  return (
    <div className="bg-white rounded-[16px] border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.04)] p-5 flex items-start gap-4 flex-1 min-w-[200px]">
      <div className="w-11 h-11 rounded-full bg-[#F5F3FA] flex items-center justify-center shrink-0">
        <Icon size={20} className="text-[#5B16F5]" />
      </div>
      <div>
        <div className="text-[11px] font-bold text-[#10154A] mb-1">{title}</div>
        <div className="text-2xl font-bold text-[#10154A] leading-none mb-2">{metric}</div>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-bold text-green-600 flex items-center">
            <ArrowUp size={10} className="mr-0.5" /> {change}
          </span>
        </div>
        <div className="text-[9px] font-medium text-gray-400 mt-0.5">{subtitle}</div>
      </div>
    </div>
  );
}

// --- Content Performance Chart ---
function ContentPerformanceChart() {
  return (
    <div className="bg-white rounded-[16px] border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.04)] p-6 mb-6">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h3 className="text-base font-bold text-[#10154A] mb-1">Content Performance</h3>
          <p className="text-xs font-medium text-gray-500">Views and watch time over the selected period</p>
        </div>
        <div className="flex bg-white border border-gray-100 p-1 rounded-xl shadow-sm">
          <button className="px-4 py-1.5 bg-[#5B16F5] text-white text-xs font-semibold rounded-lg shadow-sm">Views</button>
          <button className="px-4 py-1.5 bg-transparent text-[#10154A] text-xs font-semibold rounded-lg hover:bg-gray-50">Watch Time</button>
          <button className="px-4 py-1.5 bg-transparent text-[#10154A] text-xs font-semibold rounded-lg hover:bg-gray-50">Engagement</button>
        </div>
      </div>

      <div className="relative h-[220px] w-full">
        {/* Y Axis */}
        <div className="absolute left-0 top-0 bottom-6 flex flex-col justify-between text-[10px] font-bold text-gray-400 w-8">
          <span>2K</span>
          <span>1.5K</span>
          <span>1K</span>
          <span>500</span>
          <span>0</span>
        </div>
        
        {/* Grid lines */}
        <div className="absolute left-10 right-0 top-1.5 bottom-6 flex flex-col justify-between z-0">
          {[1,2,3,4,5].map((_, i) => (
            <div key={i} className="w-full border-b border-gray-50/50" />
          ))}
        </div>

        {/* X Axis */}
        <div className="absolute left-10 right-0 bottom-0 flex justify-between text-[10px] font-bold text-gray-400 px-2">
          <span>Apr 24</span>
          <span>Apr 27</span>
          <span>Apr 30</span>
          <span>May 3</span>
          <span>May 6</span>
          <span>May 9</span>
          <span>May 12</span>
          <span>May 15</span>
          <span>May 18</span>
          <span>May 21</span>
        </div>

        {/* SVG Chart Area */}
        <div className="absolute left-10 right-0 top-0 bottom-6 z-10">
          <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
            <defs>
              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#5B16F5" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#5B16F5" stopOpacity="0" />
              </linearGradient>
            </defs>
            
            {/* Watch Time (dotted line) */}
            <path d="M0,80 Q5,75 10,85 T20,75 T30,80 T40,65 T50,70 T60,55 T70,75 T80,60 T90,70 T100,65" fill="none" stroke="#b49cf5" strokeWidth="1.5" strokeDasharray="3,3" />
            
            {/* Views Area Fill */}
            <path d="M0,60 Q5,45 10,50 T20,35 T30,45 T40,25 T50,40 T60,20 T70,50 T80,30 T90,55 T100,45 L100,100 L0,100 Z" fill="url(#chartGradient)" />
            
            {/* Views Line */}
            <path d="M0,60 Q5,45 10,50 T20,35 T30,45 T40,25 T50,40 T60,20 T70,50 T80,30 T90,55 T100,45" fill="none" stroke="#5B16F5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            
            {/* Data Points on Views Line */}
            {[
              {x: 0, y: 60}, {x: 10, y: 50}, {x: 20, y: 35}, {x: 30, y: 45}, 
              {x: 40, y: 25}, {x: 50, y: 40}, {x: 60, y: 20}, {x: 70, y: 50}, 
              {x: 80, y: 30}, {x: 90, y: 55}, {x: 100, y: 45}
            ].map((pt, i) => (
              <circle key={i} cx={pt.x} cy={pt.y} r="2" fill="white" stroke="#5B16F5" strokeWidth="1.5" />
            ))}
          </svg>
        </div>
      </div>

      <div className="flex justify-center items-center gap-6 mt-6">
        <div className="flex items-center gap-2 text-xs font-bold text-[#10154A]">
          <span className="w-3 h-1 rounded-full bg-[#5B16F5]" /> Views
        </div>
        <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
          <span className="w-3 h-1 rounded-full border-t-[2px] border-dotted border-[#b49cf5]" /> Watch Time (hrs)
        </div>
      </div>
    </div>
  );
}

// --- Learner Engagement Cards ---
function EngagementCard({ icon: Icon, title, metric, change }: { icon: any, title: string, metric: string, change: string }) {
  return (
    <div className="bg-white rounded-[14px] border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.03)] p-4 flex-1">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-8 h-8 rounded-full bg-[#F5F3FA] flex items-center justify-center shrink-0">
          <Icon size={14} className="text-[#5B16F5]" />
        </div>
        <div>
          <div className="text-[11px] font-bold text-[#10154A]">{title}</div>
          <div className="text-lg font-bold text-[#10154A] leading-tight">{metric}</div>
          <div className="text-[9px] font-bold text-green-600 flex items-center mt-0.5">
            <ArrowUp size={8} className="mr-0.5" /> {change}
          </div>
        </div>
      </div>
      <div className="h-4 w-full opacity-60">
        <svg viewBox="0 0 100 20" preserveAspectRatio="none" className="w-full h-full">
          <path d="M0,15 Q25,5 50,15 T100,10" fill="none" stroke="#5B16F5" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>
    </div>
  );
}

// --- Top Performing Videos ---
function TopVideos() {
  const vids = [
    { title: 'Python for Beginners', views: '8,420', wt: '324 hrs', eng: '18.6%', perf: 'Excellent' },
    { title: 'Data Structures Explained', views: '6,840', wt: '287 hrs', eng: '16.4%', perf: 'Excellent' },
    { title: 'SQL Fundamentals', views: '4,920', wt: '214 hrs', eng: '14.8%', perf: 'Good' },
    { title: 'Machine Learning Basics', views: '2,860', wt: '126 hrs', eng: '12.3%', perf: 'Good' },
  ];

  return (
    <div className="bg-white rounded-[16px] border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.04)] p-6 mb-6">
      <h3 className="text-base font-bold text-[#10154A] mb-4">Top Performing Videos</h3>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-gray-100">
            <th className="pb-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Video</th>
            <th className="pb-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Views</th>
            <th className="pb-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Watch Time</th>
            <th className="pb-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Engagement</th>
            <th className="pb-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Performance</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50/80">
          {vids.map((v, i) => (
            <tr key={i} className="hover:bg-gray-50/50 transition-colors">
              <td className="py-3 flex items-center gap-3">
                <div className="w-10 h-6 bg-[#5B16F5] rounded flex items-center justify-center shrink-0 relative overflow-hidden shadow-sm">
                  <Play size={10} className="text-white fill-white relative z-10" />
                  <div className="absolute inset-0 bg-black/10" />
                  <div className="absolute bottom-0 right-0.5 text-[6px] text-white font-bold bg-black/50 px-0.5 rounded-sm">12:45</div>
                </div>
                <div className="text-xs font-bold text-[#10154A]">{v.title}</div>
              </td>
              <td className="py-3 text-xs font-bold text-[#10154A]">{v.views}</td>
              <td className="py-3 text-xs font-bold text-[#10154A]">{v.wt}</td>
              <td className="py-3 text-xs font-bold text-[#10154A]">{v.eng}</td>
              <td className="py-3">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${v.perf === 'Excellent' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-500'}`}>
                  {v.perf}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// --- Learner Insights ---
function InsightCard({ icon: Icon, title, metric, desc }: { icon: any, title: string, metric: string, desc: string }) {
  return (
    <div className="bg-white rounded-[14px] border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.03)] p-4 flex gap-3 flex-1">
      <div className="w-10 h-10 rounded-full bg-[#F5F3FA] flex items-center justify-center shrink-0">
        <Icon size={18} className="text-[#5B16F5]" />
      </div>
      <div>
        <div className="text-[10px] font-bold text-gray-500 mb-0.5">{title}</div>
        <div className="text-sm font-bold text-[#10154A] mb-1">{metric}</div>
        <div className="text-[10px] font-medium text-gray-400 leading-relaxed pr-2">{desc}</div>
      </div>
    </div>
  );
}

// --- Right Sidebar Sections ---
function AnalyticsFAQ() {
  const [open, setOpen] = useState<number | null>(null);
  const qs = [
    'How are views calculated?',
    'What counts as engagement?',
    'How is watch time measured?',
    'How often is data updated?',
    'How can I improve my analytics?'
  ];
  return (
    <div className="bg-white rounded-[16px] border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.04)] p-5">
      <h3 className="text-sm font-bold text-[#10154A] mb-4">Analytics FAQ</h3>
      <div className="space-y-1">
        {qs.map((q, i) => (
          <div key={i} className="border-b border-gray-50 last:border-0">
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex justify-between items-center py-2.5 text-left text-[11px] font-bold text-gray-600 hover:text-[#10154A] transition-colors"
            >
              <span>{q}</span>
              <ChevronDown size={14} className={`text-gray-400 shrink-0 ml-2 transition-transform ${open === i ? 'rotate-180' : ''}`} />
            </button>
            {open === i && (
              <div className="pb-3 text-[10px] font-medium text-gray-400 leading-relaxed">
                Detailed information regarding {q.toLowerCase()} goes here. Data is tracked securely via CareerForge analytics engine.
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// --- Main Export ---
export default function CreatorAnalytics({ onLogout, onNavigate, userName = 'Arjun Raj' }: { onLogout?: () => void, onNavigate: (v: string) => void, userName?: string }) {
  return (
    <div className="min-h-screen bg-[#FCFBFF] flex font-sans text-gray-900 overflow-hidden">
      <Sidebar onLogout={onLogout} onNavigate={onNavigate} userName={userName} />

      <main className="flex-1 h-screen overflow-y-auto pb-12">
        <Header userName={userName} />

        <div className="px-8 max-w-[1400px] mx-auto pb-12">
          
          {/* KPI Row */}
          <div className="flex flex-wrap gap-5 mb-8">
            <KPICard icon={Eye} title="Total Views" metric="24,680" change="↑ 18.5%" subtitle="vs previous period" />
            <KPICard icon={Clock} title="Total Watch Time" metric="1,248 hrs" change="↑ 12.8%" subtitle="vs previous period" />
            <KPICard icon={Heart} title="Total Engagement" metric="3,842" change="↑ 21.4%" subtitle="vs previous period" />
            <KPICard icon={UserPlus} title="Followers Gained" metric="486" change="↑ 15.2%" subtitle="vs previous period" />
          </div>

          <div className="flex flex-col xl:flex-row gap-8">
            {/* MAIN COLUMN */}
            <div className="flex-1 min-w-0">
              <ContentPerformanceChart />

              {/* Learner Engagement Row */}
              <div className="mb-6">
                <h3 className="text-base font-bold text-[#10154A] mb-4">Learner Engagement</h3>
                <div className="flex gap-4">
                  <EngagementCard icon={ThumbsUp} title="Likes" metric="2,846" change="16.7%" />
                  <EngagementCard icon={MessageSquare} title="Comments" metric="624" change="24.3%" />
                  <EngagementCard icon={Share2} title="Shares" metric="372" change="11.8%" />
                </div>
              </div>

              <TopVideos />

              {/* Learner Insights */}
              <div>
                <h3 className="text-base font-bold text-[#10154A] mb-4">Learner Insights</h3>
                <div className="flex flex-col md:flex-row gap-4">
                  <InsightCard icon={Star} title="Most Engaged Topic" metric="Python" desc="Learners spend the most time on your Python content." />
                  <InsightCard icon={Calendar} title="Best Performing Day" metric="Tuesday" desc="Your videos receive the highest engagement on Tuesdays." />
                  <InsightCard icon={PieChart} title="Average Completion Rate" metric="68.4%" desc="Learners watch more than half of your videos on average." />
                </div>
              </div>

            </div>

            {/* RIGHT SIDEBAR */}
            <div className="w-full xl:w-[280px] shrink-0 space-y-6">
              
              {/* Performance Summary */}
              <div className="bg-white rounded-[16px] border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.04)] p-5">
                <div className="flex gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-[#F5F3FA] flex items-center justify-center shrink-0">
                    <BarChart2 size={16} className="text-[#5B16F5]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#10154A] mb-0.5">Performance Summary</h3>
                    <p className="text-[10px] font-medium text-gray-500 leading-tight">Your content is performing better than the previous period.</p>
                  </div>
                </div>
                <div className="space-y-4 pt-2">
                  <div className="flex justify-between items-center text-xs font-bold">
                    <div className="flex items-center gap-2 text-[#10154A]"><Eye size={14} className="text-[#5B16F5]" /> Views</div>
                    <div className="text-green-600">↑ 18.5%</div>
                  </div>
                  <div className="flex justify-between items-center text-xs font-bold">
                    <div className="flex items-center gap-2 text-[#10154A]"><Clock size={14} className="text-[#5B16F5]" /> Watch Time</div>
                    <div className="text-green-600">↑ 12.8%</div>
                  </div>
                  <div className="flex justify-between items-center text-xs font-bold">
                    <div className="flex items-center gap-2 text-[#10154A]"><Heart size={14} className="text-[#5B16F5]" /> Engagement</div>
                    <div className="text-green-600">↑ 21.4%</div>
                  </div>
                  <div className="flex justify-between items-center text-xs font-bold">
                    <div className="flex items-center gap-2 text-[#10154A]"><UserPlus size={14} className="text-[#5B16F5]" /> Followers</div>
                    <div className="text-green-600">↑ 15.2%</div>
                  </div>
                </div>
              </div>

              {/* Analytics Tips */}
              <div className="bg-white rounded-[16px] border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.04)] p-5">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-[#F5F3FA] flex items-center justify-center">
                    <Lightbulb size={16} className="text-[#5B16F5]" />
                  </div>
                  <h3 className="text-sm font-bold text-[#10154A]">Analytics Tips</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="w-6 h-6 rounded bg-[#F5F3FA] flex items-center justify-center shrink-0">
                      <Star size={12} className="text-[#5B16F5]" />
                    </div>
                    <p className="text-[10px] font-bold text-gray-600 leading-relaxed pt-0.5">Create more content around your top-performing topics.</p>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-6 h-6 rounded bg-[#F5F3FA] flex items-center justify-center shrink-0">
                      <Calendar size={12} className="text-[#5B16F5]" />
                    </div>
                    <p className="text-[10px] font-bold text-gray-600 leading-relaxed pt-0.5">Publish consistently on high-engagement days.</p>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-6 h-6 rounded bg-[#F5F3FA] flex items-center justify-center shrink-0">
                      <TrendingUp size={12} className="text-[#5B16F5]" />
                    </div>
                    <p className="text-[10px] font-bold text-gray-600 leading-relaxed pt-0.5">Use learner engagement to improve future videos.</p>
                  </div>
                </div>
              </div>

              <AnalyticsFAQ />

            </div>
          </div>
          
          {/* Footer */}
          <div className="flex flex-col sm:flex-row justify-between items-center pt-8 text-[11px] font-medium text-gray-400 mt-8 border-t border-gray-100">
            <div>© 2025 CareerForge. Empowering creators. Elevating learning.</div>
            <div className="mt-1 sm:mt-0">Connecting creators with learners. ✨</div>
          </div>

        </div>
      </main>
    </div>
  );
}
