import {
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
  UserRole,
  PortfolioItem,
  TrainerWishlistItem,
  CourseFeedback,
  PlatformCourse,
  StudentProfileSummary
} from './types';

// --- INITIAL SEED DATA ---
export const INITIAL_TRAINEE_PROFILE: TraineeProfile = {
  id: 'trn_101',
  fullName: 'Bhavya Shree D',
  title: 'Cloud & AI Associate Engineer',
  email: 'bhavya.shree@capacityconnect.org',
  phone: '+91 98450 12345',
  location: 'Bengaluru, India',
  bio: 'Passionate software engineer focused on cloud infrastructure, container orchestration, and practical enterprise LLM applications. Constantly upskilling and sharing ideations.',
  avatar: '',
  qualifications: [
    {
      id: 'q1',
      degree: 'Bachelor of Engineering (Computer Science)',
      institution: 'Visvesvaraya Technological University',
      fieldOfStudy: 'Computer Science & Engineering',
      startYear: 2020,
      endYear: 2024,
      gradeOrGpa: '8.9 CGPA'
    },
    {
      id: 'q2',
      degree: 'Post-Graduate Diploma in Cloud Computing & DevOps',
      institution: 'National Capacity Development Institute',
      fieldOfStudy: 'Cloud Architecture & Microservices',
      startYear: 2024,
      endYear: 2025,
      gradeOrGpa: '9.2 CGPA'
    }
  ],
  workExperience: [
    {
      id: 'w1',
      title: 'Cloud Trainee Engineer',
      company: 'HCL Technologies / Capacity Connect Cohort',
      location: 'Bengaluru',
      startDate: 'Jul 2024',
      endDate: 'Present',
      current: true,
      description: 'Developing automated CI/CD deployment pipelines on AWS and GCP. Participating in containerized microservices architecture design.'
    },
    {
      id: 'w2',
      title: 'Systems Development Intern',
      company: 'Innovatech Solutions',
      location: 'Hyderabad',
      startDate: 'Jan 2024',
      endDate: 'Jun 2024',
      current: false,
      description: 'Assisted in building RESTful microservices in Python FastAPI and integrating PostgreSQL databases with redis caching.'
    }
  ],
  resume: {
    fileName: 'Bhavya_Shree_DevOps_Cloud_Resume.pdf',
    fileSize: '1.4 MB',
    uploadDate: '2026-09-18',
    fileUrl: '#',
    atsScore: 92,
    summary: 'Cloud & DevOps specialist skilled in Kubernetes, Terraform, Python, Docker, and CI/CD pipelines with strong problem-solving abilities.',
    parsedSkills: ['Kubernetes', 'Docker', 'Terraform', 'AWS ECS', 'FastAPI', 'PostgreSQL', 'Python', 'TypeScript', 'CI/CD']
  },
  interests: [
    'Cloud-Native Architecture',
    'Generative AI & Agentic Workflows',
    'Enterprise Kubernetes',
    'Site Reliability Engineering (SRE)',
    'Zero-Trust Cybersecurity'
  ],
  skills: [
    { id: 's1', name: 'Docker & Kubernetes', level: 'Expert', category: 'Cloud & Infrastructure' },
    { id: 's2', name: 'Python & FastAPI', level: 'Advanced', category: 'Backend Development' },
    { id: 's3', name: 'React & TypeScript', level: 'Advanced', category: 'Frontend Development' },
    { id: 's4', name: 'AWS Cloud (EC2, S3, IAM)', level: 'Advanced', category: 'Cloud & Infrastructure' },
    { id: 's5', name: 'Terraform IaC', level: 'Intermediate', category: 'DevOps' },
    { id: 's6', name: 'CI/CD (GitHub Actions)', level: 'Advanced', category: 'DevOps' },
    { id: 's7', name: 'System Design & Distributed Data', level: 'Intermediate', category: 'Architecture' }
  ],
  certificates: [
    {
      id: 'c1',
      title: 'AWS Certified Solutions Architect - Associate',
      issuer: 'Amazon Web Services',
      issueDate: 'Aug 2025',
      credentialId: 'AWS-CSA-8902143',
      verificationStatus: 'Verified',
      badgeUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=100&auto=format&fit=crop&q=80'
    },
    {
      id: 'c2',
      title: 'Certified Kubernetes Administrator (CKA)',
      issuer: 'Cloud Native Computing Foundation (CNCF)',
      issueDate: 'Jan 2026',
      credentialId: 'CKA-908231',
      verificationStatus: 'Verified',
      badgeUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80'
    },
    {
      id: 'c3',
      title: 'Capacity Connect Enterprise Foundations Certificate',
      issuer: 'Capacity Connect Academy',
      issueDate: 'Sep 2026',
      credentialId: 'CC-ENT-2026-44',
      verificationStatus: 'Verified',
      badgeUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=100&auto=format&fit=crop&q=80'
    }
  ],
  enrolledCourses: [
    {
      id: 'crs_1',
      title: 'Enterprise Cloud Architecture & SRE',
      category: 'Cloud Engineering',
      trainerName: 'Dr. Rajesh Raman',
      progress: 78,
      totalModules: 12,
      completedModules: 9,
      enrolledDate: '2026-08-10',
      lastActive: 'Today',
      thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&auto=format&fit=crop&q=80',
      rating: 5
    },
    {
      id: 'crs_2',
      title: 'Advanced AI Microservices with FastAPI & PyTorch',
      category: 'AI & Backend',
      trainerName: 'Priya Sundaram',
      progress: 55,
      totalModules: 10,
      completedModules: 5,
      enrolledDate: '2026-08-25',
      lastActive: 'Yesterday',
      thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&auto=format&fit=crop&q=80',
      rating: 4.8
    },
    {
      id: 'crs_3',
      title: 'Security Compliance & Zero Trust Architectures',
      category: 'Cybersecurity',
      trainerName: 'Col. Amit Verma',
      progress: 25,
      totalModules: 8,
      completedModules: 2,
      enrolledDate: '2026-09-05',
      lastActive: '3 days ago',
      thumbnail: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400&auto=format&fit=crop&q=80',
      rating: 4.9
    }
  ],
  mcqsAttempted: [
    {
      id: 'mcq_att_1',
      questionnaireId: 'qnr_1',
      title: 'Kubernetes Pod Networking & Ingress Controllers',
      subject: 'Cloud Engineering',
      trainerName: 'Dr. Rajesh Raman',
      score: 18,
      totalMarks: 20,
      percentage: 90,
      passed: true,
      attemptDate: '2026-09-20',
      timeSpentMinutes: 18
    },
    {
      id: 'mcq_att_2',
      questionnaireId: 'qnr_2',
      title: 'Asynchronous Python & Distributed Task Queues',
      subject: 'AI & Backend',
      trainerName: 'Priya Sundaram',
      score: 23,
      totalMarks: 25,
      percentage: 92,
      passed: true,
      attemptDate: '2026-09-24',
      timeSpentMinutes: 22
    },
    {
      id: 'mcq_att_3',
      questionnaireId: 'qnr_3',
      title: 'Zero Trust Authentication & JWT Security Assessment',
      subject: 'Cybersecurity',
      trainerName: 'Col. Amit Verma',
      score: 14,
      totalMarks: 20,
      percentage: 70,
      passed: true,
      attemptDate: '2026-09-27',
      timeSpentMinutes: 15
    }
  ],
  feedbacks: [
    {
      id: 'fb_1',
      courseId: 'crs_1',
      courseTitle: 'Enterprise Cloud Architecture & SRE',
      trainerName: 'Dr. Rajesh Raman',
      rating: 5,
      feedbackDate: '2026-09-22',
      comment: 'Superb explanation of real-world Kubernetes failovers and service meshes. The hands-on labs were top notch!',
      contentQuality: 5,
      trainerClarity: 5
    },
    {
      id: 'fb_2',
      courseId: 'crs_2',
      courseTitle: 'Advanced AI Microservices with FastAPI & PyTorch',
      trainerName: 'Priya Sundaram',
      rating: 5,
      feedbackDate: '2026-09-26',
      comment: 'Very practical session on streaming LLM responses and caching embeddings with redis. Highly recommended.',
      contentQuality: 5,
      trainerClarity: 5
    }
  ],
  portfolio: [
    {
      id: 'pf_1',
      title: 'Resilient Multi-Region Cloud Failover Engine',
      tagline: 'Automated DNS and traffic rerouting system built for 99.999% uptime',
      category: 'Cloud Arch',
      description: 'An open-source infrastructure blueprint simulating automated multi-region traffic migration when health checks fail, utilizing Route53 and Envoy Proxies.',
      problemStatement: 'Distributed cloud services frequently encounter unannounced AZ outages, causing cascading downtime for end users.',
      solution: 'Constructed an automated telemetry listener that triggers dynamic weighted routing with sub-second failover latency.',
      techStack: ['Terraform', 'AWS Route53', 'Envoy Proxy', 'Go', 'Docker'],
      liveDemoUrl: 'https://demo.failover-engine.dev',
      githubUrl: 'https://github.com/bhavyashree/cloud-failover-blueprint',
      likes: 42,
      status: 'Published',
      createdDate: '2026-08-15'
    },
    {
      id: 'pf_2',
      title: 'Enterprise Skill & Competency AI Graph',
      tagline: 'Vector-indexed mapping of employee skills against organizational demand',
      category: 'AI Prototype',
      description: 'Ideation prototype exploring semantic embeddings of engineer resumes matching against corporate project skill requisites.',
      problemStatement: 'Organizational talent allocation is manual, subjective, and prone to severe mismatch in tech stacks.',
      solution: 'Vectorized skills taxonomy with cosine similarity score and automatic learning pathway recommendation.',
      techStack: ['Python', 'FastAPI', 'ChromaDB', 'SentenceTransformers', 'React'],
      liveDemoUrl: 'https://demo.skill-graph.internal',
      githubUrl: 'https://github.com/bhavyashree/competency-ai-matcher',
      likes: 67,
      status: 'Featured',
      createdDate: '2026-09-02'
    }
  ],
  wishlistTrainers: [
    {
      trainerId: 'tr_1',
      trainerName: 'Dr. Rajesh Raman',
      title: 'Principal Cloud Architect & Distinguished Trainer',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      domain: 'Cloud Architecture & Distributed Systems',
      rating: 4.95,
      availableHours: '6 hrs/week',
      addedDate: '2026-09-12',
      notes: 'Want 1-on-1 guidance on multi-cloud Kubernetes federation and service mesh tuning.',
      mentorshipStatus: 'Session Scheduled'
    },
    {
      trainerId: 'tr_3',
      trainerName: 'Vikramaditya Rao',
      title: 'Head of Enterprise Data Engineering',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      domain: 'Big Data, Spark & Real-time Kafka',
      rating: 4.88,
      availableHours: '4 hrs/week',
      addedDate: '2026-09-25',
      notes: 'Planning to transition into streaming analytics; need mentorship on event-driven architectures.',
      mentorshipStatus: 'Wishlisted'
    }
  ]
};

