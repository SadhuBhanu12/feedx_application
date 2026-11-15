-- ==============================================================================
-- FEEDX AUTHENTIC PDF SEED MIGRATION: QUIZZES
-- ==============================================================================

BEGIN;

TRUNCATE TABLE public.explore_quiz_attempts CASCADE;
TRUNCATE TABLE public.explore_quiz_questions CASCADE;
TRUNCATE TABLE public.explore_quizzes CASCADE;

-- Explore Quiz 01: GitHub & Git Basics Challenge Quiz
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
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000001000001',
  '00000000-0002-4000-a000-000000000001',
  1,
  'Q1. Which tool tracks changes in a project’s files?',
  'Git',
  'GitHub',
  'Docker',
  'SQL',
  'A',
  'Git is the version-control tool used to track changes.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000001000002',
  '00000000-0002-4000-a000-000000000001',
  2,
  'Q2. What is GitHub?',
  'A hosted platform for Git repositories and collaboration',
  'A programming language',
  'A database engine',
  'A computer network protocol',
  'A',
  'GitHub provides hosted repositories and collaboration features around Git.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000001000003',
  '00000000-0002-4000-a000-000000000001',
  3,
  'Q3. What does a Git commit represent?',
  'A saved change in repository history',
  'A remote server',
  'A programming language',
  'A network address',
  'A',
  'A commit records a set of changes in Git history.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000001000004',
  '00000000-0002-4000-a000-000000000001',
  4,
  'Q4. What is a branch used for?',
  'A separate line of development',
  'Encrypting a file',
  'Running a database',
  'Creating a network',
  'A',
  'Branches let developers work on separate lines of development.'
) ON CONFLICT (id) DO NOTHING;
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
  'Clone creates a local copy of a repository.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000001000006',
  '00000000-0002-4000-a000-000000000001',
  6,
  'Q6. What is a pull request?',
  'A proposal to merge changes',
  'A database query',
  'A password reset',
  'A cloud storage bucket',
  'A',
  'A pull request is used to propose and review changes before merging.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000001000007',
  '00000000-0002-4000-a000-000000000001',
  7,
  'Q7. What does git push do?',
  'Sends local commits to a remote repository',
  'Deletes commits',
  'Creates an HTML page',
  'Starts a firewall',
  'A',
  'Push transfers local commits to a configured remote.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000001000008',
  '00000000-0002-4000-a000-000000000001',
  8,
  'Q8. What does git pull commonly do?',
  'Fetches and integrates changes from a remote',
  'Formats a disk',
  'Creates a database',
  'Encrypts a password',
  'A',
  'Pull obtains remote changes and integrates them into the current branch.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000001000009',
  '00000000-0002-4000-a000-000000000001',
  9,
  'Q9. What is a repository?',
  'A location containing a project''s files and version history',
  'A network cable',
  'A browser',
  'A password',
  'A',
  'A repository contains project files and version-control history.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000001000010',
  '00000000-0002-4000-a000-000000000001',
  10,
  'Q10. What is GitHub Actions commonly used for?',
  'Automating workflows such as testing and deployment',
  'Writing SQL queries',
  'Drawing circuits',
  'Managing IP addresses',
  'A',
  'GitHub Actions automates repository workflows.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000001000011',
  '00000000-0002-4000-a000-000000000001',
  11,
  'Q11. What is a fork on GitHub?',
  'A personal copy of another repository on GitHub',
  'A local password',
  'A network protocol',
  'A compiler',
  'A',
  'A fork creates a separate copy of a repository under another account or organization.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000001000012',
  '00000000-0002-4000-a000-000000000001',
  12,
  'Q12. What does the staging area do in Git?',
  'Prepares selected changes for a commit',
  'Stores cloud backups',
  'Runs a web server',
  'Encrypts traffic',
  'A',
  'The staging area lets you choose changes to include in the next commit.'
) ON CONFLICT (id) DO NOTHING;
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
  'Git diff displays differences between file states.'
) ON CONFLICT (id) DO NOTHING;
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
  'Tags provide named references to particular commits, often releases.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000001000015',
  '00000000-0002-4000-a000-000000000001',
  15,
  'Q15. Why use version control?',
  'To track changes and collaborate safely',
  'To increase screen brightness',
  'To replace an operating system',
  'To compress videos',
  'A',
  'Version control tracks changes and supports collaboration and recovery.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000001000016',
  '00000000-0002-4000-a000-000000000001',
  16,
  'Q16. What is Git?',
  'pull request',
  'pull',
  'GitHub Actions',
  'version-control system',
  'D',
  'Git is associated with version-control system.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000001000017',
  '00000000-0002-4000-a000-000000000001',
  17,
  'Q17. Which option is most directly associated with GitHub?',
  'Git',
  'hosting and collaboration platform',
  'tag',
  'repository',
  'B',
  'GitHub is associated with hosting and collaboration platform.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000001000018',
  '00000000-0002-4000-a000-000000000001',
  18,
  'Q18. Which statement best describes repository?',
  'fork',
  'staging area',
  'commit',
  'project storage location',
  'D',
  'repository is associated with project storage location.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000001000019',
  '00000000-0002-4000-a000-000000000001',
  19,
  'Q19. In this topic, what does commit refer to?',
  'remote',
  'saved change in Git history',
  'clone',
  'README',
  'B',
  'commit is associated with saved change in Git history.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000001000020',
  '00000000-0002-4000-a000-000000000001',
  20,
  'Q20. What is branch?',
  'issue',
  'commit',
  'separate line of development',
  'clone',
  'C',
  'branch is associated with separate line of development.'
) ON CONFLICT (id) DO NOTHING;

-- Explore Quiz 02: APIs & How They Work Challenge Quiz
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
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000002000001',
  '00000000-0002-4000-a000-000000000002',
  1,
  'Q1. What is an API?',
  'An interface that lets software systems communicate',
  'A type of database',
  'A programming keyboard',
  'A graphics card',
  'A',
  'An API defines how software components communicate.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000002000002',
  '00000000-0002-4000-a000-000000000002',
  2,
  'Q2. What is an API endpoint?',
  'A specific address for an API resource or action',
  'A password',
  'A compiler',
  'A storage device',
  'A',
  'An endpoint is a defined API URL/address for a resource or operation.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000002000003',
  '00000000-0002-4000-a000-000000000002',
  3,
  'Q3. Which HTTP method commonly retrieves data?',
  'GET',
  'POST',
  'DELETE',
  'PATCH',
  'A',
  'GET is commonly used to retrieve resources.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000002000004',
  '00000000-0002-4000-a000-000000000002',
  4,
  'Q4. Which HTTP method commonly creates/submits data?',
  'POST',
  'GET',
  'HEAD',
  'OPTIONS',
  'A',
  'POST is commonly used to submit or create data.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000002000005',
  '00000000-0002-4000-a000-000000000002',
  5,
  'Q5. What is JSON?',
  'A structured data format commonly used by web APIs',
  'A network cable',
  'A CPU',
  'A firewall',
  'A',
  'JSON is a lightweight structured data format.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000002000006',
  '00000000-0002-4000-a000-000000000002',
  6,
  'Q6. What does an HTTP status code communicate?',
  'The outcome of a request',
  'A user''s password',
  'A database schema',
  'A screen resolution',
  'A',
  'Status codes indicate the result of an HTTP request.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000002000007',
  '00000000-0002-4000-a000-000000000002',
  7,
  'Q7. What is authentication?',
  'Verifying who a user or system is',
  'Choosing a UI color',
  'Compressing images',
  'Sorting a database',
  'A',
  'Authentication verifies identity.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000002000008',
  '00000000-0002-4000-a000-000000000002',
  8,
  'Q8. What is authorization?',
  'Determining what an authenticated user can access',
  'Verifying an IP cable',
  'Creating HTML',
  'Encrypting a monitor',
  'A',
  'Authorization controls permissions after identity is established.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000002000009',
  '00000000-0002-4000-a000-000000000002',
  9,
  'Q9. What is a request?',
  'A message sent by a client to a server',
  'A database table',
  'A programming language',
  'A hard disk',
  'A',
  'A request asks a server to perform an operation or return data.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000002000010',
  '00000000-0002-4000-a000-000000000002',
  10,
  'Q10. What is a response?',
  'A message returned by a server',
  'A Git branch',
  'A password manager',
  'A circuit',
  'A',
  'A server sends a response back to the client.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000002000011',
  '00000000-0002-4000-a000-000000000002',
  11,
  'Q11. What is an API key?',
  'A credential used by some APIs to identify or authorize a caller',
  'A keyboard key',
  'A database column',
  'A router port',
  'A',
  'Some APIs use API keys as credentials.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000002000012',
  '00000000-0002-4000-a000-000000000002',
  12,
  'Q12. What is rate limiting?',
  'Restricting how frequently requests can be made',
  'Encrypting all files',
  'Changing a domain name',
  'Creating a UI button',
  'A',
  'Rate limiting controls request frequency to protect services.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000002000013',
  '00000000-0002-4000-a000-000000000002',
  13,
  'Q13. What is an API header?',
  'Metadata sent with an HTTP request or response',
  'A database row',
  'A mobile screen',
  'A Git tag',
  'A',
  'Headers carry metadata such as content type or authorization.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000002000014',
  '00000000-0002-4000-a000-000000000002',
  14,
  'Q14. What is a webhook?',
  'A mechanism for sending event notifications to another service',
  'A password hash',
  'A CSS selector',
  'A database index',
  'A',
  'Webhooks notify another service when an event occurs.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000002000015',
  '00000000-0002-4000-a000-000000000002',
  15,
  'Q15. Why is API documentation important?',
  'It explains endpoints, inputs, outputs and usage',
  'It increases CPU speed',
  'It replaces testing',
  'It stores photos',
  'A',
  'Documentation tells developers how to correctly use an API.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000002000016',
  '00000000-0002-4000-a000-000000000002',
  16,
  'Q16. What is API?',
  'interface for software communication',
  'JSON',
  'request',
  'query parameter',
  'A',
  'API is associated with interface for software communication.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000002000017',
  '00000000-0002-4000-a000-000000000002',
  17,
  'Q17. Which option is most directly associated with endpoint?',
  'webhook',
  'address for a specific API resource/action',
  'rate limit',
  'REST',
  'B',
  'endpoint is associated with address for a specific API resource/action.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000002000018',
  '00000000-0002-4000-a000-000000000002',
  18,
  'Q18. Which statement best describes HTTP?',
  'response',
  'REST',
  'GET',
  'common protocol for web APIs',
  'D',
  'HTTP is associated with common protocol for web APIs.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000002000019',
  '00000000-0002-4000-a000-000000000002',
  19,
  'Q19. In this topic, what does request refer to?',
  'message sent by a client',
  'JSON',
  'webhook',
  'response',
  'A',
  'request is associated with message sent by a client.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000002000020',
  '00000000-0002-4000-a000-000000000002',
  20,
  'Q20. What is response?',
  'message returned by a server',
  'HTTP',
  'POST',
  'webhook',
  'A',
  'response is associated with message returned by a server.'
) ON CONFLICT (id) DO NOTHING;

-- Explore Quiz 03: Cloud Computing Challenge Quiz
INSERT INTO public.explore_quizzes (id, title, description, category, branch, difficulty, question_count, estimated_minutes, fx_reward, is_daily, is_published)
VALUES (
  '00000000-0002-4000-a000-000000000003',
  'Cloud Computing Challenge Quiz',
  'Test your knowledge on Cloud Computing with 20 comprehensive questions.',
  'Cloud',
  'CSE',
  'Beginner',
  20,
  8,
  15,
  FALSE,
  TRUE
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000003000001',
  '00000000-0002-4000-a000-000000000003',
  1,
  'Q1. What is cloud?',
  'public cloud',
  'cloud',
  'elasticity',
  'SaaS',
  'B',
  'cloud is a key concept in Cloud Computing.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000003000002',
  '00000000-0002-4000-a000-000000000003',
  2,
  'Q2. Which option is most directly associated with on-demand resources?',
  'on-demand resources',
  'server',
  'backup',
  'IaaS',
  'A',
  'on-demand resources is a key concept in Cloud Computing.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000003000003',
  '00000000-0002-4000-a000-000000000003',
  3,
  'Q3. Which statement best describes server?',
  'private cloud',
  'availability zone',
  'server',
  'IaaS',
  'C',
  'server is a key concept in Cloud Computing.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000003000004',
  '00000000-0002-4000-a000-000000000003',
  4,
  'Q4. In this topic, what does storage refer to?',
  'networking',
  'storage',
  'elasticity',
  'private cloud',
  'B',
  'storage is a key concept in Cloud Computing.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000003000005',
  '00000000-0002-4000-a000-000000000003',
  5,
  'Q5. What is database?',
  'database',
  'scalability',
  'networking',
  'on-demand resources',
  'A',
  'database is a key concept in Cloud Computing.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000003000006',
  '00000000-0002-4000-a000-000000000003',
  6,
  'Q6. Which option is most directly associated with networking?',
  'server',
  'IaaS',
  'storage',
  'networking',
  'D',
  'networking is a key concept in Cloud Computing.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000003000007',
  '00000000-0002-4000-a000-000000000003',
  7,
  'Q7. Which statement best describes scalability?',
  'elasticity',
  'managed service',
  'public cloud',
  'scalability',
  'D',
  'scalability is a key concept in Cloud Computing.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000003000008',
  '00000000-0002-4000-a000-000000000003',
  8,
  'Q8. In this topic, what does elasticity refer to?',
  'public cloud',
  'elasticity',
  'cloud',
  'region',
  'B',
  'elasticity is a key concept in Cloud Computing.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000003000009',
  '00000000-0002-4000-a000-000000000003',
  9,
  'Q9. What is IaaS?',
  'hybrid cloud',
  'networking',
  'IaaS',
  'database',
  'C',
  'IaaS is a key concept in Cloud Computing.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000003000010',
  '00000000-0002-4000-a000-000000000003',
  10,
  'Q10. Which option is most directly associated with PaaS?',
  'scalability',
  'networking',
  'PaaS',
  'private cloud',
  'C',
  'PaaS is a key concept in Cloud Computing.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000003000011',
  '00000000-0002-4000-a000-000000000003',
  11,
  'Q11. Which statement best describes SaaS?',
  'scalability',
  'cloud',
  'server',
  'SaaS',
  'D',
  'SaaS is a key concept in Cloud Computing.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000003000012',
  '00000000-0002-4000-a000-000000000003',
  12,
  'Q12. In this topic, what does public cloud refer to?',
  'cloud',
  'backup',
  'public cloud',
  'hybrid cloud',
  'C',
  'public cloud is a key concept in Cloud Computing.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000003000013',
  '00000000-0002-4000-a000-000000000003',
  13,
  'Q13. What is private cloud?',
  'on-demand resources',
  'networking',
  'server',
  'private cloud',
  'D',
  'private cloud is a key concept in Cloud Computing.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000003000014',
  '00000000-0002-4000-a000-000000000003',
  14,
  'Q14. Which option is most directly associated with hybrid cloud?',
  'elasticity',
  'hybrid cloud',
  'storage',
  'PaaS',
  'B',
  'hybrid cloud is a key concept in Cloud Computing.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000003000015',
  '00000000-0002-4000-a000-000000000003',
  15,
  'Q15. Which statement best describes region?',
  'database',
  'storage',
  'availability zone',
  'region',
  'D',
  'region is a key concept in Cloud Computing.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000003000016',
  '00000000-0002-4000-a000-000000000003',
  16,
  'Q16. What is cloud?',
  'cloud',
  'virtualization',
  'pay-as-you-go',
  'storage',
  'A',
  'cloud is a key concept in Cloud Computing.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000003000017',
  '00000000-0002-4000-a000-000000000003',
  17,
  'Q17. Which option is most directly associated with on-demand resources?',
  'on-demand resources',
  'database',
  'elasticity',
  'PaaS',
  'A',
  'on-demand resources is a key concept in Cloud Computing.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000003000018',
  '00000000-0002-4000-a000-000000000003',
  18,
  'Q18. Which statement best describes server?',
  'database',
  'server',
  'region',
  'public cloud',
  'B',
  'server is a key concept in Cloud Computing.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000003000019',
  '00000000-0002-4000-a000-000000000003',
  19,
  'Q19. In this topic, what does storage refer to?',
  'server',
  'public cloud',
  'SaaS',
  'storage',
  'D',
  'storage is a key concept in Cloud Computing.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000003000020',
  '00000000-0002-4000-a000-000000000003',
  20,
  'Q20. What is database?',
  'IaaS',
  'scalability',
  'database',
  'elasticity',
  'C',
  'database is a key concept in Cloud Computing.'
) ON CONFLICT (id) DO NOTHING;

