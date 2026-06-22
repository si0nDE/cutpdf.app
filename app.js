/* PDF Tiler - local processing only
   Uses pdf-lib for writing the output PDF.
   Uses pdf.js (pdfjs-dist) to rasterize input pages reliably (keeps form fields/annotations/layers visible).
   Loads libs either from ./vendor (preferred) or from a CDN fallback.
*/

const el = (id) => document.getElementById(id);
const fileEl = el('file');
const dropzoneEl = el('dropzone');
const fileInfoEl = el('fileInfo');
const statusEl = el('status');
const generateBtn = el('generate');
const downloadA = el('download');

const rowsEl = el('rows');
const colsEl = el('cols');
const pagesEl = el('pages');

const outWEl = el('outW');
const outHEl = el('outH');
const scaleModeEl = el('scaleMode');
const marginEl = el('margin');
const overlapEl = el('overlap');

const donatePanelEl  = el('donate-panel');
const donateBarEl    = el('donate-bar');
const donateCountEl  = el('donate-countdown');

const splitCustomEl    = el('splitCustomFields');
const formatCustomEl   = el('formatCustomFields');
const erweiterFieldsEl = el('erweiterFields');
const erweiterToggleEl = el('erweiterToggle');

let activeFormat = 'tile';
let splitSelected = false;
let donateIntervalId = null;

let loadedBytes = null;
let loadedName = 'input.pdf';
let PDFLib = null;
let PDFJS = null;

function mmToPt(mm) {
  return (mm * 72) / 25.4;
}

function setStatus(msg, kind = '') {
  statusEl.className = 'status' + (kind ? ' ' + kind : '');
  statusEl.textContent = msg;
}

function setFileInfo(msg, kind = '') {
  fileInfoEl.className = 'file-info' + (kind ? ' ' + kind : '');
  fileInfoEl.textContent = msg;
}

function startDonationCountdown() {
  if (donateIntervalId !== null) {
    clearInterval(donateIntervalId);
    donateIntervalId = null;
  }
  donatePanelEl.hidden = false;
  donatePanelEl.classList.remove('donate-panel--done');
  donateBarEl.style.transform = 'scaleX(1)';
  downloadA.style.display = 'none';

  let remaining = 5;
  donateCountEl.textContent = remaining;

  donateIntervalId = setInterval(() => {
    remaining -= 1;
    donateBarEl.style.transform = `scaleX(${remaining / 5})`;
    donateCountEl.textContent = remaining > 0 ? remaining : '';

    if (remaining <= 0) {
      clearInterval(donateIntervalId);
      donateIntervalId = null;
      downloadA.classList.remove('btn--reveal');
      void downloadA.offsetWidth;
      downloadA.style.display = 'inline-block';
      downloadA.classList.add('btn--reveal');
      donatePanelEl.classList.add('donate-panel--done');
    }
  }, 1000);
}

function clampInt(n, min, max) {
  n = Math.floor(Number(n));
  if (!Number.isFinite(n)) return min;
  return Math.min(max, Math.max(min, n));
}

function parsePageRanges(input, maxPage) {
  // Returns 0-based indices
  const s = (input || '').trim();
  if (!s) return Array.from({ length: maxPage }, (_, i) => i);

  const parts = s.split(',').map(p => p.trim()).filter(Boolean);
  const set = new Set();

  for (const part of parts) {
    const m = part.match(/^(\d+)\s*-\s*(\d+)$/);
    if (m) {
      let a = parseInt(m[1], 10);
      let b = parseInt(m[2], 10);
      if (!Number.isFinite(a) || !Number.isFinite(b)) continue;
      if (a > b) [a, b] = [b, a];
      a = Math.max(1, a);
      b = Math.min(maxPage, b);
      for (let p = a; p <= b; p++) set.add(p - 1);
      continue;
    }
    const n = parseInt(part, 10);
    if (Number.isFinite(n) && n >= 1 && n <= maxPage) set.add(n - 1);
  }

  const arr = Array.from(set).sort((x, y) => x - y);
  if (!arr.length) throw new Error('Seitenbereich ist leer oder ungültig.');
  return arr;
}


async function loadPdfLib() {
  if (PDFLib) return PDFLib;

  PDFLib = await new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = './vendor/pdf-lib.min.js';
    s.async = true;
    s.onload = () => {
      if (window.PDFLib) resolve(window.PDFLib);
      else reject(new Error('PDFLib nicht gefunden nach Script-Load.'));
    };
    s.onerror = () => reject(new Error('pdf-lib.min.js nicht gefunden. Bitte vendor/-Ordner prüfen.'));
    document.head.appendChild(s);
  });
  return PDFLib;
}

async function loadPdfJs() {
  if (PDFJS) return PDFJS;

  PDFJS = await new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = './vendor/pdf.min.js';
    s.async = true;
    s.onload = () => {
      if (window.pdfjsLib) resolve(window.pdfjsLib);
      else reject(new Error('pdfjsLib nicht gefunden nach Script-Load.'));
    };
    s.onerror = () => reject(new Error('pdf.min.js nicht gefunden. Bitte vendor/-Ordner prüfen.'));
    document.head.appendChild(s);
  });

  try { PDFJS.GlobalWorkerOptions.workerSrc = './vendor/pdf.worker.min.js'; } catch (_) {}

  return PDFJS;
}

