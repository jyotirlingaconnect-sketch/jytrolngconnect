#!/usr/bin/env node

/**
 * Frame Optimization Script
 * 
 * Optimizes the 240 WebP frame sequence for web delivery:
 * - Reports current total size
 * - Re-encodes at quality 70 with smart compression
 * - Resizes to max 1920px width (cover hero viewport)
 * - Reports before/after savings
 * 
 * Usage: node scripts/optimize-frames.mjs
 */

import sharp from "sharp";
import { copyFile, readdir, rm, stat } from "fs/promises";
import { join } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const FRAMES_DIR = join(__dirname, "..", "public", "frames");
const MAX_WIDTH = 1920; // Max viewport width for hero
const WEBP_QUALITY = 70; // Balance between size and visual quality

async function getDirectorySize(dirPath) {
  const files = await readdir(dirPath);
  let totalSize = 0;

  for (const file of files) {
    if (!file.endsWith(".webp")) continue;
    const filePath = join(dirPath, file);
    const stats = await stat(filePath);
    totalSize += stats.size;
  }

  return totalSize;
}

function formatBytes(bytes) {
  return (bytes / (1024 * 1024)).toFixed(2) + " MB";
}

async function optimizeFrame(filePath) {
  const image = sharp(filePath);
  const metadata = await image.metadata();

  // Only resize if wider than max
  const shouldResize = metadata.width > MAX_WIDTH;

  const tmpPath = filePath + ".tmp";

  try {
    await image
      .resize(shouldResize ? { width: MAX_WIDTH, withoutEnlargement: true } : undefined)
      .webp({
        quality: WEBP_QUALITY,
        effort: 6, // Higher effort = better compression (0-6)
        smartSubsample: true,
      })
      .toFile(tmpPath);

    // Copy tmp over the original (Windows workaround for locked files)
    let retries = 5;
    while (retries > 0) {
      try {
        await copyFile(tmpPath, filePath);
        break;
      } catch (e) {
        retries--;
        if (retries === 0) {
          console.error(`Failed to replace ${filePath}:`, e.message);
          throw e;
        }
        // Wait progressively longer on each retry
        await new Promise(resolve => setTimeout(resolve, 300 * (6 - retries)));
      }
    }
  } finally {
    // Always remove the tmp file, even if encoding or copying failed
    await rm(tmpPath, { force: true, maxRetries: 5, retryDelay: 300 });
  }
}

// Safety net: public/ is deployed as-is, so never leave .tmp files behind
async function removeTmpFiles() {
  const leftovers = (await readdir(FRAMES_DIR)).filter((f) => f.endsWith(".tmp"));
  for (const file of leftovers) {
    await rm(join(FRAMES_DIR, file), { force: true, maxRetries: 5, retryDelay: 300 });
  }
  if (leftovers.length > 0) {
    console.log(`🧹 Removed ${leftovers.length} leftover .tmp file(s)`);
  }
}

async function main() {
  console.log("🎬 Frame Optimization Script\n");
  console.log(`📂 Processing: ${FRAMES_DIR}\n`);

  // Get before size
  const sizeBefore = await getDirectorySize(FRAMES_DIR);
  console.log(`📊 Current total size: ${formatBytes(sizeBefore)}\n`);

  // Get all frame files
  const files = (await readdir(FRAMES_DIR))
    .filter((f) => f.endsWith(".webp"))
    .sort();

  console.log(`🔧 Optimizing ${files.length} frames...`);
  console.log(`   - Max width: ${MAX_WIDTH}px`);
  console.log(`   - WebP quality: ${WEBP_QUALITY}`);
  console.log(`   - Smart compression: enabled\n`);

  let processed = 0;

  // Process serially instead of in batches to avoid file locking issues on Windows
  const processingStartTime = Date.now();

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const filePath = join(FRAMES_DIR, file);
    await optimizeFrame(filePath);
    processed++;
    if (processed % 20 === 0 || processed === files.length) {
      process.stdout.write(`   Processed ${processed}/${files.length}...\n`);
    }
  }

  const duration = ((Date.now() - processingStartTime) / 1000).toFixed(1);
  console.log(`\n✅ Processed ${processed} frames in ${duration}s\n`);

  // Get after size
  const sizeAfter = await getDirectorySize(FRAMES_DIR);
  const saved = sizeBefore - sizeAfter;
  const percentSaved = ((saved / sizeBefore) * 100).toFixed(1);

  console.log("📊 Results:");
  console.log(`   Before:  ${formatBytes(sizeBefore)}`);
  console.log(`   After:   ${formatBytes(sizeAfter)}`);
  console.log(`   Saved:   ${formatBytes(saved)} (${percentSaved}% reduction)\n`);

  console.log("🎉 Optimization complete!");
}

main()
  .catch((err) => {
    console.error("❌ Error:", err.message);
    process.exitCode = 1;
  })
  .finally(removeTmpFiles);
