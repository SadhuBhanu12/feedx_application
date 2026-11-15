-- ==============================================================================
-- FEEDX AUTHENTIC PDF SEED MIGRATION: QUICK LEARNS
-- ==============================================================================

BEGIN;

TRUNCATE TABLE public.student_lesson_progress CASCADE;
TRUNCATE TABLE public.quick_learn_checks CASCADE;
TRUNCATE TABLE public.quick_learn_lessons CASCADE;

-- Quick Learn 01: GitHub & Git Basics
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
  'Git is the version-control tool used to track changes.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000001000002',
  '00000000-0000-4000-a000-000000000001',
  'Q2. What is GitHub?',
  'A hosted platform for Git repositories and collaboration',
  'A programming language',
  'A database engine',
  'A computer network protocol',
  'A',
  'GitHub provides hosted repositories and collaboration features around Git.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000001000003',
  '00000000-0000-4000-a000-000000000001',
  'Q3. What does a Git commit represent?',
  'A saved change in repository history',
  'A remote server',
  'A programming language',
  'A network address',
  'A',
  'A commit records a set of changes in Git history.'
) ON CONFLICT (id) DO NOTHING;
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
  'Branches let developers work on separate lines of development.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000001000005',
  '00000000-0000-4000-a000-000000000001',
  'Q5. What does git clone do?',
  'Copies a repository to a local environment',
  'Deletes a repository',
  'Creates a password',
  'Publishes a website',
  'A',
  'Clone creates a local copy of a repository.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000001000006',
  '00000000-0000-4000-a000-000000000001',
  'Q6. What is a pull request?',
  'A proposal to merge changes',
  'A database query',
  'A password reset',
  'A cloud storage bucket',
  'A',
  'A pull request is used to propose and review changes before merging.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000001000007',
  '00000000-0000-4000-a000-000000000001',
  'Q7. What does git push do?',
  'Sends local commits to a remote repository',
  'Deletes commits',
  'Creates an HTML page',
  'Starts a firewall',
  'A',
  'Push transfers local commits to a configured remote.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000001000008',
  '00000000-0000-4000-a000-000000000001',
  'Q8. What does git pull commonly do?',
  'Fetches and integrates changes from a remote',
  'Formats a disk',
  'Creates a database',
  'Encrypts a password',
  'A',
  'Pull obtains remote changes and integrates them into the current branch.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000001000009',
  '00000000-0000-4000-a000-000000000001',
  'Q9. What is a repository?',
  'A location containing a project''s files and version history',
  'A network cable',
  'A browser',
  'A password',
  'A',
  'A repository contains project files and version-control history.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000001000010',
  '00000000-0000-4000-a000-000000000001',
  'Q10. What is GitHub Actions commonly used for?',
  'Automating workflows such as testing and deployment',
  'Writing SQL queries',
  'Drawing circuits',
  'Managing IP addresses',
  'A',
  'GitHub Actions automates repository workflows.'
) ON CONFLICT (id) DO NOTHING;
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
  'A fork creates a separate copy of a repository under another account or organization.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000001000012',
  '00000000-0000-4000-a000-000000000001',
  'Q12. What does the staging area do in Git?',
  'Prepares selected changes for a commit',
  'Stores cloud backups',
  'Runs a web server',
  'Encrypts traffic',
  'A',
  'The staging area lets you choose changes to include in the next commit.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000001000013',
  '00000000-0000-4000-a000-000000000001',
  'Q13. What does git diff show?',
  'Changes between versions or working states',
  'Internet speed',
  'Database tables',
  'CPU temperature',
  'A',
  'Git diff displays differences between file states.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000001000014',
  '00000000-0000-4000-a000-000000000001',
  'Q14. What is a Git tag often used for?',
  'Naming a specific point such as a release',
  'Creating a firewall',
  'Storing passwords',
  'Running a database',
  'A',
  'Tags provide named references to particular commits, often releases.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000001000015',
  '00000000-0000-4000-a000-000000000001',
  'Q15. Why use version control?',
  'To track changes and collaborate safely',
  'To increase screen brightness',
  'To replace an operating system',
  'To compress videos',
  'A',
  'Version control tracks changes and supports collaboration and recovery.'
) ON CONFLICT (id) DO NOTHING;

-- Quick Learn 02: APIs & How They Work
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
An API is a defined way for software systems to communicate. Web APIs commonly use HTTP requests and responses. A client sends a request to an endpoint and the server returns data or a result, often using JSON.

### Key Points
- **API**
- **endpoint**
- **HTTP**
- **request**
- **response**
- **JSON**',
  TRUE
) ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title;

INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000002000001',
  '00000000-0000-4000-a000-000000000002',
  'Q1. What is an API?',
  'An interface that lets software systems communicate',
  'A type of database',
  'A programming keyboard',
  'A graphics card',
  'A',
  'An API defines how software components communicate.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000002000002',
  '00000000-0000-4000-a000-000000000002',
  'Q2. What is an API endpoint?',
  'A specific address for an API resource or action',
  'A password',
  'A compiler',
  'A storage device',
  'A',
  'An endpoint is a defined API URL/address for a resource or operation.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000002000003',
  '00000000-0000-4000-a000-000000000002',
  'Q3. Which HTTP method commonly retrieves data?',
  'GET',
  'POST',
  'DELETE',
  'PATCH',
  'A',
  'GET is commonly used to retrieve resources.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000002000004',
  '00000000-0000-4000-a000-000000000002',
  'Q4. Which HTTP method commonly creates/submits data?',
  'POST',
  'GET',
  'HEAD',
  'OPTIONS',
  'A',
  'POST is commonly used to submit or create data.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000002000005',
  '00000000-0000-4000-a000-000000000002',
  'Q5. What is JSON?',
  'A structured data format commonly used by web APIs',
  'A network cable',
  'A CPU',
  'A firewall',
  'A',
  'JSON is a lightweight structured data format.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000002000006',
  '00000000-0000-4000-a000-000000000002',
  'Q6. What does an HTTP status code communicate?',
  'The outcome of a request',
  'A user''s password',
  'A database schema',
  'A screen resolution',
  'A',
  'Status codes indicate the result of an HTTP request.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000002000007',
  '00000000-0000-4000-a000-000000000002',
  'Q7. What is authentication?',
  'Verifying who a user or system is',
  'Choosing a UI color',
  'Compressing images',
  'Sorting a database',
  'A',
  'Authentication verifies identity.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000002000008',
  '00000000-0000-4000-a000-000000000002',
  'Q8. What is authorization?',
  'Determining what an authenticated user can access',
  'Verifying an IP cable',
  'Creating HTML',
  'Encrypting a monitor',
  'A',
  'Authorization controls permissions after identity is established.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000002000009',
  '00000000-0000-4000-a000-000000000002',
  'Q9. What is a request?',
  'A message sent by a client to a server',
  'A database table',
  'A programming language',
  'A hard disk',
  'A',
  'A request asks a server to perform an operation or return data.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000002000010',
  '00000000-0000-4000-a000-000000000002',
  'Q10. What is a response?',
  'A message returned by a server',
  'A Git branch',
  'A password manager',
  'A circuit',
  'A',
  'A server sends a response back to the client.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000002000011',
  '00000000-0000-4000-a000-000000000002',
  'Q11. What is an API key?',
  'A credential used by some APIs to identify or authorize a caller',
  'A keyboard key',
  'A database column',
  'A router port',
  'A',
  'Some APIs use API keys as credentials.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000002000012',
  '00000000-0000-4000-a000-000000000002',
  'Q12. What is rate limiting?',
  'Restricting how frequently requests can be made',
  'Encrypting all files',
  'Changing a domain name',
  'Creating a UI button',
  'A',
  'Rate limiting controls request frequency to protect services.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000002000013',
  '00000000-0000-4000-a000-000000000002',
  'Q13. What is an API header?',
  'Metadata sent with an HTTP request or response',
  'A database row',
  'A mobile screen',
  'A Git tag',
  'A',
  'Headers carry metadata such as content type or authorization.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000002000014',
  '00000000-0000-4000-a000-000000000002',
  'Q14. What is a webhook?',
  'A mechanism for sending event notifications to another service',
  'A password hash',
  'A CSS selector',
  'A database index',
  'A',
  'Webhooks notify another service when an event occurs.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000002000015',
  '00000000-0000-4000-a000-000000000002',
  'Q15. Why is API documentation important?',
  'It explains endpoints, inputs, outputs and usage',
  'It increases CPU speed',
  'It replaces testing',
  'It stores photos',
  'A',
  'Documentation tells developers how to correctly use an API.'
) ON CONFLICT (id) DO NOTHING;

-- Quick Learn 03: Cloud Computing
INSERT INTO public.quick_learn_lessons (id, title, slug, branch, category, difficulty, estimated_minutes, is_recommended, fx_reward, short_description, content_markdown, is_published)
VALUES (
  '00000000-0000-4000-a000-000000000003',
  'Cloud Computing',
  'cloud-computing',
  'CSE',
  'Cloud',
  'Beginner',
  3,
  TRUE,
  10,
  'Master Cloud Computing fundamentals with quick reading and 15 practice MCQs on FEEDX.',
  '### Learning Text
Cloud computing provides computing resources such as servers, storage, databases and networking over the internet. It allows organizations to scale resources and pay according to usage or service plans.

### Key Points
- **cloud**
- **on-demand resources**
- **server**
- **storage**
- **database**
- **networking**',
  TRUE
) ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title;

INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000003000001',
  '00000000-0000-4000-a000-000000000003',
  'Q1. What is cloud?',
  'public cloud',
  'cloud',
  'elasticity',
  'SaaS',
  'B',
  'cloud is a key concept in Cloud Computing.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000003000002',
  '00000000-0000-4000-a000-000000000003',
  'Q2. Which option is most directly associated with on-demand resources?',
  'on-demand resources',
  'server',
  'backup',
  'IaaS',
  'A',
  'on-demand resources is a key concept in Cloud Computing.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000003000003',
  '00000000-0000-4000-a000-000000000003',
  'Q3. Which statement best describes server?',
  'private cloud',
  'availability zone',
  'server',
  'IaaS',
  'C',
  'server is a key concept in Cloud Computing.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000003000004',
  '00000000-0000-4000-a000-000000000003',
  'Q4. In this topic, what does storage refer to?',
  'networking',
  'storage',
  'elasticity',
  'private cloud',
  'B',
  'storage is a key concept in Cloud Computing.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000003000005',
  '00000000-0000-4000-a000-000000000003',
  'Q5. What is database?',
  'database',
  'scalability',
  'networking',
  'on-demand resources',
  'A',
  'database is a key concept in Cloud Computing.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000003000006',
  '00000000-0000-4000-a000-000000000003',
  'Q6. Which option is most directly associated with networking?',
  'server',
  'IaaS',
  'storage',
  'networking',
  'D',
  'networking is a key concept in Cloud Computing.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000003000007',
  '00000000-0000-4000-a000-000000000003',
  'Q7. Which statement best describes scalability?',
  'elasticity',
  'managed service',
  'public cloud',
  'scalability',
  'D',
  'scalability is a key concept in Cloud Computing.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000003000008',
  '00000000-0000-4000-a000-000000000003',
  'Q8. In this topic, what does elasticity refer to?',
  'public cloud',
  'elasticity',
  'cloud',
  'region',
  'B',
  'elasticity is a key concept in Cloud Computing.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000003000009',
  '00000000-0000-4000-a000-000000000003',
  'Q9. What is IaaS?',
  'hybrid cloud',
  'networking',
  'IaaS',
  'database',
  'C',
  'IaaS is a key concept in Cloud Computing.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000003000010',
  '00000000-0000-4000-a000-000000000003',
  'Q10. Which option is most directly associated with PaaS?',
  'scalability',
  'networking',
  'PaaS',
  'private cloud',
  'C',
  'PaaS is a key concept in Cloud Computing.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000003000011',
  '00000000-0000-4000-a000-000000000003',
  'Q11. Which statement best describes SaaS?',
  'scalability',
  'cloud',
  'server',
  'SaaS',
  'D',
  'SaaS is a key concept in Cloud Computing.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000003000012',
  '00000000-0000-4000-a000-000000000003',
  'Q12. In this topic, what does public cloud refer to?',
  'cloud',
  'backup',
  'public cloud',
  'hybrid cloud',
  'C',
  'public cloud is a key concept in Cloud Computing.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000003000013',
  '00000000-0000-4000-a000-000000000003',
  'Q13. What is private cloud?',
  'on-demand resources',
  'networking',
  'server',
  'private cloud',
  'D',
  'private cloud is a key concept in Cloud Computing.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000003000014',
  '00000000-0000-4000-a000-000000000003',
  'Q14. Which option is most directly associated with hybrid cloud?',
  'elasticity',
  'hybrid cloud',
  'storage',
  'PaaS',
  'B',
  'hybrid cloud is a key concept in Cloud Computing.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000003000015',
  '00000000-0000-4000-a000-000000000003',
  'Q15. Which statement best describes region?',
  'database',
  'storage',
  'availability zone',
  'region',
  'D',
  'region is a key concept in Cloud Computing.'
) ON CONFLICT (id) DO NOTHING;

-- Quick Learn 04: Cybersecurity Basics
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
Cybersecurity protects systems, networks, applications and data from unauthorized access, disruption and misuse. Core goals include confidentiality, integrity and availability, commonly called the CIA triad.

### Key Points
- **confidentiality**
- **integrity**
- **availability**
- **authentication**
- **authorization**
- **threat**',
  TRUE
) ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title;

INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000004000001',
  '00000000-0000-4000-a000-000000000004',
  'Q1. What is confidentiality?',
  'backup',
  'risk',
  'confidentiality',
  'incident response',
  'C',
  'confidentiality is a key concept in Cybersecurity Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000004000002',
  '00000000-0000-4000-a000-000000000004',
  'Q2. Which option is most directly associated with integrity?',
  'authentication',
  'integrity',
  'threat',
  'malware',
  'B',
  'integrity is a key concept in Cybersecurity Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000004000003',
  '00000000-0000-4000-a000-000000000004',
  'Q3. Which statement best describes availability?',
  'backup',
  'security policy',
  'MFA',
  'availability',
  'D',
  'availability is a key concept in Cybersecurity Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000004000004',
  '00000000-0000-4000-a000-000000000004',
  'Q4. In this topic, what does authentication refer to?',
  'authentication',
  'MFA',
  'encryption',
  'malware',
  'A',
  'authentication is a key concept in Cybersecurity Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000004000005',
  '00000000-0000-4000-a000-000000000004',
  'Q5. What is authorization?',
  'logging',
  'authorization',
  'malware',
  'incident response',
  'B',
  'authorization is a key concept in Cybersecurity Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000004000006',
  '00000000-0000-4000-a000-000000000004',
  'Q6. Which option is most directly associated with threat?',
  'patching',
  'firewall',
  'threat',
  'encryption',
  'C',
  'threat is a key concept in Cybersecurity Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000004000007',
  '00000000-0000-4000-a000-000000000004',
  'Q7. Which statement best describes vulnerability?',
  'malware',
  'authorization',
  'vulnerability',
  'confidentiality',
  'C',
  'vulnerability is a key concept in Cybersecurity Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000004000008',
  '00000000-0000-4000-a000-000000000004',
  'Q8. In this topic, what does risk refer to?',
  'vulnerability',
  'authentication',
  'risk',
  'least privilege',
  'C',
  'risk is a key concept in Cybersecurity Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000004000009',
  '00000000-0000-4000-a000-000000000004',
  'Q9. What is malware?',
  'encryption',
  'malware',
  'risk',
  'integrity',
  'B',
  'malware is a key concept in Cybersecurity Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000004000010',
  '00000000-0000-4000-a000-000000000004',
  'Q10. Which option is most directly associated with phishing?',
  'security policy',
  'risk',
  'malware',
  'phishing',
  'D',
  'phishing is a key concept in Cybersecurity Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000004000011',
  '00000000-0000-4000-a000-000000000004',
  'Q11. Which statement best describes firewall?',
  'firewall',
  'authorization',
  'phishing',
  'vulnerability',
  'A',
  'firewall is a key concept in Cybersecurity Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000004000012',
  '00000000-0000-4000-a000-000000000004',
  'Q12. In this topic, what does encryption refer to?',
  'encryption',
  'authentication',
  'risk',
  'authorization',
  'A',
  'encryption is a key concept in Cybersecurity Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000004000013',
  '00000000-0000-4000-a000-000000000004',
  'Q13. What is patching?',
  'threat',
  'confidentiality',
  'logging',
  'patching',
  'D',
  'patching is a key concept in Cybersecurity Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000004000014',
  '00000000-0000-4000-a000-000000000004',
  'Q14. Which option is most directly associated with MFA?',
  'MFA',
  'encryption',
  'authentication',
  'patching',
  'A',
  'MFA is a key concept in Cybersecurity Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000004000015',
  '00000000-0000-4000-a000-000000000004',
  'Q15. Which statement best describes least privilege?',
  'patching',
  'security policy',
  'authorization',
  'least privilege',
  'D',
  'least privilege is a key concept in Cybersecurity Basics.'
) ON CONFLICT (id) DO NOTHING;

-- Quick Learn 05: Linux Basics
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
Linux is an open-source operating-system family based on the Linux kernel. It is widely used in servers, development environments, networking and embedded systems. Users commonly interact with Linux through a shell.

### Key Points
- **kernel**
- **shell**
- **terminal**
- **file system**
- **process**
- **permission**',
  TRUE
) ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title;

INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000005000001',
  '00000000-0000-4000-a000-000000000005',
  'Q1. What is kernel?',
  'terminal',
  'package manager',
  'kernel',
  'SSH',
  'C',
  'kernel is a key concept in Linux Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000005000002',
  '00000000-0000-4000-a000-000000000005',
  'Q2. Which option is most directly associated with shell?',
  'file system',
  'distribution',
  'shell',
  'kernel',
  'C',
  'shell is a key concept in Linux Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000005000003',
  '00000000-0000-4000-a000-000000000005',
  'Q3. Which statement best describes terminal?',
  'package manager',
  'SSH',
  'file system',
  'terminal',
  'D',
  'terminal is a key concept in Linux Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000005000004',
  '00000000-0000-4000-a000-000000000005',
  'Q4. In this topic, what does file system refer to?',
  'sudo',
  'file system',
  'permission',
  'kernel',
  'B',
  'file system is a key concept in Linux Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000005000005',
  '00000000-0000-4000-a000-000000000005',
  'Q5. What is process?',
  'process',
  'pipe',
  'process ID',
  'shell',
  'A',
  'process is a key concept in Linux Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000005000006',
  '00000000-0000-4000-a000-000000000005',
  'Q6. Which option is most directly associated with permission?',
  'command',
  'permission',
  'pipe',
  'shell',
  'B',
  'permission is a key concept in Linux Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000005000007',
  '00000000-0000-4000-a000-000000000005',
  'Q7. Which statement best describes root?',
  'root',
  'package manager',
  'permission',
  'environment variable',
  'A',
  'root is a key concept in Linux Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000005000008',
  '00000000-0000-4000-a000-000000000005',
  'Q8. In this topic, what does directory refer to?',
  'directory',
  'terminal',
  'file system',
  'distribution',
  'A',
  'directory is a key concept in Linux Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000005000009',
  '00000000-0000-4000-a000-000000000005',
  'Q9. What is command?',
  'sudo',
  'command',
  'root',
  'kernel',
  'B',
  'command is a key concept in Linux Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000005000010',
  '00000000-0000-4000-a000-000000000005',
  'Q10. Which option is most directly associated with package manager?',
  'package manager',
  'redirection',
  'sudo',
  'SSH',
  'A',
  'package manager is a key concept in Linux Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000005000011',
  '00000000-0000-4000-a000-000000000005',
  'Q11. Which statement best describes open source?',
  'open source',
  'redirection',
  'kernel',
  'terminal',
  'A',
  'open source is a key concept in Linux Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000005000012',
  '00000000-0000-4000-a000-000000000005',
  'Q12. In this topic, what does distribution refer to?',
  'file system',
  'distribution',
  'command',
  'redirection',
  'B',
  'distribution is a key concept in Linux Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000005000013',
  '00000000-0000-4000-a000-000000000005',
  'Q13. What is SSH?',
  'sudo',
  'log',
  'SSH',
  'root',
  'C',
  'SSH is a key concept in Linux Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000005000014',
  '00000000-0000-4000-a000-000000000005',
  'Q14. Which option is most directly associated with process ID?',
  'shell',
  'file system',
  'open source',
  'process ID',
  'D',
  'process ID is a key concept in Linux Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000005000015',
  '00000000-0000-4000-a000-000000000005',
  'Q15. Which statement best describes environment variable?',
  'package manager',
  'root',
  'file system',
  'environment variable',
  'D',
  'environment variable is a key concept in Linux Basics.'
) ON CONFLICT (id) DO NOTHING;

-- Quick Learn 06: Operating Systems
INSERT INTO public.quick_learn_lessons (id, title, slug, branch, category, difficulty, estimated_minutes, is_recommended, fx_reward, short_description, content_markdown, is_published)
VALUES (
  '00000000-0000-4000-a000-000000000006',
  'Operating Systems',
  'operating-systems',
  'CSE',
  'OS',
  'Intermediate',
  3,
  TRUE,
  10,
  'Master Operating Systems fundamentals with quick reading and 15 practice MCQs on FEEDX.',
  '### Learning Text
An operating system manages hardware and provides services for applications. Major responsibilities include process management, memory management, file management, device management and security.

### Key Points
- **process**
- **thread**
- **memory management**
- **file system**
- **device driver**
- **kernel**',
  TRUE
) ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title;

INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000006000001',
  '00000000-0000-4000-a000-000000000006',
  'Q1. What is process?',
  'boot',
  'process',
  'virtual memory',
  'memory management',
  'B',
  'process is a key concept in Operating Systems.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000006000002',
  '00000000-0000-4000-a000-000000000006',
  'Q2. Which option is most directly associated with thread?',
  'user interface',
  'file system',
  'boot',
  'thread',
  'D',
  'thread is a key concept in Operating Systems.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000006000003',
  '00000000-0000-4000-a000-000000000006',
  'Q3. Which statement best describes memory management?',
  'virtual memory',
  'memory management',
  'process',
  'boot',
  'B',
  'memory management is a key concept in Operating Systems.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000006000004',
  '00000000-0000-4000-a000-000000000006',
  'Q4. In this topic, what does file system refer to?',
  'system call',
  'file system',
  'boot',
  'process',
  'B',
  'file system is a key concept in Operating Systems.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000006000005',
  '00000000-0000-4000-a000-000000000006',
  'Q5. What is device driver?',
  'device driver',
  'scheduler',
  'deadlock',
  'kernel',
  'A',
  'device driver is a key concept in Operating Systems.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000006000006',
  '00000000-0000-4000-a000-000000000006',
  'Q6. Which option is most directly associated with kernel?',
  'kernel',
  'device driver',
  'virtual memory',
  'security',
  'A',
  'kernel is a key concept in Operating Systems.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000006000007',
  '00000000-0000-4000-a000-000000000006',
  'Q7. Which statement best describes scheduler?',
  'boot',
  'multitasking',
  'interrupt',
  'scheduler',
  'D',
  'scheduler is a key concept in Operating Systems.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000006000008',
  '00000000-0000-4000-a000-000000000006',
  'Q8. In this topic, what does user interface refer to?',
  'thread',
  'permissions',
  'user interface',
  'scheduler',
  'C',
  'user interface is a key concept in Operating Systems.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000006000009',
  '00000000-0000-4000-a000-000000000006',
  'Q9. What is permissions?',
  'kernel',
  'permissions',
  'process state',
  'user interface',
  'B',
  'permissions is a key concept in Operating Systems.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000006000010',
  '00000000-0000-4000-a000-000000000006',
  'Q10. Which option is most directly associated with virtual memory?',
  'virtual memory',
  'user interface',
  'file system',
  'storage',
  'A',
  'virtual memory is a key concept in Operating Systems.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000006000011',
  '00000000-0000-4000-a000-000000000006',
  'Q11. Which statement best describes multitasking?',
  'multitasking',
  'device driver',
  'resource management',
  'system call',
  'A',
  'multitasking is a key concept in Operating Systems.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000006000012',
  '00000000-0000-4000-a000-000000000006',
  'Q12. In this topic, what does boot refer to?',
  'networking',
  'boot',
  'system call',
  'storage',
  'B',
  'boot is a key concept in Operating Systems.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000006000013',
  '00000000-0000-4000-a000-000000000006',
  'Q13. What is interrupt?',
  'permissions',
  'virtual memory',
  'resource management',
  'interrupt',
  'D',
  'interrupt is a key concept in Operating Systems.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000006000014',
  '00000000-0000-4000-a000-000000000006',
  'Q14. Which option is most directly associated with resource management?',
  'resource management',
  'deadlock',
  'device driver',
  'multitasking',
  'A',
  'resource management is a key concept in Operating Systems.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000006000015',
  '00000000-0000-4000-a000-000000000006',
  'Q15. Which statement best describes system call?',
  'system call',
  'networking',
  'device driver',
  'resource management',
  'A',
  'system call is a key concept in Operating Systems.'
) ON CONFLICT (id) DO NOTHING;

-- Quick Learn 07: Computer Networks
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
A computer network connects devices so they can exchange data. Networks use protocols, addressing and routing to move information between devices and services.

### Key Points
- **network**
- **LAN**
- **WAN**
- **router**
- **switch**
- **IP address**',
  TRUE
) ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title;

INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000007000001',
  '00000000-0000-4000-a000-000000000007',
  'Q1. What is network?',
  'network',
  'LAN',
  'firewall',
  'latency',
  'A',
  'network is a key concept in Computer Networks.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000007000002',
  '00000000-0000-4000-a000-000000000007',
  'Q2. Which option is most directly associated with LAN?',
  'DNS',
  'port',
  'LAN',
  'switch',
  'C',
  'LAN is a key concept in Computer Networks.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000007000003',
  '00000000-0000-4000-a000-000000000007',
  'Q3. Which statement best describes WAN?',
  'gateway',
  'WAN',
  'topology',
  'routing',
  'B',
  'WAN is a key concept in Computer Networks.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000007000004',
  '00000000-0000-4000-a000-000000000007',
  'Q4. In this topic, what does router refer to?',
  'bandwidth',
  'topology',
  'router',
  'port',
  'C',
  'router is a key concept in Computer Networks.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000007000005',
  '00000000-0000-4000-a000-000000000007',
  'Q5. What is switch?',
  'port',
  'switch',
  'UDP',
  'router',
  'B',
  'switch is a key concept in Computer Networks.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000007000006',
  '00000000-0000-4000-a000-000000000007',
  'Q6. Which option is most directly associated with IP address?',
  'latency',
  'WAN',
  'IP address',
  'TCP',
  'C',
  'IP address is a key concept in Computer Networks.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000007000007',
  '00000000-0000-4000-a000-000000000007',
  'Q7. Which statement best describes MAC address?',
  'WAN',
  'firewall',
  'topology',
  'MAC address',
  'D',
  'MAC address is a key concept in Computer Networks.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000007000008',
  '00000000-0000-4000-a000-000000000007',
  'Q8. In this topic, what does protocol refer to?',
  'WAN',
  'IP address',
  'MAC address',
  'protocol',
  'D',
  'protocol is a key concept in Computer Networks.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000007000009',
  '00000000-0000-4000-a000-000000000007',
  'Q9. What is packet?',
  'IP address',
  'DNS',
  'WAN',
  'packet',
  'D',
  'packet is a key concept in Computer Networks.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000007000010',
  '00000000-0000-4000-a000-000000000007',
  'Q10. Which option is most directly associated with routing?',
  'packet',
  'protocol',
  'routing',
  'firewall',
  'C',
  'routing is a key concept in Computer Networks.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000007000011',
  '00000000-0000-4000-a000-000000000007',
  'Q11. Which statement best describes DNS?',
  'LAN',
  'DNS',
  'gateway',
  'WAN',
  'B',
  'DNS is a key concept in Computer Networks.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000007000012',
  '00000000-0000-4000-a000-000000000007',
  'Q12. In this topic, what does DHCP refer to?',
  'topology',
  'DHCP',
  'routing',
  'TCP',
  'B',
  'DHCP is a key concept in Computer Networks.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000007000013',
  '00000000-0000-4000-a000-000000000007',
  'Q13. What is TCP?',
  'TCP',
  'firewall',
  'UDP',
  'DHCP',
  'A',
  'TCP is a key concept in Computer Networks.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000007000014',
  '00000000-0000-4000-a000-000000000007',
  'Q14. Which option is most directly associated with UDP?',
  'WAN',
  'LAN',
  'UDP',
  'gateway',
  'C',
  'UDP is a key concept in Computer Networks.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000007000015',
  '00000000-0000-4000-a000-000000000007',
  'Q15. Which statement best describes port?',
  'switch',
  'IP address',
  'port',
  'router',
  'C',
  'port is a key concept in Computer Networks.'
) ON CONFLICT (id) DO NOTHING;

-- Quick Learn 08: Internet & Web
INSERT INTO public.quick_learn_lessons (id, title, slug, branch, category, difficulty, estimated_minutes, is_recommended, fx_reward, short_description, content_markdown, is_published)
VALUES (
  '00000000-0000-4000-a000-000000000008',
  'Internet & Web',
  'internet-web',
  'CSE',
  'Web Dev',
  'Beginner',
  3,
  TRUE,
  10,
  'Master Internet & Web fundamentals with quick reading and 15 practice MCQs on FEEDX.',
  '### Learning Text
The internet is a global network of interconnected networks. The World Wide Web is a service running on the internet that uses technologies such as HTTP, URLs, browsers and web servers.

### Key Points
- **internet**
- **web**
- **browser**
- **server**
- **URL**
- **HTTP**',
  TRUE
) ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title;

INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000008000001',
  '00000000-0000-4000-a000-000000000008',
  'Q1. What is internet?',
  'response',
  'domain',
  'internet',
  'server',
  'C',
  'internet is a key concept in Internet & Web.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000008000002',
  '00000000-0000-4000-a000-000000000008',
  'Q2. Which option is most directly associated with web?',
  'IP address',
  'URL',
  'web',
  'browser',
  'C',
  'web is a key concept in Internet & Web.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000008000003',
  '00000000-0000-4000-a000-000000000008',
  'Q3. Which statement best describes browser?',
  'CSS',
  'server',
  'HTTPS',
  'browser',
  'D',
  'browser is a key concept in Internet & Web.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000008000004',
  '00000000-0000-4000-a000-000000000008',
  'Q4. In this topic, what does server refer to?',
  'response',
  'server',
  'web server',
  'CSS',
  'B',
  'server is a key concept in Internet & Web.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000008000005',
  '00000000-0000-4000-a000-000000000008',
  'Q5. What is URL?',
  'client',
  'web',
  'URL',
  'web server',
  'C',
  'URL is a key concept in Internet & Web.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000008000006',
  '00000000-0000-4000-a000-000000000008',
  'Q6. Which option is most directly associated with HTTP?',
  'URL',
  'response',
  'server',
  'HTTP',
  'D',
  'HTTP is a key concept in Internet & Web.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000008000007',
  '00000000-0000-4000-a000-000000000008',
  'Q7. Which statement best describes DNS?',
  'internet',
  'response',
  'DNS',
  'server',
  'C',
  'DNS is a key concept in Internet & Web.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000008000008',
  '00000000-0000-4000-a000-000000000008',
  'Q8. In this topic, what does HTML refer to?',
  'server',
  'cookie',
  'cache',
  'HTML',
  'D',
  'HTML is a key concept in Internet & Web.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000008000009',
  '00000000-0000-4000-a000-000000000008',
  'Q9. What is CSS?',
  'CSS',
  'cookie',
  'web server',
  'request',
  'A',
  'CSS is a key concept in Internet & Web.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000008000010',
  '00000000-0000-4000-a000-000000000008',
  'Q10. Which option is most directly associated with JavaScript?',
  'URL',
  'internet',
  'HTTP',
  'JavaScript',
  'D',
  'JavaScript is a key concept in Internet & Web.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000008000011',
  '00000000-0000-4000-a000-000000000008',
  'Q11. Which statement best describes client?',
  'cache',
  'client',
  'cookie',
  'domain',
  'B',
  'client is a key concept in Internet & Web.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000008000012',
  '00000000-0000-4000-a000-000000000008',
  'Q12. In this topic, what does request refer to?',
  'response',
  'HTML',
  'request',
  'browser',
  'C',
  'request is a key concept in Internet & Web.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000008000013',
  '00000000-0000-4000-a000-000000000008',
  'Q13. What is response?',
  'HTTPS',
  'response',
  'DNS',
  'URL',
  'B',
  'response is a key concept in Internet & Web.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000008000014',
  '00000000-0000-4000-a000-000000000008',
  'Q14. Which option is most directly associated with domain?',
  'HTML',
  'domain',
  'request',
  'internet',
  'B',
  'domain is a key concept in Internet & Web.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000008000015',
  '00000000-0000-4000-a000-000000000008',
  'Q15. Which statement best describes IP address?',
  'internet',
  'web',
  'IP address',
  'DNS',
  'C',
  'IP address is a key concept in Internet & Web.'
) ON CONFLICT (id) DO NOTHING;

-- Quick Learn 09: HTML & CSS
INSERT INTO public.quick_learn_lessons (id, title, slug, branch, category, difficulty, estimated_minutes, is_recommended, fx_reward, short_description, content_markdown, is_published)
VALUES (
  '00000000-0000-4000-a000-000000000009',
  'HTML & CSS',
  'html-css',
  'CSE',
  'Web Dev',
  'Beginner',
  3,
  TRUE,
  10,
  'Master HTML & CSS fundamentals with quick reading and 15 practice MCQs on FEEDX.',
  '### Learning Text
HTML structures web pages using elements such as headings, paragraphs, links and forms. CSS controls presentation including colors, spacing, typography and layout.

### Key Points
- **HTML**
- **element**
- **tag**
- **attribute**
- **heading**
- **paragraph**',
  TRUE
) ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title;

INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000009000001',
  '00000000-0000-4000-a000-000000000009',
  'Q1. What is HTML?',
  'link',
  'property',
  'HTML',
  'value',
  'C',
  'HTML is a key concept in HTML & CSS.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000009000002',
  '00000000-0000-4000-a000-000000000009',
  'Q2. Which option is most directly associated with element?',
  'CSS',
  'tag',
  'element',
  'attribute',
  'C',
  'element is a key concept in HTML & CSS.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000009000003',
  '00000000-0000-4000-a000-000000000009',
  'Q3. Which statement best describes tag?',
  'HTML',
  'tag',
  'property',
  'selector',
  'B',
  'tag is a key concept in HTML & CSS.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000009000004',
  '00000000-0000-4000-a000-000000000009',
  'Q4. In this topic, what does attribute refer to?',
  'attribute',
  'selector',
  'CSS',
  'class',
  'A',
  'attribute is a key concept in HTML & CSS.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000009000005',
  '00000000-0000-4000-a000-000000000009',
  'Q5. What is heading?',
  'form',
  'heading',
  'attribute',
  'element',
  'B',
  'heading is a key concept in HTML & CSS.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000009000006',
  '00000000-0000-4000-a000-000000000009',
  'Q6. Which option is most directly associated with paragraph?',
  'responsive design',
  'paragraph',
  'id',
  'attribute',
  'B',
  'paragraph is a key concept in HTML & CSS.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000009000007',
  '00000000-0000-4000-a000-000000000009',
  'Q7. Which statement best describes link?',
  'selector',
  'link',
  'form',
  'id',
  'B',
  'link is a key concept in HTML & CSS.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000009000008',
  '00000000-0000-4000-a000-000000000009',
  'Q8. In this topic, what does image refer to?',
  'padding',
  'CSS',
  'image',
  'paragraph',
  'C',
  'image is a key concept in HTML & CSS.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000009000009',
  '00000000-0000-4000-a000-000000000009',
  'Q9. What is form?',
  'form',
  'link',
  'padding',
  'margin',
  'A',
  'form is a key concept in HTML & CSS.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000009000010',
  '00000000-0000-4000-a000-000000000009',
  'Q10. Which option is most directly associated with CSS?',
  'paragraph',
  'id',
  'link',
  'CSS',
  'D',
  'CSS is a key concept in HTML & CSS.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000009000011',
  '00000000-0000-4000-a000-000000000009',
  'Q11. Which statement best describes selector?',
  'responsive design',
  'selector',
  'value',
  'margin',
  'B',
  'selector is a key concept in HTML & CSS.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000009000012',
  '00000000-0000-4000-a000-000000000009',
  'Q12. In this topic, what does property refer to?',
  'id',
  'paragraph',
  'selector',
  'property',
  'D',
  'property is a key concept in HTML & CSS.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000009000013',
  '00000000-0000-4000-a000-000000000009',
  'Q13. What is value?',
  'class',
  'property',
  'margin',
  'value',
  'D',
  'value is a key concept in HTML & CSS.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000009000014',
  '00000000-0000-4000-a000-000000000009',
  'Q14. Which option is most directly associated with class?',
  'class',
  'box model',
  'attribute',
  'id',
  'A',
  'class is a key concept in HTML & CSS.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000009000015',
  '00000000-0000-4000-a000-000000000009',
  'Q15. Which statement best describes id?',
  'property',
  'id',
  'margin',
  'attribute',
  'B',
  'id is a key concept in HTML & CSS.'
) ON CONFLICT (id) DO NOTHING;

-- Quick Learn 10: JavaScript Basics
INSERT INTO public.quick_learn_lessons (id, title, slug, branch, category, difficulty, estimated_minutes, is_recommended, fx_reward, short_description, content_markdown, is_published)
VALUES (
  '00000000-0000-4000-a000-000000000010',
  'JavaScript Basics',
  'javascript-basics',
  'CSE',
  'Programming',
  'Beginner',
  3,
  TRUE,
  10,
  'Master JavaScript Basics fundamentals with quick reading and 15 practice MCQs on FEEDX.',
  '### Learning Text
JavaScript is a programming language widely used to add behavior and interactivity to web applications. It supports variables, functions, objects, arrays, events and asynchronous programming.

### Key Points
- **JavaScript**
- **variable**
- **function**
- **array**
- **object**
- **string**',
  TRUE
) ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title;

INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000010000001',
  '00000000-0000-4000-a000-000000000010',
  'Q1. What is JavaScript?',
  'loop',
  'number',
  'JavaScript',
  'promise',
  'C',
  'JavaScript is a key concept in JavaScript Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000010000002',
  '00000000-0000-4000-a000-000000000010',
  'Q2. Which option is most directly associated with variable?',
  'callback',
  'boolean',
  'event',
  'variable',
  'D',
  'variable is a key concept in JavaScript Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000010000003',
  '00000000-0000-4000-a000-000000000010',
  'Q3. Which statement best describes function?',
  'loop',
  'number',
  'operator',
  'function',
  'D',
  'function is a key concept in JavaScript Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000010000004',
  '00000000-0000-4000-a000-000000000010',
  'Q4. In this topic, what does array refer to?',
  'object',
  'boolean',
  'await',
  'array',
  'D',
  'array is a key concept in JavaScript Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000010000005',
  '00000000-0000-4000-a000-000000000010',
  'Q5. What is object?',
  'conditional',
  'scope',
  'object',
  'promise',
  'C',
  'object is a key concept in JavaScript Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000010000006',
  '00000000-0000-4000-a000-000000000010',
  'Q6. Which option is most directly associated with string?',
  'loop',
  'string',
  'scope',
  'operator',
  'B',
  'string is a key concept in JavaScript Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000010000007',
  '00000000-0000-4000-a000-000000000010',
  'Q7. Which statement best describes number?',
  'loop',
  'JavaScript',
  'number',
  'module',
  'C',
  'number is a key concept in JavaScript Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000010000008',
  '00000000-0000-4000-a000-000000000010',
  'Q8. In this topic, what does boolean refer to?',
  'scope',
  'function',
  'variable',
  'boolean',
  'D',
  'boolean is a key concept in JavaScript Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000010000009',
  '00000000-0000-4000-a000-000000000010',
  'Q9. What is event?',
  'scope',
  'function',
  'variable',
  'event',
  'D',
  'event is a key concept in JavaScript Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000010000010',
  '00000000-0000-4000-a000-000000000010',
  'Q10. Which option is most directly associated with DOM?',
  'DOM',
  'scope',
  'async',
  'module',
  'A',
  'DOM is a key concept in JavaScript Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000010000011',
  '00000000-0000-4000-a000-000000000010',
  'Q11. Which statement best describes scope?',
  'operator',
  'scope',
  'loop',
  'promise',
  'B',
  'scope is a key concept in JavaScript Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000010000012',
  '00000000-0000-4000-a000-000000000010',
  'Q12. In this topic, what does promise refer to?',
  'function',
  'promise',
  'callback',
  'DOM',
  'B',
  'promise is a key concept in JavaScript Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000010000013',
  '00000000-0000-4000-a000-000000000010',
  'Q13. What is async?',
  'conditional',
  'object',
  'async',
  'number',
  'C',
  'async is a key concept in JavaScript Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000010000014',
  '00000000-0000-4000-a000-000000000010',
  'Q14. Which option is most directly associated with await?',
  'await',
  'event',
  'async',
  'string',
  'A',
  'await is a key concept in JavaScript Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000010000015',
  '00000000-0000-4000-a000-000000000010',
  'Q15. Which statement best describes callback?',
  'DOM',
  'loop',
  'conditional',
  'callback',
  'D',
  'callback is a key concept in JavaScript Basics.'
) ON CONFLICT (id) DO NOTHING;

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
Python is a high-level, general-purpose programming language known for readable syntax. It is widely used in automation, web development, data analysis, scripting and education.

### Key Points
- **Python**
- **variable**
- **function**
- **list**
- **tuple**
- **dictionary**',
  TRUE
) ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title;

INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000011000001',
  '00000000-0000-4000-a000-000000000011',
  'Q1. What is Python?',
  'exception',
  'module',
  'Python',
  'loop',
  'C',
  'Python is a key concept in Python Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000011000002',
  '00000000-0000-4000-a000-000000000011',
  'Q2. Which option is most directly associated with variable?',
  'class',
  'indentation',
  'Python',
  'variable',
  'D',
  'variable is a key concept in Python Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000011000003',
  '00000000-0000-4000-a000-000000000011',
  'Q3. Which statement best describes function?',
  'class',
  'exception',
  'function',
  'library',
  'C',
  'function is a key concept in Python Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000011000004',
  '00000000-0000-4000-a000-000000000011',
  'Q4. In this topic, what does list refer to?',
  'list',
  'Python',
  'conditional',
  'pip',
  'A',
  'list is a key concept in Python Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000011000005',
  '00000000-0000-4000-a000-000000000011',
  'Q5. What is tuple?',
  'tuple',
  'class',
  'function',
  'conditional',
  'A',
  'tuple is a key concept in Python Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000011000006',
  '00000000-0000-4000-a000-000000000011',
  'Q6. Which option is most directly associated with dictionary?',
  'exception',
  'dictionary',
  'library',
  'Python',
  'B',
  'dictionary is a key concept in Python Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000011000007',
  '00000000-0000-4000-a000-000000000011',
  'Q7. Which statement best describes set?',
  'variable',
  'set',
  'module',
  'string',
  'B',
  'set is a key concept in Python Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000011000008',
  '00000000-0000-4000-a000-000000000011',
  'Q8. In this topic, what does string refer to?',
  'list',
  'string',
  'conditional',
  'object',
  'B',
  'string is a key concept in Python Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000011000009',
  '00000000-0000-4000-a000-000000000011',
  'Q9. What is loop?',
  'file',
  'tuple',
  'loop',
  'Python',
  'C',
  'loop is a key concept in Python Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000011000010',
  '00000000-0000-4000-a000-000000000011',
  'Q10. Which option is most directly associated with conditional?',
  'Python',
  'pip',
  'module',
  'conditional',
  'D',
  'conditional is a key concept in Python Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000011000011',
  '00000000-0000-4000-a000-000000000011',
  'Q11. Which statement best describes module?',
  'interpreter',
  'variable',
  'conditional',
  'module',
  'D',
  'module is a key concept in Python Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000011000012',
  '00000000-0000-4000-a000-000000000011',
  'Q12. In this topic, what does package refer to?',
  'Python',
  'dictionary',
  'set',
  'package',
  'D',
  'package is a key concept in Python Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000011000013',
  '00000000-0000-4000-a000-000000000011',
  'Q13. What is exception?',
  'object',
  'loop',
  'Python',
  'exception',
  'D',
  'exception is a key concept in Python Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000011000014',
  '00000000-0000-4000-a000-000000000011',
  'Q14. Which option is most directly associated with indentation?',
  'string',
  'indentation',
  'interpreter',
  'pip',
  'B',
  'indentation is a key concept in Python Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000011000015',
  '00000000-0000-4000-a000-000000000011',
  'Q15. Which statement best describes class?',
  'variable',
  'class',
  'interpreter',
  'conditional',
  'B',
  'class is a key concept in Python Basics.'
) ON CONFLICT (id) DO NOTHING;

-- Quick Learn 12: C Programming
INSERT INTO public.quick_learn_lessons (id, title, slug, branch, category, difficulty, estimated_minutes, is_recommended, fx_reward, short_description, content_markdown, is_published)
VALUES (
  '00000000-0000-4000-a000-000000000012',
  'C Programming',
  'c-programming',
  'CSE',
  'Programming',
  'Beginner',
  3,
  TRUE,
  10,
  'Master C Programming fundamentals with quick reading and 15 practice MCQs on FEEDX.',
  '### Learning Text
C is a compiled, procedural programming language widely used in systems programming and embedded development. It provides variables, functions, arrays, pointers, structures and direct memory-related capabilities.

### Key Points
- **C**
- **compiler**
- **function**
- **variable**
- **array**
- **pointer**',
  TRUE
) ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title;

INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000012000001',
  '00000000-0000-4000-a000-000000000012',
  'Q1. What is C?',
  'C',
  'stack',
  'structure',
  'printf',
  'A',
  'C is a key concept in C Programming.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000012000002',
  '00000000-0000-4000-a000-000000000012',
  'Q2. Which option is most directly associated with compiler?',
  'string',
  'variable',
  'compiler',
  'memory',
  'C',
  'compiler is a key concept in C Programming.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000012000003',
  '00000000-0000-4000-a000-000000000012',
  'Q3. Which statement best describes function?',
  'structure',
  'C',
  'function',
  'pointer',
  'C',
  'function is a key concept in C Programming.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000012000004',
  '00000000-0000-4000-a000-000000000012',
  'Q4. In this topic, what does variable refer to?',
  'stack',
  'C',
  'function',
  'variable',
  'D',
  'variable is a key concept in C Programming.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000012000005',
  '00000000-0000-4000-a000-000000000012',
  'Q5. What is array?',
  'printf',
  'array',
  'loop',
  'structure',
  'B',
  'array is a key concept in C Programming.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000012000006',
  '00000000-0000-4000-a000-000000000012',
  'Q6. Which option is most directly associated with pointer?',
  'source file',
  'address',
  'printf',
  'pointer',
  'D',
  'pointer is a key concept in C Programming.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000012000007',
  '00000000-0000-4000-a000-000000000012',
  'Q7. Which statement best describes structure?',
  'structure',
  'header',
  'compiler',
  'loop',
  'A',
  'structure is a key concept in C Programming.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000012000008',
  '00000000-0000-4000-a000-000000000012',
  'Q8. In this topic, what does header refer to?',
  'condition',
  'loop',
  'scanf',
  'header',
  'D',
  'header is a key concept in C Programming.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000012000009',
  '00000000-0000-4000-a000-000000000012',
  'Q9. What is source file?',
  'header',
  'source file',
  'memory',
  'printf',
  'B',
  'source file is a key concept in C Programming.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000012000010',
  '00000000-0000-4000-a000-000000000012',
  'Q10. Which option is most directly associated with main?',
  'address',
  'function',
  'loop',
  'main',
  'D',
  'main is a key concept in C Programming.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000012000011',
  '00000000-0000-4000-a000-000000000012',
  'Q11. Which statement best describes printf?',
  'printf',
  'array',
  'address',
  'compiler',
  'A',
  'printf is a key concept in C Programming.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000012000012',
  '00000000-0000-4000-a000-000000000012',
  'Q12. In this topic, what does scanf refer to?',
  'scanf',
  'main',
  'heap',
  'structure',
  'A',
  'scanf is a key concept in C Programming.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000012000013',
  '00000000-0000-4000-a000-000000000012',
  'Q13. What is memory?',
  'function',
  'memory',
  'scanf',
  'dereference',
  'B',
  'memory is a key concept in C Programming.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000012000014',
  '00000000-0000-4000-a000-000000000012',
  'Q14. Which option is most directly associated with address?',
  'array',
  'address',
  'printf',
  'variable',
  'B',
  'address is a key concept in C Programming.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000012000015',
  '00000000-0000-4000-a000-000000000012',
  'Q15. Which statement best describes dereference?',
  'dereference',
  'heap',
  'compiler',
  'scanf',
  'A',
  'dereference is a key concept in C Programming.'
) ON CONFLICT (id) DO NOTHING;

-- Quick Learn 13: Java Basics
INSERT INTO public.quick_learn_lessons (id, title, slug, branch, category, difficulty, estimated_minutes, is_recommended, fx_reward, short_description, content_markdown, is_published)
VALUES (
  '00000000-0000-4000-a000-000000000013',
  'Java Basics',
  'java-basics',
  'CSE',
  'Programming',
  'Intermediate',
  3,
  TRUE,
  10,
  'Master Java Basics fundamentals with quick reading and 15 practice MCQs on FEEDX.',
  '### Learning Text
Java is a general-purpose, object-oriented programming language designed around the Java platform and JVM. Java programs can run on systems that provide a compatible Java runtime.

### Key Points
- **Java**
- **JVM**
- **class**
- **object**
- **method**
- **inheritance**',
  TRUE
) ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title;

INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000013000001',
  '00000000-0000-4000-a000-000000000013',
  'Q1. What is Java?',
  'compiler',
  'Java',
  'static',
  'class',
  'B',
  'Java is a key concept in Java Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000013000002',
  '00000000-0000-4000-a000-000000000013',
  'Q2. Which option is most directly associated with JVM?',
  'JVM',
  'static',
  'array',
  'String',
  'A',
  'JVM is a key concept in Java Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000013000003',
  '00000000-0000-4000-a000-000000000013',
  'Q3. Which statement best describes class?',
  'bytecode',
  'constructor',
  'class',
  'exception',
  'C',
  'class is a key concept in Java Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000013000004',
  '00000000-0000-4000-a000-000000000013',
  'Q4. In this topic, what does object refer to?',
  'object',
  'class',
  'constructor',
  'polymorphism',
  'A',
  'object is a key concept in Java Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000013000005',
  '00000000-0000-4000-a000-000000000013',
  'Q5. What is method?',
  'method',
  'Java',
  'encapsulation',
  'inheritance',
  'A',
  'method is a key concept in Java Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000013000006',
  '00000000-0000-4000-a000-000000000013',
  'Q6. Which option is most directly associated with inheritance?',
  'inheritance',
  'final',
  'JVM',
  'encapsulation',
  'A',
  'inheritance is a key concept in Java Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000013000007',
  '00000000-0000-4000-a000-000000000013',
  'Q7. Which statement best describes encapsulation?',
  'encapsulation',
  'interface',
  'String',
  'method',
  'A',
  'encapsulation is a key concept in Java Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000013000008',
  '00000000-0000-4000-a000-000000000013',
  'Q8. In this topic, what does polymorphism refer to?',
  'final',
  'polymorphism',
  'object',
  'String',
  'B',
  'polymorphism is a key concept in Java Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000013000009',
  '00000000-0000-4000-a000-000000000013',
  'Q9. What is interface?',
  'encapsulation',
  'interface',
  'String',
  'static',
  'B',
  'interface is a key concept in Java Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000013000010',
  '00000000-0000-4000-a000-000000000013',
  'Q10. Which option is most directly associated with package?',
  'constructor',
  'inheritance',
  'array',
  'package',
  'D',
  'package is a key concept in Java Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000013000011',
  '00000000-0000-4000-a000-000000000013',
  'Q11. Which statement best describes exception?',
  'array',
  'exception',
  'object',
  'JVM',
  'B',
  'exception is a key concept in Java Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000013000012',
  '00000000-0000-4000-a000-000000000013',
  'Q12. In this topic, what does bytecode refer to?',
  'constructor',
  'method',
  'bytecode',
  'JDK',
  'C',
  'bytecode is a key concept in Java Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000013000013',
  '00000000-0000-4000-a000-000000000013',
  'Q13. What is compiler?',
  'JDK',
  'encapsulation',
  'compiler',
  'JVM',
  'C',
  'compiler is a key concept in Java Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000013000014',
  '00000000-0000-4000-a000-000000000013',
  'Q14. Which option is most directly associated with garbage collection?',
  'garbage collection',
  'compiler',
  'package',
  'class',
  'A',
  'garbage collection is a key concept in Java Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000013000015',
  '00000000-0000-4000-a000-000000000013',
  'Q15. Which statement best describes constructor?',
  'final',
  'JDK',
  'constructor',
  'encapsulation',
  'C',
  'constructor is a key concept in Java Basics.'
) ON CONFLICT (id) DO NOTHING;

