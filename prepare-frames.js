const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'ezgif-split');
const destDir = path.join(__dirname, 'jyotirling-connect', 'public', 'frames');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

const files = fs.readdirSync(srcDir).filter(f => f.endsWith('.png') || f.endsWith('.webp'));
// Sort to ensure correct sequential order
files.sort((a, b) => {
  const numA = parseInt(a.match(/frame_(\d+)/)[1], 10);
  const numB = parseInt(b.match(/frame_(\d+)/)[1], 10);
  return numA - numB;
});

files.forEach((file, index) => {
  const srcPath = path.join(srcDir, file);
  // Name them like frame_000.png, frame_001.png, etc.
  const numStr = String(index).padStart(3, '0');
  const ext = path.extname(file);
  const destPath = path.join(destDir, `frame_${numStr}${ext}`);
  
  fs.copyFileSync(srcPath, destPath);
});

console.log(`Copied and renamed ${files.length} frames to ${destDir}`);
