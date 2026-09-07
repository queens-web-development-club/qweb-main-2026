#!/usr/bin/env node
// Vite copies every VITE_* value into the browser bundle. A service-role key
// placed there is not a configuration mistake that shows up in testing: the
// site works perfectly, and anyone who opens the bundle can read and write the
// whole database. This refuses to build rather than publish that.
//
// Checks the values the build will actually use, so it runs in CI and locally.

const failures = [];
const url = process.env.VITE_SUPABASE_URL;
const key = process.env.VITE_SUPABASE_ANON_KEY;

/** A Supabase JWT carries its role in the payload; a legacy anon key says "anon". */
function jwtRole(value) {
  const parts = value.split('.');
  if (parts.length !== 3) return null;
  try {
    return JSON.parse(Buffer.from(parts[1], 'base64url').toString()).role ?? null;
  } catch {
    return null;
  }
}

if (!url) failures.push('VITE_SUPABASE_URL is not set; the build would ship a site that loads no content.');
else if (!/^https:\/\/[a-z0-9-]+\.supabase\.co\/?$/.test(url)) {
  failures.push(`VITE_SUPABASE_URL is not an https Supabase project URL: ${url}`);
}

if (!key) failures.push('VITE_SUPABASE_ANON_KEY is not set; the build would ship a site that loads no content.');
else {
  const role = jwtRole(key);
  if (role === 'service_role') failures.push('VITE_SUPABASE_ANON_KEY holds a SERVICE ROLE key. It would be published in the browser bundle and grants full database access. Rotate it now.');
  else if (key.startsWith('sb_secret_')) failures.push('VITE_SUPABASE_ANON_KEY holds a secret key (sb_secret_...). It would be published in the browser bundle. Rotate it now.');
  else if (role !== 'anon' && !key.startsWith('sb_publishable_')) {
    failures.push(`VITE_SUPABASE_ANON_KEY is neither an anon key nor a publishable key${role ? ` (role: ${role})` : ''}. Only a public key belongs in a VITE_ variable.`);
  }
}

for (const name of Object.keys(process.env)) {
  if (!name.startsWith('VITE_')) continue;
  if (/SERVICE_ROLE|SECRET|PASSWORD|PRIVATE_KEY|TOKEN/i.test(name)) {
    failures.push(`${name} is exposed to the browser by its VITE_ prefix. Rename it without the prefix and read it server-side.`);
  }
}

if (failures.length) {
  console.error('\nRefusing to build. Frontend environment values are published to every visitor:\n');
  for (const failure of failures) console.error(`  - ${failure}`);
  console.error('');
  process.exit(1);
}
console.log('Frontend environment values are public-safe.');
