// Gera as versões web das capturas de projetos, sem alterar o seu conteúdo visual.
//   node tools/build-project-images.mjs
// Lê os originais de PROJECT_ORIGINALS_DIR (padrão: ../portfolio_Evan_privado/projetos-originais),
// fora do repositório. Só converte para WebP e, nas capturas 4K, reduz a largura. Nenhuma tarja,
// máscara ou desfoque é adicionado: o tratamento de confidencialidade é o feito pelo autor.
// Grava em public/assets/projetos e atualiza src/content/project-images.ts (dimensões e SHA-256
// dos originais, usado pelos testes para garantir que os PNGs originais não são publicados).
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { images } from './project-images.config.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const originalsDir = process.env.PROJECT_ORIGINALS_DIR ?? join(root, '..', 'portfolio_Evan_privado', 'projetos-originais');
const outDir = join(root, 'public', 'assets', 'projetos');
if (!existsSync(originalsDir)) {
  console.error(`Pasta de originais não encontrada: ${originalsDir}`);
  process.exit(1);
}

// Nomes com acento podem estar em NFC ou NFD conforme o sistema de arquivos.
const nfc = (s) => s.normalize('NFC');
const available = new Map(readdirSync(originalsDir).map((n) => [nfc(n), n]));

rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });

const records = [];
for (const img of images) {
  const real = available.get(nfc(img.original));
  if (!real) throw new Error(`Original ausente: ${img.original}`);
  const buf = readFileSync(join(originalsDir, real));
  const meta = await sharp(buf).metadata();

  const base = sharp(buf).removeAlpha();
  const full = await base
    .clone()
    .resize({ width: Math.min(img.maxWidth, meta.width), withoutEnlargement: true })
    .webp({ quality: 92, effort: 5 })
    .toBuffer({ resolveWithObject: true });
  const thumb = await base.clone().resize({ width: 720 }).webp({ quality: 84, effort: 5 }).toBuffer({ resolveWithObject: true });

  writeFileSync(join(outDir, `${img.id}.webp`), full.data);
  writeFileSync(join(outDir, `${img.id}-thumb.webp`), thumb.data);
  records.push({
    id: img.id,
    alt: img.alt,
    caption: img.caption,
    width: full.info.width,
    height: full.info.height,
    thumbWidth: thumb.info.width,
    thumbHeight: thumb.info.height,
    originalSha256: createHash('sha256').update(buf).digest('hex'),
  });
  console.log(`${img.id}: ${full.info.width}x${full.info.height} (${Math.round(full.data.length / 1024)} KB), miniatura ${Math.round(thumb.data.length / 1024)} KB`);
}

const body = `// Gerado por tools/build-project-images.mjs. Não editar à mão.
// As imagens públicas são as capturas fornecidas pelo autor, apenas convertidas para WebP e, quando
// 4K, reduzidas em largura. O tratamento de confidencialidade (desfoque) é o já presente nelas;
// nenhuma camada é adicionada. \`originalSha256\` identifica o PNG original, mantido fora do repositório.
export interface ProjectImage {
  id: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
  thumbWidth: number;
  thumbHeight: number;
  originalSha256: string;
}

export const projectImages: ProjectImage[] = ${JSON.stringify(records, null, 2)};

export function getProjectImage(id: string): ProjectImage | undefined {
  return projectImages.find((i) => i.id === id);
}
`;
writeFileSync(join(root, 'src', 'content', 'project-images.ts'), body);
console.log(`\n${records.length} imagens em ${outDir}`);
