const fs = require('fs');

// 1. Force package.json to use Tailwind v3
const pkgPath = './package.json';
let pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
pkg.devDependencies = pkg.devDependencies || {};
pkg.devDependencies['tailwindcss'] = '3.4.1';
pkg.devDependencies['postcss'] = '8.4.35';
pkg.devDependencies['autoprefixer'] = '10.4.17';
delete pkg.devDependencies['@tailwindcss/postcss'];
delete pkg.devDependencies['@cloudflare/next-on-pages'];
delete pkg.dependencies?.['tailwindcss']; 
fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
console.log('✅ Fixed package.json');

// 2. Fix postcss.config.mjs
fs.writeFileSync('postcss.config.mjs', `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}\n`);
console.log('✅ Fixed postcss.config.mjs');

// 3. Fix tailwind.config.ts (removes tailwindcss-animate requirement)
fs.writeFileSync('tailwind.config.ts', `import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: { extend: {} },
  plugins: [],
};
export default config;
`);
console.log('✅ Fixed tailwind.config.ts');

// 4. Fix globals.css (strips v4 imports, adds v3 directives)
let css = fs.readFileSync('src/app/globals.css', 'utf8');
css = css.replace(/@import\s+["']tailwindcss["'];?/g, '');
css = css.replace(/@tailwind\s+base;?/g, '');
css = css.replace(/@tailwind\s+components;?/g, '');
css = css.replace(/@tailwind\s+utilities;?/g, '');
css = `@tailwind base;\n@tailwind components;\n@tailwind utilities;\n\n` + css;
fs.writeFileSync('src/app/globals.css', css);
console.log('✅ Fixed globals.css');

console.log('\n🎉 All configuration files are now perfectly aligned for Tailwind v3!');
