import React, { useState } from 'react';
import { usePlatform } from '../PlatformContext';
import { CourseRoadmapPath } from './CourseRoadmapPath';
import { CourseCertificateModal } from '../common/CourseCertificateModal';
import { PlatformCourse, EnrolledCourse } from '../types';
import {
  BookOpen, CheckCircle2, Clock, Award, FileText, Video,
  ChevronRight, Sparkles, Star, Download, Plus, ArrowRight,
  UserCheck, Building, Check, Layers, AlertCircle, Search, Filter, X
} from 'lucide-react';

export const TraineeCoursesHub: React.FC = () => {
  const {
    traineeProfile,
    allCourses,
    enrollInCourse,
    setActiveNavTab
  } = usePlatform();

  const enrolled = traineeProfile.enrolledCourses || [];

  // Dedicated Course Page Navigation state
  // null = viewing all enrolled courses list
  // courseId = viewing the dedicated new page for this specific course and its roadmap!
  const [viewingCourseId, setViewingCourseId] = useState<string | null>(null);

  // Filter or browse catalog modal
  const [showCatalogModal, setShowCatalogModal] = useState(false);
  const [catalogSearch, setCatalogSearch] = useState('');
  const [catalogCategory, setCatalogCategory] = useState('ALL');

  // Certificate Modal State
  const [certModalData, setCertModalData] = useState<{
    studentName: string;
    courseTitle: string;
    date?: string;
    trainerName?: string;
    credentialId?: string;
  } | null>(null);

  // Catalog category filter options
  const catalogCategories = ['ALL', ...Array.from(new Set(allCourses.map(c => c.category)))];

  const filteredCatalog = allCourses.filter(c => {
    const matchesSearch =
      c.title.toLowerCase().includes(catalogSearch.toLowerCase()) ||
      c.description.toLowerCase().includes(catalogSearch.toLowerCase()) ||
      c.trainerName.toLowerCase().includes(catalogSearch.toLowerCase()) ||
      c.category.toLowerCase().includes(catalogSearch.toLowerCase());

    const matchesCategory = catalogCategory === 'ALL' || c.category === catalogCategory;
    return matchesSearch && matchesCategory;
  });

  // If a specific course is clicked, OPEN ITS DEDICATED NEW PAGE with its own roadmap!
  if (viewingCourseId) {
    const activeEnrolledCourse = enrolled.find(c => c.id === viewingCourseId);
    const activeCatalogCourse = allCourses.find(c => c.id === viewingCourseId);

    const activeCourseData: EnrolledCourse = activeEnrolledCourse || {
      id: activeCatalogCourse?.id || viewingCourseId,
      title: activeCatalogCourse?.title || 'Selected Course',
      category: activeCatalogCourse?.category || 'Engineering',
      trainerName: activeCatalogCourse?.trainerName || 'Assigned Faculty',
      progress: 0,
      totalModules: activeCatalogCourse?.totalModules || 10,
      completedModules: 0,
      enrolledDate: 'Today',
      lastActive: 'Now',
      thumbnail: activeCatalogCourse?.thumbnail || '/course-thumbnails/ai.jpg'
    };

    return (
      <div className="space-y-6 animate-fadeIn">
        <CourseRoadmapPath
          activeCourse={activeCourseData}
          onBack={() => setViewingCourseId(null)}
          onExploreMore={() => {
            setViewingCourseId(null);
            setShowCatalogModal(true);
          }}
        />
      </div>
    );
  }

  // =========================================================================
  // MAIN "MY COURSES" PAGE (List of Enrolled Courses)
  // =========================================================================
  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-bold rounded-full uppercase tracking-wider border border-blue-200 flex items-center gap-1">
              <BookOpen size={11} /> Learning Portfolio
            </span>
            <span className="text-xs text-slate-400 font-medium">• Enrolled Courses</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1 flex items-center gap-3">
            <span>My Courses</span>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded-full">
              {enrolled.length} Active
            </span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
            Select any enrolled course below to open its dedicated learning page and interactive strategy roadmap.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setShowCatalogModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md transition cursor-pointer"
          >
            <Plus size={16} />
            <span>Enroll More Courses</span>
          </button>
        </div>
      </div>

      {/* Enrolled Courses Grid */}
      {enrolled.length === 0 ? (
        <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-10 text-center space-y-4 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto shadow-xs">
            <BookOpen size={28} />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-lg">No Enrolled Courses Found</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
              Enroll in premier national curriculum & engineering courses to instantly access your dedicated strategy roadmap, video lectures, and faculty handbooks.
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={() => setShowCatalogModal(true)}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md transition cursor-pointer inline-flex items-center gap-2"
            >
              <Plus size={14} />
              <span>Browse 13+ Industry & Technology Courses</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrolled.map(course => {
            const hasCert = course.certificateApproved || course.progress >= 100;

            return (
              <div
                key={course.id}
                onClick={() => setViewingCourseId(course.id)}
                className="group bg-white rounded-3xl overflow-hidden border border-slate-200/90 hover:border-blue-400 hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between"
              >
                {/* Course Thumbnail Image */}
                <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                  <img
                    src={course.thumbnail || '/course-thumbnails/ai.jpg'}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  
                  <span className="absolute top-3 left-3 px-2.5 py-0.5 bg-white/95 backdrop-blur-xs text-[10px] font-bold rounded-md text-slate-800 uppercase tracking-wider shadow-xs">
                    {course.category}
                  </span>

                  {hasCert && (
                    <span className="absolute top-3 right-3 px-2.5 py-0.5 bg-emerald-500 text-white text-[10px] font-bold rounded-md flex items-center gap-1 shadow-xs">
                      <CheckCircle2 size={11} /> Certificate Ready
                    </span>
                  )}

                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                    <span className="font-semibold text-xs truncate max-w-[200px]">
                      {course.trainerName}
                    </span>
                    <span className="font-mono font-bold bg-black/60 px-2 py-0.5 rounded text-[11px]">
                      {course.progress}% Completed
                    </span>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="font-bold text-base text-slate-900 group-hover:text-blue-600 transition leading-snug line-clamp-2">
                      {course.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      {course.completedModules} of {course.totalModules} modules completed
                    </p>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between pt-1 text-xs">
                      <span className="text-slate-500 font-medium">Dedicated Roadmap</span>
                      <div className="flex items-center gap-1 font-bold text-blue-600 group-hover:translate-x-0.5 transition-transform">
                        <span>Open Course Roadmap</span>
                        <ChevronRight size={14} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: EXPLORE & ENROLL MORE COURSES CATALOG                               */}
      {/* ========================================================================= */}
      {showCatalogModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-4xl w-full border border-slate-200 shadow-2xl max-h-[90vh] flex flex-col space-y-4 animate-scaleUp">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <BookOpen size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">National Technical Course Catalog</h3>
                  <span className="text-xs text-slate-500">
                    Enroll in verified courses to unlock their tailored 4-item strategy roadmap
                  </span>
                </div>
              </div>

              <button
                onClick={() => setShowCatalogModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-xl transition cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Search and Category Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search course title, domain, or instructor..."
                  value={catalogSearch}
                  onChange={e => setCatalogSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs">
                {catalogCategories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setCatalogCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition cursor-pointer ${
                      catalogCategory === cat
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Courses Catalog Grid */}
            <div className="flex-1 overflow-y-auto pr-1 grid grid-cols-1 md:grid-cols-2 gap-4 custom-scrollbar">
              {filteredCatalog.map(course => {
                const isAlreadyEnrolled = enrolled.some(e => e.id === course.id);

                return (
                  <div
                    key={course.id}
                    className="p-4 rounded-2xl border border-slate-200 hover:border-blue-300 transition flex flex-col justify-between space-y-3 bg-white shadow-2xs"
                  >
                    <div className="flex items-start gap-3">
                      <img
                        src={course.thumbnail || '/course-thumbnails/ai.jpg'}
                        alt={course.title}
                        className="w-16 h-16 rounded-xl object-cover shrink-0 border border-slate-100"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1 mb-0.5">
                          <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider bg-blue-50 px-2 py-0.5 rounded">
                            {course.category}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">
                            {course.code}
                          </span>
                        </div>
                        <h4 className="font-bold text-sm text-slate-900 leading-snug truncate">
                          {course.title}
                        </h4>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Trainer: <strong className="text-slate-700">{course.trainerName}</strong> • {course.totalModules} Modules
                        </p>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                      {course.description}
                    </p>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] font-medium text-slate-400">
                        4-Step Strategy Roadmap Included
                      </span>

                      {isAlreadyEnrolled ? (
                        <button
                          onClick={() => {
                            setShowCatalogModal(false);
                            setViewingCourseId(course.id);
                          }}
                          className="px-3.5 py-1.5 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 text-xs font-bold rounded-xl border border-emerald-200 transition cursor-pointer flex items-center gap-1.5"
                        >
                          <Check size={13} className="text-emerald-600" />
                          <span>View Roadmap</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            enrollInCourse(course);
                            setShowCatalogModal(false);
                            setViewingCourseId(course.id);
                          }}
                          className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition shadow-xs cursor-pointer flex items-center gap-1"
                        >
                          <Plus size={13} />
                          <span>Enroll & Open</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
