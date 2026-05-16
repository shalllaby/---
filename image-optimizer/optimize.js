const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const glob = require('glob');

const publicDir = path.resolve(__dirname, '../apps/web/public').replace(/\\/g, '/');
const srcDir = path.resolve(__dirname, '../apps/web/src').replace(/\\/g, '/');

async function optimizeImages() {
  const files = glob.sync(`${publicDir}/**/*.{png,jpg,jpeg}`);
  console.log(`Found ${files.length} images to optimize.`);

  const renameMap = new Map();
  let totalSaved = 0;

  for (const file of files) {
    const ext = path.extname(file);
    const dir = path.dirname(file);
    let base = path.basename(file, ext);
    
    // clean up weird names like "logo (1)" if needed, but we'll leave them to avoid breaking references
    const newFile = path.join(dir, `${base}.webp`);

    console.log(`Processing: ${path.basename(file)}`);
    
    const originalStat = fs.statSync(file);
    const originalSize = originalStat.size;

    let quality = 80;
    let width = 1200;
    let done = false;
    let newStat;
    
    while (!done) {
      await sharp(file)
        .resize({ width, withoutEnlargement: true })
        .webp({ quality, effort: 6 })
        .toFile(newFile);

      newStat = fs.statSync(newFile);
      if (newStat.size <= 80 * 1024 || quality <= 30) {
        done = true;
        const saved = originalSize - newStat.size;
        totalSaved += saved;
        console.log(`  -> ${base}.webp (Original: ${(originalSize/1024).toFixed(2)}KB, New: ${(newStat.size/1024).toFixed(2)}KB, Saved: ${(saved/1024).toFixed(2)}KB)`);
        
        const relativeOld = path.relative(publicDir, file).replace(/\\/g, '/');
        const relativeNew = path.relative(publicDir, newFile).replace(/\\/g, '/');
        
        renameMap.set('/' + relativeOld, '/' + relativeNew);
        renameMap.set(relativeOld, relativeNew);
        renameMap.set(path.basename(relativeOld), path.basename(relativeNew));
        
        fs.unlinkSync(file);
      } else {
        quality -= 10;
        if (width > 800) width -= 200;
      }
    }
  }

  console.log(`\nTotal space saved: ${(totalSaved / (1024 * 1024)).toFixed(2)} MB`);

  console.log('\nRefactoring code...');
  const codeFiles = glob.sync(`${srcDir}/**/*.{ts,tsx,js,jsx,css}`);
  let modifiedCount = 0;

  for (const file of codeFiles) {
    let content = fs.readFileSync(file, 'utf8');
    let modified = false;

    // We should sort the map keys by length descending so we match longest paths first (e.g. /images/logo.png before logo.png)
    const sortedEntries = Array.from(renameMap.entries()).sort((a, b) => b[0].length - a[0].length);

    for (const [oldName, newName] of sortedEntries) {
      const safeOldName = oldName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      // match exact string literal or template literal contents
      const regex = new RegExp(`(['"\`])${safeOldName}(['"\`])`, 'g');
      
      if (regex.test(content)) {
        content = content.replace(regex, `$1${newName}$2`);
        modified = true;
      }
    }

    if (modified) {
      fs.writeFileSync(file, content, 'utf8');
      modifiedCount++;
      console.log(`  Updated: ${path.relative(srcDir, file)}`);
    }
  }
  
  console.log(`\nOptimization complete. Updated ${modifiedCount} files.`);
}

optimizeImages().catch(err => console.error(err));
