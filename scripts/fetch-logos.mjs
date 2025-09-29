// Node 18+: built-in fetch
import { writeFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';

const brands = [
  { name: 'BYD', slug: 'byd' },
  { name: 'Geely', slug: 'geely' },
  { name: 'Chery', slug: 'chery' },
  { name: 'Haval', slug: 'haval' },
  { name: 'GWM', slug: 'greatwallmotors' },
  { name: 'Changan', slug: 'changan' },
  { name: 'Jetour', slug: 'jetour' },
  { name: 'Exeed', slug: 'exeed' },
  { name: 'Tank', slug: 'tank' },
  { name: 'Li Auto', slug: 'liauto' },
  { name: 'NIO', slug: 'nio' },
  { name: 'Xpeng', slug: 'xpeng' },
  { name: 'Zeekr', slug: 'zeekr' },
  { name: 'Aion', slug: 'aion' },
  { name: 'IM Motors', slug: 'immotors' },
  { name: 'Leapmotor', slug: 'leapmotor' },
  { name: 'Dongfeng', slug: 'dongfeng' },
  { name: 'Hongqi', slug: 'hongqi' },
  { name: 'Wuling', slug: 'wuling' },
  { name: 'ORA', slug: 'ora' },
];

const outDir = join(process.cwd(), 'public', 'brands');
await mkdir(outDir, { recursive: true });

const results = [];
for (const { name, slug } of brands) {
  const url = `https://cdn.simpleicons.org/${encodeURIComponent(slug)}/e9eaf0`;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const svg = await res.text();
    const file = join(outDir, `${slug}.svg`);
    await writeFile(file, svg, 'utf8');
    results.push({ name, slug, ok: true });
    console.log(`Saved: ${name} -> ${file}`);
  } catch (e) {
    results.push({ name, slug, ok: false, error: String(e) });
    console.warn(`Failed: ${name} (${slug}) -> ${e}`);
  }
}

const failed = results.filter(r => !r.ok);
if (failed.length) {
  console.log('\nMissing in Simple Icons (need alt source):');
  for (const f of failed) console.log(`- ${f.name} (${f.slug})`);
  process.exitCode = 0;
}

