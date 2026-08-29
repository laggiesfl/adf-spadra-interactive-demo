import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const files = ['index.html', 'src/app.js', 'src/data.js', 'src/render.js', 'src/walkthrough.js'];
const read = path => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('public platform contains no legacy bid branding', async () => {
  const content = (await Promise.all(files.map(read))).join('\n');
  assert.doesNotMatch(content, /African Disability Forum|\bADF\b|SPADRA|Ghana|Benin|Malawi|Zambia/i);
});

test('public platform identifies the neutral demo and required disclaimer', async () => {
  const html = await read('index.html');
  assert.match(html, /Accessible Member Network Platform/);
  assert.match(html, /This is an illustrative platform demonstration created by BeAccessible\. All organisations, records, progress information and resources shown are fictional and are provided solely to demonstrate platform functionality\./);
  assert.match(html, /fictional regional member/i);
});

test('regional sentinel labels are neutral', async () => {
  const content = (await Promise.all(['src/app.js','src/filters.js','src/forms.js','src/resource-contract.js'].map(read))).join('\n');
  assert.doesNotMatch(content, /All countries/);
  assert.match(content, /All regions/);
});
