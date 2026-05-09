import { jwtVerify } from 'jose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Read .env to get NEXTAUTH_SECRET
const envContent = fs.readFileSync(path.resolve(__dirname, '../.env'), 'utf-8');
const rawSecret = envContent
  .split('\n')
  .find(l => l.startsWith('NEXTAUTH_SECRET='))
  ?.replace(/^NEXTAUTH_SECRET=["']?/, '')
  .replace(/["']?\s*$/, '') ?? '';

const token = "eyJhbGciOiJIUzI1NiJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJhZG1pbiIsImVtYWlsIjoiYWRtaW5AdGlrdGltZS5jby5pbCIsInJvbGUiOiJhZG1pbiIsImV4cCI6MTc3ODk2ODcyMSwiaWF0IjoxNzc4MzYzOTIxfQ.wod_gSlHMi7Sb0JI4qGzvX-Q4aWk4qkoaisR-PHJRfk";

const secrets = [
  ["env-secret (raw)",             rawSecret],
  ["env-secret (trimmed)",         rawSecret.trim()],
  ["env-secret (BOM stripped)",    rawSecret.replace(/^﻿/, '').trim()],
  ["fallback",                     "tiktime-admin-secret-change-in-production"],
];

for (const [label, s] of secrets) {
  const key = new TextEncoder().encode(s);
  try {
    const { payload } = await jwtVerify(token, key);
    console.log(`✓ ${label}: VALID — exp=${new Date(payload.exp * 1000).toISOString()}`);
  } catch (e) {
    console.log(`✗ ${label}: ${e.message}`);
  }
}
