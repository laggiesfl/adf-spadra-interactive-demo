import test from 'node:test';
import assert from 'node:assert/strict';
import { navigateToHash } from '../src/hash-navigation.js';

test('moves to a valid hash target and focuses its heading', () => {
  const calls = [];
  const heading = { setAttribute: (...args) => calls.push(['attribute', ...args]), focus: options => calls.push(['focus', options]) };
  const target = { scrollIntoView: () => calls.push(['scroll']), querySelector: () => heading };
  const documentRef = { getElementById: id => id === 'staff' ? target : null };
  assert.equal(navigateToHash(documentRef, '#staff'), true);
  assert.deepEqual(calls, [['scroll'], ['attribute', 'tabindex', '-1'], ['focus', { preventScroll: true }]]);
});

test('ignores empty and unknown hash targets', () => {
  const documentRef = { getElementById: () => null };
  assert.equal(navigateToHash(documentRef, ''), false);
  assert.equal(navigateToHash(documentRef, '#missing'), false);
});