-- Explore Quiz 04: Cybersecurity Basics Challenge Quiz
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
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000004000001',
  '00000000-0002-4000-a000-000000000004',
  1,
  'Q1. What is confidentiality?',
  'backup',
  'risk',
  'confidentiality',
  'incident response',
  'C',
  'confidentiality is a key concept in Cybersecurity Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000004000002',
  '00000000-0002-4000-a000-000000000004',
  2,
  'Q2. Which option is most directly associated with integrity?',
  'authentication',
  'integrity',
  'threat',
  'malware',
  'B',
  'integrity is a key concept in Cybersecurity Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000004000003',
  '00000000-0002-4000-a000-000000000004',
  3,
  'Q3. Which statement best describes availability?',
  'backup',
  'security policy',
  'MFA',
  'availability',
  'D',
  'availability is a key concept in Cybersecurity Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000004000004',
  '00000000-0002-4000-a000-000000000004',
  4,
  'Q4. In this topic, what does authentication refer to?',
  'authentication',
  'MFA',
  'encryption',
  'malware',
  'A',
  'authentication is a key concept in Cybersecurity Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000004000005',
  '00000000-0002-4000-a000-000000000004',
  5,
  'Q5. What is authorization?',
  'logging',
  'authorization',
  'malware',
  'incident response',
  'B',
  'authorization is a key concept in Cybersecurity Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000004000006',
  '00000000-0002-4000-a000-000000000004',
  6,
  'Q6. Which option is most directly associated with threat?',
  'patching',
  'firewall',
  'threat',
  'encryption',
  'C',
  'threat is a key concept in Cybersecurity Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000004000007',
  '00000000-0002-4000-a000-000000000004',
  7,
  'Q7. Which statement best describes vulnerability?',
  'malware',
  'authorization',
  'vulnerability',
  'confidentiality',
  'C',
  'vulnerability is a key concept in Cybersecurity Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000004000008',
  '00000000-0002-4000-a000-000000000004',
  8,
  'Q8. In this topic, what does risk refer to?',
  'vulnerability',
  'authentication',
  'risk',
  'least privilege',
  'C',
  'risk is a key concept in Cybersecurity Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000004000009',
  '00000000-0002-4000-a000-000000000004',
  9,
  'Q9. What is malware?',
  'encryption',
  'malware',
  'risk',
  'integrity',
  'B',
  'malware is a key concept in Cybersecurity Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000004000010',
  '00000000-0002-4000-a000-000000000004',
  10,
  'Q10. Which option is most directly associated with phishing?',
  'security policy',
  'risk',
  'malware',
  'phishing',
  'D',
  'phishing is a key concept in Cybersecurity Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000004000011',
  '00000000-0002-4000-a000-000000000004',
  11,
  'Q11. Which statement best describes firewall?',
  'firewall',
  'authorization',
  'phishing',
  'vulnerability',
  'A',
  'firewall is a key concept in Cybersecurity Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000004000012',
  '00000000-0002-4000-a000-000000000004',
  12,
  'Q12. In this topic, what does encryption refer to?',
  'encryption',
  'authentication',
  'risk',
  'authorization',
  'A',
  'encryption is a key concept in Cybersecurity Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000004000013',
  '00000000-0002-4000-a000-000000000004',
  13,
  'Q13. What is patching?',
  'threat',
  'confidentiality',
  'logging',
  'patching',
  'D',
  'patching is a key concept in Cybersecurity Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000004000014',
  '00000000-0002-4000-a000-000000000004',
  14,
  'Q14. Which option is most directly associated with MFA?',
  'MFA',
  'encryption',
  'authentication',
  'patching',
  'A',
  'MFA is a key concept in Cybersecurity Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000004000015',
  '00000000-0002-4000-a000-000000000004',
  15,
  'Q15. Which statement best describes least privilege?',
  'patching',
  'security policy',
  'authorization',
  'least privilege',
  'D',
  'least privilege is a key concept in Cybersecurity Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000004000016',
  '00000000-0002-4000-a000-000000000004',
  16,
  'Q16. What is confidentiality?',
  'logging',
  'confidentiality',
  'security awareness',
  'patching',
  'B',
  'confidentiality is a key concept in Cybersecurity Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000004000017',
  '00000000-0002-4000-a000-000000000004',
  17,
  'Q17. Which option is most directly associated with integrity?',
  'risk',
  'backup',
  'integrity',
  'malware',
  'C',
  'integrity is a key concept in Cybersecurity Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000004000018',
  '00000000-0002-4000-a000-000000000004',
  18,
  'Q18. Which statement best describes availability?',
  'authentication',
  'logging',
  'availability',
  'risk',
  'C',
  'availability is a key concept in Cybersecurity Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000004000019',
  '00000000-0002-4000-a000-000000000004',
  19,
  'Q19. In this topic, what does authentication refer to?',
  'authentication',
  'availability',
  'incident response',
  'firewall',
  'A',
  'authentication is a key concept in Cybersecurity Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000004000020',
  '00000000-0002-4000-a000-000000000004',
  20,
  'Q20. What is authorization?',
  'MFA',
  'confidentiality',
  'encryption',
  'authorization',
  'D',
  'authorization is a key concept in Cybersecurity Basics.'
) ON CONFLICT (id) DO NOTHING;

-- Explore Quiz 05: Linux Basics Challenge Quiz
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
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000005000001',
  '00000000-0002-4000-a000-000000000005',
  1,
  'Q1. What is kernel?',
  'terminal',
  'package manager',
  'kernel',
  'SSH',
  'C',
  'kernel is a key concept in Linux Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000005000002',
  '00000000-0002-4000-a000-000000000005',
  2,
  'Q2. Which option is most directly associated with shell?',
  'file system',
  'distribution',
  'shell',
  'kernel',
  'C',
  'shell is a key concept in Linux Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000005000003',
  '00000000-0002-4000-a000-000000000005',
  3,
  'Q3. Which statement best describes terminal?',
  'package manager',
  'SSH',
  'file system',
  'terminal',
  'D',
  'terminal is a key concept in Linux Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000005000004',
  '00000000-0002-4000-a000-000000000005',
  4,
  'Q4. In this topic, what does file system refer to?',
  'sudo',
  'file system',
  'permission',
  'kernel',
  'B',
  'file system is a key concept in Linux Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000005000005',
  '00000000-0002-4000-a000-000000000005',
  5,
  'Q5. What is process?',
  'process',
  'pipe',
  'process ID',
  'shell',
  'A',
  'process is a key concept in Linux Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000005000006',
  '00000000-0002-4000-a000-000000000005',
  6,
  'Q6. Which option is most directly associated with permission?',
  'command',
  'permission',
  'pipe',
  'shell',
  'B',
  'permission is a key concept in Linux Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000005000007',
  '00000000-0002-4000-a000-000000000005',
  7,
  'Q7. Which statement best describes root?',
  'root',
  'package manager',
  'permission',
  'environment variable',
  'A',
  'root is a key concept in Linux Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000005000008',
  '00000000-0002-4000-a000-000000000005',
  8,
  'Q8. In this topic, what does directory refer to?',
  'directory',
  'terminal',
  'file system',
  'distribution',
  'A',
  'directory is a key concept in Linux Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000005000009',
  '00000000-0002-4000-a000-000000000005',
  9,
  'Q9. What is command?',
  'sudo',
  'command',
  'root',
  'kernel',
  'B',
  'command is a key concept in Linux Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000005000010',
  '00000000-0002-4000-a000-000000000005',
  10,
  'Q10. Which option is most directly associated with package manager?',
  'package manager',
  'redirection',
  'sudo',
  'SSH',
  'A',
  'package manager is a key concept in Linux Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000005000011',
  '00000000-0002-4000-a000-000000000005',
  11,
  'Q11. Which statement best describes open source?',
  'open source',
  'redirection',
  'kernel',
  'terminal',
  'A',
  'open source is a key concept in Linux Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000005000012',
  '00000000-0002-4000-a000-000000000005',
  12,
  'Q12. In this topic, what does distribution refer to?',
  'file system',
  'distribution',
  'command',
  'redirection',
  'B',
  'distribution is a key concept in Linux Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000005000013',
  '00000000-0002-4000-a000-000000000005',
  13,
  'Q13. What is SSH?',
  'sudo',
  'log',
  'SSH',
  'root',
  'C',
  'SSH is a key concept in Linux Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000005000014',
  '00000000-0002-4000-a000-000000000005',
  14,
  'Q14. Which option is most directly associated with process ID?',
  'shell',
  'file system',
  'open source',
  'process ID',
  'D',
  'process ID is a key concept in Linux Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000005000015',
  '00000000-0002-4000-a000-000000000005',
  15,
  'Q15. Which statement best describes environment variable?',
  'package manager',
  'root',
  'file system',
  'environment variable',
  'D',
  'environment variable is a key concept in Linux Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000005000016',
  '00000000-0002-4000-a000-000000000005',
  16,
  'Q16. What is kernel?',
  'kernel',
  'log',
  'permission',
  'root',
  'A',
  'kernel is a key concept in Linux Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000005000017',
  '00000000-0002-4000-a000-000000000005',
  17,
  'Q17. Which option is most directly associated with shell?',
  'home directory',
  'redirection',
  'process ID',
  'shell',
  'D',
  'shell is a key concept in Linux Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000005000018',
  '00000000-0002-4000-a000-000000000005',
  18,
  'Q18. Which statement best describes terminal?',
  'home directory',
  'permission',
  'terminal',
  'command',
  'C',
  'terminal is a key concept in Linux Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000005000019',
  '00000000-0002-4000-a000-000000000005',
  19,
  'Q19. In this topic, what does file system refer to?',
  'package manager',
  'process',
  'file system',
  'directory',
  'C',
  'file system is a key concept in Linux Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000005000020',
  '00000000-0002-4000-a000-000000000005',
  20,
  'Q20. What is process?',
  'sudo',
  'environment variable',
  'redirection',
  'process',
  'D',
  'process is a key concept in Linux Basics.'
) ON CONFLICT (id) DO NOTHING;

-- Explore Quiz 06: Operating Systems Challenge Quiz
INSERT INTO public.explore_quizzes (id, title, description, category, branch, difficulty, question_count, estimated_minutes, fx_reward, is_daily, is_published)
VALUES (
  '00000000-0002-4000-a000-000000000006',
  'Operating Systems Challenge Quiz',
  'Test your knowledge on Operating Systems with 20 comprehensive questions.',
  'OS',
  'CSE',
  'Intermediate',
  20,
  8,
  15,
  FALSE,
  TRUE
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000006000001',
  '00000000-0002-4000-a000-000000000006',
  1,
  'Q1. What is process?',
  'boot',
  'process',
  'virtual memory',
  'memory management',
  'B',
  'process is a key concept in Operating Systems.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000006000002',
  '00000000-0002-4000-a000-000000000006',
  2,
  'Q2. Which option is most directly associated with thread?',
  'user interface',
  'file system',
  'boot',
  'thread',
  'D',
  'thread is a key concept in Operating Systems.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000006000003',
  '00000000-0002-4000-a000-000000000006',
  3,
  'Q3. Which statement best describes memory management?',
  'virtual memory',
  'memory management',
  'process',
  'boot',
  'B',
  'memory management is a key concept in Operating Systems.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000006000004',
  '00000000-0002-4000-a000-000000000006',
  4,
  'Q4. In this topic, what does file system refer to?',
  'system call',
  'file system',
  'boot',
  'process',
  'B',
  'file system is a key concept in Operating Systems.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000006000005',
  '00000000-0002-4000-a000-000000000006',
  5,
  'Q5. What is device driver?',
  'device driver',
  'scheduler',
  'deadlock',
  'kernel',
  'A',
  'device driver is a key concept in Operating Systems.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000006000006',
  '00000000-0002-4000-a000-000000000006',
  6,
  'Q6. Which option is most directly associated with kernel?',
  'kernel',
  'device driver',
  'virtual memory',
  'security',
  'A',
  'kernel is a key concept in Operating Systems.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000006000007',
  '00000000-0002-4000-a000-000000000006',
  7,
  'Q7. Which statement best describes scheduler?',
  'boot',
  'multitasking',
  'interrupt',
  'scheduler',
  'D',
  'scheduler is a key concept in Operating Systems.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000006000008',
  '00000000-0002-4000-a000-000000000006',
  8,
  'Q8. In this topic, what does user interface refer to?',
  'thread',
  'permissions',
  'user interface',
  'scheduler',
  'C',
  'user interface is a key concept in Operating Systems.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000006000009',
  '00000000-0002-4000-a000-000000000006',
  9,
  'Q9. What is permissions?',
  'kernel',
  'permissions',
  'process state',
  'user interface',
  'B',
  'permissions is a key concept in Operating Systems.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000006000010',
  '00000000-0002-4000-a000-000000000006',
  10,
  'Q10. Which option is most directly associated with virtual memory?',
  'virtual memory',
  'user interface',
  'file system',
  'storage',
  'A',
  'virtual memory is a key concept in Operating Systems.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000006000011',
  '00000000-0002-4000-a000-000000000006',
  11,
  'Q11. Which statement best describes multitasking?',
  'multitasking',
  'device driver',
  'resource management',
  'system call',
  'A',
  'multitasking is a key concept in Operating Systems.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000006000012',
  '00000000-0002-4000-a000-000000000006',
  12,
  'Q12. In this topic, what does boot refer to?',
  'networking',
  'boot',
  'system call',
  'storage',
  'B',
  'boot is a key concept in Operating Systems.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000006000013',
  '00000000-0002-4000-a000-000000000006',
  13,
  'Q13. What is interrupt?',
  'permissions',
  'virtual memory',
  'resource management',
  'interrupt',
  'D',
  'interrupt is a key concept in Operating Systems.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000006000014',
  '00000000-0002-4000-a000-000000000006',
  14,
  'Q14. Which option is most directly associated with resource management?',
  'resource management',
  'deadlock',
  'device driver',
  'multitasking',
  'A',
  'resource management is a key concept in Operating Systems.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000006000015',
  '00000000-0002-4000-a000-000000000006',
  15,
  'Q15. Which statement best describes system call?',
  'system call',
  'networking',
  'device driver',
  'resource management',
  'A',
  'system call is a key concept in Operating Systems.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000006000016',
  '00000000-0002-4000-a000-000000000006',
  16,
  'Q16. What is process?',
  'device driver',
  'user interface',
  'process',
  'permissions',
  'C',
  'process is a key concept in Operating Systems.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000006000017',
  '00000000-0002-4000-a000-000000000006',
  17,
  'Q17. Which option is most directly associated with thread?',
  'memory management',
  'security',
  'storage',
  'thread',
  'D',
  'thread is a key concept in Operating Systems.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000006000018',
  '00000000-0002-4000-a000-000000000006',
  18,
  'Q18. Which statement best describes memory management?',
  'scheduler',
  'kernel',
  'storage',
  'memory management',
  'D',
  'memory management is a key concept in Operating Systems.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000006000019',
  '00000000-0002-4000-a000-000000000006',
  19,
  'Q19. In this topic, what does file system refer to?',
  'process',
  'kernel',
  'file system',
  'virtual memory',
  'C',
  'file system is a key concept in Operating Systems.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000006000020',
  '00000000-0002-4000-a000-000000000006',
  20,
  'Q20. What is device driver?',
  'kernel',
  'device driver',
  'storage',
  'resource management',
  'B',
  'device driver is a key concept in Operating Systems.'
) ON CONFLICT (id) DO NOTHING;

