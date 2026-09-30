// Dream Companies Data & DSA Prep Curriculums for CapacityConnect Trainees

export interface CompanyDsaTopic {
  id: string;
  name: string;
  category: 'Data Structures' | 'Algorithms' | 'System Design' | 'Core Engineering';
  difficulty: 'Medium' | 'Hard' | 'Very High' | 'Crucial';
  frequency: string; // e.g. "95% Frequency"
  description: string;
  keyAlgorithms: string[];
}

export interface CompanyInterviewRound {
  roundNumber: number;
  title: string;
  type: string;
  focus: string;
  tips: string;
}

export interface DreamCompany {
  id: string;
  name: string;
  brandColor: string;
  badgeBg: string;
  badgeText: string;
  role: string;
  packageRange: string;
  tier: 'FAANG / Tier-1' | 'Top Global Tech' | 'Enterprise FinTech' | 'Cloud Leader';
  description: string;
  dsaTopics: CompanyDsaTopic[];
  recommendedCourseIds: string[];
  interviewRounds: CompanyInterviewRound[];
  hiringCriteria: string[];
}

export const DREAM_COMPANIES_DATA: DreamCompany[] = [
  {
    id: 'google',
    name: 'Google',
    brandColor: '#4285F4',
    badgeBg: 'bg-blue-50',
    badgeText: 'text-blue-700 border-blue-200',
    role: 'Software Engineer (L3/L4) • Cloud & Systems',
    packageRange: '₹35 - 55 LPA / $180k+',
    tier: 'FAANG / Tier-1',
    description: 'Renowned for rigorous DSA problem solving, optimal time & space complexity, and scalable distributed system design.',
    recommendedCourseIds: ['crs_1', 'crs_2', 'crs_5'],
    dsaTopics: [
      {
        id: 'g_dsa_1',
        name: 'Graph Algorithms & Shortest Paths',
        category: 'Algorithms',
        difficulty: 'Hard',
        frequency: '98% Frequency',
        description: 'Dijkstra, Bellman-Ford, Topological Sort, Strongly Connected Components (Tarjan / Kosaraju).',
        keyAlgorithms: ['Dijkstra with Priority Queue', 'Kahn Algorithm for Topological Sort', 'Union-Find Disjoint Set']
      },
      {
        id: 'g_dsa_2',
        name: 'Dynamic Programming & State Transitions',
        category: 'Algorithms',
        difficulty: 'Hard',
        frequency: '92% Frequency',
        description: '2D/3D DP tables, Bitmask DP, Tree DP, and Memory Optimization.',
        keyAlgorithms: ['Longest Common Subsequence', 'Knapsack Variations', 'Matrix Chain Multiplication', 'Digit DP']
      },
      {
        id: 'g_dsa_3',
        name: 'Trie & Prefix Tree Architectures',
        category: 'Data Structures',
        difficulty: 'Medium',
        frequency: '88% Frequency',
        description: 'Autocomplete query trees, XOR Maximization Trie, and Substring Search.',
        keyAlgorithms: ['Prefix Insertion & Search', 'Bitwise Trie for Max XOR Pair', 'Aho-Corasick Automaton']
      },
      {
        id: 'g_dsa_4',
        name: 'Advanced Binary Search & Monotonic Queues',
        category: 'Algorithms',
        difficulty: 'Medium',
        frequency: '85% Frequency',
        description: 'Binary search on answer space, sliding window maximum with monotonic deque.',
        keyAlgorithms: ['Search in Rotated Array', 'Capacity to Ship Packages', 'Sliding Window Deque']
      },
      {
        id: 'g_dsa_5',
        name: 'Segment Trees & Range Minimum Query',
        category: 'Data Structures',
        difficulty: 'Hard',
        frequency: '76% Frequency',
        description: 'Dynamic range updates with lazy propagation, Fenwick Binary Indexed Trees.',
        keyAlgorithms: ['Segment Tree with Lazy Propagation', 'Fenwick Tree Point/Range Query']
      }
    ],
    interviewRounds: [
      {
        roundNumber: 1,
        title: 'Online Assessment (OA)',
        type: 'Coding Test',
        focus: '2 Algorithmic DSA problems (90 mins). Strict memory limits and corner case coverage.',
        tips: 'Write clean code with explicit variable naming and write your own custom tests.'
      },
      {
        roundNumber: 2,
        title: 'Technical Round 1: Core Algorithms',
        type: 'Live Coding (Google Meet + Doc)',
        focus: 'Graph traversals, Tree recursion, or Hard Array manipulation.',
        tips: 'Clarify constraints first. Speak your thought process out loud before typing any code.'
      },
      {
        roundNumber: 3,
        title: 'Technical Round 2: Data Structures & Optimization',
        type: 'Live Coding',
        focus: 'Dynamic Programming, Min-Heap / Priority Queue, Trie, Big-O proof.',
        tips: 'State baseline brute-force approach first, then systematically optimize to O(N) or O(log N).'
      },
      {
        roundNumber: 4,
        title: 'Googlyness & Cultural Leadership',
        type: 'Behavioral & Scenario',
        focus: 'Constructive ambiguity handling, mentorship, bias-free teamwork, project resilience.',
        tips: 'Use the STAR method (Situation, Task, Action, Result) with quantified outcomes.'
      }
    ],
    hiringCriteria: [
      'Clean idiomatic code without compiler warnings',
      'Instant Big-O time and space complexity derivation',
      'Edge cases (null, empty, negative numbers, overflow) checked proactively'
    ]
  },
  {
    id: 'amazon',
    name: 'Amazon',
    brandColor: '#FF9900',
    badgeBg: 'bg-amber-50',
    badgeText: 'text-amber-800 border-amber-200',
    role: 'Software Development Engineer (SDE-I/II)',
    packageRange: '₹32 - 48 LPA / $165k+',
    tier: 'FAANG / Tier-1',
    description: 'Heavy focus on practical Data Structures, Trees, Heaps, Sliding Window, Low-Level Object Oriented Design (LLD), and the 16 Leadership Principles.',
    recommendedCourseIds: ['crs_1', 'crs_4', 'crs_5'],
    dsaTopics: [
      {
        id: 'amz_dsa_1',
        name: 'Binary Trees & Lowest Common Ancestor',
        category: 'Data Structures',
        difficulty: 'Medium',
        frequency: '96% Frequency',
        description: 'Level order traversal (BFS), diameter of binary tree, serialization & deserialization.',
        keyAlgorithms: ['LCA in BST and Binary Tree', 'Binary Tree Zigzag Traversal', 'Morris In-order Traversal']
      },
      {
        id: 'amz_dsa_2',
        name: 'Heaps & Priority Queues (Top-K Patterns)',
        category: 'Data Structures',
        difficulty: 'Medium',
        frequency: '94% Frequency',
        description: 'Top K frequent elements, merge K sorted lists, median of data streams.',
        keyAlgorithms: ['Min/Max Heap construction', 'Kth Largest Element', 'Two Heaps for Stream Median']
      },
      {
        id: 'amz_dsa_3',
        name: 'Sliding Window & Hash Tables',
        category: 'Algorithms',
        difficulty: 'Medium',
        frequency: '90% Frequency',
        description: 'Longest substring without repeating characters, minimum window substring.',
        keyAlgorithms: ['Two Pointers Technique', 'Subarray Sum Equals K', 'Minimum Window Substring']
      },
      {
        id: 'amz_dsa_4',
        name: 'Low-Level Object Oriented Design (LLD)',
        category: 'System Design',
        difficulty: 'Crucial',
        frequency: '92% Frequency',
        description: 'Design Parking Lot, Elevator System, Amazon Locker, and Cache with Eviction Policy.',
        keyAlgorithms: ['SOLID Principles', 'Factory & Strategy Patterns', 'LRU Cache Design (Doubly Linked List + HashMap)']
      },
      {
        id: 'amz_dsa_5',
        name: 'BFS/DFS Grid Traversal & Islands',
        category: 'Algorithms',
        difficulty: 'Medium',
        frequency: '88% Frequency',
        description: 'Number of islands, rotting oranges, word ladder, shortest path in binary matrix.',
        keyAlgorithms: ['Multi-source BFS', 'Flood Fill Recursion', 'Bidirectional BFS']
      }
    ],
    interviewRounds: [
      {
        roundNumber: 1,
        title: 'Online Assessment (OA)',
        type: '2 Coding + Work Simulation',
        focus: '2 DSA problems (sliding window/heaps) + Amazon Work Style behavioral evaluation.',
        tips: 'Align your answers with Customer Obsession and Bias for Action.'
      },
      {
        roundNumber: 2,
        title: 'Technical Round 1: Trees & Heaps',
        type: 'Live Coding + LP',
        focus: 'Data Structures problem solving + 15 minutes of Leadership Principle questions.',
        tips: 'Always prepare 2 stories per Amazon Leadership Principle.'
      },
      {
        roundNumber: 3,
        title: 'Technical Round 2: LLD & Design Patterns',
        type: 'Live Coding + LLD',
        focus: 'LRU Cache, Parking Lot, or In-memory File System + Complexity Analysis.',
        tips: 'Write modular classes, interfaces, and handle concurrency safely.'
      },
      {
        roundNumber: 4,
        title: 'The Bar Raiser Round',
        type: 'Deep Dive Coding & Architecture',
        focus: 'Independent evaluator checking long-term engineering potential and standards.',
        tips: 'Demonstrate Ownership, Dive Deep, and Disagree and Commit with data.'
      }
    ],
    hiringCriteria: [
      'Customer-centric problem decomposition',
      'Modular, object-oriented, testable clean code',
      'Strong adherence to Amazon Leadership Principles'
    ]
  },
  {
    id: 'microsoft',
    name: 'Microsoft',
    brandColor: '#00A4EF',
    badgeBg: 'bg-sky-50',
    badgeText: 'text-sky-700 border-sky-200',
    role: 'Software Engineer • Cloud, Azure & Core Platform',
    packageRange: '₹30 - 45 LPA / $155k+',
    tier: 'FAANG / Tier-1',
    description: 'Values strong foundation in Arrays, Strings, Linked Lists, Recursion, System Architecture, and Enterprise engineering practices.',
    recommendedCourseIds: ['crs_1', 'crs_3', 'crs_5'],
    dsaTopics: [
      {
        id: 'ms_dsa_1',
        name: 'Strings & Array Manipulations',
        category: 'Algorithms',
        difficulty: 'Medium',
        frequency: '95% Frequency',
        description: 'String compression, trapping rain water, group anagrams, 3Sum, matrix rotations.',
        keyAlgorithms: ['Two Pointers Traversal', 'Dutch National Flag Partitioning', 'Boyer-Moore Voting Algorithm']
      },
      {
        id: 'ms_dsa_2',
        name: 'Linked List Reversal & Merge Operations',
        category: 'Data Structures',
        difficulty: 'Medium',
        frequency: '88% Frequency',
        description: 'Reverse linked list in K-groups, copy list with random pointer, detect cycle (Floyd).',
        keyAlgorithms: ['Fast & Slow Pointer Cycle Detection', 'In-place Pointer Manipulation', 'Merge K Sorted Lists']
      },
      {
        id: 'ms_dsa_3',
        name: 'Dynamic Programming & Memoization',
        category: 'Algorithms',
        difficulty: 'Hard',
        frequency: '84% Frequency',
        description: 'Word Break, Coin Change, Edit Distance, Russian Doll Envelopes.',
        keyAlgorithms: ['Top-down Memoization', 'Bottom-up Space Reduction', 'Longest Increasing Subsequence (O(N log N))']
      },
      {
        id: 'ms_dsa_4',
        name: 'Stack & Queue Applications',
        category: 'Data Structures',
        difficulty: 'Medium',
        frequency: '86% Frequency',
        description: 'Next Greater Element, Largest Rectangle in Histogram, Evaluate Reverse Polish Notation.',
        keyAlgorithms: ['Monotonic Stack', 'Min-Stack Implementation', 'Queue using Stacks']
      },
      {
        id: 'ms_dsa_5',
        name: 'Microservice Design & Cloud Resilience',
        category: 'System Design',
        difficulty: 'Crucial',
        frequency: '90% Frequency',
        description: 'Design distributed key-value store, URL shortener, asynchronous notification engine.',
        keyAlgorithms: ['Consistent Hashing', 'Database Sharding', 'Message Brokers (Kafka/ServiceBus)']
      }
    ],
    interviewRounds: [
      {
        roundNumber: 1,
        title: 'Codility / HackerRank Screening',
        type: 'Online Assessment',
        focus: '2 Medium algorithm challenges focusing on edge-case correctness and runtime efficiency.',
        tips: 'Aim for 100% test case pass rate on standard and large inputs.'
      },
      {
        roundNumber: 2,
        title: 'Technical Round 1: Data Structures',
        type: 'Live Coding',
        focus: 'Linked lists, Binary search, Stack, or Array algorithms.',
        tips: 'Emphasize defensive programming and clean syntax.'
      },
      {
        roundNumber: 3,
        title: 'Technical Round 2: Problem Solving & Design',
        type: 'Live Coding + Design',
        focus: 'Recursion/DP problem + Mini-architecture component design.',
        tips: 'Explain data flow, caching mechanisms, and error recovery.'
      },
      {
        roundNumber: 4,
        title: 'Director / Partner Round',
        type: 'System Design + Leadership Fit',
        focus: 'Engineering culture, architectural trade-offs, and career roadmap.',
        tips: 'Share passion for Microsoft technologies and enterprise scalability.'
      }
    ],
    hiringCriteria: [
      'High attention to edge cases and code readability',
      'Solid understanding of operating systems, memory, and threads',
      'Growth mindset and collaboration skills'
    ]
  },
  {
    id: 'meta',
    name: 'Meta',
    brandColor: '#0668E1',
    badgeBg: 'bg-blue-50',
    badgeText: 'text-blue-800 border-blue-200',
    role: 'Software Engineer (E3/E4) • Product & Infrastructure',
    packageRange: '₹38 - 60 LPA / $195k+',
    tier: 'FAANG / Tier-1',
    description: 'Demands lightning-fast coding speed, high accuracy on LeetCode patterns, and deep knowledge of distributed social graph infrastructure.',
    recommendedCourseIds: ['crs_2', 'crs_4', 'crs_5'],
    dsaTopics: [
      {
        id: 'meta_dsa_1',
        name: 'Binary Search & Monotonic Conditions',
        category: 'Algorithms',
        difficulty: 'Medium',
        frequency: '96% Frequency',
        description: 'Peak index in mountain array, find first and last position of element in sorted array.',
        keyAlgorithms: ['Binary Search Boundary Conditions', 'Median of Two Sorted Arrays']
      },
      {
        id: 'meta_dsa_2',
        name: 'Graph Traversal & Social Connections',
        category: 'Data Structures',
        difficulty: 'Hard',
        frequency: '94% Frequency',
        description: 'Shortest path in unweighted graph, connected components, clone graph, account merge.',
        keyAlgorithms: ['Breadth-First Search for Friend Recommendations', 'Disjoint Set Union (DSU)']
      },
      {
        id: 'meta_dsa_3',
        name: 'Recursion & Backtracking',
        category: 'Algorithms',
        difficulty: 'Medium',
        frequency: '89% Frequency',
        description: 'Subsets, permutations, word search II, letter combinations of phone number.',
        keyAlgorithms: ['Backtracking with Pruning', 'Palindrome Partitioning']
      },
      {
        id: 'meta_dsa_4',
        name: 'High-Throughput Feed Architecture',
        category: 'System Design',
        difficulty: 'Crucial',
        frequency: '93% Frequency',
        description: 'Design Facebook News Feed, Instagram Stories, Distributed Live Video Chat.',
        keyAlgorithms: ['Fan-out on Write vs Read', 'Distributed Cache Clusters', 'Graph Databases']
      }
    ],
    interviewRounds: [
      {
        roundNumber: 1,
        title: 'Initial Technical Screen',
        type: '2 Coding Problems (45 mins)',
        focus: 'Solving 2 Medium/Hard algorithmic questions with bug-free code in under 40 minutes.',
        tips: 'Speed is essential. Code immediately without getting stuck on trivia.'
      },
      {
        roundNumber: 2,
        title: 'Onsite Coding Round 1 & 2',
        type: 'Live Coding',
        focus: '4 distinct DSA problems covering Graphs, Trees, Strings, and Arrays.',
        tips: 'Write modular code and self-test line by line.'
      },
      {
        roundNumber: 3,
        title: 'System Design Round',
        type: 'Distributed Systems',
        focus: 'High scale feed ranking, live chat, or photo storage cluster.',
        tips: 'Quantify queries per second (QPS), bandwidth, and database schema.'
      },
      {
        roundNumber: 4,
        title: 'Behavioral Round',
        type: 'Past Experiences',
        focus: 'Navigating conflicts, moving fast, taking bold technical bets.',
        tips: 'Show high autonomy and direct ownership of failures and wins.'
      }
    ],
    hiringCriteria: [
      'Rapid problem solving (target: 20 mins per problem)',
      'Writing runnable, syntax-perfect code on whiteboard/coderpad',
      'Understanding of modern distributed social scale'
    ]
  },
  {
    id: 'atlassian',
    name: 'Atlassian',
    brandColor: '#0052CC',
    badgeBg: 'bg-indigo-50',
    badgeText: 'text-indigo-700 border-indigo-200',
    role: 'Software Engineer • Cloud Microservices & Distributed Collaboration',
    packageRange: '₹30 - 46 LPA / $150k+',
    tier: 'Top Global Tech',
    description: 'Focuses heavily on readable production-quality code, multi-threading, concurrency, RESTful systems, and company values like "Open Company, No Bullshit".',
    recommendedCourseIds: ['crs_1', 'crs_5'],
    dsaTopics: [
      {
        id: 'atl_dsa_1',
        name: 'Concurrency & Thread Synchronization',
        category: 'Core Engineering',
        difficulty: 'Crucial',
        frequency: '95% Frequency',
        description: 'Read-write locks, producer-consumer queues, rate limiters (Token Bucket).',
        keyAlgorithms: ['Token Bucket Rate Limiter', 'Thread-safe In-memory Cache', 'Semaphore Coordination']
      },
      {
        id: 'atl_dsa_2',
        name: 'Autocomplete Search with Trie & Priority Queue',
        category: 'Data Structures',
        difficulty: 'Hard',
        frequency: '92% Frequency',
        description: 'Design real-time search suggest like Jira issue picker with prefix matching.',
        keyAlgorithms: ['Trie with Top-K Heap Nodes', 'Fuzzy String Search']
      },
      {
        id: 'atl_dsa_3',
        name: 'Graph Traversal & Workflow Dependency Graphs',
        category: 'Algorithms',
        difficulty: 'Medium',
        frequency: '89% Frequency',
        description: 'Issue dependency trees, cycle detection in ticket workflows, task scheduling.',
        keyAlgorithms: ['Topological Sorting for Workflows', 'Cycle Detection in Directed Graphs']
      }
    ],
    interviewRounds: [
      {
        roundNumber: 1,
        title: 'Take-Home / Live Pairing Screen',
        type: 'Clean Coding Pairing',
        focus: 'Writing unit tests, edge-case coverage, and clean object-oriented architecture.',
        tips: 'Write comprehensive JUnit/Jest unit tests during the session.'
      },
      {
        roundNumber: 2,
        title: 'Data Structures & Algorithmic Problem Solving',
        type: 'Live Coding',
        focus: 'Trie search, graph workflows, or concurrent cache design.',
        tips: 'Prioritize readability and clean separation of concerns.'
      },
      {
        roundNumber: 3,
        title: 'System Design: Collaboration Tools',
        type: 'High-Level Architecture',
        focus: 'Collaborative text editing (OT/CRDT), notification pipeline, or Jira board indexing.',
        tips: 'Discuss operational metrics and fault tolerance.'
      },
      {
        roundNumber: 4,
        title: 'Values Interview',
        type: 'Culture Fit',
        focus: 'Atlassian values: Open company, build with heart, play as a team.',
        tips: 'Be genuine, transparent, and showcase constructive collaboration.'
      }
    ],
    hiringCriteria: [
      'Production-quality maintainable code with unit tests',
      'Deep appreciation for developer velocity and collaboration',
      'Strong grasp of concurrency and distributed caching'
    ]
  },
  {
    id: 'goldman_sachs',
    name: 'Goldman Sachs',
    brandColor: '#1B365D',
    badgeBg: 'bg-slate-50',
    badgeText: 'text-slate-800 border-slate-200',
    role: 'Analyst / Associate • Engineering & Quantitative Strategy',
    packageRange: '₹28 - 42 LPA / $145k+',
    tier: 'Enterprise FinTech',
    description: 'Renowned for rigorous questions in Dynamic Programming, Math, Probability, High-Frequency Trading systems, and low-latency algorithmic execution.',
    recommendedCourseIds: ['crs_3', 'crs_4'],
    dsaTopics: [
      {
        id: 'gs_dsa_1',
        name: 'Math, Number Theory & Probability DSA',
        category: 'Algorithms',
        difficulty: 'Hard',
        frequency: '92% Frequency',
        description: 'Prime factorizations, modular arithmetic, probability DP, combinatorics.',
        keyAlgorithms: ['Sieve of Eratosthenes', 'Fast Exponentiation', 'Expected Value Calculations']
      },
      {
        id: 'gs_dsa_2',
        name: 'High-Frequency Order Book Simulation',
        category: 'Data Structures',
        difficulty: 'Crucial',
        frequency: '90% Frequency',
        description: 'Design high-throughput trade matching engine using Doubly Linked Lists & TreeMaps.',
        keyAlgorithms: ['B-Tree & Red-Black Tree traversals', 'Limit Order Book Matching Algorithm']
      },
      {
        id: 'gs_dsa_3',
        name: 'Dynamic Programming on Financial Trees',
        category: 'Algorithms',
        difficulty: 'Hard',
        frequency: '88% Frequency',
        description: 'Stock buy and sell variations (I, II, III, IV, with Cooldown, with Transaction Fee).',
        keyAlgorithms: ['State Machine Dynamic Programming', 'Maximum Subarray (Kadane)']
      }
    ],
    interviewRounds: [
      {
        roundNumber: 1,
        title: 'Aptitude & Coding OA',
        type: 'Math + DSA (HackerRank)',
        focus: 'Quantitative aptitude, probability puzzles, and 2 algorithmic questions.',
        tips: 'Practice fast mental math and combinatorics.'
      },
      {
        roundNumber: 2,
        title: 'Technical Round 1: DSA & Math',
        type: 'Live Coding',
        focus: 'Stock buy/sell, Subarray sums, Tree traversals.',
        tips: 'Provide mathematical proof of optimal solution.'
      },
      {
        roundNumber: 3,
        title: 'Technical Round 2: Low-Latency Systems',
        type: 'Core CS Fundamentals',
        focus: 'OS memory management, cache misses, thread safety, locks vs lock-free.',
        tips: 'Highlight understanding of hardware architecture and latency.'
      },
      {
        roundNumber: 4,
        title: 'Managing Director (MD) Round',
        type: 'Culture & FinTech Acumen',
        focus: 'Integrity, handling high stakes, dedication to technical excellence.',
        tips: 'Demonstrate calm precision and business acumen.'
      }
    ],
    hiringCriteria: [
      'Mathematical maturity and analytical rigor',
      'Extreme focus on execution latency and memory overhead',
      'Bulletproof attention to financial data accuracy'
    ]
  }
];

export const getDreamCompanyById = (id: string): DreamCompany | undefined => {
  return DREAM_COMPANIES_DATA.find(c => c.id.toLowerCase() === id.toLowerCase() || c.name.toLowerCase() === id.toLowerCase());
};