async function canvasToPngBytes(canvas) {
  const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
  if (!blob) throw new Error('Konnte Canvas nicht in PNG umwandeln.');
  return await blob.arrayBuffer();
}

async function renderPageToPngBytes(pdfjsDoc, pageNumber, scale) {
  const page = await pdfjsDoc.getPage(pageNumber);
  const viewport = page.getViewport({ scale });

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d', { alpha: false });
  canvas.width = Math.ceil(viewport.width);
  canvas.height = Math.ceil(viewport.height);

  await page.render({ canvasContext: ctx, viewport }).promise;
  return await canvasToPngBytes(canvas);
}

async function handleSelectedFile(f) {
  downloadA.style.display = 'none';
  downloadA.removeAttribute('href');
  if (donateIntervalId !== null) { clearInterval(donateIntervalId); donateIntervalId = null; }
  donatePanelEl.hidden = true;
  donatePanelEl.classList.remove('donate-panel--done');
  generateBtn.disabled = true;
  loadedBytes = null;
  loadedName = 'input.pdf';

  if (!f) {
    setFileInfo('Noch keine Datei geladen.');
    return;
  }
  loadedName = f.name || 'input.pdf';

  try {
    setFileInfo('Lade PDF …');
    loadedBytes = await f.arrayBuffer();
    await loadPdfLib(); // warm-up
    setFileInfo(`Geladen: ${loadedName}`, 'ok');
    generateBtn.disabled = !splitSelected;
    setStatus(splitSelected ? 'Bereit.' : 'Aufteilung auswählen.');
  } catch (e) {
    console.error(e);
    setFileInfo('Konnte PDF nicht laden oder Bibliothek nicht initialisieren.', 'err');
    setStatus(String(e?.message || e), 'err');
  }
}

fileEl.addEventListener('change', async () => {
  const f = fileEl.files && fileEl.files[0];
  await handleSelectedFile(f);
});

document.querySelectorAll('.pill[data-preset]').forEach(btn => {
  btn.addEventListener('click', () => {
    const p = btn.getAttribute('data-preset');

    if (p === 'half_h') { rowsEl.value = 2; colsEl.value = 1; }
    if (p === 'half_v') { rowsEl.value = 1; colsEl.value = 2; }
    if (p === 'quarter') { rowsEl.value = 2; colsEl.value = 2; }
    if (p === '3x3')    { rowsEl.value = 3; colsEl.value = 3; }

    document.querySelectorAll('.pill[data-preset]').forEach(b => {
      b.classList.remove('active');
      b.setAttribute('aria-expanded', 'false');
    });
    btn.classList.add('active');

    const isCustom = p === 'custom';
    splitCustomEl.classList.toggle('open', isCustom);
    btn.setAttribute('aria-expanded', String(isCustom));
    if (isCustom) { rowsEl.focus(); rowsEl.select(); }

    splitSelected = true;
    if (loadedBytes) { generateBtn.disabled = false; setStatus('Bereit.'); }
  });
});

document.querySelectorAll('.pill[data-format]').forEach(btn => {
  btn.addEventListener('click', () => {
    const f = btn.getAttribute('data-format');
    activeFormat = f;

    document.querySelectorAll('.pill[data-format]').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    formatCustomEl.classList.toggle('open', f === 'custom');

    if (f === 'a4p') { outWEl.value = 210; outHEl.value = 297; }
    if (f === 'a4l') { outWEl.value = 297; outHEl.value = 210; }
  });
});

erweiterToggleEl.addEventListener('click', () => {
  const open = erweiterFieldsEl.classList.toggle('open');
  erweiterToggleEl.textContent = open ? 'Erweitert ▴' : 'Erweitert ▾';
  erweiterToggleEl.setAttribute('aria-expanded', String(open));
});

if (dropzoneEl) {
  const prevent = (e) => { e.preventDefault(); e.stopPropagation(); };

  ['dragenter','dragover','dragleave','drop'].forEach((evt) => {
    dropzoneEl.addEventListener(evt, prevent);
  });

  dropzoneEl.addEventListener('dragenter', () => dropzoneEl.classList.add('dragover'));
  dropzoneEl.addEventListener('dragover', () => dropzoneEl.classList.add('dragover'));
  dropzoneEl.addEventListener('dragleave', () => dropzoneEl.classList.remove('dragover'));

  dropzoneEl.addEventListener('drop', async (e) => {
    dropzoneEl.classList.remove('dragover');
    const dt = e.dataTransfer;
    if (!dt) return;

    const files = dt.files;
    if (!files || !files.length) return;

    const f = files[0];
    if (!f || (f.type && f.type !== 'application/pdf')) {
      setStatus('Bitte eine PDF-Datei droppen.', 'err');
      return;
    }

    await handleSelectedFile(f);
  });
}

