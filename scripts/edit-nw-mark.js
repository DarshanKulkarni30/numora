const sharp = require("sharp");
const fs = require("fs");
const { execSync } = require("child_process");

async function main() {
  // Always start from the known-good closed monogram (inner green smile intact)
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
      const maxHalf = 4 + 10 * (dist / tip);
      if (Math.abs(rad - rMidRing) > maxHalf) {
        const i = (y * w + x) * 4;
        data[i] = 0;
        data[i + 1] = 0;
        data[i + 2] = 0;
        data[i + 3] = 0;
      }
    }
  }

  // Subtle plinth under the ring — navy/gold stroke stays; green sits as a stand.
  // Offset center so the pad reads as a base, not a second ring segment.
  const pCx = cx;
  const pCy = cy + 20;
  const pA0 = (74 * Math.PI) / 180;
  const pA1 = (106 * Math.PI) / 180;
  const pMid = (pA0 + pA1) / 2;
  const pHalf = (pA1 - pA0) / 2;
  const GR = 62;
  const GG = 128;
  const GB = 92;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      if (data[i + 3] > 28) continue; // never paint over letters, smile, or ring

      const dx = x - pCx;
      const dy = y - pCy;
      const rad = Math.hypot(dx, dy);
      const ang = Math.atan2(dy, dx);
      if (ang < pA0 || ang > pA1) continue;

      const t = (ang - pMid) / pHalf; // -1 … 1
      const taper = Math.pow(Math.cos((t * Math.PI) / 2), 1.15);
      const rInner = 458;
      const thick = 11 + 14 * Math.pow(taper, 1.6);
      const rOuter = rInner + thick;
      if (rad < rInner || rad > rOuter) continue;

      const edge = Math.min(rad - rInner, rOuter - rad, (1 - Math.abs(t)) * 18);
      const edgeFade = Math.min(1, edge / 2);
      const alpha = Math.round(255 * edgeFade);
      if (alpha < 12) continue;

      data[i] = GR;
      data[i + 1] = GG;
      data[i + 2] = GB;
      data[i + 3] = alpha;
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
  let innerGreen = 0;
  let plinth = 0;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      const rad = Math.hypot(x - cx, y - cy);
      const ang = Math.atan2(y - cy, x - cx);
      if (rad >= 380 && rad <= 500 && ang >= cutA0 && ang <= cutA1 && data[i + 3] > 0) {
        gapGhost++;
      }
      if (data[i + 3] > 80 && data[i + 1] > data[i] + 20 && data[i + 1] > data[i + 2] + 10) {
        if (rad < 410) innerGreen++;
        else plinth++;
      }
    }
  }
  console.log({ gapGhost, innerGreen, plinth });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
