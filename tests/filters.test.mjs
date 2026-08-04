import test from 'node:test';
import assert from 'node:assert/strict';
import { filterPolicies, filterResources } from '../src/filters.js';

const policies = [
  { title: 'Inclusive education', summary: 'School access', country: 'Malawi', status: 'On track', framework: 'SDGs' },
  { title: 'Social protection', summary: 'CRPD review', country: 'Ghana', status: 'In progress', framework: 'CRPD' }
];

test('policy filter combines case-insensitive query and selected facets', () => {
  assert.deepEqual(filterPolicies(policies, { query: 'EDUCATION', country: 'Malawi', status: 'All statuses', framework: 'SDGs' }), [policies[0]]);
});

test('policy filter returns an empty list when no record matches', () => {
  assert.deepEqual(filterPolicies(policies, { query: 'missing', country: 'All countries', status: 'All statuses', framework: 'All frameworks' }), []);
});

test('resource filter searches accessible metadata and preserves order', () => {
  const resources = [
    { title: 'Guide', summary: 'Policy evidence', accessibility: 'Plain language', country: 'Ghana', topic: 'Policy', language: 'English', format: 'Guide' },
    { title: 'Brief', summary: 'Rights', accessibility: 'Tagged headings', country: 'Zambia', topic: 'Rights', language: 'English', format: 'Brief' }
  ];
  assert.deepEqual(filterResources(resources, { query: 'tagged', country: 'All countries', topic: 'All topics', language: 'English', format: 'All formats' }), [resources[1]]);
});
