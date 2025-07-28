import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Pour __dirname en ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sourceBase = path.join(__dirname, 'projects-src');
const destBase = path.join(__dirname, 'public/projects');
const targetWidth = 800;

function processFolder(subfolder) {
  const srcFolder = path.join(sourceBase, subfolder);
  const destFolder = path.join(destBase, subfolder);

  fs.mkdirSync(destFolder, { recursive: true });

  const files = fs.readdirSync(srcFolder);

  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    const inputPath = path.join(srcFolder, file);
    const outputPath = path.join(destFolder, file);

    if ([".png", ".jpg", ".jpeg"].includes(ext)) {
      sharp(inputPath)
        .resize({ width: targetWidth })
        .toFile(outputPath)
        .then(() => console.log(`✔️ ${subfolder}/${file} redimensionné`))
        .catch((err) => console.error(`Erreur avec ${file}:`, err));
    } else {
      fs.copyFileSync(inputPath, outputPath);
      console.log(`📄 ${subfolder}/${file} copié`);
    }
  }
}

function getSubfolders(dir) {
  return fs.readdirSync(dir).filter((f) =>
    fs.statSync(path.join(dir, f)).isDirectory()
  );
}

const folders = getSubfolders(sourceBase);
for (const folder of folders) {
  processFolder(folder);
}
