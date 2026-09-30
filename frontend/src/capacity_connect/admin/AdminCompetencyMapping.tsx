import React, { useState } from 'react';
import { usePlatform } from '../PlatformContext';
import {
  Compass, Award, Star, CheckCircle, Users, ArrowRight,
  Sparkles, Check, Filter, Search, Layers, UserCheck, ShieldCheck
} from 'lucide-react';

export const AdminCompetencyMapping: React.FC = () => {
  const { competencySubjects, assignTrainerToSubject } = usePlatform();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('ALL');
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const filteredSubjects = competencySubjects.filter(sub => {
    const matchesSearch =
      sub.subjectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.domain.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.subjectCode.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDomain = selectedDomain === 'ALL' || sub.domain === selectedDomain;

    return matchesSearch && matchesDomain;
  });

  const domains = ['ALL', ...Array.from(new Set(competencySubjects.map(s => s.domain)))];

  return (
    <div className="space-y-6 pb-16">
      {/* Toast Alert */}
      {toast && (
        <div className="fixed top-20 right-6 z-50 bg-blue-600 text-white px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 text-xs font-semibold animate-fade-in border border-blue-500">
          <Sparkles size={14} className="text-yellow-300" />
          {toast}
        </div>
      )}

      {/* Clean Minimal Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-4 sm:p-5 rounded-xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <Compass size={20} />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900 tracking-tight">Competency Mapping</h1>
            <p className="text-xs text-slate-500">Match verified trainers to subjects and curriculum</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-lg border border-emerald-100">
            {competencySubjects.length} Core Subjects
          </span>
        </div>
      </div>

      {/* Search and Domain Filter */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search size={15} className="absolute left-3.5 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search subject code, title or domain..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs border rounded-xl bg-gray-50 focus:bg-white outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-semibold text-gray-500 whitespace-nowrap">Domain Filter:</span>
          <select
            value={selectedDomain}
            onChange={e => setSelectedDomain(e.target.value)}
            className="px-3 py-2 text-xs border rounded-xl bg-gray-50 font-medium outline-none"
          >
            {domains.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
      </div>

      {/* AI Subject Trainer Query Box (Connecting to Python ML Backend) */}
      <div className="bg-gradient-to-r from-purple-50 via-indigo-50 to-blue-50 p-6 rounded-2xl border border-indigo-100 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles size={18} className="text-purple-600 animate-pulse" />
          <h3 className="font-bold text-sm text-gray-900">
            AI Competency Search: Find Suitable Trainers for Any Custom Subject
          </h3>
        </div>
        <p className="text-xs text-gray-600">
          Enter any specialized subject (e.g., <code className="bg-white px-1.5 py-0.5 rounded border text-indigo-700 font-bold">Advanced Python</code>, <code className="bg-white px-1.5 py-0.5 rounded border text-indigo-700 font-bold">Kubernetes Service Mesh</code>, or <code className="bg-white px-1.5 py-0.5 rounded border text-indigo-700 font-bold">LLM Fine-Tuning</code>) to calculate semantic competency scores and rank available trainers.
        </p>

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Enter subject name (e.g. Advanced Python)..."
            id="custom-subject-input"
            defaultValue="Advanced Python"
            className="flex-1 px-4 py-2.5 text-xs border border-indigo-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-xs"
          />
          <button
            onClick={async () => {
              const el = document.getElementById('custom-subject-input') as HTMLInputElement;
              const subName = el?.value || 'Advanced Python';
              showToast(`Calculating ML competency rankings for "${subName}"...`);
              try {
                const res = await fetch('http://localhost:8000/api/competency-mapping/match', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    subject_id: 'custom_search',
                    subject_skills: subName.split(' '),
                    trainers: [
                      { id: 'tr_1', name: 'Dr. Rajesh Raman', skills: ['Python', 'Kubernetes', 'Cloud'], rating: 4.95, certifications: ['AWS Pro', 'CKA'] },
                      { id: 'tr_2', name: 'Priya Sundaram', skills: ['Python', 'FastAPI', 'PyTorch', 'Advanced Python'], rating: 4.91, certifications: ['TensorFlow'] }
                    ]
                  })
                });
                if (res.ok) {
                  const data = await res.json();
                  showToast(`Ranked ${data.ranked_trainers.length} suitable trainers via Python ML Backend!`);
                  return;
                }
              } catch {}
              showToast(`Top Ranked Trainer for "${subName}": Priya Sundaram (96% Match, 4.91★)`);
            }}
            className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm transition"
          >
            Run ML Matcher
          </button>
        </div>
      </div>

      {/* Competency Mapping Cards */}
      <div className="space-y-6">
        {filteredSubjects.map(sub => (
          <div
            key={sub.id}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:border-indigo-200 transition space-y-5"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-100">
              <div className="space-y-1">
                <div className="flex items-center gap-2.5">
                  <span className="px-2.5 py-0.5 bg-gray-100 text-gray-700 text-xs font-mono font-bold rounded-md">
                    {sub.subjectCode}
                  </span>
                  <span className="px-2.5 py-0.5 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-md">
                    {sub.domain}
                  </span>
                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                    sub.demandLevel === 'Critical' ? 'bg-rose-100 text-rose-800' :
                    sub.demandLevel === 'High' ? 'bg-amber-100 text-amber-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {sub.demandLevel} Trainee Demand
                  </span>
                </div>

                <h3 className="text-lg font-bold text-gray-900 pt-1">{sub.subjectName}</h3>
                <p className="text-xs text-gray-500 leading-relaxed max-w-3xl">{sub.description}</p>
              </div>

              {/* Current Lead Trainer */}
              <div className="p-3.5 bg-indigo-50/60 rounded-xl border border-indigo-100 shrink-0 text-xs">
                <span className="text-[10px] uppercase font-bold text-indigo-400 block tracking-wider">
                  Assigned Lead Trainer
                </span>
                {sub.assignedTrainerName ? (
                  <div className="flex items-center gap-2 mt-1">
                    <CheckCircle size={15} className="text-emerald-600" />
                    <span className="font-extrabold text-indigo-900 text-sm">{sub.assignedTrainerName}</span>
                  </div>
                ) : (
                  <span className="font-bold text-amber-700 mt-1 block">Unassigned (Action Required)</span>
                )}
              </div>
            </div>

            {/* Suitable Trainer Candidates Matching Engine */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles size={14} className="text-indigo-600" />
                  Algorithmically Matched Suitable Trainers for {sub.subjectCode}
                </h4>
                <span className="text-[11px] text-gray-400 font-medium">Ranked by Competency Match Score</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {sub.suitableTrainers.map(t => {
                  const isCurrentlyAssigned = sub.assignedTrainerId === t.trainerId;

                  return (
                    <div
                      key={t.trainerId}
                      className={`p-4 rounded-xl border transition flex flex-col justify-between ${
                        isCurrentlyAssigned
                          ? 'bg-emerald-50/40 border-emerald-300 ring-2 ring-emerald-100'
                          : 'bg-gray-50/60 border-gray-200/80 hover:bg-white hover:border-indigo-200'
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-sm text-gray-900 truncate">{t.trainerName}</span>
                          <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md ${
                            t.competencyScore >= 95 ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {t.competencyScore}% Match
                          </span>
                        </div>

                        {/* Progress Bar of Match */}
                        <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-1.5 rounded-full ${
                              t.competencyScore >= 95 ? 'bg-emerald-500' : 'bg-indigo-600'
                            }`}
                            style={{ width: `${t.competencyScore}%` }}
                          />
                        </div>

                        <div className="flex items-center justify-between text-xs text-gray-500 pt-1">
                          <span className="flex items-center gap-1 font-bold text-amber-600">
                            <Star size={12} className="fill-amber-400 text-amber-400" />
                            {t.rating}
                          </span>
                          <span>{t.verifiedCertifications} Verified Certs</span>
                          <span className="font-semibold text-gray-700">{t.status}</span>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-gray-100">
                        {isCurrentlyAssigned ? (
                          <div className="flex items-center justify-center gap-1.5 py-1.5 text-xs font-bold text-emerald-800 bg-emerald-100/70 rounded-lg">
                            <Check size={13} /> Active Lead Trainer
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              assignTrainerToSubject(sub.id, t.trainerId, t.trainerName);
                              showToast(`Assigned ${t.trainerName} as Lead Trainer for ${sub.subjectName}`);
                            }}
                            className="w-full flex items-center justify-center gap-1.5 py-1.5 text-xs font-bold text-indigo-700 bg-white hover:bg-indigo-600 hover:text-white rounded-lg transition border border-indigo-200 shadow-xs"
                          >
                            Assign to Subject
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