-- Quick Learn 14: SQL & Databases
INSERT INTO public.quick_learn_lessons (id, title, slug, branch, category, difficulty, estimated_minutes, is_recommended, fx_reward, short_description, content_markdown, is_published)
VALUES (
  '00000000-0000-4000-a000-000000000014',
  'SQL & Databases',
  'sql-databases',
  'CSE',
  'Databases',
  'Intermediate',
  3,
  TRUE,
  10,
  'Master SQL & Databases fundamentals with quick reading and 15 practice MCQs on FEEDX.',
  '### Learning Text
SQL is used to work with relational databases. Common operations include SELECT, INSERT, UPDATE and DELETE. Relational databases organize information into tables with rows and columns.

### Key Points
- **database**
- **table**
- **row**
- **column**
- **primary key**
- **foreign key**',
  TRUE
) ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title;

INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000014000001',
  '00000000-0000-4000-a000-000000000014',
  'Q1. What is database?',
  'database',
  'row',
  'SELECT',
  'relational',
  'A',
  'database is a key concept in SQL & Databases.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000014000002',
  '00000000-0000-4000-a000-000000000014',
  'Q2. Which option is most directly associated with table?',
  'ORDER BY',
  'table',
  'row',
  'relational',
  'B',
  'table is a key concept in SQL & Databases.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000014000003',
  '00000000-0000-4000-a000-000000000014',
  'Q3. Which statement best describes row?',
  'primary key',
  'index',
  'row',
  'table',
  'C',
  'row is a key concept in SQL & Databases.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000014000004',
  '00000000-0000-4000-a000-000000000014',
  'Q4. In this topic, what does column refer to?',
  'GROUP BY',
  'DELETE',
  'column',
  'primary key',
  'C',
  'column is a key concept in SQL & Databases.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000014000005',
  '00000000-0000-4000-a000-000000000014',
  'Q5. What is primary key?',
  'UPDATE',
  'DELETE',
  'primary key',
  'SQL',
  'C',
  'primary key is a key concept in SQL & Databases.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000014000006',
  '00000000-0000-4000-a000-000000000014',
  'Q6. Which option is most directly associated with foreign key?',
  'table',
  'row',
  'SQL',
  'foreign key',
  'D',
  'foreign key is a key concept in SQL & Databases.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000014000007',
  '00000000-0000-4000-a000-000000000014',
  'Q7. Which statement best describes SELECT?',
  'DELETE',
  'row',
  'SELECT',
  'foreign key',
  'C',
  'SELECT is a key concept in SQL & Databases.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000014000008',
  '00000000-0000-4000-a000-000000000014',
  'Q8. In this topic, what does INSERT refer to?',
  'WHERE',
  'SQL',
  'schema',
  'INSERT',
  'D',
  'INSERT is a key concept in SQL & Databases.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000014000009',
  '00000000-0000-4000-a000-000000000014',
  'Q9. What is UPDATE?',
  'database',
  'UPDATE',
  'transaction',
  'ORDER BY',
  'B',
  'UPDATE is a key concept in SQL & Databases.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000014000010',
  '00000000-0000-4000-a000-000000000014',
  'Q10. Which option is most directly associated with DELETE?',
  'schema',
  'SELECT',
  'SQL',
  'DELETE',
  'D',
  'DELETE is a key concept in SQL & Databases.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000014000011',
  '00000000-0000-4000-a000-000000000014',
  'Q11. Which statement best describes WHERE?',
  'index',
  'relational',
  'primary key',
  'WHERE',
  'D',
  'WHERE is a key concept in SQL & Databases.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000014000012',
  '00000000-0000-4000-a000-000000000014',
  'Q12. In this topic, what does JOIN refer to?',
  'schema',
  'JOIN',
  'INSERT',
  'UPDATE',
  'B',
  'JOIN is a key concept in SQL & Databases.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000014000013',
  '00000000-0000-4000-a000-000000000014',
  'Q13. What is GROUP BY?',
  'GROUP BY',
  'table',
  'JOIN',
  'index',
  'A',
  'GROUP BY is a key concept in SQL & Databases.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000014000014',
  '00000000-0000-4000-a000-000000000014',
  'Q14. Which option is most directly associated with ORDER BY?',
  'relational',
  'foreign key',
  'ORDER BY',
  'GROUP BY',
  'C',
  'ORDER BY is a key concept in SQL & Databases.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000014000015',
  '00000000-0000-4000-a000-000000000014',
  'Q15. Which statement best describes index?',
  'index',
  'INSERT',
  'DELETE',
  'constraint',
  'A',
  'index is a key concept in SQL & Databases.'
) ON CONFLICT (id) DO NOTHING;

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
Git is the version-control tool installed on a developer''s computer or environment. GitHub is a hosted platform that provides remote repositories and collaboration features around Git.

### Key Points
- **Git**
- **GitHub**
- **local repository**
- **remote repository**
- **commit**
- **push**',
  TRUE
) ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title;

INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000015000001',
  '00000000-0000-4000-a000-000000000015',
  'Q1. What is Git?',
  'merge',
  'clone',
  'Git',
  'remote repository',
  'C',
  'Git is a key concept in Git vs GitHub.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000015000002',
  '00000000-0000-4000-a000-000000000015',
  'Q2. Which option is most directly associated with GitHub?',
  'diff',
  'GitHub',
  'merge',
  'branch',
  'B',
  'GitHub is a key concept in Git vs GitHub.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000015000003',
  '00000000-0000-4000-a000-000000000015',
  'Q3. Which statement best describes local repository?',
  'repository',
  'local repository',
  'remote repository',
  'issue',
  'B',
  'local repository is a key concept in Git vs GitHub.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000015000004',
  '00000000-0000-4000-a000-000000000015',
  'Q4. In this topic, what does remote repository refer to?',
  'fork',
  'remote repository',
  'version control',
  'branch',
  'B',
  'remote repository is a key concept in Git vs GitHub.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000015000005',
  '00000000-0000-4000-a000-000000000015',
  'Q5. What is commit?',
  'push',
  'commit',
  'branch',
  'hosting',
  'B',
  'commit is a key concept in Git vs GitHub.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000015000006',
  '00000000-0000-4000-a000-000000000015',
  'Q6. Which option is most directly associated with push?',
  'push',
  'merge',
  'Git',
  'version control',
  'A',
  'push is a key concept in Git vs GitHub.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000015000007',
  '00000000-0000-4000-a000-000000000015',
  'Q7. Which statement best describes pull?',
  'pull',
  'staging',
  'commit',
  'hosting',
  'A',
  'pull is a key concept in Git vs GitHub.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000015000008',
  '00000000-0000-4000-a000-000000000015',
  'Q8. In this topic, what does clone refer to?',
  'clone',
  'Git',
  'GitHub',
  'collaboration',
  'A',
  'clone is a key concept in Git vs GitHub.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000015000009',
  '00000000-0000-4000-a000-000000000015',
  'Q9. What is branch?',
  'branch',
  'commit',
  'issue',
  'pull',
  'A',
  'branch is a key concept in Git vs GitHub.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000015000010',
  '00000000-0000-4000-a000-000000000015',
  'Q10. Which option is most directly associated with merge?',
  'merge',
  'issue',
  'Actions',
  'remote repository',
  'A',
  'merge is a key concept in Git vs GitHub.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000015000011',
  '00000000-0000-4000-a000-000000000015',
  'Q11. Which statement best describes pull request?',
  'pull request',
  'GitHub',
  'clone',
  'branch',
  'A',
  'pull request is a key concept in Git vs GitHub.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000015000012',
  '00000000-0000-4000-a000-000000000015',
  'Q12. In this topic, what does fork refer to?',
  'repository',
  'collaboration',
  'fork',
  'version control',
  'C',
  'fork is a key concept in Git vs GitHub.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000015000013',
  '00000000-0000-4000-a000-000000000015',
  'Q13. What is repository?',
  'GitHub',
  'staging',
  'pull request',
  'repository',
  'D',
  'repository is a key concept in Git vs GitHub.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000015000014',
  '00000000-0000-4000-a000-000000000015',
  'Q14. Which option is most directly associated with version control?',
  'hosting',
  'version control',
  'Actions',
  'branch',
  'B',
  'version control is a key concept in Git vs GitHub.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000015000015',
  '00000000-0000-4000-a000-000000000015',
  'Q15. Which statement best describes hosting?',
  'hosting',
  'remote repository',
  'fork',
  'pull',
  'A',
  'hosting is a key concept in Git vs GitHub.'
) ON CONFLICT (id) DO NOTHING;

-- Quick Learn 16: HTTP & HTTPS
INSERT INTO public.quick_learn_lessons (id, title, slug, branch, category, difficulty, estimated_minutes, is_recommended, fx_reward, short_description, content_markdown, is_published)
VALUES (
  '00000000-0000-4000-a000-000000000016',
  'HTTP & HTTPS',
  'http-https',
  'CSE',
  'Networking',
  'Intermediate',
  3,
  TRUE,
  10,
  'Master HTTP & HTTPS fundamentals with quick reading and 15 practice MCQs on FEEDX.',
  '### Learning Text
HTTP is an application-layer protocol used for web communication. HTTPS is HTTP protected by TLS, providing encrypted communication and helping protect data from interception or tampering.

### Key Points
- **HTTP**
- **HTTPS**
- **TLS**
- **request**
- **response**
- **GET**',
  TRUE
) ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title;

INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000016000001',
  '00000000-0000-4000-a000-000000000016',
  'Q1. What is HTTP?',
  'POST',
  'GET',
  'port 443',
  'HTTP',
  'D',
  'HTTP is a key concept in HTTP & HTTPS.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000016000002',
  '00000000-0000-4000-a000-000000000016',
  'Q2. Which option is most directly associated with HTTPS?',
  'status code',
  'method',
  'cache',
  'HTTPS',
  'D',
  'HTTPS is a key concept in HTTP & HTTPS.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000016000003',
  '00000000-0000-4000-a000-000000000016',
  'Q3. Which statement best describes TLS?',
  'TLS',
  'POST',
  'URL',
  'response',
  'A',
  'TLS is a key concept in HTTP & HTTPS.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000016000004',
  '00000000-0000-4000-a000-000000000016',
  'Q4. In this topic, what does request refer to?',
  'URL',
  'response',
  'request',
  'header',
  'C',
  'request is a key concept in HTTP & HTTPS.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000016000005',
  '00000000-0000-4000-a000-000000000016',
  'Q5. What is response?',
  'redirect',
  'POST',
  'response',
  'port 80',
  'C',
  'response is a key concept in HTTP & HTTPS.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000016000006',
  '00000000-0000-4000-a000-000000000016',
  'Q6. Which option is most directly associated with GET?',
  'cookie',
  'TLS',
  'GET',
  'request',
  'C',
  'GET is a key concept in HTTP & HTTPS.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000016000007',
  '00000000-0000-4000-a000-000000000016',
  'Q7. Which statement best describes POST?',
  'POST',
  'HTTP',
  'certificate',
  'port 443',
  'A',
  'POST is a key concept in HTTP & HTTPS.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000016000008',
  '00000000-0000-4000-a000-000000000016',
  'Q8. In this topic, what does status code refer to?',
  'method',
  'status code',
  'HTTPS',
  'response',
  'B',
  'status code is a key concept in HTTP & HTTPS.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000016000009',
  '00000000-0000-4000-a000-000000000016',
  'Q9. What is header?',
  'request',
  'method',
  'header',
  'cache',
  'C',
  'header is a key concept in HTTP & HTTPS.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000016000010',
  '00000000-0000-4000-a000-000000000016',
  'Q10. Which option is most directly associated with URL?',
  'status code',
  'cookie',
  'URL',
  'port 80',
  'C',
  'URL is a key concept in HTTP & HTTPS.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000016000011',
  '00000000-0000-4000-a000-000000000016',
  'Q11. Which statement best describes client?',
  'cache',
  'client',
  'POST',
  'TLS',
  'B',
  'client is a key concept in HTTP & HTTPS.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000016000012',
  '00000000-0000-4000-a000-000000000016',
  'Q12. In this topic, what does server refer to?',
  'GET',
  'client',
  'URL',
  'server',
  'D',
  'server is a key concept in HTTP & HTTPS.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000016000013',
  '00000000-0000-4000-a000-000000000016',
  'Q13. What is encryption?',
  'status code',
  'encryption',
  'certificate',
  'URL',
  'B',
  'encryption is a key concept in HTTP & HTTPS.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000016000014',
  '00000000-0000-4000-a000-000000000016',
  'Q14. Which option is most directly associated with certificate?',
  'port 80',
  'certificate',
  'port 443',
  'redirect',
  'B',
  'certificate is a key concept in HTTP & HTTPS.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000016000015',
  '00000000-0000-4000-a000-000000000016',
  'Q15. Which statement best describes port 80?',
  'response',
  'port 443',
  'URL',
  'port 80',
  'D',
  'port 80 is a key concept in HTTP & HTTPS.'
) ON CONFLICT (id) DO NOTHING;

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
DNS translates domain names such as example.com into IP addresses and other records. It allows people to use memorable names instead of remembering numerical network addresses.

### Key Points
- **DNS**
- **domain name**
- **IP address**
- **resolver**
- **record**
- **A record**',
  TRUE
) ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title;

INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000017000001',
  '00000000-0000-4000-a000-000000000017',
  'Q1. What is DNS?',
  'hostname',
  'AAAA record',
  'DNS',
  'port 53',
  'C',
  'DNS is a key concept in DNS Explained.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000017000002',
  '00000000-0000-4000-a000-000000000017',
  'Q2. Which option is most directly associated with domain name?',
  'domain name',
  'hostname',
  'resolution',
  'resolver',
  'A',
  'domain name is a key concept in DNS Explained.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000017000003',
  '00000000-0000-4000-a000-000000000017',
  'Q3. Which statement best describes IP address?',
  'IP address',
  'AAAA record',
  'hostname',
  'UDP',
  'A',
  'IP address is a key concept in DNS Explained.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000017000004',
  '00000000-0000-4000-a000-000000000017',
  'Q4. In this topic, what does resolver refer to?',
  'domain name',
  'IP address',
  'CNAME',
  'resolver',
  'D',
  'resolver is a key concept in DNS Explained.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000017000005',
  '00000000-0000-4000-a000-000000000017',
  'Q5. What is record?',
  'record',
  'UDP',
  'recursive query',
  'AAAA record',
  'A',
  'record is a key concept in DNS Explained.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000017000006',
  '00000000-0000-4000-a000-000000000017',
  'Q6. Which option is most directly associated with A record?',
  'IP address',
  'recursive query',
  'record',
  'A record',
  'D',
  'A record is a key concept in DNS Explained.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000017000007',
  '00000000-0000-4000-a000-000000000017',
  'Q7. Which statement best describes AAAA record?',
  'authoritative server',
  'AAAA record',
  'cache',
  'resolution',
  'B',
  'AAAA record is a key concept in DNS Explained.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000017000008',
  '00000000-0000-4000-a000-000000000017',
  'Q8. In this topic, what does CNAME refer to?',
  'hostname',
  'DNS',
  'CNAME',
  'IP address',
  'C',
  'CNAME is a key concept in DNS Explained.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000017000009',
  '00000000-0000-4000-a000-000000000017',
  'Q9. What is MX?',
  'MX',
  'DNSSEC',
  'IP address',
  'domain',
  'A',
  'MX is a key concept in DNS Explained.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000017000010',
  '00000000-0000-4000-a000-000000000017',
  'Q10. Which option is most directly associated with nameserver?',
  'nameserver',
  'resolver',
  'record',
  'DNSSEC',
  'A',
  'nameserver is a key concept in DNS Explained.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000017000011',
  '00000000-0000-4000-a000-000000000017',
  'Q11. Which statement best describes cache?',
  'domain name',
  'DNS',
  'port 53',
  'cache',
  'D',
  'cache is a key concept in DNS Explained.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000017000012',
  '00000000-0000-4000-a000-000000000017',
  'Q12. In this topic, what does TTL refer to?',
  'MX',
  'TTL',
  'UDP',
  'DNS',
  'B',
  'TTL is a key concept in DNS Explained.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000017000013',
  '00000000-0000-4000-a000-000000000017',
  'Q13. What is recursive query?',
  'resolution',
  'nameserver',
  'recursive query',
  'A record',
  'C',
  'recursive query is a key concept in DNS Explained.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000017000014',
  '00000000-0000-4000-a000-000000000017',
  'Q14. Which option is most directly associated with authoritative server?',
  'TTL',
  'A record',
  'domain name',
  'authoritative server',
  'D',
  'authoritative server is a key concept in DNS Explained.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000017000015',
  '00000000-0000-4000-a000-000000000017',
  'Q15. Which statement best describes DNSSEC?',
  'CNAME',
  'DNSSEC',
  'nameserver',
  'AAAA record',
  'B',
  'DNSSEC is a key concept in DNS Explained.'
) ON CONFLICT (id) DO NOTHING;

-- Quick Learn 18: IP Addresses
INSERT INTO public.quick_learn_lessons (id, title, slug, branch, category, difficulty, estimated_minutes, is_recommended, fx_reward, short_description, content_markdown, is_published)
VALUES (
  '00000000-0000-4000-a000-000000000018',
  'IP Addresses',
  'ip-addresses',
  'CSE',
  'Web Dev',
  'Intermediate',
  3,
  TRUE,
  10,
  'Master IP Addresses fundamentals with quick reading and 15 practice MCQs on FEEDX.',
  '### Learning Text
An IP address identifies a network interface using an address format defined by IP. IPv4 commonly uses 32-bit addresses, while IPv6 uses 128-bit addresses.

### Key Points
- **IP address**
- **IPv4**
- **IPv6**
- **32-bit**
- **128-bit**
- **private address**',
  TRUE
) ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title;

INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000018000001',
  '00000000-0000-4000-a000-000000000018',
  'Q1. What is IP address?',
  'subnet',
  'router',
  'IPv6',
  'IP address',
  'D',
  'IP address is a key concept in IP Addresses.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000018000002',
  '00000000-0000-4000-a000-000000000018',
  'Q2. Which option is most directly associated with IPv4?',
  'public address',
  'DHCP',
  'broadcast',
  'IPv4',
  'D',
  'IPv4 is a key concept in IP Addresses.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000018000003',
  '00000000-0000-4000-a000-000000000018',
  'Q3. Which statement best describes IPv6?',
  'IPv6',
  'broadcast',
  'router',
  'CIDR',
  'A',
  'IPv6 is a key concept in IP Addresses.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000018000004',
  '00000000-0000-4000-a000-000000000018',
  'Q4. In this topic, what does 32-bit refer to?',
  'IPv4',
  'DHCP',
  '32-bit',
  'NAT',
  'C',
  '32-bit is a key concept in IP Addresses.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000018000005',
  '00000000-0000-4000-a000-000000000018',
  'Q5. What is 128-bit?',
  '128-bit',
  'gateway',
  'loopback',
  'IPv4',
  'A',
  '128-bit is a key concept in IP Addresses.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000018000006',
  '00000000-0000-4000-a000-000000000018',
  'Q6. Which option is most directly associated with private address?',
  '32-bit',
  '128-bit',
  'private address',
  'CIDR',
  'C',
  'private address is a key concept in IP Addresses.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000018000007',
  '00000000-0000-4000-a000-000000000018',
  'Q7. Which statement best describes public address?',
  'network',
  'public address',
  'private address',
  'IPv6',
  'B',
  'public address is a key concept in IP Addresses.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000018000008',
  '00000000-0000-4000-a000-000000000018',
  'Q8. In this topic, what does subnet refer to?',
  'IPv4',
  'subnet',
  'router',
  '32-bit',
  'B',
  'subnet is a key concept in IP Addresses.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000018000009',
  '00000000-0000-4000-a000-000000000018',
  'Q9. What is router?',
  '128-bit',
  'NAT',
  'private address',
  'router',
  'D',
  'router is a key concept in IP Addresses.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000018000010',
  '00000000-0000-4000-a000-000000000018',
  'Q10. Which option is most directly associated with host?',
  'network',
  'host',
  'IPv6',
  'static address',
  'B',
  'host is a key concept in IP Addresses.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000018000011',
  '00000000-0000-4000-a000-000000000018',
  'Q11. Which statement best describes network?',
  'network',
  'addressing',
  'static address',
  'loopback',
  'A',
  'network is a key concept in IP Addresses.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000018000012',
  '00000000-0000-4000-a000-000000000018',
  'Q12. In this topic, what does loopback refer to?',
  '128-bit',
  'CIDR',
  'loopback',
  'gateway',
  'C',
  'loopback is a key concept in IP Addresses.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000018000013',
  '00000000-0000-4000-a000-000000000018',
  'Q13. What is NAT?',
  'router',
  'IPv4',
  'CIDR',
  'NAT',
  'D',
  'NAT is a key concept in IP Addresses.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000018000014',
  '00000000-0000-4000-a000-000000000018',
  'Q14. Which option is most directly associated with DHCP?',
  'static address',
  'router',
  'DHCP',
  'loopback',
  'C',
  'DHCP is a key concept in IP Addresses.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000018000015',
  '00000000-0000-4000-a000-000000000018',
  'Q15. Which statement best describes static address?',
  'gateway',
  'loopback',
  'IPv6',
  'static address',
  'D',
  'static address is a key concept in IP Addresses.'
) ON CONFLICT (id) DO NOTHING;

-- Quick Learn 19: TCP vs UDP
INSERT INTO public.quick_learn_lessons (id, title, slug, branch, category, difficulty, estimated_minutes, is_recommended, fx_reward, short_description, content_markdown, is_published)
VALUES (
  '00000000-0000-4000-a000-000000000019',
  'TCP vs UDP',
  'tcp-vs-udp',
  'CSE',
  'Mobile Dev',
  'Intermediate',
  3,
  TRUE,
  10,
  'Master TCP vs UDP fundamentals with quick reading and 15 practice MCQs on FEEDX.',
  '### Learning Text
TCP provides reliable, ordered delivery using connections and acknowledgements. UDP is connectionless and does not provide the same built-in delivery guarantees, making it useful where low overhead is important.

### Key Points
- **TCP**
- **UDP**
- **connection**
- **reliability**
- **ordering**
- **acknowledgement**',
  TRUE
) ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title;

INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000019000001',
  '00000000-0000-4000-a000-000000000019',
  'Q1. What is TCP?',
  'TCP',
  'UDP',
  'reliability',
  'packet',
  'A',
  'TCP is a key concept in TCP vs UDP.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000019000002',
  '00000000-0000-4000-a000-000000000019',
  'Q2. Which option is most directly associated with UDP?',
  'handshake',
  'congestion control',
  'real-time traffic',
  'UDP',
  'D',
  'UDP is a key concept in TCP vs UDP.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000019000003',
  '00000000-0000-4000-a000-000000000019',
  'Q3. Which statement best describes connection?',
  'TCP',
  'web',
  'connection',
  'ordering',
  'C',
  'connection is a key concept in TCP vs UDP.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000019000004',
  '00000000-0000-4000-a000-000000000019',
  'Q4. In this topic, what does reliability refer to?',
  'connection',
  'handshake',
  'low overhead',
  'reliability',
  'D',
  'reliability is a key concept in TCP vs UDP.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000019000005',
  '00000000-0000-4000-a000-000000000019',
  'Q5. What is ordering?',
  'handshake',
  'retransmission',
  'ordering',
  'packet',
  'C',
  'ordering is a key concept in TCP vs UDP.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000019000006',
  '00000000-0000-4000-a000-000000000019',
  'Q6. Which option is most directly associated with acknowledgement?',
  'flow control',
  'web',
  'video',
  'acknowledgement',
  'D',
  'acknowledgement is a key concept in TCP vs UDP.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000019000007',
  '00000000-0000-4000-a000-000000000019',
  'Q7. Which statement best describes retransmission?',
  'low overhead',
  'datagram',
  'packet',
  'retransmission',
  'D',
  'retransmission is a key concept in TCP vs UDP.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000019000008',
  '00000000-0000-4000-a000-000000000019',
  'Q8. In this topic, what does flow control refer to?',
  'packet',
  'stream',
  'connection',
  'flow control',
  'D',
  'flow control is a key concept in TCP vs UDP.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000019000009',
  '00000000-0000-4000-a000-000000000019',
  'Q9. What is congestion control?',
  'flow control',
  'ordering',
  'congestion control',
  'retransmission',
  'C',
  'congestion control is a key concept in TCP vs UDP.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000019000010',
  '00000000-0000-4000-a000-000000000019',
  'Q10. Which option is most directly associated with datagram?',
  'acknowledgement',
  'port',
  'congestion control',
  'datagram',
  'D',
  'datagram is a key concept in TCP vs UDP.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000019000011',
  '00000000-0000-4000-a000-000000000019',
  'Q11. Which statement best describes low overhead?',
  'low overhead',
  'socket',
  'congestion control',
  'real-time traffic',
  'A',
  'low overhead is a key concept in TCP vs UDP.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000019000012',
  '00000000-0000-4000-a000-000000000019',
  'Q12. In this topic, what does port refer to?',
  'web',
  'port',
  'acknowledgement',
  'DNS',
  'B',
  'port is a key concept in TCP vs UDP.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000019000013',
  '00000000-0000-4000-a000-000000000019',
  'Q13. What is socket?',
  'ordering',
  'port',
  'socket',
  'retransmission',
  'C',
  'socket is a key concept in TCP vs UDP.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000019000014',
  '00000000-0000-4000-a000-000000000019',
  'Q14. Which option is most directly associated with stream?',
  'acknowledgement',
  'stream',
  'real-time traffic',
  'TCP',
  'B',
  'stream is a key concept in TCP vs UDP.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000019000015',
  '00000000-0000-4000-a000-000000000019',
  'Q15. Which statement best describes packet?',
  'packet',
  'congestion control',
  'DNS',
  'ordering',
  'A',
  'packet is a key concept in TCP vs UDP.'
) ON CONFLICT (id) DO NOTHING;

