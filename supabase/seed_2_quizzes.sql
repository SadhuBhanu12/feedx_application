-- ==============================================================================
-- FEEDX SEED MIGRATION: PART 2 - 50 QUIZZES (1,000 MCQS)
-- ==============================================================================

BEGIN;

-- Explore Quiz 1: GitHub & Git Basics Mastery Quiz
INSERT INTO public.explore_quizzes (id, title, description, category, branch, difficulty, question_count, estimated_minutes, fx_reward, is_daily, is_published)
VALUES (
  '00000000-0002-4000-a000-000000000001',
  'GitHub & Git Basics Challenge Quiz',
  'Test your knowledge on GitHub & Git Basics with 20 comprehensive questions.',
  'DevOps',
  'CSE',
  'Beginner',
  20,
  8,
  15,
  FALSE,
  TRUE
);

INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000001000001',
  '00000000-0002-4000-a000-000000000001',
  1,
  'Q1. Which tool tracks changes in a project’s files?',
  'GitHub',
  'Git',
  'Docker',
  'SQL',
  'B',
  'Option B is correct. Git is the version-control tool used to track changes.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000001000002',
  '00000000-0002-4000-a000-000000000001',
  2,
  'Q2. What is GitHub?',
  'A computer network protocol',
  'A programming language',
  'A database engine',
  'A hosted platform for Git repositories and collaboration',
  'D',
  'Option D is correct. GitHub provides hosted repositories and collaboration features around Git.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000001000003',
  '00000000-0002-4000-a000-000000000001',
  3,
  'Q3. What does a Git commit represent?',
  'A programming language',
  'A remote server',
  'A saved change in repository history',
  'A network address',
  'C',
  'Option C is correct. A commit records a set of changes in Git history.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000001000004',
  '00000000-0002-4000-a000-000000000001',
  4,
  'Q4. What is a branch used for?',
  'Encrypting a file',
  'A separate line of development',
  'Running a database',
  'Creating a network',
  'B',
  'Option B is correct. Branches let developers work on separate lines of development.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000001000005',
  '00000000-0002-4000-a000-000000000001',
  5,
  'Q5. What does git clone do?',
  'Copies a repository to a local environment',
  'Deletes a repository',
  'Creates a password',
  'Publishes a website',
  'A',
  'Option A is correct. Clone creates a local copy of a repository.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000001000006',
  '00000000-0002-4000-a000-000000000001',
  6,
  'Q6. What is a pull request?',
  'A database query',
  'A proposal to merge changes',
  'A password reset',
  'A cloud storage bucket',
  'B',
  'Option B is correct. A pull request is used to propose and review changes before merging.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000001000007',
  '00000000-0002-4000-a000-000000000001',
  7,
  'Q7. What does git push do?',
  'Creates an HTML page',
  'Deletes commits',
  'Sends local commits to a remote repository',
  'Starts a firewall',
  'C',
  'Option C is correct. Push transfers local commits to a configured remote.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000001000008',
  '00000000-0002-4000-a000-000000000001',
  8,
  'Q8. What does git pull commonly do?',
  'Encrypts a password',
  'Formats a disk',
  'Creates a database',
  'Fetches and integrates changes from a remote',
  'D',
  'Option D is correct. Pull obtains remote changes and integrates them into the current branch.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000001000009',
  '00000000-0002-4000-a000-000000000001',
  9,
  'Q9. What is a repository?',
  'A password',
  'A network cable',
  'A browser',
  'A location containing a project''s files and version history',
  'D',
  'Option D is correct. A repository contains project files and version-control history.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000001000010',
  '00000000-0002-4000-a000-000000000001',
  10,
  'Q10. What is GitHub Actions commonly used for?',
  'Writing SQL queries',
  'Automating workflows such as testing and deployment',
  'Drawing circuits',
  'Managing IP addresses',
  'B',
  'Option B is correct. GitHub Actions automates repository workflows.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000001000011',
  '00000000-0002-4000-a000-000000000001',
  11,
  'Q11. What is a fork on GitHub?',
  'A compiler',
  'A local password',
  'A network protocol',
  'A personal copy of another repository on GitHub',
  'D',
  'Option D is correct. A fork creates a separate copy of a repository under another account or organization.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000001000012',
  '00000000-0002-4000-a000-000000000001',
  12,
  'Q12. What does the staging area do in Git?',
  'Stores cloud backups',
  'Prepares selected changes for a commit',
  'Runs a web server',
  'Encrypts traffic',
  'B',
  'Option B is correct. The staging area lets you choose changes to include in the next commit.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000001000013',
  '00000000-0002-4000-a000-000000000001',
  13,
  'Q13. What does git diff show?',
  'Changes between versions or working states',
  'Internet speed',
  'Database tables',
  'CPU temperature',
  'A',
  'Option A is correct. Git diff displays differences between file states.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000001000014',
  '00000000-0002-4000-a000-000000000001',
  14,
  'Q14. What is a Git tag often used for?',
  'Naming a specific point such as a release',
  'Creating a firewall',
  'Storing passwords',
  'Running a database',
  'A',
  'Option A is correct. Tags provide named references to particular commits, often releases.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000001000015',
  '00000000-0002-4000-a000-000000000001',
  15,
  'Q15. Why use version control?',
  'To replace an operating system',
  'To increase screen brightness',
  'To track changes and collaborate safely',
  'To compress videos',
  'C',
  'Option C is correct. Version control tracks changes and supports collaboration and recovery.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000001000016',
  '00000000-0002-4000-a000-000000000001',
  16,
  'Q16. Which command initializes a new Git repository in the current folder?',
  'git init',
  'git new',
  'git create',
  'git start',
  'A',
  'Option A is correct. git init initializes a brand new Git repository.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000001000017',
  '00000000-0002-4000-a000-000000000001',
  17,
  'Q17. Which command adds untracked files to the staging area?',
  'git add',
  'git stage',
  'git push',
  'git save',
  'A',
  'Option A is correct. git add stages modified or new files for committing.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000001000018',
  '00000000-0002-4000-a000-000000000001',
  18,
  'Q18. Which command displays the state of the working directory and staging area?',
  'git log',
  'git check',
  'git status',
  'git info',
  'C',
  'Option C is correct. git status lists changed, staged, and untracked files.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000001000019',
  '00000000-0002-4000-a000-000000000001',
  19,
  'Q19. Which command shows the commit history for the current branch?',
  'git trace',
  'git history',
  'git list',
  'git log',
  'D',
  'Option D is correct. git log outputs commit history details.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000001000020',
  '00000000-0002-4000-a000-000000000001',
  20,
  'Q20. Which command combines changes from one branch into the active branch?',
  'git combine',
  'git merge',
  'git join',
  'git append',
  'B',
  'Option B is correct. git merge integrates history from another branch into the target branch.'
);

-- Explore Quiz 2: APIs & How They Work Mastery Quiz
INSERT INTO public.explore_quizzes (id, title, description, category, branch, difficulty, question_count, estimated_minutes, fx_reward, is_daily, is_published)
VALUES (
  '00000000-0002-4000-a000-000000000002',
  'APIs & How They Work Challenge Quiz',
  'Test your knowledge on APIs & How They Work with 20 comprehensive questions.',
  'Web Dev',
  'CSE',
  'Beginner',
  20,
  8,
  15,
  FALSE,
  TRUE
);

INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000002000001',
  '00000000-0002-4000-a000-000000000002',
  1,
  'Q1. What does API stand for?',
  'Automated Process Integration',
  'Application Programming Interface',
  'Application Protocol Index',
  'Advanced Programming Interface',
  'B',
  'Option B is correct. API stands for Application Programming Interface.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000002000002',
  '00000000-0002-4000-a000-000000000002',
  2,
  'Q2. What data format is most commonly used in modern REST APIs?',
  'CSV',
  'JSON',
  'Plain Binary',
  'Assembly Code',
  'B',
  'Option B is correct. JSON (JavaScript Object Notation) is the standard format for REST APIs.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000002000003',
  '00000000-0002-4000-a000-000000000002',
  3,
  'Q3. Which HTTP method is used to retrieve data from an API?',
  'PUT',
  'POST',
  'DELETE',
  'GET',
  'D',
  'Option D is correct. GET requests fetch data from a server endpoint.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000002000004',
  '00000000-0002-4000-a000-000000000002',
  4,
  'Q4. Which HTTP method is used to create a new resource via an API?',
  'GET',
  'POST',
  'OPTIONS',
  'HEAD',
  'B',
  'Option B is correct. POST is standard for submitting data to create new records.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000002000005',
  '00000000-0002-4000-a000-000000000002',
  5,
  'Q5. What HTTP status code indicates a successful request?',
  '500 Server Error',
  '404 Not Found',
  '200 OK',
  '403 Forbidden',
  'C',
  'Option C is correct. 200 OK signals a successful HTTP request response.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000002000006',
  '00000000-0002-4000-a000-000000000002',
  6,
  'Q6. What HTTP status code indicates that a resource was not found?',
  '404 Not Found',
  '200 OK',
  '301 Redirect',
  '502 Bad Gateway',
  'A',
  'Option A is correct. 404 means the requested endpoint or resource does not exist.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000002000007',
  '00000000-0002-4000-a000-000000000002',
  7,
  'Q7. What is an API endpoint?',
  'A database backup drive',
  'A hardware processor pin',
  'A specific URL where an API receives requests',
  'A CSS style rule',
  'C',
  'Option C is correct. An endpoint is a specific URI/URL path for interacting with a service.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000002000008',
  '00000000-0002-4000-a000-000000000002',
  8,
  'Q8. What is API Rate Limiting?',
  'Restricting the number of API requests a client can make in a given time',
  'Increasing internet download bandwidth',
  'Encrypting database passwords',
  'Deleting unused server files',
  'A',
  'Option A is correct. Rate limiting prevents abuse by limiting request velocity.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000002000009',
  '00000000-0002-4000-a000-000000000002',
  9,
  'Q9. What header is used to pass authentication tokens in HTTP requests?',
  'Content-Type',
  'Authorization',
  'Accept-Encoding',
  'User-Agent',
  'B',
  'Option B is correct. The Authorization header carries Bearer tokens or credentials.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000002000010',
  '00000000-0002-4000-a000-000000000002',
  10,
  'Q10. What is CORS in web APIs?',
  'Cloud Operations Remote Storage',
  'Central Operating Router System',
  'Client Object Recovery Service',
  'Cross-Origin Resource Sharing security mechanism',
  'D',
  'Option D is correct. CORS controls cross-domain HTTP requests from browsers.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000002000011',
  '00000000-0002-4000-a000-000000000002',
  11,
  'Q11. Which HTTP method is used to update an existing resource completely?',
  'PUT',
  'GET',
  'TRACE',
  'CONNECT',
  'A',
  'Option A is correct. PUT updates or replaces a target resource representation.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000002000012',
  '00000000-0002-4000-a000-000000000002',
  12,
  'Q12. Which HTTP method is used for partial updates to a resource?',
  'GET',
  'POST',
  'OPTIONS',
  'PATCH',
  'D',
  'Option D is correct. PATCH applies partial modifications to a resource.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000002000013',
  '00000000-0002-4000-a000-000000000002',
  13,
  'Q13. What does statelessness mean in REST APIs?',
  'Each request from a client contains all necessary information and no session state is stored on the server',
  'Servers store all user cookies in memory',
  'APIs cannot connect to databases',
  'Clients do not receive response codes',
  'A',
  'Option A is correct. Statelessness means the server does not hold client session context between calls.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000002000014',
  '00000000-0002-4000-a000-000000000002',
  14,
  'Q14. What is a Webhook?',
  'An automated HTTP callback triggered by an event',
  'A browser extension',
  'A physical network plug',
  'A CSS animation keyframe',
  'A',
  'Option A is correct. Webhooks send real-time event notifications via HTTP POST.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000002000015',
  '00000000-0002-4000-a000-000000000002',
  15,
  'Q15. What tool is commonly used to test and inspect HTTP APIs?',
  'Postman or cURL',
  'Photoshop',
  'Docker Engine',
  'Git Bash only',
  'A',
  'Option A is correct. Postman and cURL are industry standards for API testing.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000002000016',
  '00000000-0002-4000-a000-000000000002',
  16,
  'Q16. What HTTP status code represents a server-side error?',
  '400 Bad Request',
  '200 OK',
  '500 Internal Server Error',
  '401 Unauthorized',
  'C',
  'Option C is correct. 500-level codes indicate unexpected errors on the server.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000002000017',
  '00000000-0002-4000-a000-000000000002',
  17,
  'Q17. What HTTP status code represents an unauthorized or unauthenticated request?',
  '200 OK',
  '401 Unauthorized',
  '404 Not Found',
  '302 Found',
  'B',
  'Option B is correct. 401 indicates missing or invalid authentication credentials.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000002000018',
  '00000000-0002-4000-a000-000000000002',
  18,
  'Q18. What HTTP status code indicates forbidden access despite authentication?',
  '404 Not Found',
  '200 OK',
  '403 Forbidden',
  '500 Server Error',
  'C',
  'Option C is correct. 403 means the server understands credentials but refuses access.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000002000019',
  '00000000-0002-4000-a000-000000000002',
  19,
  'Q19. What content type header is set when sending JSON payloads?',
  'application/x-www-form-urlencoded',
  'text/html',
  'multipart/form-data',
  'application/json',
  'D',
  'Option D is correct. application/json informs the server that request payload is JSON formatted.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000002000020',
  '00000000-0002-4000-a000-000000000002',
  20,
  'Q20. What does OpenAPI (Swagger) specification provide?',
  'A CSS styling framework',
  'A database storage engine',
  'A standard description format for RESTful APIs',
  'An operating system kernel',
  'C',
  'Option C is correct. OpenAPI provides machine-readable documentation and contract specifications for APIs.'
);

-- Explore Quiz 3: Cloud Computing Basics Mastery Quiz
INSERT INTO public.explore_quizzes (id, title, description, category, branch, difficulty, question_count, estimated_minutes, fx_reward, is_daily, is_published)
VALUES (
  '00000000-0002-4000-a000-000000000003',
  'Cloud Computing Basics Challenge Quiz',
  'Test your knowledge on Cloud Computing Basics with 20 comprehensive questions.',
  'Cloud',
  'CSE',
  'Beginner',
  20,
  8,
  15,
  FALSE,
  TRUE
);

INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000003000001',
  '00000000-0002-4000-a000-000000000003',
  1,
  'Q1. What is the primary definition of Cloud Computing Basics?',
  'Bypassing standard security checks and protocols in Cloud Computing Basics.',
  'Legacy manual processing for Cloud Computing Basics.',
  'A core technology or standard designed for managing and executing Cloud Computing Basics processes.',
  'Hardcoding static binary files without backup in Cloud Computing Basics.',
  'C',
  'Option C is correct. A core technology or standard designed for managing and executing Cloud Computing Basics processes.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000003000002',
  '00000000-0002-4000-a000-000000000003',
  2,
  'Q2. Which key benefit is provided by Cloud Computing Basics?',
  'Hardcoding static binary files without backup in Cloud Computing Basics.',
  'Legacy manual processing for Cloud Computing Basics.',
  'Bypassing standard security checks and protocols in Cloud Computing Basics.',
  'Improved efficiency, scalability, modularity, and operational reliability.',
  'D',
  'Option D is correct. Improved efficiency, scalability, modularity, and operational reliability.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000003000003',
  '00000000-0002-4000-a000-000000000003',
  3,
  'Q3. What is a fundamental requirement when implementing Cloud Computing Basics?',
  'Hardcoding static binary files without backup in Cloud Computing Basics.',
  'Legacy manual processing for Cloud Computing Basics.',
  'Bypassing standard security checks and protocols in Cloud Computing Basics.',
  'Proper system configuration, security protocols, and integration standards.',
  'D',
  'Option D is correct. Proper system configuration, security protocols, and integration standards.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000003000004',
  '00000000-0002-4000-a000-000000000003',
  4,
  'Q4. How does Cloud Computing Basics handle data and execution states?',
  'Bypassing standard security checks and protocols in Cloud Computing Basics.',
  'Legacy manual processing for Cloud Computing Basics.',
  'By utilizing structured schemas, indexes, and optimized execution pipelines.',
  'Hardcoding static binary files without backup in Cloud Computing Basics.',
  'C',
  'Option C is correct. By utilizing structured schemas, indexes, and optimized execution pipelines.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000003000005',
  '00000000-0002-4000-a000-000000000003',
  5,
  'Q5. What is a recommended best practice when deploying Cloud Computing Basics?',
  'Bypassing standard security checks and protocols in Cloud Computing Basics.',
  'Legacy manual processing for Cloud Computing Basics.',
  'Conducting regular automated testing, logging, and monitoring checks.',
  'Hardcoding static binary files without backup in Cloud Computing Basics.',
  'C',
  'Option C is correct. Conducting regular automated testing, logging, and monitoring checks.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000003000006',
  '00000000-0002-4000-a000-000000000003',
  6,
  'Q6. Which layer or component plays a vital role in Cloud Computing Basics?',
  'Bypassing standard security checks and protocols in Cloud Computing Basics.',
  'Legacy manual processing for Cloud Computing Basics.',
  'The central execution handler and protocol controller.',
  'Hardcoding static binary files without backup in Cloud Computing Basics.',
  'C',
  'Option C is correct. The central execution handler and protocol controller.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000003000007',
  '00000000-0002-4000-a000-000000000003',
  7,
  'Q7. What is a common bottleneck or challenge in Cloud Computing Basics?',
  'Bypassing standard security checks and protocols in Cloud Computing Basics.',
  'Legacy manual processing for Cloud Computing Basics.',
  'Managing system state synchronization and resource contention under heavy load.',
  'Hardcoding static binary files without backup in Cloud Computing Basics.',
  'C',
  'Option C is correct. Managing system state synchronization and resource contention under heavy load.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000003000008',
  '00000000-0002-4000-a000-000000000003',
  8,
  'Q8. How is security typically enforced within Cloud Computing Basics?',
  'Legacy manual processing for Cloud Computing Basics.',
  'Through strong authentication, access control permissions, and data encryption.',
  'Bypassing standard security checks and protocols in Cloud Computing Basics.',
  'Hardcoding static binary files without backup in Cloud Computing Basics.',
  'B',
  'Option B is correct. Through strong authentication, access control permissions, and data encryption.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000003000009',
  '00000000-0002-4000-a000-000000000003',
  9,
  'Q9. Which metric is critical for measuring the performance of Cloud Computing Basics?',
  'Response latency, throughput, resource utilization, and error rates.',
  'Legacy manual processing for Cloud Computing Basics.',
  'Bypassing standard security checks and protocols in Cloud Computing Basics.',
  'Hardcoding static binary files without backup in Cloud Computing Basics.',
  'A',
  'Option A is correct. Response latency, throughput, resource utilization, and error rates.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000003000010',
  '00000000-0002-4000-a000-000000000003',
  10,
  'Q10. What is the role of versioning in Cloud Computing Basics?',
  'Legacy manual processing for Cloud Computing Basics.',
  'To support safe updates, maintain backward compatibility, and enable rollbacks.',
  'Bypassing standard security checks and protocols in Cloud Computing Basics.',
  'Hardcoding static binary files without backup in Cloud Computing Basics.',
  'B',
  'Option B is correct. To support safe updates, maintain backward compatibility, and enable rollbacks.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000003000011',
  '00000000-0002-4000-a000-000000000003',
  11,
  'Q11. In what scenario is Cloud Computing Basics most effectively applied?',
  'Bypassing standard security checks and protocols in Cloud Computing Basics.',
  'Legacy manual processing for Cloud Computing Basics.',
  'In modern scalable enterprise systems requiring structured workflows and reliability.',
  'Hardcoding static binary files without backup in Cloud Computing Basics.',
  'C',
  'Option C is correct. In modern scalable enterprise systems requiring structured workflows and reliability.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000003000012',
  '00000000-0002-4000-a000-000000000003',
  12,
  'Q12. Which tool or interface is standard for interacting with Cloud Computing Basics?',
  'Legacy manual processing for Cloud Computing Basics.',
  'Dedicated command line tools, SDK APIs, and management dashboards.',
  'Bypassing standard security checks and protocols in Cloud Computing Basics.',
  'Hardcoding static binary files without backup in Cloud Computing Basics.',
  'B',
  'Option B is correct. Dedicated command line tools, SDK APIs, and management dashboards.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000003000013',
  '00000000-0002-4000-a000-000000000003',
  13,
  'Q13. What is the initial phase when developing with Cloud Computing Basics?',
  'Hardcoding static binary files without backup in Cloud Computing Basics.',
  'Legacy manual processing for Cloud Computing Basics.',
  'Bypassing standard security checks and protocols in Cloud Computing Basics.',
  'Defining requirements, setting up the development environment, and configuring dependencies.',
  'D',
  'Option D is correct. Defining requirements, setting up the development environment, and configuring dependencies.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000003000014',
  '00000000-0002-4000-a000-000000000003',
  14,
  'Q14. Which debugging technique is recommended for Cloud Computing Basics?',
  'Bypassing standard security checks and protocols in Cloud Computing Basics.',
  'Legacy manual processing for Cloud Computing Basics.',
  'Inspecting log trace files, using debugger tools, and verifying stack traces.',
  'Hardcoding static binary files without backup in Cloud Computing Basics.',
  'C',
  'Option C is correct. Inspecting log trace files, using debugger tools, and verifying stack traces.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000003000015',
  '00000000-0002-4000-a000-000000000003',
  15,
  'Q15. What is the overall goal of mastering Cloud Computing Basics?',
  'Hardcoding static binary files without backup in Cloud Computing Basics.',
  'Legacy manual processing for Cloud Computing Basics.',
  'Bypassing standard security checks and protocols in Cloud Computing Basics.',
  'To design, build, and maintain production-ready technology solutions.',
  'D',
  'Option D is correct. To design, build, and maintain production-ready technology solutions.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000003000016',
  '00000000-0002-4000-a000-000000000003',
  16,
  'Q16. What is the primary definition of Cloud Computing Basics?',
  'A core technology or standard designed for managing and executing Cloud Computing Basics processes.',
  'Legacy manual processing for Cloud Computing Basics.',
  'Bypassing standard security checks and protocols in Cloud Computing Basics.',
  'Hardcoding static binary files without backup in Cloud Computing Basics.',
  'A',
  'Option A is correct. A core technology or standard designed for managing and executing Cloud Computing Basics processes.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000003000017',
  '00000000-0002-4000-a000-000000000003',
  17,
  'Q17. Which key benefit is provided by Cloud Computing Basics?',
  'Hardcoding static binary files without backup in Cloud Computing Basics.',
  'Legacy manual processing for Cloud Computing Basics.',
  'Bypassing standard security checks and protocols in Cloud Computing Basics.',
  'Improved efficiency, scalability, modularity, and operational reliability.',
  'D',
  'Option D is correct. Improved efficiency, scalability, modularity, and operational reliability.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000003000018',
  '00000000-0002-4000-a000-000000000003',
  18,
  'Q18. What is a fundamental requirement when implementing Cloud Computing Basics?',
  'Proper system configuration, security protocols, and integration standards.',
  'Legacy manual processing for Cloud Computing Basics.',
  'Bypassing standard security checks and protocols in Cloud Computing Basics.',
  'Hardcoding static binary files without backup in Cloud Computing Basics.',
  'A',
  'Option A is correct. Proper system configuration, security protocols, and integration standards.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000003000019',
  '00000000-0002-4000-a000-000000000003',
  19,
  'Q19. How does Cloud Computing Basics handle data and execution states?',
  'By utilizing structured schemas, indexes, and optimized execution pipelines.',
  'Legacy manual processing for Cloud Computing Basics.',
  'Bypassing standard security checks and protocols in Cloud Computing Basics.',
  'Hardcoding static binary files without backup in Cloud Computing Basics.',
  'A',
  'Option A is correct. By utilizing structured schemas, indexes, and optimized execution pipelines.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000003000020',
  '00000000-0002-4000-a000-000000000003',
  20,
  'Q20. What is a recommended best practice when deploying Cloud Computing Basics?',
  'Hardcoding static binary files without backup in Cloud Computing Basics.',
  'Legacy manual processing for Cloud Computing Basics.',
  'Bypassing standard security checks and protocols in Cloud Computing Basics.',
  'Conducting regular automated testing, logging, and monitoring checks.',
  'D',
  'Option D is correct. Conducting regular automated testing, logging, and monitoring checks.'
);

-- Explore Quiz 4: Cybersecurity Basics Mastery Quiz
INSERT INTO public.explore_quizzes (id, title, description, category, branch, difficulty, question_count, estimated_minutes, fx_reward, is_daily, is_published)
VALUES (
  '00000000-0002-4000-a000-000000000004',
  'Cybersecurity Basics Challenge Quiz',
  'Test your knowledge on Cybersecurity Basics with 20 comprehensive questions.',
  'Security',
  'CSE',
  'Beginner',
  20,
  8,
  15,
  FALSE,
  TRUE
);

INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000004000001',
  '00000000-0002-4000-a000-000000000004',
  1,
  'Q1. What is the primary definition of Cybersecurity Basics?',
  'Hardcoding static binary files without backup in Cybersecurity Basics.',
  'Legacy manual processing for Cybersecurity Basics.',
  'Bypassing standard security checks and protocols in Cybersecurity Basics.',
  'A core technology or standard designed for managing and executing Cybersecurity Basics processes.',
  'D',
  'Option D is correct. A core technology or standard designed for managing and executing Cybersecurity Basics processes.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000004000002',
  '00000000-0002-4000-a000-000000000004',
  2,
  'Q2. Which key benefit is provided by Cybersecurity Basics?',
  'Bypassing standard security checks and protocols in Cybersecurity Basics.',
  'Legacy manual processing for Cybersecurity Basics.',
  'Improved efficiency, scalability, modularity, and operational reliability.',
  'Hardcoding static binary files without backup in Cybersecurity Basics.',
  'C',
  'Option C is correct. Improved efficiency, scalability, modularity, and operational reliability.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000004000003',
  '00000000-0002-4000-a000-000000000004',
  3,
  'Q3. What is a fundamental requirement when implementing Cybersecurity Basics?',
  'Legacy manual processing for Cybersecurity Basics.',
  'Proper system configuration, security protocols, and integration standards.',
  'Bypassing standard security checks and protocols in Cybersecurity Basics.',
  'Hardcoding static binary files without backup in Cybersecurity Basics.',
  'B',
  'Option B is correct. Proper system configuration, security protocols, and integration standards.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000004000004',
  '00000000-0002-4000-a000-000000000004',
  4,
  'Q4. How does Cybersecurity Basics handle data and execution states?',
  'Hardcoding static binary files without backup in Cybersecurity Basics.',
  'Legacy manual processing for Cybersecurity Basics.',
  'Bypassing standard security checks and protocols in Cybersecurity Basics.',
  'By utilizing structured schemas, indexes, and optimized execution pipelines.',
  'D',
  'Option D is correct. By utilizing structured schemas, indexes, and optimized execution pipelines.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000004000005',
  '00000000-0002-4000-a000-000000000004',
  5,
  'Q5. What is a recommended best practice when deploying Cybersecurity Basics?',
  'Hardcoding static binary files without backup in Cybersecurity Basics.',
  'Legacy manual processing for Cybersecurity Basics.',
  'Bypassing standard security checks and protocols in Cybersecurity Basics.',
  'Conducting regular automated testing, logging, and monitoring checks.',
  'D',
  'Option D is correct. Conducting regular automated testing, logging, and monitoring checks.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000004000006',
  '00000000-0002-4000-a000-000000000004',
  6,
  'Q6. Which layer or component plays a vital role in Cybersecurity Basics?',
  'Bypassing standard security checks and protocols in Cybersecurity Basics.',
  'Legacy manual processing for Cybersecurity Basics.',
  'The central execution handler and protocol controller.',
  'Hardcoding static binary files without backup in Cybersecurity Basics.',
  'C',
  'Option C is correct. The central execution handler and protocol controller.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000004000007',
  '00000000-0002-4000-a000-000000000004',
  7,
  'Q7. What is a common bottleneck or challenge in Cybersecurity Basics?',
  'Hardcoding static binary files without backup in Cybersecurity Basics.',
  'Legacy manual processing for Cybersecurity Basics.',
  'Bypassing standard security checks and protocols in Cybersecurity Basics.',
  'Managing system state synchronization and resource contention under heavy load.',
  'D',
  'Option D is correct. Managing system state synchronization and resource contention under heavy load.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000004000008',
  '00000000-0002-4000-a000-000000000004',
  8,
  'Q8. How is security typically enforced within Cybersecurity Basics?',
  'Bypassing standard security checks and protocols in Cybersecurity Basics.',
  'Legacy manual processing for Cybersecurity Basics.',
  'Through strong authentication, access control permissions, and data encryption.',
  'Hardcoding static binary files without backup in Cybersecurity Basics.',
  'C',
  'Option C is correct. Through strong authentication, access control permissions, and data encryption.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000004000009',
  '00000000-0002-4000-a000-000000000004',
  9,
  'Q9. Which metric is critical for measuring the performance of Cybersecurity Basics?',
  'Hardcoding static binary files without backup in Cybersecurity Basics.',
  'Legacy manual processing for Cybersecurity Basics.',
  'Bypassing standard security checks and protocols in Cybersecurity Basics.',
  'Response latency, throughput, resource utilization, and error rates.',
  'D',
  'Option D is correct. Response latency, throughput, resource utilization, and error rates.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000004000010',
  '00000000-0002-4000-a000-000000000004',
  10,
  'Q10. What is the role of versioning in Cybersecurity Basics?',
  'Hardcoding static binary files without backup in Cybersecurity Basics.',
  'Legacy manual processing for Cybersecurity Basics.',
  'Bypassing standard security checks and protocols in Cybersecurity Basics.',
  'To support safe updates, maintain backward compatibility, and enable rollbacks.',
  'D',
  'Option D is correct. To support safe updates, maintain backward compatibility, and enable rollbacks.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000004000011',
  '00000000-0002-4000-a000-000000000004',
  11,
  'Q11. In what scenario is Cybersecurity Basics most effectively applied?',
  'Bypassing standard security checks and protocols in Cybersecurity Basics.',
  'Legacy manual processing for Cybersecurity Basics.',
  'In modern scalable enterprise systems requiring structured workflows and reliability.',
  'Hardcoding static binary files without backup in Cybersecurity Basics.',
  'C',
  'Option C is correct. In modern scalable enterprise systems requiring structured workflows and reliability.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000004000012',
  '00000000-0002-4000-a000-000000000004',
  12,
  'Q12. Which tool or interface is standard for interacting with Cybersecurity Basics?',
  'Hardcoding static binary files without backup in Cybersecurity Basics.',
  'Legacy manual processing for Cybersecurity Basics.',
  'Bypassing standard security checks and protocols in Cybersecurity Basics.',
  'Dedicated command line tools, SDK APIs, and management dashboards.',
  'D',
  'Option D is correct. Dedicated command line tools, SDK APIs, and management dashboards.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000004000013',
  '00000000-0002-4000-a000-000000000004',
  13,
  'Q13. What is the initial phase when developing with Cybersecurity Basics?',
  'Hardcoding static binary files without backup in Cybersecurity Basics.',
  'Legacy manual processing for Cybersecurity Basics.',
  'Bypassing standard security checks and protocols in Cybersecurity Basics.',
  'Defining requirements, setting up the development environment, and configuring dependencies.',
  'D',
  'Option D is correct. Defining requirements, setting up the development environment, and configuring dependencies.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000004000014',
  '00000000-0002-4000-a000-000000000004',
  14,
  'Q14. Which debugging technique is recommended for Cybersecurity Basics?',
  'Inspecting log trace files, using debugger tools, and verifying stack traces.',
  'Legacy manual processing for Cybersecurity Basics.',
  'Bypassing standard security checks and protocols in Cybersecurity Basics.',
  'Hardcoding static binary files without backup in Cybersecurity Basics.',
  'A',
  'Option A is correct. Inspecting log trace files, using debugger tools, and verifying stack traces.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000004000015',
  '00000000-0002-4000-a000-000000000004',
  15,
  'Q15. What is the overall goal of mastering Cybersecurity Basics?',
  'Bypassing standard security checks and protocols in Cybersecurity Basics.',
  'Legacy manual processing for Cybersecurity Basics.',
  'To design, build, and maintain production-ready technology solutions.',
  'Hardcoding static binary files without backup in Cybersecurity Basics.',
  'C',
  'Option C is correct. To design, build, and maintain production-ready technology solutions.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000004000016',
  '00000000-0002-4000-a000-000000000004',
  16,
  'Q16. What is the primary definition of Cybersecurity Basics?',
  'Hardcoding static binary files without backup in Cybersecurity Basics.',
  'Legacy manual processing for Cybersecurity Basics.',
  'Bypassing standard security checks and protocols in Cybersecurity Basics.',
  'A core technology or standard designed for managing and executing Cybersecurity Basics processes.',
  'D',
  'Option D is correct. A core technology or standard designed for managing and executing Cybersecurity Basics processes.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000004000017',
  '00000000-0002-4000-a000-000000000004',
  17,
  'Q17. Which key benefit is provided by Cybersecurity Basics?',
  'Legacy manual processing for Cybersecurity Basics.',
  'Improved efficiency, scalability, modularity, and operational reliability.',
  'Bypassing standard security checks and protocols in Cybersecurity Basics.',
  'Hardcoding static binary files without backup in Cybersecurity Basics.',
  'B',
  'Option B is correct. Improved efficiency, scalability, modularity, and operational reliability.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000004000018',
  '00000000-0002-4000-a000-000000000004',
  18,
  'Q18. What is a fundamental requirement when implementing Cybersecurity Basics?',
  'Hardcoding static binary files without backup in Cybersecurity Basics.',
  'Legacy manual processing for Cybersecurity Basics.',
  'Bypassing standard security checks and protocols in Cybersecurity Basics.',
  'Proper system configuration, security protocols, and integration standards.',
  'D',
  'Option D is correct. Proper system configuration, security protocols, and integration standards.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000004000019',
  '00000000-0002-4000-a000-000000000004',
  19,
  'Q19. How does Cybersecurity Basics handle data and execution states?',
  'Legacy manual processing for Cybersecurity Basics.',
  'By utilizing structured schemas, indexes, and optimized execution pipelines.',
  'Bypassing standard security checks and protocols in Cybersecurity Basics.',
  'Hardcoding static binary files without backup in Cybersecurity Basics.',
  'B',
  'Option B is correct. By utilizing structured schemas, indexes, and optimized execution pipelines.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000004000020',
  '00000000-0002-4000-a000-000000000004',
  20,
  'Q20. What is a recommended best practice when deploying Cybersecurity Basics?',
  'Conducting regular automated testing, logging, and monitoring checks.',
  'Legacy manual processing for Cybersecurity Basics.',
  'Bypassing standard security checks and protocols in Cybersecurity Basics.',
  'Hardcoding static binary files without backup in Cybersecurity Basics.',
  'A',
  'Option A is correct. Conducting regular automated testing, logging, and monitoring checks.'
);

-- Explore Quiz 5: Linux Basics Mastery Quiz
INSERT INTO public.explore_quizzes (id, title, description, category, branch, difficulty, question_count, estimated_minutes, fx_reward, is_daily, is_published)
VALUES (
  '00000000-0002-4000-a000-000000000005',
  'Linux Basics Challenge Quiz',
  'Test your knowledge on Linux Basics with 20 comprehensive questions.',
  'OS',
  'CSE',
  'Beginner',
  20,
  8,
  15,
  FALSE,
  TRUE
);

INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000005000001',
  '00000000-0002-4000-a000-000000000005',
  1,
  'Q1. What is the primary definition of Linux Basics?',
  'Bypassing standard security checks and protocols in Linux Basics.',
  'Legacy manual processing for Linux Basics.',
  'A core technology or standard designed for managing and executing Linux Basics processes.',
  'Hardcoding static binary files without backup in Linux Basics.',
  'C',
  'Option C is correct. A core technology or standard designed for managing and executing Linux Basics processes.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000005000002',
  '00000000-0002-4000-a000-000000000005',
  2,
  'Q2. Which key benefit is provided by Linux Basics?',
  'Hardcoding static binary files without backup in Linux Basics.',
  'Legacy manual processing for Linux Basics.',
  'Bypassing standard security checks and protocols in Linux Basics.',
  'Improved efficiency, scalability, modularity, and operational reliability.',
  'D',
  'Option D is correct. Improved efficiency, scalability, modularity, and operational reliability.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000005000003',
  '00000000-0002-4000-a000-000000000005',
  3,
  'Q3. What is a fundamental requirement when implementing Linux Basics?',
  'Bypassing standard security checks and protocols in Linux Basics.',
  'Legacy manual processing for Linux Basics.',
  'Proper system configuration, security protocols, and integration standards.',
  'Hardcoding static binary files without backup in Linux Basics.',
  'C',
  'Option C is correct. Proper system configuration, security protocols, and integration standards.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000005000004',
  '00000000-0002-4000-a000-000000000005',
  4,
  'Q4. How does Linux Basics handle data and execution states?',
  'Hardcoding static binary files without backup in Linux Basics.',
  'Legacy manual processing for Linux Basics.',
  'Bypassing standard security checks and protocols in Linux Basics.',
  'By utilizing structured schemas, indexes, and optimized execution pipelines.',
  'D',
  'Option D is correct. By utilizing structured schemas, indexes, and optimized execution pipelines.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000005000005',
  '00000000-0002-4000-a000-000000000005',
  5,
  'Q5. What is a recommended best practice when deploying Linux Basics?',
  'Conducting regular automated testing, logging, and monitoring checks.',
  'Legacy manual processing for Linux Basics.',
  'Bypassing standard security checks and protocols in Linux Basics.',
  'Hardcoding static binary files without backup in Linux Basics.',
  'A',
  'Option A is correct. Conducting regular automated testing, logging, and monitoring checks.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000005000006',
  '00000000-0002-4000-a000-000000000005',
  6,
  'Q6. Which layer or component plays a vital role in Linux Basics?',
  'The central execution handler and protocol controller.',
  'Legacy manual processing for Linux Basics.',
  'Bypassing standard security checks and protocols in Linux Basics.',
  'Hardcoding static binary files without backup in Linux Basics.',
  'A',
  'Option A is correct. The central execution handler and protocol controller.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000005000007',
  '00000000-0002-4000-a000-000000000005',
  7,
  'Q7. What is a common bottleneck or challenge in Linux Basics?',
  'Legacy manual processing for Linux Basics.',
  'Managing system state synchronization and resource contention under heavy load.',
  'Bypassing standard security checks and protocols in Linux Basics.',
  'Hardcoding static binary files without backup in Linux Basics.',
  'B',
  'Option B is correct. Managing system state synchronization and resource contention under heavy load.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000005000008',
  '00000000-0002-4000-a000-000000000005',
  8,
  'Q8. How is security typically enforced within Linux Basics?',
  'Legacy manual processing for Linux Basics.',
  'Through strong authentication, access control permissions, and data encryption.',
  'Bypassing standard security checks and protocols in Linux Basics.',
  'Hardcoding static binary files without backup in Linux Basics.',
  'B',
  'Option B is correct. Through strong authentication, access control permissions, and data encryption.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000005000009',
  '00000000-0002-4000-a000-000000000005',
  9,
  'Q9. Which metric is critical for measuring the performance of Linux Basics?',
  'Legacy manual processing for Linux Basics.',
  'Response latency, throughput, resource utilization, and error rates.',
  'Bypassing standard security checks and protocols in Linux Basics.',
  'Hardcoding static binary files without backup in Linux Basics.',
  'B',
  'Option B is correct. Response latency, throughput, resource utilization, and error rates.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000005000010',
  '00000000-0002-4000-a000-000000000005',
  10,
  'Q10. What is the role of versioning in Linux Basics?',
  'Legacy manual processing for Linux Basics.',
  'To support safe updates, maintain backward compatibility, and enable rollbacks.',
  'Bypassing standard security checks and protocols in Linux Basics.',
  'Hardcoding static binary files without backup in Linux Basics.',
  'B',
  'Option B is correct. To support safe updates, maintain backward compatibility, and enable rollbacks.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000005000011',
  '00000000-0002-4000-a000-000000000005',
  11,
  'Q11. In what scenario is Linux Basics most effectively applied?',
  'In modern scalable enterprise systems requiring structured workflows and reliability.',
  'Legacy manual processing for Linux Basics.',
  'Bypassing standard security checks and protocols in Linux Basics.',
  'Hardcoding static binary files without backup in Linux Basics.',
  'A',
  'Option A is correct. In modern scalable enterprise systems requiring structured workflows and reliability.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000005000012',
  '00000000-0002-4000-a000-000000000005',
  12,
  'Q12. Which tool or interface is standard for interacting with Linux Basics?',
  'Bypassing standard security checks and protocols in Linux Basics.',
  'Legacy manual processing for Linux Basics.',
  'Dedicated command line tools, SDK APIs, and management dashboards.',
  'Hardcoding static binary files without backup in Linux Basics.',
  'C',
  'Option C is correct. Dedicated command line tools, SDK APIs, and management dashboards.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000005000013',
  '00000000-0002-4000-a000-000000000005',
  13,
  'Q13. What is the initial phase when developing with Linux Basics?',
  'Hardcoding static binary files without backup in Linux Basics.',
  'Legacy manual processing for Linux Basics.',
  'Bypassing standard security checks and protocols in Linux Basics.',
  'Defining requirements, setting up the development environment, and configuring dependencies.',
  'D',
  'Option D is correct. Defining requirements, setting up the development environment, and configuring dependencies.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000005000014',
  '00000000-0002-4000-a000-000000000005',
  14,
  'Q14. Which debugging technique is recommended for Linux Basics?',
  'Hardcoding static binary files without backup in Linux Basics.',
  'Legacy manual processing for Linux Basics.',
  'Bypassing standard security checks and protocols in Linux Basics.',
  'Inspecting log trace files, using debugger tools, and verifying stack traces.',
  'D',
  'Option D is correct. Inspecting log trace files, using debugger tools, and verifying stack traces.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000005000015',
  '00000000-0002-4000-a000-000000000005',
  15,
  'Q15. What is the overall goal of mastering Linux Basics?',
  'To design, build, and maintain production-ready technology solutions.',
  'Legacy manual processing for Linux Basics.',
  'Bypassing standard security checks and protocols in Linux Basics.',
  'Hardcoding static binary files without backup in Linux Basics.',
  'A',
  'Option A is correct. To design, build, and maintain production-ready technology solutions.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000005000016',
  '00000000-0002-4000-a000-000000000005',
  16,
  'Q16. What is the primary definition of Linux Basics?',
  'Bypassing standard security checks and protocols in Linux Basics.',
  'Legacy manual processing for Linux Basics.',
  'A core technology or standard designed for managing and executing Linux Basics processes.',
  'Hardcoding static binary files without backup in Linux Basics.',
  'C',
  'Option C is correct. A core technology or standard designed for managing and executing Linux Basics processes.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000005000017',
  '00000000-0002-4000-a000-000000000005',
  17,
  'Q17. Which key benefit is provided by Linux Basics?',
  'Hardcoding static binary files without backup in Linux Basics.',
  'Legacy manual processing for Linux Basics.',
  'Bypassing standard security checks and protocols in Linux Basics.',
  'Improved efficiency, scalability, modularity, and operational reliability.',
  'D',
  'Option D is correct. Improved efficiency, scalability, modularity, and operational reliability.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000005000018',
  '00000000-0002-4000-a000-000000000005',
  18,
  'Q18. What is a fundamental requirement when implementing Linux Basics?',
  'Bypassing standard security checks and protocols in Linux Basics.',
  'Legacy manual processing for Linux Basics.',
  'Proper system configuration, security protocols, and integration standards.',
  'Hardcoding static binary files without backup in Linux Basics.',
  'C',
  'Option C is correct. Proper system configuration, security protocols, and integration standards.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000005000019',
  '00000000-0002-4000-a000-000000000005',
  19,
  'Q19. How does Linux Basics handle data and execution states?',
  'Legacy manual processing for Linux Basics.',
  'By utilizing structured schemas, indexes, and optimized execution pipelines.',
  'Bypassing standard security checks and protocols in Linux Basics.',
  'Hardcoding static binary files without backup in Linux Basics.',
  'B',
  'Option B is correct. By utilizing structured schemas, indexes, and optimized execution pipelines.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000005000020',
  '00000000-0002-4000-a000-000000000005',
  20,
  'Q20. What is a recommended best practice when deploying Linux Basics?',
  'Bypassing standard security checks and protocols in Linux Basics.',
  'Legacy manual processing for Linux Basics.',
  'Conducting regular automated testing, logging, and monitoring checks.',
  'Hardcoding static binary files without backup in Linux Basics.',
  'C',
  'Option C is correct. Conducting regular automated testing, logging, and monitoring checks.'
);

-- Explore Quiz 6: Operating Systems Concepts Mastery Quiz
INSERT INTO public.explore_quizzes (id, title, description, category, branch, difficulty, question_count, estimated_minutes, fx_reward, is_daily, is_published)
VALUES (
  '00000000-0002-4000-a000-000000000006',
  'Operating Systems Concepts Challenge Quiz',
  'Test your knowledge on Operating Systems Concepts with 20 comprehensive questions.',
  'OS',
  'CSE',
  'Intermediate',
  20,
  8,
  15,
  FALSE,
  TRUE
);

INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000006000001',
  '00000000-0002-4000-a000-000000000006',
  1,
  'Q1. What is the primary definition of Operating Systems Concepts?',
  'Hardcoding static binary files without backup in Operating Systems Concepts.',
  'Legacy manual processing for Operating Systems Concepts.',
  'Bypassing standard security checks and protocols in Operating Systems Concepts.',
  'A core technology or standard designed for managing and executing Operating Systems Concepts processes.',
  'D',
  'Option D is correct. A core technology or standard designed for managing and executing Operating Systems Concepts processes.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000006000002',
  '00000000-0002-4000-a000-000000000006',
  2,
  'Q2. Which key benefit is provided by Operating Systems Concepts?',
  'Legacy manual processing for Operating Systems Concepts.',
  'Improved efficiency, scalability, modularity, and operational reliability.',
  'Bypassing standard security checks and protocols in Operating Systems Concepts.',
  'Hardcoding static binary files without backup in Operating Systems Concepts.',
  'B',
  'Option B is correct. Improved efficiency, scalability, modularity, and operational reliability.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000006000003',
  '00000000-0002-4000-a000-000000000006',
  3,
  'Q3. What is a fundamental requirement when implementing Operating Systems Concepts?',
  'Proper system configuration, security protocols, and integration standards.',
  'Legacy manual processing for Operating Systems Concepts.',
  'Bypassing standard security checks and protocols in Operating Systems Concepts.',
  'Hardcoding static binary files without backup in Operating Systems Concepts.',
  'A',
  'Option A is correct. Proper system configuration, security protocols, and integration standards.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000006000004',
  '00000000-0002-4000-a000-000000000006',
  4,
  'Q4. How does Operating Systems Concepts handle data and execution states?',
  'Legacy manual processing for Operating Systems Concepts.',
  'By utilizing structured schemas, indexes, and optimized execution pipelines.',
  'Bypassing standard security checks and protocols in Operating Systems Concepts.',
  'Hardcoding static binary files without backup in Operating Systems Concepts.',
  'B',
  'Option B is correct. By utilizing structured schemas, indexes, and optimized execution pipelines.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000006000005',
  '00000000-0002-4000-a000-000000000006',
  5,
  'Q5. What is a recommended best practice when deploying Operating Systems Concepts?',
  'Hardcoding static binary files without backup in Operating Systems Concepts.',
  'Legacy manual processing for Operating Systems Concepts.',
  'Bypassing standard security checks and protocols in Operating Systems Concepts.',
  'Conducting regular automated testing, logging, and monitoring checks.',
  'D',
  'Option D is correct. Conducting regular automated testing, logging, and monitoring checks.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000006000006',
  '00000000-0002-4000-a000-000000000006',
  6,
  'Q6. Which layer or component plays a vital role in Operating Systems Concepts?',
  'Hardcoding static binary files without backup in Operating Systems Concepts.',
  'Legacy manual processing for Operating Systems Concepts.',
  'Bypassing standard security checks and protocols in Operating Systems Concepts.',
  'The central execution handler and protocol controller.',
  'D',
  'Option D is correct. The central execution handler and protocol controller.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000006000007',
  '00000000-0002-4000-a000-000000000006',
  7,
  'Q7. What is a common bottleneck or challenge in Operating Systems Concepts?',
  'Bypassing standard security checks and protocols in Operating Systems Concepts.',
  'Legacy manual processing for Operating Systems Concepts.',
  'Managing system state synchronization and resource contention under heavy load.',
  'Hardcoding static binary files without backup in Operating Systems Concepts.',
  'C',
  'Option C is correct. Managing system state synchronization and resource contention under heavy load.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000006000008',
  '00000000-0002-4000-a000-000000000006',
  8,
  'Q8. How is security typically enforced within Operating Systems Concepts?',
  'Bypassing standard security checks and protocols in Operating Systems Concepts.',
  'Legacy manual processing for Operating Systems Concepts.',
  'Through strong authentication, access control permissions, and data encryption.',
  'Hardcoding static binary files without backup in Operating Systems Concepts.',
  'C',
  'Option C is correct. Through strong authentication, access control permissions, and data encryption.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000006000009',
  '00000000-0002-4000-a000-000000000006',
  9,
  'Q9. Which metric is critical for measuring the performance of Operating Systems Concepts?',
  'Response latency, throughput, resource utilization, and error rates.',
  'Legacy manual processing for Operating Systems Concepts.',
  'Bypassing standard security checks and protocols in Operating Systems Concepts.',
  'Hardcoding static binary files without backup in Operating Systems Concepts.',
  'A',
  'Option A is correct. Response latency, throughput, resource utilization, and error rates.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000006000010',
  '00000000-0002-4000-a000-000000000006',
  10,
  'Q10. What is the role of versioning in Operating Systems Concepts?',
  'Bypassing standard security checks and protocols in Operating Systems Concepts.',
  'Legacy manual processing for Operating Systems Concepts.',
  'To support safe updates, maintain backward compatibility, and enable rollbacks.',
  'Hardcoding static binary files without backup in Operating Systems Concepts.',
  'C',
  'Option C is correct. To support safe updates, maintain backward compatibility, and enable rollbacks.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000006000011',
  '00000000-0002-4000-a000-000000000006',
  11,
  'Q11. In what scenario is Operating Systems Concepts most effectively applied?',
  'Bypassing standard security checks and protocols in Operating Systems Concepts.',
  'Legacy manual processing for Operating Systems Concepts.',
  'In modern scalable enterprise systems requiring structured workflows and reliability.',
  'Hardcoding static binary files without backup in Operating Systems Concepts.',
  'C',
  'Option C is correct. In modern scalable enterprise systems requiring structured workflows and reliability.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000006000012',
  '00000000-0002-4000-a000-000000000006',
  12,
  'Q12. Which tool or interface is standard for interacting with Operating Systems Concepts?',
  'Bypassing standard security checks and protocols in Operating Systems Concepts.',
  'Legacy manual processing for Operating Systems Concepts.',
  'Dedicated command line tools, SDK APIs, and management dashboards.',
  'Hardcoding static binary files without backup in Operating Systems Concepts.',
  'C',
  'Option C is correct. Dedicated command line tools, SDK APIs, and management dashboards.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000006000013',
  '00000000-0002-4000-a000-000000000006',
  13,
  'Q13. What is the initial phase when developing with Operating Systems Concepts?',
  'Defining requirements, setting up the development environment, and configuring dependencies.',
  'Legacy manual processing for Operating Systems Concepts.',
  'Bypassing standard security checks and protocols in Operating Systems Concepts.',
  'Hardcoding static binary files without backup in Operating Systems Concepts.',
  'A',
  'Option A is correct. Defining requirements, setting up the development environment, and configuring dependencies.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000006000014',
  '00000000-0002-4000-a000-000000000006',
  14,
  'Q14. Which debugging technique is recommended for Operating Systems Concepts?',
  'Bypassing standard security checks and protocols in Operating Systems Concepts.',
  'Legacy manual processing for Operating Systems Concepts.',
  'Inspecting log trace files, using debugger tools, and verifying stack traces.',
  'Hardcoding static binary files without backup in Operating Systems Concepts.',
  'C',
  'Option C is correct. Inspecting log trace files, using debugger tools, and verifying stack traces.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000006000015',
  '00000000-0002-4000-a000-000000000006',
  15,
  'Q15. What is the overall goal of mastering Operating Systems Concepts?',
  'Legacy manual processing for Operating Systems Concepts.',
  'To design, build, and maintain production-ready technology solutions.',
  'Bypassing standard security checks and protocols in Operating Systems Concepts.',
  'Hardcoding static binary files without backup in Operating Systems Concepts.',
  'B',
  'Option B is correct. To design, build, and maintain production-ready technology solutions.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000006000016',
  '00000000-0002-4000-a000-000000000006',
  16,
  'Q16. What is the primary definition of Operating Systems Concepts?',
  'Bypassing standard security checks and protocols in Operating Systems Concepts.',
  'Legacy manual processing for Operating Systems Concepts.',
  'A core technology or standard designed for managing and executing Operating Systems Concepts processes.',
  'Hardcoding static binary files without backup in Operating Systems Concepts.',
  'C',
  'Option C is correct. A core technology or standard designed for managing and executing Operating Systems Concepts processes.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000006000017',
  '00000000-0002-4000-a000-000000000006',
  17,
  'Q17. Which key benefit is provided by Operating Systems Concepts?',
  'Hardcoding static binary files without backup in Operating Systems Concepts.',
  'Legacy manual processing for Operating Systems Concepts.',
  'Bypassing standard security checks and protocols in Operating Systems Concepts.',
  'Improved efficiency, scalability, modularity, and operational reliability.',
  'D',
  'Option D is correct. Improved efficiency, scalability, modularity, and operational reliability.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000006000018',
  '00000000-0002-4000-a000-000000000006',
  18,
  'Q18. What is a fundamental requirement when implementing Operating Systems Concepts?',
  'Bypassing standard security checks and protocols in Operating Systems Concepts.',
  'Legacy manual processing for Operating Systems Concepts.',
  'Proper system configuration, security protocols, and integration standards.',
  'Hardcoding static binary files without backup in Operating Systems Concepts.',
  'C',
  'Option C is correct. Proper system configuration, security protocols, and integration standards.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000006000019',
  '00000000-0002-4000-a000-000000000006',
  19,
  'Q19. How does Operating Systems Concepts handle data and execution states?',
  'Legacy manual processing for Operating Systems Concepts.',
  'By utilizing structured schemas, indexes, and optimized execution pipelines.',
  'Bypassing standard security checks and protocols in Operating Systems Concepts.',
  'Hardcoding static binary files without backup in Operating Systems Concepts.',
  'B',
  'Option B is correct. By utilizing structured schemas, indexes, and optimized execution pipelines.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000006000020',
  '00000000-0002-4000-a000-000000000006',
  20,
  'Q20. What is a recommended best practice when deploying Operating Systems Concepts?',
  'Bypassing standard security checks and protocols in Operating Systems Concepts.',
  'Legacy manual processing for Operating Systems Concepts.',
  'Conducting regular automated testing, logging, and monitoring checks.',
  'Hardcoding static binary files without backup in Operating Systems Concepts.',
  'C',
  'Option C is correct. Conducting regular automated testing, logging, and monitoring checks.'
);

-- Explore Quiz 7: Computer Networks Mastery Quiz
INSERT INTO public.explore_quizzes (id, title, description, category, branch, difficulty, question_count, estimated_minutes, fx_reward, is_daily, is_published)
VALUES (
  '00000000-0002-4000-a000-000000000007',
  'Computer Networks Challenge Quiz',
  'Test your knowledge on Computer Networks with 20 comprehensive questions.',
  'Networking',
  'CSE',
  'Intermediate',
  20,
  8,
  15,
  FALSE,
  TRUE
);

INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000007000001',
  '00000000-0002-4000-a000-000000000007',
  1,
  'Q1. What is the primary definition of Computer Networks?',
  'Hardcoding static binary files without backup in Computer Networks.',
  'Legacy manual processing for Computer Networks.',
  'Bypassing standard security checks and protocols in Computer Networks.',
  'A core technology or standard designed for managing and executing Computer Networks processes.',
  'D',
  'Option D is correct. A core technology or standard designed for managing and executing Computer Networks processes.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000007000002',
  '00000000-0002-4000-a000-000000000007',
  2,
  'Q2. Which key benefit is provided by Computer Networks?',
  'Improved efficiency, scalability, modularity, and operational reliability.',
  'Legacy manual processing for Computer Networks.',
  'Bypassing standard security checks and protocols in Computer Networks.',
  'Hardcoding static binary files without backup in Computer Networks.',
  'A',
  'Option A is correct. Improved efficiency, scalability, modularity, and operational reliability.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000007000003',
  '00000000-0002-4000-a000-000000000007',
  3,
  'Q3. What is a fundamental requirement when implementing Computer Networks?',
  'Legacy manual processing for Computer Networks.',
  'Proper system configuration, security protocols, and integration standards.',
  'Bypassing standard security checks and protocols in Computer Networks.',
  'Hardcoding static binary files without backup in Computer Networks.',
  'B',
  'Option B is correct. Proper system configuration, security protocols, and integration standards.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000007000004',
  '00000000-0002-4000-a000-000000000007',
  4,
  'Q4. How does Computer Networks handle data and execution states?',
  'By utilizing structured schemas, indexes, and optimized execution pipelines.',
  'Legacy manual processing for Computer Networks.',
  'Bypassing standard security checks and protocols in Computer Networks.',
  'Hardcoding static binary files without backup in Computer Networks.',
  'A',
  'Option A is correct. By utilizing structured schemas, indexes, and optimized execution pipelines.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000007000005',
  '00000000-0002-4000-a000-000000000007',
  5,
  'Q5. What is a recommended best practice when deploying Computer Networks?',
  'Bypassing standard security checks and protocols in Computer Networks.',
  'Legacy manual processing for Computer Networks.',
  'Conducting regular automated testing, logging, and monitoring checks.',
  'Hardcoding static binary files without backup in Computer Networks.',
  'C',
  'Option C is correct. Conducting regular automated testing, logging, and monitoring checks.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000007000006',
  '00000000-0002-4000-a000-000000000007',
  6,
  'Q6. Which layer or component plays a vital role in Computer Networks?',
  'The central execution handler and protocol controller.',
  'Legacy manual processing for Computer Networks.',
  'Bypassing standard security checks and protocols in Computer Networks.',
  'Hardcoding static binary files without backup in Computer Networks.',
  'A',
  'Option A is correct. The central execution handler and protocol controller.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000007000007',
  '00000000-0002-4000-a000-000000000007',
  7,
  'Q7. What is a common bottleneck or challenge in Computer Networks?',
  'Bypassing standard security checks and protocols in Computer Networks.',
  'Legacy manual processing for Computer Networks.',
  'Managing system state synchronization and resource contention under heavy load.',
  'Hardcoding static binary files without backup in Computer Networks.',
  'C',
  'Option C is correct. Managing system state synchronization and resource contention under heavy load.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000007000008',
  '00000000-0002-4000-a000-000000000007',
  8,
  'Q8. How is security typically enforced within Computer Networks?',
  'Hardcoding static binary files without backup in Computer Networks.',
  'Legacy manual processing for Computer Networks.',
  'Bypassing standard security checks and protocols in Computer Networks.',
  'Through strong authentication, access control permissions, and data encryption.',
  'D',
  'Option D is correct. Through strong authentication, access control permissions, and data encryption.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000007000009',
  '00000000-0002-4000-a000-000000000007',
  9,
  'Q9. Which metric is critical for measuring the performance of Computer Networks?',
  'Bypassing standard security checks and protocols in Computer Networks.',
  'Legacy manual processing for Computer Networks.',
  'Response latency, throughput, resource utilization, and error rates.',
  'Hardcoding static binary files without backup in Computer Networks.',
  'C',
  'Option C is correct. Response latency, throughput, resource utilization, and error rates.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000007000010',
  '00000000-0002-4000-a000-000000000007',
  10,
  'Q10. What is the role of versioning in Computer Networks?',
  'Hardcoding static binary files without backup in Computer Networks.',
  'Legacy manual processing for Computer Networks.',
  'Bypassing standard security checks and protocols in Computer Networks.',
  'To support safe updates, maintain backward compatibility, and enable rollbacks.',
  'D',
  'Option D is correct. To support safe updates, maintain backward compatibility, and enable rollbacks.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000007000011',
  '00000000-0002-4000-a000-000000000007',
  11,
  'Q11. In what scenario is Computer Networks most effectively applied?',
  'Legacy manual processing for Computer Networks.',
  'In modern scalable enterprise systems requiring structured workflows and reliability.',
  'Bypassing standard security checks and protocols in Computer Networks.',
  'Hardcoding static binary files without backup in Computer Networks.',
  'B',
  'Option B is correct. In modern scalable enterprise systems requiring structured workflows and reliability.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000007000012',
  '00000000-0002-4000-a000-000000000007',
  12,
  'Q12. Which tool or interface is standard for interacting with Computer Networks?',
  'Bypassing standard security checks and protocols in Computer Networks.',
  'Legacy manual processing for Computer Networks.',
  'Dedicated command line tools, SDK APIs, and management dashboards.',
  'Hardcoding static binary files without backup in Computer Networks.',
  'C',
  'Option C is correct. Dedicated command line tools, SDK APIs, and management dashboards.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000007000013',
  '00000000-0002-4000-a000-000000000007',
  13,
  'Q13. What is the initial phase when developing with Computer Networks?',
  'Legacy manual processing for Computer Networks.',
  'Defining requirements, setting up the development environment, and configuring dependencies.',
  'Bypassing standard security checks and protocols in Computer Networks.',
  'Hardcoding static binary files without backup in Computer Networks.',
  'B',
  'Option B is correct. Defining requirements, setting up the development environment, and configuring dependencies.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000007000014',
  '00000000-0002-4000-a000-000000000007',
  14,
  'Q14. Which debugging technique is recommended for Computer Networks?',
  'Legacy manual processing for Computer Networks.',
  'Inspecting log trace files, using debugger tools, and verifying stack traces.',
  'Bypassing standard security checks and protocols in Computer Networks.',
  'Hardcoding static binary files without backup in Computer Networks.',
  'B',
  'Option B is correct. Inspecting log trace files, using debugger tools, and verifying stack traces.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000007000015',
  '00000000-0002-4000-a000-000000000007',
  15,
  'Q15. What is the overall goal of mastering Computer Networks?',
  'To design, build, and maintain production-ready technology solutions.',
  'Legacy manual processing for Computer Networks.',
  'Bypassing standard security checks and protocols in Computer Networks.',
  'Hardcoding static binary files without backup in Computer Networks.',
  'A',
  'Option A is correct. To design, build, and maintain production-ready technology solutions.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000007000016',
  '00000000-0002-4000-a000-000000000007',
  16,
  'Q16. What is the primary definition of Computer Networks?',
  'A core technology or standard designed for managing and executing Computer Networks processes.',
  'Legacy manual processing for Computer Networks.',
  'Bypassing standard security checks and protocols in Computer Networks.',
  'Hardcoding static binary files without backup in Computer Networks.',
  'A',
  'Option A is correct. A core technology or standard designed for managing and executing Computer Networks processes.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000007000017',
  '00000000-0002-4000-a000-000000000007',
  17,
  'Q17. Which key benefit is provided by Computer Networks?',
  'Improved efficiency, scalability, modularity, and operational reliability.',
  'Legacy manual processing for Computer Networks.',
  'Bypassing standard security checks and protocols in Computer Networks.',
  'Hardcoding static binary files without backup in Computer Networks.',
  'A',
  'Option A is correct. Improved efficiency, scalability, modularity, and operational reliability.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000007000018',
  '00000000-0002-4000-a000-000000000007',
  18,
  'Q18. What is a fundamental requirement when implementing Computer Networks?',
  'Hardcoding static binary files without backup in Computer Networks.',
  'Legacy manual processing for Computer Networks.',
  'Bypassing standard security checks and protocols in Computer Networks.',
  'Proper system configuration, security protocols, and integration standards.',
  'D',
  'Option D is correct. Proper system configuration, security protocols, and integration standards.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000007000019',
  '00000000-0002-4000-a000-000000000007',
  19,
  'Q19. How does Computer Networks handle data and execution states?',
  'Hardcoding static binary files without backup in Computer Networks.',
  'Legacy manual processing for Computer Networks.',
  'Bypassing standard security checks and protocols in Computer Networks.',
  'By utilizing structured schemas, indexes, and optimized execution pipelines.',
  'D',
  'Option D is correct. By utilizing structured schemas, indexes, and optimized execution pipelines.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000007000020',
  '00000000-0002-4000-a000-000000000007',
  20,
  'Q20. What is a recommended best practice when deploying Computer Networks?',
  'Legacy manual processing for Computer Networks.',
  'Conducting regular automated testing, logging, and monitoring checks.',
  'Bypassing standard security checks and protocols in Computer Networks.',
  'Hardcoding static binary files without backup in Computer Networks.',
  'B',
  'Option B is correct. Conducting regular automated testing, logging, and monitoring checks.'
);

-- Explore Quiz 8: Internet & Web Technology Mastery Quiz
INSERT INTO public.explore_quizzes (id, title, description, category, branch, difficulty, question_count, estimated_minutes, fx_reward, is_daily, is_published)
VALUES (
  '00000000-0002-4000-a000-000000000008',
  'Internet & Web Technology Challenge Quiz',
  'Test your knowledge on Internet & Web Technology with 20 comprehensive questions.',
  'Web Dev',
  'CSE',
  'Beginner',
  20,
  8,
  15,
  FALSE,
  TRUE
);

INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000008000001',
  '00000000-0002-4000-a000-000000000008',
  1,
  'Q1. What is the primary definition of Internet & Web Technology?',
  'Bypassing standard security checks and protocols in Internet & Web Technology.',
  'Legacy manual processing for Internet & Web Technology.',
  'A core technology or standard designed for managing and executing Internet & Web Technology processes.',
  'Hardcoding static binary files without backup in Internet & Web Technology.',
  'C',
  'Option C is correct. A core technology or standard designed for managing and executing Internet & Web Technology processes.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000008000002',
  '00000000-0002-4000-a000-000000000008',
  2,
  'Q2. Which key benefit is provided by Internet & Web Technology?',
  'Improved efficiency, scalability, modularity, and operational reliability.',
  'Legacy manual processing for Internet & Web Technology.',
  'Bypassing standard security checks and protocols in Internet & Web Technology.',
  'Hardcoding static binary files without backup in Internet & Web Technology.',
  'A',
  'Option A is correct. Improved efficiency, scalability, modularity, and operational reliability.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000008000003',
  '00000000-0002-4000-a000-000000000008',
  3,
  'Q3. What is a fundamental requirement when implementing Internet & Web Technology?',
  'Proper system configuration, security protocols, and integration standards.',
  'Legacy manual processing for Internet & Web Technology.',
  'Bypassing standard security checks and protocols in Internet & Web Technology.',
  'Hardcoding static binary files without backup in Internet & Web Technology.',
  'A',
  'Option A is correct. Proper system configuration, security protocols, and integration standards.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000008000004',
  '00000000-0002-4000-a000-000000000008',
  4,
  'Q4. How does Internet & Web Technology handle data and execution states?',
  'Legacy manual processing for Internet & Web Technology.',
  'By utilizing structured schemas, indexes, and optimized execution pipelines.',
  'Bypassing standard security checks and protocols in Internet & Web Technology.',
  'Hardcoding static binary files without backup in Internet & Web Technology.',
  'B',
  'Option B is correct. By utilizing structured schemas, indexes, and optimized execution pipelines.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000008000005',
  '00000000-0002-4000-a000-000000000008',
  5,
  'Q5. What is a recommended best practice when deploying Internet & Web Technology?',
  'Hardcoding static binary files without backup in Internet & Web Technology.',
  'Legacy manual processing for Internet & Web Technology.',
  'Bypassing standard security checks and protocols in Internet & Web Technology.',
  'Conducting regular automated testing, logging, and monitoring checks.',
  'D',
  'Option D is correct. Conducting regular automated testing, logging, and monitoring checks.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000008000006',
  '00000000-0002-4000-a000-000000000008',
  6,
  'Q6. Which layer or component plays a vital role in Internet & Web Technology?',
  'Legacy manual processing for Internet & Web Technology.',
  'The central execution handler and protocol controller.',
  'Bypassing standard security checks and protocols in Internet & Web Technology.',
  'Hardcoding static binary files without backup in Internet & Web Technology.',
  'B',
  'Option B is correct. The central execution handler and protocol controller.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000008000007',
  '00000000-0002-4000-a000-000000000008',
  7,
  'Q7. What is a common bottleneck or challenge in Internet & Web Technology?',
  'Hardcoding static binary files without backup in Internet & Web Technology.',
  'Legacy manual processing for Internet & Web Technology.',
  'Bypassing standard security checks and protocols in Internet & Web Technology.',
  'Managing system state synchronization and resource contention under heavy load.',
  'D',
  'Option D is correct. Managing system state synchronization and resource contention under heavy load.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000008000008',
  '00000000-0002-4000-a000-000000000008',
  8,
  'Q8. How is security typically enforced within Internet & Web Technology?',
  'Hardcoding static binary files without backup in Internet & Web Technology.',
  'Legacy manual processing for Internet & Web Technology.',
  'Bypassing standard security checks and protocols in Internet & Web Technology.',
  'Through strong authentication, access control permissions, and data encryption.',
  'D',
  'Option D is correct. Through strong authentication, access control permissions, and data encryption.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000008000009',
  '00000000-0002-4000-a000-000000000008',
  9,
  'Q9. Which metric is critical for measuring the performance of Internet & Web Technology?',
  'Hardcoding static binary files without backup in Internet & Web Technology.',
  'Legacy manual processing for Internet & Web Technology.',
  'Bypassing standard security checks and protocols in Internet & Web Technology.',
  'Response latency, throughput, resource utilization, and error rates.',
  'D',
  'Option D is correct. Response latency, throughput, resource utilization, and error rates.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000008000010',
  '00000000-0002-4000-a000-000000000008',
  10,
  'Q10. What is the role of versioning in Internet & Web Technology?',
  'Bypassing standard security checks and protocols in Internet & Web Technology.',
  'Legacy manual processing for Internet & Web Technology.',
  'To support safe updates, maintain backward compatibility, and enable rollbacks.',
  'Hardcoding static binary files without backup in Internet & Web Technology.',
  'C',
  'Option C is correct. To support safe updates, maintain backward compatibility, and enable rollbacks.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000008000011',
  '00000000-0002-4000-a000-000000000008',
  11,
  'Q11. In what scenario is Internet & Web Technology most effectively applied?',
  'Hardcoding static binary files without backup in Internet & Web Technology.',
  'Legacy manual processing for Internet & Web Technology.',
  'Bypassing standard security checks and protocols in Internet & Web Technology.',
  'In modern scalable enterprise systems requiring structured workflows and reliability.',
  'D',
  'Option D is correct. In modern scalable enterprise systems requiring structured workflows and reliability.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000008000012',
  '00000000-0002-4000-a000-000000000008',
  12,
  'Q12. Which tool or interface is standard for interacting with Internet & Web Technology?',
  'Legacy manual processing for Internet & Web Technology.',
  'Dedicated command line tools, SDK APIs, and management dashboards.',
  'Bypassing standard security checks and protocols in Internet & Web Technology.',
  'Hardcoding static binary files without backup in Internet & Web Technology.',
  'B',
  'Option B is correct. Dedicated command line tools, SDK APIs, and management dashboards.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000008000013',
  '00000000-0002-4000-a000-000000000008',
  13,
  'Q13. What is the initial phase when developing with Internet & Web Technology?',
  'Defining requirements, setting up the development environment, and configuring dependencies.',
  'Legacy manual processing for Internet & Web Technology.',
  'Bypassing standard security checks and protocols in Internet & Web Technology.',
  'Hardcoding static binary files without backup in Internet & Web Technology.',
  'A',
  'Option A is correct. Defining requirements, setting up the development environment, and configuring dependencies.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000008000014',
  '00000000-0002-4000-a000-000000000008',
  14,
  'Q14. Which debugging technique is recommended for Internet & Web Technology?',
  'Bypassing standard security checks and protocols in Internet & Web Technology.',
  'Legacy manual processing for Internet & Web Technology.',
  'Inspecting log trace files, using debugger tools, and verifying stack traces.',
  'Hardcoding static binary files without backup in Internet & Web Technology.',
  'C',
  'Option C is correct. Inspecting log trace files, using debugger tools, and verifying stack traces.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000008000015',
  '00000000-0002-4000-a000-000000000008',
  15,
  'Q15. What is the overall goal of mastering Internet & Web Technology?',
  'To design, build, and maintain production-ready technology solutions.',
  'Legacy manual processing for Internet & Web Technology.',
  'Bypassing standard security checks and protocols in Internet & Web Technology.',
  'Hardcoding static binary files without backup in Internet & Web Technology.',
  'A',
  'Option A is correct. To design, build, and maintain production-ready technology solutions.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000008000016',
  '00000000-0002-4000-a000-000000000008',
  16,
  'Q16. What is the primary definition of Internet & Web Technology?',
  'Bypassing standard security checks and protocols in Internet & Web Technology.',
  'Legacy manual processing for Internet & Web Technology.',
  'A core technology or standard designed for managing and executing Internet & Web Technology processes.',
  'Hardcoding static binary files without backup in Internet & Web Technology.',
  'C',
  'Option C is correct. A core technology or standard designed for managing and executing Internet & Web Technology processes.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000008000017',
  '00000000-0002-4000-a000-000000000008',
  17,
  'Q17. Which key benefit is provided by Internet & Web Technology?',
  'Improved efficiency, scalability, modularity, and operational reliability.',
  'Legacy manual processing for Internet & Web Technology.',
  'Bypassing standard security checks and protocols in Internet & Web Technology.',
  'Hardcoding static binary files without backup in Internet & Web Technology.',
  'A',
  'Option A is correct. Improved efficiency, scalability, modularity, and operational reliability.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000008000018',
  '00000000-0002-4000-a000-000000000008',
  18,
  'Q18. What is a fundamental requirement when implementing Internet & Web Technology?',
  'Bypassing standard security checks and protocols in Internet & Web Technology.',
  'Legacy manual processing for Internet & Web Technology.',
  'Proper system configuration, security protocols, and integration standards.',
  'Hardcoding static binary files without backup in Internet & Web Technology.',
  'C',
  'Option C is correct. Proper system configuration, security protocols, and integration standards.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000008000019',
  '00000000-0002-4000-a000-000000000008',
  19,
  'Q19. How does Internet & Web Technology handle data and execution states?',
  'Bypassing standard security checks and protocols in Internet & Web Technology.',
  'Legacy manual processing for Internet & Web Technology.',
  'By utilizing structured schemas, indexes, and optimized execution pipelines.',
  'Hardcoding static binary files without backup in Internet & Web Technology.',
  'C',
  'Option C is correct. By utilizing structured schemas, indexes, and optimized execution pipelines.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000008000020',
  '00000000-0002-4000-a000-000000000008',
  20,
  'Q20. What is a recommended best practice when deploying Internet & Web Technology?',
  'Bypassing standard security checks and protocols in Internet & Web Technology.',
  'Legacy manual processing for Internet & Web Technology.',
  'Conducting regular automated testing, logging, and monitoring checks.',
  'Hardcoding static binary files without backup in Internet & Web Technology.',
  'C',
  'Option C is correct. Conducting regular automated testing, logging, and monitoring checks.'
);

-- Explore Quiz 9: HTML & CSS Essentials Mastery Quiz
INSERT INTO public.explore_quizzes (id, title, description, category, branch, difficulty, question_count, estimated_minutes, fx_reward, is_daily, is_published)
VALUES (
  '00000000-0002-4000-a000-000000000009',
  'HTML & CSS Essentials Challenge Quiz',
  'Test your knowledge on HTML & CSS Essentials with 20 comprehensive questions.',
  'Web Dev',
  'CSE',
  'Beginner',
  20,
  8,
  15,
  FALSE,
  TRUE
);

INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000009000001',
  '00000000-0002-4000-a000-000000000009',
  1,
  'Q1. What is the primary definition of HTML & CSS Essentials?',
  'Legacy manual processing for HTML & CSS Essentials.',
  'A core technology or standard designed for managing and executing HTML & CSS Essentials processes.',
  'Bypassing standard security checks and protocols in HTML & CSS Essentials.',
  'Hardcoding static binary files without backup in HTML & CSS Essentials.',
  'B',
  'Option B is correct. A core technology or standard designed for managing and executing HTML & CSS Essentials processes.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000009000002',
  '00000000-0002-4000-a000-000000000009',
  2,
  'Q2. Which key benefit is provided by HTML & CSS Essentials?',
  'Legacy manual processing for HTML & CSS Essentials.',
  'Improved efficiency, scalability, modularity, and operational reliability.',
  'Bypassing standard security checks and protocols in HTML & CSS Essentials.',
  'Hardcoding static binary files without backup in HTML & CSS Essentials.',
  'B',
  'Option B is correct. Improved efficiency, scalability, modularity, and operational reliability.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000009000003',
  '00000000-0002-4000-a000-000000000009',
  3,
  'Q3. What is a fundamental requirement when implementing HTML & CSS Essentials?',
  'Hardcoding static binary files without backup in HTML & CSS Essentials.',
  'Legacy manual processing for HTML & CSS Essentials.',
  'Bypassing standard security checks and protocols in HTML & CSS Essentials.',
  'Proper system configuration, security protocols, and integration standards.',
  'D',
  'Option D is correct. Proper system configuration, security protocols, and integration standards.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000009000004',
  '00000000-0002-4000-a000-000000000009',
  4,
  'Q4. How does HTML & CSS Essentials handle data and execution states?',
  'Legacy manual processing for HTML & CSS Essentials.',
  'By utilizing structured schemas, indexes, and optimized execution pipelines.',
  'Bypassing standard security checks and protocols in HTML & CSS Essentials.',
  'Hardcoding static binary files without backup in HTML & CSS Essentials.',
  'B',
  'Option B is correct. By utilizing structured schemas, indexes, and optimized execution pipelines.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000009000005',
  '00000000-0002-4000-a000-000000000009',
  5,
  'Q5. What is a recommended best practice when deploying HTML & CSS Essentials?',
  'Legacy manual processing for HTML & CSS Essentials.',
  'Conducting regular automated testing, logging, and monitoring checks.',
  'Bypassing standard security checks and protocols in HTML & CSS Essentials.',
  'Hardcoding static binary files without backup in HTML & CSS Essentials.',
  'B',
  'Option B is correct. Conducting regular automated testing, logging, and monitoring checks.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000009000006',
  '00000000-0002-4000-a000-000000000009',
  6,
  'Q6. Which layer or component plays a vital role in HTML & CSS Essentials?',
  'Legacy manual processing for HTML & CSS Essentials.',
  'The central execution handler and protocol controller.',
  'Bypassing standard security checks and protocols in HTML & CSS Essentials.',
  'Hardcoding static binary files without backup in HTML & CSS Essentials.',
  'B',
  'Option B is correct. The central execution handler and protocol controller.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000009000007',
  '00000000-0002-4000-a000-000000000009',
  7,
  'Q7. What is a common bottleneck or challenge in HTML & CSS Essentials?',
  'Hardcoding static binary files without backup in HTML & CSS Essentials.',
  'Legacy manual processing for HTML & CSS Essentials.',
  'Bypassing standard security checks and protocols in HTML & CSS Essentials.',
  'Managing system state synchronization and resource contention under heavy load.',
  'D',
  'Option D is correct. Managing system state synchronization and resource contention under heavy load.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000009000008',
  '00000000-0002-4000-a000-000000000009',
  8,
  'Q8. How is security typically enforced within HTML & CSS Essentials?',
  'Hardcoding static binary files without backup in HTML & CSS Essentials.',
  'Legacy manual processing for HTML & CSS Essentials.',
  'Bypassing standard security checks and protocols in HTML & CSS Essentials.',
  'Through strong authentication, access control permissions, and data encryption.',
  'D',
  'Option D is correct. Through strong authentication, access control permissions, and data encryption.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000009000009',
  '00000000-0002-4000-a000-000000000009',
  9,
  'Q9. Which metric is critical for measuring the performance of HTML & CSS Essentials?',
  'Legacy manual processing for HTML & CSS Essentials.',
  'Response latency, throughput, resource utilization, and error rates.',
  'Bypassing standard security checks and protocols in HTML & CSS Essentials.',
  'Hardcoding static binary files without backup in HTML & CSS Essentials.',
  'B',
  'Option B is correct. Response latency, throughput, resource utilization, and error rates.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000009000010',
  '00000000-0002-4000-a000-000000000009',
  10,
  'Q10. What is the role of versioning in HTML & CSS Essentials?',
  'To support safe updates, maintain backward compatibility, and enable rollbacks.',
  'Legacy manual processing for HTML & CSS Essentials.',
  'Bypassing standard security checks and protocols in HTML & CSS Essentials.',
  'Hardcoding static binary files without backup in HTML & CSS Essentials.',
  'A',
  'Option A is correct. To support safe updates, maintain backward compatibility, and enable rollbacks.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000009000011',
  '00000000-0002-4000-a000-000000000009',
  11,
  'Q11. In what scenario is HTML & CSS Essentials most effectively applied?',
  'Hardcoding static binary files without backup in HTML & CSS Essentials.',
  'Legacy manual processing for HTML & CSS Essentials.',
  'Bypassing standard security checks and protocols in HTML & CSS Essentials.',
  'In modern scalable enterprise systems requiring structured workflows and reliability.',
  'D',
  'Option D is correct. In modern scalable enterprise systems requiring structured workflows and reliability.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000009000012',
  '00000000-0002-4000-a000-000000000009',
  12,
  'Q12. Which tool or interface is standard for interacting with HTML & CSS Essentials?',
  'Legacy manual processing for HTML & CSS Essentials.',
  'Dedicated command line tools, SDK APIs, and management dashboards.',
  'Bypassing standard security checks and protocols in HTML & CSS Essentials.',
  'Hardcoding static binary files without backup in HTML & CSS Essentials.',
  'B',
  'Option B is correct. Dedicated command line tools, SDK APIs, and management dashboards.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000009000013',
  '00000000-0002-4000-a000-000000000009',
  13,
  'Q13. What is the initial phase when developing with HTML & CSS Essentials?',
  'Hardcoding static binary files without backup in HTML & CSS Essentials.',
  'Legacy manual processing for HTML & CSS Essentials.',
  'Bypassing standard security checks and protocols in HTML & CSS Essentials.',
  'Defining requirements, setting up the development environment, and configuring dependencies.',
  'D',
  'Option D is correct. Defining requirements, setting up the development environment, and configuring dependencies.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000009000014',
  '00000000-0002-4000-a000-000000000009',
  14,
  'Q14. Which debugging technique is recommended for HTML & CSS Essentials?',
  'Hardcoding static binary files without backup in HTML & CSS Essentials.',
  'Legacy manual processing for HTML & CSS Essentials.',
  'Bypassing standard security checks and protocols in HTML & CSS Essentials.',
  'Inspecting log trace files, using debugger tools, and verifying stack traces.',
  'D',
  'Option D is correct. Inspecting log trace files, using debugger tools, and verifying stack traces.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000009000015',
  '00000000-0002-4000-a000-000000000009',
  15,
  'Q15. What is the overall goal of mastering HTML & CSS Essentials?',
  'To design, build, and maintain production-ready technology solutions.',
  'Legacy manual processing for HTML & CSS Essentials.',
  'Bypassing standard security checks and protocols in HTML & CSS Essentials.',
  'Hardcoding static binary files without backup in HTML & CSS Essentials.',
  'A',
  'Option A is correct. To design, build, and maintain production-ready technology solutions.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000009000016',
  '00000000-0002-4000-a000-000000000009',
  16,
  'Q16. What is the primary definition of HTML & CSS Essentials?',
  'A core technology or standard designed for managing and executing HTML & CSS Essentials processes.',
  'Legacy manual processing for HTML & CSS Essentials.',
  'Bypassing standard security checks and protocols in HTML & CSS Essentials.',
  'Hardcoding static binary files without backup in HTML & CSS Essentials.',
  'A',
  'Option A is correct. A core technology or standard designed for managing and executing HTML & CSS Essentials processes.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000009000017',
  '00000000-0002-4000-a000-000000000009',
  17,
  'Q17. Which key benefit is provided by HTML & CSS Essentials?',
  'Legacy manual processing for HTML & CSS Essentials.',
  'Improved efficiency, scalability, modularity, and operational reliability.',
  'Bypassing standard security checks and protocols in HTML & CSS Essentials.',
  'Hardcoding static binary files without backup in HTML & CSS Essentials.',
  'B',
  'Option B is correct. Improved efficiency, scalability, modularity, and operational reliability.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000009000018',
  '00000000-0002-4000-a000-000000000009',
  18,
  'Q18. What is a fundamental requirement when implementing HTML & CSS Essentials?',
  'Bypassing standard security checks and protocols in HTML & CSS Essentials.',
  'Legacy manual processing for HTML & CSS Essentials.',
  'Proper system configuration, security protocols, and integration standards.',
  'Hardcoding static binary files without backup in HTML & CSS Essentials.',
  'C',
  'Option C is correct. Proper system configuration, security protocols, and integration standards.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000009000019',
  '00000000-0002-4000-a000-000000000009',
  19,
  'Q19. How does HTML & CSS Essentials handle data and execution states?',
  'Bypassing standard security checks and protocols in HTML & CSS Essentials.',
  'Legacy manual processing for HTML & CSS Essentials.',
  'By utilizing structured schemas, indexes, and optimized execution pipelines.',
  'Hardcoding static binary files without backup in HTML & CSS Essentials.',
  'C',
  'Option C is correct. By utilizing structured schemas, indexes, and optimized execution pipelines.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000009000020',
  '00000000-0002-4000-a000-000000000009',
  20,
  'Q20. What is a recommended best practice when deploying HTML & CSS Essentials?',
  'Hardcoding static binary files without backup in HTML & CSS Essentials.',
  'Legacy manual processing for HTML & CSS Essentials.',
  'Bypassing standard security checks and protocols in HTML & CSS Essentials.',
  'Conducting regular automated testing, logging, and monitoring checks.',
  'D',
  'Option D is correct. Conducting regular automated testing, logging, and monitoring checks.'
);

-- Explore Quiz 10: JavaScript Fundamentals Mastery Quiz
INSERT INTO public.explore_quizzes (id, title, description, category, branch, difficulty, question_count, estimated_minutes, fx_reward, is_daily, is_published)
VALUES (
  '00000000-0002-4000-a000-000000000010',
  'JavaScript Fundamentals Challenge Quiz',
  'Test your knowledge on JavaScript Fundamentals with 20 comprehensive questions.',
  'Programming',
  'CSE',
  'Beginner',
  20,
  8,
  15,
  FALSE,
  TRUE
);

INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000010000001',
  '00000000-0002-4000-a000-000000000010',
  1,
  'Q1. What is the primary definition of JavaScript Fundamentals?',
  'A core technology or standard designed for managing and executing JavaScript Fundamentals processes.',
  'Legacy manual processing for JavaScript Fundamentals.',
  'Bypassing standard security checks and protocols in JavaScript Fundamentals.',
  'Hardcoding static binary files without backup in JavaScript Fundamentals.',
  'A',
  'Option A is correct. A core technology or standard designed for managing and executing JavaScript Fundamentals processes.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000010000002',
  '00000000-0002-4000-a000-000000000010',
  2,
  'Q2. Which key benefit is provided by JavaScript Fundamentals?',
  'Hardcoding static binary files without backup in JavaScript Fundamentals.',
  'Legacy manual processing for JavaScript Fundamentals.',
  'Bypassing standard security checks and protocols in JavaScript Fundamentals.',
  'Improved efficiency, scalability, modularity, and operational reliability.',
  'D',
  'Option D is correct. Improved efficiency, scalability, modularity, and operational reliability.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000010000003',
  '00000000-0002-4000-a000-000000000010',
  3,
  'Q3. What is a fundamental requirement when implementing JavaScript Fundamentals?',
  'Legacy manual processing for JavaScript Fundamentals.',
  'Proper system configuration, security protocols, and integration standards.',
  'Bypassing standard security checks and protocols in JavaScript Fundamentals.',
  'Hardcoding static binary files without backup in JavaScript Fundamentals.',
  'B',
  'Option B is correct. Proper system configuration, security protocols, and integration standards.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000010000004',
  '00000000-0002-4000-a000-000000000010',
  4,
  'Q4. How does JavaScript Fundamentals handle data and execution states?',
  'Hardcoding static binary files without backup in JavaScript Fundamentals.',
  'Legacy manual processing for JavaScript Fundamentals.',
  'Bypassing standard security checks and protocols in JavaScript Fundamentals.',
  'By utilizing structured schemas, indexes, and optimized execution pipelines.',
  'D',
  'Option D is correct. By utilizing structured schemas, indexes, and optimized execution pipelines.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000010000005',
  '00000000-0002-4000-a000-000000000010',
  5,
  'Q5. What is a recommended best practice when deploying JavaScript Fundamentals?',
  'Hardcoding static binary files without backup in JavaScript Fundamentals.',
  'Legacy manual processing for JavaScript Fundamentals.',
  'Bypassing standard security checks and protocols in JavaScript Fundamentals.',
  'Conducting regular automated testing, logging, and monitoring checks.',
  'D',
  'Option D is correct. Conducting regular automated testing, logging, and monitoring checks.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000010000006',
  '00000000-0002-4000-a000-000000000010',
  6,
  'Q6. Which layer or component plays a vital role in JavaScript Fundamentals?',
  'Legacy manual processing for JavaScript Fundamentals.',
  'The central execution handler and protocol controller.',
  'Bypassing standard security checks and protocols in JavaScript Fundamentals.',
  'Hardcoding static binary files without backup in JavaScript Fundamentals.',
  'B',
  'Option B is correct. The central execution handler and protocol controller.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000010000007',
  '00000000-0002-4000-a000-000000000010',
  7,
  'Q7. What is a common bottleneck or challenge in JavaScript Fundamentals?',
  'Legacy manual processing for JavaScript Fundamentals.',
  'Managing system state synchronization and resource contention under heavy load.',
  'Bypassing standard security checks and protocols in JavaScript Fundamentals.',
  'Hardcoding static binary files without backup in JavaScript Fundamentals.',
  'B',
  'Option B is correct. Managing system state synchronization and resource contention under heavy load.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000010000008',
  '00000000-0002-4000-a000-000000000010',
  8,
  'Q8. How is security typically enforced within JavaScript Fundamentals?',
  'Through strong authentication, access control permissions, and data encryption.',
  'Legacy manual processing for JavaScript Fundamentals.',
  'Bypassing standard security checks and protocols in JavaScript Fundamentals.',
  'Hardcoding static binary files without backup in JavaScript Fundamentals.',
  'A',
  'Option A is correct. Through strong authentication, access control permissions, and data encryption.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000010000009',
  '00000000-0002-4000-a000-000000000010',
  9,
  'Q9. Which metric is critical for measuring the performance of JavaScript Fundamentals?',
  'Response latency, throughput, resource utilization, and error rates.',
  'Legacy manual processing for JavaScript Fundamentals.',
  'Bypassing standard security checks and protocols in JavaScript Fundamentals.',
  'Hardcoding static binary files without backup in JavaScript Fundamentals.',
  'A',
  'Option A is correct. Response latency, throughput, resource utilization, and error rates.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000010000010',
  '00000000-0002-4000-a000-000000000010',
  10,
  'Q10. What is the role of versioning in JavaScript Fundamentals?',
  'Hardcoding static binary files without backup in JavaScript Fundamentals.',
  'Legacy manual processing for JavaScript Fundamentals.',
  'Bypassing standard security checks and protocols in JavaScript Fundamentals.',
  'To support safe updates, maintain backward compatibility, and enable rollbacks.',
  'D',
  'Option D is correct. To support safe updates, maintain backward compatibility, and enable rollbacks.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000010000011',
  '00000000-0002-4000-a000-000000000010',
  11,
  'Q11. In what scenario is JavaScript Fundamentals most effectively applied?',
  'Legacy manual processing for JavaScript Fundamentals.',
  'In modern scalable enterprise systems requiring structured workflows and reliability.',
  'Bypassing standard security checks and protocols in JavaScript Fundamentals.',
  'Hardcoding static binary files without backup in JavaScript Fundamentals.',
  'B',
  'Option B is correct. In modern scalable enterprise systems requiring structured workflows and reliability.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000010000012',
  '00000000-0002-4000-a000-000000000010',
  12,
  'Q12. Which tool or interface is standard for interacting with JavaScript Fundamentals?',
  'Dedicated command line tools, SDK APIs, and management dashboards.',
  'Legacy manual processing for JavaScript Fundamentals.',
  'Bypassing standard security checks and protocols in JavaScript Fundamentals.',
  'Hardcoding static binary files without backup in JavaScript Fundamentals.',
  'A',
  'Option A is correct. Dedicated command line tools, SDK APIs, and management dashboards.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000010000013',
  '00000000-0002-4000-a000-000000000010',
  13,
  'Q13. What is the initial phase when developing with JavaScript Fundamentals?',
  'Hardcoding static binary files without backup in JavaScript Fundamentals.',
  'Legacy manual processing for JavaScript Fundamentals.',
  'Bypassing standard security checks and protocols in JavaScript Fundamentals.',
  'Defining requirements, setting up the development environment, and configuring dependencies.',
  'D',
  'Option D is correct. Defining requirements, setting up the development environment, and configuring dependencies.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000010000014',
  '00000000-0002-4000-a000-000000000010',
  14,
  'Q14. Which debugging technique is recommended for JavaScript Fundamentals?',
  'Hardcoding static binary files without backup in JavaScript Fundamentals.',
  'Legacy manual processing for JavaScript Fundamentals.',
  'Bypassing standard security checks and protocols in JavaScript Fundamentals.',
  'Inspecting log trace files, using debugger tools, and verifying stack traces.',
  'D',
  'Option D is correct. Inspecting log trace files, using debugger tools, and verifying stack traces.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000010000015',
  '00000000-0002-4000-a000-000000000010',
  15,
  'Q15. What is the overall goal of mastering JavaScript Fundamentals?',
  'Hardcoding static binary files without backup in JavaScript Fundamentals.',
  'Legacy manual processing for JavaScript Fundamentals.',
  'Bypassing standard security checks and protocols in JavaScript Fundamentals.',
  'To design, build, and maintain production-ready technology solutions.',
  'D',
  'Option D is correct. To design, build, and maintain production-ready technology solutions.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000010000016',
  '00000000-0002-4000-a000-000000000010',
  16,
  'Q16. What is the primary definition of JavaScript Fundamentals?',
  'Hardcoding static binary files without backup in JavaScript Fundamentals.',
  'Legacy manual processing for JavaScript Fundamentals.',
  'Bypassing standard security checks and protocols in JavaScript Fundamentals.',
  'A core technology or standard designed for managing and executing JavaScript Fundamentals processes.',
  'D',
  'Option D is correct. A core technology or standard designed for managing and executing JavaScript Fundamentals processes.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000010000017',
  '00000000-0002-4000-a000-000000000010',
  17,
  'Q17. Which key benefit is provided by JavaScript Fundamentals?',
  'Improved efficiency, scalability, modularity, and operational reliability.',
  'Legacy manual processing for JavaScript Fundamentals.',
  'Bypassing standard security checks and protocols in JavaScript Fundamentals.',
  'Hardcoding static binary files without backup in JavaScript Fundamentals.',
  'A',
  'Option A is correct. Improved efficiency, scalability, modularity, and operational reliability.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000010000018',
  '00000000-0002-4000-a000-000000000010',
  18,
  'Q18. What is a fundamental requirement when implementing JavaScript Fundamentals?',
  'Hardcoding static binary files without backup in JavaScript Fundamentals.',
  'Legacy manual processing for JavaScript Fundamentals.',
  'Bypassing standard security checks and protocols in JavaScript Fundamentals.',
  'Proper system configuration, security protocols, and integration standards.',
  'D',
  'Option D is correct. Proper system configuration, security protocols, and integration standards.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000010000019',
  '00000000-0002-4000-a000-000000000010',
  19,
  'Q19. How does JavaScript Fundamentals handle data and execution states?',
  'Hardcoding static binary files without backup in JavaScript Fundamentals.',
  'Legacy manual processing for JavaScript Fundamentals.',
  'Bypassing standard security checks and protocols in JavaScript Fundamentals.',
  'By utilizing structured schemas, indexes, and optimized execution pipelines.',
  'D',
  'Option D is correct. By utilizing structured schemas, indexes, and optimized execution pipelines.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000010000020',
  '00000000-0002-4000-a000-000000000010',
  20,
  'Q20. What is a recommended best practice when deploying JavaScript Fundamentals?',
  'Legacy manual processing for JavaScript Fundamentals.',
  'Conducting regular automated testing, logging, and monitoring checks.',
  'Bypassing standard security checks and protocols in JavaScript Fundamentals.',
  'Hardcoding static binary files without backup in JavaScript Fundamentals.',
  'B',
  'Option B is correct. Conducting regular automated testing, logging, and monitoring checks.'
);

-- Explore Quiz 11: Python Basics Mastery Quiz
INSERT INTO public.explore_quizzes (id, title, description, category, branch, difficulty, question_count, estimated_minutes, fx_reward, is_daily, is_published)
VALUES (
  '00000000-0002-4000-a000-000000000011',
  'Python Basics Challenge Quiz',
  'Test your knowledge on Python Basics with 20 comprehensive questions.',
  'Programming',
  'CSE',
  'Beginner',
  20,
  8,
  15,
  FALSE,
  TRUE
);

INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000011000001',
  '00000000-0002-4000-a000-000000000011',
  1,
  'Q1. What is the primary definition of Python Basics?',
  'A core technology or standard designed for managing and executing Python Basics processes.',
  'Legacy manual processing for Python Basics.',
  'Bypassing standard security checks and protocols in Python Basics.',
  'Hardcoding static binary files without backup in Python Basics.',
  'A',
  'Option A is correct. A core technology or standard designed for managing and executing Python Basics processes.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000011000002',
  '00000000-0002-4000-a000-000000000011',
  2,
  'Q2. Which key benefit is provided by Python Basics?',
  'Improved efficiency, scalability, modularity, and operational reliability.',
  'Legacy manual processing for Python Basics.',
  'Bypassing standard security checks and protocols in Python Basics.',
  'Hardcoding static binary files without backup in Python Basics.',
  'A',
  'Option A is correct. Improved efficiency, scalability, modularity, and operational reliability.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000011000003',
  '00000000-0002-4000-a000-000000000011',
  3,
  'Q3. What is a fundamental requirement when implementing Python Basics?',
  'Proper system configuration, security protocols, and integration standards.',
  'Legacy manual processing for Python Basics.',
  'Bypassing standard security checks and protocols in Python Basics.',
  'Hardcoding static binary files without backup in Python Basics.',
  'A',
  'Option A is correct. Proper system configuration, security protocols, and integration standards.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000011000004',
  '00000000-0002-4000-a000-000000000011',
  4,
  'Q4. How does Python Basics handle data and execution states?',
  'Legacy manual processing for Python Basics.',
  'By utilizing structured schemas, indexes, and optimized execution pipelines.',
  'Bypassing standard security checks and protocols in Python Basics.',
  'Hardcoding static binary files without backup in Python Basics.',
  'B',
  'Option B is correct. By utilizing structured schemas, indexes, and optimized execution pipelines.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000011000005',
  '00000000-0002-4000-a000-000000000011',
  5,
  'Q5. What is a recommended best practice when deploying Python Basics?',
  'Hardcoding static binary files without backup in Python Basics.',
  'Legacy manual processing for Python Basics.',
  'Bypassing standard security checks and protocols in Python Basics.',
  'Conducting regular automated testing, logging, and monitoring checks.',
  'D',
  'Option D is correct. Conducting regular automated testing, logging, and monitoring checks.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000011000006',
  '00000000-0002-4000-a000-000000000011',
  6,
  'Q6. Which layer or component plays a vital role in Python Basics?',
  'Legacy manual processing for Python Basics.',
  'The central execution handler and protocol controller.',
  'Bypassing standard security checks and protocols in Python Basics.',
  'Hardcoding static binary files without backup in Python Basics.',
  'B',
  'Option B is correct. The central execution handler and protocol controller.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000011000007',
  '00000000-0002-4000-a000-000000000011',
  7,
  'Q7. What is a common bottleneck or challenge in Python Basics?',
  'Bypassing standard security checks and protocols in Python Basics.',
  'Legacy manual processing for Python Basics.',
  'Managing system state synchronization and resource contention under heavy load.',
  'Hardcoding static binary files without backup in Python Basics.',
  'C',
  'Option C is correct. Managing system state synchronization and resource contention under heavy load.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000011000008',
  '00000000-0002-4000-a000-000000000011',
  8,
  'Q8. How is security typically enforced within Python Basics?',
  'Bypassing standard security checks and protocols in Python Basics.',
  'Legacy manual processing for Python Basics.',
  'Through strong authentication, access control permissions, and data encryption.',
  'Hardcoding static binary files without backup in Python Basics.',
  'C',
  'Option C is correct. Through strong authentication, access control permissions, and data encryption.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000011000009',
  '00000000-0002-4000-a000-000000000011',
  9,
  'Q9. Which metric is critical for measuring the performance of Python Basics?',
  'Hardcoding static binary files without backup in Python Basics.',
  'Legacy manual processing for Python Basics.',
  'Bypassing standard security checks and protocols in Python Basics.',
  'Response latency, throughput, resource utilization, and error rates.',
  'D',
  'Option D is correct. Response latency, throughput, resource utilization, and error rates.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000011000010',
  '00000000-0002-4000-a000-000000000011',
  10,
  'Q10. What is the role of versioning in Python Basics?',
  'Legacy manual processing for Python Basics.',
  'To support safe updates, maintain backward compatibility, and enable rollbacks.',
  'Bypassing standard security checks and protocols in Python Basics.',
  'Hardcoding static binary files without backup in Python Basics.',
  'B',
  'Option B is correct. To support safe updates, maintain backward compatibility, and enable rollbacks.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000011000011',
  '00000000-0002-4000-a000-000000000011',
  11,
  'Q11. In what scenario is Python Basics most effectively applied?',
  'Bypassing standard security checks and protocols in Python Basics.',
  'Legacy manual processing for Python Basics.',
  'In modern scalable enterprise systems requiring structured workflows and reliability.',
  'Hardcoding static binary files without backup in Python Basics.',
  'C',
  'Option C is correct. In modern scalable enterprise systems requiring structured workflows and reliability.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000011000012',
  '00000000-0002-4000-a000-000000000011',
  12,
  'Q12. Which tool or interface is standard for interacting with Python Basics?',
  'Legacy manual processing for Python Basics.',
  'Dedicated command line tools, SDK APIs, and management dashboards.',
  'Bypassing standard security checks and protocols in Python Basics.',
  'Hardcoding static binary files without backup in Python Basics.',
  'B',
  'Option B is correct. Dedicated command line tools, SDK APIs, and management dashboards.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000011000013',
  '00000000-0002-4000-a000-000000000011',
  13,
  'Q13. What is the initial phase when developing with Python Basics?',
  'Defining requirements, setting up the development environment, and configuring dependencies.',
  'Legacy manual processing for Python Basics.',
  'Bypassing standard security checks and protocols in Python Basics.',
  'Hardcoding static binary files without backup in Python Basics.',
  'A',
  'Option A is correct. Defining requirements, setting up the development environment, and configuring dependencies.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000011000014',
  '00000000-0002-4000-a000-000000000011',
  14,
  'Q14. Which debugging technique is recommended for Python Basics?',
  'Legacy manual processing for Python Basics.',
  'Inspecting log trace files, using debugger tools, and verifying stack traces.',
  'Bypassing standard security checks and protocols in Python Basics.',
  'Hardcoding static binary files without backup in Python Basics.',
  'B',
  'Option B is correct. Inspecting log trace files, using debugger tools, and verifying stack traces.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000011000015',
  '00000000-0002-4000-a000-000000000011',
  15,
  'Q15. What is the overall goal of mastering Python Basics?',
  'Hardcoding static binary files without backup in Python Basics.',
  'Legacy manual processing for Python Basics.',
  'Bypassing standard security checks and protocols in Python Basics.',
  'To design, build, and maintain production-ready technology solutions.',
  'D',
  'Option D is correct. To design, build, and maintain production-ready technology solutions.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000011000016',
  '00000000-0002-4000-a000-000000000011',
  16,
  'Q16. What is the primary definition of Python Basics?',
  'Legacy manual processing for Python Basics.',
  'A core technology or standard designed for managing and executing Python Basics processes.',
  'Bypassing standard security checks and protocols in Python Basics.',
  'Hardcoding static binary files without backup in Python Basics.',
  'B',
  'Option B is correct. A core technology or standard designed for managing and executing Python Basics processes.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000011000017',
  '00000000-0002-4000-a000-000000000011',
  17,
  'Q17. Which key benefit is provided by Python Basics?',
  'Legacy manual processing for Python Basics.',
  'Improved efficiency, scalability, modularity, and operational reliability.',
  'Bypassing standard security checks and protocols in Python Basics.',
  'Hardcoding static binary files without backup in Python Basics.',
  'B',
  'Option B is correct. Improved efficiency, scalability, modularity, and operational reliability.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000011000018',
  '00000000-0002-4000-a000-000000000011',
  18,
  'Q18. What is a fundamental requirement when implementing Python Basics?',
  'Proper system configuration, security protocols, and integration standards.',
  'Legacy manual processing for Python Basics.',
  'Bypassing standard security checks and protocols in Python Basics.',
  'Hardcoding static binary files without backup in Python Basics.',
  'A',
  'Option A is correct. Proper system configuration, security protocols, and integration standards.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000011000019',
  '00000000-0002-4000-a000-000000000011',
  19,
  'Q19. How does Python Basics handle data and execution states?',
  'By utilizing structured schemas, indexes, and optimized execution pipelines.',
  'Legacy manual processing for Python Basics.',
  'Bypassing standard security checks and protocols in Python Basics.',
  'Hardcoding static binary files without backup in Python Basics.',
  'A',
  'Option A is correct. By utilizing structured schemas, indexes, and optimized execution pipelines.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000011000020',
  '00000000-0002-4000-a000-000000000011',
  20,
  'Q20. What is a recommended best practice when deploying Python Basics?',
  'Hardcoding static binary files without backup in Python Basics.',
  'Legacy manual processing for Python Basics.',
  'Bypassing standard security checks and protocols in Python Basics.',
  'Conducting regular automated testing, logging, and monitoring checks.',
  'D',
  'Option D is correct. Conducting regular automated testing, logging, and monitoring checks.'
);

-- Explore Quiz 12: C Programming Fundamentals Mastery Quiz
INSERT INTO public.explore_quizzes (id, title, description, category, branch, difficulty, question_count, estimated_minutes, fx_reward, is_daily, is_published)
VALUES (
  '00000000-0002-4000-a000-000000000012',
  'C Programming Fundamentals Challenge Quiz',
  'Test your knowledge on C Programming Fundamentals with 20 comprehensive questions.',
  'Programming',
  'CSE',
  'Beginner',
  20,
  8,
  15,
  FALSE,
  TRUE
);

INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000012000001',
  '00000000-0002-4000-a000-000000000012',
  1,
  'Q1. What is the primary definition of C Programming Fundamentals?',
  'Bypassing standard security checks and protocols in C Programming Fundamentals.',
  'Legacy manual processing for C Programming Fundamentals.',
  'A core technology or standard designed for managing and executing C Programming Fundamentals processes.',
  'Hardcoding static binary files without backup in C Programming Fundamentals.',
  'C',
  'Option C is correct. A core technology or standard designed for managing and executing C Programming Fundamentals processes.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000012000002',
  '00000000-0002-4000-a000-000000000012',
  2,
  'Q2. Which key benefit is provided by C Programming Fundamentals?',
  'Bypassing standard security checks and protocols in C Programming Fundamentals.',
  'Legacy manual processing for C Programming Fundamentals.',
  'Improved efficiency, scalability, modularity, and operational reliability.',
  'Hardcoding static binary files without backup in C Programming Fundamentals.',
  'C',
  'Option C is correct. Improved efficiency, scalability, modularity, and operational reliability.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000012000003',
  '00000000-0002-4000-a000-000000000012',
  3,
  'Q3. What is a fundamental requirement when implementing C Programming Fundamentals?',
  'Bypassing standard security checks and protocols in C Programming Fundamentals.',
  'Legacy manual processing for C Programming Fundamentals.',
  'Proper system configuration, security protocols, and integration standards.',
  'Hardcoding static binary files without backup in C Programming Fundamentals.',
  'C',
  'Option C is correct. Proper system configuration, security protocols, and integration standards.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000012000004',
  '00000000-0002-4000-a000-000000000012',
  4,
  'Q4. How does C Programming Fundamentals handle data and execution states?',
  'Legacy manual processing for C Programming Fundamentals.',
  'By utilizing structured schemas, indexes, and optimized execution pipelines.',
  'Bypassing standard security checks and protocols in C Programming Fundamentals.',
  'Hardcoding static binary files without backup in C Programming Fundamentals.',
  'B',
  'Option B is correct. By utilizing structured schemas, indexes, and optimized execution pipelines.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000012000005',
  '00000000-0002-4000-a000-000000000012',
  5,
  'Q5. What is a recommended best practice when deploying C Programming Fundamentals?',
  'Hardcoding static binary files without backup in C Programming Fundamentals.',
  'Legacy manual processing for C Programming Fundamentals.',
  'Bypassing standard security checks and protocols in C Programming Fundamentals.',
  'Conducting regular automated testing, logging, and monitoring checks.',
  'D',
  'Option D is correct. Conducting regular automated testing, logging, and monitoring checks.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000012000006',
  '00000000-0002-4000-a000-000000000012',
  6,
  'Q6. Which layer or component plays a vital role in C Programming Fundamentals?',
  'Legacy manual processing for C Programming Fundamentals.',
  'The central execution handler and protocol controller.',
  'Bypassing standard security checks and protocols in C Programming Fundamentals.',
  'Hardcoding static binary files without backup in C Programming Fundamentals.',
  'B',
  'Option B is correct. The central execution handler and protocol controller.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000012000007',
  '00000000-0002-4000-a000-000000000012',
  7,
  'Q7. What is a common bottleneck or challenge in C Programming Fundamentals?',
  'Hardcoding static binary files without backup in C Programming Fundamentals.',
  'Legacy manual processing for C Programming Fundamentals.',
  'Bypassing standard security checks and protocols in C Programming Fundamentals.',
  'Managing system state synchronization and resource contention under heavy load.',
  'D',
  'Option D is correct. Managing system state synchronization and resource contention under heavy load.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000012000008',
  '00000000-0002-4000-a000-000000000012',
  8,
  'Q8. How is security typically enforced within C Programming Fundamentals?',
  'Through strong authentication, access control permissions, and data encryption.',
  'Legacy manual processing for C Programming Fundamentals.',
  'Bypassing standard security checks and protocols in C Programming Fundamentals.',
  'Hardcoding static binary files without backup in C Programming Fundamentals.',
  'A',
  'Option A is correct. Through strong authentication, access control permissions, and data encryption.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000012000009',
  '00000000-0002-4000-a000-000000000012',
  9,
  'Q9. Which metric is critical for measuring the performance of C Programming Fundamentals?',
  'Response latency, throughput, resource utilization, and error rates.',
  'Legacy manual processing for C Programming Fundamentals.',
  'Bypassing standard security checks and protocols in C Programming Fundamentals.',
  'Hardcoding static binary files without backup in C Programming Fundamentals.',
  'A',
  'Option A is correct. Response latency, throughput, resource utilization, and error rates.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000012000010',
  '00000000-0002-4000-a000-000000000012',
  10,
  'Q10. What is the role of versioning in C Programming Fundamentals?',
  'Bypassing standard security checks and protocols in C Programming Fundamentals.',
  'Legacy manual processing for C Programming Fundamentals.',
  'To support safe updates, maintain backward compatibility, and enable rollbacks.',
  'Hardcoding static binary files without backup in C Programming Fundamentals.',
  'C',
  'Option C is correct. To support safe updates, maintain backward compatibility, and enable rollbacks.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000012000011',
  '00000000-0002-4000-a000-000000000012',
  11,
  'Q11. In what scenario is C Programming Fundamentals most effectively applied?',
  'Hardcoding static binary files without backup in C Programming Fundamentals.',
  'Legacy manual processing for C Programming Fundamentals.',
  'Bypassing standard security checks and protocols in C Programming Fundamentals.',
  'In modern scalable enterprise systems requiring structured workflows and reliability.',
  'D',
  'Option D is correct. In modern scalable enterprise systems requiring structured workflows and reliability.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000012000012',
  '00000000-0002-4000-a000-000000000012',
  12,
  'Q12. Which tool or interface is standard for interacting with C Programming Fundamentals?',
  'Hardcoding static binary files without backup in C Programming Fundamentals.',
  'Legacy manual processing for C Programming Fundamentals.',
  'Bypassing standard security checks and protocols in C Programming Fundamentals.',
  'Dedicated command line tools, SDK APIs, and management dashboards.',
  'D',
  'Option D is correct. Dedicated command line tools, SDK APIs, and management dashboards.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000012000013',
  '00000000-0002-4000-a000-000000000012',
  13,
  'Q13. What is the initial phase when developing with C Programming Fundamentals?',
  'Defining requirements, setting up the development environment, and configuring dependencies.',
  'Legacy manual processing for C Programming Fundamentals.',
  'Bypassing standard security checks and protocols in C Programming Fundamentals.',
  'Hardcoding static binary files without backup in C Programming Fundamentals.',
  'A',
  'Option A is correct. Defining requirements, setting up the development environment, and configuring dependencies.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000012000014',
  '00000000-0002-4000-a000-000000000012',
  14,
  'Q14. Which debugging technique is recommended for C Programming Fundamentals?',
  'Legacy manual processing for C Programming Fundamentals.',
  'Inspecting log trace files, using debugger tools, and verifying stack traces.',
  'Bypassing standard security checks and protocols in C Programming Fundamentals.',
  'Hardcoding static binary files without backup in C Programming Fundamentals.',
  'B',
  'Option B is correct. Inspecting log trace files, using debugger tools, and verifying stack traces.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000012000015',
  '00000000-0002-4000-a000-000000000012',
  15,
  'Q15. What is the overall goal of mastering C Programming Fundamentals?',
  'Legacy manual processing for C Programming Fundamentals.',
  'To design, build, and maintain production-ready technology solutions.',
  'Bypassing standard security checks and protocols in C Programming Fundamentals.',
  'Hardcoding static binary files without backup in C Programming Fundamentals.',
  'B',
  'Option B is correct. To design, build, and maintain production-ready technology solutions.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000012000016',
  '00000000-0002-4000-a000-000000000012',
  16,
  'Q16. What is the primary definition of C Programming Fundamentals?',
  'Bypassing standard security checks and protocols in C Programming Fundamentals.',
  'Legacy manual processing for C Programming Fundamentals.',
  'A core technology or standard designed for managing and executing C Programming Fundamentals processes.',
  'Hardcoding static binary files without backup in C Programming Fundamentals.',
  'C',
  'Option C is correct. A core technology or standard designed for managing and executing C Programming Fundamentals processes.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000012000017',
  '00000000-0002-4000-a000-000000000012',
  17,
  'Q17. Which key benefit is provided by C Programming Fundamentals?',
  'Hardcoding static binary files without backup in C Programming Fundamentals.',
  'Legacy manual processing for C Programming Fundamentals.',
  'Bypassing standard security checks and protocols in C Programming Fundamentals.',
  'Improved efficiency, scalability, modularity, and operational reliability.',
  'D',
  'Option D is correct. Improved efficiency, scalability, modularity, and operational reliability.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000012000018',
  '00000000-0002-4000-a000-000000000012',
  18,
  'Q18. What is a fundamental requirement when implementing C Programming Fundamentals?',
  'Bypassing standard security checks and protocols in C Programming Fundamentals.',
  'Legacy manual processing for C Programming Fundamentals.',
  'Proper system configuration, security protocols, and integration standards.',
  'Hardcoding static binary files without backup in C Programming Fundamentals.',
  'C',
  'Option C is correct. Proper system configuration, security protocols, and integration standards.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000012000019',
  '00000000-0002-4000-a000-000000000012',
  19,
  'Q19. How does C Programming Fundamentals handle data and execution states?',
  'Bypassing standard security checks and protocols in C Programming Fundamentals.',
  'Legacy manual processing for C Programming Fundamentals.',
  'By utilizing structured schemas, indexes, and optimized execution pipelines.',
  'Hardcoding static binary files without backup in C Programming Fundamentals.',
  'C',
  'Option C is correct. By utilizing structured schemas, indexes, and optimized execution pipelines.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000012000020',
  '00000000-0002-4000-a000-000000000012',
  20,
  'Q20. What is a recommended best practice when deploying C Programming Fundamentals?',
  'Conducting regular automated testing, logging, and monitoring checks.',
  'Legacy manual processing for C Programming Fundamentals.',
  'Bypassing standard security checks and protocols in C Programming Fundamentals.',
  'Hardcoding static binary files without backup in C Programming Fundamentals.',
  'A',
  'Option A is correct. Conducting regular automated testing, logging, and monitoring checks.'
);

-- Explore Quiz 13: Java Programming Core Mastery Quiz
INSERT INTO public.explore_quizzes (id, title, description, category, branch, difficulty, question_count, estimated_minutes, fx_reward, is_daily, is_published)
VALUES (
  '00000000-0002-4000-a000-000000000013',
  'Java Programming Core Challenge Quiz',
  'Test your knowledge on Java Programming Core with 20 comprehensive questions.',
  'Programming',
  'CSE',
  'Intermediate',
  20,
  8,
  15,
  FALSE,
  TRUE
);

INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000013000001',
  '00000000-0002-4000-a000-000000000013',
  1,
  'Q1. What is the primary definition of Java Programming Core?',
  'A core technology or standard designed for managing and executing Java Programming Core processes.',
  'Legacy manual processing for Java Programming Core.',
  'Bypassing standard security checks and protocols in Java Programming Core.',
  'Hardcoding static binary files without backup in Java Programming Core.',
  'A',
  'Option A is correct. A core technology or standard designed for managing and executing Java Programming Core processes.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000013000002',
  '00000000-0002-4000-a000-000000000013',
  2,
  'Q2. Which key benefit is provided by Java Programming Core?',
  'Hardcoding static binary files without backup in Java Programming Core.',
  'Legacy manual processing for Java Programming Core.',
  'Bypassing standard security checks and protocols in Java Programming Core.',
  'Improved efficiency, scalability, modularity, and operational reliability.',
  'D',
  'Option D is correct. Improved efficiency, scalability, modularity, and operational reliability.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000013000003',
  '00000000-0002-4000-a000-000000000013',
  3,
  'Q3. What is a fundamental requirement when implementing Java Programming Core?',
  'Bypassing standard security checks and protocols in Java Programming Core.',
  'Legacy manual processing for Java Programming Core.',
  'Proper system configuration, security protocols, and integration standards.',
  'Hardcoding static binary files without backup in Java Programming Core.',
  'C',
  'Option C is correct. Proper system configuration, security protocols, and integration standards.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000013000004',
  '00000000-0002-4000-a000-000000000013',
  4,
  'Q4. How does Java Programming Core handle data and execution states?',
  'Bypassing standard security checks and protocols in Java Programming Core.',
  'Legacy manual processing for Java Programming Core.',
  'By utilizing structured schemas, indexes, and optimized execution pipelines.',
  'Hardcoding static binary files without backup in Java Programming Core.',
  'C',
  'Option C is correct. By utilizing structured schemas, indexes, and optimized execution pipelines.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000013000005',
  '00000000-0002-4000-a000-000000000013',
  5,
  'Q5. What is a recommended best practice when deploying Java Programming Core?',
  'Hardcoding static binary files without backup in Java Programming Core.',
  'Legacy manual processing for Java Programming Core.',
  'Bypassing standard security checks and protocols in Java Programming Core.',
  'Conducting regular automated testing, logging, and monitoring checks.',
  'D',
  'Option D is correct. Conducting regular automated testing, logging, and monitoring checks.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000013000006',
  '00000000-0002-4000-a000-000000000013',
  6,
  'Q6. Which layer or component plays a vital role in Java Programming Core?',
  'Legacy manual processing for Java Programming Core.',
  'The central execution handler and protocol controller.',
  'Bypassing standard security checks and protocols in Java Programming Core.',
  'Hardcoding static binary files without backup in Java Programming Core.',
  'B',
  'Option B is correct. The central execution handler and protocol controller.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000013000007',
  '00000000-0002-4000-a000-000000000013',
  7,
  'Q7. What is a common bottleneck or challenge in Java Programming Core?',
  'Managing system state synchronization and resource contention under heavy load.',
  'Legacy manual processing for Java Programming Core.',
  'Bypassing standard security checks and protocols in Java Programming Core.',
  'Hardcoding static binary files without backup in Java Programming Core.',
  'A',
  'Option A is correct. Managing system state synchronization and resource contention under heavy load.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000013000008',
  '00000000-0002-4000-a000-000000000013',
  8,
  'Q8. How is security typically enforced within Java Programming Core?',
  'Legacy manual processing for Java Programming Core.',
  'Through strong authentication, access control permissions, and data encryption.',
  'Bypassing standard security checks and protocols in Java Programming Core.',
  'Hardcoding static binary files without backup in Java Programming Core.',
  'B',
  'Option B is correct. Through strong authentication, access control permissions, and data encryption.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000013000009',
  '00000000-0002-4000-a000-000000000013',
  9,
  'Q9. Which metric is critical for measuring the performance of Java Programming Core?',
  'Hardcoding static binary files without backup in Java Programming Core.',
  'Legacy manual processing for Java Programming Core.',
  'Bypassing standard security checks and protocols in Java Programming Core.',
  'Response latency, throughput, resource utilization, and error rates.',
  'D',
  'Option D is correct. Response latency, throughput, resource utilization, and error rates.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000013000010',
  '00000000-0002-4000-a000-000000000013',
  10,
  'Q10. What is the role of versioning in Java Programming Core?',
  'Legacy manual processing for Java Programming Core.',
  'To support safe updates, maintain backward compatibility, and enable rollbacks.',
  'Bypassing standard security checks and protocols in Java Programming Core.',
  'Hardcoding static binary files without backup in Java Programming Core.',
  'B',
  'Option B is correct. To support safe updates, maintain backward compatibility, and enable rollbacks.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000013000011',
  '00000000-0002-4000-a000-000000000013',
  11,
  'Q11. In what scenario is Java Programming Core most effectively applied?',
  'Hardcoding static binary files without backup in Java Programming Core.',
  'Legacy manual processing for Java Programming Core.',
  'Bypassing standard security checks and protocols in Java Programming Core.',
  'In modern scalable enterprise systems requiring structured workflows and reliability.',
  'D',
  'Option D is correct. In modern scalable enterprise systems requiring structured workflows and reliability.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000013000012',
  '00000000-0002-4000-a000-000000000013',
  12,
  'Q12. Which tool or interface is standard for interacting with Java Programming Core?',
  'Bypassing standard security checks and protocols in Java Programming Core.',
  'Legacy manual processing for Java Programming Core.',
  'Dedicated command line tools, SDK APIs, and management dashboards.',
  'Hardcoding static binary files without backup in Java Programming Core.',
  'C',
  'Option C is correct. Dedicated command line tools, SDK APIs, and management dashboards.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000013000013',
  '00000000-0002-4000-a000-000000000013',
  13,
  'Q13. What is the initial phase when developing with Java Programming Core?',
  'Legacy manual processing for Java Programming Core.',
  'Defining requirements, setting up the development environment, and configuring dependencies.',
  'Bypassing standard security checks and protocols in Java Programming Core.',
  'Hardcoding static binary files without backup in Java Programming Core.',
  'B',
  'Option B is correct. Defining requirements, setting up the development environment, and configuring dependencies.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000013000014',
  '00000000-0002-4000-a000-000000000013',
  14,
  'Q14. Which debugging technique is recommended for Java Programming Core?',
  'Hardcoding static binary files without backup in Java Programming Core.',
  'Legacy manual processing for Java Programming Core.',
  'Bypassing standard security checks and protocols in Java Programming Core.',
  'Inspecting log trace files, using debugger tools, and verifying stack traces.',
  'D',
  'Option D is correct. Inspecting log trace files, using debugger tools, and verifying stack traces.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000013000015',
  '00000000-0002-4000-a000-000000000013',
  15,
  'Q15. What is the overall goal of mastering Java Programming Core?',
  'Bypassing standard security checks and protocols in Java Programming Core.',
  'Legacy manual processing for Java Programming Core.',
  'To design, build, and maintain production-ready technology solutions.',
  'Hardcoding static binary files without backup in Java Programming Core.',
  'C',
  'Option C is correct. To design, build, and maintain production-ready technology solutions.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000013000016',
  '00000000-0002-4000-a000-000000000013',
  16,
  'Q16. What is the primary definition of Java Programming Core?',
  'Bypassing standard security checks and protocols in Java Programming Core.',
  'Legacy manual processing for Java Programming Core.',
  'A core technology or standard designed for managing and executing Java Programming Core processes.',
  'Hardcoding static binary files without backup in Java Programming Core.',
  'C',
  'Option C is correct. A core technology or standard designed for managing and executing Java Programming Core processes.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000013000017',
  '00000000-0002-4000-a000-000000000013',
  17,
  'Q17. Which key benefit is provided by Java Programming Core?',
  'Bypassing standard security checks and protocols in Java Programming Core.',
  'Legacy manual processing for Java Programming Core.',
  'Improved efficiency, scalability, modularity, and operational reliability.',
  'Hardcoding static binary files without backup in Java Programming Core.',
  'C',
  'Option C is correct. Improved efficiency, scalability, modularity, and operational reliability.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000013000018',
  '00000000-0002-4000-a000-000000000013',
  18,
  'Q18. What is a fundamental requirement when implementing Java Programming Core?',
  'Hardcoding static binary files without backup in Java Programming Core.',
  'Legacy manual processing for Java Programming Core.',
  'Bypassing standard security checks and protocols in Java Programming Core.',
  'Proper system configuration, security protocols, and integration standards.',
  'D',
  'Option D is correct. Proper system configuration, security protocols, and integration standards.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000013000019',
  '00000000-0002-4000-a000-000000000013',
  19,
  'Q19. How does Java Programming Core handle data and execution states?',
  'Hardcoding static binary files without backup in Java Programming Core.',
  'Legacy manual processing for Java Programming Core.',
  'Bypassing standard security checks and protocols in Java Programming Core.',
  'By utilizing structured schemas, indexes, and optimized execution pipelines.',
  'D',
  'Option D is correct. By utilizing structured schemas, indexes, and optimized execution pipelines.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000013000020',
  '00000000-0002-4000-a000-000000000013',
  20,
  'Q20. What is a recommended best practice when deploying Java Programming Core?',
  'Legacy manual processing for Java Programming Core.',
  'Conducting regular automated testing, logging, and monitoring checks.',
  'Bypassing standard security checks and protocols in Java Programming Core.',
  'Hardcoding static binary files without backup in Java Programming Core.',
  'B',
  'Option B is correct. Conducting regular automated testing, logging, and monitoring checks.'
);

-- Explore Quiz 14: SQL & Database Systems Mastery Quiz
INSERT INTO public.explore_quizzes (id, title, description, category, branch, difficulty, question_count, estimated_minutes, fx_reward, is_daily, is_published)
VALUES (
  '00000000-0002-4000-a000-000000000014',
  'SQL & Database Systems Challenge Quiz',
  'Test your knowledge on SQL & Database Systems with 20 comprehensive questions.',
  'Databases',
  'CSE',
  'Intermediate',
  20,
  8,
  15,
  FALSE,
  TRUE
);

INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000014000001',
  '00000000-0002-4000-a000-000000000014',
  1,
  'Q1. What is the primary definition of SQL & Database Systems?',
  'A core technology or standard designed for managing and executing SQL & Database Systems processes.',
  'Legacy manual processing for SQL & Database Systems.',
  'Bypassing standard security checks and protocols in SQL & Database Systems.',
  'Hardcoding static binary files without backup in SQL & Database Systems.',
  'A',
  'Option A is correct. A core technology or standard designed for managing and executing SQL & Database Systems processes.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000014000002',
  '00000000-0002-4000-a000-000000000014',
  2,
  'Q2. Which key benefit is provided by SQL & Database Systems?',
  'Improved efficiency, scalability, modularity, and operational reliability.',
  'Legacy manual processing for SQL & Database Systems.',
  'Bypassing standard security checks and protocols in SQL & Database Systems.',
  'Hardcoding static binary files without backup in SQL & Database Systems.',
  'A',
  'Option A is correct. Improved efficiency, scalability, modularity, and operational reliability.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000014000003',
  '00000000-0002-4000-a000-000000000014',
  3,
  'Q3. What is a fundamental requirement when implementing SQL & Database Systems?',
  'Hardcoding static binary files without backup in SQL & Database Systems.',
  'Legacy manual processing for SQL & Database Systems.',
  'Bypassing standard security checks and protocols in SQL & Database Systems.',
  'Proper system configuration, security protocols, and integration standards.',
  'D',
  'Option D is correct. Proper system configuration, security protocols, and integration standards.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000014000004',
  '00000000-0002-4000-a000-000000000014',
  4,
  'Q4. How does SQL & Database Systems handle data and execution states?',
  'Legacy manual processing for SQL & Database Systems.',
  'By utilizing structured schemas, indexes, and optimized execution pipelines.',
  'Bypassing standard security checks and protocols in SQL & Database Systems.',
  'Hardcoding static binary files without backup in SQL & Database Systems.',
  'B',
  'Option B is correct. By utilizing structured schemas, indexes, and optimized execution pipelines.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000014000005',
  '00000000-0002-4000-a000-000000000014',
  5,
  'Q5. What is a recommended best practice when deploying SQL & Database Systems?',
  'Hardcoding static binary files without backup in SQL & Database Systems.',
  'Legacy manual processing for SQL & Database Systems.',
  'Bypassing standard security checks and protocols in SQL & Database Systems.',
  'Conducting regular automated testing, logging, and monitoring checks.',
  'D',
  'Option D is correct. Conducting regular automated testing, logging, and monitoring checks.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000014000006',
  '00000000-0002-4000-a000-000000000014',
  6,
  'Q6. Which layer or component plays a vital role in SQL & Database Systems?',
  'Bypassing standard security checks and protocols in SQL & Database Systems.',
  'Legacy manual processing for SQL & Database Systems.',
  'The central execution handler and protocol controller.',
  'Hardcoding static binary files without backup in SQL & Database Systems.',
  'C',
  'Option C is correct. The central execution handler and protocol controller.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000014000007',
  '00000000-0002-4000-a000-000000000014',
  7,
  'Q7. What is a common bottleneck or challenge in SQL & Database Systems?',
  'Bypassing standard security checks and protocols in SQL & Database Systems.',
  'Legacy manual processing for SQL & Database Systems.',
  'Managing system state synchronization and resource contention under heavy load.',
  'Hardcoding static binary files without backup in SQL & Database Systems.',
  'C',
  'Option C is correct. Managing system state synchronization and resource contention under heavy load.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000014000008',
  '00000000-0002-4000-a000-000000000014',
  8,
  'Q8. How is security typically enforced within SQL & Database Systems?',
  'Bypassing standard security checks and protocols in SQL & Database Systems.',
  'Legacy manual processing for SQL & Database Systems.',
  'Through strong authentication, access control permissions, and data encryption.',
  'Hardcoding static binary files without backup in SQL & Database Systems.',
  'C',
  'Option C is correct. Through strong authentication, access control permissions, and data encryption.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000014000009',
  '00000000-0002-4000-a000-000000000014',
  9,
  'Q9. Which metric is critical for measuring the performance of SQL & Database Systems?',
  'Bypassing standard security checks and protocols in SQL & Database Systems.',
  'Legacy manual processing for SQL & Database Systems.',
  'Response latency, throughput, resource utilization, and error rates.',
  'Hardcoding static binary files without backup in SQL & Database Systems.',
  'C',
  'Option C is correct. Response latency, throughput, resource utilization, and error rates.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000014000010',
  '00000000-0002-4000-a000-000000000014',
  10,
  'Q10. What is the role of versioning in SQL & Database Systems?',
  'Bypassing standard security checks and protocols in SQL & Database Systems.',
  'Legacy manual processing for SQL & Database Systems.',
  'To support safe updates, maintain backward compatibility, and enable rollbacks.',
  'Hardcoding static binary files without backup in SQL & Database Systems.',
  'C',
  'Option C is correct. To support safe updates, maintain backward compatibility, and enable rollbacks.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000014000011',
  '00000000-0002-4000-a000-000000000014',
  11,
  'Q11. In what scenario is SQL & Database Systems most effectively applied?',
  'In modern scalable enterprise systems requiring structured workflows and reliability.',
  'Legacy manual processing for SQL & Database Systems.',
  'Bypassing standard security checks and protocols in SQL & Database Systems.',
  'Hardcoding static binary files without backup in SQL & Database Systems.',
  'A',
  'Option A is correct. In modern scalable enterprise systems requiring structured workflows and reliability.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000014000012',
  '00000000-0002-4000-a000-000000000014',
  12,
  'Q12. Which tool or interface is standard for interacting with SQL & Database Systems?',
  'Legacy manual processing for SQL & Database Systems.',
  'Dedicated command line tools, SDK APIs, and management dashboards.',
  'Bypassing standard security checks and protocols in SQL & Database Systems.',
  'Hardcoding static binary files without backup in SQL & Database Systems.',
  'B',
  'Option B is correct. Dedicated command line tools, SDK APIs, and management dashboards.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000014000013',
  '00000000-0002-4000-a000-000000000014',
  13,
  'Q13. What is the initial phase when developing with SQL & Database Systems?',
  'Legacy manual processing for SQL & Database Systems.',
  'Defining requirements, setting up the development environment, and configuring dependencies.',
  'Bypassing standard security checks and protocols in SQL & Database Systems.',
  'Hardcoding static binary files without backup in SQL & Database Systems.',
  'B',
  'Option B is correct. Defining requirements, setting up the development environment, and configuring dependencies.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000014000014',
  '00000000-0002-4000-a000-000000000014',
  14,
  'Q14. Which debugging technique is recommended for SQL & Database Systems?',
  'Bypassing standard security checks and protocols in SQL & Database Systems.',
  'Legacy manual processing for SQL & Database Systems.',
  'Inspecting log trace files, using debugger tools, and verifying stack traces.',
  'Hardcoding static binary files without backup in SQL & Database Systems.',
  'C',
  'Option C is correct. Inspecting log trace files, using debugger tools, and verifying stack traces.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000014000015',
  '00000000-0002-4000-a000-000000000014',
  15,
  'Q15. What is the overall goal of mastering SQL & Database Systems?',
  'To design, build, and maintain production-ready technology solutions.',
  'Legacy manual processing for SQL & Database Systems.',
  'Bypassing standard security checks and protocols in SQL & Database Systems.',
  'Hardcoding static binary files without backup in SQL & Database Systems.',
  'A',
  'Option A is correct. To design, build, and maintain production-ready technology solutions.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000014000016',
  '00000000-0002-4000-a000-000000000014',
  16,
  'Q16. What is the primary definition of SQL & Database Systems?',
  'Hardcoding static binary files without backup in SQL & Database Systems.',
  'Legacy manual processing for SQL & Database Systems.',
  'Bypassing standard security checks and protocols in SQL & Database Systems.',
  'A core technology or standard designed for managing and executing SQL & Database Systems processes.',
  'D',
  'Option D is correct. A core technology or standard designed for managing and executing SQL & Database Systems processes.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000014000017',
  '00000000-0002-4000-a000-000000000014',
  17,
  'Q17. Which key benefit is provided by SQL & Database Systems?',
  'Legacy manual processing for SQL & Database Systems.',
  'Improved efficiency, scalability, modularity, and operational reliability.',
  'Bypassing standard security checks and protocols in SQL & Database Systems.',
  'Hardcoding static binary files without backup in SQL & Database Systems.',
  'B',
  'Option B is correct. Improved efficiency, scalability, modularity, and operational reliability.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000014000018',
  '00000000-0002-4000-a000-000000000014',
  18,
  'Q18. What is a fundamental requirement when implementing SQL & Database Systems?',
  'Bypassing standard security checks and protocols in SQL & Database Systems.',
  'Legacy manual processing for SQL & Database Systems.',
  'Proper system configuration, security protocols, and integration standards.',
  'Hardcoding static binary files without backup in SQL & Database Systems.',
  'C',
  'Option C is correct. Proper system configuration, security protocols, and integration standards.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000014000019',
  '00000000-0002-4000-a000-000000000014',
  19,
  'Q19. How does SQL & Database Systems handle data and execution states?',
  'Hardcoding static binary files without backup in SQL & Database Systems.',
  'Legacy manual processing for SQL & Database Systems.',
  'Bypassing standard security checks and protocols in SQL & Database Systems.',
  'By utilizing structured schemas, indexes, and optimized execution pipelines.',
  'D',
  'Option D is correct. By utilizing structured schemas, indexes, and optimized execution pipelines.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000014000020',
  '00000000-0002-4000-a000-000000000014',
  20,
  'Q20. What is a recommended best practice when deploying SQL & Database Systems?',
  'Hardcoding static binary files without backup in SQL & Database Systems.',
  'Legacy manual processing for SQL & Database Systems.',
  'Bypassing standard security checks and protocols in SQL & Database Systems.',
  'Conducting regular automated testing, logging, and monitoring checks.',
  'D',
  'Option D is correct. Conducting regular automated testing, logging, and monitoring checks.'
);

-- Explore Quiz 15: Git vs GitHub Mastery Quiz
INSERT INTO public.explore_quizzes (id, title, description, category, branch, difficulty, question_count, estimated_minutes, fx_reward, is_daily, is_published)
VALUES (
  '00000000-0002-4000-a000-000000000015',
  'Git vs GitHub Challenge Quiz',
  'Test your knowledge on Git vs GitHub with 20 comprehensive questions.',
  'DevOps',
  'CSE',
  'Beginner',
  20,
  8,
  15,
  FALSE,
  TRUE
);

INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000015000001',
  '00000000-0002-4000-a000-000000000015',
  1,
  'Q1. What is the primary definition of Git vs GitHub?',
  'A core technology or standard designed for managing and executing Git vs GitHub processes.',
  'Legacy manual processing for Git vs GitHub.',
  'Bypassing standard security checks and protocols in Git vs GitHub.',
  'Hardcoding static binary files without backup in Git vs GitHub.',
  'A',
  'Option A is correct. A core technology or standard designed for managing and executing Git vs GitHub processes.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000015000002',
  '00000000-0002-4000-a000-000000000015',
  2,
  'Q2. Which key benefit is provided by Git vs GitHub?',
  'Improved efficiency, scalability, modularity, and operational reliability.',
  'Legacy manual processing for Git vs GitHub.',
  'Bypassing standard security checks and protocols in Git vs GitHub.',
  'Hardcoding static binary files without backup in Git vs GitHub.',
  'A',
  'Option A is correct. Improved efficiency, scalability, modularity, and operational reliability.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000015000003',
  '00000000-0002-4000-a000-000000000015',
  3,
  'Q3. What is a fundamental requirement when implementing Git vs GitHub?',
  'Legacy manual processing for Git vs GitHub.',
  'Proper system configuration, security protocols, and integration standards.',
  'Bypassing standard security checks and protocols in Git vs GitHub.',
  'Hardcoding static binary files without backup in Git vs GitHub.',
  'B',
  'Option B is correct. Proper system configuration, security protocols, and integration standards.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000015000004',
  '00000000-0002-4000-a000-000000000015',
  4,
  'Q4. How does Git vs GitHub handle data and execution states?',
  'By utilizing structured schemas, indexes, and optimized execution pipelines.',
  'Legacy manual processing for Git vs GitHub.',
  'Bypassing standard security checks and protocols in Git vs GitHub.',
  'Hardcoding static binary files without backup in Git vs GitHub.',
  'A',
  'Option A is correct. By utilizing structured schemas, indexes, and optimized execution pipelines.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000015000005',
  '00000000-0002-4000-a000-000000000015',
  5,
  'Q5. What is a recommended best practice when deploying Git vs GitHub?',
  'Legacy manual processing for Git vs GitHub.',
  'Conducting regular automated testing, logging, and monitoring checks.',
  'Bypassing standard security checks and protocols in Git vs GitHub.',
  'Hardcoding static binary files without backup in Git vs GitHub.',
  'B',
  'Option B is correct. Conducting regular automated testing, logging, and monitoring checks.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000015000006',
  '00000000-0002-4000-a000-000000000015',
  6,
  'Q6. Which layer or component plays a vital role in Git vs GitHub?',
  'Hardcoding static binary files without backup in Git vs GitHub.',
  'Legacy manual processing for Git vs GitHub.',
  'Bypassing standard security checks and protocols in Git vs GitHub.',
  'The central execution handler and protocol controller.',
  'D',
  'Option D is correct. The central execution handler and protocol controller.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000015000007',
  '00000000-0002-4000-a000-000000000015',
  7,
  'Q7. What is a common bottleneck or challenge in Git vs GitHub?',
  'Managing system state synchronization and resource contention under heavy load.',
  'Legacy manual processing for Git vs GitHub.',
  'Bypassing standard security checks and protocols in Git vs GitHub.',
  'Hardcoding static binary files without backup in Git vs GitHub.',
  'A',
  'Option A is correct. Managing system state synchronization and resource contention under heavy load.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000015000008',
  '00000000-0002-4000-a000-000000000015',
  8,
  'Q8. How is security typically enforced within Git vs GitHub?',
  'Hardcoding static binary files without backup in Git vs GitHub.',
  'Legacy manual processing for Git vs GitHub.',
  'Bypassing standard security checks and protocols in Git vs GitHub.',
  'Through strong authentication, access control permissions, and data encryption.',
  'D',
  'Option D is correct. Through strong authentication, access control permissions, and data encryption.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000015000009',
  '00000000-0002-4000-a000-000000000015',
  9,
  'Q9. Which metric is critical for measuring the performance of Git vs GitHub?',
  'Response latency, throughput, resource utilization, and error rates.',
  'Legacy manual processing for Git vs GitHub.',
  'Bypassing standard security checks and protocols in Git vs GitHub.',
  'Hardcoding static binary files without backup in Git vs GitHub.',
  'A',
  'Option A is correct. Response latency, throughput, resource utilization, and error rates.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000015000010',
  '00000000-0002-4000-a000-000000000015',
  10,
  'Q10. What is the role of versioning in Git vs GitHub?',
  'Legacy manual processing for Git vs GitHub.',
  'To support safe updates, maintain backward compatibility, and enable rollbacks.',
  'Bypassing standard security checks and protocols in Git vs GitHub.',
  'Hardcoding static binary files without backup in Git vs GitHub.',
  'B',
  'Option B is correct. To support safe updates, maintain backward compatibility, and enable rollbacks.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000015000011',
  '00000000-0002-4000-a000-000000000015',
  11,
  'Q11. In what scenario is Git vs GitHub most effectively applied?',
  'Bypassing standard security checks and protocols in Git vs GitHub.',
  'Legacy manual processing for Git vs GitHub.',
  'In modern scalable enterprise systems requiring structured workflows and reliability.',
  'Hardcoding static binary files without backup in Git vs GitHub.',
  'C',
  'Option C is correct. In modern scalable enterprise systems requiring structured workflows and reliability.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000015000012',
  '00000000-0002-4000-a000-000000000015',
  12,
  'Q12. Which tool or interface is standard for interacting with Git vs GitHub?',
  'Hardcoding static binary files without backup in Git vs GitHub.',
  'Legacy manual processing for Git vs GitHub.',
  'Bypassing standard security checks and protocols in Git vs GitHub.',
  'Dedicated command line tools, SDK APIs, and management dashboards.',
  'D',
  'Option D is correct. Dedicated command line tools, SDK APIs, and management dashboards.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000015000013',
  '00000000-0002-4000-a000-000000000015',
  13,
  'Q13. What is the initial phase when developing with Git vs GitHub?',
  'Defining requirements, setting up the development environment, and configuring dependencies.',
  'Legacy manual processing for Git vs GitHub.',
  'Bypassing standard security checks and protocols in Git vs GitHub.',
  'Hardcoding static binary files without backup in Git vs GitHub.',
  'A',
  'Option A is correct. Defining requirements, setting up the development environment, and configuring dependencies.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000015000014',
  '00000000-0002-4000-a000-000000000015',
  14,
  'Q14. Which debugging technique is recommended for Git vs GitHub?',
  'Inspecting log trace files, using debugger tools, and verifying stack traces.',
  'Legacy manual processing for Git vs GitHub.',
  'Bypassing standard security checks and protocols in Git vs GitHub.',
  'Hardcoding static binary files without backup in Git vs GitHub.',
  'A',
  'Option A is correct. Inspecting log trace files, using debugger tools, and verifying stack traces.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000015000015',
  '00000000-0002-4000-a000-000000000015',
  15,
  'Q15. What is the overall goal of mastering Git vs GitHub?',
  'Hardcoding static binary files without backup in Git vs GitHub.',
  'Legacy manual processing for Git vs GitHub.',
  'Bypassing standard security checks and protocols in Git vs GitHub.',
  'To design, build, and maintain production-ready technology solutions.',
  'D',
  'Option D is correct. To design, build, and maintain production-ready technology solutions.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000015000016',
  '00000000-0002-4000-a000-000000000015',
  16,
  'Q16. What is the primary definition of Git vs GitHub?',
  'Hardcoding static binary files without backup in Git vs GitHub.',
  'Legacy manual processing for Git vs GitHub.',
  'Bypassing standard security checks and protocols in Git vs GitHub.',
  'A core technology or standard designed for managing and executing Git vs GitHub processes.',
  'D',
  'Option D is correct. A core technology or standard designed for managing and executing Git vs GitHub processes.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000015000017',
  '00000000-0002-4000-a000-000000000015',
  17,
  'Q17. Which key benefit is provided by Git vs GitHub?',
  'Bypassing standard security checks and protocols in Git vs GitHub.',
  'Legacy manual processing for Git vs GitHub.',
  'Improved efficiency, scalability, modularity, and operational reliability.',
  'Hardcoding static binary files without backup in Git vs GitHub.',
  'C',
  'Option C is correct. Improved efficiency, scalability, modularity, and operational reliability.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000015000018',
  '00000000-0002-4000-a000-000000000015',
  18,
  'Q18. What is a fundamental requirement when implementing Git vs GitHub?',
  'Hardcoding static binary files without backup in Git vs GitHub.',
  'Legacy manual processing for Git vs GitHub.',
  'Bypassing standard security checks and protocols in Git vs GitHub.',
  'Proper system configuration, security protocols, and integration standards.',
  'D',
  'Option D is correct. Proper system configuration, security protocols, and integration standards.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000015000019',
  '00000000-0002-4000-a000-000000000015',
  19,
  'Q19. How does Git vs GitHub handle data and execution states?',
  'Legacy manual processing for Git vs GitHub.',
  'By utilizing structured schemas, indexes, and optimized execution pipelines.',
  'Bypassing standard security checks and protocols in Git vs GitHub.',
  'Hardcoding static binary files without backup in Git vs GitHub.',
  'B',
  'Option B is correct. By utilizing structured schemas, indexes, and optimized execution pipelines.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000015000020',
  '00000000-0002-4000-a000-000000000015',
  20,
  'Q20. What is a recommended best practice when deploying Git vs GitHub?',
  'Hardcoding static binary files without backup in Git vs GitHub.',
  'Legacy manual processing for Git vs GitHub.',
  'Bypassing standard security checks and protocols in Git vs GitHub.',
  'Conducting regular automated testing, logging, and monitoring checks.',
  'D',
  'Option D is correct. Conducting regular automated testing, logging, and monitoring checks.'
);

-- Explore Quiz 16: HTTP & HTTPS Protocols Mastery Quiz
INSERT INTO public.explore_quizzes (id, title, description, category, branch, difficulty, question_count, estimated_minutes, fx_reward, is_daily, is_published)
VALUES (
  '00000000-0002-4000-a000-000000000016',
  'HTTP & HTTPS Protocols Challenge Quiz',
  'Test your knowledge on HTTP & HTTPS Protocols with 20 comprehensive questions.',
  'Networking',
  'CSE',
  'Intermediate',
  20,
  8,
  15,
  FALSE,
  TRUE
);

INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000016000001',
  '00000000-0002-4000-a000-000000000016',
  1,
  'Q1. What is the primary definition of HTTP & HTTPS Protocols?',
  'A core technology or standard designed for managing and executing HTTP & HTTPS Protocols processes.',
  'Legacy manual processing for HTTP & HTTPS Protocols.',
  'Bypassing standard security checks and protocols in HTTP & HTTPS Protocols.',
  'Hardcoding static binary files without backup in HTTP & HTTPS Protocols.',
  'A',
  'Option A is correct. A core technology or standard designed for managing and executing HTTP & HTTPS Protocols processes.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000016000002',
  '00000000-0002-4000-a000-000000000016',
  2,
  'Q2. Which key benefit is provided by HTTP & HTTPS Protocols?',
  'Bypassing standard security checks and protocols in HTTP & HTTPS Protocols.',
  'Legacy manual processing for HTTP & HTTPS Protocols.',
  'Improved efficiency, scalability, modularity, and operational reliability.',
  'Hardcoding static binary files without backup in HTTP & HTTPS Protocols.',
  'C',
  'Option C is correct. Improved efficiency, scalability, modularity, and operational reliability.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000016000003',
  '00000000-0002-4000-a000-000000000016',
  3,
  'Q3. What is a fundamental requirement when implementing HTTP & HTTPS Protocols?',
  'Bypassing standard security checks and protocols in HTTP & HTTPS Protocols.',
  'Legacy manual processing for HTTP & HTTPS Protocols.',
  'Proper system configuration, security protocols, and integration standards.',
  'Hardcoding static binary files without backup in HTTP & HTTPS Protocols.',
  'C',
  'Option C is correct. Proper system configuration, security protocols, and integration standards.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000016000004',
  '00000000-0002-4000-a000-000000000016',
  4,
  'Q4. How does HTTP & HTTPS Protocols handle data and execution states?',
  'Hardcoding static binary files without backup in HTTP & HTTPS Protocols.',
  'Legacy manual processing for HTTP & HTTPS Protocols.',
  'Bypassing standard security checks and protocols in HTTP & HTTPS Protocols.',
  'By utilizing structured schemas, indexes, and optimized execution pipelines.',
  'D',
  'Option D is correct. By utilizing structured schemas, indexes, and optimized execution pipelines.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000016000005',
  '00000000-0002-4000-a000-000000000016',
  5,
  'Q5. What is a recommended best practice when deploying HTTP & HTTPS Protocols?',
  'Legacy manual processing for HTTP & HTTPS Protocols.',
  'Conducting regular automated testing, logging, and monitoring checks.',
  'Bypassing standard security checks and protocols in HTTP & HTTPS Protocols.',
  'Hardcoding static binary files without backup in HTTP & HTTPS Protocols.',
  'B',
  'Option B is correct. Conducting regular automated testing, logging, and monitoring checks.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000016000006',
  '00000000-0002-4000-a000-000000000016',
  6,
  'Q6. Which layer or component plays a vital role in HTTP & HTTPS Protocols?',
  'Legacy manual processing for HTTP & HTTPS Protocols.',
  'The central execution handler and protocol controller.',
  'Bypassing standard security checks and protocols in HTTP & HTTPS Protocols.',
  'Hardcoding static binary files without backup in HTTP & HTTPS Protocols.',
  'B',
  'Option B is correct. The central execution handler and protocol controller.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000016000007',
  '00000000-0002-4000-a000-000000000016',
  7,
  'Q7. What is a common bottleneck or challenge in HTTP & HTTPS Protocols?',
  'Managing system state synchronization and resource contention under heavy load.',
  'Legacy manual processing for HTTP & HTTPS Protocols.',
  'Bypassing standard security checks and protocols in HTTP & HTTPS Protocols.',
  'Hardcoding static binary files without backup in HTTP & HTTPS Protocols.',
  'A',
  'Option A is correct. Managing system state synchronization and resource contention under heavy load.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000016000008',
  '00000000-0002-4000-a000-000000000016',
  8,
  'Q8. How is security typically enforced within HTTP & HTTPS Protocols?',
  'Bypassing standard security checks and protocols in HTTP & HTTPS Protocols.',
  'Legacy manual processing for HTTP & HTTPS Protocols.',
  'Through strong authentication, access control permissions, and data encryption.',
  'Hardcoding static binary files without backup in HTTP & HTTPS Protocols.',
  'C',
  'Option C is correct. Through strong authentication, access control permissions, and data encryption.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000016000009',
  '00000000-0002-4000-a000-000000000016',
  9,
  'Q9. Which metric is critical for measuring the performance of HTTP & HTTPS Protocols?',
  'Bypassing standard security checks and protocols in HTTP & HTTPS Protocols.',
  'Legacy manual processing for HTTP & HTTPS Protocols.',
  'Response latency, throughput, resource utilization, and error rates.',
  'Hardcoding static binary files without backup in HTTP & HTTPS Protocols.',
  'C',
  'Option C is correct. Response latency, throughput, resource utilization, and error rates.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000016000010',
  '00000000-0002-4000-a000-000000000016',
  10,
  'Q10. What is the role of versioning in HTTP & HTTPS Protocols?',
  'Bypassing standard security checks and protocols in HTTP & HTTPS Protocols.',
  'Legacy manual processing for HTTP & HTTPS Protocols.',
  'To support safe updates, maintain backward compatibility, and enable rollbacks.',
  'Hardcoding static binary files without backup in HTTP & HTTPS Protocols.',
  'C',
  'Option C is correct. To support safe updates, maintain backward compatibility, and enable rollbacks.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000016000011',
  '00000000-0002-4000-a000-000000000016',
  11,
  'Q11. In what scenario is HTTP & HTTPS Protocols most effectively applied?',
  'In modern scalable enterprise systems requiring structured workflows and reliability.',
  'Legacy manual processing for HTTP & HTTPS Protocols.',
  'Bypassing standard security checks and protocols in HTTP & HTTPS Protocols.',
  'Hardcoding static binary files without backup in HTTP & HTTPS Protocols.',
  'A',
  'Option A is correct. In modern scalable enterprise systems requiring structured workflows and reliability.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000016000012',
  '00000000-0002-4000-a000-000000000016',
  12,
  'Q12. Which tool or interface is standard for interacting with HTTP & HTTPS Protocols?',
  'Hardcoding static binary files without backup in HTTP & HTTPS Protocols.',
  'Legacy manual processing for HTTP & HTTPS Protocols.',
  'Bypassing standard security checks and protocols in HTTP & HTTPS Protocols.',
  'Dedicated command line tools, SDK APIs, and management dashboards.',
  'D',
  'Option D is correct. Dedicated command line tools, SDK APIs, and management dashboards.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000016000013',
  '00000000-0002-4000-a000-000000000016',
  13,
  'Q13. What is the initial phase when developing with HTTP & HTTPS Protocols?',
  'Legacy manual processing for HTTP & HTTPS Protocols.',
  'Defining requirements, setting up the development environment, and configuring dependencies.',
  'Bypassing standard security checks and protocols in HTTP & HTTPS Protocols.',
  'Hardcoding static binary files without backup in HTTP & HTTPS Protocols.',
  'B',
  'Option B is correct. Defining requirements, setting up the development environment, and configuring dependencies.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000016000014',
  '00000000-0002-4000-a000-000000000016',
  14,
  'Q14. Which debugging technique is recommended for HTTP & HTTPS Protocols?',
  'Legacy manual processing for HTTP & HTTPS Protocols.',
  'Inspecting log trace files, using debugger tools, and verifying stack traces.',
  'Bypassing standard security checks and protocols in HTTP & HTTPS Protocols.',
  'Hardcoding static binary files without backup in HTTP & HTTPS Protocols.',
  'B',
  'Option B is correct. Inspecting log trace files, using debugger tools, and verifying stack traces.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000016000015',
  '00000000-0002-4000-a000-000000000016',
  15,
  'Q15. What is the overall goal of mastering HTTP & HTTPS Protocols?',
  'Bypassing standard security checks and protocols in HTTP & HTTPS Protocols.',
  'Legacy manual processing for HTTP & HTTPS Protocols.',
  'To design, build, and maintain production-ready technology solutions.',
  'Hardcoding static binary files without backup in HTTP & HTTPS Protocols.',
  'C',
  'Option C is correct. To design, build, and maintain production-ready technology solutions.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000016000016',
  '00000000-0002-4000-a000-000000000016',
  16,
  'Q16. What is the primary definition of HTTP & HTTPS Protocols?',
  'A core technology or standard designed for managing and executing HTTP & HTTPS Protocols processes.',
  'Legacy manual processing for HTTP & HTTPS Protocols.',
  'Bypassing standard security checks and protocols in HTTP & HTTPS Protocols.',
  'Hardcoding static binary files without backup in HTTP & HTTPS Protocols.',
  'A',
  'Option A is correct. A core technology or standard designed for managing and executing HTTP & HTTPS Protocols processes.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000016000017',
  '00000000-0002-4000-a000-000000000016',
  17,
  'Q17. Which key benefit is provided by HTTP & HTTPS Protocols?',
  'Bypassing standard security checks and protocols in HTTP & HTTPS Protocols.',
  'Legacy manual processing for HTTP & HTTPS Protocols.',
  'Improved efficiency, scalability, modularity, and operational reliability.',
  'Hardcoding static binary files without backup in HTTP & HTTPS Protocols.',
  'C',
  'Option C is correct. Improved efficiency, scalability, modularity, and operational reliability.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000016000018',
  '00000000-0002-4000-a000-000000000016',
  18,
  'Q18. What is a fundamental requirement when implementing HTTP & HTTPS Protocols?',
  'Proper system configuration, security protocols, and integration standards.',
  'Legacy manual processing for HTTP & HTTPS Protocols.',
  'Bypassing standard security checks and protocols in HTTP & HTTPS Protocols.',
  'Hardcoding static binary files without backup in HTTP & HTTPS Protocols.',
  'A',
  'Option A is correct. Proper system configuration, security protocols, and integration standards.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000016000019',
  '00000000-0002-4000-a000-000000000016',
  19,
  'Q19. How does HTTP & HTTPS Protocols handle data and execution states?',
  'By utilizing structured schemas, indexes, and optimized execution pipelines.',
  'Legacy manual processing for HTTP & HTTPS Protocols.',
  'Bypassing standard security checks and protocols in HTTP & HTTPS Protocols.',
  'Hardcoding static binary files without backup in HTTP & HTTPS Protocols.',
  'A',
  'Option A is correct. By utilizing structured schemas, indexes, and optimized execution pipelines.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000016000020',
  '00000000-0002-4000-a000-000000000016',
  20,
  'Q20. What is a recommended best practice when deploying HTTP & HTTPS Protocols?',
  'Conducting regular automated testing, logging, and monitoring checks.',
  'Legacy manual processing for HTTP & HTTPS Protocols.',
  'Bypassing standard security checks and protocols in HTTP & HTTPS Protocols.',
  'Hardcoding static binary files without backup in HTTP & HTTPS Protocols.',
  'A',
  'Option A is correct. Conducting regular automated testing, logging, and monitoring checks.'
);

-- Explore Quiz 17: DNS Explained Mastery Quiz
INSERT INTO public.explore_quizzes (id, title, description, category, branch, difficulty, question_count, estimated_minutes, fx_reward, is_daily, is_published)
VALUES (
  '00000000-0002-4000-a000-000000000017',
  'DNS Explained Challenge Quiz',
  'Test your knowledge on DNS Explained with 20 comprehensive questions.',
  'Networking',
  'CSE',
  'Intermediate',
  20,
  8,
  15,
  FALSE,
  TRUE
);

INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000017000001',
  '00000000-0002-4000-a000-000000000017',
  1,
  'Q1. What is the primary definition of DNS Explained?',
  'Bypassing standard security checks and protocols in DNS Explained.',
  'Legacy manual processing for DNS Explained.',
  'A core technology or standard designed for managing and executing DNS Explained processes.',
  'Hardcoding static binary files without backup in DNS Explained.',
  'C',
  'Option C is correct. A core technology or standard designed for managing and executing DNS Explained processes.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000017000002',
  '00000000-0002-4000-a000-000000000017',
  2,
  'Q2. Which key benefit is provided by DNS Explained?',
  'Bypassing standard security checks and protocols in DNS Explained.',
  'Legacy manual processing for DNS Explained.',
  'Improved efficiency, scalability, modularity, and operational reliability.',
  'Hardcoding static binary files without backup in DNS Explained.',
  'C',
  'Option C is correct. Improved efficiency, scalability, modularity, and operational reliability.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000017000003',
  '00000000-0002-4000-a000-000000000017',
  3,
  'Q3. What is a fundamental requirement when implementing DNS Explained?',
  'Proper system configuration, security protocols, and integration standards.',
  'Legacy manual processing for DNS Explained.',
  'Bypassing standard security checks and protocols in DNS Explained.',
  'Hardcoding static binary files without backup in DNS Explained.',
  'A',
  'Option A is correct. Proper system configuration, security protocols, and integration standards.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000017000004',
  '00000000-0002-4000-a000-000000000017',
  4,
  'Q4. How does DNS Explained handle data and execution states?',
  'Legacy manual processing for DNS Explained.',
  'By utilizing structured schemas, indexes, and optimized execution pipelines.',
  'Bypassing standard security checks and protocols in DNS Explained.',
  'Hardcoding static binary files without backup in DNS Explained.',
  'B',
  'Option B is correct. By utilizing structured schemas, indexes, and optimized execution pipelines.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000017000005',
  '00000000-0002-4000-a000-000000000017',
  5,
  'Q5. What is a recommended best practice when deploying DNS Explained?',
  'Bypassing standard security checks and protocols in DNS Explained.',
  'Legacy manual processing for DNS Explained.',
  'Conducting regular automated testing, logging, and monitoring checks.',
  'Hardcoding static binary files without backup in DNS Explained.',
  'C',
  'Option C is correct. Conducting regular automated testing, logging, and monitoring checks.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000017000006',
  '00000000-0002-4000-a000-000000000017',
  6,
  'Q6. Which layer or component plays a vital role in DNS Explained?',
  'Hardcoding static binary files without backup in DNS Explained.',
  'Legacy manual processing for DNS Explained.',
  'Bypassing standard security checks and protocols in DNS Explained.',
  'The central execution handler and protocol controller.',
  'D',
  'Option D is correct. The central execution handler and protocol controller.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000017000007',
  '00000000-0002-4000-a000-000000000017',
  7,
  'Q7. What is a common bottleneck or challenge in DNS Explained?',
  'Managing system state synchronization and resource contention under heavy load.',
  'Legacy manual processing for DNS Explained.',
  'Bypassing standard security checks and protocols in DNS Explained.',
  'Hardcoding static binary files without backup in DNS Explained.',
  'A',
  'Option A is correct. Managing system state synchronization and resource contention under heavy load.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000017000008',
  '00000000-0002-4000-a000-000000000017',
  8,
  'Q8. How is security typically enforced within DNS Explained?',
  'Hardcoding static binary files without backup in DNS Explained.',
  'Legacy manual processing for DNS Explained.',
  'Bypassing standard security checks and protocols in DNS Explained.',
  'Through strong authentication, access control permissions, and data encryption.',
  'D',
  'Option D is correct. Through strong authentication, access control permissions, and data encryption.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000017000009',
  '00000000-0002-4000-a000-000000000017',
  9,
  'Q9. Which metric is critical for measuring the performance of DNS Explained?',
  'Legacy manual processing for DNS Explained.',
  'Response latency, throughput, resource utilization, and error rates.',
  'Bypassing standard security checks and protocols in DNS Explained.',
  'Hardcoding static binary files without backup in DNS Explained.',
  'B',
  'Option B is correct. Response latency, throughput, resource utilization, and error rates.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000017000010',
  '00000000-0002-4000-a000-000000000017',
  10,
  'Q10. What is the role of versioning in DNS Explained?',
  'To support safe updates, maintain backward compatibility, and enable rollbacks.',
  'Legacy manual processing for DNS Explained.',
  'Bypassing standard security checks and protocols in DNS Explained.',
  'Hardcoding static binary files without backup in DNS Explained.',
  'A',
  'Option A is correct. To support safe updates, maintain backward compatibility, and enable rollbacks.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000017000011',
  '00000000-0002-4000-a000-000000000017',
  11,
  'Q11. In what scenario is DNS Explained most effectively applied?',
  'Legacy manual processing for DNS Explained.',
  'In modern scalable enterprise systems requiring structured workflows and reliability.',
  'Bypassing standard security checks and protocols in DNS Explained.',
  'Hardcoding static binary files without backup in DNS Explained.',
  'B',
  'Option B is correct. In modern scalable enterprise systems requiring structured workflows and reliability.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000017000012',
  '00000000-0002-4000-a000-000000000017',
  12,
  'Q12. Which tool or interface is standard for interacting with DNS Explained?',
  'Hardcoding static binary files without backup in DNS Explained.',
  'Legacy manual processing for DNS Explained.',
  'Bypassing standard security checks and protocols in DNS Explained.',
  'Dedicated command line tools, SDK APIs, and management dashboards.',
  'D',
  'Option D is correct. Dedicated command line tools, SDK APIs, and management dashboards.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000017000013',
  '00000000-0002-4000-a000-000000000017',
  13,
  'Q13. What is the initial phase when developing with DNS Explained?',
  'Bypassing standard security checks and protocols in DNS Explained.',
  'Legacy manual processing for DNS Explained.',
  'Defining requirements, setting up the development environment, and configuring dependencies.',
  'Hardcoding static binary files without backup in DNS Explained.',
  'C',
  'Option C is correct. Defining requirements, setting up the development environment, and configuring dependencies.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000017000014',
  '00000000-0002-4000-a000-000000000017',
  14,
  'Q14. Which debugging technique is recommended for DNS Explained?',
  'Bypassing standard security checks and protocols in DNS Explained.',
  'Legacy manual processing for DNS Explained.',
  'Inspecting log trace files, using debugger tools, and verifying stack traces.',
  'Hardcoding static binary files without backup in DNS Explained.',
  'C',
  'Option C is correct. Inspecting log trace files, using debugger tools, and verifying stack traces.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000017000015',
  '00000000-0002-4000-a000-000000000017',
  15,
  'Q15. What is the overall goal of mastering DNS Explained?',
  'Legacy manual processing for DNS Explained.',
  'To design, build, and maintain production-ready technology solutions.',
  'Bypassing standard security checks and protocols in DNS Explained.',
  'Hardcoding static binary files without backup in DNS Explained.',
  'B',
  'Option B is correct. To design, build, and maintain production-ready technology solutions.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000017000016',
  '00000000-0002-4000-a000-000000000017',
  16,
  'Q16. What is the primary definition of DNS Explained?',
  'Bypassing standard security checks and protocols in DNS Explained.',
  'Legacy manual processing for DNS Explained.',
  'A core technology or standard designed for managing and executing DNS Explained processes.',
  'Hardcoding static binary files without backup in DNS Explained.',
  'C',
  'Option C is correct. A core technology or standard designed for managing and executing DNS Explained processes.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000017000017',
  '00000000-0002-4000-a000-000000000017',
  17,
  'Q17. Which key benefit is provided by DNS Explained?',
  'Legacy manual processing for DNS Explained.',
  'Improved efficiency, scalability, modularity, and operational reliability.',
  'Bypassing standard security checks and protocols in DNS Explained.',
  'Hardcoding static binary files without backup in DNS Explained.',
  'B',
  'Option B is correct. Improved efficiency, scalability, modularity, and operational reliability.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000017000018',
  '00000000-0002-4000-a000-000000000017',
  18,
  'Q18. What is a fundamental requirement when implementing DNS Explained?',
  'Hardcoding static binary files without backup in DNS Explained.',
  'Legacy manual processing for DNS Explained.',
  'Bypassing standard security checks and protocols in DNS Explained.',
  'Proper system configuration, security protocols, and integration standards.',
  'D',
  'Option D is correct. Proper system configuration, security protocols, and integration standards.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000017000019',
  '00000000-0002-4000-a000-000000000017',
  19,
  'Q19. How does DNS Explained handle data and execution states?',
  'Hardcoding static binary files without backup in DNS Explained.',
  'Legacy manual processing for DNS Explained.',
  'Bypassing standard security checks and protocols in DNS Explained.',
  'By utilizing structured schemas, indexes, and optimized execution pipelines.',
  'D',
  'Option D is correct. By utilizing structured schemas, indexes, and optimized execution pipelines.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000017000020',
  '00000000-0002-4000-a000-000000000017',
  20,
  'Q20. What is a recommended best practice when deploying DNS Explained?',
  'Bypassing standard security checks and protocols in DNS Explained.',
  'Legacy manual processing for DNS Explained.',
  'Conducting regular automated testing, logging, and monitoring checks.',
  'Hardcoding static binary files without backup in DNS Explained.',
  'C',
  'Option C is correct. Conducting regular automated testing, logging, and monitoring checks.'
);

-- Explore Quiz 18: Responsive Web Design Mastery Quiz
INSERT INTO public.explore_quizzes (id, title, description, category, branch, difficulty, question_count, estimated_minutes, fx_reward, is_daily, is_published)
VALUES (
  '00000000-0002-4000-a000-000000000018',
  'Responsive Web Design Challenge Quiz',
  'Test your knowledge on Responsive Web Design with 20 comprehensive questions.',
  'Web Dev',
  'CSE',
  'Intermediate',
  20,
  8,
  15,
  FALSE,
  TRUE
);

INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000018000001',
  '00000000-0002-4000-a000-000000000018',
  1,
  'Q1. What is the primary definition of Responsive Web Design?',
  'A core technology or standard designed for managing and executing Responsive Web Design processes.',
  'Legacy manual processing for Responsive Web Design.',
  'Bypassing standard security checks and protocols in Responsive Web Design.',
  'Hardcoding static binary files without backup in Responsive Web Design.',
  'A',
  'Option A is correct. A core technology or standard designed for managing and executing Responsive Web Design processes.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000018000002',
  '00000000-0002-4000-a000-000000000018',
  2,
  'Q2. Which key benefit is provided by Responsive Web Design?',
  'Hardcoding static binary files without backup in Responsive Web Design.',
  'Legacy manual processing for Responsive Web Design.',
  'Bypassing standard security checks and protocols in Responsive Web Design.',
  'Improved efficiency, scalability, modularity, and operational reliability.',
  'D',
  'Option D is correct. Improved efficiency, scalability, modularity, and operational reliability.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000018000003',
  '00000000-0002-4000-a000-000000000018',
  3,
  'Q3. What is a fundamental requirement when implementing Responsive Web Design?',
  'Bypassing standard security checks and protocols in Responsive Web Design.',
  'Legacy manual processing for Responsive Web Design.',
  'Proper system configuration, security protocols, and integration standards.',
  'Hardcoding static binary files without backup in Responsive Web Design.',
  'C',
  'Option C is correct. Proper system configuration, security protocols, and integration standards.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000018000004',
  '00000000-0002-4000-a000-000000000018',
  4,
  'Q4. How does Responsive Web Design handle data and execution states?',
  'Hardcoding static binary files without backup in Responsive Web Design.',
  'Legacy manual processing for Responsive Web Design.',
  'Bypassing standard security checks and protocols in Responsive Web Design.',
  'By utilizing structured schemas, indexes, and optimized execution pipelines.',
  'D',
  'Option D is correct. By utilizing structured schemas, indexes, and optimized execution pipelines.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000018000005',
  '00000000-0002-4000-a000-000000000018',
  5,
  'Q5. What is a recommended best practice when deploying Responsive Web Design?',
  'Bypassing standard security checks and protocols in Responsive Web Design.',
  'Legacy manual processing for Responsive Web Design.',
  'Conducting regular automated testing, logging, and monitoring checks.',
  'Hardcoding static binary files without backup in Responsive Web Design.',
  'C',
  'Option C is correct. Conducting regular automated testing, logging, and monitoring checks.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000018000006',
  '00000000-0002-4000-a000-000000000018',
  6,
  'Q6. Which layer or component plays a vital role in Responsive Web Design?',
  'Hardcoding static binary files without backup in Responsive Web Design.',
  'Legacy manual processing for Responsive Web Design.',
  'Bypassing standard security checks and protocols in Responsive Web Design.',
  'The central execution handler and protocol controller.',
  'D',
  'Option D is correct. The central execution handler and protocol controller.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000018000007',
  '00000000-0002-4000-a000-000000000018',
  7,
  'Q7. What is a common bottleneck or challenge in Responsive Web Design?',
  'Hardcoding static binary files without backup in Responsive Web Design.',
  'Legacy manual processing for Responsive Web Design.',
  'Bypassing standard security checks and protocols in Responsive Web Design.',
  'Managing system state synchronization and resource contention under heavy load.',
  'D',
  'Option D is correct. Managing system state synchronization and resource contention under heavy load.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000018000008',
  '00000000-0002-4000-a000-000000000018',
  8,
  'Q8. How is security typically enforced within Responsive Web Design?',
  'Through strong authentication, access control permissions, and data encryption.',
  'Legacy manual processing for Responsive Web Design.',
  'Bypassing standard security checks and protocols in Responsive Web Design.',
  'Hardcoding static binary files without backup in Responsive Web Design.',
  'A',
  'Option A is correct. Through strong authentication, access control permissions, and data encryption.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000018000009',
  '00000000-0002-4000-a000-000000000018',
  9,
  'Q9. Which metric is critical for measuring the performance of Responsive Web Design?',
  'Response latency, throughput, resource utilization, and error rates.',
  'Legacy manual processing for Responsive Web Design.',
  'Bypassing standard security checks and protocols in Responsive Web Design.',
  'Hardcoding static binary files without backup in Responsive Web Design.',
  'A',
  'Option A is correct. Response latency, throughput, resource utilization, and error rates.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000018000010',
  '00000000-0002-4000-a000-000000000018',
  10,
  'Q10. What is the role of versioning in Responsive Web Design?',
  'Hardcoding static binary files without backup in Responsive Web Design.',
  'Legacy manual processing for Responsive Web Design.',
  'Bypassing standard security checks and protocols in Responsive Web Design.',
  'To support safe updates, maintain backward compatibility, and enable rollbacks.',
  'D',
  'Option D is correct. To support safe updates, maintain backward compatibility, and enable rollbacks.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000018000011',
  '00000000-0002-4000-a000-000000000018',
  11,
  'Q11. In what scenario is Responsive Web Design most effectively applied?',
  'Hardcoding static binary files without backup in Responsive Web Design.',
  'Legacy manual processing for Responsive Web Design.',
  'Bypassing standard security checks and protocols in Responsive Web Design.',
  'In modern scalable enterprise systems requiring structured workflows and reliability.',
  'D',
  'Option D is correct. In modern scalable enterprise systems requiring structured workflows and reliability.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000018000012',
  '00000000-0002-4000-a000-000000000018',
  12,
  'Q12. Which tool or interface is standard for interacting with Responsive Web Design?',
  'Hardcoding static binary files without backup in Responsive Web Design.',
  'Legacy manual processing for Responsive Web Design.',
  'Bypassing standard security checks and protocols in Responsive Web Design.',
  'Dedicated command line tools, SDK APIs, and management dashboards.',
  'D',
  'Option D is correct. Dedicated command line tools, SDK APIs, and management dashboards.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000018000013',
  '00000000-0002-4000-a000-000000000018',
  13,
  'Q13. What is the initial phase when developing with Responsive Web Design?',
  'Defining requirements, setting up the development environment, and configuring dependencies.',
  'Legacy manual processing for Responsive Web Design.',
  'Bypassing standard security checks and protocols in Responsive Web Design.',
  'Hardcoding static binary files without backup in Responsive Web Design.',
  'A',
  'Option A is correct. Defining requirements, setting up the development environment, and configuring dependencies.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000018000014',
  '00000000-0002-4000-a000-000000000018',
  14,
  'Q14. Which debugging technique is recommended for Responsive Web Design?',
  'Legacy manual processing for Responsive Web Design.',
  'Inspecting log trace files, using debugger tools, and verifying stack traces.',
  'Bypassing standard security checks and protocols in Responsive Web Design.',
  'Hardcoding static binary files without backup in Responsive Web Design.',
  'B',
  'Option B is correct. Inspecting log trace files, using debugger tools, and verifying stack traces.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000018000015',
  '00000000-0002-4000-a000-000000000018',
  15,
  'Q15. What is the overall goal of mastering Responsive Web Design?',
  'Bypassing standard security checks and protocols in Responsive Web Design.',
  'Legacy manual processing for Responsive Web Design.',
  'To design, build, and maintain production-ready technology solutions.',
  'Hardcoding static binary files without backup in Responsive Web Design.',
  'C',
  'Option C is correct. To design, build, and maintain production-ready technology solutions.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000018000016',
  '00000000-0002-4000-a000-000000000018',
  16,
  'Q16. What is the primary definition of Responsive Web Design?',
  'A core technology or standard designed for managing and executing Responsive Web Design processes.',
  'Legacy manual processing for Responsive Web Design.',
  'Bypassing standard security checks and protocols in Responsive Web Design.',
  'Hardcoding static binary files without backup in Responsive Web Design.',
  'A',
  'Option A is correct. A core technology or standard designed for managing and executing Responsive Web Design processes.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000018000017',
  '00000000-0002-4000-a000-000000000018',
  17,
  'Q17. Which key benefit is provided by Responsive Web Design?',
  'Improved efficiency, scalability, modularity, and operational reliability.',
  'Legacy manual processing for Responsive Web Design.',
  'Bypassing standard security checks and protocols in Responsive Web Design.',
  'Hardcoding static binary files without backup in Responsive Web Design.',
  'A',
  'Option A is correct. Improved efficiency, scalability, modularity, and operational reliability.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000018000018',
  '00000000-0002-4000-a000-000000000018',
  18,
  'Q18. What is a fundamental requirement when implementing Responsive Web Design?',
  'Legacy manual processing for Responsive Web Design.',
  'Proper system configuration, security protocols, and integration standards.',
  'Bypassing standard security checks and protocols in Responsive Web Design.',
  'Hardcoding static binary files without backup in Responsive Web Design.',
  'B',
  'Option B is correct. Proper system configuration, security protocols, and integration standards.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000018000019',
  '00000000-0002-4000-a000-000000000018',
  19,
  'Q19. How does Responsive Web Design handle data and execution states?',
  'By utilizing structured schemas, indexes, and optimized execution pipelines.',
  'Legacy manual processing for Responsive Web Design.',
  'Bypassing standard security checks and protocols in Responsive Web Design.',
  'Hardcoding static binary files without backup in Responsive Web Design.',
  'A',
  'Option A is correct. By utilizing structured schemas, indexes, and optimized execution pipelines.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000018000020',
  '00000000-0002-4000-a000-000000000018',
  20,
  'Q20. What is a recommended best practice when deploying Responsive Web Design?',
  'Legacy manual processing for Responsive Web Design.',
  'Conducting regular automated testing, logging, and monitoring checks.',
  'Bypassing standard security checks and protocols in Responsive Web Design.',
  'Hardcoding static binary files without backup in Responsive Web Design.',
  'B',
  'Option B is correct. Conducting regular automated testing, logging, and monitoring checks.'
);

-- Explore Quiz 19: React Native & Mobile App Dev Mastery Quiz
INSERT INTO public.explore_quizzes (id, title, description, category, branch, difficulty, question_count, estimated_minutes, fx_reward, is_daily, is_published)
VALUES (
  '00000000-0002-4000-a000-000000000019',
  'React Native & Mobile App Dev Challenge Quiz',
  'Test your knowledge on React Native & Mobile App Dev with 20 comprehensive questions.',
  'Mobile Dev',
  'CSE',
  'Intermediate',
  20,
  8,
  15,
  FALSE,
  TRUE
);

INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000019000001',
  '00000000-0002-4000-a000-000000000019',
  1,
  'Q1. What is the primary definition of React Native & Mobile App Dev?',
  'Legacy manual processing for React Native & Mobile App Dev.',
  'A core technology or standard designed for managing and executing React Native & Mobile App Dev processes.',
  'Bypassing standard security checks and protocols in React Native & Mobile App Dev.',
  'Hardcoding static binary files without backup in React Native & Mobile App Dev.',
  'B',
  'Option B is correct. A core technology or standard designed for managing and executing React Native & Mobile App Dev processes.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000019000002',
  '00000000-0002-4000-a000-000000000019',
  2,
  'Q2. Which key benefit is provided by React Native & Mobile App Dev?',
  'Improved efficiency, scalability, modularity, and operational reliability.',
  'Legacy manual processing for React Native & Mobile App Dev.',
  'Bypassing standard security checks and protocols in React Native & Mobile App Dev.',
  'Hardcoding static binary files without backup in React Native & Mobile App Dev.',
  'A',
  'Option A is correct. Improved efficiency, scalability, modularity, and operational reliability.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000019000003',
  '00000000-0002-4000-a000-000000000019',
  3,
  'Q3. What is a fundamental requirement when implementing React Native & Mobile App Dev?',
  'Proper system configuration, security protocols, and integration standards.',
  'Legacy manual processing for React Native & Mobile App Dev.',
  'Bypassing standard security checks and protocols in React Native & Mobile App Dev.',
  'Hardcoding static binary files without backup in React Native & Mobile App Dev.',
  'A',
  'Option A is correct. Proper system configuration, security protocols, and integration standards.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000019000004',
  '00000000-0002-4000-a000-000000000019',
  4,
  'Q4. How does React Native & Mobile App Dev handle data and execution states?',
  'By utilizing structured schemas, indexes, and optimized execution pipelines.',
  'Legacy manual processing for React Native & Mobile App Dev.',
  'Bypassing standard security checks and protocols in React Native & Mobile App Dev.',
  'Hardcoding static binary files without backup in React Native & Mobile App Dev.',
  'A',
  'Option A is correct. By utilizing structured schemas, indexes, and optimized execution pipelines.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000019000005',
  '00000000-0002-4000-a000-000000000019',
  5,
  'Q5. What is a recommended best practice when deploying React Native & Mobile App Dev?',
  'Bypassing standard security checks and protocols in React Native & Mobile App Dev.',
  'Legacy manual processing for React Native & Mobile App Dev.',
  'Conducting regular automated testing, logging, and monitoring checks.',
  'Hardcoding static binary files without backup in React Native & Mobile App Dev.',
  'C',
  'Option C is correct. Conducting regular automated testing, logging, and monitoring checks.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000019000006',
  '00000000-0002-4000-a000-000000000019',
  6,
  'Q6. Which layer or component plays a vital role in React Native & Mobile App Dev?',
  'The central execution handler and protocol controller.',
  'Legacy manual processing for React Native & Mobile App Dev.',
  'Bypassing standard security checks and protocols in React Native & Mobile App Dev.',
  'Hardcoding static binary files without backup in React Native & Mobile App Dev.',
  'A',
  'Option A is correct. The central execution handler and protocol controller.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000019000007',
  '00000000-0002-4000-a000-000000000019',
  7,
  'Q7. What is a common bottleneck or challenge in React Native & Mobile App Dev?',
  'Legacy manual processing for React Native & Mobile App Dev.',
  'Managing system state synchronization and resource contention under heavy load.',
  'Bypassing standard security checks and protocols in React Native & Mobile App Dev.',
  'Hardcoding static binary files without backup in React Native & Mobile App Dev.',
  'B',
  'Option B is correct. Managing system state synchronization and resource contention under heavy load.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000019000008',
  '00000000-0002-4000-a000-000000000019',
  8,
  'Q8. How is security typically enforced within React Native & Mobile App Dev?',
  'Legacy manual processing for React Native & Mobile App Dev.',
  'Through strong authentication, access control permissions, and data encryption.',
  'Bypassing standard security checks and protocols in React Native & Mobile App Dev.',
  'Hardcoding static binary files without backup in React Native & Mobile App Dev.',
  'B',
  'Option B is correct. Through strong authentication, access control permissions, and data encryption.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000019000009',
  '00000000-0002-4000-a000-000000000019',
  9,
  'Q9. Which metric is critical for measuring the performance of React Native & Mobile App Dev?',
  'Legacy manual processing for React Native & Mobile App Dev.',
  'Response latency, throughput, resource utilization, and error rates.',
  'Bypassing standard security checks and protocols in React Native & Mobile App Dev.',
  'Hardcoding static binary files without backup in React Native & Mobile App Dev.',
  'B',
  'Option B is correct. Response latency, throughput, resource utilization, and error rates.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000019000010',
  '00000000-0002-4000-a000-000000000019',
  10,
  'Q10. What is the role of versioning in React Native & Mobile App Dev?',
  'Bypassing standard security checks and protocols in React Native & Mobile App Dev.',
  'Legacy manual processing for React Native & Mobile App Dev.',
  'To support safe updates, maintain backward compatibility, and enable rollbacks.',
  'Hardcoding static binary files without backup in React Native & Mobile App Dev.',
  'C',
  'Option C is correct. To support safe updates, maintain backward compatibility, and enable rollbacks.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000019000011',
  '00000000-0002-4000-a000-000000000019',
  11,
  'Q11. In what scenario is React Native & Mobile App Dev most effectively applied?',
  'Bypassing standard security checks and protocols in React Native & Mobile App Dev.',
  'Legacy manual processing for React Native & Mobile App Dev.',
  'In modern scalable enterprise systems requiring structured workflows and reliability.',
  'Hardcoding static binary files without backup in React Native & Mobile App Dev.',
  'C',
  'Option C is correct. In modern scalable enterprise systems requiring structured workflows and reliability.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000019000012',
  '00000000-0002-4000-a000-000000000019',
  12,
  'Q12. Which tool or interface is standard for interacting with React Native & Mobile App Dev?',
  'Dedicated command line tools, SDK APIs, and management dashboards.',
  'Legacy manual processing for React Native & Mobile App Dev.',
  'Bypassing standard security checks and protocols in React Native & Mobile App Dev.',
  'Hardcoding static binary files without backup in React Native & Mobile App Dev.',
  'A',
  'Option A is correct. Dedicated command line tools, SDK APIs, and management dashboards.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000019000013',
  '00000000-0002-4000-a000-000000000019',
  13,
  'Q13. What is the initial phase when developing with React Native & Mobile App Dev?',
  'Defining requirements, setting up the development environment, and configuring dependencies.',
  'Legacy manual processing for React Native & Mobile App Dev.',
  'Bypassing standard security checks and protocols in React Native & Mobile App Dev.',
  'Hardcoding static binary files without backup in React Native & Mobile App Dev.',
  'A',
  'Option A is correct. Defining requirements, setting up the development environment, and configuring dependencies.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000019000014',
  '00000000-0002-4000-a000-000000000019',
  14,
  'Q14. Which debugging technique is recommended for React Native & Mobile App Dev?',
  'Bypassing standard security checks and protocols in React Native & Mobile App Dev.',
  'Legacy manual processing for React Native & Mobile App Dev.',
  'Inspecting log trace files, using debugger tools, and verifying stack traces.',
  'Hardcoding static binary files without backup in React Native & Mobile App Dev.',
  'C',
  'Option C is correct. Inspecting log trace files, using debugger tools, and verifying stack traces.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000019000015',
  '00000000-0002-4000-a000-000000000019',
  15,
  'Q15. What is the overall goal of mastering React Native & Mobile App Dev?',
  'Hardcoding static binary files without backup in React Native & Mobile App Dev.',
  'Legacy manual processing for React Native & Mobile App Dev.',
  'Bypassing standard security checks and protocols in React Native & Mobile App Dev.',
  'To design, build, and maintain production-ready technology solutions.',
  'D',
  'Option D is correct. To design, build, and maintain production-ready technology solutions.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000019000016',
  '00000000-0002-4000-a000-000000000019',
  16,
  'Q16. What is the primary definition of React Native & Mobile App Dev?',
  'Bypassing standard security checks and protocols in React Native & Mobile App Dev.',
  'Legacy manual processing for React Native & Mobile App Dev.',
  'A core technology or standard designed for managing and executing React Native & Mobile App Dev processes.',
  'Hardcoding static binary files without backup in React Native & Mobile App Dev.',
  'C',
  'Option C is correct. A core technology or standard designed for managing and executing React Native & Mobile App Dev processes.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000019000017',
  '00000000-0002-4000-a000-000000000019',
  17,
  'Q17. Which key benefit is provided by React Native & Mobile App Dev?',
  'Hardcoding static binary files without backup in React Native & Mobile App Dev.',
  'Legacy manual processing for React Native & Mobile App Dev.',
  'Bypassing standard security checks and protocols in React Native & Mobile App Dev.',
  'Improved efficiency, scalability, modularity, and operational reliability.',
  'D',
  'Option D is correct. Improved efficiency, scalability, modularity, and operational reliability.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000019000018',
  '00000000-0002-4000-a000-000000000019',
  18,
  'Q18. What is a fundamental requirement when implementing React Native & Mobile App Dev?',
  'Proper system configuration, security protocols, and integration standards.',
  'Legacy manual processing for React Native & Mobile App Dev.',
  'Bypassing standard security checks and protocols in React Native & Mobile App Dev.',
  'Hardcoding static binary files without backup in React Native & Mobile App Dev.',
  'A',
  'Option A is correct. Proper system configuration, security protocols, and integration standards.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000019000019',
  '00000000-0002-4000-a000-000000000019',
  19,
  'Q19. How does React Native & Mobile App Dev handle data and execution states?',
  'Legacy manual processing for React Native & Mobile App Dev.',
  'By utilizing structured schemas, indexes, and optimized execution pipelines.',
  'Bypassing standard security checks and protocols in React Native & Mobile App Dev.',
  'Hardcoding static binary files without backup in React Native & Mobile App Dev.',
  'B',
  'Option B is correct. By utilizing structured schemas, indexes, and optimized execution pipelines.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000019000020',
  '00000000-0002-4000-a000-000000000019',
  20,
  'Q20. What is a recommended best practice when deploying React Native & Mobile App Dev?',
  'Hardcoding static binary files without backup in React Native & Mobile App Dev.',
  'Legacy manual processing for React Native & Mobile App Dev.',
  'Bypassing standard security checks and protocols in React Native & Mobile App Dev.',
  'Conducting regular automated testing, logging, and monitoring checks.',
  'D',
  'Option D is correct. Conducting regular automated testing, logging, and monitoring checks.'
);

-- Explore Quiz 20: Node.js & Server Fundamentals Mastery Quiz
INSERT INTO public.explore_quizzes (id, title, description, category, branch, difficulty, question_count, estimated_minutes, fx_reward, is_daily, is_published)
VALUES (
  '00000000-0002-4000-a000-000000000020',
  'Node.js & Server Fundamentals Challenge Quiz',
  'Test your knowledge on Node.js & Server Fundamentals with 20 comprehensive questions.',
  'Backend',
  'CSE',
  'Intermediate',
  20,
  8,
  15,
  FALSE,
  TRUE
);

INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000020000001',
  '00000000-0002-4000-a000-000000000020',
  1,
  'Q1. What is the primary definition of Node.js & Server Fundamentals?',
  'Hardcoding static binary files without backup in Node.js & Server Fundamentals.',
  'Legacy manual processing for Node.js & Server Fundamentals.',
  'Bypassing standard security checks and protocols in Node.js & Server Fundamentals.',
  'A core technology or standard designed for managing and executing Node.js & Server Fundamentals processes.',
  'D',
  'Option D is correct. A core technology or standard designed for managing and executing Node.js & Server Fundamentals processes.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000020000002',
  '00000000-0002-4000-a000-000000000020',
  2,
  'Q2. Which key benefit is provided by Node.js & Server Fundamentals?',
  'Legacy manual processing for Node.js & Server Fundamentals.',
  'Improved efficiency, scalability, modularity, and operational reliability.',
  'Bypassing standard security checks and protocols in Node.js & Server Fundamentals.',
  'Hardcoding static binary files without backup in Node.js & Server Fundamentals.',
  'B',
  'Option B is correct. Improved efficiency, scalability, modularity, and operational reliability.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000020000003',
  '00000000-0002-4000-a000-000000000020',
  3,
  'Q3. What is a fundamental requirement when implementing Node.js & Server Fundamentals?',
  'Hardcoding static binary files without backup in Node.js & Server Fundamentals.',
  'Legacy manual processing for Node.js & Server Fundamentals.',
  'Bypassing standard security checks and protocols in Node.js & Server Fundamentals.',
  'Proper system configuration, security protocols, and integration standards.',
  'D',
  'Option D is correct. Proper system configuration, security protocols, and integration standards.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000020000004',
  '00000000-0002-4000-a000-000000000020',
  4,
  'Q4. How does Node.js & Server Fundamentals handle data and execution states?',
  'Bypassing standard security checks and protocols in Node.js & Server Fundamentals.',
  'Legacy manual processing for Node.js & Server Fundamentals.',
  'By utilizing structured schemas, indexes, and optimized execution pipelines.',
  'Hardcoding static binary files without backup in Node.js & Server Fundamentals.',
  'C',
  'Option C is correct. By utilizing structured schemas, indexes, and optimized execution pipelines.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000020000005',
  '00000000-0002-4000-a000-000000000020',
  5,
  'Q5. What is a recommended best practice when deploying Node.js & Server Fundamentals?',
  'Bypassing standard security checks and protocols in Node.js & Server Fundamentals.',
  'Legacy manual processing for Node.js & Server Fundamentals.',
  'Conducting regular automated testing, logging, and monitoring checks.',
  'Hardcoding static binary files without backup in Node.js & Server Fundamentals.',
  'C',
  'Option C is correct. Conducting regular automated testing, logging, and monitoring checks.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000020000006',
  '00000000-0002-4000-a000-000000000020',
  6,
  'Q6. Which layer or component plays a vital role in Node.js & Server Fundamentals?',
  'The central execution handler and protocol controller.',
  'Legacy manual processing for Node.js & Server Fundamentals.',
  'Bypassing standard security checks and protocols in Node.js & Server Fundamentals.',
  'Hardcoding static binary files without backup in Node.js & Server Fundamentals.',
  'A',
  'Option A is correct. The central execution handler and protocol controller.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000020000007',
  '00000000-0002-4000-a000-000000000020',
  7,
  'Q7. What is a common bottleneck or challenge in Node.js & Server Fundamentals?',
  'Hardcoding static binary files without backup in Node.js & Server Fundamentals.',
  'Legacy manual processing for Node.js & Server Fundamentals.',
  'Bypassing standard security checks and protocols in Node.js & Server Fundamentals.',
  'Managing system state synchronization and resource contention under heavy load.',
  'D',
  'Option D is correct. Managing system state synchronization and resource contention under heavy load.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000020000008',
  '00000000-0002-4000-a000-000000000020',
  8,
  'Q8. How is security typically enforced within Node.js & Server Fundamentals?',
  'Legacy manual processing for Node.js & Server Fundamentals.',
  'Through strong authentication, access control permissions, and data encryption.',
  'Bypassing standard security checks and protocols in Node.js & Server Fundamentals.',
  'Hardcoding static binary files without backup in Node.js & Server Fundamentals.',
  'B',
  'Option B is correct. Through strong authentication, access control permissions, and data encryption.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000020000009',
  '00000000-0002-4000-a000-000000000020',
  9,
  'Q9. Which metric is critical for measuring the performance of Node.js & Server Fundamentals?',
  'Legacy manual processing for Node.js & Server Fundamentals.',
  'Response latency, throughput, resource utilization, and error rates.',
  'Bypassing standard security checks and protocols in Node.js & Server Fundamentals.',
  'Hardcoding static binary files without backup in Node.js & Server Fundamentals.',
  'B',
  'Option B is correct. Response latency, throughput, resource utilization, and error rates.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000020000010',
  '00000000-0002-4000-a000-000000000020',
  10,
  'Q10. What is the role of versioning in Node.js & Server Fundamentals?',
  'To support safe updates, maintain backward compatibility, and enable rollbacks.',
  'Legacy manual processing for Node.js & Server Fundamentals.',
  'Bypassing standard security checks and protocols in Node.js & Server Fundamentals.',
  'Hardcoding static binary files without backup in Node.js & Server Fundamentals.',
  'A',
  'Option A is correct. To support safe updates, maintain backward compatibility, and enable rollbacks.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000020000011',
  '00000000-0002-4000-a000-000000000020',
  11,
  'Q11. In what scenario is Node.js & Server Fundamentals most effectively applied?',
  'Legacy manual processing for Node.js & Server Fundamentals.',
  'In modern scalable enterprise systems requiring structured workflows and reliability.',
  'Bypassing standard security checks and protocols in Node.js & Server Fundamentals.',
  'Hardcoding static binary files without backup in Node.js & Server Fundamentals.',
  'B',
  'Option B is correct. In modern scalable enterprise systems requiring structured workflows and reliability.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000020000012',
  '00000000-0002-4000-a000-000000000020',
  12,
  'Q12. Which tool or interface is standard for interacting with Node.js & Server Fundamentals?',
  'Hardcoding static binary files without backup in Node.js & Server Fundamentals.',
  'Legacy manual processing for Node.js & Server Fundamentals.',
  'Bypassing standard security checks and protocols in Node.js & Server Fundamentals.',
  'Dedicated command line tools, SDK APIs, and management dashboards.',
  'D',
  'Option D is correct. Dedicated command line tools, SDK APIs, and management dashboards.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000020000013',
  '00000000-0002-4000-a000-000000000020',
  13,
  'Q13. What is the initial phase when developing with Node.js & Server Fundamentals?',
  'Defining requirements, setting up the development environment, and configuring dependencies.',
  'Legacy manual processing for Node.js & Server Fundamentals.',
  'Bypassing standard security checks and protocols in Node.js & Server Fundamentals.',
  'Hardcoding static binary files without backup in Node.js & Server Fundamentals.',
  'A',
  'Option A is correct. Defining requirements, setting up the development environment, and configuring dependencies.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000020000014',
  '00000000-0002-4000-a000-000000000020',
  14,
  'Q14. Which debugging technique is recommended for Node.js & Server Fundamentals?',
  'Legacy manual processing for Node.js & Server Fundamentals.',
  'Inspecting log trace files, using debugger tools, and verifying stack traces.',
  'Bypassing standard security checks and protocols in Node.js & Server Fundamentals.',
  'Hardcoding static binary files without backup in Node.js & Server Fundamentals.',
  'B',
  'Option B is correct. Inspecting log trace files, using debugger tools, and verifying stack traces.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000020000015',
  '00000000-0002-4000-a000-000000000020',
  15,
  'Q15. What is the overall goal of mastering Node.js & Server Fundamentals?',
  'Legacy manual processing for Node.js & Server Fundamentals.',
  'To design, build, and maintain production-ready technology solutions.',
  'Bypassing standard security checks and protocols in Node.js & Server Fundamentals.',
  'Hardcoding static binary files without backup in Node.js & Server Fundamentals.',
  'B',
  'Option B is correct. To design, build, and maintain production-ready technology solutions.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000020000016',
  '00000000-0002-4000-a000-000000000020',
  16,
  'Q16. What is the primary definition of Node.js & Server Fundamentals?',
  'Hardcoding static binary files without backup in Node.js & Server Fundamentals.',
  'Legacy manual processing for Node.js & Server Fundamentals.',
  'Bypassing standard security checks and protocols in Node.js & Server Fundamentals.',
  'A core technology or standard designed for managing and executing Node.js & Server Fundamentals processes.',
  'D',
  'Option D is correct. A core technology or standard designed for managing and executing Node.js & Server Fundamentals processes.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000020000017',
  '00000000-0002-4000-a000-000000000020',
  17,
  'Q17. Which key benefit is provided by Node.js & Server Fundamentals?',
  'Improved efficiency, scalability, modularity, and operational reliability.',
  'Legacy manual processing for Node.js & Server Fundamentals.',
  'Bypassing standard security checks and protocols in Node.js & Server Fundamentals.',
  'Hardcoding static binary files without backup in Node.js & Server Fundamentals.',
  'A',
  'Option A is correct. Improved efficiency, scalability, modularity, and operational reliability.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000020000018',
  '00000000-0002-4000-a000-000000000020',
  18,
  'Q18. What is a fundamental requirement when implementing Node.js & Server Fundamentals?',
  'Proper system configuration, security protocols, and integration standards.',
  'Legacy manual processing for Node.js & Server Fundamentals.',
  'Bypassing standard security checks and protocols in Node.js & Server Fundamentals.',
  'Hardcoding static binary files without backup in Node.js & Server Fundamentals.',
  'A',
  'Option A is correct. Proper system configuration, security protocols, and integration standards.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000020000019',
  '00000000-0002-4000-a000-000000000020',
  19,
  'Q19. How does Node.js & Server Fundamentals handle data and execution states?',
  'By utilizing structured schemas, indexes, and optimized execution pipelines.',
  'Legacy manual processing for Node.js & Server Fundamentals.',
  'Bypassing standard security checks and protocols in Node.js & Server Fundamentals.',
  'Hardcoding static binary files without backup in Node.js & Server Fundamentals.',
  'A',
  'Option A is correct. By utilizing structured schemas, indexes, and optimized execution pipelines.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000020000020',
  '00000000-0002-4000-a000-000000000020',
  20,
  'Q20. What is a recommended best practice when deploying Node.js & Server Fundamentals?',
  'Conducting regular automated testing, logging, and monitoring checks.',
  'Legacy manual processing for Node.js & Server Fundamentals.',
  'Bypassing standard security checks and protocols in Node.js & Server Fundamentals.',
  'Hardcoding static binary files without backup in Node.js & Server Fundamentals.',
  'A',
  'Option A is correct. Conducting regular automated testing, logging, and monitoring checks.'
);

-- Explore Quiz 21: RESTful Web Services Mastery Quiz
INSERT INTO public.explore_quizzes (id, title, description, category, branch, difficulty, question_count, estimated_minutes, fx_reward, is_daily, is_published)
VALUES (
  '00000000-0002-4000-a000-000000000021',
  'RESTful Web Services Challenge Quiz',
  'Test your knowledge on RESTful Web Services with 20 comprehensive questions.',
  'Backend',
  'CSE',
  'Intermediate',
  20,
  8,
  15,
  FALSE,
  TRUE
);

INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000021000001',
  '00000000-0002-4000-a000-000000000021',
  1,
  'Q1. What is the primary definition of RESTful Web Services?',
  'Legacy manual processing for RESTful Web Services.',
  'A core technology or standard designed for managing and executing RESTful Web Services processes.',
  'Bypassing standard security checks and protocols in RESTful Web Services.',
  'Hardcoding static binary files without backup in RESTful Web Services.',
  'B',
  'Option B is correct. A core technology or standard designed for managing and executing RESTful Web Services processes.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000021000002',
  '00000000-0002-4000-a000-000000000021',
  2,
  'Q2. Which key benefit is provided by RESTful Web Services?',
  'Legacy manual processing for RESTful Web Services.',
  'Improved efficiency, scalability, modularity, and operational reliability.',
  'Bypassing standard security checks and protocols in RESTful Web Services.',
  'Hardcoding static binary files without backup in RESTful Web Services.',
  'B',
  'Option B is correct. Improved efficiency, scalability, modularity, and operational reliability.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000021000003',
  '00000000-0002-4000-a000-000000000021',
  3,
  'Q3. What is a fundamental requirement when implementing RESTful Web Services?',
  'Bypassing standard security checks and protocols in RESTful Web Services.',
  'Legacy manual processing for RESTful Web Services.',
  'Proper system configuration, security protocols, and integration standards.',
  'Hardcoding static binary files without backup in RESTful Web Services.',
  'C',
  'Option C is correct. Proper system configuration, security protocols, and integration standards.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000021000004',
  '00000000-0002-4000-a000-000000000021',
  4,
  'Q4. How does RESTful Web Services handle data and execution states?',
  'Bypassing standard security checks and protocols in RESTful Web Services.',
  'Legacy manual processing for RESTful Web Services.',
  'By utilizing structured schemas, indexes, and optimized execution pipelines.',
  'Hardcoding static binary files without backup in RESTful Web Services.',
  'C',
  'Option C is correct. By utilizing structured schemas, indexes, and optimized execution pipelines.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000021000005',
  '00000000-0002-4000-a000-000000000021',
  5,
  'Q5. What is a recommended best practice when deploying RESTful Web Services?',
  'Hardcoding static binary files without backup in RESTful Web Services.',
  'Legacy manual processing for RESTful Web Services.',
  'Bypassing standard security checks and protocols in RESTful Web Services.',
  'Conducting regular automated testing, logging, and monitoring checks.',
  'D',
  'Option D is correct. Conducting regular automated testing, logging, and monitoring checks.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000021000006',
  '00000000-0002-4000-a000-000000000021',
  6,
  'Q6. Which layer or component plays a vital role in RESTful Web Services?',
  'Hardcoding static binary files without backup in RESTful Web Services.',
  'Legacy manual processing for RESTful Web Services.',
  'Bypassing standard security checks and protocols in RESTful Web Services.',
  'The central execution handler and protocol controller.',
  'D',
  'Option D is correct. The central execution handler and protocol controller.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000021000007',
  '00000000-0002-4000-a000-000000000021',
  7,
  'Q7. What is a common bottleneck or challenge in RESTful Web Services?',
  'Hardcoding static binary files without backup in RESTful Web Services.',
  'Legacy manual processing for RESTful Web Services.',
  'Bypassing standard security checks and protocols in RESTful Web Services.',
  'Managing system state synchronization and resource contention under heavy load.',
  'D',
  'Option D is correct. Managing system state synchronization and resource contention under heavy load.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000021000008',
  '00000000-0002-4000-a000-000000000021',
  8,
  'Q8. How is security typically enforced within RESTful Web Services?',
  'Legacy manual processing for RESTful Web Services.',
  'Through strong authentication, access control permissions, and data encryption.',
  'Bypassing standard security checks and protocols in RESTful Web Services.',
  'Hardcoding static binary files without backup in RESTful Web Services.',
  'B',
  'Option B is correct. Through strong authentication, access control permissions, and data encryption.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000021000009',
  '00000000-0002-4000-a000-000000000021',
  9,
  'Q9. Which metric is critical for measuring the performance of RESTful Web Services?',
  'Hardcoding static binary files without backup in RESTful Web Services.',
  'Legacy manual processing for RESTful Web Services.',
  'Bypassing standard security checks and protocols in RESTful Web Services.',
  'Response latency, throughput, resource utilization, and error rates.',
  'D',
  'Option D is correct. Response latency, throughput, resource utilization, and error rates.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000021000010',
  '00000000-0002-4000-a000-000000000021',
  10,
  'Q10. What is the role of versioning in RESTful Web Services?',
  'Legacy manual processing for RESTful Web Services.',
  'To support safe updates, maintain backward compatibility, and enable rollbacks.',
  'Bypassing standard security checks and protocols in RESTful Web Services.',
  'Hardcoding static binary files without backup in RESTful Web Services.',
  'B',
  'Option B is correct. To support safe updates, maintain backward compatibility, and enable rollbacks.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000021000011',
  '00000000-0002-4000-a000-000000000021',
  11,
  'Q11. In what scenario is RESTful Web Services most effectively applied?',
  'Legacy manual processing for RESTful Web Services.',
  'In modern scalable enterprise systems requiring structured workflows and reliability.',
  'Bypassing standard security checks and protocols in RESTful Web Services.',
  'Hardcoding static binary files without backup in RESTful Web Services.',
  'B',
  'Option B is correct. In modern scalable enterprise systems requiring structured workflows and reliability.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000021000012',
  '00000000-0002-4000-a000-000000000021',
  12,
  'Q12. Which tool or interface is standard for interacting with RESTful Web Services?',
  'Hardcoding static binary files without backup in RESTful Web Services.',
  'Legacy manual processing for RESTful Web Services.',
  'Bypassing standard security checks and protocols in RESTful Web Services.',
  'Dedicated command line tools, SDK APIs, and management dashboards.',
  'D',
  'Option D is correct. Dedicated command line tools, SDK APIs, and management dashboards.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000021000013',
  '00000000-0002-4000-a000-000000000021',
  13,
  'Q13. What is the initial phase when developing with RESTful Web Services?',
  'Bypassing standard security checks and protocols in RESTful Web Services.',
  'Legacy manual processing for RESTful Web Services.',
  'Defining requirements, setting up the development environment, and configuring dependencies.',
  'Hardcoding static binary files without backup in RESTful Web Services.',
  'C',
  'Option C is correct. Defining requirements, setting up the development environment, and configuring dependencies.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000021000014',
  '00000000-0002-4000-a000-000000000021',
  14,
  'Q14. Which debugging technique is recommended for RESTful Web Services?',
  'Legacy manual processing for RESTful Web Services.',
  'Inspecting log trace files, using debugger tools, and verifying stack traces.',
  'Bypassing standard security checks and protocols in RESTful Web Services.',
  'Hardcoding static binary files without backup in RESTful Web Services.',
  'B',
  'Option B is correct. Inspecting log trace files, using debugger tools, and verifying stack traces.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000021000015',
  '00000000-0002-4000-a000-000000000021',
  15,
  'Q15. What is the overall goal of mastering RESTful Web Services?',
  'Hardcoding static binary files without backup in RESTful Web Services.',
  'Legacy manual processing for RESTful Web Services.',
  'Bypassing standard security checks and protocols in RESTful Web Services.',
  'To design, build, and maintain production-ready technology solutions.',
  'D',
  'Option D is correct. To design, build, and maintain production-ready technology solutions.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000021000016',
  '00000000-0002-4000-a000-000000000021',
  16,
  'Q16. What is the primary definition of RESTful Web Services?',
  'Hardcoding static binary files without backup in RESTful Web Services.',
  'Legacy manual processing for RESTful Web Services.',
  'Bypassing standard security checks and protocols in RESTful Web Services.',
  'A core technology or standard designed for managing and executing RESTful Web Services processes.',
  'D',
  'Option D is correct. A core technology or standard designed for managing and executing RESTful Web Services processes.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000021000017',
  '00000000-0002-4000-a000-000000000021',
  17,
  'Q17. Which key benefit is provided by RESTful Web Services?',
  'Bypassing standard security checks and protocols in RESTful Web Services.',
  'Legacy manual processing for RESTful Web Services.',
  'Improved efficiency, scalability, modularity, and operational reliability.',
  'Hardcoding static binary files without backup in RESTful Web Services.',
  'C',
  'Option C is correct. Improved efficiency, scalability, modularity, and operational reliability.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000021000018',
  '00000000-0002-4000-a000-000000000021',
  18,
  'Q18. What is a fundamental requirement when implementing RESTful Web Services?',
  'Hardcoding static binary files without backup in RESTful Web Services.',
  'Legacy manual processing for RESTful Web Services.',
  'Bypassing standard security checks and protocols in RESTful Web Services.',
  'Proper system configuration, security protocols, and integration standards.',
  'D',
  'Option D is correct. Proper system configuration, security protocols, and integration standards.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000021000019',
  '00000000-0002-4000-a000-000000000021',
  19,
  'Q19. How does RESTful Web Services handle data and execution states?',
  'Hardcoding static binary files without backup in RESTful Web Services.',
  'Legacy manual processing for RESTful Web Services.',
  'Bypassing standard security checks and protocols in RESTful Web Services.',
  'By utilizing structured schemas, indexes, and optimized execution pipelines.',
  'D',
  'Option D is correct. By utilizing structured schemas, indexes, and optimized execution pipelines.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000021000020',
  '00000000-0002-4000-a000-000000000021',
  20,
  'Q20. What is a recommended best practice when deploying RESTful Web Services?',
  'Legacy manual processing for RESTful Web Services.',
  'Conducting regular automated testing, logging, and monitoring checks.',
  'Bypassing standard security checks and protocols in RESTful Web Services.',
  'Hardcoding static binary files without backup in RESTful Web Services.',
  'B',
  'Option B is correct. Conducting regular automated testing, logging, and monitoring checks.'
);

-- Explore Quiz 22: Docker & Containerization Mastery Quiz
INSERT INTO public.explore_quizzes (id, title, description, category, branch, difficulty, question_count, estimated_minutes, fx_reward, is_daily, is_published)
VALUES (
  '00000000-0002-4000-a000-000000000022',
  'Docker & Containerization Challenge Quiz',
  'Test your knowledge on Docker & Containerization with 20 comprehensive questions.',
  'DevOps',
  'CSE',
  'Intermediate',
  20,
  8,
  15,
  FALSE,
  TRUE
);

INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000022000001',
  '00000000-0002-4000-a000-000000000022',
  1,
  'Q1. What is the primary definition of Docker & Containerization?',
  'A core technology or standard designed for managing and executing Docker & Containerization processes.',
  'Legacy manual processing for Docker & Containerization.',
  'Bypassing standard security checks and protocols in Docker & Containerization.',
  'Hardcoding static binary files without backup in Docker & Containerization.',
  'A',
  'Option A is correct. A core technology or standard designed for managing and executing Docker & Containerization processes.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000022000002',
  '00000000-0002-4000-a000-000000000022',
  2,
  'Q2. Which key benefit is provided by Docker & Containerization?',
  'Improved efficiency, scalability, modularity, and operational reliability.',
  'Legacy manual processing for Docker & Containerization.',
  'Bypassing standard security checks and protocols in Docker & Containerization.',
  'Hardcoding static binary files without backup in Docker & Containerization.',
  'A',
  'Option A is correct. Improved efficiency, scalability, modularity, and operational reliability.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000022000003',
  '00000000-0002-4000-a000-000000000022',
  3,
  'Q3. What is a fundamental requirement when implementing Docker & Containerization?',
  'Bypassing standard security checks and protocols in Docker & Containerization.',
  'Legacy manual processing for Docker & Containerization.',
  'Proper system configuration, security protocols, and integration standards.',
  'Hardcoding static binary files without backup in Docker & Containerization.',
  'C',
  'Option C is correct. Proper system configuration, security protocols, and integration standards.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000022000004',
  '00000000-0002-4000-a000-000000000022',
  4,
  'Q4. How does Docker & Containerization handle data and execution states?',
  'Hardcoding static binary files without backup in Docker & Containerization.',
  'Legacy manual processing for Docker & Containerization.',
  'Bypassing standard security checks and protocols in Docker & Containerization.',
  'By utilizing structured schemas, indexes, and optimized execution pipelines.',
  'D',
  'Option D is correct. By utilizing structured schemas, indexes, and optimized execution pipelines.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000022000005',
  '00000000-0002-4000-a000-000000000022',
  5,
  'Q5. What is a recommended best practice when deploying Docker & Containerization?',
  'Legacy manual processing for Docker & Containerization.',
  'Conducting regular automated testing, logging, and monitoring checks.',
  'Bypassing standard security checks and protocols in Docker & Containerization.',
  'Hardcoding static binary files without backup in Docker & Containerization.',
  'B',
  'Option B is correct. Conducting regular automated testing, logging, and monitoring checks.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000022000006',
  '00000000-0002-4000-a000-000000000022',
  6,
  'Q6. Which layer or component plays a vital role in Docker & Containerization?',
  'Hardcoding static binary files without backup in Docker & Containerization.',
  'Legacy manual processing for Docker & Containerization.',
  'Bypassing standard security checks and protocols in Docker & Containerization.',
  'The central execution handler and protocol controller.',
  'D',
  'Option D is correct. The central execution handler and protocol controller.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000022000007',
  '00000000-0002-4000-a000-000000000022',
  7,
  'Q7. What is a common bottleneck or challenge in Docker & Containerization?',
  'Legacy manual processing for Docker & Containerization.',
  'Managing system state synchronization and resource contention under heavy load.',
  'Bypassing standard security checks and protocols in Docker & Containerization.',
  'Hardcoding static binary files without backup in Docker & Containerization.',
  'B',
  'Option B is correct. Managing system state synchronization and resource contention under heavy load.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000022000008',
  '00000000-0002-4000-a000-000000000022',
  8,
  'Q8. How is security typically enforced within Docker & Containerization?',
  'Through strong authentication, access control permissions, and data encryption.',
  'Legacy manual processing for Docker & Containerization.',
  'Bypassing standard security checks and protocols in Docker & Containerization.',
  'Hardcoding static binary files without backup in Docker & Containerization.',
  'A',
  'Option A is correct. Through strong authentication, access control permissions, and data encryption.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000022000009',
  '00000000-0002-4000-a000-000000000022',
  9,
  'Q9. Which metric is critical for measuring the performance of Docker & Containerization?',
  'Response latency, throughput, resource utilization, and error rates.',
  'Legacy manual processing for Docker & Containerization.',
  'Bypassing standard security checks and protocols in Docker & Containerization.',
  'Hardcoding static binary files without backup in Docker & Containerization.',
  'A',
  'Option A is correct. Response latency, throughput, resource utilization, and error rates.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000022000010',
  '00000000-0002-4000-a000-000000000022',
  10,
  'Q10. What is the role of versioning in Docker & Containerization?',
  'To support safe updates, maintain backward compatibility, and enable rollbacks.',
  'Legacy manual processing for Docker & Containerization.',
  'Bypassing standard security checks and protocols in Docker & Containerization.',
  'Hardcoding static binary files without backup in Docker & Containerization.',
  'A',
  'Option A is correct. To support safe updates, maintain backward compatibility, and enable rollbacks.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000022000011',
  '00000000-0002-4000-a000-000000000022',
  11,
  'Q11. In what scenario is Docker & Containerization most effectively applied?',
  'Hardcoding static binary files without backup in Docker & Containerization.',
  'Legacy manual processing for Docker & Containerization.',
  'Bypassing standard security checks and protocols in Docker & Containerization.',
  'In modern scalable enterprise systems requiring structured workflows and reliability.',
  'D',
  'Option D is correct. In modern scalable enterprise systems requiring structured workflows and reliability.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000022000012',
  '00000000-0002-4000-a000-000000000022',
  12,
  'Q12. Which tool or interface is standard for interacting with Docker & Containerization?',
  'Hardcoding static binary files without backup in Docker & Containerization.',
  'Legacy manual processing for Docker & Containerization.',
  'Bypassing standard security checks and protocols in Docker & Containerization.',
  'Dedicated command line tools, SDK APIs, and management dashboards.',
  'D',
  'Option D is correct. Dedicated command line tools, SDK APIs, and management dashboards.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000022000013',
  '00000000-0002-4000-a000-000000000022',
  13,
  'Q13. What is the initial phase when developing with Docker & Containerization?',
  'Legacy manual processing for Docker & Containerization.',
  'Defining requirements, setting up the development environment, and configuring dependencies.',
  'Bypassing standard security checks and protocols in Docker & Containerization.',
  'Hardcoding static binary files without backup in Docker & Containerization.',
  'B',
  'Option B is correct. Defining requirements, setting up the development environment, and configuring dependencies.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000022000014',
  '00000000-0002-4000-a000-000000000022',
  14,
  'Q14. Which debugging technique is recommended for Docker & Containerization?',
  'Inspecting log trace files, using debugger tools, and verifying stack traces.',
  'Legacy manual processing for Docker & Containerization.',
  'Bypassing standard security checks and protocols in Docker & Containerization.',
  'Hardcoding static binary files without backup in Docker & Containerization.',
  'A',
  'Option A is correct. Inspecting log trace files, using debugger tools, and verifying stack traces.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000022000015',
  '00000000-0002-4000-a000-000000000022',
  15,
  'Q15. What is the overall goal of mastering Docker & Containerization?',
  'Legacy manual processing for Docker & Containerization.',
  'To design, build, and maintain production-ready technology solutions.',
  'Bypassing standard security checks and protocols in Docker & Containerization.',
  'Hardcoding static binary files without backup in Docker & Containerization.',
  'B',
  'Option B is correct. To design, build, and maintain production-ready technology solutions.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000022000016',
  '00000000-0002-4000-a000-000000000022',
  16,
  'Q16. What is the primary definition of Docker & Containerization?',
  'Hardcoding static binary files without backup in Docker & Containerization.',
  'Legacy manual processing for Docker & Containerization.',
  'Bypassing standard security checks and protocols in Docker & Containerization.',
  'A core technology or standard designed for managing and executing Docker & Containerization processes.',
  'D',
  'Option D is correct. A core technology or standard designed for managing and executing Docker & Containerization processes.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000022000017',
  '00000000-0002-4000-a000-000000000022',
  17,
  'Q17. Which key benefit is provided by Docker & Containerization?',
  'Improved efficiency, scalability, modularity, and operational reliability.',
  'Legacy manual processing for Docker & Containerization.',
  'Bypassing standard security checks and protocols in Docker & Containerization.',
  'Hardcoding static binary files without backup in Docker & Containerization.',
  'A',
  'Option A is correct. Improved efficiency, scalability, modularity, and operational reliability.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000022000018',
  '00000000-0002-4000-a000-000000000022',
  18,
  'Q18. What is a fundamental requirement when implementing Docker & Containerization?',
  'Legacy manual processing for Docker & Containerization.',
  'Proper system configuration, security protocols, and integration standards.',
  'Bypassing standard security checks and protocols in Docker & Containerization.',
  'Hardcoding static binary files without backup in Docker & Containerization.',
  'B',
  'Option B is correct. Proper system configuration, security protocols, and integration standards.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000022000019',
  '00000000-0002-4000-a000-000000000022',
  19,
  'Q19. How does Docker & Containerization handle data and execution states?',
  'Bypassing standard security checks and protocols in Docker & Containerization.',
  'Legacy manual processing for Docker & Containerization.',
  'By utilizing structured schemas, indexes, and optimized execution pipelines.',
  'Hardcoding static binary files without backup in Docker & Containerization.',
  'C',
  'Option C is correct. By utilizing structured schemas, indexes, and optimized execution pipelines.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000022000020',
  '00000000-0002-4000-a000-000000000022',
  20,
  'Q20. What is a recommended best practice when deploying Docker & Containerization?',
  'Bypassing standard security checks and protocols in Docker & Containerization.',
  'Legacy manual processing for Docker & Containerization.',
  'Conducting regular automated testing, logging, and monitoring checks.',
  'Hardcoding static binary files without backup in Docker & Containerization.',
  'C',
  'Option C is correct. Conducting regular automated testing, logging, and monitoring checks.'
);

-- Explore Quiz 23: Kubernetes & Orchestration Mastery Quiz
INSERT INTO public.explore_quizzes (id, title, description, category, branch, difficulty, question_count, estimated_minutes, fx_reward, is_daily, is_published)
VALUES (
  '00000000-0002-4000-a000-000000000023',
  'Kubernetes & Orchestration Challenge Quiz',
  'Test your knowledge on Kubernetes & Orchestration with 20 comprehensive questions.',
  'DevOps',
  'CSE',
  'Advanced',
  20,
  8,
  15,
  FALSE,
  TRUE
);

INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000023000001',
  '00000000-0002-4000-a000-000000000023',
  1,
  'Q1. What is the primary definition of Kubernetes & Orchestration?',
  'Legacy manual processing for Kubernetes & Orchestration.',
  'A core technology or standard designed for managing and executing Kubernetes & Orchestration processes.',
  'Bypassing standard security checks and protocols in Kubernetes & Orchestration.',
  'Hardcoding static binary files without backup in Kubernetes & Orchestration.',
  'B',
  'Option B is correct. A core technology or standard designed for managing and executing Kubernetes & Orchestration processes.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000023000002',
  '00000000-0002-4000-a000-000000000023',
  2,
  'Q2. Which key benefit is provided by Kubernetes & Orchestration?',
  'Legacy manual processing for Kubernetes & Orchestration.',
  'Improved efficiency, scalability, modularity, and operational reliability.',
  'Bypassing standard security checks and protocols in Kubernetes & Orchestration.',
  'Hardcoding static binary files without backup in Kubernetes & Orchestration.',
  'B',
  'Option B is correct. Improved efficiency, scalability, modularity, and operational reliability.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000023000003',
  '00000000-0002-4000-a000-000000000023',
  3,
  'Q3. What is a fundamental requirement when implementing Kubernetes & Orchestration?',
  'Bypassing standard security checks and protocols in Kubernetes & Orchestration.',
  'Legacy manual processing for Kubernetes & Orchestration.',
  'Proper system configuration, security protocols, and integration standards.',
  'Hardcoding static binary files without backup in Kubernetes & Orchestration.',
  'C',
  'Option C is correct. Proper system configuration, security protocols, and integration standards.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000023000004',
  '00000000-0002-4000-a000-000000000023',
  4,
  'Q4. How does Kubernetes & Orchestration handle data and execution states?',
  'By utilizing structured schemas, indexes, and optimized execution pipelines.',
  'Legacy manual processing for Kubernetes & Orchestration.',
  'Bypassing standard security checks and protocols in Kubernetes & Orchestration.',
  'Hardcoding static binary files without backup in Kubernetes & Orchestration.',
  'A',
  'Option A is correct. By utilizing structured schemas, indexes, and optimized execution pipelines.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000023000005',
  '00000000-0002-4000-a000-000000000023',
  5,
  'Q5. What is a recommended best practice when deploying Kubernetes & Orchestration?',
  'Conducting regular automated testing, logging, and monitoring checks.',
  'Legacy manual processing for Kubernetes & Orchestration.',
  'Bypassing standard security checks and protocols in Kubernetes & Orchestration.',
  'Hardcoding static binary files without backup in Kubernetes & Orchestration.',
  'A',
  'Option A is correct. Conducting regular automated testing, logging, and monitoring checks.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000023000006',
  '00000000-0002-4000-a000-000000000023',
  6,
  'Q6. Which layer or component plays a vital role in Kubernetes & Orchestration?',
  'The central execution handler and protocol controller.',
  'Legacy manual processing for Kubernetes & Orchestration.',
  'Bypassing standard security checks and protocols in Kubernetes & Orchestration.',
  'Hardcoding static binary files without backup in Kubernetes & Orchestration.',
  'A',
  'Option A is correct. The central execution handler and protocol controller.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000023000007',
  '00000000-0002-4000-a000-000000000023',
  7,
  'Q7. What is a common bottleneck or challenge in Kubernetes & Orchestration?',
  'Managing system state synchronization and resource contention under heavy load.',
  'Legacy manual processing for Kubernetes & Orchestration.',
  'Bypassing standard security checks and protocols in Kubernetes & Orchestration.',
  'Hardcoding static binary files without backup in Kubernetes & Orchestration.',
  'A',
  'Option A is correct. Managing system state synchronization and resource contention under heavy load.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000023000008',
  '00000000-0002-4000-a000-000000000023',
  8,
  'Q8. How is security typically enforced within Kubernetes & Orchestration?',
  'Hardcoding static binary files without backup in Kubernetes & Orchestration.',
  'Legacy manual processing for Kubernetes & Orchestration.',
  'Bypassing standard security checks and protocols in Kubernetes & Orchestration.',
  'Through strong authentication, access control permissions, and data encryption.',
  'D',
  'Option D is correct. Through strong authentication, access control permissions, and data encryption.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000023000009',
  '00000000-0002-4000-a000-000000000023',
  9,
  'Q9. Which metric is critical for measuring the performance of Kubernetes & Orchestration?',
  'Response latency, throughput, resource utilization, and error rates.',
  'Legacy manual processing for Kubernetes & Orchestration.',
  'Bypassing standard security checks and protocols in Kubernetes & Orchestration.',
  'Hardcoding static binary files without backup in Kubernetes & Orchestration.',
  'A',
  'Option A is correct. Response latency, throughput, resource utilization, and error rates.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000023000010',
  '00000000-0002-4000-a000-000000000023',
  10,
  'Q10. What is the role of versioning in Kubernetes & Orchestration?',
  'Hardcoding static binary files without backup in Kubernetes & Orchestration.',
  'Legacy manual processing for Kubernetes & Orchestration.',
  'Bypassing standard security checks and protocols in Kubernetes & Orchestration.',
  'To support safe updates, maintain backward compatibility, and enable rollbacks.',
  'D',
  'Option D is correct. To support safe updates, maintain backward compatibility, and enable rollbacks.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000023000011',
  '00000000-0002-4000-a000-000000000023',
  11,
  'Q11. In what scenario is Kubernetes & Orchestration most effectively applied?',
  'Hardcoding static binary files without backup in Kubernetes & Orchestration.',
  'Legacy manual processing for Kubernetes & Orchestration.',
  'Bypassing standard security checks and protocols in Kubernetes & Orchestration.',
  'In modern scalable enterprise systems requiring structured workflows and reliability.',
  'D',
  'Option D is correct. In modern scalable enterprise systems requiring structured workflows and reliability.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000023000012',
  '00000000-0002-4000-a000-000000000023',
  12,
  'Q12. Which tool or interface is standard for interacting with Kubernetes & Orchestration?',
  'Hardcoding static binary files without backup in Kubernetes & Orchestration.',
  'Legacy manual processing for Kubernetes & Orchestration.',
  'Bypassing standard security checks and protocols in Kubernetes & Orchestration.',
  'Dedicated command line tools, SDK APIs, and management dashboards.',
  'D',
  'Option D is correct. Dedicated command line tools, SDK APIs, and management dashboards.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000023000013',
  '00000000-0002-4000-a000-000000000023',
  13,
  'Q13. What is the initial phase when developing with Kubernetes & Orchestration?',
  'Defining requirements, setting up the development environment, and configuring dependencies.',
  'Legacy manual processing for Kubernetes & Orchestration.',
  'Bypassing standard security checks and protocols in Kubernetes & Orchestration.',
  'Hardcoding static binary files without backup in Kubernetes & Orchestration.',
  'A',
  'Option A is correct. Defining requirements, setting up the development environment, and configuring dependencies.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000023000014',
  '00000000-0002-4000-a000-000000000023',
  14,
  'Q14. Which debugging technique is recommended for Kubernetes & Orchestration?',
  'Hardcoding static binary files without backup in Kubernetes & Orchestration.',
  'Legacy manual processing for Kubernetes & Orchestration.',
  'Bypassing standard security checks and protocols in Kubernetes & Orchestration.',
  'Inspecting log trace files, using debugger tools, and verifying stack traces.',
  'D',
  'Option D is correct. Inspecting log trace files, using debugger tools, and verifying stack traces.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000023000015',
  '00000000-0002-4000-a000-000000000023',
  15,
  'Q15. What is the overall goal of mastering Kubernetes & Orchestration?',
  'Hardcoding static binary files without backup in Kubernetes & Orchestration.',
  'Legacy manual processing for Kubernetes & Orchestration.',
  'Bypassing standard security checks and protocols in Kubernetes & Orchestration.',
  'To design, build, and maintain production-ready technology solutions.',
  'D',
  'Option D is correct. To design, build, and maintain production-ready technology solutions.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000023000016',
  '00000000-0002-4000-a000-000000000023',
  16,
  'Q16. What is the primary definition of Kubernetes & Orchestration?',
  'A core technology or standard designed for managing and executing Kubernetes & Orchestration processes.',
  'Legacy manual processing for Kubernetes & Orchestration.',
  'Bypassing standard security checks and protocols in Kubernetes & Orchestration.',
  'Hardcoding static binary files without backup in Kubernetes & Orchestration.',
  'A',
  'Option A is correct. A core technology or standard designed for managing and executing Kubernetes & Orchestration processes.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000023000017',
  '00000000-0002-4000-a000-000000000023',
  17,
  'Q17. Which key benefit is provided by Kubernetes & Orchestration?',
  'Bypassing standard security checks and protocols in Kubernetes & Orchestration.',
  'Legacy manual processing for Kubernetes & Orchestration.',
  'Improved efficiency, scalability, modularity, and operational reliability.',
  'Hardcoding static binary files without backup in Kubernetes & Orchestration.',
  'C',
  'Option C is correct. Improved efficiency, scalability, modularity, and operational reliability.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000023000018',
  '00000000-0002-4000-a000-000000000023',
  18,
  'Q18. What is a fundamental requirement when implementing Kubernetes & Orchestration?',
  'Legacy manual processing for Kubernetes & Orchestration.',
  'Proper system configuration, security protocols, and integration standards.',
  'Bypassing standard security checks and protocols in Kubernetes & Orchestration.',
  'Hardcoding static binary files without backup in Kubernetes & Orchestration.',
  'B',
  'Option B is correct. Proper system configuration, security protocols, and integration standards.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000023000019',
  '00000000-0002-4000-a000-000000000023',
  19,
  'Q19. How does Kubernetes & Orchestration handle data and execution states?',
  'Bypassing standard security checks and protocols in Kubernetes & Orchestration.',
  'Legacy manual processing for Kubernetes & Orchestration.',
  'By utilizing structured schemas, indexes, and optimized execution pipelines.',
  'Hardcoding static binary files without backup in Kubernetes & Orchestration.',
  'C',
  'Option C is correct. By utilizing structured schemas, indexes, and optimized execution pipelines.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000023000020',
  '00000000-0002-4000-a000-000000000023',
  20,
  'Q20. What is a recommended best practice when deploying Kubernetes & Orchestration?',
  'Legacy manual processing for Kubernetes & Orchestration.',
  'Conducting regular automated testing, logging, and monitoring checks.',
  'Bypassing standard security checks and protocols in Kubernetes & Orchestration.',
  'Hardcoding static binary files without backup in Kubernetes & Orchestration.',
  'B',
  'Option B is correct. Conducting regular automated testing, logging, and monitoring checks.'
);

-- Explore Quiz 24: Data Structures - Arrays & Lists Mastery Quiz
INSERT INTO public.explore_quizzes (id, title, description, category, branch, difficulty, question_count, estimated_minutes, fx_reward, is_daily, is_published)
VALUES (
  '00000000-0002-4000-a000-000000000024',
  'Data Structures - Arrays & Lists Challenge Quiz',
  'Test your knowledge on Data Structures - Arrays & Lists with 20 comprehensive questions.',
  'DSA',
  'CSE',
  'Beginner',
  20,
  8,
  15,
  FALSE,
  TRUE
);

INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000024000001',
  '00000000-0002-4000-a000-000000000024',
  1,
  'Q1. What is the primary definition of Data Structures - Arrays & Lists?',
  'Bypassing standard security checks and protocols in Data Structures - Arrays & Lists.',
  'Legacy manual processing for Data Structures - Arrays & Lists.',
  'A core technology or standard designed for managing and executing Data Structures - Arrays & Lists processes.',
  'Hardcoding static binary files without backup in Data Structures - Arrays & Lists.',
  'C',
  'Option C is correct. A core technology or standard designed for managing and executing Data Structures - Arrays & Lists processes.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000024000002',
  '00000000-0002-4000-a000-000000000024',
  2,
  'Q2. Which key benefit is provided by Data Structures - Arrays & Lists?',
  'Legacy manual processing for Data Structures - Arrays & Lists.',
  'Improved efficiency, scalability, modularity, and operational reliability.',
  'Bypassing standard security checks and protocols in Data Structures - Arrays & Lists.',
  'Hardcoding static binary files without backup in Data Structures - Arrays & Lists.',
  'B',
  'Option B is correct. Improved efficiency, scalability, modularity, and operational reliability.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000024000003',
  '00000000-0002-4000-a000-000000000024',
  3,
  'Q3. What is a fundamental requirement when implementing Data Structures - Arrays & Lists?',
  'Proper system configuration, security protocols, and integration standards.',
  'Legacy manual processing for Data Structures - Arrays & Lists.',
  'Bypassing standard security checks and protocols in Data Structures - Arrays & Lists.',
  'Hardcoding static binary files without backup in Data Structures - Arrays & Lists.',
  'A',
  'Option A is correct. Proper system configuration, security protocols, and integration standards.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000024000004',
  '00000000-0002-4000-a000-000000000024',
  4,
  'Q4. How does Data Structures - Arrays & Lists handle data and execution states?',
  'Legacy manual processing for Data Structures - Arrays & Lists.',
  'By utilizing structured schemas, indexes, and optimized execution pipelines.',
  'Bypassing standard security checks and protocols in Data Structures - Arrays & Lists.',
  'Hardcoding static binary files without backup in Data Structures - Arrays & Lists.',
  'B',
  'Option B is correct. By utilizing structured schemas, indexes, and optimized execution pipelines.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000024000005',
  '00000000-0002-4000-a000-000000000024',
  5,
  'Q5. What is a recommended best practice when deploying Data Structures - Arrays & Lists?',
  'Conducting regular automated testing, logging, and monitoring checks.',
  'Legacy manual processing for Data Structures - Arrays & Lists.',
  'Bypassing standard security checks and protocols in Data Structures - Arrays & Lists.',
  'Hardcoding static binary files without backup in Data Structures - Arrays & Lists.',
  'A',
  'Option A is correct. Conducting regular automated testing, logging, and monitoring checks.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000024000006',
  '00000000-0002-4000-a000-000000000024',
  6,
  'Q6. Which layer or component plays a vital role in Data Structures - Arrays & Lists?',
  'Legacy manual processing for Data Structures - Arrays & Lists.',
  'The central execution handler and protocol controller.',
  'Bypassing standard security checks and protocols in Data Structures - Arrays & Lists.',
  'Hardcoding static binary files without backup in Data Structures - Arrays & Lists.',
  'B',
  'Option B is correct. The central execution handler and protocol controller.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000024000007',
  '00000000-0002-4000-a000-000000000024',
  7,
  'Q7. What is a common bottleneck or challenge in Data Structures - Arrays & Lists?',
  'Legacy manual processing for Data Structures - Arrays & Lists.',
  'Managing system state synchronization and resource contention under heavy load.',
  'Bypassing standard security checks and protocols in Data Structures - Arrays & Lists.',
  'Hardcoding static binary files without backup in Data Structures - Arrays & Lists.',
  'B',
  'Option B is correct. Managing system state synchronization and resource contention under heavy load.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000024000008',
  '00000000-0002-4000-a000-000000000024',
  8,
  'Q8. How is security typically enforced within Data Structures - Arrays & Lists?',
  'Bypassing standard security checks and protocols in Data Structures - Arrays & Lists.',
  'Legacy manual processing for Data Structures - Arrays & Lists.',
  'Through strong authentication, access control permissions, and data encryption.',
  'Hardcoding static binary files without backup in Data Structures - Arrays & Lists.',
  'C',
  'Option C is correct. Through strong authentication, access control permissions, and data encryption.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000024000009',
  '00000000-0002-4000-a000-000000000024',
  9,
  'Q9. Which metric is critical for measuring the performance of Data Structures - Arrays & Lists?',
  'Response latency, throughput, resource utilization, and error rates.',
  'Legacy manual processing for Data Structures - Arrays & Lists.',
  'Bypassing standard security checks and protocols in Data Structures - Arrays & Lists.',
  'Hardcoding static binary files without backup in Data Structures - Arrays & Lists.',
  'A',
  'Option A is correct. Response latency, throughput, resource utilization, and error rates.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000024000010',
  '00000000-0002-4000-a000-000000000024',
  10,
  'Q10. What is the role of versioning in Data Structures - Arrays & Lists?',
  'Bypassing standard security checks and protocols in Data Structures - Arrays & Lists.',
  'Legacy manual processing for Data Structures - Arrays & Lists.',
  'To support safe updates, maintain backward compatibility, and enable rollbacks.',
  'Hardcoding static binary files without backup in Data Structures - Arrays & Lists.',
  'C',
  'Option C is correct. To support safe updates, maintain backward compatibility, and enable rollbacks.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000024000011',
  '00000000-0002-4000-a000-000000000024',
  11,
  'Q11. In what scenario is Data Structures - Arrays & Lists most effectively applied?',
  'Legacy manual processing for Data Structures - Arrays & Lists.',
  'In modern scalable enterprise systems requiring structured workflows and reliability.',
  'Bypassing standard security checks and protocols in Data Structures - Arrays & Lists.',
  'Hardcoding static binary files without backup in Data Structures - Arrays & Lists.',
  'B',
  'Option B is correct. In modern scalable enterprise systems requiring structured workflows and reliability.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000024000012',
  '00000000-0002-4000-a000-000000000024',
  12,
  'Q12. Which tool or interface is standard for interacting with Data Structures - Arrays & Lists?',
  'Hardcoding static binary files without backup in Data Structures - Arrays & Lists.',
  'Legacy manual processing for Data Structures - Arrays & Lists.',
  'Bypassing standard security checks and protocols in Data Structures - Arrays & Lists.',
  'Dedicated command line tools, SDK APIs, and management dashboards.',
  'D',
  'Option D is correct. Dedicated command line tools, SDK APIs, and management dashboards.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000024000013',
  '00000000-0002-4000-a000-000000000024',
  13,
  'Q13. What is the initial phase when developing with Data Structures - Arrays & Lists?',
  'Legacy manual processing for Data Structures - Arrays & Lists.',
  'Defining requirements, setting up the development environment, and configuring dependencies.',
  'Bypassing standard security checks and protocols in Data Structures - Arrays & Lists.',
  'Hardcoding static binary files without backup in Data Structures - Arrays & Lists.',
  'B',
  'Option B is correct. Defining requirements, setting up the development environment, and configuring dependencies.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000024000014',
  '00000000-0002-4000-a000-000000000024',
  14,
  'Q14. Which debugging technique is recommended for Data Structures - Arrays & Lists?',
  'Hardcoding static binary files without backup in Data Structures - Arrays & Lists.',
  'Legacy manual processing for Data Structures - Arrays & Lists.',
  'Bypassing standard security checks and protocols in Data Structures - Arrays & Lists.',
  'Inspecting log trace files, using debugger tools, and verifying stack traces.',
  'D',
  'Option D is correct. Inspecting log trace files, using debugger tools, and verifying stack traces.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000024000015',
  '00000000-0002-4000-a000-000000000024',
  15,
  'Q15. What is the overall goal of mastering Data Structures - Arrays & Lists?',
  'To design, build, and maintain production-ready technology solutions.',
  'Legacy manual processing for Data Structures - Arrays & Lists.',
  'Bypassing standard security checks and protocols in Data Structures - Arrays & Lists.',
  'Hardcoding static binary files without backup in Data Structures - Arrays & Lists.',
  'A',
  'Option A is correct. To design, build, and maintain production-ready technology solutions.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000024000016',
  '00000000-0002-4000-a000-000000000024',
  16,
  'Q16. What is the primary definition of Data Structures - Arrays & Lists?',
  'A core technology or standard designed for managing and executing Data Structures - Arrays & Lists processes.',
  'Legacy manual processing for Data Structures - Arrays & Lists.',
  'Bypassing standard security checks and protocols in Data Structures - Arrays & Lists.',
  'Hardcoding static binary files without backup in Data Structures - Arrays & Lists.',
  'A',
  'Option A is correct. A core technology or standard designed for managing and executing Data Structures - Arrays & Lists processes.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000024000017',
  '00000000-0002-4000-a000-000000000024',
  17,
  'Q17. Which key benefit is provided by Data Structures - Arrays & Lists?',
  'Improved efficiency, scalability, modularity, and operational reliability.',
  'Legacy manual processing for Data Structures - Arrays & Lists.',
  'Bypassing standard security checks and protocols in Data Structures - Arrays & Lists.',
  'Hardcoding static binary files without backup in Data Structures - Arrays & Lists.',
  'A',
  'Option A is correct. Improved efficiency, scalability, modularity, and operational reliability.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000024000018',
  '00000000-0002-4000-a000-000000000024',
  18,
  'Q18. What is a fundamental requirement when implementing Data Structures - Arrays & Lists?',
  'Legacy manual processing for Data Structures - Arrays & Lists.',
  'Proper system configuration, security protocols, and integration standards.',
  'Bypassing standard security checks and protocols in Data Structures - Arrays & Lists.',
  'Hardcoding static binary files without backup in Data Structures - Arrays & Lists.',
  'B',
  'Option B is correct. Proper system configuration, security protocols, and integration standards.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000024000019',
  '00000000-0002-4000-a000-000000000024',
  19,
  'Q19. How does Data Structures - Arrays & Lists handle data and execution states?',
  'Hardcoding static binary files without backup in Data Structures - Arrays & Lists.',
  'Legacy manual processing for Data Structures - Arrays & Lists.',
  'Bypassing standard security checks and protocols in Data Structures - Arrays & Lists.',
  'By utilizing structured schemas, indexes, and optimized execution pipelines.',
  'D',
  'Option D is correct. By utilizing structured schemas, indexes, and optimized execution pipelines.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000024000020',
  '00000000-0002-4000-a000-000000000024',
  20,
  'Q20. What is a recommended best practice when deploying Data Structures - Arrays & Lists?',
  'Conducting regular automated testing, logging, and monitoring checks.',
  'Legacy manual processing for Data Structures - Arrays & Lists.',
  'Bypassing standard security checks and protocols in Data Structures - Arrays & Lists.',
  'Hardcoding static binary files without backup in Data Structures - Arrays & Lists.',
  'A',
  'Option A is correct. Conducting regular automated testing, logging, and monitoring checks.'
);

-- Explore Quiz 25: Data Structures - Stacks & Queues Mastery Quiz
INSERT INTO public.explore_quizzes (id, title, description, category, branch, difficulty, question_count, estimated_minutes, fx_reward, is_daily, is_published)
VALUES (
  '00000000-0002-4000-a000-000000000025',
  'Data Structures - Stacks & Queues Challenge Quiz',
  'Test your knowledge on Data Structures - Stacks & Queues with 20 comprehensive questions.',
  'DSA',
  'CSE',
  'Intermediate',
  20,
  8,
  15,
  FALSE,
  TRUE
);

INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000025000001',
  '00000000-0002-4000-a000-000000000025',
  1,
  'Q1. What is the primary definition of Data Structures - Stacks & Queues?',
  'Bypassing standard security checks and protocols in Data Structures - Stacks & Queues.',
  'Legacy manual processing for Data Structures - Stacks & Queues.',
  'A core technology or standard designed for managing and executing Data Structures - Stacks & Queues processes.',
  'Hardcoding static binary files without backup in Data Structures - Stacks & Queues.',
  'C',
  'Option C is correct. A core technology or standard designed for managing and executing Data Structures - Stacks & Queues processes.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000025000002',
  '00000000-0002-4000-a000-000000000025',
  2,
  'Q2. Which key benefit is provided by Data Structures - Stacks & Queues?',
  'Bypassing standard security checks and protocols in Data Structures - Stacks & Queues.',
  'Legacy manual processing for Data Structures - Stacks & Queues.',
  'Improved efficiency, scalability, modularity, and operational reliability.',
  'Hardcoding static binary files without backup in Data Structures - Stacks & Queues.',
  'C',
  'Option C is correct. Improved efficiency, scalability, modularity, and operational reliability.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000025000003',
  '00000000-0002-4000-a000-000000000025',
  3,
  'Q3. What is a fundamental requirement when implementing Data Structures - Stacks & Queues?',
  'Legacy manual processing for Data Structures - Stacks & Queues.',
  'Proper system configuration, security protocols, and integration standards.',
  'Bypassing standard security checks and protocols in Data Structures - Stacks & Queues.',
  'Hardcoding static binary files without backup in Data Structures - Stacks & Queues.',
  'B',
  'Option B is correct. Proper system configuration, security protocols, and integration standards.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000025000004',
  '00000000-0002-4000-a000-000000000025',
  4,
  'Q4. How does Data Structures - Stacks & Queues handle data and execution states?',
  'Hardcoding static binary files without backup in Data Structures - Stacks & Queues.',
  'Legacy manual processing for Data Structures - Stacks & Queues.',
  'Bypassing standard security checks and protocols in Data Structures - Stacks & Queues.',
  'By utilizing structured schemas, indexes, and optimized execution pipelines.',
  'D',
  'Option D is correct. By utilizing structured schemas, indexes, and optimized execution pipelines.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000025000005',
  '00000000-0002-4000-a000-000000000025',
  5,
  'Q5. What is a recommended best practice when deploying Data Structures - Stacks & Queues?',
  'Conducting regular automated testing, logging, and monitoring checks.',
  'Legacy manual processing for Data Structures - Stacks & Queues.',
  'Bypassing standard security checks and protocols in Data Structures - Stacks & Queues.',
  'Hardcoding static binary files without backup in Data Structures - Stacks & Queues.',
  'A',
  'Option A is correct. Conducting regular automated testing, logging, and monitoring checks.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000025000006',
  '00000000-0002-4000-a000-000000000025',
  6,
  'Q6. Which layer or component plays a vital role in Data Structures - Stacks & Queues?',
  'Legacy manual processing for Data Structures - Stacks & Queues.',
  'The central execution handler and protocol controller.',
  'Bypassing standard security checks and protocols in Data Structures - Stacks & Queues.',
  'Hardcoding static binary files without backup in Data Structures - Stacks & Queues.',
  'B',
  'Option B is correct. The central execution handler and protocol controller.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000025000007',
  '00000000-0002-4000-a000-000000000025',
  7,
  'Q7. What is a common bottleneck or challenge in Data Structures - Stacks & Queues?',
  'Legacy manual processing for Data Structures - Stacks & Queues.',
  'Managing system state synchronization and resource contention under heavy load.',
  'Bypassing standard security checks and protocols in Data Structures - Stacks & Queues.',
  'Hardcoding static binary files without backup in Data Structures - Stacks & Queues.',
  'B',
  'Option B is correct. Managing system state synchronization and resource contention under heavy load.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000025000008',
  '00000000-0002-4000-a000-000000000025',
  8,
  'Q8. How is security typically enforced within Data Structures - Stacks & Queues?',
  'Bypassing standard security checks and protocols in Data Structures - Stacks & Queues.',
  'Legacy manual processing for Data Structures - Stacks & Queues.',
  'Through strong authentication, access control permissions, and data encryption.',
  'Hardcoding static binary files without backup in Data Structures - Stacks & Queues.',
  'C',
  'Option C is correct. Through strong authentication, access control permissions, and data encryption.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000025000009',
  '00000000-0002-4000-a000-000000000025',
  9,
  'Q9. Which metric is critical for measuring the performance of Data Structures - Stacks & Queues?',
  'Legacy manual processing for Data Structures - Stacks & Queues.',
  'Response latency, throughput, resource utilization, and error rates.',
  'Bypassing standard security checks and protocols in Data Structures - Stacks & Queues.',
  'Hardcoding static binary files without backup in Data Structures - Stacks & Queues.',
  'B',
  'Option B is correct. Response latency, throughput, resource utilization, and error rates.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000025000010',
  '00000000-0002-4000-a000-000000000025',
  10,
  'Q10. What is the role of versioning in Data Structures - Stacks & Queues?',
  'Hardcoding static binary files without backup in Data Structures - Stacks & Queues.',
  'Legacy manual processing for Data Structures - Stacks & Queues.',
  'Bypassing standard security checks and protocols in Data Structures - Stacks & Queues.',
  'To support safe updates, maintain backward compatibility, and enable rollbacks.',
  'D',
  'Option D is correct. To support safe updates, maintain backward compatibility, and enable rollbacks.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000025000011',
  '00000000-0002-4000-a000-000000000025',
  11,
  'Q11. In what scenario is Data Structures - Stacks & Queues most effectively applied?',
  'Bypassing standard security checks and protocols in Data Structures - Stacks & Queues.',
  'Legacy manual processing for Data Structures - Stacks & Queues.',
  'In modern scalable enterprise systems requiring structured workflows and reliability.',
  'Hardcoding static binary files without backup in Data Structures - Stacks & Queues.',
  'C',
  'Option C is correct. In modern scalable enterprise systems requiring structured workflows and reliability.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000025000012',
  '00000000-0002-4000-a000-000000000025',
  12,
  'Q12. Which tool or interface is standard for interacting with Data Structures - Stacks & Queues?',
  'Legacy manual processing for Data Structures - Stacks & Queues.',
  'Dedicated command line tools, SDK APIs, and management dashboards.',
  'Bypassing standard security checks and protocols in Data Structures - Stacks & Queues.',
  'Hardcoding static binary files without backup in Data Structures - Stacks & Queues.',
  'B',
  'Option B is correct. Dedicated command line tools, SDK APIs, and management dashboards.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000025000013',
  '00000000-0002-4000-a000-000000000025',
  13,
  'Q13. What is the initial phase when developing with Data Structures - Stacks & Queues?',
  'Bypassing standard security checks and protocols in Data Structures - Stacks & Queues.',
  'Legacy manual processing for Data Structures - Stacks & Queues.',
  'Defining requirements, setting up the development environment, and configuring dependencies.',
  'Hardcoding static binary files without backup in Data Structures - Stacks & Queues.',
  'C',
  'Option C is correct. Defining requirements, setting up the development environment, and configuring dependencies.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000025000014',
  '00000000-0002-4000-a000-000000000025',
  14,
  'Q14. Which debugging technique is recommended for Data Structures - Stacks & Queues?',
  'Legacy manual processing for Data Structures - Stacks & Queues.',
  'Inspecting log trace files, using debugger tools, and verifying stack traces.',
  'Bypassing standard security checks and protocols in Data Structures - Stacks & Queues.',
  'Hardcoding static binary files without backup in Data Structures - Stacks & Queues.',
  'B',
  'Option B is correct. Inspecting log trace files, using debugger tools, and verifying stack traces.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000025000015',
  '00000000-0002-4000-a000-000000000025',
  15,
  'Q15. What is the overall goal of mastering Data Structures - Stacks & Queues?',
  'Legacy manual processing for Data Structures - Stacks & Queues.',
  'To design, build, and maintain production-ready technology solutions.',
  'Bypassing standard security checks and protocols in Data Structures - Stacks & Queues.',
  'Hardcoding static binary files without backup in Data Structures - Stacks & Queues.',
  'B',
  'Option B is correct. To design, build, and maintain production-ready technology solutions.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000025000016',
  '00000000-0002-4000-a000-000000000025',
  16,
  'Q16. What is the primary definition of Data Structures - Stacks & Queues?',
  'Legacy manual processing for Data Structures - Stacks & Queues.',
  'A core technology or standard designed for managing and executing Data Structures - Stacks & Queues processes.',
  'Bypassing standard security checks and protocols in Data Structures - Stacks & Queues.',
  'Hardcoding static binary files without backup in Data Structures - Stacks & Queues.',
  'B',
  'Option B is correct. A core technology or standard designed for managing and executing Data Structures - Stacks & Queues processes.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000025000017',
  '00000000-0002-4000-a000-000000000025',
  17,
  'Q17. Which key benefit is provided by Data Structures - Stacks & Queues?',
  'Bypassing standard security checks and protocols in Data Structures - Stacks & Queues.',
  'Legacy manual processing for Data Structures - Stacks & Queues.',
  'Improved efficiency, scalability, modularity, and operational reliability.',
  'Hardcoding static binary files without backup in Data Structures - Stacks & Queues.',
  'C',
  'Option C is correct. Improved efficiency, scalability, modularity, and operational reliability.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000025000018',
  '00000000-0002-4000-a000-000000000025',
  18,
  'Q18. What is a fundamental requirement when implementing Data Structures - Stacks & Queues?',
  'Legacy manual processing for Data Structures - Stacks & Queues.',
  'Proper system configuration, security protocols, and integration standards.',
  'Bypassing standard security checks and protocols in Data Structures - Stacks & Queues.',
  'Hardcoding static binary files without backup in Data Structures - Stacks & Queues.',
  'B',
  'Option B is correct. Proper system configuration, security protocols, and integration standards.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000025000019',
  '00000000-0002-4000-a000-000000000025',
  19,
  'Q19. How does Data Structures - Stacks & Queues handle data and execution states?',
  'Bypassing standard security checks and protocols in Data Structures - Stacks & Queues.',
  'Legacy manual processing for Data Structures - Stacks & Queues.',
  'By utilizing structured schemas, indexes, and optimized execution pipelines.',
  'Hardcoding static binary files without backup in Data Structures - Stacks & Queues.',
  'C',
  'Option C is correct. By utilizing structured schemas, indexes, and optimized execution pipelines.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000025000020',
  '00000000-0002-4000-a000-000000000025',
  20,
  'Q20. What is a recommended best practice when deploying Data Structures - Stacks & Queues?',
  'Hardcoding static binary files without backup in Data Structures - Stacks & Queues.',
  'Legacy manual processing for Data Structures - Stacks & Queues.',
  'Bypassing standard security checks and protocols in Data Structures - Stacks & Queues.',
  'Conducting regular automated testing, logging, and monitoring checks.',
  'D',
  'Option D is correct. Conducting regular automated testing, logging, and monitoring checks.'
);

-- Explore Quiz 26: Algorithms - Sorting & Searching Mastery Quiz
INSERT INTO public.explore_quizzes (id, title, description, category, branch, difficulty, question_count, estimated_minutes, fx_reward, is_daily, is_published)
VALUES (
  '00000000-0002-4000-a000-000000000026',
  'Algorithms - Sorting & Searching Challenge Quiz',
  'Test your knowledge on Algorithms - Sorting & Searching with 20 comprehensive questions.',
  'DSA',
  'CSE',
  'Intermediate',
  20,
  8,
  15,
  FALSE,
  TRUE
);

INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000026000001',
  '00000000-0002-4000-a000-000000000026',
  1,
  'Q1. What is the primary definition of Algorithms - Sorting & Searching?',
  'Hardcoding static binary files without backup in Algorithms - Sorting & Searching.',
  'Legacy manual processing for Algorithms - Sorting & Searching.',
  'Bypassing standard security checks and protocols in Algorithms - Sorting & Searching.',
  'A core technology or standard designed for managing and executing Algorithms - Sorting & Searching processes.',
  'D',
  'Option D is correct. A core technology or standard designed for managing and executing Algorithms - Sorting & Searching processes.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000026000002',
  '00000000-0002-4000-a000-000000000026',
  2,
  'Q2. Which key benefit is provided by Algorithms - Sorting & Searching?',
  'Bypassing standard security checks and protocols in Algorithms - Sorting & Searching.',
  'Legacy manual processing for Algorithms - Sorting & Searching.',
  'Improved efficiency, scalability, modularity, and operational reliability.',
  'Hardcoding static binary files without backup in Algorithms - Sorting & Searching.',
  'C',
  'Option C is correct. Improved efficiency, scalability, modularity, and operational reliability.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000026000003',
  '00000000-0002-4000-a000-000000000026',
  3,
  'Q3. What is a fundamental requirement when implementing Algorithms - Sorting & Searching?',
  'Legacy manual processing for Algorithms - Sorting & Searching.',
  'Proper system configuration, security protocols, and integration standards.',
  'Bypassing standard security checks and protocols in Algorithms - Sorting & Searching.',
  'Hardcoding static binary files without backup in Algorithms - Sorting & Searching.',
  'B',
  'Option B is correct. Proper system configuration, security protocols, and integration standards.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000026000004',
  '00000000-0002-4000-a000-000000000026',
  4,
  'Q4. How does Algorithms - Sorting & Searching handle data and execution states?',
  'Bypassing standard security checks and protocols in Algorithms - Sorting & Searching.',
  'Legacy manual processing for Algorithms - Sorting & Searching.',
  'By utilizing structured schemas, indexes, and optimized execution pipelines.',
  'Hardcoding static binary files without backup in Algorithms - Sorting & Searching.',
  'C',
  'Option C is correct. By utilizing structured schemas, indexes, and optimized execution pipelines.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000026000005',
  '00000000-0002-4000-a000-000000000026',
  5,
  'Q5. What is a recommended best practice when deploying Algorithms - Sorting & Searching?',
  'Legacy manual processing for Algorithms - Sorting & Searching.',
  'Conducting regular automated testing, logging, and monitoring checks.',
  'Bypassing standard security checks and protocols in Algorithms - Sorting & Searching.',
  'Hardcoding static binary files without backup in Algorithms - Sorting & Searching.',
  'B',
  'Option B is correct. Conducting regular automated testing, logging, and monitoring checks.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000026000006',
  '00000000-0002-4000-a000-000000000026',
  6,
  'Q6. Which layer or component plays a vital role in Algorithms - Sorting & Searching?',
  'Bypassing standard security checks and protocols in Algorithms - Sorting & Searching.',
  'Legacy manual processing for Algorithms - Sorting & Searching.',
  'The central execution handler and protocol controller.',
  'Hardcoding static binary files without backup in Algorithms - Sorting & Searching.',
  'C',
  'Option C is correct. The central execution handler and protocol controller.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000026000007',
  '00000000-0002-4000-a000-000000000026',
  7,
  'Q7. What is a common bottleneck or challenge in Algorithms - Sorting & Searching?',
  'Bypassing standard security checks and protocols in Algorithms - Sorting & Searching.',
  'Legacy manual processing for Algorithms - Sorting & Searching.',
  'Managing system state synchronization and resource contention under heavy load.',
  'Hardcoding static binary files without backup in Algorithms - Sorting & Searching.',
  'C',
  'Option C is correct. Managing system state synchronization and resource contention under heavy load.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000026000008',
  '00000000-0002-4000-a000-000000000026',
  8,
  'Q8. How is security typically enforced within Algorithms - Sorting & Searching?',
  'Legacy manual processing for Algorithms - Sorting & Searching.',
  'Through strong authentication, access control permissions, and data encryption.',
  'Bypassing standard security checks and protocols in Algorithms - Sorting & Searching.',
  'Hardcoding static binary files without backup in Algorithms - Sorting & Searching.',
  'B',
  'Option B is correct. Through strong authentication, access control permissions, and data encryption.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000026000009',
  '00000000-0002-4000-a000-000000000026',
  9,
  'Q9. Which metric is critical for measuring the performance of Algorithms - Sorting & Searching?',
  'Bypassing standard security checks and protocols in Algorithms - Sorting & Searching.',
  'Legacy manual processing for Algorithms - Sorting & Searching.',
  'Response latency, throughput, resource utilization, and error rates.',
  'Hardcoding static binary files without backup in Algorithms - Sorting & Searching.',
  'C',
  'Option C is correct. Response latency, throughput, resource utilization, and error rates.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000026000010',
  '00000000-0002-4000-a000-000000000026',
  10,
  'Q10. What is the role of versioning in Algorithms - Sorting & Searching?',
  'Hardcoding static binary files without backup in Algorithms - Sorting & Searching.',
  'Legacy manual processing for Algorithms - Sorting & Searching.',
  'Bypassing standard security checks and protocols in Algorithms - Sorting & Searching.',
  'To support safe updates, maintain backward compatibility, and enable rollbacks.',
  'D',
  'Option D is correct. To support safe updates, maintain backward compatibility, and enable rollbacks.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000026000011',
  '00000000-0002-4000-a000-000000000026',
  11,
  'Q11. In what scenario is Algorithms - Sorting & Searching most effectively applied?',
  'Legacy manual processing for Algorithms - Sorting & Searching.',
  'In modern scalable enterprise systems requiring structured workflows and reliability.',
  'Bypassing standard security checks and protocols in Algorithms - Sorting & Searching.',
  'Hardcoding static binary files without backup in Algorithms - Sorting & Searching.',
  'B',
  'Option B is correct. In modern scalable enterprise systems requiring structured workflows and reliability.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000026000012',
  '00000000-0002-4000-a000-000000000026',
  12,
  'Q12. Which tool or interface is standard for interacting with Algorithms - Sorting & Searching?',
  'Hardcoding static binary files without backup in Algorithms - Sorting & Searching.',
  'Legacy manual processing for Algorithms - Sorting & Searching.',
  'Bypassing standard security checks and protocols in Algorithms - Sorting & Searching.',
  'Dedicated command line tools, SDK APIs, and management dashboards.',
  'D',
  'Option D is correct. Dedicated command line tools, SDK APIs, and management dashboards.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000026000013',
  '00000000-0002-4000-a000-000000000026',
  13,
  'Q13. What is the initial phase when developing with Algorithms - Sorting & Searching?',
  'Hardcoding static binary files without backup in Algorithms - Sorting & Searching.',
  'Legacy manual processing for Algorithms - Sorting & Searching.',
  'Bypassing standard security checks and protocols in Algorithms - Sorting & Searching.',
  'Defining requirements, setting up the development environment, and configuring dependencies.',
  'D',
  'Option D is correct. Defining requirements, setting up the development environment, and configuring dependencies.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000026000014',
  '00000000-0002-4000-a000-000000000026',
  14,
  'Q14. Which debugging technique is recommended for Algorithms - Sorting & Searching?',
  'Bypassing standard security checks and protocols in Algorithms - Sorting & Searching.',
  'Legacy manual processing for Algorithms - Sorting & Searching.',
  'Inspecting log trace files, using debugger tools, and verifying stack traces.',
  'Hardcoding static binary files without backup in Algorithms - Sorting & Searching.',
  'C',
  'Option C is correct. Inspecting log trace files, using debugger tools, and verifying stack traces.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000026000015',
  '00000000-0002-4000-a000-000000000026',
  15,
  'Q15. What is the overall goal of mastering Algorithms - Sorting & Searching?',
  'Legacy manual processing for Algorithms - Sorting & Searching.',
  'To design, build, and maintain production-ready technology solutions.',
  'Bypassing standard security checks and protocols in Algorithms - Sorting & Searching.',
  'Hardcoding static binary files without backup in Algorithms - Sorting & Searching.',
  'B',
  'Option B is correct. To design, build, and maintain production-ready technology solutions.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000026000016',
  '00000000-0002-4000-a000-000000000026',
  16,
  'Q16. What is the primary definition of Algorithms - Sorting & Searching?',
  'A core technology or standard designed for managing and executing Algorithms - Sorting & Searching processes.',
  'Legacy manual processing for Algorithms - Sorting & Searching.',
  'Bypassing standard security checks and protocols in Algorithms - Sorting & Searching.',
  'Hardcoding static binary files without backup in Algorithms - Sorting & Searching.',
  'A',
  'Option A is correct. A core technology or standard designed for managing and executing Algorithms - Sorting & Searching processes.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000026000017',
  '00000000-0002-4000-a000-000000000026',
  17,
  'Q17. Which key benefit is provided by Algorithms - Sorting & Searching?',
  'Bypassing standard security checks and protocols in Algorithms - Sorting & Searching.',
  'Legacy manual processing for Algorithms - Sorting & Searching.',
  'Improved efficiency, scalability, modularity, and operational reliability.',
  'Hardcoding static binary files without backup in Algorithms - Sorting & Searching.',
  'C',
  'Option C is correct. Improved efficiency, scalability, modularity, and operational reliability.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000026000018',
  '00000000-0002-4000-a000-000000000026',
  18,
  'Q18. What is a fundamental requirement when implementing Algorithms - Sorting & Searching?',
  'Bypassing standard security checks and protocols in Algorithms - Sorting & Searching.',
  'Legacy manual processing for Algorithms - Sorting & Searching.',
  'Proper system configuration, security protocols, and integration standards.',
  'Hardcoding static binary files without backup in Algorithms - Sorting & Searching.',
  'C',
  'Option C is correct. Proper system configuration, security protocols, and integration standards.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000026000019',
  '00000000-0002-4000-a000-000000000026',
  19,
  'Q19. How does Algorithms - Sorting & Searching handle data and execution states?',
  'By utilizing structured schemas, indexes, and optimized execution pipelines.',
  'Legacy manual processing for Algorithms - Sorting & Searching.',
  'Bypassing standard security checks and protocols in Algorithms - Sorting & Searching.',
  'Hardcoding static binary files without backup in Algorithms - Sorting & Searching.',
  'A',
  'Option A is correct. By utilizing structured schemas, indexes, and optimized execution pipelines.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000026000020',
  '00000000-0002-4000-a000-000000000026',
  20,
  'Q20. What is a recommended best practice when deploying Algorithms - Sorting & Searching?',
  'Hardcoding static binary files without backup in Algorithms - Sorting & Searching.',
  'Legacy manual processing for Algorithms - Sorting & Searching.',
  'Bypassing standard security checks and protocols in Algorithms - Sorting & Searching.',
  'Conducting regular automated testing, logging, and monitoring checks.',
  'D',
  'Option D is correct. Conducting regular automated testing, logging, and monitoring checks.'
);

-- Explore Quiz 27: Object-Oriented Programming (OOP) Mastery Quiz
INSERT INTO public.explore_quizzes (id, title, description, category, branch, difficulty, question_count, estimated_minutes, fx_reward, is_daily, is_published)
VALUES (
  '00000000-0002-4000-a000-000000000027',
  'Object-Oriented Programming (OOP) Challenge Quiz',
  'Test your knowledge on Object-Oriented Programming (OOP) with 20 comprehensive questions.',
  'Programming',
  'CSE',
  'Intermediate',
  20,
  8,
  15,
  FALSE,
  TRUE
);

INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000027000001',
  '00000000-0002-4000-a000-000000000027',
  1,
  'Q1. What is the primary definition of Object-Oriented Programming (OOP)?',
  'Legacy manual processing for Object-Oriented Programming (OOP).',
  'A core technology or standard designed for managing and executing Object-Oriented Programming (OOP) processes.',
  'Bypassing standard security checks and protocols in Object-Oriented Programming (OOP).',
  'Hardcoding static binary files without backup in Object-Oriented Programming (OOP).',
  'B',
  'Option B is correct. A core technology or standard designed for managing and executing Object-Oriented Programming (OOP) processes.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000027000002',
  '00000000-0002-4000-a000-000000000027',
  2,
  'Q2. Which key benefit is provided by Object-Oriented Programming (OOP)?',
  'Improved efficiency, scalability, modularity, and operational reliability.',
  'Legacy manual processing for Object-Oriented Programming (OOP).',
  'Bypassing standard security checks and protocols in Object-Oriented Programming (OOP).',
  'Hardcoding static binary files without backup in Object-Oriented Programming (OOP).',
  'A',
  'Option A is correct. Improved efficiency, scalability, modularity, and operational reliability.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000027000003',
  '00000000-0002-4000-a000-000000000027',
  3,
  'Q3. What is a fundamental requirement when implementing Object-Oriented Programming (OOP)?',
  'Proper system configuration, security protocols, and integration standards.',
  'Legacy manual processing for Object-Oriented Programming (OOP).',
  'Bypassing standard security checks and protocols in Object-Oriented Programming (OOP).',
  'Hardcoding static binary files without backup in Object-Oriented Programming (OOP).',
  'A',
  'Option A is correct. Proper system configuration, security protocols, and integration standards.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000027000004',
  '00000000-0002-4000-a000-000000000027',
  4,
  'Q4. How does Object-Oriented Programming (OOP) handle data and execution states?',
  'Hardcoding static binary files without backup in Object-Oriented Programming (OOP).',
  'Legacy manual processing for Object-Oriented Programming (OOP).',
  'Bypassing standard security checks and protocols in Object-Oriented Programming (OOP).',
  'By utilizing structured schemas, indexes, and optimized execution pipelines.',
  'D',
  'Option D is correct. By utilizing structured schemas, indexes, and optimized execution pipelines.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000027000005',
  '00000000-0002-4000-a000-000000000027',
  5,
  'Q5. What is a recommended best practice when deploying Object-Oriented Programming (OOP)?',
  'Bypassing standard security checks and protocols in Object-Oriented Programming (OOP).',
  'Legacy manual processing for Object-Oriented Programming (OOP).',
  'Conducting regular automated testing, logging, and monitoring checks.',
  'Hardcoding static binary files without backup in Object-Oriented Programming (OOP).',
  'C',
  'Option C is correct. Conducting regular automated testing, logging, and monitoring checks.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000027000006',
  '00000000-0002-4000-a000-000000000027',
  6,
  'Q6. Which layer or component plays a vital role in Object-Oriented Programming (OOP)?',
  'Legacy manual processing for Object-Oriented Programming (OOP).',
  'The central execution handler and protocol controller.',
  'Bypassing standard security checks and protocols in Object-Oriented Programming (OOP).',
  'Hardcoding static binary files without backup in Object-Oriented Programming (OOP).',
  'B',
  'Option B is correct. The central execution handler and protocol controller.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000027000007',
  '00000000-0002-4000-a000-000000000027',
  7,
  'Q7. What is a common bottleneck or challenge in Object-Oriented Programming (OOP)?',
  'Bypassing standard security checks and protocols in Object-Oriented Programming (OOP).',
  'Legacy manual processing for Object-Oriented Programming (OOP).',
  'Managing system state synchronization and resource contention under heavy load.',
  'Hardcoding static binary files without backup in Object-Oriented Programming (OOP).',
  'C',
  'Option C is correct. Managing system state synchronization and resource contention under heavy load.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000027000008',
  '00000000-0002-4000-a000-000000000027',
  8,
  'Q8. How is security typically enforced within Object-Oriented Programming (OOP)?',
  'Through strong authentication, access control permissions, and data encryption.',
  'Legacy manual processing for Object-Oriented Programming (OOP).',
  'Bypassing standard security checks and protocols in Object-Oriented Programming (OOP).',
  'Hardcoding static binary files without backup in Object-Oriented Programming (OOP).',
  'A',
  'Option A is correct. Through strong authentication, access control permissions, and data encryption.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000027000009',
  '00000000-0002-4000-a000-000000000027',
  9,
  'Q9. Which metric is critical for measuring the performance of Object-Oriented Programming (OOP)?',
  'Response latency, throughput, resource utilization, and error rates.',
  'Legacy manual processing for Object-Oriented Programming (OOP).',
  'Bypassing standard security checks and protocols in Object-Oriented Programming (OOP).',
  'Hardcoding static binary files without backup in Object-Oriented Programming (OOP).',
  'A',
  'Option A is correct. Response latency, throughput, resource utilization, and error rates.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000027000010',
  '00000000-0002-4000-a000-000000000027',
  10,
  'Q10. What is the role of versioning in Object-Oriented Programming (OOP)?',
  'To support safe updates, maintain backward compatibility, and enable rollbacks.',
  'Legacy manual processing for Object-Oriented Programming (OOP).',
  'Bypassing standard security checks and protocols in Object-Oriented Programming (OOP).',
  'Hardcoding static binary files without backup in Object-Oriented Programming (OOP).',
  'A',
  'Option A is correct. To support safe updates, maintain backward compatibility, and enable rollbacks.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000027000011',
  '00000000-0002-4000-a000-000000000027',
  11,
  'Q11. In what scenario is Object-Oriented Programming (OOP) most effectively applied?',
  'Legacy manual processing for Object-Oriented Programming (OOP).',
  'In modern scalable enterprise systems requiring structured workflows and reliability.',
  'Bypassing standard security checks and protocols in Object-Oriented Programming (OOP).',
  'Hardcoding static binary files without backup in Object-Oriented Programming (OOP).',
  'B',
  'Option B is correct. In modern scalable enterprise systems requiring structured workflows and reliability.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000027000012',
  '00000000-0002-4000-a000-000000000027',
  12,
  'Q12. Which tool or interface is standard for interacting with Object-Oriented Programming (OOP)?',
  'Dedicated command line tools, SDK APIs, and management dashboards.',
  'Legacy manual processing for Object-Oriented Programming (OOP).',
  'Bypassing standard security checks and protocols in Object-Oriented Programming (OOP).',
  'Hardcoding static binary files without backup in Object-Oriented Programming (OOP).',
  'A',
  'Option A is correct. Dedicated command line tools, SDK APIs, and management dashboards.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000027000013',
  '00000000-0002-4000-a000-000000000027',
  13,
  'Q13. What is the initial phase when developing with Object-Oriented Programming (OOP)?',
  'Hardcoding static binary files without backup in Object-Oriented Programming (OOP).',
  'Legacy manual processing for Object-Oriented Programming (OOP).',
  'Bypassing standard security checks and protocols in Object-Oriented Programming (OOP).',
  'Defining requirements, setting up the development environment, and configuring dependencies.',
  'D',
  'Option D is correct. Defining requirements, setting up the development environment, and configuring dependencies.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000027000014',
  '00000000-0002-4000-a000-000000000027',
  14,
  'Q14. Which debugging technique is recommended for Object-Oriented Programming (OOP)?',
  'Bypassing standard security checks and protocols in Object-Oriented Programming (OOP).',
  'Legacy manual processing for Object-Oriented Programming (OOP).',
  'Inspecting log trace files, using debugger tools, and verifying stack traces.',
  'Hardcoding static binary files without backup in Object-Oriented Programming (OOP).',
  'C',
  'Option C is correct. Inspecting log trace files, using debugger tools, and verifying stack traces.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000027000015',
  '00000000-0002-4000-a000-000000000027',
  15,
  'Q15. What is the overall goal of mastering Object-Oriented Programming (OOP)?',
  'Bypassing standard security checks and protocols in Object-Oriented Programming (OOP).',
  'Legacy manual processing for Object-Oriented Programming (OOP).',
  'To design, build, and maintain production-ready technology solutions.',
  'Hardcoding static binary files without backup in Object-Oriented Programming (OOP).',
  'C',
  'Option C is correct. To design, build, and maintain production-ready technology solutions.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000027000016',
  '00000000-0002-4000-a000-000000000027',
  16,
  'Q16. What is the primary definition of Object-Oriented Programming (OOP)?',
  'Legacy manual processing for Object-Oriented Programming (OOP).',
  'A core technology or standard designed for managing and executing Object-Oriented Programming (OOP) processes.',
  'Bypassing standard security checks and protocols in Object-Oriented Programming (OOP).',
  'Hardcoding static binary files without backup in Object-Oriented Programming (OOP).',
  'B',
  'Option B is correct. A core technology or standard designed for managing and executing Object-Oriented Programming (OOP) processes.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000027000017',
  '00000000-0002-4000-a000-000000000027',
  17,
  'Q17. Which key benefit is provided by Object-Oriented Programming (OOP)?',
  'Improved efficiency, scalability, modularity, and operational reliability.',
  'Legacy manual processing for Object-Oriented Programming (OOP).',
  'Bypassing standard security checks and protocols in Object-Oriented Programming (OOP).',
  'Hardcoding static binary files without backup in Object-Oriented Programming (OOP).',
  'A',
  'Option A is correct. Improved efficiency, scalability, modularity, and operational reliability.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000027000018',
  '00000000-0002-4000-a000-000000000027',
  18,
  'Q18. What is a fundamental requirement when implementing Object-Oriented Programming (OOP)?',
  'Hardcoding static binary files without backup in Object-Oriented Programming (OOP).',
  'Legacy manual processing for Object-Oriented Programming (OOP).',
  'Bypassing standard security checks and protocols in Object-Oriented Programming (OOP).',
  'Proper system configuration, security protocols, and integration standards.',
  'D',
  'Option D is correct. Proper system configuration, security protocols, and integration standards.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000027000019',
  '00000000-0002-4000-a000-000000000027',
  19,
  'Q19. How does Object-Oriented Programming (OOP) handle data and execution states?',
  'Bypassing standard security checks and protocols in Object-Oriented Programming (OOP).',
  'Legacy manual processing for Object-Oriented Programming (OOP).',
  'By utilizing structured schemas, indexes, and optimized execution pipelines.',
  'Hardcoding static binary files without backup in Object-Oriented Programming (OOP).',
  'C',
  'Option C is correct. By utilizing structured schemas, indexes, and optimized execution pipelines.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000027000020',
  '00000000-0002-4000-a000-000000000027',
  20,
  'Q20. What is a recommended best practice when deploying Object-Oriented Programming (OOP)?',
  'Bypassing standard security checks and protocols in Object-Oriented Programming (OOP).',
  'Legacy manual processing for Object-Oriented Programming (OOP).',
  'Conducting regular automated testing, logging, and monitoring checks.',
  'Hardcoding static binary files without backup in Object-Oriented Programming (OOP).',
  'C',
  'Option C is correct. Conducting regular automated testing, logging, and monitoring checks.'
);

-- Explore Quiz 28: Software Engineering Principles Mastery Quiz
INSERT INTO public.explore_quizzes (id, title, description, category, branch, difficulty, question_count, estimated_minutes, fx_reward, is_daily, is_published)
VALUES (
  '00000000-0002-4000-a000-000000000028',
  'Software Engineering Principles Challenge Quiz',
  'Test your knowledge on Software Engineering Principles with 20 comprehensive questions.',
  'Software Eng',
  'CSE',
  'Intermediate',
  20,
  8,
  15,
  FALSE,
  TRUE
);

INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000028000001',
  '00000000-0002-4000-a000-000000000028',
  1,
  'Q1. What is the primary definition of Software Engineering Principles?',
  'Bypassing standard security checks and protocols in Software Engineering Principles.',
  'Legacy manual processing for Software Engineering Principles.',
  'A core technology or standard designed for managing and executing Software Engineering Principles processes.',
  'Hardcoding static binary files without backup in Software Engineering Principles.',
  'C',
  'Option C is correct. A core technology or standard designed for managing and executing Software Engineering Principles processes.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000028000002',
  '00000000-0002-4000-a000-000000000028',
  2,
  'Q2. Which key benefit is provided by Software Engineering Principles?',
  'Improved efficiency, scalability, modularity, and operational reliability.',
  'Legacy manual processing for Software Engineering Principles.',
  'Bypassing standard security checks and protocols in Software Engineering Principles.',
  'Hardcoding static binary files without backup in Software Engineering Principles.',
  'A',
  'Option A is correct. Improved efficiency, scalability, modularity, and operational reliability.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000028000003',
  '00000000-0002-4000-a000-000000000028',
  3,
  'Q3. What is a fundamental requirement when implementing Software Engineering Principles?',
  'Hardcoding static binary files without backup in Software Engineering Principles.',
  'Legacy manual processing for Software Engineering Principles.',
  'Bypassing standard security checks and protocols in Software Engineering Principles.',
  'Proper system configuration, security protocols, and integration standards.',
  'D',
  'Option D is correct. Proper system configuration, security protocols, and integration standards.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000028000004',
  '00000000-0002-4000-a000-000000000028',
  4,
  'Q4. How does Software Engineering Principles handle data and execution states?',
  'Hardcoding static binary files without backup in Software Engineering Principles.',
  'Legacy manual processing for Software Engineering Principles.',
  'Bypassing standard security checks and protocols in Software Engineering Principles.',
  'By utilizing structured schemas, indexes, and optimized execution pipelines.',
  'D',
  'Option D is correct. By utilizing structured schemas, indexes, and optimized execution pipelines.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000028000005',
  '00000000-0002-4000-a000-000000000028',
  5,
  'Q5. What is a recommended best practice when deploying Software Engineering Principles?',
  'Legacy manual processing for Software Engineering Principles.',
  'Conducting regular automated testing, logging, and monitoring checks.',
  'Bypassing standard security checks and protocols in Software Engineering Principles.',
  'Hardcoding static binary files without backup in Software Engineering Principles.',
  'B',
  'Option B is correct. Conducting regular automated testing, logging, and monitoring checks.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000028000006',
  '00000000-0002-4000-a000-000000000028',
  6,
  'Q6. Which layer or component plays a vital role in Software Engineering Principles?',
  'Legacy manual processing for Software Engineering Principles.',
  'The central execution handler and protocol controller.',
  'Bypassing standard security checks and protocols in Software Engineering Principles.',
  'Hardcoding static binary files without backup in Software Engineering Principles.',
  'B',
  'Option B is correct. The central execution handler and protocol controller.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000028000007',
  '00000000-0002-4000-a000-000000000028',
  7,
  'Q7. What is a common bottleneck or challenge in Software Engineering Principles?',
  'Legacy manual processing for Software Engineering Principles.',
  'Managing system state synchronization and resource contention under heavy load.',
  'Bypassing standard security checks and protocols in Software Engineering Principles.',
  'Hardcoding static binary files without backup in Software Engineering Principles.',
  'B',
  'Option B is correct. Managing system state synchronization and resource contention under heavy load.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000028000008',
  '00000000-0002-4000-a000-000000000028',
  8,
  'Q8. How is security typically enforced within Software Engineering Principles?',
  'Legacy manual processing for Software Engineering Principles.',
  'Through strong authentication, access control permissions, and data encryption.',
  'Bypassing standard security checks and protocols in Software Engineering Principles.',
  'Hardcoding static binary files without backup in Software Engineering Principles.',
  'B',
  'Option B is correct. Through strong authentication, access control permissions, and data encryption.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000028000009',
  '00000000-0002-4000-a000-000000000028',
  9,
  'Q9. Which metric is critical for measuring the performance of Software Engineering Principles?',
  'Bypassing standard security checks and protocols in Software Engineering Principles.',
  'Legacy manual processing for Software Engineering Principles.',
  'Response latency, throughput, resource utilization, and error rates.',
  'Hardcoding static binary files without backup in Software Engineering Principles.',
  'C',
  'Option C is correct. Response latency, throughput, resource utilization, and error rates.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000028000010',
  '00000000-0002-4000-a000-000000000028',
  10,
  'Q10. What is the role of versioning in Software Engineering Principles?',
  'Bypassing standard security checks and protocols in Software Engineering Principles.',
  'Legacy manual processing for Software Engineering Principles.',
  'To support safe updates, maintain backward compatibility, and enable rollbacks.',
  'Hardcoding static binary files without backup in Software Engineering Principles.',
  'C',
  'Option C is correct. To support safe updates, maintain backward compatibility, and enable rollbacks.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000028000011',
  '00000000-0002-4000-a000-000000000028',
  11,
  'Q11. In what scenario is Software Engineering Principles most effectively applied?',
  'Legacy manual processing for Software Engineering Principles.',
  'In modern scalable enterprise systems requiring structured workflows and reliability.',
  'Bypassing standard security checks and protocols in Software Engineering Principles.',
  'Hardcoding static binary files without backup in Software Engineering Principles.',
  'B',
  'Option B is correct. In modern scalable enterprise systems requiring structured workflows and reliability.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000028000012',
  '00000000-0002-4000-a000-000000000028',
  12,
  'Q12. Which tool or interface is standard for interacting with Software Engineering Principles?',
  'Legacy manual processing for Software Engineering Principles.',
  'Dedicated command line tools, SDK APIs, and management dashboards.',
  'Bypassing standard security checks and protocols in Software Engineering Principles.',
  'Hardcoding static binary files without backup in Software Engineering Principles.',
  'B',
  'Option B is correct. Dedicated command line tools, SDK APIs, and management dashboards.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000028000013',
  '00000000-0002-4000-a000-000000000028',
  13,
  'Q13. What is the initial phase when developing with Software Engineering Principles?',
  'Legacy manual processing for Software Engineering Principles.',
  'Defining requirements, setting up the development environment, and configuring dependencies.',
  'Bypassing standard security checks and protocols in Software Engineering Principles.',
  'Hardcoding static binary files without backup in Software Engineering Principles.',
  'B',
  'Option B is correct. Defining requirements, setting up the development environment, and configuring dependencies.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000028000014',
  '00000000-0002-4000-a000-000000000028',
  14,
  'Q14. Which debugging technique is recommended for Software Engineering Principles?',
  'Legacy manual processing for Software Engineering Principles.',
  'Inspecting log trace files, using debugger tools, and verifying stack traces.',
  'Bypassing standard security checks and protocols in Software Engineering Principles.',
  'Hardcoding static binary files without backup in Software Engineering Principles.',
  'B',
  'Option B is correct. Inspecting log trace files, using debugger tools, and verifying stack traces.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000028000015',
  '00000000-0002-4000-a000-000000000028',
  15,
  'Q15. What is the overall goal of mastering Software Engineering Principles?',
  'Hardcoding static binary files without backup in Software Engineering Principles.',
  'Legacy manual processing for Software Engineering Principles.',
  'Bypassing standard security checks and protocols in Software Engineering Principles.',
  'To design, build, and maintain production-ready technology solutions.',
  'D',
  'Option D is correct. To design, build, and maintain production-ready technology solutions.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000028000016',
  '00000000-0002-4000-a000-000000000028',
  16,
  'Q16. What is the primary definition of Software Engineering Principles?',
  'Legacy manual processing for Software Engineering Principles.',
  'A core technology or standard designed for managing and executing Software Engineering Principles processes.',
  'Bypassing standard security checks and protocols in Software Engineering Principles.',
  'Hardcoding static binary files without backup in Software Engineering Principles.',
  'B',
  'Option B is correct. A core technology or standard designed for managing and executing Software Engineering Principles processes.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000028000017',
  '00000000-0002-4000-a000-000000000028',
  17,
  'Q17. Which key benefit is provided by Software Engineering Principles?',
  'Improved efficiency, scalability, modularity, and operational reliability.',
  'Legacy manual processing for Software Engineering Principles.',
  'Bypassing standard security checks and protocols in Software Engineering Principles.',
  'Hardcoding static binary files without backup in Software Engineering Principles.',
  'A',
  'Option A is correct. Improved efficiency, scalability, modularity, and operational reliability.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000028000018',
  '00000000-0002-4000-a000-000000000028',
  18,
  'Q18. What is a fundamental requirement when implementing Software Engineering Principles?',
  'Bypassing standard security checks and protocols in Software Engineering Principles.',
  'Legacy manual processing for Software Engineering Principles.',
  'Proper system configuration, security protocols, and integration standards.',
  'Hardcoding static binary files without backup in Software Engineering Principles.',
  'C',
  'Option C is correct. Proper system configuration, security protocols, and integration standards.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000028000019',
  '00000000-0002-4000-a000-000000000028',
  19,
  'Q19. How does Software Engineering Principles handle data and execution states?',
  'Legacy manual processing for Software Engineering Principles.',
  'By utilizing structured schemas, indexes, and optimized execution pipelines.',
  'Bypassing standard security checks and protocols in Software Engineering Principles.',
  'Hardcoding static binary files without backup in Software Engineering Principles.',
  'B',
  'Option B is correct. By utilizing structured schemas, indexes, and optimized execution pipelines.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000028000020',
  '00000000-0002-4000-a000-000000000028',
  20,
  'Q20. What is a recommended best practice when deploying Software Engineering Principles?',
  'Legacy manual processing for Software Engineering Principles.',
  'Conducting regular automated testing, logging, and monitoring checks.',
  'Bypassing standard security checks and protocols in Software Engineering Principles.',
  'Hardcoding static binary files without backup in Software Engineering Principles.',
  'B',
  'Option B is correct. Conducting regular automated testing, logging, and monitoring checks.'
);

-- Explore Quiz 29: Microservices Architecture Mastery Quiz
INSERT INTO public.explore_quizzes (id, title, description, category, branch, difficulty, question_count, estimated_minutes, fx_reward, is_daily, is_published)
VALUES (
  '00000000-0002-4000-a000-000000000029',
  'Microservices Architecture Challenge Quiz',
  'Test your knowledge on Microservices Architecture with 20 comprehensive questions.',
  'Backend',
  'CSE',
  'Advanced',
  20,
  8,
  15,
  FALSE,
  TRUE
);

INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000029000001',
  '00000000-0002-4000-a000-000000000029',
  1,
  'Q1. What is the primary definition of Microservices Architecture?',
  'Legacy manual processing for Microservices Architecture.',
  'A core technology or standard designed for managing and executing Microservices Architecture processes.',
  'Bypassing standard security checks and protocols in Microservices Architecture.',
  'Hardcoding static binary files without backup in Microservices Architecture.',
  'B',
  'Option B is correct. A core technology or standard designed for managing and executing Microservices Architecture processes.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000029000002',
  '00000000-0002-4000-a000-000000000029',
  2,
  'Q2. Which key benefit is provided by Microservices Architecture?',
  'Bypassing standard security checks and protocols in Microservices Architecture.',
  'Legacy manual processing for Microservices Architecture.',
  'Improved efficiency, scalability, modularity, and operational reliability.',
  'Hardcoding static binary files without backup in Microservices Architecture.',
  'C',
  'Option C is correct. Improved efficiency, scalability, modularity, and operational reliability.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000029000003',
  '00000000-0002-4000-a000-000000000029',
  3,
  'Q3. What is a fundamental requirement when implementing Microservices Architecture?',
  'Hardcoding static binary files without backup in Microservices Architecture.',
  'Legacy manual processing for Microservices Architecture.',
  'Bypassing standard security checks and protocols in Microservices Architecture.',
  'Proper system configuration, security protocols, and integration standards.',
  'D',
  'Option D is correct. Proper system configuration, security protocols, and integration standards.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000029000004',
  '00000000-0002-4000-a000-000000000029',
  4,
  'Q4. How does Microservices Architecture handle data and execution states?',
  'Legacy manual processing for Microservices Architecture.',
  'By utilizing structured schemas, indexes, and optimized execution pipelines.',
  'Bypassing standard security checks and protocols in Microservices Architecture.',
  'Hardcoding static binary files without backup in Microservices Architecture.',
  'B',
  'Option B is correct. By utilizing structured schemas, indexes, and optimized execution pipelines.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000029000005',
  '00000000-0002-4000-a000-000000000029',
  5,
  'Q5. What is a recommended best practice when deploying Microservices Architecture?',
  'Legacy manual processing for Microservices Architecture.',
  'Conducting regular automated testing, logging, and monitoring checks.',
  'Bypassing standard security checks and protocols in Microservices Architecture.',
  'Hardcoding static binary files without backup in Microservices Architecture.',
  'B',
  'Option B is correct. Conducting regular automated testing, logging, and monitoring checks.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000029000006',
  '00000000-0002-4000-a000-000000000029',
  6,
  'Q6. Which layer or component plays a vital role in Microservices Architecture?',
  'The central execution handler and protocol controller.',
  'Legacy manual processing for Microservices Architecture.',
  'Bypassing standard security checks and protocols in Microservices Architecture.',
  'Hardcoding static binary files without backup in Microservices Architecture.',
  'A',
  'Option A is correct. The central execution handler and protocol controller.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000029000007',
  '00000000-0002-4000-a000-000000000029',
  7,
  'Q7. What is a common bottleneck or challenge in Microservices Architecture?',
  'Hardcoding static binary files without backup in Microservices Architecture.',
  'Legacy manual processing for Microservices Architecture.',
  'Bypassing standard security checks and protocols in Microservices Architecture.',
  'Managing system state synchronization and resource contention under heavy load.',
  'D',
  'Option D is correct. Managing system state synchronization and resource contention under heavy load.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000029000008',
  '00000000-0002-4000-a000-000000000029',
  8,
  'Q8. How is security typically enforced within Microservices Architecture?',
  'Bypassing standard security checks and protocols in Microservices Architecture.',
  'Legacy manual processing for Microservices Architecture.',
  'Through strong authentication, access control permissions, and data encryption.',
  'Hardcoding static binary files without backup in Microservices Architecture.',
  'C',
  'Option C is correct. Through strong authentication, access control permissions, and data encryption.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000029000009',
  '00000000-0002-4000-a000-000000000029',
  9,
  'Q9. Which metric is critical for measuring the performance of Microservices Architecture?',
  'Legacy manual processing for Microservices Architecture.',
  'Response latency, throughput, resource utilization, and error rates.',
  'Bypassing standard security checks and protocols in Microservices Architecture.',
  'Hardcoding static binary files without backup in Microservices Architecture.',
  'B',
  'Option B is correct. Response latency, throughput, resource utilization, and error rates.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000029000010',
  '00000000-0002-4000-a000-000000000029',
  10,
  'Q10. What is the role of versioning in Microservices Architecture?',
  'Legacy manual processing for Microservices Architecture.',
  'To support safe updates, maintain backward compatibility, and enable rollbacks.',
  'Bypassing standard security checks and protocols in Microservices Architecture.',
  'Hardcoding static binary files without backup in Microservices Architecture.',
  'B',
  'Option B is correct. To support safe updates, maintain backward compatibility, and enable rollbacks.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000029000011',
  '00000000-0002-4000-a000-000000000029',
  11,
  'Q11. In what scenario is Microservices Architecture most effectively applied?',
  'Bypassing standard security checks and protocols in Microservices Architecture.',
  'Legacy manual processing for Microservices Architecture.',
  'In modern scalable enterprise systems requiring structured workflows and reliability.',
  'Hardcoding static binary files without backup in Microservices Architecture.',
  'C',
  'Option C is correct. In modern scalable enterprise systems requiring structured workflows and reliability.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000029000012',
  '00000000-0002-4000-a000-000000000029',
  12,
  'Q12. Which tool or interface is standard for interacting with Microservices Architecture?',
  'Bypassing standard security checks and protocols in Microservices Architecture.',
  'Legacy manual processing for Microservices Architecture.',
  'Dedicated command line tools, SDK APIs, and management dashboards.',
  'Hardcoding static binary files without backup in Microservices Architecture.',
  'C',
  'Option C is correct. Dedicated command line tools, SDK APIs, and management dashboards.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000029000013',
  '00000000-0002-4000-a000-000000000029',
  13,
  'Q13. What is the initial phase when developing with Microservices Architecture?',
  'Bypassing standard security checks and protocols in Microservices Architecture.',
  'Legacy manual processing for Microservices Architecture.',
  'Defining requirements, setting up the development environment, and configuring dependencies.',
  'Hardcoding static binary files without backup in Microservices Architecture.',
  'C',
  'Option C is correct. Defining requirements, setting up the development environment, and configuring dependencies.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000029000014',
  '00000000-0002-4000-a000-000000000029',
  14,
  'Q14. Which debugging technique is recommended for Microservices Architecture?',
  'Bypassing standard security checks and protocols in Microservices Architecture.',
  'Legacy manual processing for Microservices Architecture.',
  'Inspecting log trace files, using debugger tools, and verifying stack traces.',
  'Hardcoding static binary files without backup in Microservices Architecture.',
  'C',
  'Option C is correct. Inspecting log trace files, using debugger tools, and verifying stack traces.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000029000015',
  '00000000-0002-4000-a000-000000000029',
  15,
  'Q15. What is the overall goal of mastering Microservices Architecture?',
  'Hardcoding static binary files without backup in Microservices Architecture.',
  'Legacy manual processing for Microservices Architecture.',
  'Bypassing standard security checks and protocols in Microservices Architecture.',
  'To design, build, and maintain production-ready technology solutions.',
  'D',
  'Option D is correct. To design, build, and maintain production-ready technology solutions.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000029000016',
  '00000000-0002-4000-a000-000000000029',
  16,
  'Q16. What is the primary definition of Microservices Architecture?',
  'Legacy manual processing for Microservices Architecture.',
  'A core technology or standard designed for managing and executing Microservices Architecture processes.',
  'Bypassing standard security checks and protocols in Microservices Architecture.',
  'Hardcoding static binary files without backup in Microservices Architecture.',
  'B',
  'Option B is correct. A core technology or standard designed for managing and executing Microservices Architecture processes.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000029000017',
  '00000000-0002-4000-a000-000000000029',
  17,
  'Q17. Which key benefit is provided by Microservices Architecture?',
  'Bypassing standard security checks and protocols in Microservices Architecture.',
  'Legacy manual processing for Microservices Architecture.',
  'Improved efficiency, scalability, modularity, and operational reliability.',
  'Hardcoding static binary files without backup in Microservices Architecture.',
  'C',
  'Option C is correct. Improved efficiency, scalability, modularity, and operational reliability.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000029000018',
  '00000000-0002-4000-a000-000000000029',
  18,
  'Q18. What is a fundamental requirement when implementing Microservices Architecture?',
  'Legacy manual processing for Microservices Architecture.',
  'Proper system configuration, security protocols, and integration standards.',
  'Bypassing standard security checks and protocols in Microservices Architecture.',
  'Hardcoding static binary files without backup in Microservices Architecture.',
  'B',
  'Option B is correct. Proper system configuration, security protocols, and integration standards.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000029000019',
  '00000000-0002-4000-a000-000000000029',
  19,
  'Q19. How does Microservices Architecture handle data and execution states?',
  'Bypassing standard security checks and protocols in Microservices Architecture.',
  'Legacy manual processing for Microservices Architecture.',
  'By utilizing structured schemas, indexes, and optimized execution pipelines.',
  'Hardcoding static binary files without backup in Microservices Architecture.',
  'C',
  'Option C is correct. By utilizing structured schemas, indexes, and optimized execution pipelines.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000029000020',
  '00000000-0002-4000-a000-000000000029',
  20,
  'Q20. What is a recommended best practice when deploying Microservices Architecture?',
  'Bypassing standard security checks and protocols in Microservices Architecture.',
  'Legacy manual processing for Microservices Architecture.',
  'Conducting regular automated testing, logging, and monitoring checks.',
  'Hardcoding static binary files without backup in Microservices Architecture.',
  'C',
  'Option C is correct. Conducting regular automated testing, logging, and monitoring checks.'
);

-- Explore Quiz 30: GraphQL vs REST Mastery Quiz
INSERT INTO public.explore_quizzes (id, title, description, category, branch, difficulty, question_count, estimated_minutes, fx_reward, is_daily, is_published)
VALUES (
  '00000000-0002-4000-a000-000000000030',
  'GraphQL vs REST Challenge Quiz',
  'Test your knowledge on GraphQL vs REST with 20 comprehensive questions.',
  'Backend',
  'CSE',
  'Intermediate',
  20,
  8,
  15,
  FALSE,
  TRUE
);

INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000030000001',
  '00000000-0002-4000-a000-000000000030',
  1,
  'Q1. What is the primary definition of GraphQL vs REST?',
  'A core technology or standard designed for managing and executing GraphQL vs REST processes.',
  'Legacy manual processing for GraphQL vs REST.',
  'Bypassing standard security checks and protocols in GraphQL vs REST.',
  'Hardcoding static binary files without backup in GraphQL vs REST.',
  'A',
  'Option A is correct. A core technology or standard designed for managing and executing GraphQL vs REST processes.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000030000002',
  '00000000-0002-4000-a000-000000000030',
  2,
  'Q2. Which key benefit is provided by GraphQL vs REST?',
  'Legacy manual processing for GraphQL vs REST.',
  'Improved efficiency, scalability, modularity, and operational reliability.',
  'Bypassing standard security checks and protocols in GraphQL vs REST.',
  'Hardcoding static binary files without backup in GraphQL vs REST.',
  'B',
  'Option B is correct. Improved efficiency, scalability, modularity, and operational reliability.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000030000003',
  '00000000-0002-4000-a000-000000000030',
  3,
  'Q3. What is a fundamental requirement when implementing GraphQL vs REST?',
  'Legacy manual processing for GraphQL vs REST.',
  'Proper system configuration, security protocols, and integration standards.',
  'Bypassing standard security checks and protocols in GraphQL vs REST.',
  'Hardcoding static binary files without backup in GraphQL vs REST.',
  'B',
  'Option B is correct. Proper system configuration, security protocols, and integration standards.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000030000004',
  '00000000-0002-4000-a000-000000000030',
  4,
  'Q4. How does GraphQL vs REST handle data and execution states?',
  'By utilizing structured schemas, indexes, and optimized execution pipelines.',
  'Legacy manual processing for GraphQL vs REST.',
  'Bypassing standard security checks and protocols in GraphQL vs REST.',
  'Hardcoding static binary files without backup in GraphQL vs REST.',
  'A',
  'Option A is correct. By utilizing structured schemas, indexes, and optimized execution pipelines.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000030000005',
  '00000000-0002-4000-a000-000000000030',
  5,
  'Q5. What is a recommended best practice when deploying GraphQL vs REST?',
  'Hardcoding static binary files without backup in GraphQL vs REST.',
  'Legacy manual processing for GraphQL vs REST.',
  'Bypassing standard security checks and protocols in GraphQL vs REST.',
  'Conducting regular automated testing, logging, and monitoring checks.',
  'D',
  'Option D is correct. Conducting regular automated testing, logging, and monitoring checks.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000030000006',
  '00000000-0002-4000-a000-000000000030',
  6,
  'Q6. Which layer or component plays a vital role in GraphQL vs REST?',
  'Legacy manual processing for GraphQL vs REST.',
  'The central execution handler and protocol controller.',
  'Bypassing standard security checks and protocols in GraphQL vs REST.',
  'Hardcoding static binary files without backup in GraphQL vs REST.',
  'B',
  'Option B is correct. The central execution handler and protocol controller.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000030000007',
  '00000000-0002-4000-a000-000000000030',
  7,
  'Q7. What is a common bottleneck or challenge in GraphQL vs REST?',
  'Managing system state synchronization and resource contention under heavy load.',
  'Legacy manual processing for GraphQL vs REST.',
  'Bypassing standard security checks and protocols in GraphQL vs REST.',
  'Hardcoding static binary files without backup in GraphQL vs REST.',
  'A',
  'Option A is correct. Managing system state synchronization and resource contention under heavy load.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000030000008',
  '00000000-0002-4000-a000-000000000030',
  8,
  'Q8. How is security typically enforced within GraphQL vs REST?',
  'Hardcoding static binary files without backup in GraphQL vs REST.',
  'Legacy manual processing for GraphQL vs REST.',
  'Bypassing standard security checks and protocols in GraphQL vs REST.',
  'Through strong authentication, access control permissions, and data encryption.',
  'D',
  'Option D is correct. Through strong authentication, access control permissions, and data encryption.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000030000009',
  '00000000-0002-4000-a000-000000000030',
  9,
  'Q9. Which metric is critical for measuring the performance of GraphQL vs REST?',
  'Response latency, throughput, resource utilization, and error rates.',
  'Legacy manual processing for GraphQL vs REST.',
  'Bypassing standard security checks and protocols in GraphQL vs REST.',
  'Hardcoding static binary files without backup in GraphQL vs REST.',
  'A',
  'Option A is correct. Response latency, throughput, resource utilization, and error rates.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000030000010',
  '00000000-0002-4000-a000-000000000030',
  10,
  'Q10. What is the role of versioning in GraphQL vs REST?',
  'Legacy manual processing for GraphQL vs REST.',
  'To support safe updates, maintain backward compatibility, and enable rollbacks.',
  'Bypassing standard security checks and protocols in GraphQL vs REST.',
  'Hardcoding static binary files without backup in GraphQL vs REST.',
  'B',
  'Option B is correct. To support safe updates, maintain backward compatibility, and enable rollbacks.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000030000011',
  '00000000-0002-4000-a000-000000000030',
  11,
  'Q11. In what scenario is GraphQL vs REST most effectively applied?',
  'In modern scalable enterprise systems requiring structured workflows and reliability.',
  'Legacy manual processing for GraphQL vs REST.',
  'Bypassing standard security checks and protocols in GraphQL vs REST.',
  'Hardcoding static binary files without backup in GraphQL vs REST.',
  'A',
  'Option A is correct. In modern scalable enterprise systems requiring structured workflows and reliability.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000030000012',
  '00000000-0002-4000-a000-000000000030',
  12,
  'Q12. Which tool or interface is standard for interacting with GraphQL vs REST?',
  'Legacy manual processing for GraphQL vs REST.',
  'Dedicated command line tools, SDK APIs, and management dashboards.',
  'Bypassing standard security checks and protocols in GraphQL vs REST.',
  'Hardcoding static binary files without backup in GraphQL vs REST.',
  'B',
  'Option B is correct. Dedicated command line tools, SDK APIs, and management dashboards.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000030000013',
  '00000000-0002-4000-a000-000000000030',
  13,
  'Q13. What is the initial phase when developing with GraphQL vs REST?',
  'Bypassing standard security checks and protocols in GraphQL vs REST.',
  'Legacy manual processing for GraphQL vs REST.',
  'Defining requirements, setting up the development environment, and configuring dependencies.',
  'Hardcoding static binary files without backup in GraphQL vs REST.',
  'C',
  'Option C is correct. Defining requirements, setting up the development environment, and configuring dependencies.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000030000014',
  '00000000-0002-4000-a000-000000000030',
  14,
  'Q14. Which debugging technique is recommended for GraphQL vs REST?',
  'Legacy manual processing for GraphQL vs REST.',
  'Inspecting log trace files, using debugger tools, and verifying stack traces.',
  'Bypassing standard security checks and protocols in GraphQL vs REST.',
  'Hardcoding static binary files without backup in GraphQL vs REST.',
  'B',
  'Option B is correct. Inspecting log trace files, using debugger tools, and verifying stack traces.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000030000015',
  '00000000-0002-4000-a000-000000000030',
  15,
  'Q15. What is the overall goal of mastering GraphQL vs REST?',
  'To design, build, and maintain production-ready technology solutions.',
  'Legacy manual processing for GraphQL vs REST.',
  'Bypassing standard security checks and protocols in GraphQL vs REST.',
  'Hardcoding static binary files without backup in GraphQL vs REST.',
  'A',
  'Option A is correct. To design, build, and maintain production-ready technology solutions.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000030000016',
  '00000000-0002-4000-a000-000000000030',
  16,
  'Q16. What is the primary definition of GraphQL vs REST?',
  'A core technology or standard designed for managing and executing GraphQL vs REST processes.',
  'Legacy manual processing for GraphQL vs REST.',
  'Bypassing standard security checks and protocols in GraphQL vs REST.',
  'Hardcoding static binary files without backup in GraphQL vs REST.',
  'A',
  'Option A is correct. A core technology or standard designed for managing and executing GraphQL vs REST processes.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000030000017',
  '00000000-0002-4000-a000-000000000030',
  17,
  'Q17. Which key benefit is provided by GraphQL vs REST?',
  'Hardcoding static binary files without backup in GraphQL vs REST.',
  'Legacy manual processing for GraphQL vs REST.',
  'Bypassing standard security checks and protocols in GraphQL vs REST.',
  'Improved efficiency, scalability, modularity, and operational reliability.',
  'D',
  'Option D is correct. Improved efficiency, scalability, modularity, and operational reliability.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000030000018',
  '00000000-0002-4000-a000-000000000030',
  18,
  'Q18. What is a fundamental requirement when implementing GraphQL vs REST?',
  'Legacy manual processing for GraphQL vs REST.',
  'Proper system configuration, security protocols, and integration standards.',
  'Bypassing standard security checks and protocols in GraphQL vs REST.',
  'Hardcoding static binary files without backup in GraphQL vs REST.',
  'B',
  'Option B is correct. Proper system configuration, security protocols, and integration standards.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000030000019',
  '00000000-0002-4000-a000-000000000030',
  19,
  'Q19. How does GraphQL vs REST handle data and execution states?',
  'By utilizing structured schemas, indexes, and optimized execution pipelines.',
  'Legacy manual processing for GraphQL vs REST.',
  'Bypassing standard security checks and protocols in GraphQL vs REST.',
  'Hardcoding static binary files without backup in GraphQL vs REST.',
  'A',
  'Option A is correct. By utilizing structured schemas, indexes, and optimized execution pipelines.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000030000020',
  '00000000-0002-4000-a000-000000000030',
  20,
  'Q20. What is a recommended best practice when deploying GraphQL vs REST?',
  'Legacy manual processing for GraphQL vs REST.',
  'Conducting regular automated testing, logging, and monitoring checks.',
  'Bypassing standard security checks and protocols in GraphQL vs REST.',
  'Hardcoding static binary files without backup in GraphQL vs REST.',
  'B',
  'Option B is correct. Conducting regular automated testing, logging, and monitoring checks.'
);

-- Explore Quiz 31: System Design Basics Mastery Quiz
INSERT INTO public.explore_quizzes (id, title, description, category, branch, difficulty, question_count, estimated_minutes, fx_reward, is_daily, is_published)
VALUES (
  '00000000-0002-4000-a000-000000000031',
  'System Design Basics Challenge Quiz',
  'Test your knowledge on System Design Basics with 20 comprehensive questions.',
  'Architecture',
  'CSE',
  'Advanced',
  20,
  8,
  15,
  FALSE,
  TRUE
);

INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000031000001',
  '00000000-0002-4000-a000-000000000031',
  1,
  'Q1. What is the primary definition of System Design Basics?',
  'Bypassing standard security checks and protocols in System Design Basics.',
  'Legacy manual processing for System Design Basics.',
  'A core technology or standard designed for managing and executing System Design Basics processes.',
  'Hardcoding static binary files without backup in System Design Basics.',
  'C',
  'Option C is correct. A core technology or standard designed for managing and executing System Design Basics processes.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000031000002',
  '00000000-0002-4000-a000-000000000031',
  2,
  'Q2. Which key benefit is provided by System Design Basics?',
  'Bypassing standard security checks and protocols in System Design Basics.',
  'Legacy manual processing for System Design Basics.',
  'Improved efficiency, scalability, modularity, and operational reliability.',
  'Hardcoding static binary files without backup in System Design Basics.',
  'C',
  'Option C is correct. Improved efficiency, scalability, modularity, and operational reliability.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000031000003',
  '00000000-0002-4000-a000-000000000031',
  3,
  'Q3. What is a fundamental requirement when implementing System Design Basics?',
  'Hardcoding static binary files without backup in System Design Basics.',
  'Legacy manual processing for System Design Basics.',
  'Bypassing standard security checks and protocols in System Design Basics.',
  'Proper system configuration, security protocols, and integration standards.',
  'D',
  'Option D is correct. Proper system configuration, security protocols, and integration standards.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000031000004',
  '00000000-0002-4000-a000-000000000031',
  4,
  'Q4. How does System Design Basics handle data and execution states?',
  'Legacy manual processing for System Design Basics.',
  'By utilizing structured schemas, indexes, and optimized execution pipelines.',
  'Bypassing standard security checks and protocols in System Design Basics.',
  'Hardcoding static binary files without backup in System Design Basics.',
  'B',
  'Option B is correct. By utilizing structured schemas, indexes, and optimized execution pipelines.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000031000005',
  '00000000-0002-4000-a000-000000000031',
  5,
  'Q5. What is a recommended best practice when deploying System Design Basics?',
  'Bypassing standard security checks and protocols in System Design Basics.',
  'Legacy manual processing for System Design Basics.',
  'Conducting regular automated testing, logging, and monitoring checks.',
  'Hardcoding static binary files without backup in System Design Basics.',
  'C',
  'Option C is correct. Conducting regular automated testing, logging, and monitoring checks.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000031000006',
  '00000000-0002-4000-a000-000000000031',
  6,
  'Q6. Which layer or component plays a vital role in System Design Basics?',
  'Bypassing standard security checks and protocols in System Design Basics.',
  'Legacy manual processing for System Design Basics.',
  'The central execution handler and protocol controller.',
  'Hardcoding static binary files without backup in System Design Basics.',
  'C',
  'Option C is correct. The central execution handler and protocol controller.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000031000007',
  '00000000-0002-4000-a000-000000000031',
  7,
  'Q7. What is a common bottleneck or challenge in System Design Basics?',
  'Bypassing standard security checks and protocols in System Design Basics.',
  'Legacy manual processing for System Design Basics.',
  'Managing system state synchronization and resource contention under heavy load.',
  'Hardcoding static binary files without backup in System Design Basics.',
  'C',
  'Option C is correct. Managing system state synchronization and resource contention under heavy load.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000031000008',
  '00000000-0002-4000-a000-000000000031',
  8,
  'Q8. How is security typically enforced within System Design Basics?',
  'Hardcoding static binary files without backup in System Design Basics.',
  'Legacy manual processing for System Design Basics.',
  'Bypassing standard security checks and protocols in System Design Basics.',
  'Through strong authentication, access control permissions, and data encryption.',
  'D',
  'Option D is correct. Through strong authentication, access control permissions, and data encryption.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000031000009',
  '00000000-0002-4000-a000-000000000031',
  9,
  'Q9. Which metric is critical for measuring the performance of System Design Basics?',
  'Bypassing standard security checks and protocols in System Design Basics.',
  'Legacy manual processing for System Design Basics.',
  'Response latency, throughput, resource utilization, and error rates.',
  'Hardcoding static binary files without backup in System Design Basics.',
  'C',
  'Option C is correct. Response latency, throughput, resource utilization, and error rates.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000031000010',
  '00000000-0002-4000-a000-000000000031',
  10,
  'Q10. What is the role of versioning in System Design Basics?',
  'Hardcoding static binary files without backup in System Design Basics.',
  'Legacy manual processing for System Design Basics.',
  'Bypassing standard security checks and protocols in System Design Basics.',
  'To support safe updates, maintain backward compatibility, and enable rollbacks.',
  'D',
  'Option D is correct. To support safe updates, maintain backward compatibility, and enable rollbacks.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000031000011',
  '00000000-0002-4000-a000-000000000031',
  11,
  'Q11. In what scenario is System Design Basics most effectively applied?',
  'Legacy manual processing for System Design Basics.',
  'In modern scalable enterprise systems requiring structured workflows and reliability.',
  'Bypassing standard security checks and protocols in System Design Basics.',
  'Hardcoding static binary files without backup in System Design Basics.',
  'B',
  'Option B is correct. In modern scalable enterprise systems requiring structured workflows and reliability.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000031000012',
  '00000000-0002-4000-a000-000000000031',
  12,
  'Q12. Which tool or interface is standard for interacting with System Design Basics?',
  'Dedicated command line tools, SDK APIs, and management dashboards.',
  'Legacy manual processing for System Design Basics.',
  'Bypassing standard security checks and protocols in System Design Basics.',
  'Hardcoding static binary files without backup in System Design Basics.',
  'A',
  'Option A is correct. Dedicated command line tools, SDK APIs, and management dashboards.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000031000013',
  '00000000-0002-4000-a000-000000000031',
  13,
  'Q13. What is the initial phase when developing with System Design Basics?',
  'Bypassing standard security checks and protocols in System Design Basics.',
  'Legacy manual processing for System Design Basics.',
  'Defining requirements, setting up the development environment, and configuring dependencies.',
  'Hardcoding static binary files without backup in System Design Basics.',
  'C',
  'Option C is correct. Defining requirements, setting up the development environment, and configuring dependencies.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000031000014',
  '00000000-0002-4000-a000-000000000031',
  14,
  'Q14. Which debugging technique is recommended for System Design Basics?',
  'Hardcoding static binary files without backup in System Design Basics.',
  'Legacy manual processing for System Design Basics.',
  'Bypassing standard security checks and protocols in System Design Basics.',
  'Inspecting log trace files, using debugger tools, and verifying stack traces.',
  'D',
  'Option D is correct. Inspecting log trace files, using debugger tools, and verifying stack traces.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000031000015',
  '00000000-0002-4000-a000-000000000031',
  15,
  'Q15. What is the overall goal of mastering System Design Basics?',
  'Bypassing standard security checks and protocols in System Design Basics.',
  'Legacy manual processing for System Design Basics.',
  'To design, build, and maintain production-ready technology solutions.',
  'Hardcoding static binary files without backup in System Design Basics.',
  'C',
  'Option C is correct. To design, build, and maintain production-ready technology solutions.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000031000016',
  '00000000-0002-4000-a000-000000000031',
  16,
  'Q16. What is the primary definition of System Design Basics?',
  'Legacy manual processing for System Design Basics.',
  'A core technology or standard designed for managing and executing System Design Basics processes.',
  'Bypassing standard security checks and protocols in System Design Basics.',
  'Hardcoding static binary files without backup in System Design Basics.',
  'B',
  'Option B is correct. A core technology or standard designed for managing and executing System Design Basics processes.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000031000017',
  '00000000-0002-4000-a000-000000000031',
  17,
  'Q17. Which key benefit is provided by System Design Basics?',
  'Bypassing standard security checks and protocols in System Design Basics.',
  'Legacy manual processing for System Design Basics.',
  'Improved efficiency, scalability, modularity, and operational reliability.',
  'Hardcoding static binary files without backup in System Design Basics.',
  'C',
  'Option C is correct. Improved efficiency, scalability, modularity, and operational reliability.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000031000018',
  '00000000-0002-4000-a000-000000000031',
  18,
  'Q18. What is a fundamental requirement when implementing System Design Basics?',
  'Hardcoding static binary files without backup in System Design Basics.',
  'Legacy manual processing for System Design Basics.',
  'Bypassing standard security checks and protocols in System Design Basics.',
  'Proper system configuration, security protocols, and integration standards.',
  'D',
  'Option D is correct. Proper system configuration, security protocols, and integration standards.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000031000019',
  '00000000-0002-4000-a000-000000000031',
  19,
  'Q19. How does System Design Basics handle data and execution states?',
  'By utilizing structured schemas, indexes, and optimized execution pipelines.',
  'Legacy manual processing for System Design Basics.',
  'Bypassing standard security checks and protocols in System Design Basics.',
  'Hardcoding static binary files without backup in System Design Basics.',
  'A',
  'Option A is correct. By utilizing structured schemas, indexes, and optimized execution pipelines.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000031000020',
  '00000000-0002-4000-a000-000000000031',
  20,
  'Q20. What is a recommended best practice when deploying System Design Basics?',
  'Conducting regular automated testing, logging, and monitoring checks.',
  'Legacy manual processing for System Design Basics.',
  'Bypassing standard security checks and protocols in System Design Basics.',
  'Hardcoding static binary files without backup in System Design Basics.',
  'A',
  'Option A is correct. Conducting regular automated testing, logging, and monitoring checks.'
);

-- Explore Quiz 32: DevOps & CI/CD Pipelines Mastery Quiz
INSERT INTO public.explore_quizzes (id, title, description, category, branch, difficulty, question_count, estimated_minutes, fx_reward, is_daily, is_published)
VALUES (
  '00000000-0002-4000-a000-000000000032',
  'DevOps & CI/CD Pipelines Challenge Quiz',
  'Test your knowledge on DevOps & CI/CD Pipelines with 20 comprehensive questions.',
  'DevOps',
  'CSE',
  'Intermediate',
  20,
  8,
  15,
  FALSE,
  TRUE
);

INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000032000001',
  '00000000-0002-4000-a000-000000000032',
  1,
  'Q1. What is the primary definition of DevOps & CI/CD Pipelines?',
  'Bypassing standard security checks and protocols in DevOps & CI/CD Pipelines.',
  'Legacy manual processing for DevOps & CI/CD Pipelines.',
  'A core technology or standard designed for managing and executing DevOps & CI/CD Pipelines processes.',
  'Hardcoding static binary files without backup in DevOps & CI/CD Pipelines.',
  'C',
  'Option C is correct. A core technology or standard designed for managing and executing DevOps & CI/CD Pipelines processes.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000032000002',
  '00000000-0002-4000-a000-000000000032',
  2,
  'Q2. Which key benefit is provided by DevOps & CI/CD Pipelines?',
  'Hardcoding static binary files without backup in DevOps & CI/CD Pipelines.',
  'Legacy manual processing for DevOps & CI/CD Pipelines.',
  'Bypassing standard security checks and protocols in DevOps & CI/CD Pipelines.',
  'Improved efficiency, scalability, modularity, and operational reliability.',
  'D',
  'Option D is correct. Improved efficiency, scalability, modularity, and operational reliability.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000032000003',
  '00000000-0002-4000-a000-000000000032',
  3,
  'Q3. What is a fundamental requirement when implementing DevOps & CI/CD Pipelines?',
  'Proper system configuration, security protocols, and integration standards.',
  'Legacy manual processing for DevOps & CI/CD Pipelines.',
  'Bypassing standard security checks and protocols in DevOps & CI/CD Pipelines.',
  'Hardcoding static binary files without backup in DevOps & CI/CD Pipelines.',
  'A',
  'Option A is correct. Proper system configuration, security protocols, and integration standards.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000032000004',
  '00000000-0002-4000-a000-000000000032',
  4,
  'Q4. How does DevOps & CI/CD Pipelines handle data and execution states?',
  'By utilizing structured schemas, indexes, and optimized execution pipelines.',
  'Legacy manual processing for DevOps & CI/CD Pipelines.',
  'Bypassing standard security checks and protocols in DevOps & CI/CD Pipelines.',
  'Hardcoding static binary files without backup in DevOps & CI/CD Pipelines.',
  'A',
  'Option A is correct. By utilizing structured schemas, indexes, and optimized execution pipelines.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000032000005',
  '00000000-0002-4000-a000-000000000032',
  5,
  'Q5. What is a recommended best practice when deploying DevOps & CI/CD Pipelines?',
  'Bypassing standard security checks and protocols in DevOps & CI/CD Pipelines.',
  'Legacy manual processing for DevOps & CI/CD Pipelines.',
  'Conducting regular automated testing, logging, and monitoring checks.',
  'Hardcoding static binary files without backup in DevOps & CI/CD Pipelines.',
  'C',
  'Option C is correct. Conducting regular automated testing, logging, and monitoring checks.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000032000006',
  '00000000-0002-4000-a000-000000000032',
  6,
  'Q6. Which layer or component plays a vital role in DevOps & CI/CD Pipelines?',
  'Bypassing standard security checks and protocols in DevOps & CI/CD Pipelines.',
  'Legacy manual processing for DevOps & CI/CD Pipelines.',
  'The central execution handler and protocol controller.',
  'Hardcoding static binary files without backup in DevOps & CI/CD Pipelines.',
  'C',
  'Option C is correct. The central execution handler and protocol controller.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000032000007',
  '00000000-0002-4000-a000-000000000032',
  7,
  'Q7. What is a common bottleneck or challenge in DevOps & CI/CD Pipelines?',
  'Hardcoding static binary files without backup in DevOps & CI/CD Pipelines.',
  'Legacy manual processing for DevOps & CI/CD Pipelines.',
  'Bypassing standard security checks and protocols in DevOps & CI/CD Pipelines.',
  'Managing system state synchronization and resource contention under heavy load.',
  'D',
  'Option D is correct. Managing system state synchronization and resource contention under heavy load.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000032000008',
  '00000000-0002-4000-a000-000000000032',
  8,
  'Q8. How is security typically enforced within DevOps & CI/CD Pipelines?',
  'Through strong authentication, access control permissions, and data encryption.',
  'Legacy manual processing for DevOps & CI/CD Pipelines.',
  'Bypassing standard security checks and protocols in DevOps & CI/CD Pipelines.',
  'Hardcoding static binary files without backup in DevOps & CI/CD Pipelines.',
  'A',
  'Option A is correct. Through strong authentication, access control permissions, and data encryption.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000032000009',
  '00000000-0002-4000-a000-000000000032',
  9,
  'Q9. Which metric is critical for measuring the performance of DevOps & CI/CD Pipelines?',
  'Legacy manual processing for DevOps & CI/CD Pipelines.',
  'Response latency, throughput, resource utilization, and error rates.',
  'Bypassing standard security checks and protocols in DevOps & CI/CD Pipelines.',
  'Hardcoding static binary files without backup in DevOps & CI/CD Pipelines.',
  'B',
  'Option B is correct. Response latency, throughput, resource utilization, and error rates.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000032000010',
  '00000000-0002-4000-a000-000000000032',
  10,
  'Q10. What is the role of versioning in DevOps & CI/CD Pipelines?',
  'Bypassing standard security checks and protocols in DevOps & CI/CD Pipelines.',
  'Legacy manual processing for DevOps & CI/CD Pipelines.',
  'To support safe updates, maintain backward compatibility, and enable rollbacks.',
  'Hardcoding static binary files without backup in DevOps & CI/CD Pipelines.',
  'C',
  'Option C is correct. To support safe updates, maintain backward compatibility, and enable rollbacks.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000032000011',
  '00000000-0002-4000-a000-000000000032',
  11,
  'Q11. In what scenario is DevOps & CI/CD Pipelines most effectively applied?',
  'Hardcoding static binary files without backup in DevOps & CI/CD Pipelines.',
  'Legacy manual processing for DevOps & CI/CD Pipelines.',
  'Bypassing standard security checks and protocols in DevOps & CI/CD Pipelines.',
  'In modern scalable enterprise systems requiring structured workflows and reliability.',
  'D',
  'Option D is correct. In modern scalable enterprise systems requiring structured workflows and reliability.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000032000012',
  '00000000-0002-4000-a000-000000000032',
  12,
  'Q12. Which tool or interface is standard for interacting with DevOps & CI/CD Pipelines?',
  'Legacy manual processing for DevOps & CI/CD Pipelines.',
  'Dedicated command line tools, SDK APIs, and management dashboards.',
  'Bypassing standard security checks and protocols in DevOps & CI/CD Pipelines.',
  'Hardcoding static binary files without backup in DevOps & CI/CD Pipelines.',
  'B',
  'Option B is correct. Dedicated command line tools, SDK APIs, and management dashboards.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000032000013',
  '00000000-0002-4000-a000-000000000032',
  13,
  'Q13. What is the initial phase when developing with DevOps & CI/CD Pipelines?',
  'Legacy manual processing for DevOps & CI/CD Pipelines.',
  'Defining requirements, setting up the development environment, and configuring dependencies.',
  'Bypassing standard security checks and protocols in DevOps & CI/CD Pipelines.',
  'Hardcoding static binary files without backup in DevOps & CI/CD Pipelines.',
  'B',
  'Option B is correct. Defining requirements, setting up the development environment, and configuring dependencies.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000032000014',
  '00000000-0002-4000-a000-000000000032',
  14,
  'Q14. Which debugging technique is recommended for DevOps & CI/CD Pipelines?',
  'Bypassing standard security checks and protocols in DevOps & CI/CD Pipelines.',
  'Legacy manual processing for DevOps & CI/CD Pipelines.',
  'Inspecting log trace files, using debugger tools, and verifying stack traces.',
  'Hardcoding static binary files without backup in DevOps & CI/CD Pipelines.',
  'C',
  'Option C is correct. Inspecting log trace files, using debugger tools, and verifying stack traces.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000032000015',
  '00000000-0002-4000-a000-000000000032',
  15,
  'Q15. What is the overall goal of mastering DevOps & CI/CD Pipelines?',
  'Legacy manual processing for DevOps & CI/CD Pipelines.',
  'To design, build, and maintain production-ready technology solutions.',
  'Bypassing standard security checks and protocols in DevOps & CI/CD Pipelines.',
  'Hardcoding static binary files without backup in DevOps & CI/CD Pipelines.',
  'B',
  'Option B is correct. To design, build, and maintain production-ready technology solutions.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000032000016',
  '00000000-0002-4000-a000-000000000032',
  16,
  'Q16. What is the primary definition of DevOps & CI/CD Pipelines?',
  'A core technology or standard designed for managing and executing DevOps & CI/CD Pipelines processes.',
  'Legacy manual processing for DevOps & CI/CD Pipelines.',
  'Bypassing standard security checks and protocols in DevOps & CI/CD Pipelines.',
  'Hardcoding static binary files without backup in DevOps & CI/CD Pipelines.',
  'A',
  'Option A is correct. A core technology or standard designed for managing and executing DevOps & CI/CD Pipelines processes.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000032000017',
  '00000000-0002-4000-a000-000000000032',
  17,
  'Q17. Which key benefit is provided by DevOps & CI/CD Pipelines?',
  'Improved efficiency, scalability, modularity, and operational reliability.',
  'Legacy manual processing for DevOps & CI/CD Pipelines.',
  'Bypassing standard security checks and protocols in DevOps & CI/CD Pipelines.',
  'Hardcoding static binary files without backup in DevOps & CI/CD Pipelines.',
  'A',
  'Option A is correct. Improved efficiency, scalability, modularity, and operational reliability.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000032000018',
  '00000000-0002-4000-a000-000000000032',
  18,
  'Q18. What is a fundamental requirement when implementing DevOps & CI/CD Pipelines?',
  'Bypassing standard security checks and protocols in DevOps & CI/CD Pipelines.',
  'Legacy manual processing for DevOps & CI/CD Pipelines.',
  'Proper system configuration, security protocols, and integration standards.',
  'Hardcoding static binary files without backup in DevOps & CI/CD Pipelines.',
  'C',
  'Option C is correct. Proper system configuration, security protocols, and integration standards.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000032000019',
  '00000000-0002-4000-a000-000000000032',
  19,
  'Q19. How does DevOps & CI/CD Pipelines handle data and execution states?',
  'Bypassing standard security checks and protocols in DevOps & CI/CD Pipelines.',
  'Legacy manual processing for DevOps & CI/CD Pipelines.',
  'By utilizing structured schemas, indexes, and optimized execution pipelines.',
  'Hardcoding static binary files without backup in DevOps & CI/CD Pipelines.',
  'C',
  'Option C is correct. By utilizing structured schemas, indexes, and optimized execution pipelines.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000032000020',
  '00000000-0002-4000-a000-000000000032',
  20,
  'Q20. What is a recommended best practice when deploying DevOps & CI/CD Pipelines?',
  'Legacy manual processing for DevOps & CI/CD Pipelines.',
  'Conducting regular automated testing, logging, and monitoring checks.',
  'Bypassing standard security checks and protocols in DevOps & CI/CD Pipelines.',
  'Hardcoding static binary files without backup in DevOps & CI/CD Pipelines.',
  'B',
  'Option B is correct. Conducting regular automated testing, logging, and monitoring checks.'
);

-- Explore Quiz 33: Artificial Intelligence Basics Mastery Quiz
INSERT INTO public.explore_quizzes (id, title, description, category, branch, difficulty, question_count, estimated_minutes, fx_reward, is_daily, is_published)
VALUES (
  '00000000-0002-4000-a000-000000000033',
  'Artificial Intelligence Basics Challenge Quiz',
  'Test your knowledge on Artificial Intelligence Basics with 20 comprehensive questions.',
  'AI',
  'AI & ML',
  'Beginner',
  20,
  8,
  15,
  FALSE,
  TRUE
);

INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000033000001',
  '00000000-0002-4000-a000-000000000033',
  1,
  'Q1. What is the primary definition of Artificial Intelligence Basics?',
  'Bypassing standard security checks and protocols in Artificial Intelligence Basics.',
  'Legacy manual processing for Artificial Intelligence Basics.',
  'A core technology or standard designed for managing and executing Artificial Intelligence Basics processes.',
  'Hardcoding static binary files without backup in Artificial Intelligence Basics.',
  'C',
  'Option C is correct. A core technology or standard designed for managing and executing Artificial Intelligence Basics processes.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000033000002',
  '00000000-0002-4000-a000-000000000033',
  2,
  'Q2. Which key benefit is provided by Artificial Intelligence Basics?',
  'Hardcoding static binary files without backup in Artificial Intelligence Basics.',
  'Legacy manual processing for Artificial Intelligence Basics.',
  'Bypassing standard security checks and protocols in Artificial Intelligence Basics.',
  'Improved efficiency, scalability, modularity, and operational reliability.',
  'D',
  'Option D is correct. Improved efficiency, scalability, modularity, and operational reliability.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000033000003',
  '00000000-0002-4000-a000-000000000033',
  3,
  'Q3. What is a fundamental requirement when implementing Artificial Intelligence Basics?',
  'Bypassing standard security checks and protocols in Artificial Intelligence Basics.',
  'Legacy manual processing for Artificial Intelligence Basics.',
  'Proper system configuration, security protocols, and integration standards.',
  'Hardcoding static binary files without backup in Artificial Intelligence Basics.',
  'C',
  'Option C is correct. Proper system configuration, security protocols, and integration standards.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000033000004',
  '00000000-0002-4000-a000-000000000033',
  4,
  'Q4. How does Artificial Intelligence Basics handle data and execution states?',
  'By utilizing structured schemas, indexes, and optimized execution pipelines.',
  'Legacy manual processing for Artificial Intelligence Basics.',
  'Bypassing standard security checks and protocols in Artificial Intelligence Basics.',
  'Hardcoding static binary files without backup in Artificial Intelligence Basics.',
  'A',
  'Option A is correct. By utilizing structured schemas, indexes, and optimized execution pipelines.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000033000005',
  '00000000-0002-4000-a000-000000000033',
  5,
  'Q5. What is a recommended best practice when deploying Artificial Intelligence Basics?',
  'Bypassing standard security checks and protocols in Artificial Intelligence Basics.',
  'Legacy manual processing for Artificial Intelligence Basics.',
  'Conducting regular automated testing, logging, and monitoring checks.',
  'Hardcoding static binary files without backup in Artificial Intelligence Basics.',
  'C',
  'Option C is correct. Conducting regular automated testing, logging, and monitoring checks.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000033000006',
  '00000000-0002-4000-a000-000000000033',
  6,
  'Q6. Which layer or component plays a vital role in Artificial Intelligence Basics?',
  'The central execution handler and protocol controller.',
  'Legacy manual processing for Artificial Intelligence Basics.',
  'Bypassing standard security checks and protocols in Artificial Intelligence Basics.',
  'Hardcoding static binary files without backup in Artificial Intelligence Basics.',
  'A',
  'Option A is correct. The central execution handler and protocol controller.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000033000007',
  '00000000-0002-4000-a000-000000000033',
  7,
  'Q7. What is a common bottleneck or challenge in Artificial Intelligence Basics?',
  'Hardcoding static binary files without backup in Artificial Intelligence Basics.',
  'Legacy manual processing for Artificial Intelligence Basics.',
  'Bypassing standard security checks and protocols in Artificial Intelligence Basics.',
  'Managing system state synchronization and resource contention under heavy load.',
  'D',
  'Option D is correct. Managing system state synchronization and resource contention under heavy load.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000033000008',
  '00000000-0002-4000-a000-000000000033',
  8,
  'Q8. How is security typically enforced within Artificial Intelligence Basics?',
  'Legacy manual processing for Artificial Intelligence Basics.',
  'Through strong authentication, access control permissions, and data encryption.',
  'Bypassing standard security checks and protocols in Artificial Intelligence Basics.',
  'Hardcoding static binary files without backup in Artificial Intelligence Basics.',
  'B',
  'Option B is correct. Through strong authentication, access control permissions, and data encryption.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000033000009',
  '00000000-0002-4000-a000-000000000033',
  9,
  'Q9. Which metric is critical for measuring the performance of Artificial Intelligence Basics?',
  'Response latency, throughput, resource utilization, and error rates.',
  'Legacy manual processing for Artificial Intelligence Basics.',
  'Bypassing standard security checks and protocols in Artificial Intelligence Basics.',
  'Hardcoding static binary files without backup in Artificial Intelligence Basics.',
  'A',
  'Option A is correct. Response latency, throughput, resource utilization, and error rates.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000033000010',
  '00000000-0002-4000-a000-000000000033',
  10,
  'Q10. What is the role of versioning in Artificial Intelligence Basics?',
  'Hardcoding static binary files without backup in Artificial Intelligence Basics.',
  'Legacy manual processing for Artificial Intelligence Basics.',
  'Bypassing standard security checks and protocols in Artificial Intelligence Basics.',
  'To support safe updates, maintain backward compatibility, and enable rollbacks.',
  'D',
  'Option D is correct. To support safe updates, maintain backward compatibility, and enable rollbacks.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000033000011',
  '00000000-0002-4000-a000-000000000033',
  11,
  'Q11. In what scenario is Artificial Intelligence Basics most effectively applied?',
  'Legacy manual processing for Artificial Intelligence Basics.',
  'In modern scalable enterprise systems requiring structured workflows and reliability.',
  'Bypassing standard security checks and protocols in Artificial Intelligence Basics.',
  'Hardcoding static binary files without backup in Artificial Intelligence Basics.',
  'B',
  'Option B is correct. In modern scalable enterprise systems requiring structured workflows and reliability.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000033000012',
  '00000000-0002-4000-a000-000000000033',
  12,
  'Q12. Which tool or interface is standard for interacting with Artificial Intelligence Basics?',
  'Bypassing standard security checks and protocols in Artificial Intelligence Basics.',
  'Legacy manual processing for Artificial Intelligence Basics.',
  'Dedicated command line tools, SDK APIs, and management dashboards.',
  'Hardcoding static binary files without backup in Artificial Intelligence Basics.',
  'C',
  'Option C is correct. Dedicated command line tools, SDK APIs, and management dashboards.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000033000013',
  '00000000-0002-4000-a000-000000000033',
  13,
  'Q13. What is the initial phase when developing with Artificial Intelligence Basics?',
  'Hardcoding static binary files without backup in Artificial Intelligence Basics.',
  'Legacy manual processing for Artificial Intelligence Basics.',
  'Bypassing standard security checks and protocols in Artificial Intelligence Basics.',
  'Defining requirements, setting up the development environment, and configuring dependencies.',
  'D',
  'Option D is correct. Defining requirements, setting up the development environment, and configuring dependencies.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000033000014',
  '00000000-0002-4000-a000-000000000033',
  14,
  'Q14. Which debugging technique is recommended for Artificial Intelligence Basics?',
  'Hardcoding static binary files without backup in Artificial Intelligence Basics.',
  'Legacy manual processing for Artificial Intelligence Basics.',
  'Bypassing standard security checks and protocols in Artificial Intelligence Basics.',
  'Inspecting log trace files, using debugger tools, and verifying stack traces.',
  'D',
  'Option D is correct. Inspecting log trace files, using debugger tools, and verifying stack traces.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000033000015',
  '00000000-0002-4000-a000-000000000033',
  15,
  'Q15. What is the overall goal of mastering Artificial Intelligence Basics?',
  'Legacy manual processing for Artificial Intelligence Basics.',
  'To design, build, and maintain production-ready technology solutions.',
  'Bypassing standard security checks and protocols in Artificial Intelligence Basics.',
  'Hardcoding static binary files without backup in Artificial Intelligence Basics.',
  'B',
  'Option B is correct. To design, build, and maintain production-ready technology solutions.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000033000016',
  '00000000-0002-4000-a000-000000000033',
  16,
  'Q16. What is the primary definition of Artificial Intelligence Basics?',
  'A core technology or standard designed for managing and executing Artificial Intelligence Basics processes.',
  'Legacy manual processing for Artificial Intelligence Basics.',
  'Bypassing standard security checks and protocols in Artificial Intelligence Basics.',
  'Hardcoding static binary files without backup in Artificial Intelligence Basics.',
  'A',
  'Option A is correct. A core technology or standard designed for managing and executing Artificial Intelligence Basics processes.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000033000017',
  '00000000-0002-4000-a000-000000000033',
  17,
  'Q17. Which key benefit is provided by Artificial Intelligence Basics?',
  'Bypassing standard security checks and protocols in Artificial Intelligence Basics.',
  'Legacy manual processing for Artificial Intelligence Basics.',
  'Improved efficiency, scalability, modularity, and operational reliability.',
  'Hardcoding static binary files without backup in Artificial Intelligence Basics.',
  'C',
  'Option C is correct. Improved efficiency, scalability, modularity, and operational reliability.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000033000018',
  '00000000-0002-4000-a000-000000000033',
  18,
  'Q18. What is a fundamental requirement when implementing Artificial Intelligence Basics?',
  'Bypassing standard security checks and protocols in Artificial Intelligence Basics.',
  'Legacy manual processing for Artificial Intelligence Basics.',
  'Proper system configuration, security protocols, and integration standards.',
  'Hardcoding static binary files without backup in Artificial Intelligence Basics.',
  'C',
  'Option C is correct. Proper system configuration, security protocols, and integration standards.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000033000019',
  '00000000-0002-4000-a000-000000000033',
  19,
  'Q19. How does Artificial Intelligence Basics handle data and execution states?',
  'Hardcoding static binary files without backup in Artificial Intelligence Basics.',
  'Legacy manual processing for Artificial Intelligence Basics.',
  'Bypassing standard security checks and protocols in Artificial Intelligence Basics.',
  'By utilizing structured schemas, indexes, and optimized execution pipelines.',
  'D',
  'Option D is correct. By utilizing structured schemas, indexes, and optimized execution pipelines.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000033000020',
  '00000000-0002-4000-a000-000000000033',
  20,
  'Q20. What is a recommended best practice when deploying Artificial Intelligence Basics?',
  'Hardcoding static binary files without backup in Artificial Intelligence Basics.',
  'Legacy manual processing for Artificial Intelligence Basics.',
  'Bypassing standard security checks and protocols in Artificial Intelligence Basics.',
  'Conducting regular automated testing, logging, and monitoring checks.',
  'D',
  'Option D is correct. Conducting regular automated testing, logging, and monitoring checks.'
);

-- Explore Quiz 34: Machine Learning Fundamentals Mastery Quiz
INSERT INTO public.explore_quizzes (id, title, description, category, branch, difficulty, question_count, estimated_minutes, fx_reward, is_daily, is_published)
VALUES (
  '00000000-0002-4000-a000-000000000034',
  'Machine Learning Fundamentals Challenge Quiz',
  'Test your knowledge on Machine Learning Fundamentals with 20 comprehensive questions.',
  'ML',
  'AI & ML',
  'Intermediate',
  20,
  8,
  15,
  FALSE,
  TRUE
);

INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000034000001',
  '00000000-0002-4000-a000-000000000034',
  1,
  'Q1. What is the primary definition of Machine Learning Fundamentals?',
  'Hardcoding static binary files without backup in Machine Learning Fundamentals.',
  'Legacy manual processing for Machine Learning Fundamentals.',
  'Bypassing standard security checks and protocols in Machine Learning Fundamentals.',
  'A core technology or standard designed for managing and executing Machine Learning Fundamentals processes.',
  'D',
  'Option D is correct. A core technology or standard designed for managing and executing Machine Learning Fundamentals processes.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000034000002',
  '00000000-0002-4000-a000-000000000034',
  2,
  'Q2. Which key benefit is provided by Machine Learning Fundamentals?',
  'Legacy manual processing for Machine Learning Fundamentals.',
  'Improved efficiency, scalability, modularity, and operational reliability.',
  'Bypassing standard security checks and protocols in Machine Learning Fundamentals.',
  'Hardcoding static binary files without backup in Machine Learning Fundamentals.',
  'B',
  'Option B is correct. Improved efficiency, scalability, modularity, and operational reliability.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000034000003',
  '00000000-0002-4000-a000-000000000034',
  3,
  'Q3. What is a fundamental requirement when implementing Machine Learning Fundamentals?',
  'Hardcoding static binary files without backup in Machine Learning Fundamentals.',
  'Legacy manual processing for Machine Learning Fundamentals.',
  'Bypassing standard security checks and protocols in Machine Learning Fundamentals.',
  'Proper system configuration, security protocols, and integration standards.',
  'D',
  'Option D is correct. Proper system configuration, security protocols, and integration standards.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000034000004',
  '00000000-0002-4000-a000-000000000034',
  4,
  'Q4. How does Machine Learning Fundamentals handle data and execution states?',
  'By utilizing structured schemas, indexes, and optimized execution pipelines.',
  'Legacy manual processing for Machine Learning Fundamentals.',
  'Bypassing standard security checks and protocols in Machine Learning Fundamentals.',
  'Hardcoding static binary files without backup in Machine Learning Fundamentals.',
  'A',
  'Option A is correct. By utilizing structured schemas, indexes, and optimized execution pipelines.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000034000005',
  '00000000-0002-4000-a000-000000000034',
  5,
  'Q5. What is a recommended best practice when deploying Machine Learning Fundamentals?',
  'Bypassing standard security checks and protocols in Machine Learning Fundamentals.',
  'Legacy manual processing for Machine Learning Fundamentals.',
  'Conducting regular automated testing, logging, and monitoring checks.',
  'Hardcoding static binary files without backup in Machine Learning Fundamentals.',
  'C',
  'Option C is correct. Conducting regular automated testing, logging, and monitoring checks.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000034000006',
  '00000000-0002-4000-a000-000000000034',
  6,
  'Q6. Which layer or component plays a vital role in Machine Learning Fundamentals?',
  'Bypassing standard security checks and protocols in Machine Learning Fundamentals.',
  'Legacy manual processing for Machine Learning Fundamentals.',
  'The central execution handler and protocol controller.',
  'Hardcoding static binary files without backup in Machine Learning Fundamentals.',
  'C',
  'Option C is correct. The central execution handler and protocol controller.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000034000007',
  '00000000-0002-4000-a000-000000000034',
  7,
  'Q7. What is a common bottleneck or challenge in Machine Learning Fundamentals?',
  'Bypassing standard security checks and protocols in Machine Learning Fundamentals.',
  'Legacy manual processing for Machine Learning Fundamentals.',
  'Managing system state synchronization and resource contention under heavy load.',
  'Hardcoding static binary files without backup in Machine Learning Fundamentals.',
  'C',
  'Option C is correct. Managing system state synchronization and resource contention under heavy load.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000034000008',
  '00000000-0002-4000-a000-000000000034',
  8,
  'Q8. How is security typically enforced within Machine Learning Fundamentals?',
  'Bypassing standard security checks and protocols in Machine Learning Fundamentals.',
  'Legacy manual processing for Machine Learning Fundamentals.',
  'Through strong authentication, access control permissions, and data encryption.',
  'Hardcoding static binary files without backup in Machine Learning Fundamentals.',
  'C',
  'Option C is correct. Through strong authentication, access control permissions, and data encryption.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000034000009',
  '00000000-0002-4000-a000-000000000034',
  9,
  'Q9. Which metric is critical for measuring the performance of Machine Learning Fundamentals?',
  'Bypassing standard security checks and protocols in Machine Learning Fundamentals.',
  'Legacy manual processing for Machine Learning Fundamentals.',
  'Response latency, throughput, resource utilization, and error rates.',
  'Hardcoding static binary files without backup in Machine Learning Fundamentals.',
  'C',
  'Option C is correct. Response latency, throughput, resource utilization, and error rates.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000034000010',
  '00000000-0002-4000-a000-000000000034',
  10,
  'Q10. What is the role of versioning in Machine Learning Fundamentals?',
  'Legacy manual processing for Machine Learning Fundamentals.',
  'To support safe updates, maintain backward compatibility, and enable rollbacks.',
  'Bypassing standard security checks and protocols in Machine Learning Fundamentals.',
  'Hardcoding static binary files without backup in Machine Learning Fundamentals.',
  'B',
  'Option B is correct. To support safe updates, maintain backward compatibility, and enable rollbacks.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000034000011',
  '00000000-0002-4000-a000-000000000034',
  11,
  'Q11. In what scenario is Machine Learning Fundamentals most effectively applied?',
  'Legacy manual processing for Machine Learning Fundamentals.',
  'In modern scalable enterprise systems requiring structured workflows and reliability.',
  'Bypassing standard security checks and protocols in Machine Learning Fundamentals.',
  'Hardcoding static binary files without backup in Machine Learning Fundamentals.',
  'B',
  'Option B is correct. In modern scalable enterprise systems requiring structured workflows and reliability.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000034000012',
  '00000000-0002-4000-a000-000000000034',
  12,
  'Q12. Which tool or interface is standard for interacting with Machine Learning Fundamentals?',
  'Legacy manual processing for Machine Learning Fundamentals.',
  'Dedicated command line tools, SDK APIs, and management dashboards.',
  'Bypassing standard security checks and protocols in Machine Learning Fundamentals.',
  'Hardcoding static binary files without backup in Machine Learning Fundamentals.',
  'B',
  'Option B is correct. Dedicated command line tools, SDK APIs, and management dashboards.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000034000013',
  '00000000-0002-4000-a000-000000000034',
  13,
  'Q13. What is the initial phase when developing with Machine Learning Fundamentals?',
  'Hardcoding static binary files without backup in Machine Learning Fundamentals.',
  'Legacy manual processing for Machine Learning Fundamentals.',
  'Bypassing standard security checks and protocols in Machine Learning Fundamentals.',
  'Defining requirements, setting up the development environment, and configuring dependencies.',
  'D',
  'Option D is correct. Defining requirements, setting up the development environment, and configuring dependencies.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000034000014',
  '00000000-0002-4000-a000-000000000034',
  14,
  'Q14. Which debugging technique is recommended for Machine Learning Fundamentals?',
  'Inspecting log trace files, using debugger tools, and verifying stack traces.',
  'Legacy manual processing for Machine Learning Fundamentals.',
  'Bypassing standard security checks and protocols in Machine Learning Fundamentals.',
  'Hardcoding static binary files without backup in Machine Learning Fundamentals.',
  'A',
  'Option A is correct. Inspecting log trace files, using debugger tools, and verifying stack traces.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000034000015',
  '00000000-0002-4000-a000-000000000034',
  15,
  'Q15. What is the overall goal of mastering Machine Learning Fundamentals?',
  'To design, build, and maintain production-ready technology solutions.',
  'Legacy manual processing for Machine Learning Fundamentals.',
  'Bypassing standard security checks and protocols in Machine Learning Fundamentals.',
  'Hardcoding static binary files without backup in Machine Learning Fundamentals.',
  'A',
  'Option A is correct. To design, build, and maintain production-ready technology solutions.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000034000016',
  '00000000-0002-4000-a000-000000000034',
  16,
  'Q16. What is the primary definition of Machine Learning Fundamentals?',
  'Hardcoding static binary files without backup in Machine Learning Fundamentals.',
  'Legacy manual processing for Machine Learning Fundamentals.',
  'Bypassing standard security checks and protocols in Machine Learning Fundamentals.',
  'A core technology or standard designed for managing and executing Machine Learning Fundamentals processes.',
  'D',
  'Option D is correct. A core technology or standard designed for managing and executing Machine Learning Fundamentals processes.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000034000017',
  '00000000-0002-4000-a000-000000000034',
  17,
  'Q17. Which key benefit is provided by Machine Learning Fundamentals?',
  'Improved efficiency, scalability, modularity, and operational reliability.',
  'Legacy manual processing for Machine Learning Fundamentals.',
  'Bypassing standard security checks and protocols in Machine Learning Fundamentals.',
  'Hardcoding static binary files without backup in Machine Learning Fundamentals.',
  'A',
  'Option A is correct. Improved efficiency, scalability, modularity, and operational reliability.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000034000018',
  '00000000-0002-4000-a000-000000000034',
  18,
  'Q18. What is a fundamental requirement when implementing Machine Learning Fundamentals?',
  'Legacy manual processing for Machine Learning Fundamentals.',
  'Proper system configuration, security protocols, and integration standards.',
  'Bypassing standard security checks and protocols in Machine Learning Fundamentals.',
  'Hardcoding static binary files without backup in Machine Learning Fundamentals.',
  'B',
  'Option B is correct. Proper system configuration, security protocols, and integration standards.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000034000019',
  '00000000-0002-4000-a000-000000000034',
  19,
  'Q19. How does Machine Learning Fundamentals handle data and execution states?',
  'Legacy manual processing for Machine Learning Fundamentals.',
  'By utilizing structured schemas, indexes, and optimized execution pipelines.',
  'Bypassing standard security checks and protocols in Machine Learning Fundamentals.',
  'Hardcoding static binary files without backup in Machine Learning Fundamentals.',
  'B',
  'Option B is correct. By utilizing structured schemas, indexes, and optimized execution pipelines.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000034000020',
  '00000000-0002-4000-a000-000000000034',
  20,
  'Q20. What is a recommended best practice when deploying Machine Learning Fundamentals?',
  'Conducting regular automated testing, logging, and monitoring checks.',
  'Legacy manual processing for Machine Learning Fundamentals.',
  'Bypassing standard security checks and protocols in Machine Learning Fundamentals.',
  'Hardcoding static binary files without backup in Machine Learning Fundamentals.',
  'A',
  'Option A is correct. Conducting regular automated testing, logging, and monitoring checks.'
);

-- Explore Quiz 35: Deep Learning & Neural Networks Mastery Quiz
INSERT INTO public.explore_quizzes (id, title, description, category, branch, difficulty, question_count, estimated_minutes, fx_reward, is_daily, is_published)
VALUES (
  '00000000-0002-4000-a000-000000000035',
  'Deep Learning & Neural Networks Challenge Quiz',
  'Test your knowledge on Deep Learning & Neural Networks with 20 comprehensive questions.',
  'AI',
  'AI & ML',
  'Advanced',
  20,
  8,
  15,
  FALSE,
  TRUE
);

INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000035000001',
  '00000000-0002-4000-a000-000000000035',
  1,
  'Q1. What is the primary definition of Deep Learning & Neural Networks?',
  'Bypassing standard security checks and protocols in Deep Learning & Neural Networks.',
  'Legacy manual processing for Deep Learning & Neural Networks.',
  'A core technology or standard designed for managing and executing Deep Learning & Neural Networks processes.',
  'Hardcoding static binary files without backup in Deep Learning & Neural Networks.',
  'C',
  'Option C is correct. A core technology or standard designed for managing and executing Deep Learning & Neural Networks processes.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000035000002',
  '00000000-0002-4000-a000-000000000035',
  2,
  'Q2. Which key benefit is provided by Deep Learning & Neural Networks?',
  'Bypassing standard security checks and protocols in Deep Learning & Neural Networks.',
  'Legacy manual processing for Deep Learning & Neural Networks.',
  'Improved efficiency, scalability, modularity, and operational reliability.',
  'Hardcoding static binary files without backup in Deep Learning & Neural Networks.',
  'C',
  'Option C is correct. Improved efficiency, scalability, modularity, and operational reliability.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000035000003',
  '00000000-0002-4000-a000-000000000035',
  3,
  'Q3. What is a fundamental requirement when implementing Deep Learning & Neural Networks?',
  'Legacy manual processing for Deep Learning & Neural Networks.',
  'Proper system configuration, security protocols, and integration standards.',
  'Bypassing standard security checks and protocols in Deep Learning & Neural Networks.',
  'Hardcoding static binary files without backup in Deep Learning & Neural Networks.',
  'B',
  'Option B is correct. Proper system configuration, security protocols, and integration standards.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000035000004',
  '00000000-0002-4000-a000-000000000035',
  4,
  'Q4. How does Deep Learning & Neural Networks handle data and execution states?',
  'Bypassing standard security checks and protocols in Deep Learning & Neural Networks.',
  'Legacy manual processing for Deep Learning & Neural Networks.',
  'By utilizing structured schemas, indexes, and optimized execution pipelines.',
  'Hardcoding static binary files without backup in Deep Learning & Neural Networks.',
  'C',
  'Option C is correct. By utilizing structured schemas, indexes, and optimized execution pipelines.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000035000005',
  '00000000-0002-4000-a000-000000000035',
  5,
  'Q5. What is a recommended best practice when deploying Deep Learning & Neural Networks?',
  'Bypassing standard security checks and protocols in Deep Learning & Neural Networks.',
  'Legacy manual processing for Deep Learning & Neural Networks.',
  'Conducting regular automated testing, logging, and monitoring checks.',
  'Hardcoding static binary files without backup in Deep Learning & Neural Networks.',
  'C',
  'Option C is correct. Conducting regular automated testing, logging, and monitoring checks.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000035000006',
  '00000000-0002-4000-a000-000000000035',
  6,
  'Q6. Which layer or component plays a vital role in Deep Learning & Neural Networks?',
  'Bypassing standard security checks and protocols in Deep Learning & Neural Networks.',
  'Legacy manual processing for Deep Learning & Neural Networks.',
  'The central execution handler and protocol controller.',
  'Hardcoding static binary files without backup in Deep Learning & Neural Networks.',
  'C',
  'Option C is correct. The central execution handler and protocol controller.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000035000007',
  '00000000-0002-4000-a000-000000000035',
  7,
  'Q7. What is a common bottleneck or challenge in Deep Learning & Neural Networks?',
  'Bypassing standard security checks and protocols in Deep Learning & Neural Networks.',
  'Legacy manual processing for Deep Learning & Neural Networks.',
  'Managing system state synchronization and resource contention under heavy load.',
  'Hardcoding static binary files without backup in Deep Learning & Neural Networks.',
  'C',
  'Option C is correct. Managing system state synchronization and resource contention under heavy load.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000035000008',
  '00000000-0002-4000-a000-000000000035',
  8,
  'Q8. How is security typically enforced within Deep Learning & Neural Networks?',
  'Legacy manual processing for Deep Learning & Neural Networks.',
  'Through strong authentication, access control permissions, and data encryption.',
  'Bypassing standard security checks and protocols in Deep Learning & Neural Networks.',
  'Hardcoding static binary files without backup in Deep Learning & Neural Networks.',
  'B',
  'Option B is correct. Through strong authentication, access control permissions, and data encryption.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000035000009',
  '00000000-0002-4000-a000-000000000035',
  9,
  'Q9. Which metric is critical for measuring the performance of Deep Learning & Neural Networks?',
  'Legacy manual processing for Deep Learning & Neural Networks.',
  'Response latency, throughput, resource utilization, and error rates.',
  'Bypassing standard security checks and protocols in Deep Learning & Neural Networks.',
  'Hardcoding static binary files without backup in Deep Learning & Neural Networks.',
  'B',
  'Option B is correct. Response latency, throughput, resource utilization, and error rates.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000035000010',
  '00000000-0002-4000-a000-000000000035',
  10,
  'Q10. What is the role of versioning in Deep Learning & Neural Networks?',
  'To support safe updates, maintain backward compatibility, and enable rollbacks.',
  'Legacy manual processing for Deep Learning & Neural Networks.',
  'Bypassing standard security checks and protocols in Deep Learning & Neural Networks.',
  'Hardcoding static binary files without backup in Deep Learning & Neural Networks.',
  'A',
  'Option A is correct. To support safe updates, maintain backward compatibility, and enable rollbacks.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000035000011',
  '00000000-0002-4000-a000-000000000035',
  11,
  'Q11. In what scenario is Deep Learning & Neural Networks most effectively applied?',
  'Legacy manual processing for Deep Learning & Neural Networks.',
  'In modern scalable enterprise systems requiring structured workflows and reliability.',
  'Bypassing standard security checks and protocols in Deep Learning & Neural Networks.',
  'Hardcoding static binary files without backup in Deep Learning & Neural Networks.',
  'B',
  'Option B is correct. In modern scalable enterprise systems requiring structured workflows and reliability.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000035000012',
  '00000000-0002-4000-a000-000000000035',
  12,
  'Q12. Which tool or interface is standard for interacting with Deep Learning & Neural Networks?',
  'Bypassing standard security checks and protocols in Deep Learning & Neural Networks.',
  'Legacy manual processing for Deep Learning & Neural Networks.',
  'Dedicated command line tools, SDK APIs, and management dashboards.',
  'Hardcoding static binary files without backup in Deep Learning & Neural Networks.',
  'C',
  'Option C is correct. Dedicated command line tools, SDK APIs, and management dashboards.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000035000013',
  '00000000-0002-4000-a000-000000000035',
  13,
  'Q13. What is the initial phase when developing with Deep Learning & Neural Networks?',
  'Bypassing standard security checks and protocols in Deep Learning & Neural Networks.',
  'Legacy manual processing for Deep Learning & Neural Networks.',
  'Defining requirements, setting up the development environment, and configuring dependencies.',
  'Hardcoding static binary files without backup in Deep Learning & Neural Networks.',
  'C',
  'Option C is correct. Defining requirements, setting up the development environment, and configuring dependencies.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000035000014',
  '00000000-0002-4000-a000-000000000035',
  14,
  'Q14. Which debugging technique is recommended for Deep Learning & Neural Networks?',
  'Hardcoding static binary files without backup in Deep Learning & Neural Networks.',
  'Legacy manual processing for Deep Learning & Neural Networks.',
  'Bypassing standard security checks and protocols in Deep Learning & Neural Networks.',
  'Inspecting log trace files, using debugger tools, and verifying stack traces.',
  'D',
  'Option D is correct. Inspecting log trace files, using debugger tools, and verifying stack traces.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000035000015',
  '00000000-0002-4000-a000-000000000035',
  15,
  'Q15. What is the overall goal of mastering Deep Learning & Neural Networks?',
  'To design, build, and maintain production-ready technology solutions.',
  'Legacy manual processing for Deep Learning & Neural Networks.',
  'Bypassing standard security checks and protocols in Deep Learning & Neural Networks.',
  'Hardcoding static binary files without backup in Deep Learning & Neural Networks.',
  'A',
  'Option A is correct. To design, build, and maintain production-ready technology solutions.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000035000016',
  '00000000-0002-4000-a000-000000000035',
  16,
  'Q16. What is the primary definition of Deep Learning & Neural Networks?',
  'A core technology or standard designed for managing and executing Deep Learning & Neural Networks processes.',
  'Legacy manual processing for Deep Learning & Neural Networks.',
  'Bypassing standard security checks and protocols in Deep Learning & Neural Networks.',
  'Hardcoding static binary files without backup in Deep Learning & Neural Networks.',
  'A',
  'Option A is correct. A core technology or standard designed for managing and executing Deep Learning & Neural Networks processes.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000035000017',
  '00000000-0002-4000-a000-000000000035',
  17,
  'Q17. Which key benefit is provided by Deep Learning & Neural Networks?',
  'Bypassing standard security checks and protocols in Deep Learning & Neural Networks.',
  'Legacy manual processing for Deep Learning & Neural Networks.',
  'Improved efficiency, scalability, modularity, and operational reliability.',
  'Hardcoding static binary files without backup in Deep Learning & Neural Networks.',
  'C',
  'Option C is correct. Improved efficiency, scalability, modularity, and operational reliability.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000035000018',
  '00000000-0002-4000-a000-000000000035',
  18,
  'Q18. What is a fundamental requirement when implementing Deep Learning & Neural Networks?',
  'Hardcoding static binary files without backup in Deep Learning & Neural Networks.',
  'Legacy manual processing for Deep Learning & Neural Networks.',
  'Bypassing standard security checks and protocols in Deep Learning & Neural Networks.',
  'Proper system configuration, security protocols, and integration standards.',
  'D',
  'Option D is correct. Proper system configuration, security protocols, and integration standards.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000035000019',
  '00000000-0002-4000-a000-000000000035',
  19,
  'Q19. How does Deep Learning & Neural Networks handle data and execution states?',
  'Legacy manual processing for Deep Learning & Neural Networks.',
  'By utilizing structured schemas, indexes, and optimized execution pipelines.',
  'Bypassing standard security checks and protocols in Deep Learning & Neural Networks.',
  'Hardcoding static binary files without backup in Deep Learning & Neural Networks.',
  'B',
  'Option B is correct. By utilizing structured schemas, indexes, and optimized execution pipelines.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000035000020',
  '00000000-0002-4000-a000-000000000035',
  20,
  'Q20. What is a recommended best practice when deploying Deep Learning & Neural Networks?',
  'Hardcoding static binary files without backup in Deep Learning & Neural Networks.',
  'Legacy manual processing for Deep Learning & Neural Networks.',
  'Bypassing standard security checks and protocols in Deep Learning & Neural Networks.',
  'Conducting regular automated testing, logging, and monitoring checks.',
  'D',
  'Option D is correct. Conducting regular automated testing, logging, and monitoring checks.'
);

-- Explore Quiz 36: Web Security & OWASP Top 10 Mastery Quiz
INSERT INTO public.explore_quizzes (id, title, description, category, branch, difficulty, question_count, estimated_minutes, fx_reward, is_daily, is_published)
VALUES (
  '00000000-0002-4000-a000-000000000036',
  'Web Security & OWASP Top 10 Challenge Quiz',
  'Test your knowledge on Web Security & OWASP Top 10 with 20 comprehensive questions.',
  'Security',
  'CSE',
  'Advanced',
  20,
  8,
  15,
  FALSE,
  TRUE
);

INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000036000001',
  '00000000-0002-4000-a000-000000000036',
  1,
  'Q1. What is the primary definition of Web Security & OWASP Top 10?',
  'Bypassing standard security checks and protocols in Web Security & OWASP Top 10.',
  'Legacy manual processing for Web Security & OWASP Top 10.',
  'A core technology or standard designed for managing and executing Web Security & OWASP Top 10 processes.',
  'Hardcoding static binary files without backup in Web Security & OWASP Top 10.',
  'C',
  'Option C is correct. A core technology or standard designed for managing and executing Web Security & OWASP Top 10 processes.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000036000002',
  '00000000-0002-4000-a000-000000000036',
  2,
  'Q2. Which key benefit is provided by Web Security & OWASP Top 10?',
  'Hardcoding static binary files without backup in Web Security & OWASP Top 10.',
  'Legacy manual processing for Web Security & OWASP Top 10.',
  'Bypassing standard security checks and protocols in Web Security & OWASP Top 10.',
  'Improved efficiency, scalability, modularity, and operational reliability.',
  'D',
  'Option D is correct. Improved efficiency, scalability, modularity, and operational reliability.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000036000003',
  '00000000-0002-4000-a000-000000000036',
  3,
  'Q3. What is a fundamental requirement when implementing Web Security & OWASP Top 10?',
  'Hardcoding static binary files without backup in Web Security & OWASP Top 10.',
  'Legacy manual processing for Web Security & OWASP Top 10.',
  'Bypassing standard security checks and protocols in Web Security & OWASP Top 10.',
  'Proper system configuration, security protocols, and integration standards.',
  'D',
  'Option D is correct. Proper system configuration, security protocols, and integration standards.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000036000004',
  '00000000-0002-4000-a000-000000000036',
  4,
  'Q4. How does Web Security & OWASP Top 10 handle data and execution states?',
  'Bypassing standard security checks and protocols in Web Security & OWASP Top 10.',
  'Legacy manual processing for Web Security & OWASP Top 10.',
  'By utilizing structured schemas, indexes, and optimized execution pipelines.',
  'Hardcoding static binary files without backup in Web Security & OWASP Top 10.',
  'C',
  'Option C is correct. By utilizing structured schemas, indexes, and optimized execution pipelines.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000036000005',
  '00000000-0002-4000-a000-000000000036',
  5,
  'Q5. What is a recommended best practice when deploying Web Security & OWASP Top 10?',
  'Legacy manual processing for Web Security & OWASP Top 10.',
  'Conducting regular automated testing, logging, and monitoring checks.',
  'Bypassing standard security checks and protocols in Web Security & OWASP Top 10.',
  'Hardcoding static binary files without backup in Web Security & OWASP Top 10.',
  'B',
  'Option B is correct. Conducting regular automated testing, logging, and monitoring checks.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000036000006',
  '00000000-0002-4000-a000-000000000036',
  6,
  'Q6. Which layer or component plays a vital role in Web Security & OWASP Top 10?',
  'Legacy manual processing for Web Security & OWASP Top 10.',
  'The central execution handler and protocol controller.',
  'Bypassing standard security checks and protocols in Web Security & OWASP Top 10.',
  'Hardcoding static binary files without backup in Web Security & OWASP Top 10.',
  'B',
  'Option B is correct. The central execution handler and protocol controller.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000036000007',
  '00000000-0002-4000-a000-000000000036',
  7,
  'Q7. What is a common bottleneck or challenge in Web Security & OWASP Top 10?',
  'Legacy manual processing for Web Security & OWASP Top 10.',
  'Managing system state synchronization and resource contention under heavy load.',
  'Bypassing standard security checks and protocols in Web Security & OWASP Top 10.',
  'Hardcoding static binary files without backup in Web Security & OWASP Top 10.',
  'B',
  'Option B is correct. Managing system state synchronization and resource contention under heavy load.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000036000008',
  '00000000-0002-4000-a000-000000000036',
  8,
  'Q8. How is security typically enforced within Web Security & OWASP Top 10?',
  'Through strong authentication, access control permissions, and data encryption.',
  'Legacy manual processing for Web Security & OWASP Top 10.',
  'Bypassing standard security checks and protocols in Web Security & OWASP Top 10.',
  'Hardcoding static binary files without backup in Web Security & OWASP Top 10.',
  'A',
  'Option A is correct. Through strong authentication, access control permissions, and data encryption.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000036000009',
  '00000000-0002-4000-a000-000000000036',
  9,
  'Q9. Which metric is critical for measuring the performance of Web Security & OWASP Top 10?',
  'Legacy manual processing for Web Security & OWASP Top 10.',
  'Response latency, throughput, resource utilization, and error rates.',
  'Bypassing standard security checks and protocols in Web Security & OWASP Top 10.',
  'Hardcoding static binary files without backup in Web Security & OWASP Top 10.',
  'B',
  'Option B is correct. Response latency, throughput, resource utilization, and error rates.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000036000010',
  '00000000-0002-4000-a000-000000000036',
  10,
  'Q10. What is the role of versioning in Web Security & OWASP Top 10?',
  'Hardcoding static binary files without backup in Web Security & OWASP Top 10.',
  'Legacy manual processing for Web Security & OWASP Top 10.',
  'Bypassing standard security checks and protocols in Web Security & OWASP Top 10.',
  'To support safe updates, maintain backward compatibility, and enable rollbacks.',
  'D',
  'Option D is correct. To support safe updates, maintain backward compatibility, and enable rollbacks.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000036000011',
  '00000000-0002-4000-a000-000000000036',
  11,
  'Q11. In what scenario is Web Security & OWASP Top 10 most effectively applied?',
  'Bypassing standard security checks and protocols in Web Security & OWASP Top 10.',
  'Legacy manual processing for Web Security & OWASP Top 10.',
  'In modern scalable enterprise systems requiring structured workflows and reliability.',
  'Hardcoding static binary files without backup in Web Security & OWASP Top 10.',
  'C',
  'Option C is correct. In modern scalable enterprise systems requiring structured workflows and reliability.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000036000012',
  '00000000-0002-4000-a000-000000000036',
  12,
  'Q12. Which tool or interface is standard for interacting with Web Security & OWASP Top 10?',
  'Bypassing standard security checks and protocols in Web Security & OWASP Top 10.',
  'Legacy manual processing for Web Security & OWASP Top 10.',
  'Dedicated command line tools, SDK APIs, and management dashboards.',
  'Hardcoding static binary files without backup in Web Security & OWASP Top 10.',
  'C',
  'Option C is correct. Dedicated command line tools, SDK APIs, and management dashboards.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000036000013',
  '00000000-0002-4000-a000-000000000036',
  13,
  'Q13. What is the initial phase when developing with Web Security & OWASP Top 10?',
  'Bypassing standard security checks and protocols in Web Security & OWASP Top 10.',
  'Legacy manual processing for Web Security & OWASP Top 10.',
  'Defining requirements, setting up the development environment, and configuring dependencies.',
  'Hardcoding static binary files without backup in Web Security & OWASP Top 10.',
  'C',
  'Option C is correct. Defining requirements, setting up the development environment, and configuring dependencies.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000036000014',
  '00000000-0002-4000-a000-000000000036',
  14,
  'Q14. Which debugging technique is recommended for Web Security & OWASP Top 10?',
  'Legacy manual processing for Web Security & OWASP Top 10.',
  'Inspecting log trace files, using debugger tools, and verifying stack traces.',
  'Bypassing standard security checks and protocols in Web Security & OWASP Top 10.',
  'Hardcoding static binary files without backup in Web Security & OWASP Top 10.',
  'B',
  'Option B is correct. Inspecting log trace files, using debugger tools, and verifying stack traces.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000036000015',
  '00000000-0002-4000-a000-000000000036',
  15,
  'Q15. What is the overall goal of mastering Web Security & OWASP Top 10?',
  'Bypassing standard security checks and protocols in Web Security & OWASP Top 10.',
  'Legacy manual processing for Web Security & OWASP Top 10.',
  'To design, build, and maintain production-ready technology solutions.',
  'Hardcoding static binary files without backup in Web Security & OWASP Top 10.',
  'C',
  'Option C is correct. To design, build, and maintain production-ready technology solutions.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000036000016',
  '00000000-0002-4000-a000-000000000036',
  16,
  'Q16. What is the primary definition of Web Security & OWASP Top 10?',
  'Legacy manual processing for Web Security & OWASP Top 10.',
  'A core technology or standard designed for managing and executing Web Security & OWASP Top 10 processes.',
  'Bypassing standard security checks and protocols in Web Security & OWASP Top 10.',
  'Hardcoding static binary files without backup in Web Security & OWASP Top 10.',
  'B',
  'Option B is correct. A core technology or standard designed for managing and executing Web Security & OWASP Top 10 processes.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000036000017',
  '00000000-0002-4000-a000-000000000036',
  17,
  'Q17. Which key benefit is provided by Web Security & OWASP Top 10?',
  'Bypassing standard security checks and protocols in Web Security & OWASP Top 10.',
  'Legacy manual processing for Web Security & OWASP Top 10.',
  'Improved efficiency, scalability, modularity, and operational reliability.',
  'Hardcoding static binary files without backup in Web Security & OWASP Top 10.',
  'C',
  'Option C is correct. Improved efficiency, scalability, modularity, and operational reliability.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000036000018',
  '00000000-0002-4000-a000-000000000036',
  18,
  'Q18. What is a fundamental requirement when implementing Web Security & OWASP Top 10?',
  'Bypassing standard security checks and protocols in Web Security & OWASP Top 10.',
  'Legacy manual processing for Web Security & OWASP Top 10.',
  'Proper system configuration, security protocols, and integration standards.',
  'Hardcoding static binary files without backup in Web Security & OWASP Top 10.',
  'C',
  'Option C is correct. Proper system configuration, security protocols, and integration standards.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000036000019',
  '00000000-0002-4000-a000-000000000036',
  19,
  'Q19. How does Web Security & OWASP Top 10 handle data and execution states?',
  'By utilizing structured schemas, indexes, and optimized execution pipelines.',
  'Legacy manual processing for Web Security & OWASP Top 10.',
  'Bypassing standard security checks and protocols in Web Security & OWASP Top 10.',
  'Hardcoding static binary files without backup in Web Security & OWASP Top 10.',
  'A',
  'Option A is correct. By utilizing structured schemas, indexes, and optimized execution pipelines.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000036000020',
  '00000000-0002-4000-a000-000000000036',
  20,
  'Q20. What is a recommended best practice when deploying Web Security & OWASP Top 10?',
  'Hardcoding static binary files without backup in Web Security & OWASP Top 10.',
  'Legacy manual processing for Web Security & OWASP Top 10.',
  'Bypassing standard security checks and protocols in Web Security & OWASP Top 10.',
  'Conducting regular automated testing, logging, and monitoring checks.',
  'D',
  'Option D is correct. Conducting regular automated testing, logging, and monitoring checks.'
);

-- Explore Quiz 37: Information Security & Cryptography Mastery Quiz
INSERT INTO public.explore_quizzes (id, title, description, category, branch, difficulty, question_count, estimated_minutes, fx_reward, is_daily, is_published)
VALUES (
  '00000000-0002-4000-a000-000000000037',
  'Information Security & Cryptography Challenge Quiz',
  'Test your knowledge on Information Security & Cryptography with 20 comprehensive questions.',
  'Security',
  'CSE',
  'Intermediate',
  20,
  8,
  15,
  FALSE,
  TRUE
);

INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000037000001',
  '00000000-0002-4000-a000-000000000037',
  1,
  'Q1. What is the primary definition of Information Security & Cryptography?',
  'Bypassing standard security checks and protocols in Information Security & Cryptography.',
  'Legacy manual processing for Information Security & Cryptography.',
  'A core technology or standard designed for managing and executing Information Security & Cryptography processes.',
  'Hardcoding static binary files without backup in Information Security & Cryptography.',
  'C',
  'Option C is correct. A core technology or standard designed for managing and executing Information Security & Cryptography processes.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000037000002',
  '00000000-0002-4000-a000-000000000037',
  2,
  'Q2. Which key benefit is provided by Information Security & Cryptography?',
  'Improved efficiency, scalability, modularity, and operational reliability.',
  'Legacy manual processing for Information Security & Cryptography.',
  'Bypassing standard security checks and protocols in Information Security & Cryptography.',
  'Hardcoding static binary files without backup in Information Security & Cryptography.',
  'A',
  'Option A is correct. Improved efficiency, scalability, modularity, and operational reliability.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000037000003',
  '00000000-0002-4000-a000-000000000037',
  3,
  'Q3. What is a fundamental requirement when implementing Information Security & Cryptography?',
  'Bypassing standard security checks and protocols in Information Security & Cryptography.',
  'Legacy manual processing for Information Security & Cryptography.',
  'Proper system configuration, security protocols, and integration standards.',
  'Hardcoding static binary files without backup in Information Security & Cryptography.',
  'C',
  'Option C is correct. Proper system configuration, security protocols, and integration standards.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000037000004',
  '00000000-0002-4000-a000-000000000037',
  4,
  'Q4. How does Information Security & Cryptography handle data and execution states?',
  'Bypassing standard security checks and protocols in Information Security & Cryptography.',
  'Legacy manual processing for Information Security & Cryptography.',
  'By utilizing structured schemas, indexes, and optimized execution pipelines.',
  'Hardcoding static binary files without backup in Information Security & Cryptography.',
  'C',
  'Option C is correct. By utilizing structured schemas, indexes, and optimized execution pipelines.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000037000005',
  '00000000-0002-4000-a000-000000000037',
  5,
  'Q5. What is a recommended best practice when deploying Information Security & Cryptography?',
  'Legacy manual processing for Information Security & Cryptography.',
  'Conducting regular automated testing, logging, and monitoring checks.',
  'Bypassing standard security checks and protocols in Information Security & Cryptography.',
  'Hardcoding static binary files without backup in Information Security & Cryptography.',
  'B',
  'Option B is correct. Conducting regular automated testing, logging, and monitoring checks.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000037000006',
  '00000000-0002-4000-a000-000000000037',
  6,
  'Q6. Which layer or component plays a vital role in Information Security & Cryptography?',
  'Bypassing standard security checks and protocols in Information Security & Cryptography.',
  'Legacy manual processing for Information Security & Cryptography.',
  'The central execution handler and protocol controller.',
  'Hardcoding static binary files without backup in Information Security & Cryptography.',
  'C',
  'Option C is correct. The central execution handler and protocol controller.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000037000007',
  '00000000-0002-4000-a000-000000000037',
  7,
  'Q7. What is a common bottleneck or challenge in Information Security & Cryptography?',
  'Managing system state synchronization and resource contention under heavy load.',
  'Legacy manual processing for Information Security & Cryptography.',
  'Bypassing standard security checks and protocols in Information Security & Cryptography.',
  'Hardcoding static binary files without backup in Information Security & Cryptography.',
  'A',
  'Option A is correct. Managing system state synchronization and resource contention under heavy load.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000037000008',
  '00000000-0002-4000-a000-000000000037',
  8,
  'Q8. How is security typically enforced within Information Security & Cryptography?',
  'Bypassing standard security checks and protocols in Information Security & Cryptography.',
  'Legacy manual processing for Information Security & Cryptography.',
  'Through strong authentication, access control permissions, and data encryption.',
  'Hardcoding static binary files without backup in Information Security & Cryptography.',
  'C',
  'Option C is correct. Through strong authentication, access control permissions, and data encryption.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000037000009',
  '00000000-0002-4000-a000-000000000037',
  9,
  'Q9. Which metric is critical for measuring the performance of Information Security & Cryptography?',
  'Response latency, throughput, resource utilization, and error rates.',
  'Legacy manual processing for Information Security & Cryptography.',
  'Bypassing standard security checks and protocols in Information Security & Cryptography.',
  'Hardcoding static binary files without backup in Information Security & Cryptography.',
  'A',
  'Option A is correct. Response latency, throughput, resource utilization, and error rates.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000037000010',
  '00000000-0002-4000-a000-000000000037',
  10,
  'Q10. What is the role of versioning in Information Security & Cryptography?',
  'Legacy manual processing for Information Security & Cryptography.',
  'To support safe updates, maintain backward compatibility, and enable rollbacks.',
  'Bypassing standard security checks and protocols in Information Security & Cryptography.',
  'Hardcoding static binary files without backup in Information Security & Cryptography.',
  'B',
  'Option B is correct. To support safe updates, maintain backward compatibility, and enable rollbacks.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000037000011',
  '00000000-0002-4000-a000-000000000037',
  11,
  'Q11. In what scenario is Information Security & Cryptography most effectively applied?',
  'Legacy manual processing for Information Security & Cryptography.',
  'In modern scalable enterprise systems requiring structured workflows and reliability.',
  'Bypassing standard security checks and protocols in Information Security & Cryptography.',
  'Hardcoding static binary files without backup in Information Security & Cryptography.',
  'B',
  'Option B is correct. In modern scalable enterprise systems requiring structured workflows and reliability.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000037000012',
  '00000000-0002-4000-a000-000000000037',
  12,
  'Q12. Which tool or interface is standard for interacting with Information Security & Cryptography?',
  'Hardcoding static binary files without backup in Information Security & Cryptography.',
  'Legacy manual processing for Information Security & Cryptography.',
  'Bypassing standard security checks and protocols in Information Security & Cryptography.',
  'Dedicated command line tools, SDK APIs, and management dashboards.',
  'D',
  'Option D is correct. Dedicated command line tools, SDK APIs, and management dashboards.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000037000013',
  '00000000-0002-4000-a000-000000000037',
  13,
  'Q13. What is the initial phase when developing with Information Security & Cryptography?',
  'Hardcoding static binary files without backup in Information Security & Cryptography.',
  'Legacy manual processing for Information Security & Cryptography.',
  'Bypassing standard security checks and protocols in Information Security & Cryptography.',
  'Defining requirements, setting up the development environment, and configuring dependencies.',
  'D',
  'Option D is correct. Defining requirements, setting up the development environment, and configuring dependencies.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000037000014',
  '00000000-0002-4000-a000-000000000037',
  14,
  'Q14. Which debugging technique is recommended for Information Security & Cryptography?',
  'Legacy manual processing for Information Security & Cryptography.',
  'Inspecting log trace files, using debugger tools, and verifying stack traces.',
  'Bypassing standard security checks and protocols in Information Security & Cryptography.',
  'Hardcoding static binary files without backup in Information Security & Cryptography.',
  'B',
  'Option B is correct. Inspecting log trace files, using debugger tools, and verifying stack traces.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000037000015',
  '00000000-0002-4000-a000-000000000037',
  15,
  'Q15. What is the overall goal of mastering Information Security & Cryptography?',
  'Hardcoding static binary files without backup in Information Security & Cryptography.',
  'Legacy manual processing for Information Security & Cryptography.',
  'Bypassing standard security checks and protocols in Information Security & Cryptography.',
  'To design, build, and maintain production-ready technology solutions.',
  'D',
  'Option D is correct. To design, build, and maintain production-ready technology solutions.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000037000016',
  '00000000-0002-4000-a000-000000000037',
  16,
  'Q16. What is the primary definition of Information Security & Cryptography?',
  'Hardcoding static binary files without backup in Information Security & Cryptography.',
  'Legacy manual processing for Information Security & Cryptography.',
  'Bypassing standard security checks and protocols in Information Security & Cryptography.',
  'A core technology or standard designed for managing and executing Information Security & Cryptography processes.',
  'D',
  'Option D is correct. A core technology or standard designed for managing and executing Information Security & Cryptography processes.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000037000017',
  '00000000-0002-4000-a000-000000000037',
  17,
  'Q17. Which key benefit is provided by Information Security & Cryptography?',
  'Bypassing standard security checks and protocols in Information Security & Cryptography.',
  'Legacy manual processing for Information Security & Cryptography.',
  'Improved efficiency, scalability, modularity, and operational reliability.',
  'Hardcoding static binary files without backup in Information Security & Cryptography.',
  'C',
  'Option C is correct. Improved efficiency, scalability, modularity, and operational reliability.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000037000018',
  '00000000-0002-4000-a000-000000000037',
  18,
  'Q18. What is a fundamental requirement when implementing Information Security & Cryptography?',
  'Hardcoding static binary files without backup in Information Security & Cryptography.',
  'Legacy manual processing for Information Security & Cryptography.',
  'Bypassing standard security checks and protocols in Information Security & Cryptography.',
  'Proper system configuration, security protocols, and integration standards.',
  'D',
  'Option D is correct. Proper system configuration, security protocols, and integration standards.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000037000019',
  '00000000-0002-4000-a000-000000000037',
  19,
  'Q19. How does Information Security & Cryptography handle data and execution states?',
  'Hardcoding static binary files without backup in Information Security & Cryptography.',
  'Legacy manual processing for Information Security & Cryptography.',
  'Bypassing standard security checks and protocols in Information Security & Cryptography.',
  'By utilizing structured schemas, indexes, and optimized execution pipelines.',
  'D',
  'Option D is correct. By utilizing structured schemas, indexes, and optimized execution pipelines.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000037000020',
  '00000000-0002-4000-a000-000000000037',
  20,
  'Q20. What is a recommended best practice when deploying Information Security & Cryptography?',
  'Bypassing standard security checks and protocols in Information Security & Cryptography.',
  'Legacy manual processing for Information Security & Cryptography.',
  'Conducting regular automated testing, logging, and monitoring checks.',
  'Hardcoding static binary files without backup in Information Security & Cryptography.',
  'C',
  'Option C is correct. Conducting regular automated testing, logging, and monitoring checks.'
);

-- Explore Quiz 38: ESP32 & IoT Hardware Mastery Quiz
INSERT INTO public.explore_quizzes (id, title, description, category, branch, difficulty, question_count, estimated_minutes, fx_reward, is_daily, is_published)
VALUES (
  '00000000-0002-4000-a000-000000000038',
  'ESP32 & IoT Hardware Challenge Quiz',
  'Test your knowledge on ESP32 & IoT Hardware with 20 comprehensive questions.',
  'IoT',
  'ECE',
  'Intermediate',
  20,
  8,
  15,
  FALSE,
  TRUE
);

INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000038000001',
  '00000000-0002-4000-a000-000000000038',
  1,
  'Q1. What is the primary definition of ESP32 & IoT Hardware?',
  'A core technology or standard designed for managing and executing ESP32 & IoT Hardware processes.',
  'Legacy manual processing for ESP32 & IoT Hardware.',
  'Bypassing standard security checks and protocols in ESP32 & IoT Hardware.',
  'Hardcoding static binary files without backup in ESP32 & IoT Hardware.',
  'A',
  'Option A is correct. A core technology or standard designed for managing and executing ESP32 & IoT Hardware processes.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000038000002',
  '00000000-0002-4000-a000-000000000038',
  2,
  'Q2. Which key benefit is provided by ESP32 & IoT Hardware?',
  'Bypassing standard security checks and protocols in ESP32 & IoT Hardware.',
  'Legacy manual processing for ESP32 & IoT Hardware.',
  'Improved efficiency, scalability, modularity, and operational reliability.',
  'Hardcoding static binary files without backup in ESP32 & IoT Hardware.',
  'C',
  'Option C is correct. Improved efficiency, scalability, modularity, and operational reliability.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000038000003',
  '00000000-0002-4000-a000-000000000038',
  3,
  'Q3. What is a fundamental requirement when implementing ESP32 & IoT Hardware?',
  'Legacy manual processing for ESP32 & IoT Hardware.',
  'Proper system configuration, security protocols, and integration standards.',
  'Bypassing standard security checks and protocols in ESP32 & IoT Hardware.',
  'Hardcoding static binary files without backup in ESP32 & IoT Hardware.',
  'B',
  'Option B is correct. Proper system configuration, security protocols, and integration standards.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000038000004',
  '00000000-0002-4000-a000-000000000038',
  4,
  'Q4. How does ESP32 & IoT Hardware handle data and execution states?',
  'By utilizing structured schemas, indexes, and optimized execution pipelines.',
  'Legacy manual processing for ESP32 & IoT Hardware.',
  'Bypassing standard security checks and protocols in ESP32 & IoT Hardware.',
  'Hardcoding static binary files without backup in ESP32 & IoT Hardware.',
  'A',
  'Option A is correct. By utilizing structured schemas, indexes, and optimized execution pipelines.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000038000005',
  '00000000-0002-4000-a000-000000000038',
  5,
  'Q5. What is a recommended best practice when deploying ESP32 & IoT Hardware?',
  'Hardcoding static binary files without backup in ESP32 & IoT Hardware.',
  'Legacy manual processing for ESP32 & IoT Hardware.',
  'Bypassing standard security checks and protocols in ESP32 & IoT Hardware.',
  'Conducting regular automated testing, logging, and monitoring checks.',
  'D',
  'Option D is correct. Conducting regular automated testing, logging, and monitoring checks.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000038000006',
  '00000000-0002-4000-a000-000000000038',
  6,
  'Q6. Which layer or component plays a vital role in ESP32 & IoT Hardware?',
  'Hardcoding static binary files without backup in ESP32 & IoT Hardware.',
  'Legacy manual processing for ESP32 & IoT Hardware.',
  'Bypassing standard security checks and protocols in ESP32 & IoT Hardware.',
  'The central execution handler and protocol controller.',
  'D',
  'Option D is correct. The central execution handler and protocol controller.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000038000007',
  '00000000-0002-4000-a000-000000000038',
  7,
  'Q7. What is a common bottleneck or challenge in ESP32 & IoT Hardware?',
  'Bypassing standard security checks and protocols in ESP32 & IoT Hardware.',
  'Legacy manual processing for ESP32 & IoT Hardware.',
  'Managing system state synchronization and resource contention under heavy load.',
  'Hardcoding static binary files without backup in ESP32 & IoT Hardware.',
  'C',
  'Option C is correct. Managing system state synchronization and resource contention under heavy load.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000038000008',
  '00000000-0002-4000-a000-000000000038',
  8,
  'Q8. How is security typically enforced within ESP32 & IoT Hardware?',
  'Legacy manual processing for ESP32 & IoT Hardware.',
  'Through strong authentication, access control permissions, and data encryption.',
  'Bypassing standard security checks and protocols in ESP32 & IoT Hardware.',
  'Hardcoding static binary files without backup in ESP32 & IoT Hardware.',
  'B',
  'Option B is correct. Through strong authentication, access control permissions, and data encryption.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000038000009',
  '00000000-0002-4000-a000-000000000038',
  9,
  'Q9. Which metric is critical for measuring the performance of ESP32 & IoT Hardware?',
  'Legacy manual processing for ESP32 & IoT Hardware.',
  'Response latency, throughput, resource utilization, and error rates.',
  'Bypassing standard security checks and protocols in ESP32 & IoT Hardware.',
  'Hardcoding static binary files without backup in ESP32 & IoT Hardware.',
  'B',
  'Option B is correct. Response latency, throughput, resource utilization, and error rates.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000038000010',
  '00000000-0002-4000-a000-000000000038',
  10,
  'Q10. What is the role of versioning in ESP32 & IoT Hardware?',
  'Legacy manual processing for ESP32 & IoT Hardware.',
  'To support safe updates, maintain backward compatibility, and enable rollbacks.',
  'Bypassing standard security checks and protocols in ESP32 & IoT Hardware.',
  'Hardcoding static binary files without backup in ESP32 & IoT Hardware.',
  'B',
  'Option B is correct. To support safe updates, maintain backward compatibility, and enable rollbacks.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000038000011',
  '00000000-0002-4000-a000-000000000038',
  11,
  'Q11. In what scenario is ESP32 & IoT Hardware most effectively applied?',
  'Hardcoding static binary files without backup in ESP32 & IoT Hardware.',
  'Legacy manual processing for ESP32 & IoT Hardware.',
  'Bypassing standard security checks and protocols in ESP32 & IoT Hardware.',
  'In modern scalable enterprise systems requiring structured workflows and reliability.',
  'D',
  'Option D is correct. In modern scalable enterprise systems requiring structured workflows and reliability.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000038000012',
  '00000000-0002-4000-a000-000000000038',
  12,
  'Q12. Which tool or interface is standard for interacting with ESP32 & IoT Hardware?',
  'Bypassing standard security checks and protocols in ESP32 & IoT Hardware.',
  'Legacy manual processing for ESP32 & IoT Hardware.',
  'Dedicated command line tools, SDK APIs, and management dashboards.',
  'Hardcoding static binary files without backup in ESP32 & IoT Hardware.',
  'C',
  'Option C is correct. Dedicated command line tools, SDK APIs, and management dashboards.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000038000013',
  '00000000-0002-4000-a000-000000000038',
  13,
  'Q13. What is the initial phase when developing with ESP32 & IoT Hardware?',
  'Bypassing standard security checks and protocols in ESP32 & IoT Hardware.',
  'Legacy manual processing for ESP32 & IoT Hardware.',
  'Defining requirements, setting up the development environment, and configuring dependencies.',
  'Hardcoding static binary files without backup in ESP32 & IoT Hardware.',
  'C',
  'Option C is correct. Defining requirements, setting up the development environment, and configuring dependencies.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000038000014',
  '00000000-0002-4000-a000-000000000038',
  14,
  'Q14. Which debugging technique is recommended for ESP32 & IoT Hardware?',
  'Inspecting log trace files, using debugger tools, and verifying stack traces.',
  'Legacy manual processing for ESP32 & IoT Hardware.',
  'Bypassing standard security checks and protocols in ESP32 & IoT Hardware.',
  'Hardcoding static binary files without backup in ESP32 & IoT Hardware.',
  'A',
  'Option A is correct. Inspecting log trace files, using debugger tools, and verifying stack traces.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000038000015',
  '00000000-0002-4000-a000-000000000038',
  15,
  'Q15. What is the overall goal of mastering ESP32 & IoT Hardware?',
  'Legacy manual processing for ESP32 & IoT Hardware.',
  'To design, build, and maintain production-ready technology solutions.',
  'Bypassing standard security checks and protocols in ESP32 & IoT Hardware.',
  'Hardcoding static binary files without backup in ESP32 & IoT Hardware.',
  'B',
  'Option B is correct. To design, build, and maintain production-ready technology solutions.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000038000016',
  '00000000-0002-4000-a000-000000000038',
  16,
  'Q16. What is the primary definition of ESP32 & IoT Hardware?',
  'Hardcoding static binary files without backup in ESP32 & IoT Hardware.',
  'Legacy manual processing for ESP32 & IoT Hardware.',
  'Bypassing standard security checks and protocols in ESP32 & IoT Hardware.',
  'A core technology or standard designed for managing and executing ESP32 & IoT Hardware processes.',
  'D',
  'Option D is correct. A core technology or standard designed for managing and executing ESP32 & IoT Hardware processes.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000038000017',
  '00000000-0002-4000-a000-000000000038',
  17,
  'Q17. Which key benefit is provided by ESP32 & IoT Hardware?',
  'Bypassing standard security checks and protocols in ESP32 & IoT Hardware.',
  'Legacy manual processing for ESP32 & IoT Hardware.',
  'Improved efficiency, scalability, modularity, and operational reliability.',
  'Hardcoding static binary files without backup in ESP32 & IoT Hardware.',
  'C',
  'Option C is correct. Improved efficiency, scalability, modularity, and operational reliability.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000038000018',
  '00000000-0002-4000-a000-000000000038',
  18,
  'Q18. What is a fundamental requirement when implementing ESP32 & IoT Hardware?',
  'Legacy manual processing for ESP32 & IoT Hardware.',
  'Proper system configuration, security protocols, and integration standards.',
  'Bypassing standard security checks and protocols in ESP32 & IoT Hardware.',
  'Hardcoding static binary files without backup in ESP32 & IoT Hardware.',
  'B',
  'Option B is correct. Proper system configuration, security protocols, and integration standards.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000038000019',
  '00000000-0002-4000-a000-000000000038',
  19,
  'Q19. How does ESP32 & IoT Hardware handle data and execution states?',
  'Bypassing standard security checks and protocols in ESP32 & IoT Hardware.',
  'Legacy manual processing for ESP32 & IoT Hardware.',
  'By utilizing structured schemas, indexes, and optimized execution pipelines.',
  'Hardcoding static binary files without backup in ESP32 & IoT Hardware.',
  'C',
  'Option C is correct. By utilizing structured schemas, indexes, and optimized execution pipelines.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000038000020',
  '00000000-0002-4000-a000-000000000038',
  20,
  'Q20. What is a recommended best practice when deploying ESP32 & IoT Hardware?',
  'Legacy manual processing for ESP32 & IoT Hardware.',
  'Conducting regular automated testing, logging, and monitoring checks.',
  'Bypassing standard security checks and protocols in ESP32 & IoT Hardware.',
  'Hardcoding static binary files without backup in ESP32 & IoT Hardware.',
  'B',
  'Option B is correct. Conducting regular automated testing, logging, and monitoring checks.'
);

-- Explore Quiz 39: Embedded Systems & Microcontrollers Mastery Quiz
INSERT INTO public.explore_quizzes (id, title, description, category, branch, difficulty, question_count, estimated_minutes, fx_reward, is_daily, is_published)
VALUES (
  '00000000-0002-4000-a000-000000000039',
  'Embedded Systems & Microcontrollers Challenge Quiz',
  'Test your knowledge on Embedded Systems & Microcontrollers with 20 comprehensive questions.',
  'Electronics',
  'ECE',
  'Intermediate',
  20,
  8,
  15,
  FALSE,
  TRUE
);

INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000039000001',
  '00000000-0002-4000-a000-000000000039',
  1,
  'Q1. What is the primary definition of Embedded Systems & Microcontrollers?',
  'Legacy manual processing for Embedded Systems & Microcontrollers.',
  'A core technology or standard designed for managing and executing Embedded Systems & Microcontrollers processes.',
  'Bypassing standard security checks and protocols in Embedded Systems & Microcontrollers.',
  'Hardcoding static binary files without backup in Embedded Systems & Microcontrollers.',
  'B',
  'Option B is correct. A core technology or standard designed for managing and executing Embedded Systems & Microcontrollers processes.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000039000002',
  '00000000-0002-4000-a000-000000000039',
  2,
  'Q2. Which key benefit is provided by Embedded Systems & Microcontrollers?',
  'Legacy manual processing for Embedded Systems & Microcontrollers.',
  'Improved efficiency, scalability, modularity, and operational reliability.',
  'Bypassing standard security checks and protocols in Embedded Systems & Microcontrollers.',
  'Hardcoding static binary files without backup in Embedded Systems & Microcontrollers.',
  'B',
  'Option B is correct. Improved efficiency, scalability, modularity, and operational reliability.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000039000003',
  '00000000-0002-4000-a000-000000000039',
  3,
  'Q3. What is a fundamental requirement when implementing Embedded Systems & Microcontrollers?',
  'Hardcoding static binary files without backup in Embedded Systems & Microcontrollers.',
  'Legacy manual processing for Embedded Systems & Microcontrollers.',
  'Bypassing standard security checks and protocols in Embedded Systems & Microcontrollers.',
  'Proper system configuration, security protocols, and integration standards.',
  'D',
  'Option D is correct. Proper system configuration, security protocols, and integration standards.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000039000004',
  '00000000-0002-4000-a000-000000000039',
  4,
  'Q4. How does Embedded Systems & Microcontrollers handle data and execution states?',
  'Hardcoding static binary files without backup in Embedded Systems & Microcontrollers.',
  'Legacy manual processing for Embedded Systems & Microcontrollers.',
  'Bypassing standard security checks and protocols in Embedded Systems & Microcontrollers.',
  'By utilizing structured schemas, indexes, and optimized execution pipelines.',
  'D',
  'Option D is correct. By utilizing structured schemas, indexes, and optimized execution pipelines.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000039000005',
  '00000000-0002-4000-a000-000000000039',
  5,
  'Q5. What is a recommended best practice when deploying Embedded Systems & Microcontrollers?',
  'Legacy manual processing for Embedded Systems & Microcontrollers.',
  'Conducting regular automated testing, logging, and monitoring checks.',
  'Bypassing standard security checks and protocols in Embedded Systems & Microcontrollers.',
  'Hardcoding static binary files without backup in Embedded Systems & Microcontrollers.',
  'B',
  'Option B is correct. Conducting regular automated testing, logging, and monitoring checks.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000039000006',
  '00000000-0002-4000-a000-000000000039',
  6,
  'Q6. Which layer or component plays a vital role in Embedded Systems & Microcontrollers?',
  'The central execution handler and protocol controller.',
  'Legacy manual processing for Embedded Systems & Microcontrollers.',
  'Bypassing standard security checks and protocols in Embedded Systems & Microcontrollers.',
  'Hardcoding static binary files without backup in Embedded Systems & Microcontrollers.',
  'A',
  'Option A is correct. The central execution handler and protocol controller.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000039000007',
  '00000000-0002-4000-a000-000000000039',
  7,
  'Q7. What is a common bottleneck or challenge in Embedded Systems & Microcontrollers?',
  'Managing system state synchronization and resource contention under heavy load.',
  'Legacy manual processing for Embedded Systems & Microcontrollers.',
  'Bypassing standard security checks and protocols in Embedded Systems & Microcontrollers.',
  'Hardcoding static binary files without backup in Embedded Systems & Microcontrollers.',
  'A',
  'Option A is correct. Managing system state synchronization and resource contention under heavy load.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000039000008',
  '00000000-0002-4000-a000-000000000039',
  8,
  'Q8. How is security typically enforced within Embedded Systems & Microcontrollers?',
  'Through strong authentication, access control permissions, and data encryption.',
  'Legacy manual processing for Embedded Systems & Microcontrollers.',
  'Bypassing standard security checks and protocols in Embedded Systems & Microcontrollers.',
  'Hardcoding static binary files without backup in Embedded Systems & Microcontrollers.',
  'A',
  'Option A is correct. Through strong authentication, access control permissions, and data encryption.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000039000009',
  '00000000-0002-4000-a000-000000000039',
  9,
  'Q9. Which metric is critical for measuring the performance of Embedded Systems & Microcontrollers?',
  'Response latency, throughput, resource utilization, and error rates.',
  'Legacy manual processing for Embedded Systems & Microcontrollers.',
  'Bypassing standard security checks and protocols in Embedded Systems & Microcontrollers.',
  'Hardcoding static binary files without backup in Embedded Systems & Microcontrollers.',
  'A',
  'Option A is correct. Response latency, throughput, resource utilization, and error rates.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000039000010',
  '00000000-0002-4000-a000-000000000039',
  10,
  'Q10. What is the role of versioning in Embedded Systems & Microcontrollers?',
  'Legacy manual processing for Embedded Systems & Microcontrollers.',
  'To support safe updates, maintain backward compatibility, and enable rollbacks.',
  'Bypassing standard security checks and protocols in Embedded Systems & Microcontrollers.',
  'Hardcoding static binary files without backup in Embedded Systems & Microcontrollers.',
  'B',
  'Option B is correct. To support safe updates, maintain backward compatibility, and enable rollbacks.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000039000011',
  '00000000-0002-4000-a000-000000000039',
  11,
  'Q11. In what scenario is Embedded Systems & Microcontrollers most effectively applied?',
  'Legacy manual processing for Embedded Systems & Microcontrollers.',
  'In modern scalable enterprise systems requiring structured workflows and reliability.',
  'Bypassing standard security checks and protocols in Embedded Systems & Microcontrollers.',
  'Hardcoding static binary files without backup in Embedded Systems & Microcontrollers.',
  'B',
  'Option B is correct. In modern scalable enterprise systems requiring structured workflows and reliability.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000039000012',
  '00000000-0002-4000-a000-000000000039',
  12,
  'Q12. Which tool or interface is standard for interacting with Embedded Systems & Microcontrollers?',
  'Hardcoding static binary files without backup in Embedded Systems & Microcontrollers.',
  'Legacy manual processing for Embedded Systems & Microcontrollers.',
  'Bypassing standard security checks and protocols in Embedded Systems & Microcontrollers.',
  'Dedicated command line tools, SDK APIs, and management dashboards.',
  'D',
  'Option D is correct. Dedicated command line tools, SDK APIs, and management dashboards.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000039000013',
  '00000000-0002-4000-a000-000000000039',
  13,
  'Q13. What is the initial phase when developing with Embedded Systems & Microcontrollers?',
  'Legacy manual processing for Embedded Systems & Microcontrollers.',
  'Defining requirements, setting up the development environment, and configuring dependencies.',
  'Bypassing standard security checks and protocols in Embedded Systems & Microcontrollers.',
  'Hardcoding static binary files without backup in Embedded Systems & Microcontrollers.',
  'B',
  'Option B is correct. Defining requirements, setting up the development environment, and configuring dependencies.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000039000014',
  '00000000-0002-4000-a000-000000000039',
  14,
  'Q14. Which debugging technique is recommended for Embedded Systems & Microcontrollers?',
  'Inspecting log trace files, using debugger tools, and verifying stack traces.',
  'Legacy manual processing for Embedded Systems & Microcontrollers.',
  'Bypassing standard security checks and protocols in Embedded Systems & Microcontrollers.',
  'Hardcoding static binary files without backup in Embedded Systems & Microcontrollers.',
  'A',
  'Option A is correct. Inspecting log trace files, using debugger tools, and verifying stack traces.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000039000015',
  '00000000-0002-4000-a000-000000000039',
  15,
  'Q15. What is the overall goal of mastering Embedded Systems & Microcontrollers?',
  'Legacy manual processing for Embedded Systems & Microcontrollers.',
  'To design, build, and maintain production-ready technology solutions.',
  'Bypassing standard security checks and protocols in Embedded Systems & Microcontrollers.',
  'Hardcoding static binary files without backup in Embedded Systems & Microcontrollers.',
  'B',
  'Option B is correct. To design, build, and maintain production-ready technology solutions.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000039000016',
  '00000000-0002-4000-a000-000000000039',
  16,
  'Q16. What is the primary definition of Embedded Systems & Microcontrollers?',
  'A core technology or standard designed for managing and executing Embedded Systems & Microcontrollers processes.',
  'Legacy manual processing for Embedded Systems & Microcontrollers.',
  'Bypassing standard security checks and protocols in Embedded Systems & Microcontrollers.',
  'Hardcoding static binary files without backup in Embedded Systems & Microcontrollers.',
  'A',
  'Option A is correct. A core technology or standard designed for managing and executing Embedded Systems & Microcontrollers processes.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000039000017',
  '00000000-0002-4000-a000-000000000039',
  17,
  'Q17. Which key benefit is provided by Embedded Systems & Microcontrollers?',
  'Improved efficiency, scalability, modularity, and operational reliability.',
  'Legacy manual processing for Embedded Systems & Microcontrollers.',
  'Bypassing standard security checks and protocols in Embedded Systems & Microcontrollers.',
  'Hardcoding static binary files without backup in Embedded Systems & Microcontrollers.',
  'A',
  'Option A is correct. Improved efficiency, scalability, modularity, and operational reliability.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000039000018',
  '00000000-0002-4000-a000-000000000039',
  18,
  'Q18. What is a fundamental requirement when implementing Embedded Systems & Microcontrollers?',
  'Hardcoding static binary files without backup in Embedded Systems & Microcontrollers.',
  'Legacy manual processing for Embedded Systems & Microcontrollers.',
  'Bypassing standard security checks and protocols in Embedded Systems & Microcontrollers.',
  'Proper system configuration, security protocols, and integration standards.',
  'D',
  'Option D is correct. Proper system configuration, security protocols, and integration standards.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000039000019',
  '00000000-0002-4000-a000-000000000039',
  19,
  'Q19. How does Embedded Systems & Microcontrollers handle data and execution states?',
  'Legacy manual processing for Embedded Systems & Microcontrollers.',
  'By utilizing structured schemas, indexes, and optimized execution pipelines.',
  'Bypassing standard security checks and protocols in Embedded Systems & Microcontrollers.',
  'Hardcoding static binary files without backup in Embedded Systems & Microcontrollers.',
  'B',
  'Option B is correct. By utilizing structured schemas, indexes, and optimized execution pipelines.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000039000020',
  '00000000-0002-4000-a000-000000000039',
  20,
  'Q20. What is a recommended best practice when deploying Embedded Systems & Microcontrollers?',
  'Bypassing standard security checks and protocols in Embedded Systems & Microcontrollers.',
  'Legacy manual processing for Embedded Systems & Microcontrollers.',
  'Conducting regular automated testing, logging, and monitoring checks.',
  'Hardcoding static binary files without backup in Embedded Systems & Microcontrollers.',
  'C',
  'Option C is correct. Conducting regular automated testing, logging, and monitoring checks.'
);

-- Explore Quiz 40: Digital Electronics Fundamentals Mastery Quiz
INSERT INTO public.explore_quizzes (id, title, description, category, branch, difficulty, question_count, estimated_minutes, fx_reward, is_daily, is_published)
VALUES (
  '00000000-0002-4000-a000-000000000040',
  'Digital Electronics Fundamentals Challenge Quiz',
  'Test your knowledge on Digital Electronics Fundamentals with 20 comprehensive questions.',
  'Electronics',
  'ECE',
  'Beginner',
  20,
  8,
  15,
  FALSE,
  TRUE
);

INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000040000001',
  '00000000-0002-4000-a000-000000000040',
  1,
  'Q1. What is the primary definition of Digital Electronics Fundamentals?',
  'Bypassing standard security checks and protocols in Digital Electronics Fundamentals.',
  'Legacy manual processing for Digital Electronics Fundamentals.',
  'A core technology or standard designed for managing and executing Digital Electronics Fundamentals processes.',
  'Hardcoding static binary files without backup in Digital Electronics Fundamentals.',
  'C',
  'Option C is correct. A core technology or standard designed for managing and executing Digital Electronics Fundamentals processes.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000040000002',
  '00000000-0002-4000-a000-000000000040',
  2,
  'Q2. Which key benefit is provided by Digital Electronics Fundamentals?',
  'Bypassing standard security checks and protocols in Digital Electronics Fundamentals.',
  'Legacy manual processing for Digital Electronics Fundamentals.',
  'Improved efficiency, scalability, modularity, and operational reliability.',
  'Hardcoding static binary files without backup in Digital Electronics Fundamentals.',
  'C',
  'Option C is correct. Improved efficiency, scalability, modularity, and operational reliability.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000040000003',
  '00000000-0002-4000-a000-000000000040',
  3,
  'Q3. What is a fundamental requirement when implementing Digital Electronics Fundamentals?',
  'Legacy manual processing for Digital Electronics Fundamentals.',
  'Proper system configuration, security protocols, and integration standards.',
  'Bypassing standard security checks and protocols in Digital Electronics Fundamentals.',
  'Hardcoding static binary files without backup in Digital Electronics Fundamentals.',
  'B',
  'Option B is correct. Proper system configuration, security protocols, and integration standards.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000040000004',
  '00000000-0002-4000-a000-000000000040',
  4,
  'Q4. How does Digital Electronics Fundamentals handle data and execution states?',
  'By utilizing structured schemas, indexes, and optimized execution pipelines.',
  'Legacy manual processing for Digital Electronics Fundamentals.',
  'Bypassing standard security checks and protocols in Digital Electronics Fundamentals.',
  'Hardcoding static binary files without backup in Digital Electronics Fundamentals.',
  'A',
  'Option A is correct. By utilizing structured schemas, indexes, and optimized execution pipelines.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000040000005',
  '00000000-0002-4000-a000-000000000040',
  5,
  'Q5. What is a recommended best practice when deploying Digital Electronics Fundamentals?',
  'Conducting regular automated testing, logging, and monitoring checks.',
  'Legacy manual processing for Digital Electronics Fundamentals.',
  'Bypassing standard security checks and protocols in Digital Electronics Fundamentals.',
  'Hardcoding static binary files without backup in Digital Electronics Fundamentals.',
  'A',
  'Option A is correct. Conducting regular automated testing, logging, and monitoring checks.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000040000006',
  '00000000-0002-4000-a000-000000000040',
  6,
  'Q6. Which layer or component plays a vital role in Digital Electronics Fundamentals?',
  'The central execution handler and protocol controller.',
  'Legacy manual processing for Digital Electronics Fundamentals.',
  'Bypassing standard security checks and protocols in Digital Electronics Fundamentals.',
  'Hardcoding static binary files without backup in Digital Electronics Fundamentals.',
  'A',
  'Option A is correct. The central execution handler and protocol controller.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000040000007',
  '00000000-0002-4000-a000-000000000040',
  7,
  'Q7. What is a common bottleneck or challenge in Digital Electronics Fundamentals?',
  'Bypassing standard security checks and protocols in Digital Electronics Fundamentals.',
  'Legacy manual processing for Digital Electronics Fundamentals.',
  'Managing system state synchronization and resource contention under heavy load.',
  'Hardcoding static binary files without backup in Digital Electronics Fundamentals.',
  'C',
  'Option C is correct. Managing system state synchronization and resource contention under heavy load.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000040000008',
  '00000000-0002-4000-a000-000000000040',
  8,
  'Q8. How is security typically enforced within Digital Electronics Fundamentals?',
  'Hardcoding static binary files without backup in Digital Electronics Fundamentals.',
  'Legacy manual processing for Digital Electronics Fundamentals.',
  'Bypassing standard security checks and protocols in Digital Electronics Fundamentals.',
  'Through strong authentication, access control permissions, and data encryption.',
  'D',
  'Option D is correct. Through strong authentication, access control permissions, and data encryption.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000040000009',
  '00000000-0002-4000-a000-000000000040',
  9,
  'Q9. Which metric is critical for measuring the performance of Digital Electronics Fundamentals?',
  'Bypassing standard security checks and protocols in Digital Electronics Fundamentals.',
  'Legacy manual processing for Digital Electronics Fundamentals.',
  'Response latency, throughput, resource utilization, and error rates.',
  'Hardcoding static binary files without backup in Digital Electronics Fundamentals.',
  'C',
  'Option C is correct. Response latency, throughput, resource utilization, and error rates.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000040000010',
  '00000000-0002-4000-a000-000000000040',
  10,
  'Q10. What is the role of versioning in Digital Electronics Fundamentals?',
  'Legacy manual processing for Digital Electronics Fundamentals.',
  'To support safe updates, maintain backward compatibility, and enable rollbacks.',
  'Bypassing standard security checks and protocols in Digital Electronics Fundamentals.',
  'Hardcoding static binary files without backup in Digital Electronics Fundamentals.',
  'B',
  'Option B is correct. To support safe updates, maintain backward compatibility, and enable rollbacks.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000040000011',
  '00000000-0002-4000-a000-000000000040',
  11,
  'Q11. In what scenario is Digital Electronics Fundamentals most effectively applied?',
  'Hardcoding static binary files without backup in Digital Electronics Fundamentals.',
  'Legacy manual processing for Digital Electronics Fundamentals.',
  'Bypassing standard security checks and protocols in Digital Electronics Fundamentals.',
  'In modern scalable enterprise systems requiring structured workflows and reliability.',
  'D',
  'Option D is correct. In modern scalable enterprise systems requiring structured workflows and reliability.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000040000012',
  '00000000-0002-4000-a000-000000000040',
  12,
  'Q12. Which tool or interface is standard for interacting with Digital Electronics Fundamentals?',
  'Bypassing standard security checks and protocols in Digital Electronics Fundamentals.',
  'Legacy manual processing for Digital Electronics Fundamentals.',
  'Dedicated command line tools, SDK APIs, and management dashboards.',
  'Hardcoding static binary files without backup in Digital Electronics Fundamentals.',
  'C',
  'Option C is correct. Dedicated command line tools, SDK APIs, and management dashboards.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000040000013',
  '00000000-0002-4000-a000-000000000040',
  13,
  'Q13. What is the initial phase when developing with Digital Electronics Fundamentals?',
  'Hardcoding static binary files without backup in Digital Electronics Fundamentals.',
  'Legacy manual processing for Digital Electronics Fundamentals.',
  'Bypassing standard security checks and protocols in Digital Electronics Fundamentals.',
  'Defining requirements, setting up the development environment, and configuring dependencies.',
  'D',
  'Option D is correct. Defining requirements, setting up the development environment, and configuring dependencies.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000040000014',
  '00000000-0002-4000-a000-000000000040',
  14,
  'Q14. Which debugging technique is recommended for Digital Electronics Fundamentals?',
  'Bypassing standard security checks and protocols in Digital Electronics Fundamentals.',
  'Legacy manual processing for Digital Electronics Fundamentals.',
  'Inspecting log trace files, using debugger tools, and verifying stack traces.',
  'Hardcoding static binary files without backup in Digital Electronics Fundamentals.',
  'C',
  'Option C is correct. Inspecting log trace files, using debugger tools, and verifying stack traces.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000040000015',
  '00000000-0002-4000-a000-000000000040',
  15,
  'Q15. What is the overall goal of mastering Digital Electronics Fundamentals?',
  'To design, build, and maintain production-ready technology solutions.',
  'Legacy manual processing for Digital Electronics Fundamentals.',
  'Bypassing standard security checks and protocols in Digital Electronics Fundamentals.',
  'Hardcoding static binary files without backup in Digital Electronics Fundamentals.',
  'A',
  'Option A is correct. To design, build, and maintain production-ready technology solutions.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000040000016',
  '00000000-0002-4000-a000-000000000040',
  16,
  'Q16. What is the primary definition of Digital Electronics Fundamentals?',
  'Bypassing standard security checks and protocols in Digital Electronics Fundamentals.',
  'Legacy manual processing for Digital Electronics Fundamentals.',
  'A core technology or standard designed for managing and executing Digital Electronics Fundamentals processes.',
  'Hardcoding static binary files without backup in Digital Electronics Fundamentals.',
  'C',
  'Option C is correct. A core technology or standard designed for managing and executing Digital Electronics Fundamentals processes.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000040000017',
  '00000000-0002-4000-a000-000000000040',
  17,
  'Q17. Which key benefit is provided by Digital Electronics Fundamentals?',
  'Hardcoding static binary files without backup in Digital Electronics Fundamentals.',
  'Legacy manual processing for Digital Electronics Fundamentals.',
  'Bypassing standard security checks and protocols in Digital Electronics Fundamentals.',
  'Improved efficiency, scalability, modularity, and operational reliability.',
  'D',
  'Option D is correct. Improved efficiency, scalability, modularity, and operational reliability.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000040000018',
  '00000000-0002-4000-a000-000000000040',
  18,
  'Q18. What is a fundamental requirement when implementing Digital Electronics Fundamentals?',
  'Bypassing standard security checks and protocols in Digital Electronics Fundamentals.',
  'Legacy manual processing for Digital Electronics Fundamentals.',
  'Proper system configuration, security protocols, and integration standards.',
  'Hardcoding static binary files without backup in Digital Electronics Fundamentals.',
  'C',
  'Option C is correct. Proper system configuration, security protocols, and integration standards.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000040000019',
  '00000000-0002-4000-a000-000000000040',
  19,
  'Q19. How does Digital Electronics Fundamentals handle data and execution states?',
  'Bypassing standard security checks and protocols in Digital Electronics Fundamentals.',
  'Legacy manual processing for Digital Electronics Fundamentals.',
  'By utilizing structured schemas, indexes, and optimized execution pipelines.',
  'Hardcoding static binary files without backup in Digital Electronics Fundamentals.',
  'C',
  'Option C is correct. By utilizing structured schemas, indexes, and optimized execution pipelines.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000040000020',
  '00000000-0002-4000-a000-000000000040',
  20,
  'Q20. What is a recommended best practice when deploying Digital Electronics Fundamentals?',
  'Bypassing standard security checks and protocols in Digital Electronics Fundamentals.',
  'Legacy manual processing for Digital Electronics Fundamentals.',
  'Conducting regular automated testing, logging, and monitoring checks.',
  'Hardcoding static binary files without backup in Digital Electronics Fundamentals.',
  'C',
  'Option C is correct. Conducting regular automated testing, logging, and monitoring checks.'
);

-- Explore Quiz 41: Signal Processing & Communication Mastery Quiz
INSERT INTO public.explore_quizzes (id, title, description, category, branch, difficulty, question_count, estimated_minutes, fx_reward, is_daily, is_published)
VALUES (
  '00000000-0002-4000-a000-000000000041',
  'Signal Processing & Communication Challenge Quiz',
  'Test your knowledge on Signal Processing & Communication with 20 comprehensive questions.',
  'Telecom',
  'ECE',
  'Intermediate',
  20,
  8,
  15,
  FALSE,
  TRUE
);

INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000041000001',
  '00000000-0002-4000-a000-000000000041',
  1,
  'Q1. What is the primary definition of Signal Processing & Communication?',
  'Legacy manual processing for Signal Processing & Communication.',
  'A core technology or standard designed for managing and executing Signal Processing & Communication processes.',
  'Bypassing standard security checks and protocols in Signal Processing & Communication.',
  'Hardcoding static binary files without backup in Signal Processing & Communication.',
  'B',
  'Option B is correct. A core technology or standard designed for managing and executing Signal Processing & Communication processes.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000041000002',
  '00000000-0002-4000-a000-000000000041',
  2,
  'Q2. Which key benefit is provided by Signal Processing & Communication?',
  'Legacy manual processing for Signal Processing & Communication.',
  'Improved efficiency, scalability, modularity, and operational reliability.',
  'Bypassing standard security checks and protocols in Signal Processing & Communication.',
  'Hardcoding static binary files without backup in Signal Processing & Communication.',
  'B',
  'Option B is correct. Improved efficiency, scalability, modularity, and operational reliability.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000041000003',
  '00000000-0002-4000-a000-000000000041',
  3,
  'Q3. What is a fundamental requirement when implementing Signal Processing & Communication?',
  'Proper system configuration, security protocols, and integration standards.',
  'Legacy manual processing for Signal Processing & Communication.',
  'Bypassing standard security checks and protocols in Signal Processing & Communication.',
  'Hardcoding static binary files without backup in Signal Processing & Communication.',
  'A',
  'Option A is correct. Proper system configuration, security protocols, and integration standards.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000041000004',
  '00000000-0002-4000-a000-000000000041',
  4,
  'Q4. How does Signal Processing & Communication handle data and execution states?',
  'Legacy manual processing for Signal Processing & Communication.',
  'By utilizing structured schemas, indexes, and optimized execution pipelines.',
  'Bypassing standard security checks and protocols in Signal Processing & Communication.',
  'Hardcoding static binary files without backup in Signal Processing & Communication.',
  'B',
  'Option B is correct. By utilizing structured schemas, indexes, and optimized execution pipelines.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000041000005',
  '00000000-0002-4000-a000-000000000041',
  5,
  'Q5. What is a recommended best practice when deploying Signal Processing & Communication?',
  'Legacy manual processing for Signal Processing & Communication.',
  'Conducting regular automated testing, logging, and monitoring checks.',
  'Bypassing standard security checks and protocols in Signal Processing & Communication.',
  'Hardcoding static binary files without backup in Signal Processing & Communication.',
  'B',
  'Option B is correct. Conducting regular automated testing, logging, and monitoring checks.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000041000006',
  '00000000-0002-4000-a000-000000000041',
  6,
  'Q6. Which layer or component plays a vital role in Signal Processing & Communication?',
  'Hardcoding static binary files without backup in Signal Processing & Communication.',
  'Legacy manual processing for Signal Processing & Communication.',
  'Bypassing standard security checks and protocols in Signal Processing & Communication.',
  'The central execution handler and protocol controller.',
  'D',
  'Option D is correct. The central execution handler and protocol controller.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000041000007',
  '00000000-0002-4000-a000-000000000041',
  7,
  'Q7. What is a common bottleneck or challenge in Signal Processing & Communication?',
  'Legacy manual processing for Signal Processing & Communication.',
  'Managing system state synchronization and resource contention under heavy load.',
  'Bypassing standard security checks and protocols in Signal Processing & Communication.',
  'Hardcoding static binary files without backup in Signal Processing & Communication.',
  'B',
  'Option B is correct. Managing system state synchronization and resource contention under heavy load.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000041000008',
  '00000000-0002-4000-a000-000000000041',
  8,
  'Q8. How is security typically enforced within Signal Processing & Communication?',
  'Legacy manual processing for Signal Processing & Communication.',
  'Through strong authentication, access control permissions, and data encryption.',
  'Bypassing standard security checks and protocols in Signal Processing & Communication.',
  'Hardcoding static binary files without backup in Signal Processing & Communication.',
  'B',
  'Option B is correct. Through strong authentication, access control permissions, and data encryption.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000041000009',
  '00000000-0002-4000-a000-000000000041',
  9,
  'Q9. Which metric is critical for measuring the performance of Signal Processing & Communication?',
  'Bypassing standard security checks and protocols in Signal Processing & Communication.',
  'Legacy manual processing for Signal Processing & Communication.',
  'Response latency, throughput, resource utilization, and error rates.',
  'Hardcoding static binary files without backup in Signal Processing & Communication.',
  'C',
  'Option C is correct. Response latency, throughput, resource utilization, and error rates.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000041000010',
  '00000000-0002-4000-a000-000000000041',
  10,
  'Q10. What is the role of versioning in Signal Processing & Communication?',
  'Legacy manual processing for Signal Processing & Communication.',
  'To support safe updates, maintain backward compatibility, and enable rollbacks.',
  'Bypassing standard security checks and protocols in Signal Processing & Communication.',
  'Hardcoding static binary files without backup in Signal Processing & Communication.',
  'B',
  'Option B is correct. To support safe updates, maintain backward compatibility, and enable rollbacks.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000041000011',
  '00000000-0002-4000-a000-000000000041',
  11,
  'Q11. In what scenario is Signal Processing & Communication most effectively applied?',
  'Legacy manual processing for Signal Processing & Communication.',
  'In modern scalable enterprise systems requiring structured workflows and reliability.',
  'Bypassing standard security checks and protocols in Signal Processing & Communication.',
  'Hardcoding static binary files without backup in Signal Processing & Communication.',
  'B',
  'Option B is correct. In modern scalable enterprise systems requiring structured workflows and reliability.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000041000012',
  '00000000-0002-4000-a000-000000000041',
  12,
  'Q12. Which tool or interface is standard for interacting with Signal Processing & Communication?',
  'Legacy manual processing for Signal Processing & Communication.',
  'Dedicated command line tools, SDK APIs, and management dashboards.',
  'Bypassing standard security checks and protocols in Signal Processing & Communication.',
  'Hardcoding static binary files without backup in Signal Processing & Communication.',
  'B',
  'Option B is correct. Dedicated command line tools, SDK APIs, and management dashboards.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000041000013',
  '00000000-0002-4000-a000-000000000041',
  13,
  'Q13. What is the initial phase when developing with Signal Processing & Communication?',
  'Bypassing standard security checks and protocols in Signal Processing & Communication.',
  'Legacy manual processing for Signal Processing & Communication.',
  'Defining requirements, setting up the development environment, and configuring dependencies.',
  'Hardcoding static binary files without backup in Signal Processing & Communication.',
  'C',
  'Option C is correct. Defining requirements, setting up the development environment, and configuring dependencies.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000041000014',
  '00000000-0002-4000-a000-000000000041',
  14,
  'Q14. Which debugging technique is recommended for Signal Processing & Communication?',
  'Inspecting log trace files, using debugger tools, and verifying stack traces.',
  'Legacy manual processing for Signal Processing & Communication.',
  'Bypassing standard security checks and protocols in Signal Processing & Communication.',
  'Hardcoding static binary files without backup in Signal Processing & Communication.',
  'A',
  'Option A is correct. Inspecting log trace files, using debugger tools, and verifying stack traces.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000041000015',
  '00000000-0002-4000-a000-000000000041',
  15,
  'Q15. What is the overall goal of mastering Signal Processing & Communication?',
  'Legacy manual processing for Signal Processing & Communication.',
  'To design, build, and maintain production-ready technology solutions.',
  'Bypassing standard security checks and protocols in Signal Processing & Communication.',
  'Hardcoding static binary files without backup in Signal Processing & Communication.',
  'B',
  'Option B is correct. To design, build, and maintain production-ready technology solutions.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000041000016',
  '00000000-0002-4000-a000-000000000041',
  16,
  'Q16. What is the primary definition of Signal Processing & Communication?',
  'Legacy manual processing for Signal Processing & Communication.',
  'A core technology or standard designed for managing and executing Signal Processing & Communication processes.',
  'Bypassing standard security checks and protocols in Signal Processing & Communication.',
  'Hardcoding static binary files without backup in Signal Processing & Communication.',
  'B',
  'Option B is correct. A core technology or standard designed for managing and executing Signal Processing & Communication processes.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000041000017',
  '00000000-0002-4000-a000-000000000041',
  17,
  'Q17. Which key benefit is provided by Signal Processing & Communication?',
  'Improved efficiency, scalability, modularity, and operational reliability.',
  'Legacy manual processing for Signal Processing & Communication.',
  'Bypassing standard security checks and protocols in Signal Processing & Communication.',
  'Hardcoding static binary files without backup in Signal Processing & Communication.',
  'A',
  'Option A is correct. Improved efficiency, scalability, modularity, and operational reliability.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000041000018',
  '00000000-0002-4000-a000-000000000041',
  18,
  'Q18. What is a fundamental requirement when implementing Signal Processing & Communication?',
  'Proper system configuration, security protocols, and integration standards.',
  'Legacy manual processing for Signal Processing & Communication.',
  'Bypassing standard security checks and protocols in Signal Processing & Communication.',
  'Hardcoding static binary files without backup in Signal Processing & Communication.',
  'A',
  'Option A is correct. Proper system configuration, security protocols, and integration standards.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000041000019',
  '00000000-0002-4000-a000-000000000041',
  19,
  'Q19. How does Signal Processing & Communication handle data and execution states?',
  'Hardcoding static binary files without backup in Signal Processing & Communication.',
  'Legacy manual processing for Signal Processing & Communication.',
  'Bypassing standard security checks and protocols in Signal Processing & Communication.',
  'By utilizing structured schemas, indexes, and optimized execution pipelines.',
  'D',
  'Option D is correct. By utilizing structured schemas, indexes, and optimized execution pipelines.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000041000020',
  '00000000-0002-4000-a000-000000000041',
  20,
  'Q20. What is a recommended best practice when deploying Signal Processing & Communication?',
  'Legacy manual processing for Signal Processing & Communication.',
  'Conducting regular automated testing, logging, and monitoring checks.',
  'Bypassing standard security checks and protocols in Signal Processing & Communication.',
  'Hardcoding static binary files without backup in Signal Processing & Communication.',
  'B',
  'Option B is correct. Conducting regular automated testing, logging, and monitoring checks.'
);

-- Explore Quiz 42: Electrical Machines & Drives Mastery Quiz
INSERT INTO public.explore_quizzes (id, title, description, category, branch, difficulty, question_count, estimated_minutes, fx_reward, is_daily, is_published)
VALUES (
  '00000000-0002-4000-a000-000000000042',
  'Electrical Machines & Drives Challenge Quiz',
  'Test your knowledge on Electrical Machines & Drives with 20 comprehensive questions.',
  'Electrical',
  'EEE',
  'Intermediate',
  20,
  8,
  15,
  FALSE,
  TRUE
);

INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000042000001',
  '00000000-0002-4000-a000-000000000042',
  1,
  'Q1. What is the primary definition of Electrical Machines & Drives?',
  'Legacy manual processing for Electrical Machines & Drives.',
  'A core technology or standard designed for managing and executing Electrical Machines & Drives processes.',
  'Bypassing standard security checks and protocols in Electrical Machines & Drives.',
  'Hardcoding static binary files without backup in Electrical Machines & Drives.',
  'B',
  'Option B is correct. A core technology or standard designed for managing and executing Electrical Machines & Drives processes.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000042000002',
  '00000000-0002-4000-a000-000000000042',
  2,
  'Q2. Which key benefit is provided by Electrical Machines & Drives?',
  'Bypassing standard security checks and protocols in Electrical Machines & Drives.',
  'Legacy manual processing for Electrical Machines & Drives.',
  'Improved efficiency, scalability, modularity, and operational reliability.',
  'Hardcoding static binary files without backup in Electrical Machines & Drives.',
  'C',
  'Option C is correct. Improved efficiency, scalability, modularity, and operational reliability.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000042000003',
  '00000000-0002-4000-a000-000000000042',
  3,
  'Q3. What is a fundamental requirement when implementing Electrical Machines & Drives?',
  'Hardcoding static binary files without backup in Electrical Machines & Drives.',
  'Legacy manual processing for Electrical Machines & Drives.',
  'Bypassing standard security checks and protocols in Electrical Machines & Drives.',
  'Proper system configuration, security protocols, and integration standards.',
  'D',
  'Option D is correct. Proper system configuration, security protocols, and integration standards.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000042000004',
  '00000000-0002-4000-a000-000000000042',
  4,
  'Q4. How does Electrical Machines & Drives handle data and execution states?',
  'Bypassing standard security checks and protocols in Electrical Machines & Drives.',
  'Legacy manual processing for Electrical Machines & Drives.',
  'By utilizing structured schemas, indexes, and optimized execution pipelines.',
  'Hardcoding static binary files without backup in Electrical Machines & Drives.',
  'C',
  'Option C is correct. By utilizing structured schemas, indexes, and optimized execution pipelines.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000042000005',
  '00000000-0002-4000-a000-000000000042',
  5,
  'Q5. What is a recommended best practice when deploying Electrical Machines & Drives?',
  'Bypassing standard security checks and protocols in Electrical Machines & Drives.',
  'Legacy manual processing for Electrical Machines & Drives.',
  'Conducting regular automated testing, logging, and monitoring checks.',
  'Hardcoding static binary files without backup in Electrical Machines & Drives.',
  'C',
  'Option C is correct. Conducting regular automated testing, logging, and monitoring checks.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000042000006',
  '00000000-0002-4000-a000-000000000042',
  6,
  'Q6. Which layer or component plays a vital role in Electrical Machines & Drives?',
  'The central execution handler and protocol controller.',
  'Legacy manual processing for Electrical Machines & Drives.',
  'Bypassing standard security checks and protocols in Electrical Machines & Drives.',
  'Hardcoding static binary files without backup in Electrical Machines & Drives.',
  'A',
  'Option A is correct. The central execution handler and protocol controller.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000042000007',
  '00000000-0002-4000-a000-000000000042',
  7,
  'Q7. What is a common bottleneck or challenge in Electrical Machines & Drives?',
  'Bypassing standard security checks and protocols in Electrical Machines & Drives.',
  'Legacy manual processing for Electrical Machines & Drives.',
  'Managing system state synchronization and resource contention under heavy load.',
  'Hardcoding static binary files without backup in Electrical Machines & Drives.',
  'C',
  'Option C is correct. Managing system state synchronization and resource contention under heavy load.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000042000008',
  '00000000-0002-4000-a000-000000000042',
  8,
  'Q8. How is security typically enforced within Electrical Machines & Drives?',
  'Legacy manual processing for Electrical Machines & Drives.',
  'Through strong authentication, access control permissions, and data encryption.',
  'Bypassing standard security checks and protocols in Electrical Machines & Drives.',
  'Hardcoding static binary files without backup in Electrical Machines & Drives.',
  'B',
  'Option B is correct. Through strong authentication, access control permissions, and data encryption.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000042000009',
  '00000000-0002-4000-a000-000000000042',
  9,
  'Q9. Which metric is critical for measuring the performance of Electrical Machines & Drives?',
  'Bypassing standard security checks and protocols in Electrical Machines & Drives.',
  'Legacy manual processing for Electrical Machines & Drives.',
  'Response latency, throughput, resource utilization, and error rates.',
  'Hardcoding static binary files without backup in Electrical Machines & Drives.',
  'C',
  'Option C is correct. Response latency, throughput, resource utilization, and error rates.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000042000010',
  '00000000-0002-4000-a000-000000000042',
  10,
  'Q10. What is the role of versioning in Electrical Machines & Drives?',
  'Hardcoding static binary files without backup in Electrical Machines & Drives.',
  'Legacy manual processing for Electrical Machines & Drives.',
  'Bypassing standard security checks and protocols in Electrical Machines & Drives.',
  'To support safe updates, maintain backward compatibility, and enable rollbacks.',
  'D',
  'Option D is correct. To support safe updates, maintain backward compatibility, and enable rollbacks.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000042000011',
  '00000000-0002-4000-a000-000000000042',
  11,
  'Q11. In what scenario is Electrical Machines & Drives most effectively applied?',
  'Hardcoding static binary files without backup in Electrical Machines & Drives.',
  'Legacy manual processing for Electrical Machines & Drives.',
  'Bypassing standard security checks and protocols in Electrical Machines & Drives.',
  'In modern scalable enterprise systems requiring structured workflows and reliability.',
  'D',
  'Option D is correct. In modern scalable enterprise systems requiring structured workflows and reliability.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000042000012',
  '00000000-0002-4000-a000-000000000042',
  12,
  'Q12. Which tool or interface is standard for interacting with Electrical Machines & Drives?',
  'Bypassing standard security checks and protocols in Electrical Machines & Drives.',
  'Legacy manual processing for Electrical Machines & Drives.',
  'Dedicated command line tools, SDK APIs, and management dashboards.',
  'Hardcoding static binary files without backup in Electrical Machines & Drives.',
  'C',
  'Option C is correct. Dedicated command line tools, SDK APIs, and management dashboards.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000042000013',
  '00000000-0002-4000-a000-000000000042',
  13,
  'Q13. What is the initial phase when developing with Electrical Machines & Drives?',
  'Hardcoding static binary files without backup in Electrical Machines & Drives.',
  'Legacy manual processing for Electrical Machines & Drives.',
  'Bypassing standard security checks and protocols in Electrical Machines & Drives.',
  'Defining requirements, setting up the development environment, and configuring dependencies.',
  'D',
  'Option D is correct. Defining requirements, setting up the development environment, and configuring dependencies.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000042000014',
  '00000000-0002-4000-a000-000000000042',
  14,
  'Q14. Which debugging technique is recommended for Electrical Machines & Drives?',
  'Inspecting log trace files, using debugger tools, and verifying stack traces.',
  'Legacy manual processing for Electrical Machines & Drives.',
  'Bypassing standard security checks and protocols in Electrical Machines & Drives.',
  'Hardcoding static binary files without backup in Electrical Machines & Drives.',
  'A',
  'Option A is correct. Inspecting log trace files, using debugger tools, and verifying stack traces.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000042000015',
  '00000000-0002-4000-a000-000000000042',
  15,
  'Q15. What is the overall goal of mastering Electrical Machines & Drives?',
  'Legacy manual processing for Electrical Machines & Drives.',
  'To design, build, and maintain production-ready technology solutions.',
  'Bypassing standard security checks and protocols in Electrical Machines & Drives.',
  'Hardcoding static binary files without backup in Electrical Machines & Drives.',
  'B',
  'Option B is correct. To design, build, and maintain production-ready technology solutions.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000042000016',
  '00000000-0002-4000-a000-000000000042',
  16,
  'Q16. What is the primary definition of Electrical Machines & Drives?',
  'Bypassing standard security checks and protocols in Electrical Machines & Drives.',
  'Legacy manual processing for Electrical Machines & Drives.',
  'A core technology or standard designed for managing and executing Electrical Machines & Drives processes.',
  'Hardcoding static binary files without backup in Electrical Machines & Drives.',
  'C',
  'Option C is correct. A core technology or standard designed for managing and executing Electrical Machines & Drives processes.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000042000017',
  '00000000-0002-4000-a000-000000000042',
  17,
  'Q17. Which key benefit is provided by Electrical Machines & Drives?',
  'Improved efficiency, scalability, modularity, and operational reliability.',
  'Legacy manual processing for Electrical Machines & Drives.',
  'Bypassing standard security checks and protocols in Electrical Machines & Drives.',
  'Hardcoding static binary files without backup in Electrical Machines & Drives.',
  'A',
  'Option A is correct. Improved efficiency, scalability, modularity, and operational reliability.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000042000018',
  '00000000-0002-4000-a000-000000000042',
  18,
  'Q18. What is a fundamental requirement when implementing Electrical Machines & Drives?',
  'Legacy manual processing for Electrical Machines & Drives.',
  'Proper system configuration, security protocols, and integration standards.',
  'Bypassing standard security checks and protocols in Electrical Machines & Drives.',
  'Hardcoding static binary files without backup in Electrical Machines & Drives.',
  'B',
  'Option B is correct. Proper system configuration, security protocols, and integration standards.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000042000019',
  '00000000-0002-4000-a000-000000000042',
  19,
  'Q19. How does Electrical Machines & Drives handle data and execution states?',
  'Hardcoding static binary files without backup in Electrical Machines & Drives.',
  'Legacy manual processing for Electrical Machines & Drives.',
  'Bypassing standard security checks and protocols in Electrical Machines & Drives.',
  'By utilizing structured schemas, indexes, and optimized execution pipelines.',
  'D',
  'Option D is correct. By utilizing structured schemas, indexes, and optimized execution pipelines.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000042000020',
  '00000000-0002-4000-a000-000000000042',
  20,
  'Q20. What is a recommended best practice when deploying Electrical Machines & Drives?',
  'Conducting regular automated testing, logging, and monitoring checks.',
  'Legacy manual processing for Electrical Machines & Drives.',
  'Bypassing standard security checks and protocols in Electrical Machines & Drives.',
  'Hardcoding static binary files without backup in Electrical Machines & Drives.',
  'A',
  'Option A is correct. Conducting regular automated testing, logging, and monitoring checks.'
);

-- Explore Quiz 43: Thermodynamics Fundamentals Mastery Quiz
INSERT INTO public.explore_quizzes (id, title, description, category, branch, difficulty, question_count, estimated_minutes, fx_reward, is_daily, is_published)
VALUES (
  '00000000-0002-4000-a000-000000000043',
  'Thermodynamics Fundamentals Challenge Quiz',
  'Test your knowledge on Thermodynamics Fundamentals with 20 comprehensive questions.',
  'Mechanical',
  'MECH',
  'Intermediate',
  20,
  8,
  15,
  FALSE,
  TRUE
);

INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000043000001',
  '00000000-0002-4000-a000-000000000043',
  1,
  'Q1. What is the primary definition of Thermodynamics Fundamentals?',
  'Bypassing standard security checks and protocols in Thermodynamics Fundamentals.',
  'Legacy manual processing for Thermodynamics Fundamentals.',
  'A core technology or standard designed for managing and executing Thermodynamics Fundamentals processes.',
  'Hardcoding static binary files without backup in Thermodynamics Fundamentals.',
  'C',
  'Option C is correct. A core technology or standard designed for managing and executing Thermodynamics Fundamentals processes.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000043000002',
  '00000000-0002-4000-a000-000000000043',
  2,
  'Q2. Which key benefit is provided by Thermodynamics Fundamentals?',
  'Bypassing standard security checks and protocols in Thermodynamics Fundamentals.',
  'Legacy manual processing for Thermodynamics Fundamentals.',
  'Improved efficiency, scalability, modularity, and operational reliability.',
  'Hardcoding static binary files without backup in Thermodynamics Fundamentals.',
  'C',
  'Option C is correct. Improved efficiency, scalability, modularity, and operational reliability.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000043000003',
  '00000000-0002-4000-a000-000000000043',
  3,
  'Q3. What is a fundamental requirement when implementing Thermodynamics Fundamentals?',
  'Bypassing standard security checks and protocols in Thermodynamics Fundamentals.',
  'Legacy manual processing for Thermodynamics Fundamentals.',
  'Proper system configuration, security protocols, and integration standards.',
  'Hardcoding static binary files without backup in Thermodynamics Fundamentals.',
  'C',
  'Option C is correct. Proper system configuration, security protocols, and integration standards.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000043000004',
  '00000000-0002-4000-a000-000000000043',
  4,
  'Q4. How does Thermodynamics Fundamentals handle data and execution states?',
  'Bypassing standard security checks and protocols in Thermodynamics Fundamentals.',
  'Legacy manual processing for Thermodynamics Fundamentals.',
  'By utilizing structured schemas, indexes, and optimized execution pipelines.',
  'Hardcoding static binary files without backup in Thermodynamics Fundamentals.',
  'C',
  'Option C is correct. By utilizing structured schemas, indexes, and optimized execution pipelines.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000043000005',
  '00000000-0002-4000-a000-000000000043',
  5,
  'Q5. What is a recommended best practice when deploying Thermodynamics Fundamentals?',
  'Hardcoding static binary files without backup in Thermodynamics Fundamentals.',
  'Legacy manual processing for Thermodynamics Fundamentals.',
  'Bypassing standard security checks and protocols in Thermodynamics Fundamentals.',
  'Conducting regular automated testing, logging, and monitoring checks.',
  'D',
  'Option D is correct. Conducting regular automated testing, logging, and monitoring checks.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000043000006',
  '00000000-0002-4000-a000-000000000043',
  6,
  'Q6. Which layer or component plays a vital role in Thermodynamics Fundamentals?',
  'Bypassing standard security checks and protocols in Thermodynamics Fundamentals.',
  'Legacy manual processing for Thermodynamics Fundamentals.',
  'The central execution handler and protocol controller.',
  'Hardcoding static binary files without backup in Thermodynamics Fundamentals.',
  'C',
  'Option C is correct. The central execution handler and protocol controller.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000043000007',
  '00000000-0002-4000-a000-000000000043',
  7,
  'Q7. What is a common bottleneck or challenge in Thermodynamics Fundamentals?',
  'Hardcoding static binary files without backup in Thermodynamics Fundamentals.',
  'Legacy manual processing for Thermodynamics Fundamentals.',
  'Bypassing standard security checks and protocols in Thermodynamics Fundamentals.',
  'Managing system state synchronization and resource contention under heavy load.',
  'D',
  'Option D is correct. Managing system state synchronization and resource contention under heavy load.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000043000008',
  '00000000-0002-4000-a000-000000000043',
  8,
  'Q8. How is security typically enforced within Thermodynamics Fundamentals?',
  'Through strong authentication, access control permissions, and data encryption.',
  'Legacy manual processing for Thermodynamics Fundamentals.',
  'Bypassing standard security checks and protocols in Thermodynamics Fundamentals.',
  'Hardcoding static binary files without backup in Thermodynamics Fundamentals.',
  'A',
  'Option A is correct. Through strong authentication, access control permissions, and data encryption.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000043000009',
  '00000000-0002-4000-a000-000000000043',
  9,
  'Q9. Which metric is critical for measuring the performance of Thermodynamics Fundamentals?',
  'Hardcoding static binary files without backup in Thermodynamics Fundamentals.',
  'Legacy manual processing for Thermodynamics Fundamentals.',
  'Bypassing standard security checks and protocols in Thermodynamics Fundamentals.',
  'Response latency, throughput, resource utilization, and error rates.',
  'D',
  'Option D is correct. Response latency, throughput, resource utilization, and error rates.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000043000010',
  '00000000-0002-4000-a000-000000000043',
  10,
  'Q10. What is the role of versioning in Thermodynamics Fundamentals?',
  'Bypassing standard security checks and protocols in Thermodynamics Fundamentals.',
  'Legacy manual processing for Thermodynamics Fundamentals.',
  'To support safe updates, maintain backward compatibility, and enable rollbacks.',
  'Hardcoding static binary files without backup in Thermodynamics Fundamentals.',
  'C',
  'Option C is correct. To support safe updates, maintain backward compatibility, and enable rollbacks.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000043000011',
  '00000000-0002-4000-a000-000000000043',
  11,
  'Q11. In what scenario is Thermodynamics Fundamentals most effectively applied?',
  'In modern scalable enterprise systems requiring structured workflows and reliability.',
  'Legacy manual processing for Thermodynamics Fundamentals.',
  'Bypassing standard security checks and protocols in Thermodynamics Fundamentals.',
  'Hardcoding static binary files without backup in Thermodynamics Fundamentals.',
  'A',
  'Option A is correct. In modern scalable enterprise systems requiring structured workflows and reliability.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000043000012',
  '00000000-0002-4000-a000-000000000043',
  12,
  'Q12. Which tool or interface is standard for interacting with Thermodynamics Fundamentals?',
  'Legacy manual processing for Thermodynamics Fundamentals.',
  'Dedicated command line tools, SDK APIs, and management dashboards.',
  'Bypassing standard security checks and protocols in Thermodynamics Fundamentals.',
  'Hardcoding static binary files without backup in Thermodynamics Fundamentals.',
  'B',
  'Option B is correct. Dedicated command line tools, SDK APIs, and management dashboards.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000043000013',
  '00000000-0002-4000-a000-000000000043',
  13,
  'Q13. What is the initial phase when developing with Thermodynamics Fundamentals?',
  'Defining requirements, setting up the development environment, and configuring dependencies.',
  'Legacy manual processing for Thermodynamics Fundamentals.',
  'Bypassing standard security checks and protocols in Thermodynamics Fundamentals.',
  'Hardcoding static binary files without backup in Thermodynamics Fundamentals.',
  'A',
  'Option A is correct. Defining requirements, setting up the development environment, and configuring dependencies.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000043000014',
  '00000000-0002-4000-a000-000000000043',
  14,
  'Q14. Which debugging technique is recommended for Thermodynamics Fundamentals?',
  'Inspecting log trace files, using debugger tools, and verifying stack traces.',
  'Legacy manual processing for Thermodynamics Fundamentals.',
  'Bypassing standard security checks and protocols in Thermodynamics Fundamentals.',
  'Hardcoding static binary files without backup in Thermodynamics Fundamentals.',
  'A',
  'Option A is correct. Inspecting log trace files, using debugger tools, and verifying stack traces.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000043000015',
  '00000000-0002-4000-a000-000000000043',
  15,
  'Q15. What is the overall goal of mastering Thermodynamics Fundamentals?',
  'Bypassing standard security checks and protocols in Thermodynamics Fundamentals.',
  'Legacy manual processing for Thermodynamics Fundamentals.',
  'To design, build, and maintain production-ready technology solutions.',
  'Hardcoding static binary files without backup in Thermodynamics Fundamentals.',
  'C',
  'Option C is correct. To design, build, and maintain production-ready technology solutions.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000043000016',
  '00000000-0002-4000-a000-000000000043',
  16,
  'Q16. What is the primary definition of Thermodynamics Fundamentals?',
  'A core technology or standard designed for managing and executing Thermodynamics Fundamentals processes.',
  'Legacy manual processing for Thermodynamics Fundamentals.',
  'Bypassing standard security checks and protocols in Thermodynamics Fundamentals.',
  'Hardcoding static binary files without backup in Thermodynamics Fundamentals.',
  'A',
  'Option A is correct. A core technology or standard designed for managing and executing Thermodynamics Fundamentals processes.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000043000017',
  '00000000-0002-4000-a000-000000000043',
  17,
  'Q17. Which key benefit is provided by Thermodynamics Fundamentals?',
  'Bypassing standard security checks and protocols in Thermodynamics Fundamentals.',
  'Legacy manual processing for Thermodynamics Fundamentals.',
  'Improved efficiency, scalability, modularity, and operational reliability.',
  'Hardcoding static binary files without backup in Thermodynamics Fundamentals.',
  'C',
  'Option C is correct. Improved efficiency, scalability, modularity, and operational reliability.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000043000018',
  '00000000-0002-4000-a000-000000000043',
  18,
  'Q18. What is a fundamental requirement when implementing Thermodynamics Fundamentals?',
  'Legacy manual processing for Thermodynamics Fundamentals.',
  'Proper system configuration, security protocols, and integration standards.',
  'Bypassing standard security checks and protocols in Thermodynamics Fundamentals.',
  'Hardcoding static binary files without backup in Thermodynamics Fundamentals.',
  'B',
  'Option B is correct. Proper system configuration, security protocols, and integration standards.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000043000019',
  '00000000-0002-4000-a000-000000000043',
  19,
  'Q19. How does Thermodynamics Fundamentals handle data and execution states?',
  'Bypassing standard security checks and protocols in Thermodynamics Fundamentals.',
  'Legacy manual processing for Thermodynamics Fundamentals.',
  'By utilizing structured schemas, indexes, and optimized execution pipelines.',
  'Hardcoding static binary files without backup in Thermodynamics Fundamentals.',
  'C',
  'Option C is correct. By utilizing structured schemas, indexes, and optimized execution pipelines.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000043000020',
  '00000000-0002-4000-a000-000000000043',
  20,
  'Q20. What is a recommended best practice when deploying Thermodynamics Fundamentals?',
  'Hardcoding static binary files without backup in Thermodynamics Fundamentals.',
  'Legacy manual processing for Thermodynamics Fundamentals.',
  'Bypassing standard security checks and protocols in Thermodynamics Fundamentals.',
  'Conducting regular automated testing, logging, and monitoring checks.',
  'D',
  'Option D is correct. Conducting regular automated testing, logging, and monitoring checks.'
);

-- Explore Quiz 44: Fluid Mechanics Principles Mastery Quiz
INSERT INTO public.explore_quizzes (id, title, description, category, branch, difficulty, question_count, estimated_minutes, fx_reward, is_daily, is_published)
VALUES (
  '00000000-0002-4000-a000-000000000044',
  'Fluid Mechanics Principles Challenge Quiz',
  'Test your knowledge on Fluid Mechanics Principles with 20 comprehensive questions.',
  'Mechanical',
  'MECH',
  'Intermediate',
  20,
  8,
  15,
  FALSE,
  TRUE
);

INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000044000001',
  '00000000-0002-4000-a000-000000000044',
  1,
  'Q1. What is the primary definition of Fluid Mechanics Principles?',
  'Hardcoding static binary files without backup in Fluid Mechanics Principles.',
  'Legacy manual processing for Fluid Mechanics Principles.',
  'Bypassing standard security checks and protocols in Fluid Mechanics Principles.',
  'A core technology or standard designed for managing and executing Fluid Mechanics Principles processes.',
  'D',
  'Option D is correct. A core technology or standard designed for managing and executing Fluid Mechanics Principles processes.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000044000002',
  '00000000-0002-4000-a000-000000000044',
  2,
  'Q2. Which key benefit is provided by Fluid Mechanics Principles?',
  'Improved efficiency, scalability, modularity, and operational reliability.',
  'Legacy manual processing for Fluid Mechanics Principles.',
  'Bypassing standard security checks and protocols in Fluid Mechanics Principles.',
  'Hardcoding static binary files without backup in Fluid Mechanics Principles.',
  'A',
  'Option A is correct. Improved efficiency, scalability, modularity, and operational reliability.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000044000003',
  '00000000-0002-4000-a000-000000000044',
  3,
  'Q3. What is a fundamental requirement when implementing Fluid Mechanics Principles?',
  'Hardcoding static binary files without backup in Fluid Mechanics Principles.',
  'Legacy manual processing for Fluid Mechanics Principles.',
  'Bypassing standard security checks and protocols in Fluid Mechanics Principles.',
  'Proper system configuration, security protocols, and integration standards.',
  'D',
  'Option D is correct. Proper system configuration, security protocols, and integration standards.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000044000004',
  '00000000-0002-4000-a000-000000000044',
  4,
  'Q4. How does Fluid Mechanics Principles handle data and execution states?',
  'Hardcoding static binary files without backup in Fluid Mechanics Principles.',
  'Legacy manual processing for Fluid Mechanics Principles.',
  'Bypassing standard security checks and protocols in Fluid Mechanics Principles.',
  'By utilizing structured schemas, indexes, and optimized execution pipelines.',
  'D',
  'Option D is correct. By utilizing structured schemas, indexes, and optimized execution pipelines.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000044000005',
  '00000000-0002-4000-a000-000000000044',
  5,
  'Q5. What is a recommended best practice when deploying Fluid Mechanics Principles?',
  'Hardcoding static binary files without backup in Fluid Mechanics Principles.',
  'Legacy manual processing for Fluid Mechanics Principles.',
  'Bypassing standard security checks and protocols in Fluid Mechanics Principles.',
  'Conducting regular automated testing, logging, and monitoring checks.',
  'D',
  'Option D is correct. Conducting regular automated testing, logging, and monitoring checks.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000044000006',
  '00000000-0002-4000-a000-000000000044',
  6,
  'Q6. Which layer or component plays a vital role in Fluid Mechanics Principles?',
  'Legacy manual processing for Fluid Mechanics Principles.',
  'The central execution handler and protocol controller.',
  'Bypassing standard security checks and protocols in Fluid Mechanics Principles.',
  'Hardcoding static binary files without backup in Fluid Mechanics Principles.',
  'B',
  'Option B is correct. The central execution handler and protocol controller.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000044000007',
  '00000000-0002-4000-a000-000000000044',
  7,
  'Q7. What is a common bottleneck or challenge in Fluid Mechanics Principles?',
  'Legacy manual processing for Fluid Mechanics Principles.',
  'Managing system state synchronization and resource contention under heavy load.',
  'Bypassing standard security checks and protocols in Fluid Mechanics Principles.',
  'Hardcoding static binary files without backup in Fluid Mechanics Principles.',
  'B',
  'Option B is correct. Managing system state synchronization and resource contention under heavy load.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000044000008',
  '00000000-0002-4000-a000-000000000044',
  8,
  'Q8. How is security typically enforced within Fluid Mechanics Principles?',
  'Legacy manual processing for Fluid Mechanics Principles.',
  'Through strong authentication, access control permissions, and data encryption.',
  'Bypassing standard security checks and protocols in Fluid Mechanics Principles.',
  'Hardcoding static binary files without backup in Fluid Mechanics Principles.',
  'B',
  'Option B is correct. Through strong authentication, access control permissions, and data encryption.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000044000009',
  '00000000-0002-4000-a000-000000000044',
  9,
  'Q9. Which metric is critical for measuring the performance of Fluid Mechanics Principles?',
  'Response latency, throughput, resource utilization, and error rates.',
  'Legacy manual processing for Fluid Mechanics Principles.',
  'Bypassing standard security checks and protocols in Fluid Mechanics Principles.',
  'Hardcoding static binary files without backup in Fluid Mechanics Principles.',
  'A',
  'Option A is correct. Response latency, throughput, resource utilization, and error rates.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000044000010',
  '00000000-0002-4000-a000-000000000044',
  10,
  'Q10. What is the role of versioning in Fluid Mechanics Principles?',
  'Hardcoding static binary files without backup in Fluid Mechanics Principles.',
  'Legacy manual processing for Fluid Mechanics Principles.',
  'Bypassing standard security checks and protocols in Fluid Mechanics Principles.',
  'To support safe updates, maintain backward compatibility, and enable rollbacks.',
  'D',
  'Option D is correct. To support safe updates, maintain backward compatibility, and enable rollbacks.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000044000011',
  '00000000-0002-4000-a000-000000000044',
  11,
  'Q11. In what scenario is Fluid Mechanics Principles most effectively applied?',
  'Bypassing standard security checks and protocols in Fluid Mechanics Principles.',
  'Legacy manual processing for Fluid Mechanics Principles.',
  'In modern scalable enterprise systems requiring structured workflows and reliability.',
  'Hardcoding static binary files without backup in Fluid Mechanics Principles.',
  'C',
  'Option C is correct. In modern scalable enterprise systems requiring structured workflows and reliability.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000044000012',
  '00000000-0002-4000-a000-000000000044',
  12,
  'Q12. Which tool or interface is standard for interacting with Fluid Mechanics Principles?',
  'Bypassing standard security checks and protocols in Fluid Mechanics Principles.',
  'Legacy manual processing for Fluid Mechanics Principles.',
  'Dedicated command line tools, SDK APIs, and management dashboards.',
  'Hardcoding static binary files without backup in Fluid Mechanics Principles.',
  'C',
  'Option C is correct. Dedicated command line tools, SDK APIs, and management dashboards.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000044000013',
  '00000000-0002-4000-a000-000000000044',
  13,
  'Q13. What is the initial phase when developing with Fluid Mechanics Principles?',
  'Hardcoding static binary files without backup in Fluid Mechanics Principles.',
  'Legacy manual processing for Fluid Mechanics Principles.',
  'Bypassing standard security checks and protocols in Fluid Mechanics Principles.',
  'Defining requirements, setting up the development environment, and configuring dependencies.',
  'D',
  'Option D is correct. Defining requirements, setting up the development environment, and configuring dependencies.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000044000014',
  '00000000-0002-4000-a000-000000000044',
  14,
  'Q14. Which debugging technique is recommended for Fluid Mechanics Principles?',
  'Bypassing standard security checks and protocols in Fluid Mechanics Principles.',
  'Legacy manual processing for Fluid Mechanics Principles.',
  'Inspecting log trace files, using debugger tools, and verifying stack traces.',
  'Hardcoding static binary files without backup in Fluid Mechanics Principles.',
  'C',
  'Option C is correct. Inspecting log trace files, using debugger tools, and verifying stack traces.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000044000015',
  '00000000-0002-4000-a000-000000000044',
  15,
  'Q15. What is the overall goal of mastering Fluid Mechanics Principles?',
  'To design, build, and maintain production-ready technology solutions.',
  'Legacy manual processing for Fluid Mechanics Principles.',
  'Bypassing standard security checks and protocols in Fluid Mechanics Principles.',
  'Hardcoding static binary files without backup in Fluid Mechanics Principles.',
  'A',
  'Option A is correct. To design, build, and maintain production-ready technology solutions.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000044000016',
  '00000000-0002-4000-a000-000000000044',
  16,
  'Q16. What is the primary definition of Fluid Mechanics Principles?',
  'Bypassing standard security checks and protocols in Fluid Mechanics Principles.',
  'Legacy manual processing for Fluid Mechanics Principles.',
  'A core technology or standard designed for managing and executing Fluid Mechanics Principles processes.',
  'Hardcoding static binary files without backup in Fluid Mechanics Principles.',
  'C',
  'Option C is correct. A core technology or standard designed for managing and executing Fluid Mechanics Principles processes.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000044000017',
  '00000000-0002-4000-a000-000000000044',
  17,
  'Q17. Which key benefit is provided by Fluid Mechanics Principles?',
  'Hardcoding static binary files without backup in Fluid Mechanics Principles.',
  'Legacy manual processing for Fluid Mechanics Principles.',
  'Bypassing standard security checks and protocols in Fluid Mechanics Principles.',
  'Improved efficiency, scalability, modularity, and operational reliability.',
  'D',
  'Option D is correct. Improved efficiency, scalability, modularity, and operational reliability.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000044000018',
  '00000000-0002-4000-a000-000000000044',
  18,
  'Q18. What is a fundamental requirement when implementing Fluid Mechanics Principles?',
  'Hardcoding static binary files without backup in Fluid Mechanics Principles.',
  'Legacy manual processing for Fluid Mechanics Principles.',
  'Bypassing standard security checks and protocols in Fluid Mechanics Principles.',
  'Proper system configuration, security protocols, and integration standards.',
  'D',
  'Option D is correct. Proper system configuration, security protocols, and integration standards.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000044000019',
  '00000000-0002-4000-a000-000000000044',
  19,
  'Q19. How does Fluid Mechanics Principles handle data and execution states?',
  'Bypassing standard security checks and protocols in Fluid Mechanics Principles.',
  'Legacy manual processing for Fluid Mechanics Principles.',
  'By utilizing structured schemas, indexes, and optimized execution pipelines.',
  'Hardcoding static binary files without backup in Fluid Mechanics Principles.',
  'C',
  'Option C is correct. By utilizing structured schemas, indexes, and optimized execution pipelines.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000044000020',
  '00000000-0002-4000-a000-000000000044',
  20,
  'Q20. What is a recommended best practice when deploying Fluid Mechanics Principles?',
  'Hardcoding static binary files without backup in Fluid Mechanics Principles.',
  'Legacy manual processing for Fluid Mechanics Principles.',
  'Bypassing standard security checks and protocols in Fluid Mechanics Principles.',
  'Conducting regular automated testing, logging, and monitoring checks.',
  'D',
  'Option D is correct. Conducting regular automated testing, logging, and monitoring checks.'
);

-- Explore Quiz 45: Civil Engineering & Surveying Mastery Quiz
INSERT INTO public.explore_quizzes (id, title, description, category, branch, difficulty, question_count, estimated_minutes, fx_reward, is_daily, is_published)
VALUES (
  '00000000-0002-4000-a000-000000000045',
  'Civil Engineering & Surveying Challenge Quiz',
  'Test your knowledge on Civil Engineering & Surveying with 20 comprehensive questions.',
  'Civil',
  'CIVIL',
  'Beginner',
  20,
  8,
  15,
  FALSE,
  TRUE
);

INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000045000001',
  '00000000-0002-4000-a000-000000000045',
  1,
  'Q1. What is the primary definition of Civil Engineering & Surveying?',
  'Bypassing standard security checks and protocols in Civil Engineering & Surveying.',
  'Legacy manual processing for Civil Engineering & Surveying.',
  'A core technology or standard designed for managing and executing Civil Engineering & Surveying processes.',
  'Hardcoding static binary files without backup in Civil Engineering & Surveying.',
  'C',
  'Option C is correct. A core technology or standard designed for managing and executing Civil Engineering & Surveying processes.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000045000002',
  '00000000-0002-4000-a000-000000000045',
  2,
  'Q2. Which key benefit is provided by Civil Engineering & Surveying?',
  'Improved efficiency, scalability, modularity, and operational reliability.',
  'Legacy manual processing for Civil Engineering & Surveying.',
  'Bypassing standard security checks and protocols in Civil Engineering & Surveying.',
  'Hardcoding static binary files without backup in Civil Engineering & Surveying.',
  'A',
  'Option A is correct. Improved efficiency, scalability, modularity, and operational reliability.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000045000003',
  '00000000-0002-4000-a000-000000000045',
  3,
  'Q3. What is a fundamental requirement when implementing Civil Engineering & Surveying?',
  'Hardcoding static binary files without backup in Civil Engineering & Surveying.',
  'Legacy manual processing for Civil Engineering & Surveying.',
  'Bypassing standard security checks and protocols in Civil Engineering & Surveying.',
  'Proper system configuration, security protocols, and integration standards.',
  'D',
  'Option D is correct. Proper system configuration, security protocols, and integration standards.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000045000004',
  '00000000-0002-4000-a000-000000000045',
  4,
  'Q4. How does Civil Engineering & Surveying handle data and execution states?',
  'By utilizing structured schemas, indexes, and optimized execution pipelines.',
  'Legacy manual processing for Civil Engineering & Surveying.',
  'Bypassing standard security checks and protocols in Civil Engineering & Surveying.',
  'Hardcoding static binary files without backup in Civil Engineering & Surveying.',
  'A',
  'Option A is correct. By utilizing structured schemas, indexes, and optimized execution pipelines.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000045000005',
  '00000000-0002-4000-a000-000000000045',
  5,
  'Q5. What is a recommended best practice when deploying Civil Engineering & Surveying?',
  'Hardcoding static binary files without backup in Civil Engineering & Surveying.',
  'Legacy manual processing for Civil Engineering & Surveying.',
  'Bypassing standard security checks and protocols in Civil Engineering & Surveying.',
  'Conducting regular automated testing, logging, and monitoring checks.',
  'D',
  'Option D is correct. Conducting regular automated testing, logging, and monitoring checks.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000045000006',
  '00000000-0002-4000-a000-000000000045',
  6,
  'Q6. Which layer or component plays a vital role in Civil Engineering & Surveying?',
  'Legacy manual processing for Civil Engineering & Surveying.',
  'The central execution handler and protocol controller.',
  'Bypassing standard security checks and protocols in Civil Engineering & Surveying.',
  'Hardcoding static binary files without backup in Civil Engineering & Surveying.',
  'B',
  'Option B is correct. The central execution handler and protocol controller.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000045000007',
  '00000000-0002-4000-a000-000000000045',
  7,
  'Q7. What is a common bottleneck or challenge in Civil Engineering & Surveying?',
  'Hardcoding static binary files without backup in Civil Engineering & Surveying.',
  'Legacy manual processing for Civil Engineering & Surveying.',
  'Bypassing standard security checks and protocols in Civil Engineering & Surveying.',
  'Managing system state synchronization and resource contention under heavy load.',
  'D',
  'Option D is correct. Managing system state synchronization and resource contention under heavy load.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000045000008',
  '00000000-0002-4000-a000-000000000045',
  8,
  'Q8. How is security typically enforced within Civil Engineering & Surveying?',
  'Through strong authentication, access control permissions, and data encryption.',
  'Legacy manual processing for Civil Engineering & Surveying.',
  'Bypassing standard security checks and protocols in Civil Engineering & Surveying.',
  'Hardcoding static binary files without backup in Civil Engineering & Surveying.',
  'A',
  'Option A is correct. Through strong authentication, access control permissions, and data encryption.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000045000009',
  '00000000-0002-4000-a000-000000000045',
  9,
  'Q9. Which metric is critical for measuring the performance of Civil Engineering & Surveying?',
  'Hardcoding static binary files without backup in Civil Engineering & Surveying.',
  'Legacy manual processing for Civil Engineering & Surveying.',
  'Bypassing standard security checks and protocols in Civil Engineering & Surveying.',
  'Response latency, throughput, resource utilization, and error rates.',
  'D',
  'Option D is correct. Response latency, throughput, resource utilization, and error rates.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000045000010',
  '00000000-0002-4000-a000-000000000045',
  10,
  'Q10. What is the role of versioning in Civil Engineering & Surveying?',
  'Hardcoding static binary files without backup in Civil Engineering & Surveying.',
  'Legacy manual processing for Civil Engineering & Surveying.',
  'Bypassing standard security checks and protocols in Civil Engineering & Surveying.',
  'To support safe updates, maintain backward compatibility, and enable rollbacks.',
  'D',
  'Option D is correct. To support safe updates, maintain backward compatibility, and enable rollbacks.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000045000011',
  '00000000-0002-4000-a000-000000000045',
  11,
  'Q11. In what scenario is Civil Engineering & Surveying most effectively applied?',
  'Hardcoding static binary files without backup in Civil Engineering & Surveying.',
  'Legacy manual processing for Civil Engineering & Surveying.',
  'Bypassing standard security checks and protocols in Civil Engineering & Surveying.',
  'In modern scalable enterprise systems requiring structured workflows and reliability.',
  'D',
  'Option D is correct. In modern scalable enterprise systems requiring structured workflows and reliability.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000045000012',
  '00000000-0002-4000-a000-000000000045',
  12,
  'Q12. Which tool or interface is standard for interacting with Civil Engineering & Surveying?',
  'Dedicated command line tools, SDK APIs, and management dashboards.',
  'Legacy manual processing for Civil Engineering & Surveying.',
  'Bypassing standard security checks and protocols in Civil Engineering & Surveying.',
  'Hardcoding static binary files without backup in Civil Engineering & Surveying.',
  'A',
  'Option A is correct. Dedicated command line tools, SDK APIs, and management dashboards.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000045000013',
  '00000000-0002-4000-a000-000000000045',
  13,
  'Q13. What is the initial phase when developing with Civil Engineering & Surveying?',
  'Defining requirements, setting up the development environment, and configuring dependencies.',
  'Legacy manual processing for Civil Engineering & Surveying.',
  'Bypassing standard security checks and protocols in Civil Engineering & Surveying.',
  'Hardcoding static binary files without backup in Civil Engineering & Surveying.',
  'A',
  'Option A is correct. Defining requirements, setting up the development environment, and configuring dependencies.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000045000014',
  '00000000-0002-4000-a000-000000000045',
  14,
  'Q14. Which debugging technique is recommended for Civil Engineering & Surveying?',
  'Hardcoding static binary files without backup in Civil Engineering & Surveying.',
  'Legacy manual processing for Civil Engineering & Surveying.',
  'Bypassing standard security checks and protocols in Civil Engineering & Surveying.',
  'Inspecting log trace files, using debugger tools, and verifying stack traces.',
  'D',
  'Option D is correct. Inspecting log trace files, using debugger tools, and verifying stack traces.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000045000015',
  '00000000-0002-4000-a000-000000000045',
  15,
  'Q15. What is the overall goal of mastering Civil Engineering & Surveying?',
  'To design, build, and maintain production-ready technology solutions.',
  'Legacy manual processing for Civil Engineering & Surveying.',
  'Bypassing standard security checks and protocols in Civil Engineering & Surveying.',
  'Hardcoding static binary files without backup in Civil Engineering & Surveying.',
  'A',
  'Option A is correct. To design, build, and maintain production-ready technology solutions.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000045000016',
  '00000000-0002-4000-a000-000000000045',
  16,
  'Q16. What is the primary definition of Civil Engineering & Surveying?',
  'Bypassing standard security checks and protocols in Civil Engineering & Surveying.',
  'Legacy manual processing for Civil Engineering & Surveying.',
  'A core technology or standard designed for managing and executing Civil Engineering & Surveying processes.',
  'Hardcoding static binary files without backup in Civil Engineering & Surveying.',
  'C',
  'Option C is correct. A core technology or standard designed for managing and executing Civil Engineering & Surveying processes.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000045000017',
  '00000000-0002-4000-a000-000000000045',
  17,
  'Q17. Which key benefit is provided by Civil Engineering & Surveying?',
  'Legacy manual processing for Civil Engineering & Surveying.',
  'Improved efficiency, scalability, modularity, and operational reliability.',
  'Bypassing standard security checks and protocols in Civil Engineering & Surveying.',
  'Hardcoding static binary files without backup in Civil Engineering & Surveying.',
  'B',
  'Option B is correct. Improved efficiency, scalability, modularity, and operational reliability.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000045000018',
  '00000000-0002-4000-a000-000000000045',
  18,
  'Q18. What is a fundamental requirement when implementing Civil Engineering & Surveying?',
  'Legacy manual processing for Civil Engineering & Surveying.',
  'Proper system configuration, security protocols, and integration standards.',
  'Bypassing standard security checks and protocols in Civil Engineering & Surveying.',
  'Hardcoding static binary files without backup in Civil Engineering & Surveying.',
  'B',
  'Option B is correct. Proper system configuration, security protocols, and integration standards.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000045000019',
  '00000000-0002-4000-a000-000000000045',
  19,
  'Q19. How does Civil Engineering & Surveying handle data and execution states?',
  'By utilizing structured schemas, indexes, and optimized execution pipelines.',
  'Legacy manual processing for Civil Engineering & Surveying.',
  'Bypassing standard security checks and protocols in Civil Engineering & Surveying.',
  'Hardcoding static binary files without backup in Civil Engineering & Surveying.',
  'A',
  'Option A is correct. By utilizing structured schemas, indexes, and optimized execution pipelines.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000045000020',
  '00000000-0002-4000-a000-000000000045',
  20,
  'Q20. What is a recommended best practice when deploying Civil Engineering & Surveying?',
  'Hardcoding static binary files without backup in Civil Engineering & Surveying.',
  'Legacy manual processing for Civil Engineering & Surveying.',
  'Bypassing standard security checks and protocols in Civil Engineering & Surveying.',
  'Conducting regular automated testing, logging, and monitoring checks.',
  'D',
  'Option D is correct. Conducting regular automated testing, logging, and monitoring checks.'
);

-- Explore Quiz 46: CAD/CAM & Engineering Graphics Mastery Quiz
INSERT INTO public.explore_quizzes (id, title, description, category, branch, difficulty, question_count, estimated_minutes, fx_reward, is_daily, is_published)
VALUES (
  '00000000-0002-4000-a000-000000000046',
  'CAD/CAM & Engineering Graphics Challenge Quiz',
  'Test your knowledge on CAD/CAM & Engineering Graphics with 20 comprehensive questions.',
  'Design',
  'MECH',
  'Intermediate',
  20,
  8,
  15,
  FALSE,
  TRUE
);

INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000046000001',
  '00000000-0002-4000-a000-000000000046',
  1,
  'Q1. What is the primary definition of CAD/CAM & Engineering Graphics?',
  'Bypassing standard security checks and protocols in CAD/CAM & Engineering Graphics.',
  'Legacy manual processing for CAD/CAM & Engineering Graphics.',
  'A core technology or standard designed for managing and executing CAD/CAM & Engineering Graphics processes.',
  'Hardcoding static binary files without backup in CAD/CAM & Engineering Graphics.',
  'C',
  'Option C is correct. A core technology or standard designed for managing and executing CAD/CAM & Engineering Graphics processes.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000046000002',
  '00000000-0002-4000-a000-000000000046',
  2,
  'Q2. Which key benefit is provided by CAD/CAM & Engineering Graphics?',
  'Legacy manual processing for CAD/CAM & Engineering Graphics.',
  'Improved efficiency, scalability, modularity, and operational reliability.',
  'Bypassing standard security checks and protocols in CAD/CAM & Engineering Graphics.',
  'Hardcoding static binary files without backup in CAD/CAM & Engineering Graphics.',
  'B',
  'Option B is correct. Improved efficiency, scalability, modularity, and operational reliability.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000046000003',
  '00000000-0002-4000-a000-000000000046',
  3,
  'Q3. What is a fundamental requirement when implementing CAD/CAM & Engineering Graphics?',
  'Proper system configuration, security protocols, and integration standards.',
  'Legacy manual processing for CAD/CAM & Engineering Graphics.',
  'Bypassing standard security checks and protocols in CAD/CAM & Engineering Graphics.',
  'Hardcoding static binary files without backup in CAD/CAM & Engineering Graphics.',
  'A',
  'Option A is correct. Proper system configuration, security protocols, and integration standards.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000046000004',
  '00000000-0002-4000-a000-000000000046',
  4,
  'Q4. How does CAD/CAM & Engineering Graphics handle data and execution states?',
  'Bypassing standard security checks and protocols in CAD/CAM & Engineering Graphics.',
  'Legacy manual processing for CAD/CAM & Engineering Graphics.',
  'By utilizing structured schemas, indexes, and optimized execution pipelines.',
  'Hardcoding static binary files without backup in CAD/CAM & Engineering Graphics.',
  'C',
  'Option C is correct. By utilizing structured schemas, indexes, and optimized execution pipelines.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000046000005',
  '00000000-0002-4000-a000-000000000046',
  5,
  'Q5. What is a recommended best practice when deploying CAD/CAM & Engineering Graphics?',
  'Hardcoding static binary files without backup in CAD/CAM & Engineering Graphics.',
  'Legacy manual processing for CAD/CAM & Engineering Graphics.',
  'Bypassing standard security checks and protocols in CAD/CAM & Engineering Graphics.',
  'Conducting regular automated testing, logging, and monitoring checks.',
  'D',
  'Option D is correct. Conducting regular automated testing, logging, and monitoring checks.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000046000006',
  '00000000-0002-4000-a000-000000000046',
  6,
  'Q6. Which layer or component plays a vital role in CAD/CAM & Engineering Graphics?',
  'Bypassing standard security checks and protocols in CAD/CAM & Engineering Graphics.',
  'Legacy manual processing for CAD/CAM & Engineering Graphics.',
  'The central execution handler and protocol controller.',
  'Hardcoding static binary files without backup in CAD/CAM & Engineering Graphics.',
  'C',
  'Option C is correct. The central execution handler and protocol controller.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000046000007',
  '00000000-0002-4000-a000-000000000046',
  7,
  'Q7. What is a common bottleneck or challenge in CAD/CAM & Engineering Graphics?',
  'Hardcoding static binary files without backup in CAD/CAM & Engineering Graphics.',
  'Legacy manual processing for CAD/CAM & Engineering Graphics.',
  'Bypassing standard security checks and protocols in CAD/CAM & Engineering Graphics.',
  'Managing system state synchronization and resource contention under heavy load.',
  'D',
  'Option D is correct. Managing system state synchronization and resource contention under heavy load.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000046000008',
  '00000000-0002-4000-a000-000000000046',
  8,
  'Q8. How is security typically enforced within CAD/CAM & Engineering Graphics?',
  'Hardcoding static binary files without backup in CAD/CAM & Engineering Graphics.',
  'Legacy manual processing for CAD/CAM & Engineering Graphics.',
  'Bypassing standard security checks and protocols in CAD/CAM & Engineering Graphics.',
  'Through strong authentication, access control permissions, and data encryption.',
  'D',
  'Option D is correct. Through strong authentication, access control permissions, and data encryption.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000046000009',
  '00000000-0002-4000-a000-000000000046',
  9,
  'Q9. Which metric is critical for measuring the performance of CAD/CAM & Engineering Graphics?',
  'Bypassing standard security checks and protocols in CAD/CAM & Engineering Graphics.',
  'Legacy manual processing for CAD/CAM & Engineering Graphics.',
  'Response latency, throughput, resource utilization, and error rates.',
  'Hardcoding static binary files without backup in CAD/CAM & Engineering Graphics.',
  'C',
  'Option C is correct. Response latency, throughput, resource utilization, and error rates.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000046000010',
  '00000000-0002-4000-a000-000000000046',
  10,
  'Q10. What is the role of versioning in CAD/CAM & Engineering Graphics?',
  'Bypassing standard security checks and protocols in CAD/CAM & Engineering Graphics.',
  'Legacy manual processing for CAD/CAM & Engineering Graphics.',
  'To support safe updates, maintain backward compatibility, and enable rollbacks.',
  'Hardcoding static binary files without backup in CAD/CAM & Engineering Graphics.',
  'C',
  'Option C is correct. To support safe updates, maintain backward compatibility, and enable rollbacks.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000046000011',
  '00000000-0002-4000-a000-000000000046',
  11,
  'Q11. In what scenario is CAD/CAM & Engineering Graphics most effectively applied?',
  'In modern scalable enterprise systems requiring structured workflows and reliability.',
  'Legacy manual processing for CAD/CAM & Engineering Graphics.',
  'Bypassing standard security checks and protocols in CAD/CAM & Engineering Graphics.',
  'Hardcoding static binary files without backup in CAD/CAM & Engineering Graphics.',
  'A',
  'Option A is correct. In modern scalable enterprise systems requiring structured workflows and reliability.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000046000012',
  '00000000-0002-4000-a000-000000000046',
  12,
  'Q12. Which tool or interface is standard for interacting with CAD/CAM & Engineering Graphics?',
  'Hardcoding static binary files without backup in CAD/CAM & Engineering Graphics.',
  'Legacy manual processing for CAD/CAM & Engineering Graphics.',
  'Bypassing standard security checks and protocols in CAD/CAM & Engineering Graphics.',
  'Dedicated command line tools, SDK APIs, and management dashboards.',
  'D',
  'Option D is correct. Dedicated command line tools, SDK APIs, and management dashboards.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000046000013',
  '00000000-0002-4000-a000-000000000046',
  13,
  'Q13. What is the initial phase when developing with CAD/CAM & Engineering Graphics?',
  'Defining requirements, setting up the development environment, and configuring dependencies.',
  'Legacy manual processing for CAD/CAM & Engineering Graphics.',
  'Bypassing standard security checks and protocols in CAD/CAM & Engineering Graphics.',
  'Hardcoding static binary files without backup in CAD/CAM & Engineering Graphics.',
  'A',
  'Option A is correct. Defining requirements, setting up the development environment, and configuring dependencies.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000046000014',
  '00000000-0002-4000-a000-000000000046',
  14,
  'Q14. Which debugging technique is recommended for CAD/CAM & Engineering Graphics?',
  'Bypassing standard security checks and protocols in CAD/CAM & Engineering Graphics.',
  'Legacy manual processing for CAD/CAM & Engineering Graphics.',
  'Inspecting log trace files, using debugger tools, and verifying stack traces.',
  'Hardcoding static binary files without backup in CAD/CAM & Engineering Graphics.',
  'C',
  'Option C is correct. Inspecting log trace files, using debugger tools, and verifying stack traces.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000046000015',
  '00000000-0002-4000-a000-000000000046',
  15,
  'Q15. What is the overall goal of mastering CAD/CAM & Engineering Graphics?',
  'Bypassing standard security checks and protocols in CAD/CAM & Engineering Graphics.',
  'Legacy manual processing for CAD/CAM & Engineering Graphics.',
  'To design, build, and maintain production-ready technology solutions.',
  'Hardcoding static binary files without backup in CAD/CAM & Engineering Graphics.',
  'C',
  'Option C is correct. To design, build, and maintain production-ready technology solutions.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000046000016',
  '00000000-0002-4000-a000-000000000046',
  16,
  'Q16. What is the primary definition of CAD/CAM & Engineering Graphics?',
  'A core technology or standard designed for managing and executing CAD/CAM & Engineering Graphics processes.',
  'Legacy manual processing for CAD/CAM & Engineering Graphics.',
  'Bypassing standard security checks and protocols in CAD/CAM & Engineering Graphics.',
  'Hardcoding static binary files without backup in CAD/CAM & Engineering Graphics.',
  'A',
  'Option A is correct. A core technology or standard designed for managing and executing CAD/CAM & Engineering Graphics processes.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000046000017',
  '00000000-0002-4000-a000-000000000046',
  17,
  'Q17. Which key benefit is provided by CAD/CAM & Engineering Graphics?',
  'Hardcoding static binary files without backup in CAD/CAM & Engineering Graphics.',
  'Legacy manual processing for CAD/CAM & Engineering Graphics.',
  'Bypassing standard security checks and protocols in CAD/CAM & Engineering Graphics.',
  'Improved efficiency, scalability, modularity, and operational reliability.',
  'D',
  'Option D is correct. Improved efficiency, scalability, modularity, and operational reliability.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000046000018',
  '00000000-0002-4000-a000-000000000046',
  18,
  'Q18. What is a fundamental requirement when implementing CAD/CAM & Engineering Graphics?',
  'Legacy manual processing for CAD/CAM & Engineering Graphics.',
  'Proper system configuration, security protocols, and integration standards.',
  'Bypassing standard security checks and protocols in CAD/CAM & Engineering Graphics.',
  'Hardcoding static binary files without backup in CAD/CAM & Engineering Graphics.',
  'B',
  'Option B is correct. Proper system configuration, security protocols, and integration standards.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000046000019',
  '00000000-0002-4000-a000-000000000046',
  19,
  'Q19. How does CAD/CAM & Engineering Graphics handle data and execution states?',
  'Hardcoding static binary files without backup in CAD/CAM & Engineering Graphics.',
  'Legacy manual processing for CAD/CAM & Engineering Graphics.',
  'Bypassing standard security checks and protocols in CAD/CAM & Engineering Graphics.',
  'By utilizing structured schemas, indexes, and optimized execution pipelines.',
  'D',
  'Option D is correct. By utilizing structured schemas, indexes, and optimized execution pipelines.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000046000020',
  '00000000-0002-4000-a000-000000000046',
  20,
  'Q20. What is a recommended best practice when deploying CAD/CAM & Engineering Graphics?',
  'Legacy manual processing for CAD/CAM & Engineering Graphics.',
  'Conducting regular automated testing, logging, and monitoring checks.',
  'Bypassing standard security checks and protocols in CAD/CAM & Engineering Graphics.',
  'Hardcoding static binary files without backup in CAD/CAM & Engineering Graphics.',
  'B',
  'Option B is correct. Conducting regular automated testing, logging, and monitoring checks.'
);

-- Explore Quiz 47: Agile & Scrum Methodologies Mastery Quiz
INSERT INTO public.explore_quizzes (id, title, description, category, branch, difficulty, question_count, estimated_minutes, fx_reward, is_daily, is_published)
VALUES (
  '00000000-0002-4000-a000-000000000047',
  'Agile & Scrum Methodologies Challenge Quiz',
  'Test your knowledge on Agile & Scrum Methodologies with 20 comprehensive questions.',
  'Management',
  'CSE',
  'Beginner',
  20,
  8,
  15,
  FALSE,
  TRUE
);

INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000047000001',
  '00000000-0002-4000-a000-000000000047',
  1,
  'Q1. What is the primary definition of Agile & Scrum Methodologies?',
  'A core technology or standard designed for managing and executing Agile & Scrum Methodologies processes.',
  'Legacy manual processing for Agile & Scrum Methodologies.',
  'Bypassing standard security checks and protocols in Agile & Scrum Methodologies.',
  'Hardcoding static binary files without backup in Agile & Scrum Methodologies.',
  'A',
  'Option A is correct. A core technology or standard designed for managing and executing Agile & Scrum Methodologies processes.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000047000002',
  '00000000-0002-4000-a000-000000000047',
  2,
  'Q2. Which key benefit is provided by Agile & Scrum Methodologies?',
  'Legacy manual processing for Agile & Scrum Methodologies.',
  'Improved efficiency, scalability, modularity, and operational reliability.',
  'Bypassing standard security checks and protocols in Agile & Scrum Methodologies.',
  'Hardcoding static binary files without backup in Agile & Scrum Methodologies.',
  'B',
  'Option B is correct. Improved efficiency, scalability, modularity, and operational reliability.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000047000003',
  '00000000-0002-4000-a000-000000000047',
  3,
  'Q3. What is a fundamental requirement when implementing Agile & Scrum Methodologies?',
  'Bypassing standard security checks and protocols in Agile & Scrum Methodologies.',
  'Legacy manual processing for Agile & Scrum Methodologies.',
  'Proper system configuration, security protocols, and integration standards.',
  'Hardcoding static binary files without backup in Agile & Scrum Methodologies.',
  'C',
  'Option C is correct. Proper system configuration, security protocols, and integration standards.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000047000004',
  '00000000-0002-4000-a000-000000000047',
  4,
  'Q4. How does Agile & Scrum Methodologies handle data and execution states?',
  'Hardcoding static binary files without backup in Agile & Scrum Methodologies.',
  'Legacy manual processing for Agile & Scrum Methodologies.',
  'Bypassing standard security checks and protocols in Agile & Scrum Methodologies.',
  'By utilizing structured schemas, indexes, and optimized execution pipelines.',
  'D',
  'Option D is correct. By utilizing structured schemas, indexes, and optimized execution pipelines.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000047000005',
  '00000000-0002-4000-a000-000000000047',
  5,
  'Q5. What is a recommended best practice when deploying Agile & Scrum Methodologies?',
  'Hardcoding static binary files without backup in Agile & Scrum Methodologies.',
  'Legacy manual processing for Agile & Scrum Methodologies.',
  'Bypassing standard security checks and protocols in Agile & Scrum Methodologies.',
  'Conducting regular automated testing, logging, and monitoring checks.',
  'D',
  'Option D is correct. Conducting regular automated testing, logging, and monitoring checks.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000047000006',
  '00000000-0002-4000-a000-000000000047',
  6,
  'Q6. Which layer or component plays a vital role in Agile & Scrum Methodologies?',
  'The central execution handler and protocol controller.',
  'Legacy manual processing for Agile & Scrum Methodologies.',
  'Bypassing standard security checks and protocols in Agile & Scrum Methodologies.',
  'Hardcoding static binary files without backup in Agile & Scrum Methodologies.',
  'A',
  'Option A is correct. The central execution handler and protocol controller.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000047000007',
  '00000000-0002-4000-a000-000000000047',
  7,
  'Q7. What is a common bottleneck or challenge in Agile & Scrum Methodologies?',
  'Legacy manual processing for Agile & Scrum Methodologies.',
  'Managing system state synchronization and resource contention under heavy load.',
  'Bypassing standard security checks and protocols in Agile & Scrum Methodologies.',
  'Hardcoding static binary files without backup in Agile & Scrum Methodologies.',
  'B',
  'Option B is correct. Managing system state synchronization and resource contention under heavy load.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000047000008',
  '00000000-0002-4000-a000-000000000047',
  8,
  'Q8. How is security typically enforced within Agile & Scrum Methodologies?',
  'Through strong authentication, access control permissions, and data encryption.',
  'Legacy manual processing for Agile & Scrum Methodologies.',
  'Bypassing standard security checks and protocols in Agile & Scrum Methodologies.',
  'Hardcoding static binary files without backup in Agile & Scrum Methodologies.',
  'A',
  'Option A is correct. Through strong authentication, access control permissions, and data encryption.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000047000009',
  '00000000-0002-4000-a000-000000000047',
  9,
  'Q9. Which metric is critical for measuring the performance of Agile & Scrum Methodologies?',
  'Hardcoding static binary files without backup in Agile & Scrum Methodologies.',
  'Legacy manual processing for Agile & Scrum Methodologies.',
  'Bypassing standard security checks and protocols in Agile & Scrum Methodologies.',
  'Response latency, throughput, resource utilization, and error rates.',
  'D',
  'Option D is correct. Response latency, throughput, resource utilization, and error rates.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000047000010',
  '00000000-0002-4000-a000-000000000047',
  10,
  'Q10. What is the role of versioning in Agile & Scrum Methodologies?',
  'Legacy manual processing for Agile & Scrum Methodologies.',
  'To support safe updates, maintain backward compatibility, and enable rollbacks.',
  'Bypassing standard security checks and protocols in Agile & Scrum Methodologies.',
  'Hardcoding static binary files without backup in Agile & Scrum Methodologies.',
  'B',
  'Option B is correct. To support safe updates, maintain backward compatibility, and enable rollbacks.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000047000011',
  '00000000-0002-4000-a000-000000000047',
  11,
  'Q11. In what scenario is Agile & Scrum Methodologies most effectively applied?',
  'Legacy manual processing for Agile & Scrum Methodologies.',
  'In modern scalable enterprise systems requiring structured workflows and reliability.',
  'Bypassing standard security checks and protocols in Agile & Scrum Methodologies.',
  'Hardcoding static binary files without backup in Agile & Scrum Methodologies.',
  'B',
  'Option B is correct. In modern scalable enterprise systems requiring structured workflows and reliability.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000047000012',
  '00000000-0002-4000-a000-000000000047',
  12,
  'Q12. Which tool or interface is standard for interacting with Agile & Scrum Methodologies?',
  'Legacy manual processing for Agile & Scrum Methodologies.',
  'Dedicated command line tools, SDK APIs, and management dashboards.',
  'Bypassing standard security checks and protocols in Agile & Scrum Methodologies.',
  'Hardcoding static binary files without backup in Agile & Scrum Methodologies.',
  'B',
  'Option B is correct. Dedicated command line tools, SDK APIs, and management dashboards.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000047000013',
  '00000000-0002-4000-a000-000000000047',
  13,
  'Q13. What is the initial phase when developing with Agile & Scrum Methodologies?',
  'Defining requirements, setting up the development environment, and configuring dependencies.',
  'Legacy manual processing for Agile & Scrum Methodologies.',
  'Bypassing standard security checks and protocols in Agile & Scrum Methodologies.',
  'Hardcoding static binary files without backup in Agile & Scrum Methodologies.',
  'A',
  'Option A is correct. Defining requirements, setting up the development environment, and configuring dependencies.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000047000014',
  '00000000-0002-4000-a000-000000000047',
  14,
  'Q14. Which debugging technique is recommended for Agile & Scrum Methodologies?',
  'Legacy manual processing for Agile & Scrum Methodologies.',
  'Inspecting log trace files, using debugger tools, and verifying stack traces.',
  'Bypassing standard security checks and protocols in Agile & Scrum Methodologies.',
  'Hardcoding static binary files without backup in Agile & Scrum Methodologies.',
  'B',
  'Option B is correct. Inspecting log trace files, using debugger tools, and verifying stack traces.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000047000015',
  '00000000-0002-4000-a000-000000000047',
  15,
  'Q15. What is the overall goal of mastering Agile & Scrum Methodologies?',
  'Hardcoding static binary files without backup in Agile & Scrum Methodologies.',
  'Legacy manual processing for Agile & Scrum Methodologies.',
  'Bypassing standard security checks and protocols in Agile & Scrum Methodologies.',
  'To design, build, and maintain production-ready technology solutions.',
  'D',
  'Option D is correct. To design, build, and maintain production-ready technology solutions.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000047000016',
  '00000000-0002-4000-a000-000000000047',
  16,
  'Q16. What is the primary definition of Agile & Scrum Methodologies?',
  'Hardcoding static binary files without backup in Agile & Scrum Methodologies.',
  'Legacy manual processing for Agile & Scrum Methodologies.',
  'Bypassing standard security checks and protocols in Agile & Scrum Methodologies.',
  'A core technology or standard designed for managing and executing Agile & Scrum Methodologies processes.',
  'D',
  'Option D is correct. A core technology or standard designed for managing and executing Agile & Scrum Methodologies processes.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000047000017',
  '00000000-0002-4000-a000-000000000047',
  17,
  'Q17. Which key benefit is provided by Agile & Scrum Methodologies?',
  'Legacy manual processing for Agile & Scrum Methodologies.',
  'Improved efficiency, scalability, modularity, and operational reliability.',
  'Bypassing standard security checks and protocols in Agile & Scrum Methodologies.',
  'Hardcoding static binary files without backup in Agile & Scrum Methodologies.',
  'B',
  'Option B is correct. Improved efficiency, scalability, modularity, and operational reliability.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000047000018',
  '00000000-0002-4000-a000-000000000047',
  18,
  'Q18. What is a fundamental requirement when implementing Agile & Scrum Methodologies?',
  'Bypassing standard security checks and protocols in Agile & Scrum Methodologies.',
  'Legacy manual processing for Agile & Scrum Methodologies.',
  'Proper system configuration, security protocols, and integration standards.',
  'Hardcoding static binary files without backup in Agile & Scrum Methodologies.',
  'C',
  'Option C is correct. Proper system configuration, security protocols, and integration standards.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000047000019',
  '00000000-0002-4000-a000-000000000047',
  19,
  'Q19. How does Agile & Scrum Methodologies handle data and execution states?',
  'Legacy manual processing for Agile & Scrum Methodologies.',
  'By utilizing structured schemas, indexes, and optimized execution pipelines.',
  'Bypassing standard security checks and protocols in Agile & Scrum Methodologies.',
  'Hardcoding static binary files without backup in Agile & Scrum Methodologies.',
  'B',
  'Option B is correct. By utilizing structured schemas, indexes, and optimized execution pipelines.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000047000020',
  '00000000-0002-4000-a000-000000000047',
  20,
  'Q20. What is a recommended best practice when deploying Agile & Scrum Methodologies?',
  'Hardcoding static binary files without backup in Agile & Scrum Methodologies.',
  'Legacy manual processing for Agile & Scrum Methodologies.',
  'Bypassing standard security checks and protocols in Agile & Scrum Methodologies.',
  'Conducting regular automated testing, logging, and monitoring checks.',
  'D',
  'Option D is correct. Conducting regular automated testing, logging, and monitoring checks.'
);

-- Explore Quiz 48: Big Data & Analytics Basics Mastery Quiz
INSERT INTO public.explore_quizzes (id, title, description, category, branch, difficulty, question_count, estimated_minutes, fx_reward, is_daily, is_published)
VALUES (
  '00000000-0002-4000-a000-000000000048',
  'Big Data & Analytics Basics Challenge Quiz',
  'Test your knowledge on Big Data & Analytics Basics with 20 comprehensive questions.',
  'Data Science',
  'CSE',
  'Intermediate',
  20,
  8,
  15,
  FALSE,
  TRUE
);

INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000048000001',
  '00000000-0002-4000-a000-000000000048',
  1,
  'Q1. What is the primary definition of Big Data & Analytics Basics?',
  'A core technology or standard designed for managing and executing Big Data & Analytics Basics processes.',
  'Legacy manual processing for Big Data & Analytics Basics.',
  'Bypassing standard security checks and protocols in Big Data & Analytics Basics.',
  'Hardcoding static binary files without backup in Big Data & Analytics Basics.',
  'A',
  'Option A is correct. A core technology or standard designed for managing and executing Big Data & Analytics Basics processes.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000048000002',
  '00000000-0002-4000-a000-000000000048',
  2,
  'Q2. Which key benefit is provided by Big Data & Analytics Basics?',
  'Hardcoding static binary files without backup in Big Data & Analytics Basics.',
  'Legacy manual processing for Big Data & Analytics Basics.',
  'Bypassing standard security checks and protocols in Big Data & Analytics Basics.',
  'Improved efficiency, scalability, modularity, and operational reliability.',
  'D',
  'Option D is correct. Improved efficiency, scalability, modularity, and operational reliability.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000048000003',
  '00000000-0002-4000-a000-000000000048',
  3,
  'Q3. What is a fundamental requirement when implementing Big Data & Analytics Basics?',
  'Legacy manual processing for Big Data & Analytics Basics.',
  'Proper system configuration, security protocols, and integration standards.',
  'Bypassing standard security checks and protocols in Big Data & Analytics Basics.',
  'Hardcoding static binary files without backup in Big Data & Analytics Basics.',
  'B',
  'Option B is correct. Proper system configuration, security protocols, and integration standards.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000048000004',
  '00000000-0002-4000-a000-000000000048',
  4,
  'Q4. How does Big Data & Analytics Basics handle data and execution states?',
  'Bypassing standard security checks and protocols in Big Data & Analytics Basics.',
  'Legacy manual processing for Big Data & Analytics Basics.',
  'By utilizing structured schemas, indexes, and optimized execution pipelines.',
  'Hardcoding static binary files without backup in Big Data & Analytics Basics.',
  'C',
  'Option C is correct. By utilizing structured schemas, indexes, and optimized execution pipelines.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000048000005',
  '00000000-0002-4000-a000-000000000048',
  5,
  'Q5. What is a recommended best practice when deploying Big Data & Analytics Basics?',
  'Hardcoding static binary files without backup in Big Data & Analytics Basics.',
  'Legacy manual processing for Big Data & Analytics Basics.',
  'Bypassing standard security checks and protocols in Big Data & Analytics Basics.',
  'Conducting regular automated testing, logging, and monitoring checks.',
  'D',
  'Option D is correct. Conducting regular automated testing, logging, and monitoring checks.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000048000006',
  '00000000-0002-4000-a000-000000000048',
  6,
  'Q6. Which layer or component plays a vital role in Big Data & Analytics Basics?',
  'Bypassing standard security checks and protocols in Big Data & Analytics Basics.',
  'Legacy manual processing for Big Data & Analytics Basics.',
  'The central execution handler and protocol controller.',
  'Hardcoding static binary files without backup in Big Data & Analytics Basics.',
  'C',
  'Option C is correct. The central execution handler and protocol controller.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000048000007',
  '00000000-0002-4000-a000-000000000048',
  7,
  'Q7. What is a common bottleneck or challenge in Big Data & Analytics Basics?',
  'Hardcoding static binary files without backup in Big Data & Analytics Basics.',
  'Legacy manual processing for Big Data & Analytics Basics.',
  'Bypassing standard security checks and protocols in Big Data & Analytics Basics.',
  'Managing system state synchronization and resource contention under heavy load.',
  'D',
  'Option D is correct. Managing system state synchronization and resource contention under heavy load.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000048000008',
  '00000000-0002-4000-a000-000000000048',
  8,
  'Q8. How is security typically enforced within Big Data & Analytics Basics?',
  'Bypassing standard security checks and protocols in Big Data & Analytics Basics.',
  'Legacy manual processing for Big Data & Analytics Basics.',
  'Through strong authentication, access control permissions, and data encryption.',
  'Hardcoding static binary files without backup in Big Data & Analytics Basics.',
  'C',
  'Option C is correct. Through strong authentication, access control permissions, and data encryption.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000048000009',
  '00000000-0002-4000-a000-000000000048',
  9,
  'Q9. Which metric is critical for measuring the performance of Big Data & Analytics Basics?',
  'Legacy manual processing for Big Data & Analytics Basics.',
  'Response latency, throughput, resource utilization, and error rates.',
  'Bypassing standard security checks and protocols in Big Data & Analytics Basics.',
  'Hardcoding static binary files without backup in Big Data & Analytics Basics.',
  'B',
  'Option B is correct. Response latency, throughput, resource utilization, and error rates.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000048000010',
  '00000000-0002-4000-a000-000000000048',
  10,
  'Q10. What is the role of versioning in Big Data & Analytics Basics?',
  'Hardcoding static binary files without backup in Big Data & Analytics Basics.',
  'Legacy manual processing for Big Data & Analytics Basics.',
  'Bypassing standard security checks and protocols in Big Data & Analytics Basics.',
  'To support safe updates, maintain backward compatibility, and enable rollbacks.',
  'D',
  'Option D is correct. To support safe updates, maintain backward compatibility, and enable rollbacks.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000048000011',
  '00000000-0002-4000-a000-000000000048',
  11,
  'Q11. In what scenario is Big Data & Analytics Basics most effectively applied?',
  'Hardcoding static binary files without backup in Big Data & Analytics Basics.',
  'Legacy manual processing for Big Data & Analytics Basics.',
  'Bypassing standard security checks and protocols in Big Data & Analytics Basics.',
  'In modern scalable enterprise systems requiring structured workflows and reliability.',
  'D',
  'Option D is correct. In modern scalable enterprise systems requiring structured workflows and reliability.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000048000012',
  '00000000-0002-4000-a000-000000000048',
  12,
  'Q12. Which tool or interface is standard for interacting with Big Data & Analytics Basics?',
  'Dedicated command line tools, SDK APIs, and management dashboards.',
  'Legacy manual processing for Big Data & Analytics Basics.',
  'Bypassing standard security checks and protocols in Big Data & Analytics Basics.',
  'Hardcoding static binary files without backup in Big Data & Analytics Basics.',
  'A',
  'Option A is correct. Dedicated command line tools, SDK APIs, and management dashboards.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000048000013',
  '00000000-0002-4000-a000-000000000048',
  13,
  'Q13. What is the initial phase when developing with Big Data & Analytics Basics?',
  'Hardcoding static binary files without backup in Big Data & Analytics Basics.',
  'Legacy manual processing for Big Data & Analytics Basics.',
  'Bypassing standard security checks and protocols in Big Data & Analytics Basics.',
  'Defining requirements, setting up the development environment, and configuring dependencies.',
  'D',
  'Option D is correct. Defining requirements, setting up the development environment, and configuring dependencies.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000048000014',
  '00000000-0002-4000-a000-000000000048',
  14,
  'Q14. Which debugging technique is recommended for Big Data & Analytics Basics?',
  'Hardcoding static binary files without backup in Big Data & Analytics Basics.',
  'Legacy manual processing for Big Data & Analytics Basics.',
  'Bypassing standard security checks and protocols in Big Data & Analytics Basics.',
  'Inspecting log trace files, using debugger tools, and verifying stack traces.',
  'D',
  'Option D is correct. Inspecting log trace files, using debugger tools, and verifying stack traces.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000048000015',
  '00000000-0002-4000-a000-000000000048',
  15,
  'Q15. What is the overall goal of mastering Big Data & Analytics Basics?',
  'Hardcoding static binary files without backup in Big Data & Analytics Basics.',
  'Legacy manual processing for Big Data & Analytics Basics.',
  'Bypassing standard security checks and protocols in Big Data & Analytics Basics.',
  'To design, build, and maintain production-ready technology solutions.',
  'D',
  'Option D is correct. To design, build, and maintain production-ready technology solutions.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000048000016',
  '00000000-0002-4000-a000-000000000048',
  16,
  'Q16. What is the primary definition of Big Data & Analytics Basics?',
  'A core technology or standard designed for managing and executing Big Data & Analytics Basics processes.',
  'Legacy manual processing for Big Data & Analytics Basics.',
  'Bypassing standard security checks and protocols in Big Data & Analytics Basics.',
  'Hardcoding static binary files without backup in Big Data & Analytics Basics.',
  'A',
  'Option A is correct. A core technology or standard designed for managing and executing Big Data & Analytics Basics processes.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000048000017',
  '00000000-0002-4000-a000-000000000048',
  17,
  'Q17. Which key benefit is provided by Big Data & Analytics Basics?',
  'Hardcoding static binary files without backup in Big Data & Analytics Basics.',
  'Legacy manual processing for Big Data & Analytics Basics.',
  'Bypassing standard security checks and protocols in Big Data & Analytics Basics.',
  'Improved efficiency, scalability, modularity, and operational reliability.',
  'D',
  'Option D is correct. Improved efficiency, scalability, modularity, and operational reliability.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000048000018',
  '00000000-0002-4000-a000-000000000048',
  18,
  'Q18. What is a fundamental requirement when implementing Big Data & Analytics Basics?',
  'Proper system configuration, security protocols, and integration standards.',
  'Legacy manual processing for Big Data & Analytics Basics.',
  'Bypassing standard security checks and protocols in Big Data & Analytics Basics.',
  'Hardcoding static binary files without backup in Big Data & Analytics Basics.',
  'A',
  'Option A is correct. Proper system configuration, security protocols, and integration standards.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000048000019',
  '00000000-0002-4000-a000-000000000048',
  19,
  'Q19. How does Big Data & Analytics Basics handle data and execution states?',
  'Legacy manual processing for Big Data & Analytics Basics.',
  'By utilizing structured schemas, indexes, and optimized execution pipelines.',
  'Bypassing standard security checks and protocols in Big Data & Analytics Basics.',
  'Hardcoding static binary files without backup in Big Data & Analytics Basics.',
  'B',
  'Option B is correct. By utilizing structured schemas, indexes, and optimized execution pipelines.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000048000020',
  '00000000-0002-4000-a000-000000000048',
  20,
  'Q20. What is a recommended best practice when deploying Big Data & Analytics Basics?',
  'Bypassing standard security checks and protocols in Big Data & Analytics Basics.',
  'Legacy manual processing for Big Data & Analytics Basics.',
  'Conducting regular automated testing, logging, and monitoring checks.',
  'Hardcoding static binary files without backup in Big Data & Analytics Basics.',
  'C',
  'Option C is correct. Conducting regular automated testing, logging, and monitoring checks.'
);

-- Explore Quiz 49: Blockchain & Smart Contracts Mastery Quiz
INSERT INTO public.explore_quizzes (id, title, description, category, branch, difficulty, question_count, estimated_minutes, fx_reward, is_daily, is_published)
VALUES (
  '00000000-0002-4000-a000-000000000049',
  'Blockchain & Smart Contracts Challenge Quiz',
  'Test your knowledge on Blockchain & Smart Contracts with 20 comprehensive questions.',
  'Web3',
  'CSE',
  'Advanced',
  20,
  8,
  15,
  FALSE,
  TRUE
);

INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000049000001',
  '00000000-0002-4000-a000-000000000049',
  1,
  'Q1. What is the primary definition of Blockchain & Smart Contracts?',
  'Legacy manual processing for Blockchain & Smart Contracts.',
  'A core technology or standard designed for managing and executing Blockchain & Smart Contracts processes.',
  'Bypassing standard security checks and protocols in Blockchain & Smart Contracts.',
  'Hardcoding static binary files without backup in Blockchain & Smart Contracts.',
  'B',
  'Option B is correct. A core technology or standard designed for managing and executing Blockchain & Smart Contracts processes.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000049000002',
  '00000000-0002-4000-a000-000000000049',
  2,
  'Q2. Which key benefit is provided by Blockchain & Smart Contracts?',
  'Legacy manual processing for Blockchain & Smart Contracts.',
  'Improved efficiency, scalability, modularity, and operational reliability.',
  'Bypassing standard security checks and protocols in Blockchain & Smart Contracts.',
  'Hardcoding static binary files without backup in Blockchain & Smart Contracts.',
  'B',
  'Option B is correct. Improved efficiency, scalability, modularity, and operational reliability.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000049000003',
  '00000000-0002-4000-a000-000000000049',
  3,
  'Q3. What is a fundamental requirement when implementing Blockchain & Smart Contracts?',
  'Bypassing standard security checks and protocols in Blockchain & Smart Contracts.',
  'Legacy manual processing for Blockchain & Smart Contracts.',
  'Proper system configuration, security protocols, and integration standards.',
  'Hardcoding static binary files without backup in Blockchain & Smart Contracts.',
  'C',
  'Option C is correct. Proper system configuration, security protocols, and integration standards.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000049000004',
  '00000000-0002-4000-a000-000000000049',
  4,
  'Q4. How does Blockchain & Smart Contracts handle data and execution states?',
  'Hardcoding static binary files without backup in Blockchain & Smart Contracts.',
  'Legacy manual processing for Blockchain & Smart Contracts.',
  'Bypassing standard security checks and protocols in Blockchain & Smart Contracts.',
  'By utilizing structured schemas, indexes, and optimized execution pipelines.',
  'D',
  'Option D is correct. By utilizing structured schemas, indexes, and optimized execution pipelines.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000049000005',
  '00000000-0002-4000-a000-000000000049',
  5,
  'Q5. What is a recommended best practice when deploying Blockchain & Smart Contracts?',
  'Legacy manual processing for Blockchain & Smart Contracts.',
  'Conducting regular automated testing, logging, and monitoring checks.',
  'Bypassing standard security checks and protocols in Blockchain & Smart Contracts.',
  'Hardcoding static binary files without backup in Blockchain & Smart Contracts.',
  'B',
  'Option B is correct. Conducting regular automated testing, logging, and monitoring checks.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000049000006',
  '00000000-0002-4000-a000-000000000049',
  6,
  'Q6. Which layer or component plays a vital role in Blockchain & Smart Contracts?',
  'Hardcoding static binary files without backup in Blockchain & Smart Contracts.',
  'Legacy manual processing for Blockchain & Smart Contracts.',
  'Bypassing standard security checks and protocols in Blockchain & Smart Contracts.',
  'The central execution handler and protocol controller.',
  'D',
  'Option D is correct. The central execution handler and protocol controller.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000049000007',
  '00000000-0002-4000-a000-000000000049',
  7,
  'Q7. What is a common bottleneck or challenge in Blockchain & Smart Contracts?',
  'Hardcoding static binary files without backup in Blockchain & Smart Contracts.',
  'Legacy manual processing for Blockchain & Smart Contracts.',
  'Bypassing standard security checks and protocols in Blockchain & Smart Contracts.',
  'Managing system state synchronization and resource contention under heavy load.',
  'D',
  'Option D is correct. Managing system state synchronization and resource contention under heavy load.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000049000008',
  '00000000-0002-4000-a000-000000000049',
  8,
  'Q8. How is security typically enforced within Blockchain & Smart Contracts?',
  'Hardcoding static binary files without backup in Blockchain & Smart Contracts.',
  'Legacy manual processing for Blockchain & Smart Contracts.',
  'Bypassing standard security checks and protocols in Blockchain & Smart Contracts.',
  'Through strong authentication, access control permissions, and data encryption.',
  'D',
  'Option D is correct. Through strong authentication, access control permissions, and data encryption.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000049000009',
  '00000000-0002-4000-a000-000000000049',
  9,
  'Q9. Which metric is critical for measuring the performance of Blockchain & Smart Contracts?',
  'Bypassing standard security checks and protocols in Blockchain & Smart Contracts.',
  'Legacy manual processing for Blockchain & Smart Contracts.',
  'Response latency, throughput, resource utilization, and error rates.',
  'Hardcoding static binary files without backup in Blockchain & Smart Contracts.',
  'C',
  'Option C is correct. Response latency, throughput, resource utilization, and error rates.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000049000010',
  '00000000-0002-4000-a000-000000000049',
  10,
  'Q10. What is the role of versioning in Blockchain & Smart Contracts?',
  'Legacy manual processing for Blockchain & Smart Contracts.',
  'To support safe updates, maintain backward compatibility, and enable rollbacks.',
  'Bypassing standard security checks and protocols in Blockchain & Smart Contracts.',
  'Hardcoding static binary files without backup in Blockchain & Smart Contracts.',
  'B',
  'Option B is correct. To support safe updates, maintain backward compatibility, and enable rollbacks.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000049000011',
  '00000000-0002-4000-a000-000000000049',
  11,
  'Q11. In what scenario is Blockchain & Smart Contracts most effectively applied?',
  'Bypassing standard security checks and protocols in Blockchain & Smart Contracts.',
  'Legacy manual processing for Blockchain & Smart Contracts.',
  'In modern scalable enterprise systems requiring structured workflows and reliability.',
  'Hardcoding static binary files without backup in Blockchain & Smart Contracts.',
  'C',
  'Option C is correct. In modern scalable enterprise systems requiring structured workflows and reliability.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000049000012',
  '00000000-0002-4000-a000-000000000049',
  12,
  'Q12. Which tool or interface is standard for interacting with Blockchain & Smart Contracts?',
  'Hardcoding static binary files without backup in Blockchain & Smart Contracts.',
  'Legacy manual processing for Blockchain & Smart Contracts.',
  'Bypassing standard security checks and protocols in Blockchain & Smart Contracts.',
  'Dedicated command line tools, SDK APIs, and management dashboards.',
  'D',
  'Option D is correct. Dedicated command line tools, SDK APIs, and management dashboards.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000049000013',
  '00000000-0002-4000-a000-000000000049',
  13,
  'Q13. What is the initial phase when developing with Blockchain & Smart Contracts?',
  'Defining requirements, setting up the development environment, and configuring dependencies.',
  'Legacy manual processing for Blockchain & Smart Contracts.',
  'Bypassing standard security checks and protocols in Blockchain & Smart Contracts.',
  'Hardcoding static binary files without backup in Blockchain & Smart Contracts.',
  'A',
  'Option A is correct. Defining requirements, setting up the development environment, and configuring dependencies.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000049000014',
  '00000000-0002-4000-a000-000000000049',
  14,
  'Q14. Which debugging technique is recommended for Blockchain & Smart Contracts?',
  'Hardcoding static binary files without backup in Blockchain & Smart Contracts.',
  'Legacy manual processing for Blockchain & Smart Contracts.',
  'Bypassing standard security checks and protocols in Blockchain & Smart Contracts.',
  'Inspecting log trace files, using debugger tools, and verifying stack traces.',
  'D',
  'Option D is correct. Inspecting log trace files, using debugger tools, and verifying stack traces.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000049000015',
  '00000000-0002-4000-a000-000000000049',
  15,
  'Q15. What is the overall goal of mastering Blockchain & Smart Contracts?',
  'Hardcoding static binary files without backup in Blockchain & Smart Contracts.',
  'Legacy manual processing for Blockchain & Smart Contracts.',
  'Bypassing standard security checks and protocols in Blockchain & Smart Contracts.',
  'To design, build, and maintain production-ready technology solutions.',
  'D',
  'Option D is correct. To design, build, and maintain production-ready technology solutions.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000049000016',
  '00000000-0002-4000-a000-000000000049',
  16,
  'Q16. What is the primary definition of Blockchain & Smart Contracts?',
  'Legacy manual processing for Blockchain & Smart Contracts.',
  'A core technology or standard designed for managing and executing Blockchain & Smart Contracts processes.',
  'Bypassing standard security checks and protocols in Blockchain & Smart Contracts.',
  'Hardcoding static binary files without backup in Blockchain & Smart Contracts.',
  'B',
  'Option B is correct. A core technology or standard designed for managing and executing Blockchain & Smart Contracts processes.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000049000017',
  '00000000-0002-4000-a000-000000000049',
  17,
  'Q17. Which key benefit is provided by Blockchain & Smart Contracts?',
  'Improved efficiency, scalability, modularity, and operational reliability.',
  'Legacy manual processing for Blockchain & Smart Contracts.',
  'Bypassing standard security checks and protocols in Blockchain & Smart Contracts.',
  'Hardcoding static binary files without backup in Blockchain & Smart Contracts.',
  'A',
  'Option A is correct. Improved efficiency, scalability, modularity, and operational reliability.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000049000018',
  '00000000-0002-4000-a000-000000000049',
  18,
  'Q18. What is a fundamental requirement when implementing Blockchain & Smart Contracts?',
  'Hardcoding static binary files without backup in Blockchain & Smart Contracts.',
  'Legacy manual processing for Blockchain & Smart Contracts.',
  'Bypassing standard security checks and protocols in Blockchain & Smart Contracts.',
  'Proper system configuration, security protocols, and integration standards.',
  'D',
  'Option D is correct. Proper system configuration, security protocols, and integration standards.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000049000019',
  '00000000-0002-4000-a000-000000000049',
  19,
  'Q19. How does Blockchain & Smart Contracts handle data and execution states?',
  'Legacy manual processing for Blockchain & Smart Contracts.',
  'By utilizing structured schemas, indexes, and optimized execution pipelines.',
  'Bypassing standard security checks and protocols in Blockchain & Smart Contracts.',
  'Hardcoding static binary files without backup in Blockchain & Smart Contracts.',
  'B',
  'Option B is correct. By utilizing structured schemas, indexes, and optimized execution pipelines.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000049000020',
  '00000000-0002-4000-a000-000000000049',
  20,
  'Q20. What is a recommended best practice when deploying Blockchain & Smart Contracts?',
  'Bypassing standard security checks and protocols in Blockchain & Smart Contracts.',
  'Legacy manual processing for Blockchain & Smart Contracts.',
  'Conducting regular automated testing, logging, and monitoring checks.',
  'Hardcoding static binary files without backup in Blockchain & Smart Contracts.',
  'C',
  'Option C is correct. Conducting regular automated testing, logging, and monitoring checks.'
);

-- Explore Quiz 50: Cloud Native & Serverless Computing Mastery Quiz
INSERT INTO public.explore_quizzes (id, title, description, category, branch, difficulty, question_count, estimated_minutes, fx_reward, is_daily, is_published)
VALUES (
  '00000000-0002-4000-a000-000000000050',
  'Cloud Native & Serverless Computing Challenge Quiz',
  'Test your knowledge on Cloud Native & Serverless Computing with 20 comprehensive questions.',
  'Cloud',
  'CSE',
  'Advanced',
  20,
  8,
  15,
  FALSE,
  TRUE
);

INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000050000001',
  '00000000-0002-4000-a000-000000000050',
  1,
  'Q1. What is the primary definition of Cloud Native & Serverless Computing?',
  'A core technology or standard designed for managing and executing Cloud Native & Serverless Computing processes.',
  'Legacy manual processing for Cloud Native & Serverless Computing.',
  'Bypassing standard security checks and protocols in Cloud Native & Serverless Computing.',
  'Hardcoding static binary files without backup in Cloud Native & Serverless Computing.',
  'A',
  'Option A is correct. A core technology or standard designed for managing and executing Cloud Native & Serverless Computing processes.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000050000002',
  '00000000-0002-4000-a000-000000000050',
  2,
  'Q2. Which key benefit is provided by Cloud Native & Serverless Computing?',
  'Bypassing standard security checks and protocols in Cloud Native & Serverless Computing.',
  'Legacy manual processing for Cloud Native & Serverless Computing.',
  'Improved efficiency, scalability, modularity, and operational reliability.',
  'Hardcoding static binary files without backup in Cloud Native & Serverless Computing.',
  'C',
  'Option C is correct. Improved efficiency, scalability, modularity, and operational reliability.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000050000003',
  '00000000-0002-4000-a000-000000000050',
  3,
  'Q3. What is a fundamental requirement when implementing Cloud Native & Serverless Computing?',
  'Bypassing standard security checks and protocols in Cloud Native & Serverless Computing.',
  'Legacy manual processing for Cloud Native & Serverless Computing.',
  'Proper system configuration, security protocols, and integration standards.',
  'Hardcoding static binary files without backup in Cloud Native & Serverless Computing.',
  'C',
  'Option C is correct. Proper system configuration, security protocols, and integration standards.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000050000004',
  '00000000-0002-4000-a000-000000000050',
  4,
  'Q4. How does Cloud Native & Serverless Computing handle data and execution states?',
  'Legacy manual processing for Cloud Native & Serverless Computing.',
  'By utilizing structured schemas, indexes, and optimized execution pipelines.',
  'Bypassing standard security checks and protocols in Cloud Native & Serverless Computing.',
  'Hardcoding static binary files without backup in Cloud Native & Serverless Computing.',
  'B',
  'Option B is correct. By utilizing structured schemas, indexes, and optimized execution pipelines.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000050000005',
  '00000000-0002-4000-a000-000000000050',
  5,
  'Q5. What is a recommended best practice when deploying Cloud Native & Serverless Computing?',
  'Bypassing standard security checks and protocols in Cloud Native & Serverless Computing.',
  'Legacy manual processing for Cloud Native & Serverless Computing.',
  'Conducting regular automated testing, logging, and monitoring checks.',
  'Hardcoding static binary files without backup in Cloud Native & Serverless Computing.',
  'C',
  'Option C is correct. Conducting regular automated testing, logging, and monitoring checks.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000050000006',
  '00000000-0002-4000-a000-000000000050',
  6,
  'Q6. Which layer or component plays a vital role in Cloud Native & Serverless Computing?',
  'The central execution handler and protocol controller.',
  'Legacy manual processing for Cloud Native & Serverless Computing.',
  'Bypassing standard security checks and protocols in Cloud Native & Serverless Computing.',
  'Hardcoding static binary files without backup in Cloud Native & Serverless Computing.',
  'A',
  'Option A is correct. The central execution handler and protocol controller.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000050000007',
  '00000000-0002-4000-a000-000000000050',
  7,
  'Q7. What is a common bottleneck or challenge in Cloud Native & Serverless Computing?',
  'Managing system state synchronization and resource contention under heavy load.',
  'Legacy manual processing for Cloud Native & Serverless Computing.',
  'Bypassing standard security checks and protocols in Cloud Native & Serverless Computing.',
  'Hardcoding static binary files without backup in Cloud Native & Serverless Computing.',
  'A',
  'Option A is correct. Managing system state synchronization and resource contention under heavy load.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000050000008',
  '00000000-0002-4000-a000-000000000050',
  8,
  'Q8. How is security typically enforced within Cloud Native & Serverless Computing?',
  'Legacy manual processing for Cloud Native & Serverless Computing.',
  'Through strong authentication, access control permissions, and data encryption.',
  'Bypassing standard security checks and protocols in Cloud Native & Serverless Computing.',
  'Hardcoding static binary files without backup in Cloud Native & Serverless Computing.',
  'B',
  'Option B is correct. Through strong authentication, access control permissions, and data encryption.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000050000009',
  '00000000-0002-4000-a000-000000000050',
  9,
  'Q9. Which metric is critical for measuring the performance of Cloud Native & Serverless Computing?',
  'Hardcoding static binary files without backup in Cloud Native & Serverless Computing.',
  'Legacy manual processing for Cloud Native & Serverless Computing.',
  'Bypassing standard security checks and protocols in Cloud Native & Serverless Computing.',
  'Response latency, throughput, resource utilization, and error rates.',
  'D',
  'Option D is correct. Response latency, throughput, resource utilization, and error rates.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000050000010',
  '00000000-0002-4000-a000-000000000050',
  10,
  'Q10. What is the role of versioning in Cloud Native & Serverless Computing?',
  'Hardcoding static binary files without backup in Cloud Native & Serverless Computing.',
  'Legacy manual processing for Cloud Native & Serverless Computing.',
  'Bypassing standard security checks and protocols in Cloud Native & Serverless Computing.',
  'To support safe updates, maintain backward compatibility, and enable rollbacks.',
  'D',
  'Option D is correct. To support safe updates, maintain backward compatibility, and enable rollbacks.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000050000011',
  '00000000-0002-4000-a000-000000000050',
  11,
  'Q11. In what scenario is Cloud Native & Serverless Computing most effectively applied?',
  'In modern scalable enterprise systems requiring structured workflows and reliability.',
  'Legacy manual processing for Cloud Native & Serverless Computing.',
  'Bypassing standard security checks and protocols in Cloud Native & Serverless Computing.',
  'Hardcoding static binary files without backup in Cloud Native & Serverless Computing.',
  'A',
  'Option A is correct. In modern scalable enterprise systems requiring structured workflows and reliability.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000050000012',
  '00000000-0002-4000-a000-000000000050',
  12,
  'Q12. Which tool or interface is standard for interacting with Cloud Native & Serverless Computing?',
  'Bypassing standard security checks and protocols in Cloud Native & Serverless Computing.',
  'Legacy manual processing for Cloud Native & Serverless Computing.',
  'Dedicated command line tools, SDK APIs, and management dashboards.',
  'Hardcoding static binary files without backup in Cloud Native & Serverless Computing.',
  'C',
  'Option C is correct. Dedicated command line tools, SDK APIs, and management dashboards.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000050000013',
  '00000000-0002-4000-a000-000000000050',
  13,
  'Q13. What is the initial phase when developing with Cloud Native & Serverless Computing?',
  'Hardcoding static binary files without backup in Cloud Native & Serverless Computing.',
  'Legacy manual processing for Cloud Native & Serverless Computing.',
  'Bypassing standard security checks and protocols in Cloud Native & Serverless Computing.',
  'Defining requirements, setting up the development environment, and configuring dependencies.',
  'D',
  'Option D is correct. Defining requirements, setting up the development environment, and configuring dependencies.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000050000014',
  '00000000-0002-4000-a000-000000000050',
  14,
  'Q14. Which debugging technique is recommended for Cloud Native & Serverless Computing?',
  'Legacy manual processing for Cloud Native & Serverless Computing.',
  'Inspecting log trace files, using debugger tools, and verifying stack traces.',
  'Bypassing standard security checks and protocols in Cloud Native & Serverless Computing.',
  'Hardcoding static binary files without backup in Cloud Native & Serverless Computing.',
  'B',
  'Option B is correct. Inspecting log trace files, using debugger tools, and verifying stack traces.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000050000015',
  '00000000-0002-4000-a000-000000000050',
  15,
  'Q15. What is the overall goal of mastering Cloud Native & Serverless Computing?',
  'Bypassing standard security checks and protocols in Cloud Native & Serverless Computing.',
  'Legacy manual processing for Cloud Native & Serverless Computing.',
  'To design, build, and maintain production-ready technology solutions.',
  'Hardcoding static binary files without backup in Cloud Native & Serverless Computing.',
  'C',
  'Option C is correct. To design, build, and maintain production-ready technology solutions.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000050000016',
  '00000000-0002-4000-a000-000000000050',
  16,
  'Q16. What is the primary definition of Cloud Native & Serverless Computing?',
  'Legacy manual processing for Cloud Native & Serverless Computing.',
  'A core technology or standard designed for managing and executing Cloud Native & Serverless Computing processes.',
  'Bypassing standard security checks and protocols in Cloud Native & Serverless Computing.',
  'Hardcoding static binary files without backup in Cloud Native & Serverless Computing.',
  'B',
  'Option B is correct. A core technology or standard designed for managing and executing Cloud Native & Serverless Computing processes.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000050000017',
  '00000000-0002-4000-a000-000000000050',
  17,
  'Q17. Which key benefit is provided by Cloud Native & Serverless Computing?',
  'Legacy manual processing for Cloud Native & Serverless Computing.',
  'Improved efficiency, scalability, modularity, and operational reliability.',
  'Bypassing standard security checks and protocols in Cloud Native & Serverless Computing.',
  'Hardcoding static binary files without backup in Cloud Native & Serverless Computing.',
  'B',
  'Option B is correct. Improved efficiency, scalability, modularity, and operational reliability.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000050000018',
  '00000000-0002-4000-a000-000000000050',
  18,
  'Q18. What is a fundamental requirement when implementing Cloud Native & Serverless Computing?',
  'Legacy manual processing for Cloud Native & Serverless Computing.',
  'Proper system configuration, security protocols, and integration standards.',
  'Bypassing standard security checks and protocols in Cloud Native & Serverless Computing.',
  'Hardcoding static binary files without backup in Cloud Native & Serverless Computing.',
  'B',
  'Option B is correct. Proper system configuration, security protocols, and integration standards.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000050000019',
  '00000000-0002-4000-a000-000000000050',
  19,
  'Q19. How does Cloud Native & Serverless Computing handle data and execution states?',
  'By utilizing structured schemas, indexes, and optimized execution pipelines.',
  'Legacy manual processing for Cloud Native & Serverless Computing.',
  'Bypassing standard security checks and protocols in Cloud Native & Serverless Computing.',
  'Hardcoding static binary files without backup in Cloud Native & Serverless Computing.',
  'A',
  'Option A is correct. By utilizing structured schemas, indexes, and optimized execution pipelines.'
);
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000050000020',
  '00000000-0002-4000-a000-000000000050',
  20,
  'Q20. What is a recommended best practice when deploying Cloud Native & Serverless Computing?',
  'Bypassing standard security checks and protocols in Cloud Native & Serverless Computing.',
  'Legacy manual processing for Cloud Native & Serverless Computing.',
  'Conducting regular automated testing, logging, and monitoring checks.',
  'Hardcoding static binary files without backup in Cloud Native & Serverless Computing.',
  'C',
  'Option C is correct. Conducting regular automated testing, logging, and monitoring checks.'
);

COMMIT;
