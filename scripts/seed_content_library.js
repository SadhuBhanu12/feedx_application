const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://ktontqbfcinzqvalxyqd.supabase.co';
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0b250cWJmY2luenF2YWx4eXFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc2NTE0MzUsImV4cCI6MjA5MzIyNzQzNX0.XZPB5rzKKyHQW6HrKsiwFJoPJnQDEhqOT5jzYKEhQp8';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Define 50 Content Specifications
const QUICK_LEARNS = [
  { 
    id: 1, 
    title: "GitHub & Git Basics", 
    branch: "CSE", 
    category: "DevOps", 
    difficulty: "Beginner",
    text: "Git is a distributed version-control system used to track changes in files and collaborate on software. GitHub is a cloud platform built around Git that provides repositories, pull requests, issues, actions and collaboration features.",
    keyPoints: ["Git", "GitHub", "repository", "commit", "branch", "merge"]
  },
  { 
    id: 2, 
    title: "APIs & How They Work", 
    branch: "CSE", 
    category: "Web Dev", 
    difficulty: "Beginner",
    text: "An API (Application Programming Interface) is a set of rules and protocols that allows different software applications to communicate with each other over HTTP using formats like JSON or XML.",
    keyPoints: ["REST", "Endpoint", "JSON", "HTTP Methods", "Status Codes", "Authentication"]
  },
  { 
    id: 3, 
    title: "Cloud Computing Basics", 
    branch: "CSE", 
    category: "Cloud", 
    difficulty: "Beginner",
    text: "Cloud computing delivers computing services—including servers, storage, databases, networking, software, and analytics—over the Internet ('the cloud') to offer faster innovation and flexible resources.",
    keyPoints: ["IaaS", "PaaS", "SaaS", "AWS", "Scalability", "Pay-as-you-go"]
  },
  { 
    id: 4, 
    title: "Cybersecurity Basics", 
    branch: "CSE", 
    category: "Security", 
    difficulty: "Beginner",
    text: "Cybersecurity is the practice of protecting systems, networks, and programs from digital attacks. Key fundamentals revolve around maintaining confidentiality, integrity, and availability (CIA triad).",
    keyPoints: ["CIA Triad", "Encryption", "Firewalls", "Phishing", "MFA", "Vulnerabilities"]
  },
  { 
    id: 5, 
    title: "Linux Basics", 
    branch: "CSE", 
    category: "OS", 
    difficulty: "Beginner",
    text: "Linux is an open-source, Unix-like operating system kernel that powers servers, supercomputers, and mobile devices. It provides a robust command-line environment for file management and permissions.",
    keyPoints: ["Kernel", "Terminal", "Permissions", "bash", "root", "CLI Commands"]
  },
  { id: 6, title: "Operating Systems Concepts", branch: "CSE", category: "OS", difficulty: "Intermediate" },
  { id: 7, title: "Computer Networks", branch: "CSE", category: "Networking", difficulty: "Intermediate" },
  { id: 8, title: "Internet & Web Technology", branch: "CSE", category: "Web Dev", difficulty: "Beginner" },
  { id: 9, title: "HTML & CSS Essentials", branch: "CSE", category: "Web Dev", difficulty: "Beginner" },
  { id: 10, title: "JavaScript Fundamentals", branch: "CSE", category: "Programming", difficulty: "Beginner" },
  { id: 11, title: "Python Basics", branch: "CSE", category: "Programming", difficulty: "Beginner" },
  { id: 12, title: "C Programming Fundamentals", branch: "CSE", category: "Programming", difficulty: "Beginner" },
  { id: 13, title: "Java Programming Core", branch: "CSE", category: "Programming", difficulty: "Intermediate" },
  { id: 14, title: "SQL & Database Systems", branch: "CSE", category: "Databases", difficulty: "Intermediate" },
  { id: 15, title: "Git vs GitHub", branch: "CSE", category: "DevOps", difficulty: "Beginner" },
  { id: 16, title: "HTTP & HTTPS Protocols", branch: "CSE", category: "Networking", difficulty: "Intermediate" },
  { id: 17, title: "DNS Explained", branch: "CSE", category: "Networking", difficulty: "Intermediate" },
  { id: 18, title: "Responsive Web Design", branch: "CSE", category: "Web Dev", difficulty: "Intermediate" },
  { id: 19, title: "React Native & Mobile App Dev", branch: "CSE", category: "Mobile Dev", difficulty: "Intermediate" },
  { id: 20, title: "Node.js & Server Fundamentals", branch: "CSE", category: "Backend", difficulty: "Intermediate" },
  { id: 21, title: "RESTful Web Services", branch: "CSE", category: "Backend", difficulty: "Intermediate" },
  { id: 22, title: "Docker & Containerization", branch: "CSE", category: "DevOps", difficulty: "Intermediate" },
  { id: 23, title: "Kubernetes & Orchestration", branch: "CSE", category: "DevOps", difficulty: "Advanced" },
  { id: 24, title: "Data Structures - Arrays & Lists", branch: "CSE", category: "DSA", difficulty: "Beginner" },
  { id: 25, title: "Data Structures - Stacks & Queues", branch: "CSE", category: "DSA", difficulty: "Intermediate" },
  { id: 26, title: "Algorithms - Sorting & Searching", branch: "CSE", category: "DSA", difficulty: "Intermediate" },
  { id: 27, title: "Object-Oriented Programming (OOP)", branch: "CSE", category: "Programming", difficulty: "Intermediate" },
  { id: 28, title: "Software Engineering Principles", branch: "CSE", category: "Software Eng", difficulty: "Intermediate" },
  { id: 29, title: "Microservices Architecture", branch: "CSE", category: "Backend", difficulty: "Advanced" },
  { id: 30, title: "GraphQL vs REST", branch: "CSE", category: "Backend", difficulty: "Intermediate" },
  { id: 31, title: "System Design Basics", branch: "CSE", category: "Architecture", difficulty: "Advanced" },
  { id: 32, title: "DevOps & CI/CD Pipelines", branch: "CSE", category: "DevOps", difficulty: "Intermediate" },
  { id: 33, title: "Artificial Intelligence Basics", branch: "AI & ML", category: "AI", difficulty: "Beginner" },
  { id: 34, title: "Machine Learning Fundamentals", branch: "AI & ML", category: "ML", difficulty: "Intermediate" },
  { id: 35, title: "Deep Learning & Neural Networks", branch: "AI & ML", category: "AI", difficulty: "Advanced" },
  { id: 36, title: "Web Security & OWASP Top 10", branch: "CSE", category: "Security", difficulty: "Advanced" },
  { id: 37, title: "Information Security & Cryptography", branch: "CSE", category: "Security", difficulty: "Intermediate" },
  { id: 38, title: "ESP32 & IoT Hardware", branch: "ECE", category: "IoT", difficulty: "Intermediate" },
  { id: 39, title: "Embedded Systems & Microcontrollers", branch: "ECE", category: "Electronics", difficulty: "Intermediate" },
  { id: 40, title: "Digital Electronics Fundamentals", branch: "ECE", category: "Electronics", difficulty: "Beginner" },
  { id: 41, title: "Signal Processing & Communication", branch: "ECE", category: "Telecom", difficulty: "Intermediate" },
  { id: 42, title: "Electrical Machines & Drives", branch: "EEE", category: "Electrical", difficulty: "Intermediate" },
  { id: 43, title: "Thermodynamics Fundamentals", branch: "MECH", category: "Mechanical", difficulty: "Intermediate" },
  { id: 44, title: "Fluid Mechanics Principles", branch: "MECH", category: "Mechanical", difficulty: "Intermediate" },
  { id: 45, title: "Civil Engineering & Surveying", branch: "CIVIL", category: "Civil", difficulty: "Beginner" },
  { id: 46, title: "CAD/CAM & Engineering Graphics", branch: "MECH", category: "Design", difficulty: "Intermediate" },
  { id: 47, title: "Agile & Scrum Methodologies", branch: "CSE", category: "Management", difficulty: "Beginner" },
  { id: 48, title: "Big Data & Analytics Basics", branch: "CSE", category: "Data Science", difficulty: "Intermediate" },
  { id: 49, title: "Blockchain & Smart Contracts", branch: "CSE", category: "Web3", difficulty: "Advanced" },
  { id: 50, title: "Cloud Native & Serverless Computing", branch: "CSE", category: "Cloud", difficulty: "Advanced" }
];