-- Explore Quiz 07: Computer Networks Challenge Quiz
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
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000007000001',
  '00000000-0002-4000-a000-000000000007',
  1,
  'Q1. What is network?',
  'network',
  'LAN',
  'firewall',
  'latency',
  'A',
  'network is a key concept in Computer Networks.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000007000002',
  '00000000-0002-4000-a000-000000000007',
  2,
  'Q2. Which option is most directly associated with LAN?',
  'DNS',
  'port',
  'LAN',
  'switch',
  'C',
  'LAN is a key concept in Computer Networks.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000007000003',
  '00000000-0002-4000-a000-000000000007',
  3,
  'Q3. Which statement best describes WAN?',
  'gateway',
  'WAN',
  'topology',
  'routing',
  'B',
  'WAN is a key concept in Computer Networks.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000007000004',
  '00000000-0002-4000-a000-000000000007',
  4,
  'Q4. In this topic, what does router refer to?',
  'bandwidth',
  'topology',
  'router',
  'port',
  'C',
  'router is a key concept in Computer Networks.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000007000005',
  '00000000-0002-4000-a000-000000000007',
  5,
  'Q5. What is switch?',
  'port',
  'switch',
  'UDP',
  'router',
  'B',
  'switch is a key concept in Computer Networks.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000007000006',
  '00000000-0002-4000-a000-000000000007',
  6,
  'Q6. Which option is most directly associated with IP address?',
  'latency',
  'WAN',
  'IP address',
  'TCP',
  'C',
  'IP address is a key concept in Computer Networks.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000007000007',
  '00000000-0002-4000-a000-000000000007',
  7,
  'Q7. Which statement best describes MAC address?',
  'WAN',
  'firewall',
  'topology',
  'MAC address',
  'D',
  'MAC address is a key concept in Computer Networks.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000007000008',
  '00000000-0002-4000-a000-000000000007',
  8,
  'Q8. In this topic, what does protocol refer to?',
  'WAN',
  'IP address',
  'MAC address',
  'protocol',
  'D',
  'protocol is a key concept in Computer Networks.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000007000009',
  '00000000-0002-4000-a000-000000000007',
  9,
  'Q9. What is packet?',
  'IP address',
  'DNS',
  'WAN',
  'packet',
  'D',
  'packet is a key concept in Computer Networks.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000007000010',
  '00000000-0002-4000-a000-000000000007',
  10,
  'Q10. Which option is most directly associated with routing?',
  'packet',
  'protocol',
  'routing',
  'firewall',
  'C',
  'routing is a key concept in Computer Networks.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000007000011',
  '00000000-0002-4000-a000-000000000007',
  11,
  'Q11. Which statement best describes DNS?',
  'LAN',
  'DNS',
  'gateway',
  'WAN',
  'B',
  'DNS is a key concept in Computer Networks.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000007000012',
  '00000000-0002-4000-a000-000000000007',
  12,
  'Q12. In this topic, what does DHCP refer to?',
  'topology',
  'DHCP',
  'routing',
  'TCP',
  'B',
  'DHCP is a key concept in Computer Networks.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000007000013',
  '00000000-0002-4000-a000-000000000007',
  13,
  'Q13. What is TCP?',
  'TCP',
  'firewall',
  'UDP',
  'DHCP',
  'A',
  'TCP is a key concept in Computer Networks.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000007000014',
  '00000000-0002-4000-a000-000000000007',
  14,
  'Q14. Which option is most directly associated with UDP?',
  'WAN',
  'LAN',
  'UDP',
  'gateway',
  'C',
  'UDP is a key concept in Computer Networks.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000007000015',
  '00000000-0002-4000-a000-000000000007',
  15,
  'Q15. Which statement best describes port?',
  'switch',
  'IP address',
  'port',
  'router',
  'C',
  'port is a key concept in Computer Networks.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000007000016',
  '00000000-0002-4000-a000-000000000007',
  16,
  'Q16. What is network?',
  'firewall',
  'TCP',
  'UDP',
  'network',
  'D',
  'network is a key concept in Computer Networks.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000007000017',
  '00000000-0002-4000-a000-000000000007',
  17,
  'Q17. Which option is most directly associated with LAN?',
  'LAN',
  'TCP',
  'firewall',
  'protocol',
  'A',
  'LAN is a key concept in Computer Networks.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000007000018',
  '00000000-0002-4000-a000-000000000007',
  18,
  'Q18. Which statement best describes WAN?',
  'WAN',
  'firewall',
  'network',
  'LAN',
  'A',
  'WAN is a key concept in Computer Networks.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000007000019',
  '00000000-0002-4000-a000-000000000007',
  19,
  'Q19. In this topic, what does router refer to?',
  'LAN',
  'gateway',
  'port',
  'router',
  'D',
  'router is a key concept in Computer Networks.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000007000020',
  '00000000-0002-4000-a000-000000000007',
  20,
  'Q20. What is switch?',
  'UDP',
  'switch',
  'MAC address',
  'gateway',
  'B',
  'switch is a key concept in Computer Networks.'
) ON CONFLICT (id) DO NOTHING;

-- Explore Quiz 08: Internet & Web Challenge Quiz
INSERT INTO public.explore_quizzes (id, title, description, category, branch, difficulty, question_count, estimated_minutes, fx_reward, is_daily, is_published)
VALUES (
  '00000000-0002-4000-a000-000000000008',
  'Internet & Web Challenge Quiz',
  'Test your knowledge on Internet & Web with 20 comprehensive questions.',
  'Web Dev',
  'CSE',
  'Beginner',
  20,
  8,
  15,
  FALSE,
  TRUE
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000008000001',
  '00000000-0002-4000-a000-000000000008',
  1,
  'Q1. What is internet?',
  'response',
  'domain',
  'internet',
  'server',
  'C',
  'internet is a key concept in Internet & Web.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000008000002',
  '00000000-0002-4000-a000-000000000008',
  2,
  'Q2. Which option is most directly associated with web?',
  'IP address',
  'URL',
  'web',
  'browser',
  'C',
  'web is a key concept in Internet & Web.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000008000003',
  '00000000-0002-4000-a000-000000000008',
  3,
  'Q3. Which statement best describes browser?',
  'CSS',
  'server',
  'HTTPS',
  'browser',
  'D',
  'browser is a key concept in Internet & Web.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000008000004',
  '00000000-0002-4000-a000-000000000008',
  4,
  'Q4. In this topic, what does server refer to?',
  'response',
  'server',
  'web server',
  'CSS',
  'B',
  'server is a key concept in Internet & Web.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000008000005',
  '00000000-0002-4000-a000-000000000008',
  5,
  'Q5. What is URL?',
  'client',
  'web',
  'URL',
  'web server',
  'C',
  'URL is a key concept in Internet & Web.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000008000006',
  '00000000-0002-4000-a000-000000000008',
  6,
  'Q6. Which option is most directly associated with HTTP?',
  'URL',
  'response',
  'server',
  'HTTP',
  'D',
  'HTTP is a key concept in Internet & Web.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000008000007',
  '00000000-0002-4000-a000-000000000008',
  7,
  'Q7. Which statement best describes DNS?',
  'internet',
  'response',
  'DNS',
  'server',
  'C',
  'DNS is a key concept in Internet & Web.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000008000008',
  '00000000-0002-4000-a000-000000000008',
  8,
  'Q8. In this topic, what does HTML refer to?',
  'server',
  'cookie',
  'cache',
  'HTML',
  'D',
  'HTML is a key concept in Internet & Web.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000008000009',
  '00000000-0002-4000-a000-000000000008',
  9,
  'Q9. What is CSS?',
  'CSS',
  'cookie',
  'web server',
  'request',
  'A',
  'CSS is a key concept in Internet & Web.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000008000010',
  '00000000-0002-4000-a000-000000000008',
  10,
  'Q10. Which option is most directly associated with JavaScript?',
  'URL',
  'internet',
  'HTTP',
  'JavaScript',
  'D',
  'JavaScript is a key concept in Internet & Web.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000008000011',
  '00000000-0002-4000-a000-000000000008',
  11,
  'Q11. Which statement best describes client?',
  'cache',
  'client',
  'cookie',
  'domain',
  'B',
  'client is a key concept in Internet & Web.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000008000012',
  '00000000-0002-4000-a000-000000000008',
  12,
  'Q12. In this topic, what does request refer to?',
  'response',
  'HTML',
  'request',
  'browser',
  'C',
  'request is a key concept in Internet & Web.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000008000013',
  '00000000-0002-4000-a000-000000000008',
  13,
  'Q13. What is response?',
  'HTTPS',
  'response',
  'DNS',
  'URL',
  'B',
  'response is a key concept in Internet & Web.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000008000014',
  '00000000-0002-4000-a000-000000000008',
  14,
  'Q14. Which option is most directly associated with domain?',
  'HTML',
  'domain',
  'request',
  'internet',
  'B',
  'domain is a key concept in Internet & Web.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000008000015',
  '00000000-0002-4000-a000-000000000008',
  15,
  'Q15. Which statement best describes IP address?',
  'internet',
  'web',
  'IP address',
  'DNS',
  'C',
  'IP address is a key concept in Internet & Web.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000008000016',
  '00000000-0002-4000-a000-000000000008',
  16,
  'Q16. What is internet?',
  'IP address',
  'web server',
  'internet',
  'URL',
  'C',
  'internet is a key concept in Internet & Web.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000008000017',
  '00000000-0002-4000-a000-000000000008',
  17,
  'Q17. Which option is most directly associated with web?',
  'IP address',
  'cookie',
  'cache',
  'web',
  'D',
  'web is a key concept in Internet & Web.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000008000018',
  '00000000-0002-4000-a000-000000000008',
  18,
  'Q18. Which statement best describes browser?',
  'domain',
  'search engine',
  'browser',
  'web',
  'C',
  'browser is a key concept in Internet & Web.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000008000019',
  '00000000-0002-4000-a000-000000000008',
  19,
  'Q19. In this topic, what does server refer to?',
  'JavaScript',
  'server',
  'HTTP',
  'web',
  'B',
  'server is a key concept in Internet & Web.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000008000020',
  '00000000-0002-4000-a000-000000000008',
  20,
  'Q20. What is URL?',
  'response',
  'DNS',
  'URL',
  'cookie',
  'C',
  'URL is a key concept in Internet & Web.'
) ON CONFLICT (id) DO NOTHING;

-- Explore Quiz 09: HTML & CSS Challenge Quiz
INSERT INTO public.explore_quizzes (id, title, description, category, branch, difficulty, question_count, estimated_minutes, fx_reward, is_daily, is_published)
VALUES (
  '00000000-0002-4000-a000-000000000009',
  'HTML & CSS Challenge Quiz',
  'Test your knowledge on HTML & CSS with 20 comprehensive questions.',
  'Web Dev',
  'CSE',
  'Beginner',
  20,
  8,
  15,
  FALSE,
  TRUE
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000009000001',
  '00000000-0002-4000-a000-000000000009',
  1,
  'Q1. What is HTML?',
  'link',
  'property',
  'HTML',
  'value',
  'C',
  'HTML is a key concept in HTML & CSS.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000009000002',
  '00000000-0002-4000-a000-000000000009',
  2,
  'Q2. Which option is most directly associated with element?',
  'CSS',
  'tag',
  'element',
  'attribute',
  'C',
  'element is a key concept in HTML & CSS.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000009000003',
  '00000000-0002-4000-a000-000000000009',
  3,
  'Q3. Which statement best describes tag?',
  'HTML',
  'tag',
  'property',
  'selector',
  'B',
  'tag is a key concept in HTML & CSS.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000009000004',
  '00000000-0002-4000-a000-000000000009',
  4,
  'Q4. In this topic, what does attribute refer to?',
  'attribute',
  'selector',
  'CSS',
  'class',
  'A',
  'attribute is a key concept in HTML & CSS.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000009000005',
  '00000000-0002-4000-a000-000000000009',
  5,
  'Q5. What is heading?',
  'form',
  'heading',
  'attribute',
  'element',
  'B',
  'heading is a key concept in HTML & CSS.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000009000006',
  '00000000-0002-4000-a000-000000000009',
  6,
  'Q6. Which option is most directly associated with paragraph?',
  'responsive design',
  'paragraph',
  'id',
  'attribute',
  'B',
  'paragraph is a key concept in HTML & CSS.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000009000007',
  '00000000-0002-4000-a000-000000000009',
  7,
  'Q7. Which statement best describes link?',
  'selector',
  'link',
  'form',
  'id',
  'B',
  'link is a key concept in HTML & CSS.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000009000008',
  '00000000-0002-4000-a000-000000000009',
  8,
  'Q8. In this topic, what does image refer to?',
  'padding',
  'CSS',
  'image',
  'paragraph',
  'C',
  'image is a key concept in HTML & CSS.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000009000009',
  '00000000-0002-4000-a000-000000000009',
  9,
  'Q9. What is form?',
  'form',
  'link',
  'padding',
  'margin',
  'A',
  'form is a key concept in HTML & CSS.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000009000010',
  '00000000-0002-4000-a000-000000000009',
  10,
  'Q10. Which option is most directly associated with CSS?',
  'paragraph',
  'id',
  'link',
  'CSS',
  'D',
  'CSS is a key concept in HTML & CSS.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000009000011',
  '00000000-0002-4000-a000-000000000009',
  11,
  'Q11. Which statement best describes selector?',
  'responsive design',
  'selector',
  'value',
  'margin',
  'B',
  'selector is a key concept in HTML & CSS.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000009000012',
  '00000000-0002-4000-a000-000000000009',
  12,
  'Q12. In this topic, what does property refer to?',
  'id',
  'paragraph',
  'selector',
  'property',
  'D',
  'property is a key concept in HTML & CSS.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000009000013',
  '00000000-0002-4000-a000-000000000009',
  13,
  'Q13. What is value?',
  'class',
  'property',
  'margin',
  'value',
  'D',
  'value is a key concept in HTML & CSS.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000009000014',
  '00000000-0002-4000-a000-000000000009',
  14,
  'Q14. Which option is most directly associated with class?',
  'class',
  'box model',
  'attribute',
  'id',
  'A',
  'class is a key concept in HTML & CSS.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000009000015',
  '00000000-0002-4000-a000-000000000009',
  15,
  'Q15. Which statement best describes id?',
  'property',
  'id',
  'margin',
  'attribute',
  'B',
  'id is a key concept in HTML & CSS.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000009000016',
  '00000000-0002-4000-a000-000000000009',
  16,
  'Q16. What is HTML?',
  'value',
  'paragraph',
  'HTML',
  'selector',
  'C',
  'HTML is a key concept in HTML & CSS.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000009000017',
  '00000000-0002-4000-a000-000000000009',
  17,
  'Q17. Which option is most directly associated with element?',
  'HTML',
  'padding',
  'element',
  'id',
  'C',
  'element is a key concept in HTML & CSS.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000009000018',
  '00000000-0002-4000-a000-000000000009',
  18,
  'Q18. Which statement best describes tag?',
  'CSS',
  'tag',
  'image',
  'box model',
  'B',
  'tag is a key concept in HTML & CSS.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000009000019',
  '00000000-0002-4000-a000-000000000009',
  19,
  'Q19. In this topic, what does attribute refer to?',
  'tag',
  'class',
  'attribute',
  'link',
  'C',
  'attribute is a key concept in HTML & CSS.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000009000020',
  '00000000-0002-4000-a000-000000000009',
  20,
  'Q20. What is heading?',
  'paragraph',
  'id',
  'heading',
  'selector',
  'C',
  'heading is a key concept in HTML & CSS.'
) ON CONFLICT (id) DO NOTHING;

