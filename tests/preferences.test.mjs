import test from 'node:test';
import assert from 'node:assert/strict';
import { normalisePreferences } from '../src/accessibility.js';

test('preferences reject unsupported language and text scale', () => {
  assert.deepEqual(normalisePreferences({ language: 'zu', textScale: 5, lowBandwidth: 1 }), { language: 'en', textScale: 1, lowBandwidth: true, highContrast: false, reducedMotion: false });
});

test('preferences preserve supported values', () => {
  assert.deepEqual(normalisePreferences({ language: 'fr', textScale: 1.25, highContrast: true, reducedMotion: true }), { language: 'fr', textScale: 1.25, lowBandwidth: false, highContrast: true, reducedMotion: true });
});