export const createDefaultTraineeProfile = (
  fullName: string,
  email: string,
  studentData?: any
): TraineeProfile => ({
  id: `trn_${Date.now()}`,
  fullName: fullName || 'Candidate',
  title: studentData?.degree ? `${studentData.degree} Candidate` : 'Trainee',
  email: email || '',
  phone: '',
  location: '',
  bio: '',
  avatar: '',
  qualifications: studentData?.degree
    ? [
        {
          id: `q_${Date.now()}`,
          degree: studentData.degree,
          institution: studentData.institution || 'University / Institution',
          fieldOfStudy: studentData.fieldOfStudy || studentData.degree,
          startYear: new Date().getFullYear() - 1,
          endYear: new Date().getFullYear() + 3,
          gradeOrGpa: ''
        }
      ]
    : [],
  workExperience: [],
  resume: undefined,
  interests: studentData?.interests && studentData.interests.length > 0 ? studentData.interests : [],
  skills: studentData?.skills && studentData.skills.length > 0
    ? studentData.skills.map((s: string, idx: number) => ({
        id: `s_${Date.now()}_${idx}`,
        name: s,
        level: 'Intermediate',
        category: 'Core Competency'
      }))
    : [],
  certificates: [],
  enrolledCourses: [],
  mcqsAttempted: [],
  feedbacks: [],
  portfolio: [],
  wishlistTrainers: []
});