// Topic-Specific Question Banks
const TOPIC_QUESTION_BANKS = {
  "GitHub & Git Basics": [
    {
      question: "Which tool tracks changes in a project’s files?",
      correct: "Git",
      distractors: ["GitHub", "Docker", "SQL"],
      explanation: "Git is the version-control tool used to track changes."
    },
    {
      question: "What is GitHub?",
      correct: "A hosted platform for Git repositories and collaboration",
      distractors: ["A programming language", "A database engine", "A computer network protocol"],
      explanation: "GitHub provides hosted repositories and collaboration features around Git."
    },
    {
      question: "What does a Git commit represent?",
      correct: "A saved change in repository history",
      distractors: ["A remote server", "A programming language", "A network address"],
      explanation: "A commit records a set of changes in Git history."
    },
    {
      question: "What is a branch used for?",
      correct: "A separate line of development",
      distractors: ["Encrypting a file", "Running a database", "Creating a network"],
      explanation: "Branches let developers work on separate lines of development."
    },
    {
      question: "What does git clone do?",
      correct: "Copies a repository to a local environment",
      distractors: ["Deletes a repository", "Creates a password", "Publishes a website"],
      explanation: "Clone creates a local copy of a repository."
    },
    {
      question: "What is a pull request?",
      correct: "A proposal to merge changes",
      distractors: ["A database query", "A password reset", "A cloud storage bucket"],
      explanation: "A pull request is used to propose and review changes before merging."
    },
    {
      question: "What does git push do?",
      correct: "Sends local commits to a remote repository",
      distractors: ["Deletes commits", "Creates an HTML page", "Starts a firewall"],
      explanation: "Push transfers local commits to a configured remote."
    },
    {
      question: "What does git pull commonly do?",
      correct: "Fetches and integrates changes from a remote",
      distractors: ["Formats a disk", "Creates a database", "Encrypts a password"],
      explanation: "Pull obtains remote changes and integrates them into the current branch."
    },
    {
      question: "What is a repository?",
      correct: "A location containing a project's files and version history",
      distractors: ["A network cable", "A browser", "A password"],
      explanation: "A repository contains project files and version-control history."
    },
    {
      question: "What is GitHub Actions commonly used for?",
      correct: "Automating workflows such as testing and deployment",
      distractors: ["Writing SQL queries", "Drawing circuits", "Managing IP addresses"],
      explanation: "GitHub Actions automates repository workflows."
    },
    {
      question: "What is a fork on GitHub?",
      correct: "A personal copy of another repository on GitHub",
      distractors: ["A local password", "A network protocol", "A compiler"],
      explanation: "A fork creates a separate copy of a repository under another account or organization."
    },
    {
      question: "What does the staging area do in Git?",
      correct: "Prepares selected changes for a commit",
      distractors: ["Stores cloud backups", "Runs a web server", "Encrypts traffic"],
      explanation: "The staging area lets you choose changes to include in the next commit."
    },
    {
      question: "What does git diff show?",
      correct: "Changes between versions or working states",
      distractors: ["Internet speed", "Database tables", "CPU temperature"],
      explanation: "Git diff displays differences between file states."
    },
    {
      question: "What is a Git tag often used for?",
      correct: "Naming a specific point such as a release",
      distractors: ["Creating a firewall", "Storing passwords", "Running a database"],
      explanation: "Tags provide named references to particular commits, often releases."
    },
    {
      question: "Why use version control?",
      correct: "To track changes and collaborate safely",
      distractors: ["To increase screen brightness", "To replace an operating system", "To compress videos"],
      explanation: "Version control tracks changes and supports collaboration and recovery."
    },
    {
      question: "Which command initializes a new Git repository in the current folder?",
      correct: "git init",
      distractors: ["git new", "git create", "git start"],
      explanation: "git init initializes a brand new Git repository."
    },
    {
      question: "Which command adds untracked files to the staging area?",
      correct: "git add",
      distractors: ["git stage", "git push", "git save"],
      explanation: "git add stages modified or new files for committing."
    },
    {
      question: "Which command displays the state of the working directory and staging area?",
      correct: "git status",
      distractors: ["git check", "git log", "git info"],
      explanation: "git status lists changed, staged, and untracked files."
    },
    {
      question: "Which command shows the commit history for the current branch?",
      correct: "git log",
      distractors: ["git history", "git list", "git trace"],
      explanation: "git log outputs commit history details."
    },
    {
      question: "Which command combines changes from one branch into the active branch?",
      correct: "git merge",
      distractors: ["git combine", "git join", "git append"],
      explanation: "git merge integrates history from another branch into the target branch."
    }
  ],
  "APIs & How They Work": [
    {
      question: "What does API stand for?",
      correct: "Application Programming Interface",
      distractors: ["Automated Process Integration", "Application Protocol Index", "Advanced Programming Interface"],
      explanation: "API stands for Application Programming Interface."
    },
    {
      question: "What data format is most commonly used in modern REST APIs?",
      correct: "JSON",
      distractors: ["CSV", "Plain Binary", "Assembly Code"],
      explanation: "JSON (JavaScript Object Notation) is the standard format for REST APIs."
    },
    {
      question: "Which HTTP method is used to retrieve data from an API?",
      correct: "GET",
      distractors: ["POST", "DELETE", "PUT"],
      explanation: "GET requests fetch data from a server endpoint."
    },
    {
      question: "Which HTTP method is used to create a new resource via an API?",
      correct: "POST",
      distractors: ["GET", "OPTIONS", "HEAD"],
      explanation: "POST is standard for submitting data to create new records."
    },
    {
      question: "What HTTP status code indicates a successful request?",
      correct: "200 OK",
      distractors: ["404 Not Found", "500 Server Error", "403 Forbidden"],
      explanation: "200 OK signals a successful HTTP request response."
    },
    {
      question: "What HTTP status code indicates that a resource was not found?",
      correct: "404 Not Found",
      distractors: ["200 OK", "301 Redirect", "502 Bad Gateway"],
      explanation: "404 means the requested endpoint or resource does not exist."
    },
    {
      question: "What is an API endpoint?",
      correct: "A specific URL where an API receives requests",
      distractors: ["A hardware processor pin", "A database backup drive", "A CSS style rule"],
      explanation: "An endpoint is a specific URI/URL path for interacting with a service."
    },
    {
      question: "What is API Rate Limiting?",
      correct: "Restricting the number of API requests a client can make in a given time",
      distractors: ["Increasing internet download bandwidth", "Encrypting database passwords", "Deleting unused server files"],
      explanation: "Rate limiting prevents abuse by limiting request velocity."
    },
    {
      question: "What header is used to pass authentication tokens in HTTP requests?",
      correct: "Authorization",
      distractors: ["Content-Type", "Accept-Encoding", "User-Agent"],
      explanation: "The Authorization header carries Bearer tokens or credentials."
    },
    {
      question: "What is CORS in web APIs?",
      correct: "Cross-Origin Resource Sharing security mechanism",
      distractors: ["Central Operating Router System", "Client Object Recovery Service", "Cloud Operations Remote Storage"],
      explanation: "CORS controls cross-domain HTTP requests from browsers."
    },
    {
      question: "Which HTTP method is used to update an existing resource completely?",
      correct: "PUT",
      distractors: ["GET", "TRACE", "CONNECT"],
      explanation: "PUT updates or replaces a target resource representation."
    },
    {
      question: "Which HTTP method is used for partial updates to a resource?",
      correct: "PATCH",
      distractors: ["POST", "OPTIONS", "GET"],
      explanation: "PATCH applies partial modifications to a resource."
    },
    {
      question: "What does statelessness mean in REST APIs?",
      correct: "Each request from a client contains all necessary information and no session state is stored on the server",
      distractors: ["Servers store all user cookies in memory", "APIs cannot connect to databases", "Clients do not receive response codes"],
      explanation: "Statelessness means the server does not hold client session context between calls."
    },
    {
      question: "What is a Webhook?",
      correct: "An automated HTTP callback triggered by an event",
      distractors: ["A browser extension", "A physical network plug", "A CSS animation keyframe"],
      explanation: "Webhooks send real-time event notifications via HTTP POST."
    },
    {
      question: "What tool is commonly used to test and inspect HTTP APIs?",
      correct: "Postman or cURL",
      distractors: ["Photoshop", "Docker Engine", "Git Bash only"],
      explanation: "Postman and cURL are industry standards for API testing."
    },
    {
      question: "What HTTP status code represents a server-side error?",
      correct: "500 Internal Server Error",
      distractors: ["200 OK", "400 Bad Request", "401 Unauthorized"],
      explanation: "500-level codes indicate unexpected errors on the server."
    },
    {
      question: "What HTTP status code represents an unauthorized or unauthenticated request?",
      correct: "401 Unauthorized",
      distractors: ["200 OK", "404 Not Found", "302 Found"],
      explanation: "401 indicates missing or invalid authentication credentials."
    },
    {
      question: "What HTTP status code indicates forbidden access despite authentication?",
      correct: "403 Forbidden",
      distractors: ["200 OK", "404 Not Found", "500 Server Error"],
      explanation: "403 means the server understands credentials but refuses access."
    },
    {
      question: "What content type header is set when sending JSON payloads?",
      correct: "application/json",
      distractors: ["text/html", "multipart/form-data", "application/x-www-form-urlencoded"],
      explanation: "application/json informs the server that request payload is JSON formatted."
    },
    {
      question: "What does OpenAPI (Swagger) specification provide?",
      correct: "A standard description format for RESTful APIs",
      distractors: ["A database storage engine", "A CSS styling framework", "An operating system kernel"],
      explanation: "OpenAPI provides machine-readable documentation and contract specifications for APIs."
    }
  ],
  "Cloud Computing Basics": [
    {
      question: "What is Cloud Computing?",
      correct: "On-demand delivery of IT resources and computing power over the Internet",
      distractors: ["Local offline file storage on hard drives", "Running programs on a floppy disk", "Direct physical cable networking between PCs"],
      explanation: "Cloud computing delivers computing power, databases, and storage over the internet."
    },
    {
      question: "What does IaaS stand for in Cloud Computing?",
      correct: "Infrastructure as a Service",
      distractors: ["Internet as a Storage", "Internal Architecture as a Service", "Integrated Application System"],
      explanation: "IaaS provides fundamental compute, networking, and storage infrastructure."
    },
    {
      question: "Which of the following is an example of SaaS (Software as a Service)?",
      correct: "Google Workspace / Microsoft 365",
      distractors: ["AWS EC2", "VirtualBox", "Physical Cisco Router"],
      explanation: "SaaS delivers end-user applications directly over the browser."
    },
    {
      question: "What is AWS EC2 used for?",
      correct: "Providing scalable virtual servers in the cloud",
      distractors: ["Storing physical hard disks", "Designing frontend web pages", "Writing SQL queries"],
      explanation: "Amazon EC2 provides resizable virtual machine instances."
    },
    {
      question: "What is Amazon S3 primarily used for?",
      correct: "Scalable object storage in the cloud",
      distractors: ["Running relational SQL queries", "Compiling C programs", "Managing CPU clock speeds"],
      explanation: "Amazon S3 stores images, videos, backups, and static files as objects."
    },
    {
      question: "What is elasticity in Cloud Computing?",
      correct: "The ability to dynamically scale resources up or down based on demand",
      distractors: ["Stretching physical server cables", "Encrypting database tables", "Running CPU at 100% capacity constantly"],
      explanation: "Elasticity automatically provisions or deprovisions resources as workloads change."
    },
    {
      question: "Which model offers a cloud environment exclusively used by a single organization?",
      correct: "Private Cloud",
      distractors: ["Public Cloud", "Hybrid Cloud", "Community Cloud"],
      explanation: "Private cloud infrastructure is operated solely for one organization."
    },
    {
      question: "What is a Hybrid Cloud?",
      correct: "A combination of public and private cloud environments sharing data and applications",
      distractors: ["A server powered by solar energy", "An offline local USB hub", "A peer-to-peer torrent network"],
      explanation: "Hybrid cloud connects private infrastructure with public cloud services."
    },
    {
      question: "What is Serverless Computing (e.g., AWS Lambda)?",
      correct: "A cloud model where cloud providers automatically manage server provisioning and scaling",
      distractors: ["Computing without any physical computers existing anywhere", "Running apps exclusively on mobile phones", "Using paper forms instead of databases"],
      explanation: "Serverless lets developers run code without managing underlying servers."
    },
    {
      question: "What is Cloud Auto-Scaling?",
      correct: "Automatically adjusting server capacity based on real-time traffic",
      distractors: ["Resizing desktop browser windows", "Scaling image file dimensions", "Increasing monitor brightness"],
      explanation: "Auto-scaling ensures sufficient instances run during traffic spikes and saves costs during lulls."
    },
    {
      question: "What does PaaS stand for?",
      correct: "Platform as a Service",
      distractors: ["Protocol as a Storage", "Private Application Server", "Public Access Service"],
      explanation: "PaaS provides runtime environments, OS, and deployment tools for developers (e.g. Heroku, AWS Elastic Beanstalk)."
    },
    {
      question: "What is a Region in major cloud providers like AWS or Azure?",
      correct: "A geographic location containing multiple data center Availability Zones",
      distractors: ["A folder on a local hard drive", "A single microchip pin", "A domain name extension"],
      explanation: "Regions are physical geographic locations housing clusters of data centers."
    },
    {
      question: "What is an Availability Zone (AZ)?",
      correct: "One or more isolated data centers within a Cloud Region equipped with independent power and networking",
      distractors: ["A website page section", "A Wi-Fi router password", "A software download speed test"],
      explanation: "AZs provide fault isolation within a region to ensure high availability."
    },
    {
      question: "What cloud pricing model is most common?",
      correct: "Pay-as-you-go based on actual resource consumption",
      distractors: ["Fixed upfront lifetime fee", "Free unlimited hardware forever", "Per-keyboard keypress billing"],
      explanation: "Pay-as-you-go bills users based on actual compute hours, memory, and bandwidth used."
    },
    {
      question: "What is Cloud Load Balancing used for?",
      correct: "Distributing incoming application traffic across multiple target servers",
      distractors: ["Balancing physical weight on server racks", "Cleaning CPU cooling fans", "Deleting old log files"],
      explanation: "Load balancers distribute traffic evenly to prevent individual server bottlenecks."
    }
  ]
};

