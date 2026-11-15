export type AcademicYearOption = '1st Year' | '2nd Year' | 'Final Year';
export type DailyLearningTimeOption = '< 1 hour' | '1–2 hours' | '3+ hours';
export type CareerGoalOption = 'Job' | 'Government Job' | 'Higher Studies' | 'Startup / Business' | 'Not Sure';

export interface PhaseTaskItem {
  id: string;
  title: string;
  description: string;
  mandatory: boolean;
  estimatedMinutes: number;
}

export interface PhaseQuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface PhaseQuiz {
  phaseId: string;
  title: string;
  passingScorePct: number; // e.g. 70
  questions: PhaseQuizQuestion[];
}

export interface StudentProfileData {
  studentName: string;
  branch: string;
  academicYear: AcademicYearOption;
  dailyLearningTime: DailyLearningTimeOption;
  careerGoal: CareerGoalOption;
  targetCompany?: string;
}

/**
 * Returns customized curriculum recommendations based on academic year, goal, and study hours.
 */
export function getPersonalizedRoadmapMeta(
  profile: StudentProfileData,
  careerTitle: string
) {
  // 1. Year Focus
  let yearFocus = '';
  if (profile.academicYear === '1st Year') {
    yearFocus = 'Building strong fundamentals, core syntax, computer science fundamentals, and basic problem solving.';
  } else if (profile.academicYear === '2nd Year') {
    yearFocus = 'Deepening technical specialization, hands-on framework projects, Data Structures & Algorithms, and modern tools.';
  } else {
    yearFocus = 'Intensive campus placement prep, mock technical interviews, production capstone projects, aptitude, and resume readiness.';
  }

  // 2. Goal Focus
  let goalFocus = '';
  if (profile.careerGoal === 'Job') {
    goalFocus = 'Prioritizing industry-demanded tech stacks, GitHub portfolio deployments, and technical interview problem solving.';
  } else if (profile.careerGoal === 'Government Job') {
    goalFocus = 'Focusing on technical concepts relevant to state/central engineering exams, aptitude, reasoning, and core diploma curriculum.';
  } else if (profile.careerGoal === 'Higher Studies') {
    goalFocus = 'Strengthening theoretical CS fundamentals, engineering mathematics, and ECET/GATE entrance syllabus.';
  } else if (profile.careerGoal === 'Startup / Business') {
    goalFocus = 'Building rapid MVP prototypes, full-stack product architecture, scalable databases, and indie developer fundamentals.';
  } else {
    goalFocus = 'Broad exploration of software engineering disciplines with hands-on guided milestones to help discover your niche.';
  }

  // 3. Daily Learning Pace
  let paceDescription = '';
  let timelineMultiplier = 1;
  if (profile.dailyLearningTime === '< 1 hour') {
    paceDescription = 'Bite-sized daily lessons (30–45 mins). Steady, consistent learning paced over an extended timeline.';
    timelineMultiplier = 1.5;
  } else if (profile.dailyLearningTime === '3+ hours') {
    paceDescription = 'Intensive immersion (3+ hrs/day). Fast-track hands-on coding, deep architectural projects, and extensive practice.';
    timelineMultiplier = 0.75;
  } else {
    paceDescription = 'Balanced daily routine (1–2 hrs/day). Ideal combination of conceptual theory, interactive coding, and quiz validation.';
    timelineMultiplier = 1.0;
  }

  const aiRecommendationReason = `Tailored for ${profile.studentName} (${profile.branch}, ${profile.academicYear}). Target Goal: ${profile.careerGoal}. Focus: ${yearFocus} ${goalFocus}`;

  return {
    yearFocus,
    goalFocus,
    paceDescription,
    timelineMultiplier,
    aiRecommendationReason,
  };
}

/**
 * Default structured tasks for any phase if not specifically provided
 */
export function getPhaseDefaultTasks(careerId: string, phaseIndex: number, phaseTitle: string): PhaseTaskItem[] {
  const pNum = phaseIndex + 1;
  return [
    {
      id: `${careerId}-p${pNum}-t1`,
      title: `Study Core Concepts: ${phaseTitle.replace(/^Phase \d+:\s*/i, '')}`,
      description: 'Review the detailed theory modules, documentation, and conceptual principles for this milestone.',
      mandatory: true,
      estimatedMinutes: 45,
    },
    {
      id: `${careerId}-p${pNum}-t2`,
      title: 'Hands-on Practice & Code Exercises',
      description: 'Write, debug, and run code samples applying the competencies learned in this phase.',
      mandatory: true,
      estimatedMinutes: 60,
    },
    {
      id: `${careerId}-p${pNum}-t3`,
      title: 'Mini-Project / Implementation Checklist',
      description: 'Build a functional implementation or mini-component verifying your understanding.',
      mandatory: true,
      estimatedMinutes: 90,
    },
    {
      id: `${careerId}-p${pNum}-t4`,
      title: 'Review Documentation & Best Practices',
      description: 'Go through industry design patterns, error handling conventions, and code hygiene rules.',
      mandatory: false,
      estimatedMinutes: 30,
    },
  ];
}

/**
 * Phase Knowledge Quizzes repository
 */
