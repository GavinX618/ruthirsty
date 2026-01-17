const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

function drawIcon(size) {
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');

    const scale = size / 512;
    ctx.scale(scale, scale);

    // Background gradient
    const bgGradient = ctx.createLinearGradient(0, 0, 512, 512);
    bgGradient.addColorStop(0, '#667eea');
    bgGradient.addColorStop(0.5, '#06b6d4');
    bgGradient.addColorStop(1, '#14b8a6');

    ctx.beginPath();
    ctx.arc(256, 256, 256, 0, Math.PI * 2);
    ctx.fillStyle = bgGradient;
    ctx.fill();

    // Water droplet gradient
    const dropletGradient = ctx.createLinearGradient(180, 100, 332, 356);
    dropletGradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
    dropletGradient.addColorStop(0.5, 'rgba(224, 247, 250, 0.8)');
    dropletGradient.addColorStop(1, 'rgba(6, 182, 212, 0.95)');

    // Main water droplet
    ctx.beginPath();
    ctx.moveTo(256, 100);
    ctx.bezierCurveTo(200, 150, 180, 220, 180, 280);
    ctx.bezierCurveTo(180, 322, 214, 356, 256, 356);
    ctx.bezierCurveTo(298, 356, 332, 322, 332, 280);
    ctx.bezierCurveTo(332, 220, 312, 150, 256, 100);
    ctx.closePath();
    ctx.fillStyle = dropletGradient;
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 4;
    ctx.stroke();

    // Highlight on droplet
    const highlight = ctx.createRadialGradient(230, 200, 0, 230, 200, 60);
    highlight.addColorStop(0, 'rgba(255, 255, 255, 0.6)');
    highlight.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.save();
    ctx.beginPath();
    ctx.scale(1, 1.5);
    ctx.arc(230, 200/1.5, 35, 0, Math.PI * 2);
    ctx.restore();
    ctx.fillStyle = highlight;
    ctx.fill();

    // Small droplet accent
    ctx.beginPath();
    ctx.arc(300, 380, 22, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(224, 247, 250, 0.8)';
    ctx.fill();

    // Smaller accent droplet
    ctx.beginPath();
    ctx.arc(210, 370, 15, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(224, 247, 250, 0.7)';
    ctx.fill();

    // Ripple circles at bottom
    ctx.beginPath();
    ctx.arc(256, 420, 60, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(256, 420, 80, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 2;
    ctx.stroke();

    return canvas;
}

// Generate icons
const sizes = [192, 512];
const outputDir = path.join(__dirname, 'www', 'img');

sizes.forEach(size => {
    const canvas = drawIcon(size);
    const buffer = canvas.toBuffer('image/png');
    const filename = path.join(outputDir, `icon-${size}.png`);
    fs.writeFileSync(filename, buffer);
    console.log(`Generated ${filename}`);
});

console.log('All icons generated successfully!');