// --- INITIAL TRAINER PROFILE ---
export const INITIAL_TRAINER_PROFILE: TrainerProfile = {
  id: 'tr_1',
  fullName: 'Dr. Rajesh Raman',
  title: 'Principal Cloud Architect & Senior Corporate Trainer',
  organization: 'Capacity Connect Global Academy',
  email: 'rajesh.raman@capacityconnect.org',
  avatar: '',
  bio: 'Over 16 years leading distributed systems engineering and delivering corporate capacity building programs across Fortune 500 tech teams. Author of 3 cloud computing books.',
  specialization: [
    'Cloud Architecture (AWS/GCP/Azure)',
    'Kubernetes & Container Orchestration',
    'Site Reliability Engineering & DevOps',
    'Microservices & Distributed Systems'
  ],
  competencies: [
    'Cloud Computing',
    'DevOps & CI/CD',
    'Distributed Systems',
    'Container Security'
  ],
  yearsOfExperience: 16,
  hourlyCapacityHoursPerWeek: 12,
  rating: 4.95,
  totalStudentsMentored: 3420,
  certifications: [
    'AWS Certified Solutions Architect Professional',
    'Google Cloud Certified Professional Cloud Architect',
    'Certified Kubernetes Security Specialist (CKS)',
    'HashiCorp Certified Terraform Associate'
  ],
  availability: 'Available'
};

// --- INITIAL QUESTIONNAIRES ---
export const INITIAL_QUESTIONNAIRES: Questionnaire[] = [
  {
    id: 'qnr_1',
    title: 'Cloud Infrastructure & Kubernetes Mastery Assessment',
    subject: 'Cloud Computing',
    trainerId: 'tr_1',
    trainerName: 'Dr. Rajesh Raman',
    description: 'Comprehensive multiple-choice assessment covering Kubernetes networking, ingress routing, stateful sets, and cluster security hardening.',
    deadline: '2026-10-15T23:59',
    durationMinutes: 30,
    passingPercentage: 70,
    totalMarks: 20,
    totalAttempts: 142,
    status: 'Active',
    createdAt: '2026-09-10',
    questions: [
      {
        id: 'q1',
        questionText: 'Which Kubernetes controller is best suited for workloads that require stable, persistent network identifiers and ordered deployment?',
        options: ['Deployment', 'StatefulSet', 'DaemonSet', 'ReplicaSet'],
        correctOptionIndex: 1,
        explanation: 'StatefulSet manages the deployment and scaling of a set of Pods, providing guarantees about ordering and uniqueness.',
        marks: 5
      },
      {
        id: 'q2',
        questionText: 'In Kubernetes networking, what does the CNI (Container Network Interface) plugin primarily configure?',
        options: ['Docker daemon storage engine', 'Pod IP address allocation and routing across nodes', 'Host firewall rules exclusively', 'Kube-apiserver TLS termination'],
        correctOptionIndex: 1,
        explanation: 'CNI plugins allocate unique IP addresses to each Pod and manage inter-pod network communications across the cluster.',
        marks: 5
      },
      {
        id: 'q3',
        questionText: 'What happens when a Pod exceeds its specified memory limit?',
        options: ['The Pod CPU is throttled', 'The Pod is evicted and terminated with OOMKilled status', 'The Pod memory is automatically doubled', 'The kernel writes memory to host swap'],
        correctOptionIndex: 1,
        explanation: 'When a container exceeds its memory limit, the Linux kernel OOM (Out Of Memory) killer terminates the process.',
        marks: 5
      },
      {
        id: 'q4',
        questionText: 'Which tool is industry standard for declarative infrastructure-as-code provisioning across multi-cloud environments?',
        options: ['Terraform', 'Puppet', 'Vagrant', 'Ansible exclusively'],
        correctOptionIndex: 0,
        explanation: 'HashiCorp Terraform enables immutable declarative infrastructure as code across AWS, Azure, GCP, and Kubernetes.',
        marks: 5
      }
    ]
  },
  {
    id: 'qnr_2',
    title: 'Modern Microservices & API Design Evaluation',
    subject: 'Backend Microservices',
    trainerId: 'tr_2',
    trainerName: 'Priya Sundaram',
    description: 'Test on idempotency, rate limiting, token authentication, and event sourcing in distributed backends.',
    deadline: '2026-10-20T23:59',
    durationMinutes: 25,
    passingPercentage: 75,
    totalMarks: 20,
    totalAttempts: 98,
    status: 'Active',
    createdAt: '2026-09-15',
    questions: [
      {
        id: 'qm1',
        questionText: 'Which HTTP method should naturally be idempotent according to RFC 7231 standards?',
        options: ['POST', 'PUT', 'PATCH without condition', 'CONNECT'],
        correctOptionIndex: 1,
        explanation: 'PUT is idempotent, meaning multiple identical requests should produce the exact same outcome on the resource state.',
        marks: 5
      },
      {
        id: 'qm2',
        questionText: 'What is the primary role of a Circuit Breaker pattern in microservice communications?',
        options: ['Encrypt network packets', 'Prevent cascading failures when an upstream service becomes degraded or unresponsive', 'Load balance DNS queries', 'Compress HTTP payloads'],
        correctOptionIndex: 1,
        explanation: 'Circuit breakers fail fast when a downstream dependency is unhealthy, preventing thread pool exhaustion across callers.',
        marks: 5
      },
      {
        id: 'qm3',
        questionText: 'Which format is commonly used by gRPC for high performance, binary serialized transport?',
        options: ['Protocol Buffers (Protobuf)', 'JSON schema', 'BSON', 'MessagePack'],
        correctOptionIndex: 0,
        explanation: 'gRPC relies on Protocol Buffers for fast, typed binary serialization and bidirectional HTTP/2 streaming.',
        marks: 5
      },
      {
        id: 'qm4',
        questionText: 'In JWT (JSON Web Token), which part contains the cryptographic signature that validates token authenticity?',
        options: ['Header', 'Payload', 'Third segment after second dot', 'Bearer prefix'],
        correctOptionIndex: 2,
        explanation: 'A JWT is structured as header.payload.signature. The signature verifies the token was not altered in transit.',
        marks: 5
      }
    ]
  }
];