-- Explore Quiz 10: JavaScript Basics Challenge Quiz
INSERT INTO public.explore_quizzes (id, title, description, category, branch, difficulty, question_count, estimated_minutes, fx_reward, is_daily, is_published)
VALUES (
  '00000000-0002-4000-a000-000000000010',
  'JavaScript Basics Challenge Quiz',
  'Test your knowledge on JavaScript Basics with 20 comprehensive questions.',
  'Programming',
  'CSE',
  'Beginner',
  20,
  8,
  15,
  FALSE,
  TRUE
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000010000001',
  '00000000-0002-4000-a000-000000000010',
  1,
  'Q1. What is JavaScript?',
  'loop',
  'number',
  'JavaScript',
  'promise',
  'C',
  'JavaScript is a key concept in JavaScript Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000010000002',
  '00000000-0002-4000-a000-000000000010',
  2,
  'Q2. Which option is most directly associated with variable?',
  'callback',
  'boolean',
  'event',
  'variable',
  'D',
  'variable is a key concept in JavaScript Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000010000003',
  '00000000-0002-4000-a000-000000000010',
  3,
  'Q3. Which statement best describes function?',
  'loop',
  'number',
  'operator',
  'function',
  'D',
  'function is a key concept in JavaScript Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000010000004',
  '00000000-0002-4000-a000-000000000010',
  4,
  'Q4. In this topic, what does array refer to?',
  'object',
  'boolean',
  'await',
  'array',
  'D',
  'array is a key concept in JavaScript Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000010000005',
  '00000000-0002-4000-a000-000000000010',
  5,
  'Q5. What is object?',
  'conditional',
  'scope',
  'object',
  'promise',
  'C',
  'object is a key concept in JavaScript Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000010000006',
  '00000000-0002-4000-a000-000000000010',
  6,
  'Q6. Which option is most directly associated with string?',
  'loop',
  'string',
  'scope',
  'operator',
  'B',
  'string is a key concept in JavaScript Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000010000007',
  '00000000-0002-4000-a000-000000000010',
  7,
  'Q7. Which statement best describes number?',
  'loop',
  'JavaScript',
  'number',
  'module',
  'C',
  'number is a key concept in JavaScript Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000010000008',
  '00000000-0002-4000-a000-000000000010',
  8,
  'Q8. In this topic, what does boolean refer to?',
  'scope',
  'function',
  'variable',
  'boolean',
  'D',
  'boolean is a key concept in JavaScript Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000010000009',
  '00000000-0002-4000-a000-000000000010',
  9,
  'Q9. What is event?',
  'scope',
  'function',
  'variable',
  'event',
  'D',
  'event is a key concept in JavaScript Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000010000010',
  '00000000-0002-4000-a000-000000000010',
  10,
  'Q10. Which option is most directly associated with DOM?',
  'DOM',
  'scope',
  'async',
  'module',
  'A',
  'DOM is a key concept in JavaScript Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000010000011',
  '00000000-0002-4000-a000-000000000010',
  11,
  'Q11. Which statement best describes scope?',
  'operator',
  'scope',
  'loop',
  'promise',
  'B',
  'scope is a key concept in JavaScript Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000010000012',
  '00000000-0002-4000-a000-000000000010',
  12,
  'Q12. In this topic, what does promise refer to?',
  'function',
  'promise',
  'callback',
  'DOM',
  'B',
  'promise is a key concept in JavaScript Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000010000013',
  '00000000-0002-4000-a000-000000000010',
  13,
  'Q13. What is async?',
  'conditional',
  'object',
  'async',
  'number',
  'C',
  'async is a key concept in JavaScript Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000010000014',
  '00000000-0002-4000-a000-000000000010',
  14,
  'Q14. Which option is most directly associated with await?',
  'await',
  'event',
  'async',
  'string',
  'A',
  'await is a key concept in JavaScript Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000010000015',
  '00000000-0002-4000-a000-000000000010',
  15,
  'Q15. Which statement best describes callback?',
  'DOM',
  'loop',
  'conditional',
  'callback',
  'D',
  'callback is a key concept in JavaScript Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000010000016',
  '00000000-0002-4000-a000-000000000010',
  16,
  'Q16. What is JavaScript?',
  'loop',
  'object',
  'JavaScript',
  'scope',
  'C',
  'JavaScript is a key concept in JavaScript Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000010000017',
  '00000000-0002-4000-a000-000000000010',
  17,
  'Q17. Which option is most directly associated with variable?',
  'variable',
  'function',
  'boolean',
  'promise',
  'A',
  'variable is a key concept in JavaScript Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000010000018',
  '00000000-0002-4000-a000-000000000010',
  18,
  'Q18. Which statement best describes function?',
  'JavaScript',
  'async',
  'function',
  'array',
  'C',
  'function is a key concept in JavaScript Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000010000019',
  '00000000-0002-4000-a000-000000000010',
  19,
  'Q19. In this topic, what does array refer to?',
  'function',
  'promise',
  'array',
  'callback',
  'C',
  'array is a key concept in JavaScript Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000010000020',
  '00000000-0002-4000-a000-000000000010',
  20,
  'Q20. What is object?',
  'array',
  'string',
  'object',
  'callback',
  'C',
  'object is a key concept in JavaScript Basics.'
) ON CONFLICT (id) DO NOTHING;

-- Explore Quiz 11: Python Basics Challenge Quiz
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
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000011000001',
  '00000000-0002-4000-a000-000000000011',
  1,
  'Q1. What is Python?',
  'exception',
  'module',
  'Python',
  'loop',
  'C',
  'Python is a key concept in Python Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000011000002',
  '00000000-0002-4000-a000-000000000011',
  2,
  'Q2. Which option is most directly associated with variable?',
  'class',
  'indentation',
  'Python',
  'variable',
  'D',
  'variable is a key concept in Python Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000011000003',
  '00000000-0002-4000-a000-000000000011',
  3,
  'Q3. Which statement best describes function?',
  'class',
  'exception',
  'function',
  'library',
  'C',
  'function is a key concept in Python Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000011000004',
  '00000000-0002-4000-a000-000000000011',
  4,
  'Q4. In this topic, what does list refer to?',
  'list',
  'Python',
  'conditional',
  'pip',
  'A',
  'list is a key concept in Python Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000011000005',
  '00000000-0002-4000-a000-000000000011',
  5,
  'Q5. What is tuple?',
  'tuple',
  'class',
  'function',
  'conditional',
  'A',
  'tuple is a key concept in Python Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000011000006',
  '00000000-0002-4000-a000-000000000011',
  6,
  'Q6. Which option is most directly associated with dictionary?',
  'exception',
  'dictionary',
  'library',
  'Python',
  'B',
  'dictionary is a key concept in Python Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000011000007',
  '00000000-0002-4000-a000-000000000011',
  7,
  'Q7. Which statement best describes set?',
  'variable',
  'set',
  'module',
  'string',
  'B',
  'set is a key concept in Python Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000011000008',
  '00000000-0002-4000-a000-000000000011',
  8,
  'Q8. In this topic, what does string refer to?',
  'list',
  'string',
  'conditional',
  'object',
  'B',
  'string is a key concept in Python Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000011000009',
  '00000000-0002-4000-a000-000000000011',
  9,
  'Q9. What is loop?',
  'file',
  'tuple',
  'loop',
  'Python',
  'C',
  'loop is a key concept in Python Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000011000010',
  '00000000-0002-4000-a000-000000000011',
  10,
  'Q10. Which option is most directly associated with conditional?',
  'Python',
  'pip',
  'module',
  'conditional',
  'D',
  'conditional is a key concept in Python Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000011000011',
  '00000000-0002-4000-a000-000000000011',
  11,
  'Q11. Which statement best describes module?',
  'interpreter',
  'variable',
  'conditional',
  'module',
  'D',
  'module is a key concept in Python Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000011000012',
  '00000000-0002-4000-a000-000000000011',
  12,
  'Q12. In this topic, what does package refer to?',
  'Python',
  'dictionary',
  'set',
  'package',
  'D',
  'package is a key concept in Python Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000011000013',
  '00000000-0002-4000-a000-000000000011',
  13,
  'Q13. What is exception?',
  'object',
  'loop',
  'Python',
  'exception',
  'D',
  'exception is a key concept in Python Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000011000014',
  '00000000-0002-4000-a000-000000000011',
  14,
  'Q14. Which option is most directly associated with indentation?',
  'string',
  'indentation',
  'interpreter',
  'pip',
  'B',
  'indentation is a key concept in Python Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000011000015',
  '00000000-0002-4000-a000-000000000011',
  15,
  'Q15. Which statement best describes class?',
  'variable',
  'class',
  'interpreter',
  'conditional',
  'B',
  'class is a key concept in Python Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000011000016',
  '00000000-0002-4000-a000-000000000011',
  16,
  'Q16. What is Python?',
  'Python',
  'module',
  'indentation',
  'variable',
  'A',
  'Python is a key concept in Python Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000011000017',
  '00000000-0002-4000-a000-000000000011',
  17,
  'Q17. Which option is most directly associated with variable?',
  'library',
  'variable',
  'pip',
  'file',
  'B',
  'variable is a key concept in Python Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000011000018',
  '00000000-0002-4000-a000-000000000011',
  18,
  'Q18. Which statement best describes function?',
  'object',
  'function',
  'library',
  'module',
  'B',
  'function is a key concept in Python Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000011000019',
  '00000000-0002-4000-a000-000000000011',
  19,
  'Q19. In this topic, what does list refer to?',
  'indentation',
  'list',
  'variable',
  'library',
  'B',
  'list is a key concept in Python Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000011000020',
  '00000000-0002-4000-a000-000000000011',
  20,
  'Q20. What is tuple?',
  'tuple',
  'class',
  'string',
  'file',
  'A',
  'tuple is a key concept in Python Basics.'
) ON CONFLICT (id) DO NOTHING;

-- Explore Quiz 12: C Programming Challenge Quiz
INSERT INTO public.explore_quizzes (id, title, description, category, branch, difficulty, question_count, estimated_minutes, fx_reward, is_daily, is_published)
VALUES (
  '00000000-0002-4000-a000-000000000012',
  'C Programming Challenge Quiz',
  'Test your knowledge on C Programming with 20 comprehensive questions.',
  'Programming',
  'CSE',
  'Beginner',
  20,
  8,
  15,
  FALSE,
  TRUE
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000012000001',
  '00000000-0002-4000-a000-000000000012',
  1,
  'Q1. What is C?',
  'C',
  'stack',
  'structure',
  'printf',
  'A',
  'C is a key concept in C Programming.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000012000002',
  '00000000-0002-4000-a000-000000000012',
  2,
  'Q2. Which option is most directly associated with compiler?',
  'string',
  'variable',
  'compiler',
  'memory',
  'C',
  'compiler is a key concept in C Programming.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000012000003',
  '00000000-0002-4000-a000-000000000012',
  3,
  'Q3. Which statement best describes function?',
  'structure',
  'C',
  'function',
  'pointer',
  'C',
  'function is a key concept in C Programming.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000012000004',
  '00000000-0002-4000-a000-000000000012',
  4,
  'Q4. In this topic, what does variable refer to?',
  'stack',
  'C',
  'function',
  'variable',
  'D',
  'variable is a key concept in C Programming.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000012000005',
  '00000000-0002-4000-a000-000000000012',
  5,
  'Q5. What is array?',
  'printf',
  'array',
  'loop',
  'structure',
  'B',
  'array is a key concept in C Programming.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000012000006',
  '00000000-0002-4000-a000-000000000012',
  6,
  'Q6. Which option is most directly associated with pointer?',
  'source file',
  'address',
  'printf',
  'pointer',
  'D',
  'pointer is a key concept in C Programming.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000012000007',
  '00000000-0002-4000-a000-000000000012',
  7,
  'Q7. Which statement best describes structure?',
  'structure',
  'header',
  'compiler',
  'loop',
  'A',
  'structure is a key concept in C Programming.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000012000008',
  '00000000-0002-4000-a000-000000000012',
  8,
  'Q8. In this topic, what does header refer to?',
  'condition',
  'loop',
  'scanf',
  'header',
  'D',
  'header is a key concept in C Programming.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000012000009',
  '00000000-0002-4000-a000-000000000012',
  9,
  'Q9. What is source file?',
  'header',
  'source file',
  'memory',
  'printf',
  'B',
  'source file is a key concept in C Programming.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000012000010',
  '00000000-0002-4000-a000-000000000012',
  10,
  'Q10. Which option is most directly associated with main?',
  'address',
  'function',
  'loop',
  'main',
  'D',
  'main is a key concept in C Programming.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000012000011',
  '00000000-0002-4000-a000-000000000012',
  11,
  'Q11. Which statement best describes printf?',
  'printf',
  'array',
  'address',
  'compiler',
  'A',
  'printf is a key concept in C Programming.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000012000012',
  '00000000-0002-4000-a000-000000000012',
  12,
  'Q12. In this topic, what does scanf refer to?',
  'scanf',
  'main',
  'heap',
  'structure',
  'A',
  'scanf is a key concept in C Programming.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000012000013',
  '00000000-0002-4000-a000-000000000012',
  13,
  'Q13. What is memory?',
  'function',
  'memory',
  'scanf',
  'dereference',
  'B',
  'memory is a key concept in C Programming.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000012000014',
  '00000000-0002-4000-a000-000000000012',
  14,
  'Q14. Which option is most directly associated with address?',
  'array',
  'address',
  'printf',
  'variable',
  'B',
  'address is a key concept in C Programming.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000012000015',
  '00000000-0002-4000-a000-000000000012',
  15,
  'Q15. Which statement best describes dereference?',
  'dereference',
  'heap',
  'compiler',
  'scanf',
  'A',
  'dereference is a key concept in C Programming.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000012000016',
  '00000000-0002-4000-a000-000000000012',
  16,
  'Q16. What is C?',
  'source file',
  'pointer',
  'structure',
  'C',
  'D',
  'C is a key concept in C Programming.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000012000017',
  '00000000-0002-4000-a000-000000000012',
  17,
  'Q17. Which option is most directly associated with compiler?',
  'compiler',
  'pointer',
  'dereference',
  'header',
  'A',
  'compiler is a key concept in C Programming.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000012000018',
  '00000000-0002-4000-a000-000000000012',
  18,
  'Q18. Which statement best describes function?',
  'function',
  'address',
  'C',
  'array',
  'A',
  'function is a key concept in C Programming.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000012000019',
  '00000000-0002-4000-a000-000000000012',
  19,
  'Q19. In this topic, what does variable refer to?',
  'dereference',
  'compiler',
  'variable',
  'structure',
  'C',
  'variable is a key concept in C Programming.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000012000020',
  '00000000-0002-4000-a000-000000000012',
  20,
  'Q20. What is array?',
  'array',
  'loop',
  'memory',
  'printf',
  'A',
  'array is a key concept in C Programming.'
) ON CONFLICT (id) DO NOTHING;

-- Explore Quiz 13: Java Basics Challenge Quiz
INSERT INTO public.explore_quizzes (id, title, description, category, branch, difficulty, question_count, estimated_minutes, fx_reward, is_daily, is_published)
VALUES (
  '00000000-0002-4000-a000-000000000013',
  'Java Basics Challenge Quiz',
  'Test your knowledge on Java Basics with 20 comprehensive questions.',
  'Programming',
  'CSE',
  'Intermediate',
  20,
  8,
  15,
  FALSE,
  TRUE
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000013000001',
  '00000000-0002-4000-a000-000000000013',
  1,
  'Q1. What is Java?',
  'compiler',
  'Java',
  'static',
  'class',
  'B',
  'Java is a key concept in Java Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000013000002',
  '00000000-0002-4000-a000-000000000013',
  2,
  'Q2. Which option is most directly associated with JVM?',
  'JVM',
  'static',
  'array',
  'String',
  'A',
  'JVM is a key concept in Java Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000013000003',
  '00000000-0002-4000-a000-000000000013',
  3,
  'Q3. Which statement best describes class?',
  'bytecode',
  'constructor',
  'class',
  'exception',
  'C',
  'class is a key concept in Java Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000013000004',
  '00000000-0002-4000-a000-000000000013',
  4,
  'Q4. In this topic, what does object refer to?',
  'object',
  'class',
  'constructor',
  'polymorphism',
  'A',
  'object is a key concept in Java Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000013000005',
  '00000000-0002-4000-a000-000000000013',
  5,
  'Q5. What is method?',
  'method',
  'Java',
  'encapsulation',
  'inheritance',
  'A',
  'method is a key concept in Java Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000013000006',
  '00000000-0002-4000-a000-000000000013',
  6,
  'Q6. Which option is most directly associated with inheritance?',
  'inheritance',
  'final',
  'JVM',
  'encapsulation',
  'A',
  'inheritance is a key concept in Java Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000013000007',
  '00000000-0002-4000-a000-000000000013',
  7,
  'Q7. Which statement best describes encapsulation?',
  'encapsulation',
  'interface',
  'String',
  'method',
  'A',
  'encapsulation is a key concept in Java Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000013000008',
  '00000000-0002-4000-a000-000000000013',
  8,
  'Q8. In this topic, what does polymorphism refer to?',
  'final',
  'polymorphism',
  'object',
  'String',
  'B',
  'polymorphism is a key concept in Java Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000013000009',
  '00000000-0002-4000-a000-000000000013',
  9,
  'Q9. What is interface?',
  'encapsulation',
  'interface',
  'String',
  'static',
  'B',
  'interface is a key concept in Java Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000013000010',
  '00000000-0002-4000-a000-000000000013',
  10,
  'Q10. Which option is most directly associated with package?',
  'constructor',
  'inheritance',
  'array',
  'package',
  'D',
  'package is a key concept in Java Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000013000011',
  '00000000-0002-4000-a000-000000000013',
  11,
  'Q11. Which statement best describes exception?',
  'array',
  'exception',
  'object',
  'JVM',
  'B',
  'exception is a key concept in Java Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000013000012',
  '00000000-0002-4000-a000-000000000013',
  12,
  'Q12. In this topic, what does bytecode refer to?',
  'constructor',
  'method',
  'bytecode',
  'JDK',
  'C',
  'bytecode is a key concept in Java Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000013000013',
  '00000000-0002-4000-a000-000000000013',
  13,
  'Q13. What is compiler?',
  'JDK',
  'encapsulation',
  'compiler',
  'JVM',
  'C',
  'compiler is a key concept in Java Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000013000014',
  '00000000-0002-4000-a000-000000000013',
  14,
  'Q14. Which option is most directly associated with garbage collection?',
  'garbage collection',
  'compiler',
  'package',
  'class',
  'A',
  'garbage collection is a key concept in Java Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000013000015',
  '00000000-0002-4000-a000-000000000013',
  15,
  'Q15. Which statement best describes constructor?',
  'final',
  'JDK',
  'constructor',
  'encapsulation',
  'C',
  'constructor is a key concept in Java Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000013000016',
  '00000000-0002-4000-a000-000000000013',
  16,
  'Q16. What is Java?',
  'object',
  'method',
  'bytecode',
  'Java',
  'D',
  'Java is a key concept in Java Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000013000017',
  '00000000-0002-4000-a000-000000000013',
  17,
  'Q17. Which option is most directly associated with JVM?',
  'JVM',
  'polymorphism',
  'interface',
  'array',
  'A',
  'JVM is a key concept in Java Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000013000018',
  '00000000-0002-4000-a000-000000000013',
  18,
  'Q18. Which statement best describes class?',
  'Java',
  'class',
  'compiler',
  'exception',
  'B',
  'class is a key concept in Java Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000013000019',
  '00000000-0002-4000-a000-000000000013',
  19,
  'Q19. In this topic, what does object refer to?',
  'method',
  'package',
  'Java',
  'object',
  'D',
  'object is a key concept in Java Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000013000020',
  '00000000-0002-4000-a000-000000000013',
  20,
  'Q20. What is method?',
  'package',
  'static',
  'method',
  'bytecode',
  'C',
  'method is a key concept in Java Basics.'
) ON CONFLICT (id) DO NOTHING;

