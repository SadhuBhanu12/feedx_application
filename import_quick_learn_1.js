const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://ktontqbfcinzqvalxyqd.supabase.co';
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0b250cWJmY2luenF2YWx4eXFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc2NTE0MzUsImV4cCI6MjA5MzIyNzQzNX0.XZPB5rzKKyHQW6HrKsiwFJoPJnQDEhqOT5jzYKEhQp8';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const GIT_QUESTIONS = [
  {
    q: "Which tool tracks changes in a project’s files?",
    a: "Git",
    b: "GitHub",
    c: "Docker",
    d: "SQL",
    correct: "A",
    explanation: "Git is the version-control tool used to track changes."
  },
  {
    q: "What is GitHub?",
    a: "A hosted platform for Git repositories and collaboration",
    b: "A programming language",
    c: "A database engine",
    d: "A computer network protocol",
    correct: "A",
    explanation: "GitHub provides hosted repositories and collaboration features around Git."
  },
  {
    q: "What does a Git commit represent?",
    a: "A saved change in repository history",
    b: "A remote server",
    c: "A programming language",
    d: "A network address",
    correct: "A",
    explanation: "A commit records a set of changes in Git history."
  },
  {
    q: "What is a branch used for?",
    a: "A separate line of development",
    b: "Encrypting a file",
    c: "Running a database",
    d: "Creating a network",
    correct: "A",
    explanation: "Branches let developers work on separate lines of development."
  },
  {
    q: "What does git clone do?",
    a: "Copies a repository to a local environment",
    b: "Deletes a repository",
    c: "Creates a password",
    d: "Publishes a website",
    correct: "A",
    explanation: "Clone creates a local copy of a repository."
  },
  {
    q: "What is a pull request?",
    a: "A proposal to merge changes",
    b: "A database query",
    c: "A password reset",
    d: "A cloud storage bucket",
    correct: "A",
    explanation: "A pull request is used to propose and review changes before merging."
  },
  {
    q: "What does git push do?",
    a: "Sends local commits to a remote repository",
    b: "Deletes commits",
    c: "Creates an HTML page",
    d: "Starts a firewall",
    correct: "A",
    explanation: "Push transfers local commits to a configured remote."
  },
  {
    q: "What does git pull commonly do?",
    a: "Fetches and integrates changes from a remote",
    b: "Formats a disk",
    c: "Creates a database",
    d: "Encrypts a password",
    correct: "A",
    explanation: "Pull obtains remote changes and integrates them into the current branch."
  },
  {
    q: "What is a repository?",
    a: "A location containing a project's files and version history",
    b: "A network cable",
    c: "A browser",
    d: "A password",
    correct: "A",
    explanation: "A repository contains project files and version-control history."
  },
  {
    q: "What is GitHub Actions commonly used for?",
    a: "Automating workflows such as testing and deployment",
    b: "Writing SQL queries",
    c: "Drawing circuits",
    d: "Managing IP addresses",
    correct: "A",
    explanation: "GitHub Actions automates repository workflows."
  },
  {
    q: "What is a fork on GitHub?",
    a: "A personal copy of another repository on GitHub",
    b: "A local password",
    c: "A network protocol",
    d: "A compiler",
    correct: "A",
    explanation: "A fork creates a separate copy of a repository under another account or organization."
  },
  {
    q: "What does the staging area do in Git?",
    a: "Prepares selected changes for a commit",
    b: "Stores cloud backups",
    c: "Runs a web server",
    d: "Encrypts traffic",
    correct: "A",
    explanation: "The staging area lets you choose changes to include in the next commit."
  },
  {
    q: "What does git diff show?",
    a: "Changes between versions or working states",
    b: "Internet speed",
    c: "Database tables",
    d: "CPU temperature",
    correct: "A",
    explanation: "Git diff displays differences between file states."
  },
  {
    q: "What is a Git tag often used for?",
    a: "Naming a specific point such as a release",
    b: "Creating a firewall",
    c: "Storing passwords",
    d: "Running a database",
    correct: "A",
    explanation: "Tags provide named references to particular commits, often releases."
  },
  {
    q: "Why use version control?",
    a: "To track changes and collaborate safely",
    b: "To increase screen brightness",
    c: "To replace an operating system",
    d: "To compress videos",
    correct: "A",
    explanation: "Version control tracks changes and supports collaboration and recovery."
  }
];

async function updateGitLesson() {
  console.log("Updating Quick Learn 1 in Supabase...");
  const lessonId = '00000000-0000-4000-a000-000000000001';

  // 1. Update lesson content
  const learningText = "Git is a distributed version-control system used to track changes in files and collaborate on software. GitHub is a cloud platform built around Git that provides repositories, pull requests, issues, actions and collaboration features.";
  const keyPts = "- **Git**\n- **GitHub**\n- **repository**\n- **commit**\n- **branch**\n- **merge**";
  const contentMd = `### Learning Text\n${learningText}\n\n### Key Points\n${keyPts}`;

  await supabase.from('quick_learn_lessons').upsert({
    id: lessonId,
    title: 'GitHub & Git Basics',
    slug: 'github-git-basics',
    branch: 'CSE',
    category: 'DevOps',
    difficulty: 'Beginner',
    estimated_minutes: 3,
    is_recommended: true,
    fx_reward: 10,
    short_description: 'Master GitHub & Git Basics fundamentals with quick reading and 15 practice MCQs on FEEDX.',
    content_markdown: contentMd,
    is_published: true
  });

  // 2. Delete existing checks for lesson 1
  await supabase.from('quick_learn_checks').delete().eq('lesson_id', lessonId);

  // 3. Insert exact 15 Git MCQs
  const rows = GIT_QUESTIONS.map((q, idx) => ({
    id: `00000000-0001-4000-a000-000001${String(idx + 1).padStart(6, '0')}`,
    lesson_id: lessonId,
    question_text: `Q${idx + 1}. ${q.q}`,
    option_a: q.a,
    option_b: q.b,
    option_c: q.c,
    option_d: q.d,
    correct_option: q.correct,
    explanation: `Option ${q.correct} is correct. ${q.explanation}`
  }));

  const { error } = await supabase.from('quick_learn_checks').insert(rows);
  if (error) {
    console.error("Error inserting checks:", error);
  } else {
    console.log("Successfully updated Quick Learn 1 with exact 15 Git questions!");
  }
}

updateGitLesson().catch(console.error);
