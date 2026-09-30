import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, Clock, Award, BookOpen, 
  ChevronRight, ChevronLeft, Sparkles,
  MapPin, User, TrendingUp, Presentation, FileText, Video,
  Download, UploadCloud, X, PlayCircle, Code, FileCheck, ArrowLeft,
  Check, CheckSquare, Printer, RotateCcw
} from 'lucide-react';
import { EnrolledCourse } from '../types';
import { usePlatform } from '../PlatformContext';
import { CourseCertificateModal } from '../common/CourseCertificateModal';
import { getCourseAssignmentQuestions, AssignmentQuestion } from '../courseAssignmentsData';

interface CourseRoadmapPathProps {
  enrolledCourses?: EnrolledCourse[];
  activeCourse?: EnrolledCourse;
  onBack?: () => void;
  onExploreMore?: () => void;
}

// Function to generate tailored 4-step roadmap stages for each course
const generateCourseRoadmapStages = (courseTitle: string, category: string) => {
  const title = (courseTitle || '').toLowerCase();
  
  if (title.includes('machine learning') || title.includes('ml')) {
    return [
      {
        stageTitle: 'Mathematical Foundations & Data Preprocessing',
        defaultDesc: 'Linear algebra, multivariate calculus, probability distributions, matrix factorization, and vector normalization pipelines.',
        videoTitle: 'Mathematical Preliminaries & Data Normalization',
        videoDuration: '70 Mins • 1080p HD',
        handbookTitle: 'ML Foundations & Linear Algebra Reference Manual (PDF)',
        handbookPages: '58 Pages • 8.4 MB PDF',
        assignmentTitle: 'Assignment 1: Data Pipeline & Gradient Descent Implementation',
        assignmentMarks: '100 Marks',
        assignmentDueDate: '2026-10-18'
      },
      {
        stageTitle: 'Supervised Learning & Regression Models',
        defaultDesc: 'Linear regression, logistic classifiers, decision trees, support vector machines, and loss function minimization.',
        videoTitle: 'Supervised Classifiers & Loss Optimization Masterclass',
        videoDuration: '85 Mins • 1080p HD',
        handbookTitle: 'Supervised Learning Lab Handbook & Theorem Guide (PDF)',
        handbookPages: '74 Pages • 10.2 MB PDF',
        assignmentTitle: 'Assignment 2: Custom SVM & Decision Tree Classification Suite',
        assignmentMarks: '100 Marks',
        assignmentDueDate: '2026-10-25'
      },
      {
        stageTitle: 'Neural Networks & Deep Learning Architectures',
        defaultDesc: 'Backpropagation mechanics, activation functions, convolutional layers, recurrent cells, and dropout regularization.',
        videoTitle: 'Deep Neural Networks & Backpropagation Walkthrough',
        videoDuration: '95 Mins • 1080p HD',
        handbookTitle: 'Deep Learning Architectures & Tuning Handbook (PDF)',
        handbookPages: '68 Pages • 9.8 MB PDF',
        assignmentTitle: 'Assignment 3: Neural Network Training & Hyperparameter Tuning',
        assignmentMarks: '100 Marks',
        assignmentDueDate: '2026-11-05'
      },
      {
        stageTitle: 'Production MLOps & Capstone Deployment',
        defaultDesc: 'Model quantization, containerized FastAPI inference servers, monitoring data drift, and enterprise production pipeline.',
        videoTitle: 'Production MLOps & Real-Time Inference Deployment',
        videoDuration: '115 Mins • 1080p HD',
        handbookTitle: 'MLOps Production Standards & Capstone Specification (PDF)',
        handbookPages: '80 Pages • 12.1 MB PDF',
        assignmentTitle: 'Assignment 4: End-to-End MLOps Pipeline & Docker Deployment',
        assignmentMarks: '100 Marks',
        assignmentDueDate: '2026-11-15'
      }
    ];
  }

  if (title.includes('artificial intelligence') || title.includes('ai')) {
    return [
      {
        stageTitle: 'AI Foundations, State Space & Heuristic Search',
        defaultDesc: 'Problem formulation, uninformed search, A* graph search, heuristic admissibility, and adversarial minimax trees.',
        videoTitle: 'Heuristic Search & Adversarial Game Trees Lecture',
        videoDuration: '72 Mins • 1080p HD',
        handbookTitle: 'AI Search Algorithms & Heuristics Handbook (PDF)',
        handbookPages: '60 Pages • 8.6 MB PDF',
        assignmentTitle: 'Assignment 1: A* Graph Search & Alpha-Beta Pruning Engine',
        assignmentMarks: '100 Marks',
        assignmentDueDate: '2026-10-18'
      },
      {
        stageTitle: 'Knowledge Representation & First-Order Logic',
        defaultDesc: 'Propositional logic, first-order inference, resolution theorem proving, ontologies, and semantic graph structures.',
        videoTitle: 'Knowledge Engineering & Inference Engines Masterclass',
        videoDuration: '88 Mins • 1080p HD',
        handbookTitle: 'Logic Systems & Automated Reasoning Reference Manual (PDF)',
        handbookPages: '70 Pages • 9.5 MB PDF',
        assignmentTitle: 'Assignment 2: Propositional Inference & Ontological Querying',
        assignmentMarks: '100 Marks',
        assignmentDueDate: '2026-10-25'
      },
      {
        stageTitle: 'Probabilistic Reasoning & Reinforcement Learning',
        defaultDesc: 'Bayesian networks, Markov decision processes (MDP), Bellman optimality, value iteration, and Q-learning policies.',
        videoTitle: 'Bayesian Belief Networks & Q-Learning Demonstration',
        videoDuration: '96 Mins • 1080p HD',
        handbookTitle: 'Probabilistic Models & RL Algorithms Manual (PDF)',
        handbookPages: '66 Pages • 9.2 MB PDF',
        assignmentTitle: 'Assignment 3: Markov Decision Process Solver & Policy Evaluator',
        assignmentMarks: '100 Marks',
        assignmentDueDate: '2026-11-05'
      },
      {
        stageTitle: 'Autonomous Agent Systems & Capstone Defense',
        defaultDesc: 'Multi-agent coordination, ethical AI frameworks, safety boundaries, and full-scale autonomous agent project presentation.',
        videoTitle: 'Autonomous Multi-Agent Architecture & Capstone Briefing',
        videoDuration: '110 Mins • 1080p HD',
        handbookTitle: 'Autonomous AI Systems & Capstone Specification (PDF)',
        handbookPages: '78 Pages • 11.5 MB PDF',
        assignmentTitle: 'Assignment 4: Final Autonomous Agent Capstone & Defense',
        assignmentMarks: '100 Marks',
        assignmentDueDate: '2026-11-15'
      }
    ];
  }

  if (title.includes('network') || title.includes('communication')) {
    return [
      {
        stageTitle: 'Network Layering, OSI Model & Physical Protocol',
        defaultDesc: 'Layered architectures, OSI vs TCP/IP models, physical media encoding, framing, and link-layer error detection CRC.',
        videoTitle: 'OSI Protocol Architecture & Packet Flow Walkthrough',
        videoDuration: '65 Mins • 1080p HD',
        handbookTitle: 'Network Protocols & Physical Layering Manual (PDF)',
        handbookPages: '52 Pages • 7.5 MB PDF',
        assignmentTitle: 'Assignment 1: Packet Frame Parser & Checksum Verification',
        assignmentMarks: '100 Marks',
        assignmentDueDate: '2026-10-18'
      },
      {
        stageTitle: 'TCP/IP Sockets, Flow Control & Congestion',
        defaultDesc: 'Socket programming in C/Python, sliding window protocols, TCP 3-way handshakes, AIMD congestion control, and UDP throughput.',
        videoTitle: 'TCP Congestion Dynamics & Socket Programming Masterclass',
        videoDuration: '82 Mins • 1080p HD',
        handbookTitle: 'Socket Programming & Transport Layer Handbook (PDF)',
        handbookPages: '66 Pages • 9.1 MB PDF',
        assignmentTitle: 'Assignment 2: Multi-threaded TCP Client-Server Implementation',
        assignmentMarks: '100 Marks',
        assignmentDueDate: '2026-10-25'
      },
      {
        stageTitle: 'Routing Protocols, CIDR Subnetting & NAT',
        defaultDesc: 'Dijkstra link-state (OSPF), Bellman-Ford distance vector (BGP), hierarchical CIDR address allocation, and NAT traversals.',
        videoTitle: 'Dynamic Routing Algorithms & Subnet Architecture',
        videoDuration: '90 Mins • 1080p HD',
        handbookTitle: 'IP Routing Protocols & CIDR Subnetting Handbook (PDF)',
        handbookPages: '72 Pages • 10.4 MB PDF',
        assignmentTitle: 'Assignment 3: Simulated Router Forwarding Table & OSPF Solver',
        assignmentMarks: '100 Marks',
        assignmentDueDate: '2026-11-05'
      },
      {
        stageTitle: 'Cloud Networking, TLS Security & Capstone',
        defaultDesc: 'Software-defined networking (SDN), TLS 1.3 cryptography, IPSec tunneling, CDN caching, and enterprise network design.',
        videoTitle: 'Enterprise Cloud Networking & Security Infrastructure',
        videoDuration: '105 Mins • 1080p HD',
        handbookTitle: 'Enterprise Network Architecture & Capstone Guide (PDF)',
        handbookPages: '82 Pages • 12.0 MB PDF',
        assignmentTitle: 'Assignment 4: Enterprise Network Topology Simulation & Defense',
        assignmentMarks: '100 Marks',
        assignmentDueDate: '2026-11-15'
      }
    ];
  }

  if (title.includes('data structure') || title.includes('programming') || title.includes('python')) {
    return [
      {
        stageTitle: 'Core Syntax, Memory Layout & Pointers',
        defaultDesc: 'Memory address spaces, stack vs heap allocation, dynamic arrays, pointer mechanics, and Big-O runtime analysis.',
        videoTitle: 'Memory Management & Algorithmic Complexity Lecture',
        videoDuration: '68 Mins • 1080p HD',
        handbookTitle: 'Memory Architecture & Asymptotic Analysis Manual (PDF)',
        handbookPages: '55 Pages • 7.9 MB PDF',
        assignmentTitle: 'Assignment 1: Dynamic Array & Custom Vector Engine',
        assignmentMarks: '100 Marks',
        assignmentDueDate: '2026-10-18'
      },
      {
        stageTitle: 'Linear Structures, Linked Lists & Stacks',
        defaultDesc: 'Singly and doubly linked lists, amortized queues, stack-based expression parsing, and hash table collisions.',
        videoTitle: 'Linear Structures & Hash Collisions Masterclass',
        videoDuration: '84 Mins • 1080p HD',
        handbookTitle: 'Linear Data Structures & Hashing Handbook (PDF)',
        handbookPages: '68 Pages • 9.3 MB PDF',
        assignmentTitle: 'Assignment 2: Thread-Safe Ring Buffer & Hash Map Implementation',
        assignmentMarks: '100 Marks',
        assignmentDueDate: '2026-10-25'
      },
      {
        stageTitle: 'Non-linear Trees, Priority Queues & Graphs',
        defaultDesc: 'Binary search trees, AVL self-balancing rotations, min/max heaps, Dijkstra graph shortest paths, and topological sorting.',
        videoTitle: 'Self-Balancing Trees & Graph Traversal Algorithms',
        videoDuration: '92 Mins • 1080p HD',
        handbookTitle: 'Trees, Heaps & Graph Algorithms Manual (PDF)',
        handbookPages: '74 Pages • 10.6 MB PDF',
        assignmentTitle: 'Assignment 3: AVL Tree Indexer & Graph Routing Engine',
        assignmentMarks: '100 Marks',
        assignmentDueDate: '2026-11-05'
      },
      {
        stageTitle: 'Dynamic Programming & Enterprise Capstone',
        defaultDesc: 'Memoization, tabulation, knapsack optimization, bit manipulation, and building a high-throughput algorithmic engine.',
        videoTitle: 'Advanced Dynamic Programming & Capstone Architecture',
        videoDuration: '110 Mins • 1080p HD',
        handbookTitle: 'High-Performance Algorithms & Capstone Specification (PDF)',
        handbookPages: '84 Pages • 12.3 MB PDF',
        assignmentTitle: 'Assignment 4: High-Performance Data Processing Capstone',
        assignmentMarks: '100 Marks',
        assignmentDueDate: '2026-11-15'
      }
    ];
  }

  // Default fallback for any other course
  return [
    {
      stageTitle: 'Foundations & Architecture Baseline',
      defaultDesc: `Core development environment, syntax prerequisites, CLI tooling, and foundational architecture standards for ${courseTitle}.`,
      videoTitle: `${courseTitle}: Foundations & Architecture Deep Dive`,
      videoDuration: '65 Mins • 1080p HD',
      handbookTitle: `${courseTitle} Foundations & Syntax Manual (PDF)`,
      handbookPages: '54 Pages • 7.8 MB PDF',
      assignmentTitle: 'Assignment 1: Foundations Problem Set & Lab Setup',
      assignmentMarks: '100 Marks',
      assignmentDueDate: '2026-10-18'
    },
    {
      stageTitle: 'Core Concepts & Hands-on Guided Labs',
      defaultDesc: `Trainer-led design patterns, algorithmic implementations, and hands-on lab worksheets for ${courseTitle}.`,
      videoTitle: `${courseTitle}: Core Engineering & Implementation Masterclass`,
      videoDuration: '82 Mins • 1080p HD',
      handbookTitle: `${courseTitle} Core Engineering & Lab Manual (PDF)`,
      handbookPages: '68 Pages • 9.4 MB PDF',
      assignmentTitle: 'Assignment 2: Core Engineering & Guided Lab Worksheet',
      assignmentMarks: '100 Marks',
      assignmentDueDate: '2026-10-25'
    },
    {
      stageTitle: 'Advanced Optimization & Production Patterns',
      defaultDesc: `Throughput optimization, distributed caching, security audits, resilience testing, and container deployment.`,
      videoTitle: `${courseTitle}: Advanced Optimization & Performance Tuning`,
      videoDuration: '90 Mins • 1080p HD',
      handbookTitle: `${courseTitle} Optimization & Production Handbook (PDF)`,
      handbookPages: '62 Pages • 8.9 MB PDF',
      assignmentTitle: 'Assignment 3: Production Optimization & Benchmarking Audit',
      assignmentMarks: '100 Marks',
      assignmentDueDate: '2026-11-05'
    },
    {
      stageTitle: 'Capstone Implementation & Certification',
      defaultDesc: `Full enterprise production capstone project, peer reviews, final evaluation, and official certification issuance.`,
      videoTitle: `${courseTitle}: Enterprise Capstone Defense & Deployment`,
      videoDuration: '105 Mins • 1080p HD',
      handbookTitle: `${courseTitle} Industry Capstone Specification (PDF)`,
      handbookPages: '76 Pages • 11.2 MB PDF',
      assignmentTitle: 'Assignment 4: Final Enterprise Capstone Submission & Defense',
      assignmentMarks: '100 Marks',
      assignmentDueDate: '2026-11-15'
    }
  ];
};

