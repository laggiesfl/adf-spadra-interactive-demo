import { readFile, writeFile } from 'node:fs/promises';

async function replaceIn(path, replacements) {
  let text = await readFile(path, 'utf8');
  for (const [from, to] of replacements) text = text.split(from).join(to);
  await writeFile(path, text, 'utf8');
}

const regional = [
  ['All countries', 'All regions'],
  ['Ghana', 'North Coast Region'],
  ['Benin', 'Central Plains Region'],
  ['Malawi', 'Lakeside Region'],
  ['Zambia', 'Southern Highlands Region']
];

await replaceIn('src/app.js', [
  ...regional,
  ['participating countries', 'fictional regional members'],
  ['Aperçu français illustratif — la production nécessitera une traduction professionnelle approuvée par ADF.', 'Aperçu français illustratif — une production réelle nécessiterait une traduction professionnelle approuvée par l’organisation utilisatrice.']
]);
await replaceIn('src/render.js', [
  ['illustrative country view', 'illustrative member-region view'],
  ['ADF-approved evidence would replace these records in production.', 'Client-approved evidence would replace these fictional records in production.'],
  ['No official ADF file is attached to this sample record.', 'No real organisation file is attached to this fictional sample record.']
]);
await replaceIn('src/state.js', [['spadra-demo-state-v1', 'accessible-member-network-demo-state-v1']]);
await replaceIn('src/walkthrough.js', [
  ['SPADRA at a glance', 'Member network at a glance'],
  ['shared hub and its four participating countries', 'shared hub and its four fictional regional member organisations'],
  ['Country progress', 'Member progress'],
  ['Search accessible resources by country, topic and language.', 'Search accessible resources by region, topic and language.']
]);
await replaceIn('src/i18n.js', [
  ["'nav.countries': 'Countries'", "'nav.countries': 'Member regions'"],
  ["'nav.countries': 'Pays'", "'nav.countries': 'Régions membres'"]
]);
for (const path of ['src/filters.js', 'src/forms.js', 'src/resource-contract.js']) await replaceIn(path, regional);

const testFiles = [
  'tests/filters.test.mjs', 'tests/forms.test.mjs', 'tests/i18n.test.mjs',
  'tests/resource-contract.test.mjs', 'tests/resource-handlers.test.mjs', 'tests/state.test.mjs'
];
for (const path of testFiles) await replaceIn(path, [
  ...regional,
  ['Pays', 'Régions membres'],
  ['spadra-demo-state-v1', 'accessible-member-network-demo-state-v1']
]);

const pkg = JSON.parse(await readFile('package.json', 'utf8'));
pkg.name = 'accessible-member-network-platform';
await writeFile('package.json', `${JSON.stringify(pkg, null, 2)}\n`, 'utf8');

await writeFile('README.md', `# Accessible Member Network Platform\n\nA reusable BeAccessible portfolio demonstration for umbrella organisations that coordinate member organisations. The platform demonstrates regional member profiles, progress and milestone tracking, a policy/programme tracker, a searchable resource library, learning, multilingual preview, low-bandwidth presentation, accessibility settings, and a protected publishing workspace.\n\nAll organisations, records, progress information and resources shown in the public demonstration are fictional and exist solely to demonstrate platform functionality.\n\n## Accessibility\n\nThe interface includes semantic structure, skip navigation, visible focus, keyboard-operable controls, high-contrast support, reduced-motion support, larger-text settings, live status messaging, responsive layouts and low-bandwidth presentation.\n\n## Persistent resources\n\nThe existing serverless API and Airtable integration are retained. Secrets remain in deployment environment variables and are never committed to this repository.\n`, 'utf8');

await writeFile('verification-report.md', `# Accessible Member Network Platform — Verification Record\n\nThis file records verification for the neutral portfolio conversion. It must be updated from actual test and deployment evidence; it must not be treated as proof of a production check by itself.\n\nRequired release checks include: no legacy bid branding in the public interface; fictional-content disclaimer visible; automated tests passing; staff session and resource handlers passing; keyboard and focus behaviour; high contrast; reduced motion; larger text; mobile layout; 200% zoom; and successful public deployment.\n`, 'utf8');

await writeFile('tests/neutral-conversion.test.mjs', `import test from 'node:test';\nimport assert from 'node:assert/strict';\nimport { readFile } from 'node:fs/promises';\n\nconst files = ['index.html', 'src/app.js', 'src/data.js', 'src/render.js', 'src/walkthrough.js'];\nconst read = path => readFile(new URL(\`../\${path}\`, import.meta.url), 'utf8');\n\ntest('public platform contains no legacy bid branding', async () => {\n  const content = (await Promise.all(files.map(read))).join('\\n');\n  assert.doesNotMatch(content, /African Disability Forum|\\bADF\\b|SPADRA|Ghana|Benin|Malawi|Zambia/i);\n});\n\ntest('public platform identifies the neutral demo and required disclaimer', async () => {\n  const html = await read('index.html');\n  assert.match(html, /Accessible Member Network Platform/);\n  assert.match(html, /This is an illustrative platform demonstration created by BeAccessible\\. All organisations, records, progress information and resources shown are fictional and are provided solely to demonstrate platform functionality\\./);\n  assert.match(html, /fictional regional member/i);\n});\n\ntest('regional sentinel labels are neutral', async () => {\n  const content = (await Promise.all(['src/app.js','src/filters.js','src/forms.js','src/resource-contract.js'].map(read))).join('\\n');\n  assert.doesNotMatch(content, /All countries/);\n  assert.match(content, /All regions/);\n});\n`, 'utf8');