-- Quick Learn 20: Frontend vs Backend
INSERT INTO public.quick_learn_lessons (id, title, slug, branch, category, difficulty, estimated_minutes, is_recommended, fx_reward, short_description, content_markdown, is_published)
VALUES (
  '00000000-0000-4000-a000-000000000020',
  'Frontend vs Backend',
  'frontend-vs-backend',
  'CSE',
  'Backend',
  'Intermediate',
  3,
  TRUE,
  10,
  'Master Frontend vs Backend fundamentals with quick reading and 15 practice MCQs on FEEDX.',
  '### Learning Text
Frontend code runs in the user''s interface and handles presentation and interaction. Backend systems handle server-side logic, data access, authentication and other services.

### Key Points
- **frontend**
- **backend**
- **client**
- **server**
- **UI**
- **API**',
  TRUE
) ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title;

INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000020000001',
  '00000000-0000-4000-a000-000000000020',
  'Q1. What is frontend?',
  'API',
  'HTML',
  'CSS',
  'frontend',
  'D',
  'frontend is a key concept in Frontend vs Backend.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000020000002',
  '00000000-0000-4000-a000-000000000020',
  'Q2. Which option is most directly associated with backend?',
  'HTML',
  'response',
  'backend',
  'request',
  'C',
  'backend is a key concept in Frontend vs Backend.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000020000003',
  '00000000-0000-4000-a000-000000000020',
  'Q3. Which statement best describes client?',
  'request',
  'client',
  'response',
  'business logic',
  'B',
  'client is a key concept in Frontend vs Backend.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000020000004',
  '00000000-0000-4000-a000-000000000020',
  'Q4. In this topic, what does server refer to?',
  'database',
  'frontend',
  'authentication',
  'server',
  'D',
  'server is a key concept in Frontend vs Backend.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000020000005',
  '00000000-0000-4000-a000-000000000020',
  'Q5. What is UI?',
  'request',
  'API',
  'frontend',
  'UI',
  'D',
  'UI is a key concept in Frontend vs Backend.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000020000006',
  '00000000-0000-4000-a000-000000000020',
  'Q6. Which option is most directly associated with API?',
  'validation',
  'HTML',
  'API',
  'deployment',
  'C',
  'API is a key concept in Frontend vs Backend.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000020000007',
  '00000000-0000-4000-a000-000000000020',
  'Q7. Which statement best describes database?',
  'database',
  'frontend',
  'request',
  'validation',
  'A',
  'database is a key concept in Frontend vs Backend.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000020000008',
  '00000000-0000-4000-a000-000000000020',
  'Q8. In this topic, what does authentication refer to?',
  'response',
  'JavaScript',
  'API',
  'authentication',
  'D',
  'authentication is a key concept in Frontend vs Backend.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000020000009',
  '00000000-0000-4000-a000-000000000020',
  'Q9. What is business logic?',
  'client',
  'business logic',
  'authentication',
  'backend',
  'B',
  'business logic is a key concept in Frontend vs Backend.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000020000010',
  '00000000-0000-4000-a000-000000000020',
  'Q10. Which option is most directly associated with browser?',
  'response',
  'browser',
  'mobile app',
  'authentication',
  'B',
  'browser is a key concept in Frontend vs Backend.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000020000011',
  '00000000-0000-4000-a000-000000000020',
  'Q11. Which statement best describes mobile app?',
  'authentication',
  'request',
  'response',
  'mobile app',
  'D',
  'mobile app is a key concept in Frontend vs Backend.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000020000012',
  '00000000-0000-4000-a000-000000000020',
  'Q12. In this topic, what does request refer to?',
  'deployment',
  'JavaScript',
  'browser',
  'request',
  'D',
  'request is a key concept in Frontend vs Backend.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000020000013',
  '00000000-0000-4000-a000-000000000020',
  'Q13. What is response?',
  'JavaScript',
  'authentication',
  'response',
  'API',
  'C',
  'response is a key concept in Frontend vs Backend.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000020000014',
  '00000000-0000-4000-a000-000000000020',
  'Q14. Which option is most directly associated with HTML?',
  'frontend',
  'deployment',
  'HTML',
  'database',
  'C',
  'HTML is a key concept in Frontend vs Backend.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000020000015',
  '00000000-0000-4000-a000-000000000020',
  'Q15. Which statement best describes CSS?',
  'CSS',
  'frontend',
  'request',
  'client',
  'A',
  'CSS is a key concept in Frontend vs Backend.'
) ON CONFLICT (id) DO NOTHING;

-- Quick Learn 21: REST APIs
INSERT INTO public.quick_learn_lessons (id, title, slug, branch, category, difficulty, estimated_minutes, is_recommended, fx_reward, short_description, content_markdown, is_published)
VALUES (
  '00000000-0000-4000-a000-000000000021',
  'REST APIs',
  'rest-apis',
  'CSE',
  'Backend',
  'Intermediate',
  3,
  TRUE,
  10,
  'Master REST APIs fundamentals with quick reading and 15 practice MCQs on FEEDX.',
  '### Learning Text
REST is an architectural style commonly used for web APIs. RESTful APIs often use HTTP methods such as GET, POST, PUT/PATCH and DELETE and represent resources through URLs.

### Key Points
- **REST**
- **resource**
- **URL**
- **GET**
- **POST**
- **PUT**',
  TRUE
) ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title;

INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000021000001',
  '00000000-0000-4000-a000-000000000021',
  'Q1. What is REST?',
  'stateless',
  'JSON',
  'resource',
  'REST',
  'D',
  'REST is a key concept in REST APIs.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000021000002',
  '00000000-0000-4000-a000-000000000021',
  'Q2. Which option is most directly associated with resource?',
  'header',
  'resource',
  'URL',
  'HTTP',
  'B',
  'resource is a key concept in REST APIs.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000021000003',
  '00000000-0000-4000-a000-000000000021',
  'Q3. Which statement best describes URL?',
  'REST',
  'server',
  'URL',
  'GET',
  'C',
  'URL is a key concept in REST APIs.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000021000004',
  '00000000-0000-4000-a000-000000000021',
  'Q4. In this topic, what does GET refer to?',
  'stateless',
  'GET',
  'server',
  'resource',
  'B',
  'GET is a key concept in REST APIs.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000021000005',
  '00000000-0000-4000-a000-000000000021',
  'Q5. What is POST?',
  'POST',
  'REST',
  'GET',
  'DELETE',
  'A',
  'POST is a key concept in REST APIs.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000021000006',
  '00000000-0000-4000-a000-000000000021',
  'Q6. Which option is most directly associated with PUT?',
  'PUT',
  'idempotent',
  'endpoint',
  'resource',
  'A',
  'PUT is a key concept in REST APIs.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000021000007',
  '00000000-0000-4000-a000-000000000021',
  'Q7. Which statement best describes PATCH?',
  'server',
  'HTTP',
  'PATCH',
  'PUT',
  'C',
  'PATCH is a key concept in REST APIs.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000021000008',
  '00000000-0000-4000-a000-000000000021',
  'Q8. In this topic, what does DELETE refer to?',
  'query parameter',
  'CRUD',
  'DELETE',
  'status code',
  'C',
  'DELETE is a key concept in REST APIs.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000021000009',
  '00000000-0000-4000-a000-000000000021',
  'Q9. What is HTTP?',
  'status code',
  'idempotent',
  'client',
  'HTTP',
  'D',
  'HTTP is a key concept in REST APIs.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000021000010',
  '00000000-0000-4000-a000-000000000021',
  'Q10. Which option is most directly associated with stateless?',
  'HTTP',
  'stateless',
  'REST',
  'CRUD',
  'B',
  'stateless is a key concept in REST APIs.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000021000011',
  '00000000-0000-4000-a000-000000000021',
  'Q11. Which statement best describes JSON?',
  'JSON',
  'server',
  'REST',
  'URL',
  'A',
  'JSON is a key concept in REST APIs.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000021000012',
  '00000000-0000-4000-a000-000000000021',
  'Q12. In this topic, what does status code refer to?',
  'header',
  'DELETE',
  'status code',
  'PUT',
  'C',
  'status code is a key concept in REST APIs.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000021000013',
  '00000000-0000-4000-a000-000000000021',
  'Q13. What is endpoint?',
  'JSON',
  'API',
  'PATCH',
  'endpoint',
  'D',
  'endpoint is a key concept in REST APIs.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000021000014',
  '00000000-0000-4000-a000-000000000021',
  'Q14. Which option is most directly associated with client?',
  'server',
  'client',
  'JSON',
  'CRUD',
  'B',
  'client is a key concept in REST APIs.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000021000015',
  '00000000-0000-4000-a000-000000000021',
  'Q15. Which statement best describes server?',
  'CRUD',
  'server',
  'API',
  'HTTP',
  'B',
  'server is a key concept in REST APIs.'
) ON CONFLICT (id) DO NOTHING;

-- Quick Learn 22: JSON & XML
INSERT INTO public.quick_learn_lessons (id, title, slug, branch, category, difficulty, estimated_minutes, is_recommended, fx_reward, short_description, content_markdown, is_published)
VALUES (
  '00000000-0000-4000-a000-000000000022',
  'JSON & XML',
  'json-xml',
  'CSE',
  'DevOps',
  'Intermediate',
  3,
  TRUE,
  10,
  'Master JSON & XML fundamentals with quick reading and 15 practice MCQs on FEEDX.',
  '### Learning Text
JSON and XML are data formats used to represent and exchange structured information. JSON is lightweight and commonly used in modern web APIs, while XML uses tags and supports extensive document-oriented structures.

### Key Points
- **JSON**
- **XML**
- **object**
- **array**
- **key**
- **value**',
  TRUE
) ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title;

INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000022000001',
  '00000000-0000-4000-a000-000000000022',
  'Q1. What is JSON?',
  'XML',
  'JSON',
  'nested data',
  'API',
  'B',
  'JSON is a key concept in JSON & XML.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000022000002',
  '00000000-0000-4000-a000-000000000022',
  'Q2. Which option is most directly associated with XML?',
  'nested data',
  'JSON',
  'XML',
  'schema',
  'C',
  'XML is a key concept in JSON & XML.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000022000003',
  '00000000-0000-4000-a000-000000000022',
  'Q3. Which statement best describes object?',
  'API',
  'XML',
  'object',
  'string',
  'C',
  'object is a key concept in JSON & XML.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000022000004',
  '00000000-0000-4000-a000-000000000022',
  'Q4. In this topic, what does array refer to?',
  'array',
  'serialization',
  'namespace',
  'number',
  'A',
  'array is a key concept in JSON & XML.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000022000005',
  '00000000-0000-4000-a000-000000000022',
  'Q5. What is key?',
  'API',
  'XML',
  'key',
  'array',
  'C',
  'key is a key concept in JSON & XML.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000022000006',
  '00000000-0000-4000-a000-000000000022',
  'Q6. Which option is most directly associated with value?',
  'value',
  'boolean',
  'nested data',
  'object',
  'A',
  'value is a key concept in JSON & XML.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000022000007',
  '00000000-0000-4000-a000-000000000022',
  'Q7. Which statement best describes tag?',
  'tag',
  'namespace',
  'JSON',
  'key',
  'A',
  'tag is a key concept in JSON & XML.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000022000008',
  '00000000-0000-4000-a000-000000000022',
  'Q8. In this topic, what does attribute refer to?',
  'string',
  'attribute',
  'number',
  'JSON',
  'B',
  'attribute is a key concept in JSON & XML.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000022000009',
  '00000000-0000-4000-a000-000000000022',
  'Q9. What is document?',
  'serialization',
  'document',
  'data exchange',
  'key',
  'B',
  'document is a key concept in JSON & XML.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000022000010',
  '00000000-0000-4000-a000-000000000022',
  'Q10. Which option is most directly associated with parser?',
  'namespace',
  'nested data',
  'array',
  'parser',
  'D',
  'parser is a key concept in JSON & XML.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000022000011',
  '00000000-0000-4000-a000-000000000022',
  'Q11. Which statement best describes serialization?',
  'validation',
  'value',
  'schema',
  'serialization',
  'D',
  'serialization is a key concept in JSON & XML.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000022000012',
  '00000000-0000-4000-a000-000000000022',
  'Q12. In this topic, what does data exchange refer to?',
  'XML',
  'serialization',
  'data exchange',
  'value',
  'C',
  'data exchange is a key concept in JSON & XML.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000022000013',
  '00000000-0000-4000-a000-000000000022',
  'Q13. What is API?',
  'schema',
  'API',
  'namespace',
  'attribute',
  'B',
  'API is a key concept in JSON & XML.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000022000014',
  '00000000-0000-4000-a000-000000000022',
  'Q14. Which option is most directly associated with schema?',
  'validation',
  'schema',
  'namespace',
  'object',
  'B',
  'schema is a key concept in JSON & XML.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000022000015',
  '00000000-0000-4000-a000-000000000022',
  'Q15. Which statement best describes nested data?',
  'array',
  'string',
  'XML',
  'nested data',
  'D',
  'nested data is a key concept in JSON & XML.'
) ON CONFLICT (id) DO NOTHING;

-- Quick Learn 23: Authentication & Authorization
INSERT INTO public.quick_learn_lessons (id, title, slug, branch, category, difficulty, estimated_minutes, is_recommended, fx_reward, short_description, content_markdown, is_published)
VALUES (
  '00000000-0000-4000-a000-000000000023',
  'Authentication & Authorization',
  'authentication-authorization',
  'CSE',
  'DevOps',
  'Advanced',
  3,
  TRUE,
  10,
  'Master Authentication & Authorization fundamentals with quick reading and 15 practice MCQs on FEEDX.',
  '### Learning Text
Authentication answers who a user is. Authorization determines what that authenticated user is allowed to access or do.

### Key Points
- **authentication**
- **authorization**
- **identity**
- **permission**
- **role**
- **session**',
  TRUE
) ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title;

INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000023000001',
  '00000000-0000-4000-a000-000000000023',
  'Q1. What is authentication?',
  'password',
  'identity',
  'authentication',
  'permission',
  'C',
  'authentication is a key concept in Authentication & Authorization.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000023000002',
  '00000000-0000-4000-a000-000000000023',
  'Q2. Which option is most directly associated with authorization?',
  'credential',
  'login',
  'password',
  'authorization',
  'D',
  'authorization is a key concept in Authentication & Authorization.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000023000003',
  '00000000-0000-4000-a000-000000000023',
  'Q3. Which statement best describes identity?',
  'password',
  'session',
  'logout',
  'identity',
  'D',
  'identity is a key concept in Authentication & Authorization.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000023000004',
  '00000000-0000-4000-a000-000000000023',
  'Q4. In this topic, what does permission refer to?',
  'role',
  'permission',
  'RBAC',
  'session',
  'B',
  'permission is a key concept in Authentication & Authorization.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000023000005',
  '00000000-0000-4000-a000-000000000023',
  'Q5. What is role?',
  'credential',
  'security',
  'refresh token',
  'role',
  'D',
  'role is a key concept in Authentication & Authorization.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000023000006',
  '00000000-0000-4000-a000-000000000023',
  'Q6. Which option is most directly associated with session?',
  'authorization',
  'credential',
  'session',
  'token',
  'C',
  'session is a key concept in Authentication & Authorization.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000023000007',
  '00000000-0000-4000-a000-000000000023',
  'Q7. Which statement best describes token?',
  'RBAC',
  'least privilege',
  'token',
  'authentication',
  'C',
  'token is a key concept in Authentication & Authorization.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000023000008',
  '00000000-0000-4000-a000-000000000023',
  'Q8. In this topic, what does password refer to?',
  'refresh token',
  'password',
  'token',
  'authorization',
  'B',
  'password is a key concept in Authentication & Authorization.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000023000009',
  '00000000-0000-4000-a000-000000000023',
  'Q9. What is MFA?',
  'logout',
  'login',
  'MFA',
  'permission',
  'C',
  'MFA is a key concept in Authentication & Authorization.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000023000010',
  '00000000-0000-4000-a000-000000000023',
  'Q10. Which option is most directly associated with OAuth?',
  'logout',
  'password',
  'OAuth',
  'login',
  'C',
  'OAuth is a key concept in Authentication & Authorization.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000023000011',
  '00000000-0000-4000-a000-000000000023',
  'Q11. Which statement best describes access control?',
  'refresh token',
  'authorization',
  'role',
  'access control',
  'D',
  'access control is a key concept in Authentication & Authorization.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000023000012',
  '00000000-0000-4000-a000-000000000023',
  'Q12. In this topic, what does least privilege refer to?',
  'MFA',
  'security',
  'permission',
  'least privilege',
  'D',
  'least privilege is a key concept in Authentication & Authorization.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000023000013',
  '00000000-0000-4000-a000-000000000023',
  'Q13. What is login?',
  'identity provider',
  'logout',
  'login',
  'token',
  'C',
  'login is a key concept in Authentication & Authorization.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000023000014',
  '00000000-0000-4000-a000-000000000023',
  'Q14. Which option is most directly associated with credential?',
  'logout',
  'access control',
  'credential',
  'security',
  'C',
  'credential is a key concept in Authentication & Authorization.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000023000015',
  '00000000-0000-4000-a000-000000000023',
  'Q15. Which statement best describes RBAC?',
  'RBAC',
  'access control',
  'MFA',
  'identity provider',
  'A',
  'RBAC is a key concept in Authentication & Authorization.'
) ON CONFLICT (id) DO NOTHING;

-- Quick Learn 24: Encryption & Hashing
INSERT INTO public.quick_learn_lessons (id, title, slug, branch, category, difficulty, estimated_minutes, is_recommended, fx_reward, short_description, content_markdown, is_published)
VALUES (
  '00000000-0000-4000-a000-000000000024',
  'Encryption & Hashing',
  'encryption-hashing',
  'CSE',
  'DSA',
  'Beginner',
  3,
  TRUE,
  10,
  'Master Encryption & Hashing fundamentals with quick reading and 15 practice MCQs on FEEDX.',
  '### Learning Text
Encryption transforms data so it can be recovered with the appropriate key. Hashing produces a fixed-size digest and is designed to be one-way in normal use; password systems should use dedicated password-hashing algorithms.

### Key Points
- **encryption**
- **decryption**
- **key**
- **plaintext**
- **ciphertext**
- **hash**',
  TRUE
) ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title;

INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000024000001',
  '00000000-0000-4000-a000-000000000024',
  'Q1. What is encryption?',
  'cryptography',
  'asymmetric',
  'digital signature',
  'encryption',
  'D',
  'encryption is a key concept in Encryption & Hashing.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000024000002',
  '00000000-0000-4000-a000-000000000024',
  'Q2. Which option is most directly associated with decryption?',
  'key',
  'decryption',
  'private key',
  'encryption',
  'B',
  'decryption is a key concept in Encryption & Hashing.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000024000003',
  '00000000-0000-4000-a000-000000000024',
  'Q3. Which statement best describes key?',
  'encryption',
  'key',
  'plaintext',
  'ciphertext',
  'B',
  'key is a key concept in Encryption & Hashing.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000024000004',
  '00000000-0000-4000-a000-000000000024',
  'Q4. In this topic, what does plaintext refer to?',
  'TLS',
  'plaintext',
  'password hashing',
  'key',
  'B',
  'plaintext is a key concept in Encryption & Hashing.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000024000005',
  '00000000-0000-4000-a000-000000000024',
  'Q5. What is ciphertext?',
  'encryption',
  'plaintext',
  'ciphertext',
  'digest',
  'C',
  'ciphertext is a key concept in Encryption & Hashing.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000024000006',
  '00000000-0000-4000-a000-000000000024',
  'Q6. Which option is most directly associated with hash?',
  'plaintext',
  'hash',
  'encryption',
  'RSA',
  'B',
  'hash is a key concept in Encryption & Hashing.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000024000007',
  '00000000-0000-4000-a000-000000000024',
  'Q7. Which statement best describes digest?',
  'key',
  'digest',
  'confidentiality',
  'AES',
  'B',
  'digest is a key concept in Encryption & Hashing.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000024000008',
  '00000000-0000-4000-a000-000000000024',
  'Q8. In this topic, what does salt refer to?',
  'salt',
  'symmetric',
  'plaintext',
  'cryptography',
  'A',
  'salt is a key concept in Encryption & Hashing.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000024000009',
  '00000000-0000-4000-a000-000000000024',
  'Q9. What is symmetric?',
  'TLS',
  'symmetric',
  'confidentiality',
  'digest',
  'B',
  'symmetric is a key concept in Encryption & Hashing.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000024000010',
  '00000000-0000-4000-a000-000000000024',
  'Q10. Which option is most directly associated with asymmetric?',
  'key',
  'asymmetric',
  'digest',
  'private key',
  'B',
  'asymmetric is a key concept in Encryption & Hashing.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000024000011',
  '00000000-0000-4000-a000-000000000024',
  'Q11. Which statement best describes AES?',
  'cryptography',
  'confidentiality',
  'AES',
  'public key',
  'C',
  'AES is a key concept in Encryption & Hashing.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000024000012',
  '00000000-0000-4000-a000-000000000024',
  'Q12. In this topic, what does RSA refer to?',
  'digest',
  'decryption',
  'RSA',
  'hash',
  'C',
  'RSA is a key concept in Encryption & Hashing.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000024000013',
  '00000000-0000-4000-a000-000000000024',
  'Q13. What is TLS?',
  'TLS',
  'password hashing',
  'symmetric',
  'integrity',
  'A',
  'TLS is a key concept in Encryption & Hashing.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000024000014',
  '00000000-0000-4000-a000-000000000024',
  'Q14. Which option is most directly associated with password hashing?',
  'integrity',
  'plaintext',
  'password hashing',
  'key',
  'C',
  'password hashing is a key concept in Encryption & Hashing.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000024000015',
  '00000000-0000-4000-a000-000000000024',
  'Q15. Which statement best describes integrity?',
  'hash',
  'integrity',
  'decryption',
  'salt',
  'B',
  'integrity is a key concept in Encryption & Hashing.'
) ON CONFLICT (id) DO NOTHING;

-- Quick Learn 25: Password Security
INSERT INTO public.quick_learn_lessons (id, title, slug, branch, category, difficulty, estimated_minutes, is_recommended, fx_reward, short_description, content_markdown, is_published)
VALUES (
  '00000000-0000-4000-a000-000000000025',
  'Password Security',
  'password-security',
  'CSE',
  'DSA',
  'Intermediate',
  3,
  TRUE,
  10,
  'Master Password Security fundamentals with quick reading and 15 practice MCQs on FEEDX.',
  '### Learning Text
Strong password security includes long unique passwords, password managers, multi-factor authentication and protection against reuse. Services should store passwords using secure password-hashing methods rather than plaintext.

### Key Points
- **password**
- **passphrase**
- **unique**
- **length**
- **password manager**
- **MFA**',
  TRUE
) ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title;

INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000025000001',
  '00000000-0000-4000-a000-000000000025',
  'Q1. What is password?',
  'length',
  'password',
  'password manager',
  'authentication',
  'B',
  'password is a key concept in Password Security.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000025000002',
  '00000000-0000-4000-a000-000000000025',
  'Q2. Which option is most directly associated with passphrase?',
  'salt',
  'MFA',
  'passphrase',
  'phishing',
  'C',
  'passphrase is a key concept in Password Security.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000025000003',
  '00000000-0000-4000-a000-000000000025',
  'Q3. Which statement best describes unique?',
  'unique',
  'secret',
  'MFA',
  'authentication',
  'A',
  'unique is a key concept in Password Security.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000025000004',
  '00000000-0000-4000-a000-000000000025',
  'Q4. In this topic, what does length refer to?',
  'security',
  'credential stuffing',
  'length',
  'reuse',
  'C',
  'length is a key concept in Password Security.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000025000005',
  '00000000-0000-4000-a000-000000000025',
  'Q5. What is password manager?',
  'breach',
  'password manager',
  'device',
  'secret',
  'B',
  'password manager is a key concept in Password Security.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000025000006',
  '00000000-0000-4000-a000-000000000025',
  'Q6. Which option is most directly associated with MFA?',
  'password',
  'MFA',
  'unique',
  'length',
  'B',
  'MFA is a key concept in Password Security.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000025000007',
  '00000000-0000-4000-a000-000000000025',
  'Q7. Which statement best describes reuse?',
  'reuse',
  'salt',
  'reset',
  'authentication',
  'A',
  'reuse is a key concept in Password Security.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000025000008',
  '00000000-0000-4000-a000-000000000025',
  'Q8. In this topic, what does breach refer to?',
  'reset',
  'breach',
  'authentication',
  'salt',
  'B',
  'breach is a key concept in Password Security.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000025000009',
  '00000000-0000-4000-a000-000000000025',
  'Q9. What is hashing?',
  'hashing',
  'credential stuffing',
  'lockout',
  'reuse',
  'A',
  'hashing is a key concept in Password Security.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000025000010',
  '00000000-0000-4000-a000-000000000025',
  'Q10. Which option is most directly associated with salt?',
  'salt',
  'security',
  'rate limiting',
  'password manager',
  'A',
  'salt is a key concept in Password Security.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000025000011',
  '00000000-0000-4000-a000-000000000025',
  'Q11. Which statement best describes rate limiting?',
  'phishing',
  'reset',
  'secret',
  'rate limiting',
  'D',
  'rate limiting is a key concept in Password Security.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000025000012',
  '00000000-0000-4000-a000-000000000025',
  'Q12. In this topic, what does lockout refer to?',
  'salt',
  'MFA',
  'security',
  'lockout',
  'D',
  'lockout is a key concept in Password Security.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000025000013',
  '00000000-0000-4000-a000-000000000025',
  'Q13. What is credential stuffing?',
  'security',
  'MFA',
  'credential stuffing',
  'reset',
  'C',
  'credential stuffing is a key concept in Password Security.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000025000014',
  '00000000-0000-4000-a000-000000000025',
  'Q14. Which option is most directly associated with phishing?',
  'length',
  'authentication',
  'phishing',
  'recovery',
  'C',
  'phishing is a key concept in Password Security.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000025000015',
  '00000000-0000-4000-a000-000000000025',
  'Q15. Which statement best describes reset?',
  'reset',
  'unique',
  'passphrase',
  'MFA',
  'A',
  'reset is a key concept in Password Security.'
) ON CONFLICT (id) DO NOTHING;

