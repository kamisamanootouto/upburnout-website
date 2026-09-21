// Pregătește imaginile din content/assets/original/ (sursa de adevăr, ~42 MB, NU în repo)
// pentru src/assets/ (în repo, optimizate). Rulează o singură dată / la fiecare schimbare de original:
//   npm run images
//
// Reguli (docs/FEATURE_REQUIREMENTS.md §2, content/assets/manifest.md):
// - portretele echipei: crop centrat 3:4 (echivalentul `fill/al_c` din Wix), max 900×1200, JPEG q85, CMYK→sRGB
// - logo UVT/FPSE: PNG cu transparență, max 900px lățime
// - codul QR: copiat NEATINS în public/ (trebuie să rămână scanabil)
// - ilustrațiile Vecteezy (5): reduse la ~2× dimensiunea afișată, JPEG q82 (OPEN_QUESTIONS #22 — clientul le-a cerut înapoi)
import { mkdir, copyFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const here = path.dirname(fileURLToPath(import.meta.url));
const ORIGINALS = path.resolve(here, '../../content/assets/original');
const OUT_TEAM = path.resolve(here, '../src/assets/team');
const OUT_ASSETS = path.resolve(here, '../src/assets');
const OUT_PUBLIC = path.resolve(here, '../public');

const portraits = [
  ['echipa-02-athena-gandila.png', 'athena-gandila.jpg'],
  ['echipa-03-andrei-rusu.jpg', 'andrei-rusu.jpg'],
  ['echipa-04-delia-virga.png', 'delia-virga.jpg'],
  ['echipa-05-bogdan-tulbure.png', 'bogdan-tulbure.jpg'],
  ['echipa-06-ioana-podina.png', 'ioana-podina.jpg'],
  ['echipa-07-shannon-sauer-zavala.png', 'shannon-sauer-zavala.jpg'],
  ['echipa-08-gianina-buruczky.png', 'gianina-buruczky.jpg'],
  ['echipa-09-daniel-dragulescu.jpeg', 'daniel-dragulescu.jpg'],
  ['echipa-10-gabriela-micu.png', 'gabriela-micu.jpg'],
  ['echipa-11-vlad-cosa.jpeg', 'vlad-cosa.jpg'],
];

async function exists(p) {
  try {
    await stat(p);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  if (!(await exists(ORIGINALS))) {
    throw new Error(`Lipsește folderul cu originale: ${ORIGINALS}`);
  }
  await mkdir(OUT_TEAM, { recursive: true });
  await mkdir(OUT_PUBLIC, { recursive: true });

  for (const [src, out] of portraits) {
    const input = path.join(ORIGINALS, src);
    const output = path.join(OUT_TEAM, out);
    const meta = await sharp(input).metadata();
    // Sursele mici (ex. 480×474) nu se măresc: astro:assets nu face upscaling, iar CSS-ul acoperă cardul.
    const targetW = Math.min(900, meta.width ?? 900);
    const targetH = Math.round((targetW * 4) / 3);
    await sharp(input, { limitInputPixels: false })
      .rotate() // respectă EXIF orientation (poze de pe telefon)
      .toColourspace('srgb') // CMYK → sRGB (Andrei Rusu.jpg)
      .resize(targetW, targetH, { fit: 'cover', position: 'centre', withoutEnlargement: false })
      .flatten({ background: '#ffffff' }) // PNG-urile cu alpha devin JPEG pe alb
      .jpeg({ quality: 85, mozjpeg: true })
      .toFile(output);
    const info = await sharp(output).metadata();
    console.log(
      `portret  ${out.padEnd(28)} ${meta.width}×${meta.height} ${meta.space} → ${info.width}×${info.height}`,
    );
  }

  // Ilustrațiile Vecteezy — clientul le-a cerut înapoi (2026-09-21): originalele uriașe (până la 7973px)
  // se reduc la ~2× dimensiunea afișată; fundalul alb se integrează pe secțiuni colorate cu mix-blend-mode: multiply.
  const illustrations = [
    ['acasa-02-hero-ilustratie-femeie-plante.jpg', 'hero-femeie-plante.jpg', 1400],
    ['acasa-03-despre-terapie-grup.jpg', 'despre-terapie-grup.jpg', 1600],
    ['acasa-04-scopul-cercetarii-ilustratie.jpg', 'scop-cercetare.jpg', 1200],
    ['acasa-05-participare-ilustratie-cap-creier.jpg', 'participare-cap-creier.jpg', 900],
    ['echipa-01-despre-noi-ilustratie-bec-puzzle.png', 'echipa-despre-noi-bec-puzzle.jpg', 1400],
  ];
  const OUT_ILL = path.join(OUT_ASSETS, 'illustrations');
  await mkdir(OUT_ILL, { recursive: true });
  for (const [src, out, width] of illustrations) {
    const input = path.join(ORIGINALS, src);
    const output = path.join(OUT_ILL, out);
    await sharp(input, { limitInputPixels: false })
      .toColourspace('srgb')
      .resize({ width, withoutEnlargement: true })
      .flatten({ background: '#ffffff' })
      .jpeg({ quality: 82, mozjpeg: true })
      .toFile(output);
    const info = await sharp(output).metadata();
    console.log(`ilustr.  ${out.padEnd(32)} → ${info.width}×${info.height}`);
  }

  // Logo UVT / FPSE — păstrăm transparența.
  const logoIn = path.join(ORIGINALS, 'acasa-01-logo-fpse-uvt.png');
  const logoOut = path.join(OUT_ASSETS, 'logo-uvt-fpse.png');
  await sharp(logoIn)
    .resize({ width: 900, withoutEnlargement: true })
    .png({ compressionLevel: 9 })
    .toFile(logoOut);
  console.log('logo     logo-uvt-fpse.png');

  // Codul QR — copie 1:1, fără recompresie.
  await copyFile(
    path.join(ORIGINALS, 'acasa-06-qr-questionpro.png'),
    path.join(OUT_PUBLIC, 'qr-questionpro.png'),
  );
  console.log('qr       public/qr-questionpro.png (copiat neatins)');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
