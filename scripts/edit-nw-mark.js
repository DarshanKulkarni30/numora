const sharp = require("sharp");
const fs = require("fs");

async function main() {
  const src = "public/nw-mark.png";
  const meta = await sharp(src).metadata();
  const w = meta.width;
  const h = meta.height;
  const cx = w / 2;
  const cy = h / 2;
  // Outer ring radius tuned to the mark framing
  const r = Math.min(w, h) * 0.435;
  const stroke = Math.max(12, Math.round(w * 0.024));

  const rad = (d) => (d * Math.PI) / 180;
  // Small open gap on the 45° (top-right) side
  const a0 = rad(-52);
  const a1 = rad(-38);
  const x0 = cx + r * Math.cos(a0);
  const y0 = cy + r * Math.sin(a0);
  const x1 = cx + r * Math.cos(a1);
  const y1 = cy + r * Math.sin(a1);

  const erase = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">` +
      `<path d="M ${x0.toFixed(2)} ${y0.toFixed(2)} A ${r} ${r} 0 0 1 ${x1.toFixed(2)} ${y1.toFixed(2)}" ` +
      `fill="none" stroke="#000000" stroke-width="${stroke * 2.8}" stroke-linecap="round"/>` +
      `</svg>`,
  );

  await sharp(src)
    .ensureAlpha()
    .composite([{ input: erase, blend: "dest-out" }])
    .png()
    .toFile("public/_nw-edit.png");

  for (const f of ["nw-mark.png", "favicon.png", "numora-mark.png"]) {
    fs.copyFileSync("public/_nw-edit.png", `public/${f}`);
  }
  fs.unlinkSync("public/_nw-edit.png");
  console.log("opened 45deg gap on", w, "px mark");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
