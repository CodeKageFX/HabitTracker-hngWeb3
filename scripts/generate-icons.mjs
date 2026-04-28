import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import Color from 'colorjs.io';

const globalsCss = fs.readFileSync(path.join(process.cwd(), 'src/app/globals.css'), 'utf-8');
const bgMatch = globalsCss.match(/--background:\s*(oklch\([^)]+\))/);
const primaryMatch = globalsCss.match(/--primary:\s*(oklch\([^)]+\))/);

let bg = new Color(bgMatch ? bgMatch[1] : 'oklch(0.08 0.01 20)').to('srgb').toString({ format: 'hex' });
let primary = new Color(primaryMatch ? primaryMatch[1] : 'oklch(0.55 0.22 25)').to('srgb').toString({ format: 'hex' });

const svgLogo = `
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <!-- Dynamic dark background from CSS -->
  <rect width="512" height="512" rx="112" fill="${bg}" />
  
  <!-- Outer glowing/accent ring -->
  <circle cx="256" cy="256" r="140" stroke="${primary}" stroke-width="12" stroke-dasharray="10 20" fill="none" opacity="0.3" />
  
  <!-- Inner circular badge -->
  <circle cx="256" cy="256" r="80" fill="none" stroke="${primary}" stroke-width="16" />
  
  <!-- Checkmark -->
  <path d="M210 260 L240 290 L310 210" stroke="${primary}" stroke-width="24" stroke-linecap="round" stroke-linejoin="round" fill="none" />
</svg>
`;

// Export
const publicDir = path.join(process.cwd(), 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir);
}

async function render() {
  const buf = Buffer.from(svgLogo);
  await sharp(buf).resize(192, 192).toFile(path.join(publicDir, 'icon-192x192.png'));
  await sharp(buf).resize(256, 256).toFile(path.join(publicDir, 'icon-256x256.png'));
  await sharp(buf).resize(384, 384).toFile(path.join(publicDir, 'icon-384x384.png'));
  await sharp(buf).resize(512, 512).toFile(path.join(publicDir, 'icon-512x512.png'));
  // Apple Touch Icon is usually slightly different or full bleed, but this works well
  await sharp(buf).resize(180, 180).toFile(path.join(publicDir, 'apple-touch-icon.png'));
  console.log('Icons generated successfully!');
}

render().catch(console.error);
