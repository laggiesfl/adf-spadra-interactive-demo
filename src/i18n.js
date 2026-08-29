const EN = {
  'nav.countries': 'Member regions',
  'demo.reset': 'Reset demonstration',
  'results.count': '{count} results',
  'quiz.correct': 'Correct. A defensible action has evidence, an owner and a date.',
  'quiz.retry': 'Not quite. Choose the action that records evidence, ownership and timing.'
};
const FR = { 'nav.countries': 'Régions membres' };

export function t(language, key, variables = {}) {
  const template = (language === 'fr' ? FR[key] : undefined) ?? EN[key] ?? key;
  return template.replace(/\{(\w+)\}/g, (_, name) => String(variables[name] ?? ''));
}