// --- INITIAL TRAINEE PARTICIPATION RECORDS ---
export const INITIAL_TRAINEE_PARTICIPATION: TraineeParticipationRecord[] = [
  {
    id: 'part_1',
    questionnaireId: 'qnr_1',
    questionnaireTitle: 'Cloud Infrastructure & Kubernetes Mastery Assessment',
    traineeId: 'trn_101',
    traineeName: 'Bhavya Shree D',
    traineeAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    submittedAt: '2026-09-20 14:32',
    score: 18,
    totalMarks: 20,
    percentage: 90,
    passed: true,
    status: 'Completed',
    timeSpentMinutes: 18
  },
  {
    id: 'part_2',
    questionnaireId: 'qnr_1',
    questionnaireTitle: 'Cloud Infrastructure & Kubernetes Mastery Assessment',
    traineeId: 'trn_102',
    traineeName: 'Karthik Narayanan',
    traineeAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    submittedAt: '2026-09-21 16:15',
    score: 15,
    totalMarks: 20,
    percentage: 75,
    passed: true,
    status: 'Completed',
    timeSpentMinutes: 24
  },
  {
    id: 'part_3',
    questionnaireId: 'qnr_1',
    questionnaireTitle: 'Cloud Infrastructure & Kubernetes Mastery Assessment',
    traineeId: 'trn_103',
    traineeName: 'Ananya Deshmukh',
    traineeAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    submittedAt: '2026-09-22 11:05',
    score: 12,
    totalMarks: 20,
    percentage: 60,
    passed: false,
    status: 'Completed',
    timeSpentMinutes: 28
  },
  {
    id: 'part_4',
    questionnaireId: 'qnr_2',
    questionnaireTitle: 'Modern Microservices & API Design Evaluation',
    traineeId: 'trn_101',
    traineeName: 'Bhavya Shree D',
    traineeAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    submittedAt: '2026-09-24 10:45',
    score: 20,
    totalMarks: 20,
    percentage: 100,
    passed: true,
    status: 'Completed',
    timeSpentMinutes: 19
  },
  {
    id: 'part_5',
    questionnaireId: 'qnr_1',
    questionnaireTitle: 'Cloud Infrastructure & Kubernetes Mastery Assessment',
    traineeId: 'trn_104',
    traineeName: 'Rohan Mehra',
    traineeAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
    submittedAt: '2026-09-25 18:20',
    score: 17,
    totalMarks: 20,
    percentage: 85,
    passed: true,
    status: 'Completed',
    timeSpentMinutes: 21
  }
];

