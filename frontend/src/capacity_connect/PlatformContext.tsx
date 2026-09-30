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
  StudentProfileSummary,
  CourseRoadmapStep,
  EnrolledCourse
} from './types';
import { rtdb, ref, set } from '../firebase';
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
  enrollInCourse: (course: PlatformCourse) => void;
  setDreamCompany: (company: string) => void;
  setDreamCompanies: (companies: string[]) => void;

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
  adminProfile: { fullName: string; email: string; avatar: string };
  updateAdminProfile: (data: Partial<{ fullName: string; email: string; avatar: string }>) => void;
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

  // Global Data & Course Approval
  allTrainers: BrowseableTrainer[];
  allCourses: PlatformCourse[];
  allStudents: StudentProfileSummary[];
  approveCourseCertificate: (studentNameOrId: string, courseId: string, trainerName: string) => void;
}

const generateDefaultRoadmap = (courseTitle: string, courseId: string, progress: number = 20): CourseRoadmapStep[] => {
  return [
    {
      id: `${courseId}_step_1`,
      stepNumber: 1,
      phase: 'Phase 1',
      title: 'Foundations & Architecture Baseline',
      description: `Core tooling, syntax prerequisites, and development environment setup for ${courseTitle}.`,
      status: progress >= 20 ? 'Completed' : 'In Progress',
      keyTopics: ['Environment Setup', 'Prerequisites Check', 'CLI Tools & SDKs'],
      estimatedHours: 8
    },
    {
      id: `${courseId}_step_2`,
      stepNumber: 2,
      phase: 'Phase 2',
      title: 'Core Concepts & Hands-on Guided Labs',
      description: `In-depth implementation sessions, fundamental modules, and trainer-led design patterns.`,
      status: progress >= 50 ? 'Completed' : progress >= 20 ? 'In Progress' : 'Upcoming',
      keyTopics: ['Core Architecture', 'Design Patterns', 'Lab Worksheets'],
      estimatedHours: 14
    },
    {
      id: `${courseId}_step_3`,
      stepNumber: 3,
      phase: 'Phase 3',
      title: 'Advanced Optimization & Production Patterns',
      description: `Handling high throughput, concurrency, security audits, and latency tuning.`,
      status: progress >= 75 ? 'Completed' : progress >= 50 ? 'In Progress' : 'Upcoming',
      keyTopics: ['Performance Tuning', 'Zero-Downtime Deployments', 'Resilience Testing'],
      estimatedHours: 16
    },
    {
      id: `${courseId}_step_4`,
      stepNumber: 4,
      phase: 'Phase 4',
      title: 'Industry Capstone Implementation',
      description: `Building a real-world enterprise project with peer code reviews and trainer guidance.`,
      status: progress >= 90 ? 'Completed' : progress >= 75 ? 'In Progress' : 'Upcoming',
      keyTopics: ['Capstone Project', 'Git Workflows', 'CI/CD Pipeline'],
      estimatedHours: 20
    },
    {
      id: `${courseId}_step_5`,
      stepNumber: 5,
      phase: 'Phase 5',
      title: 'Final Assessment & Enterprise Certification',
      description: `Comprehensive timed assessment, MCQ evaluations, and competency verification.`,
      status: progress >= 100 ? 'Completed' : progress >= 90 ? 'In Progress' : 'Upcoming',
      keyTopics: ['Final Evaluation', 'Portfolio Showcase', 'Certificate Issuance'],
      estimatedHours: 6
    }
  ];
};

const PlatformContext = createContext<PlatformContextType | undefined>(undefined);

