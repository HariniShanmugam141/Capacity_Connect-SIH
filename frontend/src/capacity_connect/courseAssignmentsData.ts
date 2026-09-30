export interface AssignmentQuestion {
  id: string;
  question: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
}

export interface CourseAssignmentData {
  courseId: string;
  courseTitle: string;
  questions: AssignmentQuestion[];
}

export const COURSE_ASSIGNMENTS: Record<string, AssignmentQuestion[]> = {
  // 1. Introduction to Machine Learning
  'crs_ml_1': [
    {
      id: 'ml_q1',
      question: 'In Linear Regression, which loss function is minimized to find the optimal weights in Ordinary Least Squares (OLS)?',
      options: ['Mean Squared Error (L2 Loss)', 'Cross-Entropy Loss', 'Hinge Loss', 'Kullback-Leibler Divergence'],
      correctOptionIndex: 0,
      explanation: 'Ordinary Least Squares minimizes the sum of squared residuals, which corresponds to Mean Squared Error (MSE).'
    },
    {
      id: 'ml_q2',
      question: 'What is the primary difference between L1 (Lasso) and L2 (Ridge) regularization?',
      options: [
        'L1 shrinks weights uniformly, while L2 produces sparse feature vectors with exact zeroes',
        'L1 adds the sum of absolute weights causing sparsity; L2 adds the sum of squared weights preventing large weights',
        'L1 is used exclusively for classification, while L2 is used only for regression',
        'L1 prevents underfitting, while L2 prevents gradient explosion in RNNs'
      ],
      correctOptionIndex: 1,
      explanation: 'L1 penalizes absolute values |w| driving non-essential coefficients to zero (feature selection). L2 penalizes w^2 preventing weights from becoming too large.'
    },
    {
      id: 'ml_q3',
      question: 'Which metric is most appropriate for evaluating a binary classifier on an imbalanced dataset where the positive class is rare (1%)?',
      options: ['Accuracy', 'Area Under Precision-Recall Curve (PR-AUC)', 'Mean Absolute Error', 'R-squared'],
      correctOptionIndex: 1,
      explanation: 'On highly imbalanced datasets, Accuracy gives a false sense of success (predicting all negative yields 99%). PR-AUC focuses directly on positive class precision and recall.'
    },
    {
      id: 'ml_q4',
      question: 'In Support Vector Machines (SVM), what role do Support Vectors play?',
      options: [
        'They are outliers that are discarded during the training phase',
        'They are data points closest to the hyperplane that define the maximum margin boundary',
        'They are random centroids used to initialize the decision boundary',
        'They represent the mean vector of each separate class distribution'
      ],
      correctOptionIndex: 1,
      explanation: 'Support vectors are the critical edge samples lying directly on the margin boundaries; the optimal separating hyperplane depends solely on them.'
    },
    {
      id: 'ml_q5',
      question: 'What is the vanishing gradient problem typically caused by in deep neural networks?',
      options: [
        'Using ReLU activation across all hidden layers',
        'Repeated multiplication of derivatives less than 1 when backpropagating through Sigmoid or Tanh activations',
        'Setting the learning rate too high in Adam optimizer',
        'Having too few training examples relative to the parameter count'
      ],
      correctOptionIndex: 1,
      explanation: 'Sigmoid has a maximum derivative of 0.25. When chain-multiplied across multiple layers, gradients shrink exponentially toward zero, preventing early layers from learning.'
    },
    {
      id: 'ml_q6',
      question: 'Which splitting criterion does the CART decision tree algorithm use by default for classification?',
      options: ['Information Gain', 'Gini Impurity', 'Chi-Square Variance', 'Mean Squared Deviation'],
      correctOptionIndex: 1,
      explanation: 'CART (Classification and Regression Trees) uses Gini Impurity for classification splits and Variance Reduction for regression.'
    },
    {
      id: 'ml_q7',
      question: 'In unsupervised learning, what does the silhouette score quantify for a clustering outcome?',
      options: [
        'How many iterations the algorithm took to converge',
        'How similar an object is to its own cluster compared to other clusters',
        'The reconstruction error when projecting to lower dimensions',
        'The exact number of true labels matched by the cluster centroids'
      ],
      correctOptionIndex: 1,
      explanation: 'Silhouette score measures both intra-cluster cohesion (a) and inter-cluster separation (b), ranging from -1 to +1.'
    },
    {
      id: 'ml_q8',
      question: 'In Principal Component Analysis (PCA), the principal components correspond to which mathematical vectors?',
      options: [
        'Eigenvectors of the data covariance matrix ordered by descending eigenvalues',
        'Gradient vectors of the loss landscape at global minima',
        'Orthogonal projection vectors determined by cross-validation',
        'Weight vectors initialized by Xavier normal distribution'
      ],
      correctOptionIndex: 0,
      explanation: 'PCA computes the eigenvectors of the covariance matrix. The eigenvectors with largest eigenvalues capture the axes of maximum variance.'
    },
    {
      id: 'ml_q9',
      question: 'What is the main advantage of Random Forests over single Decision Trees?',
      options: [
        'Random Forests eliminate bias completely',
        'Ensemble bagging with random feature subsets significantly reduces variance without increasing bias',
        'Random Forests train faster on single-threaded CPUs',
        'Random Forests produce simple if-else rules that are easier to interpret than a single tree'
      ],
      correctOptionIndex: 1,
      explanation: 'By averaging predictions across decorrelated trees trained on bootstrap samples with random feature subsets, Random Forest drastically cuts variance and prevents overfitting.'
    },
    {
      id: 'ml_q10',
      question: 'When using K-Fold Cross-Validation, if K = 5 and the dataset has 10,000 samples, how many samples are in each validation fold?',
      options: ['1,000 samples', '2,000 samples', '5,000 samples', '8,000 samples'],
      correctOptionIndex: 1,
      explanation: '10,000 divided by 5 equals 2,000 samples per fold. In each iteration, 8,000 samples train the model and 2,000 validate it.'
    }
  ],

  // 2. Artificial Intelligence
  'crs_ai_2': [
    {
      id: 'ai_q1',
      question: 'Under what condition is the A* graph search algorithm guaranteed to be optimal (find the lowest-cost path)?',
      options: [
        'The heuristic h(n) must be admissible (never overestimate true cost) and consistent',
        'The branching factor b must always be less than 2',
        'The heuristic function h(n) must equal zero for all non-goal nodes',
        'All path step costs must be non-zero negative values'
      ],
      correctOptionIndex: 0,
      explanation: 'For tree search, admissibility is sufficient; for graph search, consistency (monotonicity) guarantees that A* never re-opens expanded states and finds the optimal path.'
    },
    {
      id: 'ai_q2',
      question: 'In adversarial search, how does Alpha-Beta pruning optimize the standard Minimax algorithm?',
      options: [
        'It changes the minimax evaluation score of the terminal leaves',
        'It prunes branches that cannot influence the final decision, reducing effective branching factor without altering the outcome',
        'It converts sequential two-player games into parallel simultaneous games',
        'It replaces recursive search with linear matrix multiplication'
      ],
      correctOptionIndex: 1,
      explanation: 'Alpha-Beta pruning skips evaluating subtrees once it establishes that a player can achieve a better or equal outcome elsewhere, yielding identical results in O(b^(d/2)) time.'
    },
    {
      id: 'ai_q3',
      question: 'In First-Order Logic (FOL), what does the unification algorithm accomplish?',
      options: [
        'It proves that a set of clauses is logically valid without resolution',
        'It finds a substitution mapping variables to terms that makes two expressions syntactically identical',
        'It converts first-order logic sentences into propositional truth tables',
        'It eliminates all existential quantifiers by replacing them with universal quantifiers'
      ],
      correctOptionIndex: 1,
      explanation: 'Unification finds the Most General Unifier (MGU) — a substitution θ that makes two atomic sentences identical so resolution can be performed.'
    },
    {
      id: 'ai_q4',
      question: 'Which heuristic in Constraint Satisfaction Problems (CSP) selects the variable with the fewest legal values remaining?',
      options: ['Minimum Remaining Values (MRV)', 'Degree Heuristic', 'Least Constraining Value', 'Forward Checking'],
      correctOptionIndex: 0,
      explanation: 'The Minimum Remaining Values (MRV) or "fail-first" heuristic picks the most constrained variable to prune the search tree early.'
    },
    {
      id: 'ai_q5',
      question: 'What is the purpose of AC-3 (Arc Consistency Algorithm #3) in constraint satisfaction?',
      options: [
        'It finds all complete solutions to the constraint problem simultaneously',
        'It eliminates domain values of variables that have no valid counterpart in neighboring constrained variables',
        'It calculates the probabilistic probability distribution over hidden Markov states',
        'It generates neural network embedding vectors for discrete variables'
      ],
      correctOptionIndex: 1,
      explanation: 'AC-3 maintains directed arc consistency: for every value x in domain(Xi), there must exist some value y in domain(Xj) satisfying the constraint (Xi, Xj).'
    },
    {
      id: 'ai_q6',
      question: 'In Markov Decision Processes (MDP), what does the Bellman Optimality Equation describe?',
      options: [
        'The maximum entropy over historical agent trajectories',
        'The relationship between the value of an optimal state and the values of its possible successor states',
        'The computational time required for policy iteration to converge',
        'The gradient update step for deep Q-networks'
      ],
      correctOptionIndex: 1,
      explanation: 'The Bellman equation expresses that the optimal value V*(s) is the expected immediate reward plus the discounted optimal value of the next state: max_a [R(s,a) + γ ∑ P(s\'|s,a)V*(s\')].'
    },
    {
      id: 'ai_q7',
      question: 'What distinguishes Q-Learning from SARSA in reinforcement learning?',
      options: [
        'Q-Learning is off-policy (uses max action for next state update), whereas SARSA is on-policy (uses actual taken action)',
        'Q-Learning cannot handle discrete state spaces, whereas SARSA handles continuous spaces',
        'Q-Learning requires an environment model, whereas SARSA is model-free',
        'Q-Learning optimizes value iteration, whereas SARSA is an actor-critic algorithm'
      ],
      correctOptionIndex: 0,
      explanation: 'Q-learning updates Q(s,a) using the greedy maximum action max_a\' Q(s\',a\') regardless of current exploration policy (off-policy). SARSA uses Q(s\',a\') where a\' is the actual policy choice (on-policy).'
    },
    {
      id: 'ai_q8',
      question: 'In probabilistic reasoning with Bayesian Networks, when are two nodes X and Y conditionally independent given a set of evidence nodes Z?',
      options: [
        'When they are separated by an odd number of directed arcs',
        'When every undirected path between X and Y is d-separated by Z',
        'When the joint probability P(X, Y) is equal to 1',
        'When both X and Y have zero child nodes in the DAG'
      ],
      correctOptionIndex: 1,
      explanation: 'D-separation (directional separation) is the formal graphical criterion that guarantees conditional independence in Bayesian belief networks.'
    },
    {
      id: 'ai_q9',
      question: 'What is the primary vulnerability of naive Hill Climbing local search?',
      options: [
        'It consumes exponential memory proportional to search depth',
        'It can become trapped on local maxima, ridges, and plateaus without reaching the global optimum',
        'It cannot evaluate continuous objective functions',
        'It requires expanding all neighboring states into a sorted priority queue'
      ],
      correctOptionIndex: 1,
      explanation: 'Hill climbing only moves in directions of immediate improvement, making it susceptible to getting stuck on local peaks, flat plateaus, or narrow ridges.'
    },
    {
      id: 'ai_q10',
      question: 'In natural language understanding and knowledge graphs, what does an Entity Linking model perform?',
      options: [
        'It tokenizes raw text into byte-pair character encodings',
        'It maps text mentions of real-world entities to their unique canonical identifier in a knowledge base',
        'It calculates the syntactic parse tree depth of a sentence',
        'It summarizes multi-paragraph documents into three sentences'
      ],
      correctOptionIndex: 1,
      explanation: 'Entity Linking (or Wikification) resolves ambiguous text mentions (e.g., "Paris") to unambiguous nodes in a knowledge graph (e.g., Paris, France vs. Paris Hilton).'
    }
  ],

  // 3. Computer Networks
  'crs_net_3': [
    {
      id: 'net_q1',
      question: 'Which layer of the OSI model is responsible for end-to-end flow control, segmentation, and reliable message delivery?',
      options: ['Data Link Layer', 'Network Layer', 'Transport Layer', 'Session Layer'],
      correctOptionIndex: 2,
      explanation: 'The Transport Layer (Layer 4, e.g., TCP) provides process-to-process communication, connection management, flow control, and error recovery.'
    },
    {
      id: 'net_q2',
      question: 'During the TCP three-way handshake, what flags are set in the second packet transmitted by the server?',
      options: ['SYN only', 'SYN and ACK', 'ACK only', 'FIN and ACK'],
      correctOptionIndex: 1,
      explanation: 'The client sends SYN, the server replies with SYN-ACK (acknowledging client sequence and announcing its own), and client completes with ACK.'
    },
    {
      id: 'net_q3',
      question: 'In IPv4 subnetting, how many usable host IP addresses are available in a /26 subnet?',
      options: ['64', '62', '32', '30'],
      correctOptionIndex: 1,
      explanation: 'A /26 subnet has 32 - 26 = 6 host bits, giving 2^6 = 64 total addresses. Subtracting network address and broadcast address leaves 62 usable host IPs.'
    },
    {
      id: 'net_q4',
      question: 'Which routing protocol uses Dijkstra’s Shortest Path First algorithm and floods Link-State Advertisements (LSAs)?',
      options: ['BGP (Border Gateway Protocol)', 'RIP (Routing Information Protocol)', 'OSPF (Open Shortest Path First)', 'EGP (Exterior Gateway Protocol)'],
      correctOptionIndex: 2,
      explanation: 'OSPF is an Interior Gateway Protocol based on link-state technology that builds a topology database and executes Dijkstra algorithm.'
    },
    {
      id: 'net_q5',
      question: 'What is the purpose of ARP (Address Resolution Protocol)?',
      options: [
        'Resolve human-readable domain names to IPv4 addresses',
        'Map known IP addresses to physical MAC addresses on a local broadcast network',
        'Assign dynamic IP addresses automatically to newly connected host devices',
        'Translate private internal IP addresses to public internet IP addresses'
      ],
      correctOptionIndex: 1,
      explanation: 'ARP translates Layer 3 IP addresses to Layer 2 Ethernet MAC addresses within a local area network broadcast domain.'
    },
    {
      id: 'net_q6',
      question: 'Which TCP congestion control mechanism linearly increases congestion window (CWND) by 1 MSS each RTT after reaching the slow start threshold (ssthresh)?',
      options: ['Slow Start', 'Congestion Avoidance', 'Fast Recovery', 'Selective Acknowledgment'],
      correctOptionIndex: 1,
      explanation: 'Once CWND reaches ssthresh, TCP enters Congestion Avoidance using Additive Increase Multiplicative Decrease (AIMD), incrementing CWND by 1 MSS per RTT.'
    },
    {
      id: 'net_q7',
      question: 'What is the maximum transmission unit (MTU) typically configured for standard Ethernet frames?',
      options: ['576 bytes', '1500 bytes', '4096 bytes', '9000 bytes'],
      correctOptionIndex: 1,
      explanation: 'Standard Ethernet specifies a maximum IP payload (MTU) of 1500 bytes without IP fragmentation.'
    },
    {
      id: 'net_q8',
      question: 'How does DNS recursive resolution differ from iterative DNS resolution?',
      options: [
        'Recursive DNS only resolves .org domains, whereas iterative resolves all domains',
        'In recursive resolution, the client asks the resolver to do all the work and return the final answer; in iterative resolution, the server returns referrals to other servers',
        'Recursive resolution runs over UDP port 53, while iterative runs exclusively over TCP port 443',
        'Recursive resolution caches answers for 1 year, while iterative never caches'
      ],
      correctOptionIndex: 1,
      explanation: 'With recursive queries, the server accepts full responsibility to chase referrals and deliver the exact record. Iterative queries return the best referral known so the querier queries next.'
    },
    {
      id: 'net_q9',
      question: 'In TLS 1.3, how many round trips (RTT) are required to complete the initial cryptographic handshake before application data can be sent?',
      options: ['0 RTT (always for first connection)', '1 RTT', '2 RTT', '3 RTT'],
      correctOptionIndex: 1,
      explanation: 'TLS 1.3 combines key exchange and cipher suite negotiation into the initial Hello messages, completing the handshake in just 1 RTT (and 0-RTT on resumption).'
    },
    {
      id: 'net_q10',
      question: 'What mechanism in BGP prevents routing loops between Autonomous Systems (AS)?',
      options: [
        'Split horizon rule on interior links',
        'The AS_PATH attribute: routers drop route announcements containing their own AS number',
        'Time To Live (TTL) decrementing in the IP packet header',
        'Spanning Tree Protocol (STP) root election'
      ],
      correctOptionIndex: 1,
      explanation: 'BGP is a path-vector protocol. As an update passes through each AS, the AS prepends its ASN. If a BGP router receives an update containing its own ASN in AS_PATH, it rejects it to avoid loops.'
    }
  ],

  // 4. Programming and Data Structure
  'crs_dsa_4': [
    {
      id: 'dsa_q1',
      question: 'What is the worst-case time complexity of searching for an element in an unbalanced Binary Search Tree (BST)?',
      options: ['O(1)', 'O(log N)', 'O(N)', 'O(N log N)'],
      correctOptionIndex: 2,
      explanation: 'When elements are inserted in sorted order, an unbalanced BST degenerates into a linear linked list, resulting in O(N) search time.'
    },
    {
      id: 'dsa_q2',
      question: 'In an AVL Tree, what balance factor values are permissible for any node to remain valid?',
      options: ['Only 0', '-1, 0, or +1', 'Between -2 and +2', 'Any positive integer'],
      correctOptionIndex: 1,
      explanation: 'An AVL tree strictly requires that the height difference between left and right subtrees (Balance Factor) of any node is in {-1, 0, 1}.'
    },
    {
      id: 'dsa_q3',
      question: 'Which collision resolution technique in hash tables stores collided elements in linked lists outside the hash table buckets?',
      options: ['Linear Probing', 'Quadratic Probing', 'Separate Chaining', 'Double Hashing'],
      correctOptionIndex: 2,
      explanation: 'Separate Chaining handles collisions by maintaining a linked list or auxiliary search tree for each hash bucket index.'
    },
    {
      id: 'dsa_q4',
      question: 'What is the average and worst-case time complexity of QuickSort?',
      options: [
        'Average: O(N log N), Worst: O(N^2)',
        'Average: O(N log N), Worst: O(N log N)',
        'Average: O(N), Worst: O(N log N)',
        'Average: O(N^2), Worst: O(N^3)'
      ],
      correctOptionIndex: 0,
      explanation: 'QuickSort runs in O(N log N) average time, but degenerates to O(N^2) if poor pivots are repeatedly chosen (e.g. smallest/largest element on sorted data).'
    },
    {
      id: 'dsa_q5',
      question: 'Which data structure is most efficiently utilized to implement a Least Recently Used (LRU) Cache in O(1) time for both get and put operations?',
      options: [
        'Array and Min-Heap',
        'Hash Map combined with a Doubly Linked List',
        'Binary Search Tree and Stack',
        'Circular Queue and Dynamic Array'
      ],
      correctOptionIndex: 1,
      explanation: 'The Hash Map provides O(1) key-to-node lookups, while the Doubly Linked List provides O(1) node removals and insertions at the head/tail.'
    },
    {
      id: 'dsa_q6',
      question: 'What is the space complexity of Breadth-First Search (BFS) on a graph with branching factor b and depth d?',
      options: ['O(d)', 'O(b * d)', 'O(b^d)', 'O(1)'],
      correctOptionIndex: 2,
      explanation: 'BFS keeps all generated nodes at the current exploration depth in memory queue, requiring O(b^d) memory in the worst case.'
    },
    {
      id: 'dsa_q7',
      question: 'In a Min-Heap implemented as an array where index starts at 0, what is the array index of the left child of node at index i?',
      options: ['2*i', '2*i + 1', '2*i + 2', 'i / 2'],
      correctOptionIndex: 1,
      explanation: 'For zero-based heap indexing, the left child of node i is at 2*i + 1 and the right child is at 2*i + 2.'
    },
    {
      id: 'dsa_q8',
      question: 'Which graph algorithm finds the shortest path between all pairs of vertices in a weighted graph with possible negative edge weights (but no negative cycles)?',
      options: ['Dijkstra’s Algorithm', 'Kruskal’s Algorithm', 'Floyd-Warshall Algorithm', 'Prim’s Algorithm'],
      correctOptionIndex: 2,
      explanation: 'The Floyd-Warshall dynamic programming algorithm computes all-pairs shortest paths in O(V^3) time and handles negative edge weights.'
    },
    {
      id: 'dsa_q9',
      question: 'What is the amortized time complexity of inserting an element into a dynamic array (like Python list or C++ std::vector)?',
      options: ['O(1)', 'O(log N)', 'O(N)', 'O(N^2)'],
      correctOptionIndex: 0,
      explanation: 'While resizing takes O(N), doubling capacity ensures resizing happens exponentially infrequently, resulting in an amortized O(1) cost per append.'
    },
    {
      id: 'dsa_q10',
      question: 'In Dynamic Programming, what are the two essential characteristics a problem must exhibit to be solved with DP?',
      options: [
        'Optimal substructure and overlapping subproblems',
        'Greedy choice property and polynomial complexity',
        'Divide and conquer structure with independent subproblems',
        'Deterministic transitions and acyclic state graphs'
      ],
      correctOptionIndex: 0,
      explanation: 'Optimal substructure means optimal solutions to subproblems form optimal solutions to the whole problem; overlapping subproblems means the same subproblems are solved repeatedly.'
    }
  ],

  // 13. Python for Beginners
  'crs_py_13': [
    {
      id: 'py_q1',
      question: 'Which of the following built-in data types in Python is immutable?',
      options: ['list', 'dict', 'set', 'tuple'],
      correctOptionIndex: 3,
      explanation: 'Tuples (and strings, integers, floats, frozensets) are immutable in Python; their contents cannot be altered once created.'
    },
    {
      id: 'py_q2',
      question: 'What is the output of the expression `bool([])` in Python?',
      options: ['True', 'False', 'None', 'ValueError'],
      correctOptionIndex: 1,
      explanation: 'Empty sequences and collections (empty lists, tuples, dicts, strings, 0) evaluate to False in boolean context.'
    },
    {
      id: 'py_q3',
      question: 'How do you create a generator function in Python?',
      options: [
        'By using the `generate` keyword in the function signature',
        'By using the `yield` statement instead of `return` to emit values lazily',
        'By prefixing the function definition with the `@generator` decorator',
        'By returning an instance of `iter()` from a lambda function'
      ],
      correctOptionIndex: 1,
      explanation: 'A function containing one or more `yield` statements is a generator function. It pauses state and produces values on demand.'
    },
    {
      id: 'py_q4',
      question: 'What does the `*args` syntax in a Python function definition signify?',
      options: [
        'It allows passing a variable number of positional arguments as a tuple',
        'It passes arguments by pointer reference instead of object reference',
        'It requires all arguments to be multiplied together',
        'It unpacks keyword arguments into a dictionary'
      ],
      correctOptionIndex: 0,
      explanation: '`*args` collects arbitrary extra positional arguments into a tuple, while `**kwargs` collects arbitrary keyword arguments into a dictionary.'
    },
    {
      id: 'py_q5',
      question: 'What is the purpose of the `__init__` method in a Python class?',
      options: [
        'To allocate raw memory for a new object before instantiation',
        'To initialize instance attributes when a new object instance is created',
        'To define how the object is represented as a string',
        'To delete the object when garbage collection triggers'
      ],
      correctOptionIndex: 1,
      explanation: '`__init__` is the initializer method called immediately after `__new__` creates the instance, setting up its initial state and attributes.'
    },
    {
      id: 'py_q6',
      question: 'What is the result of `[x**2 for x in range(5) if x % 2 == 1]`?',
      options: ['[1, 9]', '[0, 4, 16]', '[1, 4, 9]', '[1, 3, 5]'],
      correctOptionIndex: 0,
      explanation: 'range(5) produces 0, 1, 2, 3, 4. The condition filters odd numbers (1, 3). Squaring them yields 1^2=1 and 3^2=9, resulting in [1, 9].'
    },
    {
      id: 'py_q7',
      question: 'In Python file handling, what is the benefit of using `with open("file.txt", "r") as f:`?',
      options: [
        'It encrypts the file contents during reading',
        'It automatically handles closing the file even if exceptions occur during execution',
        'It reads the file multi-threaded across all CPU cores',
        'It prevents other operating system processes from reading the file'
      ],
      correctOptionIndex: 1,
      explanation: 'The `with` statement utilizes the Context Manager protocol (`__enter__` and `__exit__`), guaranteeing file descriptor cleanup even on exceptions.'
    },
    {
      id: 'py_q8',
      question: 'What exception is raised when trying to retrieve a non-existent key from a Python dictionary using `d[key]`?',
      options: ['IndexError', 'KeyError', 'AttributeError', 'ValueError'],
      correctOptionIndex: 1,
      explanation: 'Direct subscript indexing `d[key]` raises a KeyError if key is missing. Using `d.get(key)` returns None without raising an error.'
    },
    {
      id: 'py_q9',
      question: 'What is the Global Interpreter Lock (GIL) in CPython?',
      options: [
        'A lock that secures Python code from being inspected by debuggers',
        'A mutex that allows only one native thread to execute Python bytecode at a time',
        'A compiler flag that enables JIT optimization',
        'A cryptographic token used for package signing in pip'
      ],
      correctOptionIndex: 1,
      explanation: 'In CPython, the GIL is a mutex preventing multiple OS threads from executing Python bytecodes simultaneously to protect memory management.'
    },
    {
      id: 'py_q10',
      question: 'What will `is` operator compare in Python compared to `==` operator?',
      options: [
        '`is` compares object identity (memory address in memory), while `==` compares object values/equality',
        '`is` compares data types, while `==` compares memory location',
        '`is` performs case-insensitive string comparison, while `==` is case-sensitive',
        '`is` is deprecated in Python 3.12 in favor of `==`'
      ],
      correctOptionIndex: 0,
      explanation: '`is` evaluates whether two variables point to the exact same object in memory (`id(a) == id(b)`), whereas `==` checks value equality via `__eq__`.'
    }
  ]
};