export const PHASE_QUIZZES: Record<string, PhaseQuiz> = {
  // Generic / Fallback Phase Quizzes
  'default-phase-1': {
    phaseId: 'phase-1',
    title: 'Phase 1: Core Fundamentals Knowledge Check',
    passingScorePct: 70,
    questions: [
      {
        id: 'q1',
        question: 'Which of the following best describes time complexity O(1)?',
        options: ['Constant time operation', 'Linear scan through all elements', 'Logarithmic search', 'Quadratic comparison'],
        correctIndex: 0,
        explanation: 'O(1) signifies constant time complexity where execution time remains independent of input size.',
      },
      {
        id: 'q2',
        question: 'What is the primary purpose of version control systems like Git?',
        options: ['Compile source code into binaries', 'Track revisions, branches, and collaborate safely', 'Host web servers in cloud', 'Manage SQL database migrations'],
        correctIndex: 1,
        explanation: 'Git allows developers to track history, branch changes, and collaborate without overwriting work.',
      },
      {
        id: 'q3',
        question: 'Which data structure follows the First-In-First-Out (FIFO) principle?',
        options: ['Stack', 'Queue', 'Binary Tree', 'Max Heap'],
        correctIndex: 1,
        explanation: 'A Queue follows First-In-First-Out (FIFO) order.',
      },
    ],
  },
  'default-phase-2': {
    phaseId: 'phase-2',
    title: 'Phase 2: Intermediate Architecture Knowledge Check',
    passingScorePct: 70,
    questions: [
      {
        id: 'q1',
        question: 'What is the main benefit of Encapsulation in Object-Oriented Programming?',
        options: ['Making all variables global', 'Hiding internal state and exposing only necessary methods', 'Executing code in parallel threads', 'Compressing memory footprint'],
        correctIndex: 1,
        explanation: 'Encapsulation restricts direct access to some of an object\'s components to prevent unauthorized modifications.',
      },
      {
        id: 'q2',
        question: 'Which HTTP status code represents a successful resource creation?',
        options: ['200 OK', '201 Created', '204 No Content', '304 Not Modified'],
        correctIndex: 1,
        explanation: 'HTTP 201 Created is returned when a new resource has been successfully generated on the server.',
      },
      {
        id: 'q3',
        question: 'What is an idempotent API operation?',
        options: ['An operation that returns 500 on failure', 'An operation that produces the same server state regardless of how many times it is executed', 'An operation that runs asynchronously in background', 'An operation that requires biometric authorization'],
        correctIndex: 1,
        explanation: 'Idempotent HTTP methods (like GET, PUT, DELETE) leave the system in the exact same state if called multiple times.',
      },
    ],
  },
  'default-phase-3': {
    phaseId: 'phase-3',
    title: 'Phase 3: Advanced Systems & Integration Check',
    passingScorePct: 70,
    questions: [
      {
        id: 'q1',
        question: 'What is the primary role of a database Index (e.g. B-Tree)?',
        options: ['Encrypt stored passwords', 'Speed up data retrieval queries at the expense of extra storage and slower writes', 'Ensure tables are normalized to 3NF', 'Prevent cross-site scripting attacks'],
        correctIndex: 1,
        explanation: 'Indexes drastically accelerate SELECT queries by providing quick lookup trees.',
      },
      {
        id: 'q2',
        question: 'Which caching strategy stores frequently accessed key-values in in-memory storage (e.g., Redis)?',
        options: ['Disk write-ahead logging', 'In-memory caching', 'Round-robin load balancing', 'Garbage collection cycle'],
        correctIndex: 1,
        explanation: 'In-memory caching with Redis or Memcached provides sub-millisecond data access for hot data.',
      },
      {
        id: 'q3',
        question: 'What does JWT (JSON Web Token) contain in its three separated segments?',
        options: ['Source, Compiled Bytecode, Output', 'Header, Payload, Signature', 'Username, Password, Salt', 'Schema, Table, Row'],
        correctIndex: 1,
        explanation: 'A standard JWT consists of Header, Payload (claims), and cryptographic Signature.',
      },
    ],
  },
  'default-phase-4': {
    phaseId: 'phase-4',
    title: 'Phase 4: Production Deployment & Scalability Check',
    passingScorePct: 70,
    questions: [
      {
        id: 'q1',
        question: 'What is containerization with Docker primarily used for?',
        options: ['Running physical hardware tests', 'Packaging software and its dependencies into a standard unit for consistent deployment across environments', 'Compressing source files into zip archives', 'Generating mock API data'],
        correctIndex: 1,
        explanation: 'Docker isolates apps and their runtimes, eliminating "works on my machine" issues.',
      },
      {
        id: 'q2',
        question: 'What is Continuous Integration (CI)?',
        options: ['Manually uploading code files via FTP once a month', 'Automating the building and testing of code every time a team member commits changes', 'Rewriting legacy code into assembly', 'Buying cloud server subscriptions'],
        correctIndex: 1,
        explanation: 'CI automatically builds and tests pull requests/commits to catch integration bugs early.',
      },
      {
        id: 'q3',
        question: 'Which metric measures the percentage of uptime an enterprise system delivers?',
        options: ['Cyclomatic Complexity', 'High Availability / SLA (e.g., 99.9% uptime)', 'Throughput RPS', 'Bundle size in KB'],
        correctIndex: 1,
        explanation: 'SLA / High Availability measures uptime reliability percentage.',
      },
    ],
  },
};

/**
 * Retrieve the quiz for a given phase
 */
export function getPhaseQuiz(careerId: string, phaseId: string, phaseIndex: number): PhaseQuiz {
  const specificKey = `${careerId}-${phaseId}`;
  if (PHASE_QUIZZES[specificKey]) {
    return PHASE_QUIZZES[specificKey];
  }
  const defaultKey = `default-phase-${(phaseIndex % 4) + 1}`;
  return PHASE_QUIZZES[defaultKey] || PHASE_QUIZZES['default-phase-1'];
}
