/** Prefixa o basePath do GitHub Pages em caminhos de arquivos estáticos (PDF, DOCX, imagens). */
export function withBasePath(path: string, base: string = process.env.NEXT_PUBLIC_BASE_PATH ?? ''): string {
  if (/^(https?:|mailto:|#)/.test(path)) return path;
  const clean = path.startsWith('/') ? path : `/${path}`;
  return `${base}${clean}`;
}