-- Explore Quiz 14: SQL & Databases Challenge Quiz
INSERT INTO public.explore_quizzes (id, title, description, category, branch, difficulty, question_count, estimated_minutes, fx_reward, is_daily, is_published)
VALUES (
  '00000000-0002-4000-a000-000000000014',
  'SQL & Databases Challenge Quiz',
  'Test your knowledge on SQL & Databases with 20 comprehensive questions.',
  'Databases',
  'CSE',
  'Intermediate',
  20,
  8,
  15,
  FALSE,
  TRUE
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000014000001',
  '00000000-0002-4000-a000-000000000014',
  1,
  'Q1. What is database?',
  'database',
  'row',
  'SELECT',
  'relational',
  'A',
  'database is a key concept in SQL & Databases.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000014000002',
  '00000000-0002-4000-a000-000000000014',
  2,
  'Q2. Which option is most directly associated with table?',
  'ORDER BY',
  'table',
  'row',
  'relational',
  'B',
  'table is a key concept in SQL & Databases.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000014000003',
  '00000000-0002-4000-a000-000000000014',
  3,
  'Q3. Which statement best describes row?',
  'primary key',
  'index',
  'row',
  'table',
  'C',
  'row is a key concept in SQL & Databases.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000014000004',
  '00000000-0002-4000-a000-000000000014',
  4,
  'Q4. In this topic, what does column refer to?',
  'GROUP BY',
  'DELETE',
  'column',
  'primary key',
  'C',
  'column is a key concept in SQL & Databases.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000014000005',
  '00000000-0002-4000-a000-000000000014',
  5,
  'Q5. What is primary key?',
  'UPDATE',
  'DELETE',
  'primary key',
  'SQL',
  'C',
  'primary key is a key concept in SQL & Databases.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000014000006',
  '00000000-0002-4000-a000-000000000014',
  6,
  'Q6. Which option is most directly associated with foreign key?',
  'table',
  'row',
  'SQL',
  'foreign key',
  'D',
  'foreign key is a key concept in SQL & Databases.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000014000007',
  '00000000-0002-4000-a000-000000000014',
  7,
  'Q7. Which statement best describes SELECT?',
  'DELETE',
  'row',
  'SELECT',
  'foreign key',
  'C',
  'SELECT is a key concept in SQL & Databases.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000014000008',
  '00000000-0002-4000-a000-000000000014',
  8,
  'Q8. In this topic, what does INSERT refer to?',
  'WHERE',
  'SQL',
  'schema',
  'INSERT',
  'D',
  'INSERT is a key concept in SQL & Databases.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000014000009',
  '00000000-0002-4000-a000-000000000014',
  9,
  'Q9. What is UPDATE?',
  'database',
  'UPDATE',
  'transaction',
  'ORDER BY',
  'B',
  'UPDATE is a key concept in SQL & Databases.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000014000010',
  '00000000-0002-4000-a000-000000000014',
  10,
  'Q10. Which option is most directly associated with DELETE?',
  'schema',
  'SELECT',
  'SQL',
  'DELETE',
  'D',
  'DELETE is a key concept in SQL & Databases.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000014000011',
  '00000000-0002-4000-a000-000000000014',
  11,
  'Q11. Which statement best describes WHERE?',
  'index',
  'relational',
  'primary key',
  'WHERE',
  'D',
  'WHERE is a key concept in SQL & Databases.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000014000012',
  '00000000-0002-4000-a000-000000000014',
  12,
  'Q12. In this topic, what does JOIN refer to?',
  'schema',
  'JOIN',
  'INSERT',
  'UPDATE',
  'B',
  'JOIN is a key concept in SQL & Databases.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000014000013',
  '00000000-0002-4000-a000-000000000014',
  13,
  'Q13. What is GROUP BY?',
  'GROUP BY',
  'table',
  'JOIN',
  'index',
  'A',
  'GROUP BY is a key concept in SQL & Databases.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000014000014',
  '00000000-0002-4000-a000-000000000014',
  14,
  'Q14. Which option is most directly associated with ORDER BY?',
  'relational',
  'foreign key',
  'ORDER BY',
  'GROUP BY',
  'C',
  'ORDER BY is a key concept in SQL & Databases.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000014000015',
  '00000000-0002-4000-a000-000000000014',
  15,
  'Q15. Which statement best describes index?',
  'index',
  'INSERT',
  'DELETE',
  'constraint',
  'A',
  'index is a key concept in SQL & Databases.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000014000016',
  '00000000-0002-4000-a000-000000000014',
  16,
  'Q16. What is database?',
  'column',
  'transaction',
  'table',
  'database',
  'D',
  'database is a key concept in SQL & Databases.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000014000017',
  '00000000-0002-4000-a000-000000000014',
  17,
  'Q17. Which option is most directly associated with table?',
  'DELETE',
  'table',
  'index',
  'relational',
  'B',
  'table is a key concept in SQL & Databases.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000014000018',
  '00000000-0002-4000-a000-000000000014',
  18,
  'Q18. Which statement best describes row?',
  'row',
  'constraint',
  'SQL',
  'GROUP BY',
  'A',
  'row is a key concept in SQL & Databases.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000014000019',
  '00000000-0002-4000-a000-000000000014',
  19,
  'Q19. In this topic, what does column refer to?',
  'relational',
  'SELECT',
  'transaction',
  'column',
  'D',
  'column is a key concept in SQL & Databases.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000014000020',
  '00000000-0002-4000-a000-000000000014',
  20,
  'Q20. What is primary key?',
  'INSERT',
  'primary key',
  'SQL',
  'constraint',
  'B',
  'primary key is a key concept in SQL & Databases.'
) ON CONFLICT (id) DO NOTHING;

-- Explore Quiz 15: Git vs GitHub Challenge Quiz
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
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000015000001',
  '00000000-0002-4000-a000-000000000015',
  1,
  'Q1. What is Git?',
  'merge',
  'clone',
  'Git',
  'remote repository',
  'C',
  'Git is a key concept in Git vs GitHub.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000015000002',
  '00000000-0002-4000-a000-000000000015',
  2,
  'Q2. Which option is most directly associated with GitHub?',
  'diff',
  'GitHub',
  'merge',
  'branch',
  'B',
  'GitHub is a key concept in Git vs GitHub.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000015000003',
  '00000000-0002-4000-a000-000000000015',
  3,
  'Q3. Which statement best describes local repository?',
  'repository',
  'local repository',
  'remote repository',
  'issue',
  'B',
  'local repository is a key concept in Git vs GitHub.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000015000004',
  '00000000-0002-4000-a000-000000000015',
  4,
  'Q4. In this topic, what does remote repository refer to?',
  'fork',
  'remote repository',
  'version control',
  'branch',
  'B',
  'remote repository is a key concept in Git vs GitHub.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000015000005',
  '00000000-0002-4000-a000-000000000015',
  5,
  'Q5. What is commit?',
  'push',
  'commit',
  'branch',
  'hosting',
  'B',
  'commit is a key concept in Git vs GitHub.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000015000006',
  '00000000-0002-4000-a000-000000000015',
  6,
  'Q6. Which option is most directly associated with push?',
  'push',
  'merge',
  'Git',
  'version control',
  'A',
  'push is a key concept in Git vs GitHub.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000015000007',
  '00000000-0002-4000-a000-000000000015',
  7,
  'Q7. Which statement best describes pull?',
  'pull',
  'staging',
  'commit',
  'hosting',
  'A',
  'pull is a key concept in Git vs GitHub.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000015000008',
  '00000000-0002-4000-a000-000000000015',
  8,
  'Q8. In this topic, what does clone refer to?',
  'clone',
  'Git',
  'GitHub',
  'collaboration',
  'A',
  'clone is a key concept in Git vs GitHub.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000015000009',
  '00000000-0002-4000-a000-000000000015',
  9,
  'Q9. What is branch?',
  'branch',
  'commit',
  'issue',
  'pull',
  'A',
  'branch is a key concept in Git vs GitHub.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000015000010',
  '00000000-0002-4000-a000-000000000015',
  10,
  'Q10. Which option is most directly associated with merge?',
  'merge',
  'issue',
  'Actions',
  'remote repository',
  'A',
  'merge is a key concept in Git vs GitHub.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000015000011',
  '00000000-0002-4000-a000-000000000015',
  11,
  'Q11. Which statement best describes pull request?',
  'pull request',
  'GitHub',
  'clone',
  'branch',
  'A',
  'pull request is a key concept in Git vs GitHub.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000015000012',
  '00000000-0002-4000-a000-000000000015',
  12,
  'Q12. In this topic, what does fork refer to?',
  'repository',
  'collaboration',
  'fork',
  'version control',
  'C',
  'fork is a key concept in Git vs GitHub.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000015000013',
  '00000000-0002-4000-a000-000000000015',
  13,
  'Q13. What is repository?',
  'GitHub',
  'staging',
  'pull request',
  'repository',
  'D',
  'repository is a key concept in Git vs GitHub.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000015000014',
  '00000000-0002-4000-a000-000000000015',
  14,
  'Q14. Which option is most directly associated with version control?',
  'hosting',
  'version control',
  'Actions',
  'branch',
  'B',
  'version control is a key concept in Git vs GitHub.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000015000015',
  '00000000-0002-4000-a000-000000000015',
  15,
  'Q15. Which statement best describes hosting?',
  'hosting',
  'remote repository',
  'fork',
  'pull',
  'A',
  'hosting is a key concept in Git vs GitHub.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000015000016',
  '00000000-0002-4000-a000-000000000015',
  16,
  'Q16. What is Git?',
  'staging',
  'Git',
  'local repository',
  'GitHub',
  'B',
  'Git is a key concept in Git vs GitHub.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000015000017',
  '00000000-0002-4000-a000-000000000015',
  17,
  'Q17. Which option is most directly associated with GitHub?',
  'clone',
  'GitHub',
  'local repository',
  'diff',
  'B',
  'GitHub is a key concept in Git vs GitHub.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000015000018',
  '00000000-0002-4000-a000-000000000015',
  18,
  'Q18. Which statement best describes local repository?',
  'local repository',
  'commit',
  'repository',
  'collaboration',
  'A',
  'local repository is a key concept in Git vs GitHub.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000015000019',
  '00000000-0002-4000-a000-000000000015',
  19,
  'Q19. In this topic, what does remote repository refer to?',
  'pull request',
  'issue',
  'remote repository',
  'version control',
  'C',
  'remote repository is a key concept in Git vs GitHub.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000015000020',
  '00000000-0002-4000-a000-000000000015',
  20,
  'Q20. What is commit?',
  'branch',
  'commit',
  'local repository',
  'GitHub',
  'B',
  'commit is a key concept in Git vs GitHub.'
) ON CONFLICT (id) DO NOTHING;

-- Explore Quiz 16: HTTP & HTTPS Challenge Quiz
INSERT INTO public.explore_quizzes (id, title, description, category, branch, difficulty, question_count, estimated_minutes, fx_reward, is_daily, is_published)
VALUES (
  '00000000-0002-4000-a000-000000000016',
  'HTTP & HTTPS Challenge Quiz',
  'Test your knowledge on HTTP & HTTPS with 20 comprehensive questions.',
  'Networking',
  'CSE',
  'Intermediate',
  20,
  8,
  15,
  FALSE,
  TRUE
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000016000001',
  '00000000-0002-4000-a000-000000000016',
  1,
  'Q1. What is HTTP?',
  'POST',
  'GET',
  'port 443',
  'HTTP',
  'D',
  'HTTP is a key concept in HTTP & HTTPS.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000016000002',
  '00000000-0002-4000-a000-000000000016',
  2,
  'Q2. Which option is most directly associated with HTTPS?',
  'status code',
  'method',
  'cache',
  'HTTPS',
  'D',
  'HTTPS is a key concept in HTTP & HTTPS.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000016000003',
  '00000000-0002-4000-a000-000000000016',
  3,
  'Q3. Which statement best describes TLS?',
  'TLS',
  'POST',
  'URL',
  'response',
  'A',
  'TLS is a key concept in HTTP & HTTPS.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000016000004',
  '00000000-0002-4000-a000-000000000016',
  4,
  'Q4. In this topic, what does request refer to?',
  'URL',
  'response',
  'request',
  'header',
  'C',
  'request is a key concept in HTTP & HTTPS.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000016000005',
  '00000000-0002-4000-a000-000000000016',
  5,
  'Q5. What is response?',
  'redirect',
  'POST',
  'response',
  'port 80',
  'C',
  'response is a key concept in HTTP & HTTPS.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000016000006',
  '00000000-0002-4000-a000-000000000016',
  6,
  'Q6. Which option is most directly associated with GET?',
  'cookie',
  'TLS',
  'GET',
  'request',
  'C',
  'GET is a key concept in HTTP & HTTPS.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000016000007',
  '00000000-0002-4000-a000-000000000016',
  7,
  'Q7. Which statement best describes POST?',
  'POST',
  'HTTP',
  'certificate',
  'port 443',
  'A',
  'POST is a key concept in HTTP & HTTPS.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000016000008',
  '00000000-0002-4000-a000-000000000016',
  8,
  'Q8. In this topic, what does status code refer to?',
  'method',
  'status code',
  'HTTPS',
  'response',
  'B',
  'status code is a key concept in HTTP & HTTPS.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000016000009',
  '00000000-0002-4000-a000-000000000016',
  9,
  'Q9. What is header?',
  'request',
  'method',
  'header',
  'cache',
  'C',
  'header is a key concept in HTTP & HTTPS.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000016000010',
  '00000000-0002-4000-a000-000000000016',
  10,
  'Q10. Which option is most directly associated with URL?',
  'status code',
  'cookie',
  'URL',
  'port 80',
  'C',
  'URL is a key concept in HTTP & HTTPS.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000016000011',
  '00000000-0002-4000-a000-000000000016',
  11,
  'Q11. Which statement best describes client?',
  'cache',
  'client',
  'POST',
  'TLS',
  'B',
  'client is a key concept in HTTP & HTTPS.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000016000012',
  '00000000-0002-4000-a000-000000000016',
  12,
  'Q12. In this topic, what does server refer to?',
  'GET',
  'client',
  'URL',
  'server',
  'D',
  'server is a key concept in HTTP & HTTPS.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000016000013',
  '00000000-0002-4000-a000-000000000016',
  13,
  'Q13. What is encryption?',
  'status code',
  'encryption',
  'certificate',
  'URL',
  'B',
  'encryption is a key concept in HTTP & HTTPS.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000016000014',
  '00000000-0002-4000-a000-000000000016',
  14,
  'Q14. Which option is most directly associated with certificate?',
  'port 80',
  'certificate',
  'port 443',
  'redirect',
  'B',
  'certificate is a key concept in HTTP & HTTPS.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000016000015',
  '00000000-0002-4000-a000-000000000016',
  15,
  'Q15. Which statement best describes port 80?',
  'response',
  'port 443',
  'URL',
  'port 80',
  'D',
  'port 80 is a key concept in HTTP & HTTPS.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000016000016',
  '00000000-0002-4000-a000-000000000016',
  16,
  'Q16. What is HTTP?',
  'POST',
  'HTTP',
  'HTTPS',
  'certificate',
  'B',
  'HTTP is a key concept in HTTP & HTTPS.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000016000017',
  '00000000-0002-4000-a000-000000000016',
  17,
  'Q17. Which option is most directly associated with HTTPS?',
  'header',
  'POST',
  'certificate',
  'HTTPS',
  'D',
  'HTTPS is a key concept in HTTP & HTTPS.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000016000018',
  '00000000-0002-4000-a000-000000000016',
  18,
  'Q18. Which statement best describes TLS?',
  'redirect',
  'HTTP',
  'TLS',
  'server',
  'C',
  'TLS is a key concept in HTTP & HTTPS.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000016000019',
  '00000000-0002-4000-a000-000000000016',
  19,
  'Q19. In this topic, what does request refer to?',
  'header',
  'certificate',
  'HTTP',
  'request',
  'D',
  'request is a key concept in HTTP & HTTPS.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000016000020',
  '00000000-0002-4000-a000-000000000016',
  20,
  'Q20. What is response?',
  'HTTPS',
  'response',
  'method',
  'redirect',
  'B',
  'response is a key concept in HTTP & HTTPS.'
) ON CONFLICT (id) DO NOTHING;

