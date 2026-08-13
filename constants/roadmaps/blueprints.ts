export interface ProjectRec {
  name: string;
  description: string;
  tech: string[];
}

export interface CareerBlueprint {
  id: string;
  title: string;
  category: string;
  icon: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  overview: string;
  estimatedTimeline: string;
  expectedSalaryRange: string;
  initialReadinessScore: number;
  potentialReadinessScore: number;
  aiSummaryTemplate: string;
  motivationalMessage: string;
  currentSkillsSample: string[];
  missingSkills: string[];
  weeklySchedule: Record<string, string>;
  monthlyGoals: { month: string; goal: string }[];
  phases: {
    id: string;
    title: string;
    description: string;
    topics: string[];
    estimatedTime: string;
  }[];
  projects: ProjectRec[];
  certifications: string[];
  softSkills: string[];
  placementPrep: {
    easyProblems: number;
    mediumProblems: number;
    hardProblems: number;
    mockInterviews: number;
    checklist: string[];
  };
  companyPrep: Record<string, string[]>;
  recommendedBooks: string[];
  youtubeChannels: string[];
  websites: string[];
}

export const CAREER_BLUEPRINTS: Record<string, CareerBlueprint> = {
  'fullstack-developer': {
    id: 'fullstack-developer',
    title: 'Full Stack Developer',
    category: 'Web Development',
    icon: 'layers',
    difficulty: 'Intermediate',
    overview: 'End-to-end modern web development engineering, microservices, frontend UI frameworks, and scalable cloud backends.',
    estimatedTimeline: '8 Months',
    expectedSalaryRange: '₹5.5 LPA - ₹20 LPA',
    initialReadinessScore: 38,
    potentialReadinessScore: 92,
    aiSummaryTemplate: 'We analyzed your academic profile and career goal. Your personalized roadmap focuses on Full Stack Web Engineering. Based on your current CGPA and study hours, you have an exceptional chance of becoming industry-ready before graduation.',
    motivationalMessage: 'You are currently ahead of many students at your level. Consistently following this blueprint for 8 months will build a world-class portfolio and maximize your placement opportunities.',
    currentSkillsSample: ['HTML5', 'CSS3', 'Basic Java', 'Git Basics'],
    missingSkills: ['React.js', 'Node.js', 'Express', 'TypeScript', 'PostgreSQL', 'System Design', 'Redis', 'Docker'],
    weeklySchedule: {
      Monday: 'DSA & Problem Solving (2 Hrs)',
      Tuesday: 'Frontend React Development (2.5 Hrs)',
      Wednesday: 'Backend Node.js & APIs (2.5 Hrs)',
      Thursday: 'Database & SQL Queries (2 Hrs)',
      Friday: 'Fullstack Project Building (3 Hrs)',
      Saturday: 'System Design & Code Review (2 Hrs)',
      Sunday: 'Weekly Revision & Mock Interview (2 Hrs)'
    },
    monthlyGoals: [
      { month: 'Month 1', goal: 'HTML5, CSS3, ES6+ JS & Git Control' },
      { month: 'Month 2', goal: 'React.js, Hooks, State & Component Architecture' },
      { month: 'Month 3', goal: 'Node.js, Express REST APIs & Authentication' },
      { month: 'Month 4', goal: 'PostgreSQL Database Design & Prisma ORM' },
      { month: 'Month 5', goal: 'Fullstack SaaS Application Development' },
      { month: 'Month 6', goal: 'System Design, Caching & Performance' },
      { month: 'Month 7', goal: 'Portfolio Optimization & Resume Building' },
      { month: 'Month 8', goal: 'Placement Applications & Mock Technical Interviews' }
    ],
    phases: [
      {
        id: 'p1',
        title: 'Phase 1: Modern Web Foundations & ES6+',
        description: 'Master semantic HTML5, CSS Grid/Flexbox, and asynchronous JavaScript.',
        topics: ['Semantic HTML & Accessibility', 'CSS Flexbox & Grid Systems', 'DOM Manipulation', 'ES6+ Arrow Functions & Promises', 'Async/Await & Fetch API'],
        estimatedTime: '3 Weeks'
      },
      {
        id: 'p2',
        title: 'Phase 2: React.js & Frontend Architecture',
        description: 'Build modern interactive SPAs with React hooks and state management.',
        topics: ['React JSX & Component Props', 'useState, useEffect, useMemo, useCallback', 'Context API & Redux Toolkit', 'React Router v6', 'Tailwind CSS Styling'],
        estimatedTime: '4 Weeks'
      },
      {
        id: 'p3',
        title: 'Phase 3: Backend Node.js & RESTful APIs',
        description: 'Construct secure server applications using Express.js and JWT.',
        topics: ['Node.js Event Loop', 'Express Middleware & Routing', 'JWT Authentication & BCrypt', 'Input Validation with Zod', 'Error Handling & Logging'],
        estimatedTime: '4 Weeks'
      },
      {
        id: 'p4',
        title: 'Phase 4: Database Modeling (PostgreSQL & Supabase)',
        description: 'Design relational database schemas, write SQL queries, and ORM integrations.',
        topics: ['PostgreSQL Schema Design', 'SQL JOINs & Indexes', 'Prisma ORM Setup', 'Supabase Realtime & RLS Policies', 'Redis Caching Layer'],
        estimatedTime: '4 Weeks'
      },
      {
        id: 'p5',
        title: 'Phase 5: Fullstack Capstone & DevOps Deployment',
        description: 'Deliver end-to-end production web platforms with CI/CD.',
        topics: ['Next.js 14 App Router', 'Fullstack Server Actions', 'Docker Containerization', 'Deploying on Vercel & AWS'],
        estimatedTime: '5 Weeks'
      },
      {
        id: 'p6',
        title: 'Phase 6: Placement & Technical Interview Prep',
        description: 'Practice high-frequency DSA problems, system design, and mock interviews.',
        topics: ['100+ LeetCode DSA Problems', 'System Design Fundamentals', 'Behavioral & HR Prep', 'ATS Resume & Portfolio Deploy'],
        estimatedTime: '4 Weeks'
      }
    ],
    projects: [
      { name: 'Student Attendance & ERP Portal', description: 'Fullstack campus portal with role-based auth and automated reports.', tech: ['React', 'Node.js', 'PostgreSQL'] },
      { name: 'Real-time Collaborative Workspace', description: 'Notion-like document editor with WebSocket synchronization.', tech: ['Next.js', 'TypeScript', 'Supabase'] },
      { name: 'E-Commerce Marketplace API', description: 'Scalable microservice handling cart checkout and Stripe payments.', tech: ['Express', 'Prisma', 'Redis'] }
    ],
    certifications: ['Meta Front-End Developer Certificate', 'AWS Certified Developer Associate', 'MongoDB Certified Developer'],
    softSkills: ['Technical Communication', 'Problem Solving', 'Time Management', 'Code Review Feedback', 'Agile/Scrum Leadership'],
    placementPrep: {
      easyProblems: 100,
      mediumProblems: 150,
      hardProblems: 20,
      mockInterviews: 5,
      checklist: ['ATS-optimized resume PDF', 'Deployed GitHub Portfolio', 'Active LinkedIn Profile', '150+ Solved LeetCode Questions']
    },
    companyPrep: {
      Google: ['Data Structures & Algorithms (Trees/Graphs)', 'System Design & Scalability', 'Object-Oriented Design', 'Computer Networks & OS'],
      Microsoft: ['Arrays/Strings Manipulation', 'System Architecture', 'DBMS Normalization', 'Behavioral STAR Method'],
      Amazon: ['Amazon Leadership Principles', 'Low Level Design (LLD)', 'Distributed Caching', 'SQL Query Optimization'],
      TCS: ['Aptitude & Logical Reasoning', 'Core Java / C++ Basics', 'DBMS & SQL', 'Project Walkthrough']
    },
    recommendedBooks: ['Clean Code by Robert C. Martin', 'Cracking the Coding Interview by Gayle Laakmann McDowell', 'Grokking Algorithms by Aditya Bhargava', 'System Design Interview by Alex Xu'],
    youtubeChannels: ['take U forward (Striver)', 'Kunal Kushwaha', 'CodeWithHarry', 'Traversy Media', 'freeCodeCamp'],
    websites: ['LeetCode', 'GeeksforGeeks', 'roadmap.sh', 'MDN Web Docs', 'W3Schools']
  },
  'java-developer': {
    id: 'java-developer',
    title: 'Java Developer',
    category: 'Software Engineering',
    icon: 'coffee',
    difficulty: 'Beginner',
    overview: 'Master enterprise Java 17+, Spring Boot microservices, multithreading, and relational database systems.',
    estimatedTimeline: '6 Months',
    expectedSalaryRange: '₹4.5 LPA - ₹16 LPA',
    initialReadinessScore: 42,
    potentialReadinessScore: 94,
    aiSummaryTemplate: 'We analyzed your academic profile and career goal. Your roadmap focuses on Enterprise Java Development. Based on your current CGPA and study hours, you have an excellent chance of becoming industry-ready before graduation.',
    motivationalMessage: 'Java remains the backbone of top enterprise companies. Mastering core OOP and Spring Boot will open immense placement opportunities for you.',
    currentSkillsSample: ['Basic Java', 'Loops & Conditions', 'SQL Fundamentals'],
    missingSkills: ['Spring Boot', 'Spring Data JPA', 'Microservices', 'Multithreading', 'Docker', 'JUnit Testing'],
    weeklySchedule: {
      Monday: 'Core Java OOP Concepts (2.5 Hrs)',
      Tuesday: 'DSA Problems in Java (2 Hrs)',
      Wednesday: 'Spring Boot REST APIs (2.5 Hrs)',
      Thursday: 'MySQL & Hibernate ORM (2 Hrs)',
      Friday: 'Spring Security & Auth (2.5 Hrs)',
      Saturday: 'Project Microservices (3 Hrs)',
      Sunday: 'Revision & Mock Interview (2 Hrs)'
    },
    monthlyGoals: [
      { month: 'Month 1', goal: 'Java 17 Syntax, Arrays, Strings & Collections' },
      { month: 'Month 2', goal: 'OOP Principles, Interfaces & Exception Handling' },
      { month: 'Month 3', goal: 'Multithreading, Streams API & JDBC' },
      { month: 'Month 4', goal: 'Spring Boot REST APIs & Spring Data JPA' },
      { month: 'Month 5', goal: 'Microservices, Docker & Redis Caching' },
      { month: 'Month 6', goal: 'Interview Prep, Resume & Placement Applications' }
    ],
    phases: [
      { id: 'j1', title: 'Phase 1: Core Java Syntax & Arrays', description: 'Variables, loops, control statements, arrays, and methods.', topics: ['Java Basics', 'Control Flow', 'Arrays & Strings', 'Java Methods'], estimatedTime: '2 Weeks' },
      { id: 'j2', title: 'Phase 2: Object-Oriented Programming (OOP)', description: 'Classes, inheritance, polymorphism, encapsulation, and interfaces.', topics: ['Classes & Objects', 'Inheritance & Polymorphism', 'Interfaces & Abstraction', 'Java Collections Framework'], estimatedTime: '3 Weeks' },
      { id: 'j3', title: 'Phase 3: Advanced Java & Streams API', description: 'Concurrency, lambdas, stream operations, and exception handling.', topics: ['Exception Handling', 'Java Multithreading', 'Streams & Lambdas', 'JDBC & File I/O'], estimatedTime: '3 Weeks' },
      { id: 'j4', title: 'Phase 4: Enterprise Spring Boot & JPA', description: 'Production REST APIs using Spring Boot and Spring Data JPA.', topics: ['Spring Boot Dependency Injection', 'Spring MVC REST Controllers', 'Spring Data JPA & Hibernate', 'Spring Security & JWT'], estimatedTime: '4 Weeks' }
    ],
    projects: [
      { name: 'Student Information System API', description: 'RESTful API managing student enrollments and grades.', tech: ['Spring Boot', 'MySQL', 'JPA'] },
      { name: 'E-Commerce Microservice Engine', description: 'Distributed order and inventory management system.', tech: ['Spring Cloud', 'Docker', 'Redis'] }
    ],
    certifications: ['Oracle Certified Professional: Java SE 17 Developer', 'Spring Certified Professional'],
    softSkills: ['Problem Solving', 'Structured Thinking', 'Code Documentation', 'Interview Communication'],
    placementPrep: {
      easyProblems: 90,
      mediumProblems: 120,
      hardProblems: 15,
      mockInterviews: 4,
      checklist: ['Oracle Java Certification Prep', 'GitHub Java Code Repositories', 'Updated Resume PDF']
    },
    companyPrep: {
      TCS: ['Java OOP Concepts', 'Collection Framework', 'SQL Queries', 'Aptitude Test'],
      Infosys: ['DSA in Java', 'DBMS Concepts', 'Exception Handling', 'HR Behavioral Questions'],
      Wipro: ['Basic Logic & Loops', 'String Manipulation', 'Java Multithreading', 'Aptitude']
    },
    recommendedBooks: ['Head First Java by Kathy Sierra', 'Effective Java by Joshua Bloch', 'Spring in Action by Craig Walls'],
    youtubeChannels: ['Durga Software Solutions', 'Telusko', 'Java Techie', 'take U forward'],
    websites: ['GeeksforGeeks', 'JavaTpoint', 'LeetCode', 'Baeldung']
  },
  'ai-engineer': {
    id: 'ai-engineer',
    title: 'AI & Machine Learning Engineer',
    category: 'Artificial Intelligence',
    icon: 'cpu',
    difficulty: 'Advanced',
    overview: 'Build state-of-the-art Generative AI applications, Large Language Models (LLMs), RAG pipelines, and PyTorch models.',
    estimatedTimeline: '8 Months',
    expectedSalaryRange: '₹7.0 LPA - ₹25 LPA',
    initialReadinessScore: 30,
    potentialReadinessScore: 95,
    aiSummaryTemplate: 'We analyzed your academic profile and career goal. Your roadmap focuses on Artificial Intelligence & Machine Learning Engineering. Based on your current CGPA and study hours, you have an outstanding trajectory ahead.',
    motivationalMessage: 'AI is transforming the global technology landscape. Master ML math, PyTorch, and LLM orchestration to position yourself at the cutting edge of tech hiring.',
    currentSkillsSample: ['Python Basics', 'Basic Math', 'Git'],
    missingSkills: ['NumPy/Pandas', 'Scikit-Learn', 'PyTorch', 'Neural Networks', 'Transformers', 'LangChain', 'Vector DBs', 'RAG'],
    weeklySchedule: {
      Monday: 'Math for ML (Linear Algebra & Calculus) (2.5 Hrs)',
      Tuesday: 'Python Data Science (NumPy & Pandas) (2.5 Hrs)',
      Wednesday: 'Machine Learning Algorithms (3 Hrs)',
      Thursday: 'PyTorch Deep Learning Models (3 Hrs)',
      Friday: 'LLMs, Prompt Engineering & RAG (3 Hrs)',
      Saturday: 'AI Project Implementation (4 Hrs)',
      Sunday: 'Research Paper Reading & Revision (2 Hrs)'
    },
    monthlyGoals: [
      { month: 'Month 1', goal: 'Python Data Science Stack (NumPy, Pandas, Matplotlib)' },
      { month: 'Month 2', goal: 'Supervised & Unsupervised Machine Learning Algorithms' },
      { month: 'Month 3', goal: 'Deep Learning Foundations & Neural Networks' },
      { month: 'Month 4', goal: 'PyTorch Model Building & Computer Vision/NLP' },
      { month: 'Month 5', goal: 'Transformers & Large Language Models (LLMs)' },
      { month: 'Month 6', goal: 'Retrieval-Augmented Generation (RAG) & Vector DBs' },
      { month: 'Month 7', goal: 'AI Model Deployment & FastAPI Servicing' },
      { month: 'Month 8', goal: 'Research Portfolio & AI Placement Applications' }
    ],
    phases: [
      { id: 'ai1', title: 'Phase 1: Math & Data Science Stack', description: 'Linear algebra, probability, NumPy, Pandas, and data visualization.', topics: ['Linear Algebra & Matrices', 'Calculus & Optimization', 'NumPy Arrays', 'Pandas Dataframes'], estimatedTime: '4 Weeks' },
      { id: 'ai2', title: 'Phase 2: Core Machine Learning Algorithms', description: 'Regression, Classification, Decision Trees, and Scikit-Learn.', topics: ['Linear & Logistic Regression', 'Decision Trees & Random Forests', 'Model Evaluation & Metrics', 'Scikit-Learn Workflows'], estimatedTime: '4 Weeks' },
      { id: 'ai3', title: 'Phase 3: Deep Learning with PyTorch', description: 'Neural networks, backpropagation, CNNs, and RNNs.', topics: ['Artificial Neural Networks', 'Backpropagation & Gradient Descent', 'Convolutional Neural Networks', 'PyTorch Framework'], estimatedTime: '5 Weeks' },
      { id: 'ai4', title: 'Phase 4: LLMs, Vector DBs & RAG Architecture', description: 'Transformers, Hugging Face, LangChain, Pinecone, and RAG systems.', topics: ['Transformer Self-Attention', 'OpenAI & Hugging Face APIs', 'Vector DBs (Pinecone/Chroma)', 'RAG Pipelines'], estimatedTime: '5 Weeks' }
    ],
    projects: [
      { name: 'Enterprise PDF Document RAG Bot', description: 'Interactive AI assistant querying enterprise PDFs with vector embeddings.', tech: ['LangChain', 'Pinecone', 'FastAPI'] },
      { name: 'Real-time Object Detection Pipeline', description: 'Computer vision pipeline detecting objects in video feeds.', tech: ['PyTorch', 'OpenCV', 'YOLO'] }
    ],
    certifications: ['TensorFlow Developer Certificate', 'AWS Certified AI Practitioner', 'DeepLearning.AI Specialization'],
    softSkills: ['Analytical Thinking', 'Research Synthesis', 'Presentation & Storytelling', 'Critical Evaluation'],
    placementPrep: {
      easyProblems: 80,
      mediumProblems: 100,
      hardProblems: 25,
      mockInterviews: 5,
      checklist: ['GitHub Repository with ML Notebooks', 'Hugging Face Spaces Demo', 'AI Resume PDF']
    },
    companyPrep: {
      Google: ['ML System Design', 'PyTorch Deep Learning', 'Probability & Stats', 'DSA in Python'],
      Amazon: ['Amazon Science Principles', 'LLM Fine-tuning', 'Data Pipelines', 'System Scalability']
    },
    recommendedBooks: ['Hands-On Machine Learning by Aurélien Géron', 'Deep Learning by Ian Goodfellow', 'Python Machine Learning by Sebastian Raschka'],
    youtubeChannels: ['3Blue1Brown', 'StatQuest with Josh Starmer', 'Krish Naik', 'Yannic Kilcher', 'Andrej Karpathy'],
    websites: ['Kaggle', 'Hugging Face', 'Papers with Code', 'ArXiv']
  }
};
