import React, { useState } from 'react';
import { usePlatform } from '../PlatformContext';
import {
  Video, Presentation, FileText, Download, Play, Search,
  Filter, Tag, Calendar, User, Clock, ExternalLink, Bookmark,
  Award, Mail, CheckCircle2, ChevronRight, BookOpen, Zap
} from 'lucide-react';

export const TraineeLibrary: React.FC = () => {
  const { 
    allCourses, 
    trainerLibrary, 
    allTrainers, 
    addTrainerToWishlist, 
    traineeProfile,
    enrollInCourse,
    setActiveNavTab
  } = usePlatform();
  const [activeTab, setActiveTab] = useState<'courses' | 'materials'>('courses');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [wishlistSuccess, setWishlistSuccess] = useState<string | null>(null);
  const [enrollNotification, setEnrollNotification] = useState<string | null>(null);

  // Filter courses
  const filteredCourses = allCourses.filter(course => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.trainerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'ALL' || course.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  // Filter materials
  const filteredMaterials = trainerLibrary.filter(item => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.trainerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'ALL' || item.subject === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const categories = ['ALL', ...Array.from(new Set(allCourses.map(c => c.category)))];

  const handleWishlistTrainer = (trainerId: string, trainerName: string) => {
    const trainerObj = allTrainers.find(t => t.id === trainerId);
    if (trainerObj) {
      addTrainerToWishlist(trainerObj, `Interested in course mentorship under ${trainerName}`);
      setWishlistSuccess(trainerId);
      setTimeout(() => setWishlistSuccess(null), 3000);
    }
  };

  const isTrainerWishlisted = (trainerId: string) => {
    return traineeProfile.wishlistTrainers.some(w => w.trainerId === trainerId);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Section Navigation */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Curriculum Courses & Trainer Directory
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Browse all available courses, inspect respective trainer profiles, and access learning materials.
          </p>
        </div>

        {/* View Switcher */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setActiveTab('courses')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition cursor-pointer ${
              activeTab === 'courses' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen size={13} /> All Courses & Trainers ({allCourses.length})
          </button>
          <button
            onClick={() => setActiveTab('materials')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition cursor-pointer ${
              activeTab === 'materials' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Video size={13} /> Lectures & Study Materials ({trainerLibrary.length})
          </button>
        </div>
      </div>

      {/* Search & Category Filter */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        <div className="relative w-full sm:w-80">
          <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder={activeTab === 'courses' ? "Search courses or trainers..." : "Search materials, topics..."}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-xl bg-slate-50/50 focus:bg-white focus:border-slate-400 outline-none transition"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-500 whitespace-nowrap">Category:</span>
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="px-3 py-1.5 text-xs border border-slate-200 rounded-xl bg-slate-50/50 font-medium outline-none text-slate-700"
          >
            {categories.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* ENROLL NOTIFICATION */}
      {enrollNotification && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center justify-between gap-2 shadow-2xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
            <span>Enrolled in <strong>{enrollNotification}</strong>! Learning roadmap path generated.</span>
          </div>
          <button
            onClick={() => setActiveNavTab('profile')}
            className="text-emerald-800 font-bold underline hover:text-emerald-950 cursor-pointer text-xs"
          >
            View Roadmap Path →
          </button>
        </div>
      )}

      {/* VIEW 1: ALL COURSES & RESPECTIVE TRAINER DETAILS */}
      {activeTab === 'courses' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {filteredCourses.map(course => {
            const wishlisted = isTrainerWishlisted(course.trainerId) || wishlistSuccess === course.trainerId;
            const isEnrolled = traineeProfile.enrolledCourses.some(c => c.id === course.id);
            return (
              <div
                key={course.id}
                className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:border-slate-300 transition flex flex-col justify-between"
              >
                <div>
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-[10px] font-bold uppercase tracking-wider border border-blue-100">
                      {course.category}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400 font-semibold">
                      {course.code}
                    </span>
                  </div>

                  {/* Course Title & Summary */}
                  <h3 className="text-base font-bold text-slate-900 tracking-tight">
                    {course.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                    {course.description}
                  </p>

                  {/* Course Quick Metrics */}
                  <div className="grid grid-cols-3 gap-2 my-3 py-2 px-3 bg-slate-50/80 rounded-xl border border-slate-100 text-center">
                    <div>
                      <span className="text-xs font-bold text-slate-900">{course.totalModules}</span>
                      <span className="block text-[10px] text-slate-400">Modules</span>
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900">{course.durationWeeks} Wks</span>
                      <span className="block text-[10px] text-slate-400">Duration</span>
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900">{course.enrolledStudentsCount}</span>
                      <span className="block text-[10px] text-slate-400">Enrolled</span>
                    </div>
                  </div>

                  {/* RESPECTIVE TRAINER DETAILS CARD */}
                  <div className="mt-3 pt-3 border-t border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                      Course Trainer & Instructor
                    </span>
                    <div className="flex items-start justify-between gap-3 bg-slate-50/60 p-3 rounded-xl border border-slate-200/60">
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={course.trainerAvatar}
                          alt={course.trainerName}
                          className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-200 shrink-0"
                        />
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-slate-900 truncate">
                            {course.trainerName}
                          </h4>
                          <p className="text-[11px] text-slate-500 truncate">
                            {course.trainerTitle}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-500">
                            <span className="text-amber-500 font-bold">★ {course.trainerRating}</span>
                            <span>•</span>
                            <span>{course.trainerExperienceYears} yrs experience</span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => handleWishlistTrainer(course.trainerId, course.trainerName)}
                        disabled={wishlisted}
                        className={`shrink-0 flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition cursor-pointer ${
                          wishlisted
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                        }`}
                        title="Add this trainer to your mentorship wishlist"
                      >
                        {wishlisted ? (
                          <>
                            <CheckCircle2 size={12} /> Wishlisted
                          </>
                        ) : (
                          <>
                            <Bookmark size={12} /> Wishlist Trainer
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="pt-4 mt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-3">
                  <div className="flex items-center gap-2">
                    {isEnrolled ? (
                      <button
                        onClick={() => setActiveNavTab('profile')}
                        className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-xl border border-emerald-200 transition cursor-pointer"
                        title="Click to view learning roadmap path in your profile"
                      >
                        <CheckCircle2 size={13} />
                        <span>Enrolled • View Roadmap Path</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          enrollInCourse(course);
                          setEnrollNotification(course.title);
                          setTimeout(() => setEnrollNotification(null), 5000);
                        }}
                        className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
                      >
                        <Zap size={13} />
                        <span>Enroll & Generate Roadmap</span>
                      </button>
                    )}
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 text-slate-400 text-[11px]">
                    <span>{course.materialsCount} study files</span>
                    <button
                      onClick={() => setActiveTab('materials')}
                      className="flex items-center gap-1 text-blue-600 font-semibold hover:text-blue-700 cursor-pointer"
                    >
                      <span>Lectures</span>
                      <ChevronRight size={13} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW 2: LECTURES & STUDY MATERIALS */}
      {activeTab === 'materials' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredMaterials.map(item => (
            <div
              key={item.id}
              className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:border-slate-300 transition flex flex-col justify-between"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                    item.type === 'Lecture' ? 'bg-rose-50 text-rose-700 border border-rose-100' :
                    item.type === 'Presentation' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                    'bg-blue-50 text-blue-700 border border-blue-100'
                  }`}>
                    {item.type === 'Lecture' && <Video size={11} />}
                    {item.type === 'Presentation' && <Presentation size={11} />}
                    {item.type === 'Study Material' && <FileText size={11} />}
                    {item.type}
                  </span>

                  <span className="text-[10px] text-slate-400 font-medium">
                    {item.fileSizeOrDuration}
                  </span>
                </div>

                <h3 className="font-bold text-sm text-slate-900 line-clamp-2">
                  {item.title}
                </h3>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>

                {/* Respective Staff details on material */}
                <div className="pt-2 text-xs text-slate-500">
                  <span className="text-[11px] block">Instructor: <strong className="text-slate-800">{item.trainerName}</strong></span>
                  <span className="text-[11px] text-slate-400 block mt-0.5">Subject: {item.subject}</span>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  {item.downloadsCount} accesses
                </span>

                {item.type === 'Lecture' ? (
                  <button
                    onClick={() => alert(`Streaming: "${item.title}"`)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition cursor-pointer"
                  >
                    <Play size={12} /> Play
                  </button>
                ) : (
                  <button
                    onClick={() => alert(`Downloading: "${item.title}"`)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 rounded-xl text-xs font-semibold transition cursor-pointer"
                  >
                    <Download size={12} /> Download
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