const THEMES = [
  {
    phaseLabel: 'Phase 1',
    stepNum: '01',
    pinColor: '#8B5CF6',
    nodeBg: 'bg-purple-600',
    nodeRing: 'ring-purple-300',
    bottomBarColor: 'bg-[#8B5CF6]',
    badgeBg: 'bg-purple-100 text-purple-800',
    icon: User,
    slidesSize: '12.4 MB PPTX'
  },
  {
    phaseLabel: 'Phase 2',
    stepNum: '02',
    pinColor: '#EF4444',
    nodeBg: 'bg-rose-500',
    nodeRing: 'ring-rose-300',
    bottomBarColor: 'bg-[#EF4444]',
    badgeBg: 'bg-rose-100 text-rose-800',
    icon: TrendingUp,
    slidesSize: '16.2 MB PPTX'
  },
  {
    phaseLabel: 'Phase 3',
    stepNum: '03',
    pinColor: '#10B981',
    nodeBg: 'bg-emerald-500',
    nodeRing: 'ring-emerald-300',
    bottomBarColor: 'bg-[#10B981]',
    badgeBg: 'bg-emerald-100 text-emerald-800',
    icon: Award,
    slidesSize: '18.6 MB PPTX'
  },
  {
    phaseLabel: 'Phase 4',
    stepNum: '04',
    pinColor: '#0EA5E9',
    nodeBg: 'bg-sky-500',
    nodeRing: 'ring-sky-300',
    bottomBarColor: 'bg-[#F59E0B]',
    badgeBg: 'bg-sky-100 text-sky-800',
    icon: Presentation,
    slidesSize: '22.5 MB PPTX'
  }
];

