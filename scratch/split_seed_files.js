const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '../supabase');
const qlContent = fs.readFileSync(path.join(dir, 'seed_1_quick_learns.sql'), 'utf8');
const qzContent = fs.readFileSync(path.join(dir, 'seed_2_quizzes.sql'), 'utf8');

// Split Quick Learns at "-- Quick Learn 26:"
const qlParts = qlContent.split(/-- Quick Learn 26:/);
const qlPart1 = qlParts[0] + '\nCOMMIT;';
const qlPart2 = 'BEGIN;\n\n-- Quick Learn 26:' + qlParts[1];

fs.writeFileSync(path.join(dir, 'seed_part1_quick_learns_1_to_25.sql'), qlPart1);
fs.writeFileSync(path.join(dir, 'seed_part2_quick_learns_26_to_50.sql'), qlPart2);

// Split Quizzes at "-- Explore Quiz 26:" or "Quiz 26:"
const qzParts = qzContent.split(/-- Explore Quiz 26:/);
const qzPart1 = qzParts[0] + '\nCOMMIT;';
const qzPart2 = 'BEGIN;\n\n-- Explore Quiz 26:' + qzParts[1];

fs.writeFileSync(path.join(dir, 'seed_part3_quizzes_1_to_25.sql'), qzPart1);
fs.writeFileSync(path.join(dir, 'seed_part4_quizzes_26_to_50.sql'), qzPart2);

console.log('Successfully created 4 split SQL seed files:');
console.log('Part 1:', (fs.statSync(path.join(dir, 'seed_part1_quick_learns_1_to_25.sql')).size / 1024).toFixed(1), 'KB');
console.log('Part 2:', (fs.statSync(path.join(dir, 'seed_part2_quick_learns_26_to_50.sql')).size / 1024).toFixed(1), 'KB');
console.log('Part 3:', (fs.statSync(path.join(dir, 'seed_part3_quizzes_1_to_25.sql')).size / 1024).toFixed(1), 'KB');
console.log('Part 4:', (fs.statSync(path.join(dir, 'seed_part4_quizzes_26_to_50.sql')).size / 1024).toFixed(1), 'KB');
