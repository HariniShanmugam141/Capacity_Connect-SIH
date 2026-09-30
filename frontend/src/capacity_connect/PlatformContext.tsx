import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserRole,
  TraineeProfile,
  TrainerProfile,
  Questionnaire,
  TraineeParticipationRecord,
  TrainerLibraryItem,
  UserApprovalRecord,
  UserManagementRecord,
  HomepageAnnouncement,
  CompetencyMappingSubject,
  AdminAnalyticsMetrics,
  PortfolioItem,
  Qualification,
  WorkExperience,
  SkillItem,
  CertificateItem,
  CourseFeedback,
  MCQAttempt,
  PlatformCourse,
  StudentProfileSummary
} from './types';
import {
  INITIAL_TRAINEE_PROFILE,
  INITIAL_TRAINER_PROFILE,
  INITIAL_QUESTIONNAIRES,
  INITIAL_TRAINEE_PARTICIPATION,
  INITIAL_TRAINER_LIBRARY,
  INITIAL_USER_APPROVALS,
  INITIAL_USER_ROSTER,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_COMPETENCY_MAPPING,
  INITIAL_ADMIN_ANALYTICS,
  ALL_TRAINERS,
  ALL_COURSES,
  ALL_STUDENTS,
  BrowseableTrainer,
  createDefaultTraineeProfile,
  loadFromStorage,
  saveToStorage
} from './store';
import { fetchGitHubRepositories, repoToPortfolioItem, cleanGitHubUsername } from './githubService';

interface PlatformContextType {
  // Current Persona / Role
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  activeNavTab: string;
  setActiveNavTab: (tab: string) => void;
  initializeUserProfile: (user: {
    fullName: string;
    email: string;
    role: UserRole;
    studentData?: any;
  }) => void;

  // Trainee State & Operations
  traineeProfile: TraineeProfile;
  updateTraineeProfile: (data: Partial<TraineeProfile>) => void;
  addQualification: (q: Omit<Qualification, 'id'>) => void;
  deleteQualification: (id: string) => void;
  addWorkExperience: (w: Omit<WorkExperience, 'id'>) => void;
  deleteWorkExperience: (id: string) => void;
  uploadResume: (fileName: string, parsedSkills: string[], atsScore?: number) => void;
  addSkill: (skill: Omit<SkillItem, 'id'>) => void;
  deleteSkill: (id: string) => void;
  addInterest: (interest: string) => void;
  deleteInterest: (interest: string) => void;
  addCertificate: (cert: Omit<CertificateItem, 'id'>) => void;
  addFeedback: (fb: Omit<CourseFeedback, 'id' | 'feedbackDate'>) => void;
  addPortfolioItem: (item: Omit<PortfolioItem, 'id' | 'likes' | 'views' | 'createdDate'>) => void;
  likePortfolioItem: (id: string) => void;
  addTrainerToWishlist: (trainer: BrowseableTrainer, notes: string) => void;
  removeTrainerFromWishlist: (trainerId: string) => void;
  submitMCQAttempt: (attempt: Omit<MCQAttempt, 'id' | 'attemptDate'>) => void;
  syncGitHubProfile: (urlOrUsername: string) => Promise<void>;
  isSyncingGitHub: boolean;

  // Trainer State & Operations
  trainerProfile: TrainerProfile;
  updateTrainerProfile: (data: Partial<TrainerProfile>) => void;
  questionnaires: Questionnaire[];
  addQuestionnaire: (q: Omit<Questionnaire, 'id' | 'createdAt' | 'totalAttempts'>) => void;
  deleteQuestionnaire: (id: string) => void;
  traineeParticipation: TraineeParticipationRecord[];
  trainerLibrary: TrainerLibraryItem[];
  addLibraryItem: (item: Omit<TrainerLibraryItem, 'id' | 'uploadedAt' | 'downloadsCount'>) => void;
  deleteLibraryItem: (id: string) => void;