// Helper to extract clean YouTube embed URL from various formats (standard, shorts, youtu.be)
const getYouTubeEmbedUrl = (rawUrl?: string): string | null => {
  if (!rawUrl) return null;
  const match = rawUrl.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|youtube\.com\/shorts\/)([^"&?\/\s]{11})/);
  return match && match[1] ? `https://www.youtube.com/embed/${match[1]}?autoplay=1&rel=0` : null;
};

// Course topic fallback educational YouTube videos (used if trainer hasn't uploaded a video yet)
const DEFAULT_COURSE_VIDEOS: Record<string, string> = {
  'crs_ml_1': 'https://www.youtube.com/watch?v=GwIo3gDZCVQ', // Machine Learning Course
  'crs_ai_2': 'https://www.youtube.com/watch?v=5NgNicANyqM', // Artificial Intelligence Course
  'crs_net_3': 'https://www.youtube.com/watch?v=IPvYjXCsTg8', // Computer Networks Course
  'crs_dsa_4': 'https://www.youtube.com/watch?v=RBSGKlAnoiM', // Data Structures and Algorithms
  'crs_se_5': 'https://www.youtube.com/watch?v=Wxh-B6_K7yI', // Software Engineering Course
  'crs_dc_6': 'https://www.youtube.com/watch?v=sQXp5gLzUu8', // Data Communications
  'crs_prob_7': 'https://www.youtube.com/watch?v=Vfo5le26IhY', // Probability and Statistics
  'crs_dm_8': 'https://www.youtube.com/watch?v=wGLTV8MgLlA', // Discrete Mathematics
  'crs_fai_9': 'https://www.youtube.com/watch?v=JMUxmLyrhSk', // Fundamentals of AI
  'crs_re_10': 'https://www.youtube.com/watch?v=1kUE0BZtTRc', // Renewable Energy Technologies
  'crs_gt_11': 'https://www.youtube.com/watch?v=MHS-htjGgSY', // Game Theory
  'crs_es_12': 'https://www.youtube.com/watch?v=xxpc-HPKN28', // Engineering Statistics
  'crs_py_13': 'https://www.youtube.com/watch?v=_uQrJ0TkZlc', // Python for Beginners
  'crs_1': 'https://www.youtube.com/watch?v=d_kUhyoxV2k', // Cloud Architecture & Kubernetes
  'crs_2': 'https://www.youtube.com/watch?v=tPYj3fFJGjk', // PyTorch Deep Learning
};

export const CourseRoadmapPath: React.FC<CourseRoadmapPathProps> = ({
  enrolledCourses = [],
  activeCourse: propActiveCourse,
  onBack,
  onExploreMore
}) => {
  const { traineeProfile, updateTraineeProfile, addCertificate, trainerLibrary } = usePlatform();

  const [selectedCourseId, setSelectedCourseId] = useState<string>(() => {
    if (propActiveCourse) return propActiveCourse.id;
    return enrolledCourses.length > 0 ? enrolledCourses[0].id : '';
  });

  const activeCourse = propActiveCourse || enrolledCourses.find(c => c.id === selectedCourseId) || enrolledCourses[0];

  // Active step selected in the roadmap (0 = Phase 1, 1 = Phase 2, etc.)
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);

  // Per-step tracking of:
  // 1. Lecture watched
  // 2. Handbook downloaded
  // 3. Assignment submitted
  const [stepLectureWatched, setStepLectureWatched] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem(`roadmap_lectures_${activeCourse?.id}`);
      return saved ? JSON.parse(saved) : { 'step_0': true };
    } catch {
      return { 'step_0': true };
    }
  });

  const [stepHandbookDownloaded, setStepHandbookDownloaded] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem(`roadmap_handbooks_${activeCourse?.id}`);
      return saved ? JSON.parse(saved) : { 'step_0': true };
    } catch {
      return { 'step_0': true };
    }
  });

  const [stepAssignmentSubmitted, setStepAssignmentSubmitted] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem(`roadmap_assignments_${activeCourse?.id}`);
      return saved ? JSON.parse(saved) : { 'step_0': true };
    } catch {
      return { 'step_0': true };
    }
  });

  // Per-step assignment scoring
  interface StepAssignmentScore {
    score: number;
    totalQuestions: number;
    percentage: number;
    userAnswers: Record<number, number>;
    submittedAt: string;
  }

  const [stepAssignmentScores, setStepAssignmentScores] = useState<Record<string, StepAssignmentScore>>(() => {
    try {
      const saved = localStorage.getItem(`roadmap_assignment_scores_${activeCourse?.id}`);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Synchronize state when activeCourse changes
  useEffect(() => {
    if (!activeCourse?.id) return;
    try {
      const savedLect = localStorage.getItem(`roadmap_lectures_${activeCourse.id}`);
      if (savedLect) setStepLectureWatched(JSON.parse(savedLect));
      const savedHand = localStorage.getItem(`roadmap_handbooks_${activeCourse.id}`);
      if (savedHand) setStepHandbookDownloaded(JSON.parse(savedHand));
      const savedAssign = localStorage.getItem(`roadmap_assignments_${activeCourse.id}`);
      if (savedAssign) setStepAssignmentSubmitted(JSON.parse(savedAssign));
      const savedScores = localStorage.getItem(`roadmap_assignment_scores_${activeCourse.id}`);
      if (savedScores) setStepAssignmentScores(JSON.parse(savedScores));
    } catch (e) {
      console.error(e);
    }
  }, [activeCourse?.id]);

  // Modals & State
  const [activeVideoModal, setActiveVideoModal] = useState<{
    title: string;
    duration: string;
    trainerName: string;
    stepTitle: string;
    stepIndex: number;
    videoUrl?: string;
    isTrainerUploaded?: boolean;
    trainerMaterialTitle?: string;
  } | null>(null);

  // Active Assignment Modal State (10-question AI Quiz)
  const [activeAssignmentStep, setActiveAssignmentStep] = useState<number | null>(null);
  const [currentQuizAnswers, setCurrentQuizAnswers] = useState<Record<number, number>>({});
  const [isQuizSubmitted, setIsQuizSubmitted] = useState<boolean>(false);

  // Certificate Modal State
  const [certModalData, setCertModalData] = useState<{
    studentName: string;
    courseTitle: string;
    issueDate?: string;
    trainerName?: string;
    credentialId?: string;
  } | null>(null);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  if (!activeCourse) {
    return (
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
          <BookOpen size={24} />
        </div>
        <h3 className="font-bold text-base text-slate-900">No Course Selected</h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          Please select an enrolled course to view its dedicated roadmap.
        </p>
        {onBack && (
          <button
            onClick={onBack}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition cursor-pointer"
          >
            ← Back to My Courses
          </button>
        )}
      </div>
    );
  }

  // Generate customized 4 steps for THIS specific course
  const courseStages = generateCourseRoadmapStages(activeCourse.title, activeCourse.category);
  const fullSteps = THEMES.map((theme, i) => ({
    ...theme,
    ...courseStages[i],
    stepIndex: i
  }));

  // Find if trainer uploaded a video for this active course
  const matchingTrainerVideo = (trainerLibrary || []).find(item => {
    const matchCourseId = item.courseId && item.courseId === activeCourse?.id;
    const matchCourseTitle = item.courseTitle && activeCourse?.title && item.courseTitle.toLowerCase().trim() === activeCourse.title.toLowerCase().trim();
    const matchSubject = item.subject && activeCourse?.title && activeCourse.title.toLowerCase().includes(item.subject.toLowerCase());
    const hasYouTube = Boolean(item.youtubeUrl || (item.resourceLink && (item.resourceLink.includes('youtube.com') || item.resourceLink.includes('youtu.be'))));
    return (matchCourseId || matchCourseTitle || matchSubject) && hasYouTube;
  });

  const currentCourseVideoUrl = matchingTrainerVideo?.youtubeUrl || 
    matchingTrainerVideo?.resourceLink || 
    (activeCourse?.id ? DEFAULT_COURSE_VIDEOS[activeCourse.id] : '') || 
    'https://www.youtube.com/watch?v=GwIo3gDZCVQ';

  // Step Completion Check: A step is completed when Assignment is submitted AND (Lecture watched OR Handbook downloaded)
  const isStepCompleted = (stepIdx: number) => {
    const assignKey = `step_${stepIdx}`;
    const lectKey = `step_${stepIdx}`;
    const handKey = `step_${stepIdx}`;
    return !!stepAssignmentSubmitted[assignKey] && (!!stepLectureWatched[lectKey] || !!stepHandbookDownloaded[handKey]);
  };

  // Completed steps count
  const completedStepsCount = [0, 1, 2, 3].filter(i => isStepCompleted(i)).length;
  const computedProgress = Math.min(100, completedStepsCount * 25);
  const isAllStepsCompleted = completedStepsCount === 4 || activeCourse.certificateApproved || (activeCourse.progress >= 100);

  // Sync completion progress to activeCourse in PlatformContext
  useEffect(() => {
    if (activeCourse && computedProgress > (activeCourse.progress || 0)) {
      const todayDate = new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }).replace(/\//g, '.');

      const isFinished = computedProgress >= 100;
      const updatedEnrolled = traineeProfile.enrolledCourses.map(c => {
        if (c.id === activeCourse.id) {
          return {
            ...c,
            progress: computedProgress,
            completedModules: Math.min(c.totalModules, completedStepsCount * 3),
            certificateApproved: isFinished ? true : c.certificateApproved,
            certificateApprovedDate: isFinished ? todayDate : c.certificateApprovedDate
          };
        }
        return c;
      });

      updateTraineeProfile({ enrolledCourses: updatedEnrolled });

      // If all completed, add certificate to profile if not already present
      if (isFinished) {
        const hasExistingCert = traineeProfile.certificates.some(
          cert => cert.title.toLowerCase().includes(activeCourse.title.toLowerCase())
        );
        if (!hasExistingCert) {
          addCertificate({
            title: activeCourse.title,
            issuer: `Capacity Connect • ${activeCourse.trainerName}`,
            issueDate: todayDate,
            credentialId: `CC-${Math.floor(100000 + Math.random() * 900000)}`,
            verificationStatus: 'Verified'
          });
        }
      }
    }
  }, [computedProgress, activeCourse.id]);

  const activeStep = fullSteps[activeStepIndex];
  const ActiveIcon = activeStep.icon;
  const isCurrentStepDone = isStepCompleted(activeStepIndex);

  // Mark Lecture Done
  const markLectureDone = (stepIdx: number) => {
    const key = `step_${stepIdx}`;
    const nextState = { ...stepLectureWatched, [key]: true };
    setStepLectureWatched(nextState);
    localStorage.setItem(`roadmap_lectures_${activeCourse.id}`, JSON.stringify(nextState));
    triggerToast(`Lecture for ${fullSteps[stepIdx].phaseLabel} marked as watched!`);
  };

  // Mark Handbook Done
  const markHandbookDone = (stepIdx: number) => {
    const key = `step_${stepIdx}`;
    const nextState = { ...stepHandbookDownloaded, [key]: true };
    setStepHandbookDownloaded(nextState);
    localStorage.setItem(`roadmap_handbooks_${activeCourse.id}`, JSON.stringify(nextState));
    triggerToast(`Handbook for ${fullSteps[stepIdx].phaseLabel} downloaded!`);
  };

  // Open AI Assignment Modal
  const openAssignmentModal = (stepIdx: number) => {
    const existingScore = stepAssignmentScores[`step_${stepIdx}`];
    if (existingScore && existingScore.userAnswers) {
      setCurrentQuizAnswers(existingScore.userAnswers);
      setIsQuizSubmitted(true);
    } else {
      setCurrentQuizAnswers({});
      setIsQuizSubmitted(false);
    }
    setActiveAssignmentStep(stepIdx);
  };

  // Select Option for Question
  const handleSelectOption = (questionIdx: number, optionIdx: number) => {
    if (isQuizSubmitted) return;
    setCurrentQuizAnswers(prev => ({
      ...prev,
      [questionIdx]: optionIdx
    }));
  };

  // Submit AI Assignment & Calculate Marks
  const handleQuizSubmit = (questions: AssignmentQuestion[]) => {
    if (activeAssignmentStep === null) return;
    
    let correctCount = 0;
    questions.forEach((q, idx) => {
      if (currentQuizAnswers[idx] === q.correctOptionIndex) {
        correctCount += 1;
      }
    });

    const total = questions.length;
    const percentage = Math.round((correctCount / total) * 100);
    const now = new Date().toLocaleDateString('en-GB');

    const scoreData: StepAssignmentScore = {
      score: correctCount,
      totalQuestions: total,
      percentage,
      userAnswers: currentQuizAnswers,
      submittedAt: now
    };

    const stepKey = `step_${activeAssignmentStep}`;
    const nextScores = { ...stepAssignmentScores, [stepKey]: scoreData };
    setStepAssignmentScores(nextScores);
    localStorage.setItem(`roadmap_assignment_scores_${activeCourse.id}`, JSON.stringify(nextScores));

    // Mark assignment as completed
    const nextAssignments = { ...stepAssignmentSubmitted, [stepKey]: true };
    setStepAssignmentSubmitted(nextAssignments);
    localStorage.setItem(`roadmap_assignments_${activeCourse.id}`, JSON.stringify(nextAssignments));

    // Auto-mark lecture and handbook so roadmap step turns green tick
    markLectureDone(activeAssignmentStep);
    markHandbookDone(activeAssignmentStep);

    setIsQuizSubmitted(true);
    triggerToast(`AI Assignment Graded: You scored ${correctCount}/${total} Marks (${percentage}%)! Milestone marked completed ✓`);

    const isLastStep = activeAssignmentStep === 3;
    if (isLastStep) {
      setTimeout(() => {
        setCertModalData({
          studentName: traineeProfile.fullName,
          courseTitle: activeCourse.title,
          issueDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '.'),
          trainerName: activeCourse.trainerName,
          credentialId: `CC-${Math.floor(100000 + Math.random() * 900000)}`
        });
      }, 1000);
    }
  };

  // Retake AI Assignment
  const handleRetakeQuiz = () => {
    setCurrentQuizAnswers({});
    setIsQuizSubmitted(false);
  };

  const isCurrentLectDone = !!stepLectureWatched[`step_${activeStepIndex}`];
  const isCurrentHandDone = !!stepHandbookDownloaded[`step_${activeStepIndex}`];
  const isCurrentAssignDone = !!stepAssignmentSubmitted[`step_${activeStepIndex}`];

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-blue-600 text-white px-4 py-2.5 rounded-2xl shadow-2xl flex items-center gap-2 text-xs font-bold animate-fadeIn border border-blue-400">
          <Sparkles size={14} className="text-yellow-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navigation & Course Hero Bar */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          {onBack && (
            <button
              onClick={onBack}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 rounded-xl text-xs font-bold transition border border-slate-200 cursor-pointer self-start"
            >
              <ArrowLeft size={14} />
              <span>Back to My Courses</span>
            </button>
          )}

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-bold rounded-full uppercase tracking-wider border border-blue-200">
              {activeCourse.category}
            </span>
            <span className="text-xs text-slate-400 font-medium">• Dedicated Course Learning Path</span>
          </div>

          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            {activeCourse.title}
          </h1>
          <p className="text-xs text-slate-500">
            Assigned Trainer: <strong className="text-slate-800">{activeCourse.trainerName}</strong> • Course Completion: <strong className="text-blue-600">{computedProgress}%</strong> ({completedStepsCount} of 4 Steps Completed)
          </p>
        </div>

        {/* Right Status & Certificate Action */}
        <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
          {isAllStepsCompleted ? (
            <button
              onClick={() => setCertModalData({
                studentName: traineeProfile.fullName,
                courseTitle: activeCourse.title,
                issueDate: activeCourse.certificateApprovedDate || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '.'),
                trainerName: activeCourse.trainerName,
                credentialId: `CC-${Math.floor(100000 + Math.random() * 900000)}`
              })}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-bold transition shadow-md cursor-pointer animate-bounce"
            >
              <Award size={16} />
              <span>Claim & Print Official Certificate</span>
            </button>
          ) : (
            <div className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 flex items-center gap-2">
              <Clock size={14} className="text-amber-500" />
              <span>Complete all 4 steps to unlock your official certificate</span>
            </div>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4-ITEM STRATEGY ROADMAP (SlideModel PowerPoint Graphic)                   */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xl shadow-slate-100/60 relative overflow-hidden space-y-6">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-purple-600 via-rose-500 via-emerald-500 to-sky-500" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <Sparkles size={18} className="text-blue-600" />
              <span>Interactive Course Strategy Roadmap</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Submit assignments, watch lectures, and download handbooks. Once submitted, each step turns into a <strong className="text-emerald-600">green completed tick (✓)</strong>!
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-700">Roadmap Progress:</span>
            <div className="w-28 bg-slate-100 rounded-full h-2.5 overflow-hidden border border-slate-200">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-700"
                style={{ width: `${computedProgress}%` }}
              />
            </div>
            <span className="font-mono text-xs font-bold text-emerald-600">{computedProgress}%</span>
          </div>
        </div>

        {/* Stepped Asphalt Road with Center Dashed Markings */}
        <div className="relative pt-6 pb-2">
          <div className="hidden lg:block relative w-full h-36 mb-4">
            <svg
              viewBox="0 0 1000 140"
              className="w-full h-full overflow-visible select-none drop-shadow-md"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="asphaltRoadGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#24272D" />
                  <stop offset="100%" stopColor="#2B2E35" />
                </linearGradient>
              </defs>

              {/* Stepped Road Asphalt Body (Ascending Levels: Purple -> Red -> Green -> Blue) */}
              <path
                d="M 0,85 L 180,85 Q 215,85 235,68 L 265,68 L 430,68 Q 465,68 485,51 L 515,51 L 680,51 Q 715,51 735,34 L 765,34 L 1000,34 L 1000,68 L 765,68 Q 715,85 680,85 L 515,85 Q 465,102 430,102 L 265,102 Q 215,119 180,119 L 0,119 Z"
                fill="url(#asphaltRoadGrad)"
                stroke="#1C1E23"
                strokeWidth="2.5"
              />

              {/* White Dashed Center Lane Markings */}
              <path
                d="M 0,102 L 185,102 Q 215,102 235,85 L 435,85 Q 465,85 485,68 L 685,68 Q 715,68 735,51 L 1000,51"
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="3.2"
                strokeDasharray="14 10"
                strokeLinecap="round"
                opacity="0.95"
              />

              {/* Vertical Guide Lines from Map Pins down to Road Nodes */}
              <line x1="125" y1="28" x2="125" y2="102" stroke="#8B5CF6" strokeWidth="2.5" />
              <line x1="375" y1="22" x2="375" y2="85" stroke="#EF4444" strokeWidth="2.5" />
              <line x1="625" y1="16" x2="625" y2="68" stroke="#10B981" strokeWidth="2.5" />
              <line x1="875" y1="12" x2="875" y2="51" stroke="#0EA5E9" strokeWidth="2.5" />
            </svg>

            {/* Map Pins at the Top (Clickable) */}
            <div className="absolute top-0 left-0 right-0 grid grid-cols-4 pointer-events-auto">
              {fullSteps.map((step) => {
                const isSelected = activeStepIndex === step.stepIndex;
                const isDone = isStepCompleted(step.stepIndex);

                return (
                  <div key={step.stepIndex} className="flex flex-col items-center">
                    <button
                      onClick={() => setActiveStepIndex(step.stepIndex)}
                      className={`w-8 h-8 rounded-full flex items-center justify-center shadow-lg transition-transform duration-300 cursor-pointer ${
                        isSelected ? 'scale-125 ring-2 ring-white' : 'hover:scale-110'
                      }`}
                      style={{ backgroundColor: isDone ? '#10B981' : step.pinColor }}
                      title={`Click ${step.phaseLabel}`}
                    >
                      {isDone ? (
                        <Check size={16} className="text-white stroke-[3]" />
                      ) : (
                        <MapPin size={18} className="text-white fill-white" />
                      )}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Circular Road Nodes Positioned on Road Surface (Clickable with Completed Tick!) */}
            <div className="absolute top-0 left-0 right-0 bottom-0 grid grid-cols-4 pointer-events-auto">
              {fullSteps.map((step) => {
                const IconComponent = step.icon;
                const isSelected = activeStepIndex === step.stepIndex;
                const isDone = isStepCompleted(step.stepIndex);

                const topOffsets = ['top-[76px]', 'top-[59px]', 'top-[42px]', 'top-[25px]'];
                const topClass = topOffsets[step.stepIndex];

                return (
                  <div key={step.stepIndex} className="relative flex justify-center">
                    <button
                      onClick={() => setActiveStepIndex(step.stepIndex)}
                      className={`absolute ${topClass} w-13 h-13 rounded-full flex items-center justify-center border-4 border-white shadow-xl transition-all duration-300 cursor-pointer ${
                        isDone ? 'bg-emerald-600 ring-4 ring-emerald-200' : step.nodeBg
                      } ${
                        isSelected
                          ? 'scale-120 ring-4 ring-offset-2 ' + (isDone ? 'ring-emerald-400' : step.nodeRing) + ' animate-pulse'
                          : 'hover:scale-110 opacity-95 hover:opacity-100'
                      }`}
                      title={isDone ? `${step.phaseLabel} Completed ✓` : `Click to open ${step.phaseLabel}`}
                    >
                      {isDone ? (
                        <Check size={24} className="text-white stroke-[3.5] drop-shadow-xs" />
                      ) : (
                        <IconComponent size={22} className="text-white" />
                      )}
                    </button>

                    {/* Active Pointer Arrow down to workspace */}
                    {isSelected && (
                      <div className="absolute top-[138px] flex flex-col items-center">
                        <div className="w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-b-8 border-b-blue-600" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* 4 Segmented Column Cards Below the Road */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10 pt-2 lg:pt-0">
            {fullSteps.map((step) => {
              const IconComponent = step.icon;
              const isSelected = activeStepIndex === step.stepIndex;
              const isDone = isStepCompleted(step.stepIndex);

              return (
                <div
                  key={step.stepIndex}
                  onClick={() => setActiveStepIndex(step.stepIndex)}
                  className={`group rounded-2xl border transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer relative ${
                    isSelected
                      ? 'bg-white border-blue-600 ring-4 ring-blue-500/20 shadow-xl -translate-y-1'
                      : isDone
                        ? 'bg-emerald-50/20 border-emerald-300 shadow-2xs hover:shadow-md'
                        : 'bg-gradient-to-b from-slate-50/90 to-white border-slate-200 hover:border-slate-300 hover:shadow-md'
                  }`}
                >
                  {/* Mobile header */}
                  <div className="lg:hidden flex items-center justify-between p-4 pb-0">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold"
                        style={{ backgroundColor: isDone ? '#10B981' : step.pinColor }}
                      >
                        {isDone ? <Check size={14} className="stroke-[3]" /> : <MapPin size={14} className="fill-white" />}
                      </div>
                      <span className="text-xs font-bold text-slate-600 uppercase">
                        {step.phaseLabel}
                      </span>
                    </div>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${isDone ? 'bg-emerald-600' : step.nodeBg}`}>
                      {isDone ? <Check size={16} className="stroke-[3]" /> : <IconComponent size={16} />}
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400">
                          {step.phaseLabel}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 ${
                            isDone
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : isSelected
                                ? 'bg-blue-600 text-white'
                                : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {isDone && <Check size={11} className="stroke-[3]" />}
                          <span>{isDone ? 'Completed' : isSelected ? 'In Progress' : 'Upcoming'}</span>
                        </span>
                      </div>

                      <h3 className={`font-bold text-sm sm:text-base leading-snug transition ${isSelected ? 'text-blue-600' : isDone ? 'text-emerald-950' : 'text-slate-900 group-hover:text-blue-600'}`}>
                        {step.stageTitle}
                      </h3>

                      <p className="text-xs text-slate-500 mt-2 leading-relaxed line-clamp-3">
                        {step.defaultDesc}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold">
                      <span className={isDone ? 'text-emerald-600' : isSelected ? 'text-blue-600' : 'text-slate-500 group-hover:text-blue-600'}>
                        {isDone ? '✓ Step Finished' : isSelected ? '● Active Step' : 'Click to View'}
                      </span>
                      <ChevronRight size={14} className={isDone ? 'text-emerald-600' : isSelected ? 'text-blue-600' : 'text-slate-400'} />
                    </div>
                  </div>

                  {/* Colored Bottom Accent Bar */}
                  <div className={`h-2 w-full ${isDone ? 'bg-emerald-500' : step.bottomBarColor}`} />
                </div>
              );
            })}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* ALL-IN-ONE STEP WORKSPACE (Lecture, Handbook, Assignment All in One Place) */}
        {/* ========================================================================= */}
        <div
          id="all-in-one-step-workspace"
          className="rounded-3xl border-2 border-blue-600/40 bg-gradient-to-b from-blue-50/25 via-white to-slate-50/40 p-6 sm:p-8 shadow-xl space-y-6 relative"
        >
          {/* Active Step Workspace Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-200">
            <div className="flex items-start gap-3.5">
              <div className={`w-12 h-12 rounded-2xl text-white flex items-center justify-center shrink-0 shadow-md ${isCurrentStepDone ? 'bg-emerald-600' : activeStep.nodeBg}`}>
                {isCurrentStepDone ? <Check size={24} className="stroke-[3.5]" /> : <ActiveIcon size={24} />}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md ${isCurrentStepDone ? 'bg-emerald-100 text-emerald-800' : activeStep.badgeBg}`}>
                    {isCurrentStepDone ? '✓ Step Completed' : `${activeStep.phaseLabel} Active Learning Pack`}
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    Step {activeStep.stepNum} of 04
                  </span>
                </div>
                <h3 className="text-lg sm:text-2xl font-extrabold text-slate-900 mt-1">
                  {activeStep.stageTitle}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5 max-w-2xl">
                  Watch the lecture, download the handbook, and submit the assignment below to complete this milestone and advance on the roadmap!
                </p>
              </div>
            </div>

            {/* Step Navigation Controls */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                disabled={activeStepIndex === 0}
                onClick={() => setActiveStepIndex(Math.max(0, activeStepIndex - 1))}
                className="flex items-center gap-1 px-3 py-1.5 bg-white hover:bg-slate-100 disabled:opacity-40 text-slate-700 rounded-xl text-xs font-bold border border-slate-200 transition cursor-pointer"
              >
                <ChevronLeft size={14} />
                <span>Prev Step</span>
              </button>
              <button
                disabled={activeStepIndex === fullSteps.length - 1}
                onClick={() => setActiveStepIndex(Math.min(fullSteps.length - 1, activeStepIndex + 1))}
                className="flex items-center gap-1 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
              >
                <span>Next Step</span>
                <ChevronRight size={14} />
              </button>
            </div>
          </div>

          {/* STEP COMPLETION STATUS BAR */}
          <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs ${
            isCurrentStepDone
              ? 'bg-emerald-50 border-emerald-200 text-emerald-950 font-bold'
              : 'bg-blue-50/70 border-blue-200 text-blue-950'
          }`}>
            <div className="flex items-center gap-2">
              {isCurrentStepDone ? (
                <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
              ) : (
                <Sparkles size={18} className="text-blue-600 shrink-0" />
              )}
              <span>
                {isCurrentStepDone
                  ? `Milestone Complete! Road map node has been updated with the green completed checkmark (✓).`
                  : `Complete the lecture, handbook, and assignment below to earn your green checkmark tick on the roadmap.`}
              </span>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold ${isCurrentLectDone ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'}`}>
                {isCurrentLectDone ? '✓ Lecture Watched' : '○ Lecture Pending'}
              </span>
              <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold ${isCurrentHandDone ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'}`}>
                {isCurrentHandDone ? '✓ Handbook Downloaded' : '○ Handbook Pending'}
              </span>
              <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold ${isCurrentAssignDone ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'}`}>
                {isCurrentAssignDone ? '✓ Assignment Submitted' : '○ Assignment Pending'}
              </span>
            </div>
          </div>

          {/* 3 CORE PILLARS DISPLAYED ALL IN ONE PLACE */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            
            {/* PILLAR 1: VIDEO MASTERCLASS & SLIDE DECK */}
            <div className={`bg-white rounded-2xl p-5 border transition shadow-xs flex flex-col justify-between space-y-4 ${
              isCurrentLectDone ? 'border-emerald-300 ring-2 ring-emerald-500/10' : 'border-slate-200 hover:border-blue-400'
            }`}>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-bold rounded-md uppercase tracking-wider border border-blue-200 flex items-center gap-1.5">
                    <Video size={12} /> Video Lecture
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">
                    {activeStep.videoDuration}
                  </span>
                </div>

                {/* Video Simulated Thumbnail */}
                <div
                  onClick={() => {
                    markLectureDone(activeStepIndex);
                    setActiveVideoModal({
                      title: activeStep.videoTitle,
                      duration: activeStep.videoDuration,
                      trainerName: matchingTrainerVideo?.trainerName || activeCourse.trainerName,
                      stepTitle: activeStep.stageTitle,
                      stepIndex: activeStepIndex,
                      videoUrl: currentCourseVideoUrl,
                      isTrainerUploaded: Boolean(matchingTrainerVideo),
                      trainerMaterialTitle: matchingTrainerVideo?.title
                    });
                  }}
                  className="group/video relative h-36 rounded-xl overflow-hidden bg-slate-900 cursor-pointer border border-slate-800"
                >
                  <img
                    src={activeCourse.thumbnail || '/course-thumbnails/ai.jpg'}
                    alt={activeStep.stageTitle}
                    className="w-full h-full object-cover opacity-60 group-hover/video:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg group-hover/video:scale-110 transition-transform">
                      <PlayCircle size={28} className="fill-white/20" />
                    </div>
                  </div>
                  <div className="absolute bottom-2.5 left-3 right-3 text-white text-xs flex items-center justify-between">
                    <span className="font-semibold truncate">{matchingTrainerVideo?.trainerName || activeCourse.trainerName}</span>
                    <span className="bg-black/70 px-1.5 py-0.5 rounded text-[10px] font-mono">
                      {matchingTrainerVideo ? 'Trainer Upload' : '1080p HD'}
                    </span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <h4 className="font-bold text-sm text-slate-900 leading-snug">
                      {activeStep.videoTitle}
                    </h4>
                    {isCurrentLectDone && (
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded flex items-center gap-1 shrink-0">
                        <Check size={11} className="stroke-[3]" /> Watched
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Step-by-step masterclass demonstrating core architectural principles, implementation patterns, and lab debugging.
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2">
                <button
                  onClick={() => triggerToast(`Downloading Slides: ${activeCourse.title} - ${activeStep.phaseLabel}.pptx`)}
                  className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  <Download size={13} />
                  <span>Slides ({activeStep.slidesSize})</span>
                </button>

                <button
                  onClick={() => {
                    markLectureDone(activeStepIndex);
                    setActiveVideoModal({
                      title: activeStep.videoTitle,
                      duration: activeStep.videoDuration,
                      trainerName: matchingTrainerVideo?.trainerName || activeCourse.trainerName,
                      stepTitle: activeStep.stageTitle,
                      stepIndex: activeStepIndex,
                      videoUrl: currentCourseVideoUrl,
                      isTrainerUploaded: Boolean(matchingTrainerVideo),
                      trainerMaterialTitle: matchingTrainerVideo?.title
                    });
                  }}
                  className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
                >
                  <PlayCircle size={14} />
                  <span>{isCurrentLectDone ? 'Rewatch Lecture' : 'Watch Lecture'}</span>
                </button>
              </div>
            </div>

            {/* PILLAR 2: FACULTY HANDBOOK & CHEATSHEET (DOWNLOAD PDF) */}
            <div className={`bg-white rounded-2xl p-5 border transition shadow-xs flex flex-col justify-between space-y-4 ${
              isCurrentHandDone ? 'border-emerald-300 ring-2 ring-emerald-500/10' : 'border-slate-200 hover:border-emerald-400'
            }`}>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-md uppercase tracking-wider border border-emerald-200 flex items-center gap-1.5">
                    <BookOpen size={12} /> Faculty Handbook
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">
                    {activeStep.handbookPages.split('•')[0]}
                  </span>
                </div>

                {/* Handbook Preview Card */}
                <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-50/60 to-slate-50 border border-emerald-100 flex items-center gap-3">
                  <div className="w-12 h-14 rounded-lg bg-emerald-600 text-white flex flex-col items-center justify-center shadow-md shrink-0">
                    <FileText size={20} />
                    <span className="text-[9px] font-mono font-bold mt-0.5 uppercase">PDF</span>
                  </div>
                  <div>
                    <h5 className="font-bold text-xs sm:text-sm text-slate-900 leading-tight">
                      {activeStep.handbookTitle}
                    </h5>
                    <span className="text-[11px] text-emerald-800 font-semibold block mt-0.5">
                      Compiled by {activeCourse.trainerName}
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      {activeStep.handbookPages}
                    </span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <h4 className="font-bold text-sm text-slate-900">
                      Comprehensive Reference Handbook & Cheatsheet
                    </h4>
                    {isCurrentHandDone && (
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded flex items-center gap-1 shrink-0">
                        <Check size={11} className="stroke-[3]" /> Downloaded
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Mathematical proofs, architecture diagrams, formulas, code skeletons, and reference manuals compiled specifically for this milestone.
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2">
                <button
                  onClick={() => triggerToast(`Opening Starter Code Repository for ${activeStep.phaseLabel}...`)}
                  className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  <Code size={13} />
                  <span>Code Repo</span>
                </button>

                <button
                  onClick={() => {
                    markHandbookDone(activeStepIndex);
                    triggerToast(`Downloading Handbook: ${activeStep.handbookTitle}`);
                  }}
                  className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
                >
                  <Download size={14} />
                  <span>Download PDF</span>
                </button>
              </div>
            </div>

            {/* PILLAR 3: STEP ASSIGNMENT & LAB EVALUATION */}
            {(() => {
              const currentScore = stepAssignmentScores[`step_${activeStepIndex}`];
              return (
                <div className={`bg-white rounded-2xl p-5 border transition shadow-xs flex flex-col justify-between space-y-4 ${
                  isCurrentAssignDone ? 'border-emerald-300 ring-2 ring-emerald-500/10' : 'border-slate-200 hover:border-amber-400'
                }`}>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 bg-amber-50 text-amber-800 text-[10px] font-bold rounded-md uppercase tracking-wider border border-amber-200 flex items-center gap-1.5">
                        <FileCheck size={12} /> {activeStep.phaseLabel} AI Assignment
                      </span>
                      <span className="text-[11px] font-mono text-slate-500 font-semibold">
                        Due: {activeStep.assignmentDueDate}
                      </span>
                    </div>

                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <h4 className="font-bold text-sm text-slate-900 leading-snug">
                          {activeStep.assignmentTitle}
                        </h4>
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[10px] font-bold shrink-0">
                          10 Questions • 10 Marks
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        10 AI-generated multiple-choice questions assessing core concepts, edge cases, and architectures. Instant grading with complete rationales upon submission.
                      </p>
                    </div>

                    {/* Submission / Marks Status Box */}
                    <div className={`p-3.5 rounded-xl border flex items-center justify-between text-xs ${
                      currentScore || isCurrentAssignDone
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-950 font-semibold'
                        : 'bg-amber-50/50 border-amber-200 text-amber-900'
                    }`}>
                      <div className="flex items-center gap-2">
                        {currentScore || isCurrentAssignDone ? (
                          <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                        ) : (
                          <Clock size={16} className="text-amber-600 shrink-0" />
                        )}
                        <span>
                          {currentScore
                            ? `Score: ${currentScore.score} / ${currentScore.totalQuestions} Marks (${currentScore.percentage}%) ✓`
                            : isCurrentAssignDone
                              ? 'Assessment Submitted ✓'
                              : 'Pending Assessment'}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {currentScore ? 'Graded with explanations' : '10 AI Questions'}
                      </span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-end">
                    <button
                      onClick={() => openAssignmentModal(activeStepIndex)}
                      className="w-full flex items-center justify-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
                    >
                      <Sparkles size={14} />
                      <span>
                        {currentScore 
                          ? `Review Solutions (Score: ${currentScore.score}/${currentScore.totalQuestions})` 
                          : isCurrentAssignDone 
                            ? 'Review Assignment' 
                            : 'Start AI Assignment (10 Questions)'}
                      </span>
                    </button>
                  </div>
                </div>
              );
            })()}

          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: VIDEO MASTERCLASS PLAYER (YOUTUBE EMBED STREAMING)                */}
      {/* ========================================================================= */}
      {activeVideoModal && (() => {
        const embedUrl = getYouTubeEmbedUrl(activeVideoModal.videoUrl);

        return (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 text-white rounded-3xl max-w-3xl w-full border border-slate-700 shadow-2xl overflow-hidden animate-scaleUp">
              <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                    <PlayCircle size={18} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm sm:text-base text-white">{activeVideoModal.title}</h4>
                    <span className="text-xs text-slate-400">Instructor: {activeVideoModal.trainerName} • {activeVideoModal.duration}</span>
                  </div>
                </div>
                <button
                  onClick={() => setActiveVideoModal(null)}
                  className="text-slate-400 hover:text-white p-1 cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Trainer Video Indicator */}
              {activeVideoModal.isTrainerUploaded ? (
                <div className="px-5 py-2.5 bg-blue-950/80 border-b border-blue-800/60 flex items-center justify-between text-xs text-blue-200">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="font-semibold text-white">Trainer Masterclass Stream:</span>
                    <span className="truncate max-w-xs sm:max-w-sm text-blue-100">{activeVideoModal.trainerMaterialTitle}</span>
                  </div>
                  <span className="px-2 py-0.5 bg-blue-600 text-white text-[10px] font-bold rounded">Live YouTube Feed</span>
                </div>
              ) : (
                <div className="px-5 py-2 bg-slate-800/80 border-b border-slate-700/60 flex items-center justify-between text-xs text-slate-300">
                  <span className="text-[11px]">Official Course Masterclass Video</span>
                  <span className="px-2 py-0.5 bg-slate-700 text-slate-300 text-[10px] font-bold rounded">1080p HD</span>
                </div>
              )}

              {/* Video Player Display (YouTube iframe or fallback) */}
              <div className="relative aspect-video bg-black flex items-center justify-center">
                {embedUrl ? (
                  <iframe
                    src={embedUrl}
                    title={activeVideoModal.title}
                    className="w-full h-full border-0 aspect-video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                ) : (
                  <div className="relative w-full h-full flex items-center justify-center">
                    <img
                      src={activeCourse.thumbnail || '/course-thumbnails/ai.jpg'}
                      alt={activeVideoModal.title}
                      className="w-full h-full object-cover opacity-40"
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center space-y-3">
                      <div
                        onClick={() => {
                          markLectureDone(activeVideoModal.stepIndex);
                          triggerToast('Lecture marked as watched!');
                        }}
                        className="w-16 h-16 rounded-full bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center shadow-2xl transition cursor-pointer"
                      >
                        <PlayCircle size={38} className="fill-white/30" />
                      </div>
                      <p className="text-xs text-slate-300 max-w-md">
                        Streaming masterclass lecture with trainer demonstrations and architectural code walk.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-4 bg-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-400">Includes curriculum slides & lab blueprints</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => triggerToast('Slide deck downloaded successfully!')}
                    className="px-3.5 py-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-bold transition cursor-pointer flex items-center gap-1.5"
                  >
                    <Download size={13} />
                    <span>Download Slides</span>
                  </button>
                  <button
                    onClick={() => {
                      markLectureDone(activeVideoModal.stepIndex);
                      setActiveVideoModal(null);
                    }}
                    className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition cursor-pointer"
                  >
                    Close & Mark Watched
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ========================================================================= */}
      {/* MODAL 2: INTERACTIVE 10-QUESTION AI ASSIGNMENT MODAL                     */}
      {/* ========================================================================= */}
      {activeAssignmentStep !== null && (() => {
        const questions = getCourseAssignmentQuestions(activeCourse.id, activeCourse.title);
        const answeredCount = Object.keys(currentQuizAnswers).length;
        const currentScore = stepAssignmentScores[`step_${activeAssignmentStep}`];

        return (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
            <div className="bg-white rounded-3xl max-w-3xl w-full border border-slate-200 shadow-2xl flex flex-col max-h-[92vh] overflow-hidden animate-scaleUp my-auto">
              
              {/* Modal Header */}
              <div className="p-5 sm:p-6 bg-slate-50 border-b border-slate-200 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md font-bold shrink-0">
                    <Sparkles size={20} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 uppercase tracking-wider">
                        {fullSteps[activeAssignmentStep].phaseLabel} Assessment
                      </span>
                      <span className="text-xs text-slate-400 font-mono">10 AI-Generated Questions</span>
                    </div>
                    <h3 className="font-extrabold text-base sm:text-lg text-slate-900 leading-tight mt-0.5">
                      {fullSteps[activeAssignmentStep].assignmentTitle}
                    </h3>
                  </div>
                </div>

                <button
                  onClick={() => setActiveAssignmentStep(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl transition cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Score Banner (when submitted) */}
              {isQuizSubmitted && currentScore && (
                <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 border-b border-emerald-200 shrink-0">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-extrabold text-lg shadow-md shrink-0">
                        {currentScore.score}/10
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-extrabold text-slate-900 text-sm sm:text-base">
                            Assessment Graded: {currentScore.score} / {currentScore.totalQuestions} Marks ({currentScore.percentage}%)
                          </h4>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            currentScore.percentage >= 60 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {currentScore.percentage >= 60 ? 'Passed ✓' : 'Needs Review'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-0.5">
                          {currentScore.percentage >= 60
                            ? 'Great job! You have demonstrated proficiency and unlocked this roadmap milestone.'
                            : 'Review the technical explanations below and retake whenever you are ready.'}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={handleRetakeQuiz}
                      className="flex items-center justify-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold border border-slate-300 transition cursor-pointer shadow-2xs shrink-0 self-start sm:self-auto"
                    >
                      <RotateCcw size={13} />
                      <span>Retake Assessment</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Progress counter when in-progress */}
              {!isQuizSubmitted && (
                <div className="px-6 py-2.5 bg-blue-50/60 border-b border-blue-100 flex items-center justify-between text-xs text-blue-900 shrink-0">
                  <span className="font-medium">
                    Answer all 10 questions to submit your assignment:
                  </span>
                  <span className="font-mono font-bold text-blue-700">
                    {answeredCount} of 10 Answered
                  </span>
                </div>
              )}

              {/* Questions List (Scrollable) */}
              <div className="p-5 sm:p-6 space-y-6 overflow-y-auto flex-1">
                {questions.map((q, qIdx) => {
                  const userChoice = currentQuizAnswers[qIdx];
                  const isAnswered = userChoice !== undefined;
                  const isCorrect = userChoice === q.correctOptionIndex;

                  return (
                    <div
                      key={q.id}
                      className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                        isQuizSubmitted
                          ? isCorrect
                            ? 'bg-emerald-50/30 border-emerald-300 ring-1 ring-emerald-400/20'
                            : 'bg-rose-50/30 border-rose-300 ring-1 ring-rose-400/20'
                          : isAnswered
                            ? 'bg-white border-blue-300 shadow-2xs'
                            : 'bg-white border-slate-200'
                      }`}
                    >
                      {/* Question Header */}
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-start gap-2.5">
                          <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-700 font-bold font-mono text-xs flex items-center justify-center shrink-0 mt-0.5">
                            {qIdx + 1}
                          </span>
                          <h4 className="font-bold text-sm sm:text-base text-slate-900 leading-snug">
                            {q.question}
                          </h4>
                        </div>

                        {/* Result Badge */}
                        {isQuizSubmitted && (
                          <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full shrink-0 flex items-center gap-1 ${
                            isCorrect ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-rose-100 text-rose-800 border border-rose-300'
                          }`}>
                            {isCorrect ? (
                              <>
                                <Check size={12} className="stroke-[3]" />
                                <span>Correct (+1 Mark)</span>
                              </>
                            ) : (
                              <>
                                <X size={12} className="stroke-[3]" />
                                <span>Incorrect (0 Marks)</span>
                              </>
                            )}
                          </span>
                        )}
                      </div>

                      {/* 4 Multiple Choice Options */}
                      <div className="grid grid-cols-1 gap-2 sm:gap-2.5 pl-0 sm:pl-8">
                        {q.options.map((option, optIdx) => {
                          const isOptionSelected = userChoice === optIdx;
                          const isThisCorrect = optIdx === q.correctOptionIndex;

                          let optionStyles = 'border-slate-200 bg-slate-50/60 hover:bg-slate-100 text-slate-800';

                          if (isQuizSubmitted) {
                            if (isThisCorrect) {
                              optionStyles = 'border-emerald-400 bg-emerald-100/70 text-emerald-950 font-semibold ring-2 ring-emerald-500/20';
                            } else if (isOptionSelected && !isCorrect) {
                              optionStyles = 'border-rose-400 bg-rose-100/70 text-rose-950 line-through';
                            } else {
                              optionStyles = 'border-slate-200 bg-slate-50/40 text-slate-500 opacity-70';
                            }
                          } else if (isOptionSelected) {
                            optionStyles = 'border-blue-600 bg-blue-50 text-blue-950 font-semibold ring-2 ring-blue-500/20';
                          }

                          return (
                            <button
                              key={optIdx}
                              type="button"
                              disabled={isQuizSubmitted}
                              onClick={() => handleSelectOption(qIdx, optIdx)}
                              className={`w-full text-left p-3 rounded-xl border text-xs sm:text-sm flex items-center justify-between transition cursor-pointer ${optionStyles}`}
                            >
                              <div className="flex items-center gap-2.5">
                                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold font-mono shrink-0 border ${
                                  isQuizSubmitted && isThisCorrect
                                    ? 'bg-emerald-600 text-white border-emerald-600'
                                    : isOptionSelected
                                      ? 'bg-blue-600 text-white border-blue-600'
                                      : 'bg-white text-slate-600 border-slate-300'
                                }`}>
                                  {String.fromCharCode(65 + optIdx)}
                                </span>
                                <span>{option}</span>
                              </div>

                              {isQuizSubmitted && isThisCorrect && (
                                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-200/80 px-2 py-0.5 rounded uppercase tracking-wider shrink-0">
                                  ✓ Correct Answer
                                </span>
                              )}
                              {isQuizSubmitted && isOptionSelected && !isThisCorrect && (
                                <span className="text-[10px] font-bold text-rose-800 bg-rose-200/80 px-2 py-0.5 rounded uppercase tracking-wider shrink-0">
                                  Your Choice
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {/* Technical Explanation when submitted */}
                      {isQuizSubmitted && (
                        <div className="mt-3.5 sm:ml-8 p-3.5 rounded-xl bg-blue-50/70 border border-blue-200/80 text-xs text-blue-950 space-y-1">
                          <div className="flex items-center gap-1.5 font-bold text-blue-900">
                            <Sparkles size={13} className="text-blue-600" />
                            <span>Technical Explanation & Rationale:</span>
                          </div>
                          <p className="leading-relaxed text-slate-700">
                            {q.explanation}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Modal Footer Controls */}
              <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
                <div className="text-xs text-slate-500 text-center sm:text-left">
                  {isQuizSubmitted ? (
                    <span>
                      Milestone marked completed. Road map updated with green tick (✓).
                    </span>
                  ) : (
                    <span>
                      {answeredCount === 10
                        ? 'All 10 questions answered! Ready to submit.'
                        : `Please answer all 10 questions (${10 - answeredCount} remaining)`}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2.5 w-full sm:w-auto">
                  <button
                    onClick={() => setActiveAssignmentStep(null)}
                    className="flex-1 sm:flex-initial px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer"
                  >
                    {isQuizSubmitted ? 'Back to Roadmap' : 'Cancel'}
                  </button>

                  {!isQuizSubmitted ? (
                    <button
                      onClick={() => handleQuizSubmit(questions)}
                      disabled={answeredCount === 0}
                      className="flex-1 sm:flex-initial px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle2 size={14} />
                      <span>Submit Assignment & Reveal Marks</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => setActiveAssignmentStep(null)}
                      className="flex-1 sm:flex-initial px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
                    >
                      Done & Save
                    </button>
                  )}
                </div>
              </div>

            </div>
          </div>
        );
      })()}

      {/* ========================================================================= */}
      {/* MODAL 3: VERIFIED CERTIFICATE VIEWER & PRINTER                            */}
      {/* ========================================================================= */}
      {certModalData && (
        <CourseCertificateModal
          isOpen={true}
          onClose={() => setCertModalData(null)}
          studentName={certModalData.studentName}
          courseTitle={certModalData.courseTitle}
          issueDate={certModalData.issueDate}
          trainerName={certModalData.trainerName}
          credentialId={certModalData.credentialId}
        />
      )}
    </div>
  );
};
