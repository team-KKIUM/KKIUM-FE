#!/usr/bin/env node
/**
 * Injects early resource hints for Lighthouse:
 * - LCP breakdown (home): preload job-type / empty-type SVGs
 * - Network dependency tree: LCP + CSS hints right after viewport
 */
import fs from 'node:fs';
import path from 'node:path';

const outDir = path.resolve(process.argv[2] ?? 'out');

/** Matches Lighthouse LCP element on home (NullType / JobTypeCard). */
const HOME_LCP_PRELOADS = [
  '<link rel="preload" href="/empty-type.svg" as="image" fetchpriority="high"/>',
  '<link rel="preload" href="/job-type-background-opt.jpg" as="image"/>',
];

/** Next export may use `<meta ...>` or `<meta .../>`. */
const VIEWPORT_META_RE = /(<meta\s+name=["']viewport["'][^>]*\/?>)/i;

function injectAfterViewport(html, snippets) {
  if (!VIEWPORT_META_RE.test(html)) {
    return html;
  }

  const joined = snippets.join('');
  if (html.includes(joined)) {
    return html;
  }

  return html.replace(VIEWPORT_META_RE, `$1${joined}`);
}

function processHomeHtml(filePath) {
  const original = fs.readFileSync(filePath, 'utf8');
  const updated = injectAfterViewport(original, HOME_LCP_PRELOADS);

  if (updated !== original) {
    fs.writeFileSync(filePath, updated);
    console.log(`inject-performance-hints: ${path.relative(outDir, filePath)}`);
  }
}

const homeHtml = path.join(outDir, 'index.html');

if (!fs.existsSync(outDir)) {
  console.error(`error: directory not found: ${outDir}`);
  process.exit(1);
}

if (fs.existsSync(homeHtml)) {
  processHomeHtml(homeHtml);
}
