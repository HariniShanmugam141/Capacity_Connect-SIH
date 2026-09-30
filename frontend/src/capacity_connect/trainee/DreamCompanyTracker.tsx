import React, { useState } from 'react';
import { 
  Building2, Target, BookOpen, CheckCircle2, ChevronRight, 
  ArrowRight, Sparkles, Code2, Layers, Briefcase, Zap, ShieldCheck,
  Check, Plus, X
} from 'lucide-react';
import { DREAM_COMPANIES_DATA, DreamCompany } from '../dreamCompaniesData';
import { PlatformCourse } from '../types';

interface DreamCompanyTrackerProps {
  currentDreamCompany?: string;
  currentDreamCompanies?: string[];
  onSelectCompany?: (companyName: string) => void;
  onSelectCompanies?: (companyNames: string[]) => void;
  allCourses: PlatformCourse[];
  enrolledCourseIds: string[];
  onEnrollCourse: (course: PlatformCourse) => void;
}

export const DreamCompanyTracker: React.FC<DreamCompanyTrackerProps> = ({
  currentDreamCompany,
  currentDreamCompanies,
  onSelectCompany,
  onSelectCompanies,
  allCourses,
  enrolledCourseIds,
  onEnrollCourse
}) => {
  // Support multiple selected companies
  const initialSelectedNames: string[] = (() => {
    if (currentDreamCompanies && currentDreamCompanies.length > 0) {
      return currentDreamCompanies;
    }
    if (currentDreamCompany) {
      return currentDreamCompany.split(',').map(s => s.trim()).filter(Boolean);
    }
    try {
      const saved = localStorage.getItem('trainee_dream_companies');
      if (saved) return JSON.parse(saved);
    } catch {}
    return ['Meta', 'Google'];
  })();

  const [selectedCompanyNames, setSelectedCompanyNames] = useState<string[]>(initialSelectedNames);

  // Active company whose DSA curriculum is currently being viewed
  const [activeCompanyId, setActiveCompanyId] = useState<string>(() => {
    const first = DREAM_COMPANIES_DATA.find(c => 
      initialSelectedNames.some(name => name.toLowerCase() === c.name.toLowerCase() || name.toLowerCase() === c.id.toLowerCase())
    );
    return first ? first.id : 'meta';
  });

  const [activeTab, setActiveTab] = useState<'dsa' | 'courses' | 'rounds'>('dsa');
  const [showCompanyPicker, setShowCompanyPicker] = useState<boolean>(false);
  const [enrollSuccessMessage, setEnrollSuccessMessage] = useState<string | null>(null);

  // Resolve currently active company object
  const activeCompany: DreamCompany = 
    DREAM_COMPANIES_DATA.find(c => c.id === activeCompanyId) || 
    DREAM_COMPANIES_DATA.find(c => c.name.toLowerCase() === activeCompanyId.toLowerCase()) || 
    DREAM_COMPANIES_DATA[0];

  // Resolve all selected company objects
  const selectedCompanyObjects: DreamCompany[] = DREAM_COMPANIES_DATA.filter(comp =>
    selectedCompanyNames.some(
      n => n.toLowerCase() === comp.name.toLowerCase() || n.toLowerCase() === comp.id.toLowerCase()
    )
  );

  // Fallback if none matched
  if (selectedCompanyObjects.length === 0) {
    selectedCompanyObjects.push(activeCompany);
  }

  // Toggle company multi-selection
  const toggleCompanySelection = (comp: DreamCompany) => {
    const isAlreadySelected = selectedCompanyNames.some(
      n => n.toLowerCase() === comp.name.toLowerCase() || n.toLowerCase() === comp.id.toLowerCase()
    );

    let nextNames: string[];
    if (isAlreadySelected) {
      if (selectedCompanyNames.length <= 1) {
        // Keep at least one company selected
        return;
      }
      nextNames = selectedCompanyNames.filter(
        n => n.toLowerCase() !== comp.name.toLowerCase() && n.toLowerCase() !== comp.id.toLowerCase()
      );
      if (activeCompanyId === comp.id) {
        const remainingComp = DREAM_COMPANIES_DATA.find(c => 
          nextNames.some(n => n.toLowerCase() === c.name.toLowerCase() || n.toLowerCase() === c.id.toLowerCase())
        );
        if (remainingComp) setActiveCompanyId(remainingComp.id);
      }
    } else {
      nextNames = [...selectedCompanyNames, comp.name];
      setActiveCompanyId(comp.id);
    }

    setSelectedCompanyNames(nextNames);
    try {
      localStorage.setItem('trainee_dream_companies', JSON.stringify(nextNames));
    } catch {}

    if (onSelectCompanies) {
      onSelectCompanies(nextNames);
    }
    if (onSelectCompany) {
      onSelectCompany(nextNames[0] || comp.name);
    }
  };

  const handleSelectAllFaang = () => {
    const faangNames = DREAM_COMPANIES_DATA.filter(c => c.tier.includes('FAANG') || c.tier.includes('Tier-1')).map(c => c.name);
    setSelectedCompanyNames(faangNames);
    if (!faangNames.some(n => n.toLowerCase() === activeCompany.name.toLowerCase())) {
      setActiveCompanyId('meta');
    }
    try {
      localStorage.setItem('trainee_dream_companies', JSON.stringify(faangNames));
    } catch {}
    if (onSelectCompanies) onSelectCompanies(faangNames);
    if (onSelectCompany && faangNames[0]) onSelectCompany(faangNames[0]);
  };

  const handleSelectAll = () => {
    const allNames = DREAM_COMPANIES_DATA.map(c => c.name);
    setSelectedCompanyNames(allNames);
    try {
      localStorage.setItem('trainee_dream_companies', JSON.stringify(allNames));
    } catch {}
    if (onSelectCompanies) onSelectCompanies(allNames);
    if (onSelectCompany && allNames[0]) onSelectCompany(allNames[0]);
  };

  const handleEnroll = (course: PlatformCourse) => {
    onEnrollCourse(course);
    setEnrollSuccessMessage(`Successfully enrolled in "${course.title}"! Course roadmap generated.`);
    setTimeout(() => setEnrollSuccessMessage(null), 4000);
  };

  // Matched recommended courses for the currently active company
  const recommendedCourses = allCourses.filter(c => 
    activeCompany.recommendedCourseIds.includes(c.id)
  );

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xl shadow-slate-100/60 relative overflow-hidden space-y-6">
      {/* Top Accent Line */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500" />

      {/* Header & Question */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-bold rounded-full uppercase tracking-wider border border-blue-200 flex items-center gap-1">
              <Target size={11} /> Dream Company Career Blueprint
            </span>
            <span className="text-xs text-slate-400 font-medium">• Multi-Target Preparation Hub</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-1">
            Which are your Dream Companies?
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Select one or multiple target enterprises to unlock company-specific Data Structures & Algorithms, interview rounds, and recommended upskilling paths.
          </p>
        </div>

        <button
          onClick={() => setShowCompanyPicker(!showCompanyPicker)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-bold transition border border-blue-200 cursor-pointer self-start md:self-auto"
        >
          <Building2 size={15} />
          <span>{showCompanyPicker ? 'Close Selector' : `Choose Target Companies (${selectedCompanyNames.length})`}</span>
        </button>
      </div>

      {/* SUCCESS NOTIFICATION */}
      {enrollSuccessMessage && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
          <span>{enrollSuccessMessage}</span>
        </div>
      )}

      {/* MULTI-SELECT COMPANY DRAWER / GRID */}
      {showCompanyPicker && (
        <div className="p-5 sm:p-6 bg-slate-50/90 rounded-2xl border border-slate-200 space-y-4 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
            <div>
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                Choose Multiple Target Companies:
              </span>
              <p className="text-xs text-slate-500 mt-0.5">
                Click any company card to toggle it on or off. You can select as many companies as you aim to crack!
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap shrink-0">
              <span className="px-2.5 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded-lg font-mono">
                {selectedCompanyNames.length} Selected
              </span>
              <button
                onClick={handleSelectAllFaang}
                className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-xs font-semibold transition cursor-pointer"
              >
                All FAANG
              </button>
              <button
                onClick={handleSelectAll}
                className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-xs font-semibold transition cursor-pointer"
              >
                All Companies
              </button>
              <button
                onClick={() => setShowCompanyPicker(false)}
                className="px-3.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition cursor-pointer shadow-xs"
              >
                Done
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {DREAM_COMPANIES_DATA.map(comp => {
              const isSelected = selectedCompanyNames.some(
                n => n.toLowerCase() === comp.name.toLowerCase() || n.toLowerCase() === comp.id.toLowerCase()
              );

              return (
                <button
                  key={comp.id}
                  onClick={() => toggleCompanySelection(comp)}
                  className={`p-3.5 rounded-2xl border text-left transition flex flex-col justify-between gap-2.5 cursor-pointer relative ${
                    isSelected
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md ring-2 ring-blue-400/40'
                      : 'bg-white text-slate-800 border-slate-200 hover:border-blue-300 hover:shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span
                        className="w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-black text-white shrink-0"
                        style={{ backgroundColor: comp.brandColor || '#2563eb' }}
                      >
                        {comp.name.charAt(0)}
                      </span>
                      <span className={`font-black text-sm tracking-tight ${isSelected ? '!text-white' : 'text-slate-900'}`} style={isSelected ? { color: '#ffffff' } : {}}>
                        {comp.name}
                      </span>
                    </div>
                    {isSelected ? (
                      <span className="w-5 h-5 rounded-full bg-white text-blue-600 flex items-center justify-center font-bold text-xs shadow-xs">
                        ✓
                      </span>
                    ) : (
                      <span className="w-5 h-5 rounded-full border border-slate-300 text-slate-400 flex items-center justify-center text-xs">
                        +
                      </span>
                    )}
                  </div>

                  <span className={`text-[10px] font-semibold truncate ${isSelected ? 'text-blue-100' : 'text-slate-500'}`}>
                    {comp.tier}
                  </span>

                  <div className="flex items-center justify-between text-[10px] font-bold">
                    <span className={isSelected ? 'text-white' : 'text-slate-700 font-mono'}>
                      {comp.packageRange.split('/')[0]}
                    </span>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                      isSelected ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {isSelected ? 'Selected' : 'Choose'}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* MULTIPLE SELECTED COMPANIES TABS BAR */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5 mr-1">
            <Target size={14} className="text-blue-600" />
            <span>Active Targets ({selectedCompanyObjects.length}):</span>
          </span>

          {selectedCompanyObjects.map(comp => {
            const isActive = comp.id === activeCompany.id;
            return (
              <button
                key={comp.id}
                onClick={() => setActiveCompanyId(comp.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 !text-white shadow-sm ring-2 ring-blue-400/30'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
                style={isActive ? { color: '#ffffff' } : {}}
              >
                <span
                  className="w-4 h-4 rounded-md flex items-center justify-center text-[9px] font-black text-white shrink-0"
                  style={{ backgroundColor: comp.brandColor || '#2563eb' }}
                >
                  {comp.name.charAt(0)}
                </span>
                <span className={isActive ? '!text-white' : 'text-slate-800'} style={isActive ? { color: '#ffffff' } : {}}>
                  {comp.name}
                </span>
                {isActive && <Check size={13} className="text-white stroke-[3]" />}
              </button>
            );
          })}
        </div>

        <button
          onClick={() => setShowCompanyPicker(!showCompanyPicker)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-blue-50 hover:text-blue-700 text-slate-700 rounded-xl text-xs font-bold transition border border-slate-200 cursor-pointer shadow-2xs"
        >
          <Plus size={13} />
          <span>Add / Remove Companies</span>
        </button>
      </div>

      {/* SELECTED DREAM COMPANY HERO CARD (WITH GUARANTEED CRISP WHITE VISIBILITY) */}
      <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white rounded-2xl p-6 sm:p-7 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 border border-slate-800">
        <div className="space-y-3">
          <div className="flex items-center gap-3.5">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl text-white shadow-lg shrink-0 border border-white/20"
              style={{ backgroundColor: activeCompany.brandColor || '#0668E1' }}
            >
              {activeCompany.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                {/* COMPANY NAME: RENDERED IN GLOWING CRISP WHITE WITH INLINE COLOR GUARANTEE */}
                <h3
                  className="font-black text-2xl sm:text-3xl !text-white tracking-tight drop-shadow-sm"
                  style={{ color: '#ffffff' }}
                >
                  {activeCompany.name}
                </h3>
                <span className="px-2.5 py-0.5 bg-blue-500/25 text-blue-200 text-[10px] font-bold rounded-full border border-blue-400/40 uppercase tracking-wider">
                  {activeCompany.tier}
                </span>
                <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 text-[10px] font-bold rounded-full border border-emerald-400/30">
                  Target Active
                </span>
              </div>
              <span className="text-xs sm:text-sm font-semibold text-slate-200 block mt-0.5">
                {activeCompany.role}
              </span>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
            {activeCompany.description}
          </p>
        </div>

        <div className="flex md:flex-col items-center md:items-end justify-between shrink-0 pt-4 md:pt-0 border-t md:border-t-0 border-white/10 gap-2">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Target Compensation</span>
          <span className="font-mono font-black text-emerald-400 text-base sm:text-lg">
            {activeCompany.packageRange}
          </span>
          <span className="text-[10px] text-slate-300">
            {activeCompany.dsaTopics.length} Core DSA Patterns Required
          </span>
        </div>
      </div>

      {/* SUB-TABS: DSA TOPICS | RECOMMENDED COURSES | INTERVIEW ROUNDS */}
      <div className="flex items-center bg-slate-100 p-1.5 rounded-2xl text-xs font-semibold">
        <button
          onClick={() => setActiveTab('dsa')}
          className={`flex-1 py-2 rounded-xl transition cursor-pointer text-center font-bold flex items-center justify-center gap-1.5 ${
            activeTab === 'dsa'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-blue-600'
          }`}
        >
          <Code2 size={14} />
          <span>{activeCompany.name} DSA Topics ({activeCompany.dsaTopics.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('courses')}
          className={`flex-1 py-2 rounded-xl transition cursor-pointer text-center font-bold flex items-center justify-center gap-1.5 ${
            activeTab === 'courses'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-blue-600'
          }`}
        >
          <BookOpen size={14} />
          <span>Recommended Courses ({recommendedCourses.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('rounds')}
          className={`flex-1 py-2 rounded-xl transition cursor-pointer text-center font-bold flex items-center justify-center gap-1.5 ${
            activeTab === 'rounds'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-blue-600'
          }`}
        >
          <Briefcase size={14} />
          <span>Interview Rounds ({activeCompany.interviewRounds.length})</span>
        </button>
      </div>

      {/* TAB 1: DSA TOPICS SPECIFICALLY ASKED AT THIS COMPANY */}
      {activeTab === 'dsa' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Essential problem-solving concepts prioritized in {activeCompany.name} interviews:</span>
            <span className="font-semibold text-blue-600">Master all topics for OA clearance</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeCompany.dsaTopics.map(topic => (
              <div
                key={topic.id}
                className="p-4 bg-slate-50/70 hover:bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:border-blue-300 transition space-y-2.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block">
                      {topic.category}
                    </span>
                    <h4 className="font-bold text-sm text-slate-900 mt-0.5">{topic.name}</h4>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="px-2 py-0.5 bg-rose-50 text-rose-700 text-[10px] font-bold rounded border border-rose-200">
                      {topic.difficulty}
                    </span>
                    <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-bold rounded border border-blue-200">
                      {topic.frequency}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {topic.description}
                </p>

                <div className="pt-2 border-t border-slate-200/60">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Key Tested Algorithms & Patterns:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {topic.keyAlgorithms.map((alg, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 bg-white text-slate-800 rounded-md text-[11px] font-medium border border-slate-200 shadow-2xs"
                      >
                        {alg}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: RECOMMENDED PLATFORM COURSES TAILORED FOR THIS COMPANY */}
      {activeTab === 'courses' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Specialized CapacityConnect courses designed to crack {activeCompany.name}'s technical requirements:</span>
            <span className="font-semibold text-blue-600">1-Click Enrollment</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendedCourses.map(course => {
              const isEnrolled = enrolledCourseIds.includes(course.id);
              return (
                <div
                  key={course.id}
                  className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm hover:border-blue-300 transition flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-bold rounded border border-blue-100">
                        {course.category}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400 font-semibold">{course.code}</span>
                    </div>

                    <h4 className="font-bold text-sm text-slate-900 line-clamp-1">{course.title}</h4>
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{course.description}</p>

                    <div className="pt-2 text-xs text-slate-500">
                      <span>Trainer: <strong className="text-slate-800">{course.trainerName}</strong></span>
                      <span className="block text-[11px] text-slate-400 mt-0.5">{course.totalModules} Modules • {course.durationWeeks} Weeks</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    {isEnrolled ? (
                      <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                        <CheckCircle2 size={14} /> Enrolled (Roadmap Active)
                      </span>
                    ) : (
                      <button
                        onClick={() => handleEnroll(course)}
                        className="w-full py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Zap size={13} />
                        <span>Enroll & Generate Roadmap</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: COMPANY INTERVIEW PROCESS & ROUNDS */}
      {activeTab === 'rounds' && (
        <div className="space-y-3">
          <div className="text-xs text-slate-500">
            Standard hiring pipeline and evaluation stages for software engineering at {activeCompany.name}:
          </div>

          <div className="space-y-3">
            {activeCompany.interviewRounds.map(round => (
              <div
                key={round.roundNumber}
                className="p-4 bg-slate-50/70 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-start justify-between gap-3 text-xs"
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                    0{round.roundNumber}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-slate-900">{round.title}</h4>
                      <span className="px-2 py-0.5 bg-slate-200/80 text-slate-700 rounded text-[10px] font-semibold">
                        {round.type}
                      </span>
                    </div>
                    <p className="text-slate-600 leading-relaxed">{round.focus}</p>
                    <p className="text-blue-700 font-medium text-[11px] bg-blue-50/60 p-2 rounded-lg border border-blue-100">
                      💡 Pro Tip: {round.tips}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
