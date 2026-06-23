/**
 * Transforme une URL Cloudinary pour servir une image redimensionnée depuis le CDN.
 * Évite que Next.js télécharge l'image pleine résolution (1400px) pour la redimensionner côté serveur.
 */
export function cloudinaryUrl(url, { width, height, quality = 'auto' } = {}) {
  if (!url?.includes('res.cloudinary.com')) return url;
  const idx = url.indexOf('/upload/');
  if (idx === -1) return url;
  const before = url.slice(0, idx + 8); // "https://.../upload/"
  const after = url.slice(idx + 8);     // "v123.../folder/image.webp"

  const t = [`f_webp`, `q_${quality}`];
  if (width)  t.push(`w_${width}`);
  if (height) t.push(`h_${height}`, `c_fill`);

  return `${before}${t.join(',')}/` + after;
}
