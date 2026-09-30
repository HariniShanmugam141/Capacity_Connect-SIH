import React, { useState } from 'react';
import { usePlatform } from '../PlatformContext';
import {
  Megaphone, Bell, Trophy, BookOpen, Plus, Trash2,
  CheckCircle2, AlertTriangle, Eye, Sparkles, Filter, Check
} from 'lucide-react';
import { HomepageAnnouncement } from '../types';

export const AdminHomepagePublisher: React.FC = () => {
  const { announcements, addAnnouncement, toggleAnnouncement, deleteAnnouncement } = usePlatform();

  const [showPublishModal, setShowPublishModal] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'Announcement' | 'Notification' | 'Achievement' | 'New Learning Content'>('Announcement');
  const [urgency, setUrgency] = useState<'Normal' | 'Important' | 'Critical'>('Normal');
  const [targetRole, setTargetRole] = useState<'ALL' | 'TRAINEE' | 'TRAINER'>('ALL');
  const [content, setContent] = useState('');

  const handlePublishSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    addAnnouncement({
      title: title.trim(),
      category,
      urgency,
      targetRole,
      content: content.trim(),
      active: true,
      author: 'Platform Governance'
    });

    setShowPublishModal(false);
    setTitle('');
    setContent('');
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Clean Minimal Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-4 sm:p-5 rounded-xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Megaphone size={20} />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900 tracking-tight">Announcements</h1>
            <p className="text-xs text-slate-500">Publish platform announcements and updates</p>
          </div>
        </div>

        <button
          onClick={() => setShowPublishModal(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition"
        >
          <Plus size={15} /> New Announcement
        </button>
      </div>

      {/* Broadcast Feed */}
      <div className="space-y-4">
        {announcements.map(ann => (
          <div
            key={ann.id}
            className={`bg-white rounded-2xl p-6 shadow-sm border transition flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
              ann.active ? 'border-gray-200' : 'border-gray-100 opacity-60 bg-gray-50/50'
            }`}
          >
            <div className="flex items-start gap-4">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                ann.category === 'Announcement' ? 'bg-indigo-50 text-indigo-600' :
                ann.category === 'Notification' ? 'bg-amber-50 text-amber-600' :
                ann.category === 'Achievement' ? 'bg-emerald-50 text-emerald-600' :
                'bg-purple-50 text-purple-600'
              }`}>
                {ann.category === 'Announcement' && <Megaphone size={20} />}
                {ann.category === 'Notification' && <Bell size={20} />}
                {ann.category === 'Achievement' && <Trophy size={20} />}
                {ann.category === 'New Learning Content' && <BookOpen size={20} />}
              </div>

              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                    ann.category === 'Announcement' ? 'bg-indigo-100 text-indigo-800' :
                    ann.category === 'Notification' ? 'bg-amber-100 text-amber-800' :
                    ann.category === 'Achievement' ? 'bg-emerald-100 text-emerald-800' :
                    'bg-purple-100 text-purple-800'
                  }`}>
                    {ann.category}
                  </span>

                  {ann.urgency !== 'Normal' && (
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                      ann.urgency === 'Critical' ? 'bg-rose-100 text-rose-800' : 'bg-orange-100 text-orange-800'
                    }`}>
                      {ann.urgency} Priority
                    </span>
                  )}

                  <span className="text-[11px] text-gray-400">Target: {ann.targetRole}</span>
                </div>

                <h3 className="font-bold text-base text-gray-900">{ann.title}</h3>
                <p className="text-xs text-gray-600 leading-relaxed max-w-3xl">{ann.content}</p>

                <div className="text-[11px] text-gray-400 pt-1">
                  Published: {ann.publishedDate} by {ann.author}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 self-end md:self-center shrink-0">
              <button
                onClick={() => toggleAnnouncement(ann.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                  ann.active
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-gray-100 text-gray-600 border-gray-200'
                }`}
              >
                {ann.active ? 'Visible on Homepage' : 'Hidden from Homepage'}
              </button>

              <button
                onClick={() => {
                  if (confirm(`Delete broadcast "${ann.title}"?`)) {
                    deleteAnnouncement(ann.id);
                  }
                }}
                className="p-2 text-gray-400 hover:text-red-600 transition"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* --- PUBLISH MODAL --- */}
      {showPublishModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-1">Publish to Homepage Feed</h3>
            <p className="text-xs text-gray-500 mb-4">Broadcast announcements, achievements, or curriculum launches</p>

            <form onSubmit={handlePublishSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-gray-700">Headline / Title</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. 50 Trainees Selected for Advanced AI Cohort"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full mt-1 p-2.5 border rounded-xl"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div>
                  <label className="font-semibold text-gray-700">Category</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value as any)}
                    className="w-full mt-1 p-2 border rounded-xl bg-white"
                  >
                    <option value="Announcement">Announcement</option>
                    <option value="Notification">Notification</option>
                    <option value="Achievement">Achievement</option>
                    <option value="New Learning Content">New Learning Content</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-gray-700">Priority Level</label>
                  <select
                    value={urgency}
                    onChange={e => setUrgency(e.target.value as any)}
                    className="w-full mt-1 p-2 border rounded-xl bg-white"
                  >
                    <option value="Normal">Normal</option>
                    <option value="Important">Important</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-gray-700">Target Role</label>
                  <select
                    value={targetRole}
                    onChange={e => setTargetRole(e.target.value as any)}
                    className="w-full mt-1 p-2 border rounded-xl bg-white"
                  >
                    <option value="ALL">Everyone</option>
                    <option value="TRAINEE">Trainees</option>
                    <option value="TRAINER">Trainers</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-gray-700">Broadcast Content & Details</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Write message visible to users on the homepage..."
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  className="w-full mt-1 p-2.5 border rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowPublishModal(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold"
                >
                  Broadcast Now
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
