const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '../supabase');

function addOnConflictToQuizzes(sql) {
  // Replace INSERT INTO public.explore_quizzes ... VALUES (...); with ON CONFLICT (id) DO NOTHING;
  let out = sql.replace(
    /(INSERT INTO public\.explore_quizzes[\s\S]*?VALUES[\s\S]*?\);)/g,
    (m) => {
      if (m.includes('ON CONFLICT')) return m;
      return m.slice(0, -1) + ' ON CONFLICT (id) DO NOTHING;';
    }
  );

  // Replace INSERT INTO public.explore_quiz_questions ... VALUES (...); with ON CONFLICT (id) DO NOTHING;
  out = out.replace(
    /(INSERT INTO public\.explore_quiz_questions[\s\S]*?VALUES[\s\S]*?\);)/g,
    (m) => {
      if (m.includes('ON CONFLICT')) return m;
      return m.slice(0, -1) + ' ON CONFLICT (id) DO NOTHING;';
    }
  );

  // Replace INSERT INTO public.quick_learn_checks ... VALUES (...); with ON CONFLICT (id) DO NOTHING;
  out = out.replace(
    /(INSERT INTO public\.quick_learn_checks[\s\S]*?VALUES[\s\S]*?\);)/g,
    (m) => {
      if (m.includes('ON CONFLICT')) return m;
      return m.slice(0, -1) + ' ON CONFLICT (id) DO NOTHING;';
    }
  );

  // Replace INSERT INTO public.quick_learn_lessons ... VALUES (...); with ON CONFLICT (id) DO NOTHING;
  out = out.replace(
    /(INSERT INTO public\.quick_learn_lessons[\s\S]*?VALUES[\s\S]*?\);)/g,
    (m) => {
      if (m.includes('ON CONFLICT')) return m;
      return m.slice(0, -1) + ' ON CONFLICT (id) DO NOTHING;';
    }
  );

  return out;
}

let qlContent = fs.readFileSync(path.join(dir, 'seed_1_quick_learns.sql'), 'utf8');
let qzContent = fs.readFileSync(path.join(dir, 'seed_2_quizzes.sql'), 'utf8');

qlContent = addOnConflictToQuizzes(qlContent);
qzContent = addOnConflictToQuizzes(qzContent);

fs.writeFileSync(path.join(dir, 'seed_1_quick_learns.sql'), qlContent);
fs.writeFileSync(path.join(dir, 'seed_2_quizzes.sql'), qzContent);

// Split into 4 idempotent parts
const qlParts = qlContent.split(/-- Quick Learn 26:/);
const qlPart1 = qlParts[0] + '\nCOMMIT;';
const qlPart2 = 'BEGIN;\n\n-- Quick Learn 26:' + qlParts[1];

fs.writeFileSync(path.join(dir, 'seed_part1_quick_learns_1_to_25.sql'), qlPart1);
fs.writeFileSync(path.join(dir, 'seed_part2_quick_learns_26_to_50.sql'), qlPart2);

const qzParts = qzContent.split(/-- Explore Quiz 26:/);
const qzPart1 = qzParts[0] + '\nCOMMIT;';
const qzPart2 = 'BEGIN;\n\n-- Explore Quiz 26:' + qzParts[1];

fs.writeFileSync(path.join(dir, 'seed_part3_quizzes_1_to_25.sql'), qzPart1);
fs.writeFileSync(path.join(dir, 'seed_part4_quizzes_26_to_50.sql'), qzPart2);

console.log('Successfully made all seed files 100% idempotent with ON CONFLICT (id) DO NOTHING!');
