const sharp = require("sharp");
const fs = require("fs");
const { execSync } = require("child_process");

async function main() {
  // Always start from the known-good closed monogram
  execSync("git checkout 802bcef -- public/nw-mark.png", { stdio: "inherit" });
  const buf = fs.readFileSync("public/nw-mark.png");
  const w = 1024;
  const h = 1024;
  const cx = 512;
  const cy = 512;

  const { data, info } = await sharp(buf)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  // Near-white → transparent (AA fringes were reading as a “bubble” on dark UIs)
  for (let i = 0; i < data.length; i += 4) {
    if (data[i] > 235 && data[i + 1] > 235 && data[i + 2] > 230) {
      data[i] = 0;
      data[i + 1] = 0;
      data[i + 2] = 0;
      data[i + 3] = 0;
    }
  }

  // Erase original green smile everywhere (including light mint anti-alias)
  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] < 5) continue;
    const r0 = data[i];
    const g0 = data[i + 1];
    const b0 = data[i + 2];
    const isGreen =
      (g0 > r0 + 8 && g0 > b0 + 8 && g0 > 50 && r0 < 200 && b0 < 180) ||
      (g0 > 180 && r0 > 120 && b0 > 150 && g0 >= r0 && g0 >= b0 && r0 < 250); // mint AA
    if (isGreen) {
      data[i] = 0;
      data[i + 1] = 0;
      data[i + 2] = 0;
      data[i + 3] = 0;
    }
  }

  // Also clear any leftover non-letter ink in the old smile band (inner bottom arc)
  for (let y = Math.floor(h * 0.72); y < Math.floor(h * 0.92); y++) {
    for (let x = Math.floor(w * 0.28); x < Math.floor(w * 0.72); x++) {
      const rad = Math.hypot(x - cx, y - cy);
      if (rad < 340 || rad > 410) continue;
      const i = (y * w + x) * 4;
      if (data[i + 3] < 5) continue;
      const r0 = data[i];
      const g0 = data[i + 1];
      const b0 = data[i + 2];
      // keep letter blue; clear green/mint/gray smile remnants
      const isLetterBlue = b0 > r0 + 40 && b0 > g0 + 20 && b0 > 100 && r0 < 80;
      if (!isLetterBlue) {
        data[i] = 0;
        data[i + 1] = 0;
        data[i + 2] = 0;
        data[i + 3] = 0;
      }
    }
  }

  // Open cut at ~45° — fully clear RGB+alpha (no grey ghost / bubble)
  const cutA0 = (-57 * Math.PI) / 180;
  const cutA1 = (-33 * Math.PI) / 180;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const rad = Math.hypot(x - cx, y - cy);
      if (rad < 380 || rad > 500) continue;
      const ang = Math.atan2(y - cy, x - cx);
      if (ang >= cutA0 && ang <= cutA1) {
        const i = (y * w + x) * 4;
        data[i] = 0;
        data[i + 1] = 0;
        data[i + 2] = 0;
        data[i + 3] = 0;
      }
    }
  }

  // Taper cut tips so ends don’t read as a thick “bubble” nub
  const tip = (3 * Math.PI) / 180;
  const rMidRing = 448;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const rad = Math.hypot(x - cx, y - cy);
      if (rad < 380 || rad > 500) continue;
      const ang = Math.atan2(y - cy, x - cx);
      const onTip =
        (ang >= cutA0 - tip && ang < cutA0) || (ang > cutA1 && ang <= cutA1 + tip);
      if (!onTip) continue;
      const dist = Math.abs(ang - (ang < cutA0 ? cutA0 : cutA1));
      const maxHalf = 4 + 10 * (dist / tip); // thinner at the open end
      if (Math.abs(rad - rMidRing) > maxHalf) {
        const i = (y * w + x) * 4;
        data[i] = 0;
        data[i + 1] = 0;
        data[i + 2] = 0;
        data[i + 3] = 0;
      }
    }
  }

  // Single grounded green = bottom of the SAME ring (no inner smile, no detached outer bar)
  const gA0 = (50 * Math.PI) / 180;
  const gA1 = (130 * Math.PI) / 180;
  const GR = 90;
  const GG = 143;
  const GB = 106;
  const rMid = 448;
  const halfThick = 18;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const dx = x - cx;
      const dy = y - cy;
      const rad = Math.hypot(dx, dy);
      if (Math.abs(rad - rMid) > halfThick) continue;
      const ang = Math.atan2(dy, dx);
      if (ang < gA0 || ang > gA1) continue;
      const i = (y * w + x) * 4;
      data[i] = GR;
      data[i + 1] = GG;
      data[i + 2] = GB;
      data[i + 3] = 255;
    }
  }

  const out = await sharp(data, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .png()
    .toBuffer();

  for (const f of ["nw-mark.png", "favicon.png", "numora-mark.png"]) {
    fs.writeFileSync(`public/${f}`, out);
  }

  let gapGhost = 0;
  let greenCount = 0;
  let greenMinY = 9999;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      const rad = Math.hypot(x - cx, y - cy);
      const ang = Math.atan2(y - cy, x - cx);
      if (rad >= 380 && rad <= 500 && ang >= cutA0 && ang <= cutA1 && data[i + 3] > 0) {
        gapGhost++;
      }
      if (data[i + 3] > 200 && data[i] === GR && data[i + 1] === GG) {
        greenCount++;
        greenMinY = Math.min(greenMinY, y);
      }
    }
  }
  console.log({ gapGhost, greenCount, greenMinY });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