-- Explore Quiz 17: DNS Explained Challenge Quiz
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
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000017000001',
  '00000000-0002-4000-a000-000000000017',
  1,
  'Q1. What is DNS?',
  'hostname',
  'AAAA record',
  'DNS',
  'port 53',
  'C',
  'DNS is a key concept in DNS Explained.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000017000002',
  '00000000-0002-4000-a000-000000000017',
  2,
  'Q2. Which option is most directly associated with domain name?',
  'domain name',
  'hostname',
  'resolution',
  'resolver',
  'A',
  'domain name is a key concept in DNS Explained.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000017000003',
  '00000000-0002-4000-a000-000000000017',
  3,
  'Q3. Which statement best describes IP address?',
  'IP address',
  'AAAA record',
  'hostname',
  'UDP',
  'A',
  'IP address is a key concept in DNS Explained.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000017000004',
  '00000000-0002-4000-a000-000000000017',
  4,
  'Q4. In this topic, what does resolver refer to?',
  'domain name',
  'IP address',
  'CNAME',
  'resolver',
  'D',
  'resolver is a key concept in DNS Explained.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000017000005',
  '00000000-0002-4000-a000-000000000017',
  5,
  'Q5. What is record?',
  'record',
  'UDP',
  'recursive query',
  'AAAA record',
  'A',
  'record is a key concept in DNS Explained.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000017000006',
  '00000000-0002-4000-a000-000000000017',
  6,
  'Q6. Which option is most directly associated with A record?',
  'IP address',
  'recursive query',
  'record',
  'A record',
  'D',
  'A record is a key concept in DNS Explained.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000017000007',
  '00000000-0002-4000-a000-000000000017',
  7,
  'Q7. Which statement best describes AAAA record?',
  'authoritative server',
  'AAAA record',
  'cache',
  'resolution',
  'B',
  'AAAA record is a key concept in DNS Explained.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000017000008',
  '00000000-0002-4000-a000-000000000017',
  8,
  'Q8. In this topic, what does CNAME refer to?',
  'hostname',
  'DNS',
  'CNAME',
  'IP address',
  'C',
  'CNAME is a key concept in DNS Explained.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000017000009',
  '00000000-0002-4000-a000-000000000017',
  9,
  'Q9. What is MX?',
  'MX',
  'DNSSEC',
  'IP address',
  'domain',
  'A',
  'MX is a key concept in DNS Explained.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000017000010',
  '00000000-0002-4000-a000-000000000017',
  10,
  'Q10. Which option is most directly associated with nameserver?',
  'nameserver',
  'resolver',
  'record',
  'DNSSEC',
  'A',
  'nameserver is a key concept in DNS Explained.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000017000011',
  '00000000-0002-4000-a000-000000000017',
  11,
  'Q11. Which statement best describes cache?',
  'domain name',
  'DNS',
  'port 53',
  'cache',
  'D',
  'cache is a key concept in DNS Explained.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000017000012',
  '00000000-0002-4000-a000-000000000017',
  12,
  'Q12. In this topic, what does TTL refer to?',
  'MX',
  'TTL',
  'UDP',
  'DNS',
  'B',
  'TTL is a key concept in DNS Explained.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000017000013',
  '00000000-0002-4000-a000-000000000017',
  13,
  'Q13. What is recursive query?',
  'resolution',
  'nameserver',
  'recursive query',
  'A record',
  'C',
  'recursive query is a key concept in DNS Explained.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000017000014',
  '00000000-0002-4000-a000-000000000017',
  14,
  'Q14. Which option is most directly associated with authoritative server?',
  'TTL',
  'A record',
  'domain name',
  'authoritative server',
  'D',
  'authoritative server is a key concept in DNS Explained.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000017000015',
  '00000000-0002-4000-a000-000000000017',
  15,
  'Q15. Which statement best describes DNSSEC?',
  'CNAME',
  'DNSSEC',
  'nameserver',
  'AAAA record',
  'B',
  'DNSSEC is a key concept in DNS Explained.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000017000016',
  '00000000-0002-4000-a000-000000000017',
  16,
  'Q16. What is DNS?',
  'DNSSEC',
  'nameserver',
  'CNAME',
  'DNS',
  'D',
  'DNS is a key concept in DNS Explained.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000017000017',
  '00000000-0002-4000-a000-000000000017',
  17,
  'Q17. Which option is most directly associated with domain name?',
  'hostname',
  'domain name',
  'A record',
  'CNAME',
  'B',
  'domain name is a key concept in DNS Explained.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000017000018',
  '00000000-0002-4000-a000-000000000017',
  18,
  'Q18. Which statement best describes IP address?',
  'IP address',
  'MX',
  'hostname',
  'domain name',
  'A',
  'IP address is a key concept in DNS Explained.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000017000019',
  '00000000-0002-4000-a000-000000000017',
  19,
  'Q19. In this topic, what does resolver refer to?',
  'UDP',
  'resolver',
  'TTL',
  'AAAA record',
  'B',
  'resolver is a key concept in DNS Explained.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000017000020',
  '00000000-0002-4000-a000-000000000017',
  20,
  'Q20. What is record?',
  'resolver',
  'TTL',
  'AAAA record',
  'record',
  'D',
  'record is a key concept in DNS Explained.'
) ON CONFLICT (id) DO NOTHING;

-- Explore Quiz 18: IP Addresses Challenge Quiz
INSERT INTO public.explore_quizzes (id, title, description, category, branch, difficulty, question_count, estimated_minutes, fx_reward, is_daily, is_published)
VALUES (
  '00000000-0002-4000-a000-000000000018',
  'IP Addresses Challenge Quiz',
  'Test your knowledge on IP Addresses with 20 comprehensive questions.',
  'Web Dev',
  'CSE',
  'Intermediate',
  20,
  8,
  15,
  FALSE,
  TRUE
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000018000001',
  '00000000-0002-4000-a000-000000000018',
  1,
  'Q1. What is IP address?',
  'subnet',
  'router',
  'IPv6',
  'IP address',
  'D',
  'IP address is a key concept in IP Addresses.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000018000002',
  '00000000-0002-4000-a000-000000000018',
  2,
  'Q2. Which option is most directly associated with IPv4?',
  'public address',
  'DHCP',
  'broadcast',
  'IPv4',
  'D',
  'IPv4 is a key concept in IP Addresses.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000018000003',
  '00000000-0002-4000-a000-000000000018',
  3,
  'Q3. Which statement best describes IPv6?',
  'IPv6',
  'broadcast',
  'router',
  'CIDR',
  'A',
  'IPv6 is a key concept in IP Addresses.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000018000004',
  '00000000-0002-4000-a000-000000000018',
  4,
  'Q4. In this topic, what does 32-bit refer to?',
  'IPv4',
  'DHCP',
  '32-bit',
  'NAT',
  'C',
  '32-bit is a key concept in IP Addresses.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000018000005',
  '00000000-0002-4000-a000-000000000018',
  5,
  'Q5. What is 128-bit?',
  '128-bit',
  'gateway',
  'loopback',
  'IPv4',
  'A',
  '128-bit is a key concept in IP Addresses.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000018000006',
  '00000000-0002-4000-a000-000000000018',
  6,
  'Q6. Which option is most directly associated with private address?',
  '32-bit',
  '128-bit',
  'private address',
  'CIDR',
  'C',
  'private address is a key concept in IP Addresses.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000018000007',
  '00000000-0002-4000-a000-000000000018',
  7,
  'Q7. Which statement best describes public address?',
  'network',
  'public address',
  'private address',
  'IPv6',
  'B',
  'public address is a key concept in IP Addresses.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000018000008',
  '00000000-0002-4000-a000-000000000018',
  8,
  'Q8. In this topic, what does subnet refer to?',
  'IPv4',
  'subnet',
  'router',
  '32-bit',
  'B',
  'subnet is a key concept in IP Addresses.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000018000009',
  '00000000-0002-4000-a000-000000000018',
  9,
  'Q9. What is router?',
  '128-bit',
  'NAT',
  'private address',
  'router',
  'D',
  'router is a key concept in IP Addresses.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000018000010',
  '00000000-0002-4000-a000-000000000018',
  10,
  'Q10. Which option is most directly associated with host?',
  'network',
  'host',
  'IPv6',
  'static address',
  'B',
  'host is a key concept in IP Addresses.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000018000011',
  '00000000-0002-4000-a000-000000000018',
  11,
  'Q11. Which statement best describes network?',
  'network',
  'addressing',
  'static address',
  'loopback',
  'A',
  'network is a key concept in IP Addresses.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000018000012',
  '00000000-0002-4000-a000-000000000018',
  12,
  'Q12. In this topic, what does loopback refer to?',
  '128-bit',
  'CIDR',
  'loopback',
  'gateway',
  'C',
  'loopback is a key concept in IP Addresses.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000018000013',
  '00000000-0002-4000-a000-000000000018',
  13,
  'Q13. What is NAT?',
  'router',
  'IPv4',
  'CIDR',
  'NAT',
  'D',
  'NAT is a key concept in IP Addresses.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000018000014',
  '00000000-0002-4000-a000-000000000018',
  14,
  'Q14. Which option is most directly associated with DHCP?',
  'static address',
  'router',
  'DHCP',
  'loopback',
  'C',
  'DHCP is a key concept in IP Addresses.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000018000015',
  '00000000-0002-4000-a000-000000000018',
  15,
  'Q15. Which statement best describes static address?',
  'gateway',
  'loopback',
  'IPv6',
  'static address',
  'D',
  'static address is a key concept in IP Addresses.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000018000016',
  '00000000-0002-4000-a000-000000000018',
  16,
  'Q16. What is IP address?',
  'subnet',
  'IP address',
  'DHCP',
  'router',
  'B',
  'IP address is a key concept in IP Addresses.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000018000017',
  '00000000-0002-4000-a000-000000000018',
  17,
  'Q17. Which option is most directly associated with IPv4?',
  'dynamic address',
  'IPv4',
  'addressing',
  'router',
  'B',
  'IPv4 is a key concept in IP Addresses.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000018000018',
  '00000000-0002-4000-a000-000000000018',
  18,
  'Q18. Which statement best describes IPv6?',
  'IPv6',
  'IPv4',
  'host',
  'loopback',
  'A',
  'IPv6 is a key concept in IP Addresses.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000018000019',
  '00000000-0002-4000-a000-000000000018',
  19,
  'Q19. In this topic, what does 32-bit refer to?',
  'IP address',
  'static address',
  '32-bit',
  'dynamic address',
  'C',
  '32-bit is a key concept in IP Addresses.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000018000020',
  '00000000-0002-4000-a000-000000000018',
  20,
  'Q20. What is 128-bit?',
  'network',
  '128-bit',
  'addressing',
  'DHCP',
  'B',
  '128-bit is a key concept in IP Addresses.'
) ON CONFLICT (id) DO NOTHING;

-- Explore Quiz 19: TCP vs UDP Challenge Quiz
INSERT INTO public.explore_quizzes (id, title, description, category, branch, difficulty, question_count, estimated_minutes, fx_reward, is_daily, is_published)
VALUES (
  '00000000-0002-4000-a000-000000000019',
  'TCP vs UDP Challenge Quiz',
  'Test your knowledge on TCP vs UDP with 20 comprehensive questions.',
  'Mobile Dev',
  'CSE',
  'Intermediate',
  20,
  8,
  15,
  FALSE,
  TRUE
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000019000001',
  '00000000-0002-4000-a000-000000000019',
  1,
  'Q1. What is TCP?',
  'TCP',
  'UDP',
  'reliability',
  'packet',
  'A',
  'TCP is a key concept in TCP vs UDP.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000019000002',
  '00000000-0002-4000-a000-000000000019',
  2,
  'Q2. Which option is most directly associated with UDP?',
  'handshake',
  'congestion control',
  'real-time traffic',
  'UDP',
  'D',
  'UDP is a key concept in TCP vs UDP.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000019000003',
  '00000000-0002-4000-a000-000000000019',
  3,
  'Q3. Which statement best describes connection?',
  'TCP',
  'web',
  'connection',
  'ordering',
  'C',
  'connection is a key concept in TCP vs UDP.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000019000004',
  '00000000-0002-4000-a000-000000000019',
  4,
  'Q4. In this topic, what does reliability refer to?',
  'connection',
  'handshake',
  'low overhead',
  'reliability',
  'D',
  'reliability is a key concept in TCP vs UDP.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000019000005',
  '00000000-0002-4000-a000-000000000019',
  5,
  'Q5. What is ordering?',
  'handshake',
  'retransmission',
  'ordering',
  'packet',
  'C',
  'ordering is a key concept in TCP vs UDP.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000019000006',
  '00000000-0002-4000-a000-000000000019',
  6,
  'Q6. Which option is most directly associated with acknowledgement?',
  'flow control',
  'web',
  'video',
  'acknowledgement',
  'D',
  'acknowledgement is a key concept in TCP vs UDP.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000019000007',
  '00000000-0002-4000-a000-000000000019',
  7,
  'Q7. Which statement best describes retransmission?',
  'low overhead',
  'datagram',
  'packet',
  'retransmission',
  'D',
  'retransmission is a key concept in TCP vs UDP.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000019000008',
  '00000000-0002-4000-a000-000000000019',
  8,
  'Q8. In this topic, what does flow control refer to?',
  'packet',
  'stream',
  'connection',
  'flow control',
  'D',
  'flow control is a key concept in TCP vs UDP.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000019000009',
  '00000000-0002-4000-a000-000000000019',
  9,
  'Q9. What is congestion control?',
  'flow control',
  'ordering',
  'congestion control',
  'retransmission',
  'C',
  'congestion control is a key concept in TCP vs UDP.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000019000010',
  '00000000-0002-4000-a000-000000000019',
  10,
  'Q10. Which option is most directly associated with datagram?',
  'acknowledgement',
  'port',
  'congestion control',
  'datagram',
  'D',
  'datagram is a key concept in TCP vs UDP.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000019000011',
  '00000000-0002-4000-a000-000000000019',
  11,
  'Q11. Which statement best describes low overhead?',
  'low overhead',
  'socket',
  'congestion control',
  'real-time traffic',
  'A',
  'low overhead is a key concept in TCP vs UDP.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000019000012',
  '00000000-0002-4000-a000-000000000019',
  12,
  'Q12. In this topic, what does port refer to?',
  'web',
  'port',
  'acknowledgement',
  'DNS',
  'B',
  'port is a key concept in TCP vs UDP.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000019000013',
  '00000000-0002-4000-a000-000000000019',
  13,
  'Q13. What is socket?',
  'ordering',
  'port',
  'socket',
  'retransmission',
  'C',
  'socket is a key concept in TCP vs UDP.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000019000014',
  '00000000-0002-4000-a000-000000000019',
  14,
  'Q14. Which option is most directly associated with stream?',
  'acknowledgement',
  'stream',
  'real-time traffic',
  'TCP',
  'B',
  'stream is a key concept in TCP vs UDP.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000019000015',
  '00000000-0002-4000-a000-000000000019',
  15,
  'Q15. Which statement best describes packet?',
  'packet',
  'congestion control',
  'DNS',
  'ordering',
  'A',
  'packet is a key concept in TCP vs UDP.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000019000016',
  '00000000-0002-4000-a000-000000000019',
  16,
  'Q16. What is TCP?',
  'TCP',
  'stream',
  'flow control',
  'congestion control',
  'A',
  'TCP is a key concept in TCP vs UDP.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000019000017',
  '00000000-0002-4000-a000-000000000019',
  17,
  'Q17. Which option is most directly associated with UDP?',
  'connection',
  'ordering',
  'UDP',
  'low overhead',
  'C',
  'UDP is a key concept in TCP vs UDP.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000019000018',
  '00000000-0002-4000-a000-000000000019',
  18,
  'Q18. Which statement best describes connection?',
  'stream',
  'connection',
  'congestion control',
  'flow control',
  'B',
  'connection is a key concept in TCP vs UDP.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000019000019',
  '00000000-0002-4000-a000-000000000019',
  19,
  'Q19. In this topic, what does reliability refer to?',
  'low overhead',
  'reliability',
  'connection',
  'UDP',
  'B',
  'reliability is a key concept in TCP vs UDP.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000019000020',
  '00000000-0002-4000-a000-000000000019',
  20,
  'Q20. What is ordering?',
  'low overhead',
  'acknowledgement',
  'ordering',
  'real-time traffic',
  'C',
  'ordering is a key concept in TCP vs UDP.'
) ON CONFLICT (id) DO NOTHING;

