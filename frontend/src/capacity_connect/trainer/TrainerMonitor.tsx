import React, { useState } from 'react';
import { usePlatform } from '../PlatformContext';
import {
  TrendingUp, Users, CheckCircle, XCircle, Search, Filter,
  Award, Clock, Calendar, AlertCircle, BarChart3, CheckCircle2,
  BookOpen, Mail, UserCheck, Camera
} from 'lucide-react';
import { CourseCertificateModal } from '../common/CourseCertificateModal';

export const TrainerMonitor: React.FC = () => {
  const { 
    traineeParticipation, 
    questionnaires, 
    trainerProfile, 
    updateTrainerProfile,
    allCourses, 
    allStudents, 
    approveCourseCertificate 
  } = usePlatform();

  const [activeTab, setActiveTab] = useState<'submissions' | 'students'>('submissions');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedQuizFilter, setSelectedQuizFilter] = useState('ALL');
  const [selectedCourseFilter, setSelectedCourseFilter] = useState('ALL');
  const [approvalSuccess, setApprovalSuccess] = useState('');

  // Certificate Modal Preview State
  const [certPreview, setCertPreview] = useState<{
    studentName: string;
    courseTitle: string;
    date: string;
  } | null>(null);

  // Photo upload handler
  const handleTrainerPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          updateTrainerProfile({ avatar: reader.result });
        }
      };
      reader.readAsDataURL(file);
    }
  };

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

  // 3. Submissions strictly for this trainer's questionnaires (or all real submissions if trainer handles all)
  const myParticipation = traineeParticipation.filter(rec =>
    myQuestionnaireIds.length > 0 ? myQuestionnaireIds.includes(rec.questionnaireId) : true
  );

  // 4. Real Trainees strictly enrolled in courses
  const myTrainees = allStudents.filter(trainee => {
    if (selectedCourseFilter !== 'ALL') {
      return trainee.enrolledCourseIds.includes(selectedCourseFilter);
    }
    if (myCourseIds.length > 0) {
      return trainee.enrolledCourseIds.some(cid => myCourseIds.includes(cid));
    }
    return trainee.enrolledCourseIds.length > 0;
  });

  // Filtered submissions
  const filteredSubmissions = myParticipation.filter(rec => {
    const matchesSearch =
      rec.traineeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.questionnaireTitle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesQuiz = selectedQuizFilter === 'ALL' || rec.questionnaireId === selectedQuizFilter;
    return matchesSearch && matchesQuiz;
  });

  // Filtered trainees
  const filteredTrainees = myTrainees.filter(s =>
    s.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.cohort.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.enrolledCourseNames.some(name => name.toLowerCase().includes(searchQuery.toLowerCase()))
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
        <div className="flex items-center gap-4">
          {/* Trainer Avatar Photo with Camera Upload Button */}
          <div className="relative group w-14 h-14 rounded-2xl overflow-hidden shrink-0 border border-slate-200 shadow-xs bg-slate-100">
            <img
              src={trainerProfile.avatar || '/default-avatar.png'}
              alt={trainerProfile.fullName}
              onError={(e) => { e.currentTarget.src = '/default-avatar.png'; }}
              className="w-full h-full object-cover"
            />
            <label className="absolute inset-0 bg-black/60 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer">
              <Camera size={14} />
              <span className="text-[9px] font-bold mt-0.5">Upload</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleTrainerPhotoUpload}
              />
            </label>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded uppercase tracking-wider border border-emerald-100">
                Trainer Portal
              </span>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                My Handled Courses & Trainees
              </h1>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Trainer: <strong className="text-slate-800">{trainerProfile.fullName}</strong> • Monitoring enrolled trainees and certificate approvals.
            </p>
          </div>
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
            <Users size={13} /> Enrolled Trainees ({myTrainees.length})
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
                {myTrainees.length} Active Trainees Handled
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Metrics for THIS Trainer's Cohort */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          <span className="text-xs text-slate-500 font-medium">My Enrolled Trainees</span>
          <div className="text-2xl font-bold text-slate-900 mt-1">{myTrainees.length}</div>
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

        {activeTab === 'students' && (
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs text-slate-500 whitespace-nowrap">Filter Course:</span>
            <select
              value={selectedCourseFilter}
              onChange={e => setSelectedCourseFilter(e.target.value)}
              className="px-3 py-1.5 text-xs border border-slate-200 rounded-xl bg-slate-50/50 outline-none text-slate-700"
            >
              <option value="ALL">All Enrolled Courses</option>
              {allCourses.map(c => (
                <option key={c.id} value={c.id}>{c.title}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* VIEW 1: SUBMISSIONS TABLE (ONLY REAL SUBMISSIONS) */}
      {activeTab === 'submissions' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Trainee Assessment Submissions</h3>
            <span className="text-xs text-slate-400">{filteredSubmissions.length} records</span>
          </div>

          {filteredSubmissions.length === 0 ? (
            <div className="p-12 text-center text-xs text-slate-400">
              <Award size={36} className="mx-auto mb-2 text-slate-300 stroke-[1.5]" />
              <span className="font-semibold text-slate-700 block text-sm">No Assessment Submissions Yet</span>
              <span className="block mt-1 text-slate-500 max-w-sm mx-auto">
                When trainees complete quizzes and assessments for your courses, their verified scores and timestamps will appear here.
              </span>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 text-xs">
              {filteredSubmissions.map(rec => (
                <div key={rec.id} className="p-4 flex items-center justify-between hover:bg-slate-50/50 transition">
                  <div className="flex items-center gap-3">
                    <img
                      src={rec.traineeAvatar || '/default-avatar.png'}
                      alt={rec.traineeName}
                      onError={(e) => { e.currentTarget.src = '/default-avatar.png'; }}
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

      {/* VIEW 2: ENROLLED TRAINEES TABLE (REAL ENROLLED TRAINEES ONLY) */}
      {activeTab === 'students' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Enrolled Trainees & Certificate Approvals</h3>
              <p className="text-[11px] text-slate-500">Review student progress and approve official course completion certificates.</p>
            </div>
            <span className="text-xs text-slate-400">{filteredTrainees.length} trainees</span>
          </div>

          {filteredTrainees.length === 0 ? (
            <div className="p-12 text-center text-xs text-slate-400">
              <Users size={36} className="mx-auto mb-2 text-slate-300 stroke-[1.5]" />
              <span className="font-semibold text-slate-700 block text-sm">No Trainees Enrolled Yet</span>
              <span className="block mt-1 text-slate-500 max-w-sm mx-auto">
                When students enroll in courses, their names, roadmap progress, and certificate approvals will appear here in real-time.
              </span>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 text-xs">
              {filteredTrainees.map(trainee => {
                const currentCourseTitle = trainee.enrolledCourseNames[0] || myCourses[0]?.title || 'Enrolled Course';
                const currentCourseId = trainee.enrolledCourseIds[0] || myCourses[0]?.id || 'crs_1';
                const isApproved = trainee.status === 'Completed' || (trainee.approvedCertificates && trainee.approvedCertificates.length > 0);

                return (
                  <div key={trainee.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/50 transition">
                    <div className="flex items-center gap-3">
                      <img
                        src={trainee.avatar || '/default-avatar.png'}
                        alt={trainee.fullName}
                        onError={(e) => { e.currentTarget.src = '/default-avatar.png'; }}
                        className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-200 shrink-0"
                      />
                      <div>
                        <span className="font-bold text-slate-900 text-sm block">{trainee.fullName}</span>
                        <span className="text-slate-500 text-[11px] block">{trainee.cohort} • <span className="font-mono">{trainee.email}</span></span>
                        
                        {/* List all courses enrolled by this trainee */}
                        <div className="flex flex-wrap items-center gap-1.5 mt-1">
                          {trainee.enrolledCourseNames.map((cName, idx) => (
                            <span key={idx} className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md text-[10px] font-semibold border border-blue-100">
                              {cName}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-center">
                      <div className="text-right hidden sm:block">
                        <span className="font-bold text-slate-900 block">{trainee.averageScore}%</span>
                        <span className="text-slate-400 text-[10px]">{trainee.quizzesCompleted} quizzes taken</span>
                      </div>

                      {isApproved ? (
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold flex items-center gap-1.5">
                            <CheckCircle2 size={13} />
                            <span>Approved ✓</span>
                          </span>
                          <button
                            onClick={() => setCertPreview({
                              studentName: trainee.fullName,
                              courseTitle: currentCourseTitle,
                              date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '.')
                            })}
                            className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                          >
                            <Award size={14} />
                            <span>View Certificate</span>
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            approveCourseCertificate(trainee.fullName, currentCourseId, trainerProfile.fullName);
                            setApprovalSuccess(`Certificate approved and issued for ${trainee.fullName} on ${currentCourseTitle}!`);
                          }}
                          className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                        >
                          <Award size={14} />
                          <span>Approve Certificate</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Official Certificate Modal */}
      {certPreview && (
        <CourseCertificateModal
          isOpen={!!certPreview}
          onClose={() => setCertPreview(null)}
          studentName={certPreview.studentName}
          courseTitle={certPreview.courseTitle}
          issueDate={certPreview.date}
          trainerName={trainerProfile.fullName}
        />
      )}
    </div>
  );
};