// Fallback generator for other catalog courses so every single course has 10 high-quality questions
export const getCourseAssignmentQuestions = (courseId: string, courseTitle: string): AssignmentQuestion[] => {
  if (COURSE_ASSIGNMENTS[courseId]) {
    return COURSE_ASSIGNMENTS[courseId];
  }

  // Generate customized 10 questions for any course
  const cleanTitle = courseTitle || 'Technical Engineering';

  return [
    {
      id: `${courseId}_q1`,
      question: `What is the foundational architectural principle underlying modern ${cleanTitle}?`,
      options: [
        'Modular abstraction and separation of operational concerns',
        'Monolithic coupling of execution logic with storage',
        'Single-threaded synchronous event polling',
        'Manual static memory allocation without garbage collection'
      ],
      correctOptionIndex: 0,
      explanation: `Modern ${cleanTitle} relies on modular encapsulation, clean interfaces, and separation of concerns to maximize scalability and maintainability.`
    },
    {
      id: `${courseId}_q2`,
      question: `In production environments for ${cleanTitle}, which practice ensures the highest level of system reliability?`,
      options: [
        'Automated CI/CD testing, telemetry observability, and zero-downtime canary deployments',
        'Directly editing production configurations during peak user traffic',
        'Disabling health check endpoints to reduce CPU overhead',
        'Storing credentials and secrets in plaintext source code repositories'
      ],
      correctOptionIndex: 0,
      explanation: 'Reliable engineering mandates automated testing pipelines, real-time observability, secret vaults, and canary rollout strategies.'
    },
    {
      id: `${courseId}_q3`,
      question: `When optimizing performance bottlenecks in ${cleanTitle}, which method is considered an industry best practice?`,
      options: [
        'Empirical profiling and bottleneck benchmarking before introducing optimizations',
        'Guessing algorithmic hotspots without telemetry measurements',
        'Rewriting entire systems into assembly language immediately',
        'Removing all error handling routines to minimize instruction counts'
      ],
      correctOptionIndex: 0,
      explanation: 'Premature optimization is counterproductive. Data-driven profiling with APM and distributed tracing pinpoints genuine algorithmic or I/O hotspots.'
    },
    {
      id: `${courseId}_q4`,
      question: `What role does idempotency play when designing distributed interfaces in ${cleanTitle}?`,
      options: [
        'It guarantees identical results even if a network request is retried multiple times',
        'It forces all database transactions to abort if latency exceeds 10ms',
        'It compresses JSON payloads using Brotli algorithms',
        'It binds each client socket exclusively to a single physical core'
      ],
      correctOptionIndex: 0,
      explanation: 'Idempotency ensures that duplicate or retried RPCs/HTTP requests produce the same state change without unintended side-effects.'
    },
    {
      id: `${courseId}_q5`,
      question: `Which data model design ensures data consistency and minimal redundancy in ${cleanTitle}?`,
      options: [
        'Relational schema normalization (e.g. 3NF) with foreign key constraints',
        'Storing identical JSON strings redundantly in every row',
        'Disabling primary keys to speed up disk writes',
        'Storing timestamps as unformatted localized text strings'
      ],
      correctOptionIndex: 0,
      explanation: 'Database normalization up to Third Normal Form (3NF) eliminates update anomalies and guarantees referential integrity.'
    },
    {
      id: `${courseId}_q6`,
      question: `How does asynchronous non-blocking I/O improve throughput in ${cleanTitle}?`,
      options: [
        'By utilizing event loops to service other tasks while awaiting network or disk operations',
        'By halting CPU execution until the storage subsystem acknowledges the byte write',
        'By multiplying clock frequencies dynamically',
        'By running every single function on a separate physical host machine'
      ],
      correctOptionIndex: 0,
      explanation: 'Non-blocking I/O allows a thread/process to handle concurrent connections efficiently without stalling on high-latency I/O waits.'
    },
    {
      id: `${courseId}_q7`,
      question: `In security engineering for ${cleanTitle}, what is the Principle of Least Privilege?`,
      options: [
        'Entities are granted only the minimum permissions required to perform their specific function',
        'All users receive administrator credentials to prevent support ticket backlog',
        'Access controls are evaluated only once during yearly audits',
        'Passwords must be shared among all team members for easy collaboration'
      ],
      correctOptionIndex: 0,
      explanation: 'Least privilege mitigates attack blast radius by restricting access rights for users, service accounts, and processes to the bare necessary minimum.'
    },
    {
      id: `${courseId}_q8`,
      question: `What metric is universally tracked to monitor service availability and uptime in ${cleanTitle}?`,
      options: [
        'Service Level Objective (SLO) compliance and error budget consumption',
        'Total number of lines of source code committed per week',
        'Font size used in architectural documentation',
        'Number of comments written in unit test suites'
      ],
      correctOptionIndex: 0,
      explanation: 'Service Level Objectives (SLOs) and Error Budgets (from Google SRE principles) quantify system availability against business tolerance.'
    },
    {
      id: `${courseId}_q9`,
      question: `Which pattern handles sudden traffic spikes by temporarily shedding load or queuing requests in ${cleanTitle}?`,
      options: [
        'Rate limiting, circuit breakers, and distributed message broker buffering',
        'Infinite retry loops with zero backoff',
        'Crashing the primary database server immediately',
        'Ignoring client disconnection signals'
      ],
      correctOptionIndex: 0,
      explanation: 'Token bucket rate limiting, circuit breaking, and queues (Kafka/RabbitMQ) absorb surges and prevent cascading service outages.'
    },
    {
      id: `${courseId}_q10`,
      question: `What is the significance of semantic versioning (SemVer) when publishing modules in ${cleanTitle}?`,
      options: [
        'MAJOR.MINOR.PATCH explicitly signals breaking API changes, backward-compatible features, and bug fixes',
        'It generates automated security patches automatically using neural networks',
        'It restricts developers to releasing updates only on Sundays',
        'It prevents competitors from reading public API endpoints'
      ],
      correctOptionIndex: 0,
      explanation: 'SemVer (X.Y.Z) conveys exact compatibility intent: X signals breaking changes, Y introduces backward-compatible features, and Z provides bug fixes.'
    }
  ];
};
