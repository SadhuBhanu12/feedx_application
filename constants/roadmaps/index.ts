export interface RoadmapPhase {
  id: string;
  title: string;
  description: string;
  topics: string[];
  estimatedTime: string;
}

export interface CareerRoadmap {
  id: string;
  title: string;
  category: string;
  icon: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  overview: string;
  estimatedTimeline: string;
  expectedSalaryRange: string;
  skillsRequired: string[];
  programmingLanguages: string[];
  frameworks: string[];
  tools: string[];
  phases: RoadmapPhase[];
  projects: { name: string; description: string; tech: string[] }[];
  certifications: string[];
  interviewPrep: string[];
  resumeTips: string[];
  portfolioSuggestions: string[];
  communities: string[];
}

export const CAREER_ROADMAPS: Record<string, CareerRoadmap> = {
  'java-developer': {
    id: 'java-developer',
    title: 'Java Developer',
    category: 'Software Engineering',
    icon: 'coffee',
    difficulty: 'Beginner',
    overview: 'Master enterprise Java development, Spring Boot microservices, object-oriented design, and relational database systems.',
    estimatedTimeline: '6 Months',
    expectedSalaryRange: '₹4.5 LPA - ₹16 LPA',
    skillsRequired: ['OOP', 'Microservices', 'REST APIs', 'SQL', 'Data Structures'],
    programmingLanguages: ['Java 17+', 'SQL'],
    frameworks: ['Spring Boot', 'Spring Data JPA', 'Hibernate', 'Spring Security'],
    tools: ['IntelliJ IDEA', 'Maven', 'Gradle', 'Docker', 'Postman', 'Git'],
    phases: [
      {
        id: 'phase-1',
        title: 'Phase 1: Programming Basics & Core Syntax',
        description: 'Master variables, loops, conditional statements, arrays, and basic methods.',
        topics: ['Variables & Data Types', 'Loops & Conditions', 'Methods & Scope', 'Arrays & Strings', 'Control Flow Practice'],
        estimatedTime: '2 Weeks'
      },
      {
        id: 'phase-2',
        title: 'Phase 2: Object-Oriented Programming (OOP)',
        description: 'Understand core OOP concepts and Java Collections framework.',
        topics: ['Classes & Objects', 'Inheritance & Polymorphism', 'Abstraction & Interfaces', 'Java Collections (List, Set, Map)', 'Encapsulation & Access Modifiers'],
        estimatedTime: '3 Weeks'
      },
      {
        id: 'phase-3',
        title: 'Phase 3: Advanced Java & Concurrency',
        description: 'Learn modern Java features, exception handling, and multithreading.',
        topics: ['Exception Handling', 'Multithreading & Concurrency', 'Streams API & Lambdas', 'Generics & Optionals', 'JDBC & File I/O'],
        estimatedTime: '3 Weeks'
      },
      {
        id: 'phase-4',
        title: 'Phase 4: Enterprise Spring Boot & Persistence',
        description: 'Build production REST APIs with Spring Boot and Spring Data JPA.',
        topics: ['Spring Boot Starter & Dependency Injection', 'RESTful Controller Annotations', 'Spring Data JPA & Hibernate', 'MySQL/PostgreSQL Integration', 'JWT & Spring Security'],
        estimatedTime: '4 Weeks'
      },
      {
        id: 'phase-5',
        title: 'Phase 5: Real-World Portfolio Projects',
        description: 'Implement end-to-end backend microservices and API gateways.',
        topics: ['Student Information Management API', 'E-Commerce Microservices Backend', 'Role-Based Auth & JWT Server', 'Real-time Notification Service'],
        estimatedTime: '4 Weeks'
      },
      {
        id: 'phase-6',
        title: 'Phase 6: Interview Preparation & System Design',
        description: 'Crack technical interviews with DSA, system design, and behavioral preparation.',
        topics: ['Java Core Interview QA', 'DSA on Arrays, Trees, Graphs', 'Basic System Design & Caching', 'Resume & LinkedIn Optimization'],
        estimatedTime: '3 Weeks'
      }
    ],
    projects: [
      { name: 'Student Management System', description: 'REST API for student enrollments with JPA and MySQL.', tech: ['Spring Boot', 'MySQL', 'JPA'] },
      { name: 'E-Commerce Microservice', description: 'Distributed order and inventory management service.', tech: ['Spring Cloud', 'Docker', 'Redis'] },
      { name: 'JWT Auth Gateway', description: 'Secure auth server supporting OAuth2 & JWT tokens.', tech: ['Spring Security', 'JWT'] }
    ],
    certifications: ['Oracle Certified Professional: Java SE 17 Developer', 'Spring Certified Professional'],
    interviewPrep: ['Master HashMap vs ConcurrentHashMap', 'JVM Garbage Collection mechanisms', 'Spring Bean Lifecycle', 'SQL Query Tuning'],
    resumeTips: ['Highlight API endpoints built with metrics', 'Include GitHub repository links for all Spring Boot projects', 'Mention test coverage with JUnit & Mockito'],
    portfolioSuggestions: ['Host live API documentation via Swagger/OpenAPI', 'Containerize projects with Dockerfile'],
    communities: ['r/java', 'Spring Community Discord', 'Java User Group (JUG)']
  },
  'python-developer': {
    id: 'python-developer',
    title: 'Python Developer',
    category: 'Software Engineering',
    icon: 'code',
    difficulty: 'Beginner',
    overview: 'Build web services, automation scripts, data pipelines, and backend APIs using Python, FastApi, and Django.',
    estimatedTimeline: '5 Months',
    expectedSalaryRange: '₹4.0 LPA - ₹15 LPA',
    skillsRequired: ['Python 3', 'FastAPI', 'Django', 'PostgreSQL', 'RESTful APIs'],
    programmingLanguages: ['Python', 'SQL'],
    frameworks: ['FastAPI', 'Django', 'Flask', 'SQLAlchemy'],
    tools: ['PyCharm', 'VS Code', 'Git', 'Docker', 'Postman', 'Poetry'],
    phases: [
      {
        id: 'py-1',
        title: 'Phase 1: Python Fundamentals & Data Structures',
        description: 'Learn Python syntax, control flow, functions, and built-in data types.',
        topics: ['Variables & Operators', 'Lists, Tuples, Sets, Dicts', 'Functions & Decorators', 'List Comprehensions', 'File Handling & Modules'],
        estimatedTime: '2 Weeks'
      },
      {
        id: 'py-2',
        title: 'Phase 2: Object-Oriented & Advanced Python',
        description: 'Master OOP principles, generators, iterators, and async IO.',
        topics: ['Classes & Dunder Methods', 'Inheritance & Abstract Classes', 'Generators & Iterators', 'Asyncio & Async Programming', 'Context Managers'],
        estimatedTime: '3 Weeks'
      },
      {
        id: 'py-3',
        title: 'Phase 3: Web Frameworks (FastAPI & Django)',
        description: 'Construct high-performance REST APIs and web applications.',
        topics: ['FastAPI Routing & Pydantic', 'Django ORM & Migrations', 'Authentication & JWT', 'Async Database Queries', 'Middleware & CORS'],
        estimatedTime: '4 Weeks'
      },
      {
        id: 'py-4',
        title: 'Phase 4: Database Integration & Caching',
        description: 'Integrate PostgreSQL and Redis for fast data storage.',
        topics: ['PostgreSQL & SQLAlchemy', 'Celery Async Task Queues', 'Redis Caching', 'Unit Testing with PyTest', 'Docker Containerization'],
        estimatedTime: '3 Weeks'
      },
      {
        id: 'py-5',
        title: 'Phase 5: Portfolio Projects & Deployment',
        description: 'Ship production-ready Python applications to cloud platforms.',
        topics: ['Task Scheduler API', 'SaaS Billing Backend', 'Real-time Scraping Pipeline', 'Deploying on Render/AWS'],
        estimatedTime: '3 Weeks'
      }
    ],
    projects: [
      { name: 'High-Speed Analytics API', description: 'Async FastAPI endpoint serving analytical metrics.', tech: ['FastAPI', 'PostgreSQL', 'Redis'] },
      { name: 'Automated Scraping Service', description: 'Scrapes and summarizes technical news feeds.', tech: ['Python', 'BeautifulSoup', 'Celery'] }
    ],
    certifications: ['PCEP – Certified Entry-Level Python Programmer', 'PCPP – Certified Professional in Python'],
    interviewPrep: ['Explain Python GIL (Global Interpreter Lock)', 'Decorators and Closure execution', 'Django ORM query optimization (select_related vs prefetch_related)'],
    resumeTips: ['Emphasize API latency reductions achieved', 'Include Docker container setup commands'],
    portfolioSuggestions: ['Publish a Python package to PyPI', 'Create interactive API docs via Swagger UI'],
    communities: ['r/Python', 'Python Discord Server']
  },
  'frontend-developer': {
    id: 'frontend-developer',
    title: 'Frontend Developer',
    category: 'Web Development',
    icon: 'layout',
    difficulty: 'Beginner',
    overview: 'Craft stunning, high-performance responsive web user interfaces using HTML5, CSS3, JavaScript, React, and Next.js.',
    estimatedTimeline: '5 Months',
    expectedSalaryRange: '₹4.0 LPA - ₹14 LPA',
    skillsRequired: ['HTML5/CSS3', 'JavaScript ES6+', 'React.js', 'Next.js', 'TailwindCSS'],
    programmingLanguages: ['HTML', 'CSS', 'JavaScript', 'TypeScript'],
    frameworks: ['React', 'Next.js', 'Tailwind CSS', 'Redux Toolkit'],
    tools: ['VS Code', 'Figma', 'Chrome DevTools', 'Git', 'Vercel', 'Webpack/Vite'],
    phases: [
      {
        id: 'fe-1',
        title: 'Phase 1: Modern HTML5 & Responsive CSS3',
        description: 'Build semantically structured and responsive modern web layouts.',
        topics: ['Semantic HTML5', 'Flexbox & CSS Grid Layouts', 'CSS Custom Properties', 'Responsive Design & Media Queries', 'Animations & Transitions'],
        estimatedTime: '3 Weeks'
      },
      {
        id: 'fe-2',
        title: 'Phase 2: JavaScript ES6+ Mastery',
        description: 'Master DOM manipulation, async JavaScript, promises, and modern ES6 Syntax.',
        topics: ['DOM & Event Delegation', 'Promises & Async/Await', 'Fetch API & Axios', 'Closures & Scope', 'ES6 Modules & Array Methods'],
        estimatedTime: '4 Weeks'
      },
      {
        id: 'fe-3',
        title: 'Phase 3: React.js Core & Hooks',
        description: 'Build single-page web applications with reactive component state.',
        topics: ['JSX & Component Props', 'useState, useEffect, useMemo, useCallback', 'Context API & State Management', 'React Router v6', 'Form Validation'],
        estimatedTime: '4 Weeks'
      },
      {
        id: 'fe-4',
        title: 'Phase 4: Next.js & Server-Side Rendering',
        description: 'Implement fullstack React with App Router, SSR, SSG, and SEO optimization.',
        topics: ['Next.js App Router', 'Server Components vs Client Components', 'API Routes & Server Actions', 'SEO Meta Tags & Lighthouse Optimization'],
        estimatedTime: '3 Weeks'
      }
    ],
    projects: [
      { name: 'SaaS Analytics Dashboard', description: 'Responsive dark mode dashboard with interactive charts.', tech: ['React', 'Tailwind CSS', 'Recharts'] },
      { name: 'E-Commerce Marketplace', description: 'Full shopping cart with stripe payment integration.', tech: ['Next.js', 'TypeScript', 'Tailwind'] }
    ],
    certifications: ['Meta Front-End Developer Professional Certificate'],
    interviewPrep: ['Virtual DOM reconciliation mechanism', 'Event Loop & microtask queue', 'CSS specificity & z-index stacking context'],
    resumeTips: ['Include Lighthouse Performance scores (95+)', 'Link deployed Vercel demo URLs'],
    portfolioSuggestions: ['Build custom component design system', 'Include keyboard accessibility (a11y)'],
    communities: ['r/reactjs', 'Frontend Mentor', 'Dev.to']
  },
  'backend-developer': {
    id: 'backend-developer',
    title: 'Backend Developer',
    category: 'Software Engineering',
    icon: 'server',
    difficulty: 'Intermediate',
    overview: 'Design scalable server architectures, REST/GraphQL APIs, microservices, databases, and authentication systems.',
    estimatedTimeline: '6 Months',
    expectedSalaryRange: '₹5.0 LPA - ₹18 LPA',
    skillsRequired: ['Node.js/Express', 'PostgreSQL', 'MongoDB', 'Redis', 'Microservices'],
    programmingLanguages: ['TypeScript', 'Node.js', 'SQL'],
    frameworks: ['Express.js', 'NestJS', 'Prisma ORM'],
    tools: ['Docker', 'Postman', 'Git', 'Kafka', 'Redis', 'Nginx'],
    phases: [
      {
        id: 'be-1',
        title: 'Phase 1: Node.js Core & Express.js APIs',
        description: 'Build RESTful HTTP servers with Node.js and Express.',
        topics: ['Node Event Loop & Modules', 'Express Routing & Middleware', 'Error Handling & Logging', 'Input Validation (Zod/Joi)'],
        estimatedTime: '3 Weeks'
      },
      {
        id: 'be-2',
        title: 'Phase 2: Database Systems & Relational Modeling',
        description: 'Design schemas, indexes, and write efficient SQL/NoSQL queries.',
        topics: ['PostgreSQL Database Design', 'Prisma / TypeORM Integration', 'MongoDB Data Modeling', 'Database Indexing & Query Tuning'],
        estimatedTime: '4 Weeks'
      },
      {
        id: 'be-3',
        title: 'Phase 3: Authentication, Security & Caching',
        description: 'Secure APIs with JWT, OAuth2, rate limiting, and Redis caching.',
        topics: ['JWT & Refresh Token Flow', 'Password Hashing (Bcrypt)', 'Redis Caching & PubSub', 'Rate Limiting & CORS Policies'],
        estimatedTime: '4 Weeks'
      }
    ],
    projects: [
      { name: 'Multi-Tenant SaaS Backend', description: 'Scalable backend API supporting tenant isolation.', tech: ['Node.js', 'PostgreSQL', 'Redis'] }
    ],
    certifications: ['AWS Certified Developer – Associate'],
    interviewPrep: ['Database normalization & ACID properties', 'Rate limiting algorithms (Leaky bucket)', 'CAP Theorem'],
    resumeTips: ['State request throughput handled per second (RPS)', 'Highlight database migration skills'],
    portfolioSuggestions: ['Write detailed OpenAPI/Swagger specs', 'Include Docker Compose configuration'],
    communities: ['Node.js Discord', 'r/backend']
  },
  'fullstack-developer': {
    id: 'fullstack-developer',
    title: 'Full Stack Developer',
    category: 'Web Development',
    icon: 'layers',
    difficulty: 'Intermediate',
    overview: 'Master end-to-end web application development using modern frontend frameworks and scalable backend APIs.',
    estimatedTimeline: '7 Months',
    expectedSalaryRange: '₹5.5 LPA - ₹20 LPA',
    skillsRequired: ['React', 'Node.js', 'PostgreSQL', 'TypeScript', 'DevOps'],
    programmingLanguages: ['TypeScript', 'JavaScript', 'SQL', 'HTML/CSS'],
    frameworks: ['Next.js', 'Express.js', 'Tailwind CSS', 'Prisma'],
    tools: ['Docker', 'Vercel', 'Postman', 'Git', 'GitHub Actions'],
    phases: [
      {
        id: 'fs-1',
        title: 'Phase 1: Fullstack Architecture Foundations',
        description: 'Master fullstack TypeScript, React frontend, and Node backend integration.',
        topics: ['Fullstack TypeScript Setup', 'React & State Management', 'Node.js & Express REST APIs', 'PostgreSQL Data Schema'],
        estimatedTime: '5 Weeks'
      },
      {
        id: 'fs-2',
        title: 'Phase 2: Modern Fullstack Next.js Application',
        description: 'Build complete web platforms with Next.js App Router and Prisma.',
        topics: ['Next.js Server Actions', 'Prisma ORM Database Access', 'NextAuth Authentication', 'Stripe Billing Integration'],
        estimatedTime: '6 Weeks'
      }
    ],
    projects: [
      { name: 'FEEDX LMS Platform', description: 'Fullstack learning management portal with video streaming.', tech: ['Next.js', 'Prisma', 'Tailwind'] }
    ],
    certifications: ['AWS Certified Solutions Architect'],
    interviewPrep: ['End-to-end data flow', 'Client vs Server state synchronization', 'CORS & Security headers'],
    resumeTips: ['Demonstrate complete project delivery from UI to Cloud deployment'],
    portfolioSuggestions: ['Deploy live application on custom domain'],
    communities: ['Fullstack Devs', 'IndieHackers']
  },
  'react-native-developer': {
    id: 'react-native-developer',
    title: 'React Native Developer',
    category: 'Mobile Development',
    icon: 'smartphone',
    difficulty: 'Intermediate',
    overview: 'Build cross-platform iOS and Android native mobile apps using React Native, Expo, and TypeScript.',
    estimatedTimeline: '5 Months',
    expectedSalaryRange: '₹4.5 LPA - ₹17 LPA',
    skillsRequired: ['React Native', 'Expo SDK', 'TypeScript', 'Navigation', 'Native Modules'],
    programmingLanguages: ['TypeScript', 'JavaScript'],
    frameworks: ['React Native', 'Expo Router', 'Reanimated 3', 'Redux Toolkit'],
    tools: ['VS Code', 'Xcode', 'Android Studio', 'EAS Build', 'Figma'],
    phases: [
      {
        id: 'rn-1',
        title: 'Phase 1: React Native & Expo Fundamentals',
        description: 'Learn native mobile components, styling, and navigation layout.',
        topics: ['View, Text, Image, ScrollView', 'StyleSheet & Flexbox Layouts', 'Expo Router & Stack Navigation', 'Touchables & Pressables'],
        estimatedTime: '3 Weeks'
      },
      {
        id: 'rn-2',
        title: 'Phase 2: Performance, Animations & Lists',
        description: 'Master 60 FPS mobile animations and virtualized FlashList performance.',
        topics: ['Shopify FlashList', 'React Native Reanimated 3', 'Gesture Handler', 'Optimized Image Caching'],
        estimatedTime: '4 Weeks'
      }
    ],
    projects: [
      { name: 'Social Fitness Mobile App', description: 'Cross-platform app tracking workout logs and GPS runs.', tech: ['React Native', 'Expo', 'Reanimated'] }
    ],
    certifications: ['Meta Android Developer / iOS Certification'],
    interviewPrep: ['React Native Bridge vs New Architecture (Fabric & JSI)', 'Virtualization performance optimization', 'Memory leak prevention'],
    resumeTips: ['Publish apps to Google Play Store / Apple App Store with download links'],
    portfolioSuggestions: ['Include video demonstration recordings of smooth 60 FPS UI'],
    communities: ['r/reactnative', 'Expo Discord Community']
  },
  'ai-engineer': {
    id: 'ai-engineer',
    title: 'AI Engineer',
    category: 'Artificial Intelligence',
    icon: 'cpu',
    difficulty: 'Advanced',
    overview: 'Build intelligent applications leveraging Large Language Models (LLMs), RAG pipelines, Vector Databases, and PyTorch.',
    estimatedTimeline: '8 Months',
    expectedSalaryRange: '₹7.0 LPA - ₹25 LPA',
    skillsRequired: ['Python', 'LLMs', 'RAG Pipelines', 'Vector DBs', 'PyTorch', 'LangChain'],
    programmingLanguages: ['Python', 'SQL', 'C++'],
    frameworks: ['PyTorch', 'LangChain', 'LlamaIndex', 'Hugging Face Transformers'],
    tools: ['Jupyter', 'Pinecone', 'Weaviate', 'Ollama', 'Docker', 'Git'],
    phases: [
      {
        id: 'ai-1',
        title: 'Phase 1: Python for Data Science & Math',
        description: 'Master NumPy, Pandas, Linear Algebra, Probability, and Statistics.',
        topics: ['NumPy & Matrix Operations', 'Pandas Data Cleaning', 'Linear Algebra & Calculus Basics', 'Matplotlib & Data Visualization'],
        estimatedTime: '4 Weeks'
      },
      {
        id: 'ai-2',
        title: 'Phase 2: Machine Learning Core',
        description: 'Understand supervised and unsupervised ML algorithms with Scikit-Learn.',
        topics: ['Linear & Logistic Regression', 'Decision Trees & Random Forests', 'Model Evaluation & Cross-Validation', 'Scikit-Learn Workflows'],
        estimatedTime: '5 Weeks'
      },
      {
        id: 'ai-3',
        title: 'Phase 3: Deep Learning & Neural Networks',
        description: 'Construct neural network architectures using PyTorch.',
        topics: ['Neural Network Architectures', 'Backpropagation & Gradient Descent', 'Convolutional Neural Networks (CNNs)', 'PyTorch Model Training'],
        estimatedTime: '6 Weeks'
      },
      {
        id: 'ai-4',
        title: 'Phase 4: LLMs, Prompt Engineering & RAG',
        description: 'Build Generative AI applications with Embeddings, Vector Search, and RAG.',
        topics: ['Transformer Architecture Overview', 'OpenAI & Hugging Face APIs', 'Vector Databases (Pinecone/Chroma)', 'Retrieval-Augmented Generation (RAG)'],
        estimatedTime: '6 Weeks'
      }
    ],
    projects: [
      { name: 'Enterprise Document Q&A Bot', description: 'RAG system querying internal PDFs with citation sources.', tech: ['LangChain', 'Pinecone', 'FastAPI'] },
      { name: 'AI Voice Assistant', description: 'Real-time speech recognition and generative response engine.', tech: ['PyTorch', 'Whisper', 'Python'] }
    ],
    certifications: ['TensorFlow Developer Certificate', 'AWS Certified AI Practitioner'],
    interviewPrep: ['Transformer Self-Attention mechanism', 'RAG evaluation metrics (Faithfulness/Relevance)', 'Vector Indexing methods (HNSW/IVF)'],
    resumeTips: ['Quantify accuracy improvements and token cost optimizations achieved'],
    portfolioSuggestions: ['Host live GenAI demo apps on Hugging Face Spaces'],
    communities: ['r/LocalLLaMA', 'Hugging Face Discord', 'r/MachineLearning']
  },
  'data-analyst': {
    id: 'data-analyst',
    title: 'Data Analyst',
    category: 'Data & Analytics',
    icon: 'bar-chart-2',
    difficulty: 'Beginner',
    overview: 'Transform raw business data into actionable insights using SQL, Excel, Python, PowerBI, and Tableau.',
    estimatedTimeline: '4 Months',
    expectedSalaryRange: '₹3.8 LPA - ₹12 LPA',
    skillsRequired: ['SQL', 'Advanced Excel', 'Power BI', 'Python', 'Data Cleaning'],
    programmingLanguages: ['SQL', 'Python'],
    frameworks: ['Pandas', 'NumPy', 'Seaborn'],
    tools: ['Power BI', 'Tableau', 'Excel', 'Jupyter Notebook', 'PostgreSQL'],
    phases: [
      {
        id: 'da-1',
        title: 'Phase 1: Advanced Excel & Business Analytics',
        description: 'Master VLOOKUP, Pivot Tables, Power Query, and business dashboards.',
        topics: ['Pivot Tables & Charts', 'INDEX/MATCH & XLOOKUP', 'Data Formatting & Cleaning', 'Financial Modeling Basics'],
        estimatedTime: '2 Weeks'
      },
      {
        id: 'da-2',
        title: 'Phase 2: SQL for Data Extraction',
        description: 'Write complex SQL queries, JOINs, aggregations, and window functions.',
        topics: ['SELECT, WHERE, GROUP BY', 'INNER/LEFT/RIGHT JOINs', 'Subqueries & CTEs', 'Window Functions (RANK, DENSE_RANK)'],
        estimatedTime: '3 Weeks'
      },
      {
        id: 'da-3',
        title: 'Phase 3: Data Visualization with Power BI / Tableau',
        description: 'Design executive dashboards with DAX formulas and interactive filters.',
        topics: ['Power BI Data Modeling', 'DAX Measures & Calculated Columns', 'Interactive Dashboard Layouts', 'Report Publishing'],
        estimatedTime: '3 Weeks'
      }
    ],
    projects: [
      { name: 'Retail Sales Performance Dashboard', description: 'Executive PowerBI report analyzing revenue trends.', tech: ['Power BI', 'SQL', 'Excel'] }
    ],
    certifications: ['Google Data Analytics Professional Certificate', 'Microsoft Certified: Power BI Data Analyst Associate'],
    interviewPrep: ['Complex SQL JOIN scenarios', 'DAX vs Calculated Columns', 'A/B Testing concepts'],
    resumeTips: ['Include links to public Tableau Public or PowerBI portfolio dashboards'],
    portfolioSuggestions: ['Publish data case studies on GitHub / Notion'],
    communities: ['r/dataanalysis', 'Kaggle Community']
  },
  'cyber-security-engineer': {
    id: 'cyber-security-engineer',
    title: 'Cyber Security Engineer',
    category: 'Cybersecurity',
    icon: 'shield',
    difficulty: 'Intermediate',
    overview: 'Protect networks, systems, and enterprise cloud infrastructure from cyber threats and vulnerabilities.',
    estimatedTimeline: '6 Months',
    expectedSalaryRange: '₹5.0 LPA - ₹19 LPA',
    skillsRequired: ['Networking', 'Penetration Testing', 'SIEM', 'Linux', 'Cryptography'],
    programmingLanguages: ['Python', 'Bash', 'PowerShell'],
    frameworks: ['Metasploit', 'Nmap', 'Wireshark', 'Burp Suite'],
    tools: ['Kali Linux', 'Wireshark', 'Splunk', 'Nessus', 'Snort'],
    phases: [
      {
        id: 'sec-1',
        title: 'Phase 1: Computer Networking & Linux Administration',
        description: 'Understand TCP/IP protocols, subnetting, firewalls, and Linux security.',
        topics: ['OSI & TCP/IP Protocol Suite', 'Subnetting & Routing Basics', 'Linux Command Line & Permissions', 'Firewalls & VPNs'],
        estimatedTime: '4 Weeks'
      },
      {
        id: 'sec-2',
        title: 'Phase 2: Ethical Hacking & Vulnerability Analysis',
        description: 'Perform reconnaissance, network scanning, and vulnerability assessment.',
        topics: ['Nmap Port Scanning', 'Wireshark Packet Capture Analysis', 'Metasploit Framework', 'Vulnerability Assessment with Nessus'],
        estimatedTime: '5 Weeks'
      }
    ],
    projects: [
      { name: 'Enterprise SIEM Log Analyzer', description: 'Detect threat intrusion patterns from server logs.', tech: ['Python', 'Splunk', 'Linux'] }
    ],
    certifications: ['CompTIA Security+', 'Certified Ethical Hacker (CEH)', 'OSCP'],
    interviewPrep: ['Explain Handshake in TCP/TLS', 'OWASP Top 10 Security Vulnerabilities', 'Symmetric vs Asymmetric Encryption'],
    resumeTips: ['Include TryHackMe / HackTheBox ranks'],
    portfolioSuggestions: ['Write writeups for completed CTF challenges'],
    communities: ['r/netsec', 'TryHackMe Community']
  },
  'cloud-engineer': {
    id: 'cloud-engineer',
    title: 'Cloud Engineer',
    category: 'Cloud & Infrastructure',
    icon: 'cloud',
    difficulty: 'Intermediate',
    overview: 'Architect, deploy, and manage scalable cloud infrastructure on AWS, Azure, and GCP using Infrastructure as Code.',
    estimatedTimeline: '6 Months',
    expectedSalaryRange: '₹5.5 LPA - ₹20 LPA',
    skillsRequired: ['AWS', 'Terraform', 'Docker', 'Kubernetes', 'Linux'],
    programmingLanguages: ['Bash', 'Python', 'HCL'],
    frameworks: ['Terraform', 'Ansible', 'CloudFormation'],
    tools: ['AWS Management Console', 'Docker', 'Kubernetes', 'Git', 'Jenkins'],
    phases: [
      {
        id: 'c-1',
        title: 'Phase 1: Linux & AWS Core Infrastructure',
        description: 'Master EC2, VPC, IAM, S3, and Cloud Architecture fundamentals.',
        topics: ['AWS IAM Users & Policies', 'VPC Networking & Subnets', 'EC2 Virtual Machines', 'S3 Object Storage & Security'],
        estimatedTime: '4 Weeks'
      },
      {
        id: 'c-2',
        title: 'Phase 2: Infrastructure as Code (Terraform)',
        description: 'Automate multi-cloud infrastructure provisioning using Terraform.',
        topics: ['Terraform Syntax & HCL', 'State Management & S3 Backend', 'Modules & Resources', 'Automated Cloud Provisioning'],
        estimatedTime: '4 Weeks'
      }
    ],
    projects: [
      { name: 'Automated Multi-Region AWS VPC', description: 'Terraform script deploying secure HA VPC.', tech: ['AWS', 'Terraform'] }
    ],
    certifications: ['AWS Certified Solutions Architect – Associate', 'HashiCorp Certified: Terraform Associate'],
    interviewPrep: ['AWS VPC Peering vs Transit Gateway', 'Terraform State Lock mechanisms', 'High Availability architecture design'],
    resumeTips: ['List Terraform module repository links'],
    portfolioSuggestions: ['Publish architecture diagrams created in Draw.io / Lucidchart'],
    communities: ['r/aws', 'AWS User Group']
  },
  'ui-ux-designer': {
    id: 'ui-ux-designer',
    title: 'UI/UX Designer',
    category: 'Design',
    icon: 'figma',
    difficulty: 'Beginner',
    overview: 'Design user-centric digital products, wireframes, high-fidelity visual UI, and interactive prototypes.',
    estimatedTimeline: '4 Months',
    expectedSalaryRange: '₹4.0 LPA - ₹15 LPA',
    skillsRequired: ['Figma', 'Wireframing', 'User Research', 'Prototyping', 'Design Systems'],
    programmingLanguages: ['HTML/CSS (Basics)'],
    frameworks: ['Design Systems', 'Atomic Design'],
    tools: ['Figma', 'Adobe XD', 'Miro', 'Zeplin', 'Lottie'],
    phases: [
      {
        id: 'ux-1',
        title: 'Phase 1: User Experience & Design Thinking',
        description: 'Conduct user research, personas, user journeys, and wireframing.',
        topics: ['Design Thinking Framework', 'User Personas & Journey Maps', 'Information Architecture', 'Low-Fidelity Wireframing'],
        estimatedTime: '3 Weeks'
      },
      {
        id: 'ux-2',
        title: 'Phase 2: Visual UI Design & Figma Mastery',
        description: 'Master Auto Layout, Component Variants, Typography, and Color Theory.',
        topics: ['Figma Auto Layout 5.0', 'Design System Components', 'Color Contrast & Accessibility', 'High-Fidelity Interactive Prototypes'],
        estimatedTime: '4 Weeks'
      }
    ],
    projects: [
      { name: 'Fintech Mobile Wallet Redesign', description: 'End-to-end UI UX case study for digital payments.', tech: ['Figma', 'User Research'] }
    ],
    certifications: ['Google UX Design Professional Certificate'],
    interviewPrep: ['Explain your design process walkthrough', 'How to handle stakeholder feedback', 'Design System component scalability'],
    resumeTips: ['Link your Behance, Dribbble, or custom Notion portfolio website'],
    portfolioSuggestions: ['Include at least 2 detailed UX case studies showing iteration wireframes'],
    communities: ['Figma Community', 'r/UIUX', 'Design Buddies Discord']
  },
  'devops-engineer': {
    id: 'devops-engineer',
    title: 'DevOps Engineer',
    category: 'DevOps & Infrastructure',
    icon: 'terminal',
    difficulty: 'Advanced',
    overview: 'Bridge software development and IT operations through CI/CD pipelines, container orchestration, and monitoring.',
    estimatedTimeline: '6 Months',
    expectedSalaryRange: '₹6.0 LPA - ₹22 LPA',
    skillsRequired: ['Docker', 'Kubernetes', 'CI/CD', 'Terraform', 'Prometheus'],
    programmingLanguages: ['Bash', 'Python', 'YAML'],
    frameworks: ['Docker', 'Kubernetes', 'Helm', 'ArgoCD'],
    tools: ['GitHub Actions', 'Jenkins', 'Prometheus', 'Grafana', 'Docker'],
    phases: [
      {
        id: 'dev-1',
        title: 'Phase 1: Linux, Containers & Docker',
        description: 'Master containerization, Dockerfiles, and multi-stage container builds.',
        topics: ['Linux Scripting & Networking', 'Docker Containers & Volumes', 'Docker Compose Setup', 'Multi-stage Production Image Optimization'],
        estimatedTime: '4 Weeks'
      },
      {
        id: 'dev-2',
        title: 'Phase 2: CI/CD Automation & Kubernetes',
        description: 'Automate build pipelines with GitHub Actions and deploy to Kubernetes clusters.',
        topics: ['GitHub Actions Workflows', 'Kubernetes Pods, Deployments, Services', 'Ingress Control & Helm Charts', 'ArgoCD GitOps Pipeline'],
        estimatedTime: '6 Weeks'
      }
    ],
    projects: [
      { name: 'GitOps Kubernetes Deployment Pipeline', description: 'Automated CI/CD deploying microservices to EKS.', tech: ['Kubernetes', 'GitHub Actions', 'ArgoCD'] }
    ],
    certifications: ['Certified Kubernetes Administrator (CKA)', 'AWS Certified DevOps Engineer'],
    interviewPrep: ['Kubernetes Architecture (Control Plane vs Worker Node)', 'Docker image optimization techniques', 'Zero-downtime deployment strategies (Blue-Green/Canary)'],
    resumeTips: ['Quantify deployment frequency and build time reductions'],
    portfolioSuggestions: ['Host Kubernetes manifests in public GitHub repo'],
    communities: ['r/devops', 'Kubernetes Slack']
  }
};

export const CAREER_CATEGORIES = [
  'All',
  'Software Engineering',
  'Web Development',
  'Mobile Development',
  'Artificial Intelligence',
  'Data & Analytics',
  'Cybersecurity',
  'Cloud & Infrastructure',
  'DevOps & Infrastructure',
  'Design'
];