-- Quick Learn 26: Phishing & Social Engineering
INSERT INTO public.quick_learn_lessons (id, title, slug, branch, category, difficulty, estimated_minutes, is_recommended, fx_reward, short_description, content_markdown, is_published)
VALUES (
  '00000000-0000-4000-a000-000000000026',
  'Phishing & Social Engineering',
  'phishing-social-engineering',
  'CSE',
  'DSA',
  'Intermediate',
  3,
  TRUE,
  10,
  'Master Phishing & Social Engineering fundamentals with quick reading and 15 practice MCQs on FEEDX.',
  '### Learning Text
Phishing is a form of social engineering that tries to trick people into revealing information or taking unsafe actions. Warning signs can include urgency, suspicious links, unexpected attachments and requests for secrets.

### Key Points
- **phishing**
- **social engineering**
- **spear phishing**
- **smishing**
- **vishing**
- **link**',
  TRUE
) ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title;

INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000026000001',
  '00000000-0000-4000-a000-000000000026',
  'Q1. What is phishing?',
  'credential',
  'sender',
  'phishing',
  'baiting',
  'C',
  'phishing is a key concept in Phishing & Social Engineering.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000026000002',
  '00000000-0000-4000-a000-000000000026',
  'Q2. Which option is most directly associated with social engineering?',
  'report',
  'sender',
  'credential',
  'social engineering',
  'D',
  'social engineering is a key concept in Phishing & Social Engineering.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000026000003',
  '00000000-0000-4000-a000-000000000026',
  'Q3. Which statement best describes spear phishing?',
  'urgency',
  'sender',
  'spear phishing',
  'awareness',
  'C',
  'spear phishing is a key concept in Phishing & Social Engineering.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000026000004',
  '00000000-0000-4000-a000-000000000026',
  'Q4. In this topic, what does smishing refer to?',
  'urgency',
  'social engineering',
  'malware',
  'smishing',
  'D',
  'smishing is a key concept in Phishing & Social Engineering.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000026000005',
  '00000000-0000-4000-a000-000000000026',
  'Q5. What is vishing?',
  'vishing',
  'awareness',
  'credential',
  'sender',
  'A',
  'vishing is a key concept in Phishing & Social Engineering.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000026000006',
  '00000000-0000-4000-a000-000000000026',
  'Q6. Which option is most directly associated with link?',
  'spoofing',
  'link',
  'social engineering',
  'report',
  'B',
  'link is a key concept in Phishing & Social Engineering.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000026000007',
  '00000000-0000-4000-a000-000000000026',
  'Q7. Which statement best describes attachment?',
  'attachment',
  'awareness',
  'domain',
  'link',
  'A',
  'attachment is a key concept in Phishing & Social Engineering.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000026000008',
  '00000000-0000-4000-a000-000000000026',
  'Q8. In this topic, what does urgency refer to?',
  'social engineering',
  'link',
  'verification',
  'urgency',
  'D',
  'urgency is a key concept in Phishing & Social Engineering.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000026000009',
  '00000000-0000-4000-a000-000000000026',
  'Q9. What is impersonation?',
  'pretexting',
  'impersonation',
  'malware',
  'smishing',
  'B',
  'impersonation is a key concept in Phishing & Social Engineering.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000026000010',
  '00000000-0000-4000-a000-000000000026',
  'Q10. Which option is most directly associated with credential?',
  'verification',
  'urgency',
  'spoofing',
  'credential',
  'D',
  'credential is a key concept in Phishing & Social Engineering.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000026000011',
  '00000000-0000-4000-a000-000000000026',
  'Q11. Which statement best describes MFA?',
  'MFA',
  'sender',
  'social engineering',
  'baiting',
  'A',
  'MFA is a key concept in Phishing & Social Engineering.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000026000012',
  '00000000-0000-4000-a000-000000000026',
  'Q12. In this topic, what does verification refer to?',
  'pretexting',
  'report',
  'malware',
  'verification',
  'D',
  'verification is a key concept in Phishing & Social Engineering.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000026000013',
  '00000000-0000-4000-a000-000000000026',
  'Q13. What is sender?',
  'sender',
  'report',
  'attachment',
  'social engineering',
  'A',
  'sender is a key concept in Phishing & Social Engineering.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000026000014',
  '00000000-0000-4000-a000-000000000026',
  'Q14. Which option is most directly associated with domain?',
  'awareness',
  'domain',
  'baiting',
  'credential',
  'B',
  'domain is a key concept in Phishing & Social Engineering.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000026000015',
  '00000000-0000-4000-a000-000000000026',
  'Q15. Which statement best describes spoofing?',
  'domain',
  'vishing',
  'MFA',
  'spoofing',
  'D',
  'spoofing is a key concept in Phishing & Social Engineering.'
) ON CONFLICT (id) DO NOTHING;

-- Quick Learn 27: Firewalls
INSERT INTO public.quick_learn_lessons (id, title, slug, branch, category, difficulty, estimated_minutes, is_recommended, fx_reward, short_description, content_markdown, is_published)
VALUES (
  '00000000-0000-4000-a000-000000000027',
  'Firewalls',
  'firewalls',
  'CSE',
  'Programming',
  'Intermediate',
  3,
  TRUE,
  10,
  'Master Firewalls fundamentals with quick reading and 15 practice MCQs on FEEDX.',
  '### Learning Text
A firewall controls network traffic according to configured rules. It can help restrict unwanted connections between networks or systems.

### Key Points
- **firewall**
- **traffic**
- **rule**
- **packet**
- **stateful**
- **stateless**',
  TRUE
) ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title;

INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000027000001',
  '00000000-0000-4000-a000-000000000027',
  'Q1. What is firewall?',
  'IP',
  'stateful',
  'DMZ',
  'firewall',
  'D',
  'firewall is a key concept in Firewalls.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000027000002',
  '00000000-0000-4000-a000-000000000027',
  'Q2. Which option is most directly associated with traffic?',
  'port',
  'network',
  'traffic',
  'security',
  'C',
  'traffic is a key concept in Firewalls.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000027000003',
  '00000000-0000-4000-a000-000000000027',
  'Q3. Which statement best describes rule?',
  'allow',
  'DMZ',
  'rule',
  'security',
  'C',
  'rule is a key concept in Firewalls.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000027000004',
  '00000000-0000-4000-a000-000000000027',
  'Q4. In this topic, what does packet refer to?',
  'packet',
  'security',
  'stateful',
  'host firewall',
  'A',
  'packet is a key concept in Firewalls.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000027000005',
  '00000000-0000-4000-a000-000000000027',
  'Q5. What is stateful?',
  'network',
  'stateful',
  'stateless',
  'DMZ',
  'B',
  'stateful is a key concept in Firewalls.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000027000006',
  '00000000-0000-4000-a000-000000000027',
  'Q6. Which option is most directly associated with stateless?',
  'stateless',
  'stateful',
  'host firewall',
  'ACL',
  'A',
  'stateless is a key concept in Firewalls.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000027000007',
  '00000000-0000-4000-a000-000000000027',
  'Q7. Which statement best describes inbound?',
  'ACL',
  'deny',
  'logging',
  'inbound',
  'D',
  'inbound is a key concept in Firewalls.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000027000008',
  '00000000-0000-4000-a000-000000000027',
  'Q8. In this topic, what does outbound refer to?',
  'deny',
  'outbound',
  'ACL',
  'proxy',
  'B',
  'outbound is a key concept in Firewalls.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000027000009',
  '00000000-0000-4000-a000-000000000027',
  'Q9. What is port?',
  'inbound',
  'network',
  'port',
  'rule',
  'C',
  'port is a key concept in Firewalls.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000027000010',
  '00000000-0000-4000-a000-000000000027',
  'Q10. Which option is most directly associated with IP?',
  'rule',
  'inbound',
  'IP',
  'logging',
  'C',
  'IP is a key concept in Firewalls.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000027000011',
  '00000000-0000-4000-a000-000000000027',
  'Q11. Which statement best describes allow?',
  'allow',
  'outbound',
  'traffic',
  'ACL',
  'A',
  'allow is a key concept in Firewalls.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000027000012',
  '00000000-0000-4000-a000-000000000027',
  'Q12. In this topic, what does deny refer to?',
  'deny',
  'traffic',
  'stateless',
  'network',
  'A',
  'deny is a key concept in Firewalls.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000027000013',
  '00000000-0000-4000-a000-000000000027',
  'Q13. What is network?',
  'firewall',
  'security',
  'network',
  'host firewall',
  'C',
  'network is a key concept in Firewalls.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000027000014',
  '00000000-0000-4000-a000-000000000027',
  'Q14. Which option is most directly associated with host firewall?',
  'stateless',
  'filter',
  'host firewall',
  'deny',
  'C',
  'host firewall is a key concept in Firewalls.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000027000015',
  '00000000-0000-4000-a000-000000000027',
  'Q15. Which statement best describes proxy?',
  'inbound',
  'proxy',
  'stateful',
  'network',
  'B',
  'proxy is a key concept in Firewalls.'
) ON CONFLICT (id) DO NOTHING;

-- Quick Learn 28: VPNs
INSERT INTO public.quick_learn_lessons (id, title, slug, branch, category, difficulty, estimated_minutes, is_recommended, fx_reward, short_description, content_markdown, is_published)
VALUES (
  '00000000-0000-4000-a000-000000000028',
  'VPNs',
  'vpns',
  'CSE',
  'Software Eng',
  'Intermediate',
  3,
  TRUE,
  10,
  'Master VPNs fundamentals with quick reading and 15 practice MCQs on FEEDX.',
  '### Learning Text
A VPN creates an encrypted tunnel between a device and a VPN endpoint. It can protect traffic across untrusted networks, but it does not make a user completely anonymous or secure from every threat.

### Key Points
- **VPN**
- **encrypted tunnel**
- **VPN server**
- **client**
- **IP address**
- **public Wi-Fi**',
  TRUE
) ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title;

INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000028000001',
  '00000000-0000-4000-a000-000000000028',
  'Q1. What is VPN?',
  'client',
  'security',
  'privacy',
  'VPN',
  'D',
  'VPN is a key concept in VPNs.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000028000002',
  '00000000-0000-4000-a000-000000000028',
  'Q2. Which option is most directly associated with encrypted tunnel?',
  'encrypted tunnel',
  'authentication',
  'remote access',
  'routing',
  'A',
  'encrypted tunnel is a key concept in VPNs.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000028000003',
  '00000000-0000-4000-a000-000000000028',
  'Q3. Which statement best describes VPN server?',
  'DNS',
  'split tunneling',
  'VPN server',
  'security',
  'C',
  'VPN server is a key concept in VPNs.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000028000004',
  '00000000-0000-4000-a000-000000000028',
  'Q4. In this topic, what does client refer to?',
  'VPN',
  'security',
  'DNS',
  'client',
  'D',
  'client is a key concept in VPNs.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000028000005',
  '00000000-0000-4000-a000-000000000028',
  'Q5. What is IP address?',
  'remote access',
  'ISP',
  'security',
  'IP address',
  'D',
  'IP address is a key concept in VPNs.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000028000006',
  '00000000-0000-4000-a000-000000000028',
  'Q6. Which option is most directly associated with public Wi-Fi?',
  'DNS',
  'public Wi-Fi',
  'ISP',
  'endpoint',
  'B',
  'public Wi-Fi is a key concept in VPNs.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000028000007',
  '00000000-0000-4000-a000-000000000028',
  'Q7. Which statement best describes encryption?',
  'routing',
  'encryption',
  'limitations',
  'site-to-site',
  'B',
  'encryption is a key concept in VPNs.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000028000008',
  '00000000-0000-4000-a000-000000000028',
  'Q8. In this topic, what does privacy refer to?',
  'public Wi-Fi',
  'privacy',
  'VPN server',
  'routing',
  'B',
  'privacy is a key concept in VPNs.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000028000009',
  '00000000-0000-4000-a000-000000000028',
  'Q9. What is routing?',
  'routing',
  'IP address',
  'split tunneling',
  'limitations',
  'A',
  'routing is a key concept in VPNs.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000028000010',
  '00000000-0000-4000-a000-000000000028',
  'Q10. Which option is most directly associated with endpoint?',
  'ISP',
  'IP address',
  'remote access',
  'endpoint',
  'D',
  'endpoint is a key concept in VPNs.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000028000011',
  '00000000-0000-4000-a000-000000000028',
  'Q11. Which statement best describes protocol?',
  'IP address',
  'split tunneling',
  'remote access',
  'protocol',
  'D',
  'protocol is a key concept in VPNs.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000028000012',
  '00000000-0000-4000-a000-000000000028',
  'Q12. In this topic, what does remote access refer to?',
  'ISP',
  'remote access',
  'client',
  'encryption',
  'B',
  'remote access is a key concept in VPNs.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000028000013',
  '00000000-0000-4000-a000-000000000028',
  'Q13. What is site-to-site?',
  'client',
  'routing',
  'site-to-site',
  'ISP',
  'C',
  'site-to-site is a key concept in VPNs.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000028000014',
  '00000000-0000-4000-a000-000000000028',
  'Q14. Which option is most directly associated with split tunneling?',
  'authentication',
  'split tunneling',
  'public Wi-Fi',
  'encryption',
  'B',
  'split tunneling is a key concept in VPNs.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000028000015',
  '00000000-0000-4000-a000-000000000028',
  'Q15. Which statement best describes traffic?',
  'encryption',
  'traffic',
  'ISP',
  'public Wi-Fi',
  'B',
  'traffic is a key concept in VPNs.'
) ON CONFLICT (id) DO NOTHING;

-- Quick Learn 29: Ethical Hacking Basics
INSERT INTO public.quick_learn_lessons (id, title, slug, branch, category, difficulty, estimated_minutes, is_recommended, fx_reward, short_description, content_markdown, is_published)
VALUES (
  '00000000-0000-4000-a000-000000000029',
  'Ethical Hacking Basics',
  'ethical-hacking-basics',
  'CSE',
  'Backend',
  'Advanced',
  3,
  TRUE,
  10,
  'Master Ethical Hacking Basics fundamentals with quick reading and 15 practice MCQs on FEEDX.',
  '### Learning Text
Ethical hacking is authorized security testing performed to identify weaknesses so they can be fixed. Permission, scope and responsible handling of findings are essential.

### Key Points
- **ethical hacking**
- **authorization**
- **scope**
- **vulnerability**
- **penetration test**
- **reconnaissance**',
  TRUE
) ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title;

INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000029000001',
  '00000000-0000-4000-a000-000000000029',
  'Q1. What is ethical hacking?',
  'evidence',
  'ethical hacking',
  'verification',
  'scan',
  'B',
  'ethical hacking is a key concept in Ethical Hacking Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000029000002',
  '00000000-0000-4000-a000-000000000029',
  'Q2. Which option is most directly associated with authorization?',
  'authorization',
  'responsible disclosure',
  'permission',
  'verification',
  'A',
  'authorization is a key concept in Ethical Hacking Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000029000003',
  '00000000-0000-4000-a000-000000000029',
  'Q3. Which statement best describes scope?',
  'scope',
  'vulnerability',
  'risk',
  'remediation',
  'A',
  'scope is a key concept in Ethical Hacking Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000029000004',
  '00000000-0000-4000-a000-000000000029',
  'Q4. In this topic, what does vulnerability refer to?',
  'authorization',
  'vulnerability',
  'report',
  'risk',
  'B',
  'vulnerability is a key concept in Ethical Hacking Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000029000005',
  '00000000-0000-4000-a000-000000000029',
  'Q5. What is penetration test?',
  'vulnerability',
  'responsible disclosure',
  'penetration test',
  'authorization',
  'C',
  'penetration test is a key concept in Ethical Hacking Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000029000006',
  '00000000-0000-4000-a000-000000000029',
  'Q6. Which option is most directly associated with reconnaissance?',
  'reconnaissance',
  'responsible disclosure',
  'vulnerability',
  'rules of engagement',
  'A',
  'reconnaissance is a key concept in Ethical Hacking Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000029000007',
  '00000000-0000-4000-a000-000000000029',
  'Q7. Which statement best describes scan?',
  'scan',
  'responsible disclosure',
  'rules of engagement',
  'ethical hacking',
  'A',
  'scan is a key concept in Ethical Hacking Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000029000008',
  '00000000-0000-4000-a000-000000000029',
  'Q8. In this topic, what does exploit refer to?',
  'reconnaissance',
  'vulnerability',
  'asset',
  'exploit',
  'D',
  'exploit is a key concept in Ethical Hacking Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000029000009',
  '00000000-0000-4000-a000-000000000029',
  'Q9. What is evidence?',
  'penetration test',
  'verification',
  'scope',
  'evidence',
  'D',
  'evidence is a key concept in Ethical Hacking Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000029000010',
  '00000000-0000-4000-a000-000000000029',
  'Q10. Which option is most directly associated with report?',
  'authorization',
  'evidence',
  'report',
  'risk',
  'C',
  'report is a key concept in Ethical Hacking Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000029000011',
  '00000000-0000-4000-a000-000000000029',
  'Q11. Which statement best describes remediation?',
  'remediation',
  'asset',
  'security tester',
  'severity',
  'A',
  'remediation is a key concept in Ethical Hacking Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000029000012',
  '00000000-0000-4000-a000-000000000029',
  'Q12. In this topic, what does responsible disclosure refer to?',
  'scope',
  'security tester',
  'report',
  'responsible disclosure',
  'D',
  'responsible disclosure is a key concept in Ethical Hacking Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000029000013',
  '00000000-0000-4000-a000-000000000029',
  'Q13. What is rules of engagement?',
  'responsible disclosure',
  'vulnerability',
  'rules of engagement',
  'asset',
  'C',
  'rules of engagement is a key concept in Ethical Hacking Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000029000014',
  '00000000-0000-4000-a000-000000000029',
  'Q14. Which option is most directly associated with asset?',
  'remediation',
  'reconnaissance',
  'asset',
  'security tester',
  'C',
  'asset is a key concept in Ethical Hacking Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000029000015',
  '00000000-0000-4000-a000-000000000029',
  'Q15. Which statement best describes risk?',
  'risk',
  'report',
  'severity',
  'evidence',
  'A',
  'risk is a key concept in Ethical Hacking Basics.'
) ON CONFLICT (id) DO NOTHING;

-- Quick Learn 30: DevOps Basics
INSERT INTO public.quick_learn_lessons (id, title, slug, branch, category, difficulty, estimated_minutes, is_recommended, fx_reward, short_description, content_markdown, is_published)
VALUES (
  '00000000-0000-4000-a000-000000000030',
  'DevOps Basics',
  'devops-basics',
  'CSE',
  'Backend',
  'Intermediate',
  3,
  TRUE,
  10,
  'Master DevOps Basics fundamentals with quick reading and 15 practice MCQs on FEEDX.',
  '### Learning Text
DevOps combines development and operations practices to improve collaboration, automation, testing, deployment and monitoring across the software lifecycle.

### Key Points
- **DevOps**
- **development**
- **operations**
- **automation**
- **CI**
- **CD**',
  TRUE
) ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title;

INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000030000001',
  '00000000-0000-4000-a000-000000000030',
  'Q1. What is DevOps?',
  'release',
  'feedback',
  'DevOps',
  'infrastructure',
  'C',
  'DevOps is a key concept in DevOps Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000030000002',
  '00000000-0000-4000-a000-000000000030',
  'Q2. Which option is most directly associated with development?',
  'monitoring',
  'version control',
  'CD',
  'development',
  'D',
  'development is a key concept in DevOps Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000030000003',
  '00000000-0000-4000-a000-000000000030',
  'Q3. Which statement best describes operations?',
  'version control',
  'DevOps',
  'culture',
  'operations',
  'D',
  'operations is a key concept in DevOps Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000030000004',
  '00000000-0000-4000-a000-000000000030',
  'Q4. In this topic, what does automation refer to?',
  'operations',
  'release',
  'version control',
  'automation',
  'D',
  'automation is a key concept in DevOps Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000030000005',
  '00000000-0000-4000-a000-000000000030',
  'Q5. What is CI?',
  'configuration',
  'feedback',
  'CI',
  'release',
  'C',
  'CI is a key concept in DevOps Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000030000006',
  '00000000-0000-4000-a000-000000000030',
  'Q6. Which option is most directly associated with CD?',
  'configuration',
  'development',
  'CD',
  'testing',
  'C',
  'CD is a key concept in DevOps Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000030000007',
  '00000000-0000-4000-a000-000000000030',
  'Q7. Which statement best describes deployment?',
  'infrastructure',
  'deployment',
  'containers',
  'monitoring',
  'B',
  'deployment is a key concept in DevOps Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000030000008',
  '00000000-0000-4000-a000-000000000030',
  'Q8. In this topic, what does monitoring refer to?',
  'monitoring',
  'CD',
  'deployment',
  'pipeline',
  'A',
  'monitoring is a key concept in DevOps Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000030000009',
  '00000000-0000-4000-a000-000000000030',
  'Q9. What is collaboration?',
  'feedback',
  'collaboration',
  'pipeline',
  'reliability',
  'B',
  'collaboration is a key concept in DevOps Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000030000010',
  '00000000-0000-4000-a000-000000000030',
  'Q10. Which option is most directly associated with version control?',
  'observability',
  'version control',
  'CD',
  'collaboration',
  'B',
  'version control is a key concept in DevOps Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000030000011',
  '00000000-0000-4000-a000-000000000030',
  'Q11. Which statement best describes infrastructure?',
  'observability',
  'automation',
  'infrastructure',
  'testing',
  'C',
  'infrastructure is a key concept in DevOps Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000030000012',
  '00000000-0000-4000-a000-000000000030',
  'Q12. In this topic, what does testing refer to?',
  'monitoring',
  'operations',
  'version control',
  'testing',
  'D',
  'testing is a key concept in DevOps Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000030000013',
  '00000000-0000-4000-a000-000000000030',
  'Q13. What is pipeline?',
  'monitoring',
  'pipeline',
  'deployment',
  'automation',
  'B',
  'pipeline is a key concept in DevOps Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000030000014',
  '00000000-0000-4000-a000-000000000030',
  'Q14. Which option is most directly associated with feedback?',
  'observability',
  'feedback',
  'collaboration',
  'reliability',
  'B',
  'feedback is a key concept in DevOps Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000030000015',
  '00000000-0000-4000-a000-000000000030',
  'Q15. Which statement best describes release?',
  'collaboration',
  'release',
  'version control',
  'CD',
  'B',
  'release is a key concept in DevOps Basics.'
) ON CONFLICT (id) DO NOTHING;

-- Quick Learn 31: CI/CD
INSERT INTO public.quick_learn_lessons (id, title, slug, branch, category, difficulty, estimated_minutes, is_recommended, fx_reward, short_description, content_markdown, is_published)
VALUES (
  '00000000-0000-4000-a000-000000000031',
  'CI/CD',
  'cicd',
  'CSE',
  'Architecture',
  'Advanced',
  3,
  TRUE,
  10,
  'Master CI/CD fundamentals with quick reading and 15 practice MCQs on FEEDX.',
  '### Learning Text
Continuous integration frequently integrates and tests code changes. Continuous delivery or deployment automates later stages so software can be released more reliably.

### Key Points
- **continuous integration**
- **continuous delivery**
- **continuous deployment**
- **pipeline**
- **build**
- **test**',
  TRUE
) ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title;

INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000031000001',
  '00000000-0000-4000-a000-000000000031',
  'Q1. What is continuous integration?',
  'continuous integration',
  'integration test',
  'repository',
  'artifact',
  'A',
  'continuous integration is a key concept in CI/CD.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000031000002',
  '00000000-0000-4000-a000-000000000031',
  'Q2. Which option is most directly associated with continuous delivery?',
  'merge',
  'continuous delivery',
  'production',
  'automation',
  'B',
  'continuous delivery is a key concept in CI/CD.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000031000003',
  '00000000-0000-4000-a000-000000000031',
  'Q3. Which statement best describes continuous deployment?',
  'continuous integration',
  'continuous deployment',
  'repository',
  'quality gate',
  'B',
  'continuous deployment is a key concept in CI/CD.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000031000004',
  '00000000-0000-4000-a000-000000000031',
  'Q4. In this topic, what does pipeline refer to?',
  'commit',
  'pipeline',
  'integration test',
  'feedback',
  'B',
  'pipeline is a key concept in CI/CD.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000031000005',
  '00000000-0000-4000-a000-000000000031',
  'Q5. What is build?',
  'artifact',
  'integration test',
  'build',
  'quality gate',
  'C',
  'build is a key concept in CI/CD.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000031000006',
  '00000000-0000-4000-a000-000000000031',
  'Q6. Which option is most directly associated with test?',
  'quality gate',
  'test',
  'deploy',
  'release',
  'B',
  'test is a key concept in CI/CD.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000031000007',
  '00000000-0000-4000-a000-000000000031',
  'Q7. Which statement best describes deploy?',
  'quality gate',
  'build',
  'deploy',
  'test',
  'C',
  'deploy is a key concept in CI/CD.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000031000008',
  '00000000-0000-4000-a000-000000000031',
  'Q8. In this topic, what does automation refer to?',
  'automation',
  'production',
  'continuous delivery',
  'deploy',
  'A',
  'automation is a key concept in CI/CD.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000031000009',
  '00000000-0000-4000-a000-000000000031',
  'Q9. What is commit?',
  'continuous integration',
  'commit',
  'deploy',
  'unit test',
  'B',
  'commit is a key concept in CI/CD.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000031000010',
  '00000000-0000-4000-a000-000000000031',
  'Q10. Which option is most directly associated with merge?',
  'merge',
  'feedback',
  'continuous integration',
  'unit test',
  'A',
  'merge is a key concept in CI/CD.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000031000011',
  '00000000-0000-4000-a000-000000000031',
  'Q11. Which statement best describes artifact?',
  'merge',
  'artifact',
  'commit',
  'repository',
  'B',
  'artifact is a key concept in CI/CD.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000031000012',
  '00000000-0000-4000-a000-000000000031',
  'Q12. In this topic, what does staging refer to?',
  'continuous deployment',
  'automation',
  'staging',
  'unit test',
  'C',
  'staging is a key concept in CI/CD.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000031000013',
  '00000000-0000-4000-a000-000000000031',
  'Q13. What is production?',
  'production',
  'deploy',
  'unit test',
  'repository',
  'A',
  'production is a key concept in CI/CD.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000031000014',
  '00000000-0000-4000-a000-000000000031',
  'Q14. Which option is most directly associated with rollback?',
  'staging',
  'rollback',
  'feedback',
  'continuous integration',
  'B',
  'rollback is a key concept in CI/CD.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000031000015',
  '00000000-0000-4000-a000-000000000031',
  'Q15. Which statement best describes quality gate?',
  'build',
  'staging',
  'quality gate',
  'rollback',
  'C',
  'quality gate is a key concept in CI/CD.'
) ON CONFLICT (id) DO NOTHING;