-- Explore Quiz 20: Frontend vs Backend Challenge Quiz
INSERT INTO public.explore_quizzes (id, title, description, category, branch, difficulty, question_count, estimated_minutes, fx_reward, is_daily, is_published)
VALUES (
  '00000000-0002-4000-a000-000000000020',
  'Frontend vs Backend Challenge Quiz',
  'Test your knowledge on Frontend vs Backend with 20 comprehensive questions.',
  'Backend',
  'CSE',
  'Intermediate',
  20,
  8,
  15,
  FALSE,
  TRUE
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000020000001',
  '00000000-0002-4000-a000-000000000020',
  1,
  'Q1. What is frontend?',
  'API',
  'HTML',
  'CSS',
  'frontend',
  'D',
  'frontend is a key concept in Frontend vs Backend.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000020000002',
  '00000000-0002-4000-a000-000000000020',
  2,
  'Q2. Which option is most directly associated with backend?',
  'HTML',
  'response',
  'backend',
  'request',
  'C',
  'backend is a key concept in Frontend vs Backend.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000020000003',
  '00000000-0002-4000-a000-000000000020',
  3,
  'Q3. Which statement best describes client?',
  'request',
  'client',
  'response',
  'business logic',
  'B',
  'client is a key concept in Frontend vs Backend.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000020000004',
  '00000000-0002-4000-a000-000000000020',
  4,
  'Q4. In this topic, what does server refer to?',
  'database',
  'frontend',
  'authentication',
  'server',
  'D',
  'server is a key concept in Frontend vs Backend.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000020000005',
  '00000000-0002-4000-a000-000000000020',
  5,
  'Q5. What is UI?',
  'request',
  'API',
  'frontend',
  'UI',
  'D',
  'UI is a key concept in Frontend vs Backend.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000020000006',
  '00000000-0002-4000-a000-000000000020',
  6,
  'Q6. Which option is most directly associated with API?',
  'validation',
  'HTML',
  'API',
  'deployment',
  'C',
  'API is a key concept in Frontend vs Backend.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000020000007',
  '00000000-0002-4000-a000-000000000020',
  7,
  'Q7. Which statement best describes database?',
  'database',
  'frontend',
  'request',
  'validation',
  'A',
  'database is a key concept in Frontend vs Backend.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000020000008',
  '00000000-0002-4000-a000-000000000020',
  8,
  'Q8. In this topic, what does authentication refer to?',
  'response',
  'JavaScript',
  'API',
  'authentication',
  'D',
  'authentication is a key concept in Frontend vs Backend.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000020000009',
  '00000000-0002-4000-a000-000000000020',
  9,
  'Q9. What is business logic?',
  'client',
  'business logic',
  'authentication',
  'backend',
  'B',
  'business logic is a key concept in Frontend vs Backend.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000020000010',
  '00000000-0002-4000-a000-000000000020',
  10,
  'Q10. Which option is most directly associated with browser?',
  'response',
  'browser',
  'mobile app',
  'authentication',
  'B',
  'browser is a key concept in Frontend vs Backend.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000020000011',
  '00000000-0002-4000-a000-000000000020',
  11,
  'Q11. Which statement best describes mobile app?',
  'authentication',
  'request',
  'response',
  'mobile app',
  'D',
  'mobile app is a key concept in Frontend vs Backend.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000020000012',
  '00000000-0002-4000-a000-000000000020',
  12,
  'Q12. In this topic, what does request refer to?',
  'deployment',
  'JavaScript',
  'browser',
  'request',
  'D',
  'request is a key concept in Frontend vs Backend.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000020000013',
  '00000000-0002-4000-a000-000000000020',
  13,
  'Q13. What is response?',
  'JavaScript',
  'authentication',
  'response',
  'API',
  'C',
  'response is a key concept in Frontend vs Backend.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000020000014',
  '00000000-0002-4000-a000-000000000020',
  14,
  'Q14. Which option is most directly associated with HTML?',
  'frontend',
  'deployment',
  'HTML',
  'database',
  'C',
  'HTML is a key concept in Frontend vs Backend.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000020000015',
  '00000000-0002-4000-a000-000000000020',
  15,
  'Q15. Which statement best describes CSS?',
  'CSS',
  'frontend',
  'request',
  'client',
  'A',
  'CSS is a key concept in Frontend vs Backend.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000020000016',
  '00000000-0002-4000-a000-000000000020',
  16,
  'Q16. What is frontend?',
  'frontend',
  'server',
  'mobile app',
  'authentication',
  'A',
  'frontend is a key concept in Frontend vs Backend.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000020000017',
  '00000000-0002-4000-a000-000000000020',
  17,
  'Q17. Which option is most directly associated with backend?',
  'backend',
  'frontend',
  'request',
  'session',
  'A',
  'backend is a key concept in Frontend vs Backend.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000020000018',
  '00000000-0002-4000-a000-000000000020',
  18,
  'Q18. Which statement best describes client?',
  'authentication',
  'business logic',
  'client',
  'validation',
  'C',
  'client is a key concept in Frontend vs Backend.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000020000019',
  '00000000-0002-4000-a000-000000000020',
  19,
  'Q19. In this topic, what does server refer to?',
  'server',
  'browser',
  'validation',
  'request',
  'A',
  'server is a key concept in Frontend vs Backend.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000020000020',
  '00000000-0002-4000-a000-000000000020',
  20,
  'Q20. What is UI?',
  'UI',
  'response',
  'validation',
  'request',
  'A',
  'UI is a key concept in Frontend vs Backend.'
) ON CONFLICT (id) DO NOTHING;

-- Explore Quiz 21: REST APIs Challenge Quiz
INSERT INTO public.explore_quizzes (id, title, description, category, branch, difficulty, question_count, estimated_minutes, fx_reward, is_daily, is_published)
VALUES (
  '00000000-0002-4000-a000-000000000021',
  'REST APIs Challenge Quiz',
  'Test your knowledge on REST APIs with 20 comprehensive questions.',
  'Backend',
  'CSE',
  'Intermediate',
  20,
  8,
  15,
  FALSE,
  TRUE
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000021000001',
  '00000000-0002-4000-a000-000000000021',
  1,
  'Q1. What is REST?',
  'stateless',
  'JSON',
  'resource',
  'REST',
  'D',
  'REST is a key concept in REST APIs.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000021000002',
  '00000000-0002-4000-a000-000000000021',
  2,
  'Q2. Which option is most directly associated with resource?',
  'header',
  'resource',
  'URL',
  'HTTP',
  'B',
  'resource is a key concept in REST APIs.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000021000003',
  '00000000-0002-4000-a000-000000000021',
  3,
  'Q3. Which statement best describes URL?',
  'REST',
  'server',
  'URL',
  'GET',
  'C',
  'URL is a key concept in REST APIs.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000021000004',
  '00000000-0002-4000-a000-000000000021',
  4,
  'Q4. In this topic, what does GET refer to?',
  'stateless',
  'GET',
  'server',
  'resource',
  'B',
  'GET is a key concept in REST APIs.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000021000005',
  '00000000-0002-4000-a000-000000000021',
  5,
  'Q5. What is POST?',
  'POST',
  'REST',
  'GET',
  'DELETE',
  'A',
  'POST is a key concept in REST APIs.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000021000006',
  '00000000-0002-4000-a000-000000000021',
  6,
  'Q6. Which option is most directly associated with PUT?',
  'PUT',
  'idempotent',
  'endpoint',
  'resource',
  'A',
  'PUT is a key concept in REST APIs.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000021000007',
  '00000000-0002-4000-a000-000000000021',
  7,
  'Q7. Which statement best describes PATCH?',
  'server',
  'HTTP',
  'PATCH',
  'PUT',
  'C',
  'PATCH is a key concept in REST APIs.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000021000008',
  '00000000-0002-4000-a000-000000000021',
  8,
  'Q8. In this topic, what does DELETE refer to?',
  'query parameter',
  'CRUD',
  'DELETE',
  'status code',
  'C',
  'DELETE is a key concept in REST APIs.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000021000009',
  '00000000-0002-4000-a000-000000000021',
  9,
  'Q9. What is HTTP?',
  'status code',
  'idempotent',
  'client',
  'HTTP',
  'D',
  'HTTP is a key concept in REST APIs.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000021000010',
  '00000000-0002-4000-a000-000000000021',
  10,
  'Q10. Which option is most directly associated with stateless?',
  'HTTP',
  'stateless',
  'REST',
  'CRUD',
  'B',
  'stateless is a key concept in REST APIs.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000021000011',
  '00000000-0002-4000-a000-000000000021',
  11,
  'Q11. Which statement best describes JSON?',
  'JSON',
  'server',
  'REST',
  'URL',
  'A',
  'JSON is a key concept in REST APIs.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000021000012',
  '00000000-0002-4000-a000-000000000021',
  12,
  'Q12. In this topic, what does status code refer to?',
  'header',
  'DELETE',
  'status code',
  'PUT',
  'C',
  'status code is a key concept in REST APIs.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000021000013',
  '00000000-0002-4000-a000-000000000021',
  13,
  'Q13. What is endpoint?',
  'JSON',
  'API',
  'PATCH',
  'endpoint',
  'D',
  'endpoint is a key concept in REST APIs.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000021000014',
  '00000000-0002-4000-a000-000000000021',
  14,
  'Q14. Which option is most directly associated with client?',
  'server',
  'client',
  'JSON',
  'CRUD',
  'B',
  'client is a key concept in REST APIs.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000021000015',
  '00000000-0002-4000-a000-000000000021',
  15,
  'Q15. Which statement best describes server?',
  'CRUD',
  'server',
  'API',
  'HTTP',
  'B',
  'server is a key concept in REST APIs.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000021000016',
  '00000000-0002-4000-a000-000000000021',
  16,
  'Q16. What is REST?',
  'URL',
  'REST',
  'stateless',
  'query parameter',
  'B',
  'REST is a key concept in REST APIs.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000021000017',
  '00000000-0002-4000-a000-000000000021',
  17,
  'Q17. Which option is most directly associated with resource?',
  'resource',
  'POST',
  'URL',
  'client',
  'A',
  'resource is a key concept in REST APIs.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000021000018',
  '00000000-0002-4000-a000-000000000021',
  18,
  'Q18. Which statement best describes URL?',
  'PATCH',
  'URL',
  'stateless',
  'JSON',
  'B',
  'URL is a key concept in REST APIs.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000021000019',
  '00000000-0002-4000-a000-000000000021',
  19,
  'Q19. In this topic, what does GET refer to?',
  'GET',
  'idempotent',
  'JSON',
  'DELETE',
  'A',
  'GET is a key concept in REST APIs.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000021000020',
  '00000000-0002-4000-a000-000000000021',
  20,
  'Q20. What is POST?',
  'header',
  'HTTP',
  'PATCH',
  'POST',
  'D',
  'POST is a key concept in REST APIs.'
) ON CONFLICT (id) DO NOTHING;

-- Explore Quiz 22: JSON & XML Challenge Quiz
INSERT INTO public.explore_quizzes (id, title, description, category, branch, difficulty, question_count, estimated_minutes, fx_reward, is_daily, is_published)
VALUES (
  '00000000-0002-4000-a000-000000000022',
  'JSON & XML Challenge Quiz',
  'Test your knowledge on JSON & XML with 20 comprehensive questions.',
  'DevOps',
  'CSE',
  'Intermediate',
  20,
  8,
  15,
  FALSE,
  TRUE
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000022000001',
  '00000000-0002-4000-a000-000000000022',
  1,
  'Q1. What is JSON?',
  'XML',
  'JSON',
  'nested data',
  'API',
  'B',
  'JSON is a key concept in JSON & XML.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000022000002',
  '00000000-0002-4000-a000-000000000022',
  2,
  'Q2. Which option is most directly associated with XML?',
  'nested data',
  'JSON',
  'XML',
  'schema',
  'C',
  'XML is a key concept in JSON & XML.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000022000003',
  '00000000-0002-4000-a000-000000000022',
  3,
  'Q3. Which statement best describes object?',
  'API',
  'XML',
  'object',
  'string',
  'C',
  'object is a key concept in JSON & XML.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000022000004',
  '00000000-0002-4000-a000-000000000022',
  4,
  'Q4. In this topic, what does array refer to?',
  'array',
  'serialization',
  'namespace',
  'number',
  'A',
  'array is a key concept in JSON & XML.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000022000005',
  '00000000-0002-4000-a000-000000000022',
  5,
  'Q5. What is key?',
  'API',
  'XML',
  'key',
  'array',
  'C',
  'key is a key concept in JSON & XML.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000022000006',
  '00000000-0002-4000-a000-000000000022',
  6,
  'Q6. Which option is most directly associated with value?',
  'value',
  'boolean',
  'nested data',
  'object',
  'A',
  'value is a key concept in JSON & XML.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000022000007',
  '00000000-0002-4000-a000-000000000022',
  7,
  'Q7. Which statement best describes tag?',
  'tag',
  'namespace',
  'JSON',
  'key',
  'A',
  'tag is a key concept in JSON & XML.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000022000008',
  '00000000-0002-4000-a000-000000000022',
  8,
  'Q8. In this topic, what does attribute refer to?',
  'string',
  'attribute',
  'number',
  'JSON',
  'B',
  'attribute is a key concept in JSON & XML.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000022000009',
  '00000000-0002-4000-a000-000000000022',
  9,
  'Q9. What is document?',
  'serialization',
  'document',
  'data exchange',
  'key',
  'B',
  'document is a key concept in JSON & XML.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000022000010',
  '00000000-0002-4000-a000-000000000022',
  10,
  'Q10. Which option is most directly associated with parser?',
  'namespace',
  'nested data',
  'array',
  'parser',
  'D',
  'parser is a key concept in JSON & XML.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000022000011',
  '00000000-0002-4000-a000-000000000022',
  11,
  'Q11. Which statement best describes serialization?',
  'validation',
  'value',
  'schema',
  'serialization',
  'D',
  'serialization is a key concept in JSON & XML.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000022000012',
  '00000000-0002-4000-a000-000000000022',
  12,
  'Q12. In this topic, what does data exchange refer to?',
  'XML',
  'serialization',
  'data exchange',
  'value',
  'C',
  'data exchange is a key concept in JSON & XML.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000022000013',
  '00000000-0002-4000-a000-000000000022',
  13,
  'Q13. What is API?',
  'schema',
  'API',
  'namespace',
  'attribute',
  'B',
  'API is a key concept in JSON & XML.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000022000014',
  '00000000-0002-4000-a000-000000000022',
  14,
  'Q14. Which option is most directly associated with schema?',
  'validation',
  'schema',
  'namespace',
  'object',
  'B',
  'schema is a key concept in JSON & XML.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000022000015',
  '00000000-0002-4000-a000-000000000022',
  15,
  'Q15. Which statement best describes nested data?',
  'array',
  'string',
  'XML',
  'nested data',
  'D',
  'nested data is a key concept in JSON & XML.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000022000016',
  '00000000-0002-4000-a000-000000000022',
  16,
  'Q16. What is JSON?',
  'nested data',
  'string',
  'JSON',
  'data exchange',
  'C',
  'JSON is a key concept in JSON & XML.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000022000017',
  '00000000-0002-4000-a000-000000000022',
  17,
  'Q17. Which option is most directly associated with XML?',
  'JSON',
  'value',
  'XML',
  'key',
  'C',
  'XML is a key concept in JSON & XML.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000022000018',
  '00000000-0002-4000-a000-000000000022',
  18,
  'Q18. Which statement best describes object?',
  'object',
  'boolean',
  'string',
  'namespace',
  'A',
  'object is a key concept in JSON & XML.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000022000019',
  '00000000-0002-4000-a000-000000000022',
  19,
  'Q19. In this topic, what does array refer to?',
  'value',
  'data exchange',
  'array',
  'number',
  'C',
  'array is a key concept in JSON & XML.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000022000020',
  '00000000-0002-4000-a000-000000000022',
  20,
  'Q20. What is key?',
  'key',
  'serialization',
  'nested data',
  'tag',
  'A',
  'key is a key concept in JSON & XML.'
) ON CONFLICT (id) DO NOTHING;

