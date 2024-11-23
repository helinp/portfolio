import fs from 'fs-extra';
import path from 'path';
import { markdownToHtml } from './markdownToHtml.js';

export async function getProjects() {
  const projectDir = './public/projects';
  const allEntries = await fs.readdir(projectDir, { withFileTypes: true });

  // Filtre uniquement les dossiers, exclut les fichiers comme .DS_Store
  const folders = allEntries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    // sort descending
    .sort((a, b) => b.localeCompare(a));

  const projects = await Promise.all(
    folders.map(async (folder) => {
      const folderPath = path.join(projectDir, folder);

      // Filtrer les fichiers d'image
      const images = (await fs.readdir(folderPath)).filter((file) =>
        file.match(/\.(jpg|png|jpeg)$/i)
      );

      // Chemins des descriptions
      const descriptionFrPath = path.join(folderPath, 'description.fr.txt');
      const descriptionEnPath = path.join(folderPath, 'description.en.txt');

      // Lire les descriptions si elles existent
      const markdownFr = (await fs.pathExists(descriptionFrPath))
        ? await fs.readFile(descriptionFrPath, 'utf8')
        : '';
      const markdownEn = (await fs.pathExists(descriptionEnPath))
        ? await fs.readFile(descriptionEnPath, 'utf8')
        : '';

      return {
        title: folder,
        slug: folder, // Utilise le nom du dossier comme slug
        descriptions: {
          fr: markdownToHtml(markdownFr),
          en: markdownToHtml(markdownEn),
        },
        images: images.map((image) => `/projects/${folder}/${image}`), // Convertir les chemins d'images
      };
    })
  );

  return projects;
}