-- Quick Learn 32: Docker Basics
INSERT INTO public.quick_learn_lessons (id, title, slug, branch, category, difficulty, estimated_minutes, is_recommended, fx_reward, short_description, content_markdown, is_published)
VALUES (
  '00000000-0000-4000-a000-000000000032',
  'Docker Basics',
  'docker-basics',
  'CSE',
  'DevOps',
  'Intermediate',
  3,
  TRUE,
  10,
  'Master Docker Basics fundamentals with quick reading and 15 practice MCQs on FEEDX.',
  '### Learning Text
Docker packages applications and their dependencies into containers. Containers share the host kernel but isolate application processes and filesystem environments.

### Key Points
- **Docker**
- **container**
- **image**
- **Dockerfile**
- **registry**
- **container runtime**',
  TRUE
) ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title;

INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000032000001',
  '00000000-0000-4000-a000-000000000032',
  'Q1. What is Docker?',
  'build',
  'run',
  'volume',
  'Docker',
  'D',
  'Docker is a key concept in Docker Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000032000002',
  '00000000-0000-4000-a000-000000000032',
  'Q2. Which option is most directly associated with container?',
  'container',
  'tag',
  'Compose',
  'build',
  'A',
  'container is a key concept in Docker Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000032000003',
  '00000000-0000-4000-a000-000000000032',
  'Q3. Which statement best describes image?',
  'volume',
  'dependency',
  'image',
  'push',
  'C',
  'image is a key concept in Docker Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000032000004',
  '00000000-0000-4000-a000-000000000032',
  'Q4. In this topic, what does Dockerfile refer to?',
  'Dockerfile',
  'network',
  'Docker',
  'image',
  'A',
  'Dockerfile is a key concept in Docker Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000032000005',
  '00000000-0000-4000-a000-000000000032',
  'Q5. What is registry?',
  'registry',
  'container runtime',
  'port mapping',
  'layer',
  'A',
  'registry is a key concept in Docker Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000032000006',
  '00000000-0000-4000-a000-000000000032',
  'Q6. Which option is most directly associated with container runtime?',
  'Compose',
  'Dockerfile',
  'build',
  'container runtime',
  'D',
  'container runtime is a key concept in Docker Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000032000007',
  '00000000-0000-4000-a000-000000000032',
  'Q7. Which statement best describes port mapping?',
  'container',
  'isolation',
  'port mapping',
  'push',
  'C',
  'port mapping is a key concept in Docker Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000032000008',
  '00000000-0000-4000-a000-000000000032',
  'Q8. In this topic, what does volume refer to?',
  'push',
  'port mapping',
  'network',
  'volume',
  'D',
  'volume is a key concept in Docker Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000032000009',
  '00000000-0000-4000-a000-000000000032',
  'Q9. What is network?',
  'image',
  'host kernel',
  'network',
  'tag',
  'C',
  'network is a key concept in Docker Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000032000010',
  '00000000-0000-4000-a000-000000000032',
  'Q10. Which option is most directly associated with layer?',
  'layer',
  'tag',
  'Dockerfile',
  'containerization',
  'A',
  'layer is a key concept in Docker Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000032000011',
  '00000000-0000-4000-a000-000000000032',
  'Q11. Which statement best describes build?',
  'volume',
  'tag',
  'build',
  'port mapping',
  'C',
  'build is a key concept in Docker Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000032000012',
  '00000000-0000-4000-a000-000000000032',
  'Q12. In this topic, what does run refer to?',
  'run',
  'image',
  'port mapping',
  'layer',
  'A',
  'run is a key concept in Docker Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000032000013',
  '00000000-0000-4000-a000-000000000032',
  'Q13. What is pull?',
  'Compose',
  'pull',
  'Dockerfile',
  'build',
  'B',
  'pull is a key concept in Docker Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000032000014',
  '00000000-0000-4000-a000-000000000032',
  'Q14. Which option is most directly associated with push?',
  'push',
  'build',
  'isolation',
  'port mapping',
  'A',
  'push is a key concept in Docker Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000032000015',
  '00000000-0000-4000-a000-000000000032',
  'Q15. Which statement best describes tag?',
  'port mapping',
  'run',
  'tag',
  'registry',
  'C',
  'tag is a key concept in Docker Basics.'
) ON CONFLICT (id) DO NOTHING;

-- Quick Learn 33: Software Development Life Cycle
INSERT INTO public.quick_learn_lessons (id, title, slug, branch, category, difficulty, estimated_minutes, is_recommended, fx_reward, short_description, content_markdown, is_published)
VALUES (
  '00000000-0000-4000-a000-000000000033',
  'Software Development Life Cycle',
  'software-development-life-cycle',
  'AI & ML',
  'AI',
  'Beginner',
  3,
  TRUE,
  10,
  'Master Software Development Life Cycle fundamentals with quick reading and 15 practice MCQs on FEEDX.',
  '### Learning Text
The SDLC describes stages used to plan, build, test, deploy and maintain software. Common stages include requirements, design, development, testing, deployment and maintenance.

### Key Points
- **requirements**
- **planning**
- **design**
- **development**
- **testing**
- **deployment**',
  TRUE
) ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title;

INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000033000001',
  '00000000-0000-4000-a000-000000000033',
  'Q1. What is requirements?',
  'feedback',
  'testing',
  'requirements',
  'lifecycle',
  'C',
  'requirements is a key concept in Software Development Life Cycle.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000033000002',
  '00000000-0000-4000-a000-000000000033',
  'Q2. Which option is most directly associated with planning?',
  'requirements',
  'maintenance',
  'lifecycle',
  'planning',
  'D',
  'planning is a key concept in Software Development Life Cycle.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000033000003',
  '00000000-0000-4000-a000-000000000033',
  'Q3. Which statement best describes design?',
  'SDLC',
  'lifecycle',
  'design',
  'architecture',
  'C',
  'design is a key concept in Software Development Life Cycle.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000033000004',
  '00000000-0000-4000-a000-000000000033',
  'Q4. In this topic, what does development refer to?',
  'stakeholder',
  'release',
  'iteration',
  'development',
  'D',
  'development is a key concept in Software Development Life Cycle.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000033000005',
  '00000000-0000-4000-a000-000000000033',
  'Q5. What is testing?',
  'lifecycle',
  'release',
  'testing',
  'documentation',
  'C',
  'testing is a key concept in Software Development Life Cycle.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000033000006',
  '00000000-0000-4000-a000-000000000033',
  'Q6. Which option is most directly associated with deployment?',
  'architecture',
  'requirements',
  'waterfall',
  'deployment',
  'D',
  'deployment is a key concept in Software Development Life Cycle.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000033000007',
  '00000000-0000-4000-a000-000000000033',
  'Q7. Which statement best describes maintenance?',
  'lifecycle',
  'agile',
  'feedback',
  'maintenance',
  'D',
  'maintenance is a key concept in Software Development Life Cycle.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000033000008',
  '00000000-0000-4000-a000-000000000033',
  'Q8. In this topic, what does SDLC refer to?',
  'SDLC',
  'requirements',
  'quality',
  'design',
  'A',
  'SDLC is a key concept in Software Development Life Cycle.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000033000009',
  '00000000-0000-4000-a000-000000000033',
  'Q9. What is stakeholder?',
  'waterfall',
  'quality',
  'agile',
  'stakeholder',
  'D',
  'stakeholder is a key concept in Software Development Life Cycle.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000033000010',
  '00000000-0000-4000-a000-000000000033',
  'Q10. Which option is most directly associated with prototype?',
  'requirements',
  'documentation',
  'prototype',
  'architecture',
  'C',
  'prototype is a key concept in Software Development Life Cycle.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000033000011',
  '00000000-0000-4000-a000-000000000033',
  'Q11. Which statement best describes architecture?',
  'architecture',
  'release',
  'lifecycle',
  'development',
  'A',
  'architecture is a key concept in Software Development Life Cycle.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000033000012',
  '00000000-0000-4000-a000-000000000033',
  'Q12. In this topic, what does bug refer to?',
  'prototype',
  'bug',
  'feedback',
  'agile',
  'B',
  'bug is a key concept in Software Development Life Cycle.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000033000013',
  '00000000-0000-4000-a000-000000000033',
  'Q13. What is release?',
  'waterfall',
  'architecture',
  'release',
  'iteration',
  'C',
  'release is a key concept in Software Development Life Cycle.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000033000014',
  '00000000-0000-4000-a000-000000000033',
  'Q14. Which option is most directly associated with documentation?',
  'documentation',
  'prototype',
  'iteration',
  'requirements',
  'A',
  'documentation is a key concept in Software Development Life Cycle.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000033000015',
  '00000000-0000-4000-a000-000000000033',
  'Q15. Which statement best describes iteration?',
  'bug',
  'iteration',
  'prototype',
  'feedback',
  'B',
  'iteration is a key concept in Software Development Life Cycle.'
) ON CONFLICT (id) DO NOTHING;

-- Quick Learn 34: Debugging & Error Handling
INSERT INTO public.quick_learn_lessons (id, title, slug, branch, category, difficulty, estimated_minutes, is_recommended, fx_reward, short_description, content_markdown, is_published)
VALUES (
  '00000000-0000-4000-a000-000000000034',
  'Debugging & Error Handling',
  'debugging-error-handling',
  'AI & ML',
  'ML',
  'Intermediate',
  3,
  TRUE,
  10,
  'Master Debugging & Error Handling fundamentals with quick reading and 15 practice MCQs on FEEDX.',
  '### Learning Text
Debugging is the process of finding and fixing software defects. Error handling lets programs respond to expected failures without crashing or producing unsafe behavior.

### Key Points
- **debugging**
- **bug**
- **error**
- **exception**
- **log**
- **stack trace**',
  TRUE
) ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title;

INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000034000001',
  '00000000-0000-4000-a000-000000000034',
  'Q1. What is debugging?',
  'monitoring',
  'regression',
  'failure',
  'debugging',
  'D',
  'debugging is a key concept in Debugging & Error Handling.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000034000002',
  '00000000-0000-4000-a000-000000000034',
  'Q2. Which option is most directly associated with bug?',
  'reproduce',
  'bug',
  'failure',
  'regression',
  'B',
  'bug is a key concept in Debugging & Error Handling.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000034000003',
  '00000000-0000-4000-a000-000000000034',
  'Q3. Which statement best describes error?',
  'breakpoint',
  'error',
  'regression',
  'debugging',
  'B',
  'error is a key concept in Debugging & Error Handling.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000034000004',
  '00000000-0000-4000-a000-000000000034',
  'Q4. In this topic, what does exception refer to?',
  'exception',
  'failure',
  'try/catch',
  'handling',
  'A',
  'exception is a key concept in Debugging & Error Handling.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000034000005',
  '00000000-0000-4000-a000-000000000034',
  'Q5. What is log?',
  'debugging',
  'log',
  'validation',
  'try/catch',
  'B',
  'log is a key concept in Debugging & Error Handling.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000034000006',
  '00000000-0000-4000-a000-000000000034',
  'Q6. Which option is most directly associated with stack trace?',
  'stack trace',
  'regression',
  'handling',
  'input',
  'A',
  'stack trace is a key concept in Debugging & Error Handling.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000034000007',
  '00000000-0000-4000-a000-000000000034',
  'Q7. Which statement best describes breakpoint?',
  'bug',
  'log',
  'exception',
  'breakpoint',
  'D',
  'breakpoint is a key concept in Debugging & Error Handling.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000034000008',
  '00000000-0000-4000-a000-000000000034',
  'Q8. In this topic, what does test refer to?',
  'validation',
  'test',
  'input',
  'error',
  'B',
  'test is a key concept in Debugging & Error Handling.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000034000009',
  '00000000-0000-4000-a000-000000000034',
  'Q9. What is reproduce?',
  'verification',
  'stack trace',
  'reproduce',
  'log',
  'C',
  'reproduce is a key concept in Debugging & Error Handling.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000034000010',
  '00000000-0000-4000-a000-000000000034',
  'Q10. Which option is most directly associated with root cause?',
  'root cause',
  'assertion',
  'exception',
  'reproduce',
  'A',
  'root cause is a key concept in Debugging & Error Handling.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000034000011',
  '00000000-0000-4000-a000-000000000034',
  'Q11. Which statement best describes validation?',
  'reproduce',
  'fix',
  'validation',
  'error',
  'C',
  'validation is a key concept in Debugging & Error Handling.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000034000012',
  '00000000-0000-4000-a000-000000000034',
  'Q12. In this topic, what does try/catch refer to?',
  'breakpoint',
  'monitoring',
  'try/catch',
  'reproduce',
  'C',
  'try/catch is a key concept in Debugging & Error Handling.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000034000013',
  '00000000-0000-4000-a000-000000000034',
  'Q13. What is input?',
  'input',
  'handling',
  'log',
  'bug',
  'A',
  'input is a key concept in Debugging & Error Handling.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000034000014',
  '00000000-0000-4000-a000-000000000034',
  'Q14. Which option is most directly associated with failure?',
  'failure',
  'test',
  'debugging',
  'bug',
  'A',
  'failure is a key concept in Debugging & Error Handling.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000034000015',
  '00000000-0000-4000-a000-000000000034',
  'Q15. Which statement best describes handling?',
  'stack trace',
  'handling',
  'test',
  'input',
  'B',
  'handling is a key concept in Debugging & Error Handling.'
) ON CONFLICT (id) DO NOTHING;

-- Quick Learn 35: Data Structures
INSERT INTO public.quick_learn_lessons (id, title, slug, branch, category, difficulty, estimated_minutes, is_recommended, fx_reward, short_description, content_markdown, is_published)
VALUES (
  '00000000-0000-4000-a000-000000000035',
  'Data Structures',
  'data-structures',
  'AI & ML',
  'AI',
  'Advanced',
  3,
  TRUE,
  10,
  'Master Data Structures fundamentals with quick reading and 15 practice MCQs on FEEDX.',
  '### Learning Text
Data structures organize data for efficient access and modification. Common examples include arrays, linked lists, stacks, queues, hash tables, trees and graphs.

### Key Points
- **array**
- **linked list**
- **stack**
- **queue**
- **hash table**
- **tree**',
  TRUE
) ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title;

INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000035000001',
  '00000000-0000-4000-a000-000000000035',
  'Q1. What is array?',
  'tree',
  'index',
  'array',
  'hash table',
  'C',
  'array is a key concept in Data Structures.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000035000002',
  '00000000-0000-4000-a000-000000000035',
  'Q2. Which option is most directly associated with linked list?',
  'graph',
  'traversal',
  'linked list',
  'stack',
  'C',
  'linked list is a key concept in Data Structures.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000035000003',
  '00000000-0000-4000-a000-000000000035',
  'Q3. Which statement best describes stack?',
  'complexity',
  'stack',
  'index',
  'array',
  'B',
  'stack is a key concept in Data Structures.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000035000004',
  '00000000-0000-4000-a000-000000000035',
  'Q4. In this topic, what does queue refer to?',
  'insert',
  'queue',
  'delete',
  'linked list',
  'B',
  'queue is a key concept in Data Structures.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000035000005',
  '00000000-0000-4000-a000-000000000035',
  'Q5. What is hash table?',
  'value',
  'linked list',
  'complexity',
  'hash table',
  'D',
  'hash table is a key concept in Data Structures.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000035000006',
  '00000000-0000-4000-a000-000000000035',
  'Q6. Which option is most directly associated with tree?',
  'heap',
  'tree',
  'LIFO',
  'delete',
  'B',
  'tree is a key concept in Data Structures.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000035000007',
  '00000000-0000-4000-a000-000000000035',
  'Q7. Which statement best describes graph?',
  'tree',
  'hash table',
  'graph',
  'traversal',
  'C',
  'graph is a key concept in Data Structures.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000035000008',
  '00000000-0000-4000-a000-000000000035',
  'Q8. In this topic, what does heap refer to?',
  'insert',
  'complexity',
  'hash table',
  'heap',
  'D',
  'heap is a key concept in Data Structures.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000035000009',
  '00000000-0000-4000-a000-000000000035',
  'Q9. What is node?',
  'hash table',
  'complexity',
  'stack',
  'node',
  'D',
  'node is a key concept in Data Structures.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000035000010',
  '00000000-0000-4000-a000-000000000035',
  'Q10. Which option is most directly associated with index?',
  'LIFO',
  'search',
  'heap',
  'index',
  'D',
  'index is a key concept in Data Structures.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000035000011',
  '00000000-0000-4000-a000-000000000035',
  'Q11. Which statement best describes LIFO?',
  'graph',
  'LIFO',
  'value',
  'hash table',
  'B',
  'LIFO is a key concept in Data Structures.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000035000012',
  '00000000-0000-4000-a000-000000000035',
  'Q12. In this topic, what does FIFO refer to?',
  'queue',
  'traversal',
  'FIFO',
  'linked list',
  'C',
  'FIFO is a key concept in Data Structures.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000035000013',
  '00000000-0000-4000-a000-000000000035',
  'Q13. What is key?',
  'traversal',
  'value',
  'search',
  'key',
  'D',
  'key is a key concept in Data Structures.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000035000014',
  '00000000-0000-4000-a000-000000000035',
  'Q14. Which option is most directly associated with value?',
  'delete',
  'index',
  'value',
  'data structure',
  'C',
  'value is a key concept in Data Structures.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000035000015',
  '00000000-0000-4000-a000-000000000035',
  'Q15. Which statement best describes search?',
  'search',
  'index',
  'queue',
  'FIFO',
  'A',
  'search is a key concept in Data Structures.'
) ON CONFLICT (id) DO NOTHING;

-- Quick Learn 36: Algorithms Basics
INSERT INTO public.quick_learn_lessons (id, title, slug, branch, category, difficulty, estimated_minutes, is_recommended, fx_reward, short_description, content_markdown, is_published)
VALUES (
  '00000000-0000-4000-a000-000000000036',
  'Algorithms Basics',
  'algorithms-basics',
  'CSE',
  'Security',
  'Advanced',
  3,
  TRUE,
  10,
  'Master Algorithms Basics fundamentals with quick reading and 15 practice MCQs on FEEDX.',
  '### Learning Text
An algorithm is a defined procedure for solving a problem. Good algorithm design considers correctness, clarity, time complexity and space complexity.

### Key Points
- **algorithm**
- **input**
- **output**
- **step**
- **correctness**
- **efficiency**',
  TRUE
) ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title;

INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000036000001',
  '00000000-0000-4000-a000-000000000036',
  'Q1. What is algorithm?',
  'time complexity',
  'iteration',
  'search',
  'algorithm',
  'D',
  'algorithm is a key concept in Algorithms Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000036000002',
  '00000000-0000-4000-a000-000000000036',
  'Q2. Which option is most directly associated with input?',
  'space complexity',
  'recursion',
  'input',
  'optimization',
  'C',
  'input is a key concept in Algorithms Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000036000003',
  '00000000-0000-4000-a000-000000000036',
  'Q3. Which statement best describes output?',
  'output',
  'termination',
  'recursion',
  'greedy',
  'A',
  'output is a key concept in Algorithms Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000036000004',
  '00000000-0000-4000-a000-000000000036',
  'Q4. In this topic, what does step refer to?',
  'optimization',
  'divide and conquer',
  'pseudocode',
  'step',
  'D',
  'step is a key concept in Algorithms Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000036000005',
  '00000000-0000-4000-a000-000000000036',
  'Q5. What is correctness?',
  'output',
  'correctness',
  'time complexity',
  'algorithm',
  'B',
  'correctness is a key concept in Algorithms Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000036000006',
  '00000000-0000-4000-a000-000000000036',
  'Q6. Which option is most directly associated with efficiency?',
  'divide and conquer',
  'iteration',
  'efficiency',
  'pseudocode',
  'C',
  'efficiency is a key concept in Algorithms Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000036000007',
  '00000000-0000-4000-a000-000000000036',
  'Q7. Which statement best describes time complexity?',
  'iteration',
  'efficiency',
  'time complexity',
  'recursion',
  'C',
  'time complexity is a key concept in Algorithms Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000036000008',
  '00000000-0000-4000-a000-000000000036',
  'Q8. In this topic, what does space complexity refer to?',
  'correctness',
  'recursion',
  'Big O',
  'space complexity',
  'D',
  'space complexity is a key concept in Algorithms Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000036000009',
  '00000000-0000-4000-a000-000000000036',
  'Q9. What is Big O?',
  'divide and conquer',
  'termination',
  'Big O',
  'sort',
  'C',
  'Big O is a key concept in Algorithms Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000036000010',
  '00000000-0000-4000-a000-000000000036',
  'Q10. Which option is most directly associated with search?',
  'input',
  'algorithm',
  'termination',
  'search',
  'D',
  'search is a key concept in Algorithms Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000036000011',
  '00000000-0000-4000-a000-000000000036',
  'Q11. Which statement best describes sort?',
  'divide and conquer',
  'sort',
  'algorithm',
  'algorithm',
  'B',
  'sort is a key concept in Algorithms Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000036000012',
  '00000000-0000-4000-a000-000000000036',
  'Q12. In this topic, what does recursion refer to?',
  'search',
  'efficiency',
  'recursion',
  'pseudocode',
  'C',
  'recursion is a key concept in Algorithms Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000036000013',
  '00000000-0000-4000-a000-000000000036',
  'Q13. What is iteration?',
  'iteration',
  'search',
  'time complexity',
  'optimization',
  'A',
  'iteration is a key concept in Algorithms Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000036000014',
  '00000000-0000-4000-a000-000000000036',
  'Q14. Which option is most directly associated with greedy?',
  'greedy',
  'algorithm',
  'optimization',
  'space complexity',
  'A',
  'greedy is a key concept in Algorithms Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000036000015',
  '00000000-0000-4000-a000-000000000036',
  'Q15. Which statement best describes divide and conquer?',
  'recursion',
  'step',
  'Big O',
  'divide and conquer',
  'D',
  'divide and conquer is a key concept in Algorithms Basics.'
) ON CONFLICT (id) DO NOTHING;

-- Quick Learn 37: Artificial Intelligence Basics
INSERT INTO public.quick_learn_lessons (id, title, slug, branch, category, difficulty, estimated_minutes, is_recommended, fx_reward, short_description, content_markdown, is_published)
VALUES (
  '00000000-0000-4000-a000-000000000037',
  'Artificial Intelligence Basics',
  'artificial-intelligence-basics',
  'CSE',
  'Security',
  'Intermediate',
  3,
  TRUE,
  10,
  'Master Artificial Intelligence Basics fundamentals with quick reading and 15 practice MCQs on FEEDX.',
  '### Learning Text
Artificial intelligence refers to systems designed to perform tasks associated with human intelligence, such as pattern recognition, prediction, language processing and decision support.

### Key Points
- **AI**
- **model**
- **data**
- **prediction**
- **classification**
- **natural language**',
  TRUE
) ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title;

INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000037000001',
  '00000000-0000-4000-a000-000000000037',
  'Q1. What is AI?',
  'computer vision',
  'AI',
  'bias',
  'agent',
  'B',
  'AI is a key concept in Artificial Intelligence Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000037000002',
  '00000000-0000-4000-a000-000000000037',
  'Q2. Which option is most directly associated with model?',
  'model',
  'pattern',
  'bias',
  'AI',
  'A',
  'model is a key concept in Artificial Intelligence Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000037000003',
  '00000000-0000-4000-a000-000000000037',
  'Q3. Which statement best describes data?',
  'pattern',
  'data',
  'computer vision',
  'evaluation',
  'B',
  'data is a key concept in Artificial Intelligence Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000037000004',
  '00000000-0000-4000-a000-000000000037',
  'Q4. In this topic, what does prediction refer to?',
  'prediction',
  'neural network',
  'training',
  'speech',
  'A',
  'prediction is a key concept in Artificial Intelligence Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000037000005',
  '00000000-0000-4000-a000-000000000037',
  'Q5. What is classification?',
  'training',
  'classification',
  'pattern',
  'natural language',
  'B',
  'classification is a key concept in Artificial Intelligence Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000037000006',
  '00000000-0000-4000-a000-000000000037',
  'Q6. Which option is most directly associated with natural language?',
  'speech',
  'agent',
  'natural language',
  'prediction',
  'C',
  'natural language is a key concept in Artificial Intelligence Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000037000007',
  '00000000-0000-4000-a000-000000000037',
  'Q7. Which statement best describes computer vision?',
  'neural network',
  'computer vision',
  'machine learning',
  'classification',
  'B',
  'computer vision is a key concept in Artificial Intelligence Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000037000008',
  '00000000-0000-4000-a000-000000000037',
  'Q8. In this topic, what does pattern refer to?',
  'reasoning',
  'agent',
  'machine learning',
  'pattern',
  'D',
  'pattern is a key concept in Artificial Intelligence Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000037000009',
  '00000000-0000-4000-a000-000000000037',
  'Q9. What is training?',
  'prediction',
  'bias',
  'AI',
  'training',
  'D',
  'training is a key concept in Artificial Intelligence Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000037000010',
  '00000000-0000-4000-a000-000000000037',
  'Q10. Which option is most directly associated with inference?',
  'inference',
  'prediction',
  'neural network',
  'agent',
  'A',
  'inference is a key concept in Artificial Intelligence Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000037000011',
  '00000000-0000-4000-a000-000000000037',
  'Q11. Which statement best describes automation?',
  'pattern',
  'automation',
  'model',
  'natural language',
  'B',
  'automation is a key concept in Artificial Intelligence Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000037000012',
  '00000000-0000-4000-a000-000000000037',
  'Q12. In this topic, what does neural network refer to?',
  'neural network',
  'training',
  'model',
  'machine learning',
  'A',
  'neural network is a key concept in Artificial Intelligence Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000037000013',
  '00000000-0000-4000-a000-000000000037',
  'Q13. What is machine learning?',
  'machine learning',
  'reasoning',
  'AI',
  'agent',
  'A',
  'machine learning is a key concept in Artificial Intelligence Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000037000014',
  '00000000-0000-4000-a000-000000000037',
  'Q14. Which option is most directly associated with agent?',
  'agent',
  'inference',
  'bias',
  'prediction',
  'A',
  'agent is a key concept in Artificial Intelligence Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000037000015',
  '00000000-0000-4000-a000-000000000037',
  'Q15. Which statement best describes recommendation?',
  'recommendation',
  'automation',
  'AI system',
  'neural network',
  'A',
  'recommendation is a key concept in Artificial Intelligence Basics.'
) ON CONFLICT (id) DO NOTHING;

