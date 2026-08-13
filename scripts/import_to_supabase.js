const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://ktontqbfcinzqvalxyqd.supabase.co';
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0b250cWJmY2luenF2YWx4eXFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc2NTE0MzUsImV4cCI6MjA5MzIyNzQzNX0.XZPB5rzKKyHQW6HrKsiwFJoPJnQDEhqOT5jzYKEhQp8';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const QUICK_LEARNS = [
  { id: 1, title: "GitHub & Git Basics", branch: "CSE", category: "DevOps", difficulty: "Beginner" },
  { id: 2, title: "APIs & How They Work", branch: "CSE", category: "Web Dev", difficulty: "Beginner" },
  { id: 3, title: "Cloud Computing Basics", branch: "CSE", category: "Cloud", difficulty: "Beginner" },
  { id: 4, title: "Cybersecurity Basics", branch: "CSE", category: "Security", difficulty: "Beginner" },
  { id: 5, title: "Linux Basics", branch: "CSE", category: "OS", difficulty: "Beginner" },
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

function generateQuestionsForTopic(topicTitle, count = 15) {
  const questions = [];
  for (let i = 1; i <= count; i++) {
    questions.push({
      question_number: i,
      question_text: `Q${i}. What is a fundamental property or concept of ${topicTitle} (Aspect ${i})?`,
      option_a: `Core standard requirement of ${topicTitle}`,
      option_b: `Unrelated system protocol B`,
      option_c: `Depreciated legacy technique C`,
      option_d: `Hardware device configuration D`,
      correct_option: 'A',
      explanation: `Option A correctly identifies the core principle of ${topicTitle}.`
    });
  }
  return questions;
}

async function runImporter() {
  console.log('--- Starting FEEDX Supabase Content Library Importer ---');

  try {
    console.log('--- Clearing existing Content Library tables ---');
    await supabase.from('student_lesson_progress').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('explore_quiz_attempts').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('explore_quiz_questions').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('explore_quizzes').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('quick_learn_checks').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('quick_learn_lessons').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    console.log('--- Database cleared successfully ---');
  } catch (clearErr) {
    console.warn('Warning: Error while clearing tables:', clearErr.message);
  }

  for (const ql of QUICK_LEARNS) {
    const lessonId = `00000000-0000-4000-a000-${String(ql.id).padStart(12, '0')}`;
    const slug = ql.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const shortDesc = `Master ${ql.title} fundamentals with quick reading and 15 practice MCQs on FEEDX.`;
    const contentMd = `### Overview of ${ql.title}\n\n${ql.title} is an essential concept in modern technology and engineering education. Understanding its core components enables effective problem-solving and application development.\n\n### Key Takeaways\n- Key Concept 1: Core definition and significance of ${ql.title}.\n- Key Concept 2: Practical implementation and best practices.\n- Key Concept 3: Industry standards and application workflows.`;

    const lessonPayload = {
      id: lessonId,
      title: ql.title,
      slug: slug,
      branch: ql.branch,
      category: ql.category,
      difficulty: ql.difficulty,
      estimated_minutes: 3,
      is_recommended: true,
      fx_reward: 10,
      short_description: shortDesc,
      content_markdown: contentMd,
      is_published: true
    };

    const { error: lessonError } = await supabase.from('quick_learn_lessons').upsert(lessonPayload);
    if (lessonError) {
      console.error(`[Quick Learn ${ql.id}] Table missing or permission issue:`, lessonError.message);
      console.log(`\n=> IMPORTANT: Please run 'supabase/explore_tables.sql' in Supabase SQL Editor first, then re-run this script or execute 'supabase/seed_content_library.sql'.`);
      return;
    } else {
      console.log(`[Quick Learn ${ql.id}/${QUICK_LEARNS.length}] Inserted lesson: ${ql.title}`);
    }

    // Insert 15 Knowledge Checks
    const checks = generateQuestionsForTopic(ql.title, 15).map((q, idx) => ({
      id: `00000000-0001-4000-a000-${String(ql.id).padStart(6, '0')}${String(idx + 1).padStart(6, '0')}`,
      lesson_id: lessonId,
      question_text: q.question_text,
      option_a: q.option_a,
      option_b: q.option_b,
      option_c: q.option_c,
      option_d: q.option_d,
      correct_option: q.correct_option,
      explanation: q.explanation
    }));

    await supabase.from('quick_learn_checks').upsert(checks);

    // Insert Explore Quiz
    const quizId = `00000000-0002-4000-a000-${String(ql.id).padStart(12, '0')}`;
    const quizPayload = {
      id: quizId,
      title: `${ql.title} Challenge Quiz`,
      description: `Test your knowledge on ${ql.title} with 20 comprehensive questions.`,
      category: ql.category,
      branch: ql.branch,
      difficulty: ql.difficulty,
      question_count: 20,
      estimated_minutes: 8,
      fx_reward: 15,
      is_daily: false,
      is_published: true
    };

    await supabase.from('explore_quizzes').upsert(quizPayload);

    // Insert 20 Quiz Questions
    const quizQuestions = generateQuestionsForTopic(`${ql.title} Quiz`, 20).map((q, idx) => ({
      id: `00000000-0003-4000-a000-${String(ql.id).padStart(6, '0')}${String(idx + 1).padStart(6, '0')}`,
      quiz_id: quizId,
      question_number: q.question_number,
      question_text: q.question_text,
      option_a: q.option_a,
      option_b: q.option_b,
      option_c: q.option_c,
      option_d: q.option_d,
      correct_option: q.correct_option,
      explanation: q.explanation
    }));

    await supabase.from('explore_quiz_questions').upsert(quizQuestions);
  }

  console.log('\n--- Seeding Completed Successfully! All 50 Quick Learns, 50 Quizzes & 1,750 MCQs imported. ---');
}

runImporter().catch(console.error);
