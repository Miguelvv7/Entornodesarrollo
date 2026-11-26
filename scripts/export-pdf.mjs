/**
 * Genera el PDF horizontal (15 páginas, 1920×1080) a partir de la vista de impresión.
 * Uso:  npm run pdf      (compila y exporta)
 * Resultado: exports/IntelliJ-IDEA-Beyond-the-Code.pdf
 */
import { createServer } from 'node:http';
import { readFile, mkdir, writeFile, stat } from 'node:fs/promises';
import { extname, join, resolve } from 'node:path';
import { chromium } from 'playwright';
import { PDFDocument } from 'pdf-lib';

const root = resolve('dist');
const outDir = resolve('exports');
const outFile = join(outDir, 'IntelliJ-IDEA-Beyond-the-Code.pdf');
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.woff2': 'font/woff2' };

try { await stat(join(root, 'index.html')); } catch {
  console.error('No existe dist/. Ejecuta primero "npm run build" (o usa "npm run pdf").');
  process.exit(1);
}

const server = createServer(async (req, res) => {
  const path = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  const file = join(root, path === '/' ? 'index.html' : path);
  try {
    const body = await readFile(file);
    res.writeHead(200, { 'Content-Type': types[extname(file)] ?? 'application/octet-stream' });
    res.end(body);
  } catch {
    res.writeHead(404); res.end();
  }
}).listen(0);
const port = server.address().port;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
page.on('console', (m) => { if (m.type() === 'error' && !m.text().includes('404')) console.warn('[consola]', m.text()); });
await page.goto(`http://localhost:${port}/?print`, { waitUntil: 'networkidle' });
await page.waitForFunction(() => window.__PRINT_READY__ === true, null, { timeout: 30000 });
await page.emulateMedia({ media: 'print' });
const pdf = await page.pdf({ width: '1920px', height: '1080px', printBackground: true, margin: { top: 0, right: 0, bottom: 0, left: 0 } });
await browser.close();
server.close();

// metadatos del documento
const doc = await PDFDocument.load(pdf);
doc.setTitle('IntelliJ IDEA — Beyond the Code');
doc.setSubject('Actividad 2.3. Análisis de un Entorno Integrado de Desarrollo (IDE) · Entornos de Desarrollo · 1º DAM');
doc.setAuthor('Miguel Victorio Villalón, Luis Miguel Castel Osuna, Daniel Castro Martín');
doc.setCreator('Miguel Victorio Villalón');
doc.setProducer('Miguel Victorio Villalón');
doc.setKeywords(['IntelliJ IDEA', 'IDE', 'Entornos de Desarrollo', 'DAM']);
const bytes = await doc.save();

await mkdir(outDir, { recursive: true });
await writeFile(outFile, bytes);
console.log(`PDF generado: ${outFile} (${doc.getPageCount()} páginas)`);