// --- INITIAL TRAINER LIBRARY ITEMS ---
export const INITIAL_TRAINER_LIBRARY: TrainerLibraryItem[] = [
  {
    id: 'lib_1',
    title: 'Deep Dive into Kubernetes Service Mesh & Istio Routing (Recorded Lecture)',
    type: 'Lecture',
    subject: 'Cloud Computing',
    trainerId: 'tr_1',
    trainerName: 'Dr. Rajesh Raman',
    description: 'Full 90-minute recorded deep-dive masterclass explaining mutual TLS, canary deployments, circuit breakers, and distributed tracing with Jaeger.',
    uploadedAt: '2026-09-18',
    fileSizeOrDuration: '92 mins • 1080p HD',
    resourceLink: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    downloadsCount: 312,
    tags: ['Kubernetes', 'Istio', 'Service Mesh', 'DevOps']
  },
  {
    id: 'lib_2',
    title: 'Enterprise High-Availability & Disaster Recovery Slide Deck',
    type: 'Presentation',
    subject: 'Cloud Computing',
    trainerId: 'tr_1',
    trainerName: 'Dr. Rajesh Raman',
    description: 'Comprehensive 48-slide executive presentation covering RTO, RPO, multi-region replication architectures, and chaos engineering principles.',
    uploadedAt: '2026-09-20',
    fileSizeOrDuration: '14.8 MB • PDF Deck',
    resourceLink: '#',
    downloadsCount: 489,
    tags: ['Architecture', 'Disaster Recovery', 'High Availability']
  },
  {
    id: 'lib_3',
    title: 'Production Terraform Blueprints & SRE Runbook Handbook',
    type: 'Study Material',
    subject: 'Cloud Computing',
    trainerId: 'tr_1',
    trainerName: 'Dr. Rajesh Raman',
    description: 'Complete hands-on reference code repository including modular Terraform scripts for VPC, EKS, RDS, and automated SRE incident mitigation checklist.',
    uploadedAt: '2026-09-22',
    fileSizeOrDuration: '5.2 MB • Code ZIP & Docs',
    resourceLink: '#',
    downloadsCount: 640,
    tags: ['Terraform', 'SRE', 'Handbook', 'Code Templates']
  },
  {
    id: 'lib_4',
    title: 'Asynchronous Event-Driven Microservices with Kafka & Redis Streams',
    type: 'Lecture',
    subject: 'Backend Microservices',
    trainerId: 'tr_2',
    trainerName: 'Priya Sundaram',
    description: 'Hands-on live demonstration building high-throughput consumer groups, partitioned message ordering, and DLQ dead-letter patterns.',
    uploadedAt: '2026-09-15',
    fileSizeOrDuration: '75 mins • 1080p HD',
    resourceLink: '#',
    downloadsCount: 280,
    tags: ['Kafka', 'Microservices', 'Event-Driven', 'Python']
  },
  {
    id: 'lib_5',
    title: 'Zero Trust Network Architecture & SAML/OIDC Protocol Specs',
    type: 'Presentation',
    subject: 'Cybersecurity',
    trainerId: 'tr_4',
    trainerName: 'Col. Amit Verma',
    description: 'Authoritative presentation breaking down defense-in-depth, identity verification, OAuth 2.0 grant types, and zero trust policies.',
    uploadedAt: '2026-09-12',
    fileSizeOrDuration: '18.2 MB • PPTX Presentation',
    resourceLink: '#',
    downloadsCount: 395,
    tags: ['Security', 'Zero Trust', 'OAuth', 'Compliance']
  }
];

// --- INITIAL USER APPROVALS (ADMIN) ---
export const INITIAL_USER_APPROVALS: UserApprovalRecord[] = [
  {
    id: 'appr_1',
    fullName: 'Siddharth Iyer',
    email: 'siddharth.iyer@fintech.com',
    requestedRole: 'TRAINER',
    registeredDate: '2026-09-28',
    organizationOrDegree: '12 Yrs Exp • Ex-Paytm Principal Architect',
    domain: 'FinTech Architecture & Event Sourcing',
    status: 'Pending',
    approvalNotes: 'Strong profile with FinTech certifications and open-source contributions.'
  },
  {
    id: 'appr_2',
    fullName: 'Meera Nambiar',
    email: 'meera.nambiar@techuniv.edu',
    requestedRole: 'TRAINEE',
    registeredDate: '2026-09-29',
    organizationOrDegree: 'B.Tech IT • 2026 Batch',
    domain: 'Full-Stack Web Development',
    status: 'Pending',
    approvalNotes: 'Student applicant recommended by University Capacity Outreach.'
  },
  {
    id: 'appr_3',
    fullName: 'Deepak Chopra',
    email: 'deepak.c@cloudops.io',
    requestedRole: 'TRAINER',
    registeredDate: '2026-09-27',
    organizationOrDegree: 'Senior Cloud Consultant • AWS APN Ambassador',
    domain: 'DevOps & Multi-Cloud Migration',
    status: 'Approved',
    approvalNotes: 'Credentials verified against AWS Certification Registry.'
  }
];

// --- INITIAL USER ROSTER (ROLE MANAGEMENT) ---
export const INITIAL_USER_ROSTER: UserManagementRecord[] = [
  {
    id: 'usr_1',
    fullName: 'Bhavya Shree D',
    email: 'bhavya.shree@capacityconnect.org',
    role: 'TRAINEE',
    status: 'Active',
    joinDate: '2026-08-01',
    department: 'Cloud Solutions Cohort',
    completionScore: 88
  },
  {
    id: 'usr_2',
    fullName: 'Dr. Rajesh Raman',
    email: 'rajesh.raman@capacityconnect.org',
    role: 'TRAINER',
    status: 'Active',
    joinDate: '2026-07-15',
    department: 'Infrastructure & SRE Academy',
    completionScore: 98
  },
  {
    id: 'usr_3',
    fullName: 'Priya Sundaram',
    email: 'priya.sundaram@capacityconnect.org',
    role: 'TRAINER',
    status: 'Active',
    joinDate: '2026-07-20',
    department: 'AI & Data Science Faculty',
    completionScore: 95
  },
  {
    id: 'usr_4',
    fullName: 'Siva Shankar',
    email: 'admin.siva@capacityconnect.org',
    role: 'ADMIN',
    status: 'Active',
    joinDate: '2026-06-01',
    department: 'Platform Governance & Executive Operations',
    completionScore: 100
  },
  {
    id: 'usr_5',
    fullName: 'Karthik Narayanan',
    email: 'karthik.n@capacityconnect.org',
    role: 'TRAINEE',
    status: 'Active',
    joinDate: '2026-08-10',
    department: 'Backend Microservices Cohort',
    completionScore: 82
  },
  {
    id: 'usr_6',
    fullName: 'Col. Amit Verma',
    email: 'amit.verma@capacityconnect.org',
    role: 'TRAINER',
    status: 'Active',
    joinDate: '2026-07-25',
    department: 'Cyber Defense & Security Faculty',
    completionScore: 96
  }
];

