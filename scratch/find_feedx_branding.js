const fs = require('fs');
const path = require('path');

function walk(dir) {
  let res = [];
  const files = fs.readdirSync(dir);
  for (const f of files) {
    if (f === 'node_modules' || f === '.git' || f === '.expo' || f === 'scratch') continue;
    const full = path.join(dir, f);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) res = res.concat(walk(full));
    else if (/\.(tsx|ts|jsx|js)$/.test(f)) res.push(full);
  }
  return res;
}

const all = walk('.');
const found = [];

for (const file of all) {
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');
  lines.forEach((line, idx) => {
    // Check if line contains Feedx or FeedX
    if (/Feed[xX]/.test(line)) {
      // Exclude import statements, variable declarations like resolveStandardFeedXId, feedx_id, etc.
      // We want to detect visible UI strings like 'Welcome to FeedX', 'FeedX Polytechnic', 'FeedX ID', etc.
      if (!line.includes('from ') && !line.includes('import ') && !line.includes('feedx_id') && !line.includes('resolveStandardFeedXId')) {
        found.push({ file, line: idx + 1, content: line.trim() });
      }
    }
  });
}

console.log(`Found ${found.length} occurrences:`);
found.forEach(item => console.log(`${item.file}:${item.line} -> ${item.content}`));
