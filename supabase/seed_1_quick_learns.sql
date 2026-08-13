-- ==============================================================================
-- FEEDX SEED MIGRATION: PART 1 - 50 QUICK LEARNS (750 MCQS)
-- ==============================================================================

BEGIN;

-- Clear existing tables
TRUNCATE TABLE public.student_lesson_progress CASCADE;
TRUNCATE TABLE public.explore_quiz_attempts CASCADE;
TRUNCATE TABLE public.explore_quiz_questions CASCADE;
TRUNCATE TABLE public.explore_quizzes CASCADE;
TRUNCATE TABLE public.quick_learn_checks CASCADE;
TRUNCATE TABLE public.quick_learn_lessons CASCADE;
TRUNCATE TABLE public.fx_transactions CASCADE;

-- Quick Learn 1: GitHub & Git Basics
INSERT INTO public.quick_learn_lessons (id, title, slug, branch, category, difficulty, estimated_minutes, is_recommended, fx_reward, short_description, content_markdown, is_published)
VALUES (
  '00000000-0000-4000-a000-000000000001',
  'GitHub & Git Basics',
  'github-git-basics',
  'CSE',
  'DevOps',
  'Beginner',
  3,
  TRUE,
  10,
  'Master GitHub & Git Basics fundamentals with quick reading and 15 practice MCQs on FEEDX.',
  '### Learning Text
Git is a distributed version-control system used to track changes in files and collaborate on software. GitHub is a cloud platform built around Git that provides repositories, pull requests, issues, actions and collaboration features.

### Key Points
- **Git**
- **GitHub**
- **repository**
- **commit**
- **branch**
- **merge**',
  TRUE
) ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title;

INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000001000001',
  '00000000-0000-4000-a000-000000000001',
  'Q1. Which tool tracks changes in a project’s files?',
  'Git',
  'GitHub',
  'Docker',
  'SQL',
  'A',
  'Option A is correct. Git is the version-control tool used to track changes.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000001000002',
  '00000000-0000-4000-a000-000000000001',
  'Q2. What is GitHub?',
  'A computer network protocol',
  'A programming language',
  'A database engine',
  'A hosted platform for Git repositories and collaboration',
  'D',
  'Option D is correct. GitHub provides hosted repositories and collaboration features around Git.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000001000003',
  '00000000-0000-4000-a000-000000000001',
  'Q3. What does a Git commit represent?',
  'A network address',
  'A remote server',
  'A programming language',
  'A saved change in repository history',
  'D',
  'Option D is correct. A commit records a set of changes in Git history.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000001000004',
  '00000000-0000-4000-a000-000000000001',
  'Q4. What is a branch used for?',
  'A separate line of development',
  'Encrypting a file',
  'Running a database',
  'Creating a network',
  'A',
  'Option A is correct. Branches let developers work on separate lines of development.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000001000005',
  '00000000-0000-4000-a000-000000000001',
  'Q5. What does git clone do?',
  'Creates a password',
  'Deletes a repository',
  'Copies a repository to a local environment',
  'Publishes a website',
  'C',
  'Option C is correct. Clone creates a local copy of a repository.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000001000006',
  '00000000-0000-4000-a000-000000000001',
  'Q6. What is a pull request?',
  'A database query',
  'A proposal to merge changes',
  'A password reset',
  'A cloud storage bucket',
  'B',
  'Option B is correct. A pull request is used to propose and review changes before merging.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000001000007',
  '00000000-0000-4000-a000-000000000001',
  'Q7. What does git push do?',
  'Starts a firewall',
  'Deletes commits',
  'Creates an HTML page',
  'Sends local commits to a remote repository',
  'D',
  'Option D is correct. Push transfers local commits to a configured remote.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000001000008',
  '00000000-0000-4000-a000-000000000001',
  'Q8. What does git pull commonly do?',
  'Encrypts a password',
  'Formats a disk',
  'Creates a database',
  'Fetches and integrates changes from a remote',
  'D',
  'Option D is correct. Pull obtains remote changes and integrates them into the current branch.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000001000009',
  '00000000-0000-4000-a000-000000000001',
  'Q9. What is a repository?',
  'A password',
  'A network cable',
  'A browser',
  'A location containing a project''s files and version history',
  'D',
  'Option D is correct. A repository contains project files and version-control history.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000001000010',
  '00000000-0000-4000-a000-000000000001',
  'Q10. What is GitHub Actions commonly used for?',
  'Drawing circuits',
  'Writing SQL queries',
  'Automating workflows such as testing and deployment',
  'Managing IP addresses',
  'C',
  'Option C is correct. GitHub Actions automates repository workflows.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000001000011',
  '00000000-0000-4000-a000-000000000001',
  'Q11. What is a fork on GitHub?',
  'A personal copy of another repository on GitHub',
  'A local password',
  'A network protocol',
  'A compiler',
  'A',
  'Option A is correct. A fork creates a separate copy of a repository under another account or organization.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000001000012',
  '00000000-0000-4000-a000-000000000001',
  'Q12. What does the staging area do in Git?',
  'Stores cloud backups',
  'Prepares selected changes for a commit',
  'Runs a web server',
  'Encrypts traffic',
  'B',
  'Option B is correct. The staging area lets you choose changes to include in the next commit.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000001000013',
  '00000000-0000-4000-a000-000000000001',
  'Q13. What does git diff show?',
  'CPU temperature',
  'Internet speed',
  'Database tables',
  'Changes between versions or working states',
  'D',
  'Option D is correct. Git diff displays differences between file states.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000001000014',
  '00000000-0000-4000-a000-000000000001',
  'Q14. What is a Git tag often used for?',
  'Creating a firewall',
  'Naming a specific point such as a release',
  'Storing passwords',
  'Running a database',
  'B',
  'Option B is correct. Tags provide named references to particular commits, often releases.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000001000015',
  '00000000-0000-4000-a000-000000000001',
  'Q15. Why use version control?',
  'To compress videos',
  'To increase screen brightness',
  'To replace an operating system',
  'To track changes and collaborate safely',
  'D',
  'Option D is correct. Version control tracks changes and supports collaboration and recovery.'
);

-- Quick Learn 2: APIs & How They Work
INSERT INTO public.quick_learn_lessons (id, title, slug, branch, category, difficulty, estimated_minutes, is_recommended, fx_reward, short_description, content_markdown, is_published)
VALUES (
  '00000000-0000-4000-a000-000000000002',
  'APIs & How They Work',
  'apis-how-they-work',
  'CSE',
  'Web Dev',
  'Beginner',
  3,
  TRUE,
  10,
  'Master APIs & How They Work fundamentals with quick reading and 15 practice MCQs on FEEDX.',
  '### Learning Text
An API (Application Programming Interface) is a set of rules and protocols that allows different software applications to communicate with each other over HTTP using formats like JSON or XML.

### Key Points
- **REST**
- **Endpoint**
- **JSON**
- **HTTP Methods**
- **Status Codes**
- **Authentication**',
  TRUE
) ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title;

INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000002000001',
  '00000000-0000-4000-a000-000000000002',
  'Q1. What does API stand for?',
  'Application Programming Interface',
  'Automated Process Integration',
  'Application Protocol Index',
  'Advanced Programming Interface',
  'A',
  'Option A is correct. API stands for Application Programming Interface.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000002000002',
  '00000000-0000-4000-a000-000000000002',
  'Q2. What data format is most commonly used in modern REST APIs?',
  'JSON',
  'CSV',
  'Plain Binary',
  'Assembly Code',
  'A',
  'Option A is correct. JSON (JavaScript Object Notation) is the standard format for REST APIs.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000002000003',
  '00000000-0000-4000-a000-000000000002',
  'Q3. Which HTTP method is used to retrieve data from an API?',
  'POST',
  'GET',
  'DELETE',
  'PUT',
  'B',
  'Option B is correct. GET requests fetch data from a server endpoint.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000002000004',
  '00000000-0000-4000-a000-000000000002',
  'Q4. Which HTTP method is used to create a new resource via an API?',
  'POST',
  'GET',
  'OPTIONS',
  'HEAD',
  'A',
  'Option A is correct. POST is standard for submitting data to create new records.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000002000005',
  '00000000-0000-4000-a000-000000000002',
  'Q5. What HTTP status code indicates a successful request?',
  '200 OK',
  '404 Not Found',
  '500 Server Error',
  '403 Forbidden',
  'A',
  'Option A is correct. 200 OK signals a successful HTTP request response.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000002000006',
  '00000000-0000-4000-a000-000000000002',
  'Q6. What HTTP status code indicates that a resource was not found?',
  '404 Not Found',
  '200 OK',
  '301 Redirect',
  '502 Bad Gateway',
  'A',
  'Option A is correct. 404 means the requested endpoint or resource does not exist.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000002000007',
  '00000000-0000-4000-a000-000000000002',
  'Q7. What is an API endpoint?',
  'A CSS style rule',
  'A hardware processor pin',
  'A database backup drive',
  'A specific URL where an API receives requests',
  'D',
  'Option D is correct. An endpoint is a specific URI/URL path for interacting with a service.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000002000008',
  '00000000-0000-4000-a000-000000000002',
  'Q8. What is API Rate Limiting?',
  'Restricting the number of API requests a client can make in a given time',
  'Increasing internet download bandwidth',
  'Encrypting database passwords',
  'Deleting unused server files',
  'A',
  'Option A is correct. Rate limiting prevents abuse by limiting request velocity.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000002000009',
  '00000000-0000-4000-a000-000000000002',
  'Q9. What header is used to pass authentication tokens in HTTP requests?',
  'Content-Type',
  'Authorization',
  'Accept-Encoding',
  'User-Agent',
  'B',
  'Option B is correct. The Authorization header carries Bearer tokens or credentials.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000002000010',
  '00000000-0000-4000-a000-000000000002',
  'Q10. What is CORS in web APIs?',
  'Cross-Origin Resource Sharing security mechanism',
  'Central Operating Router System',
  'Client Object Recovery Service',
  'Cloud Operations Remote Storage',
  'A',
  'Option A is correct. CORS controls cross-domain HTTP requests from browsers.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000002000011',
  '00000000-0000-4000-a000-000000000002',
  'Q11. Which HTTP method is used to update an existing resource completely?',
  'GET',
  'PUT',
  'TRACE',
  'CONNECT',
  'B',
  'Option B is correct. PUT updates or replaces a target resource representation.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000002000012',
  '00000000-0000-4000-a000-000000000002',
  'Q12. Which HTTP method is used for partial updates to a resource?',
  'GET',
  'POST',
  'OPTIONS',
  'PATCH',
  'D',
  'Option D is correct. PATCH applies partial modifications to a resource.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000002000013',
  '00000000-0000-4000-a000-000000000002',
  'Q13. What does statelessness mean in REST APIs?',
  'Clients do not receive response codes',
  'Servers store all user cookies in memory',
  'APIs cannot connect to databases',
  'Each request from a client contains all necessary information and no session state is stored on the server',
  'D',
  'Option D is correct. Statelessness means the server does not hold client session context between calls.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000002000014',
  '00000000-0000-4000-a000-000000000002',
  'Q14. What is a Webhook?',
  'A physical network plug',
  'A browser extension',
  'An automated HTTP callback triggered by an event',
  'A CSS animation keyframe',
  'C',
  'Option C is correct. Webhooks send real-time event notifications via HTTP POST.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000002000015',
  '00000000-0000-4000-a000-000000000002',
  'Q15. What tool is commonly used to test and inspect HTTP APIs?',
  'Photoshop',
  'Postman or cURL',
  'Docker Engine',
  'Git Bash only',
  'B',
  'Option B is correct. Postman and cURL are industry standards for API testing.'
);

-- Quick Learn 3: Cloud Computing Basics
INSERT INTO public.quick_learn_lessons (id, title, slug, branch, category, difficulty, estimated_minutes, is_recommended, fx_reward, short_description, content_markdown, is_published)
VALUES (
  '00000000-0000-4000-a000-000000000003',
  'Cloud Computing Basics',
  'cloud-computing-basics',
  'CSE',
  'Cloud',
  'Beginner',
  3,
  TRUE,
  10,
  'Master Cloud Computing Basics fundamentals with quick reading and 15 practice MCQs on FEEDX.',
  '### Learning Text
Cloud computing delivers computing services—including servers, storage, databases, networking, software, and analytics—over the Internet (''the cloud'') to offer faster innovation and flexible resources.

### Key Points
- **IaaS**
- **PaaS**
- **SaaS**
- **AWS**
- **Scalability**
- **Pay-as-you-go**',
  TRUE
) ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title;

INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000003000001',
  '00000000-0000-4000-a000-000000000003',
  'Q1. What is Cloud Computing?',
  'Local offline file storage on hard drives',
  'On-demand delivery of IT resources and computing power over the Internet',
  'Running programs on a floppy disk',
  'Direct physical cable networking between PCs',
  'B',
  'Option B is correct. Cloud computing delivers computing power, databases, and storage over the internet.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000003000002',
  '00000000-0000-4000-a000-000000000003',
  'Q2. What does IaaS stand for in Cloud Computing?',
  'Integrated Application System',
  'Internet as a Storage',
  'Internal Architecture as a Service',
  'Infrastructure as a Service',
  'D',
  'Option D is correct. IaaS provides fundamental compute, networking, and storage infrastructure.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000003000003',
  '00000000-0000-4000-a000-000000000003',
  'Q3. Which of the following is an example of SaaS (Software as a Service)?',
  'AWS EC2',
  'Google Workspace / Microsoft 365',
  'VirtualBox',
  'Physical Cisco Router',
  'B',
  'Option B is correct. SaaS delivers end-user applications directly over the browser.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000003000004',
  '00000000-0000-4000-a000-000000000003',
  'Q4. What is AWS EC2 used for?',
  'Storing physical hard disks',
  'Providing scalable virtual servers in the cloud',
  'Designing frontend web pages',
  'Writing SQL queries',
  'B',
  'Option B is correct. Amazon EC2 provides resizable virtual machine instances.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000003000005',
  '00000000-0000-4000-a000-000000000003',
  'Q5. What is Amazon S3 primarily used for?',
  'Scalable object storage in the cloud',
  'Running relational SQL queries',
  'Compiling C programs',
  'Managing CPU clock speeds',
  'A',
  'Option A is correct. Amazon S3 stores images, videos, backups, and static files as objects.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000003000006',
  '00000000-0000-4000-a000-000000000003',
  'Q6. What is elasticity in Cloud Computing?',
  'Running CPU at 100% capacity constantly',
  'Stretching physical server cables',
  'Encrypting database tables',
  'The ability to dynamically scale resources up or down based on demand',
  'D',
  'Option D is correct. Elasticity automatically provisions or deprovisions resources as workloads change.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000003000007',
  '00000000-0000-4000-a000-000000000003',
  'Q7. Which model offers a cloud environment exclusively used by a single organization?',
  'Community Cloud',
  'Public Cloud',
  'Hybrid Cloud',
  'Private Cloud',
  'D',
  'Option D is correct. Private cloud infrastructure is operated solely for one organization.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000003000008',
  '00000000-0000-4000-a000-000000000003',
  'Q8. What is a Hybrid Cloud?',
  'A server powered by solar energy',
  'A combination of public and private cloud environments sharing data and applications',
  'An offline local USB hub',
  'A peer-to-peer torrent network',
  'B',
  'Option B is correct. Hybrid cloud connects private infrastructure with public cloud services.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000003000009',
  '00000000-0000-4000-a000-000000000003',
  'Q9. What is Serverless Computing (e.g., AWS Lambda)?',
  'A cloud model where cloud providers automatically manage server provisioning and scaling',
  'Computing without any physical computers existing anywhere',
  'Running apps exclusively on mobile phones',
  'Using paper forms instead of databases',
  'A',
  'Option A is correct. Serverless lets developers run code without managing underlying servers.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000003000010',
  '00000000-0000-4000-a000-000000000003',
  'Q10. What is Cloud Auto-Scaling?',
  'Resizing desktop browser windows',
  'Automatically adjusting server capacity based on real-time traffic',
  'Scaling image file dimensions',
  'Increasing monitor brightness',
  'B',
  'Option B is correct. Auto-scaling ensures sufficient instances run during traffic spikes and saves costs during lulls.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000003000011',
  '00000000-0000-4000-a000-000000000003',
  'Q11. What does PaaS stand for?',
  'Public Access Service',
  'Protocol as a Storage',
  'Private Application Server',
  'Platform as a Service',
  'D',
  'Option D is correct. PaaS provides runtime environments, OS, and deployment tools for developers (e.g. Heroku, AWS Elastic Beanstalk).'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000003000012',
  '00000000-0000-4000-a000-000000000003',
  'Q12. What is a Region in major cloud providers like AWS or Azure?',
  'A folder on a local hard drive',
  'A geographic location containing multiple data center Availability Zones',
  'A single microchip pin',
  'A domain name extension',
  'B',
  'Option B is correct. Regions are physical geographic locations housing clusters of data centers.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000003000013',
  '00000000-0000-4000-a000-000000000003',
  'Q13. What is an Availability Zone (AZ)?',
  'A Wi-Fi router password',
  'A website page section',
  'One or more isolated data centers within a Cloud Region equipped with independent power and networking',
  'A software download speed test',
  'C',
  'Option C is correct. AZs provide fault isolation within a region to ensure high availability.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000003000014',
  '00000000-0000-4000-a000-000000000003',
  'Q14. What cloud pricing model is most common?',
  'Pay-as-you-go based on actual resource consumption',
  'Fixed upfront lifetime fee',
  'Free unlimited hardware forever',
  'Per-keyboard keypress billing',
  'A',
  'Option A is correct. Pay-as-you-go bills users based on actual compute hours, memory, and bandwidth used.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000003000015',
  '00000000-0000-4000-a000-000000000003',
  'Q15. What is Cloud Load Balancing used for?',
  'Distributing incoming application traffic across multiple target servers',
  'Balancing physical weight on server racks',
  'Cleaning CPU cooling fans',
  'Deleting old log files',
  'A',
  'Option A is correct. Load balancers distribute traffic evenly to prevent individual server bottlenecks.'
);

-- Quick Learn 4: Cybersecurity Basics
INSERT INTO public.quick_learn_lessons (id, title, slug, branch, category, difficulty, estimated_minutes, is_recommended, fx_reward, short_description, content_markdown, is_published)
VALUES (
  '00000000-0000-4000-a000-000000000004',
  'Cybersecurity Basics',
  'cybersecurity-basics',
  'CSE',
  'Security',
  'Beginner',
  3,
  TRUE,
  10,
  'Master Cybersecurity Basics fundamentals with quick reading and 15 practice MCQs on FEEDX.',
  '### Learning Text
Cybersecurity is the practice of protecting systems, networks, and programs from digital attacks. Key fundamentals revolve around maintaining confidentiality, integrity, and availability (CIA triad).

### Key Points
- **CIA Triad**
- **Encryption**
- **Firewalls**
- **Phishing**
- **MFA**
- **Vulnerabilities**',
  TRUE
) ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title;

INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000004000001',
  '00000000-0000-4000-a000-000000000004',
  'Q1. What is the primary definition of Cybersecurity Basics?',
  'Bypassing standard security checks and protocols in Cybersecurity Basics.',
  'Legacy manual processing for Cybersecurity Basics.',
  'A core technology or standard designed for managing and executing Cybersecurity Basics processes.',
  'Hardcoding static binary files without backup in Cybersecurity Basics.',
  'C',
  'Option C is correct. A core technology or standard designed for managing and executing Cybersecurity Basics processes.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000004000002',
  '00000000-0000-4000-a000-000000000004',
  'Q2. Which key benefit is provided by Cybersecurity Basics?',
  'Bypassing standard security checks and protocols in Cybersecurity Basics.',
  'Legacy manual processing for Cybersecurity Basics.',
  'Improved efficiency, scalability, modularity, and operational reliability.',
  'Hardcoding static binary files without backup in Cybersecurity Basics.',
  'C',
  'Option C is correct. Improved efficiency, scalability, modularity, and operational reliability.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000004000003',
  '00000000-0000-4000-a000-000000000004',
  'Q3. What is a fundamental requirement when implementing Cybersecurity Basics?',
  'Hardcoding static binary files without backup in Cybersecurity Basics.',
  'Legacy manual processing for Cybersecurity Basics.',
  'Bypassing standard security checks and protocols in Cybersecurity Basics.',
  'Proper system configuration, security protocols, and integration standards.',
  'D',
  'Option D is correct. Proper system configuration, security protocols, and integration standards.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000004000004',
  '00000000-0000-4000-a000-000000000004',
  'Q4. How does Cybersecurity Basics handle data and execution states?',
  'Bypassing standard security checks and protocols in Cybersecurity Basics.',
  'Legacy manual processing for Cybersecurity Basics.',
  'By utilizing structured schemas, indexes, and optimized execution pipelines.',
  'Hardcoding static binary files without backup in Cybersecurity Basics.',
  'C',
  'Option C is correct. By utilizing structured schemas, indexes, and optimized execution pipelines.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000004000005',
  '00000000-0000-4000-a000-000000000004',
  'Q5. What is a recommended best practice when deploying Cybersecurity Basics?',
  'Legacy manual processing for Cybersecurity Basics.',
  'Conducting regular automated testing, logging, and monitoring checks.',
  'Bypassing standard security checks and protocols in Cybersecurity Basics.',
  'Hardcoding static binary files without backup in Cybersecurity Basics.',
  'B',
  'Option B is correct. Conducting regular automated testing, logging, and monitoring checks.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000004000006',
  '00000000-0000-4000-a000-000000000004',
  'Q6. Which layer or component plays a vital role in Cybersecurity Basics?',
  'Hardcoding static binary files without backup in Cybersecurity Basics.',
  'Legacy manual processing for Cybersecurity Basics.',
  'Bypassing standard security checks and protocols in Cybersecurity Basics.',
  'The central execution handler and protocol controller.',
  'D',
  'Option D is correct. The central execution handler and protocol controller.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000004000007',
  '00000000-0000-4000-a000-000000000004',
  'Q7. What is a common bottleneck or challenge in Cybersecurity Basics?',
  'Managing system state synchronization and resource contention under heavy load.',
  'Legacy manual processing for Cybersecurity Basics.',
  'Bypassing standard security checks and protocols in Cybersecurity Basics.',
  'Hardcoding static binary files without backup in Cybersecurity Basics.',
  'A',
  'Option A is correct. Managing system state synchronization and resource contention under heavy load.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000004000008',
  '00000000-0000-4000-a000-000000000004',
  'Q8. How is security typically enforced within Cybersecurity Basics?',
  'Bypassing standard security checks and protocols in Cybersecurity Basics.',
  'Legacy manual processing for Cybersecurity Basics.',
  'Through strong authentication, access control permissions, and data encryption.',
  'Hardcoding static binary files without backup in Cybersecurity Basics.',
  'C',
  'Option C is correct. Through strong authentication, access control permissions, and data encryption.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000004000009',
  '00000000-0000-4000-a000-000000000004',
  'Q9. Which metric is critical for measuring the performance of Cybersecurity Basics?',
  'Hardcoding static binary files without backup in Cybersecurity Basics.',
  'Legacy manual processing for Cybersecurity Basics.',
  'Bypassing standard security checks and protocols in Cybersecurity Basics.',
  'Response latency, throughput, resource utilization, and error rates.',
  'D',
  'Option D is correct. Response latency, throughput, resource utilization, and error rates.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000004000010',
  '00000000-0000-4000-a000-000000000004',
  'Q10. What is the role of versioning in Cybersecurity Basics?',
  'To support safe updates, maintain backward compatibility, and enable rollbacks.',
  'Legacy manual processing for Cybersecurity Basics.',
  'Bypassing standard security checks and protocols in Cybersecurity Basics.',
  'Hardcoding static binary files without backup in Cybersecurity Basics.',
  'A',
  'Option A is correct. To support safe updates, maintain backward compatibility, and enable rollbacks.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000004000011',
  '00000000-0000-4000-a000-000000000004',
  'Q11. In what scenario is Cybersecurity Basics most effectively applied?',
  'Hardcoding static binary files without backup in Cybersecurity Basics.',
  'Legacy manual processing for Cybersecurity Basics.',
  'Bypassing standard security checks and protocols in Cybersecurity Basics.',
  'In modern scalable enterprise systems requiring structured workflows and reliability.',
  'D',
  'Option D is correct. In modern scalable enterprise systems requiring structured workflows and reliability.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000004000012',
  '00000000-0000-4000-a000-000000000004',
  'Q12. Which tool or interface is standard for interacting with Cybersecurity Basics?',
  'Hardcoding static binary files without backup in Cybersecurity Basics.',
  'Legacy manual processing for Cybersecurity Basics.',
  'Bypassing standard security checks and protocols in Cybersecurity Basics.',
  'Dedicated command line tools, SDK APIs, and management dashboards.',
  'D',
  'Option D is correct. Dedicated command line tools, SDK APIs, and management dashboards.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000004000013',
  '00000000-0000-4000-a000-000000000004',
  'Q13. What is the initial phase when developing with Cybersecurity Basics?',
  'Bypassing standard security checks and protocols in Cybersecurity Basics.',
  'Legacy manual processing for Cybersecurity Basics.',
  'Defining requirements, setting up the development environment, and configuring dependencies.',
  'Hardcoding static binary files without backup in Cybersecurity Basics.',
  'C',
  'Option C is correct. Defining requirements, setting up the development environment, and configuring dependencies.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000004000014',
  '00000000-0000-4000-a000-000000000004',
  'Q14. Which debugging technique is recommended for Cybersecurity Basics?',
  'Legacy manual processing for Cybersecurity Basics.',
  'Inspecting log trace files, using debugger tools, and verifying stack traces.',
  'Bypassing standard security checks and protocols in Cybersecurity Basics.',
  'Hardcoding static binary files without backup in Cybersecurity Basics.',
  'B',
  'Option B is correct. Inspecting log trace files, using debugger tools, and verifying stack traces.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000004000015',
  '00000000-0000-4000-a000-000000000004',
  'Q15. What is the overall goal of mastering Cybersecurity Basics?',
  'Hardcoding static binary files without backup in Cybersecurity Basics.',
  'Legacy manual processing for Cybersecurity Basics.',
  'Bypassing standard security checks and protocols in Cybersecurity Basics.',
  'To design, build, and maintain production-ready technology solutions.',
  'D',
  'Option D is correct. To design, build, and maintain production-ready technology solutions.'
);

-- Quick Learn 5: Linux Basics
INSERT INTO public.quick_learn_lessons (id, title, slug, branch, category, difficulty, estimated_minutes, is_recommended, fx_reward, short_description, content_markdown, is_published)
VALUES (
  '00000000-0000-4000-a000-000000000005',
  'Linux Basics',
  'linux-basics',
  'CSE',
  'OS',
  'Beginner',
  3,
  TRUE,
  10,
  'Master Linux Basics fundamentals with quick reading and 15 practice MCQs on FEEDX.',
  '### Learning Text
Linux is an open-source, Unix-like operating system kernel that powers servers, supercomputers, and mobile devices. It provides a robust command-line environment for file management and permissions.

### Key Points
- **Kernel**
- **Terminal**
- **Permissions**
- **bash**
- **root**
- **CLI Commands**',
  TRUE
) ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title;

INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000005000001',
  '00000000-0000-4000-a000-000000000005',
  'Q1. What is the primary definition of Linux Basics?',
  'Legacy manual processing for Linux Basics.',
  'A core technology or standard designed for managing and executing Linux Basics processes.',
  'Bypassing standard security checks and protocols in Linux Basics.',
  'Hardcoding static binary files without backup in Linux Basics.',
  'B',
  'Option B is correct. A core technology or standard designed for managing and executing Linux Basics processes.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000005000002',
  '00000000-0000-4000-a000-000000000005',
  'Q2. Which key benefit is provided by Linux Basics?',
  'Hardcoding static binary files without backup in Linux Basics.',
  'Legacy manual processing for Linux Basics.',
  'Bypassing standard security checks and protocols in Linux Basics.',
  'Improved efficiency, scalability, modularity, and operational reliability.',
  'D',
  'Option D is correct. Improved efficiency, scalability, modularity, and operational reliability.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000005000003',
  '00000000-0000-4000-a000-000000000005',
  'Q3. What is a fundamental requirement when implementing Linux Basics?',
  'Hardcoding static binary files without backup in Linux Basics.',
  'Legacy manual processing for Linux Basics.',
  'Bypassing standard security checks and protocols in Linux Basics.',
  'Proper system configuration, security protocols, and integration standards.',
  'D',
  'Option D is correct. Proper system configuration, security protocols, and integration standards.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000005000004',
  '00000000-0000-4000-a000-000000000005',
  'Q4. How does Linux Basics handle data and execution states?',
  'Bypassing standard security checks and protocols in Linux Basics.',
  'Legacy manual processing for Linux Basics.',
  'By utilizing structured schemas, indexes, and optimized execution pipelines.',
  'Hardcoding static binary files without backup in Linux Basics.',
  'C',
  'Option C is correct. By utilizing structured schemas, indexes, and optimized execution pipelines.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000005000005',
  '00000000-0000-4000-a000-000000000005',
  'Q5. What is a recommended best practice when deploying Linux Basics?',
  'Bypassing standard security checks and protocols in Linux Basics.',
  'Legacy manual processing for Linux Basics.',
  'Conducting regular automated testing, logging, and monitoring checks.',
  'Hardcoding static binary files without backup in Linux Basics.',
  'C',
  'Option C is correct. Conducting regular automated testing, logging, and monitoring checks.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000005000006',
  '00000000-0000-4000-a000-000000000005',
  'Q6. Which layer or component plays a vital role in Linux Basics?',
  'Legacy manual processing for Linux Basics.',
  'The central execution handler and protocol controller.',
  'Bypassing standard security checks and protocols in Linux Basics.',
  'Hardcoding static binary files without backup in Linux Basics.',
  'B',
  'Option B is correct. The central execution handler and protocol controller.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000005000007',
  '00000000-0000-4000-a000-000000000005',
  'Q7. What is a common bottleneck or challenge in Linux Basics?',
  'Bypassing standard security checks and protocols in Linux Basics.',
  'Legacy manual processing for Linux Basics.',
  'Managing system state synchronization and resource contention under heavy load.',
  'Hardcoding static binary files without backup in Linux Basics.',
  'C',
  'Option C is correct. Managing system state synchronization and resource contention under heavy load.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000005000008',
  '00000000-0000-4000-a000-000000000005',
  'Q8. How is security typically enforced within Linux Basics?',
  'Legacy manual processing for Linux Basics.',
  'Through strong authentication, access control permissions, and data encryption.',
  'Bypassing standard security checks and protocols in Linux Basics.',
  'Hardcoding static binary files without backup in Linux Basics.',
  'B',
  'Option B is correct. Through strong authentication, access control permissions, and data encryption.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000005000009',
  '00000000-0000-4000-a000-000000000005',
  'Q9. Which metric is critical for measuring the performance of Linux Basics?',
  'Legacy manual processing for Linux Basics.',
  'Response latency, throughput, resource utilization, and error rates.',
  'Bypassing standard security checks and protocols in Linux Basics.',
  'Hardcoding static binary files without backup in Linux Basics.',
  'B',
  'Option B is correct. Response latency, throughput, resource utilization, and error rates.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000005000010',
  '00000000-0000-4000-a000-000000000005',
  'Q10. What is the role of versioning in Linux Basics?',
  'Bypassing standard security checks and protocols in Linux Basics.',
  'Legacy manual processing for Linux Basics.',
  'To support safe updates, maintain backward compatibility, and enable rollbacks.',
  'Hardcoding static binary files without backup in Linux Basics.',
  'C',
  'Option C is correct. To support safe updates, maintain backward compatibility, and enable rollbacks.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000005000011',
  '00000000-0000-4000-a000-000000000005',
  'Q11. In what scenario is Linux Basics most effectively applied?',
  'Legacy manual processing for Linux Basics.',
  'In modern scalable enterprise systems requiring structured workflows and reliability.',
  'Bypassing standard security checks and protocols in Linux Basics.',
  'Hardcoding static binary files without backup in Linux Basics.',
  'B',
  'Option B is correct. In modern scalable enterprise systems requiring structured workflows and reliability.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000005000012',
  '00000000-0000-4000-a000-000000000005',
  'Q12. Which tool or interface is standard for interacting with Linux Basics?',
  'Bypassing standard security checks and protocols in Linux Basics.',
  'Legacy manual processing for Linux Basics.',
  'Dedicated command line tools, SDK APIs, and management dashboards.',
  'Hardcoding static binary files without backup in Linux Basics.',
  'C',
  'Option C is correct. Dedicated command line tools, SDK APIs, and management dashboards.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000005000013',
  '00000000-0000-4000-a000-000000000005',
  'Q13. What is the initial phase when developing with Linux Basics?',
  'Bypassing standard security checks and protocols in Linux Basics.',
  'Legacy manual processing for Linux Basics.',
  'Defining requirements, setting up the development environment, and configuring dependencies.',
  'Hardcoding static binary files without backup in Linux Basics.',
  'C',
  'Option C is correct. Defining requirements, setting up the development environment, and configuring dependencies.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000005000014',
  '00000000-0000-4000-a000-000000000005',
  'Q14. Which debugging technique is recommended for Linux Basics?',
  'Legacy manual processing for Linux Basics.',
  'Inspecting log trace files, using debugger tools, and verifying stack traces.',
  'Bypassing standard security checks and protocols in Linux Basics.',
  'Hardcoding static binary files without backup in Linux Basics.',
  'B',
  'Option B is correct. Inspecting log trace files, using debugger tools, and verifying stack traces.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000005000015',
  '00000000-0000-4000-a000-000000000005',
  'Q15. What is the overall goal of mastering Linux Basics?',
  'Legacy manual processing for Linux Basics.',
  'To design, build, and maintain production-ready technology solutions.',
  'Bypassing standard security checks and protocols in Linux Basics.',
  'Hardcoding static binary files without backup in Linux Basics.',
  'B',
  'Option B is correct. To design, build, and maintain production-ready technology solutions.'
);

-- Quick Learn 6: Operating Systems Concepts
INSERT INTO public.quick_learn_lessons (id, title, slug, branch, category, difficulty, estimated_minutes, is_recommended, fx_reward, short_description, content_markdown, is_published)
VALUES (
  '00000000-0000-4000-a000-000000000006',
  'Operating Systems Concepts',
  'operating-systems-concepts',
  'CSE',
  'OS',
  'Intermediate',
  3,
  TRUE,
  10,
  'Master Operating Systems Concepts fundamentals with quick reading and 15 practice MCQs on FEEDX.',
  '### Learning Text
Operating Systems Concepts is an essential concept in modern technology and engineering education. Understanding its core components enables effective problem-solving and application development.

### Key Points
- **Core Concepts**: Fundamentals of Operating Systems Concepts.
- **Best Practices**: Implementation standards.
- **Workflow**: Practical application and deployment.',
  TRUE
) ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title;

INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000006000001',
  '00000000-0000-4000-a000-000000000006',
  'Q1. What is the primary definition of Operating Systems Concepts?',
  'Bypassing standard security checks and protocols in Operating Systems Concepts.',
  'Legacy manual processing for Operating Systems Concepts.',
  'A core technology or standard designed for managing and executing Operating Systems Concepts processes.',
  'Hardcoding static binary files without backup in Operating Systems Concepts.',
  'C',
  'Option C is correct. A core technology or standard designed for managing and executing Operating Systems Concepts processes.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000006000002',
  '00000000-0000-4000-a000-000000000006',
  'Q2. Which key benefit is provided by Operating Systems Concepts?',
  'Legacy manual processing for Operating Systems Concepts.',
  'Improved efficiency, scalability, modularity, and operational reliability.',
  'Bypassing standard security checks and protocols in Operating Systems Concepts.',
  'Hardcoding static binary files without backup in Operating Systems Concepts.',
  'B',
  'Option B is correct. Improved efficiency, scalability, modularity, and operational reliability.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000006000003',
  '00000000-0000-4000-a000-000000000006',
  'Q3. What is a fundamental requirement when implementing Operating Systems Concepts?',
  'Bypassing standard security checks and protocols in Operating Systems Concepts.',
  'Legacy manual processing for Operating Systems Concepts.',
  'Proper system configuration, security protocols, and integration standards.',
  'Hardcoding static binary files without backup in Operating Systems Concepts.',
  'C',
  'Option C is correct. Proper system configuration, security protocols, and integration standards.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000006000004',
  '00000000-0000-4000-a000-000000000006',
  'Q4. How does Operating Systems Concepts handle data and execution states?',
  'By utilizing structured schemas, indexes, and optimized execution pipelines.',
  'Legacy manual processing for Operating Systems Concepts.',
  'Bypassing standard security checks and protocols in Operating Systems Concepts.',
  'Hardcoding static binary files without backup in Operating Systems Concepts.',
  'A',
  'Option A is correct. By utilizing structured schemas, indexes, and optimized execution pipelines.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000006000005',
  '00000000-0000-4000-a000-000000000006',
  'Q5. What is a recommended best practice when deploying Operating Systems Concepts?',
  'Legacy manual processing for Operating Systems Concepts.',
  'Conducting regular automated testing, logging, and monitoring checks.',
  'Bypassing standard security checks and protocols in Operating Systems Concepts.',
  'Hardcoding static binary files without backup in Operating Systems Concepts.',
  'B',
  'Option B is correct. Conducting regular automated testing, logging, and monitoring checks.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000006000006',
  '00000000-0000-4000-a000-000000000006',
  'Q6. Which layer or component plays a vital role in Operating Systems Concepts?',
  'The central execution handler and protocol controller.',
  'Legacy manual processing for Operating Systems Concepts.',
  'Bypassing standard security checks and protocols in Operating Systems Concepts.',
  'Hardcoding static binary files without backup in Operating Systems Concepts.',
  'A',
  'Option A is correct. The central execution handler and protocol controller.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000006000007',
  '00000000-0000-4000-a000-000000000006',
  'Q7. What is a common bottleneck or challenge in Operating Systems Concepts?',
  'Bypassing standard security checks and protocols in Operating Systems Concepts.',
  'Legacy manual processing for Operating Systems Concepts.',
  'Managing system state synchronization and resource contention under heavy load.',
  'Hardcoding static binary files without backup in Operating Systems Concepts.',
  'C',
  'Option C is correct. Managing system state synchronization and resource contention under heavy load.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000006000008',
  '00000000-0000-4000-a000-000000000006',
  'Q8. How is security typically enforced within Operating Systems Concepts?',
  'Bypassing standard security checks and protocols in Operating Systems Concepts.',
  'Legacy manual processing for Operating Systems Concepts.',
  'Through strong authentication, access control permissions, and data encryption.',
  'Hardcoding static binary files without backup in Operating Systems Concepts.',
  'C',
  'Option C is correct. Through strong authentication, access control permissions, and data encryption.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000006000009',
  '00000000-0000-4000-a000-000000000006',
  'Q9. Which metric is critical for measuring the performance of Operating Systems Concepts?',
  'Hardcoding static binary files without backup in Operating Systems Concepts.',
  'Legacy manual processing for Operating Systems Concepts.',
  'Bypassing standard security checks and protocols in Operating Systems Concepts.',
  'Response latency, throughput, resource utilization, and error rates.',
  'D',
  'Option D is correct. Response latency, throughput, resource utilization, and error rates.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000006000010',
  '00000000-0000-4000-a000-000000000006',
  'Q10. What is the role of versioning in Operating Systems Concepts?',
  'Hardcoding static binary files without backup in Operating Systems Concepts.',
  'Legacy manual processing for Operating Systems Concepts.',
  'Bypassing standard security checks and protocols in Operating Systems Concepts.',
  'To support safe updates, maintain backward compatibility, and enable rollbacks.',
  'D',
  'Option D is correct. To support safe updates, maintain backward compatibility, and enable rollbacks.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000006000011',
  '00000000-0000-4000-a000-000000000006',
  'Q11. In what scenario is Operating Systems Concepts most effectively applied?',
  'Hardcoding static binary files without backup in Operating Systems Concepts.',
  'Legacy manual processing for Operating Systems Concepts.',
  'Bypassing standard security checks and protocols in Operating Systems Concepts.',
  'In modern scalable enterprise systems requiring structured workflows and reliability.',
  'D',
  'Option D is correct. In modern scalable enterprise systems requiring structured workflows and reliability.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000006000012',
  '00000000-0000-4000-a000-000000000006',
  'Q12. Which tool or interface is standard for interacting with Operating Systems Concepts?',
  'Bypassing standard security checks and protocols in Operating Systems Concepts.',
  'Legacy manual processing for Operating Systems Concepts.',
  'Dedicated command line tools, SDK APIs, and management dashboards.',
  'Hardcoding static binary files without backup in Operating Systems Concepts.',
  'C',
  'Option C is correct. Dedicated command line tools, SDK APIs, and management dashboards.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000006000013',
  '00000000-0000-4000-a000-000000000006',
  'Q13. What is the initial phase when developing with Operating Systems Concepts?',
  'Hardcoding static binary files without backup in Operating Systems Concepts.',
  'Legacy manual processing for Operating Systems Concepts.',
  'Bypassing standard security checks and protocols in Operating Systems Concepts.',
  'Defining requirements, setting up the development environment, and configuring dependencies.',
  'D',
  'Option D is correct. Defining requirements, setting up the development environment, and configuring dependencies.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000006000014',
  '00000000-0000-4000-a000-000000000006',
  'Q14. Which debugging technique is recommended for Operating Systems Concepts?',
  'Hardcoding static binary files without backup in Operating Systems Concepts.',
  'Legacy manual processing for Operating Systems Concepts.',
  'Bypassing standard security checks and protocols in Operating Systems Concepts.',
  'Inspecting log trace files, using debugger tools, and verifying stack traces.',
  'D',
  'Option D is correct. Inspecting log trace files, using debugger tools, and verifying stack traces.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000006000015',
  '00000000-0000-4000-a000-000000000006',
  'Q15. What is the overall goal of mastering Operating Systems Concepts?',
  'Bypassing standard security checks and protocols in Operating Systems Concepts.',
  'Legacy manual processing for Operating Systems Concepts.',
  'To design, build, and maintain production-ready technology solutions.',
  'Hardcoding static binary files without backup in Operating Systems Concepts.',
  'C',
  'Option C is correct. To design, build, and maintain production-ready technology solutions.'
);

-- Quick Learn 7: Computer Networks
INSERT INTO public.quick_learn_lessons (id, title, slug, branch, category, difficulty, estimated_minutes, is_recommended, fx_reward, short_description, content_markdown, is_published)
VALUES (
  '00000000-0000-4000-a000-000000000007',
  'Computer Networks',
  'computer-networks',
  'CSE',
  'Networking',
  'Intermediate',
  3,
  TRUE,
  10,
  'Master Computer Networks fundamentals with quick reading and 15 practice MCQs on FEEDX.',
  '### Learning Text
Computer Networks is an essential concept in modern technology and engineering education. Understanding its core components enables effective problem-solving and application development.

### Key Points
- **Core Concepts**: Fundamentals of Computer Networks.
- **Best Practices**: Implementation standards.
- **Workflow**: Practical application and deployment.',
  TRUE
) ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title;

INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000007000001',
  '00000000-0000-4000-a000-000000000007',
  'Q1. What is the primary definition of Computer Networks?',
  'Bypassing standard security checks and protocols in Computer Networks.',
  'Legacy manual processing for Computer Networks.',
  'A core technology or standard designed for managing and executing Computer Networks processes.',
  'Hardcoding static binary files without backup in Computer Networks.',
  'C',
  'Option C is correct. A core technology or standard designed for managing and executing Computer Networks processes.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000007000002',
  '00000000-0000-4000-a000-000000000007',
  'Q2. Which key benefit is provided by Computer Networks?',
  'Improved efficiency, scalability, modularity, and operational reliability.',
  'Legacy manual processing for Computer Networks.',
  'Bypassing standard security checks and protocols in Computer Networks.',
  'Hardcoding static binary files without backup in Computer Networks.',
  'A',
  'Option A is correct. Improved efficiency, scalability, modularity, and operational reliability.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000007000003',
  '00000000-0000-4000-a000-000000000007',
  'Q3. What is a fundamental requirement when implementing Computer Networks?',
  'Hardcoding static binary files without backup in Computer Networks.',
  'Legacy manual processing for Computer Networks.',
  'Bypassing standard security checks and protocols in Computer Networks.',
  'Proper system configuration, security protocols, and integration standards.',
  'D',
  'Option D is correct. Proper system configuration, security protocols, and integration standards.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000007000004',
  '00000000-0000-4000-a000-000000000007',
  'Q4. How does Computer Networks handle data and execution states?',
  'Hardcoding static binary files without backup in Computer Networks.',
  'Legacy manual processing for Computer Networks.',
  'Bypassing standard security checks and protocols in Computer Networks.',
  'By utilizing structured schemas, indexes, and optimized execution pipelines.',
  'D',
  'Option D is correct. By utilizing structured schemas, indexes, and optimized execution pipelines.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000007000005',
  '00000000-0000-4000-a000-000000000007',
  'Q5. What is a recommended best practice when deploying Computer Networks?',
  'Legacy manual processing for Computer Networks.',
  'Conducting regular automated testing, logging, and monitoring checks.',
  'Bypassing standard security checks and protocols in Computer Networks.',
  'Hardcoding static binary files without backup in Computer Networks.',
  'B',
  'Option B is correct. Conducting regular automated testing, logging, and monitoring checks.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000007000006',
  '00000000-0000-4000-a000-000000000007',
  'Q6. Which layer or component plays a vital role in Computer Networks?',
  'The central execution handler and protocol controller.',
  'Legacy manual processing for Computer Networks.',
  'Bypassing standard security checks and protocols in Computer Networks.',
  'Hardcoding static binary files without backup in Computer Networks.',
  'A',
  'Option A is correct. The central execution handler and protocol controller.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000007000007',
  '00000000-0000-4000-a000-000000000007',
  'Q7. What is a common bottleneck or challenge in Computer Networks?',
  'Hardcoding static binary files without backup in Computer Networks.',
  'Legacy manual processing for Computer Networks.',
  'Bypassing standard security checks and protocols in Computer Networks.',
  'Managing system state synchronization and resource contention under heavy load.',
  'D',
  'Option D is correct. Managing system state synchronization and resource contention under heavy load.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000007000008',
  '00000000-0000-4000-a000-000000000007',
  'Q8. How is security typically enforced within Computer Networks?',
  'Hardcoding static binary files without backup in Computer Networks.',
  'Legacy manual processing for Computer Networks.',
  'Bypassing standard security checks and protocols in Computer Networks.',
  'Through strong authentication, access control permissions, and data encryption.',
  'D',
  'Option D is correct. Through strong authentication, access control permissions, and data encryption.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000007000009',
  '00000000-0000-4000-a000-000000000007',
  'Q9. Which metric is critical for measuring the performance of Computer Networks?',
  'Bypassing standard security checks and protocols in Computer Networks.',
  'Legacy manual processing for Computer Networks.',
  'Response latency, throughput, resource utilization, and error rates.',
  'Hardcoding static binary files without backup in Computer Networks.',
  'C',
  'Option C is correct. Response latency, throughput, resource utilization, and error rates.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000007000010',
  '00000000-0000-4000-a000-000000000007',
  'Q10. What is the role of versioning in Computer Networks?',
  'To support safe updates, maintain backward compatibility, and enable rollbacks.',
  'Legacy manual processing for Computer Networks.',
  'Bypassing standard security checks and protocols in Computer Networks.',
  'Hardcoding static binary files without backup in Computer Networks.',
  'A',
  'Option A is correct. To support safe updates, maintain backward compatibility, and enable rollbacks.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000007000011',
  '00000000-0000-4000-a000-000000000007',
  'Q11. In what scenario is Computer Networks most effectively applied?',
  'Bypassing standard security checks and protocols in Computer Networks.',
  'Legacy manual processing for Computer Networks.',
  'In modern scalable enterprise systems requiring structured workflows and reliability.',
  'Hardcoding static binary files without backup in Computer Networks.',
  'C',
  'Option C is correct. In modern scalable enterprise systems requiring structured workflows and reliability.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000007000012',
  '00000000-0000-4000-a000-000000000007',
  'Q12. Which tool or interface is standard for interacting with Computer Networks?',
  'Bypassing standard security checks and protocols in Computer Networks.',
  'Legacy manual processing for Computer Networks.',
  'Dedicated command line tools, SDK APIs, and management dashboards.',
  'Hardcoding static binary files without backup in Computer Networks.',
  'C',
  'Option C is correct. Dedicated command line tools, SDK APIs, and management dashboards.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000007000013',
  '00000000-0000-4000-a000-000000000007',
  'Q13. What is the initial phase when developing with Computer Networks?',
  'Defining requirements, setting up the development environment, and configuring dependencies.',
  'Legacy manual processing for Computer Networks.',
  'Bypassing standard security checks and protocols in Computer Networks.',
  'Hardcoding static binary files without backup in Computer Networks.',
  'A',
  'Option A is correct. Defining requirements, setting up the development environment, and configuring dependencies.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000007000014',
  '00000000-0000-4000-a000-000000000007',
  'Q14. Which debugging technique is recommended for Computer Networks?',
  'Bypassing standard security checks and protocols in Computer Networks.',
  'Legacy manual processing for Computer Networks.',
  'Inspecting log trace files, using debugger tools, and verifying stack traces.',
  'Hardcoding static binary files without backup in Computer Networks.',
  'C',
  'Option C is correct. Inspecting log trace files, using debugger tools, and verifying stack traces.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000007000015',
  '00000000-0000-4000-a000-000000000007',
  'Q15. What is the overall goal of mastering Computer Networks?',
  'Legacy manual processing for Computer Networks.',
  'To design, build, and maintain production-ready technology solutions.',
  'Bypassing standard security checks and protocols in Computer Networks.',
  'Hardcoding static binary files without backup in Computer Networks.',
  'B',
  'Option B is correct. To design, build, and maintain production-ready technology solutions.'
);

-- Quick Learn 8: Internet & Web Technology
INSERT INTO public.quick_learn_lessons (id, title, slug, branch, category, difficulty, estimated_minutes, is_recommended, fx_reward, short_description, content_markdown, is_published)
VALUES (
  '00000000-0000-4000-a000-000000000008',
  'Internet & Web Technology',
  'internet-web-technology',
  'CSE',
  'Web Dev',
  'Beginner',
  3,
  TRUE,
  10,
  'Master Internet & Web Technology fundamentals with quick reading and 15 practice MCQs on FEEDX.',
  '### Learning Text
Internet & Web Technology is an essential concept in modern technology and engineering education. Understanding its core components enables effective problem-solving and application development.

### Key Points
- **Core Concepts**: Fundamentals of Internet & Web Technology.
- **Best Practices**: Implementation standards.
- **Workflow**: Practical application and deployment.',
  TRUE
) ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title;

INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000008000001',
  '00000000-0000-4000-a000-000000000008',
  'Q1. What is the primary definition of Internet & Web Technology?',
  'Legacy manual processing for Internet & Web Technology.',
  'A core technology or standard designed for managing and executing Internet & Web Technology processes.',
  'Bypassing standard security checks and protocols in Internet & Web Technology.',
  'Hardcoding static binary files without backup in Internet & Web Technology.',
  'B',
  'Option B is correct. A core technology or standard designed for managing and executing Internet & Web Technology processes.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000008000002',
  '00000000-0000-4000-a000-000000000008',
  'Q2. Which key benefit is provided by Internet & Web Technology?',
  'Improved efficiency, scalability, modularity, and operational reliability.',
  'Legacy manual processing for Internet & Web Technology.',
  'Bypassing standard security checks and protocols in Internet & Web Technology.',
  'Hardcoding static binary files without backup in Internet & Web Technology.',
  'A',
  'Option A is correct. Improved efficiency, scalability, modularity, and operational reliability.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000008000003',
  '00000000-0000-4000-a000-000000000008',
  'Q3. What is a fundamental requirement when implementing Internet & Web Technology?',
  'Bypassing standard security checks and protocols in Internet & Web Technology.',
  'Legacy manual processing for Internet & Web Technology.',
  'Proper system configuration, security protocols, and integration standards.',
  'Hardcoding static binary files without backup in Internet & Web Technology.',
  'C',
  'Option C is correct. Proper system configuration, security protocols, and integration standards.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000008000004',
  '00000000-0000-4000-a000-000000000008',
  'Q4. How does Internet & Web Technology handle data and execution states?',
  'By utilizing structured schemas, indexes, and optimized execution pipelines.',
  'Legacy manual processing for Internet & Web Technology.',
  'Bypassing standard security checks and protocols in Internet & Web Technology.',
  'Hardcoding static binary files without backup in Internet & Web Technology.',
  'A',
  'Option A is correct. By utilizing structured schemas, indexes, and optimized execution pipelines.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000008000005',
  '00000000-0000-4000-a000-000000000008',
  'Q5. What is a recommended best practice when deploying Internet & Web Technology?',
  'Legacy manual processing for Internet & Web Technology.',
  'Conducting regular automated testing, logging, and monitoring checks.',
  'Bypassing standard security checks and protocols in Internet & Web Technology.',
  'Hardcoding static binary files without backup in Internet & Web Technology.',
  'B',
  'Option B is correct. Conducting regular automated testing, logging, and monitoring checks.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000008000006',
  '00000000-0000-4000-a000-000000000008',
  'Q6. Which layer or component plays a vital role in Internet & Web Technology?',
  'Legacy manual processing for Internet & Web Technology.',
  'The central execution handler and protocol controller.',
  'Bypassing standard security checks and protocols in Internet & Web Technology.',
  'Hardcoding static binary files without backup in Internet & Web Technology.',
  'B',
  'Option B is correct. The central execution handler and protocol controller.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000008000007',
  '00000000-0000-4000-a000-000000000008',
  'Q7. What is a common bottleneck or challenge in Internet & Web Technology?',
  'Managing system state synchronization and resource contention under heavy load.',
  'Legacy manual processing for Internet & Web Technology.',
  'Bypassing standard security checks and protocols in Internet & Web Technology.',
  'Hardcoding static binary files without backup in Internet & Web Technology.',
  'A',
  'Option A is correct. Managing system state synchronization and resource contention under heavy load.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000008000008',
  '00000000-0000-4000-a000-000000000008',
  'Q8. How is security typically enforced within Internet & Web Technology?',
  'Hardcoding static binary files without backup in Internet & Web Technology.',
  'Legacy manual processing for Internet & Web Technology.',
  'Bypassing standard security checks and protocols in Internet & Web Technology.',
  'Through strong authentication, access control permissions, and data encryption.',
  'D',
  'Option D is correct. Through strong authentication, access control permissions, and data encryption.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000008000009',
  '00000000-0000-4000-a000-000000000008',
  'Q9. Which metric is critical for measuring the performance of Internet & Web Technology?',
  'Hardcoding static binary files without backup in Internet & Web Technology.',
  'Legacy manual processing for Internet & Web Technology.',
  'Bypassing standard security checks and protocols in Internet & Web Technology.',
  'Response latency, throughput, resource utilization, and error rates.',
  'D',
  'Option D is correct. Response latency, throughput, resource utilization, and error rates.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000008000010',
  '00000000-0000-4000-a000-000000000008',
  'Q10. What is the role of versioning in Internet & Web Technology?',
  'Hardcoding static binary files without backup in Internet & Web Technology.',
  'Legacy manual processing for Internet & Web Technology.',
  'Bypassing standard security checks and protocols in Internet & Web Technology.',
  'To support safe updates, maintain backward compatibility, and enable rollbacks.',
  'D',
  'Option D is correct. To support safe updates, maintain backward compatibility, and enable rollbacks.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000008000011',
  '00000000-0000-4000-a000-000000000008',
  'Q11. In what scenario is Internet & Web Technology most effectively applied?',
  'In modern scalable enterprise systems requiring structured workflows and reliability.',
  'Legacy manual processing for Internet & Web Technology.',
  'Bypassing standard security checks and protocols in Internet & Web Technology.',
  'Hardcoding static binary files without backup in Internet & Web Technology.',
  'A',
  'Option A is correct. In modern scalable enterprise systems requiring structured workflows and reliability.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000008000012',
  '00000000-0000-4000-a000-000000000008',
  'Q12. Which tool or interface is standard for interacting with Internet & Web Technology?',
  'Legacy manual processing for Internet & Web Technology.',
  'Dedicated command line tools, SDK APIs, and management dashboards.',
  'Bypassing standard security checks and protocols in Internet & Web Technology.',
  'Hardcoding static binary files without backup in Internet & Web Technology.',
  'B',
  'Option B is correct. Dedicated command line tools, SDK APIs, and management dashboards.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000008000013',
  '00000000-0000-4000-a000-000000000008',
  'Q13. What is the initial phase when developing with Internet & Web Technology?',
  'Hardcoding static binary files without backup in Internet & Web Technology.',
  'Legacy manual processing for Internet & Web Technology.',
  'Bypassing standard security checks and protocols in Internet & Web Technology.',
  'Defining requirements, setting up the development environment, and configuring dependencies.',
  'D',
  'Option D is correct. Defining requirements, setting up the development environment, and configuring dependencies.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000008000014',
  '00000000-0000-4000-a000-000000000008',
  'Q14. Which debugging technique is recommended for Internet & Web Technology?',
  'Inspecting log trace files, using debugger tools, and verifying stack traces.',
  'Legacy manual processing for Internet & Web Technology.',
  'Bypassing standard security checks and protocols in Internet & Web Technology.',
  'Hardcoding static binary files without backup in Internet & Web Technology.',
  'A',
  'Option A is correct. Inspecting log trace files, using debugger tools, and verifying stack traces.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000008000015',
  '00000000-0000-4000-a000-000000000008',
  'Q15. What is the overall goal of mastering Internet & Web Technology?',
  'Legacy manual processing for Internet & Web Technology.',
  'To design, build, and maintain production-ready technology solutions.',
  'Bypassing standard security checks and protocols in Internet & Web Technology.',
  'Hardcoding static binary files without backup in Internet & Web Technology.',
  'B',
  'Option B is correct. To design, build, and maintain production-ready technology solutions.'
);

-- Quick Learn 9: HTML & CSS Essentials
INSERT INTO public.quick_learn_lessons (id, title, slug, branch, category, difficulty, estimated_minutes, is_recommended, fx_reward, short_description, content_markdown, is_published)
VALUES (
  '00000000-0000-4000-a000-000000000009',
  'HTML & CSS Essentials',
  'html-css-essentials',
  'CSE',
  'Web Dev',
  'Beginner',
  3,
  TRUE,
  10,
  'Master HTML & CSS Essentials fundamentals with quick reading and 15 practice MCQs on FEEDX.',
  '### Learning Text
HTML & CSS Essentials is an essential concept in modern technology and engineering education. Understanding its core components enables effective problem-solving and application development.

### Key Points
- **Core Concepts**: Fundamentals of HTML & CSS Essentials.
- **Best Practices**: Implementation standards.
- **Workflow**: Practical application and deployment.',
  TRUE
) ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title;

INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000009000001',
  '00000000-0000-4000-a000-000000000009',
  'Q1. What is the primary definition of HTML & CSS Essentials?',
  'A core technology or standard designed for managing and executing HTML & CSS Essentials processes.',
  'Legacy manual processing for HTML & CSS Essentials.',
  'Bypassing standard security checks and protocols in HTML & CSS Essentials.',
  'Hardcoding static binary files without backup in HTML & CSS Essentials.',
  'A',
  'Option A is correct. A core technology or standard designed for managing and executing HTML & CSS Essentials processes.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000009000002',
  '00000000-0000-4000-a000-000000000009',
  'Q2. Which key benefit is provided by HTML & CSS Essentials?',
  'Legacy manual processing for HTML & CSS Essentials.',
  'Improved efficiency, scalability, modularity, and operational reliability.',
  'Bypassing standard security checks and protocols in HTML & CSS Essentials.',
  'Hardcoding static binary files without backup in HTML & CSS Essentials.',
  'B',
  'Option B is correct. Improved efficiency, scalability, modularity, and operational reliability.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000009000003',
  '00000000-0000-4000-a000-000000000009',
  'Q3. What is a fundamental requirement when implementing HTML & CSS Essentials?',
  'Legacy manual processing for HTML & CSS Essentials.',
  'Proper system configuration, security protocols, and integration standards.',
  'Bypassing standard security checks and protocols in HTML & CSS Essentials.',
  'Hardcoding static binary files without backup in HTML & CSS Essentials.',
  'B',
  'Option B is correct. Proper system configuration, security protocols, and integration standards.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000009000004',
  '00000000-0000-4000-a000-000000000009',
  'Q4. How does HTML & CSS Essentials handle data and execution states?',
  'By utilizing structured schemas, indexes, and optimized execution pipelines.',
  'Legacy manual processing for HTML & CSS Essentials.',
  'Bypassing standard security checks and protocols in HTML & CSS Essentials.',
  'Hardcoding static binary files without backup in HTML & CSS Essentials.',
  'A',
  'Option A is correct. By utilizing structured schemas, indexes, and optimized execution pipelines.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000009000005',
  '00000000-0000-4000-a000-000000000009',
  'Q5. What is a recommended best practice when deploying HTML & CSS Essentials?',
  'Hardcoding static binary files without backup in HTML & CSS Essentials.',
  'Legacy manual processing for HTML & CSS Essentials.',
  'Bypassing standard security checks and protocols in HTML & CSS Essentials.',
  'Conducting regular automated testing, logging, and monitoring checks.',
  'D',
  'Option D is correct. Conducting regular automated testing, logging, and monitoring checks.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000009000006',
  '00000000-0000-4000-a000-000000000009',
  'Q6. Which layer or component plays a vital role in HTML & CSS Essentials?',
  'Legacy manual processing for HTML & CSS Essentials.',
  'The central execution handler and protocol controller.',
  'Bypassing standard security checks and protocols in HTML & CSS Essentials.',
  'Hardcoding static binary files without backup in HTML & CSS Essentials.',
  'B',
  'Option B is correct. The central execution handler and protocol controller.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000009000007',
  '00000000-0000-4000-a000-000000000009',
  'Q7. What is a common bottleneck or challenge in HTML & CSS Essentials?',
  'Managing system state synchronization and resource contention under heavy load.',
  'Legacy manual processing for HTML & CSS Essentials.',
  'Bypassing standard security checks and protocols in HTML & CSS Essentials.',
  'Hardcoding static binary files without backup in HTML & CSS Essentials.',
  'A',
  'Option A is correct. Managing system state synchronization and resource contention under heavy load.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000009000008',
  '00000000-0000-4000-a000-000000000009',
  'Q8. How is security typically enforced within HTML & CSS Essentials?',
  'Hardcoding static binary files without backup in HTML & CSS Essentials.',
  'Legacy manual processing for HTML & CSS Essentials.',
  'Bypassing standard security checks and protocols in HTML & CSS Essentials.',
  'Through strong authentication, access control permissions, and data encryption.',
  'D',
  'Option D is correct. Through strong authentication, access control permissions, and data encryption.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000009000009',
  '00000000-0000-4000-a000-000000000009',
  'Q9. Which metric is critical for measuring the performance of HTML & CSS Essentials?',
  'Response latency, throughput, resource utilization, and error rates.',
  'Legacy manual processing for HTML & CSS Essentials.',
  'Bypassing standard security checks and protocols in HTML & CSS Essentials.',
  'Hardcoding static binary files without backup in HTML & CSS Essentials.',
  'A',
  'Option A is correct. Response latency, throughput, resource utilization, and error rates.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000009000010',
  '00000000-0000-4000-a000-000000000009',
  'Q10. What is the role of versioning in HTML & CSS Essentials?',
  'Legacy manual processing for HTML & CSS Essentials.',
  'To support safe updates, maintain backward compatibility, and enable rollbacks.',
  'Bypassing standard security checks and protocols in HTML & CSS Essentials.',
  'Hardcoding static binary files without backup in HTML & CSS Essentials.',
  'B',
  'Option B is correct. To support safe updates, maintain backward compatibility, and enable rollbacks.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000009000011',
  '00000000-0000-4000-a000-000000000009',
  'Q11. In what scenario is HTML & CSS Essentials most effectively applied?',
  'In modern scalable enterprise systems requiring structured workflows and reliability.',
  'Legacy manual processing for HTML & CSS Essentials.',
  'Bypassing standard security checks and protocols in HTML & CSS Essentials.',
  'Hardcoding static binary files without backup in HTML & CSS Essentials.',
  'A',
  'Option A is correct. In modern scalable enterprise systems requiring structured workflows and reliability.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000009000012',
  '00000000-0000-4000-a000-000000000009',
  'Q12. Which tool or interface is standard for interacting with HTML & CSS Essentials?',
  'Legacy manual processing for HTML & CSS Essentials.',
  'Dedicated command line tools, SDK APIs, and management dashboards.',
  'Bypassing standard security checks and protocols in HTML & CSS Essentials.',
  'Hardcoding static binary files without backup in HTML & CSS Essentials.',
  'B',
  'Option B is correct. Dedicated command line tools, SDK APIs, and management dashboards.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000009000013',
  '00000000-0000-4000-a000-000000000009',
  'Q13. What is the initial phase when developing with HTML & CSS Essentials?',
  'Bypassing standard security checks and protocols in HTML & CSS Essentials.',
  'Legacy manual processing for HTML & CSS Essentials.',
  'Defining requirements, setting up the development environment, and configuring dependencies.',
  'Hardcoding static binary files without backup in HTML & CSS Essentials.',
  'C',
  'Option C is correct. Defining requirements, setting up the development environment, and configuring dependencies.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000009000014',
  '00000000-0000-4000-a000-000000000009',
  'Q14. Which debugging technique is recommended for HTML & CSS Essentials?',
  'Legacy manual processing for HTML & CSS Essentials.',
  'Inspecting log trace files, using debugger tools, and verifying stack traces.',
  'Bypassing standard security checks and protocols in HTML & CSS Essentials.',
  'Hardcoding static binary files without backup in HTML & CSS Essentials.',
  'B',
  'Option B is correct. Inspecting log trace files, using debugger tools, and verifying stack traces.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000009000015',
  '00000000-0000-4000-a000-000000000009',
  'Q15. What is the overall goal of mastering HTML & CSS Essentials?',
  'To design, build, and maintain production-ready technology solutions.',
  'Legacy manual processing for HTML & CSS Essentials.',
  'Bypassing standard security checks and protocols in HTML & CSS Essentials.',
  'Hardcoding static binary files without backup in HTML & CSS Essentials.',
  'A',
  'Option A is correct. To design, build, and maintain production-ready technology solutions.'
);

-- Quick Learn 10: JavaScript Fundamentals
INSERT INTO public.quick_learn_lessons (id, title, slug, branch, category, difficulty, estimated_minutes, is_recommended, fx_reward, short_description, content_markdown, is_published)
VALUES (
  '00000000-0000-4000-a000-000000000010',
  'JavaScript Fundamentals',
  'javascript-fundamentals',
  'CSE',
  'Programming',
  'Beginner',
  3,
  TRUE,
  10,
  'Master JavaScript Fundamentals fundamentals with quick reading and 15 practice MCQs on FEEDX.',
  '### Learning Text
JavaScript Fundamentals is an essential concept in modern technology and engineering education. Understanding its core components enables effective problem-solving and application development.

### Key Points
- **Core Concepts**: Fundamentals of JavaScript Fundamentals.
- **Best Practices**: Implementation standards.
- **Workflow**: Practical application and deployment.',
  TRUE
) ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title;

INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000010000001',
  '00000000-0000-4000-a000-000000000010',
  'Q1. What is the primary definition of JavaScript Fundamentals?',
  'Hardcoding static binary files without backup in JavaScript Fundamentals.',
  'Legacy manual processing for JavaScript Fundamentals.',
  'Bypassing standard security checks and protocols in JavaScript Fundamentals.',
  'A core technology or standard designed for managing and executing JavaScript Fundamentals processes.',
  'D',
  'Option D is correct. A core technology or standard designed for managing and executing JavaScript Fundamentals processes.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000010000002',
  '00000000-0000-4000-a000-000000000010',
  'Q2. Which key benefit is provided by JavaScript Fundamentals?',
  'Hardcoding static binary files without backup in JavaScript Fundamentals.',
  'Legacy manual processing for JavaScript Fundamentals.',
  'Bypassing standard security checks and protocols in JavaScript Fundamentals.',
  'Improved efficiency, scalability, modularity, and operational reliability.',
  'D',
  'Option D is correct. Improved efficiency, scalability, modularity, and operational reliability.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000010000003',
  '00000000-0000-4000-a000-000000000010',
  'Q3. What is a fundamental requirement when implementing JavaScript Fundamentals?',
  'Hardcoding static binary files without backup in JavaScript Fundamentals.',
  'Legacy manual processing for JavaScript Fundamentals.',
  'Bypassing standard security checks and protocols in JavaScript Fundamentals.',
  'Proper system configuration, security protocols, and integration standards.',
  'D',
  'Option D is correct. Proper system configuration, security protocols, and integration standards.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000010000004',
  '00000000-0000-4000-a000-000000000010',
  'Q4. How does JavaScript Fundamentals handle data and execution states?',
  'Bypassing standard security checks and protocols in JavaScript Fundamentals.',
  'Legacy manual processing for JavaScript Fundamentals.',
  'By utilizing structured schemas, indexes, and optimized execution pipelines.',
  'Hardcoding static binary files without backup in JavaScript Fundamentals.',
  'C',
  'Option C is correct. By utilizing structured schemas, indexes, and optimized execution pipelines.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000010000005',
  '00000000-0000-4000-a000-000000000010',
  'Q5. What is a recommended best practice when deploying JavaScript Fundamentals?',
  'Legacy manual processing for JavaScript Fundamentals.',
  'Conducting regular automated testing, logging, and monitoring checks.',
  'Bypassing standard security checks and protocols in JavaScript Fundamentals.',
  'Hardcoding static binary files without backup in JavaScript Fundamentals.',
  'B',
  'Option B is correct. Conducting regular automated testing, logging, and monitoring checks.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000010000006',
  '00000000-0000-4000-a000-000000000010',
  'Q6. Which layer or component plays a vital role in JavaScript Fundamentals?',
  'Legacy manual processing for JavaScript Fundamentals.',
  'The central execution handler and protocol controller.',
  'Bypassing standard security checks and protocols in JavaScript Fundamentals.',
  'Hardcoding static binary files without backup in JavaScript Fundamentals.',
  'B',
  'Option B is correct. The central execution handler and protocol controller.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000010000007',
  '00000000-0000-4000-a000-000000000010',
  'Q7. What is a common bottleneck or challenge in JavaScript Fundamentals?',
  'Bypassing standard security checks and protocols in JavaScript Fundamentals.',
  'Legacy manual processing for JavaScript Fundamentals.',
  'Managing system state synchronization and resource contention under heavy load.',
  'Hardcoding static binary files without backup in JavaScript Fundamentals.',
  'C',
  'Option C is correct. Managing system state synchronization and resource contention under heavy load.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000010000008',
  '00000000-0000-4000-a000-000000000010',
  'Q8. How is security typically enforced within JavaScript Fundamentals?',
  'Through strong authentication, access control permissions, and data encryption.',
  'Legacy manual processing for JavaScript Fundamentals.',
  'Bypassing standard security checks and protocols in JavaScript Fundamentals.',
  'Hardcoding static binary files without backup in JavaScript Fundamentals.',
  'A',
  'Option A is correct. Through strong authentication, access control permissions, and data encryption.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000010000009',
  '00000000-0000-4000-a000-000000000010',
  'Q9. Which metric is critical for measuring the performance of JavaScript Fundamentals?',
  'Response latency, throughput, resource utilization, and error rates.',
  'Legacy manual processing for JavaScript Fundamentals.',
  'Bypassing standard security checks and protocols in JavaScript Fundamentals.',
  'Hardcoding static binary files without backup in JavaScript Fundamentals.',
  'A',
  'Option A is correct. Response latency, throughput, resource utilization, and error rates.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000010000010',
  '00000000-0000-4000-a000-000000000010',
  'Q10. What is the role of versioning in JavaScript Fundamentals?',
  'To support safe updates, maintain backward compatibility, and enable rollbacks.',
  'Legacy manual processing for JavaScript Fundamentals.',
  'Bypassing standard security checks and protocols in JavaScript Fundamentals.',
  'Hardcoding static binary files without backup in JavaScript Fundamentals.',
  'A',
  'Option A is correct. To support safe updates, maintain backward compatibility, and enable rollbacks.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000010000011',
  '00000000-0000-4000-a000-000000000010',
  'Q11. In what scenario is JavaScript Fundamentals most effectively applied?',
  'Bypassing standard security checks and protocols in JavaScript Fundamentals.',
  'Legacy manual processing for JavaScript Fundamentals.',
  'In modern scalable enterprise systems requiring structured workflows and reliability.',
  'Hardcoding static binary files without backup in JavaScript Fundamentals.',
  'C',
  'Option C is correct. In modern scalable enterprise systems requiring structured workflows and reliability.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000010000012',
  '00000000-0000-4000-a000-000000000010',
  'Q12. Which tool or interface is standard for interacting with JavaScript Fundamentals?',
  'Dedicated command line tools, SDK APIs, and management dashboards.',
  'Legacy manual processing for JavaScript Fundamentals.',
  'Bypassing standard security checks and protocols in JavaScript Fundamentals.',
  'Hardcoding static binary files without backup in JavaScript Fundamentals.',
  'A',
  'Option A is correct. Dedicated command line tools, SDK APIs, and management dashboards.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000010000013',
  '00000000-0000-4000-a000-000000000010',
  'Q13. What is the initial phase when developing with JavaScript Fundamentals?',
  'Bypassing standard security checks and protocols in JavaScript Fundamentals.',
  'Legacy manual processing for JavaScript Fundamentals.',
  'Defining requirements, setting up the development environment, and configuring dependencies.',
  'Hardcoding static binary files without backup in JavaScript Fundamentals.',
  'C',
  'Option C is correct. Defining requirements, setting up the development environment, and configuring dependencies.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000010000014',
  '00000000-0000-4000-a000-000000000010',
  'Q14. Which debugging technique is recommended for JavaScript Fundamentals?',
  'Legacy manual processing for JavaScript Fundamentals.',
  'Inspecting log trace files, using debugger tools, and verifying stack traces.',
  'Bypassing standard security checks and protocols in JavaScript Fundamentals.',
  'Hardcoding static binary files without backup in JavaScript Fundamentals.',
  'B',
  'Option B is correct. Inspecting log trace files, using debugger tools, and verifying stack traces.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000010000015',
  '00000000-0000-4000-a000-000000000010',
  'Q15. What is the overall goal of mastering JavaScript Fundamentals?',
  'To design, build, and maintain production-ready technology solutions.',
  'Legacy manual processing for JavaScript Fundamentals.',
  'Bypassing standard security checks and protocols in JavaScript Fundamentals.',
  'Hardcoding static binary files without backup in JavaScript Fundamentals.',
  'A',
  'Option A is correct. To design, build, and maintain production-ready technology solutions.'
);

-- Quick Learn 11: Python Basics
INSERT INTO public.quick_learn_lessons (id, title, slug, branch, category, difficulty, estimated_minutes, is_recommended, fx_reward, short_description, content_markdown, is_published)
VALUES (
  '00000000-0000-4000-a000-000000000011',
  'Python Basics',
  'python-basics',
  'CSE',
  'Programming',
  'Beginner',
  3,
  TRUE,
  10,
  'Master Python Basics fundamentals with quick reading and 15 practice MCQs on FEEDX.',
  '### Learning Text
Python Basics is an essential concept in modern technology and engineering education. Understanding its core components enables effective problem-solving and application development.

### Key Points
- **Core Concepts**: Fundamentals of Python Basics.
- **Best Practices**: Implementation standards.
- **Workflow**: Practical application and deployment.',
  TRUE
) ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title;

INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000011000001',
  '00000000-0000-4000-a000-000000000011',
  'Q1. What is the primary definition of Python Basics?',
  'Hardcoding static binary files without backup in Python Basics.',
  'Legacy manual processing for Python Basics.',
  'Bypassing standard security checks and protocols in Python Basics.',
  'A core technology or standard designed for managing and executing Python Basics processes.',
  'D',
  'Option D is correct. A core technology or standard designed for managing and executing Python Basics processes.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000011000002',
  '00000000-0000-4000-a000-000000000011',
  'Q2. Which key benefit is provided by Python Basics?',
  'Improved efficiency, scalability, modularity, and operational reliability.',
  'Legacy manual processing for Python Basics.',
  'Bypassing standard security checks and protocols in Python Basics.',
  'Hardcoding static binary files without backup in Python Basics.',
  'A',
  'Option A is correct. Improved efficiency, scalability, modularity, and operational reliability.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000011000003',
  '00000000-0000-4000-a000-000000000011',
  'Q3. What is a fundamental requirement when implementing Python Basics?',
  'Bypassing standard security checks and protocols in Python Basics.',
  'Legacy manual processing for Python Basics.',
  'Proper system configuration, security protocols, and integration standards.',
  'Hardcoding static binary files without backup in Python Basics.',
  'C',
  'Option C is correct. Proper system configuration, security protocols, and integration standards.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000011000004',
  '00000000-0000-4000-a000-000000000011',
  'Q4. How does Python Basics handle data and execution states?',
  'By utilizing structured schemas, indexes, and optimized execution pipelines.',
  'Legacy manual processing for Python Basics.',
  'Bypassing standard security checks and protocols in Python Basics.',
  'Hardcoding static binary files without backup in Python Basics.',
  'A',
  'Option A is correct. By utilizing structured schemas, indexes, and optimized execution pipelines.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000011000005',
  '00000000-0000-4000-a000-000000000011',
  'Q5. What is a recommended best practice when deploying Python Basics?',
  'Bypassing standard security checks and protocols in Python Basics.',
  'Legacy manual processing for Python Basics.',
  'Conducting regular automated testing, logging, and monitoring checks.',
  'Hardcoding static binary files without backup in Python Basics.',
  'C',
  'Option C is correct. Conducting regular automated testing, logging, and monitoring checks.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000011000006',
  '00000000-0000-4000-a000-000000000011',
  'Q6. Which layer or component plays a vital role in Python Basics?',
  'Legacy manual processing for Python Basics.',
  'The central execution handler and protocol controller.',
  'Bypassing standard security checks and protocols in Python Basics.',
  'Hardcoding static binary files without backup in Python Basics.',
  'B',
  'Option B is correct. The central execution handler and protocol controller.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000011000007',
  '00000000-0000-4000-a000-000000000011',
  'Q7. What is a common bottleneck or challenge in Python Basics?',
  'Hardcoding static binary files without backup in Python Basics.',
  'Legacy manual processing for Python Basics.',
  'Bypassing standard security checks and protocols in Python Basics.',
  'Managing system state synchronization and resource contention under heavy load.',
  'D',
  'Option D is correct. Managing system state synchronization and resource contention under heavy load.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000011000008',
  '00000000-0000-4000-a000-000000000011',
  'Q8. How is security typically enforced within Python Basics?',
  'Bypassing standard security checks and protocols in Python Basics.',
  'Legacy manual processing for Python Basics.',
  'Through strong authentication, access control permissions, and data encryption.',
  'Hardcoding static binary files without backup in Python Basics.',
  'C',
  'Option C is correct. Through strong authentication, access control permissions, and data encryption.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000011000009',
  '00000000-0000-4000-a000-000000000011',
  'Q9. Which metric is critical for measuring the performance of Python Basics?',
  'Hardcoding static binary files without backup in Python Basics.',
  'Legacy manual processing for Python Basics.',
  'Bypassing standard security checks and protocols in Python Basics.',
  'Response latency, throughput, resource utilization, and error rates.',
  'D',
  'Option D is correct. Response latency, throughput, resource utilization, and error rates.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000011000010',
  '00000000-0000-4000-a000-000000000011',
  'Q10. What is the role of versioning in Python Basics?',
  'Bypassing standard security checks and protocols in Python Basics.',
  'Legacy manual processing for Python Basics.',
  'To support safe updates, maintain backward compatibility, and enable rollbacks.',
  'Hardcoding static binary files without backup in Python Basics.',
  'C',
  'Option C is correct. To support safe updates, maintain backward compatibility, and enable rollbacks.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000011000011',
  '00000000-0000-4000-a000-000000000011',
  'Q11. In what scenario is Python Basics most effectively applied?',
  'Hardcoding static binary files without backup in Python Basics.',
  'Legacy manual processing for Python Basics.',
  'Bypassing standard security checks and protocols in Python Basics.',
  'In modern scalable enterprise systems requiring structured workflows and reliability.',
  'D',
  'Option D is correct. In modern scalable enterprise systems requiring structured workflows and reliability.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000011000012',
  '00000000-0000-4000-a000-000000000011',
  'Q12. Which tool or interface is standard for interacting with Python Basics?',
  'Legacy manual processing for Python Basics.',
  'Dedicated command line tools, SDK APIs, and management dashboards.',
  'Bypassing standard security checks and protocols in Python Basics.',
  'Hardcoding static binary files without backup in Python Basics.',
  'B',
  'Option B is correct. Dedicated command line tools, SDK APIs, and management dashboards.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000011000013',
  '00000000-0000-4000-a000-000000000011',
  'Q13. What is the initial phase when developing with Python Basics?',
  'Hardcoding static binary files without backup in Python Basics.',
  'Legacy manual processing for Python Basics.',
  'Bypassing standard security checks and protocols in Python Basics.',
  'Defining requirements, setting up the development environment, and configuring dependencies.',
  'D',
  'Option D is correct. Defining requirements, setting up the development environment, and configuring dependencies.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000011000014',
  '00000000-0000-4000-a000-000000000011',
  'Q14. Which debugging technique is recommended for Python Basics?',
  'Hardcoding static binary files without backup in Python Basics.',
  'Legacy manual processing for Python Basics.',
  'Bypassing standard security checks and protocols in Python Basics.',
  'Inspecting log trace files, using debugger tools, and verifying stack traces.',
  'D',
  'Option D is correct. Inspecting log trace files, using debugger tools, and verifying stack traces.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000011000015',
  '00000000-0000-4000-a000-000000000011',
  'Q15. What is the overall goal of mastering Python Basics?',
  'To design, build, and maintain production-ready technology solutions.',
  'Legacy manual processing for Python Basics.',
  'Bypassing standard security checks and protocols in Python Basics.',
  'Hardcoding static binary files without backup in Python Basics.',
  'A',
  'Option A is correct. To design, build, and maintain production-ready technology solutions.'
);

-- Quick Learn 12: C Programming Fundamentals
INSERT INTO public.quick_learn_lessons (id, title, slug, branch, category, difficulty, estimated_minutes, is_recommended, fx_reward, short_description, content_markdown, is_published)
VALUES (
  '00000000-0000-4000-a000-000000000012',
  'C Programming Fundamentals',
  'c-programming-fundamentals',
  'CSE',
  'Programming',
  'Beginner',
  3,
  TRUE,
  10,
  'Master C Programming Fundamentals fundamentals with quick reading and 15 practice MCQs on FEEDX.',
  '### Learning Text
C Programming Fundamentals is an essential concept in modern technology and engineering education. Understanding its core components enables effective problem-solving and application development.

### Key Points
- **Core Concepts**: Fundamentals of C Programming Fundamentals.
- **Best Practices**: Implementation standards.
- **Workflow**: Practical application and deployment.',
  TRUE
) ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title;

INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000012000001',
  '00000000-0000-4000-a000-000000000012',
  'Q1. What is the primary definition of C Programming Fundamentals?',
  'Legacy manual processing for C Programming Fundamentals.',
  'A core technology or standard designed for managing and executing C Programming Fundamentals processes.',
  'Bypassing standard security checks and protocols in C Programming Fundamentals.',
  'Hardcoding static binary files without backup in C Programming Fundamentals.',
  'B',
  'Option B is correct. A core technology or standard designed for managing and executing C Programming Fundamentals processes.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000012000002',
  '00000000-0000-4000-a000-000000000012',
  'Q2. Which key benefit is provided by C Programming Fundamentals?',
  'Bypassing standard security checks and protocols in C Programming Fundamentals.',
  'Legacy manual processing for C Programming Fundamentals.',
  'Improved efficiency, scalability, modularity, and operational reliability.',
  'Hardcoding static binary files without backup in C Programming Fundamentals.',
  'C',
  'Option C is correct. Improved efficiency, scalability, modularity, and operational reliability.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000012000003',
  '00000000-0000-4000-a000-000000000012',
  'Q3. What is a fundamental requirement when implementing C Programming Fundamentals?',
  'Proper system configuration, security protocols, and integration standards.',
  'Legacy manual processing for C Programming Fundamentals.',
  'Bypassing standard security checks and protocols in C Programming Fundamentals.',
  'Hardcoding static binary files without backup in C Programming Fundamentals.',
  'A',
  'Option A is correct. Proper system configuration, security protocols, and integration standards.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000012000004',
  '00000000-0000-4000-a000-000000000012',
  'Q4. How does C Programming Fundamentals handle data and execution states?',
  'By utilizing structured schemas, indexes, and optimized execution pipelines.',
  'Legacy manual processing for C Programming Fundamentals.',
  'Bypassing standard security checks and protocols in C Programming Fundamentals.',
  'Hardcoding static binary files without backup in C Programming Fundamentals.',
  'A',
  'Option A is correct. By utilizing structured schemas, indexes, and optimized execution pipelines.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000012000005',
  '00000000-0000-4000-a000-000000000012',
  'Q5. What is a recommended best practice when deploying C Programming Fundamentals?',
  'Bypassing standard security checks and protocols in C Programming Fundamentals.',
  'Legacy manual processing for C Programming Fundamentals.',
  'Conducting regular automated testing, logging, and monitoring checks.',
  'Hardcoding static binary files without backup in C Programming Fundamentals.',
  'C',
  'Option C is correct. Conducting regular automated testing, logging, and monitoring checks.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000012000006',
  '00000000-0000-4000-a000-000000000012',
  'Q6. Which layer or component plays a vital role in C Programming Fundamentals?',
  'Bypassing standard security checks and protocols in C Programming Fundamentals.',
  'Legacy manual processing for C Programming Fundamentals.',
  'The central execution handler and protocol controller.',
  'Hardcoding static binary files without backup in C Programming Fundamentals.',
  'C',
  'Option C is correct. The central execution handler and protocol controller.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000012000007',
  '00000000-0000-4000-a000-000000000012',
  'Q7. What is a common bottleneck or challenge in C Programming Fundamentals?',
  'Managing system state synchronization and resource contention under heavy load.',
  'Legacy manual processing for C Programming Fundamentals.',
  'Bypassing standard security checks and protocols in C Programming Fundamentals.',
  'Hardcoding static binary files without backup in C Programming Fundamentals.',
  'A',
  'Option A is correct. Managing system state synchronization and resource contention under heavy load.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000012000008',
  '00000000-0000-4000-a000-000000000012',
  'Q8. How is security typically enforced within C Programming Fundamentals?',
  'Through strong authentication, access control permissions, and data encryption.',
  'Legacy manual processing for C Programming Fundamentals.',
  'Bypassing standard security checks and protocols in C Programming Fundamentals.',
  'Hardcoding static binary files without backup in C Programming Fundamentals.',
  'A',
  'Option A is correct. Through strong authentication, access control permissions, and data encryption.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000012000009',
  '00000000-0000-4000-a000-000000000012',
  'Q9. Which metric is critical for measuring the performance of C Programming Fundamentals?',
  'Hardcoding static binary files without backup in C Programming Fundamentals.',
  'Legacy manual processing for C Programming Fundamentals.',
  'Bypassing standard security checks and protocols in C Programming Fundamentals.',
  'Response latency, throughput, resource utilization, and error rates.',
  'D',
  'Option D is correct. Response latency, throughput, resource utilization, and error rates.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000012000010',
  '00000000-0000-4000-a000-000000000012',
  'Q10. What is the role of versioning in C Programming Fundamentals?',
  'Hardcoding static binary files without backup in C Programming Fundamentals.',
  'Legacy manual processing for C Programming Fundamentals.',
  'Bypassing standard security checks and protocols in C Programming Fundamentals.',
  'To support safe updates, maintain backward compatibility, and enable rollbacks.',
  'D',
  'Option D is correct. To support safe updates, maintain backward compatibility, and enable rollbacks.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000012000011',
  '00000000-0000-4000-a000-000000000012',
  'Q11. In what scenario is C Programming Fundamentals most effectively applied?',
  'In modern scalable enterprise systems requiring structured workflows and reliability.',
  'Legacy manual processing for C Programming Fundamentals.',
  'Bypassing standard security checks and protocols in C Programming Fundamentals.',
  'Hardcoding static binary files without backup in C Programming Fundamentals.',
  'A',
  'Option A is correct. In modern scalable enterprise systems requiring structured workflows and reliability.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000012000012',
  '00000000-0000-4000-a000-000000000012',
  'Q12. Which tool or interface is standard for interacting with C Programming Fundamentals?',
  'Hardcoding static binary files without backup in C Programming Fundamentals.',
  'Legacy manual processing for C Programming Fundamentals.',
  'Bypassing standard security checks and protocols in C Programming Fundamentals.',
  'Dedicated command line tools, SDK APIs, and management dashboards.',
  'D',
  'Option D is correct. Dedicated command line tools, SDK APIs, and management dashboards.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000012000013',
  '00000000-0000-4000-a000-000000000012',
  'Q13. What is the initial phase when developing with C Programming Fundamentals?',
  'Hardcoding static binary files without backup in C Programming Fundamentals.',
  'Legacy manual processing for C Programming Fundamentals.',
  'Bypassing standard security checks and protocols in C Programming Fundamentals.',
  'Defining requirements, setting up the development environment, and configuring dependencies.',
  'D',
  'Option D is correct. Defining requirements, setting up the development environment, and configuring dependencies.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000012000014',
  '00000000-0000-4000-a000-000000000012',
  'Q14. Which debugging technique is recommended for C Programming Fundamentals?',
  'Hardcoding static binary files without backup in C Programming Fundamentals.',
  'Legacy manual processing for C Programming Fundamentals.',
  'Bypassing standard security checks and protocols in C Programming Fundamentals.',
  'Inspecting log trace files, using debugger tools, and verifying stack traces.',
  'D',
  'Option D is correct. Inspecting log trace files, using debugger tools, and verifying stack traces.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000012000015',
  '00000000-0000-4000-a000-000000000012',
  'Q15. What is the overall goal of mastering C Programming Fundamentals?',
  'Legacy manual processing for C Programming Fundamentals.',
  'To design, build, and maintain production-ready technology solutions.',
  'Bypassing standard security checks and protocols in C Programming Fundamentals.',
  'Hardcoding static binary files without backup in C Programming Fundamentals.',
  'B',
  'Option B is correct. To design, build, and maintain production-ready technology solutions.'
);

-- Quick Learn 13: Java Programming Core
INSERT INTO public.quick_learn_lessons (id, title, slug, branch, category, difficulty, estimated_minutes, is_recommended, fx_reward, short_description, content_markdown, is_published)
VALUES (
  '00000000-0000-4000-a000-000000000013',
  'Java Programming Core',
  'java-programming-core',
  'CSE',
  'Programming',
  'Intermediate',
  3,
  TRUE,
  10,
  'Master Java Programming Core fundamentals with quick reading and 15 practice MCQs on FEEDX.',
  '### Learning Text
Java Programming Core is an essential concept in modern technology and engineering education. Understanding its core components enables effective problem-solving and application development.

### Key Points
- **Core Concepts**: Fundamentals of Java Programming Core.
- **Best Practices**: Implementation standards.
- **Workflow**: Practical application and deployment.',
  TRUE
) ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title;

INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000013000001',
  '00000000-0000-4000-a000-000000000013',
  'Q1. What is the primary definition of Java Programming Core?',
  'Hardcoding static binary files without backup in Java Programming Core.',
  'Legacy manual processing for Java Programming Core.',
  'Bypassing standard security checks and protocols in Java Programming Core.',
  'A core technology or standard designed for managing and executing Java Programming Core processes.',
  'D',
  'Option D is correct. A core technology or standard designed for managing and executing Java Programming Core processes.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000013000002',
  '00000000-0000-4000-a000-000000000013',
  'Q2. Which key benefit is provided by Java Programming Core?',
  'Hardcoding static binary files without backup in Java Programming Core.',
  'Legacy manual processing for Java Programming Core.',
  'Bypassing standard security checks and protocols in Java Programming Core.',
  'Improved efficiency, scalability, modularity, and operational reliability.',
  'D',
  'Option D is correct. Improved efficiency, scalability, modularity, and operational reliability.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000013000003',
  '00000000-0000-4000-a000-000000000013',
  'Q3. What is a fundamental requirement when implementing Java Programming Core?',
  'Proper system configuration, security protocols, and integration standards.',
  'Legacy manual processing for Java Programming Core.',
  'Bypassing standard security checks and protocols in Java Programming Core.',
  'Hardcoding static binary files without backup in Java Programming Core.',
  'A',
  'Option A is correct. Proper system configuration, security protocols, and integration standards.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000013000004',
  '00000000-0000-4000-a000-000000000013',
  'Q4. How does Java Programming Core handle data and execution states?',
  'Legacy manual processing for Java Programming Core.',
  'By utilizing structured schemas, indexes, and optimized execution pipelines.',
  'Bypassing standard security checks and protocols in Java Programming Core.',
  'Hardcoding static binary files without backup in Java Programming Core.',
  'B',
  'Option B is correct. By utilizing structured schemas, indexes, and optimized execution pipelines.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000013000005',
  '00000000-0000-4000-a000-000000000013',
  'Q5. What is a recommended best practice when deploying Java Programming Core?',
  'Legacy manual processing for Java Programming Core.',
  'Conducting regular automated testing, logging, and monitoring checks.',
  'Bypassing standard security checks and protocols in Java Programming Core.',
  'Hardcoding static binary files without backup in Java Programming Core.',
  'B',
  'Option B is correct. Conducting regular automated testing, logging, and monitoring checks.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000013000006',
  '00000000-0000-4000-a000-000000000013',
  'Q6. Which layer or component plays a vital role in Java Programming Core?',
  'Legacy manual processing for Java Programming Core.',
  'The central execution handler and protocol controller.',
  'Bypassing standard security checks and protocols in Java Programming Core.',
  'Hardcoding static binary files without backup in Java Programming Core.',
  'B',
  'Option B is correct. The central execution handler and protocol controller.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000013000007',
  '00000000-0000-4000-a000-000000000013',
  'Q7. What is a common bottleneck or challenge in Java Programming Core?',
  'Legacy manual processing for Java Programming Core.',
  'Managing system state synchronization and resource contention under heavy load.',
  'Bypassing standard security checks and protocols in Java Programming Core.',
  'Hardcoding static binary files without backup in Java Programming Core.',
  'B',
  'Option B is correct. Managing system state synchronization and resource contention under heavy load.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000013000008',
  '00000000-0000-4000-a000-000000000013',
  'Q8. How is security typically enforced within Java Programming Core?',
  'Legacy manual processing for Java Programming Core.',
  'Through strong authentication, access control permissions, and data encryption.',
  'Bypassing standard security checks and protocols in Java Programming Core.',
  'Hardcoding static binary files without backup in Java Programming Core.',
  'B',
  'Option B is correct. Through strong authentication, access control permissions, and data encryption.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000013000009',
  '00000000-0000-4000-a000-000000000013',
  'Q9. Which metric is critical for measuring the performance of Java Programming Core?',
  'Hardcoding static binary files without backup in Java Programming Core.',
  'Legacy manual processing for Java Programming Core.',
  'Bypassing standard security checks and protocols in Java Programming Core.',
  'Response latency, throughput, resource utilization, and error rates.',
  'D',
  'Option D is correct. Response latency, throughput, resource utilization, and error rates.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000013000010',
  '00000000-0000-4000-a000-000000000013',
  'Q10. What is the role of versioning in Java Programming Core?',
  'Bypassing standard security checks and protocols in Java Programming Core.',
  'Legacy manual processing for Java Programming Core.',
  'To support safe updates, maintain backward compatibility, and enable rollbacks.',
  'Hardcoding static binary files without backup in Java Programming Core.',
  'C',
  'Option C is correct. To support safe updates, maintain backward compatibility, and enable rollbacks.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000013000011',
  '00000000-0000-4000-a000-000000000013',
  'Q11. In what scenario is Java Programming Core most effectively applied?',
  'In modern scalable enterprise systems requiring structured workflows and reliability.',
  'Legacy manual processing for Java Programming Core.',
  'Bypassing standard security checks and protocols in Java Programming Core.',
  'Hardcoding static binary files without backup in Java Programming Core.',
  'A',
  'Option A is correct. In modern scalable enterprise systems requiring structured workflows and reliability.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000013000012',
  '00000000-0000-4000-a000-000000000013',
  'Q12. Which tool or interface is standard for interacting with Java Programming Core?',
  'Bypassing standard security checks and protocols in Java Programming Core.',
  'Legacy manual processing for Java Programming Core.',
  'Dedicated command line tools, SDK APIs, and management dashboards.',
  'Hardcoding static binary files without backup in Java Programming Core.',
  'C',
  'Option C is correct. Dedicated command line tools, SDK APIs, and management dashboards.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000013000013',
  '00000000-0000-4000-a000-000000000013',
  'Q13. What is the initial phase when developing with Java Programming Core?',
  'Defining requirements, setting up the development environment, and configuring dependencies.',
  'Legacy manual processing for Java Programming Core.',
  'Bypassing standard security checks and protocols in Java Programming Core.',
  'Hardcoding static binary files without backup in Java Programming Core.',
  'A',
  'Option A is correct. Defining requirements, setting up the development environment, and configuring dependencies.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000013000014',
  '00000000-0000-4000-a000-000000000013',
  'Q14. Which debugging technique is recommended for Java Programming Core?',
  'Legacy manual processing for Java Programming Core.',
  'Inspecting log trace files, using debugger tools, and verifying stack traces.',
  'Bypassing standard security checks and protocols in Java Programming Core.',
  'Hardcoding static binary files without backup in Java Programming Core.',
  'B',
  'Option B is correct. Inspecting log trace files, using debugger tools, and verifying stack traces.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000013000015',
  '00000000-0000-4000-a000-000000000013',
  'Q15. What is the overall goal of mastering Java Programming Core?',
  'Hardcoding static binary files without backup in Java Programming Core.',
  'Legacy manual processing for Java Programming Core.',
  'Bypassing standard security checks and protocols in Java Programming Core.',
  'To design, build, and maintain production-ready technology solutions.',
  'D',
  'Option D is correct. To design, build, and maintain production-ready technology solutions.'
);

-- Quick Learn 14: SQL & Database Systems
INSERT INTO public.quick_learn_lessons (id, title, slug, branch, category, difficulty, estimated_minutes, is_recommended, fx_reward, short_description, content_markdown, is_published)
VALUES (
  '00000000-0000-4000-a000-000000000014',
  'SQL & Database Systems',
  'sql-database-systems',
  'CSE',
  'Databases',
  'Intermediate',
  3,
  TRUE,
  10,
  'Master SQL & Database Systems fundamentals with quick reading and 15 practice MCQs on FEEDX.',
  '### Learning Text
SQL & Database Systems is an essential concept in modern technology and engineering education. Understanding its core components enables effective problem-solving and application development.

### Key Points
- **Core Concepts**: Fundamentals of SQL & Database Systems.
- **Best Practices**: Implementation standards.
- **Workflow**: Practical application and deployment.',
  TRUE
) ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title;

INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000014000001',
  '00000000-0000-4000-a000-000000000014',
  'Q1. What is the primary definition of SQL & Database Systems?',
  'Hardcoding static binary files without backup in SQL & Database Systems.',
  'Legacy manual processing for SQL & Database Systems.',
  'Bypassing standard security checks and protocols in SQL & Database Systems.',
  'A core technology or standard designed for managing and executing SQL & Database Systems processes.',
  'D',
  'Option D is correct. A core technology or standard designed for managing and executing SQL & Database Systems processes.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000014000002',
  '00000000-0000-4000-a000-000000000014',
  'Q2. Which key benefit is provided by SQL & Database Systems?',
  'Improved efficiency, scalability, modularity, and operational reliability.',
  'Legacy manual processing for SQL & Database Systems.',
  'Bypassing standard security checks and protocols in SQL & Database Systems.',
  'Hardcoding static binary files without backup in SQL & Database Systems.',
  'A',
  'Option A is correct. Improved efficiency, scalability, modularity, and operational reliability.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000014000003',
  '00000000-0000-4000-a000-000000000014',
  'Q3. What is a fundamental requirement when implementing SQL & Database Systems?',
  'Legacy manual processing for SQL & Database Systems.',
  'Proper system configuration, security protocols, and integration standards.',
  'Bypassing standard security checks and protocols in SQL & Database Systems.',
  'Hardcoding static binary files without backup in SQL & Database Systems.',
  'B',
  'Option B is correct. Proper system configuration, security protocols, and integration standards.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000014000004',
  '00000000-0000-4000-a000-000000000014',
  'Q4. How does SQL & Database Systems handle data and execution states?',
  'By utilizing structured schemas, indexes, and optimized execution pipelines.',
  'Legacy manual processing for SQL & Database Systems.',
  'Bypassing standard security checks and protocols in SQL & Database Systems.',
  'Hardcoding static binary files without backup in SQL & Database Systems.',
  'A',
  'Option A is correct. By utilizing structured schemas, indexes, and optimized execution pipelines.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000014000005',
  '00000000-0000-4000-a000-000000000014',
  'Q5. What is a recommended best practice when deploying SQL & Database Systems?',
  'Legacy manual processing for SQL & Database Systems.',
  'Conducting regular automated testing, logging, and monitoring checks.',
  'Bypassing standard security checks and protocols in SQL & Database Systems.',
  'Hardcoding static binary files without backup in SQL & Database Systems.',
  'B',
  'Option B is correct. Conducting regular automated testing, logging, and monitoring checks.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000014000006',
  '00000000-0000-4000-a000-000000000014',
  'Q6. Which layer or component plays a vital role in SQL & Database Systems?',
  'Bypassing standard security checks and protocols in SQL & Database Systems.',
  'Legacy manual processing for SQL & Database Systems.',
  'The central execution handler and protocol controller.',
  'Hardcoding static binary files without backup in SQL & Database Systems.',
  'C',
  'Option C is correct. The central execution handler and protocol controller.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000014000007',
  '00000000-0000-4000-a000-000000000014',
  'Q7. What is a common bottleneck or challenge in SQL & Database Systems?',
  'Hardcoding static binary files without backup in SQL & Database Systems.',
  'Legacy manual processing for SQL & Database Systems.',
  'Bypassing standard security checks and protocols in SQL & Database Systems.',
  'Managing system state synchronization and resource contention under heavy load.',
  'D',
  'Option D is correct. Managing system state synchronization and resource contention under heavy load.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000014000008',
  '00000000-0000-4000-a000-000000000014',
  'Q8. How is security typically enforced within SQL & Database Systems?',
  'Bypassing standard security checks and protocols in SQL & Database Systems.',
  'Legacy manual processing for SQL & Database Systems.',
  'Through strong authentication, access control permissions, and data encryption.',
  'Hardcoding static binary files without backup in SQL & Database Systems.',
  'C',
  'Option C is correct. Through strong authentication, access control permissions, and data encryption.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000014000009',
  '00000000-0000-4000-a000-000000000014',
  'Q9. Which metric is critical for measuring the performance of SQL & Database Systems?',
  'Bypassing standard security checks and protocols in SQL & Database Systems.',
  'Legacy manual processing for SQL & Database Systems.',
  'Response latency, throughput, resource utilization, and error rates.',
  'Hardcoding static binary files without backup in SQL & Database Systems.',
  'C',
  'Option C is correct. Response latency, throughput, resource utilization, and error rates.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000014000010',
  '00000000-0000-4000-a000-000000000014',
  'Q10. What is the role of versioning in SQL & Database Systems?',
  'Hardcoding static binary files without backup in SQL & Database Systems.',
  'Legacy manual processing for SQL & Database Systems.',
  'Bypassing standard security checks and protocols in SQL & Database Systems.',
  'To support safe updates, maintain backward compatibility, and enable rollbacks.',
  'D',
  'Option D is correct. To support safe updates, maintain backward compatibility, and enable rollbacks.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000014000011',
  '00000000-0000-4000-a000-000000000014',
  'Q11. In what scenario is SQL & Database Systems most effectively applied?',
  'Legacy manual processing for SQL & Database Systems.',
  'In modern scalable enterprise systems requiring structured workflows and reliability.',
  'Bypassing standard security checks and protocols in SQL & Database Systems.',
  'Hardcoding static binary files without backup in SQL & Database Systems.',
  'B',
  'Option B is correct. In modern scalable enterprise systems requiring structured workflows and reliability.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000014000012',
  '00000000-0000-4000-a000-000000000014',
  'Q12. Which tool or interface is standard for interacting with SQL & Database Systems?',
  'Legacy manual processing for SQL & Database Systems.',
  'Dedicated command line tools, SDK APIs, and management dashboards.',
  'Bypassing standard security checks and protocols in SQL & Database Systems.',
  'Hardcoding static binary files without backup in SQL & Database Systems.',
  'B',
  'Option B is correct. Dedicated command line tools, SDK APIs, and management dashboards.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000014000013',
  '00000000-0000-4000-a000-000000000014',
  'Q13. What is the initial phase when developing with SQL & Database Systems?',
  'Defining requirements, setting up the development environment, and configuring dependencies.',
  'Legacy manual processing for SQL & Database Systems.',
  'Bypassing standard security checks and protocols in SQL & Database Systems.',
  'Hardcoding static binary files without backup in SQL & Database Systems.',
  'A',
  'Option A is correct. Defining requirements, setting up the development environment, and configuring dependencies.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000014000014',
  '00000000-0000-4000-a000-000000000014',
  'Q14. Which debugging technique is recommended for SQL & Database Systems?',
  'Hardcoding static binary files without backup in SQL & Database Systems.',
  'Legacy manual processing for SQL & Database Systems.',
  'Bypassing standard security checks and protocols in SQL & Database Systems.',
  'Inspecting log trace files, using debugger tools, and verifying stack traces.',
  'D',
  'Option D is correct. Inspecting log trace files, using debugger tools, and verifying stack traces.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000014000015',
  '00000000-0000-4000-a000-000000000014',
  'Q15. What is the overall goal of mastering SQL & Database Systems?',
  'Legacy manual processing for SQL & Database Systems.',
  'To design, build, and maintain production-ready technology solutions.',
  'Bypassing standard security checks and protocols in SQL & Database Systems.',
  'Hardcoding static binary files without backup in SQL & Database Systems.',
  'B',
  'Option B is correct. To design, build, and maintain production-ready technology solutions.'
);

-- Quick Learn 15: Git vs GitHub
INSERT INTO public.quick_learn_lessons (id, title, slug, branch, category, difficulty, estimated_minutes, is_recommended, fx_reward, short_description, content_markdown, is_published)
VALUES (
  '00000000-0000-4000-a000-000000000015',
  'Git vs GitHub',
  'git-vs-github',
  'CSE',
  'DevOps',
  'Beginner',
  3,
  TRUE,
  10,
  'Master Git vs GitHub fundamentals with quick reading and 15 practice MCQs on FEEDX.',
  '### Learning Text
Git vs GitHub is an essential concept in modern technology and engineering education. Understanding its core components enables effective problem-solving and application development.

### Key Points
- **Core Concepts**: Fundamentals of Git vs GitHub.
- **Best Practices**: Implementation standards.
- **Workflow**: Practical application and deployment.',
  TRUE
) ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title;

INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000015000001',
  '00000000-0000-4000-a000-000000000015',
  'Q1. What is the primary definition of Git vs GitHub?',
  'Hardcoding static binary files without backup in Git vs GitHub.',
  'Legacy manual processing for Git vs GitHub.',
  'Bypassing standard security checks and protocols in Git vs GitHub.',
  'A core technology or standard designed for managing and executing Git vs GitHub processes.',
  'D',
  'Option D is correct. A core technology or standard designed for managing and executing Git vs GitHub processes.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000015000002',
  '00000000-0000-4000-a000-000000000015',
  'Q2. Which key benefit is provided by Git vs GitHub?',
  'Improved efficiency, scalability, modularity, and operational reliability.',
  'Legacy manual processing for Git vs GitHub.',
  'Bypassing standard security checks and protocols in Git vs GitHub.',
  'Hardcoding static binary files without backup in Git vs GitHub.',
  'A',
  'Option A is correct. Improved efficiency, scalability, modularity, and operational reliability.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000015000003',
  '00000000-0000-4000-a000-000000000015',
  'Q3. What is a fundamental requirement when implementing Git vs GitHub?',
  'Bypassing standard security checks and protocols in Git vs GitHub.',
  'Legacy manual processing for Git vs GitHub.',
  'Proper system configuration, security protocols, and integration standards.',
  'Hardcoding static binary files without backup in Git vs GitHub.',
  'C',
  'Option C is correct. Proper system configuration, security protocols, and integration standards.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000015000004',
  '00000000-0000-4000-a000-000000000015',
  'Q4. How does Git vs GitHub handle data and execution states?',
  'Hardcoding static binary files without backup in Git vs GitHub.',
  'Legacy manual processing for Git vs GitHub.',
  'Bypassing standard security checks and protocols in Git vs GitHub.',
  'By utilizing structured schemas, indexes, and optimized execution pipelines.',
  'D',
  'Option D is correct. By utilizing structured schemas, indexes, and optimized execution pipelines.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000015000005',
  '00000000-0000-4000-a000-000000000015',
  'Q5. What is a recommended best practice when deploying Git vs GitHub?',
  'Conducting regular automated testing, logging, and monitoring checks.',
  'Legacy manual processing for Git vs GitHub.',
  'Bypassing standard security checks and protocols in Git vs GitHub.',
  'Hardcoding static binary files without backup in Git vs GitHub.',
  'A',
  'Option A is correct. Conducting regular automated testing, logging, and monitoring checks.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000015000006',
  '00000000-0000-4000-a000-000000000015',
  'Q6. Which layer or component plays a vital role in Git vs GitHub?',
  'Hardcoding static binary files without backup in Git vs GitHub.',
  'Legacy manual processing for Git vs GitHub.',
  'Bypassing standard security checks and protocols in Git vs GitHub.',
  'The central execution handler and protocol controller.',
  'D',
  'Option D is correct. The central execution handler and protocol controller.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000015000007',
  '00000000-0000-4000-a000-000000000015',
  'Q7. What is a common bottleneck or challenge in Git vs GitHub?',
  'Legacy manual processing for Git vs GitHub.',
  'Managing system state synchronization and resource contention under heavy load.',
  'Bypassing standard security checks and protocols in Git vs GitHub.',
  'Hardcoding static binary files without backup in Git vs GitHub.',
  'B',
  'Option B is correct. Managing system state synchronization and resource contention under heavy load.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000015000008',
  '00000000-0000-4000-a000-000000000015',
  'Q8. How is security typically enforced within Git vs GitHub?',
  'Hardcoding static binary files without backup in Git vs GitHub.',
  'Legacy manual processing for Git vs GitHub.',
  'Bypassing standard security checks and protocols in Git vs GitHub.',
  'Through strong authentication, access control permissions, and data encryption.',
  'D',
  'Option D is correct. Through strong authentication, access control permissions, and data encryption.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000015000009',
  '00000000-0000-4000-a000-000000000015',
  'Q9. Which metric is critical for measuring the performance of Git vs GitHub?',
  'Response latency, throughput, resource utilization, and error rates.',
  'Legacy manual processing for Git vs GitHub.',
  'Bypassing standard security checks and protocols in Git vs GitHub.',
  'Hardcoding static binary files without backup in Git vs GitHub.',
  'A',
  'Option A is correct. Response latency, throughput, resource utilization, and error rates.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000015000010',
  '00000000-0000-4000-a000-000000000015',
  'Q10. What is the role of versioning in Git vs GitHub?',
  'Bypassing standard security checks and protocols in Git vs GitHub.',
  'Legacy manual processing for Git vs GitHub.',
  'To support safe updates, maintain backward compatibility, and enable rollbacks.',
  'Hardcoding static binary files without backup in Git vs GitHub.',
  'C',
  'Option C is correct. To support safe updates, maintain backward compatibility, and enable rollbacks.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000015000011',
  '00000000-0000-4000-a000-000000000015',
  'Q11. In what scenario is Git vs GitHub most effectively applied?',
  'Hardcoding static binary files without backup in Git vs GitHub.',
  'Legacy manual processing for Git vs GitHub.',
  'Bypassing standard security checks and protocols in Git vs GitHub.',
  'In modern scalable enterprise systems requiring structured workflows and reliability.',
  'D',
  'Option D is correct. In modern scalable enterprise systems requiring structured workflows and reliability.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000015000012',
  '00000000-0000-4000-a000-000000000015',
  'Q12. Which tool or interface is standard for interacting with Git vs GitHub?',
  'Bypassing standard security checks and protocols in Git vs GitHub.',
  'Legacy manual processing for Git vs GitHub.',
  'Dedicated command line tools, SDK APIs, and management dashboards.',
  'Hardcoding static binary files without backup in Git vs GitHub.',
  'C',
  'Option C is correct. Dedicated command line tools, SDK APIs, and management dashboards.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000015000013',
  '00000000-0000-4000-a000-000000000015',
  'Q13. What is the initial phase when developing with Git vs GitHub?',
  'Hardcoding static binary files without backup in Git vs GitHub.',
  'Legacy manual processing for Git vs GitHub.',
  'Bypassing standard security checks and protocols in Git vs GitHub.',
  'Defining requirements, setting up the development environment, and configuring dependencies.',
  'D',
  'Option D is correct. Defining requirements, setting up the development environment, and configuring dependencies.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000015000014',
  '00000000-0000-4000-a000-000000000015',
  'Q14. Which debugging technique is recommended for Git vs GitHub?',
  'Legacy manual processing for Git vs GitHub.',
  'Inspecting log trace files, using debugger tools, and verifying stack traces.',
  'Bypassing standard security checks and protocols in Git vs GitHub.',
  'Hardcoding static binary files without backup in Git vs GitHub.',
  'B',
  'Option B is correct. Inspecting log trace files, using debugger tools, and verifying stack traces.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000015000015',
  '00000000-0000-4000-a000-000000000015',
  'Q15. What is the overall goal of mastering Git vs GitHub?',
  'To design, build, and maintain production-ready technology solutions.',
  'Legacy manual processing for Git vs GitHub.',
  'Bypassing standard security checks and protocols in Git vs GitHub.',
  'Hardcoding static binary files without backup in Git vs GitHub.',
  'A',
  'Option A is correct. To design, build, and maintain production-ready technology solutions.'
);

-- Quick Learn 16: HTTP & HTTPS Protocols
INSERT INTO public.quick_learn_lessons (id, title, slug, branch, category, difficulty, estimated_minutes, is_recommended, fx_reward, short_description, content_markdown, is_published)
VALUES (
  '00000000-0000-4000-a000-000000000016',
  'HTTP & HTTPS Protocols',
  'http-https-protocols',
  'CSE',
  'Networking',
  'Intermediate',
  3,
  TRUE,
  10,
  'Master HTTP & HTTPS Protocols fundamentals with quick reading and 15 practice MCQs on FEEDX.',
  '### Learning Text
HTTP & HTTPS Protocols is an essential concept in modern technology and engineering education. Understanding its core components enables effective problem-solving and application development.

### Key Points
- **Core Concepts**: Fundamentals of HTTP & HTTPS Protocols.
- **Best Practices**: Implementation standards.
- **Workflow**: Practical application and deployment.',
  TRUE
) ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title;

INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000016000001',
  '00000000-0000-4000-a000-000000000016',
  'Q1. What is the primary definition of HTTP & HTTPS Protocols?',
  'Hardcoding static binary files without backup in HTTP & HTTPS Protocols.',
  'Legacy manual processing for HTTP & HTTPS Protocols.',
  'Bypassing standard security checks and protocols in HTTP & HTTPS Protocols.',
  'A core technology or standard designed for managing and executing HTTP & HTTPS Protocols processes.',
  'D',
  'Option D is correct. A core technology or standard designed for managing and executing HTTP & HTTPS Protocols processes.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000016000002',
  '00000000-0000-4000-a000-000000000016',
  'Q2. Which key benefit is provided by HTTP & HTTPS Protocols?',
  'Bypassing standard security checks and protocols in HTTP & HTTPS Protocols.',
  'Legacy manual processing for HTTP & HTTPS Protocols.',
  'Improved efficiency, scalability, modularity, and operational reliability.',
  'Hardcoding static binary files without backup in HTTP & HTTPS Protocols.',
  'C',
  'Option C is correct. Improved efficiency, scalability, modularity, and operational reliability.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000016000003',
  '00000000-0000-4000-a000-000000000016',
  'Q3. What is a fundamental requirement when implementing HTTP & HTTPS Protocols?',
  'Proper system configuration, security protocols, and integration standards.',
  'Legacy manual processing for HTTP & HTTPS Protocols.',
  'Bypassing standard security checks and protocols in HTTP & HTTPS Protocols.',
  'Hardcoding static binary files without backup in HTTP & HTTPS Protocols.',
  'A',
  'Option A is correct. Proper system configuration, security protocols, and integration standards.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000016000004',
  '00000000-0000-4000-a000-000000000016',
  'Q4. How does HTTP & HTTPS Protocols handle data and execution states?',
  'Bypassing standard security checks and protocols in HTTP & HTTPS Protocols.',
  'Legacy manual processing for HTTP & HTTPS Protocols.',
  'By utilizing structured schemas, indexes, and optimized execution pipelines.',
  'Hardcoding static binary files without backup in HTTP & HTTPS Protocols.',
  'C',
  'Option C is correct. By utilizing structured schemas, indexes, and optimized execution pipelines.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000016000005',
  '00000000-0000-4000-a000-000000000016',
  'Q5. What is a recommended best practice when deploying HTTP & HTTPS Protocols?',
  'Hardcoding static binary files without backup in HTTP & HTTPS Protocols.',
  'Legacy manual processing for HTTP & HTTPS Protocols.',
  'Bypassing standard security checks and protocols in HTTP & HTTPS Protocols.',
  'Conducting regular automated testing, logging, and monitoring checks.',
  'D',
  'Option D is correct. Conducting regular automated testing, logging, and monitoring checks.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000016000006',
  '00000000-0000-4000-a000-000000000016',
  'Q6. Which layer or component plays a vital role in HTTP & HTTPS Protocols?',
  'Legacy manual processing for HTTP & HTTPS Protocols.',
  'The central execution handler and protocol controller.',
  'Bypassing standard security checks and protocols in HTTP & HTTPS Protocols.',
  'Hardcoding static binary files without backup in HTTP & HTTPS Protocols.',
  'B',
  'Option B is correct. The central execution handler and protocol controller.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000016000007',
  '00000000-0000-4000-a000-000000000016',
  'Q7. What is a common bottleneck or challenge in HTTP & HTTPS Protocols?',
  'Legacy manual processing for HTTP & HTTPS Protocols.',
  'Managing system state synchronization and resource contention under heavy load.',
  'Bypassing standard security checks and protocols in HTTP & HTTPS Protocols.',
  'Hardcoding static binary files without backup in HTTP & HTTPS Protocols.',
  'B',
  'Option B is correct. Managing system state synchronization and resource contention under heavy load.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000016000008',
  '00000000-0000-4000-a000-000000000016',
  'Q8. How is security typically enforced within HTTP & HTTPS Protocols?',
  'Bypassing standard security checks and protocols in HTTP & HTTPS Protocols.',
  'Legacy manual processing for HTTP & HTTPS Protocols.',
  'Through strong authentication, access control permissions, and data encryption.',
  'Hardcoding static binary files without backup in HTTP & HTTPS Protocols.',
  'C',
  'Option C is correct. Through strong authentication, access control permissions, and data encryption.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000016000009',
  '00000000-0000-4000-a000-000000000016',
  'Q9. Which metric is critical for measuring the performance of HTTP & HTTPS Protocols?',
  'Legacy manual processing for HTTP & HTTPS Protocols.',
  'Response latency, throughput, resource utilization, and error rates.',
  'Bypassing standard security checks and protocols in HTTP & HTTPS Protocols.',
  'Hardcoding static binary files without backup in HTTP & HTTPS Protocols.',
  'B',
  'Option B is correct. Response latency, throughput, resource utilization, and error rates.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000016000010',
  '00000000-0000-4000-a000-000000000016',
  'Q10. What is the role of versioning in HTTP & HTTPS Protocols?',
  'Bypassing standard security checks and protocols in HTTP & HTTPS Protocols.',
  'Legacy manual processing for HTTP & HTTPS Protocols.',
  'To support safe updates, maintain backward compatibility, and enable rollbacks.',
  'Hardcoding static binary files without backup in HTTP & HTTPS Protocols.',
  'C',
  'Option C is correct. To support safe updates, maintain backward compatibility, and enable rollbacks.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000016000011',
  '00000000-0000-4000-a000-000000000016',
  'Q11. In what scenario is HTTP & HTTPS Protocols most effectively applied?',
  'Bypassing standard security checks and protocols in HTTP & HTTPS Protocols.',
  'Legacy manual processing for HTTP & HTTPS Protocols.',
  'In modern scalable enterprise systems requiring structured workflows and reliability.',
  'Hardcoding static binary files without backup in HTTP & HTTPS Protocols.',
  'C',
  'Option C is correct. In modern scalable enterprise systems requiring structured workflows and reliability.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000016000012',
  '00000000-0000-4000-a000-000000000016',
  'Q12. Which tool or interface is standard for interacting with HTTP & HTTPS Protocols?',
  'Hardcoding static binary files without backup in HTTP & HTTPS Protocols.',
  'Legacy manual processing for HTTP & HTTPS Protocols.',
  'Bypassing standard security checks and protocols in HTTP & HTTPS Protocols.',
  'Dedicated command line tools, SDK APIs, and management dashboards.',
  'D',
  'Option D is correct. Dedicated command line tools, SDK APIs, and management dashboards.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000016000013',
  '00000000-0000-4000-a000-000000000016',
  'Q13. What is the initial phase when developing with HTTP & HTTPS Protocols?',
  'Defining requirements, setting up the development environment, and configuring dependencies.',
  'Legacy manual processing for HTTP & HTTPS Protocols.',
  'Bypassing standard security checks and protocols in HTTP & HTTPS Protocols.',
  'Hardcoding static binary files without backup in HTTP & HTTPS Protocols.',
  'A',
  'Option A is correct. Defining requirements, setting up the development environment, and configuring dependencies.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000016000014',
  '00000000-0000-4000-a000-000000000016',
  'Q14. Which debugging technique is recommended for HTTP & HTTPS Protocols?',
  'Hardcoding static binary files without backup in HTTP & HTTPS Protocols.',
  'Legacy manual processing for HTTP & HTTPS Protocols.',
  'Bypassing standard security checks and protocols in HTTP & HTTPS Protocols.',
  'Inspecting log trace files, using debugger tools, and verifying stack traces.',
  'D',
  'Option D is correct. Inspecting log trace files, using debugger tools, and verifying stack traces.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000016000015',
  '00000000-0000-4000-a000-000000000016',
  'Q15. What is the overall goal of mastering HTTP & HTTPS Protocols?',
  'Bypassing standard security checks and protocols in HTTP & HTTPS Protocols.',
  'Legacy manual processing for HTTP & HTTPS Protocols.',
  'To design, build, and maintain production-ready technology solutions.',
  'Hardcoding static binary files without backup in HTTP & HTTPS Protocols.',
  'C',
  'Option C is correct. To design, build, and maintain production-ready technology solutions.'
);

-- Quick Learn 17: DNS Explained
INSERT INTO public.quick_learn_lessons (id, title, slug, branch, category, difficulty, estimated_minutes, is_recommended, fx_reward, short_description, content_markdown, is_published)
VALUES (
  '00000000-0000-4000-a000-000000000017',
  'DNS Explained',
  'dns-explained',
  'CSE',
  'Networking',
  'Intermediate',
  3,
  TRUE,
  10,
  'Master DNS Explained fundamentals with quick reading and 15 practice MCQs on FEEDX.',
  '### Learning Text
DNS Explained is an essential concept in modern technology and engineering education. Understanding its core components enables effective problem-solving and application development.

### Key Points
- **Core Concepts**: Fundamentals of DNS Explained.
- **Best Practices**: Implementation standards.
- **Workflow**: Practical application and deployment.',
  TRUE
) ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title;

INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000017000001',
  '00000000-0000-4000-a000-000000000017',
  'Q1. What is the primary definition of DNS Explained?',
  'Legacy manual processing for DNS Explained.',
  'A core technology or standard designed for managing and executing DNS Explained processes.',
  'Bypassing standard security checks and protocols in DNS Explained.',
  'Hardcoding static binary files without backup in DNS Explained.',
  'B',
  'Option B is correct. A core technology or standard designed for managing and executing DNS Explained processes.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000017000002',
  '00000000-0000-4000-a000-000000000017',
  'Q2. Which key benefit is provided by DNS Explained?',
  'Bypassing standard security checks and protocols in DNS Explained.',
  'Legacy manual processing for DNS Explained.',
  'Improved efficiency, scalability, modularity, and operational reliability.',
  'Hardcoding static binary files without backup in DNS Explained.',
  'C',
  'Option C is correct. Improved efficiency, scalability, modularity, and operational reliability.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000017000003',
  '00000000-0000-4000-a000-000000000017',
  'Q3. What is a fundamental requirement when implementing DNS Explained?',
  'Bypassing standard security checks and protocols in DNS Explained.',
  'Legacy manual processing for DNS Explained.',
  'Proper system configuration, security protocols, and integration standards.',
  'Hardcoding static binary files without backup in DNS Explained.',
  'C',
  'Option C is correct. Proper system configuration, security protocols, and integration standards.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000017000004',
  '00000000-0000-4000-a000-000000000017',
  'Q4. How does DNS Explained handle data and execution states?',
  'By utilizing structured schemas, indexes, and optimized execution pipelines.',
  'Legacy manual processing for DNS Explained.',
  'Bypassing standard security checks and protocols in DNS Explained.',
  'Hardcoding static binary files without backup in DNS Explained.',
  'A',
  'Option A is correct. By utilizing structured schemas, indexes, and optimized execution pipelines.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000017000005',
  '00000000-0000-4000-a000-000000000017',
  'Q5. What is a recommended best practice when deploying DNS Explained?',
  'Conducting regular automated testing, logging, and monitoring checks.',
  'Legacy manual processing for DNS Explained.',
  'Bypassing standard security checks and protocols in DNS Explained.',
  'Hardcoding static binary files without backup in DNS Explained.',
  'A',
  'Option A is correct. Conducting regular automated testing, logging, and monitoring checks.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000017000006',
  '00000000-0000-4000-a000-000000000017',
  'Q6. Which layer or component plays a vital role in DNS Explained?',
  'Hardcoding static binary files without backup in DNS Explained.',
  'Legacy manual processing for DNS Explained.',
  'Bypassing standard security checks and protocols in DNS Explained.',
  'The central execution handler and protocol controller.',
  'D',
  'Option D is correct. The central execution handler and protocol controller.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000017000007',
  '00000000-0000-4000-a000-000000000017',
  'Q7. What is a common bottleneck or challenge in DNS Explained?',
  'Legacy manual processing for DNS Explained.',
  'Managing system state synchronization and resource contention under heavy load.',
  'Bypassing standard security checks and protocols in DNS Explained.',
  'Hardcoding static binary files without backup in DNS Explained.',
  'B',
  'Option B is correct. Managing system state synchronization and resource contention under heavy load.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000017000008',
  '00000000-0000-4000-a000-000000000017',
  'Q8. How is security typically enforced within DNS Explained?',
  'Hardcoding static binary files without backup in DNS Explained.',
  'Legacy manual processing for DNS Explained.',
  'Bypassing standard security checks and protocols in DNS Explained.',
  'Through strong authentication, access control permissions, and data encryption.',
  'D',
  'Option D is correct. Through strong authentication, access control permissions, and data encryption.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000017000009',
  '00000000-0000-4000-a000-000000000017',
  'Q9. Which metric is critical for measuring the performance of DNS Explained?',
  'Response latency, throughput, resource utilization, and error rates.',
  'Legacy manual processing for DNS Explained.',
  'Bypassing standard security checks and protocols in DNS Explained.',
  'Hardcoding static binary files without backup in DNS Explained.',
  'A',
  'Option A is correct. Response latency, throughput, resource utilization, and error rates.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000017000010',
  '00000000-0000-4000-a000-000000000017',
  'Q10. What is the role of versioning in DNS Explained?',
  'To support safe updates, maintain backward compatibility, and enable rollbacks.',
  'Legacy manual processing for DNS Explained.',
  'Bypassing standard security checks and protocols in DNS Explained.',
  'Hardcoding static binary files without backup in DNS Explained.',
  'A',
  'Option A is correct. To support safe updates, maintain backward compatibility, and enable rollbacks.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000017000011',
  '00000000-0000-4000-a000-000000000017',
  'Q11. In what scenario is DNS Explained most effectively applied?',
  'Bypassing standard security checks and protocols in DNS Explained.',
  'Legacy manual processing for DNS Explained.',
  'In modern scalable enterprise systems requiring structured workflows and reliability.',
  'Hardcoding static binary files without backup in DNS Explained.',
  'C',
  'Option C is correct. In modern scalable enterprise systems requiring structured workflows and reliability.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000017000012',
  '00000000-0000-4000-a000-000000000017',
  'Q12. Which tool or interface is standard for interacting with DNS Explained?',
  'Hardcoding static binary files without backup in DNS Explained.',
  'Legacy manual processing for DNS Explained.',
  'Bypassing standard security checks and protocols in DNS Explained.',
  'Dedicated command line tools, SDK APIs, and management dashboards.',
  'D',
  'Option D is correct. Dedicated command line tools, SDK APIs, and management dashboards.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000017000013',
  '00000000-0000-4000-a000-000000000017',
  'Q13. What is the initial phase when developing with DNS Explained?',
  'Legacy manual processing for DNS Explained.',
  'Defining requirements, setting up the development environment, and configuring dependencies.',
  'Bypassing standard security checks and protocols in DNS Explained.',
  'Hardcoding static binary files without backup in DNS Explained.',
  'B',
  'Option B is correct. Defining requirements, setting up the development environment, and configuring dependencies.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000017000014',
  '00000000-0000-4000-a000-000000000017',
  'Q14. Which debugging technique is recommended for DNS Explained?',
  'Inspecting log trace files, using debugger tools, and verifying stack traces.',
  'Legacy manual processing for DNS Explained.',
  'Bypassing standard security checks and protocols in DNS Explained.',
  'Hardcoding static binary files without backup in DNS Explained.',
  'A',
  'Option A is correct. Inspecting log trace files, using debugger tools, and verifying stack traces.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000017000015',
  '00000000-0000-4000-a000-000000000017',
  'Q15. What is the overall goal of mastering DNS Explained?',
  'Bypassing standard security checks and protocols in DNS Explained.',
  'Legacy manual processing for DNS Explained.',
  'To design, build, and maintain production-ready technology solutions.',
  'Hardcoding static binary files without backup in DNS Explained.',
  'C',
  'Option C is correct. To design, build, and maintain production-ready technology solutions.'
);

-- Quick Learn 18: Responsive Web Design
INSERT INTO public.quick_learn_lessons (id, title, slug, branch, category, difficulty, estimated_minutes, is_recommended, fx_reward, short_description, content_markdown, is_published)
VALUES (
  '00000000-0000-4000-a000-000000000018',
  'Responsive Web Design',
  'responsive-web-design',
  'CSE',
  'Web Dev',
  'Intermediate',
  3,
  TRUE,
  10,
  'Master Responsive Web Design fundamentals with quick reading and 15 practice MCQs on FEEDX.',
  '### Learning Text
Responsive Web Design is an essential concept in modern technology and engineering education. Understanding its core components enables effective problem-solving and application development.

### Key Points
- **Core Concepts**: Fundamentals of Responsive Web Design.
- **Best Practices**: Implementation standards.
- **Workflow**: Practical application and deployment.',
  TRUE
) ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title;

INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000018000001',
  '00000000-0000-4000-a000-000000000018',
  'Q1. What is the primary definition of Responsive Web Design?',
  'Hardcoding static binary files without backup in Responsive Web Design.',
  'Legacy manual processing for Responsive Web Design.',
  'Bypassing standard security checks and protocols in Responsive Web Design.',
  'A core technology or standard designed for managing and executing Responsive Web Design processes.',
  'D',
  'Option D is correct. A core technology or standard designed for managing and executing Responsive Web Design processes.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000018000002',
  '00000000-0000-4000-a000-000000000018',
  'Q2. Which key benefit is provided by Responsive Web Design?',
  'Hardcoding static binary files without backup in Responsive Web Design.',
  'Legacy manual processing for Responsive Web Design.',
  'Bypassing standard security checks and protocols in Responsive Web Design.',
  'Improved efficiency, scalability, modularity, and operational reliability.',
  'D',
  'Option D is correct. Improved efficiency, scalability, modularity, and operational reliability.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000018000003',
  '00000000-0000-4000-a000-000000000018',
  'Q3. What is a fundamental requirement when implementing Responsive Web Design?',
  'Proper system configuration, security protocols, and integration standards.',
  'Legacy manual processing for Responsive Web Design.',
  'Bypassing standard security checks and protocols in Responsive Web Design.',
  'Hardcoding static binary files without backup in Responsive Web Design.',
  'A',
  'Option A is correct. Proper system configuration, security protocols, and integration standards.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000018000004',
  '00000000-0000-4000-a000-000000000018',
  'Q4. How does Responsive Web Design handle data and execution states?',
  'Bypassing standard security checks and protocols in Responsive Web Design.',
  'Legacy manual processing for Responsive Web Design.',
  'By utilizing structured schemas, indexes, and optimized execution pipelines.',
  'Hardcoding static binary files without backup in Responsive Web Design.',
  'C',
  'Option C is correct. By utilizing structured schemas, indexes, and optimized execution pipelines.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000018000005',
  '00000000-0000-4000-a000-000000000018',
  'Q5. What is a recommended best practice when deploying Responsive Web Design?',
  'Conducting regular automated testing, logging, and monitoring checks.',
  'Legacy manual processing for Responsive Web Design.',
  'Bypassing standard security checks and protocols in Responsive Web Design.',
  'Hardcoding static binary files without backup in Responsive Web Design.',
  'A',
  'Option A is correct. Conducting regular automated testing, logging, and monitoring checks.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000018000006',
  '00000000-0000-4000-a000-000000000018',
  'Q6. Which layer or component plays a vital role in Responsive Web Design?',
  'The central execution handler and protocol controller.',
  'Legacy manual processing for Responsive Web Design.',
  'Bypassing standard security checks and protocols in Responsive Web Design.',
  'Hardcoding static binary files without backup in Responsive Web Design.',
  'A',
  'Option A is correct. The central execution handler and protocol controller.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000018000007',
  '00000000-0000-4000-a000-000000000018',
  'Q7. What is a common bottleneck or challenge in Responsive Web Design?',
  'Managing system state synchronization and resource contention under heavy load.',
  'Legacy manual processing for Responsive Web Design.',
  'Bypassing standard security checks and protocols in Responsive Web Design.',
  'Hardcoding static binary files without backup in Responsive Web Design.',
  'A',
  'Option A is correct. Managing system state synchronization and resource contention under heavy load.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000018000008',
  '00000000-0000-4000-a000-000000000018',
  'Q8. How is security typically enforced within Responsive Web Design?',
  'Through strong authentication, access control permissions, and data encryption.',
  'Legacy manual processing for Responsive Web Design.',
  'Bypassing standard security checks and protocols in Responsive Web Design.',
  'Hardcoding static binary files without backup in Responsive Web Design.',
  'A',
  'Option A is correct. Through strong authentication, access control permissions, and data encryption.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000018000009',
  '00000000-0000-4000-a000-000000000018',
  'Q9. Which metric is critical for measuring the performance of Responsive Web Design?',
  'Response latency, throughput, resource utilization, and error rates.',
  'Legacy manual processing for Responsive Web Design.',
  'Bypassing standard security checks and protocols in Responsive Web Design.',
  'Hardcoding static binary files without backup in Responsive Web Design.',
  'A',
  'Option A is correct. Response latency, throughput, resource utilization, and error rates.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000018000010',
  '00000000-0000-4000-a000-000000000018',
  'Q10. What is the role of versioning in Responsive Web Design?',
  'To support safe updates, maintain backward compatibility, and enable rollbacks.',
  'Legacy manual processing for Responsive Web Design.',
  'Bypassing standard security checks and protocols in Responsive Web Design.',
  'Hardcoding static binary files without backup in Responsive Web Design.',
  'A',
  'Option A is correct. To support safe updates, maintain backward compatibility, and enable rollbacks.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000018000011',
  '00000000-0000-4000-a000-000000000018',
  'Q11. In what scenario is Responsive Web Design most effectively applied?',
  'In modern scalable enterprise systems requiring structured workflows and reliability.',
  'Legacy manual processing for Responsive Web Design.',
  'Bypassing standard security checks and protocols in Responsive Web Design.',
  'Hardcoding static binary files without backup in Responsive Web Design.',
  'A',
  'Option A is correct. In modern scalable enterprise systems requiring structured workflows and reliability.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000018000012',
  '00000000-0000-4000-a000-000000000018',
  'Q12. Which tool or interface is standard for interacting with Responsive Web Design?',
  'Hardcoding static binary files without backup in Responsive Web Design.',
  'Legacy manual processing for Responsive Web Design.',
  'Bypassing standard security checks and protocols in Responsive Web Design.',
  'Dedicated command line tools, SDK APIs, and management dashboards.',
  'D',
  'Option D is correct. Dedicated command line tools, SDK APIs, and management dashboards.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000018000013',
  '00000000-0000-4000-a000-000000000018',
  'Q13. What is the initial phase when developing with Responsive Web Design?',
  'Hardcoding static binary files without backup in Responsive Web Design.',
  'Legacy manual processing for Responsive Web Design.',
  'Bypassing standard security checks and protocols in Responsive Web Design.',
  'Defining requirements, setting up the development environment, and configuring dependencies.',
  'D',
  'Option D is correct. Defining requirements, setting up the development environment, and configuring dependencies.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000018000014',
  '00000000-0000-4000-a000-000000000018',
  'Q14. Which debugging technique is recommended for Responsive Web Design?',
  'Hardcoding static binary files without backup in Responsive Web Design.',
  'Legacy manual processing for Responsive Web Design.',
  'Bypassing standard security checks and protocols in Responsive Web Design.',
  'Inspecting log trace files, using debugger tools, and verifying stack traces.',
  'D',
  'Option D is correct. Inspecting log trace files, using debugger tools, and verifying stack traces.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000018000015',
  '00000000-0000-4000-a000-000000000018',
  'Q15. What is the overall goal of mastering Responsive Web Design?',
  'Bypassing standard security checks and protocols in Responsive Web Design.',
  'Legacy manual processing for Responsive Web Design.',
  'To design, build, and maintain production-ready technology solutions.',
  'Hardcoding static binary files without backup in Responsive Web Design.',
  'C',
  'Option C is correct. To design, build, and maintain production-ready technology solutions.'
);

-- Quick Learn 19: React Native & Mobile App Dev
INSERT INTO public.quick_learn_lessons (id, title, slug, branch, category, difficulty, estimated_minutes, is_recommended, fx_reward, short_description, content_markdown, is_published)
VALUES (
  '00000000-0000-4000-a000-000000000019',
  'React Native & Mobile App Dev',
  'react-native-mobile-app-dev',
  'CSE',
  'Mobile Dev',
  'Intermediate',
  3,
  TRUE,
  10,
  'Master React Native & Mobile App Dev fundamentals with quick reading and 15 practice MCQs on FEEDX.',
  '### Learning Text
React Native & Mobile App Dev is an essential concept in modern technology and engineering education. Understanding its core components enables effective problem-solving and application development.

### Key Points
- **Core Concepts**: Fundamentals of React Native & Mobile App Dev.
- **Best Practices**: Implementation standards.
- **Workflow**: Practical application and deployment.',
  TRUE
) ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title;

INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000019000001',
  '00000000-0000-4000-a000-000000000019',
  'Q1. What is the primary definition of React Native & Mobile App Dev?',
  'A core technology or standard designed for managing and executing React Native & Mobile App Dev processes.',
  'Legacy manual processing for React Native & Mobile App Dev.',
  'Bypassing standard security checks and protocols in React Native & Mobile App Dev.',
  'Hardcoding static binary files without backup in React Native & Mobile App Dev.',
  'A',
  'Option A is correct. A core technology or standard designed for managing and executing React Native & Mobile App Dev processes.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000019000002',
  '00000000-0000-4000-a000-000000000019',
  'Q2. Which key benefit is provided by React Native & Mobile App Dev?',
  'Improved efficiency, scalability, modularity, and operational reliability.',
  'Legacy manual processing for React Native & Mobile App Dev.',
  'Bypassing standard security checks and protocols in React Native & Mobile App Dev.',
  'Hardcoding static binary files without backup in React Native & Mobile App Dev.',
  'A',
  'Option A is correct. Improved efficiency, scalability, modularity, and operational reliability.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000019000003',
  '00000000-0000-4000-a000-000000000019',
  'Q3. What is a fundamental requirement when implementing React Native & Mobile App Dev?',
  'Bypassing standard security checks and protocols in React Native & Mobile App Dev.',
  'Legacy manual processing for React Native & Mobile App Dev.',
  'Proper system configuration, security protocols, and integration standards.',
  'Hardcoding static binary files without backup in React Native & Mobile App Dev.',
  'C',
  'Option C is correct. Proper system configuration, security protocols, and integration standards.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000019000004',
  '00000000-0000-4000-a000-000000000019',
  'Q4. How does React Native & Mobile App Dev handle data and execution states?',
  'Hardcoding static binary files without backup in React Native & Mobile App Dev.',
  'Legacy manual processing for React Native & Mobile App Dev.',
  'Bypassing standard security checks and protocols in React Native & Mobile App Dev.',
  'By utilizing structured schemas, indexes, and optimized execution pipelines.',
  'D',
  'Option D is correct. By utilizing structured schemas, indexes, and optimized execution pipelines.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000019000005',
  '00000000-0000-4000-a000-000000000019',
  'Q5. What is a recommended best practice when deploying React Native & Mobile App Dev?',
  'Legacy manual processing for React Native & Mobile App Dev.',
  'Conducting regular automated testing, logging, and monitoring checks.',
  'Bypassing standard security checks and protocols in React Native & Mobile App Dev.',
  'Hardcoding static binary files without backup in React Native & Mobile App Dev.',
  'B',
  'Option B is correct. Conducting regular automated testing, logging, and monitoring checks.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000019000006',
  '00000000-0000-4000-a000-000000000019',
  'Q6. Which layer or component plays a vital role in React Native & Mobile App Dev?',
  'The central execution handler and protocol controller.',
  'Legacy manual processing for React Native & Mobile App Dev.',
  'Bypassing standard security checks and protocols in React Native & Mobile App Dev.',
  'Hardcoding static binary files without backup in React Native & Mobile App Dev.',
  'A',
  'Option A is correct. The central execution handler and protocol controller.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000019000007',
  '00000000-0000-4000-a000-000000000019',
  'Q7. What is a common bottleneck or challenge in React Native & Mobile App Dev?',
  'Bypassing standard security checks and protocols in React Native & Mobile App Dev.',
  'Legacy manual processing for React Native & Mobile App Dev.',
  'Managing system state synchronization and resource contention under heavy load.',
  'Hardcoding static binary files without backup in React Native & Mobile App Dev.',
  'C',
  'Option C is correct. Managing system state synchronization and resource contention under heavy load.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000019000008',
  '00000000-0000-4000-a000-000000000019',
  'Q8. How is security typically enforced within React Native & Mobile App Dev?',
  'Legacy manual processing for React Native & Mobile App Dev.',
  'Through strong authentication, access control permissions, and data encryption.',
  'Bypassing standard security checks and protocols in React Native & Mobile App Dev.',
  'Hardcoding static binary files without backup in React Native & Mobile App Dev.',
  'B',
  'Option B is correct. Through strong authentication, access control permissions, and data encryption.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000019000009',
  '00000000-0000-4000-a000-000000000019',
  'Q9. Which metric is critical for measuring the performance of React Native & Mobile App Dev?',
  'Response latency, throughput, resource utilization, and error rates.',
  'Legacy manual processing for React Native & Mobile App Dev.',
  'Bypassing standard security checks and protocols in React Native & Mobile App Dev.',
  'Hardcoding static binary files without backup in React Native & Mobile App Dev.',
  'A',
  'Option A is correct. Response latency, throughput, resource utilization, and error rates.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000019000010',
  '00000000-0000-4000-a000-000000000019',
  'Q10. What is the role of versioning in React Native & Mobile App Dev?',
  'Hardcoding static binary files without backup in React Native & Mobile App Dev.',
  'Legacy manual processing for React Native & Mobile App Dev.',
  'Bypassing standard security checks and protocols in React Native & Mobile App Dev.',
  'To support safe updates, maintain backward compatibility, and enable rollbacks.',
  'D',
  'Option D is correct. To support safe updates, maintain backward compatibility, and enable rollbacks.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000019000011',
  '00000000-0000-4000-a000-000000000019',
  'Q11. In what scenario is React Native & Mobile App Dev most effectively applied?',
  'Hardcoding static binary files without backup in React Native & Mobile App Dev.',
  'Legacy manual processing for React Native & Mobile App Dev.',
  'Bypassing standard security checks and protocols in React Native & Mobile App Dev.',
  'In modern scalable enterprise systems requiring structured workflows and reliability.',
  'D',
  'Option D is correct. In modern scalable enterprise systems requiring structured workflows and reliability.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000019000012',
  '00000000-0000-4000-a000-000000000019',
  'Q12. Which tool or interface is standard for interacting with React Native & Mobile App Dev?',
  'Dedicated command line tools, SDK APIs, and management dashboards.',
  'Legacy manual processing for React Native & Mobile App Dev.',
  'Bypassing standard security checks and protocols in React Native & Mobile App Dev.',
  'Hardcoding static binary files without backup in React Native & Mobile App Dev.',
  'A',
  'Option A is correct. Dedicated command line tools, SDK APIs, and management dashboards.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000019000013',
  '00000000-0000-4000-a000-000000000019',
  'Q13. What is the initial phase when developing with React Native & Mobile App Dev?',
  'Defining requirements, setting up the development environment, and configuring dependencies.',
  'Legacy manual processing for React Native & Mobile App Dev.',
  'Bypassing standard security checks and protocols in React Native & Mobile App Dev.',
  'Hardcoding static binary files without backup in React Native & Mobile App Dev.',
  'A',
  'Option A is correct. Defining requirements, setting up the development environment, and configuring dependencies.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000019000014',
  '00000000-0000-4000-a000-000000000019',
  'Q14. Which debugging technique is recommended for React Native & Mobile App Dev?',
  'Inspecting log trace files, using debugger tools, and verifying stack traces.',
  'Legacy manual processing for React Native & Mobile App Dev.',
  'Bypassing standard security checks and protocols in React Native & Mobile App Dev.',
  'Hardcoding static binary files without backup in React Native & Mobile App Dev.',
  'A',
  'Option A is correct. Inspecting log trace files, using debugger tools, and verifying stack traces.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000019000015',
  '00000000-0000-4000-a000-000000000019',
  'Q15. What is the overall goal of mastering React Native & Mobile App Dev?',
  'To design, build, and maintain production-ready technology solutions.',
  'Legacy manual processing for React Native & Mobile App Dev.',
  'Bypassing standard security checks and protocols in React Native & Mobile App Dev.',
  'Hardcoding static binary files without backup in React Native & Mobile App Dev.',
  'A',
  'Option A is correct. To design, build, and maintain production-ready technology solutions.'
);

-- Quick Learn 20: Node.js & Server Fundamentals
INSERT INTO public.quick_learn_lessons (id, title, slug, branch, category, difficulty, estimated_minutes, is_recommended, fx_reward, short_description, content_markdown, is_published)
VALUES (
  '00000000-0000-4000-a000-000000000020',
  'Node.js & Server Fundamentals',
  'node-js-server-fundamentals',
  'CSE',
  'Backend',
  'Intermediate',
  3,
  TRUE,
  10,
  'Master Node.js & Server Fundamentals fundamentals with quick reading and 15 practice MCQs on FEEDX.',
  '### Learning Text
Node.js & Server Fundamentals is an essential concept in modern technology and engineering education. Understanding its core components enables effective problem-solving and application development.

### Key Points
- **Core Concepts**: Fundamentals of Node.js & Server Fundamentals.
- **Best Practices**: Implementation standards.
- **Workflow**: Practical application and deployment.',
  TRUE
) ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title;

INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000020000001',
  '00000000-0000-4000-a000-000000000020',
  'Q1. What is the primary definition of Node.js & Server Fundamentals?',
  'Bypassing standard security checks and protocols in Node.js & Server Fundamentals.',
  'Legacy manual processing for Node.js & Server Fundamentals.',
  'A core technology or standard designed for managing and executing Node.js & Server Fundamentals processes.',
  'Hardcoding static binary files without backup in Node.js & Server Fundamentals.',
  'C',
  'Option C is correct. A core technology or standard designed for managing and executing Node.js & Server Fundamentals processes.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000020000002',
  '00000000-0000-4000-a000-000000000020',
  'Q2. Which key benefit is provided by Node.js & Server Fundamentals?',
  'Legacy manual processing for Node.js & Server Fundamentals.',
  'Improved efficiency, scalability, modularity, and operational reliability.',
  'Bypassing standard security checks and protocols in Node.js & Server Fundamentals.',
  'Hardcoding static binary files without backup in Node.js & Server Fundamentals.',
  'B',
  'Option B is correct. Improved efficiency, scalability, modularity, and operational reliability.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000020000003',
  '00000000-0000-4000-a000-000000000020',
  'Q3. What is a fundamental requirement when implementing Node.js & Server Fundamentals?',
  'Proper system configuration, security protocols, and integration standards.',
  'Legacy manual processing for Node.js & Server Fundamentals.',
  'Bypassing standard security checks and protocols in Node.js & Server Fundamentals.',
  'Hardcoding static binary files without backup in Node.js & Server Fundamentals.',
  'A',
  'Option A is correct. Proper system configuration, security protocols, and integration standards.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000020000004',
  '00000000-0000-4000-a000-000000000020',
  'Q4. How does Node.js & Server Fundamentals handle data and execution states?',
  'Legacy manual processing for Node.js & Server Fundamentals.',
  'By utilizing structured schemas, indexes, and optimized execution pipelines.',
  'Bypassing standard security checks and protocols in Node.js & Server Fundamentals.',
  'Hardcoding static binary files without backup in Node.js & Server Fundamentals.',
  'B',
  'Option B is correct. By utilizing structured schemas, indexes, and optimized execution pipelines.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000020000005',
  '00000000-0000-4000-a000-000000000020',
  'Q5. What is a recommended best practice when deploying Node.js & Server Fundamentals?',
  'Conducting regular automated testing, logging, and monitoring checks.',
  'Legacy manual processing for Node.js & Server Fundamentals.',
  'Bypassing standard security checks and protocols in Node.js & Server Fundamentals.',
  'Hardcoding static binary files without backup in Node.js & Server Fundamentals.',
  'A',
  'Option A is correct. Conducting regular automated testing, logging, and monitoring checks.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000020000006',
  '00000000-0000-4000-a000-000000000020',
  'Q6. Which layer or component plays a vital role in Node.js & Server Fundamentals?',
  'The central execution handler and protocol controller.',
  'Legacy manual processing for Node.js & Server Fundamentals.',
  'Bypassing standard security checks and protocols in Node.js & Server Fundamentals.',
  'Hardcoding static binary files without backup in Node.js & Server Fundamentals.',
  'A',
  'Option A is correct. The central execution handler and protocol controller.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000020000007',
  '00000000-0000-4000-a000-000000000020',
  'Q7. What is a common bottleneck or challenge in Node.js & Server Fundamentals?',
  'Managing system state synchronization and resource contention under heavy load.',
  'Legacy manual processing for Node.js & Server Fundamentals.',
  'Bypassing standard security checks and protocols in Node.js & Server Fundamentals.',
  'Hardcoding static binary files without backup in Node.js & Server Fundamentals.',
  'A',
  'Option A is correct. Managing system state synchronization and resource contention under heavy load.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000020000008',
  '00000000-0000-4000-a000-000000000020',
  'Q8. How is security typically enforced within Node.js & Server Fundamentals?',
  'Legacy manual processing for Node.js & Server Fundamentals.',
  'Through strong authentication, access control permissions, and data encryption.',
  'Bypassing standard security checks and protocols in Node.js & Server Fundamentals.',
  'Hardcoding static binary files without backup in Node.js & Server Fundamentals.',
  'B',
  'Option B is correct. Through strong authentication, access control permissions, and data encryption.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000020000009',
  '00000000-0000-4000-a000-000000000020',
  'Q9. Which metric is critical for measuring the performance of Node.js & Server Fundamentals?',
  'Response latency, throughput, resource utilization, and error rates.',
  'Legacy manual processing for Node.js & Server Fundamentals.',
  'Bypassing standard security checks and protocols in Node.js & Server Fundamentals.',
  'Hardcoding static binary files without backup in Node.js & Server Fundamentals.',
  'A',
  'Option A is correct. Response latency, throughput, resource utilization, and error rates.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000020000010',
  '00000000-0000-4000-a000-000000000020',
  'Q10. What is the role of versioning in Node.js & Server Fundamentals?',
  'Legacy manual processing for Node.js & Server Fundamentals.',
  'To support safe updates, maintain backward compatibility, and enable rollbacks.',
  'Bypassing standard security checks and protocols in Node.js & Server Fundamentals.',
  'Hardcoding static binary files without backup in Node.js & Server Fundamentals.',
  'B',
  'Option B is correct. To support safe updates, maintain backward compatibility, and enable rollbacks.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000020000011',
  '00000000-0000-4000-a000-000000000020',
  'Q11. In what scenario is Node.js & Server Fundamentals most effectively applied?',
  'Bypassing standard security checks and protocols in Node.js & Server Fundamentals.',
  'Legacy manual processing for Node.js & Server Fundamentals.',
  'In modern scalable enterprise systems requiring structured workflows and reliability.',
  'Hardcoding static binary files without backup in Node.js & Server Fundamentals.',
  'C',
  'Option C is correct. In modern scalable enterprise systems requiring structured workflows and reliability.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000020000012',
  '00000000-0000-4000-a000-000000000020',
  'Q12. Which tool or interface is standard for interacting with Node.js & Server Fundamentals?',
  'Hardcoding static binary files without backup in Node.js & Server Fundamentals.',
  'Legacy manual processing for Node.js & Server Fundamentals.',
  'Bypassing standard security checks and protocols in Node.js & Server Fundamentals.',
  'Dedicated command line tools, SDK APIs, and management dashboards.',
  'D',
  'Option D is correct. Dedicated command line tools, SDK APIs, and management dashboards.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000020000013',
  '00000000-0000-4000-a000-000000000020',
  'Q13. What is the initial phase when developing with Node.js & Server Fundamentals?',
  'Hardcoding static binary files without backup in Node.js & Server Fundamentals.',
  'Legacy manual processing for Node.js & Server Fundamentals.',
  'Bypassing standard security checks and protocols in Node.js & Server Fundamentals.',
  'Defining requirements, setting up the development environment, and configuring dependencies.',
  'D',
  'Option D is correct. Defining requirements, setting up the development environment, and configuring dependencies.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000020000014',
  '00000000-0000-4000-a000-000000000020',
  'Q14. Which debugging technique is recommended for Node.js & Server Fundamentals?',
  'Hardcoding static binary files without backup in Node.js & Server Fundamentals.',
  'Legacy manual processing for Node.js & Server Fundamentals.',
  'Bypassing standard security checks and protocols in Node.js & Server Fundamentals.',
  'Inspecting log trace files, using debugger tools, and verifying stack traces.',
  'D',
  'Option D is correct. Inspecting log trace files, using debugger tools, and verifying stack traces.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000020000015',
  '00000000-0000-4000-a000-000000000020',
  'Q15. What is the overall goal of mastering Node.js & Server Fundamentals?',
  'Bypassing standard security checks and protocols in Node.js & Server Fundamentals.',
  'Legacy manual processing for Node.js & Server Fundamentals.',
  'To design, build, and maintain production-ready technology solutions.',
  'Hardcoding static binary files without backup in Node.js & Server Fundamentals.',
  'C',
  'Option C is correct. To design, build, and maintain production-ready technology solutions.'
);

-- Quick Learn 21: RESTful Web Services
INSERT INTO public.quick_learn_lessons (id, title, slug, branch, category, difficulty, estimated_minutes, is_recommended, fx_reward, short_description, content_markdown, is_published)
VALUES (
  '00000000-0000-4000-a000-000000000021',
  'RESTful Web Services',
  'restful-web-services',
  'CSE',
  'Backend',
  'Intermediate',
  3,
  TRUE,
  10,
  'Master RESTful Web Services fundamentals with quick reading and 15 practice MCQs on FEEDX.',
  '### Learning Text
RESTful Web Services is an essential concept in modern technology and engineering education. Understanding its core components enables effective problem-solving and application development.

### Key Points
- **Core Concepts**: Fundamentals of RESTful Web Services.
- **Best Practices**: Implementation standards.
- **Workflow**: Practical application and deployment.',
  TRUE
) ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title;

INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000021000001',
  '00000000-0000-4000-a000-000000000021',
  'Q1. What is the primary definition of RESTful Web Services?',
  'A core technology or standard designed for managing and executing RESTful Web Services processes.',
  'Legacy manual processing for RESTful Web Services.',
  'Bypassing standard security checks and protocols in RESTful Web Services.',
  'Hardcoding static binary files without backup in RESTful Web Services.',
  'A',
  'Option A is correct. A core technology or standard designed for managing and executing RESTful Web Services processes.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000021000002',
  '00000000-0000-4000-a000-000000000021',
  'Q2. Which key benefit is provided by RESTful Web Services?',
  'Legacy manual processing for RESTful Web Services.',
  'Improved efficiency, scalability, modularity, and operational reliability.',
  'Bypassing standard security checks and protocols in RESTful Web Services.',
  'Hardcoding static binary files without backup in RESTful Web Services.',
  'B',
  'Option B is correct. Improved efficiency, scalability, modularity, and operational reliability.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000021000003',
  '00000000-0000-4000-a000-000000000021',
  'Q3. What is a fundamental requirement when implementing RESTful Web Services?',
  'Proper system configuration, security protocols, and integration standards.',
  'Legacy manual processing for RESTful Web Services.',
  'Bypassing standard security checks and protocols in RESTful Web Services.',
  'Hardcoding static binary files without backup in RESTful Web Services.',
  'A',
  'Option A is correct. Proper system configuration, security protocols, and integration standards.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000021000004',
  '00000000-0000-4000-a000-000000000021',
  'Q4. How does RESTful Web Services handle data and execution states?',
  'Legacy manual processing for RESTful Web Services.',
  'By utilizing structured schemas, indexes, and optimized execution pipelines.',
  'Bypassing standard security checks and protocols in RESTful Web Services.',
  'Hardcoding static binary files without backup in RESTful Web Services.',
  'B',
  'Option B is correct. By utilizing structured schemas, indexes, and optimized execution pipelines.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000021000005',
  '00000000-0000-4000-a000-000000000021',
  'Q5. What is a recommended best practice when deploying RESTful Web Services?',
  'Legacy manual processing for RESTful Web Services.',
  'Conducting regular automated testing, logging, and monitoring checks.',
  'Bypassing standard security checks and protocols in RESTful Web Services.',
  'Hardcoding static binary files without backup in RESTful Web Services.',
  'B',
  'Option B is correct. Conducting regular automated testing, logging, and monitoring checks.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000021000006',
  '00000000-0000-4000-a000-000000000021',
  'Q6. Which layer or component plays a vital role in RESTful Web Services?',
  'Hardcoding static binary files without backup in RESTful Web Services.',
  'Legacy manual processing for RESTful Web Services.',
  'Bypassing standard security checks and protocols in RESTful Web Services.',
  'The central execution handler and protocol controller.',
  'D',
  'Option D is correct. The central execution handler and protocol controller.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000021000007',
  '00000000-0000-4000-a000-000000000021',
  'Q7. What is a common bottleneck or challenge in RESTful Web Services?',
  'Managing system state synchronization and resource contention under heavy load.',
  'Legacy manual processing for RESTful Web Services.',
  'Bypassing standard security checks and protocols in RESTful Web Services.',
  'Hardcoding static binary files without backup in RESTful Web Services.',
  'A',
  'Option A is correct. Managing system state synchronization and resource contention under heavy load.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000021000008',
  '00000000-0000-4000-a000-000000000021',
  'Q8. How is security typically enforced within RESTful Web Services?',
  'Legacy manual processing for RESTful Web Services.',
  'Through strong authentication, access control permissions, and data encryption.',
  'Bypassing standard security checks and protocols in RESTful Web Services.',
  'Hardcoding static binary files without backup in RESTful Web Services.',
  'B',
  'Option B is correct. Through strong authentication, access control permissions, and data encryption.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000021000009',
  '00000000-0000-4000-a000-000000000021',
  'Q9. Which metric is critical for measuring the performance of RESTful Web Services?',
  'Bypassing standard security checks and protocols in RESTful Web Services.',
  'Legacy manual processing for RESTful Web Services.',
  'Response latency, throughput, resource utilization, and error rates.',
  'Hardcoding static binary files without backup in RESTful Web Services.',
  'C',
  'Option C is correct. Response latency, throughput, resource utilization, and error rates.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000021000010',
  '00000000-0000-4000-a000-000000000021',
  'Q10. What is the role of versioning in RESTful Web Services?',
  'Bypassing standard security checks and protocols in RESTful Web Services.',
  'Legacy manual processing for RESTful Web Services.',
  'To support safe updates, maintain backward compatibility, and enable rollbacks.',
  'Hardcoding static binary files without backup in RESTful Web Services.',
  'C',
  'Option C is correct. To support safe updates, maintain backward compatibility, and enable rollbacks.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000021000011',
  '00000000-0000-4000-a000-000000000021',
  'Q11. In what scenario is RESTful Web Services most effectively applied?',
  'Hardcoding static binary files without backup in RESTful Web Services.',
  'Legacy manual processing for RESTful Web Services.',
  'Bypassing standard security checks and protocols in RESTful Web Services.',
  'In modern scalable enterprise systems requiring structured workflows and reliability.',
  'D',
  'Option D is correct. In modern scalable enterprise systems requiring structured workflows and reliability.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000021000012',
  '00000000-0000-4000-a000-000000000021',
  'Q12. Which tool or interface is standard for interacting with RESTful Web Services?',
  'Hardcoding static binary files without backup in RESTful Web Services.',
  'Legacy manual processing for RESTful Web Services.',
  'Bypassing standard security checks and protocols in RESTful Web Services.',
  'Dedicated command line tools, SDK APIs, and management dashboards.',
  'D',
  'Option D is correct. Dedicated command line tools, SDK APIs, and management dashboards.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000021000013',
  '00000000-0000-4000-a000-000000000021',
  'Q13. What is the initial phase when developing with RESTful Web Services?',
  'Legacy manual processing for RESTful Web Services.',
  'Defining requirements, setting up the development environment, and configuring dependencies.',
  'Bypassing standard security checks and protocols in RESTful Web Services.',
  'Hardcoding static binary files without backup in RESTful Web Services.',
  'B',
  'Option B is correct. Defining requirements, setting up the development environment, and configuring dependencies.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000021000014',
  '00000000-0000-4000-a000-000000000021',
  'Q14. Which debugging technique is recommended for RESTful Web Services?',
  'Hardcoding static binary files without backup in RESTful Web Services.',
  'Legacy manual processing for RESTful Web Services.',
  'Bypassing standard security checks and protocols in RESTful Web Services.',
  'Inspecting log trace files, using debugger tools, and verifying stack traces.',
  'D',
  'Option D is correct. Inspecting log trace files, using debugger tools, and verifying stack traces.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000021000015',
  '00000000-0000-4000-a000-000000000021',
  'Q15. What is the overall goal of mastering RESTful Web Services?',
  'To design, build, and maintain production-ready technology solutions.',
  'Legacy manual processing for RESTful Web Services.',
  'Bypassing standard security checks and protocols in RESTful Web Services.',
  'Hardcoding static binary files without backup in RESTful Web Services.',
  'A',
  'Option A is correct. To design, build, and maintain production-ready technology solutions.'
);

-- Quick Learn 22: Docker & Containerization
INSERT INTO public.quick_learn_lessons (id, title, slug, branch, category, difficulty, estimated_minutes, is_recommended, fx_reward, short_description, content_markdown, is_published)
VALUES (
  '00000000-0000-4000-a000-000000000022',
  'Docker & Containerization',
  'docker-containerization',
  'CSE',
  'DevOps',
  'Intermediate',
  3,
  TRUE,
  10,
  'Master Docker & Containerization fundamentals with quick reading and 15 practice MCQs on FEEDX.',
  '### Learning Text
Docker & Containerization is an essential concept in modern technology and engineering education. Understanding its core components enables effective problem-solving and application development.

### Key Points
- **Core Concepts**: Fundamentals of Docker & Containerization.
- **Best Practices**: Implementation standards.
- **Workflow**: Practical application and deployment.',
  TRUE
) ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title;

INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000022000001',
  '00000000-0000-4000-a000-000000000022',
  'Q1. What is the primary definition of Docker & Containerization?',
  'Hardcoding static binary files without backup in Docker & Containerization.',
  'Legacy manual processing for Docker & Containerization.',
  'Bypassing standard security checks and protocols in Docker & Containerization.',
  'A core technology or standard designed for managing and executing Docker & Containerization processes.',
  'D',
  'Option D is correct. A core technology or standard designed for managing and executing Docker & Containerization processes.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000022000002',
  '00000000-0000-4000-a000-000000000022',
  'Q2. Which key benefit is provided by Docker & Containerization?',
  'Improved efficiency, scalability, modularity, and operational reliability.',
  'Legacy manual processing for Docker & Containerization.',
  'Bypassing standard security checks and protocols in Docker & Containerization.',
  'Hardcoding static binary files without backup in Docker & Containerization.',
  'A',
  'Option A is correct. Improved efficiency, scalability, modularity, and operational reliability.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000022000003',
  '00000000-0000-4000-a000-000000000022',
  'Q3. What is a fundamental requirement when implementing Docker & Containerization?',
  'Proper system configuration, security protocols, and integration standards.',
  'Legacy manual processing for Docker & Containerization.',
  'Bypassing standard security checks and protocols in Docker & Containerization.',
  'Hardcoding static binary files without backup in Docker & Containerization.',
  'A',
  'Option A is correct. Proper system configuration, security protocols, and integration standards.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000022000004',
  '00000000-0000-4000-a000-000000000022',
  'Q4. How does Docker & Containerization handle data and execution states?',
  'Bypassing standard security checks and protocols in Docker & Containerization.',
  'Legacy manual processing for Docker & Containerization.',
  'By utilizing structured schemas, indexes, and optimized execution pipelines.',
  'Hardcoding static binary files without backup in Docker & Containerization.',
  'C',
  'Option C is correct. By utilizing structured schemas, indexes, and optimized execution pipelines.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000022000005',
  '00000000-0000-4000-a000-000000000022',
  'Q5. What is a recommended best practice when deploying Docker & Containerization?',
  'Hardcoding static binary files without backup in Docker & Containerization.',
  'Legacy manual processing for Docker & Containerization.',
  'Bypassing standard security checks and protocols in Docker & Containerization.',
  'Conducting regular automated testing, logging, and monitoring checks.',
  'D',
  'Option D is correct. Conducting regular automated testing, logging, and monitoring checks.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000022000006',
  '00000000-0000-4000-a000-000000000022',
  'Q6. Which layer or component plays a vital role in Docker & Containerization?',
  'Hardcoding static binary files without backup in Docker & Containerization.',
  'Legacy manual processing for Docker & Containerization.',
  'Bypassing standard security checks and protocols in Docker & Containerization.',
  'The central execution handler and protocol controller.',
  'D',
  'Option D is correct. The central execution handler and protocol controller.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000022000007',
  '00000000-0000-4000-a000-000000000022',
  'Q7. What is a common bottleneck or challenge in Docker & Containerization?',
  'Bypassing standard security checks and protocols in Docker & Containerization.',
  'Legacy manual processing for Docker & Containerization.',
  'Managing system state synchronization and resource contention under heavy load.',
  'Hardcoding static binary files without backup in Docker & Containerization.',
  'C',
  'Option C is correct. Managing system state synchronization and resource contention under heavy load.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000022000008',
  '00000000-0000-4000-a000-000000000022',
  'Q8. How is security typically enforced within Docker & Containerization?',
  'Through strong authentication, access control permissions, and data encryption.',
  'Legacy manual processing for Docker & Containerization.',
  'Bypassing standard security checks and protocols in Docker & Containerization.',
  'Hardcoding static binary files without backup in Docker & Containerization.',
  'A',
  'Option A is correct. Through strong authentication, access control permissions, and data encryption.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000022000009',
  '00000000-0000-4000-a000-000000000022',
  'Q9. Which metric is critical for measuring the performance of Docker & Containerization?',
  'Hardcoding static binary files without backup in Docker & Containerization.',
  'Legacy manual processing for Docker & Containerization.',
  'Bypassing standard security checks and protocols in Docker & Containerization.',
  'Response latency, throughput, resource utilization, and error rates.',
  'D',
  'Option D is correct. Response latency, throughput, resource utilization, and error rates.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000022000010',
  '00000000-0000-4000-a000-000000000022',
  'Q10. What is the role of versioning in Docker & Containerization?',
  'Legacy manual processing for Docker & Containerization.',
  'To support safe updates, maintain backward compatibility, and enable rollbacks.',
  'Bypassing standard security checks and protocols in Docker & Containerization.',
  'Hardcoding static binary files without backup in Docker & Containerization.',
  'B',
  'Option B is correct. To support safe updates, maintain backward compatibility, and enable rollbacks.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000022000011',
  '00000000-0000-4000-a000-000000000022',
  'Q11. In what scenario is Docker & Containerization most effectively applied?',
  'In modern scalable enterprise systems requiring structured workflows and reliability.',
  'Legacy manual processing for Docker & Containerization.',
  'Bypassing standard security checks and protocols in Docker & Containerization.',
  'Hardcoding static binary files without backup in Docker & Containerization.',
  'A',
  'Option A is correct. In modern scalable enterprise systems requiring structured workflows and reliability.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000022000012',
  '00000000-0000-4000-a000-000000000022',
  'Q12. Which tool or interface is standard for interacting with Docker & Containerization?',
  'Bypassing standard security checks and protocols in Docker & Containerization.',
  'Legacy manual processing for Docker & Containerization.',
  'Dedicated command line tools, SDK APIs, and management dashboards.',
  'Hardcoding static binary files without backup in Docker & Containerization.',
  'C',
  'Option C is correct. Dedicated command line tools, SDK APIs, and management dashboards.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000022000013',
  '00000000-0000-4000-a000-000000000022',
  'Q13. What is the initial phase when developing with Docker & Containerization?',
  'Defining requirements, setting up the development environment, and configuring dependencies.',
  'Legacy manual processing for Docker & Containerization.',
  'Bypassing standard security checks and protocols in Docker & Containerization.',
  'Hardcoding static binary files without backup in Docker & Containerization.',
  'A',
  'Option A is correct. Defining requirements, setting up the development environment, and configuring dependencies.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000022000014',
  '00000000-0000-4000-a000-000000000022',
  'Q14. Which debugging technique is recommended for Docker & Containerization?',
  'Bypassing standard security checks and protocols in Docker & Containerization.',
  'Legacy manual processing for Docker & Containerization.',
  'Inspecting log trace files, using debugger tools, and verifying stack traces.',
  'Hardcoding static binary files without backup in Docker & Containerization.',
  'C',
  'Option C is correct. Inspecting log trace files, using debugger tools, and verifying stack traces.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000022000015',
  '00000000-0000-4000-a000-000000000022',
  'Q15. What is the overall goal of mastering Docker & Containerization?',
  'Bypassing standard security checks and protocols in Docker & Containerization.',
  'Legacy manual processing for Docker & Containerization.',
  'To design, build, and maintain production-ready technology solutions.',
  'Hardcoding static binary files without backup in Docker & Containerization.',
  'C',
  'Option C is correct. To design, build, and maintain production-ready technology solutions.'
);

-- Quick Learn 23: Kubernetes & Orchestration
INSERT INTO public.quick_learn_lessons (id, title, slug, branch, category, difficulty, estimated_minutes, is_recommended, fx_reward, short_description, content_markdown, is_published)
VALUES (
  '00000000-0000-4000-a000-000000000023',
  'Kubernetes & Orchestration',
  'kubernetes-orchestration',
  'CSE',
  'DevOps',
  'Advanced',
  3,
  TRUE,
  10,
  'Master Kubernetes & Orchestration fundamentals with quick reading and 15 practice MCQs on FEEDX.',
  '### Learning Text
Kubernetes & Orchestration is an essential concept in modern technology and engineering education. Understanding its core components enables effective problem-solving and application development.

### Key Points
- **Core Concepts**: Fundamentals of Kubernetes & Orchestration.
- **Best Practices**: Implementation standards.
- **Workflow**: Practical application and deployment.',
  TRUE
) ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title;

INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000023000001',
  '00000000-0000-4000-a000-000000000023',
  'Q1. What is the primary definition of Kubernetes & Orchestration?',
  'A core technology or standard designed for managing and executing Kubernetes & Orchestration processes.',
  'Legacy manual processing for Kubernetes & Orchestration.',
  'Bypassing standard security checks and protocols in Kubernetes & Orchestration.',
  'Hardcoding static binary files without backup in Kubernetes & Orchestration.',
  'A',
  'Option A is correct. A core technology or standard designed for managing and executing Kubernetes & Orchestration processes.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000023000002',
  '00000000-0000-4000-a000-000000000023',
  'Q2. Which key benefit is provided by Kubernetes & Orchestration?',
  'Legacy manual processing for Kubernetes & Orchestration.',
  'Improved efficiency, scalability, modularity, and operational reliability.',
  'Bypassing standard security checks and protocols in Kubernetes & Orchestration.',
  'Hardcoding static binary files without backup in Kubernetes & Orchestration.',
  'B',
  'Option B is correct. Improved efficiency, scalability, modularity, and operational reliability.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000023000003',
  '00000000-0000-4000-a000-000000000023',
  'Q3. What is a fundamental requirement when implementing Kubernetes & Orchestration?',
  'Proper system configuration, security protocols, and integration standards.',
  'Legacy manual processing for Kubernetes & Orchestration.',
  'Bypassing standard security checks and protocols in Kubernetes & Orchestration.',
  'Hardcoding static binary files without backup in Kubernetes & Orchestration.',
  'A',
  'Option A is correct. Proper system configuration, security protocols, and integration standards.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000023000004',
  '00000000-0000-4000-a000-000000000023',
  'Q4. How does Kubernetes & Orchestration handle data and execution states?',
  'Hardcoding static binary files without backup in Kubernetes & Orchestration.',
  'Legacy manual processing for Kubernetes & Orchestration.',
  'Bypassing standard security checks and protocols in Kubernetes & Orchestration.',
  'By utilizing structured schemas, indexes, and optimized execution pipelines.',
  'D',
  'Option D is correct. By utilizing structured schemas, indexes, and optimized execution pipelines.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000023000005',
  '00000000-0000-4000-a000-000000000023',
  'Q5. What is a recommended best practice when deploying Kubernetes & Orchestration?',
  'Hardcoding static binary files without backup in Kubernetes & Orchestration.',
  'Legacy manual processing for Kubernetes & Orchestration.',
  'Bypassing standard security checks and protocols in Kubernetes & Orchestration.',
  'Conducting regular automated testing, logging, and monitoring checks.',
  'D',
  'Option D is correct. Conducting regular automated testing, logging, and monitoring checks.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000023000006',
  '00000000-0000-4000-a000-000000000023',
  'Q6. Which layer or component plays a vital role in Kubernetes & Orchestration?',
  'The central execution handler and protocol controller.',
  'Legacy manual processing for Kubernetes & Orchestration.',
  'Bypassing standard security checks and protocols in Kubernetes & Orchestration.',
  'Hardcoding static binary files without backup in Kubernetes & Orchestration.',
  'A',
  'Option A is correct. The central execution handler and protocol controller.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000023000007',
  '00000000-0000-4000-a000-000000000023',
  'Q7. What is a common bottleneck or challenge in Kubernetes & Orchestration?',
  'Legacy manual processing for Kubernetes & Orchestration.',
  'Managing system state synchronization and resource contention under heavy load.',
  'Bypassing standard security checks and protocols in Kubernetes & Orchestration.',
  'Hardcoding static binary files without backup in Kubernetes & Orchestration.',
  'B',
  'Option B is correct. Managing system state synchronization and resource contention under heavy load.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000023000008',
  '00000000-0000-4000-a000-000000000023',
  'Q8. How is security typically enforced within Kubernetes & Orchestration?',
  'Hardcoding static binary files without backup in Kubernetes & Orchestration.',
  'Legacy manual processing for Kubernetes & Orchestration.',
  'Bypassing standard security checks and protocols in Kubernetes & Orchestration.',
  'Through strong authentication, access control permissions, and data encryption.',
  'D',
  'Option D is correct. Through strong authentication, access control permissions, and data encryption.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000023000009',
  '00000000-0000-4000-a000-000000000023',
  'Q9. Which metric is critical for measuring the performance of Kubernetes & Orchestration?',
  'Hardcoding static binary files without backup in Kubernetes & Orchestration.',
  'Legacy manual processing for Kubernetes & Orchestration.',
  'Bypassing standard security checks and protocols in Kubernetes & Orchestration.',
  'Response latency, throughput, resource utilization, and error rates.',
  'D',
  'Option D is correct. Response latency, throughput, resource utilization, and error rates.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000023000010',
  '00000000-0000-4000-a000-000000000023',
  'Q10. What is the role of versioning in Kubernetes & Orchestration?',
  'Hardcoding static binary files without backup in Kubernetes & Orchestration.',
  'Legacy manual processing for Kubernetes & Orchestration.',
  'Bypassing standard security checks and protocols in Kubernetes & Orchestration.',
  'To support safe updates, maintain backward compatibility, and enable rollbacks.',
  'D',
  'Option D is correct. To support safe updates, maintain backward compatibility, and enable rollbacks.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000023000011',
  '00000000-0000-4000-a000-000000000023',
  'Q11. In what scenario is Kubernetes & Orchestration most effectively applied?',
  'Legacy manual processing for Kubernetes & Orchestration.',
  'In modern scalable enterprise systems requiring structured workflows and reliability.',
  'Bypassing standard security checks and protocols in Kubernetes & Orchestration.',
  'Hardcoding static binary files without backup in Kubernetes & Orchestration.',
  'B',
  'Option B is correct. In modern scalable enterprise systems requiring structured workflows and reliability.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000023000012',
  '00000000-0000-4000-a000-000000000023',
  'Q12. Which tool or interface is standard for interacting with Kubernetes & Orchestration?',
  'Bypassing standard security checks and protocols in Kubernetes & Orchestration.',
  'Legacy manual processing for Kubernetes & Orchestration.',
  'Dedicated command line tools, SDK APIs, and management dashboards.',
  'Hardcoding static binary files without backup in Kubernetes & Orchestration.',
  'C',
  'Option C is correct. Dedicated command line tools, SDK APIs, and management dashboards.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000023000013',
  '00000000-0000-4000-a000-000000000023',
  'Q13. What is the initial phase when developing with Kubernetes & Orchestration?',
  'Hardcoding static binary files without backup in Kubernetes & Orchestration.',
  'Legacy manual processing for Kubernetes & Orchestration.',
  'Bypassing standard security checks and protocols in Kubernetes & Orchestration.',
  'Defining requirements, setting up the development environment, and configuring dependencies.',
  'D',
  'Option D is correct. Defining requirements, setting up the development environment, and configuring dependencies.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000023000014',
  '00000000-0000-4000-a000-000000000023',
  'Q14. Which debugging technique is recommended for Kubernetes & Orchestration?',
  'Inspecting log trace files, using debugger tools, and verifying stack traces.',
  'Legacy manual processing for Kubernetes & Orchestration.',
  'Bypassing standard security checks and protocols in Kubernetes & Orchestration.',
  'Hardcoding static binary files without backup in Kubernetes & Orchestration.',
  'A',
  'Option A is correct. Inspecting log trace files, using debugger tools, and verifying stack traces.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000023000015',
  '00000000-0000-4000-a000-000000000023',
  'Q15. What is the overall goal of mastering Kubernetes & Orchestration?',
  'Hardcoding static binary files without backup in Kubernetes & Orchestration.',
  'Legacy manual processing for Kubernetes & Orchestration.',
  'Bypassing standard security checks and protocols in Kubernetes & Orchestration.',
  'To design, build, and maintain production-ready technology solutions.',
  'D',
  'Option D is correct. To design, build, and maintain production-ready technology solutions.'
);

-- Quick Learn 24: Data Structures - Arrays & Lists
INSERT INTO public.quick_learn_lessons (id, title, slug, branch, category, difficulty, estimated_minutes, is_recommended, fx_reward, short_description, content_markdown, is_published)
VALUES (
  '00000000-0000-4000-a000-000000000024',
  'Data Structures - Arrays & Lists',
  'data-structures-arrays-lists',
  'CSE',
  'DSA',
  'Beginner',
  3,
  TRUE,
  10,
  'Master Data Structures - Arrays & Lists fundamentals with quick reading and 15 practice MCQs on FEEDX.',
  '### Learning Text
Data Structures - Arrays & Lists is an essential concept in modern technology and engineering education. Understanding its core components enables effective problem-solving and application development.

### Key Points
- **Core Concepts**: Fundamentals of Data Structures - Arrays & Lists.
- **Best Practices**: Implementation standards.
- **Workflow**: Practical application and deployment.',
  TRUE
) ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title;

INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000024000001',
  '00000000-0000-4000-a000-000000000024',
  'Q1. What is the primary definition of Data Structures - Arrays & Lists?',
  'Legacy manual processing for Data Structures - Arrays & Lists.',
  'A core technology or standard designed for managing and executing Data Structures - Arrays & Lists processes.',
  'Bypassing standard security checks and protocols in Data Structures - Arrays & Lists.',
  'Hardcoding static binary files without backup in Data Structures - Arrays & Lists.',
  'B',
  'Option B is correct. A core technology or standard designed for managing and executing Data Structures - Arrays & Lists processes.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000024000002',
  '00000000-0000-4000-a000-000000000024',
  'Q2. Which key benefit is provided by Data Structures - Arrays & Lists?',
  'Legacy manual processing for Data Structures - Arrays & Lists.',
  'Improved efficiency, scalability, modularity, and operational reliability.',
  'Bypassing standard security checks and protocols in Data Structures - Arrays & Lists.',
  'Hardcoding static binary files without backup in Data Structures - Arrays & Lists.',
  'B',
  'Option B is correct. Improved efficiency, scalability, modularity, and operational reliability.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000024000003',
  '00000000-0000-4000-a000-000000000024',
  'Q3. What is a fundamental requirement when implementing Data Structures - Arrays & Lists?',
  'Bypassing standard security checks and protocols in Data Structures - Arrays & Lists.',
  'Legacy manual processing for Data Structures - Arrays & Lists.',
  'Proper system configuration, security protocols, and integration standards.',
  'Hardcoding static binary files without backup in Data Structures - Arrays & Lists.',
  'C',
  'Option C is correct. Proper system configuration, security protocols, and integration standards.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000024000004',
  '00000000-0000-4000-a000-000000000024',
  'Q4. How does Data Structures - Arrays & Lists handle data and execution states?',
  'By utilizing structured schemas, indexes, and optimized execution pipelines.',
  'Legacy manual processing for Data Structures - Arrays & Lists.',
  'Bypassing standard security checks and protocols in Data Structures - Arrays & Lists.',
  'Hardcoding static binary files without backup in Data Structures - Arrays & Lists.',
  'A',
  'Option A is correct. By utilizing structured schemas, indexes, and optimized execution pipelines.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000024000005',
  '00000000-0000-4000-a000-000000000024',
  'Q5. What is a recommended best practice when deploying Data Structures - Arrays & Lists?',
  'Hardcoding static binary files without backup in Data Structures - Arrays & Lists.',
  'Legacy manual processing for Data Structures - Arrays & Lists.',
  'Bypassing standard security checks and protocols in Data Structures - Arrays & Lists.',
  'Conducting regular automated testing, logging, and monitoring checks.',
  'D',
  'Option D is correct. Conducting regular automated testing, logging, and monitoring checks.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000024000006',
  '00000000-0000-4000-a000-000000000024',
  'Q6. Which layer or component plays a vital role in Data Structures - Arrays & Lists?',
  'Legacy manual processing for Data Structures - Arrays & Lists.',
  'The central execution handler and protocol controller.',
  'Bypassing standard security checks and protocols in Data Structures - Arrays & Lists.',
  'Hardcoding static binary files without backup in Data Structures - Arrays & Lists.',
  'B',
  'Option B is correct. The central execution handler and protocol controller.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000024000007',
  '00000000-0000-4000-a000-000000000024',
  'Q7. What is a common bottleneck or challenge in Data Structures - Arrays & Lists?',
  'Bypassing standard security checks and protocols in Data Structures - Arrays & Lists.',
  'Legacy manual processing for Data Structures - Arrays & Lists.',
  'Managing system state synchronization and resource contention under heavy load.',
  'Hardcoding static binary files without backup in Data Structures - Arrays & Lists.',
  'C',
  'Option C is correct. Managing system state synchronization and resource contention under heavy load.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000024000008',
  '00000000-0000-4000-a000-000000000024',
  'Q8. How is security typically enforced within Data Structures - Arrays & Lists?',
  'Bypassing standard security checks and protocols in Data Structures - Arrays & Lists.',
  'Legacy manual processing for Data Structures - Arrays & Lists.',
  'Through strong authentication, access control permissions, and data encryption.',
  'Hardcoding static binary files without backup in Data Structures - Arrays & Lists.',
  'C',
  'Option C is correct. Through strong authentication, access control permissions, and data encryption.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000024000009',
  '00000000-0000-4000-a000-000000000024',
  'Q9. Which metric is critical for measuring the performance of Data Structures - Arrays & Lists?',
  'Response latency, throughput, resource utilization, and error rates.',
  'Legacy manual processing for Data Structures - Arrays & Lists.',
  'Bypassing standard security checks and protocols in Data Structures - Arrays & Lists.',
  'Hardcoding static binary files without backup in Data Structures - Arrays & Lists.',
  'A',
  'Option A is correct. Response latency, throughput, resource utilization, and error rates.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000024000010',
  '00000000-0000-4000-a000-000000000024',
  'Q10. What is the role of versioning in Data Structures - Arrays & Lists?',
  'Hardcoding static binary files without backup in Data Structures - Arrays & Lists.',
  'Legacy manual processing for Data Structures - Arrays & Lists.',
  'Bypassing standard security checks and protocols in Data Structures - Arrays & Lists.',
  'To support safe updates, maintain backward compatibility, and enable rollbacks.',
  'D',
  'Option D is correct. To support safe updates, maintain backward compatibility, and enable rollbacks.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000024000011',
  '00000000-0000-4000-a000-000000000024',
  'Q11. In what scenario is Data Structures - Arrays & Lists most effectively applied?',
  'Hardcoding static binary files without backup in Data Structures - Arrays & Lists.',
  'Legacy manual processing for Data Structures - Arrays & Lists.',
  'Bypassing standard security checks and protocols in Data Structures - Arrays & Lists.',
  'In modern scalable enterprise systems requiring structured workflows and reliability.',
  'D',
  'Option D is correct. In modern scalable enterprise systems requiring structured workflows and reliability.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000024000012',
  '00000000-0000-4000-a000-000000000024',
  'Q12. Which tool or interface is standard for interacting with Data Structures - Arrays & Lists?',
  'Hardcoding static binary files without backup in Data Structures - Arrays & Lists.',
  'Legacy manual processing for Data Structures - Arrays & Lists.',
  'Bypassing standard security checks and protocols in Data Structures - Arrays & Lists.',
  'Dedicated command line tools, SDK APIs, and management dashboards.',
  'D',
  'Option D is correct. Dedicated command line tools, SDK APIs, and management dashboards.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000024000013',
  '00000000-0000-4000-a000-000000000024',
  'Q13. What is the initial phase when developing with Data Structures - Arrays & Lists?',
  'Defining requirements, setting up the development environment, and configuring dependencies.',
  'Legacy manual processing for Data Structures - Arrays & Lists.',
  'Bypassing standard security checks and protocols in Data Structures - Arrays & Lists.',
  'Hardcoding static binary files without backup in Data Structures - Arrays & Lists.',
  'A',
  'Option A is correct. Defining requirements, setting up the development environment, and configuring dependencies.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000024000014',
  '00000000-0000-4000-a000-000000000024',
  'Q14. Which debugging technique is recommended for Data Structures - Arrays & Lists?',
  'Legacy manual processing for Data Structures - Arrays & Lists.',
  'Inspecting log trace files, using debugger tools, and verifying stack traces.',
  'Bypassing standard security checks and protocols in Data Structures - Arrays & Lists.',
  'Hardcoding static binary files without backup in Data Structures - Arrays & Lists.',
  'B',
  'Option B is correct. Inspecting log trace files, using debugger tools, and verifying stack traces.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000024000015',
  '00000000-0000-4000-a000-000000000024',
  'Q15. What is the overall goal of mastering Data Structures - Arrays & Lists?',
  'Legacy manual processing for Data Structures - Arrays & Lists.',
  'To design, build, and maintain production-ready technology solutions.',
  'Bypassing standard security checks and protocols in Data Structures - Arrays & Lists.',
  'Hardcoding static binary files without backup in Data Structures - Arrays & Lists.',
  'B',
  'Option B is correct. To design, build, and maintain production-ready technology solutions.'
);

-- Quick Learn 25: Data Structures - Stacks & Queues
INSERT INTO public.quick_learn_lessons (id, title, slug, branch, category, difficulty, estimated_minutes, is_recommended, fx_reward, short_description, content_markdown, is_published)
VALUES (
  '00000000-0000-4000-a000-000000000025',
  'Data Structures - Stacks & Queues',
  'data-structures-stacks-queues',
  'CSE',
  'DSA',
  'Intermediate',
  3,
  TRUE,
  10,
  'Master Data Structures - Stacks & Queues fundamentals with quick reading and 15 practice MCQs on FEEDX.',
  '### Learning Text
Data Structures - Stacks & Queues is an essential concept in modern technology and engineering education. Understanding its core components enables effective problem-solving and application development.

### Key Points
- **Core Concepts**: Fundamentals of Data Structures - Stacks & Queues.
- **Best Practices**: Implementation standards.
- **Workflow**: Practical application and deployment.',
  TRUE
) ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title;

INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000025000001',
  '00000000-0000-4000-a000-000000000025',
  'Q1. What is the primary definition of Data Structures - Stacks & Queues?',
  'Legacy manual processing for Data Structures - Stacks & Queues.',
  'A core technology or standard designed for managing and executing Data Structures - Stacks & Queues processes.',
  'Bypassing standard security checks and protocols in Data Structures - Stacks & Queues.',
  'Hardcoding static binary files without backup in Data Structures - Stacks & Queues.',
  'B',
  'Option B is correct. A core technology or standard designed for managing and executing Data Structures - Stacks & Queues processes.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000025000002',
  '00000000-0000-4000-a000-000000000025',
  'Q2. Which key benefit is provided by Data Structures - Stacks & Queues?',
  'Bypassing standard security checks and protocols in Data Structures - Stacks & Queues.',
  'Legacy manual processing for Data Structures - Stacks & Queues.',
  'Improved efficiency, scalability, modularity, and operational reliability.',
  'Hardcoding static binary files without backup in Data Structures - Stacks & Queues.',
  'C',
  'Option C is correct. Improved efficiency, scalability, modularity, and operational reliability.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000025000003',
  '00000000-0000-4000-a000-000000000025',
  'Q3. What is a fundamental requirement when implementing Data Structures - Stacks & Queues?',
  'Hardcoding static binary files without backup in Data Structures - Stacks & Queues.',
  'Legacy manual processing for Data Structures - Stacks & Queues.',
  'Bypassing standard security checks and protocols in Data Structures - Stacks & Queues.',
  'Proper system configuration, security protocols, and integration standards.',
  'D',
  'Option D is correct. Proper system configuration, security protocols, and integration standards.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000025000004',
  '00000000-0000-4000-a000-000000000025',
  'Q4. How does Data Structures - Stacks & Queues handle data and execution states?',
  'Bypassing standard security checks and protocols in Data Structures - Stacks & Queues.',
  'Legacy manual processing for Data Structures - Stacks & Queues.',
  'By utilizing structured schemas, indexes, and optimized execution pipelines.',
  'Hardcoding static binary files without backup in Data Structures - Stacks & Queues.',
  'C',
  'Option C is correct. By utilizing structured schemas, indexes, and optimized execution pipelines.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000025000005',
  '00000000-0000-4000-a000-000000000025',
  'Q5. What is a recommended best practice when deploying Data Structures - Stacks & Queues?',
  'Bypassing standard security checks and protocols in Data Structures - Stacks & Queues.',
  'Legacy manual processing for Data Structures - Stacks & Queues.',
  'Conducting regular automated testing, logging, and monitoring checks.',
  'Hardcoding static binary files without backup in Data Structures - Stacks & Queues.',
  'C',
  'Option C is correct. Conducting regular automated testing, logging, and monitoring checks.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000025000006',
  '00000000-0000-4000-a000-000000000025',
  'Q6. Which layer or component plays a vital role in Data Structures - Stacks & Queues?',
  'Legacy manual processing for Data Structures - Stacks & Queues.',
  'The central execution handler and protocol controller.',
  'Bypassing standard security checks and protocols in Data Structures - Stacks & Queues.',
  'Hardcoding static binary files without backup in Data Structures - Stacks & Queues.',
  'B',
  'Option B is correct. The central execution handler and protocol controller.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000025000007',
  '00000000-0000-4000-a000-000000000025',
  'Q7. What is a common bottleneck or challenge in Data Structures - Stacks & Queues?',
  'Legacy manual processing for Data Structures - Stacks & Queues.',
  'Managing system state synchronization and resource contention under heavy load.',
  'Bypassing standard security checks and protocols in Data Structures - Stacks & Queues.',
  'Hardcoding static binary files without backup in Data Structures - Stacks & Queues.',
  'B',
  'Option B is correct. Managing system state synchronization and resource contention under heavy load.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000025000008',
  '00000000-0000-4000-a000-000000000025',
  'Q8. How is security typically enforced within Data Structures - Stacks & Queues?',
  'Bypassing standard security checks and protocols in Data Structures - Stacks & Queues.',
  'Legacy manual processing for Data Structures - Stacks & Queues.',
  'Through strong authentication, access control permissions, and data encryption.',
  'Hardcoding static binary files without backup in Data Structures - Stacks & Queues.',
  'C',
  'Option C is correct. Through strong authentication, access control permissions, and data encryption.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000025000009',
  '00000000-0000-4000-a000-000000000025',
  'Q9. Which metric is critical for measuring the performance of Data Structures - Stacks & Queues?',
  'Response latency, throughput, resource utilization, and error rates.',
  'Legacy manual processing for Data Structures - Stacks & Queues.',
  'Bypassing standard security checks and protocols in Data Structures - Stacks & Queues.',
  'Hardcoding static binary files without backup in Data Structures - Stacks & Queues.',
  'A',
  'Option A is correct. Response latency, throughput, resource utilization, and error rates.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000025000010',
  '00000000-0000-4000-a000-000000000025',
  'Q10. What is the role of versioning in Data Structures - Stacks & Queues?',
  'To support safe updates, maintain backward compatibility, and enable rollbacks.',
  'Legacy manual processing for Data Structures - Stacks & Queues.',
  'Bypassing standard security checks and protocols in Data Structures - Stacks & Queues.',
  'Hardcoding static binary files without backup in Data Structures - Stacks & Queues.',
  'A',
  'Option A is correct. To support safe updates, maintain backward compatibility, and enable rollbacks.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000025000011',
  '00000000-0000-4000-a000-000000000025',
  'Q11. In what scenario is Data Structures - Stacks & Queues most effectively applied?',
  'Hardcoding static binary files without backup in Data Structures - Stacks & Queues.',
  'Legacy manual processing for Data Structures - Stacks & Queues.',
  'Bypassing standard security checks and protocols in Data Structures - Stacks & Queues.',
  'In modern scalable enterprise systems requiring structured workflows and reliability.',
  'D',
  'Option D is correct. In modern scalable enterprise systems requiring structured workflows and reliability.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000025000012',
  '00000000-0000-4000-a000-000000000025',
  'Q12. Which tool or interface is standard for interacting with Data Structures - Stacks & Queues?',
  'Legacy manual processing for Data Structures - Stacks & Queues.',
  'Dedicated command line tools, SDK APIs, and management dashboards.',
  'Bypassing standard security checks and protocols in Data Structures - Stacks & Queues.',
  'Hardcoding static binary files without backup in Data Structures - Stacks & Queues.',
  'B',
  'Option B is correct. Dedicated command line tools, SDK APIs, and management dashboards.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000025000013',
  '00000000-0000-4000-a000-000000000025',
  'Q13. What is the initial phase when developing with Data Structures - Stacks & Queues?',
  'Legacy manual processing for Data Structures - Stacks & Queues.',
  'Defining requirements, setting up the development environment, and configuring dependencies.',
  'Bypassing standard security checks and protocols in Data Structures - Stacks & Queues.',
  'Hardcoding static binary files without backup in Data Structures - Stacks & Queues.',
  'B',
  'Option B is correct. Defining requirements, setting up the development environment, and configuring dependencies.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000025000014',
  '00000000-0000-4000-a000-000000000025',
  'Q14. Which debugging technique is recommended for Data Structures - Stacks & Queues?',
  'Hardcoding static binary files without backup in Data Structures - Stacks & Queues.',
  'Legacy manual processing for Data Structures - Stacks & Queues.',
  'Bypassing standard security checks and protocols in Data Structures - Stacks & Queues.',
  'Inspecting log trace files, using debugger tools, and verifying stack traces.',
  'D',
  'Option D is correct. Inspecting log trace files, using debugger tools, and verifying stack traces.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000025000015',
  '00000000-0000-4000-a000-000000000025',
  'Q15. What is the overall goal of mastering Data Structures - Stacks & Queues?',
  'Bypassing standard security checks and protocols in Data Structures - Stacks & Queues.',
  'Legacy manual processing for Data Structures - Stacks & Queues.',
  'To design, build, and maintain production-ready technology solutions.',
  'Hardcoding static binary files without backup in Data Structures - Stacks & Queues.',
  'C',
  'Option C is correct. To design, build, and maintain production-ready technology solutions.'
);

-- Quick Learn 26: Algorithms - Sorting & Searching
INSERT INTO public.quick_learn_lessons (id, title, slug, branch, category, difficulty, estimated_minutes, is_recommended, fx_reward, short_description, content_markdown, is_published)
VALUES (
  '00000000-0000-4000-a000-000000000026',
  'Algorithms - Sorting & Searching',
  'algorithms-sorting-searching',
  'CSE',
  'DSA',
  'Intermediate',
  3,
  TRUE,
  10,
  'Master Algorithms - Sorting & Searching fundamentals with quick reading and 15 practice MCQs on FEEDX.',
  '### Learning Text
Algorithms - Sorting & Searching is an essential concept in modern technology and engineering education. Understanding its core components enables effective problem-solving and application development.

### Key Points
- **Core Concepts**: Fundamentals of Algorithms - Sorting & Searching.
- **Best Practices**: Implementation standards.
- **Workflow**: Practical application and deployment.',
  TRUE
) ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title;

INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000026000001',
  '00000000-0000-4000-a000-000000000026',
  'Q1. What is the primary definition of Algorithms - Sorting & Searching?',
  'Bypassing standard security checks and protocols in Algorithms - Sorting & Searching.',
  'Legacy manual processing for Algorithms - Sorting & Searching.',
  'A core technology or standard designed for managing and executing Algorithms - Sorting & Searching processes.',
  'Hardcoding static binary files without backup in Algorithms - Sorting & Searching.',
  'C',
  'Option C is correct. A core technology or standard designed for managing and executing Algorithms - Sorting & Searching processes.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000026000002',
  '00000000-0000-4000-a000-000000000026',
  'Q2. Which key benefit is provided by Algorithms - Sorting & Searching?',
  'Bypassing standard security checks and protocols in Algorithms - Sorting & Searching.',
  'Legacy manual processing for Algorithms - Sorting & Searching.',
  'Improved efficiency, scalability, modularity, and operational reliability.',
  'Hardcoding static binary files without backup in Algorithms - Sorting & Searching.',
  'C',
  'Option C is correct. Improved efficiency, scalability, modularity, and operational reliability.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000026000003',
  '00000000-0000-4000-a000-000000000026',
  'Q3. What is a fundamental requirement when implementing Algorithms - Sorting & Searching?',
  'Bypassing standard security checks and protocols in Algorithms - Sorting & Searching.',
  'Legacy manual processing for Algorithms - Sorting & Searching.',
  'Proper system configuration, security protocols, and integration standards.',
  'Hardcoding static binary files without backup in Algorithms - Sorting & Searching.',
  'C',
  'Option C is correct. Proper system configuration, security protocols, and integration standards.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000026000004',
  '00000000-0000-4000-a000-000000000026',
  'Q4. How does Algorithms - Sorting & Searching handle data and execution states?',
  'Legacy manual processing for Algorithms - Sorting & Searching.',
  'By utilizing structured schemas, indexes, and optimized execution pipelines.',
  'Bypassing standard security checks and protocols in Algorithms - Sorting & Searching.',
  'Hardcoding static binary files without backup in Algorithms - Sorting & Searching.',
  'B',
  'Option B is correct. By utilizing structured schemas, indexes, and optimized execution pipelines.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000026000005',
  '00000000-0000-4000-a000-000000000026',
  'Q5. What is a recommended best practice when deploying Algorithms - Sorting & Searching?',
  'Hardcoding static binary files without backup in Algorithms - Sorting & Searching.',
  'Legacy manual processing for Algorithms - Sorting & Searching.',
  'Bypassing standard security checks and protocols in Algorithms - Sorting & Searching.',
  'Conducting regular automated testing, logging, and monitoring checks.',
  'D',
  'Option D is correct. Conducting regular automated testing, logging, and monitoring checks.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000026000006',
  '00000000-0000-4000-a000-000000000026',
  'Q6. Which layer or component plays a vital role in Algorithms - Sorting & Searching?',
  'Hardcoding static binary files without backup in Algorithms - Sorting & Searching.',
  'Legacy manual processing for Algorithms - Sorting & Searching.',
  'Bypassing standard security checks and protocols in Algorithms - Sorting & Searching.',
  'The central execution handler and protocol controller.',
  'D',
  'Option D is correct. The central execution handler and protocol controller.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000026000007',
  '00000000-0000-4000-a000-000000000026',
  'Q7. What is a common bottleneck or challenge in Algorithms - Sorting & Searching?',
  'Bypassing standard security checks and protocols in Algorithms - Sorting & Searching.',
  'Legacy manual processing for Algorithms - Sorting & Searching.',
  'Managing system state synchronization and resource contention under heavy load.',
  'Hardcoding static binary files without backup in Algorithms - Sorting & Searching.',
  'C',
  'Option C is correct. Managing system state synchronization and resource contention under heavy load.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000026000008',
  '00000000-0000-4000-a000-000000000026',
  'Q8. How is security typically enforced within Algorithms - Sorting & Searching?',
  'Legacy manual processing for Algorithms - Sorting & Searching.',
  'Through strong authentication, access control permissions, and data encryption.',
  'Bypassing standard security checks and protocols in Algorithms - Sorting & Searching.',
  'Hardcoding static binary files without backup in Algorithms - Sorting & Searching.',
  'B',
  'Option B is correct. Through strong authentication, access control permissions, and data encryption.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000026000009',
  '00000000-0000-4000-a000-000000000026',
  'Q9. Which metric is critical for measuring the performance of Algorithms - Sorting & Searching?',
  'Bypassing standard security checks and protocols in Algorithms - Sorting & Searching.',
  'Legacy manual processing for Algorithms - Sorting & Searching.',
  'Response latency, throughput, resource utilization, and error rates.',
  'Hardcoding static binary files without backup in Algorithms - Sorting & Searching.',
  'C',
  'Option C is correct. Response latency, throughput, resource utilization, and error rates.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000026000010',
  '00000000-0000-4000-a000-000000000026',
  'Q10. What is the role of versioning in Algorithms - Sorting & Searching?',
  'Hardcoding static binary files without backup in Algorithms - Sorting & Searching.',
  'Legacy manual processing for Algorithms - Sorting & Searching.',
  'Bypassing standard security checks and protocols in Algorithms - Sorting & Searching.',
  'To support safe updates, maintain backward compatibility, and enable rollbacks.',
  'D',
  'Option D is correct. To support safe updates, maintain backward compatibility, and enable rollbacks.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000026000011',
  '00000000-0000-4000-a000-000000000026',
  'Q11. In what scenario is Algorithms - Sorting & Searching most effectively applied?',
  'Bypassing standard security checks and protocols in Algorithms - Sorting & Searching.',
  'Legacy manual processing for Algorithms - Sorting & Searching.',
  'In modern scalable enterprise systems requiring structured workflows and reliability.',
  'Hardcoding static binary files without backup in Algorithms - Sorting & Searching.',
  'C',
  'Option C is correct. In modern scalable enterprise systems requiring structured workflows and reliability.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000026000012',
  '00000000-0000-4000-a000-000000000026',
  'Q12. Which tool or interface is standard for interacting with Algorithms - Sorting & Searching?',
  'Bypassing standard security checks and protocols in Algorithms - Sorting & Searching.',
  'Legacy manual processing for Algorithms - Sorting & Searching.',
  'Dedicated command line tools, SDK APIs, and management dashboards.',
  'Hardcoding static binary files without backup in Algorithms - Sorting & Searching.',
  'C',
  'Option C is correct. Dedicated command line tools, SDK APIs, and management dashboards.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000026000013',
  '00000000-0000-4000-a000-000000000026',
  'Q13. What is the initial phase when developing with Algorithms - Sorting & Searching?',
  'Bypassing standard security checks and protocols in Algorithms - Sorting & Searching.',
  'Legacy manual processing for Algorithms - Sorting & Searching.',
  'Defining requirements, setting up the development environment, and configuring dependencies.',
  'Hardcoding static binary files without backup in Algorithms - Sorting & Searching.',
  'C',
  'Option C is correct. Defining requirements, setting up the development environment, and configuring dependencies.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000026000014',
  '00000000-0000-4000-a000-000000000026',
  'Q14. Which debugging technique is recommended for Algorithms - Sorting & Searching?',
  'Inspecting log trace files, using debugger tools, and verifying stack traces.',
  'Legacy manual processing for Algorithms - Sorting & Searching.',
  'Bypassing standard security checks and protocols in Algorithms - Sorting & Searching.',
  'Hardcoding static binary files without backup in Algorithms - Sorting & Searching.',
  'A',
  'Option A is correct. Inspecting log trace files, using debugger tools, and verifying stack traces.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000026000015',
  '00000000-0000-4000-a000-000000000026',
  'Q15. What is the overall goal of mastering Algorithms - Sorting & Searching?',
  'Legacy manual processing for Algorithms - Sorting & Searching.',
  'To design, build, and maintain production-ready technology solutions.',
  'Bypassing standard security checks and protocols in Algorithms - Sorting & Searching.',
  'Hardcoding static binary files without backup in Algorithms - Sorting & Searching.',
  'B',
  'Option B is correct. To design, build, and maintain production-ready technology solutions.'
);

-- Quick Learn 27: Object-Oriented Programming (OOP)
INSERT INTO public.quick_learn_lessons (id, title, slug, branch, category, difficulty, estimated_minutes, is_recommended, fx_reward, short_description, content_markdown, is_published)
VALUES (
  '00000000-0000-4000-a000-000000000027',
  'Object-Oriented Programming (OOP)',
  'object-oriented-programming-oop',
  'CSE',
  'Programming',
  'Intermediate',
  3,
  TRUE,
  10,
  'Master Object-Oriented Programming (OOP) fundamentals with quick reading and 15 practice MCQs on FEEDX.',
  '### Learning Text
Object-Oriented Programming (OOP) is an essential concept in modern technology and engineering education. Understanding its core components enables effective problem-solving and application development.

### Key Points
- **Core Concepts**: Fundamentals of Object-Oriented Programming (OOP).
- **Best Practices**: Implementation standards.
- **Workflow**: Practical application and deployment.',
  TRUE
) ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title;

INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000027000001',
  '00000000-0000-4000-a000-000000000027',
  'Q1. What is the primary definition of Object-Oriented Programming (OOP)?',
  'A core technology or standard designed for managing and executing Object-Oriented Programming (OOP) processes.',
  'Legacy manual processing for Object-Oriented Programming (OOP).',
  'Bypassing standard security checks and protocols in Object-Oriented Programming (OOP).',
  'Hardcoding static binary files without backup in Object-Oriented Programming (OOP).',
  'A',
  'Option A is correct. A core technology or standard designed for managing and executing Object-Oriented Programming (OOP) processes.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000027000002',
  '00000000-0000-4000-a000-000000000027',
  'Q2. Which key benefit is provided by Object-Oriented Programming (OOP)?',
  'Improved efficiency, scalability, modularity, and operational reliability.',
  'Legacy manual processing for Object-Oriented Programming (OOP).',
  'Bypassing standard security checks and protocols in Object-Oriented Programming (OOP).',
  'Hardcoding static binary files without backup in Object-Oriented Programming (OOP).',
  'A',
  'Option A is correct. Improved efficiency, scalability, modularity, and operational reliability.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000027000003',
  '00000000-0000-4000-a000-000000000027',
  'Q3. What is a fundamental requirement when implementing Object-Oriented Programming (OOP)?',
  'Legacy manual processing for Object-Oriented Programming (OOP).',
  'Proper system configuration, security protocols, and integration standards.',
  'Bypassing standard security checks and protocols in Object-Oriented Programming (OOP).',
  'Hardcoding static binary files without backup in Object-Oriented Programming (OOP).',
  'B',
  'Option B is correct. Proper system configuration, security protocols, and integration standards.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000027000004',
  '00000000-0000-4000-a000-000000000027',
  'Q4. How does Object-Oriented Programming (OOP) handle data and execution states?',
  'Bypassing standard security checks and protocols in Object-Oriented Programming (OOP).',
  'Legacy manual processing for Object-Oriented Programming (OOP).',
  'By utilizing structured schemas, indexes, and optimized execution pipelines.',
  'Hardcoding static binary files without backup in Object-Oriented Programming (OOP).',
  'C',
  'Option C is correct. By utilizing structured schemas, indexes, and optimized execution pipelines.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000027000005',
  '00000000-0000-4000-a000-000000000027',
  'Q5. What is a recommended best practice when deploying Object-Oriented Programming (OOP)?',
  'Conducting regular automated testing, logging, and monitoring checks.',
  'Legacy manual processing for Object-Oriented Programming (OOP).',
  'Bypassing standard security checks and protocols in Object-Oriented Programming (OOP).',
  'Hardcoding static binary files without backup in Object-Oriented Programming (OOP).',
  'A',
  'Option A is correct. Conducting regular automated testing, logging, and monitoring checks.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000027000006',
  '00000000-0000-4000-a000-000000000027',
  'Q6. Which layer or component plays a vital role in Object-Oriented Programming (OOP)?',
  'Legacy manual processing for Object-Oriented Programming (OOP).',
  'The central execution handler and protocol controller.',
  'Bypassing standard security checks and protocols in Object-Oriented Programming (OOP).',
  'Hardcoding static binary files without backup in Object-Oriented Programming (OOP).',
  'B',
  'Option B is correct. The central execution handler and protocol controller.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000027000007',
  '00000000-0000-4000-a000-000000000027',
  'Q7. What is a common bottleneck or challenge in Object-Oriented Programming (OOP)?',
  'Hardcoding static binary files without backup in Object-Oriented Programming (OOP).',
  'Legacy manual processing for Object-Oriented Programming (OOP).',
  'Bypassing standard security checks and protocols in Object-Oriented Programming (OOP).',
  'Managing system state synchronization and resource contention under heavy load.',
  'D',
  'Option D is correct. Managing system state synchronization and resource contention under heavy load.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000027000008',
  '00000000-0000-4000-a000-000000000027',
  'Q8. How is security typically enforced within Object-Oriented Programming (OOP)?',
  'Through strong authentication, access control permissions, and data encryption.',
  'Legacy manual processing for Object-Oriented Programming (OOP).',
  'Bypassing standard security checks and protocols in Object-Oriented Programming (OOP).',
  'Hardcoding static binary files without backup in Object-Oriented Programming (OOP).',
  'A',
  'Option A is correct. Through strong authentication, access control permissions, and data encryption.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000027000009',
  '00000000-0000-4000-a000-000000000027',
  'Q9. Which metric is critical for measuring the performance of Object-Oriented Programming (OOP)?',
  'Response latency, throughput, resource utilization, and error rates.',
  'Legacy manual processing for Object-Oriented Programming (OOP).',
  'Bypassing standard security checks and protocols in Object-Oriented Programming (OOP).',
  'Hardcoding static binary files without backup in Object-Oriented Programming (OOP).',
  'A',
  'Option A is correct. Response latency, throughput, resource utilization, and error rates.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000027000010',
  '00000000-0000-4000-a000-000000000027',
  'Q10. What is the role of versioning in Object-Oriented Programming (OOP)?',
  'Legacy manual processing for Object-Oriented Programming (OOP).',
  'To support safe updates, maintain backward compatibility, and enable rollbacks.',
  'Bypassing standard security checks and protocols in Object-Oriented Programming (OOP).',
  'Hardcoding static binary files without backup in Object-Oriented Programming (OOP).',
  'B',
  'Option B is correct. To support safe updates, maintain backward compatibility, and enable rollbacks.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000027000011',
  '00000000-0000-4000-a000-000000000027',
  'Q11. In what scenario is Object-Oriented Programming (OOP) most effectively applied?',
  'Bypassing standard security checks and protocols in Object-Oriented Programming (OOP).',
  'Legacy manual processing for Object-Oriented Programming (OOP).',
  'In modern scalable enterprise systems requiring structured workflows and reliability.',
  'Hardcoding static binary files without backup in Object-Oriented Programming (OOP).',
  'C',
  'Option C is correct. In modern scalable enterprise systems requiring structured workflows and reliability.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000027000012',
  '00000000-0000-4000-a000-000000000027',
  'Q12. Which tool or interface is standard for interacting with Object-Oriented Programming (OOP)?',
  'Dedicated command line tools, SDK APIs, and management dashboards.',
  'Legacy manual processing for Object-Oriented Programming (OOP).',
  'Bypassing standard security checks and protocols in Object-Oriented Programming (OOP).',
  'Hardcoding static binary files without backup in Object-Oriented Programming (OOP).',
  'A',
  'Option A is correct. Dedicated command line tools, SDK APIs, and management dashboards.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000027000013',
  '00000000-0000-4000-a000-000000000027',
  'Q13. What is the initial phase when developing with Object-Oriented Programming (OOP)?',
  'Bypassing standard security checks and protocols in Object-Oriented Programming (OOP).',
  'Legacy manual processing for Object-Oriented Programming (OOP).',
  'Defining requirements, setting up the development environment, and configuring dependencies.',
  'Hardcoding static binary files without backup in Object-Oriented Programming (OOP).',
  'C',
  'Option C is correct. Defining requirements, setting up the development environment, and configuring dependencies.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000027000014',
  '00000000-0000-4000-a000-000000000027',
  'Q14. Which debugging technique is recommended for Object-Oriented Programming (OOP)?',
  'Hardcoding static binary files without backup in Object-Oriented Programming (OOP).',
  'Legacy manual processing for Object-Oriented Programming (OOP).',
  'Bypassing standard security checks and protocols in Object-Oriented Programming (OOP).',
  'Inspecting log trace files, using debugger tools, and verifying stack traces.',
  'D',
  'Option D is correct. Inspecting log trace files, using debugger tools, and verifying stack traces.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000027000015',
  '00000000-0000-4000-a000-000000000027',
  'Q15. What is the overall goal of mastering Object-Oriented Programming (OOP)?',
  'Bypassing standard security checks and protocols in Object-Oriented Programming (OOP).',
  'Legacy manual processing for Object-Oriented Programming (OOP).',
  'To design, build, and maintain production-ready technology solutions.',
  'Hardcoding static binary files without backup in Object-Oriented Programming (OOP).',
  'C',
  'Option C is correct. To design, build, and maintain production-ready technology solutions.'
);

-- Quick Learn 28: Software Engineering Principles
INSERT INTO public.quick_learn_lessons (id, title, slug, branch, category, difficulty, estimated_minutes, is_recommended, fx_reward, short_description, content_markdown, is_published)
VALUES (
  '00000000-0000-4000-a000-000000000028',
  'Software Engineering Principles',
  'software-engineering-principles',
  'CSE',
  'Software Eng',
  'Intermediate',
  3,
  TRUE,
  10,
  'Master Software Engineering Principles fundamentals with quick reading and 15 practice MCQs on FEEDX.',
  '### Learning Text
Software Engineering Principles is an essential concept in modern technology and engineering education. Understanding its core components enables effective problem-solving and application development.

### Key Points
- **Core Concepts**: Fundamentals of Software Engineering Principles.
- **Best Practices**: Implementation standards.
- **Workflow**: Practical application and deployment.',
  TRUE
) ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title;

INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000028000001',
  '00000000-0000-4000-a000-000000000028',
  'Q1. What is the primary definition of Software Engineering Principles?',
  'Legacy manual processing for Software Engineering Principles.',
  'A core technology or standard designed for managing and executing Software Engineering Principles processes.',
  'Bypassing standard security checks and protocols in Software Engineering Principles.',
  'Hardcoding static binary files without backup in Software Engineering Principles.',
  'B',
  'Option B is correct. A core technology or standard designed for managing and executing Software Engineering Principles processes.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000028000002',
  '00000000-0000-4000-a000-000000000028',
  'Q2. Which key benefit is provided by Software Engineering Principles?',
  'Improved efficiency, scalability, modularity, and operational reliability.',
  'Legacy manual processing for Software Engineering Principles.',
  'Bypassing standard security checks and protocols in Software Engineering Principles.',
  'Hardcoding static binary files without backup in Software Engineering Principles.',
  'A',
  'Option A is correct. Improved efficiency, scalability, modularity, and operational reliability.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000028000003',
  '00000000-0000-4000-a000-000000000028',
  'Q3. What is a fundamental requirement when implementing Software Engineering Principles?',
  'Legacy manual processing for Software Engineering Principles.',
  'Proper system configuration, security protocols, and integration standards.',
  'Bypassing standard security checks and protocols in Software Engineering Principles.',
  'Hardcoding static binary files without backup in Software Engineering Principles.',
  'B',
  'Option B is correct. Proper system configuration, security protocols, and integration standards.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000028000004',
  '00000000-0000-4000-a000-000000000028',
  'Q4. How does Software Engineering Principles handle data and execution states?',
  'Bypassing standard security checks and protocols in Software Engineering Principles.',
  'Legacy manual processing for Software Engineering Principles.',
  'By utilizing structured schemas, indexes, and optimized execution pipelines.',
  'Hardcoding static binary files without backup in Software Engineering Principles.',
  'C',
  'Option C is correct. By utilizing structured schemas, indexes, and optimized execution pipelines.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000028000005',
  '00000000-0000-4000-a000-000000000028',
  'Q5. What is a recommended best practice when deploying Software Engineering Principles?',
  'Hardcoding static binary files without backup in Software Engineering Principles.',
  'Legacy manual processing for Software Engineering Principles.',
  'Bypassing standard security checks and protocols in Software Engineering Principles.',
  'Conducting regular automated testing, logging, and monitoring checks.',
  'D',
  'Option D is correct. Conducting regular automated testing, logging, and monitoring checks.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000028000006',
  '00000000-0000-4000-a000-000000000028',
  'Q6. Which layer or component plays a vital role in Software Engineering Principles?',
  'Legacy manual processing for Software Engineering Principles.',
  'The central execution handler and protocol controller.',
  'Bypassing standard security checks and protocols in Software Engineering Principles.',
  'Hardcoding static binary files without backup in Software Engineering Principles.',
  'B',
  'Option B is correct. The central execution handler and protocol controller.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000028000007',
  '00000000-0000-4000-a000-000000000028',
  'Q7. What is a common bottleneck or challenge in Software Engineering Principles?',
  'Bypassing standard security checks and protocols in Software Engineering Principles.',
  'Legacy manual processing for Software Engineering Principles.',
  'Managing system state synchronization and resource contention under heavy load.',
  'Hardcoding static binary files without backup in Software Engineering Principles.',
  'C',
  'Option C is correct. Managing system state synchronization and resource contention under heavy load.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000028000008',
  '00000000-0000-4000-a000-000000000028',
  'Q8. How is security typically enforced within Software Engineering Principles?',
  'Legacy manual processing for Software Engineering Principles.',
  'Through strong authentication, access control permissions, and data encryption.',
  'Bypassing standard security checks and protocols in Software Engineering Principles.',
  'Hardcoding static binary files without backup in Software Engineering Principles.',
  'B',
  'Option B is correct. Through strong authentication, access control permissions, and data encryption.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000028000009',
  '00000000-0000-4000-a000-000000000028',
  'Q9. Which metric is critical for measuring the performance of Software Engineering Principles?',
  'Bypassing standard security checks and protocols in Software Engineering Principles.',
  'Legacy manual processing for Software Engineering Principles.',
  'Response latency, throughput, resource utilization, and error rates.',
  'Hardcoding static binary files without backup in Software Engineering Principles.',
  'C',
  'Option C is correct. Response latency, throughput, resource utilization, and error rates.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000028000010',
  '00000000-0000-4000-a000-000000000028',
  'Q10. What is the role of versioning in Software Engineering Principles?',
  'Hardcoding static binary files without backup in Software Engineering Principles.',
  'Legacy manual processing for Software Engineering Principles.',
  'Bypassing standard security checks and protocols in Software Engineering Principles.',
  'To support safe updates, maintain backward compatibility, and enable rollbacks.',
  'D',
  'Option D is correct. To support safe updates, maintain backward compatibility, and enable rollbacks.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000028000011',
  '00000000-0000-4000-a000-000000000028',
  'Q11. In what scenario is Software Engineering Principles most effectively applied?',
  'Hardcoding static binary files without backup in Software Engineering Principles.',
  'Legacy manual processing for Software Engineering Principles.',
  'Bypassing standard security checks and protocols in Software Engineering Principles.',
  'In modern scalable enterprise systems requiring structured workflows and reliability.',
  'D',
  'Option D is correct. In modern scalable enterprise systems requiring structured workflows and reliability.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000028000012',
  '00000000-0000-4000-a000-000000000028',
  'Q12. Which tool or interface is standard for interacting with Software Engineering Principles?',
  'Legacy manual processing for Software Engineering Principles.',
  'Dedicated command line tools, SDK APIs, and management dashboards.',
  'Bypassing standard security checks and protocols in Software Engineering Principles.',
  'Hardcoding static binary files without backup in Software Engineering Principles.',
  'B',
  'Option B is correct. Dedicated command line tools, SDK APIs, and management dashboards.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000028000013',
  '00000000-0000-4000-a000-000000000028',
  'Q13. What is the initial phase when developing with Software Engineering Principles?',
  'Defining requirements, setting up the development environment, and configuring dependencies.',
  'Legacy manual processing for Software Engineering Principles.',
  'Bypassing standard security checks and protocols in Software Engineering Principles.',
  'Hardcoding static binary files without backup in Software Engineering Principles.',
  'A',
  'Option A is correct. Defining requirements, setting up the development environment, and configuring dependencies.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000028000014',
  '00000000-0000-4000-a000-000000000028',
  'Q14. Which debugging technique is recommended for Software Engineering Principles?',
  'Bypassing standard security checks and protocols in Software Engineering Principles.',
  'Legacy manual processing for Software Engineering Principles.',
  'Inspecting log trace files, using debugger tools, and verifying stack traces.',
  'Hardcoding static binary files without backup in Software Engineering Principles.',
  'C',
  'Option C is correct. Inspecting log trace files, using debugger tools, and verifying stack traces.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000028000015',
  '00000000-0000-4000-a000-000000000028',
  'Q15. What is the overall goal of mastering Software Engineering Principles?',
  'To design, build, and maintain production-ready technology solutions.',
  'Legacy manual processing for Software Engineering Principles.',
  'Bypassing standard security checks and protocols in Software Engineering Principles.',
  'Hardcoding static binary files without backup in Software Engineering Principles.',
  'A',
  'Option A is correct. To design, build, and maintain production-ready technology solutions.'
);

-- Quick Learn 29: Microservices Architecture
INSERT INTO public.quick_learn_lessons (id, title, slug, branch, category, difficulty, estimated_minutes, is_recommended, fx_reward, short_description, content_markdown, is_published)
VALUES (
  '00000000-0000-4000-a000-000000000029',
  'Microservices Architecture',
  'microservices-architecture',
  'CSE',
  'Backend',
  'Advanced',
  3,
  TRUE,
  10,
  'Master Microservices Architecture fundamentals with quick reading and 15 practice MCQs on FEEDX.',
  '### Learning Text
Microservices Architecture is an essential concept in modern technology and engineering education. Understanding its core components enables effective problem-solving and application development.

### Key Points
- **Core Concepts**: Fundamentals of Microservices Architecture.
- **Best Practices**: Implementation standards.
- **Workflow**: Practical application and deployment.',
  TRUE
) ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title;

INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000029000001',
  '00000000-0000-4000-a000-000000000029',
  'Q1. What is the primary definition of Microservices Architecture?',
  'A core technology or standard designed for managing and executing Microservices Architecture processes.',
  'Legacy manual processing for Microservices Architecture.',
  'Bypassing standard security checks and protocols in Microservices Architecture.',
  'Hardcoding static binary files without backup in Microservices Architecture.',
  'A',
  'Option A is correct. A core technology or standard designed for managing and executing Microservices Architecture processes.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000029000002',
  '00000000-0000-4000-a000-000000000029',
  'Q2. Which key benefit is provided by Microservices Architecture?',
  'Bypassing standard security checks and protocols in Microservices Architecture.',
  'Legacy manual processing for Microservices Architecture.',
  'Improved efficiency, scalability, modularity, and operational reliability.',
  'Hardcoding static binary files without backup in Microservices Architecture.',
  'C',
  'Option C is correct. Improved efficiency, scalability, modularity, and operational reliability.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000029000003',
  '00000000-0000-4000-a000-000000000029',
  'Q3. What is a fundamental requirement when implementing Microservices Architecture?',
  'Legacy manual processing for Microservices Architecture.',
  'Proper system configuration, security protocols, and integration standards.',
  'Bypassing standard security checks and protocols in Microservices Architecture.',
  'Hardcoding static binary files without backup in Microservices Architecture.',
  'B',
  'Option B is correct. Proper system configuration, security protocols, and integration standards.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000029000004',
  '00000000-0000-4000-a000-000000000029',
  'Q4. How does Microservices Architecture handle data and execution states?',
  'By utilizing structured schemas, indexes, and optimized execution pipelines.',
  'Legacy manual processing for Microservices Architecture.',
  'Bypassing standard security checks and protocols in Microservices Architecture.',
  'Hardcoding static binary files without backup in Microservices Architecture.',
  'A',
  'Option A is correct. By utilizing structured schemas, indexes, and optimized execution pipelines.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000029000005',
  '00000000-0000-4000-a000-000000000029',
  'Q5. What is a recommended best practice when deploying Microservices Architecture?',
  'Conducting regular automated testing, logging, and monitoring checks.',
  'Legacy manual processing for Microservices Architecture.',
  'Bypassing standard security checks and protocols in Microservices Architecture.',
  'Hardcoding static binary files without backup in Microservices Architecture.',
  'A',
  'Option A is correct. Conducting regular automated testing, logging, and monitoring checks.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000029000006',
  '00000000-0000-4000-a000-000000000029',
  'Q6. Which layer or component plays a vital role in Microservices Architecture?',
  'The central execution handler and protocol controller.',
  'Legacy manual processing for Microservices Architecture.',
  'Bypassing standard security checks and protocols in Microservices Architecture.',
  'Hardcoding static binary files without backup in Microservices Architecture.',
  'A',
  'Option A is correct. The central execution handler and protocol controller.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000029000007',
  '00000000-0000-4000-a000-000000000029',
  'Q7. What is a common bottleneck or challenge in Microservices Architecture?',
  'Managing system state synchronization and resource contention under heavy load.',
  'Legacy manual processing for Microservices Architecture.',
  'Bypassing standard security checks and protocols in Microservices Architecture.',
  'Hardcoding static binary files without backup in Microservices Architecture.',
  'A',
  'Option A is correct. Managing system state synchronization and resource contention under heavy load.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000029000008',
  '00000000-0000-4000-a000-000000000029',
  'Q8. How is security typically enforced within Microservices Architecture?',
  'Bypassing standard security checks and protocols in Microservices Architecture.',
  'Legacy manual processing for Microservices Architecture.',
  'Through strong authentication, access control permissions, and data encryption.',
  'Hardcoding static binary files without backup in Microservices Architecture.',
  'C',
  'Option C is correct. Through strong authentication, access control permissions, and data encryption.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000029000009',
  '00000000-0000-4000-a000-000000000029',
  'Q9. Which metric is critical for measuring the performance of Microservices Architecture?',
  'Response latency, throughput, resource utilization, and error rates.',
  'Legacy manual processing for Microservices Architecture.',
  'Bypassing standard security checks and protocols in Microservices Architecture.',
  'Hardcoding static binary files without backup in Microservices Architecture.',
  'A',
  'Option A is correct. Response latency, throughput, resource utilization, and error rates.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000029000010',
  '00000000-0000-4000-a000-000000000029',
  'Q10. What is the role of versioning in Microservices Architecture?',
  'Bypassing standard security checks and protocols in Microservices Architecture.',
  'Legacy manual processing for Microservices Architecture.',
  'To support safe updates, maintain backward compatibility, and enable rollbacks.',
  'Hardcoding static binary files without backup in Microservices Architecture.',
  'C',
  'Option C is correct. To support safe updates, maintain backward compatibility, and enable rollbacks.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000029000011',
  '00000000-0000-4000-a000-000000000029',
  'Q11. In what scenario is Microservices Architecture most effectively applied?',
  'Hardcoding static binary files without backup in Microservices Architecture.',
  'Legacy manual processing for Microservices Architecture.',
  'Bypassing standard security checks and protocols in Microservices Architecture.',
  'In modern scalable enterprise systems requiring structured workflows and reliability.',
  'D',
  'Option D is correct. In modern scalable enterprise systems requiring structured workflows and reliability.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000029000012',
  '00000000-0000-4000-a000-000000000029',
  'Q12. Which tool or interface is standard for interacting with Microservices Architecture?',
  'Bypassing standard security checks and protocols in Microservices Architecture.',
  'Legacy manual processing for Microservices Architecture.',
  'Dedicated command line tools, SDK APIs, and management dashboards.',
  'Hardcoding static binary files without backup in Microservices Architecture.',
  'C',
  'Option C is correct. Dedicated command line tools, SDK APIs, and management dashboards.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000029000013',
  '00000000-0000-4000-a000-000000000029',
  'Q13. What is the initial phase when developing with Microservices Architecture?',
  'Legacy manual processing for Microservices Architecture.',
  'Defining requirements, setting up the development environment, and configuring dependencies.',
  'Bypassing standard security checks and protocols in Microservices Architecture.',
  'Hardcoding static binary files without backup in Microservices Architecture.',
  'B',
  'Option B is correct. Defining requirements, setting up the development environment, and configuring dependencies.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000029000014',
  '00000000-0000-4000-a000-000000000029',
  'Q14. Which debugging technique is recommended for Microservices Architecture?',
  'Inspecting log trace files, using debugger tools, and verifying stack traces.',
  'Legacy manual processing for Microservices Architecture.',
  'Bypassing standard security checks and protocols in Microservices Architecture.',
  'Hardcoding static binary files without backup in Microservices Architecture.',
  'A',
  'Option A is correct. Inspecting log trace files, using debugger tools, and verifying stack traces.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000029000015',
  '00000000-0000-4000-a000-000000000029',
  'Q15. What is the overall goal of mastering Microservices Architecture?',
  'To design, build, and maintain production-ready technology solutions.',
  'Legacy manual processing for Microservices Architecture.',
  'Bypassing standard security checks and protocols in Microservices Architecture.',
  'Hardcoding static binary files without backup in Microservices Architecture.',
  'A',
  'Option A is correct. To design, build, and maintain production-ready technology solutions.'
);

-- Quick Learn 30: GraphQL vs REST
INSERT INTO public.quick_learn_lessons (id, title, slug, branch, category, difficulty, estimated_minutes, is_recommended, fx_reward, short_description, content_markdown, is_published)
VALUES (
  '00000000-0000-4000-a000-000000000030',
  'GraphQL vs REST',
  'graphql-vs-rest',
  'CSE',
  'Backend',
  'Intermediate',
  3,
  TRUE,
  10,
  'Master GraphQL vs REST fundamentals with quick reading and 15 practice MCQs on FEEDX.',
  '### Learning Text
GraphQL vs REST is an essential concept in modern technology and engineering education. Understanding its core components enables effective problem-solving and application development.

### Key Points
- **Core Concepts**: Fundamentals of GraphQL vs REST.
- **Best Practices**: Implementation standards.
- **Workflow**: Practical application and deployment.',
  TRUE
) ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title;

INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000030000001',
  '00000000-0000-4000-a000-000000000030',
  'Q1. What is the primary definition of GraphQL vs REST?',
  'Hardcoding static binary files without backup in GraphQL vs REST.',
  'Legacy manual processing for GraphQL vs REST.',
  'Bypassing standard security checks and protocols in GraphQL vs REST.',
  'A core technology or standard designed for managing and executing GraphQL vs REST processes.',
  'D',
  'Option D is correct. A core technology or standard designed for managing and executing GraphQL vs REST processes.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000030000002',
  '00000000-0000-4000-a000-000000000030',
  'Q2. Which key benefit is provided by GraphQL vs REST?',
  'Legacy manual processing for GraphQL vs REST.',
  'Improved efficiency, scalability, modularity, and operational reliability.',
  'Bypassing standard security checks and protocols in GraphQL vs REST.',
  'Hardcoding static binary files without backup in GraphQL vs REST.',
  'B',
  'Option B is correct. Improved efficiency, scalability, modularity, and operational reliability.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000030000003',
  '00000000-0000-4000-a000-000000000030',
  'Q3. What is a fundamental requirement when implementing GraphQL vs REST?',
  'Hardcoding static binary files without backup in GraphQL vs REST.',
  'Legacy manual processing for GraphQL vs REST.',
  'Bypassing standard security checks and protocols in GraphQL vs REST.',
  'Proper system configuration, security protocols, and integration standards.',
  'D',
  'Option D is correct. Proper system configuration, security protocols, and integration standards.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000030000004',
  '00000000-0000-4000-a000-000000000030',
  'Q4. How does GraphQL vs REST handle data and execution states?',
  'Hardcoding static binary files without backup in GraphQL vs REST.',
  'Legacy manual processing for GraphQL vs REST.',
  'Bypassing standard security checks and protocols in GraphQL vs REST.',
  'By utilizing structured schemas, indexes, and optimized execution pipelines.',
  'D',
  'Option D is correct. By utilizing structured schemas, indexes, and optimized execution pipelines.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000030000005',
  '00000000-0000-4000-a000-000000000030',
  'Q5. What is a recommended best practice when deploying GraphQL vs REST?',
  'Bypassing standard security checks and protocols in GraphQL vs REST.',
  'Legacy manual processing for GraphQL vs REST.',
  'Conducting regular automated testing, logging, and monitoring checks.',
  'Hardcoding static binary files without backup in GraphQL vs REST.',
  'C',
  'Option C is correct. Conducting regular automated testing, logging, and monitoring checks.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000030000006',
  '00000000-0000-4000-a000-000000000030',
  'Q6. Which layer or component plays a vital role in GraphQL vs REST?',
  'Legacy manual processing for GraphQL vs REST.',
  'The central execution handler and protocol controller.',
  'Bypassing standard security checks and protocols in GraphQL vs REST.',
  'Hardcoding static binary files without backup in GraphQL vs REST.',
  'B',
  'Option B is correct. The central execution handler and protocol controller.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000030000007',
  '00000000-0000-4000-a000-000000000030',
  'Q7. What is a common bottleneck or challenge in GraphQL vs REST?',
  'Legacy manual processing for GraphQL vs REST.',
  'Managing system state synchronization and resource contention under heavy load.',
  'Bypassing standard security checks and protocols in GraphQL vs REST.',
  'Hardcoding static binary files without backup in GraphQL vs REST.',
  'B',
  'Option B is correct. Managing system state synchronization and resource contention under heavy load.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000030000008',
  '00000000-0000-4000-a000-000000000030',
  'Q8. How is security typically enforced within GraphQL vs REST?',
  'Hardcoding static binary files without backup in GraphQL vs REST.',
  'Legacy manual processing for GraphQL vs REST.',
  'Bypassing standard security checks and protocols in GraphQL vs REST.',
  'Through strong authentication, access control permissions, and data encryption.',
  'D',
  'Option D is correct. Through strong authentication, access control permissions, and data encryption.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000030000009',
  '00000000-0000-4000-a000-000000000030',
  'Q9. Which metric is critical for measuring the performance of GraphQL vs REST?',
  'Response latency, throughput, resource utilization, and error rates.',
  'Legacy manual processing for GraphQL vs REST.',
  'Bypassing standard security checks and protocols in GraphQL vs REST.',
  'Hardcoding static binary files without backup in GraphQL vs REST.',
  'A',
  'Option A is correct. Response latency, throughput, resource utilization, and error rates.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000030000010',
  '00000000-0000-4000-a000-000000000030',
  'Q10. What is the role of versioning in GraphQL vs REST?',
  'Bypassing standard security checks and protocols in GraphQL vs REST.',
  'Legacy manual processing for GraphQL vs REST.',
  'To support safe updates, maintain backward compatibility, and enable rollbacks.',
  'Hardcoding static binary files without backup in GraphQL vs REST.',
  'C',
  'Option C is correct. To support safe updates, maintain backward compatibility, and enable rollbacks.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000030000011',
  '00000000-0000-4000-a000-000000000030',
  'Q11. In what scenario is GraphQL vs REST most effectively applied?',
  'Legacy manual processing for GraphQL vs REST.',
  'In modern scalable enterprise systems requiring structured workflows and reliability.',
  'Bypassing standard security checks and protocols in GraphQL vs REST.',
  'Hardcoding static binary files without backup in GraphQL vs REST.',
  'B',
  'Option B is correct. In modern scalable enterprise systems requiring structured workflows and reliability.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000030000012',
  '00000000-0000-4000-a000-000000000030',
  'Q12. Which tool or interface is standard for interacting with GraphQL vs REST?',
  'Legacy manual processing for GraphQL vs REST.',
  'Dedicated command line tools, SDK APIs, and management dashboards.',
  'Bypassing standard security checks and protocols in GraphQL vs REST.',
  'Hardcoding static binary files without backup in GraphQL vs REST.',
  'B',
  'Option B is correct. Dedicated command line tools, SDK APIs, and management dashboards.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000030000013',
  '00000000-0000-4000-a000-000000000030',
  'Q13. What is the initial phase when developing with GraphQL vs REST?',
  'Legacy manual processing for GraphQL vs REST.',
  'Defining requirements, setting up the development environment, and configuring dependencies.',
  'Bypassing standard security checks and protocols in GraphQL vs REST.',
  'Hardcoding static binary files without backup in GraphQL vs REST.',
  'B',
  'Option B is correct. Defining requirements, setting up the development environment, and configuring dependencies.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000030000014',
  '00000000-0000-4000-a000-000000000030',
  'Q14. Which debugging technique is recommended for GraphQL vs REST?',
  'Hardcoding static binary files without backup in GraphQL vs REST.',
  'Legacy manual processing for GraphQL vs REST.',
  'Bypassing standard security checks and protocols in GraphQL vs REST.',
  'Inspecting log trace files, using debugger tools, and verifying stack traces.',
  'D',
  'Option D is correct. Inspecting log trace files, using debugger tools, and verifying stack traces.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000030000015',
  '00000000-0000-4000-a000-000000000030',
  'Q15. What is the overall goal of mastering GraphQL vs REST?',
  'Legacy manual processing for GraphQL vs REST.',
  'To design, build, and maintain production-ready technology solutions.',
  'Bypassing standard security checks and protocols in GraphQL vs REST.',
  'Hardcoding static binary files without backup in GraphQL vs REST.',
  'B',
  'Option B is correct. To design, build, and maintain production-ready technology solutions.'
);

-- Quick Learn 31: System Design Basics
INSERT INTO public.quick_learn_lessons (id, title, slug, branch, category, difficulty, estimated_minutes, is_recommended, fx_reward, short_description, content_markdown, is_published)
VALUES (
  '00000000-0000-4000-a000-000000000031',
  'System Design Basics',
  'system-design-basics',
  'CSE',
  'Architecture',
  'Advanced',
  3,
  TRUE,
  10,
  'Master System Design Basics fundamentals with quick reading and 15 practice MCQs on FEEDX.',
  '### Learning Text
System Design Basics is an essential concept in modern technology and engineering education. Understanding its core components enables effective problem-solving and application development.

### Key Points
- **Core Concepts**: Fundamentals of System Design Basics.
- **Best Practices**: Implementation standards.
- **Workflow**: Practical application and deployment.',
  TRUE
) ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title;

INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000031000001',
  '00000000-0000-4000-a000-000000000031',
  'Q1. What is the primary definition of System Design Basics?',
  'Legacy manual processing for System Design Basics.',
  'A core technology or standard designed for managing and executing System Design Basics processes.',
  'Bypassing standard security checks and protocols in System Design Basics.',
  'Hardcoding static binary files without backup in System Design Basics.',
  'B',
  'Option B is correct. A core technology or standard designed for managing and executing System Design Basics processes.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000031000002',
  '00000000-0000-4000-a000-000000000031',
  'Q2. Which key benefit is provided by System Design Basics?',
  'Bypassing standard security checks and protocols in System Design Basics.',
  'Legacy manual processing for System Design Basics.',
  'Improved efficiency, scalability, modularity, and operational reliability.',
  'Hardcoding static binary files without backup in System Design Basics.',
  'C',
  'Option C is correct. Improved efficiency, scalability, modularity, and operational reliability.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000031000003',
  '00000000-0000-4000-a000-000000000031',
  'Q3. What is a fundamental requirement when implementing System Design Basics?',
  'Legacy manual processing for System Design Basics.',
  'Proper system configuration, security protocols, and integration standards.',
  'Bypassing standard security checks and protocols in System Design Basics.',
  'Hardcoding static binary files without backup in System Design Basics.',
  'B',
  'Option B is correct. Proper system configuration, security protocols, and integration standards.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000031000004',
  '00000000-0000-4000-a000-000000000031',
  'Q4. How does System Design Basics handle data and execution states?',
  'By utilizing structured schemas, indexes, and optimized execution pipelines.',
  'Legacy manual processing for System Design Basics.',
  'Bypassing standard security checks and protocols in System Design Basics.',
  'Hardcoding static binary files without backup in System Design Basics.',
  'A',
  'Option A is correct. By utilizing structured schemas, indexes, and optimized execution pipelines.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000031000005',
  '00000000-0000-4000-a000-000000000031',
  'Q5. What is a recommended best practice when deploying System Design Basics?',
  'Legacy manual processing for System Design Basics.',
  'Conducting regular automated testing, logging, and monitoring checks.',
  'Bypassing standard security checks and protocols in System Design Basics.',
  'Hardcoding static binary files without backup in System Design Basics.',
  'B',
  'Option B is correct. Conducting regular automated testing, logging, and monitoring checks.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000031000006',
  '00000000-0000-4000-a000-000000000031',
  'Q6. Which layer or component plays a vital role in System Design Basics?',
  'Hardcoding static binary files without backup in System Design Basics.',
  'Legacy manual processing for System Design Basics.',
  'Bypassing standard security checks and protocols in System Design Basics.',
  'The central execution handler and protocol controller.',
  'D',
  'Option D is correct. The central execution handler and protocol controller.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000031000007',
  '00000000-0000-4000-a000-000000000031',
  'Q7. What is a common bottleneck or challenge in System Design Basics?',
  'Hardcoding static binary files without backup in System Design Basics.',
  'Legacy manual processing for System Design Basics.',
  'Bypassing standard security checks and protocols in System Design Basics.',
  'Managing system state synchronization and resource contention under heavy load.',
  'D',
  'Option D is correct. Managing system state synchronization and resource contention under heavy load.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000031000008',
  '00000000-0000-4000-a000-000000000031',
  'Q8. How is security typically enforced within System Design Basics?',
  'Hardcoding static binary files without backup in System Design Basics.',
  'Legacy manual processing for System Design Basics.',
  'Bypassing standard security checks and protocols in System Design Basics.',
  'Through strong authentication, access control permissions, and data encryption.',
  'D',
  'Option D is correct. Through strong authentication, access control permissions, and data encryption.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000031000009',
  '00000000-0000-4000-a000-000000000031',
  'Q9. Which metric is critical for measuring the performance of System Design Basics?',
  'Bypassing standard security checks and protocols in System Design Basics.',
  'Legacy manual processing for System Design Basics.',
  'Response latency, throughput, resource utilization, and error rates.',
  'Hardcoding static binary files without backup in System Design Basics.',
  'C',
  'Option C is correct. Response latency, throughput, resource utilization, and error rates.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000031000010',
  '00000000-0000-4000-a000-000000000031',
  'Q10. What is the role of versioning in System Design Basics?',
  'To support safe updates, maintain backward compatibility, and enable rollbacks.',
  'Legacy manual processing for System Design Basics.',
  'Bypassing standard security checks and protocols in System Design Basics.',
  'Hardcoding static binary files without backup in System Design Basics.',
  'A',
  'Option A is correct. To support safe updates, maintain backward compatibility, and enable rollbacks.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000031000011',
  '00000000-0000-4000-a000-000000000031',
  'Q11. In what scenario is System Design Basics most effectively applied?',
  'Bypassing standard security checks and protocols in System Design Basics.',
  'Legacy manual processing for System Design Basics.',
  'In modern scalable enterprise systems requiring structured workflows and reliability.',
  'Hardcoding static binary files without backup in System Design Basics.',
  'C',
  'Option C is correct. In modern scalable enterprise systems requiring structured workflows and reliability.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000031000012',
  '00000000-0000-4000-a000-000000000031',
  'Q12. Which tool or interface is standard for interacting with System Design Basics?',
  'Dedicated command line tools, SDK APIs, and management dashboards.',
  'Legacy manual processing for System Design Basics.',
  'Bypassing standard security checks and protocols in System Design Basics.',
  'Hardcoding static binary files without backup in System Design Basics.',
  'A',
  'Option A is correct. Dedicated command line tools, SDK APIs, and management dashboards.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000031000013',
  '00000000-0000-4000-a000-000000000031',
  'Q13. What is the initial phase when developing with System Design Basics?',
  'Legacy manual processing for System Design Basics.',
  'Defining requirements, setting up the development environment, and configuring dependencies.',
  'Bypassing standard security checks and protocols in System Design Basics.',
  'Hardcoding static binary files without backup in System Design Basics.',
  'B',
  'Option B is correct. Defining requirements, setting up the development environment, and configuring dependencies.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000031000014',
  '00000000-0000-4000-a000-000000000031',
  'Q14. Which debugging technique is recommended for System Design Basics?',
  'Legacy manual processing for System Design Basics.',
  'Inspecting log trace files, using debugger tools, and verifying stack traces.',
  'Bypassing standard security checks and protocols in System Design Basics.',
  'Hardcoding static binary files without backup in System Design Basics.',
  'B',
  'Option B is correct. Inspecting log trace files, using debugger tools, and verifying stack traces.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000031000015',
  '00000000-0000-4000-a000-000000000031',
  'Q15. What is the overall goal of mastering System Design Basics?',
  'Hardcoding static binary files without backup in System Design Basics.',
  'Legacy manual processing for System Design Basics.',
  'Bypassing standard security checks and protocols in System Design Basics.',
  'To design, build, and maintain production-ready technology solutions.',
  'D',
  'Option D is correct. To design, build, and maintain production-ready technology solutions.'
);

-- Quick Learn 32: DevOps & CI/CD Pipelines
INSERT INTO public.quick_learn_lessons (id, title, slug, branch, category, difficulty, estimated_minutes, is_recommended, fx_reward, short_description, content_markdown, is_published)
VALUES (
  '00000000-0000-4000-a000-000000000032',
  'DevOps & CI/CD Pipelines',
  'devops-ci-cd-pipelines',
  'CSE',
  'DevOps',
  'Intermediate',
  3,
  TRUE,
  10,
  'Master DevOps & CI/CD Pipelines fundamentals with quick reading and 15 practice MCQs on FEEDX.',
  '### Learning Text
DevOps & CI/CD Pipelines is an essential concept in modern technology and engineering education. Understanding its core components enables effective problem-solving and application development.

### Key Points
- **Core Concepts**: Fundamentals of DevOps & CI/CD Pipelines.
- **Best Practices**: Implementation standards.
- **Workflow**: Practical application and deployment.',
  TRUE
) ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title;

INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000032000001',
  '00000000-0000-4000-a000-000000000032',
  'Q1. What is the primary definition of DevOps & CI/CD Pipelines?',
  'Legacy manual processing for DevOps & CI/CD Pipelines.',
  'A core technology or standard designed for managing and executing DevOps & CI/CD Pipelines processes.',
  'Bypassing standard security checks and protocols in DevOps & CI/CD Pipelines.',
  'Hardcoding static binary files without backup in DevOps & CI/CD Pipelines.',
  'B',
  'Option B is correct. A core technology or standard designed for managing and executing DevOps & CI/CD Pipelines processes.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000032000002',
  '00000000-0000-4000-a000-000000000032',
  'Q2. Which key benefit is provided by DevOps & CI/CD Pipelines?',
  'Hardcoding static binary files without backup in DevOps & CI/CD Pipelines.',
  'Legacy manual processing for DevOps & CI/CD Pipelines.',
  'Bypassing standard security checks and protocols in DevOps & CI/CD Pipelines.',
  'Improved efficiency, scalability, modularity, and operational reliability.',
  'D',
  'Option D is correct. Improved efficiency, scalability, modularity, and operational reliability.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000032000003',
  '00000000-0000-4000-a000-000000000032',
  'Q3. What is a fundamental requirement when implementing DevOps & CI/CD Pipelines?',
  'Legacy manual processing for DevOps & CI/CD Pipelines.',
  'Proper system configuration, security protocols, and integration standards.',
  'Bypassing standard security checks and protocols in DevOps & CI/CD Pipelines.',
  'Hardcoding static binary files without backup in DevOps & CI/CD Pipelines.',
  'B',
  'Option B is correct. Proper system configuration, security protocols, and integration standards.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000032000004',
  '00000000-0000-4000-a000-000000000032',
  'Q4. How does DevOps & CI/CD Pipelines handle data and execution states?',
  'Hardcoding static binary files without backup in DevOps & CI/CD Pipelines.',
  'Legacy manual processing for DevOps & CI/CD Pipelines.',
  'Bypassing standard security checks and protocols in DevOps & CI/CD Pipelines.',
  'By utilizing structured schemas, indexes, and optimized execution pipelines.',
  'D',
  'Option D is correct. By utilizing structured schemas, indexes, and optimized execution pipelines.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000032000005',
  '00000000-0000-4000-a000-000000000032',
  'Q5. What is a recommended best practice when deploying DevOps & CI/CD Pipelines?',
  'Conducting regular automated testing, logging, and monitoring checks.',
  'Legacy manual processing for DevOps & CI/CD Pipelines.',
  'Bypassing standard security checks and protocols in DevOps & CI/CD Pipelines.',
  'Hardcoding static binary files without backup in DevOps & CI/CD Pipelines.',
  'A',
  'Option A is correct. Conducting regular automated testing, logging, and monitoring checks.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000032000006',
  '00000000-0000-4000-a000-000000000032',
  'Q6. Which layer or component plays a vital role in DevOps & CI/CD Pipelines?',
  'Bypassing standard security checks and protocols in DevOps & CI/CD Pipelines.',
  'Legacy manual processing for DevOps & CI/CD Pipelines.',
  'The central execution handler and protocol controller.',
  'Hardcoding static binary files without backup in DevOps & CI/CD Pipelines.',
  'C',
  'Option C is correct. The central execution handler and protocol controller.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000032000007',
  '00000000-0000-4000-a000-000000000032',
  'Q7. What is a common bottleneck or challenge in DevOps & CI/CD Pipelines?',
  'Managing system state synchronization and resource contention under heavy load.',
  'Legacy manual processing for DevOps & CI/CD Pipelines.',
  'Bypassing standard security checks and protocols in DevOps & CI/CD Pipelines.',
  'Hardcoding static binary files without backup in DevOps & CI/CD Pipelines.',
  'A',
  'Option A is correct. Managing system state synchronization and resource contention under heavy load.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000032000008',
  '00000000-0000-4000-a000-000000000032',
  'Q8. How is security typically enforced within DevOps & CI/CD Pipelines?',
  'Through strong authentication, access control permissions, and data encryption.',
  'Legacy manual processing for DevOps & CI/CD Pipelines.',
  'Bypassing standard security checks and protocols in DevOps & CI/CD Pipelines.',
  'Hardcoding static binary files without backup in DevOps & CI/CD Pipelines.',
  'A',
  'Option A is correct. Through strong authentication, access control permissions, and data encryption.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000032000009',
  '00000000-0000-4000-a000-000000000032',
  'Q9. Which metric is critical for measuring the performance of DevOps & CI/CD Pipelines?',
  'Response latency, throughput, resource utilization, and error rates.',
  'Legacy manual processing for DevOps & CI/CD Pipelines.',
  'Bypassing standard security checks and protocols in DevOps & CI/CD Pipelines.',
  'Hardcoding static binary files without backup in DevOps & CI/CD Pipelines.',
  'A',
  'Option A is correct. Response latency, throughput, resource utilization, and error rates.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000032000010',
  '00000000-0000-4000-a000-000000000032',
  'Q10. What is the role of versioning in DevOps & CI/CD Pipelines?',
  'Hardcoding static binary files without backup in DevOps & CI/CD Pipelines.',
  'Legacy manual processing for DevOps & CI/CD Pipelines.',
  'Bypassing standard security checks and protocols in DevOps & CI/CD Pipelines.',
  'To support safe updates, maintain backward compatibility, and enable rollbacks.',
  'D',
  'Option D is correct. To support safe updates, maintain backward compatibility, and enable rollbacks.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000032000011',
  '00000000-0000-4000-a000-000000000032',
  'Q11. In what scenario is DevOps & CI/CD Pipelines most effectively applied?',
  'In modern scalable enterprise systems requiring structured workflows and reliability.',
  'Legacy manual processing for DevOps & CI/CD Pipelines.',
  'Bypassing standard security checks and protocols in DevOps & CI/CD Pipelines.',
  'Hardcoding static binary files without backup in DevOps & CI/CD Pipelines.',
  'A',
  'Option A is correct. In modern scalable enterprise systems requiring structured workflows and reliability.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000032000012',
  '00000000-0000-4000-a000-000000000032',
  'Q12. Which tool or interface is standard for interacting with DevOps & CI/CD Pipelines?',
  'Legacy manual processing for DevOps & CI/CD Pipelines.',
  'Dedicated command line tools, SDK APIs, and management dashboards.',
  'Bypassing standard security checks and protocols in DevOps & CI/CD Pipelines.',
  'Hardcoding static binary files without backup in DevOps & CI/CD Pipelines.',
  'B',
  'Option B is correct. Dedicated command line tools, SDK APIs, and management dashboards.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000032000013',
  '00000000-0000-4000-a000-000000000032',
  'Q13. What is the initial phase when developing with DevOps & CI/CD Pipelines?',
  'Defining requirements, setting up the development environment, and configuring dependencies.',
  'Legacy manual processing for DevOps & CI/CD Pipelines.',
  'Bypassing standard security checks and protocols in DevOps & CI/CD Pipelines.',
  'Hardcoding static binary files without backup in DevOps & CI/CD Pipelines.',
  'A',
  'Option A is correct. Defining requirements, setting up the development environment, and configuring dependencies.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000032000014',
  '00000000-0000-4000-a000-000000000032',
  'Q14. Which debugging technique is recommended for DevOps & CI/CD Pipelines?',
  'Hardcoding static binary files without backup in DevOps & CI/CD Pipelines.',
  'Legacy manual processing for DevOps & CI/CD Pipelines.',
  'Bypassing standard security checks and protocols in DevOps & CI/CD Pipelines.',
  'Inspecting log trace files, using debugger tools, and verifying stack traces.',
  'D',
  'Option D is correct. Inspecting log trace files, using debugger tools, and verifying stack traces.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000032000015',
  '00000000-0000-4000-a000-000000000032',
  'Q15. What is the overall goal of mastering DevOps & CI/CD Pipelines?',
  'Bypassing standard security checks and protocols in DevOps & CI/CD Pipelines.',
  'Legacy manual processing for DevOps & CI/CD Pipelines.',
  'To design, build, and maintain production-ready technology solutions.',
  'Hardcoding static binary files without backup in DevOps & CI/CD Pipelines.',
  'C',
  'Option C is correct. To design, build, and maintain production-ready technology solutions.'
);

-- Quick Learn 33: Artificial Intelligence Basics
INSERT INTO public.quick_learn_lessons (id, title, slug, branch, category, difficulty, estimated_minutes, is_recommended, fx_reward, short_description, content_markdown, is_published)
VALUES (
  '00000000-0000-4000-a000-000000000033',
  'Artificial Intelligence Basics',
  'artificial-intelligence-basics',
  'AI & ML',
  'AI',
  'Beginner',
  3,
  TRUE,
  10,
  'Master Artificial Intelligence Basics fundamentals with quick reading and 15 practice MCQs on FEEDX.',
  '### Learning Text
Artificial Intelligence Basics is an essential concept in modern technology and engineering education. Understanding its core components enables effective problem-solving and application development.

### Key Points
- **Core Concepts**: Fundamentals of Artificial Intelligence Basics.
- **Best Practices**: Implementation standards.
- **Workflow**: Practical application and deployment.',
  TRUE
) ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title;

INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000033000001',
  '00000000-0000-4000-a000-000000000033',
  'Q1. What is the primary definition of Artificial Intelligence Basics?',
  'Legacy manual processing for Artificial Intelligence Basics.',
  'A core technology or standard designed for managing and executing Artificial Intelligence Basics processes.',
  'Bypassing standard security checks and protocols in Artificial Intelligence Basics.',
  'Hardcoding static binary files without backup in Artificial Intelligence Basics.',
  'B',
  'Option B is correct. A core technology or standard designed for managing and executing Artificial Intelligence Basics processes.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000033000002',
  '00000000-0000-4000-a000-000000000033',
  'Q2. Which key benefit is provided by Artificial Intelligence Basics?',
  'Hardcoding static binary files without backup in Artificial Intelligence Basics.',
  'Legacy manual processing for Artificial Intelligence Basics.',
  'Bypassing standard security checks and protocols in Artificial Intelligence Basics.',
  'Improved efficiency, scalability, modularity, and operational reliability.',
  'D',
  'Option D is correct. Improved efficiency, scalability, modularity, and operational reliability.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000033000003',
  '00000000-0000-4000-a000-000000000033',
  'Q3. What is a fundamental requirement when implementing Artificial Intelligence Basics?',
  'Proper system configuration, security protocols, and integration standards.',
  'Legacy manual processing for Artificial Intelligence Basics.',
  'Bypassing standard security checks and protocols in Artificial Intelligence Basics.',
  'Hardcoding static binary files without backup in Artificial Intelligence Basics.',
  'A',
  'Option A is correct. Proper system configuration, security protocols, and integration standards.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000033000004',
  '00000000-0000-4000-a000-000000000033',
  'Q4. How does Artificial Intelligence Basics handle data and execution states?',
  'Hardcoding static binary files without backup in Artificial Intelligence Basics.',
  'Legacy manual processing for Artificial Intelligence Basics.',
  'Bypassing standard security checks and protocols in Artificial Intelligence Basics.',
  'By utilizing structured schemas, indexes, and optimized execution pipelines.',
  'D',
  'Option D is correct. By utilizing structured schemas, indexes, and optimized execution pipelines.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000033000005',
  '00000000-0000-4000-a000-000000000033',
  'Q5. What is a recommended best practice when deploying Artificial Intelligence Basics?',
  'Legacy manual processing for Artificial Intelligence Basics.',
  'Conducting regular automated testing, logging, and monitoring checks.',
  'Bypassing standard security checks and protocols in Artificial Intelligence Basics.',
  'Hardcoding static binary files without backup in Artificial Intelligence Basics.',
  'B',
  'Option B is correct. Conducting regular automated testing, logging, and monitoring checks.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000033000006',
  '00000000-0000-4000-a000-000000000033',
  'Q6. Which layer or component plays a vital role in Artificial Intelligence Basics?',
  'Legacy manual processing for Artificial Intelligence Basics.',
  'The central execution handler and protocol controller.',
  'Bypassing standard security checks and protocols in Artificial Intelligence Basics.',
  'Hardcoding static binary files without backup in Artificial Intelligence Basics.',
  'B',
  'Option B is correct. The central execution handler and protocol controller.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000033000007',
  '00000000-0000-4000-a000-000000000033',
  'Q7. What is a common bottleneck or challenge in Artificial Intelligence Basics?',
  'Managing system state synchronization and resource contention under heavy load.',
  'Legacy manual processing for Artificial Intelligence Basics.',
  'Bypassing standard security checks and protocols in Artificial Intelligence Basics.',
  'Hardcoding static binary files without backup in Artificial Intelligence Basics.',
  'A',
  'Option A is correct. Managing system state synchronization and resource contention under heavy load.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000033000008',
  '00000000-0000-4000-a000-000000000033',
  'Q8. How is security typically enforced within Artificial Intelligence Basics?',
  'Legacy manual processing for Artificial Intelligence Basics.',
  'Through strong authentication, access control permissions, and data encryption.',
  'Bypassing standard security checks and protocols in Artificial Intelligence Basics.',
  'Hardcoding static binary files without backup in Artificial Intelligence Basics.',
  'B',
  'Option B is correct. Through strong authentication, access control permissions, and data encryption.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000033000009',
  '00000000-0000-4000-a000-000000000033',
  'Q9. Which metric is critical for measuring the performance of Artificial Intelligence Basics?',
  'Response latency, throughput, resource utilization, and error rates.',
  'Legacy manual processing for Artificial Intelligence Basics.',
  'Bypassing standard security checks and protocols in Artificial Intelligence Basics.',
  'Hardcoding static binary files without backup in Artificial Intelligence Basics.',
  'A',
  'Option A is correct. Response latency, throughput, resource utilization, and error rates.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000033000010',
  '00000000-0000-4000-a000-000000000033',
  'Q10. What is the role of versioning in Artificial Intelligence Basics?',
  'To support safe updates, maintain backward compatibility, and enable rollbacks.',
  'Legacy manual processing for Artificial Intelligence Basics.',
  'Bypassing standard security checks and protocols in Artificial Intelligence Basics.',
  'Hardcoding static binary files without backup in Artificial Intelligence Basics.',
  'A',
  'Option A is correct. To support safe updates, maintain backward compatibility, and enable rollbacks.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000033000011',
  '00000000-0000-4000-a000-000000000033',
  'Q11. In what scenario is Artificial Intelligence Basics most effectively applied?',
  'Bypassing standard security checks and protocols in Artificial Intelligence Basics.',
  'Legacy manual processing for Artificial Intelligence Basics.',
  'In modern scalable enterprise systems requiring structured workflows and reliability.',
  'Hardcoding static binary files without backup in Artificial Intelligence Basics.',
  'C',
  'Option C is correct. In modern scalable enterprise systems requiring structured workflows and reliability.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000033000012',
  '00000000-0000-4000-a000-000000000033',
  'Q12. Which tool or interface is standard for interacting with Artificial Intelligence Basics?',
  'Bypassing standard security checks and protocols in Artificial Intelligence Basics.',
  'Legacy manual processing for Artificial Intelligence Basics.',
  'Dedicated command line tools, SDK APIs, and management dashboards.',
  'Hardcoding static binary files without backup in Artificial Intelligence Basics.',
  'C',
  'Option C is correct. Dedicated command line tools, SDK APIs, and management dashboards.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000033000013',
  '00000000-0000-4000-a000-000000000033',
  'Q13. What is the initial phase when developing with Artificial Intelligence Basics?',
  'Bypassing standard security checks and protocols in Artificial Intelligence Basics.',
  'Legacy manual processing for Artificial Intelligence Basics.',
  'Defining requirements, setting up the development environment, and configuring dependencies.',
  'Hardcoding static binary files without backup in Artificial Intelligence Basics.',
  'C',
  'Option C is correct. Defining requirements, setting up the development environment, and configuring dependencies.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000033000014',
  '00000000-0000-4000-a000-000000000033',
  'Q14. Which debugging technique is recommended for Artificial Intelligence Basics?',
  'Legacy manual processing for Artificial Intelligence Basics.',
  'Inspecting log trace files, using debugger tools, and verifying stack traces.',
  'Bypassing standard security checks and protocols in Artificial Intelligence Basics.',
  'Hardcoding static binary files without backup in Artificial Intelligence Basics.',
  'B',
  'Option B is correct. Inspecting log trace files, using debugger tools, and verifying stack traces.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000033000015',
  '00000000-0000-4000-a000-000000000033',
  'Q15. What is the overall goal of mastering Artificial Intelligence Basics?',
  'Bypassing standard security checks and protocols in Artificial Intelligence Basics.',
  'Legacy manual processing for Artificial Intelligence Basics.',
  'To design, build, and maintain production-ready technology solutions.',
  'Hardcoding static binary files without backup in Artificial Intelligence Basics.',
  'C',
  'Option C is correct. To design, build, and maintain production-ready technology solutions.'
);

-- Quick Learn 34: Machine Learning Fundamentals
INSERT INTO public.quick_learn_lessons (id, title, slug, branch, category, difficulty, estimated_minutes, is_recommended, fx_reward, short_description, content_markdown, is_published)
VALUES (
  '00000000-0000-4000-a000-000000000034',
  'Machine Learning Fundamentals',
  'machine-learning-fundamentals',
  'AI & ML',
  'ML',
  'Intermediate',
  3,
  TRUE,
  10,
  'Master Machine Learning Fundamentals fundamentals with quick reading and 15 practice MCQs on FEEDX.',
  '### Learning Text
Machine Learning Fundamentals is an essential concept in modern technology and engineering education. Understanding its core components enables effective problem-solving and application development.

### Key Points
- **Core Concepts**: Fundamentals of Machine Learning Fundamentals.
- **Best Practices**: Implementation standards.
- **Workflow**: Practical application and deployment.',
  TRUE
) ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title;

INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000034000001',
  '00000000-0000-4000-a000-000000000034',
  'Q1. What is the primary definition of Machine Learning Fundamentals?',
  'Hardcoding static binary files without backup in Machine Learning Fundamentals.',
  'Legacy manual processing for Machine Learning Fundamentals.',
  'Bypassing standard security checks and protocols in Machine Learning Fundamentals.',
  'A core technology or standard designed for managing and executing Machine Learning Fundamentals processes.',
  'D',
  'Option D is correct. A core technology or standard designed for managing and executing Machine Learning Fundamentals processes.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000034000002',
  '00000000-0000-4000-a000-000000000034',
  'Q2. Which key benefit is provided by Machine Learning Fundamentals?',
  'Legacy manual processing for Machine Learning Fundamentals.',
  'Improved efficiency, scalability, modularity, and operational reliability.',
  'Bypassing standard security checks and protocols in Machine Learning Fundamentals.',
  'Hardcoding static binary files without backup in Machine Learning Fundamentals.',
  'B',
  'Option B is correct. Improved efficiency, scalability, modularity, and operational reliability.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000034000003',
  '00000000-0000-4000-a000-000000000034',
  'Q3. What is a fundamental requirement when implementing Machine Learning Fundamentals?',
  'Legacy manual processing for Machine Learning Fundamentals.',
  'Proper system configuration, security protocols, and integration standards.',
  'Bypassing standard security checks and protocols in Machine Learning Fundamentals.',
  'Hardcoding static binary files without backup in Machine Learning Fundamentals.',
  'B',
  'Option B is correct. Proper system configuration, security protocols, and integration standards.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000034000004',
  '00000000-0000-4000-a000-000000000034',
  'Q4. How does Machine Learning Fundamentals handle data and execution states?',
  'Hardcoding static binary files without backup in Machine Learning Fundamentals.',
  'Legacy manual processing for Machine Learning Fundamentals.',
  'Bypassing standard security checks and protocols in Machine Learning Fundamentals.',
  'By utilizing structured schemas, indexes, and optimized execution pipelines.',
  'D',
  'Option D is correct. By utilizing structured schemas, indexes, and optimized execution pipelines.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000034000005',
  '00000000-0000-4000-a000-000000000034',
  'Q5. What is a recommended best practice when deploying Machine Learning Fundamentals?',
  'Conducting regular automated testing, logging, and monitoring checks.',
  'Legacy manual processing for Machine Learning Fundamentals.',
  'Bypassing standard security checks and protocols in Machine Learning Fundamentals.',
  'Hardcoding static binary files without backup in Machine Learning Fundamentals.',
  'A',
  'Option A is correct. Conducting regular automated testing, logging, and monitoring checks.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000034000006',
  '00000000-0000-4000-a000-000000000034',
  'Q6. Which layer or component plays a vital role in Machine Learning Fundamentals?',
  'Bypassing standard security checks and protocols in Machine Learning Fundamentals.',
  'Legacy manual processing for Machine Learning Fundamentals.',
  'The central execution handler and protocol controller.',
  'Hardcoding static binary files without backup in Machine Learning Fundamentals.',
  'C',
  'Option C is correct. The central execution handler and protocol controller.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000034000007',
  '00000000-0000-4000-a000-000000000034',
  'Q7. What is a common bottleneck or challenge in Machine Learning Fundamentals?',
  'Hardcoding static binary files without backup in Machine Learning Fundamentals.',
  'Legacy manual processing for Machine Learning Fundamentals.',
  'Bypassing standard security checks and protocols in Machine Learning Fundamentals.',
  'Managing system state synchronization and resource contention under heavy load.',
  'D',
  'Option D is correct. Managing system state synchronization and resource contention under heavy load.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000034000008',
  '00000000-0000-4000-a000-000000000034',
  'Q8. How is security typically enforced within Machine Learning Fundamentals?',
  'Bypassing standard security checks and protocols in Machine Learning Fundamentals.',
  'Legacy manual processing for Machine Learning Fundamentals.',
  'Through strong authentication, access control permissions, and data encryption.',
  'Hardcoding static binary files without backup in Machine Learning Fundamentals.',
  'C',
  'Option C is correct. Through strong authentication, access control permissions, and data encryption.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000034000009',
  '00000000-0000-4000-a000-000000000034',
  'Q9. Which metric is critical for measuring the performance of Machine Learning Fundamentals?',
  'Bypassing standard security checks and protocols in Machine Learning Fundamentals.',
  'Legacy manual processing for Machine Learning Fundamentals.',
  'Response latency, throughput, resource utilization, and error rates.',
  'Hardcoding static binary files without backup in Machine Learning Fundamentals.',
  'C',
  'Option C is correct. Response latency, throughput, resource utilization, and error rates.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000034000010',
  '00000000-0000-4000-a000-000000000034',
  'Q10. What is the role of versioning in Machine Learning Fundamentals?',
  'Bypassing standard security checks and protocols in Machine Learning Fundamentals.',
  'Legacy manual processing for Machine Learning Fundamentals.',
  'To support safe updates, maintain backward compatibility, and enable rollbacks.',
  'Hardcoding static binary files without backup in Machine Learning Fundamentals.',
  'C',
  'Option C is correct. To support safe updates, maintain backward compatibility, and enable rollbacks.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000034000011',
  '00000000-0000-4000-a000-000000000034',
  'Q11. In what scenario is Machine Learning Fundamentals most effectively applied?',
  'Bypassing standard security checks and protocols in Machine Learning Fundamentals.',
  'Legacy manual processing for Machine Learning Fundamentals.',
  'In modern scalable enterprise systems requiring structured workflows and reliability.',
  'Hardcoding static binary files without backup in Machine Learning Fundamentals.',
  'C',
  'Option C is correct. In modern scalable enterprise systems requiring structured workflows and reliability.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000034000012',
  '00000000-0000-4000-a000-000000000034',
  'Q12. Which tool or interface is standard for interacting with Machine Learning Fundamentals?',
  'Legacy manual processing for Machine Learning Fundamentals.',
  'Dedicated command line tools, SDK APIs, and management dashboards.',
  'Bypassing standard security checks and protocols in Machine Learning Fundamentals.',
  'Hardcoding static binary files without backup in Machine Learning Fundamentals.',
  'B',
  'Option B is correct. Dedicated command line tools, SDK APIs, and management dashboards.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000034000013',
  '00000000-0000-4000-a000-000000000034',
  'Q13. What is the initial phase when developing with Machine Learning Fundamentals?',
  'Bypassing standard security checks and protocols in Machine Learning Fundamentals.',
  'Legacy manual processing for Machine Learning Fundamentals.',
  'Defining requirements, setting up the development environment, and configuring dependencies.',
  'Hardcoding static binary files without backup in Machine Learning Fundamentals.',
  'C',
  'Option C is correct. Defining requirements, setting up the development environment, and configuring dependencies.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000034000014',
  '00000000-0000-4000-a000-000000000034',
  'Q14. Which debugging technique is recommended for Machine Learning Fundamentals?',
  'Bypassing standard security checks and protocols in Machine Learning Fundamentals.',
  'Legacy manual processing for Machine Learning Fundamentals.',
  'Inspecting log trace files, using debugger tools, and verifying stack traces.',
  'Hardcoding static binary files without backup in Machine Learning Fundamentals.',
  'C',
  'Option C is correct. Inspecting log trace files, using debugger tools, and verifying stack traces.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000034000015',
  '00000000-0000-4000-a000-000000000034',
  'Q15. What is the overall goal of mastering Machine Learning Fundamentals?',
  'Legacy manual processing for Machine Learning Fundamentals.',
  'To design, build, and maintain production-ready technology solutions.',
  'Bypassing standard security checks and protocols in Machine Learning Fundamentals.',
  'Hardcoding static binary files without backup in Machine Learning Fundamentals.',
  'B',
  'Option B is correct. To design, build, and maintain production-ready technology solutions.'
);

-- Quick Learn 35: Deep Learning & Neural Networks
INSERT INTO public.quick_learn_lessons (id, title, slug, branch, category, difficulty, estimated_minutes, is_recommended, fx_reward, short_description, content_markdown, is_published)
VALUES (
  '00000000-0000-4000-a000-000000000035',
  'Deep Learning & Neural Networks',
  'deep-learning-neural-networks',
  'AI & ML',
  'AI',
  'Advanced',
  3,
  TRUE,
  10,
  'Master Deep Learning & Neural Networks fundamentals with quick reading and 15 practice MCQs on FEEDX.',
  '### Learning Text
Deep Learning & Neural Networks is an essential concept in modern technology and engineering education. Understanding its core components enables effective problem-solving and application development.

### Key Points
- **Core Concepts**: Fundamentals of Deep Learning & Neural Networks.
- **Best Practices**: Implementation standards.
- **Workflow**: Practical application and deployment.',
  TRUE
) ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title;

INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000035000001',
  '00000000-0000-4000-a000-000000000035',
  'Q1. What is the primary definition of Deep Learning & Neural Networks?',
  'Legacy manual processing for Deep Learning & Neural Networks.',
  'A core technology or standard designed for managing and executing Deep Learning & Neural Networks processes.',
  'Bypassing standard security checks and protocols in Deep Learning & Neural Networks.',
  'Hardcoding static binary files without backup in Deep Learning & Neural Networks.',
  'B',
  'Option B is correct. A core technology or standard designed for managing and executing Deep Learning & Neural Networks processes.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000035000002',
  '00000000-0000-4000-a000-000000000035',
  'Q2. Which key benefit is provided by Deep Learning & Neural Networks?',
  'Bypassing standard security checks and protocols in Deep Learning & Neural Networks.',
  'Legacy manual processing for Deep Learning & Neural Networks.',
  'Improved efficiency, scalability, modularity, and operational reliability.',
  'Hardcoding static binary files without backup in Deep Learning & Neural Networks.',
  'C',
  'Option C is correct. Improved efficiency, scalability, modularity, and operational reliability.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000035000003',
  '00000000-0000-4000-a000-000000000035',
  'Q3. What is a fundamental requirement when implementing Deep Learning & Neural Networks?',
  'Hardcoding static binary files without backup in Deep Learning & Neural Networks.',
  'Legacy manual processing for Deep Learning & Neural Networks.',
  'Bypassing standard security checks and protocols in Deep Learning & Neural Networks.',
  'Proper system configuration, security protocols, and integration standards.',
  'D',
  'Option D is correct. Proper system configuration, security protocols, and integration standards.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000035000004',
  '00000000-0000-4000-a000-000000000035',
  'Q4. How does Deep Learning & Neural Networks handle data and execution states?',
  'Legacy manual processing for Deep Learning & Neural Networks.',
  'By utilizing structured schemas, indexes, and optimized execution pipelines.',
  'Bypassing standard security checks and protocols in Deep Learning & Neural Networks.',
  'Hardcoding static binary files without backup in Deep Learning & Neural Networks.',
  'B',
  'Option B is correct. By utilizing structured schemas, indexes, and optimized execution pipelines.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000035000005',
  '00000000-0000-4000-a000-000000000035',
  'Q5. What is a recommended best practice when deploying Deep Learning & Neural Networks?',
  'Conducting regular automated testing, logging, and monitoring checks.',
  'Legacy manual processing for Deep Learning & Neural Networks.',
  'Bypassing standard security checks and protocols in Deep Learning & Neural Networks.',
  'Hardcoding static binary files without backup in Deep Learning & Neural Networks.',
  'A',
  'Option A is correct. Conducting regular automated testing, logging, and monitoring checks.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000035000006',
  '00000000-0000-4000-a000-000000000035',
  'Q6. Which layer or component plays a vital role in Deep Learning & Neural Networks?',
  'Hardcoding static binary files without backup in Deep Learning & Neural Networks.',
  'Legacy manual processing for Deep Learning & Neural Networks.',
  'Bypassing standard security checks and protocols in Deep Learning & Neural Networks.',
  'The central execution handler and protocol controller.',
  'D',
  'Option D is correct. The central execution handler and protocol controller.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000035000007',
  '00000000-0000-4000-a000-000000000035',
  'Q7. What is a common bottleneck or challenge in Deep Learning & Neural Networks?',
  'Hardcoding static binary files without backup in Deep Learning & Neural Networks.',
  'Legacy manual processing for Deep Learning & Neural Networks.',
  'Bypassing standard security checks and protocols in Deep Learning & Neural Networks.',
  'Managing system state synchronization and resource contention under heavy load.',
  'D',
  'Option D is correct. Managing system state synchronization and resource contention under heavy load.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000035000008',
  '00000000-0000-4000-a000-000000000035',
  'Q8. How is security typically enforced within Deep Learning & Neural Networks?',
  'Legacy manual processing for Deep Learning & Neural Networks.',
  'Through strong authentication, access control permissions, and data encryption.',
  'Bypassing standard security checks and protocols in Deep Learning & Neural Networks.',
  'Hardcoding static binary files without backup in Deep Learning & Neural Networks.',
  'B',
  'Option B is correct. Through strong authentication, access control permissions, and data encryption.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000035000009',
  '00000000-0000-4000-a000-000000000035',
  'Q9. Which metric is critical for measuring the performance of Deep Learning & Neural Networks?',
  'Response latency, throughput, resource utilization, and error rates.',
  'Legacy manual processing for Deep Learning & Neural Networks.',
  'Bypassing standard security checks and protocols in Deep Learning & Neural Networks.',
  'Hardcoding static binary files without backup in Deep Learning & Neural Networks.',
  'A',
  'Option A is correct. Response latency, throughput, resource utilization, and error rates.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000035000010',
  '00000000-0000-4000-a000-000000000035',
  'Q10. What is the role of versioning in Deep Learning & Neural Networks?',
  'Legacy manual processing for Deep Learning & Neural Networks.',
  'To support safe updates, maintain backward compatibility, and enable rollbacks.',
  'Bypassing standard security checks and protocols in Deep Learning & Neural Networks.',
  'Hardcoding static binary files without backup in Deep Learning & Neural Networks.',
  'B',
  'Option B is correct. To support safe updates, maintain backward compatibility, and enable rollbacks.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000035000011',
  '00000000-0000-4000-a000-000000000035',
  'Q11. In what scenario is Deep Learning & Neural Networks most effectively applied?',
  'Bypassing standard security checks and protocols in Deep Learning & Neural Networks.',
  'Legacy manual processing for Deep Learning & Neural Networks.',
  'In modern scalable enterprise systems requiring structured workflows and reliability.',
  'Hardcoding static binary files without backup in Deep Learning & Neural Networks.',
  'C',
  'Option C is correct. In modern scalable enterprise systems requiring structured workflows and reliability.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000035000012',
  '00000000-0000-4000-a000-000000000035',
  'Q12. Which tool or interface is standard for interacting with Deep Learning & Neural Networks?',
  'Bypassing standard security checks and protocols in Deep Learning & Neural Networks.',
  'Legacy manual processing for Deep Learning & Neural Networks.',
  'Dedicated command line tools, SDK APIs, and management dashboards.',
  'Hardcoding static binary files without backup in Deep Learning & Neural Networks.',
  'C',
  'Option C is correct. Dedicated command line tools, SDK APIs, and management dashboards.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000035000013',
  '00000000-0000-4000-a000-000000000035',
  'Q13. What is the initial phase when developing with Deep Learning & Neural Networks?',
  'Legacy manual processing for Deep Learning & Neural Networks.',
  'Defining requirements, setting up the development environment, and configuring dependencies.',
  'Bypassing standard security checks and protocols in Deep Learning & Neural Networks.',
  'Hardcoding static binary files without backup in Deep Learning & Neural Networks.',
  'B',
  'Option B is correct. Defining requirements, setting up the development environment, and configuring dependencies.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000035000014',
  '00000000-0000-4000-a000-000000000035',
  'Q14. Which debugging technique is recommended for Deep Learning & Neural Networks?',
  'Legacy manual processing for Deep Learning & Neural Networks.',
  'Inspecting log trace files, using debugger tools, and verifying stack traces.',
  'Bypassing standard security checks and protocols in Deep Learning & Neural Networks.',
  'Hardcoding static binary files without backup in Deep Learning & Neural Networks.',
  'B',
  'Option B is correct. Inspecting log trace files, using debugger tools, and verifying stack traces.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000035000015',
  '00000000-0000-4000-a000-000000000035',
  'Q15. What is the overall goal of mastering Deep Learning & Neural Networks?',
  'To design, build, and maintain production-ready technology solutions.',
  'Legacy manual processing for Deep Learning & Neural Networks.',
  'Bypassing standard security checks and protocols in Deep Learning & Neural Networks.',
  'Hardcoding static binary files without backup in Deep Learning & Neural Networks.',
  'A',
  'Option A is correct. To design, build, and maintain production-ready technology solutions.'
);

-- Quick Learn 36: Web Security & OWASP Top 10
INSERT INTO public.quick_learn_lessons (id, title, slug, branch, category, difficulty, estimated_minutes, is_recommended, fx_reward, short_description, content_markdown, is_published)
VALUES (
  '00000000-0000-4000-a000-000000000036',
  'Web Security & OWASP Top 10',
  'web-security-owasp-top-10',
  'CSE',
  'Security',
  'Advanced',
  3,
  TRUE,
  10,
  'Master Web Security & OWASP Top 10 fundamentals with quick reading and 15 practice MCQs on FEEDX.',
  '### Learning Text
Web Security & OWASP Top 10 is an essential concept in modern technology and engineering education. Understanding its core components enables effective problem-solving and application development.

### Key Points
- **Core Concepts**: Fundamentals of Web Security & OWASP Top 10.
- **Best Practices**: Implementation standards.
- **Workflow**: Practical application and deployment.',
  TRUE
) ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title;

INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000036000001',
  '00000000-0000-4000-a000-000000000036',
  'Q1. What is the primary definition of Web Security & OWASP Top 10?',
  'Legacy manual processing for Web Security & OWASP Top 10.',
  'A core technology or standard designed for managing and executing Web Security & OWASP Top 10 processes.',
  'Bypassing standard security checks and protocols in Web Security & OWASP Top 10.',
  'Hardcoding static binary files without backup in Web Security & OWASP Top 10.',
  'B',
  'Option B is correct. A core technology or standard designed for managing and executing Web Security & OWASP Top 10 processes.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000036000002',
  '00000000-0000-4000-a000-000000000036',
  'Q2. Which key benefit is provided by Web Security & OWASP Top 10?',
  'Hardcoding static binary files without backup in Web Security & OWASP Top 10.',
  'Legacy manual processing for Web Security & OWASP Top 10.',
  'Bypassing standard security checks and protocols in Web Security & OWASP Top 10.',
  'Improved efficiency, scalability, modularity, and operational reliability.',
  'D',
  'Option D is correct. Improved efficiency, scalability, modularity, and operational reliability.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000036000003',
  '00000000-0000-4000-a000-000000000036',
  'Q3. What is a fundamental requirement when implementing Web Security & OWASP Top 10?',
  'Legacy manual processing for Web Security & OWASP Top 10.',
  'Proper system configuration, security protocols, and integration standards.',
  'Bypassing standard security checks and protocols in Web Security & OWASP Top 10.',
  'Hardcoding static binary files without backup in Web Security & OWASP Top 10.',
  'B',
  'Option B is correct. Proper system configuration, security protocols, and integration standards.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000036000004',
  '00000000-0000-4000-a000-000000000036',
  'Q4. How does Web Security & OWASP Top 10 handle data and execution states?',
  'Legacy manual processing for Web Security & OWASP Top 10.',
  'By utilizing structured schemas, indexes, and optimized execution pipelines.',
  'Bypassing standard security checks and protocols in Web Security & OWASP Top 10.',
  'Hardcoding static binary files without backup in Web Security & OWASP Top 10.',
  'B',
  'Option B is correct. By utilizing structured schemas, indexes, and optimized execution pipelines.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000036000005',
  '00000000-0000-4000-a000-000000000036',
  'Q5. What is a recommended best practice when deploying Web Security & OWASP Top 10?',
  'Hardcoding static binary files without backup in Web Security & OWASP Top 10.',
  'Legacy manual processing for Web Security & OWASP Top 10.',
  'Bypassing standard security checks and protocols in Web Security & OWASP Top 10.',
  'Conducting regular automated testing, logging, and monitoring checks.',
  'D',
  'Option D is correct. Conducting regular automated testing, logging, and monitoring checks.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000036000006',
  '00000000-0000-4000-a000-000000000036',
  'Q6. Which layer or component plays a vital role in Web Security & OWASP Top 10?',
  'Legacy manual processing for Web Security & OWASP Top 10.',
  'The central execution handler and protocol controller.',
  'Bypassing standard security checks and protocols in Web Security & OWASP Top 10.',
  'Hardcoding static binary files without backup in Web Security & OWASP Top 10.',
  'B',
  'Option B is correct. The central execution handler and protocol controller.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000036000007',
  '00000000-0000-4000-a000-000000000036',
  'Q7. What is a common bottleneck or challenge in Web Security & OWASP Top 10?',
  'Bypassing standard security checks and protocols in Web Security & OWASP Top 10.',
  'Legacy manual processing for Web Security & OWASP Top 10.',
  'Managing system state synchronization and resource contention under heavy load.',
  'Hardcoding static binary files without backup in Web Security & OWASP Top 10.',
  'C',
  'Option C is correct. Managing system state synchronization and resource contention under heavy load.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000036000008',
  '00000000-0000-4000-a000-000000000036',
  'Q8. How is security typically enforced within Web Security & OWASP Top 10?',
  'Through strong authentication, access control permissions, and data encryption.',
  'Legacy manual processing for Web Security & OWASP Top 10.',
  'Bypassing standard security checks and protocols in Web Security & OWASP Top 10.',
  'Hardcoding static binary files without backup in Web Security & OWASP Top 10.',
  'A',
  'Option A is correct. Through strong authentication, access control permissions, and data encryption.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000036000009',
  '00000000-0000-4000-a000-000000000036',
  'Q9. Which metric is critical for measuring the performance of Web Security & OWASP Top 10?',
  'Legacy manual processing for Web Security & OWASP Top 10.',
  'Response latency, throughput, resource utilization, and error rates.',
  'Bypassing standard security checks and protocols in Web Security & OWASP Top 10.',
  'Hardcoding static binary files without backup in Web Security & OWASP Top 10.',
  'B',
  'Option B is correct. Response latency, throughput, resource utilization, and error rates.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000036000010',
  '00000000-0000-4000-a000-000000000036',
  'Q10. What is the role of versioning in Web Security & OWASP Top 10?',
  'To support safe updates, maintain backward compatibility, and enable rollbacks.',
  'Legacy manual processing for Web Security & OWASP Top 10.',
  'Bypassing standard security checks and protocols in Web Security & OWASP Top 10.',
  'Hardcoding static binary files without backup in Web Security & OWASP Top 10.',
  'A',
  'Option A is correct. To support safe updates, maintain backward compatibility, and enable rollbacks.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000036000011',
  '00000000-0000-4000-a000-000000000036',
  'Q11. In what scenario is Web Security & OWASP Top 10 most effectively applied?',
  'Hardcoding static binary files without backup in Web Security & OWASP Top 10.',
  'Legacy manual processing for Web Security & OWASP Top 10.',
  'Bypassing standard security checks and protocols in Web Security & OWASP Top 10.',
  'In modern scalable enterprise systems requiring structured workflows and reliability.',
  'D',
  'Option D is correct. In modern scalable enterprise systems requiring structured workflows and reliability.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000036000012',
  '00000000-0000-4000-a000-000000000036',
  'Q12. Which tool or interface is standard for interacting with Web Security & OWASP Top 10?',
  'Bypassing standard security checks and protocols in Web Security & OWASP Top 10.',
  'Legacy manual processing for Web Security & OWASP Top 10.',
  'Dedicated command line tools, SDK APIs, and management dashboards.',
  'Hardcoding static binary files without backup in Web Security & OWASP Top 10.',
  'C',
  'Option C is correct. Dedicated command line tools, SDK APIs, and management dashboards.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000036000013',
  '00000000-0000-4000-a000-000000000036',
  'Q13. What is the initial phase when developing with Web Security & OWASP Top 10?',
  'Legacy manual processing for Web Security & OWASP Top 10.',
  'Defining requirements, setting up the development environment, and configuring dependencies.',
  'Bypassing standard security checks and protocols in Web Security & OWASP Top 10.',
  'Hardcoding static binary files without backup in Web Security & OWASP Top 10.',
  'B',
  'Option B is correct. Defining requirements, setting up the development environment, and configuring dependencies.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000036000014',
  '00000000-0000-4000-a000-000000000036',
  'Q14. Which debugging technique is recommended for Web Security & OWASP Top 10?',
  'Hardcoding static binary files without backup in Web Security & OWASP Top 10.',
  'Legacy manual processing for Web Security & OWASP Top 10.',
  'Bypassing standard security checks and protocols in Web Security & OWASP Top 10.',
  'Inspecting log trace files, using debugger tools, and verifying stack traces.',
  'D',
  'Option D is correct. Inspecting log trace files, using debugger tools, and verifying stack traces.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000036000015',
  '00000000-0000-4000-a000-000000000036',
  'Q15. What is the overall goal of mastering Web Security & OWASP Top 10?',
  'Hardcoding static binary files without backup in Web Security & OWASP Top 10.',
  'Legacy manual processing for Web Security & OWASP Top 10.',
  'Bypassing standard security checks and protocols in Web Security & OWASP Top 10.',
  'To design, build, and maintain production-ready technology solutions.',
  'D',
  'Option D is correct. To design, build, and maintain production-ready technology solutions.'
);

-- Quick Learn 37: Information Security & Cryptography
INSERT INTO public.quick_learn_lessons (id, title, slug, branch, category, difficulty, estimated_minutes, is_recommended, fx_reward, short_description, content_markdown, is_published)
VALUES (
  '00000000-0000-4000-a000-000000000037',
  'Information Security & Cryptography',
  'information-security-cryptography',
  'CSE',
  'Security',
  'Intermediate',
  3,
  TRUE,
  10,
  'Master Information Security & Cryptography fundamentals with quick reading and 15 practice MCQs on FEEDX.',
  '### Learning Text
Information Security & Cryptography is an essential concept in modern technology and engineering education. Understanding its core components enables effective problem-solving and application development.

### Key Points
- **Core Concepts**: Fundamentals of Information Security & Cryptography.
- **Best Practices**: Implementation standards.
- **Workflow**: Practical application and deployment.',
  TRUE
) ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title;

INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000037000001',
  '00000000-0000-4000-a000-000000000037',
  'Q1. What is the primary definition of Information Security & Cryptography?',
  'Legacy manual processing for Information Security & Cryptography.',
  'A core technology or standard designed for managing and executing Information Security & Cryptography processes.',
  'Bypassing standard security checks and protocols in Information Security & Cryptography.',
  'Hardcoding static binary files without backup in Information Security & Cryptography.',
  'B',
  'Option B is correct. A core technology or standard designed for managing and executing Information Security & Cryptography processes.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000037000002',
  '00000000-0000-4000-a000-000000000037',
  'Q2. Which key benefit is provided by Information Security & Cryptography?',
  'Improved efficiency, scalability, modularity, and operational reliability.',
  'Legacy manual processing for Information Security & Cryptography.',
  'Bypassing standard security checks and protocols in Information Security & Cryptography.',
  'Hardcoding static binary files without backup in Information Security & Cryptography.',
  'A',
  'Option A is correct. Improved efficiency, scalability, modularity, and operational reliability.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000037000003',
  '00000000-0000-4000-a000-000000000037',
  'Q3. What is a fundamental requirement when implementing Information Security & Cryptography?',
  'Proper system configuration, security protocols, and integration standards.',
  'Legacy manual processing for Information Security & Cryptography.',
  'Bypassing standard security checks and protocols in Information Security & Cryptography.',
  'Hardcoding static binary files without backup in Information Security & Cryptography.',
  'A',
  'Option A is correct. Proper system configuration, security protocols, and integration standards.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000037000004',
  '00000000-0000-4000-a000-000000000037',
  'Q4. How does Information Security & Cryptography handle data and execution states?',
  'Legacy manual processing for Information Security & Cryptography.',
  'By utilizing structured schemas, indexes, and optimized execution pipelines.',
  'Bypassing standard security checks and protocols in Information Security & Cryptography.',
  'Hardcoding static binary files without backup in Information Security & Cryptography.',
  'B',
  'Option B is correct. By utilizing structured schemas, indexes, and optimized execution pipelines.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000037000005',
  '00000000-0000-4000-a000-000000000037',
  'Q5. What is a recommended best practice when deploying Information Security & Cryptography?',
  'Hardcoding static binary files without backup in Information Security & Cryptography.',
  'Legacy manual processing for Information Security & Cryptography.',
  'Bypassing standard security checks and protocols in Information Security & Cryptography.',
  'Conducting regular automated testing, logging, and monitoring checks.',
  'D',
  'Option D is correct. Conducting regular automated testing, logging, and monitoring checks.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000037000006',
  '00000000-0000-4000-a000-000000000037',
  'Q6. Which layer or component plays a vital role in Information Security & Cryptography?',
  'Bypassing standard security checks and protocols in Information Security & Cryptography.',
  'Legacy manual processing for Information Security & Cryptography.',
  'The central execution handler and protocol controller.',
  'Hardcoding static binary files without backup in Information Security & Cryptography.',
  'C',
  'Option C is correct. The central execution handler and protocol controller.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000037000007',
  '00000000-0000-4000-a000-000000000037',
  'Q7. What is a common bottleneck or challenge in Information Security & Cryptography?',
  'Legacy manual processing for Information Security & Cryptography.',
  'Managing system state synchronization and resource contention under heavy load.',
  'Bypassing standard security checks and protocols in Information Security & Cryptography.',
  'Hardcoding static binary files without backup in Information Security & Cryptography.',
  'B',
  'Option B is correct. Managing system state synchronization and resource contention under heavy load.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000037000008',
  '00000000-0000-4000-a000-000000000037',
  'Q8. How is security typically enforced within Information Security & Cryptography?',
  'Bypassing standard security checks and protocols in Information Security & Cryptography.',
  'Legacy manual processing for Information Security & Cryptography.',
  'Through strong authentication, access control permissions, and data encryption.',
  'Hardcoding static binary files without backup in Information Security & Cryptography.',
  'C',
  'Option C is correct. Through strong authentication, access control permissions, and data encryption.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000037000009',
  '00000000-0000-4000-a000-000000000037',
  'Q9. Which metric is critical for measuring the performance of Information Security & Cryptography?',
  'Response latency, throughput, resource utilization, and error rates.',
  'Legacy manual processing for Information Security & Cryptography.',
  'Bypassing standard security checks and protocols in Information Security & Cryptography.',
  'Hardcoding static binary files without backup in Information Security & Cryptography.',
  'A',
  'Option A is correct. Response latency, throughput, resource utilization, and error rates.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000037000010',
  '00000000-0000-4000-a000-000000000037',
  'Q10. What is the role of versioning in Information Security & Cryptography?',
  'Bypassing standard security checks and protocols in Information Security & Cryptography.',
  'Legacy manual processing for Information Security & Cryptography.',
  'To support safe updates, maintain backward compatibility, and enable rollbacks.',
  'Hardcoding static binary files without backup in Information Security & Cryptography.',
  'C',
  'Option C is correct. To support safe updates, maintain backward compatibility, and enable rollbacks.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000037000011',
  '00000000-0000-4000-a000-000000000037',
  'Q11. In what scenario is Information Security & Cryptography most effectively applied?',
  'Hardcoding static binary files without backup in Information Security & Cryptography.',
  'Legacy manual processing for Information Security & Cryptography.',
  'Bypassing standard security checks and protocols in Information Security & Cryptography.',
  'In modern scalable enterprise systems requiring structured workflows and reliability.',
  'D',
  'Option D is correct. In modern scalable enterprise systems requiring structured workflows and reliability.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000037000012',
  '00000000-0000-4000-a000-000000000037',
  'Q12. Which tool or interface is standard for interacting with Information Security & Cryptography?',
  'Hardcoding static binary files without backup in Information Security & Cryptography.',
  'Legacy manual processing for Information Security & Cryptography.',
  'Bypassing standard security checks and protocols in Information Security & Cryptography.',
  'Dedicated command line tools, SDK APIs, and management dashboards.',
  'D',
  'Option D is correct. Dedicated command line tools, SDK APIs, and management dashboards.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000037000013',
  '00000000-0000-4000-a000-000000000037',
  'Q13. What is the initial phase when developing with Information Security & Cryptography?',
  'Bypassing standard security checks and protocols in Information Security & Cryptography.',
  'Legacy manual processing for Information Security & Cryptography.',
  'Defining requirements, setting up the development environment, and configuring dependencies.',
  'Hardcoding static binary files without backup in Information Security & Cryptography.',
  'C',
  'Option C is correct. Defining requirements, setting up the development environment, and configuring dependencies.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000037000014',
  '00000000-0000-4000-a000-000000000037',
  'Q14. Which debugging technique is recommended for Information Security & Cryptography?',
  'Hardcoding static binary files without backup in Information Security & Cryptography.',
  'Legacy manual processing for Information Security & Cryptography.',
  'Bypassing standard security checks and protocols in Information Security & Cryptography.',
  'Inspecting log trace files, using debugger tools, and verifying stack traces.',
  'D',
  'Option D is correct. Inspecting log trace files, using debugger tools, and verifying stack traces.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000037000015',
  '00000000-0000-4000-a000-000000000037',
  'Q15. What is the overall goal of mastering Information Security & Cryptography?',
  'To design, build, and maintain production-ready technology solutions.',
  'Legacy manual processing for Information Security & Cryptography.',
  'Bypassing standard security checks and protocols in Information Security & Cryptography.',
  'Hardcoding static binary files without backup in Information Security & Cryptography.',
  'A',
  'Option A is correct. To design, build, and maintain production-ready technology solutions.'
);

-- Quick Learn 38: ESP32 & IoT Hardware
INSERT INTO public.quick_learn_lessons (id, title, slug, branch, category, difficulty, estimated_minutes, is_recommended, fx_reward, short_description, content_markdown, is_published)
VALUES (
  '00000000-0000-4000-a000-000000000038',
  'ESP32 & IoT Hardware',
  'esp32-iot-hardware',
  'ECE',
  'IoT',
  'Intermediate',
  3,
  TRUE,
  10,
  'Master ESP32 & IoT Hardware fundamentals with quick reading and 15 practice MCQs on FEEDX.',
  '### Learning Text
ESP32 & IoT Hardware is an essential concept in modern technology and engineering education. Understanding its core components enables effective problem-solving and application development.

### Key Points
- **Core Concepts**: Fundamentals of ESP32 & IoT Hardware.
- **Best Practices**: Implementation standards.
- **Workflow**: Practical application and deployment.',
  TRUE
) ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title;

INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000038000001',
  '00000000-0000-4000-a000-000000000038',
  'Q1. What is the primary definition of ESP32 & IoT Hardware?',
  'Hardcoding static binary files without backup in ESP32 & IoT Hardware.',
  'Legacy manual processing for ESP32 & IoT Hardware.',
  'Bypassing standard security checks and protocols in ESP32 & IoT Hardware.',
  'A core technology or standard designed for managing and executing ESP32 & IoT Hardware processes.',
  'D',
  'Option D is correct. A core technology or standard designed for managing and executing ESP32 & IoT Hardware processes.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000038000002',
  '00000000-0000-4000-a000-000000000038',
  'Q2. Which key benefit is provided by ESP32 & IoT Hardware?',
  'Bypassing standard security checks and protocols in ESP32 & IoT Hardware.',
  'Legacy manual processing for ESP32 & IoT Hardware.',
  'Improved efficiency, scalability, modularity, and operational reliability.',
  'Hardcoding static binary files without backup in ESP32 & IoT Hardware.',
  'C',
  'Option C is correct. Improved efficiency, scalability, modularity, and operational reliability.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000038000003',
  '00000000-0000-4000-a000-000000000038',
  'Q3. What is a fundamental requirement when implementing ESP32 & IoT Hardware?',
  'Hardcoding static binary files without backup in ESP32 & IoT Hardware.',
  'Legacy manual processing for ESP32 & IoT Hardware.',
  'Bypassing standard security checks and protocols in ESP32 & IoT Hardware.',
  'Proper system configuration, security protocols, and integration standards.',
  'D',
  'Option D is correct. Proper system configuration, security protocols, and integration standards.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000038000004',
  '00000000-0000-4000-a000-000000000038',
  'Q4. How does ESP32 & IoT Hardware handle data and execution states?',
  'Hardcoding static binary files without backup in ESP32 & IoT Hardware.',
  'Legacy manual processing for ESP32 & IoT Hardware.',
  'Bypassing standard security checks and protocols in ESP32 & IoT Hardware.',
  'By utilizing structured schemas, indexes, and optimized execution pipelines.',
  'D',
  'Option D is correct. By utilizing structured schemas, indexes, and optimized execution pipelines.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000038000005',
  '00000000-0000-4000-a000-000000000038',
  'Q5. What is a recommended best practice when deploying ESP32 & IoT Hardware?',
  'Bypassing standard security checks and protocols in ESP32 & IoT Hardware.',
  'Legacy manual processing for ESP32 & IoT Hardware.',
  'Conducting regular automated testing, logging, and monitoring checks.',
  'Hardcoding static binary files without backup in ESP32 & IoT Hardware.',
  'C',
  'Option C is correct. Conducting regular automated testing, logging, and monitoring checks.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000038000006',
  '00000000-0000-4000-a000-000000000038',
  'Q6. Which layer or component plays a vital role in ESP32 & IoT Hardware?',
  'The central execution handler and protocol controller.',
  'Legacy manual processing for ESP32 & IoT Hardware.',
  'Bypassing standard security checks and protocols in ESP32 & IoT Hardware.',
  'Hardcoding static binary files without backup in ESP32 & IoT Hardware.',
  'A',
  'Option A is correct. The central execution handler and protocol controller.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000038000007',
  '00000000-0000-4000-a000-000000000038',
  'Q7. What is a common bottleneck or challenge in ESP32 & IoT Hardware?',
  'Hardcoding static binary files without backup in ESP32 & IoT Hardware.',
  'Legacy manual processing for ESP32 & IoT Hardware.',
  'Bypassing standard security checks and protocols in ESP32 & IoT Hardware.',
  'Managing system state synchronization and resource contention under heavy load.',
  'D',
  'Option D is correct. Managing system state synchronization and resource contention under heavy load.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000038000008',
  '00000000-0000-4000-a000-000000000038',
  'Q8. How is security typically enforced within ESP32 & IoT Hardware?',
  'Legacy manual processing for ESP32 & IoT Hardware.',
  'Through strong authentication, access control permissions, and data encryption.',
  'Bypassing standard security checks and protocols in ESP32 & IoT Hardware.',
  'Hardcoding static binary files without backup in ESP32 & IoT Hardware.',
  'B',
  'Option B is correct. Through strong authentication, access control permissions, and data encryption.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000038000009',
  '00000000-0000-4000-a000-000000000038',
  'Q9. Which metric is critical for measuring the performance of ESP32 & IoT Hardware?',
  'Response latency, throughput, resource utilization, and error rates.',
  'Legacy manual processing for ESP32 & IoT Hardware.',
  'Bypassing standard security checks and protocols in ESP32 & IoT Hardware.',
  'Hardcoding static binary files without backup in ESP32 & IoT Hardware.',
  'A',
  'Option A is correct. Response latency, throughput, resource utilization, and error rates.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000038000010',
  '00000000-0000-4000-a000-000000000038',
  'Q10. What is the role of versioning in ESP32 & IoT Hardware?',
  'Bypassing standard security checks and protocols in ESP32 & IoT Hardware.',
  'Legacy manual processing for ESP32 & IoT Hardware.',
  'To support safe updates, maintain backward compatibility, and enable rollbacks.',
  'Hardcoding static binary files without backup in ESP32 & IoT Hardware.',
  'C',
  'Option C is correct. To support safe updates, maintain backward compatibility, and enable rollbacks.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000038000011',
  '00000000-0000-4000-a000-000000000038',
  'Q11. In what scenario is ESP32 & IoT Hardware most effectively applied?',
  'In modern scalable enterprise systems requiring structured workflows and reliability.',
  'Legacy manual processing for ESP32 & IoT Hardware.',
  'Bypassing standard security checks and protocols in ESP32 & IoT Hardware.',
  'Hardcoding static binary files without backup in ESP32 & IoT Hardware.',
  'A',
  'Option A is correct. In modern scalable enterprise systems requiring structured workflows and reliability.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000038000012',
  '00000000-0000-4000-a000-000000000038',
  'Q12. Which tool or interface is standard for interacting with ESP32 & IoT Hardware?',
  'Bypassing standard security checks and protocols in ESP32 & IoT Hardware.',
  'Legacy manual processing for ESP32 & IoT Hardware.',
  'Dedicated command line tools, SDK APIs, and management dashboards.',
  'Hardcoding static binary files without backup in ESP32 & IoT Hardware.',
  'C',
  'Option C is correct. Dedicated command line tools, SDK APIs, and management dashboards.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000038000013',
  '00000000-0000-4000-a000-000000000038',
  'Q13. What is the initial phase when developing with ESP32 & IoT Hardware?',
  'Legacy manual processing for ESP32 & IoT Hardware.',
  'Defining requirements, setting up the development environment, and configuring dependencies.',
  'Bypassing standard security checks and protocols in ESP32 & IoT Hardware.',
  'Hardcoding static binary files without backup in ESP32 & IoT Hardware.',
  'B',
  'Option B is correct. Defining requirements, setting up the development environment, and configuring dependencies.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000038000014',
  '00000000-0000-4000-a000-000000000038',
  'Q14. Which debugging technique is recommended for ESP32 & IoT Hardware?',
  'Bypassing standard security checks and protocols in ESP32 & IoT Hardware.',
  'Legacy manual processing for ESP32 & IoT Hardware.',
  'Inspecting log trace files, using debugger tools, and verifying stack traces.',
  'Hardcoding static binary files without backup in ESP32 & IoT Hardware.',
  'C',
  'Option C is correct. Inspecting log trace files, using debugger tools, and verifying stack traces.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000038000015',
  '00000000-0000-4000-a000-000000000038',
  'Q15. What is the overall goal of mastering ESP32 & IoT Hardware?',
  'Bypassing standard security checks and protocols in ESP32 & IoT Hardware.',
  'Legacy manual processing for ESP32 & IoT Hardware.',
  'To design, build, and maintain production-ready technology solutions.',
  'Hardcoding static binary files without backup in ESP32 & IoT Hardware.',
  'C',
  'Option C is correct. To design, build, and maintain production-ready technology solutions.'
);

-- Quick Learn 39: Embedded Systems & Microcontrollers
INSERT INTO public.quick_learn_lessons (id, title, slug, branch, category, difficulty, estimated_minutes, is_recommended, fx_reward, short_description, content_markdown, is_published)
VALUES (
  '00000000-0000-4000-a000-000000000039',
  'Embedded Systems & Microcontrollers',
  'embedded-systems-microcontrollers',
  'ECE',
  'Electronics',
  'Intermediate',
  3,
  TRUE,
  10,
  'Master Embedded Systems & Microcontrollers fundamentals with quick reading and 15 practice MCQs on FEEDX.',
  '### Learning Text
Embedded Systems & Microcontrollers is an essential concept in modern technology and engineering education. Understanding its core components enables effective problem-solving and application development.

### Key Points
- **Core Concepts**: Fundamentals of Embedded Systems & Microcontrollers.
- **Best Practices**: Implementation standards.
- **Workflow**: Practical application and deployment.',
  TRUE
) ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title;

INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000039000001',
  '00000000-0000-4000-a000-000000000039',
  'Q1. What is the primary definition of Embedded Systems & Microcontrollers?',
  'A core technology or standard designed for managing and executing Embedded Systems & Microcontrollers processes.',
  'Legacy manual processing for Embedded Systems & Microcontrollers.',
  'Bypassing standard security checks and protocols in Embedded Systems & Microcontrollers.',
  'Hardcoding static binary files without backup in Embedded Systems & Microcontrollers.',
  'A',
  'Option A is correct. A core technology or standard designed for managing and executing Embedded Systems & Microcontrollers processes.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000039000002',
  '00000000-0000-4000-a000-000000000039',
  'Q2. Which key benefit is provided by Embedded Systems & Microcontrollers?',
  'Legacy manual processing for Embedded Systems & Microcontrollers.',
  'Improved efficiency, scalability, modularity, and operational reliability.',
  'Bypassing standard security checks and protocols in Embedded Systems & Microcontrollers.',
  'Hardcoding static binary files without backup in Embedded Systems & Microcontrollers.',
  'B',
  'Option B is correct. Improved efficiency, scalability, modularity, and operational reliability.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000039000003',
  '00000000-0000-4000-a000-000000000039',
  'Q3. What is a fundamental requirement when implementing Embedded Systems & Microcontrollers?',
  'Legacy manual processing for Embedded Systems & Microcontrollers.',
  'Proper system configuration, security protocols, and integration standards.',
  'Bypassing standard security checks and protocols in Embedded Systems & Microcontrollers.',
  'Hardcoding static binary files without backup in Embedded Systems & Microcontrollers.',
  'B',
  'Option B is correct. Proper system configuration, security protocols, and integration standards.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000039000004',
  '00000000-0000-4000-a000-000000000039',
  'Q4. How does Embedded Systems & Microcontrollers handle data and execution states?',
  'Bypassing standard security checks and protocols in Embedded Systems & Microcontrollers.',
  'Legacy manual processing for Embedded Systems & Microcontrollers.',
  'By utilizing structured schemas, indexes, and optimized execution pipelines.',
  'Hardcoding static binary files without backup in Embedded Systems & Microcontrollers.',
  'C',
  'Option C is correct. By utilizing structured schemas, indexes, and optimized execution pipelines.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000039000005',
  '00000000-0000-4000-a000-000000000039',
  'Q5. What is a recommended best practice when deploying Embedded Systems & Microcontrollers?',
  'Hardcoding static binary files without backup in Embedded Systems & Microcontrollers.',
  'Legacy manual processing for Embedded Systems & Microcontrollers.',
  'Bypassing standard security checks and protocols in Embedded Systems & Microcontrollers.',
  'Conducting regular automated testing, logging, and monitoring checks.',
  'D',
  'Option D is correct. Conducting regular automated testing, logging, and monitoring checks.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000039000006',
  '00000000-0000-4000-a000-000000000039',
  'Q6. Which layer or component plays a vital role in Embedded Systems & Microcontrollers?',
  'Legacy manual processing for Embedded Systems & Microcontrollers.',
  'The central execution handler and protocol controller.',
  'Bypassing standard security checks and protocols in Embedded Systems & Microcontrollers.',
  'Hardcoding static binary files without backup in Embedded Systems & Microcontrollers.',
  'B',
  'Option B is correct. The central execution handler and protocol controller.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000039000007',
  '00000000-0000-4000-a000-000000000039',
  'Q7. What is a common bottleneck or challenge in Embedded Systems & Microcontrollers?',
  'Legacy manual processing for Embedded Systems & Microcontrollers.',
  'Managing system state synchronization and resource contention under heavy load.',
  'Bypassing standard security checks and protocols in Embedded Systems & Microcontrollers.',
  'Hardcoding static binary files without backup in Embedded Systems & Microcontrollers.',
  'B',
  'Option B is correct. Managing system state synchronization and resource contention under heavy load.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000039000008',
  '00000000-0000-4000-a000-000000000039',
  'Q8. How is security typically enforced within Embedded Systems & Microcontrollers?',
  'Through strong authentication, access control permissions, and data encryption.',
  'Legacy manual processing for Embedded Systems & Microcontrollers.',
  'Bypassing standard security checks and protocols in Embedded Systems & Microcontrollers.',
  'Hardcoding static binary files without backup in Embedded Systems & Microcontrollers.',
  'A',
  'Option A is correct. Through strong authentication, access control permissions, and data encryption.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000039000009',
  '00000000-0000-4000-a000-000000000039',
  'Q9. Which metric is critical for measuring the performance of Embedded Systems & Microcontrollers?',
  'Hardcoding static binary files without backup in Embedded Systems & Microcontrollers.',
  'Legacy manual processing for Embedded Systems & Microcontrollers.',
  'Bypassing standard security checks and protocols in Embedded Systems & Microcontrollers.',
  'Response latency, throughput, resource utilization, and error rates.',
  'D',
  'Option D is correct. Response latency, throughput, resource utilization, and error rates.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000039000010',
  '00000000-0000-4000-a000-000000000039',
  'Q10. What is the role of versioning in Embedded Systems & Microcontrollers?',
  'Bypassing standard security checks and protocols in Embedded Systems & Microcontrollers.',
  'Legacy manual processing for Embedded Systems & Microcontrollers.',
  'To support safe updates, maintain backward compatibility, and enable rollbacks.',
  'Hardcoding static binary files without backup in Embedded Systems & Microcontrollers.',
  'C',
  'Option C is correct. To support safe updates, maintain backward compatibility, and enable rollbacks.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000039000011',
  '00000000-0000-4000-a000-000000000039',
  'Q11. In what scenario is Embedded Systems & Microcontrollers most effectively applied?',
  'Bypassing standard security checks and protocols in Embedded Systems & Microcontrollers.',
  'Legacy manual processing for Embedded Systems & Microcontrollers.',
  'In modern scalable enterprise systems requiring structured workflows and reliability.',
  'Hardcoding static binary files without backup in Embedded Systems & Microcontrollers.',
  'C',
  'Option C is correct. In modern scalable enterprise systems requiring structured workflows and reliability.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000039000012',
  '00000000-0000-4000-a000-000000000039',
  'Q12. Which tool or interface is standard for interacting with Embedded Systems & Microcontrollers?',
  'Hardcoding static binary files without backup in Embedded Systems & Microcontrollers.',
  'Legacy manual processing for Embedded Systems & Microcontrollers.',
  'Bypassing standard security checks and protocols in Embedded Systems & Microcontrollers.',
  'Dedicated command line tools, SDK APIs, and management dashboards.',
  'D',
  'Option D is correct. Dedicated command line tools, SDK APIs, and management dashboards.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000039000013',
  '00000000-0000-4000-a000-000000000039',
  'Q13. What is the initial phase when developing with Embedded Systems & Microcontrollers?',
  'Defining requirements, setting up the development environment, and configuring dependencies.',
  'Legacy manual processing for Embedded Systems & Microcontrollers.',
  'Bypassing standard security checks and protocols in Embedded Systems & Microcontrollers.',
  'Hardcoding static binary files without backup in Embedded Systems & Microcontrollers.',
  'A',
  'Option A is correct. Defining requirements, setting up the development environment, and configuring dependencies.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000039000014',
  '00000000-0000-4000-a000-000000000039',
  'Q14. Which debugging technique is recommended for Embedded Systems & Microcontrollers?',
  'Bypassing standard security checks and protocols in Embedded Systems & Microcontrollers.',
  'Legacy manual processing for Embedded Systems & Microcontrollers.',
  'Inspecting log trace files, using debugger tools, and verifying stack traces.',
  'Hardcoding static binary files without backup in Embedded Systems & Microcontrollers.',
  'C',
  'Option C is correct. Inspecting log trace files, using debugger tools, and verifying stack traces.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000039000015',
  '00000000-0000-4000-a000-000000000039',
  'Q15. What is the overall goal of mastering Embedded Systems & Microcontrollers?',
  'Bypassing standard security checks and protocols in Embedded Systems & Microcontrollers.',
  'Legacy manual processing for Embedded Systems & Microcontrollers.',
  'To design, build, and maintain production-ready technology solutions.',
  'Hardcoding static binary files without backup in Embedded Systems & Microcontrollers.',
  'C',
  'Option C is correct. To design, build, and maintain production-ready technology solutions.'
);

-- Quick Learn 40: Digital Electronics Fundamentals
INSERT INTO public.quick_learn_lessons (id, title, slug, branch, category, difficulty, estimated_minutes, is_recommended, fx_reward, short_description, content_markdown, is_published)
VALUES (
  '00000000-0000-4000-a000-000000000040',
  'Digital Electronics Fundamentals',
  'digital-electronics-fundamentals',
  'ECE',
  'Electronics',
  'Beginner',
  3,
  TRUE,
  10,
  'Master Digital Electronics Fundamentals fundamentals with quick reading and 15 practice MCQs on FEEDX.',
  '### Learning Text
Digital Electronics Fundamentals is an essential concept in modern technology and engineering education. Understanding its core components enables effective problem-solving and application development.

### Key Points
- **Core Concepts**: Fundamentals of Digital Electronics Fundamentals.
- **Best Practices**: Implementation standards.
- **Workflow**: Practical application and deployment.',
  TRUE
) ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title;

INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000040000001',
  '00000000-0000-4000-a000-000000000040',
  'Q1. What is the primary definition of Digital Electronics Fundamentals?',
  'Legacy manual processing for Digital Electronics Fundamentals.',
  'A core technology or standard designed for managing and executing Digital Electronics Fundamentals processes.',
  'Bypassing standard security checks and protocols in Digital Electronics Fundamentals.',
  'Hardcoding static binary files without backup in Digital Electronics Fundamentals.',
  'B',
  'Option B is correct. A core technology or standard designed for managing and executing Digital Electronics Fundamentals processes.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000040000002',
  '00000000-0000-4000-a000-000000000040',
  'Q2. Which key benefit is provided by Digital Electronics Fundamentals?',
  'Bypassing standard security checks and protocols in Digital Electronics Fundamentals.',
  'Legacy manual processing for Digital Electronics Fundamentals.',
  'Improved efficiency, scalability, modularity, and operational reliability.',
  'Hardcoding static binary files without backup in Digital Electronics Fundamentals.',
  'C',
  'Option C is correct. Improved efficiency, scalability, modularity, and operational reliability.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000040000003',
  '00000000-0000-4000-a000-000000000040',
  'Q3. What is a fundamental requirement when implementing Digital Electronics Fundamentals?',
  'Hardcoding static binary files without backup in Digital Electronics Fundamentals.',
  'Legacy manual processing for Digital Electronics Fundamentals.',
  'Bypassing standard security checks and protocols in Digital Electronics Fundamentals.',
  'Proper system configuration, security protocols, and integration standards.',
  'D',
  'Option D is correct. Proper system configuration, security protocols, and integration standards.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000040000004',
  '00000000-0000-4000-a000-000000000040',
  'Q4. How does Digital Electronics Fundamentals handle data and execution states?',
  'Hardcoding static binary files without backup in Digital Electronics Fundamentals.',
  'Legacy manual processing for Digital Electronics Fundamentals.',
  'Bypassing standard security checks and protocols in Digital Electronics Fundamentals.',
  'By utilizing structured schemas, indexes, and optimized execution pipelines.',
  'D',
  'Option D is correct. By utilizing structured schemas, indexes, and optimized execution pipelines.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000040000005',
  '00000000-0000-4000-a000-000000000040',
  'Q5. What is a recommended best practice when deploying Digital Electronics Fundamentals?',
  'Hardcoding static binary files without backup in Digital Electronics Fundamentals.',
  'Legacy manual processing for Digital Electronics Fundamentals.',
  'Bypassing standard security checks and protocols in Digital Electronics Fundamentals.',
  'Conducting regular automated testing, logging, and monitoring checks.',
  'D',
  'Option D is correct. Conducting regular automated testing, logging, and monitoring checks.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000040000006',
  '00000000-0000-4000-a000-000000000040',
  'Q6. Which layer or component plays a vital role in Digital Electronics Fundamentals?',
  'The central execution handler and protocol controller.',
  'Legacy manual processing for Digital Electronics Fundamentals.',
  'Bypassing standard security checks and protocols in Digital Electronics Fundamentals.',
  'Hardcoding static binary files without backup in Digital Electronics Fundamentals.',
  'A',
  'Option A is correct. The central execution handler and protocol controller.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000040000007',
  '00000000-0000-4000-a000-000000000040',
  'Q7. What is a common bottleneck or challenge in Digital Electronics Fundamentals?',
  'Hardcoding static binary files without backup in Digital Electronics Fundamentals.',
  'Legacy manual processing for Digital Electronics Fundamentals.',
  'Bypassing standard security checks and protocols in Digital Electronics Fundamentals.',
  'Managing system state synchronization and resource contention under heavy load.',
  'D',
  'Option D is correct. Managing system state synchronization and resource contention under heavy load.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000040000008',
  '00000000-0000-4000-a000-000000000040',
  'Q8. How is security typically enforced within Digital Electronics Fundamentals?',
  'Hardcoding static binary files without backup in Digital Electronics Fundamentals.',
  'Legacy manual processing for Digital Electronics Fundamentals.',
  'Bypassing standard security checks and protocols in Digital Electronics Fundamentals.',
  'Through strong authentication, access control permissions, and data encryption.',
  'D',
  'Option D is correct. Through strong authentication, access control permissions, and data encryption.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000040000009',
  '00000000-0000-4000-a000-000000000040',
  'Q9. Which metric is critical for measuring the performance of Digital Electronics Fundamentals?',
  'Bypassing standard security checks and protocols in Digital Electronics Fundamentals.',
  'Legacy manual processing for Digital Electronics Fundamentals.',
  'Response latency, throughput, resource utilization, and error rates.',
  'Hardcoding static binary files without backup in Digital Electronics Fundamentals.',
  'C',
  'Option C is correct. Response latency, throughput, resource utilization, and error rates.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000040000010',
  '00000000-0000-4000-a000-000000000040',
  'Q10. What is the role of versioning in Digital Electronics Fundamentals?',
  'Bypassing standard security checks and protocols in Digital Electronics Fundamentals.',
  'Legacy manual processing for Digital Electronics Fundamentals.',
  'To support safe updates, maintain backward compatibility, and enable rollbacks.',
  'Hardcoding static binary files without backup in Digital Electronics Fundamentals.',
  'C',
  'Option C is correct. To support safe updates, maintain backward compatibility, and enable rollbacks.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000040000011',
  '00000000-0000-4000-a000-000000000040',
  'Q11. In what scenario is Digital Electronics Fundamentals most effectively applied?',
  'In modern scalable enterprise systems requiring structured workflows and reliability.',
  'Legacy manual processing for Digital Electronics Fundamentals.',
  'Bypassing standard security checks and protocols in Digital Electronics Fundamentals.',
  'Hardcoding static binary files without backup in Digital Electronics Fundamentals.',
  'A',
  'Option A is correct. In modern scalable enterprise systems requiring structured workflows and reliability.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000040000012',
  '00000000-0000-4000-a000-000000000040',
  'Q12. Which tool or interface is standard for interacting with Digital Electronics Fundamentals?',
  'Legacy manual processing for Digital Electronics Fundamentals.',
  'Dedicated command line tools, SDK APIs, and management dashboards.',
  'Bypassing standard security checks and protocols in Digital Electronics Fundamentals.',
  'Hardcoding static binary files without backup in Digital Electronics Fundamentals.',
  'B',
  'Option B is correct. Dedicated command line tools, SDK APIs, and management dashboards.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000040000013',
  '00000000-0000-4000-a000-000000000040',
  'Q13. What is the initial phase when developing with Digital Electronics Fundamentals?',
  'Bypassing standard security checks and protocols in Digital Electronics Fundamentals.',
  'Legacy manual processing for Digital Electronics Fundamentals.',
  'Defining requirements, setting up the development environment, and configuring dependencies.',
  'Hardcoding static binary files without backup in Digital Electronics Fundamentals.',
  'C',
  'Option C is correct. Defining requirements, setting up the development environment, and configuring dependencies.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000040000014',
  '00000000-0000-4000-a000-000000000040',
  'Q14. Which debugging technique is recommended for Digital Electronics Fundamentals?',
  'Inspecting log trace files, using debugger tools, and verifying stack traces.',
  'Legacy manual processing for Digital Electronics Fundamentals.',
  'Bypassing standard security checks and protocols in Digital Electronics Fundamentals.',
  'Hardcoding static binary files without backup in Digital Electronics Fundamentals.',
  'A',
  'Option A is correct. Inspecting log trace files, using debugger tools, and verifying stack traces.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000040000015',
  '00000000-0000-4000-a000-000000000040',
  'Q15. What is the overall goal of mastering Digital Electronics Fundamentals?',
  'To design, build, and maintain production-ready technology solutions.',
  'Legacy manual processing for Digital Electronics Fundamentals.',
  'Bypassing standard security checks and protocols in Digital Electronics Fundamentals.',
  'Hardcoding static binary files without backup in Digital Electronics Fundamentals.',
  'A',
  'Option A is correct. To design, build, and maintain production-ready technology solutions.'
);

-- Quick Learn 41: Signal Processing & Communication
INSERT INTO public.quick_learn_lessons (id, title, slug, branch, category, difficulty, estimated_minutes, is_recommended, fx_reward, short_description, content_markdown, is_published)
VALUES (
  '00000000-0000-4000-a000-000000000041',
  'Signal Processing & Communication',
  'signal-processing-communication',
  'ECE',
  'Telecom',
  'Intermediate',
  3,
  TRUE,
  10,
  'Master Signal Processing & Communication fundamentals with quick reading and 15 practice MCQs on FEEDX.',
  '### Learning Text
Signal Processing & Communication is an essential concept in modern technology and engineering education. Understanding its core components enables effective problem-solving and application development.

### Key Points
- **Core Concepts**: Fundamentals of Signal Processing & Communication.
- **Best Practices**: Implementation standards.
- **Workflow**: Practical application and deployment.',
  TRUE
) ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title;

INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000041000001',
  '00000000-0000-4000-a000-000000000041',
  'Q1. What is the primary definition of Signal Processing & Communication?',
  'A core technology or standard designed for managing and executing Signal Processing & Communication processes.',
  'Legacy manual processing for Signal Processing & Communication.',
  'Bypassing standard security checks and protocols in Signal Processing & Communication.',
  'Hardcoding static binary files without backup in Signal Processing & Communication.',
  'A',
  'Option A is correct. A core technology or standard designed for managing and executing Signal Processing & Communication processes.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000041000002',
  '00000000-0000-4000-a000-000000000041',
  'Q2. Which key benefit is provided by Signal Processing & Communication?',
  'Legacy manual processing for Signal Processing & Communication.',
  'Improved efficiency, scalability, modularity, and operational reliability.',
  'Bypassing standard security checks and protocols in Signal Processing & Communication.',
  'Hardcoding static binary files without backup in Signal Processing & Communication.',
  'B',
  'Option B is correct. Improved efficiency, scalability, modularity, and operational reliability.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000041000003',
  '00000000-0000-4000-a000-000000000041',
  'Q3. What is a fundamental requirement when implementing Signal Processing & Communication?',
  'Bypassing standard security checks and protocols in Signal Processing & Communication.',
  'Legacy manual processing for Signal Processing & Communication.',
  'Proper system configuration, security protocols, and integration standards.',
  'Hardcoding static binary files without backup in Signal Processing & Communication.',
  'C',
  'Option C is correct. Proper system configuration, security protocols, and integration standards.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000041000004',
  '00000000-0000-4000-a000-000000000041',
  'Q4. How does Signal Processing & Communication handle data and execution states?',
  'By utilizing structured schemas, indexes, and optimized execution pipelines.',
  'Legacy manual processing for Signal Processing & Communication.',
  'Bypassing standard security checks and protocols in Signal Processing & Communication.',
  'Hardcoding static binary files without backup in Signal Processing & Communication.',
  'A',
  'Option A is correct. By utilizing structured schemas, indexes, and optimized execution pipelines.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000041000005',
  '00000000-0000-4000-a000-000000000041',
  'Q5. What is a recommended best practice when deploying Signal Processing & Communication?',
  'Conducting regular automated testing, logging, and monitoring checks.',
  'Legacy manual processing for Signal Processing & Communication.',
  'Bypassing standard security checks and protocols in Signal Processing & Communication.',
  'Hardcoding static binary files without backup in Signal Processing & Communication.',
  'A',
  'Option A is correct. Conducting regular automated testing, logging, and monitoring checks.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000041000006',
  '00000000-0000-4000-a000-000000000041',
  'Q6. Which layer or component plays a vital role in Signal Processing & Communication?',
  'Hardcoding static binary files without backup in Signal Processing & Communication.',
  'Legacy manual processing for Signal Processing & Communication.',
  'Bypassing standard security checks and protocols in Signal Processing & Communication.',
  'The central execution handler and protocol controller.',
  'D',
  'Option D is correct. The central execution handler and protocol controller.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000041000007',
  '00000000-0000-4000-a000-000000000041',
  'Q7. What is a common bottleneck or challenge in Signal Processing & Communication?',
  'Bypassing standard security checks and protocols in Signal Processing & Communication.',
  'Legacy manual processing for Signal Processing & Communication.',
  'Managing system state synchronization and resource contention under heavy load.',
  'Hardcoding static binary files without backup in Signal Processing & Communication.',
  'C',
  'Option C is correct. Managing system state synchronization and resource contention under heavy load.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000041000008',
  '00000000-0000-4000-a000-000000000041',
  'Q8. How is security typically enforced within Signal Processing & Communication?',
  'Legacy manual processing for Signal Processing & Communication.',
  'Through strong authentication, access control permissions, and data encryption.',
  'Bypassing standard security checks and protocols in Signal Processing & Communication.',
  'Hardcoding static binary files without backup in Signal Processing & Communication.',
  'B',
  'Option B is correct. Through strong authentication, access control permissions, and data encryption.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000041000009',
  '00000000-0000-4000-a000-000000000041',
  'Q9. Which metric is critical for measuring the performance of Signal Processing & Communication?',
  'Legacy manual processing for Signal Processing & Communication.',
  'Response latency, throughput, resource utilization, and error rates.',
  'Bypassing standard security checks and protocols in Signal Processing & Communication.',
  'Hardcoding static binary files without backup in Signal Processing & Communication.',
  'B',
  'Option B is correct. Response latency, throughput, resource utilization, and error rates.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000041000010',
  '00000000-0000-4000-a000-000000000041',
  'Q10. What is the role of versioning in Signal Processing & Communication?',
  'Bypassing standard security checks and protocols in Signal Processing & Communication.',
  'Legacy manual processing for Signal Processing & Communication.',
  'To support safe updates, maintain backward compatibility, and enable rollbacks.',
  'Hardcoding static binary files without backup in Signal Processing & Communication.',
  'C',
  'Option C is correct. To support safe updates, maintain backward compatibility, and enable rollbacks.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000041000011',
  '00000000-0000-4000-a000-000000000041',
  'Q11. In what scenario is Signal Processing & Communication most effectively applied?',
  'Hardcoding static binary files without backup in Signal Processing & Communication.',
  'Legacy manual processing for Signal Processing & Communication.',
  'Bypassing standard security checks and protocols in Signal Processing & Communication.',
  'In modern scalable enterprise systems requiring structured workflows and reliability.',
  'D',
  'Option D is correct. In modern scalable enterprise systems requiring structured workflows and reliability.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000041000012',
  '00000000-0000-4000-a000-000000000041',
  'Q12. Which tool or interface is standard for interacting with Signal Processing & Communication?',
  'Legacy manual processing for Signal Processing & Communication.',
  'Dedicated command line tools, SDK APIs, and management dashboards.',
  'Bypassing standard security checks and protocols in Signal Processing & Communication.',
  'Hardcoding static binary files without backup in Signal Processing & Communication.',
  'B',
  'Option B is correct. Dedicated command line tools, SDK APIs, and management dashboards.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000041000013',
  '00000000-0000-4000-a000-000000000041',
  'Q13. What is the initial phase when developing with Signal Processing & Communication?',
  'Legacy manual processing for Signal Processing & Communication.',
  'Defining requirements, setting up the development environment, and configuring dependencies.',
  'Bypassing standard security checks and protocols in Signal Processing & Communication.',
  'Hardcoding static binary files without backup in Signal Processing & Communication.',
  'B',
  'Option B is correct. Defining requirements, setting up the development environment, and configuring dependencies.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000041000014',
  '00000000-0000-4000-a000-000000000041',
  'Q14. Which debugging technique is recommended for Signal Processing & Communication?',
  'Bypassing standard security checks and protocols in Signal Processing & Communication.',
  'Legacy manual processing for Signal Processing & Communication.',
  'Inspecting log trace files, using debugger tools, and verifying stack traces.',
  'Hardcoding static binary files without backup in Signal Processing & Communication.',
  'C',
  'Option C is correct. Inspecting log trace files, using debugger tools, and verifying stack traces.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000041000015',
  '00000000-0000-4000-a000-000000000041',
  'Q15. What is the overall goal of mastering Signal Processing & Communication?',
  'Legacy manual processing for Signal Processing & Communication.',
  'To design, build, and maintain production-ready technology solutions.',
  'Bypassing standard security checks and protocols in Signal Processing & Communication.',
  'Hardcoding static binary files without backup in Signal Processing & Communication.',
  'B',
  'Option B is correct. To design, build, and maintain production-ready technology solutions.'
);

-- Quick Learn 42: Electrical Machines & Drives
INSERT INTO public.quick_learn_lessons (id, title, slug, branch, category, difficulty, estimated_minutes, is_recommended, fx_reward, short_description, content_markdown, is_published)
VALUES (
  '00000000-0000-4000-a000-000000000042',
  'Electrical Machines & Drives',
  'electrical-machines-drives',
  'EEE',
  'Electrical',
  'Intermediate',
  3,
  TRUE,
  10,
  'Master Electrical Machines & Drives fundamentals with quick reading and 15 practice MCQs on FEEDX.',
  '### Learning Text
Electrical Machines & Drives is an essential concept in modern technology and engineering education. Understanding its core components enables effective problem-solving and application development.

### Key Points
- **Core Concepts**: Fundamentals of Electrical Machines & Drives.
- **Best Practices**: Implementation standards.
- **Workflow**: Practical application and deployment.',
  TRUE
) ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title;

INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000042000001',
  '00000000-0000-4000-a000-000000000042',
  'Q1. What is the primary definition of Electrical Machines & Drives?',
  'A core technology or standard designed for managing and executing Electrical Machines & Drives processes.',
  'Legacy manual processing for Electrical Machines & Drives.',
  'Bypassing standard security checks and protocols in Electrical Machines & Drives.',
  'Hardcoding static binary files without backup in Electrical Machines & Drives.',
  'A',
  'Option A is correct. A core technology or standard designed for managing and executing Electrical Machines & Drives processes.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000042000002',
  '00000000-0000-4000-a000-000000000042',
  'Q2. Which key benefit is provided by Electrical Machines & Drives?',
  'Bypassing standard security checks and protocols in Electrical Machines & Drives.',
  'Legacy manual processing for Electrical Machines & Drives.',
  'Improved efficiency, scalability, modularity, and operational reliability.',
  'Hardcoding static binary files without backup in Electrical Machines & Drives.',
  'C',
  'Option C is correct. Improved efficiency, scalability, modularity, and operational reliability.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000042000003',
  '00000000-0000-4000-a000-000000000042',
  'Q3. What is a fundamental requirement when implementing Electrical Machines & Drives?',
  'Proper system configuration, security protocols, and integration standards.',
  'Legacy manual processing for Electrical Machines & Drives.',
  'Bypassing standard security checks and protocols in Electrical Machines & Drives.',
  'Hardcoding static binary files without backup in Electrical Machines & Drives.',
  'A',
  'Option A is correct. Proper system configuration, security protocols, and integration standards.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000042000004',
  '00000000-0000-4000-a000-000000000042',
  'Q4. How does Electrical Machines & Drives handle data and execution states?',
  'Legacy manual processing for Electrical Machines & Drives.',
  'By utilizing structured schemas, indexes, and optimized execution pipelines.',
  'Bypassing standard security checks and protocols in Electrical Machines & Drives.',
  'Hardcoding static binary files without backup in Electrical Machines & Drives.',
  'B',
  'Option B is correct. By utilizing structured schemas, indexes, and optimized execution pipelines.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000042000005',
  '00000000-0000-4000-a000-000000000042',
  'Q5. What is a recommended best practice when deploying Electrical Machines & Drives?',
  'Conducting regular automated testing, logging, and monitoring checks.',
  'Legacy manual processing for Electrical Machines & Drives.',
  'Bypassing standard security checks and protocols in Electrical Machines & Drives.',
  'Hardcoding static binary files without backup in Electrical Machines & Drives.',
  'A',
  'Option A is correct. Conducting regular automated testing, logging, and monitoring checks.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000042000006',
  '00000000-0000-4000-a000-000000000042',
  'Q6. Which layer or component plays a vital role in Electrical Machines & Drives?',
  'Legacy manual processing for Electrical Machines & Drives.',
  'The central execution handler and protocol controller.',
  'Bypassing standard security checks and protocols in Electrical Machines & Drives.',
  'Hardcoding static binary files without backup in Electrical Machines & Drives.',
  'B',
  'Option B is correct. The central execution handler and protocol controller.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000042000007',
  '00000000-0000-4000-a000-000000000042',
  'Q7. What is a common bottleneck or challenge in Electrical Machines & Drives?',
  'Hardcoding static binary files without backup in Electrical Machines & Drives.',
  'Legacy manual processing for Electrical Machines & Drives.',
  'Bypassing standard security checks and protocols in Electrical Machines & Drives.',
  'Managing system state synchronization and resource contention under heavy load.',
  'D',
  'Option D is correct. Managing system state synchronization and resource contention under heavy load.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000042000008',
  '00000000-0000-4000-a000-000000000042',
  'Q8. How is security typically enforced within Electrical Machines & Drives?',
  'Legacy manual processing for Electrical Machines & Drives.',
  'Through strong authentication, access control permissions, and data encryption.',
  'Bypassing standard security checks and protocols in Electrical Machines & Drives.',
  'Hardcoding static binary files without backup in Electrical Machines & Drives.',
  'B',
  'Option B is correct. Through strong authentication, access control permissions, and data encryption.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000042000009',
  '00000000-0000-4000-a000-000000000042',
  'Q9. Which metric is critical for measuring the performance of Electrical Machines & Drives?',
  'Bypassing standard security checks and protocols in Electrical Machines & Drives.',
  'Legacy manual processing for Electrical Machines & Drives.',
  'Response latency, throughput, resource utilization, and error rates.',
  'Hardcoding static binary files without backup in Electrical Machines & Drives.',
  'C',
  'Option C is correct. Response latency, throughput, resource utilization, and error rates.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000042000010',
  '00000000-0000-4000-a000-000000000042',
  'Q10. What is the role of versioning in Electrical Machines & Drives?',
  'To support safe updates, maintain backward compatibility, and enable rollbacks.',
  'Legacy manual processing for Electrical Machines & Drives.',
  'Bypassing standard security checks and protocols in Electrical Machines & Drives.',
  'Hardcoding static binary files without backup in Electrical Machines & Drives.',
  'A',
  'Option A is correct. To support safe updates, maintain backward compatibility, and enable rollbacks.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000042000011',
  '00000000-0000-4000-a000-000000000042',
  'Q11. In what scenario is Electrical Machines & Drives most effectively applied?',
  'Legacy manual processing for Electrical Machines & Drives.',
  'In modern scalable enterprise systems requiring structured workflows and reliability.',
  'Bypassing standard security checks and protocols in Electrical Machines & Drives.',
  'Hardcoding static binary files without backup in Electrical Machines & Drives.',
  'B',
  'Option B is correct. In modern scalable enterprise systems requiring structured workflows and reliability.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000042000012',
  '00000000-0000-4000-a000-000000000042',
  'Q12. Which tool or interface is standard for interacting with Electrical Machines & Drives?',
  'Legacy manual processing for Electrical Machines & Drives.',
  'Dedicated command line tools, SDK APIs, and management dashboards.',
  'Bypassing standard security checks and protocols in Electrical Machines & Drives.',
  'Hardcoding static binary files without backup in Electrical Machines & Drives.',
  'B',
  'Option B is correct. Dedicated command line tools, SDK APIs, and management dashboards.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000042000013',
  '00000000-0000-4000-a000-000000000042',
  'Q13. What is the initial phase when developing with Electrical Machines & Drives?',
  'Bypassing standard security checks and protocols in Electrical Machines & Drives.',
  'Legacy manual processing for Electrical Machines & Drives.',
  'Defining requirements, setting up the development environment, and configuring dependencies.',
  'Hardcoding static binary files without backup in Electrical Machines & Drives.',
  'C',
  'Option C is correct. Defining requirements, setting up the development environment, and configuring dependencies.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000042000014',
  '00000000-0000-4000-a000-000000000042',
  'Q14. Which debugging technique is recommended for Electrical Machines & Drives?',
  'Bypassing standard security checks and protocols in Electrical Machines & Drives.',
  'Legacy manual processing for Electrical Machines & Drives.',
  'Inspecting log trace files, using debugger tools, and verifying stack traces.',
  'Hardcoding static binary files without backup in Electrical Machines & Drives.',
  'C',
  'Option C is correct. Inspecting log trace files, using debugger tools, and verifying stack traces.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000042000015',
  '00000000-0000-4000-a000-000000000042',
  'Q15. What is the overall goal of mastering Electrical Machines & Drives?',
  'Bypassing standard security checks and protocols in Electrical Machines & Drives.',
  'Legacy manual processing for Electrical Machines & Drives.',
  'To design, build, and maintain production-ready technology solutions.',
  'Hardcoding static binary files without backup in Electrical Machines & Drives.',
  'C',
  'Option C is correct. To design, build, and maintain production-ready technology solutions.'
);

-- Quick Learn 43: Thermodynamics Fundamentals
INSERT INTO public.quick_learn_lessons (id, title, slug, branch, category, difficulty, estimated_minutes, is_recommended, fx_reward, short_description, content_markdown, is_published)
VALUES (
  '00000000-0000-4000-a000-000000000043',
  'Thermodynamics Fundamentals',
  'thermodynamics-fundamentals',
  'MECH',
  'Mechanical',
  'Intermediate',
  3,
  TRUE,
  10,
  'Master Thermodynamics Fundamentals fundamentals with quick reading and 15 practice MCQs on FEEDX.',
  '### Learning Text
Thermodynamics Fundamentals is an essential concept in modern technology and engineering education. Understanding its core components enables effective problem-solving and application development.

### Key Points
- **Core Concepts**: Fundamentals of Thermodynamics Fundamentals.
- **Best Practices**: Implementation standards.
- **Workflow**: Practical application and deployment.',
  TRUE
) ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title;

INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000043000001',
  '00000000-0000-4000-a000-000000000043',
  'Q1. What is the primary definition of Thermodynamics Fundamentals?',
  'Legacy manual processing for Thermodynamics Fundamentals.',
  'A core technology or standard designed for managing and executing Thermodynamics Fundamentals processes.',
  'Bypassing standard security checks and protocols in Thermodynamics Fundamentals.',
  'Hardcoding static binary files without backup in Thermodynamics Fundamentals.',
  'B',
  'Option B is correct. A core technology or standard designed for managing and executing Thermodynamics Fundamentals processes.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000043000002',
  '00000000-0000-4000-a000-000000000043',
  'Q2. Which key benefit is provided by Thermodynamics Fundamentals?',
  'Bypassing standard security checks and protocols in Thermodynamics Fundamentals.',
  'Legacy manual processing for Thermodynamics Fundamentals.',
  'Improved efficiency, scalability, modularity, and operational reliability.',
  'Hardcoding static binary files without backup in Thermodynamics Fundamentals.',
  'C',
  'Option C is correct. Improved efficiency, scalability, modularity, and operational reliability.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000043000003',
  '00000000-0000-4000-a000-000000000043',
  'Q3. What is a fundamental requirement when implementing Thermodynamics Fundamentals?',
  'Proper system configuration, security protocols, and integration standards.',
  'Legacy manual processing for Thermodynamics Fundamentals.',
  'Bypassing standard security checks and protocols in Thermodynamics Fundamentals.',
  'Hardcoding static binary files without backup in Thermodynamics Fundamentals.',
  'A',
  'Option A is correct. Proper system configuration, security protocols, and integration standards.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000043000004',
  '00000000-0000-4000-a000-000000000043',
  'Q4. How does Thermodynamics Fundamentals handle data and execution states?',
  'Legacy manual processing for Thermodynamics Fundamentals.',
  'By utilizing structured schemas, indexes, and optimized execution pipelines.',
  'Bypassing standard security checks and protocols in Thermodynamics Fundamentals.',
  'Hardcoding static binary files without backup in Thermodynamics Fundamentals.',
  'B',
  'Option B is correct. By utilizing structured schemas, indexes, and optimized execution pipelines.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000043000005',
  '00000000-0000-4000-a000-000000000043',
  'Q5. What is a recommended best practice when deploying Thermodynamics Fundamentals?',
  'Legacy manual processing for Thermodynamics Fundamentals.',
  'Conducting regular automated testing, logging, and monitoring checks.',
  'Bypassing standard security checks and protocols in Thermodynamics Fundamentals.',
  'Hardcoding static binary files without backup in Thermodynamics Fundamentals.',
  'B',
  'Option B is correct. Conducting regular automated testing, logging, and monitoring checks.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000043000006',
  '00000000-0000-4000-a000-000000000043',
  'Q6. Which layer or component plays a vital role in Thermodynamics Fundamentals?',
  'Hardcoding static binary files without backup in Thermodynamics Fundamentals.',
  'Legacy manual processing for Thermodynamics Fundamentals.',
  'Bypassing standard security checks and protocols in Thermodynamics Fundamentals.',
  'The central execution handler and protocol controller.',
  'D',
  'Option D is correct. The central execution handler and protocol controller.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000043000007',
  '00000000-0000-4000-a000-000000000043',
  'Q7. What is a common bottleneck or challenge in Thermodynamics Fundamentals?',
  'Managing system state synchronization and resource contention under heavy load.',
  'Legacy manual processing for Thermodynamics Fundamentals.',
  'Bypassing standard security checks and protocols in Thermodynamics Fundamentals.',
  'Hardcoding static binary files without backup in Thermodynamics Fundamentals.',
  'A',
  'Option A is correct. Managing system state synchronization and resource contention under heavy load.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000043000008',
  '00000000-0000-4000-a000-000000000043',
  'Q8. How is security typically enforced within Thermodynamics Fundamentals?',
  'Through strong authentication, access control permissions, and data encryption.',
  'Legacy manual processing for Thermodynamics Fundamentals.',
  'Bypassing standard security checks and protocols in Thermodynamics Fundamentals.',
  'Hardcoding static binary files without backup in Thermodynamics Fundamentals.',
  'A',
  'Option A is correct. Through strong authentication, access control permissions, and data encryption.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000043000009',
  '00000000-0000-4000-a000-000000000043',
  'Q9. Which metric is critical for measuring the performance of Thermodynamics Fundamentals?',
  'Bypassing standard security checks and protocols in Thermodynamics Fundamentals.',
  'Legacy manual processing for Thermodynamics Fundamentals.',
  'Response latency, throughput, resource utilization, and error rates.',
  'Hardcoding static binary files without backup in Thermodynamics Fundamentals.',
  'C',
  'Option C is correct. Response latency, throughput, resource utilization, and error rates.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000043000010',
  '00000000-0000-4000-a000-000000000043',
  'Q10. What is the role of versioning in Thermodynamics Fundamentals?',
  'Hardcoding static binary files without backup in Thermodynamics Fundamentals.',
  'Legacy manual processing for Thermodynamics Fundamentals.',
  'Bypassing standard security checks and protocols in Thermodynamics Fundamentals.',
  'To support safe updates, maintain backward compatibility, and enable rollbacks.',
  'D',
  'Option D is correct. To support safe updates, maintain backward compatibility, and enable rollbacks.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000043000011',
  '00000000-0000-4000-a000-000000000043',
  'Q11. In what scenario is Thermodynamics Fundamentals most effectively applied?',
  'Bypassing standard security checks and protocols in Thermodynamics Fundamentals.',
  'Legacy manual processing for Thermodynamics Fundamentals.',
  'In modern scalable enterprise systems requiring structured workflows and reliability.',
  'Hardcoding static binary files without backup in Thermodynamics Fundamentals.',
  'C',
  'Option C is correct. In modern scalable enterprise systems requiring structured workflows and reliability.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000043000012',
  '00000000-0000-4000-a000-000000000043',
  'Q12. Which tool or interface is standard for interacting with Thermodynamics Fundamentals?',
  'Legacy manual processing for Thermodynamics Fundamentals.',
  'Dedicated command line tools, SDK APIs, and management dashboards.',
  'Bypassing standard security checks and protocols in Thermodynamics Fundamentals.',
  'Hardcoding static binary files without backup in Thermodynamics Fundamentals.',
  'B',
  'Option B is correct. Dedicated command line tools, SDK APIs, and management dashboards.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000043000013',
  '00000000-0000-4000-a000-000000000043',
  'Q13. What is the initial phase when developing with Thermodynamics Fundamentals?',
  'Hardcoding static binary files without backup in Thermodynamics Fundamentals.',
  'Legacy manual processing for Thermodynamics Fundamentals.',
  'Bypassing standard security checks and protocols in Thermodynamics Fundamentals.',
  'Defining requirements, setting up the development environment, and configuring dependencies.',
  'D',
  'Option D is correct. Defining requirements, setting up the development environment, and configuring dependencies.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000043000014',
  '00000000-0000-4000-a000-000000000043',
  'Q14. Which debugging technique is recommended for Thermodynamics Fundamentals?',
  'Bypassing standard security checks and protocols in Thermodynamics Fundamentals.',
  'Legacy manual processing for Thermodynamics Fundamentals.',
  'Inspecting log trace files, using debugger tools, and verifying stack traces.',
  'Hardcoding static binary files without backup in Thermodynamics Fundamentals.',
  'C',
  'Option C is correct. Inspecting log trace files, using debugger tools, and verifying stack traces.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000043000015',
  '00000000-0000-4000-a000-000000000043',
  'Q15. What is the overall goal of mastering Thermodynamics Fundamentals?',
  'Hardcoding static binary files without backup in Thermodynamics Fundamentals.',
  'Legacy manual processing for Thermodynamics Fundamentals.',
  'Bypassing standard security checks and protocols in Thermodynamics Fundamentals.',
  'To design, build, and maintain production-ready technology solutions.',
  'D',
  'Option D is correct. To design, build, and maintain production-ready technology solutions.'
);

-- Quick Learn 44: Fluid Mechanics Principles
INSERT INTO public.quick_learn_lessons (id, title, slug, branch, category, difficulty, estimated_minutes, is_recommended, fx_reward, short_description, content_markdown, is_published)
VALUES (
  '00000000-0000-4000-a000-000000000044',
  'Fluid Mechanics Principles',
  'fluid-mechanics-principles',
  'MECH',
  'Mechanical',
  'Intermediate',
  3,
  TRUE,
  10,
  'Master Fluid Mechanics Principles fundamentals with quick reading and 15 practice MCQs on FEEDX.',
  '### Learning Text
Fluid Mechanics Principles is an essential concept in modern technology and engineering education. Understanding its core components enables effective problem-solving and application development.

### Key Points
- **Core Concepts**: Fundamentals of Fluid Mechanics Principles.
- **Best Practices**: Implementation standards.
- **Workflow**: Practical application and deployment.',
  TRUE
) ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title;

INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000044000001',
  '00000000-0000-4000-a000-000000000044',
  'Q1. What is the primary definition of Fluid Mechanics Principles?',
  'Bypassing standard security checks and protocols in Fluid Mechanics Principles.',
  'Legacy manual processing for Fluid Mechanics Principles.',
  'A core technology or standard designed for managing and executing Fluid Mechanics Principles processes.',
  'Hardcoding static binary files without backup in Fluid Mechanics Principles.',
  'C',
  'Option C is correct. A core technology or standard designed for managing and executing Fluid Mechanics Principles processes.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000044000002',
  '00000000-0000-4000-a000-000000000044',
  'Q2. Which key benefit is provided by Fluid Mechanics Principles?',
  'Improved efficiency, scalability, modularity, and operational reliability.',
  'Legacy manual processing for Fluid Mechanics Principles.',
  'Bypassing standard security checks and protocols in Fluid Mechanics Principles.',
  'Hardcoding static binary files without backup in Fluid Mechanics Principles.',
  'A',
  'Option A is correct. Improved efficiency, scalability, modularity, and operational reliability.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000044000003',
  '00000000-0000-4000-a000-000000000044',
  'Q3. What is a fundamental requirement when implementing Fluid Mechanics Principles?',
  'Legacy manual processing for Fluid Mechanics Principles.',
  'Proper system configuration, security protocols, and integration standards.',
  'Bypassing standard security checks and protocols in Fluid Mechanics Principles.',
  'Hardcoding static binary files without backup in Fluid Mechanics Principles.',
  'B',
  'Option B is correct. Proper system configuration, security protocols, and integration standards.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000044000004',
  '00000000-0000-4000-a000-000000000044',
  'Q4. How does Fluid Mechanics Principles handle data and execution states?',
  'Bypassing standard security checks and protocols in Fluid Mechanics Principles.',
  'Legacy manual processing for Fluid Mechanics Principles.',
  'By utilizing structured schemas, indexes, and optimized execution pipelines.',
  'Hardcoding static binary files without backup in Fluid Mechanics Principles.',
  'C',
  'Option C is correct. By utilizing structured schemas, indexes, and optimized execution pipelines.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000044000005',
  '00000000-0000-4000-a000-000000000044',
  'Q5. What is a recommended best practice when deploying Fluid Mechanics Principles?',
  'Legacy manual processing for Fluid Mechanics Principles.',
  'Conducting regular automated testing, logging, and monitoring checks.',
  'Bypassing standard security checks and protocols in Fluid Mechanics Principles.',
  'Hardcoding static binary files without backup in Fluid Mechanics Principles.',
  'B',
  'Option B is correct. Conducting regular automated testing, logging, and monitoring checks.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000044000006',
  '00000000-0000-4000-a000-000000000044',
  'Q6. Which layer or component plays a vital role in Fluid Mechanics Principles?',
  'Bypassing standard security checks and protocols in Fluid Mechanics Principles.',
  'Legacy manual processing for Fluid Mechanics Principles.',
  'The central execution handler and protocol controller.',
  'Hardcoding static binary files without backup in Fluid Mechanics Principles.',
  'C',
  'Option C is correct. The central execution handler and protocol controller.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000044000007',
  '00000000-0000-4000-a000-000000000044',
  'Q7. What is a common bottleneck or challenge in Fluid Mechanics Principles?',
  'Bypassing standard security checks and protocols in Fluid Mechanics Principles.',
  'Legacy manual processing for Fluid Mechanics Principles.',
  'Managing system state synchronization and resource contention under heavy load.',
  'Hardcoding static binary files without backup in Fluid Mechanics Principles.',
  'C',
  'Option C is correct. Managing system state synchronization and resource contention under heavy load.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000044000008',
  '00000000-0000-4000-a000-000000000044',
  'Q8. How is security typically enforced within Fluid Mechanics Principles?',
  'Legacy manual processing for Fluid Mechanics Principles.',
  'Through strong authentication, access control permissions, and data encryption.',
  'Bypassing standard security checks and protocols in Fluid Mechanics Principles.',
  'Hardcoding static binary files without backup in Fluid Mechanics Principles.',
  'B',
  'Option B is correct. Through strong authentication, access control permissions, and data encryption.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000044000009',
  '00000000-0000-4000-a000-000000000044',
  'Q9. Which metric is critical for measuring the performance of Fluid Mechanics Principles?',
  'Response latency, throughput, resource utilization, and error rates.',
  'Legacy manual processing for Fluid Mechanics Principles.',
  'Bypassing standard security checks and protocols in Fluid Mechanics Principles.',
  'Hardcoding static binary files without backup in Fluid Mechanics Principles.',
  'A',
  'Option A is correct. Response latency, throughput, resource utilization, and error rates.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000044000010',
  '00000000-0000-4000-a000-000000000044',
  'Q10. What is the role of versioning in Fluid Mechanics Principles?',
  'To support safe updates, maintain backward compatibility, and enable rollbacks.',
  'Legacy manual processing for Fluid Mechanics Principles.',
  'Bypassing standard security checks and protocols in Fluid Mechanics Principles.',
  'Hardcoding static binary files without backup in Fluid Mechanics Principles.',
  'A',
  'Option A is correct. To support safe updates, maintain backward compatibility, and enable rollbacks.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000044000011',
  '00000000-0000-4000-a000-000000000044',
  'Q11. In what scenario is Fluid Mechanics Principles most effectively applied?',
  'Hardcoding static binary files without backup in Fluid Mechanics Principles.',
  'Legacy manual processing for Fluid Mechanics Principles.',
  'Bypassing standard security checks and protocols in Fluid Mechanics Principles.',
  'In modern scalable enterprise systems requiring structured workflows and reliability.',
  'D',
  'Option D is correct. In modern scalable enterprise systems requiring structured workflows and reliability.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000044000012',
  '00000000-0000-4000-a000-000000000044',
  'Q12. Which tool or interface is standard for interacting with Fluid Mechanics Principles?',
  'Bypassing standard security checks and protocols in Fluid Mechanics Principles.',
  'Legacy manual processing for Fluid Mechanics Principles.',
  'Dedicated command line tools, SDK APIs, and management dashboards.',
  'Hardcoding static binary files without backup in Fluid Mechanics Principles.',
  'C',
  'Option C is correct. Dedicated command line tools, SDK APIs, and management dashboards.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000044000013',
  '00000000-0000-4000-a000-000000000044',
  'Q13. What is the initial phase when developing with Fluid Mechanics Principles?',
  'Bypassing standard security checks and protocols in Fluid Mechanics Principles.',
  'Legacy manual processing for Fluid Mechanics Principles.',
  'Defining requirements, setting up the development environment, and configuring dependencies.',
  'Hardcoding static binary files without backup in Fluid Mechanics Principles.',
  'C',
  'Option C is correct. Defining requirements, setting up the development environment, and configuring dependencies.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000044000014',
  '00000000-0000-4000-a000-000000000044',
  'Q14. Which debugging technique is recommended for Fluid Mechanics Principles?',
  'Inspecting log trace files, using debugger tools, and verifying stack traces.',
  'Legacy manual processing for Fluid Mechanics Principles.',
  'Bypassing standard security checks and protocols in Fluid Mechanics Principles.',
  'Hardcoding static binary files without backup in Fluid Mechanics Principles.',
  'A',
  'Option A is correct. Inspecting log trace files, using debugger tools, and verifying stack traces.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000044000015',
  '00000000-0000-4000-a000-000000000044',
  'Q15. What is the overall goal of mastering Fluid Mechanics Principles?',
  'To design, build, and maintain production-ready technology solutions.',
  'Legacy manual processing for Fluid Mechanics Principles.',
  'Bypassing standard security checks and protocols in Fluid Mechanics Principles.',
  'Hardcoding static binary files without backup in Fluid Mechanics Principles.',
  'A',
  'Option A is correct. To design, build, and maintain production-ready technology solutions.'
);

-- Quick Learn 45: Civil Engineering & Surveying
INSERT INTO public.quick_learn_lessons (id, title, slug, branch, category, difficulty, estimated_minutes, is_recommended, fx_reward, short_description, content_markdown, is_published)
VALUES (
  '00000000-0000-4000-a000-000000000045',
  'Civil Engineering & Surveying',
  'civil-engineering-surveying',
  'CIVIL',
  'Civil',
  'Beginner',
  3,
  TRUE,
  10,
  'Master Civil Engineering & Surveying fundamentals with quick reading and 15 practice MCQs on FEEDX.',
  '### Learning Text
Civil Engineering & Surveying is an essential concept in modern technology and engineering education. Understanding its core components enables effective problem-solving and application development.

### Key Points
- **Core Concepts**: Fundamentals of Civil Engineering & Surveying.
- **Best Practices**: Implementation standards.
- **Workflow**: Practical application and deployment.',
  TRUE
) ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title;

INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000045000001',
  '00000000-0000-4000-a000-000000000045',
  'Q1. What is the primary definition of Civil Engineering & Surveying?',
  'Legacy manual processing for Civil Engineering & Surveying.',
  'A core technology or standard designed for managing and executing Civil Engineering & Surveying processes.',
  'Bypassing standard security checks and protocols in Civil Engineering & Surveying.',
  'Hardcoding static binary files without backup in Civil Engineering & Surveying.',
  'B',
  'Option B is correct. A core technology or standard designed for managing and executing Civil Engineering & Surveying processes.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000045000002',
  '00000000-0000-4000-a000-000000000045',
  'Q2. Which key benefit is provided by Civil Engineering & Surveying?',
  'Improved efficiency, scalability, modularity, and operational reliability.',
  'Legacy manual processing for Civil Engineering & Surveying.',
  'Bypassing standard security checks and protocols in Civil Engineering & Surveying.',
  'Hardcoding static binary files without backup in Civil Engineering & Surveying.',
  'A',
  'Option A is correct. Improved efficiency, scalability, modularity, and operational reliability.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000045000003',
  '00000000-0000-4000-a000-000000000045',
  'Q3. What is a fundamental requirement when implementing Civil Engineering & Surveying?',
  'Legacy manual processing for Civil Engineering & Surveying.',
  'Proper system configuration, security protocols, and integration standards.',
  'Bypassing standard security checks and protocols in Civil Engineering & Surveying.',
  'Hardcoding static binary files without backup in Civil Engineering & Surveying.',
  'B',
  'Option B is correct. Proper system configuration, security protocols, and integration standards.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000045000004',
  '00000000-0000-4000-a000-000000000045',
  'Q4. How does Civil Engineering & Surveying handle data and execution states?',
  'Hardcoding static binary files without backup in Civil Engineering & Surveying.',
  'Legacy manual processing for Civil Engineering & Surveying.',
  'Bypassing standard security checks and protocols in Civil Engineering & Surveying.',
  'By utilizing structured schemas, indexes, and optimized execution pipelines.',
  'D',
  'Option D is correct. By utilizing structured schemas, indexes, and optimized execution pipelines.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000045000005',
  '00000000-0000-4000-a000-000000000045',
  'Q5. What is a recommended best practice when deploying Civil Engineering & Surveying?',
  'Bypassing standard security checks and protocols in Civil Engineering & Surveying.',
  'Legacy manual processing for Civil Engineering & Surveying.',
  'Conducting regular automated testing, logging, and monitoring checks.',
  'Hardcoding static binary files without backup in Civil Engineering & Surveying.',
  'C',
  'Option C is correct. Conducting regular automated testing, logging, and monitoring checks.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000045000006',
  '00000000-0000-4000-a000-000000000045',
  'Q6. Which layer or component plays a vital role in Civil Engineering & Surveying?',
  'Legacy manual processing for Civil Engineering & Surveying.',
  'The central execution handler and protocol controller.',
  'Bypassing standard security checks and protocols in Civil Engineering & Surveying.',
  'Hardcoding static binary files without backup in Civil Engineering & Surveying.',
  'B',
  'Option B is correct. The central execution handler and protocol controller.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000045000007',
  '00000000-0000-4000-a000-000000000045',
  'Q7. What is a common bottleneck or challenge in Civil Engineering & Surveying?',
  'Managing system state synchronization and resource contention under heavy load.',
  'Legacy manual processing for Civil Engineering & Surveying.',
  'Bypassing standard security checks and protocols in Civil Engineering & Surveying.',
  'Hardcoding static binary files without backup in Civil Engineering & Surveying.',
  'A',
  'Option A is correct. Managing system state synchronization and resource contention under heavy load.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000045000008',
  '00000000-0000-4000-a000-000000000045',
  'Q8. How is security typically enforced within Civil Engineering & Surveying?',
  'Through strong authentication, access control permissions, and data encryption.',
  'Legacy manual processing for Civil Engineering & Surveying.',
  'Bypassing standard security checks and protocols in Civil Engineering & Surveying.',
  'Hardcoding static binary files without backup in Civil Engineering & Surveying.',
  'A',
  'Option A is correct. Through strong authentication, access control permissions, and data encryption.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000045000009',
  '00000000-0000-4000-a000-000000000045',
  'Q9. Which metric is critical for measuring the performance of Civil Engineering & Surveying?',
  'Hardcoding static binary files without backup in Civil Engineering & Surveying.',
  'Legacy manual processing for Civil Engineering & Surveying.',
  'Bypassing standard security checks and protocols in Civil Engineering & Surveying.',
  'Response latency, throughput, resource utilization, and error rates.',
  'D',
  'Option D is correct. Response latency, throughput, resource utilization, and error rates.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000045000010',
  '00000000-0000-4000-a000-000000000045',
  'Q10. What is the role of versioning in Civil Engineering & Surveying?',
  'To support safe updates, maintain backward compatibility, and enable rollbacks.',
  'Legacy manual processing for Civil Engineering & Surveying.',
  'Bypassing standard security checks and protocols in Civil Engineering & Surveying.',
  'Hardcoding static binary files without backup in Civil Engineering & Surveying.',
  'A',
  'Option A is correct. To support safe updates, maintain backward compatibility, and enable rollbacks.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000045000011',
  '00000000-0000-4000-a000-000000000045',
  'Q11. In what scenario is Civil Engineering & Surveying most effectively applied?',
  'In modern scalable enterprise systems requiring structured workflows and reliability.',
  'Legacy manual processing for Civil Engineering & Surveying.',
  'Bypassing standard security checks and protocols in Civil Engineering & Surveying.',
  'Hardcoding static binary files without backup in Civil Engineering & Surveying.',
  'A',
  'Option A is correct. In modern scalable enterprise systems requiring structured workflows and reliability.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000045000012',
  '00000000-0000-4000-a000-000000000045',
  'Q12. Which tool or interface is standard for interacting with Civil Engineering & Surveying?',
  'Hardcoding static binary files without backup in Civil Engineering & Surveying.',
  'Legacy manual processing for Civil Engineering & Surveying.',
  'Bypassing standard security checks and protocols in Civil Engineering & Surveying.',
  'Dedicated command line tools, SDK APIs, and management dashboards.',
  'D',
  'Option D is correct. Dedicated command line tools, SDK APIs, and management dashboards.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000045000013',
  '00000000-0000-4000-a000-000000000045',
  'Q13. What is the initial phase when developing with Civil Engineering & Surveying?',
  'Hardcoding static binary files without backup in Civil Engineering & Surveying.',
  'Legacy manual processing for Civil Engineering & Surveying.',
  'Bypassing standard security checks and protocols in Civil Engineering & Surveying.',
  'Defining requirements, setting up the development environment, and configuring dependencies.',
  'D',
  'Option D is correct. Defining requirements, setting up the development environment, and configuring dependencies.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000045000014',
  '00000000-0000-4000-a000-000000000045',
  'Q14. Which debugging technique is recommended for Civil Engineering & Surveying?',
  'Legacy manual processing for Civil Engineering & Surveying.',
  'Inspecting log trace files, using debugger tools, and verifying stack traces.',
  'Bypassing standard security checks and protocols in Civil Engineering & Surveying.',
  'Hardcoding static binary files without backup in Civil Engineering & Surveying.',
  'B',
  'Option B is correct. Inspecting log trace files, using debugger tools, and verifying stack traces.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000045000015',
  '00000000-0000-4000-a000-000000000045',
  'Q15. What is the overall goal of mastering Civil Engineering & Surveying?',
  'To design, build, and maintain production-ready technology solutions.',
  'Legacy manual processing for Civil Engineering & Surveying.',
  'Bypassing standard security checks and protocols in Civil Engineering & Surveying.',
  'Hardcoding static binary files without backup in Civil Engineering & Surveying.',
  'A',
  'Option A is correct. To design, build, and maintain production-ready technology solutions.'
);

-- Quick Learn 46: CAD/CAM & Engineering Graphics
INSERT INTO public.quick_learn_lessons (id, title, slug, branch, category, difficulty, estimated_minutes, is_recommended, fx_reward, short_description, content_markdown, is_published)
VALUES (
  '00000000-0000-4000-a000-000000000046',
  'CAD/CAM & Engineering Graphics',
  'cad-cam-engineering-graphics',
  'MECH',
  'Design',
  'Intermediate',
  3,
  TRUE,
  10,
  'Master CAD/CAM & Engineering Graphics fundamentals with quick reading and 15 practice MCQs on FEEDX.',
  '### Learning Text
CAD/CAM & Engineering Graphics is an essential concept in modern technology and engineering education. Understanding its core components enables effective problem-solving and application development.

### Key Points
- **Core Concepts**: Fundamentals of CAD/CAM & Engineering Graphics.
- **Best Practices**: Implementation standards.
- **Workflow**: Practical application and deployment.',
  TRUE
) ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title;

INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000046000001',
  '00000000-0000-4000-a000-000000000046',
  'Q1. What is the primary definition of CAD/CAM & Engineering Graphics?',
  'Legacy manual processing for CAD/CAM & Engineering Graphics.',
  'A core technology or standard designed for managing and executing CAD/CAM & Engineering Graphics processes.',
  'Bypassing standard security checks and protocols in CAD/CAM & Engineering Graphics.',
  'Hardcoding static binary files without backup in CAD/CAM & Engineering Graphics.',
  'B',
  'Option B is correct. A core technology or standard designed for managing and executing CAD/CAM & Engineering Graphics processes.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000046000002',
  '00000000-0000-4000-a000-000000000046',
  'Q2. Which key benefit is provided by CAD/CAM & Engineering Graphics?',
  'Improved efficiency, scalability, modularity, and operational reliability.',
  'Legacy manual processing for CAD/CAM & Engineering Graphics.',
  'Bypassing standard security checks and protocols in CAD/CAM & Engineering Graphics.',
  'Hardcoding static binary files without backup in CAD/CAM & Engineering Graphics.',
  'A',
  'Option A is correct. Improved efficiency, scalability, modularity, and operational reliability.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000046000003',
  '00000000-0000-4000-a000-000000000046',
  'Q3. What is a fundamental requirement when implementing CAD/CAM & Engineering Graphics?',
  'Bypassing standard security checks and protocols in CAD/CAM & Engineering Graphics.',
  'Legacy manual processing for CAD/CAM & Engineering Graphics.',
  'Proper system configuration, security protocols, and integration standards.',
  'Hardcoding static binary files without backup in CAD/CAM & Engineering Graphics.',
  'C',
  'Option C is correct. Proper system configuration, security protocols, and integration standards.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000046000004',
  '00000000-0000-4000-a000-000000000046',
  'Q4. How does CAD/CAM & Engineering Graphics handle data and execution states?',
  'Legacy manual processing for CAD/CAM & Engineering Graphics.',
  'By utilizing structured schemas, indexes, and optimized execution pipelines.',
  'Bypassing standard security checks and protocols in CAD/CAM & Engineering Graphics.',
  'Hardcoding static binary files without backup in CAD/CAM & Engineering Graphics.',
  'B',
  'Option B is correct. By utilizing structured schemas, indexes, and optimized execution pipelines.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000046000005',
  '00000000-0000-4000-a000-000000000046',
  'Q5. What is a recommended best practice when deploying CAD/CAM & Engineering Graphics?',
  'Legacy manual processing for CAD/CAM & Engineering Graphics.',
  'Conducting regular automated testing, logging, and monitoring checks.',
  'Bypassing standard security checks and protocols in CAD/CAM & Engineering Graphics.',
  'Hardcoding static binary files without backup in CAD/CAM & Engineering Graphics.',
  'B',
  'Option B is correct. Conducting regular automated testing, logging, and monitoring checks.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000046000006',
  '00000000-0000-4000-a000-000000000046',
  'Q6. Which layer or component plays a vital role in CAD/CAM & Engineering Graphics?',
  'Bypassing standard security checks and protocols in CAD/CAM & Engineering Graphics.',
  'Legacy manual processing for CAD/CAM & Engineering Graphics.',
  'The central execution handler and protocol controller.',
  'Hardcoding static binary files without backup in CAD/CAM & Engineering Graphics.',
  'C',
  'Option C is correct. The central execution handler and protocol controller.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000046000007',
  '00000000-0000-4000-a000-000000000046',
  'Q7. What is a common bottleneck or challenge in CAD/CAM & Engineering Graphics?',
  'Managing system state synchronization and resource contention under heavy load.',
  'Legacy manual processing for CAD/CAM & Engineering Graphics.',
  'Bypassing standard security checks and protocols in CAD/CAM & Engineering Graphics.',
  'Hardcoding static binary files without backup in CAD/CAM & Engineering Graphics.',
  'A',
  'Option A is correct. Managing system state synchronization and resource contention under heavy load.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000046000008',
  '00000000-0000-4000-a000-000000000046',
  'Q8. How is security typically enforced within CAD/CAM & Engineering Graphics?',
  'Hardcoding static binary files without backup in CAD/CAM & Engineering Graphics.',
  'Legacy manual processing for CAD/CAM & Engineering Graphics.',
  'Bypassing standard security checks and protocols in CAD/CAM & Engineering Graphics.',
  'Through strong authentication, access control permissions, and data encryption.',
  'D',
  'Option D is correct. Through strong authentication, access control permissions, and data encryption.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000046000009',
  '00000000-0000-4000-a000-000000000046',
  'Q9. Which metric is critical for measuring the performance of CAD/CAM & Engineering Graphics?',
  'Bypassing standard security checks and protocols in CAD/CAM & Engineering Graphics.',
  'Legacy manual processing for CAD/CAM & Engineering Graphics.',
  'Response latency, throughput, resource utilization, and error rates.',
  'Hardcoding static binary files without backup in CAD/CAM & Engineering Graphics.',
  'C',
  'Option C is correct. Response latency, throughput, resource utilization, and error rates.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000046000010',
  '00000000-0000-4000-a000-000000000046',
  'Q10. What is the role of versioning in CAD/CAM & Engineering Graphics?',
  'Hardcoding static binary files without backup in CAD/CAM & Engineering Graphics.',
  'Legacy manual processing for CAD/CAM & Engineering Graphics.',
  'Bypassing standard security checks and protocols in CAD/CAM & Engineering Graphics.',
  'To support safe updates, maintain backward compatibility, and enable rollbacks.',
  'D',
  'Option D is correct. To support safe updates, maintain backward compatibility, and enable rollbacks.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000046000011',
  '00000000-0000-4000-a000-000000000046',
  'Q11. In what scenario is CAD/CAM & Engineering Graphics most effectively applied?',
  'Legacy manual processing for CAD/CAM & Engineering Graphics.',
  'In modern scalable enterprise systems requiring structured workflows and reliability.',
  'Bypassing standard security checks and protocols in CAD/CAM & Engineering Graphics.',
  'Hardcoding static binary files without backup in CAD/CAM & Engineering Graphics.',
  'B',
  'Option B is correct. In modern scalable enterprise systems requiring structured workflows and reliability.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000046000012',
  '00000000-0000-4000-a000-000000000046',
  'Q12. Which tool or interface is standard for interacting with CAD/CAM & Engineering Graphics?',
  'Hardcoding static binary files without backup in CAD/CAM & Engineering Graphics.',
  'Legacy manual processing for CAD/CAM & Engineering Graphics.',
  'Bypassing standard security checks and protocols in CAD/CAM & Engineering Graphics.',
  'Dedicated command line tools, SDK APIs, and management dashboards.',
  'D',
  'Option D is correct. Dedicated command line tools, SDK APIs, and management dashboards.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000046000013',
  '00000000-0000-4000-a000-000000000046',
  'Q13. What is the initial phase when developing with CAD/CAM & Engineering Graphics?',
  'Hardcoding static binary files without backup in CAD/CAM & Engineering Graphics.',
  'Legacy manual processing for CAD/CAM & Engineering Graphics.',
  'Bypassing standard security checks and protocols in CAD/CAM & Engineering Graphics.',
  'Defining requirements, setting up the development environment, and configuring dependencies.',
  'D',
  'Option D is correct. Defining requirements, setting up the development environment, and configuring dependencies.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000046000014',
  '00000000-0000-4000-a000-000000000046',
  'Q14. Which debugging technique is recommended for CAD/CAM & Engineering Graphics?',
  'Inspecting log trace files, using debugger tools, and verifying stack traces.',
  'Legacy manual processing for CAD/CAM & Engineering Graphics.',
  'Bypassing standard security checks and protocols in CAD/CAM & Engineering Graphics.',
  'Hardcoding static binary files without backup in CAD/CAM & Engineering Graphics.',
  'A',
  'Option A is correct. Inspecting log trace files, using debugger tools, and verifying stack traces.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000046000015',
  '00000000-0000-4000-a000-000000000046',
  'Q15. What is the overall goal of mastering CAD/CAM & Engineering Graphics?',
  'Hardcoding static binary files without backup in CAD/CAM & Engineering Graphics.',
  'Legacy manual processing for CAD/CAM & Engineering Graphics.',
  'Bypassing standard security checks and protocols in CAD/CAM & Engineering Graphics.',
  'To design, build, and maintain production-ready technology solutions.',
  'D',
  'Option D is correct. To design, build, and maintain production-ready technology solutions.'
);

-- Quick Learn 47: Agile & Scrum Methodologies
INSERT INTO public.quick_learn_lessons (id, title, slug, branch, category, difficulty, estimated_minutes, is_recommended, fx_reward, short_description, content_markdown, is_published)
VALUES (
  '00000000-0000-4000-a000-000000000047',
  'Agile & Scrum Methodologies',
  'agile-scrum-methodologies',
  'CSE',
  'Management',
  'Beginner',
  3,
  TRUE,
  10,
  'Master Agile & Scrum Methodologies fundamentals with quick reading and 15 practice MCQs on FEEDX.',
  '### Learning Text
Agile & Scrum Methodologies is an essential concept in modern technology and engineering education. Understanding its core components enables effective problem-solving and application development.

### Key Points
- **Core Concepts**: Fundamentals of Agile & Scrum Methodologies.
- **Best Practices**: Implementation standards.
- **Workflow**: Practical application and deployment.',
  TRUE
) ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title;

INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000047000001',
  '00000000-0000-4000-a000-000000000047',
  'Q1. What is the primary definition of Agile & Scrum Methodologies?',
  'Hardcoding static binary files without backup in Agile & Scrum Methodologies.',
  'Legacy manual processing for Agile & Scrum Methodologies.',
  'Bypassing standard security checks and protocols in Agile & Scrum Methodologies.',
  'A core technology or standard designed for managing and executing Agile & Scrum Methodologies processes.',
  'D',
  'Option D is correct. A core technology or standard designed for managing and executing Agile & Scrum Methodologies processes.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000047000002',
  '00000000-0000-4000-a000-000000000047',
  'Q2. Which key benefit is provided by Agile & Scrum Methodologies?',
  'Legacy manual processing for Agile & Scrum Methodologies.',
  'Improved efficiency, scalability, modularity, and operational reliability.',
  'Bypassing standard security checks and protocols in Agile & Scrum Methodologies.',
  'Hardcoding static binary files without backup in Agile & Scrum Methodologies.',
  'B',
  'Option B is correct. Improved efficiency, scalability, modularity, and operational reliability.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000047000003',
  '00000000-0000-4000-a000-000000000047',
  'Q3. What is a fundamental requirement when implementing Agile & Scrum Methodologies?',
  'Proper system configuration, security protocols, and integration standards.',
  'Legacy manual processing for Agile & Scrum Methodologies.',
  'Bypassing standard security checks and protocols in Agile & Scrum Methodologies.',
  'Hardcoding static binary files without backup in Agile & Scrum Methodologies.',
  'A',
  'Option A is correct. Proper system configuration, security protocols, and integration standards.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000047000004',
  '00000000-0000-4000-a000-000000000047',
  'Q4. How does Agile & Scrum Methodologies handle data and execution states?',
  'Bypassing standard security checks and protocols in Agile & Scrum Methodologies.',
  'Legacy manual processing for Agile & Scrum Methodologies.',
  'By utilizing structured schemas, indexes, and optimized execution pipelines.',
  'Hardcoding static binary files without backup in Agile & Scrum Methodologies.',
  'C',
  'Option C is correct. By utilizing structured schemas, indexes, and optimized execution pipelines.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000047000005',
  '00000000-0000-4000-a000-000000000047',
  'Q5. What is a recommended best practice when deploying Agile & Scrum Methodologies?',
  'Legacy manual processing for Agile & Scrum Methodologies.',
  'Conducting regular automated testing, logging, and monitoring checks.',
  'Bypassing standard security checks and protocols in Agile & Scrum Methodologies.',
  'Hardcoding static binary files without backup in Agile & Scrum Methodologies.',
  'B',
  'Option B is correct. Conducting regular automated testing, logging, and monitoring checks.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000047000006',
  '00000000-0000-4000-a000-000000000047',
  'Q6. Which layer or component plays a vital role in Agile & Scrum Methodologies?',
  'Legacy manual processing for Agile & Scrum Methodologies.',
  'The central execution handler and protocol controller.',
  'Bypassing standard security checks and protocols in Agile & Scrum Methodologies.',
  'Hardcoding static binary files without backup in Agile & Scrum Methodologies.',
  'B',
  'Option B is correct. The central execution handler and protocol controller.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000047000007',
  '00000000-0000-4000-a000-000000000047',
  'Q7. What is a common bottleneck or challenge in Agile & Scrum Methodologies?',
  'Bypassing standard security checks and protocols in Agile & Scrum Methodologies.',
  'Legacy manual processing for Agile & Scrum Methodologies.',
  'Managing system state synchronization and resource contention under heavy load.',
  'Hardcoding static binary files without backup in Agile & Scrum Methodologies.',
  'C',
  'Option C is correct. Managing system state synchronization and resource contention under heavy load.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000047000008',
  '00000000-0000-4000-a000-000000000047',
  'Q8. How is security typically enforced within Agile & Scrum Methodologies?',
  'Through strong authentication, access control permissions, and data encryption.',
  'Legacy manual processing for Agile & Scrum Methodologies.',
  'Bypassing standard security checks and protocols in Agile & Scrum Methodologies.',
  'Hardcoding static binary files without backup in Agile & Scrum Methodologies.',
  'A',
  'Option A is correct. Through strong authentication, access control permissions, and data encryption.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000047000009',
  '00000000-0000-4000-a000-000000000047',
  'Q9. Which metric is critical for measuring the performance of Agile & Scrum Methodologies?',
  'Hardcoding static binary files without backup in Agile & Scrum Methodologies.',
  'Legacy manual processing for Agile & Scrum Methodologies.',
  'Bypassing standard security checks and protocols in Agile & Scrum Methodologies.',
  'Response latency, throughput, resource utilization, and error rates.',
  'D',
  'Option D is correct. Response latency, throughput, resource utilization, and error rates.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000047000010',
  '00000000-0000-4000-a000-000000000047',
  'Q10. What is the role of versioning in Agile & Scrum Methodologies?',
  'Bypassing standard security checks and protocols in Agile & Scrum Methodologies.',
  'Legacy manual processing for Agile & Scrum Methodologies.',
  'To support safe updates, maintain backward compatibility, and enable rollbacks.',
  'Hardcoding static binary files without backup in Agile & Scrum Methodologies.',
  'C',
  'Option C is correct. To support safe updates, maintain backward compatibility, and enable rollbacks.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000047000011',
  '00000000-0000-4000-a000-000000000047',
  'Q11. In what scenario is Agile & Scrum Methodologies most effectively applied?',
  'Hardcoding static binary files without backup in Agile & Scrum Methodologies.',
  'Legacy manual processing for Agile & Scrum Methodologies.',
  'Bypassing standard security checks and protocols in Agile & Scrum Methodologies.',
  'In modern scalable enterprise systems requiring structured workflows and reliability.',
  'D',
  'Option D is correct. In modern scalable enterprise systems requiring structured workflows and reliability.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000047000012',
  '00000000-0000-4000-a000-000000000047',
  'Q12. Which tool or interface is standard for interacting with Agile & Scrum Methodologies?',
  'Legacy manual processing for Agile & Scrum Methodologies.',
  'Dedicated command line tools, SDK APIs, and management dashboards.',
  'Bypassing standard security checks and protocols in Agile & Scrum Methodologies.',
  'Hardcoding static binary files without backup in Agile & Scrum Methodologies.',
  'B',
  'Option B is correct. Dedicated command line tools, SDK APIs, and management dashboards.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000047000013',
  '00000000-0000-4000-a000-000000000047',
  'Q13. What is the initial phase when developing with Agile & Scrum Methodologies?',
  'Hardcoding static binary files without backup in Agile & Scrum Methodologies.',
  'Legacy manual processing for Agile & Scrum Methodologies.',
  'Bypassing standard security checks and protocols in Agile & Scrum Methodologies.',
  'Defining requirements, setting up the development environment, and configuring dependencies.',
  'D',
  'Option D is correct. Defining requirements, setting up the development environment, and configuring dependencies.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000047000014',
  '00000000-0000-4000-a000-000000000047',
  'Q14. Which debugging technique is recommended for Agile & Scrum Methodologies?',
  'Hardcoding static binary files without backup in Agile & Scrum Methodologies.',
  'Legacy manual processing for Agile & Scrum Methodologies.',
  'Bypassing standard security checks and protocols in Agile & Scrum Methodologies.',
  'Inspecting log trace files, using debugger tools, and verifying stack traces.',
  'D',
  'Option D is correct. Inspecting log trace files, using debugger tools, and verifying stack traces.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000047000015',
  '00000000-0000-4000-a000-000000000047',
  'Q15. What is the overall goal of mastering Agile & Scrum Methodologies?',
  'Hardcoding static binary files without backup in Agile & Scrum Methodologies.',
  'Legacy manual processing for Agile & Scrum Methodologies.',
  'Bypassing standard security checks and protocols in Agile & Scrum Methodologies.',
  'To design, build, and maintain production-ready technology solutions.',
  'D',
  'Option D is correct. To design, build, and maintain production-ready technology solutions.'
);

-- Quick Learn 48: Big Data & Analytics Basics
INSERT INTO public.quick_learn_lessons (id, title, slug, branch, category, difficulty, estimated_minutes, is_recommended, fx_reward, short_description, content_markdown, is_published)
VALUES (
  '00000000-0000-4000-a000-000000000048',
  'Big Data & Analytics Basics',
  'big-data-analytics-basics',
  'CSE',
  'Data Science',
  'Intermediate',
  3,
  TRUE,
  10,
  'Master Big Data & Analytics Basics fundamentals with quick reading and 15 practice MCQs on FEEDX.',
  '### Learning Text
Big Data & Analytics Basics is an essential concept in modern technology and engineering education. Understanding its core components enables effective problem-solving and application development.

### Key Points
- **Core Concepts**: Fundamentals of Big Data & Analytics Basics.
- **Best Practices**: Implementation standards.
- **Workflow**: Practical application and deployment.',
  TRUE
) ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title;

INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000048000001',
  '00000000-0000-4000-a000-000000000048',
  'Q1. What is the primary definition of Big Data & Analytics Basics?',
  'Hardcoding static binary files without backup in Big Data & Analytics Basics.',
  'Legacy manual processing for Big Data & Analytics Basics.',
  'Bypassing standard security checks and protocols in Big Data & Analytics Basics.',
  'A core technology or standard designed for managing and executing Big Data & Analytics Basics processes.',
  'D',
  'Option D is correct. A core technology or standard designed for managing and executing Big Data & Analytics Basics processes.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000048000002',
  '00000000-0000-4000-a000-000000000048',
  'Q2. Which key benefit is provided by Big Data & Analytics Basics?',
  'Hardcoding static binary files without backup in Big Data & Analytics Basics.',
  'Legacy manual processing for Big Data & Analytics Basics.',
  'Bypassing standard security checks and protocols in Big Data & Analytics Basics.',
  'Improved efficiency, scalability, modularity, and operational reliability.',
  'D',
  'Option D is correct. Improved efficiency, scalability, modularity, and operational reliability.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000048000003',
  '00000000-0000-4000-a000-000000000048',
  'Q3. What is a fundamental requirement when implementing Big Data & Analytics Basics?',
  'Hardcoding static binary files without backup in Big Data & Analytics Basics.',
  'Legacy manual processing for Big Data & Analytics Basics.',
  'Bypassing standard security checks and protocols in Big Data & Analytics Basics.',
  'Proper system configuration, security protocols, and integration standards.',
  'D',
  'Option D is correct. Proper system configuration, security protocols, and integration standards.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000048000004',
  '00000000-0000-4000-a000-000000000048',
  'Q4. How does Big Data & Analytics Basics handle data and execution states?',
  'Legacy manual processing for Big Data & Analytics Basics.',
  'By utilizing structured schemas, indexes, and optimized execution pipelines.',
  'Bypassing standard security checks and protocols in Big Data & Analytics Basics.',
  'Hardcoding static binary files without backup in Big Data & Analytics Basics.',
  'B',
  'Option B is correct. By utilizing structured schemas, indexes, and optimized execution pipelines.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000048000005',
  '00000000-0000-4000-a000-000000000048',
  'Q5. What is a recommended best practice when deploying Big Data & Analytics Basics?',
  'Legacy manual processing for Big Data & Analytics Basics.',
  'Conducting regular automated testing, logging, and monitoring checks.',
  'Bypassing standard security checks and protocols in Big Data & Analytics Basics.',
  'Hardcoding static binary files without backup in Big Data & Analytics Basics.',
  'B',
  'Option B is correct. Conducting regular automated testing, logging, and monitoring checks.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000048000006',
  '00000000-0000-4000-a000-000000000048',
  'Q6. Which layer or component plays a vital role in Big Data & Analytics Basics?',
  'Hardcoding static binary files without backup in Big Data & Analytics Basics.',
  'Legacy manual processing for Big Data & Analytics Basics.',
  'Bypassing standard security checks and protocols in Big Data & Analytics Basics.',
  'The central execution handler and protocol controller.',
  'D',
  'Option D is correct. The central execution handler and protocol controller.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000048000007',
  '00000000-0000-4000-a000-000000000048',
  'Q7. What is a common bottleneck or challenge in Big Data & Analytics Basics?',
  'Managing system state synchronization and resource contention under heavy load.',
  'Legacy manual processing for Big Data & Analytics Basics.',
  'Bypassing standard security checks and protocols in Big Data & Analytics Basics.',
  'Hardcoding static binary files without backup in Big Data & Analytics Basics.',
  'A',
  'Option A is correct. Managing system state synchronization and resource contention under heavy load.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000048000008',
  '00000000-0000-4000-a000-000000000048',
  'Q8. How is security typically enforced within Big Data & Analytics Basics?',
  'Bypassing standard security checks and protocols in Big Data & Analytics Basics.',
  'Legacy manual processing for Big Data & Analytics Basics.',
  'Through strong authentication, access control permissions, and data encryption.',
  'Hardcoding static binary files without backup in Big Data & Analytics Basics.',
  'C',
  'Option C is correct. Through strong authentication, access control permissions, and data encryption.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000048000009',
  '00000000-0000-4000-a000-000000000048',
  'Q9. Which metric is critical for measuring the performance of Big Data & Analytics Basics?',
  'Legacy manual processing for Big Data & Analytics Basics.',
  'Response latency, throughput, resource utilization, and error rates.',
  'Bypassing standard security checks and protocols in Big Data & Analytics Basics.',
  'Hardcoding static binary files without backup in Big Data & Analytics Basics.',
  'B',
  'Option B is correct. Response latency, throughput, resource utilization, and error rates.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000048000010',
  '00000000-0000-4000-a000-000000000048',
  'Q10. What is the role of versioning in Big Data & Analytics Basics?',
  'To support safe updates, maintain backward compatibility, and enable rollbacks.',
  'Legacy manual processing for Big Data & Analytics Basics.',
  'Bypassing standard security checks and protocols in Big Data & Analytics Basics.',
  'Hardcoding static binary files without backup in Big Data & Analytics Basics.',
  'A',
  'Option A is correct. To support safe updates, maintain backward compatibility, and enable rollbacks.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000048000011',
  '00000000-0000-4000-a000-000000000048',
  'Q11. In what scenario is Big Data & Analytics Basics most effectively applied?',
  'In modern scalable enterprise systems requiring structured workflows and reliability.',
  'Legacy manual processing for Big Data & Analytics Basics.',
  'Bypassing standard security checks and protocols in Big Data & Analytics Basics.',
  'Hardcoding static binary files without backup in Big Data & Analytics Basics.',
  'A',
  'Option A is correct. In modern scalable enterprise systems requiring structured workflows and reliability.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000048000012',
  '00000000-0000-4000-a000-000000000048',
  'Q12. Which tool or interface is standard for interacting with Big Data & Analytics Basics?',
  'Hardcoding static binary files without backup in Big Data & Analytics Basics.',
  'Legacy manual processing for Big Data & Analytics Basics.',
  'Bypassing standard security checks and protocols in Big Data & Analytics Basics.',
  'Dedicated command line tools, SDK APIs, and management dashboards.',
  'D',
  'Option D is correct. Dedicated command line tools, SDK APIs, and management dashboards.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000048000013',
  '00000000-0000-4000-a000-000000000048',
  'Q13. What is the initial phase when developing with Big Data & Analytics Basics?',
  'Bypassing standard security checks and protocols in Big Data & Analytics Basics.',
  'Legacy manual processing for Big Data & Analytics Basics.',
  'Defining requirements, setting up the development environment, and configuring dependencies.',
  'Hardcoding static binary files without backup in Big Data & Analytics Basics.',
  'C',
  'Option C is correct. Defining requirements, setting up the development environment, and configuring dependencies.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000048000014',
  '00000000-0000-4000-a000-000000000048',
  'Q14. Which debugging technique is recommended for Big Data & Analytics Basics?',
  'Legacy manual processing for Big Data & Analytics Basics.',
  'Inspecting log trace files, using debugger tools, and verifying stack traces.',
  'Bypassing standard security checks and protocols in Big Data & Analytics Basics.',
  'Hardcoding static binary files without backup in Big Data & Analytics Basics.',
  'B',
  'Option B is correct. Inspecting log trace files, using debugger tools, and verifying stack traces.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000048000015',
  '00000000-0000-4000-a000-000000000048',
  'Q15. What is the overall goal of mastering Big Data & Analytics Basics?',
  'Hardcoding static binary files without backup in Big Data & Analytics Basics.',
  'Legacy manual processing for Big Data & Analytics Basics.',
  'Bypassing standard security checks and protocols in Big Data & Analytics Basics.',
  'To design, build, and maintain production-ready technology solutions.',
  'D',
  'Option D is correct. To design, build, and maintain production-ready technology solutions.'
);

-- Quick Learn 49: Blockchain & Smart Contracts
INSERT INTO public.quick_learn_lessons (id, title, slug, branch, category, difficulty, estimated_minutes, is_recommended, fx_reward, short_description, content_markdown, is_published)
VALUES (
  '00000000-0000-4000-a000-000000000049',
  'Blockchain & Smart Contracts',
  'blockchain-smart-contracts',
  'CSE',
  'Web3',
  'Advanced',
  3,
  TRUE,
  10,
  'Master Blockchain & Smart Contracts fundamentals with quick reading and 15 practice MCQs on FEEDX.',
  '### Learning Text
Blockchain & Smart Contracts is an essential concept in modern technology and engineering education. Understanding its core components enables effective problem-solving and application development.

### Key Points
- **Core Concepts**: Fundamentals of Blockchain & Smart Contracts.
- **Best Practices**: Implementation standards.
- **Workflow**: Practical application and deployment.',
  TRUE
) ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title;

INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000049000001',
  '00000000-0000-4000-a000-000000000049',
  'Q1. What is the primary definition of Blockchain & Smart Contracts?',
  'A core technology or standard designed for managing and executing Blockchain & Smart Contracts processes.',
  'Legacy manual processing for Blockchain & Smart Contracts.',
  'Bypassing standard security checks and protocols in Blockchain & Smart Contracts.',
  'Hardcoding static binary files without backup in Blockchain & Smart Contracts.',
  'A',
  'Option A is correct. A core technology or standard designed for managing and executing Blockchain & Smart Contracts processes.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000049000002',
  '00000000-0000-4000-a000-000000000049',
  'Q2. Which key benefit is provided by Blockchain & Smart Contracts?',
  'Legacy manual processing for Blockchain & Smart Contracts.',
  'Improved efficiency, scalability, modularity, and operational reliability.',
  'Bypassing standard security checks and protocols in Blockchain & Smart Contracts.',
  'Hardcoding static binary files without backup in Blockchain & Smart Contracts.',
  'B',
  'Option B is correct. Improved efficiency, scalability, modularity, and operational reliability.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000049000003',
  '00000000-0000-4000-a000-000000000049',
  'Q3. What is a fundamental requirement when implementing Blockchain & Smart Contracts?',
  'Proper system configuration, security protocols, and integration standards.',
  'Legacy manual processing for Blockchain & Smart Contracts.',
  'Bypassing standard security checks and protocols in Blockchain & Smart Contracts.',
  'Hardcoding static binary files without backup in Blockchain & Smart Contracts.',
  'A',
  'Option A is correct. Proper system configuration, security protocols, and integration standards.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000049000004',
  '00000000-0000-4000-a000-000000000049',
  'Q4. How does Blockchain & Smart Contracts handle data and execution states?',
  'Bypassing standard security checks and protocols in Blockchain & Smart Contracts.',
  'Legacy manual processing for Blockchain & Smart Contracts.',
  'By utilizing structured schemas, indexes, and optimized execution pipelines.',
  'Hardcoding static binary files without backup in Blockchain & Smart Contracts.',
  'C',
  'Option C is correct. By utilizing structured schemas, indexes, and optimized execution pipelines.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000049000005',
  '00000000-0000-4000-a000-000000000049',
  'Q5. What is a recommended best practice when deploying Blockchain & Smart Contracts?',
  'Hardcoding static binary files without backup in Blockchain & Smart Contracts.',
  'Legacy manual processing for Blockchain & Smart Contracts.',
  'Bypassing standard security checks and protocols in Blockchain & Smart Contracts.',
  'Conducting regular automated testing, logging, and monitoring checks.',
  'D',
  'Option D is correct. Conducting regular automated testing, logging, and monitoring checks.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000049000006',
  '00000000-0000-4000-a000-000000000049',
  'Q6. Which layer or component plays a vital role in Blockchain & Smart Contracts?',
  'Hardcoding static binary files without backup in Blockchain & Smart Contracts.',
  'Legacy manual processing for Blockchain & Smart Contracts.',
  'Bypassing standard security checks and protocols in Blockchain & Smart Contracts.',
  'The central execution handler and protocol controller.',
  'D',
  'Option D is correct. The central execution handler and protocol controller.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000049000007',
  '00000000-0000-4000-a000-000000000049',
  'Q7. What is a common bottleneck or challenge in Blockchain & Smart Contracts?',
  'Managing system state synchronization and resource contention under heavy load.',
  'Legacy manual processing for Blockchain & Smart Contracts.',
  'Bypassing standard security checks and protocols in Blockchain & Smart Contracts.',
  'Hardcoding static binary files without backup in Blockchain & Smart Contracts.',
  'A',
  'Option A is correct. Managing system state synchronization and resource contention under heavy load.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000049000008',
  '00000000-0000-4000-a000-000000000049',
  'Q8. How is security typically enforced within Blockchain & Smart Contracts?',
  'Hardcoding static binary files without backup in Blockchain & Smart Contracts.',
  'Legacy manual processing for Blockchain & Smart Contracts.',
  'Bypassing standard security checks and protocols in Blockchain & Smart Contracts.',
  'Through strong authentication, access control permissions, and data encryption.',
  'D',
  'Option D is correct. Through strong authentication, access control permissions, and data encryption.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000049000009',
  '00000000-0000-4000-a000-000000000049',
  'Q9. Which metric is critical for measuring the performance of Blockchain & Smart Contracts?',
  'Bypassing standard security checks and protocols in Blockchain & Smart Contracts.',
  'Legacy manual processing for Blockchain & Smart Contracts.',
  'Response latency, throughput, resource utilization, and error rates.',
  'Hardcoding static binary files without backup in Blockchain & Smart Contracts.',
  'C',
  'Option C is correct. Response latency, throughput, resource utilization, and error rates.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000049000010',
  '00000000-0000-4000-a000-000000000049',
  'Q10. What is the role of versioning in Blockchain & Smart Contracts?',
  'Bypassing standard security checks and protocols in Blockchain & Smart Contracts.',
  'Legacy manual processing for Blockchain & Smart Contracts.',
  'To support safe updates, maintain backward compatibility, and enable rollbacks.',
  'Hardcoding static binary files without backup in Blockchain & Smart Contracts.',
  'C',
  'Option C is correct. To support safe updates, maintain backward compatibility, and enable rollbacks.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000049000011',
  '00000000-0000-4000-a000-000000000049',
  'Q11. In what scenario is Blockchain & Smart Contracts most effectively applied?',
  'Hardcoding static binary files without backup in Blockchain & Smart Contracts.',
  'Legacy manual processing for Blockchain & Smart Contracts.',
  'Bypassing standard security checks and protocols in Blockchain & Smart Contracts.',
  'In modern scalable enterprise systems requiring structured workflows and reliability.',
  'D',
  'Option D is correct. In modern scalable enterprise systems requiring structured workflows and reliability.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000049000012',
  '00000000-0000-4000-a000-000000000049',
  'Q12. Which tool or interface is standard for interacting with Blockchain & Smart Contracts?',
  'Hardcoding static binary files without backup in Blockchain & Smart Contracts.',
  'Legacy manual processing for Blockchain & Smart Contracts.',
  'Bypassing standard security checks and protocols in Blockchain & Smart Contracts.',
  'Dedicated command line tools, SDK APIs, and management dashboards.',
  'D',
  'Option D is correct. Dedicated command line tools, SDK APIs, and management dashboards.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000049000013',
  '00000000-0000-4000-a000-000000000049',
  'Q13. What is the initial phase when developing with Blockchain & Smart Contracts?',
  'Hardcoding static binary files without backup in Blockchain & Smart Contracts.',
  'Legacy manual processing for Blockchain & Smart Contracts.',
  'Bypassing standard security checks and protocols in Blockchain & Smart Contracts.',
  'Defining requirements, setting up the development environment, and configuring dependencies.',
  'D',
  'Option D is correct. Defining requirements, setting up the development environment, and configuring dependencies.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000049000014',
  '00000000-0000-4000-a000-000000000049',
  'Q14. Which debugging technique is recommended for Blockchain & Smart Contracts?',
  'Legacy manual processing for Blockchain & Smart Contracts.',
  'Inspecting log trace files, using debugger tools, and verifying stack traces.',
  'Bypassing standard security checks and protocols in Blockchain & Smart Contracts.',
  'Hardcoding static binary files without backup in Blockchain & Smart Contracts.',
  'B',
  'Option B is correct. Inspecting log trace files, using debugger tools, and verifying stack traces.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000049000015',
  '00000000-0000-4000-a000-000000000049',
  'Q15. What is the overall goal of mastering Blockchain & Smart Contracts?',
  'To design, build, and maintain production-ready technology solutions.',
  'Legacy manual processing for Blockchain & Smart Contracts.',
  'Bypassing standard security checks and protocols in Blockchain & Smart Contracts.',
  'Hardcoding static binary files without backup in Blockchain & Smart Contracts.',
  'A',
  'Option A is correct. To design, build, and maintain production-ready technology solutions.'
);

-- Quick Learn 50: Cloud Native & Serverless Computing
INSERT INTO public.quick_learn_lessons (id, title, slug, branch, category, difficulty, estimated_minutes, is_recommended, fx_reward, short_description, content_markdown, is_published)
VALUES (
  '00000000-0000-4000-a000-000000000050',
  'Cloud Native & Serverless Computing',
  'cloud-native-serverless-computing',
  'CSE',
  'Cloud',
  'Advanced',
  3,
  TRUE,
  10,
  'Master Cloud Native & Serverless Computing fundamentals with quick reading and 15 practice MCQs on FEEDX.',
  '### Learning Text
Cloud Native & Serverless Computing is an essential concept in modern technology and engineering education. Understanding its core components enables effective problem-solving and application development.

### Key Points
- **Core Concepts**: Fundamentals of Cloud Native & Serverless Computing.
- **Best Practices**: Implementation standards.
- **Workflow**: Practical application and deployment.',
  TRUE
) ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title;

INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000050000001',
  '00000000-0000-4000-a000-000000000050',
  'Q1. What is the primary definition of Cloud Native & Serverless Computing?',
  'Hardcoding static binary files without backup in Cloud Native & Serverless Computing.',
  'Legacy manual processing for Cloud Native & Serverless Computing.',
  'Bypassing standard security checks and protocols in Cloud Native & Serverless Computing.',
  'A core technology or standard designed for managing and executing Cloud Native & Serverless Computing processes.',
  'D',
  'Option D is correct. A core technology or standard designed for managing and executing Cloud Native & Serverless Computing processes.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000050000002',
  '00000000-0000-4000-a000-000000000050',
  'Q2. Which key benefit is provided by Cloud Native & Serverless Computing?',
  'Bypassing standard security checks and protocols in Cloud Native & Serverless Computing.',
  'Legacy manual processing for Cloud Native & Serverless Computing.',
  'Improved efficiency, scalability, modularity, and operational reliability.',
  'Hardcoding static binary files without backup in Cloud Native & Serverless Computing.',
  'C',
  'Option C is correct. Improved efficiency, scalability, modularity, and operational reliability.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000050000003',
  '00000000-0000-4000-a000-000000000050',
  'Q3. What is a fundamental requirement when implementing Cloud Native & Serverless Computing?',
  'Hardcoding static binary files without backup in Cloud Native & Serverless Computing.',
  'Legacy manual processing for Cloud Native & Serverless Computing.',
  'Bypassing standard security checks and protocols in Cloud Native & Serverless Computing.',
  'Proper system configuration, security protocols, and integration standards.',
  'D',
  'Option D is correct. Proper system configuration, security protocols, and integration standards.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000050000004',
  '00000000-0000-4000-a000-000000000050',
  'Q4. How does Cloud Native & Serverless Computing handle data and execution states?',
  'By utilizing structured schemas, indexes, and optimized execution pipelines.',
  'Legacy manual processing for Cloud Native & Serverless Computing.',
  'Bypassing standard security checks and protocols in Cloud Native & Serverless Computing.',
  'Hardcoding static binary files without backup in Cloud Native & Serverless Computing.',
  'A',
  'Option A is correct. By utilizing structured schemas, indexes, and optimized execution pipelines.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000050000005',
  '00000000-0000-4000-a000-000000000050',
  'Q5. What is a recommended best practice when deploying Cloud Native & Serverless Computing?',
  'Conducting regular automated testing, logging, and monitoring checks.',
  'Legacy manual processing for Cloud Native & Serverless Computing.',
  'Bypassing standard security checks and protocols in Cloud Native & Serverless Computing.',
  'Hardcoding static binary files without backup in Cloud Native & Serverless Computing.',
  'A',
  'Option A is correct. Conducting regular automated testing, logging, and monitoring checks.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000050000006',
  '00000000-0000-4000-a000-000000000050',
  'Q6. Which layer or component plays a vital role in Cloud Native & Serverless Computing?',
  'The central execution handler and protocol controller.',
  'Legacy manual processing for Cloud Native & Serverless Computing.',
  'Bypassing standard security checks and protocols in Cloud Native & Serverless Computing.',
  'Hardcoding static binary files without backup in Cloud Native & Serverless Computing.',
  'A',
  'Option A is correct. The central execution handler and protocol controller.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000050000007',
  '00000000-0000-4000-a000-000000000050',
  'Q7. What is a common bottleneck or challenge in Cloud Native & Serverless Computing?',
  'Legacy manual processing for Cloud Native & Serverless Computing.',
  'Managing system state synchronization and resource contention under heavy load.',
  'Bypassing standard security checks and protocols in Cloud Native & Serverless Computing.',
  'Hardcoding static binary files without backup in Cloud Native & Serverless Computing.',
  'B',
  'Option B is correct. Managing system state synchronization and resource contention under heavy load.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000050000008',
  '00000000-0000-4000-a000-000000000050',
  'Q8. How is security typically enforced within Cloud Native & Serverless Computing?',
  'Legacy manual processing for Cloud Native & Serverless Computing.',
  'Through strong authentication, access control permissions, and data encryption.',
  'Bypassing standard security checks and protocols in Cloud Native & Serverless Computing.',
  'Hardcoding static binary files without backup in Cloud Native & Serverless Computing.',
  'B',
  'Option B is correct. Through strong authentication, access control permissions, and data encryption.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000050000009',
  '00000000-0000-4000-a000-000000000050',
  'Q9. Which metric is critical for measuring the performance of Cloud Native & Serverless Computing?',
  'Hardcoding static binary files without backup in Cloud Native & Serverless Computing.',
  'Legacy manual processing for Cloud Native & Serverless Computing.',
  'Bypassing standard security checks and protocols in Cloud Native & Serverless Computing.',
  'Response latency, throughput, resource utilization, and error rates.',
  'D',
  'Option D is correct. Response latency, throughput, resource utilization, and error rates.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000050000010',
  '00000000-0000-4000-a000-000000000050',
  'Q10. What is the role of versioning in Cloud Native & Serverless Computing?',
  'To support safe updates, maintain backward compatibility, and enable rollbacks.',
  'Legacy manual processing for Cloud Native & Serverless Computing.',
  'Bypassing standard security checks and protocols in Cloud Native & Serverless Computing.',
  'Hardcoding static binary files without backup in Cloud Native & Serverless Computing.',
  'A',
  'Option A is correct. To support safe updates, maintain backward compatibility, and enable rollbacks.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000050000011',
  '00000000-0000-4000-a000-000000000050',
  'Q11. In what scenario is Cloud Native & Serverless Computing most effectively applied?',
  'Legacy manual processing for Cloud Native & Serverless Computing.',
  'In modern scalable enterprise systems requiring structured workflows and reliability.',
  'Bypassing standard security checks and protocols in Cloud Native & Serverless Computing.',
  'Hardcoding static binary files without backup in Cloud Native & Serverless Computing.',
  'B',
  'Option B is correct. In modern scalable enterprise systems requiring structured workflows and reliability.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000050000012',
  '00000000-0000-4000-a000-000000000050',
  'Q12. Which tool or interface is standard for interacting with Cloud Native & Serverless Computing?',
  'Bypassing standard security checks and protocols in Cloud Native & Serverless Computing.',
  'Legacy manual processing for Cloud Native & Serverless Computing.',
  'Dedicated command line tools, SDK APIs, and management dashboards.',
  'Hardcoding static binary files without backup in Cloud Native & Serverless Computing.',
  'C',
  'Option C is correct. Dedicated command line tools, SDK APIs, and management dashboards.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000050000013',
  '00000000-0000-4000-a000-000000000050',
  'Q13. What is the initial phase when developing with Cloud Native & Serverless Computing?',
  'Bypassing standard security checks and protocols in Cloud Native & Serverless Computing.',
  'Legacy manual processing for Cloud Native & Serverless Computing.',
  'Defining requirements, setting up the development environment, and configuring dependencies.',
  'Hardcoding static binary files without backup in Cloud Native & Serverless Computing.',
  'C',
  'Option C is correct. Defining requirements, setting up the development environment, and configuring dependencies.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000050000014',
  '00000000-0000-4000-a000-000000000050',
  'Q14. Which debugging technique is recommended for Cloud Native & Serverless Computing?',
  'Bypassing standard security checks and protocols in Cloud Native & Serverless Computing.',
  'Legacy manual processing for Cloud Native & Serverless Computing.',
  'Inspecting log trace files, using debugger tools, and verifying stack traces.',
  'Hardcoding static binary files without backup in Cloud Native & Serverless Computing.',
  'C',
  'Option C is correct. Inspecting log trace files, using debugger tools, and verifying stack traces.'
);
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000050000015',
  '00000000-0000-4000-a000-000000000050',
  'Q15. What is the overall goal of mastering Cloud Native & Serverless Computing?',
  'Hardcoding static binary files without backup in Cloud Native & Serverless Computing.',
  'Legacy manual processing for Cloud Native & Serverless Computing.',
  'Bypassing standard security checks and protocols in Cloud Native & Serverless Computing.',
  'To design, build, and maintain production-ready technology solutions.',
  'D',
  'Option D is correct. To design, build, and maintain production-ready technology solutions.'
);

COMMIT;