// --- INITIAL HOMEPAGE ANNOUNCEMENTS & BROADCASTS ---
export const INITIAL_ANNOUNCEMENTS: HomepageAnnouncement[] = [
  {
    id: 'ann_1',
    title: 'Capacity Connect Q4 Organizational Upskilling Drive Announced!',
    content: 'All certified trainees who complete 2 or more specialized subject questionnaires with >=80% by October 30 will receive accelerated internal career promotion eligibility.',
    category: 'Announcement',
    urgency: 'Important',
    publishedDate: '2026-09-28',
    active: true,
    author: 'Platform Governance',
    targetRole: 'ALL'
  },
  {
    id: 'ann_2',
    title: 'Congratulations: 48 Trainees Achieved AWS Solutions Architect Credentials!',
    content: 'Special commendation to Bhavya Shree D and cohort members for scoring top percentile in the cloud assessment tracks under Dr. Rajesh Raman’s mentorship.',
    category: 'Achievement',
    urgency: 'Normal',
    publishedDate: '2026-09-27',
    active: true,
    author: 'Academy Director',
    targetRole: 'ALL'
  },
  {
    id: 'ann_3',
    title: 'New Course & Library Track Added: Agentic AI Systems & Multi-Agent Workflows',
    content: 'New lecture series, presentation decks, and GitHub starter code for LangChain and LangGraph microservices are now available in the Trainer Library!',
    category: 'New Learning Content',
    urgency: 'Normal',
    publishedDate: '2026-09-25',
    active: true,
    author: 'Curriculum Team',
    targetRole: 'TRAINEE'
  },
  {
    id: 'ann_4',
    title: 'Scheduled System Maintenance: Oct 2, 02:00 - 04:00 AM IST',
    content: 'Platform will undergo cloud database optimization and security patch application. Questionnaire taking will be paused during this 2-hour window.',
    category: 'Notification',
    urgency: 'Critical',
    publishedDate: '2026-09-29',
    active: true,
    author: 'DevOps Operations',
    targetRole: 'ALL'
  }
];

// --- INITIAL COMPETENCY MAPPING DATA (ADMIN) ---
export const INITIAL_COMPETENCY_MAPPING: CompetencyMappingSubject[] = [
  {
    id: 'cmp_1',
    subjectCode: 'CC-SRE-501',
    subjectName: 'Cloud Architecture & SRE Hardening',
    domain: 'Cloud & Infrastructure',
    description: 'Enterprise scalability, Kubernetes, Terraform IaC, multi-region fault tolerance, and incident remediation.',
    demandLevel: 'Critical',
    requiredLevel: 'Expert',
    assignedTrainerId: 'tr_1',
    assignedTrainerName: 'Dr. Rajesh Raman',
    suitableTrainers: [
      {
        trainerId: 'tr_1',
        trainerName: 'Dr. Rajesh Raman',
        competencyScore: 98,
        verifiedCertifications: 4,
        rating: 4.95,
        status: 'Assigned'
      },
      {
        trainerId: 'tr_5',
        trainerName: 'Deepak Chopra',
        competencyScore: 91,
        verifiedCertifications: 3,
        rating: 4.80,
        status: 'Available'
      }
    ]
  },
  {
    id: 'cmp_2',
    subjectCode: 'CC-AI-602',
    subjectName: 'Enterprise AI & LLM Systems Engineering',
    domain: 'Artificial Intelligence',
    description: 'Fine-tuning, vector database search, RAG pipelines, FastAPI streaming, and model performance monitoring.',
    demandLevel: 'High',
    requiredLevel: 'Expert',
    assignedTrainerId: 'tr_2',
    assignedTrainerName: 'Priya Sundaram',
    suitableTrainers: [
      {
        trainerId: 'tr_2',
        trainerName: 'Priya Sundaram',
        competencyScore: 96,
        verifiedCertifications: 3,
        rating: 4.91,
        status: 'Assigned'
      },
      {
        trainerId: 'tr_6',
        trainerName: 'Dr. Arjun Varma',
        competencyScore: 89,
        verifiedCertifications: 2,
        rating: 4.75,
        status: 'Recommended'
      }
    ]
  },
  {
    id: 'cmp_3',
    subjectCode: 'CC-SEC-703',
    subjectName: 'Cybersecurity, Zero Trust & DevSecOps',
    domain: 'Security & Compliance',
    description: 'SAST/DAST pipeline integration, OAuth2/OIDC, network perimeter isolation, and ISO 27001 regulatory frameworks.',
    demandLevel: 'Critical',
    requiredLevel: 'Advanced',
    assignedTrainerId: 'tr_4',
    assignedTrainerName: 'Col. Amit Verma',
    suitableTrainers: [
      {
        trainerId: 'tr_4',
        trainerName: 'Col. Amit Verma',
        competencyScore: 97,
        verifiedCertifications: 5,
        rating: 4.93,
        status: 'Assigned'
      }
    ]
  },
  {
    id: 'cmp_4',
    subjectCode: 'CC-DATA-804',
    subjectName: 'Big Data Streaming with Apache Spark & Kafka',
    domain: 'Data Engineering',
    description: 'Real-time event streams, Delta Lake, distributed window aggregations, and high-throughput data pipelines.',
    demandLevel: 'High',
    requiredLevel: 'Advanced',
    suitableTrainers: [
      {
        trainerId: 'tr_3',
        trainerName: 'Vikramaditya Rao',
        competencyScore: 94,
        verifiedCertifications: 3,
        rating: 4.88,
        status: 'Recommended'
      },
      {
        trainerId: 'tr_7',
        trainerName: 'Sneha Kapur',
        competencyScore: 86,
        verifiedCertifications: 2,
        rating: 4.72,
        status: 'Available'
      }
    ]
  },
  {
    id: 'cmp_5',
    subjectCode: 'CC-FS-405',
    subjectName: 'Modern Full-Stack React & Node Microservices',
    domain: 'Software Engineering',
    description: 'Responsive web engineering, state management, REST & GraphQL APIs, test automation, and mobile compatibility.',
    demandLevel: 'Medium',
    requiredLevel: 'Intermediate',
    suitableTrainers: [
      {
        trainerId: 'tr_8',
        trainerName: 'Aakash Mehta',
        competencyScore: 92,
        verifiedCertifications: 2,
        rating: 4.84,
        status: 'Recommended'
      }
    ]
  }
];

