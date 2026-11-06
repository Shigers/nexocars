const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const publicDir = path.join(__dirname, '..', 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Ultra-premium Automotive Luxury Badge for NexoCar
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <defs>
    <!-- Background Gradient -->
    <radialGradient id="bgGlow" cx="50%" cy="40%" r="65%">
      <stop offset="0%" stop-color="#111c38" />
      <stop offset="60%" stop-color="#070b14" />
      <stop offset="100%" stop-color="#03050a" />
    </radialGradient>

    <!-- Metallic Edge Gradient -->
    <linearGradient id="metalBorder" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8" />
      <stop offset="30%" stop-color="#1e40af" />
      <stop offset="70%" stop-color="#3b82f6" />
      <stop offset="100%" stop-color="#06b6d4" />
    </linearGradient>

    <!-- Supercar Gold/Cyan Highlight -->
    <linearGradient id="carGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#38bdf8" />
      <stop offset="50%" stop-color="#ffffff" />
      <stop offset="100%" stop-color="#3b82f6" />
    </linearGradient>

    <linearGradient id="textGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#ffffff" />
      <stop offset="100%" stop-color="#cbd5e1" />
    </linearGradient>
    
    <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="8" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <!-- Base Squircle -->
  <rect width="512" height="512" rx="120" fill="url(#bgGlow)" />
  <rect x="8" y="8" width="496" height="496" rx="112" fill="none" stroke="url(#metalBorder)" stroke-width="6" opacity="0.85" />
  
  <!-- Subtle inner ambient circle -->
  <circle cx="256" cy="210" r="150" fill="#2563eb" opacity="0.12" filter="blur(30px)" />

  <!-- Shield Emblem Frame -->
  <path d="M 256 65 L 375 110 C 375 220, 310 295, 256 325 C 202 295, 137 220, 137 110 Z" 
        fill="#091024" stroke="url(#metalBorder)" stroke-width="4.5" opacity="0.95" />

  <!-- Aerodynamic Supercar Silhouette inside shield -->
  <!-- Roofline and Windshield -->
  <path d="M 175 210 Q 200 160, 256 160 Q 312 160, 337 210" 
        fill="none" stroke="url(#carGrad)" stroke-width="8" stroke-linecap="round" />
  
  <!-- Hood and Front Splitter -->
  <path d="M 165 210 L 200 235 L 312 235 L 347 210" 
        fill="none" stroke="#60a5fa" stroke-width="4.5" stroke-linecap="round" />

  <!-- Aggressive LED Headlights -->
  <!-- Left Headlight -->
  <path d="M 180 220 L 210 225 L 195 230 Z" fill="#38bdf8" filter="url(#neonGlow)" />
  <circle cx="195" cy="225" r="3.5" fill="#ffffff" />

  <!-- Right Headlight -->
  <path d="M 332 220 L 302 225 L 317 230 Z" fill="#38bdf8" filter="url(#neonGlow)" />
  <circle cx="317" cy="225" r="3.5" fill="#ffffff" />

  <!-- Central Grille / Brand Diamond Accent -->
  <polygon points="256,195 264,208 256,220 248,208" fill="#38bdf8" opacity="0.9" />

  <!-- Speed Wing Accents -->
  <line x1="225" y1="135" x2="287" y2="135" stroke="#38bdf8" stroke-width="3" stroke-linecap="round" opacity="0.6" />

  <!-- Brand Typography: NEXOCAR -->
  <!-- Glow Layer for Text -->
  <text x="256" y="395" 
        font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif" 
        font-weight="900" 
        font-size="64" 
        letter-spacing="5" 
        fill="#38bdf8" 
        text-anchor="middle" 
        opacity="0.35" 
        filter="blur(6px)">NEXOCAR</text>

  <!-- Sharp Main Text -->
  <text x="256" y="395" 
        font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif" 
        font-weight="900" 
        font-size="64" 
        letter-spacing="5" 
        text-anchor="middle">
    <tspan fill="#ffffff">NEXO</tspan>
    <tspan fill="#38bdf8">CAR</tspan>
  </text>

  <!-- Subtitle Tagline -->
  <text x="256" y="432" 
        font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif" 
        font-weight="700" 
        font-size="16" 
        letter-spacing="4.5" 
        fill="#94a3b8" 
        text-anchor="middle">ORLANDO CARS &amp; LOEWE</text>

  <!-- Small PRO Badge Pill -->
  <g transform="translate(256, 458)">
    <rect x="-42" y="-12" width="84" height="24" rx="12" fill="#1e3a8a" stroke="#3b82f6" stroke-width="1.5" />
    <text x="0" y="4" font-family="sans-serif" font-weight="800" font-size="11" letter-spacing="2" fill="#60a5fa" text-anchor="middle">SISTEMA</text>
  </g>
</svg>`;

fs.writeFileSync(path.join(publicDir, 'icon.svg'), svg);

const buf = Buffer.from(svg);

async function run() {
  await sharp(buf).resize(192, 192).png().toFile(path.join(publicDir, 'icon-192.png'));
  await sharp(buf).resize(512, 512).png().toFile(path.join(publicDir, 'icon-512.png'));
  await sharp(buf).resize(180, 180).png().toFile(path.join(publicDir, 'apple-touch-icon.png'));
  await sharp(buf).resize(64, 64).png().toFile(path.join(publicDir, 'favicon.ico'));
  console.log('Premium Automotive NEXOCAR Icons generated successfully in public/');
}

run().catch(console.error);
