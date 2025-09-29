import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const icons = [
  { slug: 'telegram', file: 'telegram.svg' },
  { slug: 'whatsapp', file: 'whatsapp.svg' },
  { slug: 'viber', file: 'viber.svg' },
  { slug: 'instagram', file: 'instagram.svg' },
  { slug: 'youtube', file: 'youtube.svg' },
  { slug: 'tiktok', file: 'tiktok.svg' },
];

const outDir = join(process.cwd(), 'public', 'icons');
await mkdir(outDir, { recursive: true });

for (const { slug, file } of icons) {
  const url = `https://cdn.simpleicons.org/${slug}`;
  const res = await fetch(url);
  if (!res.ok) {
    console.error(`Failed ${slug}: HTTP ${res.status}`);
    continue;
  }
  const svg = await res.text();
  await writeFile(join(outDir, file), svg, 'utf8');
  console.log(`Saved ${file}`);
}

