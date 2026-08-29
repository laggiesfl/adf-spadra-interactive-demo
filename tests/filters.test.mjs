import test from 'node:test';
import assert from 'node:assert/strict';
import { filterPolicies, filterResources } from '../src/filters.js';

const policies = [
  { title: 'Inclusive education', summary: 'School access', country: 'Lakeside Region', status: 'On track', framework: 'SDGs' },
  { title: 'Social protection', summary: 'CRPD review', country: 'North Coast Region', status: 'In progress', framework: 'CRPD' }
];

test('policy filter combines case-insensitive query and selected facets', () => {
  assert.deepEqual(filterPolicies(policies, { query: 'EDUCATION', country: 'Lakeside Region', status: 'All statuses', framework: 'SDGs' }), [policies[0]]);
});

test('policy filter returns an empty list when no record matches', () => {
  assert.deepEqual(filterPolicies(policies, { query: 'missing', country: 'All regions', status: 'All statuses', framework: 'All frameworks' }), []);
});

test('resource filter searches accessible metadata and preserves order', () => {
  const resources = [
    { title: 'Guide', summary: 'Policy evidence', accessibility: 'Plain language', country: 'North Coast Region', topic: 'Policy', language: 'English', format: 'Guide' },
    { title: 'Brief', summary: 'Rights', accessibility: 'Tagged headings', country: 'Southern Highlands Region', topic: 'Rights', language: 'English', format: 'Brief' }
  ];
  assert.deepEqual(filterResources(resources, { query: 'tagged', country: 'All regions', topic: 'All topics', language: 'English', format: 'All formats' }), [resources[1]]);
});