-- Quick Learn 38: Machine Learning Basics
INSERT INTO public.quick_learn_lessons (id, title, slug, branch, category, difficulty, estimated_minutes, is_recommended, fx_reward, short_description, content_markdown, is_published)
VALUES (
  '00000000-0000-4000-a000-000000000038',
  'Machine Learning Basics',
  'machine-learning-basics',
  'ECE',
  'IoT',
  'Intermediate',
  3,
  TRUE,
  10,
  'Master Machine Learning Basics fundamentals with quick reading and 15 practice MCQs on FEEDX.',
  '### Learning Text
Machine learning uses data and algorithms to learn patterns for prediction or decision-making. Common categories include supervised, unsupervised and reinforcement learning.

### Key Points
- **machine learning**
- **dataset**
- **feature**
- **label**
- **training**
- **validation**',
  TRUE
) ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title;

INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000038000001',
  '00000000-0000-4000-a000-000000000038',
  'Q1. What is machine learning?',
  'supervised',
  'machine learning',
  'feature',
  'algorithm',
  'B',
  'machine learning is a key concept in Machine Learning Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000038000002',
  '00000000-0000-4000-a000-000000000038',
  'Q2. Which option is most directly associated with dataset?',
  'reinforcement',
  'machine learning',
  'dataset',
  'validation',
  'C',
  'dataset is a key concept in Machine Learning Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000038000003',
  '00000000-0000-4000-a000-000000000038',
  'Q3. Which statement best describes feature?',
  'feature',
  'prediction',
  'underfitting',
  'clustering',
  'A',
  'feature is a key concept in Machine Learning Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000038000004',
  '00000000-0000-4000-a000-000000000038',
  'Q4. In this topic, what does label refer to?',
  'validation',
  'dataset',
  'inference',
  'label',
  'D',
  'label is a key concept in Machine Learning Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000038000005',
  '00000000-0000-4000-a000-000000000038',
  'Q5. What is training?',
  'algorithm',
  'training',
  'label',
  'accuracy',
  'B',
  'training is a key concept in Machine Learning Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000038000006',
  '00000000-0000-4000-a000-000000000038',
  'Q6. Which option is most directly associated with validation?',
  'inference',
  'validation',
  'classification',
  'machine learning',
  'B',
  'validation is a key concept in Machine Learning Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000038000007',
  '00000000-0000-4000-a000-000000000038',
  'Q7. Which statement best describes test?',
  'classification',
  'overfitting',
  'inference',
  'test',
  'D',
  'test is a key concept in Machine Learning Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000038000008',
  '00000000-0000-4000-a000-000000000038',
  'Q8. In this topic, what does supervised refer to?',
  'classification',
  'label',
  'supervised',
  'underfitting',
  'C',
  'supervised is a key concept in Machine Learning Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000038000009',
  '00000000-0000-4000-a000-000000000038',
  'Q9. What is unsupervised?',
  'algorithm',
  'unsupervised',
  'machine learning',
  'test',
  'B',
  'unsupervised is a key concept in Machine Learning Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000038000010',
  '00000000-0000-4000-a000-000000000038',
  'Q10. Which option is most directly associated with reinforcement?',
  'reinforcement',
  'unsupervised',
  'algorithm',
  'model',
  'A',
  'reinforcement is a key concept in Machine Learning Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000038000011',
  '00000000-0000-4000-a000-000000000038',
  'Q11. Which statement best describes classification?',
  'unsupervised',
  'machine learning',
  'supervised',
  'classification',
  'D',
  'classification is a key concept in Machine Learning Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000038000012',
  '00000000-0000-4000-a000-000000000038',
  'Q12. In this topic, what does regression refer to?',
  'supervised',
  'regression',
  'inference',
  'classification',
  'B',
  'regression is a key concept in Machine Learning Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000038000013',
  '00000000-0000-4000-a000-000000000038',
  'Q13. What is clustering?',
  'test',
  'training',
  'clustering',
  'machine learning',
  'C',
  'clustering is a key concept in Machine Learning Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000038000014',
  '00000000-0000-4000-a000-000000000038',
  'Q14. Which option is most directly associated with model?',
  'reinforcement',
  'supervised',
  'underfitting',
  'model',
  'D',
  'model is a key concept in Machine Learning Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000038000015',
  '00000000-0000-4000-a000-000000000038',
  'Q15. Which statement best describes overfitting?',
  'classification',
  'overfitting',
  'test',
  'inference',
  'B',
  'overfitting is a key concept in Machine Learning Basics.'
) ON CONFLICT (id) DO NOTHING;

-- Quick Learn 39: Generative AI
INSERT INTO public.quick_learn_lessons (id, title, slug, branch, category, difficulty, estimated_minutes, is_recommended, fx_reward, short_description, content_markdown, is_published)
VALUES (
  '00000000-0000-4000-a000-000000000039',
  'Generative AI',
  'generative-ai',
  'ECE',
  'Electronics',
  'Intermediate',
  3,
  TRUE,
  10,
  'Master Generative AI fundamentals with quick reading and 15 practice MCQs on FEEDX.',
  '### Learning Text
Generative AI models create new content such as text, images, audio or code based on learned patterns. Outputs should be reviewed because models can produce incorrect or misleading results.

### Key Points
- **generative AI**
- **model**
- **prompt**
- **text**
- **image**
- **audio**',
  TRUE
) ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title;

INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000039000001',
  '00000000-0000-4000-a000-000000000039',
  'Q1. What is generative AI?',
  'fine-tuning',
  'evaluation',
  'context',
  'generative AI',
  'D',
  'generative AI is a key concept in Generative AI.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000039000002',
  '00000000-0000-4000-a000-000000000039',
  'Q2. Which option is most directly associated with model?',
  'hallucination',
  'inference',
  'generative AI',
  'model',
  'D',
  'model is a key concept in Generative AI.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000039000003',
  '00000000-0000-4000-a000-000000000039',
  'Q3. Which statement best describes prompt?',
  'image',
  'code',
  'token',
  'prompt',
  'D',
  'prompt is a key concept in Generative AI.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000039000004',
  '00000000-0000-4000-a000-000000000039',
  'Q4. In this topic, what does text refer to?',
  'text',
  'context',
  'generative AI',
  'generation',
  'A',
  'text is a key concept in Generative AI.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000039000005',
  '00000000-0000-4000-a000-000000000039',
  'Q5. What is image?',
  'training data',
  'inference',
  'model',
  'image',
  'D',
  'image is a key concept in Generative AI.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000039000006',
  '00000000-0000-4000-a000-000000000039',
  'Q6. Which option is most directly associated with audio?',
  'text',
  'audio',
  'prompt',
  'code',
  'B',
  'audio is a key concept in Generative AI.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000039000007',
  '00000000-0000-4000-a000-000000000039',
  'Q7. Which statement best describes code?',
  'safety',
  'code',
  'output',
  'generation',
  'B',
  'code is a key concept in Generative AI.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000039000008',
  '00000000-0000-4000-a000-000000000039',
  'Q8. In this topic, what does training data refer to?',
  'generative AI',
  'output',
  'training data',
  'generation',
  'C',
  'training data is a key concept in Generative AI.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000039000009',
  '00000000-0000-4000-a000-000000000039',
  'Q9. What is inference?',
  'inference',
  'token',
  'generative AI',
  'text',
  'A',
  'inference is a key concept in Generative AI.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000039000010',
  '00000000-0000-4000-a000-000000000039',
  'Q10. Which option is most directly associated with token?',
  'evaluation',
  'transformer',
  'text',
  'token',
  'D',
  'token is a key concept in Generative AI.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000039000011',
  '00000000-0000-4000-a000-000000000039',
  'Q11. Which statement best describes hallucination?',
  'training data',
  'generative AI',
  'multimodal',
  'hallucination',
  'D',
  'hallucination is a key concept in Generative AI.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000039000012',
  '00000000-0000-4000-a000-000000000039',
  'Q12. In this topic, what does context refer to?',
  'context',
  'code',
  'fine-tuning',
  'training data',
  'A',
  'context is a key concept in Generative AI.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000039000013',
  '00000000-0000-4000-a000-000000000039',
  'Q13. What is transformer?',
  'output',
  'hallucination',
  'training data',
  'transformer',
  'D',
  'transformer is a key concept in Generative AI.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000039000014',
  '00000000-0000-4000-a000-000000000039',
  'Q14. Which option is most directly associated with output?',
  'multimodal',
  'output',
  'prompt',
  'context',
  'B',
  'output is a key concept in Generative AI.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000039000015',
  '00000000-0000-4000-a000-000000000039',
  'Q15. Which statement best describes evaluation?',
  'text',
  'bias',
  'evaluation',
  'token',
  'C',
  'evaluation is a key concept in Generative AI.'
) ON CONFLICT (id) DO NOTHING;

-- Quick Learn 40: Prompt Engineering
INSERT INTO public.quick_learn_lessons (id, title, slug, branch, category, difficulty, estimated_minutes, is_recommended, fx_reward, short_description, content_markdown, is_published)
VALUES (
  '00000000-0000-4000-a000-000000000040',
  'Prompt Engineering',
  'prompt-engineering',
  'ECE',
  'Electronics',
  'Beginner',
  3,
  TRUE,
  10,
  'Master Prompt Engineering fundamentals with quick reading and 15 practice MCQs on FEEDX.',
  '### Learning Text
Prompt engineering involves designing clear instructions and context for AI systems. Useful prompts often specify the task, context, constraints, desired format and evaluation criteria.

### Key Points
- **prompt**
- **instruction**
- **context**
- **constraint**
- **role**
- **format**',
  TRUE
) ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title;

INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000040000001',
  '00000000-0000-4000-a000-000000000040',
  'Q1. What is prompt?',
  'evaluation',
  'constraint',
  'prompt',
  'model',
  'C',
  'prompt is a key concept in Prompt Engineering.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000040000002',
  '00000000-0000-4000-a000-000000000040',
  'Q2. Which option is most directly associated with instruction?',
  'output',
  'system instruction',
  'zero-shot',
  'instruction',
  'D',
  'instruction is a key concept in Prompt Engineering.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000040000003',
  '00000000-0000-4000-a000-000000000040',
  'Q3. Which statement best describes context?',
  'context',
  'grounding',
  'prompt',
  'model',
  'A',
  'context is a key concept in Prompt Engineering.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000040000004',
  '00000000-0000-4000-a000-000000000040',
  'Q4. In this topic, what does constraint refer to?',
  'constraint',
  'iteration',
  'few-shot',
  'instruction',
  'A',
  'constraint is a key concept in Prompt Engineering.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000040000005',
  '00000000-0000-4000-a000-000000000040',
  'Q5. What is role?',
  'prompt',
  'clarity',
  'role',
  'zero-shot',
  'C',
  'role is a key concept in Prompt Engineering.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000040000006',
  '00000000-0000-4000-a000-000000000040',
  'Q6. Which option is most directly associated with format?',
  'constraint',
  'format',
  'temperature',
  'model',
  'B',
  'format is a key concept in Prompt Engineering.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000040000007',
  '00000000-0000-4000-a000-000000000040',
  'Q7. Which statement best describes example?',
  'example',
  'output',
  'prompt engineering',
  'context',
  'A',
  'example is a key concept in Prompt Engineering.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000040000008',
  '00000000-0000-4000-a000-000000000040',
  'Q8. In this topic, what does few-shot refer to?',
  'format',
  'few-shot',
  'clarity',
  'delimiter',
  'B',
  'few-shot is a key concept in Prompt Engineering.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000040000009',
  '00000000-0000-4000-a000-000000000040',
  'Q9. What is zero-shot?',
  'prompt',
  'constraint',
  'zero-shot',
  'clarity',
  'C',
  'zero-shot is a key concept in Prompt Engineering.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000040000010',
  '00000000-0000-4000-a000-000000000040',
  'Q10. Which option is most directly associated with output?',
  'example',
  'instruction',
  'temperature',
  'output',
  'D',
  'output is a key concept in Prompt Engineering.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000040000011',
  '00000000-0000-4000-a000-000000000040',
  'Q11. Which statement best describes evaluation?',
  'instruction',
  'format',
  'evaluation',
  'role',
  'C',
  'evaluation is a key concept in Prompt Engineering.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000040000012',
  '00000000-0000-4000-a000-000000000040',
  'Q12. In this topic, what does iteration refer to?',
  'zero-shot',
  'prompt',
  'delimiter',
  'iteration',
  'D',
  'iteration is a key concept in Prompt Engineering.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000040000013',
  '00000000-0000-4000-a000-000000000040',
  'Q13. What is clarity?',
  'specificity',
  'example',
  'clarity',
  'format',
  'C',
  'clarity is a key concept in Prompt Engineering.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000040000014',
  '00000000-0000-4000-a000-000000000040',
  'Q14. Which option is most directly associated with specificity?',
  'clarity',
  'constraint',
  'zero-shot',
  'specificity',
  'D',
  'specificity is a key concept in Prompt Engineering.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000040000015',
  '00000000-0000-4000-a000-000000000040',
  'Q15. Which statement best describes grounding?',
  'format',
  'clarity',
  'example',
  'grounding',
  'D',
  'grounding is a key concept in Prompt Engineering.'
) ON CONFLICT (id) DO NOTHING;

-- Quick Learn 41: Internet of Things
INSERT INTO public.quick_learn_lessons (id, title, slug, branch, category, difficulty, estimated_minutes, is_recommended, fx_reward, short_description, content_markdown, is_published)
VALUES (
  '00000000-0000-4000-a000-000000000041',
  'Internet of Things',
  'internet-of-things',
  'ECE',
  'Telecom',
  'Intermediate',
  3,
  TRUE,
  10,
  'Master Internet of Things fundamentals with quick reading and 15 practice MCQs on FEEDX.',
  '### Learning Text
IoT connects physical devices and sensors to networks so they can collect, exchange or act on data. IoT systems often include devices, connectivity, processing and applications.

### Key Points
- **IoT**
- **sensor**
- **device**
- **network**
- **gateway**
- **cloud**',
  TRUE
) ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title;

INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000041000001',
  '00000000-0000-4000-a000-000000000041',
  'Q1. What is IoT?',
  'network',
  'IoT',
  'actuator',
  'connectivity',
  'B',
  'IoT is a key concept in Internet of Things.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000041000002',
  '00000000-0000-4000-a000-000000000041',
  'Q2. Which option is most directly associated with sensor?',
  'firmware',
  'sensor',
  'gateway',
  'data',
  'B',
  'sensor is a key concept in Internet of Things.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000041000003',
  '00000000-0000-4000-a000-000000000041',
  'Q3. Which statement best describes device?',
  'application',
  'IoT',
  'monitoring',
  'device',
  'D',
  'device is a key concept in Internet of Things.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000041000004',
  '00000000-0000-4000-a000-000000000041',
  'Q4. In this topic, what does network refer to?',
  'device',
  'IoT',
  'edge',
  'network',
  'D',
  'network is a key concept in Internet of Things.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000041000005',
  '00000000-0000-4000-a000-000000000041',
  'Q5. What is gateway?',
  'embedded',
  'device',
  'monitoring',
  'gateway',
  'D',
  'gateway is a key concept in Internet of Things.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000041000006',
  '00000000-0000-4000-a000-000000000041',
  'Q6. Which option is most directly associated with cloud?',
  'cloud',
  'network',
  'edge',
  'monitoring',
  'A',
  'cloud is a key concept in Internet of Things.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000041000007',
  '00000000-0000-4000-a000-000000000041',
  'Q7. Which statement best describes edge?',
  'firmware',
  'monitoring',
  'MQTT',
  'edge',
  'D',
  'edge is a key concept in Internet of Things.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000041000008',
  '00000000-0000-4000-a000-000000000041',
  'Q8. In this topic, what does data refer to?',
  'actuator',
  'monitoring',
  'firmware',
  'data',
  'D',
  'data is a key concept in Internet of Things.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000041000009',
  '00000000-0000-4000-a000-000000000041',
  'Q9. What is actuator?',
  'actuator',
  'telemetry',
  'application',
  'gateway',
  'A',
  'actuator is a key concept in Internet of Things.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000041000010',
  '00000000-0000-4000-a000-000000000041',
  'Q10. Which option is most directly associated with telemetry?',
  'IoT',
  'telemetry',
  'automation',
  'firmware',
  'B',
  'telemetry is a key concept in Internet of Things.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000041000011',
  '00000000-0000-4000-a000-000000000041',
  'Q11. Which statement best describes protocol?',
  'connectivity',
  'sensor',
  'protocol',
  'automation',
  'C',
  'protocol is a key concept in Internet of Things.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000041000012',
  '00000000-0000-4000-a000-000000000041',
  'Q12. In this topic, what does MQTT refer to?',
  'IoT',
  'MQTT',
  'protocol',
  'network',
  'B',
  'MQTT is a key concept in Internet of Things.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000041000013',
  '00000000-0000-4000-a000-000000000041',
  'Q13. What is embedded?',
  'actuator',
  'embedded',
  'sensor',
  'IoT',
  'B',
  'embedded is a key concept in Internet of Things.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000041000014',
  '00000000-0000-4000-a000-000000000041',
  'Q14. Which option is most directly associated with automation?',
  'automation',
  'firmware',
  'embedded',
  'device',
  'A',
  'automation is a key concept in Internet of Things.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000041000015',
  '00000000-0000-4000-a000-000000000041',
  'Q15. Which statement best describes monitoring?',
  'gateway',
  'sensor',
  'connectivity',
  'monitoring',
  'D',
  'monitoring is a key concept in Internet of Things.'
) ON CONFLICT (id) DO NOTHING;

-- Quick Learn 42: Blockchain Basics
INSERT INTO public.quick_learn_lessons (id, title, slug, branch, category, difficulty, estimated_minutes, is_recommended, fx_reward, short_description, content_markdown, is_published)
VALUES (
  '00000000-0000-4000-a000-000000000042',
  'Blockchain Basics',
  'blockchain-basics',
  'EEE',
  'Electrical',
  'Intermediate',
  3,
  TRUE,
  10,
  'Master Blockchain Basics fundamentals with quick reading and 15 practice MCQs on FEEDX.',
  '### Learning Text
A blockchain is a distributed ledger in which records are grouped into blocks and linked using cryptographic techniques. Different blockchain systems use different consensus mechanisms.

### Key Points
- **blockchain**
- **block**
- **ledger**
- **transaction**
- **hash**
- **node**',
  TRUE
) ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title;

INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000042000001',
  '00000000-0000-4000-a000-000000000042',
  'Q1. What is blockchain?',
  'cryptography',
  'node',
  'blockchain',
  'transaction',
  'C',
  'blockchain is a key concept in Blockchain Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000042000002',
  '00000000-0000-4000-a000-000000000042',
  'Q2. Which option is most directly associated with block?',
  'proof of work',
  'decentralization',
  'transaction',
  'block',
  'D',
  'block is a key concept in Blockchain Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000042000003',
  '00000000-0000-4000-a000-000000000042',
  'Q3. Which statement best describes ledger?',
  'blockchain',
  'proof of work',
  'ledger',
  'hash',
  'C',
  'ledger is a key concept in Blockchain Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000042000004',
  '00000000-0000-4000-a000-000000000042',
  'Q4. In this topic, what does transaction refer to?',
  'transaction',
  'block',
  'proof of stake',
  'immutability',
  'A',
  'transaction is a key concept in Blockchain Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000042000005',
  '00000000-0000-4000-a000-000000000042',
  'Q5. What is hash?',
  'wallet',
  'hash',
  'consensus',
  'private key',
  'B',
  'hash is a key concept in Blockchain Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000042000006',
  '00000000-0000-4000-a000-000000000042',
  'Q6. Which option is most directly associated with node?',
  'node',
  'private key',
  'cryptography',
  'consensus',
  'A',
  'node is a key concept in Blockchain Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000042000007',
  '00000000-0000-4000-a000-000000000042',
  'Q7. Which statement best describes distributed?',
  'public key',
  'distributed',
  'transaction',
  'smart contract',
  'B',
  'distributed is a key concept in Blockchain Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000042000008',
  '00000000-0000-4000-a000-000000000042',
  'Q8. In this topic, what does consensus refer to?',
  'block',
  'node',
  'consensus',
  'wallet',
  'C',
  'consensus is a key concept in Blockchain Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000042000009',
  '00000000-0000-4000-a000-000000000042',
  'Q9. What is proof of work?',
  'verification',
  'ledger',
  'proof of work',
  'chain',
  'C',
  'proof of work is a key concept in Blockchain Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000042000010',
  '00000000-0000-4000-a000-000000000042',
  'Q10. Which option is most directly associated with proof of stake?',
  'ledger',
  'public key',
  'proof of stake',
  'private key',
  'C',
  'proof of stake is a key concept in Blockchain Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000042000011',
  '00000000-0000-4000-a000-000000000042',
  'Q11. Which statement best describes wallet?',
  'wallet',
  'verification',
  'chain',
  'smart contract',
  'A',
  'wallet is a key concept in Blockchain Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000042000012',
  '00000000-0000-4000-a000-000000000042',
  'Q12. In this topic, what does public key refer to?',
  'public key',
  'node',
  'decentralization',
  'block',
  'A',
  'public key is a key concept in Blockchain Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000042000013',
  '00000000-0000-4000-a000-000000000042',
  'Q13. What is private key?',
  'private key',
  'decentralization',
  'public key',
  'chain',
  'A',
  'private key is a key concept in Blockchain Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000042000014',
  '00000000-0000-4000-a000-000000000042',
  'Q14. Which option is most directly associated with smart contract?',
  'blockchain',
  'proof of work',
  'smart contract',
  'wallet',
  'C',
  'smart contract is a key concept in Blockchain Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000042000015',
  '00000000-0000-4000-a000-000000000042',
  'Q15. Which statement best describes chain?',
  'decentralization',
  'consensus',
  'chain',
  'distributed',
  'C',
  'chain is a key concept in Blockchain Basics.'
) ON CONFLICT (id) DO NOTHING;

-- Quick Learn 43: Digital Electronics
INSERT INTO public.quick_learn_lessons (id, title, slug, branch, category, difficulty, estimated_minutes, is_recommended, fx_reward, short_description, content_markdown, is_published)
VALUES (
  '00000000-0000-4000-a000-000000000043',
  'Digital Electronics',
  'digital-electronics',
  'MECH',
  'Mechanical',
  'Intermediate',
  3,
  TRUE,
  10,
  'Master Digital Electronics fundamentals with quick reading and 15 practice MCQs on FEEDX.',
  '### Learning Text
Digital electronics represents information using discrete logic levels. Digital circuits use logic gates such as AND, OR and NOT to process binary signals.

### Key Points
- **digital**
- **binary**
- **logic gate**
- **AND**
- **OR**
- **NOT**',
  TRUE
) ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title;

INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000043000001',
  '00000000-0000-4000-a000-000000000043',
  'Q1. What is digital?',
  'flip-flop',
  'OR',
  'register',
  'digital',
  'D',
  'digital is a key concept in Digital Electronics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000043000002',
  '00000000-0000-4000-a000-000000000043',
  'Q2. Which option is most directly associated with binary?',
  'binary',
  'circuit',
  'AND',
  'counter',
  'A',
  'binary is a key concept in Digital Electronics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000043000003',
  '00000000-0000-4000-a000-000000000043',
  'Q3. Which statement best describes logic gate?',
  'bit',
  'logic gate',
  'counter',
  'truth table',
  'B',
  'logic gate is a key concept in Digital Electronics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000043000004',
  '00000000-0000-4000-a000-000000000043',
  'Q4. In this topic, what does AND refer to?',
  'binary',
  'NAND',
  'AND',
  'counter',
  'C',
  'AND is a key concept in Digital Electronics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000043000005',
  '00000000-0000-4000-a000-000000000043',
  'Q5. What is OR?',
  'signal',
  'combinational',
  'bit',
  'OR',
  'D',
  'OR is a key concept in Digital Electronics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000043000006',
  '00000000-0000-4000-a000-000000000043',
  'Q6. Which option is most directly associated with NOT?',
  'NOT',
  'signal',
  'AND',
  'logic level',
  'A',
  'NOT is a key concept in Digital Electronics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000043000007',
  '00000000-0000-4000-a000-000000000043',
  'Q7. Which statement best describes NAND?',
  'logic gate',
  'truth table',
  'AND',
  'NAND',
  'D',
  'NAND is a key concept in Digital Electronics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000043000008',
  '00000000-0000-4000-a000-000000000043',
  'Q8. In this topic, what does NOR refer to?',
  'NOR',
  'bit',
  'AND',
  'register',
  'A',
  'NOR is a key concept in Digital Electronics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000043000009',
  '00000000-0000-4000-a000-000000000043',
  'Q9. What is XOR?',
  'Boolean',
  'XOR',
  'AND',
  'OR',
  'B',
  'XOR is a key concept in Digital Electronics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000043000010',
  '00000000-0000-4000-a000-000000000043',
  'Q10. Which option is most directly associated with bit?',
  'circuit',
  'bit',
  'logic gate',
  'flip-flop',
  'B',
  'bit is a key concept in Digital Electronics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000043000011',
  '00000000-0000-4000-a000-000000000043',
  'Q11. Which statement best describes Boolean?',
  'circuit',
  'Boolean',
  'binary',
  'logic level',
  'B',
  'Boolean is a key concept in Digital Electronics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000043000012',
  '00000000-0000-4000-a000-000000000043',
  'Q12. In this topic, what does truth table refer to?',
  'truth table',
  'circuit',
  'NOR',
  'OR',
  'A',
  'truth table is a key concept in Digital Electronics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000043000013',
  '00000000-0000-4000-a000-000000000043',
  'Q13. What is flip-flop?',
  'NOR',
  'flip-flop',
  'truth table',
  'logic gate',
  'B',
  'flip-flop is a key concept in Digital Electronics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000043000014',
  '00000000-0000-4000-a000-000000000043',
  'Q14. Which option is most directly associated with register?',
  'OR',
  'NOT',
  'digital',
  'register',
  'D',
  'register is a key concept in Digital Electronics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000043000015',
  '00000000-0000-4000-a000-000000000043',
  'Q15. Which statement best describes counter?',
  'NOR',
  'Boolean',
  'NOT',
  'counter',
  'D',
  'counter is a key concept in Digital Electronics.'
) ON CONFLICT (id) DO NOTHING;

