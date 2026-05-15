const { execSync } = require('child_process');
const path = require('path');

console.log('--- Starting Production Boot Sequence ---');

try {
  // 1. توليد Prisma Client برمجياً قبل بدء التطبيق
  console.log('Generating Prisma Client...');
  execSync('npx prisma generate', {
    cwd: path.join(__dirname, 'packages/database'),
    stdio: 'inherit',
  });
  console.log('Prisma Client generated successfully.');
} catch (error) {
  console.error('Prisma Generation Failed:', error);
}

// 2. إعداد المسارات (Node Paths)
const nodePath = [
  path.join(__dirname, 'node_modules'),
  path.join(__dirname, 'apps/api/node_modules'),
  path.join(__dirname, 'packages/database/node_modules')
].join(path.delimiter);

process.env.NODE_PATH = nodePath;
require('module').Module._initPaths();

// 3. تشغيل التطبيق الأصلي
console.log('Launching NestJS Application...');
require('./apps/api/dist/main.js');