// --- INITIAL ADMIN ANALYTICS METRICS ---
export const INITIAL_ADMIN_ANALYTICS: AdminAnalyticsMetrics = {
  totalCourses: 38,
  totalEnrollments: 2480,
  certificationsIssued: 642,
  assessmentsCompleted: 3890,
  avgAssessmentScore: 84.6,
  activeParticipationRate: 91.4,
  totalTrainers: 14,
  totalTrainees: 420,
  enrollmentTrend: [
    { month: 'May', count: 180 },
    { month: 'Jun', count: 290 },
    { month: 'Jul', count: 420 },
    { month: 'Aug', count: 680 },
    { month: 'Sep', count: 910 }
  ],
  subjectDistribution: [
    { subject: 'Cloud & Infrastructure', learners: 920, trainers: 4 },
    { subject: 'AI & Data Science', learners: 760, trainers: 3 },
    { subject: 'Cybersecurity & Zero Trust', learners: 480, trainers: 2 },
    { subject: 'Backend Microservices', learners: 610, trainers: 3 },
    { subject: 'Full Stack Engineering', learners: 520, trainers: 2 }
  ]
};

// --- BROWSEABLE TRAINERS LIST (FOR WISHLIST & COMPETENCY SEARCH) ---
export interface BrowseableTrainer {
  id: string;
  name: string;
  title: string;
  domain: string;
  rating: number;
  experienceYears: number;
  studentsTaught: number;
  availableHours: string;
  avatar: string;
  skills: string[];
  certifications: string[];
}

