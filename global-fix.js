const fs = require('fs');
const path = require('path');

// Recursively find all .ts and .tsx files in the src folder
function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('.ts') || file.endsWith('.tsx')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk('./src');
let fixedCount = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  // Replace any instance of motion/react with framer-motion
  if (content.includes('motion/react')) {
    content = content.replace(/motion\/react/g, 'framer-motion');
    fs.writeFileSync(file, content);
    console.log(`✅ Fixed imports in: ${file}`);
    fixedCount++;
  }
});

if (fixedCount === 0) {
  console.log('ℹ️ No files contained "motion/react".');
} else {
  console.log(`\n🎉 Successfully fixed ${fixedCount} files!`);
}
