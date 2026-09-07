#!/usr/bin/env node
// Uploads a directory of logos into the storage bucket the site reads from.
// Every uploaded file name must match a sponsors.logo value.
//
//   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... \
//     node scripts/upload-sponsor-logos.mjs --dir ./logos
//
// The bucket is the source of truth for these images, so the directory is an
// argument rather than a path in the repository.
//
// The service-role key bypasses row-level security. Pass it on the command
// line or from a secret manager. Never commit it, never put it in .env.local,
// and never give it a VITE_ prefix, which would publish it in the browser
// bundle. Pass --dry-run to list the files without uploading anything.

import { readdir, readFile } from 'node:fs/promises';
import { extname, join, resolve } from 'node:path';
import { createClient } from '@supabase/supabase-js';

const BUCKET = 'sponsor-logos';
const CONTENT_TYPES = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
};

const url = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const dryRun = process.argv.includes('--dry-run');
const dir = process.argv[process.argv.indexOf('--dir') + 1];

if (!url || !serviceRoleKey) {
  console.error('Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY before running this script.');
  console.error('The anon key cannot write to the bucket; this needs the service-role key.');
  process.exit(1);
}

if (!process.argv.includes('--dir') || !dir || dir.startsWith('--')) {
  console.error('Pass --dir <directory> holding the logo files to upload.');
  process.exit(1);
}

const SOURCE = resolve(dir);
const files = (await readdir(SOURCE).catch((error) => {
  console.error(`Cannot read ${SOURCE}: ${error.message}`);
  process.exit(1);
}))
  .filter((name) => extname(name).toLowerCase() in CONTENT_TYPES)
  .sort();

if (files.length === 0) {
  console.error(`No image files found in ${SOURCE}`);
  process.exit(1);
}

if (dryRun) {
  console.log(`Would upload ${files.length} file(s) to ${BUCKET}:`);
  for (const name of files) console.log(`  ${name}`);
  process.exit(0);
}

const supabase = createClient(url, serviceRoleKey, { auth: { persistSession: false } });

let failed = 0;
for (const name of files) {
  const { error } = await supabase.storage.from(BUCKET).upload(name, await readFile(join(SOURCE, name)), {
    contentType: CONTENT_TYPES[extname(name).toLowerCase()],
    upsert: true,
  });
  if (error) {
    failed += 1;
    console.error(`  failed   ${name}: ${error.message}`);
  } else {
    console.log(`  uploaded ${name}`);
  }
}

if (failed > 0) {
  console.error(`${failed} of ${files.length} upload(s) failed.`);
  process.exit(1);
}

console.log(`Uploaded ${files.length} logo(s) to ${BUCKET}.`);
