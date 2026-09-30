import React, { useState } from 'react';
import { usePlatform } from '../PlatformContext';
import {
  LayoutDashboard, UserCheck, BookOpen, GraduationCap, Award,
  Users, Layers, Clock, Mail, Star, School, CheckCircle2,
  TrendingUp, BarChart3, Search, ChevronRight
} from 'lucide-react';

export const AdminExecutiveDashboard: React.FC = () => {
  const {
    adminAnalytics,
    allTrainers,
    allCourses,
    allStudents,
    traineeParticipation
  } = usePlatform();

  const [activeTab, setActiveTab] = useState<'overview' | 'staff' | 'courses' | 'students'>('overview');
  const [search, setSearch] = useState('');

  // Filtered lists
  const filteredStaff = allTrainers.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.domain.toLowerCase().includes(search.toLowerCase())
  );

  const filteredCourses = allCourses.filter(c =>
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    c.trainerName.toLowerCase().includes(search.toLowerCase()) ||
    c.category.toLowerCase().includes(search.toLowerCase())
  );

  const filteredStudents = allStudents.filter(s =>
    s.fullName.toLowerCase().includes(search.toLowerCase()) ||
    s.cohort.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Header: Simple, Clean, Intuitive */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <LayoutDashboard size={20} />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900 tracking-tight">Admin Dashboard</h1>
            <span className="text-xs text-slate-500">Live platform monitoring</span>
          </div>
        </div>

        {/* View Switcher: Simple Icon Buttons */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold overflow-x-auto">
          <button
            onClick={() => { setActiveTab('overview'); setSearch(''); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-blue-600 text-white shadow-xs font-semibold'
                : 'text-slate-600 hover:text-blue-700 hover:bg-white/60'
            }`}
          >
            <BarChart3 size={13} />
            <span>Overview</span>
          </button>

          <button
            onClick={() => { setActiveTab('staff'); setSearch(''); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition cursor-pointer ${
              activeTab === 'staff'
                ? 'bg-blue-600 text-white shadow-xs font-semibold'
                : 'text-slate-600 hover:text-blue-700 hover:bg-white/60'
            }`}
          >
            <UserCheck size={13} />
            <span>Staff ({allTrainers.length})</span>
          </button>

          <button
            onClick={() => { setActiveTab('courses'); setSearch(''); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition cursor-pointer ${
              activeTab === 'courses'
                ? 'bg-blue-600 text-white shadow-xs font-semibold'
                : 'text-slate-600 hover:text-blue-700 hover:bg-white/60'
            }`}
          >
            <BookOpen size={13} />
            <span>Courses ({allCourses.length})</span>
          </button>

          <button
            onClick={() => { setActiveTab('students'); setSearch(''); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition cursor-pointer ${
              activeTab === 'students'
                ? 'bg-blue-600 text-white shadow-xs font-semibold'
                : 'text-slate-600 hover:text-blue-700 hover:bg-white/60'
            }`}
          >
            <GraduationCap size={13} />
            <span>Students ({allStudents.length})</span>
          </button>
        </div>
      </div>

      {/* 4 Clean Metric Cards with Prominent Icons & Soft Professional Colors */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Staff */}
        <div
          onClick={() => { setActiveTab('staff'); setSearch(''); }}
          className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex items-center gap-3.5 cursor-pointer hover:border-blue-300 transition group"
        >
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
            <UserCheck size={22} />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900 leading-none">{allTrainers.length}</div>
            <div className="text-xs text-slate-500 font-medium mt-1">Faculty Staff</div>
          </div>
        </div>

        {/* Card 2: Courses */}
        <div
          onClick={() => { setActiveTab('courses'); setSearch(''); }}
          className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex items-center gap-3.5 cursor-pointer hover:border-indigo-300 transition group"
        >
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
            <BookOpen size={22} />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900 leading-none">{allCourses.length}</div>
            <div className="text-xs text-slate-500 font-medium mt-1">Active Courses</div>
          </div>
        </div>

        {/* Card 3: Students */}
        <div
          onClick={() => { setActiveTab('students'); setSearch(''); }}
          className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex items-center gap-3.5 cursor-pointer hover:border-emerald-300 transition group"
        >
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
            <GraduationCap size={22} />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900 leading-none">{allStudents.length}</div>
            <div className="text-xs text-slate-500 font-medium mt-1">Enrolled Students</div>
          </div>
        </div>

        {/* Card 4: Average Score */}
        <div
          onClick={() => setActiveTab('overview')}
          className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex items-center gap-3.5 cursor-pointer hover:border-amber-300 transition group"
        >
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
            <Award size={22} />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900 leading-none">{adminAnalytics.avgAssessmentScore}%</div>
            <div className="text-xs text-slate-500 font-medium mt-1">Average Score</div>
          </div>
        </div>
      </div>

      {/* Search Bar for Staff / Courses / Students */}
      {activeTab !== 'overview' && (
        <div className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          <div className="relative w-full sm:w-80">
            <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder={
                activeTab === 'staff'
                  ? 'Search staff...'
                  : activeTab === 'courses'
                  ? 'Search courses...'
                  : 'Search students...'
              }
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-xl bg-slate-50/50 focus:bg-white focus:border-blue-500 outline-none"
            />
          </div>
        </div>
      )}

      {/* TAB 1: OVERVIEW METRICS */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Enrollment Growth Trend */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <TrendingUp size={16} className="text-blue-600" />
                  <h3 className="text-sm font-bold text-slate-900">Enrollment Growth</h3>
                </div>
                <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                  +18% MoM
                </span>
              </div>

              <div className="h-40 flex items-end justify-between gap-3 pt-6 border-b border-slate-100 pb-2">
                {adminAnalytics.enrollmentTrend.map((bar, i) => {
                  const heightPercent = Math.round((bar.count / 1000) * 100);
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                      <span className="text-[10px] font-semibold text-slate-600">
                        {bar.count}
                      </span>
                      <div
                        className="w-full bg-blue-600 rounded-t-lg transition-all duration-300"
                        style={{ height: `${heightPercent}%` }}
                      />
                      <span className="text-[11px] text-slate-500 font-medium">{bar.month}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Domain Capacity Distribution */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Layers size={16} className="text-indigo-600" />
                  <h3 className="text-sm font-bold text-slate-900">Domain Distribution</h3>
                </div>
                <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                  5 Domains
                </span>
              </div>

              <div className="space-y-3 pt-1">
                {adminAnalytics.subjectDistribution.map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-800">{item.subject}</span>
                      <span className="text-slate-500 text-[11px]">
                        <strong className="text-slate-900">{item.learners}</strong> learners • {item.trainers} trainers
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-blue-600 h-1.5 rounded-full"
                        style={{ width: `${Math.min(100, (item.learners / 1000) * 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Candidate Submissions List */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award size={16} className="text-amber-500" />
                <h3 className="text-sm font-bold text-slate-900">Recent Quiz Activity</h3>
              </div>
              <span className="text-xs text-slate-400">
                {traineeParticipation.length} submissions
              </span>
            </div>

            <div className="divide-y divide-slate-100 text-xs">
              {traineeParticipation.slice(0, 5).map(rec => (
                <div key={rec.id} className="p-3.5 flex items-center justify-between hover:bg-slate-50/50 transition">
                  <div className="flex items-center gap-3">
                    <img
                      src={rec.traineeAvatar}
                      alt={rec.traineeName}
                      className="w-8 h-8 rounded-lg object-cover ring-1 ring-slate-200"
                    />
                    <div>
                      <span className="font-semibold text-slate-900 block">{rec.traineeName}</span>
                      <span className="text-slate-500 text-[11px] block">{rec.questionnaireTitle}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-right">
                    <span className="text-slate-400 text-[10px] hidden sm:inline">{rec.submittedAt}</span>
                    <span className={`px-2 py-0.5 rounded-md font-semibold text-[11px] ${
                      rec.passed
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                        : 'bg-rose-50 text-rose-700 border border-rose-100'
                    }`}>
                      {rec.score}/{rec.totalMarks} ({rec.percentage}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: WATCH ALL STAFF */}
      {activeTab === 'staff' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredStaff.map(trainer => {
            const course = allCourses.find(c => c.trainerId === trainer.id || c.trainerName === trainer.name);
            return (
              <div
                key={trainer.id}
                className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:border-blue-200 transition space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={trainer.avatar}
                      alt={trainer.name}
                      className="w-11 h-11 rounded-xl object-cover ring-1 ring-slate-200 shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-slate-900 truncate">{trainer.name}</h4>
                        <span className="px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded text-[10px] font-semibold border border-blue-100">
                          {trainer.domain}
                        </span>
                      </div>
                      <p className="text-slate-500 text-xs truncate mt-0.5">{trainer.title}</p>
                    </div>
                  </div>

                  <span className="flex items-center gap-1 text-amber-500 text-xs font-bold shrink-0">
                    <Star size={13} className="fill-amber-500" />
                    {trainer.rating}
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-1.5 truncate">
                    <BookOpen size={13} className="text-blue-600 shrink-0" />
                    <span className="truncate">
                      Course: <strong className="text-slate-800">{course ? course.title : 'None assigned'}</strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-1 shrink-0 text-slate-400 text-[11px]">
                    <Users size={12} />
                    <span>{trainer.studentsTaught} taught</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 3: WATCH ALL COURSES */}
      {activeTab === 'courses' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredCourses.map(course => (
            <div
              key={course.id}
              className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:border-indigo-200 transition space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100">
                      {course.category}
                    </span>
                    <span className="font-mono text-slate-400 text-[11px]">{course.code}</span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 mt-1.5">{course.title}</h4>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <img
                    src={course.trainerAvatar}
                    alt={course.trainerName}
                    className="w-6 h-6 rounded-lg object-cover ring-1 ring-slate-200"
                  />
                  <span>Staff: <strong className="text-slate-800">{course.trainerName}</strong></span>
                </div>

                <div className="flex items-center gap-3 text-slate-500">
                  <span className="flex items-center gap-1">
                    <Layers size={12} className="text-indigo-600" /> {course.totalModules} modules
                  </span>
                  <span className="flex items-center gap-1">
                    <GraduationCap size={13} className="text-emerald-600" /> {course.enrolledStudentsCount}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 4: WATCH ALL STUDENTS */}
      {activeTab === 'students' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredStudents.map(student => (
            <div
              key={student.id}
              className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:border-emerald-200 transition space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={student.avatar}
                    alt={student.fullName}
                    className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-200 shrink-0"
                  />
                  <div className="min-w-0">
                    <h4 className="font-bold text-sm text-slate-900 truncate">{student.fullName}</h4>
                    <span className="text-slate-400 text-xs truncate block">{student.cohort}</span>
                  </div>
                </div>

                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-md text-[11px] font-semibold border border-emerald-100 shrink-0">
                  {student.status}
                </span>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-1 text-[11px] truncate">
                  <BookOpen size={12} className="text-blue-600 shrink-0" />
                  <span className="truncate">{student.enrolledCourseNames[0] || 'Enrolled'}</span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="font-bold text-slate-900">{student.averageScore}% avg</span>
                  <span>•</span>
                  <span>{student.quizzesCompleted} quizzes</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
