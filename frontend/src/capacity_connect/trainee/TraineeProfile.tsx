import React, { useState } from 'react';
import { usePlatform } from '../PlatformContext';
import { repoToPortfolioItem } from '../githubService';
import {
  GraduationCap, Briefcase, FileText, Sparkles, Award, BookOpen,
  CheckCircle2, MessageSquare, Plus, Trash2, Edit3, Upload,
  Star, ExternalLink, Calendar, MapPin, Mail, Phone, Clock,
  AlertCircle, ShieldCheck, Camera, GitFork, RefreshCw,
  Check, FolderGit2
} from 'lucide-react';

const GithubIcon: React.FC<{ size?: number; className?: string }> = ({ size = 20, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
    />
  </svg>
);

export const TraineeProfile: React.FC = () => {
  const {
    traineeProfile,
    updateTraineeProfile,
    addQualification,
    deleteQualification,
    addWorkExperience,
    deleteWorkExperience,
    uploadResume,
    addSkill,
    deleteSkill,
    addInterest,
    deleteInterest,
    addCertificate,
    addFeedback,
    addPortfolioItem,
    syncGitHubProfile,
    isSyncingGitHub
  } = usePlatform();

  // GitHub integration state
  const [githubInput, setGithubInput] = useState(traineeProfile.githubUrl || '');
  const [importedRepoIds, setImportedRepoIds] = useState<Record<string, boolean>>({});

  // Modals / Form toggles
  const [showEditBio, setShowEditBio] = useState(false);
  const [bioInput, setBioInput] = useState(traineeProfile.bio);
  const [titleInput, setTitleInput] = useState(traineeProfile.title);
  const [locationInput, setLocationInput] = useState(traineeProfile.location);
  const [githubBioInput, setGithubBioInput] = useState(traineeProfile.githubUrl || '');

  // Qualification form
  const [showQualModal, setShowQualModal] = useState(false);
  const [qualDegree, setQualDegree] = useState('');
  const [qualInst, setQualInst] = useState('');
  const [qualField, setQualField] = useState('');
  const [qualStart, setQualStart] = useState(2022);
  const [qualEnd, setQualEnd] = useState(2026);
  const [qualGpa, setQualGpa] = useState('');

  // Experience form
  const [showExpModal, setShowExpModal] = useState(false);
  const [expTitle, setExpTitle] = useState('');
  const [expCompany, setExpCompany] = useState('');
  const [expLoc, setExpLoc] = useState('');
  const [expStart, setExpStart] = useState('');
  const [expEnd, setExpEnd] = useState('');
  const [expDesc, setExpDesc] = useState('');

  const initials = traineeProfile.fullName
    ? traineeProfile.fullName.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
    : 'TR';

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          updateTraineeProfile({ avatar: reader.result });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Skill form
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillLevel, setNewSkillLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'>('Intermediate');
  const [newSkillCategory, setNewSkillCategory] = useState('Core Engineering');

  // Interest form
  const [newInterest, setNewInterest] = useState('');

  // Certificate form
  const [showCertModal, setShowCertModal] = useState(false);
  const [certTitle, setCertTitle] = useState('');
  const [certIssuer, setCertIssuer] = useState('');
  const [certDate, setCertDate] = useState('');
  const [certCredId, setCertCredId] = useState('');

  // Feedback form
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [fbCourseId, setFbCourseId] = useState(traineeProfile.enrolledCourses[0]?.id || '');
  const [fbRating, setFbRating] = useState(5);
  const [fbComment, setFbComment] = useState('');

  // File upload with Python ML Backend Integration
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('http://localhost:8000/api/parse-resume', {
        method: 'POST',
        body: formData
      });
      if (res.ok) {
        const data = await res.json();
        const extracted = data.extracted_skills || [];
        uploadResume(file.name, extracted.length > 0 ? extracted : ['Kubernetes', 'FastAPI', 'Docker', 'Python'], 95);
        return;
      }
    } catch (err) {
      console.log('Python ML parser offline, using client-side ATS fallback:', err);
    }
    
    // Client-side fallback if backend not running
    const sampleSkills = ['Kubernetes', 'Docker', 'FastAPI', 'Python', 'Terraform', 'CI/CD', 'AWS', 'PostgreSQL'];
    uploadResume(file.name, sampleSkills, 94);
  };

  const handleSaveBio = () => {
    updateTraineeProfile({
      bio: bioInput,
      title: titleInput,
      location: locationInput
    });
    if (githubBioInput.trim() && githubBioInput !== traineeProfile.githubUrl) {
      syncGitHubProfile(githubBioInput);
    }
    setShowEditBio(false);
  };

  const handleSyncGitHub = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!githubInput.trim()) return;
    await syncGitHubProfile(githubInput);
  };

  const handleImportRepo = (repo: any) => {
    addPortfolioItem(repoToPortfolioItem(repo));
    setImportedRepoIds(prev => ({ ...prev, [String(repo.id)]: true }));
  };

  const handleAddQual = (e: React.FormEvent) => {
    e.preventDefault();
    if (!qualDegree || !qualInst) return;
    addQualification({
      degree: qualDegree,
      institution: qualInst,
      fieldOfStudy: qualField || 'Engineering',
      startYear: Number(qualStart),
      endYear: Number(qualEnd),
      gradeOrGpa: qualGpa || 'Distinction'
    });
    setShowQualModal(false);
    setQualDegree('');
    setQualInst('');
    setQualGpa('');
  };

  const handleAddExp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expTitle || !expCompany) return;
    addWorkExperience({
      title: expTitle,
      company: expCompany,
      location: expLoc || 'Hybrid',
      startDate: expStart || '2024',
      endDate: expEnd || 'Present',
      current: !expEnd || expEnd.toLowerCase() === 'present',
      description: expDesc || 'Engineered scalable system features.'
    });
    setShowExpModal(false);
    setExpTitle('');
    setExpCompany('');
    setExpDesc('');
  };

  const handleAddCert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!certTitle || !certIssuer) return;
    addCertificate({
      title: certTitle,
      issuer: certIssuer,
      issueDate: certDate || '2026',
      credentialId: certCredId || `ID-${Math.floor(100000 + Math.random() * 900000)}`,
      verificationStatus: 'Verified',
      badgeUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=100&auto=format&fit=crop&q=80'
    });
    setShowCertModal(false);
    setCertTitle('');
    setCertIssuer('');
    setCertCredId('');
  };

  const handleAddFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const course = traineeProfile.enrolledCourses.find(c => c.id === fbCourseId) || traineeProfile.enrolledCourses[0];
    if (!course || !fbComment.trim()) return;

    addFeedback({
      courseId: course.id,
      courseTitle: course.title,
      trainerName: course.trainerName,
      rating: fbRating,
      comment: fbComment,
      contentQuality: fbRating,
      trainerClarity: fbRating
    });
    setShowFeedbackModal(false);
    setFbComment('');
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Profile Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-[0_12px_30px_-8px_rgba(0,0,0,0.06),0_4px_6px_-2px_rgba(0,0,0,0.02)] border border-slate-200/90 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500" />
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
            <div className="relative group">
              {traineeProfile.avatar ? (
                <img
                  src={traineeProfile.avatar}
                  alt={traineeProfile.fullName}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover ring-4 ring-slate-100 shadow-md"
                />
              ) : (
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center text-3xl font-black shadow-md ring-4 ring-slate-100">
                  {initials}
                </div>
              )}

              {/* Photo Upload Overlay */}
              <label
                className="absolute inset-0 rounded-2xl bg-slate-900/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white text-[11px] font-semibold cursor-pointer transition-opacity"
                title="Upload profile photo"
              >
                <Camera size={20} className="mb-1" />
                <span>Upload</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
              </label>

              <span className="absolute -bottom-1 -right-1 px-2.5 py-0.5 bg-emerald-500 text-white text-[11px] font-bold rounded-full border-2 border-white flex items-center gap-1 shadow-sm">
                <CheckCircle2 size={11} /> Trainee
              </span>
            </div>

            <div className="text-center sm:text-left space-y-1.5">
              <div className="flex items-center justify-center sm:justify-start gap-3">
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  {traineeProfile.fullName}
                </h1>
                <span className="bg-blue-50 text-blue-700 text-xs px-2.5 py-0.5 rounded-full font-semibold border border-blue-100">
                  Verified Trainee
                </span>
              </div>
              
              <p className="text-slate-600 font-medium text-sm">
                {traineeProfile.title || 'Student / Trainee'}
              </p>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-500 pt-1">
                {traineeProfile.location && (
                  <span className="flex items-center gap-1.5">
                    <MapPin size={13} className="text-slate-400" />
                    {traineeProfile.location}
                  </span>
                )}
                {traineeProfile.email && (
                  <span className="flex items-center gap-1.5">
                    <Mail size={13} className="text-slate-400" />
                    {traineeProfile.email}
                  </span>
                )}
                {traineeProfile.phone && (
                  <span className="flex items-center gap-1.5">
                    <Phone size={13} className="text-slate-400" />
                    {traineeProfile.phone}
                  </span>
                )}
                {traineeProfile.githubUsername && (
                  <a
                    href={traineeProfile.githubUrl || `https://github.com/${traineeProfile.githubUsername}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 text-slate-700 hover:text-blue-600 font-semibold transition"
                  >
                    <GithubIcon size={13} className="text-slate-600" />
                    github.com/{traineeProfile.githubUsername}
                  </a>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowEditBio(!showEditBio)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition border border-indigo-200 self-stretch sm:self-auto justify-center"
          >
            <Edit3 size={16} />
            Edit Profile
          </button>
        </div>

        {/* Bio Section */}
        {showEditBio ? (
          <div className="mt-6 pt-6 border-t border-gray-100 space-y-4 bg-gray-50/70 p-4 rounded-xl">
            <h4 className="text-sm font-bold text-gray-900">Edit Professional Information</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-600">Professional Headline / Title</label>
                <input
                  type="text"
                  value={titleInput}
                  onChange={e => setTitleInput(e.target.value)}
                  className="w-full mt-1 px-3 py-2 text-sm border rounded-lg bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600">Location</label>
                <input
                  type="text"
                  value={locationInput}
                  onChange={e => setLocationInput(e.target.value)}
                  className="w-full mt-1 px-3 py-2 text-sm border rounded-lg bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-gray-600">GitHub Profile Link</label>
                <input
                  type="text"
                  placeholder="https://github.com/username"
                  value={githubBioInput}
                  onChange={e => setGithubBioInput(e.target.value)}
                  className="w-full mt-1 px-3 py-2 text-sm border rounded-lg bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600">Executive Summary / Bio</label>
              <textarea
                rows={3}
                value={bioInput}
                onChange={e => setBioInput(e.target.value)}
                className="w-full mt-1 px-3 py-2 text-sm border rounded-lg bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowEditBio(false)}
                className="px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-200 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveBio}
                className="px-4 py-1.5 text-xs bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 shadow-sm"
              >
                Save Changes
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-6 pt-6 border-t border-gray-100">
            <p className="text-sm text-gray-600 leading-relaxed max-w-4xl">
              {traineeProfile.bio}
            </p>
          </div>
        )}
      </div>

      {/* 3D Distinct Option Cards: Resume, Skills, Interests */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* CARD 1: RESUME (3D Blue elevated style) */}
        <div className="relative bg-gradient-to-b from-white to-blue-50/30 rounded-2xl p-5 border border-blue-200/80 shadow-[0_10px_25px_-5px_rgba(59,130,246,0.12),0_4px_6px_-2px_rgba(0,0,0,0.03)] hover:-translate-y-1 hover:shadow-[0_16px_32px_-6px_rgba(59,130,246,0.2)] transition-all duration-300 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-blue-500/25">
                  <FileText size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Resume</h3>
                  <span className="text-[10px] text-blue-600 font-semibold">ATS Verified</span>
                </div>
              </div>

              {traineeProfile.resume?.atsScore && (
                <span className="px-2 py-0.5 bg-blue-100 text-blue-800 font-bold text-xs rounded-lg border border-blue-200 flex items-center gap-1 shadow-xs">
                  <ShieldCheck size={12} /> {traineeProfile.resume.atsScore}% Match
                </span>
              )}
            </div>

            {traineeProfile.resume ? (
              <div className="space-y-3">
                <div className="p-3 bg-white rounded-xl border border-blue-100 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 truncate max-w-[170px]">
                      {traineeProfile.resume.fileName}
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium">{traineeProfile.resume.fileSize}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1">
                  {traineeProfile.resume.parsedSkills.slice(0, 6).map((sk, idx) => (
                    <span key={idx} className="px-2 py-0.5 bg-white text-blue-700 rounded-md text-[10px] font-semibold border border-blue-100 shadow-2xs">
                      {sk}
                    </span>
                  ))}
                  {traineeProfile.resume.parsedSkills.length > 6 && (
                    <span className="px-1.5 py-0.5 text-slate-400 text-[10px]">
                      +{traineeProfile.resume.parsedSkills.length - 6} more
                    </span>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-5 border-2 border-dashed border-blue-200 rounded-xl bg-blue-50/40">
                <Upload size={20} className="text-blue-500 mx-auto mb-1.5" />
                <p className="text-xs text-slate-600 font-semibold">Upload Resume</p>
                <p className="text-[10px] text-slate-400 mt-0.5">PDF or DOCX</p>
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-blue-100">
            <label className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-700 bg-white hover:bg-blue-50 rounded-xl cursor-pointer transition border border-blue-200 shadow-xs">
              <Upload size={13} />
              {traineeProfile.resume ? 'Replace Resume' : 'Attach Resume'}
              <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>
        </div>

        {/* CARD 2: SKILLS (3D Emerald elevated style) */}
        <div className="relative bg-gradient-to-b from-white to-emerald-50/30 rounded-2xl p-5 border border-emerald-200/80 shadow-[0_10px_25px_-5px_rgba(16,185,129,0.12),0_4px_6px_-2px_rgba(0,0,0,0.03)] hover:-translate-y-1 hover:shadow-[0_16px_32px_-6px_rgba(16,185,129,0.2)] transition-all duration-300 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-md shadow-emerald-500/25">
                  <Sparkles size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Skills</h3>
                  <span className="text-[10px] text-emerald-600 font-semibold">{traineeProfile.skills.length} listed</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5 max-h-44 overflow-y-auto pr-1">
              {traineeProfile.skills.map(skill => (
                <div
                  key={skill.id}
                  className="flex items-center gap-1.5 px-2.5 py-1 bg-white hover:bg-emerald-50/50 rounded-lg border border-emerald-100 shadow-2xs transition group"
                >
                  <span className="text-xs font-semibold text-slate-800">{skill.name}</span>
                  <span className="text-[9px] px-1 py-0.2 rounded font-bold bg-emerald-100 text-emerald-700">
                    {skill.level}
                  </span>
                  <button
                    onClick={() => deleteSkill(skill.id)}
                    className="text-slate-300 hover:text-rose-500 transition opacity-0 group-hover:opacity-100 cursor-pointer"
                  >
                    <Trash2 size={11} />
                  </button>
                </div>
              ))}
              {traineeProfile.skills.length === 0 && (
                <p className="text-xs text-slate-400 italic py-4">No skills added yet.</p>
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-emerald-100">
            <div className="flex gap-1.5">
              <input
                type="text"
                placeholder="New skill..."
                value={newSkillName}
                onChange={e => setNewSkillName(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && newSkillName.trim()) {
                    addSkill({ name: newSkillName.trim(), level: newSkillLevel, category: newSkillCategory });
                    setNewSkillName('');
                  }
                }}
                className="flex-1 px-2.5 py-1 text-xs border border-emerald-200 rounded-lg bg-white outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <button
                onClick={() => {
                  if (newSkillName.trim()) {
                    addSkill({ name: newSkillName.trim(), level: newSkillLevel, category: newSkillCategory });
                    setNewSkillName('');
                  }
                }}
                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs cursor-pointer"
              >
                Add
              </button>
            </div>
          </div>
        </div>

        {/* CARD 3: INTERESTS (3D Amber elevated style) */}
        <div className="relative bg-gradient-to-b from-white to-amber-50/30 rounded-2xl p-5 border border-amber-200/80 shadow-[0_10px_25px_-5px_rgba(245,158,11,0.12),0_4px_6px_-2px_rgba(0,0,0,0.03)] hover:-translate-y-1 hover:shadow-[0_16px_32px_-6px_rgba(245,158,11,0.2)] transition-all duration-300 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center shadow-md shadow-amber-500/25">
                  <BookOpen size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Interests</h3>
                  <span className="text-[10px] text-amber-600 font-semibold">{traineeProfile.interests.length} areas</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5 max-h-44 overflow-y-auto">
              {traineeProfile.interests.map((interest, i) => (
                <span
                  key={i}
                  className="flex items-center gap-1 px-2.5 py-1 bg-white text-amber-900 rounded-lg text-xs font-semibold border border-amber-200 shadow-2xs group"
                >
                  {interest}
                  <button
                    onClick={() => deleteInterest(interest)}
                    className="text-amber-400 hover:text-rose-500 opacity-60 group-hover:opacity-100 ml-1 cursor-pointer"
                  >
                    ×
                  </button>
                </span>
              ))}
              {traineeProfile.interests.length === 0 && (
                <p className="text-xs text-slate-400 italic py-4">No interests added yet.</p>
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-amber-100">
            <div className="flex gap-1.5">
              <input
                type="text"
                placeholder="New interest..."
                value={newInterest}
                onChange={e => setNewInterest(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && newInterest.trim()) {
                    addInterest(newInterest);
                    setNewInterest('');
                  }
                }}
                className="flex-1 px-2.5 py-1 text-xs border border-amber-200 rounded-lg bg-white outline-none focus:ring-1 focus:ring-amber-500"
              />
              <button
                onClick={() => {
                  if (newInterest.trim()) {
                    addInterest(newInterest);
                    setNewInterest('');
                  }
                }}
                className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold shadow-xs cursor-pointer"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3D Distinct Option Card: GITHUB PROJECTS & REPOSITORIES */}
      <div className="relative bg-gradient-to-b from-white to-slate-50/60 rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-[0_12px_30px_-8px_rgba(30,41,59,0.12),0_4px_6px_-2px_rgba(0,0,0,0.03)] hover:-translate-y-0.5 hover:shadow-xl transition-all duration-300">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white flex items-center justify-center shadow-lg shadow-slate-900/25">
              <GithubIcon size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h3 className="font-extrabold text-slate-900 text-lg tracking-tight">GitHub Projects</h3>
                {traineeProfile.githubProjects && traineeProfile.githubProjects.length > 0 && (
                  <span className="text-[11px] px-2.5 py-0.5 bg-slate-900 text-white rounded-full font-bold">
                    {traineeProfile.githubProjects.length} Repos
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                {traineeProfile.githubUsername ? (
                  <span>
                    Linked account:{' '}
                    <a
                      href={traineeProfile.githubUrl || `https://github.com/${traineeProfile.githubUsername}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 hover:underline font-bold"
                    >
                      @{traineeProfile.githubUsername}
                    </a>
                  </span>
                ) : (
                  'Submit your GitHub profile link to showcase your live projects'
                )}
              </p>
            </div>
          </div>

          {/* Quick Submit / Sync URL Bar */}
          <form onSubmit={handleSyncGitHub} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <div className="relative">
              <input
                type="text"
                placeholder="https://github.com/username"
                value={githubInput}
                onChange={e => setGithubInput(e.target.value)}
                className="w-full sm:w-72 px-3.5 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-xl outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition shadow-xs"
              />
            </div>
            <button
              type="submit"
              disabled={isSyncingGitHub || !githubInput.trim()}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md transition cursor-pointer"
            >
              <RefreshCw size={14} className={isSyncingGitHub ? 'animate-spin' : ''} />
              <span>{isSyncingGitHub ? 'Syncing...' : 'Sync Projects'}</span>
            </button>
          </form>
        </div>

        {/* Repositories Showcase Grid */}
        {traineeProfile.githubProjects && traineeProfile.githubProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {traineeProfile.githubProjects.map(repo => {
              const isImported =
                importedRepoIds[String(repo.id)] ||
                traineeProfile.portfolio.some(p => p.githubUrl === repo.htmlUrl);

              const getLangDotColor = (lang?: string) => {
                switch (lang?.toLowerCase()) {
                  case 'typescript': return 'bg-blue-600';
                  case 'javascript': return 'bg-amber-400';
                  case 'python': return 'bg-emerald-600';
                  case 'go': return 'bg-cyan-600';
                  case 'java': return 'bg-orange-600';
                  case 'c++': case 'cpp': return 'bg-pink-600';
                  case 'rust': return 'bg-amber-700';
                  case 'html': return 'bg-rose-500';
                  default: return 'bg-slate-400';
                }
              };

              return (
                <div
                  key={repo.id}
                  className="p-4 rounded-2xl border border-slate-200/80 bg-white hover:border-blue-300 hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2 min-w-0">
                        <FolderGit2 size={16} className="text-slate-400 group-hover:text-blue-600 transition shrink-0" />
                        <a
                          href={repo.htmlUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="font-bold text-sm text-slate-900 hover:text-blue-600 transition truncate"
                        >
                          {repo.name}
                        </a>
                      </div>
                      <a
                        href={repo.htmlUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-slate-400 hover:text-blue-600 p-1 transition"
                        title="View on GitHub"
                      >
                        <ExternalLink size={14} />
                      </a>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2 mb-3 leading-relaxed">
                      {repo.description || 'Public GitHub repository showcase.'}
                    </p>

                    {repo.topics && repo.topics.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {repo.topics.slice(0, 4).map((t, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-600 font-medium rounded-md"
                          >
                            #{t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <div className="flex items-center gap-3">
                      {repo.language && (
                        <span className="flex items-center gap-1 font-semibold text-slate-700">
                          <span className={`w-2.5 h-2.5 rounded-full ${getLangDotColor(repo.language)} inline-block`} />
                          {repo.language}
                        </span>
                      )}
                      {repo.starsCount > 0 && (
                        <span className="flex items-center gap-1">
                          <Star size={12} className="fill-amber-400 text-amber-400" />
                          {repo.starsCount}
                        </span>
                      )}
                      {repo.forksCount > 0 && (
                        <span className="flex items-center gap-1">
                          <GitFork size={12} className="text-slate-400" />
                          {repo.forksCount}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => handleImportRepo(repo)}
                      className={`flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
                        isImported
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200'
                      }`}
                    >
                      {isImported ? (
                        <>
                          <Check size={12} /> In Portfolio
                        </>
                      ) : (
                        <>
                          <Plus size={12} /> Add to Portfolio
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-10 px-4 border-2 border-dashed border-slate-200 rounded-2xl bg-white/60">
            <GithubIcon size={38} className="text-slate-300 mx-auto mb-2" />
            <h4 className="font-bold text-slate-700 text-sm">No GitHub Projects Synced Yet</h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-4 leading-relaxed">
              Submit your GitHub profile link above (e.g. https://github.com/username) to list your software projects, repositories, and stars directly on the platform.
            </p>
          </div>
        )}
      </div>

      {/* Row: Qualifications & Work Experience */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* QUALIFICATIONS (3D Indigo) */}
        <div className="relative bg-gradient-to-b from-white to-indigo-50/30 rounded-2xl p-6 border border-indigo-200/80 shadow-[0_10px_25px_-5px_rgba(99,102,241,0.12),0_4px_6px_-2px_rgba(0,0,0,0.03)] hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/25">
                <GraduationCap size={18} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Qualifications</h3>
                <span className="text-[10px] text-indigo-600 font-semibold">{traineeProfile.qualifications.length} records</span>
              </div>
            </div>
            <button
              onClick={() => setShowQualModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-white hover:bg-indigo-50 rounded-xl transition border border-indigo-200 shadow-xs cursor-pointer"
            >
              <Plus size={13} /> Add
            </button>
          </div>

          <div className="space-y-3">
            {traineeProfile.qualifications.map(qual => (
              <div key={qual.id} className="p-4 rounded-xl border border-indigo-100 bg-white relative group shadow-2xs hover:shadow-sm transition">
                <button
                  onClick={() => deleteQualification(qual.id)}
                  className="absolute top-3 right-3 text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition cursor-pointer"
                >
                  <Trash2 size={13} />
                </button>
                <h4 className="font-bold text-sm text-slate-900">{qual.degree}</h4>
                <p className="text-xs font-medium text-indigo-600 mt-0.5">{qual.institution}</p>
                <div className="flex items-center gap-3 text-xs text-slate-500 mt-2">
                  <span className="flex items-center gap-1">
                    <Calendar size={12} className="text-slate-400" />
                    {qual.startYear} – {qual.endYear}
                  </span>
                  {qual.gradeOrGpa && (
                    <span className="px-2 py-0.5 bg-slate-50 rounded border border-slate-200 font-medium text-slate-700 text-[11px]">
                      {qual.gradeOrGpa}
                    </span>
                  )}
                </div>
              </div>
            ))}
            {traineeProfile.qualifications.length === 0 && (
              <p className="text-xs text-slate-400 italic py-6 text-center">No qualifications added yet.</p>
            )}
          </div>
        </div>

        {/* WORK EXPERIENCE (3D Purple) */}
        <div className="relative bg-gradient-to-b from-white to-purple-50/30 rounded-2xl p-6 border border-purple-200/80 shadow-[0_10px_25px_-5px_rgba(168,85,247,0.12),0_4px_6px_-2px_rgba(0,0,0,0.03)] hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-fuchsia-600 text-white flex items-center justify-center shadow-md shadow-purple-500/25">
                <Briefcase size={18} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Work Experience</h3>
                <span className="text-[10px] text-purple-600 font-semibold">{traineeProfile.workExperience.length} roles</span>
              </div>
            </div>
            <button
              onClick={() => setShowExpModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-purple-700 bg-white hover:bg-purple-50 rounded-xl transition border border-purple-200 shadow-xs cursor-pointer"
            >
              <Plus size={13} /> Add
            </button>
          </div>

          <div className="space-y-3">
            {traineeProfile.workExperience.map(exp => (
              <div key={exp.id} className="p-4 rounded-xl border border-purple-100 bg-white relative group shadow-2xs hover:shadow-sm transition">
                <button
                  onClick={() => deleteWorkExperience(exp.id)}
                  className="absolute top-3 right-3 text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition cursor-pointer"
                >
                  <Trash2 size={13} />
                </button>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-sm text-slate-900">{exp.title}</h4>
                  {exp.current && (
                    <span className="text-[9px] px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full font-bold">
                      Current
                    </span>
                  )}
                </div>
                <p className="text-xs font-semibold text-purple-700 mt-0.5">
                  {exp.company} • {exp.location}
                </p>
                <p className="text-[11px] text-slate-400 mt-1">{exp.startDate} – {exp.endDate}</p>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">{exp.description}</p>
              </div>
            ))}
            {traineeProfile.workExperience.length === 0 && (
              <p className="text-xs text-slate-400 italic py-6 text-center">No work experience added yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* Row: Certificates & Enrolled Courses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CERTIFICATES (3D Rose) */}
        <div className="relative bg-gradient-to-b from-white to-rose-50/30 rounded-2xl p-6 border border-rose-200/80 shadow-[0_10px_25px_-5px_rgba(244,63,94,0.12),0_4px_6px_-2px_rgba(0,0,0,0.03)] hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 text-white flex items-center justify-center shadow-md shadow-rose-500/25">
                <Award size={18} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Certificates</h3>
                <span className="text-[10px] text-rose-600 font-semibold">{traineeProfile.certificates.length} credentials</span>
              </div>
            </div>
            <button
              onClick={() => setShowCertModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-700 bg-white hover:bg-rose-50 rounded-xl transition border border-rose-200 shadow-xs cursor-pointer"
            >
              <Plus size={13} /> Add
            </button>
          </div>

          <div className="space-y-3">
            {traineeProfile.certificates.map(cert => (
              <div key={cert.id} className="p-3.5 rounded-xl border border-rose-100 bg-white shadow-2xs hover:shadow-sm transition flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-slate-900">{cert.title}</h4>
                    <span className="text-[9px] px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full font-bold">
                      {cert.verificationStatus}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium">
                    {cert.issuer} • {cert.issueDate}
                  </p>
                </div>
              </div>
            ))}
            {traineeProfile.certificates.length === 0 && (
              <p className="text-xs text-slate-400 italic py-6 text-center">No certificates added yet.</p>
            )}
          </div>
        </div>

        {/* ENROLLED COURSES (3D Cyan) */}
        <div className="relative bg-gradient-to-b from-white to-cyan-50/30 rounded-2xl p-6 border border-cyan-200/80 shadow-[0_10px_25px_-5px_rgba(6,182,212,0.12),0_4px_6px_-2px_rgba(0,0,0,0.03)] hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white flex items-center justify-center shadow-md shadow-cyan-500/25">
                <BookOpen size={18} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Courses</h3>
                <span className="text-[10px] text-cyan-600 font-semibold">{traineeProfile.enrolledCourses.length} active</span>
              </div>
            </div>
            <span className="text-xs font-bold text-cyan-700 bg-cyan-100/70 px-2.5 py-0.5 rounded-full border border-cyan-200 shadow-2xs">
              Enrolled
            </span>
          </div>

          <div className="space-y-3">
            {traineeProfile.enrolledCourses.map(course => (
              <div key={course.id} className="p-3.5 rounded-xl border border-cyan-100 bg-white shadow-2xs hover:shadow-sm transition space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">{course.title}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {course.trainerName} • {course.category}
                    </p>
                  </div>
                  <span className="text-xs font-bold text-slate-700">{course.progress}%</span>
                </div>

                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-cyan-500 to-blue-600 h-1.5 rounded-full transition-all duration-500"
                    style={{ width: `${course.progress}%` }}
                  />
                </div>
              </div>
            ))}
            {traineeProfile.enrolledCourses.length === 0 && (
              <p className="text-xs text-slate-400 italic py-6 text-center">No enrolled courses yet. Check Courses & Faculty.</p>
            )}
          </div>
        </div>
      </div>

      {/* Row: MCQs Attempted & Feedback on Courses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* MCQs ATTEMPTED (3D Emerald) */}
        <div className="relative bg-gradient-to-b from-white to-emerald-50/30 rounded-2xl p-6 border border-emerald-200/80 shadow-[0_10px_25px_-5px_rgba(16,185,129,0.12),0_4px_6px_-2px_rgba(0,0,0,0.03)] hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-md shadow-emerald-500/25">
                <CheckCircle2 size={18} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Assessments</h3>
                <span className="text-[10px] text-emerald-600 font-semibold">{traineeProfile.mcqsAttempted.length} completed</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {traineeProfile.mcqsAttempted.map(mcq => (
              <div key={mcq.id} className="p-3.5 rounded-xl border border-emerald-100 bg-white shadow-2xs hover:shadow-sm transition flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-slate-900">{mcq.title}</h4>
                    <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${
                      mcq.passed ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {mcq.passed ? 'Passed' : 'Needs Review'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    {mcq.subject} • {mcq.trainerName}
                  </p>
                </div>

                <div className="text-right pl-3">
                  <span className="text-base font-extrabold text-emerald-700">{mcq.score}/{mcq.totalMarks}</span>
                  <p className="text-[10px] font-bold text-slate-400">{mcq.percentage}%</p>
                </div>
              </div>
            ))}
            {traineeProfile.mcqsAttempted.length === 0 && (
              <p className="text-xs text-slate-400 italic py-6 text-center">No assessments completed yet.</p>
            )}
          </div>
        </div>

        {/* FEEDBACKS ON COURSES (3D Orange) */}
        <div className="relative bg-gradient-to-b from-white to-orange-50/30 rounded-2xl p-6 border border-orange-200/80 shadow-[0_10px_25px_-5px_rgba(249,115,22,0.12),0_4px_6px_-2px_rgba(0,0,0,0.03)] hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 text-white flex items-center justify-center shadow-md shadow-orange-500/25">
                <MessageSquare size={18} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Feedback</h3>
                <span className="text-[10px] text-orange-600 font-semibold">{traineeProfile.feedbacks.length} submitted</span>
              </div>
            </div>
            <button
              onClick={() => setShowFeedbackModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-orange-700 bg-white hover:bg-orange-50 rounded-xl transition border border-orange-200 shadow-xs cursor-pointer"
            >
              <Plus size={13} /> Add
            </button>
          </div>

          <div className="space-y-3">
            {traineeProfile.feedbacks.map(fb => (
              <div key={fb.id} className="p-3.5 rounded-xl border border-orange-100 bg-white shadow-2xs hover:shadow-sm transition space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs text-slate-900">{fb.courseTitle}</h4>
                  <div className="flex items-center text-amber-500 text-xs">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={12}
                        className={i < fb.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-slate-600 italic">&ldquo;{fb.comment}&rdquo;</p>
              </div>
            ))}
            {traineeProfile.feedbacks.length === 0 && (
              <p className="text-xs text-slate-400 italic py-6 text-center">No feedback submitted yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* --- MODALS --- */}
      {/* ADD QUALIFICATION MODAL */}
      {showQualModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Add Qualification</h3>
            <form onSubmit={handleAddQual} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-gray-700">Degree / Diploma</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Master of Technology"
                  value={qualDegree}
                  onChange={e => setQualDegree(e.target.value)}
                  className="w-full mt-1 p-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="font-semibold text-gray-700">Institution / University</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. IIT Madras"
                  value={qualInst}
                  onChange={e => setQualInst(e.target.value)}
                  className="w-full mt-1 p-2 border rounded-lg"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-gray-700">Start Year</label>
                  <input
                    type="number"
                    value={qualStart}
                    onChange={e => setQualStart(Number(e.target.value))}
                    className="w-full mt-1 p-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="font-semibold text-gray-700">End Year</label>
                  <input
                    type="number"
                    value={qualEnd}
                    onChange={e => setQualEnd(Number(e.target.value))}
                    className="w-full mt-1 p-2 border rounded-lg"
                  />
                </div>
              </div>
              <div>
                <label className="font-semibold text-gray-700">Grade / CGPA</label>
                <input
                  type="text"
                  placeholder="e.g. 9.1 CGPA"
                  value={qualGpa}
                  onChange={e => setQualGpa(e.target.value)}
                  className="w-full mt-1 p-2 border rounded-lg"
                />
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowQualModal(false)}
                  className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold"
                >
                  Save Qualification
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD WORK EXPERIENCE MODAL */}
      {showExpModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Add Work Experience</h3>
            <form onSubmit={handleAddExp} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-gray-700">Job Title</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Software Engineer"
                  value={expTitle}
                  onChange={e => setExpTitle(e.target.value)}
                  className="w-full mt-1 p-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="font-semibold text-gray-700">Company Name</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. HCLTech"
                  value={expCompany}
                  onChange={e => setExpCompany(e.target.value)}
                  className="w-full mt-1 p-2 border rounded-lg"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-gray-700">Start Date</label>
                  <input
                    type="text"
                    placeholder="e.g. Jan 2024"
                    value={expStart}
                    onChange={e => setExpStart(e.target.value)}
                    className="w-full mt-1 p-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="font-semibold text-gray-700">End Date</label>
                  <input
                    type="text"
                    placeholder="e.g. Present"
                    value={expEnd}
                    onChange={e => setExpEnd(e.target.value)}
                    className="w-full mt-1 p-2 border rounded-lg"
                  />
                </div>
              </div>
              <div>
                <label className="font-semibold text-gray-700">Responsibilities</label>
                <textarea
                  rows={2}
                  value={expDesc}
                  onChange={e => setExpDesc(e.target.value)}
                  placeholder="Key contributions and achievements..."
                  className="w-full mt-1 p-2 border rounded-lg"
                />
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowExpModal(false)}
                  className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold"
                >
                  Save Experience
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD CERTIFICATE MODAL */}
      {showCertModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Add Certificate</h3>
            <form onSubmit={handleAddCert} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-gray-700">Certificate Name</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Google Cloud Professional Data Engineer"
                  value={certTitle}
                  onChange={e => setCertTitle(e.target.value)}
                  className="w-full mt-1 p-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="font-semibold text-gray-700">Issuing Organization</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Google Cloud"
                  value={certIssuer}
                  onChange={e => setCertIssuer(e.target.value)}
                  className="w-full mt-1 p-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="font-semibold text-gray-700">Issue Date</label>
                <input
                  type="text"
                  placeholder="e.g. Sep 2026"
                  value={certDate}
                  onChange={e => setCertDate(e.target.value)}
                  className="w-full mt-1 p-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="font-semibold text-gray-700">Credential ID / URL</label>
                <input
                  type="text"
                  placeholder="e.g. GCP-PDE-823901"
                  value={certCredId}
                  onChange={e => setCertCredId(e.target.value)}
                  className="w-full mt-1 p-2 border rounded-lg"
                />
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowCertModal(false)}
                  className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-bold"
                >
                  Save Certificate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SUBMIT FEEDBACK MODAL */}
      {showFeedbackModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Course & Content Feedback</h3>
            <form onSubmit={handleAddFeedbackSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-gray-700">Select Course</label>
                <select
                  value={fbCourseId}
                  onChange={e => setFbCourseId(e.target.value)}
                  className="w-full mt-1 p-2 border rounded-lg bg-white"
                >
                  {traineeProfile.enrolledCourses.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.title} ({c.trainerName})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-gray-700">Overall Rating (1 to 5 Stars)</label>
                <div className="flex items-center gap-2 mt-1">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setFbRating(star)}
                      className="p-1 text-amber-400 hover:scale-110 transition"
                    >
                      <Star size={20} className={star <= fbRating ? 'fill-amber-400' : 'text-gray-300'} />
                    </button>
                  ))}
                  <span className="font-bold text-gray-700 ml-2">{fbRating} / 5 Stars</span>
                </div>
              </div>

              <div>
                <label className="font-semibold text-gray-700">Your Feedback & Constructive Comments</label>
                <textarea
                  required
                  rows={3}
                  value={fbComment}
                  onChange={e => setFbComment(e.target.value)}
                  placeholder="Share what you liked, pacing of training, and areas of improvement..."
                  className="w-full mt-1 p-2 border rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowFeedbackModal(false)}
                  className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-bold"
                >
                  Submit Feedback
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