export const PlatformProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRoleState] = useState<UserRole>(() =>
    loadFromStorage<UserRole>('active_role', 'TRAINEE')
  );
  const [activeNavTab, setActiveNavTab] = useState<string>('profile');

  // Trainee profile state
  const [traineeProfile, setTraineeProfile] = useState<TraineeProfile>(() => {
    const loaded = loadFromStorage<TraineeProfile>('trainee_profile', INITIAL_TRAINEE_PROFILE);
    if (loaded) {
      if (!loaded.enrolledCourses || loaded.enrolledCourses.length === 0) {
        loaded.enrolledCourses = INITIAL_TRAINEE_PROFILE.enrolledCourses;
      }
      if (loaded.avatar && loaded.avatar.includes('photo-1494790108377')) {
        loaded.avatar = '';
      }
      if (loaded.enrolledCourses) {
        loaded.enrolledCourses = loaded.enrolledCourses.map((c: any) => ({
          ...c,
          roadmap: c.roadmap || generateDefaultRoadmap(c.title, c.id, c.progress || 20)
        }));
      }
    }
    return loaded;
  });

  // Trainer profile state
  const [trainerProfile, setTrainerProfile] = useState<TrainerProfile>(() => {
    const loaded = loadFromStorage('trainer_profile', INITIAL_TRAINER_PROFILE);
    if (loaded && loaded.avatar && loaded.avatar.includes('photo-1507003211169')) {
      loaded.avatar = '/default-avatar.png';
    }
    return loaded;
  });

  // Admin profile state
  const [adminProfile, setAdminProfile] = useState<{ fullName: string; email: string; avatar: string }>(() => {
    return loadFromStorage('admin_profile', {
      fullName: 'Platform Admin',
      email: 'admin.siva@capacityconnect.org',
      avatar: '/default-avatar.png'
    });
  });

  const updateAdminProfile = (data: Partial<{ fullName: string; email: string; avatar: string }>) => {
    setAdminProfile(prev => {
      const updated = { ...prev, ...data };
      saveToStorage('admin_profile', updated);
      try {
        if (updated.email) {
          const emailKey = updated.email.toLowerCase().replace(/[^a-z0-9]/g, '_');
          set(ref(rtdb, `users/admin/${emailKey}`), updated);
          set(ref(rtdb, `users/${emailKey}`), updated);
        }
      } catch (e) {}
      return updated;
    });
  };

  // Trainees roster state (updated on trainer certificate approvals)
  const [allStudents, setAllStudents] = useState<StudentProfileSummary[]>(() => {
    const loaded = loadFromStorage<StudentProfileSummary[]>('all_students', ALL_STUDENTS);
    return (loaded || []).filter(
      s => !s.id.startsWith('trn_10') &&
           !['bhavya.shree@capacityconnect.org', 'karthik.n@capacityconnect.org', 'ananya.d@capacityconnect.org', 'rohan.m@capacityconnect.org', 'meera.nambiar@techuniv.edu'].includes(s.email?.toLowerCase())
    );
  });

  useEffect(() => {
    saveToStorage('all_students', allStudents);
  }, [allStudents]);

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
      const stored = loadFromStorage<TraineeProfile | null>('trainee_profile', null);
      const existingEnrolled = (user.studentData?.enrolledCourses && user.studentData.enrolledCourses.length > 0)
        ? user.studentData.enrolledCourses
        : (stored?.enrolledCourses && stored.enrolledCourses.length > 0)
        ? stored.enrolledCourses
        : INITIAL_TRAINEE_PROFILE.enrolledCourses;

      const mergedData = {
        ...user.studentData,
        enrolledCourses: existingEnrolled
      };

      const fresh = createDefaultTraineeProfile(user.fullName, user.email, mergedData);
      setTraineeProfile(fresh);
      saveToStorage('trainee_profile', fresh);
      setActiveNavTab('profile');

      // Asynchronously fetch enrolled courses & profile stored in Realtime Database
      if (user.email) {
        const emailKey = user.email.toLowerCase().replace(/[^a-z0-9]/g, '_');
        import('../firebase').then(({ rtdb, ref, get, child }) => {
          get(child(ref(rtdb), `users/trainee/${emailKey}`)).then(snap => {
            if (snap.exists()) {
              const val = snap.val();
              const dbEnrolled = val.enrolledCourses || val.traineeData?.enrolledCourses || val.studentData?.enrolledCourses;
              if (dbEnrolled && Array.isArray(dbEnrolled) && dbEnrolled.length > 0) {
                setTraineeProfile(prev => {
                  const updated = {
                    ...prev,
                    enrolledCourses: dbEnrolled.map((c: any) => ({
                      ...c,
                      roadmap: c.roadmap || generateDefaultRoadmap(c.title, c.id, c.progress || 20)
                    }))
                  };
                  saveToStorage('trainee_profile', updated);
                  return updated;
                });
              }
            } else {
              get(child(ref(rtdb), `users/${emailKey}`)).then(snap2 => {
                if (snap2.exists()) {
                  const val2 = snap2.val();
                  const dbEnrolled2 = val2.enrolledCourses || val2.traineeData?.enrolledCourses;
                  if (dbEnrolled2 && Array.isArray(dbEnrolled2) && dbEnrolled2.length > 0) {
                    setTraineeProfile(prev => {
                      const updated = {
                        ...prev,
                        enrolledCourses: dbEnrolled2.map((c: any) => ({
                          ...c,
                          roadmap: c.roadmap || generateDefaultRoadmap(c.title, c.id, c.progress || 20)
                        }))
                      };
                      saveToStorage('trainee_profile', updated);
                      return updated;
                    });
                  }
                }
              }).catch(() => {});
            }
          }).catch(() => {});
        }).catch(() => {});
      }

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

  // Trainee Participation Records (filter legacy dummy records)
  const [traineeParticipation, setTraineeParticipation] = useState<TraineeParticipationRecord[]>(() => {
    const loaded = loadFromStorage<TraineeParticipationRecord[]>('trainee_participation', INITIAL_TRAINEE_PARTICIPATION);
    return (loaded || []).filter(
      p => !p.id.startsWith('part_') &&
           !['trn_101', 'trn_102', 'trn_103', 'trn_104', 'trn_105'].includes(p.traineeId)
    );
  });

  // Trainer Library (Merged with latest seeds so all course materials are present)
  const [trainerLibrary, setTrainerLibrary] = useState<TrainerLibraryItem[]>(() => {
    const loaded = loadFromStorage<TrainerLibraryItem[]>('trainer_library', []);
    const existingIds = new Set(loaded.map(i => i.id));
    const merged = [...loaded];
    for (const item of INITIAL_TRAINER_LIBRARY) {
      if (!existingIds.has(item.id)) {
        merged.push(item);
      }
    }
    return merged.length > 0 ? merged : INITIAL_TRAINER_LIBRARY;
  });

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

  // Sync real registered trainees, library items & participation from Firebase RTDB
  useEffect(() => {
    import('../firebase').then(({ rtdb, ref, get, child }) => {
      if (!rtdb) return;

      // 1. Fetch real trainees from RTDB
      get(child(ref(rtdb), 'users/trainee')).then(snap => {
        if (snap.exists()) {
          const traineesMap = snap.val();
          const realStudents: StudentProfileSummary[] = [];

          Object.keys(traineesMap).forEach(key => {
            const t = traineesMap[key];
            const data = t.traineeData || t.studentData || t;
            const enrolled = data.enrolledCourses || t.enrolledCourses || [];

            if (data.fullName || t.fullName) {
              const enrolledIds = Array.isArray(enrolled) ? enrolled.map((c: any) => c.id) : [];
              const enrolledNames = Array.isArray(enrolled) ? enrolled.map((c: any) => c.title) : [];
              const attempts = data.mcqsAttempted || [];
              const avgScore = attempts.length > 0
                ? Math.round(attempts.reduce((sum: number, a: any) => sum + (a.percentage || 0), 0) / attempts.length)
                : 85;

              realStudents.push({
                id: data.id || t.id || `trainee_${key}`,
                fullName: data.fullName || t.fullName || 'Registered Trainee',
                email: data.email || t.email || `${key.replace(/_/g, '.')}@gmail.com`,
                cohort: data.dreamCompany ? `${data.dreamCompany} Aspirant` : 'Enrolled Trainee Cohort',
                avatar: data.avatar || t.avatar || '/default-avatar.png',
                enrolledCourseIds: enrolledIds,
                enrolledCourseNames: enrolledNames,
                averageScore: avgScore,
                quizzesCompleted: attempts.length,
                status: enrolled.some((c: any) => c.certificateApproved) ? 'Completed' : 'Active',
                approvedCertificates: (data.certificates || []).map((c: any) => ({
                  courseId: c.title,
                  courseTitle: c.title,
                  approvedDate: c.issueDate || '2026-09-30',
                  approvedBy: c.issuer || 'Capacity Connect Trainer'
                }))
              });
            }
          });

          if (realStudents.length > 0) {
            setAllStudents(prev => {
              const rtdbIds = new Set(realStudents.map(s => s.id));
              return [...realStudents, ...prev.filter(s => !rtdbIds.has(s.id))];
            });
          }
        }
      }).catch(() => {});

      // 2. Fetch trainer library items from RTDB
      get(child(ref(rtdb), 'trainer_library')).then(snap => {
        if (snap.exists()) {
          const libMap = snap.val();
          const items: TrainerLibraryItem[] = Object.values(libMap);
          if (items.length > 0) {
            setTrainerLibrary(prev => {
              const rtdbIds = new Set(items.map(i => i.id));
              return [...items, ...prev.filter(i => !rtdbIds.has(i.id))];
            });
          }
        }
      }).catch(() => {});

      // 3. Fetch trainee participation from RTDB
      get(child(ref(rtdb), 'trainee_participation')).then(snap => {
        if (snap.exists()) {
          const partMap = snap.val();
          const parts: TraineeParticipationRecord[] = Object.values(partMap);
          if (parts.length > 0) {
            setTraineeParticipation(prev => {
              const rtdbIds = new Set(parts.map(p => p.id));
              return [...parts, ...prev.filter(p => !rtdbIds.has(p.id))];
            });
          }
        }
      }).catch(() => {});
    }).catch(() => {});
  }, []);

  // Ensure active trainee profile is synced into allStudents whenever enrolledCourses change
  useEffect(() => {
    if (traineeProfile && traineeProfile.enrolledCourses && traineeProfile.enrolledCourses.length > 0) {
      setAllStudents(existing => {
        const studentIndex = existing.findIndex(s => s.id === traineeProfile.id || s.email.toLowerCase() === traineeProfile.email.toLowerCase());
        const studentSummary: StudentProfileSummary = {
          id: traineeProfile.id,
          fullName: traineeProfile.fullName,
          email: traineeProfile.email,
          cohort: traineeProfile.dreamCompany ? `${traineeProfile.dreamCompany} Aspirant` : 'Enrolled Trainee Cohort',
          avatar: traineeProfile.avatar || '/default-avatar.png',
          enrolledCourseIds: traineeProfile.enrolledCourses.map(c => c.id),
          enrolledCourseNames: traineeProfile.enrolledCourses.map(c => c.title),
          averageScore: traineeProfile.mcqsAttempted.length > 0
            ? Math.round(traineeProfile.mcqsAttempted.reduce((a, b) => a + b.percentage, 0) / traineeProfile.mcqsAttempted.length)
            : 85,
          quizzesCompleted: traineeProfile.mcqsAttempted.length,
          status: traineeProfile.enrolledCourses.some(c => c.certificateApproved) ? 'Completed' : 'Active',
          approvedCertificates: (traineeProfile.certificates || []).map(c => ({
            courseId: c.title,
            courseTitle: c.title,
            approvedDate: c.issueDate,
            approvedBy: c.issuer
          }))
        };

        if (studentIndex >= 0) {
          const copy = [...existing];
          copy[studentIndex] = studentSummary;
          return copy;
        } else {
          return [studentSummary, ...existing];
        }
      });
    }
  }, [traineeProfile.enrolledCourses, traineeProfile.fullName, traineeProfile.avatar, traineeProfile.email]);

  // --- TRAINEE ACTIONS ---
  const updateTraineeProfile = (data: Partial<TraineeProfile>) => {
    setTraineeProfile(prev => {
      const updated = { ...prev, ...data };
      try {
        if (updated.email) {
          const emailKey = updated.email.toLowerCase().replace(/[^a-z0-9]/g, '_');
          set(ref(rtdb, `users/trainee/${emailKey}/traineeData`), updated);
          if (updated.avatar !== undefined) {
            set(ref(rtdb, `users/trainee/${emailKey}/avatar`), updated.avatar);
            set(ref(rtdb, `users/${emailKey}/avatar`), updated.avatar);
          }
          set(ref(rtdb, `users/${emailKey}/traineeData`), updated);
        }
      } catch (e) {}
      return updated;
    });
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

  const enrollInCourse = (course: PlatformCourse) => {
    setTraineeProfile(prev => {
      const exists = prev.enrolledCourses.some(c => c.id === course.id);
      if (exists) return prev;

      const newEnrolled: EnrolledCourse = {
        id: course.id,
        title: course.title,
        category: course.category,
        trainerName: course.trainerName,
        progress: 15,
        totalModules: course.totalModules,
        completedModules: 1,
        enrolledDate: new Date().toISOString().split('T')[0],
        lastActive: 'Just now',
        thumbnail: course.thumbnail,
        rating: course.trainerRating,
        roadmap: generateDefaultRoadmap(course.title, course.id, 15)
      };

      const updated = {
        ...prev,
        enrolledCourses: [newEnrolled, ...prev.enrolledCourses]
      };
      saveToStorage('trainee_profile', updated);

      try {
        if (prev.email) {
          const emailKey = prev.email.toLowerCase().replace(/[^a-z0-9]/g, '_');
          set(ref(rtdb, `users/trainee/${emailKey}/enrolledCourses`), updated.enrolledCourses);
          set(ref(rtdb, `users/trainee/${emailKey}/traineeData/enrolledCourses`), updated.enrolledCourses);
          set(ref(rtdb, `users/${emailKey}/enrolledCourses`), updated.enrolledCourses);
          set(ref(rtdb, `users/${emailKey}/traineeData/enrolledCourses`), updated.enrolledCourses);
          set(ref(rtdb, `roles/TRAINEE/${emailKey}/enrolledCourses`), updated.enrolledCourses);
        }
      } catch (e) {
        console.warn('Realtime DB sync notice:', e);
      }

      return updated;
    });
  };

  const setDreamCompanies = (companies: string[]) => {
    setTraineeProfile(prev => {
      const primary = companies[0] || '';
      const updated = {
        ...prev,
        dreamCompany: primary,
        dreamCompanies: companies
      };
      saveToStorage('trainee_profile', updated);

      try {
        if (prev.email) {
          const emailKey = prev.email.toLowerCase().replace(/[^a-z0-9]/g, '_');
          set(ref(rtdb, `users/trainee/${emailKey}/dreamCompany`), primary);
          set(ref(rtdb, `users/trainee/${emailKey}/dreamCompanies`), companies);
          set(ref(rtdb, `users/trainee/${emailKey}/traineeData/dreamCompany`), primary);
          set(ref(rtdb, `users/trainee/${emailKey}/traineeData/dreamCompanies`), companies);
          set(ref(rtdb, `users/${emailKey}/traineeData/dreamCompany`), primary);
          set(ref(rtdb, `users/${emailKey}/traineeData/dreamCompanies`), companies);
        }
      } catch (e) {
        console.warn('Realtime DB sync notice:', e);
      }

      return updated;
    });
  };

  const setDreamCompany = (company: string) => {
    setDreamCompanies([company]);
  };

  const approveCourseCertificate = (studentNameOrId: string, courseId: string, trainerName: string) => {
    const today = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '.');

    // 1. Update Trainee Profile
    setTraineeProfile(prev => {
      const targetCourse = prev.enrolledCourses.find(c => c.id === courseId || c.title.toLowerCase().includes(courseId.toLowerCase()));
      const courseTitle = targetCourse ? targetCourse.title : (courseId || 'Cloud & Enterprise Architecture');

      const updatedCourses = prev.enrolledCourses.map(c => {
        if (c.id === courseId || c.title.toLowerCase().includes(courseId.toLowerCase())) {
          return {
            ...c,
            progress: 100,
            certificateApproved: true,
            certificateApprovedDate: today,
            certificateApprovedBy: trainerName
          };
        }
        return c;
      });

      const hasCert = prev.certificates.some(ct => ct.title === courseTitle);
      let updatedCerts = prev.certificates;
      if (!hasCert) {
        updatedCerts = [
          {
            id: 'cert_' + Date.now(),
            title: courseTitle,
            issuer: `Capacity Connect • ${trainerName}`,
            issueDate: today,
            credentialId: `CC-${Math.floor(100000 + Math.random() * 900000)}`,
            verificationStatus: 'Verified',
            badgeUrl: '/certificate-template.png'
          },
          ...prev.certificates
        ];
      }

      const updated: TraineeProfile = {
        ...prev,
        enrolledCourses: updatedCourses,
        certificates: updatedCerts
      };
      saveToStorage('trainee_profile', updated);
      return updated;
    });

    // 2. Update allStudents roster
    setAllStudents(prev => prev.map(s => {
      if (s.id === studentNameOrId || s.fullName.toLowerCase() === studentNameOrId.toLowerCase()) {
        const existingApproved = s.approvedCertificates || [];
        return {
          ...s,
          status: 'Completed',
          approvedCertificates: [
            ...existingApproved.filter(item => item.courseId !== courseId),
            {
              courseId,
              courseTitle: courseId,
              approvedDate: today,
              approvedBy: trainerName
            }
          ]
        };
      }
      return s;
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

    // Persist submission to Firebase RTDB
    try {
      import('../firebase').then(({ rtdb }) => {
        if (rtdb) {
          import('firebase/database').then(({ ref, set }) => {
            set(ref(rtdb, `trainee_participation/${partRecord.id}`), partRecord).catch(() => {});
          });
        }
      });
    } catch (e) {}

    // Update allStudents with new quiz count & score
    setAllStudents(existing => existing.map(s => {
      if (s.id === traineeProfile.id || s.email.toLowerCase() === traineeProfile.email.toLowerCase()) {
        const count = (s.quizzesCompleted || 0) + 1;
        const newAvg = Math.round(((s.averageScore || 80) * (s.quizzesCompleted || 1) + attempt.percentage) / count);
        return {
          ...s,
          quizzesCompleted: count,
          averageScore: newAvg
        };
      }
      return s;
    }));

    // Increment admin metrics
    setAdminAnalytics(prev => ({
      ...prev,
      assessmentsCompleted: prev.assessmentsCompleted + 1
    }));
  };

  // --- TRAINER ACTIONS ---
  const updateTrainerProfile = (data: Partial<TrainerProfile>) => {
    setTrainerProfile(prev => {
      const updated = { ...prev, ...data };
      try {
        if (updated.email) {
          const emailKey = updated.email.toLowerCase().replace(/[^a-z0-9]/g, '_');
          set(ref(rtdb, `users/trainer/${emailKey}`), updated);
          set(ref(rtdb, `users/${emailKey}`), updated);
        }
      } catch (e) {}
      return updated;
    });
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

    // Persist to Firebase RTDB
    try {
      import('../firebase').then(({ rtdb }) => {
        if (rtdb) {
          import('firebase/database').then(({ ref, set }) => {
            set(ref(rtdb, `trainer_library/${newItem.id}`), newItem).catch(() => {});
            set(ref(rtdb, `library/${newItem.id}`), newItem).catch(() => {});
          });
        }
      });
    } catch (e) {}
  };

  const deleteLibraryItem = (id: string) => {
    setTrainerLibrary(prev => prev.filter(i => i.id !== id));
    // Remove from Firebase RTDB
    try {
      import('../firebase').then(({ rtdb }) => {
        if (rtdb) {
          import('firebase/database').then(({ ref, remove }) => {
            remove(ref(rtdb, `trainer_library/${id}`)).catch(() => {});
            remove(ref(rtdb, `library/${id}`)).catch(() => {});
          });
        }
      });
    } catch (e) {}
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
        enrollInCourse,
        setDreamCompany,
        setDreamCompanies,
        trainerProfile,
        updateTrainerProfile,
        questionnaires,
        addQuestionnaire,
        deleteQuestionnaire,
        traineeParticipation,
        trainerLibrary,
        addLibraryItem,
        deleteLibraryItem,
        adminProfile,
        updateAdminProfile,
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
        allStudents,
        approveCourseCertificate,
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
