import React, { useState } from 'react';
import { usePlatform } from '../PlatformContext';
import {
  User, Award, BookOpen, Clock, Star, Users, CheckCircle2,
  Edit3, Plus, Trash2, ShieldCheck, Mail, Building
} from 'lucide-react';

export const TrainerProfile: React.FC = () => {
  const { trainerProfile, updateTrainerProfile } = usePlatform();

  const [isEditing, setIsEditing] = useState(false);
  const [bioInput, setBioInput] = useState(trainerProfile.bio);
  const [titleInput, setTitleInput] = useState(trainerProfile.title);
  const [orgInput, setOrgInput] = useState(trainerProfile.organization);
  const [hoursInput, setHoursInput] = useState(trainerProfile.hourlyCapacityHoursPerWeek);
  const [expInput, setExpInput] = useState(trainerProfile.yearsOfExperience);
  const [availabilityInput, setAvailabilityInput] = useState(trainerProfile.availability);

  // New competency tag
  const [newCompetency, setNewCompetency] = useState('');
  const [newCert, setNewCert] = useState('');

  const handleSaveProfile = () => {
    updateTrainerProfile({
      bio: bioInput,
      title: titleInput,
      organization: orgInput,
      hourlyCapacityHoursPerWeek: Number(hoursInput),
      yearsOfExperience: Number(expInput),
      availability: availabilityInput
    });
    setIsEditing(false);
  };

  const handleAddCompetency = () => {
    if (!newCompetency.trim() || trainerProfile.competencies.includes(newCompetency.trim())) return;
    updateTrainerProfile({
      competencies: [...trainerProfile.competencies, newCompetency.trim()]
    });
    setNewCompetency('');
  };

  const handleDeleteCompetency = (tag: string) => {
    updateTrainerProfile({
      competencies: trainerProfile.competencies.filter(c => c !== tag)
    });
  };

  const handleAddCert = () => {
    if (!newCert.trim() || trainerProfile.certifications.includes(newCert.trim())) return;
    updateTrainerProfile({
      certifications: [...trainerProfile.certifications, newCert.trim()]
    });
    setNewCert('');
  };

  const handleDeleteCert = (cert: string) => {
    updateTrainerProfile({
      certifications: trainerProfile.certifications.filter(c => c !== cert)
    });
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header Profile Card */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-[0_1px_3px_rgba(0,0,0,0.02)] border border-slate-200/80 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-600" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
            <div className="relative">
              <img
                src={trainerProfile.avatar}
                alt={trainerProfile.fullName}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover ring-4 ring-purple-50 shadow-md"
              />
              <span className="absolute -bottom-1 -right-1 px-2.5 py-0.5 bg-purple-600 text-white text-[11px] font-bold rounded-full border-2 border-white flex items-center gap-1 shadow-sm">
                <ShieldCheck size={11} /> Lead Trainer
              </span>
            </div>

            <div className="text-center sm:text-left space-y-1.5">
              <div className="flex items-center justify-center sm:justify-start gap-3">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                  {trainerProfile.fullName}
                </h1>
                <span className="bg-emerald-50 text-emerald-700 text-xs px-2.5 py-1 rounded-full font-semibold border border-emerald-100">
                  {trainerProfile.availability}
                </span>
              </div>

              <p className="text-gray-700 font-medium text-base">
                {trainerProfile.title}
              </p>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-gray-500 pt-1">
                <span className="flex items-center gap-1.5">
                  <Building size={14} className="text-gray-400" />
                  {trainerProfile.organization}
                </span>
                <span className="flex items-center gap-1.5">
                  <Mail size={14} className="text-gray-400" />
                  {trainerProfile.email}
                </span>
                <span className="flex items-center gap-1 text-amber-600 font-bold">
                  <Star size={14} className="fill-amber-400 text-amber-400" />
                  {trainerProfile.rating} / 5.0 Rating
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-purple-600 bg-purple-50 hover:bg-purple-100 rounded-xl transition border border-purple-200 self-stretch sm:self-auto justify-center"
          >
            <Edit3 size={16} />
            {isEditing ? 'Cancel Editing' : 'Manage Profile'}
          </button>
        </div>

        {/* Edit Form */}
        {isEditing ? (
          <div className="mt-6 pt-6 border-t border-gray-100 space-y-4 bg-gray-50/70 p-5 rounded-2xl">
            <h3 className="text-sm font-bold text-gray-900">Update Trainer Credentials & Bandwidth</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-600">Professional Title</label>
                <input
                  type="text"
                  value={titleInput}
                  onChange={e => setTitleInput(e.target.value)}
                  className="w-full mt-1 px-3 py-2 text-xs border rounded-lg bg-white outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600">Organization / Department</label>
                <input
                  type="text"
                  value={orgInput}
                  onChange={e => setOrgInput(e.target.value)}
                  className="w-full mt-1 px-3 py-2 text-xs border rounded-lg bg-white outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600">Years of Experience</label>
                <input
                  type="number"
                  value={expInput}
                  onChange={e => setExpInput(Number(e.target.value))}
                  className="w-full mt-1 px-3 py-2 text-xs border rounded-lg bg-white outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600">Weekly Mentorship Capacity (Hours/Week)</label>
                <input
                  type="number"
                  value={hoursInput}
                  onChange={e => setHoursInput(Number(e.target.value))}
                  className="w-full mt-1 px-3 py-2 text-xs border rounded-lg bg-white outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600">Current Availability Status</label>
                <select
                  value={availabilityInput}
                  onChange={e => setAvailabilityInput(e.target.value as any)}
                  className="w-full mt-1 px-3 py-2 text-xs border rounded-lg bg-white outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="Available">Available for Trainees</option>
                  <option value="Limited Slots">Limited Slots Only</option>
                  <option value="Unavailable">Temporarily Unavailable</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-600">Bio & Capacity Building Philosophy</label>
              <textarea
                rows={3}
                value={bioInput}
                onChange={e => setBioInput(e.target.value)}
                className="w-full mt-1 px-3 py-2 text-xs border rounded-lg bg-white outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsEditing(false)}
                className="px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-200 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProfile}
                className="px-4 py-1.5 text-xs bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 shadow-sm"
              >
                Save Profile Changes
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-6 pt-6 border-t border-gray-100">
            <p className="text-sm text-gray-600 leading-relaxed max-w-4xl">
              {trainerProfile.bio}
            </p>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <Users size={22} />
          </div>
          <div>
            <span className="text-2xl font-mono font-black text-slate-900">{trainerProfile.totalStudentsMentored}+</span>
            <p className="text-xs text-slate-500 font-medium">Trainees Mentored</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Clock size={22} />
          </div>
          <div>
            <span className="text-2xl font-mono font-black text-slate-900">{trainerProfile.hourlyCapacityHoursPerWeek} hrs</span>
            <p className="text-xs text-slate-500 font-medium">Weekly Capacity Allocated</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Award size={22} />
          </div>
          <div>
            <span className="text-2xl font-mono font-black text-slate-900">{trainerProfile.yearsOfExperience} Years</span>
            <p className="text-xs text-slate-500 font-medium">Industry & Training Experience</p>
          </div>
        </div>
      </div>

      {/* Competencies & Certifications Management */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* COMPETENCIES */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <BookOpen size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-base">Competency Areas</h3>
                  <span className="text-[11px] text-gray-400 font-medium">Mapped to subject curriculum</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {trainerProfile.competencies.map(comp => (
                <span
                  key={comp}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-800 rounded-xl text-xs font-semibold border border-indigo-100 group"
                >
                  {comp}
                  <button
                    onClick={() => handleDeleteCompetency(comp)}
                    className="text-indigo-400 hover:text-indigo-700 opacity-60 group-hover:opacity-100"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-100 flex gap-2">
            <input
              type="text"
              placeholder="Add competency (e.g. Distributed Consensus)..."
              value={newCompetency}
              onChange={e => setNewCompetency(e.target.value)}
              className="flex-1 px-3 py-2 text-xs border rounded-xl outline-none focus:border-indigo-500"
            />
            <button
              onClick={handleAddCompetency}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold"
            >
              Add
            </button>
          </div>
        </div>

        {/* CERTIFICATIONS */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                  <Award size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-base">Trainer Certifications</h3>
                  <span className="text-[11px] text-gray-400 font-medium">Verified credentials & accreditations</span>
                </div>
              </div>
            </div>

            <div className="space-y-2.5">
              {trainerProfile.certifications.map(cert => (
                <div
                  key={cert}
                  className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between group"
                >
                  <span className="text-xs font-bold text-gray-800 flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                    {cert}
                  </span>
                  <button
                    onClick={() => handleDeleteCert(cert)}
                    className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-100 flex gap-2">
            <input
              type="text"
              placeholder="Add certification (e.g. CKS, AWS Pro)..."
              value={newCert}
              onChange={e => setNewCert(e.target.value)}
              className="flex-1 px-3 py-2 text-xs border rounded-xl outline-none focus:border-purple-500"
            />
            <button
              onClick={handleAddCert}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold"
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
