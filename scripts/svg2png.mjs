import sharp from 'sharp';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const svgPath = join(process.cwd(), 'public', 'logo.svg');
const outDir = join(process.cwd(), 'public');
const imagesDir = join(outDir, 'images');
await mkdir(imagesDir, { recursive: true });

const svg = await readFile(svgPath);

// Header logo PNG
const logoPng = await sharp(svg).resize({ width: 512, height: 512, fit: 'contain', background: { r: 11, g: 11, b: 15, alpha: 0 } }).png().toBuffer();
await writeFile(join(imagesDir, 'logo.png'), logoPng);

// Favicon PNG (512x512)
const faviconPng = await sharp(svg).resize({ width: 512, height: 512, fit: 'contain', background: { r: 11, g: 11, b: 15, alpha: 0 } }).png().toBuffer();
await writeFile(join(outDir, 'favicon.png'), faviconPng);

console.log('Generated images/logo.png and favicon.png');