-- Quick Learn 44: Microcontrollers
INSERT INTO public.quick_learn_lessons (id, title, slug, branch, category, difficulty, estimated_minutes, is_recommended, fx_reward, short_description, content_markdown, is_published)
VALUES (
  '00000000-0000-4000-a000-000000000044',
  'Microcontrollers',
  'microcontrollers',
  'MECH',
  'Mechanical',
  'Intermediate',
  3,
  TRUE,
  10,
  'Master Microcontrollers fundamentals with quick reading and 15 practice MCQs on FEEDX.',
  '### Learning Text
A microcontroller is an integrated circuit containing a processor, memory and peripherals for controlling embedded systems. It is commonly programmed to read inputs and control outputs.

### Key Points
- **microcontroller**
- **CPU**
- **memory**
- **GPIO**
- **timer**
- **ADC**',
  TRUE
) ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title;

INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000044000001',
  '00000000-0000-4000-a000-000000000044',
  'Q1. What is microcontroller?',
  'program',
  'I2C',
  'peripheral',
  'microcontroller',
  'D',
  'microcontroller is a key concept in Microcontrollers.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000044000002',
  '00000000-0000-4000-a000-000000000044',
  'Q2. Which option is most directly associated with CPU?',
  'I2C',
  'CPU',
  'timer',
  'clock',
  'B',
  'CPU is a key concept in Microcontrollers.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000044000003',
  '00000000-0000-4000-a000-000000000044',
  'Q3. Which statement best describes memory?',
  'CPU',
  'I2C',
  'interrupt',
  'memory',
  'D',
  'memory is a key concept in Microcontrollers.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000044000004',
  '00000000-0000-4000-a000-000000000044',
  'Q4. In this topic, what does GPIO refer to?',
  'GPIO',
  'RAM',
  'program',
  'controller',
  'A',
  'GPIO is a key concept in Microcontrollers.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000044000005',
  '00000000-0000-4000-a000-000000000044',
  'Q5. What is timer?',
  'embedded',
  'SPI',
  'timer',
  'UART',
  'C',
  'timer is a key concept in Microcontrollers.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000044000006',
  '00000000-0000-4000-a000-000000000044',
  'Q6. Which option is most directly associated with ADC?',
  'microcontroller',
  'firmware',
  'CPU',
  'ADC',
  'D',
  'ADC is a key concept in Microcontrollers.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000044000007',
  '00000000-0000-4000-a000-000000000044',
  'Q7. Which statement best describes UART?',
  'I2C',
  'timer',
  'CPU',
  'UART',
  'D',
  'UART is a key concept in Microcontrollers.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000044000008',
  '00000000-0000-4000-a000-000000000044',
  'Q8. In this topic, what does SPI refer to?',
  'program',
  'SPI',
  'embedded',
  'clock',
  'B',
  'SPI is a key concept in Microcontrollers.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000044000009',
  '00000000-0000-4000-a000-000000000044',
  'Q9. What is I2C?',
  'firmware',
  'output',
  'input',
  'I2C',
  'D',
  'I2C is a key concept in Microcontrollers.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000044000010',
  '00000000-0000-4000-a000-000000000044',
  'Q10. Which option is most directly associated with interrupt?',
  'interrupt',
  'ADC',
  'RAM',
  'UART',
  'A',
  'interrupt is a key concept in Microcontrollers.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000044000011',
  '00000000-0000-4000-a000-000000000044',
  'Q11. Which statement best describes firmware?',
  'embedded',
  'I2C',
  'firmware',
  'GPIO',
  'C',
  'firmware is a key concept in Microcontrollers.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000044000012',
  '00000000-0000-4000-a000-000000000044',
  'Q12. In this topic, what does embedded refer to?',
  'embedded',
  'firmware',
  'I2C',
  'ADC',
  'A',
  'embedded is a key concept in Microcontrollers.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000044000013',
  '00000000-0000-4000-a000-000000000044',
  'Q13. What is input?',
  'UART',
  'memory',
  'ADC',
  'input',
  'D',
  'input is a key concept in Microcontrollers.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000044000014',
  '00000000-0000-4000-a000-000000000044',
  'Q14. Which option is most directly associated with output?',
  'flash',
  'output',
  'RAM',
  'timer',
  'B',
  'output is a key concept in Microcontrollers.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000044000015',
  '00000000-0000-4000-a000-000000000044',
  'Q15. Which statement best describes clock?',
  'clock',
  'SPI',
  'flash',
  'GPIO',
  'A',
  'clock is a key concept in Microcontrollers.'
) ON CONFLICT (id) DO NOTHING;

-- Quick Learn 45: Sensors & Embedded Systems
INSERT INTO public.quick_learn_lessons (id, title, slug, branch, category, difficulty, estimated_minutes, is_recommended, fx_reward, short_description, content_markdown, is_published)
VALUES (
  '00000000-0000-4000-a000-000000000045',
  'Sensors & Embedded Systems',
  'sensors-embedded-systems',
  'CIVIL',
  'Civil',
  'Beginner',
  3,
  TRUE,
  10,
  'Master Sensors & Embedded Systems fundamentals with quick reading and 15 practice MCQs on FEEDX.',
  '### Learning Text
Sensors detect physical conditions such as temperature, light or motion and convert them into signals. Embedded systems combine hardware and software to perform dedicated functions.

### Key Points
- **sensor**
- **embedded system**
- **temperature**
- **light**
- **motion**
- **signal**',
  TRUE
) ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title;

INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000045000001',
  '00000000-0000-4000-a000-000000000045',
  'Q1. What is sensor?',
  'application',
  'sensor',
  'output',
  'sampling',
  'B',
  'sensor is a key concept in Sensors & Embedded Systems.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000045000002',
  '00000000-0000-4000-a000-000000000045',
  'Q2. Which option is most directly associated with embedded system?',
  'embedded system',
  'power',
  'control',
  'sampling',
  'A',
  'embedded system is a key concept in Sensors & Embedded Systems.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000045000003',
  '00000000-0000-4000-a000-000000000045',
  'Q3. Which statement best describes temperature?',
  'communication',
  'application',
  'sensor',
  'temperature',
  'D',
  'temperature is a key concept in Sensors & Embedded Systems.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000045000004',
  '00000000-0000-4000-a000-000000000045',
  'Q4. In this topic, what does light refer to?',
  'microcontroller',
  'device',
  'motion',
  'light',
  'D',
  'light is a key concept in Sensors & Embedded Systems.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000045000005',
  '00000000-0000-4000-a000-000000000045',
  'Q5. What is motion?',
  'calibration',
  'motion',
  'control',
  'device',
  'B',
  'motion is a key concept in Sensors & Embedded Systems.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000045000006',
  '00000000-0000-4000-a000-000000000045',
  'Q6. Which option is most directly associated with signal?',
  'sensor',
  'communication',
  'signal',
  'embedded system',
  'C',
  'signal is a key concept in Sensors & Embedded Systems.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000045000007',
  '00000000-0000-4000-a000-000000000045',
  'Q7. Which statement best describes ADC?',
  'firmware',
  'temperature',
  'ADC',
  'sampling',
  'C',
  'ADC is a key concept in Sensors & Embedded Systems.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000045000008',
  '00000000-0000-4000-a000-000000000045',
  'Q8. In this topic, what does actuator refer to?',
  'sensor',
  'signal',
  'temperature',
  'actuator',
  'D',
  'actuator is a key concept in Sensors & Embedded Systems.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000045000009',
  '00000000-0000-4000-a000-000000000045',
  'Q9. What is microcontroller?',
  'motion',
  'microcontroller',
  'output',
  'calibration',
  'B',
  'microcontroller is a key concept in Sensors & Embedded Systems.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000045000010',
  '00000000-0000-4000-a000-000000000045',
  'Q10. Which option is most directly associated with firmware?',
  'temperature',
  'device',
  'firmware',
  'motion',
  'C',
  'firmware is a key concept in Sensors & Embedded Systems.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000045000011',
  '00000000-0000-4000-a000-000000000045',
  'Q11. Which statement best describes real-time?',
  'application',
  'real-time',
  'communication',
  'device',
  'B',
  'real-time is a key concept in Sensors & Embedded Systems.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000045000012',
  '00000000-0000-4000-a000-000000000045',
  'Q12. In this topic, what does input refer to?',
  'input',
  'sensor',
  'signal',
  'output',
  'A',
  'input is a key concept in Sensors & Embedded Systems.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000045000013',
  '00000000-0000-4000-a000-000000000045',
  'Q13. What is output?',
  'output',
  'application',
  'power',
  'communication',
  'A',
  'output is a key concept in Sensors & Embedded Systems.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000045000014',
  '00000000-0000-4000-a000-000000000045',
  'Q14. Which option is most directly associated with calibration?',
  'microcontroller',
  'embedded system',
  'calibration',
  'device',
  'C',
  'calibration is a key concept in Sensors & Embedded Systems.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000045000015',
  '00000000-0000-4000-a000-000000000045',
  'Q15. Which statement best describes sampling?',
  'temperature',
  'real-time',
  'application',
  'sampling',
  'D',
  'sampling is a key concept in Sensors & Embedded Systems.'
) ON CONFLICT (id) DO NOTHING;

-- Quick Learn 46: Cloud Storage
INSERT INTO public.quick_learn_lessons (id, title, slug, branch, category, difficulty, estimated_minutes, is_recommended, fx_reward, short_description, content_markdown, is_published)
VALUES (
  '00000000-0000-4000-a000-000000000046',
  'Cloud Storage',
  'cloud-storage',
  'MECH',
  'Design',
  'Intermediate',
  3,
  TRUE,
  10,
  'Master Cloud Storage fundamentals with quick reading and 15 practice MCQs on FEEDX.',
  '### Learning Text
Cloud storage stores data on remote infrastructure accessed through a network. Services commonly provide synchronization, sharing, backup and scalable capacity.

### Key Points
- **cloud storage**
- **object**
- **file**
- **bucket**
- **upload**
- **download**',
  TRUE
) ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title;

INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000046000001',
  '00000000-0000-4000-a000-000000000046',
  'Q1. What is cloud storage?',
  'region',
  'cloud storage',
  'data transfer',
  'bucket',
  'B',
  'cloud storage is a key concept in Cloud Storage.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000046000002',
  '00000000-0000-4000-a000-000000000046',
  'Q2. Which option is most directly associated with object?',
  'access control',
  'object',
  'storage class',
  'availability',
  'B',
  'object is a key concept in Cloud Storage.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000046000003',
  '00000000-0000-4000-a000-000000000046',
  'Q3. Which statement best describes file?',
  'access control',
  'file',
  'download',
  'scalability',
  'B',
  'file is a key concept in Cloud Storage.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000046000004',
  '00000000-0000-4000-a000-000000000046',
  'Q4. In this topic, what does bucket refer to?',
  'sync',
  'metadata',
  'bucket',
  'file',
  'C',
  'bucket is a key concept in Cloud Storage.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000046000005',
  '00000000-0000-4000-a000-000000000046',
  'Q5. What is upload?',
  'sharing',
  'upload',
  'backup',
  'storage class',
  'B',
  'upload is a key concept in Cloud Storage.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000046000006',
  '00000000-0000-4000-a000-000000000046',
  'Q6. Which option is most directly associated with download?',
  'metadata',
  'download',
  'versioning',
  'bucket',
  'B',
  'download is a key concept in Cloud Storage.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000046000007',
  '00000000-0000-4000-a000-000000000046',
  'Q7. Which statement best describes sync?',
  'sharing',
  'sync',
  'backup',
  'object',
  'B',
  'sync is a key concept in Cloud Storage.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000046000008',
  '00000000-0000-4000-a000-000000000046',
  'Q8. In this topic, what does backup refer to?',
  'bucket',
  'download',
  'backup',
  'sharing',
  'C',
  'backup is a key concept in Cloud Storage.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000046000009',
  '00000000-0000-4000-a000-000000000046',
  'Q9. What is sharing?',
  'file',
  'bucket',
  'redundancy',
  'sharing',
  'D',
  'sharing is a key concept in Cloud Storage.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000046000010',
  '00000000-0000-4000-a000-000000000046',
  'Q10. Which option is most directly associated with access control?',
  'storage class',
  'access control',
  'bucket',
  'cloud storage',
  'B',
  'access control is a key concept in Cloud Storage.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000046000011',
  '00000000-0000-4000-a000-000000000046',
  'Q11. Which statement best describes encryption?',
  'encryption',
  'backup',
  'versioning',
  'access control',
  'A',
  'encryption is a key concept in Cloud Storage.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000046000012',
  '00000000-0000-4000-a000-000000000046',
  'Q12. In this topic, what does redundancy refer to?',
  'encryption',
  'upload',
  'cloud storage',
  'redundancy',
  'D',
  'redundancy is a key concept in Cloud Storage.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000046000013',
  '00000000-0000-4000-a000-000000000046',
  'Q13. What is availability?',
  'lifecycle',
  'availability',
  'file',
  'versioning',
  'B',
  'availability is a key concept in Cloud Storage.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000046000014',
  '00000000-0000-4000-a000-000000000046',
  'Q14. Which option is most directly associated with scalability?',
  'availability',
  'scalability',
  'cloud storage',
  'lifecycle',
  'B',
  'scalability is a key concept in Cloud Storage.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000046000015',
  '00000000-0000-4000-a000-000000000046',
  'Q15. Which statement best describes storage class?',
  'bucket',
  'scalability',
  'versioning',
  'storage class',
  'D',
  'storage class is a key concept in Cloud Storage.'
) ON CONFLICT (id) DO NOTHING;

-- Quick Learn 47: SQL vs NoSQL
INSERT INTO public.quick_learn_lessons (id, title, slug, branch, category, difficulty, estimated_minutes, is_recommended, fx_reward, short_description, content_markdown, is_published)
VALUES (
  '00000000-0000-4000-a000-000000000047',
  'SQL vs NoSQL',
  'sql-vs-nosql',
  'CSE',
  'Management',
  'Beginner',
  3,
  TRUE,
  10,
  'Master SQL vs NoSQL fundamentals with quick reading and 15 practice MCQs on FEEDX.',
  '### Learning Text
Relational databases use structured tables and SQL. NoSQL is a broad category of databases using models such as document, key-value, wide-column or graph, often chosen for particular scalability or data-model needs.

### Key Points
- **SQL**
- **relational**
- **table**
- **row**
- **column**
- **schema**',
  TRUE
) ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title;

INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000047000001',
  '00000000-0000-4000-a000-000000000047',
  'Q1. What is SQL?',
  'table',
  'SQL',
  'graph',
  'data model',
  'B',
  'SQL is a key concept in SQL vs NoSQL.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000047000002',
  '00000000-0000-4000-a000-000000000047',
  'Q2. Which option is most directly associated with relational?',
  'key-value',
  'graph',
  'NoSQL',
  'relational',
  'D',
  'relational is a key concept in SQL vs NoSQL.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000047000003',
  '00000000-0000-4000-a000-000000000047',
  'Q3. Which statement best describes table?',
  'table',
  'index',
  'consistency',
  'transaction',
  'A',
  'table is a key concept in SQL vs NoSQL.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000047000004',
  '00000000-0000-4000-a000-000000000047',
  'Q4. In this topic, what does row refer to?',
  'schema',
  'row',
  'document',
  'table',
  'B',
  'row is a key concept in SQL vs NoSQL.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000047000005',
  '00000000-0000-4000-a000-000000000047',
  'Q5. What is column?',
  'database',
  'column',
  'graph',
  'wide-column',
  'B',
  'column is a key concept in SQL vs NoSQL.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000047000006',
  '00000000-0000-4000-a000-000000000047',
  'Q6. Which option is most directly associated with schema?',
  'index',
  'schema',
  'data model',
  'JOIN',
  'B',
  'schema is a key concept in SQL vs NoSQL.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000047000007',
  '00000000-0000-4000-a000-000000000047',
  'Q7. Which statement best describes NoSQL?',
  'row',
  'NoSQL',
  'SQL',
  'wide-column',
  'B',
  'NoSQL is a key concept in SQL vs NoSQL.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000047000008',
  '00000000-0000-4000-a000-000000000047',
  'Q8. In this topic, what does document refer to?',
  'consistency',
  'data model',
  'document',
  'NoSQL',
  'C',
  'document is a key concept in SQL vs NoSQL.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000047000009',
  '00000000-0000-4000-a000-000000000047',
  'Q9. What is key-value?',
  'JOIN',
  'key-value',
  'index',
  'graph',
  'B',
  'key-value is a key concept in SQL vs NoSQL.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000047000010',
  '00000000-0000-4000-a000-000000000047',
  'Q10. Which option is most directly associated with wide-column?',
  'relational',
  'JOIN',
  'wide-column',
  'scalability',
  'C',
  'wide-column is a key concept in SQL vs NoSQL.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000047000011',
  '00000000-0000-4000-a000-000000000047',
  'Q11. Which statement best describes graph?',
  'graph',
  'row',
  'document',
  'query',
  'A',
  'graph is a key concept in SQL vs NoSQL.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000047000012',
  '00000000-0000-4000-a000-000000000047',
  'Q12. In this topic, what does JOIN refer to?',
  'transaction',
  'schema',
  'database',
  'JOIN',
  'D',
  'JOIN is a key concept in SQL vs NoSQL.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000047000013',
  '00000000-0000-4000-a000-000000000047',
  'Q13. What is transaction?',
  'row',
  'query',
  'transaction',
  'scalability',
  'C',
  'transaction is a key concept in SQL vs NoSQL.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000047000014',
  '00000000-0000-4000-a000-000000000047',
  'Q14. Which option is most directly associated with scalability?',
  'transaction',
  'scalability',
  'schema',
  'row',
  'B',
  'scalability is a key concept in SQL vs NoSQL.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000047000015',
  '00000000-0000-4000-a000-000000000047',
  'Q15. Which statement best describes flexible schema?',
  'table',
  'SQL',
  'flexible schema',
  'relational',
  'C',
  'flexible schema is a key concept in SQL vs NoSQL.'
) ON CONFLICT (id) DO NOTHING;

-- Quick Learn 48: Mobile App Development
INSERT INTO public.quick_learn_lessons (id, title, slug, branch, category, difficulty, estimated_minutes, is_recommended, fx_reward, short_description, content_markdown, is_published)
VALUES (
  '00000000-0000-4000-a000-000000000048',
  'Mobile App Development',
  'mobile-app-development',
  'CSE',
  'Data Science',
  'Intermediate',
  3,
  TRUE,
  10,
  'Master Mobile App Development fundamentals with quick reading and 15 practice MCQs on FEEDX.',
  '### Learning Text
Mobile app development involves designing, building, testing and deploying applications for mobile devices. Native and cross-platform frameworks are common approaches.

### Key Points
- **mobile app**
- **Android**
- **iOS**
- **native**
- **cross-platform**
- **UI**',
  TRUE
) ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title;

INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000048000001',
  '00000000-0000-4000-a000-000000000048',
  'Q1. What is mobile app?',
  'build',
  'mobile app',
  'permissions',
  'iOS',
  'B',
  'mobile app is a key concept in Mobile App Development.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000048000002',
  '00000000-0000-4000-a000-000000000048',
  'Q2. Which option is most directly associated with Android?',
  'API',
  'Android',
  'cross-platform',
  'navigation',
  'B',
  'Android is a key concept in Mobile App Development.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000048000003',
  '00000000-0000-4000-a000-000000000048',
  'Q3. Which statement best describes iOS?',
  'cross-platform',
  'deployment',
  'API',
  'iOS',
  'D',
  'iOS is a key concept in Mobile App Development.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000048000004',
  '00000000-0000-4000-a000-000000000048',
  'Q4. In this topic, what does native refer to?',
  'cross-platform',
  'native',
  'permissions',
  'Android',
  'B',
  'native is a key concept in Mobile App Development.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000048000005',
  '00000000-0000-4000-a000-000000000048',
  'Q5. What is cross-platform?',
  'navigation',
  'cross-platform',
  'mobile app',
  'app lifecycle',
  'B',
  'cross-platform is a key concept in Mobile App Development.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000048000006',
  '00000000-0000-4000-a000-000000000048',
  'Q6. Which option is most directly associated with UI?',
  'testing',
  'UI',
  'local storage',
  'responsive',
  'B',
  'UI is a key concept in Mobile App Development.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000048000007',
  '00000000-0000-4000-a000-000000000048',
  'Q7. Which statement best describes navigation?',
  'notification',
  'deployment',
  'responsive',
  'navigation',
  'D',
  'navigation is a key concept in Mobile App Development.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000048000008',
  '00000000-0000-4000-a000-000000000048',
  'Q8. In this topic, what does API refer to?',
  'API',
  'notification',
  'permissions',
  'deployment',
  'A',
  'API is a key concept in Mobile App Development.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000048000009',
  '00000000-0000-4000-a000-000000000048',
  'Q9. What is local storage?',
  'local storage',
  'authentication',
  'store',
  'UI',
  'A',
  'local storage is a key concept in Mobile App Development.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000048000010',
  '00000000-0000-4000-a000-000000000048',
  'Q10. Which option is most directly associated with authentication?',
  'authentication',
  'performance',
  'app lifecycle',
  'cross-platform',
  'A',
  'authentication is a key concept in Mobile App Development.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000048000011',
  '00000000-0000-4000-a000-000000000048',
  'Q11. Which statement best describes notification?',
  'notification',
  'build',
  'permissions',
  'store',
  'A',
  'notification is a key concept in Mobile App Development.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000048000012',
  '00000000-0000-4000-a000-000000000048',
  'Q12. In this topic, what does testing refer to?',
  'testing',
  'navigation',
  'framework',
  'Android',
  'A',
  'testing is a key concept in Mobile App Development.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000048000013',
  '00000000-0000-4000-a000-000000000048',
  'Q13. What is deployment?',
  'cross-platform',
  'permissions',
  'deployment',
  'API',
  'C',
  'deployment is a key concept in Mobile App Development.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000048000014',
  '00000000-0000-4000-a000-000000000048',
  'Q14. Which option is most directly associated with responsive?',
  'mobile app',
  'responsive',
  'native',
  'Android',
  'B',
  'responsive is a key concept in Mobile App Development.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000048000015',
  '00000000-0000-4000-a000-000000000048',
  'Q15. Which statement best describes performance?',
  'notification',
  'mobile app',
  'permissions',
  'performance',
  'D',
  'performance is a key concept in Mobile App Development.'
) ON CONFLICT (id) DO NOTHING;

-- Quick Learn 49: UI/UX Design Basics
INSERT INTO public.quick_learn_lessons (id, title, slug, branch, category, difficulty, estimated_minutes, is_recommended, fx_reward, short_description, content_markdown, is_published)
VALUES (
  '00000000-0000-4000-a000-000000000049',
  'UI/UX Design Basics',
  'uiux-design-basics',
  'CSE',
  'Web3',
  'Advanced',
  3,
  TRUE,
  10,
  'Master UI/UX Design Basics fundamentals with quick reading and 15 practice MCQs on FEEDX.',
  '### Learning Text
UI design focuses on the visual interface and controls. UX design focuses on the overall experience, usability, user needs and interaction flow.

### Key Points
- **UI**
- **UX**
- **usability**
- **user**
- **wireframe**
- **prototype**',
  TRUE
) ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title;

INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000049000001',
  '00000000-0000-4000-a000-000000000049',
  'Q1. What is UI?',
  'spacing',
  'research',
  'component',
  'UI',
  'D',
  'UI is a key concept in UI/UX Design Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000049000002',
  '00000000-0000-4000-a000-000000000049',
  'Q2. Which option is most directly associated with UX?',
  'component',
  'hierarchy',
  'usability',
  'UX',
  'D',
  'UX is a key concept in UI/UX Design Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000049000003',
  '00000000-0000-4000-a000-000000000049',
  'Q3. Which statement best describes usability?',
  'usability',
  'UI',
  'typography',
  'design system',
  'A',
  'usability is a key concept in UI/UX Design Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000049000004',
  '00000000-0000-4000-a000-000000000049',
  'Q4. In this topic, what does user refer to?',
  'accessibility',
  'user',
  'consistency',
  'hierarchy',
  'B',
  'user is a key concept in UI/UX Design Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000049000005',
  '00000000-0000-4000-a000-000000000049',
  'Q5. What is wireframe?',
  'wireframe',
  'usability',
  'feedback',
  'spacing',
  'A',
  'wireframe is a key concept in UI/UX Design Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000049000006',
  '00000000-0000-4000-a000-000000000049',
  'Q6. Which option is most directly associated with prototype?',
  'spacing',
  'interaction',
  'prototype',
  'hierarchy',
  'C',
  'prototype is a key concept in UI/UX Design Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000049000007',
  '00000000-0000-4000-a000-000000000049',
  'Q7. Which statement best describes layout?',
  'user',
  'UI',
  'layout',
  'component',
  'C',
  'layout is a key concept in UI/UX Design Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000049000008',
  '00000000-0000-4000-a000-000000000049',
  'Q8. In this topic, what does typography refer to?',
  'typography',
  'feedback',
  'design system',
  'hierarchy',
  'A',
  'typography is a key concept in UI/UX Design Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000049000009',
  '00000000-0000-4000-a000-000000000049',
  'Q9. What is color?',
  'wireframe',
  'typography',
  'color',
  'layout',
  'C',
  'color is a key concept in UI/UX Design Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000049000010',
  '00000000-0000-4000-a000-000000000049',
  'Q10. Which option is most directly associated with spacing?',
  'research',
  'wireframe',
  'design system',
  'spacing',
  'D',
  'spacing is a key concept in UI/UX Design Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000049000011',
  '00000000-0000-4000-a000-000000000049',
  'Q11. Which statement best describes component?',
  'component',
  'design system',
  'feedback',
  'usability',
  'A',
  'component is a key concept in UI/UX Design Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000049000012',
  '00000000-0000-4000-a000-000000000049',
  'Q12. In this topic, what does navigation refer to?',
  'navigation',
  'feedback',
  'design system',
  'consistency',
  'A',
  'navigation is a key concept in UI/UX Design Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000049000013',
  '00000000-0000-4000-a000-000000000049',
  'Q13. What is accessibility?',
  'wireframe',
  'persona',
  'accessibility',
  'layout',
  'C',
  'accessibility is a key concept in UI/UX Design Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000049000014',
  '00000000-0000-4000-a000-000000000049',
  'Q14. Which option is most directly associated with feedback?',
  'user',
  'feedback',
  'design system',
  'hierarchy',
  'B',
  'feedback is a key concept in UI/UX Design Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.quick_learn_checks (id, lesson_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0001-4000-a000-000049000015',
  '00000000-0000-4000-a000-000000000049',
  'Q15. Which statement best describes consistency?',
  'spacing',
  'consistency',
  'accessibility',
  'user',
  'B',
  'consistency is a key concept in UI/UX Design Basics.'
) ON CONFLICT (id) DO NOTHING;

COMMIT;
