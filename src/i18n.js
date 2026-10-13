const EN = {
  'nav.countries': 'Member regions',
  'demo.reset': 'Reset demonstration',
  'results.count': '{count} results',
  'quiz.correct': 'Correct. A defensible action has evidence, an owner and a date.',
  'quiz.retry': 'Not quite. Choose the action that records evidence, ownership and timing.'
};

// Partial French preview: navigation, header controls and section headings only.
// Body content stays in English. A production site would need professional,
// client-approved translation.
const FR = {
  'skip': 'Aller au contenu principal',
  'menu': 'Menu',
  'nav.overview': 'Aperçu',
  'nav.countries': 'Régions membres',
  'nav.tracker': 'Suivi des politiques',
  'nav.knowledge': 'Centre de ressources',
  'nav.learning': 'Apprentissage',
  'nav.participate': 'Participation',
  'nav.staff': 'Espace du personnel',
  'settings.open': 'Paramètres d’accessibilité',
  'h.overview': 'Membres. Données probantes. Progrès partagés.',
  'h.countries': 'Progrès de quatre membres régionaux fictifs',
  'h.tracker': 'Transformer les engagements en progrès visibles',
  'h.knowledge': 'Trouver des ressources pratiques et accessibles',
  'h.learning': 'Des données probantes à l’action responsable',
  'h.participate': 'Découvrir la participation des membres',
  'h.staff': 'Espace de publication protégé',
  'h.performance': 'Conçu pour les connexions limitées',
  'top': 'Retour en haut'
};

export function t(language, key, variables = {}) {
  const template = (language === 'fr' ? FR[key] : undefined) ?? EN[key] ?? key;
  return template.replace(/\{(\w+)\}/g, (_, name) => String(variables[name] ?? ''));
}

// Applies the partial French preview to elements marked with data-i18n.
// The page language stays English; each translated element gets lang="fr"
// so screen readers pronounce it correctly (WCAG 3.1.1 and 3.1.2).
export function applyTranslations(root, language) {
  root.querySelectorAll('[data-i18n]').forEach(element => {
    if (element.dataset.i18nEn === undefined) element.dataset.i18nEn = element.textContent;
    const french = language === 'fr' ? FR[element.dataset.i18n] : undefined;
    if (french) { element.textContent = french; element.setAttribute('lang', 'fr'); }
    else { element.textContent = element.dataset.i18nEn; element.removeAttribute('lang'); }
  });
}
