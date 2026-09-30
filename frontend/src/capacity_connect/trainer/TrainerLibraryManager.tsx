import React, { useState } from 'react';
import { usePlatform } from '../PlatformContext';
import {
  UploadCloud, Video, Presentation, FileText, Plus, Trash2,
  Download, Eye, Link, Tag, Sparkles
} from 'lucide-react';

export const TrainerLibraryManager: React.FC = () => {
  const { trainerLibrary, addLibraryItem, deleteLibraryItem, trainerProfile } = usePlatform();

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [title, setTitle] = useState('');
  const [type, setType] = useState<'Lecture' | 'Presentation' | 'Study Material'>('Lecture');
  const [subject, setSubject] = useState(trainerProfile.competencies[0] || 'Cloud Computing');
  const [sizeOrDuration, setSizeOrDuration] = useState('65 mins • 1080p HD');
  const [resourceLink, setResourceLink] = useState('https://storage.capacityconnect.org/lectures/sample.mp4');
  const [description, setDescription] = useState('');
  const [tagsInput, setTagsInput] = useState('Kubernetes, Architecture, Microservices');

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addLibraryItem({
      title: title.trim(),
      type,
      subject,
      trainerId: trainerProfile.id,
      trainerName: trainerProfile.fullName,
      description: description.trim() || 'Comprehensive technical study and lecture resource.',
      fileSizeOrDuration: sizeOrDuration.trim() || (type === 'Lecture' ? '60 mins' : '10 MB PDF'),
      resourceLink: resourceLink.trim() || '#',
      tags: tagsInput.split(',').map(t => t.trim()).filter(Boolean)
    });

    setShowUploadModal(false);
    setTitle('');
    setDescription('');
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
              Staff Portal
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
                {item.downloadsCount} Trainee Downloads
              </span>

              <button
                onClick={() => {
                  if (confirm(`Remove "${item.title}" from library?`)) {
                    deleteLibraryItem(item.id);
                  }
                }}
                className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-600 p-1.5 transition"
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
            <h3 className="text-lg font-bold text-gray-900 mb-1">Upload to Trainer Library</h3>
            <p className="text-xs text-gray-500 mb-4">Make lectures, presentations, and code materials available to trainees</p>

            <form onSubmit={handleUploadSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-gray-700">Resource Title</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Istio Service Mesh & Mutual TLS Deep-Dive Lecture"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full mt-1 p-2.5 border rounded-xl"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-gray-700">Resource Type</label>
                  <select
                    value={type}
                    onChange={e => setType(e.target.value as any)}
                    className="w-full mt-1 p-2.5 border rounded-xl bg-white font-medium"
                  >
                    <option value="Lecture">Recorded Lecture (Video)</option>
                    <option value="Presentation">Presentation (Slides/PDF/PPT)</option>
                    <option value="Study Material">Study Material (Code/Runbook/Docs)</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-gray-700">Subject / Category</label>
                  <input
                    required
                    type="text"
                    value={subject}
                    onChange={e => setSubject(e.target.value)}
                    className="w-full mt-1 p-2.5 border rounded-xl"
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
                    className="w-full mt-1 p-2.5 border rounded-xl"
                  />
                </div>

                <div>
                  <label className="font-semibold text-gray-700">Resource Link / Storage URL</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={resourceLink}
                    onChange={e => setResourceLink(e.target.value)}
                    className="w-full mt-1 p-2.5 border rounded-xl"
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
                  className="w-full mt-1 p-2.5 border rounded-xl"
                />
              </div>

              <div>
                <label className="font-semibold text-gray-700">Tags (comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Kubernetes, Istio, ZeroTrust"
                  value={tagsInput}
                  onChange={e => setTagsInput(e.target.value)}
                  className="w-full mt-1 p-2.5 border rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold"
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
