const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const publicDir = path.join(__dirname, '..', 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#2563eb" />
      <stop offset="50%" stop-color="#4f46e5" />
      <stop offset="100%" stop-color="#06b6d4" />
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="110" fill="url(#grad)" />
  <text x="50%" y="54%" font-family="Arial, sans-serif" font-weight="900" font-size="310" fill="#ffffff" text-anchor="middle" dominant-baseline="middle">N</text>
</svg>`;

fs.writeFileSync(path.join(publicDir, 'icon.svg'), svg);

const buf = Buffer.from(svg);

async function run() {
  await sharp(buf).resize(192, 192).png().toFile(path.join(publicDir, 'icon-192.png'));
  await sharp(buf).resize(512, 512).png().toFile(path.join(publicDir, 'icon-512.png'));
  await sharp(buf).resize(180, 180).png().toFile(path.join(publicDir, 'apple-touch-icon.png'));
  console.log('Icons generated successfully in public/');
}

run().catch(console.error);
