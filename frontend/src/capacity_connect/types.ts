// Capacity Connect - Core Data Types & Interfaces

export type UserRole = 'TRAINEE' | 'TRAINER' | 'ADMIN';

// --- TRAINEE TYPES ---
export interface Qualification {
  id: string;
  degree: string;
  institution: string;
  fieldOfStudy: string;
  startYear: number;
  endYear: number;
  gradeOrGpa: string;
}

export interface WorkExperience {
  id: string;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface ResumeData {
  fileName?: string;
  fileSize?: string;
  uploadDate?: string;
  fileUrl?: string;
  parsedSkills: string[];
  summary?: string;
  atsScore?: number;
}

export interface SkillItem {
  id: string;
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  category: string;
}

export interface CertificateItem {
  id: string;
  title: string;
  issuer: string;
  issueDate: string;
  credentialId: string;
  verificationStatus: 'Verified' | 'Pending' | 'Expiring Soon';
  badgeUrl?: string;
}

export interface CourseRoadmapStep {
  id: string;
  stepNumber: number;
  phase: string;
  title: string;
  description: string;
  status: 'Completed' | 'In Progress' | 'Upcoming';
  keyTopics: string[];
  estimatedHours: number;
}

export interface EnrolledCourse {
  id: string;
  title: string;
  category: string;
  trainerName: string;
  progress: number;
  totalModules: number;
  completedModules: number;
  enrolledDate: string;
  lastActive: string;
  thumbnail: string;
  rating?: number;
  roadmap?: CourseRoadmapStep[];
  certificateApproved?: boolean;
  certificateApprovedDate?: string;
  certificateApprovedBy?: string;
}

export interface MCQAttempt {
  id: string;
  questionnaireId: string;
  title: string;
  subject: string;
  trainerName: string;
  score: number;
  totalMarks: number;
  percentage: number;
  passed: boolean;
  attemptDate: string;
  timeSpentMinutes: number;
}

export interface CourseFeedback {
  id: string;
  courseId: string;
  courseTitle: string;
  trainerName: string;
  rating: number; // 1 to 5
  feedbackDate: string;
  comment: string;
  contentQuality: number;
  trainerClarity: number;
}

export interface PortfolioItem {
  id: string;
  title: string;
  tagline: string;
  category: string; // e.g. 'Web App', 'AI Prototype', 'Cloud Arch', 'Research'
  description: string;
  problemStatement: string;
  solution: string;
  techStack: string[];
  liveDemoUrl?: string;
  githubUrl?: string;
  mediaUrl?: string;
  likes: number;
  views?: number;
  status: 'Published' | 'In Ideation' | 'Under Review' | 'Featured';
  createdDate: string;
}

export interface TrainerWishlistItem {
  trainerId: string;
  trainerName: string;
  title: string;
  avatar: string;
  domain: string;
  rating: number;
  availableHours: string;
  addedDate: string;
  notes: string;
  mentorshipStatus: 'Wishlisted' | 'Request Sent' | 'Session Scheduled' | 'Connected';
}

export interface GitHubRepository {
  id: number | string;
  name: string;
  fullName?: string;
  description: string;
  htmlUrl: string;
  language: string;
  starsCount: number;
  forksCount: number;
  updatedAt: string;
  homepageUrl?: string;
  topics?: string[];
}

export interface TraineeProfile {
  id: string;
  fullName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
  avatar: string;
  githubUrl?: string;
  githubUsername?: string;
  githubProjects?: GitHubRepository[];
  qualifications: Qualification[];
  workExperience: WorkExperience[];
  resume?: ResumeData;
  interests: string[];
  skills: SkillItem[];
  certificates: CertificateItem[];
  enrolledCourses: EnrolledCourse[];
  mcqsAttempted: MCQAttempt[];
  feedbacks: CourseFeedback[];
  portfolio: PortfolioItem[];
  wishlistTrainers: TrainerWishlistItem[];
  dreamCompany?: string;
  dreamCompanies?: string[];
}

// --- TRAINER TYPES ---
export interface TrainerProfile {
  id: string;
  fullName: string;
  title: string;
  organization: string;
  email: string;
  avatar: string;
  bio: string;
  specialization: string[];
  competencies: string[]; // Subject taxonomy tags
  yearsOfExperience: number;
  hourlyCapacityHoursPerWeek: number;
  rating: number;
  totalStudentsMentored: number;
  certifications: string[];
  availability: 'Available' | 'Limited Slots' | 'Unavailable';
}

export interface QuestionnaireQuestion {
  id: string;
  questionText: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
  marks: number;
}

export interface Questionnaire {
  id: string;
  title: string;
  subject: string;
  trainerId: string;
  trainerName: string;
  description: string;
  deadline: string; // ISO string or datetime
  durationMinutes: number;
  passingPercentage: number;
  totalMarks: number;
  questions: QuestionnaireQuestion[];
  status: 'Active' | 'Draft' | 'Archived';
  createdAt: string;
  totalAttempts: number;
}

export interface TraineeParticipationRecord {
  id: string;
  questionnaireId: string;
  questionnaireTitle: string;
  traineeId: string;
  traineeName: string;
  traineeAvatar: string;
  submittedAt: string;
  score: number;
  totalMarks: number;
  percentage: number;
  passed: boolean;
  status: 'Completed' | 'Pending' | 'Late Submission';
  timeSpentMinutes: number;
}

export interface TrainerLibraryItem {
  id: string;
  title: string;
  type: 'Lecture' | 'Presentation' | 'Study Material' | 'Assignment';
  subject: string;
  trainerId: string;
  trainerName: string;
  description: string;
  uploadedAt: string;
  fileSizeOrDuration: string;
  resourceLink: string;
  downloadsCount: number;
  tags: string[];
  courseId?: string;
  courseTitle?: string;
  youtubeUrl?: string;
  dueDate?: string;
}

// --- ADMIN TYPES ---
export interface UserApprovalRecord {
  id: string;
  fullName: string;
  email: string;
  requestedRole: UserRole;
  registeredDate: string;
  organizationOrDegree: string;
  domain: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  approvalNotes?: string;
}

export interface UserManagementRecord {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  status: 'Active' | 'Pending Approval' | 'Suspended';
  joinDate: string;
  department: string;
  completionScore: number;
}

export interface HomepageAnnouncement {
  id: string;
  title: string;
  content: string;
  category: 'Announcement' | 'Notification' | 'Achievement' | 'New Learning Content';
  urgency: 'Normal' | 'Important' | 'Critical';
  publishedDate: string;
  active: boolean;
  author: string;
  targetRole: 'ALL' | 'TRAINEE' | 'TRAINER';
}

export interface CompetencyMappingSubject {
  id: string;
  subjectCode: string;
  subjectName: string;
  domain: string;
  description: string;
  demandLevel: 'High' | 'Medium' | 'Critical';
  requiredLevel: 'Intermediate' | 'Advanced' | 'Expert';
  assignedTrainerId?: string;
  assignedTrainerName?: string;
  suitableTrainers: {
    trainerId: string;
    trainerName: string;
    competencyScore: number; // 0-100%
    verifiedCertifications: number;
    rating: number;
    status: 'Assigned' | 'Available' | 'Recommended';
  }[];
}

export interface AdminAnalyticsMetrics {
  totalCourses: number;
  totalEnrollments: number;
  certificationsIssued: number;
  assessmentsCompleted: number;
  avgAssessmentScore: number;
  activeParticipationRate: number;
  totalTrainers: number;
  totalTrainees: number;
  enrollmentTrend: { month: string; count: number }[];
  subjectDistribution: { subject: string; learners: number; trainers: number }[];
}

export interface PlatformCourse {
  id: string;
  code: string;
  title: string;
  category: string;
  description: string;
  trainerId: string;
  trainerName: string;
  trainerTitle: string;
  trainerAvatar: string;
  trainerEmail: string;
  trainerExperienceYears: number;
  trainerRating: number;
  totalModules: number;
  durationWeeks: number;
  enrolledStudentsCount: number;
  materialsCount: number;
  thumbnail: string;
}

export interface StudentProfileSummary {
  id: string;
  fullName: string;
  email: string;
  cohort: string;
  avatar: string;
  enrolledCourseIds: string[];
  enrolledCourseNames: string[];
  averageScore: number;
  quizzesCompleted: number;
  status: 'Active' | 'Under Review' | 'Completed';
  approvedCertificates?: {
    courseId: string;
    courseTitle: string;
    approvedDate: string;
    approvedBy: string;
  }[];
}

