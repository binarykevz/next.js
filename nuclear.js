const fs = require('fs');
const { execSync } = require('child_process');

// 1. Global replace in all animation files
const files = [
  'src/app/page.tsx',
  'src/components/AppLoader.tsx',
  'src/components/CountryDiscovery.tsx',
  'src/components/JournalCard.tsx',
  'src/components/MapShell.tsx',
  'src/components/SiteHeader.tsx'
];

files.forEach(f => {
  if (fs.existsSync(f)) {
    let c = fs.readFileSync(f, 'utf8');
    if (c.includes('motion/react')) {
      c = c.replace(/motion\/react/g, 'framer-motion');
      fs.writeFileSync(f, c);
      console.log('✅ Fixed:', f);
    }
  }
});

// 2. Inject a MASSIVE visual marker so we know Cloudflare is building THIS exact commit
let page = fs.readFileSync('src/app/page.tsx', 'utf8');
if (!page.includes('BUILD V99')) {
  page = page.replace(
    'return (<>', 
    'return (<><h1 style={{color:"lime",fontSize:"60px",position:"fixed",top:0,left:0,zIndex:99999,background:"black",padding:"20px"}}>BUILD V99</h1>'
  );
  fs.writeFileSync('src/app/page.tsx', page);
  console.log('✅ Injected BUILD V99 marker');
}

// 3. Force commit and push to main branch
console.log('\n⏳ Pushing to GitHub...');
try {
  execSync('git add .', { stdio: 'inherit' });
  execSync('git commit -m "Nuclear V99: Global replace and visual marker"', { stdio: 'inherit' });
  execSync('git push origin main', { stdio: 'inherit' });
  console.log('\n🎉 Successfully pushed to GitHub!');
} catch (e) {
  console.log('⚠️ Git push failed. Check your terminal output.');
}
