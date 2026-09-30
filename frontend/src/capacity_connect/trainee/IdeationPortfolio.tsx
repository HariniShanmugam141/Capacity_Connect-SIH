import React, { useState } from 'react';
import { usePlatform } from '../PlatformContext';
import {
  Lightbulb, FolderGit2, Star, Heart, ExternalLink, GitBranch, Plus,
  Search, Bookmark, BookmarkCheck, Calendar, Clock, UserCheck,
  CheckCircle, MessageCircle, Sparkles, Filter, ChevronRight,
  TrendingUp, Layers, Check
} from 'lucide-react';
import { BrowseableTrainer } from '../store';
import { DreamCompanyTracker } from './DreamCompanyTracker';
import { Target } from 'lucide-react';

const GithubIcon: React.FC<{ size?: number; className?: string }> = ({ size = 20, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
    />
  </svg>
);

export const IdeationPortfolio: React.FC = () => {
  const {
    traineeProfile,
    addPortfolioItem,
    likePortfolioItem,
    allTrainers,
    addTrainerToWishlist,
    removeTrainerFromWishlist,
    allCourses,
    enrollInCourse,
    setDreamCompany,
    setDreamCompanies
  } = usePlatform();

  const [activeTab, setActiveTab] = useState<'portfolio' | 'trainer_wishlist'>('portfolio');

  // Add Portfolio Form State
  const [showAddModal, setShowAddModal] = useState(false);
  const [pfTitle, setPfTitle] = useState('');
  const [pfTagline, setPfTagline] = useState('');
  const [pfCategory, setPfCategory] = useState('AI Prototype');
  const [pfDesc, setPfDesc] = useState('');
  const [pfProblem, setPfProblem] = useState('');
  const [pfSolution, setPfSolution] = useState('');
  const [pfTechStack, setPfTechStack] = useState('Python, FastAPI, Docker');
  const [pfDemoUrl, setPfDemoUrl] = useState('');
  const [pfGithubUrl, setPfGithubUrl] = useState('');

  // Wishlist Trainer State
  const [trainerSearch, setTrainerSearch] = useState('');
  const [selectedDomainFilter, setSelectedDomainFilter] = useState('ALL');
  const [wishlistModalTrainer, setWishlistModalTrainer] = useState<BrowseableTrainer | null>(null);
  const [wishlistNote, setWishlistNote] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleCreatePortfolio = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pfTitle.trim()) return;

    addPortfolioItem({
      title: pfTitle.trim(),
      tagline: pfTagline.trim() || 'Innovative capacity prototype',
      category: pfCategory,
      description: pfDesc.trim(),
      problemStatement: pfProblem.trim(),
      solution: pfSolution.trim(),
      techStack: pfTechStack.split(',').map(s => s.trim()).filter(Boolean),
      liveDemoUrl: pfDemoUrl.trim() || undefined,
      githubUrl: pfGithubUrl.trim() || undefined,
      status: 'Published'
    });

    setShowAddModal(false);
    setPfTitle('');
    setPfTagline('');
    setPfDesc('');
    setPfProblem('');
    setPfSolution('');
    showToast('Ideation project published to your portfolio!');
  };

  const handleConfirmWishlist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wishlistModalTrainer) return;

    addTrainerToWishlist(wishlistModalTrainer, wishlistNote);
    showToast(`Added ${wishlistModalTrainer.name} to your Wishlist!`);
    setWishlistModalTrainer(null);
    setWishlistNote('');
  };

  // Filtered trainers for browsing
  const filteredTrainers = allTrainers.filter(trainer => {
    const matchesSearch =
      trainer.name.toLowerCase().includes(trainerSearch.toLowerCase()) ||
      trainer.domain.toLowerCase().includes(trainerSearch.toLowerCase()) ||
      trainer.skills.some(s => s.toLowerCase().includes(trainerSearch.toLowerCase()));

    const matchesDomain =
      selectedDomainFilter === 'ALL' || trainer.domain.toLowerCase().includes(selectedDomainFilter.toLowerCase());

    return matchesSearch && matchesDomain;
  });

  return (
    <div className="space-y-6 pb-16">
      {/* Toast notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-blue-600 text-white px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 text-xs font-semibold animate-fade-in border border-blue-500">
          <Sparkles size={14} className="text-yellow-300" />
          {toastMessage}
        </div>
      )}

      {/* Clean Minimal Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-4 sm:p-5 rounded-xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Lightbulb size={20} />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900 tracking-tight">Portfolio & Wishlist Hub</h1>
            <p className="text-xs text-slate-500">Track your target dream company, showcase projects, and manage trainer wishlists</p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('portfolio')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              activeTab === 'portfolio'
                ? 'bg-white text-slate-900 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FolderGit2 size={14} className={activeTab === 'portfolio' ? 'text-blue-600' : ''} />
            Portfolio ({traineeProfile.portfolio.length})
          </button>
          <button
            onClick={() => setActiveTab('trainer_wishlist')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              activeTab === 'trainer_wishlist'
                ? 'bg-white text-slate-900 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Bookmark size={14} className={activeTab === 'trainer_wishlist' ? 'text-amber-600' : ''} />
            Trainer Wishlist ({traineeProfile.wishlistTrainers.length})
          </button>
        </div>
      </div>

      {/* DREAM COMPANY TARGET & DSA PREPARATION HUB */}
      <DreamCompanyTracker
        currentDreamCompany={traineeProfile.dreamCompany}
        currentDreamCompanies={traineeProfile.dreamCompanies}
        onSelectCompany={setDreamCompany}
        onSelectCompanies={setDreamCompanies}
        allCourses={allCourses}
        enrolledCourseIds={traineeProfile.enrolledCourses.map(c => c.id)}
        onEnrollCourse={enrollInCourse}
      />

      {/* --- TAB 1: IDEATION -> PORTFOLIO --- */}
      {activeTab === 'portfolio' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Featured Projects & Innovations</h2>
              <p className="text-xs text-gray-500">Your engineered prototypes, case studies, and solution ideations</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm transition cursor-pointer"
            >
              <Plus size={16} /> Create New Ideation Project
            </button>
          </div>

          {traineeProfile.githubUsername && (
            <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md border border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                  <GithubIcon size={20} />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-bold">Synced with GitHub: @{traineeProfile.githubUsername}</p>
                  <p className="text-[11px] text-slate-300 font-medium">
                    {traineeProfile.githubProjects?.length || 0} public repositories accessible from your profile
                  </p>
                </div>
              </div>
              <a
                href={traineeProfile.githubUrl || `https://github.com/${traineeProfile.githubUsername}`}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-blue-300 hover:text-white font-bold flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-xl transition self-end sm:self-auto"
              >
                <span>GitHub Profile</span>
                <ExternalLink size={12} />
              </a>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {traineeProfile.portfolio.map(item => (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:border-indigo-200 transition space-y-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <span className="px-2.5 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-md text-[11px] font-bold">
                      {item.category}
                    </span>
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-full">
                      {item.status}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-gray-900 mt-2.5">{item.title}</h3>
                  <p className="text-xs text-gray-500 font-medium mt-0.5">{item.tagline}</p>

                  <div className="mt-4 p-3 bg-gray-50 rounded-xl space-y-2 border border-gray-100">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Problem Statement</span>
                      <p className="text-xs text-gray-700 mt-0.5">{item.problemStatement}</p>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Engineered Solution</span>
                      <p className="text-xs text-gray-700 mt-0.5">{item.solution}</p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block mb-1.5">
                      Tech Stack
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {item.techStack.map((tech, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-md text-[11px] font-medium">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 flex items-center justify-between mt-4">
                  <button
                    onClick={() => likePortfolioItem(item.id)}
                    className="flex items-center gap-1.5 text-xs text-rose-600 hover:text-rose-700 font-semibold px-2 py-1 rounded-lg hover:bg-rose-50 transition"
                  >
                    <Heart size={14} className="fill-rose-500 text-rose-500" />
                    <span>{item.likes} Endorsements</span>
                  </button>

                  <div className="flex items-center gap-2">
                    {item.githubUrl && (
                      <a
                        href={item.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
                        title="GitHub Repo"
                      >
                        <GitBranch size={16} />
                      </a>
                    )}
                    {item.liveDemoUrl && (
                      <a
                        href={item.liveDemoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 px-3 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-lg transition"
                      >
                        <ExternalLink size={13} /> Live Demo
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- TAB 2: IDEATION -> WISHLIST TRAINERS --- */}
      {activeTab === 'trainer_wishlist' && (
        <div className="space-y-6">
          {/* Section A: Current Wishlist */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <BookmarkCheck size={18} />
                </div>
                <div>
                  <h2 className="text-base font-bold text-gray-900">My Trainer Wishlist</h2>
                  <p className="text-xs text-gray-500">Trainers you have shortlisted for dedicated mentoring & capacity building</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-amber-50 text-amber-800 text-xs font-bold rounded-full border border-amber-100">
                {traineeProfile.wishlistTrainers.length} Wishlisted
              </span>
            </div>

            {traineeProfile.wishlistTrainers.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                <Bookmark size={28} className="text-gray-400 mx-auto mb-2" />
                <p className="text-sm font-semibold text-gray-600">Your wishlist is currently empty</p>
                <p className="text-xs text-gray-400 mt-1">Browse competent trainers below and add them to your personal mentorship wishlist.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {traineeProfile.wishlistTrainers.map(item => (
                  <div
                    key={item.trainerId}
                    className="p-4 rounded-xl border border-amber-100 bg-amber-50/20 hover:bg-white hover:border-amber-300 transition space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.avatar}
                          alt={item.trainerName}
                          className="w-12 h-12 rounded-xl object-cover ring-2 ring-amber-100"
                        />
                        <div>
                          <h4 className="font-bold text-sm text-gray-900">{item.trainerName}</h4>
                          <p className="text-xs text-gray-500">{item.title}</p>
                          <div className="flex items-center gap-2 text-xs text-amber-600 font-semibold mt-0.5">
                            <span className="flex items-center gap-1">
                              <Star size={12} className="fill-amber-400 text-amber-400" />
                              {item.rating}
                            </span>
                            <span>•</span>
                            <span className="text-gray-500">{item.availableHours}</span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => removeTrainerFromWishlist(item.trainerId)}
                        className="text-xs text-gray-400 hover:text-red-500 font-medium p-1"
                        title="Remove from wishlist"
                      >
                        Remove
                      </button>
                    </div>

                    <div className="p-2.5 bg-white rounded-lg border border-gray-100 text-xs text-gray-600 italic">
                      "{item.notes}"
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
                        Status: {item.mentorshipStatus}
                      </span>
                      <button
                        onClick={() => showToast(`1-on-1 mentorship session requested with ${item.trainerName}!`)}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition shadow-xs cursor-pointer"
                      >
                        Request Mentorship
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section B: Browse & Search Trainers by Competency */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-base text-gray-900">Explore & Discover Subject Trainers</h3>
                <p className="text-xs text-gray-500">Filter by domain, technology stack, and verified competency</p>
              </div>

              {/* Search & Domain Filter */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-2.5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search trainer or skill..."
                    value={trainerSearch}
                    onChange={e => setTrainerSearch(e.target.value)}
                    className="pl-8 pr-3 py-1.5 text-xs border rounded-xl bg-gray-50 focus:bg-white outline-none w-48 focus:w-60 transition-all"
                  />
                </div>

                <select
                  value={selectedDomainFilter}
                  onChange={e => setSelectedDomainFilter(e.target.value)}
                  className="px-3 py-1.5 text-xs border rounded-xl bg-gray-50 font-medium"
                >
                  <option value="ALL">All Domains</option>
                  <option value="Cloud">Cloud & SRE</option>
                  <option value="Intelligence">AI & Microservices</option>
                  <option value="Data">Big Data & Streaming</option>
                  <option value="Security">Cybersecurity & Zero Trust</option>
                  <option value="Full-Stack">Full-Stack & React</option>
                </select>
              </div>
            </div>

            {/* Trainer Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredTrainers.map(trainer => {
                const isAlreadyWishlisted = traineeProfile.wishlistTrainers.some(
                  t => t.trainerId === trainer.id
                );

                return (
                  <div
                    key={trainer.id}
                    className="p-5 rounded-2xl border border-gray-100 bg-white hover:border-indigo-200 transition shadow-xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start gap-3">
                        <img
                          src={trainer.avatar}
                          alt={trainer.name}
                          className="w-12 h-12 rounded-xl object-cover ring-2 ring-indigo-50"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-sm text-gray-900 truncate">{trainer.name}</h4>
                          <p className="text-xs text-indigo-600 font-medium truncate">{trainer.domain}</p>
                          <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                            <span className="flex items-center gap-1 font-bold text-amber-600">
                              <Star size={12} className="fill-amber-400 text-amber-400" />
                              {trainer.rating}
                            </span>
                            <span>•</span>
                            <span>{trainer.experienceYears}y exp</span>
                            <span>•</span>
                            <span>{trainer.availableHours}</span>
                          </div>
                        </div>
                      </div>

                      {/* Skills Tags */}
                      <div className="mt-4">
                        <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1">
                          Core Competencies
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {trainer.skills.slice(0, 4).map((sk, idx) => (
                            <span key={idx} className="px-2 py-0.5 bg-gray-50 text-gray-700 rounded text-[10px] font-semibold border border-gray-100">
                              {sk}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Certifications preview */}
                      <div className="mt-3">
                        <span className="text-[10px] text-gray-400 font-medium block">
                          Certified in: {trainer.certifications[0]}
                        </span>
                      </div>
                    </div>

                    <div className="mt-5 pt-3 border-t border-gray-100">
                      {isAlreadyWishlisted ? (
                        <div className="flex items-center justify-center gap-1.5 py-2 text-xs font-bold text-emerald-700 bg-emerald-50 rounded-xl border border-emerald-200">
                          <Check size={14} /> Wishlisted
                        </div>
                      ) : (
                        <button
                          onClick={() => setWishlistModalTrainer(trainer)}
                          className="w-full flex items-center justify-center gap-2 py-2 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition border border-indigo-200"
                        >
                          <Bookmark size={14} /> Add to Ideation Wishlist
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

      {/* --- MODAL: CREATE IDEATION PORTFOLIO --- */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-xl border border-gray-100 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-gray-900 mb-1">Create Ideation Portfolio Item</h3>
            <p className="text-xs text-gray-500 mb-4">Showcase your technical prototype or architectural concept</p>

            <form onSubmit={handleCreatePortfolio} className="space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-gray-700">Project / Ideation Title</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Distributed Consensus Ledger on Edge Devices"
                  value={pfTitle}
                  onChange={e => setPfTitle(e.target.value)}
                  className="w-full mt-1 p-2.5 border rounded-xl"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-gray-700">One-Line Tagline</label>
                  <input
                    type="text"
                    placeholder="e.g. Fault-tolerant consensus protocol"
                    value={pfTagline}
                    onChange={e => setPfTagline(e.target.value)}
                    className="w-full mt-1 p-2.5 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-semibold text-gray-700">Category</label>
                  <select
                    value={pfCategory}
                    onChange={e => setPfCategory(e.target.value)}
                    className="w-full mt-1 p-2.5 border rounded-xl bg-white"
                  >
                    <option value="AI Prototype">AI Prototype</option>
                    <option value="Cloud Arch">Cloud Arch</option>
                    <option value="Web App">Web App</option>
                    <option value="Cybersecurity">Cybersecurity</option>
                    <option value="Data Pipeline">Data Pipeline</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-gray-700">Problem Statement</label>
                <textarea
                  required
                  rows={2}
                  placeholder="What organizational or technical bottleneck is addressed?"
                  value={pfProblem}
                  onChange={e => setPfProblem(e.target.value)}
                  className="w-full mt-1 p-2.5 border rounded-xl"
                />
              </div>

              <div>
                <label className="font-semibold text-gray-700">Proposed Solution & Design</label>
                <textarea
                  required
                  rows={2}
                  placeholder="How does your architecture or prototype solve this?"
                  value={pfSolution}
                  onChange={e => setPfSolution(e.target.value)}
                  className="w-full mt-1 p-2.5 border rounded-xl"
                />
              </div>

              <div>
                <label className="font-semibold text-gray-700">Tech Stack (comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Go, Docker, Raft, Kubernetes, Prometheus"
                  value={pfTechStack}
                  onChange={e => setPfTechStack(e.target.value)}
                  className="w-full mt-1 p-2.5 border rounded-xl"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-gray-700">Live Demo URL (Optional)</label>
                  <input
                    type="url"
                    placeholder="https://demo.myapp.com"
                    value={pfDemoUrl}
                    onChange={e => setPfDemoUrl(e.target.value)}
                    className="w-full mt-1 p-2.5 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-semibold text-gray-700">GitHub Repository (Optional)</label>
                  <input
                    type="url"
                    placeholder="https://github.com/user/project"
                    value={pfGithubUrl}
                    onChange={e => setPfGithubUrl(e.target.value)}
                    className="w-full mt-1 p-2.5 border rounded-xl"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold cursor-pointer transition shadow-sm"
                >
                  Publish to Portfolio
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL: ADD TRAINER TO WISHLIST --- */}
      {wishlistModalTrainer && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-1">Add to Mentorship Wishlist</h3>
            <p className="text-xs text-gray-500 mb-4">
              Add <span className="font-bold text-gray-800">{wishlistModalTrainer.name}</span> to your personal capacity development list.
            </p>

            <form onSubmit={handleConfirmWishlist} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-gray-700">Notes / Learning Objective</label>
                <textarea
                  rows={3}
                  placeholder="Specify topics you want guidance on (e.g. Distributed system scaling, interview prep, capstone review)..."
                  value={wishlistNote}
                  onChange={e => setWishlistNote(e.target.value)}
                  className="w-full mt-1 p-2.5 border rounded-xl"
                />
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-100 text-[11px] text-amber-800 space-y-1">
                <p className="font-bold">Available Bandwidth: {wishlistModalTrainer.availableHours}</p>
                <p>Trainers will receive your request and can review your Ideation Portfolio.</p>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setWishlistModalTrainer(null)}
                  className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition shadow-xs cursor-pointer"
                >
                  Confirm Wishlist
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
