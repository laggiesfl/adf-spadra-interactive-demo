const SCALES = [1, 1.125, 1.25];

export function normalisePreferences(input = {}) {
  return {
    language: input.language === 'fr' ? 'fr' : 'en',
    textScale: SCALES.includes(Number(input.textScale)) ? Number(input.textScale) : 1,
    lowBandwidth: Boolean(input.lowBandwidth),
    highContrast: Boolean(input.highContrast),
    reducedMotion: Boolean(input.reducedMotion)
  };
}

export function applyPreferences(root, input) {
  const p = normalisePreferences(input);
  root.lang = p.language;
  root.dataset.language = p.language;
  root.dataset.lowBandwidth = String(p.lowBandwidth);
  root.dataset.highContrast = String(p.highContrast);
  root.dataset.reducedMotion = String(p.reducedMotion);
  root.style.setProperty('--text-scale', p.textScale);
  return p;
}

export function bindDialog(dialog, opener, closer) {
  let source = opener;
  opener?.addEventListener('click', () => { source = document.activeElement; dialog.showModal(); });
  closer?.addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => source?.focus());
}
