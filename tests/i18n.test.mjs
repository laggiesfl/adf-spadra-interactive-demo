import test from 'node:test';
import assert from 'node:assert/strict';
import { t } from '../src/i18n.js';

test('translation returns the French label when available', () => assert.equal(t('fr', 'nav.countries'), 'Régions membres'));
test('translation falls back to English for a missing French key', () => assert.equal(t('fr', 'demo.reset'), 'Reset demonstration'));
test('translation substitutes named variables safely', () => assert.equal(t('en', 'results.count', { count: 3 }), '3 results'));
