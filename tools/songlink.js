#!/usr/bin/env node

// Simple CLI to query song.link (Odesli) for a given song URL
// and append a Markdown table row with platform links to a text file.
// Usage:
//   node tools/songlink.js "<song-url>"
// or just run without arguments and paste the URL when prompted.

const https = require('https');
const fs = require('fs');
const path = require('path');

const OUTPUT_FILE = path.join(__dirname, 'songlinks.txt');

const PLATFORM_CONFIG = [
  { label: 'Amazon', iconClass: 'fa-amazon', apiKeys: ['amazonMusic'] },
  { label: 'Apple', iconClass: 'fa-apple', apiKeys: ['appleMusic', 'itunes'] },
  { label: 'Pandora', iconClass: 'fa-pandora', apiKeys: ['pandora'] },
  { label: 'Spotify', iconClass: 'fa-spotify', apiKeys: ['spotify'] },
  { label: 'Tidal', iconClass: 'fa-tidal', apiKeys: ['tidal'] },
  { label: 'YouTube', iconClass: 'fa-youtube', apiKeys: ['youtube'] },
];

function fetchSongLinkData(songUrl) {
  return new Promise((resolve, reject) => {
    const apiUrl = `https://api.song.link/v1-alpha.1/links?url=${encodeURIComponent(songUrl)}`;

    https
      .get(apiUrl, (res) => {
        let data = '';

        if (res.statusCode && res.statusCode >= 400) {
          reject(
            new Error(
              `song.link API request failed with status ${res.statusCode} ${res.statusMessage || ''}`.trim()
            )
          );
          res.resume();
          return;
        }

        res.setEncoding('utf8');
        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          try {
            const json = JSON.parse(data);
            resolve(json);
          } catch (err) {
            reject(new Error('Failed to parse song.link response as JSON'));
          }
        });
      })
      .on('error', (err) => {
        reject(err);
      });
  });
}

function printPlatforms(apiResponse) {
  const linksByPlatform = apiResponse && apiResponse.linksByPlatform;

  if (!linksByPlatform || typeof linksByPlatform !== 'object') {
    console.error('No platforms found in song.link response.');
    process.exitCode = 1;
    return;
  }

  const platforms = Object.keys(linksByPlatform);
  if (platforms.length === 0) {
    console.error('No platforms available for this URL.');
    process.exitCode = 1;
    return;
  }

  console.log(`Found ${platforms.length} platforms:`);
  platforms.forEach((platform) => {
    const info = linksByPlatform[platform];
    const url = info && info.url;
    if (url) {
      console.log(`- ${platform}: ${url}`);
    } else {
      console.log(`- ${platform}: (no URL provided)`);
    }
  });
}

function readUrlFromStdin() {
  return new Promise((resolve) => {
    let input = '';
    process.stdin.setEncoding('utf8');

    console.log('Paste a song URL and press Enter:');

    process.stdin.on('data', (chunk) => {
      input += chunk;
      if (input.includes('\n')) {
        process.stdin.pause();
        resolve(input.trim());
      }
    });

    process.stdin.on('end', () => {
      resolve(input.trim());
    });
  });
}

async function main() {
  try {
    let songUrl = process.argv[2];

    if (!songUrl) {
      songUrl = await readUrlFromStdin();
    }

    if (!songUrl) {
      console.error('No song URL provided.');
      process.exit(1);
    }

    const data = await fetchSongLinkData(songUrl);

    const row = buildMarkdownRow(data);
    console.log(row);
    appendRowToFile(row);
  } catch (err) {
    console.error('Error while querying song.link:', err.message || err);
    process.exit(1);
  }
}

function buildMarkdownRow(apiResponse) {
  const entityId = apiResponse && apiResponse.entityUniqueId;
  const entities = apiResponse && apiResponse.entitiesByUniqueId;
  const primaryEntity = entityId && entities && entities[entityId];

  const artist = (primaryEntity && primaryEntity.artistName) || 'Unknown Artist';
  const title = (primaryEntity && primaryEntity.title) || 'Unknown Title';

  const linksByPlatform = apiResponse && apiResponse.linksByPlatform;

  const iconEntries = PLATFORM_CONFIG.map(({ label, iconClass, apiKeys }) => {
    if (!linksByPlatform) return null;

    for (const key of apiKeys) {
      const info = linksByPlatform[key];
      if (info && info.url) {
        const url = info.url;
        return {
          markdown: `[<i class="fa-brands ${iconClass}" aria-hidden="true"></i>](${url})`,
          isTight: label === 'Amazon' || label === 'Apple',
          label,
        };
      }
    }

    return null;
  }).filter(Boolean);

  let linksCell = '';
  iconEntries.forEach((entry, index) => {
    if (index === 0) {
      linksCell += entry.markdown;
      return;
    }

    const prev = iconEntries[index - 1];
    const useSpace =
      !entry.isTight &&
      !prev.isTight &&
      prev.label !== 'Pandora';
    linksCell += (useSpace ? ' ' : '') + entry.markdown;
  });
  return `| ${artist} | ${title} | ${linksCell} |`;
}

function appendRowToFile(row) {
  try {
    fs.appendFileSync(OUTPUT_FILE, row + '\n', 'utf8');
    console.log(`Appended row to ${OUTPUT_FILE}`);
  } catch (err) {
    console.error('Failed to write to output file:', err.message || err);
  }
}

if (require.main === module) {
  main();
}