generateBtn.addEventListener('click', async () => {
  if (!loadedBytes) return;

  if (downloadA.href && downloadA.href.startsWith('blob:')) {
    URL.revokeObjectURL(downloadA.href);
  }
  downloadA.style.display = 'none';
  downloadA.removeAttribute('href');

  const rows = clampInt(rowsEl.value, 1, 20);
  const cols = clampInt(colsEl.value, 1, 20);
  const scaleMode = scaleModeEl.value;

  const marginMm = Math.max(0, Number(marginEl.value) || 0);
  const overlapMm = Math.max(0, Number(overlapEl.value) || 0);

  const marginPt = mmToPt(marginMm);
  const overlapPt = mmToPt(overlapMm);

  try {
    setStatus('Verarbeite PDF …');

    const PDFLib = await loadPdfLib();
    const { PDFDocument } = PDFLib;

    // For maximum reliability we rasterize input pages with pdf.js.
    // This preserves anything the viewer would show: form fields, annotations, optional content (layers), etc.
    const PDFJS = await loadPdfJs();

    // Load source PDF for geometry (page sizes) with pdf-lib
    const srcDoc = await PDFDocument.load(loadedBytes, { ignoreEncryption: false });
    const srcPages = srcDoc.getPages();
    const maxPage = srcPages.length;

    const pageIdx = parsePageRanges(pagesEl.value, maxPage);

    // Load the same PDF into pdf.js for rendering
    setStatus('Rendere PDF (Raster) …');
    const pdfjsDoc = await PDFJS.getDocument({ data: loadedBytes, disableWorker: true }).promise;

    const outDoc = await PDFDocument.create();
    let totalOutPages = 0;

    // Cache rendered PNGs per page index to avoid re-rendering
    const pagePngCache = new Map(); // key: 0-based page index, value: { pngBytes, W, H }

    // Quality: scale 3 means ~216 DPI relative to PDF points (72 dpi baseline). Good for labels.
    const rasterScale = 3;

    for (const pi of pageIdx) {
      const p = srcPages[pi];
      const { width: W, height: H } = p.getSize();

      let cached = pagePngCache.get(pi);
      if (!cached) {
        setStatus(`Rendere Seite ${pi + 1}/${maxPage} …`);
        const pngBytes = await renderPageToPngBytes(pdfjsDoc, pi + 1, rasterScale);
        cached = { pngBytes, W, H };
        pagePngCache.set(pi, cached);
      }

      const img = await outDoc.embedPng(cached.pngBytes);

      const tileW = W / cols;
      const tileH = H / rows;

      let outWPt, outHPt;
      if (activeFormat === 'tile') {
        outWPt = tileW;
        outHPt = tileH;
      } else {
        const wMm = Math.max(1, Number(outWEl.value) || 100);
        const hMm = Math.max(1, Number(outHEl.value) || 150);
        outWPt = mmToPt(wMm);
        outHPt = mmToPt(hMm);
      }

      const innerW = Math.max(1, outWPt - 2 * marginPt);
      const innerH = Math.max(1, outHPt - 2 * marginPt);

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const left = c * tileW - overlapPt;
          const right = (c + 1) * tileW + overlapPt;
          const bottom = (rows - 1 - r) * tileH - overlapPt; // r=0 is top row
          const top = (rows - r) * tileH + overlapPt;

          const clipLeft = Math.max(0, left);
          const clipRight = Math.min(W, right);
          const clipBottom = Math.max(0, bottom);
          const clipTop = Math.min(H, top);

          const clipW = Math.max(1, clipRight - clipLeft);
          const clipH = Math.max(1, clipTop - clipBottom);

          let scale = 1;
          if (scaleMode === 'fit') scale = Math.min(innerW / clipW, innerH / clipH);
          if (scaleMode === 'fill') scale = Math.max(innerW / clipW, innerH / clipH);
          if (scaleMode === '100') scale = 1;

          const drawW = clipW * scale;
          const drawH = clipH * scale;

          const x = marginPt + (innerW - drawW) / 2;
          const y = marginPt + (innerH - drawH) / 2;

          // Draw the FULL page image, but shift it so that the desired clip region lands inside the output page.
          // Anything outside the page boundary is simply not visible, effectively cropping.
          const outPage = outDoc.addPage([outWPt, outHPt]);

          const fullW = W * scale;
          const fullH = H * scale;
          const xImg = x - clipLeft * scale;
          const yImg = y - clipBottom * scale;

          outPage.drawImage(img, { x: xImg, y: yImg, width: fullW, height: fullH });

          totalOutPages++;
        }
      }
    }

    const outBytes = await outDoc.save();
    const blob = new Blob([outBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);

    const baseName = (loadedName || 'input.pdf').replace(/\.pdf$/i, '');
    downloadA.href = url;
    downloadA.download = `${baseName}_tiled.pdf`;
    startDonationCountdown();

    setStatus(`Fertig. Output: ${totalOutPages} Seite(n). (Raster-Modus)`, 'ok');
  } catch (e) {
    console.error(e);
    if (donateIntervalId !== null) { clearInterval(donateIntervalId); donateIntervalId = null; }
    donatePanelEl.hidden = true;
    donatePanelEl.classList.remove('donate-panel--done');
    setStatus(String(e?.message || e), 'err');
  }
});