export const ALL_TRAINERS: BrowseableTrainer[] = [
  {
    id: 'tr_1',
    name: 'Dr. Rajesh Raman',
    title: 'Principal Cloud Architect & Senior Corporate Trainer',
    domain: 'Cloud Architecture & SRE',
    rating: 4.95,
    experienceYears: 16,
    studentsTaught: 3420,
    availableHours: '12 hrs/week',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    skills: ['AWS', 'Kubernetes', 'Terraform', 'SRE', 'Docker', 'Chaos Engineering'],
    certifications: ['AWS Solutions Architect Pro', 'CKA', 'CKS', 'Terraform Associate']
  },
  {
    id: 'tr_2',
    name: 'Priya Sundaram',
    title: 'Lead AI Engineer & Enterprise ML Trainer',
    domain: 'Artificial Intelligence & Microservices',
    rating: 4.91,
    experienceYears: 11,
    studentsTaught: 2150,
    availableHours: '8 hrs/week',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    skills: ['Python', 'FastAPI', 'PyTorch', 'Vector DBs', 'RAG Pipelines', 'Docker'],
    certifications: ['TensorFlow Certified Developer', 'Azure AI Engineer Associate']
  },
  {
    id: 'tr_3',
    name: 'Vikramaditya Rao',
    title: 'Head of Enterprise Data Engineering',
    domain: 'Big Data & Real-Time Event Streams',
    rating: 4.88,
    experienceYears: 14,
    studentsTaught: 1890,
    availableHours: '6 hrs/week',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    skills: ['Apache Spark', 'Kafka', 'Delta Lake', 'Scala', 'Snowflake', 'Airflow'],
    certifications: ['Databricks Certified Spark Developer', 'Confluent Kafka Certified']
  },
  {
    id: 'tr_4',
    name: 'Col. Amit Verma',
    title: 'Chief Information Security Advisor & DevSecOps Lead',
    domain: 'Cybersecurity & Zero Trust Architecture',
    rating: 4.93,
    experienceYears: 18,
    studentsTaught: 2980,
    availableHours: '10 hrs/week',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    skills: ['Zero Trust', 'OAuth/OIDC', 'CIS Benchmarks', 'Penetration Testing', 'SIEM'],
    certifications: ['CISSP', 'CEH Master', 'CISM', 'CompTIA Security+']
  },
  {
    id: 'tr_8',
    name: 'Aakash Mehta',
    title: 'Staff Frontend Architect & UX Specialist',
    domain: 'Modern Full-Stack & UI Performance',
    rating: 4.84,
    experienceYears: 9,
    studentsTaught: 1650,
    availableHours: '8 hrs/week',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    skills: ['React 19', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Web Vitals', 'Node.js'],
    certifications: ['Meta Certified Front-End Developer', 'AWS Cloud Practitioner']
  }
];

// --- ALL PLATFORM COURSES (WITH DETAILED RESPECTIVE STAFF) ---
export const ALL_COURSES: PlatformCourse[] = [
  {
    id: 'crs_1',
    code: 'CC-SRE-501',
    title: 'Enterprise Cloud Architecture & SRE',
    category: 'Cloud Engineering',
    description: 'Master multi-region resilience, Kubernetes container orchestration, Terraform infrastructure-as-code, and site reliability engineering.',
    trainerId: 'tr_1',
    trainerName: 'Dr. Rajesh Raman',
    trainerTitle: 'Principal Cloud Architect & Senior Corporate Trainer',
    trainerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    trainerEmail: 'rajesh.raman@capacityconnect.org',
    trainerExperienceYears: 16,
    trainerRating: 4.95,
    totalModules: 12,
    durationWeeks: 8,
    enrolledStudentsCount: 420,
    materialsCount: 3,
    thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'crs_2',
    code: 'CC-AI-602',
    title: 'Advanced AI Microservices & PyTorch',
    category: 'AI & Machine Learning',
    description: 'Production vector indexing, FastAPI streaming endpoints, RAG architectures, and fine-tuned open-source model deployment.',
    trainerId: 'tr_2',
    trainerName: 'Priya Sundaram',
    trainerTitle: 'Lead AI Engineer & Enterprise ML Trainer',
    trainerAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    trainerEmail: 'priya.sundaram@capacityconnect.org',
    trainerExperienceYears: 11,
    trainerRating: 4.91,
    totalModules: 10,
    durationWeeks: 6,
    enrolledStudentsCount: 360,
    materialsCount: 2,
    thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'crs_3',
    code: 'CC-SEC-703',
    title: 'Zero Trust & DevSecOps Engineering',
    category: 'Cybersecurity',
    description: 'OAuth 2.0/OIDC access governance, container vulnerability scanning, perimeter defense, and automated compliance pipeline checks.',
    trainerId: 'tr_4',
    trainerName: 'Col. Amit Verma',
    trainerTitle: 'Chief Information Security Advisor & DevSecOps Lead',
    trainerAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    trainerEmail: 'amit.verma@capacityconnect.org',
    trainerExperienceYears: 18,
    trainerRating: 4.93,
    totalModules: 8,
    durationWeeks: 6,
    enrolledStudentsCount: 280,
    materialsCount: 2,
    thumbnail: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'crs_4',
    code: 'CC-DATA-804',
    title: 'Big Data Streaming with Spark & Kafka',
    category: 'Data Engineering',
    description: 'Event-driven message queues, Delta Lake ACID lakehouses, partitioned streaming pipelines, and real-time analytical telemetry.',
    trainerId: 'tr_3',
    trainerName: 'Vikramaditya Rao',
    trainerTitle: 'Head of Enterprise Data Engineering',
    trainerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    trainerEmail: 'vikram.rao@capacityconnect.org',
    trainerExperienceYears: 14,
    trainerRating: 4.88,
    totalModules: 10,
    durationWeeks: 8,
    enrolledStudentsCount: 310,
    materialsCount: 1,
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'crs_5',
    code: 'CC-FS-405',
    title: 'Modern Full-Stack React & Node Systems',
    category: 'Software Engineering',
    description: 'End-to-end full-stack web applications with React 19, TypeScript, state management, REST/GraphQL APIs, and cloud deployments.',
    trainerId: 'tr_8',
    trainerName: 'Aakash Mehta',
    trainerTitle: 'Staff Frontend Architect & UX Specialist',
    trainerAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    trainerEmail: 'aakash.mehta@capacityconnect.org',
    trainerExperienceYears: 9,
    trainerRating: 4.84,
    totalModules: 8,
    durationWeeks: 5,
    enrolledStudentsCount: 290,
    materialsCount: 1,
    thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&auto=format&fit=crop&q=80'
  }
];

// --- ALL PLATFORM STUDENTS ---
export const ALL_STUDENTS: StudentProfileSummary[] = [
  {
    id: 'trn_101',
    fullName: 'Bhavya Shree D',
    email: 'bhavya.shree@capacityconnect.org',
    cohort: 'Cloud & AI Cohort 2026',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    enrolledCourseIds: ['crs_1', 'crs_2', 'crs_3'],
    enrolledCourseNames: ['Enterprise Cloud Architecture & SRE', 'Advanced AI Microservices & PyTorch', 'Zero Trust & DevSecOps Engineering'],
    averageScore: 91,
    quizzesCompleted: 3,
    status: 'Active'
  },
  {
    id: 'trn_102',
    fullName: 'Karthik Narayanan',
    email: 'karthik.n@capacityconnect.org',
    cohort: 'Cloud Infrastructure Cohort',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    enrolledCourseIds: ['crs_1'],
    enrolledCourseNames: ['Enterprise Cloud Architecture & SRE'],
    averageScore: 75,
    quizzesCompleted: 1,
    status: 'Active'
  },
  {
    id: 'trn_103',
    fullName: 'Ananya Deshmukh',
    email: 'ananya.d@capacityconnect.org',
    cohort: 'Cloud & Systems Cohort',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    enrolledCourseIds: ['crs_1'],
    enrolledCourseNames: ['Enterprise Cloud Architecture & SRE'],
    averageScore: 60,
    quizzesCompleted: 1,
    status: 'Active'
  },
  {
    id: 'trn_104',
    fullName: 'Rohan Mehra',
    email: 'rohan.m@capacityconnect.org',
    cohort: 'Cloud Engineering Cohort',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
    enrolledCourseIds: ['crs_1'],
    enrolledCourseNames: ['Enterprise Cloud Architecture & SRE'],
    averageScore: 85,
    quizzesCompleted: 1,
    status: 'Active'
  },
  {
    id: 'trn_105',
    fullName: 'Meera Nambiar',
    email: 'meera.nambiar@techuniv.edu',
    cohort: 'Full-Stack Cohort 2026',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    enrolledCourseIds: ['crs_5'],
    enrolledCourseNames: ['Modern Full-Stack React & Node Systems'],
    averageScore: 88,
    quizzesCompleted: 2,
    status: 'Active'
  }
];

// --- LOCAL STORAGE HELPERS ---
const STORAGE_PREFIX = 'capacity_connect_v1_';

export function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + key);
    if (!raw) return defaultValue;
    return JSON.parse(raw);
  } catch (e) {
    console.warn(`Failed reading ${key} from storage:`, e);
    return defaultValue;
  }
}

export function saveToStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(data));
  } catch (e) {
    console.warn(`Failed saving ${key} to storage:`, e);
  }
}
