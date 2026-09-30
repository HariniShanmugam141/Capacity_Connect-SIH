import React, { useState } from 'react';
import { usePlatform } from '../PlatformContext';
import {
  UploadCloud, Video, Presentation, FileText, Plus, Trash2,
  Download, Eye, Link, Tag, Sparkles
} from 'lucide-react';

export const TrainerLibraryManager: React.FC = () => {
  const { trainerLibrary, addLibraryItem, deleteLibraryItem, trainerProfile, allCourses } = usePlatform();

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState(allCourses[0]?.id || 'crs_ml_1');
  const [title, setTitle] = useState('');
  const [type, setType] = useState<'Lecture' | 'Presentation' | 'Study Material' | 'Assignment'>('Lecture');
  const [subject, setSubject] = useState(allCourses[0]?.category || 'Machine Learning');
  const [sizeOrDuration, setSizeOrDuration] = useState('65 mins • 1080p HD');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [resourceLink, setResourceLink] = useState('');
  const [description, setDescription] = useState('');
  const [tagsInput, setTagsInput] = useState('Lecture, Architecture, Core Concepts');

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const chosenCourse = allCourses.find(c => c.id === selectedCourseId) || allCourses[0];

    addLibraryItem({
      title: title.trim(),
      type,
      subject: subject.trim() || chosenCourse?.category || 'Engineering',
      courseId: chosenCourse?.id,
      courseTitle: chosenCourse?.title,
      youtubeUrl: youtubeUrl.trim(),
      trainerId: trainerProfile.id,
      trainerName: trainerProfile.fullName,
      description: description.trim() || `Course resource and lecture for ${chosenCourse?.title || 'Technical Studies'}.`,
      fileSizeOrDuration: sizeOrDuration.trim() || (type === 'Lecture' ? '60 mins • 1080p HD' : '10 MB PDF'),
      resourceLink: youtubeUrl.trim() || resourceLink.trim() || '#',
      tags: tagsInput.split(',').map(t => t.trim()).filter(Boolean)
    });

    setShowUploadModal(false);
    setTitle('');
    setDescription('');
    setYoutubeUrl('');
    setResourceLink('');
  };

  // Filter items belonging strictly to this trainer
  const myLibraryItems = trainerLibrary.filter(
    item => item.trainerId === trainerProfile.id || item.trainerName === trainerProfile.fullName
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-bold rounded uppercase tracking-wider border border-slate-200">
              Trainer Portal
            </span>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              My Course Materials & Lectures
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Manage recorded masterclasses, presentation decks, and study notes for your assigned courses.
          </p>
        </div>

        <button
          onClick={() => setShowUploadModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm transition cursor-pointer"
        >
          <UploadCloud size={15} /> Upload Resource
        </button>
      </div>

      {/* Library Inventory */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {myLibraryItems.map(item => (
          <div
            key={item.id}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:border-purple-200 transition flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold ${
                  item.type === 'Lecture' ? 'bg-rose-50 text-rose-700' :
                  item.type === 'Presentation' ? 'bg-amber-50 text-amber-700' :
                  'bg-blue-50 text-blue-700'
                }`}>
                  {item.type === 'Lecture' && <Video size={13} />}
                  {item.type === 'Presentation' && <Presentation size={13} />}
                  {item.type === 'Study Material' && <FileText size={13} />}
                  {item.type}
                </span>

                <span className="text-[11px] text-gray-400 font-medium">
                  {item.fileSizeOrDuration}
                </span>
              </div>

              <h3 className="font-bold text-base text-gray-900 line-clamp-2">
                {item.title}
              </h3>

              {item.courseTitle && (
                <div className="flex items-center gap-1.5 text-xs text-blue-600 font-semibold bg-blue-50 px-2 py-1 rounded-lg w-fit border border-blue-100">
                  <Sparkles size={12} />
                  <span>Course: {item.courseTitle}</span>
                </div>
              )}

              {item.youtubeUrl && (
                <div className="flex items-center gap-1 text-[11px] text-red-600 font-medium">
                  <Video size={12} />
                  <span className="truncate">YouTube: {item.youtubeUrl}</span>
                </div>
              )}

              <p className="text-xs text-gray-500 line-clamp-3 leading-relaxed">
                {item.description}
              </p>

              <div className="text-xs text-gray-400">
                Subject: <span className="text-gray-700 font-semibold">{item.subject}</span> • Uploaded: {item.uploadedAt}
              </div>

              <div className="flex flex-wrap gap-1 pt-1">
                {item.tags.map((t, idx) => (
                  <span key={idx} className="px-2 py-0.5 bg-gray-50 text-gray-600 rounded text-[10px] font-medium border border-gray-100">
                    #{t}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between">
              <span className="text-xs text-gray-500 font-medium">
                {item.downloadsCount} Trainee Views
              </span>

              <button
                onClick={() => {
                  if (confirm(`Remove "${item.title}" from library?`)) {
                    deleteLibraryItem(item.id);
                  }
                }}
                className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-600 p-1.5 transition cursor-pointer"
              >
                <Trash2 size={15} /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* --- UPLOAD MODAL --- */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-xl border border-gray-100 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-gray-900 mb-1">Upload Course Resource to Library</h3>
            <p className="text-xs text-slate-500 mb-4">Choose a listed course and provide a YouTube lecture or study materials for enrolled trainees.</p>

            <form onSubmit={handleUploadSubmit} className="space-y-4 text-xs">
              {/* Course Selection Dropdown */}
              <div>
                <label className="font-semibold text-slate-800 block mb-1">
                  Target Course (Listed on Website) <span className="text-blue-600">*</span>
                </label>
                <select
                  value={selectedCourseId}
                  onChange={e => {
                    setSelectedCourseId(e.target.value);
                    const matched = allCourses.find(c => c.id === e.target.value);
                    if (matched) {
                      setSubject(matched.category || matched.title);
                    }
                  }}
                  className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition"
                >
                  {allCourses.map(course => (
                    <option key={course.id} value={course.id}>
                      {course.title} ({course.code}) • {course.category}
                    </option>
                  ))}
                </select>
              </div>

              {/* YouTube Video Link Input */}
              <div>
                <label className="font-semibold text-slate-800 flex items-center justify-between block mb-1">
                  <span>YouTube Video Link (Lecture Video for Trainees)</span>
                  <span className="text-[10px] text-blue-600 font-semibold bg-blue-50 px-2 py-0.5 rounded">Saved to Database</span>
                </label>
                <input
                  type="url"
                  placeholder="https://www.youtube.com/watch?v=... or https://youtu.be/..."
                  value={youtubeUrl}
                  onChange={e => {
                    setYoutubeUrl(e.target.value);
                    if (!resourceLink) {
                      setResourceLink(e.target.value);
                    }
                  }}
                  className="w-full p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  When trainees view this course in their roadmap, this YouTube video will be embedded and played for them.
                </p>
              </div>

              <div>
                <label className="font-semibold text-gray-700">Resource Title <span className="text-blue-600">*</span></label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Masterclass: Supervised Classification & Decision Trees"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full mt-1 p-2.5 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-gray-700">Resource Type</label>
                  <select
                    value={type}
                    onChange={e => setType(e.target.value as any)}
                    className="w-full mt-1 p-2.5 border border-slate-200 rounded-xl bg-white font-medium"
                  >
                    <option value="Lecture">Recorded Lecture (Video)</option>
                    <option value="Presentation">Presentation (Slides/PDF/PPT)</option>
                    <option value="Study Material">Study Material (Handbook/Notes)</option>
                    <option value="Assignment">Assignment (Lab/Project)</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-gray-700">Subject / Category</label>
                  <input
                    required
                    type="text"
                    value={subject}
                    onChange={e => setSubject(e.target.value)}
                    className="w-full mt-1 p-2.5 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-gray-700">Duration or File Size</label>
                  <input
                    type="text"
                    placeholder="e.g. 75 mins HD or 14.5 MB PDF"
                    value={sizeOrDuration}
                    onChange={e => setSizeOrDuration(e.target.value)}
                    className="w-full mt-1 p-2.5 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="font-semibold text-gray-700">Downloadable Resource / Storage URL</label>
                  <input
                    type="url"
                    placeholder="https://storage... or leave empty if YouTube only"
                    value={resourceLink}
                    onChange={e => setResourceLink(e.target.value)}
                    className="w-full mt-1 p-2.5 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-gray-700">Description</label>
                <textarea
                  rows={3}
                  placeholder="Explain the concepts covered and prerequisites..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full mt-1 p-2.5 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="font-semibold text-gray-700">Tags (comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Machine Learning, Python, Classification"
                  value={tagsInput}
                  onChange={e => setTagsInput(e.target.value)}
                  className="w-full mt-1 p-2.5 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition shadow-xs cursor-pointer"
                >
                  Publish to Trainee Library
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
