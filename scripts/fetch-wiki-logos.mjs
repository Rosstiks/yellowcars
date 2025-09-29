import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const brands = [
  { name: 'BYD', slug: 'byd' },
  { name: 'Geely', slug: 'geely' },
  { name: 'Chery', slug: 'chery' },
  { name: 'Haval', slug: 'haval' },
  { name: 'Great Wall Motors', slug: 'gwm' },
  { name: 'Changan', slug: 'changan' },
  { name: 'Jetour', slug: 'jetour' },
  { name: 'Exeed', slug: 'exeed' },
  { name: 'Tank (marque)', slug: 'tank' },
  { name: 'Li Auto', slug: 'lixiang' },
  { name: 'NIO', slug: 'nio' },
  { name: 'XPeng', slug: 'xpeng' },
  { name: 'Zeekr', slug: 'zeekr' },
  { name: 'Aion (marque)', slug: 'aion' },
  { name: 'IM Motors', slug: 'im' },
  { name: 'Leapmotor', slug: 'leapmotor' },
  { name: 'Dongfeng Motor', slug: 'dongfeng' },
  { name: 'Hongqi', slug: 'hongqi' },
  { name: 'Wuling Motors', slug: 'wuling' },
  { name: 'ORA (marque)', slug: 'ora' },
];

const outDir = join(process.cwd(), 'public', 'brands');
await mkdir(outDir, { recursive: true });

async function fetchSvgFromCommons(query) {
  const endpoint = 'https://commons.wikimedia.org/w/api.php';
  const params = new URLSearchParams({
    action: 'query',
    format: 'json',
    origin: '*',
    prop: 'imageinfo',
    iiprop: 'url|mime',
    generator: 'search',
    gsrlimit: '5',
    gsrsearch: `${query} logo filetype:svg`,
  });
  const res = await fetch(`${endpoint}?${params.toString()}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  const pages = json?.query?.pages ? Object.values(json.query.pages) : [];
  for (const p of pages) {
    const info = p?.imageinfo?.[0];
    if (info?.mime === 'image/svg+xml' && info?.url?.endsWith('.svg')) {
      const svgRes = await fetch(info.url);
      if (svgRes.ok) return await svgRes.text();
    }
  }
  return null;
}

const results = [];
for (const b of brands) {
  let svg = null;
  try {
    svg = await fetchSvgFromCommons(b.name);
    if (!svg && /\(marque\)/.test(b.name)) {
      svg = await fetchSvgFromCommons(b.name.replace(' (marque)', ''));
    }
    if (!svg && b.name.includes('Motors')) {
      svg = await fetchSvgFromCommons(b.name.replace(' Motors', ''));
    }
    if (!svg && b.name === 'Li Auto') {
      svg = await fetchSvgFromCommons('Li Xiang logo filetype:svg');
    }
    if (!svg) throw new Error('not found');
    const path = join(outDir, `${b.slug}.svg`);
    await writeFile(path, svg, 'utf8');
    console.log(`Saved ${b.name} -> ${path}`);
    results.push({ brand: b.name, ok: true });
  } catch (e) {
    console.warn(`Failed ${b.name}: ${e}`);
    results.push({ brand: b.name, ok: false });
  }
}

const failed = results.filter(r => !r.ok);
if (failed.length) {
  console.log('\nНе удалось автоматически найти SVG для:');
  for (const f of failed) console.log(`- ${f.brand}`);
}

