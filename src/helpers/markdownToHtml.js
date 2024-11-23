import { marked } from 'marked';
import { JSDOM } from 'jsdom';
import DOMPurify from 'dompurify';

// Configuration de marked
const markedOptions = {
  breaks: true, // Convertir les sauts de ligne en <br>
  gfm: true, // Activer GitHub Flavored Markdown
};

/**
 * Convert Markdown to sanitized HTML5 with Tailwind classes.
 * @param {string} markdown - The markdown content to convert.
 * @returns {string} - The HTML string with Tailwind CSS classes applied.
 */
export function markdownToHtml(markdown) {
  if (typeof markdown !== 'string' || markdown.trim() === '') {
    console.warn('Invalid Markdown input');
    return ``;
  }

  try {
    // Configurer marked
    marked.setOptions(markedOptions);

    // Convertir le Markdown en HTML brut
    const rawHtml = marked(markdown);

    // Sanitize le HTML avec DOMPurify
    const dom = new JSDOM('');
    const purifier = DOMPurify(dom.window);
    const sanitizedHtml = purifier.sanitize(rawHtml);
    dom.window.close(); // Libère les ressources associées

    // Retourner le HTML encapsulé avec des classes Tailwind
    return `
      <div class="prose prose-lg prose-blue max-w-none">
        ${sanitizedHtml}
      </div>
    `;
  } catch (error) {
    console.error('Error converting Markdown to HTML:', error);
    return `<p class="text-red-500">Error rendering content.</p>`;
  }
}
