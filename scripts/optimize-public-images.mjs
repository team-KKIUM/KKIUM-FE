#!/usr/bin/env node
/**
 * Optimizes public raster/SVG assets used on the home LCP path.
 * - SVGO for SVGs
 * - Extracts embedded JPEG from job-type-background.svg when present
 * - macOS: resize/compress via `sips`
 * - Linux (CodeBuild 등): extracted JPEG를 opt 경로로 복사 (sips 미사용)
 */
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const publicDir = path.resolve('public');
const jobTypeSvg = path.join(publicDir, 'job-type-background.svg');
const emptyTypeSvg = path.join(publicDir, 'empty-type.svg');
const optPath = path.join(publicDir, 'job-type-background-opt.jpg');

function hasSips() {
  if (process.platform !== 'darwin') {
    return false;
  }

  try {
    execSync('which sips', { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

function runSvgo(files) {
  const existing = files.filter((file) => fs.existsSync(file));
  if (existing.length === 0) {
    return;
  }

  try {
    execSync(`npx --yes svgo ${existing.map((f) => JSON.stringify(f)).join(' ')}`, {
      stdio: 'inherit',
    });
  } catch (error) {
    console.warn('optimize-public-images: SVGO skipped —', error instanceof Error ? error.message : error);
  }
}

function optimizeWithSips(texturePath, destinationPath) {
  execSync(
    `sips -Z 400 -s format jpeg -s formatOptions 55 ${JSON.stringify(texturePath)} --out ${JSON.stringify(destinationPath)}`,
    { stdio: 'inherit' },
  );
}

function copyAsFallback(texturePath, destinationPath) {
  fs.copyFileSync(texturePath, destinationPath);
  console.log(
    'optimize-public-images: sips unavailable — copied extracted JPEG to job-type-background-opt.jpg (no resize)',
  );
}

function extractJobTypeTexture() {
  if (!fs.existsSync(jobTypeSvg)) {
    return;
  }

  const svg = fs.readFileSync(jobTypeSvg, 'utf8');
  const match = svg.match(/xlink:href="data:image\/jpeg;base64,([^"]+)"/);
  if (!match) {
    if (fs.existsSync(optPath)) {
      console.log('optimize-public-images: no embedded JPEG; keeping existing job-type-background-opt.jpg');
      return;
    }
    console.warn('optimize-public-images: no embedded JPEG and no job-type-background-opt.jpg');
    return;
  }

  const texturePath = path.join(os.tmpdir(), `kkium-job-type-texture-${process.pid}.jpg`);

  try {
    fs.writeFileSync(texturePath, Buffer.from(match[1], 'base64'));

    if (hasSips()) {
      try {
        optimizeWithSips(texturePath, optPath);
        console.log('optimize-public-images: wrote job-type-background-opt.jpg (sips)');
        return;
      } catch (error) {
        console.warn(
          'optimize-public-images: sips failed —',
          error instanceof Error ? error.message : error,
        );
      }
    }

    try {
      copyAsFallback(texturePath, optPath);
    } catch (error) {
      console.warn(
        'optimize-public-images: fallback copy failed —',
        error instanceof Error ? error.message : error,
      );
      if (fs.existsSync(optPath)) {
        console.log('optimize-public-images: using committed job-type-background-opt.jpg');
      }
    }
  } catch (error) {
    console.warn(
      'optimize-public-images: job-type texture step failed —',
      error instanceof Error ? error.message : error,
    );
    if (fs.existsSync(optPath)) {
      console.log('optimize-public-images: using committed job-type-background-opt.jpg');
    }
  } finally {
    fs.rmSync(texturePath, { force: true });
  }
}

runSvgo([jobTypeSvg, emptyTypeSvg]);
extractJobTypeTexture();
