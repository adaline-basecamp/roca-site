/**
 * Roca Fuels — asset pipeline
 * Converts client JPGs (read-only source folder on Zoheb's PC) to webp into
 * public/gallery/{opening,station}/ and emits src/data/gallery.json.
 * Usage: node scripts/optimize-images.mjs
 */
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const ASSETS = path.resolve(ROOT, "..", "Roca Fuels Assets", "Images");

const SETS = [
  { dir: "Inauguration Photos", slug: "opening", label: "Grand Opening" },
  { dir: "Pump Photos", slug: "station", label: "Station & Facilities" },
];

const MAX_WIDTH = 1800;
const QUALITY = 78;

async function run() {
  const outJson = path.join(ROOT, "src", "data", "gallery.json");
  let existing = [];
  try {
    existing = JSON.parse(await fs.readFile(outJson, "utf8"));
  } catch {
    // No existing gallery.json yet — starting fresh.
  }
  const knownSlugs = new Set(SETS.map((s) => s.slug));
  // Preserve categories (e.g. coming-soon placeholders) not produced by this
  // script, so regenerating opening/station doesn't wipe them out.
  const preserved = existing.filter((c) => !knownSlugs.has(c.slug));

  const data = [];
  let total = 0;
  for (const set of SETS) {
    const srcDir = path.join(ASSETS, set.dir);
    const outDir = path.join(ROOT, "public", "gallery", set.slug);
    await fs.mkdir(outDir, { recursive: true });
    const files = (await fs.readdir(srcDir))
      .filter((f) => /\.jpe?g$/i.test(f))
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
    const images = [];
    for (const [i, file] of files.entries()) {
      const outName = `${set.slug}-${String(i + 1).padStart(2, "0")}.webp`;
      const info = await sharp(path.join(srcDir, file))
        .rotate() // respect EXIF orientation from the camera
        .resize({ width: MAX_WIDTH, withoutEnlargement: true })
        .webp({ quality: QUALITY })
        .toFile(path.join(outDir, outName));
      images.push({ src: `/gallery/${set.slug}/${outName}`, width: info.width, height: info.height });
      total += 1;
    }
    data.push({ slug: set.slug, label: set.label, count: images.length, images });
    console.log(`${set.label}: ${images.length} images`);
  }
  const combined = [...data, ...preserved];
  await fs.mkdir(path.dirname(outJson), { recursive: true });
  await fs.writeFile(outJson, JSON.stringify(combined, null, 2));
  console.log(`\nWrote ${outJson} — ${total} images (+${preserved.length} preserved categories).`);
}

run().catch((e) => { console.error(e); process.exit(1); });
