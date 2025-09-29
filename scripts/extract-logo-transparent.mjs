import sharp from 'sharp';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';

const srcPng = join(process.cwd(), 'public', 'images', 'logo-source.png');
const srcJpg = join(process.cwd(), 'public', 'images', 'logo-source.jpg');
const outDir = join(process.cwd(), 'public');
const imagesDir = join(outDir, 'images');
await mkdir(imagesDir, { recursive: true });

try {
  const srcBuf = await readFile(await (async()=>{
    try { await readFile(srcPng); return srcPng; } catch { return srcJpg; }
  })());
  const { data, info } = await sharp(srcBuf)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const out = Buffer.from(data); // RGBA
  const stride = 4;
  const whiteThreshold = 250; // 0-255

  for (let i = 0; i < out.length; i += stride) {
    const r = out[i];
    const g = out[i + 1];
    const b = out[i + 2];
    const aIdx = i + 3;
    if (r >= whiteThreshold && g >= whiteThreshold && b >= whiteThreshold) {
      out[aIdx] = 0; // прозрачный
    } else {
      out[aIdx] = 255; // непрозрачный
    }
  }

  // Сборка PNG, обрезка прозрачных полей и лёгкое шарпирование краёв
  const prePng = await sharp(out, { raw: { width: info.width, height: info.height, channels: 4 } })
    .png()
    .toBuffer();

  const trimmed = await sharp(prePng).trim().sharpen(1.2).toBuffer();

  // Жёстко оставляем только круг: маска dest-in
  const meta = await sharp(trimmed).metadata();
  const w = meta.width || 0;
  const h = meta.height || 0;
  const size = Math.min(w, h);
  const cx = w / 2;
  const cy = h / 2;
  const r = (size / 2) * 0.94; // уменьшил радиус, чтобы исключить возможный светлый кант
  const maskSvg = Buffer.from(
    `<svg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h}'>\n`+
    `<rect width='100%' height='100%' fill='black'/>\n`+
    `<circle cx='${cx}' cy='${cy}' r='${r}' fill='white'/>\n`+
    `</svg>`
  );
  // Подгоним маску под размеры изображения перед композитом
  const masked = await sharp(trimmed)
    .resize({ width: w, height: h })
    .composite([{ input: maskSvg, blend: 'dest-in' }])
    .trim()
    .toBuffer();

  // Центрируем и обрезаем до квадрата
  const left = Math.max(0, Math.round(cx - size / 2));
  const top = Math.max(0, Math.round(cy - size / 2));
  const cropped = await sharp(masked)
    .extract({ left, top, width: size, height: size })
    .png()
    .toBuffer();

  await writeFile(join(imagesDir, 'logo.png'), cropped);

  // Favicon 512x512
  const favicon = await sharp(cropped)
    .resize(512, 512, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
  await writeFile(join(outDir, 'favicon.png'), favicon);

  console.log('Created images/logo.png (transparent) and favicon.png from logo-source.png');
} catch (e) {
  console.error('Failed to process logo-source.png:', e.message);
  process.exitCode = 1;
}


