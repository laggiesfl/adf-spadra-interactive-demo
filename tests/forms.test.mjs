import test from 'node:test';
import assert from 'node:assert/strict';
import { validateJoin, validateStaffRecord, createStaffRecord } from '../src/forms.js';

test('join validation reports name email and consent errors', () => {
  const result = validateJoin({ name: '', email: 'bad', consent: false });
  assert.equal(result.valid, false);
  assert.deepEqual(Object.keys(result.errors), ['name', 'email', 'consent']);
});

test('join validation accepts a complete record', () => {
  assert.deepEqual(validateJoin({ name: 'Demo User', email: 'demo@example.org', consent: true }), { valid: true, errors: {} });
});

test('staff record requires a useful title and summary', () => {
  assert.equal(validateStaffRecord({ title: 'A', summary: 'short' }).valid, false);
});

test('created staff record is explicitly illustrative', () => {
  const record = createStaffRecord({ title: 'New guide', summary: 'A sufficiently useful demonstration summary.', country: 'North Coast Region' }, () => 42);
  assert.equal(record.id, 'staff-42');
  assert.equal(record.demonstration, true);
  assert.equal(record.language, 'English');
});
