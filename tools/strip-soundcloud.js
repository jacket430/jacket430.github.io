#!/usr/bin/env node

// Utility script to remove SoundCloud links from tools/songlinks.txt
// Usage (from repo root):
//   node tools/strip-soundcloud.js

const fs = require('fs');
const path = require('path');

const TARGET_FILE = path.join(__dirname, 'songlinks.txt');

const ICON_REGEX = /\[<i class="fa-brands ([^"]+)" aria-hidden="true"><\/i>]\([^)]*\)/g;

const ICON_LABELS = {
  'fa-amazon': 'Amazon',
  'fa-apple': 'Apple',
  'fa-pandora': 'Pandora',
  'fa-spotify': 'Spotify',
  'fa-tidal': 'Tidal',
  'fa-youtube': 'YouTube',
};

function stripSoundcloudFromLine(line) {
  if (!line.includes('fa-soundcloud')) return line;

  const marker = '[<i class="fa-brands fa-soundcloud" aria-hidden="true"></i>](';
  const idx = line.indexOf(marker);
  if (idx === -1) return line;

  // Optionally include a leading space before the icon for cleaner spacing.
  const start = idx > 0 && line[idx - 1] === ' ' ? idx - 1 : idx;

  // Find the closing ')' of the markdown link.
  const end = line.indexOf(')', idx + marker.length);
  if (end === -1) return line;

  return line.slice(0, start) + line.slice(end + 1);
}

function reformatIconsInLine(line) {
  // Find all platform icon markdown segments on the line
  ICON_REGEX.lastIndex = 0;
  const matches = [];
  let match;

  while ((match = ICON_REGEX.exec(line)) !== null) {
    matches.push({
      markdown: match[0],
      iconClass: match[1],
      start: match.index,
      end: ICON_REGEX.lastIndex,
    });
  }

  if (matches.length === 0) return line;

  const prefix = line.slice(0, matches[0].start);
  const suffix = line.slice(matches[matches.length - 1].end);

  const entries = matches
    .map(({ markdown, iconClass }) => {
      const label = ICON_LABELS[iconClass];
      if (!label) return null;
      return {
        markdown,
        label,
        isTight: label === 'Amazon' || label === 'Apple',
      };
    })
    .filter(Boolean);

  if (entries.length === 0) return line;

  let iconsCell = '';
  entries.forEach((entry, index) => {
    if (index === 0) {
      iconsCell += entry.markdown;
      return;
    }

    const prev = entries[index - 1];
    const useSpace =
      !entry.isTight &&
      !prev.isTight &&
      prev.label !== 'Pandora';

    iconsCell += (useSpace ? ' ' : '') + entry.markdown;
  });

  return prefix + iconsCell + suffix;
}

function main() {
  if (!fs.existsSync(TARGET_FILE)) {
    console.error(`Target file not found: ${TARGET_FILE}`);
    process.exit(1);
  }

  const original = fs.readFileSync(TARGET_FILE, 'utf8');
  const lines = original.split(/\r?\n/);

  const updatedLines = lines
    .map(stripSoundcloudFromLine)
    .map(reformatIconsInLine);

  fs.writeFileSync(TARGET_FILE, updatedLines.join('\n'), 'utf8');

  console.log('Removed SoundCloud links from songlinks.txt');
}

if (require.main === module) {
  main();
}
