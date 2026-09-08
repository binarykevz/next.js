const fs = require('fs');
const { execSync } = require('child_process');

console.log('1. Replacing unstable "motion" package with rock-solid "framer-motion"...');
execSync('npm uninstall motion', { stdio: 'inherit' });
execSync('npm install framer-motion@10.18.0', { stdio: 'inherit' });

const filesToFix = [
  'src/components/AppLoader.tsx',
  'src/components/SiteHeader.tsx',
  'src/components/CountryDiscovery.tsx',
  'src/components/JournalCard.tsx',
  'src/components/MapShell.tsx',
  'src/app/page.tsx'
];

filesToFix.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    if (content.includes('motion/react')) {
      content = content.replace(/from ["']motion\/react["']/g, 'from "framer-motion"');
      fs.writeFileSync(file, content);
      console.log(`✅ Fixed imports in ${file}`);
    }
  }
});

console.log('\n2. Clearing Next.js build cache...');
try { execSync('rmdir /s /q .next', { stdio: 'inherit' }); } catch(e) {}
try { execSync('rmdir /s /q out', { stdio: 'inherit' }); } catch(e) {}

console.log('\n🎉 Ready to rebuild!');