// Generic Fallback Question Generator for unlisted topics
const GENERIC_DISTRACTORS = [
  "Legacy analog hardware interface.",
  "Deprecated database index pattern.",
  "Offline paper logging system.",
  "Unrelated system buffer mechanism.",
  "Manual desktop file shortcut."
];

function generateQuestionsForTopic(topicTitle, count = 15) {
  const cleanTitle = topicTitle.replace(/ Quiz$/i, '').trim();
  const bank = TOPIC_QUESTION_BANKS[cleanTitle];

  const questions = [];
  let seed = 0;
  for (let i = 0; i < topicTitle.length; i++) {
    seed += topicTitle.charCodeAt(i);
  }

  if (bank && bank.length >= count) {
    // Pick questions from curated domain bank
    for (let i = 0; i < count; i++) {
      const qObj = bank[i % bank.length];
      const correctText = qObj.correct;
      const distractors = qObj.distractors;
      
      // Shuffle options A, B, C, D
      const options = [correctText, ...distractors];
      seed = (seed * 9301 + 49297) % 233280;
      const correctIdx = Math.floor((seed / 233280) * 4);

      const temp = options[0];
      options[0] = options[correctIdx];
      options[correctIdx] = temp;

      const optLetters = ['A', 'B', 'C', 'D'];
      const correctLetter = optLetters[correctIdx];

      questions.push({
        question_number: i + 1,
        question_text: `Q${i + 1}. ${qObj.question}`,
        option_a: options[0],
        option_b: options[1],
        option_c: options[2],
        option_d: options[3],
        correct_option: correctLetter,
        explanation: `Option ${correctLetter} is correct. ${qObj.explanation}`
      });
    }
  } else {
    // Domain tailored generator for other topics
    const templates = [
      { q: `What is the primary definition of ${cleanTitle}?`, c: `A core technology or architectural framework designed for managing and executing ${cleanTitle} processes.` },
      { q: `Which key benefit is provided by ${cleanTitle}?`, c: `Improved operational efficiency, system scalability, modularity, and resource reliability.` },
      { q: `What is a fundamental requirement when implementing ${cleanTitle}?`, c: `Proper environment configuration, robust security protocols, and standardized interfaces.` },
      { q: `How does ${cleanTitle} handle execution and data states?`, c: `By utilizing structured schemas, optimized execution pipelines, and state synchronization.` },
      { q: `What is a recommended best practice when deploying ${cleanTitle}?`, c: `Conducting automated testing, continuous integration checks, and real-time monitoring.` },
      { q: `Which layer or component plays a vital role in ${cleanTitle}?`, c: `The core execution engine and central protocol controller.` },
      { q: `What is a common challenge or bottleneck in ${cleanTitle}?`, c: `Managing system state synchronization, resource contention, and network latency under heavy load.` },
      { q: `How is security typically enforced within ${cleanTitle}?`, c: `Through identity authentication, role-based access control, and end-to-end data encryption.` },
      { q: `Which metric is critical for measuring the performance of ${cleanTitle}?`, c: `Response latency, throughput rate, CPU/memory utilization, and error rates.` },
      { q: `What is the role of versioning in ${cleanTitle}?`, c: `To support safe software updates, maintain backward compatibility, and enable quick rollbacks.` },
      { q: `In what scenario is ${cleanTitle} most effectively applied?`, c: `In modern scalable enterprise systems requiring structured workflows and high availability.` },
      { q: `Which interface or tool is standard for interacting with ${cleanTitle}?`, c: `Dedicated command-line tools, SDK APIs, and administration dashboards.` },
      { q: `What is the initial phase when developing with ${cleanTitle}?`, c: `Defining system requirements, environment setup, and dependency configuration.` },
      { q: `Which debugging technique is recommended for ${cleanTitle}?`, c: `Inspecting diagnostic trace logs, using debugger tools, and analyzing stack traces.` },
      { q: `What is the overall goal of mastering ${cleanTitle}?`, c: `To design, build, and maintain production-grade, fault-tolerant technology solutions.` }
    ];

    // Domain-specific realistic distractors bank
    const categoryDistractors = {
      'DevOps': [
        ['Executing unindexed raw SQL join queries on legacy tables', 'Manually editing physical DNS host files on every client node', 'Disabling network firewalls and SSL certificates globally'],
        ['Compiling C source code to assembly without version control', 'Storing unencrypted database passwords in client HTML attributes', 'Hardcoding static IP addresses into client-side CSS files'],
        ['Formatting physical hard disk partitions using fdisk', 'Bypassing HTTP CORS policy settings globally', 'Directly manipulating CPU register pointers in kernel space']
      ],
      'Web Dev': [
        ['Formatting physical hard drive partitions using fdisk', 'Executing kernel interrupt service routines in assembly', 'Bypassing SSL certificates and CORS origin controls'],
        ['Calculating mechanical gear ratios and shaft torque', 'Compiling Java bytecode to Android DEX format', 'Soldering copper trace lines on multi-layer PCBs'],
        ['Directly editing raw database binary block files', 'Increasing CPU fan speed to fix JavaScript memory leaks', 'Running unmonitored background tasks without process supervision']
      ],
      'Mobile Dev': [
        ['Mounting physical EXT4 Linux hard drive partitions', 'Executing SQL DDL schema migration queries', 'Calculating thermodynamic enthalpy changes'],
        ['Compiling C++ code to bare-metal microcontroller hex files', 'Configuring BGP router peering connections', 'Bypassing mobile OS permission prompts by disabling sandbox controls'],
        ['Soldering surface-mount resistors on circuit boards', 'Writing raw CSS flexbox grid layouts', 'Storing private API secrets in unencrypted public assets']
      ],
      'Cloud': [
        ['Executing raw SQL DDL queries on local sqlite files', 'Soldering copper wires on breadboards', 'Writing inline CSS styling in HTML documents'],
        ['Bypassing cloud IAM access policies using hardcoded root keys', 'Manually rebooting physical server racks during peaks', 'Formatting client hard drives automatically during deployments'],
        ['Compiling C source code into assembly binaries', 'Disabling network security groups globally', 'Storing unencrypted keys in public version control']
      ],
      'Security': [
        ['Converting vector SVG graphics to JPEG files', 'Executing Python list comprehensions on local arrays', 'Hardcoding static credentials in open-source client code'],
        ['Writing CSS flexbox alignment rules', 'Creating React component state hooks', 'Disabling multi-factor authentication across all admin accounts'],
        ['Formatting PostgreSQL database tables', 'Calculating AC motor torque values', 'Disabling SSL/TLS encryption for faster packet transmission']
      ],
      'OS': [
        ['Declaring React useState hooks inside functional components', 'Writing CSS Flexbox grid layout rules', 'Publishing NPM package modules to public registries'],
        ['Bypassing file system read/write permissions for all root users', 'Running unmonitored background tasks without process supervision', 'Creating SQL INNER JOIN queries on unindexed tables'],
        ['Soldering microcontrollers on breadboards', 'Configuring Webpack loader configurations', 'Storing plaintext credentials in public environment files']
      ],
      'Networking': [
        ['Exporting SVG graphics to PNG format', 'Executing Python list comprehensions', 'Disabling network firewalls to accelerate socket speed'],
        ['Writing CSS grid layout rules', 'Soldering surface-mount capacitors on PCBs', 'Bypassing packet validation headers during transmission'],
        ['Formatting local hard drives using fdisk', 'Calculating fluid flow velocity in pipes', 'Hardcoding static gateway routes without failover protection']
      ],
      'Programming': [
        ['Configuring Kubernetes Ingress controller YAML manifests', 'Allocating AWS S3 bucket storage instances', 'Setting up BGP router peering connections'],
        ['Broadcasting wireless 5GHz WiFi SSID signals', 'Storing plain-text passwords in unencrypted global variables', 'Hardcoding static binary files without backup'],
        ['Bypassing compiler type-checking rules', 'Soldering microcontrollers on breadboards', 'Executing raw disk sector wipes during runtime']
      ],
      'Databases': [
        ['Increasing physical RAM voltage during query execution', 'Rendering 3D WebGL graphics inside database tables', 'Sending HTTP 404 response codes to connected clients'],
        ['Converting binary executable files into CSV spreadsheets', 'Executing unvalidated user input via raw string concatenation', 'Disabling database transaction logs during write spikes'],
        ['Compiling C++ code to assembly', 'Writing CSS grid layouts for web pages', 'Configuring Webpack bundler plugins']
      ],
      'Backend': [
        ['Rendering HTML canvas animations', 'Calculating mechanical shaft torque', 'Storing database secrets in client browser localStorage'],
        ['Bypassing authentication middleware on public routes', 'Disabling API rate limiting during high traffic load', 'Running unmonitored background workers without retry queues'],
        ['Soldering PCB components', 'Writing CSS media queries', 'Compiling Java code to C binaries']
      ],
      'DSA': [
        ['Configuring Kubernetes cluster Ingress controllers', 'Setting up BGP router peering connections', 'Broadcasting WiFi SSID signals across access points'],
        ['Allocating cloud S3 storage buckets', 'Using linear search on unsorted arrays without indexing', 'Bypassing algorithm complexity bounds'],
        ['Writing inline CSS styles', 'Soldering resistors on breadboards', 'Disabling memory garbage collection']
      ],
      'AI': [
        ['Soldering multi-layer PCB copper circuit boards', 'Configuring FTP file transfer servers on port 21', 'Drawing 2D vector shapes on HTML5 canvas elements'],
        ['Overfitting models by training on unvalidated random noise', 'Using unnormalized raw datasets without feature scaling', 'Bypassing model evaluation validation metrics'],
        ['Writing CSS flexbox rules', 'Formatting PostgreSQL tables', 'Compiling C source code']
      ],
      'ML': [
        ['Configuring NGINX reverse proxy servers', 'Executing SQL alter table statements', 'Training models without cross-validation or holdout test sets'],
        ['Using raw unscaled data with extreme outliers', 'Ignoring feature correlation during feature selection', 'Bypassing hyperparameter tuning'],
        ['Soldering circuit components', 'Writing HTML forms', 'Creating React components']
      ],
      'IoT': [
        ['Deploying Kubernetes pods across multi-cloud clusters', 'Writing React Native flex layout styles', 'Parsing JSON Web Tokens in client request headers'],
        ['Operating components beyond recommended voltage and thermal limits', 'Ignoring signal noise filtering in analog-to-digital conversions', 'Disabling hardware watchdog timers'],
        ['Executing SQL JOIN queries', 'Writing CSS stylesheets', 'Compiling TypeScript code']
      ],
      'Electronics': [
        ['Deploying Kubernetes cluster pods', 'Writing React Native layout components', 'Parsing JWT tokens in API requests'],
        ['Exceeding component power ratings without heatsinks', 'Ignoring decoupling capacitors on IC power pins', 'Operating logic gates outside voltage thresholds'],
        ['Executing SQL queries', 'Writing CSS rules', 'Creating NPM packages']
      ],
      'Electrical': [
        ['Writing React component state hooks', 'Parsing JSON web tokens', 'Operating electrical machines above rated thermal limits'],
        ['Ignoring power factor correction in inductive loads', 'Bypassing circuit breakers and overcurrent protection', 'Running transformers without oil cooling'],
        ['Creating HTML web pages', 'Executing SQL queries', 'Configuring Docker containers']
      ],
      'Mechanical': [
        ['Importing NPM package dependencies in Node.js', 'Declaring React component props interfaces', 'Querying MongoDB document collections'],
        ['Exceeding material yield strength without safety factors', 'Ignoring thermal expansion stress during structural assembly', 'Operating fluid systems above cavitation limits'],
        ['Writing CSS stylesheets', 'Parsing JSON payloads', 'Setting up Git repositories']
      ],
      'Civil': [
        ['Writing JavaScript async/await promises', 'Creating CSS grid layouts', 'Querying SQL database tables'],
        ['Ignoring soil bearing capacity during foundation design', 'Exceeding structural load limits without safety factors', 'Bypassing concrete curing time requirements'],
        ['Configuring Webpack bundlers', 'Setting up Docker containers', 'Soldering circuit boards']
      ]
    };

    const defaultDistractorSets = [
      ['Executing unindexed SQL query operations', 'Manually editing system host files on client nodes', 'Disabling network security firewalls globally'],
      ['Compiling raw source code without version control', 'Storing unencrypted database passwords in client HTML', 'Hardcoding static IP addresses into CSS files'],
      ['Formatting physical hard disk partitions using fdisk', 'Bypassing HTTP security policies globally', 'Directly manipulating CPU register pointers']
    ];

    const qlMatch = QUICK_LEARNS.find(q => q.title.toLowerCase() === cleanTitle.toLowerCase());
    const category = (qlMatch && qlMatch.category) || 'Programming';
    const distractorBank = categoryDistractors[category] || defaultDistractorSets;

    for (let i = 0; i < count; i++) {
      const template = templates[i % templates.length];
      const correctText = template.c;
      const setIdx = i % distractorBank.length;
      const distSet = distractorBank[setIdx];

      const d1 = distSet[0];
      const d2 = distSet[1];
      const d3 = distSet[2];

      const options = [correctText, d1, d2, d3];
      seed = (seed * 9301 + 49297) % 233280;
      const correctIdx = Math.floor((seed / 233280) * 4);

      const temp = options[0];
      options[0] = options[correctIdx];
      options[correctIdx] = temp;

      const optLetters = ['A', 'B', 'C', 'D'];
      const correctLetter = optLetters[correctIdx];

      questions.push({
        question_number: i + 1,
        question_text: `Q${i + 1}. ${template.q}`,
        option_a: options[0],
        option_b: options[1],
        option_c: options[2],
        option_d: options[3],
        correct_option: correctLetter,
        explanation: `Option ${correctLetter} is correct. ${correctText}`
      });
    }
  }

  return questions;
}

