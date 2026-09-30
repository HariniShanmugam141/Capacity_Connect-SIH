import React, { useState } from 'react';
import { usePlatform } from '../PlatformContext';
import {
  TrendingUp, Users, CheckCircle, XCircle, Search, Filter,
  Award, Clock, Calendar, AlertCircle, BarChart3, CheckCircle2,
  BookOpen, Mail, UserCheck
} from 'lucide-react';

export const TrainerMonitor: React.FC = () => {
  const { traineeParticipation, questionnaires, trainerProfile, allCourses, allStudents } = usePlatform();

  const [activeTab, setActiveTab] = useState<'submissions' | 'students'>('submissions');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedQuizFilter, setSelectedQuizFilter] = useState('ALL');

  // 1. Handled courses for this trainer
  const myCourses = allCourses.filter(
    c => c.trainerId === trainerProfile.id || c.trainerName === trainerProfile.fullName
  );
  const myCourseIds = myCourses.map(c => c.id);

  // 2. Questionnaires owned by this trainer
  const myQuestionnaires = questionnaires.filter(
    q => q.trainerId === trainerProfile.id || q.trainerName === trainerProfile.fullName
  );
  const myQuestionnaireIds = myQuestionnaires.map(q => q.id);

  // 3. Submissions strictly for this trainer's questionnaires
  const myParticipation = traineeParticipation.filter(rec =>
    myQuestionnaireIds.includes(rec.questionnaireId)
  );

  // 4. Students strictly enrolled in this trainer's courses
  const myStudents = allStudents.filter(student =>
    student.enrolledCourseIds.some(cid => myCourseIds.includes(cid))
  );

  // Filtered submissions
  const filteredSubmissions = myParticipation.filter(rec => {
    const matchesSearch =
      rec.traineeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.questionnaireTitle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesQuiz = selectedQuizFilter === 'ALL' || rec.questionnaireId === selectedQuizFilter;
    return matchesSearch && matchesQuiz;
  });

  // Filtered students
  const filteredStudents = myStudents.filter(s =>
    s.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.cohort.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Metrics for THIS trainer's cohort
  const totalAttempts = myParticipation.length;
  const passedCount = myParticipation.filter(r => r.passed).length;
  const passRate = totalAttempts > 0 ? Math.round((passedCount / totalAttempts) * 100) : 0;
  const avgScore =
    totalAttempts > 0
      ? Math.round(myParticipation.reduce((acc, r) => acc + r.percentage, 0) / totalAttempts)
      : 0;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded uppercase tracking-wider border border-emerald-100">
              Staff Portal
            </span>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              My Handled Courses & Students
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Faculty: <strong className="text-slate-800">{trainerProfile.fullName}</strong> • Monitoring enrolled learners and quiz evaluations for your assigned courses.
          </p>
        </div>

        {/* View Switcher */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setActiveTab('submissions')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition cursor-pointer ${
              activeTab === 'submissions' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Award size={13} /> Submissions ({myParticipation.length})
          </button>
          <button
            onClick={() => setActiveTab('students')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition cursor-pointer ${
              activeTab === 'students' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users size={13} /> Enrolled Students ({myStudents.length})
          </button>
        </div>
      </div>

      {/* Handled Course Summary Card */}
      {myCourses.length > 0 && (
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
            Assigned Course Handled
          </span>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">{myCourses[0].title}</h3>
                <span className="text-xs font-mono text-slate-400 font-semibold">{myCourses[0].code}</span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">{myCourses[0].description}</p>
            </div>
            <div className="flex items-center gap-3 shrink-0 text-xs">
              <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg font-medium">
                {myCourses[0].totalModules} Modules
              </span>
              <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg font-medium border border-blue-100">
                {myStudents.length} Active Students Handled
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Metrics for THIS Trainer's Cohort */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          <span className="text-xs text-slate-500 font-medium">My Enrolled Students</span>
          <div className="text-2xl font-bold text-slate-900 mt-1">{myStudents.length}</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          <span className="text-xs text-slate-500 font-medium">Quiz Submissions</span>
          <div className="text-2xl font-bold text-slate-900 mt-1">{totalAttempts}</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          <span className="text-xs text-slate-500 font-medium">Cohort Pass Rate</span>
          <div className="text-2xl font-bold text-slate-900 mt-1">{passRate}%</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          <span className="text-xs text-slate-500 font-medium">Average Score</span>
          <div className="text-2xl font-bold text-slate-900 mt-1">{avgScore}%</div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        <div className="relative w-full sm:w-80">
          <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder={activeTab === 'submissions' ? "Filter submissions..." : "Search handled students..."}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-xl bg-slate-50/50 focus:bg-white outline-none"
          />
        </div>

        {activeTab === 'submissions' && myQuestionnaires.length > 0 && (
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs text-slate-500 whitespace-nowrap">Filter Quiz:</span>
            <select
              value={selectedQuizFilter}
              onChange={e => setSelectedQuizFilter(e.target.value)}
              className="px-3 py-1.5 text-xs border border-slate-200 rounded-xl bg-slate-50/50 outline-none text-slate-700"
            >
              <option value="ALL">All My Quizzes ({myQuestionnaires.length})</option>
              {myQuestionnaires.map(q => (
                <option key={q.id} value={q.id}>{q.title}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* VIEW 1: SUBMISSIONS TABLE (ONLY THIS TRAINER'S) */}
      {activeTab === 'submissions' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Student Assessment Submissions</h3>
            <span className="text-xs text-slate-400">{filteredSubmissions.length} records</span>
          </div>

          {filteredSubmissions.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              No submissions recorded for your handled questionnaires yet.
            </div>
          ) : (
            <div className="divide-y divide-slate-100 text-xs">
              {filteredSubmissions.map(rec => (
                <div key={rec.id} className="p-4 flex items-center justify-between hover:bg-slate-50/50 transition">
                  <div className="flex items-center gap-3">
                    <img
                      src={rec.traineeAvatar}
                      alt={rec.traineeName}
                      className="w-9 h-9 rounded-xl object-cover ring-1 ring-slate-200"
                    />
                    <div>
                      <span className="font-bold text-slate-900 block">{rec.traineeName}</span>
                      <span className="text-slate-500 text-[11px] block mt-0.5">{rec.questionnaireTitle}</span>
                      <span className="text-slate-400 text-[10px] mt-0.5 block">{rec.submittedAt}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-right">
                    <div>
                      <span className="font-bold text-slate-900 block">
                        {rec.score} / {rec.totalMarks}
                      </span>
                      <span className="text-slate-400 text-[10px]">{rec.timeSpentMinutes} mins</span>
                    </div>

                    <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                      rec.passed
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                        : 'bg-rose-50 text-rose-700 border border-rose-100'
                    }`}>
                      {rec.percentage}% {rec.passed ? 'Passed' : 'Needs Review'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: ENROLLED STUDENTS TABLE (ONLY THIS TRAINER'S) */}
      {activeTab === 'students' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Enrolled Students in Your Course</h3>
            <span className="text-xs text-slate-400">{filteredStudents.length} students</span>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {filteredStudents.map(student => (
              <div key={student.id} className="p-4 flex items-center justify-between hover:bg-slate-50/50 transition">
                <div className="flex items-center gap-3">
                  <img
                    src={student.avatar}
                    alt={student.fullName}
                    className="w-9 h-9 rounded-xl object-cover ring-1 ring-slate-200"
                  />
                  <div>
                    <span className="font-bold text-slate-900 block">{student.fullName}</span>
                    <span className="text-slate-500 text-[11px] block">{student.cohort}</span>
                    <span className="text-slate-400 text-[10px] block">{student.email}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-right">
                  <div>
                    <span className="font-bold text-slate-900 block">{student.averageScore}%</span>
                    <span className="text-slate-400 text-[10px]">{student.quizzesCompleted} quizzes taken</span>
                  </div>

                  <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-lg text-xs font-semibold">
                    {student.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