  // Admin State & Operations
  userApprovals: UserApprovalRecord[];
  approveUser: (id: string, notes?: string) => void;
  rejectUser: (id: string, notes?: string) => void;
  userRoster: UserManagementRecord[];
  updateUserRole: (id: string, role: UserRole) => void;
  updateUserStatus: (id: string, status: 'Active' | 'Pending Approval' | 'Suspended') => void;
  announcements: HomepageAnnouncement[];
  addAnnouncement: (ann: Omit<HomepageAnnouncement, 'id' | 'publishedDate'>) => void;
  toggleAnnouncement: (id: string) => void;
  deleteAnnouncement: (id: string) => void;
  competencySubjects: CompetencyMappingSubject[];
  assignTrainerToSubject: (subjectId: string, trainerId: string, trainerName: string) => void;
  adminAnalytics: AdminAnalyticsMetrics;

  // Global Data
  allTrainers: BrowseableTrainer[];
  allCourses: PlatformCourse[];
  allStudents: StudentProfileSummary[];
}

const PlatformContext = createContext<PlatformContextType | undefined>(undefined);

export const PlatformProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRoleState] = useState<UserRole>(() =>
    loadFromStorage<UserRole>('active_role', 'TRAINEE')
  );
  const [activeNavTab, setActiveNavTab] = useState<string>('profile');

  // Trainee profile state
  const [traineeProfile, setTraineeProfile] = useState<TraineeProfile>(() => {
    const loaded = loadFromStorage('trainee_profile', INITIAL_TRAINEE_PROFILE);
    if (loaded && loaded.avatar && loaded.avatar.includes('photo-1494790108377')) {
      loaded.avatar = '';
    }
    return loaded;
  });

  // Trainer profile state
  const [trainerProfile, setTrainerProfile] = useState<TrainerProfile>(() => {
    const loaded = loadFromStorage('trainer_profile', INITIAL_TRAINER_PROFILE);
    if (loaded && loaded.avatar && loaded.avatar.includes('photo-1507003211169')) {
      loaded.avatar = '';
    }
    return loaded;
  });

  const [isSyncingGitHub, setIsSyncingGitHub] = useState(false);

  const syncGitHubProfile = async (urlOrUsername: string) => {
    if (!urlOrUsername || !urlOrUsername.trim()) return;
    setIsSyncingGitHub(true);
    try {
      const username = cleanGitHubUsername(urlOrUsername);
      const gitResult = await fetchGitHubRepositories(username);
      const repos = gitResult.repositories;
      const cleanUrl = gitResult.profileUrl || (urlOrUsername.startsWith('http') ? urlOrUsername.trim() : `https://github.com/${username}`);
      const actualUsername = gitResult.username || username;

      setTraineeProfile(prev => {
        const existingPortfolioUrls = new Set(prev.portfolio.map(p => p.githubUrl));
        const newPortfolioItems: PortfolioItem[] = repos
          .filter(r => !existingPortfolioUrls.has(r.htmlUrl))
          .map(r => ({
            ...repoToPortfolioItem(r),
            id: `pf_git_${r.id}`,
            likes: r.starsCount || 1,
            views: 12,
            createdDate: new Date().toISOString().split('T')[0]
          }));

        const updated: TraineeProfile = {
          ...prev,
          githubUrl: cleanUrl,
          githubUsername: actualUsername,
          githubProjects: repos,
          portfolio: [...newPortfolioItems, ...prev.portfolio]
        };
        saveToStorage('trainee_profile', updated);
        return updated;
      });
    } catch (err) {
      console.error('Failed to sync GitHub profile:', err);
    } finally {
      setIsSyncingGitHub(false);
    }
  };

  const initializeUserProfile = (user: {
    fullName: string;
    email: string;
    role: UserRole;
    studentData?: any;
  }) => {
    setCurrentRoleState(user.role);
    saveToStorage('active_role', user.role);

    if (user.role === 'TRAINEE') {
      const fresh = createDefaultTraineeProfile(user.fullName, user.email, user.studentData);
      setTraineeProfile(fresh);
      saveToStorage('trainee_profile', fresh);
      setActiveNavTab('profile');
      if (user.studentData?.githubUrl) {
        setTimeout(() => {
          syncGitHubProfile(user.studentData.githubUrl);
        }, 150);
      }
    } else if (user.role === 'TRAINER') {
      const freshTrainer: TrainerProfile = {
        ...INITIAL_TRAINER_PROFILE,
        fullName: user.fullName,
        email: user.email,
        avatar: '',
      };
      setTrainerProfile(freshTrainer);
      saveToStorage('trainer_profile', freshTrainer);
      setActiveNavTab('dashboard');
    } else {
      setActiveNavTab('overview');
    }
  };

  // Questionnaires
  const [questionnaires, setQuestionnaires] = useState<Questionnaire[]>(() =>
    loadFromStorage('questionnaires', INITIAL_QUESTIONNAIRES)
  );

  // Trainee Participation Records
  const [traineeParticipation, setTraineeParticipation] = useState<TraineeParticipationRecord[]>(() =>
    loadFromStorage('trainee_participation', INITIAL_TRAINEE_PARTICIPATION)
  );

  // Trainer Library
  const [trainerLibrary, setTrainerLibrary] = useState<TrainerLibraryItem[]>(() =>
    loadFromStorage('trainer_library', INITIAL_TRAINER_LIBRARY)
  );

  // Admin Approvals
  const [userApprovals, setUserApprovals] = useState<UserApprovalRecord[]>(() =>
    loadFromStorage('user_approvals', INITIAL_USER_APPROVALS)
  );

  // Admin User Roster
  const [userRoster, setUserRoster] = useState<UserManagementRecord[]>(() =>
    loadFromStorage('user_roster', INITIAL_USER_ROSTER)
  );

  // Announcements
  const [announcements, setAnnouncements] = useState<HomepageAnnouncement[]>(() =>
    loadFromStorage('announcements', INITIAL_ANNOUNCEMENTS)
  );

  // Competency Mapping
  const [competencySubjects, setCompetencySubjects] = useState<CompetencyMappingSubject[]>(() =>
    loadFromStorage('competency_mapping', INITIAL_COMPETENCY_MAPPING)
  );

  // Admin Analytics
  const [adminAnalytics, setAdminAnalytics] = useState<AdminAnalyticsMetrics>(() =>
    loadFromStorage('admin_analytics', INITIAL_ADMIN_ANALYTICS)
  );

  // Role Switcher with default tab setting
  const setCurrentRole = (role: UserRole) => {
    setCurrentRoleState(role);
    saveToStorage('active_role', role);
    if (role === 'TRAINEE') setActiveNavTab('profile');
    else if (role === 'TRAINER') setActiveNavTab('trainer_profile');
    else if (role === 'ADMIN') setActiveNavTab('admin_dashboard');
  };

  // Sync to local storage
  useEffect(() => {
    saveToStorage('trainee_profile', traineeProfile);
  }, [traineeProfile]);

  useEffect(() => {
    saveToStorage('trainer_profile', trainerProfile);
  }, [trainerProfile]);

  useEffect(() => {
    saveToStorage('questionnaires', questionnaires);
  }, [questionnaires]);

  useEffect(() => {
    saveToStorage('trainee_participation', traineeParticipation);
  }, [traineeParticipation]);

  useEffect(() => {
    saveToStorage('trainer_library', trainerLibrary);
  }, [trainerLibrary]);

  useEffect(() => {
    saveToStorage('user_approvals', userApprovals);
  }, [userApprovals]);

  useEffect(() => {
    saveToStorage('user_roster', userRoster);
  }, [userRoster]);

  useEffect(() => {
    saveToStorage('announcements', announcements);
  }, [announcements]);

  useEffect(() => {
    saveToStorage('competency_mapping', competencySubjects);
  }, [competencySubjects]);

  // --- TRAINEE ACTIONS ---
  const updateTraineeProfile = (data: Partial<TraineeProfile>) => {
    setTraineeProfile(prev => ({ ...prev, ...data }));
  };

  const addQualification = (q: Omit<Qualification, 'id'>) => {
    const newQ: Qualification = { ...q, id: 'q_' + Date.now() };
    setTraineeProfile(prev => ({
      ...prev,
      qualifications: [newQ, ...prev.qualifications]
    }));
  };

  const deleteQualification = (id: string) => {
    setTraineeProfile(prev => ({
      ...prev,
      qualifications: prev.qualifications.filter(q => q.id !== id)
    }));
  };

  const addWorkExperience = (w: Omit<WorkExperience, 'id'>) => {
    const newW: WorkExperience = { ...w, id: 'w_' + Date.now() };
    setTraineeProfile(prev => ({
      ...prev,
      workExperience: [newW, ...prev.workExperience]
    }));
  };

  const deleteWorkExperience = (id: string) => {
    setTraineeProfile(prev => ({
      ...prev,
      workExperience: prev.workExperience.filter(w => w.id !== id)
    }));
  };

  const uploadResume = (fileName: string, parsedSkills: string[], atsScore = 88) => {
    setTraineeProfile(prev => ({
      ...prev,
      resume: {
        fileName,
        fileSize: '1.2 MB',
        uploadDate: new Date().toISOString().split('T')[0],
        fileUrl: '#',
        atsScore,
        summary: `Parsed resume profile matching ${parsedSkills.length} core competencies.`,
        parsedSkills
      }
    }));
  };

  const addSkill = (skill: Omit<SkillItem, 'id'>) => {
    const newS: SkillItem = { ...skill, id: 's_' + Date.now() };
    setTraineeProfile(prev => ({
      ...prev,
      skills: [...prev.skills, newS]
    }));
  };

  const deleteSkill = (id: string) => {
    setTraineeProfile(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s.id !== id)
    }));
  };

  const addInterest = (interest: string) => {
    if (!interest.trim() || traineeProfile.interests.includes(interest.trim())) return;
    setTraineeProfile(prev => ({
      ...prev,
      interests: [...prev.interests, interest.trim()]
    }));
  };

  const deleteInterest = (interest: string) => {
    setTraineeProfile(prev => ({
      ...prev,
      interests: prev.interests.filter(i => i !== interest)
    }));
  };

  const addCertificate = (cert: Omit<CertificateItem, 'id'>) => {
    const newCert: CertificateItem = { ...cert, id: 'c_' + Date.now() };
    setTraineeProfile(prev => ({
      ...prev,
      certificates: [newCert, ...prev.certificates]
    }));
    // also increment admin metrics
    setAdminAnalytics(prev => ({
      ...prev,
      certificationsIssued: prev.certificationsIssued + 1
    }));
  };

  const addFeedback = (fb: Omit<CourseFeedback, 'id' | 'feedbackDate'>) => {
    const newFb: CourseFeedback = {
      ...fb,
      id: 'fb_' + Date.now(),
      feedbackDate: new Date().toISOString().split('T')[0]
    };
    setTraineeProfile(prev => ({
      ...prev,
      feedbacks: [newFb, ...prev.feedbacks]
    }));
  };

  const addPortfolioItem = (item: Omit<PortfolioItem, 'id' | 'likes' | 'views' | 'createdDate'>) => {
    const newItem: PortfolioItem = {
      ...item,
      id: 'pf_' + Date.now(),
      likes: 1,
      views: 12,
      createdDate: new Date().toISOString().split('T')[0]
    };
    setTraineeProfile(prev => ({
      ...prev,
      portfolio: [newItem, ...prev.portfolio]
    }));
  };

  const likePortfolioItem = (id: string) => {
    setTraineeProfile(prev => ({
      ...prev,
      portfolio: prev.portfolio.map(item =>
        item.id === id ? { ...item, likes: item.likes + 1 } : item
      )
    }));
  };

  const addTrainerToWishlist = (trainer: BrowseableTrainer, notes: string) => {
    const exists = traineeProfile.wishlistTrainers.some(t => t.trainerId === trainer.id);
    if (exists) return;

    const wishItem = {
      trainerId: trainer.id,
      trainerName: trainer.name,
      title: trainer.title,
      avatar: trainer.avatar,
      domain: trainer.domain,
      rating: trainer.rating,
      availableHours: trainer.availableHours,
      addedDate: new Date().toISOString().split('T')[0],
      notes: notes || 'Interested in domain guidance and mentorship.',
      mentorshipStatus: 'Wishlisted' as const
    };

    setTraineeProfile(prev => ({
      ...prev,
      wishlistTrainers: [wishItem, ...prev.wishlistTrainers]
    }));
  };

  const removeTrainerFromWishlist = (trainerId: string) => {
    setTraineeProfile(prev => ({
      ...prev,
      wishlistTrainers: prev.wishlistTrainers.filter(t => t.trainerId !== trainerId)
    }));
  };

  const submitMCQAttempt = (attempt: Omit<MCQAttempt, 'id' | 'attemptDate'>) => {
    const newAttempt: MCQAttempt = {
      ...attempt,
      id: 'att_' + Date.now(),
      attemptDate: new Date().toISOString().split('T')[0]
    };

    // Update trainee record
    setTraineeProfile(prev => ({
      ...prev,
      mcqsAttempted: [newAttempt, ...prev.mcqsAttempted]
    }));

    // Update trainer participation record
    const partRecord: TraineeParticipationRecord = {
      id: 'part_' + Date.now(),
      questionnaireId: attempt.questionnaireId,
      questionnaireTitle: attempt.title,
      traineeId: traineeProfile.id,
      traineeName: traineeProfile.fullName,
      traineeAvatar: traineeProfile.avatar,
      submittedAt: new Date().toLocaleString(),
      score: attempt.score,
      totalMarks: attempt.totalMarks,
      percentage: attempt.percentage,
      passed: attempt.passed,
      status: 'Completed',
      timeSpentMinutes: attempt.timeSpentMinutes
    };

    setTraineeParticipation(prev => [partRecord, ...prev]);

    // Increment admin metrics
    setAdminAnalytics(prev => ({
      ...prev,
      assessmentsCompleted: prev.assessmentsCompleted + 1
    }));
  };

  // --- TRAINER ACTIONS ---
  const updateTrainerProfile = (data: Partial<TrainerProfile>) => {
    setTrainerProfile(prev => ({ ...prev, ...data }));
  };

  const addQuestionnaire = (q: Omit<Questionnaire, 'id' | 'createdAt' | 'totalAttempts'>) => {
    const newQ: Questionnaire = {
      ...q,
      id: 'qnr_' + Date.now(),
      createdAt: new Date().toISOString().split('T')[0],
      totalAttempts: 0
    };
    setQuestionnaires(prev => [newQ, ...prev]);
  };

  const deleteQuestionnaire = (id: string) => {
    setQuestionnaires(prev => prev.filter(q => q.id !== id));
  };

  const addLibraryItem = (item: Omit<TrainerLibraryItem, 'id' | 'uploadedAt' | 'downloadsCount'>) => {
    const newItem: TrainerLibraryItem = {
      ...item,
      id: 'lib_' + Date.now(),
      uploadedAt: new Date().toISOString().split('T')[0],
      downloadsCount: 0
    };
    setTrainerLibrary(prev => [newItem, ...prev]);
  };

  const deleteLibraryItem = (id: string) => {
    setTrainerLibrary(prev => prev.filter(i => i.id !== id));
  };

  // --- ADMIN ACTIONS ---
  const approveUser = (id: string, notes?: string) => {
    setUserApprovals(prev =>
      prev.map(appr =>
        appr.id === id ? { ...appr, status: 'Approved', approvalNotes: notes || 'Approved by Administrator.' } : appr
      )
    );
    // add to roster
    const target = userApprovals.find(a => a.id === id);
    if (target) {
      const newMember: UserManagementRecord = {
        id: 'usr_' + Date.now(),
        fullName: target.fullName,
        email: target.email,
        role: target.requestedRole,
        status: 'Active',
        joinDate: new Date().toISOString().split('T')[0],
        department: target.domain,
        completionScore: target.requestedRole === 'TRAINER' ? 95 : 75
      };
      setUserRoster(prev => [newMember, ...prev]);
    }
  };

  const rejectUser = (id: string, notes?: string) => {
    setUserApprovals(prev =>
      prev.map(appr =>
        appr.id === id ? { ...appr, status: 'Rejected', approvalNotes: notes || 'Application rejected.' } : appr
      )
    );
  };

  const updateUserRole = (id: string, newRole: UserRole) => {
    setUserRoster(prev =>
      prev.map(usr => (usr.id === id ? { ...usr, role: newRole } : usr))
    );
  };

  const updateUserStatus = (id: string, newStatus: 'Active' | 'Pending Approval' | 'Suspended') => {
    setUserRoster(prev =>
      prev.map(usr => (usr.id === id ? { ...usr, status: newStatus } : usr))
    );
  };

  const addAnnouncement = (ann: Omit<HomepageAnnouncement, 'id' | 'publishedDate'>) => {
    const newAnn: HomepageAnnouncement = {
      ...ann,
      id: 'ann_' + Date.now(),
      publishedDate: new Date().toISOString().split('T')[0]
    };
    setAnnouncements(prev => [newAnn, ...prev]);
  };

  const toggleAnnouncement = (id: string) => {
    setAnnouncements(prev =>
      prev.map(ann => (ann.id === id ? { ...ann, active: !ann.active } : ann))
    );
  };

  const deleteAnnouncement = (id: string) => {
    setAnnouncements(prev => prev.filter(ann => ann.id !== id));
  };

  const assignTrainerToSubject = (subjectId: string, trainerId: string, trainerName: string) => {
    setCompetencySubjects(prev =>
      prev.map(sub => {
        if (sub.id !== subjectId) return sub;
        return {
          ...sub,
          assignedTrainerId: trainerId,
          assignedTrainerName: trainerName,
          suitableTrainers: sub.suitableTrainers.map(t =>
            t.trainerId === trainerId ? { ...t, status: 'Assigned' } : { ...t, status: 'Available' }
          )
        };
      })
    );
  };

  return (
    <PlatformContext.Provider
      value={{
        currentRole,
        setCurrentRole,
        activeNavTab,
        setActiveNavTab,
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
        likePortfolioItem,
        addTrainerToWishlist,
        removeTrainerFromWishlist,
        submitMCQAttempt,
        syncGitHubProfile,
        isSyncingGitHub,
        trainerProfile,
        updateTrainerProfile,
        questionnaires,
        addQuestionnaire,
        deleteQuestionnaire,
        traineeParticipation,
        trainerLibrary,
        addLibraryItem,
        deleteLibraryItem,
        userApprovals,
        approveUser,
        rejectUser,
        userRoster,
        updateUserRole,
        updateUserStatus,
        announcements,
        addAnnouncement,
        toggleAnnouncement,
        deleteAnnouncement,
        competencySubjects,
        assignTrainerToSubject,
        adminAnalytics,
        allTrainers: ALL_TRAINERS,
        allCourses: ALL_COURSES,
        allStudents: ALL_STUDENTS,
        initializeUserProfile
      }}
    >
      {children}
    </PlatformContext.Provider>
  );
};

export const usePlatform = () => {
  const context = useContext(PlatformContext);
  if (!context) {
    throw new Error('usePlatform must be used within a PlatformProvider');
  }
  return context;
};
