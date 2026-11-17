// Sincroniza conteúdo e imagens do site atual da FAEX para o projeto.
// Uso: npm run sync
// - Busca dados na API pública (https://api.faex.edu.br/v1)
// - Baixa todas as imagens para public/images/<grupo>/
// - Grava os JSON (com URLs já apontando para as imagens locais) em src/data/
import { mkdir, writeFile, access } from 'node:fs/promises';
import path from 'node:path';

const API = 'https://api.faex.edu.br/v1';
const ROOT = path.resolve(import.meta.dirname, '..');
const IMG_DIR = path.join(ROOT, 'public', 'images');
const DATA_DIR = path.join(ROOT, 'src', 'data');
const UA = { 'User-Agent': 'Mozilla/5.0 (site-faex-sync)' };

const ENDPOINTS = {
  banners: '/banners',
  cursos: '/cursos',
  destaques: '/cursos/destaques',
  noticias: '/noticias',
  eventos: '/eventos',
};

// Imagens fixas do site (logo, fotos institucionais), encontradas no bundle original.
const SITE_IMAGES = [
  'https://faex.edu.br/storage/site/f6786241b_logo.png',
  'https://faex.edu.br/storage/site/favicon.png',
  'https://faex.edu.br/storage/site/og-image.png',
  'https://faex.edu.br/storage/site/faex_foto.jpg',
  'https://faex.edu.br/storage/site/e033cb25d_certificado.jpg',
  'https://faex.edu.br/storage/site/photo-1498243691581-b145c3f54a5a.jpg',
  'https://faex.edu.br/storage/cpa/cpa_alunos_2026_1.png',
  'https://faex.edu.br/storage/cpa/cpa_professores_2026_1.png',
];

const downloaded = new Map();

function localName(url) {
  const u = new URL(url);
  let base = path.basename(u.pathname);
  if (!/\.(png|jpe?g|webp|gif|svg|avif)$/i.test(base)) base += '.jpg';
  return base;
}

async function exists(p) {
  try { await access(p); return true; } catch { return false; }
}

async function download(url, group) {
  if (!url || typeof url !== 'string' || !/^https?:\/\//.test(url)) return url;
  if (downloaded.has(url)) return downloaded.get(url);
  const name = localName(url);
  const dir = path.join(IMG_DIR, group);
  const file = path.join(dir, name);
  const publicPath = `/images/${group}/${name}`;
  await mkdir(dir, { recursive: true });
  if (!(await exists(file))) {
    const res = await fetch(url, { headers: UA });
    if (!res.ok) {
      console.warn(`  ! falhou (${res.status}): ${url}`);
      downloaded.set(url, url);
      return url;
    }
    await writeFile(file, Buffer.from(await res.arrayBuffer()));
    console.log(`  ↓ ${publicPath}`);
  }
  downloaded.set(url, publicPath);
  return publicPath;
}

// Troca recursivamente qualquer campo *imagem* / *_url de imagem pela versão local.
async function localize(value, group) {
  if (Array.isArray(value)) return Promise.all(value.map((v) => localize(v, group)));
  if (value && typeof value === 'object') {
    const out = {};
    for (const [k, v] of Object.entries(value)) {
      out[k] = /imagem|image|foto|logo/i.test(k) && typeof v === 'string'
        ? await download(v, group)
        : await localize(v, group);
    }
    return out;
  }
  return value;
}

await mkdir(DATA_DIR, { recursive: true });

for (const [name, ep] of Object.entries(ENDPOINTS)) {
  console.log(`→ ${name} (${ep})`);
  const res = await fetch(API + ep, { headers: UA });
  if (!res.ok) { console.warn(`  ! API ${res.status}`); continue; }
  const group = name === 'destaques' ? 'cursos' : name;
  const data = await localize(await res.json(), group);
  await writeFile(path.join(DATA_DIR, `${name}.json`), JSON.stringify(data, null, 2));
}

console.log('→ imagens do site');
const site = {};
for (const url of SITE_IMAGES) site[path.basename(new URL(url).pathname, path.extname(url))] = await download(url, 'site');
await writeFile(path.join(DATA_DIR, 'site-images.json'), JSON.stringify(site, null, 2));

console.log(`\nOK: ${downloaded.size} imagens processadas.`);