function generateSQLSeeds() {
  let qlSql = `-- ==============================================================================\n`;
  qlSql += `-- FEEDX SEED MIGRATION: PART 1 - 50 QUICK LEARNS (750 MCQS)\n`;
  qlSql += `-- ==============================================================================\n\n`;

  qlSql += `BEGIN;\n\n`;
  qlSql += `-- Clear existing tables\n`;
  qlSql += `TRUNCATE TABLE public.student_lesson_progress CASCADE;\n`;
  qlSql += `TRUNCATE TABLE public.explore_quiz_attempts CASCADE;\n`;
  qlSql += `TRUNCATE TABLE public.explore_quiz_questions CASCADE;\n`;
  qlSql += `TRUNCATE TABLE public.explore_quizzes CASCADE;\n`;
  qlSql += `TRUNCATE TABLE public.quick_learn_checks CASCADE;\n`;
  qlSql += `TRUNCATE TABLE public.quick_learn_lessons CASCADE;\n`;
  qlSql += `TRUNCATE TABLE public.fx_transactions CASCADE;\n\n`;

  let quizSql = `-- ==============================================================================\n`;
  quizSql += `-- FEEDX SEED MIGRATION: PART 2 - 50 QUIZZES (1,000 MCQS)\n`;
  quizSql += `-- ==============================================================================\n\n`;

  quizSql += `BEGIN;\n\n`;

  QUICK_LEARNS.forEach(ql => {
    const slug = ql.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const shortDesc = `Master ${ql.title} fundamentals with quick reading and 15 practice MCQs on FEEDX.`;
    
    const learningText = ql.text || `${ql.title} is an essential concept in modern technology and engineering education. Understanding its core components enables effective problem-solving and application development.`;
    const keyPts = ql.keyPoints ? ql.keyPoints.map(kp => `- **${kp}**`).join('\n') : `- **Core Concepts**: Fundamentals of ${ql.title}.\n- **Best Practices**: Implementation standards.\n- **Workflow**: Practical application and deployment.`;
    
    const contentMd = `### Learning Text\n${learningText}\n\n### Key Points\n${keyPts}`;

    qlSql += `-- Quick Learn ${ql.id}: ${ql.title}\n`;
    qlSql += `INSERT INTO public.quick_learn_lessons (id, title, slug, branch, category, difficulty, estimated_minutes, is_recommended, fx_reward, short_description, content_markdown, is_published)\n`;
    qlSql += `VALUES (\n`;
    qlSql += `  '00000000-0000-4000-a000-${String(ql.id).padStart(12, '0')}',\n`;
    qlSql += `  '${ql.title.replace(/'/g, "''")}',\n`;
    qlSql += `  '${slug}',\n`;
    qlSql += `  '${ql.branch}',\n`;
    qlSql += `  '${ql.category}',\n`;
    qlSql += `  '${ql.difficulty}',\n`;
    qlSql += `  3,\n  TRUE,\n  10,\n`;
    qlSql += `  '${shortDesc.replace(/'/g, "''")}',\n`;
    qlSql += `  '${contentMd.replace(/'/g, "''")}',\n`;
    qlSql += `  TRUE\n`;
    qlSql += `) ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title;\n\n`;

    // 15 MCQs for Quick Learn Knowledge Check
    const questions = generateQuestionsForTopic(ql.title, 15);
    questions.forEach((q, idx) => {
      qlSql += `INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)\n`;
      qlSql += `VALUES (\n`;
      qlSql += `  '00000000-0001-4000-a000-${String(ql.id).padStart(6, '0')}${String(idx + 1).padStart(6, '0')}',\n`;
      qlSql += `  '00000000-0000-4000-a000-${String(ql.id).padStart(12, '0')}',\n`;
      qlSql += `  '${q.question_text.replace(/'/g, "''")}',\n`;
      qlSql += `  '${q.option_a.replace(/'/g, "''")}',\n`;
      qlSql += `  '${q.option_b.replace(/'/g, "''")}',\n`;
      qlSql += `  '${q.option_c.replace(/'/g, "''")}',\n`;
      qlSql += `  '${q.option_d.replace(/'/g, "''")}',\n`;
      qlSql += `  '${q.correct_option}',\n`;
      qlSql += `  '${q.explanation.replace(/'/g, "''")}'\n`;
      qlSql += `);\n`;
    });
    qlSql += `\n`;

    // Corresponding Explore Quiz
    quizSql += `-- Explore Quiz ${ql.id}: ${ql.title} Mastery Quiz\n`;
    quizSql += `INSERT INTO public.explore_quizzes (id, title, description, category, branch, difficulty, question_count, estimated_minutes, fx_reward, is_daily, is_published)\n`;
    quizSql += `VALUES (\n`;
    quizSql += `  '00000000-0002-4000-a000-${String(ql.id).padStart(12, '0')}',\n`;
    quizSql += `  '${ql.title.replace(/'/g, "''")} Challenge Quiz',\n`;
    quizSql += `  'Test your knowledge on ${ql.title.replace(/'/g, "''")} with 20 comprehensive questions.',\n`;
    quizSql += `  '${ql.category}',\n`;
    quizSql += `  '${ql.branch}',\n`;
    quizSql += `  '${ql.difficulty}',\n`;
    quizSql += `  20,\n  8,\n  15,\n  FALSE,\n  TRUE\n`;
    quizSql += `);\n\n`;

    const quizQuestions = generateQuestionsForTopic(`${ql.title} Quiz`, 20);
    quizQuestions.forEach((q, idx) => {
      quizSql += `INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)\n`;
      quizSql += `VALUES (\n`;
      quizSql += `  '00000000-0003-4000-a000-${String(ql.id).padStart(6, '0')}${String(idx + 1).padStart(6, '0')}',\n`;
      quizSql += `  '00000000-0002-4000-a000-${String(ql.id).padStart(12, '0')}',\n`;
      quizSql += `  ${q.question_number},\n`;
      quizSql += `  '${q.question_text.replace(/'/g, "''")}',\n`;
      quizSql += `  '${q.option_a.replace(/'/g, "''")}',\n`;
      quizSql += `  '${q.option_b.replace(/'/g, "''")}',\n`;
      quizSql += `  '${q.option_c.replace(/'/g, "''")}',\n`;
      quizSql += `  '${q.option_d.replace(/'/g, "''")}',\n`;
      quizSql += `  '${q.correct_option}',\n`;
      quizSql += `  '${q.explanation.replace(/'/g, "''")}'\n`;
      quizSql += `);\n`;
    });
    quizSql += `\n`;
  });

  qlSql += `COMMIT;\n`;
  quizSql += `COMMIT;\n`;
  return { qlSql, quizSql };
}

async function main() {
  console.log("Generating split SQL seed files for 50 Quick Learns, 50 Quizzes, and 1,750 MCQs...");
  const { qlSql, quizSql } = generateSQLSeeds();
  
  const output1 = path.join(__dirname, '..', 'supabase', 'seed_1_quick_learns.sql');
  const output2 = path.join(__dirname, '..', 'supabase', 'seed_2_quizzes.sql');
  
  fs.writeFileSync(output1, qlSql, 'utf8');
  fs.writeFileSync(output2, quizSql, 'utf8');
  
  console.log(`Successfully written Part 1 to: ${output1}`);
  console.log(`Successfully written Part 2 to: ${output2}`);
}

main().catch(console.error);
