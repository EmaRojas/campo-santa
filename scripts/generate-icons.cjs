const fs = require('fs');
const path = require('path');

function createSVGIcon(size) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#22c55e"/>
      <stop offset="100%" stop-color="#15803d"/>
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" fill="url(#g)" rx="${Math.round(size * 0.125)}"/>
  <text x="${size / 2}" y="${Math.round(size * 0.55)}" text-anchor="middle" font-size="${Math.round(size * 0.55)}" fill="white">🌿</text>
</svg>`;
}

fs.writeFileSync(path.join('public', 'icon-192.svg'), createSVGIcon(192));
fs.writeFileSync(path.join('public', 'icon-512.svg'), createSVGIcon(512));

console.log('SVG icons created in public/');
