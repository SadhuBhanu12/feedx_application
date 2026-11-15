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


COMMIT;