-- Explore Quiz 23: Authentication & Authorization Challenge Quiz
INSERT INTO public.explore_quizzes (id, title, description, category, branch, difficulty, question_count, estimated_minutes, fx_reward, is_daily, is_published)
VALUES (
  '00000000-0002-4000-a000-000000000023',
  'Authentication & Authorization Challenge Quiz',
  'Test your knowledge on Authentication & Authorization with 20 comprehensive questions.',
  'DevOps',
  'CSE',
  'Advanced',
  20,
  8,
  15,
  FALSE,
  TRUE
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000023000001',
  '00000000-0002-4000-a000-000000000023',
  1,
  'Q1. What is authentication?',
  'password',
  'identity',
  'authentication',
  'permission',
  'C',
  'authentication is a key concept in Authentication & Authorization.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000023000002',
  '00000000-0002-4000-a000-000000000023',
  2,
  'Q2. Which option is most directly associated with authorization?',
  'credential',
  'login',
  'password',
  'authorization',
  'D',
  'authorization is a key concept in Authentication & Authorization.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000023000003',
  '00000000-0002-4000-a000-000000000023',
  3,
  'Q3. Which statement best describes identity?',
  'password',
  'session',
  'logout',
  'identity',
  'D',
  'identity is a key concept in Authentication & Authorization.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000023000004',
  '00000000-0002-4000-a000-000000000023',
  4,
  'Q4. In this topic, what does permission refer to?',
  'role',
  'permission',
  'RBAC',
  'session',
  'B',
  'permission is a key concept in Authentication & Authorization.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000023000005',
  '00000000-0002-4000-a000-000000000023',
  5,
  'Q5. What is role?',
  'credential',
  'security',
  'refresh token',
  'role',
  'D',
  'role is a key concept in Authentication & Authorization.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000023000006',
  '00000000-0002-4000-a000-000000000023',
  6,
  'Q6. Which option is most directly associated with session?',
  'authorization',
  'credential',
  'session',
  'token',
  'C',
  'session is a key concept in Authentication & Authorization.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000023000007',
  '00000000-0002-4000-a000-000000000023',
  7,
  'Q7. Which statement best describes token?',
  'RBAC',
  'least privilege',
  'token',
  'authentication',
  'C',
  'token is a key concept in Authentication & Authorization.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000023000008',
  '00000000-0002-4000-a000-000000000023',
  8,
  'Q8. In this topic, what does password refer to?',
  'refresh token',
  'password',
  'token',
  'authorization',
  'B',
  'password is a key concept in Authentication & Authorization.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000023000009',
  '00000000-0002-4000-a000-000000000023',
  9,
  'Q9. What is MFA?',
  'logout',
  'login',
  'MFA',
  'permission',
  'C',
  'MFA is a key concept in Authentication & Authorization.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000023000010',
  '00000000-0002-4000-a000-000000000023',
  10,
  'Q10. Which option is most directly associated with OAuth?',
  'logout',
  'password',
  'OAuth',
  'login',
  'C',
  'OAuth is a key concept in Authentication & Authorization.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000023000011',
  '00000000-0002-4000-a000-000000000023',
  11,
  'Q11. Which statement best describes access control?',
  'refresh token',
  'authorization',
  'role',
  'access control',
  'D',
  'access control is a key concept in Authentication & Authorization.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000023000012',
  '00000000-0002-4000-a000-000000000023',
  12,
  'Q12. In this topic, what does least privilege refer to?',
  'MFA',
  'security',
  'permission',
  'least privilege',
  'D',
  'least privilege is a key concept in Authentication & Authorization.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000023000013',
  '00000000-0002-4000-a000-000000000023',
  13,
  'Q13. What is login?',
  'identity provider',
  'logout',
  'login',
  'token',
  'C',
  'login is a key concept in Authentication & Authorization.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000023000014',
  '00000000-0002-4000-a000-000000000023',
  14,
  'Q14. Which option is most directly associated with credential?',
  'logout',
  'access control',
  'credential',
  'security',
  'C',
  'credential is a key concept in Authentication & Authorization.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000023000015',
  '00000000-0002-4000-a000-000000000023',
  15,
  'Q15. Which statement best describes RBAC?',
  'RBAC',
  'access control',
  'MFA',
  'identity provider',
  'A',
  'RBAC is a key concept in Authentication & Authorization.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000023000016',
  '00000000-0002-4000-a000-000000000023',
  16,
  'Q16. What is authentication?',
  'token',
  'MFA',
  'authorization',
  'authentication',
  'D',
  'authentication is a key concept in Authentication & Authorization.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000023000017',
  '00000000-0002-4000-a000-000000000023',
  17,
  'Q17. Which option is most directly associated with authorization?',
  'permission',
  'RBAC',
  'authorization',
  'password',
  'C',
  'authorization is a key concept in Authentication & Authorization.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000023000018',
  '00000000-0002-4000-a000-000000000023',
  18,
  'Q18. Which statement best describes identity?',
  'RBAC',
  'token',
  'security',
  'identity',
  'D',
  'identity is a key concept in Authentication & Authorization.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000023000019',
  '00000000-0002-4000-a000-000000000023',
  19,
  'Q19. In this topic, what does permission refer to?',
  'authorization',
  'permission',
  'security',
  'identity',
  'B',
  'permission is a key concept in Authentication & Authorization.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000023000020',
  '00000000-0002-4000-a000-000000000023',
  20,
  'Q20. What is role?',
  'credential',
  'RBAC',
  'token',
  'role',
  'D',
  'role is a key concept in Authentication & Authorization.'
) ON CONFLICT (id) DO NOTHING;

-- Explore Quiz 24: Encryption & Hashing Challenge Quiz
INSERT INTO public.explore_quizzes (id, title, description, category, branch, difficulty, question_count, estimated_minutes, fx_reward, is_daily, is_published)
VALUES (
  '00000000-0002-4000-a000-000000000024',
  'Encryption & Hashing Challenge Quiz',
  'Test your knowledge on Encryption & Hashing with 20 comprehensive questions.',
  'DSA',
  'CSE',
  'Beginner',
  20,
  8,
  15,
  FALSE,
  TRUE
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000024000001',
  '00000000-0002-4000-a000-000000000024',
  1,
  'Q1. What is encryption?',
  'cryptography',
  'asymmetric',
  'digital signature',
  'encryption',
  'D',
  'encryption is a key concept in Encryption & Hashing.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000024000002',
  '00000000-0002-4000-a000-000000000024',
  2,
  'Q2. Which option is most directly associated with decryption?',
  'key',
  'decryption',
  'private key',
  'encryption',
  'B',
  'decryption is a key concept in Encryption & Hashing.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000024000003',
  '00000000-0002-4000-a000-000000000024',
  3,
  'Q3. Which statement best describes key?',
  'encryption',
  'key',
  'plaintext',
  'ciphertext',
  'B',
  'key is a key concept in Encryption & Hashing.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000024000004',
  '00000000-0002-4000-a000-000000000024',
  4,
  'Q4. In this topic, what does plaintext refer to?',
  'TLS',
  'plaintext',
  'password hashing',
  'key',
  'B',
  'plaintext is a key concept in Encryption & Hashing.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000024000005',
  '00000000-0002-4000-a000-000000000024',
  5,
  'Q5. What is ciphertext?',
  'encryption',
  'plaintext',
  'ciphertext',
  'digest',
  'C',
  'ciphertext is a key concept in Encryption & Hashing.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000024000006',
  '00000000-0002-4000-a000-000000000024',
  6,
  'Q6. Which option is most directly associated with hash?',
  'plaintext',
  'hash',
  'encryption',
  'RSA',
  'B',
  'hash is a key concept in Encryption & Hashing.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000024000007',
  '00000000-0002-4000-a000-000000000024',
  7,
  'Q7. Which statement best describes digest?',
  'key',
  'digest',
  'confidentiality',
  'AES',
  'B',
  'digest is a key concept in Encryption & Hashing.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000024000008',
  '00000000-0002-4000-a000-000000000024',
  8,
  'Q8. In this topic, what does salt refer to?',
  'salt',
  'symmetric',
  'plaintext',
  'cryptography',
  'A',
  'salt is a key concept in Encryption & Hashing.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000024000009',
  '00000000-0002-4000-a000-000000000024',
  9,
  'Q9. What is symmetric?',
  'TLS',
  'symmetric',
  'confidentiality',
  'digest',
  'B',
  'symmetric is a key concept in Encryption & Hashing.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000024000010',
  '00000000-0002-4000-a000-000000000024',
  10,
  'Q10. Which option is most directly associated with asymmetric?',
  'key',
  'asymmetric',
  'digest',
  'private key',
  'B',
  'asymmetric is a key concept in Encryption & Hashing.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000024000011',
  '00000000-0002-4000-a000-000000000024',
  11,
  'Q11. Which statement best describes AES?',
  'cryptography',
  'confidentiality',
  'AES',
  'public key',
  'C',
  'AES is a key concept in Encryption & Hashing.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000024000012',
  '00000000-0002-4000-a000-000000000024',
  12,
  'Q12. In this topic, what does RSA refer to?',
  'digest',
  'decryption',
  'RSA',
  'hash',
  'C',
  'RSA is a key concept in Encryption & Hashing.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000024000013',
  '00000000-0002-4000-a000-000000000024',
  13,
  'Q13. What is TLS?',
  'TLS',
  'password hashing',
  'symmetric',
  'integrity',
  'A',
  'TLS is a key concept in Encryption & Hashing.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000024000014',
  '00000000-0002-4000-a000-000000000024',
  14,
  'Q14. Which option is most directly associated with password hashing?',
  'integrity',
  'plaintext',
  'password hashing',
  'key',
  'C',
  'password hashing is a key concept in Encryption & Hashing.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000024000015',
  '00000000-0002-4000-a000-000000000024',
  15,
  'Q15. Which statement best describes integrity?',
  'hash',
  'integrity',
  'decryption',
  'salt',
  'B',
  'integrity is a key concept in Encryption & Hashing.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000024000016',
  '00000000-0002-4000-a000-000000000024',
  16,
  'Q16. What is encryption?',
  'password hashing',
  'salt',
  'encryption',
  'private key',
  'C',
  'encryption is a key concept in Encryption & Hashing.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000024000017',
  '00000000-0002-4000-a000-000000000024',
  17,
  'Q17. Which option is most directly associated with decryption?',
  'RSA',
  'digital signature',
  'decryption',
  'plaintext',
  'C',
  'decryption is a key concept in Encryption & Hashing.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000024000018',
  '00000000-0002-4000-a000-000000000024',
  18,
  'Q18. Which statement best describes key?',
  'private key',
  'confidentiality',
  'key',
  'integrity',
  'C',
  'key is a key concept in Encryption & Hashing.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000024000019',
  '00000000-0002-4000-a000-000000000024',
  19,
  'Q19. In this topic, what does plaintext refer to?',
  'plaintext',
  'RSA',
  'ciphertext',
  'salt',
  'A',
  'plaintext is a key concept in Encryption & Hashing.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000024000020',
  '00000000-0002-4000-a000-000000000024',
  20,
  'Q20. What is ciphertext?',
  'asymmetric',
  'decryption',
  'salt',
  'ciphertext',
  'D',
  'ciphertext is a key concept in Encryption & Hashing.'
) ON CONFLICT (id) DO NOTHING;

-- Explore Quiz 25: Password Security Challenge Quiz
INSERT INTO public.explore_quizzes (id, title, description, category, branch, difficulty, question_count, estimated_minutes, fx_reward, is_daily, is_published)
VALUES (
  '00000000-0002-4000-a000-000000000025',
  'Password Security Challenge Quiz',
  'Test your knowledge on Password Security with 20 comprehensive questions.',
  'DSA',
  'CSE',
  'Intermediate',
  20,
  8,
  15,
  FALSE,
  TRUE
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000025000001',
  '00000000-0002-4000-a000-000000000025',
  1,
  'Q1. What is password?',
  'length',
  'password',
  'password manager',
  'authentication',
  'B',
  'password is a key concept in Password Security.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000025000002',
  '00000000-0002-4000-a000-000000000025',
  2,
  'Q2. Which option is most directly associated with passphrase?',
  'salt',
  'MFA',
  'passphrase',
  'phishing',
  'C',
  'passphrase is a key concept in Password Security.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000025000003',
  '00000000-0002-4000-a000-000000000025',
  3,
  'Q3. Which statement best describes unique?',
  'unique',
  'secret',
  'MFA',
  'authentication',
  'A',
  'unique is a key concept in Password Security.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000025000004',
  '00000000-0002-4000-a000-000000000025',
  4,
  'Q4. In this topic, what does length refer to?',
  'security',
  'credential stuffing',
  'length',
  'reuse',
  'C',
  'length is a key concept in Password Security.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000025000005',
  '00000000-0002-4000-a000-000000000025',
  5,
  'Q5. What is password manager?',
  'breach',
  'password manager',
  'device',
  'secret',
  'B',
  'password manager is a key concept in Password Security.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000025000006',
  '00000000-0002-4000-a000-000000000025',
  6,
  'Q6. Which option is most directly associated with MFA?',
  'password',
  'MFA',
  'unique',
  'length',
  'B',
  'MFA is a key concept in Password Security.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000025000007',
  '00000000-0002-4000-a000-000000000025',
  7,
  'Q7. Which statement best describes reuse?',
  'reuse',
  'salt',
  'reset',
  'authentication',
  'A',
  'reuse is a key concept in Password Security.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000025000008',
  '00000000-0002-4000-a000-000000000025',
  8,
  'Q8. In this topic, what does breach refer to?',
  'reset',
  'breach',
  'authentication',
  'salt',
  'B',
  'breach is a key concept in Password Security.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000025000009',
  '00000000-0002-4000-a000-000000000025',
  9,
  'Q9. What is hashing?',
  'hashing',
  'credential stuffing',
  'lockout',
  'reuse',
  'A',
  'hashing is a key concept in Password Security.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000025000010',
  '00000000-0002-4000-a000-000000000025',
  10,
  'Q10. Which option is most directly associated with salt?',
  'salt',
  'security',
  'rate limiting',
  'password manager',
  'A',
  'salt is a key concept in Password Security.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000025000011',
  '00000000-0002-4000-a000-000000000025',
  11,
  'Q11. Which statement best describes rate limiting?',
  'phishing',
  'reset',
  'secret',
  'rate limiting',
  'D',
  'rate limiting is a key concept in Password Security.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000025000012',
  '00000000-0002-4000-a000-000000000025',
  12,
  'Q12. In this topic, what does lockout refer to?',
  'salt',
  'MFA',
  'security',
  'lockout',
  'D',
  'lockout is a key concept in Password Security.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000025000013',
  '00000000-0002-4000-a000-000000000025',
  13,
  'Q13. What is credential stuffing?',
  'security',
  'MFA',
  'credential stuffing',
  'reset',
  'C',
  'credential stuffing is a key concept in Password Security.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000025000014',
  '00000000-0002-4000-a000-000000000025',
  14,
  'Q14. Which option is most directly associated with phishing?',
  'length',
  'authentication',
  'phishing',
  'recovery',
  'C',
  'phishing is a key concept in Password Security.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000025000015',
  '00000000-0002-4000-a000-000000000025',
  15,
  'Q15. Which statement best describes reset?',
  'reset',
  'unique',
  'passphrase',
  'MFA',
  'A',
  'reset is a key concept in Password Security.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000025000016',
  '00000000-0002-4000-a000-000000000025',
  16,
  'Q16. What is password?',
  'password',
  'passphrase',
  'rate limiting',
  'salt',
  'A',
  'password is a key concept in Password Security.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000025000017',
  '00000000-0002-4000-a000-000000000025',
  17,
  'Q17. Which option is most directly associated with passphrase?',
  'passphrase',
  'salt',
  'recovery',
  'phishing',
  'A',
  'passphrase is a key concept in Password Security.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000025000018',
  '00000000-0002-4000-a000-000000000025',
  18,
  'Q18. Which statement best describes unique?',
  'unique',
  'device',
  'secret',
  'password',
  'A',
  'unique is a key concept in Password Security.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000025000019',
  '00000000-0002-4000-a000-000000000025',
  19,
  'Q19. In this topic, what does length refer to?',
  'password manager',
  'reuse',
  'length',
  'rate limiting',
  'C',
  'length is a key concept in Password Security.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000025000020',
  '00000000-0002-4000-a000-000000000025',
  20,
  'Q20. What is password manager?',
  'password manager',
  'phishing',
  'reuse',
  'hashing',
  'A',
  'password manager is a key concept in Password Security.'
) ON CONFLICT (id) DO NOTHING;


COMMIT;