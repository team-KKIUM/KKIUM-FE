#!/usr/bin/env node
/**
 * Converts render-blocking Next.js stylesheet <link> tags to non-blocking
 * preload + onload pattern (Lighthouse: Render-blocking requests).
 */
import fs from 'node:fs';
import path from 'node:path';

const outDir = path.resolve(process.argv[2] ?? 'out');

const LINK_TAG_RE = /<link\b([^>]*?)\/?>/gi;

function isNextStylesheet(attrs) {
  if (!/\brel=["']stylesheet["']/i.test(attrs)) {
    return false;
  }

  const href = attrs.match(/\bhref=["']([^"']+)["']/i)?.[1];
  return Boolean(href?.includes('/_next/static/') && href.endsWith('.css'));
}

function toNonBlocking(attrs, href) {
  return [
    `<link rel="preload" href="${href}" as="style" fetchpriority="high" onload="this.onload=null;this.rel='stylesheet'"${attrs.includes('data-precedence') ? ' data-precedence="next"' : ''}/>`,
    `<noscript><link rel="stylesheet" href="${href}"${attrs.includes('data-precedence') ? ' data-precedence="next"' : ''}/></noscript>`,
  ].join('');
}

function transformHtml(html) {
  return html.replace(LINK_TAG_RE, (full, attrs) => {
    if (!isNextStylesheet(attrs)) {
      return full;
    }

    const href = attrs.match(/\bhref=["']([^"']+)["']/i)?.[1];
    if (!href) {
      return full;
    }

    return toNonBlocking(attrs, href);
  });
}

function processHtmlFile(filePath) {
  const original = fs.readFileSync(filePath, 'utf8');
  const updated = transformHtml(original);

  if (updated !== original) {
    fs.writeFileSync(filePath, updated);
    console.log(`defer-render-blocking-css: ${path.relative(outDir, filePath)}`);
  }
}

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const entryPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(entryPath);
      continue;
    }

    if (entry.name.endsWith('.html')) {
      processHtmlFile(entryPath);
    }
  }
}

if (!fs.existsSync(outDir)) {
  console.error(`error: directory not found: ${outDir}`);
  process.exit(1);
}

walk(outDir);
