/* PDF Tiler - local processing only
   Loads pdf-lib either from ./vendor/pdf-lib.min.js (preferred) or from a CDN fallback.
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

const outPresetEl = el('outPreset');
const outWEl = el('outW');
const outHEl = el('outH');
const scaleModeEl = el('scaleMode');
const marginEl = el('margin');
const overlapEl = el('overlap');

let loadedBytes = null;
let loadedName = 'input.pdf';
let PDFLib = null;

function mmToPt(mm) {
  return (mm * 72) / 25.4;
}

function setStatus(msg, kind = '') {
  statusEl.className = 'status' + (kind ? ' ' + kind : '');
  statusEl.textContent = msg;
}

function setFileInfo(msg, kind = '') {
  fileInfoEl.className = 'status' + (kind ? ' ' + kind : '');
  fileInfoEl.textContent = msg;
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

function applyOutPreset() {
  const v = outPresetEl.value;
  const custom = (v === 'custom');
  outWEl.disabled = !custom;
  outHEl.disabled = !custom;

  if (v === 'a4p') { outWEl.value = 210; outHEl.value = 297; }
  if (v === 'a4l') { outWEl.value = 297; outHEl.value = 210; }
  if (v === 'tile') { outWEl.disabled = true; outHEl.disabled = true; }
}

async function loadPdfLib() {
  if (PDFLib) return PDFLib;

  // Prefer locally hosted vendor file
  const localUrl = './vendor/pdf-lib.min.js';
  const cdnUrl = 'https://cdn.jsdelivr.net/npm/pdf-lib@1.17.1/dist/pdf-lib.min.js';

  async function tryLoad(url) {
    return new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = url;
      s.async = true;
      s.onload = () => {
        if (window.PDFLib) resolve(window.PDFLib);
        else reject(new Error('PDFLib nicht gefunden nach Script-Load.'));
      };
      s.onerror = () => reject(new Error('Script konnte nicht geladen werden: ' + url));
      document.head.appendChild(s);
    });
  }

  try {
    PDFLib = await tryLoad(localUrl);
    return PDFLib;
  } catch (e) {
    // fallback to CDN
    PDFLib = await tryLoad(cdnUrl);
    return PDFLib;
  }
}

async function handleSelectedFile(f) {
  downloadA.style.display = 'none';
  downloadA.removeAttribute('href');
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
    generateBtn.disabled = false;
    setStatus('Bereit.');
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
    if (p === '3x3') { rowsEl.value = 3; colsEl.value = 3; }
  });
});

outPresetEl.addEventListener('change', applyOutPreset);
applyOutPreset();

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

    const srcDoc = await PDFDocument.load(loadedBytes, { ignoreEncryption: false });
    const srcPages = srcDoc.getPages();
    const maxPage = srcPages.length;

    const pageIdx = parsePageRanges(pagesEl.value, maxPage);

    const outDoc = await PDFDocument.create();
    let totalOutPages = 0;

    for (const pi of pageIdx) {
      const p = srcPages[pi];
      const { width: W, height: H } = p.getSize();

      const tileW = W / cols;
      const tileH = H / rows;

      let outWPt, outHPt;
      if (outPresetEl.value === 'tile') {
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

          const embedded = await outDoc.embedPage(p, {
            left: clipLeft,
            right: clipRight,
            bottom: clipBottom,
            top: clipTop,
          });

          let scale = 1;
          if (scaleMode === 'fit') scale = Math.min(innerW / clipW, innerH / clipH);
          if (scaleMode === 'fill') scale = Math.max(innerW / clipW, innerH / clipH);
          if (scaleMode === '100') scale = 1;

          const drawW = clipW * scale;
          const drawH = clipH * scale;

          const x = marginPt + (innerW - drawW) / 2;
          const y = marginPt + (innerH - drawH) / 2;

          const outPage = outDoc.addPage([outWPt, outHPt]);
          outPage.drawPage(embedded, { x, y, width: drawW, height: drawH });

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
    downloadA.style.display = 'inline-block';

    setStatus(`Fertig. Output: ${totalOutPages} Seite(n).`, 'ok');
  } catch (e) {
    console.error(e);
    setStatus(String(e?.message || e), 'err');
  }
});
