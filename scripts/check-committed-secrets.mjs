#!/usr/bin/env node
// A preventive CI check, not the full secret audit TODOS.md calls for: that one
// covers history, images, and CI artifacts, and needs a maintained scanner.
// This catches the common way a key reaches a public repository — someone
// commits it — and it decodes what it finds rather than matching on the word
// "secret", so prose about service-role keys does not trip it.

import { execFileSync } from 'node:child_process';
import { readFileSync, statSync } from 'node:fs';

const findings = [];
const files = execFileSync('git', ['ls-files', '-z'], { encoding: 'utf8' }).split('\0').filter(Boolean);

const JWT = /\beyJ[A-Za-z0-9_-]{8,}\.([A-Za-z0-9_-]{8,})\.[A-Za-z0-9_-]{8,}/g;
const SUPABASE_SECRET = /\bsb_secret_[A-Za-z0-9]{8,}/g;
const PRIVATE_KEY = /-----BEGIN (?:RSA |EC |OPENSSH |PGP )?PRIVATE KEY-----/;

for (const file of files) {
  if (/^\.env(\..*)?$/.test(file) && file !== '.env.example') {
    findings.push(`${file}: an environment file is committed. Only .env.example belongs in the repository.`);
    continue;
  }
  let text;
  try {
    if (statSync(file).size > 2_000_000) continue;
    text = readFileSync(file, 'utf8');
  } catch { continue; }
  if (text.includes('\0')) continue;

  if (PRIVATE_KEY.test(text)) findings.push(`${file}: contains a private key block.`);

  for (const match of text.matchAll(SUPABASE_SECRET)) {
    findings.push(`${file}: contains a Supabase secret key (${match[0].slice(0, 14)}...).`);
  }

  for (const match of text.matchAll(JWT)) {
    let role = null;
    try { role = JSON.parse(Buffer.from(match[1], 'base64url').toString()).role ?? null; } catch { continue; }
    if (!role) continue;
    const where = `${file}: contains a JWT with role "${role}"`;
    findings.push(role === 'anon'
      ? `${where}. An anon key is public by design, but it should still come from the environment, not the repository.`
      : `${where}. Rotate it in the Supabase dashboard before doing anything else.`);
  }
}

if (findings.length) {
  console.error('\nCommitted-credential check failed:\n');
  for (const finding of findings) console.error(`  - ${finding}`);
  console.error('\nRotate anything real before removing it: deleting the file does not undo the exposure.\n');
  process.exit(1);
}
console.log(`Scanned ${files.length} tracked files; no committed credentials found.`);
