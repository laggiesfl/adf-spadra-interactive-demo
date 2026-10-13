import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { t } from '../src/i18n.js';
import { applyPreferences } from '../src/accessibility.js';

const read = path => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('primary blue and muted grey meet WCAG AAA 7:1 values', async () => {
  const css = await read('assets/styles.css');
  assert.doesNotMatch(css, /#2f5c9a|#536170/i);
  assert.match(css, /--blue:#1F4E79/);
  assert.match(css, /--muted:#434E5A/);
});

test('focus ring is two-tone so it shows on light and dark backgrounds', async () => {
  const css = await read('assets/styles.css');
  assert.match(css, /outline:3px solid #0b0c0c;outline-offset:3px;box-shadow:0 0 0 3px var\(--focus\)/);
});

test('every data-i18n key in the page has a French translation', async () => {
  const html = await read('index.html');
  const keys = [...html.matchAll(/data-i18n="([^"]+)"/g)].map(m => m[1]);
  assert.ok(keys.length >= 15);
  for (const key of keys) assert.notEqual(t('fr', key), key, `missing French for ${key}`);
});

test('French preview never relabels the whole page as French', () => {
  const root = { dataset: {}, style: { setProperty() {} }, lang: '' };
  applyPreferences(root, { language: 'fr' });
  assert.equal(root.lang, 'en');
  assert.equal(root.dataset.language, 'fr');
});

test('page declares a tab icon so browsers do not request a missing favicon', async () => {
  const html = await read('index.html');
  assert.match(html, /<link rel="icon" href="assets\/favicon.svg"/);
  await read('assets/favicon.svg');
});

test('build-only files are excluded from the public deployment', async () => {
  const ignore = await read('.vercelignore');
  for (const entry of ['.github', 'tests', 'scripts', '.env.example']) assert.match(ignore, new RegExp(`^${entry.replace('.', '\\.')}$`, 'm'));
});

test('labels are honest about sign-in, reset scope and the partial French preview', async () => {
  const html = await read('index.html');
  assert.match(html, /Visitors to this demonstration cannot upload or publish anything/);
  assert.match(html, /Reset my display and learning settings/);
  assert.match(html, /French is partial/);
  assert.doesNotMatch(html, /Reset all demonstration data|Publish a real demonstration resource/);
});
